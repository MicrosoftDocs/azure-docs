---
title: 'Azure ExpressRoute private peering: Configure IPsec transport mode - Windows hosts'
description: How to enable IPsec transport mode between Azure Windows VMs and on-premises Windows hosts through ExpressRoute private peering using GPOs and OUs.
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 03/11/2026
ms.author: duau
---

# Configure IPsec transport mode for ExpressRoute private peering

This article shows you how to create IPsec tunnels in transport mode over ExpressRoute private peering. The tunnel connects Azure VMs running Windows and on-premises Windows hosts. The steps in this article use group policy objects (GPOs) for this configuration. While you can create this configuration without using organizational units (OUs) and GPOs, the combination of OUs and GPOs helps simplify the control of your security policies and allows you to quickly scale up. These steps assume you already have an Active Directory configuration and you're familiar with using OUs and GPOs.

## About this configuration

The configuration in the following steps uses a single Azure virtual network (VNet) with ExpressRoute private peering. However, this configuration can span over other Azure VNets and on-premises networks. This article helps you define an IPsec encryption policy that you can apply to a group of Azure VMs or on-premises hosts. These Azure VMs or on-premises hosts are part of the same OU. You configure encryption between the Azure VMs (vm1 and vm2), and the on-premises host1 only for HTTP traffic with destination port 8080. You can create different types of IPsec policy based on your requirements.

### Working with OUs 

You push the security policy associated with an OU to the computers via GPO. A few advantages to using OUs, rather than applying policies to a single host, are:

* Associating a policy with an OU guarantees that computers that belong to the same OU get the same policies.
* Changing the security policy associated with an OU applies the changes to all hosts in the OU.

### Diagrams

The following diagram shows the interconnection and assigned IP address space. The Azure VMs and the on-premises host run Windows Server 2016. The Azure VMs and the on-premises host1 are part of the same domain. The Azure VMs and the on-premises hosts can resolve names properly using DNS.

:::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/network-diagram.png" alt-text="Diagram of the network topology for IPsec transport mode through ExpressRoute.":::

This diagram shows the IPsec tunnels in transit in ExpressRoute private peering.

:::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/ipsec-interesting-traffic.png" alt-text="Diagram of IPsec interesting traffic in ExpressRoute private peering.":::

### Working with IPsec policy

In Windows, you associate encryption with an IPsec policy. An IPsec policy determines which IP traffic is secured and which security mechanism applies to the IP packets.
**IPsec policies** consist of **Filter Lists**, **Filter Actions**, and **Security Rules**.

When you configure an IPsec policy, it's important to understand the following terminology:

* **IPsec policy:** A collection of rules. Only one policy can be active ("assigned") at any particular time. Each policy can have one or more rules, all of which can be active simultaneously. A computer can have only one active IPsec policy at a time. However, within the IPsec policy, you can define multiple actions for different situations. Each set of IPsec rules is associated with a filter list that affects the type of network traffic to which the rule applies.

* **Filter lists:** A filter list is a bundle of one or more filters. One list can contain multiple filters. A filter defines whether communication is blocked, allowed, or secured based on criteria such as IP address ranges, protocols, or specific ports. Each filter matches a particular set of conditions; for example, packets sent from a particular subnet to a particular computer on a specific destination port. When network conditions match one or more of those filters, the filter list is activated. You define each filter inside a specific filter list. Filters can't be shared between filter lists. However, you can incorporate a given filter list into several IPsec policies. 

* **Filter actions:** A filter action is a security method that defines a set of security algorithms, protocols, and keys a computer offers during IKE negotiations. Filter actions are lists of security methods, ranked in order of preference. When a computer negotiates an IPsec session, it accepts or sends proposals based on the security setting stored in the filter actions list.

