---
title: How to configure Azure Functions Application Insights with Key Vault and identity-based connections
description: Article that shows you how to use identity-based connections and key vault in place of connection strings for application insights
ms.topic: article
ms.date: 8/206/2021
#Customer intent: As a function developer, I want to learn how to use managed identities so that my function app can connect to Application Insights using secrets stored in Key Vault and system managed identities for better security.
---

# Tutorial: Access Application Insights secrets using Azure Key Vault

This article shows you how to configure the Azure Application Insights instance used by your function app with Azure Key Vault and managed identities. The tutorial is a continuation of the [functions managed identity tutorial](./functions-managed-identity-tutorial.md). To learn more about identity-based connections, see [Configure an identity-based connection.](functions-reference.md#configure-an-identity-based-connection).

In this tutorial, you'll:
> [!div class="checklist"]
> * Create a key vault.
> * Get your Application Insights connection string.
> * Add the connection string to your key vault
> * Configure your function app to use role-based access control (RBAC) for Application Insights.

Using a key value to store your Application Insights connection string impacts the experience managing your function app in the Azure portal. Specifically, monitoring data from your connected Application Insights instance are no longer displayed and links to the instance are removed. To go to the linked instance, you'll need to search or browse Application Insights for your named instance.   

## Prerequisites

Complete the previous tutorial [Create a function app with identity-based connections](./functions-managed-identity-tutorial.md).

## Get your Application Insights connection string

1. In the [Azure portal](https://portal.azure.com), search for the function app you created in the previous tutorial. You can also browse to it in the **Function App** page. 

1. In your function app, select **Configuration** under **Settings**, then select your **APPLICATIONINSIGHTS_CONNECTION_STRING** setting.

1. Copy the value of the **APPLICATIONINSIGHTS_CONNECTION_STRING** setting, which is the connection string for your Application Insights instance. You need this value when you create a secret in your key vault. 

## Create a key vault 

1. In the [Azure portal](https://portal.azure.com), choose **Create a resource (+)**.

1. On the **Create a resource** page, search for *key vault*, select **Key Vault**, and then select **+ Create**.

1. On the **Basics** tab, configure the key vault settings based on the values from the following table: 

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. | 
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | The resource group you created with your function app. |
    | **Key vault name** | mykeyvault-uniqueid | The name of your key vault. Because the key vault is publicly accessible, you must use a name that is globally unique across Azure. The name must also be between 3 and 24 characters in length, contain only alphanumeric characters and dashes, and can't start with a number. |
    | **[Region](https://azure.microsoft.com/regions/)** | same as your function app | The region where you created your function app. |

1. Select **Next: Access policy >** and select **Azure role-based access control** for the **Permission model**.

1. Select **Review + create**, and after validation finishes, select **Create**. This step creates a key vault that uses RBAC. 

1. After the deployment completes, select **Go to resource** to navigate to your new key vault. 
 
Before you can add secrets to this new RBAC-enabled vault, you need to grant yourself permissions to do so. 

## Grant your account permissions to create secrets

1. In your key vault, select **Access control (AIM)** and then **+ Add** > **Add role assignment (preview)**. If you have trouble finding your new key vault, you can always search for it by name.

1. In **Add role assignment** in the **Role** tab, select **Key Vault Secrets Office** and select **Next**.

1. In the **Members** tab, select **+ Select members**, select your user account, then **Select**. 

1. Select **Next** > **Review + assign**. Select the **Role assignments** tab to verify your user account has the Key Vault Secrets Office role.

Now, you have permissions to add a secret to the RBAC-enabled vault. The secret you add contains the Application Insights connection string. 

## Add a secret to key vault
 
1. In your key vault, select **Secrets** under **Settings**.

1. Select **Generate/Import** and supply the following settings: 

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Name**  | AppInsights | The name for you secret. The suggested value is AppInsights as the secret will be for our Application Insights connection string. |
    | **Value** | yourAppInsightsConnectionString | The connection string value you copied from your Application Insights overview. |

1. Select **Create** to add the secret. 

## Update your function app to use key vault

1. Back in your function app, select **Identity** under **Configuration**.

1. Select **Azure role assignments** on the **System assigned** tab.

1. Select **Add role assignment (preview)** and create a role with the following settings:

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Scope**  | Key Vault | Scope is a set of resources to which the role assignment applies. |
    | **Subscription** | yourSubscription | Your subscription. | 
    | **Resource**  | yourKeyVault | The key vault you created in this tutorial. |
    | **Role** | Key Vault Secrets User | The role determines what permissions your managed identity will have. The Key Vault Secrets User will allow your identity to read secret contents. |

1. Select **Save**. It might take a minute or two for the role to show up when you refresh the Azure role assignments list.

1. In your function app, select **Configuration** under **Settings**.

    :::image type="content" source="./media/functions-secretless-tutorial/16-update-appinsights-connection.png" alt-text="Screenshot of how to update the application insights connection string app setting.":::

1. Edit the **APPLICATIONINSIGHTS_CONNECTION_STRING** and replace the **Value** with a URI in the following format:

    `@Microsoft.KeyVault(VaultName=<KEY_VAULT_NAME>;SecretName=AppInsights)`

    In the above string, `AppInsights` is the name of the secret you added. Replace `<KEY_VAULT_NAME>` with the name of your key vault. 

    To learn more about using Key Vault references in application settings, see the [reference syntax](../app-service/app-service-key-vault-references.md#reference-syntax).

1. Delete the **APPINSIGHTS_INSTRUMENTATIONKEY** setting. This legacy setting isn't needed when using `APPLICATIONINSIGHTS_CONNECTION_STRING` and it could help the app continue to run with an incorrectly configured `APPLICATIONINSIGHTS_CONNECTION_STRING`value.

1. Select **OK** and then **Save** > **Continue**. Your changes are saved, the function app restarts, and the validation status of the key value reference is shown in the **Source** column. When the host can't successfully validate the reference, a red **X** is shown, otherwise a green check mark means the reference is good. 

Now, you'll see logs continue to be sent to Application Insights when using the key vault reference. Because your function app in the portal can no longer display links to your named Application Insights instance, you need to browse to it directly.

## Validate your changes

1. In the portal, search for `Application Insights` and select **Application Insights** under **Settings**.  

1. In **Application Insights**, browse or search for your named instance. 

1. In your instance, select **Transaction search** under **Investigate** and then select **See all data in the last 24 hours**.
 
1. Confirm that you're still receiving data with your new Key Vault reference configuration. You should continue to see traces written by the timer trigger every five minutes even after you switch to using Key Vault.

Congratulations! You've successfully configured your function app to connect to Application Insights using RBAC instead of connection strings. 

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps 

In this tutorial, you extended the previous tutorial so that all connections used by your function app are made without using stored secrets. 

Next, consider completing one of the following tutorials that show you how to connect to other Azure services using bindings with managed identities: 

+ [Tutorial: Connect to Azure Queue Storage using identity-based connections](functions-managed-identity-storage-queue.md) 
+ [Tutorial: Connect to Azure Service Bus queues using identity-based connections](functions-managed-identity-servicebus-queue.md)

The Service Bus queues tutorial also shows how to use managed identities during local development.