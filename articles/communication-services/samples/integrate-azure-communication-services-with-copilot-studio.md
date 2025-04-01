---
title: Integrate Microsoft Copilot Studio to Azure Communication Services
titleSuffix: An Azure Communication Services sample showing how to integrate with agents built using Microsoft Copilot Studio
description: Overview of Call Automation sample using Azure Communication Services to enable developers to learn how to incorporate voice into their Microsoft Copilot Agent.
author: kpunjabi
services: azure-communication-services
ms.author: kpunjabi
ms.date: 04/01/2024
ms.topic: overview
ms.service: azure-communication-services
ms.subservice: call-automation
ms.custom: devx-track-extended-csharp
zone_pivot_groups: acs-csharp
---

# Supercharge Your Voice Interactions: Integrating Azure Communication Services with Microsoft Copilot Studio Agents

This document provides step by step instructions on how to create and integrate a Copilot Studio agent with Azure Communication Services. This will allow you to create voice enabled agents for your users to call into.

## Prerequisites
Before you begin, ensure you have the following:
- Azure account with an active subscription, for details see [Create an account for free](https://azure.microsoft.com/en-us/free/).
- Azure Communication Services resource, see [create a new Azure Communication Services resource](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource).
- Create a new web service application using Call automation SDK.
- An Azure AI Multiservice resource and a custom domain.
- [Connect Azure Communication Services and Azure AI](/azure/communication-services/concepts/call-automation/azure-communication-services-azure-cognitive-services-integration).
- A Copilot Studio License so that you can create and publish an agent.

## 1. Create your Agent in Copilot Studio
After logging in or signing up for Copilot Studio, you land on the Home page. Select **Create** in the left navigation.

[Create agent]()

On the Create page, select **New agent**.
Use the chat to describe your agent, using the provided questions for guidance.  
Once you’ve provided all the requested information, click **Create**.

[Click create]()

For more details on creating and customizing your agent you can refer to the [Copilot Studio quickstart](https://docs.microsoft.com/en-us/copilot-studio/quickstart).

## 2. Disable Authentication
Once you’ve created your agent you’ll need to make some updates so that you can integrate it with Azure Communication Service.

- Navigate to the **Settings** tab.

[Navigate to settings tab]()

- Click on **Security** on the left pane.

[Security]()

- Select **Authentication**, select **No Authentication** and click **Save**.

[Save]()

## 3. Get the Webchannel Security Key
Navigating back to the **Security** section select **Web Channel Security**. Copy and save this key somewhere, you will need this when you’re deploying your application.

## 4. Publish Agent
Now that you’ve got your agents settings updated and saved your agent key, you can publish your agent.

## 5. Setting up Code
- Get your Connection string from your Azure Communication Services resource.
- MCS Directline key and cogsvc.
- Setup DevTunnels (VS Code).

## 6. Overview of the Code 
- Incoming call: Register incoming call event.
- Answer call with transcription options.
- Build in barge-in logic, when you get intermediate results cancel your play operation.
- Play audio using TTS.
- Escalate call when user asks for a representative.

## 7. Run
You should now be able to make a call and talk to your agent.

## Tips
### Topics
To optimize for voice we would recommend you update topics where you’re using the “Message” type of Text to Speech, as it will optimize the agents responses for Speech scenarios.

### How to Handle System Topics
Your agent has System Topics built in by default you can choose to disable these, but if you wish to continue using them your application should build logic on handling these. Such as:
- **Escalate**: You will need to build agent transfer into your application to escalate the call from this copilot agent to a human representative.
```
