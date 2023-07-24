---
title: 'Azure ExpressRoute private peering: Configure IPsec transport mode - Windows hosts'
description: How to enable IPsec transport mode between Azure Windows VMs and on-premises Windows hosts through ExpressRoute private peering using GPOs and OUs.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 06/30/2023
ms.author: duau
---

# Configure IPsec transport mode for ExpressRoute private peering

This article helps you create IPsec tunnels in transport mode over ExpressRoute private peering. The tunnel is created between Azure VMs running Windows and on-premises Windows hosts. The steps in this article for this configuration use group policy objects. While it's possible to create this configuration without using organizational units (OUs) and group policy objects (GPOs). The combination of OUs and GPOs help simplify the control of your security policies and allows you to quickly scale up. The steps in this article assume you already have an Active Directory configuration and you're familiar with using OUs and GPOs.

## About this configuration

The configuration in the following steps uses a single Azure virtual network (VNet) with ExpressRoute private peering. However, this configuration can span over other Azure VNets and on-premises networks. This article helps you define an IPsec encryption policy that you can apply to a group of Azure VMs or on-premises hosts. These Azure VMs or on-premises hosts are part of the same OU. You configure encryption between the Azure VMs (vm1 and vm2), and the on-premises host1 only for HTTP traffic with destination port 8080. Different types of IPsec policy can be created based on your requirements.

### Working with OUs 

The security policy associated with an OU is pushed to the computers via GPO. A few advantages to using OUs, rather than applying policies to a single host, are:

* Associating a policy with an OU guarantees that computers that belong to the same OU get the same policies.
* Changing the security policy associated with OU applies the changes to all hosts in the OU.

### Diagrams

The following diagram shows the interconnection and assigned IP address space. The Azure VMs and the on-premises host are running Windows 2016. The Azure VMs and the on-premises host1 are part of the same domain. The Azure VMs and the on-premises hosts can resolve names properly using DNS.

[![1]][1]

This diagram shows the IPsec tunnels in transit in ExpressRoute private peering.

[![4]][4]

### Working with IPsec policy

In Windows, encryption is associated with IPsec policy. IPsec policy determines which IP traffic is secured and the security mechanism applied to the IP packets.
**IPSec policies** are composed of the following items: **Filter Lists**, **Filter Actions**, and **Security Rules**.

When configuring IPsec policy, it's important to understand the following IPsec policy terminology:

* **IPsec policy:** A collection of rules. Only one policy can be active ("assigned") at any particular time. Each policy can have one or more rules, all of which can be active simultaneously. A computer can be assigned only one active IPsec policy at given time. However, within the IPsec policy, you can define multiple actions that may be taken in different situations. Each set of IPsec rules is associated with a filter list that affects the type of network traffic to which the rule applies.

* **Filter lists:** Filter lists are bundle of one or more filters. One list can contain multiple filters. A filter defines if the communication gets blocked, allowed, or secured based on the following criteria: IP address ranges, protocols, or even specific ports. Each filter matches a particular set of conditions; for example, packets sent from a particular subnet to a particular computer on a specific destination port. When network conditions match one or more of those filters, the filter list is activated. Each filter is defined inside a specific filter list. Filters can't be shared between filter lists. However, a given filter list can be incorporated into several IPsec policies. 

* **Filter actions:** A security method defines a set of security algorithms, protocols, and key a computer offers during IKE negotiations. Filter actions are lists of security methods, ranked in order of preference.  When a computer negotiates an IPsec session, it accepts or sends proposals based on the security setting stored in filter actions list.

* **Security rules:** Rules govern how and when an IPsec policy protects communication. It uses **filter list** and **filter actions** to create an IPsec rule to build the IPsec connection. Each policy can have one or more rules, all of which can be active simultaneously. Each rule contains a list of IP filters and a collection of security actions that take place upon a match with that filter list:
  * IP Filter Actions
  * Authentication methods
  * IP tunnel settings
  * Connection types

[![5]][5]

## Before you begin

Ensure that you meet the following prerequisites:

