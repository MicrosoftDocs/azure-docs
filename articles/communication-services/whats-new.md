---
title: What's new in Azure Communication Services #Required; page title is displayed in search results. Include the brand.
description: All of the latest additions to Azure Communication Services #Required; article description that is displayed in search results. 
author: sroons #Required; your GitHub user alias, with correct capitalization.
ms.author: serooney #Required; microsoft alias of author; optional team alias.
ms.service: azure-communication-services #Required; service per approved list. slug assigned by ACOM.
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 03/12/2023 #Required; mm/dd/yyyy format.
ms.custom: template-concept, references_regions #Required; leave this attribute/value as-is.
---


# What's new in Azure Communication Services

We're adding new capabilities to Azure Communication Services all the time, so we created this page to share the latest developments in the platform. Bookmark this page and make it your go-to resource to find out all the latest capabilities of Azure Communication Services. 


## Updated documentation
We heard your feedback and made it easier to find the documentation you need as quickly and easily as possible. We're making our docs more readable, easier to understand, and more up-to-date. There's a new landing page design and an updated, better organized table of contents. We've added some of the content you've told us you need and will be continuing to do so, and we're editing existing documentation as well. Don't hesitate to use the feedback link at the top of each page to tell us if a page needs refreshing. Thanks!

## Teams interoperability (General Availability)
Azure Communication Services can be used to build custom applications and experiences that enable interaction with Microsoft Teams users over voice, video, chat, and screen sharing. The [Communication Services UI Library](./concepts/ui-library/ui-library-overview.md) provides customizable, production-ready UI components that can be easily added to these applications. The following video demonstrates some of the capabilities of Teams interoperability:

<br>

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWGTqQ]

To learn more about teams interoperability, visit the [teams interop overview page](./concepts/teams-interop.md)

## New calling features
Our calling team has been working hard to expand and improve our feature set in response to your requests. Some of the new features we've enabled include:

### Background blur and custom backgrounds (Public Preview)
Background blur gives users a way to remove visual distractions behind a participant so that callers can engage in a conversation without disruptive activity or confidential information appearing in the background. This feature is especially useful in a context such as telehealth, where a provider or patient might want to obscure their surroundings to protect sensitive information. Background blur can be applied across all virtual appointment scenarios to protect user privacy, including telebanking and virtual hearings. In addition to enhanced confidentiality, the custom backgrounds capability allows for more creativity of expression, allowing users to upload custom backgrounds to host a more fun, personalized calling experience. This feature is currently available on Web Desktop and will be expanding to other platforms in the future.  

:::image type="content" source="./media/whats-new-images/cy23Q1/custom-background.png" alt-text="Screenshot showing custom background in an Azure Communication Services call.":::  
*Figure 1: Custom background*

To learn more about custom backgrounds and background blur, visit the overview on [adding visual effects to your call](./concepts/voice-video-calling/video-effects.md).

### Raw media access (Public Preview)
The video media access API provides support for developers to get real-time access to video streams so that they can capture, analyze, and process video content during active calls. Developers can access the incoming call video stream directly on the call object and send custom outgoing video stream during the call. This feature sets the foreground services to support different kinds of video and audio manipulation. Outgoing video access can be captured and implemented with screen sharing, background blur, and video filters before being published to the recipient, allowing viewers to build privacy into their calling experience. In more complex scenarios, video access can be fitted with a virtual environment to support augmented reality. Spatial audio can be injected into remote incoming audio to add music to enhance a waiting room lobby. 

To learn more about raw media access visit the [media access overview](./concepts/voice-video-calling/media-access.md)

Other new calling features include:
- Webview support for iOS and Android
- Early media support in call flows
- Chat composite for mobile native development
- Added browser support for JS Calling SDK
- Call readiness tools
- Simulcast

