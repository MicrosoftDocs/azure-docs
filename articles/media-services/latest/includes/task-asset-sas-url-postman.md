---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/18/2020
ms.author: inhenkel
ms.custom: dotnet
---

<!--Get an asset SAS URL with Postman-->

This section shows how to get a SAS URL that was generated for the created asset. The SAS URL was created with read-write permissions and can be used to upload digital files into the Asset container.

1. Select **Assets** -> **List the Asset URLs**.
2. Press **Send**.

    ![Upload a file](../media/upload-files/postman-create-sas-locator.png)

You see the **Response** with the info about asset's URLs. Copy the first URL and use it to upload your file.
