---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: storage
ms.topic: include
ms.date: 09/09/2022
ms.author: alexwolf
ms.custom: include file
---

## Authenticate the app to Azure

[!INCLUDE [passwordless-overview](../passwordless-overview.md)]

## [Passwordless (Recommended)](#tab/passwordless)

[!INCLUDE [passwordless-default-azure-credential-overview](../dotnet-default-azure-credential-overview.md)]

### Assign roles to your Azure AD user

When developing locally, make sure that the user account that connects to Azure Service Bus has the correct permissions. You'll need the `Azure Service Bus Data Owner` role in order to send and receive messages. To assign yourself this role, you'll need the User Access Administrator role, or another role that includes the `Microsoft.Authorization/roleAssignments/write` action. You can assign Azure RBAC roles to a user using the Azure portal, Azure CLI, or Azure PowerShell. Learn more about the available scopes for role assignments on the [scope overview](/azure/role-based-access-control/scope-overview) page.

The following example assigns the `Azure Service Bus Data Owner` role to your user account, which provides full access to Azure Service Bus resources. In a real scenario, follow the [Principle of Least Privilege](/azure/active-directory/develop/secure-least-privileged-access) to gives users only the minimum permissions needed for a more secure production environments.

> [!IMPORTANT]
> In most cases, it will take a minute or two for the role assignment to propagate in Azure. In rare cases, it may take up to eight minutes. If you receive authentication errors when you first run your code, wait a few moments and try again.

# [Azure portal](#tab/azure-portal)

1. In the Azure portal, locate your service bus namespace using the main search bar or left navigation.

2. On the overview page, select **Access control (IAM)** from the left-hand menu.	

3. On the **Access control (IAM)** page, select the **Role assignments** tab.

4. Select **+ Add** from the top menu and then **Add role assignment** from the resulting drop-down menu.

    :::image type="content" source="media/add-role.png" alt-text="A screenshot showing how to assign a role.":::    

5. Use the search box to filter the results to the desired role. For this example, search for `Azure Service Bus Data Owner` and select the matching result. Then choose **Next**.

6. Under **Assign access to**, select **User, group, or service principal**, and then choose **+ Select members**.

7. In the dialog, search for your Azure AD username (usually your *user@domain* email address) and then choose **Select** at the bottom of the dialog. 

8. Select **Review + assign** to go to the final page, and then **Review + assign** again to complete the process.

# [Azure CLI](#tab/azure-cli)

To assign a role at the resource level using the Azure CLI, you first must retrieve the resource ID using the `az servicebus namespace show` command. You can filter the output properties using the `--query` parameter. 

```azurecli
az servicebus namespace show -g '<your-service-bus-resource-group>' -n '<your-service-bus-name> --query id
```

Copy the output `Id` from the preceding command. You can then assign roles using the [az role](/cli/azure/role) command of the Azure CLI.

```azurecli
az role assignment create --assignee "<user@domain>" \
--role "Azure Service Bus Data Owner" \
--scope "<your-resource-id>"
```

# [PowerShell](#tab/powershell)

To assign a role at the resource level using Azure PowerShell, you first must retrieve the resource id using the `Get-AzResource` command.

```azurepowershell
Get-AzResource -ResourceGroupName "<your-service-bus-resource-group>" -Name "<your-service-bus-name>"
```

Copy the `Id` value from the preceding command output. You can then assign roles using the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command in PowerShell.

```azurepowershell
New-AzRoleAssignment -SignInName <user@domain> `
-RoleDefinitionName "Azure Service Bus Data Owner" `
-Scope <yourStorageAccountId>
```

--- 

### Sign in and add the Azure Identity package

You can authorize access to the service bus namespace using the following steps:

Make sure you're authenticated with the same Azure AD account you assigned the role to. You can authenticate via the Azure CLI, Visual Studio, or Azure PowerShell.

# [Azure CLI](#tab/azure-cli)

Sign-in to Azure through the Azure CLI using the following command:

```azurecli
az login
```

# [Visual Studio](#tab/visual-studio)

Select the **Sign in** button in the top right of Visual Studio.

:::image type="content" source="../../articles/storage/blobs/media/storage-quickstart-blobs-dotnet/sign-in-visual-studio-small.png" alt-text="Screenshot showing the button to sign in to Azure using Visual Studio.":::

Sign-in using the Azure AD account you assigned a role to previously.

:::image type="content" source="../../articles/storage/blobs/media/storage-quickstart-blobs-dotnet/sign-in-visual-studio-account-small.png" alt-text="Screenshot showing the account selection.":::

# [Visual Studio Code](#tab/visual-studio-code)

You will need to [install the Azure CLI](/cli/azure/install-azure-cli) to work with `DefaultAzureCredential` through Visual Studio code.

On the main menu of Visual Studio Code, navigate to **Terminal > New Terminal**.

Sign-in to Azure through the Azure CLI using the following command:

```azurecli
az login
```

# [PowerShell](#tab/powershell)

Sign-in to Azure using PowerShell via the following command:

```azurepowershell
Connect-AzAccount
```

--- 

To use `DefaultAzureCredential`, add the **Azure.Identity** package to your application.

# [Visual Studio](#tab/visual-studio)

1. In **Solution Explorer**, right-click the **Dependencies** node of your project. Select **Manage NuGet Packages**.

1. In the resulting window, search for *Azure.Identity*. Select the appropriate result, and select **Install**.

    :::image type="content" source="../../articles/storage/common/media/visual-studio-identity-package.png" alt-text="A screenshot showing how to add the identity package."::: 

# [.NET CLI](#tab/netcore-cli)

```dotnetcli
dotnet add package Azure.Identity
```

---

## [Connection String](#tab/connection-string)

[!INCLUDE [service-bus-retrieve-connection-string](service-bus-retrieve-connection-string.md)]

---
