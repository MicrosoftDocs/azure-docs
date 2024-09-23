---
title: Deploy Azure IoT Operations to a cluster
description: Use the Azure CLI or Azure portal to deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 09/23/2024

#CustomerIntent: As an OT professional, I want to deploy Azure IoT Operations to a Kubernetes cluster.
---

# Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Learn how to deploy Azure IoT Operations Preview to a Kubernetes cluster and then manage that Azure IoT Operations instance using the Azure CLI or Azure portal.

* An Azure IoT Operations *deployment* describes all of the components and resources that enable the Azure IoT Operations scenario. These components and resources include:
  * An Azure IoT Operations instance
  * Arc extensions
  * Custom locations
  * Resource sync rules
  * Resources that you can configure in your Azure IoT Operations solution, like assets and asset endpoints.

* An Azure IoT Operations *instance* is one part of a deployment. It's the parent resource that bundles the suite of services that are defined in [What is Azure IoT Operations Preview?](../overview-iot-operations.md) like MQTT broker, dataflows, and OPC UA connector.

In this article, when we talk about deploying Azure IoT Operations we mean the full set of components that make up a *deployment*. Once the deployment exists, you can view, manage, and update the *instance*.

## Prerequisites

Cloud resources:

* An Azure subscription.

* An Azure key vault. To create a new key vault, use the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command:

  ```azurecli
  az keyvault create --enable-rbac-authorization --name "<KEYVAULT_NAME>" --resource-group "<RESOURCE_GROUP>"
  ```

* Azure access permissions:

  * At a minimum, have **Contributor** permissions in your Azure subscription.

  * Creating secrets in Key Vault require s**Key Vault Secrets Officer** permissions.

  * The following tasks require **Microsoft/Authorization/roleAssignments/write** permissions. You can make a custom role in Azure role-based access control or assign a [built-in role](../../role-based-access-control/built-in-roles/general.md) that grants this permission.

    * Enabling resource sync rules on the Azure IoT Operations instance. If you don't have role assignment write permissions, you can disable this feature during deployment. This approach is discussed in more detail in the [Deploy](#deploy) section of this article.

    * Creating a schema registry. If you don't have role assignment write permissions, you can request them or ask that someone with the correct permissions create a schema registry that you can refer to.

  > [!TIP]
  >
  > * If you use the Azure CLI, use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to give permissions. For example, `az role assignment create --assignee sp_name --role "Role Based Access Control Administrator" --scope subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup`
  >
  > * If you use the Azure portal to assign privileged admin roles to a user or principal, you're prompted to restrict access using conditions. For this scenario, select the **Allow user to assign all roles** condition in the **Add role assignment** page.
  >
  >   :::image type="content" source="./media/howto-deploy-iot-operations/add-role-assignment-conditions.png" alt-text="Screenshot that shows assigning users highly privileged role access in the Azure portal.":::

Development resources:

* Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli). This scenario requires Azure CLI version 2.53.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary.

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```azurecli
  az extension add --upgrade --name azure-iot-ops
  ```

A cluster host:

