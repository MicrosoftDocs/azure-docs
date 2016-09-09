<properties
   pageTitle="Azure AD Connect: Features in preview | Microsoft Azure"
   description="This topic describes in more detail features which are in preview in Azure AD Connect."
   services="active-directory"
   documentationCenter=""
   authors="andkjell"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"  
   ms.workload="identity"
   ms.tgt_pltfrm="na"
   ms.devlang="na"
   ms.topic="article"
   ms.date="06/27/2016"
   ms.author="andkjell;billmath"/>

# More details about features in preview
This topic describes how to use features currently in preview.

## Group writeback
The option for group writeback in optional features will allow you to writeback **Office 365 Groups** to a forest with Exchange installed. This is a group which is always mastered in the cloud. If you have Exchange on-premises then you can write back these groups to on-premises so users with an on-premises Exchange mailbox can send and receive emails from these groups.

More information about Office 365 Groups and how to use them can be found [here](http://aka.ms/O365g).

This group will be represented as a distribution group in on-premises AD DS. Your on-premises Exchange server must be on Exchange 2013 cumulative update 8 (released in March 2015) or Exchange 2016 to recognize this new group type.

**Notes during the preview**

- The address book attribute is currently not populated in the preview. Without this attribute, the group will not be visible in the GAL. The easiest way to populate this attribute is to use the Exchange PowerShell cmdlet `update-recipient`.
- Only forests with the Exchange schema are valid targets for groups. If no Exchange was detected, then group writeback will not be possible to enable.
- Only single-forest Exchange organization deployments are currently supported. If you have more than one Exchange organization on-premises, then you will need an on-premises GALSync solution for these groups to appear in your other forests.
- The Group writeback feature does not currently handle security groups or distribution groups.

>[AZURE.NOTE] A subscription to Azure AD Premium is required for group writeback.

## User writeback
> [AZURE.IMPORTANT] The user writeback preview feature was removed in the August 2015 update to Azure AD Connect. If you have enabled it, then you should disable this feature.

## Next steps
Continue your [Custom installation of Azure AD Connect](active-directory-aadconnect-get-started-custom.md).

Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
