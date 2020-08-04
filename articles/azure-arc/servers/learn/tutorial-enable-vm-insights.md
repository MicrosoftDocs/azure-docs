---
title: Monitor a hybrid machine with Azure Monitor for VMs
description: Learn how to collect and analyze data from a hybrid machine in Azure Monitor.
ms.service:  azure-arc
ms. subservice: azure-arc-servers
ms.topic: tutorial
author: mgoedtel
ms.author: magoedte
ms.date: 08/03/2020
---

# Tutorial: Monitor a hybrid machine with Azure Monitor for VMs

[Azure Monitor](../overview.md) can collect data directly from your hybrid virtual machines into a Log Analytics workspace for detailed analysis and correlation. Typically this would entail installing the [Log Analytics agent](../../azure-monitor/platform/agents-overview.md#log-analytics-agent) on the machine using a script, manually, or automated method following your configuration management standards. Arc for servers (preview) recently introduced support to install the Log Analytics and Dependency agent [VM extensions](../manage-vm-extensions.md) for Windows and Linux, enabling Azure Monitor to collect data from your non-Azure VMs.

This tutorial shows you how to configure and collect data from your Linux or Windows VMs by enabling Azure Monitor for VMs following a simplified set of steps, which streamlines the experience and takes a shorter amount of time.  

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* VM extension functionality is available only in the list of [supported regions](../overview.md#supported-regions).

* See [Supported operating systems](../../azure-monitor/insights/vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or virtual machine scale set you're enabling is supported by Azure Monitor for VMs.

* Review firewall requirements for the Log Analytics agent provided in the [Log Analytics agent overview](../../azure-monitor/platform/log-analytics-agent.md#network-requirements). The Azure Monitor for VMs Map Dependency agent doesn't transmit any data itself, and it doesn't require any changes to firewalls or ports.

## Sign in to Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

