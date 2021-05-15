---
title: "How to access the digests stored in ACL"
description: How-to access the digests stored in ACL with Azure SQL Database ledger
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

# Overview

This article shows you how to access a SQL ledger digest or receipt that is stored in Azure Confidential Ledger to get end-to-end security and integrity guarantees. Through this document, we will explain how to access and verify integrity of the stored information.

## Prerequisites

* Python 2.7, 3.5.3, or later
* A running instance of Azure Confidential Ledger.

## How does the integration work?

SQL Server calculates the digests of the SQL Ledger database(s) periodically and stores them in Azure Confidential Ledger. At any time, a user can validate the integrity of the data by downloading the digests from Azure Confidential Ledger. The following steps will explain it.

## Step 1 - Find the Digest location

Using the SQL Server Management Studio, run the following query. The output shows the endpoint of the Azure Confidential Ledger instance where the digests are stored.
  ```sql
  SELECT * FROM sys.database_ledger_digest_locations WHERE is_current=1
  ```

## Step 2 - Determine the Subledgerid

Please replace instances of `"my-ledger-id"` in the example below with the appropriate Azure Confidential Ledger id.

We are interested in the value in the path column from the query output. It consists of two parts namely the host name and the subledgerid. As an example, in the Url `'https://my-ledger-id.confidential-ledger.azure.com/sqldbledgerdigests/testsvr/SqlLedgerDb637560098395096350/5_7_2021_6:46:58_PM'`, the host name is `'https://my-ledger-id.confidential-ledger.azure.com'` and the subledgerid is `'sqldbledgerdigests/testsvr/SqlLedgerDb637560098395096350/5_7_2021_6:46:58_PM'`. We will use it in Step 4 to download the digests.

## Step 3 - Obtain an AAD token.

The Azure Confidential Ledger API accepts either a client certificate or an Azure Active Directory (AAD) Bearer token as caller identity (Security Principal). This Security Principal needs to be whitelisted via ARM during Ledger Provisioning. The user who had enabled Ledger in SQL Server is automatically given the Administrator access to Confidential Ledger. To obtain a token, user first needs to authenticate using [Azure CLI](/cli/azure/install-azure-cli) with the same account that was used with Azure Portal. Once the user has authenticated, they can use DefaultAzureCredentials() to retrieve bearer token and call Confidential Ledger API.

```bash
az login
```

```python
from azure.identity import DefaultAzureCredential
credential = DefaultAzureCredential()
```

## Step 4 - Download the Digests from Azure Confidential Ledger

The following Python script downloads the digests from the Azure Confidential Ledger service.

```python
import requests
import time
#import logging
import urllib3
import json
from azure.confidentialledger.identity_service import ConfidentialLedgerIdentityServiceClient
from colorama import Fore, Back, Style

ledger_id = "my-ledger-id"
identity_server_url = "https://identity.confidential-ledger-ppe.core.azure.com"
sub_ledger_id = "sqldbledgerdigests/testsvr/SqlLedgerDb637560098395096350/5_7_2021_6:46:58_PM"
ledger_host_url = f"https://{ledger_id}.confidential-ledger-ppe.azure.com"
initial_path = f"/app/transactions?api-version=0.1-preview&subLedgerId={sub_ledger_id}"

identity_client = ConfidentialLedgerIdentityServiceClient(identity_server_url)
network_identity = identity_client.get_ledger_identity(
    ledger_id=f"{ledger_id}"
)

ledger_tls_cert_file_name = f"/tmp/{ledger_id}-rootCA.pem"
print(Fore.GREEN + f"[INFO]::Downloading the root certificate from {identity_server_url}\n")
with open(ledger_tls_cert_file_name, "w") as cert_file:
    cert_file.write(network_identity.ledger_tls_certificate)

print(Fore.GREEN + f"[INFO]::Obtaining an AAD token\n")

headers = {
'Authorization': 'Bearer ...',
'Content-Type': 'application/json'
}

urllib3.disable_warnings()

ledger_url = ledger_host_url + initial_path

print(Fore.GREEN + f"[INFO]::Calling the Azure Confidential Ledger server at {ledger_url}\n")

while(True):
    response = requests.request("GET", ledger_url, headers=headers, verify=ledger_tls_cert_file_name)
    response_json = json.loads(response.content)
    if(response_json["state"] == "Loading"):
        print(Fore.MAGENTA + "[WARNING]::Retrying as the server state is Loading.\n")
        time.sleep(0.100)
        continue

    digests = response_json["entries"]
    if(len(digests) != 0):
        print(Style.RESET_ALL)
        print(digests)
        print("\n")

    if("@nextLink" in response_json):
        ledger_url = ledger_host_url + response_json["@nextLink"]
        print(Fore.GREEN + f"[INFO]::Calling the Azure Confidential Ledger server at {ledger_url}\n")
    else:
        print(Fore.GREEN + "\n[INFO]::End of digests.")
        print(Style.RESET_ALL)
        break
```

## Step 5 - Download the Digests from the SQL Server

Using the SQL Server Management Studio, run the following query. The query returns the digests of the blocks from Genesis.
  ```sql
  SELECT * FROM sys.database_ledger_blocks
  ```
## Step 6 - Comparison

Compare the digest retrieved from the Azure Confidential Ledger to the digest returned from the SQL Server using the block_id as the key. For example, the digest of block_id 1 is the value of the previous_block_hash column in the block_id 2 row. Similarly, for block_id 3, it is the value of the previous_block_id column in the block_id 4 row. A mismatch in the hash value is an indicator of data being tampered.

## See also

- [Database ledger](ledger-database-ledger.md)
- [Digest management and database verification](ledger-digest-management-and-database-verification.md)
- [Append-only ledger tables](ledger-append-only-ledger-tables.md)