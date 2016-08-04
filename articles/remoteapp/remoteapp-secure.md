
<properties
    pageTitle="Secure apps and resources in Azure RemoteApp | Microsoft Azure"
    description="Learn how to lock down apps and resources in Azure RemoteApp"
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
    ms.date="08/15/2016"
    ms.author="elizapo" />



# Secure apps and resources in Azure RemoteApp

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

Azure RemoteApp provides users access to centrally-managed Windows apps, which lets you control what your users can and can't do.  This is particularly useful when the user is connecting from an unmanaged device (like their personal Macbook) and you want to control the user access or experience.

For example, if you are using Active Directory for user authentication and you want to prevent your users from copying data out of an app, you can configure a Remote Desktop Group Policy to block users from copying data.

Another example is if you want to block internet access for a particular app in your collection. You can create a Windows Firewall rule that blocks the access when you create the image for your collection.

## Implementation options

  Here are the key implementation options, which can be used individually or in tandem as needed:

1.	If your RemoteApp collection is domain joined you can enforce any [Group Policy](https://technet.microsoft.com/library/cc725828.aspx) (with the exception of the Idle and Disconnect timeout policies described [here](../azure-subscription-service-limits.md)).
2.	As an alternative to Group Policy (if your collection is not domain joined or you don't have the right privileges in AD), you can configure [Local Polices](https://technet.microsoft.com/library/cc775702.aspx) into your template image.  Note that group polices trump local policies when there is a conflict.
3.	Some OS/app settings are not configurable via policy, but can be via registry key using the [RegEdit tool](./remoteapp-hybridtrouble.md) while configuring your template image.
4.	You can use [Windows Firewall](http://windows.microsoft.com/en-US/windows-8/Windows-Firewall-from-start-to-finish) to control network access to and from the machine where the app is running. Just make sure you don't block the URLs and ports defined here.
5.	You can use [AppLocker](https://technet.microsoft.com/library/hh831440.aspx) to control which applications and files users can run. For example, savvy users can figure out how to run applications that you did not publish but that are available in the image you used to create the collection - AppLocker can block this.

## Detailed information

- The following RDS policies are likely to be most useful:
	- [Device and Resource Redirection](https://technet.microsoft.com/library/ee791794.aspx)
	- [Printer Redirection](https://technet.microsoft.com/library/ee791784.aspx)
	- [Profiles](https://technet.microsoft.com/library/ee791865.aspx).
- Note that configuring redirections via the RemoteApp PowerShell module (as seen [here](./remoteapp-redirection.md)) relies on the client machine to enforce the policy, so if security is the primary objective you'll want to enforce the policy via the template image local policy or via group policy.
- [Windows Server 2012 R2 policies](https://technet.microsoft.com/library/hh831791.aspx).
- [Office 2013 polices](https://technet.microsoft.com/library/cc178969.aspx) (including [how to customize the Office toolbar](https://technet.microsoft.com/library/cc179143.aspx)).
