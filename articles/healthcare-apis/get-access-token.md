---
title: Get an access token to use the FHIR service or the DICOM service
description: Learn how to get an access token for the FHIR service or the DICOM service.
services: healthcare-apis
author: chachachachami
ms.service: healthcare-apis
ms.topic: how-to
ms.date: 09/06/2023
ms.author: chrupa
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Get an access token by using Azure CLI or Azure PowerShell

To use the FHIR&reg; service or the DICOM&reg; service, you need an access token that verifies your identity and permissions to the server. You can obtain an access token using [PowerShell](/powershell/scripting/overview) or the [Azure Command-Line Interface (CLI)](/cli/azure/what-is-azure-cli), which are tools for creating and managing Azure resources.

Keep in mind that to access the FHIR service or the DICOM service, users and applications must be granted permissions through [role assignments](configure-azure-rbac.md) from Azure portal, or by using [scripts](configure-azure-rbac-using-scripts.md). 

---
## Get an access token for the FHIR service

The FHIR service uses a specific `resource`  or `Audience` with URI equal to the URI of the FHIR server `https://<workspacename-fhirservicename>.fhir.azurehealthcareapis.com`. Obtain a token and store it in a variable (named `$token`) with the following command:

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
token=$(az account get-access-token --resource=https://<workspacename-fhirservicename>.fhir.azurehealthcareapis.com --query accessToken --output tsv)
curl -X GET --header "Authorization: Bearer $token" https://<workspacename-fhirservicename>.fhir.azurehealthcareapis.com/Patient
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$token = (Get-AzAccessToken -ResourceUrl 'https://<workspacename-fhirservicename>.fhir.azurehealthcareapis.com').Token
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Method GET -Headers $headers -Uri 'https://<workspacename-fhirservicename>.fhir.azurehealthcareapis.com/Patient'
```

---
## Get an access token for the DICOM service

The DICOM service uses the same `resource` or `Audience` with URI equal to `https://dicom.healthcareapis.azure.com` to obtain an access token. Obtain a token and store it in a variable (named `$token`) with the following command:

### [Azure CLI](#tab/azure-cli)

```Azure CLICopy
token=$(az account get-access-token --resource=https://dicom.healthcareapis.azure.com --query accessToken --output tsv)
curl -X GET --header "Authorization: Bearer $token"  https://<workspacename-dicomservicename>.dicom.azurehealthcareapis.com/v<version of REST API>/changefeed
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$token = (Get-AzAccessToken -ResourceUrl 'https://dicom.healthcareapis.azure.com').Token
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Method GET -Headers $headers -Uri 'https://<workspacename-dicomservicename>.dicom.azurehealthcareapis.com/v<version of REST API>/changefeed'
```

---
## Next steps

[Access the FHIR service by using Postman](./fhir/use-postman.md)

[Access the FHIR service by using REST client](./fhir/using-rest-client.md)

[Access the DICOM service by using cURL](dicom/dicomweb-standard-apis-curl.md)

[!INCLUDE [FHIR and DICOM trademark statement](./includes/healthcare-apis-fhir-dicom-trademark.md)]
