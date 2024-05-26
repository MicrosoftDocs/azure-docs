---
title: What's new
description: Learn about recent updates about Azure Web PubSub
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.topic: conceptual
ms.date: 11/15/2023
ms.custom: mode-other
---

# What's new with Azure Web PubSub

On this page, you can read about recent updates about Azure Web PubSub. As we make continuous improvements to the capabilities and developer experience of the service, we welcome any feedback and suggestions. Reach out to the service team at **awps@microsoft.com**


## Q1 2024

### Service VS Code extension is in public preview
Developers can manage Azure Web PubSub resources on Azure portal or using Azure CLI. Now with the release of Web PubSub service’s VS Code extension, developers who use VS Code enjoy the benefit of managing their Web PubSub resources right from within their code editor. This extension minimizes context switching and improves developers’ productivity.

**Features included:**
- View, create, delete, and restart Azure Web PubSub resources
- View, create, delete hub settings
- View, create, delete, and update event handlers
- View resource metrics
- Scale up and scale out
- Check resource health
- Regenerate access key
- Copy connection string or endpoint of the service to clipboard
- Switch the anonymous connect policy of hub setting
- Attach [Azure Web PubSub local tunnel tool](./howto-web-pubsub-tunnel-tool.md)
- View real-time resource logging during development through [LiveTrace tool](./howto-troubleshoot-resource-logs.md)

> [!div class="nextstepaction"]
> [Learn more about the new VS Code extension](./tutorial-develop-with-visual-studio-code.md)

## Q4 2023

### Web PubSub for Socket.IO is now generally available 

[Read more about the journey of bringing the support for Socket.IO on Azure.](https://socket.io/blog/socket-io-on-azure-preview/)

Since we public previewed the support for Socket.IO a few months back, we have received positive feedback from Socket.IO community. One user who migrated a Socket.IO app over the weekend even shared with us that it's "shockingly good."

Users enjoy the fact that they can offload scaling a Socket.IO app without changing anything to the core app logic. We're happy to share that the support for Socket.IO is now generally available and suitable for use in production.

> [!div class="nextstepaction"]
> [Quickstart for Socket.IO users](./socketio-quickstart.md)
>
> [Migrate a self-hosted Socket.IO app to Azure](./socketio-migrate-from-self-hosted.md)

## Q3 2023
### Geo-replica is now in public preview
The 99.9% and 99.95% uptime guarantees for the standard tier and premium tier are enough for most applications. Mission critical applications, however, demand even more stringent uptime. Developers had to set up two resources in different Azure regions and manage them with much complexity. With the geo-replication feature, it's now as simple as a few button clicks on Azure portal. 

> [!div class="nextstepaction"]
> [Learn more about all the benefits](./howto-enable-geo-replication.md)