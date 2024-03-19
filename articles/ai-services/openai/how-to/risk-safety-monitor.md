---
title: How to use the Risk & Safety dashboard in OpenAI Studio
titleSuffix: Azure OpenAI Service
description: Learn how to check statistics and insights from your Azure OpenAI content filtering activity.
author: PatrickFarley 
ms.author: pafarley 
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 03/16/2024
manager: nitinme
---

# How to enable Risks & safety monitor for your model deployment (preview) 

After you created a Azure OpenAI model deployment and applied a content filter to ensure the model is generating content in a responsible way, then it’s a natural experience to check the filter result of the content filter. Then use the insights to further fine tune the configuration, eventually to make sure it serves specific business needs as well as responsible AI principal.  

Besides the “harmful content analysis” insights, there’s advanced “potentially abusive user analysis” performed at user-level to help get potentially abusive users who are continuously sending abusive requests to the model or perform bad activities. Customers can take further response action if it’s confirmed as abusive.  

## Harmful content analysis   

### Prerequisites:

To visualize the harmful content analysis result, you need to ensure: 
- There’s a content filter configuration that’s been applied to the model deployment.  

### Reports description:  

The content filter is configured and applied to both “user input" and "model output". The harmful content analysis insights can be visualized respectively. The analyzed insights are: 

- **Total blocked request count and block rate**: The report shows a global view of the count/rate of the content that is filtered by the content filter over time according to the configuration applied to the model. Help customers understand the trend of harmful requests from users, then helps judge whether it’s expected or not.  
- **Blocked requests by category**: In addition to the overall blocked count/rate, having it break-down by category can show the detailed distribution. This is an all-up statistic of harmful requests across the time range selected. Currently support categories: hate, sextual, self-harm, violence. Other optional categories will be added soon.  
- **Block rate over time by category**: Show the over time trend of block rate by category. Currently support categories: hate, sextual, self-harm, violence. Other optional categories will be added soon. 
- **Severity distribution by category**: An all-up statistics of content that’s been detected as harmful across the time range selected and visualized by severity level. This is not limited to the blocked content but among all content that is detected as harmful.  
- **Severity rate distribution over time by category**: Show the over time trend of severity rate distribution by category. Click the tab to switch between different categories supported.

tbd Screenshot

### Follow-up actions: 

Fine tune the content filter configuration to further align with business needs and conform with the customer’s responsible AI requirements.  

## Potentially abusive user detection   

### Prerequisites:  

To visualize the potentially abusive user detection results, you need to ensure: 
- There’s a content filter configuration that’s been applied to the model deployment.  
- Send “UserGUID” information within the Azure OpenAI API calls through “user” field. Check the API reference.  
- Connect your Azure Data Explorer database to store user analysis results.  

> [!CAUTION]
> Do not pass over sensitive personal data in the “user” field. 

### Bring your own storage to get potentially abusive user detection in compliant 

In order to protect the data privacy of  “user” information, as well as manage the permission of the data we support the option for customers to bring their own storage to get the potentially abusive user detection stored in a compliant way and have full control. Steps to get it enabled:  

1. Go to the model deployment that you’d like to get the user abuse analysis results, click “Add a data store”.  
1. Fill in the required information and click “add”. It’s suggested to create a new storage to store the analysis results.  
1. After get the data store connected, perform following actions to grant permission: 
    1. Go to your Azure OpenAI resource page, and choose “Identity”.  
    1. Turn the status to “On” for system assigned identity, copy the identity that generated. 
    1. Go to the Azure Data Explorer resource you’ve connected, choose “databases” and then choose the specific database that created to store user-level analysis results.  
    1. Choose “permissions”, and add a “admin” role of the database.  
    1. Paste the identity generated in step 2, choose the one searched and click “Select”. Then your Azure OpenAI resource’s identity is authorized to read/write the storage.   

### Reports description:  

The potentially abusive user detection relies on the “user” information that customers send through within the Azure OpenAI API call, together with the request content and perform further analysis at user level. The goal is to help customers get a view of the source of those harmful content and then take response actions on the abusive users to ensure the model is being used in a responsible way. Several insights are showed:  
- **Total potentially abusive user count**: Show the over time trend of detected potentially abusive users whose abusive pattern is noticeable and may introduce high risk. The trend can help to assess the abusive risk over time and take proactive action to get it mitigated.  
- **Potentially abusive users list**: Show a detailed list of detected potentially abusive users. Insights showed on each user: 
    - UserGUID: send by the customer through “user” field in Azure OpenAI API.  
    - Abuse score: generated by a model which analyzes user’s requests and behavior. The score is normalized to 0-1. The higher score indicates a higher abusive risk.  
    - Abuse score trend: abuse score history during the selected time range.  
    - Evaluate date: the date of the results is analyzed.  
    - Total abusive request count/ rate 
    - Abusive request count/ rate by category 

tbd Screenshot

### Follow-up actions: 

Combine with enriched signals and validate whether the detected users are truly abusive or not. If yes, then take response action like throttle or suspend the user to ensure the responsible use of the large language models.  