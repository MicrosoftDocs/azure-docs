---
title: 'Tutorial: Connect Azure services and store secrets in Key Vault'
description: Tutorial showing how to store your web application's secrets in Azure Key Vault using Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: tutorial
ms.date: 10/22/2024
#customer intent: As a web developer, I want store my app's secrets in Azure Key Vault so they can be managed and protected by Azure's security features.
---

# Quickstart: Connect Azure services and store secrets in Azure Key Vault

Azure Key Vault is a cloud service that provides a secure store for secrets. You can securely store keys, passwords, certificates, and other secrets. When you create a service connection, you can securely store access keys and secrets into connected Key Vault. In this tutorial, you complete the following tasks using the Azure portal. Both methods are explained in the following procedures.

> [!div class="checklist"]
> * Create a service connection to Azure Key Vault in Azure App Service
> * Create a service connection to Azure Blob Storage and store secrets in Key Vault
> * View secrets in Key Vault

## Prerequisites

To create a service connection and store secrets in Key Vault with Service Connector, you need:

* Basic knowledge of [using Service Connector](.\quickstart-portal-app-service-connection.md)
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* An app hosted on App Service. If you don't have one yet, [create and deploy an app to App Service](../app-service/quickstart-dotnetcore.md)
* An Azure Key Vault. If you don't have one, [create an Azure Key Vault](/azure/key-vault/general/quick-create-portal)
* Another target service instance supported by Service Connector. In this tutorial, you use [Azure Blob Storage](../storage/blobs/storage-quickstart-blobs-portal.md)
* Read and write access to the App Service, Key Vault, and the target service.

## Create a Key Vault connection in App Service

To store your connection access keys and secrets into a key vault, start by connecting your App Service to a key vault.

1. In the Azure portal, type **App Service** in the search menu and select the name of the App Service you want to use from the list.
1. Select **Service Connector** from the left table of contents. Then select **Create**.
1. Select or enter the following settings.

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Service type** | Key Vault | Target service type. If you don't have a Key Vault, [create one](/azure/key-vault/general/quick-create-portal). |
    | **Subscription** | One of your subscriptions. | The subscription in which your target service is deployed. The target service is the service you want to connect to. The default value is the subscription listed for the App Service. |
    | **Connection name** | Generated unique name | The connection name that identifies the connection between your App Service and target service  |
    | **Key vault name** | Your Key Vault name | The target Key Vault you want to connect to. |
    | **Client type** | The same app stack on this App Service | Your application stack that works with the target service you selected. The default value comes from the App Service runtime stack. |

1. Select **Next: Authentication** to select the authentication type. Then select **System assigned managed identity** to connect your Key Vault.

1. Select **Next: Network** to select the network configuration. Then select **Enable firewall settings** to update the firewall allowlist in Key Vault so that your App Service can reach the Key Vault.

1. Then select **Next: Review + Create**  to review the provided information. Select **Create** to create the service connection. It can take one minute to complete the operation.

## Create a Blob Storage connection in App Service and store access keys into Key Vault

Now you can create a service connection to another target service and directly store access keys into a connected Key Vault when using a connection string/access key or a service principal for authentication. We use Blob Storage as an example below. Follow the same process for other target services.

1. In the Azure portal, type **App Service** in the search menu and select the name of the App Service you want to use from the list.
1. Select **Service Connector** from the left table of contents. Then select **Create**.

1. Select or enter the following settings.

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Service type** | Blob Storage | Target service type. If you don't have a Storage Blob container, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type. |
    | **Subscription** | One of your subscriptions | The subscription in which your target service is deployed. The target service is the service you want to connect to. The default value is the subscription listed for the App Service.
    | **Connection name** | Generated unique name | The connection name that identifies the connection between your App Service and target service. |
    | **Storage account** | Your storage account | The target storage account you want to connect to. If you choose a different service type, select the corresponding target service instance. |
    | **Client type** | The same app stack on this App Service | Your application stack that works with the target service you selected. The default value comes from the App Service runtime stack. |

1. Set up authentication

    ### [Connection string](#tab/connectionstring)

    > [!IMPORTANT]
    > Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

    Select **Next: Authentication** to select the authentication type and select **Connection string** to use an access key to connect your storage account.

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Store Secret to Key Vault** | Check | This option lets Service Connector store the connection string/access key into your Key Vault. |
    | **Key Vault connection** | One of your Key Vault connections | Select the Key Vault in which you want to store your connection string/access key. |

    ### [Service principal](#tab/serviceprincipal)

    Select **Next: Authentication** to select the authentication type and select **Service Principal** to use a service principal to connect your storage account.

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Service Principal object ID or name** | Choose the service principal you want to use to connect to Blob Storage from the list | The service principal in your subscription that is used to connect to target service. |
    | **Store Secret to Key Vault** | Check | This option lets Service Connector store the service principal ID and secret into Key Vault. |
    | **Key Vault connection** | One of your key vault connections | Select the Key Vault in which you want to store your service principal ID and secret. |

    ---

1. Select **Next: Network** and **Enable firewall settings** to update the firewall allowlist in Key Vault so that your App Service can reach the Key Vault.

1. Then select **Next: Review + Create**  to review the provided information.

1. Select **Create** to create the service connection. It might take up to one minute to complete the operation.

## View your configuration in Key Vault

1. Expand the Blob Storage connection, select **Hidden value. Click to show value**. You can see that the value is a Key Vault reference.

1. Select the **Key Vault** in the Service Type column of your Key Vault connection. You'll be redirected to the Key Vault portal page.

1. Select **Secrets** in the Key Vault left ToC, and select the blob storage secret name.

    > [!TIP]
    > Don't have permission to list secrets? Refer to [troubleshooting Azure Key Vault](/azure/key-vault/general/troubleshooting-access-issues#im-not-able-to-list-or-get-secretskeyscertificate-im-seeing-a-something-went-wrong-error).

1. Select a version ID from the Current Version list.

1. Select **Show Secret Value** to get the connection string of this blob storage connection.

## Clean up resources

When no longer needed, delete the resource group and all related resources created for this tutorial. To do so, select a resource group or the individual resources you created and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Service Connector internals](./concept-service-connector-internals.md)
