---
title: Install On-premises data gateway | Microsoft Docs
description: Learn how to install and configure an On-premises data gateway.
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 09/10/2018
ms.author: owend
ms.reviewer: minewiskan

---
# Install and configure an on-premises data gateway
An on-premises data gateway is required when one or more Azure Analysis Services servers in the same region connect to on-premises data sources. To learn more about the gateway, see [On-premises data gateway](analysis-services-gateway.md).

## Prerequisites
**Minimum Requirements:**

* .NET 4.5 Framework
* 64-bit version of Windows 7 / Windows Server 2008 R2 (or later)

**Recommended:**

* 8 Core CPU
* 8 GB Memory
* 64-bit version of Windows 2012 R2 (or later)

**Important considerations:**

* During setup, when registering your gateway with Azure, the default region for your subscription is selected. You can choose a different region. If you have servers in more than one region, you must install a gateway for each region. 
* The gateway cannot be installed on a domain controller.
* Only one gateway can be installed on a single computer.
* Install the gateway on a computer that remains on and does not go to sleep.
* Do not install the gateway on a computer wirelessly connected to your network. Performance can be diminished.
* When installing the gateway, the user account you're signed in to your computer with must have Log on as service privileges. When install is complete, the On-premises data gateway service uses the NT SERVICE\PBIEgwService account to log on as a service. A different account can be specified during setup or in Services after setup is complete. Ensure Group Policy settings allow both the account you're signed in with when installing and the service account you choose have Log on as service privileges.
* Sign in to Azure with an account in Azure AD for the same [tenant](https://msdn.microsoft.com/library/azure/jj573650.aspx#BKMK_WhatIsAnAzureADTenant) as the subscription you are registering the gateway in. Azure B2B (guest) accounts are not supported when installing and registering a gateway.
* If data sources are on an Azure Virtual Network (VNet), you must configure the [AlwaysUseGateway](analysis-services-vnet-gateway.md) server property.
* The (unified) gateway described here is not supported in Azure Government, Azure Germany, and Azure China sovereign regions. Use **Dedicated On-premises gateway for Azure Analysis Services**, installed from your server's **Quick Start** in the portal. 


## <a name="download"></a>Download
 [Download the gateway](https://aka.ms/azureasgateway)

## <a name="install"></a>Install

1. Run setup.

2. Select a location, accept the terms, and then click **Install**.

   ![Install location and license terms](media/analysis-services-gateway-install/aas-gateway-installer-accept.png)

3. Sign in to Azure. The account must be in your tenant's Azure Active Directory. This account is used for the gateway administrator. Azure B2B (guest) accounts are not supported when installing and registering the gateway.

   ![Sign in to Azure](media/analysis-services-gateway-install/aas-gateway-installer-account.png)

   > [!NOTE]
   > If you sign in with a domain account, it's mapped to your organizational account in Azure AD. Your organizational account is used as the gateway administrator.

## <a name="register"></a>Register
In order to create a gateway resource in Azure, you must register the local instance you installed with the Gateway Cloud Service. 

1.  Select **Register a new gateway on this computer**.

    ![Register](media/analysis-services-gateway-install/aas-gateway-register-new.png)

2. Type a name and recovery key for your gateway. By default, the gateway uses your subscription's default region. If you need to select a different region, select **Change Region**.

    > [!IMPORTANT]
    > Save your recovery key in a safe place. The recovery key is required in-order to takeover, migrate, or restore a gateway. 

   ![Register](media/analysis-services-gateway-install/aas-gateway-register-name.png)


## <a name="create-resource"></a>Create an Azure gateway resource
After you've installed and registered your gateway, you need to create a gateway resource in your Azure subscription. Sign in to Azure with the same account you used when registering the gateway.

1. In Azure portal, click **Create a resource** > **Integration** > **On-premises data gateway**.

   ![Create a gateway resource](media/analysis-services-gateway-install/aas-gateway-new-azure-resource.png)

2. In **Create connection gateway**, enter these settings:

    * **Name**: Enter a name for your gateway resource. 

    * **Subscription**: Select the Azure subscription 
    to associate with your gateway resource. 
   
      The default subscription is based on the 
      Azure account that you used to sign in.

    * **Resource group**: Create a resource group or select an existing resource group.

    * **Location**: Select the region you registered your gateway in.

    * **Installation Name**: If your gateway installation isn't already selected, 
    select the gateway registered. 

    When you're done, click **Create**.

## <a name="connect-servers"></a>Connect servers to the gateway resource

1. In your Azure Analysis Services server overview, click **On-Premises Data Gateway**.

   ![Connect server to gateway](media/analysis-services-gateway-install/aas-gateway-connect-server.png)

2. In **Pick an On-Premises Data Gateway to connect**, select your gateway resource, and then click **Connect selected gateway**.

   ![Connect server to gateway resource](media/analysis-services-gateway-install/aas-gateway-connect-resource.png)

    > [!NOTE]
    > If your gateway does not appear in the list, your server is likely not in the same region as the region you specified when registering the gateway. 

That's it. If you need to open ports or do any troubleshooting, be sure to check out [On-premises data gateway](analysis-services-gateway.md).

## Next steps
* [Manage Analysis Services](analysis-services-manage.md)   
* [Get data from Azure Analysis Services](analysis-services-connect.md)   
* [Use gateway for data sources on an Azure Virtual Network](analysis-services-vnet-gateway.md)
