---
title: Access the Azure Healthcare APIs with cURL
description: This article explains how to access the Healthcare APIs with cURL
services: healthcare-apis
author: ginalee-dotcom
ms.service: healthcare-apis
ms.topic: tutorial
ms.date: 07/19/2021
ms.author: ginle
---

# Access the Healthcare APIs (preview) with cURL 

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you will learn how to access the Azure Healthcare APIs with cURL.

## Prerequisites

### PowerShell

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally, install [PowerShell](https://docs.microsoft.com/powershell/module/powershellget/) and [Azure Az PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps).
* Optionally, you can run the scripts in Visual Studio Code with the Rest Client extension. For more information, see [Make a link to the Rest Client doc](using-rest-client.md).
* Download and install [cURL](https://curl.se/download.html).

### CLI

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally, install [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli). 
* Optionally, install a Bash shell, such as Git Bash, which it is included in [Git for Windows](https://gitforwindows.org/).
* Optionally, run the scripts in Visual Studio Code with the Rest Client extension. For more information, see [Make a link to the Rest Client doc](using-rest-client.md).
* Download and install [cURL](https://curl.se/download.html).

## Obtain Azure Access Token

Before accessing the Healthcare APIs, you must grant the user or client app with proper permissions. For more information on how to grant permissions, see [Healthcare APIs authorization](authentication-authorization.md).

There are several different ways to obtain an Azure access token for the Healthcare APIs. 

> [!NOTE]
> Make sure that you have logged into Azure and that you are in the Azure subscription and tenant where you have deployed the Healthcare APIs instance.

# [PowerShell](#tab/PowerShell)

```powershell-interactive
### check Azure environment and PowerShell versions
Get-AzContext 
Set-AzContext -Subscription <subscriptionid>
$PSVersionTable.PSVersion
Get-InstalledModule -Name Az -AllVersions
curl --version

### get access token for the FHIR service
$fhirservice="https://<fhirservice>.fhir.azurehealthcareapis.com"
$token=(Get-AzAccessToken -ResourceUrl $fhirservice).Token

### Get access token for the DICOM service
$dicomtokenurl= "https://dicom.healthcareapis.azure.com/"
$token=$( Get-AzAccessToken -ResourceUrl $dicomtokenurl).Token
```

# [CLI](#tab/CLI)

```azurecli-interactive
### check Azure environment and CLI versions
az account show --output table
az account set --subscription <subscriptionid>
cli –version
curl --version

### get access token for the FHIR service
$fhirservice=https://<fhirservice>.fhir.azurehealthcareapis.com
token=$(az account get-access-token --resource=$fhirservice --query accessToken --output tsv)

### get access token for the DICOM service
dicomtokenurl= https://dicom.healthcareapis.azure.com/
token=$(az account get-access-token --resource=$dicomtokenurl --query accessToken --output tsv)
```

---

## Access data in the FHIR service

# [PowerShell](#tab/PowerShell)

```powershell-interactive
$fhirservice="https://<fhirservice>.fhir.azurehealthcareapis.com"
```

# [CLI](#tab/CLI)

```azurecli-interactive
fhirservice="https://<fhirservice>.fhir.azurehealthcareapis.com"
```

---

`curl -X GET --header "Authorization: Bearer $token" $fhirservice/Patient`

[ ![Access data in the FHIR service with curl script.](media/curl-fhir.png) ](media/curl-fhir.png#lightbox)

## Access data in the DICOM service

# [PowerShell](#tab/PowerShell)

```powershell-interactive
$dicomservice="https://<dicomservice>.dicom.azurehealthcareapis.com"
```
# [CLI](#tab/CLI)

```azurecli-interactive
dicomservice="https://<dicomservice>.dicom.azurehealthcareapis.com"
```
---

`curl -X GET --header "Authorization: Bearer $token" $dicomservice/changefeed?includemetadata=false`

[ ![Access data in the DICOM service with curl script.](media/curl-dicom.png) ](media/curl-dicom.png#lightbox)

## Next steps

In this article, you learned how to access the Healthcare APIs data using cURL.

To learn about how to access the Healthcare APIs data using REST Client extension in Visual Studio Code, see 

>[!div class="nextstepaction"]
>[Access the Healthcare APIs using REST Client](using-rest-client.md)