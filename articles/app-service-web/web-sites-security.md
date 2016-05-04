<properties
	pageTitle="Secure an app in Azure App Service"
	description="Learn how to secure a web app, mobile app backend, or API app in Azure App Service."
	services="app-service"
	documentationCenter=""
	authors="cephalin"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="app-service"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="01/12/2016"
	ms.author="cephalin"/>


#Secure an app in Azure App Service

This article helps you get started on securing your web app, mobile app backend, or API app in Azure App Service. 

Security in Azure App Service has two levels: 

- **Infrastructure and platform security** - You trust Azure to have the services you need to actually run things securely in the cloud.
- **Application security** - You need to design the app itself securely. This includes how you integrate with Azure Active Directory, how you manage certificates, and how you make sure that you can securely talk to different services. 

#### Infrastructure and platform security
Because App Service maintains the Azure VMs, storage, network connections, web frameworks, management and integration features and much more, it is actively secured and hardened and goes 
through vigorous compliance and checks on a continuous basis to make sure that:

- Your App Service apps are isolated from both the Internet and from the other customers' Azure resources.
- Communication of secrets (e.g. connection strings) between your App Service app and other Azure resources (e.g. SQL Database) in a resource group stays within Azure and doesn't cross any network boundaries. Secrets are 
always encrypted.
- All communication between your App Service app and external resources, such as PowerShell management, command-line interface, Azure SDKs, REST APIs, and hybrid connections, are properly encrypted.
- 24-hour threat management protects App Service resources from malware, distributed denial-of-service (DDoS), man-in-the-middle (MITM), and other threats. 

For more information on infrastructure and platform security in Azure, see [Azure Trust Center](/support/trust-center/security/).

#### Application security

While Azure is responsible for securing the infrastructure and platform that your application runs on, it is your responsibility to secure your application itself. In other words, you need to develop, deploy, and manage your
application code and content in a secure way. Without this, your application code or content can still be vulnerable to threats such as:

- SQL Injection
- Session hijacking
- Cross-site-scripting
- Application-level MITM
- Application-level DDoS

