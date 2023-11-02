---
title: Azure Confidential Ledger write transaction receipts
description: Azure Confidential Ledger write transaction receipts
author: andpiccione
ms.author: apiccione
ms.date: 11/07/2022
ms.service: confidential-ledger
ms.topic: overview

---

# Azure Confidential Ledger write transaction receipts

To enforce transaction integrity guarantees, an Azure Confidential Ledger uses a [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree) data structure to record the hash of all transactions blocks that are appended to the immutable ledger. After a write transaction is committed, Azure Confidential Ledger users can get a cryptographic Merkle proof, or receipt, over the entry produced in a Confidential Ledger to verify that the write operation was correctly saved. A write transaction receipt is proof that the system has committed the corresponding transaction and can be used to verify that the entry has been effectively appended to the ledger.

More details about how a Merkle Tree is used in a Confidential Ledger can be found in the [CCF documentation](https://microsoft.github.io/CCF/main/architecture/merkle_tree.html).

## Get write transaction receipts

### Setup and prerequisites

Azure Confidential Ledger users can get a receipt for a specific transaction by using the [Azure Confidential Ledger client library](quickstart-python.md#use-the-data-plane-client-library). The following example shows how to get a write receipt using the [client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/confidentialledger/azure-confidentialledger), but the steps are the same with any other supported SDK for Azure Confidential Ledger.

We assume that a Confidential Ledger resource has already been created using the Azure Confidential Ledger Management library. If you don't have an existing ledger resource yet, create one using the [following instructions](quickstart-python.md#use-the-control-plane-client-library).

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

The following are the constant values used to set up the Azure Confidential Ledger client. Make sure to update the `ledger_name` constant with the unique name of your Confidential Ledger resource.

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

Then, we get and save the Confidential Ledger service certificate using the Certificate client from the Confidential Ledger Identity URL. The service certificate is a network identity public key certificate used as root of trust for [TLS](https://microsoft.github.io/CCF/main/overview/glossary.html#term-TLS) server authentication. In other words, it's used as the Certificate Authority (CA) for establishing a TLS connection with any of the nodes in the CCF network.

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

Using the Confidential Ledger client, we can run any supported operations on an Azure Confidential Ledger instance. For example, we can append a new entry to the ledger and wait for corresponding write transaction to be committed.

```python
# The method begin_create_ledger_entry returns a poller that  
# we can use to wait for the transaction to be committed 
create_entry_poller = ledger_client.begin_create_ledger_entry( 
    {"contents": "Hello World!"} 
)

create_entry_result = create_entry_poller.result() 
```

After the transaction is committed, we can use the client to get a receipt over the entry appended to the ledger in the previous step using the respective [transaction ID](https://microsoft.github.io/CCF/main/overview/glossary.html#term-Transaction-ID).

```python
# The method begin_get_receipt returns a poller that  
# we can use to wait for the receipt to be available by the system 
get_receipt_poller = ledger_client.begin_get_receipt( 
    create_entry_result["transactionId"] 
)

get_receipt_result = get_receipt_poller.result() 
```

### Sample code

The full sample code used in the code walkthrough is provided.

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

Here's an example of a JSON response payload returned by an Azure Confidential Ledger instance when calling the `GET_RECEIPT` endpoint.

```json
{
    "receipt": {
        "cert": "-----BEGIN CERTIFICATE-----\nMIIB0jCCAXmgAwIBAgIQPxdrEtGY+SggPHETin1XNzAKBggqhkjOPQQDAjAWMRQw\nEgYDVQQDDAtDQ0YgTmV0d29yazAeFw0yMjA3MjAxMzUzMDFaFw0yMjEwMTgxMzUz\nMDBaMBMxETAPBgNVBAMMCENDRiBOb2RlMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcD\nQgAEWy81dFeEZ79gVJnfHiPKjZ54fZvDcFlntFwJN8Wf6RZa3PaV5EzwAKHNfojj\noXT4xNkJjURBN7q+1iE/vvc+rqOBqzCBqDAJBgNVHRMEAjAAMB0GA1UdDgQWBBQS\nwl7Hx2VkkznJNkVZUbZy+TOR/jAfBgNVHSMEGDAWgBTrz538MGI/SdV8k8EiJl5z\nfl3mBTBbBgNVHREEVDBShwQK8EBegjNhcGljY2lvbmUtdGVzdC1sZWRnZXIuY29u\nZmlkZW50aWFsLWxlZGdlci5henVyZS5jb22CFWFwaWNjaW9uZS10ZXN0LWxlZGdl\ncjAKBggqhkjOPQQDAgNHADBEAiAsGawDcYcH/KzF2iK9Ldx/yABUoYSNti2Cyxum\n9RRNKAIgPB/XGh/FQS3nmZLExgBVXkDYdghQu/NCY/hHjQ9AvWg=\n-----END CERTIFICATE-----\n",
        "leafComponents": {
            "claimsDigest": "0000000000000000000000000000000000000000000000000000000000000000",
            "commitEvidence": "ce:2.40:f36ffe2930ec95d50ebaaec26e2bec56835abd051019eb270f538ab0744712a4",
            "writeSetDigest": "8452624d10bdd79c408c0f062a1917aa96711ea062c508c745469636ae1460be"
        },
        "nodeId": "70e995887e3e6b73c80bc44f9fbb6e66b9f644acaddbc9c0483cfc17d77af24f",
        "proof": [
            {
                "left": "b78230f9abb27b9b803a9cae4e4cec647a3be1000fc2241038867792d59d4bc1"
            },
            {
                "left": "a2835d4505b8b6b25a0c06a9c8e96a5204533ceac1edf2b3e0e4dece78fbaf35"
            }
        ],
        "signature": "MEUCIQCjtMqk7wOtUTgqlHlCfWRqAco+38roVdUcRv7a1G6pBwIgWKpCSdBmhzgEdwguUW/Cj/Z5bAOA8YHSoLe8KzrlqK8="
    },
    "state": "Ready",
    "transactionId": "2.40"
}
```

The JSON response contains the following fields at the root level.

* **receipt**: It contains the values that can be used to verify the validity of the receipt for the corresponding write transaction.

* **state**: The status of the returned JSON response. The following are the possible values allowed:
  
  * `Ready`: The receipt returned in the response is available
  * `Loading`: The receipt isn't yet available to be retrieved and the request have to be retried

* **transactionId**: The transaction ID associated with the write transaction receipt.

The `receipt` field contains the following fields.

* **cert**: String with the [PEM](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail) public key certificate of the CCF node that signed the write transaction. The service identity certificate should always endorse the certificate of the signing node. See also more details about how transactions get regularly signed and how the signature transactions are appended to the ledger in CCF at the following [link](https://microsoft.github.io/CCF/main/architecture/merkle_tree.html).

* **nodeId**: Hexadecimal string representing the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash digest of the public key of the signing CCF node.

* **leafComponents**: The components of the leaf node hash in the [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree) that are associated to the specified transaction. A Merkle Tree is a tree data structure that records the hash of every transaction and guarantees the integrity of the ledger. For more information on how a Merkle Tree is used in CCF, see the related [CCF documentation](https://microsoft.github.io/CCF/main/architecture/merkle_tree.html).

* **proof**: List of key-value pairs representing the Merkle Tree nodes hashes that, when combined with the leaf node hash corresponding to the given transaction, allow the recomputation of the root hash of the tree. Thanks to the properties of a Merkle Tree, it's possible to recompute the root hash of the tree only a subset of nodes. The elements in this list are in the form of key-value pairs: keys indicate the relative position with respect to the parent node in the tree at a certain level; values are the SHA-256 hash digests of the node given, as hexadecimal strings.

* **serviceEndorsements**: List of PEM-encoded certificates strings representing previous service identities certificates. It's possible that the service identity that endorsed the signing node isn't the same as the one that issued the receipt. For example, the service certificate is renewed after a disaster recovery of a Confidential Ledger. The list of past service certificates allows auditors to build the chain of trust from the CCF signing node to the current service certificate.

* **signature**: Base64 string representing the signature of the root of the Merkle Tree at the given transaction, by the signing CCF node.

The `leafComponents` field contains the following fields.

* **claimsDigest**: Hexadecimal string representing the SHA-256 hash digest of the [application claim](https://microsoft.github.io/CCF/main/use_apps/verify_tx.html#application-claims) attached by the Confidential Ledger application at the time the transaction was executed. Application claims are currently unsupported as the Confidential Ledger application doesn't attach any claim when executing a write transaction.

* **commitEvidence**: A unique string produced per transaction, derived from the transaction ID and the ledger secrets. For more information about the commit evidence, see the related [CCF documentation](https://microsoft.github.io/CCF/main/use_apps/verify_tx.html#commit-evidence).

* **writeSetDigest**: Hexadecimal string representing the SHA-256 hash digest of the [Key-Value store](https://microsoft.github.io/CCF/main/build_apps/kv/index.html), which contains all the keys and values written at the time the transaction was completed. For more information about the write set, see the related [CCF documentation](https://microsoft.github.io/CCF/main/overview/glossary.html#term-Write-Set).

## Application claims
Azure Confidential Ledger applications can attach arbitrary data, called [application claims](https://microsoft.github.io/CCF/main/use_apps/verify_tx.html#application-claims), to write transactions. These claims represent the actions executed during a write operation. When attached to a transaction, the SHA-256 digest of the claims object is included in the ledger and committed as part of the write transaction. The inclusion of the claim in the write transaction guarantees that the claim digest is signed in place and can't be tampered with.

Later, application claims can be revealed in their plain format in the receipt payload corresponding to the same transaction where they were added. The exposed claims allow users to recompute the same claims digest that was attached and signed in place by the ledger during the transaction. The claims digest can be used as part of the write transaction receipt verification process, providing an offline way for users to fully verify the authenticity of the recorded claims.

Application claims are currently supported in the preview API version `2023-01-18-preview`.

### Write transaction receipt content with application claims 

Here's an example of a JSON response payload returned by an Azure Confidential Ledger instance that recorded application claims, when calling the `GET_RECEIPT` endpoint.

```json
{
  "applicationClaims": [
    {
      "kind": "LedgerEntry",
      "ledgerEntry": {
        "collectionId": "subledger:0",
        "contents": "Hello world",
        "protocol": "LedgerEntryV1",
        "secretKey": "Jde/VvaIfyrjQ/B19P+UJCBwmcrgN7sERStoyHnYO0M="
      }
    }
  ],
  "receipt": {
    "cert": "-----BEGIN CERTIFICATE-----\nMIIBxTCCAUygAwIBAgIRAMR89lUNeIghDUfpyHi3QzIwCgYIKoZIzj0EAwMwFjEU\nMBIGA1UEAwwLQ0NGIE5ldHdvcmswHhcNMjMwNDI1MTgxNDE5WhcNMjMwNzI0MTgx\nNDE4WjATMREwDwYDVQQDDAhDQ0YgTm9kZTB2MBAGByqGSM49AgEGBSuBBAAiA2IA\nBB1DiBUBr9/qapmvAIPm1o3o3LRViSOkfFVI4oPrw3SodLlousHrLz+HIe+BqHoj\n4nBjt0KAS2C0Av6Q+Xg5Po6GCu99GQSoSfajGqmjy3j3bwjsGJi5wHh1pNbPmMm/\nTqNhMF8wDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUCPaDohOGjVgQ2Lb8Pmubg7Y5\nDJAwHwYDVR0jBBgwFoAU25KejcEmXDNnKvSLUwW/CQZIVq4wDwYDVR0RBAgwBocE\nfwAAATAKBggqhkjOPQQDAwNnADBkAjA8Ci9myzieoLoIy+7mUswVEjUG3wrEXtxA\nDRmt2PK9bTDo2m3aJ4nCQJtCWQRUlN0CMCMOsXL4NnfsSxaG5CwAVkDwLBUPv7Zy\nLfSh2oZ3Wn4FTxL0UfnJeFOz/CkDUtJI1A==\n-----END CERTIFICATE-----\n",
    "leafComponents": {
      "claimsDigest": "d08d8764437d09b2d4d07d52293cddaf40f44a3ea2176a0528819a80002df9f6",
      "commitEvidence": "ce:2.13:850a25da46643fa41392750b6ca03c7c7d117c27ae14e3322873de6322aa7cd3",
      "writeSetDigest": "6637eddb8741ab54cc8a44725be67fd9be390e605f0537e5a278703860ace035"
    },
    "nodeId": "0db9a22e9301d1167a2a81596fa234642ad24bc742451a415b8d653af056795c",
    "proof": [
      {
        "left": "bcce25aa51854bd15257cfb0c81edc568a5a5fa3b81e7106c125649db93ff599"
      },
      {
        "left": "cc82daa27e76b7525a1f37ed7379bb80f6aab99f2b36e2e06c750dd9393cd51b"
      },
      {
        "left": "c53a15cbcc97e30ce748c0f44516ac3440e3e9cc19db0852f3aa3a3d5554dfae"
      }
    ],
    "signature": "MGYCMQClZXVAFn+vflIIikwMz64YZGoH71DKnfMr3LXkQ0lhljSsvDrmtmi/oWwOsqy28PsCMQCMe4n9aXXK4R+vY0SIfRWSCCfaADD6teclFCkVNK4317ep+5ENM/5T/vDJf3V4IvI="
  },
  "state": "Ready",
  "transactionId": "2.13"
}
```

Compared to the receipt example shown in the previous section, the JSON response contains another `applicationClaims` field that represents the list of application claims recorded by the ledger during the write transaction. Each object inside the `applicationClaims` list contains the following fields.

* **kind**: It represents the kind of the application claim. The value indicates how to parse the application claim object for the provided type.

* **ledgerEntry**: It represents an application claim derived from ledger entry data. The claim would contain the data recorded by the application during a write transaction (for example, the collection ID and the contents provided by the user) and the required information to compute the digest corresponding to the single claim object.

* **digest**: It represents an application claim in digested form. This claim object would contain the precomputed digest by the application and the protocol used for the computation.    

The `ledgerEntry` field contains the following fields.

* **protocol**: It represents the protocol to be used to compute the digest of a claim from the given claim data.

* **collectionId**: The identifier of the collection written during the corresponding write transaction.

* **contents**: The contents of the ledger written during the corresponding write transaction.

* **secretKey**: A base64-encoded secret key. This key is to be used in the HMAC algorithm with the values provided in the application claim to obtain the claim digest. 

The `digest` field contains the following fields.

* **protocol**: It represents the protocol used to compute the digest of the given claim.

* **value**: The digest of the application claim, in hexadecimal form. This value would have to be hashed with the `protocol` value to compute the complete digest of the application claim.

### More resources

For more information about write transaction receipts and how CCF ensures the integrity of each transaction, see the following links:

* [Write Receipts](https://microsoft.github.io/CCF/main/use_apps/verify_tx.html#write-receipts)
* [Receipts](https://microsoft.github.io/CCF/main/audit/receipts.html)
* [CCF Glossary](https://microsoft.github.io/CCF/main/overview/glossary.html)
* [Merkle Tree](https://microsoft.github.io/CCF/main/architecture/merkle_tree.html)
* [Cryptography](https://microsoft.github.io/CCF/main/architecture/cryptography.html)
* [Certificates](https://microsoft.github.io/CCF/main/operations/certificates.html)
* [Application Claims](https://microsoft.github.io/CCF/main/use_apps/verify_tx.html#application-claims)
* [User-Defined Claims in Receipts](https://microsoft.github.io/CCF/main/build_apps/example_cpp.html#user-defined-claims-in-receipts)

## Next steps

* [Verify Azure Confidential Ledger write transaction receipts](verify-write-transaction-receipts.md)
* [Overview of Microsoft Azure confidential ledger](overview.md)
* [Azure confidential ledger architecture](architecture.md)
