---
title: Quickstart - Direct web traffic with Azure Application Gateway - Azure portal | Microsoft Docs
description: Learn how use the Azure portal to create an Azure Application Gateway that directs web traffic to virtual machines in a backend pool.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: quickstart
ms.date: 12/17/2018
ms.author: victorh
ms.custom: mvc
---
# Quickstart: Direct web traffic with Azure Application Gateway - Azure portal

This quickstart shows you how to use the Azure portal to quickly create the application gateway with two virtual machines in its backend pool. You then test it to make sure it's working correctly. With Azure Application Gateway, you direct your application web traffic to specific resources by: assigning listeners to ports, creating rules, and adding resources to a backend pool.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create an application gateway

A virtual network is needed for communication between the resources that you create. Two subnets are created in this example: one for the application gateway, and another for the backend servers. You can create a virtual network at the same time that you create the application gateway.

1. Select **Create a resource** on the left menu of the Azure portal.
2. Select **Networking** and then select **Application Gateway** in the **Featured** list.

### Basics

1. On the **Basics** page, enter these values for the following application gateway settings:

    - **Name**: Enter *myAppGateway* for the name of the application gateway.
    - **Resource group**: Enter *myResourceGroupAG* for the new resource group.

    ![Create new application gateway](./media/application-gateway-create-gateway-portal/application-gateway-create.png)

2. Accept the default values for the other settings and then select **OK**.

### Settings

1. On the **Settings** page, select **Choose a virtual network**, select **Create new**, and then enter values for the following virtual network settings:

    - **Name**: Enter *myVNet* for the name of the virtual network.

    - **Address space**: Enter *10.0.0.0/16* for the virtual network address space.

    - **Subnet name**: Enter *myAGSubnet* for the subnet name.

    - **Subnet address range**: Enter *10.0.0.0/24* for the subnet address range.

    ![Create virtual network](./media/application-gateway-create-gateway-portal/application-gateway-vnet.png)

2. Select **OK** to return to the **Settings** page.

3. Under **Frontend IP configuration**, make sure **IP address type** is set to **Public**. Under **Public IP address**, make sure **Create new** is selected. 

4. Enter *myAGPublicIPAddress* for the public IP address name. 

5. Accept the default values for the other settings and then select **OK**.

### Summary

Review the settings on the **Summary** page, and then select **OK** to create the virtual network, the public IP address, and the application gateway. It may take several minutes for the application gateway to be created. Wait until the deployment finishes successfully before moving on to the next section.

## Add a subnet

1. Select **All resources** on the left menu of the Azure portal and then enter *myVNet* in the search box (the name of the virtual network you just created).
2. Select **Subnets** and then select **+ Subnet**. 

    ![Create subnet](./media/application-gateway-create-gateway-portal/application-gateway-subnet.png)

3. From the **Add subnet** page, enter *myBackendSubnet* for the **Name** of the subnet and then select **OK**.

## Create backend servers

In this example, you create two virtual machines that Azure uses as backend servers for the application gateway. You also install IIS on the virtual machines to verify the application gateway was successfully created.

### Create a virtual machine

1. On the Azure portal, select **Create a resource**.

2. Select **Compute** and then select **Windows Server 2016 Datacenter** in the **Featured** list.

3. Enter these values for the virtual machine:

    - *myResourceGroupAG* for the resource group.
    - *myVM* - for the name of the virtual machine.
    - *azureuser* - for the administrator user name.
    - *Azure123456!* for the password.

   Accept the other defaults and select **Next: Disks**.

4. Accept the disk defaults and select **Next: Networking**.

5. Make sure that **myVNet** is selected for the virtual network and the subnet is **myBackendSubnet**.

6. Accept the other defaults and then select **Next: Management**.

7. Select **Off** to disable boot diagnostics. Accept the other defaults and then select **Review + create**.

8. Review the settings on the summary page, and then select **Create**.

9. Wait for the virtual machine creation to complete before continuing.

### Install IIS

1. Open the interactive shell and make sure that it's set to **PowerShell**.

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

3. Create a second virtual machine and install IIS using the steps that you just finished. Enter *myVM2* for its name and for VMName in Set-AzureRmVMExtension.

### Add backend servers

1. Select **All resources**, and then select **myAppGateway**.

2. Select **Backend pools**. A default pool was automatically created with the application gateway. 

3. Select **appGatewayBackendPool**.

4. Under **Targets**, select **IP address or FQDN** select **Virtual machine**.

5. Under **Virtual Machine**, add myVM and myVM2 virtual machines and their associated network interfaces.

    ![Add backend servers](./media/application-gateway-create-gateway-portal/application-gateway-backend.png)

6. Select **Save**.

## Test the application gateway

1. Find the public IP address for the application gateway on the Overview screen. Select **All resources** and then select **myAGPublicIPAddress**.

    ![Record application gateway public IP address](./media/application-gateway-create-gateway-portal/application-gateway-record-ag-address.png)

2. Copy the public IP address, and then paste it into the address bar of your browser.

    ![Test application gateway](./media/application-gateway-create-gateway-portal/application-gateway-iistest.png)

## Clean up resources

When you no longer need the resources that you created with the application gateway, remove the resource group. By removing the resource group, you also remove the application gateway and all its related resources.
To remove the resource group, select it and then select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Manage web traffic with an application gateway using the Azure CLI](./tutorial-manage-web-traffic-cli.md)
