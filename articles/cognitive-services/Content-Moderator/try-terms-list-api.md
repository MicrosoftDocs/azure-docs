---
title: Try custom term lists in Azure Content Moderator | Microsoft Docs
description: Try custom term lists with Text Moderation API
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 08/05/2017
ms.author: sajagtap
---

# Try Custom Term Lists with the Text Moderation API #

## About the Terms list management API ##
The default global list of terms is usually sufficient, but you may need to screen against terms that are specific to your business. For example, you may want to tag competitors’ names for further review. The [Terms List API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f67f) allows you to create custom lists of terms for use with the Text Moderation API. The **Text - Screen** operation scans your text for profanity, comparing it against custom and/or shared blacklists.

You can also create lists of images to be used with the List Moderation API. This tutorial focuses on lists of terms.

The Terms List management API include these operations:
- Create a list.
- Add terms to your list.
- Screen terms against the ones in the list.
- Delete term or terms from the list.
- Delete the list.
- Edit list information.
- Refresh the index so that changes are found during a scan.

## Try with the API console ##
Before you can test-drive the API from the online console, you will need the **Ocp-Apim-Subscription-Key**. This is found under the Settings tab, as shown below.

![Content Moderator credentials in the review tool](Review-Tool-User-Guide/images/credentials-2-reviewtool.png)

## Creating a terms list ##
1.	Navigate to the [Terms list management API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f67f) page.

2.	You land on the **Term Lists > Create** operation. 

3.	Click the button that most closely describes your location, under **Open API testing console**. The **Term Lists – Create** API Console opens.

  ![Try Terms List Management API Region](images/test-drive-region.png)
 
4.	Enter your subscription key.

5.	In the Request Body, type a **Name** for the term list, and a brief **Description**.
  ![Try Terms List API - Create Step 1](images/try-terms-list-create-1.png)

6.	Use the key-value pair placeholders to assign more descriptive metadata to your list. For example, you could enter something on these lines:
    {
      "Name": "MyExclusionList",
      "Description": "MyListDescription",
      "Metadata": {
      "Category": "Competitors",
      "Type": "Exclude"
      }
    }

  Note that we are adding list metadata as key value pairs, not the actual terms.
 
7.	Click Send. Your list is created. Make note of the Id number that is associated with the new list. You will need this for other List Management functions.

  ![Try Terms List API - Create Step 2](images/try-terms-list-create-2.png)
 
8.	Now you need to add terms to MyList. On the left, click **Term > Add Term**. Click the button that most closely describes your location, under **Open API testing console**. 
  ![Try Terms List Management API Region](images/test-drive-region.png)

9.	The **Term – Add Term** console opens.
 
10.	Enter the **listId** that you have generated above, and select the **language**. Enter your **subscription key** and click **Send**.

  ![Try Terms List Management API Step 3](images/try-terms-list-create-3.png)
 
9.	Verify the term has been added by using the **Term > Get All Terms** API. Enter the **listId** and your **subscription key**, and click **Send**.

  ![Try Terms List Management API Step 4](images/try-terms-list-create-4.png)
 
10.	Add a few more terms. Now that you have created a custom list of terms, try [scanning some text](try-text-api.md) against it. 
