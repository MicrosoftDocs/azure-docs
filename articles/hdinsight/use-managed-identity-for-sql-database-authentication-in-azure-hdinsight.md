--- 
title: Use Managed Identity for SQL Database authentication in Azure HDInsight 
description: Learn how to use managed identity for SQL Database authentication in Azure HDInsight. 
ms.service: azure-hdinsight 
ms.topic: how-to 
author: abhishjain002
ms.author: abhishjain
ms.reviewer: nijelsf
ms.date: 03/31/2025 
---

# Use Managed Identity for SQL Database authentication in Azure HDInsight 


HDInsight added the Managed Identity option for authenticating SQL databases within its cluster offerings and providing a more secure authentication mechanism. 

This article outlines the process of using the Managed Identity (MSI) option for SQL Database authentication when creating an HDInsight cluster. 

The Managed Identity (MI) option is available for the following Databases:

| Databases | Host on Behalf of (HoBo)  DB  | Bring Your Own (BYO) DB |
|-|-|-|
|Ambari|✅ |✅ |
|Hive |✅| ✅|
|Oozie |✅ |✅ |
|Ranger (ESP)|❌ | ❌ |

> [!NOTE]
> * Managed Identity (MI) is currently available only in public regions. It will be rolled out to other regions (Federal and China regions) in future releases.
> * MI option isn't enabled by default. To get it enabled, submit a [support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) with your subscription and region details.

> [!IMPORTANT]
> * It's recommended not to update the Managed Identity after cluster recreation as it can disrupt cluster operation.
> * When you recreate an MSI with the same name, you must recreate the contained user and reassign roles, as the new MSI will have different object and client IDs even if the name remains unchanged.

## Steps to Use Managed Identity during cluster creation in Azure portal

1. During cluster creation, navigate to the Storage section and select the SQL database for Ambari/Hive/Oozie. Choose Managed Identity as the Authentication method.
  
   :::image type="content" source="./media/use-managed-identity-for-sql-database-authentication-in-azure-hdinsight/basic-tab.png" alt-text="Screenshot showing the basic tab." border="true" lightbox="./media/use-managed-identity-for-sql-database-authentication-in-azure-hdinsight/basic-tab.png":::

1. Select the Managed Identity to authenticate with SQL Database.
  
   :::image type="content" source="./media/use-managed-identity-for-sql-database-authentication-in-azure-hdinsight/storage-tab.png" alt-text="Screenshot showing the storage tab." border="true" lightbox="./media/use-managed-identity-for-sql-database-authentication-in-azure-hdinsight/storage-tab.png":::
   
1. Create a contained user with the Managed identity in the corresponding SQL database.

   Follow these steps in the Azure SQL database query editor to create a database user and grant it read-write permissions. Perform these steps for each SQL Database you're going to use for different services such as Ambari, Hive, or Oozie.
   

   > [!NOTE]
   > User name must contain the original MSI name extended by a user-defined suffix. As best practice, the suffix can include an initial part of its Object ID. 
Object ID of managed identity can be obtained from portal on the managed identity portal page.
   >
   > For example: 
   > * MSI Name: contosoMSI 
   > * Object ID: `aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb`
   > * user_name could be `contosoMSI_aaaaaaaa`


    ``` 
    CREATE USER {user_name} FROM EXTERNAL PROVIDER WITH OBJECT_ID={object id of cluster managed identity};   
 
    ALTER ROLE db_datareader ADD MEMBER {user_name};   
    ALTER ROLE db_ddladmin ADD MEMBER {user_name};   
    ALTER ROLE db_datawriter ADD MEMBER {user_name};   
    ``` 
    > [!NOTE]  
    > If the roles `db_executor`, `db_view_def`, and `db_view_state` are already defined in your database, there's no need to proceed with the subsequent step.

    ``` 
    CREATE ROLE db_executor;   
    GRANT EXECUTE TO db_executor;   
    ALTER ROLE db_executor ADD MEMBER {user_name};   

    CREATE ROLE db_view_def;   
    GRANT VIEW DEFINITION TO db_view_def;   
    ALTER ROLE db_view_def ADD MEMBER {user_name};   
    CREATE ROLE db_view_db_state;  

    GRANT VIEW DATABASE STATE TO db_view_db_state;   

    ALTER ROLE db_view_def ADD MEMBER {user_name};  
    ``` 

1. After entering the necessary details, proceed with Cluster creation on the portal.  
