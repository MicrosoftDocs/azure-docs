---
title: How to configure Azure Functions Application Insights with Key Vault and identity based connections
description: Article that shows you how to use identity based connections and key vault in place of connection strings for application insights
ms.topic: article
ms.date: 7/26/2021

---

# Tutorial: Use Managed Identity to access Key Vault

This article shows you how to configure App Insights with Key Vault and managed identities. The tutorial is a continuation of the [functions managed identity tutorial](./functions-managed-identity-tutorial.md). To learn more about identity based connections, see [Configure an identity-based connection.](functions-reference.md#configure-an-identity-based-connection).

In this tutorial, you'll:
- create a Key Vault
- add a secret to your Key Vault
- configure your function app's application insights to use role based access instead of connection strings.

## Create a Key Vault

1. On the Azure portal menu or the **Home** page, select **Create a resource**.

1. On the **New** page, search for *key vault*. Then select **Create**.

1. On the **Basics** tab, use the following table to configure the key vault settings. All other settings can use the default values.

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. | 
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | The resource group you created with your function app. |
    | **Name** | mykeyvault | The name of your key vault. |
    | **[Region](https://azure.microsoft.com/regions/)** | myFunctionRegion | The region where you created your function app. |

1. Create a Key Vault, and add a secret. I call the secret "AppInsights" and paste in the connection string for the value.

1. Select **Review + create**. After validation finishes, select **Create**.

## Add a secret to key vault.

1. In your Application Insights, select **Overview** on the left blade.
 
1. Copy the **Connection String**.
    :::image type="content" source="./media/functions-secretless-tutorial/14-app-insights-connection-string.png" alt-text="Screenshot of how to get the connection string for Application Insights.":::

1. In your Key Vault, select **Secrets** from the left blade.

1. Select **Generate/Import** to create a secret with the below settings.

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Name**  | AppInsights | The name for you secret. The suggested value is AppInsights as the secret will be for our Application Insights connection string. |
    | **Value** | yourAppInsightsConnectionString | The connection string value you copied from your Application Insights overview. |

## Configure your app to use Azure role-based access control

1. In your Key Vault, select **Access policies** from the left blade.
    :::image type="content" source="./media/functions-secretless-tutorial/15-role-based-access-control.png" alt-text="Screenshot of how to switch to role-based-access-control.":::

1. Select **Azure role-based access control**, and select **Save**. 

1. In your function app, select **Identity** from the left blade.

1. Select **Azure role assignments**.

1. Select **Add role assignment** and create a role with the below settings.

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Scope**  | Key Vault | Scope is a set of resources that the role assignment applies to. |
    | **Subscription** | yourSubscription | The subscription under which your resources are created. | 
    | **Resource**  | yourKeyVault | The Key Vault you are created a role based connection for. |
    | **Role** | Key Vault Secrets User | The role determines what permissions your managed identity will have. The Key Vault Secrets User will allow your identity to read secret contents. |

1. In your function app, select **Configuration** from the left blade.
    :::image type="content" source="./media/functions-secretless-tutorial/16-update-appinsights-connection.png" alt-text="Screenshot of how to update the application insights connection string app setting.":::

1. Select **APPLICATIONINSIGHTS_CONNECTION_STRING** and replace the **Value** with the Key Vault **SecretURI**. The format should be: `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)`. For example, following the steps from this tutorial, the **ServiceURI** would be `@Microsoft.KeyVault(SecretUri=https://identity-app-kv.vault.azure.net/secrets/AppInsights/)`. For more details, go to the [key vault references documentation](../app-service/app-service-key-vault-references.md#reference.syntax).

1. Select **OK** and then **Save**.

1. In your application insights, select **Live metrics** from the left blade.

1. Confirm that you are still receiving data with your new Key Vault reference configuration.

1. Congratulations! You've successfully set up your function app's application insights to use RBAC instead of connection strings. Now, your function app is fully secretless, but it still only has a timer trigger and is not triggered by external sources. Continue to the [storage queue](./functions-managed-identity-storage-queue.md) and [service bus queue](./functions-managed-identity-servicebus-queue.md) tutorials to learn how to use managed identities with external triggers.

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps

In this tutorial, you created a Premium function app, storage account, and Service Bus. You secured all of these resources behind private endpoints. 

Use the following links to learn more Azure Functions networking options and private endpoints:

- [Managed identity in Azure Functions](../app-service/overview-managed-identity.md)

- [Identity based connections in Azure Functions](./azure-functions/functions-reference.md#configure-an-identity-based-connection)

- [Connecting to host storage with an Identity](./azure-functions/functions-reference.md#connecting-to-host-storage-with-an-identity)

- [Creating a Function App without Azure Files](./azure-functions/storage-considerations.md#create-an-app-without-azure-files)

- [Run Azure Functions from a package file](./azure-functions/run-functions-from-deployment-package.md)

- [Use Key Vault references in Azure Functions](../app-service/app-service-key-vault-references.md)

- [Configuring the account used by Visual Studio for local development](/dotnet/api/azure/identity-readme.md#authenticating-via-visual-studio)

- [Functions documentation for local development](./azure-functions/functions-reference#local-development)
