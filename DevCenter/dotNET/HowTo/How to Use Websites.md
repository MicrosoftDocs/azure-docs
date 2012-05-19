<!-- See http://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-queues/#create-provider for reference -->
# How to Use Websites #

This guide will show you how to use Websites. The scenarios covered in this guide include creating, configuring, managing and monitoring websites on Windows Azure.

## Table of Contents ##

- [What are Websites?](#whatarewebsites)
- [How to: Create, Deploy and Delete a Website](#howtocreatedeploydelete)
- [How to: Change Configuration Options for a Website](#howtochangeconfig)
- [How to: Manage a Website](#howtomanage)
- [How to: Monitor a Website](#howtomonitor)
- [How to: Configure Diagnostics and Download Logs for a Website](#howtoconfigdiagnostics)
- [How to: Configure a Website to Use Other Windows Azure Resources](#howtoconfigother)
- [How to: Scale a Website](#howtoscale)
- [How to: View Usage Quotas for a Website](#howtoviewusage)
- [How to: Create a Website from the Azure Gallery](#howtocreatefromgallery)
- [How to: Develop and Deploy a Website with Microsoft WebMatrix](#howtodevdepwebmatrix)
- [Next Steps](#nextsteps)

##<a name="whatarewebsites"></a>What are Websites?
Websites are web application hosts which support popular web application technologies such as .NET, Node.js and PHP without requiring any code changes to existing applications.  All of the common programming models and resources that .NET, Node.js and PHP developers use to access resources such as files and databases will continue to work as expected on websites deployed to Windows Azure.  Websites provide access to file and database resources and to  all of the standard configuration files (such as web.config, php.ini and config.js) used by web applications today. A website is the host for a web application running in the cloud that you can control and manage. 

--------------------------------------------------------------------------------

##<a name="howtocreatedeploydelete"></a>How to: Create, Deploy and Delete a Website

Just as you can quickly create and deploy a web application created from the Azure Gallery, you can also deploy a website created on a workstation with traditional developer tools from Microsoft or other companies. This topic describes how to [Create a Website in Windows Azure](#createawebsite), deploy your website as described in [Deploy a Website to Windows Azure](#deployawebsite) and delete a website in [Delete a Website in Windows Azure](#deleteawebsite).

### Development Tools for Creating a Website ###
Some development tools available from Microsoft include [Microsoft Visual Studio 2010][VS2010], [Microsoft Expression Studio 4][msexpressionstudio] and [Microsoft WebMatrix][mswebmatrix], a free web development tool from Microsoft which provides essential functionality for website development. 

###<a name="createawebsite"></a>Create a Website in Windows Azure
Follow these steps to create a website in Windows Azure.
	
1. Login to the Windows Azure portal.
2. Click the **Create New** icon on the bottom left of the Windows Azure portal.
3. Click the **Web Site** icon, click the **Quick Create** icon, enter a value for URL and then click the check mark next to create web site on the bottom right corner of the page.
4. When the website has been created you will see the text **Creation of Web Site '[SITENAME]'  Completed**.
5. Click the name of the website displayed in the list of websites to open the website’s **Quick Start** management page.
6. On the **Quick Start** page you are provided with options to set up TFS or GIT publishing if you would like to deploy your finished website to Windows Azure using these methods. FTP publishing is set up by default for websites and the FTP Host name is displayed under **FTP Hostname** on the **Quick Start** and **Dashboard** pages. Before publishing with FTP or GIT choose the option to **Reset deployment credentials** on the **Dashboard** page. Then specify the new credentials (username and password) to authenticate against the FTP Host or the Git Repository when deploying content to the website.
7. The **Configure** management page exposes several configurable application settings in the following sections:
> - **Framework** – Set the version of .NET framework or PHP required by your web application.
> - **Diagnostics** – Set logging options for gathering diagnostic information for your website in this section.
> - **App Settings** – Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be injected into your .NET configuration **AppSettings** at runtime, overriding existing settings. For PHP and Node sites these settings will be available as environment variables at runtime.
> - **Connection Strings** – View connection strings for linked resources. For .NET sites, these connection strings will be injected into your .NET configuration **connectionStrings** settings at runtime, overriding existing entries where the key equals the linked database name. For PHP and Node sites these settings will be available as environment variables at runtime.
> - **Default Documents** – Add your web application’s default document to this list if it is not already in the list. If your web application contains more than one of the files in the list then make sure your website’s default document appears at the top of the list.

###<a name="deployawebsite"></a>Deploy a Website to Windows Azure
Windows Azure supports deploying websites from remote computers using WebDeploy, FTP, GIT or TFS. Many development tools provide integrated support for publication using one or more of these methods and may only require that you provide the necessary credentials, site URL and hostname or URL for your chosen deployment method. Credentials and deployment URLs for all enabled deployment methods are stored in the website’s publish profile, a file which can be downloaded from the **Quick Start** page or the **quick glance** section of the **Dashboard** page. If you prefer to deploy your website with a separate client application, high quality open source GIT and FTP clients are available for download on the Internet for this purpose.

#### Deploy a Website from Git ####
If you use a Git for source code control, you can publish your app directly from a local Git repository to a website. Git is a free, open-source, distributed version control system that handles small to very large projects. To use Git with your website, you must set up Git publishing from the Quick Start or Dashboard management pages for your website. After you set up Git publishing, each .Git push initiates a new deployment. You'll manage your Git deployments on the Deployments management page.

**Tip**  
After you create your website, use **Set up Git Publishing** from the **Quick Start** or **Dashboard** management pages to set up Git publishing for the website. If you're new to Git, you'll be guided through creating a Git account and a local repository for your website. You'll see the exact Git commands that you need to enter, including the Git repository URLs to use with your website.

#### Set up Git Publishing ####
**To set up Git publishing**

1. Create a website in Windows Azure. (**Create New - Web Site**)
2. From the **Quick Start** management page, click **Set up Git publishing**.

Follow the instructions to create a deployment user account by specifying a username and password to use for deploying with Git and FTP, if you haven’t done that already. A Git repository will be created for the website that you are managing.

#### Push your local Git repository to Windows Azure ####
The following procedures below will walk you through creating a new repository or cloning an existing repository and then pushing your content to the Git repository for the website.

**To push my local files to Windows Azure**

1. Install the Git client. ([Download Git][getgit])
2. Open a command prompt, change directories to your application's root directory, and type the following commands:
   
		git init
		git add.
		git commit -m "initial commit"

	This creates a local Git repository and commits your local application files to the repository.

3. Add a remote Windows Azure repository and push your files to it.
4. Open a command prompt, cd into your app's root directory and type the following:

  		git remote add azure http://azure@microsoft.com.antdf0.windows-int.net/azureweb.git
		git push azure master
 
>	 **Note**<br/>
>	 The commands above will vary depending upon the name of the website for which you have created the Git repository.
 
#### To clone a website to my computer ####
1. Install the Git client. ([Download Git][getgit]) if you have not already.
2. Clone your website.
3. Open a command prompt, change directories to the directory where you want your files, and type:

		git clone -b master <GitRepositoryURL>
 
	where <em>GitRepositoryURL</em> is the URL for the Git repository that you want to clone.

4. Commit changes, and push the repository's contents back to Windows Azure.

5. After changing or adding some files, change directories your app's root directory and type:

  		git add.
		git commit -m "some changes"
		git push
 
After deployment begins, you can monitor the deployment status on the **Deployments** management page. When the deployment completes, click **Browse** to open your website in a browser.

###<a name="deleteawebsite"></a>Delete a Website in Windows Azure
Websites are deleted using the **Delete** icon in the Windows Azure Portal. The **Delete** icon is available in the Windows Azure Portal when you click **Web Sites** to list all of your websites and at the bottom of each of the website management pages.

-------------------------------------------------------------------------------

##<a name="howtochangeconfig"></a>How to: Change Configuration Options for a Website

Configuration options for websites are set on the Configure management page for the website. This topic describes how to use the Configure management page to modify configuration options for a website.

### Change configuration options for a website ###

Follow these steps to change configuration options for a website.

<ol>
	<li>Open the website’s management pages from the Windows Azure Portal.</li>
	<li>Click the <strong>Configure</strong> tab to open the <strong>Configure</strong> management page.</li>
	<li>Set the following configuration options for the website as appropriate:
	<ul>
	<li style="margin-left: 40px"><strong>framework</strong> – Set the version of .NET framework or PHP required by your web application.</li>
	<li style="margin-left: 40px"><strong>hostnames</strong> – Enter additional hostnames for the website here. Additional hostnames are limited to changing only the 
	portion of the fully qualified “dot delimited” domain name that precedes the first period or “dot”. For example if the original website name is MySite.azure-test.windows.net then additional hostnames must use the nomenclature newhostname.azure-test.windows.net and retain the first period plus everything to the right of the first period.<br /><strong>Note</strong><br />Functionality 
	for adding additional website hostnames is only available when the website is configured with the <strong>Reserved</strong> Website Mode,  as specified on the <strong>Scale</strong> management page.</li>
	<li style="margin-left: 40px"><strong>diagnostics</strong> – Set options for gathering diagnostic 
	information for your website including:
	<ul>
	<li style="margin-left: 60px"><strong>Web Server Logging</strong> – Specify whether to enable web server logging for the website. 
	If enabled, web server logs are saved with the W3C extended log file format to the FTP site listed under Diagnostic Logs on the 
	Dashboard management page. After connecting to the specified FTP site navigate to /wwwroot/LogFiles/http/RawLogs/ to retrieve the web server logs.</li>
	<li style="margin-left: 60px"><strong>Detailed Error Messages</strong> – Specify whether to log detailed error messages for the website. 
	If enabled, detailed error messages are saved as .htm files to the FTP site listed under Diagnostic Logs on the Dashboard management page. 
	After connecting to the specified FTP site navigate to /LogFiles/DetailedErrors/ to retrieve the .htm files which contain detailed error messages.</li>
	<li style="margin-left: 60px"><strong>Failed Request Tracing</strong> – Specify whether to enable failed request tracing. If enabled, 
	failed request tracing output is written to XML files and saved to the FTP site listed under Diagnostic Logs on the Dashboard management page. 
	After connecting to the specified FTP site navigate to /LogFiles/W3SVC######### (where ######### represent a unique identifier for the website) 
	to retrieve the XML files that contain the failed request tracing output.<br /><strong>Important</strong><br />The /LogFiles/W3SVC#########/ 
	folder contains an XSL file and one or more XML files. Ensure that you download the XSL file into the same directory as the XML file(s) because 
	the XSL file provides functionality for formatting and filtering the contents of the XML file(s) when viewed in Internet Explorer. For more information about 
	configuring diagnostics for Websites see <a href="#howtoconfigdiagnostics">How to: Configure Diagnostics and Download Logs for a Website</a>.</li>
	</ul>
	</li>
	<li><strong>App Settings</strong> – Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be 
	injected into your .NET configuration AppSettings at runtime, overriding existing settings. For PHP and Node sites these settings will be 
	available as environment variables at runtime.</li>
	<li><strong>Connections Strings</strong> – View connection strings for linked resources. For .NET sites, these connection strings will be injected into your 
	.NET configuration connectionStrings settings at runtime, overriding existing entries where the key equals the linked database name. For PHP 
	and Node sites these settings will be available as environment variables at runtime.<br />
	<strong>Note</strong><br />Connection strings are created when you link a database resource to a website and are read only when viewed on the 
	configuration management page.</li>
	<li><strong>Default Documents</strong> – Add your website’s default document to this list if it is not already in the list. A website’s default 
	document is the web page that is displayed when a user navigates to a website and does not specify a particular page on the website. So given the 
	website http://contoso.com, if the default document is set to default.htm, a user would be routed to http://www.contoso.com/default.htm when pointing 
	their browser to http://www.contoso.com. If your website contains more than one of the files in the list then make sure your website’s default document 
	is at the top of the list by changing the order of the files in the list.</li>
	</ul></li>
	<li>Click <strong>Save</strong> at the bottom of the <strong>Configure</strong> management page to save configuration changes.</li>
</ol>

--------------------------------------------------------------------------------

##<a name="howtomanage"></a>How to: Manage a Website

You manage your websites with a set of Management pages.

**Windows Azure Portal Website Management Pages** – Each Website management page is described below.

#### QuickStart ####
The **QuickStart** management page includes the following sections:

- **get the tools** – Provides links to [Install WebMatrix][mswebmatrix] and the [Azure SDK][azuresdk].
- **publish from local environment** – Provides links to download the website’s publishing profile and reset deployment credentials for the website.
- **publish from source control** – Includes links for setting up TFS publishing and GIT publishing.

For more information about developing and deploying Websites see the following topics:

- [How to: Create, Deploy and Delete Website](#howtocreatedeploydelete)
- [How to: Develop and Deploy a Website with Microsoft WebMatrix](#howtodevdepwebmatrix)
- [How to: Create a Website from the Azure Gallery](#howtocreatefromgallery)

#### Dashboard ####
The **Dashboard** management page includes the following:

 - A chart which summarizes website usage as measurements of certain metrics.

> - **CPU Time** – a measure of the website’s CPU usage.
> - **Requests** – a count of all client requests to the website.
> - **Data Out** – a measure of data sent by the website to clients.
> -  **Data In** – a measure of data received by the website from clients.
> - **Http Client Errors** – number of Http “4xx Client Error” messages sent.
> - **Http Server Errors** – number of Http “5xx Server Error” messages sent.

 > **Note**<br/>
To see a chart with additional performance metrics, configure the chart displayed on the **Monitor** management page as described in [How to: Monitor a Website](#howtomonitor).

 - A list of all linked resources associated with this website or if no resources are associated, a hyperlink to the **Linked Resources** management page.
 - A **quick glance** section which includes the following summary information and links:

> - **Download Publish Profile** – Link to the publish profile, a file which contains credentials and URLs required to publish to the website using any enabled publishing methods.
> - **Reset Deployment Credentials** – Displays a dialog box where you provide unique credentials for use when publishing with GIT or FTP. If you wish to use GIT or FTP deployment then you must reset deployment credentials because authentication to an FTP host or GIT repository with Live ID credentials is not supported. Once you reset deployment credentials you can use these credentials for GIT or FTP publishing to any website in your subscription.
> - **Set up TFS publishing** – Displays a dialog box where you can set up publishing from Team Foundation Service.
> - **Set up Git publishing** – Creates a GIT repository for the website so that you can publish to the website using GIT.
> - **Status** – Indicates whether the website is running or not.
> - **Site Url** – Specifies the publicly accessibly address of the website on the internet.
> - **Location** – Specifies the physical region of the datacenter that hosts the website.
> - **Compute Mode** – Specifies whether the website is running in Reserved or Shared mode. For more information about website modes see [How to: Scale a Website](#howtoscale).
> - **Subscription ID** – Specifies the actual unique subscription ID of the subscription that the website is associated with.
> - **FTP Hostname** – Specifies the URL to use when publishing to the website over FTP.
> - **Deployment User** – Indicates the account used when deploying the website to Windows Azure over FTP or GIT.
> - **Diagnostic Logs** – Specifies the location of the website’s diagnostic logs if diagnostic logging is enabled on the **Configure** management page.
> - **GIT Clone URL** – URL of the GIT repository for the website. For information about making a copy of a remote GIT repository see the **git clone** section of the [GIT Reference for Getting and Creating Projects][gitref].<br/>
 > 	**Note**<br/>
**GIT Clone URL** is not available until you click the link to **Set up GIT publishing** and create a GIT repository.

####Deployments####
 The **Deployments** management page provides a summary of all deployments made to the website using either GIT or TFS. If no GIT or TFS deployments have been made and GIT publishing has been configured for the website the **Deployments** management page provides information describing how to use GIT to deploy your web application to the website.

####Monitor####
The **Monitor** management page provides a chart that displays usage information for the website. By default this chart displays the same metrics as the chart on the **Dashboard** page as described above in the Dashboard section. The chart can also be configured to display the metrics Http Successes, Http Redirects, Http 401 errors, Http 403 errors, Http 404 errors and Http 406 errors. For more information about these metrics see [How to: Monitor a Website](#howtomonitor).

####Configure####
The **Configure** management page is used to set application specific settings including:

- **Framework** – Set the version of .NET framework or PHP required by your web application.
- **Diagnostics** – Set logging options for gathering diagnostic information for your website in this section. For more information about configuring diagnostics see [How to: Configure Diagnostics and Download Logs for a Website][howtoconfiganddownloadlogs].
- **App Settings** – Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be injected into the website’s .NET configuration AppSettings at runtime, overriding existing settings. For PHP and Node websites, these settings will be available as environment variables at runtime.
- **Connections Strings** – View connection strings to linked resources. For .NET sites, these connection strings will be injected into the website’s .NET configuration connectionStrings settings at runtime, overriding any existing entries where the key equals the linked database name. For PHP and Node websites, these settings will be available as environment variables at runtime.
- **Default Documents** – Add your website’s default document to this list if it is not already in the list. If your website contains more than one of the files in the list then make sure your website’s default document appears at the top of the list by changing the order of the files in the list.

For more information about how to configure a Website see [How to: Change Configuration Options for a Website](#howtochangeconfig).

####Scale####
The **Scale** management page is used to specify the website mode (either **Shared** or **Reserved**), the size of the website if it is configured as **Reserved** (**Small**, **Medium** or **Large**) and the value for **Reserved Instance Count** (from 1 to 3). A website that is configured as **Reserved** will provide more consistent performance than a website that is configured as **Shared**. A website that is configured with a larger **Reserved Instance Size** will perform better under load. Increasing the value for **Reserved Instance Count** will provide fault tolerance and improved performance through scale out. For more information about configuring scale options for a website see [How to: Scale a Website](#howtoscale).

####Linked Resources####
The **Linked Resources** management page provides a summary of all Windows Azure resources that your website is using. At the time of this writing, the only type of Windows Azure resource that can be linked to a website is a SQL database. For more information about SQL Databases see [SQL Databases][sqldbs].

For information about how to configure a  website to use other Windows Azure resources see [How to: Configure a Website to Use Other Windows Azure Resources](#howtoconfigother).

####Management Page Icons####
Icons are displayed at the bottom of each of the website's Management pages, several of these icons appear on multiple pages and a couple of Management icons are only displayed on specific pages.  The following icons are displayed at the bottom of the **Dashboard** management page:

- **Browse** - Opens the default page for the website.
- **Stop** - Stops the website.
- **Upload** - Allows you to publish a web application to the website using  a web deploy package.
- **Delete** - Deletes the website.
- **WebMatrix** - Opens supported websites in WebMatrix, allowing you to make changes to the website and publish those changes back to the website on Windows Azure.

The following icons are not displayed at the bottom of the **Dashboard** management page but are on the bottom of other management pages to accomplish particular tasks:

- **Add Metrics** - At the bottom of the **Monitor** management page, allows you to add metrics to the chart displayed on the Monitor management page.
- **Link** - At the bottom of the **Linked Resources** management page, allows you to link the website to other Windows Azure resources, for example if your website needs access to a relational database you can link the website to a SQL Database resource by clicking the Link icon.

--------------------------------------------------------------------------------

##<a name="howtomonitor"></a>How to: Monitor a Website

Websites provide monitoring functionality via the Monitor management page. The Monitor management page provides performance statistics for a web site as described below.

###Website Metrics###

From the website’s Management pages in the Windows Azure Portal, click the **Monitor** tab to display the **Monitor** management page. By default the chart on the **Monitor** page displays the same metrics as the chart on the **Dashboard** page. To view additional metrics for the web site click **Add Metrics** at the bottom of the page to display the **Choose Metrics** dialog box. Click to select additional metrics for display on the **Monitor** page. After selecting the metrics that you want to add to the **Monitor** page click the **Ok** checkmark to add them. After adding metrics to the **Monitor** page, click to enable / disable the option box next to each metric to add / remove the metric from the chart at the top of the page.

To remove metrics from the **Monitor** page, select the metric that you want to remove and then click the **Delete Metric** icon at the bottom of the page.

The following list describes the metrics which can be viewed in the chart on the **Monitor** page:

- **CPUTime** – A measure of the web site’s CPU usage.
- **Requests** – A count of client requests to the web site.
- **Data Out** – A measure of data sent by the website to clients.
- **Data In** – A measure of data received by the website from clients.
- **Http Client Errors** – Number of Http “4xx Client Error” messages sent.
- **Http Server Errors** – Number of Http “5xx Server Error” messages sent.
- **Http Successes** – Number of Http “2xx Success” messages sent.
- **Http Redirects** – Number of Http “3xx Redirection” messages sent.
- **Http 401 errors** – Number of Http “401 Unauthorized” messages sent.
- **Http 403 errors** – Number of Http “403 Forbidden” messages sent.
- **Http 404 errors** – Number of Http “404 Not Found” messages sent.
- **Http 406 errors** – Number of Http “406 Not Acceptable” messages sent.

--------------------------------------------------------------------------------

##<a name="howtoconfigdiagnostics"></a>How to: Configure Diagnostics and Download Logs for a Website

Websites can be configured to capture and log diagnostic information from the website’s **Configure** management page. This topic describes how to capture diagnostics data to log files, download the log files to a local computer and then read the log files.

###Configuring Diagnostics for a Website###

Diagnostics for a website is enabled on the **Configure** management page for the website. Under the **Diagnostics** section of **Configure** management page you can enable or disable the following logging or tracing options:

- **Detailed Error Logging** – Turn on detailed error logging to capture all errors generated by your website.
- **Failed Request Tracing** – Turn on failed request tracing to capture information for failed client requests.
- **Web Server Logging** – Turn on Web Server logging to save website logs using the W3C extended log file format.

After enabling diagnostics for a website, click the **Save** icon at the bottom of the **Configure** management page to apply the options that you have set.

<div class="dev-callout"> 
<b>Important</b> 
<p>Logging and tracing place significant demands on a website. We recommend turning off logging and tracing once you have reproduced the problem(s) that you are troubleshooting.</p> 
</div>

###Downloading Log Files for a Website###

Follow these steps to download log files for a website:

1. Open the website’s **Dashboard** management page and make note of the FTP site listed under **Diagnostics Logs** and the account listed under **Deployment User**. The FTP site is where the log files are located and the account listed under Deployment User is used to authenticate to the FTP site.
2. If you have not yet created deployment credentials, the account listed under **Deployment User** is listed as **Not set**. In this case you must create deployment credentials as described in the Reset Deployment Credentials section of Dashboard because these credentials must be used to authenticate to the FTP site where the log files are stored. Windows Azure does not support authenticating to this FTP site using Live ID credentials.
3. Consider using an FTP client such as [FileZilla][fzilla] to connect to the FTP site. An FTP client provides greater ease of use for specifying credentials and viewing folders on an FTP site than is typically possible with a browser.
4. Copy the log files from the FTP site to your local computer.

###Reading Log Files from a Website###

The log files that are generated after you have enabled logging and / or tracing for a website vary depending on the level of logging / tracing that is set on the Configure management page for the website. The following table summarizes the location of the log files and how the log files may be analyzed:

<table cellpadding="0" cellspacing="0" width="900" rules="all" style="border: #000000 thin solid;">
<tr style="background-color: silver; font-weight: bold;" valign="top"><th style="width: 160px">Log File Type</th><th style="width: 190px">Location</th><th style="width: 600px">Read Files With</th></tr>
<tr><td>Failed Request Tracing</td><td>/LogFiles/W3SVC#########/</td><td><strong>Internet Explorer</strong><br/>
<b>Important</b><br/>
The /LogFiles/W3SVC#########/ folder contains an XSL file and one or more XML files. Ensure that you download the XSL file into the same directory as the XML file(s) because the XSL file provides functionality for formatting and filtering the contents of the XML file(s) when viewed in Internet Explorer.</td></tr>
<tr><td>Detailed Error Logging</td><td>/LogFiles/DetailedErrors/</td><td><strong>Internet Explorer</strong><br/>
The /LogFiles/DetailedErrors/ folder contains one or more .htm files that provide extensive information for any HTTP errors that have occurred. The .htm files include the following sections:<br/><ul>
<li><strong>Detailed Error Information</strong> – Includes information about the error such as <em>Module</em>, <em>Handler</em>, <em>Error Code</em>, and <em>Requested URL</em>.<br/></li>	
<li><strong>Most likely causes:</strong> Lists several possible causes of the error.<br/></li>
<li><strong>Things you can try:</strong> Lists possible solutions for resolving the problem reported by the error.<br/></li>
<li><strong>Links and More Information</strong> – Provides additional summary information about the error and may also include links to other resources such as Microsoft Knowledge Base articles.</li></td></tr>
<tr><td>Web Server Logging</td><td>/LogFiles/http/RawLogs</td><td><strong>Log Parser</strong><br/>
Used to parse and query IIS log files. Log Parser 2.2 is available on the Microsoft Download Center at <a href="http://go.microsoft.com/fwlink/?LinkId=246619">http://go.microsoft.com/fwlink/?LinkId=246619</a>.</td></tr>
</table>


--------------------------------------------------------------------------------

##<a name="howtoconfigother"></a>How to: Configure a Website to Use Other Windows Azure Resources

Websites can be linked to other Windows Azure resources such as a SQL Database to provide additional functionality. Websites can also be configured to use a new or existing MySQL database when creating a website.

###Configure a website to use a SQL Database###

Follow these steps to link a website to a SQL Database:

1. Select **Web Sites** on the left hand side of the Windows Azure portal to display the list of web sites created by the currently logged on account.
2. Select a website from the list of web sites to open the website’s **Management** pages.
3. Click the **Linked Resources** tab and a message will be displayed on the **Linked Resources** page indicating **You have no linked resources**.
4. Click **Link a Resource** to open the **Link Resource** wizard.
5. Click **Create a new resource** to display a list of resources types that can be linked to your website.
6. Click **SQL Database** to display the **Link Database** wizard.
7. Complete required fields on pages 3 and 4 of the **Link Database** wizard and then click the **Finish** checkmark on page 4.

Windows Azure will create a SQL database with the specified parameters and link the database to the website.

###Configure a website to Use a MySQL Database###
To configure a website to use a MySQL database you must create the website with the **Create With Database** option and then specify either to “Use an existing MySQL database” or “Create a new MySQL database.” MySQL databases cannot be added to a website as a linked resource and are not displayed in the Windows Azure Management Portal as a type of cloud resource.

--------------------------------------------------------------------------------

##<a name="howtoscale"></a>How to: Scale a Website

When a website is first created it runs in **Shared** website mode meaning that it shares available with other subscribers that are also running websites in Shared website mode. A single instance of a website configured to run in Shared mode will provide somewhat limited performance when compared to other configurations but should still provides sufficient performance to complete development tasks or proof of concept work. If a website that is configured to run in a single instance using Shared website mode is put into production, the resources available to the website may prove to be inadequate as the average number of client requests increases over time. Before putting a website into production,  estimate the load that the website will be expected to handle and consider scaling up / scaling out the website by changing configuration options available on the website's **Scale** management page. This topic describes the options available on the Scale management page and how to change them.

<strong>Warning</strong><br />Scale options applied to a website are also applied to all websites that meet the following conditions:
<ol>
<li>Are configured to run in Reserved website mode.</li>
<li>Exist in the same region as the website for which scale options are modified.</li>
</ol>
For this reason it is recommended that you configure any  "proof of concept” websites to run in Shared website mode or create the websites in a different region than websites you plan to scale up or scale out.
 
### Change Scale Options for a Website ###
A website that is configured to run in **Shared** website mode has access to the resources associated with an **ExtraSmall** Virtual Machine Size described in the table at [How to: Configure Virtual Machine Sizes][configvmsizes]. To change scale options for a Website, open the website’s **Scale** management page to configure the following scaling options:

- **WebSite Mode** - Set to **Shared** by default, 
When **WebSite Mode** is changed from **Shared** to **Reserved** the website is scaled up to run in a Small compute instance on a single dedicated core with access to additional memory, disk space and bandwidth as described by the table in [How to: Configure Virtual Machine Sizes][configvmsizes]. Before switching a website from **Shared** website mode to **Reserved** website mode you must first remove spending caps in place for your Web Site subscription.
- **Reserved Instance Size** - Provides options for additional scale up of a website running in **Reserved** website mode. If **Reserved Instance Size** is changed from **Small** to **Medium** or **Large**, the website will run in a compute instance of corresponding size with access to associated resources for each size as described by the table in [How to: Configure Virtual Machine Sizes][configvmsizes].
- **Reserved/Shared Instance Count** - Increase this value to provide fault tolerance and improved performance through scale out by running additional website instances. It should be noted that as the value for **Shared Instance Count** increases so does the possibility of exceeding the resources allocated to each Web Site subscription for running websites in Shared website mode. The resources allocated for this purpose are evaluated on a resource usage per day basis. For more information about resource usage quotas see [How to: View Usage Quotas for a Website](#howtoviewusage). 

--------------------------------------------------------------------------------

##<a name="howtoviewusage"></a>How to: View Usage Quotas for a Website

Websites can be configured to run in either **Shared** or **Reserved** website mode from the website’s **Scale** management page. Each Azure subscription has access to a pool of resources provided for the purpose of running up to 10 websites in **Shared** website mode. The pool of resources available to each Web Site subscription for this purpose is shared by other websites in the same geo-region that are configured to run in **Shared** website mode. Because these resources are shared for use by other websites, all subscriptions are limited in their use of these resources. Limits applied to a subscription’s use of these resources are expressed as usage quotas listed under the usage overview section of each website’s **Dashboard** management page.

**Note**  
When a website is configured to run in **Reserved** mode it is allocated dedicated resources equivalent to the **Small** (default), **Medium** or **Large** virtual machine sizes in the table at [How to: Configure Virtual Machine Sizes][configvmsizes]. There are no limits to the resources a subscription can use for running websites in **Reserved** mode however the number of **Reserved** mode websites that can be created per subscription is limited to **100**.
 
### Viewing Usage Quotas for Websites Configured for Shared Website Mode ###
To determine the extent that a website is impacting resource usage quotas, follow these steps:

1. Open the website’s **Dashboard** management page.
2. Under the **usage overview** section the usage quotas for **Data Out**, **CPU Time** and **File System Storage** are displayed. The green bar displayed for each resource indicates how much of a subscription’s resource usage quota is being consumed by the current website and the grey bar displayed for each resource indicates how much of a subscription’s resource usage quota is being consumed by all other shared mode websites associated with your Web Site subscription.

Resource usage quotas help prevent overuse of the following resources:

- **Data Out** – a measure of the amount of data sent from websites running in **Shared** mode to their clients in the current quota interval (24 hours).
- **CPU Time** – the amount of CPU time used by websites running in **Shared** mode for the current quota interval.
- **File System Storage** – The amount of file system storage in use by websites running in **Shared** mode.

When a subscription’s usage quotas are exceeded Windows Azure takes action to stop overuse of resources. This is done to prevent any subscriber from exhausting resources to the detriment of other subscribers.

**Note**<br/>
Since Windows Azure calculates resource usage quotas by measuring the resources used by a subscription’s shared mode websites during a 24 hour quota interval, consider the following:

- As the number of websites configured to run in Shared mode is increased, so is the likelihood of exceeding shared mode resource usage quotas.
Consider reducing the number of websites that are configured to run in Shared mode if resource usage quotas are being exceeded.
- Similarly, as the number of instances of any website running in Shared mode is increased, so is the likelihood of exceeding shared mode resource usage quotas.
Consider scaling back additional instances of shared mode websites if resource usage quotas are being exceeded.

Windows Azure takes the following actions if a subscription's resource usage quotas are exceeded in a quota interval (24 hours):

 - **Data Out** – when this quota is exceeded Windows Azure stops all websites for a subscription which are configured to run in **Shared** mode for the remainder of the current quota interval. Windows Azure will start the websites at the beginning of the next quota interval.
 - **CPU Time** – when this quota is exceeded Windows Azure stops all websites for a subscription which are configured to run in **Shared** mode for the remainder of the current quota interval. Windows Azure will start the websites at the beginning of the next quota interval.
 - **File System Storage** – Windows Azure prevents deployment of any websites for a subscription which are configured to run in Shared mode if the deployment will cause the File System Storage usage quota to be exceeded. When the File System Storage resource has grown to the maximum size allowed by its quota, file system storage remains accessible for read operations but all write operations, including those required for normal website activity are blocked. When this occurs you could configure one or more websites running in Shared website mode to run in Reserved website mode and reduce usage of file system storage below the File System Storage usage quota.

--------------------------------------------------------------------------------

##<a name="howtocreatefromgallery"></a>How to: Create a Website from the Azure Gallery

The Azure Gallery makes available a wide range of popular web applications developed by Microsoft, third party companies and open source software initiatives. Web applications created from the Azure Gallery do not require installation of any software other than the browser used to connect to the Windows Azure portal. When creating websites from the Azure Gallery you should be able to create, deploy, and have a fully operational website running in 3 to 5 minutes.

This topic describes how to create and publish a WordPress blog website from the Azure Gallery to a website.

###Create and Publish a Website from the Azure Gallery to Windows Azure###
Follow these steps to create, deploy and run a WordPress blog website on Windows Azure:

1. Login to the Windows Azure portal.
2. Click the **Create New** icon on the bottom left of the Windows Azure portal.
3. Click the **Web Site** icon, click **From Gallery**, locate and click the WordPress icon in the A-Z list displayed under Find Apps for Azure and then click **Next**.
4. On the Configure Your App/Site Settings page enter or select appropriate values for all fields and click **Next**.

	**Note**
	When choosing a region, select the region that is closest to your target audience. Selecting the region that is closest to the geographical location of your target audience will minimize latency for their connections to your website. If you have not determined the geographical location of your target audience then consider selecting a region in the central U.S. so that latency will be similar for users on both the east and west coasts.
5. On the **Configure Your App/Database Settings** page select **New Database**, enter appropriate values for all fields and then click **Complete**. After you click **Complete** Windows Azure will initiate build and deploy operations. While the website is being built and deployed the status of these operations is displayed at the bottom of the Web Sites page. After all operations are performed a final status message indicates whether the operations succeeded. When this message indicates that operations were successful click **Ok**.
6. Open the website's **Dashboard** management page.
7. On the **Dashboard** management page click the link under **Site Url** to open the site’s welcome page. Enter appropriate configuration information required by WordPress and click **Install Wordpress** to finalize configuration and open the website’s login page.
8. Login to the new WordPress website by entering the username and password that you specified on the **Welcome** page.

--------------------------------------------------------------------------------

##<a name="howtodevdepwebmatrix"></a>How to: Develop and Deploy a Website with Microsoft WebMatrix

This topic describes how to use Microsoft WebMatrix on a development computer to create and deploy a website to Windows Azure.

###<a name="howtocreateanddeployfromwebmatrix"></a>How to: Create and Deploy a Website from Microsoft WebMatrix to Windows Azure

**Note**<br>
Microsoft WebMatrix must be installed on the development computer to complete the steps in this topic. Complete the steps in the following section to install Microsoft WebMatrix on your development computer.

<h4 id="installwebmatrix">Install Microsoft WebMatrix on your Development Computer</h4>

1. Browse to [http://www.microsoft.com/web/webmatrix/][webmatrix] and click **Install WebMatrix**.  After you click **Install WebMatrix** you are directed to a page with a **Install Now** button, click **Install Now**.

	![Install Web Platform Installer 3.0][installwebplat3]

2. After you click **Install Now**,  you will see a prompt at the bottom of the web page to either run or save webmatrix.exe, click **Run**:

	![Run or Save webmatrix.exe][runorsavewebmatrix]

	This will display the dialog box for **Web Platform Installer 3.0**, click **Install**:

	![Install WebMatix][installwebmatrix]

	The Web Platform Installer 3.0 will detect any prerequisites required  for WebMatrix and list all dependencies and software to be installed in the **Web Platform Installation** dialog box:

	![Web Platform Installation][webplatinstall]

3. Click **I Accept** to proceed with installation of all WebMatrix prerequisites and WebMatrix. Upon successfull installation you are presented with a dialog box listing the software that was installed. Click **Finish**.

	![Web Platform Installation Finished][webplatdone]

4. After you click **Finish**, WebMatrix will open. 

####Create, deploy and run the WebMatrix "bakery" sample website on Windows Azure####

Follow these steps to create, deploy and run the  WebMatrix "bakery" sample website on Windows Azure:

1. Login to the Windows Azure Portal.
2. Click the **Create New** icon at the bottom left of the Windows Azure portal.
3. Click the **Web Site** icon, click **Quick Create**, enter a value for **URL** under the **create a new web site** section of this page and then click the checkmark next to **create web site**	at the bottom of this page:

	![Create New website][createnewsite]	

	This will initiate the process for creating the new website on Windows Azure.
4. Once the website is created your browser will display the websites page, listing all of the websites associated with the currently logged on account. Verify that the website you just created has a **Status** of **Running** and then open the website's management pages by clicking the name of the website displayed in the **Name** column. This will open the **Dashboard** page for the new website.
5. From the **Dashboard** page click the link to **Download publish profile** and save the publish profile file to the desktop of your development computer.
6. Open Microsoft WebMatrix. Click **Start, All Programs, Microsoft WebMatrix and then Microsoft WebMatrix**.
7. Click the button immediately to the left of the **Home** tab in the Ribbon, click **New Site**, click **Site from Template**, select the **Bakery** template, enter a value for **Site Name** and then click **OK** to create the website and display the website’s Administration page.
8. Click  **Publish** in the Home ribbon to display **Publish Settings** options for the website.
9. Click  **Import publish settings** under **Common Tasks**, select the publish profile file that you downloaded from Windows Azure and saved to the desktop. Then click **Open** to display the **Publish Settings** dialog box. 
10. Click the **Validate Connection** button to verify connectivity between the WebMatrix computer and the website you created earlier. If you receive a certificate error indicating that the security certificate presented by this server was issued to a different server, check the box next to **Save this certificate for future sessions of WebMatrix** and click **Accept Certificate**.

	![WebMatrix Certificate Error][webmatrixcerterror]
11. After you click **Accept Certificate** the **Publish Settings** dialog box will be displayed, click **Validate Connection**.
12. Once the connection is validated, click **Save** to save publish settings for the website you created in WebMatrix.
13. From the **Publish Settings** dialog box click the dropdown for the Publish button and select Publish. Click **Yes** on the Publish Compatibility dialog box to perform publish compatibility testing and then click **Continue** when publish compatibility tests have completed.
14. Click **Continue** in the Publish Preview dialog box to initiate publication of the site on WebMatrix to Windows Azure.
15. Navigate to the website on Windows Azure to verify it is deployed correctly and is running. The URL for the website is displayed at the bottom of the WebMatrix IDE when publishing is complete. 

	![Publishing Complete][publishcomplete]

16. Click on the URL for the website to open the website in your brower:

	![Bakery Sample Site][bakerysample]

The URL for the website can also be found in the Windows Azure portal by clicking **Web Sites** to display all websites created by the logged on account. The URL for each website is displayed in the URL column on the web sites page.

If you need to delete the web site to avoid usage charges use the **Delete** icon as described in [Delete a Website in Windows Azure](#deleteawebsite).

--------------------------------------------------------------------------------

##<a name="nextsteps"></a>Next Steps
For more information about Websites in see the following:

[Walkthrough: Troubleshooting a Website on Windows Azure](http://go.microsoft.com/fwlink/?LinkId=251824)



[vs2010]:http://go.microsoft.com/fwlink/?LinkId=225683
[msexpressionstudio]:http://go.microsoft.com/fwlink/?LinkID=205116
[mswebmatrix]:http://go.microsoft.com/fwlink/?LinkID=226244
[getgit]:http://go.microsoft.com/fwlink/?LinkId=252533
[azuresdk]:http://go.microsoft.com/fwlink/?LinkId=246928
[gitref]:http://go.microsoft.com/fwlink/?LinkId=246651
[howtoconfiganddownloadlogs]:http://go.microsoft.com/fwlink/?LinkId=252031
[sqldbs]:http://go.microsoft.com/fwlink/?LinkId=246930
[fzilla]:http://go.microsoft.com/fwlink/?LinkId=247914
[configvmsizes]:http://go.microsoft.com/fwlink/?LinkID=236449
[webmatrix]:http://go.microsoft.com/fwlink/?LinkId=226244

[installwebplat3]: ..\Media\howtoWebPI3installer.png
[runorsavewebmatrix]: ..\Media\howtorunorsavewebmatrix.png
[installwebmatrix]: ..\Media\howtoinstallwebmatrix.png
[webplatinstall]: ..\Media\howtowebplatforminstallation.png
[webplatdone]: ..\Media\howtofinish.png
[createnewsite]: ..\Media\howtocreatenewsite.png
[webmatrixcerterror]: ..\Media\howtocertificateerror.png
[publishcomplete]: ..\Media\howtopublished.png
[bakerysample]: ..\Media\howtobakerysamplesite.png