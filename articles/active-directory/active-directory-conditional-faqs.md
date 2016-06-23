<properties
	pageTitle="Conditional access FAQs | Microsoft Azure"
	description="Frequently asked questions about conditional access "
	services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="swadhwa"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/23/2016"
	ms.author="femila"/>

# Conditional access FAQs

## Which applications work with conditional access policies?
Please see the topic, [Conditional access- What applications are supported](active-directory-conditional-access-supported-apps.md).

## Are conditional access policies enforced for B2B collaboration and guest users?
Policies are enforced for B2B collaboration users. However, in some cases the user may not be able to satisfy the policy requirement, for example, if their organization does not support multi-factor authentication. Policy is not currently enforced for SharePoint guest users. The guest relationship is maintained within SharePoint, so guest users accounts are not subject to access polices at the authenticatoin server. Guest access can be managed at SharePoint.

## Does SharePoint Online policy also apply to OneDrive for Business?
Yes.
 
## Why can’t I set policy on client apps, like Word or Outlook?
Conditional access policy sets requirements for accessing a service and is enforced when authentication happens to that service. So policy is not set directly on a client application, instead it is applied when it calls into a service. For example, policy set on SharePoint will apply to clients calling SharePoint and policy set on Exchange will apply to Outlook.


