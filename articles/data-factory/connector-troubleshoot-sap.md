---
title: Troubleshoot the SAP Table, SAP Business Warehouse Open Hub, and SAP ODP connectors
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the SAP Table, SAP Business Warehouse Open Hub, and SAP ODP connectors in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 07/13/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the SAP Table, SAP Business Warehouse Open Hub, and SAP ODP connectors in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the SAP Table, SAP Business Warehouse Open Hub, and SAP ODP connectors in Azure Data Factory and Azure Synapse. 

## Error code: SapRfcDestinationAddFailed

- **Message**: `Get or create destination '%destination; failed.`

- **Cause**: Unable to connect to SAP server, which may be caused by the connection issue between the machine with an integration runtime installed and SAP server, or wrong credentials.  

- **Recommendation**: If the error messages are like `'<serverName>:3300' not reached`, test connection in the machine with an integration runtime installed first by following the PowerShell command below:

    ```powershell
    
    Test-NetConnection <sap server> -port 3300  
    
    ```

## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