* **Security rules:** Rules govern how and when an IPsec policy protects communication. It uses **filter lists** and **filter actions** to create an IPsec rule that builds the IPsec connection. Each policy can have one or more rules, all of which can be active simultaneously. Each rule contains a list of IP filters and a collection of security actions that take place upon a match with that filter list:
  * IP Filter Actions
  * Authentication methods
  * IP tunnel settings
  * Connection types

:::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/windows-ipsec.png" alt-text="Diagram of Windows IPsec policy structure.":::

## Before you begin

Ensure that you meet the following prerequisites:

* You must have a functioning Active Directory configuration that you can use to implement Group Policy settings. For more information about GPOs, see [Group Policy Objects](/previous-versions/windows/desktop/Policy/group-policy-objects).

* You must have an active ExpressRoute circuit.
  * For information about creating an ExpressRoute circuit, see [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md). 
  * Verify that your connectivity provider enables the circuit. 
  * Verify that you configured Azure private peering for your circuit. See the [configure routing](expressroute-howto-routing-arm.md) article for routing instructions. 
  * Verify that you created and fully provisioned a VNet and a virtual network gateway. Follow the instructions to [create a virtual network gateway for ExpressRoute](expressroute-howto-add-gateway-resource-manager.md). A virtual network gateway for ExpressRoute uses the GatewayType *ExpressRoute*, not VPN.

* The ExpressRoute virtual network gateway must be connected to the ExpressRoute circuit. For more information, see [Connect a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md).

* Verify that you deployed the Azure Windows VMs to the VNet.

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

1. Open the Group Policy Management snap-in. Create a new GPO linked to an OU. Then locate the OU to which you link the GPO. In the example, the OU is named **IPSecOU**. 

2. Select the OU, and right-click. In the dropdown, select **Create a GPO in this domain, and Link it here…**.

3. Name the GPO an intuitive name so that you can easily locate it later. Select **OK** to create and link the GPO.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/gpo-name.png" alt-text="Screenshot of naming the GPO created for the OU.":::

## <a name="enablelink"></a>2. Enable the GPO link

To apply the GPO to the OU, link the GPO to the OU and enable the link.

1. Locate the GPO that you created. Right-click, and select **Edit** from the dropdown.
2. Select **Link Enabled** to apply the GPO to the OU.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/edit-gpo.png" alt-text="Screenshot of enabling the GPO link.":::

## <a name="filteraction"></a>3. Define the IP filter action

1. From the drop-down menu, right-click **IP Security Policy on Active Directory**, and then select **Manage IP filter lists and filter actions...**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/manage-ip-filter-list-filter-actions.png" alt-text="Screenshot of Manage IP Filter Lists and Filter Actions.":::

2. On **Manage filter Actions**, select **Add**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/add-filter-action.png" alt-text="Screenshot of adding a filter action.":::

3. On **IP Security Filter Action wizard**, select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/action-wizard.png" alt-text="Screenshot of the IP Security Filter Action wizard.":::

4. Name the filter action an intuitive name so that you can find it later. In this example, the filter action is named **myEncryption**. You can also add a description. Then, select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/filter-action-name.png" alt-text="Screenshot of naming the filter action.":::

5. **Negotiate security** lets you define the behavior if IPsec can't be established with another computer. Select **Negotiate security**, and then select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/filter-action.png" alt-text="Screenshot of the negotiate security filter action settings.":::

6. On **Communicating with computers that do not support IPsec**, select **Do not allow unsecured communication**, and then select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/filter-action-no-ipsec.png" alt-text="Screenshot of specifying behavior for unsecured connections.":::

7. On **IP Traffic and Security**, select **Custom**, and then select **Settings...**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/security-method.png" alt-text="Screenshot of the security method settings.":::

8. On **Custom Security Method Settings**, select **Data integrity and encryption (ESP): SHA1, 3DES**. Then, select **OK**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/custom-security-method.png" alt-text="Screenshot of the custom security method settings.":::

9. On **Manage Filter Actions**, you see that the **myEncryption** filter action was added. Select **Close**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/filter-actions-list.png" alt-text="Screenshot of the filter action list showing myEncryption was added.":::

