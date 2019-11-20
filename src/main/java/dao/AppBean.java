package dao;

import java.util.Objects;

public class AppBean {
   private String user;
   private String category;

   public AppBean () {
   }

   public AppBean (String user) {
      this.user = user;
   }

   public AppBean (String user, String category) {
      this.user = user;
      this.category = category;
   }

   public String getUser () {
      return user;
   }

   public void setUser (String user) {
      this.user = user;
   }

   public String getCategory () {
      return category;
   }

   public void setCategory (String category) {
      this.category = category;
   }

   @Override
   public boolean equals (Object o) {
      if (this == o) return true;
      if (o == null || getClass() != o.getClass()) return false;
      AppBean appBean = (AppBean) o;
      return Objects.equals(user, appBean.user) &&
              Objects.equals(category, appBean.category);
   }

   @Override
   public int hashCode () {
      return Objects.hash(user, category);
   }
}
