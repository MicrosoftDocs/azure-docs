---
title: Connect Azure Communication Services to Azure OpenAI services for Message Analysis 
titleSuffix: An Azure Communication Services concept document
description: Provides a conceptual doc for connecting Azure Communication Services to Azure AI services for Message Analysis.
author: bashan
ms.service: azure-communication-services
ms.topic: conceptual
ms.date: 07/27/2024
ms.author: bashan
services: azure-communication-services
---

# Connect Azure Communication Services to Azure OpenAI services for Message Analysis

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include-document.md)]

Azure Communication Services Advanced Messaging empowers developers to create essential workflows for incoming messages within Azure Communication Services using event triggers. These triggers can initiate actions rooted in tailored business logic. Developers can analyze and gain insights from inbound messages to enhance customer service experience. With the integration of our AI-driven event trigger, Developers can utilize AI analysis to bolster customer support. Content analysis is streamlined using Azure OpenAI Services, which also supports various AI model preferences.
In addition, there's no need for developers and businesses to handle credentials themselves. When linking your Azure AI services, managed identities are utilized to access resources owned by you. 

Developers can also use managed identities to authenticate with any service that accepts Microsoft Entra authentication.
You can incorporate Azure OpenAI capabilities into your app's messaging system by activating the Message Analysis feature within your Communication Service resources on the Azure portal. When enabling the feature, you're going to configure an Azure OpenAI endpoint, and selecting the preferred model. This efficient method empowers developers to meet their needs and scale effectively for meeting analytical objectives without the need to invest considerable time and effort into developing and maintaining a custom AI solution for interpreting message content.

> [!NOTE]
> This integration is supported in limited regions for Azure AI services. For more information about which regions are supported please view the limitations section at the bottom of this document. This integration only supports Multi-service Cognitive Service resource. We recommend if you're creating a new Azure AI Service resource you create a Multi-service Cognitive Service resource or when you're connecting an existing resource confirm that it is a Multi-service Cognitive Service resource.

## Common Scenarios for Message Analysis 
Developers are now able to deliver differentiated customer experiences and modernize the internal processes by easily integrating the Azure OpenAI to the message flow. Some of the key use cases that you can incorporate in your applications are listed below.

### Language Detection

Identifies the language of the message, provides confidence scores, and translate the message into English if the original message isn't in English

### Intent Recognition
Analyzes the message to determine the customer’s purpose, such as seeking help or providing feedback.

### Key Phrase Extraction
Extracts important terms and names from the message, which can be crucial for context.

### Build Automation

As a business, I can build automation on top of incoming WhatsApp messages.

## Azure AI services regions supported

This integration between Azure Communication Services and Azure AI services is only supported in the following regions:
- centralus
- northcentralus
- southcentralus
- westcentralus
- eastus
- eastus2
- westus
- westus2
- westus3
- canadacentral
- northeurope
- westeurope
- uksouth
- southafricanorth
- centralindia
- eastasia
- southeastasia
- australiaeast
- brazilsouth
- uaenorth


## Next steps
- [Handle Advanced Messaging events](../../quickstarts/advanced-messaging/whatsapp/handle-advanced-messaging-events.md)
- [Send WhatsApp template messages](./whatsapp/template-messages.md)
