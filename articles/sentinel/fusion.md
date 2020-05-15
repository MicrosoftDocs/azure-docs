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
ms.date: 02/18/2020
ms.author: yelevin

---
# Advanced multistage attack detection in Azure Sentinel


> [!IMPORTANT]
> Some Fusion features in Azure Sentinel are currently in public preview.
> These features are provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).



By using Fusion technology that’s based on machine learning, Azure Sentinel can automatically detect multistage attacks by combining anomalous behaviors and suspicious activities that are observed at various stages of the kill-chain. Azure Sentinel then generates incidents that would otherwise be very difficult to catch. These incidents encase two or more alerts or activities. By design, these incidents are low volume, high fidelity, and high severity.

Customized for your environment, this detection not only reduces false positive rates but can also detect attacks with limited or missing information.

## Configuration for advanced multistage attack detection

This detection is enabled by default in Azure Sentinel. To check the status, or to disable it perhaps because you are using an alternative solution to create incidents based on multiple alerts, use the following instructions:

1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com).

2. Navigate to **Azure Sentinel** > **Configuration** > **Analytics**

3. Select **Active rules** and locate **Advanced Multistage Attack Detection** in the **NAME** column. Check the **STATUS** column to confirm whether this detection is enabled or disabled.

4. To change the status, select this entry and on the **Advanced Multistage Attack Detection** blade, select **Edit**.

5. On the **Rule creation wizard** blade, the change of status is automatically selected for you, so select **Next: Review**, and then **Save**. 

Rule templates are not applicable for the advanced multistage attack detection.

> [!NOTE]
> Azure Sentinel currently uses 30 days of historical data to train the machine learning systems. This data is always encrypted using Microsoft’s keys as it passes through the machine learning pipeline. However, the training data is not encrypted using [Customer Managed Keys (CMK)](customer-managed-keys.md) if you enabled CMK in your Azure Sentinel workspace. To opt out of Fusion, navigate to **Azure Sentinel** \> **Configuration** \> **Analytics \> Active rules \> Advanced Multistage Attack Detection** and in the **Status** column,select **Disable.**

## Fusion using Palo Alto Networks and Microsoft Defender ATP

