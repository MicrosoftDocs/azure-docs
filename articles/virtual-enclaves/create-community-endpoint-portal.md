---
title: Create a Community Endpoint in the Azure portal
description: Create a Community Endpoint in the Azure portal.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Create an Community Endpoint in the Azure portal

Quickly create an Community Endpoint in the Azure portal.

## Prerequisites
- To access Azure Virtual Enclaves, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

- All access to Azure Virtual Enclaves takes place through a eommunity or an enclave. For this how-to article, create a [community](./create-community-azure-portal.md) and [enclave](./create-enclave-azure-portal.md) using the Azure portal.

## Sign-in to Azure
Sign-in to the Azure portal at https://portal.azure.com.

## Create Community Endpoint

1. Navigate to an existing Community within your Azure subscription, select the `Community Endpoints` blade, and click `Create`

![image1.png](./media/image-14144dce-d540-47e7-ad69-22af5af15cdb.png)

2. Provide a name for the Community Endpoint and click `Add` to create a Community rule. 

Community Endpoint rule types:
- **IP Address**: Enable traffic from an Enclave to an IP address outside of the Community vWAN
- **FQDN**: Enable traffic from an Enclave to a trusted Fully Qualified Domain Name (FQDN) (for example `*portal.azure.com`)
- **FQDN Tag**: Enable traffic from Enclaves to known Microsoft Azure services via FQDN Tags (for example `AzurePortal`)
- **Private Network**: Enable traffic from Enclaves to an external private network through a [Transit Hub](./create-a-transit-hub-from-the-azure-portal.md) connection

![image2.png](./media/image-b92e563b-574a-4cca-a7c6-a45e95ef5177.png)

3. Provide a name, destination type, destination, port, and protocol for the Community Endpoint Rule and click `Add`

![image3.png](./media/image-a2dde421-3678-4aa6-8de5-35f140226eba.png)
![image4.png](./media/image-dff67a65-9941-406c-80a0-9f5877569002.png)

4. Click `Review + Create` and click `Create`

![image5.png](./media/image-674a958e-abd5-472f-9cf6-83f23c897469.png)

**References**
- [What is a Community?](./what-is-a-community.md)
- [Create a Community](./create-community-azure-portal.md)
- [Best practices](./best-practices.md)
