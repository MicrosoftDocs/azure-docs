---
title: Manage, update, or uninstall
description: Use the Azure CLI or Azure portal to manage your Azure IoT Operations instances, including updating and uninstalling.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 10/24/2024

#CustomerIntent: As an OT professional, I want to manage Azure IoT Operations instances.
---

# Manage the lifecycle of an Azure IoT Operations instance

Use the Azure CLI and Azure portal to manage, uninstall, or update Azure IoT Operations instances.

## Prerequisites

* An Azure IoT Operations instance deployed to a cluster. For more information, see [Deploy Azure IoT Operations](./howto-deploy-iot-operations.md).

* Azure CLI installed on your development machine. This scenario requires Azure CLI version 2.64.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

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

1. On the **Overview** page of your instance, the **Arc extensions** table displays the resources that were deployed to your cluster.

   :::image type="content" source="../get-started-end-to-end-sample/media/quickstart-deploy/view-instance.png" alt-text="Screenshot that shows the Azure IoT Operations instance on your Arc-enabled cluster." lightbox="../get-started-end-to-end-sample/media/quickstart-deploy/view-instance.png":::

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

### Update instance tags and description

#### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your Azure IoT Operations instance, or search for and select **Azure IoT Operations**.

1. Select the name of your Azure IoT Operations instance.

1. On the **Overview** page of your instance, select **Add tags** or **edit** to modify tags on your instance.

#### [Azure CLI](#tab/cli)

Use the `az iot ops update` command to edit the tags and description parameters of your Azure IoT Operations instance. The values provided in the `update` command replace any existing tags or description

```azurecli
az iot ops update --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --desc "<INSTANCE_DESCRIPTION>" --tags <TAG_NAME>=<TAG-VALUE> <TAG_NAME>=<TAG-VALUE>
```

To delete all tags on an instance, set the tags parameter to a null value. For example:

```azurecli
az iot ops update --name <INSTANCE_NAME> --resource-group --tags ""
```

---

### Manage components

Each Azure IoT Operations instance includes several components, like the MQTT broker, connector for OPC UA, and dataflows. To learn more about managing these components, see their respective articles. For example, to manage the MQTT broker, start with [Broker overview](../manage-mqtt-broker/overview-broker.md).

### (Preview) Manage components using Kubernetes deployment manifests

In general, Azure IoT Operations uses the Azure Arc platform to provide a hybrid cloud experience where you can manage the configuration through Azure Resource Manager (ARM) and front-end tools like the Azure portal, Bicep, and the Azure CLI.

However, you can also manage the components of Azure IoT Operations using YAML Kubernetes deployment manifests. This means you can use tools like `kubectl` to manage some components of Azure IoT Operations. This feature is in preview and has some limitations:

- Only some components support using Kubernetes deployment manifests. These components are the [MQTT broker](../manage-mqtt-broker/overview-broker.md) and [dataflows](../connect-to-cloud/overview-dataflow.md). Other components like the connector for OPC UA and Akri services don't support this feature.
- Unless Azure IoT Operations is [deployed with resource sync enabled using `az iot ops create --enable-rsync`](/cli/azure/iot/ops#az-iot-ops-create), changes made to the resources using Kubernetes deployment manifests are not synced to Azure. To learn more about resource sync, see [Resource sync](/azure/azure-arc/data/resource-sync).
- Even if resource sync is enabled, brand new resources created using Kubernetes deployment manifests are not synced to Azure. Only changes to existing resources are synced.

## Uninstall

The Azure CLI and Azure portal offer different options for uninstalling Azure IoT Operations.

The Azure portal steps can delete an Azure IoT Operations instance, but can't affect the related resources in the deployment. If you want to delete the entire deployment, use the Azure CLI.

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your Azure IoT Operations instance, or search for and select **Azure IoT Operations**.

1. Select the name of your Azure IoT Operations instance.

1. On the **Overview** page of your instance, select **Delete**.

1. Review the list of resources that are and aren't deleted as part of this operation, then type the name of your instance and select **Delete** to confirm.

   :::image type="content" source="./media/howto-deploy-iot-operations/delete-instance.png" alt-text="A screenshot that shows deleting an Azure IoT Operations instance in the Azure portal.":::

### [Azure CLI](#tab/cli)

Use the [az iot ops delete](/cli/azure/iot/ops#az-iot-ops-delete) command to delete the entire Azure IoT Operations deployment from a cluster. The `delete` command evaluates the Azure IoT Operations related resources on the cluster and presents a tree view of the resources to be deleted. The cluster should be online when you run this command.

The `delete` command streamlines the redeployment of Azure IoT Operations to the same cluster. It undoes the `create` command so that you can run `create`, `delete`, `create` again and so on without having to rerun `init`.

The `delete` command removes:

* The Azure IoT Operations instance
* Arc extensions
* Custom locations
* Resource sync rules
* Resources that you can configure in your Azure IoT Operations solution, like assets, MQTT broker, and dataflows.

```azurecli
az iot ops delete --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP>
```

To delete the instance and also remove the Azure IoT Operations dependencies (the output of `init`), add the flag `--include-deps`.

```azurecli
az iot ops delete --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --include-deps
```

---
