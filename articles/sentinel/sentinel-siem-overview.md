---
title: What is Microsoft Sentinel SIEM?
description: Learn about Microsoft Sentinel, a scalable, cloud-native SIEM and SOAR that uses AI, analytics, and automation for threat detection, investigation, and response.
author: guywi-ms
ms.author: guywild
ms.topic: overview
ms.service: microsoft-sentinel
ms.date: 09/14/2025
ms.custom: sfi-image-nochange

# Customer intent: As a business decision-maker evaluating SIEM/SOAR solutions, I want a summary of Microsoft Sentinel’s cloud-native capabilities so I can determine whether it meets my organization’s security, compliance, and operational requirements and plan adoption or migration.

---

# What is Microsoft Sentinel SIEM?

Microsoft Sentinel is a scalable, cloud-native security information and event management (SIEM) platform. It delivers cost-efficient security across multicloud and multiplatform environments with built-in AI, automation, threat intelligence, and a modern data lake architecture.

Microsoft Sentinel provides cyberthreat detection, investigation, response, and proactive hunting with a bird's-eye view across your enterprise. It incorporates Azure services like Log Analytics and Logic Apps and supports both Microsoft and custom threat intelligence.

Microsoft Sentinel SIEM helps analysts anticipate and stop attacks faster and more precisely. It also inherits Azure Monitor’s [tamper-proofing and immutability](url_1) practices and supports [Azure Lighthouse](url_2).

/data-security\" \\l \"tamper-proofing-and-immutability\" \\h) practices and supports [Azure Lighthouse](https://learn.microsoft.com/en-us/azure/lighthouse/overview\" \\h).

## Enable Out-of-the-Box Security Content

Sentinel SIEM includes packaged solutions for:

- Data ingestion
- Monitoring
- Alerting
- Hunting
- Investigation
- Response

Access via:
- [Defender portal](https://learn.microsoft.com/en-us/azure/sentinel/overview?tabs=defender-portal)
- [Azure portal](url_4)

learn.microsoft.com/en-us/azure/sentinel/overview?tabs=defender-portal)

More info: [About Sentinel content and solutions](https://learn.microsoft.com/en-us/azure/sentinel/sentinel-solutions)

## Collect Data at Scale

Collect data across users, devices, apps, and infrastructure—on-premises and in multiple clouds.

Access via:
- [Defender portal](https://learn.microsoft.com/en-us/azure/sentinel/overview?tabs=defender-portal)
- [Azure portal](url_6://learn.microsoft.com/en-us/azure/sentinel/overview?tabs=defender-portal)

## Detect Threats

Use Microsoft’s analytics and threat intelligence to detect threats and reduce false positives.

CapacityDescriptionGet StartedAnalyticsGroup alerts into incidents, reduce noise, detect anomaliesDetect threats| MITRE ATT&CK        | Visualize security status using MITRE tactics and techniques                | [MITRE coverage](https://learn.microsoft.com/en-us/azure/sentinel/mitre-coverage) |
| Threat Intelligence | Integrate multiple sources for context and detection                        | [Threat intelligence](https://learn.microsoft.com/en-us/azure/sentinel/understand-threat-intelligence) |
| Watchlists          | Correlate custom data with Sentinel events                                  | [Watchlists](https://learn.microsoft.com/en-us/azure/sentinel/watchlists) |
| Workbooks           | Create visual reports from templates or custom dashboards                   | [Workbooks](https://learn.microsoft.com/en-us/azure/sentinel/get-visibility) |

## Investigate Threats

Use AI and interactive graphs to investigate threats and hunt suspicious activity.

FeatureDescriptionGet StartedIncidentsDrill into entities and connections to find root causesInvestigate incidents| Hunts       | Proactively hunt threats using MITRE-based queries                          | [Threat hunting](https://learn.microsoft.com/en-us/azure/sentinel/hunting\" \\h) |
| Notebooks   | Use Jupyter notebooks for ML, visualization, and external data integration  | [Jupyter notebooks](https://learn.microsoft.com/en-us/azure/sentinel/notebooks\" \\h) |

## Respond to Incidents Rapidly

Automate tasks and orchestrate responses using playbooks built with Azure Logic Apps.

FeatureDescriptionGet StartedAutomation RulesManage incident handling with centralized rulesAutomation rules| Playbooks         | Automate responses using connectors like ServiceNow, Jira, etc.              | [Playbooks](https://learn.microsoft.com/en-us/azure/sentinel/automate-responses-with-playbooks), [Logic App connectors](https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-logicapps-connectors) |

## Azure Portal Retirement Timeline

Starting **July 2026**, Microsoft Sentinel will be supported only in the [Defender portal](https://learn.microsoft.com/en-us/azure/sentinel/microsoft-sentinel-defender-portal). Azure portal users will be redirected.

Plan your transition:
- [Sentinel in Defender portal](https://learn.microsoft.com/en-us/azure/sentinel/microsoft-sentinel-defender-portal)
- [Transition guide](https://learn.microsoft.com/en-us/azure/sentinel/move-to-defender)
- [Planning blog](https://techcommunity.microsoft.com/blog/microsoft-security-blog/planning-your-move-to-microsoft-defender-portal-for-all-microsoft-sentinel-custo/4428613)

## Changes for New Customers (Starting July 2025)

New customers onboarding their first workspace:

Customer TypeExperienceExisting customersNo auto-onboarding, no redirection links| Azure Lighthouse users | No auto-onboarding, no redirection links |
| New customers | Auto-onboarding if permissions are met; otherwise, manual onboarding required |

More info:
- [Onboarding guide](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard)
- [Owner permissions](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles)
- [User access admin](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles)

## Related Content

- [Onboard Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard)
- [Deployment guide](https://learn.microsoft.com/en-us/azure/sentinel/deploy-overview)
