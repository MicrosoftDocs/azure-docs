---
title: Advanced multistage attack detection in Sentinel
description: Use Fusion technology in Azure Sentinel to reduce alert fatigue and create actionable incidents that are based on advanced multi-stage attack detection.
services: sentinel
documentationcenter: na
author: cabailey
manager: rkarlin

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 8/19/2019
ms.author: cabailey

---
# Advanced multistage attack detection in Azure Sentinel

Based on fusion technology, advanced multi-stage attack detection in Azure Sentinel uses machine learning algorithms that can correlate many low-fidelity alerts and events across multiple products, into high-fidelity and actionable incidents. Customized for each tenant, this detection not only reduces false positive rates but can also detect attacks with limited or missing information.

The incidents generated will always include two or more alerts, and be assigned high severity. For details about the alerts and the scenarios supported, see the [Scenarios supported for multi-stage attack detection](#scenarios-supported-for-multi-stage-attack-detection) section on this page.

## Configuration for advanced multistage attack detection

This technology is enabled by default in Azure Sentinel. To check the status, or to disable it because you are using an alternative solution to create incidents based on multiple alerts, use the **Analytics** blade in the Azure portal:

1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com).

2. Navigate to **Azure Sentinel** > **Configuration** > **Analytics**

3. Select **Active rules** and locate **Advanced Multistage Attack Detection** in the **NAME** column. Check the **STATUS** column to confirm whether this detection is enabled or disabled.

4. To change the status, select this entry and on the **Advanced Multistage Attack Detection** blade, select **Edit**.

5. On the **Rule creation wizard** blade, the change of status is automatically selected for you, so select **Next: Review**, and then **Save**. 


Rule templates are not applicable for the the advanced multistage attack alert.

## Scenarios supported for advanced multistage attack detection

Using advanced multistage attack detection, Azure Sentinel supports the following scenarios that combine anomaly events from Azure Active Directory Identity Protection and Microsoft Cloud App Security:

