<properties
   pageTitle="Update your Azure RemoteApp collection | Microsoft Azure"
   description="Learn how to update your Azure RemoteApp collection"
   services="remoteapp"
   documentationCenter=""
   authors="lizap"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="remoteapp"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="compute"
   ms.date="08/15/2016"
   ms.author="elizapo"/>

# Update a collection in Azure RemoteApp

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

There will come a time, inevitably, when you need to update the apps or image in your Azure RemoteApp collection. If you are using one of the images included with your Azure RemoteApp subscription, in either a cloud or hybrid collection, any and all updates are handled by Azure RemoteApp itself, so you can rest easy.

However, if you are using a custom image (either that you built from scratch or that you created by modifying one of our images), you are in charge of maintaining the image and apps. If you need to update your image or any of the apps inside it, you need to create a new, updated version of the image, and then replace the existing image in your collection with this new updated image.

So, how do you go about updating your collection? It's fairly straightforward:

1. Update the image that you used in your collection. Apply any patches or updates needed, and then save it with a new name.
2. [Upload](remoteapp-uploadimage.md) or [import](remoteapp-image-on-azurevm.md) that image to RemoteApp.
3. Now, on the collection page, click **Update**.
4. Choose the new image from the **Template Image** list.
4. Here's the tricky part - you need to decide how to deal with any users that are currently using an app in the collection. You have the following choices:
	- **Give users 60 minutes after the update**. As soon as the update is finished, Azure RemoteApp will display a message to any active users telling them to save their work and log off and log back in. After 60 minutes, any active users who have not logged off will be automatically logged off. Users can immediately log back on.
	- **Sign users out immediately**. As soon as the update is finished, log off all users automatically without any warning. If you choose this option, users might lose data. However, they can reconnect to the app immediately.

1. Click the check mark to start the update.
