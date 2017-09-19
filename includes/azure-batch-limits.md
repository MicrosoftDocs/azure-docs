| **Resource** | **Default Limit** | **Maximum Limit** |
| --- | --- | --- |
| Batch accounts per region per subscription | 3 |50 |
| Dedicated cores per Batch account (Batch service mode)<sup>1</sup> | 20 | N/A<sup>2</sup> |
| Low-priority cores per Batch account (Batch service mode)<sup>3</sup> | 50 | N/A<sup>4</sup> |
| Active jobs and job schedules<sup>5</sup> per Batch account | 20 | 5000<sup>6</sup> |
| Pools per Batch account | 20 | 2500 |

<sup>1</sup> Dedicated core quotas shown are only for accounts with pool allocation mode set to **Batch service**. For accounts with the mode set to **user subscription**, core quotas are based on the VM cores quota at a regional level or per VM family in your subscription.

<sup>2</sup> The number of dedicated cores per Batch account can be increased, but the maximum number is unspecified. Contact Azure support to discuss increase options.

<sup>3</sup> Low-priority core quotas shown are only for accounts with pool allocation mode set to **Batch service**. Low-priority cores are not available for accounts with pool allocation mode set to **user subscription**.

<sup>4</sup> The number of low-priority cores per Batch account can be increased, but the maximum number is unspecified. Contact Azure support to discuss increase options.

<sup>5</sup> Completed jobs and job schedules are not limited.

<sup>6</sup> Contact Azure support if you want to request an increase beyond this limit.
