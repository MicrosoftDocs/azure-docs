<properties linkid="manage-services-how-to-configure-websites" urlDisplayName="How to configure" pageTitle="How to configure websites - Azure service management" metaKeywords="Azure websites, configuring Azure websites, Azure SQL database, Azure MySQL" description="Learn how to configure websites in Azure, including how to configure a website to use a SQL Database or MySQL database." metaCanonical="" services="web-sites" documentationCenter="" title="How to Configure Websites" authors="cephalin" solutions="" manager="wpickett" editor="mollybos" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="cephalin" />





# How to Configure Websites #
In the Azure Management Portal you can change the configuration options for websites and you can link website to other Azure resources. For example, you can link websites to a SQL Database to provide additional functionality. You can also configure websites to use a new or existing MySQL database.

## Table of Contents ##
- [How to: Change configuration options for a web site](#howtochangeconfig)
- [How to: Configure a web site to use a SQL database](#howtoconfigSQL)
- [How to: Configure a web site to use a MySQL database](#howtoconfigMySQL)
- [How to: Configure a custom domain name](#howtodomain)
- [How to: Configure a web site to use SSL](#howtoconfigSSL)
- [Next steps](#next)



##<a name="howtochangeconfig"></a>How to: Change configuration options for a website

<!-- HOW TO: CHANGE CONFIGURATION OPTIONS FOR A WEBSITE -->

Follow these steps to change configuration options for a website.

<ol>
	<li>In the Management Portal, open the website's management pages.</li>
	<li>Click the <strong>Configure</strong> tab to open the <strong>Configure</strong> management page.</li>
	<li>Set the following configuration options for the website as appropriate:
	<ul>

	<!-- GENERAL -->
	<li><strong>general</strong>
<ul>
<li><strong>.NET Framework Version</strong> - If your web application uses the .NET Framework, set the version of the framework that the web application requires.</li>

<li><strong>PHP Version</strong> - If your web application uses PHP, set the version of PHP that the web application requires.</li>
<li><strong>Java Version</strong> - Select the displayed version of Java to enable it for your web application, or <strong>OFF</strong> to disable Java. If you enable Java for your web application, the <strong>Web Container</strong> option lets you choose between Tomcat and Jetty versions.
<p><strong>Note</strong>: For technical reasons, enabling Java for your website disables the .NET, PHP, and Python options.</p>
</li>
<li><strong>Python  Version</strong> - Select the Python version you want to use, or set it to <strong>Off</strong>, which is the default.</li>
<li><strong>Managed Pipeline Mode</strong> - Of the two choices, <strong>Classic</strong> and <strong>Integrated</strong>, Integrated is the default. You should use the Classic option only if you have legacy websites that run exclusively on older versions of IIS.</li>

<li><strong>Platform</strong> - For sites in Standard mode, you can choose whether you want your application to run in a 32-bit or 64-bit environment. Sites in the Free and Shared modes always run in a 32-bit environment.</li>

<li><strong>Web Sockets</strong> - Choose <strong>On</strong> to enable your website to use real time request pattern applications such as chat.</li>

<li><strong>Always On</strong> - By default, websites are unloaded if they have been idle for some period of time. This lets the system conserve resources. You can enable the <strong>Always On</strong> setting for a site in Standard mode if the site needs to be loaded all the time. Because continuous web jobs may not run reliably if <strong>Always On</strong> is disabled, you should enable <strong>Always On</strong> when you have continuous web jobs running on the site.</li>

<li><strong>Edit in Visual Studio Online</strong> - Select <strong>On</strong> to enable live code editing with Visual Studio Online. After you save this configuration change, the DASHBOARD tab's <strong>Quick Glance</strong> section will display a link called <strong>Edit in Visual Studio Online</strong>. Click the link to edit your website directly online. If you need to authenticate, you can use your basic deployment credentials. 
<p><strong>Note</strong>: If you have 'deployment from source control' enabled, it is possible for a deployment to overwrite changes the changes you make in the Visual Studio Online editor. It is therefore best not to use 'deployment from source control' if you want to edit the site contents directly with Visual Studio Online.</p>
</li>



</ul></li>

<!-- CERTIFICATES -->
<li><strong>certificates</strong> - In Standard mode only, you can click <strong>upload</strong> to upload an SSL certificate for a custom domain. The certificates you upload are listed here. Wildcard ("star") certificates (certificates with an asterisk) are supported. After you upload a certificate, you can assign it to any website in your subscription and region. A star certificate only has to be uploaded once, but can be used for any site within the domain for which it is valid. A certificate can be deleted only if no bindings in any site are active for the given certificate.
<br /><strong>Note:</strong>
Custom domains are available only in Shared and Standard modes, and SSL support for custom domains is available in Standard mode only. For information about configuring SSL for a custom domain on Azure, see <a href="http://www.windowsazure.com/en-us/documentation/articles/web-sites-configure-ssl-certificate/">Enable HTTPS for an Azure website</a>.
</li>

<!-- DOMAIN NAMES -->
<li><strong>domain names</strong> - View or add additional domain names for the website here. You can add custom domains by clicking <strong>Manage Domains</strong>. Custom domains are available only in <strong>Shared</strong> and <strong>Standard</strong> modes. You can change the website mode on the <strong>Scale</strong> management page. Custom domains are not available in Free mode. For more information on configuring custom domains, see <a href="http://www.windowsazure.com/en-us/documentation/articles/web-sites-custom-domain-name/">Configuring a custom domain name for an Azure website</a>.</li>

<!-- SSL BINDINGS -->
<li><strong>SSL Bindings</strong> - SSL bindings to custom domains are available only in Standard mode. Choose an SSL mode (<strong>SNI</strong>, <strong>IP</strong>, or <strong>No SSL</strong>) for a particular domain name. If you choose SNI or IP, you can specify a certificate for the domain from the certificates you have uploaded. For information about configuring SSL for a custom domain on Azure, see <a href="http://www.windowsazure.com/en-us/documentation/articles/web-sites-configure-ssl-certificate/">Enable HTTPS for an Azure website</a>. For more information about SNI, see <a href="http://en.wikipedia.org/wiki/Server_Name_Indication">Server Name Indication</a>.</li>

<!-- DEPLOYMENTS  -->
<li><strong>deployments</strong> - Use these settings to configure deployments.
<ul>
<li><strong>Git URL</strong> - If you have created a Git repository on your Azure website, this is its URL - the location to which you push your content.</li>
<li><strong>Deployment Trigger URL</strong> - This URL can be set on a GitHub, CodePlex, Bitbucket, or other repository to trigger the deployment when a commit is pushed to the repository.</li>
<li><strong>Branch to Deploy</strong> - This lets you specify the branch that will be deployed when you push content to it.</li>
</ul>
</li>

<!-- APPLICATION DIAGNOSTICS  -->
<li><strong>application diagnostics</strong> - Set options for gathering diagnostic traces from a web application whose code has been instrumented with traces. The logging options for application diagnostics include:
<ul>
<!-- APPLICATION LOGGING (FILE SYSTEM) -->
<li><strong>Application Logging (File System)</strong> - Choose <strong>On</strong> to have the application logs written to the website's file system. When enabled, file system logging lasts for a period of 12 hours. You can access the logs from the FTP share for the website. The link to the FTP share can be found on the <strong>Dashboard</strong>. Under <strong>Quick Glance</strong>, choose <strong>FTP Diagnostic Logs</strong> or <strong>FTPS Diagnostic Logs</strong>.</li>

<!-- APPLICATION LOGGING (STORAGE) -->
<li><strong>Application Logging (Storage)</strong> - Choose <strong>On</strong> to have your application logs written to an Azure storage account. Logging to a storage account has no time limit and stays enabled until you disable it. By default, the logs are stored in a table called WAWSAppLogTable.</li>
<li><strong>Logging Level</strong> - When logging is enabled, this option specifies the amount of information that will be recorded (Error, Warning, Information, or Verbose).</li>

<!-- DIAGNOSTIC STORAGE -->
<li><strong>Diagnostic Storage</strong> - Clicking <strong>Manage Connection</strong> opens the <strong>Manage diagnostic storage</strong> dialog with the following options for saving logs to your Azure storage account:
<ul>
<li><strong>Storage Account Name</strong> - Choose the storage account to which you would like to have the logs saved.</li>
<li><strong>Storage Access Key</strong> - Displays the key for the chosen storage account. If you have regenerated the key for the storage account, type the new key here manually, or use one of the <strong>Synchronize</strong> buttons. The synchronize buttons are available only if the currently logged on user has access to the selected storage account.
</li>
<li><strong>Synchronize Primary Key</strong> - Retrieves the latest primary key of your Azure Storage account.
</li>
<li><strong>Synchronize Secondary Key</strong> - Retrieves the latest secondary key of your Azure Storage account.
<br /><strong>Note:</strong> For more information about Azure Storage Access Keys, see <a href="http://www.windowsazure.com/en-us/documentation/articles/storage-manage-storage-account/#regeneratestoragekeys">How to: View, copy, and regenerate storage access keys</a>.
</li></ul></li></ul></li>

<!-- SITE DIAGNOSTICS  -->
<li><strong>site diagnostics</strong> - Set options for gathering diagnostic 
	information for your website, including:
<ul>
<!-- WEB SERVER LOGGING -->
	<li><strong>Web Server Logging</strong> - Specify whether to enable web server logging for the website. Web server logs are saved in the W3C extended log file format. You can save the logs to Azure Storage or to the File System. 
<br /><strong>Tip</strong>: The maximum size of log storage in the file system is 100 megabytes. If you need to retain more history than that, use Azure Storage, which has a much greater storage capacity.
	<ul>
		<li>To save web server logs to an Azure Storage Account, choose <strong>Storage</strong>, and then choose <strong>manage storage</strong>. In the <strong>Manage Storage for Site Diagnostics</strong> dialog box, use the <strong>Storage Account</strong> option to choose the Azure Storage Account for the container that will hold the logs. Use the <strong>Azure Blob Container</strong> option to choose the container that will hold the logs, or select <strong>Create a new blob container</strong> to enable the <strong>Blob Name</strong> box where you can specify a name for the new container.
<br /><strong>Note</strong>: If you do not yet have a storage account, go to the <strong>Storage</strong> section of the Azure portal where you can click <strong>New</strong> to create an account. 
</li>
		<li>If you choose <strong>File System</strong>, the logs are saved to the FTP site listed under <strong>FTP Diagnostic Logs</strong> on the Dashboard management page. Enabling File System storage also enables the <strong>Quota</strong> box where you can set the maximum amount of disk space for the log files. The minimum is 25MB and the maximum is 100MB. The default is 35MB. When the quota is reached, the oldest files are successively overwritten by the newest ones.</li>
		<li>By default, web server logs in an Azure Storage Account are never deleted. To specify a period of time after which the logs will be automatically deleted, select <strong>Set Retention</strong> and enter the number of days to keep the logs in the <strong>Retention Period</strong> box. You can also use the <strong>Set Retention</strong> option for File System storage.</li></ul>
</li>

<!-- DETAILED ERROR MESSAGES -->
	<li><strong>Detailed Error Messages</strong> - Specify whether to log detailed error messages for the website. 
	If enabled, detailed error messages are saved as .htm files to the FTP site listed under FTP Diagnostic Logs on the Dashboard management page. 
	After connecting to the specified FTP site navigate to /LogFiles/DetailedErrors/ to retrieve the .htm files which contain detailed error messages.</li>

<!-- FAILED REQUEST TRACING -->
	<li><strong>Failed Request Tracing</strong> - Specify whether to enable failed request tracing. If enabled, 
	failed request tracing output is written to XML files and saved to the FTP site listed under FTP Diagnostic Logs on the Dashboard management page. 
	After connecting to the specified FTP site navigate to /LogFiles/W3SVC######### (where ######### represent a unique identifier for the website) 
	to retrieve the XML files that contain the failed request tracing output.<br /><strong>Important</strong><br />The /LogFiles/W3SVC#########/ 
	folder contains an XSL file and one or more XML files. Ensure that you download the XSL file into the same directory as the XML file(s) because 
	the XSL file provides functionality for formatting and filtering the contents of the XML file(s) when viewed in Internet Explorer.</li>

<!-- REMOTE DEBUGGING -->
<li><strong>Remote Debugging</strong> - Set this option to <strong>On</strong> to enable remote debugging in your choice of Visual Studio 2012 or Visual Studio 2013. When enabled, you can use the remote debugger in Visual Studio to connect directly to your Azure website.
<br />
<strong>Note</strong>:  Remote debugging will be enabled only for 48 hours and will not work with a site name or user name that is longer than 20 characters. 
</li>
	</ul>
	</li>

<!-- MONITORING  -->
<li><strong>monitoring</strong> - For websites in Standard mode, test the availability of HTTP or HTTPS endpoints. You can test an endpoint from up to three geo-distributed locations. A monitoring test fails if the HTTP response code is greater than or equal to 400 or if the response takes more than 30 seconds. An endpoint is considered available if its monitoring tests succeed from all the specified locations.
</li>

<!-- DEVELOPER ANALYTICS -->
<li><strong>developer analytics</strong> - Choose <strong>Add-on</strong> to select an analytics add-on from a list, or to go to the Azure store to choose one. Choose <strong>Custom</strong> to select an analytics provider such as New Relic from a list. If you use a custom provider, you must enter the license key in the<strong> Provider Key</strong> box. 
<br /> <strong>Note</strong>: For more information on using New Relic with Azure Websites, see <a href="http://www.windowsazure.com/en-us/documentation/articles/store-new-relic-web-sites-dotnet-application-performance-management/">New Relic Application Performance Management on Azure Websites</a>.
</li>

<!-- APP SETTINGS -->
	<li><strong>app settings</strong> - Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be 
	injected into your .NET configuration AppSettings at runtime, overriding existing settings. PHP, Python, Java and Node applications can access these settings as environment variables at runtime. For each app setting two environment variables are created; one with the name specified by the app setting entry, and another with a prefix of APPSETTING_. Both will contain the same value.</li>

<!-- CONNECTION STRINGS -->
	<li><strong>connection strings</strong> - View connection strings for linked resources. For .NET sites, these connection strings will be injected into your .NET configuration connectionStrings settings at runtime, overriding existing entries where the key equals the linked database name. For PHP, Python, Java and Node applications, these settings will be available as environment variables at runtime, prefixed with the connection type. The environment variable prefixes are as follows: <br />
<ul><li>SQL Server: SQLCONNSTR_</li>
<li>MySQL: MYSQLCONNSTR_</li>
<li>SQL Database: SQLAZURECONNSTR_</li>
<li>Custom: CUSTOMCONNSTR_</li></ul>For example, if a MySql connection string were named connectionstring1, it would be accessed through the environment variable <code>MYSQLCONNSTR_connectionString1</code>.
	<br /><strong>Note</strong>: Connection strings are also created when you link a database resource to a website. Connection strings created this way are read only when viewed on the 
	configuration management page.</li>

<!-- DEFAULT DOCUMENTS -->
	<li><strong>default documents</strong> - Add your website's default document to this list if it is not already in the list. A website's default 
	document is the web page that is displayed when a user navigates to a website and does not specify a particular page on the website. So given the 
	website http://contoso.com, if the default document is set to default.htm, a user would be routed to http://www.contoso.com/default.htm when pointing 
	their browser to http://www.contoso.com. If your website contains more than one of the files in the list, then make sure your website's default document 
	is at the top of the list by changing the order of the files in the list.</li>

<!-- HANDLER MAPPINGS -->
<li><strong>handler mappings</strong> -  Add custom script processors to handle requests for specific file extensions. Specify the file extension to be handled in the <strong>Extension</strong> box (for example, *.php or handler.fcgi). Requests to files that match this pattern will be processed by the script processor specified in the <strong>Script Processor Path</strong> box. An absolute path is required for the script processor (the path D:\home\site\wwwroot can be used to refer to your site's root directory). Optional command-line arguments for the script processor may be specified in the <strong>Additional Arguments (Optional)</strong> box.
</li>

<!-- VIRTUAL APPLICATIONS AND DIRECTORIES -->
<li><strong>virtual applications and directories </strong> -  To configure virtual applications and directories associated with your website, specify each virtual directory and its corresponding physical path relative to the site root. Optionally, you can select the <strong>Application</strong> checkbox to mark a virtual directory as an application in site configuration.
</li>

	
</ul></li>
<li>Click <strong>Save</strong> at the bottom of the <strong>Configure</strong> management page to save configuration changes.</li>
</ol>

<!-- HOW TO: CONFIGURE A WEBSITE TO USE A SQL DATABASE -->
##<a name="howtoconfigSQL"></a>How to: Configure a website to use a SQL database

Follow these steps to link a website to a SQL Database:

1. In the [Management Portal](http://manage.windowsazure.com), select **Websites** to display the list of websites created by the currently logged on account.

2. Select a website from the list of websites to open the website's **Management** pages.

3. Click the **Linked Resources** tab and a message will be displayed on the **Linked Resources** page indicating **You have no linked resources**.

4. Click **Link a Resource** to open the **Link a Resource** wizard.

5. Click **Create a new resource** to display a list of resources types that can be linked to your website.

6. Click **SQL Database** to display the **Link Database** wizard.

7. Complete required fields on pages 3 and 4 of the **Link Database** wizard and then click the **Finish** checkmark on page 4.

Azure will create a SQL database with the specified parameters and link the database to the website.

<!-- HOW TO: CONFIGURE A WEBSITE TO USE A MYSQL DATABASE -->
##<a name="howtoconfigMySQL"></a>How to: Configure a website to use a MySQL database##
To configure a website to use a MySQL database, follow the same steps to use a SQL database, but in the **Link a Resource** wizard, choose **MySQL Database** instead of **SQL Database**. 

Alternatively, you can create the website with the **Custom Create** option. In the **Database** dropdown, choose either **Create a new MySQL database** or **Use an existing MySQL database**. 

##<a name="howtodomain"></a>How to: Configure a custom domain name

For information about configuring your website to use a custom domain name, see [Configuring a custom domain name for an Azure Web Site](http://www.windowsazure.com/en-us/documentation/articles/web-sites-custom-domain-name/).

##<a name="howtoconfigSSL"></a>How to: Configure a website to use SSL##

For information about configuring SSL for a custom domain on Azure, see [Enable HTTPS for an Azure web site](http://www.windowsazure.com/en-us/documentation/articles/web-sites-configure-ssl-certificate/). 

##<a name="next"></a>Next steps

* [How to Scale Web Sites](http://www.windowsazure.com/en-us/documentation/articles/web-sites-scale/)

* [How to Monitor Web Sites](http://www.windowsazure.com/en-us/documentation/articles/web-sites-monitor/)

