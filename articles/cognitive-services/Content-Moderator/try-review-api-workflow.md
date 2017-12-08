---
title: Set up content moderation workflows in Azure Content Moderator | Microsoft Docs
description: Learn how to use content moderation workflows in the API console.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 08/05/2017
ms.author: sajagtap
---

# Configure content moderation workflows in the API console

Use the Review API's [workflow operations](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/5813b46b3f9b0711b43c4c59) in Azure Content Moderator to create or update or get workflow details by using the Review API. You can define simple, complex, and even nested expressions for your workflows by using this API. The workflows appear in the Review tool for your team to use. The workflows are also used by the Review API's job operations.

## Use the API console
To test-drive the API by using the online console, you need a few values to enter into the console:

- **team**: The team name that you created when you set up your Review tool account. 
- **workflowname**: The name that you created for your workflow.
- **Ocp-Apim-Subscription-Key**: Located on the **Settings** tab. For more information, see [Overview](overview.md).

The simplest way to access a testing console is from the **Credentials** window.

1.	In the **Credentials** window, select [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/5813b46b3f9b0711b43c4c59).

  The **Workflow - Create Or Update** page opens.

2.	For **Open API testing console**, select the region that most closely describes your location.

  ![Workflow - Create Or Update page region selection](images/test-drive-region.png)

  The **Workflow - Create Or Update** API console opens.

3.  Enter values for **team**, **workflowname**, and **Ocp-Apim-Subscription-Key** (your subscription key).

  ![Workflow - Create Or Update console query parameters and headers](images/test-drive-workflow-1.PNG)
  
3.	Edit the **Request body** box to enter details for **description**, **type** (image or text workflow), and **expression**.

  ![Workflow - Create Or Update Request body edits](images/test-drive-workflow-2.PNG)
  
4.	Select **Send**. If the operation succeeds, the **Response content** box displays **true**.

  ![Workflow - Create Or Update console Response content displays true](images/test-drive-workflow-3.PNG)
  
5.	On the Content Moderator Dashboard, select **Review** > **Settings** > **Workflows**. Your new workflow appears, and is ready to use.

  ![Review tool list of workflows](images/test-drive-workflow-4.PNG)
  
6.	To see the designer view of the workflow, select the **Edit** option for your workflow, and then select the **Designer** tab.

  ![Review tool Designer tab for a selected workflow](images/test-drive-workflow-5.PNG)
  
7.	To see the JSON view of the workflow, select the **JSON** tab.

  ![Review tool JSON tab for a selected workflow](images/test-drive-workflow-6.PNG)

## Next steps

* Learn how to use workflows with [content moderation jobs](try-review-api-job.md).
