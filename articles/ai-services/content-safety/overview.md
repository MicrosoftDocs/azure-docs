---
title: What is Azure AI Content Safety? 
titleSuffix: Azure AI services
description: Learn how to use Content Safety to track, flag, assess, and filter inappropriate material in user-generated content.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: overview
ms.date: 07/18/2023
ms.author: pafarley
keywords: content safety, Azure AI Content Safety, online content safety, content filtering software, content moderation service, content moderation
ms.custom: references_regions, build-2023, build-2023-dataai
#Customer intent: As a developer of content management software, I want to find out whether Azure AI Content Safety is the right solution for my moderation needs.
---

# What is Azure AI Content Safety? 

Azure AI Content Safety detects harmful user-generated and AI-generated content in applications and services. Azure AI Content Safety includes text and image APIs that allow you to detect material that is harmful. We also have an interactive Content Safety Studio that allows you to view, explore and try out sample code for detecting harmful content across different modalities.  

Content filtering software can help your app comply with regulations or maintain the intended environment for your users.

This documentation contains the following article types:  

* **[Quickstarts](./quickstart-text.md)** are getting-started instructions to guide you through making requests to the service.  
* **[How-to guides](./how-to/use-blocklist.md)** contain instructions for using the service in more specific or customized ways.  
* **[Concepts](concepts/harm-categories.md)** provide in-depth explanations of the service functionality and features.  

## Where it's used

The following are a few scenarios in which a software developer or team would require a content moderation service:

- Online marketplaces that moderate product catalogs and other user-generated content.
- Gaming companies that moderate user-generated game artifacts and chat rooms.
- Social messaging platforms that moderate images and text added by their users.
- Enterprise media companies that implement centralized moderation for their content.
- K-12 education solution providers filtering out content that is inappropriate for students and educators.

> [!IMPORTANT]
> You cannot use Azure AI Content Safety to detect illegal child exploitation images.

## Product types

There are different types of analysis available from this service. The following table describes the currently available APIs.

| Type                                           | Functionality                                                                                           | Input requirements                                                                                     |
|------------------------------------------------|---------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| **Analyze text API**                           | Scans text for sexual content, violence, hate, and self-harm with multi-severity levels.                | The default maximum length for text submissions is 10K characters. Split longer texts as needed.       |
| **Analyze image API**                          | Scans images for sexual content, violence, hate, and self-harm with multi-severity levels.              | Maximum image size: 4 MB; dimensions between 50x50 and 2048x2048 pixels. Supports multiple formats.    |
| **Prompt Shields (preview)**                   | Scans text for the risk of a [User input attack](./concepts/jailbreak-detection.md) on a Large Language Model. [Quickstart](./quickstart-jailbreak.md) | Maximum prompt length: 10,000 characters; up to 5 documents with a total of 10,000 characters.         |
| **Groundedness detection (preview)**           | Detects whether the text responses of large language models (LLMs) are grounded in the source materials provided by the users. [Quickstart](./quickstart-groundedness.md) | Maximum 55,000 characters for grounding sources per API call; 7,500 characters for text and query.     |
| **Protected material text detection (preview)** | Scans AI-generated text for known text content (e.g., song lyrics, articles). [Quickstart](./quickstart-protected-material.md) | Default maximum: 1K characters; minimum: 111 characters. For scanning LLM completions, not user prompts. |
| **Custom categories (rapid) API (preview)**     | Lets you define [emerging harmful content patterns](./concepts/custom-categories-rapid.md) and scan text and images for matches. [How-to guide](./how-to/custom-categories-rapid.md) | |


## Content Safety Studio

