---
title: Quickstart - Create and manage resources in Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to create and manage your first Azure Communication Services resource.
author: tophpalmer
manager: chpalm
services: azure-communication-services
ms.author: chpalm
ms.date: 06/30/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: arm
zone_pivot_groups: acs-plat-azp-azcli-net-ps
ms.custom: mode-other, devx-track-azurecli, devx-track-azurepowershell
ms.devlang: azurecli 
---
# Quickstart: Create and manage Communication Services resources

Get started with Azure Communication Services by provisioning your first Communication Services resource. Communication Services resources can be provisioned through the [Azure portal](https://portal.azure.com) or with the .NET management SDK. The management SDK and the Azure portal allow you to create, configure, update and delete your resources and interface with [Azure Resource Manager](../../azure-resource-manager/management/overview.md), Azure's deployment and management service. All functionality available in the SDKs is available in the Azure portal.

>[!VIDEO https://www.youtube.com/embed/3In3o5DhOHU]

> [!WARNING]
> Note that it is not possible to create a resource group at the same time as a resource for Azure Communication Services. When creating a resource, a resource group that has been created already, must be used.

::: zone pivot="platform-azp"
[!INCLUDE [Azure portal](./includes/create-resource-azp.md)]
::: zone-end

::: zone pivot="platform-azcli"
[!INCLUDE [Azure CLI](./includes/create-resource-az-cli.md)]
::: zone-end

::: zone pivot="platform-net"
[!INCLUDE [.NET](./includes/create-resource-net.md)]
::: zone-end

::: zone pivot="platform-powershell"
[!INCLUDE [PowerShell](./includes/create-resource-powershell.md)]
::: zone-end

## Access your connection strings and service endpoints

Connection strings allow the Communication Services SDKs to connect and authenticate to Azure. You can access your Communication Services connection strings and service endpoints from the Azure portal or programmatically with Azure Resource Manager APIs.

After navigating to your Communication Services resource, select **Keys** from the navigation menu and copy the **Connection string** or **Endpoint** values for usage by the Communication Services SDKs. Note that you have access to primary and secondary keys. This can be useful in scenarios where you would like to provide temporary access to your Communication Services resources to a third party or staging environment.

:::image type="content" source="./media/key.png" alt-text="Screenshot of Communication Services Key page.":::

### Access your connection strings and service endpoints using Azure CLI

You can also access key information using Azure CLI, like your resource group or the keys for a specific resource.

Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli) and use the following command to login. You'll need to provide your credentials to connect with your Azure account.

```azurepowershell-interactive
az login
```

Now you can access important information about your resources.

```azurepowershell-interactive
az communication list --resource-group "<resourceGroup>"

az communication list-key --name "<acsResourceName>" --resource-group "<resourceGroup>"
```

If you would like to select a specific subscription, you can also specify the ```--subscription``` flag and provide the subscription ID.

```azurepowershell-interactive
az communication list --resource-group  "<resourceGroup>"  --subscription "<subscriptionId>"

az communication list-key --name "<acsResourceName>" --resource-group "<resourceGroup>" --subscription "<subscriptionId>"
```

## Store your connection string

Communication Services SDKs use connection strings to authorize requests made to Communication Services. You have several options for storing your connection string:

* An application running on the desktop or on a device can store the connection string in an **app.config** or **web.config** file. Add the connection string to the **AppSettings** section in these files.
* An application running in an Azure App Service can store the connection string in the [App Service application settings](../../app-service/configure-common.md). Add the connection string to the **Connection Strings** section of the Application Settings tab within the portal.
* You can store your connection string in [Azure Key Vault](../../data-factory/store-credentials-in-key-vault.md).
* If you're running your application locally, you may want to store your connection string in an environment variable.

### Store your connection string in an environment variable

To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourconnectionstring>` with your actual connection string.

#### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx COMMUNICATION_SERVICES_CONNECTION_STRING "<yourConnectionString>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

#### [macOS](#tab/unix)

Edit your **`.zshrc`**, and add the environment variable:

```bash
export COMMUNICATION_SERVICES_CONNECTION_STRING="<yourConnectionString>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

#### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export COMMUNICATION_SERVICES_CONNECTION_STRING="<yourConnectionString>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

---

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. You can delete your communication resource by running the command below.

```azurecli-interactive
az communication delete --name "acsResourceName" --resource-group "resourceGroup"
```

[Deleting the resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md#delete-resource-groups) also deletes any other resources associated with it.

If you have any phone numbers assigned to your resource upon resource deletion, the phone numbers will be released from your resource automatically at the same time.

> [!NOTE]
> Resource deletion is **permanent** and no data, including event grid filters, phone numbers, or other data tied to your resource, can be recovered if you delete the resource.

## Next steps

In this quickstart you learned how to:

> [!div class="checklist"]
>
> * Create a Communication Services resource
> * Configure resource geography and tags
> * Access the keys for that resource
> * Delete the resource

> [!div class="nextstepaction"]
> [Create your first user access tokens](identity/access-tokens.md)
