---
title: Custom domains in Azure AD Application Proxy | Microsoft Docs
description: Manage custom domains in Azure AD Application Proxy so that the URL for the app is the same regardless of where your users access it. 
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 01/31/2018
ms.author: mimart
ms.reviewer: harshja
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Working with custom domains in Azure AD Application Proxy

When you publish an application through Azure Active Directory Application Proxy, you create an external URL for your users to go to when they're working remotely. This URL gets the default domain *yourtenant.msappproxy.net*. For example, if you published an app named Expenses and your tenant is named Contoso, then the external URL would be `https://expenses-contoso.msappproxy.net`. If you want to use your own domain name, configure a custom domain for your application. 

We recommend that you set up custom domains for your applications whenever possible. Some of the benefits of custom domains include:

- Your users can get to the application with the same URL, whether they are working inside or outside of your network.
- If all of your applications have the same internal and external URLs, then links in one application that point to another continue to work even outside the corporate network. 
- You control your branding, and create the URLs you want. 


## Configure a custom domain

### Prerequisites

Before you configure a custom domain, make sure that you have the following requirements prepared: 
- A [verified domain added to Azure Active Directory](../fundamentals/add-custom-domain.md).
- A custom certificate for the domain, in the form of a PFX file. 
- An on-premises app [published through Application Proxy](application-proxy-add-on-premises-application.md).

### Configure your custom domain

When you have those three requirements ready, follow these steps to set up your custom domain:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to **Azure Active Directory** > **Enterprise applications** > **All applications** and choose the app you want to manage.
3. Select **Application Proxy**. 
4. In the External URL field, use the dropdown list to select your custom domain. If you don't see your domain in the list, then it hasn't been verified yet. 
5. Select **Save**
5. The **Certificate** field that was disabled becomes enabled. Select this field. 

   ![Click to upload a certificate](./media/application-proxy-configure-custom-domain/certificate.png)

   If you already uploaded a certificate for this domain, the Certificate field displays the certificate information. 

6. Upload the PFX certificate and enter the password for the certificate. 
7. Select **Save** to save your changes. 
8. Add a [DNS record](../../dns/dns-operations-recordsets-portal.md) that redirects the new external URL to the msappproxy.net domain.
9. Check that the DNS record is configured correctly by using the [nslookup](https://social.technet.microsoft.com/wiki/contents/articles/29184.nslookup-for-beginners.aspx) command to see if your external URL is reachable and the msapproxy.net domain shows up as an alias.

>[!TIP] 
>You only need to upload one certificate per custom domain. Once you upload a certificate, you can choose the custom domain when you publish a new app and not have to do additional configuration except for the DNS record. 

## Manage certificates

### Certificate format
There is no restriction on the certificate signature methods. Elliptic Curve Cryptography (ECC), Subject Alternative Name (SAN), and other common certificate types are all supported. 

You can use a wildcard certificate as long as the wildcard matches the desired external URL.

You cannot use a certificate issued by your own public key infrastructure (PKI) due to security considerations.

### Changing the domain
All verified domains appear in the External URL dropdown list for your application. To change the domain, just update that field for the application. If the domain you want isn't in the list, [add it as a verified domain](../fundamentals/add-custom-domain.md). If you select a domain that doesn't have an associated certificate yet, follow steps 5-7 to add the certificate. Then, make sure you update the DNS record to redirect from the new external URL. 

### Certificate management
You can use the same certificate for multiple applications unless the applications share an external host. 

You get a warning when a certificate expires, telling you to upload another certificate through the portal. If the certificate is revoked, your users may see a security warning when accessing the application. We don’t perform revocation checks for certificates.  To update the certificate for a given application, navigate to the application and follow steps 5-7 for configuring custom domains on published applications to upload a new certificate. If the old certificate is not being used by other applications, it is deleted automatically. 

Currently all certificate management is through individual application pages so you need to manage certificates in the context of the relevant applications. 

## Next steps
* [Enable single sign-on](application-proxy-configure-single-sign-on-with-kcd.md) to your published apps with Azure AD authentication.
* [Enable Conditional Access](application-proxy-integrate-with-sharepoint-server.md) to your published apps.
* [Add your custom domain name to Azure AD](../fundamentals/add-custom-domain.md)


