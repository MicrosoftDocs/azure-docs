---
title: 'Tutorial: Secure your virtual hub using Azure Firewall Manager'
description: In this tutorial, you learn how to secure your virtual hub with Azure Firewall Manager using the Azure portal. 
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.topic: tutorial
ms.date: 01/12/2023
ms.author: victorh
---

# Tutorial: Secure your virtual hub using Azure Firewall Manager

Using Azure Firewall Manager, you can create secured virtual hubs to secure your cloud network traffic destined to private IP addresses, Azure PaaS, and the Internet. Traffic routing to the firewall is automated, so there's no need to create user-defined routes (UDRs).

Firewall Manager also supports a hub virtual network architecture. For a comparison of the secured virtual hub and hub virtual network architecture types, see [What are the Azure Firewall Manager architecture options?](vhubs-and-vnets.md)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create the spoke virtual network
> * Create a secured virtual hub
> * Connect the hub and spoke virtual networks
> * Route traffic to your hub
> * Deploy the servers
> * Create a firewall policy and secure your hub
> * Test the firewall

> [!IMPORTANT]
> The procedure in this tutorial uses Azure Firewall Manager to create a new Azure Virtual WAN secured hub.
> You can use Firewall Manager to upgrade an existing hub, but you can't configure Azure **Availability Zones** for Azure Firewall.
> It is also possible to convert an existing hub to a secured hub using the Azure portal, as described in [Configure Azure Firewall in a Virtual WAN hub](../virtual-wan/howto-firewall.md). But like Azure Firewall Manager, you can't configure **Availability Zones**.
> To upgrade an existing hub and specify **Availability Zones** for Azure Firewall (recommended) you must follow the upgrade procedure in [Tutorial: Secure your virtual hub using Azure PowerShell](secure-cloud-network-powershell.md).

:::image type="content" source="media/secure-cloud-network/secure-cloud-network.png" alt-text="Diagram showing the secure cloud network.":::

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a hub and spoke architecture

First, create spoke virtual networks where you can place your servers.

### Create two spoke virtual networks and subnets

The two virtual networks will each have a workload server in them and will be protected by the firewall.

1. From the Azure portal home page, select **Create a resource**.
2. Search for **Virtual network**, and select **Create**.
3. For **Subscription**, select your subscription.
4. For **Resource group**, select **Create new**, and type **fw-manager-rg** for the name and select **OK**.
5. For **Name**, type **Spoke-01**.
6. For **Region**, select **East US**.
7. Select **Next: IP Addresses**.
8. For **Address space**, accept the default **10.0.0.0/16**.
9. Select **Add subnet**.
10. For **Subnet name**, type  **Workload-01-SN**.
11. For **Subnet address range**, type **10.0.1.0/24**.
12. Select **Add**.
13. Select **Review + create**.
14. Select **Create**.

Repeat this procedure to create another similar virtual network in the **fw-manager-rg** resource group:

Name: **Spoke-02**<br>
Address space: **10.1.0.0/16**<br>
Subnet name: **Workload-02-SN**<br>
Subnet address range: **10.1.1.0/24**

### Create the secured virtual hub

Create your secured virtual hub using Firewall Manager.

1. From the Azure portal home page, select **All services**.
2. In the search box, type **Firewall Manager** and select **Firewall Manager**.
3. On the **Firewall Manager** page under **Deployments**, select **Virtual hubs**.
4. On the **Firewall Manager | Virtual hubs** page, select **Create new secured virtual hub**.

    :::image type="content" source="./media/secure-cloud-network/1-create-new-secured-virtual-hub.jpg" alt-text="Screenshot of creating a new secured virtual hub." lightbox="./media/secure-cloud-network/1-create-new-secured-virtual-hub.jpg":::

1. Select your **Subscription**.
5. For **Resource group**, select **fw-manager-rg**.
6. For **Region**, select **East US**.
7. For the **Secured virtual hub name**, type **Hub-01**.
8. For **Hub address space**, type **10.2.0.0/16**.
10. Select **New vWAN**.
9. For the new virtual WAN name, type **Vwan-01**.
1. For **Type** Select **Standard**.
1. Leave the **Include VPN gateway to enable Trusted Security Partners** check box cleared.

    :::image type="content" source="./media/secure-cloud-network/2-create-new-secured-virtual-hub.png" alt-text="Screenshot of creating a new virtual hub with properties." lightbox="./media/secure-cloud-network/2-create-new-secured-virtual-hub.png":::

