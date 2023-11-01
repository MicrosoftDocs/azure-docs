---
title: Deploy extensions - Azure IoT Orchestrator
description: Use the Azure portal, Azure CLI, or GitHub Actions to deploy Azure IoT Operations extensions with the Azure IoT Orchestrator
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.date: 10/19/2023

#CustomerIntent: As an OT professional, I want to deploy Azure IoT Operations to a Kubernetes cluster.
---

# Deploy Azure IoT Operations extensions to a Kubernetes cluster

Deploy Azure IoT Operations preview - enabled by Azure Arc to a Kubernetes cluster using the Azure portal, Azure CLI, or GitHub actions. Once you have Azure IoT Operations deployed, then you can use the Orchestrator service to manage and deploy additional workloads to your cluster.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An Azure Arc-enabled Kubernetes cluster. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy/howto-prepare-cluster.md?tabs=wsl-ubuntu). Using Ubuntu in Windows Subsystem for Linux (WSL) is the simplest way to get a Kubernetes cluster for testing.

  Azure IoT Operations should work on any CNCF-conformant kubernetes cluster. Currently, Microsoft only supports K3s on Ubuntu Linux and WSL, or AKS Edge Essentials on Windows.

#### [Azure portal](#tab/portal)

Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

#### [GitHub actions](#tab/github)

A GitHub account.

Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

#### [Azure CLI](#tab/cli)

Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

---

## Define the deployment

For deployments using GitHub actions or Azure CLI, use a Bicep template to define the deployment details.

#### [Azure portal](#tab/portal)

You don't need a deployment template for Azure portal deployments. Continue to the next section.

#### [GitHub actions](#tab/github)

The following example is a Bicep template that deploys the Orchestrator extension, a custom location, and a resource sync rule. The Orchestrator extension is a requirement for managing the cluster with Orchestrator and deploying Azure IoT Operations or custom workloads.

[!INCLUDE[Sample Bicep file for deploying the Orchestrator extension](../includes/deployment-bicep-file.md)]

You can deploy the whole Azure IoT Operations suite along with the Orchestrator extension. For an example of that deployment template, see [azure-iot-operations.bicep](https://github.com/Azure/azure-iot-operations-pr/blob/main/dev/azure-iot-operations.bicep)

#### [Azure CLI](#tab/cli)

The following example is a Bicep template that deploys the Orchestrator extension, a custom location, and a resource sync rule. The Orchestrator extension is a requirement for managing the cluster with Orchestrator and deploying Azure IoT Operations or custom workloads.

[!INCLUDE[Sample Bicep file for deploying the Orchestrator extension](../includes/deployment-bicep-file.md)]

You can deploy the whole Azure IoT Operations suite along with the Orchestrator extension. For an example of that deployment template, see [azure-iot-operations.json](https://github.com/Azure/azure-iot-operations/blob/main/dev/azure-iot-operations.json)

---

## Deploy extensions

#### [Azure portal](#tab/portal)

Use the Azure portal to deploy Azure IoT Operations components to your Arc-enabled Kubernetes cluster.

1. In the [Azure portal](https://portal.azure.com) search bar, search for and select **Azure Arc**.

1. Select **Azure IoT Operations (preview)** from the **Application services** section of the Azure Arc menu.

1. Select **Create**.

1. On the **Basics** tab of the **Install Azure IoT Operations Arc Extension** page, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Subscription** | Select the subscription that contains your Arc-enabled Kubernetes cluster. |
   | **Resource group** | Select the resource group that contains your Arc-enabled Kubernetes cluster. |
   | **Cluster name** | Select your cluster. When you do, the **Custom location** and **Deployment details** sections autofill. |
   | **Secrets** | Check the box confirming that you set up the secrets provider in your cluster by following the steps in the previous sections. |

1. Select **Next: Configuration**.

1. On the **Configuration** tab, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Deploy a simulated PLC** | Switch this toggle to **Yes**. The simulated PLC creates demo data that you use in the following quickstarts. |
   | **Mode** | Set the MQ configuration mode to **Auto**. |

1. Select **Review + create**.

1. Wait for the validation to pass and then select **Create**.

#### [GitHub actions](#tab/github)

1. On GitHub, fork the [azure-iot-operations repo](https://github.com/azure/azure-iot-operations).

   >[!IMPORTANT]
   >You're going to be adding secrets to the repo to run the deployment steps. It's important that you fork the repo and do all of the following steps in your own fork.

1. Create a service principal for the repository to use when deploying to your cluster. Use the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command.

   ```azurecli
   az ad sp create-for-rbac --name <NEW_SERVICE_PRINCIPAL_NAME> \
                            --role owner \
                            --scopes /subscriptions/<YOUR_SUBSCRIPTION_ID>
                            --json-auth
   ```

1. Copy the JSON output from the service principal creation command.

1. On GitHub, navigate to your fork of the azure-iot-operations repo.

1. Select **Settings** > **Secrets and variables** > **Actions**.

1. Create a repository secret named `AZURE_CREDENTIALS` and paste the service principal JSON as the secret value.

1. Create a parameter file in your forked repo to specify the environment configuration for your Azure IoT Operations deployment. For example, `envrionments/parameters.json`.

1. Paste the following snippet into the parameters file, replacing the `clusterName` placeholder value with your own information:

   ```json
   {
     "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
     "contentVersion": "1.0.0.0",
     "parameters": {
       "clusterName": {
         "value": "<CLUSTER_NAME>"
       }
     }
   }
   ```

1. Add any of the following optional parameters as needed for your deployment:

   | Parameter | Type | Description |
   | --------- | ---- | ----------- |
   | `clusterLocation` | string | Specify the cluster's location if it's different than the resource group's location. Otherwise, this parameter defaults to the resource group's location. |
   | `location` | string | If the resource group's location isn't supported for Azure IoT Operations deployments, use this parameter to override the default and set the location for the Azure IoT Operations resources. |
   | `simulatePLC` | Boolean | Set to `true` if you want to include a simulated component to generate test data. |
   | `dataProcessorSecrets` | object | Pass a secret to an Azure IoT Data Processor resource. |
   | `mqSecrets` | object | Pass a secret to an Azure IoT MQ resource. |
   | `opcUaBrokerSecrets` | object | Pass a secret to an Azure OPC UA Broker resource. |

1. Save your changes to the parameters file.

1. On the GitHub repo, select **Actions** and confirm **I understand my workflows, go ahead and enable them.**

1. Run the **GitOps Deployment of Azure IoT Operations** action and provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Subscription** | Your Azure subscription ID. |
   | **Resource group** | The name of the resource group that contains your Arc-enabled cluster. |
   | **Environment parameters file** | The path to the parameters file that you created. |

#### [Azure CLI](#tab/cli)

Use the [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) command to deploy the bicep file with your deployment information.

```azurecli
az deployment group create --resource-group exampleRG \
                           --template-file ./main.bicep \
                           --parameters \
                             clusterName=<EXISTING_CLUSTER_NAME> \
                             clusterLocation=<EXISTING_CLUSTER_LOCATION> \
                             clusterNamespace=<NAMESPACE_ON_CLUSTER> \
                             customLocationName=<CUSTOM_LOCATION_NAME>
```

---


