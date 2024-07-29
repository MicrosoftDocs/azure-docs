---
title: Security
titleSuffix: Azure Private 5G Core
description: An overview of security features provided by Azure Private 5G Core.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: conceptual
ms.date: 01/25/2022
---

# Security for Azure Private 5G Core

*Azure Private 5G Core* allows service providers and systems integrators to securely deploy and manage private mobile networks for an enterprise. It securely stores network configuration and SIM configuration used by devices connecting to the mobile network. This article lists details about the security capabilities provided by Azure Private 5G Core that help protect the mobile network.

Azure Private 5G Core consists of two main components that interact with each other:

- **The Azure Private 5G Core service**, hosted in Azure - the management tools used to configure and monitor the deployment.
- **Packet core instances**, hosted on Azure Stack Edge devices - the complete set of 5G network functions that provide connectivity to mobile devices at an edge location.

## Secure platform

Azure Private 5G Core requires deployment of packet core instances onto a secure platform, Azure Stack Edge. For more information on Azure Stack Edge security, see [Azure Stack Edge security and data protection](../databox-online/azure-stack-edge-security.md).

## Encryption at rest

The Azure Private 5G Core service stores all data securely at rest, including SIM credentials. It provides [encryption of data at rest](../security/fundamentals/encryption-overview.md) using platform-managed encryption keys, managed by Microsoft. Encryption at rest is used by default when [creating a SIM group](manage-sim-groups.md#create-a-sim-group).

Azure Private 5G Core packet core instances are deployed on Azure Stack Edge devices, which handle [protection of data](../databox-online/azure-stack-edge-security.md#protect-your-data).

### Customer-managed key encryption at rest

In addition to the default [Encryption at rest](#encryption-at-rest) using Microsoft-Managed Keys (MMK), you can optionally use Customer Managed Keys (CMK) to encrypt data with your own key.

If you elect to use a CMK, you'll need to create a Key URI in your [Azure Key Vault](../key-vault/index.yml) and a [User-assigned identity](../active-directory/managed-identities-azure-resources/overview.md) with read, wrap, and unwrap access to the key. Note that:

- The key must be configured to have an activation and expiration date and we recommend that you [configure cryptographic key auto-rotation in Azure Key Vault](../key-vault/keys/how-to-configure-key-rotation.md).
- The SIM group accesses the key via the user-assigned identity.

For more information on configuring CMK, see [Configure customer-managed keys](/azure/cosmos-db/how-to-setup-cmk).

You can use Azure Policy to enforce using CMK for SIM groups. For more information, see [Azure Policy definitions for Azure Private 5G Core](azure-policy-reference.md).

> [!IMPORTANT]
> Once a SIM group is created, you cannot change the encryption type. However, if the SIM group uses CMK, you can update the key used for encryption.

## Write-only SIM credentials

Azure Private 5G Core provides write-only access to SIM credentials. SIM credentials are the secrets that allow UEs (user equipment) access to the network.

As these credentials are highly sensitive, Azure Private 5G Core won't allow users of the service read access to the credentials, except as required by law. Sufficiently privileged users may overwrite the credentials, or revoke them.

## NAS encryption

Non-access stratum (NAS) signaling runs between the UE and the AMF (5G) or MME (4G). It carries the information to allow mobility and session management operations that enable data plane connectivity between the UE and network.

The packet core performs ciphering and integrity protection of NAS. During UE registration, the UE includes its security capabilities for NAS with 128-bit keys. For ciphering, by default, Azure Private 5G Core supports the following algorithms in order of preference:

- NEA2/EEA2: 128-bit Advanced Encryption System (AES) encryption
- NEA1/EEA1: 128-bit Snow 3G
- NEA0/EEA0: 5GS null encryption algorithm

This configuration enables the highest level of encryption that the UE supports while still allowing UEs that don't support encryption. To make encryption mandatory, you can disallow NEA0/EEA0, preventing UEs that don't support NAS encryption from registering with the network.

You can change these preferences after deployment by [modifying the packet core configuration](modify-packet-core.md).

## RADIUS authentication

Azure Private 5G Core supports Remote Authentication Dial-In User Service (RADIUS) authentication. You can configure the packet core to contact a RADIUS authentication, authorization, and accounting (AAA) server in your network to authenticate UEs on attachment to the network and session establishment. Communication between the packet core and RADIUS server is secured with a shared secret that is stored in Azure Key Vault. The default username and password for UEs are also stored in Azure Key Vault. You can use the UE's International Mobile Subscriber Identity (IMSI) in place of a default username. See [Collect RADIUS values](collect-required-information-for-a-site.md#collect-radius-values) for details.

Your RADIUS server must be reachable from your Azure Stack Edge device on the management network. RADIUS is only supported for initial authentication. Other RADIUS features, such as accounting, are not supported.

## Access to local monitoring tools

### Secure connectivity using TLS/SSL certificates

Access to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md) is secured by HTTPS. You can provide your own HTTPS certificate to attest access to your local diagnostics tools. Providing a certificate signed by a globally known and trusted certificate authority (CA) grants further security to your deployment; we recommend this option over using a certificate signed by its own private key (self-signed).

If you decide to provide your own certificates for local monitoring access, you'll need to add the certificate to an [Azure Key Vault](../key-vault/index.yml) and set up the appropriate access permissions. See [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values) for more information on configuring custom HTTPS certificates for local monitoring access.

You can configure how access to your local monitoring tools is attested while [creating a site](create-a-site.md). For existing sites, you can modify the local access configuration by following [Modify the local access configuration in a site](modify-local-access-configuration.md).

We recommend that you rotate (replace) certificates at least once per year, including removing the old certificates from your system. You might need to rotate your certificates more frequently if they expire after less than one year, or if organizational policies require it.

For more information on how to generate a Key Vault certificate, see [Certificate creation methods](../key-vault/certificates/create-certificate.md).

### Access authentication

You can use [Microsoft Entra ID](../active-directory/authentication/overview-authentication.md) or a local username and password to access the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md). 

Microsoft Entra ID allows you to natively authenticate using passwordless methods to simplify the sign-in experience and reduce the risk of attacks. Therefore, to improve security in your deployment, we recommend setting up Microsoft Entra authentication over local usernames and passwords.

If you decide to set up Microsoft Entra ID for local monitoring access, after deploying a mobile network site, you'll need to follow the steps in [Enable Microsoft Entra ID for local monitoring tools](enable-azure-active-directory.md).

See [Choose the authentication method for local monitoring tools](collect-required-information-for-a-site.md#choose-the-authentication-method-for-local-monitoring-tools) for more information on configuring local monitoring access authentication.

You can use Azure Policy to enforce using Microsoft Entra ID for local monitoring access. For more information, see [Azure Policy definitions for Azure Private 5G Core](azure-policy-reference.md).

## Personally identifiable information

[Diagnostics packages](gather-diagnostics.md) may include personal data, customer data, and system-generated logs from your site. When providing the diagnostics package to Azure support, you are explicitly giving Azure support permission to access the diagnostics package and any information that it contains. You should confirm that this is acceptable under your company's privacy policies and agreements.

## Next steps

- [Deploy a private mobile network - Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md)
