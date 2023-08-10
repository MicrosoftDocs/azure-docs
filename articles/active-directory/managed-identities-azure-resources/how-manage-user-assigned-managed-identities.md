---
title: Manage user-assigned managed identities
description: Create user-assigned managed identities.
services: active-directory
author: barclayn
manager: amycolannino
editor:
ms.service: active-directory
ms.subservice: msi
ms.topic: how-to
ms.workload: identity
ms.date: 05/10/2023
ms.author: barclayn
ms.custom: devx-track-azurecli, devx-track-linux
zone_pivot_groups: identity-mi-methods
---

# Manage user-assigned managed identities

Managed identities for Azure resources eliminate the need to manage credentials in code. You can use them to get an Azure Active Directory (Azure AD) token for your applications. The applications can use the token when accessing resources that support Azure AD authentication. Azure manages the identity so you don't have to.

There are two types of managed identities: system-assigned and user-assigned. System-assigned managed identities have their lifecycle tied to the resource that created them. User-assigned managed identities can be used on multiple resources. To learn more about managed identities, see [What are managed identities for Azure resources?](overview.md).

::: zone pivot="identity-mi-methods-azp"

In this article, you learn how to create, list, delete, or assign a role to a user-assigned managed identity by using the Azure portal.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.

## Create a user-assigned managed identity

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To create a user-assigned managed identity, your account needs the [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **Managed Identities**. Under **Services**, select **Managed Identities**.
1. Select **Add**, and enter values in the following boxes in the **Create User Assigned Managed Identity** pane:
    - **Subscription**: Choose the subscription to create the user-assigned managed identity under.
    - **Resource group**: Choose a resource group to create the user-assigned managed identity in, or select **Create new** to create a new resource group.
    - **Region**: Choose a region to deploy the user-assigned managed identity, for example, **West US**.
    - **Name**: Enter the name for your user-assigned managed identity, for example, UAI1.

   [!INCLUDE [ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

   :::image type="content" source="media/how-manage-user-assigned-managed-identities/create-user-assigned-managed-identity-portal.png" alt-text="Screenshot that shows the Create User Assigned Managed Identity pane.":::

1. Select **Review + create** to review the changes.
1. Select **Create**.

## List user-assigned managed identities

To list or read a user-assigned managed identity, your account needs to have either [Managed Identity Operator](../../role-based-access-control/built-in-roles.md#managed-identity-operator) or [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignments.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **Managed Identities**. Under **Services**, select **Managed Identities**.
1. A list of the user-assigned managed identities for your subscription is returned. To see the details of a user-assigned managed identity, select its name.
1. You can now view the details about the managed identity as shown in the image.

   :::image type="content" source="media/how-manage-user-assigned-managed-identities/list-user-assigned-managed-identity-portal.png" alt-text="Screenshot that shows the list of user-assigned managed identity.":::

## Delete a user-assigned managed identity

To delete a user-assigned managed identity, your account needs the [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

Deleting a user-assigned identity doesn't remove it from the VM or resource it was assigned to. To remove the user-assigned identity from a VM, see [Remove a user-assigned managed identity from a VM](qs-configure-portal-windows-vm.md#remove-a-user-assigned-managed-identity-from-a-vm).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the user-assigned managed identity, and select **Delete**.
1. Under the confirmation box, select **Yes**.


   :::image type="content" source="media/how-manage-user-assigned-managed-identities/delete-user-assigned-managed-identity-portal.png" alt-text="Screenshot that shows the Delete user-assigned managed identities.":::

## Manage access to user-assigned managed identities

In some environments, administrators choose to limit who can manage user-assigned managed identities. Administrators can implement this limitation using [built-in](../../role-based-access-control/built-in-roles.md#identity) RBAC roles. You can use these roles to grant a user or group in your organization rights over a user-assigned managed identity.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **Managed Identities**. Under **Services**, select **Managed Identities**.
1. A list of the user-assigned managed identities for your subscription is returned. Select the user-assigned managed identity that you want to manage.
1. Select **Access control (IAM)**.
1. Choose **Add role assignment**.

   ![Screenshot that shows the user-assigned managed identity access control screen](media/how-manage-user-assigned-managed-identities/role-assign.png)

1. In the **Add role assignment** pane, choose the role to assign and choose **Next**.
1. Choose who should have the role assigned.

>[!NOTE]
>You can find information on assigning roles to managed identities in [Assign a managed identity access to a resource by using the Azure portal](../../role-based-access-control/role-assignments-portal-managed-identity.md)

::: zone-end

::: zone pivot="identity-mi-methods-azcli"

In this article, you learn how to create, list, delete, or assign a role to a user-assigned managed identity by using the Azure CLI.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). *Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)*.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.


[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

> [!IMPORTANT]
> To modify user permissions when you use an app service principal by using the CLI, you must provide the service principal more permissions in the Azure Active Directory Graph API because portions of the CLI perform GET requests against the Graph API. Otherwise, you might end up receiving an "Insufficient privileges to complete the operation" message. To do this step, go into the **App registration** in Azure AD, select your app, select **API permissions**, and scroll down and select **Azure Active Directory Graph**. From there, select **Application permissions**, and then add the appropriate permissions.

## Create a user-assigned managed identity

To create a user-assigned managed identity, your account needs the [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

Use the [az identity create](/cli/azure/identity#az-identity-create) command to create a user-assigned managed identity. The `-g` parameter specifies the resource group where to create the user-assigned managed identity. The `-n` parameter specifies its name. Replace the `<RESOURCE GROUP>` and `<USER ASSIGNED IDENTITY NAME>` parameter values with your own values.

[!INCLUDE [ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

```azurecli-interactive
az identity create -g <RESOURCE GROUP> -n <USER ASSIGNED IDENTITY NAME>
```
## List user-assigned managed identities

To list or read a user-assigned managed identity, your account needs the [Managed Identity Operator](../../role-based-access-control/built-in-roles.md#managed-identity-operator) or [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

To list user-assigned managed identities, use the [az identity list](/cli/azure/identity#az-identity-list) command. Replace the `<RESOURCE GROUP>` value with your own value.

```azurecli-interactive
az identity list -g <RESOURCE GROUP>
```

In the JSON response, user-assigned managed identities have the `"Microsoft.ManagedIdentity/userAssignedIdentities"` value returned for the key `type`.

`"type": "Microsoft.ManagedIdentity/userAssignedIdentities"`

## Delete a user-assigned managed identity

To delete a user-assigned managed identity, your account needs the [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

To delete a user-assigned managed identity, use the [az identity delete](/cli/azure/identity#az-identity-delete) command. The -n parameter specifies its name. The -g parameter specifies the resource group where the user-assigned managed identity was created. Replace the `<USER ASSIGNED IDENTITY NAME>` and `<RESOURCE GROUP>` parameter values with your own values.

```azurecli-interactive
az identity delete -n <USER ASSIGNED IDENTITY NAME> -g <RESOURCE GROUP>
```
> [!NOTE]
> Deleting a user-assigned managed identity won't remove the reference from any resource it was assigned to. Remove those from a VM or virtual machine scale set by using the `az vm/vmss identity remove` command.

## Next steps

For a full list of Azure CLI identity commands, see [az identity](/cli/azure/identity).

For information on how to assign a user-assigned managed identity to an Azure VM, see [Configure managed identities for Azure resources on an Azure VM using Azure CLI](qs-configure-cli-windows-vm.md#user-assigned-managed-identity).

Learn how to use [workload identity federation for managed identities](../develop/workload-identity-federation.md) to access Azure Active Directory (Azure AD) protected resources without managing secrets.

::: zone-end

::: zone pivot="identity-mi-methods-powershell"

In this article, you learn how to create, list, delete, or assign a role to a user-assigned managed identity by using the PowerShell.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). *Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)*.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.
- To run the example scripts, you have two options:
    - Use [Azure Cloud Shell](../../cloud-shell/overview.md), which you can open by using the **Try It** button in the upper-right corner of code blocks.
    - Run scripts locally with Azure PowerShell, as described in the next section.

In this article, you learn how to create, list, and delete a user-assigned managed identity by using PowerShell.

### Configure Azure PowerShell locally

To use Azure PowerShell locally for this article instead of using Cloud Shell:

1. Install [the latest version of Azure PowerShell](/powershell/azure/install-azure-powershell) if you haven't already.

1. Sign in to Azure.

    ```azurepowershell-interactive
    Connect-AzAccount
    ```

1. Install the [latest version of PowerShellGet](/powershell/gallery/powershellget/install-powershellget).

    ```azurepowershell-interactive
    Install-Module -Name PowerShellGet -AllowPrerelease
    ```

    You might need to `Exit` out of the current PowerShell session after you run this command for the next step.

1. Install the prerelease version of the `Az.ManagedServiceIdentity` module to perform the user-assigned managed identity operations in this article.

    ```azurepowershell-interactive
    Install-Module -Name Az.ManagedServiceIdentity -AllowPrerelease
    ```

## Create a user-assigned managed identity

To create a user-assigned managed identity, your account needs the [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

To create a user-assigned managed identity, use the `New-AzUserAssignedIdentity` command. The `ResourceGroupName` parameter specifies the resource group where to create the user-assigned managed identity. The `-Name` parameter specifies its name. Replace the `<RESOURCE GROUP>` and `<USER ASSIGNED IDENTITY NAME>` parameter values with your own values.

[!INCLUDE [ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

```azurepowershell-interactive
New-AzUserAssignedIdentity -ResourceGroupName <RESOURCEGROUP> -Name <USER ASSIGNED IDENTITY NAME>
```

## List user-assigned managed identities

To list or read a user-assigned managed identity, your account needs the [Managed Identity Operator](../../role-based-access-control/built-in-roles.md#managed-identity-operator) or [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

To list user-assigned managed identities, use the [Get-AzUserAssigned] command. The `-ResourceGroupName` parameter specifies the resource group where the user-assigned managed identity was created. Replace the `<RESOURCE GROUP>` value with your own value.

```azurepowershell-interactive
Get-AzUserAssignedIdentity -ResourceGroupName <RESOURCE GROUP>
```

In the response, user-assigned managed identities have the `"Microsoft.ManagedIdentity/userAssignedIdentities"` value returned for the key `Type`.

`Type :Microsoft.ManagedIdentity/userAssignedIdentities`

## Delete a user-assigned managed identity

To delete a user-assigned managed identity, your account needs the [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

To delete a user-assigned managed identity, use the `Remove-AzUserAssignedIdentity` command. The `-ResourceGroupName` parameter specifies the resource group where the user-assigned identity was created. The `-Name` parameter specifies its name. Replace the `<RESOURCE GROUP>` and the `<USER ASSIGNED IDENTITY NAME>` parameter values with your own values.

```azurepowershell-interactive
Remove-AzUserAssignedIdentity -ResourceGroupName <RESOURCE GROUP> -Name <USER ASSIGNED IDENTITY NAME>
```

> [!NOTE]
> Deleting a user-assigned managed identity won't remove the reference from any resource it was assigned to. Identity assignments must be removed separately.

## Next steps

For a full list and more details of the Azure PowerShell managed identities for Azure resources commands, see [Az.ManagedServiceIdentity](/powershell/module/az.managedserviceidentity#managed_service_identity).

Learn how to use [workload identity federation for managed identities](../develop/workload-identity-federation.md) to access Azure Active Directory (Azure AD) protected resources without managing secrets.
::: zone-end


::: zone pivot="identity-mi-methods-arm"

In this article, you create a user-assigned managed identity by using Azure Resource Manager.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). *Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)*.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.

You can't list and delete a user-assigned managed identity by using a Resource Manager template. See the following articles to create and list a user-assigned managed identity:

- [List user-assigned managed identity](how-to-manage-ua-identity-cli.md#list-user-assigned-managed-identities)
- [Delete user-assigned managed identity](how-to-manage-ua-identity-cli.md#delete-a-user-assigned-managed-identity)

## Template creation and editing

Resource Manager templates help you deploy new or modified resources defined by an Azure resource group. Several options are available for template editing and deployment, both local and portal-based. You can:

- Use a [custom template from Azure Marketplace](../../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template) to create a template from scratch or base it on an existing common or [quickstart template](https://azure.microsoft.com/resources/templates/).
- Derive from an existing resource group by exporting a template. You can export them from either [the original deployment](../../azure-resource-manager/management/manage-resource-groups-portal.md#export-resource-groups-to-templates) or from the [current state of the deployment](../../azure-resource-manager/management/manage-resource-groups-portal.md#export-resource-groups-to-templates).
- Use a local [JSON editor (such as VS Code)](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md), and then upload and deploy by using PowerShell or the Azure CLI.
- Use the Visual Studio [Azure Resource Group project](../../azure-resource-manager/templates/create-visual-studio-deployment-project.md) to create and deploy a template.

## Create a user-assigned managed identity

To create a user-assigned managed identity, your account needs the [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

To create a user-assigned managed identity, use the following template. Replace the `<USER ASSIGNED IDENTITY NAME>` value with your own values.

[!INCLUDE [ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "resourceName": {
          "type": "string",
          "metadata": {
            "description": "<USER ASSIGNED IDENTITY NAME>"
          }
        }
  },
  "resources": [
    {
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
      "name": "[parameters('resourceName')]",
      "apiVersion": "2018-11-30",
      "location": "[resourceGroup().location]"
    }
  ],
  "outputs": {
      "identityName": {
          "type": "string",
          "value": "[parameters('resourceName')]"
      }
  }
}
```
## Next steps

To assign a user-assigned managed identity to an Azure VM using a Resource Manager template, see [Configure managed identities for Azure resources on an Azure VM using a template](qs-configure-template-windows-vm.md).

Learn how to use [workload identity federation for managed identities](../develop/workload-identity-federation.md) to access Azure Active Directory (Azure AD) protected resources without managing secrets.
::: zone-end


::: zone pivot="identity-mi-methods-rest"

In this article, you learn how to create, list, and delete a user-assigned managed identity by using REST.


## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). *Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)*.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.
- You can run all the commands in this article either in the cloud or locally:
    - To run in the cloud, use [Azure Cloud Shell](../../cloud-shell/overview.md).
    - To run locally, install [curl](https://curl.haxx.se/download.html) and the [Azure CLI](/cli/azure/install-azure-cli).


In this article, you learn how to create, list, and delete a user-assigned managed identity by using CURL to make REST API calls.

## Obtain a bearer access token

1. If you're running locally, sign in to Azure through the Azure CLI.

    ```azurecli-interactive
    az login
    ```

1. Obtain an access token by using [az account get-access-token](/cli/azure/account#az-account-get-access-token).

    ```azurecli-interactive
    az account get-access-token
    ```

## Create a user-assigned managed identity

To create a user-assigned managed identity, your account needs the [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

[!INCLUDE [ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

```bash
curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroup
s/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>?api-version=2015-08-31-preview' -X PUT -d '{"loc
ation": "<LOCATION>"}' -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS TOKEN>"
```

```HTTP
PUT https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroup
s/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>?api-version=2015-08-31-preview HTTP/1.1
```

**Request headers**

|Request header  |Description  |
|---------|---------|
|*Content-Type*     | Required. Set to `application/json`.        |
|*Authorization*     | Required. Set to a valid `Bearer` access token.        |

**Request body**

|Name  |Description  |
|---------|---------|
|Location     | Required. Resource location.        |

## List user-assigned managed identities

To list or read a user-assigned managed identity, your account needs the [Managed Identity Operator](../../role-based-access-control/built-in-roles.md#managed-identity-operator) or [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

```bash
curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities?api-version=2015-08-31-preview' -H "Authorization: Bearer <ACCESS TOKEN>"
```

```HTTP
GET https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities?api-version=2015-08-31-preview HTTP/1.1
```

|Request header  |Description  |
|---------|---------|
|*Content-Type*     | Required. Set to `application/json`.        |
|*Authorization*     | Required. Set to a valid `Bearer` access token.        |

## Delete a user-assigned managed identity

To delete a user-assigned managed identity, your account needs the [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

> [!NOTE]
> Deleting a user-assigned managed identity won't remove the reference from any resource it was assigned to. To remove a user-assigned managed identity from a VM by using CURL, see [Remove a user-assigned identity from an Azure VM](qs-configure-rest-vm.md#remove-a-user-assigned-managed-identity-from-an-azure-vm).

```bash
curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroup
s/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>?api-version=2015-08-31-preview' -X DELETE -H "Authorization: Bearer <ACCESS TOKEN>"
```

```HTTP
DELETE https://management.azure.com/subscriptions/80c696ff-5efa-4909-a64d-f1b616f423ca/resourceGroups/TestRG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>?api-version=2015-08-31-preview HTTP/1.1
```
|Request header  |Description  |
|---------|---------|
|*Content-Type*     | Required. Set to `application/json`.        |
|*Authorization*     | Required. Set to a valid `Bearer` access token.        |

## Next steps

For information on how to assign a user-assigned managed identity to an Azure VM or virtual machine scale set by using CURL, see:
- [Configure managed identities for Azure resources on an Azure VM using REST API calls](qs-configure-rest-vm.md#user-assigned-managed-identity)
- [Configure managed identities for Azure resources on a virtual machine scale set using REST API calls](qs-configure-rest-vmss.md#user-assigned-managed-identity)

Learn how to use [workload identity federation for managed identities](../develop/workload-identity-federation.md) to access Azure Active Directory (Azure AD) protected resources without managing secrets.
::: zone-end
