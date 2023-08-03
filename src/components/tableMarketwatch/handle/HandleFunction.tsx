import React from "react";
import { useAppDispatch } from "../../../store/configureStore";
import { dispatchDataTable } from "../orderComanSlice";
import { statusChartMarketwatch } from "../../chartMarketwatch/chartMarketwatchSlice";

const HandleFunction = () => {
  const dispatch = useAppDispatch();
  
  const handleClick = (dataTable: any) => {
    // console.log("dataTable ii",dataTable)
    dispatch(dispatchDataTable(dataTable));
  };

  const handleClickBuy = (dataTable: any) => {
    // console.log("dataTable",dataTable)
  };

  const handleDoubleClick = (e: any, val: any) => {
    if (e.detail === 2) {
      dispatch(statusChartMarketwatch(val));
    }
  };

  return [handleClick, handleClickBuy, handleDoubleClick];
};

export default HandleFunction;
