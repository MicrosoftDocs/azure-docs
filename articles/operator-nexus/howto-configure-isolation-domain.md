---
title: "Azure Operator Nexus: Configure L2 and L3 isolation domains"
description: Learn commands to create, view, list, update, and delete Layer 2 and Layer 3 isolation domains in Azure Operator Nexus instances.
author: jdasari
ms.author: jdasari
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 07/20/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Configure L2 and L3 isolation-domains using managed network fabric services

The isolation-domains enable communication between workloads hosted in the same rack (intra-rack communication) or different racks (inter-rack communication).
This how-to describes how you can manage your Layer 2 and Layer 3 isolation-domains using the Azure Command Line Interface (AzureCLI). You can create, update, delete and check status of Layer 2 and Layer 3 isolation-domains.

## Prerequisites

1. Ensure Network Fabric Controller (NFC) and Network Fabric have been created.
2. Install latest version of the
[necessary CLI extensions](./howto-install-cli-extensions.md).

3. Use the following command to sign in to your Azure account and set the subscription to your Azure subscription ID. This should be the same subscription ID that you use for all the resources in an Azure Operator Nexus instance.

```azurecli
    az login
    az account set --subscription ********-****-****-****-*********
```

4. Register providers for a managed network fabric:
   1. In the Azure CLI, enter the command `az provider register --namespace Microsoft.ManagedNetworkFabric`.

   1. Monitor the registration process by using the command `az provider show -n Microsoft.ManagedNetworkFabric -o table`.

      Registration can take up to 10 minutes. When it's finished, `RegistrationState` in the output changes to `Registered`.

Isolation domains are used to enable Layer 2 or Layer 3 connectivity between workloads hosted across the Azure Operator Nexus instance and external networks.

> [!NOTE]
> Operator Nexus reserves VLANs <=500 for Platform use, and therefore VLANs in this range can't be used for your (tenant) workload networks. You should use VLAN values between 501 and 4095.

## Parameters for isolation-domain management

| Parameter|Description|Example|Required|
|---|---|---|---|
|`resource-group`	|Use an appropriate resource group name specifically for ISD of your choice|ResourceGroupName|True
|`resource-name`	|Resource Name of the l2isolationDomain|example-l2domain| True
|`location`|AODS Azure Region used during NFC Creation|eastus| True
|`nf-Id`	|network fabric ID|"/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFresourcegroupname/providers/Microsoft.ManagedNetworkFabric/NetworkFabrics/NFname"| True
|`Vlan-id` | VLAN identifier value. VLANs 1-500 are reserved and can't be used. The VLAN identifier value can't be changed once specified. The isolation-domain must be deleted and recreated if the VLAN identifier value needs to be modified. The range is between 501-4095|501| True
|`mtu` | maximum transmission unit is 1500 by default, if not specified|1500||
|`administrativeState`|	Enable/Disable indicate the administrative state of the isolationDomain|Enable||
| `subscriptionId`      | Your Azure subscriptionId for your Operator Nexus instance. ||
| `provisioningState`   | Indicates provisioning state |

## L2 Isolation-Domain

You use an L2 isolation-domain to establish layer 2 connectivity between workloads running on Operator Nexus compute nodes.

### Create L2 isolation-domain

Create an L2 isolation-domain:

```azurecli
az networkfabric l2domain create \
--resource-group "ResourceGroupName" \
--resource-name "example-l2domain" \
--location "eastus" \
--nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/NetworkFabrics/NFname" \
--vlan-id  750\
--mtu 1501
```

Expected output:

```json
{
  "administrativeState": "Disabled",		 
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l2IsolationDomains/example-l2domain",
  "location": "eastus",
  "mtu": 1501,
  "name": "example-l2domain",
  "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFresourcegroupname/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT14:57:59.167177+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT14:57:59.167177+00:00",
    "lastModifiedBy": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx",
    "lastModifiedByType": "Application"
  },			   
  "type": "microsoft.managednetworkfabric/l2isolationdomains",
  "vlanId": 750
}
```

