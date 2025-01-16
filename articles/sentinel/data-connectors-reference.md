---
title: Find your Microsoft Sentinel data connector | Microsoft Docs
description: Learn about specific configuration steps for Microsoft Sentinel data connectors.
author: cwatson-cat
ms.topic: reference
ms.date: 11/18/2024
ms.custom: linux-related-content
ms.author: cwatson
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to find and deploy the appropriate data connectors for Microsoft Sentinel so that I can integrate and monitor various security data sources effectively.

---

# Find your Microsoft Sentinel data connector

This article lists all supported, out-of-the-box data connectors and links to each connector's deployment steps.

> [!IMPORTANT]
> - Noted Microsoft Sentinel data connectors are currently in **Preview**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - [!INCLUDE [unified-soc-preview-without-alert](includes/unified-soc-preview-without-alert.md)]

Data connectors are available as part of the following offerings:

- Solutions: Many data connectors are deployed as part of [Microsoft Sentinel solution](sentinel-solutions.md) together with related content like analytics rules, workbooks, and playbooks. For more information, see the [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).

- Community connectors: More data connectors are provided by the Microsoft Sentinel community and can be found in the [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?filters=solution-templates&page=1&search=sentinel). Documentation for community data connectors is the responsibility of the organization that created the connector.

- Custom connectors: If you have a data source that isn't listed or currently supported, you can also create your own, custom connector. For more information, see [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Data connector prerequisites

[!INCLUDE [data-connector-prereq](includes/data-connector-prereq.md)]

Azure Monitor agent (AMA) based data connectors require an internet connection from the system where the agent is installed. Enable port 443 outbound to allow a connection between the system where the agent is installed and Microsoft Sentinel.

## Syslog and Common Event Format (CEF) connectors

Log collection from many security appliances and devices are supported by the data connectors **Syslog via AMA** or **Common Event Format (CEF) via AMA** in Microsoft Sentinel. To forward data to your Log Analytics workspace for Microsoft Sentinel, complete the steps in [Ingest syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-ama.md). These steps include installing the Microsoft Sentinel solution for a security appliance or device from the **Content hub** in Microsoft Sentinel. Then, configure the **Syslog via AMA** or **Common Event Format (CEF) via AMA** data connector that's appropriate for the Microsoft Sentinel solution you installed. Complete the setup by configuring the security device or appliance. Find instructions to configure your security device or appliance in one of the following articles:

- [CEF via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion](unified-connector-cef-device.md)
- [Syslog via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion](unified-connector-syslog-device.md)

Contact the solution provider for more information or where information is unavailable for the appliance or device.

## Custom Logs via AMA connector

Filter and ingest logs in text-file format from network or security applications installed on Windows or Linux machines by using the **Custom Logs via AMA connector** in Microsoft Sentinel. For more information, see the following articles:

- [Collect logs from text files with the Azure Monitor Agent and ingest to Microsoft Sentinel](/azure/sentinel/connect-custom-logs-ama?tabs=portal)
- [Custom Logs via AMA data connector - Configure data ingestion to Microsoft Sentinel from specific applications](/azure/sentinel/unified-connector-custom-device)

## Codeless connector platform connectors

The following connectors use the current codeless connector platform but don't have a specific documentation page generated. They're available from the content hub in Microsoft Sentinel as part of a solution. For instructions on how to configure these data connectors, review the instructions available with each data connector within Microsoft Sentinel.

|Codeless connector name  |Azure Marketplace solution  |
|---------|---------|
|Atlassian Jira Audit (using REST API) (Preview)     |  [Atlassian Jira Audit ](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-atlassianjiraaudit?tab=Overview)      |       
|Cisco Meraki (using Rest API)    |   [Cisco Meraki Events via REST API](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscomerakinativepoller?tab=Overview)|        
|Ermes Browser Security Events    |  [Ermes Browser Security for Microsoft Sentinel](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/ermes.azure-sentinel-solution-ermes-browser-security?tab=Overview)|        
|Okta Single Sign-On (Preview)|[Okta Single Sign-On Solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-okta?tab=Overview)|
|Sophos Endpoint Protection (using REST API) (Preview)|[Sophos Endpoint Protection Solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-sophosep?tab=Overview)|
|Workday User Activity (Preview)|[Workday (Preview)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-workday?tab=Overview)|

