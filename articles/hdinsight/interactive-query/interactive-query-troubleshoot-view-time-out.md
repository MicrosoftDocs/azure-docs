---
title: Apache Hive View times out from query result - Azure HDInsight
description: Apache Hive View times out when fetching a query result in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 04/24/2023
---

# Scenario: Apache Hive View times out when fetching a query result in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters. The default timeout was 1 minute in HDI 3.6 and HDI 4.0 clusters.

## Issue

When you run certain queries from the Apache Hive view, the following error may be encountered:

```
ERROR [ambari-client-thread-1] [HIVE 2.0.0 AUTO_HIVE20_INSTANCE] NonPersistentCursor:131 - Result fetch timed out
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
ERROR [ambari-client-thread-1] [HIVE 2.0.0 AUTO_HIVE20_INSTANCE] ServiceFormattedException:97 - Result fetch timed out
ERROR [ambari-client-thread-1] [HIVE 2.0.0 AUTO_HIVE20_INSTANCE] ServiceFormattedException:98 - java.util.concurrent.TimeoutException: deadline passed

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

The Hive View default timeout value may not be suitable for the query you're running. The specified time period is too short for the Hive View to fetch the query result.

## Resolution

1. Increase the Apache Ambari Hive View timeouts by setting the following properties in `/etc/ambari-server/conf/ambari.properties` for **both headnodes**.
   ```
   views.ambari.hive.AUTO_HIVE20_INSTANCE.result.fetch.timeout=300000
   ```
   Confirm the Hive View instance name `AUTO_HIVE20_INSTANCE` by going to YOUR_USERNAME > Manage Ambari > Views. Get the instance name from the Name column. If it doesn't match, then replace this value. **Do not use the URL Name column**.

2. Restart the active Ambari server by running the following. If you get an error message saying it's not the active Ambari server, ssh into the next headnode and repeat this step. Note down the PID of the current Ambari server process.
   ```
   sudo ambari-server status 
   sudo systemctl restart ambari-server
   ```
3. Confirm Ambari server restarted. If you followed the steps, you notice the PID has changed.
   ```
   sudo ambari-server status
   ```
   
## Notes
If you get a 502 error, then that is coming from the HDI gateway. You can confirm by opening web inspector, go to network tab, then resubmit query. You see a request fail, returning a 502 status code, and the time shows two mins elapsed.

The query isn't suited for Hive View. It's recommended that you either try the following instead:
- Use beeline
- Rewrite the query to be more optimal

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
