<properties 
	pageTitle="Secure a web app in Azure App Service" 
	description="Learn how to secure an Azure web app." 
	services="app-service\web" 
	documentationCenter="" 
	authors="cephalin" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="03/24/2015" 
	ms.author="cephalin"/>


#Secure a web app in Azure App Service

One of the challenges of developing a web app is how to provide a safe and secure service for your customers. In this article, you will learn about features of [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) that can secure your web app.

> [AZURE.NOTE] A full discussion of security considerations for web-based applications is beyond the scope of this document. As a starting point for further guidance on securing web applications, see the [Open Web Application Security Project (OWASP)]( https://www.owasp.org/index.php/Main_Page), specifically the [top 10 project.](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project), which lists the current top 10 critical web application security flaws, as determined by OWASP members.

##<a name="https"></a> Secure communications

If you use the ***.azurewebsites.net** domain name created for your web app, you can immediately use HTTPS, as an SSL certificate is provided for all ***.azurewebsites.net** domain names. If your site uses a [custom domain name](web-sites-custom-domain-name.md), you can upload an SSL certificate to [enable HTTPS](web-sites-configure-ssl-certificate.md) for the custom domain.

##<a name="develop"></a> Secure development 

### Publishing profiles and publish settings

When developing applications, performing management tasks, or automating tasks using utilities such as **Visual Studio**, **Web Matrix**, **Azure PowerShell** or the Azure **Cross-Platform Command-Line Interface**, you can use either a *publish settings* file or a *publishing profile*. Both authenticate you to Azure, and should be secured to prevent unauthorized access.

* A **publish settings** file contains

	* Your Azure subscription ID

	* A management certificate that allows you to perform management tasks for your subscription *without having to provide an account name or password*.

* A **publishing profile** file contains

	* Information for publishing to your web app

If you use a utility that uses publish settings or publish profile, import the file containing the publish settings or profile into the utility and then **delete** the file. If you must keep the file, to share with others working on the project for example, store it in a secure location such as an **encrypted** directory with restricted permissions.

Additionally, you should make sure the imported credentials are secured. For example, **Azure PowerShell** and the **Azure Cross-Platform Command-Line Interface** both store imported information in your **home directory** (*~* on Linux or OS X systems and */users/yourusername* on Windows systems.) For extra security, you may wish to **encrypt** these locations using encryption tools available for your operating system.

### Configuration settings, and connection strings
It's common practice to store connection strings, authentication credentials, and other sensitive information in configuration files. Unfortunately, these files may be exposed on your website, or checked into a public repository, exposing this information.

Azure App Service allows you to store configuration information as part of the Web Apps runtime environment as **app settings** and **connection strings**. The values are exposed to your application at runtime through *environment variables* for most programming languages. For .NET applications, these values are injected into your .NET configuration at runtime.

**App settings** and **connection strings** are configurable using the [Azure Portal](http://go.microsoft.com/fwlink/?LinkId=529715) or utilities such as PowerShell or the Azure Cross-Platform Command-Line Interface.

For more information on app settings and connection strings, see [Configuring web apps](web-sites-configure.md).

### FTPS

Azure provides secure FTP access access to the file system for your web app through **FTPS**. This allows you to securely access the application code on the web app as well as diagnostics logs. The FTPS link for your web app can be found on the **Dashboard** page in the [Azure Management Portal](https://manage.windowsazure.com).

For more information on FTPS, see [File Transfer Protocol](http://en.wikipedia.org/wiki/File_Transfer_Protocol).

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## Next steps

For more information on the security of the Azure platform, information on reporting a **security incident or abuse**, or to inform Microsoft that you will be performing **penetration testing** of your site, see the security section of the [Microsoft Azure Trust Center](http://azure.microsoft.com/support/trust-center/security/).

For more information on **web.config** or **applicationhost.config** files in web apps, see [Configuration options unlocked in Azure App Service web apps](http://azure.microsoft.com/blog/2014/01/28/more-to-explore-configuration-options-unlocked-in-windows-azure-web-sites/).

For information on logging information for web apps, which may be useful in detecting attacks, see [Enable diagnostic logging](web-sites-enable-diagnostic-log.md).

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)

* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)
