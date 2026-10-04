---
title: Create an enclave endpoint in the Azure portal
description: Learn how to create an enclave endpoint in Azure Enclave using the Azure portal.
author: jadean-msft
ms.author: jadean
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: how-to
ms.date: 09/16/2026
---

# Create an enclave endpoint in the Azure portal

In this how-to guide, you create an [enclave endpoint](./what-enclave-endpoint.md) in the Azure portal. Enclave endpoints define destination rules that other enclaves or transit hubs can use when creating enclave connections.

## Prerequisites

- An Azure subscription. If needed, create a [free Azure account](https://azure.microsoft.com/free/).
- A [community](./create-community-portal.md) and an [enclave](./create-enclave-portal.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create an enclave endpoint

1. Enter `Azure Enclave` in the search box.

1. Under `Services`, select `Azure Enclave`.

1. In the `Azure Enclave` page, select `Enclaves` in the left menu.

1. On the `Enclaves` page, select the name of your enclave to open the enclave resource.

1. Select `Enclave Endpoints` on the left navigation and then select `Create`.

   ![Screenshot showing the highlighted create button for enclave endpoints.](./media/tutorial-step-five-enclave-webapp-endpoint-list-create.png)

1. Enter the `Enclave endpoint name`, such as `endpoint-MyService`.

1. Under `Endpoint rules`, select `Add`.

1. Enter the `Rule Name`, `Destination IP addresses/CIDR range`, `Protocol`, and `Destination Port Range`.

   For example, to allow traffic to an HTTPS server hosted on an Azure virtual machine (VM) in a [workload](./what-workload.md), enter the VM private IP address or CIDR range, such as `10.0.2.5` or `10.0.2.0/26`, select `TCP`, and enter `443`.

   :::image type="content" source="./media/create-enclave-endpoint-tab-1-basics.png" alt-text="Screenshot showing the enclave endpoint creation screen with the endpoint rule dialog open." border="true" lightbox="./media/create-enclave-endpoint-tab-1-basics.png":::

   > [!NOTE]
   >
   > Enclave endpoint rules must use IPv4 destinations in the enclave virtual network. The destination CIDR must map to a subnet that is protected by a [network security group](/azure/virtual-network/network-security-groups-overview).

1. Select `Review + create`, validate that the details for your enclave endpoint are correct, and then select `Create`.

## Verify the enclave endpoint

After deployment completes, return to the enclave resource and select `Enclave Endpoints`. Verify that the new endpoint appears in the list with a status of `Succeeded`.

## Next steps

- [Create an enclave connection](./create-enclave-connection-portal.md)
- [What is an enclave endpoint?](./what-enclave-endpoint.md)