A full discussion of security considerations for web-based applications is beyond the scope of this document. As a starting point for further guidance on securing your application,
see the [Open Web Application Security Project (OWASP)](https://www.owasp.org/index.php/Main_Page), specifically the [top 10 project.](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project), 
which lists the current top 10 critical web application security flaws, as determined by OWASP members.

## Perform penetration testing on your app

One of the easiest ways to yet started with testing for vulnerabilities on your App Service app is to use the [integration with Tinfoil Security](/blog/web-vulnerability-scanning-for-azure-app-service-powered-by-tinfoil-security/)
to perform one-click vulnerability scanning on your app. You can view the test results in an easy-to-understand report, and learn how to fix each vulnerability with step-by-step instructions.

If you prefer to perform your own penetration tests or want to use another scanner suite or provider, you must follow the [Azure penetration testing approval process](https://security-forms.azure.com/penetration-testing/terms) and 
obtain prior approval to perform the desired penetration tests.

##<a name="https"></a> Secure communication with customers

If you use the **\*.azurewebsites.net** domain name created for your App Service app, you can immediately use HTTPS, as an SSL certificate is provided for all **\*.azurewebsites.net** domain names. If your site uses a [custom domain name](web-sites-custom-domain-name.md), you can upload an SSL certificate to [enable HTTPS](web-sites-configure-ssl-certificate.md) for the custom domain.

Enabling [HTTPS](https://en.wikipedia.org/wiki/HTTPS) can help protect against MITM attacks on the communication between your app and its users.

## Secure data tier

App Service highly integrates with SQL Database, such that all the connection strings are encrypted across the board and are only decrypted on the VM that the app runs on *and* only when the app runs. 
In addition, Azure SQL Database includes many security features to help you secure your application data from cyber threats, including 
[at-rest encryption](https://msdn.microsoft.com/library/dn948096.aspx), [Always Encrypted](https://msdn.microsoft.com/library/mt163865.aspx),
[Dynamic Data Masking](../sql-database/sql-database-dynamic-data-masking-get-started.md), and [Threat Detection](../sql-database/sql-database-threat-detection-get-started.md). 
If you have sensitive data or compliance requirements, see [Securing your SQL Database](../sql-database/sql-database-security.md) for more information on how to secure 
your data.

If you use a third-party database provider, such as ClearDB, you should consult with the provider's documentation directly on security best practices.  

##<a name="develop"></a> Secure development and deployment

### Publishing profiles and publish settings

When developing applications, performing management tasks, or automating tasks using utilities such as **Visual Studio**, **Web Matrix**, **Azure PowerShell** or the **Azure Command-Line Interface (Azure CLI)**, you can use either 
a *publish settings* file or a *publishing profile*. Both file types authenticate you with Azure, and should be secured to prevent unauthorized access.

* A **publish settings** file contains

	* Your Azure subscription ID

	* A management certificate that allows you to perform management tasks for your subscription *without having to provide an account name or password*.

* A **publishing profile** file contains

	* Information for publishing to your app

If you use a utility that uses a publish settings file or publish profile file, import the file containing the publish settings or profile into the utility and then **delete** the file. If you must keep the file, to share with 
others working on the project for example, store it in a secure location such as an *encrypted* directory with restricted permissions.

Additionally, you should make sure the imported credentials are secured. For example, **Azure PowerShell** and the **Azure Command-Line Interface (Azure CLI)** both store imported information in your **home directory** 
(*~* on Linux or OS X systems and */users/yourusername* on Windows systems.) For extra security, you may wish to **encrypt** these locations using encryption tools available for your operating system.

### Configuration settings, and connection strings
It's common practice to store connection strings, authentication credentials, and other sensitive information in configuration files. Unfortunately, these files may be exposed on your website, or checked into a public repository, 
exposing this information. A simple search on [GitHub](https://github.com), for example, can uncover countless configuration files with exposed secrets in the public repositories.

The best practice is to keep this information out of your app's configuration files. App Service lets you store configuration information as part of the runtime environment as **app settings** and **connection strings**. The values 
are exposed to your application at runtime through *environment variables* for most programming languages. For .NET applications, these values are injected into your .NET configuration at runtime. Apart from these situations, these
configuration settings will remain encrypted unless you view or configure them using the [Azure Portal](https://portal.azure.com) or utilities such as PowerShell or the Azure CLI. 

Storing configuration information in App Service makes it possible for the app's administrator to lock down sensitive information for the production apps. Developers can use a separate set of configuration settings
for app development and the settings can be automatically superseded by the settings configured in App Service. Not even the developers need to know the secrets configured for the production app. For more information on 
configuring app settings and connection strings in App Service, see [Configuring web apps](web-sites-configure.md).

### FTPS

Azure App Service provides secure FTP access to the file system for your app through **FTPS**. This allows you to securely access the application code on the web app as well as diagnostics logs. It is recommended that you
always use FTPS instead of FTP. 

The FTPS link for your app can be found with the following steps:

1. Open the [Azure Portal](https://portal.azure.com).
2. Select **Browse All**.
3. From the **Browse** blade, select **App Services**.
4. From the **App Services** blade, Select the desired app.
5. From the app's blade, select **All settings**.
6. From the **Settings** blade, select **Properties**.
7. The FTP and FTPS links are provided on the **Settings** blade. 

For more information on FTPS, see [File Transfer Protocol](http://en.wikipedia.org/wiki/File_Transfer_Protocol).

## Next steps

For more information on the security of the Azure platform, information on reporting a **security incident or abuse**, or to inform Microsoft that you will be performing **penetration testing** of your site, see the security section of the [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/security/).

For more information on **web.config** or **applicationhost.config** files in App Service apps, see [Configuration options unlocked in Azure App Service web apps](https://azure.microsoft.com/blog/2014/01/28/more-to-explore-configuration-options-unlocked-in-windows-azure-web-sites/).

For information on logging information for App Service apps, which may be useful in detecting attacks, see [Enable diagnostic logging](web-sites-enable-diagnostic-log.md).

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter app in App Service. No credit cards required; no commitments.

## What's changed

* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
