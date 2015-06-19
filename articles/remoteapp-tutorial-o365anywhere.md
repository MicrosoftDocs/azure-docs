<properties
   pageTitle="Get the same Office 365 experience on any device"
   description="Learn how to share any Office 365 app with your users by using RemoteApp."
   services="remoteapp"
   documentationCenter=""
   authors="guscatalano"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="remoteapp"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="compute"
   ms.date="04/14/2015"
   ms.author="guscatal"/>


Get the same Office 365 Experience on any device
===================


This article will cover how to deploy Office 365 on any device in your company. Your users can get the same capabilities and UI experience on Android, Apple and Windows. 

We will accomplish this using Azure RemoteApp by hosting Office 365 on scale-able Virtual Machines in Azure that users can connect to. This set of virtual machines we call a "Cloud Collection". 

----------


Create a Cloud Collection
-------------
First after you have created an Azure Account, navigate to "RemoteApp" by clicking on the link on the left side. 
![Showing Azure RemoteApp on the Azure Portal](https://raw.githubusercontent.com/guscatalano/azure-content/master/articles/media/remoteapp-tutorial-o365anywhere/1-menu.png)

Then continue by clicking new on the bottom and "quick creating" a collection. Provide a name, the region, the subscription, the plan and the image "Office Proffesional 2013" that we provide.
![Create Dialog](https://raw.githubusercontent.com/guscatalano/azure-content/master/articles/media/remoteapp-tutorial-o365anywhere/2-quickcreate.PNG)

Once you finish the form the collection creation process should start. This may take up to an hour or so.

![Waiting](https://raw.githubusercontent.com/guscatalano/azure-content/master/articles/media/remoteapp-tutorial-o365anywhere/3-waiting.PNG)

Once the process is done, it will look something like this. If we click on "Publishing" we can see that most Office applications have been published for us already.
![Collection created](https://raw.githubusercontent.com/guscatalano/azure-content/master/articles/media/remoteapp-tutorial-o365anywhere/4-done.PNG)

![Published apps](https://raw.githubusercontent.com/guscatalano/azure-content/master/articles/media/remoteapp-tutorial-o365anywhere/5-publish.PNG)

At this point you can also add more users that have access to this collection by clicking "User Access"
![Configure user access](https://raw.githubusercontent.com/guscatalano/azure-content/master/articles/media/remoteapp-tutorial-o365anywhere/6-user.PNG)

Now let's try out connecting to Office 365!

Connecting to Office 365
-------------
We'll head over to https://www.remoteapp.windowsazure.com/ and click on "install client" to install the Azure RemoteApp client on the device you're on. The screenshots below are for windows.

Once the application starts you'll be asked to sign in with your live ID, use the same one as your Azure account for now. When you're signed in you should see a notification about new invitations, click there and you should see a list like one below, accept the invitation that matches your Azure account owner email. 

![New invitation](https://raw.githubusercontent.com/guscatalano/azure-content/master/articles/media/remoteapp-tutorial-o365anywhere/7-araclient.PNG)

What it looks like when there are new invitations.

![Accept an application](https://raw.githubusercontent.com/guscatalano/azure-content/master/articles/media/remoteapp-tutorial-o365anywhere/8-invitation.PNG) 

Once you accept the invitation you should see all the office apps in the Azure RemoteApp client.

![List of apps](https://raw.githubusercontent.com/guscatalano/azure-content/master/articles/media/remoteapp-tutorial-o365anywhere/9-work.PNG)

When you click on any of these the application should start on the Azure Virtual Machine and you should be all set! Enjoy!

![starting](https://raw.githubusercontent.com/guscatalano/azure-content/master/articles/media/remoteapp-tutorial-o365anywhere/10-arastart.PNG)

![powerpoint](https://raw.githubusercontent.com/guscatalano/azure-content/master/articles/media/remoteapp-tutorial-o365anywhere/11-pp.PNG)
