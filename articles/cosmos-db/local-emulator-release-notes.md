---
title: Azure Cosmos Emulator download and release notes
description: Read the Azure Cosmos Emulator release notes and download it.
ms.service: cosmos-db
ms.topic: tutorial
author: markjbrown
ms.author: mjbrown
ms.date: 06/20/2019
---

# Use the Azure Cosmos Emulator for local development and testing

This article shows the Azure Cosmos emulator release notes with a list of feature updates made in each release, it also lists the latest version of emulator to download and use.

| | |
|---------|---------|
|**MSI download**|[Microsoft Download Center](https://aka.ms/cosmosdb-emulator)|
|**Get started**|[Develop locally with Azure Cosmos emulator](local-emulator.md)|

## Release notes

### 2.4.3

- Disabled starting the Mongo DB service by default; only the SQL endpoint is enabled as default. The user must start the endpoint manually using the emulator’s “/EnableMongoDbEndpoint” command line option just like all the other service endpoints such as Gremlin/Graph, Cassandra and Table.
- Fix a bug in the emulator when starting with “/AllowNetworkAccess” where the Gremlin/Graph, Cassandra and Table where not properly handling requests from external clients.
- Add direct connection ports to the Firewall Rules settings.

### 2.4.0

- Fix an issue with emulator failing to start when network monitoring apps such as Pulse Client are present on the host computer.
