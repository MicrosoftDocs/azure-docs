---
title: Azure DMZ Example – Build a Simple DMZ with NSGs | Microsoft Docs
description: Build a DMZ with Network Security Groups (NSG)
services: virtual-network
documentationcenter: na
author: tracsman
manager: rossort
editor: ''

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/03/2017
ms.author: jonor

---
# Example 1 – Build a simple DMZ using NSGs with an Azure Resource Manager template
[Return to the Security Boundary Best Practices Page][HOME]

> [!div class="op_single_selector"]
> * [Resource Manager Template](virtual-networks-dmz-nsg.md)
> * [Classic - PowerShell](virtual-networks-dmz-nsg-asm.md)
> 
>

This example creates a primitive DMZ with four Windows servers and Network Security Groups. This example describes each of the relevant template sections to provide a deeper understanding of each step. There is also a Traffic Scenario section to provide an in-depth step-by-step look at how traffic proceeds through the layers of defense in the DMZ. Finally, in the references section is the complete template code and instructions to build this environment to test and experiment with various scenarios. 

[!INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)] 

![Inbound DMZ with NSG][1]

## Environment description
In this example a subscription contains the following resources:

* A single resource group
* A Virtual Network with two subnets; “FrontEnd” and “BackEnd”
* A Network Security Group that is applied to both subnets
* A Windows Server that represents an application web server (“IIS01”)
* Two windows servers that represent application back-end servers (“AppVM01”, “AppVM02”)
* A Windows server that represents a DNS server (“DNS01”)
* A public IP address associated with the application web server

In the references section, there is a link to an Azure Resource Manager template that builds the environment described in this example. Building the VMs and Virtual Networks, although done by the example template, are not described in detail in this document. 

**To build this environment** (detailed instructions are in the references section of this document);

1. Deploy the Azure Resource Manager Template at: [Azure Quickstart Templates][Template]
2. Install the sample application at: [Sample Application Script][SampleApp]

>[!NOTE]
>To RDP to any back-end servers in this instance, the IIS server is used as a "jump box." First RDP to the IIS server and then from the IIS Server RDP to the back-end server. Alternately a Public IP can be associated with each server NIC for easier RDP.
> 
>

The following sections provide a detailed description of the Network Security Group and how it functions for this example by walking through key lines of the Azure Resource Manager Template.

## Network Security Groups (NSG)
For this example, an NSG group is built and then loaded with six rules. 

>[!TIP]
>Generally speaking, you should create your specific “Allow” rules first and then the more generic “Deny” rules last. The assigned priority dictates which rules are evaluated first. Once traffic is found to apply to a specific rule, no further rules are evaluated. NSG rules can apply in either in the inbound or outbound direction (from the perspective of the subnet).
>
>

Declaratively, the following rules are being built for inbound traffic:

1. Internal DNS traffic (port 53) is allowed
2. RDP traffic (port 3389) from the Internet to any VM is allowed
3. HTTP traffic (port 80) from the Internet to web server (IIS01) is allowed
4. Any traffic (all ports) from IIS01 to AppVM1 is allowed
5. Any traffic (all ports) from the Internet to the entire VNet (both subnets) is Denied
6. Any traffic (all ports) from the Frontend subnet to the Backend subnet is Denied

With these rules bound to each subnet, if an HTTP request was inbound from the Internet to the web server, both rules 3 (allow) and 5 (deny) would apply, but since rule 3 has a higher priority only it would apply and rule 5 would not come into play. Thus the HTTP request would be allowed to the web server. If that same traffic was trying to reach the DNS01 server, rule 5 (Deny) would be the first to apply and the traffic would not be allowed to pass to the server. Rule 6 (Deny) blocks the Frontend subnet from talking to the Backend subnet (except for allowed traffic in rules 1 and 4), this rule-set protects the Backend network in case an attacker compromises the web application on the Frontend, the attacker would have limited access to the Backend “protected” network (only to resources exposed on the AppVM01 server).

