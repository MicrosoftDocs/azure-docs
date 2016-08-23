<properties
	pageTitle="Get Insights: Azure AD Password Management Reports | Microsoft Azure"
	description="This article describes how to use reports to get insight into Password Management operations in your organization."
	services="active-directory"
	documentationCenter=""
	authors="asteen"
	manager="femila"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/12/2016"
	ms.author="asteen"/>

# How to get operational insights with Password Management reports

> [AZURE.IMPORTANT] **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).

This section describes how you can use Azure Active Directory’s Password Management reports to view how users are using password reset and change in your organization.

- [**Password Management reports overview**](#overview-of-password-management-reports)
- [**How to view Password Management reports**](#how-to-view-password-management-reports)
- [**View password reset registration activity in your organization**](#view-password-reset-registration-activity)
- [**View password reset activity in your organization**](#view-password-reset-activity)

## Overview of Password Management reports
Once you deploy password reset, one of the most common next steps is to see how it is being used in your organization.  For example, you may want to get insight into how users are registering for password reset, or how many password resets have been done in the last few days.  Here are some of the common questions that you will be able to answer with the Password Management reports that exist in the [Azure Management Portal](https://manage.windowsazure.com) today:

- How many people have registered for password reset?
- Who has registered for password reset?
- What data are people registering?
- How many people reset their passwords in the last 7 days?
- What are the most common methods users or admins use to reset their passwords?
- What are common issues users or admins face when attempting to use password reset?
- What admins are resetting their own passwords frequently?
- Is there any suspicious activity going on with password reset?


## How to view Password Management reports
To find the Password Management reports, follow the steps below:

1.	Click on the **Active Directory** extension in the [Azure Management Portal](https://manage.windowsazure.com).
2.	Select your directory from the list that appears in the portal.
3.	Click on the **Reports** tab.
4.	Look under the **Activity Logs** section.
5.	Select either the **Password reset activity** report or the **Password reset registration activity** report.

    ![][001]

## How to access Password Management Reports from an API
As of August 2015, the Azure AD Reports and Events now supports retrieving all of the information included in the Password Reset and Password Reset Registration reports.

To access this data, you'll need to write a small app or script to retrieve it from our servers. [Learn how to get started with the Azure AD Reporting API](active-directory-reporting-api-getting-started.md).

Once you have a working script, you'll next want to examine the password reset and registration events that you can retrieve to meet your scenarios.

- [SsprActivityEvent](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprActivityEvent): Lists the columns available for password reset events
- [SsprRegistrationActivityEvent](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprRegistrationActivityEvent): Lists the columns available for password reset registration events

## View password Reset registration activity

The password reset registration activity report shows all password reset registrations that have occurred in your organization.  A password reset registration is displayed in this report for any user who has successfully registered authentication information at the password reset registration portal ([http://aka.ms/ssprsetup](http://aka.ms/ssprsetup)).

- **Max time range**: 1 month
- **Max number of rows**: unlimited
- **Downloadable**: Yes, via CSV file

    ![][002]

### Description of report columns
The following list explains each of the report columns in detail:

- **User** – the user who attempted a password reset registration operation.
- **Role** – the role of the user in the directory.
- **Date and Time** – the date and time of the attempt.
- **Data Registered** – what authentication data the user provided during password reset registration.

### Description of report values
The following table describes the different values allowed for each column:

Column|Allowed values and their meanings
---|---
Data Registered| **Alternate Email** – user used alternate email or authentication email to authenticate<p><p>**Office Phone**– user used office phone to authenticate<p>**Mobile Phone** - user used mobile phone or authentication phone to authenticate<p>**Security Questions** – user used security questions to authenticate<p>**Any combination of the above (e.g. Alternate Email + Mobile Phone)** – occurs when a 2 gate policy is specified and shows which two methods the user used to authentication his password reset request.

## View password reset activity

This report shows all password reset attempts that have occurred in your organization.

- **Max time range**: 1 month
- **Max number of rows**: unlimited
- **Downloadable**: Yes, via CSV file

    ![][003]

### Description of report columns
The following list explains each of the report columns in detail:

1. **User** – the user who attempted a password reset operation (based on the User ID field provided when the user comes to reset a password).
2. **Role** – the role of the user in the directory.
3. **Date and Time** – the date and time of the attempt.
4. **Method(s) Used** – what authentication methods the user used for this reset operation.
5. **Result** – the end result of the password reset operation.
6. **Details** – the details of why the password reset resulted in the value it did.  Also includes any mitigation steps you might take to resolve an unexpected error.

### Description of report values
The following table describes the different values allowed for each column:

Column|Allowed values and their meanings
---|---
Methods Used|**Alternate Email** – user used alternate email or authentication email to authenticate<p>**Office Phone** – user used office phone to authenticate<p>**Mobile Phone** – user used mobile phone or authentication phone to authenticate<p>**Security Questions** – user used security questions to authenticate<p>**Any combination of the above (e.g. Alternate Email + Mobile Phone)** – occurs when a 2 gate policy is specified and shows which two methods the user used to authentication his password reset request.
Result|**Abandoned** – user started password reset but then stopped halfway through without completing<p>**Blocked** – user’s account was prevented to use password reset due to attempting to use the password reset page or a single password reset gate too many times in a 24 hour period<p>**Cancelled** – user started password reset but then clicked the cancel button to cancel the session part way through <p>**Contacted Admin** – user had a problem during his session that he could not resolve, so the user clicked the “Contact your administrator” link instead of finishing the password reset flow<p>**Failed** – user was not able to reset a password, likely because the user was not configured to use the feature (e.g. no license, missing authentication info, password managed on-prem but writeback is off).<p>**Succeeded** – password reset was successful.
Details|See table below

### Allowed values for details column
Below is the list of result types you may expect when using the password reset activity report:

Details | Result Type
----|----
User abandoned after completing the email verification option  | Abandoned
User abandoned after completing the mobile SMS verification option|Abandoned
User abandoned after completing the mobile voice call verification option | Abandoned
User abandoned after completing the office voice call verification option | Abandoned
User abandoned after completing the security questions option|Abandoned
User abandoned after entering their user ID| Abandoned
User abandoned after starting the email verification option|Abandoned
User abandoned after starting the mobile SMS verification option|Abandoned
User abandoned after starting the mobile voice call verification option|Abandoned
User abandoned after starting the office voice call verification option|Abandoned
User abandoned after starting the security questions option| Abandoned
User abandoned before selecting a new password| Abandoned
User abandoned while selecting a new password| Abandoned
User entered too many invalid SMS verification codes and is blocked for 24 hours|Blocked
User tried mobile phone voice verification too many times and is blocked for 24 hours|Blocked
User tried office phone voice verification too many times and is blocked for 24 hours |Blocked
User tried to answer security questions too many times and is blocked for 24 hours| Blocked
User tried to verify a phone number too many times and is blocked for 24 hours|Blocked
User cancelled before passing the required authentication methods|Cancelled
User cancelled before submitting a new password|Cancelled
User contacted an admin after trying the email verification option |Contacted admin
User contacted an admin after trying the mobile SMS verification option|Contacted admin
User contacted an admin after trying the mobile voice call verification option|Contacted admin
User contacted an admin after trying the office voice call verification option |Contacted admin
User contacted an admin after trying the security question verification option|Contacted admin
Password reset is not enabled for this user. Enable password reset under the configure tab to resolve this|  Failed
User does not have a license. You can add a license to the user to resolve this|Failed
User tried to reset from a device without cookies enabled| Failed
User's account has insufficient authentication methods defined. Add authentication info to resolve this|Failed
User's password is managed on-premises. You can enable Password Writeback to resolve this|Failed
We could not reach your on-premises password reset service. Check your sync machine's event log|Failed
We encountered a problem while resetting the user's on-premises password. Check your sync machine's event log | Failed
This user is not a member of the password reset users group. Add this user to that group to resolve this.|Failed
Password reset has been disabled entirely for this tenant. See [here](http://aka.ms/ssprtroubleshoot) to resolve this. | Failed
User successfully reset password|Succeeded

## Links to password reset documentation
Below are links to all of the Azure AD Password Reset documentation pages:

* **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).
* [**How it works**](active-directory-passwords-how-it-works.md) - learn about the six different components of the service and what each does
* [**Getting started**](active-directory-passwords-getting-started.md) - learn how to allow you users to reset and change their cloud or on-premises passwords
* [**Customize**](active-directory-passwords-customize.md) - learn how to customize the look & feel and behavior of the service to your organization's needs
* [**Best practices**](active-directory-passwords-best-practices.md) - learn how to quickly deploy and effectively manage passwords in your organization
* [**FAQ**](active-directory-passwords-faq.md) - get answers to frequently asked questions
* [**Troubleshooting**](active-directory-passwords-troubleshoot.md) - learn how to quickly troubleshoot problems with the service
* [**Learn more**](active-directory-passwords-learn-more.md) - go deep into the technical details of how the service works



[001]: ./media/active-directory-passwords-get-insights/001.jpg "Image_001.jpg"
[002]: ./media/active-directory-passwords-get-insights/002.jpg "Image_002.jpg"
[003]: ./media/active-directory-passwords-get-insights/003.jpg "Image_003.jpg"
