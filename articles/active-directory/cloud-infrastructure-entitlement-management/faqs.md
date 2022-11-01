---
title: Frequently asked questions (FAQs) about Permissions Management
description: Frequently asked questions (FAQs) about Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: faq
ms.date: 04/20/2022
ms.author: jfields
---

# Frequently asked questions (FAQs)

This article answers frequently asked questions (FAQs) about Permissions Management.

## What's Permissions Management?

Permissions Management is a cloud infrastructure entitlement management (CIEM) solution that provides comprehensive visibility into permissions assigned to all identities. For example, over-privileged workload and user identities, actions, and resources across multi-cloud infrastructures in Microsoft Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP). Permissions Management detects, automatically right-sizes, and continuously monitors unused and excessive permissions. It deepens the Zero Trust security strategy by augmenting the least privilege access principle.


## What are the prerequisites to use Permissions Management?

Permissions Management supports data collection from AWS, GCP, and/or Microsoft Azure. For data collection and analysis, customers are required to have an Azure Active Directory (Azure AD) account to use Permissions Management.

## Can a customer use Permissions Management if they have other identities with access to their IaaS platform that aren't yet in Azure AD (for example, if part of their business has Okta or AWS Identity & Access Management (IAM))?

Yes, a customer can detect, mitigate, and monitor the risk of 'backdoor' accounts that are local to AWS IAM, GCP, or from other identity providers such as Okta or AWS IAM.

## Where can customers access Permissions Management?

Customers can access the Permissions Management interface with a link from the Azure AD extension in the Azure portal.

## Can non-cloud customers use Permissions Management on-premises?

No, Permissions Management is a hosted cloud offering.

## Can non-Azure customers use Permissions Management?

Yes, non-Azure customers can use our solution. Permissions Management is a multi-cloud solution so even customers who have no subscription to Azure can benefit from it.

## Is Permissions Management available for tenants hosted in the European Union (EU)?

Yes, Permissions Management is currently for tenants hosted in the European Union (EU).

## If I'm already using Azure AD  Privileged Identity Management (PIM) for Azure, what value does Permissions Management provide?

Permissions Management complements Azure AD PIM. Azure AD PIM provides just-in-time access for admin roles in Azure (as well as Microsoft Online Services and apps that use groups), while Permissions Management allows multi-cloud discovery, remediation, and monitoring of privileged access across Azure, AWS, and GCP.

## What public cloud infrastructures are supported by Permissions Management?

Permissions Management currently supports the three major public clouds: Amazon Web Services (AWS), Google Cloud Platform (GCP), and Microsoft Azure.

## Does Permissions Management support hybrid environments?

Permissions Management currently doesn't support hybrid environments.

## What types of identities are supported by Permissions Management?

Permissions Management supports user identities (for example, employees, customers, external partners) and workload identities (for example, virtual machines, containers, web apps, serverless functions).

## Is Permissions Management available in Government Cloud?

No, Permissions Management is currently not available in Government clouds.

## Is Permissions Management available for sovereign clouds?

No, Permissions Management is currently not available in sovereign Clouds.

## How does Permissions Management collect insights about permissions usage?

Permissions Management has a data collector that collects access permissions assigned to various identities, activity logs, and resources metadata. This gathers full visibility into permissions granted to all identities to access the resources and details on usage of granted permissions.

## How does Permissions Management evaluate cloud permissions risk?

Permissions Management offers granular visibility into all identities and their permissions granted versus used, across cloud infrastructures to uncover any action performed by any identity on any resource. This isn't limited to just user identities, but also workload identities such as virtual machines, access keys, containers, and scripts. The dashboard gives an overview of permission profile to locate the riskiest identities and resources.

## What is the Permissions Creep Index?

The Permissions Creep Index (PCI) is a quantitative measure of risk associated with an identity or role determined by comparing permissions granted versus permissions exercised. It allows users to instantly evaluate the level of risk associated with the number of unused or over-provisioned permissions across identities and resources. It measures how much damage identities can cause based on the permissions they have.

## How can customers use Permissions Management to delete unused or excessive permissions?

Permissions Management allows users to right-size excessive permissions and automate least privilege policy enforcement with just a few clicks. The solution continuously analyzes historical permission usage data for each identity and gives customers the ability to right-size permissions of that identity to only the permissions that are being used for day-to-day operations. All unused and other risky permissions can be automatically removed.

## How can customers grant permissions on-demand with Permissions Management?

For any break-glass or one-off scenarios where an identity needs to perform a specific set of actions on a set of specific resources, the identity can request those permissions on-demand for a limited period with a self-service workflow. Customers can either use the built-in workflow engine or their IT service management (ITSM) tool. The user experience is the same for any identity type, identity source (local, enterprise directory, or federated) and cloud.

## What is the difference between permissions on-demand and just-in-time access?

Just-in-time (JIT) access is a method used to enforce the principle of least privilege to ensure identities are given the minimum level of permissions to perform the task at hand. Permissions on-demand are a type of JIT access that allows the temporary elevation of permissions, enabling identities to access resources on a by-request, timed basis.

