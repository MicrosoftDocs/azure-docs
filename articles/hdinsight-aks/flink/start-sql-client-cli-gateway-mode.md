---
title:  Start SQL Client CLI in gateway mode in Apache Flink Cluster 1.17.0 on HDInsight on AKS.
description: Learn how to start SQL Client CLI in gateway mode in Apache Flink Cluster 1.17.0 on HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 04/17/2024
---

# Start SQL Client CLI in gateway mode

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This tutorial guides you how to start the SQL Client CLI in gateway mode in Apache Flink Cluster 1.17.0 on HDInsight on AKS. In the gateway mode, the CLI submits the SQL to the specified remote gateway to execute statements.
 
```
./bin/sql-client.sh gateway --endpoint <gateway address>
```
 
> [!NOTE]
> In Apache Flink Cluster on HDInsight on AKS, any external connection will go via 443 port. But internally, it will reroute the request to sql-gateway service listening to port 8083.
 
Check sql gateway service in AKS side:

:::image type="image" source="./media/start-sql-client-cli-in-gateway-mode/check-sql-gateway.png" alt-text="Screenshot showing how to check SQL gateway." border="true" lightbox="./media/start-sql-client-cli-in-gateway-mode/check-sql-gateway.png":::
 
 ## What is SQL Client in Flink?
 
Flink’s Table & SQL API makes it possible to work with queries that written in the SQL language, but these queries need embed within a table program written in either Java or Scala. Moreover, these programs need to be packaged with a build tool before being submitted to a cluster. This feature limits the usage of Flink to Java/Scala programmers.
 
The SQL Client aims to provide an easy way of writing, debugging, and submitting table programs to a Flink cluster without a single line of Java or Scala code. The SQL Client CLI allows for retrieving and visualizing real-time results from the running distributed application on the command line.
 
