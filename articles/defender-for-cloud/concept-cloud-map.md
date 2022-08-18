---
title: Cloud map security
description: Learn how to prioritize remediation of cloud misconfigurations and vulnerabilities based on risk. 
titleSuffix: Defender for Cloud cloud map.
ms.topic: conceptual
ms.date: 08/18/2022
---

# What is cloud map security

Cloud map security allows businesses to prioritize how they organize and remediate their cloud misconfigurations and vulnerabilities based on the risk level. With cloud map security, you'll gain visibility into your cloud environments and allow your security team to hunt and explore all of your cloud risks.

Security teams in general have many cloud misconfigurations and vulnerabilities to resolve. For them, it's hard to quickly understand each security risk imposed by their security issues and prioritize them in a meaningful way in order to remediate the highest risk issues. By using cloud map's graph based context and risk assessment engines, security teams can focus on the small percent of security issues that matter the most. 

:::image type="content" source="media/concept-cloud-map/security-map.png" alt-text="Image of a conceptualized graph that shows the complexity of security graphing.":::

## Assessing risk

When you assess your environments, certain scenarios will have lower risks, and others will have higher risk. It isn't always easy to differentiate which are which. Below are some clear example of situations that would be low, medium and high risk.

### High risk example

:::image type="content" source="media/concept-cloud-map/high-risk.png" alt-text="Image that shows a virtual machine that is exposed to the internet that could get infected and allow credit card information to be stolen. ":::

In this scenario, the virtual machine (VM) is exposed to the internet and all internal networks. In this scenario, the VM is putting the company at further risk because it has access to customers credit card information.

### Medium risk example

:::image type="content" source="media/concept-cloud-map/medium-risk.png" alt-text="Image that shows a virtual machine that is exposed to the internet that could get infected.":::

In this scenario, we have a VM that is exposed to the internet and got infected but doesn't have access to any sensitive information. Since no sensitive information is exposed, this scenario should be mitigated, but doesn't require the highest level priority.

### Low risk scenario

:::image type="content" source="media/concept-cloud-map/low-risk.png" alt-text="Image that shows a lone virtual machine with no internet access and no exposure to sensitive information.":::

In this scenario, we have a VM that is isolated from internet and all internal devices in the virtual network. It has a low risk of being compromised by an attacker.

## Cloud security engine

Security teams are expected to prioritize risks and remediate them. Microsoft Defender for Cloud allows you to search for all your cloud workloads that are affected by CVEs. However, it could be that there are many VMs that are infected with CVEs (for example, running a Log4j infected version), how does a security team decide which VMs has the highest risk of being exploited.

Defender for Cloud's security engine gathers all of the relevant information from your environments and creates a model of the data as a graph of inter-connected cloud assets. Security teams can then use the attack path analysis to prioritize and remediate all of their security threats.

:::image type="content" source="media/concept-cloud-map/attack-path-analysis.png" alt-text="Screenshot that shows a sample scenario that has the attack path analysis displayed." lightbox="media/concept-cloud-map/attack-path-analysis.png":::

By providing the environmental security context, organizations can prioritize and mitigate their most critical risks in their hybrid cloud environments.

## Next steps