## How can customers monitor permissions usage with Permissions Management?

Customers only need to track the evolution of their Permission Creep Index to monitor permissions usage. They can do this in the "Analytics" tab in their Permissions Management dashboard where they can see how the PCI of each identity or resource is evolving over time.

## Can customers generate permissions usage reports?

Yes, Permissions Management has various types of system report available that capture specific data sets. These reports allow customers to:
- Make timely decisions.
- Analyze usage trends and system/user performance.
- Identify high-risk areas.

For information about permissions usage reports, see [Generate and download the Permissions analytics report](product-permissions-analytics-reports.md).

## Does Permissions Management integrate with third-party ITSM (Information Technology Service Management) tools?

Integration with ITMS tools, such as ServiceNow, is in the future roadmap.

## How is Permissions Management being deployed?

Customers with Global Admin role have first to onboard Permissions Management on their Azure AD tenant, and then onboard their AWS accounts, GCP projects, and Azure subscriptions. More details about onboarding can be found in our product documentation.

## How long does it take to deploy Permissions Management?

It depends on each customer and how many AWS accounts, GCP projects, and Azure subscriptions they have.

## Once Permissions Management is deployed, how fast can I get permissions insights?

Once fully onboarded with data collection setup, customers can access permissions usage insights within hours. Our machine-learning engine refreshes the Permission Creep Index every hour so that customers can start their risk assessment right away.

## Is Permissions Management collecting and storing sensitive personal data?

No, Permissions Management doesn't have access to sensitive personal data.

## Where can I find more information about Permissions Management?

You can read our blog and visit our web page. You can also get in touch with your Microsoft point of contact to schedule a demo.

## What is the data destruction/decommission process? 

If a customer initiates a free Permissions Management 90-day trial, but does not follow up and convert to a paid license within 90 days of the free trial expiration, we will delete all collected data on or just before 90 days.  

If a customer decides to discontinue licensing the service, we will also delete all previously collected data within 90 days of license termination.  

We also have the ability to remove, export or modify specific data should the Global Admin using the Entra Permissions Management service file an official Data Subject Request. This can be initiated by opening a ticket in the Azure portal [New support request - Microsoft Entra admin center](https://entra.microsoft.com/#blade/Microsoft_Azure_Support/NewSupportRequestV3Blade/callerName/ActiveDirectory/issueType/technical), or alternately contacting your local Microsoft representative. 

## Do I require a license to use Entra Permissions Management? 

Yes, as of July 1st, 2022, new customers must acquire a free 90-trial license or a paid license to use the service. You can enable a trial here: [https://aka.ms/TryPermissionsManagement](https://aka.ms/TryPermissionsManagement) or you can directly purchase resource-based licenses here: [https://aka.ms/BuyPermissionsManagement](https://aka.ms/BuyPermissionsManagement) 
 
## What do I do if I’m using Public Preview version of Entra Permissions Management?  

If you are using the Public Preview version of Entra Permissions Management, your current deployment(s) will continue to work through October 1st.  

After October 1st you will need to move over to use the newly released version of the service and enable a 90-day trial or purchase licenses to continue using the service.  

## What do I do if I’m using the legacy version of the CloudKnox service?  

We are currently working on developing a migration plan to help customers on the original CloudKnox service move to the new Entra Permissions Management service later in 2022.   

## Can I use Entra Permissions Management in the EU?  

Yes, the product is compliant.  

## How to I enable one of the new 18 languages supported in the GA release? 

We are now localized in 18 languages. We respect your browser setting or you can manually enable your language of choice by adding a query string suffix to your Entra Permissions Management URL:  

`?lang=xx-XX` 

Where xx-XX is one of the following available language parameters: 'cs-CZ', 'de-DE', 'en-US', 'es-ES', 'fr-FR', 'hu-HU', 'id-ID', 'it-IT', 'ja-JP', 'ko-KR', 'nl-NL', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sv-SE', 'tr-TR', 'zh-CN', or 'zh-TW'. 

## Resources

- [Public Preview announcement blog](https://www.aka.ms/CloudKnox-Public-Preview-Blog)
- [Permissions Management web page](https://microsoft.com/security/business/identity-access-management/permissions-management)
- For more information about Microsoft's privacy and security terms, see [Commercial Licensing Terms](https://www.microsoft.com/licensing/terms/product/ForallOnlineServices/all). 
- For more information about Microsoft's data processing and security terms when you subscribe to a product, see [Microsoft Products and Services Data Protection Addendum (DPA)](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA).
- For more information, see [Azure Data Subject Requests for the GDPR and CCPA](/compliance/regulatory/gdpr-dsr-azure).

## Next steps

- For an overview of Permissions Management, see [What's Permissions Management?](overview.md).
- For information on how to onboard Permissions Management in your organization, see [Enable Permissions Management in your organization](onboard-enable-tenant.md).
