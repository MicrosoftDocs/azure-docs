Follow these steps to create a Windows Azure Website and a MySQL database:

1. Login to the Windows Azure portal. **TODO: provide link**
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure Website][new-website]

3. Click **Web Site**, then **Custom Create**. Enter a value for **URL**, select **Create a New MySQL Database** from the **DATABASE** dropdown,  and select the data center for your website in the **REGION** dropdown. Click the arrow at the bottom of the dialog.

	![Custom Create a new Website][custom-create]

	![Fill in Website details][website-details]

4. Enter a value for the **NAME** of your database, select the data center for your database in the **REGION** dropdown, and check the box that indicates you agree with the legal terms. Click the checkmark at the bottom of the dialog.

	![Create new MySQL database][new-mysql-db]

	When the website has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfuly**.

	Next, you need to get the MySQL connection information.

	**NOTE:** Obtaining the MySQL connection information from the `.publishsettings` file, as described in the following steps, is only necessary in the preview release of Windows Azure Websites.

5. Click the name of the website displayed in the list of websites to open the website’s Quick Start dashboard.

	![Open website dashboard][go-to-dashboard]

6. From your website's dashboard, click the **Download publish profile** link at the bottom right corner of the page:

	![Download publish profile][download-publish-profile]

7. Open the `.publishsettings` file in an XML editor. The `<databases>` element will look similar to this:

		<databases>
	      <add name="tasklist" 
	           connectionString="Database=tasklist;Data Source=us-mm-azure-ord-01.cleardb.com;User Id=e02c62383bffdd;Password=0fc50b7e" 
	           providerName="MySql.Data.MySqlClient" 
	           type="MySql"/>
	    </databases>
	
8. The `connectionString` attribute in the `<add>` element contains your database connection information. The values for `Database`, `Data Source`, `User Id`, and `Password` are (respectively) the database name, server name, user name, and user password.

[new-website]: ./Media/new_website.jpg
[custom-create]: ./Media/custom_create.jpg
[website-details]: ./Media/website_details.jpg
[new-mysql-db]: ./Media/new_mysql_db.jpg
[go-to-dashboard]: ./Media/go_to_dashboard.jpg
[download-publish-profile]: ./Media/download_publish_profile.jpg