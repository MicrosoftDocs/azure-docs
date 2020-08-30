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
> Some Fusion features in Azure Sentinel are currently in public preview.
> These features are provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

By using Fusion technology based on machine learning, Azure Sentinel can automatically detect multistage attacks by identifying combinations of anomalous behaviors and suspicious activities that are observed at various stages of the kill-chain. On the basis of these discoveries, Azure Sentinel generates incidents that would otherwise be very difficult to catch. These incidents are comprised of two or more alerts or activities. By design, these incidents are low volume, high fidelity, and high severity.

Customized for your environment, this detection technology not only reduces false positive rates but can also detect attacks with limited or missing information.

## Configuration for advanced multistage attack detection

This detection is enabled by default in Azure Sentinel. To check the status, or to disable it perhaps because you are using an alternative solution to create incidents based on multiple alerts, use the following instructions:

1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Azure Sentinel** > **Configuration** > **Analytics**

1. Select **Active rules** and locate **Advanced Multistage Attack Detection** in the **NAME** column. Check the **STATUS** column to confirm whether this detection is enabled or disabled.

1. To change the status, select this entry and on the **Advanced Multistage Attack Detection** blade, select **Edit**.

1. On the **Rule creation wizard** blade, the change of status is automatically selected for you, so select **Next: Review**, and then **Save**. 

Rule templates are not applicable for the advanced multistage attack detection.

> [!NOTE]
> Azure Sentinel currently uses 30 days of historical data to train the machine learning systems. This data is always encrypted using Microsoft’s keys as it passes through the machine learning pipeline. However, the training data is not encrypted using [Customer Managed Keys (CMK)](customer-managed-keys.md) if you enabled CMK in your Azure Sentinel workspace. To opt out of Fusion, navigate to **Azure Sentinel** \> **Configuration** \> **Analytics \> Active rules \> Advanced Multistage Attack Detection** and in the **Status** column, select **Disable.**

The following section lists the types of correlation scenarios that Azure Sentinel looks for using Fusion technology. They are grouped by the types of attacks, and their stages within the kill chain, that are indicated by the malicious activities identified.

> [!NOTE]
> Some of these scenarios are in public preview. They will be so indicated.

## Compute Resource Abuse

### Multiple VM Creation Activities following Suspicious AAD Sign-in (Preview)

**MITRE ATT&CK Tactics:** Initial Access, Impact 

**MITRE ATT&CK Techniques:** Valid Account (T1078), Resource Hijacking (T1496)

**Data Connector Sources\*:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Alerts of this type indicate that an anomalous number of VMs were created in a single session following a suspicious sign-in to an AAD account. This provides a higher confidence indication that the account noted in the alert description has been compromised and attempted to create new VMs for unauthorized purposes, such as running crypto mining operations. The permutations of suspicious AAD sign-in alerts with the multiple VM creation activities alert are:

- **Impossible travel to atypical locations leading to multiple VM creation activities**

- **Sign-in event from an unfamiliar location leading to multiple VM creation activities**

- **Sign-in event from an infected device leading to multiple VM creation activities**

- **Sign-in event from an anonymous IP address leading to multiple VM creation activities**

- **Sign-in event from user with leaked credentials leading to multiple VM creation activities rule**

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors to be able to enable these Fusion detection scenarios. 

## Data Exfiltration

### Office 365 Mailbox Exfiltration following a Suspicious AAD Sign-in

**MITRE ATT&CK Tactics:** Initial Access, Exfiltration, Collection

**MITRE ATT&CK Techniques:** Valid Account (T1078), E-mail collection (T1114), Automated Exfiltration (T1020)

**Description:** Fusion incidents of this type indicate that a suspicious inbox forwarding rule was set on a user's inbox following a suspicious sign-in to an AAD account. This provides a high-confidence indication that the user's account (noted in the Fusion incident description) has been compromised, and that it was used to exfiltrate data from your organization's network by enabling a mailbox forwarding rule without the true user's knowledge. The permutations of suspicious AAD sign-in alerts with the Office 365 mailbox exfiltration alert are:

- **Impossible travel to atypical locations leading to Office 365 mailbox exfiltration**

- **Sign-in event from an unfamiliar location leading to Office 365 mailbox exfiltration**

- **Sign-in event from an infected device leading to Office 365 mailbox exfiltration**