There is a default outbound rule that allows traffic out to the internet. For this example, we’re allowing outbound traffic and not modifying any outbound rules. To apply security policy to traffic in both directions, User Defined Routing is required and is explored in “Example 3” on the [Security Boundary Best Practices Page][HOME].

Each rule is discussed in more detail as follows:

1. A Network Security Group resource must be instantiated to hold the rules:

    ```JSON
	"resources": [
	  {
	    "apiVersion": "2015-05-01-preview",
	    "type": "Microsoft.Network/networkSecurityGroups",
	    "name": "[variables('NSGName')]",
	    "location": "[resourceGroup().location]",
	    "properties": { }
	  }
	]
    ``` 

2. The first rule in this example allows DNS traffic between all internal networks to the DNS server on the backend subnet. The rule has some important parameters:
  * "destinationAddressPrefix" - Rules can use a special type of address prefix called a "Default Tag", these tags are system-provided identifiers that allow an easy way to address a larger category of address prefixes. This rule uses the Default Tag “Internet” to signify any address outside of the VNet. Other prefix labels are VirtualNetwork and AzureLoadBalancer.
  * “Direction” signifies in which direction of traffic flow this rule takes effect. The direction is from the perspective of the subnet or Virtual Machine (depending on where this NSG is bound). Thus if Direction is “Inbound” and traffic is entering the subnet, the rule would apply and traffic leaving the subnet would not be affected by this rule.
  * “Priority” sets the order in which a traffic flow is evaluated. The lower the number the higher the priority. When a rule applies to a specific traffic flow, no further rules are processed. Thus if a rule with priority 1 allows traffic, and a rule with priority 2 denies traffic, and both rules apply to traffic then the traffic would be allowed to flow (since rule 1 had a higher priority it took effect and no further rules were applied).
  * “Access” signifies if traffic affected by this rule is blocked ("Deny") or allowed ("Allow").

    ```JSON
	"properties": {
	"securityRules": [
	  {
	    "name": "enable_dns_rule",
	    "properties": {
	      "description": "Enable Internal DNS",
	      "protocol": "*",
	      "sourcePortRange": "*",
	      "destinationPortRange": "53",
	      "sourceAddressPrefix": "VirtualNetwork",
	      "destinationAddressPrefix": "10.0.2.4",
	      "access": "Allow",
	      "priority": 100,
	      "direction": "Inbound"
	    }
	  },
    ```

3. This rule allows RDP traffic to flow from the internet to the RDP port on any server on the bound subnet. 

    ```JSON
    {
      "name": "enable_rdp_rule",
      "properties": {
        "description": "Allow RDP",
        "protocol": "Tcp",
        "sourcePortRange": "*",
        "destinationPortRange": "3389",
        "sourceAddressPrefix": "*",
        "destinationAddressPrefix": "*",
        "access": "Allow",
        "priority": 110,
        "direction": "Inbound"
      }
    },
    ```

4. This rule allows inbound internet traffic to hit the web server. This rule does not change the routing behavior. The rule only allows traffic destined for IIS01 to pass. Thus if traffic from the Internet had the web server as its destination this rule would allow it and stop processing further rules. (In the rule at priority 140 all other inbound internet traffic is blocked). If you're only processing HTTP traffic, this rule could be further restricted to only allow Destination Port 80.

    ```JSON
	{
	  "name": "enable_web_rule",
	  "properties": {
	    "description": "Enable Internet to [variables('VM01Name')]",
	    "protocol": "Tcp",
	    "sourcePortRange": "*",
	    "destinationPortRange": "80",
	    "sourceAddressPrefix": "Internet",
	    "destinationAddressPrefix": "10.0.1.5",
	    "access": "Allow",
	    "priority": 120,
	    "direction": "Inbound"
	    }
	  },
    ```

