---
title: Perimeter network example – Protect networks with perimeter network consisting of a firewall, UDR, and NSGs | Microsoft Docs
description: Build a perimeter network (also known as a DMZ) with a firewall, user-defined routing (UDR), and network security groups (NSGs).
services: virtual-network
documentationcenter: na
author: tracsman
manager: rossort
editor: ''

ms.assetid: dc01ccfb-27b0-4887-8f0b-2792f770ffff
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/01/2016
ms.author: jonor;sivae

---
# Example 3: Build a perimeter network to protect networks with a firewall, UDR, and NSGs

[Return to the Security Boundary Best Practices Page][HOME]

In this example, you create a perimeter network (also know as a DMZ, demilitarized zone, and screened subnet). The example implements a firewall, four Windows servers, user-defined routing (UDR), IP forwarding, and network security groups (NSGs). This article walks you through each of the relevant commands to provide a deeper understanding of each step. The traffic scenario section also explains in depth how traffic proceeds through the layers of defense in the perimeter network. Finally, the references section contains all the code and instructions to build this environment so you can test and experiment with various scenarios.

![Bi-directional perimeter network with NVA, NSG, and UDR][1]

## Environment setup

This example uses a subscription that contains the following components:

* Three cloud services: SecSvc001, FrontEnd001, and BackEnd001
* A virtual network (CorpNetwork) with three subnets: SecNet, FrontEnd, and BackEnd
* A network virtual appliance: a firewall connected to the SecNet subnet
* A Windows server that represents an application web server: IIS01
* Two Windows servers that represent application back-end servers: AppVM01, AppVM02
* A Windows server that represents a DNS server: DNS01

