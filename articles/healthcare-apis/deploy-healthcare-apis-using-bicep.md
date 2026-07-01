---
title: How to deploy Azure Health Data Services services with BICEP
description: This document describes how to deploy an Azure Health Data Services using Azure Bicep workspace with a FHIR and a DICOM service with BICEP.
author: chachachachami
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: quickstart-bicep
ms.date: 03/27/2026
ms.author: chrupa
ms.reviewer: v-catheribun
ms.custom:
  - mode-api
  - devx-track-bicep
  - build-2025
  - subject-bicepqs
---

# Quickstart: Deploy Azure Health Data Service with Bicep

In this quickstart, use a Bicep file to create an Azure Health Data Services workspace with a Fast Healthcare Interoperability Resources (FHIR) service and a Digital Imaging Communications in Medicine (DICOM) service. 

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

An Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

[!INCLUDE [Azure CLI](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.healthcareapis/workspaces/create-workspace-with-child-services).


:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.healthcareapis/workspaces/create-workspace-with-child-services/main.bicep":::

The Bicep file defines three Azure resources.

- [Microsoft.HealthcareApis workspaces](/azure/templates/microsoft.healthcareapis/workspaces)
- [Microsoft.HealthcareApis workspaces/fhirservices](/azure/templates/microsoft.healthcareapis/workspaces/fhirservices)
- [Microsoft.HealthcareApis workspaces/dicomservices](/azure/templates/microsoft.healthcareapis/workspaces/dicomservices)



## Prepare your environment

You can deploy the Bicep file by using Azure CLI or Azure PowerShell. This example uses Azure CLI in Bash.

1. Save your Bicep file locally as `main.bicep`.
1. Open a Bash shell and go to the directory where you saved the Bicep file.
1. Run the following command to sign in to Azure from the CLI. Follow the prompts to complete the authentication process.
    
    ```azurecli
    az login
    ```
1. Run the upgrade command to make sure you're running the latest version of Azure CLI.

    ```azurecli
    az upgrade
    ```

## Create resource group

Use the [az group create](/cli/azure/group#az-group-create) command to create a resource group. Replace the `<placeholders>` with your values. 

```azurecli
az group create --name <resource group name> --location westus2
```

## Deploy resources

Use the [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) command to deploy your resources. Replace the `<placeholders>` with your values.

```azurecli
az deployment group create --resource-group <resource group name> --template-file main.bicep

```

The output of this command is a JSON-formatted listing of the deployment. You can view and manage these resources through the [az healthcareapis workspace](/cli/azure/healthcareapis/workspace) commands.

## Debug Bicep files

You can debug Bicep files in Visual Studio Code or in other environments. Troubleshoot issues based on the response. You can also review the activity log for a specific resource in the resource group while debugging.

In addition, you can use the **output** value for debugging or as part of the deployment response. For example, you can define two output values to display the values of authority and audience for the FHIR service in the response. For more information, see [Outputs in Bicep](../azure-resource-manager/bicep/outputs.md).

```
output stringOutput1 string = authority
output stringOutput2 string = audience
```

## Clean up resources

When you're finished with the resources you created, delete the resource group. Deleting the resource group deletes all the resources created in this exercise. To delete the resource group, run the [az group delete](/cli/azure/group#az-group-delete) command. Replace the `<placeholders>` with your values.

```azurecli
az group delete --resource-group <resource group name>
```

## Next steps

>[!div class="nextstepaction"]
>[Manage user access and permissions](authentication-authorization.md)

[!INCLUDE [FHIR and DICOM trademark statement](./includes/healthcare-apis-fhir-dicom-trademark.md)]