### Show L2 isolation-domains

This command shows details about L2 isolation domains, including their administrative states:

```azurecli
az networkfabric l2domain show --resource-group "ResourceGroupName" --resource-name "example-l2domain"
```

Expected Output

```json
{
  "administrativeState": "Disabled",					 
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l2IsolationDomains/example-l2domain",
  "location": "eastus",
  "mtu": 1501,
  "name": "example-l2domain",
  "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT14:57:59.167177+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT14:57:59.167177+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e1078890",
    "lastModifiedByType": "Application"
  },			   
  "type": "microsoft.managednetworkfabric/l2isolationdomains",
  "vlanId": 750
}
```

### List all L2 isolation-domains

This command lists all l2 isolation-domains available in resource group.

```azurecli
az networkfabric l2domain list --resource-group "ResourceGroupName"
```

Expected Output

```json
 {
    "administrativeState": "Enabled",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l2IsolationDomains/example-l2domain",
    "location": "eastus",
    "mtu": 1501,
    "name": "example-l2domain",
    "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxxxxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
    "provisioningState": "Succeeded",
    "resourceGroup": "ResourceGroupName",
    "systemData": {
      "createdAt": "2022-XX-XXT22:26:33.065672+00:00",
      "createdBy": "email@address.com",
      "createdByType": "User",
      "lastModifiedAt": "2022-XX-XXT14:46:45.753165+00:00",
      "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "lastModifiedByType": "Application"
    },
    "type": "microsoft.managednetworkfabric/l2isolationdomains",
    "vlanId": 750
  }
```

### Change the administrative state of an L2 isolation domain

You must enable an isolation domain to push the configuration to the network fabric devices. Use the following command to change the administrative state of an isolation domain:

```azurecli
az networkfabric l2domain update-admin-state --resource-group "ResourceGroupName" --resource-name "example-l2domain" --state Enable/Disable
```

Expected Output

```json
{
  "administrativeState": "Enabled",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l2IsolationDomains/example-l2domain",
  "location": "eastus",
  "mtu": 1501,
  "name": "example-l2domain",
  "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT14:57:59.167177+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT14:57:59.167177+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "type": "microsoft.managednetworkfabric/l2isolationdomains",
  "vlanId": 501
}
```

### Delete L2 isolation-domain

Use this command to delete an L2 isolation domain:

```azurecli
az networkfabric l2domain delete --resource-group "ResourceGroupName" --resource-name "example-l2domain"
```

Expected output:

```output
Please use show or list command to validate that isolation-domain is deleted. Deleted resources will not appear in result
```

## Configure L3 isolation-domain

A Layer 3 isolation-domain enables layer 3 connectivity between workloads running on Operator Nexus compute nodes.
The L3 isolation-domain enables the workloads to exchange layer 3 information with Network fabric devices.

Layer 3 isolation-domain has two components: 

- An *internal network* defines Layer 3 connectivity between network fabrics running on Azure Operator Nexus compute nodes and an optional external network. You must create at least one internal network.
- An *external network* provides connectivity between the internet and internal networks via your PEs.


L3 isolation-domain enables deploying workloads that advertise service IPs to the fabric via BGP.

An L3 isolation domain has two ASNs:

- The *Fabric ASN* refers to the ASN of the network devices on the Fabric. The Fabric ASN was specified while creating the Network fabric.
- The *Peer ASN* refers to ASN of the Network Functions in Operator Nexus, and it can't be the same as Fabric ASN.

The workflow for a successful provisioning of an L3 isolation-domain is as follows:

  - Create a L3 isolation-domain
  - Create one or more Internal Networks
  - Enable a L3 isolation-domain

To make changes to the L3 isolation-domain, first Disable the L3 isolation-domain (Administrative state). Re-enable the L3 isolation-domain (AdministrativeState state) once the changes are completed:

  - Disable the L3 isolation-domain
  - Make changes to the L3 isolation-domain
  - Re-enable the L3 isolation-domain

