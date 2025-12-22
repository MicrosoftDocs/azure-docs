---
title: Deploy Azure IoT Operations to a Test Cluster
description: Use the Azure portal to deploy Azure IoT Operations to test an Arc-enabled Kubernetes cluster.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 11/18/2025

#CustomerIntent: As an OT professional, I want to deploy Azure IoT Operations to a Kubernetes cluster for testing and evaluation scenarios, so that I can evaluate the solution before deploying it to production.
---

# Deploy Azure IoT operations to a test cluster

Learn how to deploy Azure IoT Operations to a test cluster, which is an Arc-enabled Kubernetes cluster that you can use for testing and evaluation scenarios.

If you want to deploy Azure IoT Operations to a production cluster, see [Deploy Azure IoT Operations to a production cluster](./howto-deploy-iot-operations.md).

## Before you begin

This article discusses Azure IoT Operations *deployments* and *instances*, which are two different concepts:

* An Azure IoT Operations *deployment* describes all of the components and resources that enable the Azure IoT Operations scenario. These components and resources include:
  * An Azure IoT Operations instance
  * Arc extensions
  * Custom locations
  * Resources that you can configure in your Azure IoT Operations solution, like assets and devices.

* An Azure IoT Operations *instance* is the parent resource that bundles the suite of services that are defined in [What is Azure IoT Operations?](../overview-iot-operations.md) like MQTT broker, data flows, and connector for OPC UA.

When we talk about deploying Azure IoT Operations, we mean the full set of components that make up a *deployment*. Once the deployment exists, you can view, manage, and update the *instance*.

## Prerequisites

Cloud resources:

* An Azure subscription.

