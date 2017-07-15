---
title: Enable Azure AD Application Proxy in the classic portal | Microsoft Docs
description:  Turn on Application Proxy in the Azure classic portal, and install the Connectors for the reverse proxy.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila
editor: harshja

ms.assetid: c7186f98-dd80-4910-92a4-a7b8ff6272b9
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/02/2017
ms.author: kgremban
ms.custom: it-pro
---

# Enable Application Proxy in the classic portal and download connectors
This article walks you through the steps to enable Microsoft Azure AD Application Proxy for your cloud directory in Azure AD.

If you're unfamiliar with what Application Proxy can help you do, learn more about [How to provide secure remote access to on-premises applications](active-directory-application-proxy-get-started.md).

## Application Proxy prerequisites
Before you can enable and use Application Proxy services, you need to have:

* A [Microsoft Azure AD basic or premium subscription](active-directory-editions.md) and an Azure AD directory for which you are a global administrator.
* A server running Windows Server 2012 R2 or 2016, on which you can install the Application Proxy Connector. The server sends requests to the Application Proxy services in the cloud, and it needs an HTTP or HTTPS connection to the applications that you are publishing.
  * For single sign-on to your published applications, this machine should be domain-joined in the same AD domain as the applications that you are publishing. For information, see [Single sign-on with Application Proxy](active-directory-application-proxy-sso-using-kcd.md)
* If your organization uses proxy servers to connect to the internet, read [Work with existing on-premises proxy servers](application-proxy-working-with-proxy-servers.md) for details on how to configure them.

## Open your ports

To prepare your environment for Azure AD Application Proxy, you first need to enable communication to Azure data centers. If there is a firewall in the path, make sure that it's open so that the Connector can make HTTPS (TCP) requests to the Application Proxy.

1. Open the following ports to **outbound** traffic:

   | Port number | How it's used |
   | --- | --- |
   | 80 | Downloading certificate revocation lists (CRLs) while validating the SSL certificate |
   | 443 | All outbound communication with the Application Proxy service |

   If your firewall enforces traffic according to originating users, open these ports for traffic coming from Windows services running as a Network Service.

   > [!IMPORTANT]
   > The table reflects the port requirements for connector versions 1.5.132.0 and newer. If you still have an older connector version, you also need to enable the following ports: 5671, 8080, 9090, 9091, 9350, 9352, and 10100–10120.
   >
   >For information about updating your connectors to the newest version, see [Understand Azure AD Application Proxy connectors](application-proxy-understand-connectors.md#automatic-updates).

2. If your firewall or proxy allows DNS whitelisting, you can whitelist connections to msappproxy.net and servicebus.windows.net. If not, you need to allow access to the [Azure DataCenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653) which are updated each week.

3. Use the [Azure AD Application Proxy Connector Ports Test Tool](https://aadap-portcheck.connectorporttest.msappproxy.net/) to verify that your connector can reach the Application Proxy service. At a minimum, make sure that the Central US region and the region closest to you have all green checkmarks. Beyond that, more green checkmarks means greater resiliency.

## Enable Application Proxy in Azure AD
1. Sign in as an administrator in the [Azure classic portal](https://manage.windowsazure.com/).
2. Go to Active Directory and select the directory in which you want to enable Application Proxy.

    ![Active Directory - icon](./media/active-directory-application-proxy-enable/ad_icon.png)
3. Select **Configure** from the directory page, and scroll down to **Application Proxy**.
4. Toggle **Enable Application Proxy Services for this Directory** to **Enabled**.

    ![Enable Application Proxy](./media/active-directory-application-proxy-enable/app_proxy_enable.png)
5. Select **Download now**. The **Azure AD Application Proxy Connector Download** opens. Read and accept the license terms and click **Download** to save the Windows Installer file (.exe) for the connector.

## Install and register the Connector
1. Run **AADApplicationProxyConnectorInstaller.exe** on the server you prepared according to the prerequisites.
2. Follow the instructions in the wizard to install.
3. During installation, you are prompted to register the connector with the Application Proxy of your Azure AD tenant.

   * Provide your Azure AD global administrator credentials. Your global administrator tenant may be different from your Microsoft Azure credentials.
   * Make sure the admin who registers the connector is in the same directory where you enabled the Application Proxy service. For example, if the tenant domain is contoso.com, the admin should be admin@contoso.com or any other alias on that domain.
   * If **IE Enhanced Security Configuration** is set to **On** on the server where you are installing the connector, the registration screen might be blocked. Follow the instructions in the error message to allow access. Make sure that Internet Explorer Enhanced Security is off.
   * If connector registration does not succeed, see [Troubleshoot Application Proxy](active-directory-application-proxy-troubleshoot.md).  
4. When the installation completes, two new services are added to your server:

   * **Microsoft AAD Application Proxy Connector** enables connectivity

     * **Microsoft AAD Application Proxy Connector Updater** is an automated update service, which periodically checks for new versions of the connector and updates the connector as needed.

     ![App Proxy Connector services - screenshot](./media/active-directory-application-proxy-enable/app_proxy_services.png)
5. Click **Finish** in the installation window.

For information about connectors, see [Understand Azure AD Application Proxy connectors](application-proxy-understand-connectors.md).

For high availability purposes, you should deploy at least two connectors. To deploy more connectors, repeat steps 2 and 3. Each connector must be registered separately.

If you want to uninstall the Connector, uninstall both the Connector service and the Updater service. Restart your computer to fully remove the service.

## Next steps
You are now ready to [Publish applications with Application Proxy](active-directory-application-proxy-publish.md).

If you have applications that are on separate networks or different locations, you can use connector groups to organize the different connectors into logical units. Learn more about [Working with Application Proxy connectors](active-directory-application-proxy-connectors.md).