The Procedure to show, enable/disable and delete IPv6 based isolation-domains is same as used for IPv4. the Vlan range for creation Isolation Domain 501-4095

The following parameters are available for configuring L3 isolation domains.

| Parameter|Description|Example|Required|
|---|---|---|---|
|`resource-group`	|Use an appropriate resource group name specifically for ISD of your choice|ResourceGroupName|True|
|`resource-name`	|Resource Name of the l3isolationDomain|example-l3domain|True|
|`location`|AODS Azure Region used during NFC Creation|eastus|True|
|`nf-Id`|Azure subscriptionId used during NFC Creation|/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/NetworkFabrics/NFName"| True|

The following parameters for isolation domains are optional.

| Parameter|Description|Example|Required|
|---|---|---|---|
| `redistributeConnectedSubnet` | Advertise connected subnets default value is True |True |      |
| `redistributeStaticRoutes`  |Advertise Static Routes can have value of true/False.  Defualt Value is False | False       | |
| `aggregateRouteConfiguration`|List of Ipv4 and Ipv6 route configurations  |     |   | 
| `connectedSubnetRoutePolicy` | Route Policy Configuration for IPv4 or Ipv6 L3 ISD connected subnets. Refer to help file for using correct syntax  |    |   | 

### Create L3 isolation-domain

Use this command to create an L3 isolation domain:

```azurecli
az networkfabric l3domain create 
--resource-group "ResourceGroupName" 
--resource-name "example-l3domain"
--location "eastus" 
--nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/NetworkFabrics/NFName"
```

> [!NOTE]
> For MPLS Option 10 (B) connectivity to external networks via PE devices, you can specify option (B) parameters while creating an isolation-domain.

Expected Output

```json
{
  "administrativeState": "Disabled",
  "configurationState": "Succeeded",								 
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain",
  "location": "eastus",
  "name": "example-l3domain",
  "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "provisioningState": "Succeeded",
  "redistributeConnectedSubnets": "True",
  "redistributeStaticRoutes": "False",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2022-XX-XXT06:23:43.372461+00:00",
    "createdBy": "email@example.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:40:38.815959+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e10787367",
    "lastModifiedByType": "Application"
  },			   
  "type": "microsoft.managednetworkfabric/l3isolationdomains"
}
```

## Create an untrusted L3 isolation domain

```azurecli
az nf l3domain create --resource-group "ResourceGroupName" --resource-name "l3untrust" --location "eastus" --nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName" 
```
## Create a trusted L3 isolation domain

```azurecli
az nf l3domain create --resource-group "ResourceGroupName" --resource-name "l3trust" --location "eastus" --nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName"
```
## Create a management L3 isolation domain

```azurecli
az nf l3domain create --resource-group "ResourceGroupName" --resource-name "l3mgmt" --location "eastus" --nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName"
```

### Show L3 isolation-domains

You can get the L3 isolation-domains details and administrative state.

```azurecli
az networkfabric l3domain show --resource-group "ResourceGroupName" --resource-name "example-l3domain"
```

Expected Output

```json
{
  "administrativeState": "Disabled",
  "configurationState": "Succeeded",				 								 
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain",
  "location": "eastus",
  "name": "example-l3domain",
  "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "provisioningState": "Succeeded",
  "redistributeConnectedSubnets": "True",
  "redistributeStaticRoutes": "False",
  "resourceGroup": "2023-XX-XXT09:40:38.815959+00:00",
  "systemData": {
    "createdAt": "2023-XX-XXT09:40:38.815959+00:00",
    "createdBy": "email@example.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:40:46.923037+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e10787456",
    "lastModifiedByType": "Application"
  },			   
  "type": "microsoft.managednetworkfabric/l3isolationdomains"
}
```

### List all L3 isolation-domains

Use this command to get a list of all L3 isolation domains available in a resource group:

```azurecli
az networkfabric l3domain list --resource-group "ResourceGroupName"
```

Expected Output

