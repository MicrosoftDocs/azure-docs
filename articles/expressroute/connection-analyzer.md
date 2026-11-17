---
title: Diagnose ExpressRoute packet loss with Connection Analyzer (preview)
description: Learn how to use Connection Analyzer in Azure Network Watcher to measure Azure-side packet loss on an ExpressRoute circuit and download a targeted packet capture.
author: rathinaman
ms.author: namanrathi
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 11/06/2026
---

# Diagnose ExpressRoute packet loss with Connection Analyzer (preview)

Connection Analyzer is a feature of Azure Network Watcher that helps you diagnose connectivity issues on an Azure ExpressRoute circuit. It sends synthetic traffic between an Azure virtual machine (VM) and an on-premises destination over a specific circuit, captures that traffic at the Microsoft edge when it detects loss, and reports Azure-side packet loss together with a link to the raw capture file. You get the evidence you need to analyze issues yourself or escalate them with confidence.

This article explains how Connection Analyzer works and shows you how to run an analysis and review its results.

> [!IMPORTANT]
> Connection Analyzer for ExpressRoute is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## What problem does it solve?

When an application team reports connectivity degradation over an ExpressRoute circuit, network administrators typically need to:

- Isolate whether the issue is on the Azure side or beyond the Microsoft edge.
- Capture traffic to confirm packet loss, retransmissions, or unexpected drops.
- Analyze the capture to identify the fault, or share it with the on-premises network team or Microsoft Support for further investigation.

Connection Analyzer addresses all three steps in a single, circuit-scoped operation from the ExpressRoute circuit in the Azure portal.

## How it works

1. Connection Analyzer generates synthetic traffic by using iperf between the source Azure VM, which acts as the client, and the destination on-premises machine, which acts as the server, over the selected ExpressRoute circuit.
1. When it observes packet loss, Connection Analyzer starts a packet capture on the Microsoft Enterprise Edge (MSEE) devices that targets the synthetic traffic flowing between the two endpoints.
1. After the capture, Connection Analyzer analyzes it and reports:
    - Total packets captured
    - Packets lost
    - Azure-side packet loss percentage
1. The raw capture (*.cap*) file is written to a storage account that you specify. You can download the file for deep packet inspection, or share it with your network team or Microsoft Support.

