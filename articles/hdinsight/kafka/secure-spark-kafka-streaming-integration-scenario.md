---
title: Secure Spark and Kafka – Spark streaming integration scenario - Azure HDInsight
description: Learn how to secure Spark and Kafka streaming integration.
ms.service: hdinsight
ms.topic: how-to
ms.date: 10/20/2022
---

# Secure Spark and Kafka – Spark streaming integration scenario

Learn how to execute a Spark job in a secure Spark cluster that reads from a topic in secure Kafka cluster, provided the virtual networks are same/peered.

**Pre-requisites**

1. Create a secure Kafka cluster and secure spark cluster with the same AADDS domain and same vnet. If you prefer not to create both clusters in the same vnet, you can create them in two separate vnets and pair the vnets also. If you prefer not to create both clusters in the same vnet.
1. If your clusters are in different vnets, see here [Connect virtual networks with virtual network peering using the Azure portal](/azure/virtual-network/tutorial-connect-virtual-networks-portal)
1. Create key tabs for two users.  For example, `alicetest` and `bobadmin`. 

## What is a keytab?

A keytab is a file containing pairs of Kerberos principles and encrypted keys (which are derived from the Kerberos password). You can use a keytab file to authenticate to various remote systems using Kerberos without entering a password.

For details on how to create a keytab, see 
1. [KTUTIL](https://web.mit.edu/kerberos/krb5-1.12/doc/admin/admin_commands/ktutil.html)

1. https://www.ibm.com/docs/en/pasc/1.1?topic=file-creating-kerberos-principal-keytab

```
ktutil
ktutil: addent -password -p user1@TEST.COM -k 1 -e RC4-HMAC
Password for user1@TEST.COM:
ktutil: wkt user1.keytab
ktutil: q
```
 
3. Create a spark streaming java application that reads from Kafka topics. This document uses a DirectKafkaWorkCount example that was based off spark streaming examples from https://github.com/apache/spark/blob/branch-2.3/examples/src/main/java/org/apache/spark/examples/streaming/JavaDirectKafkaWordCount.java

### High level walkthrough of the Scenarios

Set up on Kafka cluster:
1. Create topics `alicetopic2`, `bobtopic2`
1. Produce data to topics `alicetopic2`, `bobtopic2`
1. Set up Ranger policy to allow `alicetest` user to read from `alicetopic*`
1. Set up Ranger policy to allow `bobadmin` user to read from *


### Scenarios to be executed on Spark cluster
1. Consume data from `alicetopic2` as `alicetest` user. The spark job would run successfully and the count of the words in the topic should be output in the YARN UI. The Ranger audit records in kafka cluster would show that access is allowed.
1. Consume data from `bobtopic2` as `alicetest `user. The spark job would fail with “org.apache.kafka.common.errors.TopicAuthorizationException: Not authorized to access topics: [bobtopic2]”. The Ranger audit records in kafka cluster would show that the access is Denied.
1. Consume data from `alicetopic2` as `bobadmin` user. The spark job would run successfully and the count of the words in the topic should be output in the YARN UI. The Ranger audit records in kafka cluster would show that access is allowed.
1. Consume data from `bobtopic2` as `bobadmin` user. The spark job would run successfully and the count of the words in the topic should be output in the YARN UI. The Ranger audit records in kafka cluster would show that access is allowed.


### Steps to be performed on Kafka cluster

In the Kafka cluster, set up Ranger policies and produce data from Kafka cluster that are explained in this section

1. Go to Ranger UI on kafka cluster and set up two Ranger policies

1. Add a Ranger policy for `alicetest` with consume access to topics with wildcard pattern `alicetopic*`

    :::image type="content" source="./media/hdinsight-spark-kafka/add-ranger-policy-for alicetest.png" alt-text="Screenshot showing how to add ranger policyfor alicetest":::
1. Add a Ranger policy for `bobadmin` with all accesses to all topics with wildcard pattern

    :::image type="content" source="./media/hdinsight-spark-kafka/add-ranger-policy-for-bobadmin.png" alt-text="Screenshot showing how to add ranger policy for bobadmin":::
    
1. Execute the commands below based on your parameter values

    ```
    sshuser@hn0-umasec:~$ sudo apt -y install jq 
    sshuser@hn0-umasec:~$ export clusterName='YOUR_CLUSTER_NAME'
    sshuser@hn0-umasec:~$ export TOPICNAME='YOUR_TOPIC_NAME'
    sshuser@hn0-umasec:~$ export password='YOUR_SSH_PASSWORD'
    sshuser@hn0-umasec:~$ export KAFKABROKERS=$(curl -sS -u admin:$password -G https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2);
    sshuser@hn0-umasec:~$ export KAFKAZKHOSTS=$(curl -sS -u admin:$password -G https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/ZOOKEEPER/components/ZOOKEEPER_SERVER | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")' | cut -d',' -f1,2);
    sshuser@hn0-umasec:~$ echo $KAFKABROKERS
    wn0-umasec.securehadooprc.onmicrosoft.com:9092,
    wn1-umasec.securehadooprc.onmicrosoft.com:9092
    ```
1. Create a keytab for user `bobadmin` using `ktutil` tool. 
1. Let's call this file `bobadmin.keytab`

    ```
    sshuser@hn0-umasec:~$ ktutil
    ktutil: addent -password -p bobadmin@SECUREHADOOPRC.ONMICROSOFT.COM -k 1 -e RC4-HMAC 
    Password for <username>@<DOMAIN.COM>
    ktutil: wkt bobadmin.keytab 
    ktutil: q
    Kinit the created keytab
    sudo kinit bobadmin@SECUREHADOOPRC.ONMICROSOFT.COM -t bobadmin.keytab
    ```
1. Create a `bobadmin_jaas.config`

    ```
    KafkaClient {
      com.sun.security.auth.module.Krb5LoginModule required
      useKeyTab=true
      storeKey=true
      keyTab="./bobadmin.keytab"
      useTicketCache=false
      serviceName="kafka"
      principal="bobadmin@SECUREHADOOPRC.ONMICROSOFT.COM";
    };
    ```
1. Create topics alicetopic2 and `bobtopic2` as `bobadmin`

    ```
    sshuser@hn0-umasec:~$ java -jar -Djava.security.auth.login.config=bobadmin_jaas.conf kafka-producer-consumer.jar create alicetopic2 $KAFKABROKERS
    sshuser@hn0-umasec:~$ java -jar -Djava.security.auth.login.config=bobadmin_jaas.conf kafka-producer-consumer.jar create bobtopic2 $KAFKABROKERS
    ```
1. Produce data to alicetopic2 as `bobadmin`

    ```
    sshuser@hn0-umasec:~$ java -jar -Djava.security.auth.login.config=bobadmin_jaas.conf kafka-producer-consumer.jar producer alicetopic2 $KAFKABROKERS
    ```
1. Produce data to bobtopic2 as `bobadmin`

    ```
    sshuser@hn0-umasec:~$ java -jar -Djava.security.auth.login.config=bobadmin_jaas.conf kafka-producer-consumer.jar producer bobadmin2 $KAFKABROKERS
    ```

### Set up steps to be performed on Spark cluster

In the Spark cluster, add entries in /etc/hosts in spark worker nodes, for kafka worker nodes, create keytabs, jaas_config files, and perform a spark-submit to submit a spark job to read from the kafka topic:
 
1. ssh into spark cluster with sshuser credentials

1. Make entries for the kafka worker nodes in /etc/hosts of the spark cluster.

    > [!Note]
    > Make the entry of these kafka worker nodes in every spark node (head node + worker node), You can get these details from kafka cluster in /etc/hosts of head node of Kafka.
    
    ```
    10.3.16.118 wn0-umasec.securehadooprc.onmicrosoft.com wn0-umasec wn0-umasec.securehadooprc.onmicrosoft.com. wn0-umasec.cu1cgjaim53urggr4psrgczloa.cx.internal.cloudapp.net
    
    10.3.16.145 wn1-umasec.securehadooprc.onmicrosoft.com wn1-umasec wn1-umasec.securehadooprc.onmicrosoft.com. wn1-umasec.cu1cgjaim53urggr4psrgczloa.cx.internal.cloudapp.net
    
    10.3.16.176 wn2-umasec.securehadooprc.onmicrosoft.com wn2-umasec wn2-umasec.securehadooprc.onmicrosoft.com. wn2-umasec.cu1cgjaim53urggr4psrgczloa.cx.internal.cloudapp.net
    ```
1. Create a keytab for user `bobadmin` using ktutil tool. Let's call this file `bobadmin.keytab`
 
1. Create a keytab for user `alicetest` using ktutil tool. Let's call this file `alicetest.keytab`
 
1. Create a `bobadmin_jaas.conf` as shown in below sample

    ```
    KafkaClient {
      com.sun.security.auth.module.Krb5LoginModule required
      useKeyTab=true
      storeKey=true
      keyTab="./bobadmin.keytab"
      useTicketCache=false
      serviceName="kafka"
      principal="bobadmin@SECUREHADOOPRC.ONMICROSOFT.COM";
    };
    ```
1. Create an alicetest_jaas.conf as shown in below sample
    ```
    KafkaClient {
      com.sun.security.auth.module.Krb5LoginModule required
      useKeyTab=true
      storeKey=true
      keyTab="./alicetest.keytab"
      useTicketCache=false
      serviceName="kafka"
      principal="alicetest@SECUREHADOOPRC.ONMICROSOFT.COM";
    };
    ```
1. Get the spark-streaming jar ready. 

Build your own jar that reads from a kafka topic by following the example and instructions here:
DirectKafkaWorkCount

> [!Note]
> For convenience, this sample jar used in this example was built from https://github.com/markgrover/spark-secure-kafka-app by following these steps.

```
sudo apt install maven
git clone https://github.com/markgrover/spark-secure-kafka-app.git
cd spark-secure-kafka-app
mvn clean package
cd target
```

A sample jar -  add a jar file.

## Scenario 1

From Spark cluster, read from kafka topic alicetopic2 as user alicetest is allowed

1. Run a `kdestroy` command to remove the Kerberos tickets in Credential Cache by issuing following command

    ```
    kdestroy
    ```
    Kinit with alicetest

    ```
    sshuser@hn0-umaspa:~$ kinit alicetest@SECUREHADOOPRC.ONMICROSOFT.COM -t alicetest.keytab
    ```
     
1. Run a spark-submit command to read from kafka topic `alicetopic2` as alicetest
 
    ```spark-submit --num-executors 1 --master yarn --deploy-mode cluster --packages <list of packages the jar depends on> --repositories <repository for the dependency packages> --files alicetest_jaas.conf#alicetest_jaas.conf,alicetest.keytab#alicetest.keytab --driver-java-options "-Djava.security.auth.login.config=./alicetest_jaas.conf" --class <classname to execute in jar> --conf "spark.executor.extraJavaOptions=-Djava.security.auth.login.config=./alicetest_jaas.conf" <path to jar> <kafkabrokerlist> <topicname> false
    ```
    For example,
    ```
    sshuser@hn0-umaspa:~$ spark-submit --num-executors 1 --master yarn --deploy-mode cluster --packages org.apache.spark:spark-streaming-kafka-0-10_2.11:2.3.2.3.1.0.4-1 --repositories http://repo.hortonworks.com/content/repositories/releases/ --files alicetest_jaas.conf#alicetest_jaas.conf,alicetest.keytab#alicetest.keytab --driver-java-options "-Djava.security.auth.login.config=./alicetest_jaas.conf" --class com.cloudera.spark.examples.DirectKafkaWordCount --conf "spark.executor.extraJavaOptions=-Djava.security.auth.login.config=./alicetest_jaas.conf" /home/sshuser/spark-secure-kafka-app/target/spark-secure-kafka-app-1.0-SNAPSHOT.jar 10.3.16.118:9092 alicetopic2 false
    ```

If you see the below error
    ```
    Caused by: GSSException: No valid credentials provided (Mechanism level: Server not found in Kerberos database (7))
            at sun.security.jgss.krb5.Krb5Context.initSecContext(Krb5Context.java:770)
            at sun.security.jgss.GSSContextImpl.initSecContext(GSSContextImpl.java:248)
            at sun.security.jgss.GSSContextImpl.initSecContext(GSSContextImpl.java:179)
            at com.sun.security.sasl.gsskerb.GssKrb5Client.evaluateChallenge(GssKrb5Client.java:192)
    ```

This error denotes the DNS (Domain Name Server) issue. Make sure to check Kafka worker nodes entry in /etc/hosts file in spark cluster.

1. From YARN UI, access the YARN job output you can see the `alicetest` user is able to read from `alicetopic2`. You can see the word count in the output.

1. Below are the detailed steps on how to check the application output from YARN UI.

    1. Go to YARN UI and open your application. Wait for the job to go to RUNNING state. You'll see the application details as below.
    
         :::image type="content" source="./media/hdinsight-spark-kafka/yarn-application-status.png" alt-text="Screenshot showing YARN application status":::        
         
    1. Click on Logs. You'll see the list of logs as shown below.
    
        :::image type="content" source="./media/hdinsight-spark-kafka/logs-for-container-summary.png" alt-text="Screenshot showing logs-for container summary":::
        
    1. Click on 'stdout'. You'll see the output with the count of words from your Kafka topic.
    
        :::image type="content" source="./media/hdinsight-spark-kafka/bobtopic-job-fail.png" alt-text="Screenshot showing bobtopic job failed status":::        
        
    1. On the Kafka cluster’s Ranger UI, audit logs for the same will be shown.
    
        :::image type="content" source="./media/hdinsight-spark-kafka/kafka-cluster-ranger-ui-audit-logs-denied.png" alt-text="Screenshot showing Kafka cluster ranger UI audit logs in denied status":::
    
### Scenario 2

From Spark cluster, read Kafka topic bobtopic2 as user alicetest is denied

1. Run `kdestroy` command to remove the Kerberos tickets in Credential Cache by issuing following command `kinit` with `alicetest`

    ```
    sshuser@hn0-umaspa:~$ kinit alicetest@SECUREHADOOPRC.ONMICROSOFT.COM -t alicetest.keytab
    ```

1. Run spark-submit command to read from kafka topic "bobtopic2" as alicetest
 
    ```
    spark-submit --num-executors 1 --master yarn --deploy-mode cluster --packages <list of packages the jar depends on> --repositories <repository for the dependency packages> --files alicetest_jaas.conf#alicetest_jaas.conf,alicetest.keytab#alicetest.keytab --driver-java-options "-Djava.security.auth.login.config=./alicetest_jaas.conf" --class <classname to execute in jar> --conf "spark.executor.extraJavaOptions=-Djava.security.auth.login.config=./alicetest_jaas.conf" <path to jar> <kafkabrokerlist> <topicname> false
    ```
 
    For example,

    ```
    sshuser@hn0-umaspa:~$ spark-submit --num-executors 1 --master yarn --deploy-mode cluster --packages org.apache.spark:spark-streaming-kafka-0-10_2.11:2.3.2.3.1.0.4-1 --repositories http://repo.hortonworks.com/content/repositories/releases/ --files alicetest_jaas.conf#alicetest_jaas.conf,alicetest.keytab#alicestest.keytab --driver-java-options "-Djava.security.auth.login.config=./alicetest_jaas.conf" --class com.cloudera.spark.examples.DirectKafkaWordCount --conf "spark.executor.extraJavaOptions=-Djava.security.auth.login.config=./alicetest_jaas.conf" /home/sshuser/spark-secure-kafka-app/target/spark-secure-kafka-app-1.0-SNAPSHOT.jar 10.3.16.118:9092 bobtopic2 false
    ```
     
1. From yarn UI, access the yarn job output you can see that alicetest user is unable to read from bobtopic1 and the job fails.

    :::image type="content" source="./media/hdinsight-spark-kafka/yarn-job-output.png" alt-text="Screenshot showing YARN-job-output":::
    
1. On the Kafka cluster’s Ranger UI, audit logs for the same will be shown.
 
    :::image type="content" source="./media/hdinsight-spark-kafka/kafka-cluster-ranger-ui-audit-logs-allowed.png" alt-text="Screenshot showing Kafka cluster-ranger UI audit logs in allowed status":::        
    
### Scenario 3

From Spark cluster, read from kafka topic alicetopic2 as user `bobadmin` is allowed

1. Run`kdestroy` command to remove the Kerberos tickets in Credential Cache.

    `kdestroy`
 
1. Run `kinit` command with `bobadmin`

    ```
    sshuser@hn0-umaspa:~$ kinit bobadmin@SECUREHADOOPRC.ONMICROSOFT.COM -t bobadmin.keytab
    ```
    
1. Run `spark-submit` command to read from kafka topic `alicetopic2` as `bobadmin`

    ```
    spark-submit --num-executors 1 --master yarn --deploy-mode cluster --packages <list of packages the jar depends on> --repositories <repository for the dependency packages> --files bobadmin_jaas.conf#bobadmin_jaas.conf,bobadmin.keytab#bobadmin.keytab --driver-java-options "-Djava.security.auth.login.config=./bobadmin_jaas.conf" --class <classname to execute in jar> --conf "spark.executor.extraJavaOptions=-Djava.security.auth.login.config=./bobadmin_jaas.conf" <path to jar> <kafkabrokerlist> <topicname> false
    ```
 
    For example,
    ```
    spark-submit --num-executors 1 --master yarn --deploy-mode cluster --packages org.apache.spark:spark-streaming-kafka-0-10_2.11:2.3.2.3.1.0.4-1 --repositories http://repo.hortonworks.com/content/repositories/releases/ --files bobadmin_jaas.conf#bobadmin_jaas.conf,bobadmin.keytab#bobadmin.keytab --driver-java-options "-Djava.security.auth.login.config=./bobadmin_jaas.conf" --class com.cloudera.spark.examples.DirectKafkaWordCount --conf "spark.executor.extraJavaOptions=-Djava.security.auth.login.config=./bobadmin_jaas.conf" /home/sshuser/spark-secure-kafka-app/target/spark-secure-kafka-app-1.0-SNAPSHOT.jar wn0-umasec:9092, wn1-umasec:9092 alicetopic2 false
    ```
 
1. From YARN UI, access the yarn job output you can see that `bobtest` user is able to read from alicetopic2 and the count of words is seen in the output.

    :::image type="content" source="./media/hdinsight-spark-kafka/bobtest-user-reads-from-bobtopic2.png" alt-text="Screenshot showing bobtest user reads from bobtopic":::
    
1. On the Kafka cluster’s Ranger UI, audit logs for the same will be shown.

    :::image type="content" source="./media/hdinsight-spark-kafka/audit-logs-with-sucess-state.png" alt-text="Screenshot showing audit logs with success state":::

### Scenario 4

From Spark cluster, read from Kafka topic bobtopic2 as user bobadmin2 is allowed.

1. Remove the Kerberos tickets in Credential Cache by running following command

    `kdestroy`

1. kinit with bobadmin.
    ```
    sshuser@hn0-umaspa:~$ kinit bobadmin@SECUREHADOOPRC.ONMICROSOFT.COM -t bobadmin.keytab
    ```
1. Run a `spark-submit` command to read from Kafka topic `bobtopic2` as `bobadmin`
    ```
    spark-submit --num-executors 1 --master yarn --deploy-mode cluster --packages <list of packages the jar depends on> --repositories <repository for the dependency packages> --files bobadmin_jaas.conf#bobadmin_jaas.conf,bobadmin.keytab#bobadmin.keytab --driver-java-options "-Djava.security.auth.login.config=./bobadmin_jaas.conf" --class <classname to execute in jar> --conf "spark.executor.extraJavaOptions=-Djava.security.auth.login.config=./bobadmin_jaas.conf" <path to jar> <kafkabrokerlist> <topicname> false
    ```
    For example,
    ```
    spark-submit --num-executors 1 --master yarn --deploy-mode cluster --packages org.apache.spark:spark-streaming-kafka-0-10_2.11:2.3.2.3.1.0.4-1 --repositories http://repo.hortonworks.com/content/repositories/releases/ --files bobadmin_jaas.conf#bobadmin_jaas.conf,bobadmin.keytab#bobadmin.keytab --driver-java-options "-Djava.security.auth.login.config=./bobadmin_jaas.conf" --class com.cloudera.spark.examples.DirectKafkaWordCount --conf "spark.executor.extraJavaOptions=-Djava.security.auth.login.config=./bobadmin_jaas.conf" /home/sshuser/spark-secure-kafka-app/target/spark-secure-kafka-app-1.0-SNAPSHOT.jar wn0-umasec:9092, wn1-umasec:9092 bobtopic2 false
    ```
1. From YARN UI, access the YARN job output you can see that `bobtest` user is able to read from `bobtopic2` and the count of words is seen in the output.
    
    :::image type="content" source="./media/hdinsight-spark-kafka/audit-logs-with-word-count-spark-kafka.png" alt-text="Screenshot showing for scenario 4 audit logs with word count":::

1. On the Kafka cluster’s Ranger UI, audit logs for the same will be shown.

    :::image type="content" source="./media/hdinsight-spark-kafka/audit-logs-with-sucess-state-spark-kafka.png" alt-text="Screenshot showing for scenario 4 audit logs with success state":::

