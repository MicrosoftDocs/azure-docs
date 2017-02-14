
| Transactions Type | Max transactions allowed in 10 seconds, per vault per region<sup>1</sup> |
| --- | --- |
| HSM- CREATE KEY |5 |
| HSM- other transactions |1000 |
| Soft-key CREATE KEY |10 |
| Soft-key other transactions |1500 |
| All secrets, vault related transactions |2000 |

<sup>1</sup> There is a subscription-wide limit for all transaction types, that is 5x per key vault limit. For example, HSM- other transactions per subscription are limited to 5000 transactions in 10 seconds per subscription.

