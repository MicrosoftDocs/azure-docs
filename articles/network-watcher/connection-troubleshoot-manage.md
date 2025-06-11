---
title: Troubleshoot outbound connections
titleSuffix: Azure Network Watcher
description: Learn how to use the connection troubleshoot feature of Azure Network Watcher to troubleshoot outbound connections.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 03/18/2025

#CustomerIntent: As an Azure administrator, I want to learn how to use Connection Troubleshoot to diagnose outbound connectivity issues in Azure using the Azure portal, Powershell, or Azure CLI.
---

# Troubleshoot outbound connections

In this article, you learn how to use the connection troubleshoot feature of Azure Network Watcher to diagnose and troubleshoot connectivity issues. For more information about connection troubleshoot, see [Connection troubleshoot overview](connection-troubleshoot-overview.md).

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Network Watcher enabled in the region of the virtual machine (VM) you want to troubleshoot. By default, Azure enables Network Watcher in a region when you create a virtual network in it. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md).

- A virtual machine with Network Watcher agent VM extension installed on it and has the following outbound TCP connectivity:
    - to 169.254.169.254 over port 80
    - to 168.63.129.16 over port 8037

- A second virtual machine with inbound TCP connectivity from 168.63.129.16 over the port being tested (for Port scanner diagnostic test).

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Network Watcher enabled in the region of the virtual machine (VM) you want to troubleshoot. By default, Azure enables Network Watcher in a region when you create a virtual network in it. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md).

- A virtual machine with Network Watcher agent VM extension installed on it and has the following outbound TCP connectivity:
    - to 169.254.169.254 over port 80
    - to 168.63.129.16 over port 8037

- A second virtual machine with inbound TCP connectivity from 168.63.129.16 over the port being tested (for Port scanner diagnostic test).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also install Azure PowerShell locally to run the cmdlets. This article requires the Az PowerShell module. For more information, see [How to install Azure PowerShell](/powershell/azure/install-azure-powershell). If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Network Watcher enabled in the region of the virtual machine (VM) you want to troubleshoot. By default, Azure enables Network Watcher in a region when you create a virtual network in it. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md).

- A virtual machine with Network Watcher agent VM extension installed on it and has the following outbound TCP connectivity:
    - to 169.254.169.254 over port 80
    - to 168.63.129.16 over port 8037

- A second virtual machine with inbound TCP connectivity from 168.63.129.16 over the port being tested (for Port scanner diagnostic test).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

---

> [!NOTE]
>  The Network Watcher agent VM extension is required on the source virtual machine to run the connection troubleshoot *connectivity test*. The extension is automatically installed on the virtual machine when using the Azure portal. If you don't have the extension installed, you can install it manually:
> - To install the extension on a Windows virtual machine, see [Network Watcher agent VM extension for Windows](network-watcher-agent-windows.md).
> - To install the extension on a Linux virtual machine, see [Network Watcher agent VM extension for Linux](network-watcher-agent-linux.md).
> - To update an already installed extension, see [Update Network Watcher agent VM extension to the latest version](network-watcher-agent-update.md).


## Test connectivity to a virtual machine

In this section, you test the remote desktop port (RDP) connectivity from one virtual machine to another virtual machine in the same virtual network.

# [**Portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** from the search results.

    :::image type="content" source="./media/network-watcher-portal-search.png" alt-text="Screenshot that shows how to search for Network Watcher in the Azure portal." lightbox="./media/network-watcher-portal-search.png":::

1. Under **Network diagnostic tools**, select **Connection troubleshoot**. Enter or select the following values:

    | Setting | Value  |
    | ------- | ------ |
    | **Source** |  |
    | Source type | Select **Virtual machine**. |
    | Virtual machine | Select the virtual machine that you want to troubleshoot the connection from. |
    | **Destination** |  |
    | Destination type | Select **Select a virtual machine**. |
    | Virtual machine | Select the destination virtual machine. |
    | **Probe Settings** |  |
    | Preferred IP version | Select **IPv4**. The other available options are: **Both** and **IPv6**. |
    | Protocol | Select **TCP**. The other available option is: **ICMP**. |
    | Destination port | Enter **3389**. Port 3389 is the default port for RDP. |
    | Source port | Leave blank or enter a source port number that you want to test. |
    | **Connection Diagnostic** |  |
    | Diagnostics tests | Select **Connectivity**, **NSG diagnostic**, **Next hop**, and **Port scanner**. |

    :::image type="content" source="./media/connection-troubleshoot-manage/test-connectivity-vm.png" alt-text="Screenshot that shows Network Watcher connection troubleshoot in Azure portal to test the connection between two virtual machines." lightbox="./media/connection-troubleshoot-manage/test-connectivity-vm.png":::

