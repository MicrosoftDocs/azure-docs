<properties
   pageTitle="Azure Active Directory Reporting Backfill Times | Microsoft Azure"
   description="Amount of time it takes for previous reporting events to show up in your Azure Active Directory"
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

# Azure Active Directory Report Retention Policies

## Reporting Documentation Articles

 - [Reporting API](active-directory-reporting-api-getting-started.md)
 - [Audit Events](active-directory-reporting-audit-events.md)
 - [Retention](active-directory-reporting-retention.md)
 - [Previews](active-directory-reporting-previews.md)
 - [Search](active-directory-reporting-search.md)
 - [Backfill](active-directory-reporting-backfill.md)
 - [Latencies](active-directory-reporting-latencies.md)
 - ["Unknown Actor" event](active-directory-reporting-unknown-actor.md)

After a directory is opted-in to reports, the reports backfill data for a certain number of days, indicated here.

Report                                                  | Description
------------------------------------------------------- | -----------
Sign ins from unknown sources                           | 0 days
Sign ins after multiple failures                        | 0 days
Sign ins from multiple geographies                      | 0 days
Sign ins from IP addresses with suspicious activity     | 0 days
Sign ins from possibly infected devices                 | 0 days
Irregular sign in activity                              | 0 days
Users with anomalous sign in activity                   | 0 days
Users with leaked credentials                           | 0 days
Audit report                                            | 30 days
Password reset activity (Azure AD)                      | 0 days
Password reset activity (Identity Manager)              | 0 days
Password reset registration activity (Azure AD)         | 0 days
Password reset registration activity (Identity Manager) | 0 days
Self service groups activity (Azure AD)                 | 0 days
Self service groups activity (Identity Manager)         | 0 days
Application usage                                       | 0 days
Account provisioning activity                           | 0 days
Password rollover status                                | 0 days
Account provisioning errors                             | 0 days
RMS usage                                               | 0 days
Most active RMS users                                   | 0 days
RMS device usage                                        | 0 days
RMS enabled application usage                           | 0 days
