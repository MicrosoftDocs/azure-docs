---
title: 'Quickstart: Deploy Azure API for FHIR using Azure CLI'
description: In this quickstart, you'll learn how to deploy Azure API for FHIR in Azure using the Azure CLI.
services: healthcare-apis
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 09/27/2023
ms.author: kesheth
ms.custom: devx-track-azurecli, mode-api
---

# Quickstart: Deploy Azure API for FHIR using Azure CLI

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this quickstart, you'll learn how to deploy Azure API for FHIR in Azure using the Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Add Azure Health Data Services (for example, HealthcareAPIs) extension

```azurecli-interactive
az extension add --name healthcareapis
```

Get a list of commands for HealthcareAPIs:

```azurecli-interactive
az healthcareapis --help
```

## Create Azure Resource Group

Pick a name for the resource group that will contain the Azure API for FHIR and create it:

```azurecli-interactive
az group create --name "myResourceGroup" --location westus2
```

## Deploy the Azure API for FHIR

```azurecli-interactive
az healthcareapis create --resource-group myResourceGroup --name nameoffhiraccount --kind fhir-r4 --location westus2 
```

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

In this quickstart guide, you've deployed the Azure API for FHIR into your subscription. For information about how to register applications and the Azure API for FHIR configuration settings, see


>[!div class="nextstepaction"]
>[Register Applications Overview](fhir-app-registration.md)

>[!div class="nextstepaction"]
>[Configure Azure RBAC](configure-azure-rbac.md)

>[!div class="nextstepaction"]
>[Configure local RBAC](configure-local-rbac.md)

>[!div class="nextstepaction"]
>[Configure database settings](configure-database.md)

>[!div class="nextstepaction"]
>[Configure customer-managed keys](customer-managed-key.md)

>[!div class="nextstepaction"]
>[Configure CORS](configure-cross-origin-resource-sharing.md)

>[!div class="nextstepaction"]
>[Configure Private Link](configure-private-link.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.