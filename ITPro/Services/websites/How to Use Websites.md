<!-- See http://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-queues/#create-provider for reference -->
# How to Use Web Sites #

This guide will show you how to use Web Sites. The scenarios covered in this guide include creating, configuring, managing and monitoring web sites in Windows Azure.

## Table of Contents ##

- [What are Web Sites?](#whatarewebsites)
- [How to: Create, Deploy and Delete a Web Site](#howtocreatedeploydelete)
- [How to: Change Configuration Options for a Web Site](#howtochangeconfig)
- [How to: Manage a Web Site](#howtomanage)
- [How to: Monitor a Web Site](#howtomonitor)
- [How to: Configure Diagnostics and Download Logs for a Web Site](#howtoconfigdiagnostics)
- [How to: Configure a Web Site to Use Other Windows Azure Resources](#howtoconfigother)
- [How to: Scale a Web Site](#howtoscale)
- [How to: View Usage Quotas for a Web Site](#howtoviewusage)
- [How to: Create a Web Site from the Gallery](#howtocreatefromgallery)
- [How to: Develop and Deploy a Web Site with Microsoft WebMatrix](#howtodevdepwebmatrix)
- [Next Steps](#nextsteps)

##<a name="whatarewebsites"></a>What are Web Sites?
Web sites are web application hosts which support popular web application technologies such as .NET, Node.js and PHP without requiring any code changes to existing applications.  All of the common programming models and resources that .NET, Node.js and PHP developers use to access resources such as files and databases will continue to work as expected on web sites deployed to Windows Azure.  Web sites provide access to file and database resources and to  all of the standard configuration files (such as web.config, php.ini and config.js) used by web applications today. A web site is the host for a web application running in the cloud that you can control and manage. 

--------------------------------------------------------------------------------

##<a name="howtocreatedeploydelete"></a>How to: Create, Deploy and Delete a Web Site

Just as you can quickly create and deploy a web application created from the gallery, you can also deploy a web site created on a workstation with traditional developer tools from Microsoft or other companies. This topic describes how to [Create a Web Site in Windows Azure](#createawebsite), deploy your web site as described in [Deploy a Web Site to Windows Azure](#deployawebsite) and delete a web site in [Delete a Web Site in Windows Azure](#deleteawebsite).

### Development Tools for Creating a Web Site ###
Some development tools available from Microsoft include [Microsoft Visual Studio 2010][VS2010], [Microsoft Expression Studio 4][msexpressionstudio] and [Microsoft WebMatrix][mswebmatrix], a free web development tool from Microsoft which provides essential functionality for web site development. 

###<a name="createawebsite"></a>Create a Web Site in Windows Azure
Follow these steps to create a web site in Windows Azure.
	
1. Login to the Windows Azure portal.
2. Click the **Create New** icon on the bottom left of the Windows Azure portal.
3. Click the **Web Site** icon, click the **Quick Create** icon, enter a value for URL and then click the check mark next to create web site on the bottom right corner of the page.
4. When the web site has been created you will see the text **Creation of Web Site '[SITENAME]'  Completed**.
5. Click the name of the web site displayed in the list of web sites to open the web site’s **Quick Start** management page.
6. On the **Quick Start** page you are provided with options to set up TFS or GIT publishing if you would like to deploy your finished web site to Windows Azure using these methods. FTP publishing is set up by default for web sites and the FTP Host name is displayed under **FTP Hostname** on the **Quick Start** and **Dashboard** pages. Before publishing with FTP or GIT choose the option to **Reset deployment credentials** on the **Dashboard** page. Then specify the new credentials (username and password) to authenticate against the FTP Host or the Git Repository when deploying content to the web site.
7. The **Configure** management page exposes several configurable application settings in the following sections:
> - **Framework** – Set the version of .NET framework or PHP required by your web application.
> - **Diagnostics** – Set logging options for gathering diagnostic information for your web site in this section.
> - **App Settings** – Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be injected into your .NET configuration **AppSettings** at runtime, overriding existing settings. For PHP and Node sites these settings will be available as environment variables at runtime.
> - **Connection Strings** – View connection strings for linked resources. For .NET sites, these connection strings will be injected into your .NET configuration **connectionStrings** settings at runtime, overriding existing entries where the key equals the linked database name. For PHP and Node sites these settings will be available as environment variables at runtime.
> - **Default Documents** – Add your web application’s default document to this list if it is not already in the list. If your web application contains more than one of the files in the list then make sure your web site’s default document appears at the top of the list.

###<a name="deployawebsite"></a>Deploy a Web Site to Windows Azure
Windows Azure supports deploying web sites from remote computers using WebDeploy, FTP, GIT or TFS. Many development tools provide integrated support for publication using one or more of these methods and may only require that you provide the necessary credentials, site URL and hostname or URL for your chosen deployment method. Credentials and deployment URLs for all enabled deployment methods are stored in the web site’s publish profile, a file which can be downloaded from the **Quick Start** page or the **quick glance** section of the **Dashboard** page. If you prefer to deploy your web site with a separate client application, high quality open source GIT and FTP clients are available for download on the Internet for this purpose.

#### Deploy a Web Site from Git ####
If you use a Git for source code control, you can publish your app directly from a local Git repository to a web site. Git is a free, open-source, distributed version control system that handles small to very large projects. To use Git with your web site, you must set up Git publishing from the Quick Start or Dashboard management pages for your web site. After you set up Git publishing, each .Git push initiates a new deployment. You'll manage your Git deployments on the Deployments management page.

**Tip**  
After you create your web site, use **Set up Git Publishing** from the **Quick Start** or **Dashboard** management pages to set up Git publishing for the web site. If you're new to Git, you'll be guided through creating a Git account and a local repository for your web site. You'll see the exact Git commands that you need to enter, including the Git repository URLs to use with your web site.

#### Set up Git Publishing ####
**To set up Git publishing**

1. Create a web site in Windows Azure. (**Create New - Web Site**)
2. From the **Quick Start** management page, click **Set up Git publishing**.

Follow the instructions to create a deployment user account by specifying a username and password to use for deploying with Git and FTP, if you haven’t done that already. A Git repository will be created for the web site that you are managing.

#### Push your local Git repository to Windows Azure ####
The following procedures below will walk you through creating a new repository or cloning an existing repository and then pushing your content to the Git repository for the web site.

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
>	 The commands above will vary depending upon the name of the web site for which you have created the Git repository.
 
#### To clone a web site to my computer ####
1. Install the Git client. ([Download Git][getgit]) if you have not already.
2. Clone your web site.
3. Open a command prompt, change directories to the directory where you want your files, and type:

		git clone -b master <GitRepositoryURL>
 
	where <em>GitRepositoryURL</em> is the URL for the Git repository that you want to clone.

4. Commit changes, and push the repository's contents back to Windows Azure.

5. After changing or adding some files, change directories your app's root directory and type:

  		git add.
		git commit -m "some changes"
		git push
 
After deployment begins, you can monitor the deployment status on the **Deployments** management page. When the deployment completes, click **Browse** to open your web site in a browser.

###<a name="deleteawebsite"></a>Delete a Web Site in Windows Azure
Web sites are deleted using the **Delete** icon in the Windows Azure portal. The **Delete** icon is available in the Windows Azure portal when you click **Web Sites** to list all of your web sites and at the bottom of each of the web site management pages.

-------------------------------------------------------------------------------

##<a name="howtochangeconfig"></a>How to: Change Configuration Options for a Web Site

Configuration options for web sites are set on the Configure management page for the web site. This topic describes how to use the Configure management page to modify configuration options for a web site.

### Change configuration options for a web site ###

Follow these steps to change configuration options for a web site.

<ol>
	<li>Open the web site’s management pages from the Windows Azure Portal.</li>
	<li>Click the <strong>Configure</strong> tab to open the <strong>Configure</strong> management page.</li>
	<li>Set the following configuration options for the web site as appropriate:
	<ul>
	<li style="margin-left: 40px"><strong>framework</strong> – Set the version of .NET framework or PHP required by your web application.</li>
	<li style="margin-left: 40px"><strong>hostnames</strong> – Enter additional hostnames for the web site here. Additional hostnames are limited to changing only the 
	portion of the fully qualified “dot delimited” domain name that precedes the first period or “dot”. For example if the original web site name is MySite.azure-test.windows.net then additional hostnames must use the nomenclature newhostname.azure-test.windows.net and retain the first period plus everything to the right of the first period.<br /><strong>Note</strong><br />Functionality 
	for adding additional web site hostnames is only available when the web site is configured with the <strong>Reserved</strong> Web Site Mode,  as specified on the <strong>Scale</strong> management page.</li>
	<li style="margin-left: 40px"><strong>diagnostics</strong> – Set options for gathering diagnostic 
	information for your web site including:
	<ul>
	<li style="margin-left: 60px"><strong>Web Server Logging</strong> – Specify whether to enable web server logging for the web site. 
	If enabled, web server logs are saved with the W3C extended log file format to the FTP site listed under Diagnostic Logs on the 
	Dashboard management page. After connecting to the specified FTP site navigate to /wwwroot/LogFiles/http/RawLogs/ to retrieve the web server logs.</li>
	<li style="margin-left: 60px"><strong>Detailed Error Messages</strong> – Specify whether to log detailed error messages for the web site. 
	If enabled, detailed error messages are saved as .htm files to the FTP site listed under Diagnostic Logs on the Dashboard management page. 
	After connecting to the specified FTP site navigate to /LogFiles/DetailedErrors/ to retrieve the .htm files which contain detailed error messages.</li>
	<li style="margin-left: 60px"><strong>Failed Request Tracing</strong> – Specify whether to enable failed request tracing. If enabled, 
	failed request tracing output is written to XML files and saved to the FTP site listed under Diagnostic Logs on the Dashboard management page. 
	After connecting to the specified FTP site navigate to /LogFiles/W3SVC######### (where ######### represent a unique identifier for the web site) 
	to retrieve the XML files that contain the failed request tracing output.<br /><strong>Important</strong><br />The /LogFiles/W3SVC#########/ 
	folder contains an XSL file and one or more XML files. Ensure that you download the XSL file into the same directory as the XML file(s) because 
	the XSL file provides functionality for formatting and filtering the contents of the XML file(s) when viewed in Internet Explorer. For more information about 
	configuring diagnostics for Web Sites see <a href="#howtoconfigdiagnostics">How to: Configure Diagnostics and Download Logs for a Web Site</a>.</li>
	</ul>
	</li>
	<li><strong>App Settings</strong> – Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be 
	injected into your .NET configuration AppSettings at runtime, overriding existing settings. For PHP and Node sites these settings will be 
	available as environment variables at runtime.</li>
	<li><strong>Connections Strings</strong> – View connection strings for linked resources. For .NET sites, these connection strings will be injected into your 
	.NET configuration connectionStrings settings at runtime, overriding existing entries where the key equals the linked database name. For PHP 
	and Node sites these settings will be available as environment variables at runtime.<br />
	<strong>Note</strong><br />Connection strings are created when you link a database resource to a web site and are read only when viewed on the 
	configuration management page.</li>
	<li><strong>Default Documents</strong> – Add your web site’s default document to this list if it is not already in the list. A web site’s default 
	document is the web page that is displayed when a user navigates to a web site and does not specify a particular page on the web site. So given the 
	web site http://contoso.com, if the default document is set to default.htm, a user would be routed to http://www.contoso.com/default.htm when pointing 
	their browser to http://www.contoso.com. If your web site contains more than one of the files in the list then make sure your web site’s default document 
	is at the top of the list by changing the order of the files in the list.</li>
	</ul></li>
	<li>Click <strong>Save</strong> at the bottom of the <strong>Configure</strong> management page to save configuration changes.</li>
</ol>

--------------------------------------------------------------------------------

##<a name="howtomanage"></a>How to: Manage a Web Site

You manage your web sites with a set of Management pages.

**Windows Azure Portal Web Site Management Pages** – Each web site management page is described below.

#### QuickStart ####
The **QuickStart** management page includes the following sections:

- **get the tools** – Provides links to [Install WebMatrix][mswebmatrix] and the [Azure SDK][azuresdk].
- **publish from local environment** – Provides links to download the web site’s publishing profile and reset deployment credentials for the web site.
- **publish from source control** – Includes links for setting up TFS publishing and GIT publishing.

For more information about developing and deploying web sites see the following topics:

- [How to: Create, Deploy and Delete Web Site](#howtocreatedeploydelete)
- [How to: Develop and Deploy a Web Site with Microsoft WebMatrix](#howtodevdepwebmatrix)
- [How to: Create a Web Site from the Gallery](#howtocreatefromgallery)

#### Dashboard ####
The **Dashboard** management page includes the following:

 - A chart which summarizes web site usage as measurements of certain metrics.

> - **CPU Time** – a measure of the web site’s CPU usage.
> - **Requests** – a count of all client requests to the web site.
> - **Data Out** – a measure of data sent by the web site to clients.
> -  **Data In** – a measure of data received by the web site from clients.
> - **Http Client Errors** – number of Http “4xx Client Error” messages sent.
> - **Http Server Errors** – number of Http “5xx Server Error” messages sent.

 > **Note**<br/>
To see a chart with additional performance metrics, configure the chart displayed on the **Monitor** management page as described in [How to: Monitor a Web Site](#howtomonitor).

 - A list of all linked resources associated with this web site or if no resources are associated, a hyperlink to the **Linked Resources** management page.
 - A **quick glance** section which includes the following summary information and links:

> - **Download Publish Profile** – Link to the publish profile, a file which contains credentials and URLs required to publish to the web site using any enabled publishing methods.
> - **Reset Deployment Credentials** – Displays a dialog box where you provide unique credentials for use when publishing with GIT or FTP. If you wish to use GIT or FTP deployment then you must reset deployment credentials because authentication to an FTP host or GIT repository with Live ID credentials is not supported. Once you reset deployment credentials you can use these credentials for GIT or FTP publishing to any web site in your subscription.
> - **Set up TFS publishing** – Displays a dialog box where you can set up publishing from Team Foundation Service.
> - **Set up Git publishing** – Creates a GIT repository for the web site so that you can publish to the web site using GIT.
> - **Status** – Indicates whether the web site is running or not.
> - **Site Url** – Specifies the publicly accessibly address of the web site on the internet.
> - **Location** – Specifies the physical region of the datacenter that hosts the web site.
> - **Compute Mode** – Specifies whether the web site is running in Reserved or Shared mode. For more information about web site modes see [How to: Scale a Web Site](#howtoscale).
> - **Subscription ID** – Specifies the actual unique subscription ID of the subscription that the web site is associated with.
> - **FTP Hostname** – Specifies the URL to use when publishing to the web site over FTP.
> - **Deployment User** – Indicates the account used when deploying the web site to Windows Azure over FTP or GIT.
> - **Diagnostic Logs** – Specifies the location of the web site’s diagnostic logs if diagnostic logging is enabled on the **Configure** management page.
> - **GIT Clone URL** – URL of the GIT repository for the web site. For information about making a copy of a remote GIT repository see the **git clone** section of the [GIT Reference for Getting and Creating Projects][gitref].<br/>
 > 	**Note**<br/>
**GIT Clone URL** is not available until you click the link to **Set up GIT publishing** and create a GIT repository.

####Deployments####
 The **Deployments** management page provides a summary of all deployments made to the web site using either GIT or TFS. If no GIT or TFS deployments have been made and GIT publishing has been configured for the web site the **Deployments** management page provides information describing how to use GIT to deploy your web application to the web site.

####Monitor####
The **Monitor** management page provides a chart that displays usage information for the web site. By default this chart displays the same metrics as the chart on the **Dashboard** page as described above in the Dashboard section. The chart can also be configured to display the metrics Http Successes, Http Redirects, Http 401 errors, Http 403 errors, Http 404 errors and Http 406 errors. For more information about these metrics see [How to: Monitor a Web Site](#howtomonitor).

####Configure####
The **Configure** management page is used to set application specific settings including:

- **Framework** – Set the version of .NET framework or PHP required by your web application.
- **Diagnostics** – Set logging options for gathering diagnostic information for your web site in this section. For more information about configuring diagnostics see [How to: Configure Diagnostics and Download Logs for a Web Site][howtoconfiganddownloadlogs].
- **App Settings** – Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be injected into the web site’s .NET configuration AppSettings at runtime, overriding existing settings. For PHP and Node web sites, these settings will be available as environment variables at runtime.
- **Connections Strings** – View connection strings to linked resources. For .NET sites, these connection strings will be injected into the web site’s .NET configuration connectionStrings settings at runtime, overriding any existing entries where the key equals the linked database name. For PHP and Node web sites, these settings will be available as environment variables at runtime.
- **Default Documents** – Add your web site’s default document to this list if it is not already in the list. If your web site contains more than one of the files in the list then make sure your web site’s default document appears at the top of the list by changing the order of the files in the list.

For more information about how to configure a Web site see [How to: Change Configuration Options for a Web Site](#howtochangeconfig).

####Scale####
The **Scale** management page is used to specify the web site mode (either **Shared** or **Reserved**), the size of the web site if it is configured as **Reserved** (**Small**, **Medium** or **Large**) and the value for **Reserved Instance Count** (from 1 to 3). A web site that is configured as **Reserved** will provide more consistent performance than a web site that is configured as **Shared**. A web site that is configured with a larger **Reserved Instance Size** will perform better under load. Increasing the value for **Reserved Instance Count** will provide fault tolerance and improved performance through scale out. For more information about configuring scale options for a web site see [How to: Scale a Web Site](#howtoscale).

####Linked Resources####
The **Linked Resources** management page provides a summary of all Windows Azure resources that your web site is using. At the time of this writing, the only type of Windows Azure resource that can be linked to a web site is a SQL database. For more information about SQL Databases see [SQL Databases][sqldbs].

For information about how to configure a  web site to use other Windows Azure resources see [How to: Configure a Web Site to Use Other Windows Azure Resources](#howtoconfigother).

####Management Page Icons####
Icons are displayed at the bottom of each of the web site's Management pages, several of these icons appear on multiple pages and a couple of Management icons are only displayed on specific pages.  The following icons are displayed at the bottom of the **Dashboard** management page:

- **Browse** - Opens the default page for the web site.
- **Stop** - Stops the web site.
- **Upload** - Allows you to publish a web application to the web site using  a web deploy package.
- **Delete** - Deletes the web site.
- **WebMatrix** - Opens supported web sites in WebMatrix, allowing you to make changes to the web site and publish those changes back to the web site on Windows Azure.

The following icons are not displayed at the bottom of the **Dashboard** management page but are on the bottom of other management pages to accomplish particular tasks:

- **Add Metrics** - At the bottom of the **Monitor** management page, allows you to add metrics to the chart displayed on the Monitor management page.
- **Link** - At the bottom of the **Linked Resources** management page, allows you to link the web site to other Windows Azure resources, for example if your web site needs access to a relational database you can link the web site to a SQL Database resource by clicking the Link icon.

--------------------------------------------------------------------------------

##<a name="howtomonitor"></a>How to: Monitor a Web Site

Web Sites provides monitoring functionality via the Monitor management page. The Monitor management page provides performance statistics for a web site as described below.

###Web Site Metrics###

From the web site’s Management pages in the Windows Azure Portal, click the **Monitor** tab to display the **Monitor** management page. By default the chart on the **Monitor** page displays the same metrics as the chart on the **Dashboard** page. To view additional metrics for the web site, click **Add Metrics** at the bottom of the page to display the **Choose Metrics** dialog box. Click to select additional metrics for display on the **Monitor** page. After selecting the metrics that you want to add to the **Monitor** page click the **Ok** checkmark to add them. After adding metrics to the **Monitor** page, click to enable / disable the option box next to each metric to add / remove the metric from the chart at the top of the page.

To remove metrics from the **Monitor** page, select the metric that you want to remove and then click the **Delete Metric** icon at the bottom of the page.

The following list describes the metrics which can be viewed in the chart on the **Monitor** page:

- **CPUTime** – A measure of the web site’s CPU usage.
- **Requests** – A count of client requests to the web site.
- **Data Out** – A measure of data sent by the web site to clients.
- **Data In** – A measure of data received by the web site from clients.
- **Http Client Errors** – Number of Http “4xx Client Error” messages sent.
- **Http Server Errors** – Number of Http “5xx Server Error” messages sent.
- **Http Successes** – Number of Http “2xx Success” messages sent.
- **Http Redirects** – Number of Http “3xx Redirection” messages sent.
- **Http 401 errors** – Number of Http “401 Unauthorized” messages sent.
- **Http 403 errors** – Number of Http “403 Forbidden” messages sent.
- **Http 404 errors** – Number of Http “404 Not Found” messages sent.
- **Http 406 errors** – Number of Http “406 Not Acceptable” messages sent.

--------------------------------------------------------------------------------

##<a name="howtoconfigdiagnostics"></a>How to: Configure Diagnostics and Download Logs for a Web Site

Web sites can be configured to capture and log diagnostic information from the web site’s **Configure** management page. This topic describes how to capture diagnostics data to log files, download the log files to a local computer and then read the log files.

###Configuring Diagnostics for a Web Site###

Diagnostics for a web site is enabled on the **Configure** management page for the web site. Under the **Diagnostics** section of **Configure** management page you can enable or disable the following logging or tracing options:

- **Detailed Error Logging** – Turn on detailed error logging to capture all errors generated by your web site.
- **Failed Request Tracing** – Turn on failed request tracing to capture information for failed client requests.
- **Web Server Logging** – Turn on Web Server logging to save web site logs using the W3C extended log file format.

After enabling diagnostics for a web site, click the **Save** icon at the bottom of the **Configure** management page to apply the options that you have set.

<div class="dev-callout"> 
<b>Important</b> 
<p>Logging and tracing place significant demands on a web site. We recommend turning off logging and tracing once you have reproduced the problem(s) that you are troubleshooting.</p> 
</div>

###Downloading Log Files for a Web Site###

Follow these steps to download log files for a web site:

1. Open the web site’s **Dashboard** management page and make note of the FTP site listed under **Diagnostics Logs** and the account listed under **Deployment User**. The FTP site is where the log files are located and the account listed under Deployment User is used to authenticate to the FTP site.
2. If you have not yet created deployment credentials, the account listed under **Deployment User** is listed as **Not set**. In this case you must create deployment credentials as described in the Reset Deployment Credentials section of Dashboard because these credentials must be used to authenticate to the FTP site where the log files are stored. Windows Azure does not support authenticating to this FTP site using Live ID credentials.
3. Consider using an FTP client such as [FileZilla][fzilla] to connect to the FTP site. An FTP client provides greater ease of use for specifying credentials and viewing folders on an FTP site than is typically possible with a browser.
4. Copy the log files from the FTP site to your local computer.

###Reading Log Files from a Web Site###

The log files that are generated after you have enabled logging and / or tracing for a web site vary depending on the level of logging / tracing that is set on the Configure management page for the web site. The following table summarizes the location of the log files and how the log files may be analyzed:

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

##<a name="howtoconfigother"></a>How to: Configure a Web Site to Use Other Windows Azure Resources

Web sites can be linked to other Windows Azure resources such as a SQL Database to provide additional functionality. Web sites can also be configured to use a new or existing MySQL database when creating a web site.

###Configure a web site to use a SQL Database###

Follow these steps to link a web site to a SQL Database:

1. Select **Web Sites** on the left hand side of the Windows Azure portal to display the list of web sites created by the currently logged on account.
2. Select a web site from the list of web sites to open the web site’s **Management** pages.
3. Click the **Linked Resources** tab and a message will be displayed on the **Linked Resources** page indicating **You have no linked resources**.
4. Click **Link a Resource** to open the **Link Resource** wizard.
5. Click **Create a new resource** to display a list of resources types that can be linked to your web site.
6. Click **SQL Database** to display the **Link Database** wizard.
7. Complete required fields on pages 3 and 4 of the **Link Database** wizard and then click the **Finish** checkmark on page 4.

Windows Azure will create a SQL database with the specified parameters and link the database to the web site.

###Configure a web site to Use a MySQL Database###
To configure a web site to use a MySQL database you must create the web site with the **Create With Database** option and then specify either to “Use an existing MySQL database” or “Create a new MySQL database.” MySQL databases cannot be added to a web site as a linked resource and are not displayed in the Windows Azure Management Portal as a type of cloud resource.

--------------------------------------------------------------------------------

##<a name="howtoscale"></a>How to: Scale a Web Site

When a web site is first created it runs in **Shared** web site mode meaning that it shares available with other subscribers that are also running web sites in Shared web site mode. A single instance of a web site configured to run in Shared mode will provide somewhat limited performance when compared to other configurations but should still provides sufficient performance to complete development tasks or proof of concept work. If a web site that is configured to run in a single instance using Shared web site mode is put into production, the resources available to the web site may prove to be inadequate as the average number of client requests increases over time. Before putting a web site into production,  estimate the load that the web site will be expected to handle and consider scaling up / scaling out the web site by changing configuration options available on the web site's **Scale** management page. This topic describes the options available on the Scale management page and how to change them.

<strong>Warning</strong><br />Scale options applied to a web site are also applied to all web sites that meet the following conditions:
<ol>
<li>Are configured to run in Reserved web site mode.</li>
<li>Exist in the same region as the web site for which scale options are modified.</li>
</ol>
For this reason it is recommended that you configure any  "proof of concept” web sites to run in Shared web site mode or create the web sites in a different region than websites you plan to scale up or scale out.
 
### Change Scale Options for a Web Site ###
A web site that is configured to run in **Shared** web site mode has access to the resources associated with an **ExtraSmall** Virtual Machine Size described in the table at [How to: Configure Virtual Machine Sizes][configvmsizes]. To change scale options for a web site, open the web site’s **Scale** management page to configure the following scaling options:

- **Web Site Mode** - Set to **Shared** by default, 
When **Web Site Mode** is changed from **Shared** to **Reserved** the web site is scaled up to run in a Small compute instance on a single dedicated core with access to additional memory, disk space and bandwidth as described by the table in [How to: Configure Virtual Machine Sizes][configvmsizes]. Before switching a web site from **Shared** web site mode to **Reserved** web site mode you must first remove spending caps in place for your Web Site subscription.
- **Reserved Instance Size** - Provides options for additional scale up of a web site running in **Reserved** web site mode. If **Reserved Instance Size** is changed from **Small** to **Medium** or **Large**, the web site will run in a compute instance of corresponding size with access to associated resources for each size as described by the table in [How to: Configure Virtual Machine Sizes][configvmsizes].
- **Reserved/Shared Instance Count** - Increase this value to provide fault tolerance and improved performance through scale out by running additional web site instances. It should be noted that as the value for **Shared Instance Count** increases so does the possibility of exceeding the resources allocated to each Web Site subscription for running web sites in Shared web site mode. The resources allocated for this purpose are evaluated on a resource usage per day basis. For more information about resource usage quotas see [How to: View Usage Quotas for a Web Site](#howtoviewusage). 

--------------------------------------------------------------------------------

##<a name="howtoviewusage"></a>How to: View Usage Quotas for a Web Site

Web sites can be configured to run in either **Shared** or **Reserved** web site mode from the web site’s **Scale** management page. Each Azure subscription has access to a pool of resources provided for the purpose of running up to 10 web sites in **Shared** web site mode. The pool of resources available to each Web Site subscription for this purpose is shared by other web sites in the same geo-region that are configured to run in **Shared** web site mode. Because these resources are shared for use by other web sites, all subscriptions are limited in their use of these resources. Limits applied to a subscription’s use of these resources are expressed as usage quotas listed under the usage overview section of each web site’s **Dashboard** management page.

**Note**  
When a web site is configured to run in **Reserved** mode it is allocated dedicated resources equivalent to the **Small** (default), **Medium** or **Large** virtual machine sizes in the table at [How to: Configure Virtual Machine Sizes][configvmsizes]. There are no limits to the resources a subscription can use for running web sites in **Reserved** mode however the number of **Reserved** mode web sites that can be created per subscription is limited to **100**.
 
### Viewing Usage Quotas for Web Sites Configured for Shared Web Site Mode ###
To determine the extent that a web site is impacting resource usage quotas, follow these steps:

1. Open the web site’s **Dashboard** management page.
2. Under the **usage overview** section the usage quotas for **Data Out**, **CPU Time** and **File System Storage** are displayed. The green bar displayed for each resource indicates how much of a subscription’s resource usage quota is being consumed by the current web site and the grey bar displayed for each resource indicates how much of a subscription’s resource usage quota is being consumed by all other shared mode web sites associated with your Web Site subscription.

Resource usage quotas help prevent overuse of the following resources:

- **Data Out** – a measure of the amount of data sent from web sites running in **Shared** mode to their clients in the current quota interval (24 hours).
- **CPU Time** – the amount of CPU time used by web sites running in **Shared** mode for the current quota interval.
- **File System Storage** – The amount of file system storage in use by web sites running in **Shared** mode.

When a subscription’s usage quotas are exceeded Windows Azure takes action to stop overuse of resources. This is done to prevent any subscriber from exhausting resources to the detriment of other subscribers.

**Note**<br/>
Since Windows Azure calculates resource usage quotas by measuring the resources used by a subscription’s shared mode web sites during a 24 hour quota interval, consider the following:

- As the number of web sites configured to run in Shared mode is increased, so is the likelihood of exceeding shared mode resource usage quotas.
Consider reducing the number of web sites that are configured to run in Shared mode if resource usage quotas are being exceeded.
- Similarly, as the number of instances of any web site running in Shared mode is increased, so is the likelihood of exceeding shared mode resource usage quotas.
Consider scaling back additional instances of shared mode web sites if resource usage quotas are being exceeded.

Windows Azure takes the following actions if a subscription's resource usage quotas are exceeded in a quota interval (24 hours):

 - **Data Out** – when this quota is exceeded Windows Azure stops all web sites for a subscription which are configured to run in **Shared** mode for the remainder of the current quota interval. Windows Azure will start the web sites at the beginning of the next quota interval.
 - **CPU Time** – when this quota is exceeded Windows Azure stops all web sites for a subscription which are configured to run in **Shared** mode for the remainder of the current quota interval. Windows Azure will start the web sites at the beginning of the next quota interval.
 - **File System Storage** – Windows Azure prevents deployment of any web sites for a subscription which are configured to run in Shared mode if the deployment will cause the File System Storage usage quota to be exceeded. When the File System Storage resource has grown to the maximum size allowed by its quota, file system storage remains accessible for read operations but all write operations, including those required for normal web site activity are blocked. When this occurs you could configure one or more web sites running in Shared web site mode to run in Reserved web site mode and reduce usage of file system storage below the File System Storage usage quota.

--------------------------------------------------------------------------------

##<a name="howtocreatefromgallery"></a>How to: Create a Web Site from the Gallery

<div chunk="../../../Shared/Chunks/website-from-gallery.md" />

--------------------------------------------------------------------------------

##<a name="nextsteps"></a>Next Steps
For more information about Web Sites, see the following:

[Walkthrough: Troubleshooting a Web Site on Windows Azure](http://go.microsoft.com/fwlink/?LinkId=251824)



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
