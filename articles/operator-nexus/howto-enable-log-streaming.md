---
title: How to enable / disable BMP log streaming Azure Operator Nexus
description: Instructions on enabling / disabling BMP log streaming various Network Fabric resources.
ms.service: azure-operator-nexus
ms.custom: template-how-to, devx-track-azurecli
ms.topic: how-to
ms.date: 11/14/2024
author: sushantjrao
ms.author: sushrao
---

# BMP log streaming

This guide provides you with instructions on enabling / disabling BMP log streaming various Network Fabric resources.

## Enabling BMP log streaming for the new deployment

- **Create Network Fabric resource:** Begin by creating Network Fabric (NF) resource. This serves as the foundation for your deployment.

- **Create Network Monitor resource:** Next, create a Network Monitor resource and associate the Scope ID with the NF Resource ID. This step ensures that the monitoring is correctly linked to the network fabric.

- **Create NNI with BMP configuration:** Create a Network-to-Network Interface (NNI) by associating it with the NF Resource ID. 

> [!Note]
> Refer to the below detailed Azure Resource Manager (ARM) API payload guide for more information.

- **Provision Network Fabric:** Provision the Network Fabric to apply the configurations and make the network operational.

- **Generate BMP stations configuration** The Nexus NF generates the BMP stations configuration on the Customer Edge (CE) devices only.

## Enabling BMP log streaming for the existing deployment

This case involves enabling BMP log streaming on NF, which is already deployed using the supported NF Version. Since this approach is based on an Azure Resource Manager (ARM) API user-driven input, the supported NF Version also supports BMP Log Streaming through the NF Patch Update workflow.

- **Create Network Fabric resource:** Start by creating the Network Fabric (NF) resource using the latest supported version. If the NF is outdated, upgrade it to the supported version.

- **Create Network Monitor resource:** To ensure proper monitoring, create a Network Monitor resource and link the Scope ID to the NF Resource ID.

- **Perform Patch on NNI:** Update the Network-to-Network Interface (NNI) by applying a patch. Select `bmpConfiguration` under `OptionBLayerConfiguration` and set `configurationState` to "Enabled" for BMP logging of the NNI peer-group neighbor address.

> [!Note]
> Refer to the below detailed ARM API payload guide for more information

- **Perform `Fabric Commit` operation:** To apply configurations and activate the network, execute the "Fabric Commit" operation.

- **Generate BMP Stations configuration:** The Nexus NF configures BMP stations on the Customer Edge (CE) devices only.

## Network Monitor CRUD operations for BMP log streaming 

This section provides a detailed guide on how to perform CRUD (Create, Read, Update, Delete) operations on the Network Monitor Resource for BMP log streaming. 

The following property is defined under ARM API version `2024-06-15-preview` 

```Azure CLI
az networkfabric networkmonitor create \
  --resource-group "example-rg" \
  --fabric "example-fabric" \
  --resource-name "example-network-monitor" \
  --bmp-configuration "{\
    scopeResourceId: '/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkFabrics/example-fabric',\
    stationConfigurationState: 'Enabled',\
    stationName: '',\
    stationIp: '',\
    stationPort: ,\
    stationConnectionMode: 'Active',\
    monitoredAddressFamilies: ['ipv4Unicast', 'ipv6Unicast', 'vpnIpv4', 'vpnIpv6'],\
    exportPolicy: 'Pre-Policy',\
    stationConnectionProperties: {\
      keepaliveIdleTime: 180,\
      probeInterval: 60,\
      probeCount: 3\
    }\
  }" \
  --monitored-networks "[\
    'l3isd-1-arm-reference-id',\
    'l3isd-2-arm-reference-id',\
    '/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain'\
  ]"

```

> [!Note]
> During the new deployment, the Network Monitor resource does not include "stationNetwork". The default VRF will be designated as "INFRA-MGMT", with the source interface set to "vlan39". 

Nexus generates the following configuration for BMP Station: 

```output
router bgp 65501
       neighbor CE_PE_VPN monitoring
       neighbor INFRA-MGMT monitoring
       monitoring received routes address-family ipv4 unicast
	monitoring received routes address-family ipv6 unicast
	monitoring received routes address-family vpn-ipv4
	monitoring received routes address-family vpn-ipv6
	bgp monitoring
	monitoring timestamp send-time
	monitoring station adp-nprd-euap-austxg5-fab-bmp
		update-source Vlan39
		connection address <example ip> vrf INFRA-MGMT
		connection mode active port <example port>
		connection keepalive 180 60 3
export-policy received routes pre-policy
	! 
```

## How to Enable/Disable BMP log streaming under NNI

### Enabling BMP log streaming for NNI

