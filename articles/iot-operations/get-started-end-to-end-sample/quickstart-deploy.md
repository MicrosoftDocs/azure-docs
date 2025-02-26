---
title: "Quickstart: Run Azure IoT Operations in Codespaces"
description: "Quickstart: Deploy Azure IoT Operations to a Kubernetes cluster running in GitHub Codespaces."
author: kgremban
ms.author: kgremban
ms.topic: quickstart
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 01/30/2025

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Run Azure IoT Operations in GitHub Codespaces with K3s

In this quickstart, you deploy Azure IoT Operations to an Azure Arc-enabled Kubernetes cluster so that you can remotely manage your devices and workloads. At the end of the quickstart, you have a cluster that you can manage from the cloud. The rest of the quickstarts in this end-to-end series build on this one to define sample assets, data processing pipelines, and visualizations.

## Before you begin

This series of quickstarts is intended to help you get started with Azure IoT Operations as quickly as possible so that you can evaluate an end-to-end scenario. In a true development or production environment, multiple teams working together perform these tasks and some tasks might require elevated permissions.

For the best new user experience, we recommend using an [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) so that you have owner permissions over the resources in these quickstarts.

We also use GitHub Codespaces as a virtual environment for this quickstart so that you can test the scenario without installing new tools on your own machines. However, if you want to deploy Azure IoT Operations to a local cluster on Ubuntu or Azure Kubernetes Service (AKS), see [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md).

[!INCLUDE [supported-environments](../includes/supported-environments.md)]

## Prerequisites