5. This rule allows traffic to pass from the IIS01 server to the AppVM01 server, a later rule blocks all other Frontend to Backend traffic. To improve this rule, if the port is known that should be added. For example, if the IIS server is hitting only SQL Server on AppVM01, the Destination Port Range should be changed from “*” (Any) to 1433 (the SQL port) thus allowing a smaller inbound attack surface on AppVM01 should the web application ever be compromised.

    ```JSON
	{
	  "name": "enable_app_rule",
	  "properties": {
	    "description": "Enable [variables('VM01Name')] to [variables('VM02Name')]",
	    "protocol": "*",
	    "sourcePortRange": "*",
	    "destinationPortRange": "*",
	    "sourceAddressPrefix": "10.0.1.5",
	    "destinationAddressPrefix": "10.0.2.5",
	    "access": "Allow",
	    "priority": 130,
	    "direction": "Inbound"
	  }
	},
     ```

6. This rule denies traffic from the internet to any servers on the network. With the rules at priority 110 and 120, the effect is to allow only inbound internet traffic to the firewall and RDP ports on servers and blocks everything else. This rule is a "fail-safe" rule to block all unexpected flows.

    ```JSON
	{
	  "name": "deny_internet_rule",
	  "properties": {
	    "description": "Isolate the [variables('VNetName')] VNet from the Internet",
	    "protocol": "*",
	    "sourcePortRange": "*",
	    "destinationPortRange": "*",
	    "sourceAddressPrefix": "Internet",
	    "destinationAddressPrefix": "VirtualNetwork",
	    "access": "Deny",
	    "priority": 140,
	    "direction": "Inbound"
	  }
	},
     ```

7. The final rule denies traffic from the Frontend subnet to the Backend subnet. Since this rule is an Inbound only rule, reverse traffic is allowed (from the Backend to the Frontend).

    ```JSON
	{
	  "name": "deny_frontend_rule",
	  "properties": {
	    "description": "Isolate the [variables('Subnet1Name')] subnet from the [variables('Subnet2Name')] subnet",
	    "protocol": "*",
	    "sourcePortRange": "*",
	    "destinationPortRange": "*",
	    "sourceAddressPrefix": "[variables('Subnet1Prefix')]",
	    "destinationAddressPrefix": "[variables('Subnet2Prefix')]",
	    "access": "Deny",
	    "priority": 150,
	    "direction": "Inbound"
	  }
	}
    ```

## Traffic scenarios
#### (*Allowed*) Internet to web server
1. An internet user requests an HTTP page from the public IP address of the NIC associated with the IIS01 NIC
2. The Public IP address passes traffic to the VNet towards IIS01 (the web server)
3. Frontend subnet begins inbound rule processing:
  1. NSG Rule 1 (DNS) doesn’t apply, move to next rule
  2. NSG Rule 2 (RDP) doesn’t apply, move to next rule
  3. NSG Rule 3 (Internet to IIS01) does apply, traffic is allowed, stop rule processing
4. Traffic hits internal IP address of the web server IIS01 (10.0.1.5)
5. IIS01 is listening for web traffic, receives this request and starts processing the request
6. IIS01 asks the SQL Server on AppVM01 for information
7. No outbound rules on Frontend subnet, traffic is allowed
8. The Backend subnet begins inbound rule processing:
  1. NSG Rule 1 (DNS) doesn’t apply, move to next rule
  2. NSG Rule 2 (RDP) doesn’t apply, move to next rule
  3. NSG Rule 3 (Internet to Firewall) doesn’t apply, move to next rule
  4. NSG Rule 4 (IIS01 to AppVM01) does apply, traffic is allowed, stop rule processing
9. AppVM01 receives the SQL Query and responds
10. Since there are no outbound rules on the Backend subnet, the response is allowed
11. Frontend subnet begins inbound rule processing:
  1. There is no NSG rule that applies to Inbound traffic from the Backend subnet to the Frontend subnet, so none of the NSG rules apply
  2. The default system rule allowing traffic between subnets would allow this traffic so the traffic is allowed.
