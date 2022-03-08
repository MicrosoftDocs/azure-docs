---
title: Configure private link sensor connections to Microsoft Defender for IoT
description: Learn how to connect your sensors to Microsoft Defender for IoT using a private link connection.
ms.topic: how-to
ms.date: 03/07/2022
---

# Configure private link sensor connections

This article describes how to configure private link connections between your sensors and Microsoft Defender for IoT.

## Choose a private link connection method

•	Flexible connectivity - The sensors monitoring remote sites can connect to the service by any of these methods:
o	Connect your sensor with ExpressRoute and Microsoft Peering.(***remove***)
o	Connect your sensor through a proxy residing in Azure.
o	Through proxy chaining from secure segments within composite enterprise networks.
o	Directly via the internet (encrypted secure session) 
o	Integration with other cloud vendors (Multi-cloud)


## Connect via ExpressRoute with Microsoft Peering

Prerequisites
As a first step towards connecting your sensor to Azure, you should configure your network in the following manner:

•	Deploy ExpressRoute connectivity at the remote site (see Azure ExpressRoute: Connectivity models | Microsoft Docs for more information).
•	Set up an Express Route Microsoft Peering Circuit
•	Prior to proceeding, ensure that the circuit has been fully provisioned by the connectivity provider by checking the Provider Status.
 

Configuration
Configure the circuit to reach the following services:
o	IoT Hub
o	Blob Storage
o	Event Hub
Create a route filter to the relevant region for all remote sites:

Tenant Country	Azure Region
Europe	West Europe
Rest of World	East US



  




## Connect via an Azure proxy

Prerequisites
•	Azure Subscription and account with Contributor permissions to the subscription
•	Log Analytic workspace for monitoring logs
•	Remote sites connectivity to the Azure VNET
•	Proxy server resource with firewall permissions to access Microsoft cloud services
o	Outbound HTTPS traffic on port 443 to the following hostnames:   
	IoT Hub: *.azure-devices.net   
	Threat Intelligence: *.blob.core.windows.net 
	Eventhub: *.servicebus.windows.net 

Microsoft Defender for IoT does not offer support for Squid or any other proxy service. It is the customer's responsibility to set up and maintain the proxy service.


Configuration

Set up a sensor to work with a proxy
To use a proxy, enable the use of a proxy in the sensor settings. This can be found in system settings -> Sensor Network Settings 

 

Guidelines - Set up a proxy in your Azure VNET
The instructions below refer to a default proxy configuration (based on squid), if a proxy is not set up in your Azure VNET. Please also be sure to secure your resources in accordance with your organization's security policy.

Storage Account for NSG logs
In Azure Portal, create a new storage account with the following settings:
Basics:
•	Performance: Standard
•	Account kind: Blob storage
•	Replication: LRS
Network
•	Connectivity method: Public endpoint (selected network).
•	In Virtual Networks: None
•	Routing Preference: Microsoft network routing
Data Protection
•	Keep all boxes unchecked

Advanced
•	Keep the default values
Virtual Networks and Subnets
Create the following VNET and contained Subnets.
MD4IoT-VNET	Recommended size /26 or /25 with Bastion
Subnet

GatewaySubnet
Recommended size /27
ProxyserverSubnet	Recommended size /27
AzureBastionSubnet (optional)
Recommended size /26


Virtual and Local Network Gateway
1.	Virtual Gateway
•	Create a VPN or ExpressRoute Gateway, according to the way you connect your on-premises network to Azure. Attach the gateway to the previously created GatewaySubnet.

2.	Local Gateway
•	Create a local gateway and a connection according to the way you connect your on-premises network to Azure.
For more information, read about Azure VPN Gateway, connecting a VNET to an ExpressRoute circuit and Local Gateways.

Network Security Groups
1.	Create a NSG and define the following inbound rules:
•	Create rule “100” allowing traffic from your sensors (sources) to the load Balancer private IP (destination) on port tcp3128.
•	Optional – If using Bastion, create rule “4094” to allow Bastion to ssh to the servers. Use the Bastion subnet range as source.
•	Create rule “4095” as a duplicate of the system rule 65001 because overwritten by 4096)
•	Create rule “4096” to deny all traffic (micro-segmentation)
 

