---
title: Enable or Disable BMP Log Streaming for Azure Operator Nexus
description: Learn how to enable or disable BMP log streaming for various Azure Operator Nexus Network Fabric resources.
ms.service: azure-operator-nexus
ms.custom: template-how-to, devx-track-azurecli
ms.topic: how-to
ms.date: 11/14/2024
author: sushantjrao
ms.author: sushrao
---

# BMP log streaming

This article shows you how to enable or disable BGP Monitoring Protocol (BMP) log streaming for various Azure Operator Nexus Network Fabric resources.

## Enable BMP log streaming for the new deployment

1. Create an Azure Operator Nexus Network Fabric resource. This resource serves as the foundation for your deployment.
1. Create a Network Monitor resource and associate the scope ID with the Azure Operator Nexus Network Fabric resource ID. This step ensures that the monitoring is correctly linked to the network fabric.
1. Create a network-to-network interface (NNI) with BMP configuration. Create the NNI by associating it with the Azure Operator Nexus Network Fabric resource ID.

   > [!NOTE]
   > For more information, see the following Azure Resource Manager API payload guide.

1. Provision Azure Operator Nexus Network Fabric. Azure Operator Nexus Network Fabric applies the configurations and makes the network operational.
1. Generate the BMP station configuration. Azure Operator Nexus Network Fabric configures BMP stations on the CE devices only.

## Enable BMP log streaming for the existing deployment

This case involves enabling BMP log streaming on Azure Operator Nexus Network Fabric, which is already deployed by using the supported Azure Operator Nexus Network Fabric version. This approach is based on an Azure Resource Manager API user-driven input. The supported Azure Operator Nexus Network Fabric version also supports BMP log streaming through the Azure Operator Nexus Network Fabric Patch Update workflow.

1. Create an Azure Operator Nexus Network Fabric resource by using the latest supported version. If your version is outdated, upgrade it to the supported version.
1. To ensure proper monitoring, create a Network Monitor resource. Link the scope ID to the Azure Operator Nexus Network Fabric resource ID.
1. Apply a patch to update the NNI. Under `OptionBLayerConfiguration`, select `bmpConfiguration` and set `configurationState` to `Enabled` for BMP logging of the NNI peer-group neighbor address.

   > [!NOTE]
   > For more information, see the following Azure Resource Manager API payload guide.

1. To apply configurations and activate the network, run the `Fabric Commit` operation.
1. Generate the BMP station configuration. Azure Operator Nexus Network Fabric configures BMP stations on the CE devices only.

## Network Monitor CRUD operations for BMP log streaming

This section shows you how to perform any create, read, update, delete (CRUD) operations on the Network Monitor resource for BMP log streaming.

The following property is defined under Azure Resource Manager API version `2024-06-15-preview`:

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

> [!NOTE]
> During the new deployment, the Network Monitor resource doesn't include `stationNetwork`. The default virtual routing and forwarding (VRF) is designated as `INFRA-MGMT`, with the source interface set to `vlan39`.

Azure Operator Nexus generates the following configuration for the BMP station:

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

## Enable or disable BMP log streaming under NNI

### Enable BMP log streaming for NNI

To enable BMP log streaming under NNI, run the following Azure CLI command. This example enables BMP log streaming for `infra-vpn` (VRF, `INFRA-MGMT`), `workload-vpn` (VRF, `WORKLOAD-MGMT`) with `OptionB` and layer 3 isolation domain (L3ISD) external network `OptionB`.

```Azure CLI
az networkfabric nni create --resource-group "example-rg" --fabric "example-fabric" --resource-name "example-nniwithACL" --nni-type "CE" --is-management-type "True" --use-option-b "True" --layer2-configuration "{interfaces:['/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkDevices/example-networkDevice/networkInterfaces/example-interface'],mtu:1500}" --option-b-layer3-configuration "{peerASN:28,vlanId:501,primaryIpv4Prefix:'10.18.0.xxx/30',secondaryIpv4Prefix:'10.18.0.xxx/30',primaryIpv6Prefix:'10:2:0:xxx::400/127',secondaryIpv6Prefix:'10:2:0:xxx::402/127', bmpConfiguration:`{configurationState:`Enabled`}`}" --ingress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4ingressACL" --egress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4egressACL"
```

### Disable BMP log streaming for NNI

To disable BMP log streaming for NNI, modify the `bmpConfiguration` parameter to `Disabled`. For example:

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

When BMP log streaming is enabled, the CLI output looks like this example:

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

## Enable or disable BMP log streaming for L3ISD external network option A

