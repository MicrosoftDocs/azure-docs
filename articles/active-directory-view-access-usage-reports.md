<properties 
	pageTitle="View your access and usage reports" 
	description="A topic that explains how to view access and usage reports to gain insight into the integrity and security of your organization’s directory." 
	services="active-directory" 
	documentationCenter="" 
	authors="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"
	tags="azure-classic-portal"/>

<tags 
	ms.service="active-directory" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="Justinha"/>

# View your access and usage reports

You can use Azure Active Directory ‘s access and usage reports to gain visibility into the integrity and security of your organization’s directory. With this information, a directory admin can better determine where possible security risks may lie so that they can adequately plan to mitigate those risks.

In the Azure classic portal, reports are categorized in the following ways:

- Anomaly reports – Contain sign in events that we found to be anomalous. Our goal is to make you aware of such activity and enable you to be able to make a determination about whether an event is suspicious. 
- Integrated Application reports – Provides insights into how cloud applications are being used in your organization. Azure Active Directory offers integration with thousands of cloud applications. 
- Error reports – Indicate errors that may occur when provisioning accounts to external applications.
- User-specific reports – Display device/sign in activity data for a specific user.
- Activity logs – Contain a record of all audited events within the last 24 hours, last 7 days, or last 30 days, as well as group activity changes, and password reset and registration activity.

