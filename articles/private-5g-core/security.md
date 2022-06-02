---
title: Security
titleSuffix: Azure Private 5G Core Preview
description: An overview of security features provided by Azure Private 5G Core.
author: richardwhiuk
ms.author: rwhitehouse
ms.service: private-5g-core
ms.topic: conceptual
ms.date: 01/25/2022
---

# Security for Azure Private 5G Core Preview

*Azure Private 5G Core* allows service providers and systems integrators to securely deploy and manage private mobile networks for an enterprise. It securely stores network configuration and SIM configuration used by devices connecting to the mobile network. This article lists details about the security capabilities provided by Azure Private 5G Core that help protect the mobile network.

Azure Private 5G Core consists of two main components that interact with each other:

- **The Azure Private 5G Core service, hosted in Azure**. The management resource used to create the private mobile network, manage sites, provision SIMs, and deploy packet core instances to sites.
- **Packet core instances, hosted on Azure Stack Edge devices**. The packet core, which provides connectivity to mobile devices at an edge location.

## Secure platform

Azure Private 5G Core requires deployment of packet core instances onto a secure platform, Azure Stack Edge. For more information on Azure Stack Edge security, see [Azure Stack Edge security and data protection](../databox-online/azure-stack-edge-security.md).

## Encryption at rest

The Azure Private 5G Core service stores all data securely at rest, including SIM credentials. It provides [encryption of data at rest](../security/fundamentals/encryption-overview.md) using platform-managed encryption keys, managed by Microsoft.

Azure Private 5G Core packet core instances are deployed on Azure Stack Edge devices, which handle [protection of data](../databox-online/azure-stack-edge-security.md#protect-your-data). 

## Write-only SIM credentials

Azure Private 5G Core provides write-only access to SIM credentials. SIM credentials are the secrets that allow UEs (user equipment) access to the network.

As these credentials are highly sensitive, Azure Private 5G Core won't allow users of the service read access to the credentials, except as required by law. Sufficiently privileged users may overwrite the credentials, or revoke them.

## Next steps

- [Deploy a private mobile network - Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md)
