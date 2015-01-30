<properties pageTitle="Using Office3 65 with Azure RemoteApp" description="Learn how Office 365 and Azure RemoteApp work together" services="remoteapp" solutions="" documentationCenter="" authors="lizap" manager="mbaldwin" />

<tags ms.service="remoteapp" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/11/2014" ms.author="elizapo" />

#Using Office 365 with Azure RemoteApp

You have two choices for hosting Office applications in RemoteApp: Office 365 ProPlus or Office 2013 Professional Plus Trial.

##Office 365 ProPlus 
You can create a RemoteApp collection using the Office 365 ProPlus template image. This option allows you to extend your Office 365 service to RemoteApp. You must have an existing subscription plan and your users must be licensed for the Office 365 ProPlus service, either standalone or through the Office 365 service plans. The RemoteApp instances of the Office apps will count as one of five installation instances allowed for each user, and they will be fully activated. You can manage your users’ Office 365 licenses at the [Office 365 Admin Portal](https://portal.office365.com/). Read more information about [Office 365 service plans](http://technet.microsoft.com/library/office-365-plan-options.aspx).  

The Office 365 ProPlus option is available during both the 30-day free trial and in production mode, but it is the only supported option after the trial expires.  

Note that, you can also create a custom template image containing Office 365 ProPlus. To construct such a template image, follow the [deployment steps](http://technet.microsoft.com/en-us/library/dn782858(v=office.15).aspx) for Office 365 ProPlus on RDS.

##Office 2013 Professional Plus Trial 
During a 30-day trial of RemoteApp, you can use the Office 2013 Professional Plus (trial) template image to create a RemoteApp collection. You can assign users to this trial collection using their Azure Active Directory work accounts or Microsoft accounts. No additional subscription is required.

This is a great option to kick the tires and get a good feeling for Office in RemoteApp. However, this option is intended for evaluation and testing only. RemoteApp collections created using the Office 2013 Professional Plus (trial) template image cannot be transitioned to production mode and will be disabled at the end of the trial period.

##Switching from trial to production
When you start your 30-day free trial, a note in the RemoteApp section of the portal will tell you how long you have left in the trial before you need to transition to a paid account. You can activate your account and switch to production mode using the link in this note. 

When you activate your account, this will affect all the RemoteApp collections in your account. 

- Collections that are running with the Windows Server 2012 R2 or the Office 365 ProPlus template images will transition to production seamlessly. All user data and settings, including ongoing sessions, remain intact.
- If you have uploaded custom template images, collections using those images will also transition seamlessly.
- The Office 2013 Professional Plus (Trial) template image is intended for evaluation only. Collections running with this template image cannot be transitioned to production. They will be put in “disabled” state.


If you do not transition to production mode by the expiration of your trial, your RemoteApp collections will be disabled. Don't worry - Your settings and users’ data are saved for another 90 days, so you can still activate your service and switch to production mode without any data loss.