For more information, see [how to enter the Flink SQL CLI client on webssh](https://supportability.visualstudio.com/AzureHDinsight/_wiki/wikis/AzureHDinsight/833819/-Hilo-sql_client-on-webssh-To-Flink-SQL).
 
## What is SQL Gateway in Flink
 
The SQL Gateway is a service that enables multiple clients from the remote to execute SQL in concurrency. It provides an easy way to submit the Flink Job, look up the metadata, and analyze the data online.
 
For more information, see [SQL Gateway](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/sql-gateway/overview).
 
## Start the SQL Client CLI in gateway mode in Flink-cli 
 
In Apache Flink Cluster on HDInsight on AKS, start the SQL Client CLI in gateway mode by running command:
 
```
./bin/sql-client.sh gateway --endpoint host:port
 
or
 
./bin/sql-client.sh gateway --endpoint https://fqdn/sql-gateway
```
 
Get cluster endpoint(host or fqdn) on Azure portal.
 
:::image type="image" source="./media/start-sql-client-cli-in-gateway-mode/get-cluster-endpoint.png" alt-text="Screenshot showing cluster endpoint." border="true" lightbox="./media/start-sql-client-cli-in-gateway-mode/get-cluster-endpoint.png":::
  
## Testing
 
### Preparation
#### Download Flink CLI

1. Download Flink CLI from https://aka.ms/hdionaksflink117clilinux in local Windows machine.
 
#### Install  Windows Subsystem for Linux to make this work on local Windows machine.
 
1. Open Windows command and run (replace JAVA_HOME and flink-cli path with your own) to download flink-cli:
    
   ```
   Windows Subsystem for Linux --distribution Ubuntu 
   export JAVA_HOME=/mnt/c/Work/99_tools/zulu11.56.19-ca-jdk11.0.15-linux_x64
   cd <folder>
   wget https://hdiconfigactions.blob.core.windows.net/hiloflink17blob/flink-cli.tgz
   tar -xvf flink-cli.tgz
   ```    
1. Set endpoint, tenant ID, and port 443 in flink-conf.yaml 
      ```
      user@MININT-481C9TJ:/mnt/c/Users/user/flink-cli$ cd conf
      user@MININT-481C9TJ:/mnt/c/Users/user/flink-cli/conf$ ls -l
      total 8
      -rwxrwxrwx 1 user user 2451 Feb 26 20:33 flink-conf.yaml
      -rwxrwxrwx 1 user user 2946 Feb 23 14:13 log4j-cli.properties
       
      user@MININT-481C9TJ:/mnt/c/Users/user/flink-cli/conf$ cat flink-conf.yaml
       
      rest.address: <flink cluster endpoint on Azure portal>
      azure.tenant.id: <tenant ID>
      rest.port: 443
      ```
 1. Allowlist Local Windows public IP with port 443 with VPN enabled into HDInsight on AKS cluster Subnet's Network security inbound.
    
      :::image type="image" source="./media/start-sql-client-cli-in-gateway-mode/allow-public-ip.png" alt-text="Screenshot showing how to allow public IP address." border="true" lightbox="./media/start-sql-client-cli-in-gateway-mode/allow-public-ip.png":::
    
   1. Run the sql-client.sh in gateway mode on Flink-cli to Flink SQL.
     
         ```
         bin/sql-client.sh gateway --endpoint https://fqdn/sql-gateway
         ```
          
         Example
         ```
         user@MININT-481C9TJ:/mnt/c/Users/user/flink-cli$ bin/sql-client.sh gateway --endpoint https://fqdn/sql-gateway
          
                                            ▒▓██▓██▒
                                        ▓████▒▒█▓▒▓███▓▒
                                     ▓███▓░░        ▒▒▒▓██▒  ▒
                                   ░██▒   ▒▒▓▓█▓▓▒░      ▒████
                                   ██▒         ░▒▓███▒    ▒█▒█▒
                                     ░▓█            ███   ▓░▒██
                                       ▓█       ▒▒▒▒▒▓██▓░▒░▓▓█
                                     █░ █   ▒▒░       ███▓▓█ ▒█▒▒▒
                                     ████░   ▒▓█▓      ██▒▒▒ ▓███▒
                                  ░▒█▓▓██       ▓█▒    ▓█▒▓██▓ ░█░
                            ▓░▒▓████▒ ██         ▒█    █▓░▒█▒░▒█▒
                           ███▓░██▓  ▓█           █   █▓ ▒▓█▓▓█▒
                         ░██▓  ░█░            █  █▒ ▒█████▓▒ ██▓░▒
                        ███░ ░ █░          ▓ ░█ █████▒░░    ░█░▓  ▓░
                       ██▓█ ▒▒▓▒          ▓███████▓░       ▒█▒ ▒▓ ▓██▓
                    ▒██▓ ▓█ █▓█       ░▒█████▓▓▒░         ██▒▒  █ ▒  ▓█▒
                    ▓█▓  ▓█ ██▓ ░▓▓▓▓▓▓▓▒              ▒██▓           ░█▒
                    ▓█    █ ▓███▓▒░              ░▓▓▓███▓          ░▒░ ▓█
                    ██▓    ██▒    ░▒▓▓███▓▓▓▓▓██████▓▒            ▓███  █
                   ▓███▒ ███   ░▓▓▒░░   ░▓████▓░                  ░▒▓▒  █▓
                   █▓▒▒▓▓██  ░▒▒░░░▒▒▒▒▓██▓░                            █▓
                   ██ ▓░▒█   ▓▓▓▓▒░░  ▒█▓       ▒▓▓██▓    ▓▒          ▒▒▓
                   ▓█▓ ▓▒█  █▓░  ░▒▓▓██▒            ░▓█▒   ▒▒▒░▒▒▓█████▒
                    ██░ ▓█▒█▒  ▒▓▓▒  ▓█                █░      ░░░░   ░█▒
                    ▓█   ▒█▓   ░     █░                ▒█              █▓
                     █▓   ██         █░                 ▓▓        ▒█▓▓▓▒█░
                      █▓ ░▓██░       ▓▒                  ▓█▓▒░░░▒▓█░    ▒█
                       ██   ▓█▓░      ▒                    ░▒█▒██▒      ▓▓
                        ▓█▒   ▒█▓▒░                         ▒▒ █▒█▓▒▒░░▒██
                         ░██▒    ▒▓▓▒                     ▓██▓▒█▒ ░▓▓▓▓▒█▓
                           ░▓██▒                          ▓░  ▒█▓█  ░░▒▒▒
                               ▒▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░▓▓  ▓░▒█░
          
             ______ _ _       _       _____  ____  _         _____ _ _            _  BETA
            |  ____| (_)     | |     / ____|/ __ \| |       / ____| (_)          | |
            | |__  | |_ _ __ | | __ | (___ | |  | | |      | |    | |_  ___ _ __ | |_
            |  __| | | | '_ \| |/ /  \___ \| |  | | |      | |    | | |/ _ \ '_ \| __|
            | |    | | | | | |   <   ____) | |__| | |____  | |____| | |  __/ | | | |_
            |_|    |_|_|_| |_|_|\_\ |_____/ \___\_\______|  \_____|_|_|\___|_| |_|\__|
          
                 Welcome! Enter 'HELP;' to list all available commands. 'QUIT;' to exit.
          
         Command history file path: /home/user/.flink-sql-history
         ```
          
   1. Before querying any table with external source, prepare the related jars.
         Following examples query kafka table, mysql table in Flink SQL. Download the jar and put it in Flink cluster attached Azure Data Lake Storage gen2 storage.
          
         Jars in Azure Data Lake Storage gen2 in Azure portal: 
         
         :::image type="image" source="./media/start-sql-client-cli-in-gateway-mode/jar-files-in-azure-portal.png" alt-text="Screenshot showing jar files in Azure portal." border="true" lightbox="./media/start-sql-client-cli-in-gateway-mode/jar-files-in-azure-portal.png":::
          
   1. Use the table already created and put it into Hive metastore for management, then run the query.

      > [!NOTE]
      > In this example, all the jars in HDInsight on AKS default Azure Data Lake Storage Gen2. The container and storage account need not be same as specified during the cluster creation. If required, you can specify another storage account, and grant cluster user managed identity the storage blob data owner role on the Azure Data Lake Storage Gen2 side.
          
         ``` SQL
         CREATE CATALOG myhive WITH (
             'type' = 'hive'
         );
          
         USE CATALOG myhive;
          
         // ADD jar into environment
         ADD JAR 'abfs://<container>@<storage name>.dfs.core.windows.net/jar/flink-connector-jdbc-3.1.0-1.17.jar';
         ADD JAR 'abfs://<container>@<storage name>.dfs.core.windows.net/jar/mysql-connector-j-8.0.33.jar';
         ADD JAR 'abfs://<container>@<storage name>.dfs.core.windows.net/jar/kafka-clients-3.2.0.jar';
         ADD JAR 'abfs://<container>@<storage name>.dfs.core.windows.net/jar/flink-connector-kafka-1.17.0.jar';
          
         Flink SQL> show jars;
         ----------------------------------------------------------------------------------------------+
         |                                                                                         jars |
         +----------------------------------------------------------------------------------------------+
         |    abfs://<container>@<storage name>.dfs.core.windows.net/jar/flink-connector-kafka-1.17.0.jar |
         | abfs://<container>@<storage name>.dfs.core.windows.net/jar/flink-connector-jdbc-3.1.0-1.17.jar |
         |             abfs://<container>@<storage name>.dfs.core.windows.net/jar/kafka-clients-3.2.0.jar |
         |        abfs://<container>@<storage name>.dfs.core.windows.net/jar/mysql-connector-j-8.0.33.jar |
         +----------------------------------------------------------------------------------------------+
         4 rows in set
          
         Flink SQL> SET 'sql-client.execution.result-mode' = 'tableau';
         [INFO] Execute statement succeed.
          
         Flink SQL> show tables;
         +----------------------+
         |           table name |
         +----------------------+
         | flightsintervaldata1 |
         |    kafka_user_orders |
         |           kafkatable |
         |    mysql_user_orders |
         |               orders |
         +----------------------+
         5 rows in set
          
         // mysql cdc table
         Flink SQL> select * from mysql_user_orders;
         +----+-------------+----------------------------+-------------+--------------------------------+--------------+-------------+--------------+
         | op |    order_id |                 order_date | customer_id |                  customer_name |        price |  product_id | order_status |
         +----+-------------+----------------------------+-------------+--------------------------------+--------------+-------------+--------------+
         | +I |       10001 | 2023-07-16 10:08:22.000000 |           1 |                           Jark |     50.00000 |
         102 |        FALSE |
         | +I |       10002 | 2023-07-16 10:11:09.000000 |           2 |                          Sally |     15.00000 |
         105 |        FALSE |
         | +I |       10003 | 2023-07-16 10:11:09.000000 |           3 |                          Sally |     25.00000 |
          
         ```
    
### Reference
[Apache Flink® Command-Line Interface (CLI) on HDInsight on AKS clusters](./use-flink-cli-to-submit-jobs.md)
