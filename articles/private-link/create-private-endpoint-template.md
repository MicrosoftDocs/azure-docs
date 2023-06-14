---
title: 'Quickstart: Create a private endpoint - ARM template'
description: In this quickstart, you'll learn how to create a private endpoint using an Azure Resource Manager template (ARM template).
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 07/18/2022
ms.author: allensu
ms.custom: subject-armqs, mode-arm, template-quickstart, devx-track-arm-template
#Customer intent: As someone who has a basic network background but is new to Azure, I want to create a private endpoint by using an ARM template.
---

# Quickstart: Create a private endpoint by using an ARM template

In this quickstart, you'll use an Azure Resource Manager template (ARM template) to create a private endpoint.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

You can also create a private endpoint by using the [Azure portal](create-private-endpoint-portal.md), [Azure PowerShell](create-private-endpoint-powershell.md), or the [Azure CLI](create-private-endpoint-cli.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button here. The ARM template will open in the Azure portal.

[![The 'Deploy to Azure' button.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.sql%2Fprivate-endpoint-sql%2Fazuredeploy.json)

## Prerequisites

You need an Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the template

This template creates a private endpoint for an instance of Azure SQL Database.

The template that this quickstart uses is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/private-endpoint-sql/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.sql/private-endpoint-sql/azuredeploy.json":::

The template defines multiple Azure resources:

- [**Microsoft.Sql/servers**](/azure/templates/microsoft.sql/servers): The instance of SQL Database with the sample database.
- [**Microsoft.Sql/servers/databases**](/azure/templates/microsoft.sql/servers/databases): The sample database.
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks): The virtual network where the private endpoint is deployed.
- [**Microsoft.Network/privateEndpoints**](/azure/templates/microsoft.network/privateendpoints): The private endpoint that you use to access the instance of SQL Database.
- [**Microsoft.Network/privateDnsZones**](/azure/templates/microsoft.network/privatednszones): The zone that you use to resolve the private endpoint IP address.
- [**Microsoft.Network/privateDnsZones/virtualNetworkLinks**](/azure/templates/microsoft.network/privatednszones/virtualnetworklinks)
- [**Microsoft.Network/privateEndpoints/privateDnsZoneGroups**](/azure/templates/microsoft.network/privateendpoints/privateDnsZoneGroups): The zone group that you use to associate the private endpoint with a private DNS zone.
- [**Microsoft.Network/publicIpAddresses**](/azure/templates/microsoft.network/publicIpAddresses): The public IP address that you use to access the virtual machine.
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces): The network interface for the virtual machine.
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines): The virtual machine that you use to test the connection of the private endpoint to the instance of SQL Database.

## Deploy the template

Deploy the ARM template to Azure by doing the following:

1. Sign in to Azure and open the ARM template by selecting the **Deploy to Azure** button here. The template creates the private endpoint, the instance of SQL Database, the network infrastructure, and a virtual machine to be validated.

   [![The 'Deploy to Azure' button.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.sql%2Fprivate-endpoint-sql%2Fazuredeploy.json)

1. Select your resource group or create a new one.
1. Enter the SQL administrator sign-in name and password.
1. Enter the virtual machine administrator username and password.
1. Read the terms and conditions statement. If you agree, select **I agree to the terms and conditions stated above**, and then select **Purchase**. The deployment can take 20 minutes or longer to complete.

## Validate the deployment

> [!NOTE]
> The ARM template generates a unique name for the virtual machine myVm<b>{uniqueid}</b> resource, and for the SQL Database sqlserver<b>{uniqueid}</b> resource. Substitute your generated value for **{uniqueid}**.

### Connect to a VM from the internet

Connect to the VM _myVm{uniqueid}_ from the internet by doing the following:

1. In the portal's search bar, enter _myVm{uniqueid}_.

1. Select **Connect**. **Connect to virtual machine** opens.

1. Select **Download RDP File**. Azure creates a Remote Desktop Protocol (RDP) file and downloads it to your computer.

1. Open the downloaded RDP file.

   a. If you're prompted, select **Connect**.  
   b. Enter the username and password that you specified when you created the VM.

      > [!NOTE]
      > You might need to select **More choices** > **Use a different account** to specify the credentials you entered when you created the VM.

1. Select **OK**.

   You might receive a certificate warning during the sign-in process. If you do, select **Yes** or **Continue**.

1. After the VM desktop appears, minimize it to go back to your local desktop.

### Access the SQL Database server privately from the VM

To connect to the SQL Database server from the VM by using the private endpoint, do the following:

1.  On the Remote Desktop of _myVM{uniqueid}_, open PowerShell.
1.  Run the following command: 

    `nslookup sqlserver{uniqueid}.database.windows.net` 

    You'll receive a message that's similar to this one:

    ```
      Server:  UnKnown
      Address:  168.63.129.16
      Non-authoritative answer:
      Name:    sqlserver.privatelink.database.windows.net
      Address:  10.0.0.5
      Aliases:  sqlserver.database.windows.net
    ```

1.  Install SQL Server Management Studio.

1.  On the **Connect to server** pane, do the following:
    - For **Server type**, select **Database Engine**.
    - For **Server name**, select **sqlserver{uniqueid}.database.windows.net**.
    - For **Username**, enter the username that was provided earlier.
    - For **Password**, enter the password that was provided earlier.
    - For **Remember password**, select **Yes**.

1. Select **Connect**.
1. On the left pane, select **Databases**. Optionally, you can create or query information from _sample-db_.
1. Close the Remote Desktop connection to _myVm{uniqueid}_.

## Clean up resources

When you no longer need the resources that you created with the private endpoint, delete the resource group. Doing so removes the private endpoint and all the related resources.

To delete the resource group, run the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

For more information about the services that support private endpoints, see:
> [!div class="nextstepaction"]
> [What is Azure Private Link?](private-link-overview.md#availability)
