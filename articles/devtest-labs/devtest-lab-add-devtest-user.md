---
title: Add owners and users
description: Add owners and users in Azure DevTest Labs using either the Azure portal or PowerShell
ms.topic: how-to
ms.date: 06/26/2020 
ms.custom: devx-track-azurepowershell
---

# Add owners and users in Azure DevTest Labs

Access in Azure DevTest Labs is controlled by [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md). Using Azure RBAC, you can segregate duties within your team into *roles* where you grant only the amount of access necessary to users to perform their jobs. Three of these Azure roles are *Owner*, *DevTest Labs User*, and *Contributor*. In this article, you learn what actions can be performed in each of the three main Azure roles. From there, you learn how to add users to a lab - both via the portal and via a PowerShell script, and how to add users at the subscription level.

## Actions that can be performed in each role
There are three main roles that you can assign a user:

* Owner
* DevTest Labs User
* Contributor

The following table illustrates the actions that can be performed by users in each of these roles:

| **Actions users in this role can perform** | **DevTest Labs User** | **Owner** | **Contributor** |
| --- | --- | --- | --- |
| **Lab tasks** | | | |
| Add users to a lab |No |Yes |No |
| Update cost settings |No |Yes |Yes |
| **VM base tasks** | | | |
| Add and remove custom images |No |Yes |Yes |
| Add, update, and delete formulas |Yes |Yes |Yes |
| Enable Marketplace images |No |Yes |Yes |
| **VM tasks** | | | |
| Create VMs |Yes |Yes |Yes |
| Start, stop, and delete VMs |Only VMs created by the user |Yes |Yes |
| Update VM policies |No |Yes |Yes |
| Add/remove data disks to/from VMs |Only VMs created by the user |Yes |Yes |
| **Artifact tasks** | | | |
| Add and remove artifact repositories |No |Yes |Yes |
| Apply artifacts |Yes |Yes |Yes |

> [!NOTE]
> When a user creates a VM, that user is automatically assigned to the **Owner** role of the created VM.
> 
> 

## Add an owner or user at the lab level
Owners and users can be added at the lab level via the Azure portal. 
A user can be an external user with a valid [Microsoft account (MSA)](./devtest-lab-faq.yml).
The following steps guide you through the process of adding an owner or user to a lab in Azure DevTest Labs:

1. Sign in to the [Azure portal](https://portal.azure.com) as [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../role-based-access-control/built-in-roles.md#owner).

1. Open the desired resource group and select **DevTest Labs**.

1. In the navigation menu, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

    ![Access control (IAM) page with Add role assignment menu open.](../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

1. On the **Role** tab, select the **OWNER** or **USER** role.

    ![Add role assignment page with Role tab selected.](../../includes/role-based-access-control/media/add-role-assignment-role-generic.png)

1. On the **Members** tab, select the user you want to give the desired role to.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.


## Add an external user to a lab using PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

In addition to adding users in the Azure portal, you can add an external user to your lab using a PowerShell script. 
In the following example, modify the parameter values under the **Values to change** comment.
You can retrieve the `subscriptionId`, `labResourceGroup`, and `labName` values from the lab blade in the Azure portal.

> [!NOTE]
> The sample script assumes that the specified user has been added as a guest to the Active Directory, and will fail if that is not the case. To add a user not in the Active Directory to a lab, use the Azure portal to assign the user to a role as illustrated in the section, [Add an owner or user at the lab level](#add-an-owner-or-user-at-the-lab-level).   
> 
> 

```azurepowershell
# Add an external user in DevTest Labs user role to a lab
# Ensure that guest users can be added to the Azure Active directory:
# https://azure.microsoft.com/documentation/articles/active-directory-create-users/#set-guest-user-access-policies

# Values to change
$subscriptionId = "<Enter Azure subscription ID here>"
$labResourceGroup = "<Enter lab's resource name here>"
$labName = "<Enter lab name here>"
$userDisplayName = "<Enter user's display name here>"

# Log into your Azure account
Connect-AzAccount

# Select the Azure subscription that contains the lab. 
# This step is optional if you have only one subscription.
Select-AzSubscription -SubscriptionId $subscriptionId

# Retrieve the user object
$adObject = Get-AzADUser -SearchString $userDisplayName

# Create the role assignment. 
$labId = ('subscriptions/' + $subscriptionId + '/resourceGroups/' + $labResourceGroup + '/providers/Microsoft.DevTestLab/labs/' + $labName)
New-AzRoleAssignment -ObjectId $adObject.Id -RoleDefinitionName 'DevTest Labs User' -Scope $labId
```

## Add an owner or user at the subscription level
Azure permissions are propagated from parent scope to child scope in Azure. Therefore, owners of an Azure subscription that contains labs are automatically owners of those labs. They also own the VMs and other resources created by the lab's users, and the Azure DevTest Labs service. 

You can add additional owners to a lab via the lab's blade in the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040). 
However, the added owner's scope of administration is more narrow than the subscription owner's scope. 
For example, the added owners do not have full access to some of the resources that are created in the subscription by the DevTest Labs service. 

To add an owner to an Azure subscription, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../role-based-access-control/built-in-roles.md#owner).

1. Open the desired Subscription group.

1. In the navigation menu, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

    ![Access control (IAM) page with Add role assignment menu open.](../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

1. On the **Role** tab, select the **OWNER** role.

    ![Add role assignment page with Role tab selected.](../../includes/role-based-access-control/media/add-role-assignment-role-generic.png)

1. On the **Members** tab, select the user you want to give the owner role to.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.


[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]
