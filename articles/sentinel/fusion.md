---
title: Advanced multistage attack detection in Azure Sentinel
description: Use Fusion technology in Azure Sentinel to reduce alert fatigue and create actionable incidents that are based on advanced multistage attack detection.
services: sentinel
documentationcenter: na
author: yelevin

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/30/2020
ms.author: yelevin

---
# Advanced multistage attack detection in Azure Sentinel

> [!IMPORTANT]
> Some Fusion detections (see those so indicated below) are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

By using Fusion technology based on machine learning, Azure Sentinel can automatically detect multistage attacks by identifying combinations of anomalous behaviors and suspicious activities that are observed at various stages of the kill-chain. On the basis of these discoveries, Azure Sentinel generates incidents that would otherwise be difficult to catch. These incidents comprise two or more alerts or activities. By design, these incidents are low-volume, high-fidelity, and high-severity.

Customized for your environment, this detection technology not only reduces false positive rates but can also detect attacks with limited or missing information.

## Configuration for advanced multistage attack detection

This detection is enabled by default in Azure Sentinel. To check the status, or to disable it in the event that you are using an alternative solution to create incidents based on multiple alerts, use the following instructions:

1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Azure Sentinel** > **Configuration** > **Analytics**

1. Select **Active rules**, and then locate **Advanced Multistage Attack Detection** in the **NAME** column by filtering the list for the **Fusion** rule type. Check the **STATUS** column to confirm whether this detection is enabled or disabled.

    :::image type="content" source="./media/fusion/selecting-fusion-rule-type.png" alt-text="{alt-text}":::

1. To change the status, select this entry and on the **Advanced Multistage Attack Detection** blade, select **Edit**.

1. On the **Rule creation wizard** blade, the change of status is automatically selected for you, so select **Next: Review**, and then **Save**. 

 Since the **Fusion** rule type contains only one rule that can't be modified, rule templates are not applicable for this rule type.

> [!NOTE]
> Azure Sentinel currently uses 30 days of historical data to train the machine learning systems. This data is always encrypted using Microsoft’s keys as it passes through the machine learning pipeline. However, the training data is not encrypted using [Customer Managed Keys (CMK)](customer-managed-keys.md) if you enabled CMK in your Azure Sentinel workspace. To opt out of Fusion, navigate to **Azure Sentinel** \> **Configuration** \> **Analytics \> Active rules \> Advanced Multistage Attack Detection** and in the **Status** column, select **Disable.**

## Attack detection scenarios

The following section lists the types of correlation scenarios, grouped by threat classification, that Azure Sentinel looks for using Fusion technology.

As mentioned above, since Fusion correlates multiple security alerts from various products to detect advanced multistage attacks, successful Fusion detections are presented as **Fusion incidents** on the Azure Sentinel **Incidents** page, and not as **alerts** in the **Security Alerts** table in **Logs**.

In order to enable these Fusion-powered attack detection scenarios, any data sources listed must be ingested using the associated Azure Sentinel data connectors.

> [!NOTE]
> Some of these scenarios are in **PREVIEW**. They will be so indicated.

## Compute resource abuse

### Multiple VM creation activities following suspicious Azure Active Directory sign-in
This scenario is currently in **PREVIEW**.

**MITRE ATT&CK tactics:** Initial Access, Impact 

**MITRE ATT&CK techniques:** Valid Account (T1078), Resource Hijacking (T1496)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that an anomalous number of VMs were created in a single session following a suspicious sign-in to an Azure AD account. This type of alert indicates, with a high degree of confidence, that the account noted in the Fusion incident description has been compromised and used to create new VMs for unauthorized purposes, such as running crypto mining operations. The permutations of suspicious Azure AD sign-in alerts with the multiple VM creation activities alert are:

- **Impossible travel to an atypical location leading to multiple VM creation activities**

- **Sign-in event from an unfamiliar location leading to multiple VM creation activities**

- **Sign-in event from an infected device leading to multiple VM creation activities**

- **Sign-in event from an anonymous IP address leading to multiple VM creation activities**

