---
title: 'Quickstart: Deploy Azure API for FHIR using Azure CLI'
description: In this quickstart, you'll learn how to deploy Azure API for FHIR in Azure using the Azure CLI.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 10/15/2019
ms.author: mihansen
---

# Quickstart: Deploy Azure API for FHIR using Azure CLI

In this quickstart, you'll learn how to deploy Azure API for FHIR in Azure using the Azure CLI.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Add HealthcareAPIs extension

```azurecli-interactive
az extension add --name healthcareapis
```

Get a list of commands for HealthcareAPIs:

```azurecli-interactive
az healthcareapis --help
```

## Locate your identity object ID

Object ID values are guids that correspond to the object IDs of specific Azure Active Directory users or service principals in the directory associated with the subscription. If you would like to know the object ID of a specific user, you can find it with a command like:

```azurecli-interactive
az ad user show --id myuser@consoso.com | jq -r .objectId
```
Read the how-to guide on [finding identity object IDs](find-identity-object-ids.md) for more details.

## Create Azure Resource Group

Pick a name for the resource group that will contain the Azure API for FHIR and create it:

```azurecli-interactive
az group create --name "myResourceGroup" --location westus2
```

## Deploy the Azure API for FHIR

```azurecli-interactive
az healthcareapis create --resource-group myResourceGroup --name nameoffhiraccount --kind fhir-r4 --location westus2 --access-policies-object-id "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

where `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` is the identity object ID for a user or service principal that you would like to have access to the FHIR API.

## Fetch FHIR API capability statement

Obtain a capability statement from the FHIR API with:

```azurecli-interactive
curl --url "https://nameoffhiraccount.azurehealthcareapis.com/metadata"
```

## Clean up resources

If you're not going to continue to use this application, delete the resource group with the following steps:

```azurecli-interactive
az group delete --name "myResourceGroup"
```

## Next steps

In this quickstart guide, you've deployed the Azure API for FHIR into your subscription. To set additional settings in your Azure API for FHIR, proceed to the additional settings how-to guide.

>[!div class="nextstepaction"]
>[Additional settings in Azure API for FHIR](azure-api-for-fhir-additional-settings.md)
