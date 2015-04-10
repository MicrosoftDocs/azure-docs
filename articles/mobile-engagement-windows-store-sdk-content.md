<properties 
	pageTitle="Windows Universal Apps SDK content" 
	description="Learn about the contents of the Windows Universal Apps SDK for Azure Mobile Engagement" 					
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/06/2015" 
	ms.author="piyushjo" />

#Windows Universal Apps SDK content

This document lists and describes the content deployed by the SDK in your application.

##The `/Resources` folder

This folder contains all the resources that Mobile Engagement needs. You can also customize them to fit your app.

- `EngagementConfiguration.xml` : The Mobile Engagement's configuration file, this is where you can customize Mobile Engagement settings (Mobile Engagement connection string, report crash...).

### /html folder

- `EngagementNotification.html` : The `Notification` web view html design.

- `EngagementAnnouncement.html` : The `Announcement` web view html design.

### /images folder

- `EngagementIconNotification.png` : The brand icon displayed at the left of a notification, replace this one by your brand icon.

- `EngagementIconOk.png` : The `Ok` icon of the reach content pages for the action or validation button.

- `EngagementIconNOK.png` : The `NOK` icon used when the validation button of the reach content pages is disabled.
 
- `EngagementIconClose.png` : The `Close` icon of the reach notifications and contents for the dismiss button.

### /overlay folder

- `EngagementOverlayAnnouncement.xaml` : The `Announcement` xaml design.

- `EngagementOverlayAnnouncement.xaml.cs` : The `EngagementOverlayAnnouncement.xaml` linked code.
 
- `EngagementOverlayNotification.xaml` : The `Notification` xaml design.
 
- `EngagementOverlayNotification.xaml.cs` : The `EngagementOverlayNotification.xaml` linked code.
 
- `EngagementPageOverlay.cs` : The `Overlay` announcement and notification display code.
 