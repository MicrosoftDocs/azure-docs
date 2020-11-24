---
title: Azure Blockchain Service ledger versions, patching, & upgrade
description: Overview of the supported ledgers versions in Azure Blockchain Service. Including policies for systems patching and upgrades.
ms.date: 06/30/2020
ms.topic: conceptual
ms.reviewer: ravastra
#Customer intent: As an operator, I want to understand supported upgrades and versions for Azure Blockchain Service.
---

# Supported Azure Blockchain Service ledger versions

Azure Blockchain Service uses the Ethereum-based [Quorum](https://www.goquorum.com/developers) ledger designed for the processing of private transactions within a group of known participants, identified as a consortium in Azure Blockchain Service.

Currently, Azure Blockchain Service supports [Quorum version 2.6.0](https://github.com/jpmorganchase/quorum/releases/tag/v2.6.0) and [Tessera transaction manager](https://github.com/jpmorganchase/tessera).

## Managing updates and upgrades

Versioning in Quorum is done through a major, minor, and patch releases. For example, if the Quorum version is 2.0.1, release type would be categorized as follows:

|Major | Minor  | Patch  |
| :--- | :----- | :----- |
| 2 | 0 | 1 | 

Azure Blockchain Service automatically updates patch releases of Quorum to existing running members within 30 days of being made available from Quorum.

## Availability of new ledger versions

Azure Blockchain Service provides the latest major and minor versions of the Quorum ledger within 60 days of being available from the Quorum manufacturer. A maximum of four minor releases are provided for consortia to choose from when provisioning a new member and consortium. Upgrading from to a major or minor release is currently not supported. For example, if you are running version 2.x, an upgrade to version 3.x is currently not supported. Similarly, if you are running version 2.2, an upgrade to version 2.3 is currently not supported.

## How to check Quorum ledger version

You can check the Quorum version on your Azure Blockchain Service member by attaching to your node using geth or viewing diagnostic logs.

### Using geth

Attach to your Azure Blockchain Service node using geth. For example, `geth attach https://myblockchainmember.blockchain.azure.com:3200/<Access key>`.

Once your node is connected, geth reports the Quorum version similar to the following output:

``` text
instance: Geth/v1.9.7-stable-9339be03(quorum-v2.6.0)/linux-amd64/go1.13.12
```

For more information on using geth, see [Quickstart: Use Geth to attach to an Azure Blockchain Service transaction node](connect-geth.md).

### Using diagnostic logs

If you enable diagnostic logs, the Quorum version is reported for transaction nodes. For example, the following node informational log message includes the Quorum version.

``` text 
{"NodeName":"transaction-node","Message":"INFO [06-22|05:31:45.156] Starting peer-to-peer node instance=Geth/v1.9.7-stable-9339be03(quorum-v2.6.0)/linux-amd64/go1.13.12\n"}
{"NodeName":"transaction-node","Message":"[*] Starting Quorum node with QUORUM_VERSION=2.6.0, TESSERA_VERSION=0.10.5 and PRIVATE_CONFIG=/working-dir/c/tm.ipc\n"}
111
```

For more information on diagnostic logs, see [Monitor Azure Blockchain Service through Azure Monitor](monitor-azure-blockchain-service.md#diagnostic-settings).

## How to check genesis file content

To check genesis file content of your blockchain node, you can use the following Ethereum JavaScript API:

``` bash
admin.nodeInfo.protocols
```
You can call the API using a geth console or a web3 library. For more information on using geth, see [Quickstart: Use Geth to attach to an Azure Blockchain Service transaction node](connect-geth.md).

## Next steps

[Limits in Azure Blockchain Service](limits.md)
