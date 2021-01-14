---
title: Connected registry access
description: Overview of the connected registry access capabilities
author: toddysm
ms.author: memladen
ms.service: container-registry
ms.topic: overview
ms.date: 01/13/2021
---

# Connected registry access

In this article, you learn about the connected registry access capabilities. It introduces the concepts used for authentication between the connected registry and the cloud registry as well as between nested connected registries and the clients.

## Login server and gateway server

As shown on the picture below, each connected registry must be connected to a parent.

![Connected Registry Authentication Overview](media/connected-registry/connected-registry-authentication-overview.svg)

The top parent is the cloud registry. The cloud registry uses two endpoints:

- The _login server_ that is used to authenticate the client and issue the authentication token.
- And the _gateway server_ that is used to exchange messages with the connected registry for synchronization purposes. The _gateway server_ endpoint is the regional data endpoint for the cloud registry.

Because the connected registry is deployed on your premises and doesn't have separate data endpoint, the _login server_ and the _gateway server_ endpoints for any child connected registries are the same.

## How to authenticate with the connected registry?

The connected registry uses ACR [token authentication][repository-scoped-permissions] only. As the picture above shows two different types of tokens are used for authentication:

- The _sync token_ is used by connected registries to authenticate with the parent. The sync token has permissions to sync repositories as well as permissions to read and write synchronization messages on the _gateway_. The _sync token_ is issued for the parent resource.
- The _client token_ is used by clients of the connected registry. The _client token_ has permissions to read repositories only. The _client token_ is issued for the connected registry.

## Next steps

In this overview, you learned the about the connected registry access concepts. Continue to the one of the following articles to learn about specific scenarios where connected registry can be utilized.

> [!div class="nextstepaction"]
> [Overview: Connected registry and IoT Edge][overview-connected-registry-and-iot-edge]

<!-- LINKS - internal -->
[overview-connected-registry-and-iot-edge]:overview-connected-registry-and-iot-edge.md
[repository-scoped-permissions]: container-registry-repository-scoped-permissions.md