For more information about the codeless connector platform, see [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md).

[comment]: <> (DataConnector includes start)

## 1Password

- [1Password (using Azure Functions)](data-connectors/1password.md)

## 42Crunch

- [API Protection](data-connectors/api-protection.md)

## Abnormal Security Corporation

- [AbnormalSecurity (using Azure Functions)](data-connectors/abnormalsecurity.md)

## AliCloud

- [AliCloud (using Azure Functions)](data-connectors/alicloud.md)

## Amazon Web Services

- [Amazon Web Services](data-connectors/amazon-web-services.md)
- [Amazon Web Services S3](data-connectors/amazon-web-services-s3.md)

## archTIS

- [NC Protect](data-connectors/nc-protect.md)

## ARGOS Cloud Security Pty Ltd

- [ARGOS Cloud Security](data-connectors/argos-cloud-security.md)

## Armis, Inc.

- [Armis Activities (using Azure Functions)](data-connectors/armis-activities.md)
- [Armis Alerts (using Azure Functions)](data-connectors/armis-alerts.md)
- [Armis Alerts Activities (using Azure Functions)](data-connectors/armis-alerts-activities.md)
- [Armis Devices (using Azure Functions)](data-connectors/armis-devices.md)

## Armorblox

- [Armorblox (using Azure Functions)](data-connectors/armorblox.md)

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

## Bosch Global Software Technologies Pvt Ltd

- [AIShield](data-connectors/aishield.md)

## Box

- [Box (using Azure Functions)](data-connectors/box.md)

## Cisco

- [Cisco ASA/FTD via AMA (Preview)](data-connectors/cisco-asa-ftd-via-ama.md)
- [Cisco Duo Security (using Azure Functions)](data-connectors/cisco-duo-security.md)
- [Cisco Secure Endpoint (AMP) (using Azure Functions)](data-connectors/cisco-secure-endpoint-amp.md)
- [Cisco Umbrella (using Azure Functions)](data-connectors/cisco-umbrella.md)

## Cisco Systems, Inc.

- [Cisco Software Defined WAN](data-connectors/cisco-software-defined-wan.md)
- [Cisco ETD (using Azure Functions)](data-connectors/cisco-etd.md)

## Claroty

- [Claroty xDome](data-connectors/claroty-xdome.md)

## Cloudflare

- [Cloudflare (Preview) (using Azure Functions)](data-connectors/cloudflare.md)

## Cognni

- [Cognni](data-connectors/cognni.md)

## cognyte technologies israel ltd

- [Luminar IOCs and Leaked Credentials (using Azure Functions)](data-connectors/luminar-iocs-and-leaked-credentials.md)

## CohesityDev

- [Cohesity (using Azure Functions)](data-connectors/cohesity.md)

## Commvault

- [CommvaultSecurityIQ (using Azure Functions)](data-connectors/commvaultsecurityiq.md)

## Corelight Inc.

- [Corelight Connector Exporter](data-connectors/corelight-connector-exporter.md)

## Cribl

- [Cribl](data-connectors/cribl.md)

## CTERA Networks Ltd

- [CTERA Syslog](data-connectors/ctera-syslog.md)

## Crowdstrike

- [CrowdStrike Falcon Adversary Intelligence (using Azure Functions)](data-connectors/crowdstrike-falcon-adversary-intelligence.md)
- [Crowdstrike Falcon Data Replicator (using Azure Functions)](data-connectors/crowdstrike-falcon-data-replicator.md)
- [Crowdstrike Falcon Data Replicator V2 (using Azure Functions)](data-connectors/crowdstrike-falcon-data-replicator-v2.md)

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

## Digital Shadows

- [Digital Shadows Searchlight (using Azure Functions)](data-connectors/digital-shadows-searchlight.md)

## Dynatrace

- [Dynatrace Attacks](data-connectors/dynatrace-attacks.md)
- [Dynatrace Audit Logs](data-connectors/dynatrace-audit-logs.md)
- [Dynatrace Problems](data-connectors/dynatrace-problems.md)
- [Dynatrace Runtime Vulnerabilities](data-connectors/dynatrace-runtime-vulnerabilities.md)

## Elastic

- [Elastic Agent (Standalone)](data-connectors/elastic-agent-standalone.md)

## F5, Inc.

