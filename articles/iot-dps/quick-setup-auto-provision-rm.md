---
title: Quickstart - Create an Azure IoT Hub Device Provisioning Service (DPS) using Azure Resource Manager template (ARM template)
description: Azure quickstart - Learn how to create an Azure IoT Hub Device Provisioning Service (DPS) using Azure Resource Manager template (ARM template).
author: kgremban
ms.author: kgremban
ms.date: 04/06/2023    
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps
ms.custom: mvc, subject-armqs, mode-arm, devx-track-arm-template, devx-track-azurecli
---

# Quickstart: Set up the IoT Hub Device Provisioning Service (DPS) with an ARM template

You can use an [Azure Resource Manager](../azure-resource-manager/management/overview.md) template (ARM template) to programmatically set up the Azure cloud resources necessary for provisioning your devices. These steps show how to create an IoT hub and a new IoT Hub Device Provisioning Service with an ARM template. The Iot Hub is also linked to the DPS resource using the template. This linking allows the DPS resource to assign devices to the hub based on allocation policies you configure.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

This quickstart uses [Azure portal](../azure-resource-manager/templates/deploy-portal.md) and the [Azure CLI](../azure-resource-manager/templates/deploy-cli.md) to perform the programmatic steps necessary to create a resource group and deploy the template. However, you can also use [PowerShell](../azure-resource-manager/templates/deploy-powershell.md), .NET, Ruby, or other programming languages to perform these steps and deploy your template. 

If your environment meets the prerequisites, and you're already familiar with using ARM templates, selecting the **Deploy to Azure** button opens the template for deployment in the Azure portal.

[![Deploy to Azure in overview](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2Fquickstarts%2Fmicrosoft.devices%2Fiothub-device-provisioning%2fazuredeploy.json)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/iothub-device-provisioning/).

> [!NOTE]
> Currently there is no ARM template support for creating enrollments with new DPS resources. This is a common and understood request that is being considered for implementation.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.devices/iothub-device-provisioning/azuredeploy.json":::

Two Azure resources are defined in the previous template:

* [**Microsoft.Devices/IotHubs**](/azure/templates/microsoft.devices/iothubs): Creates a new Azure IoT hub.
* [**Microsoft.Devices/provisioningServices**](/azure/templates/microsoft.devices/provisioningservices): Creates a new Azure IoT Hub Device Provisioning Service with the new IoT hub already linked to it.

## Deploy the template

#### Deploy with the Portal

1. Select the following image to sign in to Azure and open the template for deployment. The template creates a new Iot hub and DPS resource. The new IoT hub is linked to the DPS resource.

    [![Deploy to Azure in Portal Steps](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2Fquickstarts%2Fmicrosoft.devices%2Fiothub-device-provisioning%2fazuredeploy.json)

2. Select or enter the following values and select **Review + Create**.

    ![ARM template deployment parameters on the portal](./media/quick-setup-auto-provision-rm/arm-template-deployment-parameters-portal.png)    

    Unless otherwise specified for the following fields, use the default value to create the Iot Hub and DPS resource.

    | Field | Description |
    | :---- | :---------- |
    | **Subscription** | Select your Azure subscription. |
    | **Resource group** | Select **Create new**, and enter a unique name for the resource group, and then select **OK**. |
    | **Region** | Select a region for your resources. For example, **East US**.  For resiliency and reliability, we recommend deploying to one of the regions that support [Availability Zones](iot-dps-ha-dr.md). |
    | **Iot Hub Name** | Enter a name for the IoT Hub that must be globally unique within the *.azure-devices.net* namespace. You need the hub name in the next section when you validate the deployment. |
    | **Provisioning Service Name** | Enter a name for the new Device Provisioning Service (DPS) resource. The name must be globally unique within the *.azure-devices-provisioning.net* namespace. You need the DPS name in the next section when you validate the deployment. |

3. On the next screen, read the terms. If you agree to all terms, select **Create**. 

    The deployment takes a few moments to complete. 

    In addition to the Azure portal, you can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md).


