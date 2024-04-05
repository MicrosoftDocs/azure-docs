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

Establishing a call with good user experience requires many aspects to work together:
stable network and hardware environment, good user interface design, and timely feedback to the user on the current status and errors.

To troubleshoot issues reported by users, it's important to clarify whether the issue belongs to.
It could be the application, SDK, or the user's environment such as device, network, or browser.

But how do you approach troubleshooting in a way that's effective and efficient?
In this article, we explore some strategic approaches to troubleshooting that can help you get to the root of the problem more quickly and easily.


## Clarifying the issues reported by the users

First, you need to clarify the issues reported by the users.

Sometimes when users report issues, they may not accurately describe the problem, so there may be some ambiguity.
For example, when users report experiencing a delay during the call,
they may refer to a delay after the call is connected but before any sound is heard.
Alternatively, they mean the delay experienced between two parties while they communicate with each other.

These two situations are different and require different approaches to identify and resolve the issue.
It's important to gather more information from the user to understand the problem and address it accordingly.

## Understanding how often users and how many users encounter the issue

When the user reports an issue, we need to understand the frequency of the problem occurrence.
Only happening once and always happening are different situations.

For some issues, we can also use [Call Diagnostics](../../../../concepts/voice-video-calling/call-diagnostics.md) tool and [Azure Monitor Log](../../../../concepts/analytics/logs/voice-and-video-logs.md) to understand how many users could have similar problems.

Understanding the frequency of the problem occurrence and how many users are affected can help you decide the priority of the issue.

## Referring to document

There are many document resources available for Azure Communication Services Calling SDK,
including concept documents, quickstart guides, tutorials, known issues, and troubleshooting guides.

It's also important to check the known issues or service limitation page for information on the reported issue.
Sometimes, the issues reported by users may be due to limitations of the service itself, such as the number of videos that can be viewed during a large meeting.
Or it could be due to the behavior of the user's browser or device itself.
For example, if a mobile browser is running in the background or the phone is locked, different platforms may have different behaviors.
The browser may stop sending video frames or only sends black frames.

The troubleshooting guide, in particular, addresses various issues that may arise when using the ACS Calling SDK.
You can check the list of common issues in the troubleshooting guide to see if there's a similar issue reported by the user,
and follow the instructions provided to further troubleshoot the problem.

## Reporting an issue

If the issue reported by the user can't be found in the troubleshooting guide, you may want to consider reporting the issue.

In most cases, you need to provide the callId and clear description of the issue.
If you're able to reproduce the issue, include details related to the issue. For instance,

* steps for reproducing the issue, including preconditions
* what the result you expect to see
* what the result you actually see
* frequency of occurrence when reproducing the issue

For more information, see [Reporting an issue](./reporting-an-issue.md).

## Next steps

Besides the troubleshooting guide, here are some articles of interest to you.

* Learn how to [Optimizing Call Quality](../../../../concepts/voice-video-calling/manage-call-quality.md).
* Learn more about [Call Diagnostics](../../../../concepts/voice-video-calling/call-diagnostics.md).
* Learn more about [Troubleshooting VoIP Call Quality](../../../../concepts/voice-video-calling/troubleshoot-web-voip-quality.md).
* See [Known issues](../../../../concepts/voice-video-calling/known-issues-webjs.md?pivots=all-browsers).

