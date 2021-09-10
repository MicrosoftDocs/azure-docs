---
title: Azure Confidential Ledger architecture
description: Azure Confidential Ledger architecture
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 04/15/2021
ms.author: mbaldwin

---
# Architecture

The Azure Confidential Ledger, a REST API service, allows users to interact with the ledger through administrative and functional API calls.  When data is recorded to the ledger, it is sent to the permissioned blockchain nodes that are secure enclaved backed replicas. The replicas follow a consensus concept. A user can also retrieve receipts for the data that has been committed to the ledger.

There is also an optional consortium notion that will support multi-party collaboration in the future.

## Architecture diagram

This image provides an architectural overview of Azure Confidential Ledger, and shows Azure Confidential Ledger Users interacting with the Cloud APIs for a created ledger.

:::image type="content" source="./media/architecture-overview.png" alt-text="Architecture Overview":::

## Next steps

- [Overview of Microsoft Azure Confidential Ledger](overview.md)
- [Authenticating Azure Confidential Ledger nodes](authenticate-ledger-nodes.md)
