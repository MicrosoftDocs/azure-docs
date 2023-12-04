---
title: "include file"
description: "include file"
services: event-hubs
author: alexwolfmsft
ms.service: event-hubs
ms.topic: include
ms.date: 10/11/2022
ms.author: alexwolf
ms.custom: include file
---

When developing locally, make sure that the user account that is accessing Azure Event Hubs has the correct permissions. You'll need the **Azure Event Hubs Data Receiver** and **Azure Event Hubs Data Sender** roles to read and write message data. To assign yourself this role, you'll need to be assigned the **User Access Administrator** role, or another role that includes the **Microsoft.Authorization/roleAssignments/write** action. You can assign Azure RBAC roles to a user using the Azure portal, Azure CLI, or Azure PowerShell. Learn more about the available scopes for role assignments on the [scope overview](../articles/role-based-access-control/scope-overview.md) page.

The following example assigns the **Azure Event Hubs Data Sender** and **Azure Event Hubs Data Receiver** roles to your user account. These role grants read and write access to event hub messages.

### [Azure portal](#tab/roles-azure-portal)

1. In the Azure portal, locate your event hub using the main search bar or left navigation.

2. On the event hub overview page, select **Access control (IAM)** from the left-hand menu.

3. On the **Access control (IAM)** page, select the **Role assignments** tab.

4. Select **+ Add** from the top menu and then **Add role assignment** from the resulting drop-down menu.

    :::image type="content" source="../articles/event-hubs/media/event-hubs-passwordless/passwordless-event-hubs-assign-role-small.png" lightbox="../articles/event-hubs/media/event-hubs-passwordless/passwordless-event-hubs-assign-role.png" alt-text="A screenshot showing how to assign a role.":::

5. Use the search box to filter the results to the desired role. For this example, search for *Azure Event Hubs Data Sender* and select the matching result and then choose **Next**.

6. Under **Assign access to**, select **User, group, or service principal**, and then choose **+ Select members**.

7. In the dialog, search for your Microsoft Entra username (usually your *user@domain* email address) and then choose **Select** at the bottom of the dialog.

8. Select **Review + assign** to go to the final page, and then **Review + assign** again to complete the process.

9. Repeat these steps for the **Azure Event Hubs Data Receiver** role to allow the account to send and receive messages.

### [Azure CLI](#tab/roles-azure-cli)

To assign a role at the resource level using the Azure CLI, you first must retrieve the resource ID using the `az eventhubs eventhub show` command. You can filter the output properties using the `--query` parameter.

```azurecli
az eventhubs eventhub show \
    --resource-group '<your-resource-group-name>' \
    --namespace-name '<your-event-hubs-namespace>' \
    --name '<your-event-hub-name>' \
    --query id
```

Copy the output `Id` from the preceding command. You can then assign roles using the [az role](/cli/azure/role) command of the Azure CLI.

```azurecli
az role assignment create --assignee "<user@domain>" \
    --role "Azure Event Hubs Data Receiver" \
    --scope "<your-resource-id>"

az role assignment create --assignee "<user@domain>" \
    --role "Azure Event Hubs Data Sender" \
    --scope "<your-resource-id>"
```

### [PowerShell](#tab/roles-powershell)

To assign a role at the resource level using Azure PowerShell, you first must retrieve the resource ID using the `Get-AzResource` command.

```azurepowershell
Get-AzResource -ResourceGroupName "<yourResourceGroupname>" -Name "<yourEventHubsNamespace>"
```

Copy the `Id` value from the preceding command output. You can then assign roles using the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command in PowerShell.

```azurepowershell
New-AzRoleAssignment -SignInName <user@domain> `
    -RoleDefinitionName "Azure Event Hubs Data Receiver" `
    -Scope <yourEventHubsId>

New-AzRoleAssignment -SignInName <user@domain> `
    -RoleDefinitionName "Azure Event Hubs Data Sender" `
    -Scope <yourEventHubsId>
```

---

> [!IMPORTANT]
> In most cases, it will take a minute or two for the role assignment to propagate in Azure, but in rare cases it may take up to eight minutes. If you receive authentication errors when you first run your code, wait a few moments and try again.
