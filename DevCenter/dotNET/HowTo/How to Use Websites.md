<!-- See http://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-queues/#create-provider for reference -->
# How to Use Web Sites #

This guide will show you how to use Web Sites. The scenarios covered in this guide include creating, configuring, managing and monitoring instances of a Web Site host, referred to as a website, on Windows Azure.

## Table of Contents ##
- [What is a Web Site?](#whatisaweb_site)
- [How to: Create, Deploy and Delete a Web Site](#howtocreatedeploydelete)
- [How to: Change Configuration Options for a Web Site](#howtochangeconfig)
- [How to: Manage a Web Site](#howtomanage)
- [How to: Monitor a Website](#howtomonitor)
- [How to: Configure Diagnostics and Download Logs for a Website](#howtoconfigdiagnostics)
- [How to: Configure a Web Site to Use Other Windows Azure Resources](#howtoconfigother)
- [How to: Scale a Web Site](#howtoscale)
- [How to: View Usage Quotas for a Web Site](#howtoviewusage)
- [How to: Create a Web Site from the Gallery](#howtocreatefromgallery)
- [How to: Develop and Deploy a Web Site with Microsoft WebMatrix](#howtodevdepwebmatrix)
- [Next Steps](#nextsteps)

##<a name="whatisaweb_site"></a>What is a Web Site?
A Web Site is a web application host on Windows Azure that supports popular web application technologies such as .NET, Node.js and PHP without requiring any code changes to existing applications.  All of the common programming models and resources that .NET, Node.js and PHP developers use to access resources such as files and databases will continue to work as expected on instances of a Web Site deployed to Windows Azure.  Web Sites provide access to file and database resources and to  all of the standard configuration files (such as web.config, php.ini and config.js) used by web applications today. A Web Site host instance running in the cloud that you can control and manage is referred to as a website. 

--------------------------------------------------------------------------------

##<a name="howtocreatedeploydelete"></a>How to: Create, Deploy and Delete a Web Site

Just as you can quickly create and deploy a web application created from the gallery, you can also deploy a Web Site created on a workstation with traditional developer tools from Microsoft or other companies. This topic describes how to [Create a Web Site in Windows Azure](#createaweb_site), deploy a Web Site as described in [Deploy a Web Site to Windows Azure](#deployaweb_site) and delete a Web Site in [Delete a Web Site in Windows Azure](#deleteaweb_site).

### Development Tools for Creating a Web Application to run in a Website ###
Some development tools available from Microsoft include [Microsoft Visual Studio 2010][VS2010], [Microsoft Expression Studio 4][msexpressionstudio] and [Microsoft WebMatrix][mswebmatrix], a free web development tool from Microsoft which provides essential functionality for web application development. 

###<a name="createaweb_site"></a>Create a Web Site in Windows Azure
Follow these steps to create a Web Site in Windows Azure.

1. Login to the Windows Azure portal.
2. Click the **Create New** icon on the bottom left of the Windows Azure portal.
3. Click the **Web Site** icon, click the **Quick Create** icon, enter a value for URL and then click the check mark next to **create web site** on the bottom right corner of the page.
4. When the web site has been created you will see the text **Creation of Web Site '[SITENAME]'  Completed**.
5. Click the name of the Web Site displayed in the list of Web Sites to open the Web Site’s **Quick Start** management page.
6. On the **Quick Start** page you are provided with options to set up TFS or GIT publishing if you would like to deploy your finished Web Site to Windows Azure using these methods. FTP publishing is set up by default for Web Sites and the FTP Host name is displayed under **FTP Hostname** on the **Quick Start** and **Dashboard** pages. Before publishing with FTP or GIT choose the option to **Reset deployment credentials** on the **Dashboard** page. Then specify the new credentials (username and password) to authenticate against the FTP Host or the Git Repository when deploying a Web Site to Windows Azure.
7. The **Configure** management page exposes several configurable application settings in the following sections:
  - **Framework** – Set the version of .NET framework or PHP required by your web application.
  - **Diagnostics** – Set logging options for gathering diagnostic information for your Web Site in this section.
  - **App Settings** – Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be injected into your .NET configuration **AppSettings** at runtime, overriding existing settings. For PHP and Node sites these settings will be available as environment variables at runtime.
  - **Connection Strings** – View connection strings for linked resources. For .NET sites, these connection strings will be injected into your .NET configuration **connectionStrings** settings at runtime, overriding existing entries where the key equals the linked database name. For PHP and Node sites these settings will be available as environment variables at runtime.
  - **Default Documents** – Add your web application’s default document to this list if it is not already in the list. If your web application contains more than one of the files in the list then make sure your Web Site’s default document appears at the top of the list.

###<a name="deployaweb_site"></a>Deploy a Web Site to Windows Azure
Windows Azure supports deploying Web Sites from remote computers using WebDeploy, FTP, GIT or TFS. Many development tools provide integrated support for publication using one or more of these methods and may only require that you provide the necessary credentials, site URL and hostname or URL for your chosen deployment method. Credentials and deployment URLs for all enabled deployment methods are stored in the Web Site’s publish profile, a file which can be downloaded from the **Quick Start** page or the **quick glance** section of the **Dashboard** page. If you prefer to deploy your Web Site with a separate client application, high quality open source GIT and FTP clients are available for download on the Internet for this purpose.

#### Deploy a Web Site from Git ####
If you use a Git for source code control, you can publish your app directly from a local Git repository to a Web Site. Git is a free, open-source, distributed version control system that handles small to very large projects. To use Git with your Web Site, you must set up Git publishing from the Quick Start or Dashboard management pages for your Web Site. After you set up Git publishing, each .Git push initiates a new deployment. You'll manage your Git deployments on the Deployments management page.

<div class="dev-callout"> 
<b>Tip</b> 
<p>After you create your Web Site, use <b>Set up Git Publishing</b> from the <b>Quick Start</b> or <b>Dashboard</b> management pages to set up Git publishing for the Web Site. If you're new to Git, you'll be guided through creating a Git account and a local repository for your Web Site. You'll see the exact Git commands that you need to enter, including the Git repository URLs to use with your Web Site.</p> 
</div>

####To set up Git publishing####

1. Create a Web Site in Windows Azure. (**Create New - Web Site**)
2. From the **Quick Start** management page, click **Set up Git publishing**.

Follow the instructions to create a deployment user account by specifying a username and password to use for deploying with Git and FTP, if you haven’t done that already. A Git repository will be created for the Web Site that you are managing.

#### Push your local Git repository to Windows Azure ####
The following procedures below will walk you through creating a new repository or cloning an existing repository and then pushing your content to the Git repository for the Web Site.

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

> <b>Note</b><br/>
> The commands above will vary depending upon the name of the Web Site for which you have created the Git repository.
 
#### To clone a Web Site to my computer ####
1. Install the Git client. ([Download Git][getgit]) if you have not already.
2. Clone your Web Site.
3. Open a command prompt, change directories to the directory where you want your files, and type:

		git clone -b master <GitRepositoryURL>
 
	where <em>GitRepositoryURL</em> is the URL for the Git repository that you want to clone.

4. Commit changes, and push the repository's contents back to Windows Azure.

5. After changing or adding some files, change directories your app's root directory and type:

  		git add.
		git commit -m "some changes"
		git push
 
After deployment begins, you can monitor the deployment status on the **Deployments** management page. When the deployment completes, click **Browse** to open the website in a browser.

###<a name="deleteaweb_site"></a>Delete a Web Site in Windows Azure
Web Sites are deleted using the **Delete** icon in the Windows Azure Portal. The **Delete** icon is available in the Windows Azure Portal when you click **Web Sites** to list all of your Web Sites and at the bottom of each of the Web Site management pages.

-------------------------------------------------------------------------------

##<a name="howtochangeconfig"></a>How to: Change Configuration Options for a Web Site

Configuration options for Web Sites are set on the **Configure** management page for the Web Site. This topic describes how to use the Configure management page to modify configuration options for a Web Site.

###Change configuration options for a Web Site###

Follow these steps to change configuration options for a Web Site.

<ol>
	<li>Open the Web Site’s management pages from the Windows Azure Portal.</li>
	<li>Click the <strong>Configure</strong> tab to open the <strong>Configure</strong> management page.</li>
	<li>Set the following configuration options for the Web Site as appropriate:
	<ul>
	<li style="margin-left: 40px"><strong>framework</strong> – Set the version of .NET framework or PHP required by your web application.</li>
	<li style="margin-left: 40px"><strong>hostnames</strong> – Enter additional hostnames for the Web Site here. Additional hostnames are limited to changing only the portion of the fully qualified “dot delimited” domain name that precedes the first period or "dot”. For example if the original Web Site name is MySite.azure-test.windows.net then additional hostnames must use the nomenclature newhostname.azure-test.windows.net and retain the first period plus everything to the right of the first period.<br/><strong>Note</strong><br/>Functionality for adding additional Web Site hostnames is only available when the Web Site is configured with the <strong>Reserved</strong> Web Site mode,  as specified on the <strong>Scale</strong> management page.</li>
	<li style="margin-left: 40px"><strong>diagnostics</strong> – Set options for gathering diagnostic 
	information for your Web Site including:
	<ul>
	<li style="margin-left: 60px"><strong>Web Server Logging</strong> – Specify whether to enable web server logging for the Web Site. 
	If enabled, web server logs are saved with the W3C extended log file format to the FTP site listed under Diagnostic Logs on the 
	**Dashboard** management page. After connecting to the specified FTP site navigate to /wwwroot/LogFiles/http/RawLogs/ to retrieve the web server logs.</li>
	<li style="margin-left: 60px"><strong>Detailed Error Messages</strong> – Specify whether to log detailed error messages for the Web Site. 
	If enabled, detailed error messages are saved as .htm files to the FTP site listed under Diagnostic Logs on the **Dashboard** management page. 
	After connecting to the specified FTP site navigate to /LogFiles/DetailedErrors/ to retrieve the .htm files which contain detailed error messages.</li>
	<li style="margin-left: 60px"><strong>Failed Request Tracing</strong> – Specify whether to enable failed request tracing. If enabled, failed request tracing output is written to XML files and saved to the FTP site listed under Diagnostic Logs on the **Dashboard** management page. 
	After connecting to the specified FTP site navigate to /LogFiles/W3SVC######### (where ######### represent a unique identifier for the Web Site) 	to retrieve the XML files that contain failed request tracing output.<br/><b>Important</b><br/>The /LogFiles/W3SVC#########/ folder contains an XSL file and one or more XML files. Ensure that you download the XSL file into the same directory as the XML file(s) because the XSL file provides functionality for formatting and filtering the contents of the XML file(s) when viewed in a browser. For more information about configuring diagnostics for Web Sites see <a href="#howtoconfigdiagnostics">How to: Configure Diagnostics and Download Logs for a Website</a>.</li>
	</ul>
	</li>
	<li><strong>App Settings</strong> – Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be injected into your .NET configuration AppSettings at runtime, overriding existing settings. For PHP and Node sites these settings will be available as environment variables at runtime.</li>
	<li><strong>Connections Strings</strong> – View connection strings for linked resources. For .NET sites, these connection strings will be injected into your .NET configuration connectionStrings settings at runtime, overriding existing entries where the key equals the linked database name. For PHP and Node sites these settings will be available as environment variables at runtime.<br/>
	<b>Note</b><br/>Connection strings are created when you link a database resource to a Web Site and are read only when viewed on the **Configuration** management page.</li>
	<li><strong>Default Documents</strong> – Add your Web Site’s default document(s) to this list if not already in the list. A Web Site’s default document(s) specify the web page that is displayed when a user navigates to the root of a Web Site without specifying a particular page. So given the Web Site http://contoso.com, if the default document is set to default.htm, a user would be routed to http://www.contoso.com/default.htm when pointing their browser to http://www.contoso.com. If your Web Site contains more than one of the files in the list then make sure your Web Site’s default document is at the top of the list by changing the order of the files in the list.</li>
	</ul></li>
	<li>Click <b>Save</b> at the bottom of the <b>Configure</b> management page to save configuration changes.</li>
</ol>

--------------------------------------------------------------------------------

##<a name="howtomanage"></a>How to: Manage a Web Site

You manage your Web Sites with a set of Management pages.

**Windows Azure Portal Web Site Management Pages** – Each Web Site management page is described below.

#### QuickStart ####
The **QuickStart** management page includes the following sections:

- **get the tools** – Provides links to [Install WebMatrix][mswebmatrix] and the [Azure SDK][azuresdk].
- **publish from local environment** – Provides links to download theWeb Site’s publishing profile and reset deployment credentials for the Web Site.
- **publish from source control** – Includes links for setting up TFS publishing and GIT publishing.

For more information about developing and deploying Web Sites see the following topics:

- [How to: Create, Deploy and Delete a Web Site](#howtocreatedeploydelete)
- [How to: Develop and Deploy a Web Site with Microsoft WebMatrix](#howtodevdepwebmatrix)
- [How to: Create a Web Site from the Gallery](#howtocreatefromgallery)

####<a name="dashboard"></a>Dashboard####

The **Dashboard** management page includes the following:

 - A chart which summarizes Web Site resource use in terms of certain metrics.

> - **CPU Time** – a measure of Web Site CPU usage in terms of time, not percentage.
> - **Requests** – a count of all client requests to Web Sites.
> - **Data Out** – a measure of data sent from Web Sites to clients.
> -  **Data In** – a measure of data received by Web Sites from clients.
> - **Http Client Errors** – number of Http “4xx Client Error” messages sent by Web Sites.
> - **Http Server Errors** – number of Http “5xx Server Error” messages sent by Web Sites.

 > <b>Note</b><br/>
To see a chart with additional performance metrics, configure the chart displayed on the **Monitor** management page as described in [How to: Monitor a Website](#howtomonitor).

 - A list of all linked resources associated with this Web Site or if no resources are associated, a hyperlink to the **Linked Resources** management page.
 - A **quick glance** section which includes the following summary information and links:

> - **Download Publish Profile** – Link to the publish profile, a file which contains credentials and URLs required to publish the Web Site using any enabled publishing methods.
> - **Reset Deployment Credentials** – Displays a dialog box where you provide unique credentials for use when publishing with GIT or FTP. If you wish to use GIT or FTP deployment then you must reset deployment credentials because authentication to an FTP host or GIT repository with Live ID credentials is not supported. Once you reset deployment credentials you can use same deployment user account credentials for GIT or FTP publishing to any of your Web Sites created in the same geo region.
> - **Set up TFS publishing** – Displays a dialog box where you can set up publishing from Team Foundation Service.
> - **Set up Git publishing** – Creates a GIT repository for the Web Site so that you can publish to the Web Site using GIT.
> - **Status** – Indicates whether there are any running instances of the Web Site.
> - **Site Url** – Specifies the publicly accessibly address of the Web Site on the internet.
> - **Location** – Specifies the physical region of the datacenter that hosts the Web Site.
> - **Compute Mode** – Specifies whether the Web Site is configured for Reserved or Shared mode. For more information about Web Site modes see [How to: Scale a Web Site](#howtoscale).
> - **Subscription ID** – Specifies the unique subscription ID of the subscription associated with the Web Site.
> - **FTP Hostname** – Specifies the URL to use when publishing the Web Site over FTP.
> - **Deployment User** –The account used when deploying the Web Site to Windows Azure using FTP or GIT.
> - **Diagnostic Logs** – Specifies the location of the Web Site’s diagnostic logs when diagnostic logging is enabled on the **Configure** management page.
> - **GIT Clone URL** – URL of the GIT repository for the Web Site. For information about making a copy of a remote GIT repository see the **git clone** section of the [GIT Reference for Getting and Creating Projects][gitref].<br/>
 > 	**Note**<br/>
**GIT Clone URL** is not available until you click the link to **Set up GIT publishing** and create a GIT repository.

####Deployments####
 The **Deployments** management page provides a summary of all deployments made to the Web Site using either GIT or TFS. If no GIT or TFS deployments have been made and GIT publishing has been configured for the Web Site the **Deployments** management page provides information describing how to use GIT to deploy your Web Site to Windows Azure.

####Monitor####
The **Monitor** management page includes a chart that displays usage information for instances of the Web Site. By default this chart displays the same metrics as the chart on the **Dashboard** page,  as described in the [Dashboard](#dashboard) section. The chart can also be configured to display other metrics such as Http Successes, Http Redirects, Http 401 errors, Http 403 errors, Http 404 errors and Http 406 errors. For more information about these metrics see [How to: Monitor a Website](#howtomonitor).

####Configure####
The **Configure** management page is used to set application specific settings including:

- **Framework** – Set the version of .NET framework or PHP required by your web application.
- **Diagnostics** – Set logging options for gathering diagnostic information for your Web Site. For more information about configuring diagnostics see [How to: Configure Diagnostics and Download Logs for a Website][howtoconfiganddownloadlogs].
- **App Settings** – Specify name/value pairs that will be loaded by a Web Site on start up. For .NET Web Sites, these settings will be injected into the Web Site’s .NET configuration AppSettings at runtime, overriding existing settings. For PHP and Node Web Site, these settings will be available to Web Sites as environment variables at runtime.
- **Connections Strings** – View connection strings to linked resources. For .NET Web Sites, these connection strings will be injected into the Web Site’s .NET configuration connectionStrings settings at runtime, overriding any existing entries where the key equals the linked database name. For PHP and Node Web Sites, these settings will be available to Web Sites as environment variables at runtime.
- **Default Documents** – Add your Web Site’s default document(s) to this list if not already listed. Documents in this list are processed in order of their list rank, which can be changed as needed.

For more information about how to configure a Web Site see [How to: Change Configuration Options for a Web Site](#howtochangeconfig).

####Scale####
The **Scale** management page is used to specify the Web Site mode (either **Shared** or **Reserved**), the size of the Web Site if it is configured as **Reserved** (**Small**, **Medium** or **Large**) and the value for **Reserved Instance Count** (from 1 to 3). A Web Site that is configured as **Reserved** will provide more consistent performance than a Web Site that is configured as **Shared**. A Web Site that is configured with a larger **Reserved Instance Size** will perform better under load. Increasing the value for **Reserved Instance Count** or **Shared Instance Count** will provide fault tolerance and improved performance through scale out. For more information about configuring scale options for a Web Site see [How to: Scale a Web Site](#howtoscale).

####Linked Resources####
The **Linked Resources** management page provides a summary of all Windows Azure resources that your Web Site is using. At the time of this writing, the only type of Windows Azure resource that can be linked to a Web Site is a SQL database. For more information about SQL Databases see [SQL Databases][sqldbs].

For information about how to configure a  Web Site to use other Windows Azure resources see [How to: Configure a Web Site to Use Other Windows Azure Resources](#howtoconfigother).

####Management Page Icons####
Icons are displayed at the bottom of each of the Web Site's Management pages, several of these icons appear on multiple pages while a couple of these icons are only displayed on certain pages.  The following icons are displayed at the bottom of the **Dashboard** management page:

- **Browse** - Opens the default page of a Web Site.
- **Stop** - Stops the Web Site.
- **Upload** - Allows you to publish a web application to the Web Site using  a web deploy package.
- **Delete** - Deletes the Web Site.
- **WebMatrix** - Opens supported Web Sites in Microsoft WebMatrix, allowing you to make changes to the Web Site and publish those changes back to Windows Azure. If Microsoft WebMatrix is not installed when you click this icon, you will be given the opportunity to install WebMatrix on those computers running a supported operating system.

The following icons are not displayed at the bottom of the **Dashboard** management page but are available at the bottom of other management pages:

- **Add Metrics** - At the bottom of the **Monitor** management page, allows you to add metrics to the chart displayed on the Monitor management page.
- **Link** - At the bottom of the **Linked Resources** management page, allows you to link the Web Site to other Windows Azure resources, for example if your Web Site needs access to a relational database you can link the Web Site to a SQL Database resource by clicking the Link icon.

--------------------------------------------------------------------------------

##<a name="howtomonitor"></a>How to: Monitor a Website

Web Sites provide monitoring functionality via the Monitor management page. The Monitor management page provides performance metrics for a Web Site as described below.

###Web Site Metrics###

From the Web Site’s Management pages in the Windows Azure Portal, click the **Monitor** tab to display the **Monitor** management page. By default the chart on the **Monitor** page displays the same metrics as the chart on the **Dashboard** page. To view additional metrics for the Web Site click **Add Metrics** at the bottom of the page to display the **Choose Metrics** dialog box. Click to select additional metrics for display on the **Monitor** page. After selecting the metrics that you want to add to the **Monitor** page click the **Ok** checkmark to add them. After adding metrics to the **Monitor** page, click to enable / disable the option box next to each metric to add / remove the metric from the chart at the top of the page.

To remove metrics from the **Monitor** page, select the metric that you want to remove and then click the **Delete Metric** icon at the bottom of the page.

The following metrics can be viewed in the chart on the **Monitor** page:

- **CPU Time** – A measure of website’s CPU usage in terms of time. CPU time usage is subject to usage quotas for any Web Sites configured with **Shared** Web Site mode.  
- **Requests** – A count of client requests to websites.
- **Data Out** – A measure of data sent by Web Sites to clients. Data out is also subject to usage quotas for any Web Sites running in Shared Web Site mode.
- **Data In** – A measure of data received by Web Site's from clients.
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

Web Sites can be configured to capture and log diagnostic information from the Web Site’s **Configure** management page. This topic describes how to capture diagnostics data to log files, download the log files to a computer and read the log files.

###Configuring Diagnostics for a Web Site###

Diagnostics for a Web Site is enabled on the **Configure** management page. Under the **Diagnostics** section of **Configure** management page you can enable or disable these logging or tracing options:

- **Detailed Error Logging** – Turn on detailed error logging to capture all errors Web Site errors.
- **Failed Request Tracing** – Turn on failed request tracing to capture failed client requests.
- **Web Server Logging** – Turn on Web Server logging to save Web Site logs using the W3C extended log file format.

After enabling diagnostics, click the **Save** icon at the bottom of the **Configure** management page to apply the options that you set.

<div class="dev-callout"> 
<b>Important</b> 
<p>Logging and tracing place significant demands on Web Sites. We recommend turning off logging and tracing once you have reproduced the problem(s) that you are troubleshooting.</p> 
</div>

###Downloading Log Files for a Web Site###

Follow these steps to download log files for a Web Site:

1. Open the Web Site’s **Dashboard** management page and make note of the FTP site listed under **Diagnostics Logs** and the account listed under **Deployment User**. The FTP site is where the log files are located and you authenticate to this FTP site using the Deployment User account credentials.
2. If you have not yet created deployment credentials, the account listed under **Deployment User** is listed as **Not set**. In this case you must create deployment credentials as described in the Reset Deployment Credentials section of Dashboard because these credentials must be used to authenticate to the FTP site where the log files are stored. Windows Azure does not support authenticating to this FTP site using Live ID credentials.
3. Consider using an FTP client such as [FileZilla][fzilla] to connect to the FTP site. An FTP client provides greater ease of use for specifying credentials and viewing folders on an FTP site than is typically possible with a browser.
4. Copy the log files from the FTP site to your local computer.

###Reading Log Files from a Web Site###

The log files that are generated after you have enabled logging and / or tracing for a Web Site vary depending on the level of logging / tracing that is set on the **Configure** management page for the Web Site. The following table summarizes the location of the log files and how the log files may be analyzed:

<table cellpadding="0" cellspacing="0" width="900" rules="all" style="border: #000000 thin solid;">
<tr style="background-color: silver; font-weight: bold;" valign="top">
<th style="width: 160px">Log File Type</th>
<th style="width: 190px">Location</th>
<th style="width: 600px">Read Files With</th>
</tr>
<tr>
<td>Failed Request Tracing</td>
<td>/LogFiles/W3SVC#########/</td>
<td><strong>Internet Explorer</strong><br/><b>Important</b><br/>The /LogFiles/W3SVC#########/ folder contains an XSL file and one or more XML files. Ensure that you download the XSL file into the same directory as the XML file(s) because the XSL file provides functionality for formatting and filtering the contents of the XML file(s) when viewed in Internet Explorer.</td>
</tr>
<tr>
<td>Detailed Error Logging</td><td>/LogFiles/DetailedErrors/</td>
<td><strong>Internet Explorer</strong><br/>The /LogFiles/DetailedErrors/ folder contains one or more .htm files that provide extensive information for any HTTP errors that have occurred. The .htm files include the following sections:
<ul>
<li><strong>Detailed Error Information</strong> – Includes information about the error such as <em>Module</em>, <em>Handler</em>, <em>Error Code</em>, and <em>Requested URL</em>.</li>	
<li><strong>Most likely causes:</strong> Lists several possible causes of the error.</li>
<li><strong>Things you can try:</strong> Lists possible solutions for resolving the problem reported by the error.</li>
<li><strong>Links and More Information</strong> – Provides additional summary information about the error and may also include links to other resources such as Microsoft Knowledge Base articles.</li>
</ul>
</td>
</tr>
<tr>
<td>Web Server Logging</td><td>/LogFiles/http/RawLogs</td>
<td><strong>Log Parser</strong><br/>
Used to parse and query IIS log files. Log Parser 2.2 is available on the Microsoft Download Center at <a href="http://go.microsoft.com/fwlink/?LinkId=246619">http://go.microsoft.com/fwlink/?LinkId=246619</a>.</td>
</tr>
</table>

--------------------------------------------------------------------------------

##<a name="howtoconfigother"></a>How to: Configure a Web Site to Use Other Windows Azure Resources

Web Sites can be linked to other Windows Azure resources such as a SQL Database to provide additional functionality. Web Sites can also be configured to use a new or existing MySQL database when creating a Web Site.

###Configure a Web Site to use a SQL Database###

Follow these steps to link a Web Site to a SQL Database:

1. Select **Web Sites** on the left hand side of the Windows Azure portal to display the list of Web Sites created by the currently logged on account.
2. Select a Web Site from the list of Web Sites to open the Web Site’s **Management** pages.
3. Click the **Linked Resources** tab and a message will be displayed on the **Linked Resources** page indicating **You have no linked resources**.
4. Click **Link a Resource** to open the **Link Resource** wizard.
5. Click **Create a new resource** to display a list of resources types that can be linked to your Web Site.
6. Click **SQL Database** to display the **Link Database** wizard.
7. Complete required fields on pages 3 and 4 of the **Link Database** wizard and then click the **Finish** checkmark on page 4.

Windows Azure will create a SQL database with the specified parameters and link the database to the Web Site.

###Configure a Web Site to Use a MySQL Database###
To configure a Web Site to use a MySQL database you must create the Web Site with the **Create With Database** option and then specify either to “Use an existing MySQL database” or “Create a new MySQL database.” MySQL databases cannot be added to a Web Site as a linked resource and are not displayed in the Windows Azure Management Portal as a type of cloud resource.

--------------------------------------------------------------------------------

##<a name="howtoscale"></a>How to: Scale a Web Site

When a Web Site is first created it runs in **Shared** Web Site mode, utilizing resources that are shared with other subscribers to run Web Sites in Shared Web Site mode. A single instance of a Web Site configured to run in Shared mode will provide somewhat limited performance when compared to other configurations but should still provides sufficient performance to complete development tasks or proof of concept work. If a Web Site that is configured to run in a single instance using Shared Web Site mode is put into production, the resources available to the Web Site may prove to be inadequate as the average number of client requests increases over time. Before putting a Web Site into production,  estimate the load that the Web Site will be expected to handle and consider scaling up / scaling out the Web Site by changing configuration options available on the Web Site's **Scale** management page. This topic describes the options available on the Scale management page and how to change them.
<div class="dev-callout"> 

<b>Warning</b> 
<p>Scale options applied to a Web Site are also applied to all Web Sites that meet the following conditions:</p>
<ol>
<li>Are configured to run in Reserved Web Site mode.</li>
<li>Exist in the same region as the Web Site for which scale options are modified.</li>
</ol>
</div>

For this reason it is recommended that you configure any  "proof of concept” Web Sites to run in Shared Web Site mode or create the Web Sites in a different region than Web Sites you plan to scale up or scale out.
 
### Change Scale Options for a Web Site ###
A Web Site that is configured to run in **Shared** Web Site mode has access to the resources associated with an **ExtraSmall** Virtual Machine Size described in the table at [How to: Configure Virtual Machine Sizes][configvmsizes]. To change scale options for a Web Site, open the Web Site’s **Scale** management page to configure the following scaling options:

- **Web Site Mode** - Set to **Shared** by default, 
When **Web Site Mode** is changed from **Shared** to **Reserved** the Web Site is scaled up to run in a Small compute instance on a single dedicated core with access to additional memory, disk space and bandwidth as described by the table in [How to: Configure Virtual Machine Sizes][configvmsizes]. Before switching a Web Site from **Shared** Web Site mode to **Reserved** Web Site mode you must first remove spending caps applied to your Web Site subscription.
- **Reserved Instance Size** - Provides options for additional scale up of a Web Site running in **Reserved** Web Site mode. If **Reserved Instance Size** is changed from **Small** to **Medium** or **Large**, the Web Site will run in a compute instance of corresponding size with access to associated resources for each size as described by the table in [How to: Configure Virtual Machine Sizes][configvmsizes].
- **Reserved/Shared Instance Count** - Increase this value to provide fault tolerance and improved performance through scale out by running additional Web Site instances. It should be noted that as the value for **Shared Instance Count** increases so does the possibility that a subscribtion can exceed its daily resource usage quota for running Web Sites in Shared Web Site mode. For more information about resource usage quotas see [How to: View Usage Quotas for a Web Site](#howtoviewusage). 

--------------------------------------------------------------------------------

##<a name="howtoviewusage"></a>How to: View Usage Quotas for a Web Site

Web Sites can be configured to run in either **Shared** or **Reserved** Web Site mode from the Web Site’s **Scale** management page. Each Web Site subscription can run up to 10 Web Sites in **Shared** Web Site mode. The resources available to a subscription for this purpose are shared by other Shared mode Web Sites in the same geo-region. Because these resources are shared, each subscription's use of these resources is subject to usage quotas. These usage quotas listed under the usage overview section of each Web Site’s **Dashboard** management page.

<div class="dev-callout"> 
<b>Note</b> 
<p>When a Web Site is configured to run in **Reserved** mode it is allocated dedicated resources equivalent to the <b>Small</b> (default), <b>Medium</b> or <b>Large</b> virtual machine sizes in the table at <a href="#configvmsizes">How to: Configure Virtual Machine Sizes</a>. There are no limits to the resources a subscription can use for running Web Sites in <b>Reserved</b> mode however the number of <b>Reserved</b> mode Web Sites that can be created per subscription is limited to <b>100</b>.</p> 
</div>
 
### Viewing Usage Quotas for Web Sites Configured for Shared Web Site Mode ###
To determine how much of the available resource usage quota a shared Web Site mode is using follow these steps:

1. Open the Web Site’s **Dashboard** management page.
2. Under the **usage overview** section the usage quotas for **Data Out**, **CPU Time** and **File System Storage** are displayed. The green bar displayed for each resource indicates how much of a subscription’s resource usage quota is being consumed by the current Web Site and the grey bar displayed for each resource indicates how much of a subscription’s resource usage quota is being consumed by all other shared mode Web Sites associated with your Web Site subscription.

Resource usage quotas help prevent overuse of the following resources:

- **Data Out** – A measure of the amount of data sent from Web Sites running in **Shared** mode to their clients in the current quota interval (24 hours).
- **CPU Time** – The amount of CPU time used by Web Sites running in **Shared** mode for the current quota interval.
- **File System Storage** – The amount of file system storage in use by Web Sites running in **Shared** mode.

When a subscription’s usage quotas are exceeded Windows Azure takes action to stop overuse of resources. This is done to prevent any subscriber from exhausting resources to the detriment of other subscribers.

<div class="dev-callout"> 
<b>Note</b> 
<p>Since Windows Azure calculates resource usage quotas by measuring the resources used by a subscription’s shared mode Web Sites during a 24 hour quota interval, consider the following:</p> 
</div>

- As the number of Web Sites configured to run in Shared mode is increased, so is the likelihood of exceeding shared mode resource usage quotas.
Consider reducing the number of Web Sites that are configured to run in Shared mode if resource usage quotas are being exceeded.
- Similarly, as the number of instances of any Web Site running in Shared mode is increased, so is the likelihood of exceeding shared mode resource usage quotas.
Consider scaling back additional instances of shared mode Web Sites if resource usage quotas are being exceeded.

Windows Azure takes the following actions if a subscription's resource usage quotas are exceeded in a quota interval (24 hours):

 - **Data Out** – when this quota is exceeded Windows Azure stops all Web Sites for a subscription which are configured to run in **Shared** mode for the remainder of the current quota interval. Windows Azure will start the Web Sites at the beginning of the next quota interval.
 - **CPU Time** – when this quota is exceeded Windows Azure stops all Web Sites for a subscription which are configured to run in **Shared** mode for the remainder of the current quota interval. Windows Azure will start the Web Sites at the beginning of the next quota interval.
 - **File System Storage** – Windows Azure prevents deployment of any Web Sites for a subscription which are configured to run in Shared mode if the deployment will cause the File System Storage usage quota to be exceeded. When the File System Storage resource has grown to the maximum size allowed by its quota, file system storage remains accessible for read operations but all write operations, including those required for normal Web Site activity are blocked. When this occurs you could configure one or more Web Sites running in Shared Web Site mode to run in Reserved Web Site mode and reduce usage of file system storage below the File System Storage usage quota.

--------------------------------------------------------------------------------

##<a name="howtocreatefromgallery"></a>How to: Create a Web Site from the Gallery

The gallery makes available a wide range of popular web applications developed by Microsoft, third party companies and open source software initiatives. Web applications created from the gallery do not require installation of any software other than the browser used to connect to the Windows Azure portal. When creating Web Sites from the gallery you should be able to create, deploy, and have a fully operational Web Site running in 3 to 5 minutes.

This topic describes how to create and publish a WordPress blog Web Site from the gallery to a Web Site.

###Create and Publish a Web Site from the gallery to Windows Azure###
Follow these steps to create, deploy and run a WordPress blog Web Site on Windows Azure:

1. Login to the Windows Azure portal.
2. Click the **Create New** icon on the bottom left of the Windows Azure portal.
3. Click the **Web Site** icon, click **From Gallery**, locate and click the WordPress icon in the A-Z list displayed under Find Apps for Azure and then click **Next**.
4. On the Configure Your App/Site Settings page enter or select appropriate values for all fields and click **Next**.

	**Note**<br/>
	When choosing a region, select the region that is closest to your target audience. Selecting the region that is closest to the geographical location of your target audience will minimize latency for their connections to your Web Site. If you have not determined the geographical location of your target audience then consider selecting a region in the central U.S. so that latency will be similar for users on both the east and west coasts.
5. On the **Configure Your App/Database Settings** page select **New Database**, enter appropriate values for all fields and then click **Complete**. After you click **Complete** Windows Azure will initiate build and deploy operations. While the Web Site is being built and deployed the status of these operations is displayed at the bottom of the Web Sites page. After all operations are performed a final status message indicates whether the operations succeeded. When this message indicates that operations were successful click **Ok**.
6. Open the Web Site's **Dashboard** management page.
7. On the **Dashboard** management page click the link under **Site Url** to open the site’s welcome page. Enter appropriate configuration information required by WordPress and click **Install Wordpress** to finalize configuration and open the Web Site’s login page.
8. Login to the new WordPress Web Site by entering the username and password that you specified on the **Welcome** page.

--------------------------------------------------------------------------------

##<a name="howtodevdepwebmatrix"></a>How to: Develop and Deploy a Web Site with Microsoft WebMatrix

This topic describes how to use Microsoft WebMatrix on a development computer to create and deploy a Web Site to Windows Azure.

###<a name="howtocreateanddeployfromwebmatrix"></a>How to: Create and Deploy a Web Site from Microsoft WebMatrix to Windows Azure

<div class="dev-callout"> 
<b>Note</b> 
<p>Microsoft WebMatrix must be installed on the development computer to complete the steps in this topic. Complete the steps in the following section to install Microsoft WebMatrix on your development computer.</p> 
</div>

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

####Create, deploy and run the WebMatrix "bakery" sample Web Site on Windows Azure####

Follow these steps to create, deploy and run the  WebMatrix "bakery" sample Web Site on Windows Azure:

1. Login to the Windows Azure Portal.
2. Click the **Create New** icon at the bottom left of the Windows Azure portal.
3. Click the **Web Site** icon, click **Quick Create**, enter a value for **URL** under the **create a new web site** section of this page and then click the checkmark next to **create web site**	at the bottom of this page:

	![Create New Web Site][createnewsite]	

	This will initiate the process of creating the new Web Site on Windows Azure.
4. Once the Web Site is created your browser will display the Web Sites page, listing all of the Web Sites associated with the currently logged on account. Verify that the Web Site you just created has a **Status** of **Running** and then open the Web Site's management pages by clicking the name of the Web Site displayed in the **Name** column. This will open the **Dashboard** page for the new Web Site.
5. From the **Dashboard** page click the link to **Download publish profile** and save the publish profile file to the desktop of your development computer.
6. Open Microsoft WebMatrix. Click **Start, All Programs, Microsoft WebMatrix and then Microsoft WebMatrix**.
7. Click the button immediately to the left of the **Home** tab in the Ribbon, click **New Site**, click **Site from Template**, select the **Bakery** template, enter a value for **Site Name** and then click **OK** to create the Web Site and display the Web Site’s Administration page.
8. Click  **Publish** in the Home ribbon to display **Publish Settings** options for the Web Site.
9. Click  **Import publish settings** under **Common Tasks**, select the publish profile file that you downloaded from Windows Azure and saved to the desktop. Then click **Open** to display the **Publish Settings** dialog box. 
10. Click the **Validate Connection** button to verify connectivity between the WebMatrix computer and the Web Site you created earlier. If you receive a certificate error indicating that the security certificate presented by this server was issued to a different server, check the box next to **Save this certificate for future sessions of WebMatrix** and click **Accept Certificate**.

	![WebMatrix Certificate Error][webmatrixcerterror]
11. After you click **Accept Certificate** the **Publish Settings** dialog box will be displayed, click **Validate Connection**.
12. Once the connection is validated, click **Save** to save publish settings for the Web Site you created in WebMatrix.
13. From the **Publish Settings** dialog box click the dropdown for the Publish button and select Publish. Click **Yes** on the Publish Compatibility dialog box to perform publish compatibility testing and then click **Continue** when publish compatibility tests have completed.
14. Click **Continue** in the Publish Preview dialog box to initiate publication of the site on WebMatrix to Windows Azure.
15. Navigate to the Web Site on Windows Azure to verify it is deployed correctly and is running. The URL for the Web Site is displayed at the bottom of the WebMatrix IDE when publishing is complete. 

	![Publishing Complete][publishcomplete]

16. Click on the URL for the Web Site to open the Web Site in your brower:

	![Bakery Sample Site][bakerysample]

The URL for the Web Site can also be found in the Windows Azure portal by clicking **Web Sites** to display all Web Sites created by the logged on account. The URL for each Web Site is displayed in the URL column on the Web Sites page.

If you need to delete the Web Site to avoid usage charges use the **Delete** icon as described in [Delete a Web Site in Windows Azure](#deleteaweb_site).

--------------------------------------------------------------------------------

##<a name="nextsteps"></a>Next Steps
For more information about Web Sites in see the following:

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

[installwebplat3]: ..\Media\howtoWebPI3installer.png
[runorsavewebmatrix]: ..\Media\howtorunorsavewebmatrix.png
[installwebmatrix]: ..\Media\howtoinstallwebmatrix.png
[webplatinstall]: ..\Media\howtowebplatforminstallation.png
[webplatdone]: ..\Media\howtofinish.png
[createnewsite]: ..\Media\howtocreatenewsite.png
[webmatrixcerterror]: ..\Media\howtocertificateerror.png
[publishcomplete]: ..\Media\howtopublished.png
[bakerysample]: ..\Media\howtobakerysamplesite.png