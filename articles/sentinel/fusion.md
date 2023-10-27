---
title: Advanced multistage attack detection in Microsoft Sentinel
description: Use Fusion technology in Microsoft Sentinel to reduce alert fatigue and create actionable incidents that are based on advanced multistage attack detection.
author: yelevin
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Advanced multistage attack detection in Microsoft Sentinel

> [!IMPORTANT]
> Some Fusion detections (see those so indicated below) are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Microsoft Sentinel uses Fusion, a correlation engine based on scalable machine learning algorithms, to automatically detect multistage attacks (also known as advanced persistent threats or APT) by identifying combinations of anomalous behaviors and suspicious activities that are observed at various stages of the kill chain. On the basis of these discoveries, Microsoft Sentinel generates incidents that would otherwise be difficult to catch. These incidents comprise two or more alerts or activities. By design, these incidents are low-volume, high-fidelity, and high-severity.

Customized for your environment, this detection technology not only reduces [false positive](false-positives.md) rates but can also detect attacks with limited or missing information.

Since Fusion correlates multiple signals from various products to detect advanced multistage attacks, successful Fusion detections are presented as **Fusion incidents** on the Microsoft Sentinel **Incidents** page and not as **alerts**, and are stored in the *SecurityIncident* table in **Logs** and not in the *SecurityAlert* table.

### Configure Fusion

Fusion is enabled by default in Microsoft Sentinel, as an [analytics rule](detect-threats-built-in.md) called **Advanced multistage attack detection**. You can view and change the status of the rule, configure source signals to be included in the Fusion ML model, or exclude specific detection patterns that may not be applicable to your environment from Fusion detection. Learn how to [configure the Fusion rule](configure-fusion-rules.md).

> [!NOTE]
> Microsoft Sentinel currently uses 30 days of historical data to train the Fusion engine's machine learning algorithms. This data is always encrypted using Microsoft’s keys as it passes through the machine learning pipeline. However, the training data is not encrypted using [Customer-Managed Keys (CMK)](customer-managed-keys.md) if you enabled CMK in your Microsoft Sentinel workspace. To opt out of Fusion, navigate to **Microsoft Sentinel** \> **Configuration** \> **Analytics \> Active rules**, right-click on the **Advanced Multistage Attack Detection** rule, and select **Disable.**

## Fusion for emerging threats

> [!IMPORTANT]
>
> - Fusion-based detection for emerging threats is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The volume of security events continues to grow, and the scope and sophistication of attacks are ever increasing. We can define the known attack scenarios, but how about the emerging and unknown threats in your environment?  

Microsoft Sentinel's ML-powered Fusion engine can help you find the **emerging and unknown threats** in your environment by applying **extended ML analysis** and by correlating **a broader scope of anomalous signals**, while keeping the alert fatigue low.

The Fusion engine's ML algorithms constantly learn from existing attacks and apply analysis based on how security analysts think. It can therefore discover previously undetected threats from millions of anomalous behaviors across the kill-chain throughout your environment, which helps you stay one step ahead of the attackers.

**Fusion for emerging threats** supports data collection and analysis from the following sources:

- [Out-of-the-box anomaly detections](soc-ml-anomalies.md)
- Alerts from Microsoft products:
  - Microsoft Entra ID Protection
  - Microsoft Defender for Cloud
  - Microsoft Defender for IoT
  - Microsoft 365 Defender
  - Microsoft Defender for Cloud Apps
  - Microsoft Defender for Endpoint
  - Microsoft Defender for Identity
  - Microsoft Defender for Office 365
