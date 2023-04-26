---
title: 'Quickstart: Create a private link service - Bicep'
titleSuffix: Azure Private Link
description: In this quickstart, you use Bicep to create a private link service.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 04/29/2022
ms.author: allensu
ms.custom: subject-armqs, mode-arm, template-quickstart, devx-track-bicep
---

# Quickstart: Create a private link service using Bicep

In this quickstart, you use Bicep to create a private link service.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

You need an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the Bicep file

This Bicep file creates a private link service.

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/privatelink-service/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/privatelink-service/main.bicep":::

Multiple Azure resources are defined in the Bicep file:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks): There's one virtual network for each virtual machine.
- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadBalancers): The load balancer that exposes the virtual machines that host the service.
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces): There are two network interfaces, one for each virtual machine.
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines): There are two virtual machines, one that hosts the service and one that tests the connection to the private endpoint.
- [**Microsoft.Compute/virtualMachines/extensions**](/azure/templates/Microsoft.Compute/virtualMachines/extensions): The extension that installs a web server.
- [**Microsoft.Network/privateLinkServices**](/azure/templates/microsoft.network/privateLinkServices): The private link service to expose the service.
- [**Microsoft.Network/publicIpAddresses**](/azure/templates/microsoft.network/publicIpAddresses): There is a public IP address for the test virtual machine.
- [**Microsoft.Network/privateendpoints**](/azure/templates/microsoft.network/privateendpoints): The private endpoint to access the service.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters vmAdminUsername=<admin-user>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -vmAdminUsername "<admin-user>"
    ```

    ---

    > [!NOTE]
    > Replace **\<admin-user\>** with the username for the virtual machine. You'll also be prompted to enter **vmAdminPassword**. The password must be at least 12 characters long and have uppercase and lowercase characters, a digit, and a special character.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Validate the deployment

> [!NOTE]
> The Bicep file generates a unique name for the virtual machine myConsumerVm<b>{uniqueid}</b> resource. Substitute your generated value for **{uniqueid}**.

### Connect to a VM from the internet

Connect to the VM _myConsumerVm{uniqueid}_ from the internet as follows:

1.  In the Azure portal search bar, enter _myConsumerVm{uniqueid}_.

2.  Select **Connect**. **Connect to virtual machine** opens.

3.  Select **Download RDP File**. Azure creates a Remote Desktop Protocol (_.rdp_) file and downloads it to your computer.

4.  Open the downloaded .rdp file.

    a. If prompted, select **Connect**.

    b. Enter the username and password you specified when you created the VM.

    > [!NOTE]
    > You might need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

5.  Select **OK**.

6.  You might receive a certificate warning during the sign-in process. If you receive a certificate warning, select **Yes** or **Continue**.

7.  After the VM desktop appears, minimize it to go back to your local desktop.

### Access the http service privately from the VM

Here's how to connect to the http service from the VM by using the private endpoint.

1.  Go to the Remote Desktop of _myConsumerVm{uniqueid}_.
2.  Open a browser, and enter the private endpoint address: `http://10.0.0.5/`.
3.  The default IIS page appears.

## Clean up resources

When you no longer need the resources that you created with the private link service, delete the resource group. This removes the private link service and all the related resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

For more information on the services that support a private endpoint, see:
> [!div class="nextstepaction"]
> [Private Link availability](private-link-overview.md#availability)
