<properties
	pageTitle="View your access and usage reports"
	description="A topic that explains how to view access and usage reports to gain insight into the integrity and security of your organization’s directory."
	services="active-directory"
	documentationCenter=""
	authors="kenhoff"
	manager="TerryLan"
	editor="LisaToft"/>

<tags
	ms.service="active-directory"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/24/2015"
	ms.author="kenhoff;Justinha"/>

# View your access and usage reports

You can use Azure Active Directory's access and usage reports to gain visibility into the integrity and security of your organization’s directory. With this information, a directory admin can better determine where possible security risks may lie so that they can adequately plan to mitigate those risks.

In the Azure Management Portal, reports are categorized in the following ways:

- Anomaly reports – Contain sign in events that we found to be anomalous. Our goal is to make you aware of such activity and enable you to be able to make a determination about whether an event is suspicious.
- Integrated Application reports – Provides insights into how cloud applications are being used in your organization. Azure Active Directory offers integration with thousands of cloud applications.
- Error reports – Indicate errors that may occur when provisioning accounts to external applications.
- User-specific reports – Display device/sign in activity data for a specific user.
- Activity logs – Contain a record of all audited events within the last 24 hours, last 7 days, or last 30 days, as well as group activity changes, and password reset and registration activity.

> [AZURE.NOTE]
>
- Some advanced anomaly and resource usage reports are only available when you enable [Azure Active Directory Premium](active-directory-get-started-premium.md). Advanced reports help you improve access security, respond to potential threats and get access to analytics on device access and application usage.
- Azure Active Directory Premium and Basic editions are available for customers in China using the worldwide instance of Azure Active Directory. Azure Active Directory Premium and Basic editions are not currently supported in the Microsoft Azure service operated by 21Vianet in China. For more information, contact us at the [Azure Active Directory Forum](http://feedback.azure.com/forums/169401-azure-active-directory).

## Report descriptions

|	Report												|	Description																					|
|	------												|	-----																						|
|	Sign ins from unknown sources						|	May indicate an attempt to sign in without being traced.									|
|	Sign ins after multiple failures					|	May indicate a successful brute force attack.												|
|	Sign ins from multiple geographies					|	May indicate that multiple users are signing in with the same account.						|
|	Sign ins from IP addresses with suspicious activity	|	May indicate a successful sign in after a sustained intrusion attempt.						|
|	Sign ins from possibly infected devices				|	May indicate an attempt to sign in from possibly infected devices.							|
|	Irregular sign in activity							|	May indicate events anomalous to users’ sign in patterns.									|
|	Users with anomalous sign in activity				|	Indicates users whose accounts may have been compromised.									|
|	Users with leaked credentials						|	Users with leaked credentials																|
|	Audit report										|	Audited events in your directory															|
|	Password reset activity								|	Provides a detailed view of password resets that occur in your organization.				|
|	Password reset registration activity				|	Provides a detailed view of password reset registrations that occur in your organization.	|
|	Self service groups activity						|	Provides an activity log to all group self service activity in your directory				|
|	Application usage									|	Provides a usage summary for all SaaS applications integrated with your directory.			|
|	Account provisioning activity						|	Provides a history of attempts to provision accounts to external applications.				|
|	Password rollover status							|	Provides a detailed overview of automatic password rollover status of SaaS applications.	|
|	Account provisioning errors							|	Indicates an impact to users’ access to external applications.								|
|	RMS usage											|	Provides a summary for Rights Management usage												|
|	Most active RMS users								|	Lists top 1000 active users who accessed RMS-protected files								|
|	RMS device usage									|	Lists devices used for accessing RMS-protected files										|
|	RMS enabled application usage						|	Provides usage of RMS enabled applications													|

## Report editions

|	Report												|	Free	|	Basic	|	Premium		|
|	------												|	----	|	-----	|	--------	|
|	Sign ins from unknown sources						|	✓		|	✓	|	✓			|
|	Sign ins after multiple failures					|	✓		|	✓	|	✓			|
|	Sign ins from multiple geographies					|	✓		|	✓	|	✓			|
|	Sign ins from IP addresses with suspicious activity	|			|		|	✓			|
|	Sign ins from possibly infected devices				|			|		|	✓			|
|	Irregular sign in activity							|			|		|	✓			|
|	Users with anomalous sign in activity				|			|		|	✓			|
|	Users with leaked credentials						|			|		|	✓			|
|	Audit report										|			|		|	✓			|
|	Password reset activity								|			|		|	✓			|
|	Password reset registration activity				|			|		|	✓			|
|	Self service groups activity						|			|		|	✓			|
|	Application usage									|			|		|	✓			|
|	Account provisioning activity						|	✓		|	✓	|	✓			|
|	Password rollover status							|			|		|	✓			|
|	Account provisioning errors							|	✓		|	✓	|	✓			|
|	RMS usage											|			|		|	RMS Only	|
|	Most active RMS users								|			|		|	RMS Only	|
|	RMS device usage									|			|		|	RMS Only	|
|	RMS enabled application usage						|			|		|	RMS Only	|

## Report details

### Sign ins from unknown sources

| Description        | Report location |
| :-------------     | :-------        |
| <p>This report indicates users who have successfully signed in to your directory while assigned a client IP address that has been recognized by Microsoft as an anonymous proxy IP address. These proxies are often used by users that want to hide their computer’s IP address, and may be used for malicious intent – sometimes hackers use these proxies. </p><p> Results from this report will show the number of times a user successfully signed in to your directory from that address and the proxy’s IP address.</p> | Directory > Reports tab |

![Sign ins from unknown sources](./media/active-directory-view-access-usage-reports/signInsFromUnknownSources.PNG)]