12. The IIS server receives the SQL response and completes the HTTP response and sends to the requester
13. Since there are no outbound rules on the Frontend subnet, the response is allowed and the Internet User receives the web page requested.

#### (*Allowed*) RDP to IIS server
1. A Server Admin on internet requests an RDP session to IIS01 on the public IP address of the NIC associated with the IIS01 NIC (this public IP address can be found via the Portal or PowerShell)
2. The Public IP address passes traffic to the VNet towards IIS01 (the web server)
3. Frontend subnet begins inbound rule processing:
  1. NSG Rule 1 (DNS) doesn’t apply, move to next rule
  2. NSG Rule 2 (RDP) does apply, traffic is allowed, stop rule processing
4. With no outbound rules, default rules apply and return traffic is allowed
5. RDP session is enabled
6. IIS01 prompts for the user name and password

>[!NOTE]
>To RDP to any back-end servers in this instance, the IIS server is used as a "jump box." First RDP to the IIS server and then from the IIS Server RDP to the back-end server.
>
>

#### (*Allowed*) Web server DNS look-up on DNS server
1. Web Server, IIS01, needs a data feed at www.data.gov, but needs to resolve the address.
2. The network configuration for the VNet lists DNS01 (10.0.2.4 on the Backend subnet) as the primary DNS server, IIS01 sends the DNS request to DNS01
3. No outbound rules on Frontend subnet, traffic is allowed
4. Backend subnet begins inbound rule processing:
  * NSG Rule 1 (DNS) does apply, traffic is allowed, stop rule processing
5. DNS server receives the request
6. DNS server doesn’t have the address cached and asks a root DNS server on the internet
7. No outbound rules on Backend subnet, traffic is allowed
8. Internet DNS server responds, since this session was initiated internally, the response is allowed
9. DNS server caches the response, and responds to the initial request back to IIS01
10. No outbound rules on Backend subnet, traffic is allowed
11. Frontend subnet begins inbound rule processing:
  1. There is no NSG rule that applies to Inbound traffic from the Backend subnet to the Frontend subnet, so none of the NSG rules apply
  2. The default system rule allowing traffic between subnets would allow this traffic so the traffic is allowed
12. IIS01 receives the response from DNS01

#### (*Allowed*) Web server access file on AppVM01
1. IIS01 asks for a file on AppVM01
2. No outbound rules on Frontend subnet, traffic is allowed
3. The Backend subnet begins inbound rule processing:
  1. NSG Rule 1 (DNS) doesn’t apply, move to next rule
  2. NSG Rule 2 (RDP) doesn’t apply, move to next rule
  3. NSG Rule 3 (Internet to IIS01) doesn’t apply, move to next rule
  4. NSG Rule 4 (IIS01 to AppVM01) does apply, traffic is allowed, stop rule processing
4. AppVM01 receives the request and responds with file (assuming access is authorized)
5. Since there are no outbound rules on the Backend subnet, the response is allowed
6. Frontend subnet begins inbound rule processing:
  1. There is no NSG rule that applies to Inbound traffic from the Backend subnet to the Frontend subnet, so none of the NSG rules apply
  2. The default system rule allowing traffic between subnets would allow this traffic so the traffic is allowed.
7. The IIS server receives the file

#### (*Denied*) RDP to backend
1. An internet user tries to RDP to server AppVM01
2. Since there are no Public IP addresses associated with this servers NIC, this traffic would never enter the VNet and wouldn’t reach the server
3. However if a Public IP address was enabled for some reason, NSG rule 2 (RDP) would allow this traffic

>[!NOTE]
>To RDP to any back-end servers in this instance, the IIS server is used as a "jump box." First RDP to the IIS server and then from the IIS Server RDP to the back-end server.
>
>

