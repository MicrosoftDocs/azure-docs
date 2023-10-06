---
title: Discover third-party solutions from Azure Synapse partners through Synapse Studio
description: Learn how to discover new third-party solutions that are tightly integrated with Azure Synapse partners
author: gillharmeet
ms.author: harmeetgill
manager: santoshb
ms.reviewer: omafnan, wiassaf
ms.date: 06/14/2023
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: seo-lt-2019
---

# Discover partner solutions through Synapse Studio

Synapse Studio allows the discovery of solution partners that extend the capabilities of Azure Synapse. From data connectors, through data wrangling tools, orchestration engines, and other workloads, the **browse partners** page serves as a hub for discovering third-party ISV applications and solutions verified to work with Azure Synapse Analytics. Synapse Studio simplifies getting started with these partners, in many cases with automated setup of the initial connection to the partner platform.

## Participating partners
The following table lists partner solutions that are currently supported. Make sure you check back often as we add new partners to this list. 

| Partner | Solution name |
| ------- | ------------- |
| :::image type="content" source="./media/data-integration/incorta-logo.png" alt-text="The corporate logo of Incorta."::: | Incorta Intelligent Ingest for Azure Synapse |
| :::image type="content" source="./media/data-integration/informatica_logo.png" alt-text="The corporate logo of Informatica."::: | Informatica Intelligent Data Management Cloud |
| :::image type="content" source="./media/business-intelligence/qlik_logo.png" alt-text="The corporate logo of Qlik Data Integration (formerly Attunity)."::: | Qlik Data Integration (formerly Attunity) |

## Requirements
When you chose a partner application, Azure Synapse Studio provisions a sandbox environment you can use for this trial, ensuring you can experiment with partner solutions quickly before you decide to use it with your production data. The following objects are created: 

|  Object  |    Details    |
| -------- | ------------- |
| A [dedicated SQL pool](../overview-what-is.md) named **Partner_[PartnerName]_pool** | DW100c performance level. |
| A [SQL login](/sql/relational-databases/security/authentication-access/principals-database-engine#sa-login) named **Partner_[PartnerName]_login** | Created on your `master` database. The password for this SQL login is specified by you at the creation of your trial.|
| A [database user](/azure/azure-sql/database/logins-create-manage) | A new database user, mapped to the new SQL login. This user is added to the db_owner role for the newly created database. |

In all cases, **[PartnerName]** is the name of the third-party ISV who offers the trial. 

### Security
After the required objects are created, Synapse Studio sends information about your new sandbox environment to the partner application, allowing a customized trial experience. The following information is sent to our partners: 
- First name
- Last name
- E-mail address
-  Details about the Synapse environment required to establish a connection:     
    - DNS name of your Synapse Workspace (server name)
    - Name of the SQL pool (database)
    - SQL login (username only)
    
We never share any passwords with the partner application, including the password of the newly created SQL login. You'll be required to type your password in the partner application.

### Costs
The dedicated SQL pool that is created for your partner trial incurs ongoing costs, which are based on the number of DWU blocks and hours running. Make sure you pause the SQL pool created for this partner trial when it isn't in use, to avoid unnecessary charges. 

## Start a new partner trial

1) On the Synapse Studio home page, under **Discover more**, select **browse partners**.
2) The Browse partners page shows all partners currently offering trials that allow direct connectivity with Azure Synapse. Choose a partner solution.
3) The partner details page shows you relevant information about this application and links to learn more about their solution. When you're ready to start a trial, select **Connect to partner**.
4) In the **Connect to [PartnerName] Solution** page, note requirements of this partner connection. Change the SQL pool name and SQL login parameters if wanted (or accept the defaults), type the password of your new SQL login, and select **Connect**.

The required objects will be created for your partner trial. You'll then be forwarded to a partner page to provide additional information (if needed) and to start your trial. 

> [!NOTE]
> Microsoft doesn't control the partner trial experience. Partners offer product trials on their own terms and the experience, trial availability, and features may vary depending on the partner. Microsoft does not offer support to third-party applications offered in Synapse Studio. 

## Next steps

- To learn more about some of our other partners, see [Data integration partners](data-integration.md), [Data management partners](data-management.md), and [Machine Learning and AI partners](machine-learning-ai.md).
