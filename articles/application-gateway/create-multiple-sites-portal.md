---
title: 'Tutorial: Create and configure an application gateway to host multiple web sites using the Azure portal'
titleSuffix: Azure Application Gateway
description: In this tutorial, you learn how to create an application gateway that hosts multiple web sites using the Azure portal.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: tutorial
ms.date: 06/13/2023
ms.author: greglin
ms.custom: template-tutorial
#Customer intent: As an IT administrator, I want to use the Azure portal to set up an application gateway so I can host multiple sites.
---

# Tutorial: Create and configure an application gateway to host multiple web sites using the Azure portal

You can use the Azure portal to configure the [hosting of multiple web sites](multiple-site-overview.md) when you create an [application gateway](overview.md). In this tutorial, you define backend address pools using virtual machines. You then configure listeners and rules based on two domains to make sure web traffic arrives at the appropriate servers in the pools. This tutorial uses examples of `www.contoso.com` and `www.fabrikam.com`.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an application gateway
> * Create virtual machines for backend servers
> * Create backend pools with the backend servers
> * Create listeners
> * Create routing rules
> * Edit hosts file for name resolution

:::image type="content" source="./media/create-multiple-sites-portal/scenario.png" alt-text="Diagram showing multi-site application gateway.":::

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

- An Azure subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create an application gateway

1. From the Azure portal menu, select **+ Create a resource** > **Networking** > **Application Gateway**, or search for *Application Gateway* in the portal search box.

2. Select **Create**.

### Basics tab

1. On the **Basics** tab, enter these values:

   - **Resource group**: Select **myResourceGroupAG** for the resource group. If it doesn't exist, select **Create new** to create it.
   - **Application gateway name**: Enter *myAppGateway* for the name of the application gateway.

     :::image type="content" source="./media/create-multiple-sites-portal/application-gateway-create-basics.png" alt-text="Screenshot showing Create application gateway page.":::

2.  For Azure to communicate between the resources that you create, it needs a virtual network. You can either create a new virtual network or use an existing one. In this example, you'll create a new virtual network at the same time that you create the application gateway. Application gateway instances are created in separate subnets. You create two subnets in this example: one for the application gateway, and another for the backend servers.

    Under **Configure virtual network**, select **Create new** to create a new virtual network. In the **Create virtual network** window that opens, enter the following values to create the virtual network and two subnets:

    - **Name**: Enter *myVNet* for the name of the virtual network.

    - **Subnet name** (application gateway subnet): The **Subnets** grid will show a subnet named *Default*. Change the name of this subnet to *myAGSubnet*.<br>The application gateway subnet can contain only application gateways. No other resources are allowed. The default IP address range provided is 10.0.0.0/24.

    Select **OK** to close the **Create virtual network** window and save the virtual network settings.

     :::image type="content" source="./media/application-gateway-create-gateway-portal/application-gateway-create-vnet.png" alt-text="Create VNet":::
    
3. On the **Basics** tab, accept the default values for the other settings and then select **Next: Frontends**.

### Frontends tab

1. On the **Frontends** tab, verify **Frontend IP address type** is set to **Public**. <br>You can configure the Frontend IP to be Public or Private as per your use case. In this example, you'll choose a Public Frontend IP.
   > [!NOTE]
   > For the application gateway v2 SKU, you can only choose **Public** frontend IP configuration. Use of a private frontend IP address configuration is currently in public preview. For more information, see [Private Application Gateway deployment](application-gateway-private-deployment.md).

2. Select **Add new** for the **Public IP address** and enter *myAGPublicIPAddress* for the public IP address name, and then select **OK**. 

     :::image type="content" source="./media/application-gateway-create-gateway-portal/application-gateway-create-frontends.png" alt-text="Create another VNet":::

3. Select **Next: Backends**.

### Backends tab

The backend pool is used to route requests to the backend servers that serve the request. Backend pools can be NICs, virtual machine scale sets, public IPs, internal IPs, fully qualified domain names (FQDN), and multi-tenant backends like Azure App Service. In this example, you'll create an empty backend pool with your application gateway and then add backend targets to the backend pool.

1. On the **Backends** tab, select **Add a backend pool**.

2. In the **Add a backend pool** window that opens, enter the following values to create an empty backend pool:

    - **Name**: Enter *contosoPool* for the name of the backend pool.
    - **Add backend pool without targets**: Select **Yes** to create a backend pool with no targets. You'll add backend targets after creating the application gateway.

3. In the **Add a backend pool** window, select **Add** to save the backend pool configuration and return to the **Backends** tab.
4. Now add another backend pool called *fabrikamPool* the same way that you added the previous pool.
1. Select **Add**.

    :::image type="content" source="./media/create-multiple-sites-portal/backend-pools.png" alt-text="Create Backends":::

