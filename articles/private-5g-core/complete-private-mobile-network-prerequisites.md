---
title: Prepare to deploy a private mobile network
titleSuffix: Azure Private 5G Core
description: Learn how to complete the prerequisite tasks for deploying a private mobile network with Azure Private 5G Core.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 03/30/2023
ms.custom: template-how-to, devx-track-azurecli
zone_pivot_groups: ase-pro-version
---

# Complete the prerequisite tasks for deploying a private mobile network

In this how-to guide, you'll carry out each of the tasks you need to complete before you can deploy a private mobile network using Azure Private 5G Core.

> [!TIP]
> [Private mobile network design requirements](private-mobile-network-design-requirements.md) contains the full network design requirements for a customized network.

## Tools and access

To deploy your private mobile network using Azure Private 5G Core, you need:

- A Windows PC with internet access
- A Windows Administrator account on that PC
- [Azure CLI](/cli/azure/install-azure-cli)
- [PowerShell](/powershell/scripting/install/installing-powershell-on-windows)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)

## Get access to Azure Private 5G Core for your Azure subscription

Contact your trials engineer and ask them to register your Azure subscription for access to Azure Private 5G Core. If you don't already have a trials engineer and are interested in trialing Azure Private 5G Core, contact your Microsoft account team, or express your interest through the [partner registration form](https://forms.office.com/r/4Q1yNRakXe).

## Choose the core technology type (5G, 4G, or combined 4G and 5G)

Choose whether each site in the private mobile network should provide coverage for 5G, 4G, or combined 4G and 5G user equipment (UEs). If you're deploying multiple sites, they can each support different core technology types.

## Choose a standard or Highly Available deployment

Azure Private 5G Core is deployed as an Azure Kubernetes Service (AKS) cluster. This cluster can run on a single Azure Stack Edge (ASE) device, or on a pair of ASE devices for a Highly Available (HA) service. An HA deployment allows the service to be maintained in the event of an ASE hardware failure.

For an HA deployment, you will need to deploy a gateway router (strictly, a Layer 3 capable device – either a router or an L3 switch (router/switch hybrid)) between the ASE cluster and:

- the RAN equipment in the access network.
- the data network(s).
 
The gateway router must support Bidirectional Forwarding Detection (BFD) and Mellanox-compatible SFPs (small form factor pluggable modules).

You must design your network to tolerate failure of a gateway router in the access network or in a data network. AP5GC only supports a single gateway router IP address per network. Therefore, only a network design where there is either a single gateway router per network or where the gateway routers are deployed in redundant pairs in an active / standby configuration with a floating gateway IP address is supported. The gateway routers in each redundant pair should monitor each other using VRRP (Virtual Router Redundancy Protocol) to provide detection of partner failure.

### Cluster network topologies

AP5GC HA is built on a platform comprising a two node cluster of ASE devices. The ASEs are connected to a common L2 broadcast domain and IP subnet in the access network (or else two common L2 domains, one for N2 and one for N3, using VLANs) and in each of the core networks. They also share an L2 broadcast domain and IP subnet on the management network.

:::zone pivot="ase-pro-2"

See [Supported network topologies](/azure/databox-online/azure-stack-edge-gpu-clustering-overview?tabs=2). We recommend using **Option 1** - Port 1 and Port 2 are in different subnets. Separate virtual switches are created. Port 3 and Port 4 connect to an external virtual switch.

:::zone-end

:::zone pivot="ase-pro-gpu"

See [Supported network topologies](/azure/databox-online/azure-stack-edge-gpu-clustering-overview?tabs=1). We recommend using **Option 2 - Use switches and NIC teaming** for maximum protection from failures. It is also acceptable to use one switch if preferred (Option 3), but this will lead to a higher risk of downtime in the event of a switch failureUsing the switchless topology (Option 1) is possible but is not recommended because of the even higher risk of downtime. Option 3 causes each ASE to automatically create a Hyper-V virtual switch (vswitch) and add the ports to it.