12. Select **Next: Azure Firewall**.
13. Accept the default **Azure Firewall** **Enabled** setting.
14. For **Azure Firewall tier**, select **Standard**.
15. Select the desired combination of **Availability Zones**. 

> [!IMPORTANT]
> A Virtual WAN is a collection of hubs and services made available inside the hub. You can deploy as many Virtual WANs that you need. In a Virtual WAN hub, there are multiple services like VPN, ExpressRoute, and so on. Each of these services is automatically deployed across Availability Zones except Azure Firewall, if the region supports Availability Zones. To align with Azure Virtual WAN resiliency, you should select all available Availability Zones.

   :::image type="content" source="./media/secure-cloud-network/3-azure-firewall-parameters-with-zones.png" alt-text="Screenshot of configuring Azure Firewall parameters." lightbox="./media/secure-cloud-network/3-azure-firewall-parameters-with-zones.png":::

16. Select the **Firewall Policy** to apply at the new Azure Firewall instance. Select **Default Deny Policy**, you'll refine your settings later in this article.
17. Select **Next: Security Partner Provider**.

    :::image type="content" source="./media/secure-cloud-network/4-trusted-security-partner.png" alt-text="Screenshot of configuring Trusted Partners parameters." lightbox="./media/secure-cloud-network/4-trusted-security-partner.png":::

18. Accept the default **Trusted Security Partner** **Disabled** setting, and select **Next: Review + create**.
19. Select **Create**. 

    :::image type="content" source="./media/secure-cloud-network/5-confirm-and-create.png" alt-text="Screenshot of creating the Firewall instance." lightbox="./media/secure-cloud-network/5-confirm-and-create.png":::

> [!NOTE]
> It may take up to 30 minutes to create a secured virtual hub.

You can get the firewall public IP address after the deployment completes.

1. Open **Firewall Manager**.
2. Select **Virtual hubs**.
3. Select **hub-01**.
4. Under **Azure Firewall**, select **Public IP configuration**.
5. Note the public IP address to use later.

### Connect the hub and spoke virtual networks

Now you can peer the hub and spoke virtual networks.

1. Select the **fw-manager-rg** resource group, then select the **Vwan-01** virtual WAN.
2. Under **Connectivity**, select **Virtual network connections**.

    :::image type="content" source="./media/secure-cloud-network/7b-connect-the-hub-and-spoke.png" alt-text="Screenshot of adding Virtual Network connections." lightbox="./media/secure-cloud-network/7b-connect-the-hub-and-spoke.png":::

3. Select **Add connection**.
4. For **Connection name**, type **hub-spoke-01**.
5. For **Hubs**, select **Hub-01**.
6. For **Resource group**, select **fw-manager-rg**.
7. For **Virtual network**, select **Spoke-01**.
8. Select **Create**.
9. Repeat to connect the **Spoke-02** virtual network: connection name - **hub-spoke-02**

## Deploy the servers

1. On the Azure portal, select **Create a resource**.
2. Select **Windows Server 2019 Datacenter** in the **Popular** list.
3. Enter these values for the virtual machine:

   |Setting  |Value  |
   |---------|---------|
   |Resource group     |**fw-manager-rg**|
   |Virtual machine name     |**Srv-workload-01**|
   |Region     |**(US) East US)**|
   |Administrator user name     |type a user name|
   |Password     |type a password|

4. Under **Inbound port rules**, for **Public inbound ports**, select **None**.
5. Accept the other defaults and select **Next: Disks**.
6. Accept the disk defaults and select **Next: Networking**.
7. Select **Spoke-01** for the virtual network and select **Workload-01-SN** for the subnet.
8. For **Public IP**, select **None**.
9. Accept the other defaults and select **Next: Management**.
1. Select **Next:Monitoring**.
1. Select **Disable** to disable boot diagnostics. Accept the other defaults and select **Review + create**.
1. Review the settings on the summary page, and then select **Create**.

Use the information in the following table to configure another virtual machine named **Srv-Workload-02**. The rest of the configuration is the same as the **Srv-workload-01** virtual machine.

|Setting  |Value  |
|---------|---------|
|Virtual network|**Spoke-02**|
|Subnet|**Workload-02-SN**|