### Sign ins after multiple failures

| Description        | Report location |
| :-------------     | :-------        |
| This report indicates users who have successfully signed in after multiple consecutive failed sign in attempts. Possible causes include: <ul><li>User had forgotten their password</li><li>User is the victim of a successful password guessing brute force attack</li></ul><p>Results from this report will show you the number of consecutive failed sign in attempts made prior to the successful sign in and a timestamp associated with the first successful sign in.</p><p><b>Report Settings</b>: You can configure the minimum number of consecutive failed sign in attempts that must occur before it can be displayed in the report. When you make changes to this setting it is important to note that these changes will not be applied to any existing failed sign ins that currently show up in your existing report. However, they will be applied to all future sign ins. Changes to this report can only be made by licensed admins. | Directory > Reports tab |

![Sign ins after multiple failures](./media/active-directory-view-access-usage-reports/signInsAfterMultipleFailures.PNG)]


### Sign ins from multiple geographies

| Description        | Report location |
| :-------------     | :-------        |
| <p>This report includes successful sign in activities from a user where two sign ins appeared to originate from different regions and the time between the sign ins makes it impossible for the user to have travelled between those regions. Possible causes include:</p><ul><li>User is sharing their password</li><li>User is using a remote desktop to launch a web browser for sign in</li><li>A hacker has signed in to the account of a user from a different country.</li></ul><p>Results from this report will show you the successful sign in events, together with the time between the sign ins, the regions where the sign ins appeared to originate from and the estimated travel time between those regions.</p><p>The travel time shown is only an estimate and may be different from the actual travel time between the locations. Also, no events are generated for sign ins between neighboring regions.</p> | Directory > Reports tab |

![Sign ins from multiple geographies](./media/active-directory-view-access-usage-reports/signInsFromMultipleGeographies.PNG)]


### Sign ins from IP addresses with suspicious activity

| Description        | Report location |
| :-------------     | :-------        |
| <p>This report includes sign in attempts that have been executed from IP addresses where suspicious activity has been noted. Suspicious activity includes many failed sign in attempts from the same IP address over a short period of time, and other activity that was deemed suspicious. This may indicate that a hacker has been trying to sign in from this IP address.</p><p>Results from this report will show you sign in attempts that were originated from an IP address where suspicious activity was noted, together with the timestamp associated with the sign in.</p> | Directory > Reports tab |

