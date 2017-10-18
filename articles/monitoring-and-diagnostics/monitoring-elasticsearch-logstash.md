---
title: Monitor Azure Linux virtual machines with ElasticSearch 
description: Tutorial - Use the Elastic Stack to monitor Azure virtual machines.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: rloutlaw
manager: justhe
tags: azure-resource-manager
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: tutorial
ms.date: 10/11/2017
ms.author: routlaw
---

# Monitor Azure virtual machines with the Elastic Stack 

In this article you'll learn how to monitor Azure Linux VMs by connecting [Azure Monitor](/azure/monitoring-and-diagnostics/monitoring-overview-azure-monitor) to Elasticsearch. When you're done, you'll be able to filter,search, and visualize VM metrics in your own Elastic Stack virtual machine.

In this tutorial, you will:

> [!div class="checklist"]
> * Create an Event Hub
> * Configure Linux Agent Diagnostics on an Azure VM to send events to the Event Hub
> * Configure Logstash to connect to the EventHub and send the results to Elasticsearch
> * Search, filter, and visualize information about the VM in Kibana

## Before you begin