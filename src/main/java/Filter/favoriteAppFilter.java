package Filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public class favoriteAppFilter implements Filter {

   @Override
   public void init (FilterConfig filterConfig) throws ServletException {
   }

   @Override
   public void doFilter (ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
      System.out.println("偏好过滤器正在执行");
      HttpSession httpSession = ((HttpServletRequest) request).getSession();
      if (httpSession.getAttribute("userInfo") == null) {
         response.setContentType("text/html;charset=UTF-8");
         response.getWriter().print("匿名用户，权限不够，无法执行相应操作");
      } else {
         filterChain.doFilter(request, response);
      }
   }

   @Override
   public void destroy () {
      System.out.println("过滤器成功销毁");
   }
}