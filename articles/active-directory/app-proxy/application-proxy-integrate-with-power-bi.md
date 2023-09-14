---
title: Enable remote access to Power BI with Azure Active Directory Application Proxy
description: Covers the basics about how to integrate an on-premises Power BI with Azure Active Directory Application Proxy.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: how-to
ms.date: 11/17/2022
ms.author: kenwith
ms.reviewer: ashishj
ms.custom: has-adal-ref
---

# Enable remote access to Power BI Mobile with Azure Active Directory Application Proxy

This article discusses how to use Azure AD Application Proxy to enable the Power BI mobile app to connect to Power BI Report Server (PBIRS) and SQL Server Reporting Services (SSRS) 2016 and later. Through this integration, users who are away from the corporate network can access their Power BI reports from the Power BI mobile app and be protected by Azure AD authentication. This protection includes [security benefits](application-proxy-security.md#security-benefits) such as Conditional Access and multi-factor authentication.

## Prerequisites

This article assumes you've already deployed Report Services and [enabled Application Proxy](../app-proxy/application-proxy-add-on-premises-application.md).

- Enabling Application Proxy requires installing a connector on a Windows server and completing the [prerequisites](../app-proxy/application-proxy-add-on-premises-application.md#prepare-your-on-premises-environment) so that the connector can communicate with Azure AD services.
- When publishing Power BI, we recommended you use the same internal and external domains. To learn more about custom domains, see [Working with custom domains in Application Proxy](./application-proxy-configure-custom-domain.md).
- This integration is available for the **Power BI Mobile iOS and Android** application.

## Step 1: Configure Kerberos Constrained Delegation (KCD)

For on-premises applications that use Windows authentication, you can achieve single sign-on (SSO) with the Kerberos authentication protocol and a feature called Kerberos constrained delegation (KCD). When configured, KCD allows the Application Proxy connector to obtain a Windows token for a user, even if the user hasn’t signed into Windows directly. To learn more about KCD, see [Kerberos Constrained Delegation Overview](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/jj553400(v=ws.11)) and [Kerberos Constrained Delegation for single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md).

There isn’t much to configure on the Reporting Services side. Just be sure to have a valid Service Principal Name (SPN) to enable the proper Kerberos authentication to occur. Also make sure the Reporting Services server is enabled for Negotiate authentication.

To set up KCD for Reporting services, continue with the following steps.

### Configure the Service Principal Name (SPN)

The SPN is a unique identifier for a service that uses Kerberos authentication. You'll need to make sure you have a proper HTTP SPN present for your report server. For information on how to configure the proper Service Principal Name (SPN) for your report server, see [Register a Service Principal Name (SPN) for a Report Server](/sql/reporting-services/report-server/register-a-service-principal-name-spn-for-a-report-server).
You can verify that the SPN was added by running the Setspn command with the -L option. To learn more about this command, see [Setspn](https://social.technet.microsoft.com/wiki/contents/articles/717.service-principal-names-spn-setspn-syntax.aspx).

### Enable Negotiate authentication

To enable a report server to use Kerberos authentication, configure the Authentication Type of the report server to be RSWindowsNegotiate. Configure this setting using the rsreportserver.config file.

```xml
<AuthenticationTypes>
    <RSWindowsNegotiate />
    <RSWindowsKerberos />
    <RSWindowsNTLM />
</AuthenticationTypes>
```

For more information, see [Modify a Reporting Services Configuration File](/sql/reporting-services/report-server/modify-a-reporting-services-configuration-file-rsreportserver-config) and [Configure Windows Authentication on a Report Server](/sql/reporting-services/security/configure-windows-authentication-on-the-report-server).

### Ensure the Connector is trusted for delegation to the SPN added to the Reporting Services application pool account
Configure KCD so that the Azure AD Application Proxy service can delegate user identities to the Reporting Services application pool account. Configure KCD by enabling the Application Proxy connector to retrieve Kerberos tickets for your users who have been authenticated in Azure AD. Then that server passes the context to the target application, or Reporting Services in this case.

To configure KCD, repeat the following steps for each connector machine:

1. Sign in to a domain controller as a domain administrator, and then open **Active Directory Users and Computers**.
2. Find the computer that the connector is running on.
3. Double-click the computer, and then select the **Delegation** tab.
4. Set the delegation settings to **Trust this computer for delegation to the specified services only**. Then, select **Use any authentication protocol**.
5. Select **Add**, and then select **Users or Computers**.
6. Enter the service account that you're using for Reporting Services. This is the account you added the SPN to within the Reporting Services configuration.
7. Click **OK**. To save the changes, click **OK** again.

For more information, see [Kerberos Constrained Delegation for single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md).

## Step 2: Publish Report Services through Azure AD Application Proxy

Now you're ready to configure Azure AD Application Proxy.

1. Publish Report Services through Application Proxy with the following settings. For step-by-step instructions on how to publish an application through Application Proxy, see [Publishing applications using Azure AD Application Proxy](../app-proxy/application-proxy-add-on-premises-application.md#add-an-on-premises-app-to-azure-ad).
   - **Internal URL**: Enter the URL to the Report Server that the connector can reach in the corporate network. Make sure this URL is reachable from the server the connector is installed on. A best practice is using a top-level domain such as `https://servername/` to avoid issues with subpaths published through Application Proxy. For example, use `https://servername/` and not `https://servername/reports/` or `https://servername/reportserver/`.
     > [!NOTE]
     > We recommend using a secure HTTPS connection to the Report Server. See [Configure SSL connections on a native mode report server](/sql/reporting-services/security/configure-ssl-connections-on-a-native-mode-report-server) for information how to.
   - **External URL**: Enter the public URL the Power BI mobile app will connect to. For example, it may look like `https://reports.contoso.com` if a custom domain is used. To use a custom domain, upload a certificate for the domain, and point a DNS record to the default msappproxy.net domain for your application. For detailed steps, see [Working with custom domains in Azure AD Application Proxy](application-proxy-configure-custom-domain.md).

   - **Pre-authentication Method**: Azure Active Directory

2. Once your app is published, configure the single sign-on settings with the following steps:

   a. On the application page in the portal, select **Single sign-on**.

   b. For **Single Sign-on Mode**, select **Integrated Windows Authentication**.

   c. Set **Internal Application SPN** to the value that you set earlier.

   d. Choose the **Delegated Login Identity** for the connector to use on behalf of your users. For more information, see [Working with different on-premises and cloud identities](application-proxy-configure-single-sign-on-with-kcd.md#working-with-different-on-premises-and-cloud-identities).

   e. Click **Save** to save your changes.

To finish setting up your application, go to **the Users and groups** section and assign users to access this application.

## Step 3: Modify the Reply URI's for the application

Before the Power BI mobile app can connect and access Report Services, you must configure the Application Registration that was automatically created for you in step 2.

1. On the Azure Active Directory **Overview** page, select **App registrations**.
2. Under the **All applications** tab search for the application you created in step 2.
3. Select the application, then select **Authentication**.
4. Add the following Redirect URIs based on which platform you are using.

   When configuring the app for Power BI Mobile **iOS**, add the following Redirect URIs of type Public Client (Mobile & Desktop):
   - `msauth://code/mspbi-adal%3a%2f%2fcom.microsoft.powerbimobile`
   - `msauth://code/mspbi-adalms%3a%2f%2fcom.microsoft.powerbimobilems`
   - `mspbi-adal://com.microsoft.powerbimobile`
   - `mspbi-adalms://com.microsoft.powerbimobilems`

   When configuring the app for Power BI Mobile **Android**, add the following Redirect URIs of type Public Client (Mobile & Desktop):
   - `urn:ietf:wg:oauth:2.0:oob`
   - `mspbi-adal://com.microsoft.powerbimobile`
   - `msauth://com.microsoft.powerbim/g79ekQEgXBL5foHfTlO2TPawrbI%3D`
   - `msauth://com.microsoft.powerbim/izba1HXNWrSmQ7ZvMXgqeZPtNEU%3D`

   > [!IMPORTANT]
   > The Redirect URIs must be added for the application to work correctly. If you are configuring the app for both Power BI Mobile iOS and Android, add the following Redirect URI of type Public Client (Mobile & Desktop) to the list of Redirect URIs configured for iOS: `urn:ietf:wg:oauth:2.0:oob`.

## Step 4: Connect from the Power BI Mobile App

1. In the Power BI mobile app, connect to your Reporting Services instance. To do this, enter the **External URL** for the application you published through Application Proxy.

   ![Power BI mobile app with External URL](media/application-proxy-integrate-with-power-bi/app-proxy-power-bi-mobile-app.png)

2. Select **Connect**. You'll be directed to the Azure Active Directory sign-in page.

3. Enter valid credentials for your user and select **Sign in**. You'll see the elements from your Reporting Services server.

## Step 5: Configure Intune policy for managed devices (optional)

You can use Microsoft Intune to manage the client apps that your company's workforce uses. Intune allows you to use capabilities such as data encryption and additional access requirements. To learn more about app management through Intune, see Intune App Management. To enable the Power BI mobile application to work with the Intune policy, use the following steps.

1. Go to **Azure Active Directory** and then **App Registrations**.
2. Select the application configured in Step 3 when registering your native client application.
3. On the application’s page, select **API Permissions**.
4. Click **Add a permission**.
5. Under **APIs my organization uses**, search for “Microsoft Mobile Application Management” and select it.
6. Add the **DeviceManagementManagedApps.ReadWrite** permission to the application
7. Click **Grant admin consent** to grant the permission access to the application.
8. Configure the Intune policy you want by referring to [How to create and assign app protection policies](/intune/app-protection-policies).

## Troubleshooting

If the application returns an error page after trying to load a report for more than a few minutes, you might need to change the timeout setting. By default, Application Proxy supports applications that take up to 85 seconds to respond to a request. To lengthen this setting to 180 seconds, select the back-end timeout to **Long** in the App Proxy settings page for the application. For tips on how to create fast and reliable reports see [Power BI Reports Best Practices](/power-bi/power-bi-reports-performance).

Using Azure AD Application Proxy to enable the Power BI mobile app to connect to on premises Power BI Report Server is not supported with Conditional Access policies that require the Microsoft Power BI app as an approved client app.

## Next steps

- [Enable native client applications to interact with proxy applications](application-proxy-configure-native-client-application.md)
- [View on-premises report server reports and KPIs in the Power BI mobile apps](/power-bi/consumer/mobile/mobile-app-ssrs-kpis-mobile-on-premises-reports)