To enable BMP Log streaming under NNI, run the following Azure CLI command. This example enables BMP Log streaming for **infra-vpn** (vrf **INFRA-MGMT**), **workload-vpn** (vrf **WORKLOAD-MGMT**) with **OptionB**, and **L3ISD External Network OptionB**.

```Azure CLI
az networkfabric nni create --resource-group "example-rg" --fabric "example-fabric" --resource-name "example-nniwithACL" --nni-type "CE" --is-management-type "True" --use-option-b "True" --layer2-configuration "{interfaces:['/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkDevices/example-networkDevice/networkInterfaces/example-interface'],mtu:1500}" --option-b-layer3-configuration "{peerASN:28,vlanId:501,primaryIpv4Prefix:'10.18.0.xxx/30',secondaryIpv4Prefix:'10.18.0.xxx/30',primaryIpv6Prefix:'10:2:0:xxx::400/127',secondaryIpv6Prefix:'10:2:0:xxx::402/127', bmpConfiguration:`{configurationState:`Enabled`}`}" --ingress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4ingressACL" --egress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4egressACL"
```

### Disabling BMP log streaming for NNI

To disable BMP Log streaming for NNI, modify the `bmpConfiguration` parameter to `Disabled`. Example:

```Azure CLI
az networkfabric nni update \
  --resource-group "example-rg" \
  --fabric "example-fabric" \
  --resource-name "example-nniwithACL" \
  --option-b-layer3-configuration "{\
    bmpConfiguration: {\
      configurationState: 'Disabled'\
    }\
  }"
```

### Example CLI output

When BMP Log streaming is enabled, the CLI output looks like this:

```Output
Router bgp <fabric-asn-value>
   neighbor CE_PE_VPN monitoring
   neighbor CE_PE_VPN peer group
   neighbor CE_PE_VPN remote-as 65015
   neighbor CE_PE_VPN send-community
   neighbor CE_PE_VPN bfd
   neighbor CE_PE_VPN route-reflector-client
   neighbor CE_PE_VPN next-hop-self
```

---

## How to Enable/Disable BMP Log Streaming for L3ISD External Network OptionA

### Enabling BMP Log Streaming for L3ISD External Network OptionA

To enable BMP Log streaming for L3ISD External Network OptionA, run the following Azure CLI command. This example enables BMP Log streaming for the specified external network.

```Azure CLI
az networkfabric externalnetwork create \
  --resource-group "example-rg" \
  --l3domain "example-l3domain" \
  --resource-name "example-externalNetwork" \
  --peering-option "OptionA" \
  --option-a-properties "{\
    peerASN: 65234,\
    vlanId: 501,\
    mtu: 1500,\
    primaryIpv4Prefix: '172.23.1.xxx/31',\
    secondaryIpv4Prefix: '172.23.1.xxx/31',\
    bfdConfiguration: {\
      multiplier: 5,\
      intervalInMilliSeconds: 300\
    },\
    bmpConfiguration: {\
      configurationState: 'Enabled'\
    }\
  }" \
  --import-route-policy "{\
    importIpv4RoutePolicyId: '/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/microsoft.managednetworkfabric/routePolicies/example-routepolicy',\
    importIpv6RoutePolicyId: '/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/microsoft.managednetworkfabric/routePolicies/example-routepolicy'\
  }" \
  --export-route-policy "{\
    exportIpv4RoutePolicyId: '/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/microsoft.managednetworkfabric/routePolicies/example-routepolicy',\
    exportIpv6RoutePolicyId: '/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/microsoft.managednetworkfabric/routePolicies/example-routepolicy'\
  }"
```

### Disabling BMP Log Streaming for L3ISD External Network OptionA
To disable BMP Log streaming for L3ISD External Network OptionA, modify the `bmpConfiguration` parameter to `Disabled`. Example:

```bash
az networkfabric externalnetwork update --resource-group "example-rg" --l3domain "example-l3domain" --resource-name "example-externalNetwork" --option-a-properties "{bmpConfiguration:`{configurationState:`Disabled`}`}"
```

### Example CLI output

When BMP Log streaming is enabled, the CLI output appears as follows:

```bash
Router bgp <fabric-asn-value>
   neighbor example-externalNetwork-v4 monitoring
   neighbor example-externalNetwork-v4 peer group
   neighbor example-externalNetwork-v4 remote-as 65015
   neighbor example-externalNetwork-v4 send-community
   neighbor example-externalNetwork-v4 bfd
   neighbor example-externalNetwork-v4 route-reflector-client
   neighbor ISD_NAME1 ebgp-multihop 1
   neighbor ISD_NAME1 allowas-in 2
```

---

## How to Enable/Disable BMP Log Streaming for L3ISD Internal Network

### Enabling BMP Log Streaming for L3ISD Internal Network
To enable BMP Log streaming for L3ISD Internal Network, run the following Azure CLI command:

