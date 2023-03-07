---
title: 'Tutorial: Log network traffic flow to and from a virtual machine - Azure portal'
description: Learn how to log network traffic flow to and from a virtual machine using Network Watcher's NSG flow logs capability.
services: network-watcher
author: damendo
ms.service: network-watcher
ms.topic: tutorial
ms.date: 10/28/2022
ms.author: damendo
ms.custom: template-tutorial, mvc, engagement-fy23
# Customer intent: I need to log the network traffic to and from a VM so I can analyze it for anomalies.
---

# Tutorial: Log network traffic to and from a virtual machine using the Azure portal

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-nsg-flow-logging-portal.md)
> - [PowerShell](network-watcher-nsg-flow-logging-powershell.md)
> - [Azure CLI](network-watcher-nsg-flow-logging-cli.md)
> - [REST API](network-watcher-nsg-flow-logging-rest.md)
> - [Azure Resource Manager](network-watcher-nsg-flow-logging-azure-resource-manager.md)

A network security group (NSG) enables you to filter inbound traffic to, and outbound traffic from, a virtual machine (VM). You can log network traffic that flows through an NSG with Network Watcher's NSG flow log capability.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a VM with a network security group
> * Enable Network Watcher and register the Microsoft.Insights provider
> * Enable a traffic flow log for an NSG, using Network Watcher's NSG flow log capability
> * Download logged data
> * View logged data

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual machine

1. In the search box at the top of the portal, enter *virtual machine*. Select **Virtual machines**.

2. In **Virtual machines**, select **+ Create** then **+ Azure virtual machine**.

3. Enter or select the following information in **Create a virtual machine**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. | 
    | **Instance details** |   |
    | Virtual machine name | Enter *myVM*. |
    | Region | Select **(US) East US**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Leave the default of **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - Gen2**. |
    | Azure Spot instance | Leave the default. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Confirm password. |
    | **Inbound port rules** |   |
    | Public inbound ports | Leave the default of **Allow selected ports**. |
    | Select inbound ports | Leave the default of **RDP (3389)**. |

4. Select **Review + create**. 

5. Select **Create**.

The virtual machine takes a few minutes to create. Don't continue with the remaining steps until the VM has finished creating. While the portal creates the virtual machine, it also creates a network security group with the name **myVM-nsg** and associates it with the network interface for the VM.

## Enable Network Watcher

