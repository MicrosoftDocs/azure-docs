---
title: 'Configure packet capture for VPN Gateway'
titleSuffix: Azure VPN Gateway
description: Learn about packet capture functionality that you can use on VPN gateways to help narrow down the cause of a problem.  
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 08/24/2023
ms.author: cherylmc
---

# Configure packet capture for VPN gateways

Connectivity and performance-related problems are often complex. It can take significant time and effort just to narrow down the cause of the problem. Packet capture can help you narrow down the scope of a problem to certain parts of the network. It can help you determine whether the problem is on the customer side of the network, the Azure side of the network, or somewhere in between. After you narrow down the problem, it's more efficient to debug and take remedial action.

There are some commonly available packet capture tools. Getting relevant packet captures with these tools can be cumbersome, especially in high-volume traffic scenarios. The filtering capabilities provided by Azure VPN Gateway packet capture are a major differentiator. You can use VPN Gateway packet capture together with commonly available packet capture tools.

## About packet capture for VPN Gateway

You can run VPN Gateway packet capture on the gateway, or on a specific connection, depending on your needs. You can also run packet capture on multiple tunnels at the same time. You can capture one-way or bi-directional traffic, IKE and ESP traffic, and inner packets along with filtering on a VPN gateway.

It's helpful to use a five-tuple filter (source subnet, destination subnet, source port, destination port, protocol) and TCP flags (SYN, ACK, FIN, URG, PSH, RST) when you're isolating problems in high-volume traffic.

The following examples of JSON and a JSON schema provide explanations of each property. Here are some limitations to keep in mind when you run packet captures:

- In the schema shown here, the filter is an array, but currently only one filter can be used at a time.
- You can't run multiple gateway-wide packet captures at the same time.
- You can't run multiple packet captures on a single connection at the same time. You can run multiple packet captures on different connections at the same time.
- A maximum of five packet captures can be run in parallel per gateway. These packet captures can be a combination of gateway-wide packet captures and per-connection packet captures.
- The unit for MaxPacketBufferSize is bytes and MaxFileSize is megabytes

> [!NOTE]  
> Set the **CaptureSingleDirectionTrafficOnly** option to **false** if you want to capture both inner and outer packets.

**Example JSON**

```JSON-interactive
{
  "TracingFlags": 11,
  "MaxPacketBufferSize": 120,
  "MaxFileSize": 200,
  "Filters": [
    {
      "SourceSubnets": [
        "20.1.1.0/24"
      ],
      "DestinationSubnets": [
        "10.1.1.0/24"
      ],
      "SourcePort": [
        500
      ],
      "DestinationPort": [
        4500
      ],
      "Protocol": [
        6
      ],
      "TcpFlags": 16,
      "CaptureSingleDirectionTrafficOnly": true
    }
  ]
}
```

**JSON schema**

