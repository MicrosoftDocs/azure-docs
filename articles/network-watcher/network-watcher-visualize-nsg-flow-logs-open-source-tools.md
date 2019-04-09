---
title: Manage and analyze Network Security Group flow logs using Network Watcher and Elastic Stack | Microsoft Docs
description: Manage and analyze Network Security Group Flow Logs in Azure using Network Watcher and Elastic Stack.
services: network-watcher
documentationcenter: na
author: mattreatMSFT
manager: vitinnan
editor:

ms.assetid: e9b2dcad-4da4-4d6b-aee2-6d0afade0cb8
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: mareat
---

# Visualize Azure Network Watcher NSG flow logs using open source tools

Network Security Group flow logs provide information that can be used understand ingress and egress IP traffic on Network Security Groups. These flow logs show outbound and inbound flows on a per rule basis, the NIC the flow applies to, 5 tuple information about the flow (Source/Destination IP, Source/Destination Port, Protocol), and if the traffic was allowed or denied.

These flow logs can be difficult to manually parse and gain insights from. However, there are several open source tools that can help visualize this data. This article will provide a solution to visualize these logs using the Elastic Stack, which will allow you to quickly index and visualize your flow logs on a Kibana dashboard.

> [!Warning]  
> The following steps work with flow logs version 1. For details, see [Introduction to flow logging for network security groups](network-watcher-nsg-flow-logging-overview.md). The following instructions will not work with version 2 of the log files, without modification.

## Scenario

In this article, we will set up a solution that will allow you to visualize Network Security Group flow logs using the Elastic Stack.  A Logstash input plugin will obtain the flow logs directly from the storage blob configured for containing the flow logs. Then, using the Elastic Stack, the flow logs will be indexed and used to create a Kibana dashboard to visualize the information.

![scenario][scenario]

## Steps

### Enable Network Security Group flow logging
For this scenario, you must have Network Security Group Flow Logging enabled on at least one Network Security Group in your account. For instructions on enabling Network Security Flow Logs, refer to the following article [Introduction to flow logging for Network Security Groups](network-watcher-nsg-flow-logging-overview.md).

### Set up the Elastic Stack
By connecting NSG flow logs with the Elastic Stack, we can create a Kibana dashboard what allows us to search, graph, analyze, and derive insights from our logs.

#### Install Elasticsearch

