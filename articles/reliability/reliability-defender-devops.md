---
title: Reliability in Microsoft Defender for DevOps
description: Find out about reliability in Defender for DevOps
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 10/02/2023
ms.author: anaharris
ms.custom: references_regions, subject-reliability
CustomerIntent: As a cloud architect/engineer, I need general guidance reliability in Defender for DevOps
---

# Reliability in Defender for DevOps

This article describes reliability support in [Defender for DevOps](../defender-for-cloud/defender-for-devops-introduction.md), which includes [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Defender for DevOps supports single-region disaster recovery. As such, multi-region disaster recovery follows the same process. 

Defender for DevOps is only supported in the following regions: 

- List regions here



### What to expect when a region fails

#### Customer responsibility

When a region goes down, configuration for the connector of that region is lost. Lost configurations include, for example,customer tokens, auto discovery configurations, and ADO annotations configurations. 

1. Create configure a new connector in a new region.
1. Create an ICM on the feature team to release the ownership of the SCM orgs from the old connector.




#### Microsoft responsibility

When a region goes down and you have established the new connector, Microsoft recreates all alerts, recommendations, and SG entities from the old connector into the new connector.

>[!IMPORTANT]
> Microsoft does not recreate history for some functionalities, such as container mapping data from previous runs, alerts data more than one week old, and IaC mapping history data.



### Disaster recovery in single-region geography


## Next steps

To learn more about the items discussed in this article, see:

* [Azure HDInsight business continuity architectures](../hdinsight/hdinsight-business-continuity-architecture.md)
* [Azure HDInsight highly available solution architecture case study](../hdinsight/hdinsight-high-availability-case-study.md)
* [What is Apache Hive and HiveQL on Azure HDInsight?](../hdinsight/hadoop/hdinsight-use-hive.md)

> [!div class="nextstepaction"]
> [Reliability in Azure](availability-zones-overview.md)