- **Sign-in event from user with leaked credentials leading to multiple VM creation activities**

## Credential harvesting (New threat classification)

### Malicious credential theft tool execution following suspicious sign-in

**MITRE ATT&CK tactics:** Initial Access, Credential Access

**MITRE ATT&CK techniques:** Valid Account (T1078), OS Credential Dumping (T1003)

**Data connector sources:** Azure Active Directory Identity Protection, Microsoft Defender for Endpoint

**Description:** Fusion incidents of this type indicate that a known credential theft tool was executed following a suspicious Azure AD sign-in. This provides a high-confidence indication that the user account noted in the alert description has been compromised and may have successfully used a tool like **Mimikatz** to harvest credentials such as keys, plaintext passwords and/or password hashes from the system. The harvested credentials may allow an attacker to access sensitive data, escalate privileges, and/or move laterally across the network. The permutations of suspicious Azure AD sign-in alerts with the malicious credential theft tool alert are:

- **Impossible travel to atypical locations leading to malicious credential theft tool execution**

- **Sign-in event from an unfamiliar location leading to malicious credential theft tool execution**

- **Sign-in event from an infected device leading to malicious credential theft tool execution**

- **Sign-in event from an anonymous IP address leading to malicious credential theft tool execution**

- **Sign-in event from user with leaked credentials leading to malicious credential theft tool execution**

### Suspected credential theft activity following suspicious sign-in

**MITRE ATT&CK tactics:** Initial Access, Credential Access

**MITRE ATT&CK techniques:** Valid Account (T1078), Credentials from Password Stores (T1555), OS Credential Dumping (T1003)

**Data connector sources:** Azure Active Directory Identity Protection, Microsoft Defender for Endpoint

**Description:** Fusion incidents of this type indicate that activity associated with patterns of credential theft occurred following a suspicious Azure AD sign-in. This provides a high-confidence indication that the user account noted in the alert description has been compromised and used to steal credentials such as keys, plain-text passwords, password hashes, and so on. The stolen credentials may allow an attacker to access sensitive data, escalate privileges, and/or move laterally across the network. The permutations of suspicious Azure AD sign-in alerts with the credential theft activity alert are:

- **Impossible travel to atypical locations leading to suspected credential theft activity**

- **Sign-in event from an unfamiliar location leading to suspected credential theft activity**

- **Sign-in event from an infected device leading to suspected credential theft activity**

- **Sign-in event from an anonymous IP address leading to suspected credential theft activity**

- **Sign-in event from user with leaked credentials leading to suspected credential theft activity**

## Crypto-mining (New threat classification)

### Crypto-mining activity following suspicious sign-in

**MITRE ATT&CK tactics:** Initial Access, Credential Access

**MITRE ATT&CK techniques:** Valid Account (T1078), Resource Hijacking (T1496)

**Data connector sources:** Azure Active Directory Identity Protection, Azure Defender (Azure Security Center)

**Description:** Fusion incidents of this type indicate crypto-mining activity associated with a suspicious sign-in to an Azure AD account. This provides a high-confidence indication that the user account noted in the alert description has been compromised and was used to hijack resources in your environment to mine crypto-currency. This can starve your resources of computing power and/or result in significantly higher-than-expected cloud usage bills. The permutations of suspicious Azure AD sign-in alerts with the crypto-mining activity alert are:  

- **Impossible travel to atypical locations leading to crypto-mining activity**

- **Sign-in event from an unfamiliar location leading to crypto-mining activity**

- **Sign-in event from an infected device leading to crypto-mining activity**

- **Sign-in event from an anonymous IP address leading to crypto-mining activity**

- **Sign-in event from user with leaked credentials leading to crypto-mining activity**

## Data exfiltration

### Office 365 mailbox exfiltration following a suspicious Azure AD sign-in

**MITRE ATT&CK tactics:** Initial Access, Exfiltration, Collection

