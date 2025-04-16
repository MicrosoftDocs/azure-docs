---
title: Create a Community Endpoint in the Azure portal
description: Create a Community Endpoint in the Azure portal.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Create a Community Endpoint in the Azure portal

Quickly create a Community Endpoint in the Azure portal.

## Prerequisites
- To access Azure Virtual Enclaves, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

- All access to Azure Virtual Enclaves takes place through a Community or an Enclave. For this how-to article, create a [Community](./create-community-portal.md) and [Enclave](./create-enclave-portal.md) using the Azure portal.

## Sign-in to Azure
Sign-in to the [Azure portal](https://portal.azure.com).

## Create Community Endpoint

1. Navigate to an existing Community within your Azure subscription, select the `Community Endpoints` on the left side, and select `Create`

![Screenshot showing the Community Endpoint create button highlighted.](./media/tutorial-step-five-fabrikam-endpoint-create.png)

2. Provide a name for the Community Endpoint and select `Add` to create a Community Endpoint rule. 

Community Endpoint rule types:
- **IP Address**: Enable traffic from an Enclave to an IP address outside of the Community vWAN
- **FQDN**: Enable traffic from an Enclave to a trusted Fully Qualified Domain Name (FQDN) (for example `*portal.azure.com`)
- **FQDN Tag**: Enable traffic from Enclaves to known Microsoft Azure services via FQDN Tags (for example `AzurePortal`)
- **Private Network**: Enable traffic from Enclaves to an external private network through a [Transit Hub](./create-transit-hub-portal.md) connection

3. Provide a name, destination type, destination, port, and protocol for the Community Endpoint Rule and select `Add`

![Screenshot showing the creation page for the Community Endpoint with the required inputs.](./media/tutorial-step-five-fabrikam-endpoint-rules.png)

4. Select `Review + Create` and select `Create`

![Screenshot showing Community Endpoint creation page ready for deployment.](./media/tutorial-step-five-fabrikam-endpoint-review-create.png)

**References**
- [What is a Community?](./what-community.md)
- [Create a Community](./create-community-portal.md)
- [Best practices](./best-practices.md)
