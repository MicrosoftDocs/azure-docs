---
title: Five steps for integrating all your apps with Azure AD
description: This guide explains how to integrate all your applications with Azure AD. In each step, we explain the value and provide links to resources that will explain the technical details. 
services: active-directory
author: knicholasa

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 08/05/2020
ms.author: nichola
---

# Five steps for integrating all your apps with Azure AD

Azure Active Directory (Azure AD) is the Microsoft cloud-based identity and access management service. Azure AD provides secure authentication and authorization solutions so that customers, partners, and employees can access the applications they need. With Azure AD, [conditional access](https://docs.microsoft.com/azure/active-directory/conditional-access/overview), [multi-factor authentication](https://docs.microsoft.com/azure/active-directory/authentication/concept-mfa-howitworks), [single-sign on](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-sso), and [automatic user provisioning](https://docs.microsoft.com/azure/active-directory/app-provisioning/user-provisioning) make identity and access management easy and secure.

If your company has a Microsoft 365 subscription, you likely [already use](https://docs.microsoft.com/office365/enterprise/about-office-365-identity) Azure AD. However, Azure AD can be used for all your applications, and by [centralizing your application management](https://docs.microsoft.com/azure/active-directory/manage-apps/common-scenarios) you can use the same identity management features, tools, and policies across your entire app portfolio. Doing so will provide a unified solution that improves security, reduces costs, increases productivity, and enables you to ensure compliance. And you will get remote access to on-premises apps.

This guide explains how to integrate all your applications with Azure AD. In each step, we explain the value and provide links to resources that will explain the technical details. We present these steps in an order we recommend. However, you can jump to any part of the process to get started with whatever adds the most value for you.

Other resources on this topic, including in-depth business process whitepapers, that can be found on our [Resources for migrating applications to Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/migration-resources) page.

## 1. Use Azure AD for new applications

First, focus on newly acquired applications. When your business starts using a new application, [add it to your Azure AD tenant](https://docs.microsoft.com/azure/active-directory/manage-apps/add-application-portal) right away. Set up a company policy so that adding new apps to Azure AD is the standard practice in your organization. This is minimally disruptive to existing business processes and allows you to investigate and prove the value you get from integrating apps without changing the way that people do business in your environment today.

Azure Active Directory (Azure AD) has a gallery that contains thousands of pre-integrated applications to make it easy to get started. You can [add a gallery app to your Azure AD organization](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app) with step-by-step [tutorials](https://docs.microsoft.com/azure/active-directory/saas-apps/tutorial-list) for integrating with popular apps like:

- [ServiceNow](https://docs.microsoft.com/azure/active-directory/saas-apps/servicenow-tutorial)
- [Workday](https://docs.microsoft.com/azure/active-directory/saas-apps/workday-tutorial)
- [Salesforce](https://docs.microsoft.com/azure/active-directory/saas-apps/salesforce-tutorial)
- [AWS](https://docs.microsoft.com/azure/active-directory/saas-apps/amazon-web-service-tutorial)
- [Slack](https://docs.microsoft.com/azure/active-directory/saas-apps/slack-tutorial)

In addition you can [integrate applications not in the gallery](https://docs.microsoft.com/azure/active-directory/manage-apps/add-non-gallery-app), including any application that already exists in your organization, or any third-party application from a vendor who is not already part of the Azure AD gallery. You can also [add your app to the gallery](https://docs.microsoft.com/azure/active-directory/azuread-dev/howto-app-gallery-listing) if it is not there.

Finally, you can also integrate the apps you develop in-house. This is covered in step five of this guide.

## 2. Determine existing application usage and prioritize work

Next, discover the applications employees are frequently using, and prioritize your work for integrating them with Azure AD.

You can start by using Microsoft Cloud App Security&#39;s [cloud discovery tools](https://docs.microsoft.com/cloud-app-security/tutorial-shadow-it) to discover and manage &quot;shadow&quot; IT in your network (that is, apps not managed by the IT department). You can [use Microsoft Defender Advanced Threat Protection (ATP)](https://docs.microsoft.com/cloud-app-security/wdatp-integration) to simplify and extend the discovery process.

In addition, you can use the [AD FS application activity report](https://docs.microsoft.com/azure/active-directory/manage-apps/migrate-adfs-application-activity) in the Azure portal to discover all the AD FS apps in your organization, the number of unique users that have signed in to them, and compatibility for integrating them with Azure AD.

Once you have discovered your existing landscape, you will want to [create a plan](https://docs.microsoft.com/azure/active-directory/manage-apps/migration-resources) and prioritize the highest priority apps to integrate. Some example questions you can ask to guide this process are:

- Which apps are the most used?
- Which are the riskiest?
- Which apps will be decommissioned in the future, making a move unnecessary?
- Which apps need to stay on-premises and cannot be moved to the cloud?

You will see the largest benefits and cost savings once all your apps are integrated and you no longer rely on multiple identity solutions. However, you will experience easier identity management and increased security as you move stepwise towards this goal. You want to use this time to prioritize your work and decide what makes sense for your situation.

## 3. Integrate apps that rely on other identity providers

During your discovery process, you may have found applications that are untracked by the IT department, which leave your data and resources vulnerable. You may also have applications that use alternative identity solutions, including Active Directory Federation Services (ADFS) or other identity providers. Consider how you can consolidate your identity and access management to save money and increase security. Reducing the number of identity solutions you have will:

- Save you money by eliminating the need for on-premises user provisioning and authentication as well as licensing fees paid to other cloud identity providers for the same service.
- Reduce the administrative overhead and enable tighter security with fewer redundancies in your identity and access management process.
- Enable employees to get secure single sign-on access to ALL the applications they need via the [MyApps portal](https://docs.microsoft.com/azure/active-directory/manage-apps/access-panel-collections).
- Improve the intelligence of Azure AD&#39;s [identity protection](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-identity-protection) related services like conditional access by increasing the amount of data it gets from your app usage, and extend its benefits to the newly added apps.

We have published guidance for managing the business process of integrating apps with Azure AD, including a [poster](https://aka.ms/AppOnePager) and [presentation](https://aka.ms/AppGuideline) you can use to make business and application owners aware and interested. You can modify those samples with your own branding and publish them to your organization through your company portal, newsletter, or other medium as you go about completing this process.

A good place to start is by evaluating your use of Active Directory Federation Services (ADFS). Many organizations use ADFS for authentication with SaaS apps, custom Line-of-Business apps, and Office 365 and Azure AD-based apps:

![Diagram shows on-premises apps, line of business apps, SaaS apps, and, via Azure AD, Office 365 all connecting with dotted lines into Active Directory and AD FS.](\media\five-steps-to-full-application-integration-with-azure-ad\adfs-integration-1.png)

You can upgrade this configuration by [replacing ADFS with Azure AD as the center](https://docs.microsoft.com/azure/active-directory/manage-apps/migrate-adfs-apps-to-azure) of your identity management solution. Doing so enables sign-on for every app your employees want to access, and makes it easy for employees to find any business application they need via the [MyApps portal](https://docs.microsoft.com/azure/active-directory/user-help/my-apps-portal-end-user-access), in addition to the other benefits mentioned above.

![Diagram shows on-premises apps via Active Directory and AD FS, line of business apps, SaaS apps, and Office 365 all connecting with dotted lines into Azure Active Directory.](\media\five-steps-to-full-application-integration-with-azure-ad\adfs-integration-2.png)

Once Azure AD becomes the central identity provider, you may be able to switch from ADFS completely, rather than using a federated solution. Apps that previously used ADFS for authentication can now use Azure AD alone.

![Diagram shows on-premises, line of business apps, SaaS apps, and Office 365 all connecting with dotted lines into Azure Active Directory. Active Directory and AD FS is not present.](\media\five-steps-to-full-application-integration-with-azure-ad\adfs-integration-3.png)

You can also migrate apps that use a different cloud-based identity provider to Azure AD. Your organization may have multiple Identity Access Management (IAM) solutions in place. Migrating to one Azure AD infrastructure is an opportunity to reduce dependencies on IAM licenses (on-premises or in the cloud) and infrastructure costs. In cases where you may have already paid for Azure AD via M365 licenses, there is no reason to pay the added cost of another IAM solution.

## 4. Integrate on-premises applications

Traditionally, applications were kept secure by allowing access only while connected to the corporate network. However, in an increasingly connected world we want to allow access to apps for customers, partners, and/or employees, regardless of where they are in the world. [Azure AD Application Proxy](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-application-proxy) (AppProxy) is a feature of Azure AD that connects your existing on-premises apps to Azure AD and does not require that you maintain edge servers or other additional infrastructure to do so.

![A diagram shows the Application Proxy Service in action. A user accesses "https://sales.contoso.com" and their request is redirected through "https://sales-contoso.msappproxy.net" in Azure Active Directory to the on premises address "http://sales"](./media/five-steps-to-full-application-integration-with-azure-ad\app-proxy.png)

You can use [Tutorial: Add an on-premises application for remote access through Application Proxy in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-add-on-premises-application) to enable Application Proxy and add an on-premises application to your Azure AD tenant.

In addition, you can integrate application delivery controllers like F5 Big-IP APM or Zscaler Private Access. By integrating these with Azure AD, you get the modern authentication and identity management of Azure AD alongside the traffic management and security features of the partner product. We call this solution [Secure Hybrid Access](https://docs.microsoft.com/azure/active-directory/manage-apps/secure-hybrid-access). If you use any of the following services today, we have tutorials that will step you through how to integrate them with Azure AD.

- [Akamai Enterprise Application Access (EAA)](https://docs.microsoft.com/azure/active-directory/saas-apps/akamai-tutorial)
- [Citrix Application Deliver Controller (ADC)](https://docs.microsoft.com/azure/active-directory/saas-apps/citrix-netscaler-tutorial) (Formerly known as Citrix Netscaler)
- [F5 Big-IP APM](https://docs.microsoft.com/azure/active-directory/saas-apps/headerf5-tutorial)
- [Zscaler Private Access (ZPA)](https://docs.microsoft.com/azure/active-directory/saas-apps/zscalerprivateaccess-tutorial)

## 5. Integrate apps your developers build

For apps that are built within your company, your developers can use the [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/) to implement authentication and authorization. Applications integrated with the platform with be [registered with Azure AD](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app) and managed just like any other app in your portfolio.

Developers can use the platform for both internal-use apps and customer facing apps, and there are other benefits that come with using the platform. [Microsoft Authentication Libraries (MSAL)](https://docs.microsoft.com/azure/active-directory/develop/msal-overview), which is part of the platform, allows developers to enable modern experiences like multi-factor authentication and the use of security keys to access their apps without needing to implement it themselves. Additionally, apps integrated with the Microsoft identity platform can access [Microsoft Graph](https://docs.microsoft.com/azure/active-directory/develop/microsoft-graph-intro) - a unified API endpoint providing the Microsoft 365 data that describes the patterns of productivity, identity, and security in an organization. Developers can use this information to implement features that increase productivity for your users. For example, by identifying the people the user has been interacting with recently and surfacing them in the app&#39;s UI.

We have a [video series](https://www.youtube.com/watch?v=zjezqZPPOfc&amp;list=PLLasX02E8BPBxGouWlJV-u-XZWOc2RkiX) that provides a comprehensive introduction to the platform as well as [many code samples](https://docs.microsoft.com/azure/active-directory/develop/sample-v2-code) in supported languages and platforms.

## Next steps

- [Resources for migrating applications to Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/migration-resources)
