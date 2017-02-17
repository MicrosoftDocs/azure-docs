---
title: Visualize Azure Network Watcher NSG flow logs using open source tools | Microsoft Docs
description: This page describes how to use open source tools to visualize NSG flow logs.
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor:

ms.assetid: e9b2dcad-4da4-4d6b-aee2-6d0afade0cb8
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace
---

# Visualize Azure Network Watcher NSG flow logs using open source tools

Network Security Group flow logs provide information that can be used understand ingress and egress IP traffic on Network Security Groups. These flow logs show outbound and inbound flows on a per rule basis, the NIC the flow applies to, 5 tuple information about the flow (Source/Destination IP, Source/Destination Port, Protocol), and if the traffic was allowed or denied.

These flow logs can be difficult to manually parse and gain insights from. However, there are several open source tools that can help visualize this data. This article will provide a solution to visualize these logs using the Elastic Stack, which will allow you to quickly index and visualize your flow logs on a Kibana dashboard.

## Scenario

In this article, we will set up a solution that will allow you to visualize Network Security Group flow logs using the Elastic Stack.  A Logstash input plug will obtain the flow logs directly from the storage blob configured for containing the flow logs. Then, using the Elastic Stack, the flow logs will be indexed and used to create a Kibana dashboard to visualize the information.

![scenario][scenario]

### Steps

#### Enable Network Security Group Flow Logging
For this scenario, you must have Network Security Group Flow Logging enabled on at least one Network Security Group in your account. For instructions on enabling Network Security Flow Logs, refer to the following article [Introduction to flow logging for Network Security Groups](network-watcher-nsg-flow-logging-overview.md).


### Set up the Elastic Stack
By connecting NSG flow logs with the Elastic Stack, we can create a Kibana dashboard what allows us to search, graph, analyze, and derive insights from our logs.

#### Install Elasticsearch

1. The Elastic Stack from version 5.0 and above requires Java 8. Run the command `java -version` to check your version. If you do not have java install, refer to documentation on [Oracle's website](http://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html)
1. Download the correct binary package for your system:

    ```
    sudo apt-get install openjdk-8-jre
    curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.2.0.deb
    sudo dpkg -i elasticsearch-5.2.0.deb
    sudo /etc/init.d/elasticsearch start
    ```

    Other installation methods can be found at [Elasticsearch Installation](https://www.elastic.co/guide/en/beats/libbeat/5.2/elasticsearch-installation.html)

1. Verify that elastic search is running with the command:

    ```
    curl http://127.0.0.1:9200
    ```

    You should see a response similar to this:

    ```
    {
    "name" : "Angela Del Toro",
    "cluster_name" : "elasticsearch",
    "version" : {
        "number" : "5.2.0",
        "build_hash" : "8ff36d139e16f8720f2947ef62c8167a888992fe",
        "build_timestamp" : "2016-01-27T13:32:39Z",
        "build_snapshot" : false,
        "lucene_version" : "6.1.0"
    },
    "tagline" : "You Know, for Search"
    }
    ```

For further instructions on installing Elastic search, refer to the page [Installation](https://www.elastic.co/guide/en/elasticsearch/reference/5.2/_installation.html)

### Install Logstash

1. To install Logstash run the following commands:

    ```
    curl -L -O https://artifacts.elastic.co/downloads/logstash/logstash-5.2.0.deb
    sudo dpkg -i logstash-5.2.0.deb
    ```
1. Next we need to configure Logstash to read from the output of eve.json file. Create a logstash.conf file using:

    ```
    sudo touch /etc/logstash/conf.d/logstash.conf
    ```

1. Add the following content to the file:

  ```
  input {
    azureblob
      {
          storage_account_name => "mystorageaccount"
          storage_access_key => "storageaccesskey"
          container => "nsgflowlogContainerName"
          codec => "json"
      }
    }

    filter{
      split{
        field => "records"
      }
    }

    output {
      stdout { codec => rubydebug }
      elasticsearch {
        hosts => "localhost"
        index => "flow-logs"
      }
    }  

  ```


1. To start Logstash run the command:

    ```
    sudo /etc/init.d/logstash start
    ```

For further instructions on installing Logstash, refer to the [official documentation](https://www.elastic.co/guide/en/beats/libbeat/5.2/logstash-installation.html)

### Install the Logstash input plugin for Azure Blob Storage
This Logstash plug in will allow you to directly access the flow logs from their designated storage account. To install this plug in, run the command:

```
logstash-plugin install logstash-input-azureblob
```

For more information about this plug in, refer to documentation [here](https://github.com/Azure/azure-diagnostics-tools/tree/master/Logstash/logstash-input-azureblob)

### Install Kibana

1. Run the following commands to install Kibana:

    ```
    curl -L -O https://artifacts.elastic.co/downloads/kibana/kibana-5.2.0-linux-x86_64.tar.gz
        For further instructions on installing Elastic s
    tar xzvf kibana-5.2.0-linux-x86_64.tar.gz
    cd kibana-5.2.0-linux-x86_64/
    ./bin/kibana
    ```

1. To view your Kibana web interface, navigate to `http://localhost:5601`
1. For this scenario, the index pattern used for the flow logs is "flow-logs"

1. If you want to view the Kibana dashboard remotely, create an inbound NSG rule allowing access to **port 5601**.


## Next steps

Learn how to visualize your NSG flow logs with Power BI by visiting [Visualize NSG flows logs with Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md)


<!--Image references-->

[1]: ./media/network-watcher-visualize-nsg-flow-logs-open-source-tools/figure1.png
[scenario]: ./media/network-watcher-visualize-nsg-flow-logs-open-source-tools/scenario.png

