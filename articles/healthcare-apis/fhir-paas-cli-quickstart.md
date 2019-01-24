---
title: Deploy Azure API for FHIR using Azure CLI
description: Deploy Azure API for FHIR using Azure CLI.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: quickstart
ms.date: 02/07/2019
ms.author: mihansen
---

# Quickstart: Deploy Azure API for FHIR using Azure CLI

In this quick start, you'll learn how to deploy Azure API for FHIR in Azure using the Azure CLI.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-try-it.md)]

## Create an Azure Resource Manager template

Create an Azure Resource Manager template with the following content:

[!code-json[](samples/azuredeploy.json)]

Save it with the name `azuredeploy.json`

```azurecli-interactive
servicename="myfhirservice"
az group create --name $servicename --location westus2
```

## Deploy the Azure API for FHIR account

```azurecli-interactive
az group deployment create -g $servicename --template-file azuredeploy.json --parameters accountName=$servicename
```

## Fetch FHIR API capability statement

Obtain a capability statement from the FHIR API with:

```azurecli-interactive
metadataurl="https://${servicename}.microsofthealthcare-apis.com/fhir/metadata"
curl --url $metadataurl
```

## Clean up resources

If you're not going to continue to use this application, delete the resource group with the following steps:

```azurecli-interactive
az group delete --name $servicename
```

## Next steps

In this tutorial, you've deployed the Azure API for FHIR into your subscription. To learn how to access the FHIR API using Postman, proceed to the Postman tutorial.

>[!div class="nextstepaction"]
>[Access FHIR API using Postman](access-fhir-postman-tutorial.md)