Before you run Connection Analyzer, you must start an iperf server on the destination on-premises machine. For steps, see [Start the iperf server on the destination](#start-the-iperf-server-on-the-destination).

> [!NOTE]
> Connection Analyzer reports **Azure-side packet loss only**. It doesn't currently measure loss that occurs beyond the Microsoft edge, including on the customer-managed on-premises segment.

## Key capabilities

| Capability | Details |
| --- | --- |
| Circuit-scoped capture | Captures traffic on a specific ExpressRoute circuit, which reduces noise from unrelated flows. |
| Azure-side loss measurement | Reports total packets captured, packets lost, and Azure-side loss percentage. |
| Configurable source and destination | Specify the source VM, an optional source port, the destination IP address, and the destination port. |
| Bandwidth input | Set the expected bandwidth (Mbps) to put capture results in context. |
| Storage account output | Writes the capture file to a storage account of your choice for offline analysis or sharing. |
| Persistent results | Saves previously run analyses so that you can review them at any time within their retention window, without rerunning a test. |
| Azure portal and REST API | Run and review analyses from the Azure portal or by using the REST API. |

## Supported configurations

| Category | Support |
| --- | --- |
| Source resource | Azure virtual machines only |
| ExpressRoute peering type | Azure private peering |
| ExpressRoute circuit SKU | All (Local, Standard, and Premium) |
| Network Watcher enablement | Automatic. No manual enablement is required. |
| Interfaces | Azure portal and REST API |

## Limitations

- The source must be an Azure VM. On-premises hosts aren't supported as the capture source.
- You must manually start an iperf server on the on-premises destination so that it listens for traffic.
- Packet loss is measured on the Azure side only. The feature doesn't measure loss on the customer-managed segment.
- Hop-by-hop path visualization isn't provided.
- Results are scoped per circuit. There's no cross-circuit view.

## Pricing

Connection Analyzer is charged as a SKU of Network Watcher diagnostics. For more information, see [Network Watcher pricing](https://azure.microsoft.com/pricing/details/network-watcher/).

## Prerequisites

- An active ExpressRoute circuit with Azure private peering.
- An Azure VM in a virtual network that's connected to the ExpressRoute circuit.
- A storage account to receive the packet capture file.
- The following permissions:

    | Resource | Required permission |
    | --- | --- |
    | Source virtual machine | Write |
    | Storage account | Write (to generate a SAS key and to create and upload containers and blobs) |
    | ExpressRoute circuit | Write |
    | Network Watcher instance in the source VM's region | `Microsoft.Network/networkWatchers/connectionAnalyzers/write` to create an analysis, `Microsoft.Network/networkWatchers/connectionAnalyzers/read` to read its details, and `Microsoft.Network/networkWatchers/connectionAnalyzers/queryStatus/action` to query its status. |

- An iperf server running on the destination on-premises machine. For steps, see the next section.

## Start the iperf server on the destination

Connection Analyzer sends synthetic traffic to an iperf server on the on-premises destination. Start the server before you run an analysis.

1. Download the iperf binary for your operating system from [iperf.fr](https://iperf.fr/iperf-download.php).
1. Start the iperf server:

    - **Windows**: Unzip the downloaded file, go to the unzipped iperf directory, and run the following command at a command prompt:

        ```cmd
        iperf3.exe -s
        ```

    - **Linux**: After you install iperf, run the following command in a terminal:

        ```bash
        iperf3 -s
        ```

1. Confirm that the output shows `Server listening on 5201`.

## Run a connection analysis

### Azure portal

1. In the Azure portal, search for and select **ExpressRoute circuits**.
1. Select the circuit that you want to analyze.
1. In the circuit's left menu, under **Monitoring**, select **Connection Analyzer**.
1. Select **+ Create Connection Analyzer**.

    :::image type="content" source="./media/connection-analyzer/connection-analyzer-list.png" alt-text="Screenshot of the Connection Analyzers page for an ExpressRoute circuit in the Azure portal." lightbox="./media/connection-analyzer/connection-analyzer-list.png":::

1. Enter or select the following values:

    | Setting | Description | Example |
    | --- | --- | --- |
    | **Name** | A name for this analysis. | *prod-er-analysis-01* |
    | **Subscription** | The subscription that contains the source VM. | *Contoso-Prod* |
    | **Source Virtual Machine** | The Azure VM that sends the synthetic traffic. | *vm-app-eastus-01* |
    | **Source Port** | (Optional) The source port to filter. Leave blank to include all ports. | *443*, or blank |
    | **Destination IP Address** | The IP address of the on-premises destination that runs the iperf server. | *10.10.20.5* |
    | **Destination Port** | The destination port to filter. | *5201* |
    | **ExpressRoute Circuit ID** | Prepopulated from the circuit that you're viewing. You can't edit it. | *er-circuit-prod-eastus* |
    | **Bandwidth (Mbps)** | (Optional) The expected bandwidth for this connection. | *100* |
    | **Storage Account** | The storage account to write the capture file to. | *stcaptureprod001* |

1. Select **Create**.

    :::image type="content" source="./media/connection-analyzer/create-connection-analyzer.png" alt-text="Screenshot of the Create Connection Analyzer pane with source, destination, ExpressRoute, and storage settings." lightbox="./media/connection-analyzer/create-connection-analyzer.png":::

> [!NOTE]
> Connection Analyzer automatically uses the Network Watcher instance in the VM's region. You don't need to enable it manually.

### REST API

Use API version `2025-01-01`. The request body has the following structure:

```json
{
  "location": "<region>",
  "properties": {
    "diagnosticOperations": [ "<string>" ],
    "source": {
      "resourceId": "<source VM resource ID>",
      "type": "<string>",
      "port": <number>
    },
    "destination": {
      "address": "<destination IP address>",
      "port": <number>
    },
    "outputSettings": {
      "storageAccountSettings": {
        "storageAccountId": "<storage account resource ID>"
      }
    },
    "diagnosticOperationsSettings": {
      "expressRouteDiagnosticsSettings": {
        "erCircuitResourceId": "<ExpressRoute circuit resource ID>",
        "bandwidth": <number>
      }
    }
  }
}
```

## Review results

When the analysis finishes, you see the results on the **Connection Analyzer** page. The page lists previously run analyses. You can select any of them to review its results within the retention window. You don't need to rerun a test to revisit its results.

:::image type="content" source="./media/connection-analyzer/analysis-details.png" alt-text="Screenshot of the details pane for a completed connection analysis." lightbox="./media/connection-analyzer/analysis-details.png":::

Select an analysis to view its details:

| Result field | Description |
| --- | --- |
| **Packets captured (#)** | The total number of packets captured during the analysis. |
| **Lost packets analyzed (#)** | The number of packets that didn't complete their path on the Azure side. |
| **Loss at Azure (%)** | Azure-side packet loss, as a percentage. |
| **Storage Account** and **Path** | The full path to the *.cap* file in your storage account. |

:::image type="content" source="./media/connection-analyzer/analysis-results.png" alt-text="Screenshot of the storage configuration and results of a connection analysis, including loss at Azure, packets captured, and lost packets analyzed.":::

> [!NOTE]
> Results are scoped to the circuit that you're viewing: you see only analyses that you ran against that circuit. To view analyses for a different circuit, go to that circuit and open Connection Analyzer from there.

### Use the capture file

The **Path** value points to a *.cap* file in the storage account that you specified. Download the file and open it in a packet analysis tool to inspect individual packets, TCP retransmissions, resets (RSTs), or application-layer errors.

## Related content

- [Configure Connection Monitor for ExpressRoute](how-to-configure-connection-monitor.md) for continuous end-to-end connectivity and latency monitoring over time.
- [Monitor ExpressRoute](monitor-expressroute.md)
- [Support and troubleshooting for ExpressRoute](expressroute-support-help.md)
