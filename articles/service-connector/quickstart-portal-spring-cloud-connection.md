---
title: Create a service connection in Azure Spring Apps
description: This quickstart shows you how to create a service connection in Azure Spring Apps from the Azure  or the Azure CLI.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: quickstart
zone_pivot_groups: interaction-type
ms.date: 7/11/2025
ms.custom:
  - kr2b-contr-experiment
  - build-2024
#Customer intent: As an app developer, I want to connect an application deployed to Azure Spring Apps to a Key Vault.
---

# Quickstart: Create a service connection in Azure Spring Apps

This quickstart shows you how to connect Azure Spring Apps to other Cloud resources using Service Connector. Service Connector streamlines the process of linking compute services to cloud services, while managing authentication and networking settings.

[!INCLUDE [deprecation-note](../spring-apps/includes/deprecation-note.md)]

::: zone pivot="azure-portal"

## Prerequisites

- An Azure account with an active subscription. [Create an Azure account for free](https://azure.microsoft.com/free).
- An app deployed to [Azure Spring Apps](../spring-apps/basic-standard/quickstart.md) in a [region supported by Service Connector](./concept-region-support.md).
- A target resource to connect Azure Spring Apps to. For example, a [Azure Key Vault](/azure/key-vault/general/quick-create-portal).

::: zone-end

::: zone pivot="azure-cli"

## Prerequisites

- An Azure account with an active subscription. [Create an Azure account for free](https://azure.microsoft.com/free).
- An app deployed to [Azure Spring Apps](../spring-apps/basic-standard/quickstart.md) in a [region supported by Service Connector](./concept-region-support.md).
- A target resource to connect Azure Spring Apps to. For example, a [Azure Key Vault](/azure/key-vault/general/quick-create-portal).
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

1. Optionally, run the command [az spring connection list-support-types](/cli/azure/spring/connection#az-spring-connection-list-support-types) to get a list of supported target services for Azure Spring Apps.

    ```azurecli
    az spring connection list-support-types --output table
    ```

    > [!TIP]
    > If the `az spring` command isn't recognized by the system, check that you have installed the required extension by running `az extension add --name spring`.

::: zone-end

## Create a new service connection

You'll use Service Connector to create a new service connection in Azure Spring Apps.

::: zone pivot="azure-portal"

1. To create a new connection in Azure Spring Apps, select the **Search resources, services and docs (G +/)** search bar at the top of the Azure portal, type *Azure Spring Apps* in the filter and select **Azure Spring Apps**.

    :::image type="content" source="./media/azure-spring-apps-quickstart/select-azure-spring-apps.png" alt-text="Screenshot of the Azure portal, selecting Azure Spring Apps.":::

1. Select the name of the Azure Spring Apps instance you want to connect to a target resource.

1. Under **Settings**, select **Apps** and select the application from the list.

    :::image type="content" source="./media/azure-spring-apps-quickstart/select-app.png" alt-text="Screenshot of the Azure portal, selecting an app.":::

1. Select **Service Connector** from the left table of contents and select **Create**.
    :::image type="content" source="./media/azure-spring-apps-quickstart/create-connection.png" alt-text="Screenshot of the Azure portal, selecting the button to create a connection.":::

1. Select or enter the following settings.
    :::image type="content" source="./media/azure-spring-apps-quickstart/create-conn-basic.png" alt-text="Screenshot of the Azure portal, fill basic info to create a connection.":::


    | Setting             | Example              | Description                                                                                                                                                                         |
    |---------------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**    | *Key Vault*          | The type of service you're going to connect your app to.                                                                                                                            |
    | **Connection name** | *keyvault_17d38*     | The connection name that identifies the connection between your app and target service. Use the connection name provided by Service Connector or enter your own connection name.    |
    | **Subscription**    | *my-subscription*    | The subscription that contains your target service (the service you want to connect to). The default value is the subscription that contains the app deployed to Azure Spring Apps. |
    | **Key vault**       | *my-keyvault-name*   | The target Key Vault you want to connect to. If you choose a different service type, select the corresponding target service instance.                                              |
    | **Client type**     | *SpringBoot*         | The application stack that works with the target service you selected. Besides SpringBoot and Java, other stacks are also supported.                                                |

1. Select **Next: Authentication** to select the authentication type. We recommend you use a system-assigned managed identity to connect to your Key Vault.

    :::image type="content" source="./media/azure-spring-apps-quickstart/create-conn-auth.png" alt-text="Screenshot of the Azure portal, filling out the Authentication tab.":::

1. Select **Next: Networking** to select the network configuration and select **Configure firewall rules to enable access to target service** so that your app can reach the Blob Storage.

    :::image type="content" source="./media/azure-spring-apps-quickstart/networking.png" alt-text="Screenshot of the Azure portal, filling out the Networking tab.":::

1. Select **Next: Review + Create** to review the provided information. Wait a few seconds for Service Connector to validate the information and select **Create** to create the service connection.

::: zone-end

::: zone pivot="azure-cli"

### [Managed identity](#tab/Using-Managed-Identity)

> [!NOTE]
> To use a managed identity, you must have permission to modify [role assignments in Microsoft Entra ID](/entra/identity/role-based-access-control/manage-roles-portal). If necessary, ask your subscription owner to grant you this permission.

1. Run the `az spring connection create` command to connect application deployed to Azure Spring Apps to a Blob Storage resource, using a system-assigned managed identity.

1. Provide the following information at the CLI or Cloud Shell's request:

    ```azurecli-interactive
    az spring connection create storage-blob --system-identity
    ```

    | Setting                                                 | Description                                                                                        |
    |---------------------------------------------------------|----------------------------------------------------------------------------------------------------|
    | `The resource group which contains the spring-cloud`    | The name of the resource group that contains an app hosted by Azure Spring Apps.                   |
    | `Name of the spring-cloud service`                      | The name of the Azure Spring Apps resource.                                                        |
    | `Name of the spring-cloud app`                          | The name of the application hosted by Azure Spring Apps that connects to the target service.       |
    | `The resource group which contains the storage account` | The name of the resource group with the storage account.                                           |
    | `Name of the storage account`                           | The name of the storage account you want to connect to. In this guide, we're using a Blob Storage. |

> [!TIP]
> If you don't have a Blob Storage, you can run `az spring connection create storage-blob --new --system-identity` to provision a new Blob Storage and directly connect it to your application hosted by Azure Spring Apps using a managed identity.

### [Access key](#tab/Using-access-key)

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

1. Run the `az spring connection create` command to create a service connection between Azure Spring Apps and an Azure Blob Storage using an access key.

    ```azurecli
    az spring connection create storage-blob --secret
    ```

1. Provide the following information at the CLI or Cloud Shell's request:

    | Setting                                                 | Description                                                                                        |
    |---------------------------------------------------------|----------------------------------------------------------------------------------------------------|
    | `The resource group which contains the spring-cloud`    | The name of the resource group that contains app hosted by Azure Spring Apps.                      |
    | `Name of the spring-cloud service`                      | The name of the Azure Spring Apps resource.                                                        |
    | `Name of the spring-cloud app`                          | The name of the application hosted by Azure Spring Apps that connects to the target service.       |
    | `The resource group which contains the storage account` | The name of the resource group with the storage account.                                           |
    | `Name of the storage account`                           | The name of the storage account you want to connect to. In this guide, we're using a Blob Storage. |

> [!TIP]
> If you don't have a Blob Storage, you can run `az spring connection create storage-blob --new --secret` to provision a new Blob Storage and directly connect it to your application hosted by Azure Spring Apps using a connection string.

---

::: zone-end

## View service connections

::zone pivot="azure-portal"

Azure Spring Apps connections are displayed under **Settings > Service Connector**.

1. Select **>**  to expand the list and access the properties required by your application.

1. Select **Validate** to check your connection status, and select **Learn more** to review the connection validation details.

   :::image type="content" source="./media/azure-spring-apps-quickstart/validation-result.png" alt-text="Screenshot of the Azure portal, get connection validation result.":::

::: zone-end

::: zone pivot="azure-cli"

Run `az spring connection list` command to list all of your Azure Spring Apps' provisioned connections.

Replace the placeholders `<azure-spring-apps-resource-group>`, `<azure-spring-apps-name>`, and `<app-name>` from the command below with the name of your Azure Spring Apps resource group, the name of your Azure Spring Apps resource, and the name of your application. You can also remove the `--output table` option to view more information about your connections.

```azurecli-interactive
az spring connection list --resource-group <azure-spring-apps-resource-group> --service <azure-spring-apps-name> --app <app-name>--output table
```

The output also displays the provisioning state of your connections: failed or succeeded.

::: zone-end

## Next steps

Check the guides below for more information about Service Connector and Azure Spring Apps:

> [!div class="nextstepaction"]
> [Tutorial: Azure Spring Apps + MySQL](./tutorial-java-spring-mysql.md)

> [!div class="nextstepaction"]
> [Tutorial: Azure Spring Apps + Apache Kafka on Confluent Cloud](./tutorial-java-spring-confluent-kafka.md)
