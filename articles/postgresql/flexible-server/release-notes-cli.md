---
title: CLI  release notes
description: Azure CLI release notes for Azure Database for PostgreSQL - Flexible Server.
author: gennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 5/1/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: overview
ms.custom:
  - references_regions
  - build-2023
---
# Azure CLI release notes - Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This page provides latest news and updates regarding the Azure Database for PostgreSQL Flexible Server additions for Azure CLI.  

## Azure CLI Releases

### April 30, 2024 - Version 2.60.0
|Additions and Changes              |Comments                                               |
|-----------------------------------|-------------------------------------------------------|
|az postgres flexible-server upgrade|Add capability to perform major version upgrade to PG16|


### January 09 2024 - version 2.56.0

| Additions and Changes |Comments|
| --- | --- | 
|az postgres flexible-server virtual-endpoint | Add support for virtual endpoints for PostgreSQL flexible server| 
|az postgres flexible-server replica promote| Add capability to stop replication and promote to primary or standalone server with the selection of planned/force data syncs|
 az postgres flexible-server server-logs list| List server log files for PostgreSQL flexible server|
|az postgres flexible-server server-logs download|Download server log files for PostgreSQL flexible server|
|az postgres flexible-server create|  Add capability to set storage type to PremiumV2_LRS and provide values for IOPS and Throughput during creation|
|az postgres flexible-server update|Add capability to update the values of IOPS and Throughput during update}
|az postgres flexible-server migration create|Add migration option like Migrate, Validate and ValidateAndMigrate using parameter--migration-option and json file for Migration configuration to support another properties like sourceType and sslMode|

### November 14  2023 - version 2.54.0

| Additions and Changes |Comments|
| --- | --- | 
|az postgres flexible-server geo-restore|Add cross subscription geo-restore support for PostgreSQL flexible server|
|az postgres flexible-server restore|  Add cross subscription restore support for PostgreSQL flexible server |
|az postgres flexible-server upgrade| Add MVU support for PG version 15|

### September 26 2023 - version 2.53.0
| Additions and Changes |Comments|
| --- | --- | 
|az postgres flexible-server create/update|Add capability to enable/disable storage autogrow during creation and update|

## Contacts

For any questions or suggestions you might have on Azure Database for PostgreSQL flexible server, send an email to the Azure Database for PostgreSQL flexible server Team ([@Ask Azure Database for PostgreSQL flexible server](mailto:AskAzureDBforPostgreSQL@service.microsoft.com)). This email address isn't a technical support alias.

In addition, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/forums/597976-azure-database-for-postgresql).

## Next steps

Now that you've read our CLI Release Notes on Azure Database for PostgreSQL flexible server, you're ready to create your first server: [Create an Azure Database for PostgreSQL - Flexible Server using Azure portal](./quickstart-create-server-portal.md)

