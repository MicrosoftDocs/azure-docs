---
title: Hybrid identity design - lifecycle adoption strategy Azure | Microsoft Docs
description: Helps define the hybrid identity management tasks according to the options available for each lifecycle phase.
documentationcenter: ''
services: active-directory
author: billmath
manager: mtillman
editor: ''
ms.assetid: 420b6046-bd9b-4fce-83b0-72625878ae71
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/30/2018
ms.component: hybrid
ms.author: billmath
ms.custom: seohack1
---
# Determine hybrid identity lifecycle adoption strategy
In this task, you’ll define the identity management strategy for your hybrid identity solution to meet the business requirements that you defined in [Determine hybrid identity management tasks](plan-hybrid-identity-design-considerations-hybrid-id-management-tasks.md).

To define the hybrid identity management tasks according to the end-to-end identity lifecycle presented earlier in this step, you will have to consider the options available for each lifecycle phase.

## Access management and provisioning
With a good account access management solution, your organization can track precisely who has access to what information across the organization.

Access control is a critical function of a centralized, single-point provisioning system. Besides protecting sensitive information, access controls expose existing accounts that have unapproved authorizations or are no longer necessary. To control obsolete accounts, the provisioning system links together account information with authoritative information about the users who own the accounts. Authoritative user identity information is typically maintained in the databases and directories of human resources.

Accounts in sophisticated IT enterprises include hundreds of parameters that define the authorities, and these details can be controlled by your provisioning system. New users can be identified with the data that you provide from the authoritative source. The access request approval capability initiates the processes that approve (or reject) resource provisioning for them.