**MITRE ATT&CK techniques:** Valid Account (T1078), E-mail collection (T1114), Automated Exfiltration (T1020)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that a suspicious inbox forwarding rule was set on a user's inbox following a suspicious sign-in to an Azure AD account. This indication provides high confidence that the user's account (noted in the Fusion incident description) has been compromised, and that it was used to exfiltrate data from your organization's network by enabling a mailbox forwarding rule without the true user's knowledge. The permutations of suspicious Azure AD sign-in alerts with the Office 365 mailbox exfiltration alert are:

- **Impossible travel to an atypical location leading to Office 365 mailbox exfiltration**

- **Sign-in event from an unfamiliar location leading to Office 365 mailbox exfiltration**

- **Sign-in event from an infected device leading to Office 365 mailbox exfiltration**

- **Sign-in event from an anonymous IP address leading to Office 365 mailbox exfiltration**

- **Sign-in event from user with leaked credentials leading to Office 365 mailbox exfiltration**

### Mass file download following suspicious Azure AD sign-in

**MITRE ATT&CK tactics:** Initial Access, Exfiltration

**MITRE ATT&CK techniques:** Valid Account (T1078)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that an anomalous number of files were downloaded by a user following a suspicious sign-in to an Azure AD account. This indication provides high confidence that the account noted in the Fusion incident description has been compromised and was used to exfiltrate data from your organization’s network. The permutations of suspicious Azure AD sign-in alerts with the mass file download alert are:  

- **Impossible travel to an atypical location leading to mass file download**

- **Sign-in event from an unfamiliar location leading to mass file download**

- **Sign-in event from an infected device leading to mass file download**

- **Sign-in event from an anonymous IP leading to mass file download**

- **Sign-in event from user with leaked credentials leading to mass file download**

### Mass file sharing following suspicious Azure AD sign-in

**MITRE ATT&CK tactics:** Initial Access, Exfiltration

**MITRE ATT&CK techniques:** Valid Account (T1078), Exfiltration Over Web Service (T1567)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that a number of files above a particular threshold were shared to others following a suspicious sign-in to an Azure AD account. This indication provides high confidence that the account noted in the Fusion incident description has been compromised and used to exfiltrate data from your organization's network by sharing files such as documents, spreadsheets, etc., with unauthorized users for malicious purposes. The permutations of suspicious Azure AD sign-in alerts with the mass file sharing alert are:  

- **Impossible travel to an atypical location leading to mass file sharing**

- **Sign-in event from an unfamiliar location leading to mass file sharing**

- **Sign-in event from an infected device leading to mass file sharing**

- **Sign-in event from an anonymous IP address leading to mass file sharing**

- **Sign-in event from user with leaked credentials leading to mass file sharing**

### Suspicious inbox manipulation rules set following suspicious Azure AD sign-in
This scenario belongs to two threat classifications in this list: **data exfiltration** and **lateral movement**. For the sake of clarity, it appears in both sections.

This scenario is currently in **PREVIEW**.

**MITRE ATT&CK tactics:** Initial Access, Lateral Movement, Exfiltration

**MITRE ATT&CK techniques:** Valid Account (T1078), Internal Spear Phishing (T1534)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that anomalous inbox rules were set on a user's inbox following a suspicious sign-in to an Azure AD account. This provides a high-confidence indication that the account noted in the Fusion incident description has been compromised and was used to manipulate the user’s email inbox rules for malicious purposes. This could possibly be an attempt by an attacker to exfiltrate data from the organization's network. Alternatively, the attacker could be trying to generate phishing emails from within the organization (bypassing phishing detection mechanisms targeted at email from external sources) for the purpose of moving laterally by gaining access to additional user and/or privileged accounts. The permutations of suspicious Azure AD sign-in alerts with the suspicious inbox manipulation rules alert are:  

- **Impossible travel to an atypical location leading to suspicious inbox manipulation rule**

- **Sign-in event from an unfamiliar location leading to suspicious inbox manipulation rule**

- **Sign-in event from an infected device leading to suspicious inbox manipulation rule**

- **Sign-in event from an anonymous IP address leading to suspicious inbox manipulation rule**

