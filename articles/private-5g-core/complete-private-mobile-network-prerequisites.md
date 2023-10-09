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

To deploy your private mobile network using Azure Private 5G Core, you will need the following:

- A Windows PC with internet access
- A Windows Administrator account on that PC
- [Azure CLI](/cli/azure/install-azure-cli)
- [PowerShell](/powershell/scripting/install/installing-powershell-on-windows)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)

## Get access to Azure Private 5G Core for your Azure subscription

Contact your trials engineer and ask them to register your Azure subscription for access to Azure Private 5G Core. If you don't already have a trials engineer and are interested in trialing Azure Private 5G Core, contact your Microsoft account team, or express your interest through the [partner registration form](https://forms.office.com/r/4Q1yNRakXe).

## Choose the core technology type (5G or 4G)

Choose whether each site in the private mobile network should provide coverage for 5G or 4G user equipment (UEs). A single site can't support 5G and 4G UEs simultaneously. If you're deploying multiple sites, you can choose to have some sites support 5G UEs and others support 4G UEs.

## Allocate subnets and IP addresses

Azure Private 5G Core requires a management network, access network, and up to ten data networks. These networks can all be part of the same, larger network, or they can be separate. The approach you use depends on your traffic separation requirements.

For each of these networks, allocate a subnet and then identify the listed IP addresses. If you're deploying multiple sites, you'll need to collect this information for each site.

Depending on your networking requirements (for example, if a limited set of subnets is available), you may choose to allocate a single subnet for all of the Azure Stack Edge interfaces, marked with an asterisk (*) in the following list.

### Management network

:::zone pivot="ase-pro-2"

- Network address in Classless Inter-Domain Routing (CIDR) notation.
- Default gateway.
- One IP address for the management port (port 2) on the Azure Stack Edge Pro 2 device.
- Six sequential IP addresses for the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster nodes.
- One service IP address for accessing local monitoring tools for the packet core instance.

:::zone-end
:::zone pivot="ase-pro-gpu"

