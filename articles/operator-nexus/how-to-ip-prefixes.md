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

# Overview

This article explains the main management operations for IP prefixes and IP prefix rules in Azure Operator Nexus.


## IP prefixes

### Create an IP prefix


To create an IP Prefix resource, follow these steps: 


1.  Specify the properties and rules of the IP Prefix resource. You can use the following azcli command as a reference: 

    ```azurecli
    az networkfabric ipprefix create--resource-group myResourceGroup \
      --name myIpPrefix \
      --location eastus \
      --ip-prefix-rules action=Permit condition=EqualTo networkPrefix=10.10.10.0/28 sequenceNumber=10 \
      --ip-prefix-rules action=Permit condition=EqualTo networkPrefix=20.20.20.0/24 sequenceNumber=20
    ```

    The properties and rules of the IP Prefix resource are: 

    - `resource-group`: The name of the resource group where you want to create the IP Prefix resource. 

    -  `name`: The name of the IP Prefix resource. 

    -  `location`: The Azure region where you want to create the IP Prefix resource. 

    -  `ip-prefix-rules`: The list of rules that define the match criteria and action for the IP Prefix resource. Each rule has the following properties: 


        -  `action`: The action to take when the condition is met. It can be either Permit or Deny. Permit means to allow the route, and Deny means to reject the route. 

        -  `condition`: The condition to compare the network prefix of the route with the network prefix of the rule. It can be one of the following values: 

            -  `EqualTo`: The condition is true when the network prefix of the route is equal to the network prefix of the rule. 

            -  `NotEqualTo`: The condition is true when the network prefix of the route isn't equal to the network prefix of the rule. 

            -  `GreaterThanOrEqualTo`: The condition is true when the network prefix of the route is greater than or equal to the network prefix of the rule.


        -  `networkPrefix`: The network segment to match. It's specified as an IP address and a prefix length, such as 10.10.10.0/28 or 2001:db8::/64. 

        -  `sequenceNumber`: The order of evaluation of the rule, from lowest to highest. The rule with the lowest sequence number is evaluated first, and the rule with the highest sequence number is evaluated last. If a rule matches the route, the evaluation stops and the action of the rule is executed. If no rule matches the route, the default action is Deny. 


1.  Create the IP Prefix resource using the azcli command. You can use the same command as in the previous step, or modify it as per your requirements.

3.  Verify that the IP Prefix resource is created successfully. You can use the `az networkfabric ipprefix show` command to show the details of the IP Prefix resource. You can use the following example as a reference: 

    ```azurecli
    networkfabric ipprefix show \
      --resource-group myResourceGroup \
      --name myIpPrefix 
    ```

In this example, `myResourceGroup` is the name of the resource group where you created the IP Prefix resource, and `myIpPrefix` is the name of the IP Prefix resource. 

The response should contain the properties and rules of the IP Prefix resource, such as the id, type, ipPrefixRules, location, name, provisioningState, resourceGroup, and tags. 

### Show an IP Prefix resource

To get the details of an existing IP Prefix resource by its ID or name, use the following command: 

```azurecli
# Get the details of an IP Prefix resource by its name
az networkfabric ipprefix show \
  --resource-group myResourceGroup \
  --name myIpPrefix
```

The REST API response body for getting the details of an IP Prefix resource by its ID is as follows: 

```
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

## Updating an IP Prefix Resource 

To update an IP Prefix resource, follow these steps: 

1.  Specify the properties and rules of the IP Prefix resource that you want to update. You can use the same JSON template as in the previous section, or modify it as per your requirements. 

2.  Update the IP Prefix resource using the Azure CLI command or the REST API method. You can use the following examples as a reference: 

    ```azurecli
    az networkfabric ipprefix update  \
      -g "example-rg" \
      --resource-name "example-ipprefix" \
      --ip-prefix-rules "[{action:Permit,sequenceNumber:4155123341,networkPrefix:'10.10.10.10/30',condition:GreaterThanOrEqualTo,subnetMaskLength:10}]"
    ```

In this example, `resourceGroupName` is the name of the resource group where you created the IP Prefix resource, `ipPrefixName` is the name of the IP Prefix resource, and the `--add` option adds a new rule to the ipPrefixRules property. The new rule denies routes with network prefix 30.30.30.0/24 and has a sequence number of 30. 



