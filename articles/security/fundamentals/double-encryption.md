---
title: Double encryption in Microsoft Azure
description: This article describes how Microsoft Azure provides double encryption for data at rest and data in transit.
services: security
author: msmbaldwin

ms.assetid: 9dcb190e-e534-4787-bf82-8ce73bf47dba
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 04/02/2026
ms.author: mbaldwin
ai-usage: ai-assisted
---
# Double encryption

Double encryption uses two or more independent layers of encryption to protect against compromises of any one layer of encryption. Two layers of encryption mitigate threats that come with encrypting data. For example:

- Data encryption configuration errors.
- Encryption algorithm implementation errors.
- Compromise of a single encryption key.

Azure provides double encryption for data at rest and data in transit.

## Data at rest

Microsoft uses two layers of encryption for data at rest:

- **Encryption at rest by using customer-managed keys**. You provide your own key for data encryption at rest. You can bring your own keys to your Key Vault (BYOK - bring your own key), or you can generate new keys in Azure Key Vault to encrypt the desired resources.
- **Infrastructure encryption by using platform-managed keys**. By default, Azure automatically encrypts data at rest by using platform-managed encryption keys.

These two layers use separate keys from independent key hierarchies. Different operators manage them: you control the service-level key while Microsoft controls the infrastructure-level key.

## Data in transit

Microsoft uses two layers of encryption for data in transit:

- **Transit encryption by using Transport Layer Security (TLS) 1.2 to protect data when it travels between cloud services and you**. All traffic leaving a datacenter is encrypted in transit, even if the traffic destination is another domain controller in the same region. TLS 1.2 is the default security protocol. TLS provides strong authentication, message privacy, and integrity (enabling detection of message tampering, interception, and forgery), interoperability, algorithm flexibility, and ease of deployment and use.
- **Extra layer of encryption at the infrastructure layer**. Whenever Azure customer traffic moves between datacenters outside physical boundaries that Microsoft or Microsoft representatives don't control, a data-link layer encryption method that uses the [IEEE 802.1AE MAC Security Standards](https://1.ieee802.org/security/802-1ae/) (also known as MACsec) applies from point to point across the underlying network hardware. The packets are encrypted and decrypted on the devices before being sent, preventing physical person-in-the-middle, snooping, or wiretapping attacks. Because this technology is integrated on the network hardware itself, it provides line rate encryption on the network hardware with no measurable link latency increase. This MACsec encryption is on by default for all Azure traffic traveling within a region or between regions, and you don't need to take action to enable it.

## Next steps

Learn how [Azure uses encryption](encryption-overview.md).
