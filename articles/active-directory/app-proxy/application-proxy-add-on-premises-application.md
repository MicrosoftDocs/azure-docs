---
title: Tutorial - Add an on-premises app - Application Proxy in Microsoft Entra ID
description:  Microsoft Entra ID has an Application Proxy service that enables users to access on-premises applications by signing in with their Microsoft Entra account. This tutorial shows you how to prepare your environment for use with Application Proxy. Then, it uses the Microsoft Entra admin center to add an on-premises application to your Microsoft Entra tenant.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: tutorial
ms.date: 09/13/2023
ms.author: kenwith
ms.reviewer: ashishj
---

# Tutorial: Add an on-premises application for remote access through Application Proxy in Microsoft Entra ID

Microsoft Entra ID has an Application Proxy service that enables users to access on-premises applications by signing in with their Microsoft Entra account. To learn more about Application Proxy, see [What is App Proxy?](what-is-application-proxy.md). This tutorial prepares your environment for use with Application Proxy. Once your environment is ready, use the Microsoft Entra admin center to add an on-premises application to your tenant.

:::image type="content" source="./media/application-proxy-add-on-premises-application/app-proxy-diagram.png" alt-text="Application Proxy Overview Diagram" lightbox="./media/application-proxy-add-on-premises-application/app-proxy-diagram.png":::

Before you get started, make sure you're familiar with app management and **single sign-on (SSO)** concepts. Check out the following links:
- [Quickstart Series on App Management in Microsoft Entra ID](../manage-apps/view-applications-portal.md)
- [What is single sign-on (SSO)?](../manage-apps/what-is-single-sign-on.md)

Connectors are a key part of Application Proxy. To learn more about connectors, see [Understand Microsoft Entra application proxy connectors](application-proxy-connectors.md).

This tutorial:

> [!div class="checklist"]
> * Opens ports for outbound traffic and allows access to specific URLs
> * Installs the connector on your Windows server, and registers it with Application Proxy
> * Verifies the connector installed and registered correctly
> * Adds an on-premises application to your Microsoft Entra tenant
> * Verifies a test user can sign on to the application by using a Microsoft Entra account

## Prerequisites

To add an on-premises application to Microsoft Entra ID, you need:

