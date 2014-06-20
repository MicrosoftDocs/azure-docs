<properties title="Securing an Azure Web Site" pageTitle="Securing an Azure Web Site." description="Learn how to secure an Azure Web Site." metaKeywords="Azure web site security, azure web site https, azure web site ftps, azure web site ssl, azure web site ssl rewrite" services="web-sites" solutions="" documentationCenter="web" authors="larryfr" videoId="" scriptId="" />


##Securing a web application in an Azure Web Site

One of the challenges of developing a web application is how to provide a safe and secure service for your customers. In this article, you will learn about features of Azure Web Sites that can secure your web application.

> [WACOM.NOTE] A full discussion of security considerations for web-based applications is beyond the scope of this document. As a starting point for further guidance on securing web applications, see the [Open Web Application Security Project (OWASP)]( https://www.owasp.org/index.php/Main_Page), specifically the [top 10 project.](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project), which lists the current top 10 critical web application security flaws, as determined by OWASP members.

###Table of contents

* [Secure communications](#https)
* [Secure development](#develop)
* [Next steps](#next)
 
##<a name="https"></a>Secure communications

If you use the ***.azurewebsites.net** domain name created for your web site, you can immediately use HTTPS, as an SSL certificate is provided for all ***.azurewebsites.net** domain names. If your site uses a [custom domain name](http://azure.microsoft.com/en-us/documentation/articles/web-sites-custom-domain-name/), you can upload an SSL certificate to enable HTTPS for the custom domain.

For more information, see [Enable HTTPS for an Azure Web Site](/en-us/documentation/articles/web-sites-configure-ssl-certificate/).

###Enforcing HTTPS

Azure Web Sites do *not* enforce HTTPS; visitors may still access your site using HTTP, which might expose sensitive information. To enforce HTTPS, use the **URL Rewrite** module. The URL Rewrite module is included with Azure Web Sites, and allows you to define rules that are applied to incoming requests before the requests are handed to your application. It can be used for applications written in any programming language supported by Azure Web Sites. 

> [WACOM.NOTE] .NET MVC applications should use the [RequireHttps](http://msdn.microsoft.com/en-us/library/system.web.mvc.requirehttpsattribute.aspx) filter instead of URL Rewrite. For more information on using RequireHttps, see [Deploy a secure ASP.NET MVC 5 app to an Azure Web Site](/en-us/documentation/articles/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database/).
> 
> For information on programmatic redirection of requests using other programming languages and frameworks, consult the documentation for those technologies.

URL Rewrite rules are defined in a **web.config** file stored in the root of your application. The following example contains a basic URL Rewrite rule that forces all incoming traffic to use HTTPS.

<a name="example"></a>**URL Rewrite Example Web.Config**

	<?xml version="1.0" encoding="UTF-8"?>
	<configuration>
	  <system.webServer>
	    <rewrite>
	      <rules>
	        <rule name="Force HTTPS" enabled="true">
	          <match url="(.*)" ignoreCase="false" />
	          <conditions>
	            <add input="{HTTPS}" pattern="off" />
	          </conditions>
	          <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" appendQueryString="true" redirectType="Permanent" />
	        </rule>
	      </rules>
	    </rewrite>
	  </system.webServer>
	</configuration>

This rule works by returning an HTTP status code of 301 (permanent redirect) when the user requests a page using HTTP. The 301 redirects the request to the same URL as the visitor requested, but replaces the HTTP portion of the request with HTTPS. For example, HTTP://contoso.com would be redirected to HTTPS://contoso.com.

> [WACOM.NOTE] If your application is written in  **Node.js**, **PHP**, **Python Django**, or **Java**, it probably doesn't include a web.config file. However **Node.js**, **Python Django**, and **Java** all actually do use a web.config when hosted on Azure Web Sites - Azure creates the file automatically during deployment, so you never see it. If you include one as part of your application, it will override the one that Azure automatically generates.

###.NET

For .NET applications, modify the web.config file for your application and add the **&lt;rewrite>** section from the [example](#example) to the **&lt;system.WebServer>** section.

If your web.config file already includes a **&lt;rewrite>** section, add the **&lt;rule>** from the [example](#example) as the first entry in the **&lt;rules>** section.

###PHP

For PHP applications, simply save the [example](#example) as a web.config file in the root of your application, then re-deploy the application to your Azure Web Site.

###Node.js, Python Django, and Java

A web.config file is automatically created for Node.js, Python Django, and Java apps if they don't already provide one, but it only exists on the server since it is created during deployment. The automatically generated file contains settings that tell Azure how to host your application.

To retrieve and modify the auto-generated file from the Web Site, use the following steps.

1. Download the file using FTP (see [Uploading/downloading files over FTP and collecting diagnostics logs](http://blogs.msdn.com/b/avkashchauhan/archive/2012/06/19/windows-azure-website-uploading-downloading-files-over-ftp-and-collecting-diagnostics-logs.aspx)).

2. Add it to the root of your application.

3. Add the rewrite rules using the following information.

	* **Node.js and Python Django**

		The web.config file generated for Node.js and Python Django applications will already have a **&lt;rewrite>** section, containing **&lt;rule>** entries that are required for the proper functioning of the site. To force the site to use HTTPS, add the **&lt;rule>** from the example as the first entry in the **&lt;rules>** section. This will force HTTPS, while leaving the rest of the rules intact.

	* **Java**
	
		The web.config file for Java applications using Apache Tomcat do not contain a **&lt;rewrite>** section, so you must add the **&lt;rewrite>** section from the example into the **&lt;system.webServer>** section.

4. Redeploy the project (including the updated web.config,) to Azure

Once you deploy a web.config with a rewrite rule to force HTTPS, it should take effect immediately and redirect all requests to HTTPS.

For more information on the IIS URL Rewrite module, see the [URL Rewrite](http://www.iis.net/downloads/microsoft/url-rewrite) documentation. 

##<a name="develop"></a>Secure development 

###Publishing profiles and publish settings

When developing applications, performing management tasks, or automating tasks using utilities such as **Visual Studio**, **Web Matrix**, **Azure PowerShell** or the Azure **Cross-Platform Command-Line Interface**, you can use either a *publish settings* file or a *publishing profile*. Both authenticate you to Azure, and should be secured to prevent unauthorized access.

* A **publish settings** file contains

	* Your Azure subscription ID

	* A management certificate that allows you to perform management tasks for your subscription *without having to provide an account name or password*.

* A **publishing profile** file contains

	* Information for publishing to your Azure Web Site

If you use a utility that uses publish settings or publish profile, import the file containing the publish settings or profile into the utility and then **delete** the file. If you must keep the file, to share with others working on the project for example, store it in a secure location such as an **encrypted** directory with restricted permissions.

Additionally, you should make sure the imported credentials are secured. For example, **Azure PowerShell** and the **Azure Cross-Platform Command-Line Interface** both store imported information in your **home directory** (*~* on Linux or OS X systems and */users/yourusername* on Windows systems.) For extra security, you may wish to **encrypt** these locations using encryption tools available for your operating system.

###Configuration settings, and connection strings
It's common practice to store connection strings, authentication credentials, and other sensitive information in configuration files. Unfortunately, these files may be exposed on your web site, or checked into a public repository, exposing this information.

Azure Web Sites allows you to store configuration information as part of the Web Sites runtime environment ass **app settings** and **connection strings**. The values are exposed to your application at runtime through *environment variables* for most programming languages. For .NET applications, these values are injected into your .NET configuration at runtime.

**App settings** and **connection strings** are configurable using the Azure management portal or utilities such as PowerShell or the Azure Cross-Platform Command-Line Interface.

For more information on app settings and connection strings, see [Configuring Web Sites](/en-us/documentation/articles/web-sites-configure/).

###FTPS

Azure provides secure FTP access access to the file system for your web site through **FTPS**. This allows you to securely access the application code on the Web Site as well as diagnostics logs. The FTPS link for your Web Site can be found on the site **Dashboard** in the [Azure Management Portal](https://manage.windowsazure.com).

For more information on FTPS, see [File Transfer Protocol](http://en.wikipedia.org/wiki/File_Transfer_Protocol).

##Next steps

For more information on the security of the Azure platform, information on reporting a **security incident or abuse**, or to inform Microsoft that you will be performing **penetration testing** of your site, see the security section of the [Microsoft Azure Trust Center](/en-us/support/trust-center/security/).

For more information on **web.config** or **applicationhost.config** files in Azure Web Sites, see [Configuration options unlocked in Azure Web Sites](http://azure.microsoft.com/blog/2014/01/28/more-to-explore-configuration-options-unlocked-in-windows-azure-web-sites/).

For information on logging information for Azure Web Sites, which may be useful in detecting attacks, see [Enable diagnostic logging](/en-us/documentation/articles/web-sites-enable-diagnostic-log/).