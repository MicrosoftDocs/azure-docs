<properties
	pageTitle="Role-Based Access Control | Microsoft Azure"
	description="Get started in access management with Azure role-based access control in the Azure Portal. Use role assignments to assign permissions in your directory."
	services="active-directory"
	documentationCenter=""
	authors="kgremban"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="identity"
	ms.date="08/03/2016"
	ms.author="kgremban"/>

# Get started with access management in the Azure portal

Security-oriented companies are concerned about giving employees the exact amount of permissions they need. Too many permissions means that an account is unnecessarily exposed to attackers. Too few permissions means that employees can't get their work done efficiently. Azure Role-Based Access Control (RBAC) helps address this problem by offering fine-grained access management for Azure.

Using RBAC, you can segregate duties within your team and grant only the amount of access to users that they need to perform their jobs. Instead of giving everybody unrestricted permissions in your Azure subscription or resources, you can specify what actions they are allowed to take in that scope. For example, you can use RBAC to give one employee access to all the virtual machines in the subscription, while another can manage all the SQL databases within the same subscription.

## Basics of access management in Azure
Each Azure subscription is associated with one Azure Active Directory (AD) directory. Users, groups, and applications from that directory can manage resources in the Azure subscription. These access rights are granted using the Azure portal, Azure command-line tools, and Azure Management APIs.

Access is granted by assigning the appropriate RBAC role to users, groups, and applications at a certain scope. The scope of a role assignment can be a subscription, a resource group, or a single resource. A role assigned at a parent scope also grants access to the children contained within it. For example, a user with access to a resource group can manage all the resources it contains, like websites, virtual machines, and subnets.

![Relationship between Azure Active Directory elements - diagram](./media/role-based-access-control-what-is/rbac_aad.png)

The RBAC role that you assign dictates what resources the user, group, or application can manage within that scope.

## Built-in roles
Azure RBAC has three basic roles that apply to all resource types:

- **Owner** has full access to all resources including the right to delegate access to others.
- **Contributor** can create and manage all types of Azure resources but can’t grant access to others.
- **Reader** can view existing Azure resources.

The rest of the RBAC roles in Azure allow management of specific Azure resources. For example, the Virtual Machine Contributor role allows the user to create and manage virtual machines. It does not give them access to the virtual network or the subnet that the virtual machine connects to.

[RBAC built-in roles](role-based-access-built-in-roles.md) lists the roles available in Azure. It specifies the operations and scope that each built-in role grants to users. If you're looking to define your own roles for even more control, see how to build [Custom roles in Azure RBAC](role-based-access-control-custom-roles.md).

## Resource hierarchy and access inheritance
- Each **subscription** in Azure belongs to only one directory.
- Each **resource group** belongs to only one subscription.
- Each **resource** belongs to only one resource group.

Access that you grant at parent scopes is inherited at child scopes. For example:

- You assign the Reader role to an Azure AD group at the subscription scope. The members of that group can view every resource group and resource in the subscription.
- You assign the Contributor role to an application at the resource group scope. It can manage resources of all types in that resource group, but not other resource groups in the subscription.

## Azure RBAC vs. classic subscription administrators
Classic subscription administrators and co-admins have full access to the Azure subscription. They can manage resources using the [Azure portal](https://portal.azure.com) with Azure Resource Manager APIs, or the [Azure classic portal](https://manage.windowsazure.com) and Azure Service Management APIs. In the RBAC model, classic administrators are assigned the Owner role at the subscription scope.

Only the Azure portal and the new Azure Resource Manager APIs support Azure RBAC. Users and applications that are assigned RBAC roles cannot use the classic management portal and the Azure Service Management APIs.

## Authorization for management vs. data operations
Azure RBAC only supports management operations of the Azure resources in the Azure portal and Azure Resource Manager APIs. Not all data level operations for Azure resources can be authorized via RBAC. For example, Storage Accounts can be managed with RBAC, but the blobs or tables within a Storage Account cannot. Similarly, a SQL database can be managed, but not the tables within it.

## Next Steps
- Get started with [Role-Based Access Control in the Azure portal](role-based-access-control-configure.md).
- See the [RBAC built-in roles](role-based-access-built-in-roles.md)
- Define your own [Custom roles in Azure RBAC](role-based-access-control-custom-roles.md)
