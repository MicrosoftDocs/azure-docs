---
title: 'Tutorial: Secure your virtual hub using Azure Firewall Manager'
description: In this tutorial, you learn how to secure your virtual hub with Azure Firewall Manager using the Azure portal. 
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.topic: tutorial
ms.date: 03/19/2021
ms.author: victorh
---

# Tutorial: Secure your virtual hub using Azure Firewall Manager

Using Azure Firewall Manager, you can create secured virtual hubs to secure your cloud network traffic destined to private IP addresses, Azure PaaS, and the Internet. Traffic routing to the firewall is automated, so there's no need to create user defined routes (UDRs).

![secure the cloud network](media/secure-cloud-network/secure-cloud-network.png)

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

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a hub and spoke architecture

First, create spoke virtual networks where you can place your servers.

### Create two spoke virtual networks and subnets

The two virtual networks will each have a workload server in them and will be protected by the firewall.

1. From the Azure portal home page, select **Create a resource**.
2. Search for **Virtual network**, and select **Create**.
2. For **Subscription**, select your subscription.
1. For **Resource group**, select **Create new**, and type **fw-manager-rg** for the name and select **OK**.
2. For **Name**, type **Spoke-01**.
3. For **Region**, select **(US) East US**.
4. Select **Next: IP Addresses**.
1. For **Address space**, type **10.0.0.0/16**.
3. Under **Subnet name**, select **default**.
4. For **Subnet name**, type  **Workload-01-SN**.
5. For **Subnet address range**, type **10.0.1.0/24**.
6. Select **Save**.
1. Select **Review + create**.
2. Select **Create**.

Repeat this procedure to create another similar virtual network:

Name: **Spoke-02**<br>
Address space: **10.1.0.0/16**<br>
Subnet name: **Workload-02-SN**<br>
Subnet address range: **10.1.1.0/24**

### Create the secured virtual hub

Create your secured virtual hub using Firewall Manager.

1. From the Azure portal home page, select **All services**.
2. In the search box, type **Firewall Manager** and select **Firewall Manager**.
3. On the **Firewall Manager** page, select **View secured virtual hubs**.
4. On the **Firewall Manager | Secured virtual hubs** page, select **Create new secured virtual hub**.
5. For **Resource group**, select **fw-manager-rg**.
7. For **Region**, select **East US**.
1. For the **Secured virtual hub name**, type **Hub-01**.
2. For **Hub address space**, type **10.2.0.0/16**.
3. For the new vWAN name, type **Vwan-01**.
4. Leave the **Include VPN gateway to enable Trusted Security Partners** check box cleared.
5. Select **Next: Azure Firewall**.
6. Accept the default **Azure Firewall** **Enabled** setting and then select **Next: Trusted Security Partner**.
7. Accept the default **Trusted Security Partner** **Disabled** setting, and select **Next: Review + create**.
8. Select **Create**. 

   It takes about 30 minutes to deploy.

You can get the firewall public IP address after the deployment completes.

1. Open **Firewall Manager**.
2. Select **Virtual hubs**.
3. Select **hub-01**.
7. Select **Public IP configuration**.
8. Note the public IP address to use later.

### Connect the hub and spoke virtual networks

Now you can peer the hub and spoke virtual networks.

1. Select the **fw-manager-rg** resource group, then select the **Vwan-01** virtual WAN.
2. Under **Connectivity**, select **Virtual network connections**.
3. Select **Add connection**.
4. For **Connection name**, type **hub-spoke-01**.
5. For **Hubs**, select **Hub-01**.
6. For **Resource group**, select **fw-manager-rg**.
7. For **Virtual network**, select **Spoke-01**.
8. Select **Create**.

Repeat to connect the **Spoke-02** virtual network: connection name - **hub-spoke-02**

## Deploy the servers

1. On the Azure portal, select **Create a resource**.
2. Select **Windows Server 2016 Datacenter** in the **Popular** list.
3. Enter these values for the virtual machine:

   |Setting  |Value  |
   |---------|---------|
   |Resource group     |**fw-manager-rg**|
   |Virtual machine name     |**Srv-workload-01**|
   |Region     |**(US) East US)**|
   |Administrator user name     |type a user name|
   |Password     |type a password|

4. Under **Inbound port rules**, for **Public inbound ports**, select **None**.
6. Accept the other defaults and select **Next: Disks**.
7. Accept the disk defaults and select **Next: Networking**.
8. Select **Spoke-01** for the virtual network and select **Workload-01-SN** for the subnet.
9. For **Public IP**, select **None**.
11. Accept the other defaults and select **Next: Management**.
12. Select **Disable** to disable boot diagnostics. Accept the other defaults and select **Review + create**.
13. Review the settings on the summary page, and then select **Create**.