- [F5 BIG-IP](data-connectors/f5-big-ip.md)

## Facebook

- [Workplace from Facebook (using Azure Functions)](data-connectors/workplace-from-facebook.md)

## Feedly, Inc.

- [Feedly](data-connectors/feedly.md)

## Flare Systems

- [Flare](data-connectors/flare.md)

## Forescout

- [Forescout](data-connectors/forescout.md)
- [Forescout Host Property Monitor](data-connectors/forescout-host-property-monitor.md)

## Fortinet

- [Fortinet FortiNDR Cloud (using Azure Functions)](data-connectors/fortinet-fortindr-cloud.md)

## Gigamon, Inc

- [Gigamon AMX Data Connector](data-connectors/gigamon-amx-data-connector.md)

## Google

- [Google Cloud Platform DNS (using Azure Functions)](data-connectors/google-cloud-platform-dns.md)
- [Google Cloud Platform IAM (using Azure Functions)](data-connectors/google-cloud-platform-iam.md)
- [Google Cloud Platform Cloud Monitoring (using Azure Functions)](data-connectors/google-cloud-platform-cloud-monitoring.md)
- [Google ApigeeX (using Azure Functions)](data-connectors/google-apigeex.md)
- [Google Workspace (G Suite) (using Azure Functions)](data-connectors/google-workspace-g-suite.md)

## Greynoise Intelligence, Inc.

- [GreyNoise Threat Intelligence (using Azure Functions)](data-connectors/greynoise-threat-intelligence.md)

## HYAS Infosec Inc

- [HYAS Protect (using Azure Functions)](data-connectors/hyas-protect.md)

## Illumio, Inc.

- [Illumio SaaS (using Azure Functions)](data-connectors/illumio-saas.md)

## H.O.L.M. Security Sweden AB

- [Holm Security Asset Data (using Azure Functions)](data-connectors/holm-security-asset-data.md)

## Imperva

- [Imperva Cloud WAF (using Azure Functions)](data-connectors/imperva-cloud-waf.md)

## Infoblox

- [[Recommended] Infoblox Cloud Data Connector via AMA](data-connectors/recommended-infoblox-cloud-data-connector-via-ama.md)
- [[Recommended] Infoblox SOC Insight Data Connector via AMA](data-connectors/recommended-infoblox-soc-insight-data-connector-via-ama.md)
- [Infoblox Data Connector via REST API (using Azure Functions)](data-connectors/infoblox-data-connector-via-rest-api.md)
- [Infoblox SOC Insight Data Connector via REST API](data-connectors/infoblox-soc-insight-data-connector-via-rest-api.md)

## Infosec Global

- [InfoSecGlobal Data Connector](data-connectors/infosecglobal-data-connector.md)

## Insight VM / Rapid7

- [Rapid7 Insight Platform Vulnerability Management Reports (using Azure Functions)](data-connectors/rapid7-insight-platform-vulnerability-management-reports.md)

## Island Technology Inc.

- [Island Enterprise Browser Admin Audit (Polling CCP)](data-connectors/island-enterprise-browser-admin-audit-polling-ccp.md)
- [Island Enterprise Browser User Activity (Polling CCP)](data-connectors/island-enterprise-browser-user-activity-polling-ccp.md)

## Jamf Software, LLC

- [Jamf Protect](data-connectors/jamf-protect.md)

## Lookout, Inc.

- [Lookout (using Azure Function)](data-connectors/lookout.md)
- [Lookout Cloud Security for Microsoft Sentinel (using Azure Functions)](data-connectors/lookout-cloud-security-for-microsoft-sentinel-using-azure-function.md)

## MailGuard Pty Limited

- [MailGuard 365](data-connectors/mailguard-365.md)

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
- [Windows Security Events via AMA](data-connectors/windows-security-events-via-ama.md)
- [Azure Service Bus](data-connectors/azure-service-bus.md)
- [Azure Stream Analytics](data-connectors/azure-stream-analytics.md)
- [Syslog via AMA](data-connectors/syslog-via-ama.md)
- [Microsoft Defender Threat Intelligence (Preview)](data-connectors/microsoft-defender-threat-intelligence.md)
- [Premium Microsoft Defender Threat Intelligence (Preview)](data-connectors/premium-microsoft-defender-threat-intelligence.md)
- [Threat intelligence - TAXII](data-connectors/threat-intelligence-taxii.md)
- [Threat Intelligence Platforms](data-connectors/threat-intelligence-platforms.md)
- [Threat Intelligence Upload Indicators API (Preview)](data-connectors/threat-intelligence-upload-api.md)
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

