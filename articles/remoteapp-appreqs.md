
<properties 
    pageTitle="App requirements for RemoteApp"
    description="Learn about the requirements for apps that you want to use in RemoteApp" 
    services="remoteapp" 
    solutions="" documentationCenter="" 
    authors="lizap" 
    manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="compute" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="03/11/2015" 
    ms.author="elizapo" />



# App requirements
RemoteApp supports streaming 32-bit or 64-bit Windows-based applications from a Windows Server 2012 R2 installation. Most existing 32-bit or 64-bit Windows-based applications run "as is" in RemoteApp (Remote Desktop Services or formerly known as Terminal Services) environment. However, there is a difference between running and running well - some applications function correctly and perform well, while others do not. The following information provides guidance for developing applications in a Remote Desktop Services environment and testing to ensure compatibility.

Tip: We're working on creating some working examples of apps for you. By the end of the month, you'll see new topics that discuss using Microsoft Access, QuickBooks, and App-V in RemoteApp.

## Requirements
These three requirements, if followed, help your application run well in RemoteApp: 

1.	Applications that meet all [Certification requirements for Windows desktop apps](https://msdn.microsoft.com/library/windows/desktop/hh749939.aspx) and adhere to [Remote Desktop Services programming guidelines](https://msdn.microsoft.com/library/aa383490.aspx) will have complete compatibility with RemoteApp. 
2.	Applications should never store data locally on the image or RemoteApp instances that can be lost.  After you create a RemoteApp collection, the instances are cloned and are stateless and should only contain applications. Store data in an external source or within the user's profile. 
3.	Custom images should never contain data that can be lost.  

## Testing your apps
Use these steps to testing applications:

1.	Install Windows Server 2012 R2 and your application
2.	Enable Remote Desktop
3.	Create two user accounts, UserA and UserB, adding both user accounts to the Remote Desktop security group. 
4.	Check multi-session compatibility by establishing two simultaneous RDS sessions to the PC while launching the application.
5.	Validate app behavior

## Application development guidelines
Use the following guidelines for developing applications for RemoteApp. 

### Multiple users
 
- Installing an [application for a single user ](https://msdn.microsoft.com/library/aa380661.aspx)can create problems in a multiuser environment. 
- Applications should [store user-specific information](https://msdn.microsoft.com/library/aa383452.aspx) in user-specific locations, separately from global information that applies to all users. 
- RemoteApp uses multiple [namespaces for kernel objects](https://msdn.microsoft.com/library/aa382954.aspx); a global namespace is used primarily by services in client/server applications. 
- It is not safe to assume that the computer name or the [IP address](https://msdn.microsoft.com/library/aa382942.aspx) assigned to the computer are associated with a single user because multiple users can be logged on simultaneously to a Remote Desktop Session Host (RD Session Host) server. 

### Performance
- Disable [graphic effects](https://msdn.microsoft.com/library/aa380822.aspx) before you add your app to RemoteApp.
- To maximize CPU availability for all users, either disable [background tasks ](https://msdn.microsoft.com/library/aa380665.aspx) or create efficient background tasks that are not resource-intensive. 
- You should tune and balance application [thread usage](https://msdn.microsoft.com/library/aa383520.aspx) for a multiuser, multiprocessor environment.
- To optimize performance, it is good practice for applications to [detect](https://msdn.microsoft.com/library/aa380798.aspx) whether they are running in a client session. 