```json
{
    "administrativeState": "Disabled",
    "configurationState": "Succeeded",					 							 
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain",
    "location": "eastus",
    "name": "example-l3domain",
    "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
    "provisioningState": "Succeeded",
    "redistributeConnectedSubnets": "True",
    "redistributeStaticRoutes": "False",
    "resourceGroup": "ResourceGroupName",
    "systemData": {
      "createdAt": "2023-XX-XXT09:40:38.815959+00:00",
      "createdBy": "email@example.com",
      "createdByType": "User",
      "lastModifiedAt": "2023-XX-XXT09:40:46.923037+00:00",
      "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e10787890",
      "lastModifiedByType": "Application"
    },			   
    "type": "microsoft.managednetworkfabric/l3isolationdomains"
  }
```
### Change the administrative state of an L3 isolation domain

Use the following command to change the administrative state of an L3 isolation domain to enabled or disabled:

##Note: At least one internal network should be available to change the adminstrative state of an L3 Isolation Domain. 

```azurecli
az nf l3domain update-admin-state --resource-group "ResourceGroupName" --resource-name "example-l3domain" --state Enable/Disable
```

Expected Output

```json
{
  "administrativeState": "Enabled",
  "configurationState": "Succeeded",		
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain",				 
  "location": "eastus",
  "name": "example-l3domain",
  "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/NFresourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "provisioningState": "Succeeded",
  "redistributeConnectedSubnets": "True",
  "redistributeStaticRoutes": "False",
  "resourceGroup": "NFResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT06:23:43.372461+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT06:25:53.240975+00:00",
    "lastModifiedBy": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx",
    "lastModifiedByType": "Application"
  },				 
  "type": "microsoft.managednetworkfabric/l3isolationdomains"
}
```
Use the `az show` command to verify whether the administrative state has changed to `Enabled`.


### Delete an L3 isolation-domains

Use this command to delete an L3 isolation domain:

```azurecli
 az nf l3domain delete --resource-group "ResourceGroupName" --resource-name "example-l3domain"
```

Use the `show` or `list` commands to validate that the isolation-domain has been deleted.


## Create Internal Network

After you successfully create an L3 isolation domain, the next step is to create an internal network. Internal networks enable Layer 3 inter-rack and intra-rack communication between workloads by exchanging routes with the fabric. An L3 isolation domain can support multiple internal networks, each on a separate VLAN.

The following diagram represents an example network function with three internal networks: trusted, untrusted, and management. Each of the internal networks is created in its own L3 isolation domain.

:::image type="content" source="media/network-function-networking.png" alt-text="Diagram of a network function with three internal networks.":::

The IPv4 prefixes for these networks are:

- Trusted network: 10.151.1.11/24
- Management network: 10.151.2.11/24
- Untrusted network: 10.151.3.11/24

The following parameters are available for creating internal networks.

| Parameter|Description|Example|Required|
|---|---|---|---|
|`vlan-Id` |Vlan identifier with range from 501 to 4095|1001|True|
|`resource-group`|Use the corresponding NFC resource group name| NFCresourcegroupname | True
|`l3-isolation-domain-name`|Resource Name of the l3isolationDomain|example-l3domain | True
|`location`|AODS Azure Region used during NFC Creation|eastus | True


The following parameters are optional for creating internal networks.

