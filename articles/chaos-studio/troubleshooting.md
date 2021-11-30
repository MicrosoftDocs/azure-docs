---
title: Troubleshoot common Azure Chaos Studio problems
description: Learn to troubleshoot common problems when using Azure Chaos Studio
author: c-ashton
ms.service: chaos-studio
ms.author: cashton
ms.topic: troubleshooting
ms.date: 11/01/2021
ms.custom: template-troubleshooting, ignite-fall-2021
---

# Azure Chaos Studio troubleshooting

As you use Chaos Studio, you may occasionally encounter some problems. This article details common problems and troubleshooting steps.

## Issues due to prerequisites

Some issues are caused by missing prerequisites. 

### Why do agent-based faults fail on my Linux virtual machines?

The [CPU Pressure](chaos-studio-fault-library.md#cpu-pressure), [Physical Memory Pressure](chaos-studio-fault-library.md#physical-memory-pressure), [Disk I/O pressure](chaos-studio-fault-library.md#disk-io-pressure-linux), and [Arbitrary Stress-ng Stress](chaos-studio-fault-library.md#arbitrary-stress-ng-stress) faults all require the [stress-ng utility](https://wiki.ubuntu.com/Kernel/Reference/stress-ng) to be installed on your virtual machine. For more information, see the fault prerequisite sections.

### My AKS Chaos Mesh faults are failing

Before using Chaos Mesh faults against AKS, you must first install Chaos Mesh. Instructions can be found in the [Chaos Mesh faults on AKS tutorial](chaos-studio-tutorial-aks.md#set-up-chaos-mesh-on-your-aks-cluster).

## Experiment design and creation

### Why do I get the error `The microsoft:agent provider requires a managed identity` when I try to create an experiment? 

This error happens when the agent has not been deployed to your virtual machine. For installation instructions, see [Create and run an experiment that uses agent-based faults](chaos-studio-tutorial-agent-based.md).

### When creating an experiment, I get the error `The content media type '<null>' is not supported. Only 'application/json' is supported.` What does this mean?

If you are handcrafting your experiment JSON, this error is caused by malformed JSON in your experiment definition. Check to see if you have any syntax errors, such as mismatched braces or brackets ({} and \[\]).

## Experiment execution

### The execution status of my experiment is "failed." How do I determine what went wrong?

From the Experiments page, click on the experiment name to navigate to the Experiment details view. In the History section, click on the Details link for the execution instance to find more information.

![Experiment history](images/run-experiment-history.png)

### How do I collect agent logs on a Linux virtual machine?

Run this command on the VM: `journalctl -u azure-chaos-agent`
