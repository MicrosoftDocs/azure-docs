---
title: Get access token using Azure CLI or Azure PowerShell
description: This article explains how to obtain an access token for the Healthcare APIs using the Azure CLI or Azure PowerShell.
services: healthcare-apis
author: SteveWohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 11/17/2021
ms.author: zxue
ms.custom: devx-track-azurepowershell
---

# Get access token using Azure CLI or Azure PowerShell

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you'll learn how to obtain an access token for the FHIR service and the DICOM service using PowerShell and the Azure CLI. For more details on how to get started with the Healthcare APIs, see [How to get started with FHIR]() or [How to get started with DICOM](). 

---
## Obtain a token for the FHIR service

The FHIR service uses a `resource`  or `Audience` with URI equal to the URI of the FHIR server `https://<FHIR ACCOUNT NAME>.azurehealthcareapis.com`. You can obtain a token and store it in a variable (named `$token`) with the following command:

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
token=$(az account get-access-token --resource=https://<FHIR ACCOUNT NAME>.azurehealthcareapis.com --query accessToken --output tsv)
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$token = (Get-AzAccessToken -ResourceUrl 'https://<FHIR ACCOUNT NAME>.azurehealthcareapis.com').Token
```

---

## Use the token with the FHIR service

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
curl -X GET --header "Authorization: Bearer $token" https://<FHIR ACCOUNT NAME>.azurehealthcareapis.com/Patient
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Method GET -Headers $headers -Uri 'https://<FHIR ACCOUNT NAME>.azurehealthcareapis.com/Patient'
```

## Obtain a token for the DICOM service

The DICOM service uses a `resource` or `Audience` with URI equal to the URI of the DICOM server  `https://dicom.healthcareapis.azure.com`. You can obtain a token and store it in a variable (named `$token`) with the following command:


```Azure CLICopy
Try It
$token=$(az account get-access-token --resource=https://dicom.healthcareapis.azure.com --query accessToken --output tsv)
```

## Use the tokenb with the DICOM service

```Azure CLICopy
Try It
curl -X GET --header "Authorization: Bearer $token"  https://<workspacename-dicomservicename>.dicom.azurehealthcareapis.com/v<version of REST API>/changefeed
```

## Next Steps

>[!div class="nextstepaction"]
>[Access FHIR API using Postman](../use-postman.md)
