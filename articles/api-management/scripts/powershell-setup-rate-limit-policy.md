---
title: Azure PowerShell Script Sample - Setup rate limit policy | Microsoft Docs
description: Azure PowerShell Script Sample - Setup rate limit policy
services: api-management
documentationcenter: ''
author: juliako
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.devlang: na
ms.topic: sample
ms.date: 10/30/2017
ms.author: apimpm
ms.custom: mvc
---

# Setup rate limit policy

This sample script sets up  rate limit policy. 

You can use the **Azure Cloud Shell** to run the script from [Azure portal](https://portal.azure.com/), as described in [Create a new Azure API Management service instance](../powershell-create-service-instance.md). Alternatively, you can install the Azure PowerShell using the instructions found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Login-AzureRmAccount` to create a connection with Azure.

## Sample script

[!code-powershell[main](../../../powershell_scripts/api-management/setup-rate-limit-policy/setup_rate_limit_policy.ps1?highlight=1 "Setup rate limit policy")]

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure API Management can be found in the [PowerShell samples](../powershell-samples.md).
