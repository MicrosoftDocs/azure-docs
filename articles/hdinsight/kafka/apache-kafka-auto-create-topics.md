---
title: Enable automatic topic creation in Apache Kafka - Azure HDInsight
description: Learn how to configure Apache Kafka on HDInsight to automatically create topics. You can configure Kafka by setting `auto.create.topics.enable` to true through Ambari. Or during cluster creation through PowerShell or Resource Manager templates.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,seoapr2020
ms.date: 06/22/2023
---

# How to configure Apache Kafka on HDInsight to automatically create topics

By default, Apache Kafka on HDInsight doesn't enable automatic topic creation. You can enable auto topic creation for existing clusters using Apache Ambari. You can also enable auto topic creation when creating a new Kafka cluster using an Azure Resource Manager template.

## Apache Ambari Web UI

To enable automatic topic creation on an existing cluster through the Ambari Web UI, use the following steps:

1. From the [Azure portal](https://portal.azure.com), select your Kafka cluster.

1. From **Cluster dashboards**, select **Ambari home**.

    :::image type="content" source="./media/apache-kafka-auto-create-topics/azure-portal-cluster-dashboard-ambari.png" alt-text="Image of the portal with cluster dashboard selected" border="true":::

    When prompted, authenticate using the login (admin) credentials for the cluster. Instead, you can connect to Amabri directly from `https://CLUSTERNAME.azurehdinsight.net/` where `CLUSTERNAME` is the name of your Kafka cluster.

1. Select the Kafka service from the list on the left of the page.

    :::image type="content" source="./media/apache-kafka-auto-create-topics/hdinsight-service-list.png" alt-text="Apache Ambari service list tab" border="true":::

1. Select Configs in the middle of the page.

    :::image type="content" source="./media/apache-kafka-auto-create-topics/hdinsight-service-config.png" alt-text="Apache Ambari service configs tab" border="true":::

1. In the Filter field, enter a value of `auto.create`.

    :::image type="content" source="./media/apache-kafka-auto-create-topics/hdinsight-filter-field.png" alt-text="Apache Ambari search filter field" border="true":::

    This setting filters the list of properties and displays the `auto.create.topics.enable` setting.

1. Change the value of `auto.create.topics.enable` to `true`, and then select **Save**. Add a note, and then select **Save** again.

    :::image type="content" source="./media/apache-kafka-auto-create-topics/auto-create-topics-enable.png" alt-text="Image of the auto.create.topics.enable entry" border="true":::

1. Select the Kafka service, select __Restart__, and then select __Restart all affected__. When prompted, select __Confirm restart all__.

    :::image type="content" source="./media/apache-kafka-auto-create-topics/restart-all-affected.png" alt-text="`Apache Ambari restart all affected`" border="true":::

> [!NOTE]  
> You can also set Ambari values through the Ambari REST API. This is generally more difficult, as you have to make multiple REST calls to retrieve the current configuration, modify it, etc. For more information, see the [Manage HDInsight clusters using the Apache Ambari REST API](../hdinsight-hadoop-manage-ambari-rest-api.md) document.

## Resource Manager templates

When creating a Kafka cluster using an Azure Resource Manager template, you can directly set `auto.create.topics.enable` by adding it in a `kafka-broker`. The following JSON snippet demonstrates how to set this value to `true`:

```json
"clusterDefinition": {
    "kind": "kafka",
    "configurations": {
        "gateway": {
            "restAuthCredential.isEnabled": true,
            "restAuthCredential.username": "[parameters('clusterLoginUserName')]",
            "restAuthCredential.password": "[parameters('clusterLoginPassword')]"
        },
        "kafka-broker": {
            "auto.create.topics.enable": "true"
        }
    }
}
```

## Next Steps

In this document, you learned how to enable automatic topic creation for Apache Kafka on HDInsight. To learn more about working with Kafka, see the following links:

* [Analyze Apache Kafka logs](apache-kafka-log-analytics-operations-management.md)
* [Replicate data between Apache Kafka clusters](apache-kafka-mirroring.md)
