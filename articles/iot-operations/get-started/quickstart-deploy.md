---
title: "Quickstart: Deploy Azure IoT Operations Preview"
description: "Quickstart: Use Azure IoT Orchestrator to deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster."
author: kgremban
ms.author: kgremban
ms.subservice: orchestrator
ms.topic: quickstart
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 05/02/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you deploy a suite of IoT services to an Azure Arc-enabled Kubernetes cluster so that you can remotely manage your devices and workloads. Azure IoT Operations is a digital operations suite of services that includes Azure IoT Orchestrator Preview. This quickstart guides you through using Orchestrator to deploy these services to a Kubernetes cluster. At the end of the quickstart, you have a cluster that you can manage from the cloud that generates sample data to use in the following quickstarts.

The services deployed in this quickstart include:

* [Azure IoT Orchestrator Preview](../deploy-custom/overview-orchestrator.md)
* [Azure IoT MQ Preview](../manage-mqtt-connectivity/overview-iot-mq.md)
* [Azure IoT OPC UA Broker Preview](../manage-devices-assets/overview-opcua-broker.md) with simulated thermostat asset to start generating data
* [Azure IoT Data Processor Preview](../process-data/overview-data-processor.md) with a demo pipeline to start routing the simulated data
* [Azure IoT Akri Preview](../manage-devices-assets/overview-akri.md)
* [Azure Device Registry Preview](../manage-devices-assets/overview-manage-assets.md#manage-assets-as-azure-resources-in-a-centralized-registry)
* [Azure IoT Layered Network Management Preview](../manage-layered-network/overview-layered-network.md)
* [Observability](../monitor/howto-configure-observability.md)

The following quickstarts in this series build on this one to define sample assets, data processing pipelines, and visualizations. If you want to deploy Azure IoT Operations to a cluster such as AKS Edge Essentials in order to run your own workloads, see [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md?tabs=aks-edge-essentials) and [Deploy Azure IoT Operations Preview extensions to a Kubernetes cluster](../deploy-iot-ops/howto-deploy-iot-operations.md).

## Before you begin

This series of quickstarts is intended to help you get started with Azure IoT Operations as quickly as possible so that you can evaluate an end-to-end scenario. In a true development or production environment, these tasks would be performed by multiple teams working together and some tasks might require elevated permissions.

For the best new user experience, we recommend using an [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) so that you have owner permissions over the resources in these quickstarts. We also provide steps to use GitHub Codespaces as a virtual environment in which you can quickly begin deploying resources and running commands without installing new tools on your own machines.

## Prerequisites

For this quickstart, you create a Kubernetes cluster to receive the Azure IoT Operations deployment.

If you want to rerun this quickstart with a cluster that already has Azure IoT Operations deployed to it, refer to the steps in [Clean up resources](#clean-up-resources) to uninstall Azure IoT Operations before continuing.

Before you begin, prepare the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A [GitHub](https://github.com) account.

* Visual Studio Code installed on your development machine. For more information, see [Download Visual Studio Code](https://code.visualstudio.com/download).

## What problem will we solve?

Azure IoT Operations is a suite of data services that run on Kubernetes clusters. You want these clusters to be managed remotely from the cloud, and able to securely communicate with cloud resources and endpoints. We address these concerns with the following tasks in this quickstart:

1. Create a Kubernetes cluster and connect it to Azure Arc for remote management.
1. Create an Azure Key Vault to manage secrets for your cluster.
1. Configure your cluster with a secrets store and service principal to communicate with cloud resources.
1. Deploy Azure IoT Operations to your cluster.

## Connect a Kubernetes cluster to Azure Arc

Azure IoT Operations should work on any Kubernetes cluster that conforms to the Cloud Native Computing Foundation (CNCF) standards. For speed and convenience, this quickstart uses GitHub Codespaces to host your cluster.

> [!IMPORTANT]
> Codespaces are easy to set up quickly and tear down later, but they're not suitable for performance evaluation or scale testing. Use GitHub Codespaces for exploration only. To learn how to deploy Azure IoT Operations to a production cluster such as AKS Edge Essentials, see [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md?tabs=aks-edge-essentials).

In this section, you create a new cluster and connect it to Azure Arc. If you want to reuse a cluster that you've deployed Azure IoT Operations to before, refer to the steps in [Clean up resources](#clean-up-resources) to uninstall Azure IoT Operations before continuing.

[!INCLUDE [prepare-codespaces](../includes/prepare-codespaces.md)]

[!INCLUDE [connect-cluster-codespaces](../includes/connect-cluster-codespaces.md)]

## Verify cluster

Use the Azure IoT Operations extension for Azure CLI to verify that your cluster host is configured correctly for deployment by using the [verify-host](/cli/azure/iot/ops#az-iot-ops-verify-host) command on the cluster host:

```azurecli
az iot ops verify-host
```

This helper command checks connectivity to Azure Resource Manager and Microsoft Container Registry endpoints.

## Deploy Azure IoT Operations Preview

In this section, you use the [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init) command to configure your cluster so that it can communicate securely with your Azure IoT Operations components and key vault, then deploy Azure IoT Operations.

Run the following CLI commands in your Codespaces terminal.

1. Create a key vault. For this scenario, we'll use the same name and resource group as your cluster. Keyvault names have a maximum length of 24 characters, so the following command truncates the `CLUSTER_NAME`environment variable if necessary.

   ```azurecli
   az keyvault create --enable-rbac-authorization false --name ${CLUSTER_NAME:0:24} --resource-group $RESOURCE_GROUP
   ```

   >[!TIP]
   > You can use an existing key vault for your secrets, but verify that the **Permission model** is set to **Vault access policy**. You can check this setting in the Azure portal in the **Access configuration** section of an existing key vault. Or use the [az keyvault show](/cli/azure/keyvault#az-keyvault-show) command to check that `enableRbacAuthorization` is false.

1. Deploy Azure IoT Operations. This command takes several minutes to complete:

   ```azurecli
   az iot ops init --simulate-plc --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP --kv-id $(az keyvault show --name ${CLUSTER_NAME:0:24} -o tsv --query id)
   ```

   If you get an error that says *Your device is required to be managed to access your resource*, run `az login` again and make sure that you sign in interactively with a browser.

   >[!TIP]
   >If you've run `az iot ops init` before, it automatically created an app registration in Microsoft Entra ID for you. You can reuse that registration rather than creating a new one each time. To use an existing app registration, add the optional parameter `--sp-app-id <APPLICATION_CLIENT_ID>`.

## View resources in your cluster

While the deployment is in progress, you can watch the resources being applied to your cluster. You can use kubectl commands to observe changes on the cluster or, since the cluster is Arc-enabled, you can use the Azure portal.

To view the pods on your cluster, run the following command:

```console
kubectl get pods -n azure-iot-operations
```

It can take several minutes for the deployment to complete. Continue running the `get pods` command to refresh your view.

To view your cluster on the Azure portal, use the following steps:

1. In the [Azure portal](https://portal.azure.com), navigate to the resource group that contains your cluster.

1. From the **Overview** of the resource group, select the name of your cluster.

1. On your cluster, select **Extensions** from the **Settings** section of the menu.

   :::image type="content" source="./media/quickstart-deploy/view-extensions.png" alt-text="Screenshot that shows the deployed extensions on your Arc-enabled cluster.":::

   You can see that your cluster is running extensions of the type **microsoft.iotoperations.x**, which is the group name for all of the Azure IoT Operations components and the orchestration service. These extensions have a unique suffix that identifies your deployment. In the previous screenshot, this suffix is **-z2ewy**.

   There's also an extension called **akvsecretsprovider**. This extension is the secrets provider that you configured and installed on your cluster with the `az iot ops init` command. You might delete and reinstall the Azure IoT Operations components during testing, but keep the secrets provider extension on your cluster.

1. Make a note of the full name of the extension called **mq-...**. You use this name in the following quickstarts.

## How did we solve the problem?

In this quickstart, you configured your Arc-enabled Kubernetes cluster so that it could communicate securely with your Azure IoT Operations components. Then, you deployed those components to your cluster. For this test scenario, you have a single Kubernetes cluster that's probably running locally on your machine. In a production scenario, however, you can use the same steps to deploy workloads to many clusters across many sites.

## Clean up resources

If you're continuing on to the next quickstart, keep all of your resources.

If you want to delete the Azure IoT Operations deployment but plan on reinstalling it on your cluster, be sure to keep the secrets provider on your cluster.

1. In your resource group in the Azure portal, select your cluster.
1. On your cluster resource page, select **Extensions**.
1. Select all of the extensions of type **microsoft.iotoperations.x** and **microsoft.deviceregistry.assets**, then select **Uninstall**. Don't uninstall the secrets provider extension.

    :::image type="content" source="media/quickstart-deploy/uninstall-extensions.png" alt-text="Screenshot that shows the extensions to uninstall.":::

1. Return to your resource group and select the custom location resource, then select **Delete**.

If you want to delete all of the resources you created for this quickstart, delete the Kubernetes cluster where you deployed Azure IoT Operations and remove the Azure resource group that contained the cluster.

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Add OPC UA assets to your Azure IoT Operations Preview cluster](quickstart-add-assets.md)
