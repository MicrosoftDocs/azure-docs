<properties
	pageTitle="Types of risk events detected by Azure Active Directory Identity Protection | Microsoft Azure"
	description="This topic gives you a detailed overview of the available types of risk events in Azure Active Directory Identity Protection"
	services="active-directory"
	keywords="azure active directory identity protection, cloud app discovery, managing applications, security, risk, risk level, vulnerability, security policy"
	documentationCenter=""
	authors="markusvi"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/17/2016"
	ms.author="markvi"/>

#Types of risk events detected by Azure Active Directory Identity Protection 

In Azure Active Directory Identity Protection, risk events are events that:

- were flagged as suspicious

- indicate that an identity may have been compromised. 

This topic gives you a detailed overview of the available types of risk events.


## Leaked credentials

Leaked credentials are found posted publicly in the dark web by Microsoft security researchers. These credentials are usually found in plain text. They are checked against Azure AD credentials, and if there is a match, they are reported as “Leaked credentials” in Identity Protection.

Leaked credentials risk events are classified as a “High” severity risk event, because they provide a clear indication that the user name and password are available to an attacker.

## Impossible travel to atypical locations

This risk event type identifies two sign-ins originating from geographically distant locations, where at least one of the locations may also be atypical for the user, given past behavior. In addition, the time between the two sign-ins is shorter than the time it would have taken the user to travel from the first location to the second, indicating that a different user is using the same credentials. 

This machine learning algorithm that ignores obvious "*false positives*" contributing to the impossible travel condition, such as VPNs and locations regularly used by other users in the organization.  The system has an initial learning period of 14 days during which it learns a new user’s sign-in behavior.

Impossible travel is usually a good indicator that a hacker was able to successfully sign-in. However, false-positives may occur when a user is traveling using a new device or using a VPN that is typically not used by other users in the organization. Another source of false-positives is applications that incorrectly pass server IPs as client IPs, which may give the appearance of sign-ins taking place from the data center where that application’s back-end is hosted (often these are Microsoft datacenters, which may give the appearance of sign-ins taking place from Microsoft owned IP addresses). As a result of these false-positives, the risk level for this risk event is “**Medium**”.

##Sign-ins from infected devices

This risk event type identifies sign-ins from devices infected with malware, that are known to actively communicate with a bot server. This is determined by correlating IP addresses of the user’s device against IP addresses that were in contact with a bot server. 

This risk event identifies IP addresses, not user devices. If several devices are behind a single IP address, and only some are controlled by a bot network, sign-ins from other devices my trigger this event unnecessarily, which is the reason for classifying this risk event as “**Low**”.  

We recommend that you contact the user and scan all the user's devices. It is also possible that a user's personal device is infected, or as mentioned earlier, that someone else was using an infected device from the same IP address as the user. Infected devices are often infected by malware that have not yet been identified by anti-virus software, and may also indicate as bad user habits that may have caused the device to become infected.

For more information about how to address malware infections, see the [Malware Protection Center](http://go.microsoft.com/fwlink/?linkid=335773&clcid=0x409).


## Sign-ins from anonymous IP addresses

This risk event type identifies users who have successfully signed in from an IP address that has been identified as an anonymous proxy IP address. These proxies are used by people who want to hide their device’s IP address, and may be used for malicious intent.

We recommend that you immediately contact the user to verify if they were using anonymous IP addresses. The risk level for this risk event type is “**Medium**” because in itself an anonymous IP is not a strong indication of an account compromise.

## Sign-ins from IP addresses with suspicious activity

This risk event type identifies IP addresses from which a high number of failed sign-in attempts were seen, across multiple user accounts, over a short period of time. This matches traffic patterns of IP addresses used by attackers, and is a strong indicator that accounts are either already or are about to be compromised. This is a machine learning algorithm that ignores obvious "*false-positives*", such as IP addresses that are regularly used by other users in the organization.  The system has an initial learning period of 14 days where it learns the sign-in behavior of a new user and new tenant.

We recommend that you contact the user to verify if they actually signed in from an IP address that was marked as suspicious. The risk level for this event type is “**Medium**” because several devices may be behind the same IP address, while only some may be responsible for the suspicious activity. 


## Sign-in from unfamiliar locations

This risk event type is a real-time sign-in evaluation mechanism that considers past sign-in locations (IP, Latitude / Longitude and ASN) to determine new / unfamiliar locations. The system stores information about previous locations used by a user, and considers these “familiar” locations. The risk even is triggered when the sign-in occurs from a location that's not already in the list of familiar locations. The system has an initial learning period of 14 days, during which it does not flag any new locations as unfamiliar locations. The system also ignores sign-ins from familiar devices, and locations that are geographically close to a familiar location. <br>
Unfamiliar locations can provide a strong indication that an attacker is able attempting to use a stolen identity. False-positives may occur when a user is traveling, trying out a new device or uses a new VPN. As a result of these false positives, the risk level for this event type is “**Medium**”.





## See also

- [Azure Active Directory Identity Protection](active-directory-identityprotection.md)


