---
title: 'Quickstart: Direct web traffic using the portal'
titleSuffix: Azure Application Gateway
description: Use the Azure portal to create an Azure Application Gateway that directs web traffic to virtual machines in a backend pool.
services: application-gateway
author: mbender-ms
ms.author: mbender
ms.date: 03/04/2026
ms.topic: quickstart
ms.service: azure-application-gateway
ms.custom:
  - mvc
  - mode-ui
  - sfi-image-nochange
# Customer intent: "As a network engineer, I want to set up an application gateway that directs web traffic to backend virtual machines, so that I can manage traffic efficiently and ensure high availability for my web applications."
---

# Quickstart: Direct web traffic with Azure Application Gateway - Azure portal

In this quickstart, you use the Azure portal to create an [Azure Application Gateway](overview.md) and test it to make sure it works correctly. You configure a public frontend IP address, a basic listener, a request routing rule, and two virtual machines (VMs) in the backend pool.

:::image type="content" source="./media/quick-create-portal/application-gateway-qs-resources.png" alt-text="Conceptual diagram of the quickstart setup." lightbox="./media/quick-create-portal/application-gateway-qs-resources.png":::

For more information about the components of an application gateway, see [Application gateway components](application-gateway-components.md).

You can also complete this quickstart by using [Azure PowerShell](quick-create-powershell.md) or [Azure CLI](quick-create-cli.md).

> [!NOTE]
> Application Gateway frontend now supports dual-stack IP addresses (Preview). You can now create up to four frontend IP addresses: Two IPv4 addresses (public and private) and two IPv6 addresses (public and private).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Create a resource group and virtual network

Create a resource group and virtual network for the application gateway and its related resources.

> [!NOTE]
> The application gateway must be in a separate subnet from the backend targets. In this quickstart, *myAGSubnet* is for the application gateway and *myBackendSubnet* is for the backend targets.

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.
1. On the Azure portal menu or from the **Home** page, enter *Resource groups* in the search box, and then select **Resource groups** from the search results.
1. On the **Resource groups** page, select **+ Create**.
1. On the **Create a resource group** page, enter the following values:

   | Setting | Value |
   | --- | --- |
   | **Subscription** | Select your Azure subscription. |
   | **Resource group** | Enter *myResourceGroupAG*. |
   | **Region** | Select a region. Use the same region when you create other resources in this quickstart. |

1. Select **Review + create** and then select **Create**.
1. Browse to the resource group by selecting **Resource groups** from the Azure portal menu, and then select **myResourceGroupAG**.
1. On the **myResourceGroupAG** page, select **+ Create**.
1. In the **Search the Marketplace** box, enter *Virtual Network* and select **Virtual Network** from the search results.
1. Select **Create** on the **Virtual Network** page.
1. On the **Create virtual network** page, enter the following values:

   | Setting | Value |
   | --- | --- |
   | **Subscription** | Select your Azure subscription. |
   | **Resource group** | Verify that *myResourceGroupAG* is selected. |
   | **Name** | Enter *myVNet*. |
   | **Region** | Select the same region as the resource group. |

1. Select **Next > Next** or select the **IP Addresses** tab.
1. On the **IP Addresses** tab, configure the address space to *10.21.0.0/16*.
1. Select **+ Add a subnet** and enter the following values:

   | Setting | Value |
   | --- | --- |
   | **Subnet name** | Enter *myBackendSubnet*. |
   | **Starting address** | Enter *10.21.1.0*. |
   | **Subnet size** | Select */24 (256 addresses)*. |

1. Select **Add**.
1. From the **Subnets** list, select the **default** subnet and select the pencil icon to edit it. Change the name to *myAGSubnet*, set the starting address to *10.21.0.0* with a subnet size of */24 (256 addresses)*, and then select **Save**.
1. Select **Review + create** and then select **Create** to create the virtual network.

## Create an application gateway

Create the application gateway by using the tabs on the **Create application gateway** page. This example uses the Standard v2 SKU. To create a Basic SKU by using the Azure portal, see [Deploy Application Gateway basic (Preview)](deploy-basic-portal.md).

