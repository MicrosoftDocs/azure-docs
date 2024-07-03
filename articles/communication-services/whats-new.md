---
title: What's new in Azure Communication Services
description: All of the latest additions to Azure Communication Services
author: sroons
ms.author: serooney
ms.service: azure-communication-services
ms.topic: conceptual
ms.date: 12/07/2023
ms.custom: template-concept, references_regions
---

# What's new in Azure Communication Services, Holiday Edition, 2023

We created this page to keep you updated on new features, blog posts, and other useful information related to Azure Communication Services. Be sure to check back monthly for all the newest and latest information!

We're combining the November and December updates into one. **Have a terrific holiday, everyone!**

<br>
<br>
<br>

[!INCLUDE [Survey Request](./includes/survey-request.md)]

## New features
Get detailed information on the latest Azure Communication Services feature launches.

### Call Diagnostics now available in Public Preview
:::image type="content" source="./media/whats-new-images/11-23/call-diagnostics.png" alt-text="A graphic showing icons that represent the ways that call diagnostics helps developers.":::

Azure Communication Services Call Diagnostics (CD) is a new feature that helps developers troubleshoot and improve their voice & video calling applications. It's an Azure Monitor experience that offers specialized telemetry and diagnostic pages in the Azure portal. With Call Diagnostics, developers can easily access and analyze data, visualizations, and insights for each call, and identify and resolve issues that affect the end-user experience. Call Diagnostics works with other ACS features, such as noise suppression and pre-call troubleshooting, to deliver beautiful, reliable video calling experiences that are easy to develop and operate. Call Diagnostics is now available in Public Preview. Try it today and see how Azure can help you make every call a success. 🚀



[Read the documentation.](./concepts/voice-video-calling/call-diagnostics.md)


<br>
<br>


### Email Simple Mail Transfer Protocol (SMTP) as Service
:::image type="content" source="./media/whats-new-images/11-23/email-as-a-service.png" alt-text="A graphic showing the Azure logo for email and the Azure Communication Services logo.":::

Azure Communication Services Email Simple Mail Transfer Protocol (SMTP) as a Service is now in public preview. This service allows you to send emails from your line of business applications using a cloud-based SMTP relay that is secure, reliable, and compliant. You can use Microsoft Entra Application ID to authenticate your SMTP requests and apply the power of Exchange as a transport. Whether you need to send high-volume B2C communications or occasional notifications, this service can meet your needs and expectations.



[Read the documentation.](./concepts/email/email-smtp-overview.md)


<br>
<br>

### Azure AI-powered Azure Communication Services Call Automation API Actions
:::image type="content" source="./media/whats-new-images/11-23/advanced-call-automation-actions.png" alt-text="A graphic showing a server interacting with the cloud":::

Azure AI-powered Call Automation API actions are now generally available for developers who want to create enhanced calling workflows using Azure AI Speech-to-Text, Text-to-Speech and other language understanding engines. These actions allow developers to play dynamic audio prompts and recognize voice input from callers, enabling natural conversational experiences and more efficient task handling. Developers can use these actions with any of the four major SDKs - .NET, Java, JavaScript and Python - and integrate them with their Azure OpenAI solutions to create virtual assistants that go beyond simple IVRs. You can learn more about this release and its capabilities from the Microsoft Ignite 2023 announcements blog and on-demand session.