1. The Elastic Stack from version 5.0 and above requires Java 8. Run the command `java -version` to check your version. If you do not have java installed, refer to documentation on the [Azure-suppored JDKs](https://aka.ms/azure-jdks).
2. Download the correct binary package for your system:

   ```bash
   curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.2.0.deb
   sudo dpkg -i elasticsearch-5.2.0.deb
   sudo /etc/init.d/elasticsearch start
   ```

   Other installation methods can be found at [Elasticsearch Installation](https://www.elastic.co/guide/en/beats/libbeat/5.2/elasticsearch-installation.html)

3. Verify that Elasticsearch is running with the command:

    ```bash
    curl http://127.0.0.1:9200
    ```

    You should see a response similar to this:

    ```json
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

For further instructions on installing Elastic search, refer to [Installation instructions](https://www.elastic.co/guide/en/elasticsearch/reference/5.2/_installation.html).

### Install Logstash

1. To install Logstash run the following commands:

    ```bash
    curl -L -O https://artifacts.elastic.co/downloads/logstash/logstash-5.2.0.deb
    sudo dpkg -i logstash-5.2.0.deb
    ```
2. Next we need to configure Logstash to access and parse the flow logs. Create a logstash.conf file using:

    ```bash
    sudo touch /etc/logstash/conf.d/logstash.conf
    ```

3. Add the following content to the file:

   ```
   input {
      azureblob
        {
            storage_account_name => "mystorageaccount"
            storage_access_key => "VGhpcyBpcyBhIGZha2Uga2V5Lg=="
            container => "insights-logs-networksecuritygroupflowevent"
            codec => "json"
            # Refer https://docs.microsoft.com/azure/network-watcher/network-watcher-read-nsg-flow-logs
            # Typical numbers could be 21/9 or 12/2 depends on the nsg log file types
            file_head_bytes => 12
            file_tail_bytes => 2
            # Enable / tweak these settings when event is too big for codec to handle.
            # break_json_down_policy => "with_head_tail"
            # break_json_batch_count => 2
        }
      }

      filter {
        split { field => "[records]" }
        split { field => "[records][properties][flows]"}
        split { field => "[records][properties][flows][flows]"}
        split { field => "[records][properties][flows][flows][flowTuples]"}

     mutate{
      split => { "[records][resourceId]" => "/"}
      add_field => {"Subscription" => "%{[records][resourceId][2]}"
                    "ResourceGroup" => "%{[records][resourceId][4]}"
                    "NetworkSecurityGroup" => "%{[records][resourceId][8]}"}
      convert => {"Subscription" => "string"}
      convert => {"ResourceGroup" => "string"}
      convert => {"NetworkSecurityGroup" => "string"}
      split => { "[records][properties][flows][flows][flowTuples]" => ","}
      add_field => {
                  "unixtimestamp" => "%{[records][properties][flows][flows][flowTuples][0]}"
                  "srcIp" => "%{[records][properties][flows][flows][flowTuples][1]}"
                  "destIp" => "%{[records][properties][flows][flows][flowTuples][2]}"
                  "srcPort" => "%{[records][properties][flows][flows][flowTuples][3]}"
                  "destPort" => "%{[records][properties][flows][flows][flowTuples][4]}"
                  "protocol" => "%{[records][properties][flows][flows][flowTuples][5]}"
                  "trafficflow" => "%{[records][properties][flows][flows][flowTuples][6]}"
                  "traffic" => "%{[records][properties][flows][flows][flowTuples][7]}"
                   }
      convert => {"unixtimestamp" => "integer"}
      convert => {"srcPort" => "integer"}
      convert => {"destPort" => "integer"}        
     }

     date{
       match => ["unixtimestamp" , "UNIX"]
     }
    }
   output {
     stdout { codec => rubydebug }
     elasticsearch {
       hosts => "localhost"
       index => "nsg-flow-logs"
     }
   }  
   ```

For further instructions on installing Logstash, refer to the [official documentation](https://www.elastic.co/guide/en/beats/libbeat/5.2/logstash-installation.html).

### Install the Logstash input plugin for Azure blob storage

This Logstash plugin will allow you to directly access the flow logs from their designated storage account. To install this plugin, from the default Logstash installation directory (in this case /usr/share/logstash/bin) run the command:

```bash
logstash-plugin install logstash-input-azureblob
```

To start Logstash run the command:

```bash
sudo /etc/init.d/logstash start
```

For more information about this plugin, refer to the [documentation](https://github.com/Azure/azure-diagnostics-tools/tree/master/Logstash/logstash-input-azureblob).

### Install Kibana

1. Run the following commands to install Kibana:

   ```bash
   curl -L -O https://artifacts.elastic.co/downloads/kibana/kibana-5.2.0-linux-x86_64.tar.gz
   tar xzvf kibana-5.2.0-linux-x86_64.tar.gz
   ```

2. To run Kibana use the commands:

   ```bash
   cd kibana-5.2.0-linux-x86_64/
   ./bin/kibana
   ```

3. To view your Kibana web interface, navigate to `http://localhost:5601`
4. For this scenario, the index pattern used for the flow logs is "nsg-flow-logs". You may change the index pattern in the "output" section of your logstash.conf file.
5. If you want to view the Kibana dashboard remotely, create an inbound NSG rule allowing access to **port 5601**.

### Create a Kibana dashboard

A sample dashboard to view trends and details in your alerts is shown in the following picture:

![figure 1][1]

Download the [dashboard file](https://aka.ms/networkwatchernsgflowlogdashboard), the [visualization file](https://aka.ms/networkwatchernsgflowlogvisualizations), and the [saved search file](https://aka.ms/networkwatchernsgflowlogsearch).

Under the **Management** tab of Kibana, navigate to **Saved Objects** and import all three files. Then from the **Dashboard** tab you can open and load the sample dashboard.

You can also create your own visualizations and dashboards tailored towards metrics of your own interest. Read more about creating Kibana visualizations from Kibana's [official documentation](https://www.elastic.co/guide/en/kibana/current/visualize.html).

### Visualize NSG flow logs

The sample dashboard provides several visualizations of the flow logs:

1. Flows by Decision/Direction Over Time - time series graphs showing the number of flows over the time period. You can edit the unit of time and span of both these visualizations. Flows by Decision shows the proportion of allow or deny decisions made, while Flows by Direction shows the proportion of inbound and outbound traffic. With these visuals you can examine traffic trends over time and look for any spikes or unusual patterns.

   ![figure2][2]

2. Flows by Destination/Source Port – pie charts showing the breakdown of flows to their respective ports. With this view you can see your most commonly used ports. If you click on a specific port within the pie chart, the rest of the dashboard will filter down to flows of that port.

   ![figure3][3]

3. Number of Flows and Earliest Log Time – metrics showing you the number of flows recorded and the date of the earliest log captured.

   ![figure4][4]

4. Flows by NSG and Rule – a bar graph showing you the distribution of flows within each NSG, as well as the distribution of rules within each NSG. From here you can see which NSG and rules generated the most traffic.

   ![figure5][5]

5. Top 10 Source/Destination IPs – bar charts showing the top 10 source and destination IPs. You can adjust these charts to show more or less top IPs. From here you can see the most commonly occurring IPs as well as the traffic decision (allow or deny) being made towards each IP.

   ![figure6][6]

6. Flow Tuples – this table shows you the information contained within each flow tuple, as well as its corresponding NGS and rule.

   ![figure7][7]

Using the query bar at the top of the dashboard, you can filter down the dashboard based on any parameter of the flows, such as subscription ID, resource groups, rule, or any other variable of interest. For more about Kibana's queries and filters, refer to the [official documentation](https://www.elastic.co/guide/en/beats/packetbeat/current/kibana-queries-filters.html)

## Conclusion

By combining the Network Security Group flow logs with the Elastic Stack, we have come up with powerful and customizable way to visualize our network traffic. These dashboards allow you to quickly gain and share insights about your network traffic, as well as filter down and investigate on any potential anomalies. Using Kibana, you can tailor these dashboards and create specific visualizations to meet any security, audit, and compliance needs.

## Next steps

Learn how to visualize your NSG flow logs with Power BI by visiting [Visualize NSG flows logs with Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md)

<!--Image references-->

[scenario]: ./media/network-watcher-visualize-nsg-flow-logs-open-source-tools/scenario.png
[1]: ./media/network-watcher-visualize-nsg-flow-logs-open-source-tools/figure1.png
[2]: ./media/network-watcher-visualize-nsg-flow-logs-open-source-tools/figure2.png
[3]: ./media/network-watcher-visualize-nsg-flow-logs-open-source-tools/figure3.png
[4]: ./media/network-watcher-visualize-nsg-flow-logs-open-source-tools/figure4.png
[5]: ./media/network-watcher-visualize-nsg-flow-logs-open-source-tools/figure5.png
[6]: ./media/network-watcher-visualize-nsg-flow-logs-open-source-tools/figure6.png
[7]: ./media/network-watcher-visualize-nsg-flow-logs-open-source-tools/figure7.png
