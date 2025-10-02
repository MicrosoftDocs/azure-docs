---
title: Provision a self-hosted gateway in Azure API Management | Microsoft Docs
description: Learn how to provision a self-hosted gateway in Azure API Management.
services: api-management
author: dlepow
manager: gwallace
ms.service: azure-api-management
ms.topic: how-to
ms.date: 09/30/2025
ms.author: danlep
---

# Provision a self-hosted gateway in Azure API Management

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

Provisioning a gateway resource in your Azure API Management instance is a prerequisite for deploying a self-hosted gateway. This article walks through the steps to provision a gateway resource in API Management.

## Prerequisites

Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Provision a self-hosted gateway

1. Select the **Gateways** from under **Deployment and infrastructure**.
1. Select **+ Add**.
1. Enter the **Name** and **Region** of the gateway.

    > [!TIP]
    > **Region** specifies the intended location of the gateway nodes that are to be associated with this gateway resource. It's semantically equivalent to a similar property associated with any Azure resource, but can be assigned an arbitrary string value.

1. Optionally, enter a **Description** of the gateway resource.
1. Optionally, select **+** under **APIs** to associate one or more APIs with this gateway resource.

    > [!IMPORTANT]
    > By default, none of the existing APIs are associated with the new gateway resource. Therefore, attempts to invoke them via the new gateway results in `404 Resource Not Found` responses.

1. Select **Add**.

Now that the gateway resource is provisioned in your API Management instance. You can proceed to deploy the gateway.

## Related content

- To learn more about the self-hosted gateway, see [Azure API Management self-hosted gateway overview](self-hosted-gateway-overview.md)
- Learn more about how to [Deploy a self-hosted gateway to an Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md)
- Learn more about how to deploy a self-hosted gateway to Kubernetes using a [deployment YAML file](how-to-deploy-self-hosted-gateway-kubernetes.md) or [with Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md)
- Learn more about how to [Deploy a self-hosted gateway to Docker](how-to-deploy-self-hosted-gateway-docker.md)
