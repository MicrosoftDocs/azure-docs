---
title: Data residency and privacy in Azure SRE Agent
description: Learn how Azure SRE Agent handles your data.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 03/18/2026
ms.service: azure
---

# Data residency and privacy in Azure SRE Agent

This article explains how the SRE Agent handles your data, including where it stores your data, how it processes your data, and the privacy measures it uses to protect your information.

## Data residency

- The SRE Agent transfers and stores all content and conversation history in its Azure region. This data includes prompts, responses, and resource analysis.  

- The SRE Agent transfers all data to its Azure region, regardless of the Azure region of origin for the services it manages.

- The SRE Agent processes and stores data within the region you select when you create the agent.

## Privacy

- Microsoft doesn't use your data to train AI models.

- The service uses your data only to provide its functionality and to improve and debug the service as needed.

- The service isolates data by using tenant and Azure subscription boundaries.

## Related content

| Resource | Description |
|----------|-------------|
| [Supported regions](supported-regions.md) | Azure regions where SRE Agent is available |
| [Network requirements](network-requirements.md) | Firewall and network configuration |
