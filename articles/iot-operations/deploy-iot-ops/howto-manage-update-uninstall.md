---
title: Manage, update, or uninstall
description: Use the Azure CLI or Azure portal to manage your Azure IoT Operations instances, including updating and uninstalling.
author: SoniaLopezBravo
ms.author: sonialopez
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 05/20/2025

#CustomerIntent: As an OT professional, I want to manage Azure IoT Operations instances.
---

# Manage the lifecycle of an Azure IoT Operations instance

Use the Azure CLI and Azure portal to manage, uninstall, or update Azure IoT Operations instances.

## Prerequisites

* An Azure IoT Operations instance deployed to a cluster. For more information, see [Deploy Azure IoT Operations](./howto-deploy-iot-operations.md).

* Azure CLI installed on your development machine. This scenario requires Azure CLI version 2.53.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```azurecli
  az extension add --upgrade --name azure-iot-ops
  ```

## Manage

After deployment, you can use the Azure CLI and Azure portal to view and manage your Azure IoT Operations instance.

### List instances

#### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure IoT Operations**.
1. Use the filters to view Azure IoT Operations instances based on subscription, resource group, and more.

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

---

### View instance

#### [Azure portal](#tab/portal)

You can view your Azure IoT Operations instance in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your Azure IoT Operations instance, or search for and select **Azure IoT Operations**.

1. Select the name of your Azure IoT Operations instance.

1. On the **Overview** page of your instance, you can see the properties of your instance. For example, you can see the status of the **preview connectors**, which can be enabled or disabled. To change the status of the preview connectors, click on **Edit**. 

    :::image type="content" source="media/howto-deploy-iot-operations/view-enable-connectors.png" alt-text="Screenshot that shows the Azure IoT Operations instance on your Arc-enabled cluster and how to enable connectors."lightbox="media/howto-deploy-iot-operations/view-enable-connectors.png":::

    This action opens a configuration panel where you can enable or disable the [ONVIF preview connector](../discover-manage-assets/overview-onvif-connector.md).

1. The **Resource Summary** tab displays the resources that were deployed to your cluster.

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

---

### (Preview) Clone instance

> [!NOTE]
> The clone feature is in preview and under development.

#### [Azure portal](#tab/portal)

Currently, the Azure portal doesn't support cloning an Azure IoT Operations instance. You can use the Azure CLI to clone an instance.

#### [Azure CLI](#tab/cli)

