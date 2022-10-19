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

The Azure Private 5G Core service stores all data securely at rest, including SIM credentials. It provides [encryption of data at rest](../security/fundamentals/encryption-overview.md) using platform-managed encryption keys, managed by Microsoft. Encryption at rest is used by default when [creating a SIM group](manage-sim-groups.md#create-a-sim-group).

Azure Private 5G Core packet core instances are deployed on Azure Stack Edge devices, which handle [protection of data](../databox-online/azure-stack-edge-security.md#protect-your-data).

## Customer-managed key encryption at rest

In addition to the default [Encryption at rest](#encryption-at-rest) using Microsoft-Managed Keys (MMK), you can optionally use Customer Managed Keys (CMK) when [creating a SIM group](manage-sim-groups.md#create-a-sim-group) or [when deploying a private mobile network](how-to-guide-deploy-a-private-mobile-network-azure-portal.md#deploy-your-private-mobile-network) to encrypt data with your own key.

If you elect to use a CMK, you will need to create a Key URI in your [Azure Key Vault](/azure/key-vault/) and a [User-assigned identity](/azure/active-directory/managed-identities-azure-resources/overview) with read, wrap, and unwrap access to the key.

- The key must be configured to have an activation and expiration date and we recommend that you [configure cryptographic key auto-rotation in Azure Key Vault](/azure/key-vault/keys/how-to-configure-key-rotation).
- The SIM group accesses the key via the user-assigned identity.
- For additional information on configuring CMK for a SIM group, see [Configure customer-managed keys](/azure/cosmos-db/how-to-setup-cmk).

> [!IMPORTANT]
> Once a SIM group is created, you cannot change the encryption type. However, if the SIM group uses CMK, you can update the key used for encryption.

## Write-only SIM credentials

Azure Private 5G Core provides write-only access to SIM credentials. SIM credentials are the secrets that allow UEs (user equipment) access to the network.

As these credentials are highly sensitive, Azure Private 5G Core won't allow users of the service read access to the credentials, except as required by law. Sufficiently privileged users may overwrite the credentials, or revoke them.

## Next steps

- [Deploy a private mobile network - Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md)