- **Sign-in event from an anonymous IP address leading to Office 365 mailbox exfiltration**

- **Sign-in event from user with leaked credentials leading to Office 365 mailbox exfiltration**

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors for these Fusion detection scenarios to be enabled.

### Mass File Download following Suspicious AAD Sign-in

**MITRE ATT&CK Tactics:** Initial Access, Exfiltration

**MITRE ATT&CK Techniques:** Valid Account (T1078)

**Data Connector Sources\*:** MCAS alerts, AAD IP Alerts

**Description:** Alerts of this type indicate an anomalous number of files were downloaded by a user following a suspicious sign-in to an AAD account. This provides a high-confidence indication that the account noted in the alert description has been compromised and was used to exfiltrate data from your organization’s network. The permutations of suspicious AAD sign-in alerts with the Mass File Download alert are:  

- **Impossible travel to atypical locations leading to mass file download**

- **Sign-in event from an unfamiliar location leading to mass file download**

- **Sign-in event from an infected device leading to mass file download**

- **Sign-in event from an anonymous IP leading to mass file download**

- **Sign-in event from user with leaked credentials leading to mass file download**

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors for these Fusion detection scenarios to be enabled. 

### Mass File Sharing following Suspicious AAD Sign-in

**MITRE ATT&CK Tactics:** Initial Access, Exfiltration

**MITRE ATT&CK Techniques:** Valid Account (T1078), Exfiltration Over Web Service (T1567)

**Data Connector Sources\*:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Alerts of this type indicate that number of files above a particular threshold were shared to others following a suspicious sign-in to an AAD account. This provides a higher confidence indication that the account noted in the alert description has been compromised and was used to exfiltrate data from your organizations network by sharing files such as documents, spreadsheets, etc. with unauthorized users for malicious purposes. The permutations of suspicious AAD sign-in alerts with the mass file sharing alert are:  

- **Impossible travel to atypical locations leading to mass file sharing**

- **Sign-in event from an unfamiliar location leading to mass file sharing**

- **Sign-in event from an infected device leading to mass file sharing**

- **Sign-in event from an anonymous IP address leading to mass file sharing**

- **Sign-in event from user with leaked credentials leading to mass file sharing**

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors for these Fusion detection scenarios to be enabled.
   
### Suspicious Inbox Manipulation Rules Set following Suspicious AAD Sign-in

**MITRE ATT&CK Tactics:** Initial Access, Lateral Movement, Exfiltration

**MITRE ATT&CK Techniques:** Valid Account (T1078), Internal Spearphishing (T1534)

**Data Connector Sources\*:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Alerts of this type indicate that anomalous inbox rules were set on a user's inbox following a suspicious sign-in to an AAD account. This provides a high-confidence indication that the account noted in the alert description has been compromised and was used to manipulate the user’s e-mail inbox rules for malicious purposes. This is likely an attempt by an attacker to either exfiltrate data or move laterally by gaining access to additional user and/or privileged accounts by enabling phishing e-mails to be sent from within the target organizations subscription, bypassing phishing detection mechanisms used for e-mail originating from external sources. The permutations of suspicious AAD sign-in alerts with the suspicious inbox manipulation rules alert are:  

- **Impossible travel to atypical locations leading to suspicious inbox manipulation rule**

- **Sign-in event from an unfamiliar location leading to suspicious inbox manipulation rule**

- **Sign-in event from an infected device leading to suspicious inbox manipulation rule**

- **Sign-in event from an anonymous IP address leading to suspicious inbox manipulation rule**

- **Sign-in event from user with leaked credentials leading to suspicious inbox manipulation rule**

This scenario is currently in public preview.

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors to be able to enable these Fusion detection scenarios. 

### Multiple Power BI Report Sharing Activities following Suspicious AAD Sign-in 

**MITRE ATT&CK Tactics:** Initial Access, Exfiltration 

**MITRE ATT&CK Techniques:** Valid Account (T1078), Exfiltration Over Web Service (T1567)

**Data Connector Sources\*:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Alerts of this type indicate that an anomalous number of Power BI reports were shared in a single session following a suspicious sign-in to an AAD account. This provides a higher confidence indication that the account noted in the alert description has been compromised and was used to exfiltrate data from your organizations network by sharing Power BI reports with unauthorized users for malicious purposes. The permutations of suspicious AAD sign-in alerts with the multiple Power BI report sharing activities are:  

