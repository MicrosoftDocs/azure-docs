Data factory is a multi-tenant service that has the following default limits in place to make sure customer subscriptions are protected from each other's workloads. Many of the limits can be easily raised for your subscription up to the maximum limit by contacting support.

### Version 2

| Resource | Default Limit | Maximum Limit | 
| -------- | ------------- | ------------- | 
| Data factories in an Azure subscription |	50 | [Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Pipelines within a data factory | 2500 | [Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Datasets within a data factory | 2500 | [Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Triggers within a data factory | 2500 | [Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Linked services within a data factory | 2500 | [Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Integration runtimes within a data factory <sup>4</sup> | 2500 | [Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Concurrent pipeline runs per pipeline | 20 | [Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Max activities per pipeline | 20 | 30 |
| Max parameters per pipeline | 20 | 30 |
| Bytes per object for pipeline objects <sup>1</sup> | 200 KB | 200 KB |
| Bytes per object for dataset and linked service objects <sup>1</sup> | 100 KB | 2000 KB |
| Cloud data movement units <sup>3</sup> | 32 | [Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Retry count for pipeline activity runs | 1 day(timeout) | 1 day (timeout) |
| Write API calls | 2500/hr<br/><br/> This limit is imposed by Azure Resource Manager, not Azure Data Factory. | [Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/). |
| Read API calls | 12,500/hr<br/><br/> This limit is imposed by Azure Resource Manager, not Azure Data Factory. | [Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |


### Version 1

| **Resource** | **Default Limit** | **Maximum Limit** |
| --- | --- | --- |
| Data factories in an Azure subscription |50 |[Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Pipelines within a data factory |2500 |[Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Datasets within a data factory |5000 |[Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Concurrent slices per dataset |10 |10 |
| Bytes per object for pipeline objects <sup>1</sup> |200 KB |200 KB |
| Bytes per object for dataset and linked service objects <sup>1</sup> |100 KB |2000 KB |
| HDInsight on-demand cluster cores within a subscription <sup>2</sup> |60 |[Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Cloud data movement units <sup>3</sup> |32 |[Contact support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) |
| Retry count for pipeline activity runs |1000 |MaxInt (32 bit) |

<sup>1</sup> Pipeline, dataset, and linked service objects represent a logical grouping of your workload. Limits for these objects do not relate to amount of data you can move and process with the Azure Data Factory service. Data factory is designed to scale to handle petabytes of data.

<sup>2</sup> On-demand HDInsight cores are allocated out of the subscription that contains the data factory. As a result, the above limit is the Data Factory enforced core limit for on-demand HDInsight cores and is different from the core limit associated with your Azure subscription.

<sup>3</sup> Cloud data movement unit (DMU) is being used in a cloud-to-cloud copy operation. It is a measure that represents the power (a combination of CPU, memory, and network resource allocation) of a single unit in Data Factory. You can achieve higher copy throughput by using more DMUs for some scenarios. Refer to [Cloud data movement units](../articles/data-factory/v1/data-factory-copy-activity-performance.md#cloud-data-movement-units) section on details.

<sup>4</sup> The Integration Runtime (IR) is the compute infrastructure used by Azure Data Factory to provide the following data integration capabilities across different network environments: data movement, dispatching activities to compute services, execution of SSIS packages. For more information, see [Integration Runtime overview](../articles/data-factory/concepts-integration-runtime.md).

| **Resource** | **Default lower limit** | **Minimum limit** |
| --- | --- | --- |
| Scheduling interval |15 minutes |15 minutes |
| Interval between retry attempts |1 second |1 second |
| Retry timeout value |1 second |1 second |

#### Web service call limits
Azure Resource Manager has limits for API calls. You can make API calls at a rate within the [Azure Resource Manager API limits](../articles/azure-subscription-service-limits.md#resource-group-limits).
