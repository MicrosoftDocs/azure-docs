---
title: Disconnected mode
titleSuffix: Azure Private 5G Core
description: An overview of Azure Private 5G Core's disconnected mode.
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 11/30/2022
ms.custom: template-concept 
---

# Disconnected mode for Azure Private 5G Core

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

While in disconnected mode, you won't be able to change the local monitoring authentication method or sign in to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md) using Azure Active Directory. If you expect to need access to your local monitoring tools while the ASE is disconnected, you can change your authentication method to local usernames and passwords by following [Modify the local access configuration in a site](modify-local-access-configuration.md).

Once the disconnect ends, log analytics on Azure will update with the stored data, excluding rate and gauge type metrics.

## Next steps

- [Change the authentication method for local monitoring tools](modify-local-access-configuration.md)