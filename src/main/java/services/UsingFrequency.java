package services;

import utils.DButils;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class UsingFrequency {
   private static int getFrequency (String category) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB();
      Statement stm = connection.createStatement();
      String sql = "select * from appusednumber where projectName ='" + category + "'";
      ResultSet rs = stm.executeQuery(sql);
      if (!rs.isBeforeFirst()) return -1;
      int count = 0;
      while (rs.next()) {
         count = rs.getInt("number");
      }
      rs.close();
      stm.close();
      connection.close();
      return count;
   }

   private static void insertCategory (String category, int number) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB();
      Statement stm = connection.createStatement();
      String sql = "insert into appusednumber (projectName,number) value ('" + category + "','" + number + "')";
      stm.executeUpdate(sql);
      stm.close();
      connection.close();
   }

   public static int getSumFrequency (String category, int number) throws SQLException, IOException, ClassNotFoundException {
      if (getFrequency(category) < 0) {
         insertCategory(category, number);
         return number;
      }
      Connection connection = DButils.connectDB();
      Statement stm = connection.createStatement();
      String sql = "update appusednumber set number=number +'"+number+"' where projectName='"+category+"'";
      stm.executeUpdate(sql);
      stm.close();
      connection.close();
      return getFrequency(category);
   }

//   public static void main (String[] args) throws SQLException, IOException, ClassNotFoundException {
//      System.out.println(getSumFrequency("/liao",5));
//   }
}