* A [Microsoft Entra ID P1 or P2 subscription](https://azure.microsoft.com/pricing/details/active-directory)
* An application administrator account
* User identities must be synchronized from an on-premises directory or created directly within your Microsoft Entra tenants. Identity synchronization allows Microsoft Entra ID to preauthenticate users before granting them access to App Proxy published applications and to have the necessary user identifier information to perform single sign-on (SSO).

### Windows server

To use Application Proxy, you need a Windows server running Windows Server 2012 R2 or later. You install the Application Proxy connector on the server. This connector server needs to connect to the Application Proxy services in Azure, and the on-premises applications that you plan to publish.

For high availability in your production environment, we recommend having more than one Windows server. For this tutorial, one Windows server is sufficient.

> [!IMPORTANT]
> **.NET Framework**
>
> You must have .NET version 4.7.1 or higher to install, or upgrade, Application Proxy version 1.5.3437.0 or later. Windows Server 2012 R2 and Windows Server 2016 may not have this by default.
>
> See [How to: Determine which .NET Framework versions are installed](/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) for more information.
> 
> **HTTP 2.0**
>
>  If you're installing the connector on Windows Server 2019, you must disable HTTP2 protocol support in the WinHttp component for Kerberos Constrained Delegation to properly work. This is disabled by default in earlier versions of supported operating systems. Adding the following registry key and restarting the server disables it on Windows Server 2019. Note that this is a machine-wide registry key.
>
> ```
> Windows Registry Editor Version 5.00
>
> [HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings\WinHttp]
> "EnableDefaultHTTP2"=dword:00000000
> ```
>
> The key can be set via PowerShell with the following command:
>
> ```
> Set-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings\WinHttp\' -Name EnableDefaultHTTP2 -Value 0
> ```

#### Recommendations for the connector server

1. Physically locate the connector server close to the application servers to optimize performance between the connector and the application. For more information, see [Optimize traffic flow with Microsoft Entra application proxy](application-proxy-network-topology.md).
1. The connector server and the web applications servers should belong to the same Active Directory domain or span trusting domains. Having the servers in the same domain or trusting domains is a requirement for using single sign-on (SSO) with integrated Windows authentication (IWA) and Kerberos Constrained Delegation (KCD). If the connector server and web application servers are in different Active Directory domains, you need to use resource-based delegation for single sign-on. For more information, see [KCD for single sign-on with Application Proxy](./application-proxy-configure-single-sign-on-with-kcd.md).

> [!WARNING]
> If you've deployed Microsoft Entra Password Protection Proxy, do not install Microsoft Entra application proxy and Microsoft Entra Password Protection Proxy together on the same machine. Microsoft Entra application proxy and Microsoft Entra Password Protection Proxy install different versions of the Microsoft Entra Connect Agent Updater service. These different versions are incompatible when installed together on the same machine.

#### TLS requirements

The Windows connector server needs to have TLS 1.2 enabled before you install the Application Proxy connector.

To enable TLS 1.2:

1. Set the following registry keys:

   ```
   Windows Registry Editor Version 5.00

   [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2]
   [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client]
   "DisabledByDefault"=dword:00000000
   "Enabled"=dword:00000001
   [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server]
   "DisabledByDefault"=dword:00000000
   "Enabled"=dword:00000001
   [HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319]
   "SchUseStrongCrypto"=dword:00000001
   ```

1. Restart the server.

> [!NOTE]
> Microsoft is updating Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs). This change is being made because the current CA certificates do not comply with one of the CA/Browser Forum Baseline requirements. For more information, see [Azure TLS certificate changes](../../security/fundamentals/tls-certificate-changes.md).

## Prepare your on-premises environment

Start by enabling communication to Azure data centers to prepare your environment for Microsoft Entra application proxy. If there's a firewall in the path, make sure it's open. An open firewall allows the connector to make HTTPS (TCP) requests to the Application Proxy.

