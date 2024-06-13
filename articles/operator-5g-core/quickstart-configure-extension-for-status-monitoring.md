---
title: Configure the Azure Operator 5G Core extension for status monitoring
description: Learn how to ensure your deployment is running at its highest capacity by performing health checks post-deployment.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.custom: devx-track-azurecli
ms.topic: how-to #required; leave this attribute/value as-is.
ms.date: 02/21/2024


#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---
# Configure the Azure Operator 5G Core Preview extension for status monitoring

After Azure Operator 5G Core Preview is deployed, you can perform health and configuration checks on the deployment. You must enable an ARC extension to monitor your deployment. 

## Set up the Azure CLI

1. Sign in using the `az login--use-device-code` command. Complete the sign in process with your user account.
1. Set the subscription: `az account set -s <subscriptionName>`
1. Run the following commands to install the CLI extensions:

```azurecli
    az extension add --yes --name connectedk8s
    az extension add --yes --name k8s-configuration
    az extension add --yes --name k8s-extension
```

## Configure ARC for the Kubernetes/Azure Kubernetes Services Cluster

Enter the following command to configure the ARC:

```azurecli
az connectedk8s connect --name <ConnectedK8sName> --resource-group <ResourceGroupName>
```

## Deploy the Azure Operator 5G Core Preview extension

1. Enter the following commands to deploy the Azure Operator 5G Core extension:

    ```azurecli
    az k8s-extension create \ 
    --name ao5gc-monitor \ 
    --cluster-name <ConnectedK8sName>   \ 
    --resource-group <ResourceGroupName> \ 
    --cluster-type connectedClusters \ 
    --extension-type "Microsoft.AO5GC" \ 
    --release-train <dev or preview or stable>\ 
    --auto-upgrade true
    ```

2. Run the following command to create a **name=ao5gc-monitor** label for the newly created **ao5gc-monitor** namespace:

    ```azurecli
    kubectl label namespace ao5gc-monitor name=ao5gc-monitor
    ```
    The namespace and all necessary Azure Operator 5G Core extension pods, configuration maps, and services are created within the namespace.  

To delete the Azure Operator 5G Core extension, you can run the following command:

```azurecli
az k8s-extension delete \ 
--name ao5gc-monitor \ 
--cluster-name <ConnectedK8sName>   \ 
--resource-group <ResourceGroupName> \ 
--cluster-type connectedClusters \
```
## Related content

- [Monitor the  status of your Azure Operator 5G Core Preview deployment](quickstart-monitor-deployment-status.md)
- [Observability and analytics in Azure Operator 5G Core Preview](concept-observability-analytics.md)
