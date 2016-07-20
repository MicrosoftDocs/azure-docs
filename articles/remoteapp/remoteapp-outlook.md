<properties
    pageTitle="Using Outlook in Azure RemoteApp | Microsoft Azure" 
    description="Learn how to configure and use Outlook in Azure RemoteApp | Microsoft Azure"
    services="remoteapp"
    documentationCenter=""
    authors="pavithir"
    manager="mbaldwin" />

<tags
    ms.service="remoteapp"
    ms.workload="compute"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="hero-article"
    ms.date="07/20/2016"
    ms.author="elizapo" />

# Using Microsoft Outlook in Azure RemoteApp

Azure RemoteApp supports Microsoft Outlook O365. Read more about how [Office works in Azure RemoteApp](remoteapp-officesubscription.md). There are a few recommended settings for Outlook when used in Azure RemoteApp.

## Cached mode
Cached mode is a recommended configuration when using Outlook in Azure RemoteApp. When you configure an Outlook 2013 account to use Cached Exchange Mode, Outlook 2013 works from a local copy of the user's Microsoft Exchange mailbox that is stored in an offline data file (OST file) on the user's computer, together with the Offline Address Book (OAB). The cached mailbox and OAB are updated periodically from the O365 service. Read more about [the differences between cached and online mode](https://technet.microsoft.com/library/jj683103.aspx).

The user can select **Cached Exchange Mode** or **Online Mode** during account setup or by changing the account settings. You can also deploy one mode or the other by using the Office Customization Tool (OCT) or Group Policy.  

Read [step by step instructions on enabling cached mode](https://technet.microsoft.com/library/c6f4cad9-c918-420e-bab3-8b49e1885034#proc).

## Search
In Azure RemoteApp, using search within Outlook has limitations. Azure RemoteApp uses pooled VMs to accommodate user sessions. Search indexing depends on the machine ID, which is different for different VMs. It is possible that every time a user logs into Azure RemoteApp, they are directed to a new VM. That would mean, if we enable local search, the indexer will run every time the machine ID changes (when the user is on a different VM). Depending on the size of the .OST file, the indexer could take a long time to complete and use up resources needed for other apps. Search would not only be slow but might not produce results. Using an Online Mode account profile would work around this, but overall performance would suffer due to the lack of a local cache (see the link above for more information about the difference between cached and online mode). Unfortunately, indexed/local search cannot be disabled and online search cannot be enabled by default in Outlook 2013.

Outlook 2016 has a solution to tackle this in cached mode, by providing a new service search experience for mailboxes hosted on Exchange 2016 (or hosted in Office 365). This uses service search results against the local cache (OST). Outlook might fall back to using the local search indexer in some scenarios, but most searches would use this new service search feature. The recommendation from Azure RemoteApp would be to use Outlook 2016 if mail search is a very important scenario.
