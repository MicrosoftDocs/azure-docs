---
title: Get access token for Azure API for FHIR using Azure CLI
description: This article explains how to obtain an access token for Azure API for FHIR using the Azure CLI.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 02/26/2019
ms.author: mihansen
---

# Get access token for Azure API for FHIR using Azure CLI

In this article, you'll learn how to obtain an access token for the Azure API for FHIR using the Azure CLI. When you [provision the Azure API for FHIR](fhir-paas-portal-quickstart.md), you configure a set of users or service principals that have access to the service. If your user object ID is in the list of allowed object IDs, you can access the service using a token obtained using the Azure CLI.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Sign in with Azure CLI

Before you can obtain a token, you need to sign in with the user that you want to obtain a token for:

```azurecli-interactive
az login
```

## Obtain a token

The Azure API for FHIR uses a `resource`  or `Audience` with URI `https://azurehealthcareapis.com`. You can obtain a token and store it in a variable (named `$token`) with the following command:

```azurecli-interactive
token=$(az account get-access-token --resource=https://azurehealthcareapis.com | jq -r .accessToken)
```

## Use with Azure API for FHIR

```azurecli-interactive
curl -X GET --header "Authorization: Bearer $token" https://<FHIR ACCOUNT NAME>.azurehealthcareapis.com/Patient
```

## Next steps

In this article, you've learned how to obtain an access token for the Azure API for FHIR using the Azure CLI. To learn how to access the FHIR API using Postman, proceed to the Postman tutorial.

>[!div class="nextstepaction"]
>[Access FHIR API using Postman](access-fhir-postman-tutorial.md)