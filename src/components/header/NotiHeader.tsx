import React, {LegacyRef, RefObject, useEffect, useRef, useState } from 'react'
import bankCheckImage from "../../images/notification/bank-check.png";
import coins from "../../images/notification/giftbox.png";
import giftbox from "../../images/notification/giftbox.png";
import other_notification from "../../images/notification/other_notification.png";
import system_update from "../../images/notification/system_update.png";
import TabIcon_Asset from "../../images/notification/TabIcon_Asset.png";
import TabIcon_PlaceOrders from "../../images/notification/TabIcon_PlaceOrders.png";
import payment from "../../images/notification/payment.png";
import withdraw from "../../images/notification/withdraw.png";
import money_bag from "../../images/notification/money-bag.png";
import message from "../../images/notification/message.png";
import transfer from "../../images/notification/transfer.png";
// import investment from "../../images/notification/icon_investment_report_gray.svg";
import arrowRightImage from "../../images/arrow_right-512.png";
import icon_investment_report_gray from '../../images/notification/icon_investment_report_gray.svg'
import { ReportIconSVG } from "../../icons/Report";
import { relative } from "path";
import { Box, IconButton,Tooltip,Popover } from '@mui/material';
import { getMessagingToken, isTokenSentToServer, messaging, onMessageListener, saveToken } from '../firebase/noti/firebase';
import { json } from 'stream/consumers';
import axios from 'axios';
import { List } from 'lodash';
import { AnyGridOptions } from 'ag-grid-community';

interface Noti {
  ACLIENTCODE: string;
  ACONTENT: string;
  ACONTENT_EN: string;
  ADATA: string;
  AID: string;
  AIMAGE: string;
  AREADSTATUS: number;
  ASCHEDULEDATE: string;
  ASOURCE: string;
  ASTATUS: number;
  ASUBCONTENT: string;
  ASUBCONTENT_EN: string;
  ATARGETAPP: string;
  ATITLE: string;
  ATITLE_EN: string;
  ATYPE: number;
  AURL: string;
}

const aspfpt_language = "VN";

