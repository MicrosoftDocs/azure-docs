---
title: Understand chaos engineering and resilience with Chaos Studio
description: Understand the concepts of chaos engineering and resilience.
services: chaos-studio
author: prasha-microsoft 
ms.topic: article
ms.date: 11/01/2021
ms.author: prashabora
ms.service: chaos-studio
ms.custom: ignite-fall-2021
---

# Understand chaos engineering and resilience

Before you start using Azure Chaos Studio, it's useful to understand the core site reliability engineering concepts being applied.

## What is resilience?

It's never been easier to create large-scale, distributed applications. Infrastructure is hosted in the cloud, and programming language support is diverse. There are also many open-source and hosted components and services to build on.

Unfortunately, there's no reliability guarantee for these underlying components and dependencies, or for systems built on them. Infrastructure can go offline, and service disruptions or outages can occur at any time. Minor disruptions in one area can be magnified and have longstanding side effects in another.

Applications and services must plan for and accommodate issues like:

- Service outages.
- Disruptions to known and unknown dependencies.
- Sudden unexpected load.
- Latencies throughout the system.

Applications and services must be designed to handle failure and be hardened against disruptions.

Applications and services that deal with stresses and issues gracefully are *resilient*. Individual component reliability is good, but *resilience is a property of the entire system*. End-to-end system resilience must be validated in an integrated, production-like environment with the conditions and load that's faced in production.

## What are chaos engineering and fault injection?

- **Chaos engineering**: The practice of subjecting applications and services to real-world stresses and failures. The goal is to build and validate resilience to unreliable conditions and missing dependencies.
- **Fault injection**: The act of introducing an error to a system. You can use different faults, such as network latency or loss of access to storage, to target system components. You can create scenarios that an application or service must be able to handle or recover from.

A chaos experiment is the application of faults individually, in parallel, or sequentially against one or more subscription resources or dependencies. The goal is to monitor system behavior and health so that you can act on any issues that arise.

An experiment can represent a real-world scenario, such as a datacenter power outage or network latency to a DNS server. It can also be used to simulate edge conditions that occur. Examples are Black Friday shopping sprees or when concert tickets go on sale for a popular band.
