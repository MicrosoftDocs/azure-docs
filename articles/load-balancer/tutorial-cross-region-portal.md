---
title: 'Tutorial: Create a cross-region load balancer'
titleSuffix: Azure Load Balancer
description: Get started with this tutorial deploying a cross-region Azure Load Balancer with the Azure portal, Azure CLI, or Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: azure-load-balancer
ms.topic: tutorial
ms.date: 08/01/2024
ms.custom: template-tutorial, references_regions
#Customer intent: As a administrator, I want to deploy a cross-region load balancer for global high availability of my application or service.
---

# Tutorial: Create a cross-region Azure Load Balancer

A cross-region load balancer ensures a service is available globally across multiple Azure regions. If one region fails, the traffic is routed to the next closest healthy regional load balancer.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create cross-region load balancer.
> * Create a backend pool containing two regional load balancers.
> * Create a load balancer rule.
> * Test the load balancer.

You can use the Azure portal, Azure CLI, or Azure PowerShell to complete this tutorial.

## Prerequisites

# [Azure portal](#tab/azureportal)

- An Azure subscription. If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Two **standard** sku Azure Load Balancers with backend pools deployed in two different Azure regions.
    - For information on creating a regional standard load balancer and virtual machines for backend pools, see [Quickstart: Create a public load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-public-portal.md).

# [Azure CLI](#tab/azurecli/)

- An Azure subscription. If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Two **standard** sku Azure Load Balancers with backend pools deployed in two different Azure regions.
    - For information on creating a regional standard load balancer and virtual machines for backend pools, see [Quickstart: Create a public load balancer to load balance VMs using Azure CLI](quickstart-load-balancer-standard-public-cli.md).
        - Append the name of the load balancers and virtual machines in each region with a **-R1** and **-R2**. 
- Azure CLI installed locally or Azure Cloud Shell.

If you choose to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.28 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). When running Azure CLI locally, you'll need to sign in with `az login` to create a connection with Azure.

# [Azure PowerShell](#tab/azurepowershell/)

- An Azure subscription. If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Two **standard** sku Azure Load Balancers with backend pools deployed in two different Azure regions.
    - For information on creating a regional standard load balancer and virtual machines for backend pools, see [Quickstart: Create a public load balancer to load balance VMs using Azure PowerShell](quickstart-load-balancer-standard-public-powershell.md).
- Azure PowerShell installed locally or Azure Cloud Shell.


If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

---


## Create cross-region load balancer

In this section, you create a cross-region load balancer with a public IP address, a frontend IP configuration, a backend pool with region load balancers added, and a load balancer rule.

# [Azure portal](#tab/azureportal)

> [!IMPORTANT]
> To complete these steps, ensure that two regional load balancers with backend pools have been deployed in your subscription.  For more information, see, **[Quickstart: Create a public load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-public-portal.md)**.

### Create the load balancer resource and other resources

