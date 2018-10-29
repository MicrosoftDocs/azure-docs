---
title: Use Script Action to install Solr on Linux-based HDInsight - Azure 
description: Learn how to install Solr on Linux-based HDInsight Hadoop clusters using Script Actions.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/16/2018
ms.author: jasonh

---
# Install and use Solr on HDInsight Hadoop clusters

Learn how to install Solr on Azure HDInsight by using Script Action. Solr is a powerful search platform and provides enterprise-level search capabilities on data managed by Hadoop.

> [!IMPORTANT]
    > The steps in this document require an HDInsight cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement).

> [!IMPORTANT]
> The sample script used in this document installs Solr 4.9 with a specific configuration. If you want to configure the Solr cluster with different collections, shards, schemas, replicas, etc., you must modify the script and Solr binaries.

## <a name="whatis"></a>What is Solr

[Apache Solr](http://lucene.apache.org/solr/features.html) is an enterprise search platform that enables powerful full-text search on data. While Hadoop enables storing and managing vast amounts of data, Apache Solr provides the search capabilities to quickly retrieve the data.

> [!WARNING]
> Components provided with the HDInsight cluster are fully supported by Microsoft.
>
> Custom components, such as Solr, receive commercially reasonable support to help you to further troubleshoot the issue. Microsoft support may not be able to resolve problems with custom components. You may need to engage the open source communities for assistance. For example, there are many community sites that can be used, like: [MSDN forum for HDInsight](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=hdinsight), [http://stackoverflow.com](http://stackoverflow.com). Also Apache projects have project sites on [http://apache.org](http://apache.org), for example: [Hadoop](http://hadoop.apache.org/).

## What the script does

This script makes the following changes to the HDInsight cluster:

* Installs Solr 4.9 into `/usr/hdp/current/solr`
* Creates a user, **solrusr**, which is used to run the Solr service
* Sets **solruser** as the owner of `/usr/hdp/current/solr`
* Adds an [Upstart](http://upstart.ubuntu.com/) configuration that starts Solr automatically.

## <a name="install"></a>Install Solr using Script Actions

A sample script to install Solr on an HDInsight cluster is available at the following location:

    https://hdiconfigactions.blob.core.windows.net/linuxsolrconfigactionv01/solr-installer-v01.sh

To create a cluster that has Solr installed, use the steps in the [Create HDInsight clusters](hdinsight-hadoop-create-linux-clusters-portal.md) document. During the creation process, use the following steps to install Solr:

1. From the __Cluster summary__ section, select__Advanced settings__, then __Script actions__. Use the following information to populate the form:

   * **NAME**: Enter a friendly name for the script action.
   * **SCRIPT URI**: https://hdiconfigactions.blob.core.windows.net/linuxsolrconfigactionv01/solr-installer-v01.sh
   * **HEAD**: Check this option
   * **WORKER**: Check this option
   * **ZOOKEEPER**: Check this option to install on the Zookeeper node
   * **PARAMETERS**: Leave this field blank

2. At the bottom of the **Script actions** section, use the **Select** button to save the configuration. Finally, use the **Next** button to return to the __Cluster summary__

3. From the __Cluster summary__ page, select __Create__ to create the cluster.

## <a name="usesolr"></a>How do I use Solr in HDInsight

> [!IMPORTANT]
> The steps in this section demonstrate basic Solr functionality. For more information on using Solr, see the [Apache Solr site](http://lucene.apache.org/solr/).

### Index data

Use the following steps to add example data to Solr, and then query it:

1. Connect to the HDInsight cluster using SSH:

    > [!NOTE]
    > Replace `sshuser` with the SSH user for the cluster. Replace `clustername` with the name of the cluster.

    ```bash
    ssh sshuser@clustername-ssh.azurehdinsight.net
    ```

    For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

     > [!IMPORTANT]
     > Steps later in this document use an SSH tunnel to connect to the Solr web UI. To use these steps, you must establish an SSH tunnel and then configure your browser to use it.
     >
     > For more information, see the [Use SSH Tunneling with HDInsight](hdinsight-linux-ambari-ssh-tunnel.md) document.

2. Use the following commands to have Solr index sample data:

    ```bash
    cd /usr/hdp/current/solr/example/exampledocs
    java -jar post.jar solr.xml monitor.xml
    ```

    The following output is returned to the console:

        POSTing file solr.xml
        POSTing file monitor.xml
        2 files indexed.
        COMMITting Solr index changes to http://localhost:8983/solr/update..
        Time spent: 0:00:01.624

    The `post.jar` utility adds the **solr.xml** and **monitor.xml** documents to the index.
  
3. Use the following command to query the Solr REST API:

    ```bash
    curl "http://localhost:8983/solr/collection1/select?q=*%3A*&wt=json&indent=true"
    ```

    This command searches **collection1** for any documents matching **\*:\*** (encoded as \*%3A\* in the query string). The following JSON document is an example of the response:

            "response": {
                "numFound": 2,
                "start": 0,
                "maxScore": 1,
                "docs": [
                  {
                    "id": "SOLR1000",
                    "name": "Solr, the Enterprise Search Server",
                    "manu": "Apache Software Foundation",
                    "cat": [
                      "software",
                      "search"
                    ],
                    "features": [
                      "Advanced Full-Text Search Capabilities using Lucene",
                      "Optimized for High Volume Web Traffic",
                      "Standards Based Open Interfaces - XML and HTTP",
                      "Comprehensive HTML Administration Interfaces",
                      "Scalability - Efficient Replication to other Solr Search Servers",
                      "Flexible and Adaptable with XML configuration and Schema",
                      "Good unicode support: héllo (hello with an accent over the e)"
                    ],
                    "price": 0,
                    "price_c": "0,USD",
                    "popularity": 10,
                    "inStock": true,
                    "incubationdate_dt": "2006-01-17T00:00:00Z",
                    "_version_": 1486960636996878300
                  },
                  {
                    "id": "3007WFP",
                    "name": "Dell Widescreen UltraSharp 3007WFP",
                    "manu": "Dell, Inc.",
                    "manu_id_s": "dell",
                    "cat": [
                      "electronics and computer1"
                    ],
                    "features": [
                      "30\" TFT active matrix LCD, 2560 x 1600, .25mm dot pitch, 700:1 contrast"
                    ],
                    "includes": "USB cable",
                    "weight": 401.6,
                    "price": 2199,
                    "price_c": "2199,USD",
                    "popularity": 6,
                    "inStock": true,
                    "store": "43.17614,-90.57341",
                    "_version_": 1486960637584081000
                  }
                ]
              }

### Using the Solr dashboard

The Solr dashboard is a web UI that allows you to work with Solr through your web browser. The Solr dashboard is not exposed directly on the Internet from your HDInsight cluster. You can use an SSH tunnel to access it. For more information on using an SSH tunnel, see the [Use SSH Tunneling with HDInsight](hdinsight-linux-ambari-ssh-tunnel.md) document.

Once you have established an SSH tunnel, use the following steps to use the Solr dashboard:

1. Determine the host name for the primary headnode:

   1. Use SSH to connect to the cluster head node. For example, `ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net`.

       For more information on using SSH, see the [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

   2. Use the following command to get the fully qualified hostname:

        ```bash
        hostname -f
        ```

        This command returns a value similar to the following host name:

            hn0-myhdi-nfebtpfdv1nubcidphpap2eq2b.ex.internal.cloudapp.net

        Save the value returned, as it is used later.

2. In your browser, connect to **http://HOSTNAME:8983/solr/#/**, where **HOSTNAME** is the name you determined in the previous steps.

    The request is routed through the SSH tunnel to the Solr web UI on your cluster. The page appears similar to the following image:

    ![Image of Solr dashboard](./media/hdinsight-hadoop-solr-install-linux/solrdashboard.png)

3. From the left pane, use the **Core Selector** drop-down to select **collection1**. Several entries should them appear below **collection1**.

4. From the entries below **collection1**, select **Query**. Use the following values to populate the search page:

   * In the **q** text box, enter **\*:**\*. This query returns all the documents that are indexed in Solr. If you want to search for a specific string within the documents, you can enter that string here.
   * In the **wt** text box, select the output format. Default is **json**.

     Finally, select the **Execute Query** button at the bottom of the search pate.

     ![Use Script Action to customize a cluster](./media/hdinsight-hadoop-solr-install-linux/hdi-solr-dashboard-query.png)

     The output returns the two documents that you added to the index earlier. The output is similar to the following JSON document:

           "response": {
               "numFound": 2,
               "start": 0,
               "maxScore": 1,
               "docs": [
                 {
                   "id": "SOLR1000",
                   "name": "Solr, the Enterprise Search Server",
                   "manu": "Apache Software Foundation",
                   "cat": [
                     "software",
                     "search"
                   ],
                   "features": [
                     "Advanced Full-Text Search Capabilities using Lucene",
                     "Optimized for High Volume Web Traffic",
                     "Standards Based Open Interfaces - XML and HTTP",
                     "Comprehensive HTML Administration Interfaces",
                     "Scalability - Efficient Replication to other Solr Search Servers",
                     "Flexible and Adaptable with XML configuration and Schema",
                     "Good unicode support: héllo (hello with an accent over the e)"
                   ],
                   "price": 0,
                   "price_c": "0,USD",
                   "popularity": 10,
                   "inStock": true,
                   "incubationdate_dt": "2006-01-17T00:00:00Z",
                   "_version_": 1486960636996878300
                 },
                 {
                   "id": "3007WFP",
                   "name": "Dell Widescreen UltraSharp 3007WFP",
                   "manu": "Dell, Inc.",
                   "manu_id_s": "dell",
                   "cat": [
                     "electronics and computer1"
                   ],
                   "features": [
                     "30\" TFT active matrix LCD, 2560 x 1600, .25mm dot pitch, 700:1 contrast"
                   ],
                   "includes": "USB cable",
                   "weight": 401.6,
                   "price": 2199,
                   "price_c": "2199,USD",
                   "popularity": 6,
                   "inStock": true,
                   "store": "43.17614,-90.57341",
                   "_version_": 1486960637584081000
                 }
               ]
             }

### Starting and stopping Solr

Use the following commands to manually stop and start Solr:

```bash
sudo stop solr
sudo start solr
```

## Backup indexed data

Use the following steps to back up Solr data to the default storage for your cluster:

1. Connect to the cluster using SSH, then use the following command to get the host name for the head node:

    ```bash
    hostname -f
    ```

2. Use the following command to create a snapshot of the indexed data. Replace **HOSTNAME** with the name returned from the previous command:

    ```bash
    curl http://HOSTNAME:8983/solr/replication?command=backup
    ```

    The response is similar to the following XML:

        <?xml version="1.0" encoding="UTF-8"?>
        <response>
          <lst name="responseHeader">
            <int name="status">0</int>
            <int name="QTime">9</int>
          </lst>
          <str name="status">OK</str>
        </response>

3. Change directories to `/usr/hdp/current/solr/example/solr`. There is a subdirectory here for each collection. Each collection directory contains a `data` directory that contains the snapshot for the collection.

4. To create a compressed archive of the snapshot folder, use the following command:

    ```bash
    tar -zcf snapshot.20150806185338855.tgz snapshot.20150806185338855
    ```

    Replace the `snapshot.20150806185338855` values with the name of the snapshot for your collection.

    This command creates an archive named **snapshot.20150806185338855.tgz**, which contains the contents of the **snapshot.20150806185338855** directory.

5. You can then store the archive to the cluster's primary storage using the following command:

    ```bash
    hdfs dfs -put snapshot.20150806185338855.tgz /example/data
    ```

For more information on working with Solr backup and restores, see [https://cwiki.apache.org/confluence/display/solr/Making+and+Restoring+Backups](https://cwiki.apache.org/confluence/display/solr/Making+and+Restoring+Backups).

## Next steps

* [Install Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install-linux.md). Use cluster customization to install Giraph on HDInsight Hadoop clusters. Giraph allows you to perform graph processing by using Hadoop, and can be used with Azure HDInsight.

* [Install Hue on HDInsight clusters](hdinsight-hadoop-hue-linux.md). Use cluster customization to install Hue on HDInsight Hadoop clusters. Hue is a set of Web applications used to interact with a Hadoop cluster.

[hdinsight-cluster-customize]: hdinsight-hadoop-customize-cluster-linux.md
