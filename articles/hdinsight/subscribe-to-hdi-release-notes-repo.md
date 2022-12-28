---
title: Subscribe to GitHub Release Notes Repo and view Azure HDInsight clusters image version
description: Learn how to subscribe to GitHub Release Notes Repo and view Azure HDInsight clusters image version
ms.service: hdinsight
ms.topic: how-to
ms.date: 12/29/2022
---

# Subscribe to HDInsight Release Notes GitHub Repo

Prerequisites

* You should have a valid GitHub account to subscribe to this Release Notes notification. For more information on GitHub, [see here](https://github.com).

If you would like to subscribe to HDInsight release notes, go to this [GitHub repository](https://github.com/hdinsight/release-notes/releases).

1. Click **watch** and then **Custom**
1. Select **Releases** and click **Apply**

:::image type="content" source="./media/subscribe-to-github-repo/subscribe-to-github-repo.png" alt-text="Screenshot showing how to subscribe to GitHub repo.":::

Whenever there's a Release Note is published, a notification will be sent to the subscribed e-mail ID.

## View HDInsight cluster's image version

1. Go to the HDInsight cluster.

    :::image type="content" source="./media/find-image-version/view-cluster.png" alt-text="Screenshot showing cluster overview page.":::

1. From Overview tab, click **JSON View**.
1. Refer to the properties **blueprint**.

    :::image type="content" source="./media/subscribe-to-github-repo/json-view.png" alt-text="Screenshot showing how to view the HDInsight image version.":::

## Next steps

* [Create Apache Hadoop cluster in HDInsight](./hadoop/apache-hadoop-linux-create-cluster-get-started-portal.md)
* [Create Apache Spark cluster - Portal](./spark/apache-spark-jupyter-spark-sql-use-portal.md)
* [Enterprise security in Azure HDInsight](./domain-joined/hdinsight-security-overview.md)
