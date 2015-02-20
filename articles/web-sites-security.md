<properties 
	pageTitle="Securing an Azure Website." 
	description="Learn how to secure an Azure Website." 
	services="web-sites" 
	documentationCenter="" 
	authors="cephalin" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="web-sites" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="02/11/2015" 
	ms.author="cephalin"/>


# Securing a web application in an Azure Website

One of the challenges of developing a web application is how to provide a safe and secure service for your customers. In this article, you will learn about features of Azure Websites that can secure your web application.

> [AZURE.NOTE] A full discussion of security considerations for web-based applications is beyond the scope of this document. As a starting point for further guidance on securing web applications, see the [Open Web Application Security Project (OWASP)]( https://www.owasp.org/index.php/Main_Page), specifically the [top 10 project.](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project), which lists the current top 10 critical web application security flaws, as determined by OWASP members.

##<a name="https"></a> Secure communications

If you use the ***.azurewebsites.net** domain name created for your website, you can immediately use HTTPS, as an SSL certificate is provided for all ***.azurewebsites.net** domain names. If your site uses a [custom domain name](../web-sites-custom-domain-name/), you can upload an SSL certificate to [enable HTTPS](../web-sites-configure-ssl-certificate/) for the custom domain.

##<a name="develop"></a> Secure development 

### Publishing profiles and publish settings

When developing applications, performing management tasks, or automating tasks using utilities such as **Visual Studio**, **Web Matrix**, **Azure PowerShell** or the Azure **Cross-Platform Command-Line Interface**, you can use either a *publish settings* file or a *publishing profile*. Both authenticate you to Azure, and should be secured to prevent unauthorized access.

* A **publish settings** file contains

	* Your Azure subscription ID

	* A management certificate that allows you to perform management tasks for your subscription *without having to provide an account name or password*.

* A **publishing profile** file contains

	* Information for publishing to your Azure Website

If you use a utility that uses publish settings or publish profile, import the file containing the publish settings or profile into the utility and then **delete** the file. If you must keep the file, to share with others working on the project for example, store it in a secure location such as an **encrypted** directory with restricted permissions.

Additionally, you should make sure the imported credentials are secured. For example, **Azure PowerShell** and the **Azure Cross-Platform Command-Line Interface** both store imported information in your **home directory** (*~* on Linux or OS X systems and */users/yourusername* on Windows systems.) For extra security, you may wish to **encrypt** these locations using encryption tools available for your operating system.

### Configuration settings, and connection strings
It's common practice to store connection strings, authentication credentials, and other sensitive information in configuration files. Unfortunately, these files may be exposed on your website, or checked into a public repository, exposing this information.

Azure Websites allows you to store configuration information as part of the Websites runtime environment ass **app settings** and **connection strings**. The values are exposed to your application at runtime through *environment variables* for most programming languages. For .NET applications, these values are injected into your .NET configuration at runtime.

**App settings** and **connection strings** are configurable using the Azure management portal or utilities such as PowerShell or the Azure Cross-Platform Command-Line Interface.

For more information on app settings and connection strings, see [Configuring Web Sites](../web-sites-configure/).

### FTPS

Azure provides secure FTP access access to the file system for your website through **FTPS**. This allows you to securely access the application code on the Website as well as diagnostics logs. The FTPS link for your Website can be found on the site **Dashboard** in the [Azure Management Portal](https://manage.windowsazure.com).

For more information on FTPS, see [File Transfer Protocol](http://en.wikipedia.org/wiki/File_Transfer_Protocol).

## Next steps

For more information on the security of the Azure platform, information on reporting a **security incident or abuse**, or to inform Microsoft that you will be performing **penetration testing** of your site, see the security section of the [Microsoft Azure Trust Center](http://azure.microsoft.com/support/trust-center/security/).

For more information on **web.config** or **applicationhost.config** files in Azure Websites, see [Configuration options unlocked in Azure Web Sites](http://azure.microsoft.com/blog/2014/01/28/more-to-explore-configuration-options-unlocked-in-windows-azure-web-sites/).

For information on logging information for Azure Websites, which may be useful in detecting attacks, see [Enable diagnostic logging](../web-sites-enable-diagnostic-log/).
