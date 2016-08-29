You are billed for Azure Storage usage based on your storage account. Storage costs are based on the following factors: region/location, account type, storage capacity, replication scheme, storage transactions, and data egress.

- Region refers to the geographical region in which your account is based.
- Account type refers to whether you are using a general-purpose storage account or a Blob storage account. With a Blob storage account, the access tier also determines the billing model for the account.
- Storage capacity refers to how much of your storage account allotment you are using to store data.
- Replication determines how many copies of your data are maintained at one time, and in what locations.
- Transactions refer to all read and write operations to Azure Storage.
- Data egress refers to data transferred out of an Azure region. When the data in your storage account is accessed by an application that is not running in the same region, you are charged for data egress. (For Azure services, you can take steps to group your data and services in the same data centers to reduce or eliminate data egress charges.)

The [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) page provides detailed pricing information based on account type, storage capacity, replication, and transactions. The [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/) provides detailed pricing information for data egress. You can use the [Azure Storage Pricing Calculator](https://azure.microsoft.com/pricing/calculator/?scenario=data-management) to help estimate your costs.
