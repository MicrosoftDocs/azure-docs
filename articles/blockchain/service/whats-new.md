---
title: What's new? Release notes - Azure Blockchain Service
description: Learn what is new with Azure Blockchain Service, such as the latest release notes, versions, known issues, and upcoming changes.
ms.date: 06/03/2020
ms.topic: conceptual
ms.reviewer: ravastra
---

# What's new in Azure Blockchain Service?

> Get notified about when to revisit this page for updates by copying and pasting this URL: `https://docs.microsoft.com/api/search/rss?search=%22Release+notes+-+Azure+Blockchain+Service%22&locale=en-us` into your RSS feed reader [![RSS feed reader icon](./media/whats-new/feed-icon-16x16.png)](https://docs.microsoft.com/api/search/rss?search=%22Release+notes+-+Azure+Blockchain+Service%22&locale=en-us).

Azure Blockchain Service receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- New capabilities
- Version upgrades
- Known issues

---

## May 2020

### Version upgrades

- Ubuntu version upgrade to 18.04
- Quorum version upgrade to 2.5.0
- Tessera version upgrade 0.10.4

### Azure Blockchain Service supports sending rawPrivate transactions

**Type:** Feature

Customers can sign private transactions outside of the account on the node.

### Two-phase member provisioning

**Type:** Enhancement

Two phases help optimize scenarios where a member is being created in a long existing consortium. The member infrastructure is provisioned in first phase. In the second phase, the member is synchronized with blockchain. Two-phase provisioning helps avoid member creation failure due to timeouts.

## Known issues

### Mining stops if fewer than four validator nodes

Production networks should have at least four validator nodes. Quorum recommends at least four validator nodes are required to meet the IBFT crash fault tolerance (3F+1). You should have at least two Azure Blockchain Service *Standard* tier nodes to get four validator nodes. A standard node is provisioned with two validator nodes.  

If the Blockchain network on Azure Blockchain Service doesn’t have four validator nodes, then mining might stop on the network. You can detect mining has stopped by setting an alert on processed blocks. In a healthy network, processed block will be 60 blocks per node per five minutes.

As a mitigation, the Azure Blockchain Service team  has to restart the node. Customers need to open a support request to restart the node. The Azure Blockchain Service team is working toward detecting and fixing mining issues automatically.

Use the *Standard* tier for production grade deployments. Use the *Basic* tier for development, testing, and proof of concepts. Changing the pricing tier between basic and standard after member creation is not supported.

### Blockchain Data Manager requires Standard tier node

Use the *Standard* tier if you are using Blockchain Data Manager. The *Basic* tier has 4 GB memory only. Hence, it is not able to scale to the usage required by Blockchain Data Manager and other services running on it.

Use the *Basic* tier for development, testing, and proof of concepts. Changing the pricing tier between basic and standard after member creation is not supported.

### Large volume of unlock account calls causes geth to crash

A large volume of unlock account calls while submitting transaction can cause geth to crash on a transaction node. As a result, you have to stop ingesting transactions. Otherwise, the pending transaction queue increases.

Geth restarts automatically within less than a minute. Depending on the node, the syncing might take a long time. The Azure Blockchain Service team is enabling an archiving feature that will reduce the time to sync.

To identify geth crashes, you can check logs for any error message in Blockchain messages in application logs. You can also check if processed blocks decrease while pending transactions increase.

To mitigate the issue, send signed transactions instead of sending unsigned transactions with a command to unlock the account. For transactions that are already signed externally, there is no need to unlock the account.

If you want to send unsigned transactions, unlock the account for infinite time by sending 0 as the time parameter in the unlock command. You can lock the account back after all the transactions are submitted.  

The following are the geth parameters that Azure Blockchain Service uses. You cannot adjust these parameters.

- Istanbul block period: 5 secs
- Floor gas limit: 700000000
- Ceil gas limit: 800000000

### Large volume of private transactions reduces performance

If you are using Azure Blockchain Service Basic tier and private transactions, Tessera may crash.

You can detect the Tessera crash by reviewing the Blockchain application logs and searching for the message `Tessera crashed. Restarting Tessera...`.

Azure Blockchain Service restarts Tessera when there is a crash. Restart takes about a minute.

Use the *Standard* tier if you are sending a high volume of private transactions. Use the *Basic* tier for development, testing, and proof of concepts. Changing the pricing tier between basic and standard after member creation is not supported.

### Calling eth.estimateGas function reduces performance

Calling *eth.estimateGas* function multiple times reduces transactions per second drastically. Do not use *eth.estimateGas* function for each transaction submission. The *eth.estimateGas* function is memory intensive.

If possible, use a conservative gas value for submitting transactions and minimize the use of *eth.estimateGas*.

### Unbounded loops in smart contracts reduces performance

Avoid unbounded loops in smart contracts as they can reduce performance. For more information, see the following resources:

- [Avoid unbounded loops](https://blog.b9lab.com/getting-loopy-with-solidity-1d51794622ad )
- [Smart contract security best practices](https://github.com/ConsenSys/smart-contract-best-practices)
- [Smart contract guidelines provided by Quorum](http://docs.goquorum.com/en/latest/Security/Framework/Decentralized%20Application/Smart%20Contracts%20Security/)
- [Guidelines on gas limits and loops provided by Solidity](https://solidity.readthedocs.io/en/develop/security-considerations.html#gas-limit-and-loops)
