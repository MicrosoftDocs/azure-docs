---
title: Data residency and privacy in Azure SRE Agent Preview
description: Learn how Azure SRE Agent handles your data.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 11/05/2025
ms.service: azure
---

# Data residency and privacy in Azure SRE Agent Preview

This article explains how your data is handled by the SRE Agent, including where it is stored, how it is processed, and the privacy measures in place to protect your information.

## Data residency

- All content and conversation history with the SRE Agent is transferred to and stored in the agent's Azure region. Data includes prompts, responses, and resource analysis.  

- All data is transferred to the agent's Azure region, regardless of the Azure region of origin of services the agent manages.

- Data is processed and stored within the agent’s region as selected at time of creation.

## Privacy

- Microsoft doesn't use your data to train AI models.

- Your data is only used to provide the functionality of the service and to improve and debug the service as needed.

- Data is isolated using tenant and Azure subscription boundaries.
