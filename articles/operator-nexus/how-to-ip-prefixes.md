---
title: "Azure Operator Nexus: How to create and manage IP prefixes"
description: Learn to create, view, list, update, and delete IP prefixes and IP prefix rules.
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/28/2024
ms.custom: template-how-to
---

# How to create and manage IP prefixes

This article explains the main management operations for IP prefixes and IP prefix rules in Azure Operator Nexus.

## IP prefix operations


### Create an IP prefix


To create an IP prefix resource, follow these steps: 


1.  Specify the properties and rules of the IP prefix resource. You can use the following azcli command as a reference: 

    ```azurecli
    az networkfabric ipprefix create--resource-group myResourceGroup \
      --name myIpPrefix \
      --location eastus \
      --ip-prefix-rules action=Permit condition=EqualTo networkPrefix=10.10.10.0/28 sequenceNumber=10 \
      --ip-prefix-rules action=Permit condition=EqualTo networkPrefix=20.20.20.0/24 sequenceNumber=20
    ```

    The properties and rules of the IP prefix resource are: 

    - `resource-group`: The name of the resource group where you want to create the IP prefix resource. 

    -  `name`: The name of the IP prefix resource. 

    -  `location`: The Azure region where you want to create the IP prefix resource. 

    -  `ip-prefix-rules`: The list of rules that define the match criteria and action for the IP prefix resource. Each rule has the following properties: 


        -  `action`: The action to take when the condition is met. It can be either `Permit` or `Deny`. `Permit` means to allow the route, and `Deny` means to reject the route. 

        -  `condition`: The condition to compare the network prefix of the route with the network prefix of the rule. It can be one of the following values: 

            -  `EqualTo`: The condition is true when the network prefix of the route is equal to the network prefix of the rule. 

            -  `NotEqualTo`: The condition is true when the network prefix of the route isn't equal to the network prefix of the rule. 

            -  `GreaterThanOrEqualTo`: The condition is true when the network prefix of the route is greater than or equal to the network prefix of the rule.

        -  `networkPrefix`: The network segment to match. It's an IP address and a prefix length, such as 10.10.10.0/28 or 2001:db8::/64. For IPv4, the prefix length must be 1-32. For IPv6, the prefix length must be 1-128.

        -  `sequenceNumber`: The order of evaluation of the rule, from lowest to highest. The rule with the lowest sequence number is evaluated first, and the rule with the highest sequence number is evaluated last. If a rule matches the route, the evaluation stops and the action of the rule is executed. If no rule matches the route, the default action is Deny. 


2.  Create the IP prefix resource using the azcli command. You can use the same command as in the previous step, or modify it as per your requirements.

3.  Verify that the IP prefix resource is created successfully. You can use the `az networkfabric ipprefix show` command to show the details of the IP prefix resource. You can use the following example as a reference: 

    ```azurecli
    az networkfabric ipprefix show \
      --resource-group myResourceGroup \
      --name myIpPrefix 
    ```

In this example, `myResourceGroup` is the name of the resource group where you created the IP prefix resource, and `myIpPrefix` is the name of the IP prefix resource. 

The response should contain the properties and rules of the IP prefix resource, such as the ID, type, ipPrefixRules, location, name, provisioningState, resourceGroup, and tags. 

### Show an IP prefix resource

To get the details of an existing IP prefix resource by its ID or name, use the following command: 

```azurecli
# Get the details of an IP prefix resource by its name
az networkfabric ipprefix show \
  --resource-group myResourceGroup \
  --name myIpPrefix
```

The REST API response body is as follows: 

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/myIpPrefix",
  "location": "eastus",
  "name": "myIpPrefix",
  "properties": {
    "ipPrefixRules": [
      {
        "action": "Permit",
        "condition": "EqualTo",
        "networkPrefix": "10.10.10.0/28",
        "sequenceNumber": 10
      },
      {
        "action": "Permit",
        "condition": "EqualTo",
        "networkPrefix": "20.20.20.0/24",
        "sequenceNumber": 20
      }
    ]
  }
}
```

### Updating an IP prefix resource 

To update an IP prefix resource, follow these steps: 

1.  Specify the properties and rules of the IP prefix resource that you want to update. You can use the same JSON template as in the previous section, or modify it as per your requirements. 

2.  Update the IP prefix resource using the Azure CLI command or the REST API method. You can use the following examples as a reference: 

    ```azurecli
    az networkfabric ipprefix update  \
      -g "example-rg" \
      --resource-name "example-ipprefix" \
      --ip-prefix-rules "[{action:Permit,sequenceNumber:4155123341,networkPrefix:'10.10.10.10/30',condition:GreaterThanOrEqualTo,subnetMaskLength:10}]"
    ```

In this example, `resourceGroupName` is the name of the resource group where you created the IP prefix resource, `ipPrefixName` is the name of the IP prefix resource, and the `--add` option adds a new rule to the ipPrefixRules property. The new rule denies routes with network prefix 30.30.30.0/24 and has a sequence number of 30. 

### Deleting an IP prefix resource 

To delete an existing IP prefix resource by its ID or name, use the following command: 

```azurecli
# Delete an IP prefix resource by its name
az networkfabric ipprefix delete \
  --resource-group myResourceGroup \
  --name myIpPrefix