### Enable BMP log streaming for L3ISD external network option A

To enable BMP log streaming for L3ISD external network option A, run the following Azure CLI command. This example enables BMP log streaming for the specified external network.

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

### Disable BMP log streaming for L3ISD external network option A

To disable BMP log streaming for L3ISD external network option A, modify the `bmpConfiguration` parameter to `Disabled`. For example:

```bash
az networkfabric externalnetwork update --resource-group "example-rg" --l3domain "example-l3domain" --resource-name "example-externalNetwork" --option-a-properties "{bmpConfiguration:`{configurationState:`Disabled`}`}"
```

### Example CLI output

When BMP log streaming is enabled, the CLI output looks like this example:

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

## Enable or disable BMP log streaming for L3ISD internal network

### Enable BMP log streaming for L3ISD internal network

To enable BMP log streaming for L3ISD internal network, run the following Azure CLI command:

```bash
az networkfabric internalnetwork create --resource-group "example-rg" --l3-isolation-domain-name "example-l3domainIpv4VProbe" --resource-name "example-internalNetwork" --vlan-id 2600 --mtu 1500 --extension "NPB" --is-monitoring-enabled "True" --connected-ipv4-subnets "[{prefix:'10.18.32.xxx/24'}]" --static-route-configuration "{extension:NPB,bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},ipv4Routes:[{prefix:'10.18.128.xxx/24',nextHop:['10.18.34.xxx','10.18.32.xxx']},{prefix:'10.18.129.xxx/24',nextHop:['10.1.17.xxx']}]}" --bgp-configuration  "{bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},defaultRouteOriginate:True,allowAS:2,allowASOverride:Enable,peerASN:65047,ipv4ListenRangePrefixes:['10.18.32.xxx/28','10.18.32.xxx/28'],ipv4NeighborAddress:[{address:'10.18.34.xxx'},{address:'10.18.34.xxx'}],bmpConfiguration:`{configurationState:`Enabled`}`}"
```

### Disable BMP log streaming for L3ISD internal network

To disable BMP log streaming for L3ISD internal network, modify the `bmpConfiguration` parameter to `Disabled`. For example:

```bash
az networkfabric internalnetwork update --resource-group "example-rg" --l3-isolation-domain-name "example-l3domainIpv4VProbe" --resource-name "example-internalNetwork" --bgp-configuration  "{bmpConfiguration:`{configurationState:`Disabled`}`}"
```

### Example CLI output

When BMP log streaming is enabled, the CLI output looks like this example:

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

## Enable or disable BMP log streaming for L3ISD internal network with restricted neighbors

### Enable BMP log streaming with restricted neighbors

To enable BMP log streaming with restricted neighbors for L3ISD internal network, run the following Azure CLI command:

```bash
az networkfabric internalnetwork create --resource-group "example-rg" --l3-isolation-domain-name "example-l3domainIpv4VProbe" --resource-name "example-internalNetwork" --vlan-id 2600 --mtu 1500 --extension "NPB" --is-monitoring-enabled "True" --connected-ipv4-subnets "[{prefix:'10.18.32.xxx/24'}]" --static-route-configuration "{extension:NPB,bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},ipv4Routes:[{prefix:'10.18.128.xxx/24',nextHop:['10.18.34.xxx','10.18.32.xxx']},{prefix:'10.18.129.xxx/24',nextHop:['10.1.17.xxx']}]}" --bgp-configuration  "{bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},defaultRouteOriginate:True,allowAS:2,allowASOverride:Enable,peerASN:65047,ipv4ListenRangePrefixes:['10.18.32.xxx/28','10.18.32.xxx/28'],ipv4NeighborAddress:[{address:'10.18.34.xxx'},{address:'10.18.34.xxx'},{address:'10.18.34.xxx'}],bmpConfiguration:`{configurationState:`Enabled`, neighborIpExclusions:[`10.18.32.xxx`,`10.18.34.xxx`]}`}"
```

### Disable BMP log streaming with restricted neighbors

To disable BMP log streaming for L3ISD internal network with restricted neighbors, modify the `bmpConfiguration` parameter to `Disabled`. For example:

```bash
az networkfabric internalnetwork update --resource-group "example-rg" --l3-isolation-domain-name "example-l3domainIpv4VProbe" --resource-name "example-internalNetwork" --bgp-configuration  "{bmpConfiguration:`{configurationState:`Disabled`}`}"
```

### Example of CLI output with restricted neighbors

When BMP log streaming is enabled with restricted neighbors, the CLI output looks like this example:

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
