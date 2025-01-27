---
author: Y-Sindo
ms.author: zityang
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 06/22/2024
---

There are some limitations you should follow in your [MQTT](https://mqtt.org/mqtt-specification/) clients, otherwise the connection will be rejected. These MQTT protocol parameters include:
* Protocol versions: 3.1.1 or 5.0.
* Client ID format
    * Allowed characters: 0-9, a-z, A-Z
    * Length is between 1 and 128
* Keep-alive interval for MQTT 3.1.1: 1 - 180 seconds
* Last-will Topic format: Not empty, and contains at least one nonwhitespace character. The max length is 1024.
* Last-will message size: up to 2,000 bytes