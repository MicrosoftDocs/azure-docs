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

The Fluid Framework offers a variety of [distributed data structures (DDSes)](https://fluidframework.com/docs/data-structures/overview/). The Azure Fluid Relay does not support the [experimental DDSes](https://fluidframework.com/docs/data-structures/experimental/).

## Fluid sessions

| Name         | Limit  |
|--|--|
|Number of simultaneous users in one session | 100 |
|Incremental summary size upload | 28 MB |

## Signals

The Fluid Framework has a concept of Signals that can be sent to participating clients in the session. More info linked [here](https://fluidframework.com/docs/concepts/signals/). The Azure Fluid Relay does not support the Signals.

## Need help?

If you need help with any of the above limits or other Azure Fluid Relay topics, see the [support](../resources/support.md) options available to you.
