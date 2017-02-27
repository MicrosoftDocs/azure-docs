---

  title: What is group-based licensing in Azure Active Directory? | Microsoft Docs
  description: Description of Azure Active Directory group-based licensing, how it works, how to get started, and best practices
  services: active-directory
  keywords: Azure AD licensing
  documentationcenter: ''
  author: curtand
  manager: femila
  editor: ''

  ms.assetid:
  ms.service: active-directory
  ms.devlang: na
  ms.topic: article
  ms.tgt_pltfrm: na
  ms.workload: identity
  ms.date: 02/23/2017
  ms.author: curtand

---

# What is group-based licensing in Azure Active Directory?

Microsoft cloud services such as Office 365, Enterprise Mobility + Security, Dynamics CRM, and other similar products require licenses to be assigned to each user who needs access to these services. License management is exposed to administrators via one of the management portals (Office, Azure) and PowerShell cmdlets. License assignment state is stored in Azure Active Directory –- the underlying infrastructure supporting identity management for all Microsoft cloud
services.

Until now, licenses could only be assigned at individual user level, which can make large-scale management difficult for our customers. For example, to add or remove user licenses based on organizational changes, such as users joining or leaving the organization or a department, an administrator often must write a complex PowerShell script to make individual calls to the cloud service.

To address those challenges, we have introduced a new capability of the Azure AD license management system: group-based licensing. It is now possible to assign one or more product licenses to a group. Azure AD will make sure that the licenses are assigned to all members of the group. Any new members joining the group will be assigned the appropriate licenses and when they leave the group those licenses will be removed. This eliminates the need for automating license management via PowerShell to reflect changes in the organization and departmental structure on a per-user basis.

## Features

Here are the main features of group-based licensing capability:

- Licenses can be assigned to any security group in Azure AD. Security groups can be synced from on-premises using Azure AD Connect, created directly in Azure AD (also called cloud-only groups), or created automatically via the Azure AD Dynamic Group feature.

- When a product license is assigned to a group, the administrator may disable one or more service plans in the product. Typically, this is done when the organization is not yet ready to start using a service included in a product, for example the administrator wants to assign Office 365 E3 product to a department but temporarily disable the Yammer Enterprise service.

- All Microsoft cloud services that require user-level licensing are supported. This includes all Office 365 products, Enterprise Mobility + Security, Dynamics CRM, etc.

- Group-based licensing is currently available only through [the Azure portal](https://portal.azure.com). Customers who primarily use other management portals for user and group management, such as the Office 365 portal, can continue to do so, but will need to use the Azure portal to manage licenses at group level.

- Azure AD automatically manages license modifications resulting from group membership changes. Typically, a user joining or leaving a group will have their licenses modified within minutes of the membership change.

- A user may be a member of multiple groups with license policies specified; they may also have some licenses that were directly assigned to the user outside of any groups. The resulting user state is a combination of all assigned product and service licenses.

- In some cases, licenses cannot be assigned to a user; for example, because there are not enough available licenses in the tenant or conflicting services have been assigned at the same time. Administrators have access to information about users for whom Azure AD could not fully process group licenses; they can then take corrective action based on that information.

- During public preview, a paid or trial subscription for Azure AD Basic or higher is required in the tenant to use group-based license management. Also, every user inheriting any licenses from groups must have the paid Azure AD edition license assigned to them.

## Next steps

To learn more about other scenarios for license management through group-based licensing, read

* [Assigning licenses to a group in Azure Active Directory](active-directory-licensing-group-assignment-azure-portal.md)
* [Identifying and resolving license problems for a group in Azure Active Directory](active-directory-licensing-group-problem-resolution-azure-portal.md)
* [How to migrate individual licensed users to group-based licensing in Azure Active Directory](active-directory-licensing-group-migration-azure-portal.md)
* [Azure Active Directory group-based licensing additional scenarios](active-directory-licensing-group-advanced.md)
