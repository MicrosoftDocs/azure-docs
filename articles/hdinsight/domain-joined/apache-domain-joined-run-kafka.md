---
title: Tutorial - Apache Kafka & Enterprise Security Package - Azure HDInsight
description: Tutorial - Learn how to configure Apache Ranger policies for Kafka in Azure HDInsight with Enterprise Security Package.
ms.service: hdinsight
ms.topic: tutorial
ms.date: 05/25/2023
---

# Tutorial: Configure Apache Kafka policies in HDInsight with Enterprise Security Package

Learn how to configure Apache Ranger policies for Enterprise Security Package (ESP) Apache Kafka clusters. ESP clusters are connected to a domain allowing users to authenticate with domain credentials. In this tutorial, you create two Ranger policies to restrict access to `sales` and `marketingspend` topics.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create domain users.
> * Create Ranger policies.
> * Create topics in a Kafka cluster.
> * Test Ranger policies.

## Prerequisite

An [HDInsight Kafka cluster with Enterprise Security Package](./apache-domain-joined-configure-using-azure-adds.md).

## Connect to Apache Ranger Admin UI

1. From a browser, connect to the Ranger Admin user interface (UI) by using the URL `https://ClusterName.azurehdinsight.net/Ranger/`. Remember to change `ClusterName` to the name of your Kafka cluster. Ranger credentials aren't the same as Hadoop cluster credentials. To prevent browsers from using cached Hadoop credentials, use a new InPrivate browser window to connect to the Ranger Admin UI.

1. Sign in by using your Microsoft Entra admin credentials. The Microsoft Entra admin credentials aren't the same as HDInsight cluster credentials or Linux HDInsight node SSH credentials.

   :::image type="content" source="./media/apache-domain-joined-run-kafka/apache-ranger-admin-login.png" alt-text="Screenshot that shows the HDInsight Apache Ranger Admin UI." border="true":::

## Create domain users

To learn how to create the **sales_user** and **marketing_user** domain users, see [Create a HDInsight cluster with Enterprise Security Package](./apache-domain-joined-configure-using-azure-adds.md). In a production scenario, domain users come from your Microsoft Entra ID tenant.

## Create a Ranger policy

Create a Ranger policy for **sales_user** and **marketing_user**.

1. Open the **Ranger Admin UI**.

1. Under **Kafka**, select **\<ClusterName>_kafka**. One preconfigured policy might be listed.

1. Select **Add New Policy** and enter the following values:

   |Setting  |Suggested value  |
   |---------|---------|
   |Policy Name  |  hdi sales* policy   |
   |Topic   |  sales* |
   |Select User  |  sales_user1 |
   |Permissions  | publish, consume, create |

   The following wildcards can be included in the topic name:

   * `*` indicates zero or more occurrences of characters.
   * `?` indicates single character.

   :::image type="content" source="./media/apache-domain-joined-run-kafka/apache-ranger-admin-create-policy.png" alt-text="Screenshot that shows the Apache Ranger Admin UI Create Policy1." border="true":::

   Wait a few moments for Ranger to sync with Microsoft Entra ID if a domain user isn't automatically populated for **Select User**.

1. Select **Add** to save the policy.

1. Select **Add New Policy** and then enter the following values:

   |Setting  |Suggested value  |
   |---------|---------|
   |Policy Name  |  hdi marketing policy   |
   |Topic   |  marketingspend |
   |Select User  |  marketing_user1 |
   |Permissions  | publish, consume, create |

   :::image type="content" source="./media/apache-domain-joined-run-kafka/apache-ranger-admin-create-policy-2.png" alt-text="Screenshot that shows the Apache Ranger Admin UI Create Policy2." border="true":::

1. Select **Add** to save the policy.

## Create topics in a Kafka cluster with ESP

To create two topics, `salesevents` and `marketingspend`:

1. Use the following command to open a Secure Shell (SSH) connection to the cluster:

   ```cmd
   ssh DOMAINADMIN@CLUSTERNAME-ssh.azurehdinsight.net
   ```

   Replace `DOMAINADMIN` with the admin user for your cluster configured during [cluster creation](./apache-domain-joined-configure-using-azure-adds.md#create-an-hdinsight-cluster-with-esp). Replace `CLUSTERNAME` with the name of your cluster. If prompted, enter the password for the admin user account. For more information on using `SSH` with HDInsight, see [Use SSH with HDInsight](../../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md).

1. Use the following commands to save the cluster name to a variable and install a JSON parsing utility `jq`. When prompted, enter the Kafka cluster name.

   ```bash
   sudo apt -y install jq
   read -p 'Enter your Kafka cluster name:' CLUSTERNAME
   ```

1. Use the following commands to get the Kafka broker hosts. When prompted, enter the password for the cluster admin account.

   ```bash
   export KAFKABROKERS=`curl -sS -u admin -G https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2`; \
   ```

   Before you proceeding, you might need to set up your development environment if you haven't already done so. You need components such as the Java JDK, Apache Maven, and an SSH client with Secure Copy (SCP). For more information, see [Setup instructions](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/tree/master/DomainJoined-Producer-Consumer).

1. Download the [Apache Kafka domain-joined producer consumer examples](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/tree/master/DomainJoined-Producer-Consumer).

1. Follow steps 2 and 3 under **Build and deploy the example** in [Tutorial: Use the Apache Kafka Producer and Consumer APIs](../kafka/apache-kafka-producer-consumer-api.md#build-and-deploy-the-example).
   > [!NOTE]
   > For this tutorial, use `kafka-producer-consumer.jar` under the `DomainJoined-Producer-Consumer` project. Don't use the one under the `Producer-Consumer` project, which is for non-domain-joined scenarios.

1. Run the following commands:

   ```bash
   java -jar -Djava.security.auth.login.config=/usr/hdp/current/kafka-broker/conf/kafka_client_jaas.conf kafka-producer-consumer.jar create salesevents $KAFKABROKERS
   java -jar -Djava.security.auth.login.config=/usr/hdp/current/kafka-broker/conf/kafka_client_jaas.conf kafka-producer-consumer.jar create marketingspend $KAFKABROKERS
   ```

## Test the Ranger policies

Based on the Ranger policies configured, **sales_user** can produce/consume the topic `salesevents` but not the topic `marketingspend`. Conversely, **marketing_user** can produce/consume the topic `marketingspend` but not the topic `salesevents`.

1. Open a new SSH connection to the cluster. Use the following command to sign in as **sales_user1**:

   ```bash
   ssh sales_user1@CLUSTERNAME-ssh.azurehdinsight.net
   ```

1. Use the broker names from the previous section to set the following environment variable:

   ```bash
   export KAFKABROKERS=<brokerlist>:9092
   ```

   Example: `export KAFKABROKERS=<brokername1>.contoso.com:9092,<brokername2>.contoso.com:9092`

1. Follow step 3 under **Build and deploy the example** in [Tutorial: Use the Apache Kafka Producer and Consumer APIs](../kafka/apache-kafka-producer-consumer-api.md#build-and-deploy-the-example) to ensure that `kafka-producer-consumer.jar` is also available to **sales_user**.

   > [!NOTE]
   > For this tutorial, use `kafka-producer-consumer.jar` under the "DomainJoined-Producer-Consumer" project. Don't use the one under the "Producer-Consumer" project, which is for non-domain-joined scenarios.

1. Verify that **sales_user1** can produce to topic `salesevents` by running the following command:

   ```bash
   java -jar -Djava.security.auth.login.config=/usr/hdp/current/kafka-broker/conf/kafka_client_jaas.conf kafka-producer-consumer.jar producer salesevents $KAFKABROKERS
   ```

1. Run the following command to consume from the topic `salesevents`:

   ```bash
   java -jar -Djava.security.auth.login.config=/usr/hdp/current/kafka-broker/conf/kafka_client_jaas.conf kafka-producer-consumer.jar consumer salesevents $KAFKABROKERS
   ```

   Verify that you can read the messages.

1. Verify that the **sales_user1** can't produce to the topic `marketingspend` by running the following command in the same SSH window:

   ```bash
   java -jar -Djava.security.auth.login.config=/usr/hdp/current/kafka-broker/conf/kafka_client_jaas.conf kafka-producer-consumer.jar producer marketingspend $KAFKABROKERS
   ```

   An authorization error occurs and can be ignored.

1. Notice that **marketing_user1** can't consume from the topic `salesevents`.

   Repeat the preceding steps 1 to 3, but this time as **marketing_user1**.

   Run the following command to consume from the topic `salesevents`:

   ```bash
   java -jar -Djava.security.auth.login.config=/usr/hdp/current/kafka-broker/conf/kafka_client_jaas.conf kafka-producer-consumer.jar consumer salesevents $KAFKABROKERS
   ```

   Previous messages can't be seen.

1. View the audit access events from the Ranger UI.

   :::image type="content" source="./media/apache-domain-joined-run-kafka/apache-ranger-admin-audit.png" alt-text="Screenshot that shows the Ranger UI policy audit access events." border="true":::

## Produce and consume topics in ESP Kafka by using the console

> [!NOTE]
> You can't use console commands to create topics. Instead, you must use the Java code demonstrated in the preceding section. For more information, see [Create topics in a Kafka cluster with ESP](#create-topics-in-a-kafka-cluster-with-esp).

To produce and consume topics in ESP Kafka by using the console:

1. Use `kinit` with the user's username. Enter the password when prompted.

   ```bash
   kinit sales_user1
   ```

1. Set environment variables:

   ```bash
   export KAFKA_OPTS="-Djava.security.auth.login.config=/usr/hdp/current/kafka-broker/conf/kafka_client_jaas.conf"
   export KAFKABROKERS=<brokerlist>:9092
   ```

1. Produce messages to the topic `salesevents`:

   ```bash
   /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --topic salesevents --broker-list $KAFKABROKERS --producer-property security.protocol=SASL_PLAINTEXT
   ```

1. Consume messages from the topic `salesevents`:

   ```bash
   /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --topic salesevents --from-beginning --bootstrap-server $KAFKABROKERS --consumer-property security.protocol=SASL_PLAINTEXT
   ```

## Produce and consume topics for a long-running session in ESP Kafka

The Kerberos ticket cache has an expiration limitation. For a long-running session, use a keytab instead of renewing the ticket cache manually.

To use a keytab in a long-running session without `kinit`:

1. Create a new keytab for your domain user:

   ```bash
   ktutil
   addent -password -p <user@domain> -k 1 -e RC4-HMAC
   wkt /tmp/<user>.keytab
   q

   ```
1. Create `/home/sshuser/kafka_client_jaas.conf`. It should have the following lines:

   ```
   KafkaClient {
    com.sun.security.auth.module.Krb5LoginModule required
    useKeyTab=true
    storeKey=true
    keyTab="/tmp/<user>.keytab"
    useTicketCache=false
    serviceName="kafka"
    principal="<user@domain>";
   };
   ```

1. Replace `java.security.auth.login.config` with `/home/sshuser/kafka_client_jaas.conf` and produce or consume the topic by using the console or API:

   ```
   export KAFKABROKERS=<brokerlist>:9092
   
   # console tool
   export KAFKA_OPTS="-Djava.security.auth.login.config=/home/sshuser/kafka_client_jaas.conf"
   /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --topic salesevents --broker-list $KAFKABROKERS --producer-property security.protocol=SASL_PLAINTEXT
   /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --topic salesevents --from-beginning --bootstrap-server $KAFKABROKERS --consumer-property security.protocol=SASL_PLAINTEXT
   
   # API
   java -jar -Djava.security.auth.login.config=/home/sshuser/kafka_client_jaas.conf kafka-producer-consumer.jar producer salesevents $KAFKABROKERS
   java -jar -Djava.security.auth.login.config=/home/sshuser/kafka_client_jaas.conf kafka-producer-consumer.jar consumer salesevents $KAFKABROKERS
   ```

## Clean up resources

If you aren't going to continue to use this application, delete the Kafka cluster that you created:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the **Search** box at the top, enter **HDInsight**.
1. Under **Services**, select **HDInsight clusters**.
1. In the list of HDInsight clusters that appears, select the **...** next to the cluster that you created for this tutorial.
1. Select **Delete** > **Yes**.

## Troubleshooting

If `kafka-producer-consumer.jar` doesn't work in a domain-joined cluster, make sure that you're using `kafka-producer-consumer.jar` under the `DomainJoined-Producer-Consumer` project. Don't use the one under the `Producer-Consumer` project, which is for non-domain-joined scenarios.

## Next steps

> [!div class="nextstepaction"]
> [Customer-managed key disk encryption](../disk-encryption.md)
