---
title: 'TLearn how to connect Apache Kafka cluster with VM in different VNet on Azure HDInsight - Azure HDInsight'
description: Learn how to do Apache Kafka operations using a Apache Kafka REST proxy on Azure HDInsight..
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 02/09/2023
---

# How to connect Kafka cluster with VM in different VNet

Learn how to connect Kafka cluster with VM in different VNet

This Document lists steps that must be followed to set up connectivity between VM and HDI Kafka residing in two different VNet. 

1. Create two different VNETs where HDInsight Kafka cluster and VM will be hosted respectively. For more infomration, see [Create a virtual network using the Azure portal](/azure/virtual-network/quick-create-portal)
1. Note that these two  VNETs must be peered, so that IP addresses of their subnets must not overlap with each other. For more infomration, see [Create a virtual network using the Azure portal](/azure/virtual-network/quick-create-portal)
1. After the above steps are completed, we can create HDInsight Kafka cluster in one VNet. This is like how HDInsight clusters are created in portal with the VNet option For more infomration, see [Create an Apache Kafka cluster](/azure/hdinsight/kafka/apache-kafka-get-started.md#create-an-apache-kafka-cluster)
1. Create a Virtual Machine in the second VNet. While creating the VM specify the second VNet name where this virtual machine must be deployed. For more more information, see [Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal)
1. Once the above steps are completed and Kafka cluster and VM are in running state, make sure to add your local machine IP address in the NSG rule of both the subnets.
Image 1
   This step is to ensure that you can SSH into the kafka headnodes as well as the Virtual machine. 
1.Make sure that the peering status shows as connected. (Peering step was mentioned in step 2) 
Image 2
1. After this we can copy the entries of the file /etc/host from kafka headnode to VM.  
Image 3.
1. Remove the “headnodehost” string entries from the file. For example, the above image has headnodehost entry for the ip 10.0.0.16. After removal it will be like
Image 4.
1. After these entries are made, try to reach the Kafka Ambari dashboard using the curl command using the hn0 or hn1 FQDN as below

   ```
   curl hn0-vnetka.glarbkztnoqubmzjylls33qnse.bx.internal.cloudapp.net:8080 
   ```
   
   Output: 

   ```
   “<!-- 
   * Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements.  See the NOTICE file  distributed with this work for   additional information regarding copyright ownership.  The ASF licenses this file to you under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. 

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

            <a data-qa="license-link" href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">Licensed under the Apache License, Version 2.0</a>.        <br> 

            <a data-qa="third-party-link" href="/licenses/NOTICE.txt" target="_blank">See third-party tools/resources that Ambari uses and their respective authors</a> 

         </div> 

     </footer> 

   </body> 

   </html>”
   ```
1. You can also use send messages to kafka topic and read the topics from the VM. For that you can try to use this sample java application,
   https://github.com/Azure-Samples/hdinsight-kafka-java-get-started
   
1. Make sure to create the topic inside the Kafka cluster using the below command, 
   ```
   /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 8 --topic test --zookeeper $KAFKAZKHOSTS 
   ```
1. After creating the topic, we can use the below commands to produce and consume. The $KAFKABROKERS must be replace appropriately with the broker worker node FQDN and port as mentioned in the documentation. 
   ```
   java -jar kafka-producer-consumer.jar producer test $KAFKABROKERS 
   java -jar kafka-producer-consumer.jar consumer test $KAFKABROKERS 
   ```
1. After this you will get an output as below 
    
   Producer output:
   Image 
   
   Consumer output: 
   Image