4. On the **Backends** tab, select **Next: Configuration**.

### Configuration tab

On the **Configuration** tab, you'll connect the frontend and backend pools you created using a routing rule.

1. Select **Add a routing rule** in the **Routing rules** column.

2. In the **Add a routing rule** window that opens, enter *contosoRule* for the **Rule name**.

3. A routing rule requires a listener. On the **Listener** tab within the **Add a routing rule** window, enter the following values for the listener:

    - **Rule name**: *contosoRule*.
    - **Listener name**: *contosoListener*.
    - **Frontend IP**: Select **Public** to choose the public IP you created for the frontend.

   Under **Additional settings**:
   - **Listener type**: Multiple sites
   - **Host name**: `www.contoso.com`

   Accept the default values for the other settings on the **Listener** tab, then select the **Backend targets** tab to configure the rest of the routing rule.

   :::image type="content" source="./media/create-multiple-sites-portal/routing-rule.png" alt-text="Create routing rule":::

4. On the **Backend targets** tab, select **contosoPool** for the **Backend target**.

5. For the **Backend setting**, select **Add new** to add a new Backend setting. The Backend setting will determine the behavior of the routing rule. In the **Add Backend setting** window that opens, enter *contosoSetting* for the **Backend settings name** and *80* for the **Backend port**. Accept the default values for the other settings in the **Add Backend setting** window, then select **Add** to return to the **Add a routing rule** window. 

6. On the **Add a routing rule** window, select **Add** to save the routing rule and return to the **Configuration** tab.
7. Select **Add a routing rule** and add a similar rule, listener, backend target, and backend setting for Fabrikam.

     :::image type="content" source="./media/create-multiple-sites-portal/fabrikam-rule.png" alt-text="Fabrikam rule":::

7. Select **Next: Tags** and then **Next: Review + create**.

### Review + create tab

Review the settings on the **Review + create** tab, and then select **Create** to create the virtual network, the public IP address, and the application gateway. It may take several minutes for Azure to create the application gateway.

Wait until the deployment finishes successfully before moving on to the next section.

## Add backend targets

In this example, you'll use virtual machines as the target backend. You can either use existing virtual machines or create new ones. You'll create two virtual machines that Azure uses as backend servers for the application gateway.

To add backend targets, you'll:

1. Add a backend subnet.
2. Create two new VMs, *contosoVM* and *fabrikamVM*, to be used as backend servers.
3. Install IIS on the virtual machines to verify that the application gateway was created successfully.
4. Add the backend servers to the backend pools.

### Add a backend subnet

1. On the Azure portal, search for **virtual networks** and select **myVNet*.
2. Under **Settings**, select **Subnets**.
3. Select **+ Subnet** and in the **Add subnet** pane, enter *myBackendSubnet* for **Name** and accept *10.0.1.0/24* as the **Subnet address range**.
4. Accept all other default settings and select **Save**.

### Create a virtual machine

1. On the Azure portal, select **Create a resource**. The **New** window appears.
2. Select **Windows Server 2016 Datacenter** in the **Popular** list. The **Create a virtual machine** page appears.<br>Application Gateway can route traffic to any type of virtual machine used in its backend pool. In this example, you use a Windows Server 2016 Datacenter.
3. Enter these values in the **Basics** tab for the following virtual machine settings:

    - **Subscription**: Select your subscription.
    - **Resource group**: Select **myResourceGroupAG** for the resource group name.
    - **Virtual machine name**: Enter *contosoVM* for the name of the virtual machine.
    - **Region**: Select the same region that you used before.
    - **Username**: Enter a name for the administrator user name.
    - **Password**: Enter a password for the administrator.
1. Accept the other defaults and then select **Next: Disks**.  
2. Accept the **Disks** tab defaults and then select **Next: Networking**.
3. On the **Networking** tab, verify that **myVNet** is selected for the **Virtual network** and the **Subnet** is set to **myBackendSubnet**. Accept the other defaults and then select **Next: Management**.<br>Application Gateway can communicate with instances outside of the virtual network that it is in, but you need to ensure there's IP connectivity.
4. On the **Management** tab, set **Boot diagnostics** to **Disable**. Accept the other defaults and then select **Review + create**.
5. On the **Review + create** tab, review the settings, correct any validation errors, and then select **Create**.
6. Wait for the virtual machine creation to complete before continuing.

### Install IIS for testing

In this example, you install IIS on the virtual machines only to verify Azure created the application gateway successfully.

