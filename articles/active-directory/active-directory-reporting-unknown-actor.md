<properties
   pageTitle="Azure Active Directory Reporting 'Unknown Actor' | Microsoft Azure"
   description="Description of the 'Unknown Actor' event in Azure Active Directory Reports"
   services="active-directory"
   documentationCenter=""
   authors="kenhoff"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="11/30/2015"
   ms.author="kenhoff"/>

# Azure Active Directory Reporting 'Unknown Actor' event

## Reporting Documentation Articles

 - [Reporting API](active-directory-reporting-api-getting-started.md)
 - [Audit Events](active-directory-reporting-audit-events.md)
 - [Retention](active-directory-reporting-retention.md)
 - [Previews](active-directory-reporting-previews.md)
 - [Search](active-directory-reporting-search.md)
 - [Backfill](active-directory-reporting-backfill.md)
 - [Latencies](active-directory-reporting-latencies.md)
 - ["Unknown Actor" event](active-directory-reporting-unknown-actor.md)

On rare occasions, you may see unusual values in the "Actor" or "User" fields in Azure AD Reports. This behavior is expected, and is caused by one of two events:

## A Service Principal is acting on the directory, without a user context

In this case, a Service Principal (Application) is performing directory updates without actually signing in as a user. This causes the Service Principal's ID to show up as the Actor, instead of a UPN. Here's an example:

![](./media/active-directory-reporting-unknown-actor/spd-actor.png)

This is a known bug, and we are working diligently to resolve it.

## A user was deleted from the directory before the event was processed

In this case, a user was deleted from the directory before we processed the event and associated a username with it. Here's an example:

![](./media/active-directory-reporting-unknown-actor/unknown-actor.png)

This is a known bug, and we are working diligently to resolve it.

<!-- ![](./media/active-directory-reporting-unknown-actor/uid-actor.png) -->
