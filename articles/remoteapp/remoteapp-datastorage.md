
<properties
    pageTitle="Never store sensitive data on custom images for Azure RemoteApp | Microsoft Azure"
    description="Learn about the guidelines for storing data in custom images in Azure RemoteApp"
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
    ms.date="06/27/2016"
    ms.author="elizapo" />


# Never store sensitive data on custom images

When you host your own application in Azure RemoteApp, the first step is to create a custom image. We use that custom image to create VM instances that serve your apps to your users. The custom image should contain ONLY applications and never sensitive data that can be lost, such as SQL databases, personnel files, or special data files like QuickBooks company files. All sensitive data should reside external to Azure RemoteApp on a file server, another Azure VM, or in SQL Azure. The image should just host the application that connects to the data source and presents the data. Review [Requirements for Azure RemoteApp images](remoteapp-imagereqs.md) for more information. 

To understand why you should not store sensitive data, you need to understand how Azure RemoteApp works. When a collection is created or updated, behind the scenes multiple clones or copies of the image are created. All these VM instances are exact replicas of the custom image; when users launch applications they are connected to one of these VM instances. But the same instance is not guaranteed and should not matter because they are non-persistent. The VM instances hosting the applications are non-persistent and can be destroyed or deleted based, for example, during collection update. 

Once the collection is provisioned and users start connecting to the VMs, user data is persistent and protected because it is saved on separate storage within a VHD that we call a [user profile disk (UPD)](remoteapp-upd.md), which is the user profile in c:\users\<userprofile>. When an application starts, the UPD is mounted and treated just like a local user profile by the operating system. Read more about how [Azure RemoteApp saves user data and settings](remoteapp-upd.md).

Example data that should not reside in the image:

- Shared data for users to access
- SQL DB or QuickBooks DB
- Any data in D:\

Example data that can reside in the default profile to be copied into every users’ UPD:

- Configuration files per user
- Scripts that users would need preserved in their UPD

Key points:

- Never store sensitive data that can be lost on the image when creating a custom image.
- Sensitive data should always reside on a separate file server, separate Azure VM, on the cloud, and always external to the VM instances hosting your applications within Azure RemoteApp. 
- User data is saved and persists in the user profile disk (UPD)


