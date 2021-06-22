---
author: craigktreasure
ms.service: azure-object-anchors
ms.topic: include
ms.date: 04/03/2020
ms.author: crtreasu
---
### Set up the Windows Device Portal

To connect to your HoloLens over WiFi, follow these steps:

1. First [Connect Your HoloLens to WiFi](/hololens/hololens-network).

2. Then get the IP address on the device under **Settings > Network & Internet > Wi-Fi > Advanced Options**.

3. From a web browser on your PC, go to `https://<YOUR_HOLOLENS_IP_ADDRESS>`. The browser will display the following message: "There's a problem with this website's security certificate". This message occurs because the certificate issued to the Device Portal is a self-signed certificate. You can ignore the certificate error and continue.

See [here](/windows/mixed-reality/using-the-windows-device-portal) for more info about setting up the Windows Device Portal.