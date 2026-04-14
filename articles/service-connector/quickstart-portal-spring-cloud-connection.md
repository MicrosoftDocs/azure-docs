---
title: 'Quickstart: Connect Azure Spring Apps to databases and services with Service Connector'
description: Learn how to connect Azure Spring Apps to databases, storage accounts, and other Azure services using Service Connector. Step-by-step guide for Azure portal and Azure CLI.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: quickstart
zone_pivot_groups: interaction-type
ms.date: 8/19/2025
keywords: azure spring apps, service connector, database connection, managed identity, azure storage, authentication
ms.custom:
  - kr2b-contr-experiment
  - build-2024
  - sfi-image-nochange
#Customer intent: As an app developer, I want to connect my Azure Spring Apps application to databases, storage accounts, and other Azure services using managed identities and connection strings.
---

# Quickstart: Connect Azure Spring Apps to databases and services with Service Connector

Get started with Service Connector to connect your Azure Spring Apps to databases, storage accounts, and other Azure services. Service Connector simplifies authentication and configuration, enabling you to connect to resources using managed identities other authentication methods.

This article provides step-by-step instructions for both the Azure portal and Azure CLI. Choose your preferred method using the tabs above.

[!INCLUDE [deprecation-note](../spring-apps/includes/deprecation-note.md)]

## Prerequisites