1. On the Azure portal menu or from the **Home** page, enter *Application Gateway* in the search box, and then select **Application Gateways** from the search results.
1. On the **Application Gateways** page, select **+ Create > Application Gateway**.
1. On the **Basics** tab, enter the following values:

    | Setting | Value |
    | --- | --- |
    | **Subscription** | Select your Azure subscription. |
    | **Resource group** | Select **myResourceGroupAG**. |
    | **Application gateway name** | Enter *myAppGateway*. |
    | **Region** | Select the same region as the resource group. |
    | **Tier** | Select **Standard V2**. |
    | **Configure virtual network** |  |
    | **Virtual network** | Select **myVNet**. |
    | **Subnet** | Select **myAGSubnet**. |

    > [!NOTE]
    > Application Gateways are zone-redundant by default in regions that support multiple availability zones.
    > [Virtual network service endpoint policies](../virtual-network/virtual-network-service-endpoint-policies-overview.md) are currently not supported in an Application Gateway subnet.

### Frontends tab

The frontend IP address is the entry point for incoming traffic. You can configure it as public or private. In this example, you configure a public frontend IP address.

1. Select **Next: Frontends**.
1. On the **Frontends** tab, verify that **Frontend IP address type** is set to **Public**.
   > [!NOTE]
   > * [Private-only deployment](application-gateway-private-deployment.md) for the Application Gateway v2 SKU is currently in public preview.
   > * Application Gateway frontend now supports dual-stack IP addresses (public preview). You can create up to four frontend IP addresses: two IPv4 addresses (public and private) and two IPv6 addresses (public and private).

1. Select **Add new** for the **Public IP address** and enter *myAGPublicIPAddress* for the public IP address name, and then select **OK**. 
1. Select **Next: Backends**.

### Backends tab

The backend pool routes requests to the backend servers that serve the request. Backend pools can include NICs, Virtual Machine Scale Sets, public IP addresses, internal IP addresses, fully qualified domain names (FQDN), and multitenant backends like Azure App Service. In this example, you create an empty backend pool and then add backend targets later.

1. On the **Backends** tab, select **Add a backend pool**.

1. In the **Add a backend pool** window, enter the following values:

    | Setting | Value |
    | --- | --- |
    | **Name** | Enter *myBackendPool*. |
    | **Add backend pool without targets** | Select **Yes**. You add backend targets after creating the application gateway. |

1. Select **Add** to save the backend pool configuration and return to the **Backends** tab.

1. On the **Backends** tab, select **Next: Configuration**.

### Configuration tab

On the **Configuration** tab, you connect the frontend and backend pool by using a routing rule.

1. Select **Add a routing rule** in the **Routing rules** column.

1. In the **Add a routing rule** window, enter the following values:

    - **Rule name**: Enter *myRoutingRule*.
    - **Priority**: Enter *100*. Priority values range from 1 (highest) to 20000 (lowest).

1. On the **Listener** tab, enter the following values:

    | Setting | Value |
    | --- | --- |
    | **Listener name** | Enter *myListener*. |
    | **Frontend IP** | Select **Public IPv4**. |

1. Accept the default values for the other settings on the **Listener** tab, then select the **Backend targets** tab to configure the rest of the routing rule.

1. On the **Backend targets** tab, select or enter the following:

    | Setting | Value |
    | --- | --- |
    | **Target type** | Select **Backend pool** radio button |
    | **Backend target** | Select **myBackendPool**. |
    | **Backend settings** | Select **Add new**. |
    | **Backend settings name** | Enter *myBackendSetting*. |
    | **Backend port** | Enter *80*. |

1. Accept the default values for the other settings and select **Add** to return to the **Add a routing rule** window.

1. Select **Add** to save the routing rule and return to the **Configuration** tab.

1. Select **Next: Tags** and then **Next: Review + create**.

### Review + create tab

Review the settings on the **Review + create** tab, and then select **Create** to create the virtual network, the public IP address, and the application gateway. It might take several minutes for Azure to create the application gateway. Wait until the deployment finishes successfully before you continue.

## Add backend targets

In this example, you use virtual machines as the target backend. You create two virtual machines as backend servers for the application gateway.

To add backend targets, you:

1. Create two new VMs, *myVM* and *myVM2*, to use as backend servers.
1. Install IIS on the virtual machines to verify that the application gateway was created successfully.
1. Add the backend servers to the backend pool.

