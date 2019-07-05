---
title: Deploy Azure API for FHIR using Azure CLI
description: Deploy Azure API for FHIR using Azure CLI.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 02/07/2019
ms.author: mihansen
---

# Quickstart: Deploy Azure API for FHIR using Azure CLI

In this quickstart, you'll learn how to deploy Azure API for FHIR in Azure using the Azure CLI.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create Azure Resource Manager template

Create an Azure Resource Manager template with the following content:

[!code-json[](samples/azuredeploy.json)]

Save it with the name `azuredeploy.json`

## Create Azure Resource Manager parameter file

Create an Azure Resource Manager template parameter file with the following content:

[!code-json[](samples/azuredeploy.parameters.json)]

Save it with the name `azuredeploy.parameters.json`

The object ID values `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` and `yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy` correspond to the object IDs of specific Azure Active Directory users or service principals in the directory associated with the subscription. If you would like to know the object ID of a specific user, you can find it with a command like:

```azurecli-interactive
az ad user show --upn-or-object-id myuser@consoso.com | jq -r .objectId
```

Read the how-to guide on [finding identity object IDs](find-identity-object-ids.md) for more details.

# Create Azure Resource Group

Pick a name for the resource group that will contain the Azure API for FHIR and create it:

```azurecli-interactive
az group create --name "myResourceGroup" --location westus2
```

## Deploy the Azure API for FHIR account

Use the template (`azuredeploy.json`) and the template parameter file (`azuredeploy.parameters.json`) to deploy the Azure API for FHIR:

```azurecli-interactive
az group deployment create -g "myResourceGroup" --template-file azuredeploy.json --parameters @{azuredeploy.parameters.json}
```

## Fetch FHIR API capability statement

Obtain a capability statement from the FHIR API with:

```azurecli-interactive
curl --url "https://nameOfFhirAccount.azurehealthcareapis.com/fhir/metadata"
```

## Clean up resources

If you're not going to continue to use this application, delete the resource group with the following steps:

```azurecli-interactive
az group delete --name "myResourceGroup"
```

## Next steps

In this tutorial, you've deployed the Azure API for FHIR into your subscription. To learn how to access the FHIR API using Postman, proceed to the Postman tutorial.

>[!div class="nextstepaction"]
>[Access FHIR API using Postman](access-fhir-postman-tutorial.md)