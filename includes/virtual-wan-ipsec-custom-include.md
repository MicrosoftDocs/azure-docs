---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 10/07/2019
 ms.author: cherylmc
 ms.custom: include file
---

When working with custom IPsec policies, keep in mind the following requirements:

* **IKE** - For IKE, you can select any parameter from IKE Encryption, plus any parameter from IKE Integrity, plus any parameter from DH Group.
* **IPsec** -  For IPsec, you can select any parameter from IPsec Encryption, plus any parameter from IPsec Integrity, plus PFS. If any of the parameters for IPsec Encryption or IPsec Integrity is GCM, then the parameters for both settings must be GCM.

>[!NOTE]
> With Custom IPsec policies, there is no concept of responder and initiator (unlike Default IPsec policies). Both sides (on-premises and Azure VPN gateway) will use the same settings for IKE Phase 1 and IKE Phase 2. Both IKEv1 and IKEv2 protocols are supported. There is no support for Azure as a responder only.
>

**Available settings and parameters**

| Setting | Parameters |
|--- |--- |
| IKE Encryption | AES256, AES192, AES128 |
| IKE Integrity | SHA384, SHA256, SHA1 |
| DH Group | DHGroup24, ECP384, ECP256, DHGroup14, DHGroup2048, DHGroup2 |
| IPsec Encryption | GCMAES256, GCMAES192, GCMAES128, AES256, AES192, AES128 |
| IPsec Integrity | GCMASE256, GCMAES192, GCMAES128, SHA256, SHA1 |
| PFS Group | PFS24, ECP384, ECP256, PFS2048, PFS2 |
