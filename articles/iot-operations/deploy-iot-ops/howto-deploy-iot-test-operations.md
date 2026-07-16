---
title: Deploy Azure IoT Operations to a Test Cluster
description: Use the Azure portal to deploy Azure IoT Operations to test an Arc-enabled Kubernetes cluster.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 11/18/2025
ai-usage: ai-assisted

#CustomerIntent: As an OT professional, I want to deploy Azure IoT Operations to a Kubernetes cluster for testing and evaluation scenarios, so that I can evaluate the solution before deploying it to production.
---

# Deploy Azure IoT operations to a test cluster

Learn how to deploy Azure IoT Operations to a test cluster, which is an Arc-enabled Kubernetes cluster that you can use for testing and evaluation scenarios.

If you want to deploy Azure IoT Operations to a production cluster, see [Deploy Azure IoT Operations to a production cluster](./howto-deploy-iot-operations.md).

## Before you begin

[!INCLUDE [deploy-iot-ops-deployments-instances](../includes/deploy-iot-ops-deployments-instances.md)]

## Prerequisites

Cloud resources:

[!INCLUDE [prereq-azure-subscription](../includes/prereq-azure-subscription.md)]

* Azure access permissions. For more information, see [Deployment overview > Required permissions](overview-deploy.md#required-permissions).

Development resources:

[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

A cluster host:

* Have an Azure Arc-enabled Kubernetes cluster with the custom location and workload identity features enabled. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md).

  If you deployed Azure IoT Operations to your cluster previously, uninstall those resources before continuing. For more information, see [Update Azure IoT Operations](../manage-iot-ops/howto-manage-update-uninstall.md#uninstall).

## Automatic cardinality

To automatically determine the initial cardinality during deployment, omit the `cardinality` field in the Broker resource. The MQTT broker operator deploys the appropriate number of pods based on the number of available nodes at the time of deployment. This capability is useful for nonproduction scenarios where you don't need to fine-tune high availability or scale settings.

> [!IMPORTANT]
> Automatic cardinality is not autoscaling. The operator determines the initial number of pods to deploy based only on the cluster hardware at deployment time. A new deployment is required if cardinality settings need to change.

> [!NOTE]
> Automatic cardinality isn't supported when you deploy IoT Operations through the Azure portal. Use the Azure CLI with the `--broker-config-file` flag instead.

To use automatic cardinality, prepare a Broker configuration file in JSON format that omits the `cardinality` field. For example, set only the memory profile:

```json
{
  "memoryProfile": "Medium"
}
```

Then deploy with the `--broker-config-file` flag (other parameters omitted for brevity):

```azurecli
az iot ops create ... --broker-config-file <FILE>.json
```

For more information, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config).

## Deploy in Azure portal

### Basics

[!INCLUDE [deploy-iot-ops-portal-basics](../includes/deploy-iot-ops-portal-basics.md)]

### Configuration

1. On the **Configuration** tab, provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Azure IoT Operations name** | *Optional*: Replace the default name for the Azure IoT Operations instance. |
   | **MQTT broker configuration** | *Optional*: Edit the default settings for the MQTT broker. In Azure portal it's possible to configure [cardinality](../deployment-plan/deployment-planning.md#understand-broker-cardinality) and [memory profile](../deployment-plan/deployment-planning.md#choose-your-memory-profile) settings. To configure other settings including disk-backed message buffer and advanced MQTT client options, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config). |
   | **Data flow profile configuration** | *Optional*: Edit the default settings for data flows. For more information, see [Configure data flow profile](../connect-to-cloud/howto-configure-dataflow-profile.md). |

   :::image type="content" source="./media/howto-deploy-iot-test-operations/deploy-configuration.png" alt-text="A screenshot that shows the second tab for deploying Azure IoT Operations from the portal." lightbox="./media/howto-deploy-iot-test-operations/deploy-configuration.png":::

1. Select **Next: Dependency management**.

### Dependency management

[!INCLUDE [deploy-iot-ops-portal-dependency-management](../includes/deploy-iot-ops-portal-dependency-management.md)]

### Deployment options

1. On the **Dependency management** tab, select the **Test settings** deployment option. This option uses default settings that are recommended for testing purposes.

   :::image type="content" source="./media/howto-deploy-iot-test-operations/deploy-dependency-management-test.png" alt-text="A screenshot that shows selecting test settings on the third tab for deploying Azure IoT Operations from the portal." lightbox="./media/howto-deploy-iot-test-operations/deploy-dependency-management-test.png":::

1. Select **Next: Automation**.

## Run Azure CLI commands

[!INCLUDE [deploy-iot-ops-cli-commands-intro](../includes/deploy-iot-ops-cli-commands-intro.md)]

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
    > The `init` command only needs to be run once per cluster. If you followed the optional prerequisite to set up your own certificate authority issuer, follow the steps in [Bring your own issuer](howto-bring-your-own-issuer.md#bring-your-own-issuer).

    This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

1. To deploy Azure IoT Operations, copy and run the provided [az iot ops create](/cli/azure/iot/ops#az-iot-ops-create) command. This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

1. Once all of the Azure CLI commands complete successfully, you can close the **Install Azure IoT Operations** wizard.

Once the `create` command completes successfully, you have a working Azure IoT Operations instance running on your cluster. At this point, your instance is configured for most testing and evaluation scenarios.

## Verify deployment

[!INCLUDE [deploy-iot-ops-verify-deployment](../includes/deploy-iot-ops-verify-deployment.md)]

## Next steps

- [Configure observability](howto-configure-observability.md) to set up monitoring and dashboards.
- The Azure IoT Operations instance you deployed is configured for testing scenarios. If you want to enable secure settings and prepare the instance for production scenarios, follow the steps in [Enable secure settings on an existing Azure IoT Operations instance](../secure-iot-ops/howto-enable-secure-settings.md).