- [Exchange Security Insights Online Collector (using Azure Functions)](data-connectors/exchange-security-insights-online-collector.md)
- [Exchange Security Insights On-Premises Collector](data-connectors/exchange-security-insights-on-premises-collector.md)
- [IIS Logs of Microsoft Exchange Servers](data-connectors/iis-logs-of-microsoft-exchange-servers.md)
- [Microsoft Active-Directory Domain Controllers Security Event Logs](data-connectors/microsoft-active-directory-domain-controllers-security-event-logs.md)
- [Microsoft Exchange Admin Audit Logs by Event Logs](data-connectors/microsoft-exchange-admin-audit-logs-by-event-logs.md)
- [Microsoft Exchange HTTP Proxy Logs](data-connectors/microsoft-exchange-http-proxy-logs.md)
- [Microsoft Exchange Logs and Events](data-connectors/microsoft-exchange-logs-and-events.md)
- [Microsoft Exchange Message Tracking Logs](data-connectors/microsoft-exchange-message-tracking-logs.md)
- [Forcepoint DLP](data-connectors/forcepoint-dlp.md)
- [MISP2Sentinel](data-connectors/misp2sentinel.md)

## Mimecast North America

- [Mimecast Audit (using Azure Functions)](data-connectors/mimecast-audit.md)
- [Mimecast Awareness Training (using Azure Functions)](data-connectors/mimecast-awareness-training.md)
- [Mimecast Cloud Integrated (using Azure Functions)](data-connectors/mimecast-cloud-integrated.md)
- [Mimecast Audit & Authentication (using Azure Functions)](data-connectors/mimecast-audit-authentication.md)
- [Mimecast Secure Email Gateway (using Azure Functions)](data-connectors/mimecast-secure-email-gateway.md)
- [Mimecast Intelligence for Microsoft - Microsoft Sentinel (using Azure Functions)](data-connectors/mimecast-intelligence-for-microsoft-microsoft-sentinel.md)
- [Mimecast Targeted Threat Protection (using Azure Functions)](data-connectors/mimecast-targeted-threat-protection.md)

## MuleSoft

- [MuleSoft Cloudhub (using Azure Functions)](data-connectors/mulesoft-cloudhub.md)

## NetClean Technologies AB

- [Netclean ProActive Incidents](data-connectors/netclean-proactive-incidents.md)

## Netskope

- [Netskope (using Azure Functions)](data-connectors/netskope.md)
- [Netskope Data Connector (using Azure Functions)](data-connectors/netskope-data-connector.md)
- [Netskope Web Transactions Data Connector (using Azure Functions)](data-connectors/netskope-web-transactions-data-connector.md)

## Noname Gate, Inc.

- [Noname Security for Microsoft Sentinel](data-connectors/noname-security-for-microsoft-sentinel.md)

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

## Orca Security, Inc.

- [Orca Security Alerts](data-connectors/orca-security-alerts.md)

## Palo Alto Networks

- [Palo Alto Prisma Cloud CSPM (using Azure Functions)](data-connectors/palo-alto-prisma-cloud-cspm.md)
- [Azure CloudNGFW By Palo Alto Networks](data-connectors/azure-cloudngfw-by-palo-alto-networks.md)

## Perimeter 81

- [Perimeter 81 Activity Logs](data-connectors/perimeter-81-activity-logs.md)

## Phosphorus Cybersecurity 

- [Phosphorus Devices](data-connectors/phosphorus-devices.md)

## Prancer Enterprise

- [Prancer Data Connector](data-connectors/prancer-data-connector.md)

## Proofpoint

- [Proofpoint TAP (using Azure Functions)](data-connectors/proofpoint-tap.md)
- [Proofpoint On Demand Email Security (using Azure Functions)](data-connectors/proofpoint-on-demand-email-security.md)

## Qualys

- [Qualys Vulnerability Management (using Azure Functions)](data-connectors/qualys-vulnerability-management.md)
- [Qualys VM KnowledgeBase (using Azure Functions)](data-connectors/qualys-vm-knowledgebase.md)

