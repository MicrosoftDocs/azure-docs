---
title: "How to access the digests stored in Azure Confidential Ledger (ACL)"
description: How to access the digests stored in Azure Confidential Ledger (ACL) with Azure SQL Database ledger
ms.custom: ""
ms.date: "05/25/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: how-to
author: JasonMAnderson
ms.author: janders
---

# How to access the digests stored in ACL

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in **public preview**.

This article shows you how to access an [Azure SQL Database ledger](ledger-overview.md) digest stored in [Azure Confidential Ledger (ACL)](/azure/confidential-ledger/) to get end-to-end security and integrity guarantees. Through this article, we'll explain how to access and verify integrity of the stored information.

## Prerequisites

- Python 2.7, 3.5.3, or later
- Have an existing Azure SQL Database with ledger enabled. See [Quickstart: Create an Azure SQL Database with ledger enabled](ledger-create-a-single-database-with-ledger-enabled.md) if you haven't already created an Azure SQL Database.
- [Azure Confidential Ledger client library for Python](https://github.com/Azure/azure-sdk-for-python/blob/b42651ae4791aca8c9fbe282832b81badf798aa9/sdk/confidentialledger/azure-confidentialledger/README.md#create-a-client)
- A running instance of [Azure Confidential Ledger](/azure/confidential-ledger/).

## How does the integration work?

Azure SQL server calculates the digests of the [ledger database(s)](ledger-overview.md#ledger-database) periodically and stores them in Azure Confidential Ledger. At any time, a user can validate the integrity of the data by downloading the digests from Azure Confidential Ledger and comparing them to the digests stored in Azure SQL Database ledger. The following steps will explain it.

## Step 1 - Find the Digest location

> [!NOTE]
> The query will return more than one row if multiple Azure Confidential Ledger instances were used to store the digest. For each row, repeat steps 2 through 6 to download the digests from all instances of Azure Confidential Ledger.

Using the [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms), run the following query. The output shows the endpoint of the Azure Confidential Ledger instance where the digests are stored.

```sql
SELECT * FROM sys.database_ledger_digest_locations WHERE path like '%.confidential-ledger.azure.com%
```

## Step 2 - Determine the Subledgerid

We're interested in the value in the path column from the query output. It consists of two parts, namely the `host name` and the `subledgerid`. As an example, in the Url `https://contoso-ledger.confidential-ledger.azure.com/sqldbledgerdigests/ledgersvr2/ledgerdb/2021-04-13T21:20:51.0000000`, the `host name` is `https://contoso-ledger.confidential-ledger.azure.com` and the `subledgerid` is `sqldbledgerdigests/ledgersvr2/ledgerdb/2021-04-13T21:20:51.0000000`. We'll use it in Step 4 to download the digests.

## Step 3 - Obtain an Azure AD token

The Azure Confidential Ledger API accepts an Azure Active Directory (Azure AD) Bearer token as the caller identity. This identity needs access to ACL via Azure Resource Manager during provisioning. The user who had enabled ledger in SQL Database is automatically given administrator access to Azure Confidential Ledger. To obtain a token, the user needs to authenticate using [Azure CLI](/cli/azure/install-azure-cli) with the same account that was used with Azure portal. Once the user has authenticated, they can use [DefaultAzureCredentials()](/dotnet/api/azure.identity.defaultazurecredential) to retrieve a bearer token and call Azure Confidential Ledger API.

Log in to Azure AD using the identity with access to ACL.

```azure-cli
az login
```

Retrieve the Bearer token.

```python
from azure.identity import DefaultAzureCredential
credential = DefaultAzureCredential()
```

## Step 4 - Download the digests from Azure Confidential Ledger

The following Python script downloads the digests from Azure Confidential Ledger. The script uses the [Azure Confidential Ledger client library for Python.](https://github.com/Azure/azure-sdk-for-python/blob/b42651ae4791aca8c9fbe282832b81badf798aa9/sdk/confidentialledger/azure-confidentialledger/README.md#create-a-client)

```python
from azure.identity import DefaultAzureCredential
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

credential = DefaultAzureCredential()
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

## Step 5 - Download the Digests from the SQL Server

> [!NOTE]
> This is a way to confirm that the hashes stored in the Azure SQL Database ledger have not changed over time. For complete audit of the integrity of the Azure SQL Database ledger, see [How to verify a ledger table to detect tampering](ledger-verify-database.md).

Using [SSMS](/sql/ssms/download-sql-server-management-studio-ssms), run the following query. The query returns the digests of the blocks from Genesis.

```sql
SELECT * FROM sys.database_ledger_blocks
```

## Step 6 - Comparison

Compare the digest retrieved from the Azure Confidential Ledger to the digest returned from your SQL database using the `block_id` as the key. For example, the digest of `block_id` = `1` is the value of the `previous_block_hash` column in the `block_id`= `2` row. Similarly, for `block_id` = `3`, it's the value of the `previous_block_id` column in the `block_id` = `4` row. A mismatch in the hash value is an indicator of a potential data tampering.

If data tampering is suspected, see [How to verify a ledger table to detect tampering](ledger-verify-database.md) to perform a full audit of the Azure SQL Database ledger.

## Next steps

- [Azure SQL Database ledger Overview](ledger-overview.md)
- [Database ledger](ledger-database-ledger.md)
- [Digest management and database verification](ledger-digest-management-and-database-verification.md)
- [Append-only ledger tables](ledger-append-only-ledger-tables.md)
- [Updatable ledger tables](ledger-updatable-ledger-tables.md)
- [How to verify a ledger table to detect tampering](ledger-verify-database.md)