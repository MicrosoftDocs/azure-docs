<properties
    pageTitle="Azure RemoteApp licensing | Microsoft Azure"
    description="Learn how licensing works in Azure RemoteApp."
    services="remoteapp"
    documentationCenter=""
    authors="lizap"
    manager="mbaldwin" />

<tags
    ms.service="remoteapp"
    ms.workload="compute"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="get-started-article"
    ms.date="05/18/2016"
    ms.author="elizapo" />


# How does licensing work in Azure RemoteApp?


So you've set up your Azure RemoteApp service, created your templates, and are ready to publish apps to your users. But there's still one last thing to figure out: licensing. Just how does licensing work for RemoteApp and for the apps you share through RemoteApp?

RemoteApp does not require any Windows licenses or Remote Desktop CALs. Your subscription takes care of the RemoteApp side itself. (Check out the details of the [pricing plans](https://azure.microsoft.com/pricing/details/remoteapp).)

If you use one of the images that is included in your subscription, you can share any of the apps installed on that image without needing a separate license. For example, if you use the Windows Server 2012 R2 template image to build your collection, you can share System Center Endpoint Protection with your users. The only exceptions to this rule are Office 365 ProPlus, which requires a separate subscription, and Office 2013, which cannot be shared in a production collection.

If you want to use the Office 365 template image that comes with RemoteApp, you must have an *existing* Office 365 ProPlus plan. The same is true for any Office 365 app that you publish using a custom template. You need to activate the apps with your own subscription. This is true for both trial and paid subscriptions. If you want to use the Office 365 template image during the trial, *and you don't already have a subscription*, go to the Office 365 page to [sign up](https://go.microsoft.com/fwlink/p/?LinkID=403802) for a trial subscription. See [How do RemoteApp and Office work together?](remoteapp-o365.md) for more information.

If, during the trial period, you don't want to get an Office 365 trial subscription, use the Office 2013 Professional Plus template image that comes with RemoteApp. This template image can only be used for 30 days and cannot be converted into a paid collection.

For other apps, you need to make sure that you have the license to share the app.

That makes sense, right? You can publish any app that you are legally entitled to share. And you need to make sure you really are entitled to share your programs.

Please note that you cannot use a CAL or Volume License agreement in a cloud collection. You *can* use a Volume License agreement to activate applications in your hybrid collection (except for Office). You just need to install them on your template image from the Volume License media. Follow the information from the application vendor to install licenses in a Remote Desktop environment.
