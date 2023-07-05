---
title: Deploy a self-hosted gateway to Kubernetes with YAML
description: Learn how to deploy a self-hosted gateway component of Azure API Management to Kubernetes with YAML
author: dlepow
manager: gwallace
ms.service: api-management
ms.workload: mobile
ms.topic: article
ms.author: danlep
ms.date: 05/22/2023
---
# Deploy a self-hosted gateway to Kubernetes with YAML

This article describes the steps for deploying the self-hosted gateway component of Azure API Management to a Kubernetes cluster.

[!INCLUDE [preview](./includes/preview/preview-callout-self-hosted-gateway-deprecation.md)]

> [!NOTE]
> You can also deploy self-hosted gateway to an [Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md) as a [cluster extension](../azure-arc/kubernetes/extensions.md).

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

## Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
- Create a Kubernetes cluster, or have access to an existing one.
   > [!TIP]
   > [Single-node clusters](https://kubernetes.io/docs/setup/#learning-environment) work well for development and evaluation purposes. Use [Kubernetes Certified](https://kubernetes.io/partners/#conformance) multi-node clusters on-premises or in the cloud for production workloads.
- [Provision a self-hosted gateway resource in your API Management instance](api-management-howto-provision-self-hosted-gateway.md).

## Deploy to Kubernetes

> [!TIP]
> The following steps deploy the self-hosted gateway to Kubernetes and enable authentication to the API Management instance by using a gateway access token (authentication key). You can also deploy the self-hosted gateway to Kubernetes and enable authentication to the API Management instance by using [Azure AD](self-hosted-gateway-enable-azure-ad.md).

1. Select **Gateways** under **Deployment and infrastructure**.
2. Select the self-hosted gateway resource that you want to deploy.
3. Select **Deployment**.
4. An access token in the **Token** text box was auto-generated for you, based on the default **Expiry** and **Secret key** values. If needed, choose values in either or both controls to generate a new token.
5. Select the **Kubernetes** tab under **Deployment scripts**.
6. Select the **\<gateway-name\>.yml** file link and download the YAML file.
7. Select the **copy** icon at the lower-right corner of the **Deploy** text box to save the `kubectl` commands to the clipboard.
8. When using Azure Kubernetes Service (AKS), run `az aks get-credentials --resource-group <resource-group-name> --name <resource-name> --admin` in a new terminal session.
9. Run the commands to create the necessary Kubernetes objects in the [default namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) and start self-hosted gateway pods from the [container image](https://aka.ms/apim/shgw/registry-portal) downloaded from the Microsoft Artifact Registry.
   - The first step creates a Kubernetes secret that contains the access token generated in step 4. Next, it creates a Kubernetes deployment for the self-hosted gateway which uses a ConfigMap with the configuration of the gateway.

[!INCLUDE [api-management-self-hosted-gateway-kubernetes-services](../../includes/api-management-self-hosted-gateway-kubernetes-services.md)]

## Next steps

* To learn more about the self-hosted gateway, see [Self-hosted gateway overview](self-hosted-gateway-overview.md).
* Learn [how to deploy API Management self-hosted gateway to Azure Arc-enabled Kubernetes clusters](how-to-deploy-self-hosted-gateway-azure-arc.md).
* Learn more about guidance for [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md).