1. Open [Azure PowerShell](../cloud-shell/quickstart-powershell.md). To do so, select **Cloud Shell** from the top navigation bar of the Azure portal and then select **PowerShell** from the drop-down list. 

    ![Install custom extension](./media/application-gateway-create-gateway-portal/application-gateway-extension.png)

2. Run the following command to install IIS on the virtual machine, substituting your resource group region for <location\>: 

    ```azurepowershell-interactive
    Set-AzVMExtension `
      -ResourceGroupName myResourceGroupAG `
      -ExtensionName IIS `
      -VMName contosoVM `
      -Publisher Microsoft.Compute `
      -ExtensionType CustomScriptExtension `
      -TypeHandlerVersion 1.4 `
      -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}' `
      -Location <location>
    ```

3. Create a second virtual machine and install IIS using the steps that you previously completed. Use *fabrikamVM* for the virtual machine name and for the **VMName** setting of the **Set-AzVMExtension** cmdlet.

### Add backend servers to backend pools

1. Select **All resources**, and then select **myAppGateway**.

2. Select **Backend pools** from the left menu.

3. Select **contosoPool**.

4. Under **Target type**, select **Virtual machine** from the drop-down list.

5. Under **Target**, select the **contosoVM** virtual machine's network interface from the drop-down list.

    ![Add backend servers](./media/create-multiple-sites-portal/edit-backend-pool.png)

6. Select **Save**.
7. Repeat to add the *fabrikamVM* and interface to the *fabrikamPool*.

Wait for the deployment to complete before proceeding to the next step.

## Edit your hosts file for name resolution

After the application gateway is created with its public IP address, you can get the IP address, and use it to edit your hosts file to resolve `www.contoso.com` and `www.fabrikam.com`. In a production environment, you could create a `CNAME` in DNS for name resolution.

1. Select **All resources**, and then select **myAGPublicIPAddress**.

    ![Record application gateway DNS address](./media/create-multiple-sites-portal/public-ip.png)

2. Copy the IP address and use it as the value for new entries your `hosts` file.
1. On your local machine, open an administrative command prompt, and navigate to `c:\Windows\System32\drivers\etc`.
1. Open the `hosts` file, and add the following entries, where `x.x.x.x` is the application gateway's public IP address:
   ```dos
   # Copyright (c) 1993-2009 Microsoft Corp.
   #
   # This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
   #
   # This file contains the mappings of IP addresses to host names. Each
   # entry should be kept on an individual line. The IP address should
   # be placed in the first column followed by the corresponding host name.
   # The IP address and the host name should be separated by at least one
   # space.
   #
   # Additionally, comments (such as these) may be inserted on individual
   # lines or following the machine name denoted by a '#' symbol.
   #
   # For example:
   #
   #      102.54.94.97     rhino.acme.com          # source server
   #       38.25.63.10     x.acme.com              # x client host
   
   # localhost name resolution is handled within DNS itself.
   #	127.0.0.1       localhost
   #	::1             localhost
   x.x.x.x www.contoso.com
   x.x.x.x www.fabrikam.com

   ```
1. Save the file.
1. Run the following commands to load and display the changes to your hosts file:
   ```dos
    ipconfig/registerdns
    ipconfig/displaydns
   ```
   
## Test the application gateway

1. Type a domain name into the address bar of your browser. For example, `http://www.contoso.com`.

    ![Test contoso site in application gateway](./media/create-multiple-sites-portal/application-gateway-iistest.png)

2. Change the address to the other domain and you should see something like the following example:

    ![Test fabrikam site in application gateway](./media/create-multiple-sites-portal/application-gateway-iistest2.png)

## Clean up resources

When you no longer need the resources that you created with the application gateway, delete the resource group. When you delete the resource group, you also delete the application gateway and all its related resources.

To remove the resource group:

1. On the left menu of the Azure portal, select **Resource groups**.
2. On the **Resource groups** page, search for **myResourceGroupAG** in the list, then select it.
3. On the **myResourceGroupAG** page, select **Delete resource group**.
4. Enter *myResourceGroupAG* for **TYPE THE RESOURCE GROUP NAME** and then select **Delete**.

To restore the hosts file:

1. Delete the `www.contoso.com` and `www.fabrikam.com` lines from the `hosts` file.
1. Run `ipconfig/registerdns` and `ipconfig/flushdns` from the command prompt.

## Next steps

In this tutorial, you:

- Created an application gateway with listeners and rules based on two domains
- Tested the application gateway after editing the host files of backend servers

To learn more about hosting multiple sites, see [application gateway multiple site hosting](multiple-site-overview.md).

To learn how to create and configure an application gateway with path-based routing rules using the Azure portal, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Route by URL](create-url-route-portal.md)
