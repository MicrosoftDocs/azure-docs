---
title: Prepare your Kubernetes cluster
description: Prepare an Azure Arc-enabled Kubernetes cluster before you deploy Azure IoT Operations. This article includes guidance for both Ubuntu and Windows machines.
author: dominicbetts
ms.author: dobett
ms.subservice: orchestrator
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 05/02/2024

#CustomerIntent: As an IT professional, I want prepare an Azure-Arc enabled Kubernetes cluster so that I can deploy Azure IoT Operations to it.
---

# Prepare your Azure Arc-enabled Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

An Azure Arc-enabled Kubernetes cluster is a prerequisite for deploying Azure IoT Operations Preview. This article describes how to prepare an Azure Arc-enabled Kubernetes cluster before you [Deploy Azure IoT Operations Preview extensions to a Kubernetes cluster](../deploy-iot-ops/howto-deploy-iot-operations.md) to run your own workloads. This article includes guidance for both Ubuntu, Windows, and cloud environments.

> [!TIP]
> If you want to deploy Azure IoT Operations and run a sample workload, see the [Quickstart: Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md).

[!INCLUDE [validated-environments](../includes/validated-environments.md)]

## Prerequisites

To prepare your Azure Arc-enabled Kubernetes cluster, you need:

- Hardware that meets the [system requirements](../../azure-arc/kubernetes/system-requirements.md).

### [AKS Edge Essentials](#tab/aks-edge-essentials)

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Azure CLI version 2.46.0 or newer installed on your development machine. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```bash
  az extension add --upgrade --name azure-iot-ops
  ```

* Hardware that meets the system requirements:

  * Ensure that your machine has a minimum of 10-GB RAM, 4 vCPUs, and 40-GB free disk space.
  * Review the [AKS Edge Essentials requirements and support matrix](/azure/aks/hybrid/aks-edge-system-requirements).
  * Review the [AKS Edge Essentials networking guidance](/azure/aks/hybrid/aks-edge-concept-networking).


### [Ubuntu](#tab/ubuntu)

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Azure CLI version 2.46.0 or newer installed on your development machine. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```bash
  az extension add --upgrade --name azure-iot-ops
  ```

