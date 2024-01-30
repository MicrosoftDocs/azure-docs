---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 12/07/2021
 ms.author: cherylmc
 ms.custom: include file
---

> [!NOTE]
> When working with Default policies, Azure can act as both initiator and responder during an IPsec tunnel setup. While Virtual WAN VPN supports many algorithm combinations, our recommendation is GCMAES256 for both IPSEC Encryption and Integrity for optimal performance. AES256 and SHA256 are considered less performant and therefore performance degradation such as latency and packet drops can be expected for similar algorithm types. For more information about Virtual WAN, see the [Azure Virtual WAN FAQ](../articles/virtual-wan/virtual-wan-faq.md).
>

### Initiator

The following sections list the supported policy combinations when Azure is the initiator for the tunnel.

**Phase-1**

* AES_256, SHA1, DH_GROUP_2
* AES_256, SHA_256, DH_GROUP_2
* AES_128, SHA1, DH_GROUP_2
* AES_128, SHA_256, DH_GROUP_2

**Phase-2**

* GCM_AES_256, GCM_AES_256, PFS_NONE
* AES_256, SHA_1, PFS_NONE
* AES_256, SHA_256, PFS_NONE
* AES_128, SHA_1, PFS_NONE

### Responder

The following sections list the supported policy combinations when Azure is the responder for the tunnel.

**Phase-1**

* AES_256, SHA1, DH_GROUP_2
* AES_256, SHA_256, DH_GROUP_2
* AES_128, SHA1, DH_GROUP_2
* AES_128, SHA_256, DH_GROUP_2

**Phase-2**

* GCM_AES_256, GCM_AES_256, PFS_NONE
* AES_256, SHA_1, PFS_NONE
* AES_256, SHA_256, PFS_NONE
* AES_128, SHA_1, PFS_NONE
* AES_256, SHA_1, PFS_1
* AES_256, SHA_1, PFS_2
* AES_256, SHA_1, PFS_14
* AES_128, SHA_1, PFS_1
* AES_128, SHA_1, PFS_2
* AES_128, SHA_1, PFS_14
* AES_256, SHA_256, PFS_1
* AES_256, SHA_256, PFS_2
* AES_256, SHA_256, PFS_14
* AES_256, SHA_1, PFS_24
* AES_256, SHA_256, PFS_24
* AES_128, SHA_256, PFS_NONE
* AES_128, SHA_256, PFS_1
* AES_128, SHA_256, PFS_2
* AES_128, SHA_256, PFS_14

### SA Lifetime Values

These life time values apply for both initiator and responder

* SA Lifetime in seconds: 3600 seconds
* SA Lifetime in Bytes: 102,400,000 KB
