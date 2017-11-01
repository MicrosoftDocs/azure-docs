---
title: Azure PowerShell Script Sample - Add a user | Microsoft Docs
description: Azure PowerShell Script Sample - Add a user
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

# Add a user

This sample script adds a user and gets subscription key.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Login-AzureRmAccount` to create a connection with Azure. Also, you need to have access to your domain registrar's DNS configuration page.

## Sample script

[!code-powershell[main](../../../powershell_scripts/api-management/add-user-and-get-subscription-key/add_a_user_and_get_a_subscriptionKey.ps1?highlight=1 "Add a user")]

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure API Management can be found in the [PowerShell samples](../powershell-samples.md).
