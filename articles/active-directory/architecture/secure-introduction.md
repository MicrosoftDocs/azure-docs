---
title: Delegated administration to secure with Microsoft Entra ID 
description: Introduction to delegated administration and isolated environments in Microsoft Entra ID.
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 7/5/2022
ms.author: gasinh
ms.reviewer: ajburnle
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Introduction to delegated administration and isolated environments

A Microsoft Entra single-tenant architecture with delegated administration is often adequate for separating environments. As detailed in other sections of this article, Microsoft provides many tools to do this. However, there may be times when your organization requires a degree of isolation beyond what can be achieved in a single tenant.

Before discussing specific architectures, it's important to understand:

* How a typical single tenant works.

* How administrative units in Microsoft Entra ID work.

* The relationships between Azure resources and Microsoft Entra tenants.

* Common requirements driving isolation.

<a name='azure-ad-tenant-as-a-security-boundary'></a>

## Microsoft Entra tenant as a security boundary

A Microsoft Entra tenant provides identity and access management (IAM) capabilities to applications and resources used by the organization.

An identity is a directory object that can be authenticated and authorized for access to a resource. Identity objects exist for human identities and non-human identities. To differentiate between human and non-human identities, human identities are referred to as identities and non-human identities are referred to as workload identities. Non-human entities include application objects, service principals, managed identities, and devices. The terminology is inconsistent across the industry, but generally a workload identity is something you need for your software entity to authenticate with some system.

To distinguish between human and non-human identities, different terms are emerging across the IT industry to distinguish between the two:

* **Identity** - Identity started by describing the Active Directory (AD) and Microsoft Entra object used by humans to authenticate. In this series of articles, identity refers to objects that represent humans.

* **Workload identity** - In Microsoft Entra ID, workload identities are applications, service principals, and managed identities. The workload identity is used to authenticate and access other services and resources.

For more information on workload identities, see [What are workload identities](../workload-identities/workload-identities-overview.md).

The Microsoft Entra tenant is an identity security boundary that is under the control of global administrators. Within this security boundary, administration of subscriptions, management groups, and resource groups can be delegated to segment administrative control of Azure resources. While not directly interacting, these groupings are dependent on tenant-wide configurations of policies and settings. And those settings and configurations are under the control of the Microsoft Entra Global Administrators.

Microsoft Entra ID is used to grant objects representing identities access to applications and Azure resources. In that sense both Azure resources and applications trusting Microsoft Entra ID are resources that can be managed with Microsoft Entra ID. In the following diagram, The Microsoft Entra tenant boundary shows the Microsoft Entra identity objects and the configuration tools. Below the directory are the resources that use the identity objects for identity and access management. Following best practices, the environment is set up with a test environment to test the proper operation of IAM.

![Diagram that shows shows Microsoft Entra tenant boundary.](media/secure-introduction/tenant-boundary.png)

<a name='access-to-apps-that-use-azure-ad'></a>

### Access to apps that use Microsoft Entra ID

Identities can be granted access to many types of applications. Examples include:

* Microsoft productivity services such as Exchange Online, Microsoft Teams, and SharePoint Online

* Microsoft IT services such as Azure Sentinel, Microsoft Intune, and Microsoft 365 Defender ATP

* Microsoft Developer tools such as Azure DevOps and Microsoft Graph API

* SaaS solutions such as Salesforce and ServiceNow

* On-premises applications integrated with hybrid access capabilities such as Microsoft Entra application proxy

* Custom in-house developed applications

Applications that use Microsoft Entra ID require directory objects to be configured and managed in the trusted Microsoft Entra tenant. Examples of directory objects include application registrations, service principals, groups, and [schema attribute extensions](/graph/extensibility-overview).

### Access to Azure resources

Users, groups, and service principal objects (workload identities) in the Microsoft Entra tenant are granted roles by using [Azure Role Based Access Control](/azure/role-based-access-control/overview) (RBAC) and [Azure attribute-based access control](/azure/role-based-access-control/conditions-overview) (ABAC).

* Azure RBAC enables you to provide access based on role as determined by security principal, role definition, and scope.

