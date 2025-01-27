import axios, { AxiosResponse } from "axios";
import { RPChart } from "../models/modelChart";
import { getCoookieStorage ,RemoveCookie} from "./authen";
const responseBody = (response: AxiosResponse) => response.data;
const BASE_URL2 = "https://marketstream.fpts.com.vn/";
const BASE_URL1 = "http://priceboard3.fpts.com.vn/";
const BASE_URL = "https://eztrade.fpts.com.vn/";

const URL_EZTRADE = "http://eztrade0.fpts.com"
// mặc định gửi authenticated token lên sever

  axios.interceptors.request.use(
    (config) => {
      const token = getCoookieStorage()// Lấy token từ local storage hoặc nơi lưu trữ khác
    //   nếu có 
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Thêm header Authorization với giá trị token
        return config
      }
    //   else{
    //     // nếu không có 
    //     const result = RemoveCookie()
    //     if(result) {
    //         window.location.reload()
    //         // đẩy sang login 
    //     }
    //   }
      return config
    },
    (error) => {
      return Promise.reject(error);
    }
  )

  const responseInterceptor = (res:any) => {
    // xử lý response  trả về 
    const token = getCoookieStorage() 
    if(token){
        return res;
    // }else{
    //     let result  =  RemoveCookie()  
    //     if(result)  window.location.href= "https://accounts.fpts.com.vn/Login?href=eztrade";
    }
    return res;
  };
  const errorInterceptor = (axiosError:any) => {
    // && axiosError.response
    // console.log("lỗi" ,axiosError)
    // if (axiosError) {
    //   const statusCode = axiosError.response?.status;
    //     if(statusCode === 404) { // lỗi 404 đẩy về trang login 
    //         let result  =  RemoveCookie()
    //         // if(result)  window.location.reload();
    //     }
    // }
    return Promise.reject(axiosError);
  };
  
axios.create({
    headers: {
        'accept': 'application/json',
        'Cache-Control': 'no-cache',    
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*', // Thêm header Access-Control-Allow-Origin
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // Thêm header Access-Control-Allow-Methods
      },
      withCredentials: true, // Cho phép gửi cookie trong yêu cầu
})
axios.interceptors.response.use(responseInterceptor ,errorInterceptor)






const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  postFormData: (url: string, body: {}) =>
    axios
      .post(url, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const responseBody = response;
        return responseBody;
      })
      .catch((error) => {
        console.log("Lỗi trong quá trình gửi yêu cầu: " + error);
        throw error;
    }),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}
const Authen ={
    login: (query :any) =>requests.post("http://eztrade4.fpts.com.vn/sg/api/gateway/v1/account/login",query.toString())
}
const TableHNX = {
  list: (params: URLSearchParams) =>
    requests.get(BASE_URL + "hnx/data.ashx", params),
  get: () => requests.get(BASE_URL + "/hnx/data.ashx?s=quote&l=HNXIndex"),
  getOneStock: (params:string) => requests.get(BASE_URL + `/hnx/data.ashx?s=quote&l=${params}`),
};
const TableHSX = {
  list: (params: URLSearchParams) =>
    requests.get(BASE_URL + "hsx/data.ashx", params),
  get: () => requests.get(BASE_URL + "/hsx/data.ashx?s=quote&l=All"),
  getOneStock: (params:string) => requests.get(BASE_URL + `/hsx/data.ashx?s=quote&l=${params}`),
};
const Index = {
  get: (params:string) =>
    requests.get(
      BASE_URL+`${params}/data.ashx?s=index`
    ),
};
const Company = {
  get: () =>
    requests.get(
      "http://priceboard3.fpts.com.vn/api/ApiData/get_cache_stockinfo"
    ),
};

const Category = {
  get: () =>
    requests.get(
      " http://localhost:8060/categori"
    ),
  // fetch  đata
  fetchData: () => requests.get("http://localhost:30/categori"),
  // add cate
  AddCate : (data:any) =>requests.post("https://eztrade.fpts.com.vn/Root/Data.ashx",data )
};
const Ministry = {
  get: () =>
    requests.get(
      "hhttp://priceboard3.fpts.com/api/stock/v1/mw/s5g/default/ministry"
    ),
};
const ListDataTable = {
  list: (floor: string, valueParam: string) =>
    requests.get(
      BASE_URL+`${floor}/data.ashx?${valueParam}`
    ),
};
const dataGDTTtable = {
  listPt: (floor: string) =>
    requests.get(BASE_URL+`${floor}/data.ashx?s=pt`),
    listBi: (floor: string) =>
    requests.get(BASE_URL+`${floor}/data.ashx?s=bi`),
    
};
const chartIndex = {
  get: () => requests.get(BASE_URL + "/chart/data.ashx?s=full"),
  //get: () => requests.get('http://localhost:8000/dataChartIndex'),
};
var formData = new FormData();
formData.append("key1", "value1");
formData.append("key2", "value2");
const dataTableBasic = {
  post: (dataValueBasic: RPChart) =>
    requests.post(BASE_URL + "/Root/Data.ashx", dataValueBasic),
  postFormData: (dataValueBasic: RPChart) =>
    requests.postFormData(BASE_URL + "/Root/Data.ashx", dataValueBasic),
  //  requests.postFormData("/Root/Data.ashx", dataValueBasic,   {'Content-Type': 'multipart/form-data'},)
};
// table Lịch sử khớp lệnh
const report = {
  get: () => requests.get("http://localhost:2000/data"),
  getHisOrder: () => requests.get("http://localhost:2000/orderHis"),
};
const transfer = {
  getdataTempalte: () => requests.get("  http://localhost:2000/dataTranfer"),
  hometransferds: () => requests.get("http://localhost:2000/dataTransferds"),
};
const tableThongke = {
  getdataThongke: (params: any) =>
    requests.get(`${BASE_URL}/hnx/data.ashx?${params}`),
  sortThongkeIndex: (query: any) =>
    requests.post(BASE_URL + "/Root/Data.ashx", query),
};

const tableDetailPopup = {
  get: (params: any) =>
    requests.get(
      `https://marketstream.fpts.com.vn/hsx/data.ashx?s=quote&l=${params}`
    ),
};

const agent = {
    Authen,
    TableHNX,
    TableHSX,
    Index,
    Company,
    Category,
    Ministry,
    ListDataTable,
    dataGDTTtable,
    chartIndex,
    dataTableBasic,
    report,
    transfer,
    tableThongke
}
export default agent;
