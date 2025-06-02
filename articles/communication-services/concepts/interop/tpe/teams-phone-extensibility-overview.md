---
title: Teams Phone extensibility overview
titleSuffix: An Azure Communication Services article
description: This article describes features of Teams Phone extensibility (TPE).
author: henikaraa
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.date: 05/20/2025
ms.topic: conceptual
ms.author: henikaraa
ms.custom: public_preview
services: azure-communication-services
---

# Teams Phone extensibility

This article describes features of Teams Phone extensibility (TPE).

[!INCLUDE [public-preview-notice.md](../../../includes/public-preview-include-document.md)]

Artificial intelligence (AI) technologies increase the complexity of customer engagements, requiring businesses to adopt more sophisticated strategies to manage and improve customer interaction.

Azure Communication Services is enhancing Call Automation and Calling SDKs, empowering software developers to extend Microsoft Teams Phone into their line of business applications. Software developers can now provide their end users with access to Teams Phone features such as phone numbers, emergency calling, direct routing, and many others.

Contact center as a Service (CCaaS) independent software vendors (ISVs) can enable their end customers to connect with their existing Teams Phone deployment and let them use Teams Phone capabilities within the application provided by the ISV. At the same time, customers can now extend their Teams Phone with advanced call queuing, agent handling, and routing capabilities provided by third-party CCaaS ISVs applications.

## Overview

Teams Phone extensibility for Azure Communication Services offers a unified communication experience that integrates Teams Phone capabilities into CCaaS applications. This Teams Phone extensibility enables customers to use their existing Teams infrastructure, providing operational efficiency and a seamless agent calling experience.  

For CCaaS ISVs, Teams Phone extensibility presents a growth opportunity by tapping into the Teams ecosystem and Azure Communication Services. ISVs can access a suite of APIs tailored for contact center use cases, providing consistency and an integrated experience with Teams. ISVs also benefit from Azure with a simplified service deployment and support lifecycles, easy access to the wide range of Azure services, and faster time to market.

The following diagram shows the basic components and call flow between an agent, CCaaS application, Teams Phone System, and customer.

:::image type="content" source="./media/teams-phone-extensibility-overview.png" alt-text="Diagram showing basic components and call flow between an agent, CCaaS application, Teams Phone System, and customer."  lightbox="./media/teams-phone-extensibility-overview.png":::

There are four aspects to consider:

- Teams provisioning: A Teams IT Admin sets up a Teams Resource Account (RA), assigns phone numbers and adds the CCaaS application to the resource account to receive and make calls.
- CCaaS provisioning: A CCaaS Admin creates queues and links to the Teams Phone account and configures agent skills and routing groups.
- Teams Phone integration: CCaaS providers integrate with Azure Communication Services Call Automation APIs to receive and make calls and perform mid-call controls such as create custom IVRs and Call Queues. The current release supports only [Teams Phone service numbers](/microsoftteams/getting-service-phone-numbers).
- Agent calling experience: CCaaS provider embeds call handling in the Agent application using Azure Communication Services Calling SDKs or uses the Teams application, initialized with Microsoft 365 identity.

### Benefits

For CCaaS ISVs:

- Grow your business by partnering with the UCaaS market leader: Teams is recognized as the market leader. Teams brings an extensive network of partners and integrations. You can easily connect your UCaaS solution with other critical business applications and workflows.
- Reach extensibility: Microsoft Teams, in partnership with Azure Communication Services enables you to embed your applications on the server and client side.

For Contact Centers and Agents:

- Faster, easier deployment: Achieve rapid scalability without building communication infrastructure. Capitalize on Teams global deployment and familiar Teams user interface to speed adoption.
- Seamless communication within the organization: Combination of the Contact Center/Customer Experience applications and Unified Communication solutions streamline the process of tapping into organization’s wealth of knowledge to expedite addressing customer inquiries. The shared Teams infrastructure enables effortless access to internal subject matter experts, regardless of their location or communication channel.

