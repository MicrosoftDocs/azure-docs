---
title: Azure Sentinel SOAR content catalog | Microsoft Docs
description: This article displays and details the content provided by Azure Sentinel for security orchestration, automation, and response (SOAR), including playbooks and Logic Apps connectors.
services: sentinel
cloud: na
documentationcenter: na
author: yelevin
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 10/18/2021
ms.author: yelevin
---
# Azure Sentinel SOAR content catalog

> [!IMPORTANT]
>
> The ________________ is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Sentinel provides a wide variety of playbooks and connectors for security orchestration, automation, and response (SOAR), so that you can readily integrate Azure Sentinel with any product or service in your environment.

The integrations listed below may include some or all of the following components:

| Component type | Purpose | Use case and linked instructions |
| -------------- | ------- | -------------------------------- |
| **Playbook templates** | Automated workflow | Use playbook templates to deploy ready-made playbooks for responding to threats automatically.<br><br>[Automate threat response with playbooks in Azure Sentinel](automate-responses-with-playbooks.md) |
| **Azure Logic Apps managed connector** | Building blocks for creating playbooks | Playbooks use managed connectors to communicate with hundreds of both Microsoft and non-Microsoft services.<br><br>[List of Logic Apps connectors and their documentation](/connectors/connector-reference/) |
| **Azure Logic Apps custom connector** | Building blocks for creating playbooks | You may want to communicate with services that aren't available as prebuilt connectors. Custom connectors address this need by allowing you to create (and even share) a connector and define its own triggers and actions.<br><ul><li>[Custom connectors overview](/connectors/custom-connectors/)<li>[Create your own custom Logic Apps connectors](/connectors/custom-connectors/create-logic-apps-connector) |
|

You can find SOAR integrations and their components in the following places:

- Azure Sentinel solutions
- Logic Apps designer (for managed Logic Apps connectors)
- Azure Sentinel GitHub repository
- Azure Sentinel Automation blade, playbook templates tab

> [!TIP]
> - Many SOAR integrations can be deployed as part of an [Azure Sentinel solution](sentinel-solutions.md), together with related data connectors, analytics rules and workbooks. For more information, see the [Azure Sentinel solutions catalog](sentinel-solutions-catalog.md).
> - More integrations are provided by the Azure Sentinel community and can be found in the GitHub repository.
> - If you have a product or service that isn't listed or currently supported, please submit a Feature Request ***(link)***.  
> You can also create your own, using the following tools:
>    - Logic Apps custom connector
>    - Azure functions
>    - Logic Apps HTTP calls