| Lifecycle management phase | On premises | Cloud | Hybrid |
| --- | --- | --- | --- |
| Account Management and Provisioning |By using the Active Directory® Domain Services (AD DS) server role, you can create a scalable, secure, and manageable infrastructure for user and resource management, and provide support for directory-enabled applications such as Microsoft® Exchange Server. <br><br> [You can provision groups in AD DS through an Identity manager](https://technet.microsoft.com/library/ff686261.aspx) <br>[ You can provision users in AD DS](https://technet.microsoft.com/library/ff686263.aspx) <br><br> Administrators can use access control to manage user access to shared resources for security purposes. In Active Directory, access control is administered at the object level by setting different levels of access, or permissions, to objects, such as Full Control, Write, Read, or No Access. Access control in Active Directory defines how different users can use Active Directory objects. By default, permissions on objects in Active Directory are set to the most secure setting. |You have to create an account for every user who will access a Microsoft cloud service. You can also change user accounts or delete them when they’re no longer needed. By default, users do not have administrator permissions, but you can optionally assign them. <br><br> Within Azure Active Directory, one of the major features is the ability to manage access to resources. These resources can be part of the directory, as in the case of permissions to manage objects through roles in the directory, or resources that are external to the directory, such as SaaS applications, Azure services, and SharePoint sites or on-premises resources. <br><br> At the center of Azure Active Directory’s access management solution is the security group. The resource owner (or the administrator of the directory) can assign a group to provide a certain access right to the resources they own. The members of the group will be provided the access, and the resource owner can delegate the right to manage the members list of a group to someone else – such as a department manager or a helpdesk administrator<br> <br> The Managing groups in Azure AD section, provides more information on managing access through groups. |Extend Active Directory identities into the cloud through synchronization and federation |

## Role-based access control
Role-based access control (RBAC) uses roles and provisioning policies to evaluate, test, and enforce your business processes and rules for granting access to users. Key administrators create provisioning policies and assign users to roles and that define sets of entitlements to resources for these roles. RBAC extends the identity management solution to use software-based processes and reduce user manual interaction in the provisioning process.
Azure AD RBAC enables the company to restrict the number of operations that an individual can do once he has access to the Azure portal. By using RBAC to control access to the portal, IT Admins ca delegate access by using the following access management approaches:

* **Group-based role assignment**: You can assign access to Azure AD groups that can be synced from your local Active Directory. This enables you to leverage the existing investments that your organization has made in tooling and processes for managing groups. You can also use the delegated group management feature of Azure AD Premium.
* **Leverage built in roles in Azure**: You can use three roles — Owner, Contributor, and Reader, to ensure that users and groups have permission to do only the tasks they need to do their jobs.
* **Granular access to resources**: You can assign roles to users and groups for a particular subscription, resource group, or an individual Azure resource such as a website or database. In this way, you can ensure that users have access to all the resources they need and no access to resources that they do not need to manage.

## Provisioning and other customization options
Your team can use business plans and requirements to decide how much to customize the identity solution. For example, a large enterprise might require a phased roll-out plan for workflows and custom adapters that is based on a time line for incrementally provisioning applications that are widely used across geographies. Another customization plan might provide for two or more applications to be provisioned across an entire organization, after successful testing. User-application interaction can be customized, and procedures for provisioning resources might be changed to accommodate automated provisioning.

You can deprovision to remove a service or component. For example, deprovisioning an account means that the account is deleted from a resource.

The hybrid model of provisioning resources combines request and role-based approaches, which are both supported by Azure AD. For a subset of employees or managed systems, a business might want to automate access with role-based assignment. A business might also handle all other access requests or exceptions through a request-based model. Some businesses might start with manual assignment, and evolve toward a hybrid model, with an intention of a fully role-based deployment at a future time.

Other companies might find it impractical for business reasons to achieve complete role-based provisioning, and target a hybrid approach as a wanted goal. Still other companies might be satisfied with only request-based provisioning, and not want to invest additional effort to define and manage role-based, automated provisioning policies.

## License management
Group-based license management in Azure AD lets administrators assign users to a security group and Azure AD automatically assigns licenses to all the members of the group. If a user is subsequently added to, or removed from the group, a license will be automatically assigned or removed as appropriate.

You can use groups you synchronize from on-premises AD or manage in Azure AD. Pairing this up with Azure AD premium Self-Service Group Management you can easily delegate license assignment to the appropriate decision makers. You can be assured that problems like license conflicts and missing location data are automatically sorted out.

## Self-regulating user administration
When your organization starts to provision resources across all internal organizations, you implement the self-regulating user administration capability. You can realize the advantages and benefits of provisioning users across organizational boundaries. In this environment, a change in a user's status is automatically reflected in access rights across organization boundaries and geographies. You can reduce provisioning costs and streamline the access and approval processes. The implementation realizes the full potential of implementing role-based access control for end-to-end access management in your organization. You can reduce administrative costs through automated procedures for governing user provisioning. You can improve security by automating security policy enforcement, and streamline and centralize user lifecycle management and resource provisioning for large user populations.

> [!NOTE]
> For more information, see Setting up Azure AD for self service application access management
> 
> 

License-based (Entitlement-based) Azure AD services work by activating a subscription in your Azure AD directory/service tenant. Once the subscription is active the service capabilities can be managed by directory/service administrators and used by licensed users. 

## Integration with other 3rd party providers

Azure Active Directory provides single-sign on and enhanced application access security to thousands of SaaS applications and on-premises web applications. For more information, see [Integrating applications with Azure Active Directory](../develop/quickstart-v1-integrate-apps-with-azure-ad.md)

## Define synchronization management
Integrating your on-premises directories with Azure AD makes your users more productive by providing a common identity for accessing both cloud and on-premises resources. With this integration, users and organizations can take advantage of the following:

* Organizations can provide users with a common hybrid identity across on-premises or cloud-based services leveraging Windows Server Active Directory and then connecting to Azure Active Directory.
* Administrators can provide conditional access based on application resource, device and user identity, network location and multi-factor authentication.
* Users can leverage their common identity through accounts in Azure AD to Office 365, Intune, SaaS apps, and third-party applications.
* Developers can build applications that leverage the common identity model, integrating applications into Active Directory on-premises or Azure for cloud-based applications

The following figure has an example of a high-level view of identity synchronization process.

![Sync](./media/plan-hybrid-identity-design-considerations/identitysync.png)

Identity synchronization process

Review the following table to compare the synchronization options:

| Synchronization Management Option | Advantages | Disadvantages |
| --- | --- | --- |
| Sync-based (through DirSync or AADConnect) |Users, and groups synchronized from on-premises and cloud <br>  **Policy control**: Account policies can be set through Active Directory, which gives the administrator the ability to manage password policies, workstation, restrictions, lock-out controls, and more, without having to perform additional tasks in the cloud.  <br>  **Access control**: Can restrict access to the cloud service so that, the services can be accessed through the corporate environment, through online servers, or both. <br>  Reduced support calls: If users have fewer passwords to remember, they are less likely to forget them. <br>  Security: User identities and information are protected because all of the servers and services used in single sign-on, are mastered and controlled on-premises. <br>  Support for strong authentication: You can use strong authentication (also called two-factor authentication) with the cloud service. However, if you use strong authentication, you must use single sign-on. | |
| Federation-based (through AD FS) |Enabled by Security Token Service (STS). When you configure an STS to provide single sign-on access with a Microsoft cloud service, you will be creating a federated trust between your on-premises STS and the federated domain you’ve specified in your Azure AD tenant. <br> Allows end users to use the same set of credentials to obtain access to multiple resources <br>end users do not have to maintain multiple sets of credentials. Yet, the users have to provide their credentials to each one of the participating resources.,B2B and B2C scenarios supported. |Requires specialized personnel for deployment and maintenance of dedicated on-prem AD FS servers. There are restrictions on the use of strong authentication if you plan to use AD FS for your STS. For more information, see [Configuring Advanced Options for AD FS 2.0](http://go.microsoft.com/fwlink/?linkid=235649). |

> [!NOTE]
> For more information see, [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
> 
> 

## See Also
[Design considerations overview](plan-hybrid-identity-design-considerations-overview.md)

