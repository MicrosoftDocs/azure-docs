---
title: Overview Socket.IO Serverless Mode
description: Get an overview of Azure's support for the open-source Socket.IO library on serverless mode.
keywords: Socket.IO, Socket.IO on Azure, serverless, multi-node Socket.IO, scaling Socket.IO, socketio, azure socketio
author: zackliu
ms.author: chenyl
ms.date: 08/5/2024
ms.service: azure-web-pubsub
ms.topic: how-to
---

# Socket.IO Serverless Mode Spec

## Client workflow
 +---------------------+               +---------------------+ 
 |                     |               |                     |
 |      Client         |               |    Serverless       |
 |                     |               |    Architecture     |
 +---------+-----------+               +---------+-----------+
           |                                     |
           | Initialization Request              |
           +------------------------------------>+
           |                                     |
           |<------------------------------------+
           | Initialization Response             |
           | (Tokens/Connection Details)         |
           |                                     |
           |                                     |
           | Event Emission (HTTP POST)          |
           +------------------------------------>+
           |                                     |
           |                                     |
           |<------------------------------------+
           | Event Acknowledgement               |
           |                                     |
           |                                     |
           | Event Listening (Webhook)           |
           |<------------------------------------+
           |                                     |
           |                                     |
           |<------------------------------------+
           | Event Notification                  |
           |                                     |
           |                                     |
           | Disconnection Request               |
           +------------------------------------>+
           |                                     |
           |<------------------------------------+
           | Disconnection Acknowledgement       |
           |                                     |
 +---------+-----------+               +---------+-----------+
 |                     |               |                     |
 |                     |               |                     |
 |      Client         |               |    Serverless       |
 |                     |               |    Architecture     |
 +---------------------+               +---------------------+
