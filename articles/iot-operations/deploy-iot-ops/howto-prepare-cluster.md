---
title: Prepare your Kubernetes cluster
description: Prepare an Azure Arc-enabled Kubernetes cluster before you deploy Azure IoT Operations. This article includes guidance for both Ubuntu and Windows machines.
author: dominicbetts
ms.author: dobett
# ms.subservice: orchestrator
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 11/07/2023

#CustomerIntent: As an IT professional, I want prepare an Azure-Arc enabled Kubernetes cluster so that I can deploy Azure IoT Operations to it.
---

# Prepare your Azure Arc-enabled Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

An Azure Arc-enabled Kubernetes cluster is a prerequisite for deploying Azure IoT Operations Preview. This article describes how to prepare an Azure Arc-enabled Kubernetes cluster before you deploy Azure IoT Operations. This article includes guidance for both Ubuntu, Windows, and cloud environments.

[!INCLUDE [validated-environments](../includes/validated-environments.md)]

## Prerequisites

To prepare your Azure Arc-enabled Kubernetes cluster, you need:

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Azure CLI version 2.42.0 or newer installed](/cli/azure/install-azure-cli) on your development machine.
- Hardware that meets the [system requirements](/azure/azure-arc/kubernetes/system-requirements).

### Create a cluster

This section provides steps to prepare and Arc-enable clusters in validated environments on Linux and Windows as well as GitHub Codespaces in the cloud.

# [AKS Edge Essentials](#tab/aks-edge-essentials)

[Azure Kubernetes Service Edge Essentials](/azure/aks/hybrid/aks-edge-overview) is an on-premises Kubernetes implementation of Azure Kubernetes Service (AKS) that automates running containerized applications at scale. AKS Edge Essentials includes a Microsoft-supported Kubernetes platform that includes a lightweight Kubernetes distribution with a small footprint and simple installation experience, making it easy for you to deploy Kubernetes on PC-class or "light" edge hardware.

>[!TIP]
>You can use the [AksEdgeQuickStartForAio.ps1](https://github.com/Azure/AKS-Edge/blob/main/tools/scripts/AksEdgeQuickStart/AksEdgeQuickStartForAio.ps1) script to automate the steps in this section and connect your cluster.
>
>In an elevated PowerShell window, run the following commands:
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

1. Complete the steps in [Create a single machine deployment](/azure/aks/hybrid/aks-edge-howto-single-node-deployment).

    At the end of [Step 1: single machine configuration parameters](/azure/aks/hybrid/aks-edge-howto-single-node-deployment#step-1-single-machine-configuration-parameters), modify the following values in the _aksedge-config.json_ file as follows:

    ```json
    `Init.ServiceIPRangeSize` = 10
    `LinuxNode.DataSizeInGB` = 30
    `LinuxNode.MemoryInMB` = 8192
    ```

1. Install **local-path** storage in the cluster by running the following command:

    ```cmd
    kubectl apply -f https://raw.githubusercontent.com/Azure/AKS-Edge/main/samples/storage/local-path-provisioner/local-path-storage.yaml
    ```

# [Ubuntu](#tab/ubuntu)

[!INCLUDE [prepare-ubuntu](../includes/prepare-ubuntu.md)]

# [Codespaces](#tab/codespaces)

[!INCLUDE [prepare-codespaces](../includes/prepare-codespaces.md)]

# [WSL Ubuntu](#tab/wsl-ubuntu)

You can run Ubuntu in Windows Subsystem for Linux (WSL) on your Windows machine. Use WSL for testing and development purposes only.

> [!IMPORTANT]
> Run all of these steps in your WSL environment, including the Azure CLI steps for configuring your cluster.

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

[!INCLUDE [prepare-ubuntu](../includes/prepare-ubuntu.md)]

---

## Arc-enable your cluster

[!INCLUDE [connect-cluster](../includes/connect-cluster.md)]

## Verify your cluster

To verify that your Kubernetes cluster is now Azure Arc-enabled, run the following command:

```bash/powershell
kubectl get deployments,pods -n azure-arc
```

The output looks like the following example:

```text
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



## Next steps

Now that you have an Azure Arc-enabled Kubernetes cluster, you can [deploy Azure IoT Operations](../get-started/quickstart-deploy.md).
