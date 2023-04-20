---
title: 'Tutorial: Log network traffic flow to and from a virtual machine - Azure portal'
titleSuffix: Azure Network Watcher
description: Learn how to log network traffic flow to and from a virtual machine (VM) using Network Watcher NSG flow logs capability.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: tutorial
ms.date: 02/28/2023
ms.author: halkazwini
ms.custom: template-tutorial, mvc, engagement-fy23
# Customer intent: I need to log the network traffic to and from a virtual machine (VM) so I can analyze it for anomalies.
---

# Tutorial: Log network traffic to and from a virtual machine using the Azure portal

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-nsg-flow-logging-portal.md)
> - [PowerShell](network-watcher-nsg-flow-logging-powershell.md)
> - [Azure CLI](network-watcher-nsg-flow-logging-cli.md)
> - [REST API](network-watcher-nsg-flow-logging-rest.md)
> - [Azure Resource Manager](network-watcher-nsg-flow-logging-azure-resource-manager.md)

This tutorial helps you use Azure Network Watcher [NSG flow logs](network-watcher-nsg-flow-logging-overview.md) capability to log a virtual machine's network traffic that flows through the [network security group (NSG)](../virtual-network/network-security-groups-overview.md) associated to its network interface.

You learn how to:

> [!div class="checklist"]
> * Create a virtual network and a Bastion host
> * Create a virtual machine with a network security group associated to its network interface
> * Register Microsoft.insights provider
> * Enable flow logging for a network security group using Network Watcher NSG flow logs
> * Download logged data
> * View logged data

## Prerequisites

- An Azure account with an active subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network

In this section, you create **myVNet** virtual network.

1. In the search box at the top of the portal, enter *virtual networks*. Select **Virtual networks** in the search results.

    :::image type="content" source="./media/network-watcher-nsg-flow-logging-portal/virtual-network-azure-portal.png" alt-text="Screenshot shows searching for virtual networks in the Azure portal.":::

1. Select **+ Create**. In **Create virtual network**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | Name | Enter *myVNet*. |
    | Region | Select **East US**. |

1. Select the **IP Addresses** tab, or select **Next: IP Addresses** button at the bottom of the page.

1. Enter the following values in the **IP Addresses** tab:

    | Setting | Value |
    | --- | --- |
    | IPv4 address space | Enter *10.0.0.0/16*. |
    | Subnet name | Enter *mySubnet*. |
    | Subnet address range | Enter *10.0.0.0/24*. |

1. Select the **Security** tab, or select the **Next: Security** button at the bottom of the page. 

1. Under **BastionHost**, select **Enable** and enter the following:

    | Setting | Value |
    | --- | --- |
    | Bastion name | Enter *myBastionHost*. |
    | AzureBastionSubnet address space | Enter *10.0.1.0/24*. |
    | Public IP Address | Select **Create new**. </br> Enter *myBastionIP* for **Name**. </br> Select **OK**. |

1. Select the **Review + create** tab or select the **Review + create** button.

1. Review the settings, and then select **Create**. 

## Create a virtual machine

In this section, you create **myVM** virtual machine.

1. In the search box at the top of the portal, enter *virtual machines*. Select **Virtual machines** in the search results.

2. Select **+ Create** and then select **Azure virtual machine**.

3. In **Create a virtual machine**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Virtual machine name | Enter *myVM*. |
    | Region | Select **(US) East US**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - x64 Gen2**. |
    | Size | Choose a size or leave the default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |

4. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

5. In the Networking tab, select the following values:

    | Setting | Value |
    | --- | --- |
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. This setting creates a network security group named **myVM-nsg** and associates it with the network interface of **myVM** virtual machine. |
    | Public inbound ports | Select **None**. |

6. Select **Review + create**.

7. Review the settings, and then select **Create**. 

8. Once the deployment is complete, select **Go to resource** to go to the **Overview** page of **myVM**.  

9. Select **Connect** then select **Bastion**.

10. Enter the username and password that you created in the previous steps. Leave **Open in new browser tab** checked.

11. Select **Connect** button.

## Register Insights provider

NSG flow logging requires the **Microsoft.Insights** provider. To check its status, follow these steps:

1. In the search box at the top of the portal, enter *subscriptions*. Select **Subscriptions** in the search results.

1. Select the Azure subscription that you want to enable the provider for in **Subscriptions**.

1. Select **Resource providers** under **Settings** of your subscription.

1. Enter *insight* in the filter box.

1. Confirm the status of the provider displayed is **Registered**. If the status is **NotRegistered**, select the **Microsoft.Insights** provider then select **Register**.

    :::image type="content" source="./media/network-watcher-nsg-flow-logging-portal/register-microsoft-insights.png" alt-text="Screenshot of registering Microsoft Insights provider in the Azure portal.":::

## Create a storage account

In this section, you create a storage account to use it to store the flow logs.

1. In the search box at the top of the portal, enter *storage accounts*. Select **Storage accounts** in the search results.

1. Select **+ Create**. In **Create a storage account**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Storage account name | Enter a unique name. This tutorial uses **mynwstorageaccount**. |
    | Region | Select **(US) East US**. The storage account must be in the same region as the virtual machine and its network security group. |
    | Performance | Select **Standard**. NSG flow logs only support Standard-tier storage accounts. |
    | Redundancy | Select **Locally-redundant storage (LRS)**. |

1. Select the **Review** tab or select the **Review** button at the bottom.

1. Review the settings, and then select **Create**.

## Enable NSG flow log

In this section, you create an NSG flow log that's saved into the storage account created previously in the tutorial.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Select **NSG flow logs** under **Logs**.

1. In **Network Watcher | NSG flow logs**, select **+ Create** or **Create NSG flow log** blue button.

    :::image type="content" source="./media/network-watcher-nsg-flow-logging-portal/nsg-flow-logs.png" alt-text="Screenshot of NSG flow logs page in the Azure portal.":::

1. Enter or select the following values in **Create a flow log**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your Azure subscription. The subscription of your virtual machine and its network security group. |
    | Network Security Group | Select **+ Select NSG**. <br> Select **myVM-nsg**. <br> Select **Confirm selection**. |
    | Flow Log Name | Leave the default of **myVM-nsg-myResourceGroup-flowlog**.
    | **Instance details** |   |
    | Subscription | Select your Azure subscription. The subscription of the storage account. |
    | Storage Accounts | Select the storage account you created in the previous steps. This tutorial uses **mynwstorageaccount**. |
    | Retention (days) | Enter a retention time for the logs. This tutorial uses **1** day. |

    :::image type="content" source="./media/network-watcher-nsg-flow-logging-portal/create-nsg-flow-log.png" alt-text="Screenshot of create NSG flow log page in the Azure portal.":::

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

1. Once the deployment is complete, select **Go to resource**.

    :::image type="content" source="./media/network-watcher-nsg-flow-logging-portal/nsg-flow-logs-list.png" alt-text="Screenshot of NSG flow logs page in the Azure portal showing the newly created flow log.":::

1. Go back to your browser tab of **myVM** virtual machine.

1. In **myVM**, open Microsoft Edge and go to `www.bing.com`.

## Download flow log

In this section, you go to the storage account you previously selected and download the NSG flow log created in the previous section.

1. In the search box at the top of the portal, enter *storage accounts*. Select **Storage accounts** in the search results.

2. Select **mynwstorageaccount** or the storage account you previously created and selected to store the logs.

3. Under **Data storage**, select **Containers**.

4. Select the **insights-logs-networksecuritygroupflowevent** container.

