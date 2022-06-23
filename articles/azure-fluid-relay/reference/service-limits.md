---
title: Azure Fluid Relay service limits
description: Limits and throttles applied in Azure Fluid Relay.
services: azure-fluid
author: hickeys
ms.author: hickeys
ms.date: 08/19/2021
ms.topic: reference
ms.service: azure-fluid
---

# Azure Fluid Relay Service Limits

This article lists limits in different areas of Azure Fluid Relay.

## Distributed Data Structures

The Fluid Framework offers various [distributed data structures (DDSes)](https://fluidframework.com/docs/data-structures/overview/). The Azure Fluid Relay doesn't support the [experimental DDSes](https://fluidframework.com/docs/data-structures/experimental/).

## Fluid sessions

The maximum number of simultaneous users in one session on Azure Fluid Relay is 100 users. This limit is on simultaneous users. What this means is that the 101st user won't be allowed to join the session. In the case where an existing user leaves the session, a new user will be able to join. This is because the number of simultaneous users at that point will be less than the limit. 

## Fluid Summaries

Incremental summaries that can be uploaded to Azure Fluid Relay can't exceed 28 MB in size. More info [here](https://fluidframework.com/docs/concepts/summarizer).

## Signals

The Fluid Framework has a concept of Signals that can be sent to participating clients in the session. More info [here](https://fluidframework.com/docs/concepts/signals/). The Azure Fluid Relay doesn't support the Signals.

## Need help?

If you need help with any of the above limits or other Azure Fluid Relay topics, see the [support](../resources/support.md) options available to you.
