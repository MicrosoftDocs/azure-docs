---
title: HDInsight Interactive Query Autoscale(bchedule-based) guide and best practices
description: LLAP Autoscale Guide and Best Practices 
ms.service: hdinsight
ms.topic: quickstart
author: yeturis
ms.author: sairamyeturi
ms.date: 06/22/2023
---

# Azure HDInsight interactive query cluster (Hive LLAP) schedule based autoscale

This document provides the onboarding steps to enable schedule-based autoscale for Interactive Query (LLAP) Cluster type in Azure HDInsight. It includes some of the best practices to operate Autoscale in Hive-LLAP.

## **Supportability**

- Autoscale isn't supported in HDI 3.6 Interactive Query(LLAP) cluster.  
- HDI 4.0 Interactive Query Cluster supports only Schedule-Based Autoscale. 

Feature Supportability with HDInsight 4.0 Interactive Query(LLAP) Autoscale

| Feature  | Schedule-Based Autoscale  |
|:---:|:---:|
| Work Load Management   | NO  |
| Hive Warehouse Connector   | Yes  |
| Manually Installed LLAP  | NO  |

> [!WARNING]  
> Behaviour of the scheduled autoscale isn't deterministic, If there are other services installed on the HDI Interactive Query Cluster which utilizes the YARN resources. 

### **Interactive Query Cluster setup for Autoscale**

1. [Create an HDInsight Interactive Query Cluster.](../hdinsight-hadoop-provision-linux-clusters.md)
2. Post successful creation of cluster, navigate to **Azure Portal** and apply the recommended Script Action

```
- Script Action: https://hdiconfigactions2.blob.core.windows.net/update-ambari-configs-for-llap-autoscale/update_ambari_configs.sh
- Requried Parameters:<MAX CONCURRENT QUERIES> <TEZ Queue Capacity Percent> 
    - <MAX CONCURRENT QUERIES> is a parameter that sets the max concurrent queries to run, it should be set to the max largest worker node count out of the schedules. 
    - <TEZ Queue Capacity Percent> The configurations below in the example are calculated based on D14v2 worker node SKU (100GB per yarn node) I.e., we are allocating 6% (6GB) per node to launch at least one TEZ AM which is of 4GB. If we are using smaller SKU worker nodes, the above configs need to be tuned proportionately. We need to allocate enough capacity for at least one TEZ AM to run on each node. Please refer to HDInsight Interactive Query Cluster(LLAP) sizing guide | Microsoft Docs for more details.   

- Details:
    Above script action will update the Interactive Query cluster with the following:
    1. Configure a separate Tez queue to launch Tez Sessions. If no arguments are passed, we would configure Default Max Concurrency as 16 and Tez Queue Capacity as 6% of the overall cluster capacity. 
    2. Tunes hive configs for autoscale. 
    3. Sets the max concurrent queries can run in parallel.  
- Example: https://hdiconfigactions2.blob.core.windows.net/update-ambari-configs-for-llap-autoscale/update_ambari_configs.sh  21 6

```

3. [Enable and Configure Schedule-Based Autoscale](../hdinsight-autoscale-clusters.md#create-a-cluster-with-schedule-based-autoscaling)


> [!NOTE]  
> It's recommended to have sufficient gap between two schedules so that data cache is efficiently utilized i.e schedule scale up's when there is peak usage and scale down's when there is no usage. 

### **Interactive Query Autoscale FAQs**

<b>1. What happens to the running jobs during the scale-down operation as per configured schedule? </b>

If there are running jobs while scale-down is triggered, then we can expect one of the following outcomes
- Query fails due to Tez AM getting killed. 
- Query slows down due to capacity reduced but completes successfully. 
- Query completes successfully without any impact. 
 

> [!NOTE]  
> It is recommended to plan approprite down time with the users during the scale down schedules. 


<b>2. What happens to the running Spark jobs when using Hive Warehouse Connector to execute queries in the LLAP Cluster with Auto scale enabled?</b>

If there are running jobs(triggered from Spark Cluster) while scale-down is triggered, then we can expect one of the following outcomes. 
- Spark Job fails due to the failure of JDBC calls from spark driver level caused by loss of Tez AMs or containers 
- Spark Job slows down due to capacity reduced but completes successfully. 
- Spark Job complete successfully without any impact. 

<b>3. Why is my query running slow even after scale-up?</b>

As the Autoscale Smart probe add/remove worker nodes as part of autoscale, LLAP data cache on newly added worker nodes would require warming up after scale-up. First query on a given dataset might be slow due to cache-misses but the subsequent queries would run fast. It's recommended to run some queries on performance critical tables after scaling to warm up the data cache (Optional). 


<b>4. Does schedule based autoscale support Workload Management in LLAP?</b> 

Workload Management in LLAP isn't supported with Schedule Based Autoscale as of now. However you schedule with a custom cron job to disable and enable WLM once the scaling action is done. 
Disabling the WLM should be before the actual schedule of the scaling event and enabling should be 1 hour after the scaling event. Here, user/admin should come up with a different WLM resource plan that suits their cluster size after the scale. 


<b>5. Why do we observe stale hive configs in the Ambari UI after the scaling has happened?</b>

Each time the Interactive Query cluster scales, the Autoscale smart probe would perform a silent update of the number of LLAP Daemons and the Concurrency in the Ambari since these configurations are static. 
These configs are updated to make sure if autoscale is in disabled state or LLAP Service restarts for some reason. It utilizes all the worker nodes resized at that time. Explicit restart of services to handle these stale config changes isn't required.

### **Next steps**
If the above guidelines didn't resolve your query, visit one of the following.

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).  

## **Other references:**
  * [Interactive Query in Azure HDInsight](./apache-interactive-query-get-started.md)
  * [Create a cluster with Schedule-based Autoscaling](./apache-interactive-query-get-started.md)
  * [Azure HDInsight Interactive Query Cluster (Hive LLAP) sizing guide](./hive-llap-sizing-guide.md)
  * [Hive Warehouse Connector in Azure HDInsight](./apache-hive-warehouse-connector.md)
