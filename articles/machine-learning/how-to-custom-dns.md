---
title: Use custom DNS server
titleSuffix: Azure Machine Learning
description: How to configure a custom DNS server for your Azure Virtual Network to resolve Azure Machine Learning hosts.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.author: aashishb
author: aashishb
ms.date: 09/25/2020
ms.topic: conceptual
ms.custom: how-to, devx-track-python, references_regions
---

# Placeholder

When using Azure Machine Learning with a virtual network, there are [several ways to handle DNS name resolution](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances). When using your own DNS server, you must define entries for the following host names:

* host names

## Prerequisites

## Find the IP addresses

To find the IP addresses for the host names, use the following steps:

To create entries on your DNS server that map the host names to the IP addresses, consult the documentation for your DNS server software.