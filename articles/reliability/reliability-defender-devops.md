---
title: Reliability in Microsoft Defender for Cloud for DevOps security
description: Find out about reliability in Defender for DevOps
author: anaharris-ms
ms.service: azure
ms.topic: reliability-article
ms.date: 10/24/2023
ms.author: anaharris
ms.custom: references_regions, subject-reliability
CustomerIntent: As a cloud architect/engineer, I need general guidance reliability in Defender for DevOps
---

# Reliability in Microsoft Defender for Cloud DevOps security

This article describes reliability support in [Microsoft Defender for Cloud DevOps security features](../defender-for-cloud/defender-for-devops-introduction.md), which includes [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

This article is specific to recover in the case of a region outage.  If you are looking to move your existing DevOps connector to a new region, please see [Common questions about Defender for DevOps](/azure/defender-for-cloud/faq-defender-for-devops#can-i-migrate-the-connector-to-a-different-region-)


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Microsoft Defender for Cloud DevOps security supports single-region disaster recovery. As such, a multi-region disaster recovery process simply implements the [single-region disaster recovery process outlined in this document](#single-region-disaster-recovery-process). 


### Supported regions

For regions that support DevOps security in Defender for Cloud, see [DevOps security region support](/azure/defender-for-cloud/devops-support#cloud-and-region-support).  


### Single-region disaster recovery process

The single region disaster recovery process for DevOps security features is based on the [Shared Responsibility model](/azure/security/fundamentals/shared-responsibility), and so includes both customer and Microsoft procedures.

#### Customer responsibility

When a region goes down, your configurations for the connector of that region is lost. Lost configurations include customer tokens, auto discovery configurations, and ADO annotations configurations.  

To request recovery of a connector created in a downed region:

1. Create a new connector in a new region. See onboarding documentation for [Azure DevOps](/azure/defender-for-cloud/quickstart-onboard-devops), [GitHub](/azure/defender-for-cloud/quickstart-onboard-github), and/or [GitLab](/azure/defender-for-cloud/quickstart-onboard-gitlab).
    >[!NOTE]
    >You can use an existing connector in the new region, as long as it's authenticated to have access to the scope of DevOps resources in the old connector.

1. Open a new support request to release ownership of the DevOps resources from the old connector.
    1.  In Azure portal, navigate to Help + Support
    1.  Fill out the form:
        1.  Issue type: `Technical`
        1.  Service type: `Microsoft Defender for Cloud`
        1.  Summary: "Region outage - DevOps Connector recovery"
        1.  Problem type: `Defender CSPM plan`
        1.  Problem subtype: `DevOps security`

1. Copy the Resource ID of the new and old DevOps connectors. This information is available in Azure Resource Graph.  Resource ID format: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Security/securityConnectors/{connectorName}`

   You can run the query below using [Azure Resource Graph Explorer](/azure/governance/resource-graph/first-query-portal) to find the Resource ID:
   ```
   resources
    | extend connectorType = tostring(parse_json(properties["environmentName"]))
    | where type == "microsoft.security/securityconnectors"
    | where connectorType in ("AzureDevOps", "Github", "GitLab")
    | project connectorResourceId = id, region = location

1. Once the DevOps resources have been released from the old connector and appear for the new connector, [reconfigure the pull request annotations](/azure/defender-for-cloud/enable-pull-request-annotations) as needed.

1. The new connector will be made primary. When the region recovers from the outage, you can safely delete the old connector.  



#### Microsoft responsibility

When a region goes down and you have established the new connector, Microsoft recreates all alerts, recommendations, and Cloud Security Graph entities from the old connector into the new connector.

>[!IMPORTANT]
> Microsoft doesn't recreate history for some functionalities, such as container mapping data from previous runs, alerts data more than one week old, and infrastructure as code (IaC) mapping history data.


#### Test your disaster recovery process

To test your disaster recovery process, you can simulate a lost connector by creating a second connector and following the support steps above.

## Next steps

To learn more about the items discussed in this article, see:

* [Azure HDInsight business continuity architectures](../hdinsight/hdinsight-business-continuity-architecture.md)
* [Azure HDInsight highly available solution architecture case study](../hdinsight/hdinsight-high-availability-case-study.md)
* [What is Apache Hive and HiveQL on Azure HDInsight?](../hdinsight/hadoop/hdinsight-use-hive.md)

> [!div class="nextstepaction"]
> [Reliability in Azure](availability-zones-overview.md)