|Parameter|Description|Example|Required|
|---|---|---|---|
|`connectedIPv4Subnets` |IPv4 subnet used by the HAKS cluster's workloads|10.0.0.0/24||
|`connectedIPv6Subnets`	|IPv6 subnet used by the HAKS cluster's workloads|10:101:1::1/64||
|`staticRouteConfiguration`	|IPv4/IPv6 Prefix of the static route |IPv4 10.0.0.0/24 and Ipv6 10:101:1::1/64|
|`staticRouteConfiguration->extension`	|extension flag for internal network static route |NoExtension/NPB|
|`bgpConfiguration`|IPv4 nexthop address|10.0.0.0/24| |
|`defaultRouteOriginate`	| True/False "Enables default route to be originated when advertising routes via BGP" | True | |
|`peerASN`	|Peer ASN of Network Function|65047||
|`allowAS`	|Allows for routes to be received and processed even if the router detects its own ASN in the AS-Path. Input as 0 is disable, Possible values are 1-10, default is 2.|2||
|`allowASOverride`	|Enable Or Disable allowAS|Enable||
|`extension`	|extension flag for internal network|NoExtension/NPB|
|`ipv4ListenRangePrefixes`| BGP IPv4 listen range, maximum range allowed in /28| 10.1.0.0/26 | |
|`ipv6ListenRangePrefixes`| BGP IPv6 listen range, maximum range allowed in /127| 3FFE:FFFF:0:CD30::/126| |
|`ipv4ListenRangePrefixes`| BGP IPv4 listen range, maximum range allowed in /28| 10.1.0.0/26 | |
|`ipv4NeighborAddress`| IPv4 neighbor address|10.0.0.11| |
|`ipv6NeighborAddress`| IPv6 neighbor address|10:101:1::11| |
|`isMonitoringEnabled`| TO enable or disbable monitoring on internal network|False| |


You need to create an internal network before you enable an L3 isolation domain. This command creates an internal network with BGP configuration and a specified peering address:


```azurecli
az networkfabric internalnetwork create 
--resource-group "ResourceGroupName" 
--l3-isolation-domain-name "example-l3domain" 
--resource-name "example-internalnetwork" 
--vlan-id 805 
--connected-ipv4-subnets '[{"prefix":"10.1.2.0/24"}]' 
--mtu 1500 
--bgp-configuration  '{"defaultRouteOriginate": "True", "allowAS": 2, "allowASOverride": "Enable", "PeerASN": 65535, "ipv4ListenRangePrefixes": ["10.1.2.0/28"]}'

```

Expected Output

```json
{
  "administrativeState": "Enabled",
  "bgpConfiguration": {
    "allowAS": 2,
    "allowASOverride": "Enable",
    "defaultRouteOriginate": "True",
    "fabricASN": 65050,
    "ipv4ListenRangePrefixes": [
      "10.1.2.0/28"
    ],
    "peerASN": 65535
  },
  "configurationState": "Succeeded",
  "connectedIPv4Subnets": [
    {
      "prefix": "10.1.2.0/24"
    }
  ],
  "extension": "NoExtension",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain/internalNetworks/example-internalnetwork",
  "isMonitoringEnabled": "True",
  "mtu": 1500,
  "name": "example-internalnetwork",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT04:32:00.8159767Z",
    "createdBy": "email@example.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT04:32:00.8159767Z",
    "lastModifiedBy": "email@example.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/l3isolationdomains/internalnetworks",
  "vlanId": 805
}
```

## Create an untrusted internal network for an L3 isolation domain

```azurecli
az nf internalnetwork create --resource-group "ResourceGroupName" --l3-isolation-domain-name l3untrust --resource-name untrustnetwork --location "eastus" --vlan-id 502 --fabric-asn 65048 --peer-asn 65047--connected-i-pv4-subnets prefix="10.151.3.11/24" --mtu 1500
```
## Create a trusted internal network for an L3 isolation domain

```azurecli
az nf internalnetwork create --resource-group "ResourceGroupName" --l3-isolation-domain-name l3trust --resource-name trustnetwork --location "eastus" --vlan-id 503 --fabric-asn 65048 --peer-asn 65047--connected-i-pv4-subnets prefix="10.151.1.11/24" --mtu 1500
```
## Create an internal management network for an L3 isolation domain

```azurecli
az nf internalnetwork create --resource-group "ResourceGroupName" --l3-isolation-domain-name l3mgmt --resource-name mgmtnetwork --location "eastus" --vlan-id 504 --fabric-asn 65048 --peer-asn 65047--connected-i-pv4-subnets prefix="10.151.2.11/24" --mtu 1500
```





## Create multiple static routes with single next hop