Use the information in the following table to configure another virtual machine named **Srv-Workload-02**. The rest of the configuration is the same as the **Srv-workload-01** virtual machine.

|Setting  |Value  |
|---------|---------|
|Virtual network|**Spoke-02**|
|Subnet|**Workload-02-SN**|

After the servers are deployed, select a server resource, and in **Networking** note the private IP address for each server.

## Create a firewall policy and secure your hub

A firewall policy defines collections of rules to direct traffic on one or more Secured virtual hubs. You'll create your firewall policy and then secure your hub.

1. From Firewall Manager, select **View Azure Firewall policies**.
2. Select **Create Azure Firewall Policy**.
1. For **Resource group**, select **fw-manager-rg**.
1. Under **Policy details**, for the **Name** type **Policy-01** and for **Region** select **East US**.
1. Select **Next: DNS Settings**.
1. Select **Next: TLS Inspection (preview)**.
1. Select **Next : Rules**.
1. On the **Rules** tab, select **Add a rule collection**.
1. On the **Add a rule collection** page, type **App-RC-01** for the **Name**.
1. For **Rule collection type**, select **Application**.
1. For **Priority**, type **100**.
1. Ensure **Rule collection action** is **Allow**.
1. For the rule **Name** type **Allow-msft**.
1. For the **Source type**, select **IP address**.
1. For **Source**, type **\***.
1. For **Protocol**, type **http,https**.
1. Ensure **Destination type** is **FQDN**.
1. For **Destination**, type **\*.microsoft.com**.
1. Select **Add**.

Add a DNAT rule so you can connect a remote desktop to the **Srv-Workload-01** virtual machine.

1. Select **Add/Rule collection**.
1. For **Name**, type **dnat-rdp**.
1. For **Rule collection type**, select **DNAT**.
1. For **Priority**, type **100**.
1. For the rule **Name** type **Allow-rdp**.
1. For the **Source type**, select **IP address**.
1. For **Source**, type **\***.
1. For **Protocol**, select **TCP**.
1. For **Destination Ports**, type **3389**.
1. For **Destination Type**, select **IP Address**.
1. For **Destination**, type the firewall public IP address that you noted previously.
1. For **Translated address**, type the private IP address for **Srv-Workload-01** that you noted previously.
1. For **Translated port**, type **3389**.
1. Select **Add**.

Add a network rule so you can connect a remote desktop from **Srv-Workload-01** to **Srv-Workload-02**.

1. Select **Add a rule collection**.
2. For **Name**, type **vnet-rdp**.
3. For **Rule collection type**, select **Network**.
4. For **Priority**, type **100**.
1. For **Rule collection action**, select **Allow**.
1. For the rule **Name** type **Allow-vnet**.
1. For the **Source type**, select **IP address**.
1. For **Source**, type **\***.
1. For **Protocol**, select **TCP**.
1. For **Destination Ports**, type **3389**.
1. For **Destination Type**, select **IP Address**.
1. For **Destination**, type the **Srv-Workload-02** private IP address that you noted previously.
1. Select **Add**.
1. Select **Review + create**.
1. Select **Create**.

## Associate policy

Associate the firewall policy with the hub.

1. From Firewall Manager, select **Azure Firewall Policies**.
1. Select the check box for **Policy-01**.
1. Select **Manage associations/Associate hubs**.
1. Select **hub-01**.
1. Select **Add**.

## Route traffic to your hub

Now you must ensure that network traffic gets routed through your firewall.

1. From Firewall Manager, select **Virtual hubs**.
2. Select **Hub-01**.
3. Under **Settings**, select **Security configuration**.
4. Under **Internet traffic**, select **Azure Firewall**.
5. Under **Private traffic**, select **Send via Azure Firewall**.
1. Select **Save**.

   It takes a few minutes to update the route tables.
1. Verify that the two connections show Azure Firewall secures both Internet and private traffic.

## Test the firewall

To test the firewall rules, you'll connect a remote desktop using the firewall public IP address, which is NATed to **Srv-Workload-01**. From there you'll use a browser to test the application rule and connect a remote desktop to **Srv-Workload-02** to test the network rule.

### Test the application rule

Now, test the firewall rules to confirm that it works as expected.

1. Connect a remote desktop to firewall public IP address, and sign in.

3. Open Internet Explorer and browse to `https://www.microsoft.com`.
4. Select **OK** > **Close** on the Internet Explorer security alerts.

   You should see the Microsoft home page.

5. Browse to `https://www.google.com`.

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

When you are done testing your firewall resources, delete the **fw-manager-rg** resource group to delete all firewall-related resources.

## Next steps

> [!div class="nextstepaction"]
> [Learn about trusted security partners](trusted-security-partners.md)
