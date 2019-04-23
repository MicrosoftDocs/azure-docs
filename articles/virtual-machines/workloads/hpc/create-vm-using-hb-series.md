---
title: Create a VM using the HB-series size in Azure | Microsoft Docs
description: Learn how to create a VM using the HB-series size in Azure. 
services: virtual-machines
documentationcenter: ''
author: githubname
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 04/25/2019
ms.author: msalias
---

## Create a VM using an HB-series size

We recommend CentOS/RHEL 7.6 if deploying VMs using a Standard Image. If deploying using a Custom Images (e.g. for an older OS such as CentOS/RHEL 7.4 or 7.5), please also follow Step (2) below:

## Create the VM(s)

Sample PowerShell commands here; provide values and templates:

```azure-powershell
Login-AzureRmAccount 
Select-AzureRmSubscription -SubscriptionName mySub 
New-AzureRmResourceGroupDeployment -ResourceGroupName myRG -TemplateFile "template.json" -TemplateParameterFile "parameters.json" 
Get-AzureRmPublicIpAddress -Name myVM-ip -ResourceGroupName myRG
```

You can also use https://github.com/edwardsp/azhpc for deployment. Use the HB-instance branch.

## Update LIS and WALA

Update LIS and WALA on the VM.

```bash
wget https://aka.ms/lis
tar xzf lis
pushd LISISO
./upgrade.sh
```

## Next steps

Learn more about [high-performance computing](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/) in Azure.