---
title: Create a self-hosted integration runtime for the SAP CDC solution 
titleSuffix: Azure Data Factory
description: Learn how to create and set up a self-hosted integration runtime for your SAP change data capture (CDC) solution in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Create a self-hosted integration runtime for the SAP CDC solution in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Learn how to create and set up a self-hosted integration runtime for the SAP change data capture (CDC) solution in Azure Data Factory.

To prepare a self-hosted integration runtime to use with the SAP ODP (preview) connector, complete the steps that are described in the following sections.

## Create and configure a self-hosted integration runtime

In Azure Data Factory Studio, [create and configure a self-hosted integration runtime](create-self-hosted-integration-runtime.md?tabs=data-factory). You can download the latest version of the private [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). The download version has improved performance and detailed error messages. Install the runtime on your on-premises computer or virtual machine (VM).

The more CPU cores you have on the computer that's running the self-hosted integration runtime, the higher your data extraction throughput will be.  For example, our internal test achieved more than 12 MB/s throughput from running parallel extractions on a self-hosted integration runtime computer that has 16 CPU cores.

## Download and install the connector

Download the latest [64-bit SAP .NET Connector (SAP NCo 3.0)](https://support.sap.com/en/product/connectors/msnet.html) and install it on your self-hosted integration runtime computer. During installation, in the **Optional setup steps** dialog, select **Install Assemblies to GAC**.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-net-connector-installation.png" alt-text="Screenshot of the SAP .NET Connector 3.0 installation dialog.":::

## Add a network security rule

Add a network security rule on your SAP systems, so your self-hosted integration runtime computer can connect to them. If your SAP system is on an Azure VM, to add the rule:

1. Set **Source IP addresses/CIDR ranges** to your self-hosted integration runtime machine IP address.
1. Set **Destination port ranges** to **3200,3300**.  For example:

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-add-network-security-rule.png" alt-text="Screenshot of the Azure portal networking configuration to add network security rules for your SHIR to connect to your SAP systems.":::

## Test connectivity

On your self-hosted integration runtime computer, run the following PowerShell cmdlet to ensure that it can connect to your SAP systems: 

```powershell
Test-NetConnection <SAP system IP address> -port 3300 
```

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-powershell-test-connection.png" alt-text="Screenshot of the PowerShell cmdlet to test the connection to your SAP systems.":::

## Edit hosts files

Edit the hosts file on your self-hosted integration runtime machine to add your SAP IP addresses to your server names.

On your self-hosted integration runtime machine, edit *C:\Windows\System32\drivers\etc\hosts* to add mappings of your SAP system IP addresses to your server names.  For example:

```ini
# SAP ECC 
52.149.66.239 sapids01 
# SAP BW 
20.190.60.250 sapbwx01 
# SAP SLT 
20.56.211.31 sapnwx01 
```

## Next steps

[Prepare the SAP ODP linked service and source dataset](sap-change-data-capture-prepare-linked-service-source-dataset.md)
