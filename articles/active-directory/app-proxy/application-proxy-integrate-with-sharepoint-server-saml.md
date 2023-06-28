---
title: Publish an on-premises SharePoint farm with Azure Active Directory Application Proxy
description: Covers the basics about how to integrate an on-premises SharePoint farm with Azure Active Directory Application Proxy for SAML.
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

# Integrate Azure Active Directory Application Proxy with SharePoint (SAML)

This step-by-step guide explains how to secure the access to the [Azure Active Directory integrated on-premises SharePoint (SAML)](../saas-apps/sharepoint-on-premises-tutorial.md) using Azure AD Application Proxy, where users in your organization (Azure AD, B2B) connect to SharePoint through the Internet.

> [!NOTE]
> If you're new to Azure AD Application Proxy and want to learn more, see [Remote access to on-premises applications through Azure AD Application Proxy](./application-proxy.md).

There are three primary advantages of this setup:

- Azure AD Application Proxy ensures that authenticated traffic can reach your internal network and SharePoint.
- Your users can access SharePoint sites as usual without using VPN.
- You can control the access by user assignment on the Azure AD Application Proxy level and you can increase the security with Azure AD features like Conditional Access and Multi-Factor Authentication (MFA).

This process requires two Enterprise Applications. One is a SharePoint on-premises instance that you publish from the gallery to your list of managed SaaS apps. The second is an on-premises application (non-gallery application) you'll use to publish the first Enterprise Gallery Application.

## Prerequisites

To complete this configuration, you need the following resources:
 - A SharePoint 2013 farm or newer. The SharePoint farm must be [integrated with Azure AD](../saas-apps/sharepoint-on-premises-tutorial.md).
 - An Azure AD tenant with a plan that includes Application Proxy. Learn more about [Azure AD plans and pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).
 - A [custom, verified domain](../fundamentals/add-custom-domain.md) in the Azure AD tenant. The verified domain must match the SharePoint URL suffix.
 - An SSL certificate is required. See the details in [custom domain publishing](./application-proxy-configure-custom-domain.md).
 - On-premises Active Directory users must be synchronized with Azure AD Connect, and must be configure to [sign in to Azure](../hybrid/plan-connect-user-signin.md). 
 - For cloud-only and B2B guest users, you need to [grant access to a guest account to SharePoint on-premises in the Azure portal](../saas-apps/sharepoint-on-premises-tutorial.md#manage-guest-users-access).
 - An Application Proxy connector installed and running on a machine within the corporate domain.


## Step 1: Integrate SharePoint on-premises with Azure AD

1. Configure the SharePoint on-premises app. For more information, see [Tutorial: Azure Active Directory single sign-on integration with SharePoint on-premises](../saas-apps/sharepoint-on-premises-tutorial.md).
2. Validate the configuration before moving to the next step. To validate, try to access the SharePoint on-premises from the internal network and confirm it's accessible internally.


## Step 2: Publish the SharePoint on-premises application with Application Proxy

In this step, you create an application in your Azure AD tenant that uses Application Proxy. You set the external URL and specify the internal URL, both of which are used later in SharePoint.

> [!NOTE]
> The Internal and External URLs must match the **Sign on URL** in the SAML Based Application configuration in Step 1.

   ![Screenshot that shows the Sign on URL value.](./media/application-proxy-integrate-with-sharepoint-server/sso-url-saml.png)


 1. Create a new Azure AD Application Proxy application with custom domain. For step-by-step instructions, see [Custom domains in Azure AD Application Proxy](./application-proxy-configure-custom-domain.md).

    - Internal URL: 'https://portal.contoso.com/'
    - External URL: 'https://portal.contoso.com/'
    - Pre-Authentication: Azure Active Directory
    - Translate URLs in Headers: No
    - Translate URLs in Application Body: No

        ![Screenshot that shows the options you use to create the app.](./media/application-proxy-integrate-with-sharepoint-server/create-application-azure-active-directory.png)

2. Assign the [same groups](../saas-apps/sharepoint-on-premises-tutorial.md#grant-permissions-to-a-security-group) you assigned to the on-premises SharePoint Gallery Application.

3. Finally, go to the **Properties** section and set **Visible to users?** to **No**. This option ensures that only the icon of the first application appears on the My Apps Portal (https://myapplications.microsoft.com).

   ![Screenshot that shows where to set the Visible to users? option.](./media/application-proxy-integrate-with-sharepoint-server/configure-properties.png)
 
## Step 3: Test your application

Using a browser from a computer on an external network, navigate to the link that you configured during the publish step. Make sure you can sign in with the test account that you set up.
