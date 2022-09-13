---
title: SAP change data capture solution (Preview) - SHIR preparation
titleSuffix: Azure Data Factory
description: This article introduces and describes preparation of the self-hosted integration runtime (SHIR) for SAP change data capture (Preview) in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Self-hosted integration runtime (SHIR) preparation for the SAP change data capture (CDC) solution in Azure Data Factory (Preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article introduces and describes preparation of the self-hosted integration runtime (SHIR) for SAP change data capture (Preview) in Azure Data Factory.

To prepare SHIR w/ SAP ODP connector, complete the following steps:

## Create and configure SHIR

On ADF Studio, create and configure SHIR, see [Create and configure a self-hosted integration runtime](create-self-hosted-integration-runtime.md?tabs=data-factory). You can download our latest private SHIR version w/ improved performance and detailed error messages from [SHIR installation download](https://www.microsoft.com/download/details.aspx?id=39717) and install it on your on-premises/virtual machine.

The more CPU cores you have on your SHIR machine, the higher your data extraction throughput.  For example, our internal test achieved +12 MB/s throughput from running parallel extractions on SHIR machine w/ 16 CPU cores.

## Download and install the latest 64-bit SAP .NET Connector (SAP NCo 3.0)

Download the latest [64-bit SAP .NET Connector (SAP NCo 3.0)](https://support.sap.com/en/product/connectors/msnet.html) and install it on your SHIR machine.  During installation, select the **Install Assemblies to GAC** option in the **Optional setup steps** window. 

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-net-connector-installation.png" alt-text="Screenshot of the SAP .NET Connector 3.0 installation dialog.":::
 
## Add required network security rule on your SAP systems

Add a network security rule on your SAP systems, so SHIR machine can connect to them.  If your SAP system is on Azure virtual machine (VM), add the rule by setting the **Source IP addresses/CIDR ranges** property to your SHIR machine IP address and the **Destination port ranges** property to 3200,3300.  For example:

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-add-network-security-rule.png" alt-text="Screenshot of the Azure portal networking configuration to add network security rules for your SHIR to connect to your SAP systems.":::
 
## Run PowerShell cmdlet allowing your SHIR to connect to your SAP systems

On your SHIR machine, run the following PowerShell cmdlet to ensure that it can connect to your SAP systems: Test-NetConnection _&lt;SAP system IP address&gt;_ -port 3300 

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-powershell-test-connection.png" alt-text="Screenshot of the PowerShell cmdlet to test the connection to your SAP systems.":::

## Edit hosts file on SHIR machine to add SAP IP addresses to server names

On your SHIR machine, edit _C:\Windows\System32\drivers\etc\hosts_ to add mappings of SAP system IP addresses to server names.  For example:

```ini
# SAP ECC 
52.149.66.239 sapids01 
# SAP BW 
20.190.60.250 sapbwx01 
# SAP SLT 
20.56.211.31 sapnwx01 
```

## Next steps

[Prepare the SAP ODP linked service and source dataset](sap-change-data-capture-prepare-linked-service-source-dataset.md).