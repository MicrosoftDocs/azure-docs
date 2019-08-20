---
title: Advanced multi-stage attack detection in Sentinel
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
ms.date: 2/28/2019
ms.author: cabailey

---
# Advanced multi-stage attack detection in Azure Sentinel

Based on Fusion technology, advanced multi-stage attack detection in Azure Sentinel uses scalable machine learning algorithms that can correlate many low-fidelity alerts and events across multiple products into high-fidelity and actionable incidents. Customized for each tenant, this detection not only reduces false positive rates but can also detect attacks with limited or missing information.

The incidents generated will always include two or more alerts, and be assigned high severity. For details about the alerts and scenarios supported, see the [Scenarios supported for multi-stage attack detection](#scenarios-supported-for-multi-stage-attack-detection) section on this page.

## Configuration for advanced multi-stage attack detection

This technology is enabled by default. To check the status, or to disable it because you are using an alternative solution to create incidents based on multiple alerts, use the **Analytics** blade in the Azure portal:

1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com).

2. Navigate to **Azure Sentinel** > **Configuration** > **Analytics**

3. On the **Analytics** blade, locate **Advanced Multi-Stage Attack Detection** in the **NAME** column, and confirm whether the status is **Enabled** or **Disabled**.

4. To change the status, select this entry ....


## Scenarios supported for multi-stage attack detection

Using advanced multi-stage attack detection, Sentinel supports the following scenarios that combine anomalies from Azure Active Directory Identity Protection and Microsoft Cloud App Security:

