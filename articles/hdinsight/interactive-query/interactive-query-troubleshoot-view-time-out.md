---
title: Apache Hive View times out from query result - Azure HDInsight
description: Apache Hive View times out when fetching a query result in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 07/30/2019
---

# Scenario: Apache Hive View times out when fetching a query result in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

When running certain queries from the Apache Hive view, the following error may be encountered:

```
Result fetch timed out

java.util.concurrent.TimeoutException: deadline passed
    at akka.actor.dsl.Inbox$InboxActor$$anonfun$receive$1.applyOrElse(Inbox.scala:117)
    at scala.PartialFunction$AndThen.applyOrElse(PartialFunction.scala:189)
    at akka.actor.Actor$class.aroundReceive(Actor.scala:467)
    at akka.actor.dsl.Inbox$InboxActor.aroundReceive(Inbox.scala:62)
    at akka.actor.ActorCell.receiveMessage(ActorCell.scala:516)
    at akka.actor.ActorCell.invoke(ActorCell.scala:487)
    at akka.dispatch.Mailbox.processMailbox(Mailbox.scala:238)
    at akka.dispatch.Mailbox.run(Mailbox.scala:220)
    at akka.dispatch.ForkJoinExecutorConfigurator$AkkaForkJoinTask.exec(AbstractDispatcher.scala:397)
    at scala.concurrent.forkjoin.ForkJoinTask.doExec(ForkJoinTask.java:260)
    at scala.concurrent.forkjoin.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1339)
    at scala.concurrent.forkjoin.ForkJoinPool.runWorker(ForkJoinPool.java:1979)
    at scala.concurrent.forkjoin.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:107)
```

## Cause

The Hive View default timeout value may not be suitable for the query you are running. The specified time period is too short for the Hive View to fetch the query result.

## Resolution

1. Increase the Apache Ambari Hive View timeouts by setting the following properties in `/etc/ambari-server/conf/ambari.properties` for **both headnodes**.
  ```
  views.ambari.request.read.timeout.millis=300000
  views.request.read.timeout.millis=300000
  views.ambari.hive.<HIVE_VIEW_INSTANCE_NAME>.result.fetch.timeout=300000
  ```
  The value of `HIVE_VIEW_INSTANCE_NAME` is available by clicking YOUR_USERNAME > Manage Ambari > Views > Names column. Do not use the URL name.

2. Restart the active Ambari server by running the following. If you get an error message saying it's not the active Ambari server, just ssh into the next headnode and repeat this step.
  ```
  sudo ambari-server restart
  ```

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
