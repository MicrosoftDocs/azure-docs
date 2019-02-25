---
author: rothja
ms.service: billing
ms.topic: include
ms.date: 11/09/2018	
ms.author: jroth
---

## Key transactions (Max transactions allowed in 10 seconds, per vault per region<sup>1</sup>):

|Key type|HSM-key<br>CREATE Key|HSM-key<br>All other transactions|Software-key<br>CREATE Key|Software-key<br>All other transactions|
|:---|---:|---:|---:|---:|
|RSA 2048-bit|5|1000|10|2000|
|RSA 3072-bit|5|250|10|500|
|RSA 4096-bit|5|125|10|250|
|ECC P-256|5|1000|10|2000|
|ECC P-384|5|1000|10|2000|
|ECC P-521|5|1000|10|2000|
|ECC SECP256K1|5|1000|10|2000|

> [!NOTE]
> In the table above, we see that for RSA 2048-bit software-keys, we allow 2000 GET transactions per 10 seconds, and that for RSA 2048-bit HSM-keys, we allow 1000 GET transactions per 10 seconds.
>
> Note that the throttling thresholds are weighted, and enforcement is on their sum. For example, in the table above, we can see that when performing GET operations on RSA HSM-keys, it is 8 times more expensive to use 4096-bit keys compared to 2048-bit keys (since 1000/125 = 8). Thus, in a given 10-second interval, an AKV client could do exactly one of the following before encountering a `429` throttling HTTP status code:
> - 2000 RSA 2048-bit software-key GET transactions, **or**
> - 1000 RSA 2048-bit HSM-key GET transactions, **or**
> - 125 RSA 4096-bit HSM-key GET transactions, **or**
> - 124 RSA 4096-bit HSM-key GET transactions and 8 RSA 2048-bit HSM-key GET transactions.

## Secrets, Managed Storage Account Keys, and vault transactions:
| Transactions type | Max transactions allowed in 10 seconds, per vault per region<sup>1</sup> |
| --- | --- |
| All transactions |2000 |

See [Azure Key Vault throttling guidance](../articles/key-vault/key-vault-ovw-throttling.md) for information on how to handle throttling when these limits are exceeded.

<sup>1</sup> There is a subscription-wide limit for all transaction types, that is 5x per key vault limit. For example, HSM- other transactions per subscription are limited to 5000 transactions in 10 seconds per subscription.
