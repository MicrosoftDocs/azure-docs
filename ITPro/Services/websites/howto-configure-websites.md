<properties umbracoNaviHide="0" pageTitle="How to Configure Websites" metaKeywords="Windows Azure Websites, Azure deployment, Azure configuration changes, Azure deployment update, Windows Azure .NET deployment, Azure .NET deployment" metaDescription="Learn how to configure Websites in Windows Azure to use a SQL or MySQL database, and learn how to configure diagnostics and download logs." linkid="itpro-windows-howto-configure-websites" urlDisplayName="How to Configure Websites" headerExpose="" footerExpose="" disqusComments="1" />

# How to Configure Websites #

In the Management Portal you can change the configuration options for websites and you can link website to other Windows Azure resources. For example, you can link websites to a SQL Database to provide additional functionality. You can also configure websites to use a new or existing MySQL database.

## Table of Contents ##
- [How to: Change Configuration Options for a Website](#howtochangeconfig)
- [How to: Configure a website to use a SQL Database](#howtoconfigSQL)
- [How to: Configure a website to Use a MySQL Database](#howtoconfigMySQL)
- [How to: Configure Diagnostics and Download Logs for a Website](#howtoconfigdiagnostics)
- [Next Steps](#nextsteps)


##<a name="howtochangeconfig"></a>How to: Change Configuration Options for a Website

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


##<a name="howtoconfigSQL"></a>How to: Configure a website to use a SQL Database

Follow these steps to link a website to a SQL Database:

1. Select **Web Sites** on the left hand side of the Windows Azure portal to display the list of web sites created by the currently logged on account.
2. Select a website from the list of web sites to open the website’s **Management** pages.
3. Click the **Linked Resources** tab and a message will be displayed on the **Linked Resources** page indicating **You have no linked resources**.
4. Click **Link a Resource** to open the **Link Resource** wizard.
5. Click **Create a new resource** to display a list of resources types that can be linked to your website.
6. Click **SQL Database** to display the **Link Database** wizard.
7. Complete required fields on pages 3 and 4 of the **Link Database** wizard and then click the **Finish** checkmark on page 4.

Windows Azure will create a SQL database with the specified parameters and link the database to the website.

##<a name="howtoconfigMySQL"></a>How to: Configure a website to Use a MySQL Database##
To configure a website to use a MySQL database you must create the website with the **Create With Database** option and then specify either to “Use an existing MySQL database” or “Create a new MySQL database.” 

You can't add MySQL databases to a website as a linked resource. They aren't   displayed in the Management Portal as a type of cloud resource.




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





##<a name="nextsteps"></a>Next Steps



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