- **Impossible travel to atypical locations leading to multiple Power BI report sharing activities**

- **Sign-in event from an unfamiliar location leading to multiple Power BI report sharing activities**

- **Sign-in event from an infected device leading to multiple Power BI report sharing activities**

- **Sign-in event from an anonymous IP address leading to multiple Power BI report sharing activities**

- **Sign-in event from user with leaked credentials leading to multiple Power BI report sharing activities**

This scenario is currently in public preview.

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors to be able to enable these Fusion detection scenarios. 

### Suspicious Power BI Report Sharing following Suspicious AAD Sign-in

**MITRE ATT&CK Tactics:** Initial Access, Exfiltration 

**MITRE ATT&CK Techniques:** Valid Account (T1078), Exfiltration Over Web Service (T1567)

**Data Connector Sources\*:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Alerts of this type indicate that a suspicious Power BI report sharing activity occurred following a suspicious sign-in to an AAD account. The Power BI report sharing was identified as suspicious due to it containing sensitive information identified using Natural language processing, and was shared with an external email address, published to the web, or a snapshot was delivered to an externally subscribed email address. This provides a high-confidence indication that the account noted in the alert description has been compromised and was used to exfiltrate sensitive data from your organization by sharing Power BI reports with unauthorized users for malicious purposes. The permutations of suspicious AAD sign-in alerts with the suspicious Power BI report sharing are:  

- **Impossible travel to atypical locations leading to suspicious Power BI report sharing**

- **Sign-in event from an unfamiliar location leading to suspicious Power BI report sharing**

- **Sign-in event from an infected device leading to suspicious Power BI report sharing**

- **Sign-in event from an anonymous IP address leading to suspicious Power BI report sharing**

- **Sign-in event from user with leaked credentials leading to suspicious Power BI report sharing**

This scenario is currently in public preview.

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors to be able to enable these Fusion detection scenarios. 

## Data Destruction

### Mass File Deletion following Suspicious AAD Sign-in

**MITRE ATT&CK Tactics:** Initial Access, Impact

**MITRE ATT&CK Techniques:** Valid Account (T1078), Data Destruction (T1485)

**Data Connector Sources\*:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Alerts of this type indicate that an anomalous number of unique files were deleted following a suspicious sign-in to the same AAD account. This provides an indication that the account noted in the alert description may have been compromised and was used to destroy data for malicious purposes. The permutations of suspicious AAD sign-in alerts with the mass file deletion alert are:  

- **Impossible travel to atypical locations leading to mass file deletion**

- **Sign-in event from an unfamiliar location locations leading to mass file deletion**

- **Sign-in event from an infected device locations leading to mass file deletion**

- **Sign-in event from an anonymous IP address locations leading to mass file deletion**

- **Sign-in event from user with leaked credentials locations leading to mass file deletion**

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors for these Fusion detection scenarios to be enabled. 

### Suspicious E-mail Deletion Activity following Suspicious AAD Sign-in

**MITRE ATT&CK Tactics:** Initial Access, Impact 

**MITRE ATT&CK Techniques:** Valid Account (T1078), Data Destruction (T1485)

**Data Connector Sources\*:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Alerts of this type indicate that an anomalous number of e-mails deleted in a single session following a suspicious sign-in to the same AAD account. This provides an indication that the account noted in the alert description may have been compromised and was used to destroy data for malicious purposes, such as harming the organization or hiding spam-related e-mail activity. 

The permutations of suspicious AAD sign-in alerts with the suspicious e-mail deletion activity alert are:   
The permutations of suspicious AAD sign-in alerts with the Office 365 mailbox exfiltration alert are:  

- **Impossible travel to atypical locations leading to suspicious e-mail deletion activity**

- **Sign-in event from an unfamiliar location leading to suspicious e-mail deletion activity**

- **Sign-in event from an infected device leading to suspicious e-mail deletion activity**

- **Sign-in event from an anonymous IP address leading to suspicious e-mail deletion activity**

- **Sign-in event from user with leaked credentials leading to suspicious e-mail deletion activity**

This scenario is currently in public preview.

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors to be able to enable these Fusion detection scenarios. 

## Denial of Service

### Multiple VM Delete Activities following Suspicious AAD Sign-in

**MITRE ATT&CK Tactics:** Initial Access, Impact