- **Sign-in event from user with leaked credentials leading to suspicious inbox manipulation rule**

### Multiple Power BI report sharing activities following suspicious Azure AD sign-in 
This scenario is currently in **PREVIEW**.

**MITRE ATT&CK tactics:** Initial Access, Exfiltration 

**MITRE ATT&CK techniques:** Valid Account (T1078), Exfiltration Over Web Service (T1567)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that an anomalous number of Power BI reports were shared in a single session following a suspicious sign-in to an Azure AD account. This indication provides high confidence that the account noted in the Fusion incident description has been compromised and was used to exfiltrate data from your organization's network by sharing Power BI reports with unauthorized users for malicious purposes. The permutations of suspicious Azure AD sign-in alerts with the multiple Power BI report sharing activities are:  

- **Impossible travel to an atypical location leading to multiple Power BI report sharing activities**

- **Sign-in event from an unfamiliar location leading to multiple Power BI report sharing activities**

- **Sign-in event from an infected device leading to multiple Power BI report sharing activities**

- **Sign-in event from an anonymous IP address leading to multiple Power BI report sharing activities**

- **Sign-in event from user with leaked credentials leading to multiple Power BI report sharing activities**

### Suspicious Power BI report sharing following suspicious Azure AD sign-in
This scenario is currently in **PREVIEW**.

**MITRE ATT&CK tactics:** Initial Access, Exfiltration 

**MITRE ATT&CK techniques:** Valid Account (T1078), Exfiltration Over Web Service (T1567)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that a suspicious Power BI report sharing activity occurred following a suspicious sign-in to an Azure AD account. The sharing activity was identified as suspicious because the Power BI report contained sensitive information identified using Natural language processing, and because it was shared with an external email address, published to the web, or delivered as a snapshot to an externally subscribed email address. This alert indicates with high confidence that the account noted in the Fusion incident description has been compromised and was used to exfiltrate sensitive data from your organization by sharing Power BI reports with unauthorized users for malicious purposes. The permutations of suspicious Azure AD sign-in alerts with the suspicious Power BI report sharing are:  

- **Impossible travel to an atypical location leading to suspicious Power BI report sharing**

- **Sign-in event from an unfamiliar location leading to suspicious Power BI report sharing**

- **Sign-in event from an infected device leading to suspicious Power BI report sharing**

- **Sign-in event from an anonymous IP address leading to suspicious Power BI report sharing**

- **Sign-in event from user with leaked credentials leading to suspicious Power BI report sharing**

## Data destruction

### Mass file deletion following suspicious Azure AD sign-in

**MITRE ATT&CK tactics:** Initial Access, Impact

**MITRE ATT&CK techniques:** Valid Account (T1078), Data Destruction (T1485)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that an anomalous number of unique files were deleted following a suspicious sign-in to an Azure AD account. This provides an indication that the account noted in the Fusion incident description may have been compromised and was used to destroy data for malicious purposes. The permutations of suspicious Azure AD sign-in alerts with the mass file deletion alert are:  

- **Impossible travel to an atypical location leading to mass file deletion**

- **Sign-in event from an unfamiliar location leading to mass file deletion**

- **Sign-in event from an infected device leading to mass file deletion**

- **Sign-in event from an anonymous IP address leading to mass file deletion**

- **Sign-in event from user with leaked credentials leading to mass file deletion**

### Suspicious email deletion activity following suspicious Azure AD sign-in
This scenario is currently in **PREVIEW**.

**MITRE ATT&CK tactics:** Initial Access, Impact 

**MITRE ATT&CK techniques:** Valid Account (T1078), Data Destruction (T1485)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that an anomalous number of emails were deleted in a single session following a suspicious sign-in to an Azure AD account. This provides an indication that the account noted in the Fusion incident description may have been compromised and was used to destroy data for malicious purposes, such as harming the organization or hiding spam-related email activity. The permutations of suspicious Azure AD sign-in alerts with the suspicious email deletion activity alert are:   