[Read more in the Ignite Blog post.](https://techcommunity.microsoft.com/t5/azure-communication-services/ignite-2023-creating-value-with-intelligent-application/ba-p/3907629)

[View the on-demand session from Ignite.](https://ignite.microsoft.com/en-US/sessions/18ac73bd-2d06-4b72-81d4-67c01ecb9735?source=sessions)

[Read the documentation.](./concepts/call-automation/call-automation.md)

[Try the quickstart.](./quickstarts/call-automation/quickstart-make-an-outbound-call.md)

[Try a sample application.](./samples/call-automation-ai.md)
<br>
<br>



### Job Router

:::image type="content" source="./media/whats-new-images/11-23/job-router.png" alt-text="A photograph of a customer rep talking on the phone through a headset.":::

Job Router APIs are now generally available for developers who want to use Azure Communication Services to create personalized customer experiences across multiple communication channels. These APIs allow developers to classify, queue, and distribute jobs to the most suitable workers based on various routing rules, using any of the three major SDKs - .NET, JavaScript, and Python. You can learn more about Job Router and how to use it with Azure AI Services from the Ignite 2023 announcement blog and prerecorded video.
 
[Read more in the Ignite Blog post.](https://techcommunity.microsoft.com/t5/azure-communication-services/ignite-2023-creating-value-with-intelligent-application/ba-p/3907629)

[View the on-demand session from Ignite.](https://ignite.microsoft.com/en-US/sessions/18ac73bd-2d06-4b72-81d4-67c01ecb9735?source=sessions)

[Read the documentation.](./concepts/router/concepts.md)

[Try the quickstart.](./quickstarts/router/get-started-router.md)
<br>
<br>

### Azure Bot Support

:::image type="content" source="./media/whats-new-images/11-23/azure-bot-support.png" alt-text="A graphic showing the logos of Azure Bot Services and Azure Communication Services":::

With this release, you can use Azure bots to enhance your Chat service and integrate with Azure AI services. This helps you automate routine tasks for your agents, such as getting customer information and answering frequently asked questions. This way, your agents can focus on complex queries and assist more customers.

[Try the quickstart.](./quickstarts/chat/quickstart-botframework-integration.md)
[Read more about how to use adaptive cards.](https://adaptivecards.io/samples/)
<br>
<br>


### Managed Identities in Public Preview
:::image type="content" source="./media/whats-new-images/11-23/managed-identities.png" lightbox="./media/whats-new-images/10-23/number-lookup-lightbox.png" alt-text="A banner showing images representing identity and security.":::

Azure Communication Services now supports Azure Managed Identities, which are a feature of Microsoft Entra ID (formerly Azure Active Directory (Azure AD)) that allow resources to securely authenticate with other Azure services that support Entra authentication. Managed Identities is an [Azure Enterprise Promise](/entra/identity/managed-identities-azure-resources/overview) that improves security and simplifies workflows for customers, as they don't need to embed security credentials into their code. Managed Identities can be used in Azure Communication Services for various scenarios, such as connecting Cognitive Services, Azure Storage, and Key-Vault. You can learn more about this feature and how to use it from the Ignite 2023 announcement blog and prerecorded video.

[Try the quickstart.](./how-tos/managed-identity.md)


<br>

## Blog posts and case studies 
Go deeper on common scenarios and learn more about how customers are using advanced Azure Communication 
Services features.

### Azure Communication Services at DEVintersection & Microsoft Azure + AI Conference
:::image type="content" source="./media/whats-new-images/11-23/devintersection.png" alt-text="A banner showing the logos of HCLTech and Microsoft Azure.":::

Microsoft employees Shawn Henry and Dan Wahlin presented at the DEVintersection & Microsoft Azure + AI conference in Orlando, FL. Shawn and Dan presented four separate sessions plus a workshop. The sessions were: 

- Transform Customer Experiences with AI-assisted Voice, Video and Chat
- Azure for WhatsApp, SMS, and Email Integration: A Developer's Guide
- Take Your Apps to the Next Level with AI, Communication, and Organizational Data
- Integrate Services Across the Microsoft Cloud to Enhance User Collaboration

and the workshop was entitled "Integrate OpenAI, Communication, and Organizational Data Features into Line of Business Apps"


[Read the full blog post](https://techcommunity.microsoft.com/t5/azure-communication-services/azure-communication-services-at-devintersection-amp-amp/ba-p/3999834)

[Read more about the conference](https://devintersection.com/#!/)

### Ignite 2023: Creating value with intelligent application solutions for B2C communications
:::image type="content" source="./media/whats-new-images/11-23/ignite.png" alt-text="A banner that says Microsoft Ignite 2023.":::

Read a summary of all of the new features we announced at Ignite, including Azure AI Speech, Job Router and Azure AI Services!


[Read the full blog post](https://techcommunity.microsoft.com/t5/azure-communication-services/ignite-2023-creating-value-with-intelligent-application/ba-p/3907629)


<br>
<br>


### View of new features from November and December 2023
:::image type="content" source="./media/whats-new-images/10-23/blog-new.png" alt-text="An abstract photo of a wavy metal roof shining in the sunlight." :::

[View the complete list of all features launched in November and December.](https://techcommunity.microsoft.com/t5/azure-communication-services/azure-communication-services-december-2023-feature-updates/ba-p/4003567) of all new features added to Azure Communication Services in December.



<br>
<br>

<br>


Enjoy all of these new features. Be sure to check back here periodically for more news and updates on all of the new capabilities we've added to our platform! For a complete list of new features and bug fixes, visit our [releases page](https://github.com/Azure/Communication/releases) on GitHub. For more blog posts, as they're released, visit the [Azure Communication Services blog](https://techcommunity.microsoft.com/t5/azure-communication-services/bg-p/AzureCommunicationServicesBlog)
