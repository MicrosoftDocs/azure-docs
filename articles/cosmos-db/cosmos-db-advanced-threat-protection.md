---
title: 'Advanced Threat Protection for Azure Cosmos DB'
description: Learn how Azure Cosmos DB provides encryption of data at rest and how it's implemented.
author: monhaber
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/24/2019
ms.author: rimman
ms.author: sngun
ms.author: v-mohabe
ms.custom: seodec18
---

# Advanced Threat Protection for Azure Cosmos DB

Advanced Threat Protection for Azure Cosmos DB provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit Azure Cosmos DB accounts. This layer of protection allows you to address threats, even without being a security expert, and integrate them with central security monitoring systems.

Security alerts are triggered when anomalies in activity occur. These security alerts are integrated with  [Azure Security Center](https://azure.microsoft.com/services/security-center/), and are also sent via email to subscription administrators, with details of the suspicious activity and recommendations on how to investigate and remediate the threats.

> [!NOTE]
>
> * Advanced Threat Protection for Azure Cosmos DB is currently available only for the SQL API.
> * Advanced Threat Protection for Azure Cosmos DB is currently not available in Azure government and sovereign cloud regions.

For a full investigation experience of the security alerts, we recommended enabling [diagnostic logging in Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/logging), which logs operations on the database itself, including CRUD operations on all documents, containers, and databases.

## Set up Advanced Threat Protection

### Set up ATP using the portal

1. Launch the Azure portal at  [https://portal.azure.com](https://portal.azure.com/).

2. From the Azure Cosmos DB account, from the **Settings** menu, select **Advanced security**.

    ![Set up ATP](./media/cosmos-db-advanced-threat-protection/cosmos-db-atp.png)

3. In the **Advanced security** configuration blade:

    * Click the **Advanced Threat Protection** option to set it to **ON**.
    * Click **Save** to save the new or updated Advanced Threat Protection policy.   

### Set up ATP using REST API

Use Rest API commands to create, update, or get the Advanced Threat Protection setting for a specific Azure Cosmos DB account.

* [Advanced Threat Protection - Create](https://go.microsoft.com/fwlink/?linkid=2099745)
* [Advanced Threat Protection - Get](https://go.microsoft.com/fwlink/?linkid=2099643)

### Set up ATP using Azure PowerShell

Use the following PowerShell cmdlets:

* [Enable Advanced Threat Protection](https://go.microsoft.com/fwlink/?linkid=2099607&clcid=0x409)
* [Get Advanced Threat Protection](https://go.microsoft.com/fwlink/?linkid=2099608&clcid=0x409)
* [Disable Advanced Threat Protection](https://go.microsoft.com/fwlink/?linkid=2099709&clcid=0x409)

## Manage ATP security alerts

When Azure Cosmos DB activity anomalies occur, a security alert is triggered with information about the suspicious security event. 

 From Azure Security Center, you can review and manage your current [security alerts](../security-center/security-center-alerts-overview.md).  Click on a specific alert in [Security Center](https://ms.portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade/0) to view possible causes and recommended actions to investigate and mitigate the potential threat. The following image shows an example of alert details provided in Security Center.

 ![Threat details](./media/cosmos-db-advanced-threat-protection/cosmos-db-alert-details.png)

An email notification is also sent with the alert details and recommended actions. The following image shows an example of an alert email.

 ![Alert details](./media/cosmos-db-advanced-threat-protection/cosmos-db-alert.png)

## Cosmos DB ATP alerts

 To see a list of the alerts generated when monitoring Azure Cosmos DB accounts, see the [Cosmos DB alerts](../security-center/security-center-alerts-data-services.md#cosmos-db) section in the Security Center documentation.

## Next steps

* Learn more about [Diagnostic logging in Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/logging#turn-on-logging-in-the-azure-portal)
* Learn more about [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro)