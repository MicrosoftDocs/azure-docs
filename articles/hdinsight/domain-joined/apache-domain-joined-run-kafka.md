---
title: Tutorial - Apache Kafka & Enterprise Security - Azure HDInsight
description: Tutorial - Learn how to configure Apache Ranger policies for Kafka in Azure HDInsight with Enterprise Security Package.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: tutorial
ms.date: 05/19/2020
---

# Tutorial: Configure Apache Kafka policies in HDInsight with Enterprise Security Package (Preview)

Learn how to configure Apache Ranger policies for Enterprise Security Package (ESP) Apache Kafka clusters. ESP clusters are connected to a domain allowing users to authenticate with domain credentials. In this tutorial, you create two Ranger policies to restrict access to `sales` and `marketingspend` topics.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create domain users
> * Create Ranger policies
> * Create topics in a Kafka cluster
> * Test Ranger policies

## Prerequisite

A [HDInsight Kafka cluster with Enterprise Security Package](./apache-domain-joined-configure-using-azure-adds.md).

## Connect to Apache Ranger Admin UI

1. From a browser, connect to the Ranger Admin user interface using the URL `https://ClusterName.azurehdinsight.net/Ranger/`. Remember to change `ClusterName` to the name of your Kafka cluster. Ranger credentials are not the same as Hadoop cluster credentials. To prevent browsers from using cached Hadoop credentials, use a new InPrivate browser window to connect to the Ranger Admin UI.

2. Sign in using your Azure Active Directory (AD) admin credentials. The Azure AD admin credentials aren't the same as HDInsight cluster credentials or Linux HDInsight node SSH credentials.

   ![HDInsight Apache Ranger Admin UI](./media/apache-domain-joined-run-kafka/apache-ranger-admin-login.png)

## Create domain users

Visit [Create a HDInsight cluster with Enterprise Security Package](./apache-domain-joined-configure-using-azure-adds.md), to learn how to create the **sales_user** and **marketing_user** domain users. In a production scenario, domain users come from your Active Directory tenant.

## Create Ranger policy

Create a Ranger policy for **sales_user** and **marketing_user**.

1. Open the **Ranger Admin UI**.

2. Select **\<ClusterName>_kafka** under **Kafka**. One pre-configured policy may be listed.

3. Select **Add New Policy** and enter the following values:

   |Setting  |Suggested value  |
   |---------|---------|
   |Policy Name  |  hdi sales* policy   |
   |Topic   |  sales* |
   |Select User  |  sales_user1 |
   |Permissions  | publish, consume, create |

   The following wildcards can be included in the topic name:

   * ’*’ indicates zero or more occurrences of characters.
   * ’?‘ indicates single character.

   ![Apache Ranger Admin UI Create Policy1](./media/apache-domain-joined-run-kafka/apache-ranger-admin-create-policy.png)

   Wait a few moments for Ranger to sync with Azure AD if a domain user is not automatically populated for **Select User**.

4. Select **Add** to save the policy.

5. Select **Add New Policy** and then enter the following values:

   |Setting  |Suggested value  |
   |---------|---------|
   |Policy Name  |  hdi marketing policy   |
   |Topic   |  marketingspend |
   |Select User  |  marketing_user1 |
   |Permissions  | publish, consume, create |

   ![Apache Ranger Admin UI Create Policy2](./media/apache-domain-joined-run-kafka/apache-ranger-admin-create-policy-2.png)  

6. Select **Add** to save the policy.

## Create topics in a Kafka cluster with ESP

To create two topics, `salesevents` and `marketingspend`:

1. Use the following command to open an SSH connection to the cluster:

   ```cmd
   ssh DOMAINADMIN@CLUSTERNAME-ssh.azurehdinsight.net
   ```

   Replace `DOMAINADMIN` with the admin user for your cluster configured during [cluster creation](./apache-domain-joined-configure-using-azure-adds.md#create-an-hdinsight-cluster-with-esp), and replace `CLUSTERNAME` with the name of your cluster. If prompted, enter the password for the admin user account. For more information on using `SSH` with HDInsight, see [Use SSH with HDInsight](../../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md).

2. Use the following commands to save the cluster name to a variable and install a JSON parsing utility `jq`. When prompted, enter the Kafka cluster name.

   ```bash
   sudo apt -y install jq
   read -p 'Enter your Kafka cluster name:' CLUSTERNAME
   ```

3. Use the following commands to get the Kafka broker hosts. When prompted, enter the password for the cluster admin account.

   ```bash
   export KAFKABROKERS=`curl -sS -u admin -G https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2`; \
   ```

   Before proceeding, you may need to set up your development environment if you have not already done so. You will need components such as the Java JDK, Apache Maven, and an SSH client with scp. For more information, see [setup instructions](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/tree/master/DomainJoined-Producer-Consumer).

1. Download the [Apache Kafka domain-joined producer consumer examples](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/tree/master/DomainJoined-Producer-Consumer).

1. Follow Steps 2 and 3 under **Build and deploy the example** in [Tutorial: Use the Apache Kafka Producer and Consumer APIs](../kafka/apache-kafka-producer-consumer-api.md#build-and-deploy-the-example)

1. Run the following commands:

   ```bash
   java -jar -Djava.security.auth.login.config=/usr/hdp/current/kafka-broker/config/kafka_client_jaas.conf kafka-producer-consumer.jar create salesevents $KAFKABROKERS
   java -jar -Djava.security.auth.login.config=/usr/hdp/current/kafka-broker/config/kafka_client_jaas.conf kafka-producer-consumer.jar create marketingspend $KAFKABROKERS
   ```

## Test the Ranger policies

Based on the Ranger policies configured, **sales_user** can produce/consume topic `salesevents` but not topic `marketingspend`. Conversely, **marketing_user** can produce/consume topic `marketingspend` but not topic `salesevents`.

1. Open a new SSH connection to the cluster. Use the following command to sign in as **sales_user1**:

   ```bash
   ssh sales_user1@CLUSTERNAME-ssh.azurehdinsight.net
   ```

2. Execute the following command:

   ```bash
   export KAFKA_OPTS="-Djava.security.auth.login.config=/usr/hdp/current/kafka-broker/config/kafka_client_jaas.conf"
   ```

3. Use the broker names from the previous section to set the following environment variable:

   ```bash
   export KAFKABROKERS=<brokerlist>:9092
   ```

   Example: `export KAFKABROKERS=wn0-khdicl.contoso.com:9092,wn1-khdicl.contoso.com:9092`

4. Follow Step 3 under **Build and deploy the example** in [Tutorial: Use the Apache Kafka Producer and Consumer APIs](../kafka/apache-kafka-producer-consumer-api.md#build-and-deploy-the-example) to ensure that the `kafka-producer-consumer.jar` is also available to **sales_user**.

> [!NOTE]  
> For this tutorial, please use the kafka-producer-consumer.jar under "DomainJoined-Producer-Consumer" project (not the one under Producer-Consumer project, which is for non domain joined scenarios).

5. Verify that **sales_user1** can produce to topic `salesevents` by executing the following command:

   ```bash
   java -jar kafka-producer-consumer.jar producer salesevents $KAFKABROKERS
   ```

6. Execute the following command to consume from topic `salesevents`:

   ```bash
   java -jar kafka-producer-consumer.jar consumer salesevents $KAFKABROKERS
   ```

   Verify that you're able to read the messages.

7. Verify that the **sales_user1** can't produce to topic `marketingspend` by executing the following in the same ssh window:

   ```bash
   java -jar kafka-producer-consumer.jar producer marketingspend $KAFKABROKERS
   ```

   An authorization error occurs and can be ignored.

8. Notice that **marketing_user1** can't consume from topic `salesevents`.

   Repeat steps 1-4 above, but this time as **marketing_user1**.

   Execute the following command to consume from topic `salesevents`:

   ```bash
   java -jar kafka-producer-consumer.jar consumer salesevents $KAFKABROKERS
   ```

   Previous messages can't be seen.

9. View the audit access events from the Ranger UI.

   ![Ranger UI policy audit access events ](./media/apache-domain-joined-run-kafka/apache-ranger-admin-audit.png)

## Clean up resources

If you're not going to continue to use this application, delete the Kafka cluster that you created with the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the **Search** box at the top, type **HDInsight**.
1. Select **HDInsight clusters** under **Services**.
1. In the list of HDInsight clusters that appears, click the **...** next to the cluster that you created for this tutorial. 
1. Click **Delete**. Click **Yes**.

## Troubleshooting
If kafka-producer-consumer.jar does not work in a domain joined cluster, please make sure you are using the kafka-producer-consumer.jar under "DomainJoined-Producer-Consumer" project (not the one under Producer-Consumer project, which is for non domain joined scenarios).

## Next steps

> [!div class="nextstepaction"]
> [Customer-managed key disk encryption](../disk-encryption.md)
