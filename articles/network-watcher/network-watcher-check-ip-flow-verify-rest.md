---
title: Verify traffic with Azure Network Watcher IP flow verify - REST | Microsoft Docs
description: This article describes how to check if traffic to or from a virtual machine is allowed or denied
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: 3307a79f-03be-46a0-aaaf-b2079cb5f3b2
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace

---
# Check if traffic is allowed or denied with IP flow verify a component of Azure Network Watcher

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-check-ip-flow-verify-portal.md)
> - [PowerShell](network-watcher-check-ip-flow-verify-powershell.md)
> - [CLI 1.0](network-watcher-check-ip-flow-verify-cli-nodejs.md)
> - [CLI 2.0](network-watcher-check-ip-flow-verify-cli.md)
> - [Azure REST API](network-watcher-check-ip-flow-verify-rest.md)


IP flow verify is a feature of Network Watcher that allows you to verify if traffic is allowed to or from a virtual machine. The validation can be run for incoming or outgoing traffic. This scenario is useful to get a current state of whether a virtual machine can talk to an external resource or backend. IP flow verify can be used to verify if your Network Security Group (NSG) rules are properly configured and troubleshoot flows that are being blocked by NSG rules. Another reason for using IP flow verify is to ensure traffic that you want blocked is being blocked properly by the NSG.

## Before you begin

ARMclient is used to call the REST API using PowerShell. ARMClient is found on chocolatey at [ARMClient on Chocolatey](https://chocolatey.org/packages/ARMClient)

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher.

## Scenario

This scenario uses IP flow Verify to verify if a virtual machine can talk to another machine over port 443. If the traffic is denied, it returns the security rule that is denying that traffic. To learn more about IP flow Verify, visit [IP flow verify overview](network-watcher-ip-flow-verify-overview.md)

In this scenario, you:

* Retrieve a virtual machine
* Call IP flow verify
* Verify results

## Log in with ARMClient

```PowerShell
armclient login
```

## Retrieve a virtual machine

Run the following script to return a virtual machine. The following code needs values for the variables:

* **subscriptionId** - The subscription Id to use.
* **resourceGroupName** - The name of a resource group that contains virtual machines.

```powershell
$subscriptionId = "<subscription id>"
$resourceGroupName = "<resource group name>"

armclient get https://management.azure.com/subscriptions/${subscriptionId}/ResourceGroups/${resourceGroupName}/providers/Microsoft.Compute/virtualMachines?api-version=2015-05-01-preview
```

The information that is needed is the id under the type `Microsoft.Compute/virtualMachines`. The results should be similar to the following code sample:

```json
...,
        "networkProfile": {
          "networkInterfaces": [
            {
              "id": "/subscriptions/{00000000-0000-0000-0000-000000000000}/resourceGroups/ContosoExampleRG/providers/Microsoft
.Network/networkInterfaces/contosovm842"
            }
          ]
        },
        "provisioningState": "Succeeded"
      },
      "resources": [
        {
          "id": "/subscriptions/{00000000-0000-0000-0000-000000000000}/resourceGroups/ContosoExampleRG/providers/Microsoft.Com
pute/virtualMachines/ContosoVM/extensions/CustomScriptExtension"
        }
      ],
      "type": "Microsoft.Compute/virtualMachines",
      "location": "westcentralus",
      "id": "/subscriptions/{00000000-0000-0000-0000-000000000000}/resourceGroups/ContosoExampleRG/providers/Microsoft.Compute
/virtualMachines/ContosoVM",
      "name": "ContosoVM"
    }
  ]
}
```

## Call IP flow Verify

The following example creates a request to verify the traffic for a specified virtual machine. The response returns if the traffic is allowed or if the traffic is denied. If traffic is denied it also returns what rule blocks the traffic.

> [!NOTE]
> IP flow verify requires that the VM resource is allocated.

The script requires the resource Id of a virtual machine and of a network interface card on the virtual machine. These values are provided by the preceding output.

> [!Important]
> For all Network Watcher REST calls the resource group name in the request URI is the one that contains the Network Watcher instance, not the resources you are performing the diagnostic actions on.

```powershell
$subscriptionId = "<subscription id>"
$resourceGroupName = "<resource group name>"
$networkWatcherName = "<network watcher name>"
$vmName = "<vm name>"
$vmNICName = "<vm NIC name>"
$direction = "<direction of traffic>" # Examples are: Inbound or Outbound
$localIP = "<source IP>"
$localPort = "<source Port>"
$remoteIP = "<destination IP>"
$remotePort = "<destination Port>" # Examples are: 80, or 80-120
$protocol = "<UDP, TCP or *>"
$targetUri = "<uri of target resource>" # Example: /subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.compute/virtualMachine/${vmName}
$targetNic = "<uri of target nic resource>" # Example: /subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkInterfaces/${vmNICName}

$requestBody = @"
{
    'targetResourceId':  '$targetUri',
    'direction':  '$direction',
    'protocol':  '$protocol',
    'localPort':  '$localPort',
    'remotePort':  '$remotePort',
    'localIPAddress':  '$localIP',
    'remoteIPAddress':  '$remoteIP',
    'targetNICResourceId':  '$targetNic'
}
"@
        
armclient post "https://management.azure.com/subscriptions/${subscriptionId}/ResourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkWatchers/${networkWatcherName}/ipFlowVerify?api-version=2016-12-01" $requestBody -verbose
```

## Understanding the results

The response you get back tells you whether the traffic is allowed or denied. The response looks like one of the following examples:

**Allowed**

```json
{
  "access": "Allow",
  "ruleName": "defaultSecurityRules/AllowInternetOutBound"
}
```

**Denied**

```json
{
  "access": "Deny",
  "ruleName": "defaultSecurityRules/DefaultInboundDenyAll"
}
```

## Next steps

If traffic is being blocked and it should not be, see [Manage Network Security Groups](../virtual-network/virtual-network-manage-nsg-arm-portal.md) to learn more about Network Security Groups.