If you already have a network watcher enabled in the East US region, skip to [Register Insights provider](#register-insights-provider).

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

2. In the **Overview** page of **Network Watcher**, select **+ Add**.

    :::image type="content" source="./media/network-watcher-nsg-flow-logging-portal/enable-network-watcher.png" alt-text="Screenshot of enable network watcher in portal.":::

3. Select your subscription in **Add network watcher**. Select **(US) East US** in **Region**.

4. Select **Add**.

## Register Insights provider

NSG flow logging requires the **Microsoft.Insights** provider. To register the provider, complete the following steps:

1. In the search box at the top of the portal, enter *subscriptions*. Select **Subscriptions** in the search results.

2. Select the subscription you want to enable the provider for in **Subscriptions**.

3. Select **Resource providers** in **Settings** of your subscription.

4. Enter *Microsoft.Insights* in the filter box.

5. Confirm the status of the provider displayed is **Registered**. If the status is **Unregistered**, select the provider then select **Register**.

    :::image type="content" source="./media/network-watcher-nsg-flow-logging-portal/microsoft-insights-registered.png" alt-text="Screenshot of registering microsoft insights provider.":::

## Enable NSG flow log

NSG flow log data is written to an Azure Storage account. Complete the following steps to create a storage account for the log data.

1. In the search box at the top of the portal, enter *storage account*. Select **Storage accounts** in the search results.

2. In **Storage accounts**, select **+ Create**.

3. Enter or select the following information in **Create a storage account**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Storage account name | Enter a name for your storage account. </br> Must be 3-24 characters long, and can contain only lowercase letters and numbers, and must be unique across all Azure Storage. |
    | Region | Select **(US) East US**. |
    | Performance | Leave the default of **Standard**. |
    | Redundancy | Leave the default of **Geo-redundant storage (GRS)**. |

4. Select **Review**.

5. Select **Create**.

The storage account may take around a minute to create. Don't continue with the remaining steps until the storage account is created. In all cases, the storage account must be in the same region as the NSG.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

2. Select **NSG flow logs** in **Logs**.

3. In **Network Watcher | NSG flow logs**, select **+ Create**.

    :::image type="content" source="./media/network-watcher-nsg-flow-logging-portal/create-nsg-flow-log.png" alt-text="Screenshot of create Network Security Group flow log.":::

4. Enter or select the following information in **Create a flow log**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Network Security Group | Select **myVM-nsg**. |
    | Flow Log Name | Leave the default of **myVM-nsg-myResourceGroup-flowlog**.
    | **Instance details** |   |
    | Select storage account |   |
    | Subscription | Select your subscription. |
    | Storage Accounts | Select the storage account you created in the previous steps. |
    | Retention (days) | Enter a retention time for the logs. |

5. Select **Review + create**.

6. Select **Create**.

## Download flow log

1. In the search box at the top of the portal, enter *storage account*. Select **Storage accounts** in the search results.

2. Select the storage account you created in the previous steps.

3. In **Data storage**, select **Containers**.

4. Select the **insights-logs-networksecuritygroupflowevent** container.

5. In the container, navigate the folder hierarchy until you get to a PT1H.json file. Log files are written to a folder hierarchy that follows the following naming convention:

   **https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/resourceId=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{nsgName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json**

6. Select **...** to the right of the PT1H.json file, then select **Download**.

   :::image type="content" source="./media/network-watcher-nsg-flow-logging-portal/log-file.png" alt-text="Screenshot of download Network Security Group flow log.":::

## View flow log

The following example JSON displays data that you'll see in the PT1H.json file for each flow logged:

### Version 1 flow log event
```json
{
    "time": "2018-05-01T15:00:02.1713710Z",
    "systemId": "<Id>",
    "category": "NetworkSecurityGroupFlowEvent",
    "resourceId": "/SUBSCRIPTIONS/<subscriptionId>/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/MYVM-NSG",
    "operationName": "NetworkSecurityGroupFlowEvents",
    "properties": {
        "Version": 1,
        "flows": [
            {
                "rule": "UserRule_default-allow-rdp",
                "flows": [
                    {
                        "mac": "<macAddress>",
                        "flowTuples": [
                            "1525186745,192.168.1.4,10.0.0.4,55960,3389,T,I,A"
                        ]
                    }
                ]
            }
        ]
    }
}
```
### Version 2 flow log event
```json
{
    "time": "2018-11-13T12:00:35.3899262Z",
    "systemId": "<Id>",
    "category": "NetworkSecurityGroupFlowEvent",
    "resourceId": "/SUBSCRIPTIONS/<subscriptionId>/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/MYVM-NSG",
    "operationName": "NetworkSecurityGroupFlowEvents",
    "properties": {
        "Version": 2,
        "flows": [
            {
                "rule": "DefaultRule_DenyAllInBound",
                "flows": [
                    {
                        "mac": "<macAddress>",
                        "flowTuples": [
                            "1542110402,94.102.49.190,10.5.16.4,28746,443,U,I,D,B,,,,",
                            "1542110424,176.119.4.10,10.5.16.4,56509,59336,T,I,D,B,,,,",
                            "1542110432,167.99.86.8,10.5.16.4,48495,8088,T,I,D,B,,,,"
                        ]
                    }
                ]
            },
            {
                "rule": "DefaultRule_AllowInternetOutBound",
                "flows": [
                    {
                        "mac": "<macAddress>",
                        "flowTuples": [
                            "1542110377,10.5.16.4,13.67.143.118,59831,443,T,O,A,B,,,,",
                            "1542110379,10.5.16.4,13.67.143.117,59932,443,T,O,A,E,1,66,1,66",
                            "1542110379,10.5.16.4,13.67.143.115,44931,443,T,O,A,C,30,16978,24,14008",
                            "1542110406,10.5.16.4,40.71.12.225,59929,443,T,O,A,E,15,8489,12,7054"
                        ]
                    }
                ]
            }
        ]
    }
}
```

The value for **mac** in the previous output is the MAC address of the network interface that was created when the VM was created. The comma-separated information for **flowTuples** is as follows:

| Example data | What data represents   | Explanation                                                                              |
| ---          | ---                    | ---                                                                                      |
| 1542110377   | Time stamp             | The time stamp of when the flow occurred, in UNIX EPOCH format. In the previous example, the date converts to May 1, 2018 at 2:59:05 PM GMT.                                                                                    |
| 10.0.0.4  | Source IP address      | The source IP address that the flow originated from. 10.0.0.4 is the private IP address of the VM you created in [Create a virtual machine](#create-a-virtual-machine).
| 13.67.143.118     | Destination IP address | The destination IP address that the flow was destined to.                                                                                  |
| 44931        | Source port            | The source port that the flow originated from.                                           |
| 443         | Destination port       | The destination port that the flow was destined to. Since the traffic was destined to port 443, the rule named **UserRule_default-allow-rdp**, in the log file processed the flow.                                                |
| T            | Protocol               | Whether the protocol of the flow was TCP (T) or UDP (U).                                  |
| O            | Direction              | Whether the traffic was inbound (I) or outbound (O).                                     |
| A            | Action                 | Whether the traffic was allowed (A) or denied (D).  
| C            | Flow State **Version 2 Only** | Captures the state of the flow. Possible states are **B**: Begin, when a flow is created. Statistics aren't provided. **C**: Continuing for an ongoing flow. Statistics are provided at 5-minute intervals. **E**: End, when a flow is ended. Statistics are provided. |
| 30 | Packets sent - Source to destination **Version 2 Only** | The total number of TCP or UDP packets sent from source to destination since the last update. |
| 16978 | Bytes sent - Source to destination **Version 2 Only** | The total number of TCP or UDP packet bytes sent from source to destination since the last update. Packet bytes include the packet header and payload. |
| 24 | Packets sent - Destination to source **Version 2 Only** | The total number of TCP or UDP packets sent from destination to source since the last update. |
| 14008| Bytes sent - Destination to source **Version 2 Only** | The total number of TCP and UDP packet bytes sent from destination to source since the last update. Packet bytes include packet header and payload.|

## Next steps

In this tutorial, you learned how to:

* Enable NSG flow logging for an NSG
* Download and view data logged in a file. 

The raw data in the JSON file can be difficult to interpret. To visualize Flow Logs data, you can use [Azure Traffic Analytics](traffic-analytics.md) and  [Microsoft Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md).

For alternate methods of enabling NSG Flow Logs, see [PowerShell](network-watcher-nsg-flow-logging-powershell.md), [Azure CLI](network-watcher-nsg-flow-logging-cli.md), [REST API](network-watcher-nsg-flow-logging-rest.md), and [Resource Manager templates](network-watcher-nsg-flow-logging-azure-resource-manager.md).

Advance to the next article to learn how to monitor network communication between two virtual machines:

> [!div class="nextstepaction"]
> [Monitor network communication between two virtual machines using the Azure portal](connection-monitor.md)