## <a name="filterlist1"></a>4. Define an IP filter list

Create a filter list that specifies encrypted HTTP traffic with destination port 8080.

1. Use an **IP filter list** to specify which types of traffic must be encrypted. In the **Manage IP Filter Lists** tab, select **Add** to add a new IP filter list.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/add-new-ip-filter.png" alt-text="Screenshot of adding a new IP filter list.":::

2. In the **Name:** field, enter a name for your IP filter list. For example, **azure-onpremises-HTTP8080**. Then, select **Add**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/ip-filter-http-traffic.png" alt-text="Screenshot of adding HTTP traffic to the IP filter.":::

3. On the **IP Filter Description and Mirrored property** page, select **Mirrored**. The mirrored setting matches packets going in both directions, which allows for two-way communication. Then select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/match-both-direction.png" alt-text="Screenshot of selecting the mirrored property.":::

4. On the **IP Traffic Source** page, from the **Source address:** dropdown, choose **A specific IP Address or Subnet**. 

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/source-address.png" alt-text="Screenshot of selecting the source subnet address.":::

5. Specify the source address **IP Address or Subnet:** of the IP traffic, and then select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/source-network.png" alt-text="Screenshot of the source network settings.":::

6. Specify the **Destination address:** IP Address or Subnet. Then, select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/destination-network.png" alt-text="Screenshot of the destination network settings.":::

7. On the **IP Protocol Type** page, select **TCP**. Then, select **Next**.

8. On the **IP Protocol Port** page, select **From any port** and **To this port:**. Type **8080** in the text box. These settings specify only the HTTP traffic on destination port 8080 gets encrypted. Then, select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/source-port-and-destination-port.png" alt-text="Screenshot of source and destination port settings.":::

9. View the IP filter list.  The configuration of the IP Filter List **azure-onpremises-HTTP8080** triggers encryption for all traffic that matches the following criteria:

   * Any source address in 10.0.1.0/24 (Azure Subnet2)
   * Any destination address in 10.2.27.0/25 (on-premises subnet)
   * TCP protocol
   * Destination port 8080

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/ip-filter-list.png" alt-text="Screenshot of the IP filter list configuration.":::

## <a name="filterlist2"></a>5. Edit the IP filter list

To encrypt the same type of traffic from the on-premises host to the Azure VM, you need a second IP filter. Follow the same steps you used for setting up the first IP filter and create a new IP filter. The only differences are the source subnet and destination subnet.

1. To add a new IP filter to the IP Filter List, select **Edit**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/ip-filter-for-http.png" alt-text="Screenshot of the IP filter list with HTTP traffic.":::

2. On **IP Filter List**, select **Add**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/ip-filter-add-second-entry.png" alt-text="Screenshot of adding a second IP filter entry.":::

3. Create a second IP filter using the settings in the following example:

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/ip-filter-second-entry.png" alt-text="Screenshot of the second IP filter entry settings.":::

4. After you create the second IP filter, the IP filter list looks like this:

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/ip-filter-list-2entries.png" alt-text="Screenshot of the IP filter list with two entries.":::

If you require encryption between an on-premises location and an Azure subnet to protect an application, you don't need to modify the existing IP filter list. Instead, add a new IP filter list. By associating two or more IP filter lists to the same IPsec policy, you gain more flexibility. You can modify or remove one IP filter list without affecting the other IP filter lists.

## <a name="ipsecpolicy"></a>6. Create an IPsec security policy 

Create an IPsec policy with security rules.

1. Select the **IPSecurity Policies on Active directory** that you associated with the OU. Right-click, and select **Create IP Security Policy**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/create-ip-security-policy.png" alt-text="Screenshot of creating the IP security policy.":::

2. Enter a name for the security policy, such as **policy-azure-onpremises**. Then, select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/ipsec-policy-name.png" alt-text="Screenshot of naming the IPsec security policy.":::