After the servers are deployed, select a server resource, and in **Networking** note the private IP address for each server.

## Create a firewall policy and secure your hub

A firewall policy defines collections of rules to direct traffic on one or more Secured virtual hubs. You'll create your firewall policy and then secure your hub.

1. From Firewall Manager, select **Azure Firewall policies**.

    :::image type="content" source="./media/secure-cloud-network/6-create-azure-firewall-policy1.png" alt-text="Screenshot of creating an Azure Policy with first step." lightbox="./media/secure-cloud-network/6-create-azure-firewall-policy1.png":::

2. Select **Create Azure Firewall Policy**.

    :::image type="content" source="./media/secure-cloud-network/6-create-azure-firewall-policy-basics 2.png" alt-text="Screenshot of configuring Azure Policy settings in first step." lightbox="./media/secure-cloud-network/6-create-azure-firewall-policy-basics 2.png":::

3. For **Resource group**, select **fw-manager-rg**.
4. Under **Policy details**, for the **Name** type **Policy-01** and for **Region** select **East US**.
5. For **Policy tier**, select **Standard**.
6. Select **Next: DNS Settings**.

    :::image type="content" source="./media/secure-cloud-network/6-create-azure-firewall-policy-dns3.png" alt-text="Screenshot of configuring DNS settings." lightbox="./media/secure-cloud-network/6-create-azure-firewall-policy-dns3.png":::

7. Select **Next: TLS Inspection**.

    :::image type="content" source="./media/secure-cloud-network/6-create-azure-firewall-policy-tls4.png" alt-text="Screenshot of configuring TLS settings." lightbox="./media/secure-cloud-network/6-create-azure-firewall-policy-tls4.png":::

8. Select **Next : Rules**.
9. On the **Rules** tab, select **Add a rule collection**.

    :::image type="content" source="./media/secure-cloud-network/6-create-azure-firewall-policy-add-rule-collection6.png" alt-text="Screenshot of configuring Rule Collection." lightbox="./media/secure-cloud-network/6-create-azure-firewall-policy-add-rule-collection6.png":::

10. On the **Add a rule collection** page, type **App-RC-01** for the **Name**.
11. For **Rule collection type**, select **Application**.
12. For **Priority**, type **100**.
13. Ensure **Rule collection action** is **Allow**.
14. For the rule **Name** type **Allow-msft**.
15. For the **Source type**, select **IP address**.
16. For **Source**, type **\***.
17. For **Protocol**, type **http,https**.
18. Ensure **Destination type** is **FQDN**.
19. For **Destination**, type **\*.microsoft.com**.
20. Select **Add**.

21. Add a **DNAT rule** so you can connect a remote desktop to the **Srv-Workload-01** virtual machine.

    1. Select **Add/Rule collection**.
    2. For **Name**, type **dnat-rdp**.
    3. For **Rule collection type**, select **DNAT**.
    4. For **Priority**, type **100**.
    5. For the rule **Name** type **Allow-rdp**.
    6. For the **Source type**, select **IP address**.
    7. For **Source**, type **\***.
    8. For **Protocol**, select **TCP**.
    9. For **Destination Ports**, type **3389**.
    10. For **Destination Type**, select **IP Address**.
    11. For **Destination**, type the firewall public IP address that you noted previously.
    1. For **Translated type**, select **IP Address**.
    1. For **Translated address**, type the private IP address for **Srv-Workload-01** that you noted previously.
    1. For **Translated port**, type **3389**.
    1. Select **Add**.

22. Add a **Network rule** so you can connect a remote desktop from **Srv-Workload-01** to **Srv-Workload-02**.

    1. Select **Add a rule collection**.
    2. For **Name**, type **vnet-rdp**.
    3. For **Rule collection type**, select **Network**.
    4. For **Priority**, type **100**.
    5. For **Rule collection action**, select **Allow**.
    6. For the rule **Name** type **Allow-vnet**.
    7. For the **Source type**, select **IP address**.
    8. For **Source**, type **\***.
    9. For **Protocol**, select **TCP**.
    10. For **Destination Ports**, type **3389**.
    11. For **Destination Type**, select **IP Address**.
    12. For **Destination**, type the **Srv-Workload-02** private IP address that you noted previously.
    13. Select **Add**.


