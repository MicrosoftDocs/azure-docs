---
title: Configure an internal load balancer (ILB) endpoint
titleSuffix: Azure Application Gateway
description: This article provides information on how to configure Application Gateway with a private frontend IP address
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 04/16/2020
ms.author: victorh
---

# Configure an application gateway with an internal load balancer (ILB) endpoint

Azure Application Gateway can be configured with an Internet-facing VIP or with an internal endpoint that isn't exposed to the Internet. An internal endpoint uses a private IP address for the frontend, which is also known as an *internal load balancer (ILB) endpoint*.

Configuring the gateway using a frontend private IP address is useful for internal line-of-business applications that aren't exposed to the Internet. It's also useful for services and tiers within a multi-tier application that are in a security boundary that isn't exposed to the Internet but still require round-robin load distribution, session stickiness, or Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), termination.

This article guides you through the steps to configure an application gateway with a frontend private IP address using the Azure portal.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Sign in to Azure

Sign in to the Azure portal at <https://portal.azure.com>

## Create an application gateway

For Azure to communicate between the resources that you create, it needs a virtual network. You can either create a new virtual network or use an existing one. In this example, you create a new virtual network. You can create a virtual network at the same time that you create the application gateway. Application Gateway instances are created in separate subnets. You create two subnets in this example: one for the application gateway, and another for the backend servers.

1. Expand the portal menu and select **Create a resource**.
2. Select **Networking** and then select **Application Gateway** in the Featured list.
3. Enter *myAppGateway* for the name of the application gateway and *myResourceGroupAG* for the new resource group.
4. For **Region**, select **(US) Central US**.
5. For **Tier**, select **Standard**.
6. Under **Configure virtual network** select **Create new**, and then enter these values for the virtual network:
   - *myVNet* - for the name of the virtual network.
   - *10.0.0.0/16* - for the virtual network address space.
   - *myAGSubnet* - for the subnet name.
   - *10.0.0.0/24* - for the subnet address space.
   - *myBackendSubnet* - for the backend subnet name.
   - *10.0.1.0/24* - for the backend subnet address space.

    ![Create virtual network](./media/configure-application-gateway-with-private-frontend-ip/private-frontendip-1.png)

6. Select **OK** to create the virtual network and subnet.
7. Select **Next:Frontends**.
8. For **Frontend IP address type**, select **Private**.

   By default, it's a dynamic IP address assignment. The first available address of the configured subnet is assigned as the frontend IP address.
   > [!NOTE]
   > Once allocated, the IP address type (static or dynamic) cannot be changed later.
9. Select **Next:Backends**.
10. Select **Add a backend pool**.
11. For **Name**, type *appGatewayBackendPool*.
12. For **Add backend pool without targets**, select **Yes**. You'll add the targets later.
13. Select **Add**.
14. Select **Next:Configuration**.
15. Under **Routing rules**, select **Add a rule**.
16. For **Rule name**, type *Rrule-01*.
17. For **Listener name**, type *Listener-01*.
18. For **Frontend IP**, select **Private**.
19. Accept the remaining defaults and select the **Backend targets** tab.
20. For **Target type**, select **Backend pool**, and then select **appGatewayBackendPool**.
21. For **HTTP setting**, select **Create new**.
22. For **HTTP setting name**, type *http-setting-01*.
23. For **Backend protocol**, select **HTTP**.
24. For **Backend port**, type *80*.
25. Accept the remaining defaults, and select **Add**.
26. On the **Add a routing rule** page, select **Add**.
27. Select **Next: Tags**.
28. Select **Next: Review + create**.
29. Review the settings on the summary page, and then select **Create** to create the network resources and the application gateway. It may take several minutes to create the application gateway. Wait until the deployment finishes successfully before moving on to the next section.

## Add backend pool

The backend pool is used to route requests to the backend servers that serve the request. The backend can be composed of NICs, virtual machine scale sets, public IP addresses, internal IP addresses, fully qualified domain names (FQDN), and multi-tenant back-ends like Azure App Service. In this example, you use virtual machines as the target backend. You can either use existing virtual machines or create new ones. In this example, you create two virtual machines that Azure uses as backend servers for the application gateway.

To do this, you:

1. Create two new virtual machines, *myVM* and *myVM2*, used as backend servers.
2. Install IIS on the virtual machines to verify that the application gateway was created successfully.
3. Add the backend servers to the backend pool.

### Create a virtual machine

1. Select **Create a resource**.
2. Select **Compute** and then select **Virtual machine**.
4. Enter these values for the virtual machine:
   - select *myResourceGroupAG* for **Resource group**.
   - *myVM* - for **Virtual machine name**.
   - Select **Windows Server 2019 Datacenter** for **Image**.
   - a valid **Username**.
   - a valid **Password**.
5. Accept the remaining defaults and select **Next : Disks**.
6. Accept the defaults and select **Next : Networking**.
7. Make sure that **myVNet** is selected for the virtual network and the subnet is **myBackendSubnet**.
8. Accept the remaining defaults, and select **Next : Management**.
9. Select **Off** to disable boot diagnostics.
10. Accept the remaining defaults, and select **Next : Advanced**.
11. Select **Next : Tags**.
12. Select **Next : Review + create**.
13. Review the settings on the summary page, and then select **Create**. It may take several minutes to create the VM. Wait until the deployment finishes successfully before moving on to the next section.

### Install IIS

1. Open the Cloud Shell and ensure that it's set to **PowerShell**.
    ![private-frontendip-3](./media/configure-application-gateway-with-private-frontend-ip/private-frontendip-3.png)
2. Run the following command to install IIS on the virtual machine:

   ```azurepowershell
   Set-AzVMExtension `
   
     -ResourceGroupName myResourceGroupAG `
   
     -ExtensionName IIS `
   
     -VMName myVM `
   
     -Publisher Microsoft.Compute `
   
     -ExtensionType CustomScriptExtension `
   
     -TypeHandlerVersion 1.4 `

     -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}' `

     -Location CentralUS `

   ```



3. Create a second virtual machine and install IIS using the steps that you just finished. Enter myVM2 for its name and for VMName in Set-AzVMExtension.

### Add backend servers to backend pool

1. Select **All resources**, and then select **myAppGateway**.
2. Select **Backend pools**. Select **appGatewayBackendPool**.
3. Under **Target type** select **Virtual machine**  and under **Target**, select the vNIC associated with myVM.
4. Repeat to add MyVM2.
   ![private-frontendip-4](./media/configure-application-gateway-with-private-frontend-ip/private-frontendip-4.png)
5. select **Save.**

## Test the application gateway

1. Check your frontend IP that got assigned by clicking the **Frontend IP Configurations** page in the portal.
    ![private-frontendip-5](./media/configure-application-gateway-with-private-frontend-ip/private-frontendip-5.png)
2. Copy the private IP address, and then paste it into the browser address bar in a VM in the same VNet or on-premises that has connectivity to this VNet and try to access the Application Gateway.

## Next steps

If you want to monitor the health of your backend, see [Back-end health and diagnostic logs for Application Gateway](application-gateway-diagnostics.md).