```

The REST API request body for deleting an IP prefix resource by its ID is as follows: 

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/myIpPrefix"
}
```

## Example IP prefix resources

### ipprefixv4-externalnetwork1-export 

This resource is used to manage network traffic rules for a specific external network in a resource group. It contains rules that permit traffic to the 20.20.20.0/24 and 50.50.50.0/24 network prefixes, but deny traffic to the 10.10.10.0/28 network prefix. 


```json
{
  "id": "/subscriptions/.../resourceGroups/.../providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefixv4-externalnetwork1-export",
  "ipPrefixRules": [
    {
      "action": "Deny",
      "condition": "EqualTo",
      "networkPrefix": "10.10.10.0/28",
      "sequenceNumber": 10
    },
    {
      "action": "Permit",
      "condition": "EqualTo",
      "networkPrefix": "20.20.20.0/24",
      "sequenceNumber": 12
    },
    {
      "action": "Permit",
      "condition": "EqualTo",
      "networkPrefix": "50.50.50.0/24",
      "sequenceNumber": 13
    }
  ],
  "location": "eastus",
  "name": "ipprefixv4-externalnetwork1-export",
  "provisioningState": "Succeeded",
  "resourceGroup": "...",
  "type": "microsoft.managednetworkfabric/ipprefixes"
}
```

This resource denies traffic to the 10.10.10.0/28 network prefix and permits traffic to the 20.20.20.0/24 and 50.50.50.0/24 network prefixes.

### ipprefixv4-1204-cn1 

This resource is used to manage network traffic rules for a specific network in a resource group. It contains rules that permit traffic to the 10.10.10.0/28 and 20.20.20.0/24 network prefixes. 

```json
{
  "id": "/subscriptions/.../resourceGroups/.../providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefixv4-1204-cn1",
  "ipPrefixRules": [
    {
      "action": "Permit",
      "condition": "EqualTo",
      "networkPrefix": "10.10.10.0/28",
      "sequenceNumber": 10
    },
    {
      "action": "Permit",
      "condition": "EqualTo",
      "networkPrefix": "20.20.20.0/24",
      "sequenceNumber": 12
    }
  ],
  "location": "eastus",
  "name": "ipprefixv4-1204-cn1",
  "provisioningState": "Succeeded",
  "resourceGroup": "...",
  "type": "microsoft.managednetworkfabric/ipprefixes"
}
```

This resource permits traffic to the 10.10.10.0/28 and 20.20.20.0/24 network prefixes.

### ipprefix-v6-ingress

This resource is located in the `eastus` region and is part of a resource group. It's configured, but currently disabled. The resource is of type `microsoft.managednetworkfabric/ipprefixes`.

The resource has two IP prefix rules: 

1. Permits traffic from network prefixes that are greater than or equal to fda0:d59c:db12::/59 with a subnet mask length of 59. 

2. Permits traffic from network prefixes that are greater than or equal to fc00:f853:ccd:e793::/64 with a subnet mask length of 64. 


```json
{
  "administrativeState": "Disabled",
  "configurationState": "Succeeded",
  "id": "/subscriptions/.../resourceGroups/.../providers/Microsoft.ManagedNetworkFabric/ipprefixes/ipprefix-v6-ingress",
  "ipPrefixRules": [
    {
      "action": "Permit",
      "condition": "GreaterThanOrEqualTo",
      "networkPrefix": "fda0:d59c:db12::/59",
      "sequenceNumber": 10,
      "subnetMaskLength": "59"
    },
    {
      "action": "Permit",
      "condition": "GreaterThanOrEqualTo",
      "networkPrefix": "fc00:f853:ccd:e793::/64",
      "sequenceNumber": 20,
      "subnetMaskLength": "64"
    }
  ],
  "location": "eastus",
  "name": "ipprefix-v6-ingress",
  "provisioningState": "Succeeded",
  "resourceGroup": "...",
  "type": "microsoft.managednetworkfabric/ipprefixes"
}
```

This resource is configured to allow IPv6 traffic from the specified network prefixes.


