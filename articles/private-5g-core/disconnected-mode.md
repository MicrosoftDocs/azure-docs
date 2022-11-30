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

# Disconnected mode for Azure PRivate 5G Core Preview

*Azure Private 5G Core* allows for *Azure Stack Edge (ASE)* disconnects of up to two days. Disconnected mode continues to allow core functionality during ASE disconnects due to network issues, network equipment resets, or network equipment being separated from a network temporarily.

## Functions not supported while in disconnected mode

The following functions are not supported while in disconnected mode:

- 5G core deployment
- SIM configuration updates
- Service policy updates
- NAT configuration updates
- 5G core version updates
- SIM provisioning

## Monitoring and troubleshooting during disconnects

AAD based sign sign-on for distributed tracing and Grafana monitoring will not be available while in disconnected mode. However, if you know ahead of time that you will need distributed tracing and Grafana access, you can configure username and password access to each of these.

Once the disconnect ends, Azure will update with the stored data (excluding rate and gauge type metrics).

## Next steps

- [Configure username and password for Grafana](packet-core-dashboards.md)
- [Configure username and password for distributed tracing](distributed-tracing.md)