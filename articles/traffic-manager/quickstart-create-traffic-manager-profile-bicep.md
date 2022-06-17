---
title: 'Quickstart: Create a Traffic Manager Bicep'
description: This quickstart article describes how to create an Azure Traffic Manager profile by using Bicep.
services: traffic-manager
author: schaffererin
ms.author: v-eschaffer
ms.date: 06/17/2022
ms.topic: quickstart
ms.service: traffic-manager
ms.custom: devx-track-azurepowershell, subject-armqs, mode-arm
---

# Quickstart: Create a Traffic Manager profile using Bicep

This quickstart describes how to use Bicep to create a Traffic Manager profile with external endpoints using the performance routing method.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/traffic-manager-external-endpoint).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/traffic-manager-external-endpoint/main.bicep":::

One Azure resource is defined in the Bicep file:

* [**Microsoft.Network/trafficManagerProfiles**](/azure/templates/microsoft.network/trafficmanagerprofiles)

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters uniqueDnsName=<dns-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -uniqueDnsName "<dns-name>"
    ```

    ---

    The Bicep file deployment creates a profile with two external endpoints. **Endpoint1** uses a target endpoint of `www.microsoft.com` with the location in **North Europe**. **Endpoint2** uses a target endpoint of `docs.microsoft.com` with the location in **South Central US**.

    > [!NOTE]
    > **uniqueDNSname** needs to be a globally unique name in order for the Bicep file to deploy successfully.

   When the deployment finishes, you'll see a message indicating the deployment succeeded.

## Validate the deployment

1. Determine the DNS name of the Traffic Manager profile using [Get-AzTrafficManagerProfile](/powershell/module/az.trafficmanager/get-aztrafficmanagerprofile).

    ```azurepowershell-interactive
    Get-AzTrafficManagerProfile -Name ExternalEndpointExample -ResourceGroupName $resourceGroupName | Select RelativeDnsName
    ```

    Copy the **RelativeDnsName** value. The DNS name of your Traffic Manager profile is `<relativednsname>.trafficmanager.net`.

1. From a local PowerShell run the following command by replacing the **{relativeDNSname}** variable with `<relativednsname>.trafficmanager.net`.

    ```powershell
    Resolve-DnsName -Name {relativeDNSname} | Select-Object NameHost | Select -First 1
    ```

    You should get a NameHost of either `www.microsoft.com` or `docs.microsoft.com` depending on which region is closer to you.

1. To check if you can resolve to the other endpoint, disable the endpoint for the target you got in the last step. Replace the **{endpointName}** with either **endpoint1** or **endpoint2** to disable the target for `www.microsoft.com` or `docs.microsoft.com` respectively.

    ```azurepowershell-interactive
    Disable-AzTrafficManagerEndpoint -Name {endpointName} -Type ExternalEndpoints -ProfileName ExternalEndpointExample -ResourceGroupName $resourceGroupName -Force
    ```

1. Run the command from Step 2 again in a local PowerShell. This time you should get the other NameHost for the other endpoint.

## Clean up resources

When you no longer need the Traffic Manager profile, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group. This removes the Traffic Manager profile and all the related resources.

# [CLI](#tab/CLI)

```azurecli
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```powershell
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you created a Traffic Manager profile using Bicep.

To learn more about routing traffic, continue to the Traffic Manager tutorials.

> [!div class="nextstepaction"]
> [Traffic Manager tutorials](tutorial-traffic-manager-improve-website-response.md)
