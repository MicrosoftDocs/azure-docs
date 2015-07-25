<properties
	pageTitle="Azure Active Directory Reporting Notifications"
	description="How to use the Azure Active Directory reporting notifications for suspicious sign ins."
	services="active-directory"
	documentationCenter=""
	authors="SSalahAhmed"
	manager="TerryLan"
	editor="LisaToft"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/24/2015"
	ms.author="kenhoff"/>

# Azure Active Directory Reporting Notifications

## What reports generate email notifications

At this time, only the Anomalous Sign In Activity report and the Users with Anomalous Sign In Activity report are using the email notification system.

## What triggers the email notification to be sent?

By default, Azure Active Directory is set to automatically send email notifications to all global admins. The email is sent under the following conditions for each report.

For the Anomalous Sign In Activity report:

- Unknown sources: 10 events
- Multiple failures: 10 events
- IP addresses with suspicious activity: 10 events
- Infected devices: 10 events

For the Users with Anomalous Sign In Activity report:

- Unknown sources: 10 events
- Multiple failures: 10 events
- IP addresses with suspicious activity: 10 events
- Infected devices: 5 events
- Anomalous sign ins report: 15 events

The email is sent if any of the above conditions is met within 30 days, or since the last email was sent if it is less than 30 days.

Anomalous Sign Ins are those that have been identified as “anomalous” by our machine learning algorithms, on the basis of unexpected sign in locations, time of day and locations or a combination of these. This may indicate that a hacker has been trying to sign in using this account. More information about this report can be found in the table above.

## Who receives the email notifications?

The email is sent to all global admins who have been assigned an Active Directory Premium license. To ensure it is delivered, we send it to the admins Alternate Email Address as well. Admins should include aad-alerts-noreply@mail.windowsazure.com in their safe senders list so they don’t miss the email.

## How often are these emails sent?

Once an email is sent, the next one will be sent only when 10 or more new Anomalous Sign In events are encountered within 30 days of sending that email. How do I access the report mentioned in the email?

When you click on the link, you will be redirected to the report page within the Azure Management Portal. In order to access the report, you need to be both:

- An admin or co-admin of your Azure subscription
- A global administrator in the directory, and assigned an Active Directory Premium license. For more information, see Azure Active Directory editions.

## Can I turn off these emails?

Yes, to turn off notifications related to anomalous sign ins within the Azure Management Portal, click **Configure**, and then select **Disabled** under the **Notifications** section.

## What's next
- Curious about what security, audit, and activity reports are available? Check out [Azure AD Security, Audit, and Activity Reports](active-directory-view-access-usage-reports.md)
- [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md)
- [Add company branding to your Sign In and Access Panel pages](active-directory-add-company-branding.md)
