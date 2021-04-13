---
title: Deploy an Azure API Management gateway on Azure Arc
description: Enable Azure Arc to deploy your self-hosted Azure API Management gateway. 
author: v-hhunter
ms.author: v-hhunter
ms.service: api-management
ms.topic: quickstart 
ms.date: 04/13/2021
ms.custom: template-quickstart 
---

# Deploy Azure API Management gateway on Azure Arc

With the integration between Azure API Management and Azure Arc on Kubernetes, you can deploy the API Management gateway component as an extension in an Azure Arc enabled Kubernetes cluster. 

## Prerequisites

* [Connect your Kubernetes cluster](./azure-arc/kubernetes/quickstart-connect-cluster.md). 
* [Create a custom location](./azure-arc/kubernetes/custom-location.md) on your connected cluster.
* [Create an Azure API Management instance](./get-started-create-service-instance.md).
* [Provision a gateway resource in your Azure API Management instance](./api-management-howto-provision-self-hosted-gateway.md).


## Deploy the API management gateway extension
1. In your provisioned gateway resource, click **Deployment** from the side navigation menu.
1. Make note of the **Token** and **Configuration URL** values for the next step.
1. In Azure CLI, deploy the gateway extension using the following command. Fill in the `token` and `configuration URL` values.
    ```azurecli
    az k8s-extension create --cluster-type connectedClusters --cluster-name <cluster-name> --resource-group <rg-name> --name <extension-name> --extension-type Microsoft.ApiManagement.Gateway --scope cluster --release-namespace {namespace} --configuration-settings gateway.endpoint='{Configuration URL}' --configuration-settings gateway.authKey='{token}' --configuration-settings service.type='NodePort' --release-train preview
    ```
1. Verify deployment status using the following CLI command:
    ```azurecli
    az k8s-extension show --cluster-type connectedClusters --cluster-name <cluster-name> --resource-group <rg-name> --name <extension-name>
    ```
1. In the Azure portal, verify the gateway status shows a green check mark with a node count. 
    * This status means the deployed self-hosted gateway pods are successfully communicating with the API Management service and have a regular "heartbeat".

## Next Steps
* To learn more about the self-hosted gateway, see [Azure API Management self-hosted gateway overview](self-hosted-gateway-overview.md)
* Learn more about [Azure Arc enabled Kubernetes](../azure-arc/kubernetes/overview.md)