- [**Alerts from scheduled analytics rules**](configure-fusion-rules.md#configure-scheduled-analytics-rules-for-fusion-detections), both [built-in](detect-threats-built-in.md#scheduled) and those [created by your security analysts](detect-threats-custom.md). Analytics rules must contain kill-chain (tactics) and entity mapping information in order to be used by Fusion.

You don’t need to have connected *all* the data sources listed above in order to make Fusion for emerging threats work. However, the more data sources you have connected, the broader the coverage, and the more threats Fusion will find.

When the Fusion engine's correlations result in the detection of an emerging threat, a high-severity incident titled “**Possible multistage attack activities detected by Fusion**” is generated in the *incidents* table in your Microsoft Sentinel workspace.

## Fusion for ransomware

Microsoft Sentinel's Fusion engine generates an incident when it detects multiple alerts of different types from the following data sources, and determines that they may be related to ransomware activity:

- [Microsoft Defender for Cloud](connect-defender-for-cloud.md)
- [Microsoft Defender for Endpoint](./data-connectors/microsoft-defender-for-endpoint.md)
- [Microsoft Defender for Identity connector](./data-connectors/microsoft-defender-for-identity.md)
- [Microsoft Defender for Cloud Apps](./data-connectors/microsoft-defender-for-cloud-apps.md)
- [Microsoft Sentinel scheduled analytics rules](detect-threats-built-in.md#scheduled). Fusion only considers scheduled analytics rules with tactics information and mapped entities.

Such Fusion incidents are named **Multiple alerts possibly related to Ransomware activity detected**, and are generated when relevant alerts are detected during a specific time-frame and are associated with the **Execution** and **Defense Evasion** stages of an attack.

For example, Microsoft Sentinel would generate an incident for possible ransomware activities if the following alerts are triggered on the same host within a specific timeframe:

| Alert | Source | Severity |
| ----- | ------ | -------- |
| **Windows Error and Warning Events** | Microsoft Sentinel scheduled analytics rules | informational |
| **'GandCrab' ransomware was prevented** | Microsoft Defender for Cloud | medium |
| **'Emotet' malware was detected** | Microsoft Defender for Endpoint | informational |
| **'Tofsee' backdoor was detected** | Microsoft Defender for Cloud | low |
| **'Parite' malware was detected** | Microsoft Defender for Endpoint | informational |

## Scenario-based Fusion detections

The following section lists the types of [scenario-based multistage attacks](fusion-scenario-reference.md), grouped by threat classification, that Microsoft Sentinel detects using the Fusion correlation engine.

In order to enable these Fusion-powered attack detection scenarios, their associated data sources must be ingested to your Log Analytics workspace. Select the links in the table below to learn about each scenario and its associated data sources.

> [!NOTE]
> Some of these scenarios are in **PREVIEW**. They will be so indicated.

| Threat classification  | Scenarios  |
| -------- | -------- |
| **Compute resource abuse**      | <ul><li>(PREVIEW) [Multiple VM creation activities *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#multiple-vm-creation-activities-following-suspicious-azure-active-directory-sign-in) |
| **Credential access**           | <ul><li>(PREVIEW) [Multiple passwords reset by user *following* suspicious sign-in](fusion-scenario-reference.md#multiple-passwords-reset-by-user-following-suspicious-sign-in) <li>(PREVIEW) [Suspicious sign-in *coinciding with* successful sign-in to Palo Alto VPN  <br>by IP with multiple failed Microsoft Entra sign-ins](fusion-scenario-reference.md#suspicious-sign-in-coinciding-with-successful-sign-in-to-palo-alto-vpn-by-ip-with-multiple-failed-azure-ad-sign-ins) |
| **Credential harvesting**       | <ul><li>[Malicious credential theft tool execution *following* suspicious sign-in](fusion-scenario-reference.md#malicious-credential-theft-tool-execution-following-suspicious-sign-in)    <li>[Suspected credential theft activity *following* suspicious sign-in](fusion-scenario-reference.md#suspected-credential-theft-activity-following-suspicious-sign-in)      |
| **Crypto-mining**               | <ul><li>[Crypto-mining activity *following* suspicious sign-in](fusion-scenario-reference.md#crypto-mining-activity-following-suspicious-sign-in)          |
| **Data destruction**            | <ul><li>[Mass file deletion *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#mass-file-deletion-following-suspicious-azure-ad-sign-in)     <li>(PREVIEW) [Mass file deletion *following* successful Microsoft Entra sign-in from <br>IP blocked by a Cisco firewall appliance](fusion-scenario-reference.md#mass-file-deletion-following-successful-azure-ad-sign-in-from-ip-blocked-by-a-cisco-firewall-appliance)        <li>(PREVIEW) [Mass file deletion *following* successful sign-in to Palo Alto VPN  <br>by IP with multiple failed Microsoft Entra sign-ins](fusion-scenario-reference.md#mass-file-deletion-following-successful-sign-in-to-palo-alto-vpn-by-ip-with-multiple-failed-azure-ad-sign-ins)        <li>(PREVIEW) [Suspicious email deletion activity *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#suspicious-email-deletion-activity-following-suspicious-azure-ad-sign-in) |
| **Data exfiltration**           | <ul><li>(PREVIEW) [Mail forwarding activities *following* new admin-account activity not seen recently](fusion-scenario-reference.md#mail-forwarding-activities-following-new-admin-account-activity-not-seen-recently)      <li>[Mass file download *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#mass-file-download-following-suspicious-azure-ad-sign-in)       <li>(PREVIEW) [Mass file download *following* successful Microsoft Entra sign-in from <br>IP blocked by a Cisco firewall appliance](fusion-scenario-reference.md#mass-file-download-following-successful-azure-ad-sign-in-from-ip-blocked-by-a-cisco-firewall-appliance)       <li>(PREVIEW) [Mass file download *coinciding with* SharePoint file operation from previously unseen IP](fusion-scenario-reference.md#mass-file-download-coinciding-with-sharepoint-file-operation-from-previously-unseen-ip)        <li>[Mass file sharing *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#mass-file-sharing-following-suspicious-azure-ad-sign-in)         <li>(PREVIEW) [Multiple Power BI report sharing activities *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#multiple-power-bi-report-sharing-activities-following-suspicious-azure-ad-sign-in)         <li>[Office 365 mailbox exfiltration *following* a suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#office-365-mailbox-exfiltration-following-a-suspicious-azure-ad-sign-in)        <li>(PREVIEW) [SharePoint file operation from previously unseen IP *following* malware detection](fusion-scenario-reference.md#sharepoint-file-operation-from-previously-unseen-ip-following-malware-detection)         <li>(PREVIEW) [Suspicious inbox manipulation rules set *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#suspicious-inbox-manipulation-rules-set-following-suspicious-azure-ad-sign-in)        <li>(PREVIEW) [Suspicious Power BI report sharing *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#suspicious-power-bi-report-sharing-following-suspicious-azure-ad-sign-in)  |
| **Denial of service**           | <ul><li>(PREVIEW) [Multiple VM deletion activities *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#multiple-vm-deletion-activities-following-suspicious-azure-ad-sign-in)          |
| **Lateral movement**            | <ul><li>[Office 365 impersonation *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#office-365-impersonation-following-suspicious-azure-ad-sign-in)      <li>(PREVIEW) [Suspicious inbox manipulation rules set *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#suspicious-inbox-manipulation-rules-set-following-suspicious-azure-ad-sign-in)        |
| **Malicious administrative activity**     | <ul><li>[Suspicious cloud app administrative activity *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#suspicious-cloud-app-administrative-activity-following-suspicious-azure-ad-sign-in)    <li>(PREVIEW) [Mail forwarding activities *following* new admin-account activity not seen recently](fusion-scenario-reference.md#mail-forwarding-activities-following-new-admin-account-activity-not-seen-recently-1)          |
| **Malicious execution <br>with legitimate process**    | <ul><li>(PREVIEW) [PowerShell made a suspicious network connection, *followed by* <br>anomalous traffic flagged by Palo Alto Networks firewall](fusion-scenario-reference.md#powershell-made-a-suspicious-network-connection-followed-by-anomalous-traffic-flagged-by-palo-alto-networks-firewall)   <li>(PREVIEW) [Suspicious remote WMI execution *followed by* <br>anomalous traffic flagged by Palo Alto Networks firewall](fusion-scenario-reference.md#suspicious-remote-wmi-execution-followed-by-anomalous-traffic-flagged-by-palo-alto-networks-firewall)   <li>[Suspicious PowerShell command line *following* suspicious sign-in](fusion-scenario-reference.md#suspicious-powershell-command-line-following-suspicious-sign-in)          |
| **Malware C2 or download**      | <ul><li>(PREVIEW) [Beacon pattern detected by Fortinet following multiple failed user sign-ins to a service](fusion-scenario-reference.md#beacon-pattern-detected-by-fortinet-following-multiple-failed-user-sign-ins-to-a-service)     <li>(PREVIEW) [Beacon pattern detected by Fortinet *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#beacon-pattern-detected-by-fortinet-following-suspicious-azure-ad-sign-in)       <li>(PREVIEW) [Network request to TOR anonymization service *followed by* <br>anomalous traffic flagged by Palo Alto Networks firewall](fusion-scenario-reference.md#network-request-to-tor-anonymization-service-followed-by-anomalous-traffic-flagged-by-palo-alto-networks-firewall)       <li>(PREVIEW) [Outbound connection to IP with a history of unauthorized access attempts *followed by* <br>anomalous traffic flagged by Palo Alto Networks firewall](fusion-scenario-reference.md#outbound-connection-to-ip-with-a-history-of-unauthorized-access-attempts-followed-by-anomalous-traffic-flagged-by-palo-alto-networks-firewall)    |
| **Persistence**                 | <ul><li>(PREVIEW) [Rare application consent *following* suspicious sign-in](fusion-scenario-reference.md#rare-application-consent-following-suspicious-sign-in)         |
| **Ransomware**                  | <ul><li>[Ransomware execution *following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#ransomware-execution-following-suspicious-azure-ad-sign-in)          |
| **Remote exploitation**         | <ul><li>(PREVIEW) [Suspected use of attack framework *followed by* <br>anomalous traffic flagged by Palo Alto Networks firewall](fusion-scenario-reference.md#suspected-use-of-attack-framework-followed-by-anomalous-traffic-flagged-by-palo-alto-networks-firewall)          |
| **Resource hijacking**          | <ul><li>(PREVIEW) [Suspicious resource / resource group deployment by a previously unseen caller <br>*following* suspicious Microsoft Entra sign-in](fusion-scenario-reference.md#suspicious-resource--resource-group-deployment-by-a-previously-unseen-caller-following-suspicious-azure-ad-sign-in)          |
|

## Next steps

Get more information about Fusion advanced multistage attack detection:

- Learn more about the [Fusion scenario-based attack detections](fusion-scenario-reference.md).
- Learn how to [configure the Fusion rules](configure-fusion-rules.md).

Now you've learned more about advanced multistage attack detection, you might be interested in the following quickstart to learn how to get visibility into your data and potential threats: [Get started with Microsoft Sentinel](get-visibility.md).

If you're ready to investigate the incidents that are created for you, see the following tutorial: [Investigate incidents with Microsoft Sentinel](investigate-cases.md).