Take a look at our feature update blog posts from [January](https://techcommunity.microsoft.com/t5/azure-communication-services/azure-communication-services-calling-features-update/ba-p/3735073) and [February](https://techcommunity.microsoft.com/t5/azure-communication-services/azure-communication-services-february-2023-feature-updates/ba-p/3737486) for more detailed information and links to numerous quickstarts.

## Rooms (Public Preview)
Azure Communication Services provides a concept of a room for developers who are building structured conversations such as virtual appointments or virtual events. Rooms currently allow voice and video calling. 

To learn more about rooms, visit the [overview page](./concepts/rooms/room-concept.md)

## Sample Builder Rooms integration

**We are excited to announce that we have integrated Rooms into our Virtual Appointment Sample.**

Azure Communication Services (ACS) provides the concept of a room. Rooms allow developers to build structured conversations such as scheduled virtual appointments or virtual events. Rooms allow control through roles and permissions and enable invite-only experiences. Rooms currently allow voice and video calling.

## Enabling a faster sample building experience

Data indicates that ~40% of customers abandon the Sample Builder due to the challenging nature of the configuration process, particularly during the Microsoft Bookings setup. To address this issue, we've implemented a solution that streamlines the deployment process by using Rooms for direct virtual appointment creation within the Sample Builder. This change results in a significant reduction of deployment time, as the configuration of Microsoft Bookings isn't enforced, but rather transformed into an optional feature that can be configured in the deployed Sample. Additionally, we've incorporated a feedback button into the Sample Builder and made various enhancements to its accessibility. With Sample Builder, customers can effortlessly customize and deploy their applications to Azure or their Git repository, without the need for any coding expertise.  


:::image type="content" lightbox="./media/whats-new-images/cy23Q1/sample-builder-rooms-1-lightbox.png" source="./media/whats-new-images/cy23Q1/sample-builder-rooms-1.png" alt-text="Screenshot showing sample Builder scheduling experience.":::  
*Figure 2: Scheduling experience options.*


:::image type="content" lightbox="./media/whats-new-images/cy23Q1/2023-03-15_10-40-38-lightbox.png" source="./media/whats-new-images/cy23Q1/sample-builder-feedback.png" alt-text="Screenshot showing sample Builder feedback form.":::  
*Figure 3:  Feedback form.*


Sample Builder is already in General Availability and can be accessed [on Azure portal](https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/50ad1522-5c2c-4d9a-a6c8-67c11ecb75b8/resourceGroups/serooney-tests/providers/Microsoft.Communication/CommunicationServices/email-tests/sample_applications).  


## Call Automation (Public Preview)
Azure Communication Services Call Automation provides developers the ability to build server-based, intelligent call workflows, and call recording for voice and PSTN channels. The SDKs, available for .NET and Java, uses an action-event model to help you build personalized customer interactions. Your communication applications can listen to real-time call events and perform control plane actions (like answer, transfer, play audio, start recording, etc.) to steer and control calls based on your business logic.

ACS Call Automation can be used to build calling workflows for customer service scenarios, as depicted in the following high-level architecture. You can answer inbound calls or make outbound calls. Execute actions like playing a welcome message, connecting the customer to a live agent on an ACS Calling SDK client app to answer the incoming call request. With support for ACS PSTN or Direct Routing, you can then connect this workflow back to your contact center.

:::image type="content" source="./media/whats-new-images/cy23Q1/call-automation-architecture.png" alt-text="Diagram of call automation architecture.":::
*Figure 4: Call Automation Architecture*

To learn more, visit our [Call Automation overview article](./concepts/call-automation/call-automation.md).

## Phone number expansion now in General Availability (Generally Available)
 We're excited to announce that we have launched Phone numbers in Canada, United Kingdom, Italy, Ireland and Sweden from Public Preview into General Availability. ACS Direct Offers are now generally available in the following countries and regions: **United States, Puerto Rico, Canada, United Kingdom, Italy, Ireland** and **Sweden**. 

To learn more about the different ways you can acquire a phone number in these regions, visit the [article on how to get and manage phone numbers](./quickstarts/telephony/get-phone-number.md), or [reaching out to the IC3 Service Desk](https://github.com/Azure/Communication/blob/master/special-order-numbers.md). 

Enjoy all of these new features. Be sure to check back here periodically for more news and updates on all of the new capabilities we've added to our platform! For a complete list of new features and bug fixes, visit our [releases page](https://github.com/Azure/Communication/releases) on GitHub.