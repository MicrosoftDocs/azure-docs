<properties linkid="manage-services-how-to-configure-websites" urlDisplayName="How to configure" pageTitle="How to configure web sites - Windows Azure service management" metaKeywords="Azure websites, configuring Azure websites, Azure SQL database, Azure MySQL" metaDescription="Learn how to configure web sites in Windows Azure, including how to configure a web site to use a SQL Database or MySQL database." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />



# How to Configure Websites #

<div chunk="../../Shared/Chunks/disclaimer.md" />

In the Windows Azure (Preview) Management Portal you can change the configuration options for websites and you can link website to other Windows Azure resources. For example, you can link websites to a SQL Database to provide additional functionality. You can also configure websites to use a new or existing MySQL database.

## Table of Contents ##
- [How to: Change configuration options for a website](#howtochangeconfig)
- [How to: Configure a website to use a SQL database](#howtoconfigSQL)
- [How to: Configure a website to use a MySQL database](#howtoconfigMySQL)


##<a name="howtochangeconfig"></a>How to: Change configuration options for a website

Follow these steps to change configuration options for a website.

<ol>
	<li>In the Management Portal, open the website's management pages.</li>
	<li>Click the <strong>Configure</strong> tab to open the <strong>Configure</strong> management page.</li>
	<li>Set the following configuration options for the website as appropriate:
	<ul>
	<li style="margin-left: 40px"><strong>framework</strong> – Set the version of .NET framework or PHP required by your web application.</li>
	<li style="margin-left: 40px"><strong>hostnames</strong> – Enter additional hostnames for the website here. Additional hostnames are limited to changing only the 
	portion of the fully qualified "dot delimited" domain name that precedes the first period or “dot”. For example if the original website name is MySite.azure-test.windows.net then additional hostnames must use the nomenclature newhostname.azure-test.windows.net and retain the first period plus everything to the right of the first period.<br /><strong>Note</strong><br />Functionality 
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
	the XSL file provides functionality for formatting and filtering the contents of the XML file(s) when viewed in Internet Explorer.</li>
	</ul>
	</li>
	<li><strong>App Settings</strong> – Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be 
	injected into your .NET configuration AppSettings at runtime, overriding existing settings. For PHP and Node sites these settings will be 
	available as environment variables at runtime.</li>
	<li><strong>Connections Strings</strong> – View connection strings for linked resources. For .NET sites, these connection strings will be injected into your .NET configuration connectionStrings settings at runtime, overriding existing entries where the key equals the linked database name. For PHP 
	and Node sites these settings will be available as environment variables at runtime, prefixed with the connection type. The environment variable prefixes are as follows: <br />
<ul><li>SqlServer: SQLCONNSTR_</li>
<li>MySql: MYSQLCONNSTR_</li>
<li>Sql Azure: SQLAZURECONNSTR_</li>
<li>Custom: CUSTOMCONNSTR_</li></ul>For example, if a MySql connection string were named connectionstring1, it would be accessed through the environment variable <code>MYSQLCONNSTR_connectionString1</code>.
	<strong>Note</strong><br />Connection strings are created when you link a database resource to a website and are read only when viewed on the 
	configuration management page.</li>
	<li><strong>Default Documents</strong> – Add your website's default document to this list if it is not already in the list. A website’s default 
	document is the web page that is displayed when a user navigates to a website and does not specify a particular page on the website. So given the 
	website http://contoso.com, if the default document is set to default.htm, a user would be routed to http://www.contoso.com/default.htm when pointing 
	their browser to http://www.contoso.com. If your website contains more than one of the files in the list then make sure your website’s default document 
	is at the top of the list by changing the order of the files in the list.</li>
	</ul></li>
	<li>Click <strong>Save</strong> at the bottom of the <strong>Configure</strong> management page to save configuration changes.</li>
</ol>


##<a name="howtoconfigSQL"></a>How to: Configure a website to use a SQL database

Follow these steps to link a website to a SQL Database:

1. In the [Management Portal](http://manage.windowsazure.com), welect **Web Sites** to display the list of web sites created by the currently logged on account.

2. Select a website from the list of web sites to open the website's **Management** pages.

3. Click the **Linked Resources** tab and a message will be displayed on the **Linked Resources** page indicating **You have no linked resources**.

4. Click **Link a Resource** to open the **Link Resource** wizard.

5. Click **Create a new resource** to display a list of resources types that can be linked to your website.

6. Click **SQL Database** to display the **Link Database** wizard.

7. Complete required fields on pages 3 and 4 of the **Link Database** wizard and then click the **Finish** checkmark on page 4.

Windows Azure will create a SQL database with the specified parameters and link the database to the website.

##<a name="howtoconfigMySQL"></a>How to: Configure a website to use a MySQL database##
To configure a website to use a MySQL database you must create the website with the **Create With Database** option and then specify either to "Use an existing MySQL database" or "Create a new MySQL database." 

You can't add MySQL databases to a website as a linked resource. They aren't displayed in the Management Portal as a type of cloud resource.





