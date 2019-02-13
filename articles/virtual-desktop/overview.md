---
title: What is Windows Virtual Desktop? - Azure
description: An overview of Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: overview
ms.date: 02/20/2019
ms.author: helohr
---
# What is Windows Virtual Desktop? 

Windows Virtual Desktop enables you to create a full desktop virtualization environment in your Azure subscription, without having to run any additional gateway servers. You can publish as many host pools as you need to accommodate your diverse workloads. You can use the Windows Virtual Desktop PowerShell and REST interfaces to configure the host pools, create app groups, assign users, and publish resources. Once assigned, users can launch any one of the Windows Virtual Desktop clients to connect to their published Windows desktops and applications. The users are securely established through reverse connections to the service, so you never have to leave any inbound ports open. For ongoing maintenance of your Windows Virtual Desktop environment, you can use built-in delegated access to assign roles and collect diagnostics to understand various configuration or user errors.

## Key capabilities
With Windows Virtual Desktop, you can:

* **Bring your own image for production workloads, or test from the Azure Gallery**. By bringing your own image, you can easily lift-and-shift your workload to Windows Virtual Desktop. However, you can akso use the Azure Gallery as a source for an image to kickstart your testing and migration.
  
* **Reduce costs by providing pooled, multi-session resources**. By creating a host pool with virtual maachines based on a multi-session OS image, you can run greatly reduce the number of virtual machines--and therefore, OS overhead--while still providing the same resources to all of your users. This is possible with the familiar Remote Desktop Session Host (RDSH) role on Windows Server, along with the new Windows 10 Enterprise multi-session capability, exclusive to Windows Virtual Desktop.

* **Provide individual ownership through personal desktops**. Personal desktops are ideal for users who need additional personalization of the virtual machine or want guaranteed performance from the virtual machine (without others also logging on and using resources). By providing a personal desktop, you do not need to provide additional storage, and the desktop feels like the users' standard workstation.

* **Reduce the number of images by publishing full desktop or individual RemoteApps**. Many times, you will have users that only require specific LOB apps to use remotely, while others need a full desktop as a primary workstation. You can simplify the deployment by publishing both desktops and RemoteApps from a single host pool. You can even create individual app groups for different sets of users. If a user is assigned to multiple app groups, they will see the consolidated list of apps when they log in to the Windows Virtual Desktop client.

* **Only manage the image and virtual machines, not the infrastructure**. With Remote Desktop Services on Windows Server, you had to personally manage the Gateway, Broker, and other Remote Desktop roles. With Windows Virtual Desktop, you no longer need to manage that infrastructure, just the virtual machines in your Azure subscription. When your users hit errors, you can use the new Diagnostics service to troubleshoot standard configuration errors or user errors.

* **Connect with your device**. You can connect to Windows Virtual Desktop with a native application on your Windows, iOS, Android, or Mac device. Or you can connect with any device with a web browser using the Windows Virtual Desktop web client.

## Requirements
Windows Virtual Desktop has several requirements to successfully connect your users to their Windows desktops and applications. You must have the following infrastructure in place before deploying Windows Virtual Desktop:
  * An Azure Active Directory
  * A Windows Server Active Directory in sync with Azure Active Directory. This can be enabled through
    * Azure AD Connect
    * Azure AD Domain Services
  * An Azure subscription, containing:
    * A virtual network containing--or connected to--the Windows Server Active Directory
  
The Azure virtual machines you create for Windows Virtual Desktop must:
  * Be standard domain-joined or Hybrid AD Joined. Virtual machines cannot be Azure AD Joined.
  * Running one of the supported OS images:
    * Windows 10 Enterprise multi-session
    * Windows Server 2016


## Next steps

- [Set up your Windows Virtual Desktop tenant](tenant-setup-azure-active-directory.md)
