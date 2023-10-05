---
title: Get an access token for the DICOM service in Azure Health Data Services
description: Find out how to secure your access to the DICOM service with a token. Use the Azure command-line tool and unique identifiers to manage your medical images.
author: mmitrik
ms.service: healthcare-apis
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 10/6/2023
ms.author: mmitrik
---

# Get an access token

To use the DICOM service, users and applications need to prove their identity and permissions by getting an access token. An access token is a string that identifies a user or an application and grants them permission to access a resource. Using access tokens enhances security by preventing unauthorized access and reducing the need for repeated authentication. 

## Use the Azure command-line interface

 You get an access token using the [Azure command-line interface (CLI)](/cli/azure/what-is-azure-cli). Azure CLI is a set of commands used to create and manage Azure resources. You can use it to interact with Azure services, including the DICOM service. You can install Azure CLI on your computer or use it in the [Azure Cloud Shell](https://azure.microsoft.com/en-us/get-started/azure-portal/cloud-shell/).

## Provide object IDs during deployment

Object IDs are assigned by Microsoft Entra ID to every user or application in your organization. When you [deploy the DICOM service](deploy-dicom-services-in-azure.md), you configure a set of users or service principals that have access by providing their object IDs, either as a variable or by passing them to another command with pipes or loops. 

## Get a token

To get an access token using Azure CLI:

1. Sign in to Azure CLI with your user account or a service principal.

1. Get the object ID of your user account or service principal by using the commands `az ad signed-in-user show` or `az ad sp list`, respectively.

1. Get the access token by using the command `az account get-access-token --resource=https://dicom.healthcareapis.azure.com`.

1. Copy the access token from the output of the command.

1. Use the access token in your requests to the DICOM service by adding it as a header with the name `Authorization` and the value `Bearer <access token>`.

### Tips for using a local installation of Azure CLI

* If you're using a local installation, sign in to the Azure CLI with the [az login](/cli/azure/reference-index#az-login) command. To finish authentication, follow the on-screen steps. For more information, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

* If prompted, install Azure CLI extensions on first use. For more information, see [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

* Run [az version](/cli/azure/reference-index#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az-upgrade).

## Store a token in a variable

The DICOM service uses a `resource` or `Audience` with uniform resource identifier (URI) equal to the URI of the DICOM server  `https://dicom.healthcareapis.azure.com`. You can obtain a token and store it in a variable (named `$token`) with the following command:

```Azure CLICopy
Try It
$token=$(az account get-access-token --resource=https://dicom.healthcareapis.azure.com --query accessToken --output tsv)
```

## Use a token with the DICOM service

You can use a token with the DICOM service [using cURL](dicomweb-standard-apis-curl.md). Here's an example:

```Azure CLICopy
Try It
curl -X GET --header "Authorization: Bearer $token"  https://<workspacename-dicomservicename>.dicom.azurehealthcareapis.com/v<version of REST API>/changefeed
```

## Next steps


