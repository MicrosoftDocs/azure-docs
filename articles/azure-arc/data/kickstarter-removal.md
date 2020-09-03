---
title: Remove Kickstarter
description: 
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Remove Azure data services kickstarter components

Perform the following steps to remove the kickstarter components from your Ubuntu Server.

## Step 01: Download removal script

Download the kickstarter script using curl.

``` bash
curl --output cleanup-controller-new.sh https://raw.githubusercontent.com/microsoft/sql-server-samples/master/samples/features/azure-arc/deployment/kubeadm/ubuntu-single-node-vm/cleanup-controller-new.sh
```

## Step 02: Grant permissions

To grant execute permissions to the kickstarter script execute the following command.

``` bash
chmod +x cleanup-controller-new.sh
```

## Step 03: Execute the script

Execute the kickstarter script using the following command.

``` bash
./cleanup-controller-new.sh
```

All kickstarter components should have been removed once the cleanup-arc-data-controller script has completed.