## Radiflow

- [Radiflow iSID via AMA](data-connectors/radiflow-isid-via-ama.md)

## Rubrik, Inc.

- [Rubrik Security Cloud data connector (using Azure Functions)](data-connectors/rubrik-security-cloud-data-connector.md)

## SailPoint

- [SailPoint IdentityNow (using Azure Function)](data-connectors/sailpoint-identitynow.md)

## Salesforce

- [Salesforce Service Cloud (using Azure Functions)](data-connectors/salesforce-service-cloud.md)

## Secure Practice

- [MailRisk by Secure Practice (using Azure Functions)](data-connectors/mailrisk-by-secure-practice.md)

## Senserva, LLC

- [SenservaPro (Preview)](data-connectors/senservapro.md)

## SentinelOne

- [SentinelOne (using Azure Functions)](data-connectors/sentinelone.md)

## SERAPHIC ALGORITHMS LTD

- [Seraphic Web Security](data-connectors/seraphic-web-security.md)

## Siemens DI Software

- [SINEC Security Guard](data-connectors/sinec-security-guard.md)

## Silverfort Ltd.

- [Silverfort Admin Console](data-connectors/silverfort-admin-console.md)

## Slack

- [Slack Audit (using Azure Functions)](data-connectors/slack-audit.md)

## Snowflake

- [Snowflake (using Azure Functions)](data-connectors/snowflake.md)

## Sonrai Security

- [Sonrai Data Connector](data-connectors/sonrai-data-connector.md)

## Sophos

- [Sophos Endpoint Protection (using Azure Functions)](data-connectors/sophos-endpoint-protection.md)
- [Sophos Cloud Optix](data-connectors/sophos-cloud-optix.md)

## Symantec

- [Symantec Integrated Cyber Defense Exchange](data-connectors/symantec-integrated-cyber-defense-exchange.md)

## TALON CYBER SECURITY LTD

- [Talon Insights](data-connectors/talon-insights.md)

## Tenable

- [Tenable Identity Exposure](data-connectors/tenable-identity-exposure.md)
- [Tenable Vulnerability Management (using Azure Functions)](data-connectors/tenable-vulnerability-management.md)

## The Collective Consulting BV

- [LastPass Enterprise - Reporting (Polling CCP)](data-connectors/lastpass-enterprise-reporting-polling-ccp.md)

## TheHive

- [TheHive Project - TheHive (using Azure Functions)](data-connectors/thehive-project-thehive.md)

## Theom, Inc.

- [Theom](data-connectors/theom.md)

## Transmit Security LTD

- [Transmit Security Connector (using Azure Functions)](data-connectors/transmit-security-connector.md)

## Trend Micro

- [Trend Vision One (using Azure Functions)](data-connectors/trend-vision-one.md)

## Valence Security Inc.

- [SaaS Security](data-connectors/saas-security.md)

## Varonis

- [Varonis SaaS](data-connectors/varonis-saas.md)

## Vectra AI, Inc

- [Vectra XDR (using Azure Functions)](data-connectors/vectra-xdr.md)

## VMware

- [VMware Carbon Black Cloud (using Azure Functions)](data-connectors/vmware-carbon-black-cloud.md)

## WithSecure

- [WithSecure Elements API (Azure Function) (using Azure Functions)](data-connectors/withsecure-elements-api-azure.md)

## Wiz, Inc.

- [Wiz](data-connectors/wiz.md)

## ZERO NETWORKS LTD

- [Zero Networks Segment Audit](data-connectors/zero-networks-segment-audit.md)
- [Zero Networks Segment Audit (Function) (using Azure Functions)](data-connectors/zero-networks-segment-audit.md)

## Zerofox, Inc.

- [ZeroFox CTI (using Azure Functions)](data-connectors/zerofox-cti.md)
- [ZeroFox Enterprise - Alerts (Polling CCP)](data-connectors/zerofox-enterprise-alerts-polling-ccp.md)

## Zimperium, Inc.

- [Zimperium Mobile Threat Defense](data-connectors/zimperium-mobile-threat-defense.md)

## Zoom

- [Zoom Reports (using Azure Functions)](data-connectors/zoom-reports.md)

[comment]: <> (DataConnector includes end)

## Next steps

For more information, see:

- [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md)
- [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md)