* Azure access permissions. For more information, see [Deployment details > Required permissions](overview-deploy.md#required-permissions).

Development resources:

* Azure CLI installed on your development machine. This scenario requires Azure CLI version 2.53.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

A cluster host:

* Have an Azure Arc-enabled Kubernetes cluster with the custom location and workload identity features enabled. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md).

  If you deployed Azure IoT Operations to your cluster previously, uninstall those resources before continuing. For more information, see [Update Azure IoT Operations](./howto-manage-update-uninstall.md#uninstall).


## Deploy in Azure portal

The Azure portal deployment experience is a helper tool that generates a deployment command based on your resources and configuration. The final step is to run an Azure CLI command, so you still need the Azure CLI prerequisites described in the previous section.

1. Sign in to [Azure portal](https://portal.azure.com).
1. In the search box, search for and select **Azure IoT Operations**.

1. Select **Create**.

1. On the **Basics** tab, provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Subscription** | Select the subscription that contains your Arc-enabled cluster. |
   | **Resource group** | Select the resource group that contains your Arc-enabled cluster. |
   | **Cluster name** | Select the cluster that you want to deploy Azure IoT Operations to. |
   | **Custom location name** | *Optional*: Replace the default name for the custom location. |
   | **Deployment version**| Select **1.2 (latest)** version. For more information, see [IoT Operations versions](https://aka.ms/aio-versions).|

1. Select **Next: Configuration**.

1. On the **Configuration** tab, provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Azure IoT Operations name** | *Optional*: Replace the default name for the Azure IoT Operations instance. |
   | **MQTT broker configuration** | *Optional*: Edit the default settings for the MQTT broker. In Azure portal it's possible to [configure cardinality and memory profile settings](../manage-mqtt-broker/howto-configure-availability-scale.md). To configure other settings including disk-backed message buffer and advanced MQTT client options, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config). |
   | **Data flow profile configuration** | *Optional*: Edit the default settings for data flows. For more information, see [Configure data flow profile](../connect-to-cloud/howto-configure-dataflow-profile.md). |

   :::image type="content" source="./media/howto-deploy-iot-test-operations/deploy-configuration.png" alt-text="A screenshot that shows the second tab for deploying Azure IoT Operations from the portal." lightbox="./media/howto-deploy-iot-test-operations/deploy-configuration.png":::

1. Select **Next: Dependency management**.

1. On the **Dependency management** tab, select an existing schema registry or use these steps to create one:

   1. Select **Create new**.

   1. Provide a **Schema registry name** and **Schema registry namespace**.

   1. Select **Select Azure Storage container**.

   1. Choose a storage account from the list of hierarchical namespace-enabled accounts, or select **Create** to create one.

      Schema registry requires an Azure Storage account with hierarchical namespace and public network access enabled. When creating a new storage account, choose a **General purpose v2** storage account type and set **Hierarchical namespace** to **Enabled**.

      For more information on configuring your storage account, see [Production deployment guidelines](concept-production-guidelines.md#schema-registry-and-storage).

   1. Select a container in your storage account or select **Container** to create one.

   1. Select **Apply** to confirm the schema registry configurations.

1. Azure IoT Operations uses *namespaces* to organize assets and devices. Each Azure IoT Operations instance uses a single namespace for its assets and devices. On the **Dependency management** tab, select an existing Azure Device Registry namespace or use these steps to create one:

   1. Select **Create new**.

   1. On the **Basics** tab, provide the following information:

      | Parameter | Value |
      | --------- | ----- |
      | **Subscription** | Select your subscription. |
      | **Resource group** | Select the resource group that contains your Azure IoT Operations instance. |
      | **Name** | Provide a unique name for your namespace. |
      | **Region** | Select the Azure region to store your namespace. |

      Select **Next** to continue.

   1. On the **Tags** tab, you can optionally add tags to your namespace. Select **Next** to continue.

   1. On the **Review + create** tab, review your configurations and select **Create** to create the namespace.

   1. Back on the **Dependency management** tab, select the newly created namespace from the list.

1. On the **Dependency management** tab, select the **Test settings** deployment option. This option uses default settings that are recommended for testing purposes.

   :::image type="content" source="./media/howto-deploy-iot-test-operations/deploy-dependency-management-test.png" alt-text="A screenshot that shows selecting test settings on the third tab for deploying Azure IoT Operations from the portal." lightbox="./media/howto-deploy-iot-test-operations/deploy-dependency-management-test.png":::

1. Select **Next: Automation**.

## Run Azure CLI commands

The final step in the Azure portal deployment experience is to run a set of Azure CLI commands to deploy Azure IoT Operations to your cluster. The commands are generated based on the information you provided in the previous steps.

One at a time, run each Azure CLI command on the **Automation** tab in a terminal:

1. Sign in to Azure CLI interactively with a browser even if you already signed in before. If you don't sign in interactively, you might get an error that says *Your device is required to be managed to access your resource*.

    ```azurecli
    az login
    ```

1. Install the latest Azure IoT Operations CLI extension if you haven't already.

    ```azurecli
    az extension add --upgrade --name azure-iot-ops
    ```

1. Copy and run the provided [az iot ops schema registry create](/cli/azure/iot/ops/schema/registry#az-iot-ops-schema-registry-create) command to create a schema registry which is used by Azure IoT Operations components. If you chose to use an existing schema registry, this command isn't displayed on the **Automation** tab.

1. Prepare the cluster for Azure IoT Operations deployment. Copy and run the provided [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init) command.

    > [!TIP]
    > The `init` command only needs to be run once per cluster. If you followed the optional prerequisite to set up your own certificate authority issuer, follow the steps in [Bring your own issuer](../secure-iot-ops/howto-manage-certificates.md#bring-your-own-issuer).

    This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

1. To deploy Azure IoT Operations, copy and run the provided [az iot ops create](/cli/azure/iot/ops#az-iot-ops-create) command. This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

1. Once all of the Azure CLI commands complete successfully, you can close the **Install Azure IoT Operations** wizard.

Once the `create` command completes successfully, you have a working Azure IoT Operations instance running on your cluster. At this point, your instance is configured for most testing and evaluation scenarios.

## Verify deployment

After the deployment is complete, run [az iot ops check](/cli/azure/iot/ops#az-iot-ops-check) to evaluate IoT Operations service deployment for health, configuration, and usability. The `check` command can help you find problems in your deployment and configuration.

```azurecli
az iot ops check
```

The `check` command displays a warning about missing data flows, which is normal and expected until you create a data flow. For more information, see [Process and route data with data flows](../connect-to-cloud/overview-dataflow.md).

You can check the configurations of topic maps, QoS, and message routes by adding the `--detail-level 2` parameter to the `check` command for a verbose view.

You can view all versions of the Azure IoT Operations CLI extension that are available by running the following command:

```azurecli
az iot ops get-versions
```

## Next steps

The Azure IoT Operations instance you deployed is configured for testing scenarios. If you want to enable secure setting and prepare the instance for production scenarios, follow the steps in [Enable secure settings on an existing Azure IoT Operations instance](./howto-enable-secure-settings.md).