* You must have a functioning Active Directory configuration that you can use to implement Group Policy settings. For more information about GPOs, see [Group Policy Objects](/previous-versions/windows/desktop/Policy/group-policy-objects).

* You must have an active ExpressRoute circuit.
  * For information about creating an ExpressRoute circuit, see [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md). 
  * Verify that the circuit get enabled by your connectivity provider. 
  * Verify that you have Azure private peering configured for your circuit. See the [configure routing](expressroute-howto-routing-arm.md) article for routing instructions. 
  * Verify that you have a VNet and a virtual network gateway created and fully provisioned. Follow the instructions to [create a virtual network gateway for ExpressRoute](expressroute-howto-add-gateway-resource-manager.md). A virtual network gateway for ExpressRoute uses the GatewayType *ExpressRoute*, not VPN.

* The ExpressRoute virtual network gateway must be connected to the ExpressRoute circuit. For more information, see [Connect a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md).

* Verify that the Azure Windows VMs are deployed to the VNet.

* Verify that there's connectivity between the on-premises hosts and the Azure VMs.

* Verify that the Azure Windows VMs and the on-premises hosts can use DNS to properly resolve names.

### Workflow

1. Create a GPO and associate it to the OU.
2. Define an IPsec **Filter Action**.
3. Define an IPsec **Filter List**.
4. Create an IPsec Policy with **Security Rules**.
5. Assign the IPsec GPO to the OU.

### Example values

* **Domain Name:** ipsectest.com

* **OU:** IPSecOU

* **On-premises Windows computer:** host1

* **Azure Windows VMs:** vm1, vm2

## <a name="creategpo"></a>1. Create a GPO

1. Create a new GPO linked to an OU by opening the Group Policy Management snap-in. Then locate the OU to which the GPO gets linked. In the example, the OU is named **IPSecOU**. 

   [![9]][9]
2. In the Group Policy Management snap-in, select the OU, and right-click. In the dropdown, select "**Create a GPO in this domain, and Link it here…**".

   [![10]][10]
3. Name the GPO an intuitive name so that you can easily locate it later. Select **OK** to create and link the GPO.

   [![11]][11]

## <a name="enablelink"></a>2. Enable the GPO link

To apply the GPO to the OU, the GPO must not only be linked to the OU, but the link must be also enabled.

1. Locate the GPO that you created, right-click, and select **Edit** from the dropdown.
2. To apply the GPO to the OU, select **Link Enabled**.

   [![12]][12]

## <a name="filteraction"></a>3. Define the IP filter action

1. From the drop-down, right-click **IP Security Policy on Active Directory**, and then select **Manage IP filter lists and filter actions...**.

   [![15]][15]
2. On the "**Manage filter Actions**" tab, select **Add**.

   [![16]][16]

3. On the **IP Security Filter Action wizard**, select **Next**.

   [![17]][17]
4. Name the filter action an intuitive name so that you can find it later. In this example, the filter action is named **myEncryption**. You can also add a description. Then, select **Next**.

   [![18]][18]
5. **Negotiate security** lets you define the behavior if IPsec can't be established with another computer. Select **Negotiate security**, then select **Next**.

   [![19]][19]
6. On the **Communicating with computers that do not support IPsec** page, select **Do not allow unsecured communication**, then select **Next**.

   [![20]][20]
7. On the **IP Traffic and Security** page, select **Custom**, then select **Settings...**.

   [![21]][21]
8. On the **Custom Security Method Settings** page, select **Data integrity and encryption (ESP): SHA1, 3DES**. Then, select **OK**.

   [![22]][22]
9. On the **Manage Filter Actions** page, you can see that the **myEncryption** filter was successfully added. Select **Close**.

   [![23]][23]

## <a name="filterlist1"></a>4. Define an IP filter list

Create a filter list that specifies encrypted HTTP traffic with destination port 8080.

1. To qualify which types of traffic must be encrypted, use an **IP filter list**. In the **Manage IP Filter Lists** tab, select **Add** to add a new IP filter list.

   [![24]][24]
