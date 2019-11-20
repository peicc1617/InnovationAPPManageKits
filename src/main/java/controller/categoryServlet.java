package controller;

import utils.DButils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;

@WebServlet("/update")
public class categoryServlet extends HttpServlet {
   protected void doPost (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//      用户权限判断
      response.setHeader("Content-type", "text/html;charset=UTF-8");
      String requestType = request.getParameter("requestType");
      switch (requestType) {
         case "modify":
            HttpSession httpSession = request.getSession();
            if (httpSession.getAttribute("userInfo") == null) return;
            String username = ((Map<String, String>) httpSession.getAttribute("userInfo")).get("username");
            if (!username.equals("admin")) return;
            try {
               String category = request.getParameter("result");
               System.out.println(category);
               updateCategory(category);
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
         case "get":
            try {
               response.getWriter().print(getCategory());
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
      }
   }

   //更新布局数据
   private void updateCategory (String category) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB();
      Statement stm = connection.createStatement();
      String sql = "update innovationkits set category='" + category + "' where id=1";
      stm.executeUpdate(sql);
      stm.close();
      connection.close();
   }

   //查询布局数据
   private String getCategory () throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB();
      Statement stm = connection.createStatement();
      String sql = "select category from innovationkits where id=1";
      ResultSet rs = stm.executeQuery(sql);
      String category = null;
      while (rs.next()) {
         category = rs.getString("category");
      }
      rs.close();
      stm.close();
      connection.close();
      return category;
   }
}