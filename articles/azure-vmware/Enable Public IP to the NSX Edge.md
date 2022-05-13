---
title: Enable Public IP to the NSX Edge for Azure VMware Solution Workloads
description: This article explains how to enable internet access for your Azure VMware Solution.
ms.topic: how-to
ms.date: 05/12/2022
---
# Enable internet access for your Azure VMware Solution

Before selecting this option, please review Design Considerations for Internet Connectivity [Link to Doc4]. 

Public IP to the NSX Edge is a feature in Azure VMware Solution that enables inbound and outbound internet access for your Azure VMware Solution Environment. The Public IP is configured in Azure VMware Solution via the Azure Portal as well as the NSX-T Data center interface all within your Azure VMware Solution Private cloud.
With this capability, you have:
- A cohesive and simplified experience for reserving and consuming a Public IP down to the NSX Edge.
- The ability to receive up to 1000 or more Public IPs, enabling internet access at scale.
- Inbound and outbound internet access for your workload VMs.
- DDoS Security protection against network traffic in and out of the internet. 
- HCX Migration support over the Public Internet.

## Reference   Architecture    
:::image type="content" source="media/public-ip-usage/architecture-internet-access-avs-public-ip.png" alt-text="The architecture diagram shows internet access to and from your Azure VMware Solution Private Cloud using a Public IP directly to the NSX Edge." border="false" lightbox="media/public-ip-usage/architecture-internet-access-avs-public-ip.png":::

## How to Configure a Public IP in the Azure Portal
1.	Sign into the Azure portal and then search for and select Azure VMware Solution.
2.	Select the Azure VMware Solution private cloud.
    :::image type="content" source="media/public-ip-usage/private-cloud-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::

1. Under Workload Networking, select Internet Connectivity.
   :::image type="content" source="media/public-ip-usage/private-cloud-workload-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::

4.	Select Connect using Public IP down to the NSX-T Edge. Before selecting, please ensure you understand the implications to your existing environment. Learn more. (link to doc4)
    :::image type="content" source="media/public-ip-usage/public-ip-to-nsx-t-edge-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::
5.	Once selected, click + Public IP.

    :::image type="content" source="media/public-ip-usage/public-ip-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::
6.	Enter the name of the Public IP block and select a subnet size.
     :::image type="content" source="media/public-ip-usage/public-ip-block-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::
7.	Click Configure. This Public IP should be configured within x minutes.
8.	After completion, record the subnet that has been allocated. You may need to refresh the list to view the subnet. If this fails, please try the configuration again.
    :::image type="content" source="media/public-ip-usage/public-ip-subnet-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::

9.	Once the configuration is complete, select the checkbox below. By selecting this checkbox, you confirm executing this change will immediately disable all other internet options. 
10.	Select Save. 
:::image type="content" source="media/public-ip-usage/public-ip-to-nsx-t-edge-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::

You have successfully enabled internet connectivity for your Azure VMware Solution Private Cloud and reserved a Microsoft allocated Public IP. You can now configure this Public IP down to the NSX Edge for your workloads. The NSX-T Datacenter is used for all VM communication. There are several applications for configuring your reserved Public IP down to the NSX Edge. 

There are three options for configuring your reserved Public IP down to the NSX Edge:



### 1. Outbound Internet Access for VMs
 
A Sourced Network Translation Service (SNAT) with Port Address Translation (PAT) is used to allow many to one SNAT. This means you can provide internet connectivity for many VMs.
1.	From your Azure VMware Solution Private Cloud, select vCenter Credentials
2.	Locate your NSX-T URL and credentials.
3.	Login to NSX-T.
   :::image type="content" source="media/public-ip-usage/nsx-t-login-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::

4.	Navigate to NAT rules.
   :::image type="content" source="media/public-ip-usage/nsx-t-3nat-rules-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::

5.	Select the T1 Router and click ADD NAT RULE.

6.	Configure the rule. 
    <ol type="A">
     <li> Enter a name </li>
     <li>Select SNAT.</li> 
     <li>Optionally enter a source such as a subnet to SNAT or destination.</li>
     <li>Enter the translated IP.   This is from the range of Public IPs your reserved from the Azure VMware Solution Portal.</li>
    <li>Optionally give the rule a higher priority number (this will move the rule further down the rule list to ensure more specific rules are matched first).</li>
    <li>Click SAVE.</li>
    </ol>
Logging can be enabled via the logging slider. For more information on NSX-T NAT configuration and options, please see the 
[NSX-T NAT Administration Guide](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/administration/GUID-7AD2C384-4303-4D6C-A44A-DEF45AA18A92.html)



### 2. Inbound Internet Access for VMs
A Destination Network Translation Service (DNAT) is used to expose a VM on a specific Public IP address and/or a specific port. This provides inbound internet access to your workload VMs.
1.	From your Azure VMware Solution Private Cloud, select VMware Credentials
2.	Locate your NSX-T URL and credentials.
3.	Login to NSX-T.
    :::image type="content" source="media/public-ip-usage/nsx-t-login-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::
1.	Configure the DNAT rule.
     <ol type="A">
     <li> Name the rule.</li>
     <li> Select “DNAT” as the action. </li>
     <li> Enter the reserved Public IP in the destination match.</li>
     <li>Enter the VM Private IP in the translated IP. This is from the range of Public IPs your reserved from the Azure VMware Solution Portal.</li>
      <li>Click SAVE </li>
      <li> Optionally, configure the Translated Port or source IP for more specific matches.</li>
    </ol>

    :::image type="content" source="media/public-ip-usage/snat-3nat-rules-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::

The VM is now exposed to the internet on the specific Public IP and/or specific ports.



### 3. Gateway Firewall used to Filter Traffic to VMs at T1 Gateways
 
Using a Gateway Firewall, you can provide security protection for your network traffic in and out of the public Internet. 
1.	From your Azure VMware Solution Private Cloud, select VMware Credentials
2.	Locate your NSX-T URL and credentials.
3.	Login to NSX-T.
    :::image type="content" source="media/public-ip-usage/nsx-t-login-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::
4.	From the NSX-T home screen, click Gateway Policies. 
    :::image type="content" source="media/public-ip-usage/nsx-t-4nat-policies-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::
5.	Select “Gateway Specific Rules”, choose the T1 Gateway and click “ADD POLICY”. 
6.	Click “New Policy” and enter a policy name. 
7.	Select the Policy and click “ADD RULE”. 
8.	Configure the rule.
    <ol type="A"> 
     <li>Click “New Rule”.</li>
     <li>Enter a descriptive name.</li>
     <li>Configure the source, destination, services, and action.</li>
    </ol>
1. You can set a firewall match rule to determine how firewall is applied during NAT. To apply firewall rules to the external address of a NAT rule, select Match External Address. For instance, the following rule is set to "Match External Address”, and this will allow SSH traffic inbound to the Public IP.
     :::image type="content" source="media/public-ip-usage/gateway-specific-rules-match-external-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::

If “Match Internal Address” was specified, the destination would be the internal or private IP address of the VM. 

For more information on the NSX-T Gateway Firewall please see the [NSX-T Gateway Firewall Administration Guide]( https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/administration/GUID-A52E1A6F-F27D-41D9-9493-E3A75EC35481.html)
The Distributed Firewall may also be used to filter traffic to VMs. This feature is outside the scope of this document. The [NSX-T Distributed Firewall Administration Guide]( https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/administration/GUID-6AB240DB-949C-4E95-A9A7-4AC6EF5E3036.html) .
