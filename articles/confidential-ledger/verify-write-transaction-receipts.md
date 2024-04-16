---
title: Verify Azure Confidential Ledger write transaction receipts
description: Verify Azure Confidential Ledger write transaction receipts
author: andpiccione
ms.author: apiccione
ms.date: 11/07/2022
ms.service: confidential-ledger
ms.topic: how-to

---

# Verify Azure Confidential Ledger write transaction receipts

An Azure Confidential Ledger write transaction receipt represents a cryptographic Merkle proof that the corresponding write transaction has been globally committed by the CCF network. Azure Confidential Ledger users can get a receipt over a committed write transaction at any point in time to verify that the corresponding write operation was successfully recorded into the immutable ledger.

For more information about Azure Confidential Ledger write transaction receipts, see the [dedicated article](write-transaction-receipts.md).

## Receipt verification steps

A write transaction receipt can be verified following a specific set of steps outlined in the following subsections. The same steps are outlined in the [CCF Documentation](https://microsoft.github.io/CCF/main/use_apps/verify_tx.html#receipt-verification).

### Leaf node computation

The first step is to compute the SHA-256 hash of the leaf node in the Merkle Tree corresponding to the committed transaction. A leaf node is composed of the ordered concatenation of the following fields that can be found in an Azure Confidential Ledger receipt, under `leafComponents`:

1. `writeSetDigest`
2. SHA-256 digest of `commitEvidence`
3. `claimsDigest` fields

These values need to be concatenated as arrays of bytes: both `writeSetDigest` and `claimsDigest` would need to be converted from strings of hexadecimal digits to arrays of bytes; on the other hand, the hash of `commitEvidence` (as an array of bytes) can be obtained by applying the SHA-256 hash function over the UTF-8 encoded `commitEvidence` string.

Similarly, the leaf node hash digest can be computed by applying the SHA-256 hash function over the result concatenation of the resulting bytes.

### Root node computation

The second step is to compute the SHA-256 hash of the root of the Merkle Tree at the time the transaction was committed. The computation is done by iteratively concatenating and hashing the result of the previous iteration (starting from the leaf node hash computed in the previous step) with the ordered nodes' hashes provided in the `proof` field of a receipt. The `proof` list is provided as an ordered list and its elements need to be iterated in the given order.

The concatenation needs to be done on the bytes representation with respect to the relative order indicated in the objects provided in the `proof` field (either `left` or `right`).

* If the key of the current element in `proof` is `left`, then the result of the previous iteration should be appended to the current element value.
* If the key of the current element in `proof` is `right`, then the result of the previous iteration should be prepended to the current element value.

After each concatenation, the SHA-256 function needs to be applied in order to obtain the input for the next iteration. This process follows the standard steps to compute the root node of a [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree) data structure given the required nodes for the computation.

### Verify signature over root node

The third step is to verify that the cryptographic signature produced over the root node hash is valid using the signing node certificate in the receipt. The verification process follows the standard steps for digital signature verification for messages signed using the [Elliptic Curve Digital Signature Algorithm (ECDSA)](https://wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm). More specifically, the steps are:

1. Decode the base64 string `signature` into an array of bytes.
2. Extract the ECDSA public key from the signing node certificate `cert`.
3. Verify that the signature over the root of the Merkle Tree (computed using the instructions in the previous subsection) is authentic using the extracted public key from the previous step. This step effectively corresponds to a standard [digital signature](https://wikipedia.org/wiki/Digital_signature) verification process using ECDSA. There are many libraries in the most popular programming languages that allow verifying an ECDSA signature using a public key certificate over some data (for example, the [cryptography library](https://cryptography.io/en/latest/) for Python).

### Verify signing node certificate endorsement

In addition to the previous step, it's also required to verify that the signing node certificate is endorsed (that is, signed) by the current ledger certificate. This step doesn't depend on the other three previous steps and can be carried out independently from the others.

It's possible that the current service identity that issued the receipt is different from the one that endorsed the signing node (for example, due to a certificate renewal). In this case, it's required to verify the chain of certificates trust from the signing node certificate (that is, the `cert` field in the receipt) up to the trusted root Certificate Authority (CA) (that is, the current service identity certificate) through other previous service identities (that is, the `serviceEndorsements` list field in the receipt). The `serviceEndorsements` list is provided as an ordered list from the oldest to the latest service identity.

Certificate endorsement need to be verified for the entire chain and follows the exact same digital signature verification process outlined in the previous subsection. There are popular open-source cryptographic libraries (for example, [OpenSSL](https://www.openssl.org/)) that can be typically used to carry out a certificate endorsement step.

### Verify application claims digest

As an optional step, in case application claims are attached to a receipt, it's possible to compute the claims digest from the exposed claims (following a specific algorithm) and verify that the digest matches the `claimsDigest` contained in the receipt payload. To compute the digest from the exposed claim objects, it's required to iterate through each application claim object in the list and checks its `kind` field. 

If the claim object is of kind `LedgerEntry`, the ledger collection ID (`collectionId`) and contents (`contents`) of the claim should be extracted and used to compute their HMAC digests using the secret key (`secretKey`) specified in the claim object. These two digests are then concatenated and the SHA-256 hash of the concatenation is computed. The protocol (`protocol`) and the resulting claim data digest are then concatenated and another SHA-256 hash of the concatenation is computed to get the final digest. 

If the claim object is of kind `ClaimDigest`, the claim digest (`value`) should be extracted, concatenated with the protocol (`protocol`), and the SHA-256 hash of the concatenation is computed to get the final digest.

After computing each single claim digest, it's necessary to concatenate all the computed digests from each application claim object (in the same order they're presented in the receipt). The concatenation should then be prepended with the number of claims processed. The SHA-256 hash of the previous concatenation produces the final claims digest, which should match the `claimsDigest` present in the receipt object.

### More resources

For more information about the content of an Azure Confidential Ledger write transaction receipt and explanation of each field, see the [dedicated article](write-transaction-receipts.md#write-transaction-receipt-content). The [CCF documentation](https://microsoft.github.io/CCF) also contains more information about receipt verification and other related resources at the following links:

* [Receipt Verification](https://microsoft.github.io/CCF/main/use_apps/verify_tx.html#receipt-verification)
* [CCF Glossary](https://microsoft.github.io/CCF/main/overview/glossary.html)
* [Merkle Tree](https://microsoft.github.io/CCF/main/architecture/merkle_tree.html)
* [Cryptography](https://microsoft.github.io/CCF/main/architecture/cryptography.html)
* [Certificates](https://microsoft.github.io/CCF/main/operations/certificates.html)
* [Application Claims](https://microsoft.github.io/CCF/main/use_apps/verify_tx.html#application-claims)
* [User-Defined Claims in Receipts](https://microsoft.github.io/CCF/main/build_apps/example_cpp.html#user-defined-claims-in-receipts)

## Verify write transaction receipts

### Receipt verification utilities

The [Azure Confidential Ledger client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/confidentialledger/azure-confidentialledger) provides utility functions to verify write transaction receipts and compute the claims digest from a list of application claims. For more information on how to use the Data Plane SDK and the receipt-specific utilities, see [this section](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/confidentialledger/azure-confidentialledger#verify-write-transaction-receipts) and [this sample code](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/confidentialledger/azure-confidentialledger/samples/get_and_verify_receipt.py).

### Setup and prerequisites

For reference purposes, we provide sample code in Python to fully verify Azure Confidential Ledger write transaction receipts following the steps outlined in the previous section.

To run the full verification algorithm, the current service network certificate and a write transaction receipt from a running Confidential Ledger resource are required. Refer to [this article](write-transaction-receipts.md#get-write-transaction-receipts) for details on how to fetch a write transaction receipt and the service certificate from a Confidential Ledger instance.

### Code walkthrough

The following code can be used to initialize the required objects and run the receipt verification algorithm. A separate utility (`verify_receipt`) is used to run the full verification algorithm, and accepts the content of the `receipt` field in a `GET_RECEIPT` response as a dictionary and the service certificate as a simple string. The function throws an exception if the receipt isn't valid or if any error was encountered during the processing.

It's assumed that both the receipt and the service certificate can be loaded from files. Make sure to update both the `service_certificate_file_name` and `receipt_file_name` constants with the respective files names of the service certificate and receipt you would like to verify.

```python
import json 

# Constants
service_certificate_file_name = "<your-service-certificate-file>"
receipt_file_name = "<your-receipt-file>"

# Use the receipt and the service identity to verify the receipt content 
with open(service_certificate_file_name, "r") as service_certificate_file, open( 
    receipt_file_name, "r" 
) as receipt_file: 

    # Load relevant files content 
    receipt = json.loads(receipt_file.read())["receipt"] 
    service_certificate_cert = service_certificate_file.read() 

    try: 
        verify_receipt(receipt, service_certificate_cert) 
        print("Receipt verification succeeded") 

    except Exception as e: 
        print("Receipt verification failed") 

        # Raise caught exception to look at the error stack
        raise e 
```

As the verification process requires some cryptographic and hashing primitives, the following libraries are used to facilitate the computation.

* The [CCF Python library](https://microsoft.github.io/CCF/main/audit/python_library.html): the module provides a set of tools for receipt verification.
* The [Python cryptography library](https://cryptography.io/en/latest/): a widely used library that includes various cryptographic algorithms and primitives.
* The [hashlib module](https://docs.python.org/3/library/hashlib.html), part of the Python standard library: a module that provides a common interface for popular hashing algorithms.

```python
from ccf.receipt import verify, check_endorsements, root 
from cryptography.x509 import load_pem_x509_certificate, Certificate 
from hashlib import sha256 
from typing import Dict, List, Any 
```

Inside the `verify_receipt` function, we check that the given receipt is valid and contains all the required fields.

```python
# Check that all the fields are present in the receipt 
assert "cert" in receipt 
assert "leafComponents" in receipt 
assert "claimsDigest" in receipt["leafComponents"] 
assert "commitEvidence" in receipt["leafComponents"] 
assert "writeSetDigest" in receipt["leafComponents"] 
assert "proof" in receipt 
assert "signature" in receipt 
```

We initialize the variables that are going to be used in the rest of the program.

```python
# Set the variables 
node_cert_pem = receipt["cert"] 
claims_digest_hex = receipt["leafComponents"]["claimsDigest"] 
commit_evidence_str = receipt["leafComponents"]["commitEvidence"] 
write_set_digest_hex = receipt["leafComponents"]["writeSetDigest"] 
proof_list = receipt["proof"] 
service_endorsements_certs_pem = receipt.get("serviceEndorsements", [])
root_node_signature = receipt["signature"] 
```

We can load the PEM certificates for the service identity, the signing node, and the endorsements certificates from previous service identities using the cryptography library.

```python
# Load service and node PEM certificates 
service_cert = load_pem_x509_certificate(service_cert_pem.encode()) 
node_cert = load_pem_x509_certificate(node_cert_pem.encode()) 

# Load service endorsements PEM certificates 
service_endorsements_certs = [ 
    load_pem_x509_certificate(pem.encode()) 
    for pem in service_endorsements_certs_pem 
] 
```

The first step of the verification process is to compute the digest of the leaf node.

```python
# Compute leaf of the Merkle Tree corresponding to our transaction 
leaf_node_hex = compute_leaf_node( 
    claims_digest_hex, commit_evidence_str, write_set_digest_hex 
)
```

The `compute_leaf_node` function accepts as parameters the leaf components of the receipt (the `claimsDigest`, the `commitEvidence`, and the `writeSetDigest`) and returns the leaf node hash in hexadecimal form.

As detailed previously, we compute the digest of `commitEvidence` (using the SHA-256 `hashlib` function). Then, we convert both `writeSetDigest` and `claimsDigest` into arrays of bytes. Finally, we concatenate the three arrays, and we digest the result using the SHA256 function.

```python
def compute_leaf_node( 
    claims_digest_hex: str, commit_evidence_str: str, write_set_digest_hex: str 
) -> str: 
    """Function to compute the leaf node associated to a transaction 
    given its claims digest, commit evidence, and write set digest.""" 

    # Digest commit evidence string 
    commit_evidence_digest = sha256(commit_evidence_str.encode()).digest() 

    # Convert write set digest to bytes 
    write_set_digest = bytes.fromhex(write_set_digest_hex) 

    # Convert claims digest to bytes 
    claims_digest = bytes.fromhex(claims_digest_hex) 

    # Create leaf node by hashing the concatenation of its three components 
    # as bytes objects in the following order: 
    # 1. write_set_digest 
    # 2. commit_evidence_digest 
    # 3. claims_digest 
    leaf_node_digest = sha256( 
        write_set_digest + commit_evidence_digest + claims_digest 
    ).digest() 

    # Convert the result into a string of hexadecimal digits 
    return leaf_node_digest.hex() 
```

After computing the leaf, we can compute the root of the Merkle tree.

```python
# Compute root of the Merkle Tree 
root_node = root(leaf_node_hex, proof_list) 
```

We use the function `root` provided as part of the CCF Python library. The function successively concatenates the result of the previous iteration with a new element from `proof`, digests the concatenation, and then repeats the step for every element in `proof` with the previously computed digest. The concatenation needs to respect the order of the nodes in the Merkle Tree to make sure the root is recomputed correctly.

```python
def root(leaf: str, proof: List[dict]): 
    """ 
    Recompute root of Merkle tree from a leaf and a proof of the form: 
    [{"left": digest}, {"right": digest}, ...] 
    """ 

    current = bytes.fromhex(leaf) 

    for n in proof: 
        if "left" in n: 
            current = sha256(bytes.fromhex(n["left"]) + current).digest() 
        else: 
            current = sha256(current + bytes.fromhex(n["right"])).digest() 
    return current.hex() 
```

After computing the root node hash, we can verify the signature contained in the receipt over the root to validate that the signature is correct.

```python
# Verify signature of the signing node over the root of the tree 
verify(root_node, root_node_signature, node_cert) 
```

Similarly, the CCF library provides a function `verify` to do this verification. We use the ECDSA public key of the signing node certificate to verify the signature over the root of the tree.

```python
def verify(root: str, signature: str, cert: Certificate):
    """ 
    Verify signature over root of Merkle Tree 
    """ 

    sig = base64.b64decode(signature) 
    pk = cert.public_key() 
    assert isinstance(pk, ec.EllipticCurvePublicKey) 
    pk.verify( 
        sig, 
        bytes.fromhex(root), 
        ec.ECDSA(utils.Prehashed(hashes.SHA256())), 
    )
```

The last step of receipt verification is validating the certificate that was used to sign the root of the Merkle tree.

```python
# Verify node certificate is endorsed by the service certificates through endorsements 
check_endorsements(node_cert, service_cert, service_endorsements_certs) 
```

Likewise, we can use the CCF utility `check_endorsements` to validate that the service identity endorses the signing node. The certificate chain could be composed of previous service certificates, so we should validate that the endorsement is applied transitively if `serviceEndorsements` isn't an empty list.

```python
def check_endorsement(endorsee: Certificate, endorser: Certificate): 
    """ 
    Check endorser has endorsed endorsee 
    """ 

    digest_algo = endorsee.signature_hash_algorithm 
    assert digest_algo 
    digester = hashes.Hash(digest_algo) 
    digester.update(endorsee.tbs_certificate_bytes) 
    digest = digester.finalize() 
    endorser_pk = endorser.public_key() 
    assert isinstance(endorser_pk, ec.EllipticCurvePublicKey) 
    endorser_pk.verify( 
        endorsee.signature, digest, ec.ECDSA(utils.Prehashed(digest_algo)) 
    ) 

def check_endorsements( 
    node_cert: Certificate, service_cert: Certificate, endorsements: List[Certificate] 
): 
    """ 
    Check a node certificate is endorsed by a service certificate, transitively through a list of endorsements. 
    """ 

    cert_i = node_cert 
    for endorsement in endorsements: 
        check_endorsement(cert_i, endorsement) 
        cert_i = endorsement 
    check_endorsement(cert_i, service_cert) 
```

As an alternative, we could also validate the certificate by using the OpenSSL library using a similar method.

```python
from OpenSSL.crypto import ( 
    X509, 
    X509Store, 
    X509StoreContext, 
)

def verify_openssl_certificate( 
    node_cert: Certificate, 
    service_cert: Certificate, 
    service_endorsements_certs: List[Certificate], 
) -> None: 
    """Verify that the given node certificate is a valid OpenSSL certificate through 
    the service certificate and a list of endorsements certificates.""" 

    store = X509Store() 

    # pyopenssl does not support X509_V_FLAG_NO_CHECK_TIME. For recovery of expired 
    # services and historical receipts, we want to ignore the validity time. 0x200000 
    # is the bitmask for this option in more recent versions of OpenSSL. 
    X509_V_FLAG_NO_CHECK_TIME = 0x200000 
    store.set_flags(X509_V_FLAG_NO_CHECK_TIME) 

    # Add service certificate to the X.509 store 
    store.add_cert(X509.from_cryptography(service_cert)) 

    # Prepare X.509 endorsement certificates 
    certs_chain = [X509.from_cryptography(cert) for cert in service_endorsements_certs] 

    # Prepare X.509 node certificate 
    node_cert_pem = X509.from_cryptography(node_cert) 

    # Create X.509 store context and verify its certificate 
    ctx = X509StoreContext(store, node_cert_pem, certs_chain) 
    ctx.verify_certificate() 
```

### Sample code

The full sample code used in the code walkthrough is provided.

#### Main program

```python
import json 

# Use the receipt and the service identity to verify the receipt content 
with open("network_certificate.pem", "r") as service_certificate_file, open( 
    "receipt.json", "r" 
) as receipt_file: 

    # Load relevant files content 
    receipt = json.loads(receipt_file.read())["receipt"]
    service_certificate_cert = service_certificate_file.read()

    try: 
        verify_receipt(receipt, service_certificate_cert) 
        print("Receipt verification succeeded") 

    except Exception as e: 
        print("Receipt verification failed") 

        # Raise caught exception to look at the error stack 
        raise e 
```

#### Receipt verification

```python
from cryptography.x509 import load_pem_x509_certificate, Certificate 
from hashlib import sha256 
from typing import Dict, List, Any 

from OpenSSL.crypto import ( 
    X509, 
    X509Store, 
    X509StoreContext, 
) 

from ccf.receipt import root, verify, check_endorsements 

def verify_receipt(receipt: Dict[str, Any], service_cert_pem: str) -> None: 
    """Function to verify that a given write transaction receipt is valid based 
    on its content and the service certificate. 
    Throws an exception if the verification fails.""" 

    # Check that all the fields are present in the receipt 
    assert "cert" in receipt 
    assert "leafComponents" in receipt 
    assert "claimsDigest" in receipt["leafComponents"] 
    assert "commitEvidence" in receipt["leafComponents"] 
    assert "writeSetDigest" in receipt["leafComponents"] 
    assert "proof" in receipt 
    assert "signature" in receipt 

    # Set the variables 
    node_cert_pem = receipt["cert"] 
    claims_digest_hex = receipt["leafComponents"]["claimsDigest"] 
    commit_evidence_str = receipt["leafComponents"]["commitEvidence"] 

    write_set_digest_hex = receipt["leafComponents"]["writeSetDigest"] 
    proof_list = receipt["proof"] 
    service_endorsements_certs_pem = receipt.get("serviceEndorsements", [])
    root_node_signature = receipt["signature"] 

    # Load service and node PEM certificates
    service_cert = load_pem_x509_certificate(service_cert_pem.encode()) 
    node_cert = load_pem_x509_certificate(node_cert_pem.encode()) 

    # Load service endorsements PEM certificates
    service_endorsements_certs = [ 
        load_pem_x509_certificate(pem.encode()) 
        for pem in service_endorsements_certs_pem 
    ] 

    # Compute leaf of the Merkle Tree 
    leaf_node_hex = compute_leaf_node( 
        claims_digest_hex, commit_evidence_str, write_set_digest_hex 
    ) 

    # Compute root of the Merkle Tree
    root_node = root(leaf_node_hex, proof_list) 

    # Verify signature of the signing node over the root of the tree
    verify(root_node, root_node_signature, node_cert) 

    # Verify node certificate is endorsed by the service certificates through endorsements
    check_endorsements(node_cert, service_cert, service_endorsements_certs) 

    # Alternative: Verify node certificate is endorsed by the service certificates through endorsements 
    verify_openssl_certificate(node_cert, service_cert, service_endorsements_certs) 

def compute_leaf_node( 
    claims_digest_hex: str, commit_evidence_str: str, write_set_digest_hex: str 
) -> str: 
    """Function to compute the leaf node associated to a transaction 
    given its claims digest, commit evidence, and write set digest.""" 

    # Digest commit evidence string
    commit_evidence_digest = sha256(commit_evidence_str.encode()).digest() 

    # Convert write set digest to bytes
    write_set_digest = bytes.fromhex(write_set_digest_hex) 

    # Convert claims digest to bytes
    claims_digest = bytes.fromhex(claims_digest_hex) 

    # Create leaf node by hashing the concatenation of its three components 
    # as bytes objects in the following order: 
    # 1. write_set_digest 
    # 2. commit_evidence_digest 
    # 3. claims_digest 
    leaf_node_digest = sha256( 
        write_set_digest + commit_evidence_digest + claims_digest 
    ).digest() 

    # Convert the result into a string of hexadecimal digits 
    return leaf_node_digest.hex() 

def verify_openssl_certificate( 
    node_cert: Certificate, 
    service_cert: Certificate, 
    service_endorsements_certs: List[Certificate], 
) -> None: 
    """Verify that the given node certificate is a valid OpenSSL certificate through 
    the service certificate and a list of endorsements certificates.""" 

    store = X509Store() 

    # pyopenssl does not support X509_V_FLAG_NO_CHECK_TIME. For recovery of expired 
    # services and historical receipts, we want to ignore the validity time. 0x200000 
    # is the bitmask for this option in more recent versions of OpenSSL. 
    X509_V_FLAG_NO_CHECK_TIME = 0x200000 
    store.set_flags(X509_V_FLAG_NO_CHECK_TIME) 

    # Add service certificate to the X.509 store
    store.add_cert(X509.from_cryptography(service_cert)) 

    # Prepare X.509 endorsement certificates
    certs_chain = [X509.from_cryptography(cert) for cert in service_endorsements_certs] 

    # Prepare X.509 node certificate
    node_cert_pem = X509.from_cryptography(node_cert) 

    # Create X.509 store context and verify its certificate
    ctx = X509StoreContext(store, node_cert_pem, certs_chain) 
    ctx.verify_certificate() 
```

## Next steps

* [Azure Confidential Ledger write transaction receipts](write-transaction-receipts.md)
* [Overview of Microsoft Azure confidential ledger](overview.md)
* [Azure confidential ledger architecture](architecture.md)
