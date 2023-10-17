---
title: Fundamentals of securing with Microsoft Entra ID 
description: Fundamentals of securing your tenants in Microsoft Entra ID.
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

# Microsoft Entra fundamentals

Microsoft Entra ID provides an identity and access boundary for Azure resources and trusting applications. Most environment-separation requirements can be fulfilled with delegated administration in a single Microsoft Entra tenant. This configuration reduces management overhead of your systems. However, some specific cases, for example complete resource and identity isolation, require multiple tenants.

You must determine your environment separation architecture based on your needs. Areas to consider include:

* **Resource separation**. If a resource can change directory objects such as user objects, and the change would interfere with other resources, the resource may need to be isolated in a multi-tenant architecture.

* **Configuration separation**. Tenant-wide configurations affect all resources. The effect of some tenant-wide configurations can be scoped with Conditional Access policies and other methods. If you have a need for different tenant configurations that can't be scoped with Conditional Access policies, you may need a multi-tenant architecture.

* **Administrative separation**. You can delegate the administration of management groups, subscriptions, resource groups, resources, and some policies within a single tenant. A Global Administrator always has access to everything within the tenant. If you need to ensure that the environment doesn't share administrators with another environment, you need a multi-tenant architecture.

To stay secure, you must follow best practices for identity provisioning, authentication management, identity governance, lifecycle management, and operations consistently across all tenants.

## Terminology

This list of terms is commonly associated with Microsoft Entra ID and relevant to this content:

**Microsoft Entra tenant**. A dedicated and trusted instance of Microsoft Entra ID that is automatically created when your organization signs up for a Microsoft cloud service subscription. Examples of subscriptions include Microsoft Azure, Microsoft Intune, or Microsoft 365. A Microsoft Entra tenant generally represents a single organization or security boundary. The Microsoft Entra tenant includes the users, groups, devices, and applications used to perform identity and access management (IAM) for tenant resources.

**Environment**. In the context of this content, an environment is a collection of Azure subscriptions, Azure resources, and applications that are associated with one or more Microsoft Entra tenets. The Microsoft Entra tenant provides the identity control plane to govern access to these resources.

**Production environment**. In the context of this content, a production environment is the live environment with the infrastructure and services that end users directly interact with. For example, a corporate or customer-facing environment.

**Non-production environment**. In the context of this content, a nonproduction environment refers to an environment used for:

* Development

* Testing

* Lab purposes

Non-production environments are commonly referred to as sandbox environments.

**Identity**. An identity is a directory object that can be authenticated and authorized for access to a resource. Identity objects exist for human identities and non-human identities. Non-human entities include:

* Application objects

* Workload identities (formerly described as service principles)

* Managed identities

* Devices

**Human identities** are user objects that generally represent people in an organization. These identities are either created and managed directly in Microsoft Entra ID or are synchronized from an on-premises Active Directory to Microsoft Entra ID for a given organization. These types of identities are referred to as **local identities**. There can also be user objects invited from a partner organization or a social identity provider using [Microsoft Entra B2B collaboration](../external-identities/what-is-b2b.md). In this content, we refer to these types of identity as **external identities**.

**Non-human identities** include any identity not associated with a human. This type of identity is an object such as an application that requires an identity to run. In this content, we refer to this type of identity as a **workload identity**. Various terms are used to describe this type of identity, including [application objects and service principals](../develop/configure-app-multi-instancing.md).

* **Application object**. A Microsoft Entra application is defined by its application object. The object resides in the Microsoft Entra tenant where the application registered. The tenant is known as the application's "home" tenant.

  * **Single-tenant** applications are created to only authorize identities coming from the "home" tenant.

  * **Multi-tenant** applications allow identities from any Microsoft Entra tenant to authenticate.

* **Service principal object**. Although there are [exceptions](../develop/configure-app-multi-instancing.md), application objects can be considered the *definition* of an application. Service principal objects can be considered an instance of an application. Service principals generally reference an application object, and one application object is referenced by multiple service principals across directories.