These scenarios combine two of the fundamental logs used by security analysts: Firewall logs from Palo Alto Networks and end-point detection logs from Microsoft Defender ATP. In all of the scenarios listed below, a suspicious activity is detected in the end point that involves an external IP address, then, this is followed by anomalous traffic from the external IP address back into the firewall. In Palo Alto logs, Azure Sentinel focuses on [threat logs](https://docs.paloaltonetworks.com/pan-os/8-1/pan-os-admin/monitoring/view-and-manage-logs/log-types-and-severity-levels/threat-logs), and traffic is considered suspicious when threats are allowed (suspicious data, files, floods, packets, scans, spyware, URLs, viruses, vulnerabilities, wildfire-viruses, wildfires).

### Network request to TOR anonymization service followed by anomalous traffic flagged by Palo Alto Networks firewall​.

In this scenario, Azure Sentinel first detects an alert that Microsoft Defender Advanced Threat Protection detected a network request to a TOR anonymization service that lead to anomalous activity. This was initiated under account {account name} with SID ID {sid} at {time}. The outgoing IP address to the connection was {IndividualIp}.
Then, unusual activity was detected by the Palo Alto Networks Firewall at {TimeGenerated}. This indicates malicious traffic entered your network  The destination IP address for the network traffic is {DestinationIP}.

This scenario is currently in public preview.


### PowerShell made a suspicious network connection followed by anomalous traffic flagged by Palo Alto Networks firewall​.

In this scenario, Azure Sentinel first detects an alert that Microsoft Defender Advanced Threat Protection detected that PowerShell made a suspicious network connection leading to anomalous activity that was detected by a Palo Alto Network Firewall. This was initiated by the account {account name} with SID ID {sid} at {time}. The outgoing IP address to the connection was {IndividualIp}. Then, unusual activity was detected by the Palo Alto Networks Firewall at {TimeGenerated}. This indicates that malicious traffic entered your network. The destination IP address for the network traffic is {DestinationIP}.

This scenario is currently in public preview.

### Outbound connection to IP with a history of unauthorized access attempts followed by anomalous traffic flagged by Palo Alto Networks firewall

In this scenario, Azure Sentinel detects an alert that Microsoft Defender Advanced Threat Protection detected an outbound connection to an IP address with a history of unauthorized access attempts that lead to anomalous activity being detected by the Palo Alto Networks Firewall. This was initiated by the account {account name} with SID ID {sid} at {time}. The outgoing IP address to the connection was {IndividualIp}. After this, unusual activity was detected by the Palo Alto Networks Firewall at {TimeGenerated}. This indicates that malicious traffic entered your network. The destination IP address for the network traffic is {DestinationIP}.

This scenario is currently in public preview.



## Fusion using Identity Protection and Microsoft Cloud App Security

Using advanced multistage attack detection, Azure Sentinel supports the following scenarios that combine anomaly events from Azure Active Directory Identity Protection and Microsoft Cloud App Security:

- [Impossible travel to atypical location followed by anomalous Office 365 activity](#impossible-travel-to-atypical-location-followed-by-anomalous-office-365-activity)
- [Sign-in activity for unfamiliar location followed by anomalous Office 365 activity](#sign-in-activity-for-unfamiliar-location-followed-by-anomalous-office-365-activity)
- [Sign-in activity from infected device followed by anomalous Office 365 activity](#sign-in-activity-from-infected-device-followed-by-anomalous-office-365-activity)
- [Sign-in activity from anonymous IP address followed by anomalous Office 365 activity](#sign-in-activity-from-anonymous-ip-address-followed-by-anomalous-office-365-activity)
- [Sign-in activity from user with leaked credentials followed by anomalous Office 365 activity](#sign-in-activity-from-user-with-leaked-credentials-followed-by-anomalous-office-365-activity)

You must have the [Azure AD Identity Protection data connector](connect-azure-ad-identity-protection.md) and the [Cloud App Security](connect-cloud-app-security.md) connectors configured.

In the descriptions that follow, Azure Sentinel will display the actual value from your data that is represented on this page as variables in brackets. For example, the actual display name of an account rather than \<*account name*>, and the actual number rather than \<*number*>.

### Impossible travel to atypical location followed by anomalous Office 365 activity

There are seven possible Azure Sentinel incidents that combine impossible travel to atypical location alerts from Azure AD Identity Protection and anomalous Office 365 alerts generated by Microsoft Cloud App Security:

- **Impossible travel to atypical locations leading to Office 365 mailbox exfiltration**
    
    This alert is an indication of a sign-in event by \<*account name*>  from an impossible travel to \<*location*>, an atypical location, followed by a suspicious inbox forwarding rule was set on a user's inbox.
    
    This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>.

- **Impossible travel to atypical locations leading to suspicious cloud app administrative activity**
    
    This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location.
    
    Next, the account \<*account name*> performed over \<*number*> administrative activities in a single session.

- **Impossible travel to atypical locations leading to mass file deletion**
    
    This alert is an indication of a sign-in event by \<*account name*> to \<*location*>, an atypical location. 
    
    Next, the account \<*account name*> deleted \<*number of*> unique files in a single session.

- **Impossible travel to atypical locations leading to mass file download**
    
    This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location. 
    
    Next, the account \<*account name*> downloaded over \<*number of*> unique files in a single session.

- **Impossible travel to atypical locations leading to Office 365 impersonation**
    
    This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location. 
    
    Next, the account \<*account name*> performed an unusual amount (\<*number of activities*>) of impersonation activities in a single session.

- **Impossible travel to atypical locations leading to mass file sharing**
    
    This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location. 
    
    Next, the account \<*account name*> shared over \<*number of*> unique files in a single session.

- **Impossible travel to atypical locations leading to ransomware in cloud app**
    
    This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location. 
    
    Next, the account \<*account name*> uploaded \<*number of*> files, and deleted a total of \<*number of*> files. 
    
    This activity pattern is indicative of a potential ransomware attack.


### Sign-in activity for unfamiliar location followed by anomalous Office 365 activity

There are seven possible Azure Sentinel incidents that combine sign-in activity for unfamiliar location alerts from Azure AD Identity Protection and anomalous Office 365 alerts generated by Microsoft Cloud App Security.

- **Sign-in event from an unfamiliar location leading to Exchange Online mailbox exfiltration**
    
    This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location, followed by a suspicious inbox forwarding rule was set on a user's inbox.
    
    This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>. 

- **Sign-in event from an unfamiliar location leading to suspicious cloud app administrative activity**
    
    This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 
    
    Next, the account \<*account name*> performed over \<*number of*> administrative activities in a single session.

- **Sign-in event from an unfamiliar location leading to mass file deletion**
    
    This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 
    
    Next, the account \<*account name*> deleted \<*number of*> unique files in a single session.

- **Sign-in event from an unfamiliar location leading to mass file download**
    
    This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 
    
    Next, the account \<*account name*> downloaded over \<*number of*> unique files in a single session.

- **Sign-in event from an unfamiliar location leading to Office 365 impersonation**
    
    This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location.
    
    Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

- **Sign-in event from an unfamiliar location leading to mass file sharing**
    
    This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 
    
    Next, the account \<*account name*> shared over \<*number of*> unique files in a single session.

- **Sign-in event from an unfamiliar location leading to ransomware in cloud app**
    
    This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 
    
    Next, the account \<*account name*> uploaded \<*number of*> files, and deleted a total of \<*number of*> files. 
    
    This activity pattern is indicative of a potential ransomware attack.

### Sign-in activity from infected device followed by anomalous Office 365 activity

There are seven possible Azure Sentinel incidents that combine sign-in activity from infected device alerts from Azure AD Identity Protection and anomalous Office 365 alerts generated by Microsoft Cloud App Security:

- **Sign-in event from an infected device leading to Office 365 mailbox exfiltration**
    
    This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware, followed by a suspicious inbox forwarding rule was set on a user's inbox.
    
    This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>. 

- **Sign-in event from an infected device leading to suspicious cloud app administrative activity**
    
    This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware.
    
    Next, the account \<*account name*> performed over \<*number of*> administrative activities in a single session.

- **Sign-in event from an infected device leading to mass file deletion**
    
    This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 
    
    Next, the account \<*account name*> deleted \<*number of*> unique files in a single session.

- **Sign-in event from an infected device leading to mass file download**
    
    This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 
    
    Next, the account \<*account name*> downloaded over \<*number of*> unique files in a single session.

- **Sign-in event from an infected device leading to Office 365 impersonation**
    
    This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 
    
    Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

- **Sign-in event from an infected device leading to mass file sharing**
    
    This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 
    
    Next, the account \<*account name*> shared over \<*number of*> unique files in a single session.

- **Sign-in event from an infected device leading to ransomware in cloud app**
    
    This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 
    
    Next, the account \<*account name*> uploaded \<*number of*> files, and deleted a total of \<*number of*> files. 
    
    This activity pattern is indicative of a potential ransomware attack.

### Sign-in activity from anonymous IP address followed by anomalous Office 365 activity

There are seven possible Azure Sentinel incidents that combine sign-in activity from anonymous IP address alerts from Azure AD Identity Protection and anomalous Office 365 alerts generated by Microsoft Cloud App Security:

- **Sign-in event from an anonymous IP address leading to Office 365 mailbox exfiltration**
    
    This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>, followed by a suspicious inbox forwarding rule was set on a user's inbox.
    
    This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>. 

- **Sign-in event from an anonymous IP address leading to suspicious cloud app administrative activity**
    
    This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 
    
    Next, the account \<*account name*> performed over \<*number of*> administrative activities in a single session.

- **Sign-in event from an anonymous IP address leading to mass file deletion**
    
    This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 
    
    Next, the account \<*account name*> deleted \<*number of*> unique files in a single session.

- **Sign-in event from an anonymous IP address leading to mass file download**
    
    This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 
    
    Next, the account \<*account name*> downloaded over \<*number of*> unique files in a single session.

- **Sign-in event from an anonymous IP address leading to Office 365 impersonation**
    
    This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 
    
    Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

- **Sign-in event from an anonymous IP address leading to mass file sharing**
    
    This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 
    
    Next, the account \<*account name*> shared over \<*number of*> unique files in a single session.

- **Sign-in event from an anonymous IP address to ransomware in cloud app**
    
    This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 
    
    Next, the account \<*account name*> uploaded \<*number of*> files, and deleted a total of \<*number of*> files. 
    
    This activity pattern is indicative of a potential ransomware attack.

### Sign-in activity from user with leaked credentials followed by anomalous Office 365 activity

There are seven possible Azure Sentinel incidents that combine sign-in activity from user with leaked credentials alerts from Azure AD Identity Protection and anomalous Office 365 alerts generated by Microsoft Cloud App Security:

- **Sign-in event from user with leaked credentials leading to Office 365 mailbox exfiltration**
    
    This alert is an indication that the sign-in event by \<*account name*> used leaked credentials, followed by a suspicious inbox forwarding rule was set on a user's inbox. 
    
    This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>. 

- **Sign-in event from user with leaked credentials leading to suspicious cloud app administrative activity**
    
    This alert is an indication that the  sign-in event by \<*account name*> used leaked credentials.
    
    Next, the account \<*account name*> performed over \<*number of*> administrative activities in a single session.

- **Sign-in event from User with leaked credentials leading to mass file deletion**
    
    This alert is an indication that the sign-in event by \<*account name*> used leaked credentials.
    
    Next, the account \<*account name*> deleted \<*number of*> unique files in a single session.

- **Sign-in event from User with leaked credentials leading to mass file download**
    
    This alert is an indication that the sign-in event by \<*account name*> used leaked credentials.
    
    Next, the account \<*account name*> downloaded over \<*number of*> unique files in a single session.

- **Sign-in event from user with leaked credentials leading to Office 365 impersonation**
    
    This alert is an indication that the  sign-in event by \<*account name*> used leaked credentials. 
    
    Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

- **Sign-in event from User with leaked credentials leading to mass file sharing**
    
    This alert is an indication that the  sign-in event by \<*account name*> used leaked credentials.
    
    Next, the account \<*account name*> shared over \<*number of*> unique files in a single session.

- **Sign-in event from User with leaked credentials to ransomware in cloud app**
    
    This alert is an indication that the  sign-in event by \<*account name*> used leaked credentials. 
    
    Next, the account \<*account name*> uploaded \<*number of*> files, and deleted a total of \<*number of*> files. 
    
    This activity pattern is indicative of a potential ransomware attack.

## Next steps

Now you've learned more about advanced multistage attack detection, you might be interested in the following quickstart to learn how to get visibility into your data and potential threats: [Get started with Azure Sentinel](quickstart-get-visibility.md).

If you're ready to investigate the incidents that are created for you, see the following tutorial: [Investigate incidents with Azure Sentinel](tutorial-investigate-cases.md).

