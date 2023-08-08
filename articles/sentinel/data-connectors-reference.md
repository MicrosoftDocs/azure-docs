---
title: Find your Microsoft Sentinel data connector | Microsoft Docs
description: Learn about specific configuration steps for Microsoft Sentinel data connectors.
author: cwatson-cat
ms.topic: reference
ms.date: 07/26/2023
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

- [Akamai Security Events](data-connectors/akamai-security-events.md)

## AliCloud

- [AliCloud (using Azure Functions)](data-connectors/alicloud-using-azure-functions.md)

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

## Armorblox

- [Armorblox (using Azure Functions)](data-connectors/armorblox-using-azure-functions.md)

## Aruba

- [Aruba ClearPass](data-connectors/aruba-clearpass.md)

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

- [Box (using Azure Function)](data-connectors/box-using-azure-function.md)

## Broadcom

- [Broadcom Symantec DLP](data-connectors/braodcom-symantec-dlp.md)

## Cisco

- [Cisco Application Centric Infrastructure](data-connectors/cisco-application-centric-infrastructure.md)
- [Cisco ASA](data-connectors/cisco-asa.md)
- [Cisco ASA/FTD via AMA (Preview)](data-connectors/cisco-asa-ftd-via-ama.md)
- [Cisco Duo Security (using Azure Functions)](data-connectors/cisco-duo-security-using-azure-functions.md)
- [Cisco Identity Services Engine](data-connectors/cisco-identity-services-engine.md)
- [Cisco Meraki](data-connectors/cisco-meraki.md)
- [Cisco Secure Email Gateway](data-connectors/cisco-secure-email-gateway.md)
- [Cisco Secure Endpoint (AMP) (using Azure Functions)](data-connectors/cisco-secure-endpoint-amp-using-azure-functions.md)
- [Cisco Stealthwatch](data-connectors/cisco-stealthwatch.md)
- [Cisco UCS](data-connectors/cisco-ucs.md)
- [Cisco Umbrella (using Azure Function)](data-connectors/cisco-umbrella-using-azure-function.md)
- [Cisco Web Security Appliance](data-connectors/cisco-web-security-appliance.md)

## Cisco Systems, Inc.

- [Cisco Firepower eStreamer](data-connectors/cisco-firepower-estreamer.md)

## Citrix

- [Citrix ADC (former NetScaler)](data-connectors/citrix-adc-former-netscaler.md)

## Claroty

- [Claroty](data-connectors/claroty.md)

## Cloud Software Group

- [CITRIX SECURITY ANALYTICS](data-connectors/citrix-security-analytics.md)
- [Citrix WAF (Web App Firewall)](data-connectors/citrix-waf-web-app-firewall.md)

## Cloudflare

- [Cloudflare (Preview) (using Azure Functions)](data-connectors/cloudflare-using-azure-functions.md)

## Cognni

- [Cognni](data-connectors/cognni.md)

## CohesityDev

- [Cohesity (using Azure Functions)](data-connectors/cohesity-using-azure-functions.md)

## Contrast Security

- [Contrast Protect](data-connectors/contrast-protect.md)

## Corelight Inc.

- [Corelight](data-connectors/corelight.md)

## Crowdstrike

- [Crowdstrike Falcon Data Replicator (using Azure Functions)](data-connectors/crowdstrike-falcon-data-replicator-using-azure-functions.md)
- [CrowdStrike Falcon Endpoint Protection](data-connectors/crowdstrike-falcon-endpoint-protection.md)

## Cyber Defense Group B.V.

- [ESET PROTECT](data-connectors/eset-protect.md)

## CyberArk

- [CyberArk Enterprise Password Vault (EPV) Events](data-connectors/cyberark-enterprise-password-vault-epv-events.md)
- [CyberArkEPM (using Azure Functions)](data-connectors/cyberarkepm-using-azure-functions.md)

## CyberPion

- [Cyberpion Security Logs](data-connectors/cyberpion-security-logs.md)

## Cybersixgill

- [Cybersixgill Actionable Alerts (using Azure Functions)](data-connectors/cybersixgill-actionable-alerts-using-azure-functions.md)

## Cynerio

- [Cynerio Security Events](data-connectors/cynerio-security-events.md)

## Darktrace

- [AI Analyst Darktrace](data-connectors/ai-analyst-darktrace.md)
- [Darktrace Connector for Microsoft Sentinel REST API](data-connectors/darktrace-connector-for-microsoft-sentinel-rest-api.md)

## Delinea Inc.

- [Delinea Secret Server](data-connectors/delinea-secret-server.md)

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

- [ExtraHop Reveal(x)](data-connectors/extrahop-reveal-x.md)

## F5, Inc.

- [F5 BIG-IP](data-connectors/f5-big-ip.md)
- [F5 Networks](data-connectors/f5-networks.md)

