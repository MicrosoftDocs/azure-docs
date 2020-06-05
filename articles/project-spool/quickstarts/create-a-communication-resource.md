---
title: Create a communication resource
description: This document covers different ways to create a spool resource.
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 05/27/2020
ms.topic: overview
ms.service: azure-project-spool

---

# Create an Azure Communication Resource


## Azure portal



## ARM Client



## Powershell

Create a new Spool service or update an existing Spool service.

## EXAMPLES

### Example 1: Create Default Resource
```powershell
PS C:\> New-AzSpool -Name MySpool -ResourceGroupName MyRg -Location westus2

Location Name     Type
-------- ----     ----
westus2  MySpool  Microsoft.SpoolService/spools
```

Creates a new spool resource using only default values.

### Example 2: Create Fully Specified Resource
```powershell
PS C:\> New-AzSpool -Name MySpool -ResourceGroupName MyRg -SubscriptionId 00000000-0000-0000-0000-000000000000 -Location westus2 -Tag @{
>> FirstTag = 'FirstTagValue'
>> SecondTag = 'SecondTagValue'
}

Location Name     Type
-------- ----     ----
westus2  MySpool  Microsoft.SpoolService/spools
```

Creates a new spool resource with tags