Before you begin, prepare the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A [GitHub](https://github.com) account.

* Visual Studio Code installed on your development machine. For more information, see [Download Visual Studio Code](https://code.visualstudio.com/download).

* **Microsoft.Authorization/roleAssignments/write** permissions at the resource group level.

## What problem will we solve?

Azure IoT Operations is a suite of data services that run on Kubernetes clusters. You want these clusters to be managed remotely from the cloud, and able to securely communicate with cloud resources and endpoints. We address these concerns with the following tasks in this quickstart:

1. Create a Kubernetes cluster in GitHub Codespaces.
1. Connect the cluster to Azure Arc for remote management.
1. Create a schema registry.
1. Deploy Azure IoT Operations to your cluster.

## Create cluster

Azure IoT Operations can be deployed to K3s on Ubuntu, Azure Kubernetes Service (AKS) Edge Essentials, and AKS on Azure Local. However, for speed and convenience, this quickstart uses GitHub Codespaces to host your cluster. To learn how to deploy Azure IoT Operations to a cluster on Windows or Ubuntu instead, see [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md).

>[!NOTE]
>Codespaces are easy to set up quickly and tear down later, but they're not suitable for performance evaluation or scale testing. Use GitHub Codespaces for exploration only.
>
>The Codespaces environment is sufficient to complete the quickstart steps, but doesn't support advanced configurations.

In this section, you create a new cluster. If you want to reuse a cluster that you deployed Azure IoT Operations to previously, refer to the steps in [Clean up resources](#clean-up-resources) to uninstall Azure IoT Operations before continuing.

The **Azure-Samples/explore-iot-operations** codespace is preconfigured with:

- [K3s](https://k3s.io/) running in [K3d](https://k3d.io/) for a lightweight Kubernetes cluster
- [Azure CLI](/cli/azure/install-azure-cli)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/) for managing Kubernetes resources
- Other useful tools like [Helm](https://helm.sh/) and [k9s](https://k9scli.io/)

To create your codespace and cluster, use the following steps:

1. Create a codespace in GitHub Codespaces.

   [![Create an explore-iot-operations codespace](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/explore-iot-operations?quickstart=1)

1. Provide the following recommended secrets for your codespace:

   | Parameter | Value |
   | --------- | ----- |
   | SUBSCRIPTION_ID | Your Azure subscription ID. |
   | RESOURCE_GROUP | A name for a new Azure resource group where your cluster will be created. |
   | LOCATION | An Azure region close to you. For the list of currently supported regions, see [Supported regions](../overview-iot-operations.md#supported-regions). |

   >[!TIP]
   >The values you provide as secrets in this step get saved on your GitHub account to be used in this and future codespaces. They're added as environment variables in the codespace terminal, and you can use those environment variables in the CLI commands in the next section.
   >
   >Additionally, this codespace creates a `CLUSTER_NAME` environment variable which is set with the codespace name.

1. Select **Create new codespace**.

1. Once the codespace is ready, select the menu button at the top left, then select **Open in VS Code Desktop**.

   :::image type="content" source="media/quickstart-deploy/open-in-vs-code-desktop.png" alt-text="Screenshot that shows opening the codespace in VS Code Desktop.":::

1. If prompted, install the **GitHub Codespaces** extension for Visual Studio Code and sign in to GitHub.

1. In Visual Studio Code, select **View** > **Terminal**.

   Use this terminal to run all of the CLI commands for managing your cluster.

## Connect cluster to Azure Arc

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

1. Get the `objectId` of the Microsoft Entra ID application that the Azure Arc service uses in your tenant and save it as an environment variable. Run the following command exactly as written, without changing the GUID value.

   ```azurecli
   export OBJECT_ID=$(az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv)
   ```

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable custom location support on your cluster. This command uses the `objectId` of the Microsoft Entra ID application that the Azure Arc service uses. Run this command on the machine where you deployed the Kubernetes cluster:

   ```azurecli
   az connectedk8s enable-features -n $CLUSTER_NAME -g $RESOURCE_GROUP --custom-locations-oid $OBJECT_ID --features cluster-connect custom-locations
   ```

## Create storage account and schema registry

Schema registry is a synchronized repository that stores message definitions both in the cloud and at the edge. Azure IoT Operations requires a schema registry on your cluster. Schema registry requires an Azure storage account for the schema information stored in the cloud.

The command to create a schema registry in this section requires **Microsoft.Authorization/roleAssignments/write** permission at the resource group level. This permission is used to give the schema registry a contributor role so that it can write to the storage account.

Run the following CLI commands in your Codespaces terminal.

1. Set environment variables for the resources you create in this section.

   | Placeholder | Value |
   | ----------- | ----- |
   | <STORAGE_ACCOUNT_NAME> | A name for your storage account. Storage account names must be between 3 and 24 characters in length and only contain numbers and lowercase letters. |
   | <SCHEMA_REGISTRY_NAME> | A name for your schema registry. Schema registry names can only contain numbers, lowercase letters, and hyphens. |
   | <SCHEMA_REGISTRY_NAMESPACE> | A name for your schema registry namespace. The namespace uniquely identifies a schema registry within a tenant. Schema registry namespace names can only contain numbers, lowercase letters, and hyphens. |

   ```azurecli
   STORAGE_ACCOUNT=<STORAGE_ACCOUNT_NAME>
   SCHEMA_REGISTRY=<SCHEMA_REGISTRY_NAME>
   SCHEMA_REGISTRY_NAMESPACE=<SCHEMA_REGISTRY_NAMESPACE>
   ```

1. Create a storage account with hierarchical namespace enabled.

   ```azurecli
   az storage account create --name $STORAGE_ACCOUNT --location $LOCATION --resource-group $RESOURCE_GROUP --enable-hierarchical-namespace
   ```

1. Create a schema registry that connects to your storage account. This command also creates a blob container called **schemas** in the storage account.

   ```azurecli
   az iot ops schema registry create --name $SCHEMA_REGISTRY --resource-group $RESOURCE_GROUP --registry-namespace $SCHEMA_REGISTRY_NAMESPACE --sa-resource-id $(az storage account show --name $STORAGE_ACCOUNT -o tsv --query id)
   ```

## Deploy Azure IoT Operations

In this section, you configure your cluster with the dependencies for your Azure IoT Operations components, then deploy Azure IoT Operations.

Run the following CLI commands in your Codespaces terminal.

1. Initialize your cluster for Azure IoT Operations.

   >[!TIP]
   >The `init` command only needs to be run once per cluster. If you're reusing a cluster that already had the latest Azure IoT Operations version deployed on it, you can skip this step.

   ```azurecli
   az iot ops init --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP
   ```

   This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

1. Deploy Azure IoT Operations.

   ```azurecli
   az iot ops create --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP --name ${CLUSTER_NAME}-instance  --sr-resource-id $(az iot ops schema registry show --name $SCHEMA_REGISTRY --resource-group $RESOURCE_GROUP -o tsv --query id) --broker-frontend-replicas 1 --broker-frontend-workers 1  --broker-backend-part 1  --broker-backend-workers 1 --broker-backend-rf 2 --broker-mem-profile Low
   ```

   This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

   If you get an error that says *Your device is required to be managed to access your resource*, run `az login` again and make sure that you sign in interactively with a browser.

## View resources in cluster

Once the deployment is complete, you can use kubectl commands to observe changes on the cluster or, since the cluster is Arc-enabled, you can use the Azure portal.

To view the pods on your cluster, run the following command:

```console
kubectl get pods -n azure-iot-operations
```

To view your resources on the Azure portal, use the following steps:

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your Azure IoT Operations instance or search for and select **Azure IoT Operations**.

1. Select the name of your Azure IoT Operations instance.

1. On the **Overview** page of your instance, select the **Resource summary** tab to view the provisioning state of the resources that were deployed to your cluster.

   :::image type="content" source="../get-started-end-to-end-sample/media/quickstart-deploy/view-instance.png" alt-text="Screenshot that shows the Azure IoT Operations instance on your Arc-enabled cluster." lightbox="../get-started-end-to-end-sample/media/quickstart-deploy/view-instance.png":::

## How did we solve the problem?

In this quickstart, you configured your Arc-enabled Kubernetes cluster so that it could communicate securely with your Azure IoT Operations components. Then, you deployed those components to your cluster. For this test scenario, you have a single Kubernetes cluster that's running in Codespaces. In a production scenario, however, you can use the same steps to deploy workloads to many clusters across many sites.

## Clean up resources

If you're continuing on to the next quickstart, keep all of your resources.

[!INCLUDE [tidy-resources](../includes/tidy-resources.md)]

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Configure your cluster](quickstart-configure.md)
