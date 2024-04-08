---
title: Azure Fluid Relay limits
description: Limits and throttles applied in Azure Fluid Relay.
ms.date: 08/19/2021
ms.topic: reference
ms.service: azure-fluid
---

# Azure Fluid Relay limits

This article outlines known limitations of Azure Fluid Relay.

## Distributed Data Structures

The Azure Fluid Relay doesn't support [experimental distributed data structures (DDSes)](https://fluidframework.com/docs/data-structures/overview). These include but are not limited to DDS packages with the `@fluid-experimental` package namespace.

## Fluid sessions

The maximum number of simultaneous users in one session on Azure Fluid Relay is 100 users. This limit is on simultaneous users. What this means is that the 101st user won't be allowed to join the session. In the case where an existing user leaves the session, a new user will be able to join. This is because the number of simultaneous users at that point will be less than the limit. 

## Fluid operations

Operations are incremental updates sent over the websocket connection. The size of any individual operation is limited to 700KB. The size of an operation is determined by the Distributed Data Structure being used.

## Fluid summaries

Incremental summaries uploaded to Azure Fluid Relay can't exceed 28 MB in size. If the size of the document grows above 95 MB, subsequent client load or join requests will fail. For more information, see [Fluid Framework Summarizer](https://fluidframework.com/docs/concepts/summarizer).

## Signals

Azure Fluid Relay doesn't currently have support for Signals.

## Need help?

If you need help with any of the above limits or other Azure Fluid Relay topics, see the [support](../resources/support.md) options available to you.
