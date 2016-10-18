<properties
   	pageTitle="Secure HDInsight Overview| Microsoft Azure"
   	description="Learn ...."
   	services="hdinsight"
   	documentationCenter=""
   	authors="mumian"
   	manager="jhubbard"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="hero-article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="10/11/2016"
   	ms.author="jgao"/>

# Introduce Domain-joined HDInsight clusters (Preview)

Azure HDInsight until today supported only a single user local admin. This works great for smaller application teams or departments. As Hadoop based workloads gained more popularity in the enterprise sector, the need for enterprise grade capabilities like active directory based authentication, multi-user support, and role based access control became increasingly important. Using Domain-joined HDInsight clusters, you can create an HDInsight cluster joined to an Active Directory domain, configure a list of employees from the enterprise who can authenticate through Azure Active Directory to log on to HDInsight cluster. Anyone outside the enterprise cannot log on or access the HDInsight cluster. The enterprise admin can configure role based access control for HiveServer2 security using [Apache Ranger](http://hortonworks.com/apache/ranger/), thus restricting access to data to only as much as needed. Finally, the admin can audit the data access by employees, and any changes done to access control policies, thus achieving a high degree of governance of their corporate resources.

[AZURE.NOTE]> the new features described in this preview are available only on Linux-based HDInsight clusters for HiveServer2 workload. The other workloads, such as HBase, Spark, Storm and Kafka, will be enabled in future releases. 

## Benefits

Enterprise Security contains four big pillars – Perimeter Security, Authentication, Authorization, and Encryption.

### Perimeter Security

Perimeter security in HDInsight is achieved using virtual networks and Gateway service. Today, an enterprise admin can create an HDInsight cluster inside a virtual network and use Network Security Groups (inbound or outbound firewall rules) to restrict access to the virtual network. Only the IP addresses defined in the inbound firewall rules will be able to communicate with the HDInsight cluster, thus providing perimeter security. Another layer of perimeter security is achieved using Gateway service. The Gateway is the service which acts as first line of defense for any incoming request to the HDInsight cluster. It accepts the request, validates it and only then allows the request to pass to the other nodes in cluster, thus providing perimeter security to other name and data nodes in the cluster.

### Authentication

With this public preview, an enterprise admin can provision a Domain-joined HDInsight cluster, in a [virtual network](https://azure.microsoft.com/services/virtual-network/). The nodes of the HDInsight cluster will be joined to the domain managed by the enterprise. This is achieved through use of [Azure Active Directory Domain Services](https://technet.microsoft.com/library/cc770946(v=ws.10).aspx). The HDInsight cluster can be configured with either Azure Storage Blob or Azure Data Lake Storage as the data stores for HDFS. All the nodes in the cluster are joined to a domain that the enterprise manages. With this setup, the enterprise employees can log on to the cluster nodes using their domain credentials. They can also use their domain credentials to authenticate with other approved endpoints like Hue, Ambari Views, ODBC tools, PowerShell and REST APIs to interact with the cluster. The admin has full control over limiting the number of users interacting with the cluster via these endpoints.

### Authorization

A best practice followed by most enterprises is that not every employee has access to all enterprise resources. Likewise, with this release, the admin can define role based access control policies for the cluster resources. For example, the admin can configure Apache Ranger to set access control policies

for the HiveServer2. This functionality ensures that employees will be able to access only as much data as they need to be successful in their jobs. SSH access to the cluster is also restricted only to the administrator.


### Auditing

Along with protecting the HDInsight cluster resources from unauthorized users, and securing the data, auditing of all access to the cluster resources, and the data is necessary to track unauthorized or unintentional access of the resources. With this preview, the admin can view and report all access to the HDInsight cluster resources and data. The admin can also view and report all changes to the access control policies done in Apache Ranger supported endpoints. A Domain-joined HDInsight cluster uses the familiar Apache Ranger UI to search audit logs. On the backend, Ranger uses [Apache Solr]( http://hortonworks.com/apache/solr/) for storing and searching the logs.

### Encryption

Protecting data is important for meeting organizational security and compliance requirements, and along with restricting access to data from unauthorized employees, it should also be secured by encrypting it. Both the data stores for HDInsight clusters, Azure Storage Blob, and Azure Data Lake Storage support transparent server-side [encryption of data](../storage/storage-service-encryption.md) at rest. Secure HDInsight clusters will seamlessly work with this server side encryption of data at rest capability.


## Configure Domain-joined HDInsight clusters

See [Configure Domain-joined HDInsight clusters](hdinsight-domain-joined-config.md).
See [Configure Domain-joined HDInsight clusters using Azure PowerShell](hdinsight-domain-joined-config-powershell.md).

## Run Hive jobs using Domain-joined HDInsight clusters 

See [Run a Hive job using Domain-joined HDInsight clusters](hdinsight-domain-joined-run-hive.md).

## Users of Domain-joined HDInsight clusters

An HDInsight cluster that is not domain-joined has two user accounts that are created during the cluster creation:

- **Ambari admin**: This account is also known as *Hadoop user* or *HTTP user*. This account can be used to logon to Ambari at https://<clustername>.azurehdinsight.net. It can also be used to run queries on Ambari views, execute jobs via external tools (i.e. PowerShell, Templeton, Visual Studio), and authenticate with the Hive ODBC driver and BI tools (i.e. Excel, PowerBI, or Tableau).

- **SSH user**:  This account can be used with SSH, and execute sudo commands. It has root privileges to the Linux VMs.

A domain-joined HDInsight cluster has three new users in addition to Ambari Admin and SSH user.

- Ranger admin:  This accout is the local Apache Ranger admin account. It is not an active directory domain user. This account can be used to setup policies and make other users admins or delegated admins (so that those users can manage policies). By default, the username is -admin- and the password is the same as the Ambari admin password. The password can be updated from the Settings page in Ranger.

- Cluster admin domain user: This account is an active directory domain user designated as the Hadoop cluster admin including Ambari and Ranger. You must provide this user’s credentials during cluster creation. This user has the following privileges:

	- Join machines to the domain and place them within the OU that you specify during cluster creation.
	- Create service principals within the OU that you specify during cluster creation. 
	- Create reverse DNS entries.

	Note the other AD users also have these privileges. 

	There are some end points within the cluster (for example, Templeton) which are not managed by Ranger, and hence are not secure. These end points are locked down for all users except the cluster admin domain user. 

- Regular users: During cluster creation, you can provide multiple active directory groups. The users in these groups will be synced to Ranger and Ambari. These users are domain users and will have access to only Ranger-managed endpoints (for example, Hiveserver2). All the RBAC policies and auditing will be applicable to these users.

## Next steps

- For configuring a Domain-joined HDInsight cluster, see [Configure Domain-joined HDInsight clusters](hdinsight-domain-joined-config.md).
- For configuring Hive policies and run Hive queries, see [Configure Hive policies for Domain-joined HDInsight clusters](hdinsight-domain-joined-run-hive.md).