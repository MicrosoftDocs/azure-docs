---
title: Quickstart - Direct web traffic with Azure Application Gateway - Azure portal | Microsoft Docs
description: Learn how to use the Azure portal to create an Azure Application Gateway that directs web traffic to virtual machines in a backend pool.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: quickstart
ms.date: 5/7/2019
ms.author: victorh
ms.custom: mvc
---

# Quickstart: Direct web traffic with Azure Application Gateway - Azure portal

This quickstart shows you how to use the Azure portal to create an application gateway.  After creating the application gateway, you test it to make sure it's working correctly. With Azure Application Gateway, you direct your application web traffic to specific resources by assigning listeners to ports, creating rules, and adding resources to a backend pool. For the sake of simplicity, this article uses a simple setup with a public front-end IP, a basic listener to host a single site on this application gateway, two virtual machines used for the backend pool, and a basic request routing rule.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create an application gateway

1. Select **Create a resource** on the left menu of the Azure portal. The **New** window appears.

2. Select **Networking** and then select **Application Gateway** in the **Featured** list.

### Basics tab

1. On the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose **Create new** to create a new resource group. Type *myResourceGroupAG* for the name.
2. Under **Instance details**, enter *myAppGateway* for the **Application gateway name**.
     ![Create new application gateway - Basics](./media/application-gateway-create-gateway-portal/application-gateway-create-basics.png)

3. Under **Configure virtual network**, choose **Create new** to create a new virtual network and add two subnets. One subnet will contain the application gateway and one subnet will contain the backend servers. In the **Create virtual network** window that opens, enter the following values for the new virtual network:
    - **Name**: Enter *myVNet* for the name of the virtual network.
    - **Subnet name** (application gateway subnet): The virtual network will display a subnet named *Default* by default. Change the name of this subnet by typing *myAGSubnet*. <br>The application gateway subnet can contain only application gateways. No other resources are allowed.
    - **Subnet name** (backend server subnet): In the **Subnets** grid, below the row that displays your application gateway subnet, create a new subnet by typing *myBackendSubnet* in the **Subnet name** column.
    - **Subnet address range** (backend server subnet): In the row that contains *myBackendSubnet*, enter an address range that doesn't overlap with the address range of the application gateway subnet. For example, if the application gateway subnet has an address range of 10.0.0.0/24, enter *10.0.1.0/24* for the address range of the backend subnet. 
Select **OK** to save the new virtual network changes and return to the **Basics** tab.
     ![Create new application gateway - Create virtual network](./media/application-gateway-create-gateway-portal/application-gateway-create-vnet.png)

4. Accept the default values for the other settings and then select **Next: Frontends**.

### Frontends tab
1. Create a public IP address to use as the frontend of the application gateway. On the **Frontends** tab, verify **Frontend IP address type** is set to **Public**. Choose **Create new** to create a new public IP address. <br> You can configure the Frontend IP to be Public or Private as per your use case. In this example, you'll choose a Public Frontend IP.
   > [!NOTE]
   > For the Application Gateway v2 SKU, you can only choose **Public** frontend IP configuration. Private frontend IP configuration is currently not enabled for the v2 SKU.

2. Enter *myAGPublicIPAddress* for the public IP address name and then select **OK**. 

     ![Create new application gateway - Frontends](./media/application-gateway-create-gateway-portal/application-gateway-create-frontends.png)

3. Select **Next: Backends**.

### Backends tab

The backend pool is used to route requests to the backend servers that serve the request. In this example, you'll add an empty backend pool to your application gateway and populate it with virtual machines later. You can also choose to create backend servers before creating the application gateway.
1. On the **Backends** tab, select **+Add a backend pool**.
2. On the **Add a backend pool** window that opens, enter the following values:

    -**Name**: Enter *myBackendPool* as the name of this backend pool. 

    -**Add backend pool without targets**: Choose **Yes** to create an empty backend pool that doesn't yet contain targets. You'll add virtual machines to the backend pool later in this example.
3. Select **Add** to save the backend pool and return to the **Backends** tab.
4. On the **Backends** tab, select **Next: Configuration**.

     ![Create new application gateway - Backends](./media/application-gateway-create-gateway-portal/application-gateway-create-backends.png)

### Configuration tab
You've created a frontend and a backend for the application gateway. On the **Configuration** tab, you'll connect the frontend and backend with a routing rule. The routing rule allows traffic from the frontend to flow to the backend.
1. On the **Configuration** tab, select **Add a rule**. A window called **Add a routing rule** will open. On this window, you'll configure the listener, HTTP setting, and backend targets for this routing rule.
2. Enter *myRoutingRule* for the **Rule name**.
3. Configure the listener that will be used with this routing rule by entering the following values:

    -**Listener name**: Enter *myListener* for the name of this listener.

    -**Frontend IP**: In the dropdown, select **Public** to choose the public IP you created earlier in this example.

     ![Create new application gateway - Listener](./media/application-gateway-create-gateway-portal/application-gateway-create-rule-listener.png)

    Accept the default values for the other listener settings, and select the **Backend targets** tab to configure the rest of the routing rule settings.
