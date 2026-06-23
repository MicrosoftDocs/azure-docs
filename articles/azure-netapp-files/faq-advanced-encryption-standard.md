---
title: Advanced Encryption Standard FAQs for Azure NetApp Files
description: Answers frequently asked questions (FAQs) about Azure NetApp Files Advanced Encryption Standard.
ms.service: azure-netapp-files
ms.topic: concept-article
author: netapp-manishc
ms.author: anfdocs
ms.date: 06/15/2026
# Customer intent: As an IT administrator using Azure NetApp Files, I want to understand AES encryption for Active Directory connections, so that I can securely transition my environment to AES.
---
# Advanced Encryption Standard FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about Azure NetApp Files Advanced Encryption Standard (AES).

## Can I enable AES encryption for Azure NetApp Files Active Directory connections?

Yes. Azure NetApp Files supports AES encryption for Active Directory authentication. This applies to SMB, dual-protocol, and NFSv4.1 Kerberos scenarios that use an Active Directory connection. For SMB, Azure NetApp Files supports RC4-HMAC, AES-128, and AES-256. For NFSv4.1 Kerberos, Azure NetApp Files supports AES-256 and AES-128, with AES-256 recommended.

## Why do I need to temporarily enable RC4 in my Group Policy?

During initial setup, some environments require the legacy RC4 encryption type to successfully establish authentication between your on-premises Active Directory and Azure NetApp Files. Don't enable DES - it's highly discouraged in modern Active Directory environments due to security vulnerabilities. Limit any temporary fallback to RC4.

This is typically needed when:

* The environment doesn't yet fully support AES-only authentication.
* Kerberos negotiation falls back to older encryption methods during initial configuration.

Once AES is enabled and functioning, these legacy encryption types are no longer required.

## Is it safe to enable RC4?

RC4 is a legacy encryption algorithm and isn't recommended for long-term use. DES is even weaker and shouldn't be enabled at all in modern Active Directory environments. In this workflow, RC4 is the only legacy fallback that may be temporarily enabled:

* They're enabled temporarily for setup only.
* They should be disabled immediately after AES is successfully enabled and validated.

## What is the recommended sequence for enabling AES?

Enable the required Kerberos encryption types in Active Directory first, and then enable AES on the Azure NetApp Files Active Directory connection. Current guidance recommends enabling AES-128, AES-256, and RC4 in Active Directory before enabling AES on the Azure NetApp Files control plane. Don't enable DES. After AES is enabled and validated, remove RC4 so that only AES remains. If you plan to use Windows Server 2025 domain controllers in your Active Directory environment, AES-256 is required.

## Should RC4 remain enabled after AES is working?

No. RC4 should be treated as a temporary transition setting only, and DES shouldn't be enabled at all. After you confirm that authentication and client access work with AES, remove RC4 so the environment stays aligned with stronger Kerberos encryption practices.

## What is the final desired configuration?

AES encryption enabled; DES and RC4 encryption disabled. See the configuration table earlier in this article for details.

## What happens if I leave RC4 enabled?

Leaving RC4 enabled may:

* Increase security risk due to weaker encryption.
* Allow fallback to less secure authentication methods.

For best practices, ensure these are disabled after setup.

## What should I check if authentication fails after I disable legacy encryption (RC4)?

Verify that AES is still enabled on the Azure NetApp Files Active Directory connection, confirm that Active Directory still allows the required AES encryption types, and recheck DNS and time synchronization. If needed, validate from the representative clients and review Kerberos-related logs to determine whether the issue is caused by encryption negotiation, client configuration, or broader Active Directory connectivity.

If issues persist, work through the following checklist:

1. Confirm AES is correctly enabled in Azure NetApp Files.
1. Verify all systems support AES (domain controllers, clients).
1. Check Kerberos configuration and logs for errors.
1. Temporarily re-enable RC4 for troubleshooting if necessary.

## Next steps

* [Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files](understand-guidelines-active-directory-domain-service-site.md)
* [Understand Kerberos in Azure NetApp Files](kerberos.md)
* [Understand Server Message Block support in Azure NetApp Files](sever-message-block-support.md)
* [Configure Active Directory connection for NFSv4.1 Kerberos Encryption](configure-kerberos-encryption.md#configure-active-directory-connection)
* [Windows Configurations for Kerberos Supported Encryption Type](/archive/blogs/openspecification/windows-configurations-for-kerberos-supported-encryption-type)