```JSON-interactive
{
    "type": "object",
    "title": "The Root Schema",
    "description": "The root schema input JSON filter for packet capture",
    "default": {},
    "additionalProperties": true,
    "required": [
        "TracingFlags",
        "MaxPacketBufferSize",
        "MaxFileSize",
        "Filters"
    ],
    "properties": {
        "TracingFlags": {
            "$id": "#/properties/TracingFlags",
            "type": "integer",
            "title": "The Tracingflags Schema",
            "description": "Tracing flags that customer can pass to define which packets are to be captured. Supported values are CaptureESP = 1, CaptureIKE = 2, CaptureOVPN = 8. The final value is OR of the bits.",
            "default": 11,
            "examples": [
                11
            ]
        },
        "MaxPacketBufferSize": {
            "$id": "#/properties/MaxPacketBufferSize",
            "type": "integer",
            "title": "The Maxpacketbuffersize Schema",
            "description": "Maximum buffer size of each packet. The capture will only contain contents of each packet truncated to this size.",
            "default": 120,
            "examples": [
                120
            ]
        },
        "MaxFileSize": {
            "$id": "#/properties/MaxFileSize",
            "type": "integer",
            "title": "The Maxfilesize Schema",
            "description": "Maximum file size of the packet capture file. It is a circular buffer.",
            "default": 100,
            "examples": [
                100
            ]
        },
        "Filters": {
            "$id": "#/properties/Filters",
            "type": "array",
            "title": "The Filters Schema",
            "description": "An array of filters that can be passed to filter inner ESP traffic.",
            "default": [],
            "examples": [
                [
                    {
                        "Protocol": [
                            6
                        ],
                        "CaptureSingleDirectionTrafficOnly": true,
                        "SourcePort": [
                            500
                        ],
                        "DestinationPort": [
                            4500
                        ],
                        "TcpFlags": 16,
                        "SourceSubnets": [
                            "20.1.1.0/24"
                        ],
                        "DestinationSubnets": [
                            "10.1.1.0/24"
                        ]
                    }
                ]
            ],
            "additionalItems": true,
            "items": {
                "$id": "#/properties/Filters/items",
                "type": "object",
                "title": "The Items Schema",
                "description": "An explanation about the purpose of this instance.",
                "default": {},
                "examples": [
                    {
                        "SourcePort": [
                            500
                        ],
                        "DestinationPort": [
                            4500
                        ],
                        "TcpFlags": 16,
                        "SourceSubnets": [
                            "20.1.1.0/24"
                        ],
                        "DestinationSubnets": [
                            "10.1.1.0/24"
                        ],
                        "Protocol": [
                            6
                        ],
                        "CaptureSingleDirectionTrafficOnly": true
                    }
                ],
                "additionalProperties": true,
                "required": [
                    "SourceSubnets",
                    "DestinationSubnets",
                    "SourcePort",
                    "DestinationPort",
                    "Protocol",
                    "TcpFlags",
                    "CaptureSingleDirectionTrafficOnly"
                ],
                "properties": {
                    "SourceSubnets": {
                        "$id": "#/properties/Filters/items/properties/SourceSubnets",
                        "type": "array",
                        "title": "The Sourcesubnets Schema",
                        "description": "An array of source subnets that need to match the Source IP address of a packet. Packet can match any one value in the array of inputs.",
                        "default": [],
                        "examples": [
                            [
                                "20.1.1.0/24"
                            ]
                        ],
                        "additionalItems": true,
                        "items": {
                            "$id": "#/properties/Filters/items/properties/SourceSubnets/items",
                            "type": "string",
                            "title": "The Items Schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "20.1.1.0/24"
                            ]
                        }
                    },
                    "DestinationSubnets": {
                        "$id": "#/properties/Filters/items/properties/DestinationSubnets",
                        "type": "array",
                        "title": "The Destinationsubnets Schema",
                        "description": "An array of destination subnets that need to match the Destination IP address of a packet. Packet can match any one value in the array of inputs.",
                        "default": [],
                        "examples": [
                            [
                                "10.1.1.0/24"
                            ]
                        ],
                        "additionalItems": true,
                        "items": {
                            "$id": "#/properties/Filters/items/properties/DestinationSubnets/items",
                            "type": "string",
                            "title": "The Items Schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "10.1.1.0/24"
                            ]
                        }
                    },
                    "SourcePort": {
                        "$id": "#/properties/Filters/items/properties/SourcePort",
                        "type": "array",
                        "title": "The Sourceport Schema",
                        "description": "An array of source ports that need to match the Source port of a packet. Packet can match any one value in the array of inputs.",
                        "default": [],
                        "examples": [
                            [
                                500
                            ]
                        ],
                        "additionalItems": true,
                        "items": {
                            "$id": "#/properties/Filters/items/properties/SourcePort/items",
                            "type": "integer",
                            "title": "The Items Schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": 0,
                            "examples": [
                                500
                            ]
                        }
                    },
                    "DestinationPort": {
                        "$id": "#/properties/Filters/items/properties/DestinationPort",
                        "type": "array",
                        "title": "The Destinationport Schema",
                        "description": "An array of destination ports that need to match the Destination port of a packet. Packet can match any one value in the array of inputs.",
                        "default": [],
                        "examples": [
                            [
                                4500
                            ]
                        ],
                        "additionalItems": true,
                        "items": {
                            "$id": "#/properties/Filters/items/properties/DestinationPort/items",
                            "type": "integer",
                            "title": "The Items Schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": 0,
                            "examples": [
                                4500
                            ]
                        }
                    },
                    "Protocol": {
                        "$id": "#/properties/Filters/items/properties/Protocol",
                        "type": "array",
                        "title": "The Protocol Schema",
                        "description": "An array of protocols that need to match the Protocol of a packet. Packet can match any one value in the array of inputs.",
                        "default": [],
                        "examples": [
                            [
                                6
                            ]
                        ],
                        "additionalItems": true,
                        "items": {
                            "$id": "#/properties/Filters/items/properties/Protocol/items",
                            "type": "integer",
                            "title": "The Items Schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": 0,
                            "examples": [
                                6
                            ]
                        }
                    },
                    "TcpFlags": {
                        "$id": "#/properties/Filters/items/properties/TcpFlags",
                        "type": "integer",
                        "title": "The Tcpflags Schema",
                        "description": "A list of TCP flags. The TCP flags set on the packet must match any flag in the list of flags provided. FIN = 0x01,SYN = 0x02,RST = 0x04,PSH = 0x08,ACK = 0x10,URG = 0x20,ECE = 0x40,CWR = 0x80. An OR of flags can be provided.",
                        "default": 0,
                        "examples": [
                            16
                        ]
                    },
                    "CaptureSingleDirectionTrafficOnly": {
                        "$id": "#/properties/Filters/items/properties/CaptureSingleDirectionTrafficOnly",
                        "type": "boolean",
                        "title": "The Capturesingledirectiontrafficonly Schema",
                        "description": "A flags which when set captures reverse traffic also.",
                        "default": false,
                        "examples": [
                            true
                        ]
                    }
                }
            }
        }
    }
}
```

