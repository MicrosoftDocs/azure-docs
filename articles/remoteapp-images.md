<properties 
    pageTitle="What is in the RemoteApp template images?" 
    description="Learn about the template images included with RemoteApp." 
    services="remoteapp" 
    solutions="" documentationCenter="" 
    authors="lizap" 
    manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="tbd" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="2/17/2015" 
    ms.author="elizapo" />

# What is in the RemoteApp template images?

Your Azure RemoteApp subscription includes three template images:


- Windows Server 2012
- Microsoft Office 365 ProPlus (Office 365 subscription required)
- Microsoft Office 2013 Professional Plus (trial only)

Regardless of the image you use, there are licensing considerations anytime you share an app with your users. Check out the [RemoteApp licensing details](remoteapp-licensing.md) for more information.

Read on for details on what each image contains.

## Windows Server 2012 R2  ("the vanilla image")
This image is based on Microsoft Windows Server 2012 R2 Datacenter operating system and has the following roles and features installed to meet the requirements of Azure RemoteApp template images: 


- .NET Framework 4.5, 3.5.1, 3.5
- Desktop Experience
- Ink and Handwriting Services
- Media Foundation
- Remote Desktop Session Host
- Windows PowerShell 4.0
- Windows PowerShell ISE
- WoW64 Support 

This image also has the following applications installed: 

- Adobe Flash Player
- Microsoft Silverlight
- Microsoft System Center 2012 Endpoint Protection
- Microsoft Windows Media Player 


## Microsoft Office 365 ProPlus (subscription required)
Office 365 is the most requested application, so we created a "custom" image for you to work with. 

This image is an extension of the vanilla image and has the following components of Microsoft Office 365 ProPlus installed in addition to the components described in the Windows Server 2012 R2 image: 


- Access
- Excel
- Lync
- OneNote
- OneDrive for Business
- Outlook
- PowerPoint
- Project
- Visio
- Word
- Microsoft Office Proofing Tools 

And the following applications, as well:

- SQL Native client
- ODBC Driver
- SQL Server Data Mining client
- MasterDataServices client
- Microsoft Publisher
- PowerQuery
- PowerMap


Full functionality of Office 365 ProPlus apps is available only for users who have an Office 365 ProPlus plan. For more details on the Office 365 subscription plans see [Office 365 service plans](http://technet.microsoft.com/library/office-365-plan-options.aspx). For more details on licensing in RemoteApp, see [How does licensing work in Azure RemoteApp?](remoteapp-licensing.md) 

## Microsoft Office 2013 Professional Plus (trial only)
During the free trial period, you can test the service with the Office 2013 image. 

This image is an extension of the vanilla image and has the following components of Microsoft Office 2013 Professional Plus installed in addition to the components described in the Windows Server 2012 R2 image: 


- Access
- Excel
- Lync
- OneNote
- OneDrive for Business
- Outlook
- PowerPoint
- Project
- Visio
- Word
- Microsoft Office Proofing Tools 

**Important legal information:** This image does not include a Microsoft Office license and *cannot be used for production*. The Office 2013 Professional Plus image is intended for trial use only. If you want to use Office apps in Azure RemoteApp for production, you need to use the Office 365 ProPlus image. For more details on licensing in RemoteApp, see [How does licensing work in Azure RemoteApp?](remoteapp-licensing.md) 
