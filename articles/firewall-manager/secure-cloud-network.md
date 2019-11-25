---
title: 'Tutorial: Use Azure Firewall Manager Preview to secure your cloud network using the Azure portal'
description: In this tutorial, you learn how to secure your cloud network with Azure Firewall Manager using the Azure portal. 
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.topic: tutorial
ms.date: 10/27/2019
ms.author: victorh
---

# Tutorial: Secure your cloud network with Azure Firewall Manager Preview using the Azure portal

[!INCLUDE [Preview](../../includes/firewall-manager-preview-notice.md)]

Using Azure Firewall Manager Preview, you can create secured hubs to secure your cloud network traffic destined to private IP addresses, Azure PaaS, and the Internet. Traffic routing to the firewall is automated, so there's no need to create user defined routes (UDRs).

![secure the cloud network](media/secure-cloud-network/secure-cloud-network.png)

## Prerequisites

> [!IMPORTANT]
> Azure Firewall Manager Preview must be explicitly enabled using the `Register-AzProviderFeature` PowerShell command.

From a PowerShell command prompt, run the following commands:

```azure-powershell
connect-azaccount
Register-AzProviderFeature -FeatureName AllowCortexSecurity -ProviderNamespace Microsoft.Network
```
It takes up to 30 minutes for the feature registration to complete. Run the following command to check your registration status:

`Get-AzProviderFeature -FeatureName AllowCortexSecurity -ProviderNamespace Microsoft.Network`

## Create a hub and spoke architecture

First, create a spoke VNet where you can place your servers.

### Create a spoke VNet and subnets

1. From the Azure portal home page, select **Create a resource**.
2. Under **Networking**, select **Virtual network**.
4. For **Name**, type **Spoke-01**.
5. For **Address space**, type **10.0.0.0/16**.
6. For **Subscription**, select your subscription.
7. For **Resource group**, select **Create new**, and type **FW-Manager** for the name and select **OK**.
8. For **Location**, select **(US) East US**.
9. Under **Subnet**, for **Name** type **Workload-SN**.
10. For **Address range**, type **10.0.1.0/24**.
11. Accept the other default settings, and then select **Create**.

Next, create a subnet for a jump server.

1. On the Azure portal home page, select **Resource groups** > **FW-Manager**.
2. Select the **Spoke-01** virtual network.
3. Select **Subnets** > **+Subnet**.
4. For **Name**, type **Jump-SN**.
5. For **Address range**, type **10.0.2.0/24**.
6. Select **OK**.

### Create the secured virtual hub

Create your secured virtual hub using Firewall Manager.

1. From the Azure portal home page, select **All services**.
2. In the search box, type **Firewall Manager** and select **Firewall Manager**.
3. On the **Firewall Manager** page, select **Create a Secured Virtual Hub**.
4. On the **Create new Secured virtual hub** page, select your subscription and the **FW-Manager** resource group.
5. For the **Secured virtual hub name**, type **Hub-01**.
6. For **Location**, select **East US**.
7. For **Hub address space**, type **10.1.0.0/16**.
8. For the new vWAN name, type **vwan-01**.
9. Leave the **Include VPN gateway to enable Trusted Security Partners** check box cleared.
10. Select **Next:Azure Firewall**.
11. Accept the default **Azure Firewall** **Enabled** setting and then select **Next: Trusted Security Partner**.
12. Accept the default **Trusted Security Partner** **Disabled** setting, and select **Next: Review + create**.
13. Select **Create**. It will take about 30 minutes to deploy.

### Connect the hub and spoke VNets

Now you can peer the hub and spoke VNets.

1. Select the **FW-Manager** resource group, then select the **vwan-01** virtual WAN.
2. Under **Connectivity**, select **Virtual network connections**.
3. Select **Add connection**.
4. For **Connection name**, type **hub-spoke**.
5. For **Hubs**, select **Hub-01**.
6. For **Virtual network**, select **Spoke-01**.
7. Select **OK**.

## Create a firewall policy and secure your hub

A firewall policy defines collections of rules to direct traffic on one or more Secured virtual hubs. You'll create your firewall policy and then secure your hub.

1. From Firewall Manager, select **Create an Azure Firewall Policy**.
2. Select your subscription, and then select the **FW-Manager** resource group.
3. Under **Policy details**, for the **Name** type **Policy-01** and for **Region** select **East US**.
4. Select **Next:Rules**.
5. On the **Rules** tab, select **Add a rule collection**.
6. On the **Add a rule collection** page, type **RC-01** for the **Name**.
7. For **Rule collection type**, select **Application**.
8. For **Priority**, type **100**.
9. Ensure **Rule collection action** is **Allow**.
10. For the rule **Name** type **Allow-msft**.
11. For **Source address**, type **\***.
12. For **Protocol**, type **http,https**.
13. Ensure **Destination type is **FQDN**.
14. For **Destination**, type **\*.microsoft.com**.
15. Select **Add**.
16. Select **Next: Secured virtual hubs**.
17. On the **Secured virtual hubs** tab, select **Hub-01**.
19. Select **Review + create**.
20. Select **Create**.