```azurecli
az networkfabric internalnetwork create --resource-group "fab2nfrg180723" --l3-isolation-domain-name "example-l3domain" --resource-name "example-internalNetwork" --vlan-id 2600 --mtu 1500 --connected-ipv4-subnets "[{prefix:'10.2.0.0/24'}]" --static-route-configuration '{extension:NPB,bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},ipv4Routes:[{prefix:'10.3.0.0/24',nextHop:['10.5.0.1']},{prefix:'10.4.0.0/24',nextHop:['10.6.0.1']}]}'

```

Expected Output
```json
{
  "administrativeState": "Enabled",
  "configurationState": "Succeeded",
  "connectedIPv4Subnets": [
    {
      "prefix": "10.2.0.0/24"
    }
  ],
  "extension": "NoExtension",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain/internalNetworks/example-internalnetwork",
  "isMonitoringEnabled": "True",
  "mtu": 1500,
  "name": "example-internalNetwork",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "staticRouteConfiguration": {
    "bfdConfiguration": {
      "administrativeState": "Disabled",
      "intervalInMilliSeconds": 300,
      "multiplier": 5
    },
    "extension": "NoExtension",
    "ipv4Routes": [
      {
        "nextHop": [
          "10.5.0.1"
        ],
        "prefix": "10.3.0.0/24"
      },
      {
        "nextHop": [
          "10.6.0.1"
        ],
        "prefix": "10.4.0.0/24"
      }
    ]
  },
  "systemData": {
    "createdAt": "2023-XX-XXT13:46:26.394343+00:00",
    "createdBy": "email@example.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT13:46:26.394343+00:00",
    "lastModifiedBy": "email@example.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/l3isolationdomains/internalnetworks",
  "vlanId": 2600
}
``` 

## Create Internal network using IPv6

```azurecli
az networkfabric internalnetwork create --resource-group "fab2nfrg180723" --l3-isolation-domain-name "example-l3domain" --resource-name "example-internalnetwork" --vlan-id 2800 --connected-ipv6-subnets '[{"prefix":"10:101:1::0/64"}]' --mtu 1500
```

Expected Output

```json
{
  "administrativeState": "Enabled",
  "configurationState": "Succeeded",
  "connectedIPv6Subnets": [
    {
      "prefix": "10:101:1::0/64"
    }
  ],
  "extension": "NoExtension",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/l3domain2/internalNetworks/example-internalnetwork",
  "isMonitoringEnabled": "True",
  "mtu": 1500,
  "name": "example-internalnetwork",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT10:34:33.933814+00:00",
    "createdBy": "email@example.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT10:34:33.933814+00:00",
    "lastModifiedBy": "email@example.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/l3isolationdomains/internalnetworks",
  "vlanId": 2800
}
```

## Create external networks

External networks enable workloads to have Layer 3 connectivity with your provider edge. They also allow for workloads to interact with external services like firewalls and DNS. You need the fabric ASN (created during network fabric creation) to create external networks.

The commands for creating an external network by using Azure CLI include the following parameters.

|Parameter|Description|Example|Required|
|---|---|---|---|
|peeringOption |Peering using either optionA or optionb. Possible values OptionA and OptionB |OptionB| True|
|optionBProperties | OptionB properties configuration. To specify use exportIPv4/IPv6RouteTargets or importIpv4/Ipv6RouteTargets|"exportIpv4/Ipv6RouteTargets": ["1234:1234"]}}||
|optionAProperties | Configuration of OptionA properties. Please refer to OptionA example in section below |||
|external|This is an optional Parameter to input MPLS Option 10 (B) connectivity to external networks via Provider Edge devices. Using this Option, a user can Input Import and Export Route Targets as shown in the example| || 

For Option A You need to create an external network before you enable the L3 isolation Domain. An external is dependent on Internal network, so an external can't be enabled without an internal network. The vlan-id value should be between 501 and 4095.

## Create an external network using Option B

```azurecli
az networkfabric externalnetwork create --resource-group "ResourceGroupName" --l3domain "examplel3-externalnetwork" --resource-name "examplel3-externalnetwork" --peering-option "OptionB" --option-b-properties "{routeTargets:{exportIpv4RouteTargets:['65045:2001'],importIpv4RouteTargets:['65045:2001']}}"
```

