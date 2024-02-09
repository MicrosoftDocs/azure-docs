---
title: Connect HDInsight Kafka cluster with client VM in different VNet on Azure HDInsight
description: Learn how to connect HDInsight Kafka cluster with Client VM in different VNet on Azure HDInsight
ms.service: hdinsight
ms.topic: tutorial
ms.date: 08/10/2023
---

# Connect HDInsight Kafka cluster with client VM in different VNet

This article describes the steps to set up the connectivity between a virtual machine (VM) and HDInsight Kafka cluster residing in two different virtual networks (VNet).

## Connect HDInsight Kafka cluster with client VM in different VNet

1. Create two different virtual networks where HDInsight Kafka cluster and VM are hosted respectively. For more information, see [Create a virtual network using Azure portal](/azure/virtual-network/quick-create-portal).

1. Peer these two virtual networks, so that IP addresses of their subnets must not overlap with each other. For more information, see [Connect virtual networks with virtual network peering using the Azure portal](/azure/virtual-network/tutorial-connect-virtual-networks-portal).

1. Ensure that the peering status shows as connected.

   :::image type="content" source="./media/connect-kafka-with-vnet/vnet-peering.png" alt-text="Screenshot showing VNet peering." border="true" lightbox="./media/connect-kafka-with-vnet/vnet-peering.png":::

