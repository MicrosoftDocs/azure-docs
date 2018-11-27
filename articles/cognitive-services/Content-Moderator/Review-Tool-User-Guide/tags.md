---
title: Using tags in Azure Content Moderator | Microsoft Docs
description: Content Moderator includes default tags, and you can create custom tags for moderating content specific to your business.
services: cognitive-services
author: sanjeev3
manager: mikemcca
ms.service: cognitive-services
ms.component: content-moderator
ms.topic: article
ms.date: 06/25/2017
ms.author: sajagtap
---

# About Tags #

In addition to the two default tags, **isadult** (**a**) and **isracy** (**r**), you can create custom tags for more targeted scanning. These custom tags are then available for human reviewers to assign to images or text.

## Create tags ##

1.	Select Tags from the Settings tab.

  ![Content Moderation Tags](images/tags-1.png)

2.	Enter a two-letter Short code for the tag.
3.	Enter a Name for the tag. Keep the name short and descriptive. For example, **isbullying**.
4.	Enter a Description.
5.	Click Add.
6.	Click Save when you are done creating tags.

![Defining Content Moderation Tags](images/tags-2-define.png)

## Using Custom Tags ##

Custom tags are used during human review. They display on the preview, and the reviewer selects it by clicking on it.

![Using Content Moderation Tags](images/tags-3-use.png)

You can turn off different tags for different reviews, by checking or unchecking Is Visible.
 
![Disabling Content Moderation Tags](images/tags-4-disable.png)

While you can’t delete the two default tags, **isadult** and **isracy**, you can delete any custom tags that you have defined. Click the trash can next to the tag you want to delete.

![Deleting Content Moderation Tags](images/tags-5-delete.png)

## Next steps ##

To learn how to use tags for image moderation, see [Review moderated images](Review-Moderated-Images.md).