### Key considerations

- Running packet capture can affect performance. Remember to stop the packet capture when you don't need it.
- Suggested minimum packet capture duration is 600 seconds. Because of sync issues among multiple components on the path, shorter packet captures might not provide complete data.
- Packet capture data files are generated in PCAP format. Use Wireshark or other commonly available applications to open PCAP files.
- Packet captures aren't supported on policy-based gateways.
- The maximum filesize of packet capture data files is 500 MB.
- If the `SASurl` parameter isn't configured correctly, the trace might fail with Storage errors. For examples of how to correctly generate an `SASurl` parameter, see [Stop-AzVirtualNetworkGatewayPacketCapture](/powershell/module/az.network/stop-azvirtualnetworkgatewaypacketcapture).
- If you're configuring a User Delegated SAS, make sure the user account is granted proper RBAC permissions on the storage account such as Storage Blob Data Owner.

## Packet capture - portal

This section helps you start and stop a packet capture using the Azure portal.

### Start packet capture - portal

You can set up packet capture in the Azure portal.

1. Go to your VPN gateway in the Azure portal.
1. On the left, select **VPN Gateway Packet Capture** to open the VPN Gateway Packet Capture page.
1. Select **Start Packet Capture**.

   :::image type="content" source="./media/packet-capture/packet-capture-portal.png" alt-text="Screenshot of start packet capture in the portal." lightbox="./media/packet-capture/packet-capture-portal.png":::

1. On the **Start Packet Capture** page, make any necessary adjustments. Don't select the "Capture Single Direction Traffic Only" option if you want to capture both inner and outer packets. 
1. Once you've configured the settings, click **Start Packet Capture**.

### Stop packet capture - portal

To complete a packet capture, you need to provide a valid SAS (or Shared Access Signature) URL with read/write access. When a packet capture is stopped, the output of the packet capture is written to the container that is referenced by the SAS URL.

1. To get the SAS URL, go to the storage account.
1. Go to the container you want to use and right-click to show the dropdown list. Select **Generate SAS** to open the Generate SAS page.
1. On the Generate SAS page, configure your settings. Make sure that you have granted read and write access.
1. Click **Generate SAS token and URL**.
1. The SAS token and SAS URL is generated and appears below the button immediately. Copy the Blob SAS URL.

   :::image type="content" source="./media/packet-capture/generate-sas.png" alt-text="Screenshot of generate SAS token." lightbox="./media/packet-capture/generate-sas.png":::

1. Go back to the VPN Gateway Packet Capture page in the Azure portal and click the **Stop Packet Capture** button.

1. Paste the SAS URL (from the previous step) in the **Output Sas Url** text box and click **Stop Packet Capture**.

1. The packet capture (pcap) file will be stored in the specified account.

## Packet capture - PowerShell

The following examples show PowerShell commands that start and stop packet captures. For more information on parameter options, see [Start-AzVirtualnetworkGatewayPacketCapture](/powershell/module/az.network/start-azvirtualnetworkgatewaypacketcapture).

**Prerequisites**

* Packet capture data needs to be logged into a storage account on your subscription. See [create storage account](../storage/common/storage-account-create.md).

* To stop the packet capture, you'll need to generate the `SASUrl` for your storage account. See [create a user delegation SAS](../storage/blobs/storage-blob-user-delegation-sas-create-powershell.md).

### Start packet capture for a VPN gateway

```azurepowershell-interactive
Start-AzVirtualnetworkGatewayPacketCapture -ResourceGroupName "YourResourceGroupName" -Name "YourVPNGatewayName"
```

You can use the optional parameter `-FilterData` to apply a filter.

### Stop packet capture for a VPN gateway

```azurepowershell-interactive
Stop-AzVirtualNetworkGatewayPacketCapture -ResourceGroupName "YourResourceGroupName" -Name "YourVPNGatewayName" -SasUrl "YourSASURL"
```

For more information on parameter options, see [Stop-AzVirtualNetworkGatewayPacketCapture](/powershell/module/az.network/stop-azvirtualnetworkgatewaypacketcapture).

### Start packet capture for a VPN gateway connection

```azurepowershell-interactive
Start-AzVirtualNetworkGatewayConnectionPacketCapture -ResourceGroupName "YourResourceGroupName" -Name "YourVPNGatewayConnectionName"
```

You can use the optional parameter `-FilterData` to apply a filter.

### Stop packet capture on a VPN gateway connection

```azurepowershell-interactive
Stop-AzVirtualNetworkGatewayConnectionPacketCapture -ResourceGroupName "YourResourceGroupName" -Name "YourVPNGatewayConnectionName" -SasUrl "YourSASURL"
```

For more information on parameter options, see [Stop-AzVirtualNetworkGatewayConnectionPacketCapture](/powershell/module/az.network/stop-azvirtualnetworkgatewayconnectionpacketcapture).

## Next steps

For more information about VPN Gateway, see [What is VPN Gateway?](vpn-gateway-about-vpngateways.md)
