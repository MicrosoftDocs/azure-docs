---
title: "Use Cluster Connect to connect to Azure Arc enabled Kubernetes clusters"
services: azure-arc
ms.service: azure-arc
ms.date: 04/05/2021
ms.topic: article
author: shashankbarsin
ms.author: shasb
description: "Use Cluster Connect to securely connect to Azure Arc enabled Kubernetes clusters"
---

# Use Cluster Connect to connect to Azure Arc enabled Kubernetes clusters

Cluster Connect allows you to securely connect to Azure Arc enabled Kubernetes clusters without requiring any inbound port to be enabled on the firewall. Access to the `apiserver` of the Arc enabled Kubernetes cluster is important to enable interactive debugging, troubleshooting, and in providing access to external services.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

- An understanding of the benefits and architecture of this feature. Read more in [Cluster connect - Azure Arc enabled Kubernetes article](conceptual-cluster-connect.md).
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Install or upgrade Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) to version >= 2.16.0

- Install the `connectedk8s` Azure CLI extension of version >= 1.1.0:

    ```azurecli
    az extension add --name connectedk8s
    ```
  
    If you've already installed the `connectedk8s` extension, you can update the extension to the latest version:
    
    ```azurecli
    az extension update --name connectedk8s
    ```

- An existing Azure Arc enabled Kubernetes connected cluster.
    - If you haven't connected a cluster yet, walk through our [Connect an Azure Arc enabled Kubernetes cluster quickstart](quickstart-connect-cluster.md).
    - If you had already created an Azure Arc enabled Kubernetes cluster but had disabled auto upgrade of agents, then you need to [upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to version >= 1.1.0.

- If the Cluster Connect feature is currently disabled on any Azure Arc enabled Kubernetes cluster, it can be enabled by running the following command on a machine where the `kubeconfig` file is pointed to the cluster of concern:

    ```azurecli
    az connectedk8s enable-features --features cluster-connect
    ```

- Enable the below endpoints for outbound access in addition to the ones mentioned under [connecting a Kubernetes cluster to Azure Arc](quickstart-connect-cluster.md#meet-network-requirements):

    | Endpoint | Port |
    |----------------|-------|
    |`*.servicebus.windows.net` | 443 |
    |`*.guestnotificationservice.azure.com` | 443 |

## Usage

The two authentication options are supported with the Cluster Connect feature - Azure Active Directory and service account token are described below.

### Option 1: Azure Active Directory

1. With kubeconfig file pointing to the `apiserver` of your Kubernetes cluster, create a ClusterRoleBinding or RoleBinding to the AAD entity (service principal or user) that needs to access this cluster:

    **For user:**
    
    ```console
    kubectl create clusterrolebinding admin-user-binding --clusterrole cluster-admin --user=<testuser>@<mytenant.onmicrosoft.com>
    ```

    **For AAD application:**

    1. Fetch the `objectId` associated with your AAD application:

        ```azurecli
        az ad sp show --id <id> --query objectId -o tsv
        ```

    1. Create a ClusterRoleBinding or RoleBinding to the AAD entity (service principal or user) that needs to access this cluster:
       
        ```console
        kubectl create clusterrolebinding admin-user-binding --clusterrole cluster-admin --user=<objectId>
        ```

1. After logging into Azure CLI using the AAD entity of interest, fetch the Cluster Connect `kubeconfig` needed to communicate with the cluster from anywhere (from even outside the firewall surrounding the cluster):

    ```azurecli
    az connectedk8s proxy -n <cluster-name> -g <resource-group-name>
    ```

1. Use `kubectl` to send requests to the cluster:

    ```console
    kubectl get pods
    ```
    
    You should now see a response from the cluster containing the list of all pods under the `default` namespace.

### Option 2: Service Account Bearer Token

1. With kubeconfig file pointing to the `apiserver` of your Kubernetes cluster, create a service account in any namespace (following command creates it in the default namespace):

    ```console
    kubectl create serviceaccount admin-user
    ```

1. Create ClusterRoleBinding or RoleBinding to grant this [service account the appropriate permissions on the cluster](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#kubectl-create-rolebinding):

    ```console
    kubectl create clusterrolebinding admin-user-binding --clusterrole cluster-admin --serviceaccount default:admin-user
    ```

1. Get the service account's token using the following commands

    ```console
    SECRET_NAME=$(kubectl get serviceaccount admin-user -o jsonpath='{$.secrets[0].name}')
    ```

    ```console
    TOKEN=$(kubectl get secret ${SECRET_NAME} -o jsonpath='{$.data.token}' | base64 -d | sed $'s/$/\\\n/g')
    ```

1. Fetch the Cluster Connect `kubeconfig` needed to communicate with the cluster from anywhere (from even outside the firewall surrounding the cluster):

    ```azurecli
    az connectedk8s proxy -n <cluster-name> -g <resource-group-name> --auth-token $TOKEN
    ```

1. Use `kubectl` to send requests to the cluster:

    ```console
    kubectl get pods
    ```

    You should now see a response from the cluster containing the list of all pods under the `default` namespace.