1. Select **Run diagnostic tests**.

    - If the two virtual machines are communicating with no issues, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-manage/connectivity-allowed.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection between two virtual machines that are communicating with no issues." lightbox="./media/connection-troubleshoot-manage/connectivity-allowed.png":::

        - 66 probes were successfully sent to the destination virtual machine. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is allowed. Select **See details** to see the security rules that are allowing the outbound communication from the source virtual machine.
        - Inbound connectivity to the destination virtual machine is allowed. Select **See details** to see the security rules that are allowing the inbound communication to the destination virtual machine.
        - Azure default system route is used to route traffic between the two virtual machines (Route table ID: System route).
        - Port 3389 is reachable on the destination virtual machine.

    - If the destination virtual machine has a network security group that's denying incoming RDP connections, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-manage/connectivity-denied-destination.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection to a virtual machine that has a denying inbound security rule." lightbox="./media/connection-troubleshoot-manage/connectivity-denied-destination.png":::

        - 30 probes were sent and failed to reach the destination virtual machine. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is allowed. Select **See details** to see the security rules that are allowing the outbound communication from the source virtual machine.
        - Inbound connectivity to the destination virtual machine is denied. Select **See details** to see the security rule that is denying the inbound communication to the destination virtual machine.
        - Azure default system route is used to route traffic between the two virtual machines (Route table ID: System route).
        - Port 3389 is unreachable on the destination virtual machine because of the security rule that is denying inbound communication to the destination port.
        
        **Solution**: Update the network security group on the destination virtual machine to allow inbound RDP traffic.

    - If the source virtual machine has a network security group that's denying RDP connections to the destination, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-manage/connectivity-denied-source.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection from a virtual machine that has a denying outbound security rule." lightbox="./media/connection-troubleshoot-manage/connectivity-denied-source.png":::

        - 30 probes were sent and failed to reach the destination virtual machine. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is denied. Select **See details** to see security rule that is denying the outbound communication from the source virtual machine.
        - Inbound connectivity to the destination virtual machine is allowed. Select **See details** to see the security rules that are allowing the inbound communication to the destination virtual machine.
        - Azure default system route is used to route traffic between the two virtual machines (Route table ID: System route).
        - Port 3389 is reachable on the destination virtual machine.
        
        **Solution**: Update the network security group on the source virtual machine to allow outbound RDP traffic.

    - If the operating system on the destination virtual machine doesn't accept incoming connections on port 3389, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-manage/connectivity-denied-destination-port.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection to a virtual machine that isn't listening on the tested port." lightbox="./media/connection-troubleshoot-manage/connectivity-denied-destination-port.png":::

        - 30 probes were sent and failed to reach the destination virtual machine. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is allowed. Select **See details** to see the security rules that are allowing the outbound communication from the source virtual machine.
        - Inbound connectivity to the destination virtual machine is allowed. Select **See details** to see the security rules that are allowing the inbound communication to the destination virtual machine.
        - Azure default system route is used to route traffic between the two virtual machines (Route table ID: System route).
        - Port 3389 isn't reachable on the destination virtual machine (port 3389 on the operating system isn't accepting incoming RDP connections).
        
        **Solution**: Configure the operating system on the destination virtual machine to accept inbound RDP traffic.

1. Select **Export to CSV** to download the test results in csv format.

# [**PowerShell**](#tab/powershell)

Use [Test-AzNetworkWatcherConnectivity](/powershell/module/az.network/test-aznetworkwatcherconnectivity) cmdlet to run connection troubleshoot to test the connectivity to a virtual machine over port 3389:

```azurepowershell-interactive
# Test connectivity between two virtual machines that are in the same resource group over port 3389.
Test-AzNetworkWatcherConnectivity -Location 'eastus' -SourceId '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup1/providers/Microsoft.Compute/virtualMachines/VM1' -DestinationId '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup2/providers/Microsoft.Compute/virtualMachines/VM2' -DestinationPort '3389'  | Format-List
```

- If the two virtual machines are communicating with no issues, you see the following results:

    ```json
    Hops             : {aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb, bbbbbbbb-1111-2222-3333-cccccccccccc}
    ConnectionStatus : Reachable
    AvgLatencyInMs   : 1
    MinLatencyInMs   : 1
    MaxLatencyInMs   : 1
    ProbesSent       : 66
    ProbesFailed     : 0
    HopsText         : [
                         {
                           "Type": "Source",
                           "Id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
                           "Address": "10.0.0.4",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
                           "NextHopIds": [
                             "bbbbbbbb-1111-2222-3333-cccccccccccc"
                           ],
                           "Issues": []
                         },
                         {
                           "Type": "VirtualMachine",
                           "Id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
                           "Address": "10.0.0.5",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM2",
                           "NextHopIds": [],
                           "Issues": []
                         }
                       ]
    ```

    - Connection status is **Reachable** (destination virtual machine is reachable over port 3389).
    - 66 probes were successfully sent to the destination virtual machine.
    - There are two hops in the path between the two virtual machines (no appliances or other resources in the path between the two VMs).


- If the destination virtual machine has a network security group that's denying incoming RDP connections, you see the following results:

    ```json
    Hops             : {aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb, bbbbbbbb-1111-2222-3333-cccccccccccc}
    ConnectionStatus : Unreachable
    AvgLatencyInMs   : 
    MinLatencyInMs   : 
    MaxLatencyInMs   : 
    ProbesSent       : 30
    ProbesFailed     : 30
    HopsText         : [
                         {
                           "Type": "Source",
                           "Id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
                           "Address": "10.0.0.4",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
                           "NextHopIds": [
                             "bbbbbbbb-1111-2222-3333-cccccccccccc"
                           ],
                           "Issues": []
                         },
                         {
                           "Type": "VirtualMachine",
                           "Id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
                           "Address": "10.0.0.5",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM2",
                           "NextHopIds": [],
                           "Issues": [
                             {
                               "Origin": "Inbound",
                               "Severity": "Error",
                               "Type": "NetworkSecurityRule",
                               "Context": [
                                 {
                                   "key": "RuleName",
                                   "value": 
                       "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/VM2-nsg/SecurityRules/Deny3389Inbound"
                                 }
                               ]
                             },
                             {
                               "Origin": "Local",
                               "Severity": "Error",
                               "Type": "NoListenerOnDestination",
                               "Context": []
                             }
                           ]
                         }
                       ]
    ```

    - Connection status is **Unreachable** (destination virtual machine is unreachable over port 3389).
    - 30 probes were sent and failed to reach the destination virtual machine.
    - There are two hops in the path between the two virtual machines (no appliances or other resources in the path between the two VMs).
    - Inbound connectivity to the destination virtual machine is denied by the security rule `Deny3389Inbound` in the network security group `VM2-nsg`.

    **Solution**: Update the network security group on the destination virtual machine to allow inbound RDP traffic.

