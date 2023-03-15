---
title: Explore risks to sensitive data - Microsoft Defender for Cloud
description: Learn how to use attack paths and security explorer to find and remediate risks to sensitive data in your cloud environment.
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 03/14/2023
ms.custom: template-how-to-pattern
---
# Explore risks to sensitive data

After [discovering resources with sensitive data](data-security-posture-enable.md), Microsoft Defender for Cloud lets you explore risks to sensitive data in:

- [Attack paths](#discover-publicly-available-sensitive-resources-through-attack-path-in-cloud-map)
- [Security Explorer](#discover-publicly-available-sensitive-resources-through-security-explorer-in-cloud-map)
- [Enriched Recommendations and Alerts](#discover-sensitive-resources-in-recommendations-and-alerts)

## Discover publicly available sensitive resources through attack path in cloud map 

MDC use environment context to perform a risk assessment of your security issues. Defender for Cloud identifies the biggest security risk issues, while distinguishing them from less risky issues.

Attack path analysis helps you to address the security issues that pose immediate threats with the greatest potential of being exploited in your environment. Defender for Cloud analyzes which security issues are part of potential attack paths that attackers could use to breach your environment. It also highlights the security recommendations that need to be resolved in order to mitigate it.

To see relevant attack paths, go: **Recommendations** > **Attack paths**

The following attack paths are related to sensitive data:

- “Internet exposed Azure Storage container with sensitive data is publicly accessible”

    To see the sensitive info types detected in the Azure Storage container, click on the container name in the graph, go to **Insights**, and expand the **Contain sensitive data** insight. To help you mitigate the risk of Storage Account container exposed to the internet with public access, go to **Recommendations**.

- “VM has high severity vulnerabilities and read permission to a data store with sensitive data”
- “Internet exposed AWS S3 Bucket with sensitive data is publicly accessible”
- “Internet exposed EC2 instance has high severity vulnerabilities and read permission to a S3 bucket with sensitive data”

Learn more about [attack paths](concept-attack-paths.md).

## Discover publicly available sensitive resources through Security explorer in cloud map

Cloud security explorer helps you identify security risks in your cloud environment by running graph-based queries on the cloud security graph, which is Defender for Cloud's context engine. You can prioritize your security team's concerns, while taking your organization's specific context and conventions into account.

With the cloud security explorer, you can query all of your security issues and environment context such as assets inventory, exposure to internet, permissions, lateral movement between resources and more.

For example, to get list of storage accounts/storage account containers which contain sensitive data and are also exposed to the internet, use this query:

Learn more about [cloud security explorer](how-to-manage-cloud-security-explorer.md).

## Discover sensitive resources in Recommendations and Alerts

Prioritize the alerts and recommendations related to resources with sensitivity labels and sensitive info types. Focus on protecting sensitive resources. The sensitive info types and sensitivity labels found are used in other areas of Microsoft Defender for Cloud. View the resource-level labels and info types in the Security alerts and Recommendations to help you prioritize and focus on protecting your critical resources.

<!-- 5. Next steps ------------------------------------------------------------------------

Required: Provide at least one next step and no more than three. Include some context so the 
customer can determine why they would click the link.
Add a context sentence for the following links.

-->

## Next steps
TODO: Add your next step link(s)

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.

-->