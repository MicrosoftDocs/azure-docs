---
title: "FAQ: SRE and Coding | Microsoft Docs"
titleSuffix: Azure
description: "FAQ: Understanding the relationship between SRE and coding"
author: dnblankedelman
manager: efreeman
ms.service: site-reliability-engineering
ms.topic: article
ms.date: 06/19/2020
ms.author: dnb

---
# Frequently asked questions: Do I need to know how to code to get involved with SRE?

When individuals are considering getting involved in SRE and teams are thinking about bringing in SRE practices, a common question that comes up is "Do you need to know how to code?"

The short answer: yes. 

But the full answer is a bit more nuanced. Let's look at three places where coding comes into play in site reliability engineering along with the level of coding expertise required for each. This list isn't complete, but these scenarios are some of the more common use cases.

## Scenario 1: Removing toil through automation

Site reliability engineers and others who use SRE practices attempt wherever possible to remove toil. "Toil" means a specific thing in SRE. Toil refers to operations work being done by a human that has certain characteristics. Toil has no long term redeeming value. It doesn't move the service forward in any meaningful way. It is often repetitive and largely manual (even though it could be automated). As the service or systems gets bigger over time, the number of requests for that system will also probably increase in quantity at a proportional rate and require even more manual labor.

For example, if a service requires the SRE team to reset something every week, or to provision new accounts and disk space by hand, or repeatedly restart it by hand--this is operational load that is toil. Completing those actions hasn’t made the service better in any long-term, persistent way. These actions will likely have to be repeated over and over.

SREs hate toil. They work to eliminate it whenever possible and appropriate. This is one of the places automation comes into play in SRE. If these requests can be handled automatically, that frees up the team to work on more rewarding and impactful things.

*Coding expertise*: automation requires some coding expertise, but it does not have to require full software engineering skills. If you can write small scripts (perhaps in PowerShell or Bourne shell) or even if you create an [https://docs.microsoft.com/azure/logic-apps/logic-apps-overview](Azure Logic app) with barely any code, this app can still help eliminate toil.

## Scenario 2: Control through APIs/domain specific languages (DSLs)/templates

Though not strictly necessary for SRE work, being able to control environments through APIs, DSLs, and Templates (especially cloud environments) allow SREs to scale up their work. Provisioning/De-provisioning infrastructure, configuring monitoring, and integrating several services all becomes much more efficient via coding.

*Coding expertise*: like the previous scenario, this requires some coding expertise, but it does not have to require full software engineering skills. In addition to the scripts and Logic apps mentioned before, [https://docs.microsoft.com/azure/azure-resource-manager/templates/overview](Azure Resource Manager Templates) can also be used with minimal coding experience.

## Scenario 3: Fixing the code

Site reliability engineers look to improving the reliability of a system. This goal sometimes requires digging into the source code of a system, determining the issue, and often contributing a fix back to the code base. While the level of sophistication of this work can vary widely based on the situation, coding expertise is a definite requirement in these cases.

*Coding expertise*: full software engineering expertise is often required in this scenario.


## Next steps

Interested in learning more about site reliability engineering and low-code work? Check out our [site reliability engineering hub](../index.yml), the product documentation linked above.
