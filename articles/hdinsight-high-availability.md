<properties linkid="manage-services-hdinsight-high-availability" urlDisplayName="HDInsight High Availability" pageTitle="Availability and reliability of HDInsight Clusters | Azure" metaKeywords="hdinsight, hadoop, hdinsight hadoop, hadoop azure" description="HDInsight deploys highly available and reliable clusters." services="HDInsight" umbracoNaviHide="0" disqusComments="1" editor="cgronlun" manager="paulettm" title="Availability and reliability of HDInsight clusters" authors="bradsev" />


#Availability and reliability of HDInsight clusters

## Introduction ##
 A second head node has been added to the Hadoop clusters deployed by HDInsight to increase the availability and reliability of the service needed to manage enterprise workloads. Standard implementations of Hadoop clusters typically have a single head node. These clusters are designed to manage the failure of worker nodes smoothly, but jobs will fail if the head node fails. HDInsight removes this single point of failure with the addition of a secondary head node. [ZooKeeper][zookeeper] nodes have been added to monitor the health of the cluster to insure that worker nodes know when to fail over to the secondary head node when the primary head node become inactive.

![](http://i.imgur.com/jrUmrH4.png)


## How to access the secondary headnode ##

TBD

![](http://i.imgur.com/LAtYcma.png)


## How to configure the size of the headnode ##

TBD

![](http://i.imgur.com/XGEpoMy.png)

**References**	

- TBD



[zookeeper]: hhttp://zookeeper.apache.org/ 
