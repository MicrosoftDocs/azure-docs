---
title: Migrate Ambari to the recent version of Azure HDInsight
description: Learn how to migrate Ambari to the recent version of Azure HDInsight.
author: AmithshaS
ms.author: amithshas
ms.service: hdinsight
ms.topic: how-to
ms.date: 05/22/2024
---

# Ambari user configs migration

After setting up HDInsight 5.x, it's necessary to update the user-defined configurations from the HDInsight 4.x cluster. Ambari doesn't currently provide a feature to export and import configurations. To overcome this limitation, we created a script that facilitates downloading the configurations and comparing them across clusters. However, this process involves a few manual steps, such as uploading the configurations to a storage directory, downloading them and then comparing them.

## Script details

* This step contains two python scripts.
  * Script to download the local cluster service configs from Ambari.
  * Script to compare the service config files and generate the differences.
* All service configurations downloaded, but certain services and properties excluded from the comparison process. These excluded services and properties are as follows:
    * Excluded properties  
    ```
    dfs.namenode.shared.edits.dir','hadoop.registry.zk.quorum','ha.zookeeper.quorum','hive.llap.zk.sm.connectionString','hive.cluster.delegation.token.store.zookeeper.connectString','hive.zookeeper.quorum','hive.metastore.uris','yarn.resourcemanager.hostname','hadoop.registry.zk.quorum','yarn.resourcemanager.hostname','yarn.node-labels.fs-store.root','javax.jdo.option.ConnectionURL','javax.jdo.option.ConnectionUserName','hive_database_name','hive_existing_mssql_server_database','yarn.log.server.url','yarn.timeline-service.sqldb-store.connection-username','yarn.timeline-service.sqldb-store.connection-url','fs.defaultFS', 'address'
    ```
    * Excluded Services:  
    `AMBARI_METRICS` and `WEBHCAT`.
    
## Workflow

To execute the migration process,
1. Run the script on the HDInsight 4.x cluster to obtain the current service configurations from Ambari. The output saved on the local VM from where the script executed.
1. Upload the output file to a public/common storage location, as it requires to download on the HDInsight 5.x cluster.
1. Execute the script on the HDInsight 5.x cluster to retrieve the current service configurations from Ambari. Save the output on the local drive.
1. Save the output.
1. Download the HDInsight 4.x cluster configurations from the storage account to the HDInsight 5.x cluster.
1. Run the script on the HDInsight 5.x cluster, where both the HDInsight 4.x and HDInsight 5.x configurations are present.

## Execution

On HDInsight 4 Cluster (Old Cluster)
1. ssh to headnode and run the following commands.
   ```
   mkdir hdinsights_ambari_utils
   cd hdinsights_ambari_utils
   ```
1. Run `wget https://hdiconfigactions2.blob.core.windows.net/hdi-sre-workspace/hdinsights_upgrade_ambari_utils/ambari_export_cluster_configs.py` to download the Python script.
    
    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/wget-command.png" alt-text="Screenshot showing wget command." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/wget-command.png":::

1. Run  `python ambari_export_cluster_configs.py`. Make sure that the username and password supplied within single quotes.

    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/run-python-script.png" alt-text="Screenshot showing run-python-script." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/run-python-script.png":::    

1. Do `ls –ltr` to check the configs files.
    
    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/script-output.png" alt-text="Screenshot showing script output." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/script-output.png":::
 
1. You can see an output file with cluster name as `Plutos.out`.
1. Upload the file to a storage container.

## On HDInsight 5.x Cluster (New Cluster)

1. ssh to headnode.
    ```
    mkdir hdinsights_ambari_utils
    cd hdinsights_ambari_util
    ```
   :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/wget-output.png" alt-text="Screenshot showing wget output." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/wget-output.png":::

1. Run `wget https://hdiconfigactions2.blob.core.windows.net/hdi-sre-workspace/hdinsights_upgrade_ambari_utils/ambari_export_cluster_configs.py` to download the Python script.

   :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/python-script-output.png" alt-text="Screenshot showing python script output." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/python-script-output.png":::
 
1. Execute the script `python ambari_export_cluster_configs.py`. Make sure that the username and password is supplied within single quotes
1. Check for the configs files. 

    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/ambari-python-script.png" alt-text="Screenshot showing Ambari python script." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/ambari-python-script.png":::

1. You can see an output file with cluster name `Sugar.out`.
1. Download the old cluster `Sugar.out` file.

    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/wget-command-output.png" alt-text="Screenshot showing wget command output." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/wget-command-output.png":::

    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/python-results.png" alt-text="Screenshot showing python results." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/python-results.png":::

1. Run `wget https://hdiconfigactions2.blob.core.windows.net/hdi-sre-workspace/hdinsights_upgrade_ambari_utils/compare_ambari_cluster_configs.py` to download the Python script. 

1. Run `compare_ambari_cluster_configs.py` script.
1. Run
   ```
   sshuser@hn0-sugar:~/hdinsights_ambari_utils$ python,
   compare_ambari_cluster_configs.py plutos out sugar.out
   ```

    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/python-compare-command.png" alt-text="Screenshot showing python compare command." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/python-compare-command.png":::

1. You can see the difference in the output. 
    :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/python-code-sample.png" alt-text="Screenshot showing python code sample." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/python-code-sample.png":::
1. Run the command 'ls -ltr'.
1. Additionally, both the clusters configs are stored here, which you can use them for future reference. 
       :::image type="content" source="./media/migrate-ambari-recent-version-hdinsight/list-of-output-files.png" alt-text="Screenshot showing list of output files." border="true" lightbox="./media/migrate-ambari-recent-version-hdinsight/list-of-output-files.png":::
