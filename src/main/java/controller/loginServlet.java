package controller;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;

@WebServlet("/index")
public class loginServlet extends HttpServlet {
   protected void doPost (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
      HttpSession httpSession = request.getSession();
      if (httpSession.getAttribute("userInfo") == null) {
         request.getRequestDispatcher("WEB-INF/content/index.html").forward(request, response);
         return;
      }
      String username = ((Map<String, String>) httpSession.getAttribute("userInfo")).get("username");
      if (username.equals("admin")) {
         request.getRequestDispatcher("WEB-INF/content/admin.html").forward(request, response);
         return;
      }
      request.getRequestDispatcher("WEB-INF/content/user.html").forward(request, response);
   }

   protected void doGet (HttpServletRequest request, HttpServletResponse response)
           throws ServletException, IOException {
      this.doPost(request, response);
   }
}