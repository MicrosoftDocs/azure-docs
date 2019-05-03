---
title: Quickstart:Create a Standard Load Balancer - Azure Resource Manager template
titlesuffix: Azure Load Balancer
description: This quickstart shows how to create a Standard Load Balancer by using the Azure Resource Manager template.
services: load-balancer
documentationcenter: na
author: KumudD 
manager: twooley
Customer intent: I want to create a Standard Load Balancer by using Azure Resource Manager template so that I can load balance internet traffic to VMs.
ms.service: load-balancer
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/02/2019
ms.author: kumud
ms.custom: mvc
---

# Quickstart: Create a Standard Load Balancer to load balance VMs by using Azure Resource Manager template

Load balancing provides a higher level of availability and scale by spreading incoming requests across multiple virtual machines. You can use the Azure portal to create a load balancer to load balance virtual machines (VMs). This quickstart shows you how to load balance VMs using a Standard Load Balancer.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Create a standard load balancer

In this section, you create a Standard Load Balancer that helps load balance virtual machines. Standard Load Balancer only supports a Standard Public IP address. When you create a Standard Load Balancer, and you must also create a new Standard Public IP address that is configured as the frontend (named as *LoadBalancerFrontend* by default) for the Standard Load Balancer. There are many methods that can be used to create a standard load balancer. In this quickstart, you use a Resource Manager template. Resource Manager templates are JSON files that define the resources you need to deploy for your solution. To understand the concepts associated with deploying and managing your Azure solutions, see [Azure Resource Manager documentation](/azure/azure-resource-manager/).

1. Select the following image to sign in to Azure and open a template. The template creates a key vault and a secret.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-key-vault-create%2Fazuredeploy.json"><img src="./media/quickstart-load-balancer-standard-public-template/deploy-to-azure.png" alt="deploy to azure"/></a>

2. Select or enter the following values.  

    ![Resource Manager template Key Vault integration deploy portal](./media/quick-create-template/create-standard-load-balancer-using-template-portal.png)

    Unless it is specified, use the default value to create the key vault and a secret.

    * **Subscription**: select an Azure subscription.
    * **Resource group**: select **Create new**, enter a unique name for the resource group, and then click **OK**. 
    * **Location**: select a location.  For example, **Central US**.
    * **Key Vault Name**: enter a unique name for the key vault.  
    * **Tenant Id**: the template function automatically retrieve your tenant id.  Don't change the default value
    * **Ad User Id**: enter your Azure AD user object ID that you retrieved from [Prerequisites](#prerequisites).
    * **Secret Name**: enter a name for the secret that you store in the key vault.  For example, **adminpassword**
    * **Secret Value**: enter the secret value.  If you store a password, it is recommended to use the generated password you created in Prerequisites.
    * **I agree to the terms and conditions state above**: Select.
3. Select **Purchase**.

## Test the Load Balancer

1. Find the public IP address for the Load Balancer on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myPublicIP**.

2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

   ![IIS Web server](./media/tutorial-load-balancer-standard-zonal-portal/load-balancer-test.png)

To see the Load Balancer distribute traffic across all three VMs, you can customize the default page of each VM's IIS Web server and then force-refresh your web browser from the client machine.

## Clean up resources

When no longer needed, delete the resource group, Load Balancer, and all related resources. To do so, select the resource group (*myResourceGroupSLB*) that contains the Load Balancer, and then select **Delete**.

## Next steps

In this quickstart, you created a Standard Load Balancer, attached VMs to it, configured the Load Balancer traffic rule, health probe, and then tested the Load Balancer. To learn more about Azure Load Balancer, continue to the tutorials for Azure Load Balancer.

> [!div class="nextstepaction"]
> [Azure Load Balancer tutorials](tutorial-load-balancer-standard-public-zone-redundant-portal.md)
