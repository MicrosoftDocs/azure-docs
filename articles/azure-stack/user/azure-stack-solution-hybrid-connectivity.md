---
title: Configure hybrid cloud connectivity with Azure and Azure Stack | Microsoft Docs
description: Learn how to configure hybrid cloud connectivity with Azure and Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 05/07/2018
ms.author: mabrigg
ms.reviewer: Anjay.Ajodha
---

# Tutorial: configure hybrid cloud connectivity with Azure and Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can access resources with security in global Azure and Azure Stack using the hybrid connectivity pattern. 

In this tutorial, you will build a sample environment to:

> [!div class="checklist"]
> - Keep data on-premises for privacy or regulatory requirements, but have access to global Azure resources.
> - Maintain a legacy system while using cloud-scaled app deployment and resources in global Azure.

## Prerequisites

A few components are required to build a hybrid Connectivity deployment and may take some time to prepare. 

An Azure OEM/Hardware Partner may deploy a production Azure Stack, and all users may deploy an ASDK. An Azure Stack Operator must also deploy the App Service, create plans and offers, create a tenant subscription, and add the Windows Server 2016 image. 

If you already have some of these components, make sure they meet the requirements before beginning.

This topic also assumes that you have some knowledge of Azure and Azure Stack. If you want to learn more before proceeding, be sure to start with these topics:
 - [Introduction to Azure](https://azure.microsoft.com/overview/what-is-azure/)
 - [Azure Stack Key Concepts](https://docs.microsoft.com/azure/azure-stack/azure-stack-key-features)

### Azure
 - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
 - Create a [Web App](https://docs.microsoft.com/vsts/build-release/apps/cd/azure/aspnet-core-to-azure-webapp?view=vsts&tabs=vsts#create-an-azure-web-app-using-the-portal) in Azure. Make note of the new Web App URL, as it is used later.

### Azure Stack
 - Use your production Azure Stack or Deploy Azure Stack Development Kit linked below:
    - https://github.com/mattmcspirit/azurestack/blob/master/deployment/ConfigASDK.ps1 
    - The installation usually takes a few hours to complete, so plan accordingly.
 - Deploy [App Service](https://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-deploy) PaaS services to Azure Stack. 
 - [Create Plan/Offers](https://docs.microsoft.com/azure/azure-stack/azure-stack-plan-offer-quota-overview) within the Azure Stack environment. 
 - [Create tenant subscription](https://docs.microsoft.com/azure/azure-stack/azure-stack-subscribe-plan-provision-vm) within the Azure Stack environment. 


### Before you begin

Verify that you have met the following criteria before beginning your configuration:

 - Verify that you have an externally facing public IPv4 address for your VPN device. This IP address cannot be located behind a NAT.
 - Ensure all resources are deployed in the same region/location.

#### Example values

The examples in this article use the following values. You can use these values to create a test environment or refer to them to better understand the examples in this article. For more information about VPN Gateway settings in general, see [About VPN Gateway Settings](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings).

Connection specifications:
 - **VPN type**: Route-based
 - **Connection type**: Site-to-site (IPsec)
 - **Gateway type**: VPN
 - **Azure connection name**: Azure-Gateway-AzureStack-S2SGateway (the portal will auto-fill this value)
 - **Azure Stack connection name**: AzureStack-Gateway-Azure-S2SGateway (the portal will auto-fill this value)
 - **Shared key**: Any compatible with VPN hardware, with matching values on both sides of connection
 - **Subscription**: Any preferred subscription
 - **Resource group**: Test-Infra

| Azure/Azure Stack Connection | Name | Subnet | IP Address |
|-------------------------------------|---------------------------------------------|---------------------------------------|-----------------------------|
| Azure vNet | ApplicationvNet<br>10.100.102.9/23 | ApplicationSubnet<br>10.100.102.0/24 |  |
|  |  | GatewaySubnet<br>10.100.103.0/24 |  |
| Azure Stack vNet | ApplicationvNet<br>10.100.100.0/23 | ApplicationSubnet <br>10.100.100.0/24 |  |
|  |  | GatewaySubnet <br>10.100101.0/24 |  |
| Azure Virtual Network Gateway | Azure-Gateway |  |  |
| Azure Stack Virtual Network Gateway | AzureStack-Gateway |  |  |
| Azure Public IP | Azure-GatewayPublicIP |  | Determined at creation |
| Azure Stack Public IP | AzureStack-GatewayPublicIP |  | Determined at creation |
| Azure Local Network Gateway | AzureStack-S2SGateway<br>   10.100.100.0/23 |  | Azure Stack Public IP Value |
| Azure Stack Local Network Gateway | Azure-S2SGateway<br>10.100.102.0/23 |  | Azure Public IP Value |

## Create a virtual network in global Azure and Azure Stack

> [!Note]  
> You must ensure that there is no overlap of IPs in Azure or Azure Stack vNet address spaces. 

To create a vNet in the Resource Manager deployment model by using the Azure portal. Use the [example values](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#values) if you are using these steps as a tutorial. If you are not doing these steps as a tutorial, be sure to replace the values with your own. 

1. From a browser, navigate to the [Azure portal](http://portal.azure.com/) and sign in with your Azure account.
2. Click **Create a resource**. In the **Search the marketplace** field, enter `virtual network`'`. Locate **Virtual network** from the returned list and open the **Virtual Network** page.
3. Near the bottom of the Virtual Network page, from the **Select a deployment model** list, select **Resource Manager**, and then select **Create**. This opens the 'Create virtual network' page.
4. On the **Create virtual network** page, configure the VNet settings. When you fill in the fields, the red exclamation mark becomes a green check mark when the characters entered in the field are valid.
5. Repeat these steps from the **tenant portal** of Azure Stack.

## Add a gateway subnet

Before connecting your virtual network to a gateway, you first need to create the gateway subnet for the virtual network to which you want to connect. The gateway services use the IP addresses specified in the gateway subnet.

In the [portal](http://portal.azure.com/), navigate to the Resource Manager virtual network for which you want to create a virtual network gateway.

1. In the **Settings** section of your VNet page, select **Subnets** to expand the **Subnets** page.
2. On the **Subnets** page, select **+Gateway subnet** to open the **Add subnet** page.

    ![](media/azure-stack-solution-hybrid-connectivity/image4.png)

3. The **Name** for your subnet is automatically filled in with the value 'GatewaySubnet'. This value is required for Azure to recognize the subnet as the gateway subnet. Adjust the auto-filled **Address range** values to match your configuration requirements, then select **OK** at the bottom of the page to create the subnet.

## Create a Virtual Network Gateway in Azure and Azure Stack

1. On the left side of the portal page, select + and enter 'Virtual Network Gateway' in search. In **Results**, locate and select **Virtual network gateway**.
2. At the bottom of the **Virtual network gateway** page, select **Create**. This opens the **Create virtual network gateway** page.
3. On the **Create virtual network gateway** page, specify the values for your virtual network gateway, as detailed in the Example values plus the additional values detailed below.
    - **SKU**: basic
    - **Virtual Network**: Select the Virtual Network you created earlier. It will automatically select the gateway subnet you created earlier. 
    - **First IP Configuration**:  This is the public IP of your Gateway. 
        - Click the **Create gateway IP configuration** and this will take you to the **Choose public IP address** page.
        - Click **+Create new** to open the **Create public IP address** page.
        - Enter a **Name** for your public IP address. Leave the SKU as **Basic**, then select **OK** at the bottom of this page to save your changes.

    > [!Note]  
    > VPN Gateway currently only supports Dynamic Public IP address allocation. However, this does not mean that the IP address changes after it has been assigned to your VPN gateway. The only time the Public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway.

4. Verify the settings. 
5. Click **Create** to begin creating the VPN gateway. The settings are validated and you'll see the "Deploying Virtual network gateway" tile on the dashboard. Creating a gateway can take up to 45 minutes. You may need to refresh your portal page to see the completed status.

    After the gateway is created, view the IP address that has been assigned to it by looking at the virtual network in the portal. The gateway appears as a connected device. You can select the connected device (your virtual network gateway) to view more information.
6. Repeat these steps on your Azure Stack deployment.

## Create the local network gateway in Azure and Azure Stack

The local network gateway typically refers to your on-premises location. You give the site a name by which Azure or Azure Stack can refer to it, then specify the IP address of the on-premises VPN device to which you will create a connection. You also specify the IP address prefixes that will be routed through the VPN gateway to the VPN device. The address prefixes you specify are the prefixes located on your on-premises network. If your on-premises network changes or you need to change the public IP address for the VPN device, you can easily update the values later.

1. In the portal, select **+Create a resource**.
2. In the search box, enter **Local network gateway**, then press **Enter** to search. This will return a list of results. Click **Local network gateway**, then select the **Create** button to open the **Create local network gateway** page.
3. On the **Create local network gateway page**, specify the values for your local network gateway, as detailed in our Example values plus the additional values detailed below.
    - **IP address**: This is the public IP address of the VPN device that you want Azure or Azure Stack to connect to. Specify a valid public IP address. The IP address cannot be behind NAT and has to be reachable by Azure. If you don't have the IP address right now, you can use the values shown in the example, but you'll need to go back and replace your placeholder IP address with the public IP address of your VPN device. Otherwise, Azure will not be able to connect.
    - **Address Space** refers to the address ranges for the network that this local network represents. You can add multiple address space ranges. Make sure that the ranges you specify here do not overlap with ranges of other networks that you want to connect to. Azure will route the address range that you specify to the on-premises VPN device IP address. Use your own values here if you want to connect to your on-premises site, not the values shown in the example.
    - **Configure BGP settings**: Use only when configuring BGP. Otherwise, don't select this.
    - **Subscription**: Verify that the correct subscription is showing.
    - **Resource Group**: Select the resource group that you want to use. You can either create a new resource group, or select one that you have already created.
    - **Location**: Select the location that this object will be created in. You may want to select the same location that your VNet resides in, but you are not required to do so.
4. When you have finished specifying the values, select the **Create** button at the bottom of the page to create the local network gateway.
5. Repeat these steps on your Azure Stack deployment.

## Configure your connection

Site-to-Site connections to an on-premises network require a VPN device. In this step, you configure your VPN device, known as a Connection. When configuring your Connection, you need the following:
    - A shared key. This is the same shared key that you specify when creating your Site-to-Site VPN connection. In our examples, we use a basic shared key. We recommend that you generate a more complex key to use.
    - The Public IP address of your virtual network gateway. You can view the public IP address by using the Azure portal, PowerShell, or CLI. To find the Public IP address of your VPN gateway using the Azure portal, navigate to Virtual network gateways, then select the name of your gateway.
Create the Site-to-Site VPN connection between your virtual network gateway and your on-premises VPN device.
1. In the portal, select **+Create a resource**.
2. In the search box, enter **Connections**, then press **Enter** to search. This will return a list of results. Click **Connections**, then select the Create button to open the **Create Connections** page.
3. On the **Create Connections** page, configure the values for your connection.
     - Basics:
        1. **Connection type**: Select Site-to-site (IPSec).
        2. **Resource Group**: (select your test resource group)
     - Settings:
        1. **Virtual Network Gateway**: Select the Virtual Network gateway you created earlier.
        2. **Local Network Gateway**: Select the Local Network Gateway you created earlier. 
        3. **Connection Name**: This will auto populate with the values from the two gateways. 
        4. **Shared Key**: the value here must match the value that you are using for your local on-premises VPN device. The example uses 'abc123', but you can (and should) use something more complex. The important thing is that the value you specify here must be the same value that you specify when configuring your VPN device.
    - The remaining values for **Subscription**, **Resource Group**, and **Location** are fixed.
4. Click **OK** to create your connection. You'll see Creating Connection flash on the screen.
5. You can view the connection in the **Connections page of the virtual network gateway. The status will go from **Unknown** to **Connecting**, and then to **Succeeded**.

## Next steps

- To learn more about Azure Cloud Patterns, see [Cloud Design Patterns](https://docs.microsoft.com/azure/architecture/patterns).
