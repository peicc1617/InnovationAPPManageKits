package dao;

import java.util.ArrayList;

public class ResultBean {
   private ArrayList<AppBean> appBean;
   private int status;


   public ResultBean (ArrayList<AppBean> appBean, int status) {
      this.appBean = appBean;
      this.status = status;
   }

   public ArrayList<AppBean> getAppBean () {
      return appBean;
   }

   public void setAppBean (ArrayList<AppBean> appBean) {
      this.appBean = appBean;
   }

   public int getStatus () {
      return status;
   }

   public void setStatus (int status) {
      this.status = status;
   }
}