This can take about five minutes or more to complete.

## Route traffic to your hub

Now you must ensure that network traffic gets routed to through your firewall.

1. From Firewall Manager, select **Secured virtual hubs**.
2. Select **Hub-01**.
3. Under **Settings**, select **Route settings**.
4. Under **Internet traffic**, **Traffic from Virtual Networks**, select **Send via Azure Firewall**.
5. Under **Azure private traffic**, **Traffic to Virtual Networks**, select **Send via Azure Firewall**.
6. Select **Edit IP address prefix(es)**.
7. Select **Add an IP address prefix**.
8. Type **10.0.1.0/24** as the address of the Workload subnet and select **Save**.
9. Under **Settings**, select **Connections**.
10. Select the **hub-spoke** connection, and then select **Secure internet traffic** and then select **OK**.


## Test your firewall

To test your firewall rules, you'll need to deploy a couple servers. You'll deploy Workload-Srv in the Workload-SN subnet to test the firewall rules, and Jump-Srv so you can use Remote Desktop to connect from the Internet and then connect to Workload-Srv.

### Deploy the servers

1. On the Azure portal, select **Create a resource**.
2. Select **Windows Server 2016 Datacenter** in the **Popular** list.
3. Enter these values for the virtual machine:

   |Setting  |Value  |
   |---------|---------|
   |Resource group     |**FW-Manager**|
   |Virtual machine name     |**Jump-Srv**|
   |Region     |**(US) East US)**|
   |Administrator user name     |**azureuser**|
   |Password     |**Azure123456!**|

4. Under **Inbound port rules**, for **Public inbound ports**, select **Allow selected ports**.
5. For **Select inbound ports**, select **RDP (3389)**.

6. Accept the other defaults and select **Next: Disks**.
7. Accept the disk defaults and select **Next: Networking**.
8. Make sure that **Spoke-01** is selected for the virtual network and the subnet is **Jump-SN**.
9. For **Public IP**, accept the default new public ip address name (Jump-Srv-ip).
11. Accept the other defaults and select **Next: Management**.
12. Select **Off** to disable boot diagnostics. Accept the other defaults and select **Review + create**.
13. Review the settings on the summary page, and then select **Create**.

Use the information in the following table to configure another virtual machine named **Workload-Srv**. The rest of the configuration is the same as the Srv-Jump virtual machine.

|Setting  |Value  |
|---------|---------|
|Subnet|**Workload-SN**|
|Public IP|**None**|
|Public inbound ports|**None**|

### Add a route table and default route

To allow an Internet connection to Jump-Srv, you must create a route table and a default gateway route to the Internet from the **Jump-SN** subnet.

1. On the Azure portal, select **Create a resource**.
2. Type **route table** in the search box, and then select **Route table**.
3. Select **Create**.
4. Type **RT-01** for **Name**.
5. Select your subscription, **FW-Manager** for the resource group and **(US) East US** for the region.
6. Select **Create**.
7. When the deployment completes, select the **RT-01** route table.
8. Select **Routes** and then select **Add**.
9. Type **jump-to-inet** for the **Route name**.
10. Type **0.0.0.0/0** for the **Address prefix**.
11. Select **Internet** for the **Next hop type**.
12. Select **OK**.
13. When the deployment completes, select **Subnets**, then select **Associate**.
14. Select **Spoke-01** for **Virtual network**.
15. Select **Jump-SN** for **Subnet**.
16. Select **OK**.

### Test the rules

Now, test the firewall rules to confirm that it works as expected.

1. From the Azure portal, review the network settings for the **Workload-Srv** virtual machine and note the private IP address.
2. Connect a remote desktop to **Jump-Srv** virtual machine, and sign in. From there, open a remote desktop connection to the **Workload-Srv** private IP address.

3. Open Internet Explorer and browse to https://www.microsoft.com.
4. Select **OK** > **Close** on the Internet Explorer security alerts.

   You should see the Microsoft home page.

5. Browse to https://www.google.com.

   You should be blocked by the firewall.

So now you've verified that the firewall rules are working:

* You can browse to the one allowed FQDN, but not to any others.



## Next steps

> [!div class="nextstepaction"]
> [Learn about trusted security partners](trusted-security-partners.md)