4. Enter the following values to configure the routing rule behavior and backend targets:

   -**Backend target**: In the dropdown, select *myBackendPool* to configure this routing rule to send traffic by default to the backend pool you created.

   -**HTTP setting**: Choose **Create new** to create a new HTTP setting that will determine the behavior of the routing rule. In the window that opens, called **Add an HTTP setting**, enter *myHTTPsetting* for the name of the HTTP setting. Accept the default values for the other settings and select **Add** to return to the routing rule configuration.

     ![Create new application gateway - HTTP Setting](./media/application-gateway-create-gateway-portal/application-gateway-create-http-setting.png)

5. In the **Add a routing rule** window, select **Add** to save the routing rule configuration and return to the **Configuration** tab. From the **Configuration** tab, select **Next: Tags** followed by **Next: Review + create**.

     ![Create new application gateway - Routing rule](./media/application-gateway-create-gateway-portal/application-gateway-create-rule.png)

### Review + create tab

Review the settings on the **Review + create** tab, and then select **Create** to create the virtual network, the public IP address, and the application gateway. It may take several minutes for Azure to create the application gateway. Wait until the deployment finishes successfully before moving on to the next section.

## Add servers to the backend pool

Backend pools can be composed of NICs, virtual machine scale sets, public IPs, internal IPs, fully qualified domain names (FQDN), and multi-tenant back-ends like Azure App Service. You'll add your backend targets to a backend pool.

In this example, you'll use virtual machines as the target backend. You can either use existing virtual machines or create new ones. You'll create two virtual machines that Azure uses as backend servers for the application gateway.

To do this, you'll:

1. Create two new VMs, *myVM* and *myVM2*, to be used as backend servers.
2. Install IIS on the virtual machines to verify that the application gateway was created successfully.
3. Add the backend servers to the backend pool.


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
6. On the **Networking** tab, verify that **myVNet** is selected for the **Virtual network** and the **Subnet** is set to **myBackendSubnet**. Accept the other defaults and then select **Next: Management**.<br>Application Gateway can communicate with instances outside of the virtual network that it is in, but you need to ensure there's IP connectivity.
7. On the **Management** tab, set **Boot diagnostics** to **Off**. Accept the other defaults and then select **Review + create**.
8. On the **Review + create** tab, review the settings, correct any validation errors, and then select **Create**.
9. Wait for the virtual machine creation to complete before continuing.

### Install IIS for testing

In this example, you install IIS on the virtual machines only to verify Azure created the application gateway successfully.

1. Open [Azure PowerShell](https://docs.microsoft.com/azure/cloud-shell/quickstart-powershell). To do so, select **Cloud Shell** from the top navigation bar of the Azure portal and then select **PowerShell** from the drop-down list. 

    ![Install custom extension](./media/application-gateway-create-gateway-portal/application-gateway-extension.png)

2. Run the following command to install IIS on the virtual machine: 

    ```azurepowershell-interactive
    Set-AzVMExtension `
      -ResourceGroupName myResourceGroupAG `
      -ExtensionName IIS `
      -VMName myVM `
      -Publisher Microsoft.Compute `
      -ExtensionType CustomScriptExtension `
      -TypeHandlerVersion 1.4 `
      -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}' `
      -Location EastUS
    ```

3. Create a second virtual machine and install IIS by using the steps that you previously completed. Use *myVM2* for the virtual machine name and for the **VMName** setting of the **Set-AzVMExtension** cmdlet.

### Add backend servers to backend pool

1. Select **All resources**, and then select **myAppGateway**.

2. Select **Backend pools** from the left menu.  

3. Select **myBackendPool**.

4. Under **Targets**, select **Virtual machine** from the drop-down list.

5. Under **VIRTUAL MACHINE** and **NETWORK INTERFACES**, select the **myVM** and **myVM2** virtual machines and their associated network interfaces from the drop-down lists.

    ![Add backend servers](./media/application-gateway-create-gateway-portal/application-gateway-backend.png)

6. Select **Save**.

## Test the application gateway

Although IIS isn't required to create the application gateway, you installed it in this quickstart to verify whether Azure successfully created the application gateway. Use IIS to test the application gateway:

1. Find the public IP address for the application gateway on its **Overview** page.![Record application gateway public IP address](./media/application-gateway-create-gateway-portal/application-gateway-record-ag-address.png) Or, you can select **All resources**, enter *myAGPublicIPAddress* in the search box, and then select it in the search results. Azure displays the public IP address on the **Overview** page.
2. Copy the public IP address, and then paste it into the address bar of your browser.
3. Check the response. A valid response verifies that the application gateway was successfully created and can successfully connect with the backend.![Test application gateway](./media/application-gateway-create-gateway-portal/application-gateway-iistest.png)

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
