---
title: Verify Azure Confidential Ledger write transaction receipts
description: Verify Azure Confidential Ledger write transaction receipts
author: apiccione
ms.author: apiccione
ms.date: 11/07/2022
ms.service: confidential-ledger
ms.topic: how-to

---

# Verify Azure Confidential Ledger write transaction receipts

## Context

For more details about Azure Confidential Ledger write transaction receipts, please refer to the detailed documentation on the topic that can be found at the [following page](write-transaction-receipts.md).

## Receipt verification steps

An Azure Confidential Ledger write transaction receipt represents a cryptographic Merkle proof that the corresponding write transaction has been globally committed into the immutable ledger. A receipt can be verified following a specific set of steps outlined in the following sub-sections.

### Leaf node computation

The first step is to compute the SHA-256 hash of the leaf node in the Merkle Tree corresponding to the committed transaction. A leaf node is composed of the ordered concatenation of the following fields that can be found in an Azure Confidential Ledger receipt, under `leaf_components`:

1. `write_set_digest`
2. SHA-256 digest of `commit_evidence`
3. `claims_digest` fields

Please keep in mind that the these values needs to be concatenated as arrays of bytes. This means that `write_set_digest` and `claims_digest` would need to be converted from strings of hexadecimal digits to arrays of bytes; on the other hand, the hash of `commit_evidence` can be obtained by applying the SHA-256 hash function over the UTF-8 encoded `commit_evidence` string.

Similarly, the leaf node hash digest can be computed by applying the SHA-256 hash function over the result concatenation of the resulting bytes.

### Root node computation

The second step is to compute the SHA-256 hash of the root of the Merkle Tree at the time the transaction was committed. This can be accomplished by iteratively concatenating and hashing the result of the previous iteration (starting from the leaf node hash computed in the previous step) with the ordered nodes' hashes provided in the `proof` field of a receipt. Please note that the `proof` list is provided as an ordered list and its elements need to be iterated in the given order.

The concatenation needs to be done on the bytes representation with respect to the relative order indicated in the objects provided in the `proof` field (either `left` or `right`).

* If the key of the current element in `proof` is `left`, then the result of the previous iteration should be appended to the current element value.
* If the key of the current element in `proof` is `right`, then the result of the previous iteration should be prepended to the current element value.

After each concatenation, the SHA-256 function needs to be applied in order to obtain the input for the next iteration. This process follows the standard steps to compute the root node of a [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree) data structure given the required nodes for the computation.

### Verify signature over root node

