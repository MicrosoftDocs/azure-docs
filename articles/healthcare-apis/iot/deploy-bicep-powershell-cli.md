---
title: Deploy the MedTech service using a Bicep file and Azure PowerShell or the Azure CLI - Azure Health Data Services
description: Learn how to deploy the MedTech service using a Bicep file and Azure PowerShell or the Azure CLI.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.custom: devx-track-bicep, devx-track-azurepowershell, devx-track-azurecli
ms.topic: quickstart
ms.date: 07/12/2023
ms.author: jasteppe
---

# Quickstart: Deploy the MedTech service using a Bicep file and Azure PowerShell or the Azure CLI

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. In a Bicep file, you define the infrastructure you want to deploy to Azure, and then use that file throughout the development lifecycle to repeatedly deploy your infrastructure. Your resources are deployed in a consistent manner Bicep provides concise syntax, reliable type safety, and support for code reuse. Bicep offers a first-class authoring experience for your infrastructure-as-code solutions in Azure.

In this quickstart, learn how to use Azure PowerShell or the Azure CLI to deploy an instance of the MedTech service using a Bicep file. 

> [!TIP]
> To learn more about Bicep, see [What is Bicep?](../../azure-resource-manager/bicep/overview.md?tabs=bicep)

## Prerequisites

To begin your deployment and complete the quickstart, you must have the following prerequisites:

* An active Azure subscription account. If you don't have an Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

* **Owner** or **Contributor and User Access Administrator** role assignments in the Azure subscription. For more information, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)

* The Microsoft.HealthcareApis and Microsoft.EventHub resource providers registered with your Azure subscription. To learn more about registering resource providers, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

* [Azure PowerShell](/powershell/azure/install-azure-powershell) and/or the [Azure CLI](/cli/azure/install-azure-cli) installed locally.
  * For Azure PowerShell, install the [Bicep CLI](../../azure-resource-manager/bicep/install.md#windows) to deploy the Bicep file used in this quickstart.

When you have these prerequisites, you're ready to deploy the Bicep file.

## Review the Bicep file

The Bicep file used to deploy the resources in this quickstart is available at [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/iotconnectors/) by using the *main.bicep* file on [GitHub](https://github.com/azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors/). 

## Save the Bicep file locally

Save the Bicep file locally as *main.bicep*. You need to have the working directory of your Azure PowerShell or the Azure CLI console pointing to the location where this file is saved.

## Deploy the MedTech service with the Bicep file and Azure PowerShell

Complete the following five steps to deploy the MedTech service using Azure PowerShell:

1. Sign-in into Azure.

   ```azurepowershell
   Connect-AzAccount
   ```

2. Set your Azure subscription deployment context using your subscription ID. To learn how to get your subscription ID, see [Get subscription and tenant IDs in the Azure portal](../../azure-portal/get-subscription-tenant-id.md).

   ```azurepowershell
   Set-AzContext <AzureSubscriptionId>
   ```

   For example: `Set-AzContext abcdef01-2345-6789-0abc-def012345678`
   
3. Confirm the location you want to deploy in. See the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=health-data-services) site for the current Azure regions where Azure Health Data Services is available.

   You can also review the **location** section of the locally saved *main.bicep* file.

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

   > [!IMPORTANT]
   > If you're going to allow access from multiple services to the event hub, it is highly recommended that each service has its own event hub consumer group.
   >
   > Consumer groups enable multiple consuming applications to have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups).
   >
   > Examples:
   >
   > * Two MedTech services accessing the same event hub.
   >
   > * A MedTech service and a storage writer application accessing the same event hub.

## Deploy the MedTech service with the Bicep file and the Azure CLI

Complete the following five steps to deploy the MedTech service using the Azure CLI:

1. Sign-in into Azure.

   ```azurecli
   az login
   ```

2. Set your Azure subscription deployment context using your subscription ID. To learn how to get your subscription ID, see [Get subscription and tenant IDs in the Azure portal](../../azure-portal/get-subscription-tenant-id.md).

   ```azurecli
   az account set <AzureSubscriptionId>
   ```

   For example: `az account set abcdef01-2345-6789-0abc-def012345678`