* Azure ABAC builds on Azure RBAC by adding role assignment conditions based on attributes in the context of specific actions. A role assignment condition is another check that you can optionally add to your role assignment to provide more fine-grained access control.

Azure resources, resource groups, subscriptions, and management groups are accessed through using these assigned RBAC roles. For example, the following diagram shows distribution of administrative capability in Microsoft Entra ID using role-based access control.

![Diagram that shows Microsoft Entra role hierarchy.](media/secure-introduction/role-hierarchy.png)

Azure resources that [support Managed Identities](../managed-identities-azure-resources/overview.md) allow resources to authenticate, be granted access to, and be assigned roles to other resources within the Microsoft Entra tenant boundary.

Applications using Microsoft Entra ID for sign-in may also use Azure resources such as compute or storage as part of its implementation. For example, a custom application that runs in Azure and trusts Microsoft Entra ID for authentication has directory objects and Azure resources.

Lastly, all Azure resources in the Microsoft Entra tenant affect tenant-wide [Azure Quotas and Limits](/azure/azure-resource-manager/management/azure-subscription-service-limits).

### Access to Directory Objects

As outlined in the previous diagram, identities, resources, and their relationships are represented in a Microsoft Entra tenant as directory objects. Examples of directory objects include users, groups, service principals, and app registrations.

Having a set of directory objects in the Microsoft Entra tenant boundary engenders the following Capabilities:

* Visibility. Identities can discover or enumerate resources, users, groups, access usage reporting and audit logs based on their permissions. For example, a member of the directory can discover users in the directory per Microsoft Entra ID [default user permissions](../fundamentals/users-default-permissions.md).

* Applications can affect objects. Applications can manipulate directory objects through Microsoft Graph as part of their business logic. Typical examples include reading/setting user attributes, updating user's calendar, sending emails on behalf of the user, etc. Consent is necessary to allow applications to affect the tenant. Administrators can consent for all users. For more information, see [Permissions and consent in the Microsoft identity platform](../develop/v2-admin-consent.md).

>[!NOTE]
>Use caution when using application permissions. For example, with Exchange Online, you should [scope application permissions to specific mailboxes and permissions](/graph/auth-limit-mailbox-access).

* Throttling and service limits. Runtime behavior of a resource might trigger [throttling](/graph/throttling) in order to prevent overuse or service degradation. Throttling can occur at the application, tenant, or entire service level. Most commonly it occurs when an application has a large number of requests within or across tenants. Similarly, there are [Microsoft Entra service limits and restrictions](../enterprise-users/directory-service-limits-restrictions.md) that might affect the runtime behavior of applications.

## Administrative units for role management

Administrative units restrict permissions in a role to any portion of your organization that you define. You could, for example, use administrative units to delegate the [Helpdesk Administrator](../roles/permissions-reference.md) role to regional support specialists, so they can manage users only in the region that they support. An administrative unit is a Microsoft Entra resource that can be a container for other Microsoft Entra resources. An administrative unit can contain only:

* Users

* Groups

* Devices

In the following diagram, administrative units are used to segment the Microsoft Entra tenant further based on the business or organizational structure. This is useful when different business units or groups have dedicated IT support staff. The administrative units can be used to provide privileged permissions that are limited to a designated administrative unit.

![Diagram that shows Microsoft Entra Administrative units.](media/secure-introduction/administrative-units.png)

For more information on administrative units, see [Administrative units in Microsoft Entra ID](../roles/administrative-units.md).

### Common reasons for resource isolation

Sometimes a group of resources should be isolated from other resources for security or other reasons, such as the resources have unique access requirements. This is a good use case for using administrative units. You must determine which users and security principals should have resource access and in what roles. Reasons to isolate resources might include:

* Developer teams need the flexibility to safely iterate during the software development lifecycle of apps. But the development and testing of apps that write to Microsoft Entra ID can potentially affect the Microsoft Entra tenant through write operations. Some examples of this include:

  * New applications that may change Office 365 content such as SharePoint sites, OneDrive, MS Teams, etc.

  * Custom applications that can change data of users with MS Graph or similar APIs at scale (for example, applications that are granted Directory.ReadWrite.All)

  * DevOps scripts that update large sets of objects as part of a deployment lifecycle.

  * Developers of Microsoft Entra integrated apps need the ability to create user objects for testing, and those user objects shouldn't have access to production resources.

