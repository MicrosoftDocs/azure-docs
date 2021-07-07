---
title: Azure Sentinel Partner data connectors reference | Microsoft Docs
description: See specific configuration parameters for Azure Sentinel Partner data connectors.
services: sentinel
documentationcenter: na
author: yelevin
ms.service: azure-sentinel
ms.topic: conceptual
ms.date: 07/06/2021
ms.author: yelevin

---

# Azure Sentinel partner data connectors reference

> [!IMPORTANT]
> Many of the following Azure Sentinel Partner data connectors are currently in **Preview**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Agari Phishing Defense and Brand Protection (Preview)

| Connector | Agari Phishing Defense and Brand Protection |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-agari-functionapp |
| **API credentials** | <li>Client ID<li>Client Secret<li>(Optional: Graph Tenant ID, Graph Client ID, Graph Client Secret) |
| **Vendor documentation/<br>installation instructions** | <li>[Quick Start](https://developers.agari.com/agari-platform/docs/quick-start)<li>[Agari Developers Site](https://developers.agari.com/agari-platform) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>clientID<li>clientSecret<li>workspaceID<li>workspaceKey<li>enableBrandProtectionAPI (true/false)<li>enablePhishingResponseAPI (true/false)<li>enablePhishingDefenseAPI (true/false)<li>resGroup (enter Resource group)<li>functionName<li>subId (enter Subscription ID)<li>enableSecurityGraphSharing (true/false)<br>Required if enableSecurityGraphSharing is set to true:<li>GraphTenantId<li>GraphClientId<li>GraphClientSecret<li>logAnalyticsUri (optional) |
| **Supported by:** | [Agari](https://support.agari.com/hc/en-us/articles/360000645632-How-to-access-Agari-Support) |
|

> [!NOTE]
> **(Optional) Enable the Security Graph API**
>
> To take advantage of sharing data with Azure Sentinel using the Security Graph API, you'll need to [register an application](/graph/auth-register-app-v2) in Azure Active Directory.
>
> This process will give you three pieces of information for use when deploying the Function App below: the **Graph tenant ID**, the **Graph client ID**, and the **Graph client secret**.

## Atlassian Confluence Audit (Preview)

| Connector | [Atlassian Confluence Audit](https://www.atlassian.com/software/confluence) |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-confluenceauditapi-functionapp |
| **API credentials** | <li>ConfluenceAccessToken<li>ConfluenceUsername<li>ConfluenceHomeSiteName |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation](https://developer.atlassian.com/cloud/confluence/rest/api-group-audit/)<li>[Requirements and instructions for obtaining credentials](https://developer.atlassian.com/cloud/confluence/rest/intro/#auth)<li>[View the audit log](https://support.atlassian.com/confluence-cloud/docs/view-the-audit-log/) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | ConfluenceAudit |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-confluenceauditapi-parser |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** | Microsoft |
|

## Atlassian Jira Audit (Preview)

| Connector | Atlassian Jira Audit |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-jiraauditapi-functionapp |
| **API credentials** | <li>JiraAccessToken<li>JiraUsername<li>JiraHomeSiteName |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation - Audit records](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-audit-records/)<li>[Requirements and instructions for obtaining credentials](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#authentication) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | JiraAudit |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-jiraauditapi-parser |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** | Microsoft |
|

## Cisco Umbrella (Preview)

| Connector | Cisco Umbrella |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-CiscoUmbrellaConn-functionapp |
| **API credentials** | <li>AWS Access Key Id<li>AWS Secret Access Key<li>AWS S3 Bucket Name |
| **Vendor documentation/<br>installation instructions** | <li>[Logging to Amazon S3](https://docs.umbrella.com/deployment-umbrella/docs/log-management#section-logging-to-amazon-s-3) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | Cisco_Umbrella |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-ciscoumbrella-function |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** | Microsoft |
|

## ESET Enterprise Inspector (Preview)

| Connector | ESET Enterprise Inspector |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li>[ESET Enterprise Inspector REST API documentation](https://help.eset.com/eei/1.5/en-US/api.html)<li> |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** | [ESET](https://support.eset.com/en) |
|

## Google Workspace (G-Suite) (Preview)

| Connector | Google Workspace (G-Suite) |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-GWorkspaceReportsAPI-functionapp |
| **API credentials** | <li>Pickle string |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation](https://developers.google.com/admin-sdk/reports/v1/reference/activities)<li>Get credentials at [Perform Google Workspace Domain-Wide Delegation of Authority](https://developers.google.com/admin-sdk/reports/v1/guides/delegation)<li>[Convert token.pickle file to pickle string](https://aka.ms/sentinel-GWorkspaceReportsAPI-functioncode) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | GWorkspaceActivityReports |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-GWorkspaceReportsAPI-parser |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** | Microsoft |
|

## Netskope (Preview)

| Connector | Netskope |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-netskope-functioncode |
| **API credentials** | <li>API Key |
| **Vendor documentation/<br>installation instructions** | <li>[Netskope Cloud Security Platform](https://www.netskope.com/platform)<li>[Netskope API Documentation](https://innovatechcloud.goskope.com/docs/Netskope_Help/en/rest-api-v1-overview.html)<li>[Obtain an API Token](https://innovatechcloud.goskope.com/docs/Netskope_Help/en/rest-api-v2-overview.html) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Kusto function alias** | Netskope |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-netskope-parser |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** | Microsoft |
|

## Okta Single Sign-On (Preview)

| Connector | Okta Single Sign-On |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentineloktaazurefunctioncodev2 |
| **API credentials** | <li>API Token |
| **Vendor documentation/<br>installation instructions** | <li>[Okta System Log API Documentation](https://developer.okta.com/docs/reference/api/system-log/)<li>[Create an API token](https://developer.okta.com/docs/guides/create-an-api-token/create-the-token/)<li>[Connect Okta SSO to Azure Sentinel](connect-okta-single-sign-on.md) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiToken<li>workspaceID<li>workspaceKey<li>uri<li>logAnalyticsUri (optional) |
| **Application settings notes** |  |
| **Supported by:** | Microsoft |
|

## Proofpoint On Demand (POD) Email Security (Preview)

| Connector | Proofpoint On Demand (POD) Email Security |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | ProofpointPOD |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-proofpointpod-parser |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** |  |
|

The POD Email Security data connector gets POD Email Protection data. With this connector, you can check message traceability, and monitor email activity, threats, and data exfiltration by attackers and malicious insiders. You can review organizational events on an accelerated basis, and get event logs in hourly increments for recent activity. For information about how to enable and check the POD Log API, [sign in to the Proofpoint Community](https://proofpointcommunities.force.com/community/s/article/How-to-request-a-Community-account-and-gain-full-customer-access?utm_source=login&utm_medium=recommended&utm_campaign=public) and see [Proofpoint-on-Demand-Pod-Log-API](https://proofpointcommunities.force.com/community/s/article/Proofpoint-on-Demand-Pod-Log-API).

For more information about connecting to Azure Sentinel, see [Connect Proofpoint On Demand (POD) Email Security to Azure Sentinel](connect-proofpoint-pod.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-azure-functions-template.md).

**Supported by:** Microsoft

## Proofpoint Targeted Attack Protection (TAP) (Preview)

| Connector | Proofpoint Targeted Attack Protection (TAP) |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** |  |
|

The Proofpoint TAP connector ingests Proofpoint TAP logs and events into Azure Sentinel. The connector provides visibility into Message and Click events in Azure Sentinel.

For more information about connecting to Azure Sentinel, see [Connect Proofpoint TAP to Azure Sentinel](connect-proofpoint-tap.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-azure-functions-template.md).

**Supported by:** Microsoft

## Qualys VM KnowledgeBase (KB) (Preview)

| Connector | Qualys VM KnowledgeBase (KB) |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Kusto function alias** |  |
| **Kusto function URL/<br>Parser config instructions** |  |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** |  |
|

The Qualys VM KB data connector ingests the latest vulnerability data from the Qualys KB into Azure Sentinel. You can use this data to correlate and enrich vulnerability detections by the Qualys VM data connector.

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Qualys Vulnerability Management (VM) (Preview)

| Connector | Qualys Vulnerability Management (VM) |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** |  |
|

The Qualys VM data connector ingests vulnerability host detection data into Azure Sentinel through the Qualys API. The connector provides visibility into host detection data from vulnerability scans.

For more information about connecting to Azure Sentinel, see [Connect Qualys VM to Azure Sentinel](connect-qualys-vm.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-azure-functions-template.md).

**Supported by:** Microsoft

## Salesforce Service Cloud (Preview)

| Connector | Salesforce Service Cloud |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** |  |
| **Kusto function URL/<br>Parser config instructions** |  |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** |  |
|

The Salesforce Service Cloud data connector ingests information about Salesforce operational events into Azure Sentinel through the REST API. With this connector, you can review organizational events on an accelerated basis, and get event logs in hourly increments for recent activity. For more information and credentials, see the Salesforce [REST API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/quickstart.htm).

For more information about connecting to Azure Sentinel, see [Connect Salesforce Service Cloud to Azure Sentinel](connect-salesforce-service-cloud.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## SentinelOne (Preview)

| Connector | SentinelOne |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** |  |
| **Kusto function URL/<br>Parser config instructions** |  |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** |  |
|

The SentinelOne data connector ingests SentinelOne events into Azure Sentinel. Events include server objects like Threats, Agents, Applications, Activities, Policies, Groups, and more. The connector can get events to examine potential security risks, analyze your team's collaboration, diagnose configuration problems, and more.

**Data ingestion method:** [Azure Functions and the REST API](connect-azure-functions-template.md).

**Supported by:** Microsoft

## Trend Micro XDR (Preview)

| Connector | Trend Micro XDR |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** |  |
|

The Trend Micro XDR data connector ingests workbench alerts from the Trend Micro XDR API into Azure Sentinel. To create an account and an API authentication token, follow the instructions at [Obtaining API Keys for Third-Party Access](https://docs.trendmicro.com/en-us/enterprise/trend-micro-xdr-help/ObtainingAPIKeys).

**Data ingestion method:** [Azure Functions and the REST API](connect-azure-functions-template.md).

**Supported by:** [Trend Micro](https://success.trendmicro.com/technical-support)

## VMware Carbon Black Endpoint Standard (Preview)

| Connector | VMware Carbon Black Endpoint Standard |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinelcarbonblackazurefunctioncode |
| **API credentials** | **API access level**:<li>API ID<li>API Key<br>**SIEM access level**:<li>API ID<li>API Key |
| **Vendor documentation/<br>installation instructions** | <li>[Carbon Black API Documentation](https://developer.carbonblack.com/reference/carbon-black-cloud/cb-defense/latest/rest-api/)<li>[Creating an API Key](https://developer.carbonblack.com/reference/carbon-black-cloud/authentication/#creating-an-api-key) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** | Microsoft |
|

## Workplace from Facebook (Preview)

| Connector | Workplace from Facebook |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** |  |
| **Kusto function URL/<br>Parser config instructions** |  |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** | Microsoft |
|

## Zoom Reports (Preview)

| Connector | Zoom Reports |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li>[Get credentials using JWT With Zoom](https://marketplace.zoom.us/docs/guides/auth/jwt) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** |  |
| **Kusto function URL/<br>Parser config instructions** |  |
| **Application settings** | <li><li><li><li><li><li> |
| **Supported by:** | Microsoft |
|
