---
title: Provision a self-hosted gateway in Azure API Management | Microsoft Docs
description: Learn how to provision a self-hosted gateway in Azure API Management.
services: api-management
documentationcenter: ''
author: miaojiang
manager: gwallace
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 03/31/2020
ms.author: apimpm

---

# Provision a self-hosted gateway in Azure API Management

Provisioning a gateway resource in your Azure API Management instance is a prerequisite for deploying a self-hosted gateway. This article walks through the steps to provision a gateway resource in API Management.

## Prerequisites

Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Provision a self-hosted gateway

1. Select the **Gateways** from under **Settings**.
2. Click **+ Add**.
3. Enter the **Name** and **Region** of the gateway.
> [!TIP]
> **Region** specifies intended location of the gateway nodes that will be associated with this gateway resource. It's semantically equivalent to a similar property associated with any Azure resource, but can be assigned an arbitrary string value.

4. Optionally, enter a **Description** of the gateway resource.
5. Optionally, select **+** under **APIs** to associate one or more APIs with this gateway resource.
> [!IMPORTANT]
> By default, none of the existing APIs will be associated with the new gateway resource. Therefore, attempts to invoke them via the new gateway will result in `404 Resource Not Found` responses.

6. Click **Add**.

Now the gateway resource has been provisioned in your API Management instance. You can proceed to deploy the gateway.

## Next steps

* To learn more about the self-hosted gateway, see [Azure API Management self-hosted gateway overview](self-hosted-gateway-overview.md)
* Learn more about how to [Deploy a self-hosted gateway to Kubernetes](how-to-deploy-self-hosted-gateway-kubernetes.md)
* Learn more about how to [Deploy a self-hosted gateway to Docker](how-to-deploy-self-hosted-gateway-docker.md)
