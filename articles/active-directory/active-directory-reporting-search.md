<properties
	pageTitle="Azure Active Directory Reporting Search"
	description="How to search your Azure Active Directory's security, activity and audit reports"
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

# Azure Active Directory Reporting Search

## Reporting Documentation Articles

 - [Reporting API](active-directory-reporting-api-getting-started.md)
 - [Audit Events](active-directory-reporting-audit-events.md)
 - [Retention](active-directory-reporting-retention.md)
 - [Previews](active-directory-reporting-previews.md)
 - [Search](active-directory-reporting-search.md)
 - [Backfill](active-directory-reporting-backfill.md)
 - [Latencies](active-directory-reporting-latencies.md)
 - ["Unknown Actor" event](active-directory-reporting-unknown-actor.md)

Azure Active Directory provides directory admins the ability to search for user security, activity, and audit events across multiple reports.

To find the search panel, navigate to the **Azure Management Portal -> Your Azure Active Directory -> Reports.** The panel can be found at the top of the list of reports.

To search for activity or audit events for a certain user, select a date range in the From and To fields, type in the user's UPN or Display name, and click the checkmark button.

## Reports included in search

Not all reports are included in search results yet. This table indicates which reports are included.

Report                                              | Included
--------------------------------------------------- | --------
Sign ins from unknown sources                       | No
Sign ins after multiple failures                    | No
Sign ins from multiple geographies                  | No
Sign ins from IP addresses with suspicious activity | No
Sign ins from possibly infected devices             | No
Irregular sign in activity                          | No
Users with anomalous sign in activity               | No
Users with leaked credentials                       | No
Audit report                                        | Yes
Password reset activity                             | Yes
Password reset registration activity                | Yes
Self service groups activity                        | Yes
Application usage                                   | No
Account provisioning activity                       | Yes
Password rollover status                            | No
Account provisioning errors                         | No
RMS usage                                           | No
Most active RMS users                               | No
RMS device usage                                    | No


## Learn more

 - [Azure Active Directory Reports](active-directory-view-access-usage-reports.md)
 - [Azure Active Directory Reporting Audit Events](active-directory-reporting-audit-events.md)