- If the source virtual machine has a network security group that's denying RDP connections to the destination, you see the following results:

    ```json
    Hops             : {aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb, bbbbbbbb-1111-2222-3333-cccccccccccc}
    ConnectionStatus : Unreachable
    AvgLatencyInMs   : 
    MinLatencyInMs   : 
    MaxLatencyInMs   : 
    ProbesSent       : 30
    ProbesFailed     : 30
    HopsText         : [
                         {
                           "Type": "Source",
                           "Id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
                           "Address": "10.0.0.4",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
                           "NextHopIds": [
                             "bbbbbbbb-1111-2222-3333-cccccccccccc"
                           ],
                           "Issues": [
                             {
                               "Origin": "Outbound",
                               "Severity": "Error",
                               "Type": "NetworkSecurityRule",
                               "Context": [
                                 {
                                   "key": "RuleName",
                                   "value": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/VM1-nsg/SecurityRules/Deny3389Outbound"
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "Type": "VirtualMachine",
                           "Id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
                           "Address": "10.0.0.5",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM2",
                           "NextHopIds": [],
                           "Issues": [
                             {
                               "Origin": "Local",
                               "Severity": "Error",
                               "Type": "NoListenerOnDestination",
                               "Context": []
                             }
                           ]
                         }
                       ]
    ```

    - Connection status is **Unreachable** (destination virtual machine is unreachable over port 3389).
    - 30 probes were sent and failed to reach the destination virtual machine.
    - There are two hops in the path between the two virtual machines (no appliances or other resources in the path between the two VMs).
    - Outbound connectivity from the source virtual machine is denied by the security rule `Deny3389Outbound` in the network security group `VM1-nsg`.
  
    **Solution**: Update the network security group on the source virtual machine to allow outbound RDP traffic.

- If the operating system on the destination virtual machine doesn't accept incoming connections on port 3389, you see the following results:

    ```json
    Hops             : {aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb, bbbbbbbb-1111-2222-3333-cccccccccccc}
    ConnectionStatus : Unreachable
    AvgLatencyInMs   : 
    MinLatencyInMs   : 
    MaxLatencyInMs   : 
    ProbesSent       : 30
    ProbesFailed     : 30
    HopsText         : [
                         {
                           "Type": "Source",
                           "Id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
                           "Address": "10.0.0.4",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
                           "NextHopIds": [
                             "bbbbbbbb-1111-2222-3333-cccccccccccc"
                           ],
                           "Issues": []
                         },
                         {
                           "Type": "VirtualMachine",
                           "Id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
                           "Address": "10.0.0.5",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM2",
                           "NextHopIds": [],
                           "Issues": [
                             {
                               "Origin": "Local",
                               "Severity": "Error",
                               "Type": "NoListenerOnDestination",
                               "Context": []
                             },
                             {
                               "Origin": "Local",
                               "Severity": "Error",
                               "Type": "GuestFirewall",
                               "Context": []
                             }
                           ]
                         }
                       ]
    ```

    - Connection status is **Unreachable** (destination virtual machine is unreachable over port 3389).
    - 30 probes were sent and failed to reach the destination virtual machine.
    - There are two hops in the path between the two virtual machines (no appliances or other resources in the path between the two VMs).
    - Port 3389 isn't reachable on the destination virtual machine (the output has `NoListenerOnDestination` and `GuestFirewall` errors on the destination virtual machine). 

    **Solution**: Configure the operating system on the destination virtual machine to accept inbound RDP traffic.

# [**Azure CLI**](#tab/cli)

