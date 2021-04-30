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

With Cluster Connect, you can securely connect to Azure Arc enabled Kubernetes clusters without requiring any inbound port to be enabled on the firewall. Access to the `apiserver` of the Arc enabled Kubernetes cluster enables the following scenarios:
* Enable interactive debugging and troubleshooting.
* Provide cluster access to Azure services for [custom locations](custom-locations.md) and other resources created on top of it.

A conceptual overview of this feature is available in [Cluster connect - Azure Arc enabled Kubernetes](conceptual-cluster-connect.md) article.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites   

- [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to version >= 2.16.0

- Install the `connectedk8s` Azure CLI extension of version >= 1.1.0:

    ```azurecli
    az extension add --name connectedk8s
    ```
  
    If you've already installed the `connectedk8s` extension, update the extension to the latest version:
    
    ```azurecli
    az extension update --name connectedk8s
    ```

- An existing Azure Arc enabled Kubernetes connected cluster.
    - If you haven't connected a cluster yet, use our [quickstart](quickstart-connect-cluster.md).
    - [Upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to version >= 1.1.0.

- Enable the Cluster Connect on any Azure Arc enabled Kubernetes cluster by running the following command on a machine where the `kubeconfig` file is pointed to the cluster of concern:

    ```azurecli
    az connectedk8s enable-features --features cluster-connect -n <clusterName> -g <resourceGroupName>
    ```

- Enable the below endpoints for outbound access in addition to the ones mentioned under [connecting a Kubernetes cluster to Azure Arc](quickstart-connect-cluster.md#meet-network-requirements):

    | Endpoint | Port |
    |----------------|-------|
    |`*.servicebus.windows.net` | 443 |
    |`*.guestnotificationservice.azure.com` | 443 |

## Usage

Two authentication options are supported with the Cluster Connect feature: 
* Azure Active Directory (Azure AD) 
* Service account token

### Option 1: Azure Active Directory

1. With the `kubeconfig` file pointing to the `apiserver` of your Kubernetes cluster, create a ClusterRoleBinding or RoleBinding to the Azure AD entity (service principal or user) requiring access:

    **For user:**
    
    ```console
    kubectl create clusterrolebinding admin-user-binding --clusterrole cluster-admin --user=<testuser>@<mytenant.onmicrosoft.com>
    ```

    **For Azure AD application:**

    1. Get the `objectId` associated with your Azure AD application:

        ```azurecli
        az ad sp show --id <id> --query objectId -o tsv
        ```

    1. Create a ClusterRoleBinding or RoleBinding to the Azure AD entity (service principal or user) that needs to access this cluster:
       
        ```console
        kubectl create clusterrolebinding admin-user-binding --clusterrole cluster-admin --user=<objectId>
        ```

1. After logging into Azure CLI using the Azure AD entity of interest, get the Cluster Connect `kubeconfig` needed to communicate with the cluster from anywhere (from even outside the firewall surrounding the cluster):

    ```azurecli
    az connectedk8s proxy -n <cluster-name> -g <resource-group-name>
    ```

1. Use `kubectl` to send requests to the cluster:

    ```console
    kubectl get pods
    ```
    
    You should now see a response from the cluster containing the list of all pods under the `default` namespace.

### Option 2: Service Account Bearer Token

1. With the `kubeconfig` file pointing to the `apiserver` of your Kubernetes cluster, create a service account in any namespace (following command creates it in the default namespace):

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

1. Get the Cluster Connect `kubeconfig` needed to communicate with the cluster from anywhere (from even outside the firewall surrounding the cluster):

    ```azurecli
    az connectedk8s proxy -n <cluster-name> -g <resource-group-name> --token $TOKEN
    ```

1. Use `kubectl` to send requests to the cluster:

    ```console
    kubectl get pods
    ```

    You should now see a response from the cluster containing the list of all pods under the `default` namespace.

## Known limitations

When making requests to the Kubernetes cluster, if the Azure AD entity used is a part of more than 200 groups, the following error is observed as this is a known limitation:

```console
You must be logged in to the server (Error:Error while retrieving group info. Error:Overage claim (users with more than 200 group membership) is currently not supported. 
```

To get past this error:
1. Create a [service principal](/cli/azure/create-an-azure-service-principal-azure-cli), which is less likely to be a member of more than 200 groups.
1. [Sign in](/cli/azure/create-an-azure-service-principal-azure-cli#sign-in-using-a-service-principal) to Azure CLI with the service principal before running `az connectedk8s proxy` command.

## Next steps

> [!div class="nextstepaction"]
> Set up [Azure AD RBAC](azure-rbac.md) on your clusters