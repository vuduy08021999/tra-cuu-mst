module.exports = function(mst) {
  return new Promise((resolve, reject) => {

      let request = require('request');
      let cheerio = require('cheerio');

      const options = {
          url: `https://masothue.com/Search?q=${mst}&token=1&type=auto&force-search=0`,
          headers: {
              'User-Agent': 'request'
          }
      };
      try{
        function callback(error, response, body) {
          if (!error && response.statusCode == 200) {
            let $ = cheerio.load(body);
            let infoDoanhNghiep = require("./infoDoanhNghiep");
            if($('.table-taxinfo > thead > tr > th')) infoDoanhNghiep.tenDoanhNghiep = $('.table-taxinfo > thead > tr > th').text();
            let trs = [];
            $('.table-taxinfo > tbody tr').each(function() {
                trs.push($(this).text().trim());
            });
            for (var i = 0; i < trs.length; i++) {
              if(trs[i]) xuLyTr(infoDoanhNghiep,trs[i]);
            }
            // if($('.table-taxinfo > tbody tr td[itemprop=taxID]') )infoDoanhNghiep.maSoThue = $('.table-taxinfo > tbody tr td[itemprop=taxID]').text();
            // if($('.table-taxinfo > tbody tr td[itemprop=address]'))infoDoanhNghiep.diaChi = $('.table-taxinfo > tbody tr td[itemprop=address]').text();
            // if($('.table-taxinfo > tbody tr[itemprop=alumni]').text().trim().split('\n')[1].split('Ẩn thông tin'))infoDoanhNghiep.nguoiDaiDien = $('.table-taxinfo > tbody tr[itemprop=alumni]').text().trim().split('\n')[1].split('Ẩn thông tin')[0].trim();
            // if($('.table-taxinfo > tbody tr td[itemprop=telephone]'))infoDoanhNghiep.dienThoai = $('.table-taxinfo > tbody tr td[itemprop=telephone]').text();
            // if($('.table-taxinfo > tbody tr:contains("Ngày hoạt động")').text().trim().split("Ngày hoạt động")[1])infoDoanhNghiep.ngayHoatDong = $('.table-taxinfo > tbody tr:contains("Ngày hoạt động")').text().trim().split("Ngày hoạt động")[1].trim();
            // if($('.table-taxinfo > tbody tr:contains("Quản lý bởi")').text().trim().split("Quản lý bởi"))infoDoanhNghiep.quanLyBoi  = $('.table-taxinfo > tbody tr:contains("Quản lý bởi")').text().trim().split("Quản lý bởi")[1].trim();
            // if($('.table-taxinfo > tbody tr td[colspan=2]'))infoDoanhNghiep.lastUpdate = $('.table-taxinfo > tbody tr td[colspan=2]').text().trim();


            resolve(infoDoanhNghiep);
          }else{
            reject("statusCode: "+response.statusCode);
          }
        }
        request(options, callback);
      }catch(e){
        reject(e)
      }


  });
}

//Tên quốc tế, Tên viết tắt, Loại hình DN, Tình trạng
let xuLyTr=function (infoDoanhNghiep,tr) {
  if(tr.includes("Tên quốc tế")){
    infoDoanhNghiep.tenQuocTe = tr.split('Tên quốc tế')[1].trim();
  }else if(tr.includes("Tên viết tắt")){
    infoDoanhNghiep.tenVietTat = tr.split('Tên viết tắt')[1].trim();
  }else if(tr.includes("Mã số thuế")){
    infoDoanhNghiep.maSoThue = tr.split('Mã số thuế')[1].trim();
  }else if(tr.includes("Địa chỉ")){
    infoDoanhNghiep.diaChi = tr.split('Địa chỉ')[1].trim();
  }else if(tr.includes("Người đại diện")){
    infoDoanhNghiep.nguoiDaiDien = tr.split('Người đại diện')[1].trim().replace('Ẩn thông tin', '');
  }else if(tr.includes("Điện thoại")){
    infoDoanhNghiep.dienThoai = tr.split('Điện thoại')[1].trim()
  }else if(tr.includes("Ngày hoạt động")){
    infoDoanhNghiep.ngayHoatDong = tr.split('Ngày hoạt động')[1].trim()
  }else if(tr.includes("Quản lý bởi")){
    infoDoanhNghiep.quanLyBoi = tr.split('Quản lý bởi')[1].trim()
  }else if(tr.includes("Loại hình DN")){
    infoDoanhNghiep.loaiHinhDN = tr.split('Loại hình DN')[1].trim()
  }else if(tr.includes("Tình trạng")){
    infoDoanhNghiep.tinhTrang = tr.split('Tình trạng')[1].trim()
  }else if(tr.includes("Cập nhật mã số thuế")){
    infoDoanhNghiep.lastUpdate = tr;
  }else{
    infoDoanhNghiep.chuaXacDinh+= tr;
  }
}
