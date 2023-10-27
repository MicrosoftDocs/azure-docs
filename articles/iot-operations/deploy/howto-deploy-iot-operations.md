---
title: Deploy extensions - Azure IoT Operations
description: Use the Azure portal, Azure CLI, or GitHub Actions to deploy Azure IoT Operations extensions with the Azure IoT Orchestrator
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.date: 10/19/2023

#CustomerIntent: As an OT professional, I want to deploy Azure IoT Operations to a Kubernetes cluster.
---

# Deploy Azure IoT Operations extensions to a Kubernetes cluster

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An Azure Arc-enabled Kubernetes cluster. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy/howto-prepare-cluster.md?tabs=wsl-ubuntu). Using Ubuntu in Windows Subsystem for Linux (WSL) is the simplest way to get a Kubernetes cluster for testing.

  Azure IoT Operations should work on any CNCF-conformant kubernetes cluster. Currently, Microsoft only supports K3s on Ubuntu Linux and WSL, or AKS Edge Essentials on Windows.

<!-- * Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli).

  * The commands in this article require version 2.38.0 or newer. Use the command `az --version` to check your Azure CLI version. -->

## Define the deployment

For deployments using GitHub actions or Azure CLI, use a Bicep template to define the deployment details.

#### [Azure portal](#tab/portal)

You don't need a deployment template for Azure portal deployments. Continue to the next section.

#### [GitHub actions](#tab/github)

The following example is a Bicep template that deploys the Orchestrator extension, a custom location, and a resource sync rule. The Orchestrator extension is a requirement for managing the cluster with Orchestrator and deploying additional IoT Operations or custom workloads.

![Sample Bicep file for deploying the Orchestrator extension](../includes/deployment-bicep-file.md)

You can deploy the whole Azure IoT Operations suite along with the Orchestrator extension. For an example of that deployment template, see [azure-iot-operations.bicep](https://github.com/Azure/azure-iot-operations-pr/blob/main/dev/azure-iot-operations.bicep)

#### [Azure CLI](#tab/cli)

The following example is a Bicep template that deploys the Orchestrator extension, a custom location, and a resource sync rule. The Orchestrator extension is a requirement for managing the cluster with Orchestrator and deploying additional IoT Operations or custom workloads.

![Sample Bicep file for deploying the Orchestrator extension](../includes/deployment-bicep-file.md)

You can deploy the whole Azure IoT Operations suite along with the Orchestrator extension. For an example of that deployment template, see [azure-iot-operations.bicep](https://github.com/Azure/azure-iot-operations-pr/blob/main/dev/azure-iot-operations.bicep)

---


## Deploy extensions

#### [Azure portal](#tab/portal)


#### [GitHub actions](#tab/github)


#### [Azure CLI](#tab/cli)

Use the [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) command 

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


