<properties linkid="manage-services-hdinsight-monitor" urlDisplayName="Monitoring HDInsight" pageTitle="How to monitor HDInsight - Windows Azure guidance" metaKeywords="hdinsight, hdinsight monitor, hdinsight monitor azure, hdinsight job monitor" metaDescription="Learn how to monitor jobs submitted to the HDInsight service." umbracoNaviHide="0" disqusComments="1" writer="jgao" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

# How to Monitor HDInsight

In this topic, you will learn how to monitor an HDInsight cluster.

##Table of Contents

* [How to: Monitor a HDInsight cluster](#monitorcluster)
* [How to: View Hadoop job history](#jobhistory)

##<a id="monitorcluster"></a> How to: Monitor an HDInsight cluster

To monitor the health of an HDInsight cluster and the Hadoop jobs running on the cluster, you can connect to the HDInsight Dashboard, and click the Monitor Cluster tile.

![HDI.TileMonitorCluster](../media/HDI.TileMonitorCluster.PNG "Monitor Cluster")

The Monitor page looks like:

![HDI.MonitorPage](../media/HDI.MonitorPage.PNG "Monitor page")


On the right, it shows both Namenode and job tracker are up running, and the 4 data nodes are running in the healthy state.

On the left, it shows the map reduce metrics for the past 30 minutes. You can change the monitor windows to 30 minutes, 1 hour, 3 hours, 12 hours, 1 day, 2 days, 1 week and 2 weeks.

##<a id="jobhistory"></a> How to: View Hadoop job history
To view Hadoop job history, connect to HDInsight Dashboard, and then click the Job History tile. 

![HDI.TileJobHistory](../media/HDI.TileJobHistory.PNG "Job History")

The tile shows the number of jobs that have been ran; for example, the previous image indicates job history is available for 6 jobs.  The job history page looks like the following:

![HDI.JobHistoryPage](../media/HDI.JobHistoryPage.PNG "Job history page")


## See Also

* [How to: Administer HDInsight](/en-us/manage/services/hdinsight/administer-hdinsight/)

* [How to: Upload data to HDInsight](/en-us/manage/services/hdinsight/upload-data/)