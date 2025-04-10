---
title: Create a Enclave Endpoint in the Azure portal
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Create a Enclave Endpoint in the Azure portal

## Prerequisites

To access Azure Virtual Enclaves, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

All access to Azure Virtual Enclaves takes place through a Community or an Enclave. For this how-to article, create a [community](./create-community-azure-portal.md) and [enclave](./create-enclave-azure-portal.md) using the Azure portal.

## Sign-in to Azure

Sign-in to the Azure portal at https://portal.azure.com.

## Create endpoint

1. Enter `Azure Virtual Enclaves` in the search.

2. Under `Services`, select `Azure Virtual Enclaves`.

3. In the `Azure Virtual Enclaves` page, select the `Enclaves` in the left menu.

4. On the `Enclaves` page, select your Enclave's name.

5. While in your Enclave's page, select `Enclave endpoints` in the left menu.

6. In the `Enclave endpoints` page, select Create. The `Create enclave endpoints` page opens.

7. Enter the basic details for your Enclave endpoint
   - Enclave: Select an existing Enclave.
   - Enclave endpoint name: Name of the enclave endpoint (ex: `enc-240309-andy`)
   - Endpoint rules: List of _Rule Names_, _Destination IP addresses/CIDR ranges_, _Destination port ranges_, and _Protocol_ tuples.
      - For example, if you were trying to create networking rules to allow other enclaves to talk to the `enc-240309-andy` enclave, specifically an HTTPS server hosted on an Azure Virtual Machine (VM) with a Private IP address of `10.0.0.5` in a [Workload](/docs/overview/what-is-a-workload) hosted in the `enc-240309-andy` enclave, you would supply the `Destination` (for example `10.0.0.5`) of the VM, `443` for the `Port` range, and `TCP` for the `Protocol`.
![image1.png](./media/image-a0b8d9e4-0146-40df-bf18-40d3edc6034d.png)

> [!NOTE]
>
> Endpoints are primarily based on another underlying Azure service called [Network security groups](../virtual-network/network-security-groups-overview.md).

1. Select `Next`.

2. Enter any [Tags](../azure-resource-manager/management/tag-resources.md) for your Endpoint.

3.  Select `Review + create`, ensure the details for your Endpoint are correct, and select `Create`.