The third step is to verify that the cryptographic signature produced over the root node hash is valid using the signing node certificate in the receipt. The verification process follows the standard steps for digital signature verification for messages signed using the [Elliptic Curve Digital Signature Algorithm (ECDSA)](https://wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm). More specifically, the steps are:

1. Decode the base64 string `signature` into an array of bytes.
2. Extract the ECDSA public key from the signing node certificate `cert`.
3. Verify that the signature over the root of the Merkle Tree (computed using the instructions in the previous sub-section) is authentic using the extracted public key from the previous step. This step effectively corresponds to a standard [digital signature](https://wikipedia.org/wiki/Digital_signature) verification process using ECDSA. There are many libraries in the most popular programming languages that allow verifying an ECDSA signature using a public key certificate over some data and that can be leveraged for this step (e.g., [ecdsa](https://pypi.org/project/ecdsa/) for Python).

### Verify signing node certificate endorsement

In addition to the above, it is also required to verify that the signing node certificate is endorsed (i.e., signed) by the current ledger certificate. Please note that this step does not depend on the other three previous steps and can be carried out independenly from the others.

As the ledger certificate may have been renewed since the transaction was committed, it is possible that the current service identity that issued the receipt is different from the one that endorsed the signing node. If this applies, it is required to verify the chain of certificates trust from the signing node certificate (i.e., the `cert` field in the receipt) up to the trusted root Certificate Authority (CA) (i.e., the current service identity certificate) through other previous service identities (i.e., the `service_endorsements` list field in the receipt). Please note that the `service_endorsements` list is provided as an ordered list from the oldest to the latest service identity.

Certificate endorsement need to be verified for the entire chain and follows the exact same digital signature verification process outlined in the previous sub-section. There are popular open-source cryptographic libraries (e.g., [OpenSSL](https://www.openssl.org/)) that can be typically used to carry out a certificate endorsement step.

### Additional resources

Please refer to the [CCF documentation about receipt verification](https://microsoft.github.io/CCF/main/use_apps/verify_tx.html#receipt-verification) for more details about how the algorithm works. The following links could also be useful to better understand some topics related to receipt verification:

* [CCF Glossary](https://microsoft.github.io/CCF/main/overview/glossary.html)
* [Merkle Tree](https://microsoft.github.io/CCF/main/architecture/merkle_tree.html)
* [Cryptography](https://microsoft.github.io/CCF/main/architecture/cryptography.html)
* [Certificates](https://microsoft.github.io/CCF/main/operations/certificates.html)

## Verify write transaction receipts

### Setup and pre-requisites

For reference purposes, we provide sample code in Python to fully verify Azure Confidential Ledger write transaction receipts following the steps outlined above.

For the verification algorithm, we are going to need the current service network certificate and a write transaction receipt from a running Confidential Ledger resource. Please refer to the [following page](write-transaction-receipts.md#fetching-a-write-transaction-receipt) for details on how to fetch a write transaction receipt and how to retrieve the service certificate.

### Code walkthrough

We are going to use a separate utility (`verify_receipt`) to run the receipt verification algorithm and we provide as input of the algorithm the content of the `receipt` field of a `GET_RECEIPT` response as a dictionary and the service certitificate as a simple string. The function throws an exceptions if the receipt is not valid or if any error was encountered.

We assume that both the receipt and the service certificate can be loaded from files.

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

As the verification process requires some cryptographic and hashing algorithms, we are going to need the following modules as helper utilities:

* The [CCF Python library](https://microsoft.github.io/CCF/main/audit/python_library.html): the module provides a set of tools for receipt verification.
* The [Python cryptography library](https://cryptography.io/en/latest/): a widely used library that includes a variety of cryptographic algorithms and primitives.
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
assert "is_signature_transaction" in receipt 
assert "leaf_components" in receipt 
assert "claims_digest" in receipt["leaf_components"] 
assert "commit_evidence" in receipt["leaf_components"] 
assert "write_set_digest" in receipt["leaf_components"] 
assert "proof" in receipt 
assert "service_endorsements" in receipt 
assert "signature" in receipt 
```

We initialize the variables we are going to use for the rest of the program.

```python
# Set the variables 
node_cert_pem = receipt["cert"] 
is_signature_transaction = receipt["is_signature_transaction"] 
claims_digest_hex = receipt["leaf_components"]["claims_digest"] 
commit_evidence_str = receipt["leaf_components"]["commit_evidence"] 
write_set_digest_hex = receipt["leaf_components"]["write_set_digest"] 
proof_list = receipt["proof"] 
service_endorsements_certs_pem = receipt["service_endorsements"] 
root_node_signature = receipt["signature"] 
```

We check that the receipt is not related to a signature transaction. Receipts for signature transactions are not allowed for Confidential Ledger.

```python
# Check that this receipt is not for a signature transaction 
assert not is_signature_transaction 
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

The `compute_leaf_node` function accepts as parameters the leaf components of the receipt (the `claims_digest`, the `commit_evidence`, and the `write_set_digest`) and returns the leaf node hash in hexadecimal form.

As detailed above, we compute the digest of `commit_evidence` (using the SHA256 hashlib function). Then, we convert both `write_set_digest` and `claims_digest` into arrays of bytes. Finally, we concatenate the three arrays, and we digest the result using the SHA256 hashlib function.

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

We leverage the function `root` provided as part of the CCF Python library. The function successively concatenates the result of the previous iteration with a new element from `proof`, digests the concatenation, and then repeats the step for every element in `proof` with the previously computed digest. The concatenation needs to respect the order of the nodes in the Merkle Tree to make sure the root is re-computed correctly.

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

Likewise, we can use the CCF utility `check_endorsements` to validate that the certificate of the signing node is endorsed by the service identity. The certificate chain could be composed of previous service certificates, so we should validate that the endorsement is applied transitively if `service_endorsements` is not an empty list.

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

As an alternative, we could also validate the certificate by leveraging the OpenSSL library using a similar method.

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

The full sample code used in the code walkthrough can be found below.

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
    assert "is_signature_transaction" in receipt 
    assert "leaf_components" in receipt 
    assert "claims_digest" in receipt["leaf_components"] 
    assert "commit_evidence" in receipt["leaf_components"] 
    assert "write_set_digest" in receipt["leaf_components"] 
    assert "proof" in receipt 
    assert "service_endorsements" in receipt 
    assert "signature" in receipt 

    # Set the variables 
    node_cert_pem = receipt["cert"] 
    is_signature_transaction = receipt["is_signature_transaction"] 
    claims_digest_hex = receipt["leaf_components"]["claims_digest"] 
    commit_evidence_str = receipt["leaf_components"]["commit_evidence"] 

    write_set_digest_hex = receipt["leaf_components"]["write_set_digest"] 
    proof_list = receipt["proof"] 
    service_endorsements_certs_pem = receipt["service_endorsements"] 
    root_node_signature = receipt["signature"] 

    # Check that this receipt is not for a signature transaction 
    assert not is_signature_transaction 

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

* [Overview of Microsoft Azure confidential ledger](overview.md)
* [Azure confidential ledger architecture](architecture.md)
