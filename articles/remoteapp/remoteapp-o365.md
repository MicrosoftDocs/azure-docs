
<properties 
    pageTitle="Using Office with Azure RemoteApp" 
    description="Learn how Office and Azure RemoteApp work together" 
    services="remoteapp" 
    documentationCenter="" 
    authors="lizap" 
    manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="compute" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="09/02/2015" 
    ms.author="elizapo" />

# Using Office with Azure RemoteApp

You have two choices for hosting Office applications in Azure RemoteApp: Office 365 ProPlus or Office 2013 Professional Plus Trial.

**Hey, did you know we have a new, better article that will soon replace this? Check out [How to use your Office 365 subscription with Azure RemoteApp](remoteapp-officesubscription.md). It covers all the info you need for using Office 365 + Azure RemoteApp.**

## Office 365 ProPlus 
You can create a RemoteApp collection using the Office 365 ProPlus template image. This option allows you to extend your Office 365 service to RemoteApp. You must have an existing subscription plan and your users must be licensed for the Office 365 ProPlus service, either standalone or through the Office 365 service plans. 

RemoteApp supports Office 365 Shared Computer Activation. When you enable Shared Computer Activation, and use the [Office Deployment tool](http://www.microsoft.com/download/details.aspx?id=36778) for installation, Office 365 ProPlus installs without being activated. When a user signs into a collection that contains Office 365, Office checks to see if the user has been provisioned for Office 365 ProPlus. If so, Office temporarily activates Office 365 ProPlus - this activation persists until that users signs out of the service. 

To use Office 365 Shared Computer Activation, you need to create a [custom template](remoteapp-create-custom-image.md) and install Office 365 ProPlus there, following [these directions](https://technet.microsoft.com/library/dn782858.aspx).

You can manage your users’ Office 365 licenses at the [Office 365 Admin Portal](https://portal.office365.com/). Read more information about [Office 365 service plans](http://technet.microsoft.com/library/office-365-plan-options.aspx).  


## Office 2013 Professional Plus Trial 
During a 30-day trial of RemoteApp, you can use the Office 2013 Professional Plus (trial) template image to create a RemoteApp collection. You can assign users to this trial collection using their Azure Active Directory work accounts or Microsoft accounts. No additional subscription is required.

This is a great option to kick the tires and get a good feeling for Office in RemoteApp. However, this option is intended for evaluation and testing only. RemoteApp collections created using the Office 2013 Professional Plus (trial) template image cannot be transitioned to production mode and will be disabled at the end of the trial period.

## Switching from trial to production
When you start your 30-day free trial, a note in the RemoteApp section of the portal will tell you how long you have left in the trial before you need to transition to a paid account. You can activate your account and switch to production mode using the link in this note. 

When you activate your account, this will affect all the RemoteApp collections in your account. 

- Collections that are running with the Windows Server 2012 R2 or the Office 365 ProPlus template images will transition to production seamlessly. All user data and settings, including ongoing sessions, remain intact.
- If you have uploaded custom template images, collections using those images will also transition seamlessly.
- The Office 2013 Professional Plus (Trial) template image is intended for evaluation only. Collections running with this template image cannot be transitioned to production. They will be put in “disabled” state.


If you do not transition to production mode by the expiration of your trial, your RemoteApp collections will be disabled. Don't worry - Your settings and users’ data are saved for another 90 days, so you can still activate your service and switch to production mode without any data loss.
 