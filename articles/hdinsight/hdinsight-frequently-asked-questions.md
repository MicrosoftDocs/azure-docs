---
title: Azure HDInsight frequently asked questions
description: Frequently asked questions about HDInsight
keywords: frequently asked questions, faq
author: v-thepet
ms.author: v-thepet
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 09/20/2019
---

# Azure HDInsight: Frequently asked questions

This article provides answers to some of the most common questions about running [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/).

## Creating or deleting HDInsight clusters

### How do I provision an HDInsight cluster?

To review various types of HDInsight clusters that you can install and the available installation methods, see [Set up clusters in HDInsight with Apache Hadoop, Apache Spark, Apache Kafka, and more](hdinsight-hadoop-provision-linux-clusters.md)

### How do I delete an existing HDInsight cluster?

To learn more about deleting a cluster when it's no longer in use, see [Delete HDInsight clusters](hdinsight-delete-cluster.md).

Leave at least 30 to 60 minutes between create and delete operations. Otherwise the operation may fail with the following error message:

**Conflict (HTTP Status Code: 409) error when attempting to delete a cluster immediately after creation of a cluster. If you encounter this error, please wait until the newly created cluster is in operational state before attempting to delete it.**

### How can I pick the right number of cores or nodes for my workload?

The number of cores and other configuration may depend on various factors, but [HDInsight capacity planning](hdinsight-capacity-planning.md) can provide some information to get you started.

### What can I do if provisioning fails due to a capacity issue?

Quotas are applied per resource group, subscription, account, and other scopes. For example, your subscription may be configured to limit the number of cores for a region. If you attempt to deploy a virtual machine with more cores than the permitted amount, you receive an error stating the quota has been exceeded.

- **Error: The deployment would exceed the quota of '800'**
  
  Azure has a quota limit of 800 deployments per resource group. To resolve this issue, delete deployments that are no longer needed, by using the Azure portal, CLI, or PowerShell. For more information, see [Resolve errors for resource quotas](/azure/azure-resource-manager/resource-manager-quota-errors).
  
