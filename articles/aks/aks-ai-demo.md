---
title: Deploy OpenAI Workload on AKS
description: #Required; article description that is displayed in search results. 
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 6/22/2023
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Deploy OpenAI Workload on AKS 

Azure Kubernetes Service (AKS) is a managed Kubernetes Service that lets you quickly deploy workload and managed your kubernetes clusters. In this doc, you will:
- Learn how to deploy Azure OpenAI or OpenAI workload on AKS
- Run a sample multi-container applications that is representative of a real-world application, with a database, a web front end, and events to simulate traffic.
- add architecture diagram
- link to GH
<!-- 3. Prerequisites 
Optional. If you need prerequisites, make them your first H2 in a how-to guide. 
Use clear and unambiguous language and use a list format.
-->

## Before you begin

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- add access to OpenAI or AOAI account
- CLI version required for workload identity

<!-- does this file no longer exist? It's used in the current quickstart -->
[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)] 

- <!-- prerequisite 2 -->
- <!-- prerequisite n -->
<!-- remove this section if prerequisites are not needed -->

<!-- 4. H2s 
Required. A how-to article explains how to do a task. The bulk of each H2 should be 
a procedure.
-->

## Create a Resource Group
An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

* Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

    The following output example resembles successful creation of the resource group:

    ```json
    {
      "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
      "location": "eastus",
      "managedBy": null,
      "name": "myResourceGroup",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "tags": null
    }
    ```

## Create an AKS Cluster
The following example creates a cluster named *myAKSCluster* with one node and enables a system-assigned managed identity.

<!--are these parameters --enable-addons monitoring --enable-msi-auth-for-monitoring  --generate-ssh-keys required? -->

* Create an AKS cluster using the [`az aks create`][az-aks-create] command with the `--enable-addons monitoring` and `--enable-msi-auth-for-monitoring` parameters to enable [Azure Monitor Container insights][azure-monitor-containers] with managed identity authentication.

    ```azurecli-interactive
    az aks create -g myResourceGroup -n myAKSCluster --enable-managed-identity --node-count 1 --enable-addons monitoring --enable-msi-auth-for-monitoring  --generate-ssh-keys
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

> [!NOTE]
> When you create a new cluster, AKS automatically creates a second resource group to store the AKS resources. For more information, see [Why are two resource groups created with AKS?](../faq.md#why-are-two-resource-groups-created-with-aks)

## Connect to the cluster

To manage a Kubernetes cluster, use the Kubernetes command-line client, [kubectl][kubectl]. `kubectl` is already installed if you use Azure Cloud Shell.

1. Install `kubectl` locally using the [`az aks install-cli`][az-aks-install-cli] command.

    ```azurecli
    az aks install-cli
    ```

2. Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    This command executes the following operations:

    * Downloads credentials and configures the Kubernetes CLI to use them.
    * Uses `~/.kube/config`, the default location for the [Kubernetes configuration file][kubeconfig-file]. Specify a different location for your Kubernetes configuration file using *--file* argument.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

3. Verify the connection to your cluster using the [`kubectl get`][kubectl-get] command. This command returns a list of the cluster nodes.

    ```azurecli-interactive
    kubectl get nodes
    ```

    The following output example shows the single node created in the previous steps. Make sure the node status is *Ready*.

    ```output
    NAME                       STATUS   ROLES   AGE     VERSION
    aks-nodepool1-31718369-0   Ready    agent   6m44s   v1.25.6
    ```

<!-- Ayo -->
## Create AI service yaml (might need to switch the order with deploying the application) 
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- Amanda -->
## Deploy the application 
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- Amanda -->
## Test the application


<!-- Ayo -->
## Security (Create managed identity and grant permissions)
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- Ayo -->
## Create Azure Container Registry and build your own image
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->




<!-- 
Create an AKS cluster (Azure CLI)
Deploy Azure OpenAI
Create managed identity and grant permissions
Create an ACR instance (the images are pre-created in GHCR, but it could be good to walk them through this step here)
Create AI service (Python) container image and push to ACR
Deploy containers to AKS 
Demo: AI service will generate product descriptions based on title and tags -->

<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
