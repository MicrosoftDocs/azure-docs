---
title: Azure Active Directory Identity Protection risk events reference | Microsoft Docs
description: 'Frequently asked questions about Azure AD Identity Protection'
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman

ms.assetid: 14f7fc83-f4bb-41bf-b6f1-a9bb97717c34
ms.service: active-directory
ms.component: conditional-access
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/03/2017
ms.author: markvi
ms.reviewer: nigu

---
# Azure Active Directory Identity Protection risk events reference

The vast majority of security breaches take place when attackers gain access to an environment by stealing a user’s identity. Discovering compromised identities is no easy task. Azure Active Directory uses adaptive machine learning algorithms and heuristics to detect suspicious actions that are related to your user accounts. Each detected suspicious action is stored in a record called risk event.


## Anonymous IP address

**Detection Type:** Real-time  
**Old name:** Sign-ins from anonymous IP address


This risk event type indicates sign-ins from an anonymous IP address (e.g. Tor browser, anonymizer VPNs).
These IP addresses are typically used by actors who want to hide their login telemetry (IP address, location, device, etc.) for potentially malicious intent.


## Atypical travel

**Detection Type:** Offline  
**Old name:** Impossible travel to atypical locations


This risk event type identifies two sign-ins originating from geographically distant locations, where at least one of the locations may also be atypical for the user, given past behavior. Among several other factors, this machine learning algorithm takes into account the time between the two sign-ins and the time it would have taken for the user to travel from the first location to the second, indicating that a different user is using the same credentials.

The algorithm ignores obvious "false positives" contributing to the impossible travel conditions, such as VPNs and locations regularly used by other users in the organization. The system has an initial learning period of the earliest of 14 days or 10 logins, during which it learns a new user’s sign-in behavior.


## Leaked Credentials

**Detection Type:** Offline  
**Old name:** Users with leaked credentials


This risk event type indicates that the user’s valid credentials have been leaked.
When cybercriminals compromise valid passwords of legitimate users, the criminals often share those credentials. This is usually done by posting them publicly on the dark web or paste sites or by trading or selling the credentials on the black market. The Microsoft leaked credentials service acquires username / password pairs by monitoring public and dark web sites and by working with:

- Researchers

- Law enforcement

- Security teams at Microsoft

- Other trusted sources

When the service acquires user credentials from the dark web, paste sites or the above sources, they are checked against Azure AD users' current valid credentials to find valid matches.


## Malware linked IP address

**Detection Type:** Offline  
**Old name:** Sign-ins from infected devices


This risk event type indicates sign-ins from IP addresses infected with malware that are known to actively communicate with a bot server. This is determined by correlating IP addresses of the user’s device against IP addresses that were in contact with a bot server while the bot server was active.


## Unfamiliar sign-in properties

**Detection Type:** Real-time  
**Old name:** Sign-ins from unfamiliar locations

This risk event type considers past sign-in properties (e.g. device, location, network) to determine sign-ins with unfamiliar properties. The system stores properties of previous locations used by a user, and considers these “familiar”. The risk event is triggered when the sign-in occurs with properties not already in the list of familiar properties. The system has an initial learning period of 30 days, during which it does not flag any new detections.
We also run this detection for basic authentication (or legacy protocols). Because these protocols do not have modern properties such as client id, there is limited telemetry to reduce false positives. We recommend our customers to move to modern authentication.

