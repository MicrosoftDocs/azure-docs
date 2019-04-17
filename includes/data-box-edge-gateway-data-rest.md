---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 04/16/2019
ms.author: alkohli
---

For the data-at-rest:

- For the data-at-rest, BitLocker XTS AES-256 encryption is used to protect the local data.
- For the data that resides in shares, the access to the shares is restricted.

    - For SMB clients that access the share data, they need user credentials associated with the share. These credentials are defined at the time of share creation.
    - For NFS clients that access the shares, the IP addresses of the clients need to be added at the time of share creation.