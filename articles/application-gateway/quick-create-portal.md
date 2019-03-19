---
title: Quickstart - Direct web traffic with Azure Application Gateway - Azure portal | Microsoft Docs
description: Learn how use the Azure portal to create an Azure Application Gateway that directs web traffic to virtual machines in a backend pool.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: quickstart
ms.date: 1/8/2019
ms.author: victorh
ms.custom: mvc
---
# Quickstart: Direct web traffic with Azure Application Gateway - Azure portal

This quickstart shows you how to use the Azure portal to create an application gateway.  After creating the application gateway, you test it to make sure it's working correctly. With Azure Application Gateway, you direct your application web traffic to specific resources by assigning listeners to ports, creating rules, and adding resources to a backend pool. For the sake of simplicity, this article uses a simple setup with a public front-end IP, a basic listener to host a single site on this application gateway, two virtual machines used for the backend pool, and a basic request routing rule.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create an application gateway

For Azure to communicate between the resources that you create, it needs a virtual network. You can either create a new virtual network or use an existing one. In this example, we will create a new virtual network. You can create a virtual network at the same time that you create the application gateway. Application Gateway instances are created in separate subnets. You create two subnets in this example: one for the application gateway, and another for the backend servers.

1. Select **Create a resource** on the left menu of the Azure portal. The **New** window appears.

2. Select **Networking** and then select **Application Gateway** in the **Featured** list.

### Basics page

1. On the **Basics** page, enter these values for the following application gateway settings:

   - **Name**: Enter *myAppGateway* for the name of the application gateway.
   - **Resource group**: Select **myResourceGroupAG** for the resource group. If it doesn't exist, select **Create new** to create it.

     ![Create new application gateway](./media/application-gateway-create-gateway-portal/application-gateway-create.png)

2. Accept the default values for the other settings and then select **OK**.

### Settings page

1. On the **Settings** page, under **Subnet configuration**, select **Choose a virtual network**. <br>

2. On the **Choose virtual network** page, select **Create new**, and then enter values for the following virtual network settings:

   - **Name**: Enter *myVNet* for the name of the virtual network.

   - **Address space**: Enter *10.0.0.0/16* for the virtual network address space.

   - **Subnet name**: Enter *myAGSubnet* for the subnet name.<br>The application gateway subnet can contain only application gateways. No other resources are allowed.

   - **Subnet address range**: Enter *10.0.0.0/24* for the subnet address range.

     ![Create virtual network](./media/application-gateway-create-gateway-portal/application-gateway-vnet.png)

3. Select **OK** to return to the **Settings** page.

4. Choose the **Frontend IP configuration**. Under **Frontend IP configuration**, verify **IP address type** is set to **Public**. Under **Public IP address**, verify **Create new** is selected. <br>You can configure the Frontend IP to be Public or Private as per your use case. In this example, we will choose a Public Frontend IP. 

5. Enter *myAGPublicIPAddress* for the public IP address name. 

6. Accept the default values for the other settings and then select **OK**.<br>We will choose default values in this article for simplicity but you can configure custom values for the other settings depending on your use case 

### Summary page

Review the settings on the **Summary** page, and then select **OK** to create the virtual network, the public IP address, and the application gateway. It may take several minutes for Azure to create the application gateway. Wait until the deployment finishes successfully before moving on to the next section.

## Add backend pool

The backend pool is used to route requests to the backend servers which will be serving the request. Backend pools can be composed of NICs, virtual machine scale sets, public IPs, internal IPs, fully qualified domain names (FQDN), and multi-tenant back-ends like Azure App Service. You need to add your backend targets to a backend pool.

In this example, we will use virtual machines as the target backend. We can either use existing virtual machines or create new ones. In this example, we will create two virtual machines that Azure uses as backend servers for the application gateway. To do this, we will:

1. Create a new subnet, *myBackendSubnet*, in which the new VMs will be created. 
2. Create 2 new VMS, *myVM* and *myVM2*, to be used as backend servers.
3. Install IIS on the virtual machines to verify that the application gateway was created successfully.
4. Add the backend servers to the backend pool.

### Add a subnet

Add a subnet to the virtual network you created by following these steps:

1. Select **All resources** on the left menu of the Azure portal, enter *myVNet* in the search box, and then select **myVNet** from the search results.

2. Select **Subnets** from the left menu and then select **+ Subnet**. 

   ![Create subnet](./media/application-gateway-create-gateway-portal/application-gateway-subnet.png)

3. From the **Add subnet** page, enter *myBackendSubnet* for the **Name** of the subnet, and then select **OK**.

### Create a virtual machine

