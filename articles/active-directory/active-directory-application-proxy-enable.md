<properties
	pageTitle="Enable Azure AD Application Proxy | Microsoft Azure"
	description="Turn on Application Proxy in the Azure classic portal, and install the Connectors for the reverse proxy."
	services="active-directory"
	documentationCenter=""
	authors="kgremban"
	manager="StevenPo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="06/01/2016"
	ms.author="kgremban"/>

# Enable Application Proxy in the Azure portal

This article walks you through enabling Microsoft Azure AD Application Proxy for your cloud directory in Azure AD. This involves installing the Application Proxy Connector on your private network, which maintains the connection from your network to the proxy service. You'll also register the Connector with your Microsoft Azure AD tenant subscription. If you're unfamiliar with what Application Proxy can help you do, learn more about [How to provide secure remote access to on-premises applications](active-directory-application-proxy-get-started.md).

Once you complete this walkthrough to enable Azure AD Application Proxy, you will be ready to publish your on-premises apps for remote access.

> [AZURE.NOTE] Application Proxy is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).

## Application Proxy prerequisites
Before you can enable and use Application Proxy services, you need to have:

- A [Microsoft Azure AD basic or premium subscription](active-directory-editions.md) and an Azure AD directory for which you are a global administrator.
- A server running Windows Server 2012 R2, or Windows 8.1 or higher, on which you can install the Application Proxy Connector. The server will send HTTPS requests to the Application Proxy services in the cloud, and it needs an HTTPS connection to the applications that you intend to publish.
- If a firewall is placed in the path, make sure the firewall is open so that the Connector can make HTTPS (TCP) requests to the Application Proxy. The Connector uses these ports together with subdomains that are part of the high level domains: *msappproxy.net* and *servicebus.windows.net*. Make sure to open **all** the following ports to **outbound** traffic:

	| Port Number | Description |
	| --- | --- |
	| 80 | To enable outbound HTTP traffic for security validation. |
	| 443 | To enable user authentication against Azure AD (required only for the Connector registration process) |
	| 10100 - 10120 | To enable LOB HTTP responses sent back to the proxy |
	| 9352, 5671 | To enable communication between the Connector toward the Azure service for incoming requests. |
	| 9350 | Optional, to enable better performance for incoming requests |
	| 8080 | To enable the Connector bootstrap sequence and Connector automatic update |
	| 9090 | To enable Connector registration (required only for the Connector registration process) |
	| 9091 | To enable Connector trust certificate automatic renewal |

If your firewall enforces traffic according to originating users, open these ports for traffic coming from Windows services running as a Network Service. Also, make sure to enable port 8080 for NT Authority\System.


## Step 1: Enable Application Proxy in Azure AD
1. Sign in as an administrator in the [Azure classic portal](https://manage.windowsazure.com/).
2. Go to Active Directory and select the directory in which you want to enable Application Proxy.

	![Active Directory - icon](./media/active-directory-application-proxy-enable/ad_icon.png)

3. Select **Configure** from the directory page, and scroll down to **Application Proxy**.
4. Toggle **Enable Application Proxy Services for this Directory** to **Enabled**.

	![Enable Application Proxy](./media/active-directory-application-proxy-enable/app_proxy_enable.png)

5. Select **Download now**. This will take you to the **Azure AD Application Proxy Connector Download**. Read and accept the license terms and click **Download** to save the Windows Installer file (.exe) for the Application Proxy Connector.

## Step 2: Install and register the Connector
1. Run *AADApplicationProxyConnectorInstaller.exe* on the server you prepared according to the prerequisites above.
2. Follow the instructions in the wizard to install.
3. During installation you will be prompted to register the Connector with the Application Proxy of your Azure AD tenant.

  - Provide your Azure AD global administrator credentials. Your global administrator tenant may be different from your Microsoft Azure credentials.
  - Make sure the admin who registers the Connector is in the same directory where you enabled the Application Proxy service, for example if the tenant domain is contoso.com, the admin should be admin@contoso.com or any other alias on that domain.
  - If **IE Enhanced Security Configuration** is set to **On** on the server where you are installing the Azure AD Connector, the registration screen might be blocked. If this happens, follow the instructions in the error message to allow access. Make sure that Internet Explorer Enhanced Security is off.
  - If Connector registration does not succeed, see [Troubleshoot Application Proxy](active-directory-application-proxy-troubleshoot.md).  

4. When the installation completes, two new services are added to your server, as shown below.

 	- **Microsoft AAD Application Proxy Connector** enables connectivity
	- **Microsoft AAD Application Proxy Connector Updater** is an automated update service, which periodically checks for new versions of the Connector and updates the Connector as needed.

	![App Proxy Connector services - screenshot](./media/active-directory-application-proxy-enable/app_proxy_services.png)

5. Click **Finish** in the installation window to complete installation.

You are now ready to [Publish applications with Application Proxy](active-directory-application-proxy-publish.md).

For high availability purposes, you should deploy at least one additional Connector. To deploy more Connectors, repeat steps 2 and 3, above. Each Connector must be registered separately.

If you want to uninstall the Connector, uninstall both the Connector service and the Updater service and then make sure to restart your computer to fully remove the service.


## Next steps

- [Publish applications with Application Proxy](active-directory-application-proxy-publish.md)
- [Publish applications using your own domain name](active-directory-application-proxy-custom-domains.md)
- [Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)
- [Troubleshoot issues you're having with Application Proxy](active-directory-application-proxy-troubleshoot.md)

For the latest news and updates, check out the [Application Proxy blog](http://blogs.technet.com/b/applicationproxyblog/)