:::zone-end

#### Cluster quorum and witness

A two node ASE cluster requires a cluster witness, so that if one of the ASE nodes fails, the cluster witness accounts for the third vote, and the cluster stays online. The cluster witness runs in the Azure cloud.

To configure an Azure cloud witness, see [https://learn.microsoft.com/windows-server/failover-clustering/deploy-cloud-witness](/windows-server/failover-clustering/deploy-cloud-witness). The Replication field must be set to locally redundant storage (LRS). Firewalls between the ASE cluster and the Azure storage account must allow outbound traffic to https://*.core.windows.net/* on port 443 (HTTPS).

## Allocate subnets and IP addresses

Azure Private 5G Core requires a management network, access network, and up to ten data networks. These networks can all be part of the same, larger network, or they can be separate. The approach you use depends on your traffic separation requirements.

For each of these networks, allocate a subnet and then identify the listed IP addresses. If you're deploying multiple sites, you need to collect this information for each site.

Depending on your networking requirements (for example, if a limited set of subnets is available), you might choose to allocate a single subnet for all of the Azure Stack Edge interfaces, marked with an asterisk (*) in the following list.

> [!NOTE]
> Additional requirements for a highly available (HA) deployment are listed in-line.

### Management network

:::zone pivot="ase-pro-2"

- Network address in Classless Inter-Domain Routing (CIDR) notation.
- Default gateway.
- One IP address for the management port (port 2) on the Azure Stack Edge Pro 2 device.
  - HA: four IP addresses (two for each Azure Stack Edge device).
- Six sequential IP addresses for the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster nodes.
  - HA: seven sequential IP addresses.
- One service IP address for accessing local monitoring tools for the packet core instance.

Additional IP addresses for the two node Azure Stack Edge cluster in an HA deployment:

- One virtual IP address for ACS (Azure Consistency Services).
- One virtual IP address for NFS (Network File Services).

:::zone-end
:::zone pivot="ase-pro-gpu"

- Network address in Classless Inter-Domain Routing (CIDR) notation.
- Default gateway.
- One IP address for the management port
  - Choose a port between 2 and 4 to use as the Azure Stack Edge Pro GPU device's management port as part of [setting up your Azure Stack Edge Pro device](#order-and-set-up-your-azure-stack-edge-pro-devices).*
  - HA: two IP addresses (one for each Azure Stack Edge device)
- Six sequential IP addresses for the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster nodes.
  - HA: seven sequential IP addresses.
- One service IP address for accessing local monitoring tools for the packet core instance.

Additional IP addresses for the two node Azure Stack Edge cluster in an HA deployment:

- One virtual IP address for ACS (Azure Consistency Services).
- One virtual IP address for NFS (Network File Services).

:::zone-end

### Access network

You will need an IP subnet for control plane traffic and an IP subnet for user plane traffic. If control plane and user plane are on the same VLAN (or are not VLAN-tagged) then you can use a single IP subnet for both.

:::zone pivot="ase-pro-2"

- Network address in CIDR notation.
- Default gateway.
- One IP address for the control plane interface.
  - For 5G, this is the N2 interface
  - For 4G, this is the S1-MME interface.
  - For combined 4G and 5G, this is the N2/S1-MME interface.
- One IP address for the user plane interface.
  - For 5G, this is the N3 interface
  - For 4G, this is the S1-U interface.
  - For combined 4G and 5G, this is the N3/S1-U interface.
- One IP address for port 3 on the Azure Stack Edge Pro 2 device.
- HA control plane:
  - gateway router IP address.
  - two IP addresses (one per ASE) for use as vNIC addresses on the AMFs.
- HA user plane:
  - gateway router IP address.
  - two IP addresses (one per ASE) for use as vNIC addresses on the UPFs’ interfaces to the local access subnet.

:::zone-end

:::zone pivot="ase-pro-gpu"

- Network address in CIDR notation.
- Default gateway.
- One IP address for the control plane interface.
  - For 5G, this is the N2 interface
  - For 4G, this is the S1-MME interface.
  - For combined 4G and 5G, this is the N2/S1-MME interface.
- One IP address for the user plane interface.
  - For 5G, this is the N3 interface
  - For 4G, this is the S1-U interface.
  - For combined 4G and 5G, this is the N3/S1-U interface.
- One IP address for port 5 on the Azure Stack Edge Pro GPU device.
- HA control plane:
  - gateway router IP address.
  - two IP addresses (one per ASE) for use as vNIC addresses on the AMFs.
- HA user plane:
  - gateway router IP address.
  - two IP addresses (one per ASE) for use as vNIC addresses on the UPFs’ interfaces to the local access subnet.

:::zone-end

### Data networks

Allocate the following IP addresses for each data network in the site:

- Network address in CIDR notation.
- Default gateway.
- One IP address for the user plane interface.
  - For 5G, this is the N6 interface
  - For 4G, this is the SGi interface.
  - For combined 4G and 5G, this is the N6/SGi interface.

The following IP addresses must be used by all the data networks in the site:

:::zone pivot="ase-pro-2"

- One IP address for all data networks on port 3 on the Azure Stack Edge Pro 2 device.
- One IP address for all data networks on port 4 on the Azure Stack Edge Pro 2 device.
- HA: gateway router IP address.
- HA: Two IP addresses (one per ASE) for use as vNIC addresses on the UPFs’ interfaces to the data network.

:::zone-end

:::zone pivot="ase-pro-gpu"

- One IP address for all data networks on port 5 on the Azure Stack Edge Pro GPU device.
- One IP address for all data networks on port 6 on the Azure Stack Edge Pro GPU device.
- HA: gateway router IP address.
- HA: Two IP addresses (one per ASE) for use as vNIC addresses on the UPFs’ interfaces to the data network.

:::zone-end

### Additional virtual IP addresses (HA only)

The following virtual IP addresses are required for an HA deployment. These IP addresses MUST NOT be in any of the control plane or user plane subnets - they are used as destinations of static routes in the access network gateway routers. That is, they can be any valid IP address that is not included in any of the subnets configured in the access network.

-	One virtual address to use as a virtual N2 address. The RAN equipment is configured to use this address.
-	One virtual address to use as a virtual tunnel endpoint on the N3 reference point.
 
### VLANs

You can optionally configure your Azure Stack Edge Pro device with virtual local area network (VLAN) tags. You can use this configuration to enable layer 2 traffic separation on the N2, N3 and N6 interfaces, or their 4G equivalents. For example, the ASE device has a single port for N2 and N3 traffic and a single port for all data network traffic. You can use VLAN tags to separate N2 and N3 traffic, or separate traffic for each connected data network.

Allocate VLAN IDs for each network as required.

If you are using VLANs to separate traffic for each data network, a local subnet is required for the data network-facing ports covering the default VLAN (VLAN 0). For HA, you must assign the gateway router IP address within this subnet.

## Allocate user equipment (UE) IP address pools

Azure Private 5G Core supports the following IP address allocation methods for UEs.

- Dynamic. Dynamic IP address allocation automatically assigns a new IP address to a UE each time it connects to the private mobile network.

- Static. Static IP address allocation ensures that a UE receives the same IP address every time it connects to the private mobile network. Static IP addresses are useful when you want Internet of Things (IoT) applications to be able to consistently connect to the same device. For example, you can configure a video analysis application with the IP addresses of the cameras providing video streams. If these cameras have static IP addresses, you won't need to reconfigure the video analysis application with new IP addresses each time the cameras restart. You'll allocate static IP addresses to a UE as part of [provisioning its SIM](provision-sims-azure-portal.md).

You can choose to support one or both of these methods for each data network in your site.

For each data network you're deploying:

- Decide which IP address allocation methods you want to support.
- For each method you want to support, identify an IP address pool from which IP addresses can be allocated to UEs. You must provide each IP address pool in CIDR notation.

    If you decide to support both methods for a particular data network, ensure that the IP address pools are of the same size and don't overlap.

- Decide whether you want to enable Network Address and Port Translation (NAPT) for the data network. NAPT allows you to translate a large pool of private IP addresses for UEs to a small pool of public IP addresses. The translation is performed at the point where traffic enters the data network, maximizing the utility of a limited supply of public IP addresses.

## Configure Domain Name System (DNS) servers

> [!IMPORTANT]
> If you don't configure DNS servers for a data network, all UEs using that network will be unable to resolve domain names.

DNS allows the translation between human-readable domain names and their associated machine-readable IP addresses. Depending on your requirements, you have the following options for configuring a DNS server for your data network:

- If you need the UEs connected to this data network to resolve domain names, you must configure one or more DNS servers. You must use a private DNS server if you need DNS resolution of internal hostnames. If you're only providing internet access to public DNS names, you can use a public or private DNS server.
- If you don't need the UEs to perform DNS resolution, or if all UEs in the network will use their own locally configured DNS servers (instead of the DNS servers signaled to them by the packet core), you can omit this configuration.

## Configure

## Prepare your networks

For each site you're deploying:

- Ensure you have at least one network switch with at least three ports available. You'll connect each Azure Stack Edge Pro device to the switch(es) in the same site as part of the instructions in [Order and set up your Azure Stack Edge Pro device(s)](#order-and-set-up-your-azure-stack-edge-pro-devices).
- For every network where you decided not to enable NAPT (as described in [Allocate user equipment (UE) IP address pools](#allocate-user-equipment-ue-ip-address-pools)), configure the data network to route traffic destined for the UE IP address pools via the IP address you allocated to the packet core instance's user plane interface on the data network.

### Configure ports for local access

:::zone pivot="ase-pro-2"
The following tables contain the ports you need to open for Azure Private 5G Core local access. This includes local management access and control plane signaling.

You must set these up in addition to the [ports required for Azure Stack Edge (ASE)](/azure/databox-online/azure-stack-edge-pro-2-system-requirements#networking-port-requirements).

#### Azure Private 5G Core

| Port | ASE interface | Description|
|--|--|--|
| TCP 443 Inbound      | Management (LAN)        | Access to local monitoring tools (packet core dashboards and distributed tracing). |
| 5671 In/Outbound    | Management (LAN) | Communication to Azure Event Hubs, AMQP Protocol |
| 5672 In/Outbound    | Management (LAN) | Communication to Azure Event Hubs, AMQP Protocol |
| UDP 1812 In/Outbound | Management (LAN) | Authentication with a RADIUS AAA server. </br>Only required when RADIUS is in use. |
| SCTP 38412 Inbound   | Port 3 (Access network) | Control plane access signaling (N2 interface). </br>Only required for 5G deployments. |
| SCTP 36412 Inbound   | Port 3 (Access network) | Control plane access signaling (S1-MME interface). </br>Only required for 4G deployments. |
| UDP 2152 In/Outbound | Port 3 (Access network) | Access network user plane data (N3 interface for 5G, S1-U for 4G, or N3/S1-U for combined 4G and 5G). |
| All IP traffic       | Ports 3 and 4 (Data networks)   | Data network user plane data (N6 interface for 5G, SGi for 4G, or N6/SGi for combined 4G and 5G). </br> Only required on port 3 if data networks are configured on that port. |

:::zone-end
:::zone pivot="ase-pro-gpu"
The following tables contains the ports you need to open for Azure Private 5G Core local access. This includes local management access and control plane signaling.

You must set these up in addition to the [ports required for Azure Stack Edge (ASE)](/azure/databox-online/azure-stack-edge-gpu-system-requirements#networking-port-requirements).

#### Azure Private 5G Core

| Port | ASE interface | Description|
|--|--|--|
| TCP 443 Inbound      | Management (LAN)        | Access to local monitoring tools (packet core dashboards and distributed tracing). |
| 5671 In/Outbound    | Management (LAN) | Communication to Azure Event Hubs, AMQP Protocol |
| 5672 In/Outbound    | Management (LAN) | Communication to Azure Event Hubs, AMQP Protocol |
| UDP 1812 In/Outbound | Management (LAN) | Authentication with a RADIUS AAA server. </br>Only required when RADIUS is in use. |
| SCTP 38412 Inbound   | Port 5 (Access network) | Control plane access signaling (N2 interface). </br>Only required for 5G deployments. |
| SCTP 36412 Inbound   | Port 5 (Access network) | Control plane access signaling (S1-MME interface). </br>Only required for 4G deployments. |
| UDP 2152 In/Outbound | Port 5 (Access network) | Access network user plane data (N3 interface for 5G, S1-U for 4G, or N3/S1-U for combined 4G and 5G). |
| All IP traffic       | Ports 5 and 6 (Data networks)   | Data network user plane data (N6 interface for 5G, SGi for 4G, or N6/SGi for combined 4G and 5G)). </br> Only required on port 5 if data networks are configured on that port. |
:::zone-end

#### Port requirements for Azure Stack Edge

|Port No.|In/Out|Port Scope|Required|Notes|
|--|--|--|--|--|
|UDP 123 (NTP)|Out|WAN|In some cases|This port is only required if you are using a local NTP server or internet-based server for ASE.|
|UDP 53 (DNS)|Out|WAN|In some cases| See [Configure Domain Name System (DNS) servers](#configure-domain-name-system-dns-servers). |
|TCP 5985 (WinRM)|Out/In|LAN|Yes|Required for WinRM to connect ASE via PowerShell during AP5GC deployment.</br> See [Commission an AKS cluster](commission-cluster.md).  |
|TCP 5986 (WinRM)|Out/In|LAN|Yes|Required for WinRM to connect ASE via PowerShell during AP5GC deployment.</br> See [Commission an AKS cluster](commission-cluster.md). |
|UDP 67 (DHCP)|Out|LAN|Yes|
|TCP 445 (SMB)|In|LAN|No|ASE for AP5GC does not require a local file server.|
|TCP 2049 (NFS)|In|LAN|No|ASE for AP5GC does not require a local file server.|

#### Port requirements for IoT Edge

|Port No.|In/Out|Port Scope|Required|Notes|
|--|--|--|--|--|
|TCP 443 (HTTPS)|Out|WAN|No|This configuration is only required when using manual scripts or Azure IoT Device Provisioning Service (DPS).|

#### Port requirements for Kubernetes on Azure Stack Edge

|Port No.|In/Out|Port Scope|Required|Notes|
|--|--|--|--|--|
|TCP 31000 (HTTPS)|In|LAN|Yes|Required for Kubernetes dashboard to monitor your device.|
|TCP 6443 (HTTPS)|In|LAN|Yes|Required for kubectl access|

### Outbound firewall ports required

Review and apply the firewall recommendations for the following services:

:::zone pivot="ase-pro-gpu"
- [Azure Stack Edge](../databox-online/azure-stack-edge-gpu-system-requirements.md#url-patterns-for-firewall-rules)
- [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/network-requirements.md?tabs=azure-cloud)
- [Azure Network Function Manager](../network-function-manager/requirements.md)
:::zone-end
:::zone pivot="ase-pro-2"
- [Azure Stack Edge](../databox-online/azure-stack-edge-pro-2-system-requirements.md#url-patterns-for-firewall-rules)
- [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/network-requirements.md?tabs=azure-cloud)
- [Azure Network Function Manager](../network-function-manager/requirements.md)
:::zone-end

The following table contains the URL patterns for Azure Private 5G Core's outbound traffic.

| URL pattern | Description|
|--|--|
| `https://*.azurecr.io` | Required to pull container images for Azure Private 5G Core workloads. |
| `https://*.microsoftmetrics.com` </br> `https://*.hot.ingestion.msftcloudes.com`| Required for monitoring and telemetry for the Azure Private 5G Core service. |

## Register resource providers

To use Azure Private 5G Core, you need to register some additional resource providers with your Azure subscription.

> [!TIP]
> If you do not have the Azure CLI installed, see installation instructions at [How to install the Azure CLI](/cli/azure/install-azure-cli). Alternatively, you can use the [Azure Cloud Shell](../cloud-shell/overview.md) on the portal.

1. Sign into the Azure CLI with a user account that is associated with the Azure tenant that you are deploying Azure Private 5G Core into:

    ```azurecli
    az login
    ```

    > [!TIP]
    > See [Sign in interactively](/cli/azure/authenticate-azure-cli) for full instructions.

1. If your account has multiple subscriptions, make sure you are in the correct one:

    ```azurecli
    az account set --subscription <subscription_id>
    ```

1. Check the Azure CLI version:

    ```azurecli
    az version
    ```

    If the CLI version is below 2.37.0, you must upgrade your Azure CLI to a newer version. See [How to update the Azure CLI](/cli/azure/update-azure-cli).
1. Register the following resource providers:

    ```azurecli
    az provider register --namespace Microsoft.MobileNetwork
    az provider register --namespace Microsoft.HybridNetwork
    az provider register --namespace Microsoft.ExtendedLocation
    az provider register --namespace Microsoft.Kubernetes
    az provider register --namespace Microsoft.KubernetesConfiguration
    ```

## Retrieve the Object ID (OID)

You need to obtain the object ID (OID) of the custom location resource provider in your Azure tenant. You must provide this OID when you create the Kubernetes service. You can obtain the OID using the Azure CLI or the Azure Cloud Shell on the portal. You must be an owner of your Azure subscription.

1. Sign in to the Azure CLI or Azure Cloud Shell.
1. Retrieve the OID:

    ```azurecli
    az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv
    ```

This command queries the custom location and will output an OID string. Save this string for use later when you're commissioning the Azure Stack Edge device.

## Order and set up your Azure Stack Edge Pro device(s)

Complete the following for each site you want to add to your private mobile network. Detailed instructions for how to carry out each step are included in the **Detailed instructions** column where applicable.

:::zone pivot="ase-pro-2"
| Step No. | Description | Detailed instructions |
|--|--|--|
| 1. | Complete the Azure Stack Edge Pro 2 deployment checklist.| [Deployment checklist for your Azure Stack Edge Pro 2 device](/azure/databox-online/azure-stack-edge-pro-2-deploy-checklist?pivots=single-node)|
| 2. | Order and prepare your Azure Stack Edge Pro 2 device. | [Tutorial: Prepare to deploy Azure Stack Edge Pro 2](../databox-online/azure-stack-edge-pro-2-deploy-prep.md) |
| 3. | Rack and cable your Azure Stack Edge Pro 2 device. </br></br>When carrying out this procedure, you must ensure that the device has its ports connected as follows:</br></br>- Port 2 - management</br>- Port 3 - access network (and optionally, data networks)</br>- Port 4 - data networks| [Tutorial: Install Azure Stack Edge Pro 2](/azure/databox-online/azure-stack-edge-pro-2-deploy-install?pivots=single-node.md) |
| 4. | Connect to your Azure Stack Edge Pro 2 device using the local web UI. | [Tutorial: Connect to Azure Stack Edge Pro 2](/azure/databox-online/azure-stack-edge-pro-2-deploy-connect?pivots=single-node.md) |
| 5. | Configure the network for your Azure Stack Edge Pro 2 device. </br> </br> **Note:** When an ASE is used in an Azure Private 5G Core service, Port 2 is used for management rather than data. The tutorial linked assumes a generic ASE that uses Port 2 for data. </br></br> If the RAN and Packet Core are on the same subnet, you do not need to configure a gateway for Port 3 or Port 4. </br></br> In addition, you can optionally configure your Azure Stack Edge Pro device to run behind a web proxy. </br></br> Verify the outbound connections from Azure Stack Edge Pro device to the Azure Arc endpoints are opened. </br></br>**Do not** configure virtual switches, virtual networks, or compute IPs. | [Tutorial: Configure network for Azure Stack Edge Pro 2](/azure/databox-online/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy?pivots=single-node.md)</br></br>[(Optionally) Configure web proxy for Azure Stack Edge Pro](/azure/databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy?pivots=single-node#configure-web-proxy)</br></br>[Azure Arc Network Requirements](/azure/azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli%2Cazure-cloud)</br></br>[Azure Arc Agent Network Requirements](/azure/architecture/hybrid/arc-hybrid-kubernetes)|
| 6. | Configure a name, DNS name, and (optionally) time settings. </br></br>**Do not** configure an update. | [Tutorial: Configure the device settings for Azure Stack Edge Pro 2](../databox-online/azure-stack-edge-pro-2-deploy-set-up-device-update-time.md) |
| 7. | Configure certificates and configure encryption-at-rest for your Azure Stack Edge Pro 2 device. After changing the certificates, you might have to reopen the local UI in a new browser window to prevent the old cached certificates from causing problems.| [Tutorial: Configure certificates for your Azure Stack Edge Pro 2](/azure/databox-online/azure-stack-edge-pro-2-deploy-configure-certificates?pivots=single-node) |
| 8. | Activate your Azure Stack Edge Pro 2 device. </br></br>**Do not** follow the section to *Deploy Workloads*. | [Tutorial: Activate Azure Stack Edge Pro 2](../databox-online/azure-stack-edge-pro-2-deploy-activate.md) |
| 9. | Enable VM management from the Azure portal. </br></br>Enabling this immediately after activating the Azure Stack Edge Pro 2 device occasionally causes an error. Wait one minute and retry.   | Navigate to the ASE resource in the Azure portal, go to **Edge services**, select **Virtual machines** and select **Enable**.   |
| 10. | Run the diagnostics tests for the Azure Stack Edge Pro 2 device in the local web UI, and verify they all pass. </br></br>You might see a warning about a disconnected, unused port. You should fix the issue if the warning relates to any of these ports:</br></br>- Port 2 - management</br>- Port 3 - access network (and optionally, data networks)</br>- Port 4 - data networks</br></br>For all other ports, you can ignore the warning. </br></br>If there are any errors, resolve them before continuing with the remaining steps. This includes any errors related to invalid gateways on unused ports. In this case, either delete the gateway IP address or set it to a valid gateway for the subnet. | [Run diagnostics, collect logs to troubleshoot Azure Stack Edge device issues](../databox-online/azure-stack-edge-gpu-troubleshoot.md) |

> [!IMPORTANT]
> You must ensure your Azure Stack Edge Pro 2 device is compatible with the Azure Private 5G Core version you plan to install. See [Packet core and Azure Stack Edge (ASE) compatibility](./azure-stack-edge-packet-core-compatibility.md). If you need to upgrade your Azure Stack Edge Pro 2 device, see [Update your Azure Stack Edge Pro 2](../databox-online/azure-stack-edge-gpu-install-update.md?tabs=version-2106-and-later).

:::zone-end
:::zone pivot="ase-pro-gpu"
| Step No. | Description | Detailed instructions |
|--|--|--|
| 1. | Complete the Azure Stack Edge Pro GPU deployment checklist.| [Deployment checklist for your Azure Stack Edge Pro GPU device](/azure/databox-online/azure-stack-edge-gpu-deploy-checklist?pivots=single-node)|
| 2. | Order and prepare your Azure Stack Edge Pro GPU device. | [Tutorial: Prepare to deploy Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-prep.md) |
| 3. | Rack and cable your Azure Stack Edge Pro GPU device. </br></br>When carrying out this procedure, you must ensure that the device has its ports connected as follows:</br></br>- Port 5 - access network (and optionally, data networks)</br>- Port 6 - data networks</br></br>Additionally, you must have a port connected to your management network. You can choose any port from 2 to 4. | [Tutorial: Install Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-install?pivots=single-node.md) |
| 4. | Connect to your Azure Stack Edge Pro GPU device using the local web UI. | [Tutorial: Connect to Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-connect?pivots=single-node.md) |
| 5. | Configure the network for your Azure Stack Edge Pro GPU device. Follow the instructions for a **Single node device** for a standard deployment or a **Two node cluster** for an HA deployment. </br> </br> **Note:** When an ASE is used in an Azure Private 5G Core service, Port 2 is used for management rather than data. The tutorial linked assumes a generic ASE that uses Port 2 for data. </br></br> If the RAN and Packet Core are on the same subnet, you do not need to configure a gateway for Port 5 or Port 6. </br></br> In addition, you can optionally configure your Azure Stack Edge Pro GPU device to run behind a web proxy. </br></br> Verify the outbound connections from Azure Stack Edge Pro GPU device to the Azure Arc endpoints are opened.  </br></br>**Do not** configure virtual switches, virtual networks, or compute IPs. | [Tutorial: Configure network for Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy?pivots=single-node.md)</br></br>[(Optionally) Configure web proxy for Azure Stack Edge Pro](/azure/databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy?pivots=single-node#configure-web-proxy)</br></br>[Azure Arc Network Requirements](/azure/azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli%2Cazure-cloud)</br></br>[Azure Arc Agent Network Requirements](/azure/architecture/hybrid/arc-hybrid-kubernetes)|
| 6. | Configure a name, DNS name, and (optionally) time settings. </br></br>**Do not** configure an update. | [Tutorial: Configure the device settings for Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-set-up-device-update-time.md) |
| 7. | Configure certificates for your Azure Stack Edge Pro GPU device. After changing the certificates, you might have to reopen the local UI in a new browser window to prevent the old cached certificates from causing problems.| [Tutorial: Configure certificates for your Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-configure-certificates?pivots=single-node) |
| 8. | Activate your Azure Stack Edge Pro GPU device. </br></br>**Do not** follow the section to *Deploy Workloads*. | [Tutorial: Activate Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-activate.md) |
| 9. | Enable VM management from the Azure portal. </br></br>Enabling this immediately after activating the Azure Stack Edge Pro device occasionally causes an error. Wait one minute and retry.   | Navigate to the ASE resource in the Azure portal, go to **Edge services**, select **Virtual machines** and select **Enable**.   |
| 10. | Run the diagnostics tests for the Azure Stack Edge Pro GPU device in the local web UI, and verify they all pass. </br></br>You might see a warning about a disconnected, unused port. You should fix the issue if the warning relates to any of these ports:</br></br>- Port 5.</br>- Port 6.</br>- The port you chose to connect to the management network in Step 3.</br></br>For all other ports, you can ignore the warning. </br></br>If there are any errors, resolve them before continuing with the remaining steps. This includes any errors related to invalid gateways on unused ports. In this case, either delete the gateway IP address or set it to a valid gateway for the subnet. | [Run diagnostics, collect logs to troubleshoot Azure Stack Edge device issues](../databox-online/azure-stack-edge-gpu-troubleshoot.md) |

> [!IMPORTANT]
> You must ensure your Azure Stack Edge Pro GPU device is compatible with the Azure Private 5G Core version you plan to install. See [Packet core and Azure Stack Edge (ASE) compatibility](./azure-stack-edge-packet-core-compatibility.md). If you need to upgrade your Azure Stack Edge Pro GPU device, see [Update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md?tabs=version-2106-and-later).

:::zone-end

## Next steps

You can now commission the Azure Kubernetes Service (AKS) cluster on your Azure Stack Edge Pro 2 or Azure Stack Edge Pro GPU device to get it ready to deploy Azure Private 5G Core.

- [Commission an AKS cluster](commission-cluster.md)
