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
ms.custom: how-to
---

# Placeholder

When using Azure Machine Learning with a virtual network, there are [several ways to handle DNS name resolution](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances). When using your own custom DNS server, you must define entries for the following host names:

* `<workspace-GUID>.workspace.<region>.api.azureml.ms`
* `<workspace-GUID>.studio.workspace.<region>.api.azureml.ms`
* `cert-<workspace-GUID>.workspace.<region>.api.azureml.ms`
* `

## Prerequisites

## Find the IP addresses

To find the IP addresses for the host names, use the following steps:

```azurecli
az network private-endpoint dns-zone-group list --endpoint-name <endpoint> --resource-group <resource-group> --query "[].privateDnsZoneConfigs[].recordSets[].[fqdn, ipAddresses[0]]" --output table
```

To create entries on your DNS server that map the host names to the IP addresses, consult the documentation for your DNS server software.