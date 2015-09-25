<properties 
	pageTitle="Azure Multi-Factor Authentication Reports" 
	description="This describes how to use the Azure Multi-Factor Authentication feature - reports." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtand"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/24/2015" 
	ms.author="billmath"/>

# Reports in Azure Multi-Factor Authentication

Azure Multi-Factor Authentication provides several reports that can be used by you and your organization. These reports can be accessed through the Multi-Factor Authentication Management Portal. The following is a list of the available reports.

You can access reports through the Azure Management portal.

Name| Description
:------------- | :------------- | 
Usage | The usage reports display information on overall usage, user summary and user details.
Server Status|This report displays the status of Multi-Factor Authentication Servers associated with your account.
Blocked User History|These reports show the history of requests to block or unblock users.
Bypassed User History|Shows the history of requests to bypass Multi-Factor Authentication for a user's phone number.
Fraud Alert|Shows a history of fraud alerts submitted during the date range you specified.
Queued|Lists reports queued for processing and their status. A link to download or view the report is provided when the report is complete.

## To view reports

1. Log on to [http://azure.microsoft.com](http://azure.microsoft.com)
2. On the left, select Active Directory.
3. At the top select Multi-Factor Auth Providers. This will bring up a list of your Multi-Factor Auth Providers.
4. If you have more than one Multi-Factor Auth Provider, select the one you wish to view the fraud alert report and click Manage at the bottom of the page. If you have only one, just click Manage. This will open the Azure Multi-Factor Authentication Management Portal.
5. On the Azure Multi-Factor Authentication Management Portal, on the left, you will see View a Report.  From here you can select the reports described above.


 
<center>![Cloud](./media/multi-factor-authentication-manage-reports/report.png)</center>


**Additional Resources**

* [For Users](multi-factor-authentication-end-user.md)
* [Azure Multi-Factor Authentication on MSDN](https://msdn.microsoft.com/library/azure/dn249471.aspx)
 