1. Select **Next: IDPS**.
23. On the **IDPS** page, select **Next: Threat Intelligence**

    :::image type="content" source="./media/secure-cloud-network/6-create-azure-firewall-policy-idps7.png" alt-text="Screenshot of configuring IDPS settings." lightbox="./media/secure-cloud-network/6-create-azure-firewall-policy-idps7.png":::

24. In the **Threat Intelligence** page, accept defaults and select **Review and Create**:

    :::image type="content" source="./media/secure-cloud-network/7a-create-azure-firewall-policy-threat-intelligence7.png" alt-text="Screenshot of configuring Threat Intelligence settings." lightbox="./media/secure-cloud-network/7a-create-azure-firewall-policy-threat-intelligence7.png":::

25. Review to confirm your selection and then select **Create**.

## Associate policy

Associate the firewall policy with the hub.

1. From Firewall Manager, select **Azure Firewall Policies**.
2. Select the check box for **Policy-01**.
3. Select **Manage associations**, **Associate hubs**.

    :::image type="content" source="./media/secure-cloud-network/8-associate-policy1.png" alt-text="Screenshot of configuring Policy association." lightbox="./media/secure-cloud-network/8-associate-policy1.png":::

4. Select **hub-01**.
5. Select **Add**.

   :::image type="content" source="./media/secure-cloud-network/8-associate-policy2.png" alt-text="Screenshot of adding Policy and Hub settings." lightbox="./media/secure-cloud-network/8-associate-policy2.png":::

## Route traffic to your hub

Now you must ensure that network traffic gets routed through your firewall.

1. From Firewall Manager, select **Virtual hubs**.
2. Select **Hub-01**.
3. Under **Settings**, select **Security configuration**.
4. Under **Internet traffic**, select **Azure Firewall**.
5. Under **Private traffic**, select **Send via Azure Firewall**.
   > [!NOTE]
   > If you're using public IP address ranges for private networks in a virtual network or an on-premises branch, you need to explicitly specify these IP address prefixes. Select the **Private Traffic Prefixes** section and then add them alongside the RFC1918 address prefixes.
7. Under **Inter-hub**, select **Enabled** to enable the Virtual WAN routing intent feature. Routing intent is the mechanism through which you can configure Virtual WAN to route branch-to-branch (on-premises to on-premises) traffic via Azure Firewall deployed in the Virtual WAN Hub. For more information regarding prerequisites and considerations associated with the routing intent feature, see [Routing Intent documentation](../virtual-wan/how-to-routing-policies.md). 
8. Select **Save**.
9. Select **OK** on the **Warning** dialog.

   :::image type="content" source="./media/secure-cloud-network/9a-firewall-warning.png" alt-text="Screenshot of Secure Connections." lightbox="./media/secure-cloud-network/9a-firewall-warning.png":::

   > [!NOTE]
   > It takes a few minutes to update the route tables.

8. Verify that the two connections show Azure Firewall secures both Internet and private traffic.

   :::image type="content" source="./media/secure-cloud-network/9b-secured-connections.png" alt-text="Screenshot of Secure Connections final status." lightbox="./media/secure-cloud-network/9b-secured-connections.png":::

## Test the firewall

To test the firewall rules, you'll connect a remote desktop using the firewall public IP address, which is NATed to **Srv-Workload-01**. From there you'll use a browser to test the application rule and connect a remote desktop to **Srv-Workload-02** to test the network rule.

### Test the application rule

Now, test the firewall rules to confirm that it works as expected.

1. Connect a remote desktop to firewall public IP address, and sign in.

2. Open Internet Explorer and browse to `https://www.microsoft.com`.
3. Select **OK** > **Close** on the Internet Explorer security alerts.

   You should see the Microsoft home page.

4. Browse to `https://www.google.com`.

   You should be blocked by the firewall.

So now you've verified that the firewall application rule is working:

* You can browse to the one allowed FQDN, but not to any others.

### Test the network rule

Now test the network rule.

- From Srv-Workload-01, open a remote desktop to the Srv-Workload-02 private IP address.

   A remote desktop should connect to Srv-Workload-02.

So now you've verified that the firewall network rule is working:
* You can connect a remote desktop to a server located in another virtual network.

## Clean up resources

When you’re done testing your firewall resources, delete the **fw-manager-rg** resource group to delete all firewall-related resources.

## Next steps

> [!div class="nextstepaction"]
> [Learn about trusted security partners](trusted-security-partners.md)
