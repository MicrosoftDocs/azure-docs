---
title: Add and configure lab users with role-based access control (RBAC)
description: Learn about the Azure DevTest Labs Owner, Contributor, and DevTest Labs User roles, and how to add members to lab roles by using the Azure portal or Azure PowerShell.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/26/2025
ms.custom: devx-track-azurepowershell, UpdateFrequency2

#customer intent: As a lab owner, I want to add and configure users for my lab so I can grant the access necessary to do specific lab tasks.
---

# Add and configure lab users in Azure DevTest Labs

Azure DevTest Labs has three built-in roles: **Owner**, **Contributor**, and **DevTest Labs User**, that define the access necessary to do specific lab tasks. Lab owners use Azure [role-based access control](/azure/role-based-access-control/overview) (RBAC) to add lab users with assigned roles. This article lists the tasks each role can do, and describes how Lab Owners can add members to lab roles by using the Azure portal or an Azure PowerShell script.

<a name="devtest-labs-user"></a>
## Owners, Contributors, and DevTest Labs Users

The following table shows the actions that the DevTest Labs **Owner**, **Contributor**, and **DevTest Labs User** roles can take.

|Action|Owner|Contributor|DevTest Labs User|
|------|-----|-----------|----------------|
|**Lab tasks**||||
|Create labs.|X|X||
|Add users to labs.|X|||
|Configure user settings and roles.|X|||
|Update lab virtual machine (VM) policies.|X|X||
|Update cost settings.|X|X||
|**VM base tasks**||||
|Enable Marketplace images.|X|X||
|Add, update, and delete VM base formulas.|X|X|X|
|Add and remove custom images.|X|X||
|Add, update, and delete formulas.|X|X||
|**Individual VM tasks**||||
|Create VMs.|X|X|X|
|Start, stop, or delete owned VMs.|X|X|X|
|Add or remove VM data disks.|X|X|X|
|**Artifact and template tasks**||||
|Add and remove lab artifact and template repositories.|X|X||
|Create artifacts and templates.|X|X|X|
|Apply artifacts to owned VMs.|X|X|X|

> [!NOTE]
> Lab users automatically have the **Owner** role on VMs they create.

### Lab Owner role

Azure permissions propagate from parent scope to child scope. Owners of an Azure subscription that contains labs are automatically **Owner**s of the subscription's labs.

Azure subscription [Owners](/azure/role-based-access-control/built-in-roles/privileged#owner) and [User Access Administrators](/azure/role-based-access-control/built-in-roles/privileged#user-access-administrator) can add and assign DevTest Labs **Owner**s, **Contributor**s, and **DevTest Labs Users** to labs in their subscriptions. Azure subscription [Contributors](/azure/role-based-access-control/built-in-roles/privileged#contributor) can create labs, but they're **Owners** of those labs only if a subscription Owner or User Access Administrator assigns them the lab **Owner** role.

Lab users that are granted the **Owner** role can add and assign **Owner**s, **Contributor**s, and **DevTest Labs User**s for their own labs. However, added lab owners have a narrower scope of administration than Azure subscription-based owners. Added owners don't have full access to some resources that the DevTest Labs service creates.

## Prerequisites

# [Azure portal](#tab/portal)

- You must be a lab **Owner**, either by assignment from a subscription owner or by inheritance as a subscription owner.
- The user to be added must have a valid [Microsoft account](/windows-server/identity/ad-ds/manage/understand-microsoft-accounts). They don't need an Azure subscription.

# [Azure PowerShell](#tab/PowerShell)

- You must be a lab **Owner**, either by assignment from a subscription owner or by inheritance as a subscription owner.
- The user to add must have a valid [Microsoft account](/windows-server/identity/ad-ds/manage/understand-microsoft-accounts). They don't need an Azure subscription.
- This PowerShell script requires the added user to be in the Microsoft Entra ID. You can add an external user to Microsoft Entra ID as a guest. For more information, see [Add a new guest user](/entra/fundamentals/how-to-create-delete-users#invite-an-external-user). If you can't add the user to Microsoft Entra ID, use the portal procedure instead.
- You need access to Azure PowerShell. You can either:
  - [Use Azure Cloud Shell](/azure/cloud-shell/quickstart). Be sure to select the **PowerShell** environment in Cloud Shell.
  - [Install Azure PowerShell](/powershell/azure/install-azure-powershell) to use on a physical or virtual machine. If necessary, run `Update-Module -Name Az` to update your installation.

---

## Add a user to a lab

Lab Owners can add members to lab roles by using the Azure portal or an Azure PowerShell script.

# [Azure portal](#tab/portal)

The following procedure adds a user to a lab with **DevTest Labs User** role. If you're an owner of the Azure subscription the lab is in, you can also do this procedure from the subscription's **Access control (IAM)** page.

1. On the lab's home page, select **Configuration and policies** from the left navigation.
1. On the **Configuration and policies** page, select **Access control (IAM)** from the left navigation.
1. Select **Add** > **Add role assignment** or select the **Add role assignment** button.

   :::image type="content" source="media/devtest-lab-add-devtest-user/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows an access control (IAM) page with the role assignment menu open.":::

1. On the **Add role assignment** page, search for and select the **DevTest Labs User** role, and then select **Next**.

   :::image type="content" source="media/devtest-lab-add-devtest-user/add-role-assignment-role-generic.png" alt-text="Screenshot that shows the role assignment page with the DevTest Labs User role selected.":::

1. On the **Members** tab, select **Select members**.
1. On the **Select members** screen, search for and select the members you want to add, and then select **Select**.
1. Select **Review + assign**, and after reviewing the details, select **Review + assign** again to add the members.

# [Azure PowerShell](#tab/PowerShell)
<a name="add-an-external-user-to-a-lab-using-powershell"></a>

The following PowerShell script adds a user to a lab with **DevTest Labs User** role. To use the script, replace the parameter values under the `# Values to change` comment with your own values. You can get the `subscriptionId`, `labResourceGroup`, and `labName` values from the lab's main page in the Azure portal.

```azurepowershell
# Values to change
$subscriptionId = "<Azure subscription ID>"
$labResourceGroup = "<Lab resource group name>"
$labName = "<Lab name>"
$userDisplayName = "<User display name>"

# Sign into your Azure account.
Connect-AzAccount

# Select the Azure subscription that contains the lab. This step is optional if you have only one subscription.
Select-AzSubscription -SubscriptionId $subscriptionId

# Get the user object.
$adObject = Get-AzADUser -SearchString $userDisplayName

# Create the role assignment. 
$labId = ('/subscriptions/' + $subscriptionId + '/resourceGroups/' + $labResourceGroup + '/providers/Microsoft.DevTestLab/labs/' + $labName)
New-AzRoleAssignment -ObjectId $adObject.Id -RoleDefinitionName 'DevTest Labs User' -Scope $labId
```

---

## Related content

- [Customize permissions with custom roles](devtest-lab-grant-user-permissions-to-specific-lab-policies.md)
- [Automate adding lab users](automate-add-lab-user.md)
