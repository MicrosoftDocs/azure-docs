---
title: Microsoft Sentinel SOAR content catalog | Microsoft Docs
description: This article displays and details the content provided by Microsoft Sentinel for security orchestration, automation, and response (SOAR), including playbooks and Logic Apps connectors.
author: yelevin
ms.topic: reference
ms.date: 10/18/2021
ms.author: yelevin
---
# Microsoft Sentinel SOAR content catalog

Microsoft Sentinel provides a wide variety of playbooks and connectors for security orchestration, automation, and response (SOAR), so that you can readily integrate Microsoft Sentinel with any product or service in your environment.

The integrations listed below may include some or all of the following components:

| Component type | Purpose | Use case and linked instructions |
| -------------- | ------- | -------------------------------- |
| **Playbook templates** | Automated workflow | Use playbook templates to deploy ready-made playbooks for responding to threats automatically.<br><br>[Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md) |
| **Azure Logic Apps managed connector** | Building blocks for creating playbooks | Playbooks use managed connectors to communicate with hundreds of both Microsoft and non-Microsoft services.<br><br>[List of Logic Apps connectors and their documentation](/connectors/connector-reference/) |
| **Azure Logic Apps custom connector** | Building blocks for creating playbooks | You may want to communicate with services that aren't available as prebuilt connectors. Custom connectors address this need by allowing you to create (and even share) a connector and define its own triggers and actions.<br><ul><li>[Custom connectors overview](/connectors/custom-connectors/)<li>[Create your own custom Logic Apps connectors](/connectors/custom-connectors/create-logic-apps-connector) |
|

You can find SOAR integrations and their components in the following places:

- Microsoft Sentinel solutions
- Microsoft Sentinel Automation blade, playbook templates tab
- Logic Apps designer (for managed Logic Apps connectors)
- Microsoft Sentinel GitHub repository

> [!TIP]
> - Many SOAR integrations can be deployed as part of a [Microsoft Sentinel solution](sentinel-solutions.md), together with related data connectors, analytics rules and workbooks. For more information, see the [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).
> - More integrations are provided by the Microsoft Sentinel community and can be found in the GitHub repository.
> - If you have a product or service that isn't listed or currently supported, please submit a Feature Request.  
> You can also create your own, using the following tools:
>    - Logic Apps custom connector
>    - Azure functions
>    - Logic Apps HTTP calls


## Atlassian

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Jira** | [Managed Logic Apps connector](/connectors/jira/)<br><br>Playbooks | Microsoft<br><br>Community | Sync incidents |
|

## Check Point

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Check Point NGFW**<br>(Available as solution) | Custom Logic Apps connector<br><br>Playbooks | CheckPoint |  |
|

## Cisco

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Cisco ASA,<br>Cisco Meraki** | Custom Logic Apps connector<br><br>Playbooks | Community | Block IPs |
| **Cisco FirePower** | Custom Logic Apps connector<br><br>Playbooks | Community | Block IPs and URLs |
| **Cisco ISE**<br>(Available as solution) | Custom Logic Apps connector<br><br>Playbooks | Microsoft |  |
| **Cisco Umbrella**<br>(Available as solution) | Custom Logic Apps connector<br><br>Playbooks | Microsoft | Block domains, <br>policies management, <br>destination lists management, <br>enrichment, and investigation |
|

## Crowdstrike

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Falcon endpoint protection**<br>(Available as solution) | Playbooks | Microsoft | Endpoints enrichment,<br>isolate endpoints |
|

## F5

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Big-IP** | Playbooks | Community | Block IPs and URLs |
|

## Forcepoint

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Forcepoint NGFW** | Custom Logic Apps connector<br><br>Playbooks | Community | Block IPs and URLs |
|

## Fortinet

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **FortiGate**<br>(Available as solution) | Custom Logic Apps connector<br><br>Azure Function<br><br>Playbooks | Microsoft | Block IPs and URLs |
|

## Freshdesk

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Freshdesk** | [Managed Logic Apps connector](/connectors/freshdesk/) |  | Sync incidents |
|


## Have I Been Pwned

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Have I Been Pwned** | Custom Logic Apps connector<br><br>Playbooks | Community |  |
|

## HYAS

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **HYAS Insight**<br>(Available as solution) | [Managed Logic Apps connector](/connectors/hyasinsight/)<br><br>Playbooks | HYAS |  |
|

## IBM

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Resilient** | Custom Logic Apps connector<br><br>Playbooks | Community | Sync incidents |
|

