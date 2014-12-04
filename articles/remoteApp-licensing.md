<properties title="Azure RemoteApp licensing" pageTitle="Azure RemoteApp licensing" description="Learn about Azure RemoteApp licensing" metaKeywords="" services="" solutions="" documentationCenter="" authors="elizapo"  />

<tags ms.service="remoteapp" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/04/2014" ms.author="elizapo" />

#How does licensing work in Azure RemoteApp?


So you've set up your Azure RemoteApp service, created your templates, and are ready to publish apps to your users. But there's still one last thing to figure out: licensing. What's the deal with licensing for the apps you share through RemoteApp?

You can offer any app or program to which you hold the license. That makes sense, right? You can publish any app that you are legally entitled to share. And you need to make sure you really are entitled to share your programs.

If you want to use the Office 365 template image that comes with Azure RemoteApp, you must have an *existing* Office 365 Enterprise E3 or E4 subscription. The same is true for any Office 365 app that you publish using a custom template. You need to activate the apps with your own subscription. This is true for both trial and paid subscriptions. If you want to use the Office 365 template image during the trial, *and you don't already have a subscription*, go to the Office 365 page to sign up for a trial subscription.

If, during the trial period, you don't want to get an Office 365 trial subscription, use the Office 2013 template image that comes with RemoteApp. This template image includes a trial subscription for Office 2013. After the trial period ends, you'll need to not only upgrade your RemoteApp account to a paid account (to keep the great RemoteApp functionality), you'll need to switch to the Office 365 template image AND get an Office 365 subscription.


Please note that you cannot use a CAL or Volume License agreement in a cloud deployment. You *can* use a Volume License agreement to activate applications in your hybrid deployment. You just need to install them on your template image from the Volume License media.