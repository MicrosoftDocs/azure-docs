---
title: How to use Risks & Safety monitoring in Azure OpenAI Studio
titleSuffix: Azure OpenAI Service
description: Learn how to check statistics and insights from your Azure OpenAI content filtering activity.
author: PatrickFarley 
ms.author: pafarley 
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 03/19/2024
manager: nitinme
---

# Use Risks & Safety monitoring in Azure OpenAI Studio (preview) 

When you use an Azure OpenAI model deployment with a content filter, you may want to check the results of the filtering activity. You can use that information to further adjust your filter configuration to serve your specific business needs and Responsible AI principles.  

[Azure OpenAI Studio](https://oai.azure.com/) provides a Risks & Safety monitoring dashboard for each of your deployments that uses a content filter configuration.

## Access Risks & Safety monitoring

To access Risks & Safety monitoring, you need an Azure OpenAI resource in one of the supported Azure regions: East US, Switzerland North, France Central, Sweden Central, Canada East. You also need a model deployment that uses a content filter configuration.

Go to [Azure OpenAI Studio](https://oai.azure.com/) and sign in with the credentials associated with your Azure OpenAI resource. Select the **Deployments** tab on the left and then select your model deployment from the list. On the deployment's page, select the **Risks & Safety** tab at the top.

## Content detection   

The **Content detection** pane shows information about content filter activity. Your content filter configuration is applied as described in the [Content filtering documentation](/azure/ai-services/openai/how-to/content-filters).

### Report description

Content filtering data is shown in the following ways:
- **Total blocked request count and block rate**: This view shows a global view of the amount and rate of content that is filtered over time. This helps you understand trends of harmful requests from users and see any unexpected activity.
- **Blocked requests by category**: This view shows the amount of content blocked for each category. This is an all-up statistic of harmful requests across the time range selected. It currently supports the harm categories hate, sexual, self-harm, and violence.
- **Block rate over time by category**: This view shows the block rate for each category over time. It currently supports the harm categories hate, sexual, self-harm, and violence.
- **Severity distribution by category**: This view shows the severity levels detected for each harm category, across the whole selected time range. This is not limited to _blocked_ content but rather includes all content that was flagged by the content filters.
- **Severity rate distribution over time by category**: This view shows the rates of detected severity levels over time, for each harm category. Select the tabs to switch between supported categories.

:::image type="content" source="../media/how-to/content-detection.png" alt-text="Screenshot of the content detection pane in the Risks & Safety monitoring page." lightbox="../media/how-to/content-detection.png":::

### Recommended actions

Adjust your content filter configuration to further align with business needs and Responsible AI principles.

## Potentially abusive user detection   

The **Potentially abusive user detection** pane leverages user-level abuse reporting to show information about users whose behavior has resulted in blocked content. The goal is to help you get a view of the sources of harmful content so you can take responsive actions to ensure the model is being used in a responsible way. 


To use Potentially abusive user detection, you need:
- A content filter configuration applied to your deployment.
- You must be sending user ID information in your Chat Completion requests (see the _user_ parameter of the [Completions API](/azure/ai-services/openai/reference#completions), for example).
    > [!CAUTION]
    > Use GUID strings to identify individual users. Do not include sensitive personal information in the "user" field.
- An Azure Data Explorer database set up to store the user analysis results (instructions below).

### Set up your Azure Data Explorer database

In order to protect the data privacy of user information and manage the permission of the data, we support the option for our customers to bring their own storage to get the detailed potentially abusive user detection insights (including user GUID and statistics on harmful request by category) stored in a compliant way and with full control. Follow these steps to enable it:
1. In Azure OpenAI Studio, navigate to the model deployment that you'd like to set up user abuse analysis with, and select **Add a data store**. 
1. Fill in the required information and select **Save**. We recommend you create a new database to store the analysis results.
1. After you connect the data store, take the following steps to grant permission to write analysis results to the connected database:
    1. Go to your Azure OpenAI resource's page in the Azure portal, and choose the **Identity** tab.
    1. Turn the status to **On** for system assigned identity, and copy the ID that's generated. 
    1. Go to your Azure Data Explorer resource in the Azure portal, choose **databases**, and then choose the specific database you created to store user analysis results.
    1. Select **permissions**, and add an **admin** role to the database.  
    1. Paste the Azure OpenAI identity generated in the earlier step, and select the one searched. Now your Azure OpenAI resource's identity is authorized to read/write to the storage account.
1. Grant access to the connected Azure Data Explorer database to the users who need to view the analysis results:
    1. Go to the Azure Data Explorer resource you’ve connected, choose **access control** and add a **reader** role of the Azure Data Explorer cluster for the users who need to access the results. 
    1. Choose **databases** and choose the specific database that's connected to store user-level abuse analysis results. Choose **permissions** and add the **reader** role of the database for the users who need to access the results. 


### Report description 

The potentially abusive user detection relies on the user information that customers send with their Azure OpenAI API calls, together with the request content. The following insights are shown:
- **Total potentially abusive user count**: This view shows the number of detected potentially abusive users over time. These are users for whom a pattern of abuse was detected and who might introduce high risk.
 - **Potentially abusive users list**: This view is a detailed list of detected potentially abusive users. It gives the following information for each user: 
    - **UserGUID**: This is sent by the customer through "user" field in Azure OpenAI APIs.
    - **Abuse score**: This is a figure generated by the model analyzing each user's requests and behavior. The score is normalized to 0-1. A higher score indicates a higher abuse risk.  
    - **Abuse score trend**: The change in **Abuse score** during the selected time range.
    - **Evaluate date**: The date the results were analyzed.  
    - **Total abuse request ratio/count**
    - **Abuse ratio/count by category** 

:::image type="content" source="../media/how-to/potentially-abusive-user.png" alt-text="Screenshot of the Potentially abusive user detection pane in the Risks & Safety monitoring page." lightbox="../media/how-to/potentially-abusive-user.png":::

### Recommended actions

Combine this data with enriched signals to validate whether the detected users are truly abusive or not. If they are, then take responsive action such as throttling or suspending the user to ensure the responsible use of your application.

## Next steps

Next, create or edit a content filter configuration in Azure OpenAI Studio.

- [Configure content filters with Azure OpenAI Service](/azure/ai-services/openai/how-to/content-filters)
