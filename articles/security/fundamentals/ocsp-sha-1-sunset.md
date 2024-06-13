---
title: Sunset for SHA-1 Online Certificate Standard Protocol signing
description: Important information regarding changes to the OCSP service. 

services: azure
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 04/11/2023

ms.author: sarahlipsey
author: shlipsey3
manager: amycolannino
ms.reviewer: quentinb
---
# Sunset for SHA-1 Online Certificate Standard Protocol signing

> [!IMPORTANT]
> This article was published concurrent with the change described, and is not being updated. For up-to-date information about CAs, see [Azure Certificate Authority details](azure-ca-details.md).

Microsoft is updating the Online Certificate Standard Protocol (OCSP) service to comply with a recent change to the [Certificate Authority / Browser Forum (CA/B Forum)](https://cabforum.org/) Baseline Requirements. This change requires that all publicly-trusted Public Key Infrastructures (PKIs) end usage of the SHA-1 hash algorithms for OCSP responses by May 31, 2022.

Microsoft leverages certificates from multiple PKIs to secure its services. Many of those certificates already use OCSP responses that use the SHA-256 hash algorithm. This change brings all remaining PKIs used by Microsoft into compliance with this new requirement.

## When will this change happen?

Starting on March 28, 2022, Microsoft will begin updating its remaining OCSP Responders that use the SHA-1 hash algorithm to use the SHA-256 hash algorithm. By May 30, 2022, all OCSP responses for certificates used by Microsoft services will use the SHA-256 hash algorithm.

## What is the scope of the change?

This change impacts OCSP-based revocation for the Microsoft operated PKIs that were using SHA-1 hashing algorithms. All OCSP responses will use the SHA-256 hashing algorithm. The change only impacts OCSP responses, not the certificates themselves. 

## Why is this change happening?

The [Certificate Authority / Browser Forum (CA/B Forum)](https://cabforum.org/) created this requirement from [ballot measure SC53](https://cabforum.org/2022/01/26/ballot-sc53-sunset-for-sha-1-ocsp-signing/). Microsoft is updating its configuration to remain in line with the updated [Baseline Requirement](https://cabforum.org/baseline-requirements-documents/).

## Will this change affect me?

Most customers won't be impacted. However, some older client configurations that don't support SHA-256 could experience a certificate validation error.

After May 31, 2022, clients that don't support SHA-256 hashes will be unable to validate the revocation status of a certificate, which could result in a failure in the client, depending on the configuration. 

If you're unable to update your legacy client to one that supports SHA-256, you can disable revocation checking to bypass OCSP until you update your client. If your Transport Layer Security (TLS) stack is older than 2015, you should review your configuration for potential incompatibilities.

## Next steps

If you have questions, contact us through [support](https://azure.microsoft.com/support/options/).