- **Impossible travel to an atypical location leading to suspicious email deletion activity**

- **Sign-in event from an unfamiliar location leading to suspicious email deletion activity**

- **Sign-in event from an infected device leading to suspicious email deletion activity**

- **Sign-in event from an anonymous IP address leading to suspicious email deletion activity**

- **Sign-in event from user with leaked credentials leading to suspicious email deletion activity**

## Denial of service

### Multiple VM delete activities following suspicious Azure AD sign-in
This scenario is currently in **PREVIEW**.

**MITRE ATT&CK tactics:** Initial Access, Impact

**MITRE ATT&CK techniques:** Valid Account (T1078), Endpoint Denial of Service (T1499)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that an anomalous number of VMs were deleted in a single session following a suspicious sign-in to an Azure AD account. This indication provides high confidence that the account noted in the Fusion incident description has been compromised and was used to attempt to disrupt or destroy the organization's cloud environment. The permutations of suspicious Azure AD sign-in alerts with the multiple VM delete activities alert are:  

- **Impossible travel to an atypical location leading to multiple VM delete activities**

- **Sign-in event from an unfamiliar location leading to multiple VM delete activities**

- **Sign-in event from an infected device leading to multiple VM delete activities**

- **Sign-in event from an anonymous IP address leading to multiple VM delete activities**

- **Sign-in event from user with leaked credentials leading to multiple VM delete activities**

## Lateral movement

### Office 365 impersonation following suspicious Azure AD sign-in

**MITRE ATT&CK tactics:** Initial Access, Lateral Movement

**MITRE ATT&CK techniques:** Valid Account (T1078), Internal Spear Phishing (T1534)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that an anomalous number of impersonation actions occurred following a suspicious sign-in from an Azure AD account. In some software, there are options to allow users to impersonate other users. For example, email services allow users to authorize other users to send email on their behalf. This alert indicates with higher confidence that the account noted in the Fusion incident description has been compromised and was used to conduct impersonation activities for malicious purposes, such as sending phishing emails for malware distribution or lateral movement. The permutations of suspicious Azure AD sign-in alerts with the Office 365 impersonation alert are:  

- **Impossible travel to an atypical location leading to Office 365 impersonation**

- **Sign-in event from an unfamiliar location leading to Office 365 impersonation**

- **Sign-in event from an infected device leading to Office 365 impersonation**

- **Sign-in event from an anonymous IP address leading to Office 365 impersonation**

- **Sign-in event from user with leaked credentials leading to Office 365 impersonation**
 
### Suspicious inbox manipulation rules set following suspicious Azure AD sign-in
This scenario belongs to two threat classifications in this list: **lateral movement** and **data exfiltration**. For the sake of clarity, it appears in both sections.

This scenario is currently in **PREVIEW**.

**MITRE ATT&CK tactics:** Initial Access, Lateral Movement, Exfiltration

**MITRE ATT&CK techniques:** Valid Account (T1078), Internal Spear Phishing (T1534), Automated Exfiltration (T1020)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that anomalous inbox rules were set on a user's inbox following a suspicious sign-in to an Azure AD account. This indication provides high confidence that the account noted in the Fusion incident description has been compromised and was used to manipulate the user’s email inbox rules for malicious purposes. This could possibly be an attempt by an attacker to exfiltrate data from the organization's network. Alternatively, the attacker could be trying to generate phishing emails from within the organization (bypassing phishing detection mechanisms targeted at email from external sources) for the purpose of moving laterally by gaining access to additional user and/or privileged accounts. The permutations of suspicious Azure AD sign-in alerts with the suspicious inbox manipulation rules alert are:

- **Impossible travel to an atypical location leading to suspicious inbox manipulation rule**

- **Sign-in event from an unfamiliar location leading to suspicious inbox manipulation rule**

- **Sign-in event from an infected device leading to suspicious inbox manipulation rule**

- **Sign-in event from an anonymous IP address leading to suspicious inbox manipulation rule**

- **Sign-in event from user with leaked credentials leading to suspicious inbox manipulation rule**

