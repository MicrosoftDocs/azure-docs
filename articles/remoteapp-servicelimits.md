<properties 
    pageTitle="RemoteApp service limits"
    description="Learn about the limits and default values for Azure RemoteApp" 
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
    ms.date="05/07/2015" 
    ms.author="elizapo" />


# RemoteApp service limits and default values

This topic outlines the service limits for Azure RemoteApp.

  
## Collection limits
All collections:

- Collections per user: 1
- Published apps per collection: 100 

Trial collections:

- Trial duration: 30 days
- Trial collections: 2 per subscription
- Trial users per collection: 10 
- Trial template images: 25
 
Activated (paid) collections:

- Paid collections: 3 (you can request an increase on this limit)
- Paid template images: 25

 
## User limits

The documented collection limits are soft limits (meaning that they can be changed). The maximum number of users per collection is a hard limit - it cannot be changed. However, the number of users you can have is determined by the tier of your collection, as follows: 


- Basic - 800 users
- Standard - 500 users

(The number of users you can support is determined by the number of VMs used for your collection. For the Basic tier, there are 16 users per VM, while the Standard tier has 10 users per VM.)

To figure out the maximum number of assigned users you can support, multiply the number of paid users per collection by the number of collections you have. 
  
You can create multiple collections in your account with these limits and go up to 5000 concurrent user connections across all collections. If you need a higher number, you can request an increase.

## Other values and limits:

- User data storage per user per collection: 50 GB
- Idle timeout: 4 hours
- Disconnected timeout: 4 hours

## How to request a limit increase
You can request an increase for collection limits and concurrent users. To do this, open a support ticket explaining what you need.


To open a support ticket do the following:

1.	In the management portal, click [Get Support](https://manage.windowsazure.com/?getsupport=true). If you are not logged in, you will be prompted to enter your credentials.
2.	Select your subscription.
3.	Under support type, select **Technical**.
4.	Click **Create Ticket**. 
5.	Select **Azure RemoteApp** in the product list presented on the next page.
6.	Select a **Problem type** that is appropriate for your issue.
7.	Click **Continue**.
8.	Follow the instructions on next page and then enter details about the limit increase that you need. For example, if you want to extend your trial period, enter, "Please extend my trial period for X days." 
9.	Click **submit** to open the ticket.

