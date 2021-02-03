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
ms.date: 01/25/2021
ms.author: memildin

---

# Important upcoming changes to Azure Security Center

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Security Center. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Azure Security Center](release-notes.md).


## Planned changes

- [Two recommendations from "Apply system updates" security control being deprecated](#two-recommendations-from-apply-system-updates-security-control-being-deprecated)
- [Enhancements to SQL data classification recommendation](#enhancements-to-sql-data-classification-recommendation)

### Two recommendations from "Apply system updates" security control being deprecated 

**Estimated date for change:** February 2021

The following two recommendations are scheduled to be deprecated in February 2021:

- **Your machines should be restarted to apply system updates**. This might result in a slight impact on your secure score.
- **Monitoring agent should be installed on your machines**. This recommendation relates to on-premises machines only and some of its logic will be transferred to another recommendation, **Log Analytics agent health issues should be resolved on your machines**. This might result in a slight impact on your secure score.

We recommend checking your continuous export and workflow automation configurations to see whether these recommendations are included in them. Also, any dashboards or other monitoring tools that might be using them should be updated accordingly.

Learn more about these recommendations in the [security recommendations reference page](recommendations-reference.md).


### Enhancements to SQL data classification recommendation

**Estimated date for change:** Q2 2021

The recommendation **Sensitive data in your SQL databases should be classified** in the **Apply data classification** security control will be replaced with a new version that's better aligned with Microsoft's data classification strategy. As a result the recommendation's ID will also change (currently b0df6f56-862d-4730-8597-38c0fd4ebd59).



## Next steps

For all recent changes to the product, see [What's new in Azure Security Center?](release-notes.md).
