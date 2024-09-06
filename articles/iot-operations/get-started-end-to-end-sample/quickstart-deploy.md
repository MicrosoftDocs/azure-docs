---
title: "Quickstart: Run Azure IoT Operations in Codespaces"
description: "Quickstart: Deploy Azure IoT Operations Preview to a Kubernetes cluster running in GitHub Codespaces."
author: kgremban
ms.author: kgremban
ms.topic: quickstart
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 05/02/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Run Azure IoT Operations Preview in GitHub Codespaces with K3s

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you deploy a suite of IoT services to an Azure Arc-enabled Kubernetes cluster so that you can remotely manage your devices and workloads. Azure IoT Operations is a digital operations suite of services. This quickstart guides you through using Orchestrator to deploy these services to a Kubernetes cluster. At the end of the quickstart, you have a cluster that you can manage from the cloud that generates sample data to use in the following quickstarts.

The services deployed in this quickstart include:

* [MQTT broker](../manage-mqtt-broker/overview-iot-mq.md)
* [Connector for OPC UA](../discover-manage-assets/overview-opcua-broker.md) with simulated thermostat asset to start generating data
* [Akri services](../discover-manage-assets/overview-akri.md)
* [Azure Device Registry Preview](../discover-manage-assets/overview-manage-assets.md#manage-assets-as-azure-resources-in-a-centralized-registry)
* [Observability](../configure-observability-monitoring/howto-configure-observability.md)

The following quickstarts in this series build on this one to define sample assets, data processing pipelines, and visualizations. If you want to deploy Azure IoT Operations to a cluster such as AKS Edge Essentials in order to run your own workloads, see [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md?tabs=aks-edge-essentials) and [Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-deploy-iot-operations.md).

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

In this section, you create a new cluster and connect it to Azure Arc. If you want to reuse a cluster that you deployed Azure IoT Operations to previously, refer to the steps in [Clean up resources](#clean-up-resources) to uninstall Azure IoT Operations before continuing.

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

1. Create a key vault. For this scenario, use the same name and resource group as your cluster. Keyvault names have a maximum length of 24 characters, so the following command truncates the `CLUSTER_NAME`environment variable if necessary.

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

To view your resources on the Azure portal, use the following steps:

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your Azure IoT Operations instance, or search for and select **Azure IoT Operations**.

1. Select the name of your Azure IoT Operations instance.

1. On the **Overview** page of your instance, the **Arc extensions** table displays the resources that were deployed to your cluster.

   :::image type="content" source="../get-started-end-to-end-sample/media/quickstart-deploy/view-instance.png" alt-text="Screenshot that shows the Azure IoT Operations instance on your Arc-enabled cluster." lightbox="../get-started-end-to-end-sample/media/quickstart-deploy/view-instance.png":::

## How did we solve the problem?

In this quickstart, you configured your Arc-enabled Kubernetes cluster so that it could communicate securely with your Azure IoT Operations components. Then, you deployed those components to your cluster. For this test scenario, you have a single Kubernetes cluster that's probably running locally on your machine. In a production scenario, however, you can use the same steps to deploy workloads to many clusters across many sites.

## Clean up resources

If you're continuing on to the next quickstart, keep all of your resources.

If you want to delete the Azure IoT Operations deployment but want to keep your cluster, use the [az iot ops delete](/cli/azure/iot/ops#az-iot-ops-delete) command.

   ```azurecli
   az iot ops delete --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP
   ```

If you want to delete all of the resources you created for this quickstart, delete the Kubernetes cluster where you deployed Azure IoT Operations and remove the Azure resource group that contained the cluster.

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Add OPC UA assets to your Azure IoT Operations Preview cluster](quickstart-add-assets.md)
