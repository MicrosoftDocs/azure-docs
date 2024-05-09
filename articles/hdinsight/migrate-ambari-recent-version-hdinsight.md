---
title: Migrate Ambari to the recent version of HDInsight
description: Learn how to migrate Ambari to the recent version of HDInsight.
ms.service: hdinsight
ms.topic: how-to
ms.date: 05/09/2024
---

# Ambari user configs migration

After setting up HDInsight 5.x, it's necessary to update the user-defined configurations from the HDInsight 4.x cluster. Ambari doesn't currently provide a feature to export and import configurations. To overcome this limitation, we created a script that facilitates downloading the configurations and comparing them across clusters. However, this process involves a few manual steps, such as uploading the configurations to a storage directory, downloading them and then comparing them.

## Script details

1. This step contains two python scripts.
    1. Script to download the local cluster service configs from Ambari.
    1. Script to compare the service config files and generate the differences.
1. All service configurations downloaded, but certain services and properties excluded from the comparison process. These excluded services and properties are as follows:  
    ```
    dfs.namenode.shared.edits.dir','hadoop.registry.zk.quorum','ha.zookeeper.quorum','hive.llap.zk.sm.connectionString','hive.cluster.delegation.token.store.zookeeper.connectString','hive.zookeeper.quorum','hive.metastore.uris','yarn.resourcemanager.hostname','hadoop.registry.zk.quorum','yarn.resourcemanager.hostname','yarn.node-labels.fs-store.root','javax.jdo.option.ConnectionURL','javax.jdo.option.ConnectionUserName','hive_database_name','hive_existing_mssql_server_database','yarn.log.server.url','yarn.timeline-service.sqldb-store.connection-username','yarn.timeline-service.sqldb-store.connection-url','fs.defaultFS', 'address'
    ```
    1. Excluded Services:  `AMBARI_METRICS` and `WEBHCAT`.

## Workflow

To execute the migration process,
1. Run the script on the HDInsight 4.x cluster to obtain the current service configurations from Ambari. The output saved on the local system.
1. Upload the output file to a public/common storage location, as it requires to download on the HDInsight 5.x cluster.
1. Execute the script on the HDInsight 5.x cluster to retrieve the current service configurations from Ambari. 
1. Save the output on the local drive.
1. Download the HDInsight 4.x cluster configurations from the storage account to the HDInsight 5.x cluster.
1. Run the script on the HDInsight 5.x cluster, where both the HDInsight 4.x and HDInsight 5.x configurations are present.

## Execution

On HDInsight 4 Cluster (Old Cluster)
1. ssh to headnode.
1. `mkdir hdinsights_ambari_utils`.
1. `cd hdinsights_ambari_utils`.
1. Download `ambari_export_cluster_configs.py`.
1. Run `wget https://hdiconfigactions2.blob.core.windows.net/hdi-sre-workspace/hdinsights_upgrade_ambari_utils/ambari_export_cluster_configs.py`.

    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/wget-command.png" alt-text="Screenshot showing wget command." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/wget-command.png":::
1. Execute the script.
`python ambari_export_cluster_configs.py`.
1. Make sure that the username and password supplied within single quotes.

    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/run-python-script.png" alt-text="Screenshot showing run-python-script." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/run-python-script.png":::    

1. Check for the configs files.
    `ls –ltr`
    
    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/script-output.png" alt-text="Screenshot showing script output." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/script-output.png":::
 
1. On the above we can see an output file with cluster name Plutos.out.
1. Upload the file to a storage container, hence it downloaded on the new cluster.

## On HDInsight 5.x Cluster (New Cluster)

1. ssh to headnode.
    ```
    mkdir hdinsights_ambari_utils
    cd hdinsights_ambari_util
    ```
1. Download `ambari_export_cluster_configs.py`.
   
   :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/wget-output.png" alt-text="Screenshot showing wget output." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/wget-output.png":::

1. Run `wget https://hdiconfigactions2.blob.core.windows.net/hdi-sre-workspace/hdinsights_upgrade_ambari_utils/ambari_export_cluster_configs.py`
   :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/python-script-output.png" alt-text="Screenshot showing python script output." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/python-script-output.png":::
 
1. Execute the script `python ambari_export_cluster_configs.py`.
1. Make sure that the username and password is supplied within single quotes
1. Check for the configs files `ls –ltr`.

    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/ambari-python-script.png" alt-text="Screenshot showing Ambari python script." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/ambari-python-script.png":::

1. On the above we can see an output file with cluster name `Sugar.out`.
1. Download the old cluster out file. In this case, uploaded into the storage container.

    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/wget-command-output.png" alt-text="Screenshot showing wget command output." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/wget-command-output.png":::

1. Download  `compare_ambari_cluster_configs.py script`.

    ::::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/python-results.png" alt-text="Screenshot showing python results." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/python-results.png":::

1. Run the `compare_ambari_cluster_configs.py` script.
1. Run `sshuser@hn0-sugar:~/hdinsights_ambari_utils$ python,
 compare_ambari_cluster_configs.py plutos out sugar.out`
    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/python-compare-command.png" alt-text="Screenshot showing python compare command." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/python-compare-command.png":::
1. Difference printed in the console.
    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/python-code-sample.png" alt-text="Screenshot showing python code sample." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/python-code-sample.png":::
1. Adding to this difference between the cluster configs saved in local.
    `ls –ltr`
    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/list-of-output-files.png" alt-text="Screenshot showing list of output files." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/list-of-output-files.png":::
