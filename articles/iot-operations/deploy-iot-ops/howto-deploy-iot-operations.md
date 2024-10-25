---
title: Deploy Azure IoT Operations to a cluster
description: Use the Azure CLI or Azure portal to deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 10/02/2024

#CustomerIntent: As an OT professional, I want to deploy Azure IoT Operations to a Kubernetes cluster.
---

# Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Learn how to deploy Azure IoT Operations Preview to a Kubernetes cluster using the Azure CLI or Azure portal.

In this article, we discuss Azure IoT Operations *deployments* and *instances*, which are two different concepts:

* An Azure IoT Operations *deployment* describes all of the components and resources that enable the Azure IoT Operations scenario. These components and resources include:
  * An Azure IoT Operations instance
  * Arc extensions
  * Custom locations
  * Resource sync rules
  * Resources that you can configure in your Azure IoT Operations solution, like assets and asset endpoints.

* An Azure IoT Operations *instance* is the parent resource that bundles the suite of services that are defined in [What is Azure IoT Operations Preview?](../overview-iot-operations.md) like MQTT broker, dataflows, and OPC UA connector.

When we talk about deploying Azure IoT Operations, we mean the full set of components that make up a *deployment*. Once the deployment exists, you can view, manage, and update the *instance*.

## Prerequisites

Cloud resources:

* An Azure subscription.

* An Azure key vault. To create a new key vault, use the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command:

  ```azurecli
  az keyvault create --enable-rbac-authorization --name "<NEW_KEYVAULT_NAME>" --resource-group "<RESOURCE_GROUP>"
  ```

