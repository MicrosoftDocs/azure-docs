

1. In Visual Studio, In the Management Portal, click the **Data** tab, and then click the **TodoItem** table. 

   	![](./media/mobile-services-restrict-permissions-javascript-backend/mobile-portal-data-tables.png)

2. Click the **Permissions** tab, set all permissions to **Only authenticated users**, and then click **Save**. This will ensure that all operations against the **TodoItem** table require an authenticated user. This also simplifies the scripts in the next tutorial because they will not have to allow for the possibility of anonymous users.

   	![](./media/mobile-services-restrict-permissions-javascript-backend/mobile-portal-change-table-perms.png)
