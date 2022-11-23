---
title: Using Azure PowerShell and Azure CLI to deploy the MedTech service with a Bicep file - Azure Health Data Services
description: In this quickstart, you'll learn how to use Azure PowerShell and Azure CLI to deploy the MedTech service using a Bicep file.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 11/23/2022
ms.author: jasteppe
---

# Quickstart: Using Azure PowerShell and Azure CLI to deploy the MedTech service with a Bicep file

In this quickstart, you'll learn how to use Azure PowerShell and Azure CLI to deploy the MedTech service using a Bicep file. 

Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. In a Bicep file, you define the infrastructure you want to deploy to Azure, and then use that file throughout the development lifecycle to repeatedly deploy your infrastructure. Your resources are deployed in a consistent manner.

Bicep provides concise syntax, reliable type safety, and support for code reuse. Bicep offers a first-class authoring experience for your infrastructure-as-code solutions in Azure.

For more information about Bicep, see [What is Bicep?](/azure/azure-resource-manager/bicep/overview?tabs=bicep)

## Deployment prerequisites

Before you can begin this quickstart, you'll need to have the following prerequisites completed:

- An Azure account with an active subscription. If you don't have an Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

- **Owner** or **Contributor + User Access Administrator** access to the Azure subscription. For more information about Azure role-based access control, see [What is Azure role-based access control?](../../role-based-access-control/overview.md)

- **Microsoft.HealthcareApis** and **Microsoft.EventHub** resource providers registered with your Azure subscription. To learn more about registering resource providers, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

- [Azure PowerShell](/powershell/azure/install-az-ps) and/or [Azure CLI](/cli/azure/install-azure-cli) installed on your local computer.

Once you've successfully completed the prerequisites, you're ready to deploy the Bicep file.

## Resources deployed by the Bicep file

The Bicep file will help you automatically configure and deploy the following resources. Each one can be modified to meet your deployment requirements.

