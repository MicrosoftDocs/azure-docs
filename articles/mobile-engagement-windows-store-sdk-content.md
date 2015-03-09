<properties 
	pageTitle="Azure Mobile Engagement Windows Store SDK Content" 
	description="Latest updates and procedures for Windows Store SDK for Azure Mobile Engagement" 					
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="lalathie" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="" 
	ms.topic="article" 
	ms.date="02/12/2015" 
	ms.author="kapiteir" />

#SDK Content

This document lists and describes the content of the SDK archive.

##The `Root` folder

This folder contains copies of the software licenses and a link to the online documentation.

`documentation.html` : Contains a link to the Engagement SDK online documentation for Windows 8 C\# Metro application.

This folder also contains license files.

##The `/lib` folder

This folder contains information on where to get the Engagement SDK.

`azuresdk-mobileengagement-windows-X.X.X.nupkg` : Nuget package for SDK integration.

##The `/Resources` folder

This folder contains all the resources that Engagement needs. You can also customize them to fit your app.

`EngagementConfiguration.xml` : The Engagement's configuration file, this is where you can customize Engagement settings (Engagement connection string, report crash...).

### /html folder

`EngagementNotification.html` : The `Notification` web view html design.

`EngagementAnnouncement.html` : The `Announcement` web view html design.

### /images folder

`EngagementIconNotification.png` : The brand icon displayed at the left of a notification.

`EngagementIconOk.png` : The `Ok` icon of the reach content pages for the action or validation button.

`EngagementIconNOK.png` : The `NOK` icon used when the validation button of the reach content pages is disabled.

`EngagementIconClose.png` : The `Close` icon of the reach notifications and contents for the dismiss button.

### /overlay folder

`EngagementOverlayAnnouncement.xaml` : The `Announcement` xaml design.

`EngagementOverlayAnnouncement.xaml.cs` : The `EngagementOverlayAnnouncement.xaml` linked code.

`EngagementOverlayNotification.xaml` : The `Notification` xaml design.

`EngagementOverlayNotification.xaml.cs` : The `EngagementOverlayNotification.xaml` linked code.

`EngagementPageOverlay.cs` : The `Overlay` announcement and notification display code.

##The `/src/agent` folder

This folder contains the EngagementPage.

`EngagementPage.cs` : The base class for the pages which automatically report an activity to Engagement.
