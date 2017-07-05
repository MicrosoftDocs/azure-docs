Key transactions (Max transactions allowed in 10 seconds, per vault per region<sup>1</sup>):
|Transaction type|RSA 2048-bit|RSA 3072-bit|RSA 4096-bit|
|:---|---:|---:|---:|
|**HSM-key**<br>Create Key<br>All other transactions|<br>5<br>1000|<br>5<br>250|<br>5<br>125|
|**Software-key**<br>Create Key<br>All other transactions|<br>10<br>2000|<br>10<br>500|<br>10<br>250|
|

Secrets, Managed Storage Account Keys, and vault transactions:
| Transactions Type | Max transactions allowed in 10 seconds, per vault per region<sup>1</sup> |
| --- | --- |
| All transactions |2000 |

<sup>1</sup> There is a subscription-wide limit for all transaction types, that is 5x per key vault limit. For example, HSM- other transactions per subscription are limited to 5000 transactions in 10 seconds per subscription.
