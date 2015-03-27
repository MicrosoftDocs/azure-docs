<properties
	pageTitle="Azure App Service web app advanced config and extensions"
	description="Use XML Document Transformation(XDT) declarations to transform the ApplicationHost.config file in your Azure App Service web app and to add private extensions to enable custom administration actions."
	authors="cephalin"
	writer="cephalin"
	editor="mollybos"
	manager="wpickett"
	services="app-service\web"
	documentationCenter=""/>

<tags
	ms.service="app-service-web"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/24/2015"
	ms.author="cephalin"/>

# Azure App Service web app advanced config and extensions

By using [XML Document Transformation](http://msdn.microsoft.com/library/dd465326.aspx) (XDT) declarations, you can transform the [ApplicationHost.config](http://www.iis.net/learn/get-started/planning-your-iis-architecture/introduction-to-applicationhostconfig) file in your web app in Azure App Service. You can also use XDT declarations to add private extensions to enable custom web app administration actions. This article includes a sample PHP Manager web app extension that enables management of PHP settings through a web interface.

##<a id="transform"></a>Advanced configuration through ApplicationHost.config
The App Service platform provides flexibility and control for web app configuration. Although the standard IIS ApplicationHost.config configuration file is not available for direct editing in App Service, the platform supports a declarative ApplicationHost.config transform model based on XML Document Transformation (XDT).

To leverage this transform functionality, you create an ApplicationHost.xdt file with XDT content and place under the web app root. You may need to restart the Web App for changes to take effect.

The following applicationHost.xdt sample shows how to add a new custom environment variable to a web app that uses PHP 5.4.

	<?xml version="1.0"?>
	<configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
  		<system.webServer>
    			<fastCgi>
      				<application>
         				<environmentVariables>
            					<environmentVariable name="CONFIGTEST" value="TEST" xdt:Transform="Insert" xdt:Locator="XPath(/configuration/system.webServer/fastCgi/application[contains(@fullPath,'5.4')]/environmentVariables)" />
         				</environmentVariables>
      				</application>
    			</fastCgi>
  		</system.webServer>
	</configuration>


A log file with transform status and details is available from the FTP root under LogFiles\Transform.

For additional samples, see [https://github.com/projectkudu/kudu/wiki/Azure-Site-Extensions](https://github.com/projectkudu/kudu/wiki/Azure-Site-Extensions).

**Note**<br />
Elements from the list of modules under `system.webServer` cannot be removed or reordered, but additions to the list are possible.


##<a id="extend"></a> Extend your web app

###<a id="overview"></a> Overview of private web app extensions

App Service supports web app extensions as an extensibility point for administrative actions. In fact, some App Service platform features are implemented as pre-installed extensions. While the pre-installed platform extensions cannot be modified, you can create and configure private extensions for your own web app. This functionality also relies on XDT declarations. The key steps for creating a private web app extension are the following:

1. Web app extension **content**: create any web application supported by App Service
2. Web app extension **declaration**: create an ApplicationHost.xdt file
3. Web app extension **deployment**: place content in the SiteExtensions folder under `root`

Internal links for the web app should point to a path relative to the application path specified in the ApplicationHost.xdt file. Any change to the ApplicationHost.xdt file requires a web app recycle.

**Note**: Additional information for these key elements is available at [https://github.com/projectkudu/kudu/wiki/Azure-Site-Extensions](https://github.com/projectkudu/kudu/wiki/Azure-Site-Extensions).

A detailed example is included to illustrate the steps for creating and enabling a private web app extension. The source code for the PHP Manager example that follows can be downloaded from [https://github.com/projectkudu/PHPManager](https://github.com/projectkudu/PHPManager).

###<a id="SiteSample"></a> Web app extension example: PHP Manager

PHP Manager is a web app extension that allows web app administrators to easily view and configure their PHP settings using a web interface instead of having to modify PHP .ini files directly. Common configuration files for PHP include the php.ini file located under Program Files and the .user.ini file located in the root folder of your web app. Since the php.ini file is not directly editable on the App Service platform, the PHP Manager extension uses the .user.ini file to apply setting changes.

####<a id="PHPwebapp"></a> The PHP Manager web application

The following is the home page of the PHP Manager deployment:

![TransformSitePHPUI][TransformSitePHPUI]

As you can see, a web app extension is just like a regular web application, but with an additional ApplicationHost.xdt file placed in the root folder of the web app (more details about the ApplicationHost.xdt file are available in the next section of this article).

The PHP Manager extension was created using the Visual Studio ASP.NET MVC 4 Web Application template. The following view from Solution Explorer shows the structure of the PHP Manager extension.

![TransformSiteSolEx][TransformSiteSolEx]

The only special logic needed for file I/O is to indicate where the wwwroot directory of the web app is located. As the following code example shows, the environment variable "HOME" indicates the web app's root path, and the wwwroot path can be constructed by appending "site\wwwroot":

	/// <summary>
	/// Gives the location of the .user.ini file, even if one doesn't exist yet
	/// </summary>
	private static string GetUserSettingsFilePath()
	{
    		var rootPath = Environment.GetEnvironmentVariable("HOME"); // For use on Azure Websites
    		if (rootPath == null)
    		{
        		rootPath = System.IO.Path.GetTempPath(); // For testing purposes
    		};
    		var userSettingsFile = Path.Combine(rootPath, @"site\wwwroot\.user.ini");
    		return userSettingsFile;
	}


After you have the directory path, you can use regular file I/O operations to read and write to files.

One point of caution with web app extensions regards the handling of internal links.  If you have any links in your HTML files that give absolute paths to internal links on your web app, you must ensure those links are prepended with your extension name as your root. This is needed because the root for your extension is now "/`[your-extension-name]`/" rather than being just "/", so any internal links must be updated accordingly. For example, suppose your code includes a link to the following:

`"<a href="/Home/Settings">PHP Settings</a>"`

When the link is part of a web app extension, the link must be in the following form:

`"<a href="/[your-site-name]/Home/Settings">Settings</a>"`

You can work around this requirement by either using only relative paths within your web application, or in the case of ASP.NET applications, by using the `@Html.ActionLink` method which creates the appropriate links for you.

####<a id="XDT"></a> The applicationHost.xdt file

The code for your web app extension goes under %HOME%\SiteExtensions\[your-extension-name]. We'll call this the extension root.  

To register your web app extension with the applicationHost.config file, you need to place a file called ApplicationHost.xdt in the extension root. The content of the ApplicationHost.xdt file should be as follows:

	<?xml version="1.0"?>
	<configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
  		<system.applicationHost>
    			<sites>
      				<site name="%XDT_SCMSITENAME%" xdt:Locator="Match(name)">
						<!-- NOTE: Add your extension name in the application paths below -->
        				<application path="/[your-extension-name]" xdt:Locator="Match(path)" xdt:Transform="Remove" />
        				<application path="/[your-extension-name]" applicationPool="%XDT_APPPOOLNAME%" xdt:Transform="Insert">
          					<virtualDirectory path="/" physicalPath="%XDT_EXTENSIONPATH%" />
        				</application>
      				</site>
    			</sites>
  		</system.applicationHost>
	</configuration>

The name you select as your extension name should have the same name as your extension root folder.

This has the effect of adding a new application path to the `system.applicationHost` sites list under the SCM site. The SCM site is a site administration end point with specific access credentials. It has the URL `https://[your-site-name].scm.azurewebsites.net`.  

	<system.applicationHost>
  		...
  		<site name="~1[your-website]" id="1716402716">
      			<bindings>
        			<binding protocol="http" bindingInformation="*:80: [your-website].scm.azurewebsites.net" />
        			<binding protocol="https" bindingInformation="*:443: [your-website].scm.azurewebsites.net" />
      			</bindings>
      			<traceFailedRequestsLogging enabled="false" directory="C:\DWASFiles\Sites\[your-website]\VirtualDirectory0\LogFiles" />
      			<detailedErrorLogging enabled="false" directory="C:\DWASFiles\Sites\[your-website]\VirtualDirectory0\LogFiles\DetailedErrors" />
      			<logFile logSiteId="false" />
      			<application path="/" applicationPool="[your-website]">
        			<virtualDirectory path="/" physicalPath="D:\Program Files (x86)\SiteExtensions\Kudu\1.24.20926.5" />
      			</application>
				<!-- Note the custom changes that go here -->
      			<application path="/[your-extension-name]" applicationPool="[your-website]">
        			<virtualDirectory path="/" physicalPath="C:\DWASFiles\Sites\[your-website]\VirtualDirectory0\SiteExtensions\[your-extension-name]" />
      			</application>
    		</site>
  	</sites>
	  ...
	</system.applicationHost>

###<a id="deploy"></a> Web app extension deployment

To install your web app extension, you can use FTP to copy all the files of your web application to the `\SiteExtensions\[your-extension-name]` folder of the web app on which you want to install the extension.  Be sure to copy the ApplicationHost.xdt file to this location as well. Restart your web app to enable the extension.

You should be able to see your web app extension at:

`https://[your-site-name].scm.azurewebsites.net/[your-extension-name]`

Note that the URL looks just like the URL for your web app, except that it uses HTTPS and contains ".scm".

It is possible to disable all private (not pre-installed) extensions for your web app during development and investigations by adding an app settings with the key `WEBSITE_PRIVATE_EXTENSIONS` and a value of `0`.

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

<!-- IMAGES -->
[TransformSitePHPUI]: ./media/web-sites-transform-extend/TransformSitePHPUI.png
[TransformSiteSolEx]: ./media/web-sites-transform-extend/TransformSiteSolEx.png
