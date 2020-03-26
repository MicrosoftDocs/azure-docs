---
title: Azure Security Control - Incident Response
description: Security Control Incident Response
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/30/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Incident Response

Protect the organization's information, as well as its reputation, by developing and implementing an incident response infrastructure (e.g., plans, defined roles, training, communications, management oversight) for quickly discovering an attack and then effectively containing the damage, eradicating the attacker's presence, and restoring the integrity of the network and systems.

## 10.1: Create an incident response guide

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 10.1 | 19.1, 19.2, 19.3 | Customer |

Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

How to configure Workflow Automations within Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide

Guidance on building your own security incident response process:

https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/

Microsoft Security Response Center's Anatomy of an Incident:

https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/

Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan:

https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf

## 10.2: Create an incident scoring and prioritization procedure

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 10.2 | 19.8 | Customer |

Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

## 10.3: Test security response procedures

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 10.3 | 19 | Customer |

Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities:

https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf

## 10.4: Provide security incident contact details and configure alert notifications for security incidents

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 10.4 | 19.5 | Customer |

Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

How to set the Azure Security Center Security Contact:

https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details

## 10.5: Incorporate security alerts into your incident response system

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 10.5 | 19.6 | Customer |

Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

How to configure continuous export:

https://docs.microsoft.com/azure/security-center/continuous-export

How to stream alerts into Azure Sentinel:

https://docs.microsoft.com/azure/sentinel/connect-azure-security-center

## 10.6: Automate the response to security alerts

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 10.6 | 19 | Customer |

Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via &quot;Logic Apps&quot; on security alerts and recommendations.

How to configure Workflow Automation and Logic Apps:

https://docs.microsoft.com/azure/security-center/workflow-automation

## Next steps

See the next security control: [Penetration Tests and Red Team Exercises](security-control-penetration-tests-red-team-exercises.md)