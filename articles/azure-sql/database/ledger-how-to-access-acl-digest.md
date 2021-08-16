---
title: "Access the digests stored in Azure Confidential Ledger"
description: Access the digests stored in Azure Confidential Ledger with an Azure SQL Database ledger.
ms.custom: references_regions
ms.date: "07/23/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: how-to
author: JasonMAnderson
ms.author: janders
---

# Access the digests stored in Confidential Ledger

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in public preview and available in West Europe, Brazil South, and West Central US.

This article shows you how to access an [Azure SQL Database ledger](ledger-overview.md) digest stored in [Azure Confidential Ledger](../../confidential-ledger/index.yml) to get end-to-end security and integrity guarantees. Throughout this article, we'll explain how to access and verify integrity of the stored information.

## Prerequisites

- Python 2.7, 3.5.3, or later.
- Azure SQL Database with ledger enabled. If you haven't already created a database in SQL Database, see [Quickstart: Create a database in SQL Database with ledger enabled](ledger-create-a-single-database-with-ledger-enabled.md).
- [Azure Confidential Ledger client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/confidentialledger/azure-confidentialledger).
- A running instance of [Confidential Ledger](../../confidential-ledger/index.yml).

## How does the integration work?

Azure SQL Server calculates the digests of the [ledger databases](ledger-overview.md#ledger-database) periodically and stores them in Confidential Ledger. At any time, you can validate the integrity of the data. Download the digests from Confidential Ledger and compare them to the digests stored in a SQL Database ledger. The following steps explain the process.

## 1. Find the digest location

> [!NOTE]
> The query returns more than one row if multiple Confidential Ledger instances were used to store the digest. For each row, repeat steps 2 through 6 to download the digests from all instances of Confidential Ledger.

Use [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) to run the following query. The output shows the endpoint of the Confidential Ledger instance where the digests are stored.

```sql
SELECT * FROM sys.database_ledger_digest_locations WHERE path like '%.confidential-ledger.azure.com%'
```

## 2. Determine the subledgerid

We're interested in the value in the path column from the query output. It consists of two parts, namely, the `host name` and the `subledgerid`. As an example, in the URL `https://contoso-ledger.confidential-ledger.azure.com/sqldbledgerdigests/ledgersvr2/ledgerdb/2021-04-13T21:20:51.0000000`, the `host name` is `https://contoso-ledger.confidential-ledger.azure.com` and the `subledgerid` is `sqldbledgerdigests/ledgersvr2/ledgerdb/2021-04-13T21:20:51.0000000`. We'll use it in step 4 to download the digests.

## 3. Obtain an Azure AD token

The Confidential Ledger API accepts an Azure Active Directory (Azure AD) bearer token as the caller identity. This identity needs access to Confidential Ledger via Azure Resource Manager during provisioning. When you enable ledger in SQL Database, you're automatically given administrator access to Confidential Ledger. To obtain a token, you need to authenticate by using the [Azure CLI](/cli/azure/install-azure-cli) with the same account that was used with the Azure portal. After you've authenticated, you can use [AzureCliCredential](/python/api/azure-identity/azure.identity.azureclicredential) to retrieve a bearer token and call the Confidential Ledger API.

Sign in to Azure AD by using the identity with access to Confidential Ledger.

```azure-cli
az login
```

Retrieve the bearer token.

```python
from azure.identity import AzureCliCredential
credential = AzureCliCredential()
```

## 4. Download the digests from Confidential Ledger

The following Python script downloads the digests from Confidential Ledger. The script uses the [Confidential Ledger client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/confidentialledger/azure-confidentialledger).

```python
from azure.identity import AzureCliCredential
from azure.confidentialledger import ConfidentialLedgerClient
from azure.confidentialledger.identity_service import ConfidentialLedgerIdentityServiceClient

ledger_id = "contoso-ledger"
identity_server_url = "https://identity.confidential-ledger.core.azure.com"
sub_ledger_id = "sqldbledgerdigests/ledgersvr2/ledgerdb/2021-04-13T21:20:51.0000000"
ledger_host_url = f"https://{ledger_id}.confidential-ledger.azure.com"
initial_path = f"/app/transactions?api-version=0.1-preview&subLedgerId={sub_ledger_id}"

identity_client = ConfidentialLedgerIdentityServiceClient(identity_server_url)
network_identity = identity_client.get_ledger_identity(
    ledger_id=ledger_id
)

ledger_tls_cert_file_name = f"{ledger_id}_certificate.pem"
with open(ledger_tls_cert_file_name, "w") as cert_file:
    cert_file.write(network_identity.ledger_tls_certificate)

credential = AzureCliCredential()
ledger_client = ConfidentialLedgerClient(
    endpoint=ledger_host_url, 
    credential=credential,
    ledger_certificate_path=ledger_tls_cert_file_name
)

ranged_result = ledger_client.get_ledger_entries(
    sub_ledger_id=sub_ledger_id
)

entries = 0

for entry in ranged_result:
    entries += 1
    print(f"\nTransaction id {entry.transaction_id} contents: {entry.contents}")

if entries == 0:
    print("\n***No digests are found for the supplied SubledgerID.")
else:
    print("\n***No more digests were found for the supplied SubledgerID.")
```

## 5. Download the digests from the SQL server

> [!NOTE]
> This step is a way to confirm that the hashes stored in the SQL Database ledger haven't changed over time. For a complete audit of the integrity of the SQL Database ledger, see [Verify a ledger table to detect tampering](ledger-verify-database.md).

Use [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) to run the following query. The query returns the digests of the blocks from Genesis.

```sql
SELECT * FROM sys.database_ledger_blocks
```

## 6. Comparison

Compare the digest retrieved from Confidential Ledger to the digest returned from your database in SQL Database by using `block_id` as the key. For example, the digest of `block_id` = `1` is the value of the `previous_block_hash` column in the `block_id`= `2` row. Similarly, for `block_id` = `3`, it's the value of the `previous_block_id` column in the `block_id` = `4` row. A mismatch in the hash value is an indicator of potential data tampering.

If you suspect data tampering, see [Verify a ledger table to detect tampering](ledger-verify-database.md) to perform a full audit of the SQL Database ledger.

## Next steps

- [Azure SQL Database ledger overview](ledger-overview.md)
- [Database ledger](ledger-database-ledger.md)
- [Digest management and database verification](ledger-digest-management-and-database-verification.md)
- [Append-only ledger tables](ledger-append-only-ledger-tables.md)
- [Updatable ledger tables](ledger-updatable-ledger-tables.md)
- [Verify a ledger table to detect tampering](ledger-verify-database.md)