- **Error: The maximum node exceeded the available cores in this region**
  
  Your subscription may be configured to limit the number of cores for a region. If you attempt to deploy a resource with more cores than the permitted amount, you receive an error stating the quota has been exceeded.
  
  To request a quota increase, follow these steps:
  
  1. Go to the [Azure portal](https://portal.azure.com), and select **Help + support**.
     
  1. Select **New support request**
     
  1. On the **Basics** tab of the **New support request** page, provide the following information:
     
     - **Issue type:** Select **Service and subscription limits (quotas)**
     - **Subscription:** Select the subscription you want to modify
     - **Quota type:** Select **HDInsight**

For more information, see [Create a support ticket to increase core](hdinsight-capacity-planning.md#quotas).

### What are the various types of nodes in an HDInsight cluster?

Azure HDInsight clusters have different types of virtual machines, or nodes. Each node type plays a role in the operation of the system. For more information, see:

- [Resource types in Azure HDInsight clusters](hdinsight-virtual-network-architecture.md#resource-types-in-azure-hdinsight-clusters).
- The blog post [https://blogs.msdn.microsoft.com/azuredatalake/2017/03/10/nodes-in-hdinsight/](https://blogs.msdn.microsoft.com/azuredatalake/2017/03/10/nodes-in-hdinsight/)

## Individual components

### Can I install additional components on my cluster?

Yes, you can install additional components or customize cluster configuration by:

- Using scripts during or after creation. Such scripts are invoked via **Script Action**, which is a configuration option that can be used from the Azure portal, HDInsight Windows PowerShell cmdlets, or the HDInsight .NET SDK.
- Using `sudo` or other methods after the cluster is provisioned.
- Using [HDInsight Application Platform](https://azure.microsoft.com/services/hdinsight/partner-ecosystem/) to install ecosystem applications.

> [!NOTE]
> Microsoft support teams support only:
> 
> - Issues or errors that occur when loading a script. Any errors during the execution of custom scripts are outside the scope of a support ticket.
>   
> - Some additional applications that are part of the cluster creation process. For a list of supported components, see [What are the Apache Hadoop components and versions available with HDInsight?](hdinsight-component-versioning.md#apache-hadoop-components-available-with-different-hdinsight-versions). Support for individual components can vary by cluster type. For example, Spark is not supported on a Kafka cluster and vice-versa.
>   
>   For applications and services outside of the cluster creation process, contact the vendor or service provider for support. You can also use many community support sites. Examples are the [MSDN forum for HDInsight](https://social.msdn.microsoft.com/Forums/azure/home?forum=hdinsight) and [Stack Overflow](https://stackoverflow.com/). Apache projects also have project sites on the [Apache website](https://apache.org/). An example is [Hadoop](https://hadoop.apache.org/). For more information about Azure support, see the [Azure Support FAQ](https://azure.microsoft.com/support/faq/).

### Can I upgrade the individual components that came pre-installed on the cluster?

You may be able to upgrade built-in components or applications that comes pre-installed on your cluster, if you have root access. However, upgrading built-in components isn't supported by Microsoft, because these are not tested configurations. Instead, consider using a HDInsight cluster with a different version that may already have the upgraded component pre-installed.

For example, upgrading Hive as an individual component isn't a supported scenario, because HDInsight is a managed service, and many services are integrated with Ambari Server and tested. Upgrading will cause indexed binaries of the other components to change, and this in turn will lead to many integration issues in the cluster.

### Why does the Hive version show as 1.2.1000 instead of 2.1 in Ambari, although I'm running HDInsight 3.6?

Although only Hive 1.2 appears in the Ambari UI, HDInsight 3.6 contains both Hive 1.2 and Hive 2.1.

### Can Spark and Kafka run on the same HDInsight cluster?

No, it's not possible to run Apache Kafka and Apache Spark on the same HDInsight cluster. You should create separate clusters for Kafka and Spark to avoid resource contention issues.

### How can I change timezone in Ambari?

Go to Ambari settings and select **Timezone**. 

## Metastore

### How can I migrate from the existing metastore to Azure SQL Server?

See [Tutorial: Migrate SQL Server to a single database or pooled database in Azure SQL Database](/azure/dms/tutorial-sql-server-to-azure-sql) for information on migrating from custom SQL Server to Azure SQL Server.

### Will the Hive metastore be deleted when the cluster is deleted?

It depends on the type of metastore that your cluster is configured to use.

- The **default metastore** is part of the cluster lifecycle. When you delete a cluster, the corresponding metastore and metadata are also deleted.
- For a **custom metastore**, the lifecycle of the metastore is not tied to a cluster's lifecycle, so you can create and delete clusters without losing metadata. Metadata such as your Hive schemas will persist even after you delete and re-create the HDInsight cluster.

For more information, see [Use external metadata stores](hdinsight-use-external-metadata-stores.md).

### Does migrating the Hive metastore also migrate default policies of Ranger databases?

No, the policy definition is in the Ranger database, so migrating the Ranger database will migrate its policy.

### Can you migrate the Hive metastore from an ESP to non-ESP cluster, and vice-versa?

Yes, that should not be a problem.

### How can I estimate the size of the Hive metastore database?

The Hive metastore stores the metadata for datasources used by the Hive server. The size requirements depend partly on the number and complexity of your Hive data sources, and can't be estimated up front. As outlined in the [best practices document](hdinsight-use-external-metadata-stores.md#hive-metastore-best-practices), you can start with a S2 tier, which provides 50 DTU and 250 GB of storage, and if you see a bottleneck, you can scale up the database.

### Do you support any other database beyond Azure SQL Database as an external metastore?

No, HDInsight only supports Azure SQL Database as an external custom metastore.

### Can I share metastores across multiple clusters?

Yes, you can share custom metastores with multiple clusters, as long as they are using the same version of HDInsight.

## Connectivity and virtual networks 

### What are the implications of blocking port 22 and 23 on my network?

Microsoft connects over ports 22 and 23 and the public IP of the head node to do the following operations:

- Apply security patches at the OS level
- Monitor the health of the cluster by telemetry, and take remedial actions when needed
- Auto scale, where configured

When you block ports 22 and 23, Microsoft can't perform these operations, so this limits the supportability of the cluster. These ports are also used for SSH, and blocking them can limit your ability to troubleshoot problems on the cluster. A better approach would be deploy your cluster into a virtual network and use *network security groups* (NSGs) to limit public access. For more information, see the following documents:

- [Control network traffic](hdinsight-plan-virtual-network-deployment.md#networktraffic)
- [Secure incoming traffic to HDInsight clusters in a virtual network with a private endpoint](https://azure.microsoft.com/en-in/blog/secure-incoming-traffic-to-hdinsight-clusters-in-a-vnet-with-private-endpoint/)
- [HDInsight management IP addresses](hdinsight-management-ip-addresses.md)

### Can I deploy an additional VM within the same subnet as an HDInsight cluster?

Yes, you can:

- Add an additional *edge node* to the cluster, following the procedure at [Use edge nodes](hdinsight-apps-use-edge-node.md).
- Add a *standalone VM* to the same subnet, and access the cluster from that VM using the private endpoint. For more information, see [Network traffic](hdinsight-plan-virtual-network-deployment.md#networktraffic).

### Can I add an existing HDInsight cluster into another virtual network?

No, you can't. The virtual network should be specified at the time of provisioning. If no virtual network is specified during provisioning, the deployment creates an internal network that isn't accessible from outside. For more information, see [Add HDInsight to an existing virtual network](hdinsight-plan-virtual-network-deployment.md#existingvnet).

## Security and certificates

### What are the recommendations for malware protection on Azure HD insight clusters?

See [Microsoft Antimalware for Azure cloud Services and Virtual Machines](/azure/security/fundamentals/antimalware) for guidance.

### How do I create a keytab for an HDInsight ESP cluster?

Create a Kerberos keytab for your domain username. You can later use this keytab to authenticate to remote domain-joined clusters without entering a password. Note that the domain name is uppercase:

```cmd

ktutil
ktutil: addent -password -p <username>@<DOMAIN.COM> -k 1 -e RC4-HMAC
Password for <username>@<DOMAIN.COM>: <password>
ktutil: wkt <username>.keytab
ktutil: q
```

### Can I use an existing Azure Active Directory tenant to create an HDInsight cluster with ESP?

You must enable Azure Active Directory Domain Services (Azure AD DS) before you can create an HDInsight cluster with ESP.

Open-source Hadoop relies on Kerberos, as opposed to OAuth, for authentication. To join VMs to a domain, you must have a domain controller. Azure AD DS is the managed domain controller, and is considered an extension of Azure Active Directory that provides all the Kerberos requirements to build a secure Hadoop cluster in a managed way. HDInsight as a managed service integrates with Azure AD DS to provide end-to-end security.

### Can I use a self-signed certificate in Azure AD DS to secure LDAP setup and provision an ESP cluster?

Using a certificate issued by a certificate authority is recommended, but using a self-signed certificate is also supported on ESP. For more information, see:

- [Enable Azure Active Directory Domain Services](../domain-joined/apache-domain-joined-configure-using-azure-adds.md#enable-azure-ad-ds)
- [Tutorial: Configure secure LDAP for an Azure Active Directory Domain Services managed domain](/azure/active-directory-domain-services/tutorial-configure-ldaps).

### How can I pull login activity shown in Ranger?

For auditing requirements, you can enable [Azure Monitor logs](hdinsight-hadoop-oms-log-analytics-tutorial.md).

### Can I disable Clamscan on my cluster?

Clamscan is the antivirus software that runs on the HDInsight cluster and is used by Azure security (*azsecd*) to protect your clusters from virus attacks. Clamscan doesn't interfere or take any cycles away from other processes, and will always yield to other processes. You should only see CPU spikes from Clamscan when the system is idle. It's strongly discouraged to make any changes to the default Clamscan configuration. 

In scenarios where you need to control the Clamscan schedule, use the following steps:

1. Disable automatic execution using the following command:
   
   `/usr/local/vbin/azsecd config -s clamav -d Disabled`
   
1. Add a Cron job that runs the following command as root:
   
   `/usr/local/bin/azsecd manual -s clamav`

For more information about how to set up and run a Cron job, see [How do I set up a Cron job](https://askubuntu.com/questions/2368/how-do-i-set-up-a-cron-job). 

## Storage

### Can I add Azure Data Lake Storage Gen2 to an existing HDInsight cluster as an additional storage account?

No, it's currently not possible to add an Azure Data Lake Storage Gen2 storage account to a cluster that has blob storage as its primary storage. For more information, see [Compare storage options](hdinsight-hadoop-compare-storage-options.md).

### How can I find my currently linked Service Principal for a Data Lake Storage Gen1 account?

You can find your settings in **Data Lake Storage Gen1 access** under your cluster properties in the Azure portal. For more information, see [Verify cluster setup](/azure/data-lake-store/data-lake-store-hdinsight-hadoop-use-portal#verify-cluster-set-up).

### How can I calculate the usage of storage accounts and blob containers for my HDInsight clusters?

You can do one of the following:

- Use [PowerShell](/azure/storage/scripts/storage-blobs-container-calculate-size-powershell).
  
- Find the size of the */user/hive/.Trash/* folder on the HDInsight cluster, using the following command line:
  `hdfs dfs -du -h /user/hive/.Trash/`

### How can I set up auditing for my blob storage account?

To audit blob storage accounts, configure monitoring using the procedure at [Monitor a storage account in the Azure portal](/azure/storage/common/storage-monitor-storage-account). Note that the HDFS audit log provides auditing information for the local *hdfs://mycluster* file system only, and doesn't include operations done on remote storage.

### How can I transfer files between a blob container and an HDInsight head node?

Run a shell script similar to the following on your head node:

```shell
for i in cat filenames.txt
do
   hadoop fs -get $i <local destination>
done
```

> [!NOTE]
> *Filenames.txt* should have the absolute paths of the files in the blob containers.

### Are there any Ranger plugins for storage?

Currently, no Ranger plugin exists for blob storage and Azure Data Lake Storage Gen1 or Gen2. For ESP clusters, you should use Azure Data Lake Storage, because you can at least set fine-grain permissions manually at the file system level using HDFS tools. Also, when using Azure Data Lake Storage, ESP clusters will do some of the file system access control using Azure Active Directory at the cluster level. 

You can assign data access policies to your users' security groups by using the Azure Storage Explorer. For more information, see:

- [How do I set permissions for Azure AD users to query data in Data Lake Storage Gen2 by using Hive or other services?](hdinsight-hadoop-use-data-lake-storage-gen2.md#how-do-i-set-permissions-for-azure-ad-users-to-query-data-in-data-lake-storage-gen2-by-using-hive-or-other-services)
- [Set file and directory level permissions using Azure Storage Explorer with Azure Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-how-to-set-permissions-storage-explorer)

### Can I increase HDFS storage on a cluster, without increasing the disk size of worker nodes?

No, you can't increase the disk size of any worker node, so the only way to increase disk size is to drop the cluster and recreate it with larger worker VMs. You shouldn't use HDFS for storing any of your HDInsight data, because the data is deleted if you delete your cluster. Instead, store your data in Azure. Scaling up the cluster can also add additional capacity to your HDInsight cluster.

## Edge nodes

### Can I add an edge node after the cluster has been created?

Yes, you can add an empty edge node to an existing HDInsight cluster, or to a new cluster when creating the cluster. For more information, see [Use empty edge nodes on Apache Hadoop clusters in HDInsight](hdinsight-apps-use-edge-node.md).

### How can I connect to an edge node?

After you create an edge node, you can connect to it by using SSH on port 22. You can find the name of the edge node from the cluster portal. The names usually end with *-ed*.

### Why are persisted scripts not running automatically on newly created edge nodes?

You use persisted scripts to customize new worker nodes added to the cluster through scaling operations. Persisted scripts don't apply for edge nodes.

## REST API

### What are the REST API calls to pull Tez query views from the cluster?

You can use the following REST endpoints to pull the necessary information in JSON format. Use basic authentication headers to make the requests.

- Tez Query View: *https:\//\<cluster name>.azurehdinsight.net/ws/v1/timeline/HIVE_QUERY_ID/*
- Tez Dag View: *https:\//\<cluster name>.azurehdinsight.net/ws/v1/timeline/TEZ_DAG_ID/*

### How can I retrieve the config details from the HDI cluster using my Azure Active Directory user?

To be able to negotiate proper auth tokens with your Azure Active Directory user, you will need to go through the gateway using the following format:

*https://\<cluster dnsname>.azurehdinsight.net/api/v1/clusters/<cluster_name>/stack_versions/1/repository_versions/1*

### How can I use Ambari Restful API to monitor YARN performance?

If you call the Curl command in the same VNet or a peered VNet, the command is:

```curl
curl -u <cluster login username> -sS -G`
http://<headnodehost>:8080/api/v1/clusters/<ClusterName>/services/YARN/components/NODEMANAGER?fields=metrics/cpu
```
If you call the command from outside the VNet or from a non-peered VNet, the command format is:

- For a non-ESP cluster:
  
  ```curl
  curl -u <cluster login username> -sS -G 
  https://<ClusterName>.azurehdinsight.net/api/v1/clusters/<ClusterName>/services/YARN/components/NODEMANAGER?fields=metrics/cpu
  ```

- For an ESP cluster:
  
  ```curl
  curl -u <cluster login username>-sS -G 
  https://<ClusterName>.azurehdinsight.net/api/v1/clusters/<ClusterName>/services/YARN/components/NODEMANAGER?fields=metrics/cpu
  ```

> [!NOTE]
> Curl will prompt for a password, and you need to enter a valid password for \<cluster login username>.

## Billing

### How much does it cost to deploy an HDInsight cluster?

For information on pricing and billing, see [Pricing details](https://azure.microsoft.com/pricing/details/hdinsight/).

### For Pay as you go subscriptions, what happens after I cancel or suspend my subscription?

For information, see [How to cancel an Azure subscription](/azure/billing/billing-how-to-cancel-azure-subscription).

## Other FAQs

### What real-time stream processing capabilities does HDInsight offer?

For information about integration capabilities of stream processing in Azure HDinsight, see [Choosing a stream processing technology in Azure](/azure/architecture/data-guide/technology-choices/stream-processing).

### Is there a way to dynamically terminate the head node of a cluster when the cluster is idle for a specific period?

You can't do this with HDInsight clusters. You can use Azure Data Factory for these scenarios.