- Network address in Classless Inter-Domain Routing (CIDR) notation.
- Default gateway.
- One IP address for the management port
  - You'll choose a port between 2 and 4 to use as the Azure Stack Edge Pro GPU device's management port as part of [setting up your Azure Stack Edge Pro device](#order-and-set-up-your-azure-stack-edge-pro-devices).*
- Six sequential IP addresses for the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster nodes.
- One service IP address for accessing local monitoring tools for the packet core instance.

:::zone-end

### Access network

:::zone pivot="ase-pro-2"

- Network address in CIDR notation.
- Default gateway.
- One IP address for the control plane interface. For 5G, this interface is the N2 interface, whereas for 4G, it's the S1-MME interface.*
- One IP address for the user plane interface. For 5G, this interface is the N3 interface, whereas for 4G, it's the S1-U interface.*
- One IP address for port 3 on the Azure Stack Edge Pro 2 device.

:::zone-end

:::zone pivot="ase-pro-gpu"

- Network address in CIDR notation.
- Default gateway.
- One IP address for the control plane interface. For 5G, this interface is the N2 interface, whereas for 4G, it's the S1-MME interface.*
- One IP address for the user plane interface. For 5G, this interface is the N3 interface, whereas for 4G, it's the S1-U interface.*
- One IP address for port 5 on the Azure Stack Edge Pro GPU device.

:::zone-end

### Data networks

Allocate the following IP addresses for each data network in the site:

- Network address in CIDR notation.
- Default gateway.
- One IP address for the user plane interface. For 5G, this interface is the N6 interface, whereas for 4G, it's the SGi interface.*

The following IP addresses must be used by all the data networks in the site:
:::zone pivot="ase-pro-2"

- One IP address for all data networks on port 3 on the Azure Stack Edge Pro 2 device.
- One IP address for all data networks on port 4 on the Azure Stack Edge Pro 2 device.
:::zone-end
:::zone pivot="ase-pro-gpu"

- One IP address for all data networks on port 5 on the Azure Stack Edge Pro GPU device.
- One IP address for all data networks on port 6 on the Azure Stack Edge Pro GPU device.
:::zone-end

### VLANs

You can optionally configure your Azure Stack Edge Pro device with virtual local area network (VLAN) tags. You can use this to enable layer 2 traffic separation on the N2, N3 and N6 interfaces, or their 4G equivalents. For example, you might want to separate N2 and N3 traffic (which share a port on the ASE device) or separate traffic for each connected data network.

Allocate VLAN IDs for each network as required.

## Allocate user equipment (UE) IP address pools

Azure Private 5G Core supports the following IP address allocation methods for UEs.

- Dynamic. Dynamic IP address allocation automatically assigns a new IP address to a UE each time it connects to the private mobile network.

- Static. Static IP address allocation ensures that a UE receives the same IP address every time it connects to the private mobile network. This is useful when you want Internet of Things (IoT) applications to be able to consistently connect to the same device. For example, you may configure a video analysis application with the IP addresses of the cameras providing video streams. If these cameras have static IP addresses, you won't need to reconfigure the video analysis application with new IP addresses each time the cameras restart. You'll allocate static IP addresses to a UE as part of [provisioning its SIM](provision-sims-azure-portal.md).

You can choose to support one or both of these methods for each data network in your site.

For each data network you're deploying, do the following:

- Decide which IP address allocation methods you want to support.
- For each method you want to support, identify an IP address pool from which IP addresses can be allocated to UEs. You'll need to provide each IP address pool in CIDR notation.

    If you decide to support both methods for a particular data network, ensure that the IP address pools are of the same size and don't overlap.

- Decide whether you want to enable Network Address and Port Translation (NAPT) for the data network. NAPT allows you to translate a large pool of private IP addresses for UEs to a small number of public IP addresses. The translation is performed at the point where traffic enters the data network, maximizing the utility of a limited supply of public IP addresses.

## Configure Domain Name System (DNS) servers

> [!IMPORTANT]
> If you don't configure DNS servers for a data network, all UEs using that network will be unable to resolve domain names.

DNS allows the translation between human-readable domain names and their associated machine-readable IP addresses. Depending on your requirements, you have the following options for configuring a DNS server for your data network:

- If you need the UEs connected to this data network to resolve domain names, you must configure one or more DNS servers. You must use a private DNS server if you need DNS resolution of internal hostnames. If you're only providing internet access to public DNS names, you can use a public or private DNS server.
- If you don't need the UEs to perform DNS resolution, or if all UEs in the network will use their own locally configured DNS servers (instead of the DNS servers signaled to them by the packet core), you can omit this configuration.

## Prepare your networks

For each site you're deploying, do the following.
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
| 5671 In/Outbound    | Management (LAN) | Communication to Azure Event Hub, AMQP Protocol |
| 5672 In/Outbound    | Management (LAN) | Communication to Azure Event Hub, AMQP Protocol |
| SCTP 38412 Inbound   | Port 3 (Access network) | Control plane access signaling (N2 interface). </br>Only required for 5G deployments. |
| SCTP 36412 Inbound   | Port 3 (Access network) | Control plane access signaling (S1-MME interface). </br>Only required for 4G deployments. |
| UDP 2152 In/Outbound | Port 3 (Access network) | Access network user plane data (N3 interface for 5G, S1-U for 4G). |
| All IP traffic       | Ports 3 and 4 (Data networks)   | Data network user plane data (N6 interface for 5G, SGi for 4G). </br> Only required on port 3 if data networks are configured on that port. |

:::zone-end
:::zone pivot="ase-pro-gpu"
The following tables contains the ports you need to open for Azure Private 5G Core local access. This includes local management access and control plane signaling.

You must set these up in addition to the [ports required for Azure Stack Edge (ASE)](/azure/databox-online/azure-stack-edge-gpu-system-requirements#networking-port-requirements).

#### Azure Private 5G Core

| Port | ASE interface | Description|
|--|--|--|
| TCP 443 Inbound      | Management (LAN)        | Access to local monitoring tools (packet core dashboards and distributed tracing). |
| 5671 In/Outbound    | Management (LAN) | Communication to Azure Event Hub, AMQP Protocol |
| 5672 In/Outbound    | Management (LAN) | Communication to Azure Event Hub, AMQP Protocol |
| SCTP 38412 Inbound   | Port 5 (Access network) | Control plane access signaling (N2 interface). </br>Only required for 5G deployments. |
| SCTP 36412 Inbound   | Port 5 (Access network) | Control plane access signaling (S1-MME interface). </br>Only required for 4G deployments. |
| UDP 2152 In/Outbound | Port 5 (Access network) | Access network user plane data (N3 interface for 5G, S1-U for 4G). |
| All IP traffic       | Ports 5 and 6 (Data networks)   | Data network user plane data (N6 interface for 5G, SGi for 4G). </br> Only required on port 5 if data networks are configured on that port.  |
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

## Register resource providers and features

To use Azure Private 5G Core, you need to register some additional resource providers and features with your Azure subscription.

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

    If the CLI version is below 2.37.0, you will need to upgrade your Azure CLI to a newer version. See [How to update the Azure CLI](/cli/azure/update-azure-cli).
1. Register the following resource providers:

    ```azurecli
    az provider register --namespace Microsoft.MobileNetwork
    az provider register --namespace Microsoft.HybridNetwork
    az provider register --namespace Microsoft.ExtendedLocation
    az provider register --namespace Microsoft.Kubernetes
    az provider register --namespace Microsoft.KubernetesConfiguration
    ```

1. Register the following features:

    ```azurecli
    az feature register --name allowVnfCustomer --namespace Microsoft.HybridNetwork
    az feature register --name previewAccess --namespace  Microsoft.Kubernetes
    az feature register --name sourceControlConfiguration --namespace  Microsoft.KubernetesConfiguration
    az feature register --name extensions --namespace  Microsoft.KubernetesConfiguration
    az feature register --name CustomLocations-ppauto --namespace  Microsoft.ExtendedLocation
    ```

## Retrieve the Object ID (OID)

You need to obtain the object ID (OID) of the custom location resource provider in your Azure tenant. You will need to provide this OID when you create the Kubernetes service. You can obtain the OID using the Azure CLI or the Azure Cloud Shell on the portal. You'll need to be an owner of your Azure subscription.

1. Sign in to the Azure CLI or Azure Cloud Shell.
1. Retrieve the OID:

    ```azurecli
    az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv
    ```

This command queries the custom location and will output an OID string.  Save this string for use later when you're commissioning the Azure Stack Edge device.

## Order and set up your Azure Stack Edge Pro device(s)

Do the following for each site you want to add to your private mobile network. Detailed instructions for how to carry out each step are included in the **Detailed instructions** column where applicable.

:::zone pivot="ase-pro-2"
| Step No. | Description | Detailed instructions |
|--|--|--|
| 1. | Complete the Azure Stack Edge Pro 2 deployment checklist.| [Deployment checklist for your Azure Stack Edge Pro 2 device](/azure/databox-online/azure-stack-edge-pro-2-deploy-checklist?pivots=single-node)|
| 2. | Order and prepare your Azure Stack Edge Pro 2 device. | [Tutorial: Prepare to deploy Azure Stack Edge Pro 2](../databox-online/azure-stack-edge-pro-2-deploy-prep.md) |
| 3. | Rack and cable your Azure Stack Edge Pro 2 device. </br></br>When carrying out this procedure, you must ensure that the device has its ports connected as follows:</br></br>- Port 2 - management</br>- Port 3 - access network (and optionally, data networks)</br>- Port 4 - data networks| [Tutorial: Install Azure Stack Edge Pro 2](/azure/databox-online/azure-stack-edge-pro-2-deploy-install?pivots=single-node.md) |
| 4. | Connect to your Azure Stack Edge Pro 2 device using the local web UI. | [Tutorial: Connect to Azure Stack Edge Pro 2](/azure/databox-online/azure-stack-edge-pro-2-deploy-connect?pivots=single-node.md) |
| 5. | Configure the network for your Azure Stack Edge Pro 2 device. </br> </br> **Note:** When an ASE is used in an Azure Private 5G Core service, Port 2 is used for management rather than data. The tutorial linked assumes a generic ASE that uses Port 2 for data.</br></br> In addition, you can optionally configure your Azure Stack Edge Pro device to run behind a web proxy. </br></br> Verify the outbound connections from Azure Stack Edge Pro device to the Azure Arc endpoints are opened.  </br></br>**Do not** configure virtual switches, virtual networks or compute IPs. | [Tutorial: Configure network for Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy?pivots=single-node.md)</br></br>[(Optionally) Configure web proxy for Azure Stack Edge Pro](/azure/databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy?pivots=single-node#configure-web-proxy)</br></br>[Azure Arc Network Requirements](/azure/azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli%2Cazure-cloud)</br></br>[Azure Arc Agent Network Requirements](/azure/architecture/hybrid/arc-hybrid-kubernetes)|
| 6. | Configure a name, DNS name, and (optionally) time settings. </br></br>**Do not** configure an update. | [Tutorial: Configure the device settings for Azure Stack Edge Pro 2](../databox-online/azure-stack-edge-pro-2-deploy-set-up-device-update-time.md) |
| 7. | Configure certificates and configure encryption-at-rest for your Azure Stack Edge Pro 2 device. After changing the certificates, you may have to reopen the local UI in a new browser window to prevent the old cached certificates from causing problems.| [Tutorial: Configure certificates for your Azure Stack Edge Pro 2](/azure/databox-online/azure-stack-edge-pro-2-deploy-configure-certificates?pivots=single-node) |
| 8. | Activate your Azure Stack Edge Pro 2 device. </br></br>**Do not** follow the section to *Deploy Workloads*. | [Tutorial: Activate Azure Stack Edge Pro 2](../databox-online/azure-stack-edge-pro-2-deploy-activate.md) |
| 9. | Enable VM management from the Azure portal. </br></br>Enabling this immediately after activating the Azure Stack Edge Pro 2 device occasionally causes an error. Wait one minute and retry.   | Navigate to the ASE resource in the Azure portal, go to **Edge services**, select **Virtual machines** and select **Enable**.   |
| 10. | Run the diagnostics tests for the Azure Stack Edge Pro 2 device in the local web UI, and verify they all pass. </br></br>You may see a warning about a disconnected, unused port. You should fix the issue if the warning relates to any of these ports:</br></br>- Port 2 - management</br>- Port 3 - access network (and optionally, data networks)</br>- Port 4 - data networks</br></br>For all other ports, you can ignore the warning. </br></br>If there are any errors, resolve them before continuing with the remaining steps. This includes any errors related to invalid gateways on unused ports. In this case, either delete the gateway IP address or set it to a valid gateway for the subnet. | [Run diagnostics, collect logs to troubleshoot Azure Stack Edge device issues](../databox-online/azure-stack-edge-gpu-troubleshoot.md) |

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
| 5. | Configure the network for your Azure Stack Edge Pro GPU device.</br> </br> **Note:** When an ASE is used in an Azure Private 5G Core service, Port 2 is used for management rather than data. The tutorial linked assumes a generic ASE that uses Port 2 for data.</br></br> In addition, you can optionally configure your Azure Stack Edge Pro GPU device to run behind a web proxy. </br></br> Verify the outbound connections from Azure Stack Edge Pro GPU device to the Azure Arc endpoints are opened.  </br></br>**Do not** configure virtual switches, virtual networks or compute IPs. | [Tutorial: Configure network for Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy?pivots=single-node.md)</br></br>[(Optionally) Configure web proxy for Azure Stack Edge Pro](/azure/databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy?pivots=single-node#configure-web-proxy)</br></br>[Azure Arc Network Requirements](/azure/azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli%2Cazure-cloud)</br></br>[Azure Arc Agent Network Requirements](/azure/architecture/hybrid/arc-hybrid-kubernetes)|
| 6. | Configure a name, DNS name, and (optionally) time settings. </br></br>**Do not** configure an update. | [Tutorial: Configure the device settings for Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-set-up-device-update-time.md) |
| 7. | Configure certificates for your Azure Stack Edge Pro GPU device. After changing the certificates, you may have to reopen the local UI in a new browser window to prevent the old cached certificates from causing problems.| [Tutorial: Configure certificates for your Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-configure-certificates?pivots=single-node) |
| 8. | Activate your Azure Stack Edge Pro GPU device. </br></br>**Do not** follow the section to *Deploy Workloads*. | [Tutorial: Activate Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-activate.md) |
| 9. | Enable VM management from the Azure portal. </br></br>Enabling this immediately after activating the Azure Stack Edge Pro device occasionally causes an error. Wait one minute and retry.   | Navigate to the ASE resource in the Azure portal, go to **Edge services**, select **Virtual machines** and select **Enable**.   |
| 10. | Run the diagnostics tests for the Azure Stack Edge Pro GPU device in the local web UI, and verify they all pass. </br></br>You may see a warning about a disconnected, unused port. You should fix the issue if the warning relates to any of these ports:</br></br>- Port 5.</br>- Port 6.</br>- The port you chose to connect to the management network in Step 3.</br></br>For all other ports, you can ignore the warning. </br></br>If there are any errors, resolve them before continuing with the remaining steps. This includes any errors related to invalid gateways on unused ports. In this case, either delete the gateway IP address or set it to a valid gateway for the subnet. | [Run diagnostics, collect logs to troubleshoot Azure Stack Edge device issues](../databox-online/azure-stack-edge-gpu-troubleshoot.md) |

> [!IMPORTANT]
> You must ensure your Azure Stack Edge Pro GPU device is compatible with the Azure Private 5G Core version you plan to install. See [Packet core and Azure Stack Edge (ASE) compatibility](./azure-stack-edge-packet-core-compatibility.md). If you need to upgrade your Azure Stack Edge Pro GPU device, see [Update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md?tabs=version-2106-and-later).

:::zone-end

## Next steps

You can now commission the Azure Kubernetes Service (AKS) cluster on your Azure Stack Edge Pro 2 or Azure Stack Edge Pro GPU device to get it ready to deploy Azure Private 5G Core.

- [Commission an AKS cluster](commission-cluster.md)
