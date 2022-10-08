---
title: Using Azure PowerShell and Azure CLI to deploy the MedTech service with Azure Resource Manager templates - Azure Health Data Services
description: In this article, you'll learn how to use Azure PowerShell and Azure CLI to deploy the MedTech service using an Azure Resource Manager template.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 10/10/2022
ms.author: jasteppe
---

# Using Azure PowerShell and Azure CLI to deploy the MedTech service with Azure Resource Manager templates

In this quickstart article, you'll learn how to use Azure PowerShell and Azure CLI to deploy the MedTech service using an Azure Resource Manager (ARM) template. When you call the template from PowerShell or CLI, it provides automation that enables you to distribute your deployment to large numbers of developers. Using PowerShell or CLI allows for modifiable automation capabilities that will speed up your deployment configuration in enterprise environments. For more information about ARM templates, see [What are ARM templates?](./../../azure-resource-manager/templates/overview.md).

## Resources provided by the ARM template

The ARM template will help you automatically configure and deploy the following resources. Each one can be modified to meet your deployment requirements.

- Azure Event Hubs namespace and device message event hub (the device message event hub is named: **devicedata**).
- Azure event hub consumer group  (named **$Default**).
- Azure event hub sender role (named **devicedatasender**).
- Azure Health Data Services workspace.
- Azure Health Data Services Fast Healthcare Interoperability Resources (FHIR&#174;) service.
- Azure Health Data Services MedTech service. This resource includes setup for:
  - [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) access roles needed to read from the device message event hub (named **Azure Events Hubs Receiver**)
  - system-assigned managed identity access roles needed to read and write to the FHIR service (named **FHIR Data Writer**)
- An output file containing the ARM template deployment results (named **medtech_service_ARM_template_deployment_results.txt**). The file is located in the directory from which you ran the script.

The ARM template used in this article is available from the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/iotconnectors/) site using the **azuredeploy.json** file located on [GitHub](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors/azuredeploy.json).

