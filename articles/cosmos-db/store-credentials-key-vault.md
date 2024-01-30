---
title: |
  Tutorial: Store and use Azure Cosmos DB credentials with Azure Key Vault
description: |
  Use Azure Key Vault to store and access Azure Cosmos DB connection string, keys, and endpoints. 
author: seesharprun
ms.author: sidandrews
ms.reviewer: thweiss
ms.service: cosmos-db
ms.devlang: csharp
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 11/07/2022
---

# Tutorial: Store and use Azure Cosmos DB credentials with Azure Key Vault

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

> [!IMPORTANT]
> It's recommended to access Azure Cosmos DB is to use a [system-assigned managed identity](managed-identity-based-authentication.md). If both the managed identity solution and cert based solution do not meet your needs, please use the Azure Key vault solution in this article.

If you're using Azure Cosmos DB as your database, you connect to databases, container, and items by using an SDK, the API endpoint, and either the primary or secondary key.

It's not a good practice to store the endpoint URI and sensitive read-write keys directly within application code or configuration file. Ideally, this data is read from environment variables within the host. In Azure App Service, [app settings](../app-service/configure-common.md#configure-app-settings) allow you to inject runtime credentials for your Azure Cosmos DB account without the need for developers to store these credentials in an insecure clear text manner.

Azure Key Vault iterates on this best practice further by allowing you to store these credentials securely while giving services like Azure App Service managed access to the credentials. Azure App Service will securely read your credentials from Azure Key Vault and inject those credentials into your running application.

With this best practice, developers can store the credentials for tools like the [Azure Cosmos DB emulator](emulator.md) or [Try Azure Cosmos DB free](try-free.md) during development. Then, the operations team can ensure that the correct production settings are injected at runtime.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create an Azure Key Vault instance
> - Add Azure Cosmos DB credentials as secrets to the key vault
> - Create and register an Azure App Service resource and grant "read key" permissions
> - Inject key vault secrets into the App Service resource
>

> [!NOTE]
> This tutorial and the sample application uses an Azure Cosmos DB for NoSQL account. You can perform many of the same steps using other APIs.

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account.
  - If you have an Azure subscription, [create a new account](nosql/how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](try-free.md) before you commit.
- GitHub account.

## Before you begin: Get Azure Cosmos DB credentials

Before you start, you'll get the credentials for your existing account.

