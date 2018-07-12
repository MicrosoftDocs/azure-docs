---
title: Quickstart - Direct web traffic with Azure Application Gateway - Azure portal | Microsoft Docs
description: Learn how use the Azure portal to create an Azure Application Gateway that directs web traffic to virtual machines in a backend pool.
services: application-gateway
author: vhorne
manager: jpconnock
editor: ''
tags: azure-resource-manager

ms.service: application-gateway
ms.topic: quickstart
ms.workload: infrastructure-services
ms.date: 02/14/2018
ms.author: victorh
ms.custom: mvc
---
# Quickstart: Direct web traffic with Azure Application Gateway - Azure portal

With Azure Application Gateway, you can direct your application web traffic to specific resources by assigning listeners to ports, creating rules, and adding resources to a backend pool.

This quickstart shows you how to use the Azure portal to quickly create the application gateway with two virtual machines in its backend pool. You then test it to make sure it's working correctly.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure

Log in to the Azure portal at [http://portal.azure.com](http://portal.azure.com)

## Create an application gateway

You need to create a virtual network for the application gateway to be able to communicate with other resources. You can create a virtual network at the same time that you create the application gateway. Two subnets are created in this example: one for the application gateway, and the other for the virtual machines. 

1. Click **Create a resource** found on the upper left-hand corner of the Azure portal.
2. Select **Networking** and then select **Application Gateway** in the Featured list.
3. Enter these values for the application gateway:

    - *myAppGateway* - for the name of the application gateway.
    - *myResourceGroupAG* - for the new resource group.

    ![Create new application gateway](./media/quick-create-portal/application-gateway-create.png)

4. Accept the default values for the other settings and then click **OK**.
5. Click **Choose a virtual network** > **Create new**, and then enter these values for the virtual network:

    - *myVNet* - for the name of the virtual network.
    - *10.0.0.0/16* - for the virtual network address space.
    - *myAGSubnet* - for the subnet name.
    - *10.0.0.0/24* - for the subnet address space.

    ![Create virtual network](./media/quick-create-portal/application-gateway-vnet.png)

6. Click **OK** to create the virtual network and subnet.
6. Click **Choose a public IP address** > **Create new**, and then enter the name of the public IP address. In this example, the public IP address is named *myAGPublicIPAddress*. Accept the default values for the other settings and then click **OK**.
8. Accept the default values for the listener configuration, leave the web application firewall disabled, and then click **OK**.
9. Review the settings on the summary page, and then click **OK** to create the virtual network, the public IP address, and the application gateway. It may take up to 30 minutes for the application gateway to be created, wait until the deployment finishes successfully before moving on to the next section.

### Add a subnet

1. Click **All resources** in the left-hand menu, and then click **myVNet** from the resources list.
2. Click **Subnets** > **Subnet**.

    ![Create subnet](./media/quick-create-portal/application-gateway-subnet.png)

3. Enter *myBackendSubnet* for the name of the subnet and then click **OK**.

## Create backend servers

In this example, you create two virtual machines to be used as backend servers for the application gateway. 

### Create a virtual machine

1. Click **New**.
2. Select **Compute** and then select **Windows Server 2016 Datacenter** in the Featured list.
3. Enter these values for the virtual machine:

    - *myVM* - for the name of the virtual machine.
    - *azureuser* - for the administrator user name.
    - *Azure123456!* for the password.
    - Select **Use existing**, and then select *myResourceGroupAG*.

4. Click **OK**.
5. Select **DS1_V2** for the size of the virtual machine and then click **Select**.
6. Make sure that **myVNet** is selected for the virtual network and the subnet is **myBackendSubnet**. 
7. Click **Disabled** to disable boot diagnostics.
8. Click **OK**, review the settings on the summary page, and then click **Create**.

### Install IIS

You install IIS on the virtual machines to verify that the application gateway was successfully created.

1. Open the interactive shell and make sure that it is set to **PowerShell**.

    ![Install custom extension](./media/quick-create-portal/application-gateway-extension.png)

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

3. Create a second virtual machine and install IIS using the steps that you just finished. Enter *myVM2* for its name and for VMName in Set-AzureRmVMExtension.

### Add backend servers

After you create the virtual machines, you need to add them to the backend pool in the application gateway.

1. Click **All resources** > **myAppGateway**.
2. Click **Backend pools**. A default pool was automatically created with the application gateway. Click **appGatewayBackendPool**.
3. Click **Add target** > **Virtual machine**, and then select *myVM*. Select **Add target** > **Virtual machine**, and then select *myVM2*.

    ![Add backend servers](./media/quick-create-portal/application-gateway-backend.png)

4. Click **Save**.

## Test the application gateway

Installing IIS is not required to create the application gateway, but you installed it in this quickstart to verify whether the application gateway was successfully created.

1. Find the public IP address for the application gateway on the Overview screen. Click **All resources** > **myAGPublicIPAddress**.

    ![Record application gateway public IP address](./media/quick-create-portal/application-gateway-record-ag-address.png)

2. Copy the public IP address, and then paste it into the address bar of your browser.

    ![Test application gateway](./media/quick-create-portal/application-gateway-iistest.png)

When you refresh the browser, you should see the name of the other VM appear.

## Clean up resources

First explore the resources that were created with the application gateway, and then when no longer needed, you can delete the resource group, application gateway, and all related resources. To do so, select the resource group that contains the application gateway and click **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Manage web traffic with an application gateway using the Azure CLI](./tutorial-manage-web-traffic-cli.md)