![Sign ins from IP addresses with suspicious activity](./media/active-directory-view-access-usage-reports/signInsFromIPAddressesWithSuspiciousActivity.PNG)]


### Anomalous sign in activity

| Description        | Report location |
| :-------------     | :-------        |
| <p>This report includes sign ins that have been identified as “anomalous” by our machine learning algorithms. Reasons for marking a sign in attempt as irregular include unexpected sign in locations, time of day and locations or a combination of these. This may indicate that a hacker has been trying to sign in using this account. The machine learning algorithm classifies events as “anomalous” or “suspicious”, where “suspicious” indicates a higher likelihood of a security breach.</p><p>Results from this report will show you these sign ins, together with the classification, location and a timestamp associated with each sign in.</p><p>We will send an email notification to the global admins if we encounter 10 or more anomalous sign in events within a span of 30 days or less. Please be sure to include aad-alerts-noreply@mail.windowsazure.com in your safe senders list.</p> | Directory > Reports tab |



### Sign ins from possibly infected devices

| Description        | Report location |
| :-------------     | :-------        |
| <p>Use this report when you want to see sign ins from devices on which some malware (malicious software) may be running. We correlate IP addresses of sign ins against IP addresses from which an attempt was made to contact a malware server.</p><p>Recommendation: Since this report assumes an IP address was associated with the same device in both cases, we recommend that you contact the user and scan the user's device to be certain.</p><p>For more information about how to address malware infections, see the [Malware Protection Center](http://go.microsoft.com/fwlink/?linkid=335773). </p> | Directory > Reports tab |

![Sign ins from possibly infected devices](./media/active-directory-view-access-usage-reports/signInsFromPossiblyInfectedDevices.PNG)]


### Users with anomalous sign in activity

| Description        | Report location |
| :-------------     | :-------        |
| <p>Use this report when you want to view all user accounts for which anomalous sign in activity has been identified. This report includes data from all other anomalous activity reports. Results from this report will show you details about the user, the reason why the sign in event was identified as anomalous, the date and time, and other relevant information about the event.</p> | Directory > Reports tab |

![Users with anomalous sign in activity](./media/active-directory-view-access-usage-reports/usersWithAnomalousSignInActivity.PNG)]


## Integrated Application reports

### Application usage: summary

| Description        | Report location |
| :-------------     | :-------        |
| Use this report when you want to see usage for all the SaaS applications in your directory. This report is based on the number of times users have clicked on the application in the Access Panel. | Directory > Reports tab |

![Application usage summary](./media/active-directory-view-access-usage-reports/applicationUsage.PNG)]


### Application usage: detailed

| Description        | Report location |
| :-------------     | :-------        |
| Use this report when you want to see how much a specific SaaS application is being used. This report is based on the number of times users have clicked on the application in the Access Panel. | Directory > Reports tab |

### Application dashboard

| Description        | Report location |
| :-------------     | :-------        |
| This report indicates cumulative sign ins to the application by users in your organization, over a selected time interval. The chart on the dashboard page will help you identify trends for all usage of that application. | Directory > Application > Dashboard tab |

## Error reports

### Account provisioning errors

| Description        | Report location |
| :-------------     | :-------        |
| Use this to monitor errors that occur during the synchronization of accounts from SaaS applications to Azure Active Directory. | Directory > Reports tab |

![Account provisioning errors](./media/active-directory-view-access-usage-reports/accountProvisioningErrors.PNG)]


## User-specific reports

### Devices

| Description        | Report location |
| :-------------     | :-------        |
| Use this report when you want to see the IP address and geographical location of devices that a specific user has used to access Azure Active Directory. | Directory > Users > <i>User</i> > Devices tab |

### Activity

| Description        | Report location |
| :-------------     | :-------        |
| Shows the sign in activity for a user. The report includes information like the application signed into, device used, IP address, and location. We do not collect the history for users that sign in with a Microsoft account. | Directory > Users > <i>User</i> > Activity tab |

#### Sign in events included in the User Activity report

Only certain types of sign in events will appear in the User Activity report.

