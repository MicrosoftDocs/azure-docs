---
title: Understanding chaos engineering and resilience with Azure Chaos Studio
description: Understand the concepts of chaos engineering and resilience.
services: chaos-studio
author: prasha-microsoft 
ms.topic: article
ms.date: 11/01/2021
ms.author: prashabora
ms.service: chaos-studio
ms.custom: ignite-fall-2021
---

# Understanding chaos engineering and resilience

Before you start using Chaos Studio, it's useful to understand the core site reliability engineering concepts being applied.

## What is resilience?

Creating large-scale, distributed applications has never been easier. Infrastructure is hosted in the cloud, programming language support is diverse, and there are a plethora of open source and hosted components and services to build upon. Unfortunately, there is no reliability guarantee for these underlying components and dependencies, or for systems built upon them. Infrastructure can go offline and service disruptions or outages can occur at any time. Minor disruptions in one area can be magnified and have longstanding side effects in another. 

Applications and services need to plan for and accommodate service outages, disruptions to known and unknown dependencies, sudden unexpected load, and latencies throughout the system. Applications and services need to be designed to handle failure and be hardened against disruptions. 

Applications and services that deal with stresses and issues gracefully are **resilient**. Individual component reliability is good, but **resilience is a property of the entire system**. End to end system resilience needs to be validated in an integrated, production-like environment with the conditions and load that will be faced in production.

## What are chaos engineering and fault injection?

**Chaos engineering** is the practice of subjecting applications and services to real world stresses and failures in order to build and validate resilience to unreliable conditions and missing dependencies. **Fault injection** is the act of introducing an error to a system. Different faults, such as network latency or loss of access to storage, can be used to target system components, causing scenarios that an application or service must be able to handle or recover from. A Chaos experiment is the application of faults individually, in parallel, and/or sequentially against one or more subscription resources or dependencies with the goal of monitoring system behavior and health and acting upon any issues that arise. An experiment can represent a real world scenario such as a datacenter power outage or network latency to a DNS server. It can also be used to simulate edge conditions that occur with Black Friday shopping sprees or when concert tickets go on sale for a popular band.