## Malicious administrative activity

### Suspicious cloud app administrative activity following suspicious Azure AD sign-in

**MITRE ATT&CK tactics:** Initial Access, Persistence, Defense Evasion, Lateral Movement, Collection, Exfiltration, and Impact

**MITRE ATT&CK techniques:** N/A

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that an anomalous number of administrative activities were performed in a single session following a suspicious Azure AD sign-in from the same account. This provides an indication that the account noted in the Fusion incident description may have been compromised and was used to make any number of unauthorized administrative actions with malicious intent. This also indicates that an account with administrative privileges may have been compromised. The permutations of suspicious Azure AD sign-in alerts with the suspicious cloud app administrative activity alert are:  

- **Impossible travel to an atypical location leading to suspicious cloud app administrative activity**

- **Sign-in event from an unfamiliar location leading to suspicious cloud app administrative activity**

- **Sign-in event from an infected device leading to suspicious cloud app administrative activity**

- **Sign-in event from an anonymous IP address leading to suspicious cloud app administrative activity**

- **Sign-in event from user with leaked credentials leading to suspicious cloud app administrative activity**

## Malicious execution with legitimate process

### PowerShell made a suspicious network connection, followed by anomalous traffic flagged by Palo Alto Networks firewall.
This scenario is currently in **PREVIEW**.

**MITRE ATT&CK tactics:** Execution

**MITRE ATT&CK techniques:** Command and Scripting Interpreter (T1059)

**Data connector sources:** Microsoft Defender for Endpoint (formerly Microsoft Defender Advanced Threat Protection, or MDATP), Palo Alto Networks 