* Review the [K3s requirements](https://docs.k3s.io/installation/requirements).

Azure IoT Operations also works on Ubuntu in Windows Subsystem for Linux (WSL) on your Windows machine. Use WSL for testing and development purposes only.

To set up your WSL Ubuntu environment:

1. [Install Linux on Windows with WSL](/windows/wsl/install).

1. Enable `systemd`:

    ```bash
    sudo -e /etc/wsl.conf
    ```

    Add the following to _wsl.conf_ and then save the file:

    ```text
    [boot]
    systemd=true
    ```

1. After you enable `systemd`, [re-enable running windows executables from WSL](https://github.com/microsoft/WSL/issues/8843):

    ```bash
    sudo sh -c 'echo :WSLInterop:M::MZ::/init:PF > /usr/lib/binfmt.d/WSLInterop.conf'
    sudo systemctl unmask systemd-binfmt.service
    sudo systemctl restart systemd-binfmt
    sudo systemctl mask systemd-binfmt.service
    ```

### [Codespaces](#tab/codespaces)

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A [GitHub](https://github.com) account.

* Visual Studio Code installed on your development machine. For more information, see [Download Visual Studio Code](https://code.visualstudio.com/download).

---

## Create a cluster

This section provides steps to prepare and Arc-enable clusters in validated environments on Linux and Windows as well as GitHub Codespaces in the cloud.

### [AKS Edge Essentials](#tab/aks-edge-essentials)

[Azure Kubernetes Service Edge Essentials](/azure/aks/hybrid/aks-edge-overview) is an on-premises Kubernetes implementation of Azure Kubernetes Service (AKS) that automates running containerized applications at scale. AKS Edge Essentials includes a Microsoft-supported Kubernetes platform that includes a lightweight Kubernetes distribution with a small footprint and simple installation experience, making it easy for you to deploy Kubernetes on PC-class or "light" edge hardware.

>[!TIP]
>You can use the [AksEdgeQuickStartForAio.ps1](https://github.com/Azure/AKS-Edge/blob/main/tools/scripts/AksEdgeQuickStart/AksEdgeQuickStartForAio.ps1) script to automate the steps in this section and connect your cluster.
>
>Open an elevated PowerShell window, change the directory to a working folder, then run the following commands:
>
>```powershell
>$url = "https://raw.githubusercontent.com/Azure/AKS-Edge/main/tools/scripts/AksEdgeQuickStart/AksEdgeQuickStartForAio.ps1"
>Invoke-WebRequest -Uri $url -OutFile .\AksEdgeQuickStartForAio.ps1
>Unblock-File .\AksEdgeQuickStartForAio.ps1
>Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
>.\AksEdgeQuickStartForAio.ps1 -SubscriptionId "<SUBSCRIPTION_ID>" -TenantId "<TENANT_ID>" -ResourceGroupName "<RESOURCE_GROUP_NAME>"  -Location "<LOCATION>"  -ClusterName "<CLUSTER_NAME>"
>```
>
>Your machine might reboot as part of this process. If so, run the whole set of commands again.

Prepare your machine for AKS Edge Essentials.

1. Download the [installer for the validated AKS Edge Essentials](https://aka.ms/aks-edge/msi-k3s-1.2.414.0) version to your local machine.

1. Complete the steps in [Prepare your machine for AKS Edge Essentials](/azure/aks/hybrid/aks-edge-howto-setup-machine). Be sure to use the validated installer you downloaded in the previous step and not the most recent version.

Set up an AKS Edge Essentials cluster on your machine.

1. Complete the steps in [Create a single machine deployment](/azure/aks/hybrid/aks-edge-howto-single-node-deployment), but at the end of [Step 1: single machine configuration parameters](/azure/aks/hybrid/aks-edge-howto-single-node-deployment#step-1-single-machine-configuration-parameters), modify the following values in the _aksedge-config.json_ file:

    ```json
    `Init.ServiceIPRangeSize` = 10
    `LinuxNode.DataSizeInGB` = 30
    `LinuxNode.MemoryInMB` = 8192
    ```

1. Install **local-path** storage in the cluster by running the following command:

    ```cmd
    kubectl apply -f https://raw.githubusercontent.com/Azure/AKS-Edge/main/samples/storage/local-path-provisioner/local-path-storage.yaml
    ```

Run the following commands to check that the deployment was successful:

```powershell
Import-Module AksEdge
Get-AksEdgeDeploymentInfo
```

In the output of the `Get-AksEdgeDeploymentInfo` command, you should see that the cluster's Arc status is `Connected`.

### [Ubuntu](#tab/ubuntu)

Azure IoT Operations should work on any CNCF-conformant kubernetes cluster. For Ubuntu Linux, Microsoft currently supports K3s clusters.

> [!IMPORTANT]
> If you're using Ubuntu in Windows Subsystem for Linux (WSL), run all of these steps in your WSL environment, including the Azure CLI steps for configuring your cluster.

To prepare a K3s Kubernetes cluster on Ubuntu:

1. Run the K3s installation script:

   ```bash
   curl -sfL https://get.k3s.io | sh -
   ```

   For full installation information, see the [K3s quick-start guide](https://docs.k3s.io/quick-start).

1. Create a K3s configuration yaml file in `.kube/config`:

    ```bash
    mkdir ~/.kube
    sudo KUBECONFIG=~/.kube/config:/etc/rancher/k3s/k3s.yaml kubectl config view --flatten > ~/.kube/merged
    mv ~/.kube/merged ~/.kube/config
    chmod  0600 ~/.kube/config
    export KUBECONFIG=~/.kube/config
    #switch to k3s context
    kubectl config use-context default
    ```

1. Run the following command to increase the [user watch/instance limits](https://www.suse.com/support/kb/doc/?id=000020048).

   ```bash
   echo fs.inotify.max_user_instances=8192 | sudo tee -a /etc/sysctl.conf
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

   sudo sysctl -p
   ```

1. For better performance, increase the file descriptor limit:

   ```bash
   echo fs.file-max = 100000 | sudo tee -a /etc/sysctl.conf

   sudo sysctl -p
   ```

### [Codespaces](#tab/codespaces)

> [!IMPORTANT]
> Codespaces are easy to set up quickly and tear down later, but they're not suitable for performance evaluation or scale testing. Use GitHub Codespaces for exploration only.

[!INCLUDE [prepare-codespaces](../includes/prepare-codespaces.md)]

---

## Arc-enable your cluster

Connect your cluster to Azure Arc so that it can be managed remotely.

### [AKS Edge Essentials](#tab/aks-edge-essentials)

To connect your cluster to Azure Arc, complete the steps in [Connect your AKS Edge Essentials cluster to Arc](/azure/aks/hybrid/aks-edge-howto-connect-to-arc).

### [Ubuntu](#tab/ubuntu)

To connect your cluster to Azure Arc:

1. On the machine where you deployed the Kubernetes cluster, or in your WSL environment, sign in with Azure CLI:

   ```azurecli
   az login
   ```

1. Set environment variables for your Azure subscription, location, a new resource group, and the cluster name as it will show up in your resource group.

   ```bash
   # Id of the subscription where your resource group and Arc-enabled cluster will be created
   export SUBSCRIPTION_ID=<SUBSCRIPTION_ID>

   # Azure region where the created resource group will be located
   # Currently supported regions: "eastus", "eastus2", "westus", "westus2", "westus3", "westeurope", or "northeurope"
   export LOCATION=<REGION>

   # Name of a new resource group to create which will hold the Arc-enabled cluster and Azure IoT Operations resources
   export RESOURCE_GROUP=<NEW_RESOURCE_GROUP_NAME>

   # Name of the Arc-enabled cluster to create in your resource group
   export CLUSTER_NAME=<NEW_CLUSTER_NAME>
   ```

1. Set the Azure subscription context for all commands:

   ```azurecli
   az account set -s $SUBSCRIPTION_ID
   ```

1. Register the required resource providers in your subscription:

   >[!NOTE]
   >This step only needs to be run once per subscription.

   ```azurecli
   az provider register -n "Microsoft.ExtendedLocation"
   az provider register -n "Microsoft.Kubernetes"
   az provider register -n "Microsoft.KubernetesConfiguration"
   az provider register -n "Microsoft.IoTOperationsOrchestrator"
   az provider register -n "Microsoft.IoTOperationsMQ"
   az provider register -n "Microsoft.IoTOperationsDataProcessor"
   az provider register -n "Microsoft.DeviceRegistry"
   ```

1. Use the [az group create](/cli/azure/group#az-group-create) command to create a resource group in your Azure subscription to store all the resources:

   ```azurecli
   az group create --location $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
   ```

1. Use the [az connectedk8s connect](/cli/azure/connectedk8s#az-connectedk8s-connect) command to Arc-enable your Kubernetes cluster and manage it as part of your Azure resource group:

   ```azurecli
   az connectedk8s connect -n $CLUSTER_NAME -l $LOCATION -g $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
   ```

1. Get the `objectId` of the Microsoft Entra ID application that the Azure Arc service uses and save it as an environment variable.

   ```azurecli
   export OBJECT_ID=$(az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv)
   ```

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable custom location support on your cluster. This command uses the `objectId` of the Microsoft Entra ID application that the Azure Arc service uses. Run this command on the machine where you deployed the Kubernetes cluster:

    ```azurecli
    az connectedk8s enable-features -n $CLUSTER_NAME -g $RESOURCE_GROUP --custom-locations-oid $OBJECT_ID --features cluster-connect custom-locations
    ```

### [Codespaces](#tab/codespaces)

[!INCLUDE [connect-cluster-codespaces](../includes/connect-cluster-codespaces.md)]

---

## Verify your cluster

To verify that your cluster is ready for Azure IoT Operations deployment, you can use the [verify-host](/cli/azure/iot/ops#az-iot-ops-verify-host) helper command in the Azure IoT Operations extension for Azure CLI. When run on the cluster host, this helper command checks connectivity to Azure Resource Manager and Microsoft Container Registry endpoints.

```azurecli
az iot ops verify-host
```

To verify that your Kubernetes cluster is now Azure Arc-enabled, run the following command:

```console
kubectl get deployments,pods -n azure-arc
```

The output looks like the following example:

```output
NAME                                         READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/clusterconnect-agent         1/1     1            1           10m
deployment.apps/extension-manager            1/1     1            1           10m
deployment.apps/clusteridentityoperator      1/1     1            1           10m
deployment.apps/controller-manager           1/1     1            1           10m
deployment.apps/flux-logs-agent              1/1     1            1           10m
deployment.apps/cluster-metadata-operator    1/1     1            1           10m
deployment.apps/extension-events-collector   1/1     1            1           10m
deployment.apps/config-agent                 1/1     1            1           10m
deployment.apps/kube-aad-proxy               1/1     1            1           10m
deployment.apps/resource-sync-agent          1/1     1            1           10m
deployment.apps/metrics-agent                1/1     1            1           10m

NAME                                              READY   STATUS    RESTARTS        AGE
pod/clusterconnect-agent-5948cdfb4c-vzfst         3/3     Running   0               10m
pod/extension-manager-65b8f7f4cb-tp7pp            3/3     Running   0               10m
pod/clusteridentityoperator-6d64fdb886-p5m25      2/2     Running   0               10m
pod/controller-manager-567c9647db-qkprs           2/2     Running   0               10m
pod/flux-logs-agent-7bf6f4bf8c-mr5df              1/1     Running   0               10m
pod/cluster-metadata-operator-7cc4c554d4-nck9z    2/2     Running   0               10m
pod/extension-events-collector-58dfb78cb5-vxbzq   2/2     Running   0               10m
pod/config-agent-7579f558d9-5jnwq                 2/2     Running   0               10m
pod/kube-aad-proxy-56d9f754d8-9gthm               2/2     Running   0               10m
pod/resource-sync-agent-769bb66b79-z9n46          2/2     Running   0               10m
pod/metrics-agent-6588f97dc-455j8                 2/2     Running   0               10m
```

## Create sites

To manage which clusters your OT users have access to, you can group your clusters into sites. To learn more, see [What is Azure Arc site manager (preview)?](../../azure-arc/site-manager/overview.md).

## Next steps

Now that you have an Azure Arc-enabled Kubernetes cluster, you can [deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).
