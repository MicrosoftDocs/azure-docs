<properties 
	pageTitle="Azure Multi-Factor Authentication One-Time Bypass" 
	description="Learn about how to configure a one-time bypass with MFA" 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="terrylan" 
	editor="bryanla"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/02/2015" 
	ms.author="billmath"/>

# One-time bypass in Azure Multi-Factor Authentication
The following document describes how to setup and enable the one-time bypass feature for Azure Multi-Factor Authentication. Multi-Factor Authentication can be bypassed to allow a user to authenticate a single time. The bypass is temporary and expires after the specified number of seconds. Use the following procedures to enable a one-time bypass or to revoke a one-time bypass. The following procedures are covered in this document.

## To create a one-time bypass

<ol>
<li>Log on to http://azure.microsoft.com</li>
<li>On the left, select Active Directory.</li>
<li>At the top select Multi-Factor Auth Providers. This will bring up a list of your Multi-Factor Auth Providers.</li>
<li>If you have more than one Multi-Factor Auth Provider, select the one that is associated with the directory for the user you wish to create a one-time bypass for and click Manage at the bottom of the page. If you have only one, just click Manage. This will open the Azure Multi-Factor Authentication Management Portal.</li>
<li>On the Azure Multi-Factor Authentication Management Portal, on the left, under User Administration, click Settings.</li>

<center>![Cloud](./media/multi-factor-authentication-manage-one-time-bypass/create1.png)</center>

<li>On the One-Time Bypass page, click New One-Time Bypass.</li>
<li>Enter the user’s username, the number of seconds that the bypass will exist, the reason for the bypass and click Bypass.</li>

<center>![Cloud](./media/multi-factor-authentication-manage-one-time-bypass/create2.png)</center>

<li>At this point, the user must sign in before the one-time bypass expires.</li>

## To view the one-time bypass report

1. Log on to http://azure.microsoft.com
2. On the left, select Active Directory.
3. At the top select Multi-Factor Auth Providers. This will bring up a list of your Multi-Factor Auth Providers.
4. If you have more than one Multi-Factor Auth Provider, select the one you wish to view the fraud alert report and click Manage at the bottom of the page. If you have only one, just click Manage. This will open the Azure Multi-Factor Authentication Management Portal.
5. On the Azure Multi-Factor Authentication Management Portal, on the left, under View A Report, click One-Time Bypass.
6. Specify the date range that you wish to view in the report. Also you can specify any specific usernames, phone numbers and the users status.
7. Click Run. This will bring up a report similar to the one below. You can also click Export to CSV if you wish to export the report.

<center>![Cloud](./media/multi-factor-authentication-manage-one-time-bypass/report.png)</center>


