---
title: 'Tutorial: Perform packet capture on Azure Virtual WAN site-to-site connections'
description: In this tutorial, learn how to perform packet capture on the Virtual WAN Site-to-site VPN Gateway.
services: virtual-wan
author: wellee
ms.service: virtual-wan
ms.topic: tutorial
ms.date: 04/13/2021
ms.author: wellee
Customer intent: As someone with a networking background using Virtual WAN, I want to perform a packet capture on my Site-to-site VPN Gateway.
---

# Perform packet Capture on the Azure Virtual WAN Site-to-site VPN Gateway 

Connectivity and performance-related problems are often complex. It can take significant time and effort just to narrow down the cause of the problem. Packet capture can help you narrow down the scope of a problem to certain parts of the network. It can help you determine whether the problem is on the customer side of the network, the Azure side of the network, or somewhere in between. After you narrow down the problem, it's more efficient to debug and take remedial action.

The following article describes how to start and stop a packet capture on the Azure Virtual WAN Site-to-site VPN Gateway. Currently, this functionality is only available through PowerShell.

## Prerequisites

To use the steps in this article, you must have the following configuration already set up in your environment:

* A Virtual WAN, virtual hub and a Site-to-site VPN Gateway deployed in the Virtual Hub. You may also have connections connecting VPN sites to your Site-to-site VPN Gateway.


### Working with Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell.md)]

## Set up the environment

Ensure you are in the right subscription context by running the following script in PowerShell. This ensures you are logged into a user that has permissions to perform the packet capture on the Site-to-site VPN Gateway.

   ```azurepowershell-interactive
    $subid = “<insert Virtual WAN subscription ID here>”
    Set-AzContext -SubscriptionId $subid
   ```

## <a name="createstorage"></a> Create a storage account

You must create a storage account under your Azure subscription to store the results of your packet capture. Please reference this [document](.././storage/common/storage-account-create.md) for instructions on how to create a storage account.

After creating your account, please run the following commands to generate a shared access signature (SAS) URL. The results of your packet capture will be stored via this URL.
   ```azurepowershell-interactive
  $rgname = “<resource group name containing storage account>” 
$storeName = “<name of storage account> “
$containerName = “<name of container you want to store packet capture in>
$key = Get-AzStorageAccountKey -ResourceGroupName $rgname -Name $storeNAme
$context = New-AzStorageContext -StorageAccountName  $storeName -StorageAccountKey $key[0].value
New-AzStorageContainer -Name $containerName -Context $context
$container = Get-AzStorageContainer -Name $containerName  -Context $context
$now = get-date
$sasurl = New-AzureStorageContainerSASToken -Name $containerName -Context $context -Permission "rwd" -StartTime $now.AddHours(-1) -ExpiryTime $now.AddDays(1) -FullUri
   ```

## Start the packet capture

To start the packet capture, you have two options, capturing packets on a single VPN connection or on the entire Site-to-site VPN Gateway. Note that if you chose to perform captures on VPN connections, you may only perform captures on 6 connections at the same time.

### Packet capture on a Site-to-site VPN Gateway (all connections)

Please run the following commands. The Name of the Site-to-site VPN Gateway can be found by navigating to your Virtual Hub, clicking on VPN (Site-to-site) under Connectivity.

:::image type="content" source="./media/virtual-wan-pcap-screenshots/vpn-gateway-name.png" alt-text="Image of Virtual WAN gateway name." lightbox="./media/virtual-wan-pcap-screenshots/vpn-gateway-name.png":::

   ```azurepowershell-interactive
Start-AzVpnGatewayPacketCapture -ResourceGroupName $rg -Name "<name of the Gateway>" -Sasurl $sasurl
   ```

### Packet capture on Specific Site-to-site VPN Connections

>[!NOTE]
> Please note you can only run a packet capture on 5 VPN connections concurrently.


Please run the following commands. The Name of the Site-to-site VPN Connections can be found by navigating to your Virtual Hub, clicking on VPN (Site-to-site) under Connectivity. Then, navigate to the VPN Site you want to perform the packet capture on and click on the three dots on the right. Click **Edit VPN Connection** in the menu that pops up.

:::image type="content" source="./media/virtual-wan-pcap-screenshots/sample-connection.png" alt-text="Image of how to find VPN connection names." lightbox="./media/virtual-wan-pcap-screenshots/sample-connection.png":::

The name of the links connected to a specific VPN site can be found by clicking on the VPN site from the previous section and looking at the **Links** table. 

:::image type="content" source="./media/virtual-wan-pcap-screenshots/link-name-sample.png" alt-text="Image of how to find VPN link name." lightbox="./media/virtual-wan-pcap-screenshots/link-name-sample.png":::

   ```azurepowershell-interactive
Start-AzVpnConnectionPacketCapture -ResourceGroupName $rg -Name "<name of the VPN connection>" -ParentResourceName “<name of the Gateway>” -LinkConnection “<comma separated list of links eg. "link1,link2">” -Sasurl $sasurl 
   ```

