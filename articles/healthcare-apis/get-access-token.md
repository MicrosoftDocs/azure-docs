---
title: Get an access token to use the FHIR service or the DICOM service
description: Learn how to get an access token to access the FHIR service or the DICOM service using Azure CLI or Powershell.
services: healthcare-apis
author: chachachachami
ms.service: azure-health-data-services
ms.topic: how-to
ms.date: 03/31/2026
ms.author: chrupa
ms.reviewer: v-catheribun
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Get an access token by using Azure CLI or Azure PowerShell

To use the FHIR&reg; service or the DICOM&reg; service, you need an access token that verifies your identity and permissions to the service. You can get an access token by using [PowerShell](/powershell/scripting/overview) or the [Azure Command-Line Interface (CLI)](/cli/azure/what-is-azure-cli). These tools help you create and manage Azure resources.

Manage the permissions for users and applications to access FHIR or the DICOM services through [role assignments](configure-azure-rbac.md) from the Azure portal or by using [scripts](configure-azure-rbac-using-scripts.md). 

## Get an access token for the FHIR service

The FHIR service uses a specific `--resource` or `-resourceUrl` with a URI equal to the URI of the FHIR service audience (`https://<workspacename-fhirservicename>.fhir.azurehealthcareapis.com`) to get a token. The following example gets a token and uses it to get a list of patients. To run the example, you need at least the FHIR Data Reader role assignment. Replace the `<placeholder>` with the service URL for your FHIR service.

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

The following example gets an access token for the DICOM service.  The `--resource` or `-resourceUrl` is the DICOM service audience (`https://dicom.healthcareapis.azure.com`). The token is then used to get the service logs. To run the example, you need at least the DICOM Data Reader role assignment. Replace the `<placeholder>` with the service URL for your DICOM service.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
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

## Related content

- [Access the FHIR service by using REST client](./fhir/using-rest-client.md)
- [Access the DICOM service by using cURL](dicom/dicomweb-standard-apis-curl.md)

[!INCLUDE [FHIR and DICOM trademark statement](./includes/healthcare-apis-fhir-dicom-trademark.md)]
