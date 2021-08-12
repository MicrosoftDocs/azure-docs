---
title: Get access token using Azure CLI - FHIR service
description: This article explains how to obtain an access token for FHIR service using the Azure CLI.
services: healthcare-apis
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 08/12/2021
ms.author: zxue
---

# Get access token for FHIR service using Azure CLI

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you'll learn how to obtain an access token for the FHIR service using the Azure CLI. When you [provision the FHIR service](fhir-portal-quickstart.md), you configure a set of users or service principals that have access to the service. If your user object ID is in the list of allowed object IDs, you can access the service using a token obtained using the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Obtain a token

The FHIR service uses a `resource`  or `Audience` with URI equal to the URI of the FHIR server `https://<FHIR ACCOUNT NAME>.azurehealthcareapis.com`. You can obtain a token and store it in a variable (named `$token`) with the following command:

```azurecli-interactive
token=$(az account get-access-token --resource=https://<FHIR ACCOUNT NAME>.azurehealthcareapis.com --query accessToken --output tsv)
```

## Use with FHIR service

```azurecli-interactive
curl -X GET --header "Authorization: Bearer $token" https://<FHIR ACCOUNT NAME>.azurehealthcareapis.com/Patient
```

>[!div class="nextstepaction"]
>[Access FHIR API using Postman](using-postman.md)
