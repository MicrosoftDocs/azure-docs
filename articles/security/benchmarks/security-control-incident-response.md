---
title: Security Control - Incident Response
description: Security Control Incident Response
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/16/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Incident Response

## Create incident response guide

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 10.1 | 19.1, 19.2, 19.3 | Customer |

**Guidance**: Ensure that there are written incident response plans that defines roles of personnel as well as phases of incident handling/management.<br><br>How to configure Workflow Automations within Azure Security Center:<br>https://docs.microsoft.com/en-us/azure/security-center/security-center-planning-and-operations-guide

## Create Incident Scoring and Prioritization Procedure

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 10.2 | 19.8 | Customer |

**Guidance**: Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

## Provide Security Incident Contact Details and Configure Alert Notifications &nbsp;for Security Incidents

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 10.3 | 19.5 | Customer |

**Guidance**: Security incident contact information will be used by Microsoft to contact the customer if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.<br><br>How to set the Azure Security Center Security Contact:<br>https://docs.microsoft.com/en-us/azure/security-center/security-center-provide-security-contact-details

## Incorporate security alerts into your incident response system

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 10.4 | 19.6 | Customer |

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. Customer may utilize the Azure Security Center data connector to stream the alerts Sentinel.<br><br>How to configure continuous export:<br>https://docs.microsoft.com/en-us/azure/security-center/continuous-export<br><br>How to stream alerts into Azure Sentinel:<br>https://docs.microsoft.com/en-us/azure/sentinel/connect-azure-security-center

## Automate the response to security alerts

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 10.5 | 19 | Customer |

**Guidance**: Utilize the Workflow Automation feature in Azure Security Center to automatically trigger responses via &quot;Logic Apps&quot; on security alerts and recommendations.<br><br>How to configure Workflow Automation and Logic Apps:<br>https://docs.microsoft.com/en-us/azure/security-center/workflow-automation