#### (*Denied*) Web to backend server
1. An internet user tries to access a file on AppVM01
2. Since there are no Public IP addresses associated with this servers NIC, this traffic would never enter the VNet and wouldn’t reach the server
3. If a Public IP address was enabled for some reason, NSG rule 5 (Internet to VNet) would block this traffic

#### (*Denied*) Web DNS look-up on DNS server
1. An internet user tries to look up an internal DNS record on DNS01
2. Since there are no Public IP addresses associated with this servers NIC, this traffic would never enter the VNet and wouldn’t reach the server
3. If a Public IP address was enabled for some reason, NSG rule 5 (Internet to VNet) would block this traffic (Note: that Rule 1 (DNS) would not apply because the requests source address is the internet and Rule 1 only applies to the local VNet as the source)

#### (*Denied*) SQL access on the web server
1. An internet user requests SQL data from IIS01
2. Since there are no Public IP addresses associated with this servers NIC, this traffic would never enter the VNet and wouldn’t reach the server
3. If a Public IP address was enabled for some reason, the Frontend subnet begins inbound rule processing:
  1. NSG Rule 1 (DNS) doesn’t apply, move to next rule
  2. NSG Rule 2 (RDP) doesn’t apply, move to next rule
  3. NSG Rule 3 (Internet to IIS01) does apply, traffic is allowed, stop rule processing
4. Traffic hits internal IP address of the IIS01 (10.0.1.5)
5. IIS01 isn't listening on port 1433, so no response to the request

## Conclusion
This example is a relatively simple and straight forward way of isolating the back-end subnet from inbound traffic.

More examples and an overview of network security boundaries can be found [here][HOME].

## References
### Azure Resource Manager template
This example uses a predefined Azure Resource Manager template in a GitHub repository maintained by Microsoft and open to the community. This template can be deployed straight out of GitHub, or downloaded and modified to fit your needs. 

The main template is in the file named "azuredeploy.json." This template can be submitted via PowerShell or CLI (with the associated "azuredeploy.parameters.json" file) to deploy this template. I find the easiest way is to use the "Deploy to Azure" button on the README.md page at GitHub.

To deploy the template that builds this example from GitHub and the Azure portal, follow these steps:

1. From a browser, navigate to the [Template][Template]
2. Click the "Deploy to Azure" button (or the "Visualize" button to see a graphical representation of this template)
3. Enter the Storage Account, User Name, and Password in the Parameters blade, then click **OK**
5. Create a Resource Group for this deployment (You can use an existing one, but I recommend a new one for best results)
6. If necessary, change the Subscription and Location settings for your VNet.
7. Click **Review legal terms**, read the terms, and click **Purchase** to agree.
8. Click **Create** to begin the deployment of this template.
9. Once the deployment finishes successfully, navigate to the Resource Group created for this deployment to see the resources configured inside.

>[!NOTE]
>This template enables RDP to the IIS01 server only (find the Public IP for IIS01 on the Portal). To RDP to any back-end servers in this instance, the IIS server is used as a "jump box." First RDP to the IIS server and then from the IIS Server RDP to the back-end server.
>
>

To remove this deployment, delete the Resource Group and all child resources will also be deleted.

#### Sample application scripts
Once the template runs successfully, you can set up the web server and app server with a simple web application to allow testing with this DMZ configuration. To install a sample application for this, and other DMZ Examples, one has been provided at the following link: [Sample Application Script][SampleApp]

## Next steps

* Deploy this example
* Build the sample application
* Test different traffic flows through this DMZ

<!--Image References-->
[1]: ./media/virtual-networks-dmz-nsg-arm/example1design.png "Inbound DMZ with NSG"

<!--Link References-->
[HOME]: ../best-practices-network-security.md
[Template]: https://github.com/Azure/azure-quickstart-templates/tree/master/301-dmz-nsg
[SampleApp]: ./virtual-networks-sample-app.md