| Event type										| Included?		|
| ----------------------								| ---------		|
| Sign ins to the [Access Panel](http://myapps.microsoft.com/)				| Yes			|
| Sign ins to the [Azure Management Portal](https://manage.windowsazure.com/)		| Yes			|
| Sign ins to the [Microsoft Azure Portal](http://portal.azure.com/)			| Yes			|
| Sign ins to the [Office 365 portal](http://portal.office.com/)			| Yes			|
| Sign ins to a native application, like Outlook (see exception below)			| Yes			|
| Sign ins to a federated/provisioned app through the Access Panel, like Salesforce	| Yes			|
| Sign ins to a password-based app through the Access Panel, like Twitter		| Yes			|
| Sign ins to a custom business app that has been added to the directory		| No (Coming soon)	|
| Sign ins to an Azure AD Application Proxy app that has been added to the directory	| No (Coming soon)	|

> Note: To reduce the amount of noise in this report, sign ins to the [Lync/Skype for Business](http://products.office.com/en-us/skype-for-business/online-meetings) native app and by the [Microsoft Online Services Sign-In Assistant](http://community.office365.com/en-us/w/sso/534.aspx) are not shown.

## Activity logs

### Audit report

| Description        | Report location |
| :-------------     | :-------        |
| Shows a record of all audited events within the last 24 hours, last 7 days, or last 30 days. <br /> For more information, see [Azure Active Directory Audit Report Events](active-directory-reporting-audit-events.md) | Directory > Reports tab |

![Audit report](./media/active-directory-view-access-usage-reports/auditReport.PNG)]


### Groups activity report

| Description        | Report location |
| :-------------     | :-------        |
| Shows all activity for the self-service managed groups in your directory. | Directory > Users > <i>User</i> > Devices tab |

![Self service groups activity](./media/active-directory-view-access-usage-reports/selfServiceGroupsActivity.PNG)]


### Password reset registration activity report

| Description        | Report location |
| :-------------     | :-------        |
| Shows all password reset registrations that have occurred in your organization | Directory > Reports tab |

![Password reset registration activity](./media/active-directory-view-access-usage-reports/passwordResetRegistrationActivity.PNG)]


### Password reset activity

| Description        | Report location |
| :-------------     | :-------        |
| Shows all password reset attempts that have occurred in your organization. | Directory > Reports tab |

![Password reset activity](./media/active-directory-view-access-usage-reports/passwordResetActivity.PNG)]


## Things to consider if you suspect security breach

If you suspect that a user account may be compromised or any kind of suspicious user activity that may lead to a security breach of your directory data in the cloud, you may want to consider one or more of the following actions:

- Contact the user to verify the activity
- Reset the user's password
- [Enable multi-factor authentication](http://go.microsoft.com/fwlink/?linkid=335774) for additional security

## View or download a report

1. In the Azure Management Portal, click **Active Directory**, click the name of your organization’s directory, and then click **Reports**.
2. On the Reports page, click the report you want to view and/or download.
    >
    > [AZURE.NOTE] If this is the first time you have used the reporting feature of Azure Active Directory, you will see a message to Opt In. If you agree, click the check mark icon to continue.

3. Click the drop-down menu next to Interval, and then select one of the following time ranges that should be used when generating this report:
    - Last 24 hours
    - Last 7 days
    - Last 30 days
4. Click the check mark icon to run the report.
	- Up to 1000 events will be shown in the Azure Management Portal.
5. If applicable, click **Download** to download the report to a compressed file in Comma Separated Values (CSV) format for offline viewing or archiving purposes.
	- Up to 75,000 events will be included in the downloaded file.

## Ignore an event

If you are viewing any anomaly reports, you may notice that you can ignore various events that show up in related reports. To ignore an event, simply highlight the event in the report and then click **Ignore**. The **Ignore** button will permanently remove the highlighted event from the report and can only be used by licensed global admins.

## Automatic email notifications

For more information about Azure AD's reporting notifications, check out [Azure Active Directory Reporting Notifications](active-directory-reporting-notifications.md).

## What's next

- [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md)
- [Add company branding to your Sign In and Access Panel pages](active-directory-add-company-branding.md)
