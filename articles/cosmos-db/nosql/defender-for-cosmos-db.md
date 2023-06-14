---
title: 'Microsoft Defender for Azure Cosmos DB'
description: Learn how Microsoft Defender provides advanced threat protection on Azure Cosmos DB.
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 06/21/2022
ms.author: sidandrews
author: seesharprun
---

# Microsoft Defender for Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Microsoft Defender for Azure Cosmos DB provides an extra layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit Azure Cosmos DB accounts. This layer of protection allows you to address threats, even without being a security expert, and integrate them with central security monitoring systems.

Security alerts are triggered when anomalies in activity occur. These security alerts show up in [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/). Subscription administrators also get these alerts over email, with details of the suspicious activity and recommendations on how to investigate and remediate the threats.

> [!NOTE]
>
> * Microsoft Defender for Azure Cosmos DB is currently available only for the API for NoSQL.
> * Microsoft Defender for Azure Cosmos DB is not currently available in Azure government and sovereign cloud regions.

For a full investigation experience of the security alerts, we recommended enabling [diagnostic logging in Azure Cosmos DB](../monitor.md), which logs operations on the database itself, including CRUD operations on all documents, containers, and databases.

## Threat types

Microsoft Defender for Azure Cosmos DB detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. It can currently trigger the following alerts:

- **Potential SQL injection attacks**: Due to the structure and capabilities of Azure Cosmos DB queries, many known SQL injection attacks can’t work in Azure Cosmos DB. However, there are some variations of SQL injections that can succeed and may result in exfiltrating data from your Azure Cosmos DB accounts. Defender for Azure Cosmos DB detects both successful and failed attempts, and helps you harden your environment to prevent these threats.

- **Anomalous database access patterns**: For example, access from a TOR exit node, known suspicious IP addresses, unusual applications, and unusual locations.

- **Suspicious database activity**: For example, suspicious key-listing patterns that resemble known malicious lateral movement techniques and suspicious data extraction patterns.

## Configure Microsoft Defender for Azure Cosmos DB

See [Enable Microsoft Defender for Azure Cosmos DB](../../defender-for-cloud/defender-for-databases-enable-cosmos-protections.md).

## Manage security alerts

When Azure Cosmos DB activity anomalies occur, a security alert is triggered with information about the suspicious security event. 

 From Microsoft Defender for Cloud, you can review and manage your current [security alerts](../../security-center/security-center-alerts-overview.md).  Click on a specific alert in [Defender for Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade/0) to view possible causes and recommended actions to investigate and mitigate the potential threat. An email notification is also sent with the alert details and recommended actions.

## Azure Cosmos DB alerts

 To see a list of the alerts generated when monitoring Azure Cosmos DB accounts, see the [Azure Cosmos DB alerts](../../security-center/alerts-reference.md#alerts-azurecosmos) section in the Microsoft Defender for Cloud documentation.

## Next steps

* Learn more about [Microsoft Defender for Azure Cosmos DB](../../defender-for-cloud/concept-defender-for-cosmos.md)
* Learn more about [Diagnostic logging in Azure Cosmos DB](../monitor-resource-logs.md)
