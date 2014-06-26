<properties title="HDInsight Release Notes" pageTitle="HDInsight Release Notes | Azure" description="HDInsight release notes." metaKeywords="hdinsight, hadoop, hdinsight hadoop, hadoop azure, release notes" services="HDInsight" solutions="" documentationCenter="" editor="cgronlun" manager="paulettm"  authors="bradsev" />


#Microsoft HDInsight release notes

## Notes for 6/24/2014 release ##

This release contains several new enhancements to HDInsight service: 

* **HDP 2.1 Availability**: HDInsight 3.1 which contains HDP 2.1 is now generally available and is the default version for new clusters.
* **HBase – Azure Management Portal Improvements**: We are making HBase clusters available in Preview. You can now create HBase clusters from the portal with 3 clicks.

![](http://i.imgur.com/cmOl5fM.png)

With HBase, you can build a variety of real-time workloads on HDInsight, from interactive websites that work with large datasets to services storing sensor and telemetry data from millions of end points. The next step would be to analyze the data in these workloads with Hadoop jobs and this is immediately possible in HDInsight through the experiences provided like PowerShell and Hive cluster dashboard.

### Apache™ Mahout Now Pre-Installed on HDInsight 3.1 ###

 [Mahout](http://hortonworks.com/hadoop/mahout/) is preinstalled on HDInsight 3.1 Hadoop clusters. So you can run Mahout jobs without the need for any additional cluster configuration. For example, you can remote into an Hadoop cluster using the Remote Desktop Protocol (RDP) and without additional steps execute the Hello world Mahout command:

		mahout org.apache.mahout.classifier.df.tools.Describe -p /user/hdp/glass.data -f /user/hdp/glass.info -d I 9 N L  

		mahout org.apache.mahout.classifier.df.BreimanExample -d /user/hdp/glass.data -ds /user/hdp/glass.info -i 10 -t 100

For a more complete explanation of this procedure, see the documentation of the [Breiman Example](https://mahout.apache.org/users/classification/breiman-example.html) on the Apache Mahout website. 


### Hive Queries can use Tez in HDinsight 3.1 ###

Hive 0.13 is now available in HDInsight 3.1 and is capable of running queries using Tez, which can be leveraged for substantial performance improvements. 
Tez is not enable by default for Hive queries. To use it, you must opt in. You can enable Tez by running the following code snippet:

		set hive.execution.engine=tez;
		select sc_status, count(*), histogram_numeric(sc_bytes,5) from website_logs_orc_local group by sc_status;

Hortonworks has published a detailed breakdown of Hive query performance enhancements with Tez as delivered in standard benchmarks. For details, see [Benchmarking Apache Hive 13 for Enterprise Hadoop](http://hortonworks.com/blog/benchmarking-apache-hive-13-enterprise-hadoop/). 

For more details on using Hive with Tez, check out the [Hive on Tez wiki page](https://cwiki.apache.org/confluence/display/Hive/Hive+on+Tez).

### Bug fixes ###

With this release, we have refreshed the following HDInsight  (Hortonworks Data Platform - HDP) versions with several bug fixes:

* HDInsight 2.1 (HDP 1.3)
* HDInsight 3.0 (HDP 2.0)
* HDInsight 3.1 (HDP 2.1)

## Hortonworks Release Notes ##

Release notes for the HDPs that are used by the versions of HDInsight cluster are available at the following locations.

* HDInsight cluster version 3.1 uses an Hadoop distribution that is based on the [Hortonworks Data Platform 2.1][hdp-2-1-1].(This is the default Hadoop cluster created when using the Azure HDInsight portal.)

* HDInsight cluster version 3.0 uses an Hadoop distribution that is based on the [Hortonworks Data Platform 2.0][hdp-2-0-8].

* HDInsight cluster version 2.1 uses an Hadoop distribution that is based on the [Hortonworks Data Platform 1.3][hdp-1-3-0]. 

* HDInsight cluster version 1.6 uses an Hadoop distribution that is based on the [Hortonworks Data Platform 1.1][hdp-1-1-0]. 




[hdp-2-1-1]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.1/bk_releasenotes_hdp_2.1/content/ch_relnotes-hdp-2.1.1.html

[hdp-2-0-8]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.0.8.0/bk_releasenotes_hdp_2.0/content/ch_relnotes-hdp2.0.8.0.html

[hdp-1-3-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-1.3.0/bk_releasenotes_hdp_1.x/content/ch_relnotes-hdp1.3.0_1.html

[hdp-1-1-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-Win-1.1/bk_releasenotes_HDP-Win/content/ch_relnotes-hdp-win-1.1.0_1.html




