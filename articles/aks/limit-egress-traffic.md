---
title: Restrict egress traffic in Azure Kubernetes Service (AKS)
description: Learn what ports and addresses are required to control egress traffic in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.author: jpalma
ms.date: 06/29/2020
author: palma21

#Customer intent: As an cluster operator, I want to restrict egress traffic for nodes to only access defined ports and addresses and improve cluster security.
---

# Control egress traffic for cluster nodes in Azure Kubernetes Service (AKS)

This article provides the necessary details that allow you to secure outbound traffic from your Azure Kubernetes Service (AKS). It contains the cluster requirements for a base AKS deployment, and additional requirements for optional addons and features. [An example will be provided at the end on how to configure these requirements with Azure Firewall](#restrict-egress-traffic-using-azure-firewall). However, you can apply this information to any outbound restriction method or appliance.

## Background

AKS clusters are deployed on a virtual network. This network can be managed (created by AKS) or custom (pre-configured by the user beforehand). In either case, the cluster has **outbound** dependencies on services outside of that virtual network (the service has no inbound dependencies).

For management and operational purposes, nodes in an AKS cluster need to access certain ports and fully qualified domain names (FQDNs). These endpoints are required for the nodes to communicate with the API server, or to download and install core Kubernetes cluster components and node security updates. For example, the cluster needs to pull base system container images from Microsoft Container Registry (MCR).

The AKS outbound dependencies are almost entirely defined with FQDNs, which don't have static addresses behind them. The lack of static addresses means that Network Security Groups can't be used to lock down the outbound traffic from an AKS cluster. 

By default, AKS clusters have unrestricted outbound (egress) internet access. This level of network access allows nodes and services you run to access external resources as needed. If you wish to restrict egress traffic, a limited number of ports and addresses must be accessible to maintain healthy cluster maintenance tasks. The simplest solution to securing outbound addresses lies in use of a firewall device that can control outbound traffic based on domain names. Azure Firewall, for example, can restrict outbound HTTP and HTTPS traffic based on the FQDN of the destination. You can also configure your preferred firewall and security rules to allow these required ports and addresses.

> [!IMPORTANT]
> This document covers only how to lock down the traffic leaving the AKS subnet. AKS has no ingress requirements by default.  Blocking **internal subnet traffic** using network security groups (NSGs) and firewalls is not supported. To control and block the traffic within the cluster, use [***Network Policies***][network-policy].

## Required outbound network rules and FQDNs for AKS clusters

The following network and FQDN/application rules are required for an AKS cluster, you can use them if you wish to configure a solution other than Azure Firewall.

* IP Address dependencies are for non-HTTP/S traffic (both TCP and UDP traffic)
* FQDN HTTP/HTTPS endpoints can be placed in your firewall device.
* Wildcard HTTP/HTTPS endpoints are dependencies that can vary with your AKS cluster based on a number of qualifiers.
* AKS uses an admission controller to inject the FQDN as an environment variable to all deployments under kube-system and gatekeeper-system, that ensures all system communication between nodes and API server uses the API server FQDN and not the API server IP. 
* If you have an app or solution that needs to talk to the API server, you must add an **additional** network rule to allow *TCP communication to port 443 of your API server's IP*.
* On rare occasions, if there's a maintenance operation your API server IP might change. Planned maintenance operations that can change the API server IP are always communicated in advance.


### Azure Global required network rules

The required network rules and IP address dependencies are:

| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| **`*:1194`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:1194`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:1194`** <br/> *Or* <br/> **`APIServerIP:1194`** `(only known after cluster creation)`  | UDP           | 1194      | For tunneled secure communication between the nodes and the control plane. |
| **`*:9000`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:9000`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:9000`** <br/> *Or* <br/> **`APIServerIP:9000`** `(only known after cluster creation)`  | TCP           | 9000      | For tunneled secure communication between the nodes and the control plane. |
| **`*:123`** or **`ntp.ubuntu.com:123`** (if using Azure Firewall network rules)  | UDP      | 123     | Required for Network Time Protocol (NTP) time synchronization on Linux nodes.                 |
| **`CustomDNSIP:53`** `(if using custom DNS servers)`                             | UDP      | 53      | If you're using custom DNS servers, you must ensure they're accessible by the cluster nodes. |
| **`APIServerIP:443`** `(if running pods/deployments that access the API Server)` | TCP      | 443     | Required if running pods/deployments that access the API Server, those pods/deployments would use the API IP.  |

### Azure Global required FQDN / application rules 

The following FQDN / application rules are required:

| Destination FQDN                 | Port            | Use      |
|----------------------------------|-----------------|----------|
| **`*.hcp.<location>.azmk8s.io`** | **`HTTPS:443`** | Required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed. |
| **`mcr.microsoft.com`**          | **`HTTPS:443`** | Required to access images in Microsoft Container Registry (MCR). This registry contains first-party images/charts (for example, coreDNS, etc.). These images are required for the correct creation and functioning of the cluster, including scale and upgrade operations.  |
| **`*.cdn.mscr.io`**              | **`HTTPS:443`** | Required for MCR storage backed by the Azure Content Delivery Network (CDN). |
| **`*.data.mcr.microsoft.com`**   | **`HTTPS:443`** | Required for MCR storage backed by the Azure content delivery network (CDN). |
| **`management.azure.com`**       | **`HTTPS:443`** | Required for Kubernetes operations against the Azure API. |
| **`login.microsoftonline.com`**  | **`HTTPS:443`** | Required for Azure Active Directory authentication. |
| **`packages.microsoft.com`**     | **`HTTPS:443`** | This address is the Microsoft packages repository used for cached *apt-get* operations.  Example packages include Moby, PowerShell, and Azure CLI. |
| **`acs-mirror.azureedge.net`**   | **`HTTPS:443`** | This address is for the repository required to download and install required binaries like kubenet and Azure CNI. |

### Azure China 21Vianet required network rules

The required network rules and IP address dependencies are:

| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| **`*:1194`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.Region:1194`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:1194`** <br/> *Or* <br/> **`APIServerIP:1194`** `(only known after cluster creation)`  | UDP           | 1194      | For tunneled secure communication between the nodes and the control plane. |
| **`*:9000`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:9000`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:9000`** <br/> *Or* <br/> **`APIServerIP:9000`** `(only known after cluster creation)`  | TCP           | 9000      | For tunneled secure communication between the nodes and the control plane. |
| **`*:22`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:22`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:22`** <br/> *Or* <br/> **`APIServerIP:22`** `(only known after cluster creation)`  | TCP           | 22      | For tunneled secure communication between the nodes and the control plane. |
| **`*:123`** or **`ntp.ubuntu.com:123`** (if using Azure Firewall network rules)  | UDP      | 123     | Required for Network Time Protocol (NTP) time synchronization on Linux nodes.                 |
| **`CustomDNSIP:53`** `(if using custom DNS servers)`                             | UDP      | 53      | If you're using custom DNS servers, you must ensure they're accessible by the cluster nodes. |
| **`APIServerIP:443`** `(if running pods/deployments that access the API Server)` | TCP      | 443     | Required if running pods/deployments that access the API Server, those pod/deployments would use the API IP.  |

### Azure China 21Vianet required FQDN / application rules

The following FQDN / application rules are required:

| Destination FQDN                               | Port            | Use      |
|------------------------------------------------|-----------------|----------|
| **`*.hcp.<location>.cx.prod.service.azk8s.cn`**| **`HTTPS:443`** | Required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed. |
| **`*.tun.<location>.cx.prod.service.azk8s.cn`**| **`HTTPS:443`** | Required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed. |
| **`mcr.microsoft.com`**                        | **`HTTPS:443`** | Required to access images in Microsoft Container Registry (MCR). This registry contains first-party images/charts (for example, coreDNS, etc.). These images are required for the correct creation and functioning of the cluster, including scale and upgrade operations. |
| **`*.cdn.mscr.io`**                            | **`HTTPS:443`** | Required for MCR storage backed by the Azure Content Delivery Network (CDN). |
| **`.data.mcr.microsoft.com`**                  | **`HTTPS:443`** | Required for MCR storage backed by the Azure Content Delivery Network (CDN). |
| **`management.chinacloudapi.cn`**              | **`HTTPS:443`** | Required for Kubernetes operations against the Azure API. |
| **`login.chinacloudapi.cn`**                   | **`HTTPS:443`** | Required for Azure Active Directory authentication. |
| **`packages.microsoft.com`**                   | **`HTTPS:443`** | This address is the Microsoft packages repository used for cached *apt-get* operations.  Example packages include Moby, PowerShell, and Azure CLI. |
| **`*.azk8s.cn`**                               | **`HTTPS:443`** | This address is for the repository required to download and install required binaries like kubenet and Azure CNI. |

### Azure US Government required network rules

The required network rules and IP address dependencies are:

| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| **`*:1194`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:1194`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:1194`** <br/> *Or* <br/> **`APIServerIP:1194`** `(only known after cluster creation)`  | UDP           | 1194      | For tunneled secure communication between the nodes and the control plane. |
| **`*:9000`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:9000`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:9000`** <br/> *Or* <br/> **`APIServerIP:9000`** `(only known after cluster creation)`  | TCP           | 9000      | For tunneled secure communication between the nodes and the control plane. |
| **`*:123`** or **`ntp.ubuntu.com:123`** (if using Azure Firewall network rules)  | UDP      | 123     | Required for Network Time Protocol (NTP) time synchronization on Linux nodes.                 |
| **`CustomDNSIP:53`** `(if using custom DNS servers)`                             | UDP      | 53      | If you're using custom DNS servers, you must ensure they're accessible by the cluster nodes. |
| **`APIServerIP:443`** `(if running pods/deployments that access the API Server)` | TCP      | 443     | Required if running pods/deployments that access the API Server, those pods/deployments would use the API IP.  |

### Azure US Government required FQDN / application rules 

The following FQDN / application rules are required:

| Destination FQDN                                        | Port            | Use      |
|---------------------------------------------------------|-----------------|----------|
| **`*.hcp.<location>.cx.aks.containerservice.azure.us`** | **`HTTPS:443`** | Required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed.|
| **`mcr.microsoft.com`**                                 | **`HTTPS:443`** | Required to access images in Microsoft Container Registry (MCR). This registry contains first-party images/charts (for example, coreDNS, etc.). These images are required for the correct creation and functioning of the cluster, including scale and upgrade operations. |
| **`*.cdn.mscr.io`**                                     | **`HTTPS:443`** | Required for MCR storage backed by the Azure Content Delivery Network (CDN). |
| **`*.data.mcr.microsoft.com`**                          | **`HTTPS:443`** | Required for MCR storage backed by the Azure content delivery network (CDN). |
| **`management.usgovcloudapi.net`**                      | **`HTTPS:443`** | Required for Kubernetes operations against the Azure API. |
| **`login.microsoftonline.us`**                          | **`HTTPS:443`** | Required for Azure Active Directory authentication. |
| **`packages.microsoft.com`**                            | **`HTTPS:443`** | This address is the Microsoft packages repository used for cached *apt-get* operations.  Example packages include Moby, PowerShell, and Azure CLI. |
| **`acs-mirror.azureedge.net`**                          | **`HTTPS:443`** | This address is for the repository required to install required binaries like kubenet and Azure CNI. |

## Optional recommended FQDN / application rules for AKS clusters

The following FQDN / application rules are optional but recommended for AKS clusters:

| Destination FQDN                                                               | Port          | Use      |
|--------------------------------------------------------------------------------|---------------|----------|
| **`security.ubuntu.com`, `azure.archive.ubuntu.com`, `changelogs.ubuntu.com`** | **`HTTP:80`** | This address lets the Linux cluster nodes download the required security patches and updates. |

If you choose to block/not allow these FQDNs, the nodes will only receive OS updates when you do a [node image upgrade](node-image-upgrade.md) or [cluster upgrade](upgrade-cluster.md).

## GPU enabled AKS clusters

### Required FQDN / application rules

The following FQDN / application rules are required for AKS clusters that have GPU enabled:

| Destination FQDN                        | Port      | Use      |
|-----------------------------------------|-----------|----------|
| **`nvidia.github.io`**                  | **`HTTPS:443`** | This address is used for correct driver installation and operation on GPU-based nodes. |
| **`us.download.nvidia.com`**            | **`HTTPS:443`** | This address is used for correct driver installation and operation on GPU-based nodes. |
| **`apt.dockerproject.org`**             | **`HTTPS:443`** | This address is used for correct driver installation and operation on GPU-based nodes. |

## Windows Server based node pools 

### Required FQDN / application rules

The following FQDN / application rules are required for using Windows Server based node pools:

| Destination FQDN                                                           | Port      | Use      |
|----------------------------------------------------------------------------|-----------|----------|
| **`onegetcdn.azureedge.net, go.microsoft.com`**                            | **`HTTPS:443`** | To install windows-related binaries |
| **`*.mp.microsoft.com, www.msftconnecttest.com, ctldl.windowsupdate.com`** | **`HTTP:80`**   | To install windows-related binaries |

## AKS addons and integrations

### Azure Monitor for containers

There are two options to provide access to Azure Monitor for containers, you may allow the Azure Monitor [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) **or** provide access to the required FQDN/Application Rules.

#### Required network rules

The following FQDN / application rules are required:

| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureMonitor:443`**  | TCP           | 443      | This endpoint is used to send metrics data and logs to Azure Monitor and Log Analytics. |

#### Required FQDN / application rules

The following FQDN / application rules are required for AKS clusters that have the Azure Monitor for containers enabled:

| FQDN                                    | Port      | Use      |
|-----------------------------------------|-----------|----------|
| dc.services.visualstudio.com | **`HTTPS:443`**    | This endpoint is used for metrics and monitoring telemetry using Azure Monitor. |
| *.ods.opinsights.azure.com    | **`HTTPS:443`**    | This endpoint is used by Azure Monitor for ingesting log analytics data. |
| *.oms.opinsights.azure.com | **`HTTPS:443`** | This endpoint is used by omsagent, which is used to authenticate the log analytics service. |
| *.monitoring.azure.com | **`HTTPS:443`** | This endpoint is used to send metrics data to Azure Monitor. |

### Azure Dev Spaces

Update your firewall or security configuration to allow network traffic to and from the all of the below FQDNs and [Azure Dev Spaces infrastructure services][dev-spaces-service-tags].

#### Required network rules

| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureDevSpaces`**  | TCP           | 443      | This endpoint is used to send metrics data and logs to Azure Monitor and Log Analytics. |

#### Required FQDN / application rules 

The following FQDN / application rules are required for AKS clusters that have the Azure Dev Spaces enabled:

| FQDN                                    | Port      | Use      |
|-----------------------------------------|-----------|----------|
| `cloudflare.docker.com` | **`HTTPS:443`** | This address is used to pull linux alpine and other Azure Dev Spaces images |
| `gcr.io` | **`HTTPS:443`** | This address is used to pull helm/tiller images |
| `storage.googleapis.com` | **`HTTPS:443`** | This address is used to pull helm/tiller images |


### Azure Policy (preview)

> [!CAUTION]
> Some of the features below are in preview.  The suggestions in this article are subject to change as the feature moves to public preview and future release stages.

#### Required FQDN / application rules 

The following FQDN / application rules are required for AKS clusters that have the Azure Policy enabled.

| FQDN                                          | Port      | Use      |
|-----------------------------------------------|-----------|----------|
| **`gov-prod-policy-data.trafficmanager.net`** | **`HTTPS:443`** | This address is used for correct operation of Azure Policy. (currently in preview in AKS) |
| **`raw.githubusercontent.com`**               | **`HTTPS:443`** | This address is used to pull the built-in policies from GitHub to ensure correct operation of Azure Policy. (currently in preview in AKS) |
| **`dc.services.visualstudio.com`**            | **`HTTPS:443`** | Azure Policy add-on that sends telemetry data to applications insights endpoint. |


## Restrict egress traffic using Azure firewall

Azure Firewall provides an Azure Kubernetes Service (`AzureKubernetesService`) FQDN Tag to simplify this configuration. 

> [!NOTE]
> The FQDN tag contains all the FQDNs listed above and is kept automatically up to date.

Below is an example architecture of the deployment:

![Locked down topology](media/limit-egress-traffic/aks-azure-firewall-egress.png)

* Public Ingress is forced to flow through firewall filters
  * AKS agent nodes are isolated in a dedicated subnet.
  * [Azure Firewall](../firewall/overview.md) is deployed in its own subnet.
  * A DNAT rule translates the FW public IP into the LB frontend IP.
* Outbound requests start from agent nodes to the Azure Firewall internal IP using a [user-defined route](egress-outboundtype.md)
  * Requests from AKS agent nodes follow a UDR that has been placed on the subnet the AKS cluster was deployed into.
  * Azure Firewall egresses out of the virtual network from a public IP frontend
  * Access to the public internet or other Azure services flows to and from the firewall frontend IP address
  * Optionally, access to the AKS control plane is protected by [API server Authorized IP ranges](https://docs.microsoft.com/azure/aks/api-server-authorized-ip-ranges), which includes the firewall public frontend IP address.
* Internal Traffic
  * Optionally, instead or in addition to a [Public Load Balancer](load-balancer-standard.md) you can use an [Internal Load Balancer](internal-lb.md) for internal traffic, which you could isolate on its own subnet as well.


The below steps make use of Azure Firewall's `AzureKubernetesService` FQDN tag to restrict the outbound traffic from the AKS cluster and provide an example how to configure public inbound traffic via the firewall.


### Set configuration via environment variables

Define a set of environment variables to be used in resource creations.

```bash
PREFIX="aks-egress"
RG="${PREFIX}-rg"
LOC="eastus"
PLUGIN=azure
AKSNAME="${PREFIX}"
VNET_NAME="${PREFIX}-vnet"
AKSSUBNET_NAME="aks-subnet"
# DO NOT CHANGE FWSUBNET_NAME - This is currently a requirement for Azure Firewall.
FWSUBNET_NAME="AzureFirewallSubnet"
FWNAME="${PREFIX}-fw"
FWPUBLICIP_NAME="${PREFIX}-fwpublicip"
FWIPCONFIG_NAME="${PREFIX}-fwconfig"
FWROUTE_TABLE_NAME="${PREFIX}-fwrt"
FWROUTE_NAME="${PREFIX}-fwrn"
FWROUTE_NAME_INTERNET="${PREFIX}-fwinternet"
```

### Create a virtual network with multiple subnets

Provision a virtual network with two separate subnets, one for the cluster, one for the firewall. Optionally you could also create one for internal service ingress.

![Empty network topology](media/limit-egress-traffic/empty-network.png)

Create a resource group to hold all of the resources.

```azure-cli
# Create Resource Group

az group create --name $RG --location $LOC
```

Create a virtual network with two subnets to host the AKS cluster and the Azure Firewall. Each will have their own subnet. Let's start with the AKS network.

```
# Dedicated virtual network with AKS subnet

az network vnet create \
    --resource-group $RG \
    --name $VNET_NAME \
    --address-prefixes 10.42.0.0/16 \
    --subnet-name $AKSSUBNET_NAME \
    --subnet-prefix 10.42.1.0/24

# Dedicated subnet for Azure Firewall (Firewall name cannot be changed)

az network vnet subnet create \
    --resource-group $RG \
    --vnet-name $VNET_NAME \
    --name $FWSUBNET_NAME \
    --address-prefix 10.42.2.0/24
```

### Create and set up an Azure Firewall with a UDR

Azure Firewall inbound and outbound rules must be configured. The main purpose of the firewall is to enable organizations to configure granular ingress and egress traffic rules into and out of the AKS Cluster.

![Firewall and UDR](media/limit-egress-traffic/firewall-udr.png)


> [!IMPORTANT]
> If your cluster or application creates a large number of outbound connections directed to the same or small subset of destinations, you might require more firewall frontend IPs to avoid maxing out the ports per frontend IP.
> For more information on how to create an Azure firewall with multiple IPs, see [**here**](../firewall/quick-create-multiple-ip-template.md)

Create a standard SKU public IP resource that will be used as the Azure Firewall frontend address.

```azure-cli
az network public-ip create -g $RG -n $FWPUBLICIP_NAME -l $LOC --sku "Standard"
```

Register the preview cli-extension to create an Azure Firewall.
```azure-cli
# Install Azure Firewall preview CLI extension

az extension add --name azure-firewall

# Deploy Azure Firewall

az network firewall create -g $RG -n $FWNAME -l $LOC --enable-dns-proxy true
```
The IP address created earlier can now be assigned to the firewall frontend.

> [!NOTE]
> Set up of the public IP address to the Azure Firewall may take a few minutes.
> To leverage FQDN on network rules we need DNS proxy enabled, when enabled the firewall will listen on port 53 and will forward DNS requests to the DNS server specified above. This will allow the firewall to translate that FQDN automatically.

```azure-cli
# Configure Firewall IP Config

az network firewall ip-config create -g $RG -f $FWNAME -n $FWIPCONFIG_NAME --public-ip-address $FWPUBLICIP_NAME --vnet-name $VNET_NAME
```

When the previous command has succeeded, save the firewall frontend IP address for configuration later.

```bash
# Capture Firewall IP Address for Later Use

FWPUBLIC_IP=$(az network public-ip show -g $RG -n $FWPUBLICIP_NAME --query "ipAddress" -o tsv)
FWPRIVATE_IP=$(az network firewall show -g $RG -n $FWNAME --query "ipConfigurations[0].privateIpAddress" -o tsv)
```

> [!NOTE]
> If you use secure access to the AKS API server with [authorized IP address ranges](https://docs.microsoft.com/azure/aks/api-server-authorized-ip-ranges), you need to add the firewall public IP into the authorized IP range.

### Create a UDR with a hop to Azure Firewall

Azure automatically routes traffic between Azure subnets, virtual networks, and on-premises networks. If you want to change any of Azure's default routing, you do so by creating a route table.

Create an empty route table to be associated with a given subnet. The route table will define the next hop as the Azure Firewall created above. Each subnet can have zero or one route table associated to it.

```azure-cli
# Create UDR and add a route for Azure Firewall

az network route-table create -g $RG --name $FWROUTE_TABLE_NAME
az network route-table route create -g $RG --name $FWROUTE_NAME --route-table-name $FWROUTE_TABLE_NAME --address-prefix 0.0.0.0/0 --next-hop-type VirtualAppliance --next-hop-ip-address $FWPRIVATE_IP --subscription $SUBID
az network route-table route create -g $RG --name $FWROUTE_NAME_INTERNET --route-table-name $FWROUTE_TABLE_NAME --address-prefix $FWPUBLIC_IP/32 --next-hop-type Internet
```

See [virtual network route table documentation](../virtual-network/virtual-networks-udr-overview.md#user-defined) about how you can override Azure's default system routes or add additional routes to a subnet's route table.

### Adding firewall rules

Below are three network rules you can use to configure on your firewall, you may need to adapt these rules based on your deployment. The first rule allows access to port 9000 via TCP. The second rule allows access to port 1194 and 123 via UDP (if you're deploying to Azure China 21Vianet, you might require [more](#azure-china-21vianet-required-network-rules)). Both these rules will only allow traffic destined to the Azure Region CIDR that we're using, in this case East US. 
Finally, we'll add a third network rule opening port 123 to `ntp.ubuntu.com` FQDN via UDP (adding an FQDN as a network rule is one of the specific features of Azure Firewall, and you'll need to adapt it when using your own options).

After setting the network rules, we'll also add an application rule using the `AzureKubernetesService` that covers all needed FQDNs accessible through TCP port 443 and port 80.

```
# Add FW Network Rules

az network firewall network-rule create -g $RG -f $FWNAME --collection-name 'aksfwnr' -n 'apiudp' --protocols 'UDP' --source-addresses '*' --destination-addresses "AzureCloud.$LOC" --destination-ports 1194 --action allow --priority 100
az network firewall network-rule create -g $RG -f $FWNAME --collection-name 'aksfwnr' -n 'apitcp' --protocols 'TCP' --source-addresses '*' --destination-addresses "AzureCloud.$LOC" --destination-ports 9000
az network firewall network-rule create -g $RG -f $FWNAME --collection-name 'aksfwnr' -n 'time' --protocols 'UDP' --source-addresses '*' --destination-fqdns 'ntp.ubuntu.com' --destination-ports 123

# Add FW Application Rules

az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'fqdn' --source-addresses '*' --protocols 'http=80' 'https=443' --fqdn-tags "AzureKubernetesService" --action allow --priority 100
```

See [Azure Firewall documentation](https://docs.microsoft.com/azure/firewall/overview) to learn more about the Azure Firewall service.

### Associate the route table to AKS

To associate the cluster with the firewall, the dedicated subnet for the cluster's subnet must reference the route table created above. Association can be done by issuing a command to the virtual network holding both the cluster and firewall to update the route table of the cluster's subnet.

```azure-cli
# Associate route table with next hop to Firewall to the AKS subnet

az network vnet subnet update -g $RG --vnet-name $VNET_NAME --name $AKSSUBNET_NAME --route-table $FWROUTE_TABLE_NAME
```

### Deploy AKS with outbound type of UDR to the existing network

Now an AKS cluster can be deployed into the existing virtual network. We'll also use [outbound type `userDefinedRouting`](egress-outboundtype.md), this feature ensures any outbound traffic will be forced through the firewall and no other egress paths will exist (by default the Load Balancer outbound type could be used).

![aks-deploy](media/limit-egress-traffic/aks-udr-fw.png)

### Create a service principal with access to provision inside the existing virtual network

A service principal is used by AKS to create cluster resources. The service principal that is passed at create time is used to create underlying AKS resources such as Storage resources, IPs and Load Balancers used by AKS (you may also use a [managed identity](use-managed-identity.md) instead). If not granted the appropriate permissions below, you won't be able to provision the AKS Cluster.

```azure-cli
# Create SP and Assign Permission to Virtual Network

az ad sp create-for-rbac -n "${PREFIX}sp" --skip-assignment
```

Now replace the `APPID` and `PASSWORD` below with the service principal appid and service principal password autogenerated by the previous command output. We'll reference the VNET resource ID to grant the permissions to the service principal so AKS can deploy resources into it.

```azure-cli
APPID="<SERVICE_PRINCIPAL_APPID_GOES_HERE>"
PASSWORD="<SERVICEPRINCIPAL_PASSWORD_GOES_HERE>"
VNETID=$(az network vnet show -g $RG --name $VNET_NAME --query id -o tsv)

# Assign SP Permission to VNET

az role assignment create --assignee $APPID --scope $VNETID --role "Network Contributor"
```

You can check the detailed permissions that are required [here](kubernetes-service-principal.md#delegate-access-to-other-azure-resources).

> [!NOTE]
> If you're using the kubenet network plugin, you'll need to give the AKS service principal or managed identity permissions to the pre-created route table, since kubenet requires a route table to add neccesary routing rules. 
> ```azurecli-interactive
> RTID=$(az network route-table show -g $RG -n $FWROUTE_TABLE_NAME --query id -o tsv)
> az role assignment create --assignee $APPID --scope $RTID --role "Network Contributor"
> ```

### Deploy AKS

Finally, the AKS cluster can be deployed into the existing subnet we've dedicated for the cluster. The target subnet to be deployed into is defined with the environment variable, `$SUBNETID`. We didn't define the `$SUBNETID` variable in the previous steps. To set the value for the subnet ID, you can use the following command:

```azurecli
SUBNETID=$(az network vnet subnet show -g $RG --vnet-name $VNET_NAME --name $AKSSUBNET_NAME --query id -o tsv)
```

You'll define the outbound type to use the UDR that already exists on the subnet. This configuration will enable AKS to skip the setup and IP provisioning for the load balancer.

> [!IMPORTANT]
> For more information on outbound type UDR including limitations, see [**egress outbound type UDR**](egress-outboundtype.md#limitations).


> [!TIP]
> Additional features can be added to the cluster deployment such as [**Private Cluster**](private-clusters.md). 
>
> The AKS feature for [**API server authorized IP ranges**](api-server-authorized-ip-ranges.md) can be added to limit API server access to only the firewall's public endpoint. The authorized IP ranges feature is denoted in the diagram as optional. When enabling the authorized IP range feature to limit API server access, your developer tools must use a jumpbox from the firewall's virtual network or you must add all developer endpoints to the authorized IP range.

```azure-cli
az aks create -g $RG -n $AKSNAME -l $LOC \
  --node-count 3 --generate-ssh-keys \
  --network-plugin $PLUGIN \
  --outbound-type userDefinedRouting \
  --service-cidr 10.41.0.0/16 \
  --dns-service-ip 10.41.0.10 \
  --docker-bridge-address 172.17.0.1/16 \
  --vnet-subnet-id $SUBNETID \
  --service-principal $APPID \
  --client-secret $PASSWORD \
  --api-server-authorized-ip-ranges $FWPUBLIC_IP
```

### Enable developer access to the API server

If you used authorized IP ranges for the cluster on the previous step, you must add your developer tooling IP addresses to the AKS cluster list of approved IP ranges in order to access the API server from there. Another option is to configure a jumpbox with the needed tooling inside a separate subnet in the Firewall's virtual network.

Add another IP address to the approved ranges with the following command

```bash
# Retrieve your IP address
CURRENT_IP=$(dig @resolver1.opendns.com ANY myip.opendns.com +short)

# Add to AKS approved list
az aks update -g $RG -n $AKS_NAME --api-server-authorized-ip-ranges $CURRENT_IP/32

```

 Use the [az aks get-credentials][az-aks-get-credentials] command to configure `kubectl` to connect to your newly created Kubernetes cluster. 

 ```azure-cli
 az aks get-credentials -g $RG -n $AKS_NAME
 ```

### Deploy a public service
You can now start exposing services and deploying applications to this cluster. In this example, we'll expose a public service, but you may also choose to expose an internal service via [internal load balancer](internal-lb.md).

![Public Service DNAT](media/limit-egress-traffic/aks-create-svc.png)

Deploy the Azure voting app application by copying the yaml below to a file named `example.yaml`.

```yaml
# voting-storage-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: voting-storage
spec:
  replicas: 1
  selector:
    matchLabels:
      app: voting-storage
  template:
    metadata:
      labels:
        app: voting-storage
    spec:
      containers:
      - name: voting-storage
        image: mcr.microsoft.com/aks/samples/voting/storage:2.0
        args: ["--ignore-db-dir=lost+found"]
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 250m
            memory: 256Mi
        ports:
        - containerPort: 3306
          name: mysql
        volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: voting-storage-secret
              key: MYSQL_ROOT_PASSWORD
        - name: MYSQL_USER
          valueFrom:
            secretKeyRef:
              name: voting-storage-secret
              key: MYSQL_USER
        - name: MYSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: voting-storage-secret
              key: MYSQL_PASSWORD
        - name: MYSQL_DATABASE
          valueFrom:
            secretKeyRef:
              name: voting-storage-secret
              key: MYSQL_DATABASE
      volumes:
      - name: mysql-persistent-storage
        persistentVolumeClaim:
          claimName: mysql-pv-claim
---
# voting-storage-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: voting-storage-secret
type: Opaque
data:
  MYSQL_USER: ZGJ1c2Vy
  MYSQL_PASSWORD: UGFzc3dvcmQxMg==
  MYSQL_DATABASE: YXp1cmV2b3Rl
  MYSQL_ROOT_PASSWORD: UGFzc3dvcmQxMg==
---
# voting-storage-pv-claim.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pv-claim
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
# voting-storage-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: voting-storage
  labels: 
    app: voting-storage
spec:
  ports:
  - port: 3306
    name: mysql
  selector:
    app: voting-storage
---
# voting-app-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: voting-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: voting-app
  template:
    metadata:
      labels:
        app: voting-app
    spec:
      containers:
      - name: voting-app
        image: mcr.microsoft.com/aks/samples/voting/app:2.0
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
          name: http
        env:
        - name: MYSQL_HOST
          value: "voting-storage"
        - name: MYSQL_USER
          valueFrom:
            secretKeyRef:
              name: voting-storage-secret
              key: MYSQL_USER
        - name: MYSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: voting-storage-secret
              key: MYSQL_PASSWORD
        - name: MYSQL_DATABASE
          valueFrom:
            secretKeyRef:
              name: voting-storage-secret
              key: MYSQL_DATABASE
        - name: ANALYTICS_HOST
          value: "voting-analytics"
---
# voting-app-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: voting-app
  labels: 
    app: voting-app
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8080
    name: http
  selector:
    app: voting-app
---
# voting-analytics-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: voting-analytics
spec:
  replicas: 1
  selector:
    matchLabels:
      app: voting-analytics
      version: "2.0"
  template:
    metadata:
      labels:
        app: voting-analytics
        version: "2.0"
    spec:
      containers:
      - name: voting-analytics
        image: mcr.microsoft.com/aks/samples/voting/analytics:2.0
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
          name: http
        env:
        - name: MYSQL_HOST
          value: "voting-storage"
        - name: MYSQL_USER
          valueFrom:
            secretKeyRef:
              name: voting-storage-secret
              key: MYSQL_USER
        - name: MYSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: voting-storage-secret
              key: MYSQL_PASSWORD
        - name: MYSQL_DATABASE
          valueFrom:
            secretKeyRef:
              name: voting-storage-secret
              key: MYSQL_DATABASE
---
# voting-analytics-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: voting-analytics
  labels: 
    app: voting-analytics
spec:
  ports:
  - port: 8080
    name: http
  selector:
    app: voting-analytics
```

Deploy the service by running:

```bash
kubectl apply -f example.yaml
```

### Add a DNAT rule to Azure Firewall

> [!IMPORTANT]
> When you use Azure Firewall to restrict egress traffic and create a user-defined route (UDR) to force all egress traffic, make sure you create an appropriate DNAT rule in Firewall to correctly allow ingress traffic. Using Azure Firewall with a UDR breaks the ingress setup due to asymmetric routing. (The issue occurs if the AKS subnet has a default route that goes to the firewall's private IP address, but you're using a public load balancer - ingress or Kubernetes service of type: LoadBalancer). In this case, the incoming load balancer traffic is received via its public IP address, but the return path goes through the firewall's private IP address. Because the firewall is stateful, it drops the returning packet because the firewall isn't aware of an established session. To learn how to integrate Azure Firewall with your ingress or service load balancer, see [Integrate Azure Firewall with Azure Standard Load Balancer](https://docs.microsoft.com/azure/firewall/integrate-lb).


To configure inbound connectivity, a DNAT rule must be written to the Azure Firewall. To test connectivity to your cluster, a rule is defined for the firewall frontend public IP address to route to the internal IP exposed by the internal service.

The destination address can be customized as it's the port on the firewall to be accessed. The translated address must be the IP address of the internal load balancer. The translated port must be the exposed port for your Kubernetes service.

You'll need to specify the internal IP address assigned to the load balancer created by the Kubernetes service. Retrieve the address by running:

```bash
kubectl get services
```

The IP address needed will be listed in the EXTERNAL-IP column, similar to the following.

```bash
NAME               TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes         ClusterIP      10.41.0.1       <none>        443/TCP        10h
voting-analytics   ClusterIP      10.41.88.129    <none>        8080/TCP       9m
voting-app         LoadBalancer   10.41.185.82    20.39.18.6    80:32718/TCP   9m
voting-storage     ClusterIP      10.41.221.201   <none>        3306/TCP       9m
```

Get the service IP by running:
```bash
SERVICE_IP=$(k get svc voting-app -o jsonpath='{.status.loadBalancer.ingress[*].ip}')
```

Add the NAT rule by running:
```azure-cli
az network firewall nat-rule create --collection-name exampleset --destination-addresses $FWPUBLIC_IP --destination-ports 80 --firewall-name $FWNAME --name inboundrule --protocols Any --resource-group $RG --source-addresses '*' --translated-port 80 --action Dnat --priority 100 --translated-address $SERVICE_IP
```

### Validate connectivity

Navigate to the Azure Firewall frontend IP address in a browser to validate connectivity.

You should see the AKS voting app. In this example the Firewall public IP was `52.253.228.132`.


![aks-vote](media/limit-egress-traffic/aks-vote.png)


### Clean up resources

To clean up Azure resources, delete the AKS resource group.

```azure-cli
az group delete -g $RG
```

## Next steps

In this article, you learned what ports and addresses to allow if you want to restrict egress traffic for the cluster. You also saw how to secure your outbound traffic using Azure Firewall. 

If needed, you can generalize the steps above to forward the traffic to your preferred egress solution, following the [Outbound Type `userDefinedRoute` documentation](egress-outboundtype.md).

If you want to restrict how pods communicate between themselves and East-West traffic restrictions within cluster see [Secure traffic between pods using network policies in AKS][network-policy].

<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[network-policy]: use-network-policies.md
[azure-firewall]: ../firewall/overview.md
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[aks-upgrade]: upgrade-cluster.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[dev-spaces-service-tags]: ../dev-spaces/configure-networking.md#virtual-network-or-subnet-configurations
