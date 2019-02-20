---
author: rothja
ms.service: billing
ms.topic: include
ms.date: 11/09/2018	
ms.author: jroth
---
Key transactions (maximum transactions allowed in 10 seconds, per vault per region<sup>1</sup>):

|Key type|HSM key<br>CREATE key|HSM key<br>All other transactions|Software key<br>CREATE key|Software key<br>All other transactions|
|:---|---:|---:|---:|---:|
|RSA 2,048-bit|5|1,000|10|2,000|
|RSA 3,072-bit|5|250|10|500|
|RSA 4,096-bit|5|125|10|250|
|ECC P-256|5|1,000|10|2,000|
|ECC P-384|5|1,000|10|2,000|
|ECC P-521|5|1,000|10|2,000|
|ECC SECP256K1|5|1,000|10|2,000|
|

> [!NOTE]
> The previous thresholds are weighted, and enforcement is on their sum. You can do 125 RSA-HSM-4k operations and 0 RSA-HSM-2k, or 124 RSA-HSM-4k and 16 RSA-HSM-2k. Afterward, in the same 10-second interval, any other operation causes an Azure Key Vault client exception.

> [!NOTE]
> As the following table shows, software-backed keys are allowed 2,000 transactions per 10 seconds. HSM-backed keys are allowed 1,000 transactions per 10 seconds. 
  The ratio of software-backed transactions for 3,072 keys to 2,048 keys is 500/2,000 or 0.4. If a customer does 500 3,072 key transactions in 10 seconds, they reach their maximum limit and can't do any other key operations. 
   
|Key type  | Software key |HSM key  |
|---------|---------|---------|
|RSA 2,048-bit     |    2,000     |   1,000    |
|RSA 3,072-bit     |     500    |    250     |
|RSA 4,096-bit     |    125     |    250     |
|ECC P-256     |    2,000     |  1,000     |
|ECC P-384     |    2,000     |  1,000     |
|ECC P-521     |    2,000     |  1,000     |
|ECC SECP256K1     |    2,000     |  1,000     |


Secrets, managed storage account keys, and vault transactions:
| Transaction type | Maximum transactions allowed in 10 seconds, per vault per region<sup>1</sup> |
| --- | --- |
| All transactions |2,000 |
|

For information on how to handle throttling when these limits are exceeded, see [Azure Key Vault throttling guidance](../articles/key-vault/key-vault-ovw-throttling.md).

<sup>1</sup> A subscription-wide limit for all transaction types is five times per key vault limit. For example, HSM-key all other transactions per subscription are limited to 5,000 transactions in 10 seconds per subscription.