- [Impossible travel to atypical location](#impossible-travel-to-atypical-location)
- [Sign-in for unfamiliar location](#sign-in-for-unfamiliar-location)
- [Sign-in from infected device](#sign-in-from-infected-device)
- [Sign-in from anonymous IP address](#sign-in-from-anonymous-ip-address)
- [Sign-in from user with leaked credentials](#sign-in-from-user-with-leaked-credentials)

You must have the [Azure AD Identity Protection data connector](connect-azure-ad-identity-protection.md) and the [Cloud App Security](connect-cloud-app-security.md) connectors configured. Optionally, for additional information, the [Palo Alto Networks](connect-paloalto.md) connector.

### Impossible travel to atypical location

**Impossible travel to atypical locations leading to O365 Mailbox Exfiltration**

This alert is an indication of a sign-in event by \<*account name*>  from an impossible travel to \<*location*>, an atypical location, followed by a suspicious inbox forwarding rule was set on a user's inbox.

This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*external email address*>.

**Impossible travel to atypical locations leading to Suspicious Cloud App Administrative Activity**

This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location.

Next, the account \<*account name*> performed over \<*number*> administrative activities in a single session

**Impossible travel to atypical locations leading to Suspicious Cloud App Administrative Activity**

This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location.

Next, the account \<*account name*> performed over \<*number*> administrative activities in a single session|

**Impossible travel to atypical locations leading to mass File deletion**

This alert is an indication of a sign-in event by \<*account name*> to \<*location*>, an atypical location. 

Next, the account \<*account name*> deleted \<*number of*> unique objects in a single session.

**Impossible travel to atypical locations leading to mass file download**

This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location. 

Next, the account \<*account name*> downloaded over \<*number of*> unique objects in a single session.

**Impossible travel to atypical locations leading to O365 impersonation**

This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location. 

Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

**Impossible travel to atypical locations leading to mass file sharing**

This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location. 

Next, the account \<*account name*> shared over \<*number of*> unique objects in a single session.

**Impossible travel to atypical locations leading to ransomware in cloud app**

This alert is an indication of a sign-in event by \<*account name*> from an impossible travel to \<*location*>, an atypical location. 

Next, the account \<*account name*> uploaded \<*number of*> pdf files, and deleted a total of \<*number of*> files. 

This activity pattern is indicative of a potential ransomware attack


### Sign-in for unfamiliar location

**Sign-in from an unfamiliar location leading to O365 mailbox exfiltration**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location, followed by a suspicious inbox forwarding rule was set on a user's inbox.

This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>. 

**Sign-in from an unfamiliar location leading to suspicious cloud app administrative activity**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 

Next, the account \<*account name*> performed over \<*number of*> administrative activities in a single session.

**Sign-in from an unfamiliar location leading to mass file deletion**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 

Next, the account \<*account name*> deleted \<*number of*> unique objects in a single session.

**Sign-in from an unfamiliar location leading to mass file download**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 

Next, the account \<*account name*> downloaded over \<*number of*> unique objects in a single session.

**Sign-in from an unfamiliar location leading to O365 impersonation**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location.

Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

**Sign-in from an unfamiliar location leading to mass file sharing**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 

Next, the account \<*account name*> shared over \<*number of*> unique objects in a single session.

**Sign-in from an unfamiliar location leading to ransomware in cloud app**

This alert is an indication of a sign-in event by \<*account name*> from \<*location*>, an unfamiliar location. 

Next, the account \<*account name*> uploaded \<*number of*> pdf files, and deleted a total of \<*number of*> files. 

This activity pattern is indicative of a potential ransomware attack

### Sign-in from infected device

**Sign-in from an infected device leading to O365 mailbox exfiltration**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware, followed by a suspicious inbox forwarding rule was set on a user's inbox.

This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>. 

**Sign-in from an infected device leading to suspicious cloud app administrative activity**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware.

Next, the account \<*account name*> performed over \<*number of*> administrative activities in a single session.

**Sign-in from an infected device leading to mass file deletion**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 

Next, the account \<*account name*> deleted \<*number of*> unique objects in a single session.

**Sign-in from an infected device leading to mass file download**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 

Next, the account \<*account name*> downloaded over \<*number of*> unique objects in a single session.

**Sign-in from an infected device leading to O365 impersonation**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 

Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

**Sign-in from an infected device leading to mass file sharing**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 

Next, the account \<*account name*> shared over \<*number of*> unique objects in a single session.

**Sign-in from an infected device leading to ransomware in cloud app**

This alert is an indication of a sign-in event by \<*account name*> from a device potentially infected with malware. 

Next, the account \<*account name*> uploaded \<*number of*> pdf files, and deleted a total of \<*number of*> files. 

This activity pattern is indicative of a potential ransomware attack.

### Sign-in from anonymous IP address

**Sign-in from an anonymous IP address leading to O365 mailbox exfiltration**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>, followed by a suspicious inbox forwarding rule was set on a user's inbox.

This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>. 

**Sign-in from an anonymous IP address leading to suspicious cloud app administrative activity**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 

Next, the account \<*account name*> performed over \<*number of*> administrative activities in a single session.

**Sign-in from an anonymous IP address leading to mass file deletion**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 

Next, the account \<*account name*> deleted \<*number of*> unique objects in a single session.

**Sign-in from an anonymous IP address leading to mass file download**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 

Next, the account \<*account name*> downloaded over \<*number of*> unique objects in a single session.

**Sign-in from an anonymous IP address leading to O365 impersonation**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 

Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

**Sign-in from an anonymous IP address leading to mass file sharing**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 

Next, the account \<*account name*> shared over \<*number of*> unique objects in a single session.

**Sign-in from an anonymous IP address to ransomware in cloud app**

This alert is an indication of a sign-in event by \<*account name*> from an anonymous proxy IP address \<*IP address*>. 

Next, the account \<*account name*> uploaded \<*number of*> pdf files, and deleted a total of \<*number of*> files. 

This activity pattern is indicative of a potential ransomware attack.

### Sign-in from user with leaked credentials

**Sign-in from User with leaked credentials leading to O365 mailbox exfiltration**

This alert is an indication that the sign-in event by \<*account name*> used leaked credentials, followed by a suspicious inbox forwarding rule was set on a user's inbox. 

This may indicate that the account is compromised, and that the mailbox is being used to exfiltrate information from your organization. The user \<*account name*> created or updated an inbox forwarding rule that forwards all incoming email to the external address \<*email address*>. 

**Sign-in from user with leaked credentials leading to suspicious cloud app administrative activity**

This alert is an indication that the  sign-in event by \<*account name*> used leaked credentials.

Next, the account \<*account name*> performed over \<*number of*> administrative activities in a single session.

**Sign-in from User with leaked credentials leading to mass file deletion**

This alert is an indication that the sign-in event by \<*account name*> used leaked credentials.

Next, the account \<*account name*> deleted \<*number of*> unique objects in a single session.

**Sign-in from User with leaked credentials leading to mass file download**

This alert is an indication that the sign-in event by \<*account name*> used leaked credentials.

Next, the account \<*account name*> downloaded over \<*number of*> unique objects in a single session.

**Sign-in from user with leaked credentials leading to O365 impersonation**

This alert is an indication that the  sign-in event by \<*account name*> used leaked credentials. 

Next, the account \<*account name*> impersonated over \<*number of*> different accounts in a single session.

**Sign-in from User with leaked credentials leading to mass file sharing**

This alert is an indication that the  sign-in event by \<*account name*> used leaked credentials.

Next, the account \<*account name*> shared over \<*number of*> unique objects in a single session.

**Sign-in from User with leaked credentials to ransomware in cloud app**

This alert is an indication that the  sign-in event by \<*account name*> used leaked credentials. 

Next, the account \<*account name*> uploaded \<*number of*> pdf files, and deleted a total of \<*number of*> files. 

This activity pattern is indicative of a potential ransomware attack.


## Next steps

Now you've learned more about advanced multi-stage attack detection, you might be interested in the following quickstart to learn how to get visibility into your data and potential threats: [Get started with Azure Sentinel](quickstart-get-visibility.md).

If you're ready to investigate the incidents that are created for you, see the following tutorial: [Investigate incidents with Azure Sentinel](tutorial-investigate-cases.md).

