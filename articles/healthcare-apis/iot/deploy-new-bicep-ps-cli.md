---
title: Use Azure PowerShell and Azure CLI to deploy the MedTech service with a Bicep file - Azure Health Data Services
description: In this quickstart, you'll learn how to use Azure PowerShell and Azure CLI to deploy the MedTech service using a Bicep file.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 11/28/2022
ms.author: jasteppe
---

# Quickstart: Use Azure PowerShell and Azure CLI to deploy the MedTech service with a Bicep file

In this quickstart, you'll learn how to:

> [!div class="checklist"]
> - Use Azure PowerShell or Azure CLI to deploy an instance of the MedTech service using a Bicep file. 

Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. In a Bicep file, you define the infrastructure you want to deploy to Azure, and then use that file throughout the development lifecycle to repeatedly deploy your infrastructure. Your resources are deployed in a consistent manner.

Bicep provides concise syntax, reliable type safety, and support for code reuse. Bicep offers a first-class authoring experience for your infrastructure-as-code solutions in Azure.

For more information about Bicep, see [What is Bicep?](/azure/azure-resource-manager/bicep/overview?tabs=bicep)

## Deployment prerequisites

To begin your deployment and complete the quickstart, you must have the following prerequisites:

- An active Azure subscription account. If you don't have an Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

- Owner or Contributor and User Access Administrator role assignments in the Azure subscription. For more information, see [What is Azure role-based access control?](../../role-based-access-control/overview.md)

- The Microsoft.HealthcareApis and Microsoft.EventHub resource providers registered with your Azure subscription. To learn more about registering resource providers, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

- [Azure PowerShell](/powershell/azure/install-az-ps) and/or [Azure CLI](/cli/azure/install-azure-cli) installed locally.
  - For Azure PowerShell, you'll also need to install [Bicep CLI](/azure/azure-resource-manager/bicep/install#windows) to deploy the Bicep file used in this quickstart.

When you have these prerequisites, you're ready to deploy the Bicep file.

## Review the Bicep file

The Bicep file used for this deployment is available from the [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/iotconnectors/) site using the `main.bicep` file located on [GitHub](https://github.com/azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors/). 

Locally save the Bicep file as `main.bicep`. You'll need to have the working directory of your Azure PowerShell or Azure CLI console pointing to the location where this file is saved.

## Deploy the MedTech service with the Bicep file and Azure PowerShell

Complete the following five steps to deploy the MedTech service using Azure PowerShell:

1. Sign-in into Azure.

   ```azurepowershell
   Connect-AzAccount
   ```

2. Set your Azure subscription deployment context using your subscription ID. To learn how to get your subscription ID, see [Get subscription and tenant IDs in the Azure portal](/azure/azure-portal/get-subscription-tenant-id).

   ```azurepowershell
   Set-AzContext <AzureSubscriptionId>
   ```

   For example: `Set-AzContext abcdef01-2345-6789-0abc-def012345678`
   
3. Confirm the location you want to deploy in. See the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=health-data-services) site for the current Azure regions where Azure Health Data Services is available.

   You can also review the **location** section of the locally saved `main.bicep` file.

   If you need a list of the Azure regions location names, you can use this code to display a list:

   ```azurepowershell
   Get-AzLocation | Format-Table -Property DisplayName,Location
   ```

4. If you don't already have a resource group created for this quickstart, you can use this code to create one:

   ```azurepowershell
   New-AzResourceGroup -name <ResourceGroupName> -location <AzureRegion>
   ```

   For example: `New-AzResourceGroup -name BicepTestDeployment -location southcentralus`

   > [!IMPORTANT]
   > For a successful deployment of the MedTech service, you'll need to use numbers and lowercase letters for the basename of your resources. The minimum basename requirement is three characters with a maximum of 16 characters.

5. Use the following code to deploy the MedTech service using the Bicep file:

   ```azurepowershell
   New-AzResourceGroupDeployment -ResourceGroupName <ResourceGroupName> -TemplateFile main.bicep -basename <BaseName> -location <AzureRegion>
   ```

   For example: `New-AzResourceGroupDeployment -ResourceGroupName BicepTestDeployment -TemplateFile main.bicep -basename abc123 -location southcentralus`

## Deploy the MedTech service with the Bicep file and Azure CLI

