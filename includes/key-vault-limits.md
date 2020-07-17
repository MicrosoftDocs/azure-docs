---
author: rothja
ms.service: key-vault
ms.topic: include
ms.date: 04/21/2020	
ms.author: jroth
---

### Key transactions (maximum transactions allowed in 10 seconds, per vault per region<sup>1</sup>):

|Key type|HSM key<br>CREATE key|HSM key<br>All other transactions|Software key<br>CREATE key|Software key<br>All other transactions|
|:---|---:|---:|---:|---:|
|RSA 2,048-bit|5|1,000|10|2,000|
|RSA 3,072-bit|5|250|10|500|
|RSA 4,096-bit|5|125|10|250|
|ECC P-256|5|1,000|10|2,000|
|ECC P-384|5|1,000|10|2,000|
|ECC P-521|5|1,000|10|2,000|
|ECC SECP256K1|5|1,000|10|2,000|

> [!NOTE]
> In the previous table, we see that for RSA 2,048-bit software keys, 2,000 GET transactions per 10 seconds are allowed. For RSA 2,048-bit HSM-keys, 1,000 GET transactions per 10 seconds are allowed.
>
> The throttling thresholds are weighted, and enforcement is on their sum. For example, as shown in the previous table, when you perform GET operations on RSA HSM-keys, it's eight times more expensive to use 4,096-bit keys compared to 2,048-bit keys. That's because 1,000/125 = 8.
>
> In a given 10-second interval, an Azure Key Vault client can do *only one* of the following operations before it encounters a `429` throttling HTTP status code:
> - 2,000 RSA 2,048-bit software-key GET transactions
> - 1,000 RSA 2,048-bit HSM-key GET transactions
> - 125 RSA 4,096-bit HSM-key GET transactions
> - 124 RSA 4,096-bit HSM-key GET transactions and 8 RSA 2,048-bit HSM-key GET transactions

### Secrets, managed storage account keys, and vault transactions:

| Transactions type | Maximum transactions allowed in 10 seconds, per vault per region<sup>1</sup> |
| --- | --- |
| All transactions |2,000 |

For information on how to handle throttling when these limits are exceeded, see [Azure Key Vault throttling guidance](../articles/key-vault/key-vault-ovw-throttling.md).

<sup>1</sup> A subscription-wide limit for all transaction types is five times per key vault limit. For example, HSM-other transactions per subscription are limited to 5,000 transactions in 10 seconds per subscription.

### Azure Private Link integration

> [!NOTE]
> The number of key vaults with private endpoints enabled per subscription is an adjustable limit. The limit shown below is the default limit. If you would like to request a limit increase for your service, please send an email to akv-privatelink@microsoft.com. We will approve these requests on a case by case basis.

| Resource | Limit |
| -------- | ----- |
| Private endpoints per key vault | 64 |
| Key vaults with private endpoints per subscription | 400 |