1. On the Azure portal, select **Create a resource**. The **New** window appears.
2. Select **Compute** and then select **Windows Server 2016 Datacenter** in the **Featured** list. The **Create a virtual machine** page appears.<br>Application Gateway can route traffic to any type of virtual machine used in its backend pool. In this example, you use a Windows Server 2016 Datacenter.
3. Enter these values in the **Basics** tab for the following virtual machine settings:

    - **Resource group**: Select **myResourceGroupAG** for the resource group name.
    - **Virtual machine name**: Enter *myVM* for the name of the virtual machine.
    - **Username**: Enter *azureuser* for the administrator user name.
    - **Password**: Enter *Azure123456!* for the administrator password.
4. Accept the other defaults and then select **Next: Disks**.  
5. Accept the **Disks** tab defaults and then select **Next: Networking**.
6. On the **Networking** tab, verify that **myVNet** is selected for the **Virtual network** and the **Subnet** is set to **myBackendSubnet**. Accept the other defaults and then select **Next: Management**.<br>Application Gateway can communicate with instances outside of the virtual network that it is in, but we need to ensure there is IP connectivity. 
7. On the **Management** tab, set **Boot diagnostics** to **Off**. Accept the other defaults and then select **Review + create**.
8. On the **Review + create** tab, review the settings, correct any validation errors, and then select **Create**.
9. Wait for the virtual machine creation to complete before continuing.

### Install IIS for testing

In this example, we are installing IIS on the virtual machines only for the purpose of verifying Azure created the application gateway successfully. 

1. Open [Azure PowerShell](https://docs.microsoft.com/azure/cloud-shell/quickstart-powershell). To do so, select **Cloud Shell** from the top navigation bar of the Azure portal and then select **PowerShell** from the drop-down list. 

    ![Install custom extension](./media/application-gateway-create-gateway-portal/application-gateway-extension.png)

2. Run the following command to install IIS on the virtual machine: 

    ```azurepowershell-interactive
    Set-AzureRmVMExtension `
      -ResourceGroupName myResourceGroupAG `
      -ExtensionName IIS `
      -VMName myVM `
      -Publisher Microsoft.Compute `
      -ExtensionType CustomScriptExtension `
      -TypeHandlerVersion 1.4 `
      -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}' `
      -Location EastUS
    ```

3. Create a second virtual machine and install IIS by using the steps that you previously completed. Use *myVM2* for the virtual machine name and for the **VMName** setting of the **Set-AzureRmVMExtension** cmdlet.

### Add backend servers to backend pool

1. Select **All resources**, and then select **myAppGateway**.

2. Select **Backend pools** from the left menu. Azure automatically created a default pool, **appGatewayBackendPool**, when you created the application gateway. 

3. Select **appGatewayBackendPool**.

4. Under **Targets**, select **Virtual machine** from the drop-down list.

5. Under **VIRTUAL MACHINE** and **NETWORK INTERFACES**, select the **myVM** and **myVM2** virtual machines and their associated network interfaces from the drop-down lists.

    ![Add backend servers](./media/application-gateway-create-gateway-portal/application-gateway-backend.png)

6. Select **Save**.

## Test the application gateway

Although IIS isn't required to create the application gateway, you installed it in this quickstart to verify whether Azure successfully created the application gateway. Use IIS to test the application gateway:

1. Find the public IP address for the application gateway on its **Overview** page.![Record application gateway public IP address](./media/application-gateway-create-gateway-portal/application-gateway-record-ag-address.png)Alternatively, you can select **All resources**, enter *myAGPublicIPAddress* in the search box, and then select it in the search results. Azure displays the public IP address on the **Overview** page.
2. Copy the public IP address, and then paste it into the address bar of your browser.
3. Check the response. A valid response verifies that the application gateway was successfully created and it is able to successfully connect with the backend.![Test application gateway](./media/application-gateway-create-gateway-portal/application-gateway-iistest.png)


## Clean up resources

When you no longer need the resources that you created with the application gateway, remove the resource group. By removing the resource group, you also remove the application gateway and all its related resources. 

To remove the resource group:
1. On the left menu of the Azure portal, select **Resource groups**.
2. On the **Resource groups** page, search for **myResourceGroupAG** in the list, then select it.
3. On the **Resource group page**, select **Delete resource group**.
4. Enter *myResourceGroupAG* for **TYPE THE RESOURCE GROUP NAME** and then select **Delete**

## Next steps

> [!div class="nextstepaction"]
> [Manage web traffic with an application gateway using the Azure CLI](./tutorial-manage-web-traffic-cli.md)
