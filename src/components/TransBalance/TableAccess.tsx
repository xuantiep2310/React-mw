import React, { useEffect, useState } from "react";
import { RootState, useAppSelector } from "../../store/configureStore";
import { formatNumber, formatNumberMarket } from "../../utils/util";
import axios from "axios";
import io from 'socket.io-client';
const TableAsset = (props: any) => {
    const {assetReport } = useAppSelector((state) => state.assetReport);
    const [dataTable, setDataTable] = useState([])
    const [dataArrHSX, setArrHSX] = useState<any>([])
    const [dataArrHNX, setArrHNX] = useState<any>([])
    const [short, setShort] = useState(false);
    const [sort, setSort] = useState("asc");
    const [label, setLabel] = useState("");
    const { mode } = useAppSelector((state) => state.settingColorMode);
    useEffect(() => {
        if (props.short)
            setShort(!short);
    }, [props.short]);
    const handleSort = (key: string) => {
        setLabel(key);
        if (sort === "asc") {
            const sorted: any = [...dataTable].sort((a: any, b: any) => {
                if (a[key] === "string" && b[key] === "string") {
                    return a[key].toLowerCase() > b[key].toLowerCase() ? 1 : -1;
                }
                return a[key] > b[key] ? 1 : -1;
            });
            setDataTable(sorted);
            setSort("desc");
        }
        if (sort === "desc") {
            const sorted: any = [...dataTable].sort((a: any, b: any) => {
                if (a[key] === "string" && b[key] === "string") {
                    return a[key].toLowerCase() < b[key].toLowerCase() ? 1 : -1;
                }
                return a[key] < b[key] ? 1 : -1;
            });
            setDataTable(sorted);
            setSort("asc");
        }
    };
    useEffect(() => {
        let arr = assetReport?.Table1?.map((item: any) => item);
        const sorted = arr?.sort((a: any, b: any) =>
            a.ASTOCKCODE > b.ASTOCKCODE ? 1 : -1
        );
        setLabel("ASTOCKCODE");
        setDataTable(sorted);
    }, [assetReport]);
    useEffect(() => {
        dataTable?.forEach((item: any) => {
            const code = item?.Value.StockCode;
            fetchDataHSN(code);
            fetchDataHNN(code)
        });
    }, [dataTable]);
    const fetchDataHSN = async (code: string) => {
        try {
            const { data } = await axios.get(`https://marketstream.fpts.com.vn/hsx/data.ashx?s=quote&l=${code}`)
             data.map((item: any) =>
             setArrHSX((prev: any[]) => [...prev, [item?.Info?.[0][1], "HSX", item?.Info?.[31][1]]])
        )
       } catch (error : any) {
        if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    }
       }
    }
    const fetchDataTable = async () => {
       try {
         const { data } = await axios.get("http://localhost:3111/Data")
         setDataTable(data)
       } catch (error) {
        console.log("loi day ne ")
       }
    }
    const fetchDataHNN = async (code: string) => {
      try {
          const { data } = await axios.get(`https://marketstream.fpts.com.vn/hnx/data.ashx?s=quote&l=${code}`)
          data.map((item: any) =>
          setArrHNX((prev: any[]) => [...prev, [item?.Info?.[12][1], "HNX", item?.Info?.[31][1]]])
        )
      } catch (error) {
        console.log("loi day ne hiu hiu ")
      }
    }
    useEffect(() => {
        fetchDataTable()
    }, [dataTable])
      const mergedData = dataTable?.map((item: any) => {
        const dataHSXItem = dataArrHSX?.filter((dataItem: any) => dataItem[0] === item.Key);
        const dataHNXItem = dataArrHNX?.filter((dataItem: any) => dataItem[0] === item.Key);

        return {
            ...item,
            dataItem: dataHSXItem?.length !== 0 ? dataHSXItem[0] : dataHNXItem?.length !== 0 ? dataHNXItem[0] : []
        };
    });
    useEffect(() => {
        const socketHNX = new WebSocket(
            "wss://eztrade.fpts.com.vn/hnx/signalr/connect?transport=webSockets&clientProtocol=1.5&connectionToken=yWr50kq6iuFWJzRwhs7GR3bBYG%2Blpj7laF9cuG7oMsc4RLrmhYu9N%2Fco3Vl68KnUNXyGX7c5uuHmqFw1J1P1ClWXvR4w%2BXZlFMtR33yYxNAdiR%2FXCJWS%2FxL%2BNGhHlIpB&connectionData=%5B%7B%22name%22%3A%22hubhnx2%22%7D%5D&tid=4"
        );
        const socketHSX = new WebSocket(
            "wss://eztrade.fpts.com.vn/hsx/signalr/connect?transport=webSockets&clientProtocol=1.5&connectionToken=Ie5DGpXarjClrWZQsIjTMksj0n592Jg8BUV9ChfmtVfpZPN%2BU8aMlfo5FVEDmh%2BmsAw3qgXN3peJW%2FeT6K7sNohOuAT6LC3KdklEDxpPxalgGUkNKF30LWa612toMv19&connectionData=%5B%7B%22name%22%3A%22hubhsx2%22%7D%5D&tid=2"
        );
        socketHSX.onopen = () => {
            console.log("WebSocket connection HSX established.");
        };
        socketHNX.onopen = () => {
            console.log("WebSocket connection HNX established.");
        };
        socketHSX.onmessage = (event) => {
            updateQuote(event.data);
        };
        socketHNX.onmessage = (event) => {
            updateQuote(event.data)
        };
        socketHSX.onmessage = (event) => {
        updateQuote(event.data);
        };
        socketHNX.onmessage = (event) => {
        updateQuote(event.data);
        };
        socketHSX.onclose = () => {
            console.log("WebSocket connection closed.");
        };
        socketHNX.onclose = () => {
            console.log("WebSocket connection closed.");
        };
        return () => {
            socketHSX.close();
            socketHNX.close();
        };
    }, []);
     const updateQuote = (objRealtime: string) => {
        try {
            const dataHNXRealTime = JSON.parse(objRealtime);
            if (dataHNXRealTime && dataHNXRealTime.M) {
                const dataM = dataHNXRealTime.M;
                console.log("firstQuote", dataM);
                const arrDatas: any[] = [];
                dataM.forEach((dataLT: any) => {
                    const changeData = JSON.parse(dataLT.A[0].Change);
                    if (Array.isArray(changeData)) {
                        arrDatas.push(changeData);
                    }
                });
                setArrHSX((prevArrHSX: any[]) => prevArrHSX.concat(arrDatas));
                console.log(arrDatas, "change");
            }
        } catch (error) {
            console.error('Error parsing real-time data:', error);
        }
    };
    let totalSum = 0;
    let totalGoc = 0;
    let toTalDk = 0;
    let tongtoTalPC = 0;
    return (
        <div className={`table_detail  mr-5 !h-[614px] mt-5 ${mode}-bg`}>
            {short ? (
                <table>
                    <thead>
                        <tr role="row" className="font-bold bg-[#F3F3F3]">
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs `}
                                style={{ width: "5%" }}
                                onClick={() => handleSort("ASTOCKCODE")}
                            >
                                 <div className={`relative ${mode}-text`}>
                                    Mã CK
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "ASTOCKCODE" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "ASTOCKCODE" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-left pl-1 !text-xs ${mode}-text`}
                                style={{ width: "6.2%" }}
                                onClick={() => handleSort("ATRADING_READY_TOTAL")}
                            >
                                <div className="relative">
                                    SL có thể <br /> đặt bán
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "ATRADING_READY_TOTAL" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "ATRADING_READY_TOTAL" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td
                                rowSpan={2}

                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "6%" }}
                            >
                                <div>SL bán  <br /> chờ khớp</div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "5%" }}
                            >
                                <div>Bán T0</div>
                            </td>
                            <td
                                colSpan={3}

                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "7%" }}
                            >
                                <div>CK mua chờ về</div>
                            </td>
                            <td
                                rowSpan={2}


                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "6%" }}
                            >
                                <div> CK <br /> quyền  <br /> chờ về</div>
                            </td>

                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "5%" }}
                            >
                                <div>Hạn chế</div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-left pl-1 !text-xs ${mode}-text`}
                                style={{ width: "5.7%" }}
                                onClick={() => handleSort("ATOTAL_AMOUNT")}
                            >
                                <div className="relative">
                                    Tổng KL
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "ATOTAL_AMOUNT" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "ATOTAL_AMOUNT" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>

                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text overflow-hidden`}
                                style={{ width: "5%" }}
                                onClick={() => handleSort("AMARKET_VALUE")}
                            >
                                <div className="relative">
                                    Giá TT
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "AMARKET_VALUE" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">

                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">

                                                </span>
                                            </>
                                        ) : label === "AMARKET_VALUE" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "5%" }}
                            >
                                <div>Giá trị <br /> thị trường</div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "6%" }}
                                onClick={() => handleSort("AROOT_VALUE")}
                            >
                                <div className="relative">
                                    Giá TB <br /> tạm tính
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "AROOT_VALUE" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">

                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">

                                                </span>
                                            </>
                                        ) : label === "AROOT_VALUE" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-left pl-1 !text-xs ${mode}-text`}
                                style={{ width: "5.3%" }}
                                onClick={() => handleSort("APROFIT_LOSS_VAL")}
                            >
                                <div className="relative">
                                    Giá trị gốc
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "APROFIT_LOSS_VAL" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "APROFIT_LOSS_VAL" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-left !text-xs ${mode}-text`}
                                style={{ width: "5%" }}
                                onClick={() => handleSort("APROFIT_LOSS_VAL")}
                            >
                                <div className="relative">
                                    Lãi/Lỗ  <br /> dự kiến
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "APROFIT_LOSS_VAL" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "APROFIT_LOSS_VAL" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-left !text-xs ${mode}-text`}
                                style={{ width: "5.8%" }}
                                onClick={() => handleSort("APROFIT_LOSS_RATE")}
                            >
                                <div className="relative">
                                    % Lãi/Lỗ  <br /> dự kiến
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "APROFIT_LOSS_RATE" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "APROFIT_LOSS_RATE" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                        </tr>

                        <tr role="row" className="bg-[#F3F3F3]">

                            <td className={`!text-center font-bold !text-xs ${mode}-text`}>
                                <div>T0</div>
                            </td>
                            <td className={`!text-center font-bold !text-xs ${mode}-text`}>
                                <div>T1</div>
                            </td>
                            <td className={`!text-center font-bold !text-xs ${mode}-text`}>
                                <div>T2</div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {mergedData?.map((item: any, index: number) => {
                            const valuePrice = (item.dataItem[2] * 1000)
                            const totalValue = Number((item?.Value.TotalAmount) * valuePrice)
                            const totalAfter = (totalValue - item.Value.RootValue)
                            const totalPc = ((totalAfter / item.Value.RootValue) * 100);
                            if (totalValue > 0) {
                                totalSum += totalValue
                            };
                            if (item?.Value.RootValue > 0) {
                                totalGoc += item?.Value.RootValue
                            };
                            if (totalAfter) {
                                toTalDk += totalAfter
                            };
                            if (totalPc) {
                                tongtoTalPC += totalPc
                            };
                            return <tr key={item.Key}>
                                <td style={{fontWeight:"700"}} className={`!text-center !text-[#007db7] !cursor-pointer !text-xs ${mode}-text`}>
                                    {item?.Value.StockCode}
                                </td>
                                <td className={`!text-center !text-xs ${mode}-text`}>
                                    {formatNumberMarket(item?.Value.AvailableOrderSecurities)}
                                </td>
                                <td className={`${mode}-text !text-xs`}>
                                    {formatNumberMarket(item?.Value.AvailableOrderSecuritiesMar)}
                                </td>
                                <td className={`${mode}-text !text-xs`}>{item.ABUY_INTRADY}</td>
                                <td className={`${mode}-text !text-xs`}>{item.AT1}</td>
                                <td className={`${mode}-text !text-xs`}>{item.AT2}</td>
                                <td className={`${mode}-text !text-xs`}>
                                    {item.AWAIT_REC_RIGHT}
                                </td>
                                <td className={`${mode}-text !text-xs`}>
                                    {item.AMORTGATE_BANK}
                                </td>
                                <td className={`${mode}-text !text-xs`}>
                                    {formatNumberMarket(item.ATRANSFER_RESTRICTED)}
                                </td>
                                <td className={`${mode}-text !text-xs`}>
                                    {formatNumberMarket(item?.Value.TotalAmount)}
                                </td>
                                <td className={`${mode}-text !text-xs`}>
                                    {formatNumberMarket((item?.dataItem[2] * 1000))}

                                </td>
                                <td className={`${mode}-text !text-xs`}>
                                    {formatNumberMarket(totalValue)}

                                </td>

                                <td
                                    className={`!text-xs `}
                                >
                                    {formatNumberMarket(item?.Value.AveragePrice)}
                                </td>
                                <td
                                    className={`!text-xs `}
                                >
                                    {formatNumberMarket(item?.Value.RootValue)}
                                </td>
                                <td className={`${mode}-text !text-xs ${totalAfter < 0
                                    ? "!text-[#FF0000]"
                                    : "!text-[#00b050]"
                                    }`}>
                                    {formatNumberMarket(totalAfter)}
                                </td>

                                <td className={`${mode}-text !text-xs ${totalPc < 0
                                    ? "!text-[#FF0000]"
                                    : "!text-[#00b050]"
                                    }`}>
                                    {!Number.isNaN(totalPc) ? (totalPc).toFixed(2) : ""}  {!Number.isNaN(totalPc) ? "%" : ""}
                                </td>

                            </tr>

                        })}
                    </tbody>
                    <tfoot>
                        <tr role="row">
                            <td
                                className="!text-center uppercase font-bold !text-xs"
                                colSpan={10}
                            >
                                TỔNG
                            </td>
                            <td className="!text-xs"></td>

                            <td className="font-bold !text-xs">
                                {formatNumberMarket(totalSum)}

                            </td>
                            <td className="font-bold !text-xs">

                            </td>
                            <td
                                className="font-bold !text-xs"
                            >
                                {formatNumber(
                                    totalGoc
                                )}
                            </td>
                            <td
                                className={`!text-xs font-bold ${toTalDk < 0
                                        ? "!text-[#FF0000]"
                                        : "!text-[#00b050]"
                                    }`}
                            >
                                {formatNumber(toTalDk)}

                            </td>
                            <td
                                className={`!text-xs font-bold  ${tongtoTalPC < 0
                                    ? "!text-[#FF0000]"
                                    : "!text-[#00b050]"
                                    }`}
                            >
                                {/* {formatNumber(tongtoTalPC)}
                                % */}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            ) : (
                <table >
                    <thead>
                        <tr role="row" className="font-bold bg-[#F3F3F3] ">
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs !py-4`}
                                style={{ width: "6%" }}
                                onClick={() => handleSort("ASTOCKCODE")}
                            >
                                <div className={`relative ${mode}-text`}>
                                    Mã CK
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "ASTOCKCODE" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "ASTOCKCODE" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "6%" }}
                                onClick={() => handleSort("ATRADING_READY_TOTAL")}
                            >
                                <div className="relative">
                                    SL có thể <br />đặt bán
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "ATRADING_READY_TOTAL" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "ATRADING_READY_TOTAL" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "7%" }}
                            >
                                <div> SL bán <br /> chờ khớp</div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "6%" }}
                            >
                                <div>CK chờ về</div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "5.7%" }}
                                onClick={() => handleSort("ATOTAL_AMOUNT")}
                            >
                                <div className="relative">
                                    Tổng KL
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "ATOTAL_AMOUNT" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "ATOTAL_AMOUNT" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "5%" }}
                            >
                                <div>Giá TT</div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "7%" }}
                                onClick={() => handleSort("AMARKET_VALUE")}
                            >
                                <div className="relative">
                                    Giá trị <br />  thị trường
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "AMARKET_VALUE" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "AMARKET_VALUE" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "5%" }}
                            >
                                <div>Giá TB <br /> tạm tính</div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "7.5%" }}
                                onClick={() => handleSort("AROOT_VALUE")}
                            >
                                <div className="relative">
                                    Giá trị gốc
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "AROOT_VALUE" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "AROOT_VALUE" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "5%" }}
                                onClick={() => handleSort("APROFIT_LOSS_VAL")}
                            >
                                <div className="relative">
                                    Lãi/Lỗ <br /> dự kiến
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "APROFIT_LOSS_VAL" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "APROFIT_LOSS_VAL" && sort === "asc" ? (
                                            <span className="absolute -top-2">
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2">
                                                <i className="fa fa-caret-up" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td
                                rowSpan={2}
                                className={`!text-center !text-xs ${mode}-text`}
                                style={{ width: "5.8%" }}
                                onClick={() => handleSort("APROFIT_LOSS_RATE")}
                            >
                                <div className="relative">
                                    % Lãi/Lỗ  <br /> dự kiến
                                    <span className="absolute translate-y-1/2 top-1/2 right-2">
                                        {label !== "APROFIT_LOSS_RATE" ? (
                                            <>
                                                <span className="absolute top-[65%] -translate-y-[65%]">
                                                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                                                </span>
                                                <span className="absolute -bottom-[65%] translate-y-[65%]">
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </>
                                        ) : label === "APROFIT_LOSS_RATE" && sort === "asc" ? (
                                            <span className="absolute -top-2 !text-[#717171]">
                                                <i className="fa fa-caret-down !text-[#717171]" aria-hidden="true"></i>
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-2 !text-[#717171]">
                                                <i className="fa fa-caret-up !text-[#717171]" aria-hidden="true"></i>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {mergedData?.map((item: any, index: number) => {
                            const valuePrice = item?.dataItem[2] * 1000
                            const totalValue = ((item?.Value.TotalAmount) * valuePrice)
                            const totalAfter = (totalValue - item.Value.RootValue)
                            const totalPc = Number(totalAfter / item.Value.RootValue) * 100;
                            if (totalValue > 0) {
                                totalSum += totalValue
                            };
                            if (item?.Value.RootValue > 0) {
                                totalGoc += item?.Value.RootValue
                            };
                            if (totalAfter) {
                                toTalDk += totalAfter
                            };
                            if (totalPc) {
                                tongtoTalPC += totalPc
                            };
                            return <tr key={item.Key}>
                                <td className={`!text-center cursor-pointer !font-bold !text-[#007DB7] !text-xs ${mode}-text`}>
                                    {item.Value.StockCode}
                                </td>
                                <td className={`${mode}-text !text-xs`}>
                                    {formatNumberMarket(item?.Value.AvailableOrderSecurities)}
                                </td>

                                <td className={`${mode}-text !text-xs`}>
                                    {formatNumberMarket(item?.Value.AvailableOrderSecuritiesMar)}
                                </td>
                                <td className={`${mode}-text !text-xs`}>
                                    {formatNumberMarket(item?.Value.WaitingReceiveRightSecurities)}
                                </td>
                                <td className={`${mode}-text !text-xs`}>
                                    {formatNumberMarket(item?.Value.TotalAmount)}
                                </td>
                                <td className={`${mode}-text !text-xs`}>
                                    {formatNumberMarket((item?.dataItem[2] * 1000))}
                                </td>
                                <td className={`${mode}-text !text-xs`}>
                                    {formatNumberMarket(totalValue)}
                                </td>
                                <td
                                    className={`!text-xs `}
                                >
                                    {formatNumberMarket(item?.Value.AveragePrice)}
                                </td>
                                <td
                                
                                    className={`!text-xs`}
                                >
                                    {formatNumberMarket(item?.Value.RootValue)}
                                </td>
                                <td className={`${mode}-text !text-xs ${totalAfter < 0
                                    ? "!text-[#FF0000]"
                                    : "!text-[#00b050]"
                                    }`}>
                                    {formatNumberMarket(totalAfter)}
                                </td>
                                <td className={`${mode}-text ${totalPc < 0
                                    ? "!text-[#FF0000]"
                                    : "!text-[#00b050]"
                                    }`}>
                                    {!Number.isNaN(totalPc) ? (totalPc).toFixed(2) : ""}  {!Number.isNaN(totalPc) ? "%" : ""}
                                </td>
                            </tr>
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={6} className="!text-center">TỔNG</td>
                            <td className="font-bold "> {formatNumberMarket(totalSum)}</td>
                            <td></td>
                               <td
                                className="font-bold !text-xs"
                            >
                                {formatNumber(
                                    totalGoc
                                )}
                            </td>
                            <td
                                className={`!text-xs font-bold ${toTalDk < 0
                                        ? "!text-[#FF0000]"
                                        : "!text-[#00b050]"
                                    }`}
                            >
                                {formatNumber(toTalDk)}

                            </td>
                            <td>{/* {formatNumber(tongtoTalPC)} % */}</td>
                        </tr>
                    </tfoot>
                </table>
            )}
        </div>
    );
};
export default TableAsset;