### Create a virtual machine

1. On the Azure portal menu or from the **Home** page, select **Create a resource**. The **New** window appears.
1. Select **Windows Server 2022 Datacenter** in the **Popular** list.<br>Application Gateway can route traffic to any type of virtual machine in its backend pool. In this example, you use a Windows Server 2022 Datacenter virtual machine.
1. On the **Basics** tab, enter the following values:

    | Setting | Value |
    | --- | --- |
    | **Resource group** | Select **myResourceGroupAG**. |
    | **Virtual machine name** | Enter *myVM*. |
    | **Region** | Select the same region as the application gateway. |
    | **Username** | Enter an administrator user name. |
    | **Password** | Enter a password. |
    | **Public inbound ports** | Select **None**. |
1. Accept the other defaults and then select **Next: Disks**.  
1. Accept the **Disks** tab defaults and then select **Next: Networking**.
1. On the **Networking** tab, verify that **myVNet** is selected for the **Virtual network** and the **Subnet** is set to **myBackendSubnet**. For **Public IP**, select **None**. Accept the other defaults and then select **Next: Management**.
   > [!NOTE]
   > Application Gateway can communicate with instances outside of its virtual network, but you need to ensure there's IP connectivity.
1. Select **Next: Monitoring** and set **Boot diagnostics** to **Disable**. Accept the other defaults and then select **Review + create**.
1. On the **Review + create** tab, review the settings, correct any validation errors, and then select **Create**.
1. Wait for the virtual machine creation to complete before continuing.

> [!NOTE]
> The default network security group rules block all inbound internet access, including RDP. To connect to the virtual machine, use Azure Bastion. For more information, see [Quickstart: Deploy Azure Bastion with default settings](../bastion/quickstart-host-portal.md).

### Install IIS for testing

In this example, you install IIS on the virtual machines to verify that the application gateway was created successfully.

1. In the Azure portal, select **Cloud Shell** from the top navigation bar, and then select **PowerShell** from the dropdown list. 

    > [!NOTE]
    > You can also use Azure Bastion to connect to the virtual machines and install IIS. For more information, see [Quickstart: Deploy Azure Bastion with default settings](../bastion/quickstart-host-portal.md).

1. In the Azure PowerShell terminal, run the following command to install IIS on the virtual machine. Change the `Location` parameter if necessary: 

    ```azurepowershell
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

1. Create a second virtual machine and install IIS by repeating the previous steps. Use *myVM2* for the virtual machine name and for the `VMName` setting of the `Set-AzVMExtension` cmdlet.

### Add backend servers to backend pool

1. On the Azure portal menu, select **All resources** or search for and select *All resources*. Then select **myAppGateway**.
1. Select **Backend pools** from the left menu.
1. Select **myBackendPool**.
1. Under **Backend targets**, **Target type**, select **Virtual machine** from the dropdown list.
1. Under **Target**, select the **myVM** and **myVM2** virtual machines and their associated network interfaces from the dropdown lists.

1. Select **Save**.
1. Wait for the deployment to complete before proceeding to the next step.

## Test the application gateway

Although IIS isn't required to create the application gateway, you installed it in this quickstart to verify that the application gateway was created successfully. 

To test the application gateway with IIS:

1. Find the public IP address for the application gateway on its **Overview** page. Or, select **All resources**, enter *myAGPublicIPAddress* in the search box, and then select it in the search results. Azure displays the public IP address on the **Overview** page.
1. Copy the public IP address, and then paste it into the address bar of your browser to browse that IP address.
1. Check the response. A valid response verifies that the application gateway was created successfully and can connect with the backend.

   Refresh the browser multiple times to verify connections to both *myVM* and *myVM2*.

## Clean up resources

When you no longer need the resources that you created with the application gateway, delete the resource group. Deleting the resource group also removes the application gateway and all related resources.

To delete the resource group:

1. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups*.
1. On the **Resource groups** page, search for **myResourceGroupAG**, and then select it.
1. On the **Resource group** page, select **Delete resource group**.
1. Enter *myResourceGroupAG* under **TYPE THE RESOURCE GROUP NAME** and then select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Configure an application gateway with TLS termination using the Azure portal](create-ssl-portal.md)
