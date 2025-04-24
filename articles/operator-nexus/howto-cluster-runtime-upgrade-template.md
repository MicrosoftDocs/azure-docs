---
title: "Azure Operator Nexus: Cluster runtime upgrade template"
description: Learn the process for upgrading Cluster for Operator Nexus with step-by-step parameterized template.
author: bartpinto 
ms.author: bpinto
ms.service: azure-operator-nexus
ms.date: 04/24/2025
ms.topic: how-to
ms.custom: azure-operator-nexus, template-include
---

# Cluster runtime upgrade template

This how-to guide provides a step-by-step template for upgrading a Nexus Cluster designed to assist users in managing a reproducible end-to-end upgrade through Azure APIs and standard operating procedures. Regular updates are crucial for maintaining system integrity and accessing the latest product improvements.

## Overview

**Runtime bundle components**: These components require operator consent for upgrades that may affect traffic behavior or necessitate server reboots. Nexus Cluster's design allows for updates to be applied while maintaining continuous workload operation.

Runtime changes are categorized as follows:
- **Firmware/BIOS/BMC updates**: Necessary to support new server control features and resolve security issues.
- **Operating system updates**: Necessary to support new Operating system features and resolve security issues.
- **Platform updates**: Necessary to support new platform features and resolve security issues.

## Prerequisites

1. Install the latest version of [Azure CLI](https://aka.ms/azcli).
2. The latest `networkcloud` CLI extension is required. It can be installed following the steps listed in [Install CLI Extension](howto-install-cli-extensions.md).
3. Subscription access to run the Azure Operator Nexus Network Fabric (NF) and Network Cloud (NC) CLI extension commands.
4. Target Cluster must be healthy in a running state.
