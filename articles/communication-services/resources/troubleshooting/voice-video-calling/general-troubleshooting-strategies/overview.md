---
title: General troubleshooting strategies - Overview
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview of general troubleshooting strategies
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/23/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# Overview of general troubleshooting strategies

Ensuring a satisfying experience during a call requires many elements to work together:

* stable network and hardware environment
* good user interface design
* timely feedback to the user on the current status and errors

To troubleshoot issues reported by users, it's important to identify where the issue is coming from.
The issue could lie within the application, the SDK, or the user's environment such as device, network, or browser.

This article explores some debugging strategies that help you identify the root of the problem efficiently.

## Clarifying the issues reported by the users

First, you need to clarify the issues reported by the users.

Sometimes when users report issues, they may not accurately describe the problem, so there may be some ambiguity.
For example, when users report experiencing a delay during a call,
they may refer to a delay after the call is connected but before any sound is heard.
Alternatively, they might refer to the delay experienced between two parties while they communicate with each other.

These two situations are different and require different approaches to identify and resolve the issue.
It's important to gather more information from the user to understand the problem and address it accordingly.

## Understanding how often users and how many users encounter the issue

When the user reports an issue, we need to understand its reproducibility.
Only happening once and always happening are different situations.

For some issues, you can also use [Call Diagnostics](../../../../concepts/voice-video-calling/call-diagnostics.md) tool and [Azure Monitor Log](../../../../concepts/analytics/logs/voice-and-video-logs.md) to understand how many users could have similar problems.

Understanding the issue reproducibility and how many users are affected can help you decide on the priority of the issue.

## Referring to documentation

The documentation for Azure Communication Services Calling SDK is rich and covers many subjects,
including concept documents, quickstart guides, tutorials, known issues, and troubleshooting guides.

Take time to check the known issues and the service limitation page.
Sometimes, the issues reported by users are due to limitations of the service itself. A good example would be the number of videos that can be viewed during a large meeting.
The behavior of the user's browser or of its device could be the cause of the issue.

For example, when a mobile browser operates in the background or when the user phone is locked, it may exhibit various behaviors depending on the platform. The browser might cease sending video frames altogether or transmit solely black frames.

The troubleshooting guide, in particular, addresses various issues that may arise when using the ACS Calling SDK.
You can check the list of common issues in the troubleshooting guide to see if there's a similar issue reported by the user,
and follow the instructions provided to further troubleshoot the problem.

## Reporting an issue

If the issue reported by the user isn't present in the troubleshooting guide, consider reporting the issue.

In most cases, you need to provide the callId together with a clear description of the issue.
If you're able to reproduce the issue, include details related to the issue. For instance,

* steps to reproduce the issue, including preconditions (platform, network conditions, and other information that might be helpful)
* what result do you expect to see
* what result do you actually see
* reproducibility rate of the issue

For more information, see [Reporting an issue](report-issue.md).

## Next steps

Besides the troubleshooting guide, here are some articles of interest to you.

* Learn how to [Optimizing Call Quality](../../../../concepts/voice-video-calling/manage-call-quality.md).
* Learn more about [Call Diagnostics](../../../../concepts/voice-video-calling/call-diagnostics.md).
* Learn more about [Troubleshooting VoIP Call Quality](../../../../concepts/voice-video-calling/troubleshoot-web-voip-quality.md).
* See [Known issues](../../../../concepts/voice-video-calling/known-issues-webjs.md?pivots=all-browsers).
