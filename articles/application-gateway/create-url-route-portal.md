---
title: Tutorial - Create an application gateway with URL path-based routing rules - Azure portal
description: In this tutorial, you learn how to create URL path-based routing rules for an application gateway and virtual machine scale set using the Azure portal.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: tutorial
ms.date: 4/18/2019
ms.author: victorh
#Customer intent: As an IT administrator, I want to use the Azure portal to set up an application gateway so I can route my app traffic based on path-based routing rules.
---

# Tutorial: Create an application gateway with path-based routing rules using the Azure portal

You can use the Azure portal to configure [URL path-based routing rules](url-route-overview.md) when you create an [application gateway](overview.md). In this tutorial, you create backend pools using virtual machines. You then create routing rules that make sure web traffic arrives at the appropriate servers in the pools.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an application gateway
> * Create virtual machines for backend servers
> * Create backend pools with the backend servers
> * Create a backend listener
> * Create a path-based routing rule

![URL routing example](./media/create-url-route-portal/scenario.png)

If you prefer, you can complete this tutorial using [Azure CLI](tutorial-url-route-cli.md) or [Azure PowerShell](tutorial-url-route-powershell.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create an application gateway

A virtual network is needed for communication between the resources you create. Two subnets are created in this example: one for the application gateway, and the other for the backend servers. You can create a virtual network at the same time you create the application gateway.

1. Select **New** found on the upper left-hand corner of the Azure portal.
2. Select **Networking** and then select **Application Gateway** in the Featured list.
3. Enter these values for the application gateway:

   - *myAppGateway* - for the name of the application gateway.
   - *myResourceGroupAG* - for the new resource group.

     ![Create new application gateway](./media/create-url-route-portal/application-gateway-create.png)

4. Accept the default values for the other settings and then select **OK**.
5. Select **Choose a virtual network**, select **Create new**, and then enter these values for the virtual network:

   - *myVNet* - for the name of the virtual network.
   - *10.0.0.0/16* - for the virtual network address space.
   - *myAGSubnet* - for the subnet name.
   - *10.0.0.0/24* - for the subnet address space.

     ![Create virtual network](./media/create-url-route-portal/application-gateway-vnet.png)

6. Select **OK** to create the virtual network and subnet.
7. Select **Choose a public IP address**, select **Create new**, and then enter the name of the public IP address. In this example, the public IP address is named *myAGPublicIPAddress*. Accept the default values for the other settings and then select **OK**.
8. Accept the default values for the Listener configuration, leave the Web application firewall disabled, and then select **OK**.
9. Review the settings on the summary page, and then select **OK** to create the network resources and the application gateway. It may take several minutes for the application gateway to be created, wait until
   the deployment finishes successfully before moving on to the next section.

### Add a subnet

1. Select **All resources** in the left-hand menu, and then select **myVNet** from the resources list.
2. Select **Subnets**, and then select **Subnet**.

    ![Create subnet](./media/create-url-route-portal/application-gateway-subnet.png)

3. Enter *myBackendSubnet* for the name of the subnet and then select **OK**.

## Create virtual machines

In this example, you create three virtual machines to be used as backend servers for the application gateway. You also install IIS on the virtual machines to verify the application gateway was successfully created.

1. Select **New**.
2. Select **Compute** and then select **Windows Server 2016 Datacenter** in the Featured list.
3. Enter these values for the virtual machine:

    - *myVM1* - for the name of the virtual machine.
    - *azureuser* - for the administrator user name.
    - *Azure123456!* for the password.
    - Select **Use existing**, and then select *myResourceGroupAG*.

4. Select **OK**.
5. Select **DS1_V2** for the size of the virtual machine, and select **Select**.
6. Make sure that **myVNet** is selected for the virtual network and the subnet is **myBackendSubnet**. 
7. Select **Disabled** to disable boot diagnostics.
8. Select **OK**, review the settings on the summary page, and then select **Create**.

### Install IIS

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

1. Open the interactive shell and make sure it's set to **PowerShell**.

    ![Install custom extension](./media/create-url-route-portal/application-gateway-extension.png)

2. Run the following command to install IIS on the virtual machine: 

    ```azurepowershell-interactive
    $publicSettings = @{ "fileUris" = (,"https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/application-gateway/iis/appgatewayurl.ps1");  "commandToExecute" = "powershell -ExecutionPolicy Unrestricted -File appgatewayurl.ps1" }
    Set-AzVMExtension `
      -ResourceGroupName myResourceGroupAG `
      -Location eastus `
      -ExtensionName IIS `
      -VMName myVM1 `
      -Publisher Microsoft.Compute `
      -ExtensionType CustomScriptExtension `
      -TypeHandlerVersion 1.4 `
      -Settings $publicSettings
    ```

3. Create two more virtual machines and install IIS using the steps that you just finished. Enter the names of *myVM2* and *myVM3* for the names and for the values of VMName in Set-AzVMExtension.

## Create backend pools with the virtual machines

1. Select **All resources** and then select **myAppGateway**.
2. Select **Backend pools**. A default pool was automatically created with the application gateway. Select **appGatewayBackendPool**.
3. Select **Add target** to add *myVM1* to appGatewayBackendPool.

    ![Add backend servers](./media/create-url-route-portal/application-gateway-backend.png)

4. Select **Save**.
5. Select **Backend pools** and then select **Add**.
6. Enter a name of *imagesBackendPool* and add *myVM2* using **Add target**.
7. Select **OK**.
8. Select **Add** again to add another backend pool with a name of *videoBackendPool* and add *myVM3* to it.

## Create a backend listener

1. Select **Listeners** and the select **Basic**.
2. Enter *myBackendListener* for the name, *myFrontendPort* for the name of the frontend port, and then *8080* as the port for the listener.
3. Select **OK**.

## Create a path-based routing rule

1. Select **Rules** and then select **Path-based**.
2. Enter *rule2* for the name.
3. Enter *Images* for the name of the first path. Enter */images/*\* for the path. Select **imagesBackendPool** for the backend pool.
4. Enter *Video* for the name of the second path. Enter */video/*\* for the path. Select **videoBackendPool** for the backend pool.

    ![Create a path-based rule](./media/create-url-route-portal/application-gateway-route-rule.png)

5. Select **OK**.

## Test the application gateway

1. Select **All resources**, and then select **myAGPublicIPAddress**.

    ![Record application gateway public IP address](./media/create-url-route-portal/application-gateway-record-ag-address.png)

2. Copy the public IP address, and then paste it into the address bar of your browser. Such as, http://40.121.222.19.

    ![Test base URL in application gateway](./media/create-url-route-portal/application-gateway-iistest.png)

3. Change the URL to http://&lt;ip-address&gt;:8080/images/test.htm, replacing &lt;ip-address&gt; with your IP address, and you should see something like the following example:

    ![Test images URL in application gateway](./media/create-url-route-portal/application-gateway-iistest-images.png)

4. Change the URL to http://&lt;ip-address&gt;:8080/video/test.htm, replacing &lt;ip-address&gt; with your IP address, and you should see something like the following example:

    ![Test video URL in application gateway](./media/create-url-route-portal/application-gateway-iistest-video.png)

## Clean up resources

When you no longer need the resources that you created with the application gateway, remove the resource group. By removing the resource group, you also remove the application gateway and all its related resources. 

To remove the resource group:

1. On the left menu of the Azure portal, select **Resource groups**.
2. On the **Resource groups** page, search for **myResourceGroupAG** in the list, then select it.
3. On the **Resource group page**, select **Delete resource group**.
4. Enter *myResourceGroupAG* for **TYPE THE RESOURCE GROUP NAME** and then select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about what you can do with Azure Application Gateway](application-gateway-introduction.md)
