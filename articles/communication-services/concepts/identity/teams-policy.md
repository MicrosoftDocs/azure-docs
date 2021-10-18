---
title: Azure Communication Services overview of supported Teams identity policies
titleSuffix: An Azure Communication Services concept document
description: Provides overview of supported Microsoft 365 Teams identity policies.
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 09/24/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---
# Overview of Teams identity policies

Azure Communication Services support Teams identities to manage Teams calling experience from Communication Services SDKs. Capability does not provide full feature and policy parity with Teams client. Before using Communication Services SDKs with the Teams identities, consider lack of policy enforcement and implications for Teams experience. Here is a list of supported Teams policies.

## Meetings and audioconferencing

|Policy                                   |Supported  |Note     |
|-----------------------------------------|-----------|---------|
|Mode for IP audio                        |   ❌      |         |
|Mode for IP video                        |   ❌      |         |
|Allow IP video                           |   ❌      |         |
|Media bit rate                           |   ❔      |         |
|Screen sharing mode                      |   ❔      |         |
|Automatically admit people               |   ❔      |         |
|Roles enforcement                        |   ❔      |         |
|QoS markers for real-time media traffic  |   ❌      |         |
|Port ranges and DSCP markings            |   ❔      |         |


## Voice - Phone system and PSTN connectivity
|Emergency calling            |     ?    |         |

## Microsoft 365 Business voice
|            |         |         |

## Security, privacy and compliance 
|Compliance recording            |     ❔    |         |
|Information barrier             |     ❔    |         |
|eDiscoverability                |     ❔    |         |