---
title: Double Encryption in Microsoft Azure
description: This article describes how Microsoft Azure provides double encryption for data at rest and data in transit.
services: security
documentationcenter: na
author: TerryLanfear
manager: rkarlin

ms.assetid: 9dcb190e-e534-4787-bf82-8ce73bf47dba
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/01/2022
ms.author: terrylan
---
# Double encryption
Double encryption is where two or more independent layers of encryption are enabled to protect against compromises of any one layer of encryption. Using two layers of encryption mitigates threats that come with encrypting data. For example:

- Configuration errors in the data encryption
- Implementation errors in the encryption algorithm
- Compromise of a single encryption key

Azure provides double encryption for data at rest and data in transit.

## Data at rest
Microsoft’s approach to enabling two layers of encryption for data at rest is:

- **Encryption at rest using customer-managed keys**. You provide your own key for data encryption at rest. You can bring your own keys to your Key Vault (BYOK – Bring Your Own Key), or generate new keys in Azure Key Vault to encrypt the desired resources.
- **Infrastructure encryption using platform-managed keys**.  By default, data is automatically encrypted at rest using platform-managed encryption keys.

## Data in transit
Microsoft’s approach to enabling two layers of encryption for data in transit is:

- **Transit encryption using Transport Layer Security (TLS) 1.2 to protect data when it’s traveling between the cloud services and you**. All traffic leaving a datacenter is encrypted in transit, even if the traffic destination is another domain controller in the same region. TLS 1.2 is the default security protocol used. TLS provides strong authentication, message privacy, and integrity (enabling detection of message tampering, interception, and forgery), interoperability, algorithm flexibility, and ease of deployment and use.
- **Additional layer of encryption provided at the infrastructure layer**. Whenever Azure customer traffic moves between datacenters-- outside physical boundaries not controlled by Microsoft or on behalf of Microsoft-- a data-link layer encryption method using the [IEEE 802.1AE MAC Security Standards](https://1.ieee802.org/security/802-1ae/) (also known as MACsec) is applied from point-to-point across the underlying network hardware. The packets are encrypted and decrypted on the devices before being sent, preventing physical “man-in-the-middle” or snooping/wiretapping attacks. Because this technology is integrated on the network hardware itself, it provides line rate encryption on the network hardware with no measurable link latency increase. This MACsec encryption is on by default for all Azure traffic traveling within a region or between regions, and no action is required on customers’ part to enable.

## Next steps
Learn how [encryption is used in Azure](encryption-overview.md).
