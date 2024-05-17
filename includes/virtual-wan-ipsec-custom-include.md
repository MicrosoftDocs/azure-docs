---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 09/12/2023
 ms.author: cherylmc
 ms.custom: include file
---

When working with custom IPsec policies, keep in mind the following requirements:

* **IKE** - For IKE, you can select any parameter from IKE Encryption, plus any parameter from IKE Integrity, plus any parameter from DH Group.
* **IPsec** -  For IPsec, you can select any parameter from IPsec Encryption, plus any parameter from IPsec Integrity, plus PFS. If any of the parameters for IPsec Encryption or IPsec Integrity is GCM, then the parameters for both settings must be GCM.

The default custom policy includes SHA1, DHGroup2, and 3DES for backward compatibility. These are weaker algorithms that aren't supported when creating a custom policy. We recommend only using the following algorithms:

**Available settings and parameters**

| Setting | Parameters |
|--- |--- |
| IKE Encryption | GCMAES256, GCMAES128, AES256, AES128 |
| IKE Integrity | SHA384, SHA256 |
| DH Group | ECP384, ECP256, DHGroup24, DHGroup14 |
| IPsec Encryption | GCMAES256, GCMAES128, AES256, AES128, None |
| IPsec Integrity | GCMAES256, GCMAES128, SHA256 |
| PFS Group | ECP384, ECP256, PFS24, PFS14, None |
| SA Lifetime |integer; min. 300/ default 3600 seconds |
