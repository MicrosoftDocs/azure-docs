---
title: 'Quickstart - Create a private endpoint by using an ARM template'
description: In this quickstart, you use an Azure Resource Manager template (ARM template) to create a private endpoint.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.custom: subject-armqs, devx-track-azurepowershell
ms.date: 05/26/2020
ms.author: allensu
---

# Quickstart: Create a private endpoint by using an ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to create a private endpoint.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

You can also complete this quickstart by using the [Azure portal](create-private-endpoint-portal.md), [Azure PowerShell](create-private-endpoint-powershell.md), or the [Azure CLI](create-private-endpoint-cli.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.sql%2Fprivate-endpoint-sql%2Fazuredeploy.json)

## Prerequisites

You need an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the template

This template creates a private endpoint for an instance of Azure SQL Database.

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/private-endpoint-sql/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.sql/private-endpoint-sql/azuredeploy.json":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Sql/servers**](/azure/templates/microsoft.sql/servers): The instance of SQL Database with the sample database.
- [**Microsoft.Sql/servers/databases**](/azure/templates/microsoft.sql/servers/databases): The sample database.
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks): The virtual network where the private endpoint is deployed.
- [**Microsoft.Network/privateEndpoints**](/azure/templates/microsoft.network/privateendpoints): The private endpoint to access the instance of SQL Database.
- [**Microsoft.Network/privateDnsZones**](/azure/templates/microsoft.network/privatednszones): The zone used to resolve the private endpoint IP address.
- [**Microsoft.Network/privateDnsZones/virtualNetworkLinks**](/azure/templates/microsoft.network/privatednszones/virtualnetworklinks)
- [**Microsoft.Network/privateEndpoints/privateDnsZoneGroups**](/azure/templates/microsoft.network/privateendpoints/privateDnsZoneGroups): The zone group used to associate the private endpoint with a private DNS zone.
- [**Microsoft.Network/publicIpAddresses**](/azure/templates/microsoft.network/publicIpAddresses): The public IP address used to access the virtual machine.
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces): The network interface for the virtual machine.
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines): The virtual machine used to test the private connection with private endpoint to the instance of SQL Database.

## Deploy the template

Here's how to deploy the ARM template to Azure:

1. To sign in to Azure and open the template, select **Deploy to Azure**. The template creates the private endpoint, the instance of SQL Database, the network infrastructure, and a virtual machine to validate.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.sql%2Fprivate-endpoint-sql%2Fazuredeploy.json)

2. Select or create your resource group.
3. Type the SQL Administrator sign-in and password.
4. Type the virtual machine administrator username and password.
5. Read the terms and conditions statement. If you agree, select **I agree to the terms and conditions stated above** > **Purchase**. The deployment can take 20 minutes or longer to complete.

## Validate the deployment

> [!NOTE]
> The ARM template generates a unique name for the virtual machine myVm<b>{uniqueid}</b> resource, and for the SQL Database sqlserver<b>{uniqueid}</b> resource. Substitute your generated value for **{uniqueid}**.

### Connect to a VM from the internet

Connect to the VM _myVm{uniqueid}_ from the internet as follows:

1. In the portal's search bar, enter _myVm{uniqueid}_.

2. Select **Connect**. **Connect to virtual machine** opens.

3. Select **Download RDP File**. Azure creates a Remote Desktop Protocol (_.rdp_) file and downloads it to your computer.

4. Open the downloaded .rdp file.

   a. If prompted, select **Connect**.

   b. Enter the username and password you specified when you created the VM.

      > [!NOTE]
      > You might need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

5. Select **OK**.

6. You might receive a certificate warning during the sign-in process. If you receive a certificate warning, select **Yes** or **Continue**.

7. After the VM desktop appears, minimize it to go back to your local desktop.

### Access the SQL Database server privately from the VM

Here's how to connect to the SQL Database server from the VM by using the private endpoint.

1.  In the Remote Desktop of _myVM{uniqueid}_, open PowerShell.
2.  Enter the following: nslookup sqlserver{uniqueid}.database.windows.net. 
    You'll receive a message similar to this:

    ```
      Server:  UnKnown
      Address:  168.63.129.16
      Non-authoritative answer:
      Name:    sqlserver.privatelink.database.windows.net
      Address:  10.0.0.5
      Aliases:  sqlserver.database.windows.net
    ```

3.  Install SQL Server Management Studio.
4.  In **Connect to server**, enter or select this information:
    - **Server type**: Select **Database Engine**.
    - **Server name**: Select **sqlserver{uniqueid}.database.windows.net**.
    - **Username**: Enter a username provided during creation.
    - **Password**: Enter a password provided during creation.
    - **Remember password**: Select **Yes**.

5.  Select **Connect**.
6.  From the menu on the left, go to **Databases**.
7.  Optionally, you can create or query information from _sample-db_.
8.  Close the Remote Desktop connection to _myVm{uniqueid}_.

## Clean up resources

When you no longer need the resources that you created with the private endpoint, delete the resource group. This removes the private endpoint and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

For more information on the services that support a private endpoint, see:
> [!div class="nextstepaction"]
> [Private Link availability](private-link-overview.md#availability)