If you need to see a diagram with information on the MedTech service deployment, there is an architecture overview at [Choose a deployment method](deploy-iot-connector-in-azure.md#deployment-architecture-overview). This diagram shows the data flow steps of deployment and how MedTech service processes data into a FHIR Observation.

## Azure PowerShell prerequisites

Before you can begin, you need to have the following prerequisites if you're using Azure PowerShell:

- An Azure account with an active subscription. If you don't have an Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

- If you want to run the code locally, use [Azure PowerShell](/powershell/azure/install-az-ps).

## Azure CLI prerequisites

Before you can begin, you need to have the following prerequisites if you're using Azure CLI:

- An Azure account with an active subscription. If you don't have an Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

- If you want to run the code locally:

  - Use a Bash shell (such as Git Bash, which is included in [Git for Windows](https://gitforwindows.org).

  - Use [Azure CLI](/cli/azure/install-azure-cli).

## Deploy MedTech service with the ARM template and Azure PowerShell

Complete the following five steps to deploy the MedTech service using Azure PowerShell:

1. First you need to confirm the region you want to deploy in. See the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=health-data-services) site for the current Azure regions where the Azure Health Data Services is supported.

   You can also review the **location** section of the **azuredeploy.json** file on [GitHub](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors/azuredeploy.json) for Azure regions where the Azure Health Data Services is publicly available. If you need a list of the Azure regions location names, you can use this code to display a list:

   ```azurepowershell
   Get-AzLocation | Format-Table -Property DisplayName,Location
   ```

2. If the `Microsoft.EventHub` resource provider isn't already registered with your subscription, you can use this code to register it:

   ```azurepowershell
   Register-AzResourceProvider -ProviderNamespace Microsoft.EventHub
   ```

3. If the `Microsoft.HealthcareApis` resource provider isn't already registered with your subscription, you can use this code to register it:

   ```azurepowershell
   Register-AzResourceProvider -ProviderNamespace Microsoft.HealthcareApis
   ```

4. If you don't already have a resource group created for this quickstart, you can use this code to create one:

   ```azurepowershell
   New-AzResourceGroup -name <ResourceGroupName> -location <AzureRegion>
   ```

   For example: `New-AzResourceGroup -name ArmTestDeployment -location southcentralus`

   > [!IMPORTANT]
   >
   > For a successful deployment of the MedTech service, you'll need to use numbers and lowercase letters for the basename of your resources. The minimum basename requirement is three characters with a maximum of 16 characters.

5. Use the following code to deploy the MedTech service using the ARM template:

   ```azurepowershell
   New-AzResourceGroupDeployment -ResourceGroupName <ResourceGroupName> -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors/azuredeploy.json -basename <BaseName> -location <AzureRegion> | Out-File medtech_service_ARM_template_deployment_results.txt
   ```

   For example: `New-AzResourceGroupDeployment -ResourceGroupName ArmTestDeployment -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors/azuredeploy.json -basename abc123 -location southcentralus | Out-File medtech_service_ARM_template_deployment_results.txt`

> [!NOTE]
> If you want to run the Azure PowerShell commands locally, first enter `Connect-AzAccount` into your PowerShell command-line shell and enter your Azure credentials.

## Deploy MedTech service with the ARM template and Azure CLI

Complete the following five steps to deploy the MedTech service using Azure CLI:

1. First you need to confirm the region you want to deploy in. See the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=health-data-services) site for the current Azure regions where the Azure Health Data Services is supported.

   You can also review the **location** section of the **azuredeploy.json** file on [GitHub](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors/azuredeploy.json) for Azure regions where the Azure Health Data Services is publicly available. If you need a list of the Azure regions location names, you can use this code to display a list:

   ```azurecli
   az account list-locations -o table
   ```

2. If the `Microsoft.EventHub` resource provider isn't already registered with your subscription, you can use this code to register it:

   ```azurecli
   az provider register --name Microsoft.EventHub
   ```

3. If the `Microsoft.HealthcareApis` resource provider isn't already registered with your subscription, you can use this code to register it:

   ```azurecli
   az provider register --name Microsoft.HealthcareApis
   ```

4. If you don't already have a resource group created for this quickstart, you can use this code to create one:

   ```azurecli
   az group create --resource-group <ResourceGroupName> --location <AzureRegion>
   ```

   For example: `az group create --resource-group ArmTestDeployment --location southcentralus`

   > [!IMPORTANT]
   >
   > For a successful deployment of the MedTech service, you'll need to use numbers and lowercase letters for the basename of your resources.

5. Use the following code to deploy the MedTech service using the ARM template:

   ```azurecli
   az deployment group create --resource-group <ResourceGroupName> --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors/azuredeploy.json --parameters basename=<YourBaseName> location=<AzureRegion | Out-File medtech_service_ARM_template_deployment_results.txt
   ```

   For example: `az deployment group create --resource-group ArmTestDeployment --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors/azuredeploy.json --parameters basename=abc123 location=southcentralus | Out-File medtech_service_ARM_template_deployment_results.txt`

> [!NOTE]
> If you want to run the Azure CLI scripts commands locally, first enter `az login` into your PowerShell command-line shell and enter your Azure credentials.

## Deployment completion

The deployment takes a few minutes to complete. You can check the status of your deployment by reading the **medtech_service_ARM_template_deployment_results.txt** file to find out the results of the ARM template deployment.

## Post-deployment mapping

After you successfully deploy the MedTech service, you still need to provide valid device mapping and FHIR destination mapping. The device mapping will connect the device message event hub to MedTech service and the FHIR destination mapping will connect FHIR service to MedTech service. You must provide device mapping or the MedTech service can't read device data from the device message event hub. You also must provide FHIR destination mapping or MedTech can't read or write to the FHIR service.

To learn more about providing device mapping, see [How to use device mappings](how-to-use-device-mappings.md).

To learn more about providing FHIR destination mapping, see [How to use the FHIR destination mappings](how-to-use-fhir-mappings.md).

## Clean up Azure PowerShell resources

When your resource group and deployed ARM template resources are no longer needed, delete the resource group, which deletes the resources in the resource group. Delete them with this code:

```azurepowershell
Remove-AzResourceGroup -Name <ResourceGroupName>
 ```

For example: `Remove-AzResourceGroup -Name ArmTestDeployment`

## Clean up Azure CLI resources

When your resource group and deployed ARM template resources are no longer needed, delete the resource group, which deletes the resources in the resource group. Delete them with this code:

```azurecli
az group delete --name <ResourceGroupName>
```

For example: `az group delete --resource-group ArmTestDeployment`

> [!TIP]
> For a step-by-step tutorial that guides you through the process of creating an ARM template, see [Tutorial: Create and deploy your first ARM template](../../azure-resource-manager/templates/template-tutorial-create-first-template.md).

## Next steps

In this article, you learned how to use Azure PowerShell and Azure CLI to deploy the MedTech service using an Azure Resource Manager (ARM) template. To learn more about other methods of deployment, see

>[!div class="nextstepaction"]
>[Choosing a method of deployment for MedTech service in Azure](deploy-iot-connector-in-azure.md)

>[!div class="nextstepaction"]
>[How to deploy the MedTech service with a Azure ARM QuickStart template](deploy-03-new-manual.md)

>[!div class="nextstepaction"]
>[How to manually deploy MedTech service with Azure portal](deploy-03-new-manual.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
