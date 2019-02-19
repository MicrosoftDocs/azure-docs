---
title: Layered Security Architecture with App Service Environments - Azure
description: Implementing a layered security architecture with App Service Environments.
services: app-service
documentationcenter: ''
author: stefsch
manager: erikre
editor: ''

ms.assetid: 73ce0213-bd3e-4876-b1ed-5ecad4ad5601
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/30/2016
ms.author: stefsch
ms.custom: seodec18

---
# Implementing a Layered Security Architecture with App Service Environments
## Overview
Since App Service Environments provide an isolated runtime environment deployed into a virtual network, developers can create a layered security architecture providing differing levels of network access for each physical application tier.

A common desire is to hide API back-ends from general Internet access, and only allow APIs to be called by upstream web apps.  [Network security groups (NSGs)][NetworkSecurityGroups] can be used on subnets containing App Service Environments to restrict public access to API applications.

The diagram below shows an example architecture with a WebAPI based app deployed on an App Service Environment.  Three separate web app instances, deployed on three separate App Service Environments, make back-end calls to the same WebAPI app.

![Conceptual Architecture][ConceptualArchitecture] 

The green plus signs indicate that the network security group on the subnet containing "apiase" allows inbound calls from the upstream web apps, as well calls from itself.  However the same network security group explicitly denies access to general inbound traffic from the Internet. 

The remainder of this article walks through the steps needed to configure the network security group on the subnet containing "apiase."

## Determining the Network Behavior
In order to know what network security rules are needed, you need to determine which network clients will be allowed to reach the App Service Environment containing the API app, and which clients will be blocked.

Since [network security groups (NSGs)][NetworkSecurityGroups] are applied to subnets, and App Service Environments are deployed into subnets, the rules contained in an NSG apply to **all** apps running on an App Service Environment.  Using the sample architecture for this article, once a network security group is applied to the subnet containing "apiase", all apps running on the "apiase" App Service Environment will be protected by the same set of security rules. 

* **Determine the outbound IP address of upstream callers:**  What is the IP address or addresses of the upstream callers?  These addresses will need to be explicitly allowed access in the NSG.  Since calls between App Service Environments are considered "Internet" calls, the outbound IP address assigned to each of the three upstream App Service Environments needs to be allowed access in the NSG for the "apiase" subnet.   For more information on determining the outbound IP address for apps running in an App Service Environment, see the [Network Architecture][NetworkArchitecture] Overview article.
* **Will the back-end API app need to call itself?**  A sometimes overlooked and subtle point is the scenario where the back-end application needs to call itself.  If a back-end API application on an App Service Environment needs to call itself, it is also treated as an "Internet" call.  In the sample architecture, this requires allowing access from the outbound IP address of the "apiase" App Service Environment as well.

## Setting up the Network Security Group
Once the set of outbound IP addresses are known, the next step is to construct a network security group.  Network security groups can be created for both Resource Manager based virtual networks, as well as classic virtual networks.  The examples below show creating and configuring an NSG on a classic virtual network using Powershell.

For the sample architecture, the environments are located in South Central US, so an empty NSG is created in that region:

    New-AzureNetworkSecurityGroup -Name "RestrictBackendApi" -Location "South Central US" -Label "Only allow web frontend and loopback traffic"

First an explicit allow rule is added for the Azure management infrastructure as noted in the article on [inbound traffic][InboundTraffic] for App Service Environments.

    #Open ports for access by Azure management infrastructure
    Get-AzureNetworkSecurityGroup -Name "RestrictBackendApi" | Set-AzureNetworkSecurityRule -Name "ALLOW AzureMngmt" -Type Inbound -Priority 100 -Action Allow -SourceAddressPrefix 'INTERNET' -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '454-455' -Protocol TCP

Next, two rules are added to allow HTTP and HTTPS calls from the first upstream App Service Environment ("fe1ase").

    #Grant access to requests from the first upstream web front-end
    Get-AzureNetworkSecurityGroup -Name "RestrictBackendApi" | Set-AzureNetworkSecurityRule -Name "ALLOW HTTP fe1ase" -Type Inbound -Priority 200 -Action Allow -SourceAddressPrefix '65.52.xx.xyz'  -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '80' -Protocol TCP
    Get-AzureNetworkSecurityGroup -Name "RestrictBackendApi" | Set-AzureNetworkSecurityRule -Name "ALLOW HTTPS fe1ase" -Type Inbound -Priority 300 -Action Allow -SourceAddressPrefix '65.52.xx.xyz'  -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '443' -Protocol TCP

