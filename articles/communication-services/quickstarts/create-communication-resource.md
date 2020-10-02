---
title: Quickstart - Create and manage resources in Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to create and manage your first Azure Communication Services resource.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 09/30/2020
ms.topic: overview
ms.service: azure-communication-services
zone_pivot_groups: acs-plat-azp-net
---
# Quickstart: Create and manage Communication Services resources

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

Get started with Azure Communication Services by provisioning your first Communication Services resource. Communication services resources can be provisioned through the Azure portal or with the .NET management client library. The management client library allows you to create, configure, update and delete your resource and interfaces with [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/management/overview), Azure's deployment and management service. All functionality available in the client libraries is available in the Azure portal. 

> [!WARNING]
> Note that Communication Services availability is restricted to the US geography during public preview. Also note that communication resources cannot be transferred to a different subscription during public preview.

::: zone pivot="platform-azp"
[!INCLUDE [Azure portal](./includes/create-resource-azp.md)]
::: zone-end

::: zone pivot="platform-net"
[!INCLUDE [.NET](./includes/create-resource-net.md)]
::: zone-end

## Access your connection strings and service endpoints

Connection strings allow the Communication Services client libraries to connect and authenticate to Azure. You can access your Communication Services connection strings and service endpoints from the Azure portal or programmatically with Azure Resource Manager APIs. 

After navigating to your Communication Services resource, select **Keys** from the navigation menu and copy the **Connection string** or **Endpoint** values for usage by the Communication Services client libraries. Note that you have access to primary and secondary keys. This can be useful in scenarios where you would like to provide temporary access to your Communication Services resources to a third party or staging environment.

:::image type="content" source="./media/key.png" alt-text="Screenshot of Communication Services Key page.":::

## Store your connection string

Communication Services client libraries use connection strings to authorize requests made to Communication Services. You have several options for storing your connection string:

* An application running on the desktop or on a device can store the connection string in an **app.config** or **web.config** file. Add the connection string to the **AppSettings** section in these files.
* An application running in an Azure App Service can store the connection string in the [App Service application settings](https://docs.microsoft.com/azure/app-service/configure-common). Add the connection string to the **Connection Strings** section of the Application Settings tab within the portal.
* You can store your connection string in [Azure Key Vault](https://docs.microsoft.com/azure/data-factory/store-credentials-in-key-vault).
* If you're running your application locally, you may want to store your connection string in an environment variable.

### Store your connection string in an environment variable

To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourconnectionstring>` with your actual connection string.

#### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx COMMUNICATION_SERVICES_CONNECTION_STRING "<yourconnectionstring>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you are using Visual Studio as your editor, restart Visual Studio before running the example.

#### [macOS](#tab/unix)

Edit your **.zshrc**, and add the environment variable:

```bash
export COMMUNICATION_SERVICES_CONNECTION_STRING="<yourconnectionstring>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

#### [Linux](#tab/linux)

Edit your **.bash_profile**, and add the environment variable:

```bash
export COMMUNICATION_SERVICES_CONNECTION_STRING="<yourconnectionstring>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

---

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

If you have any phone numbers assigned to your resource upon resource deletion, the phone numbers will be released from your resource automatically at the same time. 

## Next steps

In this quickstart you learned how to:

> [!div class="checklist"]
> * Create a Communication Services resource
> * Configure resource geography and tags
> * Access the keys for that resource
> * Delete the resource

> [!div class="nextstepaction"]
> [Create your first user access tokens](access-tokens.md)
