package services;

import com.google.gson.Gson;
import dao.AppBean;
import dao.ResultBean;
import utils.DButils;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

class ProjectService {
   /*
    * 查询用户常用app
    */
   static ResultBean getWebAppByUsername (String userName) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB();
      Statement stm = connection.createStatement();
      ArrayList<AppBean> appBeanArrayList = new ArrayList<>();
      String sql = "select * from favoriteApp where userName ='" + userName + "'";
      ResultSet rs = stm.executeQuery(sql);
      while (rs.next()) {
         AppBean appBean = new AppBean(userName);
         appBean.setCategory(rs.getString("projectName"));
         appBeanArrayList.add(appBean);
      }
      rs.close();
      stm.close();
      connection.close();
      return new ResultBean(appBeanArrayList,200);
   }

   /*
    *添加用户最喜欢app
    */
   static ResultBean addWebAppByUsername (String userName, String projectName) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB();
      Statement stm = connection.createStatement();
      ResultBean tempArray = getWebAppByUsername(userName);
      if (tempArray.getAppBean().contains(new AppBean(userName, projectName))) {
         tempArray.setStatus(404);
         return tempArray;
      }
      String sql = "insert into favoriteapp (userName,projectName) values('" + userName + "','" + projectName + "')";
      stm.executeUpdate(sql);
      stm.close();
      connection.close();
      return getWebAppByUsername(userName);
   }

   /*
    *删除用户最喜欢app
    */
   static ResultBean deleteWebAppByUsername (String userName, String projectName) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB();
      Statement stm = connection.createStatement();
      ResultBean tempArray = getWebAppByUsername(userName);
      if (tempArray.getAppBean().contains(new AppBean(userName, projectName))) {
         String sql = "delete from favoriteapp where userName='" + userName + "' and projectName='" + projectName + "'";
         stm.executeUpdate(sql);
         stm.close();
         connection.close();
         return getWebAppByUsername(userName);
      }
      tempArray.setStatus(404);
      return tempArray;
   }

//   public static void main (String[] args) throws SQLException, IOException, ClassNotFoundException {
//      Gson gson = new Gson();
//      System.out.println(gson.toJson(getWebAppByUsername("123")));
//   }
}