#### Deploy with the Azure CLI

Using the Azure CLI requires version 2.6 or later. If you're running the Azure CLI locally, verify your version by running: `az --version`

Sign in to your Azure account and select your subscription.

1. If you're running the Azure CLI locally instead of running it in the portal, you need to sign in. To sign in at the command prompt, run the [login command](/cli/azure/get-started-with-az-cli2):
    
    ```azurecli
    az login
    ```

    Follow the instructions to authenticate using the code and sign in to your Azure account through a web browser.

2. If you have multiple Azure subscriptions, signing in to Azure grants you access to all the Azure accounts associated with your credentials. Use the following [command to list the Azure accounts](/cli/azure/account) available for you to use:
    
    ```azurecli
    az account list -o table
    ```

    Use the following command to select subscription that you want to use to run the commands to create your IoT hub and DPS resources. You can use either the subscription name or ID from the output of the previous command:

    ```azurecli
    az account set --subscription {your subscription name or id}
    ```

3. Copy and paste the following commands into your CLI prompt. Then execute the commands by selecting the Enter key.
   
    > [!TIP]
    > The commands prompt for a resource group location. 
    > You can view a list of available locations by first running the command:
    >
    > `az account list-locations -o table`
    >
    >
    
    ```azurecli-interactive
    read -p "Enter a project name that is used for generating resource names:" projectName &&
    read -p "Enter the location (i.e. centralus):" location &&
    templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devices/iothub-device-provisioning/azuredeploy.json" &&
    resourceGroupName="${projectName}rg" &&
    az group create --name $resourceGroupName --location "$location" &&
    az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri &&
    echo "Press [ENTER] to continue ..." &&
    read
    ```

4. The commands prompt you for the following information. Provide each value and select the Enter key.

    | Parameter | Description |
    | :-------- | :---------- |
    | **Project name** | The value of this parameter is used to create a resource group to hold all resources. The string `rg` is added to the end of the value for your resource group name. |
    | **location** | This value is the region where all resources are created. |
    | **iotHubName** | Enter a name for the IoT Hub that must be globally unique within the *.azure-devices.net* namespace. You need the hub name in the next section when you validate the deployment. |
    | **provisioningServiceName** | Enter a name for the new Device Provisioning Service (DPS) resource. The name must be globally unique within the *.azure-devices-provisioning.net* namespace. You need the DPS name in the next section when you validate the deployment. |

    The Azure CLI is used to deploy the template. In addition to the Azure CLI, you can also use the Azure PowerShell, Azure portal, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md).


## Review deployed resources

1. To verify the deployment, run the following [command to list resources](/cli/azure/resource#az-resource-list) and look for the new provisioning service and IoT hub in the output:

    ```azurecli
     az resource list -g "${projectName}rg"
    ```

2. To verify that the hub is already linked to the DPS resource, run the following [DPS extension show command](/cli/azure/iot/dps#az-iot-dps-show).

    ```azurecli
     az iot dps show --name <Your provisioningServiceName>
    ```

    Notice the hubs that are linked on the `iotHubs` member.

## Clean up resources

Other quickstarts in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts or with the tutorials, don't clean up the resources created in this quickstart. If you don't plan to continue, you can use the Azure portal or Azure CLI to delete the resource group and all of its resources.

To delete a resource group and all its resources from the Azure portal, just open the resource group and select **Delete resource group** and the top.

To delete the resource group deployed using the Azure CLI:

```azurecli
az group delete --name "${projectName}rg"
```

You can also delete resource groups and individual resources using any of the following options:

- Azure portal
- PowerShell
- REST APIs
- Supported platform SDKs published for Azure Resource Manager or IoT Hub Device Provisioning Service

## Next steps

In this quickstart, you deployed an IoT hub and a Device Provisioning Service instance, and linked the two resources. To learn how to use this setup to provision a device, continue to the quickstart for creating a device.

> [!div class="nextstepaction"]
> [Quickstart: Provision a simulated symmetric key device](./quick-create-simulated-device-symm-key.md)