## Microsoft

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Azure DevOps** | Managed Logic Apps connector<br><br>Playbooks | Microsoft<br><br>Community | Sync incidents |
| **Azure Firewall**<br>(Available as solution) | Custom Logic Apps connector<br><br>Playbooks | Microsoft | Block IPs |
| **Azure AD Identity Protection** | [Managed Logic Apps connector](/connectors/azureadip/)<br><br>Playbooks | Microsoft<br><br>Community | Users enrichment, <br>Users remediation |
| **Azure AD** | [Managed Logic Apps connector](/connectors/azuread/)<br><br>Playbooks | Microsoft<br><br>Community | Users enrichment, <br>Users remediation |
| **Azure Data Explorer** | [Managed Logic Apps connector](/connectors/kusto/) | Microsoft | Query and investigate |
| **Azure Log Analytics Data Collector** | [Managed Logic Apps connector](/connectors/azureloganalyticsdatacollector/) | Microsoft<br><br>Community | Query and investigate |
| **Microsoft Defender for Endpoint** | [Managed Logic Apps connector](/connectors/wdatp/)<br><br>Playbooks | Microsoft<br><br>Community | Endpoints enrichment, <br>isolate endpoints |
| **Microsoft Defender for IoT** | Playbooks | Microsoft | Orchestration and notification |
| **Microsoft Teams** | [Managed Logic Apps connector](/connectors/teams/)<br><br>Playbooks | Microsoft<br><br>Community | Notifications, <br>Collaboration, <br>create human-involved responses |
|

## Okta

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Okta** | Managed Logic Apps connector<br><br>Playbooks | Community | Users enrichment, <br>Users remediation |
|

## Palo Alto

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Palo Alto PAN-OS**<br>(Available as solution) | Custom Logic Apps connector<br><br>Playbooks | Community | Block IPs and URLs |
| **Wildfire** | Custom Logic Apps connector<br><br>Playbooks | Community | Filehash enrichment and response |
|

## Proofpoint

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Proofpoint TAP**<br>(Available as solution) | Custom Logic Apps connector<br><br>Playbooks | Microsoft | Accounts enrichment |
|

## Recorded Future

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Recorded Future Intelligence** | [Managed Logic Apps connector](/connectors/recordedfuture/)<br><br>Playbooks | Recorded Future | Entities enrichment |
|

## ReversingLabs

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **TitaniumCloud File Enrichment**<br>(Available as solution) | [Managed Logic Apps connector](/connectors/reversinglabsintelligence/)<br><br>Playbooks | ReversingLabs | FileHash enrichment |
|

## RiskIQ

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **RiskIQ Digital Footprint**<br>(Available as solution) | [Managed Logic Apps connector](/connectors/riskiqdigitalfootprint/)<br><br>Playbooks | RiskIQ | Entities enrichment |
| **RiskIQ Passive Total** | [Managed Logic Apps connector](/connectors/riskiqpassivetotal/)<br><br>Playbooks | RiskIQ | Entities enrichment |
| **RiskIQ Security Intelligence**<br>(Available as solution) | [Managed Logic Apps connector](/connectors/riskiqintelligence/)<br><br>Playbooks | RiskIQ | Entities enrichment |
|

## ServiceNow

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **ServiceNow** | [Managed Logic Apps connector](/connectors/service-now/)<br><br>Playbooks | Microsoft<br><br>Community | Sync incidents |
|

## Slack

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Slack** | [Managed Logic Apps connector](/connectors/slack/)<br><br>Playbooks | Microsoft<br><br>Community | Notification, <br>Collaboration |
|

## Virus Total

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Virus Total** | [Managed Logic Apps connector](/connectors/virustotal/)<br><br>Playbooks | Microsoft<br><br>Community | Entities enrichment |
|

## VMware

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Carbon Black Cloud**<br>(Available as solution) | Custom Logic Apps connector<br><br>Playbooks | Community | Endpoints enrichment, <br>isolate endpoints |
|

## Zendesk

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Zendesk** | [Managed Logic Apps connector](/connectors/zendesk/)<br><br>Playbooks | Microsoft<br><br>Community | Sync incidents |
|

## Zscaler

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Zscaler** | Playbooks | Microsoft | URL remediation, <br>incident enrichment |
|

## Next steps

In this document, you learned about Microsoft Sentinel SOAR content.

- Learn more about [Microsoft Sentinel Solutions](sentinel-solutions.md).
- [Find and deploy Microsoft Sentinel Solutions](sentinel-solutions-deploy.md).