Complete the following six steps to deploy the MedTech service using Azure CLI:

1. Sign-in into Azure.

   ```azurecli
   az login
   ```
2. Set your Azure subscription deployment context using your subscription ID. To learn how to get your subscription ID, see [Get subscription and tenant IDs in the Azure portal](/azure/azure-portal/get-subscription-tenant-id).

   ```azurecli
   az account set <AzureSubscriptionId>
   ```

   For example: `az account set abcdef01-2345-6789-0abc-def012345678`

3. Confirm the location you want to deploy in. See the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=health-data-services) site for the current Azure regions where Azure Health Data Services is available.

   You can also review the **location** section of the locally saved `main.bicep` file. 

   If you need a list of the Azure regions location names, you can use this code to display a list:

   ```azurecli
   az account list-locations -o table
   ```

4. If you don't already have a resource group created for this quickstart, you can use this code to create one:

   ```azurecli
   az group create --resource-group <ResourceGroupName> --location <AzureRegion>
   ```

   For example: `az group create --resource-group BicepTestDeployment --location southcentralus`

   > [!IMPORTANT]
   > For a successful deployment of the MedTech service, you'll need to use numbers and lowercase letters for the basename of your resources.

5. Use the following code to deploy the MedTech service using the Bicep file:

   ```azurecli
   az deployment group create --resource-group BicepTestDeployment --template-file main.bicep --parameters basename=<BaseName> location=<AzureRegion>
   ```

   For example: `az deployment group create --resource-group BicepTestDeployment --template-file main.bicep --parameters basename=abc location=southcentralus`

## Review deployed resources and access permissions

When deployment is completed, the following resources and access roles are created in the Bicep file deployment:

- Azure Event Hubs namespace and device message event hub. In this deployment, the device message event hub is named `devicedata`.

- An event hub consumer group. In this deployment, the consumer group is named `$Default`.

- The Azure Event Hubs Data Sender role. In this deployment, the sender role is named `devicedatasender`.

- A Health Data Services workspace.

- A Health Data Services Fast Healthcare Interoperability Resources (FHIR&#174;) service.

- An instance of the MedTech service for Health Data Services, with the required [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) roles:

  - For the device message event hub, the Azure Events Hubs Data Receiver role is assigned in the [Access control section (IAM)](../../role-based-access-control/overview.md) of the device message event hub.

  - For the FHIR service, the FHIR Data Writer role is assigned in the [Access control section (IAM)](../../role-based-access-control/overview.md) of the FHIR service.

## Post-deployment mappings

After you've successfully deployed an instance of the MedTech service, you'll still need to provide conforming and valid device and FHIR destination mappings.

 - To learn more about device mappings, see [How to configure device mappings](how-to-use-device-mappings.md).

 - To learn more about FHIR destination mappings, see [How to configure FHIR destination mappings](how-to-use-fhir-mappings.md).

## Clean up Azure PowerShell deployed resources

When your resource group and deployed Bicep file resources are no longer needed, delete the resource group, which deletes the resources in the resource group.

```azurepowershell
Remove-AzResourceGroup -Name <ResourceGroupName>
 ```

For example: `Remove-AzResourceGroup -Name BicepTestDeployment`

## Clean up Azure CLI deployed resources

When your resource group and deployed Bicep file resources are no longer needed, delete the resource group, which deletes the resources in the resource group.

```azurecli
az group delete --name <ResourceGroupName>
```

For example: `az group delete --resource-group BicepTestDeployment`

> [!TIP]
> For a step-by-step tutorial that guides you through the process of creating a Bicep file, see [Build your first Bicep template](/training/modules/build-first-bicep-template/).

## Next steps

In this article, you learned how to use Azure PowerShell and Azure CLI to deploy an instance of the MedTech service using a Bicep file. To learn more about other methods of deploying the MedTech service, see

> [!div class="nextstepaction"]
> [Choosing a method of deployment for the MedTech service in Azure](deploy-iot-connector-in-azure.md)

> [!div class="nextstepaction"]
> [How to deploy the MedTech service with a Azure Resource Manager template](deploy-02-new-button.md)

> [!div class="nextstepaction"]
> [How to manually deploy the MedTech service with Azure portal](deploy-03-new-manual.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
