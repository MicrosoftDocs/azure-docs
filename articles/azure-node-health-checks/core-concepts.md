---
title: Core Concepts for Azure Node Health Checks
description: Core concepts for Azure Node Health Checks (AzNHC).
ms.service: azure-node-health-checks
ms.topic: conceptual
author: rafsalas19
ms.author: rafaelsalas
ms.date: 04/15/2024
---

# Azure Node Health Check Core Concepts
Azure NHC is a single node test suite use to validate AI/HPC VM instance health. This article will expose various components and concepts that explain the functionality of AzNHC

## What are single node tests?
In AI and HPC multiple nodes are commonly used to perform large workloads. Any issue pertaining to any single node may cause poor performance over the entire workload. The same goes for any network related issues. AzNHC purpose is to validate node health regarding single node health issues. Thereby isolating between single node and multi-node network problems.

Single node tests refer the checks that are run on a node independent of off node components (network fabric).

## Test Types
AzNHC is an extension of [LBNL NHC](https://github.com/mej/nhc). Tests are categorized into two buckets:
  1. Default test: A test that exist as part of LBNL NHC
  1. Custom test: A test that where added as part of the AzNHC extension

### Test Coverage
Tests can be further categorized by the hardware components they cover.
   - GPU
   - InfiniBand Cards
   - Ethernet
   - Memory
   - CPU

## What is a VM/Node/Cluster?
  1. VM or Virtual Machine: Refers to the AI-HPC compute resource that AzNHC aims to validate. See [VM documentation](../virtual-machines/overview.md) for more details on virtual machines.
  1. The term Node can be used interchangeably with VM instances. It could also refer to the underlying compute hardware.
  1. A Cluster refers to a group or pool of nodes/VMs that are used to perform HPC and AI workloads. In many cases these VM instances are part of a VM scale set or an availability set.

## Conf Files
Conf files or configuration files are used to list the targeted tests to be run on a VM. Each supported SKU offering has its own default conf file.
  1. Configuration files (conf files) determine the checks to be run.
  1. By default, each supported SKU has its own conf file with checks that provide coverage to its specific hardware components.
  1. The default conf files can be modified.
  1. A custom conf file can be passed in.
  1. Additional test can be appended by providing an additional conf file to append to the main one being used. (i.e., append a common test conf file to the default being used)
