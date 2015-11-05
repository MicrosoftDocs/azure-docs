Data factory is a multi-tenant service that has the following default limits in place to make sure customer subscriptions are protected from each others workloads. Many of the limits can be easily raised for your subscription up to the maximum limit by contacting support. 

**Resource** | **Default Limit** | **Maximum Limit**
-------- | ------------- | -------------
pipelines within a data factory | 100 | 2500
datasets within a data factory | 500 | 5000
concurrent slices per dataset | 10 | 10
bytes per object for pipeline objects <sup>1</sup> | 200 KB | 2000 KB
bytes per object for dataset and linkedservice objects <sup>1</sup> | 30 KB | 2000 KB
fields per object | 100 | [Contact support](http://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/)
bytes per field name or identifier | 2 KB | [Contact support](http://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/)
bytes per field | 30 KB | [Contact support](http://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/)
HDInsight on-demand cluster cores within a subscription <sup>2</sup> | 48 | [Contact support](http://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/)
Retry count for pipeline activity runs | 1000 | MaxInt (32 bit)

<sup>1</sup> Pipeline, dataset, and linked service objects represent a logical grouping of your workload. Limits for these objects do not relate to amount of data you can move and process with the Azure Data Factory service. Data factory is designed to scale to handle petabytes of data.

<sup>2</sup>On-demand HDInsight cores are allocated out of the subscription that contains the data factory. As a result, the above limit is the Data Factory enforced core limit for on-demand HDInsight cores and is different from the core limit associated with your Azure subscription.


**Resource** | **Default lower limit** | **Minimum limit**
-------- | ------------------- | -------------
Scheduling interval | 15 minutes | 5 minutes
Interval between retry attempts | 1 second | 1 second
Retry timeout value | 1 second | 1 second


### Web service call limits

Azure resource manager has limits for API calls. You can make API calls at a rate within the [Azure Resource Manager API limits](azure-subscription-service-limits/#resource-group-limits). 


