---
title: 'Azure CLI: Deploy open source FHIR server for Azure - Azure API for Azure'
description: This quickstart explains how to deploy the Open Source Microsoft FHIR server for Azure.
services: healthcare-apis
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart 
ms.date: 02/07/2019
ms.author: matjazl 
ms.custom: devx-track-azurecli
---

# Quickstart: Deploy Open Source FHIR server using Azure CLI

In this quickstart, you'll learn how to deploy an Open Source FHIR&reg; server in Azure using the Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

## Create resource group

Pick a name for the resource group that will contain the provisioned resources and create it:

```azurecli-interactive
servicename="myfhirservice"
az group create --name $servicename --location westus2
```

## Deploy template

The Microsoft FHIR Server for Azure [GitHub Repository](https://github.com/Microsoft/fhir-server) contains a template that will deploy all necessary resources. Deploy it with:

```azurecli-interactive
az group deployment create -g $servicename --template-uri https://raw.githubusercontent.com/Microsoft/fhir-server/master/samples/templates/default-azuredeploy.json --parameters serviceName=$servicename
```

## Verify FHIR server is running

Obtain a capability statement from the FHIR server with:

```azurecli-interactive
metadataurl="https://${servicename}.azurewebsites.net/metadata"
curl --url $metadataurl
```

It will take a minute or so for the server to respond the first time.

## Clean up resources

If you're not going to continue to use this application, delete the resource group with the following steps:

```azurecli-interactive
az group delete --name $servicename
```

## Next steps

In this tutorial, you've deployed the Microsoft Open Source FHIR Server for Azure into your subscription. To learn how to access the FHIR API using Postman, proceed to the Postman tutorial.
 
>[!div class="nextstepaction"]
>[Access FHIR API using Postman](access-fhir-postman-tutorial.md)