- Azure Event Hubs namespace and device message event hub. The device message event hub is named **devicedata**.
- Azure event hub consumer group. The consumer group is named **$Default**.
- Azure event hub sender role. The sender role is named **devicedatasender**.
- Azure Health Data Services workspace.
- Azure Health Data Services Fast Healthcare Interoperability Resources (FHIR&#174;) service.
- Azure Health Data Services MedTech service. This resource includes setup for:
  - [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) access role needed to read from the device message event hub. The role is named **Azure Events Hubs Receiver**.
  - system-assigned managed identity access role needed to read and write to the FHIR service. The role is named **FHIR Data Writer**.
- An output file containing the Bicep file deployment results. The file named **medtech_service_BICEP_file_deployment_results.txt** and will be located in the directory from which you ran the deployment code.

To see an architecture overview diagram with information on the MedTech service deployment, see: [Choose a deployment method](deploy-iot-connector-in-azure.md#deployment-architecture-overview). This diagram shows the steps of deployment and how the MedTech service processes data into a FHIR Observation.

## Review the Bicep file

The Bicep file used in this quickstart is available from the [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/iotconnectors/) site using the **main.bicep** file located on [GitHub](https://github.com/azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors/).

## Deploy the MedTech service with the Bicep file and Azure PowerShell

Complete the following four steps to deploy the MedTech service using Azure PowerShell:

1. Save the Bicep file located on GitHub as **main.bicep** on your local computer. You'll need to have the working directory of your Azure PowerShell console pointing to the location where this file is saved.

2. Confirm the region you want to deploy in. See the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=health-data-services) site for the current Azure regions where the Azure Health Data Services is available.

   You can also review the **location** section of the locally saved **main.bicep** file.

   If you need a list of the Azure regions location names, you can use this code to display a list:

   ```azurepowershell
   Get-AzLocation | Format-Table -Property DisplayName,Location
   ```

3. If you don't already have a resource group created for this quickstart, you can use this code to create one:

   ```azurepowershell
   New-AzResourceGroup -name <ResourceGroupName> -location <AzureRegion>
   ```

   For example: `New-AzResourceGroup -name BicepTestDeployment -location southcentralus`

   > [!IMPORTANT]
   > For a successful deployment of the MedTech service, you'll need to use numbers and lowercase letters for the basename of your resources. The minimum basename requirement is three characters with a maximum of 16 characters.

4. Use the following code to deploy the MedTech service using the Bicep file:

   ```azurepowershell
   New-AzResourceGroupDeployment -ResourceGroupName <ResourceGroupName> -TemplateFile main.bicep -basename <BaseName> -location <AzureRegion> | Out-File medtech_service_BICEP_file_deployment_results.txt
   ```

   For example: `New-AzResourceGroupDeployment -ResourceGroupName BicepTestDeployment -TemplateFile main.bicep -basename abc123 -location southcentralus | Out-File medtech_service_BICEP_file_deployment_results.txt`

## Deploy the MedTech service with the Bicep file and Azure CLI

Complete the following four steps to deploy the MedTech service using Azure CLI:

1. Save the Bicep file located on GitHub as **main.bicep** on your local computer. You'll need to have the working directory of your Azure PowerShell console pointing to the location where this file is saved.

2. Confirm the region you want to deploy in. See the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=health-data-services) site for the current Azure regions where the Azure Health Data Services is available.

   You can also review the **location** section of the locally saved **main.bicep** file. 

   If you need a list of the Azure regions location names, you can use this code to display a list:

   ```azurecli
   az account list-locations -o table
   ```

3. If you don't already have a resource group created for this quickstart, you can use this code to create one:

   ```azurecli
   az group create --resource-group <ResourceGroupName> --location <AzureRegion>
   ```

   For example: `az group create --resource-group BicepTestDeployment --location southcentralus`

   > [!IMPORTANT]
   > For a successful deployment of the MedTech service, you'll need to use numbers and lowercase letters for the basename of your resources.

4. Use the following code to deploy the MedTech service using the Bicep file:

   ```azurecli
   az deployment group create --resource-group BicepTestDeployment --template-file main.bicep --parameters basename=<BaseName> location=<AzureRegion> | Out-File medtech_service_BICEP_file_deployment_results.txt
   ```

   For example: `az deployment group create --resource-group BicepTestDeployment --template-file main.bicep --parameters basename=abc location=southcentralus | Out-File medtech_service_BICEP_file_deployment_results.txt`

## Deployment completion

The deployment takes a few minutes to complete. You can check the status of your deployment by reading the **medtech_service_BICEP_file_deployment_results.txt** file to find out the results of the Bicep file deployment.

## Post-deployment mappings

After you successfully deploy the MedTech service, you'll still need to provide conforming and valid device and FHIR destination mappings.

 - To learn more about device mappings, see [How to configure device mappings](how-to-use-device-mappings.md).

 - To learn more about FHIR destination mappings, see [How to configure HIR destination mappings](how-to-use-fhir-mappings.md).

## Clean up Azure PowerShell deployed resources

When your resource group and deployed Bicep file resources are no longer needed, delete the resource group, which deletes the resources in the resource group. Delete them with this code:

```azurepowershell
Remove-AzResourceGroup -Name <ResourceGroupName>
 ```

For example: `Remove-AzResourceGroup -Name BicepTestDeployment`

## Clean up Azure CLI deployed resources

When your resource group and deployed ARM template resources are no longer needed, delete the resource group, which deletes the resources in the resource group. Delete them with this code:

```azurecli
az group delete --name <ResourceGroupName>
```

For example: `az group delete --resource-group BicepTestDeployment`

> [!TIP]
> For a step-by-step tutorial that guides you through the process of creating a Bicep file, see [Build your first Bicep template](/training/modules/build-first-bicep-template/).

## Next steps

In this article, you learned how to use Azure PowerShell and Azure CLI to deploy the MedTech service using a Bicep file. To learn more about other methods of deployment, see

> [!div class="nextstepaction"]
> [Choosing a method of deployment for MedTech service in Azure](deploy-iot-connector-in-azure.md)

> [!div class="nextstepaction"]
> [How to deploy the MedTech service with a Azure Resource Manager template](deploy-02-new-button.md)

> [!div class="nextstepaction"]
> [How to manually deploy the MedTech service with Azure portal](deploy-03-new-manual.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
