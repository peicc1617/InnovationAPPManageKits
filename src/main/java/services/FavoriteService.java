package services;

import com.google.gson.Gson;
import dao.ResultBean;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;

import static services.ProjectService.getWebAppByUsername;

@WebServlet("/favoriteService")
public class FavoriteService extends HttpServlet {

   @Override
   protected void doGet (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
      this.doPost(request, response);
   }

   @Override
   protected void doPost (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
      HttpSession httpSession = request.getSession();
      Gson gson = new Gson();
      String username = ((Map<String, String>) httpSession.getAttribute("userInfo")).get("username");
      String requestType = request.getParameter("type");
      String category = request.getParameter("appName");
      ResultBean result = null;
      switch (requestType) {
         case "get":
            try {
               result = getWebAppByUsername(username);
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
         case "delete":
            try {
               result = ProjectService.deleteWebAppByUsername(username, category);
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
         case "put":
            try {
               result = ProjectService.addWebAppByUsername(username, category);
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
      }
      response.getWriter().print(gson.toJson(result));
   }
}