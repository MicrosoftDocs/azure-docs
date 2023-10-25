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


## AbuseIPDB

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **AbuseIPDB**<br>(Available as solution) | Custom Logic Apps connector<br><br>Playbooks | Microsoft | Enrich incident by IP info, <br>Report IP to Abuse IP DB, <br>Deny list to Threat intelligence |
|
    
## Atlassian

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Jira** | [Managed Logic Apps connector](/connectors/jira/)<br><br>Playbooks | Microsoft<br><br>Community | Sync incidents |
|
 
## AWS IAM

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **AWS IAM**<br>(Available as solution) |  Custom Logic Apps connector<br><br>Playbooks | Microsoft | Add User Tags, <br>Delete Access Keys, <br>Enrich incidents |
|  
  
## Checkphish by Bolster  

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Checkphish by Bolster**<br>(Available as solution) |  Custom Logic Apps connector<br><br>Playbooks | Microsoft | Get URL scan results |
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
  
## Elastic Search  

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Elastic search**<br>(Available as solution) | Playbooks | Microsoft | Enrich incident  |
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
| **Fortiweb Cloud**<br>(Available as solution) | Custom Logic Apps connector<br><br>Azure Function<br><br>Playbooks | Microsoft | Block IPs and URLs , <br>Incident enrichment |
|  

## Freshdesk

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Freshdesk** | [Managed Logic Apps connector](/connectors/freshdesk/) |  | Sync incidents |
|

## GCP IAM

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **GCP IAM**<br>(Available as solution) |  Custom Logic Apps connector<br><br>Playbooks | Microsoft | Disable service account, <br>Disable service account key, <br>Enrich Service account info |
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

## InsightVM Cloud API

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **InsightVM Cloud API** |  Custom Logic Apps connector<br><br>Playbooks | Microsoft | Enrich incident with asset info, <br>Enrich vulnerability info, <br>Run VM scan |
|   
  
## Microsoft

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Azure DevOps** | Managed Logic Apps connector<br><br>Playbooks | Microsoft<br><br>Community | Sync incidents |
| **Azure Firewall**<br>(Available as solution) | Custom Logic Apps connector<br><br>Playbooks | Microsoft | Block IPs |
| **Microsoft Entra ID Protection** | [Managed Logic Apps connector](/connectors/azureadip/)<br><br>Playbooks | Microsoft<br><br>Community | Users enrichment, <br>Users remediation |
| **Microsoft Entra ID** | [Managed Logic Apps connector](/connectors/azuread/)<br><br>Playbooks | Microsoft<br><br>Community | Users enrichment, <br>Users remediation |
| **Azure Data Explorer** | [Managed Logic Apps connector](/connectors/kusto/) | Microsoft | Query and investigate |
| **Azure Log Analytics Data Collector** | [Managed Logic Apps connector](/connectors/azureloganalyticsdatacollector/) | Microsoft<br><br>Community | Query and investigate |
| **Microsoft Defender for Endpoint** | [Managed Logic Apps connector](/connectors/wdatp/)<br><br>Playbooks | Microsoft<br><br>Community | Endpoints enrichment, <br>isolate endpoints |
| **Microsoft Defender for IoT** | Playbooks | Microsoft | Orchestration and notification |
| **Microsoft Teams** | [Managed Logic Apps connector](/connectors/teams/)<br><br>Playbooks | Microsoft<br><br>Community | Notifications, <br>Collaboration, <br>create human-involved responses |
|
  
## Minemeld

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Minemeld**<br>(Available as solution) | Custom Logic Apps connector<br><br>Playbooks | Microsoft | Create indicator, <br>Enrich incident |
|
  
## Neustar IP GEO Point 

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Neustar IP GEO Point**<br>(Available as solution) |  Playbooks | Microsoft | Get IP Geo Info |
|   

## Okta

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Okta** | Managed Logic Apps connector<br><br>Playbooks | Community | Users enrichment, <br>Users remediation |
|
  
## OpenCTI

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **OpenCTI**<br>(Available as solution) |  Custom Logic Apps connector<br><br>Playbooks | Microsoft | Create Indicator, <br>Enrich incident, <br>Get Indicator stream, <br>Import to Sentinel  |
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

## Qualys VM

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **Qualys VM**<br>(Available as solution) |  Custom Logic Apps connector<br><br>Playbooks | Microsoft | Get asset details, <br>Get asset by CVEID, <br>Get asset by Open port, <br>Launch VM  scan |
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
  
## TheHive

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **TheHive**<br>(Available as solution) |  Custom Logic Apps connector<br><br>Playbooks  | Microsoft | Create alert, <br>Create Case, <br>Lock User |
|
  
## ThreatX WAF

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **ThreatX WAF**<br>(Available as solution) |  Custom Logic Apps connector<br><br>Playbooks  | Microsoft | Block IP / URL, <br>Incident enrichment |
|
  
## URLhaus

| Product | Integration components | Supported by | Scenarios |
| --- | --- | --- | --- |
| **URLhaus**<br>(Available as solution) |  Custom Logic Apps connector<br><br>Playbooks  | Microsoft | Check host and enrich incident, <br>Check hash and enrich incident, <br>Check URL and enrich incident |
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
