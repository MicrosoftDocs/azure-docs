---
title: Deploy Azure IoT Operations to a cluster
description: Use the Azure CLI to deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 07/24/2024

#CustomerIntent: As an OT professional, I want to deploy Azure IoT Operations to a Kubernetes cluster.
---

# Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Deploy Azure IoT Operations Preview to a Kubernetes cluster using the Azure CLI. Once you have Azure IoT Operations deployed, then you can manage and deploy other workloads to your cluster.

* An Azure IoT Operations *deployment* describes all of the components and resources that enable the Azure IoT Operations scenario. These components and resources include:
  * An Azure IoT Operations instance
  * Arc extensions
  * Custom locations
  * Resource sync rules
  * Additional resources that you can configure in your Azure IoT Operations solution, like assets, MQTT broker, and dataflows.

* An Azure IoT Operations *instance* is one part of a deployment. It's the parent resource that bundles the suite of services that are defined in [What is Azure IoT Operations Preview?](../overview-iot-operations.md), like MQ, Akri, and OPC UA connector.

In this article, when we talk about deploying Azure IoT Operations we mean the full set of components that make up a *deployment*. Once the deployment exists, you can view, manage, and update the *instance*.

## Prerequisites

Cloud resources:

* An Azure subscription.

* Azure access permissions. At a minimum, have **Contributor** permissions in your Azure subscription. Depending on the deployment feature flag status you select, you might also need **Microsoft/Authorization/roleAssignments/write** permissions for the resource group that contains your Arc-enabled Kubernetes cluster. You can make a custom role in Azure role-based access control or assign a built-in role that grants this permission. For more information, see [Azure built-in roles for General](../../role-based-access-control/built-in-roles/general.md).

  If you *don't* have role assignment write permissions, you can still deploy Azure IoT Operations by disabling some features. This approach is discussed in more detail in the [Deploy](#deploy) section of this article.

  * In the Azure CLI, use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to give permissions. For example, `az role assignment create --assignee sp_name --role "Role Based Access Control Administrator" --scope subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup`

  * In the Azure portal, when you assign privileged admin roles to a user or principal, you're prompted to restrict access using conditions. For this scenario, select the **Allow user to assign all roles** condition in the **Add role assignment** page.

    :::image type="content" source="./media/howto-deploy-iot-operations/add-role-assignment-conditions.png" alt-text="Screenshot that shows assigning users highly privileged role access in the Azure portal.":::

* An Azure Key Vault that has the **Permission model** set to **Vault access policy**. You can check this setting in the **Access configuration** section of an existing key vault. If you need to create a new key vault, use the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command:

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

  If you've already deployed Azure IoT Operations to your cluster, uninstall those resources before continuing. For more information, see [Update Azure IoT Operations](#update-azure-iot-operations).

  Azure IoT Operations should work on any CNCF-conformant kubernetes cluster. Currently, Microsoft only supports K3s on Ubuntu Linux and WSL, or AKS Edge Essentials on Windows. Using Ubuntu in Windows Subsystem for Linux (WSL) is the simplest way to get a Kubernetes cluster for testing.

  Use the Azure IoT Operations extension for Azure CLI to verify that your cluster host is configured correctly for deployment by using the [verify-host](/cli/azure/iot/ops#az-iot-ops-verify-host) command on the cluster host:

  ```azurecli
  az iot ops verify-host
  ```

## Deploy

Use the Azure CLI to deploy Azure IoT Operations to your Arc-enabled Kubernetes cluster.

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

   If you want to name your Azure IoT Operations instance, include the `--name` parameter. Otherwise, a default name is assigned. You can view the `instanceName` parameter in the command output.

   If you don't have **Microsoft.Authorization/roleAssignment/write** permissions in the resource group, add the `--disable-rsync-rules` feature flag. This flag disables the resource sync rules on the deployment.

   If you want to use an existing service principal and app registration instead of allowing `init` to create new ones, include the `--sp-app-id,` `--sp-object-id`, and `--sp-secret` parameters. For more information, see [Configure service principal and Key Vault manually](howto-manage-secrets.md#configure-service-principal-and-key-vault-manually).

1. While the deployment is in progress, you can watch the resources being applied to your cluster. You can use kubectl commands to observe changes on the cluster. To view the pods on your cluster, run the following command:

   ```bash
   kubectl get pods -n azure-iot-operations
   ```

   It can take several minutes for the deployment to complete. Rerun the `get pods` command to refresh your view.

1. After the deployment is complete, use [az iot ops check](/cli/azure/iot/ops#az-iot-ops-check) to evaluate IoT Operations service deployment for health, configuration, and usability. The *check* command can help you find problems in your deployment and configuration.

   ```azurecli
   az iot ops check
   ```

   You can also check the configurations of topic maps, QoS, and message routes by adding the `--detail-level 2` parameter for a verbose view.

## Manage Azure IoT Operations

After deployment, you can use the Azure CLI and Azure portal to view and manage your Azure IoT Operations instance.

### List instances

Use the `az iot ops list` command to see all of the Azure IoT Operations instances in your subscription or resource group.

The basic command returns all instances in your subscription.

```azurecli
az iot ops list
```

Add the `--resource-group` parameter to filter the results.

```azurecli
az iot ops list --resource-group <RESOURCE_GROUP>
```

### View instance components

You can view your Azure IoT Operations instance in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your Azure IoT Operations instance.

1. From the **Overview** page of the resource group, select the name of your Azure IoT Operations instance.

1. On the **Overview** page of your instance, select the **Components** tab to view the resources that were deployed to your cluster..

   :::image type="content" source="../get-started-end-to-end-sample/media/quickstart-deploy/view-components.png" alt-text="Screenshot that shows the deployed components on your Arc-enabled cluster.":::

> [!TIP]
> You can run `az iot ops check` on your cluster to assess health and configurations of individul Azure IoT Operations components. By default, the command checks MQ but you can [specifiy the service](/cli/azure/iot/ops#az-iot-ops-check-examples) with `--ops-service` parameter.

### Update instance tags and description

Use the `az iot ops update` command to edit the tags and description parameters of your Azure IoT Operations instance.

```azurecli
az iot ops update --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --desc "<INSTANCE_DESCRIPTION>" --tags <TAG_NAME>=<TAG-VALUE>
```

### View deployment resources

You can view the resources in your Azure IoT Operations deployment in the Azure CLI. Use the `az iot ops show` command to show a tree view of the deployment.

```azurecli
az iot ops show --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --tree
```

## Uninstall Azure IoT Operations

Use the [az iot ops delete](/cli/azure/iot/ops#az-iot-ops-delete) command to delete the entire Azure IoT Operations deployment from a cluster. The `delete` command evaluates the Azure IoT Operations related resources on the cluster and presents a tree view of the resources to be deleted. The cluster should be online prior to running this command.

The `delete` command removes:

* The Azure IoT Operations instance
* Arc extensions
* Custom locations
* Resource sync rules
* Additional resources that you can configure in your Azure IoT Operations solution, like assets, MQTT broker, and dataflows.

```azurecli
az iot ops delete --cluster <CLUSTER_NAME> --resource-group <RESOURCE_GROUP>
```

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
