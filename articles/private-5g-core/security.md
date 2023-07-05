---
title: Security
titleSuffix: Azure Private 5G Core
description: An overview of security features provided by Azure Private 5G Core.
author: richardwhiuk
ms.author: rwhitehouse
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

## Customer-managed key encryption at rest

In addition to the default [Encryption at rest](#encryption-at-rest) using Microsoft-Managed Keys (MMK), you can optionally use Customer Managed Keys (CMK) when [creating a SIM group](manage-sim-groups.md#create-a-sim-group) or [when deploying a private mobile network](how-to-guide-deploy-a-private-mobile-network-azure-portal.md#deploy-your-private-mobile-network) to encrypt data with your own key.

If you elect to use a CMK, you will need to create a Key URI in your [Azure Key Vault](../key-vault/index.yml) and a [User-assigned identity](../active-directory/managed-identities-azure-resources/overview.md) with read, wrap, and unwrap access to the key.

- The key must be configured to have an activation and expiration date and we recommend that you [configure cryptographic key auto-rotation in Azure Key Vault](../key-vault/keys/how-to-configure-key-rotation.md).
- The SIM group accesses the key via the user-assigned identity.
- For additional information on configuring CMK for a SIM group, see [Configure customer-managed keys](/azure/cosmos-db/how-to-setup-cmk).

> [!IMPORTANT]
> Once a SIM group is created, you cannot change the encryption type. However, if the SIM group uses CMK, you can update the key used for encryption.

## Write-only SIM credentials

Azure Private 5G Core provides write-only access to SIM credentials. SIM credentials are the secrets that allow UEs (user equipment) access to the network.

As these credentials are highly sensitive, Azure Private 5G Core won't allow users of the service read access to the credentials, except as required by law. Sufficiently privileged users may overwrite the credentials, or revoke them.

## Access to local monitoring tools

### Secure connectivity using TLS/SSL certificates

Access to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md) is secured by HTTPS. You can provide your own HTTPS certificate to attest access to your local diagnostics tools. Providing a certificate signed by a globally known and trusted certificate authority (CA) grants additional security to your deployment; we recommend this option over using a certificate signed by its own private key (self-signed).

If you decide to provide your own certificates for local monitoring access, you'll need to add the certificate to an [Azure Key Vault](../key-vault/index.yml) and set up the appropriate access permissions. See [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values) for additional information on configuring custom HTTPS certificates for local monitoring access.

You can configure how access to your local monitoring tools is attested while [creating a site](create-a-site.md). For existing sites, you can modify the local access configuration by following [Modify the local access configuration in a site](modify-local-access-configuration.md).

We recommend that you replace certificates at least once per year, including removing the old certificates from your system. This is known as rotating certificates. You might need to rotate your certificates more frequently if they expire after less than one year, or if organizational policies require it.

For more information on how to generate a Key Vault certificate, see [Certificate creation methods](../key-vault/certificates/create-certificate.md).

## Personally identifiable information

[Diagnostics packages](gather-diagnostics.md) may contain information from your site which may, depending on use, include data such as personal data, customer data, and system-generated logs. When providing the diagnostics package to Azure support, you are explicitly giving Azure support permission to access the diagnostics package and any information that it contains. You should confirm that this is acceptable under your company's privacy policies and agreements.

### Access authentication

You can use [Azure Active Directory (Azure AD)](../active-directory/authentication/overview-authentication.md) or a local username and password to access the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md). 

Azure AD allows you to natively authenticate using passwordless methods to simplify the sign-in experience and reduce the risk of attacks. Therefore, to improve security in your deployment, we recommend setting up Azure AD authentication over local usernames and passwords.

If you decide to set up Azure AD for local monitoring access, after deploying a mobile network site, you'll need to follow the steps in [Enable Azure Active Directory (Azure AD) for local monitoring tools](enable-azure-active-directory.md).

See [Choose the authentication method for local monitoring tools](collect-required-information-for-a-site.md#choose-the-authentication-method-for-local-monitoring-tools) for additional information on configuring local monitoring access authentication.

## Next steps

- [Deploy a private mobile network - Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md)