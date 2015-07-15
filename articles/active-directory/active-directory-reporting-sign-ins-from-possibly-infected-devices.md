<properties
	pageTitle="Sign ins from possibly infected devices"
	description="A report that includes sign in attempts that have been executed from devices on which some malware (malicious software) may be running."
	services="active-directory"
	documentationCenter=""
	authors="kenhoff"
	manager="ilanas"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/13/2015"
	ms.author="kenhoff"/>

# Sign ins from possibly infected devices

| Description        | Report location |
| :-------------     | :-------        |
| <p>Use this report when you want to see sign ins from devices on which some malware (malicious software) may be running. We correlate IP addresses of sign ins against IP addresses from which an attempt was made to contact a malware server.</p><p>Recommendation: Since this report assumes an IP address was associated with the same device in both cases, we recommend that you contact the user and scan the user's device to be certain.</p><p>For more information about how to address malware infections, see the [Malware Protection Center](http://go.microsoft.com/fwlink/?linkid=335773). </p> | Directory > Reports tab |

![Sign ins from possibly infected devices](./media/active-directory-reporting-sign-ins-from-possibly-infected-devices/signInsFromPossiblyInfectedDevices.PNG)
