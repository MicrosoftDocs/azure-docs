Follow these steps to create a Windows Azure web site and a MySQL database:

1. Login to the [Preview Management Portal][preview-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure web site][new-website]

3. Click **Web Site**, then **Custom Create**. Enter a value for **URL**, select **Create a New MySQL Database** from the **DATABASE** dropdown,  and select the data center for your web site in the **REGION** dropdown. Click the arrow at the bottom of the dialog.

	![Custom Create a new web site][custom-create]

	![Fill in web site details][website-details]

4. Enter a value for the **NAME** of your database, select the data center for your database in the **REGION** dropdown, and check the box that indicates you agree with the legal terms. Click the checkmark at the bottom of the dialog.

	![Create new MySQL database][new-mysql-db]

	When the web site has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfully**.

	Next, you need to get the MySQL connection information.

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>Obtaining the MySQL connection information from the `.publishsettings` file, as described in the following steps, is only necessary in the preview release of Windows Azure Web Sites.</p> 
	</div>

5. Click the name of the web site displayed in the list of web sites to open the web site’s Quick Start dashboard.

	![Open web site dashboard][go-to-dashboard]

6. From your web site's dashboard, click the **Download publish profile** link at the bottom right corner of the page:

	![Download publish profile][download-publish-profile]

7. Open the `.publishsettings` file in an XML editor. The `<databases>` element will look similar to this:

		<databases>
	      <add name="tasklist" 
	           connectionString="Database=tasklist;Data Source=us-mm-azure-ord-01.cleardb.com;User Id=e02c62383bffdd;Password=0fc50b7e" 
	           providerName="MySql.Data.MySqlClient" 
	           type="MySql"/>
	    </databases>
	
8. The `connectionString` attribute in the `<add>` element contains your database connection information. The values for `Database`, `Data Source`, `User Id`, and `Password` are (respectively) the database name, server name, user name, and user password.

[new-website]: ../Media/new_website.jpg
[custom-create]: ../Media/custom_create.jpg
[website-details]: ../Media/website_details.jpg
[new-mysql-db]: ../Media/new_mysql_db.jpg
[go-to-dashboard]: ../Media/go_to_dashboard.png
[download-publish-profile]: ../Media/download_publish_profile.jpg
[preview-portal]: https://manage.windowsazure.com