**MITRE ATT&CK Techniques:** Valid Account (T1078), Endpoint Denial of Service (T1499)

**Data Connector Sources\*:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Alerts of this type indicate that An anomalous number of VMs were deleted in a single session following a suspicious sign-in to an AAD account. This provides a higher confidence indication that the account noted in the alert description has been compromised and was used to attempt to disrupt or destroy an organizations cloud environment. The permutations of suspicious AAD sign-in alerts with the multiple VM delete activities alert are:  

- **Impossible travel to atypical locations leading to multiple VM delete activities**

- **Sign-in event from an unfamiliar location leading to multiple VM delete activities**

- **Sign-in event from an infected device leading to multiple VM delete activities**

- **Sign-in event from an anonymous IP address leading to multiple VM delete activities**

- **Sign-in event from user with leaked credentials leading to multiple VM delete activities**

This scenario is currently in public preview.

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors to be able to enable these Fusion detection scenarios. 

## Lateral Movement

### Office 365 Impersonation following Suspicious AAD Sign-in

**MITRE ATT&CK Tactics:** Initial Access, Lateral Movement

**MITRE ATT&CK Techniques:** Valid Account (T1078), Internal Spearphishing (T1534)

**Data Connector Sources\*:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Alerts of this type indicate that an anomalous number of impersonation actions occurred following a suspicious sign-in from an AAD account. In some software there are options to allow other users to impersonate other users. For example, email services allow users to authorize other users to send email on their behalf. This alert provides a higher confidence that the account noted in the alert description has been compromised and was used to conduct impersonation activities for malicious purposes, such as sending phishing e-mails for malware distribution or lateral movement. The permutations of suspicious AAD sign-in alerts with the Office 365 impersonation alert are:  

- **Impossible travel to atypical locations leading to Office 365 impersonation**

- **Sign-in event from an unfamiliar location leading to Office 365 impersonation**

- **Sign-in event from an infected device leading to Office 365 impersonation**

- **Sign-in event from an anonymous IP address leading to Office 365 impersonation**

- **Sign-in event from user with leaked credentials leading to Office 365 impersonation**

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors for these Fusion detection scenarios to be enabled. 
 
### Suspicious Inbox Manipulation Rules Set following Suspicious AAD Sign-in
Threat Classification: Lateral Movement, Data Exfiltration

**MITRE ATT&CK Tactics:** Initial Access, Lateral Movement, Exfiltration

**MITRE ATT&CK Techniques:** Valid Account (T1078), Internal Spearphishing (T1534), Automated Exfiltration (T1020)

**Data Connector Sources\*:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Alerts of this type indicate that anomalous inbox rules were set on a user's inbox following a suspicious sign-in to an AAD account. This provides a high-confidence indication that the account noted in the alert description has been compromised and was used to manipulate the user’s e-mail inbox rules for malicious purposes. This is likely an attempt by an attacker to either exfiltrate data or move laterally by gaining access to additional user and/or privileged accounts by enabling phishing e-mails to be sent from within the target organizations subscription, bypassing phishing detection mechanisms used for e-mail originating from external sources. The permutations of suspicious AAD sign-in alerts with the suspicious inbox manipulation rules alert are:  

- **Impossible travel to atypical locations leading to suspicious inbox manipulation rule**

- **Sign-in event from an unfamiliar location leading to suspicious inbox manipulation rule**

- **Sign-in event from an infected device leading to suspicious inbox manipulation rule**

- **Sign-in event from an anonymous IP address leading to suspicious inbox manipulation rule**

- **Sign-in event from user with leaked credentials leading to suspicious inbox manipulation rule**

This scenario is currently in public preview.

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors to be able to enable these Fusion detection scenarios. 

## Malicious Administrative Activity

### Suspicious cloud app administrative activity following Suspicious AAD Sign-in

**MITRE ATT&CK Tactics:** Initial Access, Persistence, Defense Evasion, Lateral Movement, Collection, Exfiltration, and Impact

**MITRE ATT&CK Techniques:** N/A

**Data Connector Sources\*:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Alerts of this type indicate that an anomalous amount of administrative activities were performed in a single session following a suspicious AAD sign-in from the same account. This provides an indication that the account noted in the alert description may have been compromised and was used to make any number of a broad set of unauthorized administrative actions with malicious intent. This also indicates that an account with administrative privileges may been compromised. The permutations of suspicious AAD sign-in alerts with the suspicious cloud app administrative activity alert are:  

