---
title: Publish on=premises SharePoint with Application Proxy - Azure AD
description: Covers the basics about how to integrate an on-premises SharePoint server with Azure AD Application Proxy for SAML.
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 10/02/2019
ms.author: kenwith
ms.reviewer: japere
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Integrate with SharePoint (SAML)

This step-by-step guide explains how to secure the access to the [Azure Active Directory integrated on-premises Sharepoint (SAML)](https://docs.microsoft.com/en-gb/azure/active-directory/saas-apps/sharepoint-on-premises-tutorial) using Azure AD Application Proxy, where users in your organization (Azure AD, B2B) connect to Sharepoint through the Internet.

> [!NOTE] If you're new to Azure AD Application Proxy and want to learn more, see [Remote access to on-premises applications through Azure AD Application Proxy](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/application-proxy).

There are three primary advantages of this setup:

- Azure AD Application Proxy ensures that just authenticated traffic can reach your internal network and the Sharepoint server.
- Your users can access the Sharepoint sites as usual without using VPN.
- You can control the access by user assignement on Azure AD Application Proxy level and you can increase the security with Azure AD features like Conditional Access and multi-factor authorization (MFA).

This process requires two Enterprise Applications. One is a SharePoint on-premises instance that you publish from the gallery to your list of managed SaaS apps. The second is an on-premises application (non-gallery application) you'll use to publish the first Enterprise Gallery Application.

## Prerequisites

To complete this configuration, you need the following resources:
 - A SharePoint 2013 farm or newer. The Sharepoint farm must be [integrated with Azure AD](https://docs.microsoft.com/azure/active-directory/saas-apps/sharepoint-on-premises-tutorial).
 - An Azure AD tenant with a plan that includes Application Proxy. Learn more about [Azure AD plans and pricing](https://azure.microsoft.com/pricing/details/active-directory/).
 - A [custom, verified domain](https://docs.microsoft.com/azure/active-directory/fundamentals/add-custom-domain) in the Azure AD tenant. The verified domain must match the SharePoint URL suffix.
 - An SSL certificate is required. See the details in [custom domain publishing](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-custom-domain).
 - On-premises Active Directory synchronized with Azure AD Connect, through which users can [sign in to Azure](https://docs.microsoft.com/azure/active-directory/hybrid/plan-connect-user-signin). 
 - For B2B guest users, you need to [grant access to a guest account to SharePoint on-premises in the Azure portal](https://docs.microsoft.com/azure/active-directory/saas-apps/sharepoint-on-premises-tutorial#grant-access-to-a-guest-account-to-sharepoint-on-premises-in-the-azure-portal).
 - An Application Proxy connector installed and running on a machine within the corporate domain.


## Step 1: Integrate SharePoint on-premises with Azure AD 

1. Configure the SharePoint on-premises app. For more information, see [Tutorial: Azure Active Directory single sign-on integration with SharePoint on-premises](https://docs.microsoft.com/azure/active-directory/saas-apps/sharepoint-on-premises-tutorial).
2. Validate the configuration before moving to the next step. To validate, try to access the SharePoint on-premises from the internal network and confirm it's accessible internally. 


## Step 2: Publish the Sharepoint on-premises application with Application Proxy

Find the following values that you configured when you [integrated with Azure AD](https://docs.microsoft.com/azure/active-directory/saas-apps/sharepoint-on-premises-tutorial).

 - Internal URL: https://\<TheRootOfYourSharePointSiteURL>/ 
 - External URL: https://\<TheRootOfYourSharePointSiteURL>/

> [!NOTE]
> The values match the Sign on URL under the SAML Based Application configuration in Step 1.

   ![Screenshot that shows the Sign on URL value.](./media/application-proxy-integrate-with-sharepoint-server/sso-url-saml.png)

In this step, you create an application in your Azure AD tenant that uses Application Proxy. You set the external URL and specify the internal URL, both of which are used later in SharePoint.

 1. Create a new Azure AD Application Proxy application with custom domain. For step-by-step instructions, see [Custom domains in Azure AD Application Proxy](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-custom-domain).

    - Internal URL: https://portal.contoso.com/
    - External URL: https://portal.contoso.com/
    - Pre-Authentication: Azure Active Directory
    - Translate URLs in Headers: No
    - Translate URLs in Application Body: No

    ![Screenshot that shows the options you use to create the app.](./media/application-proxy-integrate-with-sharepoint-server/create-application-azure-active-dirctory.png)


2. Assign the [same groups](https://docs.microsoft.com/azure/active-directory/saas-apps/sharepoint-on-premises-tutorial#create-an-azure-ad-security-group-in-the-azure-portal) that you assigned to the on-premises SharePoint Gallery Application.

3. Optionally, you can prevent the visibility of two applications for the on-premises SharePoint instance. For **myapplications.microsoft.com**, go to the **Properties** section and set **Visible to users?** to **No** for one of your applications. 

   ![Screenshot that shows where to set the Visible to users? option.](./media/application-proxy-integrate-with-sharepoint-server/configure-properties.png)
 
## Step 3: Test your application

Using a browser from a computer on an external network, navigate to the URL (https://portal.contoso.com/) that you configured during the publish step. Make sure you can sign in with the test account that you set up.

