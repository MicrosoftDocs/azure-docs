---
title: Troubleshoot Application Proxy | Microsoft Docs
description: Covers how to troubleshoot errors in Azure AD Application Proxy.
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 06/24/2019
ms.author: kenwith
ms.reviewer: japere
ms.custom: it-pro
ms.collection: M365-identity-device-management
---


# Troubleshoot Application Proxy problems and error messages

When troubleshooting Application Proxy issues, we recommend you start with reviewing the troubleshooting flow, [Debug Application Proxy Connector issues](application-proxy-debug-connectors.md), to determine if Application Proxy connectors are configured correctly. If you're still having trouble connecting to the application, follow the troubleshooting flow in [Debug Application Proxy application issues](application-proxy-debug-apps.md).

If errors occur in accessing a published application or in publishing applications, check the following options to see if Microsoft Azure AD Application Proxy is working correctly:

* Open the Windows Services console. Verify that the **Microsoft AAD Application Proxy Connector** service is enabled and running. You may also want to look at the Application Proxy service properties page, as shown in the following image:  
  ![Microsoft AAD Application Proxy Connector Properties window screenshot](./media/application-proxy-troubleshoot/connectorproperties.png)
* Open Event Viewer and look for Application Proxy connector events in **Applications and Services Logs** > **Microsoft** > **AadApplicationProxy** > **Connector** > **Admin**.
* If needed, more detailed logs are available by [turning on the Application Proxy connector session logs](application-proxy-connectors.md#under-the-hood).

## The page is not rendered correctly
You may have problems with your application rendering or functioning incorrectly without receiving specific error messages. This can occur if you published the article path, but the application requires content that exists outside that path.

For example, if you publish the path `https://yourapp/app` but the application calls images in `https://yourapp/media`, they won't be rendered. Make sure that you publish the application using the highest level path you need to include all relevant content. In this example, it would be `http://yourapp/`.

If you change your path to include referenced content, but still need users to land on a deeper link in the path, see the blog post [Setting the right link for Application Proxy applications in the Azure AD access panel and Office 365 app launcher](https://blogs.technet.microsoft.com/applicationproxyblog/2016/04/06/setting-the-right-link-for-application-proxy-applications-in-the-azure-ad-access-panel-and-office-365-app-launcher/).

## Connector errors

If registration fails during the Connector wizard installation, there are two ways to view the reason for the failure. Either look in the event log under **Applications and Services Logs\Microsoft\AadApplicationProxy\Connector\Admin**, or run the following Windows PowerShell command:

    Get-EventLog application –source "Microsoft AAD Application Proxy Connector" –EntryType "Error" –Newest 1

Once you find the Connector error from the event log, use this table of common errors to resolve the problem:

| Error | Recommended steps |
| ----- | ----------------- |
| Connector registration failed: Make sure you enabled Application Proxy in the Azure Management Portal and that you entered your Active Directory user name and password correctly. Error: 'One or more errors occurred.' | If you closed the registration window without signing in to Azure AD, run the Connector wizard again and register the Connector. <br><br> If the registration window opens and then immediately closes without allowing you to log in, you'll probably get this error. This error occurs when there is a networking error on your system. Make sure that it's possible to connect from a browser to a public website and that the ports are open as specified in [Application Proxy prerequisites](application-proxy-add-on-premises-application.md#prepare-your-on-premises-environment). |
| Clear error is presented in the registration window. Cannot proceed | If you see this error and then the window closes, you entered the wrong username or password. Try again. |
| Connector registration failed: Make sure you enabled Application Proxy in the Azure Management Portal and that you entered your Active Directory user name and password correctly. Error: 'AADSTS50059: No tenant-identifying information found in either the request or implied by any provided credentials and search by service principal URI has failed. | You're trying to sign in using a Microsoft Account and not a domain that is part of the organization ID of the directory you're trying to access. Make sure that the admin is part of the same domain name as the tenant domain, for example, if the Azure AD domain is contoso.com, the admin should be admin@contoso.com. |
| Failed to retrieve the current execution policy for running PowerShell scripts. | If the Connector installation fails, check to make sure that PowerShell execution policy isn't disabled. <br><br>1. Open the Group Policy Editor.<br>2. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Windows PowerShell** and double-click **Turn on Script Execution**.<br>3. The execution policy can be set to either **Not Configured** or **Enabled**. If set to **Enabled**, make sure that under Options, the Execution Policy is set to either **Allow local scripts and remote signed scripts** or to **Allow all scripts**. |
| Connector failed to download the configuration. | The Connector’s client certificate, which is used for authentication, expired. This may also occur if you have the Connector installed behind a proxy. In this case, the Connector cannot access the Internet and will not be able to provide applications to remote users. Renew trust manually using the `Register-AppProxyConnector` cmdlet in Windows PowerShell. If your Connector is behind a proxy, it is necessary to grant Internet access to the Connector accounts “network services” and “local system.” This can be accomplished either by granting them access to the Proxy or by setting them to bypass the proxy. |
| Connector registration failed: Make sure you are an Application Administrator of your Active Directory to register the Connector. Error: 'The registration request was denied.' | The alias you're trying to log in with isn't an admin on this domain. Your Connector is always installed for the directory that owns the user’s domain. Make sure that the admin account you're trying to sign in with has atleast application administrator permissions to the Azure AD tenant. |
| The Connector was unable to connect to the service due to networking issues. The Connector tried to access the following URL. | The connector is unable to connect to the Application Proxy cloud service. This may happen if you have a firewall rule blocking the connection. Make sure that you have allowed access to the correct ports and URLS listed in [Application Proxy prerequisites](application-proxy-add-on-premises-application.md#prepare-your-on-premises-environment). |

## Kerberos errors

This table covers the more common errors that come from Kerberos setup and configuration, and includes suggestions for resolution.

| Error | Recommended steps |
| ----- | ----------------- |
| Failed to retrieve the current execution policy for running PowerShell scripts. | If the Connector installation fails, check to make sure that PowerShell execution policy is not disabled.<br><br>1. Open the Group Policy Editor.<br>2. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Windows PowerShell** and double-click **Turn on Script Execution**.<br>3. The execution policy can be set to either **Not Configured** or **Enabled**. If set to **Enabled**, make sure that under Options, the Execution Policy is set to either **Allow local scripts and remote signed scripts** or to **Allow all scripts**. |
| 12008 - Azure AD exceeded the maximum number of permitted Kerberos authentication attempts to the backend server. | This error may indicate incorrect configuration between Azure AD and the backend application server, or a problem in time and date configuration on both machines. The backend server declined the Kerberos ticket created by Azure AD. Verify that Azure AD and the backend application server are configured correctly. Make sure that the time and date configuration on the Azure AD and the backend application server are synchronized. |
| 13016 - Azure AD cannot retrieve a Kerberos ticket on behalf of the user because there is no UPN in the edge token or in the access cookie. | There is a problem with the STS configuration. Fix the UPN claim configuration in the STS. |
| 13019 - Azure AD cannot retrieve a Kerberos ticket on behalf of the user because of the following general API error. | This event may indicate incorrect configuration between Azure AD and the domain controller server, or a problem in time and date configuration on both machines. The domain controller declined the Kerberos ticket created by Azure AD. Verify that Azure AD and the backend application server are configured correctly, especially the SPN configuration. Make sure the Azure AD is domain joined to the same domain as the domain controller to ensure that the domain controller establishes trust with Azure AD. Make sure that the time and date configuration on the Azure AD and the domain controller are synchronized. |
| 13020 - Azure AD cannot retrieve a Kerberos ticket on behalf of the user because the backend server SPN is not defined. | This event may indicate incorrect configuration between Azure AD and the domain controller server, or a problem in time and date configuration on both machines. The domain controller declined the Kerberos ticket created by Azure AD. Verify that Azure AD and the backend application server are configured correctly, especially the SPN configuration. Make sure the Azure AD is domain joined to the same domain as the domain controller to ensure that the domain controller establishes trust with Azure AD. Make sure that the time and date configuration on the Azure AD and the domain controller are synchronized. |
| 13022 - Azure AD cannot authenticate the user because the backend server responds to Kerberos authentication attempts with an HTTP 401 error. | This event may indicate incorrect configuration between Azure AD and the backend application server, or a problem in time and date configuration on both machines. The backend server declined the Kerberos ticket created by Azure AD. Verify that Azure AD and the backend application server are configured correctly. Make sure that the time and date configuration on the Azure AD and the backend application server are synchronized. For more information, see [Troubleshoot Kerberos Constrained Delegation Configurations for Application Proxy](application-proxy-back-end-kerberos-constrained-delegation-how-to.md).  |

## End-user errors

This list covers errors that your end users might encounter when they try to access the app and fail. 

| Error | Recommended steps |
| ----- | ----------------- |
| The website cannot display the page. | Your user may get this error when trying to access the app you published if the application is an IWA application. The defined SPN for this application may be incorrect. For IWA apps, make sure that the SPN configured for this application is correct. |
| The website cannot display the page. | Your user may get this error when trying to access the app you published if the application is an OWA application. This could be caused by one of the following:<br><li>The defined SPN for this application is incorrect. Make sure that the SPN configured for this application is correct.</li><li>The user who tried to access the application is using a Microsoft account rather than the proper corporate account to sign in, or the user is a guest user. Make sure the user signs in using their corporate account that matches the domain of the published application. Microsoft Account users and guest cannot access IWA applications.</li><li>The user who tried to access the application is not properly defined for this application on the on premises side. Make sure that this user has the proper permissions as defined for this backend application on the on premises machine. |
| This corporate app can’t be accessed. You are not authorized to access this application. Authorization failed. Make sure to assign the user with access to this application. | Your user may get this error when trying to access the app you published if they use Microsoft accounts instead of their corporate account to sign in. Guest users may also get this error. Microsoft Account users and guests cannot access IWA applications. Make sure the user signs in using their corporate account that matches the domain of the published application.<br><br>You may not have assigned the user for this application. Go to the **Application** tab, and under **Users and Groups**, assign this user or user group to this application. |
| This corporate app can’t be accessed right now. Please try again later…The connector timed out. | Your user may get this error when trying to access the app you published if they are not properly defined for this application on the on-premises side. Make sure that your users have the proper permissions as defined for this backend application on the on premises machine. |
| This corporate app can’t be accessed. You are not authorized to access this application. Authorization failed. Make sure that the user has a license for Azure Active Directory Premium. | Your user may get this error when trying to access the app you published if they weren't explicitly assigned with a Premium license by the subscriber’s administrator. Go to the subscriber’s Active Directory **Licenses** tab and make sure that this user or user group is assigned a Premium license. |
| A server with the specified host name could not be found. | Your user may get this error when trying to access the app you published if the application's custom domain is not configured correctly. Make sure you've uploaded a certificate for the domain and configured the DNS record correctly by following the steps in [Working with custom domains in Azure AD Application Proxy](application-proxy-configure-custom-domain.md) |

## My error wasn't listed here

If you encounter an error or problem with Azure AD Application Proxy that isn't listed in this troubleshooting guide, we'd like to hear about it. Send an email to our [feedback team](mailto:aadapfeedback@microsoft.com) with the details of the error you encountered.

## See also
* [Enable Application Proxy for Azure Active Directory](application-proxy-add-on-premises-application.md)
* [Publish applications with Application Proxy](application-proxy-add-on-premises-application.md)
* [Enable single sign-on](application-proxy-configure-single-sign-on-with-kcd.md)
* [Enable Conditional Access](application-proxy-integrate-with-sharepoint-server.md)


<!--Image references-->
[1]: ./media/application-proxy-troubleshoot/connectorproperties.png
[2]: ./media/active-directory-application-proxy-troubleshoot/sessionlog.png
