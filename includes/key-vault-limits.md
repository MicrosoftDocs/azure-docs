---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 05/28/2021
ms.author: mbaldwin
---

Azure Key Vault service supports two resource types: Vaults and Managed HSMs. The following two sections describe the service limits for each of them respectively.

### Resource type: vault

This section describes service limits for resource type `vaults`. 

#### Key transactions (maximum transactions allowed in 10 seconds, per vault per region<sup>1</sup>):

|Key type|HSM key<br>CREATE key|HSM key<br>All other transactions|Software key<br>CREATE key|Software key<br>All other transactions|
|:---|---:|---:|---:|---:|
|RSA 2,048-bit|10|2,000|20|4,000|
|RSA 3,072-bit|10|500|20|1,000|
|RSA 4,096-bit|10|250|20|500|
|ECC P-256|10|2,000|20|4,000|
|ECC P-384|10|2,000|20|4,000|
|ECC P-521|10|2,000|20|4,000|
|ECC SECP256K1|10|2,000|20|4,000|
||||||

> [!NOTE]
> In the previous table, we see that for RSA 2,048-bit software keys, 4,000 GET transactions per 10 seconds are allowed. For RSA 2,048-bit HSM-keys, 2,000 GET transactions per 10 seconds are allowed.
>
> The throttling thresholds are weighted, and enforcement is on their sum. For example, as shown in the previous table, when you perform GET operations on RSA HSM-keys, it's eight times more expensive to use 4,096-bit keys compared to 2,048-bit keys. That's because 2,000/250 = 8.
>
> In a given 10-second interval, an Azure Key Vault client can do *only one* of the following operations before it encounters a `429` throttling HTTP status code:
> - 4,000 RSA 2,048-bit software-key GET transactions
> - 2,000 RSA 2,048-bit HSM-key GET transactions
> - 250 RSA 4,096-bit HSM-key GET transactions
> - 248 RSA 4,096-bit HSM-key GET transactions and 16 RSA 2,048-bit HSM-key GET transactions

#### Secrets, managed storage account keys, and vault transactions:

| Transactions type | Maximum transactions allowed in 10 seconds, per vault per region<sup>1</sup> |
| --- | --- |
| Secret<br>CREATE secret| 300 |
| All other transactions |4,000 |

For information on how to handle throttling when these limits are exceeded, see [Azure Key Vault throttling guidance](../articles/key-vault/general/overview-throttling.md).

<sup>1</sup> A subscription-wide limit for all transaction types is five times per key vault limit.

#### Backup keys, secrets, certificates

When you back up a key vault object, such as a secret, key, or certificate, the backup operation will download the object as an encrypted blob. This blob cannot be decrypted outside of Azure. To get usable data from this blob, you must restore the blob into a key vault within the same Azure subscription and Azure geography

| Transactions type | Maximum key vault object versions allowed |
| --- | --- |
| Back up individual key, secret, certificate |500 |

> [!NOTE]
> Attempting to backup a key, secret, or certificate object with more versions than above limit will result in an error. It is not possible to delete previous versions of a key, secret, or certificate. 

### Limits on count of keys, secrets and certificates:

Key Vault does not restrict the number of keys, secrets or certificates that can be stored in a vault. The transaction limits on the vault should be taken into account to ensure that operations are not throttled.

Key Vault does not restrict the number of versions on a secret, key or certificate, but storing a large number of versions (500+) can impact the performance of backup operations. See [Azure Key Vault Backup](../articles/key-vault/general/backup.md).

### Resource type: Managed HSM

This section describes service limits for resource type `managed HSM`.

#### Object limits

|Item|Limits|
|----|------:|
Number of HSM instances per subscription per region|5 
Number of keys per HSM instance |5000
Number of versions per key|100
Number of custom role definitions per HSM instance|50
Number of role assignments at HSM scope|50
Number of role assignments at each individual key scope|10
|||

#### Transaction limits for administrative operations (number of operations per second per HSM instance)
|Operation |Number of operations per second|
|----|------:|
All RBAC operations<br/>(includes all CRUD operations for role definitions and role assignments)|5
Full HSM Backup/Restore<br/>(only one concurrent backup or restore operation per HSM instance supported)|1

#### Transaction limits for cryptographic operations (number of operations per second per HSM instance)

- Each Managed HSM instance constitutes three load balanced HSM partitions. The throughput limits are a function of underlying hardware capacity allocated for each partition. The tables below show maximum throughput with at least one partition available. Actual throughput may be up to 3x higher if all three partitions are available.
- Throughput limits noted assume that one single key is being used to achieve maximum throughput. For example, if a single RSA-2048 key is used the maximum throughput will be 1100 sign operations. If you use 1100 different keys with one transaction per second each, they will not be able to achieve the same throughput.

##### RSA key operations (number of operations per second per HSM instance)

|Operation|2048-bit|3072-bit|4096-bit|
|--|--:|--:|--:|
Create Key|1| 1| 1
Delete Key (soft-delete)|10|10|10 
Purge Key|10|10|10 
Backup Key|10|10|10 
Restore Key|10|10|10 
Get Key Information|1100|1100|1100
Encrypt|10000|10000|6000
Decrypt|1100|360|160
Wrap|10000|10000|6000
Unwrap|1100|360|160
Sign|1100|360|160
Verify|10000|10000|6000
|||||

##### EC key operations (number of operations per second per HSM instance)

This table describes number of operations per second for each curve type.

|Operation|P-256|P-256K|P-384|P-521|
|---|---:|---:|---:|---:|
Create Key| 1| 1| 1| 1
Delete Key (soft-delete)|10|10|10|10
Purge Key|10|10|10|10
Backup Key|10|10|10|10
Restore Key|10|10|10|10
Get Key Information|1100|1100|1100|1100
Sign|260|260|165|56
Verify|130|130|82|28
||||||


##### AES key operations (number of operations per second per HSM instance)
- Encrypt and Decrypt operations assume a 4KB packet size.
- Throughput limits for Encrypt/Decrypt apply to AES-CBC and AES-GCM algorithms.
- Throughput limits for Wrap/Unwrap apply to AES-KW algorithm.

|Operation|128-bit|192-bit|256-bit|
|--|--:|--:|--:|
Create Key|1| 1| 1
Delete Key (soft-delete)|10|10|10
Purge Key|10|10|10
Backup Key|10|10|10
Restore Key|10|10|10
Get Key Information|1100|1100|1100
Encrypt|8000|8000 |8000 
Decrypt|8000|8000|8000
Wrap|9000|9000|9000
Unwrap|9000|9000|9000