## Facebook

- [Workplace from Facebook (using Azure Functions)](data-connectors/workplace-from-facebook-using-azure-function.md)

## Fireeye

- [FireEye Network Security (NX)](data-connectors/fireeye-network-security-nx.md)

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

- [iboss](data-connectors/iboss.md)

## Illumio

- [Illumio Core](data-connectors/illumio-core.md)

## Illusive Networks

- [Illusive Platform](data-connectors/illusive-platform.md)

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

- [Kaspersky Security Center](data-connectors/kaspersky-security-center.md)

## Linux

- [Microsoft Sysmon For Linux](data-connectors/microsoft-sysmon-for-linux.md)

## Lookout, Inc.

- [Lookout (using Azure Functions)](data-connectors/lookout-using-azure-function.md)
- [Lookout Cloud Security for Microsoft Sentinel (using Azure Functions)](data-connectors/lookout-cloud-security-for-microsoft-sentinel-using-azure-function.md)

## MarkLogic

- [MarkLogic Audit](data-connectors/marklogic-audit.md)

## McAfee

- [McAfee ePolicy Orchestrator (ePO)](data-connectors/mcafee-epolicy-orchestrator-epo.md)
- [McAfee Network Security Platform](data-connectors/mcafee-network-security-platform.md)

## Microsoft

- [Automated Logic WebCTRL](data-connectors/automated-logic-webctrl.md)
- [Azure Active Directory](data-connectors/azure-active-directory.md)
- [Azure Active Directory Identity Protection](data-connectors/azure-active-directory-identity-protection.md)
- [Azure Activity](data-connectors/azure-activity.md)
- [Azure Batch Account](data-connectors/azure-batch-account.md)
- [Azure Cognitive Search](data-connectors/azure-cognitive-search.md)
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
- [Microsoft 365 Defender](data-connectors/microsoft-365-defender.md)
- [Microsoft 365 Insider Risk Management](data-connectors/microsoft-365-insider-risk-management.md)
- [Microsoft Defender for Cloud](data-connectors/microsoft-defender-for-cloud.md)
- [Microsoft Defender for Cloud Apps](data-connectors/microsoft-defender-for-cloud-apps.md)
- [Microsoft Defender for Endpoint](data-connectors/microsoft-defender-for-endpoint.md)
- [Microsoft Defender for Identity](data-connectors/microsoft-defender-for-identity.md)
- [Microsoft Defender for IoT](data-connectors/microsoft-defender-for-iot.md)
- [Microsoft Defender for Office 365](data-connectors/microsoft-defender-for-office-365.md)
- [Microsoft Defender Threat Intelligence](data-connectors/microsoft-defender-threat-intelligence.md)
- [Microsoft PowerBI](data-connectors/microsoft-powerbi.md)
- [Microsoft Project](data-connectors/microsoft-project.md)
- [Microsoft Purview (Preview)](data-connectors/microsoft-purview.md)
- [Microsoft Purview Information Protection](data-connectors/microsoft-purview-information-protection.md)
- [Network Security Groups](data-connectors/network-security-groups.md)
- [Office 365](data-connectors/office-365.md)
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

- [Exchange Security Insights Online Collector (using Azure Functions)](data-connectors/exchange-security-insights-online-collector-using-azure-functions.md)
- [Forcepoint CASB](data-connectors/forcepoint-casb.md)
- [Forcepoint CSG](data-connectors/forcepoint-csg.md)
- [Forcepoint DLP](data-connectors/forcepoint-dlp.md)
- [Forcepoint NGFW](data-connectors/forcepoint-ngfw.md)

## MongoDB

- [MongoDB Audit](data-connectors/mongodb-audit.md)

## Morphisec

- [Morphisec UTPP](data-connectors/morphisec-utpp.md)

## MuleSoft

- [MuleSoft Cloudhub (using Azure Functions)](data-connectors/mulesoft-cloudhub-using-azure-functions.md)

## NetClean Technologies AB

- [Netclean ProActive Incidents](data-connectors/netclean-proactive-incidents.md)

## Netskope

- [Netskope (using Azure Functions)](data-connectors/netskope-using-azure-functions.md)

## Netwrix

- [Netwrix Auditor (formerly Stealthbits Privileged Activity Manager)](data-connectors/netwrix-auditor-formerly-stealthbits-privileged-activity-manager.md)

## Nginx

- [NGINX HTTP Server](data-connectors/nginx-http-server.md)

## Noname Gate, Inc.

- [Noname Security for Microsoft Sentinel](data-connectors/noname-security-for-microsoft-sentinel.md)

## Nozomi Networks

- [Nozomi Networks N2OS](data-connectors/nozomi-networks-n2os.md)

## NXLog Ltd.

