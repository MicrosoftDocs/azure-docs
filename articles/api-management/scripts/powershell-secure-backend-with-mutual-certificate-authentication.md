---
title: Azure PowerShell Script Sample - Secure backend | Microsoft Docs
description: Azure PowerShell Script Sample - Secure backend
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

# Secure backend

This sample script secures backend with mutual certificate authentication.

You can use the **Azure Cloud Shell** to run the script from [Azure portal](https://portal.azure.com/), as described in [Create a new Azure API Management service instance](../powershell-create-service-instance.md). Alternatively, you can install the Azure PowerShell using the instructions found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Login-AzureRmAccount` to create a connection with Azure.

## Sample script

[!code-powershell[main](../../../powershell_scripts/api-management/secure-backend-with-mutual-certificate-authentication/secure_backend_with_mutual_certificate_authentication.ps1?highlight=1 "Secures backend")]

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure API Management can be found in the [PowerShell samples](../powershell-samples.md).
