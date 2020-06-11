---
title: Azure Private Endpoint ARM template
description: Learn about Azure Private Link
services: private-link
author: mblanco77
ms.service: private-link
ms.topic: quickstart
ms.custom: subject-armqs
ms.date: 05/26/2020
ms.author: allensu
---

# Quickstart: Create a private endpoint - Resource Manager template

In this quickstart, you use a Resource Manager template to create an private endpoint.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

You can also complete this quickstart using the [Azure portal](create-private-endpoint-portal.md), [Azure PowerShell](create-private-endpoint-powershell.md), or [Azure CLI](create-private-endpoint-cli.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create an private endpoint

this template creates a private endpoint for an Azure SQL server.

### Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-private-endpoint-sql/).

:::code language="json" source="~/quickstart-templates/101-private-endpoint-sql/azuredeploy.json" range="001-295" highlight="131-156":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Sql/servers**](/azure/templates/microsoft.sql/servers) : Azure Sql server with the sample database
- [**Microsoft.Sql/servers/databases**](/azure/templates/microsoft.sql/servers/databases) : Sample database
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks) : Virtual Network where the Private Endpoint is deployed
- [**Microsoft.Network/privateEndpoints**](/azure/templates/microsoft.network/privateendpoints) : private endpoint to access privately the Azure Sql server
- [**Microsoft.Network/privateDnsZones**](/azure/templates/microsoft.network/privatednszones) : used to resolve the private endpoint IP address
- [**Microsoft.Network/privateDnsZones/virtualNetworkLinks**](/azure/templates/microsoft.network/privatednszones/virtualnetworklinks)
- [**Microsoft.Network/privateEndpoints/privateDnsZoneGroups**](/azure/templates/microsoft.network/privateendpoints/privateDnsZoneGroups) : To associate private endpoint with a Private Dns zone
- [**Microsoft.Network/publicIpAddresses**](/azure/templates/microsoft.network/publicIpAddresses) : Public IP address to access the virtual machine
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces) : Network Interface for the virtual machine
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines) : Virtual machine to test the private connection with Private Endpoint to the Azure Sql server

### Deploy the template

Deploy Resource Manager template to Azure:

1. Select **Deploy to Azure** to sign in to Azure and open the template. The template creates the private endpoint, Azure SQL server, the network infrastructure, and a virtual machines to validate.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-private-endpoint-sql%2Fazuredeploy.json)

2. Select or create your resource group,
3. Type the Sql Administrator login and password
4. Type the virtual machine administrator username and password.
5. Select **I agree to the terms and conditions stated above** and then select **Purchase**. The deployment can take 20 minutes or longer to complete.

## Validate the deployment

> [!NOTE]
> The ARM template generates unique name for the Virtual Machine myVm<b>{uniqueid}</b> resource and for the Azure SQL server sqlserver<b>{uniqueid}</b> resource, please replace <b>{uniqueid}</b> with your generated value.

### Connect to a VM from the internet

Connect to the VM _myVm{uniqueid}_ from the internet as follows:

1. In the portal's search bar, enter _myVm{uniqueid}_.

2. Select the **Connect** button. After selecting the **Connect** button, **Connect to virtual machine** opens.

3. Select **Download RDP File**. Azure creates a Remote Desktop Protocol (_.rdp_) file and downloads it to your computer.

4. Open the downloaded.rdp\* file.

   a. If prompted, select **Connect**.

   b. Enter the username and password you specified when creating the VM.

      > [!NOTE]
      > You may need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

5. Select **OK**.

6. You may receive a certificate warning during the sign-in process. If you receive a certificate warning, select **Yes** or **Continue**.

7. Once the VM desktop appears, minimize it to go back to your local desktop.

### Access SQL Database Server privately from the VM

In this section, you will connect to the SQL Database Server from the VM using the Private Endpoint.

1.  In the Remote Desktop of _myVM{uniqueid}_, open PowerShell.
2.  Enter nslookup sqlserver{uniqueid}.database.windows.net 
    You'll receive a message similar to this:

    ```
      Server:  UnKnown
      Address:  168.63.129.16
      Non-authoritative answer:
      Name:    sqlserver.privatelink.database.windows.net
      Address:  10.0.0.5
      Aliases:  sqlserver.database.windows.net
    ```

3.  Install SQL Server Management Studio
4.  In Connect to server, enter or select this information:
    Server type: Select Database Engine.
    Server name: Select sqlserver{uniqueid}.database.windows.net
    Username: Enter a username provided during creation.
    Password: Enter a password provided during creation.
    Remember password: Select Yes.

5.  Select **Connect**.
6.  Browse **Databases** from left menu.
7.  (Optionally) Create or query information from _sample-db_
8.  Close the remote desktop connection to _myVm{uniqueid}_.

## Clean up resources

When you no longer need the resources that you created with the private endpoint, delete the resource group. This removes the private endpoint and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

- Learn more about [Azure Private Link](private-link-overview.md)
