---
title: Connect Azure Communication Services to Azure AI services
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide for connecting ACS to Azure AI services.
author: kunaal
ms.service: azure-communication-services
ms.subservice: call-automation
ms.topic: include
ms.date: 02/15/2023
ms.author: kpunjabi
ms.custom: references_regions
services: azure-communication-services
---

# Connect Azure Communication Services with Azure AI services

>[!IMPORTANT]
>Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
>Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/acs-tap-invite).


Azure Communication Services Call Automation APIs provide developers the ability to steer and control the Azure Communication Services Telephony, VoIP or WebRTC calls using real-time event triggers to perform actions based on custom business logic specific to their domain. Within the Call Automation APIs developers can use simple AI powered APIs, which can be used to play personalized greeting messages, recognize conversational voice inputs to gather information on contextual questions to drive a more self-service model with customers, use sentiment analysis to improve customer service overall. These content specific APIs are orchestrated through **Azure Cognitive Services** with support for customization of AI models without developers needing to terminate media streams on their services and streaming back to Azure for AI functionality. 

All this is possible with one-click where enterprises can access a secure solution and link their models through the portal. Furthermore, developers and enterprises don't need to manage credentials. Connecting your Azure AI services uses managed identities to access user-owned resources. Developers can use managed identities to authenticate any resource that supports Azure Active Directory authentication.

BYO Azure AI services can be easily integrated into any application regardless of the programming language. When creating an Azure Resource in Azure portal, enable the BYO option and provide the URL to the Azure AI services. This simple experience allows developers to meet their needs, scale, and avoid investing time and resources into designing and maintaining a custom solution.

> [!NOTE]
> This integration is only supported in limited regions for Azure AI services, for more information about which regions are supported please view the limitations section at the bottom of this document. It is also recommended that when you're creating a new Azure Cognitive Service resource that you create a Multi-service Cognitive Service resource.

## Common use cases

### Build applications that can play and recognize speech 

With the ability to, connect your Azure AI services to Azure Communication Services, you can enable custom play functionality, using [Text-to-Speech](../../../../articles/cognitive-services/Speech-Service/text-to-speech.md) and [SSML](../../../../articles/cognitive-services/Speech-Service/speech-synthesis-markup.md) configuration, to play more customized and natural sounding audio to users. Through the Azure AI services connection, you can also use the Speech-To-Text service to incorporate recognition of voice responses that can be converted into actionable tasks through business logic in the application. These functions can be further enhanced through the ability to create custom models within Azure AI services that are bespoke to your domain and region through the ability to choose which languages are spoken and recognized, custom voices and custom models built based on your experience. 

## Run time flow
[![Run time flow](./media/run-time-flow.png)](./media/run-time-flow.png#lightbox)

## Azure portal experience
You can also configure and bind your Communication Services and Azure AI services through the Azure portal. 

### Add a Managed Identity to the Azure Communication Services Resource 

1. Navigate to your Azure Communication Services Resource in the Azure portal.
2. Select the Identity tab.
3. Enable system assigned identity.  This action begins the creation of the identity; A pop-up notification appears notifying you that the request is being processed.

[![Enable managed identiy](./media/enable-system-identity.png)](./media/enable-system-identity.png#lightbox)

<a name='option-1-add-role-from-azure-cognitive-services-in-the-azure-portal'></a>

### Option 1: Add role from Azure AI services in the Azure portal
1. Navigate to your Azure Cognitive Service resource.
2. Select the "Access control (IAM)" tab.
3. Click the "+ Add" button.
4. Select "Add role assignments" from the menu.

[![Add role from IAM](./media/add-role.png)](./media/add-role.png#lightbox)

5. Choose the "Cognitive Services User" role to assign, then click "Next".

[![Cognitive Services User](./media/cognitive-service-user.png)](./media/cognitive-service-user.png#lightbox)

6. For the field "Assign access to" choose the "User, group or service principal".
7. Press "+ Select members" and a side tab opens.
8. Search for your Azure Communication Services resource name in the text box and click it when it shows up, then click "Select".

[![Select ACS resource](./media/select-acs-resource.png)](./media/select-acs-resource.png#lightbox)

9. Click “Review + assign”, this assigns the role to the managed identity.

### Option 2: Add role through Azure Communication Services Identity tab

1. Navigate to your Azure Communication Services resource in the Azure portal.
2. Select Identity tab.
3. Click on "Azure role assignments".

[![ACS role assignment](./media/add-role-acs.png)](./media/add-role-acs.png#lightbox)

4.  Click the "Add role assignment (Preview)" button, which opens the "Add role assignment (Preview)" tab.
5.  Select the "Resource group" for "Scope".
6.  Select the "Subscription".
7.  Select the "Resource Group" containing the Cognitive Service. 
8.  Select the "Role" "Cognitive Services User".

[![ACS role information](./media/acs-roles-cognitive-services.png)](./media/acs-roles-cognitive-services.png#lightbox)

10.  Click Save.

Your Communication Service has now been linked to your Azure Cognitive Service resource. 

<a name='azure-cognitive-services-regions-supported'></a>

## Azure AI services regions supported

This integration between Azure Communication Services and Azure AI services is only supported in the following regions at this point in time:
- westus
- westus2
- westus3
- eastus
- eastus2
- centralus
- northcentralus
- southcentralus
- westcentralus
- westeu

## Next Steps
- Learn about [playing audio](../../concepts/call-automation/play-ai-action.md) to callers using Text-to-Speech.
- Learn about [gathering user input](../../concepts/call-automation/recognize-ai-action.md) with Speech-to-Text.
