---
title: What is Azure Chaos Studio?
description: Understand Azure Chaos Studio, an Azure service that helps you measure, understand, and build application and service resilience to real world incidents using chaos engineering to inject faults against your service then monitor how the service responds to disruptions.
services: chaos-studio
author: johnkemnetz
ms.topic: article
ms.date: 08/26/2021
ms.author: johnkem
ms.service: chaos-studio
---

# What is Azure Chaos Studio?

Azure Chaos Studio is an Azure service in preview that helps you measure, understand, and build application and service resilience to real world incidents, such as a region going down or an application failure causing 100% CPU usage on a VM. With Chaos Studio, you can run Chaos Engineering experiments that inject faults against your service then monitor how the service responds to disruptions, enabling you to validate architectural choices and improve service reliability. Chaos experiments can be run ad-hoc for running manual BCDR drills and Game Days, or as part of your CI/CD pipeline to programmatically gate code flow.

## Chaos experiments and faults

Chaos Studio's core resource type is the chaos experiment. An experiment is a set of one or more faults that are executed in parallel or sequentially, depending on how you configure it. A fault (generically called an “action” in the Chaos Studio REST API) is a condition that is injected into the target system. Chaos Studio supports various faults, such as generating CPU pressure on a VM or stopping a Windows service. Each fault has specific parameters you can control, like which process to kill or how much CPU pressure to generate, and a duration and set of target resources. When you build a chaos experiment, you define a set of steps to execute sequentially and within each step a branch for each fault that you want to execute in parallel. Finally, you organize the resources (“targets”) that each fault will be run against into groups called selectors so that you can easily reference a group in each fault.

![Chaos Experiment](images/chaos-experiment.png)

A Chaos Experiment is an Azure resource that lives in a subscription and resource group. You can currently only create an experiment with the REST API. You also use this API to start, cancel, and view the status of an experiment. An Azure portal experience is in the works that we will share for feedback when ready. When you run an experiment, you can opt in to have fault telemetry emitted directly to Azure Application Insights to correlate between experiment events and service/application telemetry.
 
## Chaos provider configurations

Chaos Studio depends on a subscription-level resource called a Chaos Provider Configuration that provides the configuration for opting-in resources for fault injection. There are three provider types: ChaosAgent (for interacting with a Chaos Agent deployed in-guest on a VM or virtual machine scale set), AzureVmssVmChaos and AzureVmChaos (for interacting with VMs and virtual machine scale set instances at the ARM/control plane level), and only one provider configuration can exist per provider type.
