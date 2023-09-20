---
title: Migrate Azure Batch pools to the simplified compute node communication model
description: Learn how to migrate Azure Batch pools to the simplified compute node communication model and plan for feature end of support.
ms.service: batch
ms.topic: how-to
ms.date: 03/07/2023
---

# Migrate Azure Batch pools to the simplified compute node communication model

To improve security, simplify the user experience, and enable key future improvements, Azure Batch will retire the classic
compute node communication model on *March 31, 2026*. Learn how to migrate your Batch pools to using the simplified compute
node communication model.

## About the feature

An Azure Batch pool contains one or more compute nodes, which execute user-specified workloads in the form of Batch tasks.
To enable Batch functionality and Batch pool infrastructure management, compute nodes must communicate with the Azure Batch
service. In the classic compute node communication model, the Batch service initiates communication to the compute nodes and
compute nodes must be able to communicate with Azure Storage for baseline operations. In the Simplified compute node
communication model, Batch pools only require outbound access to the Batch service for baseline operations.

## Feature end of support

The simplified compute node communication model will replace the classic compute node communication model after *March 31, 2026*.
The change is introduced in two phases:

- From now until *September 30, 2024*, the default node communication mode for newly created
[Batch pools with virtual networks](./batch-virtual-network.md) will remain as classic.
- After *September 30, 2024*, the default node communication mode for newly created Batch pools with virtual networks will
switch to the simplified.

After *March 31, 2026*, the option to use classic compute node communication mode will no longer be honored. Batch pools
without user-specified virtual networks are generally unaffected by this change and the Batch service controls the default
communication mode.

## Alternative: Use simplified compute node communication model

The simplified compute node communication mode streamlines the way Batch pool infrastructure is managed on behalf of users.
This communication mode reduces the complexity and scope of inbound and outbound networking connections required in the
baseline operations.

The simplified model also provides more fine-grained data exfiltration control, since outbound communication to
*Storage.region* is no longer required. You can explicitly lock down outbound communication to Azure Storage if necessary for
your workflow. For example, autostorage accounts for AppPackages and other storage accounts for resource files or output files
can be scoped appropriately.

## Migrate your eligible pools

To migrate your Batch pools from classic to the simplified compute node communication model, follow this document
from the section entitled
[potential impact between classic and simplified communication modes](simplified-compute-node-communication.md#potential-impact-between-classic-and-simplified-communication-modes).
You can either create new pools or update existing pools with simplified compute node communication.

## FAQs

- Are public IP addresses still required for my pools?

  By default, a public IP address is still needed to initiate the outbound connection to the Azure Batch service from compute nodes. If you want to eliminate the need for public IP addresses from compute nodes entirely, see the guide to [create a simplified node communication pool without public IP addresses](./simplified-node-communication-pool-no-public-ip.md)

- How can I connect to my nodes for diagnostic purposes?

  RDP or SSH connectivity to the node is unaffected – load balancer(s) are still created which can route those requests through to the node when provisioned with a public IP address.

- Are there any differences in billing?

  There should be no cost or billing implications for the new model.

- Are there any changes to Azure Batch agents on the compute node?

  An extra agent on compute nodes is invoked in simplified compute node communication mode for both Linux and Windows, `Microsoft.BatchClusters.Agent` and `Microsoft.BatchClusters.Agent.exe`, respectively.

- Are there any changes to how my linked resources from Azure Storage in Batch pools and tasks are downloaded?

  This behavior is unaffected – all user-specified resources that require Azure Storage such as resource files, output files, or application packages are made from the compute node directly to Azure Storage. You need to ensure your networking configuration allows these flows.

## Next steps

For more information, see [Simplified compute node communication](./simplified-compute-node-communication.md).
