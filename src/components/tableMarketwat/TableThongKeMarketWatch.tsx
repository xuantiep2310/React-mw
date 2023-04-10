import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { stocks } from "../../models/marketwacthTable";

const TableThongKeMarketWatch = () => {
    const [products, setProducts] = useState([]);

    const params = useParams<{ id: string }>()
    const paramstock  = stocks.find(
      paramstock => paramstock.id === params.id
    )
    useEffect(()=>{
        if(paramstock){
         if(paramstock.id){
           fetchTable(paramstock.id)
         }
         else{
           fetchTable("HNX")
         }
        }
       },[paramstock?.id])
      //console.log(products)
     // useEffect(()=>{
     //     dispatch(fetchTableHNXAsync())
     //     //dispatch(fetchStatusAsync())
     // },[dispatch])
     
     const fetchTable = async(param:string) => {
       let valueParam ="thong-ke-index";
        switch(param) {
         case "thong-ke-index":
           valueParam= "s=bi";
           break;
           case "thong-ke-gia":
             valueParam = "s=bi";
             break;
        
           default:
             break;
        }
         const res = await fetch(`http://marketstream.fpts.com.vn/hnx/data.ashx?${valueParam}`);
         const data = await res.json();
         setProducts(data)
       }
  return (
    <div>
      <div
        id="dvSTTIndex"
        className="col-xs-12 col-sm-12 col-priceboard"
        style={{}}
      >
        <div
          className="form-group col-xs-2 col-sm-2 col-priceboard div-group-stt-price"
          style={{}}
        >
          <label className="label_price col-priceboard">Sàn</label>
          <select className="col-xs-8 col-sm-8 input" id="slCenterHIST_INDEX">
            <option label="HOSE" value={1}>
              HOSE
            </option>
            <option label="HNX" value={2}>
              HNX
            </option>
            <option label="UPCOM" value={4}>
              UPCOM
            </option>
            <option label="VN30" value={5}>
              VN30
            </option>
            <option label="HNX30" value={6}>
              HNX30
            </option>
          </select>
        </div>
        <div
          className="form-group col-xs-2 col-sm-2 col-priceboard div-group-stt-price"
          style={{}}
        >
          <label className="label_price col-priceboard">Đợt</label>
          <select className="col-xs-8 col-sm-8 input" id="slSessionHIST_INDEX">
            <option label="Tất cả" value={0}>
              Tất cả
            </option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
        <div
          className="form-group col-xs-2 col-sm-2 col-priceboard div-group-stt-price"
          style={{}}
        >
          <label className="label_price col-priceboard">Từ ngày</label>
          <input
            type="text"
            className="col-xs-8 col-sm-8 input ipDatePicker"
            id="ipStartDateHIST_INDEX"
          />
        </div>
        <div
          className="form-group col-xs-2 col-sm-2 col-priceboard div-group-stt-price"
          style={{}}
        >
          <label className="label_price col-priceboard">Đến ngày</label>
          <input
            type="text"
            className="col-xs-8 col-sm-8 input ipDatePicker"
            id="ipEndDateHIST_INDEX"
          />
        </div>
        <div className="form-group col-xs-2 col-sm-2 col-priceboard" style={{}}>
          <button
            className="btn btn-success button_Statistics"
            id="btnViewHIST_INDEX"
          >
            Xem
          </button>
          <button
            className="btn btn-success button_Statistics"
            id="btnExportHIST_INDEX"
          >
            Excel
          </button>
        </div>
      </div>
      <table
        id="tbHIST_INDEX"
        className="table table-PT table-bordered table-priceboard"
      >
        <thead style={{}}>
          <tr>
            <th className="hbrb" rowSpan={2}>
              Ngày
            </th>
            <th className="hbrb" rowSpan={2}>
              Đợt
            </th>
            <th className="hbrb" rowSpan={2}>
              Index
            </th>
            <th className="hbrb" colSpan={2}>
              Thay đổi Index
            </th>
            <th className="hbrb" rowSpan={2}>
              Tổng GTGD
            </th>
            <th className="hbrb" colSpan={2}>
              Thay đổi GTGD
            </th>
            <th className="hbrb" rowSpan={2}>
              Tổng KLGD
            </th>
            <th className="hbrb" colSpan={2}>
              Thay đổi KLGD
            </th>
          </tr>
          <tr>
            <th className="hb_b">+/-</th>
            <th className="hbrb">%</th>
            <th className="hb_b">+/-</th>
            <th className="hbrb">%</th>
            <th className="hb_b">+/-</th>
            <th className="hbrb">%</th>
          </tr>
        </thead>
        <tbody>{/*Content*/}</tbody>
      </table>
    </div>
  );
};

export default TableThongKeMarketWatch;