1. Create HDInsight Kafka cluster in first VNet `hdi-primary-vnet`. For more information, see [Create an HDInsight Kafka cluster](./apache-kafka-get-started.md#create-an-apache-kafka-cluster).

1. Create a virtual machine (VM) in the second VNet `hilo-secondary-vnet`. While creating the VM, specify the second VNet name where this virtual machine must be deployed. For more information, see [Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu).

   > [!NOTE]
   > IPs of Kafka VMs never change if VM is present in cluster. Only when you manually replace VM from the cluster then, that IP changes. You can check the latest IPs from Ambari portal.

## Methods to connect to HDInsight Kafka cluster from client VM

1. Configure Kafka for IP advertising: Use `Kafka IP advertising` to populate Kafka worker node private IPs in different vnet. Once IP advertising is done, use private DNS setup for DNS resolution of worker nodes FQDN.
1. Update /etc/hosts file in client machine: Update `/etc/hosts` file in client machine with `/etc/hosts` file of Kafka Head/Worker node.

> [!NOTE]
> * Private DNS setup is optional after IP advertising. This is required only when you want to use FQDN of Kafka worker nodes with private DNS domain name instead of private IPs.
> * IPs of Kafka VMs never change if VM is present in cluster. Only when you manually replace VM from the cluster then, that IP changes. You can check the latest IPs from Ambari portal.

###  Configure Kafka for IP advertising
This configuration allows the client to connect using broker IP addresses instead of domain names. By default, Apache Zookeeper returns the domain name of the Kafka brokers to clients.

This configuration doesn't work with the VPN software client, as it can't use name resolution for entities in the virtual network.

Use the following steps to configure HDInsight Kafka to advertise IP addresses instead of domain names:

1. Using a web browser, go to `https://CLUSTERNAME.azurehdinsight.net`. Replace `CLUSTERNAME` with the HDInsight Kafka cluster name.
1. When prompted, use the HTTPS `username` and `password` for the cluster. The Ambari Web UI for the cluster is displayed.
1. To view information on Kafka, select `Kafka` from the left panel and then select configs.
  
   :::image type="content" source="./media/connect-kafka-with-vnet/kafka-config.png" alt-text="Screenshot showing Kafka VNet configurations." border="true" lightbox="./media/connect-kafka-with-vnet/kafka-config.png":::

1. To access `kafka-env` configuration on the Ambari dashboard, just type `kafka-env` in the top right filter field in Ambari UI. 
  
   :::image type="content" source="./media/connect-kafka-with-vnet/kafka-env.png" alt-text="Screenshot showing Kafka environment." border="true" lightbox="./media/connect-kafka-with-vnet/kafka-env.png":::

1. To configure Kafka to advertise IP addresses, add the following text to the bottom of the `kafka-env-template` field:
   
   ```shell
    # Configure Kafka to advertise IP addresses instead of FQDN 
    IP_ADDRESS=$(hostname -i)
    echo advertised.listeners=$IP_ADDRESS
    sed -i.bak -e '/advertised/{/advertised@/!d;}' /usr/hdp/current/kafka-broker/conf/server.properties
    echo "advertised.listeners=PLAINTEXT://$IP_ADDRESS:9092" >> /usr/hdp/current/kafka-broker/conf/server.properties 
    ```
1. To configure the interface that Kafka listens on, enter `listeners` in the filter field on the top right.
   
1. To configure Kafka to listen on all network interfaces, change the value in the `listeners` field to `PLAINTEXT://0.0.0.0:9092`.
1. To save the configuration changes, use the `Save` button. Enter a text message describing the changes. Select `OK` once the changes have been saved. 

   :::image type="content" source="./media/connect-kafka-with-vnet/save-kafka-broker.png" alt-text="Screenshot showing the save button." border="true" lightbox="./media/connect-kafka-with-vnet/save-kafka-broker.png":::

1. To prevent errors when restarting Kafka, use the `Actions` button and select `Turn On Maintenance Mode`. Select `OK` to complete this operation. 

   :::image type="content" source="./media/connect-kafka-with-vnet/action-button.png" alt-text="Screenshot showing action button." border="true" lightbox="./media/connect-kafka-with-vnet/action-button.png":::

1. To restart Kafka, use the `Restart` button and select `Restart All Affected`. Confirm the restart, and then use the `OK` button after the operation has completed. 

   :::image type="content" source="./media/connect-kafka-with-vnet/restart-button.png" alt-text="Screenshot showing how to restart." border="true" lightbox="./media/connect-kafka-with-vnet/restart-button.png":::

1. To disable maintenance mode, use the `Actions` button and select `Turn Off Maintenance Mode`. Select `OK` to complete this operation.
1. Now you can execute your jobs from client VM with Kafka IP address. To check IP address of worker nodes from Ambari Portal click on `Hosts` on left panel. 

   :::image type="content" source="./media/connect-kafka-with-vnet/ambari-hosts.png" alt-text="Screenshot showing the worker node IP for Ambari." border="true" lightbox="./media/connect-kafka-with-vnet/ambari-hosts.png":::
   
1. Use Sample git repository to create Kafka topics](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started), to produce and consume data from that topic. 

   ```shell
   # In previous example IP of worker node 0 is `broker1-ip` and worker node 1 is `broker2-ip`
   # Create Kafka Topic 
   java -jar kafka-producer-consumer.jar create <topic_name> $KAFKABROKERS
   java -jar kafka-producer-consumer.jar create test broker1-ip:9092,broker1-ip:9092
   ```
   :::image type="content" source="./media/connect-kafka-with-vnet/create-topic.png" alt-text="Screenshot showing how to create Kafka topic." border="true" lightbox="./media/connect-kafka-with-vnet/create-topic.png":::

   ```shell
   # Produce Data in Topic
   java -jar kafka-producer-consumer.jar producer <topic_name> $KAFKABROKERS
   java -jar kafka-producer-consumer.jar producer test broker1-ip:9092, broker2-ip:9092
   ```
   :::image type="content" source="./media/connect-kafka-with-vnet/producer.png" alt-text="Screenshot showing how to view Kafka producer." border="true" lightbox="./media/connect-kafka-with-vnet/producer.png":::
   
   ```shell
   # Consume Data from Topic
   java -jar kafka-producer-consumer.jar consumer <topic_name> $KAFKABROKERS
   java -jar kafka-producer-consumer.jar consumer test broker1-ip:9092,broker2-ip:9092
   ```
   :::image type="content" source="./media/connect-kafka-with-vnet/consumer.png" alt-text="Screenshot showing Kafka consumer section." border="true" lightbox="./media/connect-kafka-with-vnet/consumer.png":::
   
   > [!NOTE]
   > It is recommended to add all the brokers IP in **$KAFKABROKERS** for fault tolerance.

### Update /etc/hosts file in client machine

1. Copy the highlighted worker nodes entries of the file `/etc/host` from Kafka headnode to Client VM.
   