* Nonproduction Azure resources and applications that may affect other resources. For example, a new beta version of a SaaS application may need to be isolated from the production instance of the application and production user objects

* Secret resources that should be shielded from discovery, enumeration, or takeover from existing administrators for regulatory or business critical reasons.

## Configuration in a tenant

Configuration settings in Microsoft Entra ID can affect any resource in the Microsoft Entra tenant through targeted, or tenant-wide management actions. Examples of tenant-wide settings include:

* **External identities**: Global administrators for the tenant identify and control the external identities that can be provisioned in the tenant.

  * Whether to allow external identities in the tenant.

  * From which domain(s) external identities can be added.

  * Whether users can invite users from other tenants.

* **Named Locations**: Global administrators can create named locations, which can then be used to

  * Block sign-ins from specific locations.

  * Trigger Conditional Access policies such as MFA.

  * Bypass security requirements

>[!NOTE]
>Using [Named Locations](../conditional-access/location-condition.md) can present some challenges to your [zero-trust journey](https://www.microsoft.com/security/business/zero-trust). Verify that using Named Locations fits into your security strategy and principles.
Allowed authentication methods: Global administrators set the authentication methods allowed for the tenant.

* **Self-service options**. Global Administrators set self-service options such as self-service-password reset and create Microsoft 365 groups at the tenant level.

The implementation of some tenant-wide configurations can be scoped as long as they don't get overridden by global administration policies. For example:

* If the tenant is configured to allow external identities, a resource administrator can still exclude those identities from accessing a resource.

* If the tenant is configured to allow personal device registration, a resource administrator can exclude those devices from accessing specific resources.

* If named locations are configured, a resource administrator can configure policies either allowing or excluding access from those locations.

### Common reasons for configuration isolation

Configurations, controlled by Global Administrators, affect resources. While some tenant-wide configuration can be scoped with policies to not apply or partially apply to a specific resource, others can't. If a resource has configuration needs that are unique, isolate it in a separate tenant. Examples of configuration isolation scenarios include:

* Resources having requirements that conflict with existing tenant-wide security or collaboration postures. (for example allowed authentication types, device management policies, ability to self-service, identity proofing for external identities, etc.).

* Compliance requirements that scope certification to the entire environment, including all resources and the Microsoft Entra tenant itself, especially when those requirements conflict with or must exclude other organizational resources.

* External user access requirements that conflict with production or sensitive resource policies.

* Organizations that span multiple countries/regions, and companies hosted in a single Microsoft Entra tenant. For example, what settings and licenses are used in different countries/regions, or business subsidiaries.

## Administration in a tenant

Identities with privileged roles in the Microsoft Entra tenant have the visibility and permissions to execute the configuration tasks described in the previous sections. Administration includes both the administration of identity objects such as users, groups, and devices, and the scoped implementation of tenant-wide configurations for authentication, authorization, etc.

### Administration of directory objects

Administrators manage how identity objects can access resources, and under what circumstances. They also can disable, delete, or modify directory objects based on their privileges. Identity objects include:

* **Organizational identities**, such as the following, are represented by user objects:

  * Administrators

  * Organizational users

  * Organizational developers

  * Service Accounts

  * Test users

* **External identities** represent users from outside the organization such as:

  * Partners, suppliers, or vendors that are provisioned with accounts local to the organization environment

  * Partners, suppliers, or vendors that are provisioned via Azure B2B collaboration

* **Groups** are represented by objects such as:

  * Security groups

  * [Microsoft 365 groups](/microsoft-365/community/all-about-groups)

  * Dynamic Groups

  * Administrative Units

* **Devices** are represented by objects such as:

  * Microsoft Entra hybrid joined devices (On-premises computers synchronized from on-premises Active Directory)

  * Microsoft Entra joined devices

  * Microsoft Entra registered mobile devices used by employees to access their workplace applications.

  * Microsoft Entra registered down-level devices (legacy). For example, Windows 2012 R2.

* **Workload Identities**
  * Managed identities

  * Service principals

  * Applications

In a hybrid environment, identities are typically synchronized from the on-premises Active Directory environment using [Microsoft Entra Connect](../hybrid/connect/whatis-azure-ad-connect.md).

### Administration of identity services

Administrators with appropriate permissions can also manage how tenant-wide policies are implemented at the level of resource groups, security groups, or applications. When considering administration of resources, keep the following in mind. Each can be a reason to keep resources together, or to isolate them.

* A **Global Administrator** can take control of any Azure subscription linked to the Tenant.

* An **identity assigned an Authentication Administrator role** can require nonadministrators to reregister for MFA or FIDO authentication.

* A **Conditional Access Administrator** can create Conditional Access policies that require users signing-in to specific apps to do so only from organization-owned devices. They can also scope configurations. For example, even if external identities are allowed in the tenant, they can exclude those identities from accessing a resource.

* A **Cloud Application Administrator** can consent to application permissions on behalf of all users.

### Common reasons for administrative isolation

Who should have the ability to administer the environment and its resources? There are times when administrators of one environment must not have access to another environment. Examples include:

* Separation of tenant-wide administrative responsibilities to further mitigate the risk of security and operational errors affecting critical resources.

* Regulations that constrain who can administer the environment based on conditions such as citizenship, residency, clearance level, etc. that can't be accommodated with staff.

## Security and operational considerations

Given the interdependence between a Microsoft Entra tenant and its resources, it's critical to understand the security and operational risks of compromise or error. If you're operating in a federated environment with synchronized accounts, an on-premises compromise can lead to a Microsoft Entra ID compromise.

* **Identity compromise** - Within the boundary of a tenant, any identity can be assigned any role, given the one providing access has sufficient privileges. While the effect of compromised non-privileged identities is largely contained, compromised administrators can have broad implications. For example, if a Microsoft Entra Global Administrator account is compromised, Azure resources can become compromised. To mitigate risk of identity compromise, or bad actors, implement [tiered administration](/security/privileged-access-workstations/privileged-access-access-model) and ensure that you follow principles of least privilege for [Microsoft Entra Administrator Roles](../roles/delegate-by-task.md). Similarly, ensure that you create Conditional Access policies that specifically exclude test accounts and test service principals from accessing resources outside of the test applications. For more information on privileged access strategy, see [Privileged access: Strategy](/security/privileged-access-workstations/privileged-access-strategy).

* **Federated environment compromise**

* **Trusting resource compromise** - Human identities aren't the only security consideration. Any compromised component of the Microsoft Entra tenant can affect trusting resources based on its level of permissions at the tenant and resource level. The effect of a compromised component of a Microsoft Entra ID trusting resource is determined by the privileges of the resource; resources that are deeply integrated with the directory to perform write operations can have profound impact in the entire tenant. Following [guidance for zero trust](/azure/architecture/guide/security/conditional-access-zero-trust) can help limit the impact of compromise.

* **Application development** - Early stages of the development lifecycle for applications with writing privileges to Microsoft Entra ID, where bugs can unintentionally write changes to the Microsoft Entra objects, present a risk. Follow [Microsoft identity platform best practices](../develop/identity-platform-integration-checklist.md) during development to mitigate these risks.

* **Operational error** - A security incident can occur not only due to bad actors, but also because of an operational error by tenant administrators or the resource owners. These risks occur in any architecture. Mitigate these risks with separation of duties, tiered administration, following principles of least privilege, and following best practices before trying to mitigate by using a separate tenant.

Incorporating zero-trust principles into your Microsoft Entra ID design strategy can help guide your design to mitigate these considerations. For more information, visit [Embrace proactive security with Zero Trust](https://www.microsoft.com/security/business/zero-trust).

## Next steps

* [Microsoft Entra fundamentals](./secure-fundamentals.md)

* [Azure resource management fundamentals](secure-resource-management.md)

* [Resource isolation in a single tenant](secure-single-tenant.md)

* [Resource isolation with multiple tenants](secure-multiple-tenants.md)

* [Best practices](secure-best-practices.md)
