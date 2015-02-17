<properties 
	pageTitle="Azure Mobile Engagement Windows Phone SDK Integration" 
	description="Learn about the contents of the Windows Phone SDK for Azure Mobile Engagement" 					
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="lalathie" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-phone" 
	ms.devlang="" 
	ms.topic="article" 
	ms.date="01/24/2015" 
	ms.author="kapiteir" />
	
#SDK Content

This document lists and describes the content of the SDK archive.

##The `Root` folder

This folder contains copies of the software licenses and a link to the online documentation.

`documentation.html` : Contains a link to the Engagement SDK online documentation for Windows Phone.

This folder also contains license files.

##The `/lib` folder

This folder contains information on where to get the Engagement SDK.

`azuresdk-mobileengagement-windowsphone-X.X.X.nupkg` : Nuget package for SDK integration.

##The `/Resources` folder

This folder contains all the resources that Engagement needs. You can also customize them to fit your app.

`EngagementIconNotification.png` : The brand icon displayed at the left of a notification.

`EngagementIconOk.png` : The "Ok" icon of the reach pages ApplicationBar.

`EngagementIconCancel.png` : The "Cancel" icon of the reach pages ApplicationBar.

`EngagementIconCloseLight.png` : The "Close" icon of the Engagement's reach notification for the Windows Phone light theme.

`EngagementIconCloseDark.png` : The "Close" icon of the Engagement's reach notification for the Windows Phone dark theme.

`EngagementConfiguration.xml` : The Engagement's configuration file, this is where you can customize Engagement settings (Engagement connection string, report crash...).

##The `/src/agent` folder

This folder contains the EngagementPage.

`EngagementPage.cs` : The base class for the pages which automatically report an activity to Engagement.

##The `/src/reach` folder

Finally, in this folder, you will find the defaults XAML (and their C\# counterparts) of each page.

You can use them as a basis for your own pages. Just follow the comments to know what you have to do exactly.

### TextView Announcement

`EngagementDefaultTextViewAnnouncementPage.xaml`

`EngagementDefaultTextViewAnnouncementPage.xaml.cs`

### WebView Announcement

`EngagementDefaultWebViewAnnouncementPage.xaml`

`EngagementDefaultWebViewAnnouncementPage.xaml.cs`

### Poll

`EngagementDefaultPollPage.xaml`

`EngagementDefaultPollPage.xaml.cs`

### Notification

`EngagementBasicNotificationView.xaml`

`EngagementBasicNotificationView.xaml.cs`