Expected Output

```json

{
  "administrativeState": "Enabled",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain/externalNetworks/examplel3-externalnetwork",
  "name": "examplel3-externalnetwork",
  "optionBProperties": {
    "exportRouteTargets": [
      "65045:2001"
    ],
    "importRouteTargets": [
      "65045:2001"
    ],
    "routeTargets": {
      "exportIpv4RouteTargets": [
        "65045:2001"
      ],
      "importIpv4RouteTargets": [
        "65045:2001"
      ]
    }
  },
  "peeringOption": "OptionB",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT15:45:31.938216+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT15:45:31.938216+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/l3isolationdomains/externalnetworks"
}
```
## Create an external network with Option A

```azurecli
az networkfabric externalnetwork create --resource-group "ResourceGroupName" --l3domain "example-l3domain" --resource-name "example-externalipv4network" --peering-option "OptionA" --option-a-properties '{"peerASN": 65026,"vlanId": 2423, "mtu": 1500, "primaryIpv4Prefix": "10.18.0.148/30", "secondaryIpv4Prefix": "10.18.0.152/30"}'
```

Expected Output

```json
{
  "administrativeState": "Enabled",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain/externalNetworks/example-externalipv4network",
  "name": "example-externalipv4network",
  "optionAProperties": {
    "fabricASN": 65050,
    "mtu": 1500,
    "peerASN": 65026,
    "primaryIpv4Prefix": "10.21.0.148/30",
    "secondaryIpv4Prefix": "10.21.0.152/30",
    "vlanId": 2423
  },
  "peeringOption": "OptionA",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-07-19T09:54:00.4244793Z",
    "createdAt": "2023-XX-XXT07:23:54.396679+00:00", 
    "createdBy": "email@address.com",
    "lastModifiedAt": "2023-XX-XX1T07:23:54.396679+00:00", 
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/l3isolationdomains/externalnetworks"
}
```

### Create an external network creation using Ipv6

```azurecli
az networkfabric externalnetwork create --resource-group "ResourceGroupName" --l3domain "example-l3domain" --resource-name "example-externalipv6network" --peering-option "OptionA" --option-a-properties '{"peerASN": 65026,"vlanId": 2423, "mtu": 1500, "primaryIpv6Prefix": "fda0:d59c:da16::/127", "secondaryIpv6Prefix": "fda0:d59c:da17::/127"}'
```

The supported primary and secondary IPv6 prefix size is /127.

Expected Output

```json
{
  "administrativeState": "Enabled",
  "id": "/subscriptions//xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain/externalNetworks/example-externalipv6network",
  "name": "example-externalipv6network",
  "optionAProperties": {
    "fabricASN": 65050,
    "mtu": 1500,
    "peerASN": 65026,
    "primaryIpv6Prefix": "fda0:d59c:da16::/127",
    "secondaryIpv6Prefix": "fda0:d59c:da17::/127",
    "vlanId": 2423
  },
  "peeringOption": "OptionA",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2022-XX-XXT07:52:26.366069+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2022-XX-XXT07:52:26.366069+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/l3isolationdomains/externalnetworks"
}
```

## Enable an L2 Isolation Domain

```azurecli
az nf l2domain update-administrative-state --resource-group "ResourceGroupName" --resource-name "l2HAnetwork" --state Enable 
```

## Enable an L3 isolation domain

Use this command to enable an untrusted L3 isolation domain:

```azurecli
az nf l3domain update-admin-state --resource-group "ResourceGroupName" --resource-name "l3untrust" --state Enable 
```


Use this command to enable a trusted L3 isolation domain:

```azurecli
az nf l3domain update-admin-state --resource-group "ResourceGroupName" --resource-name "l3trust" --state Enable 
```


Use this command to enable a management L3 isolation domain:

```azurecli
az nf l3domain update-admin-state --resource-group "ResourceGroupName" --resource-name "l3mgmt" --state Enable
```
