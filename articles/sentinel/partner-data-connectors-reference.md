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
| **Supported by:** | [Agari](https://support.agari.com/hc/en-us/articles/360000645632-How-to-access-Agari-Support) |
|

## Atlassian Confluence Audit (Preview)

| Connector | [Atlassian Confluence Audit](https://www.atlassian.com/software/confluence) |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-confluenceauditapi-functionapp |
| **API credentials** | <li>ConfluenceAccessToken<li>ConfluenceUsername<li>ConfluenceHomeSiteName |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation](https://developer.atlassian.com/cloud/confluence/rest/api-group-audit/)<li>[Requirements and instructions for obtaining credentials](https://developer.atlassian.com/cloud/confluence/rest/intro/#auth)<li>[View the audit log](https://support.atlassian.com/confluence-cloud/docs/view-the-audit-log/) |
| **Kusto function alias** | ConfluenceAudit |
| **Kusto function URL** | https://aka.ms/sentinel-confluenceauditapi-parser |
| **Supported by:** | Microsoft |
|

## Atlassian Jira Audit (Preview)

| Connector | Atlassian Jira Audit |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-jiraauditapi-functionapp |
| **API credentials** | <li>JiraAccessToken<li>JiraUsername<li>JiraHomeSiteName |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation - Audit records](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-audit-records/)<li>[Requirements and instructions for obtaining credentials](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#authentication) |
| **Kusto function alias** | JiraAudit |
| **Kusto function URL** | https://aka.ms/sentinel-jiraauditapi-parser |
| **Supported by:** | Microsoft |
|

## Cisco Umbrella (Preview)

| Connector | Cisco Umbrella |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-CiscoUmbrellaConn-functionapp |
| **API credentials** | <li>AWS Access Key Id<li>AWS Secret Access Key<li>AWS S3 Bucket Name |
| **Vendor documentation/<br>installation instructions** | <li>[Logging to Amazon S3](https://docs.umbrella.com/deployment-umbrella/docs/log-management#section-logging-to-amazon-s-3) |
| **Kusto function alias** | Cisco_Umbrella |
| **Kusto function URL** | https://aka.ms/sentinel-ciscoumbrella-function |
| **Supported by:** | Microsoft |
|

## ESET Enterprise Inspector (Preview)

| Connector | ESET Enterprise Inspector |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li>[ESET Enterprise Inspector REST API documentation](https://help.eset.com/eei/1.5/en-US/api.html)<li> |
| **Supported by:** | [ESET](https://support.eset.com/en) |
|

## Google Workspace (G-Suite) (Preview)

| Connector | Google Workspace (G-Suite) |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-GWorkspaceReportsAPI-functionapp |
| **API credentials** | <li>Pickle string |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation](https://developers.google.com/admin-sdk/reports/v1/reference/activities)<li>Get credentials at [Perform Google Workspace Domain-Wide Delegation of Authority](https://developers.google.com/admin-sdk/reports/v1/guides/delegation)<li>[Convert token.pickle file to pickle string](https://aka.ms/sentinel-GWorkspaceReportsAPI-functioncode) |
| **Kusto function alias** | GWorkspaceActivityReports |
| **Kusto function URL** | https://aka.ms/sentinel-GWorkspaceReportsAPI-parser |
| **Supported by:** | Microsoft |
|

## Netskope (Preview)

| Connector | Netskope |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Supported by:** |  |
|

The Netskope Cloud Security Platform connector ingests Netskope logs and events into Azure Sentinel. For more information, see [The Netskope Cloud Security Platform](https://www.netskope.com/platform).

**Data ingestion method:** [Azure Functions and the REST API](connect-azure-functions-template.md).

**Supported by:** Microsoft

## Okta Single Sign-On (Preview)

| Connector | Okta Single Sign-On |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Supported by:** |  |
|

The Okta Single Sign-On (SSO) data connector ingests audit and event logs from the Okta API into Azure Sentinel. To create an API token, follow the instructions at [Create the token](https://developer.okta.com/docs/guides/create-an-api-token/create-the-token/).

For more information about connecting to Azure Sentinel, see [Connect Okta SSO to Azure Sentinel](connect-okta-single-sign-on.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-azure-functions-template.md).

**Supported by:** Microsoft

## Proofpoint On Demand (POD) Email Security (Preview)

| Connector | Proofpoint On Demand (POD) Email Security |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
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
| **Supported by:** |  |
|

The Trend Micro XDR data connector ingests workbench alerts from the Trend Micro XDR API into Azure Sentinel. To create an account and an API authentication token, follow the instructions at [Obtaining API Keys for Third-Party Access](https://docs.trendmicro.com/en-us/enterprise/trend-micro-xdr-help/ObtainingAPIKeys).

**Data ingestion method:** [Azure Functions and the REST API](connect-azure-functions-template.md).

**Supported by:** [Trend Micro](https://success.trendmicro.com/technical-support)

## VMware Carbon Black Endpoint Standard (Preview)

| Connector | VMware Carbon Black Endpoint Standard |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Supported by:** |  |
|

The VMware Carbon Black Endpoint Standard data connector ingests Carbon Black Endpoint Standard data into Azure Sentinel. To create an API key, follow the instructions at [Creating an API Key](https://developer.carbonblack.com/reference/carbon-black-cloud/authentication/#creating-an-api-key).

For more information about connecting to Azure Sentinel, see [Connect VMware Carbon Black Cloud Endpoint Standard to Azure Sentinel](connect-vmware-carbon-black.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-azure-functions-template.md).

**Supported by:** Microsoft

## Workplace from Facebook (Preview)

| Connector | Workplace from Facebook |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Supported by:** |  |
|

The Workplace data connector ingests common Workplace events into Azure Sentinel through Webhooks. Webhooks enable custom integration apps to subscribe to events in Workplace and receive updates in real time. When a change occurs, Workplace sends an HTTPS POST request with event information to a callback data connector URL. For more information, see the Webhooks documentation. The connector can get events to examine potential security risks, analyze your team's collaboration, diagnose configuration problems, and more.

**Data ingestion method:** [Azure Functions and the REST API](connect-azure-functions-template.md).

**Supported by**: Microsoft

## Zoom Reports (Preview)

| Connector | Zoom Reports |
| --- | --- |
| **Data ingestion method:** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li><li><li> |
| **Vendor documentation/<br>installation instructions** | <li><li> |
| **Supported by:** |  |
|

The Zoom Reports data connector ingests Zoom Reports events into Azure Sentinel. The connector can get events to examine potential security risks, analyze your team's collaboration, diagnose configuration problems, and more. To get credentials, follow the instructions at [JWT With Zoom](https://marketplace.zoom.us/docs/guides/auth/jwt).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** Microsoft