- [NXLog AIX Audit](data-connectors/nxlog-aix-audit.md)
- [NXLog BSM macOS](data-connectors/nxlog-bsm-macos.md)
- [NXLog DNS Logs](data-connectors/nxlog-dns-logs.md)
- [NXLog LinuxAudit](data-connectors/nxlog-linuxaudit.md)

## Okta

- [Okta Single Sign-On (using Azure Functions)](data-connectors/okta-single-sign-on-using-azure-function.md)

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

- [OSSEC](data-connectors/ossec.md)

## Palo Alto Networks

- [Palo Alto Networks (Firewall)](data-connectors/palo-alto-networks-firewall.md)
- [Palo Alto Networks Cortex Data Lake (CDL)](data-connectors/palo-alto-networks-cortex-data-lake-cdl.md)
- [Palo Alto Prisma Cloud CSPM (using Azure Functions)](data-connectors/palo-alto-prisma-cloud-cspm-using-azure-function.md)

## Perimeter 81

- [Perimeter 81 Activity Logs](data-connectors/perimeter-81-activity-logs.md)

## Ping Identity

- [PingFederate](data-connectors/pingfederate.md)

## PostgreSQL

- [PostgreSQL Events](data-connectors/postgresql-events.md)

## Proofpoint

- [Proofpoint On Demand Email Security (using Azure Functions)](data-connectors/proofpoint-on-demand-email-security-using-azure-functions.md)
- [Proofpoint TAP (using Azure Functions)](data-connectors/proofpoint-tap-using-azure-function.md)

## Pulse Secure

- [Pulse Connect Secure](data-connectors/pulse-connect-secure.md)

## Qualys

- [Qualys VM KnowledgeBase (using Azure Functions)](data-connectors/qualys-vm-knowledgebase-using-azure-function.md)
- [Qualys Vulnerability Management (using Azure Functions)](data-connectors/qualys-vulnerability-management-using-azure-functions.md)

## RedHat

- [JBoss Enterprise Application Platform](data-connectors/jboss-enterprise-application-platform.md)

## RSA

- [RSA® SecurID (Authentication Manager)](data-connectors/rsa-securid-authentication-manager.md)

## Rubrik, Inc.

- [Rubrik Security Cloud data connector (using Azure Functions)](data-connectors/rubrik-security-cloud-data-connector-using-azure-function.md)

## SailPoint

- [SailPoint IdentityNow (using Azure Functions)](data-connectors/sailpoint-identitynow-using-azure-function.md)

## Salesforce

- [Salesforce Service Cloud (using Azure Functions)](data-connectors/salesforce-service-cloud-using-azure-function.md)

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

- [Snowflake (using Azure Functions)](data-connectors/snowflake-using-azure-function.md)

## SonicWall Inc

- [SonicWall Firewall](data-connectors/sonicwall-firewall.md)

## Sonrai Security

- [Sonrai Data Connector](data-connectors/sonrai-data-connector.md)

## Sophos

- [Sophos Cloud Optix](data-connectors/sophos-cloud-optix.md)
- [Sophos Endpoint Protection (using Azure Functions)](data-connectors/sophos-endpoint-protection-using-azure-function.md)
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

- [TheHive Project - TheHive (using Azure Functions)](data-connectors/thehive-project-thehive-using-azure-function.md)

## Theom, Inc.

- [Theom](data-connectors/theom.md)

## Trend Micro

- [Trend Micro Deep Security](data-connectors/trend-micro-deep-security.md)
- [Trend Micro TippingPoint](data-connectors/trend-micro-tippingpoint.md)
- [Trend Vision One (using Azure Functions)](data-connectors/trend-vision-one-using-azure-functions.md)

## TrendMicro

- [Trend Micro Apex One](data-connectors/trend-micro-apex-one.md)

## Ubiquiti

- [Ubiquiti UniFi (Preview)](data-connectors/ubiquiti-unifi.md)

## vArmour Networks

- [vArmour Application Controller](data-connectors/varmour-application-controller.md)

## Vectra AI, Inc

- [AI Vectra Stream](data-connectors/ai-vectra-stream.md)
- [Vectra AI Detect](data-connectors/vectra-ai-detect.md)

## VMware

- [VMware Carbon Black Cloud (using Azure Functions)](data-connectors/vmware-carbon-black-cloud-using-azure-functions.md)
- [VMware ESXi](data-connectors/vmware-esxi.md)
- [VMware vCenter](data-connectors/vmware-vcenter.md)

## WatchGuard Technologies

- [WatchGuard Firebox](data-connectors/watchguard-firebox.md)

## WireX Systems

- [WireX Network Forensics Platform](data-connectors/wirex-network-forensics-platform.md)

## WithSecure

- [WithSecure Elements via Connector](data-connectors/withsecure-elements-via-connector.md)

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
