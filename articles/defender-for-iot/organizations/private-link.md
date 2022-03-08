---
title: Configure private link sensor connections to Microsoft Defender for IoT
description: Learn how to connect your sensors to Microsoft Defender for IoT using a private link connection.
ms.topic: how-to
ms.date: 03/08/2022
---

# Configure private link sensor connections

This article describes how to configure private link connections between your sensors and Microsoft Defender for IoT, for sensor software versions 22.1.x and higher.

For more information about each connection method, see [Private link connection architectures](architecture-private.md).

## Migration process for existing customers

If you're an existing customer with a production deployment, start with the following steps to ensure a full and safe migration to an upgraded private link connection:

1. Review your existing production deployment and how sensors are currently connection to Azure.

1. Determine which connection method is right for each production site. For more information, see [Choose a private link connection method](#choose-a-private-link-connection-method).

1. For any connectivity resources outside of Defender for IoT, such as a VPN or proxy, consult with Microsoft solution architects to ensure correct configurations, security, and high availability.

1. Start migrating with a test lab or reference project where you can validate your connection and fix any issues found.

1. Create a plan of action for your migration, including planning any maintenance windows needed.

You may also still need to upgrade your sensors to version 22.1.x. While you'll need to migrate your connections before the [legacy version reaches end of support](release-notes.md#versions-and-support-dates), you can currently deploy a hybrid network of sensors, including both legacy software versions with their IoT Hub connections, and sensors with software version 22.1.x or higher.

For more information, see [Update a standalone sensor version](how-to-manage-individual-sensors.md#update-a-standalone-sensor-version).

## Choose a private link connection method

Use the following flow chart to determine which private link method is right for your organization.

•	Flexible connectivity - The sensors monitoring remote sites can connect to the service by any of these methods:
o	Connect your sensor through a proxy residing in Azure.
o	Through proxy chaining from secure segments within composite enterprise networks.
o	Directly via the internet (encrypted secure session) 
o	Integration with other cloud vendors (Multi-cloud)

<!-->
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



  


<-->

## Connect via an Azure proxy

This section describes how to configure a sensor connection to Defender for IoT in Azure using an Azure proxy. For more information, see [Proxy connections with an Azure proxy](architecture-private.md#proxy-connections-with-an-azure-proxy).

### Prerequisites

Before you start, make sure that you have:

- An Azure Subscription and an account with **Contributor** permissions to the subscription

- A Log Analytics workspace for monitoring logs

- Remote site connectivity to the Azure VNET

- A proxy server resource, with firewall permissions to access Microsoft cloud services. The procedure described in this article uses a Squid server hosted in Azure.

- Outbound HTTPS traffic on port 443 to the following hostnames:

    - **IoT Hub*: `*.azure-devices.net`
    - **Threat Intelligence**: `*.blob.core.windows.net`
    - **EventHub**: `*.servicebus.windows.net`

> [!IMPORTANT]
> Microsoft Defender for IoT does not offer support for Squid or any other proxy services. It is the customer's responsibility to set up and maintain the proxy service.
>

### Configure sensor proxy settings

If you already have a proxy set up in your Azure VNET, you can start working with a proxy by defining the proxy settings on your sensor console.

1. On your sensor console, go to **System settings > Sensor Network Settings**.

1. Toggle on the **Enable Proxy** option and define your proxy host, port, username, and password.

For more information, see <xref>.

If you do not yet have a proxy configured in your Azure VNET, use the following procedures to configure your proxy:
### Step 1: Define a storage account for NSG logs

In the Azure portal, create a new storage account with the following settings:

|Area  |Settings  |
|---------|---------|
|**Basics**     |**Performance**: Standard <br>**Account kind**: Blob storage <br>**Replication**: LRS         |
|**Network**     | **Connectivity method**: Public endpoint (selected network) <br>**In Virtual Networks**: None <br>**Routing Preference**: Microsoft network routing       |
|**Data Protection**     | Keep all options cleared        |
|**Advanced**     |  Keep all default values       |
| | |

For more information, see <xref>.

### Step 2: Define virtual networks and subnets

Create the following VNET and contained Subnets:

|Name  |Recommended size  |
|---------|---------|
|`MD4IoT-VNET`    | /26 or /25 with Bastion        |
|**Subnets**:     |         |
|- `GatewaySubnet`     | /27        |
|- `ProxyserverSubnet`     |/27         |
|- `AzureBastionSubnet` (optional)     | /26        |
|     |         |

### Step 3: Define a virtual or local network gateway

Create a VPN or ExpressRoute Gateway for virtual gateways, or create a local gateway, depending on how you connect your on-premises network to Azure.

Attach the gateway to the `GatewaySubnet` subnet you created [earlier](#define-virtual-networks-and-subnets).

For more information, see:

- [About VPN gateways](/azure/vpn-gateway/vpn-gateway-about-vpngateways)
- [Connect a virtual network to an ExpressRoute circuit using the portal](/azure/expressroute/expressroute-howto-linkvnet-portal-resource-manager)
- [Modify local network gateway settings using the Azure portal](/azure/vpn-gateway/vpn-gateway-modify-local-network-gateway-portal)

### Step 4: Define network security groups

1. Create an NSG and define the following inbound rules:

    - Create rule `100` to allow traffic from your sensors (the sources) to the load balancer's private IP address (the destination). Use port `tcp3128`.

    - Create rule `4095` as a duplicate of the `65001` system rule. This is because rule `65001` will get overwritten by rule `4096`.

    - Create rule `4096` to deny all traffic for micro-segmentation.

    - Optional. If you're using Bastion, create rule `4094` to allow Bastion SSH to the servers. Use the Bastion subnet as the source.

1. Assign the NSG to the `ProxyserverSubnet` you created [earlier](#define-virtual-networks-and-subnets).

1. Define your NSG logging:

    1. Select your new NSG and then select **Diagnostic setting > Add diagnostic setting**.

    1. Enter a name for your diagnostic setting. Under **Category** ,select **allLogs**.

    1. Select **Sent to Log Analytics workspace**, and then select the Log Analytics workspace you want to use.

    1. Select to send **NSG flow logs** and then define the following values:

        **On the Basics tab**:

        - Enter a meaningful name
        - Select the storage account you'd created [earlier](#define-a-storage-account-for-nsg-logs)
        - Define your required retention days

        **On the Configuration tab**:

        - Select **Version 2**
        - Select **Enable Traffic Analytics**
        - Select your Log Analytics workspace

### Step 5: Define an Azure virtual machine scale set

Define an Azure virtual machine scale set to create and manage a group of load-balanced VMs, where you can automatically increase or decrease the number of VMs as needed.

Use the following procedure to create a scale set to use with your private link connection. For more information, see [What are Virtual Machine scale sets?](/azure/virtual-machine-scale-sets/overview)

1. Create a scale set with the following parameter definitions:

    - **Orchestration Mode**: Uniform
    - **Security Type**: standard
    - **Image**: Ubuntu server 18.04 LTS – Gen1
    - **Size**: Standard_DS1_V2
    - **Authentication**: Based on your corporate standard

    Keep the default value for **Disks** settings.

1. Create a network interface in the `Proxyserver` subnet you created [earlier](#define-virtual-networks-and-subnets), but do not yet define a load balancer.

1. Define your scaling settings as follows:

    - Define the initial instance count as **1**
    - Define the scaling policy as **Manual**

1. Define the following management settings:

    - For the upgrade mode, select **Automatic - instance will start upgrading**
    - Disable boot diagnostics
    - Clear the settings for **Identity** and **Azure AD**
    - Select **Overprovisioning**
    - Select **Enabled automatic OS upgrades**

1. Define the following health settings:

    - Select **Enable application health monitoring**
    - Select the **TCP** protocol and port **3128**

1. Under advanced settings, define the the **Spreading algorithm** as **Max Spreading**.

1. For the custom data script, do the following:

    1. Create the following configuration script, depending on the port and services you are using:

        ```txt
        # Recommended minimum configuration:
        # Squid listening port
        http_port 3128
        # Do not allow caching
        cache deny all
        # allowlist sites allowed
        acl allowed_http_sites dstdomain .azure-devices.net
        acl allowed_http_sites dstdomain .blob.core.windows.net
        acl allowed_http_sites dstdomain .servicebus.windows.net
        http_access allow allowed_http_sites
        # allowlisting
        acl SSL_ports port 443
        acl CONNECT method CONNECT
        # Deny CONNECT to other unsecure ports
        http_access deny CONNECT !SSL_ports
        # default network rules
        http_access allow localhost
        http_access deny all
        ```

    1. Encode the contents of your script file in [base-64](https://www.base64encode.org/).

    1. Copy the contents of the encoded file, and then create the following configuration script:

        ```txt
        #cloud-config
        # updates packages
        apt_upgrade: true
        # Install squid packages
        packages:
         - squid
        run cmd:
         - systemctl stop squid
         - mv /etc/squid/squid.conf /etc/squid/squid.conf.factory
        write_files:
        - encoding: b64
          content: <replace with base64 encoded text>
          path: /etc/squid/squid.conf
          permissions: '0644'
        run cmd:
         - systemctl start squid
         - apt-get -y upgrade; [ -e /var/run/reboot-required ] && reboot
        ```

### Step 6: Create an Azure load balancer

Azure Load Balancer is a layer-4 load balancer that distributes incoming traffic among healthy virtual machine instances using a hash-based distribution algorithm.

For more information, see the [Azure Load Balancer documentation](/azure/load-balancer/load-balancer-overview).

To create an Azure load balancer for your private link connection:

1.	Create a load balancer with a standard SKU and an **Internal** type to ensure that the load balancer is closed to the internet.

1.	Define a dynamic frontend IP address in the `proxysrv` subnet you created [earlier](#define-virtual-networks-and-subnets), setting the availability to zone-redundant.

1.	For a backend, chose the VM scale set you created in the [earlier](#define-an-azure-virtual-machine-scale-set).

1. On the port defined in the sensor, create a TCP load balancing rule connecting the frontend IP address with the backend pool. The default port is 3128.

1. Create a new health probe, and define a TCP health probe on port 3128.

1. Define your load balancer logging:

    1. In the Azure portal, go to the load balancer you've just created.

    1. Select **Diagnostic setting** > **Add diagnostic setting**.

    1. Enter a meaningful name, and define the category as **allMetrics**.

    1. Select **Sent to Log Analytics workspace**, and then select your Log Analytics workspace.

### Step 7: Configure a NAT gateway

To configure a NAT gateway for your private link:

1.	Create a new NAT Gateway.

1.	In the **Outbound IP** tab, select **Create a new public IP address**.

1.	In the **Subnet** tab, select the `ProxyserverSubnet` subnet you created [earlier](#define-virtual-networks-and-subnets).

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