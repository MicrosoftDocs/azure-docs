---
title: Create an application gateway with a web application firewall - Azure portal | Microsoft Docs
description: Learn how to create an application gateway with a web application firewall by using the Azure portal.
services: application-gateway
author: vhorne
manager: jpconnock
editor: tysonn
tags: azure-resource-manager

ms.service: application-gateway
ms.topic: article
ms.workload: infrastructure-services
ms.date: 01/26/2018
ms.author: victorh

---

# Create an application gateway with a web application firewall using the Azure portal

You can use the Azure portal to create an [application gateway](application-gateway-introduction.md) with a [web application firewall](application-gateway-web-application-firewall-overview.md) (WAF). The WAF uses [OWASP](https://www.owasp.org/index.php/Category:OWASP_ModSecurity_Core_Rule_Set_Project) rules to protect your application. These rules include protection against attacks such as SQL injection, cross-site scripting attacks, and session hijacks.

In this article, you learn how to:

> [!div class="checklist"]
> * Create an application gateway with WAF enabled
> * Create the virtual machines used as backend servers
> * Create a storage account and configure diagnostics

![Web application firewall example](./media/application-gateway-web-application-firewall-portal/scenario-waf.png)

## Log in to Azure

Log in to the Azure portal at [http://portal.azure.com](http://portal.azure.com)

## Create an application gateway

A virtual network is needed for communication between the resources that you create. Two subnets are created in this example: one for the application gateway, and the other for the backend servers. You can create a virtual network at the same time that you create the application gateway.

1. Click **New** found on the upper left-hand corner of the Azure portal.
2. Select **Networking** and then select **Application Gateway** in the Featured list.
3. Enter these values for the application gateway:

    - *myAppGateway* - for the name of the application gateway.
    - *myResourceGroupAG* - for the new resource group.
    - Select *WAF* for the tier of the application gateway.

    ![Create new application gateway](./media/application-gateway-web-application-firewall-portal/application-gateway-create.png)

4. Accept the default values for the other settings and then click **OK**.
5. Click **Choose a virtual network**, click **Create new**, and then enter these values for the virtual network:

    - *myVNet* - for the name of the virtual network.
    - *10.0.0.0/16* - for the virtual network address space.
    - *myAGSubnet* - for the subnet name.
    - *10.0.0.0/24* - for the subnet address space.

    ![Create virtual network](./media/application-gateway-web-application-firewall-portal/application-gateway-vnet.png)

6. Click **OK** to create the virtual network and subnet.
7. Click **Choose a public IP address**, click **Create new**, and then enter the name of the public IP address. In this example, the public IP address is named *myAGPublicIPAddress*. Accept the default values for the other settings and then click **OK**.
8. Accept the default values for the Listener configuration, leave the Web application firewall disabled, and then click **OK**.
9. Review the settings on the summary page, and then click **OK** to create network resources and the application gateway. It may take several minutes for the application gateway to be created, wait until
the deployment finishes successfully before moving on to the next section.

### Add a subnet

1. Click **All resources** in the left-hand menu, and then click **myVNet** from the resources list.
2. Click **Subnets**, and then click **Subnet**.

    ![Create subnet](./media/application-gateway-web-application-firewall-portal/application-gateway-subnet.png)

3. Enter *myBackendSubnet* for the name of the subnet and then click **OK**.

## Create backend servers

In this example, you create two virtual machines to be used as backend servers for the application gateway. You also install IIS on the virtual machines to verify that the application gateway was successfully created.

### Create a virtual machine

1. Click **New**.
2. Click **Compute** and then select **Windows Server 2016 Datacenter** in the Featured list.
3. Enter these values for the virtual machine:

    - *myVM* - for the name of the virtual machine.
    - *azureuser* - for the administrator user name.
    - *Azure123456!* for the password.
    - Select **Use existing**, and then select *myResourceGroupAG*.

4. Click **OK**.
5. Select **DS1_V2** for the size of the virtual machine, and click **Select**.
6. Make sure that **myVNet** is selected for the virtual network and the subnet is **myBackendSubnet**. 
7. Click **Disabled** to disable boot diagnostics.
8. Click **OK**, review the settings on the summary page, and then click **Create**.

### Install IIS

1. Open the interactive shell and make sure that it is set to **PowerShell**.

    ![Install custom extension](./media/application-gateway-web-application-firewall-portal/application-gateway-extension.png)

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

1. Click **All resources**, and then click **myAppGateway**.
2. Click **Backend pools**. A default pool was automatically created with the application gateway. Click **appGateayBackendPool**.
3. Click **Add target** to add each virtual machine that you created to the backend pool.

    ![Add backend servers](./media/application-gateway-web-application-firewall-portal/application-gateway-backend.png)

4. Click **Save**.

## Create a storage account and configure diagnostics

## Create a storage account

In this tutorial, the application gateway uses a storage account to store data for detection and prevention purposes. You could also use Log Analytics or Event Hub to record data.

1. Click **New** found on the upper left-hand corner of the Azure portal.
2. Select **Storage**, and then select **Storage account - blob, file, table, queue**.
3. Enter the name of the storage account, select **Use existing** for the resource group, and then select **myResourceGroupAG**. In this example, the storage account name is *myagstore1*. Accept the default values for the other settings and then click **Create**.

## Configure diagnostics

Configure diagnostics to record data into the ApplicationGatewayAccessLog, ApplicationGatewayPerformanceLog, and ApplicationGatewayFirewallLog logs.

1. In the left-hand menu, click **All resources**, and then select *myAppGateway*.
2. Under Monitoring, click **Diagnostics logs**.
3. Click **Add diagnostics setting**.
4. Enter *myDiagnosticsSettings* as the name for the diagnostics settings.
5. Select **Archive to a storage account**, and then click **Configure** to select the *myagstore1* storage account that you previously created.
6. Select the application gateway logs to collect and retain.
7. Click **Save**.

    ![Configure diagnostics](./media/application-gateway-web-application-firewall-portal/application-gateway-diagnostics.png)

## Test the application gateway

1. Find the public IP address for the application gateway on the Overview screen. Click **All resources** and then click **myAGPublicIPAddress**.

    ![Record application gateway public IP address](./media/application-gateway-web-application-firewall-portal/application-gateway-record-ag-address.png)

2. Copy the public IP address, and then paste it into the address bar of your browser.

    ![Test application gateway](./media/application-gateway-web-application-firewall-portal/application-gateway-iistest.png)

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Create an application gateway with WAF enabled
> * Create the virtual machines used as backend servers
> * Create a storage account and configure diagnostics

To learn more about application gateways and their associated resources, continue to the how-to articles.