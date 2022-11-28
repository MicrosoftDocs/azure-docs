---
title: Get access token using Azure CLI or Azure PowerShell
description: This article explains how to obtain an access token for Azure Health Data Services using the Azure CLI or Azure PowerShell.
services: healthcare-apis
author: mikaelweave
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 06/06/2022
ms.author: mikaelw
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Get access token using Azure CLI or Azure PowerShell

In this article, you'll learn how to obtain an access token for the FHIR service and the DICOM service using PowerShell and the Azure CLI. Keep in mind that in order to access the FHIR service or the DICOM service, users and applications must be granted permissions through [role assignments](configure-azure-rbac.md) from the Azure portal or using [scripts](configure-azure-rbac-using-scripts.md). For more information about how to get started with Azure Health Data Services, see [How to get started with FHIR](./../healthcare-apis/fhir/get-started-with-fhir.md) or [How to get started with DICOM](./../healthcare-apis/dicom/get-started-with-dicom.md). 

---
## Obtain and use an access token for the FHIR service

The FHIR service uses a specific `resource`  or `Audience` with URI equal to the URI of the FHIR server `https://<workspacename-fhirservicename>.azurehealthcareapis.com`. You can obtain a token and store it in a variable (named `$token`) with the following command:

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
token=$(az account get-access-token --resource=https://<workspacename-fhirservicename>.azurehealthcareapis.com --query accessToken --output tsv)
curl -X GET --header "Authorization: Bearer $token" https://<workspacename-fhirservicename>.azurehealthcareapis.com/Patient
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$token = (Get-AzAccessToken -ResourceUrl 'https://<workspacename-fhirservicename>.azurehealthcareapis.com').Token
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Method GET -Headers $headers -Uri 'https://<workspacename-fhirservicename>.azurehealthcareapis.com/Patient'
```

---
## Obtain and use an access token for the DICOM service

The DICOM service uses the same `resource` or `Audience` with URI equal to `https://dicom.healthcareapis.azure.com` to obtain an access token. You can obtain a token and store it in a variable (named `$token`) with the following command:

### [Azure CLI](#tab/azure-cli)

```Azure CLICopy
$token=$(az account get-access-token --resource=https://dicom.healthcareapis.azure.com --query accessToken --output tsv)
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

In this article, you learned how to obtain an access token for the FHIR service and DICOM service using CLI and Azure PowerShell. For more information about accessing the FHIR service and DICOM service, see 

>[!div class="nextstepaction"]
>[Access FHIR service using Postman](./fhir/use-postman.md)

>[!div class="nextstepaction"]
>[Access FHIR service using REST Client](./fhir/using-rest-client.md)

>[!div class="nextstepaction"]
>[Access DICOM service using cURL](dicom/dicomweb-standard-apis-curl.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
