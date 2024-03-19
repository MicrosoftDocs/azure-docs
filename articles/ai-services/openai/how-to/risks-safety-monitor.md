---
title: How to use the Risk & Safety monitor in OpenAI Studio
titleSuffix: Azure OpenAI Service
description: Learn how to check statistics and insights from your Azure OpenAI content filtering activity.
author: PatrickFarley 
ms.author: pafarley 
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 03/19/2024
manager: nitinme
---

# Use the Risks & Safety monitor in OpenAI Studio (preview) 

When you use an Azure OpenAI model deployment with a content filter, you may want to check the results of the filtering activity. You can use that informatino to further adjust your filter configuration to serve your specific business needs and meet Responsible AI principles.  

[Azure OpenAI Studio](tbd) provides a Risks & Safety monitor dashboard for each of your deployments that have a content filter configuration applied.


Besides the "harmful content analysis" insights, there's advanced "potentially abusive user analysis" performed at user-level to help get potentially abusive users who are continuously sending abusive requests to the model or perform bad activities. Customers can take further response action if it's confirmed as abusive.

## Harmful content analysis   

tbd



### Report description

The content filter is configured and applied to both "user input" and "model output". The harmful content analysis insights can be visualized respectively. The available insights are: 
- **Total blocked request count and block rate**: The report shows a global view of the amount and rate of content that is filtered over time. This helps you understand trends of harmful requests from users and see any unexpected activity.
- **Blocked requests by category**: This view shows the amount of content blocked for each category. This is an all-up statistic of harmful requests across the time range selected. It currently supports the harm categories hate, sexual, self-harm, and violence.
- **Block rate over time by category**: This view shows the block rate for each category over time. It currently supports the harm categories hate, sexual, self-harm, and violence.
- **Severity distribution by category**: This view shows the severity levels detected for each harm category, across the whole selected time range. This is not limited to _blocked_ content but rather includes all content that was detected as harmful.
- **Severity rate distribution over time by category**: This view shows the rates of detected severity levels over time, for each harm category. Select the tabs to switch between supported categories.

tbd Screenshot

### Recommended actions:

Fine-tune your content filter configuration to further align with business needs and conform to your system's Responsible AI requirements.  


## Potentially abusive user detection   

tbd

In addition to a content filter configuration applied to your deployment, you need to do the following:
- Send "UserGUID" information from the Azure OpenAI API calls through "user" field. Check the API reference. TBD
- Connect an Azure Data Explorer database to store the user analysis results.

> [!CAUTION]
> Do not include sensitive personal data in the "user" field.

### Set up your Azure Data Explorer database

In order to protect the data privacy of "user" information, as well as manage the permission of the data, we support the option for customers to bring their own storage to store potentially abusive user detection insights in a compliant way and with full control. Follow these steps to enable it:
1. Navigate to the model deployment that you'd like to set up user abuse analysis with, and select **Add a data store**.  
1. Fill in the required information and select **add**. We recommend you create a new database to store the analysis results.
1. After you connect the data store, perform following actions to grant permission:
    1. Go to your Azure OpenAI resource page in the Azure portal, and choose the **Identity** tab.  
    1. Turn the status to **On** for system assigned identity, and copy the ID that's generated. 
    1. Go to your Azure Data Explorer resource in the Azure portal, choose **databases** and then choose the specific database you crated to store user analysis results.
    1. Choose **permissions**, and add an **admin** role to the database.  
    1. Paste the Azure OpenAI identity generated in a previous step, and select the one searched (TBD). Now your Azure OpenAI resource's identity is authorized to read/write to the storage account.

### Report description 

The potentially abusive user detection relies on the "user" information that customers send from within Azure OpenAI API calls, together with the request content,. The goal is to help you get a view of the sources of harmful content so you can take responsive actions to ensure the model is being used in a responsible way. Several insights are shown:
- **Total potentially abusive user count**: This view shows the number of detected potentially abusive users over time. These are users for whom a pattern of abuse was detected and who might introduce high risk.
- **Potentially abusive users list**: This view is a detailed list of detected potentially abusive users. It gives the following information for each user: 
    - **UserGUID**: This is sent by the customer through "user" field in Azure OpenAI APIs.
    - **Abuse score**: This is a figure generated by the model analyzing each user's requests and behavior. The score is normalized to 0-1. A higher score indicates a higher abuse risk.  
    - **Abuse score trend**: The change in **Abuse score** during the selected time range.
    - **Evaluate date**: The date the results were analyzed.  
    - **Total abuse request ratio/count**
    - **Abuse ratio/count by category** 

tbd Screenshot

### Recommended actions: 

Combine with enriched signals and validate whether the detected users are truly abusive or not. If yes, then take response action like throttle or suspend the user to ensure the responsible use of the large language models.  