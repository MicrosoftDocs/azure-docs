---
author: rothja
ms.service: billing
ms.topic: include
ms.date: 11/09/2018	
ms.author: jroth
---
Key transactions (Max transactions allowed in 10 seconds, per vault per region<sup>1</sup>):

|Key type|HSM-key<br>CREATE Key|HSM-key<br>All other transactions|Software-key<br>CREATE Key|Software-key<br>All other transactions|
|:---|---:|---:|---:|---:|
|RSA 2048-bit|5|1000|10|2000|
|RSA 3072-bit|5|250|10|500|
|RSA 4096-bit|5|125|10|250|
|ECC P-256|5|1000|10|2000|
|ECC P-384|5|1000|10|2000|
|ECC P-521|5|1000|10|2000|
|ECC SECP256K1|5|1000|10|2000|
|

> [!NOTE]
> If you look at the table below, you see that for software-backed keys we allow 2000 transactions per 10 seconds, and for HSM backed keys we allow 1000 transactions      per 10 seconds. 
  The ratio of software-backed transactions for 3072 keys to 2048 keys is 500/2000 or 0.4. This means that if a customer does 500 3072 key transactions in 10 seconds, they reach their max limit and can't do any other key operations. 
   
|Key type  | Software key |HSM-key  |
|---------|---------|---------|
|RSA 2048-bit     |    2000     |   1000    |
|RSA 3072-bit     |     500    |    250     |
|RSA 4096-bit     |    125     |    250     |
|ECC P-256     |    2000     |  1000     |
|ECC P-384     |    2000     |  1000     |
|ECC P-521     |    2000     |  1000     |
|ECC SECP256K1     |    2000     |  1000     |


Secrets, Managed Storage Account Keys, and vault transactions:
| Transactions type | Max transactions allowed in 10 seconds, per vault per region<sup>1</sup> |
| --- | --- |
| All transactions |2000 |
|

See [Azure Key Vault throttling guidance](../articles/key-vault/key-vault-ovw-throttling.md) for information on how to handle throttling when these limits are exceeded.

<sup>1</sup> There is a subscription-wide limit for all transaction types, that is 5x per key vault limit. For example, HSM- other transactions per subscription are limited to 5000 transactions in 10 seconds per subscription.
