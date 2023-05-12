---
title: Automate provisioning to and from SAP apps
description: Manage the lifecycle of accounts in SAP applications. 
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.subservice: compliance
ms.topic: overview
ms.workload: identity
ms.date: 04/28/2023
ms.author: billmath
ms.custom: contperf-fy21q3-portal
ms.reviewer: amycolannino
---

# Automate provisioning to and from SAP apps

SAP likely runs critical functions such as HR and ERP for your business. At the same time, your business relies on Microsoft for various Azure services, Microsoft 365, etc., and relies on Azure AD to manage access to applications. This document describes how you can get started using Azure AD to manage identities across SAP applications. 
When an employee is hired, they have an account created in an HR system such as SAP SuccessFactors. Once that employee starts their job, they’ll need access to both Microsoft applications (ex: Teams and SharePoint) and SAP applications (ex: Analytics cloud, Concur, S/4 Hana). Using Entra Identity Governance and SAP IPS, you can automate lifecycle management and provide access to the applications that users need.  

![Diagram of SAP integrations.](./media/sap/SapIntegrations.png)

# Bring identities from HR into Azure AD

#### SuccessFactors
Customers using SAP SuccessFactors can easily bring identities into [Active Directory](../../active-directory/saas-apps/sap-successfactors-inbound-provisioning-tutorial.md) or [Azure AD](../../saas-apps/sap-successfactors-inbound-provisioning-cloud-only-tutorial.md) using native connectors. The integration supports the following scenarios:
* **Hiring new employees** - When a new employee is added to SuccessFactors, a user account is automatically created in Azure Active Directory and optionally Microsoft 365 and [other SaaS applications supported by Azure AD](https://learn.microsoft.com/azure/active-directory/app-provisioning/user-provisioning), with write-back of the email address to SuccessFactors.
* **Employee attribute and profile updates** - When an employee record is updated in SuccessFactors (such as their name, title, or manager), their user account will be automatically updated Azure Active Directory and optionally Microsoft 365 and [other SaaS applications supported by Azure AD](https://learn.microsoft.com/azure/active-directory/app-provisioning/user-provisioning).
* **Employee terminations** - When an employee is terminated in SuccessFactors, their user account is automatically disabled in Azure Active Directory and optionally Microsoft 365 and other SaaS applications supported by Azure AD.
* **Employee rehires** - When an employee is rehired in SuccessFactors, their old account can be automatically reactivated or re-provisioned (depending on your preference) to Azure Active Directory and optionally Microsoft 365 and other SaaS applications supported by Azure AD.

> [!VIDEO https://www.youtube-nocookie.com/embed/66v2FR2-QrY]
 
#### SAP HCM
Customers that are still using SAP HCM can also get identities into Azure AD. Using the SAP Integration Suite, you can synchronize identities between SAP HCM and SAP SuccessFactors. From there, you can bring identities directly into Azure AD or provisioning them into Active Directory Domain Services, using the native provisioning integrations mentioned above. 
 

# Provision identities into modern SAP applications. 
Once your users are in Azure Active Directory, you can provision accounts into the various SaaS and on-premises SAP applications that they need access to. You've three ways to accomplish this.
* **Option 1:** Use the enterprise application in Azure AD to configure both SSO and provisioning to SAP applications such as [SAP analytics cloud](https://learn.microsoft.com/azure/active-directory/saas-apps/sap-analytics-cloud-provisioning-tutorial). This option allows you to manage access in one place, while incorporating your governance to request access to applications and review access are in place. Within SAP, you can expose a proxy SCIM API using the SAP Identity Provisioning service that allows Azure AD to provision accounts into SAP analytics cloud. 
* **Option 2:** Use the [SAP IAS](https://learn.microsoft.com/azure/active-directory/saas-apps/sap-cloud-platform-identity-authentication-provisioning-tutorial) enterprise application in Azure AD to provision identities into SAP IAS. Once you bring all the identities into SAP IAS, you can either enable federation with the application or use SAP IPS to provision the accounts from SAP IAS into the application.   
* **Option 3:** Use the [SAP IPS](https://help.sap.com/docs/IDENTITY_PROVISIONING/f48e822d6d484fa5ade7dda78b64d9f5/f2b2df8a273642a1bf801e99ecc4a043.html) integration to directly export identities from Azure AD into your [application](https://help.sap.com/docs/IDENTITY_PROVISIONING/f48e822d6d484fa5ade7dda78b64d9f5/ab3f641552464c79b94d10b9205fd721.html). When choosing this route, all provisioning configuration is managed in SAP directly. You can still use the enterprise application in Azure AD to manage single sign-on and use [Azure AD as the corporate identity provider](https://help.sap.com/docs/IDENTITY_AUTHENTICATION/6d6d63354d1242d185ab4830fc04feb1/058c7b14209f4f2d8de039da4330a1c1.html). 

# Provision identities into on-premises SAP systems that aren't supported by SAP IPS (e.g. SAP ERP or R/3)

Customers who have yet to transition from systems such as SAP ERP to SAP S/4 Hana can still rely on the Azure AD provisioning service to provision user accounts. Within SAP ERP, you'll expose the necessary BAPIs for creating, updating, and deleting users. Within Azure AD, you have two options:
* **Option 1:** Use the lightweight Azure AD provisioning agent and web services connector to provision users into apps such as SAP ERP.
* **Option 2:** In scenarios where you need to do more complex group and role management, use the [Microsoft Identity Manager](https://learn.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-ma-ws) to manage access to your legacy SAP applications. 

## Beyond user provisioning
In addition to the native provisioning integrations that allow you to manage access to your SAP applications, Azure AD supports a rich set of integrations with SAP.   
* SSO: Once you’ve setup provisioning for your SAP application, you’ll want to enable single sign-on for those applications. Azure AD can serve as the identity provider and server as the authentication authority for your SAP applications. Learn more about how you can [configure Azure AD as the corporate identity provider for your SAP applications](https://help.sap.com/docs/IDENTITY_AUTHENTICATION/6d6d63354d1242d185ab4830fc04feb1/058c7b14209f4f2d8de039da4330a1c1.html).   
Custom workflows: When a new employee is hired in your organization, you may need to trigger a workflow within your SAP server. Using the Entra Identity Governance 
* [Lifecycle Workflow capability](https://learn.microsoft.com/azure/active-directory/governance/lifecycle-workflow-extensibility) in conjunction with the [SAP connector in Azure Logic apps](https://learn.microsoft.com/azure/logic-apps/logic-apps-using-sap-connector), you can trigger custom actions in SAP upon hiring a new employee.
* Segregation of duties: With separation of duties checks now available in preview in Azure AD [entitlement management](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/ensure-compliance-using-separation-of-duties-checks-in-access/ba-p/2466939), customers can now ensure that users don't take on excessive access rights.  Admins and access managers can prevent users from requesting additional access packages if they’re already assigned to other access packages or are a member of other groups that are incompatible with the requested access.
Enterprises with critical regulatory requirements for SAP apps will have a single consistent view of access controls and enforce separation of duties checks across their financial and other business critical applications and Azure AD-integrated applications. With our [Pathlock](https://pathlock.com/), integration customers can leverage fine-grained separation of duties checks with access packages in Azure AD, and over time will help customers to address Sarbanes Oxley and other compliance requirements.