**Service principal objects** are also directory identities that can perform tasks independently from human intervention. The service principal defines the access policy and permissions for a user or application in the Microsoft Entra tenant. This mechanism enables core features such as authentication of the user or application during sign-in and authorization during resource access.

Microsoft Entra ID allows application and service principal objects to authenticate with a password (also known as an application secret), or with a certificate. The use of passwords for service principals is discouraged and [we recommend using a certificate](../develop/howto-create-service-principal-portal.md) whenever possible.

* **Managed identities for Azure resources**. Managed identities are special service principals in Microsoft Entra ID. This type of service principal can be used to authenticate against services that support Microsoft Entra authentication without needing to store credentials in your code or handle secrets management. For more information, see [What are managed identities for Azure resources?](../managed-identities-azure-resources/overview.md)

* **Device identity**: A device identity verifies  the device in the authentication flow has undergone a process to attest  the device is legitimate and meets the technical requirements. Once the device has successfully completed this process, the associated identity can be used to further control access to an organization's resources. With Microsoft Entra ID, devices can authenticate with a certificate.

Some legacy scenarios required a human identity to be used in *non-human* scenarios. For example, when service accounts being used in on-premises applications such as scripts or batch jobs require access to Microsoft Entra ID. This pattern isn't recommended and we recommend you use [certificates](../authentication/concept-certificate-based-authentication-technical-deep-dive.md). However, if you do use a human identity with password for authentication, protect your Microsoft Entra accounts with [Microsoft Entra multifactor authentication](../authentication/concept-mfa-howitworks.md).

**Hybrid identity**. A hybrid identity is an identity that spans on-premises and cloud environments. This provides the benefit of being able to use the same identity to access on-premises and cloud resources. The source of authority in this scenario is typically an on-premises directory, and the identity lifecycle around provisioning, de-provisioning and resource assignment is also driven from on-premises. For more information, see [Hybrid identity documentation](../hybrid/index.yml).

**Directory objects**. A Microsoft Entra tenant contains the following common objects:

* **User objects** represent human identities and non-human identities for services that currently don't support service principals. User objects contain attributes that have the required information about the user including personal details, group memberships, devices, and roles assigned to the user.