##  Currently available SOAR content


 | Vendor | Products | Integration components | Supported by | Solution name | Scenarios | 
 | --- | --- | --- | --- | --- | --- | 
 | **Atlassian** | Jira | Managed Logic Apps connector<br><br>Playbooks | Microsoft (connector)<br><br>Community (playbooks) |  | Sync incidents | 
 | **CrowdStrike** | CrowdStrike Falcon endpoint protection | Playbooks | Microsoft | CrowdStrike Falcon Endpoint Protection Solution | Endpoints enrichment, isolate endpoints | 
 | **Checkpoint** | Checkpoint NGFW | Custom Logic Apps connector<br><br>Playbooks | CheckPoint | Checkpoint Azure Sentinel Solutions |  | 
 | **Cisco** | Cisco ASA | Custom Logic Apps connector<br><br>Playbooks | Community |  | Block IPs | 
 | **Cisco** | Cisco FirePower | Custom Logic Apps connector<br><br>Playbooks | Community |  | Block IPs and URLs | 
 | **Cisco** | Cisco ISE | Custom Logic Apps connector<br><br>Playbooks | Microsoft | Cisco ISE Solution |  | 
 | **Cisco** | Cisco Meraki | Custom Logic Apps connector<br><br>Playbooks | Community |  | Block IPs | 
 | **Cisco** | Cisco Umbrella | Custom Logic Apps connector<br><br>Playbooks | Microsoft | Cisco Umbrella Solution | Block domains, policies management, destination lists management, enrichment, and investigation | 
 | **F5** | Big-IP | Playbooks | Community |  | Block IPs and URLs | 
 | **Forcepoint** | Forcepoint NGFW | Custom Logic Apps connector<br><br>Playbooks | Community |  | Block IPs and URLs | 
 | **Fortinet** | FortiGate | Custom Logic Apps connector<br><br>Azure Function<br><br>Playbooks | Microsoft |  | Block IPs and URLs | 
 | **Freshdesk** |  | Managed Logic Apps connector |  |  | Sync incidents | 
 | **** | Have I Been Pwnd | Custom Logic Apps connector<br><br>Playbooks | Community |  |  | 
 | **HYAS Insight** | HYAS Insight | Managed Logic Apps connector<br><br>Playbooks | HYAS | HYAS Insight solution |  | 
 | **IBM** | Resilient | Custom Logic Apps connector<br><br>Playbooks | Community |  | Sync incidents | 
 | **Microsoft** | Azure DevOps | Managed Logic Apps connector<br><br>Playbooks | Microsoft (connector)<br><br>Community (playbooks) |  | Sync incidents | 
 | **Microsoft** | Azure Firewall | Custom Logic Apps connector<br><br>Playbooks | Microsoft | Azure Sentinel solution for Azure Firewall | Block IPs | 
 | **Microsoft** | Azure AD Identity Protection | Managed Logic Apps connector<br><br>Playbooks | Microsoft (connector)<br><br>Community (playbooks) |  | Users enrichment, Users remediation | 
 | **Microsoft** | Azure AD | Managed Logic Apps connector<br><br>Playbooks | Microsoft (connector)<br><br>Community (playbooks) |  | Users enrichment, Users remediation | 
 | **Microsoft** | Azure Data Explorer | Managed Logic Apps connector | Microsoft |  | Query and investigate | 
 | **Microsoft** | Azure Log Analytics Data Collector | Managed Logic Apps connector | Microsoft (connector)<br><br>Community (playbooks) |  | Query and investigate | 
 | **Microsoft** | MDE (Microsoft defender ATP) |  Managed Logic Apps connector<br><br>Playbooks | Microsoft (connector)<br><br>Community (playbooks) |  | Endpoints enrichment, isolate endpoints | 
 | **Microsoft** | Microsoft Teams |  Managed Logic Apps connector<br><br>Playbooks | Microsoft (connector)<br><br>Community (playbooks) |  | Notifications, Collaboration, create human involved responses | 
 | **Okta** | Okta | Managed Logic Apps connector<br><br>Playbooks | Community |  | Users enrichment, Users remediation | 
 | **Palo Alto** | Palo Alto PAN OS | Custom Logic Apps connector<br><br>Playbooks | Community |  | Block IPs and URLs | 
 | **Palo Alto** | Wildfire | Custom Logic Apps connector<br><br>Playbooks | Community |  | Filehash enrichment and response | 
 | **Proofpoint** | Proofpoint TAP | Custom Logic Apps connector<br><br>Playbooks | Microsoft | Proofpoint TAP | Accounts enrichment | 
 | **Recorded Future** | TitaniumCloud File Enrichment | Managed Logic Apps connector<br><br>Playbooks | Recoded Future | TitaniumCloud File Enrichment | FileHash enrichment | 
 | **ReversingLabs** | ReversingLabs Intelligence | Managed Logic Apps connector<br><br>Playbooks | ReversingLabs |  | Entities enrichment | 
 | **RiskIQ**  | RiskIQ Digital Footprint | Managed Logic Apps connector<br><br>Playbooks | RiskIQ | RiskIQ Security Intelligence Playbooks | Entities enrichment | 
 | **RiskIQ**  | RiskIQ Passive Total | Managed Logic Apps connector<br><br>Playbooks | RiskIQ |  | Entities enrichment | 
 | **RiskIQ**  | RiskIQ Security Intelligence | Managed Logic Apps connector<br><br>Playbooks | RiskIQ | RiskIQ Security Intelligence Playbools | Entities enrichment | 
 | **ServiceNow** | ServiceNow |  Managed Logic Apps connector<br><br>Playbooks | Microsoft (connector)<br><br>Community (playbooks) |  | Sync incidents | 
 | **Slack** | Slack |  Managed Logic Apps connector<br><br>Playbooks | Microsoft (connector)<br><br>Community (playbooks) |  | Notification, Collaboration | 
 | **Virus Total** | Virus Total |  Managed Logic Apps connector<br><br>Playbooks | Microsoft (connector)<br><br>Community (playbooks) |  | Entities enrichment | 
 | **VMWare** | Carbon Black Cloud | Custom Logic Apps connector<br><br>Playbooks | Community |  | Endpoints enrichment, isolate endpoints | 
 | **Zendesk** | Zendesk |  Managed Logic Apps connector<br><br>Playbooks | Microsoft (connector)<br><br>Community (playbooks) |  | Sync incidents | 
 | **Zscaler** | Zscaler | Playbooks | Microsoft |  | URL remediation, incident enrichment | 
 |



## Next steps

In this document, you learned about Azure Sentinel solutions and how to find and deploy them.

- Learn more about [Azure Sentinel Solutions](sentinel-solutions.md).
- [Find and deploy Azure Sentinel Solutions](sentinel-solutions-deploy.md).
