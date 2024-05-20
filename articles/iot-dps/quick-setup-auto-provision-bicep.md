---
title: Quickstart - Create an Azure IoT Hub Device Provisioning Service (DPS) using Bicep
description: Azure quickstart - Learn how to create an Azure IoT Hub Device Provisioning Service (DPS) using Bicep.
ms.author: jgao
ms.date: 08/17/2022
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps
author: mumian
ms.custom: mvc, subject-bicepqs, devx-track-azurepowershell, devx-track-bicep, devx-track-azurecli
---

# Quickstart: Set up the IoT Hub Device Provisioning Service (DPS) with Bicep

You can use a [Bicep](../azure-resource-manager/bicep/overview.md) file to programmatically set up the Azure cloud resources necessary for provisioning your devices. These steps show how to create an IoT hub and a new IoT Hub Device Provisioning Service instance with a Bicep file. The IoT Hub is also linked to the DPS resource using the Bicep file. This linking allows the DPS resource to assign devices to the hub based on allocation policies you configure.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

This quickstart uses [Azure PowerShell](../azure-resource-manager/bicep/deploy-powershell.md), and the [Azure CLI](../azure-resource-manager/bicep/deploy-cli.md) to perform the programmatic steps necessary to create a resource group and deploy the Bicep file, but you can easily use .NET, Ruby, or other programming languages to perform these steps and deploy your Bicep file.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

[!INCLUDE [azure-powershell-requirements-no-header.md](../../includes/azure-powershell-requirements-no-header.md)]

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/iothub-device-provisioning/).

> [!NOTE]
> Currently there is no Bicep file support for creating enrollments with new DPS resources. This is a common and understood request that is being considered for implementation.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.devices/iothub-device-provisioning/main.bicep":::

Two Azure resources are defined in the Bicep file above:

* [**Microsoft.Devices/iothubs**](/azure/templates/microsoft.devices/iothubs): Creates a new Azure IoT Hub.
* [**Microsoft.Devices/provisioningservices**](/azure/templates/microsoft.devices/provisioningservices): Creates a new Azure IoT Hub Device Provisioning Service with the new IoT Hub already linked to it.

Save a copy of the Bicep file locally as **main.bicep**.

## Deploy the Bicep file

Sign in to your Azure account and select your subscription.

1. Sign in to Azure at the command prompt:

    # [CLI](#tab/CLI)

    ```azurecli
    az login
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    Connect-AzAccount
    ```

    ---

    Follow the instructions to authenticate using the code and sign in to your Azure account through a web browser.

1. If you have multiple Azure subscriptions, signing in to Azure grants you access to all the Azure accounts associated with your credentials.

    # [CLI](#tab/CLI)

    ```azurecli
    az account list -o table
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    Get-AzSubscription
    ```

    ---

    Use the following command to select the subscription that you want to use to run the commands to create your IoT hub and DPS resources. You can use either the subscription name or ID from the output of the previous command:

    # [CLI](#tab/CLI)

    ```azurecli
    az account set --subscription {your subscription name or id}
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    Set-AzContext -Subscription {your subscription name or id}
    ```

    ---

1. Deploy the Bicep file with the following commands.

    > [!TIP]
    > The commands will prompt for a resource group location.
    > You can view a list of available locations by first running the command:
    >
    >  # [CLI](#tab/CLI)
    >
    > `az account list-locations -o table`
    >
    >  # [PowerShell](#tab/PowerShell)
    >
    > Get-AzLocation
    >
    > ---

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters iotHubName={IoT-Hub-name} provisioningServiceName={DPS-name}
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -iotHubName "{IoT-Hub-name}" -provisioningServiceName "{DPS-name}"
    ```

    ---

    Replace **{IoT-Hub-name}** with a globally unique IoT Hub name, replace **{DPS-name}** with a globally unique Device Provisioning Service (DPS) resource name.

    It takes a few moments to create the resources.

## Review deployed resources

1. To verify the deployment, run the following command and look for the new provisioning service and IoT hub in the output:

    # [CLI](#tab/CLI)

    ```azurecli
     az resource list -g exampleRg
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    Get-AzResource -ResourceGroupName exampleRG
    ```

2. To verify that the hub is already linked to the DPS resource, run the following command.

    # [CLI](#tab/CLI)

    ```azurecli
    az iot dps show --name <Your provisioningServiceName>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    Get-AzIoTDeviceProvisioningService -ResourceGroupName exampleRG -Name "{DPS-name}"
    ```

    Notice the hubs that are linked on the `iotHubs` member.

## Clean up resources

Other quickstarts in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts or with the tutorials, don't clean up the resources created in this quickstart. If you don't plan to continue, you can use Azure PowerShell or Azure CLI to delete the resource group and all of its resources.

To delete a resource group and all its resources from the Azure portal, just open the resource group and select **Delete resource group** and the top.

To delete the resource group deployed:

# [CLI](#tab/CLI)

```azurecli
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -name exampleRG
```

---
You can also delete resource groups and individual resources using the Azure portal, PowerShell, or REST APIs, or with supported platform SDKs.

## Next steps

In this quickstart, you deployed an IoT hub and a Device Provisioning Service instance, and linked the two resources. To learn how to use this setup to provision a device, continue to the quickstart for creating a device.

> [!div class="nextstepaction"]
> [Quickstart: Provision a simulated symmetric key device](./quick-create-simulated-device-symm-key.md)