1. After these entries are made, try to reach the Kafka Ambari dashboard using the web browser or curl command using the hn0 or hn1 FQDN as:
  
   #### If Client VM is using Linux OS

     ```
     # Execute curl command  
     curl hn0-hdi-ka.mvml5coqo4xuzc1nckq1sltcxf.bx.internal.cloudapp.net:8080 
     
     # Output
     <!--
     * Licensed to the Apache Software Foundation (ASF) under one
     * or more contributor license agreements.  See the NOTICE file
     * distributed with this work for additional information
     * regarding copyright ownership.  The ASF licenses this file
     * to you under the Apache License, Version 2.0 (the
     * "License"); you may not use this file except in compliance
     * with the License.  You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     -->
     <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <link rel="stylesheet" href="stylesheets/vendor.css">
       <link rel="stylesheet" href="stylesheets/app.css">
       <script src="javascripts/vendor.js"></script>
       <script src="javascripts/app.js"></script>
       <script>
           $(document).ready(function() {
               require('initialize');
               // make favicon work in firefox
               $('link[type*=icon]').detach().appendTo('head');
               $('#loading').remove();
           });
       </script>
       <title>Ambari</title>
       <link rel="shortcut icon" href="/img/logo.png" type="image/x-icon">
     </head>
     <body> 
         <div id="loading">...Loading...</div>
         <div id="wrapper">
         <!-- ApplicationView -->
         </div>
         <footer>
             <div class="container footer-links">
                 <a data-qa="license-link" href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">Licensed under the Apache License, Version 2.0</a>.
                 <a data-qa="third-party-link" href="/licenses/NOTICE.txt" target="_blank">See third-party tools/resources that Ambari uses and their respective authors</a>
              </div>
         </footer>
     </body>
     </html> 
     ```

### If Client VM is using Windows OS

1. Go to overview page of `hdi-kafka` and click on Ambari view to get the URL.

1. Put the login credential as username `admin` and password `YOUR_PASSWORD`, which you have set while creating cluster.
     
   > [!NOTE]
   > 1. In Windows VM, static hostnames need to be added in the host file which present in the path `C:\Windows\System32\drivers\etc\`.
   > 1. This article assumes that the Ambari server is active on `Head Node 0`. If the Ambari server is active on `Head Node 1` use the FQDN of hn1 to access the Ambari UI.
      
   :::image type="content" source="./media/connect-kafka-with-vnet/dashboard.png" alt-text="Screenshot showing the dashboard." border="true" lightbox="./media/connect-kafka-with-vnet/dashboard.png":::
    
1. You can also send messages to kafka topic and read the topics from the VM. For that you can try to use this sample java application.
     
1. Use sample git repository to create Kafka topics, produce and consume data from that topic. For more information, see [hdinsight-kafka-java-getting-started](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started).
     
1. You can use FQDN, IP or short name(first six letters of cluster name) of brokers to pass as `KAFKABROKERS` in the following commands.
              
   ```
    # In the previous example       # IP of worker node 0 is `broker1-ip` and worker node 1 is `broker2-ip`
    # Short Name of worker node 0 is `wn0-hdi-ka` and worker node 1 is `wn1-hdi-ka`      # FQDN of worker node 0 is `wn0-hdi-ka.mvml5coqo4xuzc1nckq1sltcxf.bx.internal.cloudapp.net` and worker node 1 is `wn1-hdi-ka.mvml5coqo4xuzc1nckq1sltcxf.bx.internal.cloudapp.net`
            
    # Create Kafka Topic 
         java -jar kafka-producer-consumer.jar create <topic_name> $KAFKABROKERS
         java -jar kafka-producer-consumer.jar create test broker1-ip:9092,broker2-ip:9092
            
    # Produce Data in Topic
         java -jar kafka-producer-consumer.jar producer <topic_name> $KAFKABROKERS
         java -jar kafka-producer-consumer.jar producer test wn0-hdi-ka:9092,wn1-hdi-ka:9092
         
    # Consume Data from Topic
         java -jar kafka-producer-consumer.jar consumer <topic_name> $KAFKABROKERS
         java -jar kafka-producer-consumer.jar consumer test wn0-hdi-ka.mvml5coqo4xuzc1nckq1sltcxf.bx.internal.cloudapp.net:9092,wn1-hdi-ka.mvml5coqo4xuzc1nckq1sltcxf.bx.internal.cloudapp.net:9092
   ```   
> [!NOTE]
> It is recommended to add all the brokers IP, FQDN or short name in $KAFKABROKERS for fault tolerance.
