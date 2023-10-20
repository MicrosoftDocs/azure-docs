---
title: Responsible AI FAQ for Microsoft Copilot for Azure (preview)
description: Learn how Microsoft Copilot for Azure (preview) uses data and what to expect.
ms.date: 11/15/2023
ms.topic: how-to
ms.service: azure
ms.author: jenhayes
author: JnHs
hideEdit: true
---

# Responsible AI FAQ for Microsoft Copilot for Azure (preview)

> [!IMPORTANT]
> The information in this article only applies to Microsoft Copilot for Azure (preview). Details are subject to change.

## What is Microsoft Copilot for Azure (preview)?

Microsoft Copilot for Azure (preview) is an AI assistant that makes it easier to manage your cloud environment. It combines context from Azure resources that you have permissions to with Microsoft’s knowledge on how to best set-up, maintain and optimize your cloud environment. For an overview of how Microsoft Copilot for Azure works and a summary of Copilot capabilities, see [Microsoft Copilot for Azure (preview) overview](overview.md).

## Are Microsoft Copilot for Azure (preview) results reliable?

Microsoft Copilot for Azure is designed to generate the best possible responses with the context it has access to. However, like any AI system, Microsoft Copilot for Azure’s responses will not always be perfect. All Microsoft Copilot for Azure (preview)’s responses should be carefully tested, reviewed, and vetted before making changes to your Azure environment.

## How does Microsoft Copilot for Azure (preview) use data from my Azure environment?

Microsoft Copilot for Azure generates responses grounded in your Azure environment. Microsoft Copilot for Azure only has access to resources that you have access to and can only perform actions that you have the permissions to perform. All actions are performed on your behalf, using your identity. Microsoft Copilot for Azure will respect all existing access management and protections such as Azure Role-Based Action Control, Privileged Identity Management, Azure Policy, and resource locks.

## What data does Microsoft Copilot for Azure collect?

User provided prompts and Microsoft Copilot for Azure’s responses are not retained, analyzed or used to further train and improve Microsoft Copilot for Azure, except when users have given explicit consent to include this information within feedback. We do, however, collect user engagement data, such as, number of chat sessions and session duration, the skill used in a particular session, thumbs up, thumbs down, feedback etc. This information is retained and analyzed as per Microsoft’s data retention and privacy policies.

## What should I do if I see unexpected or offensive content?

The Azure team has built Microsoft Copilot for Azure guided by our AI principles and Responsible AI Standard. We have prioritized mitigating exposing customers to offensive content. However, you may still see unexpected results. We're constantly working to improve our technology in preventing harmful content.

If you encounter harmful or inappropriate content in the system, please provide feedback or report a concern by selecting the downvote button on the response.

## How current is the information Microsoft Copilot for Azure provides?

We frequently update Microsoft Copilot for Azure to ensure Microsoft Copilot for Azure provides the latest information to you. In most cases, the information Microsoft Copilot for Azure provides will be up to date. However, there may be some delay between new Azure announcements to the time Microsoft Copilot for Azure is updated.

## Do all Azure services have the same level of integration with Microsoft Copilot for Azure?

No. Some Azure services have richer integration with Microsoft Copilot for Azure. We will continue to increase the number of scenarios and services Microsoft Copilot for Azure supports. To learn more about some of the current capabilities, see [Microsoft Copilot for Azure (preview) capabilities](capabilities.md) and the articles in the **Enhanced scenarios** section.