1. Navigate to the [Azure portal](https://portal.azure.com/) page for the existing Azure Cosmos DB for NoSQL account.

1. From the Azure Cosmos DB for NoSQL account page, select the **Keys** navigation menu option.

    :::image type="content" source="media/access-secrets-from-keyvault/cosmos-keys-option.png" lightbox="media/access-secrets-from-keyvault/cosmos-keys-option.png" alt-text="Screenshot of an Azure Cosmos DB SQL API account page. The Keys option is highlighted in the navigation menu.":::

1. Record the values from the **URI** and **PRIMARY KEY** fields. You'll use these values later in this tutorial.

    :::image type="content" source="media/access-secrets-from-keyvault/cosmos-endpoint-key-credentials.png" lightbox="media/access-secrets-from-keyvault/cosmos-endpoint-key-credentials.png" alt-text="Screenshot of Keys page with various credentials for an Azure Cosmos DB SQL API account.":::

## Create an Azure Key Vault resource

First, create a new key vault to store your API for NoSQL credentials.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **Create a resource > Security > Key Vault**.

1. On the **Create key vault** page, enter the following information:

    | Setting | Description |
    | --- | --- |
    | **Subscription** | Select the Azure subscription that you wish to use for this Azure Cosmos account. |
    | **Resource group** | Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
    | **Key vault name** | Enter a globally unique name for your key vault. |
    | **Region** | Select a geographic location to host your Azure Cosmos DB account. Use the location that is closest to your users to give them the fastest access to the data. |
    | **Pricing tier** | Select *Standard*. |

1. Leave the remaining settings to their default values.
  
1. Select **Review + create**.

1. Review the settings you provide, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete** before moving on.

## Add Azure Cosmos DB access keys to the Key Vault

Now, store your Azure Cosmos DB credentials as secrets in the key vault.

1. Select **Go to resource** to go to the Azure Key Vault resource page.

1. From the Azure Key Vault resource page, select the **Secrets** navigation menu option.

1. Select **Generate/Import** from the menu.

   :::image type="content" source="media/access-secrets-from-keyvault/create-new-secret.png" alt-text="Screenshot of the Generate/Import option in a key vault menu.":::

1. On the **Create a secret** page, enter the following information:

    | Setting | Description |
    | --- | --- |
    | **Upload options** | *Manual* |
    | **Name** | *cosmos-endpoint* |
    | **Secret value** | Enter the **URI** you copied earlier in this tutorial. |

   :::image type="content" source="media/access-secrets-from-keyvault/create-endpoint-secret.png" alt-text="Screenshot of the Create a secret dialog in the Azure portal with details for an URI secret.":::

1. Select **Create** to create the new **cosmos-endpoint** secret.

1. Select **Generate/Import** from the menu again. On the **Create a secret** page, enter the following information:

    | Setting | Description |
    | --- | --- |
    | **Upload options** | *Manual* |
    | **Name** | *cosmos-readwrite-key* |
    | **Secret value** | Enter the **PRIMARY KEY** you copied earlier in this tutorial. |

   :::image type="content" source="media/access-secrets-from-keyvault/create-key-secret.png" alt-text="Screenshot of the Create a secret dialog in the Azure portal with details for a PRIMARY KEY secret.":::

1. Select **Create** to create the new **cosmos-readwrite-key** secret.

1. After the secrets are created, view them in the list of secrets within the **Secrets** page.

    :::image type="content" source="media/access-secrets-from-keyvault/view-secrets-list.png" alt-text="Screenshot of the list of secrets for a key vault.":::

1. Select each key, select the latest version, and then copy the **Secret Identifier**. You'll use the identifier for the **cosmos-endpoint** and **cosmos-readwrite-key** secrets later in this tutorial.

    > [!TIP]
    > The secret identifier will be in this format `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>/<version-id>`. For example, if the name of the key vault is **msdocs-key-vault**, the name of the key is **cosmos-readwrite-key**, and the version if **83b995e363d947999ac6cf487ae0e12e**; then the secret identifier would be `https://msdocs-key-vault.vault.azure.net/secrets/cosmos-readwrite-key/83b995e363d947999ac6cf487ae0e12e`.
    >
    > :::image type="content" source="media/access-secrets-from-keyvault/view-secret-identifier.png" alt-text="Screenshot of a secret identifier for a key vault secret named cosmos-readwrite-key.":::
    >

## Create and register an Azure Web App with Azure Key Vault

In this section, create a new Azure Web App, deploy a sample application, and then register the Web App's managed identity with Azure Key Vault.

1. Create a new GitHub repository using the [cosmos-db-nosql-dotnet-sample-web-environment-variables template](https://github.com/azure-samples/cosmos-db-nosql-dotnet-sample-web-environment-variables).

1. In the Azure portal, select **Create a resource > Web > Web App**.

1. On the **Create Web App** page and **Basics** tab, enter the following information:

    | Setting | Description |
    | --- | --- |
    | **Subscription** | Select the Azure subscription that you wish to use for this Azure Cosmos account. |
    | **Resource group** | Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
    | **Name** | Enter a globally unique name for your web app. |
    | **Publish** | Select *Code*. |
    | **Runtime stack** | Select *.NET 6 (LTS)*. |
    | **Operating System** | Select *Windows*. |
    | **Region** | Select a geographic location to host your Azure Cosmos DB account. Use the location that is closest to your users to give them the fastest access to the data. |

1. Leave the remaining settings to their default values.

1. Select **Next: Deployment**.

1. On the **Deployment** tab, enter the following information:

    | Setting | Description |
    | --- | --- |
    | **Continuous deployment** | Select *Enable*. |
    | **GitHub account** | Select *Authorize*. Follow the GitHub account authorization prompts to grant Azure permission to read your newly created GitHub repository. |
    | **Organization** | Select the organization for your new GitHub repository. |
    | **Repository** | Select the name your new GitHub repository. |
    | **Branch** | Select *main*. |

1. Select **Review + create**.

1. Review the settings you provide, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete** before moving on.

1. You may need to wait a few extra minutes for the web application to be initially deployed to the web app. From the Azure Web App resource page, select **Browse** to see the default state of the app.

    :::image type="content" source="media/access-secrets-from-keyvault/sample-web-app-empty.png" lightbox="media/access-secrets-from-keyvault/sample-web-app-empty.png" alt-text="Screenshot of the web application in it's default state without credentials.":::

1. Select the **Identity** navigation menu option.

1. On the **Identity** page, select **On** for **System-assigned** managed identity, and then select **Save**.

    :::image type="content" source="media/access-secrets-from-keyvault/enable-managed-identity.png" alt-text="Screenshot of system-assigned managed identity being enabled from the Identity page.":::

## Inject Azure Key Vault secrets as Azure Web App app settings

Finally, inject the secrets stored in your key vault as app settings within the web app. The app settings will, in turn, inject the credentials into the application at runtime without storing the credentials in clear text.

1. Return to the key vault page in the Azure portal. Select **Access policies** from the navigation menu.

1. On the **Access policies** page, select **Create** from the menu.

    :::image type="content" source="media/access-secrets-from-keyvault/create-access-policy.png" alt-text="Screenshot of the Create option in the Access policies menu.":::

1. On the **Permissions** tab of the **Create an access policy** page, select the **Get** option in the **Secret permissions** section. Select **Next**.

    :::image type="content" source="media/access-secrets-from-keyvault/get-secrets-permission.png" alt-text="Screenshot of the Get permission enabled for Secret permissions.":::

1. On the **Principal** tab, select the name of the web app you created earlier in this tutorial. Select **Next**.

    :::image type="content" source="media/access-secrets-from-keyvault/assign-principal.png" alt-text="Screenshot of a web app managed identity assigned to a permission.":::

    > [!NOTE]
    > In this example screenshot, the web app is named **msdocs-dotnet-web**.

1. Select **Next** again to skip the **Application** tab. On the **Review + create** tab, review the settings you provide, and then select **Create**.

1. Return to the web app page in the Azure portal. Select **Configuration** from the navigation menu.

1. On the **Configuration** page, select **New application setting**. In the **Add/Edit application setting** dialog, enter the following information:

    | Setting | Description |
    | --- | --- |
    | **Name** | `CREDENTIALS__ENDPOINT` |
    | **Key** | Get the **secret identifier** for the **cosmos-endpoint** secret in your key vault that you created earlier in this tutorial. Enter the identifier in the following format: `@Microsoft.KeyVault(SecretUri=<secret-identifier>)`. |

    > [!TIP]
    > Ensure that the environment variable has a double underscore (`__`) value instead of a single underscore. The double-underscore is a key delimeter supported by .NET on all platforms. For more information, see [environment variables configuration](/dotnet/core/extensions/configuration-providers#environment-variable-configuration-provider).

    > [!NOTE]
    > For example, if the secret identifier is `https://msdocs-key-vault.vault.azure.net/secrets/cosmos-endpoint/69621c59ef5b4b7294b5def118921b07`, then the reference would be `@Microsoft.KeyVault(SecretUri=https://msdocs-key-vault.vault.azure.net/secrets/cosmos-endpoint/69621c59ef5b4b7294b5def118921b07)`.
    >
    > :::image type="content" source="media/access-secrets-from-keyvault/create-app-setting.png" alt-text="Screenshot of the Add/Edit application setting dialog with a new app setting referencing a key vault secret.":::
    >

1. Select **OK** to persist the new app setting

1. Select **New application setting** again. In the **Add/Edit application setting** dialog, enter the following information and then select **OK**:

    | Setting | Description |
    | --- | --- |
    | **Name** | `CREDENTIALS__KEY` |
    | **Key** | Get the **secret identifier** for the **cosmos-readwrite-key** secret in your key vault that you created earlier in this tutorial. Enter the identifier in the following format: `@Microsoft.KeyVault(SecretUri=<secret-identifier>)`. |

1. Back on the **Configuration** page, select **Save** to update the app settings for the web app.

    :::image type="content" source="media/access-secrets-from-keyvault/save-app-settings.png" alt-text="Screenshot of the Save option in the Configuration page's menu.":::

1. Wait a few minutes for the web app to restart with the new app settings. At this point, the new app settings should indicate that they're a **Key vault Reference**.

    :::image type="content" source="media/access-secrets-from-keyvault/app-settings-reference.png" lightbox="media/access-secrets-from-keyvault/app-settings-reference.png" alt-text="Screenshot of the Key vault Reference designation on two app settings in a web app.":::

1. Select **Overview** from the navigation menu. Select **Browse** to see the app with populated credentials.

    :::image type="content" source="media/access-secrets-from-keyvault/sample-web-app-populated.png" lightbox="media/access-secrets-from-keyvault/sample-web-app-populated.png" alt-text="Screenshot of the web application with valid Azure Cosmos DB for NoSQL account credentials.":::

## Next steps

- To configure a firewall for Azure Cosmos DB, see [firewall support](how-to-configure-firewall.md) article.
- To configure virtual network service endpoint, see [secure access by using VNet service endpoint](how-to-configure-vnet-service-endpoint.md) article.