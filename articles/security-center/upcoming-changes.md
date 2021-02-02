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

- [Kubernetes workload protection recommendations will soon be released for General Availability (GA)](#kubernetes-workload-protection-recommendations-will-soon-be-released-for-general-availability-ga)
- [Two recommendations from "Apply system updates" security control being deprecated](#two-recommendations-from-apply-system-updates-security-control-being-deprecated)
- [Enhancements to SQL data classification recommendation](#enhancements-to-sql-data-classification-recommendation)


### Kubernetes workload protection recommendations will soon be released for General Availability (GA)

**Estimated date for change:** February 2021

The Kubernetes workload protection recommendations described in [Protect your Kubernetes workloads](kubernetes-workload-protections.md) are currently in preview. While a recommendation is in preview, it doesn't render a resource unhealthy, and isn't included in the calculations of your secure score.

These recommendations will soon be released for General Availability (GA) and so *will* be included in the score calculation. If you haven't remediated them already, this might result in a slight impact on your secure score.

Remediate them wherever possible (learn how in [Remediate recommendations in Azure Security Center](security-center-remediate-recommendations.md)).

The Kubernetes workload protection recommendations are:

- Azure Policy add-on for Kubernetes should be installed and enabled on your clusters
- Container CPU and memory limits should be enforced
- Privileged containers should be avoided
- Immutable (read-only) root filesystem should be enforced for containers
- Container with privilege escalation should be avoided
- Running containers as root user should be avoided
- Containers sharing sensitive host namespaces should be avoided
- Least privileged Linux capabilities should be enforced for containers
- Usage of pod HostPath volume mounts should be restricted to a known list
- Containers should listen on allowed ports only
- Services should listen on allowed ports only
- Usage of host networking and ports should be restricted
- Overriding or disabling of containers AppArmor profile should be restricted
- Container images should be deployed only from trusted registries             

Learn more about these recommendations in [Protect your Kubernetes workloads](kubernetes-workload-protections.md).

### Two recommendations from "Apply system updates" security control being deprecated 

**Estimated date for change:** February 2021

The following two recommendations are scheduled to be deprecated in February 2021:

- **Your machines should be restarted to apply system updates**. This might result in a slight impact on your secure score.
- **Monitoring agent should be installed on your machines**. This recommendation relates to on-premises machines only and some of its logic will be transferred to another recommendation, **Log Analytics agent health issues should be resolved on your machines**. This might result in a slight impact on your secure score.

We recommend checking your continuous export and workflow automation configurations to see whether these recommendations are included in them. Also, any dashboards or other monitoring tools that might be using them should be updated accordingly.

Learn more about these recommendations in the [security recommendations reference page](recommendations-reference.md).


### Enhancements to SQL data classification recommendation

**Estimated date for change:** Q2 2021

The current version of the recommendation **Sensitive data in your SQL databases should be classified** in the **Apply data classification** security control will be replaced with a new version that's better aligned with Microsoft's data classification strategy. As a result:

- The recommendation will no longer affect your secure score
- The security control ("Apply data classification") will no longer affect your secure score
- The recommendation's ID will also change (currently b0df6f56-862d-4730-8597-38c0fd4ebd59)



## Next steps

For all recent changes to the product, see [What's new in Azure Security Center?](release-notes.md).
