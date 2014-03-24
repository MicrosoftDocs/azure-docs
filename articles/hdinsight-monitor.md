<properties linkid="manage-services-hdinsight-howto-monitor-hdinsight" urlDisplayName="Monitor" pageTitle="Monitor HDInsight | Azure" metaKeywords="" description="Learn how to monitor an HDInsight cluster and view Hadoop job history through the Azure management portal." metaCanonical="" services="hdinsight" documentationCenter="" title="How to Monitor HDInsight" authors="jgao" solutions="" manager="paulettm" editor="mollybos" />




# How to Monitor HDInsight

In this topic, you will learn how to monitor an HDInsight cluster.

##Table of Contents

* [How to: Monitor a HDInsight cluster](#monitorcluster)
* [How to: View Hadoop job history](#jobhistory)

##<a id="monitorcluster"></a> How to: Monitor an HDInsight cluster

To monitor the health of an HDInsight cluster and the Hadoop jobs running on the cluster, you can connect to the HDInsight Dashboard, and click the Monitor Cluster tile.

![HDI.TileMonitorCluster][hdi-monitor-cluster-tile]

The Monitor page looks like:

![HDI.MonitorPage][hdi-monitor-page]


On the right, it shows both Namenode and job tracker are up running, and the 4 data nodes are running in the healthy state.

On the left, it shows the map reduce metrics for the past 30 minutes. You can change the monitor windows to 30 minutes, 1 hour, 3 hours, 12 hours, 1 day, 2 days, 1 week and 2 weeks.

##<a id="jobhistory"></a> How to: View Hadoop job history
To view Hadoop job history, connect to HDInsight Dashboard, and then click the Job History tile. 

![HDI.TileJobHistory][hdi-job-history-tile]

The tile shows the number of jobs that have been ran; for example, the previous image indicates job history is available for 6 jobs.  The job history page looks like the following:

![HDI.JobHistoryPage][hdi-job-history-page]


## See Also

* [How to: Administer HDInsight](/en-us/manage/services/hdinsight/howto-administer-hdinsight/)
* [How to: Deploy an HDInsight Cluster Programmatically](/en-us/manage/services/hdinsight/howto-deploy-cluster/)
* [How to: Execute Remote Jobs on Your HDInsight Cluster Programmatically](/en-us/manage/services/hdinsight/howto-execute-jobs-programmatically/)
* [Tutorial: Getting Started with Azure HDInsight](/en-us/manage/services/hdinsight/get-started-hdinsight/)

[hdi-monitor-cluster-tile]: ./media/hdinsight-monitor/HDI.TileMonitorCluster.PNG
[hdi-monitor-page]: ./media/hdinsight-monitor/HDI.MonitorPage.PNG
[hdi-job-history-tile]: ./media/hdinsight-monitor/HDI.TileJobHistory.PNG
[hdi-job-history-page]: ./media/hdinsight-monitor/HDI.JobHistoryPage.PNG