2. In the **Name:** field, type a name for your IP filter list. For example, **azure-onpremises-HTTP8080**. Then, select **Add**.

   [![25]][25]
3. On the **IP Filter Description and Mirrored property** page, select **Mirrored**. The mirrored setting matches packets going in both directions, which allows for two-way communication. Then select **Next**.

   [![26]][26]
4. On the **IP Traffic Source** page, from the **Source address:** dropdown, choose **A specific IP Address or Subnet**. 

   [![27]][27]
5. Specify the source address **IP Address or Subnet:** of the IP traffic, then select **Next**.

   [![28]][28]
6. Specify the **Destination address:** IP Address or Subnet. Then, select **Next**.

   [![29]][29]
7. On the **IP Protocol Type** page, select **TCP**. Then, select **Next**.

   [![30]][30]
8. On the **IP Protocol Port** page, select **From any port** and **To this port:**. Type **8080** in the text box. These settings specify only the HTTP traffic on destination port 8080 gets encrypted. Then, select **Next**.

   [![31]][31]
9. View the IP filter list.  The configuration of the IP Filter List **azure-onpremises-HTTP8080** triggers encryption for all traffic that matches the following criteria:

   * Any source address in 10.0.1.0/24 (Azure Subnet2)
   * Any destination address in 10.2.27.0/25 (on-premises subnet)
   * TCP protocol
   * Destination port 8080

   [![32]][32]

## <a name="filterlist2"></a>5. Edit the IP filter list

To encrypt the same type of traffic from the on-premises host to the Azure VM, you need a second IP filter. Follow the same steps you used for setting up the first IP filter and create a new IP filter. The only differences are the source subnet and destination subnet.

1. To add a new IP filter to the IP Filter List, select **Edit**.

   [![33]][33]
2. On the **IP Filter List** page, select **Add**.

   [![34]][34]
3. Create a second IP filter using the settings in the following example:

   [![35]][35]
4. After you create the second IP filter, the IP filter list will look like this:

   [![36]][36]

If encryption is required between an on-premises location and an Azure subnet to protect an application. Instead of modifying the existing IP filter list, you can add a new IP filter list. Associating two or more IP filters lists to the same IPsec policy can provide you with more flexibility. You can modify or remove an IP filter list without affecting the other IP filter lists.

## <a name="ipsecpolicy"></a>6. Create an IPsec security policy 

Create an IPsec policy with security rules.

1. Select the **IPSecurity Policies on Active directory** that is associated with the OU. Right-click, and select **Create IP Security Policy**.

   [![37]][37]
2. Name the security policy. For example, **policy-azure-onpremises**. Then, select **Next**.

   [![38]][38]
3. Select **Next** without selecting the checkbox.

   [![39]][39]
4. Verify that the **Edit properties** checkbox is selected, and then select **Finish**.

   [![40]][40]

## <a name="editipsec"></a>7. Edit the IPsec security policy

Add to the IPsec policy the **IP Filter List** and **Filter Action** that you previously configured.

1. On the HTTP policy Properties **Rules** tab, select **Add**.

   [![41]][41]
2. On the Welcome page, select **Next**.

   [![42]][42]
3. A rule provides the option to define the IPsec mode: tunnel mode or transport mode.

   * In tunnel mode, the original packet gets encapsulated with a set of IP headers. Tunnel mode protects the internal routing information by encrypting the IP header of the original packet. Tunnel mode is widely implemented between gateways in site-to-site VPN scenarios. Tunnel mode is in most of cases used for end-to-end encryption between hosts.

   * Transport mode encrypts only the payload and ESP trailer; the IP header of the original packet isn't encrypted. In transport mode, the IP source and IP destination of the packets are unchanged.

   Select **This rule does not specify a tunnel**, and then select **Next**.

   [![43]][43]
4. **Network Type** defines which network connection associates with the security policy. Select **All network connections**, and then select **Next**.

   [![44]][44]
5. Select the IP filter list that you created previously,  **azure-onpremises-HTTP8080**, and then select **Next**.

   [![45]][45]
6. Select the existing Filter Action **myEncryption** that you created previously.

   [![46]][46]
