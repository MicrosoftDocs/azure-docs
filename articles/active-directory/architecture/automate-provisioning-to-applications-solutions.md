---
title: Solutions to automate identity provisioning to applications
description: Learn to design solutions to automatically provision identities based on various scenarios.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: overview
ms.date: 09/29/2022
ms.author: jricketts
ms.custom:
  - it-pro
  - seodec18
  - kr2b-contr-experiment
ms.collection: M365-identity-device-management
---

# Solutions

This article presents solutions that enable you to:

* Connect identities with your system of record
* Synchronize identities between Active Directory Domain Services (AD DS) and Azure Active Directory (Azure AD)
* Automate provisioning of users into non-Microsoft applications  

## Connect identities with your system of record

In most designs, the human resources (HR) system is the source-of-authority for newly created digital identities. The HR system is often the starting point for many provisioning processes. For example, if a new user joins a company, they have a record in the HR system. That user likely needs an account to access Microsoft 365 services such as Teams and SharePoint, or non-Microsoft applications.

### Synchronizing identities with cloud HR

The Azure AD provisioning service enables organizations to [bring identities from popular HR systems](../app-provisioning/what-is-hr-driven-provisioning.md) (examples: [Workday](../saas-apps/workday-inbound-tutorial.md) and [SuccessFactors](../saas-apps/sap-successfactors-inbound-provisioning-cloud-only-tutorial.md)), into Azure AD directly, or into AD DS. This provisioning capability enables new hires to access the resources they need from the first day of work.

### On-premises HR + joining multiple data sources

To create a full user profile for an employee identity, organizations often merge information from multiple HR systems, databases, and other user data stores. MIM provides a rich set of [connectors](/microsoft-identity-manager/supported-management-agents) and integration solutions interoperating with heterogeneous platforms both on-premises and in the cloud.

