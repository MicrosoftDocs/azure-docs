---
title: Deploy PaaS FHIR Server using Azure CLI
description: Deploy PaaS FHIR Server using Azure CLI.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: quickstart 
ms.date: 02/11/2019.
ms.author: mihansen
---

# Quickstart: Deploy PaaS FHIR Server using Azure CLI

In this quick start, you'll learn how to deploy a PaaS FHIR Server in Azure using the Azure CLI.

## Prerequisites

- Azure Subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure Resource Manager template

Create an Azure Resource Manager template with the following content:

[!code-json[](samples/azuredeploy.json)]

Save it with the name `azuredeploy.json`

```azurecli-interactive
servicename="myfhirservice"
az group create --name $servicename --location westus2
```

## Deploy the Healthcare APIs account

```azurecli-interactive
az group deployment create -g $servicename --template-file azuredeploy.json --parameters accountName=$servicename
```

## Verify FHIR Server is running:

Obtain a capability statement from the FHIR server with:

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

In this tutorial, you've deployed the Microsoft Healthcare APIs for FHIRinto your subscription. To learn how to configure an identity provider for the FHIR server, proceed to the identity provider tutorial.

>[!div class="nextstepaction"]
>[Configure FHIR Identity Provider](documentation-fhir-tutorial-configure-identity.md)