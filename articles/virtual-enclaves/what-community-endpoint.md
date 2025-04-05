---
title: What is a Community endpoint?
description: What is a Community endpoint?
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# What is a Community endpoint?

A Community endpoint is a collection of trusted destinations and/or Transit Hub connections to private networks outside of the Community boundary. 
Enclave Connections associated with a Community Endpoint allow the Source Enclave to connect to the destination defined within the Community Endpoint. 

## Architecture of a community endpoint

![Graphic showing a Community with connections via Community Endpoints to external resoruces.](./media/community-connections-externally.png)

## Community Endpoint rule types:

- IP Address: Enable traffic from an Enclave to an IP address outside of the Community vWAN
- Fully Qualified Domain Name (FQDN): Enable traffic from an Enclave to a trusted FQDN (for example, *portal.azure.com)
- FQDN Tag: Enable traffic from Enclaves to known Microsoft Azure services via FQDN Tags (for example, "Azure portal")
- Private Network: Enable traffic from Enclaves to an external private network through an existing Transit Hub connection (Transit Hub must exist before a Private Network rule can be created).
