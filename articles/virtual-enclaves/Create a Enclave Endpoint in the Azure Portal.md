---
title: Create a Enclave Endpoint in the Azure Portal
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

## Prerequisites

To access Azure Virtual Enclaves, you'll need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

All access to Azure Virtual Enclaves takes place through a Community or an Enclave. For this how-to article, create a [community](docs/How%20To%20Guides/Create-a-Community-in-the-Azure-portal) and [enclave](docs/How%20To%20Guides/Create-an-Enclave-in-the-Azure-Portal) using the Azure portal.

## Sign-in to Azure

Sign-in to the Azure portal at https://portal.azure.com. For our MVP and Private Preview experience, you will have to navigate to the [RC Azure Portal](https://aka.ms/ave/privatepreview).

## Create endpoint

1. Enter _Azure Virtual Enclaves_ in the search.

2. Under **Services**, select **Azure Virtual Enclaves**.

3. In the **Azure Virtual Enclaves** page, select the **Enclaves** in the left menu.

4. On the **Enclaves** page, select your Enclave's name.

5. While in your Enclave's page, select **Enclave endpoints** in the left menu.

6. In the **Enclave endpoints** page, select Create. The **Create enclave endpoints** page opens.

7. Enter the basic details for your Enclave endpoint
   - Enclave: Select an existing Enclave.
   - Enclave endpoint name: Name of the enclave endpoint (ex: `enc-240309-andy`)
   - Endpoint rules: List of _Rule Names_, _Destination IP addresses/CIDR ranges_, _Destination port ranges_, and _Protocol_ tuples.
      - For example, if you were trying to create networking rules to allow other enclaves to talk to the `enc-240309-andy` enclave, specifically an HTTPS server hosted on an Azure Virtual Machine (VM) with a Private IP address of `10.0.0.5` in a [Workload](/docs/overview/what%20is%20a%20workload) hosted in the `enc-240309-andy` enclave, you would supply the **Destination** (e.g. `10.0.0.5`) of the VM, `443` for the **Port** range, and `TCP` for the **Protocol**.
![image.png](assets/image-a0b8d9e4-0146-40df-bf18-40d3edc6034d.png)

> Note:
>
> Endpoints are primarily based on another underlying Azure service called [Network security groups](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview).

1. Click **Next**.

2. Enter any [Tags](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources) for your Endpoint.

3.  Click **Review + create**, ensure the details for your Endpoint are correct, and click **Create**.
