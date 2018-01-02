---
title: Credentials in Azure Content Moderator | Microsoft Docs
description: Content Moderator credentials to use with the APIs.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 06/25/2017
ms.author: sajagtap
---

# Credentials

Your Content Moderator credentials can come from the following locations:
- The Azure portal.
- The Content Moderator Review tool.

This article explains where to find them and how they relate to each other.

## The Azure portal

On the Azure portal dashboard, select your Content Moderator account. Under **Resource Management**, select **Keys**. To copy the key, select the icon to the right of the key.

![Content Moderator keys in the Azure portal](images/credentials-azure-portal-keys.PNG)

To use the human review tool and the review APIs, copy the Resource ID listed on the **Properties** TAB as seen below and submit on the review tool's credentials screen as shown in the following section.

![Content Moderator Resource Id in the Azure portal](images/credentials-azure-portal-resourceid.PNG)


## The Review tool

On the Review tool Dashboard, on the **Settings** tab, select **Credentials**.

![Content Moderator credentials in the review tool](images/credentials-trial-resource-workflow.PNG)

In the following sections, we examine the above image in more detail.


### API

The first part lists your **review API endpoint**, **team Id**, and the **Content Moderator trial key** generated as part of your review team creation. Use them to call the review API.

![Content Moderator key in the review tool](images/credentials-trialkey.PNG)


### Resource ID

The second part starts out as empty with no resource Id. To use your Content Moderator subscription with the review team and API, navigate to the resource Id screen as shown previously, and copy it into the field shown. Hit the **'+'** to save your resource Id.

> [!NOTE]
> Your Content Moderator subscription's region should match the review team's region for it to recognize your team and access the team data. For example, in the images on this page, The **West US** region **(4)** contains the Content Moderator Azure subscription and your review team.

![Content Moderator resource Id in the review tool](images/credentials-resourceids.PNG)


### Workflows

The third part shows the information used for running workflows. It will start out showing the auto-generated trial key by default. Update it with the paid key (or another API key) as needed. The other two fields allow using term and image lists in the Screen Text and Evaluate Image operations respectively.

![Content Moderator workflow credentials in the review tool](images/credentials-workflow.PNG)


## Next steps

* Learn how to use the Content Moderator credentials in your [workflows](workflows.md).