7. Windows supports four distinct types of authentications: Kerberos, certificates, NTLMv2, and preshared key. Since we're working with domain-joined hosts, select **Active Directory default (Kerberos V5 protocol)**, and then select **Next**.

   [![47]][47]
8. The new policy creates the security rule: **azure-onpremises-HTTP8080**. Select **OK**.

   [![48]][48]

The IPsec policy requires all HTTP connections on the destination port 8080 to use IPsec transport mode. Since HTTP is a clear text protocol, having the security policy enabled, ensures data is encrypted when being transferred through the ExpressRoute private peering. IPsec policy for Active Directory is more complex to configure than Windows Firewall with Advanced Security. However, it allows for more customization of the IPsec connection.

## <a name="assigngpo"></a>8. Assign the IPsec GPO to the OU

1. View the policy. The security group policy is defined, but not yet assigned.

   [![49]][49]
2. To assign the security group policy to the OU **IPSecOU**, right-click the security policy and chose **Assign**.
   Every computer that belongs to the OU has the security group policy assigned.

   [![50]][50]

## <a name="checktraffic"></a>Check traffic encryption

To check out the encryption GPO applied on the OU, install IIS on all Azure VMs and in the host1. Every IIS is customized to answer to HTTP requests on port 8080.
To verify encryption, you can install a network sniffer (like Wireshark) in all computers in the OU.
A PowerShell script works as an HTTP client to generate HTTP requests on port 8080:

```powershell
$url = "http://10.0.1.20:8080"
while ($true) {
try {
[net.httpWebRequest]
$req = [net.webRequest]::create($url)
$req.method = "GET"
$req.ContentType = "application/x-www-form-urlencoded"
$req.TimeOut = 60000

$start = get-date
[net.httpWebResponse] $res = $req.getResponse()
$timetaken = ((get-date) - $start).TotalMilliseconds

Write-Output $res.Content
Write-Output ("{0} {1} {2}" -f (get-date), $res.StatusCode.value__, $timetaken)
$req = $null
$res.Close()
$res = $null
} catch [Exception] {
Write-Output ("{0} {1}" -f (get-date), $_.ToString())
}
$req = $null

# uncomment the line below and change the wait time to add a pause between requests
#Start-Sleep -Seconds 1
}

```
The following network capture shows the results for on-premises host1 with display filter ESP to match only the encrypted traffic:

[![51]][51]

If you run the PowerShell script on-premises (HTTP client), the network capture in the Azure VM shows a similar trace.

## Next steps

For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).

<!--Image References-->

