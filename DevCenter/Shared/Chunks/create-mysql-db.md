#How to Create a MySQL Database in Windows Azure

This guide will show you how to use [ClearDB] to create a MySQL database from the [Windows Azure Store] and  how to create a MySQL database as a linked resource when you create a [Windows Azure Web Site][waws] . [ClearDB] is a fault-tolerant database-as-a-service provider that allows you to run and manage MySQL databases in Windows Azure datacenters and connect to them from any application.  

##Table of Contents
* [How to: Create a MySQL database from the Windows Azure Store](#CreateFromStore)
* [How to: Create a MySQL database as a linked resource for Windows Azure Web Site](#CreateForWebSite)

<div class="dev-callout"> 
<b>Note</b> 
<p>When you create a MySQL database as part of the Web Site creation process, you can only create a free database. Creating a MySQL database from the Windows Azure Store allows you to create a free database or choose from paid options.</p> 
</div>

<h2 id="CreateFromStore">How to: Create a MySQL database from the Windows Azure Store</h2>

To create a MySQL database from the [Windows Azure Store], do the following:

1. Log in to the [Windows Azure Management Portal][portal].
2. Click **+NEW** at the bottom of the page, then select **STORE**.

	![Select add-on from store](../../Shared/Media/select-store.png)

3. Select **ClearDB MySQL Database**, then click the arrow at the bottom of the frame.

	![Select ClearDB MySQL Database](../../Shared/Media/select-cleardb-mysql.png)

4. Select a plan, enter a database name, and select a region, then click the arrow at the bottom of the frame.

	![Purchase MySQL database from store](../../Shared/Media/purchase-mysql.png)

5. Click the checkmark to complete your purchase.

	![Review and complete your purchase](../../Shared/Media/complete-mysql-purchase.png)

6. After your database has been created, you can manage it from the **ADD-ONS** tab in the management portal.

	![Manage MySQL database in Windows Azure portal](../../Shared/Media/manage-mysql-add-on.png)

7. You can get the database connection information by clicking on **CONNECTION INFO** at the bottom of the page (shown above).

	![MySql connection information](../../Shared/Media/mysql-conn-info.png) 


<h2 id="CreateForWebSite">How to: Create a MySQL database as a linked resource for Windows Azure Web Site</h2>

To create a MySQL database as a linked resource when you create a [Windows Azure Web Site][waws], do the following:

1. Log in to the [Windows Azure Management Portal][portal].
2. Click **+NEW** at the bottom of the page, then select **COMPUTE**, **WEB SITE**, and **CREATE WITH DATABASE**.

	![Create website with database](../../Shared/Media/create-website-with-database.png)

3. Provide a **URL** for your web site, select the **REGION** for your site, and choose **Create a new MySQL database** from the **DATABASE** dropdown. Optionally, you can replace the default name for the connection string. Click the arrow at the bottom of the page.

	![Provide website details](../../Shared/Media/provide-website-details.png) 

4. Provide a database **NAME**, select the **REGION** for your database (this should be same as the region for your web site), agree to ClearDB's legal terms, and click the checkmark at the bottom of the frame.

	![Provide MySQL details](../../Shared/Media/provide-mysql-details.png)

5. After your web site has been created, click on the name of your site to go to your site's dashboard.

	![Go to web site dashboard](../../Shared/Media/go-to-website-dashboard.png)

6. Click on **CONFIGURE**.

	![Go to configure tab](../../Shared/Media/go-to-configure-tab.png)

7. Scroll down to the **connection strings** section and click **Show Connection Strings**. 

	![Show connection string](../../Shared/Media/show-conn-string.png)

8. Copy the connection string for use in your application.

	![Shown connection string](../../Shared/Media/shown-conn-string.png)

<div class="dev-callout"> 
<b>Note</b> 
<p>Connection strings are accessible to your web site application by connection string name. In .NET applications, connection strings are availble in the <b>connectionStrings</b> object. In other programming languages, connection strings are accessible as environment variables. For more information, see <a href="/en-us/manage/services/web-sites/how-to-configure-websites/">How to Configure Web Sites</a>.</p> 
</div>

[ClearDB]: http://www.cleardb.com/
[waws]: /en-us/manage/services/web-sites/
[Windows Azure Store]: /en-us/store/overview/
[portal]: http://windows.azure.com/