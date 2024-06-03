---
title: Troubleshoot outbound connections - Azure CLI
titleSuffix: Azure Network Watcher
description: Learn how to use the connection troubleshoot feature of Azure Network Watcher to troubleshoot outbound connections using the Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 03/21/2024
ms.custom: devx-track-azurecli

#CustomerIntent: As an Azure administrator, I want to learn how to use Connection Troubleshoot to diagnose outbound connectivity issues in Azure using the Azure CLI.
---

# Troubleshoot outbound connections using the Azure CLI

In this article, you learn how to use the connection troubleshoot feature of Azure Network Watcher to diagnose and troubleshoot connectivity issues. For more information about connection troubleshoot, see [Connection troubleshoot overview](connection-troubleshoot-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Network Watcher enabled in the region of the virtual machine (VM) you want to troubleshoot. By default, Azure enables Network Watcher in a region when you create a virtual network in it. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md).

- A virtual machine with Network Watcher agent VM extension installed on it and has the following outbound TCP connectivity:
    - to 169.254.169.254 over port 80
    - to 168.63.129.16 over port 8037

- A second virtual machine with inbound TCP connectivity from 168.63.129.16 over the port being tested (for Port scanner diagnostic test).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

> [!NOTE]
> - To install the extension on a Windows virtual machine, see [Network Watcher agent VM extension for Windows](../virtual-machines/extensions/network-watcher-windows.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json).
> - To install the extension on a Linux virtual machine, see [Network Watcher agent VM extension for Linux](../virtual-machines/extensions/network-watcher-linux.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json).
> - To update an already installed extension, see [Update Network Watcher agent VM extension to the latest version](../virtual-machines/extensions/network-watcher-update.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json).

## Test connectivity to a virtual machine

In this section, you test the remote desktop port (RDP) connectivity from one virtual machine to another virtual machine in the same virtual network.

