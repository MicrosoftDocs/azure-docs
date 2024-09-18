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
* [Connector for OPC UA](../discover-manage-assets/overview-opcua-broker.md)
* [Azure Device Registry Preview](../discover-manage-assets/overview-manage-assets.md#store-assets-as-azure-resources-in-a-centralized-registry) including a schema registry
* [Observability](../configure-observability-monitoring/howto-configure-observability.md)

The rest of the quickstarts in this series build on this one to define sample assets, data processing pipelines, and visualizations. If you want to deploy Azure IoT Operations to a cluster such as AKS Edge Essentials in order to run your own workloads, see [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md?tabs=aks-edge-essentials) and [Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-deploy-iot-operations.md).

## Before you begin

This series of quickstarts is intended to help you get started with Azure IoT Operations as quickly as possible so that you can evaluate an end-to-end scenario. In a true development or production environment, these tasks would be performed by multiple teams working together and some tasks might require elevated permissions.

For the best new user experience, we recommend using an [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) so that you have owner permissions over the resources in these quickstarts. We also provide steps to use GitHub Codespaces as a virtual environment in which you can quickly begin deploying resources and running commands without installing new tools on your own machines.

## Prerequisites

For this quickstart, you create a Kubernetes cluster to receive the Azure IoT Operations deployment.

If you want to reuse a cluster that already has Azure IoT Operations deployed to it, refer to the steps in [Clean up resources](#clean-up-resources) to uninstall Azure IoT Operations before continuing.

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

## Create a storage account and schema registry

One of the components that Azure IoT Operations deploys, schema registry, requires a storage account with hierarchical namespace enabled.

The storage account must be created in a *different* Azure region than the schema registry. This requirement is so that you can set up secure connection rules between the storage account and the schema registry. When the two resources are in different regions, you can disable public access to the storage account and create a network rule to allow connections from only the schema registry IP addresses. If the two were in the same region, IP network rules wouldn't apply.

Run the following CLI commands in your Codespaces terminal.

1. Create a storage account with hierarchical namespace enabled and public access disabled. This command uses the `westcentralus` region for example. If you want to change to a different region closer to you, make sure it's a different region than the one you used in your codespace.

   ```azurecli
   export STORAGE_ACCOUNT=${CLUSTER_NAME:0:16}-storage
   az storage account create --name $STORAGE_ACCOUNT --location <REGION> -g $RESOURCE_GROUP --enable-hierarchical-namespace --allow-shared-key-access false --default-action Deny --allow-blob-public-access false 

1. Allow schema registry IP addresses to access the storage account.

   ```azurecli
   az storage account network-rule add -g $RESOURCE_GROUP --account-name $STORAGE_ACCOUNT --ip-address 20.1.75.142 20.252.196.43 20.51.24.43 20.51.28.95 4.157.157.214 20.253.64.236 20.85.106.152 20.96.85.51 20.82.208.202 20.105.106.242 20.195.58.86 40.119.231.144 20.101.219.97 51.124.23.193 20.245.227.204 40.112.138.48 20.99.136.137 20.252.49.47 20.106.114.138 20.125.89.107
   ```

1. Create a schema registry that connects to your storage account.

   ```azurecli
   export SCHEMA_REGISTRY=${CLUSTER_NAME:0:16}-schema
   az iot ops schema registry create -n myschemaregistry -g mygroup --registry-namespace mynamespace --sa-resource-id $(az storage account show --name $STORAGE_ACCOUNT -o tsv --query id)

## Deploy Azure IoT Operations Preview

In this section, you use the [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init) command to configure your cluster so that it can communicate securely with your Azure IoT Operations components and key vault, then deploy Azure IoT Operations.

Run the following CLI commands in your Codespaces terminal.

1. Initialize your cluster for Azure IoT Operations.

   >[!TIP]
   >This command only needs to be run once per cluster. If you're reusing a cluster that already had Azure IoT Operations deployed on it, you can skip this step.

   ```azurecli
   az iot ops init --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP --sr-resource-id ${az iot ops schema registry show --name $SCHEMA_REGISTRY -o tsv --query id}
   ```

1. Deploy Azure IoT Operations. This command takes several minutes to complete:

   ```azurecli
   az iot ops create --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME
   ```

   If you get an error that says *Your device is required to be managed to access your resource*, run `az login` again and make sure that you sign in interactively with a browser.

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

[!INCLUDE [tidy-resources](../includes/tidy-resources.md)]

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Add OPC UA assets to your Azure IoT Operations Preview cluster](quickstart-add-assets.md)