3. Confirm the location you want to deploy in. See the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=health-data-services) site for the current Azure regions where Azure Health Data Services is available.

   You can also review the **location** section of the locally saved *main.bicep* file. 

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

   > [!IMPORTANT]
   > If you're going to allow access from multiple services to the device message event hub, it is highly recommended that each service has its own event hub consumer group.
   >
   > Consumer groups enable multiple consuming applications to have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups).
   >
   > Examples:
   > 
   > * Two MedTech services accessing the same event hub.
   >
   > * A MedTech service and a storage writer application accessing the same event hub.

## Review deployed resources and access permissions

When deployment is completed, the following resources and access roles are created in the Bicep file deployment:

* Azure Event Hubs namespace and event hub. In this deployment, the event hub is named *devicedata*.

  * Event hub consumer group. In this deployment, the consumer group is named *$Default*.

  * **Azure Event Hubs Data Sender** role. In this deployment, the sender role is named *devicedatasender* and can be used to provide access to the device event hub using a shared access signature (SAS). To learn more about authorizing access using a SAS, see [Authorizing access to Event Hubs resources using Shared Access Signatures](../../event-hubs/authorize-access-shared-access-signature.md). 

* Health Data Services workspace.

* Health Data Services FHIR service.

* Health Data Services MedTech service with the required [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) roles:

  * For the event hub, the **Azure Events Hubs Data Receiver** role is assigned in the [Access control section (IAM)](../../role-based-access-control/overview.md) of the event hub.

  * For the FHIR service, the **FHIR Data Writer** role is assigned in the [Access control section (IAM)](../../role-based-access-control/overview.md) of the FHIR service.
  
> [!IMPORTANT]
> In this quickstart, the ARM template configures the MedTech service to operate in **Create** mode. A Patient resource and a Device resource are created for each device that sends data to your FHIR service.
>
> To learn more about the MedTech service resolution types **Create** and **Lookup**, see [Configure the Destination tab](deploy-manual-portal.md#configure-the-destination-tab).

## Post-deployment mappings

After you have successfully deployed an instance of the MedTech service, you'll still need to provide conforming and valid device and FHIR destination mappings.

* To learn about the device mapping, see [Overview of the device mapping](overview-of-device-mapping.md).

* To learn about the FHIR destination mapping, see [Overview of the FHIR destination mapping](overview-of-fhir-destination-mapping.md).

## Clean up Azure PowerShell deployed resources

When your resource group and deployed Bicep file resources are no longer needed, delete the resource group, which deletes the resources in the resource group.

```azurepowershell
Remove-AzResourceGroup -Name <ResourceGroupName>
```

For example: `Remove-AzResourceGroup -Name BicepTestDeployment`

## Clean up the Azure CLI deployed resources

When your resource group and deployed Bicep file resources are no longer needed, delete the resource group, which deletes the resources in the resource group.

```azurecli
az group delete --name <ResourceGroupName>
```

For example: `az group delete --resource-group BicepTestDeployment`

> [!TIP]
> For a step-by-step tutorial that guides you through the process of creating a Bicep file, see [Build your first Bicep template](/training/modules/build-first-bicep-template/).

## Next steps

In this quickstart, you learned how to use Azure PowerShell or the Azure CLI to deploy an instance of the MedTech service using a Bicep file. 

To learn about other methods of deploying the MedTech service, see

> [!div class="nextstepaction"]
> [Choose a deployment method for the MedTech service](deploy-new-choose.md)

For an overview of the MedTech service device data processing stages, see

> [!div class="nextstepaction"]
> [Overview of the MedTech service device data processing stages](overview-of-device-data-processing-stages.md)

For frequently asked questions (FAQs) about the MedTech service, see

> [!div class="nextstepaction"]
> [Frequently asked questions about the MedTech service](frequently-asked-questions.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
