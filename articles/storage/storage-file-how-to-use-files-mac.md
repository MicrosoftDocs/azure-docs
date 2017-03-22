---
title: Introduction to Azure File Storage | Microsoft Docs
description: An overview of Azure File Storage, Microsoft's cloud file system. Learn how to mount Azure File shares over SMB and lift classic on-premises workloads to the cloud without rewriting any code.
services: storage
documentationcenter: ''
author: RenaShahMSFT
manager: aungoo
editor: tysonn

ms.assetid: a4a1bc58-ea14-4bf5-b040-f85114edc1f1
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/21/2017
ms.author: renash
---

1.  Be in El Capitan. Haven’t tested in anything earlier, because don’t care.

2.  In the portal, find the URL to the share in the Connect pane – just the
    [\\\\computer\\share](file:///\\computer\share) part.

>   [./media/image1.gif](./media/image1.gif)

>   C:\\Users\\renash\\AppData\\Local\\Temp\\msohtmlclip1\\02\\clip\_image001.gif

>    

1.  In cli, find it by stashing the storage account creds, and then you open
    Finder, and in the Go menu, click Connect to Server… in it, you’re going to
    type “smb://” and reverse the direction of your slashes from backslashes
    (windows) to forward slashes (all other sane systems) like the following:

>   [./media/image2.gif](./media/image2.gif)

>   C:\\Users\\renash\\AppData\\Local\\Temp\\msohtmlclip1\\02\\clip\_image002.gif

1.  When you click connect, you will be prompted for the username (which is
    autopopulated with your Mac logged on username) and password. Here you enter
    the fileshare name (rasquillfiles in my case) and the storage account key
    will be your password. You will have the option of placing the
    username/password in your keychain. Up to you.

>    

>   Then you have it mounted. As you can see, drag and drop works fine.

>   [./media/image3.gif](./media/image3.gif)

>   C:\\Users\\renash\\AppData\\Local\\Temp\\msohtmlclip1\\02\\clip\_image003.gif

>    

>   **From:** Robin Shahan \<<Robin.Shahan@microsoft.com>\>

>   **Date:** Monday, August 15, 2016 at 6:15 PM

>   **To:** Ralph Squillace \<<Ralph.Squillace@microsoft.com>\>

>   **Subject:** RE: Azure File question

>    

>   That’s very cool. I assume El Capitan is the newest version of the Mac OS?

>    

>   **From:** Ralph Squillace

>   **Sent:** Monday, August 15, 2016 6:14 PM

>   **To:** Robin Shahan \<<Robin.Shahan@microsoft.com>\>; Yunus Emre Alpozen
>   \<<yemrea@microsoft.com>\>; Mine Tanrinian Demir \<<minet@microsoft.com>\>;
>   Rick Claus \<<Rick.Claus@microsoft.com>\>

>   **Cc:** Aung Oo \<<aungoo@microsoft.com>\>

>   **Subject:** Re: Azure File question

>    

>   From my Mac El Capitan desktop here in San Francisco, I can mount my Azure
>   file share in the south central us region. ;-) Testing the linux
>   implementation now….

>    

>   [./media/image4.gif](./media/image4.gif)

>   C:\\Users\\renash\\AppData\\Local\\Temp\\msohtmlclip1\\02\\clip\_image004.gif
