---
title: How to create Kafka table on Apache FlinkSQL - Azure portal
description: Learn how to create Kafka table on Apache FlinkSQL
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Create Kafka table on Apache FlinkSQL

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Using this example, learn how to Create Kafka table on Apache FlinkSQL.

## Prerequisites

* [HDInsight Kafka](../../hdinsight/kafka/apache-kafka-get-started.md)
* [HDInsight on AKS Apache Flink 1.16.0](../flink/flink-create-cluster-portal.md)

## Kafka SQL connector on Apache Flink

The Kafka connector allows for reading data from and writing data into Kafka topics. For more information, refer [Apache Kafka SQL Connector](https://nightlies.apache.org/flink/flink-docs-master/docs/connectors/table/kafka)

## Create a Kafka table on Apache Flink SQL

### Prepare topic and data on HDInsight Kafka

**Prepare messages with weblog.py**

``` Python
import random
import json
import time
from datetime import datetime

user_set = [
        'John',
        'XiaoMing',
        'Mike',
        'Tom',
        'Machael',
        'Zheng Hu',
        'Zark',
        'Tim',
        'Andrew',
        'Pick',
        'Sean',
        'Luke',
        'Chunck'
]

web_set = [
        'https://google.com',
        'https://facebook.com?id=1',
        'https://tmall.com',
        'https://baidu.com',
        'https://taobao.com',
        'https://aliyun.com',
        'https://apache.com',
        'https://flink.apache.com',
        'https://hbase.apache.com',
        'https://github.com',
        'https://gmail.com',
        'https://stackoverflow.com',
        'https://python.org'
]

def main():
        while True:
                if random.randrange(10) < 4:
                        url = random.choice(web_set[:3])
                else:
                        url = random.choice(web_set)

                log_entry = {
                        'userName': random.choice(user_set),
                        'visitURL': url,
                        'ts': datetime.now().strftime("%m/%d/%Y %H:%M:%S")
                }

                print(json.dumps(log_entry))
                time.sleep(0.05)

if __name__ == "__main__":
    main()
```

**Pipeline to Kafka topic**

```
sshuser@hn0-contsk:~$ python weblog.py | /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --bootstrap-server wn0-contsk:9092 --topic click_events
```

**Other commands:**

```
-- create topic
/usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 3 --topic click_events --bootstrap-server wn0-contsk:9092

-- delete topic
/usr/hdp/current/kafka-broker/bin/kafka-topics.sh --delete  --topic click_events --bootstrap-server wn0-contsk:9092

-- consume topic
sshuser@hn0-contsk:~$ /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --bootstrap-server wn0-contsk:9092 --topic click_events --from-beginning
{"userName": "Luke", "visitURL": "https://flink.apache.com", "ts": "06/26/2023 14:33:43"}
{"userName": "Tom", "visitURL": "https://stackoverflow.com", "ts": "06/26/2023 14:33:43"}
{"userName": "Chunck", "visitURL": "https://google.com", "ts": "06/26/2023 14:33:44"}
{"userName": "Chunck", "visitURL": "https://facebook.com?id=1", "ts": "06/26/2023 14:33:44"}
{"userName": "John", "visitURL": "https://tmall.com", "ts": "06/26/2023 14:33:44"}
{"userName": "Andrew", "visitURL": "https://facebook.com?id=1", "ts": "06/26/2023 14:33:44"}
{"userName": "John", "visitURL": "https://tmall.com", "ts": "06/26/2023 14:33:44"}
{"userName": "Pick", "visitURL": "https://google.com", "ts": "06/26/2023 14:33:44"}
{"userName": "Mike", "visitURL": "https://tmall.com", "ts": "06/26/2023 14:33:44"}
{"userName": "Zheng Hu", "visitURL": "https://tmall.com", "ts": "06/26/2023 14:33:44"}
{"userName": "Luke", "visitURL": "https://facebook.com?id=1", "ts": "06/26/2023 14:33:44"}
{"userName": "John", "visitURL": "https://flink.apache.com", "ts": "06/26/2023 14:33:44"}

```

### Apache Flink SQL client

Detailed instructions are provided on how to use Secure Shell for [Flink SQL client](./flink-web-ssh-on-portal-to-flink-sql.md)

### Download Kafka SQL Connector & Dependencies into SSH

We're using the **Kafka 3.2.0** dependencies in the below step, You're required to update the command based on your Kafka version on HDInsight. 
```
wget https://repo1.maven.org/maven2/org/apache/kafka/kafka-clients/3.2.0/kafka-clients-3.2.0.jar
wget https://repo1.maven.org/maven2/org/apache/flink/flink-connector-kafka/1.16.0/flink-connector-kafka-1.16.0.jar
```

### Connect to Apache Flink SQL Client

Let's now connect to the Flink SQL Client with Kafka SQL client jars
```
msdata@pod-0 [ /opt/flink-webssh ]$ bin/sql-client.sh -j flink-connector-kafka-1.16.0.jar -j kafka-clients-3.2.0.jar
```

### Create Kafka table on Apache Flink SQL

Let's create the Kafka table on Flink SQL, and select the Kafka table on Flink SQL. 

You're required to update your Kafka bootstrap server IPs in the below snippet.

``` sql
CREATE TABLE KafkaTable (
`userName` STRING,
`visitURL` STRING,
`ts` TIMESTAMP(3) METADATA FROM 'timestamp'
) WITH (
'connector' = 'kafka',
'topic' = 'click_events',
'properties.bootstrap.servers' = '<update-kafka-bootstrapserver-ip>:9092,<update-kafka-bootstrapserver-ip>:9092,<update-kafka-bootstrapserver-ip>:9092',
'properties.group.id' = 'my_group',
'scan.startup.mode' = 'earliest-offset',
'format' = 'json'
);

select * from KafkaTable;
``` 

:::image type="content" source="./media/create-kafka-table-flink-kafka-sql-connector/create-and-select-kafka-table-on-flink-sql.png" alt-text="Screenshot showing how to create and select Kafka table on Flink SQL.":::

### Produce Kafka messages

Let's now produce Kafka messages to the same topic, using HDInsight Kafka 
```
python weblog.py | /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --bootstrap-server wn0-contsk:9092 --topic click_events
```

### Table on Apache Flink SQL

You can monitor the table on Flink SQL

:::image type="content" source="./media/create-kafka-table-flink-kafka-sql-connector/monitor-table-data-on-flink-sql.png" alt-text="Screenshot showing How to monitor table date on Flink SQL.":::

Here are the streaming jobs on Flink Web UI

:::image type="content" source="./media/create-kafka-table-flink-kafka-sql-connector/flink-web-ui-kafka-jobs.png" alt-text="Screenshot showing jobs on the Flink web UI.":::

## Reference

* [Apache Kafka SQL Connector](https://nightlies.apache.org/flink/flink-docs-master/docs/connectors/table/kafka)
