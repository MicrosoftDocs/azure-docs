This guide will show you how to use [ClearDB] to create a MySQL database from the [Azure Store] and  how to create a MySQL database as a linked resource when you create a [Azure Web Site][waws] . [ClearDB] is a fault-tolerant database-as-a-service provider that allows you to run and manage MySQL databases in Azure datacenters and connect to them from any application.  

> [AZURE.NOTE] When you create a MySQL database as part of the Website creation process, you can only create a free database. Creating a MySQL database from the Azure Store allows you to create a free database or choose from paid options.

## How to: Create a MySQL database from the Azure Store

To create a MySQL database from the [Azure Store], do the following:

1. Log in to the [Azure Management Portal][portal].
2. Click **+NEW** at the bottom of the page, then select **MARKETPLACE**.

	![Select add-on from store](./media/create-mysql-db/select-store.png)

3. Select **ClearDB MySQL Database**, then click the arrow at the bottom of the frame.

	![Select ClearDB MySQL Database](./media/create-mysql-db/select-cleardb-mysql.png)

4. Select a plan, enter a database name, and select a region, then click the arrow at the bottom of the frame.

	![Purchase MySQL database from store](./media/create-mysql-db/purchase-mysql.png)

5. Click the checkmark to complete your purchase.

	![Review and complete your purchase](./media/create-mysql-db/complete-mysql-purchase.png)

6. After your database has been created, you can manage it from the **ADD-ONS** tab in the management portal.

	![Manage MySQL database in Azure portal](./media/create-mysql-db/manage-mysql-add-on.png)

7. You can get the database connection information by clicking on **CONNECTION INFO** at the bottom of the page (shown above).

	![MySql connection information](./media/create-mysql-db/mysql-conn-info.png) 


## How to: Create a MySQL database as a linked resource for Azure Website

To create a MySQL database as a linked resource when you create a [Azure Web Site][waws], do the following:

1. Log in to the [Azure Management Portal][portal].
2. Click **+NEW** at the bottom of the page, then select **COMPUTE**, **WEBSITE**, and **CREATE WITH DATABASE**.

	![Create website with database](./media/create-mysql-db/custom_create.png)

3. Provide a **URL** for your website, select the **REGION** for your site, and choose **Create a new MySQL database** from the **DATABASE** dropdown. Optionally, you can replace the default name for the connection string. Click the arrow at the bottom of the page.

	![Provide website details](./media/create-mysql-db/provide-website-details.png) 

4. Provide a database **NAME**, select the **REGION** for your database (this should be same as the region for your website), agree to ClearDB's legal terms, and click the checkmark at the bottom of the frame.

	![Provide MySQL details](./media/create-mysql-db/provide-mysql-details.png)

5. After your website has been created, click on the name of your site to go to your site's dashboard.

	![Go to web site dashboard](./media/create-mysql-db/go-to-website-dashboard.png)

6. Click on **CONFIGURE**.

	![Go to configure tab](./media/create-mysql-db/go-to-configure-tab.png)

7. Scroll down to the **connection strings** section and click **Show Connection Strings**. 

	![Show connection string](./media/create-mysql-db/show-conn-string.png)

8. Copy the connection string for use in your application.

	![Shown connection string](./media/create-mysql-db/shown-conn-string.png)

> [AZURE.NOTE] Connection strings are accessible to your website application by connection string name. In .NET applications, connection strings are availble in the **connectionStrings** object. In other programming languages, connection strings are accessible as environment variables. For more information, see [How to Configure Web Sites][configure].

[ClearDB]: http://www.cleardb.com/
[waws]: /documentation/services/web-sites/
[Azure Store]: ../articles/store.md
[portal]: http://manage.windowsazure.com
[configure]: ../articles/app-service-web/web-sites-configure.md