## Optional: Specifying filters

There are some commonly available packet capture tools. Getting relevant packet captures with these tools can be cumbersome, especially in high-volume traffic scenarios. To simplify your packet captures, you may specify filters on your packet capture to focus on specific behaviors. Below are the available parameters:

>[!NOTE]
> For TracingFlags and TCPFlags, you may specify multiple protocols by adding up the numerical values for the protocols you wish to capture (same as a logical OR). For instance, if you wanted to capture only ESP and OPVN packets, you would specify a TracingFlag value of 8+1 = 9.  

| Parameter | Description | Default values | Available values|
|--- |--- | --- | ---|
| TracingFlags | Integer that determines what types of packets are captured | 11 (ESP, IKE, OVPN) | ESP = 1 IKE  = 2 OPVN = 8 |
| TCPFlags | Integer that determines which Types of TCP Packets are captured | 0 (none) | FIN = 1, SYN = 2, RST = 4, PSH = 8, ACK = 16,URG = 32, ECE = 64, CWR = 128| 
| MaxPacketBufferSize|Maximum size of a captured packet in bytes. Packets are truncated if larger than the provided value. |120|Any|
| MaxFileSize |Maximum capture file size in Mb. Captures are stored in a circular buffer so overflow is handled in a FIFO manner (older packets removed first)|100|Any|
|SourceSubnets|Packets from the specified CIDR ranges are captured. Specified as an array.|[] (all IPv4 addresses)|Array of comma-separated IPV4 Subnets|
| DestinationSubnets |Packets destined for the specified CIDR ranges are captured. Specified as an array. |[] (all IPv4 addresses)|Array of comma-separated IPV4 Subnets|
|SourcePort |Packets with source in the specified ranges are captured. Specified as an array.|[] (all ports)|Array of comma-separated ports|
|DestinationPort |Packets with destination in the specified ranges are captured. Specified as an array.|[] (all ports)|Array of comma-separated ports|
| CaptureSingleDirectionTrafficOnly |If true, only one direction of a bidirectional flow will show up in the packet capture. This will capture all possible combo of IP and ports.|True|True, False|
|Protocol|An array of integers that correspond IANA protocols. |[] (all protocols)| Any protocols found [here](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml) |

Below is an Example Packet Capture Using a Filter String. You may change the parameters to suit your needs based on the preceding table.  

   ```azurepowershell-interactive
$filter="{`"TracingFlags`":11,`"MaxPacketBufferSize`":120,`"MaxFileSize`":500,`"Filters`":[{`"SourceSubnets`":[`"10.19.0.4/32`",`"10.20.0.4/32`"],`"DestinationSubnets`":[`"10.20.0.4/32`",`"10.19.0.4/32`"],`"TcpFlags`":9,`"CaptureSingleDirectionTrafficOnly`":true}]}"
Start-AzVpnConnectionPacketCapture -ResourceGroupName $rg -Name "<name of the VPN connection>" -ParentResourceName “<name of the Gateway>” -LinkConnection “<comma separated list of links>” -Sasurl $sasurl -FilterData $filter

Start-AzVpnGatewayPacketCapture -ResourceGroupName $rg -Name "<name of the Gateway>" -Sasurl $sasurl -FilterData $filter
   ```

## Stopping the packet capture
It is recommended you let the packet capture run for at least 600 seconds. Because of sync issues among multiple components on the path, shorter packet captures might not provide complete data. Once you are ready to stop the packet capture, run the following command.

The parameters are similar to the ones in the Starting a Packet Capture Section. The SAS URL was generated in the [Create a Storage Account](#createstorage) section.

### Gateway-level packet capture

   ```azurepowershell-interactive
Stop-AzVpnGatewayPacketCapture -ResourceGroupName $rg -Name <GatewayName> -SasUrl $sas
   ```

### Connection-level packet captures

   ```azurepowershell-interactive
Stop-AzVpnConnectionPacketCapture -ResourceGroupName $rg -Name <name of the VPN connection> -ParentResourceName "<name of VPN Gateway>" -LinkConnectionName <comma separated list of links e.g. "link1,link2">-SasUrl $sas
   ```

## Viewing your packet capture

In Azure portal, navigate to the Storage Account created in “Create a Storage Account” Click on your container and download the file. Packet capture data files are generated in PCAP format. You can use Wireshark or another commonly available application to open PCAP files.

## Next steps

Next, to learn more about Virtual WAN, see:

> [!div class="nextstepaction"]
> * [Virtual WAN FAQ](virtual-wan-faq.md)