* **Device objects** represent devices that are associated with a Microsoft Entra tenant. Device objects contain attributes that have the required information about the device. This includes the operating system, associated user, compliance state, and the nature of the association with the Microsoft Entra tenant. This association can take multiple forms depending on the nature of the interaction and trust level of the device.

  * **Hybrid Domain Joined**. Devices that are owned by the organization and [joined](../devices/concept-hybrid-join.md) to both the on-premises Active Directory and Microsoft Entra ID. Typically a device purchased and managed by an organization and managed by System Center Configuration Manager.

  * **Microsoft Entra Domain Joined**. Devices that are owned by the organization and joined to the organization's Microsoft Entra tenant. Typically a device purchased and managed by an organization that is joined to Microsoft Entra ID and managed by a service such as [Microsoft Intune](https://www.microsoft.com/microsoft-365/enterprise-mobility-security/microsoft-intune).

  * **Microsoft Entra registered**. Devices not owned by the organization, for example, a personal device, used to access company resources. Organizations may require the device be enrolled via [Mobile Device Management (MDM)](https://www.microsoft.com/itshowcase/mobile-device-management-at-microsoft), or enforced through [Mobile Application Management (MAM)](/mem/intune/apps/apps-supported-intune-apps) without enrollment to access resources. This capability can be provided by a service such as Microsoft Intune.

* **Group objects** contain objects for the purposes of assigning resource access, applying controls, or configuration. Group objects contain attributes that have the required information about the group including the name, description, group members, group owners, and the group type. Groups in Microsoft Entra ID take multiple forms based on an organization's requirements and can be mastered in Microsoft Entra ID or synchronized from on-premises Active Directory Domain Services (AD DS).

  * **Assigned groups**. In Assigned groups, users are added to or removed from the group manually, synchronized from on-premises AD DS, or updated as part of an automated scripted workflow. An assigned group can be synchronized from on-premises AD DS or can be homed in Microsoft Entra ID.

  * **Dynamic membership groups**. In Dynamic groups, users are assigned to the group automatically based on defined attributes. This allows group membership to be dynamically updated based on data held within the user objects. A dynamic group can only be homed in Microsoft Entra ID.

**Microsoft Account (MSA)**. You can create Azure subscriptions and tenants using Microsoft Accounts (MSA). A Microsoft Account is a personal account (as opposed to an organizational account) and is commonly used by developers and for trial scenarios. When used, the personal account is always made a guest in a Microsoft Entra tenant.

<a name='azure-ad-functional-areas'></a>

## Microsoft Entra functional areas

These are the functional areas provided by Microsoft Entra ID that are relevant to isolated environments. To learn more about the capabilities of Microsoft Entra ID, see [What is Microsoft Entra ID?](../fundamentals/whatis.md).

### Authentication

**Authentication**. Microsoft Entra ID provides support for authentication protocols compliant with open standards such as OpenID Connect, OAuth and SAML. Microsoft Entra ID also provides capabilities to allow organizations to federate existing on-premises identity providers such as Active Directory Federation Services (AD FS) to authenticate access to Microsoft Entra integrated applications.

Microsoft Entra ID provides industry-leading strong authentication options that organizations can use to secure access to resources. Microsoft Entra multifactor authentication, device authentication and password-less capabilities allow organizations to deploy strong authentication options that suit their workforce's requirements.

**Single sign-on (SSO)**. With single sign-on, users sign in once with one account to access all resources that trust the directory such as domain-joined devices, company resources, software as a service (SaaS) applications, and all Microsoft Entra integrated applications. For more information, see [single sign-on to applications in Microsoft Entra ID](../manage-apps/what-is-single-sign-on.md).

### Authorization

**Resource access assignment**. Microsoft Entra ID provides and secures access to resources. Assigning access to a resource in Microsoft Entra ID can be done in two ways:

* **User assignment**: The user is directly assigned access to the resource and the appropriate role or permission is assigned to the user.

* **Group assignment**: A group containing one or more users is assigned to the resource and the appropriate role or permission is assigned to the group

**Application access policies**. Microsoft Entra ID provides capabilities to further control and secure access to your organization's applications.

**Conditional Access**. Microsoft Entra Conditional Access policies are tools to bring user and device context into the authorization flow when accessing Microsoft Entra resources. Organizations should explore use of Conditional Access policies to allow, deny, or enhance authentication based on user, risk, device, and network context. For more information, see the [Microsoft Entra Conditional Access documentation](../conditional-access/index.yml).

**Microsoft Entra ID Protection**. This feature enables organizations to automate the detection and remediation of identity-based risks, investigate risks, and export risk detection data to third-party utilities for further analysis. For more information, see [overview on Microsoft Entra ID Protection](../identity-protection/overview-identity-protection.md).

### Administration

**Identity management**. Microsoft Entra ID provides tools to manage the lifecycle of user, group, and device identities. [Microsoft Entra Connect](../hybrid/connect/whatis-azure-ad-connect.md) enables organizations to extend current, on-premises identity management solution to the cloud. Microsoft Entra Connect manages the provisioning, de-provisioning, and updates to these identities in Microsoft Entra ID.

Microsoft Entra ID also provides a portal and the Microsoft Graph API to allow organizations to manage identities or integrate Microsoft Entra identity management into existing workflows or automation. To learn more about Microsoft Graph, see [Use the Microsoft Graph API](/graph/use-the-api).

**Device management**. Microsoft Entra ID is used to manage the lifecycle and integration with cloud and on-premises device management infrastructures. It also is used to define policies to control access from cloud or on-premises devices to your organizational data. Microsoft Entra ID provides the lifecycle services of devices in the directory and the credential provisioning to enable authentication. It also manages a key attribute of a device in the system that is the level of trust. This detail is important when designing a resource access policy. For more information, see [Microsoft Entra Device Management documentation](../devices/index.yml).

**Configuration management**. Microsoft Entra ID has service elements that need to be configured and managed to ensure the service is configured to an organization's requirements. These elements include domain management, SSO configuration, and application management to name but a few. Microsoft Entra ID provides a portal and the Microsoft Graph API to allow organizations to manage these elements or integrate into existing processes. To learn more about Microsoft Graph, see [Use the Microsoft Graph API](/graph/use-the-api).

### Governance

**Identity lifecycle**. Microsoft Entra ID provides capabilities to create, retrieve, delete, and update identities in the directory, including external identities. Microsoft Entra ID also [provides services to automate the identity lifecycle](../app-provisioning/how-provisioning-works.md) to ensure it's maintained in line with your organization's needs. For example, using Access Reviews to remove external users who haven't signed in for a specified period.

**Reporting and analytics**. An important aspect of identity governance is visibility into user actions. Microsoft Entra ID provides insights into your environment's security and usage patterns. These insights include detailed information on:

* What your users access

* Where they access it from

* The devices they use

* Applications used to access

Microsoft Entra ID also provides information on the actions that are being performed within Microsoft Entra ID, and reports on security risks. For more information, see [Microsoft Entra reports and monitoring](../reports-monitoring/index.yml).

**Auditing**. Auditing provides traceability through logs for all changes done by specific features within Microsoft Entra ID. Examples of activities found in audit logs include changes made to any resources within Microsoft Entra ID like adding or removing users, apps, groups, roles, and policies. Reporting in Microsoft Entra ID enables you to audit sign-in activities, risky sign-ins, and users flagged for risk. For more information, see [Audit activity reports in the Azure portal](../reports-monitoring/concept-audit-logs.md).

**Access certification**. Access certification is the process to prove that a user is entitled to have access to a resource at a point in time. Microsoft Entra access reviews continually review the memberships of groups or applications and provide insight to determine whether access is required or should be removed. This enables organizations to effectively manage group memberships, access to enterprise applications, and role assignments to make sure only the right people have continued access. For more information, see [What are Microsoft Entra access reviews?](../governance/access-reviews-overview.md)

**Privileged access**. [Microsoft Entra Privileged Identity Management](../privileged-identity-management/pim-configure.md) (PIM) provides time-based and approval-based role activation to mitigate the risks of excessive, unnecessary, or misused access permissions to Azure resources. It's used to protect privileged accounts by lowering the exposure time of privileges and increasing visibility into their use through reports and alerts.

### Self-service management

**Credential registration**. Microsoft Entra ID provides capabilities to manage all aspects of user identity lifecycle and self-service capabilities to reduce the workload of an organization's helpdesk.

**Group management**. Microsoft Entra ID provides capabilities that enable users to request membership in a group for resource access and to create groups that can be used for securing resources or collaboration. These capabilities can be controlled by the organization so that appropriate controls are put in place.

### Consumer Identity and Access Management (IAM)

**Azure AD B2C**. Azure AD B2C is a service that can be enabled in an Azure subscription to provide identities to consumers for your organization's customer-facing applications. This is a separate island of identity and these users don't appear in the organization's Microsoft Entra tenant. Azure AD B2C is managed by administrators in the tenant associated with the Azure subscription.

## Next steps

* [Introduction to delegated administration and isolated environments](secure-introduction.md)

* [Azure resource management fundamentals](secure-resource-management.md)

* [Resource isolation in a single tenant](secure-single-tenant.md)

* [Resource isolation with multiple tenants](secure-multiple-tenants.md)

* [Best practices](secure-best-practices.md)