[1]: ./media/expressroute-howto-ipsec-transport-private-windows/network-diagram.png "network Diagram IPsec transport mode through ExpressRoute"
[4]: ./media/expressroute-howto-ipsec-transport-private-windows/ipsec-interesting-traffic.png "IPsec interesting traffic"
[5]: ./media/expressroute-howto-ipsec-transport-private-windows/windows-ipsec.png "Windows IPsec policy"
[9]: ./media/expressroute-howto-ipsec-transport-private-windows/ou.png "Organization Unit in the Group Policy"
[10]: ./media/expressroute-howto-ipsec-transport-private-windows/create-gpo-ou.png "create a GPO associated with the OU"
[11]: ./media/expressroute-howto-ipsec-transport-private-windows/gpo-name.png "assign a name to the GPO associated with the OU"
[12]: ./media/expressroute-howto-ipsec-transport-private-windows/edit-gpo.png "edit the GPO"
[15]: ./media/expressroute-howto-ipsec-transport-private-windows/manage-ip-filter-list-filter-actions.png "Manage IP Filter Lists and Filter Actions"
[16]: ./media/expressroute-howto-ipsec-transport-private-windows/add-filter-action.png "add Filter Action"
[17]: ./media/expressroute-howto-ipsec-transport-private-windows/action-wizard.png "Action Wizard"
[18]: ./media/expressroute-howto-ipsec-transport-private-windows/filter-action-name.png "Filter Action name"
[19]: ./media/expressroute-howto-ipsec-transport-private-windows/filter-action.png "Filter Action"
[20]: ./media/expressroute-howto-ipsec-transport-private-windows/filter-action-no-ipsec.png "specify the behavior is an unsecure connection is established"
[21]: ./media/expressroute-howto-ipsec-transport-private-windows/security-method.png "security mechanism"
[22]: ./media/expressroute-howto-ipsec-transport-private-windows/custom-security-method.png "Custom security method"
[23]: ./media/expressroute-howto-ipsec-transport-private-windows/filter-actions-list.png "filter action list"
[24]: ./media/expressroute-howto-ipsec-transport-private-windows/add-new-ip-filter.png "Add a new IP filter list"
[25]: ./media/expressroute-howto-ipsec-transport-private-windows/ip-filter-http-traffic.png "Add HTTP traffic to the IP filter"
[26]: ./media/expressroute-howto-ipsec-transport-private-windows/match-both-direction.png "match packet in both directions"
[27]: ./media/expressroute-howto-ipsec-transport-private-windows/source-address.png "selection of the Source subnet"
[28]: ./media/expressroute-howto-ipsec-transport-private-windows/source-network.png "Source Network"
[29]: ./media/expressroute-howto-ipsec-transport-private-windows/destination-network.png "Destination Network"
[30]: ./media/expressroute-howto-ipsec-transport-private-windows/protocol.png "Protocol"
[31]: ./media/expressroute-howto-ipsec-transport-private-windows/source-port-and-destination-port.png "source port and destination port"
[32]: ./media/expressroute-howto-ipsec-transport-private-windows/ip-filter-list.png "filter list"
[33]: ./media/expressroute-howto-ipsec-transport-private-windows/ip-filter-for-http.png "IP filter list with HTTP traffic"
[34]: ./media/expressroute-howto-ipsec-transport-private-windows/ip-filter-add-second-entry.png "Adding a second IP Filter"
[35]: ./media/expressroute-howto-ipsec-transport-private-windows/ip-filter-second-entry.png "IP Filter list-second entry"
[36]: ./media/expressroute-howto-ipsec-transport-private-windows/ip-filter-list-2entries.png "IP Filter list-second entry"
[37]: ./media/expressroute-howto-ipsec-transport-private-windows/create-ip-security-policy.png "create the IP Security policy"
[38]: ./media/expressroute-howto-ipsec-transport-private-windows/ipsec-policy-name.png "name of the IPsec policy"
[39]: ./media/expressroute-howto-ipsec-transport-private-windows/security-policy-wizard.png "IPsec policy wizard"
[40]: ./media/expressroute-howto-ipsec-transport-private-windows/edit-security-policy.png "edit of the IPsec policy"
[41]: ./media/expressroute-howto-ipsec-transport-private-windows/add-new-rule.png "add new security rule to the IPsec policy"
[42]: ./media/expressroute-howto-ipsec-transport-private-windows/create-security-rule.png "create a new security rule"
[43]: ./media/expressroute-howto-ipsec-transport-private-windows/transport-mode.png "Transport Mode"
[44]: ./media/expressroute-howto-ipsec-transport-private-windows/network-type.png "Network type"
[45]: ./media/expressroute-howto-ipsec-transport-private-windows/selection-filter-list.png "selection of existing IP Filter List"
[46]: ./media/expressroute-howto-ipsec-transport-private-windows/selection-filter-action.png "selection of existing Filter Action"
[47]: ./media/expressroute-howto-ipsec-transport-private-windows/authentication-method.png "selection of the authentication method"
[48]: ./media/expressroute-howto-ipsec-transport-private-windows/security-policy-completed.png "end of process of creation of the security policy"
[49]: ./media/expressroute-howto-ipsec-transport-private-windows/gpo-not-assigned.png "IPsec policy linked to the GPO but not assigned"
[50]: ./media/expressroute-howto-ipsec-transport-private-windows/gpo-assigned.png "IPsec policy assigned to the GPO"
[51]: ./media/expressroute-howto-ipsec-transport-private-windows/encrypted-traffic.png "Capture of IPsec encrypted traffic"
