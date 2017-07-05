Key transactions (Max transactions allowed in 10 seconds, per vault per region<sup>1</sup>):

|Key type|HSM-Key<br>CREATE Key|HSM-key<br>All other transactions|Software-key<br>CREATE Key|Software-key<br>All other transactions|
|:---|---:|---:|---:|---:|
|RSA 2048-bit|5|1000|10|2000|
|RSA 3072-bit|5|250|10|500|
|RSA 4096-bit|5|125|10|250|
|

Secrets, Managed Storage Account Keys, and vault transactions:
| Transactions Type | Max transactions allowed in 10 seconds, per vault per region<sup>1</sup> |
| --- | --- |
| All transactions |2000 |

<sup>1</sup> There is a subscription-wide limit for all transaction types, that is 5x per key vault limit. For example, HSM- other transactions per subscription are limited to 5000 transactions in 10 seconds per subscription.
