---
title: Deploy an IPv6 dual stack application with Basic Load Balancer in Azure virtual network - Resource Manger template
titlesuffix: Azure Virtual Network
description: This article shows how to deploy an IPv6 dual stack application in Azure virtual network using Azure Resource Manager VM templates.
services: load-balancer
author: mbender-ms
manager: kumudD
ms.service: azure-load-balancer
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.date: 03/12/2024
ms.author: mbender
ROBOTS: NOINDEX, NOFOLLOW
---

# Deploy an IPv6 dual stack application with Basic Load Balancer in Azure - Template

This article provides a list of IPv6 configuration tasks with the portion of the Azure Resource Manager VM template that applies to. Use the template described in this article to deploy a dual stack (IPv4 + IPv6) application with Basic Load Balancer that includes a dual stack virtual network with IPv4 and IPv6 subnets, a Basic Load Balancer with dual (IPv4 + IPv6) frontend configurations, VMs with NICs that have a dual IP configuration, network security group, and public IPs.

To deploy a dual stack (IPV4 + IPv6) application using Standard Load Balancer, see [Deploy an IPv6 dual stack application with Standard Load Balancer - Template](../ipv6-configure-standard-load-balancer-template-json.md).

## Required configurations

Search for the template sections in the template to see where they should occur.

### IPv6 addressSpace for the virtual network

Template section to add:

```JSON
        "addressSpace": {
          "addressPrefixes": [
            "[variables('vnetv4AddressRange')]",
            "[variables('vnetv6AddressRange')]"    
```

### IPv6 subnet within the IPv6 virtual network addressSpace

Template section to add:
```JSON
          {
            "name": "V6Subnet",
            "properties": {
              "addressPrefix": "[variables('subnetv6AddressRange')]"
            }

```

### IPv6 configuration for the NIC

Template section to add:
```JSON
          {
            "name": "ipconfig-v6",
            "properties": {
              "privateIPAllocationMethod": "Dynamic",
          "privateIPAddressVersion":"IPv6",
              "subnet": {
                "id": "[variables('v6-subnet-id')]"
              },
              "loadBalancerBackendAddressPools": [
                {
                  "id": "[concat(resourceId('Microsoft.Network/loadBalancers','loadBalancer'),'/backendAddressPools/LBBAP-v6')]"
                }
```

### IPv6 network security group (NSG) rules

```JSON
          {
            "name": "default-allow-rdp",
            "properties": {
              "description": "Allow RDP",
              "protocol": "Tcp",
              "sourcePortRange": "33819-33829",
              "destinationPortRange": "5000-6000",
              "sourceAddressPrefix": "fd00:db8:deca:deed::/64",
              "destinationAddressPrefix": "fd00:db8:deca:deed::/64",
              "access": "Allow",
              "priority": 1003,
              "direction": "Inbound"
            }
```

## Conditional configuration

If you're using a network virtual appliance, add IPv6 routes in the Route Table. Otherwise, this configuration is optional.

```JSON
    {
      "type": "Microsoft.Network/routeTables",
      "name": "v6route",
      "apiVersion": "[variables('ApiVersion')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "routes": [
          {
            "name": "v6route",
            "properties": {
              "addressPrefix": "fd00:db8:deca:deed::/64",
              "nextHopType": "VirtualAppliance",
              "nextHopIpAddress": "fd00:db8:ace:f00d::1"
            }
```

## Optional configuration

### IPv6 Internet access for the virtual network

```JSON
{
            "name": "LBFE-v6",
            "properties": {
              "publicIPAddress": {
                "id": "[resourceId('Microsoft.Network/publicIPAddresses','lbpublicip-v6')]"
              }
```

### IPv6 Public IP addresses

```JSON
    {
      "apiVersion": "[variables('ApiVersion')]",
      "type": "Microsoft.Network/publicIPAddresses",
      "name": "lbpublicip-v6",
      "location": "[resourceGroup().location]",
      "properties": {
        "publicIPAllocationMethod": "Dynamic",
        "publicIPAddressVersion": "IPv6"
      }
```

### IPv6 Front end for Load Balancer

```JSON
          {
            "name": "LBFE-v6",
            "properties": {
              "publicIPAddress": {
                "id": "[resourceId('Microsoft.Network/publicIPAddresses','lbpublicip-v6')]"
              }
```

### IPv6 Backend address pool for Load Balancer

```JSON
              "backendAddressPool": {
                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', 'loadBalancer'), '/backendAddressPools/LBBAP-v6')]"
              },
              "protocol": "Tcp",
              "frontendPort": 8080,
              "backendPort": 8080
            },
            "name": "lbrule-v6"
```

### IPv6 load balancer rules to associate incoming and outgoing ports

```JSON
          {
            "name": "ipconfig-v6",
            "properties": {
              "privateIPAllocationMethod": "Dynamic",
          "privateIPAddressVersion":"IPv6",
              "subnet": {
                "id": "[variables('v6-subnet-id')]"
              },
              "loadBalancerBackendAddressPools": [
                {
                  "id": "[concat(resourceId('Microsoft.Network/loadBalancers','loadBalancer'),'/backendAddressPools/LBBAP-v6')]"
                }
```

## Sample VM template JSON
To deploy an IPv6 dual stack application with Basic Load Balancer in Azure virtual network using Azure Resource Manager template, view sample template [here](https://azure.microsoft.com/resources/templates/ipv6-in-vnet/).

## Next steps

You can find details about pricing for [public IP addresses](https://azure.microsoft.com/pricing/details/ip-addresses/), [network bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/), or [Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/).
