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

All access to Azure Virtual Enclaves takes place through a Community or an Enclave. For this how-to article, create a [community](./create-community-portal.md) and [enclave](./create-enclave-portal.md) using the Azure portal.

## Sign-in to Azure

Sign-in to the [Azure portal](https://portal.azure.com).

## Create endpoint

1. Enter `Azure Virtual Enclaves` in the search.

2. Under `Services`, select `Azure Virtual Enclaves`.

3. In the `Azure Virtual Enclaves` page, select `Enclaves` in the left menu.

4. On the `Enclaves` page, select your Enclave's name.

5. While in your Enclave's page, select `Enclave Endpoints` in the left menu.

6. In the `Enclave Endpoints` page, select `Create`.

![Screenshot showing the highlighted create button for enclave endpoints.](./media/tutorial-step-five-enclave-webapp-endpoint-list-create.png)

7. Enter the basic details for your Enclave Endpoint
   - Enclave: Select an existing Enclave.
   - Enclave Endpoint name: Name of the enclave endpoint (ex: `endpoint-MyService`)
   - Endpoint rules: List of _Rule Names_, _Destination IP addresses/CIDR ranges_, _Destination port ranges_, and _Protocol_ tuples.
      - For example, if you were trying to create networking rules to allow other enclaves to talk to the `Enclave-WebApp` enclave, specifically an HTTPS server hosted on an Azure Virtual Machine (VM) with a Private IP address of `10.0.2.5` in subnet `10.0.2.0/26` in a [Workload](./what-workload.md), you would supply the `Destination` (for example `10.0.0.5` or `10.0.2.0/26`) of the VM, `443` for the `Port` range, and `TCP` for the `Protocol`.

![Screenshot showing the enclave endpoint creation screen with endpoint rule dialog open as well.](./media/tutorial-step-five-enclave-webapp-endpoint-rule.png)

> [!NOTE]
>
> Endpoints are primarily based on another underlying Azure service called [Network security groups](../virtual-network/network-security-groups-overview.md).

8. Select `Next`.

9. Enter any [Tags](../azure-resource-manager/management/tag-resources.md) for your Endpoint.

10.  Select `Review + create`, ensure the details for your Endpoint are correct, and select `Create`.