**Description:** Fusion incidents of this type indicate that an outbound connection request was made via a PowerShell command, and following that, anomalous inbound activity was detected by the Palo Alto Networks Firewall. This provides an indication that an attacker has likely gained access to your network and is trying to perform malicious actions. Connection attempts by PowerShell that follow this pattern could be an indication of malware command and control activity, requests for the download of additional malware, or an attacker establishing remote interactive access. As with all “living off the land” attacks, this activity could be a legitimate use of PowerShell. However, the PowerShell command execution followed by suspicious inbound Firewall activity increases the confidence that PowerShell is being used in a malicious manner and should be investigated further. In Palo Alto logs, Azure Sentinel focuses on [threat logs](https://docs.paloaltonetworks.com/pan-os/8-1/pan-os-admin/monitoring/view-and-manage-logs/log-types-and-severity-levels/threat-logs), and traffic is considered suspicious when threats are allowed (suspicious data, files, floods, packets, scans, spyware, URLs, viruses, vulnerabilities, wildfire-viruses, wildfires). Also reference the Palo Alto Threat Log corresponding to the [Threat/Content Type](https://docs.paloaltonetworks.com/pan-os/8-1/pan-os-admin/monitoring/use-syslog-for-monitoring/syslog-field-descriptions/threat-log-fields.html) listed in the Fusion incident description for additional alert details.

### Suspicious remote WMI execution followed by anomalous traffic flagged by Palo Alto Networks firewall
This scenario is currently in **PREVIEW**.

**MITRE ATT&CK tactics:** Execution, Discovery

**MITRE ATT&CK techniques:** Windows Management Instrumentation (T1047)

**Data connector sources:** Microsoft Defender for Endpoint (formerly MDATP), Palo Alto Networks 

**Description:** Fusion incidents of this type indicate that Windows Management Interface (WMI) commands were remotely executed on a system, and following that, suspicious inbound activity was detected by the Palo Alto Networks Firewall. This provides an indication that an attacker may have gained access to your network and is attempting to move laterally, escalate privileges, and/or execute malicious payloads. As with all “living off the land” attacks, this activity could be a legitimate use of WMI. However, the remote WMI command execution followed by suspicious inbound Firewall activity increases the confidence that WMI is being used in a malicious manner and should be investigated further. In Palo Alto logs, Azure Sentinel focuses on [threat logs](https://docs.paloaltonetworks.com/pan-os/8-1/pan-os-admin/monitoring/view-and-manage-logs/log-types-and-severity-levels/threat-logs), and traffic is considered suspicious when threats are allowed (suspicious data, files, floods, packets, scans, spyware, URLs, viruses, vulnerabilities, wildfire-viruses, wildfires). Also reference the Palo Alto Threat Log corresponding to the [Threat/Content Type](https://docs.paloaltonetworks.com/pan-os/8-1/pan-os-admin/monitoring/use-syslog-for-monitoring/syslog-field-descriptions/threat-log-fields.html) listed in the Fusion incident description for additional alert details.

### Suspicious PowerShell command line following suspicious sign-in

**MITRE ATT&CK tactics:** Initial Access, Execution

**MITRE ATT&CK techniques:** Valid Account (T1078), Command and Scripting Interpreter (T1059)

**Data connector sources:** Azure Active Directory Identity Protection, Microsoft Defender for Endpoint (formerly MDATP)

**Description:** Fusion incidents of this type indicate that a user executed potentially malicious PowerShell commands following a suspicious sign-in to an Azure AD account. This provides a high-confidence indication that the account noted in the alert description has been compromised and further malicious actions were taken. Attackers often leverage PowerShell to execute malicious payloads in memory without leaving artifacts on the disk, in order to avoid detection by disk-based security mechanisms such as virus scanners. The permutations of suspicious Azure AD sign-in alerts with the suspicious PowerShell command alert are:

- **Impossible travel to atypical locations leading to suspicious PowerShell command line**

- **Sign-in event from an unfamiliar location leading to suspicious PowerShell command line**

- **Sign-in event from an infected device leading to suspicious PowerShell command line**

- **Sign-in event from an anonymous IP address leading to suspicious PowerShell command line**

- **Sign-in event from user with leaked credentials leading to suspicious PowerShell command line**

## Malware C2 or download

### Network request to TOR anonymization service followed by anomalous traffic flagged by Palo Alto Networks firewall.
This scenario is currently in **PREVIEW**.

**MITRE ATT&CK tactics:** Command and Control

**MITRE ATT&CK techniques:** Encrypted Channel (T1573), Proxy (T1090)

**Data connector sources:** Microsoft Defender for Endpoint (formerly MDATP), Palo Alto Networks 

**Description:** Fusion incidents of this type indicate that an outbound connection request was made to the TOR anonymization service, and following that, anomalous inbound activity was detected by the Palo Alto Networks Firewall. This provides an indication that an attacker has likely gained access to your network and is trying to conceal their actions and intent. Connections to the TOR network following this pattern could be an indication of malware command and control activity, requests for the download of additional malware, or an attacker establishing remote interactive access. In Palo Alto logs, Azure Sentinel focuses on [threat logs](https://docs.paloaltonetworks.com/pan-os/8-1/pan-os-admin/monitoring/view-and-manage-logs/log-types-and-severity-levels/threat-logs), and traffic is considered suspicious when threats are allowed (suspicious data, files, floods, packets, scans, spyware, URLs, viruses, vulnerabilities, wildfire-viruses, wildfires). Also reference the Palo Alto Threat Log corresponding to the [Threat/Content Type](https://docs.paloaltonetworks.com/pan-os/8-1/pan-os-admin/monitoring/use-syslog-for-monitoring/syslog-field-descriptions/threat-log-fields.html) listed in the Fusion incident description for additional alert details.

### Outbound connection to IP with a history of unauthorized access attempts followed by anomalous traffic flagged by Palo Alto Networks firewall
This scenario is currently in **PREVIEW**.

**MITRE ATT&CK tactics:** Command and Control

**MITRE ATT&CK techniques:** Not applicable

**Data connector sources:** Microsoft Defender for Endpoint (formerly MDATP), Palo Alto Networks 

**Description:** Fusion incidents of this type indicate that an outbound connection to an IP address with a history of unauthorized access attempts was established, and following that, anomalous activity was detected by the Palo Alto Networks Firewall. This provides an indication that an attacker has likely gained access to your network. Connection attempts following this pattern could be an indication of malware command and control activity, requests for the download of additional malware, or an attacker establishing remote interactive access. In Palo Alto logs, Azure Sentinel focuses on [threat logs](https://docs.paloaltonetworks.com/pan-os/8-1/pan-os-admin/monitoring/view-and-manage-logs/log-types-and-severity-levels/threat-logs), and traffic is considered suspicious when threats are allowed (suspicious data, files, floods, packets, scans, spyware, URLs, viruses, vulnerabilities, wildfire-viruses, wildfires). Also reference the Palo Alto Threat Log corresponding to the [Threat/Content Type](https://docs.paloaltonetworks.com/pan-os/8-1/pan-os-admin/monitoring/use-syslog-for-monitoring/syslog-field-descriptions/threat-log-fields.html) listed in the Fusion incident description for additional alert details.

## Ransomware

### Ransomware execution following suspicious Azure AD sign-in

**MITRE ATT&CK tactics:** Initial Access, Impact

**MITRE ATT&CK techniques:** Valid Account (T1078), Data Encrypted for Impact (T1486)

**Data connector sources:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Fusion incidents of this type indicate that anomalous user behavior indicating a ransomware attack was detected following a suspicious sign-in to an Azure AD account. This indication provides high confidence that the account noted in the Fusion incident description has been compromised and was used to encrypt data for the purposes of extorting the data owner or denying the data owner access to their data. The permutations of suspicious Azure AD sign-in alerts with the ransomware execution alert are:  

- **Impossible travel to an atypical location leading to ransomware in cloud app**

- **Sign-in event from an unfamiliar location leading to ransomware in cloud app**

- **Sign-in event from an infected device leading to ransomware in cloud app**

- **Sign-in event from an anonymous IP address leading to ransomware in cloud app**

- **Sign-in event from user with leaked credentials leading to ransomware in cloud app**

## Remote exploitation

### Suspected use of attack framework followed by anomalous traffic flagged by Palo Alto Networks firewall
This scenario is currently in **PREVIEW**.

**MITRE ATT&CK tactics:** Initial Access, Execution, Lateral Movement, Privilege Escalation

**MITRE ATT&CK techniques:** Exploit Public-Facing Application (T1190), Exploitation for Client Execution (T1203), Exploitation of Remote Services(T1210), Exploitation for Privilege Escalation (T1068)

**Data connector sources:** Microsoft Defender for Endpoint (formerly MDATP), Palo Alto Networks 

**Description:** Fusion incidents of this type indicate that non-standard uses of protocols, resembling the use of attack frameworks such as Metasploit, were detected, and following that, suspicious inbound activity was detected by the Palo Alto Networks Firewall. This may be an initial indication that an attacker has exploited a service to gain access to your network resources or that an attacker has already gained access and is trying to further exploit available systems/services to move laterally and/or escalate privileges. In Palo Alto logs, Azure Sentinel focuses on [threat logs](https://docs.paloaltonetworks.com/pan-os/8-1/pan-os-admin/monitoring/view-and-manage-logs/log-types-and-severity-levels/threat-logs), and traffic is considered suspicious when threats are allowed (suspicious data, files, floods, packets, scans, spyware, URLs, viruses, vulnerabilities, wildfire-viruses, wildfires). Also reference the Palo Alto Threat Log corresponding to the [Threat/Content Type](https://docs.paloaltonetworks.com/pan-os/8-1/pan-os-admin/monitoring/use-syslog-for-monitoring/syslog-field-descriptions/threat-log-fields.html) listed in the Fusion incident description for additional alert details.

## Next steps

Now you've learned more about advanced multistage attack detection, you might be interested in the following quickstart to learn how to get visibility into your data and potential threats: [Get started with Azure Sentinel](quickstart-get-visibility.md).

If you're ready to investigate the incidents that are created for you, see the following tutorial: [Investigate incidents with Azure Sentinel](tutorial-investigate-cases.md).