> [!IMPORTANT]
> If you are installing the connector for Azure Government cloud follow the [prerequisites](../hybrid/connect/reference-connect-government-cloud.md#allow-access-to-urls) and [installation steps](../hybrid/connect/reference-connect-government-cloud.md#install-the-agent-for-the-azure-government-cloud). This requires enabling access to a different set of URLs and an additional parameter to run the installation.

### Open ports

Open the following ports to **outbound** traffic.

| Port number | How it's used |
| ----------- | ------------------------------------------------------------ |
| 80          | Downloading certificate revocation lists (CRLs) while validating the TLS/SSL certificate |
| 443         | All outbound communication with the Application Proxy service |

If your firewall enforces traffic according to originating users, also open ports 80 and 443 for traffic from Windows services that run as a Network Service.

### Allow access to URLs

Allow access to the following URLs:

| URL | Port | How it's used |
| --- | --- | --- |
| `*.msappproxy.net` <br> `*.servicebus.windows.net` | 443/HTTPS | Communication between the connector and the Application Proxy cloud service |
| `crl3.digicert.com` <br> `crl4.digicert.com` <br> `ocsp.digicert.com` <br> `crl.microsoft.com` <br> `oneocsp.microsoft.com` <br> `ocsp.msocsp.com`<br> | 80/HTTP   | The connector uses these URLs to verify certificates.        |
| `login.windows.net` <br> `secure.aadcdn.microsoftonline-p.com` <br> `*.microsoftonline.com` <br> `*.microsoftonline-p.com` <br> `*.msauth.net` <br> `*.msauthimages.net` <br> `*.msecnd.net` <br> `*.msftauth.net` <br> `*.msftauthimages.net` <br> `*.phonefactor.net` <br> `enterpriseregistration.windows.net` <br> `management.azure.com` <br> `policykeyservice.dc.ad.msft.net` <br> `ctldl.windowsupdate.com` <br> `www.microsoft.com/pkiops` | 443/HTTPS | The connector uses these URLs during the registration process. |
| `ctldl.windowsupdate.com` <br> `www.microsoft.com/pkiops` | 80/HTTP | The connector uses these URLs during the registration process. |

You can allow connections to `*.msappproxy.net`, `*.servicebus.windows.net`, and other URLs if your firewall or proxy lets you configure access rules based on domain suffixes. If not, you need to allow access to the [Azure IP ranges and Service Tags - Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519). The IP ranges are updated each week.

> [!IMPORTANT]
> Avoid all forms of inline inspection and termination on outbound TLS communications between Microsoft Entra application proxy connectors and Microsoft Entra application proxy Cloud services.

<a name='dns-name-resolution-for-azure-ad-application-proxy-endpoints'></a>

### DNS name resolution for Microsoft Entra application proxy endpoints

Public DNS records for Microsoft Entra application proxy endpoints are chained CNAME records pointing to an A record. Setting up the records this way ensures fault tolerance and flexibility. It’s guaranteed that the Microsoft Entra application proxy Connector always accesses host names with the domain suffixes `*.msappproxy.net` or `*.servicebus.windows.net`. However, during the name resolution the CNAME records might contain DNS records with different host names and suffixes. Due to the difference, you must ensure that the device (depending on your setup - connector server, firewall, outbound proxy) can resolve all the records in the chain and allows connection to the resolved IP addresses. Since the DNS records in the chain might be changed from time to time, we can't provide you with any list DNS records.

## Install and register a connector

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To use Application Proxy, install a connector on each Windows server you're using with the Application Proxy service. The connector is an agent that manages the outbound connection from the on-premises application servers to Application Proxy in Microsoft Entra ID. You can install a connector on servers that also have other authentication agents installed such as Microsoft Entra Connect.

To install the connector:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Application Administrator](../roles/permissions-reference.md#application-administrator).
1. Select your username in the upper-right corner. Verify you're signed in to a directory that uses Application Proxy. If you need to change directories, select **Switch directory** and choose a directory that uses Application Proxy.
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Application proxy**.
1. Select **Download connector service**.

    ![Download connector service to see the Terms of Service](./media/application-proxy-add-on-premises-application/application-proxy-download-connector-service.png)

1. Read the Terms of Service. When you're ready, select **Accept terms & Download**.
1. At the bottom of the window, select **Run** to install the connector. An install wizard opens.
1. Follow the instructions in the wizard to install the service. When you're prompted to register the connector with the Application Proxy for your Microsoft Entra tenant, provide your application administrator credentials.

    - For Internet Explorer (IE), if **IE Enhanced Security Configuration** is set to **On**, you may not see the registration screen. To get access, follow the instructions in the error message. Make sure that **Internet Explorer Enhanced Security Configuration** is set to **Off**.

### General remarks

If you've previously installed a connector, reinstall to get the latest version. To see information about previously released versions and what changes they include, see [Application Proxy: Version Release History](./application-proxy-release-version-history.md).

If you choose to have more than one Windows server for your on-premises applications, you need to install and register the connector on each server. You can organize the connectors into connector groups. For more information, see [Connector groups](./application-proxy-connector-groups.md).

If you have installed connectors in different regions, you can optimize traffic by selecting the closest Application Proxy cloud service region to use with each connector group, see [Optimize traffic flow with Microsoft Entra application proxy](application-proxy-network-topology.md)

If your organization uses proxy servers to connect to the internet, you need to configure them for Application Proxy.  For more information, see [Work with existing on-premises proxy servers](./application-proxy-configure-connectors-with-proxy-servers.md).

For information about connectors, capacity planning, and how they stay up-to-date, see [Understand Microsoft Entra application proxy connectors](application-proxy-connectors.md).

## Verify the connector installed and registered correctly

You can use the Microsoft Entra admin center or your Windows server to confirm that a new connector installed correctly.

### Verify the installation through Microsoft Entra admin center

To confirm the connector installed and registered correctly:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Application Administrator](../roles/permissions-reference.md#application-administrator).
1. Select your username in the upper-right corner. Verify you're signed in to a directory that uses Application Proxy. If you need to change directories, select **Switch directory** and choose a directory that uses Application Proxy.
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Application proxy**.
1. View a connector to verify its details. The connectors should be expanded by default. If the connector you want to view isn't expanded, expand the connector to view the details. An active green label indicates that your connector can connect to the service. However, even though the label is green, a network issue could still block the connector from receiving messages.

    ![Microsoft Entra application proxy Connectors](./media/application-proxy-add-on-premises-application/app-proxy-connectors.png)

For more help with installing a connector, see [Problem installing the Application Proxy Connector](./application-proxy-connector-installation-problem.md).

### Verify the installation through your Windows server

To confirm the connector installed and registered correctly:

1. Open the Windows Services Manager by clicking the **Windows** key and entering *services.msc*.
1. Check to see if the status for the following two services is **Running**.
   - **Microsoft Entra application proxy Connector** enables connectivity.
   - **Microsoft Entra application proxy Connector Updater** is an automated update service. The updater checks for new versions of the connector and updates the connector as needed.

     ![App Proxy Connector services - screenshot](./media/application-proxy-add-on-premises-application/app_proxy_services.png)

1. If the status for the services isn't **Running**, right-click to select each service and choose **Start**.

<a name='add-an-on-premises-app-to-azure-ad'></a>

## Add an on-premises app to Microsoft Entra ID

Now that you've prepared your environment and installed a connector, you're ready to add on-premises applications to Microsoft Entra ID.
1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Application Administrator](../roles/permissions-reference.md#application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Select **New application**.
1. Select **Add an on-premises application** button, which appears about halfway down the page in the **On-premises applications** section. Alternatively, you can select **Create your own application** at the top of the page and then select **Configure Application Proxy for secure remote access to an on-premises application**.
1. In the **Add your own on-premises application** section, provide the following information about your application:

    | Field  | Description |
    | :--------------------- | :----------------------------------------------------------- |
    | **Name** | The name of the application that appears on My Apps and in the Microsoft Entra admin center. |
    | **Maintenance Mode** | Select if you would like to enable maintenance mode and temporarily disable access for all users to the application. |
    | **Internal URL** | The URL for accessing the application from inside your private network. You can provide a specific path on the backend server to publish, while the rest of the server is unpublished. In this way, you can publish different sites on the same server as different apps, and give each one its own name and access rules.<br><br>If you publish a path, make sure that it includes all the necessary images, scripts, and style sheets for your application. For example, if your app is at `https://yourapp/app` and uses images located at `https://yourapp/media`, then you should publish `https://yourapp/` as the path. This internal URL doesn't have to be the landing page your users see. For more information, see [Set a custom home page for published apps](application-proxy-configure-custom-home-page.md). |
    | **External URL** | The address for users to access the app from outside your network. If you don't want to use the default Application Proxy domain, read about [custom domains in Microsoft Entra application proxy](./application-proxy-configure-custom-domain.md). |
    | **Pre Authentication** | How Application Proxy verifies users before giving them access to your application.<br><br>**Microsoft Entra ID** - Application Proxy redirects users to sign in with Microsoft Entra ID, which authenticates their permissions for the directory and application. We recommend keeping this option as the default so that you can take advantage of Microsoft Entra security features like Conditional Access and Multi-Factor Authentication. **Microsoft Entra ID** is required for monitoring the application with Microsoft Defender for Cloud Apps.<br><br>**Passthrough** - Users don't have to authenticate against Microsoft Entra ID to access the application. You can still set up authentication requirements on the backend. |
    | **Connector Group** | Connectors process the remote access to your application, and connector groups help you organize connectors and apps by region, network, or purpose. If you don't have any connector groups created yet, your app is assigned to **Default**.<br><br>If your application uses WebSockets to connect, all connectors in the group must be version 1.5.612.0 or later. |

1. If necessary, configure **Additional settings**. For most applications, you should keep these settings in their default states.

    | Field | Description |
    | :------------------------------ | :----------------------------------------------------------- |
    | **Backend Application Timeout** | Set this value to **Long** only if your application is slow to authenticate and connect. At default, the backend application timeout has a length of 85 seconds. When set too long, the backend timeout is increased to 180 seconds. |
    | **Use HTTP-Only Cookie** | Select to have Application Proxy cookies include the HTTPOnly flag in the HTTP response header. If using Remote Desktop Services, keep the option unselected. |
    | **Use Persistent Cookie**| Keep the option unselected. Only use this setting for applications that can't share cookies between processes. For more information about cookie settings, see [Cookie settings for accessing on-premises applications in Microsoft Entra ID](./application-proxy-configure-cookie-settings.md).
    | **Translate URLs in Headers** | Keep the option selected unless your application required the original host header in the authentication request. |
    | **Translate URLs in Application Body** | Keep the option unselected unless you have hardcoded HTML links to other on-premises applications and don't use custom domains. For more information, see [Link translation with Application Proxy](./application-proxy-configure-hard-coded-link-translation.md).<br><br>Select if you plan to monitor this application with Microsoft Defender for Cloud Apps. For more information, see [Configure real-time application access monitoring with Microsoft Defender for Cloud Apps and Microsoft Entra ID](./application-proxy-integrate-with-microsoft-cloud-application-security.md). |
    | **Validate Backend SSL Certificate** | Select to enable backend SSL certificate validation for the application. |

1. Select **Add**.

## Test the application

You're ready to test the application is added correctly. In the following steps, you add a user account to the application, and try signing in.

### Add a user for testing

Before adding a user to the application, verify the user account already has permissions to access the application from inside the corporate network.

To add a test user:

1. Select **Enterprise applications**, and then select the application you want to test.
2. Select **Getting started**, and then select **Assign a user for testing**.
3. Under **Users and groups**, select **Add user**.
4. Under **Add assignment**, select **Users and groups**. The **User and groups** section appears.
5. Choose the account you want to add.
6. Choose **Select**, and then select **Assign**.

### Test the sign-on

To test the sign-on to the application:

1. From the application you want to test, select **Application Proxy**.
2. At the top of the page, select **Test Application** to run a test on the application and check for any configuration issues.
3. Make sure to first launch the application to test signing into the application, then download the diagnostic report to review the resolution guidance for any detected issues.

For troubleshooting, see [Troubleshoot Application Proxy problems and error messages](./application-proxy-troubleshoot.md).

## Clean up resources

Don't forget to delete any of the resources you created in this tutorial when you're done.

## Next steps

In this tutorial, you prepared your on-premises environment to work with Application Proxy, and then installed and registered the Application Proxy connector. Next, you added an application to your Microsoft Entra tenant. You verified that a user can sign on to the application by using a Microsoft Entra account.

You did these things:
> [!div class="checklist"]
> * Opened ports for outbound traffic and allowed access to specific URLs
> * Installed the connector on your Windows server, and registered it with Application Proxy
> * Verified the connector installed and registered correctly
> * Added an on-premises application to your Microsoft Entra tenant
> * Verified a test user can sign on to the application by using a Microsoft Entra account

You're ready to configure the application for single sign-on. Use the following link to choose a single sign-on method and to find single sign-on tutorials.

> [!div class="nextstepaction"]
> [Configure single sign-on](../manage-apps/plan-sso-deployment.md#choosing-a-single-sign-on-method)