Rinse and repeat for the second and third upstream App Service Environments ("fe2ase"and "fe3ase").

    #Grant access to requests from the second upstream web front-end
    Get-AzureNetworkSecurityGroup -Name "RestrictBackendApi" | Set-AzureNetworkSecurityRule -Name "ALLOW HTTP fe2ase" -Type Inbound -Priority 400 -Action Allow -SourceAddressPrefix '191.238.xyz.abc'  -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '80' -Protocol TCP
    Get-AzureNetworkSecurityGroup -Name "RestrictBackendApi" | Set-AzureNetworkSecurityRule -Name "ALLOW HTTPS fe2ase" -Type Inbound -Priority 500 -Action Allow -SourceAddressPrefix '191.238.xyz.abc'  -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '443' -Protocol TCP

    #Grant access to requests from the third upstream web front-end
    Get-AzureNetworkSecurityGroup -Name "RestrictBackendApi" | Set-AzureNetworkSecurityRule -Name "ALLOW HTTP fe3ase" -Type Inbound -Priority 600 -Action Allow -SourceAddressPrefix '23.98.abc.xyz'  -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '80' -Protocol TCP
    Get-AzureNetworkSecurityGroup -Name "RestrictBackendApi" | Set-AzureNetworkSecurityRule -Name "ALLOW HTTPS fe3ase" -Type Inbound -Priority 700 -Action Allow -SourceAddressPrefix '23.98.abc.xyz'  -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '443' -Protocol TCP

Lastly, grant access to the outbound IP address of the back-end API's App Service Environment so that it can call back into itself.

    #Allow apps on the apiase environment to call back into itself
    Get-AzureNetworkSecurityGroup -Name "RestrictBackendApi" | Set-AzureNetworkSecurityRule -Name "ALLOW HTTP apiase" -Type Inbound -Priority 800 -Action Allow -SourceAddressPrefix '70.37.xyz.abc'  -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '80' -Protocol TCP
    Get-AzureNetworkSecurityGroup -Name "RestrictBackendApi" | Set-AzureNetworkSecurityRule -Name "ALLOW HTTPS apiase" -Type Inbound -Priority 900 -Action Allow -SourceAddressPrefix '70.37.xyz.abc'  -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '443' -Protocol TCP

No other network security rules are required, because every NSG has a set of default rules that block inbound access from the Internet, by default.

The full list of rules in the network security group are shown below.  Note how the last rule, which is highlighted, blocks inbound access from all callers, other than callers that have been explicitly granted access.

![NSG Configuration][NSGConfiguration] 

The final step is to apply the NSG to the subnet that contains the "apiase" App Service Environment.

     #Apply the NSG to the backend API subnet
    Get-AzureNetworkSecurityGroup -Name "RestrictBackendApi" | Set-AzureNetworkSecurityGroupToSubnet -VirtualNetworkName 'yourvnetnamehere' -SubnetName 'API-ASE-Subnet'

With the NSG applied to the subnet, only the three upstream App Service Environments, and the App Service Environment containing the API back-end, are allowed to call into the "apiase" environment.

## Additional Links and Information
Information about [network security groups](../../virtual-network/security-overview.md).

Understanding [outbound IP addresses][NetworkArchitecture] and App Service Environments.

[Network ports][InboundTraffic] used by App Service Environments.

[!INCLUDE [app-service-web-try-app-service](../../../includes/app-service-web-try-app-service.md)]

<!-- LINKS -->
[NetworkSecurityGroups]: https://azure.microsoft.com/documentation/articles/virtual-networks-nsg/
[NetworkArchitecture]:  app-service-app-service-environment-network-architecture-overview.md
[InboundTraffic]:  app-service-app-service-environment-control-inbound-traffic.md

<!-- IMAGES -->
[ConceptualArchitecture]: ./media/app-service-app-service-environment-layered-security/ConceptualArchitecture-1.png
[NSGConfiguration]:  ./media/app-service-app-service-environment-layered-security/NSGConfiguration-1.png
