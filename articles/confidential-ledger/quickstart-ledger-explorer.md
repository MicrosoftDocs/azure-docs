---
title: Use Ledger Explorer to visually verify your transactions
description: Learn to use the Microsoft Azure confidential ledger through Azure portal
author: taicchoumsft
ms.author: tachou
ms.date: 11/08/2023
ms.service: confidential-ledger
ms.custom: 
ms.topic: how-to
---

# Quickstart: Upload, view and list ledger data with the Azure ledger explorer

In this quickstart, learn how to use the [Azure portal](https://portal.azure.com) to  The ledger explorer is a web-based tool that allows you to view and query the data stored on your Azure confidential ledger. You can use the ledger explorer to:

- Browse the transactions and entries on your ledger
- Verify the integrity and authenticity of your ledger data using cryptographic proofs

The ledger explorer is accessible through the Azure Portal for your confidential ledger resource. You need to have a Reader, Contributor or Administrator role assigned for the logged in user in the ledger to gain access to the ledger explorer.


## How to use the ledger explorer
To use the ledger explorer, follow these steps:

1) Open the Azure portal and log in as a user who has a Reader, Contributor or Administrator role assigned for the confidential ledger resource.
1) On the Overview page, navigate to the "Ledger explorer (preview)" tab
1) Once you are logged in, you can see the dashboard of the ledger explorer, which shows the summary of your ledger data, such as the number of transactions, the latest transaction ID, and the ledger status.

The ledger explorer allows you to see data such a

- Transaction data: A list of all transactions on your ledger with their IDs and contents. You can click on a transaction to see more details, such as the transaction ID, the transaction receipt, and the cryptographic proof.
- Search: This page allows you to search for transactions or entries by ID. You can use the filters and the search box to specify your query criteria. You can also sort the results by ID or timestamp.
-Export: This panel allows you to copy the contents of the transaction receipts and the cryptographic proofs to the clipboard

## How to verify your ledger data
One of the key features of Azure confidential ledger is that it provides cryptographic evidence that your ledger data has not been tampered with. You can use the ledger explorer to verify the integrity and authenticity of your ledger data using the following methods:

Transaction receipts: A transaction receipt is a JSON document that contains the metadata of a transaction, such as the transaction ID, the previous transaction ID, the timestamp, and the content hash. You can use the transaction receipt to verify that a transaction exists on your ledger and that it has not been modified.
Entry receipts: An entry receipt is a JSON document that contains the metadata of an entry, such as the entry ID, the transaction ID, the timestamp, and the content hash. You can use the entry receipt to verify that an entry exists on your ledger and that it has not been modified.
Cryptographic proofs: A cryptographic proof is a JSON document that contains the Merkle tree root hash of your ledger and the Merkle tree branch that leads to a specific transaction or entry. You can use the cryptographic proof to verify that a transaction or entry belongs to your ledger and that it has not been tampered with.
You can access the transaction receipts, the entry receipts, and the cryptographic proofs from the ledger explorer by clicking on the Receipt or Proof buttons on the transaction or entry details pages. You can also download them as JSON files.

To verify your ledger data, you need to use a verification tool that can validate the receipts and the proofs against your ledger. You can use the Azure confidential ledger client library for .NET1 to perform the verification programmatically, or you can use the Azure confidential ledger verification tool, which is a command-line tool that can verify your ledger data offline.