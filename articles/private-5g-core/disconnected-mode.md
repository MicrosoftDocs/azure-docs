---
title: Disconnected mode
titleSuffix: Azure Private 5G Core Preview
description: An overview of Azure Private 5G Core's disconnected mode.
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 11/30/2022
ms.custom: template-concept 
---

# Disconnected mode for Azure Private 5G Core Preview

*Azure Private 5G Core (AP5GC)* allows for *Azure Stack Edge (ASE)* disconnects of up to two days. Disconnected mode allows AP5GC core functionality to persist through ASE disconnects due to: network issues, network equipment resets and temporary network equipment separation.

## Functions not supported while in disconnected mode

The following functions aren't supported while in disconnected mode:

- Deployment of the 5G core
- Updating the 5G core version
- Updating SIM configuration
- Updating NAT configuration
- Updating service policy
- Provisioning SIMs

## Monitoring and troubleshooting during disconnects

<!-- TODO: add in paragraph once AAD feature is live and remove first sentence of existing paragraph.
Azure Active Directory based sign on for distributed tracing and Grafana monitoring won't be available while in disconnected mode. However, you can configure username and password access to each of these tools if you plan to require access during periods of disconnect. -->
Distributed tracing and packet core dashboards are accessible in disconnected mode. Once the disconnect ends, log analytics on Azure will update with the stored data, excluding rate and gauge type metrics.

## Next steps

- [Configure username and password for Grafana](packet-core-dashboards.md)
- [Configure username and password for distributed tracing](distributed-tracing.md)