* Azure access permissions. For more information, see [Deployment details > Required permissions](overview-deploy.md#required-permissions).

Development resources:

* Azure CLI installed on your development machine. This scenario requires Azure CLI version 2.64.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```azurecli
  az extension add --upgrade --name azure-iot-ops
  ```

A cluster host:

* An Azure Arc-enabled Kubernetes cluster with the custom location and workload identity features enabled. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md).

  If you deployed Azure IoT Operations to your cluster previously, uninstall those resources before continuing. For more information, see [Update Azure IoT Operations](./howto-manage-update-uninstall.md#upgrade).

* Verify that your cluster host is configured correctly for deployment by using the [verify-host](/cli/azure/iot/ops#az-iot-ops-verify-host) command on the cluster host:

  ```azurecli
  az iot ops verify-host
  ```

* (Optional) Prepare your cluster for observability before deploying Azure IoT Operations: [Configure observability](../configure-observability-monitoring/howto-configure-observability.md).

## Deploy

Use the Azure portal or Azure CLI to deploy Azure IoT Operations to your Arc-enabled Kubernetes cluster.

The Azure portal deployment experience is a helper tool that generates a deployment command based on your resources and configuration. The final step is to run an Azure CLI command, so you still need the Azure CLI prerequisites described in the previous section.

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure IoT Operations**.

1. Select **Create**.

1. On the **Basics** tab, provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Subscription** | Select the subscription that contains your Arc-enabled cluster. |
   | **Resource group** | Select the resource group that contains your Arc-enabled cluster. |
   | **Cluster name** | Select the cluster that you want to deploy Azure IoT Operations to. |
   | **Custom location name** | *Optional*: Replace the default name for the custom location. |

   :::image type="content" source="./media/howto-deploy-iot-operations/deploy-basics.png" alt-text="A screenshot that shows the first tab for deploying Azure IoT Operations from the portal.":::

1. Select **Next: Configuration**.

1. On the **Configuration** tab, provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Azure IoT Operations name** | *Optional*: Replace the default name for the Azure IoT Operations instance. |
   | **MQTT broker configuration** | *Optional*: Edit the default settings for the MQTT broker. For more information, see [Configure core MQTT broker settings](../manage-mqtt-broker/howto-configure-availability-scale.md). |
   | **Dataflow profile configuration** | *Optional*: Edit the default settings for dataflows. For more information, see [Configure dataflow profile](../connect-to-cloud/howto-configure-dataflow-profile.md). |

   :::image type="content" source="./media/howto-deploy-iot-operations/deploy-configuration.png" alt-text="A screenshot that shows the second tab for deploying Azure IoT Operations from the portal.":::

1. Select **Next: Dependency management**.

1. On the **Dependency management** tab, select an existing schema registry or use these steps to create one:

   1. Select **Create new**.

   1. Provide a **Schema registry name** and **Schema registry namespace**.

   1. Select **Select Azure Storage container**.

   1. Choose a storage account from the list of hierarchical namespace-enabled accounts, or select **Create** to create one.

      Schema registry requires an Azure Storage account with hierarchical namespace and public network access enabled. When creating a new storage account, choose a **General purpose v2** storage account type and set **Hierarchical namespace** to **Enabled**.

   1. Select a container in your storage account or select **Container** to create one.

   1. Select **Apply** to confirm the schema registry configurations.

1. On the **Dependency management** tab, select the **Secure settings** deployment option.

   :::image type="content" source="./media/howto-deploy-iot-operations/deploy-dependency-management-1.png" alt-text="A screenshot that shows selecting secure settings on the third tab for deploying Azure IoT Operations from the portal.":::

1. In the **Deployment options** section, provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Subscription** | Select the subscription that contains your Azure key vault. |
   | **Azure Key Vault** | Select an Azure key vault select **Create new**.<br><br>Ensure that your key vault has **Vault access policy** as its permission model. To check this setting, select **Manage selected vault** > **Settings** > **Access configuration**. |
   | **User assigned managed identity for secrets** | Select an identity or select **Create new**. |
   | **User assigned managed identity for AIO components** | Select an identity or select **Create new**. Don't use the same managed identity as the one you selected for secrets. |

   :::image type="content" source="./media/howto-deploy-iot-operations/deploy-dependency-management-2.png" alt-text="A screenshot that shows configuring secure settings on the third tab for deploying Azure IoT Operations from the portal.":::

1. Select **Next: Automation**.

1. One at a time, run each Azure CLI command on the **Automation** tab in a terminal:

   1. Sign in to Azure CLI interactively with a browser even if you already signed in before. If you don't sign in interactively, you might get an error that says *Your device is required to be managed to access your resource* when you continue to the next step to deploy Azure IoT Operations.

      ```azurecli
      az login
      ```

   1. If you didn't prepare your Azure CLI environment as described in the prerequisites, do so now in a terminal of your choice:

      ```azurecli
      az upgrade
      az extension add --upgrade --name azure-iot-ops
      ```

   1. If you chose to create a new schema registry on the previous tab, copy and run the `az iot ops schema registry create` command.

   1. Prepare your cluster for Azure IoT Operations deployment by deploying dependencies and foundational services, including schema registry. Copy and run the `az iot ops init` command.

      >[!TIP]
      >The `init` command only needs to be run once per cluster. If you're reusing a cluster that already had Azure IoT Operations version 0.7.0 deployed on it, you can skip this step.

      This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

   1. Deploy Azure IoT Operations to your cluster. Copy and run the `az iot ops create` command.

      This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

   1. Enable secret sync on your Azure IoT Operations instance. Copy and run the `az iot ops secretsync enable` command. This command:

      * Creates a federated identity credential using the user-assigned managed identity.
      * Adds a role assignment to the user-assigned managed identity for access to the Azure Key Vault.
      * Adds a minimum secret provider class associated with the Azure IoT Operations instance.

   1. Assign a user-assigned managed identity to your Azure IoT Operations instance. Copy and run the `az iot ops identity assign` command.
   
      This command also creates a federated identity credential using the OIDC issuer of the indicated connected cluster and the Azure IoT Operations service account.

1. Once all of the Azure CLI commands complete successfully, you can close the **Install Azure IoT Operations** wizard.

### [Azure CLI](#tab/cli)

1. Sign in to Azure CLI interactively with a browser even if you already signed in before.

   ```azurecli
   az login
   ```

   If at any point you get an error that says *Your device is required to be managed to access your resource*, run `az login` again and make sure that you sign in interactively with a browser.

### Create a storage account and schema registry

Azure IoT Operations requires a schema registry on your cluster. Schema registry requires an Azure storage account so that it can synchronize schema information between cloud and edge.

1. Create a storage account with hierarchical namespace enabled.

   ```azurecli
   az storage account create --name <NEW_STORAGE_ACCOUNT_NAME> --resource-group <RESOURCE_GROUP> --enable-hierarchical-namespace
   ```

1. Create a schema registry that connects to your storage account.

   ```azurecli
   az iot ops schema registry create --name <NEW_SCHEMA_REGISTRY_NAME> --resource-group <RESOURCE_GROUP> --registry-namespace <NEW_SCHEMA_REGISTRY_NAMESPACE> --sa-resource-id $(az storage account show --name <STORAGE_ACCOUNT_NAME> --resource-group <RESOURCE_GROUP> -o tsv --query id)
   ```

   >[!NOTE]
   >This command requires that you have role assignment write permissions because it assigns a role to give schema registry access to the storage account. By default, the role is the built-in **Storage Blob Data Contributor** role, or you can create a custom role with restricted permissions to assign instead.

   Use the optional parameters to customize your schema registry, including:

   | Optional parameter | Value | Description |
   | --------- | ----- | ----------- |
   | `--custom-role-id` | Role definition ID | Provide a custom role ID to assign to the schema registry instead of the default **Storage Blob Data Contributor** role. At a minimum, the role needs blob read and write permissions. Format: `/subscriptions/<SUBSCRIPTION_ID>/providers/Microsoft.Authorization/roleDefinitions/<ROLE_ID>`. |
   | `--sa-container` | string | Storage account container to store schemas. If this container doesn't exist, this command creates it. The default container name is **schemas**. |

1. Copy the resource ID from the output of the schema registry create command to use in the next section.

### Deploy Azure IoT Operations

1. Prepare your cluster with the dependencies that Azure IoT Operations requires by running [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init).

   >[!TIP]
   >The `init` command only needs to be run once per cluster. If you're reusing a cluster that already had Azure IoT Operations version 0.7.0 deployed on it, you can skip this step.

   ```azurecli
   az iot ops init --cluster <CLUSTER_NAME> --resource-group <RESOURCE_GROUP> --sr-resource-id <SCHEMA_REGISTRY_RESOURCE_ID>
   ```

   This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

   Use the [optional parameters](/cli/azure/iot/ops#az-iot-ops-init-optional-parameters) to customize your cluster, including:

   | Optional parameter | Value | Description |
   | --------- | ----- | ----------- |
   | `--no-progress` |  | Disable the deployment progress display in the terminal. |
   | `--enable-fault-tolerance` | `false`, `true` | Enable fault tolerance for Azure Arc Container Storage. At least three cluster nodes are required. |
   | `--ops-config` | `observability.metrics.openTelemetryCollectorAddress=<FULLNAMEOVERRIDE>.azure-iot-operations.svc.cluster.local:<GRPC_ENDPOINT>` | If you followed the optional prerequisites to prepare your cluster for observability, provide the OpenTelemetry (OTel) collector address you configured in the otel-collector-values.yaml file.<br><br>The sample values used in [Configure observability](../configure-observability-monitoring/howto-configure-observability.md) are **fullnameOverride=aio-otel-collector** and **grpc.enpoint=4317**. |
   | `--ops-config` | `observability.metrics.exportInternalSeconds=<CHECK_INTERVAL>` | If you followed the optional prerequisites to prepare your cluster for observability, provide the **check_interval** value you configured in the otel-collector-values.yaml file.<br><br>The sample value used in [Configure observability](../configure-observability-monitoring/howto-configure-observability.md) is **check_interval=60**. |

1. Deploy Azure IoT Operations. This command takes several minutes to complete:

   ```azurecli
   az iot ops create --name <NEW_INSTANCE_NAME> --cluster <CLUSTER_NAME> --resource-group <RESOURCE_GROUP>
   ```

   This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

   Use the optional parameters to customize your instance, including:

   | Optional parameter | Value | Description |
   | --------- | ----- | ----------- |
   | `--no-progress` |  | Disable the deployment progress display in the terminal. |
   | `--enable-rsync` |  | Enable the resource sync rules on the instance to project resources from the edge to the cloud. |
   | `--add-insecure-listener` |  | Add an insecure 1883 port config to the default listener. *Not for production use*. |
   | `--custom-location` | String | Provide a name for the custom location created for your cluster. The default value is **location-{hash(5)}**. |
   | `--broker-config-file` | Path to JSON file | Provide a configuration file for the MQTT broker. For more information, see [Advanced MQTT broker config](https://github.com/Azure/azure-iot-ops-cli-extension/wiki/Advanced-Mqtt-Broker-Config) and [Configure core MQTT broker settings](../manage-mqtt-broker/howto-configure-availability-scale.md). |

Once the `create` command completes successfully, you have a working Azure IoT Operations instance running on your cluster. At this point, your instance is configured for most testing and evaluation scenarios. If you want to prepare your instance for production scenarios, continue to the next section to enable secure settings.

### Set up secret management and user assigned managed identity  (optional)

Secret management for Azure IoT Operations uses Azure Secret Store to sync the secrets from an Azure Key Vault and store them on the edge as Kubernetes secrets.  

Azure secret requires a user-assigned managed identity with access to the Azure Key Vault where secrets are stored. Dataflows also requires a user-assigned managed identity to authenticate cloud connections.

1. Create an Azure Key Vault if you don't have one available. Use the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command.

   ```azurecli
   az keyvault create --resource-group "<RESOURCE_GROUP>" --location "<LOCATION>" --name "<KEYVAULT_NAME>" --enable-rbac-authorization 
   ```

1. Create a user-assigned managed identity that will be assigned access to the Azure Key Vault.

   ```azurecli
   az identity create --name "<USER_ASSIGNED_IDENTITY_NAME>" --resource-group "<RESOURCE_GROUP>" --location "<LOCATION>" --subscription "<SUBSCRIPTION>" 
   ```

1. Configure the Azure IoT Operations instance for secret synchronization. This command:

   * Creates a federated identity credential using the user-assigned managed identity.
   * Adds a role assignment to the user-assigned managed identity for access to the Azure Key Vault.
   * Adds a minimum secret provider class associated with the Azure IoT Operations instance.

   ```azurecli
   az iot ops secretsync enable --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --mi-user-assigned <USER_ASSIGNED_MI_RESOURCE_ID> --kv-resource-id <KEYVAULT_RESOURCE_ID>
   ```

1. Create a user-assigned managed identity which can be used for cloud connections. Don't use the same identity as the one used to set up secrets management.

   ```azurecli
   az identity create --name "<USER_ASSIGNED_IDENTITY_NAME>" --resource-group "<RESOURCE_GROUP>" --location "<LOCATION>" --subscription "<SUBSCRIPTION>" 

   You will need to grant the identity permission to whichever cloud resource this will be used for. 

1. Run the following command to assign the identity to the Azure IoT Operations instance. This command also creates a federated identity credential using the OIDC issuer of the indicated connected cluster and the Azure IoT Operations service account.

   ```azurecli
   az iot ops identity assign --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --mi-user-assigned <USER_ASSIGNED_MI_RESOURCE_ID>
   ```

---

While the deployment is in progress, you can watch the resources being applied to your cluster. If your terminal supports it, the `init` and `create` commands display the deployment progress.
<!-- 
  :::image type="content" source="./media/howto-deploy-iot-operations/view-deployment-terminal.png" alt-text="A screenshot that shows the progress of an Azure IoT Operations deployment in a terminal.":::

  Once the **Deploy IoT Operations** phase begins, the text in the terminal becomes a link to view the deployment progress in the Azure portal.

  :::image type="content" source="./media/howto-deploy-iot-operations/view-deployment-portal.png" alt-text="A screenshot that shows the progress of an Azure IoT Operations deployment in the Azure portal." lightbox="./media/howto-deploy-iot-operations/view-deployment-portal.png"::: -->

Otherwise, or if you choose to disable the progress interface with `--no-progress` added to the commands, you can use kubectl commands to view the pods on your cluster:

  ```bash
  kubectl get pods -n azure-iot-operations
  ```

  It can take several minutes for the deployment to complete. Rerun the `get pods` command to refresh your view.

After the deployment is complete, use [az iot ops check](/cli/azure/iot/ops#az-iot-ops-check) to evaluate IoT Operations service deployment for health, configuration, and usability. The *check* command can help you find problems in your deployment and configuration.

```azurecli
az iot ops check
```

You can also check the configurations of topic maps, QoS, and message routes by adding the `--detail-level 2` parameter for a verbose view.

## Next steps

If your components need to connect to Azure endpoints like SQL or Fabric, learn how to [Manage secrets for your Azure IoT Operations Preview deployment](../secure-iot-ops/howto-manage-secrets.md).
