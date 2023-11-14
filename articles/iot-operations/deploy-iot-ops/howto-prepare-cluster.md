---
title: Prepare your Kubernetes cluster
description: Prepare an Azure Arc-enabled Kubernetes cluster before you deploy Azure IoT Operations. This article includes guidance for both Ubuntu and Windows machines.
author: dominicbetts
ms.author: dobett
# ms.subservice: orchestrator
ms.topic: how-to
ms.custom:
  - ignite-2023
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
- At least **Contributor** role permissions in your subscription plus the **Microsoft.Authorization/roleAssignments/write** permission.
- [Azure CLI version 2.42.0 or newer installed](/cli/azure/install-azure-cli) on your development machine.
- Hardware that meets the [system requirements](/azure/azure-arc/kubernetes/system-requirements).

### Create a cluster

This section provides steps to prepare and Arc-enable clusters in validated environments on Linux and Windows as well as GitHub Codespaces in the cloud.

# [AKS Edge Essentials](#tab/aks-edge-essentials)

[!INCLUDE [prepare-aks-ee](../includes/prepare-aks-ee.md)]

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

If you used the setup script for creating an AKS Edge Essentials cluster, that takes care of connecting to Azure Arc. You can skip this section.

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
