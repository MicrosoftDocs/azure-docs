---
title: Integrating AVE Enclaves into PLx Shared Services
description: Integrating AVE Enclaves into PLx Shared Services
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Integrating AVE Enclaves into PLx Shared Services

Certain AVE customers deployed enclaves with early preview or beta builds of AVE or predecessor systems (i.e. "mission enclaves"). These predecessor systems were deployed as part of a larger hub-and-spoke network architecture model, with mission enclaves able to leverage shared services offered by the hub PLx network.

If your AVE enclaves still need to leverage shared services offered by the hub PLx network, continue reading on how-to integrate with those services.

## Identity
- Domain joins
- GPOs
- OUs
- RBAC

## Security
- Nessus
- Tenable
- McAfee

## Patches
- Yum
- WSUS

## Logging & Monitoring
- CTOC (Desktop) LogA

## Networking
- Create Transit hubs/endpoints with Enclave Connections out to PLx allowed shared services CIDRs

## References
- [What is Azure Virtual Enclaves?](./what-is-azure-virtual-enclaves.md)
- [PLx Docs Site](https://docsiteendpoint-epa0cdc0awd5hpbp.z01.azurefd.us/)