The [references section](#references) contains a PowerShell script that builds most of the environment described here. This article doesn't otherwise give detailed instructions for building the virtual machines (VMs) and virtual networks.

To build the environment:

1. Save the network config XML file included in the [reference section](#references). You'll need to update it with names, location, and IP addresses to match the given scenario.
1. Update the user variables in the full script to match your specific environment (for example, subscriptions, service names, and so on).
1. Execute the script in PowerShell.

> [!NOTE]
> The region specified in the PowerShell script must match the region specified in the network configuration XML file.

After the script runs successfully, take the following steps:

1. Set up the firewall rules. See the [firewall rules](#firewall-rules) section.
1. Optionally, use the two scripts in the references section to set up a web application on the web server and app server to allow testing of this DMZ configuration.

## User-defined routing

By default, the following system routes are defined as:

    Effective routes :
     Address Prefix    Next hop type    Next hop IP address Status   Source
     --------------    -------------    ------------------- ------   ------
     {10.0.0.0/16}     VNETLocal                            Active   Default
     {0.0.0.0/0}       internet                             Active   Default
     {10.0.0.0/8}      Null                                 Active   Default
     {100.64.0.0/10}   Null                                 Active   Default
     {172.16.0.0/12}   Null                                 Active   Default
     {192.168.0.0/16}  Null                                 Active   Default

VNETLocal is always the defined address prefix(es) for that specific virtual network. For example, it will change from virtual network to virtual network depending on how each specific virtual network is defined. The remaining system routes are static and default as shown.

As for priority, routes are processed via the Longest Prefix Match (LPM) method. So the most specific route in the table applies to a given destination address.

Therefore, traffic intended for a server like DNS01 (10.0.2.4) on the local network (10.0.0.0/16) is routed across the virtual network because of the 10.0.0.0/16 route.  For 10.0.2.4, the 10.0.0.0/16 route is the most specific route. This rule applies even though the 10.0.0.0/8 and 0.0.0.0/0 might also be applicable. They are less specific, however, so they don’t affect this traffic. Traffic to 10.0.2.4 has the local virtual network as its next hop so is routed to the destination.

For example, the 10.0.0.0/16 route doesn't apply to traffic that is intended for 10.1.1.1. The 10.0.0.0/8 system route is the most specific so the traffic is dropped or "black holed" because the next hop is Null.

If the destination doesn’t apply to any of the Null prefixes or the VNETLocal prefixes, then traffic follows the least specific route (0.0.0.0/0). It is routed out to the internet as the next hop, and out of Azure’s internet edge.

If there are two identical prefixes in the route table, the order of preference is based on the route's source attribute:

1. VirtualAppliance: A User-Defined Route manually added to the table.
1. VPNGateway: A Dynamic Route (BGP when used with hybrid networks) added by a dynamic network protocol. These routes may change over time as the dynamic protocol automatically reflects changes in peered network.
1. Default: The system routes, the local virtual network, and the static entries as shown in the route table above.

> [!NOTE]
> You can now use user-defined routing (UDR) with ExpressRoute and VPN Gateways to force outbound and inbound cross-premises traffic to be routed to a network virtual appliance (NVA).

### Create local routes

This example uses two routing tables, one each for the front-end and back-end subnets. Each table is loaded with static routes appropriate for the given subnet. For the purpose of this example, each table has three routes:

1. Local subnet traffic with no next hop defined. This route allows local subnet traffic to bypass the firewall.
2. Virtual network traffic with a next hop defined as firewall. This route overrides the default rule that allows local virtual network traffic to route directly.
3. All remaining traffic (0/0) with a next hop defined as the firewall.

After the routing tables are created, they are bound to their subnets. The front-end subnet routing table should look like:

    Effective routes :
     Address Prefix    Next hop type       Next hop IP address  Status   Source
     --------------    ------------------  -------------------  ------   ------
     {10.0.1.0/24}     VNETLocal                                Active
     {10.0.0.0/16}     VirtualAppliance    10.0.0.4             Active
     {0.0.0.0/0}       VirtualAppliance    10.0.0.4             Active

This example uses the following commands to build the route table, add a user-defined route, and then bind the route table to a subnet. Items that begin with `$`, such as `$BESubnet`, are user-defined variables from the script in the reference section.

1. First, create the base routing table. The following code snippet creates the table for the back-end subnet. The full script also creates a corresponding table for the front-end subnet.

   ```powershell
   New-AzureRouteTable -Name $BERouteTableName `
       -Location $DeploymentLocation `
       -Label "Route table for $BESubnet subnet"
   ```

1. After you've created the route table, you can add specific user-defined routes. The following code snippet specifies that all traffic (0.0.0.0/0) is routed through the virtual appliance. A variable `$VMIP[0]` is used to pass in the IP address assigned when the virtual appliance was created earlier in the script. The full script also creates a corresponding rule in the front-end table.

   ```powershell
   Get-AzureRouteTable $BERouteTableName | `
       Set-AzureRoute -RouteName "All traffic to FW" -AddressPrefix 0.0.0.0/0 `
       -NextHopType VirtualAppliance `
       -NextHopIpAddress $VMIP[0]
   ```

1. The previous route entry overrides the default "0.0.0.0/0" route, but the default 10.0.0.0/16 rule still allows traffic within the virtual network to route directly to the destination and not to the network virtual appliance. To correct this behavior, you need to add the following rule:

   ```powershell
   Get-AzureRouteTable $BERouteTableName | `
       Set-AzureRoute -RouteName "Internal traffic to FW" -AddressPrefix $VNetPrefix `
       -NextHopType VirtualAppliance `
       -NextHopIpAddress $VMIP[0]
   ```

1. At this point, you have to make a choice. The two previous rules route all traffic to the firewall for assessment, including traffic within a single subnet. You might want this behavior. If you don't, however, you can allow traffic within a subnet to route locally without firewall involvement. Add a third, specific rule that directly routes any address destined for the local subnet (NextHopType = VNETLocal).

   ```powershell
   Get-AzureRouteTable $BERouteTableName | `
       Set-AzureRoute -RouteName "Allow Intra-Subnet Traffic" -AddressPrefix $BEPrefix `
           -NextHopType VNETLocal
   ```

1. Finally, after the routing table is created and populated with user-defined routes, you need to bind the table to a subnet. The following code snippet binds the table for the back-end subnet. The full script also binds the front-end route table to the front-end subnet.

   ```powershell
   Set-AzureSubnetRouteTable -VirtualNetworkName $VNetName `
       -SubnetName $BESubnet `
       -RouteTableName $BERouteTableName
   ```

## IP forwarding

IP forwarding is a companion feature to UDR. This setting on a virtual appliance allows it to receive traffic not addressed to the appliance and then forward that traffic to its ultimate destination.

For example, if traffic from AppVM01 makes a request to the DNS01 server, UDR routes the traffic to the firewall. With IP Forwarding enabled, the traffic with the DNS01 destination (10.0.2.4) is accepted by the firewall appliance (10.0.0.4) and then forwarded to its ultimate destination (10.0.2.4). Without IP forwarding enabled on the firewall, traffic is not accepted by the appliance even though the route table has the firewall as the next hop.

> [!IMPORTANT]
> Remember to enable IP forwarding in conjunction with user-defined routing.

IP forwarding can be enabled with a single command at VM creation time. You call the VM instance that is your firewall virtual appliance and enable IP forwarding. Keep in mind that items in red that begin with `$`, like `$VMName[0]`, are user-defined variables from the script in the reference section of this document. The zero in brackets, `[0]`, represents the first VM in the array of VMs. For the example script to work without modification, the first VM (VM 0) must be the firewall. In full script, the relevant code snippet is grouped with the UDR commands near the end.

```powershell
Get-AzureVM -Name $VMName[0] -ServiceName $ServiceName[0] | `
    Set-AzureIPForwarding -Enable
```

## Network security groups

In this example, you build an network security group (NSG) and then load it with a single rule. The example then binds the NSG only to the front-end and back-end subnets (not the SecNet). The rule you load into the NSG is as follows:

* Any traffic (all ports) from the internet to the entire virtual network (all subnets) is Denied

Although NSGs are used in this example, their main purpose is as a secondary layer of defense against manual misconfiguration. You want to block all inbound traffic from the internet to either the front-end or back-end subnets. Traffic should only flow through the SecNet subnet to the firewall, after which only appropriate traffic should get routed on to the front-end or back-end subnets. In addition, the UDR rules route any traffic that reaches the front-end or back-end subnets to the firewall. The firewall sees it as an asymmetric flow and drops the outbound traffic.

Three layers of security protect the front-end and back-end subnets:

1. No open endpoints on the FrontEnd001 and BackEnd001 cloud services
1. NSGs deny traffic from the internet
1. The firewall drops asymmetric traffic

An interesting point about the NSG in this example is that it contains only one rule, shown below. This rule denies internet traffic to the entire virtual network, including the Security subnet.

```powershell
Get-AzureNetworkSecurityGroup -Name $NSGName | `
    Set-AzureNetworkSecurityRule -Name "Isolate the $VNetName VNet `
    from the internet" `
    -Type Inbound -Priority 100 -Action Deny `
    -SourceAddressPrefix INTERNET -SourcePortRange '*' `
    -DestinationAddressPrefix VIRTUAL_NETWORK `
    -DestinationPortRange '*' `
    -Protocol *
```

Because the NSG is only bound to the front-end and back-end subnets, the rule isn’t applied to  traffic inbound to the Security subnet. As a result, traffic flows to the Security subnet.

```powershell
Set-AzureNetworkSecurityGroupToSubnet -Name $NSGName `
    -SubnetName $FESubnet -VirtualNetworkName $VNetName

Set-AzureNetworkSecurityGroupToSubnet -Name $NSGName `
    -SubnetName $BESubnet -VirtualNetworkName $VNetName
```

## Firewall rules

You must create forwarding rules on the firewall. Because the firewall blocks or forwards all inbound, outbound, and intra-virtual-network traffic, you need many firewall rules. Also, the firewall has to process all inbound traffic to the Security Service public IP address (on different ports). To avoid rework later, follow the best practice by diagramming the logical flows before setting up the subnets and firewall rules. The following figure is a logical view of the firewall rules for this example:

![Logical View of the Firewall Rules][2]

> [!NOTE]
> Management ports vary depending on the network virtual appliance. This example shows a Barracuda NextGen Firewall which uses ports 22, 801, and 807. Please consult the appliance vendor documentation to find the exact ports to manage the device.

### Logical rule description

The logical diagram above doesn't show the security subnet because the firewall is the only resource on that subnet. This diagram shows the firewall rules, how they logically allow or deny traffic flows, but not the actual routed path. Also, the external ports selected for the remote desktop protocol (RDP) traffic are higher ranged ports (8014 – 8026), chosen for easier readability to align with the last two octets of the local IP addresses. For example, local server address 10.0.1.4 is associated with external port 8014. You could, however, use any higher non-conflicting ports.

You need the following types of rules for this example:

* External rules for inbound traffic:
  1. Firewall management rule: allows traffic to pass to the management ports of the network virtual appliance.
  2. RDP rules for each windows server: allows management of the individual servers via RDP.  Depending on the capabilities of your network virtual appliance, you might be able to bundle the rules into one.
  3. Application traffic rules: one for front-end web traffic and one for back-end traffic (for example, web server to data tier). The configuration of these rules depends on network architecture and traffic flows.

     * The first rule allows actual application traffic to reach the application server. Unlike the rules for security, management, and so on, application rules allow external users or services to access the application(s). This example has a single web server on port 80, which allows a single firewall application rule to redirect traffic that is destined for an external IP address to instead route to the web server's internal IP address. The redirected traffic session is remapped by NAT to the internal server.
     * The second application traffic rule is the back-end rule to allow the web server to use any port to route traffic to the AppVM01 server, but not to the AppVM02 server.

* Internal rules for intra-virtual-network traffic:
  1. Outbound to internet rule: allows traffic from any network to pass to the selected networks. This rule is usually a default on the firewall, but in a disabled state. Enable this rule for this example.
  2. DNS rule: only allows DNS (port 53) traffic to pass to the DNS server. For this environment, most traffic from the front end to the back end is blocked. This rule specifically allows DNS from any local subnet.
  3. Subnet-to-subnet rule: allows any server on the back-end subnet to connect to any server on the front-end subnet, but not the reverse.

* Fail-safe rule for traffic that doesn’t meet any of the above criteria:
  1. Deny all traffic rule: always the final rule in terms of priority. If traffic flow fails to match any of the preceding rules, this rule blocks it. It is a default rule. Because it is commonly activated, no modifications are needed.

> [!TIP]
> In the second application traffic rule, any port is allowed to keep this example simple. In a real scenario, you should use specific port and address ranges to reduce the attack surface of this rule.


> [!IMPORTANT]
> After you have created the rules, it’s important that you review the priority of each rule to ensure that traffic is allowed or denied as desired. For this example, the rules are in priority order. It's easy to get locked out of the firewall if the rules are mis-ordered. Make sure to set the firewall management rule as the absolute highest priority.

### Rule prerequisites

Public endpoints are required for the virtual machine running the firewall. These public endpoints must be open so that the firewall can process traffic. There are three types of traffic in this example:

1. Management traffic to control the firewall and firewall rules
1. RDP traffic to control the windows servers
1. Application traffic

The traffic types appear in the upper half of the firewall rules logical diagram above.

> [!IMPORTANT]
> Remember that *all* traffic comes through the firewall. To remote desktop to the IIS01 server, you need to connect to the firewall on port 8014 and then allow the firewall to route the RDP request internally to the IIS01 RDP port. The Azure portal's **Connect** button won't work because there is no direct RDP path to IIS01 as far as the portal can see. All connections from the internet are to the security service and a port (for example, secscv001.cloudapp.net:xxxx ). Reference the above diagram for the mapping of external port and internal IP and port.

You can open an endpoint at the time of VM creation or after the build. The example script and the following code snippet open an endpoint after the VM is created.

Keep in mind that items that begin with `$`, such as `$VMName[$i]`, are user-defined variables from the script in the reference section. The `[$i]` represents the array number of a specific VM in an array of VMs.

```powershell
Add-AzureEndpoint -Name "HTTP" -Protocol tcp -PublicPort 80 -LocalPort 80 `
    -VM (Get-AzureVM -ServiceName $ServiceName[$i] -Name $VMName[$i]) | `
    Update-AzureVM
```

Although it's not clearly shown here because of variables, you should only open endpoints on the security cloud service. This precaution helps  ensure that the firewall handles all inbound traffic, whether it's routed, remapped by NAT, or dropped.

Install a management client on a PC to manage the firewall and create the necessary configurations. For details on how to manage your firewall or other NVA, refer to the vendor's documentation. The remainder of this section as well as the **Firewall rules creation** section describe the configuration of the firewall. Use the vendor's management client, not the Azure portal or PowerShell.

Go to [Barracuda NG Admin](https://techlib.barracuda.com/NG61/NGAdmin) to download the management client and learn how to connect to the Barracuda firewall.

After you're logged into the firewall, define network and service objects before creating the firewall rules. These two prerequisite object classes can make creating the rules easier.

For this example, define three named network objects for each:

* Front-end subnet
* Back-end subnet
* IP address of the DNS server

To create a named network from the Barracuda NG Admin client dashboard:

1. Go to the **configuration tab**.
1. Select **Ruleset** in the **Operational Configuration** section
1. Select **Networks** under the **Firewall Objects** menu.
1. Select **New** in the **Edit Networks** menu.
1. Create the network object by adding the name and the prefix:

   ![Create a front-ed network object][3]

The preceding steps create a named network for the front-end subnet. Create a similar object for the back-end subnet as well. Now the subnets can be more easily referenced by name in the firewall rules.

For the DNS server object:

![Create a DNS server object][4]

This single IP address reference is used in a DNS rule later in the document.

The other object class includes services objects, which represent the RDP connection ports for each server. The existing RDP service object is bound to the default RDP port, 3389. Thus, you can create new services to allow traffic from the external ports (8014-8026). You can also add the new ports to the existing RDP service. However, for ease of demonstration, you can make an individual rule for each server. To create a new RDP rule for a server from the Barracuda NG Admin client dashboard:

1. Go to the **configuration tab**.
1. Select **Ruleset** in the **Operational Configuration** section.
1. Select **Services** under the **Firewall Objects** menu.
1. Scroll down the list of services and select **RDP**.
1. Right-click and select copy, then right-click and select paste.
1. There's now a RDP-Copy1 service object that can be edited. Right-click **RDP-Copy1** and select **Edit**.
1. The **Edit Service Object** window pops up as shown here:

   ![Copy of Default RDP Rule][5]

1. Edit the values to represent the RDP service for a specific server. For AppVM01, the default RDP rule should be modified to reflect a new service **Name**, **Description**, and external RDP Port used in the Figure 8 diagram. Keep in mind that the ports are changed from the RDP default of 3389 to the external port for this specific server. For example, the external port for AppVM01 is 8025. The modified service rule is shown here:

   ![AppVM01 Rule][6]

Repeat this process to create RDP services for the remaining servers: AppVM02, DNS01, and IIS01. These services make the rules in the next section simpler to create and more obvious.

> [!NOTE]
> An RDP service for the firewall is not needed because the firewall VM is a Linux-based image so SSH is used on port 22 for VM management instead of RDP. Also, port 22 and two other ports are allowed for management connectivity. See the **Firewall management rule** in the next section.

### Firewall rules creation

There are three types of firewall rules used in this example, all with distinct icons:

The application redirect rule: ![Application Redirect Icon][7]

The destination NAT rule: ![Destination NAT Icon][8]

The pass rule: ![Pass Icon][9]

More information on these rules can be found at the Barracuda website.

To create the following rules or verify existing default rules:

1. From the Barracuda NG Admin client dashboard, go to the **configuration** tab.
1. In the **Operational Configuration** section, select **Ruleset**.
1. The **Main Rules** grid shows the existing active and deactivated rules on this firewall. Select the green **+** in the upper right corner to create a new rule. If your firewall is locked for changes, you see a button marked **Lock** and can't create or edit rules. Select the **Lock** button to unlock the rule set and allow editing. Right-click a rule you want to edit, and select **Edit Rule**.

After you create or modify any rules, push them to the firewall and activate them. Otherwise, the rule changes won't take effect. The push and activation process is described in [rule activation](#rule-activation).

Here are the specifics of each rule required to complete this example:

* **Firewall management rule**: This app redirect rule allows traffic to pass to the management ports of the network virtual appliance, in this example a Barracuda NextGen Firewall. The management ports are 801, 807, and optionally 22. The external and internal ports are the same, no port translation. This rule is called SETUP-MGMT-ACCESS. It's a default rule and enabled by default in Barracuda NextGen Firewall, version 6.1.
  
    ![Firewall Management Rule][10]

  > [!TIP]
  > The source address space in this rule is **Any**. If the management IP address ranges are known, reducing this scope also reduces the attack surface to the management ports.

* **RDP rules**:  These destination NAT rules allow management of the individual servers via RDP. The critical fields for these rules are:
  * Source. To allow RDP from anywhere, use the reference **Any** in the Source field.
  * Service. Use the RDP service object you created earlier: **AppVM01 RDP**. The external ports redirect to the server's local IP address and to the default RDP port 3386. This specific rule is for RDP access to AppVM01.
  * Destination. Use the local port on the firewall: **DCHP 1 Local IP** or **eth0** if you're using static IPs. The ordinal number (eth0, eth1, and so on) might be different if your network appliance has multiple local interfaces. The firewall uses this port for sending, and it might be the same as the receiving port. The actual routed destination is in the **Target List** field.
  * Redirection. Configure to tell the virtual appliance where to ultimately redirect this traffic. The simplest redirection is to place the IP in the Target List field. You can also specify the port, and NAT reroutes both the port and the IP address. If you don't specify a port, the virtual appliance uses the destination port on the inbound request.

    ![Firewall RDP Rule][11]

    Create four RDP rules:

    | Rule Name | Server | Service | Target List |
    | --- | --- | --- | --- |
    | RDP-to-IIS01 |IIS01 |IIS01 RDP |10.0.1.4:3389 |
    | RDP-to-DNS01 |DNS01 |DNS01 RDP |10.0.2.4:3389 |
    | RDP-to-AppVM01 |AppVM01 |AppVM01 RDP |10.0.2.5:3389 |
    | RDP-to-AppVM02 |AppVM02 |AppVm02 RDP |10.0.2.6:3389 |

  > [!TIP]
  > Narrowing the scope of the Source and Service fields reduces the attack surface. Use the most limited scope that allows functionality.

* **Application traffic rules**: There are two application traffic rules. One is for the front-end web traffic. The other covers back-end traffic like web server to data tier. These rules depend on network architecture and traffic flows.
  
  * The front-end rule for web traffic:
  
    ![Firewall Web Rule][12]
  
    This Destination NAT rule allows actual application traffic to reach the application server. Unlike the rules for security, management, and etcetera, application rules allow external users or services to access the application(s). This example has a single web server on port 80, which allows a single firewall application rule to redirect traffic that is destined for an external IP address to instead route to the web server's internal IP address. The redirected traffic session is remapped by NAT to the internal server.

    > [!NOTE]
    > There is no port assigned in the **Target List** field. Thus, the inbound port 80 (or 443 for the Service selected) is used in the redirection of the web server. If the web server is listening on a different port like 8080, you can update the Target List field to 10.0.1.4:8080 to allow for the port redirection as well.
  
  * The back-end rule allows the web server to talk to the AppVM01 server, but not AppVM02, via **Any** service:
  
    ![Firewall AppVM01 Rule][13]
  
    This pass rule allows any IIS server on the front-end subnet to reach AppVM01 (10.0.2.5) on any port using any protocol so that data can be accessed by the web application.
  
    In this screenshot, `<explicit-dest>` is used in the **Destination** field to signify 10.0.2.5 as the destination. You can specify the IP address explicitly as shown in the screenshot. You can also use a named Network Object like in the prerequisites for the DNS server. The firewall administrator can choose which method to use. To add 10.0.2.5 as an explicit destination, double-click on the first blank row under `<explicit-dest>` and enter the address in the dialog box that opens.
  
    With this pass rule, no NAT is needed because it's handling internal traffic. You can set the **Connection Method** to `No SNAT`.
  
    > [!NOTE]
    > The Source network in this rule is any resource on the front-end subnet if there is only one. If your architecture specifies a known number of web servers, you can create a Network Object resource to be more specific to those exact IP addresses instead of the entire front-end subnet.

    > [!TIP]
    > This rule uses the service **Any** to make the sample application easier to setup and use. It allows ICMPv4 (ping) in a single rule. However, to reduce the attack surface across this boundary, we recommend restricting the ports and protocols Services to the minimum possible that allow application operation.

    > [!TIP]
    > Although this example rule uses `<explicit-dest>` reference, you should use a consistent approach throughout the firewall configuration. We recommended using a named Network Object for easier readability and supportability. The `<explicit-dest>` shown here is only to show an alternative reference method. We don't generally recommended it, especially for complex configurations.

* **Outbound-to-internet rule**: This pass rule allows traffic from any Source network to pass to the selected Destination networks. The Barracuda NextGen firewall usually has this rule "on" by default, but in a disabled state. Right-click on this rule to access the **Activate Rule** command. Modify the rule shown in the screenshot to add the network objects for back-end and front-end subnets to the Source attribute of this rule. You created these network objects in the prerequisite section of this article.
  
    ![Firewall Outbound Rule][14]

* **DNS rule**: This pass rule allows only DNS (port 53) traffic to pass to the DNS server. For this environment, most traffic from the front end to the back end is blocked so this rule specifically allows DNS traffic.
  
    ![Firewall DNS Rule][15]
  
    > [!NOTE]
    > The **Connection Method** is set to `No SNAT` because this rule is for internal IP to internal IP address traffic and no rerouting via NAT is required.

* **Subnet-to-subnet rule**: This default pass rule has been activated and modified to allow any server on the back-end subnet to connect to any server on the front-end subnet. This rule only coves internal traffic so the **Connection Method** can be set to `No SNAT`.

    ![Firewall Intra-VNet Rule][16]
  
    > [!NOTE]
    > The **Bi-directional** check box is not selected here so this rule applies in only one direction. A connection can be initiated from the back-end subnet to the front-end network, but not the reverse. If that check box were selected, this rule would enable bi-directional traffic, which we've specified as undesirable in  our logical diagram.

* **Deny all traffic rule**: This rule should always be the final rule in terms of priority. If traffic flow does not match any of the preceding rules, this rule causes it to be dropped. The rule is commonly activated by default so no modifications are needed.
  
    ![Firewall Deny Rule][17]

> [!IMPORTANT]
> After all of the preceding rules are created, review the priority of each rule to ensure traffic is allowed or denied as desired. For this example, the rules are listed in the order they should appear in the Barracuda Management client's main grid of forwarding rules.

## Rule activation

After you've modified the rule set to meet the specifications of the logic diagram, you need to upload the rule set to the firewall and activate it.

![Firewall Rule Activation][18]

Look in the upper right corner of the management client window and select **Send Changes** to upload the modified rules to the firewall. Select **Activate**.

When you activate the firewall rule set, this example environment is complete.

## Traffic scenarios

> [!IMPORTANT]
> Remember that *all* traffic comes through the firewall. To remote desktop to the IIS01 server, you need to connect to the firewall on port 8014 and then allow the firewall to route the RDP request internally to the IIS01 RDP port. The Azure portal's **Connect** button won't work because there is no direct RDP path to IIS01 as far as the portal can see. All connections from the internet are to the security service and a port (for example, secscv001.cloudapp.net:xxxx ). Reference the above diagram for the mapping of external port and internal IP and port.

For these scenarios, the following firewall rules should be in place:

1. Firewall Management (FW Mgmt)
2. RDP to IIS01
3. RDP to DNS01
4. RDP to AppVM01
5. RDP to AppVM02
6. App Traffic to the Web
7. App Traffic to AppVM01
8. Outbound to the internet
9. Front end to DNS01
10. Intra-Subnet Traffic (back end to front end only)
11. Deny All

Your actual firewall rule set will most likely require more rules than those in this example. They're likely to have different priority numbers as well. You should refer to this list and associated numbers for their relative priority to each other. For example, the "RDP to IIS01" rule might be number 5 on the actual firewall, but as long as it’s below the "Firewall Management" rule and above the "RDP to DNS01" rule, the set aligns with the intention of this list. This list also helps simplify the instructions for scenarios that follow. For example, "Firewall rule 9 (DNS)." Be aware that the four RDP rules are collectively called "the RDP rules" when the traffic scenario is unrelated to RDP.

Also recall that network security groups (NSGs) are in place for inbound internet traffic on the front-end and back-end subnets.

### (Allowed) Internet to web server

1. An internet user requests HTTP page from SecSvc001.CloudApp.Net (internet-facing cloud service).
1. The cloud service passes traffic through an open endpoint on port 80 to the firewall interface on 10.0.0.4:80.
1. No NSG is assigned to Security subnet so the system NSG rules allow the traffic to the firewall.
1. The traffic hits an internal IP address of the firewall (10.0.1.4).
1. The firewall performs rule processing:
   1. Firewall rule 1 (FW Mgmt) doesn’t apply. Move to next rule.
   1. Firewall rules 2 - 5 (RDP rules) don’t apply. Move to next rule.
   1. Firewall rule 6 (App: Web) does apply. The traffic is allowed. Firewall reroutes the traffic via NAT to 10.0.1.4 (IIS01).
1. The front-end subnet performs inbound rule processing:
   1. NSG rule 1 (Block internet) doesn’t apply. The firewall rerouted this traffic via NAT so the source address is now the firewall. Because the firewall is on the Security subnet and appears as local traffic to the front-end subnet NSG, the traffic is allowed. Move to next rule.
   1. Default NSG rules allow subnet-to-subnet traffic so this traffic is allowed. Stop NSG rule processing.
1. IIS01 is listening for web traffic. It receives this request and starts processing the request.
1. IIS01 attempts to initiate an FTP session to AppVM01 on the back-end subnet.
1. The UDR route on front-end subnet makes the firewall the next hop.
1. There are no outbound rules on front-end subnet so the traffic is allowed.
1. Firewall begins rule processing:
   1. Firewall rule 1 (FW Mgmt) doesn’t apply. Move to next rule.
   1. Firewall rules 2 - 5 (RDP rules) don’t apply. Move to next rule.
   1. Firewall rule 6 (App: Web) doesn't apply. Move to next rule.
   1. Firewall rule 7 (App: back end) does apply. The traffic is allowed. The firewall forwards the traffic to 10.0.2.5 (AppVM01).
1. The back-end subnet performs inbound rule processing:
    1. NSG rule 1 (Block internet) doesn’t apply. Move to next rule.
    1. Default NSG rules allow subnet-to-subnet traffic. The traffic is allowed. Stop NSG rule processing.
1. AppVM01 receives the request, initiates the session, and responds.
1. The UDR route on back-end subnet makes the firewall the next hop.
1. There are no outbound NSG rules on the back-end subnet so the response is allowed.
1. Because it is returning traffic on an established session, the firewall passes the response back to the web server (IIS01).
1. Front-end subnet performs inbound rule processing:
    1. NSG rule 1 (Block internet) doesn’t apply. Move to next rule.
    1. The default NSG rules allow subnet-to-subnet traffic so this traffic is allowed. Stop NSG rule processing.
1. The IIS server receives the response and completes the transaction with AppVM01. Then the server completes building the HTTP response and sends it to the requestor.
1. There are no outbound NSG rules on the front-end subnet so the response is allowed.
1. The HTTP response hits the firewall. Because it is a response to an established NAT session, the firewall accepts it.
1. The firewall redirects the response back to the internet user.
1. There are no outbound NSG rules or UDR hops on the front-end subnet so the response is allowed. The internet user receives the web page requested.

### (Allowed) Internet RDP to back end

1. A server admin on the internet requests an RDP session to AppVM01 via SecSvc001.CloudApp.Net:8025. 8025 is the user-assigned port number for the firewall rule 4 (RDP AppVM01).
1. The cloud service passes traffic through the open endpoint on port 8025 to firewall interface on 10.0.0.4:8025.
1. No NSG is assigned to Security subnet so system NSG rules allow traffic to the firewall.
1. The firewall performs rule processing:
   1. Firewall rule 1 (FW Mgmt) doesn’t apply. Move to next rule.
   1. Firewall rule 2 (RDP IIS) doesn’t apply. Move to next rule.
   1. Firewall rule 3 (RDP DNS01) doesn’t apply. Move to next rule.
   1. Firewall rule 4 (RDP AppVM01) does apply so traffic is allowed. The  firewall reroutes it via NAT to 10.0.2.5:3386 (RDP port on AppVM01).
1. The back-end subnet performs inbound rule processing:
   1. NSG rule 1 (Block internet) doesn’t apply. The firewall rerouted this traffic via NAT so the source address is now the firewall that is on the Security subnet. It's seen by the back-end subnet NSG to be local traffic and is allowed. Move to next rule.
   1. Default NSG rules allow subnet-to-subnet traffic so this traffic is allowed. Stop NSG rule processing.
1. AppVM01 is listening for RDP traffic and responds.
1. There are no outbound NSG rules so default rules apply. Return traffic is allowed.
1. UDR routes outbound traffic to the firewall as the next hop.
1. Because it is returning traffic on an established session, the firewall passes the response back to the internet user.
1. RDP session is enabled.
1. AppVM01 prompts for user name password.

### (Allowed) Web server DNS lookup on DNS server

1. Web server IIS01 requests a data feed at http\:\/\/www.data.gov, but needs to resolve the address.
1. The network configuration for the virtual network lists DNS01 (10.0.2.4 on the back-end subnet) as the primary DNS server. IIS01 sends the DNS request to DNS01.
1. UDR routes outbound traffic to the firewall as the next hop.
1. No outbound NSG rules are bound to the front-end subnet. The traffic is allowed.
1. Firewall performs rule processing:
   1. Firewall rule 1 (FW Mgmt) doesn’t apply. Move to next rule.
   1. Firewall rule 2 - 5 (RDP Rules) don’t apply. Move to next rule.
   1. Firewall rules 6 & 7 (App Rules) don’t apply. Move to next rule.
   1. Firewall rule 8 (To internet) doesn’t apply. Move to next rule.
   1. Firewall rule 9 (DNS) does apply. The traffic is allowed. Firewall forwards the traffic to 10.0.2.4 (DNS01).
1. The back-end subnet performs inbound rule processing:
   1. NSG rule 1 (Block internet) doesn’t apply. Move to next rule.
   1. Default NSG rules allow subnet-to-subnet traffic. The traffic is allowed. Stop NSG rule processing.
1. The DNS server receives the request.
1. The DNS server doesn’t have the address cached and asks a root DNS server on the internet.
1. UDR routes the outbound traffic to the firewall as the next hop.
1. There are no outbound NSG rules on back-end subnet to the traffic is allowed.
1. Firewall performs rule processing:
   1. Firewall rule 1 (FW Mgmt) doesn’t apply. Move to next rule.
   1. Firewall rule 2 - 5 (RDP Rules) don’t apply. Move to next rule.
   1. Firewall rules 6 & 7 (App Rules) don’t apply. Move to next rule.
   1. Firewall rule 8 (to the internet) does apply. The traffic is allowed. The session is rerouted via SNAT to the root DNS server on the internet.
1. The internet DNS server responds. This session was initiated from the firewall so the response is accepted by the firewall.
1. This session is already established so the firewall forwards the response to the initiating server, DNS01.
1. The back-end subnet performs inbound rule processing:
    1. NSG rule 1 (Block internet) doesn’t apply. Move to next rule.
    1. Default NSG rules allow subnet-to-subnet traffic to this traffic is allowed. Stop NSG rule processing.
1. The DNS server receives and caches the response, and then responds to the initial request back to IIS01.
1. The UDR route on back-end subnet makes the firewall the next hop.
1. No outbound NSG rules exist on the back-end subnet so the traffic is allowed.
1. This session is already established on the firewall so the firewall reroutes the response back to the IIS server.
1. The front-end subnet performs inbound rule processing:
    1. There's no NSG rule for inbound traffic from the back-end subnet to the front-end subnet so none of the NSG rules apply.
    1. The default system rule allows traffic between subnets. The traffic is allowed.
1. IIS01 receives the response from DNS01.

### (Allowed) Back-end server to front-end server

1. An administrator logged on to AppVM02 via RDP requests a file directly from the IIS01 server via windows file explorer.
1. The UDR route on back-end subnet makes the firewall the next hop.
1. There are no outbound NSG rules on the back-end subnet so the response is allowed.
1. The firewall performs rule processing:
   1. Firewall rule 1 (FW Mgmt) doesn’t apply. Move to next rule.
   1. Firewall rule 2 - 5 (RDP rules) don’t apply. Move to next rule.
   1. Firewall rules 6 & 7 (App rules) don’t apply. Move to next rule.
   1. Firewall rule 8 (To internet) doesn’t apply. Move to next rule.
   1. Firewall rule 9 (DNS) doesn’t apply. Move to next rule.
   1. Firewall rule 10 (Intra-Subnet) does apply. The traffic is allowed. The firewall passes traffic to 10.0.1.4 (IIS01).
1. The front-end subnet begins inbound rule processing:
   1. NSG Rule 1 (Block internet) doesn’t apply, move to next rule
   1. The default NSG rules allow subnet-to-subnet traffic so the traffic is allowed. Stop NSG rule processing.
1. Assuming proper authentication and authorization, IIS01 accepts the request and responds.
1. The UDR route on the front-end subnet makes the firewall the next hop.
1. There are no outbound NSG rules on the front-end subnet so the response is allowed.
1. This session already exists on the firewall so this response is allowed. The firewall returns the response to AppVM02.
1. The back-end subnet performs inbound rule processing:
    1. NSG rule 1 (Block internet) doesn’t apply. Move to next rule.
    2. The default NSG Rules allow subnet-to-subnet traffic so the traffic is allowed. Stop NSG rule processing.
1. AppVM02 receives the response.

### (Denied) Internet direct to web server

1. An internet user tries to access the IIS01 web server through the FrontEnd001.CloudApp.Net service.
1. There are no endpoints open for HTTP traffic so this traffic doesn't pass through the cloud service. The traffic doesn't reach the server.
1. If the endpoints are open for some reason, the NSG (Block internet) on the front-end subnet blocks this traffic.
1. Finally, the front-end subnet UDR route sends any outbound traffic from IIS01 to the firewall as the next hop. The firewall sees it as asymmetric traffic and drops the outbound response.

>Thus, there are at least three independent layers of defense between the internet and IIS01. The cloud service prevents unauthorized or inappropriate access.

### (Denied) Internet to back-end server

1. An internet user tries to access a file on AppVM01 through the BackEnd001.CloudApp.Net service.
2. There are no endpoints open for file sharing so this request doesn't pass the cloud service. The traffic doesn't reach the server.
3. If the endpoints are open for some reason, the NSG (Block internet) blocks this traffic.
4. Finally, the UDR route sends any outbound traffic from AppVM01 to the firewall as the next hop. The firewall sees it as asymmetric traffic and drops the outbound response.

> Thus, there are at least three independent layers of defense between the internet and AppVM01. The cloud service prevents unauthorized or inappropriate access.

### (Denied) Front-end server to back-end server

1. IIS01 is compromised and is running malicious code trying to scan the back-end subnet servers.
1. The front-end subnet UDR route sends any outbound traffic from IIS01 to the firewall as the next hop. The compromised VM can't alter this routing.
1. The firewall processes the traffic. If the request is to AppVM01 or to the DNS server for DNS lookups, the firewall might potentially allow the traffic because of Firewall rules 7 and 9. All other traffic is blocked by Firewall rule 11 (Deny All).
1. If you enable advanced threat detection on the firewall, traffic that contains known signatures or patterns that flag an advanced threat rule could be prevented. This measure can work even if the traffic is allowed according to the basic forwarding rules that are discussed in this article. Advanced threat detection isn't covered in this document. See the vendor documentation for your specific network appliance advanced threat capabilities.

### (Denied) Internet DNS lookup on DNS server

1. An internet user tries to look up an internal DNS record on DNS01 through BackEnd001.CloudApp.Net service.
1. Since there are no endpoints open for DNS traffic, this traffic doesn't pass through the cloud service. It doesn't reach the server.
1. If the endpoints are open for some reason, the NSG rule (Block internet) on the front-end subnet blocks this traffic.
1. Finally, the back-end subnet UDR route sends any outbound traffic from DNS01 to the firewall as the next hop. The firewall sees this as asymmetric traffic and drops the outbound response.

> Thus, there are at least three independent layers of defense between the internet and DNS01. The cloud service prevents unauthorized or inappropriate access.

#### (Denied) Internet to SQL access through firewall

1. An internet user requests SQL data from the SecSvc001.CloudApp.Net internet-facing cloud service.
1. There are no endpoints open for SQL so this traffic doesn't pass the cloud service. It doesn't reach the firewall.
1. If SQL endpoints are open for some reason, the firewall performs rule processing:
   1. Firewall rule 1 (FW Mgmt) doesn’t apply. Move to next rule.
   1. Firewall rules 2 - 5 (RDP Rules) don’t apply. Move to next rule.
   1. Firewall rules 6 & 7 (Application Rules) don’t apply. Move to next rule.
   1. Firewall rule 8 (To internet) doesn’t apply. Move to next rule.
   1. Firewall rule 9 (DNS) doesn’t apply. Move to next rule.
   1. Firewall rule 10 (Intra-Subnet) doesn’t apply. Move to next rule.
   1. Firewall rule 11 (Deny All) does apply. Traffic is blocked. Stop rule processing.

## References

This section contains the following items:

* Full script. Save it in a PowerShell script file.
* Network Config. Save it into a file named NetworkConf2.xml.

Modify the user-defined variables in the files as needed. Run the script, and then follow the Firewall rule setup instructions listed earlier in this article.

### Full script

After setting the user-defined variables, run this script to:

1. Connect to an Azure subscription
1. Create a new storage account
1. Create a new virtual network and three subnets as defined in the Network Config file
1. Build five virtual machines: a firewall and four Windows Server VMs
1. Configure UDR:
   1. Create two new route tables
   1. Add routes to the tables
   1. Bind tables to appropriate subnets
1. Enable IP Forwarding on the NVA
1. Configure NSG:
   1. Create an NSG
   1. Add a rule
   1. Bind the NSG to the appropriate subnets

Run this PowerShell script locally on an internet connected PC or server.

> [!IMPORTANT]
> When you run this script, warnings or other informational messages might  pop up in PowerShell. Only red error messages are cause for concern.

```powershell
    <#
     .SYNOPSIS
      Example of DMZ and User Defined Routing in an isolated network (Azure only, no hybrid connections)

     .DESCRIPTION
      This script will build out a sample DMZ setup containing:
       - A default storage account for VM disks
       - Three new cloud services
       - Three Subnets (SecNet, FrontEnd, and BackEnd subnets)
       - A Network Virtual Appliance (NVA), in this case a Barracuda NextGen Firewall
       - One server on the FrontEnd Subnet
       - Three Servers on the BackEnd Subnet
       - IP Forwarding from the FireWall out to the internet
       - User Defined Routing FrontEnd and BackEnd Subnets to the NVA

      Before running script, ensure the network configuration file is created in
      the directory referenced by $NetworkConfigFile variable (or update the
      variable to reflect the path and file name of the config file being used).

     .Notes
      Everyone's security requirements are different and can be addressed in a myriad of ways.
      Please be sure that any sensitive data or applications are behind the appropriate
      layer(s) of protection. This script serves as an example of some of the techniques
      that can be used, but should not be used for all scenarios. You are responsible to
      assess your security needs and the appropriate protections needed, and then effectively
      implement those protections.

      Security Service (SecNet subnet 10.0.0.0/24)
       myFirewall - 10.0.0.4

      FrontEnd Service (FrontEnd subnet 10.0.1.0/24)
       IIS01      - 10.0.1.4

      BackEnd Service (BackEnd subnet 10.0.2.0/24)
       DNS01      - 10.0.2.4
       AppVM01    - 10.0.2.5
       AppVM02    - 10.0.2.6

    #>

    # Fixed Variables
        $LocalAdminPwd = Read-Host -Prompt "Enter Local Admin Password to be used for all VMs"
        $VMName = @()
        $ServiceName = @()
        $VMFamily = @()
        $img = @()
        $size = @()
        $SubnetName = @()
        $VMIP = @()

    # User Defined Global Variables
      # These should be changes to reflect your subscription and services
      # Invalid options will fail in the validation section

      # Subscription Access Details
        $subID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

      # VM Account, Location, and Storage Details
        $LocalAdmin = "theAdmin"
        $DeploymentLocation = "Central US"
        $StorageAccountName = "vmstore02"

      # Service Details
        $SecureService = "SecSvc001"
        $FrontEndService = "FrontEnd001"
        $BackEndService = "BackEnd001"

      # Network Details
        $VNetName = "CorpNetwork"
        $VNetPrefix = "10.0.0.0/16"
        $SecNet = "SecNet"
        $FESubnet = "FrontEnd"
        $FEPrefix = "10.0.1.0/24"
        $BESubnet = "BackEnd"
        $BEPrefix = "10.0.2.0/24"
        $NetworkConfigFile = "C:\Scripts\NetworkConf3.xml"

      # VM Base Disk Image Details
        $SrvImg = Get-AzureVMImage | Where {$_.ImageFamily -match 'Windows Server 2012 R2 Datacenter'} | sort PublishedDate -Descending | Select ImageName -First 1 | ForEach {$_.ImageName}
        $FWImg = Get-AzureVMImage | Where {$_.ImageFamily -match 'Barracuda NextGen Firewall'} | sort PublishedDate -Descending | Select ImageName -First 1 | ForEach {$_.ImageName}

      # UDR Details
        $FERouteTableName = "FrontEndSubnetRouteTable"
        $BERouteTableName = "BackEndSubnetRouteTable"

      # NSG Details
        $NSGName = "MyVNetSG"

    # User Defined VM Specific Config
        # Note: To ensure UDR and IP forwarding is setup
        # properly this script requires VM 0 be the NVA.

        # VM 0 - The Network Virtual Appliance (NVA)
          $VMName += "myFirewall"
          $ServiceName += $SecureService
          $VMFamily += "Firewall"
          $img += $FWImg
          $size += "Small"
          $SubnetName += $SecNet
          $VMIP += "10.0.0.4"

        # VM 1 - The Web Server
          $VMName += "IIS01"
          $ServiceName += $FrontEndService
          $VMFamily += "Windows"
          $img += $SrvImg
          $size += "Standard_D3"
          $SubnetName += $FESubnet
          $VMIP += "10.0.1.4"

        # VM 2 - The First Application Server
          $VMName += "AppVM01"
          $ServiceName += $BackEndService
          $VMFamily += "Windows"
          $img += $SrvImg
          $size += "Standard_D3"
          $SubnetName += $BESubnet
          $VMIP += "10.0.2.5"

        # VM 3 - The Second Application Server
          $VMName += "AppVM02"
          $ServiceName += $BackEndService
          $VMFamily += "Windows"
          $img += $SrvImg
          $size += "Standard_D3"
          $SubnetName += $BESubnet
          $VMIP += "10.0.2.6"

        # VM 4 - The DNS Server
          $VMName += "DNS01"
          $ServiceName += $BackEndService
          $VMFamily += "Windows"
          $img += $SrvImg
          $size += "Standard_D3"
          $SubnetName += $BESubnet
          $VMIP += "10.0.2.4"

    # ----------------------------- #
    # No User Defined Variables or   #
    # Configuration past this point #
    # ----------------------------- #

      # Get your Azure accounts
        Add-AzureAccount
        Set-AzureSubscription –SubscriptionId $subID -ErrorAction Stop
        Select-AzureSubscription -SubscriptionId $subID -Current -ErrorAction Stop

      # Create Storage Account
        If (Test-AzureName -Storage -Name $StorageAccountName) {
            Write-Host "Fatal Error: This storage account name is already in use, please pick a different name." -ForegroundColor Red
            Return}
        Else {Write-Host "Creating Storage Account" -ForegroundColor Cyan
              New-AzureStorageAccount -Location $DeploymentLocation -StorageAccountName $StorageAccountName}

      # Update Subscription Pointer to New Storage Account
        Write-Host "Updating Subscription Pointer to New Storage Account" -ForegroundColor Cyan 
        Set-AzureSubscription –SubscriptionId $subID -CurrentStorageAccountName $StorageAccountName -ErrorAction Stop

    # Validation
    $FatalError = $false

    If (-Not (Get-AzureLocation | Where {$_.DisplayName -eq $DeploymentLocation})) {
         Write-Host "This Azure Location was not found or available for use" -ForegroundColor Yellow
         $FatalError = $true}

    If (Test-AzureName -Service -Name $SecureService) { 
        Write-Host "The SecureService service name is already in use, please pick a different service name." -ForegroundColor Yellow
        $FatalError = $true}
    Else { Write-Host "The FrontEndService service name is valid for use." -ForegroundColor Green}

    If (Test-AzureName -Service -Name $FrontEndService) { 
        Write-Host "The FrontEndService service name is already in use, please pick a different service name." -ForegroundColor Yellow
        $FatalError = $true}
    Else { Write-Host "The FrontEndService service name is valid for use" -ForegroundColor Green}

    If (Test-AzureName -Service -Name $BackEndService) { 
        Write-Host "The BackEndService service name is already in use, please pick a different service name." -ForegroundColor Yellow
        $FatalError = $true}
    Else { Write-Host "The BackEndService service name is valid for use." -ForegroundColor Green}

    If (-Not (Test-Path $NetworkConfigFile)) { 
        Write-Host 'The network config file was not found, please update the $NetworkConfigFile variable to point to the network config xml file.' -ForegroundColor Yellow
        $FatalError = $true}
    Else { Write-Host "The network config file was found" -ForegroundColor Green
            If (-Not (Select-String -Pattern $DeploymentLocation -Path $NetworkConfigFile)) {
                Write-Host 'The deployment location was not found in the network config file, please check the network config file to ensure the $DeploymentLocation variable is correct and the network config file matches.' -ForegroundColor Yellow
                $FatalError = $true}
            Else { Write-Host "The deployment location was found in the network config file." -ForegroundColor Green}}

    If ($FatalError) {
        Write-Host "A fatal error has occurred, please see the above messages for more information." -ForegroundColor Red
        Return}
    Else { Write-Host "Validation passed, now building the environment." -ForegroundColor Green}

    # Create VNET
        Write-Host "Creating VNET" -ForegroundColor Cyan 
        Set-AzureVNetConfig -ConfigurationPath $NetworkConfigFile -ErrorAction Stop

    # Create Services
        Write-Host "Creating Services" -ForegroundColor Cyan
        New-AzureService -Location $DeploymentLocation -ServiceName $SecureService -ErrorAction Stop
        New-AzureService -Location $DeploymentLocation -ServiceName $FrontEndService -ErrorAction Stop
        New-AzureService -Location $DeploymentLocation -ServiceName $BackEndService -ErrorAction Stop

    # Build VMs
        $i=0
        $VMName | Foreach {
            Write-Host "Building $($VMName[$i])" -ForegroundColor Cyan
            If ($VMFamily[$i] -eq "Firewall") 
                { 
                New-AzureVMConfig -Name $VMName[$i] -ImageName $img[$i] –InstanceSize $size[$i] | `
                    Add-AzureProvisioningConfig -Linux -LinuxUser $LocalAdmin -Password $LocalAdminPwd  | `
                    Set-AzureSubnet  –SubnetNames $SubnetName[$i] | `
                    Set-AzureStaticVNetIP -IPAddress $VMIP[$i] | `
                    New-AzureVM –ServiceName $ServiceName[$i] -VNetName $VNetName -Location $DeploymentLocation
                # Set up all the EndPoints we'll need once we're up and running
                # Note: All traffic goes through the firewall, so we'll need to set up all ports here.
                #       Also, the firewall will be redirecting traffic to a new IP and Port in a forwarding
                #       rule, so all of these endpoint have the same public and local port and the firewall
                #       will do the mapping, NATing, and/or redirection as declared in the firewall rules.
                Add-AzureEndpoint -Name "MgmtPort1" -Protocol tcp -PublicPort 801  -LocalPort 801  -VM (Get-AzureVM -ServiceName $ServiceName[$i] -Name $VMName[$i]) | Update-AzureVM
                Add-AzureEndpoint -Name "MgmtPort2" -Protocol tcp -PublicPort 807  -LocalPort 807  -VM (Get-AzureVM -ServiceName $ServiceName[$i] -Name $VMName[$i]) | Update-AzureVM
                Add-AzureEndpoint -Name "HTTP"      -Protocol tcp -PublicPort 80   -LocalPort 80   -VM (Get-AzureVM -ServiceName $ServiceName[$i] -Name $VMName[$i]) | Update-AzureVM
                Add-AzureEndpoint -Name "RDPWeb"    -Protocol tcp -PublicPort 8014 -LocalPort 8014 -VM (Get-AzureVM -ServiceName $ServiceName[$i] -Name $VMName[$i]) | Update-AzureVM
                Add-AzureEndpoint -Name "RDPApp1"   -Protocol tcp -PublicPort 8025 -LocalPort 8025 -VM (Get-AzureVM -ServiceName $ServiceName[$i] -Name $VMName[$i]) | Update-AzureVM
                Add-AzureEndpoint -Name "RDPApp2"   -Protocol tcp -PublicPort 8026 -LocalPort 8026 -VM (Get-AzureVM -ServiceName $ServiceName[$i] -Name $VMName[$i]) | Update-AzureVM
                Add-AzureEndpoint -Name "RDPDNS01"  -Protocol tcp -PublicPort 8024 -LocalPort 8024 -VM (Get-AzureVM -ServiceName $ServiceName[$i] -Name $VMName[$i]) | Update-AzureVM
                # Note: A SSH endpoint is automatically created on port 22 when the appliance is created.
                }
            Else
                {
                New-AzureVMConfig -Name $VMName[$i] -ImageName $img[$i] –InstanceSize $size[$i] | `
                    Add-AzureProvisioningConfig -Windows -AdminUsername $LocalAdmin -Password $LocalAdminPwd  | `
                    Set-AzureSubnet  –SubnetNames $SubnetName[$i] | `
                    Set-AzureStaticVNetIP -IPAddress $VMIP[$i] | `
                    Set-AzureVMMicrosoftAntimalwareExtension -AntimalwareConfiguration '{"AntimalwareEnabled" : true}' | `
                    Remove-AzureEndpoint -Name "RemoteDesktop" | `
                    Remove-AzureEndpoint -Name "PowerShell" | `
                    New-AzureVM –ServiceName $ServiceName[$i] -VNetName $VNetName -Location $DeploymentLocation
                }
            $i++
        }

    # Configure UDR and IP Forwarding
        Write-Host "Configuring UDR" -ForegroundColor Cyan

      # Create the Route Tables
        Write-Host "Creating the Route Tables" -ForegroundColor Cyan 
        New-AzureRouteTable -Name $BERouteTableName `
            -Location $DeploymentLocation `
            -Label "Route table for $BESubnet subnet"
        New-AzureRouteTable -Name $FERouteTableName `
            -Location $DeploymentLocation `
            -Label "Route table for $FESubnet subnet"

      # Add Routes to Route Tables
        Write-Host "Adding Routes to the Route Tables" -ForegroundColor Cyan 
        Get-AzureRouteTable $BERouteTableName `
            |Set-AzureRoute -RouteName "All traffic to FW" -AddressPrefix 0.0.0.0/0 `
            -NextHopType VirtualAppliance `
            -NextHopIpAddress $VMIP[0]
        Get-AzureRouteTable $BERouteTableName `
            |Set-AzureRoute -RouteName "Internal traffic to FW" -AddressPrefix $VNetPrefix `
            -NextHopType VirtualAppliance `
            -NextHopIpAddress $VMIP[0]
        Get-AzureRouteTable $BERouteTableName `
            |Set-AzureRoute -RouteName "Allow Intra-Subnet Traffic" -AddressPrefix $BEPrefix `
            -NextHopType VNETLocal
        Get-AzureRouteTable $FERouteTableName `
            |Set-AzureRoute -RouteName "All traffic to FW" -AddressPrefix 0.0.0.0/0 `
            -NextHopType VirtualAppliance `
            -NextHopIpAddress $VMIP[0]
        Get-AzureRouteTable $FERouteTableName `
            |Set-AzureRoute -RouteName "Internal traffic to FW" -AddressPrefix $VNetPrefix `
            -NextHopType VirtualAppliance `
            -NextHopIpAddress $VMIP[0]
        Get-AzureRouteTable $FERouteTableName `
            |Set-AzureRoute -RouteName "Allow Intra-Subnet Traffic" -AddressPrefix $FEPrefix `
            -NextHopType VNETLocal

      # Associate the Route Tables with the Subnets
        Write-Host "Binding Route Tables to the Subnets" -ForegroundColor Cyan 
        Set-AzureSubnetRouteTable -VirtualNetworkName $VNetName `
            -SubnetName $BESubnet `
            -RouteTableName $BERouteTableName
        Set-AzureSubnetRouteTable -VirtualNetworkName $VNetName `
            -SubnetName $FESubnet `
            -RouteTableName $FERouteTableName

     # Enable IP Forwarding on the Virtual Appliance
        Get-AzureVM -Name $VMName[0] -ServiceName $ServiceName[0] `
            |Set-AzureIPForwarding -Enable

    # Configure NSG
        Write-Host "Configuring the Network Security Group (NSG)" -ForegroundColor Cyan

      # Build the NSG
        Write-Host "Building the NSG" -ForegroundColor Cyan
        New-AzureNetworkSecurityGroup -Name $NSGName -Location $DeploymentLocation -Label "Security group for $VNetName subnets in $DeploymentLocation"

      # Add NSG Rule
        Write-Host "Writing rules into the NSG" -ForegroundColor Cyan
        Get-AzureNetworkSecurityGroup -Name $NSGName | Set-AzureNetworkSecurityRule -Name "Isolate the $VNetName VNet from the Internet" -Type Inbound -Priority 100 -Action Deny `
            -SourceAddressPrefix INTERNET -SourcePortRange '*' `
            -DestinationAddressPrefix VIRTUAL_NETWORK -DestinationPortRange '*' `
            -Protocol *

      # Assign the NSG to two Subnets
        # The NSG is *not* bound to the Security Subnet. The result
        # is that internet traffic flows only to the Security subnet
        # since the NSG bound to the FrontEnd and BackEnd subnets
        # will Deny internet traffic to those subnets.
        Write-Host "Binding the NSG to two subnets" -ForegroundColor Cyan
        Set-AzureNetworkSecurityGroupToSubnet -Name $NSGName -SubnetName $FESubnet -VirtualNetworkName $VNetName
        Set-AzureNetworkSecurityGroupToSubnet -Name $NSGName -SubnetName $BESubnet -VirtualNetworkName $VNetName

    # Optional Post-script Manual Configuration
      # Configure Firewall
      # Install Test Web App (Run Post-Build Script on the IIS Server)
      # Install BackEnd resource (Run Post-Build Script on the AppVM01)
      Write-Host
      Write-Host "Build Complete!" -ForegroundColor Green
      Write-Host
      Write-Host "Optional Post-script Manual Configuration Steps" -ForegroundColor Gray
      Write-Host " - Configure Firewall" -ForegroundColor Gray
      Write-Host " - Install Test Web App (Run Post-Build Script on the IIS Server)" -ForegroundColor Gray
      Write-Host " - Install Backend resource (Run Post-Build Script on the AppVM01)" -ForegroundColor Gray
      Write-Host
```

### Network config file

Save this XML file with updated location. Change the `$NetworkConfigFile` variable in the full script above to link to the saved network config file.

```xml
    <NetworkConfiguration xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/ServiceHosting/2011/07/NetworkConfiguration">
      <VirtualNetworkConfiguration>
        <Dns>
          <DnsServers>
            <DnsServer name="DNS01" IPAddress="10.0.2.4" />
            <DnsServer name="Level3" IPAddress="209.244.0.3" />
          </DnsServers>
        </Dns>
        <VirtualNetworkSites>
          <VirtualNetworkSite name="CorpNetwork" Location="Central US">
            <AddressSpace>
              <AddressPrefix>10.0.0.0/16</AddressPrefix>
            </AddressSpace>
            <Subnets>
              <Subnet name="SecNet">
                <AddressPrefix>10.0.0.0/24</AddressPrefix>
              </Subnet>
              <Subnet name="FrontEnd">
                <AddressPrefix>10.0.1.0/24</AddressPrefix>
              </Subnet>
              <Subnet name="BackEnd">
                <AddressPrefix>10.0.2.0/24</AddressPrefix>
              </Subnet>
            </Subnets>
            <DnsServersRef>
              <DnsServerRef name="DNS01" />
              <DnsServerRef name="Level3" />
            </DnsServersRef>
          </VirtualNetworkSite>
        </VirtualNetworkSites>
      </VirtualNetworkConfiguration>
    </NetworkConfiguration>
```

## Next steps

You can install a sample application to help with this perimeter network example.

> [!div class="nextstepaction"]
> [Sample application script](./virtual-networks-sample-app.md)

<!--Image References-->
[1]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/example3design.png "Bi-directional DMZ with NVA, NSG, and UDR"
[2]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/example3firewalllogical.png "Logical View of the Firewall Rules"
[3]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/createnetworkobjectfrontend.png "Create a FrontEnd Network Object"
[4]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/createnetworkobjectdns.png "Create a DNS Server Object"
[5]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/createnetworkobjectrdpa.png "Copy of Default RDP Rule"
[6]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/createnetworkobjectrdpb.png "AppVM01 Rule"
[7]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/iconapplicationredirect.png "Application Redirect Icon"
[8]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/icondestinationnat.png "Destination NAT Icon"
[9]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/iconpass.png "Pass Icon"
[10]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/rulefirewall.png "Firewall Management Rule"
[11]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/rulerdp.png "Firewall RDP Rule"
[12]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/ruleweb.png "Firewall Web Rule"
[13]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/ruleappvm01.png "Firewall AppVM01 Rule"
[14]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/ruleoutbound.png "Firewall Outbound Rule"
[15]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/ruledns.png "Firewall DNS Rule"
[16]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/ruleintravnet.png "Firewall Intra-VNet Rule"
[17]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/ruledeny.png "Firewall Deny Rule"
[18]: ./media/virtual-networks-dmz-nsg-fw-udr-asm/firewallruleactivate.png "Firewall Rule Activation"

<!--Link References-->
[HOME]: ../best-practices-network-security.md
