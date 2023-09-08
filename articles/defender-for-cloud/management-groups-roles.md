---
title: Organize subscriptions into management groups and assign roles to users
description: Learn how to organize your Azure subscriptions into management groups in Microsoft Defender for Cloud and assign roles to users in your organization
ms.topic: how-to
ms.date: 01/24/2023
ms.custom: subject-rbac-steps
---

# Organize subscriptions into management groups and assign roles to users

Manage your organization’s security posture at scale by applying security policies to all Azure subscriptions linked to your Azure Active Directory tenant.

For visibility into the security posture of all subscriptions linked to an Azure AD tenant, you'll need an Azure role with sufficient read permissions assigned on the root management group.

## Organize your subscriptions into management groups

### Overview of management groups

Use management groups to efficiently manage access, policies, and reporting on groups of subscriptions, and effectively manage the entire Azure estate by performing actions on the root management group. You can organize subscriptions into management groups and apply your governance policies to the management groups. All subscriptions within a management group automatically inherit the policies applied to the management group. 

Each Azure AD tenant is given a single top-level management group called the root management group. This root management group is built into the hierarchy to have all management groups and subscriptions fold up to it. This group allows global policies and Azure role assignments to be applied at the directory level. 

The root management group is created automatically when you do any of the following actions: 
- In the [Azure portal](https://portal.azure.com), select **Management Groups** .
- Create a management group with an API call.
- Create a management group with PowerShell. For PowerShell instructions, see [Create management groups for resource and organization management](../governance/management-groups/create-management-group-portal.md).

Management groups aren't required to onboard Defender for Cloud, but we recommend creating at least one so that the root management group gets created. After the group is created, all subscriptions under your Azure AD tenant will be linked to it. 

For a detailed overview of management groups, see the [Organize your resources with Azure management groups](../governance/management-groups/overview.md) article.

### View and create management groups in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Management Groups**.

1. To create a management group, select **Create**, enter the relevant details, and select **Submit**.

    :::image type="content" source="media/management-groups-roles/add-management-group.png" alt-text="Adding a management group to Azure.":::

    - The **Management Group ID** is the directory unique identifier that is used to submit commands on this management group. This identifier isn't editable after creation as it is used throughout the Azure system to identify this group. 
    
    - The display name field is the name that is displayed within the Azure portal. A separate display name is an optional field when creating the management group and can be changed at any time.  

### Add subscriptions to a management group

You can add subscriptions to the management group that you created.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Management Groups**.

1. Select the management group for your subscription.

1. When the group's page opens, select **Subscriptions**.

1. From the subscriptions page, select **Add**, then select your subscriptions and select **Save**. Repeat until you've added all the subscriptions in the scope.

    :::image type="content" source="./media/management-groups-roles/management-group-add-subscriptions.png" alt-text="Adding a subscription to a management group.":::

   > [!IMPORTANT]
   > Management groups can contain both subscriptions and child management  groups. When you assign a user an Azure role to the parent management group, the access is inherited by the child management group's subscriptions. Policies set at the parent management group are also inherited by the children. 

## Assign Azure roles to other users

### Assign Azure roles to users through the Azure portal: 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Management Groups**.

1.  Select the relevant management group.

1. Select **Access control (IAM)**, open the **Role assignments** tab and select **Add** > **Add role assignment**.

    :::image type="content" source="./media/management-groups-roles/add-user.png" alt-text="Adding a user to a management group.":::

1. From the **Add role assignment** page, select the relevant role.

    :::image type="content" source="./media/management-groups-roles/add-role-assignment-page.png" alt-text="Add role assignment page.":::

1. From the **Members** tab, select **+ Select members** and assign the role to the relevant members.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.


### Assign Azure roles to users with PowerShell: 

1. Install [Azure PowerShell](/powershell/azure/install-azure-powershell).
2. Run the following commands: 

    ```azurepowershell
    # Login to Azure as a Global Administrator user
    Connect-AzAccount
    ```

3. When prompted, sign in with global admin credentials. 

    ![Sign in prompt screenshot.](./media/management-groups-roles/azurerm-sign-in.PNG)

4. Grant reader role permissions by running the following command:

    ```azurepowershell
    # Add Reader role to the required user on the Root Management Group
    # Replace "user@domian.com” with the user to grant access to
    New-AzRoleAssignment -SignInName "user@domain.com" -RoleDefinitionName "Reader" -Scope "/"
    ```
5. To remove the role, use the following command: 

    ```azurepowershell
    Remove-AzRoleAssignment -SignInName "user@domain.com" -RoleDefinitionName "Reader" -Scope "/" 
    ```

## Remove elevated access 

Once the Azure roles have been assigned to the users, the tenant administrator should remove itself from the user access administrator role.

1. Sign in to the [Azure portal](https://portal.azure.com) or the [Azure Active Directory admin center](https://aad.portal.azure.com).

2. In the navigation list, select **Azure Active Directory** and then select **Properties**.

3. Under **Access management for Azure resources**, set the switch to **No**.

4. To save your setting, select **Save**.

## Next steps

On this page, you learned how to organize subscriptions into management groups and assign roles to users. For related information, see:

- [Permissions in Microsoft Defender for Cloud](permissions.md)
