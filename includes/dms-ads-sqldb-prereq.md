---
author: croblesm
ms.author: roblescarlos
ms.service: dms
ms.topic: include
ms.date: 09/30/2022
---

- [Download and install Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).
- [Install the Azure SQL Migration extension](/sql/azure-data-studio/extensions/azure-sql-migration-extension) from Azure Data Studio Marketplace.
- Have an Azure account that's assigned to one of the following built-in roles:

  - Contributor for the target instance of Azure SQL Database
  - Reader role for the Azure resource group that contains the target instance of Azure SQL Database
  - Owner or Contributor role for the Azure subscription (required if you create a new instance of Azure Database Migration Service)
  
  As an alternative to using one of these built-in roles, you can [assign a custom role](../articles/dms/resource-custom-roles-sql-database-ads.md).
  
  > [!IMPORTANT]
  > An Azure account is required only when you configure the migration steps. An Azure account isn't required for the assessment or to view Azure recommendations in the migration wizard in Azure Data Studio.

- Create a target instance of [Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart).

- Make sure that the SQL Server login that connects to the source SQL Server instance is a member of the db_datareader role and that the login for the target SQL Server instance is a member of the db_owner role.

- Migrate the database schema from source to target by using the [SQL Server dacpac extension](/sql/azure-data-studio/extensions/sql-server-dacpac-extension) or the [SQL Database Projects extension](/sql/azure-data-studio/extensions/sql-database-project-extension) in Azure Data Studio.

- If you're using Azure Database Migration Service for the first time, make sure that the Microsoft.DataMigration [resource provider is registered in your subscription](../articles/dms/quickstart-create-data-migration-service-portal.md#register-the-resource-provider).
