import React, { useEffect, useRef, useState } from "react";
import "./table.scss";
import { formatNumber, listDataCompany } from "../../utils/util";
import {
  useAppSelector,
  RootState,
  useAppDispatch,
} from "../../store/configureStore";

const TableGDTTMarketWatch = () => {
  // CHeck Floor
  const { keyMenu, nameMenu } = useAppSelector(
    (state: RootState) => state.menuBar
  );
  const dispath = useAppDispatch();
  const prices = useAppSelector((state: RootState) => state.table.DataBi);
  const products = useAppSelector((state: RootState) => state.table.DataPt);
  const floor = useAppSelector((state: RootState) => state.table.NameFloor);
  const [valueInput, setValueInput] = useState<any>("");
  const [dataFilter, setDataFilter] = useState<any>([]);
  const [inputFilter, setInputFilter] = useState<any>([]);
  const [focus, setFocus] = useState(false);
  const [iFloor, setIFloor] = useState<any>(floor);
  console.log(products);
  const [listDataStockCode, setListDataStockCode] = useState<any>({
    HA: [],
    HO: [],
    UPCOM: [],
  });
  // Lọc mã theo sàn
  useEffect(() => {
    let listDataStockCodeHa: any = [];
    let listDataStockCodeHo: any = [];
    let listDataStockCodeUpcom: any = [];
    listDataCompany?.map((item) => {
      if (item.Ex === "HA") {
        listDataStockCodeHa.push(item.stock_code);
      } else if (item.Ex === "HO") {
        listDataStockCodeHo.push(item.stock_code);
      } else if (item.Ex === "UP") {
        listDataStockCodeUpcom.push(item.stock_code);
      }
    });
    setListDataStockCode({
      ...listDataStockCode,
      HA: listDataStockCodeHa,
      HO: listDataStockCodeHo,
      UPCOM: listDataStockCodeUpcom,
    });
  }, [listDataCompany]);

  useEffect(() => {
    if (keyMenu === 2 && nameMenu === "Giao dịch thỏa thuận") {
      setIFloor("upcom");
    } else {
      setIFloor(floor);
    }
  }, [dispath, floor, keyMenu, nameMenu]);

  // Gán data product vào biến
  useEffect(() => {
    if (iFloor === "HSX") {
      setDataFilter(products);
    }
  }, [iFloor, products]);

  // Lọc data theo sàn
  const filterData = (value: any) => {
    const filteredData = dataFilter?.filter((item: any) => {
      return floor === "HSX"
        ? item.Info[1][1].includes(value.toUpperCase())
        : item.Info[0][1].includes(value.toUpperCase());
    });

    setDataFilter(filteredData);

    const uniqueValues = new Set(
      filteredData?.map((item: any) =>
        floor === "HSX" ? item.Info[1][1] : item.Info[0][1]
      )
    );

    const uniqueValuesArray = Array.from(uniqueValues);
    setInputFilter(uniqueValuesArray);
  };

  // Lọc data theo mã
  useEffect(() => {
    filterData(valueInput);
  }, [valueInput]);
  // const test = dataFilter?.filter((item: any) => {
  //   return listDataStockCode.UPCOM.includes(item.Info[0][1]);
  // });

  return (
    <div id="dvFixedH">
      <div className="border-t dvContentLP border-borderHeadTableMarket">
        <div className="grid grid-cols-4 p-3">
          <div className="relative flex flex-col items-center">
            <div className="relative h-auto max-w-min">
              <label
                className={`${
                  focus || valueInput !== ""
                    ? "inputTableGDTT text-white"
                    : "top-[50%] -translate-y-[50%] "
                } absolute bg-[#131722] text-gray-600 text-[11px] ml-1 px-1 leading-[8px] cursor-text `}
                htmlFor="maCk"
              >
                {focus || valueInput !== "" ? "Mã" : "Nhập mã cần tìm"}
              </label>
              <input
                className="h-24 bg-[#131722] focus:border-white col-span-1 pl-1 border outline-none w-44 border-borderBodyTableMarket text-white text-[11px]"
                onChange={(e: any) => {
                  setValueInput(e.target.value);
                }}
                value={valueInput}
                name="maCk"
                id="maCk"
                onFocus={() => {
                  setFocus(true);
                }}
                onBlur={() => {
                  setFocus(false);
                }}
              ></input>
            </div>
            <div
              className={`${
                focus
                  ? "absolute top-[25px] flex flex-col items-start w-full max-h-[200px] overflow-y-auto text-white bg-[#1e1e1e] border border-[#3d414b]"
                  : "hidden"
              } `}
            >
              {inputFilter.length > 0 &&
                inputFilter?.map((item: any) => (
                  <span
                    key={item}
                    className="cursor-pointer leading-[24px] text-left px-[7px] text-xs hover:bg-[#9e9e9e] whitespace-nowrap w-full"
                    onMouseDown={() => {
                      setValueInput(item);
                    }}
                  >
                    {item}
                  </span>
                ))}
            </div>
          </div>
          {/* check floor  */}
          {prices ? (
            floor === "HSX" ? (
              <div className="flex justify-around col-span-2 pt-1 font-bold">
                <span>
                  Tổng KL GDTT :
                  <label>
                    {" "}
                    {parseFloat(
                      prices[4]?.f240.replace(/,/g, "")
                    ).toLocaleString()}
                  </label>
                </span>
                <span>
                  Tổng KL GDTT :{" "}
                  <label>
                    {" "}
                    {parseFloat(
                      prices[4]?.f241.replace(/,/g, "")
                    ).toLocaleString()}
                  </label>
                </span>
              </div>
            ) : (
              <div className="flex justify-around col-span-2 pt-1 font-bold">
                <span>
                  Tổng KL GDTT :
                  <label>
                    {" "}
                    {parseFloat(
                      prices[2]?.f240.replace(/,/g, "")
                    ).toLocaleString()}
                  </label>
                </span>
                <span>
                  Tổng KL GDTT :{" "}
                  <label>
                    {" "}
                    {parseFloat(
                      prices[2]?.f241.replace(/,/g, "")
                    ).toLocaleString()}
                  </label>
                </span>
              </div>
            )
          ) : (
            " "
          )}

          <div className="col-span-1"></div>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-1 pr-2">
            <table
              id="tbBuyPT_HA"
              className="table w-full table-PT table-bordered table-priceboard"
            >
              <thead style={{}}>
                <tr>
                  <th
                    className="hbrc text-textHeaderTableGDTT text-[13px] font-normal "
                    colSpan={4}
                  >
                    Chào mua
                  </th>
                </tr>
                <tr>
                  <th className="hbrb">Mã</th>
                  <th className="hb_b">Giá</th>
                  <th className="hbrb">KL</th>
                  <th className="hbrb">Mã CTCK</th>
                </tr>
              </thead>
              <tbody id="tbdPT_HA" />
            </table>
          </div>
          <div className="col-span-2 px-2">
            <table
              id="tbBuyPT_HA"
              className="table w-full table-PT table-bordered table-priceboard"
            >
              <thead style={{}}>
                <tr>
                  <th
                    className="hbrc text-textHeaderTableGDTT text-[13px] font-normal"
                    colSpan={5}
                  >
                    Thực hiện
                  </th>
                </tr>
                <tr>
                  <th className="hbrb">Mã</th>
                  <th className="hb_b">Giá</th>
                  <th className="hbrb">KL</th>
                  <th className="hbrb">Tổng KL</th>
                  <th className="hbrb">Tổng GT</th>
                </tr>
              </thead>
              {iFloor === "HSX"
                ? dataFilter != null && (
                    <tbody id="tbdPT_HA">
                      {dataFilter.length > 0
                        ? dataFilter?.map((product: any) => (
                            <tr
                              key={product.RowID}
                              className={`${
                                product.Info[5][1] === product.Info[4][1]
                                  ? "text-[#66CCFF]"
                                  : product.Info[5][1] === product.Info[2][1]
                                  ? "text-[#F7FF31]"
                                  : product.Info[5][1] === product.Info[3][1]
                                  ? "text-[#FF00FF]"
                                  : product.Info[5][1] > product.Info[4][1] &&
                                    product.Info[5][1] < product.Info[2][1]
                                  ? "text-[#FF0000]"
                                  : "text-[#00FF00]"
                              }`}
                            >
                              <td>{product.Info[1][1]}</td>
                              <td className="text-right">
                                {formatNumber(product.Info[5][1])}
                              </td>
                              <td className="text-right">
                                {formatNumber(product.Info[6][1])}
                              </td>
                              <td className="text-right text-white">
                                {formatNumber(product.Info[7][1])}
                              </td>
                              <td className="text-right text-white">
                                {product.Info[8][1].toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  )
                : iFloor === "HNX"
                ? dataFilter != null && (
                    <tbody id="tbdPT_HA">
                      {dataFilter.length > 0
                        ? dataFilter?.map((product: any) => (
                            <tr
                              key={product.RowID}
                              className={`${
                                product.Info[7][1] === product.Info[2][1]
                                  ? "text-[#66CCFF]"
                                  : product.Info[7][1] === product.Info[1][1]
                                  ? "text-[#F7FF31]"
                                  : product.Info[7][1] === product.Info[3][1]
                                  ? "text-[#FF00FF]"
                                  : product.Info[7][1] > product.Info[2][1] &&
                                    product.Info[7][1] < product.Info[1][1]
                                  ? "text-[#FF0000]"
                                  : "text-[#00FF00]"
                              }`}
                            >
                              <td>{product.Info[0][1]}</td>
                              <td className="text-right">
                                {formatNumber(product.Info[7][1])}
                              </td>
                              <td className="text-right">
                                {formatNumber(product.Info[6][1])}
                              </td>
                              <td className="text-right text-white">
                                {formatNumber(product.Info[8][1])}
                              </td>
                              <td className="text-right text-white">
                                {product.Info[9][1].toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  )
                : dataFilter != null && (
                    <tbody id="tbdPT_HA">
                      {dataFilter.length > 0
                        ? dataFilter?.map((product: any) => (
                            <tr
                              key={product.RowID}
                              className={`${
                                product.Info[5][1] === product.Info[4][1]
                                  ? "text-[#66CCFF]"
                                  : product.Info[5][1] === product.Info[2][1]
                                  ? "text-[#F7FF31]"
                                  : product.Info[5][1] === product.Info[3][1]
                                  ? "text-[#FF00FF]"
                                  : product.Info[5][1] > product.Info[4][1] &&
                                    product.Info[5][1] < product.Info[2][1]
                                  ? "text-[#FF0000]"
                                  : "text-[#00FF00]"
                              }`}
                            >
                              <td>{product.Info[1][1]}</td>
                              <td className="text-right">
                                {formatNumber(product.Info[5][1])}
                              </td>
                              <td className="text-right">
                                {formatNumber(product.Info[6][1])}
                              </td>
                              <td className="text-right text-white">
                                {formatNumber(product.Info[7][1])}
                              </td>
                              <td className="text-right text-white">
                                {product.Info[8][1].toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  )}
            </table>
          </div>
          <div className="col-span-1 pl-2">
            <table
              id="tbBuyPT_HA"
              className="table w-full table-PT table-bordered table-priceboard"
            >
              <thead style={{}}>
                <tr>
                  <th
                    className="hbrc text-textHeaderTableGDTT text-[13px] font-normal"
                    colSpan={4}
                  >
                    Chào bán
                  </th>
                </tr>
                <tr>
                  <th className="hbrb">Mã</th>
                  <th className="hb_b">Giá</th>
                  <th className="hbrb">KL</th>
                  <th className="hbrb">Mã CTCK</th>
                </tr>
              </thead>
              <tbody id="tbdPT_HA" />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableGDTTMarketWatch;
