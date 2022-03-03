---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/18/2020
ms.author: inhenkel
ms.custom: CLI
---

<!--Create a media services asset portal-->

## Upload videos

You should have a media services account, a storage account, and a default streaming endpoint.  

1. In the portal, navigate to the Media Services account.
1. Select **Assets**. Assets are the containers that are used to house your media content.
1. Select **Upload**. The Upload new assets screen will appear.
1. Select the storage account you created for the Media Services account from the **Storage account** dropdown menu. It should be selected by default.
1. Select the **file folder icon** next to the Upload files field.
1. Select the media files you want to use. An asset will be created for every video you upload. The name of the asset will start with the name of the video and will be appended with a unique identifier. You *could* upload the same video twice and it will be located in two different assets.
1. You must agree to the statement "I have all the rights to use the content/file, and agree that it will be handled per the Online Services Terms and the Microsoft Privacy Statement." Select **I agree and upload.**
1. Select **Continue upload and close**, or **Close** if you want to watch the video upload progress.
1. Repeat this process for each of the files you want to stream.