Use [az network watcher test-connectivity](/cli/azure/network/watcher#az-network-watcher-test-connectivity) to run connection troubleshoot diagnostic tests to test the connectivity to a virtual machine over port 3389:

```azurecli-interactive
# Test connectivity between two virtual machines that are in the same resource group over port 3389.
az network watcher test-connectivity --resource-group 'myResourceGroup' --source-resource 'VM1' --dest-resource 'VM2' --protocol 'TCP' --dest-port '3389'
```

If the virtual machines aren't in the same resource group, use their resource IDs instead of their names:

```azurecli-interactive
# Test connectivity between two virtual machines that are in two different resource groups over port 3389.
az network watcher test-connectivity --source-resource '/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup1/providers/Microsoft.Compute/virtualMachines/VM1' --dest-resource '/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup2/providers/Microsoft.Compute/virtualMachines/VM2' --protocol 'TCP' --dest-port '3389'
```

- If the two virtual machines are communicating with no issues, you see the following results:

    ```json
    {
      "avgLatencyInMs": 2,
      "connectionStatus": "Reachable",
      "hops": [
        {
          "address": "10.0.0.4",
          "id": "00000000-0000-0000-0000-000000000000",
          "issues": [],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "11111111-1111-1111-1111-111111111111",
              "resourceId": "",
              "roundTripTimeAvg": 2,
              "roundTripTimeMax": 2,
              "roundTripTimeMin": 2
            }
          ],
          "nextHopIds": [
            "11111111-1111-1111-1111-111111111111"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.0.0.5",
          "id": "11111111-1111-1111-1111-111111111111",
          "issues": [],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "00000000-0000-0000-0000-000000000000"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "00000000-0000-0000-0000-000000000000",
              "resourceId": ""
            }
          ],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM2",
          "type": "VirtualMachine"
        }
      ],
      "maxLatencyInMs": 8,
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
          "id": "00000000-0000-0000-0000-000000000000",
          "issues": [],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "11111111-1111-1111-1111-111111111111",
              "resourceId": ""
            }
          ],
          "nextHopIds": [
            "11111111-1111-1111-1111-111111111111"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.0.0.5",
          "id": "11111111-1111-1111-1111-111111111111",
          "issues": [
            {
              "context": [
                {
                  "key": "RuleName",
                  "value": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/VM2-nsg/SecurityRules/Deny3389Inbound"
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
            "00000000-0000-0000-0000-000000000000"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "00000000-0000-0000-0000-000000000000",
              "resourceId": ""
            }
          ],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM2",
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
          "id": "00000000-0000-0000-0000-000000000000",
          "issues": [
            {
              "context": [
                {
                  "key": "RuleName",
                  "value": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/VM1-nsg/SecurityRules/Deny3389Outbound"
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
              "nextHopId": "11111111-1111-1111-1111-111111111111",
              "resourceId": ""
            }
          ],
          "nextHopIds": [
            "11111111-1111-1111-1111-111111111111"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.0.0.5",
          "id": "11111111-1111-1111-1111-111111111111",
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
            "00000000-0000-0000-0000-000000000000"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "00000000-0000-0000-0000-000000000000",
              "resourceId": ""
            }
          ],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM2",
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
          "id": "00000000-0000-0000-0000-000000000000",
          "issues": [],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "11111111-1111-1111-1111-111111111111",
              "resourceId": ""
            }
          ],
          "nextHopIds": [
            "11111111-1111-1111-1111-111111111111"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.0.0.5",
          "id": "11111111-1111-1111-1111-111111111111",
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
            "00000000-0000-0000-0000-000000000000"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "00000000-0000-0000-0000-000000000000",
              "resourceId": ""
            }
          ],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM2",
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

## Test connectivity to a website

In this section, you test the connectivity between a virtual machine and a website.

Use [az network watcher test-connectivity](/cli/azure/network/watcher#az-network-watcher-test-connectivity) to run connection troubleshoot to test the connectivity to `www.bing.com`:

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
          "id": "00000000-0000-0000-0000-000000000000",
          "issues": [],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "Internet",
              "nextHopId": "11111111-1111-1111-1111-111111111111",
              "resourceId": "",
              "roundTripTimeAvg": 9,
              "roundTripTimeMax": 9,
              "roundTripTimeMin": 9
            }
          ],
          "nextHopIds": [
            "11111111-1111-1111-1111-111111111111"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "104.117.244.81",
          "id": "11111111-1111-1111-1111-111111111111",
          "issues": [],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "00000000-0000-0000-0000-000000000000"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "Internet",
              "nextHopId": "00000000-0000-0000-0000-000000000000",
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
          "id": "00000000-0000-0000-0000-000000000000",
          "issues": [
            {
              "context": [
                {
                  "key": "RuleName",
                  "value": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/VM1-nsg/SecurityRules/DenyInternetOutbound"
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
              "nextHopId": "11111111-1111-1111-1111-111111111111",
              "resourceId": ""
            }
          ],
          "nextHopIds": [
            "11111111-1111-1111-1111-111111111111"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "23.198.7.184",
          "id": "11111111-1111-1111-1111-111111111111",
          "issues": [],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "00000000-0000-0000-0000-000000000000"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "Internet",
              "nextHopId": "00000000-0000-0000-0000-000000000000",
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

## Test connectivity to an IP address

In this section, you test the connectivity between a virtual machine and an IP address of another virtual machine.

Use [az network watcher test-connectivity](/cli/azure/network/watcher#az-network-watcher-test-connectivity) to run connection troubleshoot to test RDP connectivity to `10.10.10.10`:

```azurecli-interactive
# Test connectivity from a virtual machine to 10.10.10.10 over port 3389.
az network watcher test-connectivity --resource-group 'myResourceGroup' --source-resource 'VM1' --dest-address '10.10.10.10' --protocol 'TCP'  --dest-port 3389
```

- If the IP address is reachable, you see the following results:

    ```json
    {
      "avgLatencyInMs": 2,
      "connectionStatus": "Reachable",
      "hops": [
        {
          "address": "10.0.0.4",
          "id": "00000000-0000-0000-0000-000000000000",
          "issues": [],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "11111111-1111-1111-1111-111111111111",
              "resourceId": "",
              "roundTripTimeAvg": 2,
              "roundTripTimeMax": 2,
              "roundTripTimeMin": 2
            }
          ],
          "nextHopIds": [
            "11111111-1111-1111-1111-111111111111"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.10.10.10",
          "id": "11111111-1111-1111-1111-111111111111",
          "issues": [],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "00000000-0000-0000-0000-000000000000"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "00000000-0000-0000-0000-000000000000",
              "resourceId": ""
            }
          ],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/vm2375/ipConfigurations/ipconfig1",
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
          "id": "00000000-0000-0000-0000-000000000000",
          "issues": [],
          "links": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "11111111-1111-1111-1111-111111111111",
              "resourceId": ""
            }
          ],
          "nextHopIds": [
            "11111111-1111-1111-1111-111111111111"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.10.10.10",
          "id": "11111111-1111-1111-1111-111111111111",
          "issues": [],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "00000000-0000-0000-0000-000000000000"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "00000000-0000-0000-0000-000000000000",
              "resourceId": ""
            }
          ],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/vm2375/ipConfigurations/ipconfig1",
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
          "id": "00000000-0000-0000-0000-000000000000",
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
              "nextHopId": "11111111-1111-1111-1111-111111111111",
              "resourceId": ""
            }
          ],
          "nextHopIds": [
            "11111111-1111-1111-1111-111111111111"
          ],
          "previousHopIds": [],
          "previousLinks": [],
          "resourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/VM1",
          "type": "Source"
        },
        {
          "address": "10.10.10.10",
          "id": "11111111-1111-1111-1111-111111111111",
          "issues": [],
          "links": [],
          "nextHopIds": [],
          "previousHopIds": [
            "00000000-0000-0000-0000-000000000000"
          ],
          "previousLinks": [
            {
              "context": {},
              "issues": [],
              "linkType": "VirtualNetwork",
              "nextHopId": "00000000-0000-0000-0000-000000000000",
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
    
## Next step

> [!div class="nextstepaction"]
> [Manage packet captures](packet-capture-vm-cli.md)