## Prerequisites

Your ISV must have Azure subscription allowlisted by Microsoft Teams.

To provision the Teams environment for these extensions, you must enable the following licenses:
- Teams Phone license for the agent, see [Assign Teams add-on licenses to users > Product names and SKU identifiers for licensing](/microsoftteams/teams-add-on-licensing/assign-teams-add-on-licenses#product-names-and-sku-identifiers-for-licensing).
- Enterprise voice enabled as described in [Teams Phone features](../../../concepts/pricing/teams-interop-pricing.md).
- [Microsoft Teams Phone Resource Account licenses](/microsoftteams/teams-add-on-licensing/virtual-user) for the designed Teams resource account, included in the Teams Phone license.
- PSTN connectivity: Teams Calling Plans, Operator Connect, or Direct Routing.

## Conversational AI integration

Conversational AI enables you to automate customer interactions through natural language processing (NLP) and machine learning (ML). Conversational AI can understand and respond to customer queries, providing a seamless and efficient user experience.

Some conversational AI features include:

- Natural Language Understanding (NLU): Understands and processes natural language user input.
- Automated responses: Provides instant responses to common queries, reducing the need for human intervention.
- Contextual awareness: Maintains context across interactions, ensuring coherent and relevant responses.

CCaaS developers can use Call Automation to implement simple AI powered tools to:

- Play personalized greeting messages.
- Recognize conversational voice inputs to gather information on contextual questions to drive a more self-service model with customers.
- Use sentiment analysis to improve customer service overall.

These content specific APIs can be orchestrated through Azure AI Services. Content specific APIs enable you to customize AI models without terminating media streams in your services to stream back to Azure for AI functionality.

This seamless integration also enables CCaaS ISVs to use Teams Phone and Azure Communication Services SDKs to build Conversational AI solutions, enhance customer interactions, and efficiently route calls based on context and user preferences.

The following diagram shows how conversational AI integrates into your call flow.

:::image type="content" source="./media/teams-phone-extensibility-conversational-ai.png" alt-text="Diagram shows how conversational AI integrates into your call flow."  lightbox="./media/teams-phone-extensibility-conversational-ai.png":::

For more information, see [how to connect Azure Communication Services with Azure AI](../../call-automation/azure-communication-services-azure-cognitive-services-integration.md) and [how to get real-time transcription](../../call-automation/real-time-transcription.md).

## Call Routing

Teams Phone extensibility supports both outbound calling and emergency calling.

### Inbound PSTN call to the resource account

Inbound public switched telephone network (PSTN) calls to the phone number assigned to the Teams Resource Account (RA) trigger an Incoming Call Event Grid notification. The Incoming Call notification goes to the configured endpoint in the Azure Communication Services Resource you linked to the RA during provisioning. The CCaaS server-side application uses the Call Automation SDK to answer the call.

The following diagram shows the Inbound PSTN Call flow.

:::image type="content" source="./media/teams-phone-extensibility-pstn-inbound-call-flow.png" alt-text="Diagram shows the inbound PSTN call flow."  lightbox="./media/teams-phone-extensibility-pstn-inbound-call-flow.png":::

Call flow description:

1. Contoso uses Azure Communication Services Call Automation receives an inbound PSTN call to the provisioned Teams Phone number.
2. Contoso receives webhook notification of the inbound call.
3. An AI powered agent (IVR) answers the PSTN call and triages the customer request before hand-off to an agent.
4. Contoso routes the call to the correct destination.
5. An agent picks up the call on the Azure Communication Services Calling SDK client.

### Outbound PSTN calls from the CCaaS application on-behalf-of RA

You can use the `onBehalfOf` optional parameter of the Calling SDK for Web to specify a Teams resource account when placing an outbound PSTN call for calling line ID purposes. Using a resource account for outbound calls ensures that the customer sees the company’s caller ID and potentially a name, maintaining a professional image and consistent company contact details.

Using a resource account for outbound calls also enables the server application to have greater control over which numbers an agent can call. Greater control over called numbers enhances operational efficiency and ensures compliance with organizational policies. This client-initiated flow triggers an Incoming Call notification to the Contoso app. The Contoso app answers the call. Once the app is connected to the call, it adds the caller specified by the client.

The following diagram shows the Outbound PSTN Call flow.

:::image type="content" source="./media/teams-phone-extensibility-pstn-outbound-call-flow.png" alt-text="Diagram shows the Outbound PSTN Call flow in which starts with Azure Communication Services Calling SDK requesting an outbound call on behalf of Teams resource account. The Contoso Control Plane app places a call to the PSTN user."  lightbox="./media/teams-phone-extensibility-pstn-outbound-call-flow.png":::

Call flow description:

1. Azure Communication Services UI SDK app using CCaaS agent identity places a call on behalf of a Teams resource account. Developer specifies a `CommunicationIdentifier` associated with the Teams resource account in the `onBehalfOf` parameter of `CallClient.startCall` when placing the call. The CCaaS client then initiates the call.
2. Contoso control plane receives the request and passes it to Call Automation.
3. Call Automation places the call to a PSTN user with the Caller ID of a Teams resource account
4. Call is routed to PSTN user with Caller ID of Teams resource account.

> [!NOTE]
> Teams user personal phone numbers can't be used for outbound PSTN calling, only for emergency calling use cases.

## Emergency calling

Microsoft Teams customers can use enhanced emergency calling support to take advantage of existing investments and configurations that extend robust emergency calling functions to their platforms. Agents using the Calling SDK can dial emergency services, provide their static address location, alert security desks and receive callbacks from a Public Safety Answering Points (PSAP). Emergency calling is available in all countries supported today in MS Teams for user calling.

Emergency calling is enabled using Teams user phone numbers or shared calling phone numbers. Teams admins configure users with emergency calling policies and assign the policy to the user in the TAC portal and/or with PowerShell cmdlets. The user connected to the CCaaS client (using the Calling WebJS SDK and WebUI) can dial emergency services from their assigned Teams Phone number. The user can also provide a location, alert a security desk when they dial emergency services, and receive callbacks from a PSAP.

The shared calling policies assigned to the user and the Resource Account, and the emergency calling policies assigned to the user by the teams Admin are used for the emergency call.

The following diagram shows the emergency outbound call flow.

:::image type="content" source="./media/teams-phone-extensibility-emergency-outbound-calling.png" alt-text="Diagram shows the emergency outbound call flow."  lightbox="./media/teams-phone-extensibility-emergency-outbound-calling.png":::

The following diagram shows the emergency call-back scenario call flow.

:::image type="content" source="./media/teams-phone-extensibility-emergency-callback-scenario.png" alt-text="Diagram shows the emergency outbound call-back scenario call flow."  lightbox="./media/teams-phone-extensibility-emergency-callback-scenario.png":::

## Multi persona

Agents often use multiple applications on their desktops. The applications can include an Azure Communication Services web application for the contact center and a Teams application for unified communications. Some customers prefer to use the standard Teams application for both purposes.

With multi persona support, Microsoft Teams enables customers to separate their work and calls between different applications. For example, a user might use Teams for internal collaboration and the Azure Communication Services web application for customer care. This separation ensures that communication channels are distinct and tailored to the user needs, while still using a common phone system.

Teams administrators can manage policies and settings based on the use cases. For instance, calls made with a Teams Resource Account can follow the policies assigned to that account, while emergency calls can follow the user policies.

When adding or transferring calls to an agent or supervisor, the system determines which application to use based on the endpoint. If the endpoint is a Teams user, the call alerts the Teams application. If the endpoint is an Azure Communication Services web application user, the call alerts the web application.

This setup provides peace of mind for Teams administrators, knowing that communication channels are properly managed and separated. Users benefit from a seamless and efficient communication experience.

The following diagram shows a PSTN inbound call with multi persona.

:::image type="content" source="./media/teams-phone-extensibility-pstn-inbound-multi-persona.png" alt-text="Diagram shows the PSTN inbound call with multi persona."  lightbox="./media/teams-phone-extensibility-pstn-inbound-multi-persona.png":::

Call flow description:

1. Inbound PSTN call to a Teams Phone number provisioned for Azure Communication Services is routed to Call Automation.
2. Contoso receives webhook notification of inbound call.
3. Contoso routes call to the correct destination.
4. Teams, Azure Communication Services Calling SDK, or PSTN clients receive inbound call notification. The notification is currently implemented in Teams policy. There's no API to choose the Calling SDK vs Teams client for inbound call ringing. This behavior is controlled by policy.

Outbound OBO calls from RAs are available in the CCaaS client / server applications. Call history and other call activity streams are contained within the specific end client the call is associated with. For example, the Teams client only shows Teams client calls, CCaaS calls to the user are omitted from the Teams client (and vice versa).

To maintain agent presence synchronization across multiple personas (such as UCaaS and CCaaS), the CCaaS ISV uses the existing graph APIs to subscribe and set Teams presence for the agents. This approach is implemented today by all ISVs in the Teams Connect and Extend CCaaS models.

When an emergency call is placed from a Teams client, the PSAP callback alerts only the Teams Client. Emergency calls placed from a custom CCaaS client, the PSAP callback alerts both the Teams Client and custom CCaaS client simultaneously.

## Mid call Controls for Call Automation SDK

Mid-call controls for Call Automation SDK include add participants to the call and call transfer.

### Add participants to the call

Using the Call Automation SDK the CCaaS application can answer and add one or more participants to the call and remove participants or cancel an Add participant invite. The participants can either be other CCaaS agents, CCaaS supervisors, PSTN phone numbers, or a Subject Matter Expert (SME) Consult using Teams.

The following diagram shows the call flow to add a participant. In this diagram, Microsoft Teams Phone handles the customer call, which uses Azure Event Grid and Azure Communication Services to add a participant, in this case a CCaaS agent.

:::image type="content" source="./media/teams-phone-extensibility-add-participant-call-flow.png" alt-text="Diagram shows the call flow to add participant. Microsoft Teams Phone handles the customer call, which uses Azure Event Grid and Azure Communication Services to add a participant, in this case a CCaaS agent."  lightbox="./media/teams-phone-extensibility-add-participant-call-flow.png":::

Call flow description:

1. Contoso receives webhook notification of an inbound call.
2. Contoso routes the call to the correct destination by adding the required participant.
3. An agent picks up the call on the Azure Communication Services Calling SDK client.

### Call transfer

Using the Call Automation SDK the CCaaS application can answer and then do a call transfer to another CCaaS agent, CCaaS supervisor, PSTN phone number, or a Teams SME.

The following diagram shows the call transfer flow. In this diagram, Microsoft Teams Phone handles the customer call, which uses Azure Event Grid and Azure Communication Services to transfer the call to the CCaaS agent.

:::image type="content" source="./media/teams-phone-extensibility-call-transfer-call-flow.png" alt-text="Diagram shows the call transfer flow. Microsoft Teams Phone handles the customer call, which uses Azure Event Grid and Azure Communication Services to connect with the CCaaS agent"  lightbox="./media/teams-phone-extensibility-call-transfer-call-flow.png":::

Call flow description:

1. Contoso receives webhook notification of an inbound call.
2. Contoso routes call to the correct destination by transferring it to the required participant. The bot is removed from the call.
3. An agent picks up the call on Azure Communication Services Calling SDK client.

> [!NOTE]
> The *Redirect* option is available in the Call Automation SDK. We don't recommend using redirect for CCaaS scenarios. For better integration and support, we strongly recommend using the `AddParticipant` function when adding CCaaS agents to the call. This method ensures compatibility with future updates and provides a more robust solution for your needs.

## Value added services

Value added services include audio insights and call recording.

### Audio insights

Azure Communication Services Audio Streaming APIs enable developers to analyze audio streams in real-time to deliver enhanced interaction experience for all participants in a call using their own AI models.

Azure also provides AI services and tools for developers and organizations to rapidly create intelligent applications with prebuilt and customizable APIs and models. These solutions cover a wide range of functionalities such as natural language processing, search, monitoring, translation, speech, vision, and decision-making.

By using Azure AI capabilities, companies can enhance their call automation workflows with advanced features like speech-to-text (STT), text-to-speech (TTS), and natural language understanding (NLU). These advanced AI features are crucial for developing sophisticated IVR systems and other customer engagement solutions.

Azure Communication Services Call Automation, combined with Azure AI, is a powerful duo that enables businesses to create intelligent, automated communication workflows. This integration enables you to add speech capabilities and enhance customer service experience with features like real-time transcription of conversations.

For instance, it enables developers to implement custom play functionality, using [Text-to-Speech](/azure/cognitive-services/speech-service/text-to-speech) and [Speech Synthesis Markup Language (SSML)](/azure/cognitive-services/speech-service/speech-synthesis-markup) configuration, to play more customized and natural sounding audio to users. For more information, see [Connect Azure Communication Services to Azure AI services](/azure/communication-services/concepts/call-automation/azure-communication-services-azure-cognitive-services-integration).

The following diagram shows the audio insights call transcription flow.

:::image type="content" source="./media/teams-phone-extensibility-audio-insights.png" alt-text="Diagram shows the audio insights call transcription flow."  lightbox="./media/teams-phone-extensibility-audio-insights.png":::

### Call recording

Azure Communication Services provides developers with Call recording capabilities using runtime APIs to start, stop, pause, and resume recording for CCaaS scenarios. This capability enables developers to seamlessly integrate server-side call recording capabilities into Microsoft Teams calling experiences built with Call Automation and WebUI.

Developers can use Azure Communication Services Call recording APIs to customize their recording processes via internal business logic triggers. For example, a server application creates a group call and records the conversation end-to-end, limiting any action to end users. You can also enable actions triggered by a user that tell the server application to start recording. Developers can use Azure Communication Services Call recording to access a broader set of formats and features such as unmixed audio for post-call analysis or quality assurance processes.

These use cases are CCaaS admin highly controlled scenarios. Whether it's a Business-to-Consumer (B2C) or a Call Center scenario, CCaaS admin has strict control of the business logic for the recording process. The CCaaS admin determines Contoso internal retention policies and behaviors like automatic or manual recording initiation and subsequent processing of the recording. The initial TPE release focuses on enabling Azure Communication Services Call recording for CCaaS use cases on inbound and outbound calls. Prioritizing CCaaS ensures a streamlined integration with fewer complexities.

The following diagram shows an example call recording flow. In this example, there's an ongoing PSTN TPE call between a caller and a CCaaS user. The CCaaS user initiates the recording and the call recording bot produces the recording file.

:::image type="content" source="./media/teams-phone-extensibility-call-recording.png" alt-text="Diagram shows an example call recording flow for an ongoing PSTN TPW call between a caller and a CCaaS user. The CCaaS user initiates the recording and the call recording bot produces the recording file." lightbox="./media/teams-phone-extensibility-call-recording.png":::

## Next steps

- [Teams Phone System extensibility quickstart](../../../quickstarts/tpe/teams-phone-extensibility-quickstart.md)
- [Cost and connectivity options](teams-phone-extensibility-connectivity-cost.md)

## Related articles

- [Teams Phone client capabilities](./teams-phone-extensibility-client-capabilities.md)
- [Teams Phone extensibility FAQ](./teams-phone-extensibility-faq.md)
- [Teams Phone extensibility troubleshooting](./teams-phone-extensibility-troubleshooting.md)
