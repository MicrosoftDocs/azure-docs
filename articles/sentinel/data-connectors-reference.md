---
title: Find your Microsoft Sentinel data connector | Microsoft Docs
description: Learn about specific configuration steps for Microsoft Sentinel data connectors.
author: cwatson-cat
ms.topic: reference
ms.date: 10/23/2023
ms.author: cwatson
---

# Find your Microsoft Sentinel data connector

This article lists all supported, out-of-the-box data connectors and links to each connector's deployment steps.

> [!IMPORTANT]
> - Noted Microsoft Sentinel data connectors are currently in **Preview**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - For connectors that use the Log Analytics agent, the agent will be [retired on **31 August, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you are using the Log Analytics agent in your Microsoft Sentinel deployment, we recommend that you start planning your migration to the AMA. For more information, see [AMA migration for Microsoft Sentinel](ama-migrate.md).

Data connectors are available as part of the following offerings:

- Solutions: Many data connectors are deployed as part of [Microsoft Sentinel solution](sentinel-solutions.md) together with related content like analytics rules, workbooks and playbooks. For more information, see the [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).

- Community connectors: More data connectors are provided by the Microsoft Sentinel community and can be found in the [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?filters=solution-templates&page=1&search=sentinel). Documentation for community data connectors is the responsibility of the organization that created the connector.

- Custom connectors: If you have a data source that isn't listed or currently supported, you can also create your own, custom connector. For more information, see [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

### Data connector prerequisites

[!INCLUDE [data-connector-prereq](includes/data-connector-prereq.md)]

[comment]: <> (DataConnector includes start)


## 42Crunch

- [API Protection](data-connectors/api-protection.md)

## Abnormal Security Corporation

- [AbnormalSecurity (using Azure Functions)](data-connectors/abnormalsecurity-using-azure-functions.md)

## Akamai

- [[Deprecated] Akamai Security Events via Legacy Agent](data-connectors/deprecated-akamai-security-events-via-legacy-agent.md)
- [[Recommended] Akamai Security Events via AMA](data-connectors/recommended-akamai-security-events-via-ama.md)

## AliCloud

- [AliCloud (using Azure Functions)](data-connectors/alicloud-using-azure-functions.md)

## Amazon Web Services

- [Amazon Web Services](data-connectors/amazon-web-services.md)
- [Amazon Web Services S3 (preview)](data-connectors/amazon-web-services-s3.md)

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

## Armorblox

- [Armorblox (using Azure Functions)](data-connectors/armorblox-using-azure-functions.md)

## Aruba

- [[Deprecated] Aruba ClearPass via Legacy Agent](data-connectors/deprecated-aruba-clearpass-via-legacy-agent.md)
- [[Recommended] Aruba ClearPass via AMA](data-connectors/recommended-aruba-clearpass-via-ama.md)

## Atlassian

- [Atlassian Confluence Audit (using Azure Functions)](data-connectors/atlassian-confluence-audit-using-azure-functions.md)
- [Atlassian Jira Audit (using Azure Functions)](data-connectors/atlassian-jira-audit-using-azure-functions.md)

## Auth0

- [Auth0 Access Management(using Azure Functions)](data-connectors/auth0-access-management-using-azure-functions.md)

## Better Mobile Security Inc.

- [BETTER Mobile Threat Defense (MTD)](data-connectors/better-mobile-threat-defense-mtd.md)

## Bitglass

- [Bitglass (using Azure Functions)](data-connectors/bitglass-using-azure-functions.md)

## Blackberry

- [Blackberry CylancePROTECT](data-connectors/blackberry-cylanceprotect.md)

## Bosch Global Software Technologies Pvt Ltd

- [AIShield](data-connectors/aishield.md)

## Box

- [Box (using Azure Functions)](data-connectors/box-using-azure-functions.md)

## Broadcom

- [[Deprecated] Broadcom Symantec DLP via Legacy Agent](data-connectors/deprecated-broadcom-symantec-dlp-via-legacy-agent.md)
- [[Recommended] Broadcom Symantec DLP via AMA](data-connectors/recommended-broadcom-symantec-dlp-via-ama.md)

## Cisco

- [[Deprecated] Cisco Secure Email Gateway via Legacy Agent](data-connectors/deprecated-cisco-secure-email-gateway-via-legacy-agent.md)
- [[Recommended] Cisco Secure Email Gateway via AMA](data-connectors/recommended-cisco-secure-email-gateway-via-ama.md)
- [Cisco Application Centric Infrastructure](data-connectors/cisco-application-centric-infrastructure.md)
- [Cisco ASA](data-connectors/cisco-asa.md)
- [Cisco Duo Security (using Azure Functions)](data-connectors/cisco-duo-security-using-azure-functions.md)
- [Cisco Identity Services Engine](data-connectors/cisco-identity-services-engine.md)
- [Cisco Meraki](data-connectors/cisco-meraki.md)
- [Cisco Secure Endpoint (AMP) (using Azure Functions)](data-connectors/cisco-secure-endpoint-amp-using-azure-functions.md)
- [Cisco Stealthwatch](data-connectors/cisco-stealthwatch.md)
- [Cisco UCS](data-connectors/cisco-ucs.md)
- [Cisco Umbrella (using Azure Functions)](data-connectors/cisco-umbrella-using-azure-functions.md)
- [Cisco Web Security Appliance](data-connectors/cisco-web-security-appliance.md)

## Cisco Systems, Inc.

- [[Deprecated] Cisco Firepower eStreamer via Legacy Agent](data-connectors/deprecated-cisco-firepower-estreamer-via-legacy-agent.md)
- [[Recommended] Cisco Firepower eStreamer via Legacy Agent via AMA](data-connectors/recommended-cisco-firepower-estreamer-via-legacy-agent-via-ama.md)
- [Cisco Software Defined WAN](data-connectors/cisco-software-defined-wan.md)

## Citrix

- [Citrix ADC (former NetScaler)](data-connectors/citrix-adc-former-netscaler.md)

## Claroty

- [[Deprecated] Claroty via Legacy Agent](data-connectors/deprecated-claroty-via-legacy-agent.md)
- [[Recommended] Claroty via AMA](data-connectors/recommended-claroty-via-ama.md)

## Cloud Software Group

- [[Deprecated] Citrix WAF (Web App Firewall) via Legacy Agent](data-connectors/deprecated-citrix-waf-web-app-firewall-via-legacy-agent.md)
- [[Recommended] Citrix WAF (Web App Firewall) via AMA](data-connectors/recommended-citrix-waf-web-app-firewall-via-ama.md)
- [CITRIX SECURITY ANALYTICS](data-connectors/citrix-security-analytics.md)
## Cloudflare

- [Cloudflare (Preview) (using Azure Functions)](data-connectors/cloudflare-using-azure-functions.md)
## Cognni

- [Cognni](data-connectors/cognni.md)

## CohesityDev

- [Cohesity (using Azure Functions)](data-connectors/cohesity-using-azure-functions.md)

## Contrast Security

- [[Deprecated] Contrast Protect via Legacy Agent](data-connectors/deprecated-contrast-protect-via-legacy-agent.md)
- [[Recommended] Contrast Protect via AMA](data-connectors/recommended-contrast-protect-via-ama.md)

## Corelight Inc.

- [Corelight](data-connectors/corelight.md)

## Crowdstrike

- [Crowdstrike Falcon Data Replicator (using Azure Functions)](data-connectors/crowdstrike-falcon-data-replicator-using-azure-functions.md)
- [CrowdStrike Falcon Endpoint Protection](data-connectors/crowdstrike-falcon-endpoint-protection.md)

## Cyber Defense Group B.V.

- [ESET PROTECT](data-connectors/eset-protect.md)

## CyberArk

- [[Deprecated] CyberArk Enterprise Password Vault (EPV) Events via Legacy Agent](data-connectors/deprecated-cyberark-enterprise-password-vault-epv-events-via-legacy-agent.md)
- [[Recommended] CyberArk Enterprise Password Vault (EPV) Events via AMA](data-connectors/recommended-cyberark-enterprise-password-vault-epv-events-via-ama.md)
- [CyberArkEPM (using Azure Functions)](data-connectors/cyberarkepm-using-azure-functions.md)

## Cybersixgill

- [Cybersixgill Actionable Alerts (using Azure Functions)](data-connectors/cybersixgill-actionable-alerts-using-azure-functions.md)

## Cynerio

- [Cynerio Security Events](data-connectors/cynerio-security-events.md)

## Darktrace

- [Darktrace Connector for Microsoft Sentinel REST API](data-connectors/darktrace-connector-for-microsoft-sentinel-rest-api.md)

## Darktrace plc

- [[Deprecated] AI Analyst Darktrace via Legacy Agent](data-connectors/deprecated-ai-analyst-darktrace-via-legacy-agent.md)
- [[Recommended] AI Analyst Darktrace via AMA](data-connectors/recommended-ai-analyst-darktrace-via-ama.md)

## Defend Limited

- [Cortex XDR - Incidents](data-connectors/cortex-xdr-incidents.md)

## Delinea Inc.

- [[Deprecated] Delinea Secret Server via Legacy Agent](data-connectors/deprecated-delinea-secret-server-via-legacy-agent.md)
- [[Recommended] Delinea Secret Server via AMA](data-connectors/recommended-delinea-secret-server-via-ama.md)

## Derdack

- [Derdack SIGNL4](data-connectors/derdack-signl4.md)

## Digital Guardian

- [Digital Guardian Data Loss Prevention](data-connectors/digital-guardian-data-loss-prevention.md)

## Digital Shadows

- [Digital Shadows Searchlight (using Azure Functions)](data-connectors/digital-shadows-searchlight-using-azure-functions.md)

## Dynatrace

- [Dynatrace Attacks](data-connectors/dynatrace-attacks.md)
- [Dynatrace Audit Logs](data-connectors/dynatrace-audit-logs.md)
- [Dynatrace Problems](data-connectors/dynatrace-problems.md)
- [Dynatrace Runtime Vulnerabilities](data-connectors/dynatrace-runtime-vulnerabilities.md)

## Elastic

- [Elastic Agent (Standalone)](data-connectors/elastic-agent-standalone.md)

## Exabeam

- [Exabeam Advanced Analytics](data-connectors/exabeam-advanced-analytics.md)

## ExtraHop Networks, Inc.

- [[Deprecated] ExtraHop Reveal(x) via Legacy Agent](data-connectors/deprecated-extrahop-reveal-x-via-legacy-agent.md)
- [[Recommended] ExtraHop Reveal(x) via AMA](data-connectors/recommended-extrahop-reveal-x-via-ama.md)

## F5, Inc.

- [[Deprecated] F5 Networks via Legacy Agent](data-connectors/deprecated-f5-networks-via-legacy-agent.md)
- [[Recommended] F5 Networks via AMA](data-connectors/recommended-f5-networks-via-ama.md)
- [F5 BIG-IP](data-connectors/f5-big-ip.md)

## Facebook

- [Workplace from Facebook (using Azure Functions)](data-connectors/workplace-from-facebook-using-azure-functions.md)

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

- [Fortinet](data-connectors/fortinet.md)

## GitLab

- [GitLab](data-connectors/gitlab.md)

## Google

- [Google ApigeeX (using Azure Functions)](data-connectors/google-apigeex-using-azure-functions.md)
- [Google Cloud Platform Cloud Monitoring (using Azure Functions)](data-connectors/google-cloud-platform-cloud-monitoring-using-azure-functions.md)
- [Google Cloud Platform DNS (using Azure Functions)](data-connectors/google-cloud-platform-dns-using-azure-functions.md)
- [Google Cloud Platform IAM (using Azure Functions)](data-connectors/google-cloud-platform-iam-using-azure-functions.md)
- [Google Workspace (G Suite) (using Azure Functions)](data-connectors/google-workspace-g-suite-using-azure-functions.md)

## H.O.L.M. Security Sweden AB

- [Holm Security Asset Data (using Azure Functions)](data-connectors/holm-security-asset-data-using-azure-functions.md)

## iboss inc

- [[Deprecated] iboss via Legacy Agent](data-connectors/deprecated-iboss-via-legacy-agent.md)
- [[Recommended] iboss via AMA](data-connectors/recommended-iboss-via-ama.md)

## Illumio

- [[Deprecated] Illumio Core via Legacy Agent](data-connectors/deprecated-illumio-core-via-legacy-agent.md)
- [[Recommended] Illumio Core via AMA](data-connectors/recommended-illumio-core-via-ama.md)

## Illusive Networks

- [[Deprecated] Illusive Platform via Legacy Agent](data-connectors/deprecated-illusive-platform-via-legacy-agent.md)
- [[Recommended] Illusive Platform via AMA](data-connectors/recommended-illusive-platform-via-ama.md)

## Imperva

- [Imperva Cloud WAF (using Azure Functions)](data-connectors/imperva-cloud-waf-using-azure-functions.md)

## Infoblox

- [Infoblox NIOS](data-connectors/infoblox-nios.md)

## Infoblox Inc.

- [Infoblox Cloud Data Connector](data-connectors/infoblox-cloud-data-connector.md)

## Infosec Global

- [InfoSecGlobal Data Connector](data-connectors/infosecglobal-data-connector.md)

## Insight VM / Rapid7

- [Rapid7 Insight Platform Vulnerability Management Reports (using Azure Functions)](data-connectors/rapid7-insight-platform-vulnerability-management-reports-using-azure-functions.md)

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

- [Lookout (using Azure Functions)](data-connectors/lookout-using-azure-function.md)
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
- [Microsoft Entra ID](data-connectors/azure-active-directory.md)
- [Microsoft Entra ID Protection](data-connectors/azure-active-directory-identity-protection.md)
- [Azure Activity](data-connectors/azure-activity.md)
- [Azure Batch Account](data-connectors/azure-batch-account.md)
- [Azure AI Search](data-connectors/azure-cognitive-search.md)
- [Azure Data Lake Storage Gen1](data-connectors/azure-data-lake-storage-gen1.md)
- [Azure DDoS Protection](data-connectors/azure-ddos-protection.md)
- [Azure Event Hub](data-connectors/azure-event-hub.md)
- [Azure Key Vault](data-connectors/azure-key-vault.md)
- [Azure Kubernetes Service (AKS)](data-connectors/azure-kubernetes-service-aks.md)
- [Azure Logic Apps](data-connectors/azure-logic-apps.md)
- [Azure Service Bus](data-connectors/azure-service-bus.md)
- [Azure Storage Account](data-connectors/azure-storage-account.md)
- [Azure Stream Analytics](data-connectors/azure-stream-analytics.md)
- [Azure Web Application Firewall (WAF)](data-connectors/azure-web-application-firewall-waf.md)
- [Common Event Format (CEF)](data-connectors/common-event-format-cef.md)
- [Common Event Format (CEF) via AMA](data-connectors/common-event-format-cef-via-ama.md)
- [DNS](data-connectors/dns.md)
- [Fortinet FortiWeb Web Application Firewall](data-connectors/fortinet-fortiweb-web-application-firewall.md)
- [Microsoft 365 (formerly, Office 365)](data-connectors/microsoft-365.md)
- [Microsoft Defender XDR](data-connectors/microsoft-365-defender.md)
- [Microsoft 365 Insider Risk Management](data-connectors/microsoft-365-insider-risk-management.md)
- [Microsoft Defender for Cloud](data-connectors/microsoft-defender-for-cloud.md)
- [Microsoft Defender for Cloud Apps](data-connectors/microsoft-defender-for-cloud-apps.md)
- [Microsoft Defender for Endpoint](data-connectors/microsoft-defender-for-endpoint.md)
- [Microsoft Defender for Identity](data-connectors/microsoft-defender-for-identity.md)
- [Microsoft Defender for IoT](data-connectors/microsoft-defender-for-iot.md)
- [Microsoft Defender for Office 365 (preview)](data-connectors/microsoft-defender-for-office-365.md)
- [Microsoft Defender Threat Intelligence](data-connectors/microsoft-defender-threat-intelligence.md)
- [Microsoft PowerBI (preview)](data-connectors/microsoft-powerbi.md)
- [Microsoft Project (preview)](data-connectors/microsoft-project.md)
- [Microsoft Purview (preview)](data-connectors/microsoft-purview.md)
- [Microsoft Purview Information Protection](data-connectors/microsoft-purview-information-protection.md)
- [Network Security Groups](data-connectors/network-security-groups.md)
- [Security Events via Legacy Agent](data-connectors/security-events-via-legacy-agent.md)
- [Syslog](data-connectors/syslog.md)
- [Threat intelligence - TAXII](data-connectors/threat-intelligence-taxii.md)
- [Threat Intelligence Platforms](data-connectors/threat-intelligence-platforms.md)
- [Threat Intelligence Upload Indicators API (Preview)](data-connectors/threat-intelligence-upload-indicators-api.md)
- [Windows DNS Events via AMA (Preview)](data-connectors/windows-dns-events-via-ama.md)
- [Windows Firewall](data-connectors/windows-firewall.md)
- [Windows Forwarded Events](data-connectors/windows-forwarded-events.md)
- [Windows Security Events via AMA](data-connectors/windows-security-events-via-ama.md)

## Microsoft Corporation

- [Azure Firewall](data-connectors/azure-firewall.md)
- [Dynamics 365](data-connectors/dynamics-365.md)

## Microsoft Corporation - sentinel4github

- [GitHub (using Webhooks) (using Azure Functions)](data-connectors/github-using-webhooks-using-azure-function.md)
- [GitHub Enterprise Audit Log](data-connectors/github-enterprise-audit-log.md)

## Microsoft Sentinel Community, Microsoft Corporation

- [[Deprecated] Forcepoint CASB via Legacy Agent](data-connectors/deprecated-forcepoint-casb-via-legacy-agent.md)
- [[Deprecated] Forcepoint CSG via Legacy Agent](data-connectors/deprecated-forcepoint-csg-via-legacy-agent.md)
- [[Deprecated] Forcepoint NGFW via Legacy Agent](data-connectors/deprecated-forcepoint-ngfw-via-legacy-agent.md)
- [[Recommended] Forcepoint CASB via AMA](data-connectors/recommended-forcepoint-casb-via-ama.md)
- [[Recommended] Forcepoint CSG via AMA](data-connectors/recommended-forcepoint-csg-via-ama.md)
- [[Recommended] Forcepoint NGFW via AMA](data-connectors/recommended-forcepoint-ngfw-via-ama.md)
- [Exchange Security Insights Online Collector (using Azure Functions)](data-connectors/exchange-security-insights-online-collector-using-azure-functions.md)
- [Forcepoint DLP](data-connectors/forcepoint-dlp.md)
- [MISP2Sentinel](data-connectors/misp2sentinel.md)

## MongoDB

- [MongoDB Audit](data-connectors/mongodb-audit.md)

## Morphisec

- [[Deprecated] Morphisec UTPP via Legacy Agent](data-connectors/deprecated-morphisec-utpp-via-legacy-agent.md)
- [[Recommended] Morphisec UTPP via AMA](data-connectors/recommended-morphisec-utpp-via-ama.md)

## MuleSoft

- [MuleSoft Cloudhub (using Azure Functions)](data-connectors/mulesoft-cloudhub-using-azure-functions.md)

## Nasuni Corporation

- [Nasuni Edge Appliance](data-connectors/nasuni-edge-appliance.md)

## NetClean Technologies AB

- [Netclean ProActive Incidents](data-connectors/netclean-proactive-incidents.md)

## Netskope

- [Netskope (using Azure Functions)](data-connectors/netskope-using-azure-functions.md)

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
- [NXLog LinuxAudit](data-connectors/nxlog-linuxaudit.md)

## Okta

- [Okta Single Sign-On (using Azure Functions)](data-connectors/okta-single-sign-on-using-azure-functions.md)

## OneLogin

- [OneLogin IAM Platform (using Azure Functions)](data-connectors/onelogin-iam-platform-using-azure-functions.md)

## OpenVPN

- [OpenVPN Server](data-connectors/openvpn-server.md)

## Oracle

- [Oracle Cloud Infrastructure (using Azure Functions)](data-connectors/oracle-cloud-infrastructure-using-azure-functions.md)
- [Oracle Database Audit](data-connectors/oracle-database-audit.md)
- [Oracle WebLogic Server](data-connectors/oracle-weblogic-server.md)

## Orca Security, Inc.

- [Orca Security Alerts](data-connectors/orca-security-alerts.md)

## OSSEC

- [[Deprecated] OSSEC via Legacy Agent](data-connectors/deprecated-ossec-via-legacy-agent.md)
- [[Recommended] OSSEC via AMA](data-connectors/recommended-ossec-via-ama.md)

## Palo Alto Networks

- [[Deprecated] Palo Alto Networks Cortex Data Lake (CDL) via Legacy Agent](data-connectors/deprecated-palo-alto-networks-cortex-data-lake-cdl-via-legacy-agent.md)
- [[Recommended] Palo Alto Networks Cortex Data Lake (CDL) via AMA](data-connectors/recommended-palo-alto-networks-cortex-data-lake-cdl-via-ama.md)
- [Palo Alto Networks (Firewall)](data-connectors/palo-alto-networks-firewall.md)
- [Palo Alto Prisma Cloud CSPM (using Azure Functions)](data-connectors/palo-alto-prisma-cloud-cspm-using-azure-functions.md)

## Perimeter 81

- [Perimeter 81 Activity Logs](data-connectors/perimeter-81-activity-logs.md)

## Ping Identity

- [[Deprecated] PingFederate via Legacy Agent](data-connectors/deprecated-pingfederate-via-legacy-agent.md)
- [[Recommended] PingFederate via AMA](data-connectors/recommended-pingfederate-via-ama.md)

## PostgreSQL

- [PostgreSQL Events](data-connectors/postgresql-events.md)

## Proofpoint

- [Proofpoint On Demand Email Security (using Azure Functions)](data-connectors/proofpoint-on-demand-email-security-using-azure-functions.md)
- [Proofpoint TAP (using Azure Functions)](data-connectors/proofpoint-tap-using-azure-functions.md)

## Pulse Secure

- [Pulse Connect Secure](data-connectors/pulse-connect-secure.md)

## Qualys

- [Qualys VM KnowledgeBase (using Azure Functions)](data-connectors/qualys-vm-knowledgebase-using-azure-functions.md)
- [Qualys Vulnerability Management (using Azure Functions)](data-connectors/qualys-vulnerability-management-using-azure-functions.md)

## RedHat

- [JBoss Enterprise Application Platform](data-connectors/jboss-enterprise-application-platform.md)

## RSA

- [RSA® SecurID (Authentication Manager)](data-connectors/rsa-securid-authentication-manager.md)

## Rubrik, Inc.

- [Rubrik Security Cloud data connector (using Azure Functions)](data-connectors/rubrik-security-cloud-data-connector-using-azure-functions.md)

## SailPoint

- [SailPoint IdentityNow (using Azure Functions)](data-connectors/sailpoint-identitynow-using-azure-function.md)

## Salesforce

- [Salesforce Service Cloud (using Azure Functions)](data-connectors/salesforce-service-cloud-using-azure-functions.md)

## Secure Practice

- [MailRisk by Secure Practice (using Azure Functions)](data-connectors/mailrisk-by-secure-practice-using-azure-functions.md)

## SecurityBridge

- [SecurityBridge Threat Detection for SAP](data-connectors/securitybridge-threat-detection-for-sap.md)

## Senserva, LLC

- [SenservaPro (Preview)](data-connectors/senservapro.md)

## SentinelOne

- [SentinelOne (using Azure Functions)](data-connectors/sentinelone-using-azure-functions.md)

## Slack

- [Slack Audit (using Azure Functions)](data-connectors/slack-audit-using-azure-functions.md)

## Snowflake

- [Snowflake (using Azure Functions)](data-connectors/snowflake-using-azure-functions.md)

## SonicWall Inc

- [[Deprecated] SonicWall Firewall via Legacy Agent](data-connectors/deprecated-sonicwall-firewall-via-legacy-agent.md)
- [[Recommended] SonicWall Firewall via AMA](data-connectors/recommended-sonicwall-firewall-via-ama.md)

## Sonrai Security

- [Sonrai Data Connector](data-connectors/sonrai-data-connector.md)

## Sophos

- [Sophos Cloud Optix](data-connectors/sophos-cloud-optix.md)
- [Sophos Endpoint Protection (using Azure Functions)](data-connectors/sophos-endpoint-protection-using-azure-functions.md)
- [Sophos XG Firewall](data-connectors/sophos-xg-firewall.md)

## Squid

- [Squid Proxy](data-connectors/squid-proxy.md)

## Symantec

- [Symantec Endpoint Protection](data-connectors/symantec-endpoint-protection.md)
- [Symantec Integrated Cyber Defense Exchange](data-connectors/symantec-integrated-cyber-defense-exchange.md)
- [Symantec ProxySG](data-connectors/symantec-proxysg.md)
- [Symantec VIP](data-connectors/symantec-vip.md)

## TALON CYBER SECURITY LTD

- [Talon Insights](data-connectors/talon-insights.md)

## Tenable

- [Tenable.io Vulnerability Management (using Azure Functions)](data-connectors/tenable-io-vulnerability-management-using-azure-function.md)

## The Collective Consulting BV

- [LastPass Enterprise - Reporting (Polling CCP)](data-connectors/lastpass-enterprise-reporting-polling-ccp.md)

## TheHive

- [TheHive Project - TheHive (using Azure Functions)](data-connectors/thehive-project-thehive-using-azure-functions.md)

## Theom, Inc.

- [Theom](data-connectors/theom.md)

## Trend Micro

- [Trend Micro Deep Security](data-connectors/trend-micro-deep-security.md)
- [Trend Micro TippingPoint](data-connectors/trend-micro-tippingpoint.md)
- [Trend Vision One (using Azure Functions)](data-connectors/trend-vision-one-using-azure-functions.md)

## TrendMicro

- [[Deprecated] Trend Micro Apex One via Legacy Agent](data-connectors/deprecated-trend-micro-apex-one-via-legacy-agent.md)
- [[Recommended] Trend Micro Apex One via AMA](data-connectors/recommended-trend-micro-apex-one-via-ama.md)

## Ubiquiti

- [Ubiquiti UniFi (Preview)](data-connectors/ubiquiti-unifi.md)

## vArmour Networks

- [[Deprecated] vArmour Application Controller via Legacy Agent](data-connectors/deprecated-varmour-application-controller-via-legacy-agent.md)
- [[Recommended] vArmour Application Controller via AMA](data-connectors/recommended-varmour-application-controller-via-ama.md)

## Vectra AI, Inc

- [AI Vectra Stream](data-connectors/ai-vectra-stream.md)
- [Vectra AI Detect](data-connectors/vectra-ai-detect.md)
- [Vectra XDR (using Azure Functions)](data-connectors/vectra-xdr-using-azure-functions.md)

## VMware

- [VMware Carbon Black Cloud (using Azure Functions)](data-connectors/vmware-carbon-black-cloud-using-azure-functions.md)
- [VMware ESXi](data-connectors/vmware-esxi.md)
- [VMware vCenter](data-connectors/vmware-vcenter.md)

## WatchGuard Technologies

- [WatchGuard Firebox](data-connectors/watchguard-firebox.md)

## WireX Systems

- [[Deprecated] WireX Network Forensics Platform via Legacy Agent](data-connectors/deprecated-wirex-network-forensics-platform-via-legacy-agent.md)
- [[Recommended] WireX Network Forensics Platform via AMA](data-connectors/recommended-wirex-network-forensics-platform-via-ama.md)

## WithSecure

- [WithSecure Elements via Connector](data-connectors/withsecure-elements-via-connector.md)

## Wiz, Inc.

- [Wiz](data-connectors/wiz.md)

## ZERO NETWORKS LTD

- [Zero Networks Segment Audit](data-connectors/zero-networks-segment-audit.md)
- [Zero Networks Segment Audit (Function) (using Azure Functions)](data-connectors/zero-networks-segment-audit-function-using-azure-functions.md)

## Zimperium, Inc.

- [Zimperium Mobile Threat Defense](data-connectors/zimperium-mobile-threat-defense.md)

## Zoom

- [Zoom Reports (using Azure Functions)](data-connectors/zoom-reports-using-azure-functions.md)

## Zscaler

- [Zscaler](data-connectors/zscaler.md)
- [Zscaler Private Access](data-connectors/zscaler-private-access.md)

[comment]: <> (DataConnector includes end)

## Next steps

For more information, see:

- [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md)
- [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md)