const NotiHeader = () => {
    const [anchorEl, setanchorEl] = useState<null | HTMLElement>(null);
    const [openNoti, setOpenNoti] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    const [countNotiUnRead, setCountNotiUnRead] = useState(0);
    const openPopupNoti = Boolean(anchorEl);
    const [currPage, setCurrPage] = useState(0); // storing current page number
    const [prevPage, setPrevPage] = useState(0); // storing prev page number
    const [notiList, setNotiList] = useState<Array<Noti>>([]); // storing list
    const [wasLastList, setWasLastList] = useState(false); // setting a flag to know the last list


    const listInnerRef = useRef<HTMLDivElement>(null);
    const onScroll = () => {
      if (listInnerRef?.current) {
        const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
        if (scrollTop + clientHeight === scrollHeight) {
          // This will be triggered after hitting the last element.
          // API call should be made here while implementing pagination.
          if (scrollTop + clientHeight === scrollHeight) {
            setCurrPage(currPage + 1);
          }
        }
      }
    };

    const handleCloseNoti = () => {
        setanchorEl(null);
      };
    const handleClickNoti = (event: React.MouseEvent<HTMLButtonElement>) => {
      setanchorEl(event.currentTarget);
      setShowTooltip(false);
    };
    const handleClickOnOffNoti = (event: React.MouseEvent<HTMLElement>) => {
      // console.log("clicked")
      // loi : An SSL certificate error occurred when fetching the script
      // https://stackoverflow.com/questions/46275659/register-service-worker-with-http
      //Bật tắt notification

      const checkbox = event.target as HTMLInputElement;
      if (checkbox.checked) {
        // console.log("Đã chọn"););

          //Detecting browser's details
          var nVer = navigator.appVersion;
          var nAgt = navigator.userAgent;
          var browserName = navigator.appName;
          var fullVersion = '' + parseFloat(navigator.appVersion);
          var majorVersion = parseInt(navigator.appVersion, 10);
          var nameOffset, verOffset, ix;

          // In Opera, the true version is after "Opera" or after "Version"
          if ((verOffset = nAgt.indexOf("Opera")) !== -1) {
              browserName = "Opera";
              fullVersion = nAgt.substring(verOffset + 6);
              if ((verOffset = nAgt.indexOf("Version")) !== -1)
                  fullVersion = nAgt.substring(verOffset + 8);
          }
          // In MSIE, the true version is after "MSIE" in userAgent
          else if ((verOffset = nAgt.indexOf("MSIE")) !== -1) {
              browserName = "Microsoft Internet Explorer";
              fullVersion = nAgt.substring(verOffset + 5);
          }
          // In Chrome, the true version is after "Chrome"
          else if ((verOffset = nAgt.indexOf("Chrome")) !== -1) {
              browserName = "Chrome";
              fullVersion = nAgt.substring(verOffset + 7);
          }
          // In Safari, the true version is after "Safari" or after "Version"
          else if ((verOffset = nAgt.indexOf("Safari")) !== -1) {
              browserName = "Safari";
              fullVersion = nAgt.substring(verOffset + 7);
              if ((verOffset = nAgt.indexOf("Version")) !== -1)
                  fullVersion = nAgt.substring(verOffset + 8);
          }
          // In Firefox, the true version is after "Firefox"
          else if ((verOffset = nAgt.indexOf("Firefox")) !== -1) {
              browserName = "Firefox";
              fullVersion = nAgt.substring(verOffset + 8);
          }
          // In most other browsers, "name/version" is at the end of userAgent
          else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
              (verOffset = nAgt.lastIndexOf('/'))) {
              browserName = nAgt.substring(nameOffset, verOffset);
              fullVersion = nAgt.substring(verOffset + 1);
              if (browserName.toLowerCase() == browserName.toUpperCase()) {
                  browserName = navigator.appName;
              }
          }
          // trim the fullVersion string at semicolon/space if present
          if ((ix = fullVersion.indexOf(";")) !== -1)
              fullVersion = fullVersion.substring(0, ix);
          if ((ix = fullVersion.indexOf(" ")) !== -1)
              fullVersion = fullVersion.substring(0, ix);

          majorVersion = parseInt('' + fullVersion, 10);
          if (isNaN(majorVersion)) {
              fullVersion = '' + parseFloat(navigator.appVersion);
              majorVersion = parseInt(navigator.appVersion, 10);
          }

          if (browserName === "Chrome" || browserName === "Firefox" || browserName === "Opera") {
              navigator.permissions.query({ name: 'notifications' }).then(function (result) {
                  const channelActive = new BroadcastChannel("notificationActive");
                  if (result.state === 'granted') {
                      const tokenNoti = localStorage.getItem('tokenNoti');
                      if (tokenNoti) {
                          saveToken(tokenNoti);
                          channelActive.postMessage({ active: 0 });
                      } else {
                          getMessagingToken();
                          channelActive.postMessage({ active: 0 });
                      }
                  } else if (result.state === 'prompt') {
                    if (messaging) {
                      messaging.requestPermission().then(function () {
                        if (isTokenSentToServer()) {
                            console.log("already granted");
                        }
                        else {
                            getMessagingToken();
                            channelActive.postMessage({ active: 0 });
                        }

                      });
                    }
                  }
                  // Don't do anything if the permission was denied.
              });
          }
          else {
              alert("Notifications không khả dụng với trình duyệt của bạn. Vui lòng sử dụng Google Chrome hoặc Firefox!");
              // $(".container-bell").hide();
              return;
          }

      } else {
        // console.log("Không được chọn");
        saveToken("");
      }

    };

    // useEffect(() => {
    //   //getMessagingToken();

    //   //get notiunread
    //   axios.post(`http://eztrade0.fpts.com.vn/api/ApiData/NotiSentGet`, {
    //     Pagesize: 15,
    //     Pageindex: currPage
    //   })
    //       .then((response: any) => {
    //           setNoti(response?.data?.Data?.Table || []);
    //           console.log(JSON.stringify(response?.data?.Data?.Table));
    //       })
    //       .catch((error) => {
    //           console.error(error);
    //       });
      
    // },[])

    useEffect(() => {
      const fetchData = async () => {
        const response = await axios.post(`http://eztrade0.fpts.com.vn/api/ApiData/NotiSentGet`, {
          Pagesize: 15,
          Pageindex: currPage
        })
        if (!response.data.Data.Table.length) {
          setWasLastList(true);
          return;
        }
        setPrevPage(currPage);
        setNotiList([...notiList, ...response.data.Data.Table]);
      };
      if (!wasLastList && prevPage !== currPage) {
        fetchData();
      }
    }, []);
    
    // useEffect(() => {
    //   onMessageListener().then(data => {
    //       console.log("Receive foreground: ",data)
    //   })
    // })
    // useEffect(() => {
    //   getMessagingToken();
    //   const channel = new BroadcastChannel("notifications");
    //   channel.addEventListener("message", (event) => {
    //     console.log("Receive background: ", event.data);
    //   });
    // },[])

  return (
    <Box className="eztrade__notification">
            <IconButton
              id="basic-button"
              aria-controls={openNoti ? "basic-menu1" : undefined}
              aria-haspopup="true"
              aria-expanded={openNoti ? "true" : undefined}
              onClick={handleClickNoti}
              style={{position: "relative"}}
            >
              <Box
                id="selectSrvdiv"
                className="gb_srvNoti "
                style={{ display: anchorEl ? "block" : "none" }}
              ></Box>
              <i className="fa fa-bell text-large text-iconNoti" aria-hidden="true"></i>
              <span className="bell_count hidden__elem flex absolute top-0.5 right-1" id="bellCount" style={{ display: anchorEl || countNotiUnRead === 0? "none" :"" }}>
                <span className="noti__value" id="notificationsCountValue">{countNotiUnRead}</span>
              </span>
              <div id="tooltip-exchange" style={{zIndex: 99, position: 'absolute', right: '-51px', top: '29px', display: !showTooltip ? "none" :""}}>
                <div style={{zIndex: 4, position: 'relative'}} id="spnTextTooltip" className='text-spnTitlePanelBottom'>
                  <span className='bg-spnTitlePanelBottom text-13px' style={{color: 'white', padding: '8px 5px', borderRadius: '5px', boxShadow: '3px -2px 8px 1px #888'}}>
                    Bật để nhận thông báo
                  </span>
                  <div id="selectSrvdiv" className="gb_srv" style={{top: '0px', left: '66px', borderBottomColor: '#2371af'}} />
                </div>
              </div>
            </IconButton>
          <Popover
            id="basic-menu1"
            anchorEl={anchorEl}
            open={openPopupNoti}
            onClose={handleCloseNoti}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            PaperProps={{
              style: { width: "410px", top: "40px !important" },
            }}
          >
            <div
              className="notification__togglelyout"
              id="notiLayoutToggle"
              style={{ display: "block" }}
            >
              <div
                id="selectSrvdiv"
                className="gb_srv"
                style={{ top: "-10px", right: "137px", left: "unset" }}
              />
              <div className="clearfix" />
              <div className="notification__togglelyout__header">
                <div className="clearfix noti__header h-10">
                  <div className="rfloat">
                    <div className="header__action__floatR"></div>
                  </div>
                  <div className="flex justify-between ">
                    <h4
                      className="header__title mt-2 mb-2.5 float-left font-semibold"
                      aria-hidden="true"
                    >
                      Thông báo
                    </h4>
                    <div className="btn__switchNoti mt-1.5 mb-2.5 font-semibold float-right">
                      <div className="groupSwitch">
                        <span>Bật/tắt thông báo: </span>
                        <label className="switch switchNoti" id="switchLabel">
                          <input type="checkbox" id="ckNotification" onClick={handleClickOnOffNoti}/>
                          <span className="slider round" id="spnNoti">
                            <span className="on">Bật</span>
                            <span className="off">Tắt</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="notification__content">
                <div
                  className="content__area scrollable__area"
                  id="scrollpagination"
                  onScroll={onScroll}
                  ref={listInnerRef}
                >
                  <ul id="contentLoader">
                    {notiList.map((item)=>{
                      if (aspfpt_language == "VN") {
                        var titleLang = item.ATITLE;
                        var contentLangM = !item.ACONTENT ? item.ACONTENT : item.ACONTENT.replaceAll("\r\n", "<br>");
                        var contentLangS = item.ACONTENT;
                      }
                      else {
                          var titleLang = item.ATITLE_EN;
                          var contentLangM = !item.ACONTENT_EN ? item.ACONTENT_EN : item.ACONTENT_EN.replaceAll("\r\n", "<br>");
                          var contentLangS = item.ACONTENT_EN;
                      }

                      //Lấy thời gian tooltip & thời gian noti
                      var creDate = new Date(item.ASCHEDULEDATE.toString()).getTime();
                      // var d = new Date(parseFloat(creDate));
                      // var hours = d.getHours();
                      // var minutes = "0" + d.getMinutes();
                      // var tooltipTime = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + hours + ':' + minutes.substr(-2);
                      // var date = new Date((item.ASCHEDULEDATE || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
                      //     diff = (((new Date(dateTimeSys)).getTime() - date.getTime()) / 1000),
                      //     day_diff = Math.floor(diff / 86400),
                      //     getMonth = date.getMonth() + 1,
                      //     dateFill = date.getDate() + "/" + getMonth + "/" + date.getFullYear();

                      //week_diff = Math.floor(day_diff / 30);
                      // if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
                      //     return;

                    var img = "";
                    
                    if (item.ATYPE === 1) { // Khớp lệnh
                      img = TabIcon_PlaceOrders
                    }
                    else if (item.ATYPE === 3) {	// Chuyển tiền
                      img = TabIcon_Asset
                    }
                    else if (item.ATYPE === 1002) {	// Khớp lệnh thỏa thuận - TRADE
                      img = TabIcon_PlaceOrders
                    }
                    else if (item.ATYPE === 8000) {	// Thông báo hệ thống - TRADE
                      img = system_update
                    }
                    else if (item.ATYPE === 8500) {	// Thông báo hệ thống - ALL
                      img = system_update
                    }
                    else if (item.ATYPE === 9000) {	// Thông báo hệ thống - FUTURES
                      img = system_update
                    }
                    else if (item.ATYPE === 9100) {	// Khác - TRADE
                      img = other_notification
                    }
                    else if (item.ATYPE === 9200) {	// Khác - FUTURES
                      img = other_notification
                    }
                    else if (item.ATYPE === 9300) {	// Khác - ALL
                      img = other_notification
                    }
                    else if (item.ATYPE === 9400) {	// Báo cáo TVDT - TRADE
                      // img = icon_investment_report_gray
                    }
                    else if (item.ATYPE === 9500) {	// Chương trình KM cho KH MTK mới - TRADE
                      img = giftbox
                    }
                    else if (item.ATYPE === 2000) {	// Nộp tiền - TRADE
                      img = payment
                    }
                    else if (item.ATYPE === 2001) {	// Rút/chuyển tiền - TRADE
                      img = withdraw
                    }
                    //-------------------------------------------------------- Noti EzCustody ----------------------------------------------------------//

                    else if (item.ATYPE === 2100) {	// Lưu ký cổ phiếu giao dịch - TRADE
                      img = coins
                    }	
                    else if (item.ATYPE === 2101) {	// Rút LK cổ phiếu giao dịch - TRADE
                      img = TabIcon_Asset
                    }	
                    else if (item.ATYPE === 2102) {	// Phân bổ quyền tiền - TRADE
                      img = money_bag
                    }	
                    else if (item.ATYPE === 2103) {	// Thanh toán chứng quyền đáo hạn - TRADE
                      img = money_bag
                    }	
                    else if (item.ATYPE === 2104) {	// Phân bổ quyền CTCP/CP thưởng - TRADE
                      img = coins
                    }	
                    else if (item.ATYPE === 2105) {	// Thực hiện quyền mua - TRADE
                      img = message
                    }	
                    else if (item.ATYPE === 2106) {	// Phân bổ quyền mua - TRADE
                      img = coins
                    }	
                    else if (item.ATYPE === 2107) {	// Phân bổ quyền chuyển sàn - TRADE
                      img = transfer
                    }	
                    else if (item.ATYPE === 2108) {	// Rút hoán đổi/chuyển đổi - TRADE
                      img = transfer
                    }	
                    else if (item.ATYPE === 2109) {	// Phân bổ quyền hoán đổi/chuyển đổi - TRADE
                      img = transfer
                    }

                    //-------------------------------------------------------- /Noti EzCustody ----------------------------------------------------------//
                    else if (item.ATYPE === 6000) {	// Nộp tiền phái sinh - FUTURES
                      img = payment
                    }
                    else if (item.ATYPE === 6001) {	// Rút tiền phái sinh - FUTURES
                      img = payment
                    }
                    else if (item.ATYPE === 1400) {	// Kích hoạt lệnh ezstoploss thành công - TRADE
                      img = TabIcon_PlaceOrders
                    }
                    else if (item.ATYPE === 1401) {	// Kích hoạt lệnh ezstoploss thất bại - TRADE
                      img = TabIcon_PlaceOrders
                    }
                    else {
                      img = other_notification
                    }
                    
                     return  (
                        <li>
                        <div className="anchorContainer">
                          <div className="content__loadmore">
                            <div className="img__content__lfloat">
                            <img src={img} alt='img noti'/>
                            </div>
                            <div className="content__detail">
                              <div className="con__detail__title">
                                <span className="content__detail__title">
                                    {titleLang}
                                  <span />
                                </span>
                              </div>
                              <div className="content__detail__content content__detail__content__short">
                                <span className="con__detail__con contentLangS">
                                {contentLangS}
                                </span>
                                <span
                                  className="con__detail__con contentLangM"
                                  style={{ display: "none" }}
                                >
                                  {contentLangM}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="content__timestamp">
                            <div
                              className="content__loaddetails"
                              id="contentLoadMore"
                            >
                              <a
                                href= {item.AURL}
                                target="_blank"
                                style={{display: item.AURL && item.AURL != "https://eztrade3.fpts.com.vn/notifications" ? "" : "none"}}
                              >
                                <img src={arrowRightImage} />
                              </a>    
                            </div>
                            <span className="timer" title={item.ASCHEDULEDATE}>
                              6 giờ
                            </span>
                          </div>
                        </div>
                      </li>
                      )
                    }
                    )}
                  
                  </ul>
                  <div
                    id="loading"
                    style={{ display: "none", textAlign: "center" }}
                  >
                    <img
                      src="/images/Loadinggif.gif"
                      style={{ width: "32px", height: "32px" }}
                    />
                  </div>
                </div>
              </div>
              <div className="notification__seemore h-40 flex justify-center">
                <a href="/notifications" target="_blank" className="flex">
                  <span className="text-textNoti mx-auto my-auto">
                    Xem tất cả
                  </span>
                </a>
              </div>
            </div>
          </Popover>
        </Box>
  )
}

export default React.memo(NotiHeader)