package controller;

import com.alibaba.fastjson.JSON;

import dao.WebApp;
import org.apache.catalina.Container;
import org.apache.catalina.Context;
import org.apache.catalina.DistributedManager;
import org.apache.catalina.Manager;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.catalina.manager.ManagerServlet;
import services.UsingFrequency;

@WebServlet(urlPatterns = "/AppManager")
public final class AppManager extends ManagerServlet {
   private boolean showProxySessions = false;
   private ArrayList<String> exceptionAppList = new ArrayList<String>() {{
      add("/InnovationTrain");
      add("/news");
      add("/Achievements");
      add("/Application");
      add("/innovation");
      add("/projectManager");
      add("/newsFiles");
      add("");
      add("/docs");
      add("/examples");
      add("/manager");
      add("/webresources");
      add("/host-manager");
      add("/InnovationAPPManageKits");
      add("/ApplicationStyle");
      add("/CAI-templates");
      add("/templates");
      //屏蔽相关软件
      add("/IndustryChainDescription");//产业链描述
      add("/DAPP");// DAPP
      add("/InnovationCollectiveToolKits_v1");// 协同工具版本1
      add("/InnovationCollectiveToolKits");// 协同工具正式版
   }};

   @Override
   public void doGet (HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
      Container children[] = host.findChildren();
      String contextNames[] = new String[children.length];
      for (int i = 0; i < children.length; i++)
         contextNames[i] = children[i].getName();
      Arrays.sort(contextNames);
      List<WebApp> webApps = new ArrayList<>();
      for (String contextName : contextNames) {
         Context ctxt = (Context) host.findChild(contextName);
         if (ctxt != null) {
            String displayPath = ctxt.getPath();
            if(exceptionAppList.contains(displayPath)) continue;
            WebApp webApp = new WebApp();
            //tomcat自动获取参数
            Manager manager = ctxt.getManager();
            try {
               webApp.setVisitNum(UsingFrequency.getSumFrequency(displayPath, new java.util.Random().nextInt(2)+(int) manager.getSessionCounter()));
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }

            webApp.setDisplayName(ctxt.getDisplayName());//项目名
            webApp.setAppPath(displayPath);//项目访问路径
            webApp.setRunning(ctxt.getState().isAvailable());//项目状态
            //web.xml自定义参数
            webApp.setWebAppVersion(ctxt.getServletContext().getInitParameter("webAppVersion"));//项目版本
            webApp.setWebAppAttributeLabel(ctxt.getServletContext().getInitParameter("webAppAttributeLabel"));//APP属性标签
            webApp.setWebAppDescription(ctxt.getServletContext().getInitParameter("webAppDescription"));//APP功能描述
            webApp.setWebAppIcon("/webresources/APPicons" + displayPath + ".png");//APP图标路径
            webApp.setWebAppCategory(ctxt.getServletContext().getInitParameter("webAppCategory"));//APP分类

            if (manager instanceof DistributedManager && showProxySessions) {
               webApp.setUsingNumber(((DistributedManager) manager).getActiveSessionsFull());
            } else {
               webApp.setUsingNumber(manager.getActiveSessions());
            }
            webApps.add(webApp);
         }
      }
      response.setContentType("text/html;charset=utf-8");
      response.getWriter().print(JSON.toJSONString(webApps));
   }

   @Override
   public void doPost (HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
      this.doGet(request, response);
   }
}