Use [az network watcher test-connectivity](/cli/azure/network/watcher#az-network-watcher-test-connectivity) command to run connection troubleshoot diagnostic tests to test the connectivity to a virtual machine over port 3389:

```azurecli-interactive
# Test connectivity between two virtual machines that are in the same resource group over port 3389.
az network watcher test-connectivity --resource-group 'myResourceGroup' --source-resource 'VM1' --dest-resource 'VM2' --protocol 'TCP' --dest-port '3389'
```

> [!NOTE]
> If the virtual machines aren't in the same resource group, use their resource IDs instead of their names. For example, use the following command to test connectivity between two virtual machines that are in two different resource groups:
> 
> ```azurecli-interactive
> # Test connectivity between two virtual machines that are in two different resource groups over port 3389.
> az network watcher test-connectivity --source-resource '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup1/providers/Microsoft.Compute/virtualMachines/VM1' --dest-resource '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup2/providers/Microsoft.Compute/virtualMachines/VM2' --protocol 'TCP' --dest-port '3389'
> ```

- If the two virtual machines are communicating with no issues, you see the following results:

    ```json
    {
      "avgLatencyInMs": 1,
      "connectionStatus": "Reachable",
      "hops": [
        {
          "address": "10.0.0.4",
          "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
          "issues": [],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "bbbbbbbb-1111-2222-3333-cccccccccccc",
              "resourceId": "",
              "roundTripTimeAvg": 1,
              "roundTripTimeMax": 1,
              "roundTripTimeMin": 1
            }
          ],
          "nextHopIds": [
            "bbbbbbbb-1111-2222-3333-cccccccccccc"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.0.0.5",
          "id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
          "issues": [],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
              "resourceId": ""
            }
          ],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM2",
          "type": "VirtualMachine"
        }
      ],
      "maxLatencyInMs": 1,
      "minLatencyInMs": 1,
      "probesFailed": 0,
      "probesSent": 66
    }
    ```

    - Connection status is **Reachable** (destination virtual machine is reachable over port 3389).
    - 66 probes were successfully sent to the destination virtual machine.
    - There are two hops in the path between the two virtual machines (no appliances or other resources in the path between the two VMs).

- If the destination virtual machine has a network security group that's denying incoming RDP connections, you see the following results:

    ```json
    {
      "connectionStatus": "Unreachable",
      "hops": [
        {
          "address": "10.0.0.4",
          "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
          "issues": [],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "bbbbbbbb-1111-2222-3333-cccccccccccc",
              "resourceId": ""
            }
          ],
          "nextHopIds": [
            "bbbbbbbb-1111-2222-3333-cccccccccccc"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.0.0.5",
          "id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
          "issues": [
            {
              "context": [
                {
                  "key": "RuleName",
                  "value": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/VM2-nsg/SecurityRules/Deny3389Inbound"
                }
              ],
              "origin": "Inbound",
              "severity": "Error",
              "type": "NetworkSecurityRule"
            },
            {
              "context": [],
              "origin": "Local",
              "severity": "Error",
              "type": "NoListenerOnDestination"
            }
          ],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
              "resourceId": ""
            }
          ],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM2",
          "type": "VirtualMachine"
        }
      ],
      "probesFailed": 30,
      "probesSent": 30
    }
    ```

    - Connection status is **Unreachable** (destination virtual machine is unreachable over port 3389).
    - 30 probes were sent and failed to reach the destination virtual machine.
    - There are two hops in the path between the two virtual machines (no appliances or other resources in the path between the two VMs).
    - Inbound connectivity to the destination virtual machine is denied by the security rule `Deny3389Inbound` in the network security group `VM2-nsg`.

    **Solution**: Update the network security group on the destination virtual machine to allow inbound RDP traffic.

- If the source virtual machine has a network security group that's denying RDP connections to the destination, you see the following results:

    ```json
    {
      "connectionStatus": "Unreachable",
      "hops": [
        {
          "address": "10.0.0.4",
          "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
          "issues": [
            {
              "context": [
                {
                  "key": "RuleName",
                  "value": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/VM1-nsg/SecurityRules/Deny3389Outbound"
                }
              ],
              "origin": "Outbound",
              "severity": "Error",
              "type": "NetworkSecurityRule"
            }
          ],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "bbbbbbbb-1111-2222-3333-cccccccccccc",
              "resourceId": ""
            }
          ],
          "nextHopIds": [
            "bbbbbbbb-1111-2222-3333-cccccccccccc"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.0.0.5",
          "id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
          "issues": [
            {
              "context": [],
              "origin": "Local",
              "severity": "Error",
              "type": "NoListenerOnDestination"
            }
          ],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
              "resourceId": ""
            }
          ],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM2",
          "type": "VirtualMachine"
        }
      ],
      "probesFailed": 30,
      "probesSent": 30
    }
    ```

    - Connection status is **Unreachable** (destination virtual machine is unreachable over port 3389).
    - 30 probes were sent and failed to reach the destination virtual machine.
    - There are two hops in the path between the two virtual machines (no appliances or other resources in the path between the two VMs).
    - Outbound connectivity from the source virtual machine is denied by the security rule `Deny3389Outbound` in the network security group `VM1-nsg`.
  
    **Solution**: Update the network security group on the source virtual machine to allow outbound RDP traffic.

- If the operating system on the destination virtual machine doesn't accept incoming connections on port 3389, you see the following results:

    ```json
    {
      "connectionStatus": "Unreachable",
      "hops": [
        {
          "address": "10.0.0.4",
          "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
          "issues": [],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "bbbbbbbb-1111-2222-3333-cccccccccccc",
              "resourceId": ""
            }
          ],
          "nextHopIds": [
            "bbbbbbbb-1111-2222-3333-cccccccccccc"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.0.0.5",
          "id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
          "issues": [
            {
              "context": [],
              "origin": "Local",
              "severity": "Error",
              "type": "NoListenerOnDestination"
            },
            {
              "context": [],
              "origin": "Local",
              "severity": "Error",
              "type": "GuestFirewall"
            }
          ],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
              "resourceId": ""
            }
          ],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM2",
          "type": "VirtualMachine"
        }
      ],
      "probesFailed": 30,
      "probesSent": 30
    }
    ```

    - Connection status is **Unreachable** (destination virtual machine is unreachable over port 3389).
    - 30 probes were sent and failed to reach the destination virtual machine.
    - There are two hops in the path between the two virtual machines (no appliances or other resources in the path between the two VMs).
    - Port 3389 isn't reachable on the destination virtual machine (the output has `NoListenerOnDestination` and `GuestFirewall` errors on the destination virtual machine). 

    **Solution**: Configure the operating system on the destination virtual machine to accept inbound RDP traffic.

---

## Test connectivity to a web address

In this section, you test the connectivity between a virtual machine and a web address.

# [**Portal**](#tab/portal)

1. On the **Connection troubleshoot** page. Enter or select the following information:

    | Setting | Value  |
    | ------- | ------ |
    | **Source** |  |
    | Source type | Select **Virtual machine**. |
    | Virtual machine | Select the virtual machine that you want to troubleshoot the connection from. |
    | **Destination** |  |
    | Destination type | Select **Specify manually**. |
    | URI, FQDN, or IP address | Enter the web address that you want to test the connectivity to. In this example, `www.bing.com` is used. |
    | **Probe Settings** |  |
    | Preferred IP version | Select **Both**. The other available options are: **IPv4** and **IPv6**. |
    | Protocol | Select **TCP**. The other available option is: **ICMP**. |
    | Destination port | Enter **443**. Port 443 for HTTPS. |
    | Source port | Leave blank or enter a source port number that you want to test. |
    | **Connection Diagnostic** |  |
    | Diagnostics tests | Select **Connectivity**. |

    :::image type="content" source="./media/connection-troubleshoot-manage/test-connectivity-bing.png" alt-text="Screenshot that shows connection troubleshoot in the Azure portal to test the connection between a virtual machine and Microsoft Bing website." lightbox="./media/connection-troubleshoot-manage/test-connectivity-bing.png":::

1. Select **Run diagnostic tests**.

    - If `www.bing.com` is reachable from the source virtual machine, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-manage/test-connectivity-bing-reachable.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection with Microsoft Bing website." lightbox="./media/connection-troubleshoot-manage/test-connectivity-bing-reachable.png":::

        66 probes were successfully sent to `www.bing.com`. Select **See details** to see the next hop details.

    - If `www.bing.com` is unreachable from the source virtual machine due to a security rule, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-manage/test-connectivity-bing-unreachable.png" alt-text="Screenshot that shows connection troubleshoot results after unsuccessfully testing the connection with Microsoft Bing website." lightbox="./media/connection-troubleshoot-manage/test-connectivity-bing-unreachable.png":::

        30 probes were sent and failed to reach `www.bing.com`. Select **See details** to see the next hop details and the cause of the error.

        **Solution**: Update the network security group on the source virtual machine to allow outbound traffic to `www.bing.com`.

1. Select **Export to CSV** to download the test results in csv format.

# [**PowerShell**](#tab/powershell)

Use [Test-AzNetworkWatcherConnectivity](/powershell/module/az.network/test-aznetworkwatcherconnectivity) cmdlet to run connection troubleshoot to test the connectivity to `www.bing.com`:

```azurepowershell-interactive
# Test connectivity from a virtual machine to www.bing.com.
Test-AzNetworkWatcherConnectivity -Location 'eastus' -SourceId '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1' -DestinationAddress 'www.bing.com' -DestinationPort '443' | Format-List
```

- If `www.bing.com` is reachable from the source virtual machine, you see the following results:

    ```json
    Hops             : {aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb, bbbbbbbb-1111-2222-3333-cccccccccccc}
    ConnectionStatus : Reachable
    AvgLatencyInMs   : 1
    MinLatencyInMs   : 1
    MaxLatencyInMs   : 6
    ProbesSent       : 66
    ProbesFailed     : 0
    HopsText         : [
                         {
                           "Type": "Source",
                           "Id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
                           "Address": "10.0.0.4",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
                           "NextHopIds": [
                             "bbbbbbbb-1111-2222-3333-cccccccccccc"
                           ],
                           "Issues": []
                         },
                         {
                           "Type": "Internet",
                           "Id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
                           "Address": "150.171.30.10",
                           "NextHopIds": [],
                           "Issues": []
                         }
                       ]
    ```

    - Connection status is **Reachable** (`www.bing.com` is reachable from **VM1**).
    - 66 probes were successfully sent to `www.bing.com` with average latency of 9 ms.
    - Next hop type is `Internet`.

- If `www.bing.com` is unreachable from the source virtual machine due to a security rule, you see the following results:

    ```json
    Hops             : {aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb, bbbbbbbb-1111-2222-3333-cccccccccccc}
    ConnectionStatus : Unreachable
    AvgLatencyInMs   : 
    MinLatencyInMs   : 
    MaxLatencyInMs   : 
    ProbesSent       : 30
    ProbesFailed     : 30
    HopsText         : [
                         {
                           "Type": "Source",
                           "Id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
                           "Address": "10.0.0.4",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
                           "NextHopIds": [
                             "bbbbbbbb-1111-2222-3333-cccccccccccc"
                           ],
                           "Issues": [
                             {
                               "Origin": "Outbound",
                               "Severity": "Error",
                               "Type": "NetworkSecurityRule",
                               "Context": [
                                 {
                                   "key": "RuleName",
                                   "value": 
                       "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/VM1-nsg/SecurityRules/DenyInternetOutbound"
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "Type": "Internet",
                           "Id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
                           "Address": "203.0.113.184",
                           "NextHopIds": [],
                           "Issues": []
                         }
                       ]
    ```

    - Connection status is **Unreachable** (`www.bing.com` isn't reachable from **VM1**).
    - 30 probes were sent and failed to reach `www.bing.com`.
    - Outbound connectivity from the source virtual machine is denied by the security rule `DenyInternetOutbound` in the network security group `VM1-nsg`.
    - Next hop type is `Internet`.

    **Solution**: Update the network security group on the source virtual machine to allow outbound traffic to `www.bing.com`.


# [**Azure CLI**](#tab/cli)

Use [az network watcher test-connectivity](/cli/azure/network/watcher#az-network-watcher-test-connectivity) command to run connection troubleshoot to test the connectivity to `www.bing.com`:

```azurecli-interactive
# Test connectivity from a virtual machine to www.bing.com.
az network watcher test-connectivity --resource-group 'myResourceGroup' --source-resource 'VM1' --dest-address 'www.bing.com' --protocol 'TCP' --dest-port '443'
```

- If `www.bing.com` is reachable from the source virtual machine, you see the following results:

    ```json
    {
      "avgLatencyInMs": 9,
      "connectionStatus": "Reachable",
      "hops": [
        {
          "address": "10.0.0.4",
          "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
          "issues": [],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "Internet",
              "nextHopId": "bbbbbbbb-1111-2222-3333-cccccccccccc",
              "resourceId": "",
              "roundTripTimeAvg": 9,
              "roundTripTimeMax": 9,
              "roundTripTimeMin": 9
            }
          ],
          "nextHopIds": [
            "bbbbbbbb-1111-2222-3333-cccccccccccc"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "104.117.244.81",
          "id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
          "issues": [],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "Internet",
              "nextHopId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
              "resourceId": ""
            }
          ],
          "type": "Internet"
        }
      ],
      "maxLatencyInMs": 13,
      "minLatencyInMs": 7,
      "probesFailed": 0,
      "probesSent": 66
    }
    ```

    - Connection status is **Reachable** (`www.bing.com` is reachable from **VM1**).
    - 66 probes were successfully sent to `www.bing.com` with average latency of 9 ms.
    - Next hop type is `Internet`.

- If `www.bing.com` is unreachable from the source virtual machine due to a security rule, you see the following results:

    ```json
    {
      "connectionStatus": "Unreachable",
      "hops": [
        {
          "address": "10.0.0.4",
          "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
          "issues": [
            {
              "context": [
                {
                  "key": "RuleName",
                  "value": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/VM1-nsg/SecurityRules/DenyInternetOutbound"
                }
              ],
              "origin": "Outbound",
              "severity": "Error",
              "type": "NetworkSecurityRule"
            }
          ],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "Internet",
              "nextHopId": "bbbbbbbb-1111-2222-3333-cccccccccccc",
              "resourceId": ""
            }
          ],
          "nextHopIds": [
            "bbbbbbbb-1111-2222-3333-cccccccccccc"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "203.0.113.184",
          "id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
          "issues": [],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "Internet",
              "nextHopId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
              "resourceId": ""
            }
          ],
          "type": "Internet"
        }
      ],
      "probesFailed": 30,
      "probesSent": 30
    }
    ```
    
    - Connection status is **Unreachable** (`www.bing.com` isn't reachable from **VM1**).
    - 30 probes were sent and failed to reach `www.bing.com`.
    - Outbound connectivity from the source virtual machine is denied by the security rule `DenyInternetOutbound` in the network security group `VM1-nsg`.
    - Next hop type is `Internet`.

    **Solution**: Update the network security group on the source virtual machine to allow outbound traffic to `www.bing.com`.

---

## Test connectivity to an IP address

In this section, you test the connectivity between a virtual machine and an IP address of another virtual machine.

# [**Portal**](#tab/portal)

1. On the **Connection troubleshoot** page. Enter or select the following information:

    | Setting | Value  |
    | ------- | ------ |
    | **Source** |  |
    | Source type | Select **Virtual machine**. |
    | Virtual machine | Select the virtual machine that you want to troubleshoot the connection from. |
    | **Destination** |  |
    | Destination type | Select **Specify manually**. |
    | URI, FQDN, or IP address | Enter the IP address that you want to test the connectivity to. In this example, `10.10.10.10` is used. |
    | **Probe Settings** |  |
    | Preferred IP version | Select **IPv4**. The other available options are: **Both** and **IPv6**. |
    | Protocol | Select **TCP**. The other available option is: **ICMP**. |
    | Destination port | Enter **3389**. |
    | Source port | Leave blank or enter a source port number that you want to test. |
    | **Connection Diagnostic** |  |
    | Diagnostics tests | Select **Connectivity**, **NSG diagnostic**, and **Next hop**. |

    :::image type="content" source="./media/connection-troubleshoot-manage/test-connectivity-ip.png" alt-text="Screenshot that shows connection troubleshoot in the Azure portal to test the connection between a virtual machine and an IP address." lightbox="./media/connection-troubleshoot-manage/test-connectivity-ip.png":::

1. Select **Run diagnostic tests**.

    - If the IP address is reachable, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-manage/ip-reachable.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection to a reachable IP address." lightbox="./media/connection-troubleshoot-manage/ip-reachable.png":::

        - 66 probes were successfully sent with average latency of 4 ms. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is allowed. Select **See details** to see the security rules that are allowing the outbound communication from the source virtual machine.
        - Azure default system route is used to route traffic to the IP address, which is in the same virtual network or a peered virtual network. (Route table ID: System route and Next hop type: Virtual Network).

    - If the IP address is unreachable because the destination virtual machine isn't running, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-manage/ip-unreachable-vm-stopped.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection to an IP address of a stopped virtual machine." lightbox="./media/connection-troubleshoot-manage/ip-unreachable-vm-stopped.png":::

        - 30 probes were sent and failed to reach the destination virtual machine. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is allowed. Select **See details** to see the security rules that are allowing the outbound communication from the source virtual machine.
        - Azure default system route is used to route traffic to the IP address, which is in the same virtual network or a peered virtual network. (Route table ID: System route and Next hop type: Virtual Network).
        
        **Solution**: Start the destination virtual machine.

    - If there's no route to the IP address in the routing table of the source virtual machine (for example, the IP address isn't in the address space of the VM's virtual network or its peered virtual networks), you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-manage/ip-unreachable-route-table.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection to unreachable IP address with no route in the routing table." lightbox="./media/connection-troubleshoot-manage/ip-unreachable-route-table.png":::

        - 30 probes were sent and failed to reach the destination virtual machine. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is denied. Select **See details** to see security rule that is denying the outbound communication from the source virtual machine.
        - Next hop type is *None* because there isn't a route to the IP address.
        
        **Solution**: Associate a route table with a correct route to the subnet of the source virtual machine.

1. Select **Export to CSV** to download the test results in csv format.

# [**PowerShell**](#tab/powershell)

Use [Test-AzNetworkWatcherConnectivity](/powershell/module/az.network/test-aznetworkwatcherconnectivity) cmdlet to run connection troubleshoot to test RDP connectivity to `10.10.10.10`:

```azurepowershell-interactive
# Test connectivity from a virtual machine to 10.10.10.10 over port 3389.
Test-AzNetworkWatcherConnectivity -Location 'eastus' -SourceId '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1' -DestinationAddress '10.10.10.10' -DestinationPort '3389' | Format-List
```

- If the IP address is reachable, you see the following results:
    ```json
    Hops             : {aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb, bbbbbbbb-1111-2222-3333-cccccccccccc}
    ConnectionStatus : Reachable
    AvgLatencyInMs   : 1
    MinLatencyInMs   : 1
    MaxLatencyInMs   : 3
    ProbesSent       : 66
    ProbesFailed     : 8
    HopsText         : [
                         {
                           "Type": "Source",
                           "Id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
                           "Address": "10.0.0.4",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
                           "NextHopIds": [
                             "bbbbbbbb-1111-2222-3333-cccccccccccc"
                           ],
                           "Issues": []
                         },
                         {
                           "Type": "VirtualNetwork",
                           "Id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
                           "Address": "10.10.10.10",
                           "NextHopIds": [],
                           "Issues": []
                         }
                       ]
    ```

    - Connection status is **Reachable** (`10.10.10.10` is reachable over port 3389).
    - 66 probes were successfully sent to `10.10.10.10` with average latency of 2 ms.
    - There are two hops in the path between the two virtual machines (no appliances or other resources in the path between the two VMs). 

- If the IP address is unreachable because the destination virtual machine isn't running, you see the following results: 

    ```json
    Hops             : {aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb, bbbbbbbb-1111-2222-3333-cccccccccccc}
    ConnectionStatus : Unreachable
    AvgLatencyInMs   : 
    MinLatencyInMs   : 
    MaxLatencyInMs   : 
    ProbesSent       : 30
    ProbesFailed     : 30
    HopsText         : [
                         {
                           "Type": "Source",
                           "Id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
                           "Address": "10.0.0.4",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
                           "NextHopIds": [
                             "bbbbbbbb-1111-2222-3333-cccccccccccc"
                           ],
                           "Issues": []
                         },
                         {
                           "Type": "VirtualNetwork",
                           "Id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
                           "Address": "10.10.10.10",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup1/providers/Microsoft.Network/networkInterfaces/vm2375/ipConfigurations/ipconfig1",
                           "NextHopIds": [],
                           "Issues": []
                         }
                       ]
    ```

    - Connection status is **Unreachable** (`10.10.10.10` is unreachable over port 3389).
    - 30 probes were sent and failed to reach `10.10.10.10`.
    - No issues in the source virtual machine.
    - No issues with `10.10.10.10`.
    
    **Solution**: Start the destination virtual machine.

- If there's no route to the IP address in the routing table of the source virtual machine (for example, the IP address isn't in the address space of the VM's virtual network or its peered virtual networks), you see the following results: 

    ```json
    Hops             : {aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb, bbbbbbbb-1111-2222-3333-cccccccccccc}
    ConnectionStatus : Unreachable
    AvgLatencyInMs   : 
    MinLatencyInMs   : 
    MaxLatencyInMs   : 
    ProbesSent       : 30
    ProbesFailed     : 30
    HopsText         : [
                         {
                           "Type": "Source",
                           "Id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
                           "Address": "10.0.0.4",
                           "ResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
                           "NextHopIds": [
                             "bbbbbbbb-1111-2222-3333-cccccccccccc"
                           ],
                           "Issues": [
                             {
                               "Origin": "Local",
                               "Severity": "Error",
                               "Type": "RouteMissing",
                               "Context": []
                             },
                             {
                               "Origin": "Outbound",
                               "Severity": "Error",
                               "Type": "UserDefinedRoute",
                               "Context": [
                                 {
                                   "key": "ErrorMessage",
                                   "value": "NextHop Type None, NextHop IP "
                                 }
                               ]
                             },
                             {
                               "Origin": "Outbound",
                               "Severity": "Error",
                               "Type": "NetworkSecurityRule",
                               "Context": [
                                 {
                                   "key": "RuleName",
                                   "value": "DefaultRule_DenyAllOutBound"
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "Type": "Destination",
                           "Id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
                           "Address": "10.10.10.10",
                           "NextHopIds": [],
                           "Issues": []
                         }
                       ]
    ```

    - Connection status is **Unreachable** (`10.10.10.10` is unreachable over port 3389).
    - 30 probes were sent and failed to reach `10.10.10.10`.
    - No route in the routing table of the source virtual machine to `10.10.10.10` (the output has `RouteMissing` error on the source virtual machine).
    - Next hop type is *None* because there's no route to `10.10.10.10`.
    - Outbound connectivity from the source virtual machine is denied by the security rule `DefaultRule_DenyAllOutBound` in the network security group `VM1-nsg`.
    
    **Solution**: Associate a route table with a correct route to the subnet of the source virtual machine.
    


# [**Azure CLI**](#tab/cli)

Use [az network watcher test-connectivity](/cli/azure/network/watcher#az-network-watcher-test-connectivity) command to run connection troubleshoot to test RDP connectivity to `10.10.10.10`:

```azurecli-interactive
# Test connectivity from a virtual machine to 10.10.10.10 over port 3389.
az network watcher test-connectivity --resource-group 'myResourceGroup' --source-resource 'VM1' --dest-address '10.10.10.10' --protocol 'TCP'  --dest-port '3389'
```

- If the IP address is reachable, you see the following results:

    ```json
    {
      "avgLatencyInMs": 2,
      "connectionStatus": "Reachable",
      "hops": [
        {
          "address": "10.0.0.4",
          "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
          "issues": [],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "bbbbbbbb-1111-2222-3333-cccccccccccc",
              "resourceId": "",
              "roundTripTimeAvg": 2,
              "roundTripTimeMax": 2,
              "roundTripTimeMin": 2
            }
          ],
          "nextHopIds": [
            "bbbbbbbb-1111-2222-3333-cccccccccccc"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.10.10.10",
          "id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
          "issues": [],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
              "resourceId": ""
            }
          ],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/vm2375/ipConfigurations/ipconfig1",
          "type": "VirtualNetwork"
        }
      ],
      "maxLatencyInMs": 7,
      "minLatencyInMs": 1,
      "probesFailed": 0,
      "probesSent": 66
    }
    ```

    - Connection status is **Reachable** (`10.10.10.10` is reachable over port 3389).
    - 66 probes were successfully sent to `10.10.10.10` with average latency of 2 ms.
    - There are two hops in the path between the two virtual machines (no appliances or other resources in the path between the two VMs). 

- If the IP address is unreachable because the destination virtual machine isn't running, you see the following results: 

    ```json
    {
      "connectionStatus": "Unreachable",
      "hops": [
        {
          "address": "10.0.0.4",
          "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
          "issues": [],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "bbbbbbbb-1111-2222-3333-cccccccccccc",
              "resourceId": ""
            }
          ],
          "nextHopIds": [
            "bbbbbbbb-1111-2222-3333-cccccccccccc"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.10.10.10",
          "id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
          "issues": [],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
              "resourceId": ""
            }
          ],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/vm2375/ipConfigurations/ipconfig1",
          "type": "VirtualNetwork"
        }
      ],
      "probesFailed": 30,
      "probesSent": 30
    }
    ```

    - Connection status is **Unreachable** (`10.10.10.10` is unreachable over port 3389).
    - 30 probes were sent and failed to reach `10.10.10.10`.
    - No issues in the source virtual machine.
    - No issues with `10.10.10.10`.
    
    **Solution**: Start the destination virtual machine.

- If there's no route to the IP address in the routing table of the source virtual machine (for example, the IP address isn't in the address space of the VM's virtual network or its peered virtual networks), you see the following results: 

    ```json
    {
      "connectionStatus": "Unreachable",
      "hops": [
        {
          "address": "10.0.0.4",
          "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
          "issues": [
            {
              "context": [],
              "origin": "Local",
              "severity": "Error",
              "type": "RouteMissing"
            },
            {
              "context": [
                {
                  "key": "ErrorMessage",
                  "value": "NextHop Type None, NextHop IP "
                }
              ],
              "origin": "Outbound",
              "severity": "Error",
              "type": "UserDefinedRoute"
            },
            {
              "context": [
                {
                  "key": "RuleName",
                  "value": "DefaultRule_DenyAllOutBound"
                }
              ],
              "origin": "Outbound",
              "severity": "Error",
              "type": "NetworkSecurityRule"
            }
          ],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "bbbbbbbb-1111-2222-3333-cccccccccccc",
              "resourceId": ""
            }
          ],
          "nextHopIds": [
            "bbbbbbbb-1111-2222-3333-cccccccccccc"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.10.10.10",
          "id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
          "issues": [],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
              "resourceId": ""
            }
          ],
          "type": "Destination"
        }
      ],
      "probesFailed": 30,
      "probesSent": 30
    }
    ```

    - Connection status is **Unreachable** (`10.10.10.10` is unreachable over port 3389).
    - 30 probes were sent and failed to reach `10.10.10.10`.
    - No route in the routing table of the source virtual machine to `10.10.10.10` (the output has `RouteMissing` error on the source virtual machine).
    - Next hop type is *None* because there's no route to `10.10.10.10`.
    - Outbound connectivity from the source virtual machine is denied by the security rule `DefaultRule_DenyAllOutBound` in the network security group `VM1-nsg`.
    
    **Solution**: Associate a route table with a correct route to the subnet of the source virtual machine.

---

## Related content

- [What is Azure Network Watcher?](network-watcher-overview.md)
- [Connection troubleshoot](connection-troubleshoot-overview.md)
