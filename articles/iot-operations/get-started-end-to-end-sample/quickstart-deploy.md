---
title: "Quickstart: Run Azure IoT Operations in Codespaces"
description: "Quickstart: Deploy Azure IoT Operations Preview to a Kubernetes cluster running in GitHub Codespaces."
author: kgremban
ms.author: kgremban
ms.topic: quickstart
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 10/02/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Run Azure IoT Operations Preview in GitHub Codespaces with K3s

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you deploy a suite of IoT services to an Azure Arc-enabled Kubernetes cluster so that you can remotely manage your devices and workloads. Azure IoT Operations is a digital operations suite of services. This quickstart guides you through using Orchestrator to deploy these services to a Kubernetes cluster. At the end of the quickstart, you have a cluster that you can manage from the cloud that generates sample data to use in the following quickstarts.

The rest of the quickstarts in this end-to-end series build on this one to define sample assets, data processing pipelines, and visualizations.

If you want to deploy Azure IoT Operations to a local cluster such as Azure Kubernetes Service Edge Essentials or K3s on Ubuntu, see [Deployment details](../deploy-iot-ops/overview-deploy.md).

## Before you begin

This series of quickstarts is intended to help you get started with Azure IoT Operations as quickly as possible so that you can evaluate an end-to-end scenario. In a true development or production environment, multiple teams working together perform these tasks and some tasks might require elevated permissions.

For the best new user experience, we recommend using an [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) so that you have owner permissions over the resources in these quickstarts. We also provide steps to use GitHub Codespaces as a virtual environment in which you can quickly begin deploying resources and running commands without installing new tools on your own machines.

## Prerequisites

For this quickstart, you create a Kubernetes cluster to receive the Azure IoT Operations deployment.