3. Select **Next** without selecting the check box.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/security-policy-wizard.png" alt-text="Screenshot of the IPsec policy wizard.":::

4. Verify that the **Edit properties** check box is selected, and then select **Finish**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/edit-security-policy.png" alt-text="Screenshot of editing the IPsec security policy.":::

## <a name="editipsec"></a>7. Edit the IPsec security policy

Add to the IPsec policy the **IP Filter List** and **Filter Action** that you configured earlier.

1. On the **Rules** tab in **HTTP policy Properties**, select **Add**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/add-new-rule.png" alt-text="Screenshot of adding a new security rule to the IPsec policy.":::

2. On **Welcome**, select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/create-security-rule.png" alt-text="Screenshot of creating a new security rule.":::

3. A rule provides the option to define the IPsec mode: tunnel mode or transport mode.

   * In tunnel mode, the original packet gets encapsulated with a set of IP headers. Tunnel mode protects the internal routing information by encrypting the IP header of the original packet. Tunnel mode is widely implemented between gateways in site-to-site VPN scenarios. Tunnel mode is most often used for end-to-end encryption between hosts.

   * Transport mode encrypts only the payload and ESP trailer; the IP header of the original packet isn't encrypted. In transport mode, the IP source and IP destination of the packets are unchanged.

   Select **This rule does not specify a tunnel**, and then select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/transport-mode.png" alt-text="Screenshot of selecting transport mode.":::

4. **Network Type** defines which network connection associates with the security policy. Select **All network connections**, and then select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/network-type.png" alt-text="Screenshot of selecting the network type.":::

5. Select the IP filter list that you created earlier, **azure-onpremises-HTTP8080**, and then select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/selection-filter-list.png" alt-text="Screenshot of selecting the existing IP filter list.":::

6. Select the existing Filter Action **myEncryption** that you created earlier.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/selection-filter-action.png" alt-text="Screenshot of selecting the existing filter action.":::

7. Windows supports four distinct types of authentications: Kerberos, certificates, NTLMv2, and preshared key. Since you're working with domain-joined hosts, select **Active Directory default (Kerberos V5 protocol)**, and then select **Next**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/authentication-method.png" alt-text="Screenshot of selecting the Kerberos authentication method.":::

8. The new policy creates the security rule: **azure-onpremises-HTTP8080**. Select **OK**.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/security-policy-completed.png" alt-text="Screenshot of the completed security policy.":::

The IPsec policy requires all HTTP connections on the destination port 8080 to use IPsec transport mode. Since HTTP is a clear-text protocol, enabling the security policy ensures data is encrypted when it transfers through the ExpressRoute private peering. IPsec policy for Active Directory is more complex to configure than Windows Firewall with Advanced Security. However, it allows for more customization of the IPsec connection.

## <a name="assigngpo"></a>8. Assign the IPsec GPO to the OU

1. View the policy. The security group policy is defined but not yet assigned.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/gpo-not-assigned.png" alt-text="Screenshot of the IPsec policy linked to the GPO but not yet assigned.":::

2. To assign the security group policy to the **IPSecOU** OU, right-click the security policy and choose **Assign**.
   Every computer that belongs to the OU has the security group policy assigned.

   :::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/gpo-assigned.png" alt-text="Screenshot of the IPsec policy assigned to the GPO.":::

## <a name="checktraffic"></a>Check traffic encryption

To check the encryption GPO applied on the OU, install IIS on all Azure VMs and on the host1. Every IIS server is customized to answer to HTTP requests on port 8080.
To verify encryption, you can install a network sniffer (like Wireshark) on all computers in the OU.
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

:::image type="content" source="./media/expressroute-howto-ipsec-transport-private-windows/encrypted-traffic.png" alt-text="Screenshot of captured IPsec encrypted traffic.":::

If you run the PowerShell script on-premises (HTTP client), the network capture in the Azure VM shows a similar trace.

## Next steps

For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
