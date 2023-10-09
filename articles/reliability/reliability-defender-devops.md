---
title: Reliability in Microsoft Defender for DevOps
description: Find out about reliability in Defender for DevOps
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 10/09/2023
ms.author: anaharris
ms.custom: references_regions, subject-reliability
CustomerIntent: As a cloud architect/engineer, I need general guidance reliability in Defender for DevOps
---

# Reliability in Defender for DevOps

This article describes reliability support in [Defender for DevOps](../defender-for-cloud/defender-for-devops-introduction.md), which includes [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Defender for DevOps supports single-region disaster recovery. As such, a multi-region disaster recovery process simply implements [that single-region disaster recovery process outlined in this document](#single-region-disaster-recovery-process). Defender for DevOps uses a [Shared Responsibility model](/azure/security/fundamentals/shared-responsibility) in its approach to disaster recovery. 


### Supported regions

Defender for DevOps is only supported in the following regions: 

| Americas | Europe | Asia Pacific |
| ----- |----|--|
| Canada Central (Coming soon)| North Europe | Australia East|
|Central US   |Sweden Central | East Asia (Coming soon)|
| East US |UK South| Japan East (Coming soon)|
|West US (Coming soon)|UK West (Coming soon) ||
|| West Europe||


### Single-region disaster recovery process

The single region disaster recovery process for Defender for DevOps contains two re

#### Customer responsibility

When a region goes down, your configurations for the connector of that region is lost. Lost configurations include customer tokens, auto discovery configurations, and ADO annotations configurations. To recover, you'll need to recreate a new connector in a new region.  

>[!TIP]
>You can use an existing connector in the new region, as long as it's authenticated to have access to the Source Code Management (SCM) orgs of the old connector.

To create a new connector in a new region:

1. Copy the Resource ID of the old connector of the region that has the outage.

1. Open a ticket on Defender for DevOps to release ownership of the Source Code Management (SCM) orgs of the old connector. You can specify specific orgs or all orgs.

1. Once the old SCM orgs have been released and new entities appear for the new connector, recreate the annotation configuration if needed.

    >[!NOTE]
    >The time it takes to recreate the annotation configuration is proportional for how long it takes for the new connector to discover all the SCM orgs.

1. When the old region recovers from the outage, the new connector is made primary and you can safely delete the old connector.



#### Microsoft responsibility

When a region goes down and you have established the new connector, Microsoft recreates all alerts, recommendations, and Security Graph (SG) entities from the old connector into the new connector.

>[!IMPORTANT]
> Microsoft doesn't recreate history for some functionalities, such as container mapping data from previous runs, alerts data more than one week old, and IaC mapping history data.





## Next steps

To learn more about the items discussed in this article, see:

* [Azure HDInsight business continuity architectures](../hdinsight/hdinsight-business-continuity-architecture.md)
* [Azure HDInsight highly available solution architecture case study](../hdinsight/hdinsight-high-availability-case-study.md)
* [What is Apache Hive and HiveQL on Azure HDInsight?](../hdinsight/hadoop/hdinsight-use-hive.md)

> [!div class="nextstepaction"]
> [Reliability in Azure](availability-zones-overview.md)