2.	Assign the NSG to the ‘ProxyserverSubnet’ Subnet.
3.	Logging- 
•	Select the NSG you have created
•	Select “Diagnostic setting” and click on “Add Diagnostic setting”
•	Set a name
•	Under category, Select “allLogs”
•	Select “Sent to Log Analytic workspace” and select the new or existing Log Analytic workspace.
 


•	Select “NSG flow logs” in the menu
•	In Basics tab,
-	Set a name
-	Select the storage account previously created.
-	Set retention days to 7 (or other as per your requirements).
•	In configuration tab,
-	Select version 2
-	Select “Enable Traffic Analytics”
Select the existing or created workspace
Virtual Machine Scale Set
Azure virtual machine scale sets let you create and manage a group of load-balanced VMs. The number of VM instances can automatically increase or decrease in response to demand. Read more about VM Scale Sets here.

1.	Create a Scale Set with the following parameters:
Orchestration Mode: Uniform
Security Type: standard
Image: Ubuntu server 18.04 LTS – Gen1
Size: Standard_DS1_V2
Authentication: Based on your corporate standard

2.	Keep the default values for Disks.
3.	Networking:
o	Create a network interface in the Proxyserver Subnet
o	Do not select a load balancer yet.
4.	Scaling- Define the initial instance count to 1 and the scaling policy to manual.
5.	Management-
o	Upgrade mode, select: Automatic – instance will start upgrading …:
o	Disable boot diagnostic
o	Uncheck Identity and Azure AD
o	Select overprovisioning
o	Select “Enable automatic OS upgrades” 
o	Enable automatic updates and disable boot diagnostics. 
6.	Health 
o	Select “Enabled application health monitoring
o	Set TCP protocol and port 3128
7.	Define the following advanced settings:
o	Spreading algorithm – Max Spreading

8.	For the custom-data script do the following:
•	Create the following configuration script, according to the port and services you are using:


•	Encode the contents of the file in base 64.
•	Copy the contents of the encoded file and create the following configuration script.







 
Azure Load Balancer
Azure load balancer is a layer 4 load balancer that distributes incoming traffic among healthy virtual machine instances. Load balancers uses a hash-based distribution algorithm. Read more about Azure Load Balancer’s here.

1.	Create a load balancer with a standard SKU and an Internal type, to ensure the load balancer is closed to the internet.
 
2.	Define a dynamic frontend IP in the proxysrv subnet, setting the availability to zone-redundant.
 
3.	For a backend, chose the VM scale set previously created.
 
4.	Create a load balancing rule connecting the frontend IP with the backend pool, on the port defined in the sensor (default is 3128). Define the rule as TCP. 
 
5.	Health probe- click create new. 
o	Define a TCP health probe, on port 3128.
 

6.	Logging
•	In Azure Portal,select the Load Balancer you have created
•	Select “Diagnostic setting” and click on “Add Diagnostic setting”
•	Set a name
•	Under category, Select “allMetrics”
•	Select “Sent to Log Analytic workspace” and select the new or existing Log Analytic workspace.
NAT Gateway
1.	Create a new NAT Gateway
 
2.	In the Outbound IP Tab, click on “Create a new public IP address”
 

3.	In the Subnet Tab, chose the ProxyserverSubnet 
 


## Connect via proxy chaining

Microsoft Defender for IoT does not offer support for Squid or any other proxy service. It is the customer's responsibility to set up and maintain the proxy service.

Prerequisites
•	A host server running a proxy process within the site network, accessible to both the sensor, and the next proxy in the chain.
•	We have evaluated this setup using the open-source Squid proxy, the proxy has HTTP tunneling, and uses the HTTP CONNECT command for connectivity. 
•	Any other proxy that supports CONNECT can be used. 
Configuration
In this recipe we will reference installation and configuration of the latest version of Squid on an Ubuntu server.


 

Sensor setup
To use a proxy, enable the use of a proxy in the sensor settings. This can be found in system settings -> Sensor Network Settings 

 

Installing the Squid proxy

    - Sign into your designated proxy Ubuntu machine.

    - Launch a terminal window.
 
    - Run the following commands to update your system and install the Squid package..



    - Locate the squid configuration file that is located at `/etc/squid/squid.conf`, and `/etc/squid/conf.d/`.



    - Open `/etc/squid/squid.conf` in a text editor.

    - Search for `# INSERT YOUR OWN RULE(S) HERE TO ALLOW ACCESS FROM YOUR CLIENTS`.

    - Add `acl <sensor-name> src <sensor-ip>`, and `http_access allow <sensor-name>` into the file.
 
    - (Optional) Add more sensors by adding an extra line for each sensor.

    - Enable the Squid service to start at launch with the following command.


