---
author: croblesm
ms.author: roblescarlos
ms.service: dms
ms.topic: include
ms.date: 09/30/2022
---

* [Download and install Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio)
* [Install the Azure SQL migration extension](/sql/azure-data-studio/extensions/azure-sql-migration-extension) from the Azure Data Studio marketplace
* Have an Azure account that is assigned to one of the built-in roles listed below:
    - Contributor for the target Azure SQL Database
    - Reader role for the Azure Resource Groups containing the target Azure SQL Database.
    - Owner or Contributor role for the Azure subscription (required if creating a new DMS service).
    - As an alternative to using the above built-in roles, you can assign a custom role as defined in [this article.](/azure/dms/resource-custom-roles-sql-database-ads)  
    > [!IMPORTANT]
    > Azure account is only required when configuring the migration steps and is not required for assessment or Azure recommendation steps in the migration wizard.
* Create a target [Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart).
* Ensure that the login used to connect the source SQL Server is a member of the `db_datareader` and the login for the target SQL server is `db_owner`.
* Migrate database schema from source to target using [SQL Server dacpac extension](/sql/azure-data-studio/extensions/sql-server-dacpac-extension), or [SQL Database Projects extension](/sql/azure-data-studio/extensions/sql-database-project-extension) for Azure Data Studio.
* If you're using the Azure Database Migration Service for the first time, ensure that Microsoft.DataMigration resource provider is registered in your subscription. You can follow the steps to [register the resource provider](/azure/dms/quickstart-create-data-migration-service-portal#register-the-resource-provider)
