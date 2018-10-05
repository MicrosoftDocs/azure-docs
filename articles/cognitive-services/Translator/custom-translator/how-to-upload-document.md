---
title: How to upload document in Custom Translator?
titlesuffix: Azure Cognitive Services
description: How to upload document in Custom Translator?  
author: rajdeep-in
manager: christw
ms.service: cognitive-services
ms.component: custom-translator
ms.date: 10/15/2018
ms.author: v-rada
ms.topic: how to upload document
Customer intent: As a custom translator user, I want to understand how to upload document, so that I can start using the feature.
---

# Upload document

On [Custom Translator](https://portal.customtranslator.azure.ai) portal, click on “Documents” tab to go to documents page.

![Document upload link](media/how-to/ct-how-to-upload-1.png)


1.  Click on the “Upload Document” button on the documents page.

    ![Upload document page](media/how-to/ct-how-to-upload-2.png)

2.  On the dialog fill in the following information:

    a.  Document type:

    -  Training: These document(s) will be used for training set.
    -  Tuning: These document(s) will be used for tuning set.
    -  Testing: These document(s) will be used for testing set.
    -  Dictionary (WIP)

    b.  Language pair

    c.  Override document if exists: Select this check box if you want to
        overwrite any existing documents with the same name.

    d.  Fill in the relevant section for either parallel data or combo data.

    -  Parallel data:
        -  Source file: Select source language file from your local computer.
        -  Target file: Select target language file from your local computer.
        -  Document name: Used only if you are uploading parallel files.

    - Combo data:
        -  Combo File: Select the combo file from your local computer. Your combo file has both of your source and target language sentences. [Naming convention](concept-document-formats-naming-convention.md) is important for combo files.

    e.  Click Upload

    ![Upload document](media/how-to/ct-how-to-upload-dialog.png)

3.  At this point, we are processing your documents and attempting to extract sentences. You can click “View upload Progress” to check the status of your documents as they process.

    ![Upload document processing dialog](media/how-to/ct-how-to-upload-processing-dialog.png)

4.  This page will display the status, and any errors for each file within your
    upload. You can view past upload status at any time by clicking on the
    “Upload history” tab.

    ![Upload document processing dialog](media/how-to/ct-how-to-upload-document-history.png)


## Next steps

- Read about [document details](how-to-view-document-details.md).
