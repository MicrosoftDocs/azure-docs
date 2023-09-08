---
title: Connect to HiveServer2 using Beeline or install Beeline locally to connect from your local - Azure HDInsight 
description: Learn how to connect to the Apache Beeline client to run Hive queries with Hadoop on HDInsight. Beeline is a utility for working with HiveServer2 over JDBC.
ms.service: hdinsight
ms.topic: how-to
ms.custom: contperf-fy21q1
ms.date: 06/12/2023
---
# Connect to HiveServer2 using Beeline or install Beeline locally to connect from your local

[Apache Beeline](https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Clients#HiveServer2Clients-Beeline–NewCommandLineShell) is a Hive client that is included on the head nodes of your HDInsight cluster. This article describes how to connect to HiveServer2 using the Beeline client installed on your HDInsight cluster across different types of connections. It also discusses how to [Install the Beeline client locally](#install-beeline-client). 

## Types of connections

### From an SSH session

When connecting from an SSH session to a cluster headnode, you can then connect to the `headnodehost` address on port `10001`:

```bash
beeline -u 'jdbc:hive2://headnodehost:10001/;transportMode=http'
```

### Over an Azure Virtual Network

When connecting from a client to HDInsight over an Azure Virtual Network, you must provide the fully qualified domain name (FQDN) of a cluster head node. Since this connection is made directly to the cluster nodes, the connection uses port `10001`:

```bash
beeline -u 'jdbc:hive2://<headnode-FQDN>:10001/;transportMode=http'
```

Replace `<headnode-FQDN>` with the fully qualified domain name of a cluster headnode. To find the fully qualified domain name of a headnode, use the information in the [Manage HDInsight using the Apache Ambari REST API](../hdinsight-hadoop-manage-ambari-rest-api.md#get-the-fqdn-of-cluster-nodes) document.

### To HDInsight Enterprise Security Package (ESP) cluster using Kerberos

When connecting from a client to an Enterprise Security Package (ESP) cluster joined to Azure Active Directory (AAD)-DS on a machine in same realm of the cluster, you must also specify the domain name `<AAD-Domain>` and the name of a domain user account with permissions to access the cluster `<username>`:

```bash
kinit <username>
beeline -u 'jdbc:hive2://<headnode-FQDN>:10001/default;principal=hive/_HOST@<AAD-Domain>;auth-kerberos;transportMode=http' -n <username>
```

Replace `<username>` with the name of an account on the domain with permissions to access the cluster. Replace `<AAD-DOMAIN>` with the name of the Azure Active Directory (AAD) that the cluster is joined to. Use an uppercase string for the `<AAD-DOMAIN>` value, otherwise the credential won't be found. Check `/etc/krb5.conf` for the realm names if needed.

To find the JDBC URL from Ambari:

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net/#/main/services/HIVE/summary`, where `CLUSTERNAME` is the name of your cluster. Ensure that HiveServer2 is running.

1. Use clipboard to copy the HiveServer2 JDBC URL.

### Over public or private endpoints

When connecting to a cluster using the public or private endpoints, you must provide the cluster login account name (default `admin`) and password. For example, using Beeline from a client system to connect to the `clustername.azurehdinsight.net` address. This connection is made over port `443`, and is encrypted using TLS/SSL.

Replace `clustername` with the name of your HDInsight cluster. Replace `admin` with the cluster login account for your cluster. For ESP clusters, use the full UPN (for example, user@domain.com). Replace `password` with the password for the cluster login account.

```bash
beeline -u 'jdbc:hive2://clustername.azurehdinsight.net:443/;ssl=true;transportMode=http;httpPath=/hive2' -n admin -p 'password'
```

or for private endpoint:

```bash
beeline -u 'jdbc:hive2://clustername-int.azurehdinsight.net:443/;ssl=true;transportMode=http;httpPath=/hive2' -n admin -p 'password'
```

Private endpoints point to a basic load balancer, which can only be accessed from the VNETs peered in the same region. See [constraints on global VNet peering and load balancers](../../virtual-network/virtual-networks-faq.md#what-are-the-constraints-related-to-global-virtual-network-peering-and-load-balancers) for more info. You can use the `curl` command with `-v` option to troubleshoot any connectivity problems with public or private endpoints before using beeline.

### Use Beeline with Apache Spark

Apache Spark provides its own implementation of HiveServer2, which is sometimes referred to as the Spark Thrift server. This service uses Spark SQL to resolve queries instead of Hive. And may provide better performance depending on your query.

#### Through public or private endpoints

The connection string used  is slightly different. Instead of containing `httpPath=/hive2` it uses `httpPath/sparkhive2`. Replace `clustername` with the name of your HDInsight cluster. Replace `admin` with the cluster login account for your cluster. Replace `password` with the password for the cluster login account.
> [!NOTE]
> For ESP clusters, replace `admin` with full UPN (for example, user@domain.com). 

```bash
beeline -u 'jdbc:hive2://clustername.azurehdinsight.net:443/;ssl=true;transportMode=http;httpPath=/sparkhive2' -n admin -p 'password'
```

or for private endpoint:

```bash
beeline -u 'jdbc:hive2://clustername-int.azurehdinsight.net:443/;ssl=true;transportMode=http;httpPath=/sparkhive2' -n admin -p 'password'
```

Private endpoints point to a basic load balancer, which can only be accessed from the VNETs peered in the same region. See [constraints on global VNet peering and load balancers](../../virtual-network/virtual-networks-faq.md#what-are-the-constraints-related-to-global-virtual-network-peering-and-load-balancers) for more info. You can use the `curl` command with `-v` option to troubleshoot any connectivity problems with public or private endpoints before using beeline.

#### From cluster head node or inside Azure Virtual Network with Apache Spark

When connecting directly from the cluster head node, or from a resource inside the same Azure Virtual Network as the HDInsight cluster, port `10002` should be used for Spark Thrift server instead of `10001`. The following example shows how to connect directly to the head node:

```bash
/usr/hdp/current/spark2-client/bin/beeline -u 'jdbc:hive2://headnodehost:10002/;transportMode=http'
```

## Install Beeline client

Although Beeline is included on the head nodes, you may want to install it locally.  The install steps for a local machine are based on a [Windows Subsystem for Linux](/windows/wsl/install-win10).

1. Update package lists. Enter the following command in your bash shell:

    ```bash
    sudo apt-get update
    ```

1. Install Java if not installed. You can check with the `which java` command.

    1. If no java package is installed, enter the following command:

        ```bash
        sudo apt install openjdk-11-jre-headless
        ```

    1. Open the bashrc file (often found in ~/.bashrc): `nano ~/.bashrc`.

    1. Amend the bashrc file. Add the following line at the end of the file:

        ```bash
        export JAVA_HOME=/usr/lib/jvm/java-1.11.0-openjdk-amd64
        ```

        Then press **Ctrl+X**, then **Y**, then enter.

1. Download Hadoop and Beeline archives, enter the following commands:

    ```bash
    wget https://archive.apache.org/dist/hadoop/core/hadoop-2.7.3/hadoop-2.7.3.tar.gz
    wget https://archive.apache.org/dist/hive/hive-1.2.1/apache-hive-1.2.1-bin.tar.gz
    ```

1. Unpack the archives, enter the following commands:

    ```bash
    tar -xvzf hadoop-2.7.3.tar.gz
    tar -xvzf apache-hive-1.2.1-bin.tar.gz
    ```

1. Further amend the bashrc file. You'll need to identify the path to where the archives were unpacked. If using the [Windows Subsystem for Linux](/windows/wsl/install-win10), and you followed the steps exactly, your path would be `/mnt/c/Users/user/`, where `user` is your user name.

    1. Open the file: `nano ~/.bashrc`

    1. Modify the commands below with the appropriate path and then enter them at the end of the bashrc file:

        ```bash
        export HADOOP_HOME=/path_where_the_archives_were_unpacked/hadoop-2.7.3
        export HIVE_HOME=/path_where_the_archives_were_unpacked/apache-hive-1.2.1-bin
        PATH=$PATH:$HIVE_HOME/bin
        ```

    1. Then press **Ctrl+X**, then **Y**, then enter.

1. Close and then reopen you bash session.

1. Test your connection. Use the connection format from [Over public or private endpoints](#over-public-or-private-endpoints), above.

## Next steps

* For examples using the Beeline client with Apache Hive, see [Use Apache Beeline with Apache Hive](apache-hadoop-use-hive-beeline.md)
* For more general information on Hive in HDInsight, see [Use Apache Hive with Apache Hadoop on HDInsight](hdinsight-use-hive.md)