MIM offers [rule extension](/previous-versions/windows/desktop/forefront-2010/ms698810(v=vs.100)?redirectedfrom=MSDN) and [workflow capabilities](https://microsoft.github.io/MIMWAL/) features for advanced scenarios requiring data transformation and consolidation from multiple sources. These connectors, rule extensions, and workflow capabilities enable organizations to aggregate user data in the MIM metaverse to form a single identity for each user. The identity can be [provisioned into downstream systems](/microsoft-identity-manager/microsoft-identity-manager-2016-supported-platforms) such as AD DS.

![Systems of record model](media/automate-user-provisioning-to-applications-solutions/system-of-record.png)

## Synchronize identities between Active Directory Domain Services (AD DS) and Azure AD

As customers move applications to the cloud, and integrate with Azure AD, users often need accounts in Azure AD, and AD to access the applications for their work. Here are five common scenarios in which objects need to be synchronized between AD and Azure AD.

The scenarios are divided by the direction of synchronization needed, and are listed, one through five. Use the table following the scenarios to determine what technical solution provides the synchronization.

Use the numbered sections in the next two section to cross reference the following table.

**Synchronize identities from AD DS into Azure AD**

1. For users in AD that need access to Office 365 or other applications that are connected to Azure AD, Azure AD Connect cloud sync is the first solution to explore. It provides a lightweight solution to create users in Azure AD, manage password rests, and synchronize groups. Configuration and management are primarily done in the cloud, minimizing your on-premises footprint. It provides high-availability and automatic failover, ensuring password resets and synchronization continue, even if there's an issue with on-premises servers.

1. For complex, large-scale AD to Azure AD sync needs such as synchronizing groups over 50,000 and device sync, customers can use Azure AD Connect sync to meet their needs.

**Synchronize identities from Azure AD into AD DS**

As customers transition identity management to the cloud, more users and groups are created directly in Azure AD. However, they still need a presence on-premises in AD DS to access various resources.

3. When an external user from a partner organization is created in Azure AD using B2B, MIM can automatically provision them [into AD DS](/microsoft-identity-manager/microsoft-identity-manager-2016-graph-b2b-scenario) and give those guests access to [on-premises Windows-Integrated Authentication or Kerberos-based applications](../external-identities/hybrid-cloud-to-on-premises.md). Alternatively, customers can user [PowerShell scripts](https://github.com/Azure-Samples/B2B-to-AD-Sync) to automate the creation of guest accounts on-premises. 

1. When a group is created in Azure AD, it can be automatically synchronized to AD DS using [Azure AD Connect sync](../hybrid/how-to-connect-group-writeback-v2.md).

1. When users need access to cloud apps that still rely on legacy access protocols (for example, LDAP and Kerberos/NTLM), [Azure AD Domain Services](https://azure.microsoft.com/services/active-directory-ds/) synchronizes identities between Azure AD and a managed AD domain.

|No.| What | From | To | Technology |
| - | - | - | - | - |
| 1 |Users, groups| AD DS| Azure AD| [Azure AD Connect Cloud Sync](../cloud-sync/what-is-cloud-sync.md) |
| 2 |Users, groups, devices| AD DS| Azure AD| [Azure AD Connect Sync](../hybrid/whatis-azure-ad-connect.md) |
| 3 |Groups| Azure AD| AD DS| [Azure AD Connect Sync](../hybrid/how-to-connect-group-writeback-v2.md) |
| 4 |Guest accounts| Azure AD| AD DS| [MIM](/microsoft-identity-manager/microsoft-identity-manager-2016-graph-b2b-scenario), [PowerShell](https://github.com/Azure-Samples/B2B-to-AD-Sync)|
| 5 |Users, groups| Azure AD| Managed AD| [Azure AD Domain Services](https://azure.microsoft.com/services/active-directory-ds/) |

The table depicts common scenarios and the recommended technology.

## Automate provisioning users into non-Microsoft applications

After identities are in Azure AD through HR-provisioning or Azure AD Connect cloud sync / Azure AD Connect sync, the employee can use the identity to access Teams, SharePoint, and Microsoft 365 applications. However, employees still need access to many Microsoft applications to perform their work.

![Automation decision matrix](media/automate-user-provisioning-to-applications-solutions/automate-provisioning-decision-matrix.png)

### Automate provisioning to apps and clouds that support the SCIM standard

Azure AD supports the System for Cross-Domain Identity Management ([SCIM 2.0](https://aka.ms/scimoverview)) standard and integrates with hundreds of popular SaaS applications such as [Dropbox](../saas-apps/dropboxforbusiness-provisioning-tutorial.md) and [Atlassian](../saas-apps/atlassian-cloud-provisioning-tutorial.md) or other clouds such as [Amazon Web Services (AWS)](../saas-apps/aws-single-sign-on-provisioning-tutorial.md), [Google Cloud](../saas-apps/g-suite-provisioning-tutorial.md). Application developers can use the System for Cross-Domain Identity Management (SCIM) user management API to automate provisioning users and groups between Azure AD and your application.

![SCIM standard](media/automate-user-provisioning-to-applications-solutions/automate-provisioning-scim-standard.png)

In addition to the pre-integrated gallery applications, Azure AD supports provisioning to SCIM enabled line of business applications, whether hosted [on-premises](../app-provisioning/on-premises-scim-provisioning.md) or in the cloud. The Azure AD provisioning service creates users and groups in these applications, and manages updates such as when a user is promoted or leaves the company).

[Learn more about provisioning to SCIM enabled applications](../app-provisioning/use-scim-to-provision-users-and-groups.md)

### Automate provisioning to SQL and LDAP based applications

 Many applications don't support the SCIM standard, and customers have historically used connectors developed for MIM to connect to them. The Azure AD provisioning service supports reusing connectors developed for MIM and provisioning users into applications that rely on an LDAP user store or a SQL database.

[Learn more about on-premises application provisioning](../app-provisioning/user-provisioning.md)

### Use integrations developed by partners

Many applications may not yet support SCIM or rely on SQL / LDAP databases. Microsoft partners have developed SCIM gateways that allow you to synchronize users between Azure AD and various systems such as mainframes, HR systems, and legacy databases. In the image below, the SCIM Gateways are built and managed by partners.

![Agent with SCIM gateway](media/automate-user-provisioning-to-applications-solutions/provisioning-agent-with-scim-gateway.png)

[Learn more about partner driven integrations](../app-provisioning/partner-driven-integrations.md)

### Manage local app passwords

Many applications have a local authentication store and a UI that only checks the user’s supplied credentials against that store. As a result, these applications can't support Multi Factor Authentication (MFA) through Azure AD and pose a security risk. Microsoft recommends enabling single sign-on and MFA for all your applications. Based on our studies, your account is more than 99.9% less likely to be compromised if you [use MFA](https://aka.ms/securitysteps). However, in cases where the application can’t externalize authentication, customers can use MIM to sync password changes to these applications.

![Provision access from org data](media/automate-user-provisioning-to-applications-solutions/provision-access-based-on-org-data.png)

[Learn more about the MIM password change notification service](/microsoft-identity-manager/infrastructure/mim2016-password-management) 

### Define and provision access for a user based on organizational data

MIM enables you to import organizational data such as job codes and locations. That information can then be used to automatically set up access rights for that user.

![Manage local app passwords](media/automate-user-provisioning-to-applications-solutions/manage-local-app-passwords.png)

### Automate common business workflows

After users are provisioned into Azure AD, use Lifecycle Workflows (LCW) to automate appropriate actions at key moments in a user’s lifecycle such as joiner, mover, and leaver. These custom workflows can be triggered by Azure AD LCW automatically, or on demand to enable or disable accounts, generate Temporary Access Passes, update Teams and/or group membership, send automated emails, and trigger a Logic App. This can help organizations ensure:

* **Joiner**: When a user joins the organization, they're ready to go on day one. They have the correct access to the information and applications they need. They have the required hardware necessary to do their job.

* **Leaver**: When users leave the company for various reasons (termination, separation, leave of absence or retirement), have their access revoked in a timely manner.

[Learn more about Azure AD Lifecycle Workflows](../governance/what-are-lifecycle-workflows.md)

> [!Note]
> For scenarios not covered by LCW, customers can leverage the extensibility of [Logic Applications](../..//logic-apps/logic-apps-overview.md).

### Reconcile changes made directly in the target system

Organizations often need a complete audit trail of what users have access to applications containing data subject to regulation. To provide an audit trail, any access provided to a user directly must be traceable through the system of record. MIM provides the reconciliation capabilities to detect changes made directly in a target system and roll back the changes. In addition to detecting changes in target applications, MIM can import identities from third party applications to Azure AD. These applications often augment the set of user records that originated in the HR system.

### Next steps

1. Automate provisioning with any of your applications that are in the [Azure AD app gallery](../saas-apps/tutorial-list.md), support [SCIM](../app-provisioning/use-scim-to-provision-users-and-groups.md), [SQL](../app-provisioning/on-premises-sql-connector-configure.md), or [LDAP](../app-provisioning/on-premises-ldap-connector-configure.md).
2. Evaluate [Azure AD Cloud Sync](../cloud-sync/what-is-cloud-sync.md) for synchronization between AD DS and Azure AD
3. Use the [Microsoft Identity Manager](/microsoft-identity-manager/microsoft-identity-manager-2016) for complex provisioning scenarios