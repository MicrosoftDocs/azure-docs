---
title: Deploy Azure IoT Operations to a cluster
description: Use the Azure CLI or Azure portal to deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 08/02/2024

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
  * Resources that you can configure in your Azure IoT Operations solution, like assets, MQTT broker, and dataflows.

* An Azure IoT Operations *instance* is one part of a deployment. It's the parent resource that bundles the suite of services that are defined in [What is Azure IoT Operations Preview?](../overview-iot-operations.md), like MQ, Akri, and OPC UA connector.

In this article, when we talk about deploying Azure IoT Operations we mean the full set of components that make up a *deployment*. Once the deployment exists, you can view, manage, and update the *instance*.

## Choose your features

Azure IoT Operations offers two deployment modes. You can choose to deploy a basic subset of features that are simpler to get started with for evaluation scenarios, or you can choose to deploy the full feature set.

* Basic feature deployment:

  * Does not configure secrets or user-assigned managed identity capabilities.
  * Is meant to enable the end-to-end quickstart sample for evaluation purposes, so does support the OPC PLC simulator and connect to cloud resources using system-assigned managed identity.
  * Can be upgraded to include the full set of features. For the steps to enable secrets and user-assigned managed identity, see [Configure secrets on your cluster](./howto-manage-secrets.md)

* Full feature deployment:

  * Includes the steps to enable secrets and user-assignment managed identity, which are important capabilities for developing a production-ready scenario. Secrets are used whenever Azure IoT Operations components connect to a resource outside of the cluster; for example, an OPC UA server or a dataflow source or destination endpoint.

If you want to deploy the basic subset, see [Quickstart: Run Azure IoT Operations Preview in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md).

This article provides steps to deploy the full feature set for Azure IoT Operations.

## Prerequisites

Cloud resources:

* An Azure subscription.

* Azure access permissions. At a minimum, have **Contributor** permissions in your Azure subscription. Depending on the deployment feature flag status you select, you might also need **Microsoft/Authorization/roleAssignments/write** permissions for the resource group that contains your Arc-enabled Kubernetes cluster. You can make a custom role in Azure role-based access control or assign a built-in role that grants this permission. For more information, see [Azure built-in roles for General](../../role-based-access-control/built-in-roles/general.md).

  If you *don't* have role assignment write permissions, you can still deploy Azure IoT Operations by disabling some features. This approach is discussed in more detail in the [Deploy](#deploy) section of this article.

  * In the Azure CLI, use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to give permissions. For example, `az role assignment create --assignee sp_name --role "Role Based Access Control Administrator" --scope subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup`

  * In the Azure portal, when you assign privileged admin roles to a user or principal, you can restrict access using conditions. For this scenario, select the **Allow user to assign all roles** condition in the **Add role assignment** page.

    :::image type="content" source="./media/howto-deploy-iot-operations/add-role-assignment-conditions.png" alt-text="Screenshot that shows assigning users highly privileged role access in the Azure portal.":::

* An Azure key vault that has the **Permission model** set to **Vault access policy**. You can check this setting in the **Access configuration** section of an existing key vault. To create a new key vault, use the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command:

  ```azurecli
  az keyvault create --enable-rbac-authorization false --name "<KEYVAULT_NAME>" --resource-group "<RESOURCE_GROUP>"
  ```

Development resources:

* Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli). This scenario requires Azure CLI version 2.53.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary.

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```azurecli
  az extension add --upgrade --name azure-iot-ops
  ```

A cluster host:

* An Azure Arc-enabled Kubernetes cluster. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md?tabs=wsl-ubuntu).

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

   > [!NOTE]
   > If you're using GitHub Codespaces in a browser, `az login` returns a localhost error in the browser window after logging in. To fix, either:
   >
   > * Open the codespace in VS Code desktop, and then run `az login` in the terminal. This opens a browser window where you can log in to Azure.
   > * Or, after you get the localhost error on the browser, copy the URL from the browser and use `curl <URL>` in a new terminal tab. You should see a JSON response with the message "You have logged into Microsoft Azure!".

