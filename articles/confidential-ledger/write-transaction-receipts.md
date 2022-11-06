---
title: Azure Confidential Ledger write transaction receipts
description: Azure Confidential Ledger write transaction receipts
author: apiccione
ms.author: apiccione
ms.date: 11/07/2022
ms.service: confidential-ledger
ms.topic: overview

---

# Azure Confidential Ledger write transaction receipts

To enforce transaction integrity guarantees, an Azure Confidential Ledger uses a [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree) data structure to record the hash of all transactions blocks that are appended to the ledger. After executing a write transaction, Azure Confidential Ledger users can get a cryptographic Merkle proof, or receipt, over the entry produced in a Confidential Ledger to verify that the write operation was correctly saved. A write transaction receipt is proof that the system has committed the corresponding transaction and can be used to verify that the entry has been effectively appended to the ledger.

More details about how a Merkle Tree is used in a Confidential Ledger can be found in the [CCF documentation](https://microsoft.github.io/CCF/main/architecture/merkle_tree.html). 

## Get write transaction receipts

### Setup and pre-requisites

Azure Confidential Ledger users can get a receipt for a specific transaction by using the [Azure Confidential Ledger client library](https://learn.microsoft.com/azure/confidential-ledger/quickstart-python?tabs=azure-cli#use-the-data-plane-client-library). The following example shows how to get a write receipt using the [client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/confidentialledger/azure-confidentialledger), but the steps are the same with any other supported SDK for Azure Confidential Ledger. 

We assume that we have already created a Confidential Ledger resource using the Azure Confidential Ledger Management library. If you do not have an existing ledger resource yet, please create one using the [following instructions](https://docs.microsoft.com/azure/confidential-ledger/quickstart-python?tabs=azure-cli#use-the-control-plane-client-library). 

### Code walkthrough 

We start by setting up the imports for our Python program.

```python
import json 

# Import the Azure authentication library 
from azure.identity import DefaultAzureCredential 

# Import the Confidential Ledger Data Plane SDK 
from azure.confidentialledger import ConfidentialLedgerClient 
from azure.confidentialledger.certificate import ConfidentialLedgerCertificateClient 
```

The following are the constants we are going to use to set up the Azure Confidential Ledger client. Please make sure to update the `ledger_name` constant with the name unique name of your Confidential Ledger resource. 

```python
# Constants for our program 
ledger_name = "<your-unique-ledger-name>" 
identity_url = "https://identity.confidential-ledger.core.azure.com" 
ledger_url = "https://" + ledger_name + ".confidential-ledger.azure.com" 
```

We authenticate using the [DefaultAzureCredential class](/python/api/azure-identity/azure.identity.defaultazurecredential).

```python
# Setup authentication 
credential = DefaultAzureCredential() 
```

Then, we get and save the Confidential Ledger service certificate using the Certificate client from the [Confidential Ledger Identity URL](https://identity.confidential-ledger.core.azure.com/ledgerIdentity). The service certificate is a network identity public key certificate used as root of trust for [TLS](https://microsoft.github.io/CCF/main/overview/glossary.html#term-TLS) server authentication. In other words, it is used as the Certificate Authority (CA) for establishing a TLS connection with any of the nodes in the CCF network.

```python
# Create a Certificate client and use it to 
# get the service identity for our ledger 
identity_client = ConfidentialLedgerCertificateClient(identity_url) 
network_identity = identity_client.get_ledger_identity( 
     ledger_id=ledger_name 
)

# Save network certificate into a file for later use 
ledger_tls_cert_file_name = "network_certificate.pem" 

with open(ledger_tls_cert_file_name, "w") as cert_file: 
    cert_file.write(network_identity["ledgerTlsCertificate"]) 
```

Next, we can use our credentials, the fetched network certificate, and our unique ledger URL to create a Confidential Ledger client. 

```python
# Create Confidential Ledger client 
ledger_client = ConfidentialLedgerClient( 
     endpoint=ledger_url,  
     credential=credential, 
     ledger_certificate_path=ledger_tls_cert_file_name 
) 
```

Using the Confidential Ledger client, we can run any supported operations on an Azure COnfidential Ledger instance. For example, we can append a new entry to the ledger and wait for corresponding write transaction to be committed. 

 ```python
# The method begin_create_ledger_entry returns a poller that  
# we can use to wait for the transaction to be committed 
create_entry_poller = ledger_client.begin_create_ledger_entry( 
    {"contents": "Hello World!"} 
)

create_entry_result = create_entry_poller.result() 
```

Now that we have a committed transaction, we can use the client to get a receipt over the entry appended to the ledger in the previous step using the [transaction ID](https://microsoft.github.io/CCF/main/overview/glossary.html#term-Transaction-ID) of the committed transaction.

```python 
# The method begin_get_receipt returns a poller that  
# we can use to wait for the receipt to be available by the system 
get_receipt_poller = ledger_client.begin_get_receipt( 
    create_entry_result["transactionId"] 
)

get_receipt_result = get_receipt_poller.result() 
```

### Sample code

The full sample code used in the code walkthrough can be found below.

```python
import json 

# Import the Azure authentication library 
from azure.identity import DefaultAzureCredential 

# Import the Confidential Ledger Data Plane SDK 
from azure.confidentialledger import ConfidentialLedgerClient 
from azure.confidentialledger.certificate import ConfidentialLedgerCertificateClient 

from receipt_verification import verify_receipt 

# Constants 
ledger_name = "<your-unique-ledger-name>" 
identity_url = "https://identity.confidential-ledger.core.azure.com" 
ledger_url = "https://" + ledger_name + ".confidential-ledger.azure.com" 

# Setup authentication 
credential = DefaultAzureCredential() 

# Create Ledger Certificate client and use it to 
# retrieve the service identity for our ledger 
identity_client = ConfidentialLedgerCertificateClient(identity_url) 
network_identity = identity_client.get_ledger_identity(ledger_id=ledger_name) 

# Save network certificate into a file for later use 
ledger_tls_cert_file_name = "network_certificate.pem" 

with open(ledger_tls_cert_file_name, "w") as cert_file: 
    cert_file.write(network_identity["ledgerTlsCertificate"]) 

# Create Confidential Ledger client 
ledger_client = ConfidentialLedgerClient( 
    endpoint=ledger_url, 
    credential=credential, 
    ledger_certificate_path=ledger_tls_cert_file_name, 
) 

# The method begin_create_ledger_entry returns a poller that 
# we can use to wait for the transaction to be committed 
create_entry_poller = ledger_client.begin_create_ledger_entry( 
    {"contents": "Hello World!"} 
) 
create_entry_result = create_entry_poller.result() 

# The method begin_get_receipt returns a poller that 
# we can use to wait for the receipt to be available by the system 
get_receipt_poller = ledger_client.begin_get_receipt( 
    create_entry_result["transactionId"] 
) 
get_receipt_result = get_receipt_poller.result() 

# Save fetched receipt into a file
with open("receipt.json", "w") as receipt_file: 
    receipt_file.write(json.dumps(get_receipt_result, sort_keys=True, indent=2)) 
```

## Write transaction receipt content

Here is an example of a JSON response payload returned by an Azure Confdential Ledger instance when calling the `GET_RECEIPT` endpoint.

```json
{
    "receipt": {
        "cert": "-----BEGIN CERTIFICATE-----\nMIIB0jCCAXmgAwIBAgIQPxdrEtGY+SggPHETin1XNzAKBggqhkjOPQQDAjAWMRQw\nEgYDVQQDDAtDQ0YgTmV0d29yazAeFw0yMjA3MjAxMzUzMDFaFw0yMjEwMTgxMzUz\nMDBaMBMxETAPBgNVBAMMCENDRiBOb2RlMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcD\nQgAEWy81dFeEZ79gVJnfHiPKjZ54fZvDcFlntFwJN8Wf6RZa3PaV5EzwAKHNfojj\noXT4xNkJjURBN7q+1iE/vvc+rqOBqzCBqDAJBgNVHRMEAjAAMB0GA1UdDgQWBBQS\nwl7Hx2VkkznJNkVZUbZy+TOR/jAfBgNVHSMEGDAWgBTrz538MGI/SdV8k8EiJl5z\nfl3mBTBbBgNVHREEVDBShwQK8EBegjNhcGljY2lvbmUtdGVzdC1sZWRnZXIuY29u\nZmlkZW50aWFsLWxlZGdlci5henVyZS5jb22CFWFwaWNjaW9uZS10ZXN0LWxlZGdl\ncjAKBggqhkjOPQQDAgNHADBEAiAsGawDcYcH/KzF2iK9Ldx/yABUoYSNti2Cyxum\n9RRNKAIgPB/XGh/FQS3nmZLExgBVXkDYdghQu/NCY/hHjQ9AvWg=\n-----END CERTIFICATE-----\n",
        "is_signature_transaction": false,
        "leaf_components": {
            "claims_digest": "0000000000000000000000000000000000000000000000000000000000000000",
            "commit_evidence": "ce:2.40:f36ffe2930ec95d50ebaaec26e2bec56835abd051019eb270f538ab0744712a4",
            "write_set_digest": "8452624d10bdd79c408c0f062a1917aa96711ea062c508c745469636ae1460be"
        },
        "node_id": "70e995887e3e6b73c80bc44f9fbb6e66b9f644acaddbc9c0483cfc17d77af24f",
        "proof": [
            {
                "left": "b78230f9abb27b9b803a9cae4e4cec647a3be1000fc2241038867792d59d4bc1"
            },
            {
                "left": "a2835d4505b8b6b25a0c06a9c8e96a5204533ceac1edf2b3e0e4dece78fbaf35"
            }
        ],
        "service_endorsements": [],
        "signature": "MEUCIQCjtMqk7wOtUTgqlHlCfWRqAco+38roVdUcRv7a1G6pBwIgWKpCSdBmhzgEdwguUW/Cj/Z5bAOA8YHSoLe8KzrlqK8="
    },
    "state": "Ready",
    "transactionId": "2.40"
}
```

The JSON response contains the following fields at the root level.

- **receipt**: It contains the values that can be used to verify the validiy of the receipt for the corresponding write transaction.

- **state**: The status of the returned JSON response. Possible values are the following:
    - `Ready`: The receipt returned in the response is available
    - `Loading`: The receipt is not yet available to be retrieved and the request will have to be re-tried

- **transactionId**: The transaction ID associated with the write transaction receipt.

The `receipt` field contains the following fields.

- **cert**: String with the [PEM](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail) public key certificate of the CCF node that signed the write transaction. The certificate of the signing node should always be endorsed by the service identity certificate. See also more details about how transactions get regularly signed and how the signature transactions are appended to the ledger in CCF at the following [link](https://microsoft.github.io/CCF/main/architecture/merkle_tree.html).        
- **is_signature_transaction**: Value indicating whether the receipt is related to a signature transaction or not. Receipts for signature transactions cannot be retrieved for Confidential Ledgers. 
- **node_id**: Hexadecimal string representing the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash digest of the public key of the signing CCF node. 
- **leaf_components**: The components of the leaf node hash in the [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree) that are associated to the specified transaction. A Merkle Tree is a tree data structure that records the hash of every transaction and guarantees the integrity of the ledger (see how a Merkle Tree is used in CCF [here](https://microsoft.github.io/CCF/main/architecture/merkle_tree.html)).
- **proof**: List of key-value pairs representing the Merkle Tree nodes hashes that, when combined with the leaf node hash corresponding to the given transaction, allow the re-computation of the root hash of the tree. Thanks to the properties of a Merkle Tree, it is possible to re-compute the root hash of the tree only a subset of nodes. The elements in this list are in the form of key-value pairs, where the key indicates the relative position with respect to the parent node in the tree and the value is the the SHA-256 hash digest digest of the node given, as an hexadecimal string.
- **service_endorsements**: List of PEM-encoded certificates strings representing previous service identities certificated. If the service identity is renewed, it is possible that the service identity that endorsed the signing node is not the same as the one that issued the receipt. The list of past service certificates allows to build the chain of trust from the CCF signing node to the current service certificate.   
- **signature**: Base64 string representing the signature of the root of the Merkle Tree at the given transaction, by the signing CCF node.

The `leaf_components` field contains the following fields.

- **claims_digest**: Hexadecimal string representing the the SHA-256 hash digest of the [application claim](https://microsoft.github.io/CCF/main/use_apps/verify_tx.html#application-claims) attached by the Confidential Ledger application at the time the transaction was executed. Application claims are currently unsupported as the Confidential Ledger application does not attach any claim when executing a write transaction.
- **commit_evidence**: A unique string produced per transaction, derived from the transaction ID and the ledger secrets. Please refer to the CCF documentation for more information about the [Commit Evidence](https://microsoft.github.io/CCF/main/use_apps/verify_tx.html#commit-evidence). 
- **write_set_digest**: Hexadecimal string representing the the SHA-256 hash digest of the [Key-Value store](https://microsoft.github.io/CCF/main/build_apps/kv/index.html), which contains all the keys and values written at the time the transaction was completed. Please refer to the CCF documentation for more information about the [Write Set](https://microsoft.github.io/CCF/main/overview/glossary.html#term-Write-Set).


### Additional resources

Please refer to the following [CCF documentation](https://microsoft.github.io/CCF/main/) links for more information about transaction receipts and how CCF ensures the integrity of each transaction:

* [Write Receipts](https://microsoft.github.io/CCF/main/use_apps/verify_tx.html#write-receipts)
* [Receipts](https://microsoft.github.io/CCF/main/audit/receipts.html)
* [CCF Glossary](https://microsoft.github.io/CCF/main/overview/glossary.html)
* [Merkle Tree](https://microsoft.github.io/CCF/main/architecture/merkle_tree.html)
* [Cryptography](https://microsoft.github.io/CCF/main/architecture/cryptography.html)
* [Certificates](https://microsoft.github.io/CCF/main/operations/certificates.html)

## Next steps

- [Overview of Microsoft Azure confidential ledger](overview.md)
- [Azure confidential ledger architecture](architecture.md)
