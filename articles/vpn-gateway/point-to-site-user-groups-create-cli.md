---
title: 'Assign Users IP Addresses from Defined Pools for P2S VPN Connections - Azure CLI'
titleSuffix: Azure VPN Gateway
description: Learn how to configure user groups and assign IP addresses from specific address pools based on identity or authentication credentials for VPN Gateway point-to-site (P2S) connections using Azure CLI.
author: fabferri
ms.author: duau
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 07/16/2026
---

# Assign IP addresses from defined pools to P2S VPN users - Azure CLI

You can assign users connecting to your Point-to-site (P2S) VPN gateway IP addresses from specific address pools based on their identity or authentication credentials by creating Policy Groups (User Groups). This article helps you configure Policy Groups, Group Members, and prioritize groups using Azure CLI. For more information about working with Policy Groups and Group Members for P2S connections, including considerations and limitations, see [About User Groups](point-to-site-user-groups-about.md).

## Prerequisites

This article assumes you have a VPN Gateway P2S configuration. If you haven't already set up a P2S VPN gateway, see the following articles:

* Configure a P2S VPN gateway with **certificate authentication**:
  * For **Portal** see, [Configure server settings for P2S VPN Gateway certificate authentication](point-to-site-certificate-gateway.md)
  * For **PowerShell** see, [P2S VPN Gateway certificate authentication - PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
* Steps to configure a P2S VPN Gateway with **Microsoft Entra ID authentication** see, [P2S VPN Gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md)
* To configure an Azure VPN client, see the [VPN Client Configuration Table](point-to-site-about.md#client).

[!INCLUDE [Azure CLI requirements](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Workflow

This article uses the following workflow to help you set up user groups and IP address pools for your P2S VPN Gateway connection.

1. Consider configuration requirements.
1. Choose an authentication mechanism.
1. Create a User Group.
1. Configure gateway settings.

## Consider configuration requirements

This section lists configuration requirements and limitations for user groups and IP address pools.

[!INCLUDE [User groups configuration considerations](../../includes/virtual-wan-user-groups-considerations.md)]

* Address pools can't overlap with address pools used in other connection configurations (same or different gateways).
* Address pools also can't overlap with virtual network address spaces, virtual hub address spaces, or on-premises addresses.
* Address pools can't be smaller than /24. For example, you can't assign a range of /25 or /26.

## Choose authentication mechanism

The following sections list available authentication mechanisms that you can use when creating user groups.

### Microsoft Entra groups

To create and manage Microsoft Entra groups, see [Manage Microsoft Entra groups and group membership](../active-directory/fundamentals/how-to-manage-groups.md).

* Specify the Microsoft Entra user group **object ID** (not the group name) as part of the point-to-site configuration.

  * For this specific case, use:

    * Engineering group as `aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb`
    * Finance group as `bbbbbbbb-1111-2222-3333-cccccccccccc`

    :::image type="content" source="./media/point-to-site-user-groups-create/groups.png" alt-text="Diagram of Microsoft Entra ID groups and Object IDs." lightbox="./media/point-to-site-user-groups-create/groups.png":::

* You can assign Microsoft Entra users to be part of multiple Active Directory groups, and VPN Gateway considers users to be part of the VPN user or policy. If a user belongs to multiple groups, the group that has the lowest numerical priority is selected in the point-to-site connection.

### RADIUS - NPS vendor-specific attributes

For Network Policy Server (NPS) vendor-specific attributes configuration information, see [RADIUS - configure NPS for vendor-specific attributes](point-to-site-user-groups-radius.md).

### Certificates

To generate self-signed certificates, see [Generate and export certificates for point-to-site using PowerShell](vpn-gateway-certificates-point-to-site.md). To generate a certificate with a specific Common Name, change the **Subject** parameter to the appropriate value (example, xx@domain.com) when running the [New-SelfSignedCertificate](/powershell/module/pki/new-selfsignedcertificate) PowerShell command. For example, you can generate certificates with the following **Subject**:

|Digital certificate field|Value|Description  |
|---|---|--|
| **Subject**| CN= cert@marketing.contoso.com| digital certificate for Marketing department|
| **Subject**| CN= cert@sale.contoso.com| digital certificate for Sale department|

The multiple address pool feature with digital certificate authentication applies to a specific user group based on the **Subject** field. The selection criteria don't work with Subject Alternative Name (SAN) certificates.

If you want to specify a SAN in their certificates, it must be the same as the Subject for the multipool feature to function correctly. Discrepancy between the Subject and SAN results in issues.

## Create user groups

### 1. Declare your variables

```azurecli-interactive
rg="p2s-multipool"
location="eastus"
vnetName="VNet1"
vNetAddressPrefix="10.1.0.0/16"
gatewaySubnetPrefix="10.1.0.0/24"
gatewayName="gw"

# Name of the first public IP address of the gateway
gwpip="${gatewayName}-pip"

# Local folder that holds the exported root certificate (P2SRoot.cer).
# The gateway-create command references the .cer file by this path.
pathFiles="$(pwd)"
certPath="$pathFiles/cert"
```

### 2. Connect to your account and create the virtual network

Open your Bash console and connect to your account. For more information, see [Manage Azure resources by using Azure CLI](../azure-resource-manager/management/manage-resources-cli.md). Use the following sample to help you connect:

```azurecli-interactive
az account set --subscription <YourSubscriptionName>
az account show
```

Create the resource group, virtual network, gateway subnet, and the public IP address for the gateway.

```azurecli-interactive
# create a Resource Group
az group create --name "$rg" --location "$location"

# create an Azure VNet
az network vnet create \
  --name "$vnetName" \
  --resource-group "$rg" \
  --location "$location" \
  --address-prefixes "$vNetAddressPrefix"

# create the GatewaySubnet
az network vnet subnet create \
  --name "GatewaySubnet" \
  --vnet-name "$vnetName" \
  --resource-group "$rg" \
  --address-prefixes "$gatewaySubnetPrefix"

# create the first public IP of the VPN Gateway
az network public-ip create \
  --name "$gwpip" \
  --resource-group "$rg" \
  --location "$location" \
  --allocation-method Static \
  --sku Standard \
  --tier Regional \
  --zone 1 2 3
```

### 3. Plan your user groups

In this scenario, consider four user groups: two user groups that use digital certificate authentication and two user groups that use Microsoft Entra ID authentication.

* Two groups use client certificates with common names.

  * `yourServiceName@marketing.contoso.com`
  * `yourServiceName@sale.contoso.com`

* Two groups created in Microsoft Entra ID. The following object IDs are examples; replace them with your actual Microsoft Entra group object IDs.

  * Engineering group `aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb`
  * Finance `bbbbbbbb-1111-2222-3333-cccccccccccc`

### 4. Create the VPN gateway and add P2S configuration

The following configuration sets up the VPN gateway to use a client address pool and authentication options:

* Certificate-based authentication: **Certificate**
* Microsoft Entra ID: **AAD**

For more information about P2S Microsoft Entra ID authentication values, see [Configure P2S VPN Gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).

Export the public data of your root certificate in .cer format and save it as *P2SRoot.cer* in the `cert` folder referenced by the `$certPath` variable. The .cer file holds only the public certificate, not the private key. Reference this file by its full path in the `--root-cert-data` parameter of the following command.

Next, create the virtual network gateway. In the following command, replace the following values:

* The tenant ID in `--aad-tenant` and `--aad-issuer` (the example uses `aaaabbbb-0000-cccc-1111-dddd2222eeee`) with your Microsoft Entra tenant ID.
* **--aad-audience** with the corresponding value for the Microsoft-registered Azure VPN Client App ID. You can also use [custom audience](point-to-site-entra-register-custom-app.md) in this field.
* **192.168.0.0/24** with the address pool to connect VPN clients not belonging to the multiple address pool configuration.

```azurecli-interactive
# Create the VPN Gateway with VpnGw2AZ SKU.
# $certPath/P2SRoot.cer is the local root certificate file to upload to the gateway.
# The .cer file holds only the public certificate, not the private key.
az network vnet-gateway create \
  --name "$gatewayName" \
  --resource-group "$rg" \
  --location "$location" \
  --vnet "$vnetName" \
  --gateway-type Vpn \
  --vpn-type RouteBased \
  --sku VpnGw2AZ \
  --public-ip-addresses "$gwpip" \
  --address-prefixes "192.168.0.0/24" \
  --client-protocol IkeV2 OpenVPN \
  --vpn-auth-type Certificate AAD \
  --root-cert-name "P2SRootcert" \
  --root-cert-data "$certPath/P2SRoot.cer" \
  --aad-tenant "https://login.microsoftonline.com/aaaabbbb-0000-cccc-1111-dddd2222eeee" \
  --aad-issuer "https://sts.windows.net/aaaabbbb-0000-cccc-1111-dddd2222eeee/" \
  --aad-audience "c632b3df-fb67-4d84-bdcf-b95ad541b5c8"
```

It can take about 45 minutes or more to create the VPN gateway.

### 5. Verify the VPN gateway

```azurecli-interactive
# shows the gateway configuration, including the P2S client address pool and the root certificate.
az network vnet-gateway show \
  --name "$gatewayName" \
  --resource-group "$rg"
```

### 6. Create policy groups and members

Using Azure CLI, define each policy group along with its members as a JSON object. Configure four members, one for each group:

* `member1` and `member2` use digital certificate authentication (authentication type: **CertificateGroupId**).
* `member3` and `member4` use Microsoft Entra ID authentication (authentication type: **AADGroupId**).

  * The example object IDs `aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb` and `bbbbbbbb-1111-2222-3333-cccccccccccc` represent two different group IDs in your Microsoft Entra ID tenant. Replace them with your actual group object IDs.

|Member Name| Authentication Type| Attribute Value     |
|------------|-------------------|---------------------|
|member1     |CertificateGroupId |marketing.contoso.com|
|member2     |CertificateGroupId |sale.contoso.com     |
|member3     |AADGroupId         |`aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb`|
|member4     |AADGroupId         |`bbbbbbbb-1111-2222-3333-cccccccccccc`|

Create the four policy groups with the default policy and priority described in the following table:

|Policy group name|Default policy|Priority|
|-----------------|--------------|--------|
|policyGroup1     |true          |0       |
|policyGroup2     |false         |1       |
|policyGroup3     |false         |2       |
|policyGroup4     |false         |3       |

```azurecli-interactive
# policyGroup1 - default group, priority 0, member1 (CertificateGroupId)
policyGroup1='{
  "name": "policyGroup1",
  "properties": {
    "isDefault": true,
    "priority": 0,
    "policyMembers": [
      {
        "name": "member1",
        "attributeType": "CertificateGroupId",
        "attributeValue": "marketing.contoso.com"
      }
    ]
  }
}'

# policyGroup2 - priority 1, member2 (CertificateGroupId)
policyGroup2='{
  "name": "policyGroup2",
  "properties": {
    "isDefault": false,
    "priority": 1,
    "policyMembers": [
      {
        "name": "member2",
        "attributeType": "CertificateGroupId",
        "attributeValue": "sale.contoso.com"
      }
    ]
  }
}'

# policyGroup3 - priority 2, member3 (AADGroupId)
policyGroup3='{
  "name": "policyGroup3",
  "properties": {
    "isDefault": false,
    "priority": 2,
    "policyMembers": [
      {
        "name": "member3",
        "attributeType": "AADGroupId",
        "attributeValue": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"
      }
    ]
  }
}'

# policyGroup4 - priority 3, member4 (AADGroupId)
policyGroup4='{
  "name": "policyGroup4",
  "properties": {
    "isDefault": false,
    "priority": 3,
    "policyMembers": [
      {
        "name": "member4",
        "attributeType": "AADGroupId",
        "attributeValue": "bbbbbbbb-1111-2222-3333-cccccccccccc"
      }
    ]
  }
}'
```

> [!NOTE]
> The Microsoft Entra group object IDs shown (for example, `aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb`) are sample values. Replace them with the actual object IDs from your Microsoft Entra ID tenant.

### 7. Add policy groups to the VPN gateway

The following configuration adds the four gateway policy groups to the VPN gateway. These groups authorize connections by using digital certificates that specify a value in the Common Name (CN) field and Microsoft Entra ID groups that specify the group Object IDs:

* policyGroup1: marketing.contoso.com, member1
* policyGroup2: sale.contoso.com, member2
* policyGroup3: `aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb`, member3
* policyGroup4: `bbbbbbbb-1111-2222-3333-cccccccccccc`, member4

```azurecli-interactive
# Repeat the --add flag, one per policy group.
az network vnet-gateway update \
  --name "$gatewayName" \
  --resource-group "$rg" \
  --add virtualNetworkGatewayPolicyGroups "$policyGroup1" \
  --add virtualNetworkGatewayPolicyGroups "$policyGroup2" \
  --add virtualNetworkGatewayPolicyGroups "$policyGroup3" \
  --add virtualNetworkGatewayPolicyGroups "$policyGroup4"
```

Show the list of policy group names:

```azurecli-interactive
# List the current policy groups in order.
# index order: the first entry is index 0, the second is index 1, and so on.
az network vnet-gateway show \
  --name "$gatewayName" \
  --resource-group "$rg" \
  --query "virtualNetworkGatewayPolicyGroups[].name" \
  --output tsv
```

Visualize all the properties of a specific policy group:

```azurecli-interactive
# Show the properties of a specific group, for example policyGroup2:
az network vnet-gateway show \
  --name "$gatewayName" \
  --resource-group "$rg" \
  --query "virtualNetworkGatewayPolicyGroups[?name=='policyGroup2']" \
  --output json
```

### 8. Create VPN client connection configurations

The VPN configuration defines four distinct address pools, each linked to a specific policy group.

|VPN client Configuration Name|Address Pool| PolicyGroup|
|---|---|---|
|config1| 192.168.1.0/24| policyGroup1: marketing.contoso.com|
|config2| 192.168.2.0/24| policyGroup2: sale.contoso.com|
|config3| 192.168.3.0/24| policyGroup3: Engineering `aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb`|
|config4| 192.168.4.0/24| policyGroup4: Finance `bbbbbbbb-1111-2222-3333-cccccccccccc`|

> [!NOTE]
> The example pools (**192.168.1.0/24**, **192.168.2.0/24**, and so on) use a documentation-safe range. Replace them with real address ranges for your environment. Each pool must be at least a /24, can't overlap with the other pools or with the default gateway address pool, and can't overlap with your virtual network, virtual hub, or on-premises address spaces.

First, retrieve the ID of each policy group:

```azurecli-interactive
# Create per-policy-group P2S client connection configurations with dedicated pools.
policyGroup1Id=$(az network vnet-gateway show -g "$rg" -n "$gatewayName" --query "virtualNetworkGatewayPolicyGroups[?name=='policyGroup1'].id | [0]" -o tsv)

policyGroup2Id=$(az network vnet-gateway show -g "$rg" -n "$gatewayName" --query "virtualNetworkGatewayPolicyGroups[?name=='policyGroup2'].id | [0]" -o tsv)

policyGroup3Id=$(az network vnet-gateway show -g "$rg" -n "$gatewayName" --query "virtualNetworkGatewayPolicyGroups[?name=='policyGroup3'].id | [0]" -o tsv)

policyGroup4Id=$(az network vnet-gateway show -g "$rg" -n "$gatewayName" --query "virtualNetworkGatewayPolicyGroups[?name=='policyGroup4'].id | [0]" -o tsv)
```

Next, load the VPN client configuration in JSON format into the variables `vngClientConnConfig1`, `vngClientConnConfig2`, `vngClientConnConfig3`, and `vngClientConnConfig4`:

```azurecli-interactive
read -r -d '' vngClientConnConfig1 <<EOF
{
  "name": "config1",
  "properties": {
    "virtualNetworkGatewayPolicyGroups": [
      { "id": "$policyGroup1Id" }
    ],
    "vpnClientAddressPool": {
      "addressPrefixes": ["192.168.1.0/24"]
    }
  }
}
EOF

read -r -d '' vngClientConnConfig2 <<EOF
{
  "name": "config2",
  "properties": {
    "virtualNetworkGatewayPolicyGroups": [
      { "id": "$policyGroup2Id" }
    ],
    "vpnClientAddressPool": {
      "addressPrefixes": ["192.168.2.0/24"]
    }
  }
}
EOF

read -r -d '' vngClientConnConfig3 <<EOF
{
  "name": "config3",
  "properties": {
    "virtualNetworkGatewayPolicyGroups": [
      { "id": "$policyGroup3Id" }
    ],
    "vpnClientAddressPool": {
      "addressPrefixes": ["192.168.3.0/24"]
    }
  }
}
EOF

read -r -d '' vngClientConnConfig4 <<EOF
{
  "name": "config4",
  "properties": {
    "virtualNetworkGatewayPolicyGroups": [
      { "id": "$policyGroup4Id" }
    ],
    "vpnClientAddressPool": {
      "addressPrefixes": ["192.168.4.0/24"]
    }
  }
}
EOF
```

### 9. Apply configurations to the VPN gateway

```azurecli-interactive
az network vnet-gateway update \
  --name "$gatewayName" \
  --resource-group "$rg" \
  --add vpnClientConfiguration.vngClientConnectionConfigurations "$vngClientConnConfig1" \
  --add vpnClientConfiguration.vngClientConnectionConfigurations "$vngClientConnConfig2" \
  --add vpnClientConfiguration.vngClientConnectionConfigurations "$vngClientConnConfig3" \
  --add vpnClientConfiguration.vngClientConnectionConfigurations "$vngClientConnConfig4"
```

List the VPN client connection configurations in index order.

```azurecli-interactive
# list of vpn client connection configs (index order)
az network vnet-gateway show \
  --name "$gatewayName" \
  --resource-group "$rg" \
  --query "vpnClientConfiguration.vngClientConnectionConfigurations[].name" -o tsv
```

At the end of the multiple address pool setting, the configuration can be represented by the following logical structure:

|Policy group name|Default policy|Priority|Authentication type| Group configuration value| VPN Client address pool|
|-----------------|--------------|--------|-------------------|--------------------------| ----------------------|
|policyGroup1     |true          |0       |CertificateGroupId |marketing.contoso.com     | 192.168.1.0/24        |
|policyGroup2     |false         |1       |CertificateGroupId |sale.contoso.com          | 192.168.2.0/24        |
|policyGroup3     |false         |2       |AADGroupId         |`aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb`| 192.168.3.0/24        |
|policyGroup4     |false         |3       |AADGroupId         |`bbbbbbbb-1111-2222-3333-cccccccccccc`| 192.168.4.0/24        |

## View address pool configurations

Use the following commands to view the address pools associated with your policy groups.

```azurecli-interactive
# Show the address pool associated with a policy group
az network vnet-gateway show \
  --name "$gatewayName" \
  --resource-group "$rg" \
  --query "vpnClientConfiguration.vngClientConnectionConfigurations[?name=='config1'].vpnClientAddressPool.addressPrefixes[]" \
  --output tsv

# Show the config name of the address pool configuration and the associated address pool(s)
az network vnet-gateway show \
  --name "$gatewayName" \
  --resource-group "$rg" \
  --query "vpnClientConfiguration.vngClientConnectionConfigurations[].{config:name,addressPools:join(', ', vpnClientAddressPool.addressPrefixes)}" \
  --output table
```

You can also show the policy group name, config name, and associated address pool together:

```azurecli-interactive
# show policy group name, config name, and associated address pool(s)
az network vnet-gateway show -n "$gatewayName" -g "$rg" -o json |
jq -r '.vpnClientConfiguration.vngClientConnectionConfigurations[]? |
  [(.virtualNetworkGatewayPolicyGroups[0].id // "" | split("/")[-1]),
   (.name // ""),
   (.vpnClientAddressPool.addressPrefixes // [] | join(", "))] | @tsv' |
column -t -s $'\t'
```

## Remove address pool configurations

To remove a specific address pool configuration, use `--remove` in Azure CLI to remove a list element by its zero-based index. Check the ordered list first, then remove the matching position.

```azurecli-interactive
# Remove an address pool configuration
# Az CLI removes a list element by its zero-based INDEX with --remove.
# You check the ordered list first, then remove the matching position (index 3 = the 4th group, policyGroup4).
az network vnet-gateway update \
  --name "$gatewayName" \
  --resource-group "$rg" \
  --remove vpnClientConfiguration.vngClientConnectionConfigurations 3

# Remove the policyGroup4
az network vnet-gateway update \
  --name "$gatewayName" \
  --resource-group "$rg" \
  --remove virtualNetworkGatewayPolicyGroups 3
```

To remove all policy groups and address pool configurations:

```azurecli-interactive
# Removing all policy groups and address pools
az network vnet-gateway update \
  --name "$gatewayName" \
  --resource-group "$rg" \
  --set vpnClientConfiguration.vngClientConnectionConfigurations=[] \
  --set virtualNetworkGatewayPolicyGroups=[]
```

## If things go wrong

[!INCLUDE [Troubleshooting policy groups and IP address pools for P2S connections](../networking/includes/vpn-gateway/policy-groups-ts.md)]

## Next step

> [!div class="nextstepaction"]
> [About user groups and IP address pools for point-to-site](point-to-site-user-groups-about.md)
