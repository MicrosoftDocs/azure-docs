---
author: PatrickFarley
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 12/11/2020
ms.author: pafarley
---

To retrieve the SAS URL for your custom model training data, go to your storage resource in the Azure portal and select the **Storage Explorer** tab. Navigate to your container, and select **Get shared access signature**. Make sure the **Read** and **List** permissions are checked, and click **Create**. Then copy the value in the **URL** section to a temporary location. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.
   > [!div class="mx-imgBorder"]
   > ![alt-text](../media/quickstarts/get-sas-url.png)