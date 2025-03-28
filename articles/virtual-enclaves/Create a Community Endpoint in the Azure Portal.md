---
title: Create a Community Endpoint in the Azure Portal
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Quickstart: Create an Community Endpoint in the Azure portal
<link to "Why I need a Community Endpoint?" article>

## Prerequisites
- To access Azure Virtual Enclaves, you'll need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- All access to Azure Virtual Enclaves takes place through a eommunity or an enclave. For this how-to article, create a [community](docs/How%20To%20Guides/Create-a-Community-in-the-Azure-portal) and [enclave](docs/How%20To%20Guides/Create-an-Enclave-in-the-Azure-Portal) using the Azure portal.

## Sign-in to Azure
Sign-in to the Azure portal at https://portal.azure.com. For our MVP and Private Preview experience, you will have to navigate to the [RC Azure Portal](https://aka.ms/ave/privatepreview).

## Create Community Endpoint

1. Navigate to an existing Community within your Azure subscription, select the **Community Endpoints** blade, and click **Create**

![image.png](/assets/image-14144dce-d540-47e7-ad69-22af5af15cdb.png)

2. Provide a name for the Community Endpoint and click **Add** to create a Community rule. 

Community Endpoint rule types:
- **IP Address**: Enable traffic from an Enclave to an IP address outside of the Community vWAN
- **FQDN**: Enable traffic from an Enclave to a trusted FQDN (ex - *portal.azure.com)
- **FQDN Tag**: Enable traffic from Enclaves to known Microsoft/Azure services via FQDN Tags (Ex - "AzurePortal")
- **Private Network**: Enable traffic from Enclaves to an external private network through a [Transit Hub](docs/How%20To%20Guides/Create-a-Transit-Hub-from-the-Azure-Portal) connection

![image.png](/assets/image-b92e563b-574a-4cca-a7c6-a45e95ef5177.png)

3. Provide a name, destination type, destination, port, and protocol for the Community Endpoint Rule and click **Add**

![image.png](/assets/image-a2dde421-3678-4aa6-8de5-35f140226eba.png)
![image.png](/assets/image-dff67a65-9941-406c-80a0-9f5877569002.png)

4. Click **Review + Create** and click **Create**

![image.png](/assets/image-674a958e-abd5-472f-9cf6-83f23c897469.png)

**References**
- [What is a Community?](/docs/overview/what%20is%20a%20community)
- [Create a Community](docs/How%20To%20Guides/Create-a-Community-in-the-Azure-portal)
- [Concepts and best practices](/docs/concepts/Concepts-and-best-practices)
