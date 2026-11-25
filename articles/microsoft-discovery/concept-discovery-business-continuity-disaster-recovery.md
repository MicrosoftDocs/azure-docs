---
title: Business continuity and disaster recovery for Microsoft Discovery
description: Learn how Microsoft Discovery supports business continuity across Azure regions and how to plan replication and failover for customer-managed resources.
author: anzaman
ms.author: alzam
ms.service: azure
ms.date: 11/10/2026
ms.topic: concept-article
---

# Business continuity and disaster recovery for Microsoft Discovery

Microsoft Discovery regional deployments operate independently. Business continuity during a regional outage requires a prepared secondary environment and a failover procedure.

Microsoft Discovery doesn't automatically replicate customer state between deployments. Investigation history, chat history, uploaded artifacts, and other persisted customer data from the primary region aren't automatically available in the secondary deployment.

## Recommended BCDR process

To plan for business continuity during a regional outage, take the following steps:

1. **Have a secondary environment** available in a separate supported Azure region. Verify regional capacity and availability for the infrastructure, agents, tools, models, and integrations that the secondary deployment needs. Reproduce the primary deployment's required configuration. For deployment instructions, see [Quickstart: Deploy Microsoft Discovery infrastructure](quickstart-infrastructure.md).

    Evaluate [object replication](/azure/storage/blobs/object-replication-overview) for supported block blobs between customer-managed primary and secondary Azure Storage accounts. If both environments share an Azure Container Registry (ACR), evaluate [geo-replication](/azure/container-registry/container-registry-geo-replication), which requires the Premium tier. Blob object replication and ACR geo-replication are asynchronous; verify that required files and images have reached the secondary environment.

1. **Keep the secondary environment synchronized** with the primary environment by ensuring that configuration changes, agent definitions, tools, and application updates are deployed consistently to both regions.
1. **Establish an operational failover procedure.** During an outage, direct users to the secondary deployment and verify that its tools, models, and integrations are available.
1. **Understand the data limitations.** Plan for investigation history, chat history, and other persisted data that isn't automatically replicated. Data created in the secondary region stays there unless you synchronize it. Don't assume file replication also restores service-managed history.
1. **Protect customer data** by choosing replication and recovery settings for customer-managed stateful resources according to your recovery objectives.

> [!IMPORTANT]
> Geo-redundant storage (GRS) replicates asynchronously and can lose recent writes. Secondary reads and writes require completed failover; RA-GRS allows secondary reads before failover, but not writes. See [Azure Storage redundancy](/azure/storage/common/storage-redundancy).

## Recommended resources for geo-replication

Evaluate resource-specific replication and recovery options:

- **Azure Blob Storage:** Configure object replication for supported block blobs according to your recovery objectives.
- **Azure Container Registry (ACR):** Configure geo-replication for the regions where tool container images are needed.
- **Azure Key Vault:** Plan how the secondary deployment will access required secrets, certificates, and keys. You can restore Key Vault object backups only within the same Azure subscription and geography. See [Azure Key Vault backup and restore](/azure/key-vault/general/backup).

Test failover and data recovery against your recovery objectives.
