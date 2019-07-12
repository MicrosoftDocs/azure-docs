---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 04/16/2019
ms.author: alkohli
---

For data in flight:

- Standard TLS 1.2 is used for data that travels between the device and Azure. There is no fallback to TLS 1.1 and earlier. Agent communication will be blocked if TLS 1.2 isn't supported. TLS 1.2 is also required for portal and SDK management.
- When clients access your device through the local web UI of a browser, standard TLS 1.2 is used as the default secure protocol.

    - The best practice is to configure your browser to use TLS 1.2.
    - If the browser doesn't support TLS 1.2, you can use TLS 1.1 or TLS 1.0.
- We recommend that you use SMB 3.0 with encryption to protect data when you copy it from your data servers.
