---
title: Get access token using Azure CLI or Azure PowerShell - FHIR service
description: This article explains how to obtain an access token for FHIR service using the Azure CLI or Azure PowerShell.
services: healthcare-apis
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 10/14/2021
ms.author: zxue
ms.custom: devx-track-azurepowershell
---

# Get access token for FHIR service using Azure CLI or Azure PowerShell

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### [Azure CLI](#tab/azure-cli)

In this article, you'll learn how to obtain an access token for the FHIR service in the Azure Healthcare APIs (hereby called the FHIR service) using the Azure CLI. When you [provision the FHIR service](fhir-portal-quickstart.md), you configure a set of users or service principals that have access to the service. If your user object ID is in the list of allowed object IDs, you can access the service using a token obtained using the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

### [Azure PowerShell](#tab/azure-powershell)

In this article, you'll learn how to obtain an access token for the FHIR service in the Azure Healthcare APIs (hereby called the FHIR service) using Azure PowerShell. When you [provision the FHIR service](fhir-portal-quickstart.md), you configure a set of users or service principals that have access to the service. If your user object ID is in the list of allowed object IDs, you can access the service using a token obtained using Azure PowerShell.

[!INCLUDE [azure-powershell-requirements.md](../../../includes/azure-powershell-requirements.md)]

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