5. In the container, navigate the folder hierarchy until you get to the `PT1H.json` file. NSG log files are written to a folder hierarchy that follows the following naming convention:

   **https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/resourceId=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{networSecurityGroupName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json**

6. Select the ellipsis **...** to the right of the PT1H.json file, then select **Download**.

   :::image type="content" source="./media/network-watcher-nsg-flow-logging-portal/nsg-log-file.png" alt-text="Screenshot showing how to download nsg flow log from the storage account container in the Azure portal.":::

## View flow log

Open the downloaded `PT1H.json` file using a text editor of your choice. The following example is a section taken from the downloaded `PT1H.json` file, which shows a flow processed by the rule **DefaultRule_AllowInternetOutBound**.

```json
{
    "time": "2023-02-26T23:45:44.1503927Z",
    "systemId": "00000000-0000-0000-0000-000000000000",
    "macAddress": "112233445566",
    "category": "NetworkSecurityGroupFlowEvent",
    "resourceId": "/SUBSCRIPTIONS/abcdef01-2345-6789-0abc-def012345678/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/MYVM-NSG",
    "operationName": "NetworkSecurityGroupFlowEvents",
    "properties": {
        "Version": 2,
        "flows": [
            {
                "rule": "DefaultRule_AllowInternetOutBound",
                "flows": [
                    {
                        "mac": "112233445566",
                        "flowTuples": [
                            "1677455097,10.0.0.4,13.107.21.200,49982,443,T,O,A,C,7,1158,12,8143"                            
                        ]
                    }
                ]
            }
        ]
    }
}
```

The comma-separated information for **flowTuples** is as follows:

| Example data | What data represents | Explanation |
| ------------ | -------------------- | ----------  |
| 1677455097 | Time stamp | The time stamp of when the flow occurred in UNIX EPOCH format. In the previous example, the date converts to February 26, 2023 11:44:57 PM UTC/GMT. |
| 10.0.0.4 | Source IP address | The source IP address that the flow originated from. 10.0.0.4 is the private IP address of the VM you previously created.
| 13.107.21.200 | Destination IP address | The destination IP address that the flow was destined to. 13.107.21.200 is the IP address of `www.bing.com`. Since the traffic is destined outside Azure, the security rule **DefaultRule_AllowInternetOutBound** processed the flow. |
| 49982 | Source port | The source port that the flow originated from. |
| 443 | Destination port | The destination port that the flow was destined to. |
| T | Protocol | The protocol of the flow. T: TCP. |
| O | Direction | The direction of the flow. O: Outbound. |
| A | Decision | The decision made by the security rule. A: Allowed. |
| C | Flow State **Version 2 only** | The state of the flow. C: Continuing for an ongoing flow. |
| 7 | Packets sent **Version 2 only** | The total number of TCP packets sent to destination since the last update. |
| 1158 | Bytes sent **Version 2 only** | The total number of TCP packet bytes sent from source to destination since the last update. Packet bytes include the packet header and payload. |
| 12 | Packets received **Version 2 only** | The total number of TCP packets received from destination since the last update. |
| 8143 | Bytes received **Version 2 only** | The total number of TCP packet bytes received from destination since the last update. Packet bytes include packet header and payload.|

## Disable NSG flow log

When no more logging is needed, you can disable the NSG flow log that you previously created.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Select **NSG flow logs** under **Logs**.

1. Select the ellipsis **...** to the right of **myVM-nsg-myresourcegroup-flowlog** flow log or right-click it and select **Disable**.

1. In **Disable NSG flow log**, select **Disable**.

   :::image type="content" source="./media/network-watcher-nsg-flow-logging-portal/nsg-flow-log-disabled.png" alt-text="Screenshot showing the nsg flow log disabled in the Azure portal.":::

## Clean up resources

When no longer needed, delete **myResourceGroup** and all of the resources it contains:

1. Enter *myResourceGroup* in the search box at the top of the portal. When you see **myResourceGroup** in the search results, select it.
2. Select **Delete resource group**.
3. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this tutorial, you learned how to:

* Enable NSG flow logging for a network security group to log traffic from and to a virtual machine.
* Download and view the flow log data.

The raw data in the JSON file can be difficult to interpret. To visualize flow logs data, you can use [Azure Traffic Analytics](traffic-analytics.md) and [Microsoft Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md).

For alternate methods of enabling NSG Flow Logs, see [PowerShell](network-watcher-nsg-flow-logging-powershell.md), [Azure CLI](network-watcher-nsg-flow-logging-cli.md), [REST API](network-watcher-nsg-flow-logging-rest.md), or [Resource Manager templates](network-watcher-nsg-flow-logging-azure-resource-manager.md).

To learn how to monitor network communication between virtual machines using Network Watcher connection monitor, see:

> [!div class="nextstepaction"]
> [Monitor network communication between two virtual machines](connection-monitor.md)