> [AZURE.NOTE]
> 
- Some advanced anomaly and resource usage reports are only available when you enable [Azure Active Directory editions](active-directory-editions.md). Advanced reports help you improve access security, respond to potential threats and get access to analytics on device access and application usage.
- Azure Active Directory Premium and Basic editions are available for customers in China using the worldwide instance of Azure Active Directory. Azure Active Directory Premium and Basic editions are not currently supported in the Microsoft Azure service operated by 21Vianet in China. For more information, contact us at the [Azure Active Directory Forum](http://feedback.azure.com/forums/169401-azure-active-directory).


## Anomaly reports

### Sign ins from unknown sources

This report indicates users who have successfully signed in to your directory while assigned a client IP address that has been recognized by Microsoft as an anonymous proxy IP address. These proxies are often used by users that want to hide their computer’s IP address, and may be used for malicious intent – sometimes hackers use these proxies. 

Results from this report will show the number of times a user successfully signed in to your directory from that address and the proxy’s IP address.

This report is found under the **Directory** > **Reports** tab.

It is available with the free edition of Azure AD and with Azure AD Premium.

### Sign ins after multiple failures

This report indicates users who have successfully signed in after multiple consecutive failed sign in attempts. Possible causes include:

- User had forgotten their password
- User is the victim of a successful password guessing brute force attack

Results from this report will show you the number of consecutive failed sign in attempts made prior to the successful sign in and a timestamp associated with the first successful sign in.

**Report Settings**: You can configure the minimum number of consecutive failed sign in attempts that must occur before it can be displayed in the report. When you make changes to this setting it is important to note that these changes will not be applied to any existing failed sign ins that currently show up in your existing report. However, they will be applied to all future sign ins. Changes to this report can only be made by licensed admins.

This report is found under the **Directory** > **Reports** tab.

It is available with the free edition of Azure AD and with Azure AD Premium.

### Sign ins from multiple geographies

This report includes successful sign in activities from a user where two sign ins appeared to originate from different regions and the time between the sign ins makes it impossible for the user to have travelled between those regions. Possible causes include:

User is sharing their password
User is using a remote desktop to launch a web browser for sign in
A hacker has signed in to the account of a user from a different country.

Results from this report will show you the successful sign in events, together with the time between the sign ins, the regions where the sign ins appeared to originate from and the estimated travel time between those regions.

> [AZURE.NOTE]
> The travel time shown is only an estimate and may be different from the actual travel time between the locations. Also, no events are generated for sign ins between neighboring regions.

This report is found under the **Directory** > **Reports** tab.

It is available with the free edition of Azure AD and with Azure AD Premium.

### Sign ins from IP addresses with suspicious activity

This report includes sign in attempts that have been executed from IP addresses where suspicious activity has been noted. Suspicious activity includes many failed sign in attempts from the same IP address over a short period of time, and other activity that was deemed suspicious. This may indicate that a hacker has been trying to sign in from this IP address.

Results from this report will show you sign in attempts that were originated from an IP address where suspicious activity was noted, together with the timestamp associated with the sign in.

This report is found under the **Directory** > **Reports** tab.

It is available only with Azure AD Premium.

### Anomalous sign in activity

This report includes sign ins that have been identified as “anomalous” by our machine learning algorithms. Reasons for marking a sign in attempt as irregular include unexpected sign in locations, time of day and locations or a combination of these. This may indicate that a hacker has been trying to sign in using this account. The machine learning algorithm classifies events as “anomalous” or “suspicious”, where “suspicious” indicates a higher likelihood of a security breach.

Results from this report will show you these sign ins, together with the classification, location and a timestamp associated with each sign in.

This report is found under the **Directory** > **Reports** tab.

It is available only with Azure AD Premium.

> [AZURE.NOTE]
> We will send an email notification to the global admins if we encounter 10 or more anomalous sign in events within a span of 30 days or less. Please be sure to include aad-alerts-noreply@mail.windowsazure.com in your safe senders list.

### Sign ins from possibly infected devices

Use this report when you want to see sign ins from devices on which some malware (malicious software) may be running. We correlate IP addresses of sign ins against IP addresses from which an attempt was made to contact a malware server.

Recommendation: Since this report assumes an IP address was associated with the same device in both cases, we recommend that you contact the user and scan the user's device to be certain.

For more information about how to address malware infections, see the [Malware Protection Center](http://go.microsoft.com/fwlink/?linkid=335773). 

This report is found under the **Directory** > **Reports** tab.

It is available only with Azure AD Premium.

### Users with anomalous sign in activity

Use this report when you want to view all user accounts for which anomalous sign in activity has been identified. This report includes data from all other anomalous activity reports. Results from this report will show you details about the user, the reason why the sign in event was identified as anomalous, the date and time, and other relevant information about the event.

This report is found under the **Directory** > **Reports** tab.

It is available only with Azure AD Premium.

## Integrated Application reports

### Application usage: summary

Use this report when you want to see usage for all the SaaS applications in your directory. This report is based on the number of times users have clicked on the application in the Access Panel. 

This report is found under the **Directory** > **Reports** tab.

It is available only with Azure AD Premium.

### Application usage: detailed

Use this report when you want to see how much a specific SaaS application is being used. This report is based on the number of times users have clicked on the application in the Access Panel.

This report is found under the **Directory** > **Reports** tab.

It is available only with Azure AD Premium.

### Application dashboard

This report indicates cumulative sign ins to the application by users in your organization, over a selected time interval. The chart on the dashboard page will help you identify trends for all usage of that application.

This report is found under the **Directory** > **Application** > **Dashboard** tab.

It is available with the free edition of Azure AD and with Azure AD Premium.

## Error reports

### Account provisioning errors

Use this to monitor errors that occur during the synchronization of accounts from SaaS applications to Azure Active Directory. 

This report is found under the **Directory** > **Reports** tab.

It is available with the free edition of Azure AD and with Azure AD Premium.

## User-specific reports

### Devices

Use this report when you want to see the IP address and geographical location of devices that a specific user has used to access Azure Active Directory.

This report is found under the **Directory** > **User** > **Devices** tab.

It is available only with Azure AD Premium.

### Activity

Use this report when you want to see the sign in activity for a user. The report includes information like the application signed into, device used, IP address, and location. We do not collect the history for users that sign in with a Microsoft account.

This report is found under the **Directory** > **User** > **Devices** tab.

It is available with the free edition of Azure AD and with Azure AD Premium.

## Activity logs

### Audit report

Use this report when you want to see a record of all audited events within the last 24 hours, last 7 days, or last 30 days. 

This report is found under the **Directory** > **Reports** tab.

It is available with the free edition of Azure AD and with Azure AD Premium.

For more information, see [Azure Active Directory Audit Report Events](active-directory-reporting-audit-events.md)

### Groups activity report

Use this report to see all activity for the self-service managed groups in your directory. 

This report is found under the **Directory** > **User** > **Devices** tab.

It is available only with Azure AD Premium.

### Password reset registration activity report

shows all password reset registrations that have occurred in your organization

This report is found under the **Directory** > **Reports** tab.

It is available only with Azure AD Premium.

### Password reset activity

shows all password reset attempts that have occurred in your organization.

This report is found under the **Directory** > **Reports** tab.

It is available only with Azure AD Premium.

## Things to consider if you suspect security breach

If you suspect that a user account may be compromised or any kind of suspicious user activity that may lead to a security breach of your directory data in the cloud, you may want to consider one or more of the following actions:

- Contact the user to verify the activity
- Reset the user's password
- [Enable multi-factor authentication](http://go.microsoft.com/fwlink/?linkid=335774) for additional security

## View or download a report

1. In the Azure classic portal, click **Active Directory**, click the name of your organization’s directory, and then click **Reports**.
2. On the Reports page, click the report you want to view and/or download.
    > [AZURE.NOTE] If this is the first time you have used the reporting feature of Azure Active Directory, you will see a message to Opt In. If you agree, click the check mark icon to continue.
3. Click the drop-down menu next to Interval, and then select one of the following time ranges that should be used when generating this report:
    - Last 24 hours
    - Last 7 days
    - Last 30 days
4. Click the check mark icon to run the report.
5. If applicable, click **Download** to download the report to a compressed file in Comma Separated Values (CSV) format for offline viewing or archiving purposes.

## Ignore an event

If you are viewing any anomaly reports, you may notice that you can ignore various events that show up in related reports. To ignore an event, simply highlight the event in the report and then click **Ignore**. The **Ignore** button will permanently remove the highlighted event from the report and can only be used by licensed global admins.

## Automatic email notifications 

### What reports generate email notifications

At this time, only the Anomalous Sign In Activity report and the Users with Anomalous Sign In Activity report are using the email notification system.

### What triggers the email notification to be sent?

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

### Who receives the email notifications?

The email is sent to all global admins who have been assigned an Active Directory Premium license. To ensure it is delivered, we send it to the admins Alternate Email Address as well. Admins should include aad-alerts-noreply@mail.windowsazure.com in their safe senders list so they don’t miss the email.

### How often are these emails sent?

Once an email is sent, the next one will be sent only when 10 or more new Anomalous Sign In events are encountered within 30 days of sending that email. How do I access the report mentioned in the email? 

When you click on the link, you will be redirected to the report page within the Azure classic portal. In order to access the report, you need to be both:

- An admin or co-admin of your Azure subscription
- A global administrator in the directory, and assigned an Active Directory Premium license. For more information, see Azure Active Directory editions. 

### Can I turn off these emails?

Yes, to turn off notifications related to anomalous sign ins within the Azure classic portal, click **Configure**, and then select **Disabled** under the **Notifications** section.

## What's next

- [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md)
- [Add company branding to your Sign In and Access Panel pages](active-directory-add-company-branding.md)
