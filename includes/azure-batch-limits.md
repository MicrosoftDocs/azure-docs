| **Resource** | **Default Limit** | **Maximum Limit** |
| --- | --- | --- |
| Batch accounts per region per subscription |3 |50 |
| Cores per Batch account (Batch service mode)<sup>1</sup> |20 |N/A<sup>2</sup> |
| Active jobs and job schedules<sup>3</sup> per Batch account |20 |5000<sup>4</sup> |
| Pools per Batch account |20 |2500 |

<sup>1</sup> Cores quotas shown are only for accounts with the pool allocation mode set to **Batch service**. For accounts with the mode set to **user subscription**, cores quotas are based on the VM cores quota at a regional level or per VM family in your subscription.

<sup>2</sup> The number of cores per Batch account can be increased, but the maximum number is unspecified. Contact Azure support to discuss increase options.

<sup>3</sup> Completed jobs and job schedules are not limited.

<sup>4</sup> Contact Azure support if you want to request an increase beyond this limit.
