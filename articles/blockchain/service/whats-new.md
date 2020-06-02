---
title: What's new? Release notes - Azure Blockchain Service
description: Learn what is new with Azure Blockchain Service, such as the latest release notes, versions, known issues, and upcoming changes.
ms.date: 06/02/2020
ms.topic: conceptual
ms.reviewer: ravastra
---

# What's new in Azure Blockchain Service?

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://docs.microsoft.com/api/search/rss?search=%22Release+notes+-+Azure+Blockchain+Service%22&locale=en-us` into your ![RSS feed reader icon](./media/whats-new/feed-icon-16x16.png) feed reader.

Azure Blockchain Service receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- New capabilities
- Known issues
- Version upgrades

---

## May 2020

### Version upgrades

- Ubuntu version upgrade to 18.04
- Quorum Version upgrade to 2.5.0
- Tessera version upgrade 0.10.4

### Azure Blockchain Service supports sending rawPrivate transactions

**Type:** Feature

Customers can sign private transactions outside of the account on the node.

### Two phase member provisioning

**Type:** Enhancement

Two phases help optimize scenarios where a member is being created in a long existing consortium. The infra setup of the member is done in first phase. In the second phase, the member is synced with blockchain. Two phase provisioning helps avoid member creation failure due to timeouts.
