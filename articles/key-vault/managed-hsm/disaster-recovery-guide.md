---
title: What to do in the event of an Azure service disruption that affects Managed HSM - Azure Key Vault | Microsoft Docs
description: Learn what to do in the event of an Azure service disruption that affects Managed HSM.
services: key-vault
author: amitbapat
manager: msmbaldwin

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 08/12/2020
ms.author: ambapat

---
# Managed HSM disaster recovery

In case your managed HSM is lost or unavailable due to any of the below reasons, 
- it was deleted and then purged
- a catastrophic failure in the region resulting in all member partitions being destroyed, , you can re-create the HSM instance in same or different region if you have following:
- Security Domain
- The private keys (at least quorum number) that encrypt the security domain
- most recent full HSM backup
or you want to create an exact replica of your HSM

Here is a quick outline of the disaster recovery procedure:
1. Create a new HSM Instance
2. When the HSM is in “Provisioned” state, activate “Security Domain restore mode”. A new RSA key pair (Security Domain Exchange Key) is generated for Security Domain transfer.
3. Download a SecurityDomainExchangeKey (public key). This key can only be retrieved when “security domain restore mode” is activated
4. Create a "Security Domain Transfer File" - you will need the private keys that encrypt the security domain. The private keys are used locally, and never transferred anywhere in this process.
5. Upload security domain to activate the HSM
6. Restore recent HSM backup
