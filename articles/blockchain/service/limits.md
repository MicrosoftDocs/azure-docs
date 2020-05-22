---
title: Azure Blockchain Service limits
description: Overview of the service and functional limits in Azure Blockchain Service
ms.date: 04/02/2020
ms.topic: conceptual
ms.reviewer: ravastra
#Customer intent: As an operator or architect, I want to understand service and functional limits for Azure Blockchain Service.
---

# Limits in Azure Blockchain Service

Azure Blockchain Service has service and functional limits such as the number of nodes a member can have, consortium restrictions, and storage amounts.

## Pricing tier

Maximum limits on transactions and validator nodes depend on whether you provision Azure Blockchain Service at basic or standard pricing tiers.

| Pricing tier | Max transaction nodes | Max validator nodes |
|:---|:---:|:---:|
| Basic | 10 | 1 |
| Standard | 10 | 2 |

Your consortium network should have a least two Azure Blockchain Service standard tier nodes. Standard tier nodes include two validator nodes. Four validator nodes are required to meet [Istanbul Byzantine Fault Tolerance consensus](https://github.com/jpmorganchase/quorum/wiki/Quorum-Consensus).

Use the basic tier is for development, testing, and proof of concepts. Use the standard tier for production grade deployments. You should also use the *Standard* tier if you are using Blockchain Data Manager or sending a high volume of private transactions.

Changing the pricing tier between basic and standard after member creation is not supported.

## Storage capacity

The maximum amount of storage that can be used per node for ledger data and logs is 1.8 terabytes.

Decreasing ledger and log storage size is not supported.
## Consortium limits

* **Consortium and member names must be unique** from other consortium and member names in the Azure Blockchain Service.

* **Member and consortium names cannot be changed**

* **All members in a consortium must be in the same pricing tier**

* **All members that participate in a consortium must reside in the same region**

    The first member created in a consortium dictates the region. Invited members to the consortium must reside in the same region as the first member. Limiting all members to the same region helps ensure network consensus is not negatively impacted.

* **A consortium must have at least one administrator**

    If there is only one administrator in a consortium, they cannot remove themselves from the consortium or delete their member until another administrator is added or promoted in the consortium.

* **Members removed from the consortium cannot be added again**

    Rather, they must be reinvited to join the consortium and create a new member. Their existing member resources are not deleted to preserve historical transactions.

* **All members in a consortium must be using the same ledger version**

    For more information on the patching, updates, and ledger versions available in Azure Blockchain Service, see [Patching, updates, and versions](ledger-versions.md).

## Performance

Do not use *eth.estimate* gas function for each transaction submission. The *eth.estimate* function is memory intensive. Calling the function multiple times reduces transactions per second drastically.

If possible, use a conservative gas value for submitting transactions and minimize the use of *eth.estimate*.

## Next steps

Learn more about policies regarding systems patching and upgrades - [Patching, updates, and versions](ledger-versions.md).
