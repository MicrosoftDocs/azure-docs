---
title: Connect OT sensors to Microsoft Defender for IoT in the cloud
description: Learn how to connect your Microsoft Defender for IoT OT sensors to the cloud
ms.topic: how-to
ms.date: 09/11/2022
---

# Connect your OT sensors to the cloud

This article describes how to connect your OT network sensors to the Defender for IoT portal in Azure, for OT sensor software versions 22.x and later.

For more information about each connection method, see [Sensor connection methods](architecture-connections.md).

## Prerequisites

To use the connection methods described in this article, you must have an OT network sensor with software version 22.x or later.

For more information, see [Update Defender for IoT OT monitoring software](update-ot-software.md).

## Choose a sensor connection method

Use this section to help determine which connection method is right for your organization.

|If ...  |... Then  |
|---------|---------|
|- You require private connectivity between your sensor and Azure,  <br>- Your site is connected to Azure via ExpressRoute, or  <br>- Your site is connected to Azure over a VPN  | **[Connect via an Azure proxy](#connect-via-an-azure-proxy)**        |
|- Your sensor needs a proxy to reach from the OT network to the cloud, or <br>- You want multiple sensors to connect to Azure through a single point    | **[Connect via proxy chaining](#connect-via-proxy-chaining)**        |
|- You want to connect your sensor to Azure directly    | **[Connect directly](#connect-directly)**        |
|- You have sensors hosted in multiple public clouds | **[Connect via multicloud vendors](#connect-via-multicloud-vendors)** |


## Connect via an Azure proxy

This section describes how to connect your sensor to Defender for IoT in Azure using an Azure proxy. Use this procedure in the following situations:

- You require private connectivity between your sensor and Azure
- Your site is connected to Azure via ExpressRoute
- Your site is connected to Azure over a VPN

For more information, see [Proxy connections with an Azure proxy](architecture-connections.md#proxy-connections-with-an-azure-proxy).

### Prerequisites

Before you start, make sure that you have:

- An Azure Subscription and an account with **Contributor** permissions to the subscription

- A Log Analytics workspace for monitoring logs

- Remote site connectivity to the Azure VNET

- A proxy server resource, with firewall permissions to access Microsoft cloud services. The procedure described in this article uses a Squid server hosted in Azure.

- Outbound HTTPS traffic on port 443 enabled to the required endpoints for Defender for IoT. Download the list of required endpoints from the **Sites and sensors** page: Select an OT sensor with a supported software version, or a site with one or more supported sensors. And then select **More actions** > **Download endpoint details**.

> [!IMPORTANT]
> Microsoft Defender for IoT does not offer support for Squid or any other proxy services. It is the customer's responsibility to set up and maintain the proxy service.
>

### Configure sensor proxy settings

If you already have a proxy set up in your Azure VNET, you can start working with a proxy by defining the proxy settings on your sensor console.

1. On your sensor console, go to **System settings > Sensor Network Settings**.

1. Toggle on the **Enable Proxy** option and define your proxy host, port, username, and password.

If you don't yet have a proxy configured in your Azure VNET, use the following procedures to configure your proxy:

1. [Define a storage account for NSG logs](#step-1-define-a-storage-account-for-nsg-logs)

1. [Define virtual networks and subnets](#step-2-define-virtual-networks-and-subnets)
1. [Define a virtual or local network gateway](#step-3-define-a-virtual-or-local-network-gateway)
1. [Define network security groups](#step-4-define-network-security-groups)
1. [Define an Azure virtual machine scale set](#step-5-define-an-azure-virtual-machine-scale-set)
1. [Create an Azure load balancer](#step-6-create-an-azure-load-balancer)
1. [Configure a NAT gateway](#step-7-configure-a-nat-gateway)

### Step 1: Define a storage account for NSG logs

In the Azure portal, create a new storage account with the following settings:

|Area  |Settings  |
|---------|---------|
|**Basics**     |**Performance**: Standard <br>**Account kind**: Blob storage <br>**Replication**: LRS         |
|**Network**     | **Connectivity method**: Public endpoint (selected network) <br>**In Virtual Networks**: None <br>**Routing Preference**: Microsoft network routing       |
|**Data Protection**     | Keep all options cleared        |
|**Advanced**     |  Keep all default values       |


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

Attach the gateway to the `GatewaySubnet` subnet you created [earlier](#step-2-define-virtual-networks-and-subnets).

For more information, see:

- [About VPN gateways](../../vpn-gateway/vpn-gateway-about-vpngateways.md)
- [Connect a virtual network to an ExpressRoute circuit using the portal](../../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md)
- [Modify local network gateway settings using the Azure portal](../../vpn-gateway/vpn-gateway-modify-local-network-gateway-portal.md)

### Step 4: Define network security groups

1. Create an NSG and define the following inbound rules:

    - Create rule `100` to allow traffic from your sensors (the sources) to the load balancer's private IP address (the destination). Use port `tcp3128`.

    - Create rule `4095` as a duplicate of the `65001` system rule. This is because rule `65001` will get overwritten by rule `4096`.

    - Create rule `4096` to deny all traffic for micro-segmentation.

    - Optional. If you're using Bastion, create rule `4094` to allow Bastion SSH to the servers. Use the Bastion subnet as the source.

1. Assign the NSG to the `ProxyserverSubnet` you created [earlier](#step-2-define-virtual-networks-and-subnets).

1. Define your NSG logging:

    1. Select your new NSG and then select **Diagnostic setting > Add diagnostic setting**.

    1. Enter a name for your diagnostic setting. Under **Category** ,select **allLogs**.

    1. Select **Sent to Log Analytics workspace**, and then select the Log Analytics workspace you want to use.

    1. Select to send **NSG flow logs** and then define the following values:

        **On the Basics tab**:

        - Enter a meaningful name
        - Select the storage account you'd created [earlier](#step-1-define-a-storage-account-for-nsg-logs)
        - Define your required retention days

        **On the Configuration tab**:

        - Select **Version 2**
        - Select **Enable Traffic Analytics**
        - Select your Log Analytics workspace

### Step 5: Define an Azure virtual machine scale set

Define an Azure virtual machine scale set to create and manage a group of load-balanced virtual machine, where you can automatically increase or decrease the number of virtual machines as needed.

Use the following procedure to create a scale set to use with your sensor connection. For more information, see [What are virtual machine scale sets?](../../virtual-machine-scale-sets/overview.md)

1. Create a scale set with the following parameter definitions:

    - **Orchestration Mode**: Uniform
    - **Security Type**: standard
    - **Image**: Ubuntu server 18.04 LTS – Gen1
    - **Size**: Standard_DS1_V2
    - **Authentication**: Based on your corporate standard

    Keep the default value for **Disks** settings.

1. Create a network interface in the `Proxyserver` subnet you created [earlier](#step-2-define-virtual-networks-and-subnets), but don't yet define a load balancer.

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

1. Under advanced settings, define the **Spreading algorithm** as **Max Spreading**.

1. For the custom data script, do the following:

    1. Create the following configuration script, depending on the port and services you're using:

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
        acl allowed_http_sites dstdomain .download.microsoft.com
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

For more information, see the [Azure Load Balancer documentation](../../load-balancer/load-balancer-overview.md).

To create an Azure load balancer for your sensor connection:

1.	Create a load balancer with a standard SKU and an **Internal** type to ensure that the load balancer is closed to the internet.

1.	Define a dynamic frontend IP address in the `proxysrv` subnet you created [earlier](#step-2-define-virtual-networks-and-subnets), setting the availability to zone-redundant.

1.	For a backend, choose the virtual machine scale set you created in the [earlier](#step-5-define-an-azure-virtual-machine-scale-set).

1. On the port defined in the sensor, create a TCP load balancing rule connecting the frontend IP address with the backend pool. The default port is 3128.

1. Create a new health probe, and define a TCP health probe on port 3128.

1. Define your load balancer logging:

    1. In the Azure portal, go to the load balancer you've created.

    1. Select **Diagnostic setting** > **Add diagnostic setting**.

    1. Enter a meaningful name, and define the category as **allMetrics**.

    1. Select **Sent to Log Analytics workspace**, and then select your Log Analytics workspace.

### Step 7: Configure a NAT gateway

To configure a NAT gateway for your sensor connection:

1.	Create a new NAT Gateway.

1.	In the **Outbound IP** tab, select **Create a new public IP address**.

1.	In the **Subnet** tab, select the `ProxyserverSubnet` subnet you created [earlier](#step-2-define-virtual-networks-and-subnets).

## Connect via proxy chaining

This section describes how to connect your sensor to Defender for IoT in Azure using proxy chaining. Use this procedure in the following situations:

- Your sensor needs a proxy to reach from the OT network to the cloud
- You want multiple sensors to connect to Azure through a single point

For more information, see [Proxy connections with proxy chaining](architecture-connections.md#proxy-connections-with-proxy-chaining).

### Prerequisites

Before you start, make sure that you have a host server running a proxy process within the site network. The proxy process must be accessible to both the sensor and the next proxy in the chain.

We've validated this procedure using the open-source [Squid](http://www.squid-cache.org/) proxy. This proxy uses HTTP tunneling and the HTTP CONNECT command for connectivity. Any other proxy chaining connection that supports the CONNECT command can be used for this connection method.

> [!IMPORTANT]
> Microsoft Defender for IoT does not offer support for Squid or any other proxy services. It is the customer's responsibility to set up and maintain the proxy service.
>

### Configuration

This procedure describes how to install and configure a connection between your sensors and Defender for IoT using the latest version of Squid on an Ubuntu server.

1. Define your proxy settings on each sensor:

    1. On your sensor console, go to **System settings > Sensor Network Settings**.

    1. Toggle on the **Enable Proxy** option and define your proxy host, port, username, and password.

1. Install the Squid proxy:

    1. Sign into your proxy Ubuntu machine and launch a terminal window.

    1. Update your system and install Squid. For example:

        ```bash
        sudo apt-get update
        sudo apt-get install squid
        ```

    1. Locate the Squid configuration file. For example, at `/etc/squid/squid.conf` or `/etc/squid/conf.d/`, and open the file in a text editor.

    1. In the Squid configuration file, search for the following text: `# INSERT YOUR OWN RULE(S) HERE TO ALLOW ACCESS FROM YOUR CLIENTS`.

    1. Add `acl <sensor-name> src <sensor-ip>`, and `http_access allow <sensor-name>` into the file. For example:

        ```text
        # INSERT YOUR OWN RULE(S) HERE TO ALLOW ACCESS FROM YOUR CLIENTS
        acl sensor1 src 10.100.100.1
        http_access allow sensor1
        ```

        Add more sensors as needed by adding extra lines for sensor.

    1. Configure the Squid service to start at launch. Run:

        ```bash
        sudo systemctl enable squid
        ```

1. Connect your proxy to Defender for IoT:

    1. Download the list of required endpoints from the **Sites and sensors** page: Select an OT sensor with a supported software version, or a site with one or more supported sensors. And then select **More actions** > **Download endpoint details**.
    1. Enable outbound HTTPS traffic on port 443 from the sensor to each of the required endpoints for Defender for IoT.


> [!IMPORTANT]
> Some organizations must define firewall rules by IP addresses. If this is true for your organization, it's important to know that the Azure public IP ranges are updated weekly.
>
> Make sure to download the new JSON file each week and make the required changes on your site to correctly identify services running in Azure. You'll need the updated IP ranges for **AzureIoTHub**, **Storage**, and **EventHub**. See the [latest IP ranges](https://www.microsoft.com/en-us/download/details.aspx?id=56519).
>

## Connect directly

This section describes what you need to configure a direct sensor connection to Defender for IoT in Azure. For more information, see [Direct connections](architecture-connections.md#direct-connections).

1. Download the list of required endpoints from the **Sites and sensors** page on the Azure portal. Select an OT sensor with a supported software version, or a site with one or more supported sensors. And then select **More actions** > **Download endpoint details**.

1. Ensure that your sensor can access the cloud using HTTPS on port 443 to each of the listed endpoints in the downloaded list.

1. Azure public IP addresses are updated weekly. If you must define firewall rules based on IP addresses, make sure to download the new JSON file each week and make the required changes on your site to correctly identify services running in Azure. You'll need the updated IP ranges for **AzureIoTHub**, **Storage**, and **EventHub**. See the [latest IP ranges](https://www.microsoft.com/en-us/download/details.aspx?id=56519).

## Connect via multicloud vendors

This section describes how to connect your sensor to Defender for IoT in Azure from sensors deployed in one or more public clouds. For more information, see [Multicloud connections](architecture-connections.md#multicloud-connections).

### Prerequisites

Before you start: 

- Make sure that you have a sensor deployed in a public cloud, such as AWS or Google Cloud, and configured to monitor SPAN traffic.

- Choose the multicloud connectivity method that's right for your organization:

    Use the following flow chart to determine which connectivity method to use:

    :::image type="content" source="media/architecture-connections/multicloud-flow-chart.png" alt-text="Flow chart to determine which connectivity method to use.":::

    - **Use public IP addresses over the internet** if you don't need to exchange data using private IP addresses

    - **Use site-to-site VPN over the internet** only if you don't* require any of the following:

        - Predictable throughput
        - SLA
        - High data volume transfers
        - Avoid connections over the public internet

    - **Use ExpressRoute** if you require predictable throughput, SLA, high data volume transfers, or to avoid connections over the public internet.

        In this case:

        - If you want to own and manage the routers making the connection, use ExpressRoute with customer-managed routing.
        - If you don't need to own and manage the routers making the connection, use ExpressRoute with a cloud exchange provider.

### Configuration

1. Configure your sensor to connect to the cloud using one of the Azure Cloud Adoption Framework recommended methods. For more information, see [Connectivity to other cloud providers](/azure/cloud-adoption-framework/ready/azure-best-practices/connectivity-to-other-providers).

1. To enable private connectivity between your VPCs and Defender for IoT, connect your VPC to an Azure VNET over a VPN connection. For example if you're connecting from an AWS VPC, see our TechCommunity blog: [How to create a VPN between Azure and AWS using only managed solutions](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/how-to-create-a-vpn-between-azure-and-aws-using-only-managed/ba-p/2281900).

1. After your VPC and VNET are configured, connect to Defender for IoT as you would when connecting via an Azure proxy. For more information, see [Connect via an Azure proxy](#connect-via-an-azure-proxy).

## Migration for existing customers

If you're an existing customer with a production deployment and sensors connected using the legacy IoT Hub method, start with the following steps to ensure a full and safe migration to an updated connection method.

1. **Review your existing production deployment** and how sensors are currently connection to Azure. Confirm that the sensors in production networks can reach the Azure data center resource ranges.

1. **Determine which connection method is right** for each production site. For more information, see [Choose a sensor connection method](connect-sensors.md#choose-a-sensor-connection-method).

1. **Configure any other resources required** as described in the procedure in this article for your chosen connectivity method. For example, other resources might include a proxy, VPN, or ExpressRoute.

    For any connectivity resources outside of Defender for IoT, such as a VPN or proxy, consult with Microsoft solution architects to ensure correct configurations, security, and high availability.

1. **If you have legacy sensor versions installed**, we recommend that you update your sensors at least to a version 22.1.x or higher. In this case, make sure that you've updated your firewall rules and activated your sensor with a new activation file.

    Sign in to each sensor after the update to verify that the activation file was applied successfully. Also check the Defender for IoT **Sites and sensors** page in the Azure portal to make sure that the updated sensors show as **Connected**.

    For more information, see [Update OT system software](update-ot-software.md) and [Sensor access to Azure portal](how-to-set-up-your-network.md#sensor-access-to-azure-portal).

1. **Start migrating with a test lab or reference project** where you can validate your connection and fix any issues found.

1. **Create a plan of action for your migration**, including planning any maintenance windows needed.

1. **After the migration in your production environment**, you can delete any previous IoT Hubs that you had used before the migration. Make sure that any IoT Hubs you delete aren't used by any other services:

    - If you've upgraded your versions, make sure that all updated sensors indicate software version 22.1.x or higher.

    - Check the active resources in your account and make sure there are no other services connected to your IoT Hub.

    - If you're running a hybrid environment with multiple sensor versions, make sure any sensors with software version 22.1.x can connect to Azure. Use firewall rules that allow outbound HTTPS traffic on port 443 to each of the required endpoints.

        Find the list of required endpoints for Defender for IoT from the **Sites and sensors** page on the Azure portal. Select an OT sensor with a supported software version, or a site with one or more supported sensors. And then select **More actions** > **Download endpoint details**.

While you'll need to migrate your connections before the [legacy version reaches end of support](release-notes.md#versioning-and-support-for-on-premises-software-versions), you can currently deploy a hybrid network of sensors, including legacy software versions with their IoT Hub connections, and sensors with the connection methods described in this article.

## Next steps

For more information, see [Sensor connection methods](architecture-connections.md).
