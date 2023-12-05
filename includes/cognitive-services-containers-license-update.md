---
author: jvenezia
ms.author: jvenezia
ms.service: cognitive-services
ms.topic: include
ms.date: 5/19/2023
---

Container license files are used as keys to decrypt certain files within each container image. If these encrypted files happen to be updated within a new container image, the license file you have may fail to start the container even if it worked with the previous version of the container image. To avoid this issue, we recommend that you download a new license file from the resource endpoint for your container provided in Azure portal after you pull new image versions from mcr.microsoft.com.

To download a new license file, you can add `DownloadLicense=True` to your docker run command along with a license mount, your API Key, and your billing endpoint. Refer to your [container's documentation](../articles/cognitive-services/containers/disconnected-containers.md#configure-container-for-disconnected-usage) for detailed instructions.
