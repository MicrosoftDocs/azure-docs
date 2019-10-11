---
title: Azure HDInsight - Frequently asked questions
description: Provides an overview of Azure HDInsight
author: Ramakoni1
ms.author: ramakoni
ms.reviewer: v-miegge
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 09/20/2019
---

# Azure HDInsight: Frequently asked questions

This article provides answers to some of the most common questions about how to run [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/).

## Creating or deleting HDInsight clusters

### How do I provision an HDInsight cluster?

To review the types of HDInsight clusters available, and the provisioning methods, see [Set up clusters in HDInsight with Apache Hadoop, Apache Spark, Apache Kafka, and more](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters).

### How do I delete an existing HDInsight cluster?

To learn more about deleting a cluster when it is no longer in use, see [Delete an HDInsight cluster using your browser, PowerShell, or the Azure CLI](https://docs.microsoft.com/azure/hdinsight/hdinsight-delete-cluster). We recommend that there be at least 30 to 60 minutes between the create and delete operation on a single cluster. Otherwise, the operation may fail and return the following error message:

``Conflict (HTTP Status Code: 409) error when attempting to delete a cluster immediately after creation of a cluster. If you encounter this error, wait until the newly created cluster is in operational state before attempting to delete it.``

### How do I select the correct number of cores or nodes for my workload?

The appropriate number of cores and other configuration options depend on various factors.

For more information, see [Capacity planning for HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-capacity-planning).

### What can I do when cluster provisioning fails because of a capacity issue?

Common capacity issue errors and mitigation techniques are provided in this section.

#### Error: The deployment would exceed the quota of '800'

Azure has a quota limit of 800 deployments per resource group. Different quotas are applied per resource group, subscription, account, or other scopes. For example, your subscription may be configured to limit the number of cores for a region. If you try to deploy a virtual machine that has more cores than the permitted amount, you receive an error message that states that the quota was exceeded.

To resolve this issue, delete the deployments that are no longer needed by using the Azure portal, CLI, or PowerShell.

For more information, see [Resolve errors for resource quotas](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-quota-errors).

#### Error: The maximum node exceeded the available cores in this region

Your subscription may be configured to limit the number of cores for a region. If you try to deploy a resource that has more cores than the permitted amount, you receive an error message that states that the quota was exceeded.

To request a quota increase, follow these steps:

1. Go to the Azure portal and select Help + support.
2. Select New support request.
3. On the New support request page, select the following options on the Basics tab:

   * Issue type: Service and subscription limits (quotas)
   * Subscription: The subscription that you want to modify
   * Quota type: HDInsight

For more information, see [Create a support ticket to increase cores](https://docs.microsoft.com/azure/hdinsight/hdinsight-capacity-planning#quotas).

### What are the various types of nodes in an HDInsight cluster?

Azure HDInsight clusters have different types of virtual machines, or nodes. Each node type plays a role in the operation of the system.

For more information, see [Resource types in Azure HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-virtual-network-architecture#resource-types-in-azure-hdinsight-clusters).

## Individual Components

### Can I install additional components on my cluster?

Yes, you can install additional components or customize cluster configuration by using any of the following methods:

* Using scripts during or after creation. Such scripts are invoked through a [script action](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux). This configuration option can be used from the Azure portal, HDInsight Windows PowerShell cmdlets, or the HDInsight .NET SDK. 
* Using sudo or other methods after the cluster is provisioned.
* Using the [HDInsight application platform](https://azure.microsoft.com/services/hdinsight/partner-ecosystem/) to install ecosystem applications.

However, Microsoft Support teams can offer support only for the following situations:

* Issues or errors that occur when loading the script. Any errors that occur during the execution of custom scripts are outside the scope of a support ticket. 
* Additional applications that are part the cluster creation process. 

For a list of supported components see [What are the Apache Hadoop components and versions available with HDInsight?](https://docs.microsoft.com/azure/hdinsight/hdinsight-component-versioning#apache-hadoop-components-available-with-different-hdinsight-versions)

Support for individual components can also vary by cluster type. For example, Spark is not supported on a Kafka cluster, and vice-versa.

For applications or services outside the cluster creation process, contact the respective vendor or service provider for support. You can also use community sites for support for these actions. Many community sites are available. Examples include [MSDN forum for HDInsight](https://social.msdn.microsoft.com/Forums/home?forum=hdinsight) and [Stack Overflow](https://stackoverflow.com/questions/tagged/hdinsight). Apache projects also have project sites on the [Apache website](https://apache.org/). One example is [Hadoop](https://hadoop.apache.org/).

 For more questions that are related to Azure support, review the [Azure Support FAQ](https://azure.microsoft.com/en-us/support/faq/).

### Can I upgrade the individual components that are pre-installed on the cluster?

If you upgrade built-in components or applications that are pre-installed on your cluster, the resulting configuration will not be supported by Microsoft. These system configurations have not been tested by Microsoft. Try to use a different version of the HDInsight cluster that may already have the upgraded version of the component pre-installed.

For example, upgrading Hive as an individual component is not supported. HDInsight is a managed service, and many services are integrated with Ambari server and tested. Upgrading a Hive on its own causes the indexed binaries of other components to change, and will cause component integration issues on your cluster.

### Can Spark and Kafka run on the same HDInsight cluster?

No, it is not possible to run Apache Kafka and Apache Spark on the same HDInsight cluster. Users should create separate clusters for each to avoid resource contention issues.

### How do I change timezone in Ambari?

1. Open the Ambari Web UI at https://CLUSTERNAME.azurehdinsight.net, where CLUSTERNAME is the name of your cluster.
2. In the upper-right corner, select admin | Settings. 

   ![Ambari Settings](media/hdinsight-faq/ambari-settings.png)

3. In the User Settings window, select the new timezone from the Timezone drop down, and then click Save.

   ![Ambari User Settings](media/hdinsight-faq/ambari-user-settings.png)

## Metastore

### How can I migrate from the existing metastore to Azure SQL Server? 

To migrate from SQL Server to Azure SQL Server, see [Tutorial: Migrate SQL Server to a single database or pooled database in Azure SQL Database offline using DMS](https://docs.microsoft.com/azure/dms/tutorial-sql-server-to-azure-sql).

### Is the Hive metastore deleted when the cluster is deleted?

It depends on the type of metastore that your cluster is configured to use.

For a default metastore: The default metastore is part of the cluster lifecycle. When you delete a cluster, the corresponding metastore and metadata are also deleted.

For a custom metastore: The lifecycle of the metastore is not tied to a cluster’s lifecycle. Therefore, you can create and delete clusters without losing metadata. Metadata such as your Hive schemas persists even after you delete and re-create the HDInsight cluster.

For more information, see [Use external metadata stores in Azure HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-use-external-metadata-stores).

### Does migrating a Hive metastore also migrate the default policies of the Ranger database?

No, the policy definition is in the Ranger database. Therefore, migrating the Ranger database does not migrate the policy.

### Can you migrate a Hive metastore from an Enterprise Security Package (ESP) cluster to a non-ESP cluster, and vice-versa?

Yes, you can migrate a Hive metastore from an ESP to a non-ESP cluster.

### How can I estimate the size of a Hive metastore database?

A Hive metastore is used to store the metadata for data sources that are used by the Hive server. Therefore, the size requirements are affected by the number of data sources you may have to use for the Hive and by how complex the data sources are. Therefore, the size cannot be estimated upfront. As outlined in [Hive metastore best practices](https://docs.microsoft.com/azure/hdinsight/hdinsight-use-external-metadata-stores#hive-metastore-best-practices), starting at an S2 tier provides 50 DTU and 250 GB of storage. If you encounter a bottleneck, you can scale up the database.

### Do you support any other database other than Azure SQL Database as an external metastore?

No, Microsoft supports only Azure SQL Database as an external custom metastore.

### Can I share a metastore across multiple clusters?

Yes, you can share custom metastore across multiple clusters as long as they are using the same version of HDInsight.

## Connectivity and virtual networks  

### What are the implications of blocking ports 22 and 23 on my network?

If you block ports 22 and port 23, you will not have SSH access to the cluster. These ports are not used by HDInsight service.

For more information, see the following documents:

* [Controlling Network traffic](https://docs.microsoft.com/azure/hdinsight/hdinsight-plan-virtual-network-deployment#networktraffic)
* [Secure incoming traffic to HDInsight clusters in a virtual network with private endpoint](https://azure.microsoft.com/blog/secure-incoming-traffic-to-hdinsight-clusters-in-a-vnet-with-private-endpoint/)
* [HDInsight management IP addresses](https://docs.microsoft.com/azure/hdinsight/hdinsight-management-ip-addresses)

### Can I deploy an additional virtual machine within the same subnet as an HDInsight cluster?

Yes, you can deploy an additional virtual machine within the same subnet as an HDInsight cluster. The following configurations are possible:

* Edge nodes: You can add another edge node to the cluster, as described in [Use empty edge nodes on Apache Hadoop clusters in HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-apps-use-edge-node). 
* Standalone nodes:  You can add a standalone virtual machine to the same subnet and access the cluster from that virtual machine by using the private end point `https://<CLUSTERNAME>-int.azurehdinsight.net`. For more information, see [Controlling network traffic](https://docs.microsoft.com/azure/hdinsight/hdinsight-plan-virtual-network-deployment#networktraffic).

### Can I add an existing HDInsight cluster to another virtual network?

No, you cannot add an existing HDInsight cluster to another virtual network. The virtual network should be specified at the time of provisioning. If no virtual network is specified during the provisioning, the deployment creates an internal network that is not accessible from outside. For more information, see [Add HDInsight to an existing virtual network](https://docs.microsoft.com/azure/hdinsight/hdinsight-plan-virtual-network-deployment#existingvnet).

## Security and Certificates

What are Microsoft recommendations for malware protection on Azure HD insight clusters?

For information on malware protection, see [Microsoft Antimalware for Azure Cloud Services and Virtual Machines](https://docs.microsoft.com/azure/security/fundamentals/antimalware).

### How do I create a keytab for an HDInsight ESP cluster?

You can create a Kerberos keytab for your domain username. You can later use this keytab to authenticate to remote domain-joined clusters without entering a password. Notice the UPPERCASE characters in the domain name:

```
o ktutil 
o ktutil: addent -password -p stXX@ DOMAIN.COM -k 1 -e RC4-HMAC 
o Password for stXX@DOMAIN.COM: provided by lab instructors 
o ktutil: wkt stXX.keytab 
o ktutil: q
```

### Can I use an existing Azure Active Directory tenant to create an HDInsight cluster that has the ESP?

Enabling Azure Active Directory Domain Services (AAD-DS) is a prerequisite before you can create an HDInsight cluster that has ESP. Open-source Hadoop relies on Kerberos for Authentication (as opposed to OAuth).

To join virtual machines to a domain, a domain controller is required. AAD-DS is the managed domain controller. It is considered an extension of AAD that provides all the Kerberos requirements to build a secure Hadoop cluster in a managed way. HDInsight as a managed service integrates with AAD-DS to provide the end-to-end security.

### Can I use a self-signed certificate in an AAD-DS secure LDAP setup and provision an ESP cluster?

Although using a certificate that is issued by a certificate authority (CA) is recommended, using a self-signed certificate is also supported on ESP.

For more information, see:

* [Enable Azure AD-DS](https://docs.microsoft.com/azure/hdinsight/domain-joined/apache-domain-joined-configure-using-azure-adds#enable-azure-ad-ds)
* [Tutorial: Configure secure LDAP for an Azure Active Directory Domain Services managed domain](https://docs.microsoft.com/azure/active-directory-domain-services/tutorial-configure-ldaps)

### How can I pull login activity shown in Ranger?

For auditing requirements, Microsoft recommends enabling Azure Monitor logs as described in [Use Azure Monitor logs to monitor HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-oms-log-analytics-tutorial).

### Can I disable Clamscan on my cluster?

Clamscan is the antivirus software that runs on the HDInsight cluster and is used by Azure security (azsecd) to protect your clusters from virus attacks. Microsoft strongly recommends that users refrain from making any changes to the default Clamscan configuration.

This process does not interfere with or take any cycles away from other processes. It will always yield to other process. CPU spikes from Clamscan should be seen only when the system is idle.  

In scenarios in which you must control the schedule, you can use the following steps:

1. Disable automatic execution by using the following command:

   ``/usr/local/vbin/azsecd config -s clamav -d Disabled``

2. Create a cron job that runs this command as root:

   ``/usr/local/bin/azsecd manual -s clamav``

For more information about how to set up and run a cron job, see [How do I set up a Cron job](https://askubuntu.com/questions/2368/how-do-i-set-up-a-cron-job)?

## Storage

### Can I add an Azure Data Lake Storage Gen2 to an existing HDInsight cluster as an additional storage account?

No. Currently, you cannot add an Azure Data Lake Storage Gen2 to an existing HDInsight cluster that uses blob storage as its primary storage. For more information, see [Compare storage options for use with Azure HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-compare-storage-options). 

### How can I find the currently linked Service Principal for a Data Lake storage account?

You can verify these settings by reviewing Data Lake Storage Gen1 access under your cluster properties in the portal. For more information, see [Verify Cluster Setup](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-hdinsight-hadoop-use-portal#verify-cluster-set-up).
 
How can I calculate the usage of storage accounts and blob containers for my HDInsight clusters?
You can use one of the following procedures:

* [Use PowerShell](https://docs.microsoft.com/azure/storage/scripts/storage-blobs-container-calculate-size-powershell)
* You can also find the size of the /user/hive/.Trash/ folder on the HDI clusters by using the following command:

   ``hdfs dfs -du -h /user/hive/.Trash/``

### How can I set up auditing for my blob storage account?

To audit blob storage accounts, you have to configuring monitoring for the blob storage account by using the procedure that is documented at [Monitor a storage account in the Azure portal](https://docs.microsoft.com/azure/storage/common/storage-monitor-storage-account). An HDFS-audit log provides only auditing information for the local HDFS filesystem only (hdfs://mycluster).  It does not include operations that are done on remote storage.

### How can I transfer files between a blob container and an HDInsight head node?

You can transfer files between a blob container and an HDInsight head node by running a shell script on your head node, similar to the following example:

```
for i in cat filenames.txt

do
         hadoop fs -get $i <local destination>
done
```
 
> [!NOTE]
> The file *filenames.txt* will have the absolute path of the files in the blob containers.
 
### Are there any Ranger plugins for storage?

Currently, no Ranger plugins exist for blob storage, Azure Data Lake Storage (ADLS) Gen1, or Azure Data Lake Storage Gen2. For ESP clusters, use ADLS as a best practice, and set fine-grain permissions manually at the file system level using HDFS tools. Also, ESP clusters will do some of the file system access control by using AAD at the cluster level when you use ADLS. 

You should be able to use the Azure Storage Explorer to assign data access policies to security groups where your users are located by using the procedures that are documented in the following articles:

* [How do I set permissions for Azure AD users to query data in Data Lake Storage Gen2 by using Hive or other services?](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2#how-do-i-set-permissions-for-azure-ad-users-to-query-data-in-data-lake-storage-gen2-by-using-hive-or-other-services)
* [Set file and directory level permissions using Azure Storage Explorer with Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-how-to-set-permissions-storage-explorer)

### Can I increase HDFS storage on a cluster without increasing the disk size of worker nodes?

No, you cannot increase the disk size of any worker node. The only way to increase the size of the disk is to drop the cluster and re-create it on larger worker virtual machines.

Microsoft does not recommend that you use HDFS to store any of your data in HDInsight because the data gets deleted when you delete the cluster. Instead, we recommend that you store your data in Azure. Scaling up the cluster can also add more capacity to your HDInsight cluster.

## Edge nodes

### Can I add an edge node after the cluster has been created?

Yes, you can add an empty edge node to an existing HDInsight cluster, or to a new cluster when you create the cluster.

For more information, see [Use empty edge nodes on Apache Hadoop clusters in HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-apps-use-edge-node).

### How can I connect to an edge node?

After you create an edge node, you can connect to the edge node using the SSH on port 22. You can find the name of the edge node from the cluster portal (the names generally end in “-ed”).

### Why are persisted scripts not running automatically on newly created edge nodes?

Persisted scripts are used to customize new worker nodes that are added to the cluster through scaling operations and do not apply to edge nodes.

## REST API

### What are the REST API calls to pull a Tez query view from the cluster?

You can use the following REST endpoints to pull the necessary information where the response will be in JSON format. Basic authentication headers can be used to make these requests.

* "Tez Query" view – https://`<cluster name>`.azurehdinsight.net/ws/v1/timeline/HIVE_QUERY_ID/

* "Tez DAG" view - https://`<cluster name>`.azurehdinsight.net/ws/v1/timeline/TEZ_DAG_ID/

### How do I retrieve the configuration details from HDI cluster by using an Azure Active Directory user?

To negotiate proper authentication tokens with your AAD user, go through the gateway by using the following format:

* https://`<cluster dnsname>`.azurehdinsight.net/api/v1/clusters/testclusterdem/stack_versions/1/repository_versions/1 

### How do I use Ambari restful API to monitor YARN performance?

If the curl command is called in the same VNet or peered VNet, use the following command:

``curl -u <cluster login username> -sS -G http://headnodehost:8080/api/v1/clusters/anssenllap/services/YARN/components/NODEMANAGER?fields=metrics/cpu``
 
If the command is called from outside the VNet or a non-peered VNet, the command format is:
 
* For a non-ESP cluster:
   ``curl -u <cluster login username> -sS -G https://ClusterName.azurehdinsight.net/api/v1/clusters/ClusterName/services/YARN/components/NODEMANAGER?fields=metrics/cpu``
 
* For an ESP cluster:
   ``curl -u <cluster login username> -sS -G https://ClusterName.azurehdinsight.net/api/v1/clusters/ClusterName/services/YARN/components/NODEMANAGER?fields=metrics/cpu``

> [!NOTE]
> Curl will prompt you for a password. You must enter a valid password for the cluster login username.

## Billing

### How much does it cost to deploy an HDInsight cluster?

For more information about pricing and FAQ related to billing, see the [Azure HDInsight Pricing](https://azure.microsoft.com/pricing/details/hdinsight/) page.

### How do I cancel my subscription?

For information about how to cancel your subscription, see [Cancel your Azure subscription](https://docs.microsoft.com/azure/billing/billing-how-to-cancel-azure-subscription).

### For pay-as-you-go subscriptions, what happens after I cancel my subscription?

For information about your subscription after it's canceled, see
[What happens after I cancel my subscription?](https://docs.microsoft.com/azure/billing/billing-how-to-cancel-azure-subscription#what-happens-after-i-cancel-my-subscription)

## Hive

### Why does the Hive version appear as 1.2.1000 instead of 2.1 in the Ambari UI even though I am running an HDInsight 3.6 cluster?

Although only 1.2 appears in the Ambari UI, HDInsight 3.6 contains both Hive 1.2 and Hive 2.1.

## Other FAQ

### What does HDInsight offer in terms of real-time stream processing capabilities?

For information about the integration capabilities of stream processing in Azure HDInsight, see [Choosing a stream processing technology in Azure](https://docs.microsoft.com/azure/architecture/data-guide/technology-choices/stream-processing).

### Is there a way to dynamically terminate the head node of the cluster when the cluster is idle for a specific period?

No, you cannot dynamically terminate the head node of the cluster. You can use Azure Data Factory for this scenario.