- **Impossible travel to atypical locations leading to suspicious cloud app administrative activity**

- **Sign-in event from an unfamiliar location leading to suspicious cloud app administrative activity**

- **Sign-in event from an infected device leading to suspicious cloud app administrative activity**

- **Sign-in event from an anonymous IP address leading to suspicious cloud app administrative activity**

- **Sign-in event from user with leaked credentials leading to suspicious cloud app administrative activity**

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors for these Fusion detection scenarios to be enabled. 

## Malicious Execution with Legitimate Process

### PowerShell made a suspicious network connection followed by anomalous traffic flagged by Palo Alto Networks firewall.

**MITRE ATT&CK Tactics:** Execution

**MITRE ATT&CK Techniques:** Command and Scripting Interpreter (T1059)

**Data Connector Sources\*:** Microsoft Defender Advanced Threat Protection, Palo Alto Networks 

**Description:** Fusion incidents of this type indicate that an outbound connection request was made via a PowerShell command followed by anomalous inbound activity detected by the Palo Alto Networks Firewall. This provides an indication that an attacker has likely gained access to your network and it trying to perform malicious actions. Connection attempts by PowerShell following this pattern could be an indication of malware command and control activity, requests for the download of additional malware, or an attacker establishing remote interactive access. As with all “living off the land” attacks, this activity could be a legitimate use of PowerShell. However, the PowerShell command execution followed by suspicious inbound Firewall activity increases the confidence that PowerShell is being used in a malicious manner and should be investigated further. In Palo Alto logs, Azure Sentinel focuses on threat logs, and traffic is considered suspicious when threats are allowed (suspicious data, files, floods, packets, scans, spyware, URLs, viruses, vulnerabilities, wildfire-viruses, wildfires). Also reference the Palo Alto Threat Log corresponding to the Threat/Content Type listed in the Fusion incident description for additional alert details.

This scenario is currently in public preview.

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors for these Fusion detection scenarios to be enabled. 

### Suspicious remote WMI execution followed by anomalous traffic flagged by Palo Alto Networks firewall

**MITRE ATT&CK Tactics:** Execution, Discovery

**MITRE ATT&CK Techniques:** Windows Management Instrumentation (T1047)

**Data Connector Sources\*:** Microsoft Defender Advanced Threat Protection, Palo Alto Networks 

**Description:** Fusion incidents of this type indicate that Windows Management Interface (WMI) commands were remotely executed on a system followed by suspicious inbound activity detected by the Palo Alto Networks Firewall. This provides an indication that an attacker may have gained access to your network and is attempting to move laterally, escalate privileges, and/or execute malicious payloads. As with all “living off the land” attacks, this activity could be a legitimate use of WMI. However, the remote WMI command execution followed by suspicious inbound Firewall activity increases the confidence that WMI is being used in a malicious manner and should be investigated further. In Palo Alto logs, Azure Sentinel focuses on threat logs, and traffic is considered suspicious when threats are allowed (suspicious data, files, floods, packets, scans, spyware, URLs, viruses, vulnerabilities, wildfire-viruses, wildfires). Also reference the Palo Alto Threat Log corresponding to the Threat/Content Type listed in the Fusion incident description for additional alert details.

This scenario is currently in public preview.

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors for these Fusion detection scenarios to be enabled. 

## Malware C2 or Download

### Network request to TOR anonymization service followed by anomalous traffic flagged by Palo Alto Networks firewall.

**MITRE ATT&CK Tactics:** Command and Control

**MITRE ATT&CK Techniques:** Encrypted Channel (T1573), Proxy (T1090)

**Data Connector Sources\*:** Microsoft Defender Advanced Threat Protection, Palo Alto Networks 

**Description:** Incidents of this type indicate that an outbound connection request was made to the TOR anonymization service followed by anomalous inbound activity detected by the Palo Alto Networks Firewall. This provides an indication that an attacker has likely gained access to your network and is trying to conceal their actions and intent. Connections to the TOR network following this pattern could be an indication of malware command and control activity, requests for the download of additional malware, or an attacker establishing remote interactive access. In Palo Alto logs, Azure Sentinel focuses on threat logs, and traffic is considered suspicious when threats are allowed (suspicious data, files, floods, packets, scans, spyware, URLs, viruses, vulnerabilities, wildfire-viruses, wildfires). Also reference the Palo Alto Threat Log corresponding to the Threat/Content Type listed in the Fusion incident description for additional alert details.