1. Deploy Azure IoT Operations to your cluster. Use optional flags to customize the [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init) command to fit your scenario.

   By default, the `az iot ops init` command takes the following actions, some of which require that the principal signed in to the CLI has elevated permissions:

     * Set up a service principal and app registration to give your cluster access to the key vault.
     * Configure TLS certificates.
     * Configure a secrets store on your cluster that connects to the key vault.
     * Deploy the Azure IoT Operations resources.

   ```azurecli
   az iot ops init --cluster <CLUSTER_NAME> --resource-group <RESOURCE_GROUP> --kv-id <KEYVAULT_SETTINGS_PROPERTIES_RESOURCE_ID>
   ```

   Use the [optional parameters](/cli/azure/iot/ops#az-iot-ops-init-optional-parameters) to customize your deployment, including:

     | Parameter | Value | Description |
     | --------- | ----- | ----------- |
     | `--add-insecure-listener` |  | Add an insecure 1883 port config to the default listener. *Not for production use*. |
     | `--broker-config-file` | Path to JSON file | Provide a configuration file for the MQTT broker. For more information, see [Advanced MQTT broker config](https://github.com/Azure/azure-iot-ops-cli-extension/wiki/Advanced-Mqtt-Broker-Config) and [Configure core MQTT broker settings](../manage-mqtt-broker/howto-configure-availability-scale.md). |
     | `--disable-rsync-rules` |  | Disable the resource sync rules on the deployment feature flag if you don't have **Microsoft.Authorization/roleAssignment/write** permissions in the resource group. |
     | `--name` | String | Provide a name for your Azure IoT Operations instance. Otherwise, a default name is assigned. You can view the `instanceName` parameter in the command output. |
     | `--no-progress` |  | Disables the deployment progress display in the terminal. |
     | `--simulate-plc` |  | Include the OPC PLC simulator that ships with the OPC UA connector. |
     | `--sp-app-id`,<br>`--sp-object-id`,<br>`--sp-secret` | Service principal app ID, service principal object ID, and service principal secret | Include all or some of these parameters to use an existing service principal, app registration, and secret instead of allowing `init` to create new ones. For more information, see [Configure service principal and Key Vault manually](howto-manage-secrets.md#configure-service-principal-and-key-vault-manually). |

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
   | **MQTT broker configuration** | *Optional*: Replace the default settings for the MQTT broker. For more information, see [Configure core MQTT broker settings](../manage-mqtt-broker/howto-configure-availability-scale.md). |

1. Select **Next: Automation**.

1. On the **Automation** tab, provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Subscription** | Select the subscription that contains your Azure key vault. |
   | **Azure Key Vault** | Select your Azure key vault. Or, select **Create new**.<br><br>Ensure that your key vault has **Vault access policy** as its permission model. To check this setting, select **Manage selected vault** > **Settings** > **Access configuration**. |

   :::image type="content" source="./media/howto-deploy-iot-operations/deploy-automation.png" alt-text="A screenshot that shows the third tab for deploying Azure IoT Operations from the portal.":::

1. If you didn't prepare your Azure CLI environment as described in the prerequisites, do so now in a terminal of your choice:

   ```azurecli
   az upgrade
   az extension add --upgrade --name azure-iot-ops
   ```

1. Sign in to Azure CLI interactively with a browser even if you already signed in before. If you don't sign in interactively, you might get an error that says *Your device is required to be managed to access your resource* when you continue to the next step to deploy Azure IoT Operations.

   ```azurecli
   az login
   ```

1. Copy the [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init) command from the **Automation** tab in the Azure portal and run it in your terminal.

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

## Manage Azure IoT Operations

After deployment, you can use the Azure CLI and Azure portal to view and manage your Azure IoT Operations instance.

### List instances

#### [Azure CLI](#tab/cli)

Use the `az iot ops list` command to see all of the Azure IoT Operations instances in your subscription or resource group.

The basic command returns all instances in your subscription.

```azurecli
az iot ops list
```

To filter the results by resource group, add the `--resource-group` parameter.

```azurecli
az iot ops list --resource-group <RESOURCE_GROUP>
```

#### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure IoT Operations**.
1. Use the filters to view Azure IoT Operations instances based on subscription, resource group, and more.

---

### View instance

#### [Azure CLI](#tab/cli)

Use the `az iot ops show` command to view the properties of an instance.

```azurecli
az iot ops show --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP>
```

You can also use the `az iot ops show` command to view the resources in your Azure IoT Operations deployment in the Azure CLI. Add the `--tree` flag to show a tree view of the deployment that includes the specified Azure IoT Operations instance.

```azurecli
az iot ops show --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --tree
```

The tree view of a deployment looks like the following example:

```bash
MyCluster
├── extensions
│   ├── akvsecretsprovider
│   ├── azure-iot-operations-ltwgs
│   └── azure-iot-operations-platform-ltwgs
└── customLocations
    └── MyCluster-cl
        ├── resourceSyncRules
        └── resources
            ├── MyCluster-ops-init-instance
            └── MyCluster-observability
```

You can run `az iot ops check` on your cluster to assess health and configurations of individual Azure IoT Operations components. By default, the command checks MQ but you can [specify the service](/cli/azure/iot/ops#az-iot-ops-check-examples) with `--ops-service` parameter.

#### [Azure portal](#tab/portal)

You can view your Azure IoT Operations instance in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your Azure IoT Operations instance, or search for and select **Azure IoT Operations**.

1. Select the name of your Azure IoT Operations instance.

1. On the **Overview** page of your instance, the **Arc extensions** table displays the resources that were deployed to your cluster.

   :::image type="content" source="../get-started-end-to-end-sample/media/quickstart-deploy/view-instance.png" alt-text="Screenshot that shows the Azure IoT Operations instance on your Arc-enabled cluster." lightbox="../get-started-end-to-end-sample/media/quickstart-deploy/view-instance.png":::

---

### Update instance tags and description

#### [Azure CLI](#tab/cli)

Use the `az iot ops update` command to edit the tags and description parameters of your Azure IoT Operations instance. The values provided in the `update` command replace any existing tags or description

```azurecli
az iot ops update --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --desc "<INSTANCE_DESCRIPTION>" --tags <TAG_NAME>=<TAG-VALUE> <TAG_NAME>=<TAG-VALUE>
```

To delete all tags on an instance, set the tags parameter to a null value. For example:

```azurecli
az iot ops update --name <INSTANCE_NAME> --resource-group --tags ""
```

#### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your Azure IoT Operations instance, or search for and select **Azure IoT Operations**.

1. Select the name of your Azure IoT Operations instance.

1. On the **Overview** page of your instance, select **Add tags** or **edit** to modify tags on your instance.

---

## Uninstall Azure IoT Operations

The Azure CLI and Azure portal offer different options for uninstalling Azure IoT Operations.

If you want to delete an entire Azure IoT Operations deployment, use the Azure CLI.

If you want to delete an Azure IoT Operations instance but keep the related resources in the deployment, use the Azure portal.

### [Azure CLI](#tab/cli)

Use the [az iot ops delete](/cli/azure/iot/ops#az-iot-ops-delete) command to delete the entire Azure IoT Operations deployment from a cluster. The `delete` command evaluates the Azure IoT Operations related resources on the cluster and presents a tree view of the resources to be deleted. The cluster should be online when you run this command.

The `delete` command removes:

* The Azure IoT Operations instance
* Arc extensions
* Custom locations
* Resource sync rules
* Resources that you can configure in your Azure IoT Operations solution, like assets, MQTT broker, and dataflows.

```azurecli
az iot ops delete --cluster <CLUSTER_NAME> --resource-group <RESOURCE_GROUP>
```

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your Azure IoT Operations instance, or search for and select **Azure IoT Operations**.

1. Select the name of your Azure IoT Operations instance.

1. On the **Overview** page of your instance, select **Delete** your instance.

1. Review the list of resources that are and aren't deleted as part of this operation, then type the name of your instance and select **Delete** to confirm.

   :::image type="content" source="./media/howto-deploy-iot-operations/delete-instance.png" alt-text="A screenshot that shows deleting an Azure IoT Operations instance in the Azure portal.":::

---

## Update Azure IoT Operations

Currently, there's no support for updating an existing Azure IoT Operations deployment. Instead, uninstall and redeploy a new version of Azure IoT Operations.

1. Use the [az iot ops delete](/cli/azure/iot/ops#az-iot-ops-delete) command to delete the Azure IoT Operations deployment on your cluster.

   ```azurecli
   az iot ops delete --cluster <CLUSTER_NAME> --resource-group <RESOURCE_GROUP>
   ```

1. Update the CLI extension to get the latest Azure IoT Operations version.

   ```azurecli
   az extension update --name azure-iot-ops
   ```

1. Follow the steps in this article to deploy the newest version of Azure IoT Operations to your cluster.

   >[!TIP]
   >Add the `--ensure-latest` flag to the `az iot ops init` command to check that the latest Azure IoT Operations CLI version is installed and raise an error if an upgrade is available.

## Next steps

If your components need to connect to Azure endpoints like SQL or Fabric, learn how to [Manage secrets for your Azure IoT Operations Preview deployment](./howto-manage-secrets.md).