```bash
az networkfabric internalnetwork create --resource-group "example-rg" --l3-isolation-domain-name "example-l3domainIpv4VProbe" --resource-name "example-internalNetwork" --vlan-id 2600 --mtu 1500 --extension "NPB" --is-monitoring-enabled "True" --connected-ipv4-subnets "[{prefix:'10.18.32.xxx/24'}]" --static-route-configuration "{extension:NPB,bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},ipv4Routes:[{prefix:'10.18.128.xxx/24',nextHop:['10.18.34.xxx','10.18.32.xxx']},{prefix:'10.18.129.xxx/24',nextHop:['10.1.17.xxx']}]}" --bgp-configuration  "{bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},defaultRouteOriginate:True,allowAS:2,allowASOverride:Enable,peerASN:65047,ipv4ListenRangePrefixes:['10.18.32.xxx/28','10.18.32.xxx/28'],ipv4NeighborAddress:[{address:'10.18.34.xxx'},{address:'10.18.34.xxx'}],bmpConfiguration:`{configurationState:`Enabled`}`}"
```

### Disabling BMP Log Streaming for L3ISD Internal Network
To disable BMP Log streaming for L3ISD Internal Network, modify the `bmpConfiguration` parameter to `Disabled`. Example:

```bash
az networkfabric internalnetwork update --resource-group "example-rg" --l3-isolation-domain-name "example-l3domainIpv4VProbe" --resource-name "example-internalNetwork" --bgp-configuration  "{bmpConfiguration:`{configurationState:`Disabled`}`}"
```

### Example CLI Output
When BMP Log streaming is enabled, the CLI output appears as follows:

```bash
Router bgp <fabric-asn-value>
   neighbor example-internalNetwork-v4 monitoring
   neighbor example-internalNetwork-v4 peer group
   neighbor example-internalNetwork-v4 remote-as 65015
   neighbor example-internalNetwork-v4 send-community
   neighbor example-internalNetwork-v4 bfd
   neighbor example-internalNetwork-v4 route-reflector-client
   neighbor example-internalNetwork-v4 ebgp-multihop 1
   neighbor example-internalNetwork-v4 allowas-in 2
```

---

## How to Enable/Disable BMP Log Streaming for L3ISD Internal Network with Restricted Neighbors

### Enabling BMP Log Streaming with Restricted Neighbors
To enable BMP Log streaming with restricted neighbors for L3ISD Internal Network, run the following Azure CLI command:

```bash
az networkfabric internalnetwork create --resource-group "example-rg" --l3-isolation-domain-name "example-l3domainIpv4VProbe" --resource-name "example-internalNetwork" --vlan-id 2600 --mtu 1500 --extension "NPB" --is-monitoring-enabled "True" --connected-ipv4-subnets "[{prefix:'10.18.32.xxx/24'}]" --static-route-configuration "{extension:NPB,bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},ipv4Routes:[{prefix:'10.18.128.xxx/24',nextHop:['10.18.34.xxx','10.18.32.xxx']},{prefix:'10.18.129.xxx/24',nextHop:['10.1.17.xxx']}]}" --bgp-configuration  "{bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},defaultRouteOriginate:True,allowAS:2,allowASOverride:Enable,peerASN:65047,ipv4ListenRangePrefixes:['10.18.32.xxx/28','10.18.32.xxx/28'],ipv4NeighborAddress:[{address:'10.18.34.xxx'},{address:'10.18.34.xxx'},{address:'10.18.34.xxx'}],bmpConfiguration:`{configurationState:`Enabled`, neighborIpExclusions:[`10.18.32.xxx`,`10.18.34.xxx`]}`}"
```

### Disabling BMP Log Streaming with Restricted Neighbors
To disable BMP Log streaming for L3ISD Internal Network with restricted neighbors, modify the `bmpConfiguration` parameter to `Disabled`. Example:

```bash
az networkfabric internalnetwork update --resource-group "example-rg" --l3-isolation-domain-name "example-l3domainIpv4VProbe" --resource-name "example-internalNetwork" --bgp-configuration  "{bmpConfiguration:`{configurationState:`Disabled`}`}"
```

### Example CLI Output with Restricted Neighbors
When BMP Log streaming is enabled with restricted neighbors, the CLI output looks like this:

```bash
Router bgp <fabric-asn-value>
    neighbor example-internalNetwork-v4 monitoring
    neighbor example-internalNetwork-v4 peer group
    neighbor example-internalNetwork-v4 remote-as 65015
    neighbor example-internalNetwork-v4 send-community
    neighbor example-internalNetwork-v4 bfd
    neighbor example-internalNetwork-v4 ebgp-multihop 1
    neighbor example-internalNetwork-v4 allowas-in 2
    neighbor example-internalNetwork-v4 auto-local-addr
```