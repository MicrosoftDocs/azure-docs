---
title: Create HBase clusters in a Virtual Network - Azure 
description: Get started using HBase in Azure HDInsight. Learn how to create HDInsight HBase clusters on Azure Virtual Network.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive, devx-track-extended-java
ms.date: 10/16/2023
---

# Create Apache HBase clusters on HDInsight in Azure Virtual Network

Learn how to create Azure HDInsight Apache HBase clusters in an [Azure Virtual Network](https://azure.microsoft.com/services/virtual-network/).

With virtual network integration, Apache HBase clusters can be deployed to the same virtual network as your applications so that applications can communicate with HBase directly. The benefits include:

* Direct connectivity of the web application to the nodes of the HBase cluster, which enables communication via HBase Java remote procedure call (RPC) APIs.
* Improved performance by not having your traffic go over multiple gateways and load-balancers.
* The ability to process sensitive information in a more secure manner without exposing a public endpoint.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create Apache HBase cluster into virtual network

In this section, you create a Linux-based Apache HBase cluster with the dependent Azure Storage account in an Azure virtual network using an [Azure Resource Manager template](../../azure-resource-manager/templates/deploy-powershell.md). For other cluster creation methods and understanding the settings, see [Create HDInsight clusters](../hdinsight-hadoop-provision-linux-clusters.md). For more information about using a template to create Apache Hadoop clusters in HDInsight, see [Create Apache Hadoop clusters in HDInsight using Azure Resource Manager templates](../hdinsight-hadoop-create-linux-clusters-arm-templates.md)

> [!NOTE]  
> Some properties are hard-coded into the template. For example:
>
> * **Location**: East US 2
> * **Cluster version**: 3.6
> * **Cluster worker node count**: 2
> * **Default storage account**: a unique string
> * **Virtual network name**: CLUSTERNAME-vnet
> * **Virtual network address space**: 10.0.0.0/16
> * **Subnet name**: subnet1
> * **Subnet address range**: 10.0.0.0/24
>
> `CLUSTERNAME` is replaced with the cluster name you provide when using the template.

1. Select the following image to open the template in the Azure portal. The template is located in [Azure quickstart templates](https://azure.microsoft.com/resources/templates/hdinsight-hbase-linux-vnet/).

   <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.hdinsight%2Fhdinsight-hbase-linux-vnet%2Fazuredeploy.json" target="_blank"><img src="./media/apache-hbase-provision-vnet/hdi-deploy-to-azure1.png" alt="Deploy to Azure button for new cluster"></a>

1. From the **Custom deployment** dialog, select **Edit template**.

1. On line 165, change value `Standard_A3` to `Standard_A4_V2`. Then select **Save**.

1. Complete the remaining template with the following information:

    |Property |Value |
    |---|---|
    |Subscription|Select an Azure subscription used to create the HDInsight cluster, the dependent Storage account and the Azure virtual network.|
    Resource group|Select **Create new**, and specify a new resource group name.|
    |Location|Select a location for the resource group.|
    |Cluster Name|Enter a name for the Hadoop cluster to be created.|
    |Cluster Login User Name and Password|The default User Name is **admin**. Provide a password.|
    |Ssh User Name and Password|The default User Name is **sshuser**.  Provide a password.|

    Select **I agree to the terms and the conditions**.

1. Select **Purchase**. It takes about around 20 minutes to create a cluster. Once the cluster is created, you can select the cluster in the portal to open it.

After you complete the article, you might want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use. For the instructions of deleting a cluster, see [Manage Apache Hadoop clusters in HDInsight by using the Azure portal](../hdinsight-administer-use-portal-linux.md#delete-clusters).

To begin working with your new HBase cluster, you can use the procedures found in [Get started using Apache HBase with Apache Hadoop in HDInsight](./apache-hbase-tutorial-get-started-linux.md).

## Connect to the Apache HBase cluster using Apache HBase Java RPC APIs

### Create a virtual machine

Create an infrastructure as a service (IaaS) virtual machine into the same Azure virtual network and the same subnet. For instructions on creating a new IaaS virtual machine, see [Create a Virtual Machine Running Windows Server](../../virtual-machines/windows/quick-create-portal.md). When following the steps in this document, you must use the following values for the Network configuration:

* **Virtual network**: CLUSTERNAME-vnet
* **Subnet**: subnet1

> [!IMPORTANT]  
> Replace `CLUSTERNAME` with the name you used when creating the HDInsight cluster in previous steps.

By using these values, the virtual machine is placed in the same virtual network and subnet as the HDInsight cluster. This configuration allows them to directly communicate with each other. There is a way to create an HDInsight cluster with an empty edge node. The edge node can be used to manage the cluster.  For more information, see [Use empty edge nodes in HDInsight](../hdinsight-apps-use-edge-node.md).

### Obtain fully qualified domain name

When you use a Java application to connect to HBase remotely, you must use the fully qualified domain name (FQDN). To determine, you must get the connection-specific DNS suffix of the HBase cluster. To do that, you can use one of the following methods:

* Use a Web browser to make an [Apache Ambari](https://ambari.apache.org/) call:

    Browse to `https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/hosts?minimal_response=true`. It returns a JSON file with the DNS suffixes.

* Use the Ambari website:

    1. Browse to `https://CLUSTERNAME.azurehdinsight.net`.
    2. Select **Hosts** from the top menu.

* Use Curl to make REST calls:

    ```bash
    curl -u <username>:<password> -k https://CLUSTERNAME.azurehdinsight.net/ambari/api/v1/clusters/CLUSTERNAME.azurehdinsight.net/services/hbase/components/hbrest
    ```

In the JavaScript Object Notation (JSON) data returned, find the "host_name" entry. It contains the FQDN for the nodes in the cluster. For example:

```json
"host_name" : "hn*.hjfrnszlumfuhfk4pi1guh410c.bx.internal.cloudapp.net"
```

The portion of the domain name beginning with the cluster name is the DNS suffix. For example, `hjfrnszlumfuhfk4pi1guh410c.bx.internal.cloudapp.net`.

### Verify communication inside virtual network

To verify that the virtual machine can communicate with the HBase cluster, use the command `ping headnode0.<dns suffix>` from the virtual machine. For example, `ping hn*.hjfrnszlumfuhfk4pi1guh410c.bx.internal.cloudapp.net`.

To use this information in a Java application, you can follow the steps in [Use Apache Maven to build Java applications that use Apache HBase with HDInsight (Hadoop)](./apache-hbase-build-java-maven-linux.md) to create an application. To have the application connect to a remote HBase server, modify the **hbase-site.xml** file in this example to use the FQDN for Zookeeper. For example:

```xml
<property>
    <name>hbase.zookeeper.quorum</name>
    <value>zookeeper0.<dns suffix>,zookeeper1.<dns suffix>,zookeeper2.<dns suffix></value>
</property>
```

> [!NOTE]  
> For more information about name resolution in Azure virtual networks, including how to use your own DNS server, see [Name Resolution (DNS)](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

## Next steps

In this article, you learned how to create an Apache HBase cluster. To learn more, see:

* [Get started with HDInsight](../hadoop/apache-hadoop-linux-tutorial-get-started.md)
* [Use empty edge nodes in HDInsight](../hdinsight-apps-use-edge-node.md)
* [Configure Apache HBase replication in HDInsight](apache-hbase-replication.md)
* [Create Apache Hadoop clusters in HDInsight](../hdinsight-hadoop-provision-linux-clusters.md)
* [Get started using Apache HBase with Apache Hadoop in HDInsight](./apache-hbase-tutorial-get-started-linux.md)
* [Virtual Network Overview](../../virtual-network/virtual-networks-overview.md)