Use the [`az iot ops clone`](/cli/azure/iot/ops#az-iot-ops-clone) command to create a new Azure IoT Operations instance based on an existing one. You can apply the output of clone to another connected cluster, which is referred to as replication. You can also save the clone to a local directory for later use and perform some configuration changes before applying it to a cluster. 

For more information, see the [clone command wiki page](https://aka.ms/aio-clone).

To clone an instance to another cluster, run:

```azurecli
az iot ops clone --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --to-cluster-id <CLUSTER_ID> 
```

To customize the replication to another cluster, use `--param` and specify the parameters you want to change in the format `key=value`. For example, to change the location of the cloned instance, run:

```azurecli
az iot ops clone --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --to-cluster-id <CLUSTER_ID> --param location=eastus
```

To clone an instance to a local directory, run:

```azurecli
az iot ops clone --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --to-dir <DIRECTORY>
```

> [!TIP]
> To clone an instance to the current directory, run `--to-dir .`

To clone an instance to a cluster, but splitting and serially applying asset related sub-deployments, run:

```azurecli
az iot ops clone --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --to-cluster-id <CLUSTER_ID> --mode linked
```

---

### Update instances and configuration

#### [Azure portal](#tab/portal2)

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your Azure IoT Operations instance, or search for and select **Azure IoT Operations**.

1. Select the name of your Azure IoT Operations instance.

1. On the **Overview** page of your instance, select **Add tags** or **edit** to modify tags on your instance.

#### [Azure CLI](#tab/cli2)

Use the [az iot ops update](/cli/azure/iot/ops#az-iot-ops-update) command to edit the features of your Azure IoT Operations instance.

To update tags and description parameters of an instance, run:

```azurecli
az iot ops update --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --desc "<INSTANCE_DESCRIPTION>" --tags <TAG_NAME>=<TAG-VALUE> <TAG_NAME>=<TAG-VALUE>
```

To delete all tags on an instance, set the tags parameter to a null value. For example:

```azurecli
az iot ops update --name <INSTANCE_NAME> --resource-group --tags ""
```

To enable the preview connector configuration, run: 

```azurecli
az iot ops update --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --feature connectors.settings.preview=Enabled 
```

To disable the preview connector configuration, run: 

```azurecli
az iot ops update --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --feature connectors.settings.preview=Disabled  
```

---

### Manage components

Each Azure IoT Operations instance includes several components, like the MQTT broker, connector for OPC UA, and data flows. To learn more about managing these components, see their respective articles. For example, to manage the MQTT broker, start with [Broker overview](../manage-mqtt-broker/overview-broker.md).

### (Preview) Manage components using Kubernetes deployment manifests

In general, Azure IoT Operations uses the Azure Arc platform to provide a hybrid cloud experience where you can manage the configuration through Azure Resource Manager (ARM) and front-end tools like the Azure portal, Bicep, and the Azure CLI.

However, you can also manage the components of Azure IoT Operations using YAML Kubernetes deployment manifests. This means you can use tools like `kubectl` to manage some components of Azure IoT Operations. This feature is in preview and has some limitations:

- Only some components support using Kubernetes deployment manifests. These components are the [MQTT broker](../manage-mqtt-broker/overview-broker.md) and [data flows](../connect-to-cloud/overview-dataflow.md). Other components like the connector for OPC UA and Akri services don't support this feature.
- Unless you enable resource sync in Azure IoT Operations using [`az iot ops rsync enable`](/cli/azure/iot/ops#az-iot-ops-rsync), changes made to the resources using Kubernetes deployment manifests are not synced to Azure. To learn more about resource sync, see [Resource sync](/azure/azure-arc/data/resource-sync).
- Even if resource sync is enabled, brand new resources created using Kubernetes deployment manifests are not synced to Azure. Only changes to existing resources are synced.

## Uninstall

The Azure IoT Operations CLI and Azure portal offer different options for uninstalling Azure IoT Operations.

> [!IMPORTANT]
> If you want to clean up your cluster and resource group, it's recommended to first remove Azure IoT Operations from the cluster using the Azure IoT Operations CLI commands in the following section. Then, you can delete the resource group. Deleting the resource group directly will leave orphaned resources on the cluster.


### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your Azure IoT Operations instance, or search for and select **Azure IoT Operations**.

1. Select the name of your Azure IoT Operations instance.

1. On the **Overview** page of your instance, select **Delete**.

1. Review the list of resources that are and aren't deleted as part of this operation, then type the name of your instance and select **Delete** to confirm.

   :::image type="content" source="./media/howto-deploy-iot-operations/delete-instance.png" alt-text="A screenshot that shows deleting an Azure IoT Operations instance in the Azure portal.":::

> [!NOTE]
> Deleting the Azure IoT Operations instance in the Azure portal doesn't remove the dependencies that were created when you deployed Azure IoT Operations. To remove these dependencies, use the `az iot ops delete --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --include-deps` command described in the Azure CLI procedure.

### [Azure CLI](#tab/cli)

Use the [az iot ops delete](/cli/azure/iot/ops#az-iot-ops-delete) command to delete the entire Azure IoT Operations deployment from a cluster. The `delete` command evaluates the Azure IoT Operations related resources on the cluster and presents a tree view of the resources to be deleted. The cluster should be online when you run this command.

The `delete` command streamlines the redeployment of Azure IoT Operations to the same cluster. It undoes the `create` command so that you can run `create`, `delete`, `create` again and so on without having to rerun `init`.

The `delete` command removes:

* The Azure IoT Operations instance
* Arc extensions
* Custom locations
* Resource sync rules
* Resources that you can configure in your Azure IoT Operations solution, like assets, MQTT broker, and data flows.

```azurecli
az iot ops delete --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP>
```

To delete the instance and also remove the Azure IoT Operations dependencies (the output of `init`), add the flag `--include-deps`.

```azurecli
az iot ops delete --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --include-deps
```

---
