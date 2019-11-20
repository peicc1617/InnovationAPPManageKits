package utils;

import java.io.IOException;
import java.io.InputStream;
import java.sql.*;
import java.util.Properties;

public class DButils {
   private static Properties prop = new Properties();
   private static InputStream in = DButils.class.getClassLoader().getResourceAsStream("jdbc.properties");//读取文件

   public static Connection connectDB () throws IOException, SQLException, ClassNotFoundException {
      prop.load(in);//加载文件
      String userName = prop.getProperty("username");
      String pwd = prop.getProperty("password");
      String url = prop.getProperty("JDBC_Url");
      String driver = prop.getProperty("JDBC_Driver");
      Class.forName(driver);// 驱动
      return DriverManager.getConnection(url, userName, pwd);
   }
}