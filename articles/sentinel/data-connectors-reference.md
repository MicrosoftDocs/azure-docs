---
title: Find your Microsoft Sentinel data connector | Microsoft Docs
description: Learn about specific configuration steps for Microsoft Sentinel data connectors.
author: cwatson-cat
ms.topic: reference
ms.date: 05/30/2024
ms.author: cwatson
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---

# Find your Microsoft Sentinel data connector

This article lists all supported, out-of-the-box data connectors and links to each connector's deployment steps.

> [!IMPORTANT]
> - Noted Microsoft Sentinel data connectors are currently in **Preview**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - For connectors that use the Log Analytics agent, the agent will be [retired on **31 August, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you are using the Log Analytics agent in your Microsoft Sentinel deployment, we recommend that you start planning your migration to the AMA. For more information, see [AMA migration for Microsoft Sentinel](ama-migrate.md).
> - [!INCLUDE [unified-soc-preview-without-alert](includes/unified-soc-preview-without-alert.md)]

Data connectors are available as part of the following offerings:

- Solutions: Many data connectors are deployed as part of [Microsoft Sentinel solution](sentinel-solutions.md) together with related content like analytics rules, workbooks, and playbooks. For more information, see the [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).

- Community connectors: More data connectors are provided by the Microsoft Sentinel community and can be found in the [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?filters=solution-templates&page=1&search=sentinel). Documentation for community data connectors is the responsibility of the organization that created the connector.

- Custom connectors: If you have a data source that isn't listed or currently supported, you can also create your own, custom connector. For more information, see [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Data connector prerequisites

[!INCLUDE [data-connector-prereq](includes/data-connector-prereq.md)]

## Syslog and Common Event Format (CEF) connectors

Some Microsoft Sentinel solutions are supported by the data connectors Syslog via AMA or Common Event Format (CEF) via AMA in Microsoft Sentinel. To forward data to your Log Analytics workspace for Microsoft Sentinel, complete the steps in [Ingest Syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-ama.md). These steps include installing either the **Common Event Format** or **Syslog** solution from the **Content hub** in Microsoft Sentinel. Then, configure the related AMA connector that's installed with the solution. Complete the setup by configuring the appropriate devices or appliances. For more information, see the solution provider's installation instructions or contact the solution provider.

[comment]: <> (DataConnector includes start)

## 42Crunch

- [API Protection](data-connectors/api-protection.md)

## Abnormal Security Corporation

- [AbnormalSecurity (using Azure Functions)](data-connectors/abnormalsecurity.md)

## Akamai

- [[Deprecated] Akamai Security Events via Legacy Agent](data-connectors/deprecated-akamai-security-events-via-legacy-agent.md)
- [[Recommended] Akamai Security Events via AMA](data-connectors/recommended-akamai-security-events-via-ama.md)

## AliCloud

- [AliCloud (using Azure Functions)](data-connectors/alicloud.md)

## Amazon Web Services

- [Amazon Web Services](data-connectors/amazon-web-services.md)
- [Amazon Web Services S3](data-connectors/amazon-web-services-s3.md)

## Apache

- [Apache Tomcat](data-connectors/apache-tomcat.md)

## Apache Software Foundation

- [Apache HTTP Server](data-connectors/apache-http-server.md)

## archTIS

- [NC Protect](data-connectors/nc-protect.md)

## ARGOS Cloud Security Pty Ltd

- [ARGOS Cloud Security](data-connectors/argos-cloud-security.md)

## Arista Networks

- [Awake Security](data-connectors/awake-security.md)

## Armis, Inc.

- [Armis Activities (using Azure Functions)](data-connectors/armis-activities.md)
- [Armis Alerts (using Azure Functions)](data-connectors/armis-alerts.md)
- [Armis Devices (using Azure Functions)](data-connectors/armis-devices.md)

## Armorblox

- [Armorblox (using Azure Functions)](data-connectors/armorblox.md)

## Aruba

- [[Deprecated] Aruba ClearPass via Legacy Agent](data-connectors/deprecated-aruba-clearpass-via-legacy-agent.md)
- [[Recommended] Aruba ClearPass via AMA](data-connectors/recommended-aruba-clearpass-via-ama.md)

## Atlassian

- [Atlassian Confluence Audit (using Azure Functions)](data-connectors/atlassian-confluence-audit.md)
- [Atlassian Jira Audit (using Azure Functions)](data-connectors/atlassian-jira-audit.md)

## Auth0

- [Auth0 Access Management(using Azure Function) (using Azure Functions)](data-connectors/auth0-access-management.md)

## Better Mobile Security Inc.

- [BETTER Mobile Threat Defense (MTD)](data-connectors/better-mobile-threat-defense-mtd.md)

## Bitglass

- [Bitglass (using Azure Functions)](data-connectors/bitglass.md)

## Bitsight Technologies, Inc.

- [Bitsight data connector (using Azure Functions)](data-connectors/bitsight-data-connector.md)

## Blackberry

- [Blackberry CylancePROTECT](data-connectors/blackberry-cylanceprotect.md)

## Bosch Global Software Technologies Pvt Ltd

- [AIShield](data-connectors/aishield.md)

## Box

- [Box (using Azure Functions)](data-connectors/box.md)

## Broadcom

- [[Deprecated] Broadcom Symantec DLP via Legacy Agent](data-connectors/deprecated-broadcom-symantec-dlp-via-legacy-agent.md)
- [[Recommended] Broadcom Symantec DLP via AMA](data-connectors/recommended-broadcom-symantec-dlp-via-ama.md)

## Cisco

- [Cisco Application Centric Infrastructure](data-connectors/cisco-application-centric-infrastructure.md)
- [Cisco ASA/FTD via AMA (Preview)](data-connectors/cisco-asa-ftd-via-ama.md)
- [Cisco Duo Security (using Azure Functions)](data-connectors/cisco-duo-security.md)
- [Cisco Identity Services Engine](data-connectors/cisco-identity-services-engine.md)
- [Cisco Meraki](data-connectors/cisco-meraki.md)
- [Cisco Secure Endpoint (AMP) (using Azure Functions)](data-connectors/cisco-secure-endpoint-amp.md)
- [Cisco Secure Cloud Analytics](data-connectors/cisco-secure-cloud-analytics.md)
- [Cisco Stealthwatch](data-connectors/cisco-stealthwatch.md)
- [Cisco UCS](data-connectors/cisco-ucs.md)
- [Cisco Umbrella (using Azure Functions)](data-connectors/cisco-umbrella.md)
- [Cisco Web Security Appliance](data-connectors/cisco-web-security-appliance.md)

## Cisco Systems, Inc.

- [Cisco Software Defined WAN](data-connectors/cisco-software-defined-wan.md)
- [Cisco ETD (using Azure Functions)](data-connectors/cisco-etd.md)

## Citrix

- [Citrix ADC (former NetScaler)](data-connectors/citrix-adc-former-netscaler.md)

## Claroty

- [[Deprecated] Claroty via Legacy Agent](data-connectors/deprecated-claroty-via-legacy-agent.md)
- [[Recommended] Claroty via AMA](data-connectors/recommended-claroty-via-ama.md)
- [Claroty xDome](data-connectors/claroty-xdome.md)

## Cloudflare

- [Cloudflare (Preview) (using Azure Functions)](data-connectors/cloudflare.md)

## Cognni

- [Cognni](data-connectors/cognni.md)

## cognyte technologies israel ltd

- [Luminar IOCs and Leaked Credentials (using Azure Functions)](data-connectors/luminar-iocs-and-leaked-credentials.md)

## CohesityDev

- [Cohesity (using Azure Functions)](data-connectors/cohesity.md)

## Corelight Inc.

- [Corelight Connector Exporter](data-connectors/corelight-connector-exporter.md)

## Crowdstrike

- [[Deprecated] CrowdStrike Falcon Endpoint Protection via Legacy Agent](data-connectors/deprecated-crowdstrike-falcon-endpoint-protection-via-legacy-agent.md)
- [Crowdstrike Falcon Data Replicator (using Azure Functions)](data-connectors/crowdstrike-falcon-data-replicator.md)
- [Crowdstrike Falcon Data Replicator V2 (using Azure Functions)](data-connectors/crowdstrike-falcon-data-replicator-v2.md)

## Cyber Defense Group B.V.

- [ESET PROTECT](data-connectors/eset-protect.md)

## CyberArk

- [CyberArkAudit (using Azure Functions)](data-connectors/cyberarkaudit.md)
- [CyberArkEPM (using Azure Functions)](data-connectors/cyberarkepm.md)

## CyberPion

- [IONIX Security Logs](data-connectors/ionix-security-logs.md)

## Cybersixgill

- [Cybersixgill Actionable Alerts (using Azure Functions)](data-connectors/cybersixgill-actionable-alerts.md)

## Cyborg Security, Inc.

- [Cyborg Security HUNTER Hunt Packages](data-connectors/cyborg-security-hunter-hunt-packages.md)

## Cynerio

- [Cynerio Security Events](data-connectors/cynerio-security-events.md)

## Darktrace plc

- [Darktrace Connector for Microsoft Sentinel REST API](data-connectors/darktrace-connector-for-microsoft-sentinel-rest-api.md)

## Dataminr, Inc.

- [Dataminr Pulse Alerts Data Connector (using Azure Functions)](data-connectors/dataminr-pulse-alerts-data-connector.md)

## Defend Limited

- [Cortex XDR - Incidents](data-connectors/cortex-xdr-incidents.md)

## DEFEND Limited

- [Atlassian Beacon Alerts](data-connectors/atlassian-beacon-alerts.md)

## Derdack

- [Derdack SIGNL4](data-connectors/derdack-signl4.md)

## Digital Guardian

- [Digital Guardian Data Loss Prevention](data-connectors/digital-guardian-data-loss-prevention.md)

## Digital Shadows

- [Digital Shadows Searchlight (using Azure Functions)](data-connectors/digital-shadows-searchlight.md)

## Dynatrace

- [Dynatrace Attacks](data-connectors/dynatrace-attacks.md)
- [Dynatrace Audit Logs](data-connectors/dynatrace-audit-logs.md)
- [Dynatrace Problems](data-connectors/dynatrace-problems.md)
- [Dynatrace Runtime Vulnerabilities](data-connectors/dynatrace-runtime-vulnerabilities.md)

## Elastic

- [Elastic Agent (Standalone)](data-connectors/elastic-agent-standalone.md)

## Exabeam

- [Exabeam Advanced Analytics](data-connectors/exabeam-advanced-analytics.md)

## F5, Inc.

- [F5 BIG-IP](data-connectors/f5-big-ip.md)

## Facebook

- [Workplace from Facebook (using Azure Functions)](data-connectors/workplace-from-facebook.md)

## Feedly, Inc.

- [Feedly](data-connectors/feedly.md)

## Fireeye

- [[Deprecated] FireEye Network Security (NX) via Legacy Agent](data-connectors/deprecated-fireeye-network-security-nx-via-legacy-agent.md)
- [[Recommended] FireEye Network Security (NX) via AMA](data-connectors/recommended-fireeye-network-security-nx-via-ama.md)

## Flare Systems

- [Flare](data-connectors/flare.md)

## Forescout

- [Forescout](data-connectors/forescout.md)
- [Forescout Host Property Monitor](data-connectors/forescout-host-property-monitor.md)

## Fortinet

- [[Deprecated] Fortinet via Legacy Agent](data-connectors/deprecated-fortinet-via-legacy-agent.md)
- [Fortinet FortiNDR Cloud (using Azure Functions)](data-connectors/fortinet-fortindr-cloud.md)
- [[Deprecated] Fortinet FortiWeb Web Application Firewall via Legacy Agent](data-connectors/deprecated-fortinet-fortiweb-web-application-firewall-via-legacy-agent.md)

## Gigamon, Inc

- [Gigamon AMX Data Connector](data-connectors/gigamon-amx-data-connector.md)

## GitLab

- [GitLab](data-connectors/gitlab.md)

## Google

- [Google Cloud Platform DNS (using Azure Functions)](data-connectors/google-cloud-platform-dns.md)
- [Google Cloud Platform IAM (using Azure Functions)](data-connectors/google-cloud-platform-iam.md)
- [Google Cloud Platform Cloud Monitoring (using Azure Functions)](data-connectors/google-cloud-platform-cloud-monitoring.md)
- [Google ApigeeX (using Azure Functions)](data-connectors/google-apigeex.md)
- [Google Workspace (G Suite) (using Azure Functions)](data-connectors/google-workspace-g-suite.md)

## Greynoise Intelligence, Inc.

- [GreyNoise Threat Intelligence (using Azure Functions)](data-connectors/greynoise-threat-intelligence.md)

## H.O.L.M. Security Sweden AB

- [Holm Security Asset Data (using Azure Functions)](data-connectors/holm-security-asset-data.md)

## HYAS Infosec Inc

- [HYAS Protect (using Azure Functions)](data-connectors/hyas-protect.md)

## Illumio

- [[Deprecated] Illumio Core via Legacy Agent](data-connectors/deprecated-illumio-core-via-legacy-agent.md)
- [[Recommended] Illumio Core via AMA](data-connectors/recommended-illumio-core-via-ama.md)

## Imperva

- [Imperva Cloud WAF (using Azure Functions)](data-connectors/imperva-cloud-waf.md)

## Infoblox

- [Infoblox NIOS](data-connectors/infoblox-nios.md)

## Infosec Global

- [InfoSecGlobal Data Connector](data-connectors/infosecglobal-data-connector.md)

## Insight VM / Rapid7

- [Rapid7 Insight Platform Vulnerability Management Reports (using Azure Functions)](data-connectors/rapid7-insight-platform-vulnerability-management-reports.md)

## ISC

- [ISC Bind](data-connectors/isc-bind.md)

## Island Technology Inc.

- [Island Enterprise Browser Admin Audit (Polling CCP)](data-connectors/island-enterprise-browser-admin-audit-polling-ccp.md)
- [Island Enterprise Browser User Activity (Polling CCP)](data-connectors/island-enterprise-browser-user-activity-polling-ccp.md)

## Ivanti

- [Ivanti Unified Endpoint Management](data-connectors/ivanti-unified-endpoint-management.md)

## Jamf Software, LLC

- [Jamf Protect](data-connectors/jamf-protect.md)

## Juniper

- [Juniper IDP](data-connectors/juniper-idp.md)
- [Juniper SRX](data-connectors/juniper-srx.md)

## Kaspersky

- [[Deprecated] Kaspersky Security Center via Legacy Agent](data-connectors/deprecated-kaspersky-security-center-via-legacy-agent.md)
- [[Recommended] Kaspersky Security Center via AMA](data-connectors/recommended-kaspersky-security-center-via-ama.md)

## Linux

- [Microsoft Sysmon For Linux](data-connectors/microsoft-sysmon-for-linux.md)

## Lookout, Inc.

- [Lookout (using Azure Function)](data-connectors/lookout.md)
- [Lookout Cloud Security for Microsoft Sentinel (using Azure Functions)](data-connectors/lookout-cloud-security-for-microsoft-sentinel-using-azure-function.md)

## MailGuard Pty Limited

- [MailGuard 365](data-connectors/mailguard-365.md)

## MarkLogic

- [MarkLogic Audit](data-connectors/marklogic-audit.md)

## McAfee

- [McAfee ePolicy Orchestrator (ePO)](data-connectors/mcafee-epolicy-orchestrator-epo.md)
- [McAfee Network Security Platform](data-connectors/mcafee-network-security-platform.md)

## Microsoft

- [Automated Logic WebCTRL](data-connectors/automated-logic-webctrl.md)
- [Microsoft Entra ID](data-connectors/microsoft-entra-id.md)
- [Microsoft Entra ID Protection](data-connectors/microsoft-entra-id-protection.md)
- [Azure Activity](data-connectors/azure-activity.md)
- [Azure Cognitive Search](data-connectors/azure-cognitive-search.md)
- [Azure DDoS Protection](data-connectors/azure-ddos-protection.md)
- [Azure Key Vault](data-connectors/azure-key-vault.md)
- [Azure Kubernetes Service (AKS)](data-connectors/azure-kubernetes-service-aks.md)
- [Microsoft Purview (Preview)](data-connectors/microsoft-purview.md)
- [Azure Storage Account](data-connectors/azure-storage-account.md)
- [Azure Web Application Firewall (WAF)](data-connectors/azure-web-application-firewall-waf.md)
- [Azure Batch Account](data-connectors/azure-batch-account.md)
- [Common Event Format (CEF)](data-connectors/common-event-format-cef.md)
- [Common Event Format (CEF) via AMA](data-connectors/common-event-format-cef-via-ama.md)
- [Windows DNS Events via AMA](data-connectors/windows-dns-events-via-ama.md)
- [Azure Event Hubs](data-connectors/azure-event-hub.md)
- [Microsoft 365 Insider Risk Management](data-connectors/microsoft-365-insider-risk-management.md)
- [Azure Logic Apps](data-connectors/azure-logic-apps.md)
- [Microsoft Defender for Identity](data-connectors/microsoft-defender-for-identity.md)
- [Microsoft Defender XDR](data-connectors/microsoft-defender-xdr.md)
- [Microsoft Defender for Cloud Apps](data-connectors/microsoft-defender-for-cloud-apps.md)
- [Microsoft Defender for Endpoint](data-connectors/microsoft-defender-for-endpoint.md)
- [Subscription-based Microsoft Defender for Cloud (Legacy)](data-connectors/subscription-based-microsoft-defender-for-cloud-legacy.md)
- [Tenant-based Microsoft Defender for Cloud (Preview)](data-connectors/tenant-based-microsoft-defender-for-cloud.md)
- [Microsoft Defender for Office 365 (Preview)](data-connectors/microsoft-defender-for-office-365.md)
- [Microsoft Power BI](data-connectors/microsoft-powerbi.md)
- [Microsoft Project](data-connectors/microsoft-project.md)
- [Microsoft Purview Information Protection](data-connectors/microsoft-purview-information-protection.md)
- [Network Security Groups](data-connectors/network-security-groups.md)
- [Microsoft 365](data-connectors/microsoft-365.md)
- [Security Events via Legacy Agent](data-connectors/security-events-via-legacy-agent.md)
- [Windows Security Events via AMA](data-connectors/windows-security-events-via-ama.md)
- [Azure Service Bus](data-connectors/azure-service-bus.md)
- [Azure Stream Analytics](data-connectors/azure-stream-analytics.md)
- [Syslog](data-connectors/syslog.md)
- [Syslog via AMA](data-connectors/syslog-via-ama.md)
- [Microsoft Defender Threat Intelligence (Preview)](data-connectors/microsoft-defender-threat-intelligence.md)
- [Threat intelligence - TAXII](data-connectors/threat-intelligence-taxii.md)
- [Threat Intelligence Platforms](data-connectors/threat-intelligence-platforms.md)
- [Threat Intelligence Upload Indicators API (Preview)](data-connectors/threat-intelligence-upload-indicators-api.md)
- [Microsoft Defender for IoT](data-connectors/microsoft-defender-for-iot.md)
- [Windows Firewall](data-connectors/windows-firewall.md)
- [Windows Firewall Events via AMA (Preview)](data-connectors/windows-firewall-events-via-ama.md)
- [Windows Forwarded Events](data-connectors/windows-forwarded-events.md)

## Microsoft Corporation

- [Dynamics 365](data-connectors/dynamics-365.md)
- [Azure Firewall](data-connectors/azure-firewall.md)
- [Azure SQL Databases](data-connectors/azure-sql-databases.md)

## Microsoft Corporation - sentinel4github

- [GitHub (using Webhooks) (using Azure Functions)](data-connectors/github-using-webhooks.md)
- [GitHub Enterprise Audit Log](data-connectors/github-enterprise-audit-log.md)

## Microsoft Sentinel Community, Microsoft Corporation

- [[Deprecated] Forcepoint CASB via Legacy Agent](data-connectors/deprecated-forcepoint-casb-via-legacy-agent.md)
- [[Deprecated] Forcepoint CSG via Legacy Agent](data-connectors/deprecated-forcepoint-csg-via-legacy-agent.md)
- [[Deprecated] Forcepoint NGFW via Legacy Agent](data-connectors/deprecated-forcepoint-ngfw-via-legacy-agent.md)
- [[Recommended] Forcepoint CASB via AMA](data-connectors/recommended-forcepoint-casb-via-ama.md)
- [[Recommended] Forcepoint CSG via AMA](data-connectors/recommended-forcepoint-csg-via-ama.md)
- [[Recommended] Forcepoint NGFW via AMA](data-connectors/recommended-forcepoint-ngfw-via-ama.md)
- [Barracuda CloudGen Firewall](data-connectors/barracuda-cloudgen-firewall.md)
- [Exchange Security Insights Online Collector (using Azure Functions)](data-connectors/exchange-security-insights-online-collector.md)
- [Exchange Security Insights On-Premise Collector](data-connectors/exchange-security-insights-on-premise-collector.md)
- [Microsoft Exchange Logs and Events](data-connectors/microsoft-exchange-logs-and-events.md)
- [Forcepoint DLP](data-connectors/forcepoint-dlp.md)
- [MISP2Sentinel](data-connectors/misp2sentinel.md)

## Mimecast North America

- [Mimecast Audit & Authentication (using Azure Functions)](data-connectors/mimecast-audit-authentication.md)
- [Mimecast Secure Email Gateway (using Azure Functions)](data-connectors/mimecast-secure-email-gateway.md)
- [Mimecast Intelligence for Microsoft - Microsoft Sentinel (using Azure Functions)](data-connectors/mimecast-intelligence-for-microsoft-microsoft-sentinel.md)
- [Mimecast Targeted Threat Protection (using Azure Functions)](data-connectors/mimecast-targeted-threat-protection.md)

## MongoDB

- [MongoDB Audit](data-connectors/mongodb-audit.md)

## MuleSoft

- [MuleSoft Cloudhub (using Azure Functions)](data-connectors/mulesoft-cloudhub.md)

## Nasuni Corporation

- [Nasuni Edge Appliance](data-connectors/nasuni-edge-appliance.md)

## NetClean Technologies AB

- [Netclean ProActive Incidents](data-connectors/netclean-proactive-incidents.md)

## Netskope

- [Netskope (using Azure Functions)](data-connectors/netskope.md)
- [Netskope Data Connector (using Azure Functions)](data-connectors/netskope-data-connector.md)
- [Netskope Web Transactions Data Connector (using Azure Functions)](data-connectors/netskope-web-transactions-data-connector.md)

## Netwrix

- [[Deprecated] Netwrix Auditor via Legacy Agent](data-connectors/deprecated-netwrix-auditor-via-legacy-agent.md)
- [[Recommended] Netwrix Auditor via AMA](data-connectors/recommended-netwrix-auditor-via-ama.md)

## Nginx

- [NGINX HTTP Server](data-connectors/nginx-http-server.md)

## Noname Gate, Inc.

- [Noname Security for Microsoft Sentinel](data-connectors/noname-security-for-microsoft-sentinel.md)

## Nozomi Networks

- [[Deprecated] Nozomi Networks N2OS via Legacy Agent](data-connectors/deprecated-nozomi-networks-n2os-via-legacy-agent.md)
- [[Recommended] Nozomi Networks N2OS via AMA](data-connectors/recommended-nozomi-networks-n2os-via-ama.md)

## NXLog Ltd.

- [NXLog AIX Audit](data-connectors/nxlog-aix-audit.md)
- [NXLog BSM macOS](data-connectors/nxlog-bsm-macos.md)
- [NXLog DNS Logs](data-connectors/nxlog-dns-logs.md)
- [NXLog FIM](data-connectors/nxlog-fim.md)
- [NXLog LinuxAudit](data-connectors/nxlog-linuxaudit.md)

## Okta

- [Okta Single Sign-On (using Azure Functions)](data-connectors/okta-single-sign-on.md)

## OneLogin

- [OneLogin IAM Platform(using Azure Functions)](data-connectors/onelogin-iam-platform.md)

## OpenVPN

- [OpenVPN Server](data-connectors/openvpn-server.md)

## Oracle

- [Oracle Cloud Infrastructure (using Azure Functions)](data-connectors/oracle-cloud-infrastructure.md)
- [Oracle Database Audit](data-connectors/oracle-database-audit.md)
- [Oracle WebLogic Server (using Azure Functions)](data-connectors/oracle-weblogic-server.md)

## Orca Security, Inc.

- [Orca Security Alerts](data-connectors/orca-security-alerts.md)

## OSSEC

- [[Deprecated] OSSEC via Legacy Agent](data-connectors/deprecated-ossec-via-legacy-agent.md)
- [[Recommended] OSSEC via AMA](data-connectors/recommended-ossec-via-ama.md)

## Palo Alto Networks

- [[Deprecated] Palo Alto Networks Cortex Data Lake (CDL) via Legacy Agent](data-connectors/deprecated-palo-alto-networks-cortex-data-lake-cdl-via-legacy-agent.md)
- [[Recommended] Palo Alto Networks Cortex Data Lake (CDL) via AMA](data-connectors/recommended-palo-alto-networks-cortex-data-lake-cdl-via-ama.md)
- [Palo Alto Prisma Cloud CSPM (using Azure Functions)](data-connectors/palo-alto-prisma-cloud-cspm.md)

## Perimeter 81

- [Perimeter 81 Activity Logs](data-connectors/perimeter-81-activity-logs.md)

## Ping Identity

- [[Deprecated] PingFederate via Legacy Agent](data-connectors/deprecated-pingfederate-via-legacy-agent.md)
- [[Recommended] PingFederate via AMA](data-connectors/recommended-pingfederate-via-ama.md)

## PostgreSQL

- [PostgreSQL Events](data-connectors/postgresql-events.md)

## Prancer Enterprise

- [Prancer Data Connector](data-connectors/prancer-data-connector.md)

## Proofpoint

- [Proofpoint TAP (using Azure Functions)](data-connectors/proofpoint-tap.md)
- [Proofpoint On Demand Email Security (using Azure Functions)](data-connectors/proofpoint-on-demand-email-security.md)

## Pulse Secure

- [Pulse Connect Secure](data-connectors/pulse-connect-secure.md)

## Qualys

- [Qualys Vulnerability Management (using Azure Functions)](data-connectors/qualys-vulnerability-management.md)
- [Qualys VM KnowledgeBase (using Azure Functions)](data-connectors/qualys-vm-knowledgebase.md)

## RedHat

- [JBoss Enterprise Application Platform](data-connectors/jboss-enterprise-application-platform.md)

## Ridge Security Technology Inc.

- [RIDGEBOT - data connector for Microsoft Sentinel](data-connectors/ridgebot-data-connector-for-microsoft-sentinel.md)

## RSA

- [RSA® SecurID (Authentication Manager)](data-connectors/rsa-securid-authentication-manager.md)

## Rubrik, Inc.

- [Rubrik Security Cloud data connector (using Azure Functions)](data-connectors/rubrik-security-cloud-data-connector.md)

## SailPoint

- [SailPoint IdentityNow (using Azure Function)](data-connectors/sailpoint-identitynow.md)

## Salesforce

- [Salesforce Service Cloud (using Azure Functions)](data-connectors/salesforce-service-cloud.md)

## Secure Practice

- [MailRisk by Secure Practice (using Azure Functions)](data-connectors/mailrisk-by-secure-practice.md)

## SecurityBridge

- [SecurityBridge Threat Detection for SAP](data-connectors/securitybridge-threat-detection-for-sap.md)

## Senserva, LLC

- [SenservaPro (Preview)](data-connectors/senservapro.md)

## SentinelOne

- [SentinelOne (using Azure Functions)](data-connectors/sentinelone.md)

## SERAPHIC ALGORITHMS LTD

- [Seraphic Web Security](data-connectors/seraphic-web-security.md)

## Slack

- [Slack Audit (using Azure Functions)](data-connectors/slack-audit.md)

## Snowflake

- [Snowflake (using Azure Functions)](data-connectors/snowflake.md)

## SonicWall Inc

- [SonicWall Firewall](data-connectors/sonicwall-firewall.md)

## Sonrai Security

- [Sonrai Data Connector](data-connectors/sonrai-data-connector.md)

## Sophos

- [Sophos Endpoint Protection (using Azure Functions)](data-connectors/sophos-endpoint-protection.md)
- [Sophos XG Firewall](data-connectors/sophos-xg-firewall.md)
- [Sophos Cloud Optix](data-connectors/sophos-cloud-optix.md)

## Squid

- [Squid Proxy](data-connectors/squid-proxy.md)

## Symantec

- [Symantec Endpoint Protection](data-connectors/symantec-endpoint-protection.md)
- [Symantec VIP](data-connectors/symantec-vip.md)
- [Symantec ProxySG](data-connectors/symantec-proxysg.md)
- [Symantec Integrated Cyber Defense Exchange](data-connectors/symantec-integrated-cyber-defense-exchange.md)

## TALON CYBER SECURITY LTD

- [Talon Insights](data-connectors/talon-insights.md)

## Tenable

- [Tenable.io Vulnerability Management (using Azure Function)](data-connectors/tenable-io-vulnerability-management.md)

## The Collective Consulting BV

- [LastPass Enterprise - Reporting (Polling CCP)](data-connectors/lastpass-enterprise-reporting-polling-ccp.md)

## TheHive

- [TheHive Project - TheHive (using Azure Functions)](data-connectors/thehive-project-thehive.md)

## Theom, Inc.

- [Theom](data-connectors/theom.md)

## Trend Micro

- [Trend Micro Deep Security](data-connectors/trend-micro-deep-security.md)
- [Trend Micro TippingPoint](data-connectors/trend-micro-tippingpoint.md)
- [Trend Vision One (using Azure Functions)](data-connectors/trend-vision-one.md)

## TrendMicro

- [[Deprecated] Trend Micro Apex One via Legacy Agent](data-connectors/deprecated-trend-micro-apex-one-via-legacy-agent.md)
- [[Recommended] Trend Micro Apex One via AMA](data-connectors/recommended-trend-micro-apex-one-via-ama.md)

## Ubiquiti

- [Ubiquiti UniFi (using Azure Functions)](data-connectors/ubiquiti-unifi.md)

## Valence Security Inc.

- [SaaS Security](data-connectors/saas-security.md)

## Vectra AI, Inc

- [AI Vectra Stream](data-connectors/ai-vectra-stream.md)
- [Vectra XDR (using Azure Functions)](data-connectors/vectra-xdr.md)

## VMware

- [VMware vCenter](data-connectors/vmware-vcenter.md)
- [VMware Carbon Black Cloud (using Azure Functions)](data-connectors/vmware-carbon-black-cloud.md)
- [VMware ESXi](data-connectors/vmware-esxi.md)

## WatchGuard Technologies

- [WatchGuard Firebox](data-connectors/watchguard-firebox.md)

## WithSecure

- [WithSecure Elements API (Azure Function) (using Azure Functions)](data-connectors/withsecure-elements-api-azure.md)
- [WithSecure Elements via Connector](data-connectors/withsecure-elements-via-connector.md)

## Wiz, Inc.

- [Wiz](data-connectors/wiz.md)

## ZERO NETWORKS LTD

- [Zero Networks Segment Audit](data-connectors/zero-networks-segment-audit.md)
- [Zero Networks Segment Audit (Function) (using Azure Functions)](data-connectors/zero-networks-segment-audit.md)

## Zimperium, Inc.

- [Zimperium Mobile Threat Defense](data-connectors/zimperium-mobile-threat-defense.md)

## Zoom

- [Zoom Reports (using Azure Functions)](data-connectors/zoom-reports.md)

## Zscaler

- [Zscaler Private Access](data-connectors/zscaler-private-access.md)

[comment]: <> (DataConnector includes end)

## Next steps

For more information, see:

- [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md)
- [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md)
