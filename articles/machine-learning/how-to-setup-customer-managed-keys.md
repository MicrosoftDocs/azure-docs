

# Configure customer-managed keys for Azure Machine Learning

Azure Machine Learning relies on multiple Azure services for data storage. While Azure data storage services typically provide data encryption using a Microsoft-managed key, you may want to use your own key (customer-managed key, or CMK for short). Azure Machine Learning also relies on Azure Key Vault to securely store the information needed to access the Azure services that your data is stored in. 

To use your own keys to encrypt the data storage services used by Azure Machine Learning, use the following steps:

1. Create an Azure Key Vault
1. Create the data storage services you plan to use with Azure Machine Learning. When creating them, follow the guidance in the following articles to enable customer-managed keys for the service:

    * [Azure Storage](/azure/storage/common/customer-managed-keys-overview)
    * [Azure Data Lake Gen 1](/azure/data-lake-store/data-lake-store-encryption)
    * Azure Data lake Gen 2 is part of Azure Storage. Use the [Azure Storage](/azure/storage/common/customer-managed-keys-overview) information.
    * [Azure SQL Transparent Data Encryption](/azure/azure-sql/database/transparent-data-encryption-byok-overview)
    * [Azure Database for PostgreSQL](/azure/postgresql/concepts-data-encryption-postgresql)
    * [Azure Database for MySQL](/azure/mysql/concepts-data-encryption-mysql)

The following is a list of the services that Azure Machine Learning uses for data storage:

Azure Machine Learning stores metadata in an Azure Cosmos DB instance. By default, this instance is located in a __Microsoft managed__ Azure subscription. Data stored in this Cosmos DB instance is encrypted with a Microsoft-managed key.



## Prerequisites

## 