::: zone pivot="azure-portal"
- An Azure account with an active subscription. [Create an Azure account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An app deployed to [Azure Spring Apps](../spring-apps/basic-standard/quickstart.md) in a [region supported by Service Connector](./concept-region-support.md).
- A target resource to connect Azure Spring Apps to. For example, a [Azure Key Vault](/azure/key-vault/general/quick-create-portal).
- The [necessary permissions](./concept-permission.md) to create and manage service connections.
::: zone-end

::: zone pivot="azure-cli"
- An Azure account with an active subscription. [Create an Azure account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An app deployed to [Azure Spring Apps](../spring-apps/basic-standard/quickstart.md) in a [region supported by Service Connector](./concept-region-support.md).
- A target resource to connect Azure Spring Apps to. For example, a [Azure Key Vault](/azure/key-vault/general/quick-create-portal).
- The [necessary permissions](./concept-permission.md) to create and manage service connections.
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
- Version 2.37.0 or higher of the Azure CLI. To upgrade to the latest version, run `az upgrade`. If using Azure Cloud Shell, the latest version is already installed.
- The Azure Spring Apps extension must be installed in the Azure CLI or the Cloud Shell. To install it, run `az extension add --name spring`.
::: zone-end

::: zone pivot="azure-cli"
## Initial setup

1. If you're using Service Connector for the first time, start by running the command [az provider register](/cli/azure/provider#az-provider-register) to register the Service Connector resource provider.

   ```azurecli
   az provider register -n Microsoft.ServiceLinker
   ```

    > [!TIP]
    > You can check if the resource provider has already been registered by running the command `az provider show -n "Microsoft.ServiceLinker" --query registrationState`. If the output is `Registered`, then Service Connector has already been registered.

1. Optionally, run the following command to get a list of supported target services for Azure Spring Apps.

   ```azurecli
   az spring connection list-support-types --output table
   ```

    > [!TIP]
    > If the `az spring` command isn't recognized by the system, check that you have installed the required extension by running `az extension add --name spring`.
::: zone-end

## Create a service connection

Use Service Connector to create a secure service connection between your Azure Spring Apps and Azure Blob Storage. This example demonstrates connecting to Blob Storage, but you can use the same process for other supported Azure services.

::: zone pivot="azure-portal"
1. Select the **Search resources, services and docs (G +/)** search bar at the top of the Azure portal, type *Azure Spring Apps* in the filter and select **Azure Spring Apps**.

    :::image type="content" source="./media/azure-spring-apps-quickstart/select-azure-spring-apps.png" alt-text="Screenshot of the Azure portal, selecting Azure Spring Apps.":::

1. Select the name of the Azure Spring Apps instance you want to connect to a target resource.

1. Under **Settings**, select **Apps** and select the application from the list.

    :::image type="content" source="./media/azure-spring-apps-quickstart/select-app.png" alt-text="Screenshot of the Azure portal, selecting an app.":::

1. Select **Service Connector** from the service menu and select **Create**.
    :::image type="content" source="./media/azure-spring-apps-quickstart/create-connection.png" alt-text="Screenshot of the Azure portal, selecting the button to create a connection.":::

1. On the **Basics** tab, select or enter the following settings.
    :::image type="content" source="./media/azure-spring-apps-quickstart/create-conn-basic.png" alt-text="Screenshot of the Azure portal, fill basic info to create a connection.":::


    | Setting             | Example              | Description                                                                                                                                                                         |
    |---------------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**    | *Key Vault*          | The type of service you're going to connect your app to.                                                                                                                            |
    | **Connection name** | *keyvault_17d38*     | The connection name that identifies the connection between your app and target service. Use the connection name provided by Service Connector or enter your own connection name.    |
    | **Subscription**    | *my-subscription*    | The subscription that contains your target service (the service you want to connect to). The default value is the subscription that contains the app deployed to Azure Spring Apps. |
    | **Key vault**       | *my-keyvault-name*   | The target Key Vault you want to connect to. If you choose a different service type, select the corresponding target service instance.                                              |
    | **Client type**     | *SpringBoot*         | The application stack that works with the selected target service. Besides SpringBoot and Java, other stacks are also supported.                                                |

1. Select **Next: Authentication** to select the authentication type. We recommend you use a system-assigned managed identity to connect to your Key Vault.

    :::image type="content" source="./media/azure-spring-apps-quickstart/create-conn-auth.png" alt-text="Screenshot of the Azure portal, filling out the Authentication tab.":::

1. Select **Next: Networking** to select the network configuration and select **Configure firewall rules to enable access to target service** so that your app can reach the Blob Storage.

    :::image type="content" source="./media/azure-spring-apps-quickstart/networking.png" alt-text="Screenshot of the Azure portal, filling out the Networking tab.":::

1. Select **Next: Review + Create** to review the provided information. Wait a few seconds for Service Connector to validate the information and select **Create** to create the service connection.
::: zone-end

::: zone pivot="azure-cli"

### [Managed identity (recommended)](#tab/using-Managed-Identity)

Run the `az spring connection create` command to connect an application deployed to Azure Spring Apps to a Blob Storage resource, with a system-assigned managed identity. You can run this command in two different ways:

- Generate the new connection step by step.
     
  ```azurecli-interactive
     az spring connection create storage-blob --system-identity
  ```
 
- Generate the new connection at once. Replace the placeholders with your own information: `<source-subscription>`, `<source_resource_group>`, `<azure-spring-apps-resource>`, `<app>`, `<target-subscription>`, `<target_resource_group>`, and `<account>`.

  ```azurecli-interactive
     az spring connection create storage-blob \                         
     --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.AppPlatform/Spring/<azure-spring-apps-resource>/apps/<app> \
     --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Storage/storageAccounts/<account>/blobServices/default \
     --system-identity
  ```
    
> [!TIP]
> If you don't have a Blob Storage account, run `az spring connection create storage-blob --new --system-identity` to create one and connect it to your application hosted on Azure Spring Apps using a managed identity.

### [Connection string](#tab/using-connection-string)

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

Run the `az spring connection create` command to connect an application deployed to Azure Spring Apps to a Blob Storage resource, with connection string. You can run this command in two different ways:

- Generate the new connection step by step.

  ```azurecli-interactive
  az spring connection create storage-blob --secret
  ```

- Generate the new connection at once. Replace the placeholders with your own information: `<source-subscription>`, `<source_resource_group>`, `<azure-spring-apps-resource>`, `<app>`, `<target-subscription>`, `<target_resource_group>`, `<account>`, `<secret-name>`, and `<secret>`.

  ```azurecli-interactive
  az spring connection create storage-blob \                         
     --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.AppPlatform/Spring/<azure-spring-apps-resource>/apps/<app> \
     --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Storage/storageAccounts/<account>/blobServices/default \
      --secret name=<secret-name> secret=<secret>
  ```

> [!TIP]
> If you don't have a Blob Storage account, run `az spring connection create storage-blob --new --secret` to create one and connect it to your application hosted on Azure Spring Apps using a connection string.

---
::: zone-end

## View service connections

:::zone pivot="azure-portal"
Azure Spring Apps connections are displayed under **Settings > Service Connector**.

1. Select **>**  to expand the list and access the properties required by your application.

1. Select **Validate** to check your connection status, and select **Learn more** to review the connection validation details.

   :::image type="content" source="./media/azure-spring-apps-quickstart/validation-result.png" alt-text="Screenshot of the Azure portal, get connection validation result.":::

::: zone-end

::: zone pivot="azure-cli"
Run `az spring connection list` command to list all of your Azure Spring Apps' provisioned connections.

Replace the placeholders `<azure-spring-apps-resource-group>`, `<azure-spring-apps-resource-name>`, and `<app-name>` from the command below with your own information. You can also remove the `--output table` option to view more information about your connections.

```azurecli-interactive
az spring connection list --resource-group <azure-spring-apps-resource-group> --service <azure-spring-resource-name> --app <app-name> --output table
```

The output also displays the provisioning state of your connections.
::: zone-end

## Related content

Check the guides below for more information about Service Connector and Azure Spring Apps:

- [Tutorial: Azure Spring Apps + MySQL](./tutorial-java-spring-mysql.md)
- [Tutorial: Azure Spring Apps + Apache Kafka on Confluent Cloud](./tutorial-java-spring-confluent-kafka.md)
