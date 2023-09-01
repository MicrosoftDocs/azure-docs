---
title: Application Proxy cookie settings
description:  Azure Active Directory (Azure AD) has access and session cookies for accessing on-premises applications through Application Proxy. In this article, you'll find out how to use and configure the cookie settings. 
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
---

# Cookie settings for accessing on-premises applications in Azure Active Directory

Azure Active Directory (Azure AD) has access and session cookies for accessing on-premises applications through Application Proxy. Find out how to use the Application Proxy cookie settings. 

## What are the cookie settings?

[Application Proxy](application-proxy.md) uses the following access and session cookie settings.

| Cookie setting | Default | Description | Recommendations |
| -------------- | ------- | ----------- | --------------- |
| Use HTTP-Only Cookie | **No** | **Yes** allows Application Proxy to include the HTTPOnly flag in HTTP response headers. This flag provides additional security benefits, for example, it prevents client-side scripting (CSS) from copying or modifying the cookies.<br></br><br></br>Before we supported the HTTP-Only setting, Application Proxy encrypted and transmitted cookies over a secured TLS channel to protect against modification. | Use **Yes** because of the additional security benefits.<br></br><br></br>Use **No** for clients or user agents that do require access to the session cookie. For example, use **No** for an RDP or MTSC client that connects to  a Remote Desktop Gateway server through Application Proxy.|
| Use Secure Cookie | **Yes** | **Yes** allows Application Proxy to include the Secure flag in HTTP response headers. Secure Cookies enhances security by transmitting cookies over a TLS secured channel such as HTTPS. This prevents cookies from being observed by unauthorized parties due to the transmission of the cookie in clear text. | Use **Yes** because of the additional security benefits.|
| Use Persistent Cookie | **No** | **Yes** allows Application Proxy to set its access cookies to not expire when the web browser is closed. The persistence lasts until the access token expires, or until the user manually deletes the persistent cookies. | Use **No** because of the security risk associated with keeping users authenticated.<br></br><br></br>We suggest only using **Yes** for older applications that can't share cookies between processes. It's better to update your application to handle sharing cookies between processes instead of using persistent cookies. For example, you might need persistent cookies to allow a user to open Office documents in explorer view from a SharePoint site. Without persistent cookies, this operation might fail if the access cookies aren't shared between the browser, the explorer process, and the Office process. |

## SameSite Cookies
Starting in version Chrome 80 and eventually in browsers leveraging Chromium, cookies that do not specify the [SameSite](https://web.dev/samesite-cookies-explained) attribute will be treated as if they were set to **SameSite=Lax**. The SameSite attribute declares how cookies should be restricted to a same-site context. When set to Lax, the cookie is only to sent to same-site requests or top-level navigation. However, Application Proxy requires these cookies to be preserved in the third-party context in order to keep users properly signed in during their session. Due to this, we are making updates to the Application Proxy access and session cookies to avoid adverse impact from this change. The updates include:

* Setting the **SameSite** attribute to **None**. This allows Application Proxy access and sessions cookies to be properly sent in the third-party context.
* Setting the **Use Secure Cookie** setting to use **Yes** as the default. Chrome also requires the cookies to specify the Secure flag or it will be rejected. This change will apply to all existing applications published through Application Proxy. Note that Application Proxy access cookies have always been set to Secure and only transmitted over HTTPS. This change will only apply to the session cookies.

These changes to Application Proxy cookies will roll out over the course of the next several weeks before the Chrome 80 release date.

Additionally, if your back-end application has cookies that need to be available in a third-party context, you must explicitly opt in by changing your application to use SameSite=None for these cookies. Application Proxy translates the Set-Cookie header to its URLs and will respect the settings for these cookies set by the back-end application.



## Set the cookie settings - Azure portal

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To set the cookie settings using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to **Azure Active Directory** > **Enterprise applications** > **All applications**.
3. Select the application for which you want to enable a cookie setting.
4. Click **Application Proxy**.
5. Under **Additional Settings**, set the cookie setting to **Yes** or **No**.
6. Click **Save** to apply your changes. 

## View current cookie settings - PowerShell

To see the current cookie settings for the application, use this PowerShell command:  

```powershell
Get-AzureADApplicationProxyApplication -ObjectId <ObjectId> | fl * 
```

## Set cookie settings - PowerShell

In the following PowerShell commands, ```<ObjectId>``` is the ObjectId of the application. 

**Http-Only Cookie** 

```powershell
Set-AzureADApplicationProxyApplication -ObjectId <ObjectId> -IsHttpOnlyCookieEnabled $true 
Set-AzureADApplicationProxyApplication -ObjectId <ObjectId> -IsHttpOnlyCookieEnabled $false 
```

**Secure Cookie**

```powershell
Set-AzureADApplicationProxyApplication -ObjectId <ObjectId> -IsSecureCookieEnabled $true 
Set-AzureADApplicationProxyApplication -ObjectId <ObjectId> -IsSecureCookieEnabled $false 
```

**Persistent Cookies**

```powershell
Set-AzureADApplicationProxyApplication -ObjectId <ObjectId> -IsPersistentCookieEnabled $true 
Set-AzureADApplicationProxyApplication -ObjectId <ObjectId> -IsPersistentCookieEnabled $false 
```