This scenario is currently in public preview.

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors for these Fusion detection scenarios to be enabled. 

### Outbound connection to IP with a history of unauthorized access attempts followed by anomalous traffic flagged by Palo Alto Networks firewall

**MITRE ATT&CK Tactics:** Command and Control

**Data Connector Sources\*:** Microsoft Defender Advanced Threat Protection, Palo Alto Networks 

**Description:** Fusion incidents of this type indicate that an outbound connection to an IP address with a history of unauthorized access attempts was established followed by anomalous activity detected by the Palo Alto Networks Firewall. This provides an indication that an attacker has likely gained access to your network. Connection attempts following this pattern could be an indication of malware command and control activity, requests for the download of additional malware, or an attacker establishing remote interactive access. In Palo Alto logs, Azure Sentinel focuses on threat logs, and traffic is considered suspicious when threats are allowed (suspicious data, files, floods, packets, scans, spyware, URLs, viruses, vulnerabilities, wildfire-viruses, wildfires). Also reference the Palo Alto Threat Log corresponding to the Threat/Content Type listed in the Fusion incident description for additional alert details.

This scenario is currently in public preview.

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors for these Fusion detection scenarios to be enabled. 

## Ransomware

### Ransomware Execution following Suspicious AAD Sign-in

**MITRE ATT&CK Tactics:** Initial Access, Impact

**MITRE ATT&CK Techniques:** Valid Account (T1078), Data Encrypted for Impact (T1486)

**Data Connector Sources\*:** Microsoft Cloud App Security, Azure Active Directory Identity Protection

**Description:** Alerts of this type indicate that anomalous user behavior indicating a ransomware attack was detected following a suspicious sign-in to an AAD account. This provides a high-confidence indication that the account noted in the alert description has been compromised and was used to encrypt data for the purposes of extorting the data owner or denying the data owner access to their data. All permutations of suspicious AAD sign-in alerts with the ransomware execution alert are:  

- **Impossible travel to atypical locations leading to ransomware in cloud app**

- **Sign-in event from an unfamiliar location leading to ransomware in cloud app**

- **Sign-in event from an infected device leading to ransomware in cloud app**

- **Sign-in event from an anonymous IP address leading to ransomware in cloud app**

- **Sign-in event from user with leaked credentials leading to ransomware in cloud app**

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors for these Fusion detection scenarios to be enabled. 

## Remote Exploitation

### Suspected use of attack framework followed by anomalous traffic flagged by Palo Alto Networks firewall

**MITRE ATT&CK Tactics:** Initial Access, Execution, Lateral Movement, Privilege Escalation

**MITRE ATT&CK Techniques:** Exploit Public-Facing Application (T1190), Exploitation for Client Execution (T1203), Exploitation of Remote Services(T1210), Exploitation for Privilege Escalation (T1068)

**Data Connector Sources\*:** Microsoft Defender Advanced Threat Protection, Palo Alto Networks 

**Description:** Fusion incidents of this type indicate that non-standard uses of protocols, which resembles attack frameworks such as Metasploit, were detected followed by suspicious inbound activity detected by the Palo Alto Networks Firewall. This may be an initial indication that an attacker has exploited a service to gain access to your network resources or that an attacker has already gained access and is trying to further exploit available systems/services to move laterally and/or escalate privileges. In Palo Alto logs, Azure Sentinel focuses on threat logs, and traffic is considered suspicious when threats are allowed (suspicious data, files, floods, packets, scans, spyware, URLs, viruses, vulnerabilities, wildfire-viruses, wildfires). Also reference the Palo Alto Threat Log corresponding to the Threat/Content Type listed in the Fusion incident description for additional alert details.
This scenario is currently in public preview.

*All data sources listed above must be ingested via the associated Azure Sentinel Data Connectors for these Fusion detection scenarios to be enabled. 

## Next steps

Now you've learned more about advanced multistage attack detection, you might be interested in the following quickstart to learn how to get visibility into your data and potential threats: [Get started with Azure Sentinel](quickstart-get-visibility.md).

If you're ready to investigate the incidents that are created for you, see the following tutorial: [Investigate incidents with Azure Sentinel](tutorial-investigate-cases.md).

