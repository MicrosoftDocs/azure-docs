---
title: How to configure Azure Functions Application Insights with Key Vault and identity-based connections
description: Article that shows you how to use identity-based connections and key vault in place of connection strings for application insights
ms.topic: article
ms.date: 7/26/2021

---

# Tutorial: Access Application Insights Secrets Using Key Vault

This article shows you how to configure the Azure Application Insights instance used by your function app with Azure Key Vault and managed identities. The tutorial is a continuation of the [functions managed identity tutorial](./functions-managed-identity-tutorial.md). To learn more about identity-based connections, see [Configure an identity-based connection.](functions-reference.md#configure-an-identity-based-connection).

In this tutorial, you'll:
> [!div class="checklist"]
> * Create a key vault.
> * Get your Application Insights connection string.
> * Add the connection string to your key vault
> * Configure your function app to use role-based access for Application Insights.

## Prerequisites

Complete the previous tutorial [Create a function app with identity-based connections](./functions-managed-identity-tutorial.md).

## Create a key vault 

1. In the [Azure portal](https://portal.azure.com), choose **Create a resource (+)**.

1. On the **New** page, search for *key vault*, select **Key vaults** from **Services**, and then select **+ Create**.

1. On the **Basics** tab, configure the key vault settings based on the values from the following table: 

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. | 
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | The resource group you created with your function app. |
    | **Key vault name** | mykeyvault-uniqueid | The name of your key vault. Because the key vault is publicly accessible, you must use a name that is globally unique across Azure. The name must also be between 3 and 24 characters in length, contain only alphanumeric characters and dashes, and can't start with a number. |
    | **[Region](https://azure.microsoft.com/regions/)** | myFunctionRegion | The region where you created your function app. |

    For any other settings, just use the default values.

1. Select **Review + create**, and after validation finishes, select **Create**.
 
This creates the key vault. Next, you can add a secret that is the Application Insights connection string.

## Add a secret to key vault.

1. Search for the function app you created in the previous tutorial. You can also browse to it in the **Function App** page. 

1. In your function app, select **Configuration** under **Settings**, then select your **APPLICATIONINSIGHTS_CONNECTION_STRING** setting.

1. Copy the value of the **APPLICATIONINSIGHTS_CONNECTION_STRING** setting, which is the connection string for your Application Insights instance, which you'll move into the key vault. 
 
1. Back in key vault, select **Secrets** from the left blade.

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
    | **Resource**  | yourKeyVault | The Key Vault you are created a role-based connection for. |
    | **Role** | Key Vault Secrets User | The role determines what permissions your managed identity will have. The Key Vault Secrets User will allow your identity to read secret contents. |

1. In your function app, select **Configuration** from the left blade.
    :::image type="content" source="./media/functions-secretless-tutorial/16-update-appinsights-connection.png" alt-text="Screenshot of how to update the application insights connection string app setting.":::

1. Select **APPLICATIONINSIGHTS_CONNECTION_STRING** and replace the **Value** with the Key Vault **SecretURI**. The format should be: `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)`. For example, following the steps from this tutorial, the **ServiceURI** would be `@Microsoft.KeyVault(SecretUri=https://identity-app-kv.vault.azure.net/secrets/AppInsights/)`. For more details, go to the [key vault references documentation](../app-service/app-service-key-vault-references.md#reference-syntax).

1. Select **OK** and then **Save**.

1. In your application insights, select **Live metrics** from the left blade.

1. Confirm that you are still receiving data with your new Key Vault reference configuration.

1. Congratulations! You've successfully set up your function app's application insights to use RBAC instead of connection strings. Now, your function app is fully secretless, but it still only has a timer trigger and is not triggered by external sources. Continue to the [storage queue](./functions-managed-identity-storage-queue.md) and [service bus queue](./functions-managed-identity-servicebus-queue.md) tutorials to learn how to use managed identities with external triggers.

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps 

In this tutorial, you created a function app with identity-based connections.

Use the following links to learn more Azure Functions with identity-based connections:

- [Managed identity in Azure Functions](../app-service/overview-managed-identity.md)
- [identity-based connections in Azure Functions](./functions-reference.md#configure-an-identity-based-connection)
- [Connecting to host storage with an Identity](./functions-reference.md#connecting-to-host-storage-with-an-identity)
- [Creating a Function App without Azure Files](./storage-considerations.md#create-an-app-without-azure-files)
- [Run Azure Functions from a package file](./run-functions-from-deployment-package.md)
- [Use Key Vault references in Azure Functions](../app-service/app-service-key-vault-references.md)
- [Configuring the account used by Visual Studio for local development](/dotnet/api/azure/identity-readme.md#authenticating-via-visual-studio)
- [Functions documentation for local development](./functions-reference.md#local-development-with-identity-based-connections)