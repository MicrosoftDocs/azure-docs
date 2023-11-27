---
title: What's new in Azure Communication Services
description: All of the latest additions to Azure Communication Services
author: sroons
ms.author: serooney
ms.service: azure-communication-services
ms.topic: conceptual
ms.date: 10/05/2023
ms.custom: template-concept, references_regions
---

# What's new in Azure Communication Services, October 2023

We created this page to keep you updated on new features, blog posts, and other useful information related to Azure Communication Services. Be sure to check back monthly for all the newest and latest information!

<br>
<br>
<br>


## New features
Get detailed information on the latest Azure Communication Services feature launches.
### Managed identities in public preview
:::image type="content" source="./media/whats-new-images/10-23/managed-id.png" alt-text="A graphic showing Azure logos for security and the Azure Communication Services logo.":::

We're thrilled to announce the support for Azure Managed Identities for Azure Communication Services in public preview This is an Azure Enterprise Promise that enhances security for customers, and simplifies workflows to manage identities in their Azure Communication Services resources.


[Read the documentation](./how-tos/managed-identity.md)

[Try the quickstart to connect to Azure AI services](./concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md)

[Try the quickstart to bring your own storage ](./quickstarts/call-automation/call-recording/bring-your-own-storage.md)
<br>
<br>

 
### Advanced messaging enables WhatsApp
:::image type="content" source="./media/whats-new-images/10-23/adv-mess.png" alt-text="A graphic showing the Azure Communization Services logo and the WhatsApp logo.":::

Available in public preview, developers can integrate WhatsApp Business Platform into their applications with Azure Communication Services Advanced Messaging.
 
The Advanced Messaging SDK from Azure Communication Services enables businesses to reach more customers at scale and deliver reliable communications to users worldwide.


**Effortlessly Connect with WhatsApp Users**

WhatsApp is one of the most popular messaging apps. Businesses can now communicate with WhatsApp users that request to hear from them directly from their Azure applications. This enables efficient and effective communication with their target audiences that prefer effortless, personalized, and secure communications with their favorite brands.
 
**Incorporate WhatsApp into key communication scenarios**

With Advanced Messaging, you can build conversational scenarios such as contact center support and professional advising, as well as notification and follow-up scenarios such as sending appointment reminders, transaction receipts, shipping updates, or one-time passcodes. You can also integrate WhatsApp with other communication channels such as SMS, email, chat, voice, and video using the Azure Communication Services platform. Adding WhatsApp as a channel to your application allows you to reach customers in one of the largest user communities spanning the globe.