Connecting the proxy to Defender for IoT resources

To enable the sensor's connection to the Azure Portal, Enable outbound HTTPS traffic on port 443 from the sensor to the following Azure hostnames: 

IoT Hub: *.azure-devices.net  
Threat Intelligence: *.blob.core.windows.net
Eventhub: *.servicebus.windows.net


In case you need to define firewall rules by IP address, the Azure public IP ranges are updated weekly. You can download and add the Azure public IP ranges to your firewall. Please download the new json file every week and perform the necessary changes at your site to correctly identify services running in Azure. You will also need the IP ranges for AzureIoTHub, Storage and EventHub.


## Connect directly

Prerequisites
The following network configuration is required for sensors to connect to the Azure portal:
•	The sensor can reach the cloud using HTTPS on port 443 to the following Microsoft domains:
o	IoT Hub: *.azure-devices.net 
o	Threat Intelligence: *.blob.core.windows.net
o	Eventhub: *.servicebus.windows.net
•	Since Azure public IP addresses are updated weekly, if you want to define firewall rules based on IP addresses, download and add Azure public IP ranges to your firewall. Obtain the new JSON file every week and perform the necessary changes at your site firewall to correctly adapt for your services running in Azure resources. 
•	You will also need the IP ranges for AzureIoTHub, Storage and EventHub.

Configuration

  


## Connect via multi-cloud vendors

Prerequisites
Sensor deployed in a public cloud, connected to monitoring SPAN traffic, for example:
•	New – VPC Traffic Mirroring – Capture & Inspect Network Traffic | AWS News Blog (amazon.com) 
•	Packet Mirroring overview  |  VPC  |  Google Cloud

Configuration
Configure your sensor to be cloud connected to Defender for IoT using the following resources: Connectivity to other cloud providers - Cloud Adoption Framework | Microsoft Docs.


Directly over the Internet to D4IoT

You can configure your cloud-based sensor to connect to D4IoT endpoints as you would configure an on-prem sensor. For the necessary security configurations please see this section.

By creating a VPN connection between your VPC and an Azure VNET
To enable private connectivity between your VPCs and D4IoT, you should first connect your VPC to an Azure VNET over VPN connection.

•	Instructions for connecting an AWS VPC to Azure can be found here.

•	Once your VPC and VNET are configured, connect to D4IoT as described here


## Migrate to private link connections


| #	Step	Verification                                                                                                                                                                                                         |
| 1	Plan                                                                                                                                                                                                                      |
| •	Using one or more of the available connectivity recipes, review and prepare your network.                                                                                                                                 |
| 	Confirm that sensors in production networks can reach the Azure data center resource ranges                                                                                                                               |
| 	If necessary, set up additional resources as described in the recipe such as proxy, VPN or expressroute.                                                                                                                  |
| 2	Prepare                                                                                                                                                                                                                   |
| •	On the sites & sensors dashboard, perform the "ready for update" action for sensors that are ready to be updated.                                                                                                         |
| •	Download the version 22.1 update                                                                                                                                                                                          |
| •	Save the new activation files to be used once the sensor has completed the software update                                                                                                                                |
| 	Sensors indicate "Ready for upgrade."                                                                                                                                                                                     |
| 	The activation files were successfully downloaded                                                                                                                                                                         |
| 	The update file for 22.1 has been successfully downloaded                                                                                                                                                                 |
| 3	Update Sensors                                                                                                                                                                                                            |
| •	Apply the software update to the sensor, then activate it with the new activation file (link to instructions)                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 	Login successfully to the sensor after update                                                                                                                                                                             |
| 	Activation file applied successfully                                                                                                                                                                                      |
| 	Sensor shows “connected” in sites & sensors                                                                                                                                                                               |
| 4	Clean up                                                                                                                                                                                                                  |
| •	Review the IoT hub to ensure that it is not used by other services                                                                                                                                                        |
| •	After completing the transition and sensors connect successfully, you can delete any private IoT hubs that you previously used (make sure they are not in use for another service!).		All sensors indicate version 22.1. |
| 	There are no other services offered by the IoT hub                                                                                                                                                                        |
| 	Examine the active resources in your account                                                                                                                                                                              |

## Next steps

For more information, see [Private link connection architectures](architecture-private.md).