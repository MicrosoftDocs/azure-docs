---
author: cynthn
ms.service: azure
ms.topic: include
ms.date: 11/09/2018
ms.author: cynthn
---
## Transfer local files to Cloud Shell
The `clouddrive` directory syncs with the Azure portal storage blade. Use this blade to transfer local files to or from your file share. Updating files from within Cloud Shell is reflected in the file storage GUI when you refresh the blade.

### Download files

![List of local files](../articles/cloud-shell/media/persisting-shell-storage/download.png)
1. In the Azure portal, go to the mounted file share.
2. Select the target file.
3. Select the **Download** button.

### Upload files

![Local files to be uploaded](../articles/cloud-shell/media/persisting-shell-storage/upload.png)
1. Go to your mounted file share.
2. Select the **Upload** button.
3. Select the file or files that you want to upload.
4. Confirm the upload.

You should now see the files that are accessible in your `clouddrive` directory in Cloud Shell.