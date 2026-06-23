---
title: Understand Advanced Encryption Standard in Azure NetApp Files
description: Learn how AES encryption works in Azure NetApp Files and how to safely transition Active Directory environments and volumes to AES.
ms.service: azure-netapp-files
ms.topic: concept-article
author: netapp-manishc
ms.author: anfdocs
ms.date: 06/15/2026
# Customer intent: As an IT administrator using Azure NetApp Files, I want to understand how AES encryption works and how to transition my environment to AES, so that I can secure Kerberos authentication for my volumes.
---
# Understand Advanced Encryption Standard in Azure NetApp Files

Azure NetApp Files provides cloud storage through a volume-as-a-service offering, using NAS protocols as the delivery mechanism to end users. When an Azure NetApp Files volume joins an Active Directory domain, Kerberos is used to authenticate SMB, dual-protocol, and NFSv4.1 connections. The Advanced Encryption Standard (AES) provides the strongest Kerberos encryption types available in Azure NetApp Files and is the recommended target state for any production environment.

This article explains how AES encryption works in the context of Azure NetApp Files, how to safely transition existing volumes and Active Directory environments to AES, and what to do if authentication breaks during the transition.

## How AES encryption works

AES is a symmetric block cipher standardized by [NIST](https://csrc.nist.gov/pubs/fips/197/final) and used by Kerberos to protect authentication exchanges and session traffic between clients, domain controllers, and Azure NetApp Files. In an Active Directory environment, AES is negotiated as a Kerberos encryption type when a client requests a service ticket for an Azure NetApp Files volume.

Azure NetApp Files supports the following AES Kerberos encryption types:

* AES-128 (AES128_HMAC_SHA1) for SMB, dual-protocol, and NFSv4.1 Kerberos volumes.
* AES-256 (AES256_HMAC_SHA1) for SMB, dual-protocol, and NFSv4.1 Kerberos volumes. For NFSv4.1 Kerberos, AES-256 is the recommended encryption type, though AES-128 is also supported.

During Kerberos negotiation, the client, the domain controller, and Azure NetApp Files agree on the strongest encryption type that all three parties support. If AES isn't enabled on any one of those components, the negotiation falls back to a weaker type such as RC4-HMAC or DES or fails outright when only AES is allowed elsewhere in the environment.

Because the negotiation requires agreement across all three parties, transitioning to AES is a coordinated change that touches Active Directory, the Azure NetApp Files Active Directory connection, and the clients that mount the volumes.

## How AES encryption is configured in Azure NetApp Files

AES encryption is configured at the NetApp account level on the Active Directory connection. The Active Directory connection controls whether AES is offered during Kerberos negotiation for every volume in that NetApp account that uses the connection.

Key configuration points:

* AES is enabled or disabled on the Active Directory connection not on individual volumes.
* Enabling AES on the Active Directory connection allows AES-128 and AES-256 to be offered alongside RC4 and DES.
* Disabling AES on the Active Directory connection restricts Azure NetApp Files to RC4 and DES only.
* The Active Directory side (the Azure NetApp Files computer object (or computer account), and any Group Policies that constrain Kerberos encryption types) must allow the encryption types you want Azure NetApp Files to use.

For details on creating and managing an Active Directory connection, see the Azure NetApp Files Active Directory guidance referenced in the Next steps section.

## Supported AES encryption types

The following table summarizes the Kerberos encryption types that can be negotiated for Azure NetApp Files volumes joined to Active Directory.

| Encryption type | Description | Supported protocols | Recommended |
| --- | --- | --- | --- |
| AES-256 | Strongest supported Kerberos encryption type. Required when using Windows Server 2025 domain controllers. | SMB, dual-protocol, NFSv4.1 Kerberos | Yes |
| AES-128 | Strong Kerberos encryption type supported by modern Windows clients and domain controllers. | SMB, dual-protocol, NFSv4.1 Kerberos | Yes |
| RC4-HMAC | Legacy Kerberos encryption type. Treat as a temporary transition setting only. | SMB, dual-protocol | No (transition only) |
| DES | Legacy Kerberos encryption type. Treat as a temporary transition setting only. | SMB, dual-protocol | No (transition only) |

NFSv4.1 Kerberos volumes on Azure NetApp Files support AES-256 and AES-128, with AES-256 recommended. RC4-HMAC and DES don't apply to NFSv4.1 Kerberos.

> [!NOTE]
> Windows Server 2025 domain controllers require AES-256. Verify domain controller version requirements before disabling weaker encryption types in your environment.

## Recommended approach for a safe transition to AES encryption

Follow this sequence to move an existing Azure NetApp Files environment from RC4 to AES without losing client connectivity. During the transition, RC4 remains enabled alongside AES to maintain authentication while AES settings propagate across the environment. RC4 is then removed after AES is validated. Don't enable DES. Microsoft considers DES highly insecure, and it is disabled by default in modern Windows and Active Directory environments. For the supporting Microsoft guidance, see the references listed in Next steps.

### Step 1: Enable RC4 and AES in Group Policy (temporary)

Update your Active Directory Group Policy so that the Azure NetApp Files computer object and the clients that mount the volumes allow the following Kerberos encryption types:

* AES-128
* AES-256
* RC4 (required during transition)

Don't enable DES. Azure NetApp Files supports DES as a legacy fallback but enabling it in modern Active Directory environments is highly discouraged due to security vulnerabilities. DES has been disabled by default since Windows Server 2008 R2. The transition path in this document relies on RC4 only as a temporary fallback alongside AES.

### Step 2: Apply the policy

Run `gpupdate /force` on domain controllers and on the clients that will mount Azure NetApp Files volumes or wait for normal Group Policy propagation. Confirm that the updated encryption type settings are in effect before continuing.

### Step 3: Enable AES encryption on the Azure NetApp Files Active Directory connection

1. Open the Azure portal and navigate to your NetApp account.
1. Select Active Directory connections.
1. Select Join (or edit the existing connection).
1. Select the AES Encryption checkbox.
1. Save the connection.

### Step 4: Validate AES encryption functionality

Confirm the following before removing any legacy encryption types:

* Kerberos authentication succeeds from representative SMB and NFSv4.1 Kerberos clients.
* No login or access issues occur for end users or service accounts.
* Workloads on SMB, dual-protocol, and NFSv4.1 Kerberos volumes continue to operate normally.

> [!NOTE]
> Enabling AES encryption on the Azure NetApp Files Active Directory connection doesn't change the encryption type for Kerberos tickets that have already been issued. Existing tickets keep the encryption type negotiated when they were created, so a client that already holds a ticket-granting ticket (TGT) or service ticket (TGS) encrypted with RC4 continues to use RC4 until that ticket expires. By default, the TGT lifetime is about 10 hours. To force clients to negotiate AES immediately, purge the cached tickets and reauthenticate. Run `klist purge` on Windows or `kdestroy` on Linux, or wait for the existing tickets to expire and renew naturally before validating.

### Step 5: Disable RC4 in Group Policy

Once AES is confirmed working end to end, update Group Policy to remove the legacy encryption types so that only AES remains. This is the target secure configuration.

### Step 6: Reapply and verify

Run `gpupdate /force` again on domain controllers and clients and confirm that the environment continues to operate correctly using AES only.

### Final desired configuration

| Setting | Where it's configured | Final desired state |
| --- | --- | --- |
| AES encryption | Azure NetApp Files Active Directory connection, plus Active Directory Group Policy | Enabled |
| RC4 encryption | Active Directory Group Policy | Disabled |
| DES encryption | Active Directory Group Policy | Disabled |

## Validate AES encryption

Azure NetApp Files doesn't publish a control-plane readout that confirms which Kerberos encryption type was negotiated for a given session. Validation is performed from the Active Directory and client side, using the AES checkbox state on the Azure NetApp Files Active Directory connection as the ANF-side confirmation. Use the following checks after the transition:

* Confirm that the Azure NetApp Files Active Directory connection shows AES Encryption as enabled.
* From a representative client, mount the Azure NetApp Files volume and confirm successful access without prompts or errors.
* Review Kerberos events on the domain controller and the client to verify that the encryption type used for service tickets to the Azure NetApp Files computer object is AES-128 or AES-256, not RC4 or DES.
* Run an application-level smoke test for each workload class (SMB file shares, dual-protocol access, NFSv4.1 Kerberos mounts) before declaring the transition complete.

## Recovery guidance

If authentication or access breaks at any point during the transition, use the following recovery steps to restore service while you investigate.

### Symptom: Clients can't authenticate after AES is enabled on Azure NetApp Files

1. Confirm that AES-128 and AES-256 are allowed for the Azure NetApp Files computer object and for the clients in Active Directory.
1. Confirm that Group Policy on the clients permits AES encryption types.
1. Verify DNS resolution and time synchronization between the clients, domain controllers, and Azure NetApp Files. Kerberos requires accurate time across all participants.
1. Inspect Kerberos-related logs on the client and on the domain controller for explicit encryption-type mismatches.

### Symptom: Authentication fails after disabling RC4 and DES

1. Confirm AES is still enabled on the Azure NetApp Files Active Directory connection.
1. Verify all participating systems support AES (domain controllers, member servers, and clients).
1. Check Kerberos configuration and logs for errors that indicate a client or service is still attempting RC4 or DES.
1. Temporarily re-enable RC4 in Group Policy to restore service, then resolve the underlying AES gap before disabling RC4 again.

### Symptom: A subset of clients works but others fail

Use the following general Active Directory troubleshooting steps when only some clients fail to authenticate. This guidance isn't Azure NetApp Files–specific.

* Identify whether the failing clients share an operating system version, Group Policy scope, or organizational unit.
* Confirm that the failing clients have received the latest Group Policy update and that their msDS-SupportedEncryptionTypes attribute (where applicable) includes the AES types.
* Re-run validation from a known-good client to confirm the issue is client-side and not a regression on the Azure NetApp Files Active Directory connection.

### General recovery principle

If you need to restore service quickly, temporarily re-enable RC4 in Group Policy and on the Azure NetApp Files Active Directory connection. RC4 isn't a long-term acceptable state, but it's a safe rollback point while you diagnose the AES configuration gap. After service is restored, work the transition sequence again from Step 1.

## Reference: msDS-SupportedEncryptionTypes in Active Directory

Active Directory uses the msDS-SupportedEncryptionTypes attribute on user, computer, and trust account objects to advertise which Kerberos encryption types each account supports. The Key Distribution Center (KDC) reads this attribute on the target account when issuing service tickets and uses it together with the client's supported types to select an encryption type that all parties accept. When the attribute is unset or zero, the KDC falls back to RC4 for backward compatibility — which is why some clients can continue to negotiate RC4 even after AES is enabled on the Azure NetApp Files Active Directory connection.

The attribute is a 32-bit bitmask. Each bit represents a single encryption type, and the attribute value is the bitwise OR of the supported types. The following table maps each bit to its encryption type.

| Bit (hex) | Decimal | Encryption type |
| --- | --- | --- |
| 0x1 | 1 | DES-CBC-CRC (legacy) |
| 0x2 | 2 | DES-CBC-MD5 (legacy) |
| 0x4 | 4 | RC4-HMAC (legacy, transition only) |
| 0x8 | 8 | AES128-CTS-HMAC-SHA1-96 |
| 0x10 | 16 | AES256-CTS-HMAC-SHA1-96 |

Values are combined by bitwise OR. Common combinations seen in practice:

* 0x18 (decimal 24) — AES-128 and AES-256 only. Recommended hardened state once the AES transition is complete.
* 0x1C (decimal 28) — RC4, AES-128, and AES-256. Typical transition value while AES is being introduced and RC4 is still required as a fallback.
* 0x0 (unset) — KDC falls back to RC4 for backward compatibility. Accounts that participate in Kerberos authentication for Azure NetApp Files should have this attribute explicitly set rather than left unset.

The Kerberos encryption types negotiated for an Azure NetApp Files volume are bounded by the intersection of: (1) the types allowed by the msDS-SupportedEncryptionTypes attribute on the Azure NetApp Files computer object and on each client account, (2) the Network security: Configure encryption types allowed for Kerberos Group Policy setting, and (3) the AES Encryption checkbox on the Azure NetApp Files Active Directory connection. Mismatches in any of these three places are the most common cause of clients that fail to negotiate AES after the transition.

## Next steps

* [Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files](understand-guidelines-active-directory-domain-service-site.md)
* [AES Encryption FAQ for Azure NetApp Files](faq-advanced-encryption-standard.md)
* [Understand Kerberos in Azure NetApp Files](kerberos.md)
* [Understand Server Message Block support in Azure NetApp Files](sever-message-block-support.md)
* [Configure Active Directory connection for NFSv4.1 Kerberos Encryption](configure-kerberos-encryption.md#configure-active-directory-connection)
* [Review Windows configurations for supported Kerberos encryption types](/windows-server/security/kerberos/kerberos-authentication-overview)
* [Review the Kerberos policy reference for encryption types and DES guidance](/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/network-security-configure-encryption-types-allowed-for-kerberos)
* [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md)
* [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md)
* [Create an Active Directory connection for Azure NetApp Files](create-active-directory-connections.md)
