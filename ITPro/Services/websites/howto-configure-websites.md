<properties linkid="manage-services-how-to-configure-websites" urlDisplayName="How to configure" pageTitle="How to configure web sites - Windows Azure service management" metaKeywords="Azure Web Sites, configuring Azure Web Sites, Azure SQL database, Azure MySQL" metaDescription="Learn how to configure web sites in Windows Azure, including how to configure a web site to use a SQL Database or MySQL database." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />



# How to Configure Web Sites #

<div chunk="../../Shared/Chunks/disclaimer.md" />

In the Windows Azure Management Portal you can change the configuration options for web sites and you can link web site to other Windows Azure resources. For example, you can link web sites to a SQL Database to provide additional functionality. You can also configure web sites to use a new or existing MySQL database.

## Table of Contents ##
- [How to: Change configuration options for a web site](#howtochangeconfig)
- [How to: Configure a web site to use a SQL database](#howtoconfigSQL)
- [How to: Configure a web site to use a MySQL database](#howtoconfigMySQL)


##<a name="howtochangeconfig"></a>How to: Change configuration options for a web site

Follow these steps to change configuration options for a web site.

<ol>
	<li>In the Management Portal, open the web site's management pages.</li>
	<li>Click the <strong>Configure</strong> tab to open the <strong>Configure</strong> management page.</li>
	<li>Set the following configuration options for the web site as appropriate:
	<ul>
	<li style="margin-left: 40px"><strong>general</strong> – Set the version of .NET framework or PHP required by your web application. For sites in Reserved mode, there is an option to choose either a 32-bit or 64-bit platform. Sites in the Free and Shared modes always run in a 32-bit environment.</li>

<li style="margin-left: 40px">
<strong>certificates</strong> – Click <strong>upload</strong> to upload an SSL certificate for a custom domain. The certificates you upload are listed here. Wildcard ("star") certificates (certificates with an asterisk) are supported. After you upload a certificate, you can assign it to any web site in your subscription and region. A star certificate only has to be uploaded once, but can be used for any site within the domain for which it is valid. A certificate can be deleted only if no bindings in any site are active for the given certificate.
<br /><strong>Note:</strong>
Custom domains are available only in Shared and Reserved modes.
</li>

<li style="margin-left: 40px"><strong>domain names</strong> – View or add additional domain names for the web site here. You can add custom domains by clicking <strong>Manage Domains</strong>. Custom domains are available only in <strong>Shared</strong> and <strong>Reserved</strong> modes, as specified on the <strong>Scale</strong> management page. Custom domains are not available in Free mode. For more information on configuring custom domains, see [Configuring a custom domain name for a Windows Azure web site](http://www.windowsazure.com/en-us/develop/net/common-tasks/custom-dns-web-site/).</li>

<li style="margin-left: 40px"><strong>SSL Bindings</strong> - Choose an SSL mode (<strong>SNI</strong>, <strong>IP</strong>, or <strong>No SSL</strong>) for a particular domain name. If you choose SNI or IP, you can specify a certificate for the domain from the certificates you have uploaded. For more information about SNI, see [http://en.wikipedia.org/wiki/Server_Name_Indication](http://en.wikipedia.org/wiki/Server_Name_Indication "Server Name Indication").</li>

<li style="margin-left: 40px"><strong>deployments</strong> - Use these settings to configure deployments.
<ul>
<li><strong>Git URL</strong> – If you have created a Git repository on your Windows Azure web site, this is its URL - the location to which you push your content.</li>
<li><strong>Deployment Trigger URL</strong> – This URL can be set on a GitHub, CodePlex, Bitbucket, or other repository to trigger the deployment when a commit is pushed to the repository.</li>
<li><strong>Branch to Deploy</strong> – This lets you specify the branch that will be deployed when you push content to it.</li>
</ul>
</li>
<li style="margin-left: 40px"><strong>application diagnostics</strong> - Set options for gathering diagnostic traces from a web application whose code has been instrumented with traces. The logging options for application diagnostics include:<ul><li><strong>Application Logging (File System)</strong> - Choose <strong>On</strong> to have the application logs written to the web site's file system. When enabled, file system logging lasts for a period of 12 hours. You can access the logs from the FTP share for the web site. The link to the FTP share can be found on the <strong>Dashboard</strong>. Under <strong>Quick Glance</strong>, choose <strong>FTP Diagnostic Logs</strong> or <strong>FTPS Diagnostic Logs</strong>.</li>

<li><strong>Application Logging (Storage)</strong> - Choose <strong>On</strong> to have your application logs written to a Windows Azure storage account. Logging to a storage account has no time limit and stays enabled until you disable it. By default, the logs are stored in a table called WAWSAppLogTable.</li>
<li><strong>Logging Level</strong> - When logging is enabled, this option specifies the amount of information that will be recorded (Error, Warning, Information, or Verbose).</li>
<li><strong>Diagnostic Storage</strong> – Clicking <strong>Manage Connection</strong> opens the <strong>Manage diagnostic storage</strong> dialog with the following options for saving logs to your Azure storage account:
<ul>
<li><strong>Storage Account Name</strong> - Choose the storage account to which you would like to have the logs saved.</li>
<li><strong>Storage Access Key</strong> - Displays the key for the chosen storage account. If you have regenerated the key for the storage account, type the new key here manually, or use one of the <strong>Synchronize</strong> buttons. The synchronize buttons are available only if the currently logged on user has access to the selected storage account.
</li>
<li><strong>Synchronize Primary Key</strong> - Retrieves the latest primary key of your Windows Azure Storage account.
</li>
<li><strong>Synchronize Secondary Key</strong> - Retrieves the latest secondary key of your Windows Azure Storage account.
<br /><strong>Note:</strong> 
For more information about Windows Azure Storage Access Keys, see [How to: View, copy, and regenerate storage access keys](https://www.windowsazure.com/en-us/manage/services/storage/how-to-manage-a-storage-account/ "How to: View, copy, and regenerate storage access keys").
</li></ul></li></ul></li>
<li style="margin-left: 40px"><strong>site diagnostics</strong> – Set options for gathering diagnostic 
	information for your web site, including:
	<ul>
	<li style="margin-left: 60px"><strong>Web Server Logging</strong> – Specify whether to enable web server logging for the web site. 
	If enabled, web server logs are saved with the W3C extended log file format to the FTP site listed under FTP Diagnostic Logs on the 
	Dashboard management page. After connecting to the specified FTP site navigate to /wwwroot/LogFiles/http/RawLogs/ to retrieve the web server logs.</li>
	<li style="margin-left: 60px"><strong>Detailed Error Messages</strong> – Specify whether to log detailed error messages for the web site. 
	If enabled, detailed error messages are saved as .htm files to the FTP site listed under FTP Diagnostic Logs on the Dashboard management page. 
	After connecting to the specified FTP site navigate to /LogFiles/DetailedErrors/ to retrieve the .htm files which contain detailed error messages.</li>
	<li style="margin-left: 60px"><strong>Failed Request Tracing</strong> – Specify whether to enable failed request tracing. If enabled, 
	failed request tracing output is written to XML files and saved to the FTP site listed under FTP Diagnostic Logs on the Dashboard management page. 
	After connecting to the specified FTP site navigate to /LogFiles/W3SVC######### (where ######### represent a unique identifier for the web site) 
	to retrieve the XML files that contain the failed request tracing output.<br /><strong>Important</strong><br />The /LogFiles/W3SVC#########/ 
	folder contains an XSL file and one or more XML files. Ensure that you download the XSL file into the same directory as the XML file(s) because 
	the XSL file provides functionality for formatting and filtering the contents of the XML file(s) when viewed in Internet Explorer.</li>
	</ul>
	</li>
<li><strong>monitoring</strong> - For web sites in Reserved mode, test the availability of HTTP or HTTPS endpoints. You can test an endpoint from up to three geo-distributed locations. A monitoring test fails if the HTTP response code is greater than or equal to 400 or if the response takes more than 30 seconds. An endpoint is considered available if its monitoring tests succeed from all the specified locations.
</li>
	<li><strong>app settings</strong> – Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be 
	injected into your .NET configuration AppSettings at runtime, overriding existing settings. For PHP and Node sites these settings will be 
	available as environment variables at runtime.</li>
	<li><strong>connection strings</strong> – View connection strings for linked resources. For .NET sites, these connection strings will be injected into your .NET configuration connectionStrings settings at runtime, overriding existing entries where the key equals the linked database name. For PHP 
	and Node sites these settings will be available as environment variables at runtime, prefixed with the connection type. The environment variable prefixes are as follows: <br />
<ul><li>SQL Server: SQLCONNSTR_</li>
<li>MySQL: MYSQLCONNSTR_</li>
<li>SQL Database: SQLAZURECONNSTR_</li>
<li>Custom: CUSTOMCONNSTR_</li></ul>For example, if a MySql connection string were named connectionstring1, it would be accessed through the environment variable <code>MYSQLCONNSTR_connectionString1</code>.
	<br /><strong>Note</strong>: Connection strings are created when you link a database resource to a web site and are read only when viewed on the 
	configuration management page.</li>
	<li><strong>default documents</strong> – Add your web site's default document to this list if it is not already in the list. A web site’s default 
	document is the web page that is displayed when a user navigates to a web site and does not specify a particular page on the web site. So given the 
	web site http://contoso.com, if the default document is set to default.htm, a user would be routed to http://www.contoso.com/default.htm when pointing 
	their browser to http://www.contoso.com. If your web site contains more than one of the files in the list, then make sure your web site’s default document 
	is at the top of the list by changing the order of the files in the list.</li>
<li><strong>handler mappings</strong> -  Add custom script processors to handle requests for specific file extensions. Specify the file extension to be handled in the <strong>Extension</strong> box (for example, *.php or handler.fcgi). Requests to files that match this pattern will be processed by the script processor specified in the <strong>Script Processor Path</strong> box. An absolute path is required for the script processor (the path D:\home\site\wwwroot can be used to refer to your site's root directory). Optional command-line arguments for the script processor may be specified in the <strong>Additional Arguments (Optional)</strong> box.
</li>	
	
</ul></li>
<li>Click <strong>Save</strong> at the bottom of the <strong>Configure</strong> management page to save configuration changes.</li>
</ol>


##<a name="howtoconfigSQL"></a>How to: Configure a web site to use a SQL database

Follow these steps to link a web site to a SQL Database:

1. In the [Management Portal](http://manage.windowsazure.com), select **Web Sites** to display the list of web sites created by the currently logged on account.

2. Select a web site from the list of web sites to open the web site's **Management** pages.

3. Click the **Linked Resources** tab and a message will be displayed on the **Linked Resources** page indicating **You have no linked resources**.

4. Click **Link a Resource** to open the **Link Resource** wizard.

5. Click **Create a new resource** to display a list of resources types that can be linked to your web site.

6. Click **SQL Database** to display the **Link Database** wizard.

7. Complete required fields on pages 3 and 4 of the **Link Database** wizard and then click the **Finish** checkmark on page 4.

Windows Azure will create a SQL database with the specified parameters and link the database to the web site.

##<a name="howtoconfigMySQL"></a>How to: Configure a web site to use a MySQL database##
To configure a web site to use a MySQL database you must create the web site with the **Create With Database** option and then specify either to "Use an existing MySQL database" or "Create a new MySQL database." 

You can't add MySQL databases to a web site as a linked resource. They aren't displayed in the Management Portal as a type of cloud resource.





