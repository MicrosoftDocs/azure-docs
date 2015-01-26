<properties pageTitle="Transform and extend your site" description="TBD" authors="cephalin" writer="cephalin" editor="mollybos" manager="wpickett" services="web-sites" documentationCenter=""/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/24/2014" ms.author="cephalin"/>

# Transform and extend your site

By using [XML Document Transformation](http://msdn.microsoft.com/en-us/library/dd465326.aspx) (XDT) declarations, you can transform the [ApplicationHost.config](http://www.iis.net/learn/get-started/planning-your-iis-architecture/introduction-to-applicationhostconfig) file in your Windows Azure websites. You can also use XDT declarations to add private site extensions to enable custom site administration actions. This article includes a sample PHP Manager site extension that enables management of PHP settings through a web interface.


<!-- MINI TOC -->

* [Transform the Site Configuration in ApplicationHost.config](#transform)
* [Extend your Site](#extend)
	* [Overview of private site extensions](#overview)
	* [Site extension example: PHP Manager](#SiteSample)
		* [The PHP Manager web app](#PHPwebapp)
		* [The applicationHost.xdt file](#XDT)
	* [Site extension deployment](#deploy)

<h2><a id="transform"></a>Transform the Site Configuration in ApplicationHost.config</h2>
The Azure Websites platform provides flexibility and control for site configuration. Although the standard IIS ApplicationHost.config configuration file is not available for direct editing in Windows Azure Websites, the platform supports a declarative ApplicationHost.config transform model based on XML Document Transformation (XDT).

To leverage this transform functionality, you create an ApplicationHost.xdt file with XDT content and place under the site root. Then, on the **Configure** page in the Windows Azure Portal, you set the `WEBSITE_PRIVATE_EXTENSIONS` app setting to 1 (you may need to restart the site). 

The following applicationHost.xdt sample shows how to add a new custom environment variable to a site that uses PHP 5.4.

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


<h2><a id="extend"></a>Extend your Site</h2>
<h3><a id="overview"></a>Overview of private site extensions</h3>
Azure Websites supports site extensions as an extensibility point for site administrative actions. In fact, some Azure Websites platform features are implemented as pre-installed site extensions. While the pre-installed platform extensions cannot be modified, you can create and configure private extensions for your own sites. This functionality also relies on XDT declarations. The key steps for creating a private site extension are the following:

1. Site extension **content**: create any web application supported by Azure Websites
2. Site extension **declaration**: create an ApplicationHost.xdt file
3. Site extension **deployment**: place content in the SiteExtensions folder under `root`
4.  Site extension **enablement**: set the `WEBSITE_PRIVATE_EXTENSIONS` app setting to 1

Internal links for the web application should point to a path relative to the application path specified in the ApplicationHost.xdt file. Any change to the ApplicationHost.xdt file requires a site recycle. 

**Note**: Additional information for these key elements is available at [https://github.com/projectkudu/kudu/wiki/Azure-Site-Extensions](https://github.com/projectkudu/kudu/wiki/Azure-Site-Extensions). A detailed example is included to illustrate the steps for creating and enabling a private site extension. The source code for the PHP Manager example that follows can be downloaded from [https://github.com/projectkudu/PHPManager](https://github.com/projectkudu/PHPManager).

<h3><a id="SiteSample"></a>Site extension example: PHP Manager</h3>

PHP Manager is a site extension that allows site administrators to easily view and configure their PHP settings using a web interface instead of having to modify PHP .ini files directly. Common configuration files for PHP include the php.ini file located under Program Files and the .user.ini file located in the root folder of your site. Since the php.ini file is not directly editable on the Azure Websites platform, the PHP Manager extension uses the .user.ini file to apply setting changes.

<h4><a id="PHPwebapp"></a>The PHP Manager web app</h4>
	
The following is the home page of the PHP Manager website:

![TransformSitePHPUI][TransformSitePHPUI]

As you can see, a site extension is just like a regular web application, but with an additional ApplicationHost.xdt file placed in the root folder of the site (more details about the ApplicationHost.xdt file are available in the next section of this article).

The PHP Manager extension was created using the Visual Studio ASP.NET MVC 4 Web Application template. The following view from Solution Explorer shows the structure of the PHP Manager site extension.

![TransformSiteSolEx][TransformSiteSolEx]

The only special logic needed for file I/O is to indicate where the wwwroot directory of the site is located. As the following code example shows, the environment variable "HOME" indicates the site root path, and the wwwroot path can be constructed by appending "site\wwwroot":


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

One point of caution with site extensions regards the handling of internal links.  If you have any links in your HTML files that give absolute paths to internal links on your site, you must ensure those links are prepended with your extension name as your site root. This is needed because the site root for your extension is now "/`[your-extension-name]`/" rather than being just "/", so any internal links must be updated accordingly. For example, suppose your code includes a link to the following: 

`"<a href="/Home/Settings">PHP Settings</a>"`

When the link is part of a site extension, the link must be in the following form:

`"<a href="/[your-site-name]/Home/Settings">Settings</a>"` 

You can work around this requirement by either using only relative paths within your website, or in the case of ASP.NET websites, by using the `@Html.ActionLink` method which creates the appropriate links for you.

<h4><a id="XDT"></a>The applicationHost.xdt file</h4>

The code for your site extension goes under %HOME%\SiteExtensions\[your-extension-name]. We'll call this the extension root.  

To register your site extension with the applicationHost.config file, you need to place a file called ApplicationHost.xdt in the extension root. The contents of the ApplicationHost.xdt file should be as follows:

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

<h3><a id="deploy"></a>Site extension deployment</h3>

To install your site extension, you can use FTP to copy all the files of your web app to the `\SiteExtensions\[your-extension-name]` folder of the site on which you want to install the extension.  Be sure to copy the ApplicationHost.xdt file to this location as well.

Next, in the Windows Azure Websites Portal, go to the **Configure** tab for the website that has your extension. In the **app settings** section, add the key `WEBSITE_PRIVATE_EXTENSIONS` and give it a value of `1`.

![TransformSiteappSettings][TransformSiteappSettings]

Finally, in the Windows Azure Portal, restart your website to enable your extension.

![TransformSiteRestart][TransformSiteRestart]

You should be able to see your site extension at:


`https://[your-site-name].scm.azurewebsites.net/[your-extension-name]` 

Note that the URL looks just like the URL for your site, except that it uses HTTPS and contains ".scm". 

<!-- IMAGES -->
[TransformSitePHPUI]: ./media/web-sites-transform-extend/TransformSitePHPUI.png
[TransformSiteSolEx]: ./media/web-sites-transform-extend/TransformSiteSolEx.png
[TransformSiteappSettings]: ./media/web-sites-transform-extend/TransformSiteappSettings.png
[TransformSiteRestart]: ./media/web-sites-transform-extend/TransformSiteRestart.png