[Read the full blog post](https://techcommunity.microsoft.com/t5/azure-communication-services/advanced-messaging-enables-whatsapp/ba-p/3952721)
<br>
<br>


### Pre-Registered Alpha IDs GA!

:::image type="content" source="./media/whats-new-images/10-23/geo-expansion-new.png" alt-text="A photograph of a map of the world showing multiple regions and a man pointing at one of them.":::

Alphanumeric Sender IDs is a one-way SMS messaging number type, formed by alphabetic and numeric characters that allow our customers to use their company name as sender of an SMS message providing improved brand recognition. Alphanumeric Sender IDs also support higher message throughput than toll-free and geographic numbers.
 
We're entering GA in five European regions that require preregistration to be able to use Alphanumeric Sender IDs: Norway, Finland, Slovakia, Slovenia and Czech Republic.
 

### Calling Web UI Library updates
:::image type="content" source="./media/whats-new-images/10-23/ui-library.png" alt-text="A graphic showing the elements of the Azure Communication Services UI Library.":::

The web version of our UI Library launched many new features this month, including:

#### Blur and custom backgrounds
We're excited to announce the general availability of blurred and custom backgrounds for desktop web within the Web UI SDK. These features make it easier for users to customize their video backgrounds and improve the overall video calling experience.

[Learn more about Custom Backgrounds](https://azure.github.io/communication-ui-library/?path=/docs/videoeffects--page)

#### Closed Captions in Interoperability
Closed captions are a textual representation of audio during a video conversation that is displayed to users in real-time. Closed captions are also a useful tool for end users who prefer to read the audio text in order to engage more actively in conversations and meetings. Closed captions also help in scenarios where end users might be in noisy environments or having difficulties with their audio equipment. Azure Communication Services collaboration with Teams offers developers the ability to integrate these closed captions into their applications.

[Learn more about how you can use Closed captions for your application](./concepts/interop/enable-closed-captions.md)

[Try the quickstart](./how-tos/calling-sdk/closed-captions-teams-interop-how-to.md)


#### Interoperability Roles and Capabilities
Support for interoperability Microsoft Teams roles and capabilities is now in general availability. This feature enables users to control what features other users can have within a call. This signals the enabling of the Capabilities API within the Azure Communication Services Web UI Library. With the Capabilities API, users within Microsoft Teams interoperability calls can be assigned different roles that have different capabilities and access to different features. For example, a presenter might have the ability to share their screen, while a participant might only have the ability to view the presenter's screen.


[Learn more about Roles and Capabilities](https://azure.github.io/communication-ui-library/?path=/docs/capabilities--page)



#### Pinned Layouts and Rendering Options
Azure Communication Services UI library: Pinning and additional rendering options initially launched earlier in the year are now generally available. These features make it easier for developers to create responsive and flexible user interfaces.

[Learn more about Pinned Layouts](https://azure.github.io/communication-ui-library/?path=/docs/ui-components-videogallery--video-gallery#pinning-participants)

#### Raise Hands
The Raise Hand feature, introduced in April this year, is now generally available in both the Azure Communication Services calling SDK and the stable version of the UI Web SDK from version 1.18.0. The ability to raise hands in a meeting is a game-changer when in large virtual meetings where users can raise hands to keep order while asking questions, participate in Q&A sessions, request assistance, vote, bid farewell politely, or even signify your readiness to move forward—all without interrupting the flow of conversation. 

[Get started with Raise Hands](https://azure.github.io/communication-ui-library/?path=/docs/ui-components-controlbar-buttons-raisehand--raise-hand)




### Calling Native UI Library picture in picture (PIP)

With the new Picture in Picture (PiP) functionality, now in public preview, users can shrink the ongoing call into a small, draggable window. This feature allows for uninterrupted multitasking – whether you're browsing, checking notes, or using other apps, your call remains on-screen, ensuring you never miss a beat.

 

Another challenge many users faced in the past is the risk of breaking the call experience when switching between apps. The UI Library tackles this problem head-on. Now, users can easily go back to the same app or even switch to a different one without ever losing focus on the call. This means that if you're discussing a document on a call, you can seamlessly navigate to that document and back to the call, ensuring a fluid, integrated user experience.

Start using this feature in [Android](https://github.com/Azure/communication-ui-library-android/releases/tag/calling-v1.5.0-beta.1) or [iOS](https://github.com/Azure/communication-ui-library-ios/releases/tag/AzureCommunicationUICalling_1.5.0-beta.1)

### Number Lookup
:::image type="content" source="./media/whats-new-images/10-23/number-lookup.png" lightbox="./media/whats-new-images/10-23/number-lookup-lightbox.png" alt-text="A diagram showing the number lookup architecture.":::

The Azure Communication Services public preview of the Number Lookup API is now available. This service enables developers with the necessary tools to integrate simple, highly accurate, and fast number lookup capabilities into their application. The API is designed to provide the highest quality possible, with data aggregated from reliable suppliers and updated regularly and it’s easy to use, with simple integration and detailed documentation to guide developers through the process.

[Read more in documentation](./concepts/numbers/number-lookup-concept.md)
[Read the SDK overview](./concepts/numbers/number-lookup-sdk.md)


<br>

## Blog posts and case studies 
Go deeper on common scenarios and learn more about how customers are using advanced Azure Communication 
Services features.

### HCLTech and Microsoft drive intelligent B2C communications for the enterprise
:::image type="content" source="./media/whats-new-images/10-23/hcl.png" alt-text="A banner showing the logos of HCLTech and Microsoft Azure.":::

We're excited to announce that our collaboration with HCLTech is now live, and we're able to bring the best of HCLTech's implementation to Microsoft clients globally to help them achieve more through intelligent B2C communications across every interaction with their customers, patients and consumers.

To achieve more through intelligent communications, HCLTech brings together the best of Microsoft technology including Azure Communication Services, Azure AI Services, Azure OpenAI service, plus Microsoft Teams to create endpoint solutions between businesses and customers. These capabilities draw from an organization's data, such as a CRM system, and integrates with Azure's powerful data and analytics platform. The goal is to drive continuous customer satisfaction leading to brand loyalty harnessed by migrating all the organizations customer communications to one intelligent B2C communications platform with Microsoft.


[Read the full blog post](https://techcommunity.microsoft.com/t5/azure-communication-services/hcltech-and-microsoft-drive-intelligent-b2c-communications-for/ba-p/3968123)


<br>
<br>


### View of new features from October 2023
:::image type="content" source="./media/whats-new-images/10-23/blog-new.png" alt-text="An abstract photo of a wavy metal roof shining in the sunlight." :::

View the complete list of all features launched in October

[View the complete list](https://techcommunity.microsoft.com/t5/azure-communication-services/azure-communication-services-october-2023-feature-updates/ba-p/3952205) of all new features added to Azure Communication Services in October.

<br>
<br>

<br>


Enjoy all of these new features. Be sure to check back here periodically for more news and updates on all of the new capabilities we've added to our platform! For a complete list of new features and bug fixes, visit our [releases page](https://github.com/Azure/Communication/releases) on GitHub. For more blog posts, as they're released, visit the [Azure Communication Services blog](https://techcommunity.microsoft.com/t5/azure-communication-services/bg-p/AzureCommunicationServicesBlog)
