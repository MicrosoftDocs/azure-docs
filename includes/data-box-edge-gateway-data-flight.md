---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 04/16/2019
ms.author: alkohli
---

For the data-in-flight:

- For data that goes between the device and Azure, standard TLS 1.2 is used. There is no fallback to TLS 1.1 and earlier. The agent communication will be blocked if TLS 1.2 is not supported. The TLS 1.2 is also required for portal and SDK management operations.
- When the clients access your device through the local web UI in a browser, standard TLS 1.2 is used as the default secure protocol.

    - The best practice is to configure your browser to use TLS 1.2.
    - If the browser does not support TLS 1.2, you can use TLS 1.1 or TLS 1.0.
- To protect the data when you copy it from your data servers, we recommend that you use SMB 3.0 with encryption.