If you want to reuse a cluster that already has Azure IoT Operations deployed to it, refer to the steps in [Clean up resources](#clean-up-resources) to uninstall Azure IoT Operations before continuing.

Before you begin, prepare the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A [GitHub](https://github.com) account.

* Visual Studio Code installed on your development machine. For more information, see [Download Visual Studio Code](https://code.visualstudio.com/download).

* **Microsoft.Authorization/roleAssignments/write** permissions at the resource group level.

## What problem will we solve?

Azure IoT Operations is a suite of data services that run on Kubernetes clusters. You want these clusters to be managed remotely from the cloud, and able to securely communicate with cloud resources and endpoints. We address these concerns with the following tasks in this quickstart:

1. Create a Kubernetes cluster and connect it to Azure Arc for remote management.
1. Create a schema registry.
1. Deploy Azure IoT Operations to your cluster.

## Connect a Kubernetes cluster to Azure Arc

Azure IoT Operations supports Azure Kubernetes Service (AKS) Edge Essentials and K3s on Ubuntu clusters. However, for speed and convenience, this quickstart uses GitHub Codespaces to host your cluster.

Codespaces are easy to set up quickly and tear down later, but they're not suitable for performance evaluation or scale testing. Use GitHub Codespaces for exploration only. To learn how to deploy Azure IoT Operations to a cluster on Windows or Ubuntu, see [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md).

In this section, you create a new cluster and connect it to Azure Arc. If you want to reuse a cluster that you deployed Azure IoT Operations to previously, refer to the steps in [Clean up resources](#clean-up-resources) to uninstall Azure IoT Operations before continuing.

[!INCLUDE [prepare-codespaces](../includes/prepare-codespaces.md)]

To connect your cluster to Azure Arc:

1. In your codespace terminal, sign in to Azure CLI:

   ```azurecli
   az login
   ```

   > [!TIP]
   > If you're using the GitHub codespace environment in a browser rather than VS Code desktop, running `az login` returns a localhost error. To fix the error, either:
   >
   > * Open the codespace in VS Code desktop, and then return to the browser terminal and rerun `az login`.
   > * Or, after you get the localhost error on the browser, copy the URL from the browser and run `curl "<URL>"` in a new terminal tab. You should see a JSON response with the message "You have logged into Microsoft Azure!."

1. After you sign in, Azure CLI displays all of your subscriptions and indicates your default subscription with an asterisk `*`. To continue with your default subscription, select `Enter`. Otherwise, type the number of the Azure subscription that you want to use.

1. Register the required resource providers in your subscription:

   >[!NOTE]
   >This step only needs to be run once per subscription. To register resource providers, you need permission to do the `/register/action` operation, which is included in subscription Contributor and Owner roles. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

   ```azurecli
   az provider register -n "Microsoft.ExtendedLocation"
   az provider register -n "Microsoft.Kubernetes"
   az provider register -n "Microsoft.KubernetesConfiguration"
   az provider register -n "Microsoft.IoTOperations"
   az provider register -n "Microsoft.DeviceRegistry"
   az provider register -n "Microsoft.SecretSyncController"
   ```

1. Use the [az group create](/cli/azure/group#az-group-create) command to create a resource group in your Azure subscription to store all the resources:

   ```azurecli
   az group create --location $LOCATION --resource-group $RESOURCE_GROUP
   ```

1. Use the [az connectedk8s connect](/cli/azure/connectedk8s#az-connectedk8s-connect) command to Arc-enable your Kubernetes cluster and manage it as part of your Azure resource group:

   ```azurecli
   az connectedk8s connect --name $CLUSTER_NAME --location $LOCATION --resource-group $RESOURCE_GROUP
   ```

   >[!TIP]
   >The value of `$CLUSTER_NAME` is automatically set to the name of your codespace. Replace the environment variable if you want to use a different name.

1. Get the `objectId` of the Microsoft Entra ID application that the Azure Arc service in your tenant uses and save it as an environment variable. Run the following command exactly as written, without changing the GUID value.

   ```azurecli
   export OBJECT_ID=$(az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv)
   ```

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable custom location support on your cluster. This command uses the `objectId` of the Microsoft Entra ID application that the Azure Arc service uses.

   ```azurecli
   az connectedk8s enable-features -n $CLUSTER_NAME -g $RESOURCE_GROUP --custom-locations-oid $OBJECT_ID --features cluster-connect custom-locations
   ```

## Verify cluster

Use the Azure IoT Operations extension for Azure CLI to verify that your cluster host is configured correctly for deployment by using the [verify-host](/cli/azure/iot/ops#az-iot-ops-verify-host) command on the cluster host:

```azurecli
az iot ops verify-host
```

This helper command checks connectivity to Azure Resource Manager and Microsoft Container Registry endpoints.

## Create a storage account and schema registry

Azure IoT Operations requires a schema registry on your cluster. Schema registry requires an Azure storage account so that it can synchronize schema information between cloud and edge.

The command to create a schema registry in this section requires **Microsoft.Authorization/roleAssignments/write** permissions at the resource group level.

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
   az iot ops schema registry create --name $SCHEMA_REGISTRY --resource-group $RESOURCE_GROUP --registry-namespace $SCHEMA_REGISTRY_NAMESPACE --sa-resource-id $(az storage account show --name $STORAGE_ACCOUNT -o tsv --query id)
   ```

## Deploy Azure IoT Operations Preview

In this section, you configure your cluster with the dependencies for your Azure IoT Operations components, then deploy Azure IoT Operations.

Run the following CLI commands in your Codespaces terminal.

1. Initialize your cluster for Azure IoT Operations.

   >[!TIP]
   >The `init` command only needs to be run once per cluster. If you're reusing a cluster that already had Azure IoT Operations version 0.8.0 deployed on it, you can skip this step.

   ```azurecli
   az iot ops init --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP
   ```

   This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

1. Deploy Azure IoT Operations. This command takes several minutes to complete:

   ```azurecli
   az iot ops create --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP --name ${CLUSTER_NAME}-instance  --sr-resource-id $(az iot ops schema registry show --name $SCHEMA_REGISTRY --resource-group $RESOURCE_GROUP -o tsv --query id)
   ```

   This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

   If you get an error that says *Your device is required to be managed to access your resource*, run `az login` again and make sure that you sign in interactively with a browser.

## View resources in your cluster

While the deployment is in progress, the CLI progress interface shows you the deployment stage that you're in. Once the deployment is complete, you can use kubectl commands to observe changes on the cluster or, since the cluster is Arc-enabled, you can use the Azure portal.

To view the pods on your cluster, run the following command:

```console
kubectl get pods -n azure-iot-operations
```

To view your resources on the Azure portal, use the following steps:

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your Azure IoT Operations instance, or search for and select **Azure IoT Operations**.

1. Select the name of your Azure IoT Operations instance.

1. On the **Overview** page of your instance, the **Arc extensions** tab displays the resources that were deployed to your cluster.

   :::image type="content" source="../get-started-end-to-end-sample/media/quickstart-deploy/view-instance.png" alt-text="Screenshot that shows the Azure IoT Operations instance on your Arc-enabled cluster." lightbox="../get-started-end-to-end-sample/media/quickstart-deploy/view-instance.png":::

## How did we solve the problem?

In this quickstart, you configured your Arc-enabled Kubernetes cluster so that it could communicate securely with your Azure IoT Operations components. Then, you deployed those components to your cluster. For this test scenario, you have a single Kubernetes cluster that's probably running locally on your machine. In a production scenario, however, you can use the same steps to deploy workloads to many clusters across many sites.

## Clean up resources

If you're continuing on to the next quickstart, keep all of your resources.

[!INCLUDE [tidy-resources](../includes/tidy-resources.md)]

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Add OPC UA assets to your Azure IoT Operations Preview cluster](quickstart-configure.md)
