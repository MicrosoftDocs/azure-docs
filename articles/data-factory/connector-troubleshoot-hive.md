---
title: Troubleshoot the Hive connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Hive connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 01/28/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Hive connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Hive connector in Azure Data Factory and Azure Synapse.

## The performance difference between the ODBC connector and the Hive connector

- **Symptoms**: The concern about the performance difference between the ODBC connector and the Hive connector. 

- **Cause**: The ODBC connector needs its own driver, which may cause the performance difference due to the third-party driver quality.

- **Recommendation**: Use the Hive connector firstly. 


## Unexpected response received from the server when connecting to the Hive server via ODBC

- **Symptoms**: When connecting to the Hive server using ODBC linked service, you meet this error message: `ERROR [HY000] [Cloudera][DriverSupport] (1110) Unexpected response received from server. Please ensure the server host and port specified for the connection are correct and confirm if SSL should be enabled for the connection.`

- **Cause**: You use the Kerberos authentication that is not supported in Azure Data Factory.

- **Recommendation**: Try the following steps. If they do not work, check the provided driver to resolve this issue.
    1. The **krb5.ini** file is in the **C:\Program Files\MIT\Kerberos\bin** folder.
    2. Add the `KRB5_CONFIG` and `KRB5CCNAME` to the system variable as well.
    3. Edit the **krb5.ini** file.
    4. Shut down and restart the VM and the SHIR from the machine.

## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)