1. [Sign in](https://portal.azure.com) to the Azure portal.

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancer** in the search results.

3. In the **Load balancer** page, select **Create**.

4. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |    |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **Create new** and enter **CreateCRLBTutorial-rg** in the text box. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer-cr**                                   |
    | Region         | Select **(US) East US**.                                        |
    | Type          | Select **Public**.                                        |
    | SKU           | Leave the default of **Standard**. |
    | Tier           | Select **Global** |

    :::image type="content" source="./media/tutorial-cross-region-portal/create-cross-region.png" alt-text="Create a cross-region load balancer" border="true":::
  
5. Select **Next: Frontend IP configuration** at the bottom of the page.

6. In **Frontend IP configuration**, select **+ Add a frontend IP**.

7. Enter **LoadBalancerFrontend** in **Name** in **Add frontend IP address**.

8. Select **IPv4** or **IPv6** for **IP version**.

9.  In **Public IP address**, select **Create new**. Enter **myPublicIP-cr** in **Name**.  Select **Save** for the Add Public IP Address Dialog.

10. Select **Save**.

11. Select **Next: Backend pools** at the bottom of the page.

12. In **Backend pools**, select **+ Add a backend pool**.

13. Enter **myBackendPool-cr** in **Name** in **Add backend pool**.

14. In **Load balancers**, select **myLoadBalancer-r1** or your first regional load balancer in the **Load balancer** pull-down box. Verify the **Frontend IP configuration** and **IP address** correspond with **myLoadBalancer-r1**.

15. Select **myLoadBalancer-r2** or your second regional load balancer in the **Load balancer** pull-down box. Verify the **Frontend IP configuration** and **IP address** correspond with **myLoadBalancer-r2**.

16. Select **Add**.

18. Select **Next: Inbound rules** at the bottom of the page.

19. In **Inbound rules**, select **+ Add a load balancing rule**.

20. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule-cr**. |
    | IP Version | Select **IPv4** or **IPv6** for **IP Version**. |
    | Frontend IP address | Select **LoadBalancerFrontend**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend pool | Select **myBackendPool-cr**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or move the slider to **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Leave the default of **Disabled**. |

21. Select **Add**.

22. Select **Review + create** at the bottom of the page.

23. Select **Create** in the **Review + create** tab.

    > [!NOTE]
    > Cross region load-balancer deployment is listed to specific home Azure regions. For the current list, see [Home regions in Azure](cross-region-overview.md#home-regions-in-azure) for cross region load balancer.

# [Azure CLI](#tab/azurecli/)

### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create):

* Named **myResourceGroupLB-CR**.
* In the **westus** location.

```azurecli-interactive
  az group create \
    --name myResourceGroupLB-CR \
    --location westus
```

### Create the cross-region load balancer resource

Create a cross-region load balancer with [az network cross-region-lb create](/cli/azure/network/cross-region-lb#az-network-cross-region-lb-create):

* Named **myLoadBalancer-CR**.
* A frontend pool named **myFrontEnd-CR**.
* A backend pool named **myBackEndPool-CR**.

```azurecli-interactive
  az network cross-region-lb create \
    --name myLoadBalancer-CR \
    --resource-group myResourceGroupLB-CR \
    --frontend-ip-name myFrontEnd-CR \
    --backend-pool-name myBackEndPool-CR     
```

### Create the load balancer rule

A load balancer rule defines:

* Frontend IP configuration for the incoming traffic.
* The backend IP pool to receive the traffic.
* The required source and destination port. 

Create a load balancer rule with [az network cross-region-lb rule create](/cli/azure/network/cross-region-lb/rule#az-network-cross-region-lb-rule-create):

* Named **myHTTPRule-CR**
* Listening on **Port 80** in the frontend pool **myFrontEnd-CR**.
* Sending load-balanced network traffic to the backend address pool **myBackEndPool-CR** using **Port 80**. 
* Protocol **TCP**.

```azurecli-interactive
  az network cross-region-lb rule create \
    --backend-port 80 \
    --frontend-port 80 \
    --lb-name myLoadBalancer-CR \
    --name myHTTPRule-CR \
    --protocol tcp \
    --resource-group myResourceGroupLB-CR \
    --backend-pool-name myBackEndPool-CR \
    --frontend-ip-name myFrontEnd-CR
```

## Create backend pool

In this section, you add two regional standard load balancers to the backend pool of the cross-region load balancer.

> [!IMPORTANT]
> To complete these steps, ensure that two regional load balancers with backend pools have been deployed in your subscription.  For more information, see, **[Quickstart: Create a public load balancer to load balance VMs using Azure CLI](quickstart-load-balancer-standard-public-cli.md)**.

### Add the regional frontends to load balancer

In this section, you place the resource IDs of two regional load balancers frontends into variables, and then use the variables to add the frontends to the backend address pool of the cross-region load balancer.

Retrieve the resource IDs with [az network lb frontend-ip show](/cli/azure/network/lb/frontend-ip#az-network-lb-frontend-ip-show).

Use [az network cross-region-lb address-pool address add](/cli/azure/network/cross-region-lb/address-pool/address#az-network-cross-region-lb-address-pool-address-add) to add the frontends you placed in variables in the backend pool of the cross-region load balancer:

```azurecli-interactive
  region1id=$(az network lb frontend-ip show \
    --lb-name myLoadBalancer-R1 \
    --name myFrontEnd-R1 \
    --resource-group CreatePubLBQS-rg-r1 \
    --query id \
    --output tsv)

  az network cross-region-lb address-pool address add \
    --frontend-ip-address $region1id \
    --lb-name myLoadBalancer-CR \
    --name myFrontEnd-R1 \
    --pool-name myBackEndPool-CR \
    --resource-group myResourceGroupLB-CR

  region2id=$(az network lb frontend-ip show \
    --lb-name myLoadBalancer-R2 \
    --name myFrontEnd-R2 \
    --resource-group CreatePubLBQS-rg-r2 \
    --query id \
    --output tsv)
  
  az network cross-region-lb address-pool address add \
    --frontend-ip-address $region2id \
    --lb-name myLoadBalancer-CR \
    --name myFrontEnd-R2 \
    --pool-name myBackEndPool-CR \
    --resource-group myResourceGroupLB-CR
```

# [Azure PowerShell](#tab/azurepowershell/)

### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).


```azurepowershell-interactive
$rg = @{
    Name = 'MyResourceGroupLB-CR'
    Location = 'westus'
}
New-AzResourceGroup @rg

```

### Create cross-region load balancer resources

In this section, you create the resources needed for the cross-region load balancer.

A global standard sku public IP is used for the frontend of the cross-region load balancer.

* Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create the public IP address.

* Create a frontend IP configuration with [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig).

* Create a backend address pool with [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig).

* Create a load balancer rule with [Add-AzLoadBalancerRuleConfig](/powershell/module/az.network/add-azloadbalancerruleconfig).

* Create a cross-region load Balancer with [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer).

```azurepowershell-interactive
`## Create global IP address for load balancer ##
$ip = @{
    Name = 'myPublicIP-CR'
    ResourceGroupName = 'MyResourceGroupLB-CR'
    Location = 'westus'
    Sku = 'Standard'
    Tier = 'Global'
    AllocationMethod = 'Static'
}
$publicIP = New-AzPublicIpAddress @ip

## Create frontend configuration ##
$fe = @{
    Name = 'myFrontEnd-CR'
    PublicIpAddress = $publicIP
}
$feip = New-AzLoadBalancerFrontendIpConfig @fe

## Create backend address pool ##
$be = @{
    Name = 'myBackEndPool-CR'
}
$bepool = New-AzLoadBalancerBackendAddressPoolConfig @be

## Create the load balancer rule ##
$rul = @{
    Name = 'myHTTPRule-CR'
    Protocol = 'tcp'
    FrontendPort = '80'
    BackendPort = '80'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bepool
}
$rule = New-AzLoadBalancerRuleConfig @rul

## Create cross-region load balancer resource ##
$lbp = @{
    ResourceGroupName = 'myResourceGroupLB-CR'
    Name = 'myLoadBalancer-CR'
    Location = 'westus'
    Sku = 'Standard'
    Tier = 'Global'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bepool
    LoadBalancingRule = $rule
}
$lb = New-AzLoadBalancer @lbp`
```

## Configure backend pool

In this section, you add two regional standard load balancers to the backend pool of the cross-region load balancer.

> [!IMPORTANT]
> To complete these steps, ensure that two regional load balancers with backend pools have been deployed in your subscription.  For more information, see, **[Quickstart: Create a public load balancer to load balance VMs using Azure PowerShell](quickstart-load-balancer-standard-public-powershell.md)**.

* Use [Get-AzLoadBalancer](/powershell/module/az.network/get-azloadbalancer) and [Get-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/get-azloadbalancerfrontendipconfig) to store the regional load balancer information in variables.

* Use [New-AzLoadBalancerBackendAddressConfig](/powershell/module/az.network/new-azloadbalancerbackendaddressconfig) to create the backend address pool configuration for the load balancer.

* Use [Set-AzLoadBalancerBackendAddressPool](/powershell/module/az.network/new-azloadbalancerbackendaddresspool) to add the regional load balancer frontend to the cross-region backend pool.

```azurepowershell-interactive
 ## Place the region one load balancer configuration in a variable ##
$region1 = @{
    Name = 'myLoadBalancer-R1'
    ResourceGroupName = 'CreatePubLBQS-rg-r1'
}
$R1 = Get-AzLoadBalancer @region1

## Place the region two load balancer configuration in a variable ##
$region2 = @{
    Name = 'myLoadBalancer-R2'
    ResourceGroupName = 'CreatePubLBQS-rg-r2'
}
$R2 = Get-AzLoadBalancer @region2

## Place the region one load balancer frontend configuration in a variable ##
$region1fe = @{
    Name = 'MyFrontEnd-R1'
    LoadBalancer = $R1
}
$R1FE = Get-AzLoadBalancerFrontendIpConfig @region1fe

## Place the region two load balancer frontend configuration in a variable ##
$region2fe = @{
    Name = 'MyFrontEnd-R2'
    LoadBalancer = $R2
}
$R2FE = Get-AzLoadBalancerFrontendIpConfig @region2fe

## Create the cross-region backend address pool configuration for region 1 ##
$region1ap = @{
    Name = 'MyBackendPoolConfig-R1'
    LoadBalancerFrontendIPConfigurationId = $R1FE.Id
}
$beaddressconfigR1 = New-AzLoadBalancerBackendAddressConfig @region1ap

## Create the cross-region backend address pool configuration for region 2 ##
$region2ap = @{
    Name = 'MyBackendPoolConfig-R2'
    LoadBalancerFrontendIPConfigurationId = $R2FE.Id
}
$beaddressconfigR2 = New-AzLoadBalancerBackendAddressConfig @region2ap

## Apply the backend address pool configuration for the cross-region load balancer ##
$bepoolcr = @{
    ResourceGroupName = 'myResourceGroupLB-CR'
    LoadBalancerName = 'myLoadBalancer-CR'
    Name = 'myBackEndPool-CR'
    LoadBalancerBackendAddress = $beaddressconfigR1,$beaddressconfigR2
}
Set-AzLoadBalancerBackendAddressPool @bepoolcr

```

---

## Test the load balancer

# [Azure portal](#tab/azureportal)
In this section, you test the cross-region load balancer. You connect to the public IP address in a web browser.  You stop the virtual machines in one of the regional load balancer backend pools and observe the failover.

1. Find the public IP address for the load balancer on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myPublicIP-cr**.

2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

    :::image type="content" source="./media/tutorial-cross-region-portal/test-cr-lb-1.png" alt-text="Test load balancer" border="true":::

3. Stop the virtual machines in the backend pool of one of the regional load balancers.

4. Refresh the web browser and observe the failover of the connection to the other regional load balancer.

    :::image type="content" source="./media/tutorial-cross-region-portal/test-cr-lb-2.png" alt-text="Test load balancer after failover" border="true":::

# [Azure CLI](#tab/azurecli/)

In this section, you test the cross-region load balancer. You connect to the public IP address in a web browser.  You stop the virtual machines in one of the regional load balancer backend pools and observe the failover.

1. To get the public IP address of the load balancer, use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show):

    ```azurecli-interactive
      az network public-ip show \
        --resource-group myResourceGroupLB-CR \
        --name PublicIPmyLoadBalancer-CR \
        --query ipAddress \
        --output tsv
    ```
2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

3. Stop the virtual machines in the backend pool of one of the regional load balancers.

4. Refresh the web browser and observe the failover of the connection to the other regional load balancer.

# [Azure PowerShell](#tab/azurepowershell/)

In this section, you test the cross-region load balancer. You connect to the public IP address in a web browser.  You stop the virtual machines in one of the regional load balancer backend pools and observe the failover.

1. Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to get the public IP address of the load balancer:

```azurepowershell-interactive
$ip = @{
    Name = 'myPublicIP-CR'
    ResourceGroupName = 'myResourceGroupLB-CR'
}  
Get-AzPublicIPAddress @ip | select IpAddress

```
2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

3. Stop the virtual machines in the backend pool of one of the regional load balancers.

4. Refresh the web browser and observe the failover of the connection to the other regional load balancer.

---
## Clean up resources

# [Azure portal](#tab/azureportal)


When no longer needed, delete the resource group, load balancer, and all related resources. 

To do so, select the resource group **CreateCRLBTutorial-rg** that contains the resources and then select **Delete**.

# [Azure CLI](#tab/azurecli/)

When no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, load balancer, and all related resources.

```azurecli-interactive
  az group delete \
    --name myResourceGroupLB-CR
```

# [Azure PowerShell](#tab/azurepowershell/)

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, load balancer, and the remaining resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'myResourceGroupLB-CR'
```
---

## Next steps

In this tutorial, you:

* Created a cross-region load balancer.
* Added regional load balancers to the backend pool of the cross-region load balancer.
* Created a load-balancing rule.
* Tested the load balancer.

For more information on cross-region load balancer, see:
> [!div class="nextstepaction"]
> [Cross-region load balancer (Preview)](cross-region-overview.md)
