---
title: 'Tutorial: Create an application gateway with a Web Application Firewall using the Azure portal'
description: In this tutorial, you learn how to create an application gateway with a Web Application Firewall by using the Azure portal.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.topic: tutorial
ms.date: 11/10/2022
ms.author: victorh
ms.custom: template-tutorial, engagement-fy23
#Customer intent: As an IT administrator, I want to use the Azure portal to set up an application gateway with Web Application Firewall so I can protect my applications.
---

# Tutorial: Create an application gateway with a Web Application Firewall using the Azure portal

This tutorial shows you how to use the Azure portal to create an Application Gateway with a Web Application Firewall (WAF). The WAF uses [OWASP](https://owasp.org/www-project-modsecurity-core-rule-set/) rules to protect your application. These rules include protection against attacks such as SQL injection, cross-site scripting attacks, and session hijacks. After creating the application gateway, you test it to make sure it's working correctly. With Azure Application Gateway, you direct your application web traffic to specific resources by assigning listeners to ports, creating rules, and adding resources to a backend pool. For the sake of simplicity, this tutorial uses a simple setup with a public front-end IP, a basic listener to host a single site on this application gateway, two Linux virtual machines used for the backend pool, and a basic request routing rule.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an application gateway with WAF enabled
> * Create the virtual machines used as backend servers
> * Create a storage account and configure diagnostics
> * Test the application gateway

:::image type="content" source="../media/application-gateway-web-application-firewall-portal/scenario-waf.png" alt-text="Diagram of the Web application firewall example.":::

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

<!---If you prefer, you can complete this tutorial using [Azure PowerShell](tutorial-restrict-web-traffic-powershell.md) or [Azure CLI](tutorial-restrict-web-traffic-cli.md).--->

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create an application gateway

1. Select **Create a resource** on the left menu of the Azure portal. The **New** window appears.

2. Select **Networking** and then select **Application Gateway** in the **Featured** list.

### Basics tab

1. On the **Basics** tab, enter these values for the following application gateway settings:

   - **Resource group**: Select **myResourceGroupAG** for the resource group. If it doesn't exist, select **Create new** to create it.
   - **Application gateway name**: Enter *myAppGateway* for the name of the application gateway.
   - **Tier**: select **WAF V2**.
   - **WAF Policy**: Select **Create new**, type a name for the new policy, and then select **OK**.
     This creates a basic WAF policy with a managed Core Rule Set (CRS).

     :::image type="content" source="../media/application-gateway-web-application-firewall-portal/application-gateway-create-basics.png" alt-text="Screenshot of Create new application gateway: Basics tab." lightbox="../media/application-gateway-web-application-firewall-portal/application-gateway-create-basics.png":::

2.  For Azure to communicate between the resources that you create, it needs a virtual network. You can either create a new virtual network or use an existing one. In this example, you'll create a new virtual network at the same time that you create the application gateway. Application Gateway instances are created in separate subnets. You create two subnets in this example: one for the application gateway, and another for the backend servers.

    Under **Configure virtual network**,  select **Create new** to create a new virtual network. In the **Create virtual network** window that opens, enter the following values to create the virtual network and two subnets:

    - **Name**: Enter *myVNet* for the name of the virtual network.

    - **Subnet name** (Application Gateway subnet): The **Subnets** grid will show a subnet named *Default*. Change the name of this subnet to *myAGSubnet*.<br>The application gateway subnet can contain only application gateways. No other resources are allowed.

    - **Subnet name** (backend server subnet): In the second row of the **Subnets** grid, enter *myBackendSubnet* in the **Subnet name** column.

    - **Address range** (backend server subnet): In the second row of the **Subnets** Grid, enter an address range that doesn't overlap with the address range of *myAGSubnet*. For example, if the address range of *myAGSubnet* is 10.21.0.0/24, enter *10.21.1.0/24* for the address range of *myBackendSubnet*.

    Select **OK** to close the **Create virtual network** window and save the virtual network settings.

    :::image type="content" source="../media/application-gateway-web-application-firewall-portal/application-gateway-create-vnet.png" alt-text="Screenshot of Create new application gateway: Create virtual network.":::
    
3. On the **Basics** tab, accept the default values for the other settings and then select **Next: Frontends**.

### Frontends tab

1. On the **Frontends** tab, verify **Frontend IP address type** is set to **Public**. <br>You can configure the Frontend IP to be **Public** or **Both** as per your use case. In this example, you'll choose a Public Frontend IP.
   > [!NOTE]
   > For the Application Gateway v2 SKU, **Public** and **Both** Frontend IP address types are supported today.  **Private** frontend IP configuration only is not currently supported.

2. Choose **Add new** for the **Public IP address** and enter *myAGPublicIPAddress* for the public IP address name, and then select **OK**. 

     :::image type="content" source="../media/application-gateway-web-application-firewall-portal/application-gateway-create-frontends.png" alt-text="Screenshot of Create new application gateway: Frontends.":::

3. Select **Next: Backends**.

### Backends tab

The backend pool is used to route requests to the backend servers that serve the request. Backend pools can be composed of NICs, virtual machine scale sets, public IPs, internal IPs, fully qualified domain names (FQDN), and multi-tenant back-ends like Azure App Service. In this example, you'll create an empty backend pool with your application gateway and then later add backend targets to the backend pool.

1. On the **Backends** tab, select **Add a backend pool**.

2. In the **Add a backend pool** window that opens, enter the following values to create an empty backend pool:

    - **Name**: Enter *myBackendPool* for the name of the backend pool.
    - **Add backend pool without targets**: Select **Yes** to create a backend pool with no targets. You'll add backend targets after creating the application gateway.

3. In the **Add a backend pool** window, select **Add** to save the backend pool configuration and return to the **Backends** tab.

    :::image type="content" source="../media/application-gateway-web-application-firewall-portal/application-gateway-create-backends.png" alt-text="Screenshot of Create new application gateway: Backends.":::

4. On the **Backends** tab, select **Next: Configuration**.

### Configuration tab

On the **Configuration** tab, you'll connect the frontend and backend pool you created using a routing rule.

1. Select **Add a routing rule** in the **Routing rules** column.

2. In the **Add a routing rule** window that opens, enter *myRoutingRule* for the **Rule name**.
1. For **Priority**, type a priority number.

3. A routing rule requires a listener. On the **Listener** tab within the **Add a routing rule** window, enter the following values for the listener:

    - **Listener name**: Enter *myListener* for the name of the listener.
    - **Frontend IP**: Select **Public** to choose the public IP you created for the frontend.
  
      Accept the default values for the other settings on the **Listener** tab, then select the **Backend targets** tab to configure the rest of the routing rule.

     :::image type="content" source="../media/application-gateway-web-application-firewall-portal/application-gateway-create-rule-listener.png" alt-text="Screenshot showing Create new application gateway: listener." lightbox="../media/application-gateway-web-application-firewall-portal/application-gateway-create-rule-listener-expanded.png":::

4. On the **Backend targets** tab, select **myBackendPool** for the **Backend target**.

5. For the **Backend settings**, select **Add new** to create a new Backend setting. This setting determines the behavior of the routing rule. In the **Add Backend setting** window that opens, enter *myBackendSetting* for the **Backend settings name**. Accept the default values for the other settings in the window, then select **Add** to return to the **Add a routing rule** window. 

     :::image type="content" source="../media/application-gateway-web-application-firewall-portal/application-gateway-create-backend-setting.png" alt-text="Screenshot showing Create new application gateway, Backend setting." lightbox="../media/application-gateway-web-application-firewall-portal/application-gateway-create-backend-setting-expanded.png":::

6. On the **Add a routing rule** window, select **Add** to save the routing rule and return to the **Configuration** tab.

     :::image type="content" source="../media/application-gateway-web-application-firewall-portal/application-gateway-create-rule-backends.png" alt-text="Screenshot showing Create new application gateway: routing rule." lightbox="../media/application-gateway-web-application-firewall-portal/application-gateway-create-rule-backends-expanded.png":::

7. Select **Next: Tags** and then **Next: Review + create**.

### Review + create tab

Review the settings on the **Review + create** tab, and then select **Create** to create the virtual network, the public IP address, and the application gateway. It may take several minutes for Azure to create the application gateway. 

Wait until the deployment finishes successfully before moving on to the next section.

## Add backend targets

In this example, you'll use virtual machines as the target backend. You can either use existing virtual machines or create new ones. You'll create two virtual machines that Azure uses as backend servers for the application gateway.

To do this, you'll:

1. Create two new Linux VMs, *myVM* and *myVM2*, to be used as backend servers.
2. Install NGINX on the virtual machines to verify that the application gateway was created successfully.
3. Add the backend servers to the backend pool.

### Create a virtual machine

1. On the Azure portal, select **Create a resource**. The **Create a resource** window appears.
2. Under **Virtual machine**, select **Create**.
3. Enter these values in the **Basics** tab for the following virtual machine settings:

    - **Resource group**: Select **myResourceGroupAG** for the resource group name.
    - **Virtual machine name**: Enter *myVM* for the name of the virtual machine.
    - **Image**: Ubuntu Server 20.04 LTS - Gen2.
    - **Authentication type**: Password
    - **Username**: Enter a name for the administrator username.
    - **Password**: Enter a password for the administrator password.
    - **Public inbound ports**: Select **None**.
4. Accept the other defaults and then select **Next: Disks**.  
5. Accept the **Disks** tab defaults and then select **Next: Networking**.
6. On the **Networking** tab, verify that **myVNet** is selected for the **Virtual network** and the **Subnet** is set to **myBackendSubnet**.
1. For **Public IP**, select **None**.
1. Accept the other defaults and then select **Next: Management**.
1. Select **Next: Monitoring**, set **Boot diagnostics** to **Disable**. Accept the other defaults and then select **Review + create**.
1. On the **Review + create** tab, review the settings, correct any validation errors, and then select **Create**.
1. Wait for the virtual machine creation to complete before continuing.

### Install NGINX for testing

In this example, you install NGINX on the virtual machines only to verify Azure created the application gateway successfully.

1. Open a Bash Cloud Shell. To do so, select the **Cloud Shell** icon from the top navigation bar of the Azure portal and then select **Bash** from the drop-down list.

   :::image type="content" source="../media/application-gateway-web-application-firewall-portal/bash-shell.png" alt-text="Screenshot showing the Bash Cloud Shell.":::

2. Run the following command to install NGINX on the virtual machine: 

   ```azurecli-interactive
    az vm extension set \
    --publisher Microsoft.Azure.Extensions \
    --version 2.0 \
    --name CustomScript \
    --resource-group myResourceGroupAG \
    --vm-name myVM \
    --settings '{ "fileUris": ["https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/application-gateway/iis/install_nginx.sh"], "commandToExecute": "./install_nginx.sh" }'
   ```

3. Create a second virtual machine and install NGINX using these steps that you previously completed. Use *myVM2* for the virtual machine name and for the **--vm-name** setting of the cmdlet.

### Add backend servers to backend pool

1. Select **All resources**, and then select **myAppGateway**.

2. Select **Backend pools** from the left menu.

3. Select **myBackendPool**.

4. Under **Target type**, select **Virtual machine** from the drop-down list.

5. Under **Target**, select the associated network interface for **myVM** from the drop-down list.
1. Repeat for **myVM2**.

   :::image type="content" source="../media/application-gateway-web-application-firewall-portal/application-gateway-backend.png" alt-text="Add backend servers":::


6. Select **Save**.

7. Wait for the deployment to complete before proceeding to the next step.

## Test the application gateway

Although NGINX isn't required to create the application gateway, you installed it to verify whether Azure successfully created the application gateway. Use the web service to test the application gateway:

1. Find the public IP address for the application gateway on its **Overview** page.
    :::image type="content" source="../media/application-gateway-web-application-firewall-portal/application-gateway-record-ag-address.png" alt-text="Screenshot of Application Gateway public IP address on the Overview page."::: 

   Or, you can select **All resources**, enter *myAGPublicIPAddress* in the search box, and then select it in the search results. Azure displays the public IP address on the **Overview** page.
1. Copy the public IP address, and then paste it into the address bar of your browser.
1. Check the response. A valid response verifies that the application gateway was successfully created and it can successfully connect with the backend.

   :::image type="content" source="../media/application-gateway-web-application-firewall-portal/application-gateway-iistest.png" alt-text="Screenshot of testing the application gateway.":::

## Clean up resources

When you no longer need the resources that you created with the application gateway, remove the resource group. By removing the resource group, you also remove the application gateway and all its related resources. 

To remove the resource group:

1. On the left menu of the Azure portal, select **Resource groups**.
2. On the **Resource groups** page, search for **myResourceGroupAG** in the list, then select it.
3. On the **Resource group page**, select **Delete resource group**.
4. Enter *myResourceGroupAG* for **TYPE THE RESOURCE GROUP NAME** and then select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Web Application Firewall](../overview.md)