[Azure AI Content Safety Studio](https://contentsafety.cognitive.azure.com) is an online tool designed to handle potentially offensive, risky, or undesirable content using cutting-edge content moderation ML models. It provides templates and customized workflows, enabling users to choose and build their own content moderation system. Users can upload their own content or try it out with provided sample content.

Content Safety Studio not only contains out-of-the-box AI models but also includes Microsoft's built-in terms blocklists to flag profanities and stay up to date with new trends. You can also upload your own blocklists to enhance the coverage of harmful content that's specific to your use case. 

Studio also lets you set up a moderation workflow, where you can continuously monitor and improve content moderation performance. It can help you meet content requirements from all kinds of industries like gaming, media, education, E-commerce, and more. Businesses can easily connect their services to the Studio and have their content moderated in real-time, whether user-generated or AI-generated.

All of these capabilities are handled by the Studio and its backend; customers don’t need to worry about model development. You can onboard your data for quick validation and monitor your KPIs accordingly, like technical metrics (latency, accuracy, recall), or business metrics (block rate, block volume, category proportions, language proportions, and more). With simple operations and configurations, customers can test different solutions quickly and find the best fit, instead of spending time experimenting with custom models or doing moderation manually. 

> [!div class="nextstepaction"]
> [Content Safety Studio](https://contentsafety.cognitive.azure.com)


### Content Safety Studio features

In Content Safety Studio, the following Azure AI Content Safety service features are available:

* [Moderate Text Content](https://contentsafety.cognitive.azure.com/text): With the text moderation tool, you can easily run tests on text content. Whether you want to test a single sentence or an entire dataset, our tool offers a user-friendly interface that lets you assess the test results directly in the portal. You can experiment with different sensitivity levels to configure your content filters and blocklist management, ensuring that your content is always moderated to your exact specifications. Plus, with the ability to export the code, you can implement the tool directly in your application, streamlining your workflow and saving time.

* [Moderate Image Content](https://contentsafety.cognitive.azure.com/image): With the image moderation tool, you can easily run tests on images to ensure that they meet your content standards. Our user-friendly interface allows you to evaluate the test results directly in the portal, and you can experiment with different sensitivity levels to configure your content filters. Once you've customized your settings, you can easily export the code to implement the tool in your application.

* [Monitor Online Activity](https://contentsafety.cognitive.azure.com/monitor): The powerful monitoring page allows you to easily track your moderation API usage and trends across different modalities. With this feature, you can access detailed response information, including category and severity distribution, latency, error, and blocklist detection. This information provides you with a complete overview of your content moderation performance, enabling you to optimize your workflow and ensure that your content is always moderated to your exact specifications. With our user-friendly interface, you can quickly and easily navigate the monitoring page to access the information you need to make informed decisions about your content moderation strategy. You have the tools you need to stay on top of your content moderation performance and achieve your content goals.





## Security

<a name='use-azure-active-directory-or-managed-identity-to-manage-access'></a>

### Use Microsoft Entra ID or Managed Identity to manage access

For enhanced security, you can use Microsoft Entra ID or Managed Identity (MI) to manage access to your resources.
* Managed Identity is automatically enabled when you create a Content Safety resource.
* Microsoft Entra ID is supported in both API and SDK scenarios. Refer to the general AI services guideline of [Authenticating with Microsoft Entra ID](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory). You can also grant access to other users within your organization by assigning them the roles of **Cognitive Services Users** and **Reader**. To learn more about granting user access to Azure resources using the Azure portal, refer to the [Role-based access control guide](/azure/role-based-access-control/quickstart-assign-role-user-portal).

### Encryption of data at rest

Learn how Azure AI Content Safety handles the [encryption and decryption of your data](./how-to/encrypt-data-at-rest.md). Customer-managed keys (CMK), also known as Bring Your Own Key (BYOK), offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.

## Pricing

Currently, Azure AI Content Safety has an **F0 and S0** pricing tier. See the Azure [pricing page](https://aka.ms/content-safety-pricing) for more information.

## Service limits

### Language support

Content Safety models have been specifically trained and tested in the following languages: English, German, Japanese, Spanish, French, Italian, Portuguese, and Chinese. However, the service can work in [many other languages](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/language-support), but the quality might vary. In all cases, you should do your own testing to ensure that it works for your application.


| Services                                     | English Only | Multilingual | 
|----------------------------------------------|---------|-------------|
| Analyze text API                             |      | ✅           | 
| Analyze image API                            |   |     | 
| Prompt Shields (preview)                     | ✅       |            |  
| Groundedness detection (preview)             | ✅       |          |   
| Protected material text detection (preview)  | ✅       |         |  
| Custom categories (rapid) API (preview)      | ✅       |           |     

For more information, see [Language support](/azure/ai-services/content-safety/language-support).

### Region/location
To use the Content Safety APIs, you must create your Azure AI Content Safety resource in the supported regions. Currently, it is available in the following Azure regions:

| Services                                     | East US | West Europe | East US 2 | Central US | Canada East | France Central | Japan East | North Central US | South Central US | Switzerland North | UK South | West US 2 | Sweden Central | Poland Central | South India | West US | West US 3 |
|----------------------------------------------|---------|-------------|-----------|------------|-------------|----------------|------------|------------------|------------------|-------------------|----------|-----------|----------------|----------------|-------------|---------|-----------|
| Analyze text API                             | ✅       | ✅           | ✅         | ✅          | ✅           | ✅              | ✅          | ✅                | ✅                | ✅                 | ✅        | ✅         | ✅              |        ✅      |     ✅        |     ✅    |       ✅    |
| Analyze image API                            | ✅       | ✅           | ✅         | ✅          | ✅           | ✅              | ✅          | ✅                | ✅                | ✅                 | ✅        | ✅         | ✅              |   ✅           |      ✅       |    ✅     |   ✅        |
| Prompt Shields (preview)                     | ✅       | ✅           |           |            |             |                |            |                  |                  |                   |          |           |                |              |             |         |           |
| Groundedness detection (preview)             | ✅       |          |      ✅    |            |             |                |            |                  |                  |                   |          |   ✅        |         ✅        |              |             |         |           |
| Protected material text detection (preview)  | ✅       | ✅           |           |            |             |                |            |                  |                  |                   |          |           |                |              |             |         |           |
| Custom categories (rapid) API (preview)      | ✅       |           |           |            |             |                |            |                  |                  |                   |          |           |       ✅          |              |             |         |           |

Feel free to [contact us](mailto:contentsafetysupport@microsoft.com) if you need other regions for your business.

### Requests per 10 seconds


| Pricing Tier                                    | F0 | S0 | 
|----------------------------------------------|---------|-------------|
| Analyze text API                             | 1000     | 1000        | 
| Analyze image API                            | 1000      | 1000         | 
| Prompt Shields (preview)                     | 1000     |    1000       |     
| Groundedness detection (preview)             | 50     | 50      |    
| Protected material text detection (preview)  | 1000      | 1000          |      
| Custom categories (rapid) API (preview)      |   TBD |        TBD |     

If you need a faster rate, please [contact us](mailto:contentsafetysupport@microsoft.com) to request.


## Contact us

If you get stuck, [email us](mailto:contentsafetysupport@microsoft.com) or use the feedback widget on the upper right of any docs page.

## Next steps

Follow a quickstart to get started using Azure AI Content Safety in your application.
> [Content Safety quickstart](./quickstart-text.md)
