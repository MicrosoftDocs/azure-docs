---
| Limit identifier | Limit | Comments |
| --- | --- | --- |
| Maximum number of Streaming Units per subscription per region |50 |A request to increase streaming units for your subscription beyond 50 can be made by contacting [Microsoft Support](https://support.microsoft.com/en-us). |
| Maximum throughput of a Streaming Unit |1MB/s* |Maximum throughput per SU depends on the scenario. Actual throughput may be lower and depends upon query complexity and partitioning. Further details can be found in the [Scale Azure Stream Analytics jobs to increase throughput](../articles/stream-analytics/stream-analytics-scale-jobs.md) article. |
| Maximum number of inputs per job |60 |There is a hard limit of 60 inputs per Stream Analytics job. |
| Maximum number of outputs per job |60 |There is a hard limit of 60 outputs per Stream Analytics job. |
| Maximum number of functions per job |60 |There is a hard limit of 60 functions per Stream Analytics job. |
| Maximum number of Streaming Units per job |120 |There is a hard limit of 120 Streaming Units per Stream Analytics job. |
| Maximum number of jobs per region |1500 |Each subscription may have up to 1500 jobs per geographical region. |
| Reference data blob MB | 100 | Reference data blobs cannot be larger than 100 MB each. |