- [Impossible travel to atypical location](#impossible-travel-to-atypical-location)
- [Sign-in activity for unfamiliar location](#sign-in-activity-for-unfamiliar-location)
- [Sign-in activity from infected device](#sign-in-activity-from-infected-device)
- [Sign-in activity from anonymous IP address](#sign-in-activity-from-anonymous-ip-address)
- [Sign-in activity from user with leaked credentials](#sign-in-activity-from-user-with-leaked-credentials)

You must have the [Azure AD Identity Protection data connector](connect-azure-ad-identity-protection.md) and the [Cloud App Security](connect-cloud-app-security.md) connectors configured.

In the descriptions that follow, Azure Sentinel will display the actual value from your data that is represented on this page as variables in brackets. For example, the actual display name of an account rather than \<*account name*>, and the actual number rather than \<*number*>.

### Impossible travel to atypical location

**Impossible travel to atypical locations leading to Office 365 mailbox exfiltration**

This alert is an indication of a sign-in event by \<*account name*>  from an impossible travel to \<*location*>, an atypical location, followed by a suspicious inbox forwarding rule was set on a user's inbox.

This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>.

**Impossible travel to atypical locations leading to suspicious cloud app administrative activity**

This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location.

Next, the account \<*account name*> performed over \<*number*> administrative activities in a single session.

**Impossible travel to atypical locations leading to mass file deletion**

This alert is an indication of a sign-in event by \<*account name*> to \<*location*>, an atypical location. 

Next, the account \<*account name*> deleted \<*number of*> unique files in a single session.

**Impossible travel to atypical locations leading to mass file download**

This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location. 

Next, the account \<*account name*> downloaded over \<*number of*> unique files in a single session.

**Impossible travel to atypical locations leading to Office 365 impersonation**

This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location. 

Next, the account \<*account name*> performed an unusual amount (\<*number of activities*>) of impersonation activities in a single session.

**Impossible travel to atypical locations leading to mass file sharing**

This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location. 

Next, the account \<*account name*> shared over \<*number of*> unique files in a single session.

**Impossible travel to atypical locations leading to ransomware in cloud app**

This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location. 

Next, the account \<*account name*> uploaded \<*number of*> files, and deleted a total of \<*number of*> files. 

This activity pattern is indicative of a potential ransomware attack.


### Sign-in activity for unfamiliar location

**Sign-in event from an unfamiliar location leading to Exchange Online mailbox exfiltration**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location, followed by a suspicious inbox forwarding rule was set on a user's inbox.

This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>. 

**Sign-in event from an unfamiliar location leading to suspicious cloud app administrative activity**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 

Next, the account \<*account name*> performed over \<*number of*> administrative activities in a single session.

**Sign-in event from an unfamiliar location leading to mass file deletion**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 

Next, the account \<*account name*> deleted \<*number of*> unique files in a single session.

**Sign-in event from an unfamiliar location leading to mass file download**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 

Next, the account \<*account name*> downloaded over \<*number of*> unique files in a single session.

**Sign-in event from an unfamiliar location leading to Office 365 impersonation**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location.

Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

**Sign-in event from an unfamiliar location leading to mass file sharing**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 

Next, the account \<*account name*> shared over \<*number of*> unique files in a single session.

**Sign-in event from an unfamiliar location leading to ransomware in cloud app**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 

Next, the account \<*account name*> uploaded \<*number of*> files, and deleted a total of \<*number of*> files. 

This activity pattern is indicative of a potential ransomware attack.

### Sign-in activity from infected device

**Sign-in event from an infected device leading to Office 365 mailbox exfiltration**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware, followed by a suspicious inbox forwarding rule was set on a user's inbox.

This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>. 

**Sign-in event from an infected device leading to suspicious cloud app administrative activity**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware.

Next, the account \<*account name*> performed over \<*number of*> administrative activities in a single session.

**Sign-in event from an infected device leading to mass file deletion**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 

Next, the account \<*account name*> deleted \<*number of*> unique files in a single session.

**Sign-in event from an infected device leading to mass file download**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 

Next, the account \<*account name*> downloaded over \<*number of*> unique files in a single session.

**Sign-in event from an infected device leading to Office 365 impersonation**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 

Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

**Sign-in event from an infected device leading to mass file sharing**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 

Next, the account \<*account name*> shared over \<*number of*> unique files in a single session.

**Sign-in event from an infected device leading to ransomware in cloud app**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 

Next, the account \<*account name*> uploaded \<*number of*> files, and deleted a total of \<*number of*> files. 

This activity pattern is indicative of a potential ransomware attack.

### Sign-in activity from anonymous IP address

**Sign-in event from an anonymous IP address leading to Office 365 mailbox exfiltration**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>, followed by a suspicious inbox forwarding rule was set on a user's inbox.

This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>. 

**Sign-in event from an anonymous IP address leading to suspicious cloud app administrative activity**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 

Next, the account \<*account name*> performed over \<*number of*> administrative activities in a single session.

**Sign-in event from an anonymous IP address leading to mass file deletion**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 

Next, the account \<*account name*> deleted \<*number of*> unique files in a single session.

**Sign-in event from an anonymous IP address leading to mass file download**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 

Next, the account \<*account name*> downloaded over \<*number of*> unique files in a single session.

**Sign-in event from an anonymous IP address leading to Office 365 impersonation**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 

Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

**Sign-in event from an anonymous IP address leading to mass file sharing**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 

Next, the account \<*account name*> shared over \<*number of*> unique files in a single session.

**Sign-in event from an anonymous IP address to ransomware in cloud app**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 

Next, the account \<*account name*> uploaded \<*number of*> files, and deleted a total of \<*number of*> files. 

This activity pattern is indicative of a potential ransomware attack.

### Sign-in activity from user with leaked credentials

**Sign-in event from User with leaked credentials leading to Office 365 mailbox exfiltration**

This alert is an indication that the sign-in event by \<*account name*> used leaked credentials, followed by a suspicious inbox forwarding rule was set on a user's inbox. 

This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>. 

**Sign-in event from user with leaked credentials leading to suspicious cloud app administrative activity**

This alert is an indication that the  sign-in event by \<*account name*> used leaked credentials.

Next, the account \<*account name*> performed over \<*number of*> administrative activities in a single session.

**Sign-in event from User with leaked credentials leading to mass file deletion**

This alert is an indication that the sign-in event by \<*account name*> used leaked credentials.

Next, the account \<*account name*> deleted \<*number of*> unique files in a single session.

**Sign-in event from User with leaked credentials leading to mass file download**

This alert is an indication that the sign-in event by \<*account name*> used leaked credentials.

Next, the account \<*account name*> downloaded over \<*number of*> unique files in a single session.

**Sign-in event from user with leaked credentials leading to Office 365 impersonation**

This alert is an indication that the  sign-in event by \<*account name*> used leaked credentials. 

Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

**Sign-in event from User with leaked credentials leading to mass file sharing**

This alert is an indication that the  sign-in event by \<*account name*> used leaked credentials.

Next, the account \<*account name*> shared over \<*number of*> unique files in a single session.

**Sign-in event from User with leaked credentials to ransomware in cloud app**

This alert is an indication that the  sign-in event by \<*account name*> used leaked credentials. 

Next, the account \<*account name*> uploaded \<*number of*> files, and deleted a total of \<*number of*> files. 

This activity pattern is indicative of a potential ransomware attack.

## Next steps

Now you've learned more about advanced multi-stage attack detection, you might be interested in the following quickstart to learn how to get visibility into your data and potential threats: [Get started with Azure Sentinel](quickstart-get-visibility.md).

If you're ready to investigate the incidents that are created for you, see the following tutorial: [Investigate incidents with Azure Sentinel](tutorial-investigate-cases.md).

