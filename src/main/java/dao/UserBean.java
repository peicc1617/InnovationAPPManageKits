package dao;

public class UserBean {
   private String domain;
   private String permission;
   private String email;
   private String telephone;

   public String getDomain () {
      return domain;
   }

   public void setDomain (String domain) {
      this.domain = domain;
   }

   public String getPermission () {
      return permission;
   }

   public void setPermission (String permission) {
      this.permission = permission;
   }

   public String getEmail () {
      return email;
   }

   public void setEmail (String email) {
      this.email = email;
   }

   public String getTelephone () {
      return telephone;
   }

   public void setTelephone (String telephone) {
      this.telephone = telephone;
   }
}