* An Azure Arc-enabled Kubernetes cluster with the custom location and workload identity features enabled. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md?tabs=wsl-ubuntu).

  If you deployed Azure IoT Operations to your cluster previously, uninstall those resources before continuing. For more information, see [Update Azure IoT Operations](#update-azure-iot-operations).

  Azure IoT Operations should work on any CNCF-conformant kubernetes cluster. Currently, Microsoft only supports K3s on Ubuntu Linux and WSL, or AKS Edge Essentials on Windows.

  Use the Azure IoT Operations extension for Azure CLI to verify that your cluster host is configured correctly for deployment by using the [verify-host](/cli/azure/iot/ops#az-iot-ops-verify-host) command on the cluster host:

  ```azurecli
  az iot ops verify-host
  ```

## Deploy

Use the Azure portal or Azure CLI to deploy Azure IoT Operations to your Arc-enabled Kubernetes cluster.

The Azure portal deployment experience is a helper tool that generates a deployment command based on your resources and configuration. The final step is to run an Azure CLI command, so you still need the Azure CLI prerequisites described in the previous section.

### [Azure CLI](#tab/cli)

1. Sign in to Azure CLI interactively with a browser even if you already signed in before. If you don't sign in interactively, you might get an error that says *Your device is required to be managed to access your resource* when you continue to the next step to deploy Azure IoT Operations.

   ```azurecli
   az login
   ```

   If at any point you get an error that says *Your device is required to be managed to access your resource*, run `az login` again and make sure that you sign in interactively with a browser.

   > [!NOTE]
   > If you're using GitHub Codespaces in a browser, `az login` returns a localhost error in the browser window after logging in. To fix, either:
   >
   > * Open the codespace in VS Code desktop, and then run `az login` in the terminal. This opens a browser window where you can log in to Azure.
   > * Or, after you get the localhost error on the browser, copy the URL from the browser and use `curl <URL>` in a new terminal tab. You should see a JSON response with the message "You have logged into Microsoft Azure!".

### Create a storage account and schema registry

Azure IoT Operations requires a schema registry on your cluster. Schema registry requires an Azure storage account so that it can synchronize schema information between cloud and edge.

Run the following CLI commands in your Codespaces terminal.

1. Set environment variables for the resources you create in this section.

   | Placeholder | Value |
   | ----------- | ----- |
   | <STORAGE_ACCOUNT_NAME> | A name for your storage account. Storage account names must be between 3 and 24 characters in length and only contain numbers and lowercase letters. |
   | <SCHEMA_REGISTRY_NAME> | A name for your schema registry. |
   | <SCHEMA_REGISTRY_NAMESPACE> | A name for your schema registry namespace. The namespace uniquely identifies a schema registry within a tenant. |

   ```azurecli
   export STORAGE_ACCOUNT=<STORAGE_ACCOUNT_NAME>
   export SCHEMA_REGISTRY=<SCHEMA_REGISTRY_NAME>
   export SCHEMA_REGISTRY_NAMESPACE=<SCHEMA_REGISTRY_NAMESPACE>
   ```

1. Create a storage account with hierarchical namespace enabled.

   ```azurecli
   az storage account create --name $STORAGE_ACCOUNT --location $LOCATION --resource-group $RESOURCE_GROUP --enable-hierarchical-namespace
   ```

1. Create a schema registry that connects to your storage account. This command also creates a blob container called **schemas** in the storage account if one doesn't exist already.

   ```azurecli
   az iot ops schema registry create --name $SCHEMA_REGISTRY --resource-group $RESOURCE_GROUP --registry-namespace $SCHEMA_REGISTRY_NAMESPACE --sa-resource-id $(az storage account show --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP -o tsv --query id)
   ```

### Deploy Azure IoT Operations

1. Prepare your cluster with the dependencies that Azure IoT Operations requires by running [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init).

   ```azurecli
   az iot ops init --cluster <CLUSTER_NAME> --resource-group <RESOURCE_GROUP> --sr-resource-id <SCHEMA_REGISTRY_RESOURCE_ID>
   ```

   Use the [optional parameters](/cli/azure/iot/ops#az-iot-ops-init-optional-parameters) to customize your cluster, including:

   | Optional parameter | Value | Description |
   | --------- | ----- | ----------- |
   | `--no-progress` |  | Disables the deployment progress display in the terminal. |
   | `--enable-fault-tolerance` | `false`, `true` | Enables fault tolerance for Azure Arc Container Storage. At least 3 cluster nodes are required. |

1. Deploy Azure IoT Operations. This command takes several minutes to complete:

   ```azurecli
   az iot ops create --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP
   ```

   Use the [optional parameters](/cli/azure/iot/ops#az-iot-ops-init-optional-parameters) to customize your cluster, including:

   | Optional parameter | Value | Description |
   | --------- | ----- | ----------- |
   | `--no-progress` |  | Disables the deployment progress display in the terminal. |
   | `--disable-rsync-rules` |  | Disable the resource sync rules on the deployment feature flag if you don't have **Microsoft.Authorization/roleAssignment/write** permissions in the resource group. |
   | `--add-insecure-listener` |  | Add an insecure 1883 port config to the default listener. *Not for production use*. |
   | `--broker-config-file` | Path to JSON file | Provide a configuration file for the MQTT broker. For more information, see [Advanced MQTT broker config](https://github.com/Azure/azure-iot-ops-cli-extension/wiki/Advanced-Mqtt-Broker-Config) and [Configure core MQTT broker settings](../manage-mqtt-broker/howto-configure-availability-scale.md). |
   | `--name` | String | Provide a name for your Azure IoT Operations instance. Otherwise, a default name is assigned. You can view the `instanceName` parameter in the command output. |

Once the `create` command completes successfully, you have a working Azure IoT Operations instance running on your cluster. At this point, your instance is configured for most testing and evaluation scenarios. If you want to prepare your instance for production scenarios, continue to the next section to enable secure settings.

### Enable secure settings (optional)

Secret management for Azure IoT Operations uses Azure Secret Store to sync the secrets from an Azure Key Vault and store them on the edge as Kubernetes secrets.  

Azure secret requires a user-assigned managed identity with access to the Azure Key Vault where secrets are stored. Dataflows also requires a user-assigned managed identity to authenticate cloud connections.

1. If you don't have an Azure Key Vault, create one by using the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command.

   ```azurecli
   az keyvault create --resource-group "<RESOURCE_GROUP>" --location "<LOCATION>" --name "<KEYVAULT_NAME>" --enable-rbac-authorization 
   ```

1. Give yourself **Secrets officer** permissions on the vault, so that you can create secrets:

   ```azurecli
   az role assignment create --role "Key Vault Secrets Officer" --assignee <CURRENT_USER> --scope /subscriptions/<SUBSCRIPTION>/resourcegroups/<RESOURCE_GROUP>/providers/Microsoft.KeyVault/vaults/<KEYVAULT_NAME> 
   ```

1. Create a user-assigned managed identity that has access to the Azure Key Vault.

```azurecli
az identity create --name "<USER_ASSIGNED_IDENTITY_NAME>" --resource-group "<RESOURCE_GROUP>" --location "<LOCATION>" --subscription "<SUBSCRIPTION>" 
```

1. Configure the Azure IoT Operations instance for secret synchronization. This command:

   * Creates a federated identity credential using the user-assigned managed identity.
   * Adds a role assignment to the user-assigned managed identity for access to the Azure Key Vault.
   * Adds a minimum secret provider class associated with the Azure IoT Operations instance.

   ```azurecli
   az iot ops secretsync enable -n <CLUSTER_NAME> -g <RESOURCE_GROUP> --mi-user-assigned <USER_ASSIGNED_MI_RESOURCE_ID> --kv-resource-id <KEYVAULT_RESOURCE_ID>
   ```

1. Create a user-assigned managed identity which can be used for cloud connections. Don't use the same identity as the one used to set up secrets management.

   ```azurecli
   az identity create --name "<USER_ASSIGNED_IDENTITY_NAME>" --resource-group "<RESOURCE_GROUP>" --location "<LOCATION>" --subscription "<SUBSCRIPTION>" 

   You will need to grant the identity permission to whichever cloud resource this will be used for. 

1. Run the following command to assign the identity to the Azure IoT Operations instance. This command also created a federated identity credential using the OIDC issuer of the indicated connected cluster and the Azure IoT Operations service account.

   ```azurecli
   az iot ops identity assign -n <CLUSTER_NAME> -g <RESOURCE_GROUP> --mi-user-assigned <USER_ASSIGNED_MI_RESOURCE_ID>
   ```

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

   1. Schema registry requires an Azure Storage account with hierarchical namespace and public network access enabled. Choose a storage account from the list of hierarchical namespace-enabled accounts, or select **Create** to create one.

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

   1. Copy and run the `az iot ops init` command.

   1. Copy and run the `az iot ops create` command.

   1. Copy and run the `az iot ops secretsync enable` command.

   1. Copy and run the `az iot ops identity assign` command.

1. Once all of the Azure CLI commands have completed successfully, you can close the **Install Azure IoT Operations** wizard.

---

While the deployment is in progress, you can watch the resources being applied to your cluster.

* If your terminal supports it, `init` displays the deployment progress.

  :::image type="content" source="./media/howto-deploy-iot-operations/view-deployment-terminal.png" alt-text="A screenshot that shows the progress of an Azure IoT Operations deployment in a terminal.":::

  Once the **Deploy IoT Operations** phase begins, the text in the terminal becomes a link to view the deployment progress in the Azure portal.

  :::image type="content" source="./media/howto-deploy-iot-operations/view-deployment-portal.png" alt-text="A screenshot that shows the progress of an Azure IoT Operations deployment in the Azure portal." lightbox="./media/howto-deploy-iot-operations/view-deployment-portal.png":::

* Otherwise, or if you choose to disable the progress interface with `--no-progress` added to the `init` command, you can use kubectl commands to view the pods on your cluster:

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

If your components need to connect to Azure endpoints like SQL or Fabric, learn how to [Manage secrets for your Azure IoT Operations Preview deployment](./howto-manage-secrets.md).
