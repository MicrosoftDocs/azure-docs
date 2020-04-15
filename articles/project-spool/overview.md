---
title: What Is Project Spool?
description: Learn how Project Spool helps you develop rich user experiences with real-time communications.
author: mikben
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---

# What Is Project Spool?

Project Spool allows you to easily add real-time communications features to your applications without worrying about the underlying infrastructure. It's a communications platform as a service (CPaaS) that allows you to focus on your customer experience while Azure handles the heavy lifting behind the scenes.

When you use Spool, you're building on top of the same infrastructure that powers Skype and Teams. This allows you to seamlessly scale and integrate your offerings with other Azure services like Cortana, Microsoft Graph, Cognitive Services, Bot Framework, and Machine Learning.

You'll use the Spool SDKs to connect your users to cross-platform sessions that facilitate real-time voice, video, and messaging.

There are three primary capabilities that Spool offers: Programmable Voice, Programmable Video, and Programmable Messaging. Each of these are highly configurable and offer a rich subset of features and integration possibilities.

~

// brain dump

Spool is a communications platform as a service. There are a lot of different ways to begin thinking about how this might help you help your customers.

Let's start by thinking about your customers. Your customers have phones, laptops, computers, tablets, and other media devices that they can use to connect to you and/or other people via some combination of voice, video, and messaging. As you build real-time communications into your products, you want to ensure that your user experience is simple, reliable, and scalable. You also want to ensure that your developer experience is pleasant, because high-quality developer experience translates to low-cost development, testing, and maintenance.

One of the most popular ways to connect your users is with WebRTC - an incredibly empowering technology that facilitates real-time peer-to-peer video, voice, and data transmission. Delivering a high-quality user experience with WebRTC can be challenging because WebRTC is hard to get right, especially when you start considering firewalls, NAT traversal, signaling infrastructure, scaling, security, and other challenges that all but the most fledgling products are likely to encounter.

As a developer, you'd ideally be able to connect your users without worrying about what device(s) they have or what infrastructure you need. You'd simply authenticate, authorize, and connect your users without spending your time on protocol implementation and infrastructure design.

That's where Spool comes in.

~

## Next steps

 - Review our Conceptual Overview
 - Review our Programmable Voice guidance
 - Review our Programmable Video guidance
 - Review our Programmable Messaging guidance
 - Review our Quickstarts Overview
 - Review our Samples Overview


### meta

- **Discussion**:
  - This is where we relate Spool to other offerings.
  - Our conceptual model needs to match existing WebRTC conceptual docs offered by mozilla / webrtc.org. Ours will just be articulated in terms of Microsoft Azure / Spool - including data channels, lifetime management, etc.

- Gold Standard Docs:
  - https://webrtc.org/getting-started/overview
  - https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
