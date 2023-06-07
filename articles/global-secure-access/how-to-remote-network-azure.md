---
title: Simulate remote network connectivity for Microsoft Entra Private Acces or Microsoft Entra Internet Access
description: Use Azure virtual network gateway to simulate customer premises equipment

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 06/02/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: absinh
---
# Configure Azure Virtual Network Gateway to simulate remote network connectivity

Instead of using a physical customer premise equipment (CPE) to set up the IPSec tunnel with our Global Secure Access service endpoint, you can also use Azure Virtual Network Gateway (VNG). A VNG can be used to simulate customer premises equipment (CPE) and to test branch connectivity. 

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

- [Special-Purpose Autonomous System (AS) Numbers](https://www.iana.org/assignments/iana-as-numbers-special-registry/iana-as-numbers-special-registry.xhtml#special-purpose-as-numbers)

## Prerequisites

- A working Azure tenant with the appropriate licenses. If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A user with the ability to create, edit, and delete the following resource types:
   - Resource groups 
   - Azure Network Gateways 
   - Azure Local Network Gateways 
   - Virtual Networks 
   - Virtual Machines 
   - Network Security Groups 
- A user with the Entra Network Access Administrator role assigned.
- A defined remote network created using the steps in the article, [How to create a remote network](how-to-create-remote-networks.md).


## Simulate customer premises equipment and branch connectivity

In the following example, we create a virtual network gateway to simulate CPE and connectivity.

We'll create all of our resources inside of the same resource group so that they can be cleaned up easily after the fact. 

<!---GlobalSecureAccess-Pilot--->

### Create a resource group

1. Sign in to the **Azure portal** as a user with the appropriate permissions.
1. Select **Create a resource**.
1. Search for and select **Resource group**.
   :::image type="content" source="media/how-to-remote-network-azure/create-a-resource-search.png" alt-text="Screenshot of the Azure portal showing the marketplace.":::
1. Select **Create**.
1. On the **Create a resource group** page:
   1. Select the desired subscription.
   1. Provide a descriptive name for your resource group.
   1. Select the desired region for the deployment.
   1. Select **Review + create**.
1. Confirm your settings and select **Create**.

### Create a virtual network

1. Browse to the resource group created previously.
1. Select **Create**.
1. Search for and select **Virtual network**.
1. Select **Create**.
1. On the **Create virtual network** page:
   1. Select the subscription and the resource group defined previously.
   1. Provide a descriptive **Virtual network name**.
   1. Select the desired region for the deployment.
   1. For this tutorial, we accept the default configuration and select **Review + create**.
1. Select **Create**.
1. When the deployment is complete, select **Go to resource**.
1. Browse to **Subnets** on the left side of the virtual network window.
1. Select **+ Gateway subnet** on the top menu.
   1. Leave the defaults selected.
1. Select **Save**

### Create a virtual network gateway

1. Browse to the resource group created previously.
1. Select **Create**.
1. Search for and select **Virtual network gateway**.
1. Select **Create**.
1. On the **Create virtual network gateway** page:
   1. Select the subscription and the resource group defined previously.
   1. Provide a descriptive **Name**.
   1. For **Gateway type**, select **VPN**.
   1. For **VPN type**, select **Route-based**.
   1. For **Virtual network**, select the virtual network you created previously.
   1. For **Public IP address**, select **Create new** and provide a descriptive **Public IP address name**.
   1. Select an **Availability zone**.
   1. For **Enable active-active mode** select **Enabled**.
   1. For **Second public IP address**, select **Create new** and provide a descriptive **Public IP address name**.
   1. For **Configure BGP**, select **Enabled**.
   1. Provide the **Autonomous system number (ASN)** for this connection. 
      > [!IMPORTANT] 
      > Don't use the default 65515 ASN or the Azure reserved ASNs 12076, 65517,65518, 65519, 65520, 8076, 8075 as these will cause an error later in the process. For more information about valid ASN values, see the [IANA reference Special-Purpose Autonomous System (AS) Numbers](https://www.iana.org/assignments/iana-as-numbers-special-registry/iana-as-numbers-special-registry.xhtml#special-purpose-as-numbers)
	1. Leave the **Custom Azure APIPA BGP IP address** field empty.
	1. Select **Review + create**.
	1. Confirm your settings and select **Create**.
		
This deployment may take up to 30 minutes to complete. You may proceed to the next section while the deployment is running.

### Create a local network gateway

1. Browse to the resource group created previously.
1. Select **Create**.
1. Search for and select **Local network gateway**.
1. Select **Create**.
1. On the **Create local network gateway** page:
   1. Select the subscription and the resource group defined previously.
   1. Provide a descriptive **Name**.
   1. For **Endpoint**, select **IP address**.
	1. In the **IP address** field, enter the public IP address for the primary VPN endpoint that you see under View Connectivity Configuration in Entra portal.

