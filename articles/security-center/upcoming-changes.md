---
title: Important changes coming to Azure Security Center
description: Upcoming changes to Azure Security Center that you might need to be aware of and for which you might need to plan 
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/26/2020
ms.author: memildin

---

# Important upcoming changes to Azure Security Center

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Security Center. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Azure Security Center](release-notes.md).


## Planned changes

### "System updates should be installed on your machines" recommendation getting sub-recommendations

#### Summary

| Aspect | Details |
|---------|---------|
|Announcement date | 9th November 2020  |
|Date for this change  |  Mid-end November 2020 |
|Impact     | During the transition from the current version of this recommendation to its replacement, your secure score might change. Also, if you have resources for which this is the only outstanding recommendation, the health status of those resources may temporarily show as "healthy". |
|  |  |

We're releasing an enhanced version of the **System updates should be installed on your machines** recommendation. The new version will *replace* the current version in the apply system updates security control and brings the following improvements:

- Sub-recommendations for each missing update
- A redesigned experience in the Azure Security Center pages of the Azure portal
- Enriched data for the recommendation from Azure Resource Graph

#### Transition period

There will be a transition period of approximately 36hrs. To minimize any potential disruption, we've scheduled the update to take place over a weekend. During the transition, your secure scores might be affected.

#### Redesigned portal experience

The recommendation details page for **System updates should be installed on your machines** includes the list of findings as shown below. When you select a single finding, the details pane opens with a link to the remediation information and a list of affected resources.

:::image type="content" source="./media/upcoming-changes/system-updates-should-be-installed-subassessment.png" alt-text="Opening one of the sub-recommendations in the portal experience for the updated recommendation":::


#### Richer data from Azure Resource Graph

Azure Resource Graph is a service in Azure that is designed to provide efficient resource exploration with the ability to query at scale across a given set of subscriptions so that you can effectively govern your environment. 

For Azure Security Center, you can use ARG and the [Kusto Query Language (KQL)](https://docs.microsoft.com/azure/data-explorer/kusto/query/) to query a wide range of security posture data.

When querying the current version of **System updates should be installed on your machines**, the only information available from ARG is that the recommendation needs to be remediated on a machine. When the updated version is released, the following query will return each missing system updates grouped by machine.

```kusto
securityresources
| where type =~ "microsoft.security/assessments/subassessments"
| where extract(@"(?i)providers/Microsoft.Security/assessments/([^/]*)", 1, id) == "071393f9-b2ef-4dc2-bd58-ef0b07ed12d2"
| where properties.status.code == "Unhealthy"
```

## Next steps

For all recent changes to the product, see [What's new in Azure Security Center?](release-notes.md).