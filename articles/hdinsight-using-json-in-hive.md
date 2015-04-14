<properties
   pageTitle="Using JSON documents with Hive in HDInsight | Azure"
   description="Learn how to use JSON documents and analze them using Hive in HDInsight."
   services="hdinsight"
   documentationCenter=""
   authors="rashimg"
   manager="mwinkle"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="04/14/2015"
   ms.author="rashimg"/>


# Learn how to use JSON in Hive

JSON is one of the most commonly used format on the web. This tutorial will help you understand one of the common questions that users face in Hive – how to use JSON documents in Hive and then run analysis on them. 

##In this tutorial

* [JSON Example](#example)
* [Flattening a JSON document (step required only if you have pretty JSON)](#flatten)
* [Options for analyzing JSON documents in Hive](#options)
* [get_json_object UDF](#getjsonobject)
* [json_tuple UDF](#jsontuple)
* [Using custom SerDe](#serde)
* [Other options](#other)

##<a name="example"></a>JSON Example

Let us take an example. Let’s assume that we have the JSON document shown below. Our goal is to be able to parse this JSON document and then be able to run queries on this document like lookup value on a key, aggregation etc.

	  {
        "StudentId": "trgfg-5454-fdfdg-4346",
	    "Grade": 7,
        "StudentDetails": [
          {
            "FirstName": "Peggy",
            "LastName": "Williams",
            "YearJoined": 2012
          }
        ],
        "StudentClassCollection": [
          {
            "ClassId": "89084343",
            "ClassParticipation": "Satisfied",
            "ClassParticipationRank": "High",
            "Score": 93,
            "PerformedActivity": false
          },
          {
            "ClassId": "78547522",
            "ClassParticipation": "NotSatisfied",
            "ClassParticipationRank": "None",
            "Score": 74,
            "PerformedActivity": false
          },
          {
            "ClassId": "78675563",
            "ClassParticipation": "Satisfied",
            "ClassParticipationRank": "Low",
            "Score": 83,
            "PerformedActivity": true
          }
        ] 
      }

##<a name="flatten"></a>Flattening a JSON document (step required only if you have pretty JSON)

Before we use any Hive operator to perform analysis we must pre-process the JSON document so it is ready to be used by Hive. 

All options listed in the next section assume that the JSON document is in a single row. In other words, we must flatten the JSON document to a string so that it can be used by Hive operators. 

**If your JSON document is already flattened and the entire document is in one line then you can skip this step and go straight to the next section on Analyzing JSON data.**

Let’s assume your un-flattened JSON document spanning multiple rows is present in your Azure Blob store under the */json/input/* folder under the default container. The code below creates a table jsonexample which points to the original un-flattened JSON document.

    drop table jsonexample;
    CREATE EXTERNAL TABLE jsonexample (textcol string) stored as textfile location '/json/input/';

Next, we are going to create a new table called one_line_json which will point to the flattened JSON document and will be stored in your Azure Blob store under */json/temp/* folder under the default container. 

    drop table if exists one_line_json;
    create external table one_line_json
    (
      json_body string
    )
    stored as textfile location '/json/temp';

Finally, we will populate this table with the flattened JSON data.

    insert overwrite table one_line_json
    select concat_ws(' ',collect_list(textcol)) as singlelineJSON 
      from (select INPUT__FILE__NAME,BLOCK__OFFSET__INSIDE__FILE,textcol from jsonexample distribute by INPUT__FILE__NAME sort by BLOCK__OFFSET__INSIDE__FILE ) 
      x group by INPUT__FILE__NAME;

At this time, if you look at the newly created table one_line_json you should see that it contains the JSON document in a single line

    select * from one_line_json;

Here is the output of this query:

![Flattening of the JSON document.][image-hdi-hivejson-flatten]

##<a name="options"></a>Options for analyzing JSON documents in Hive

Now that we have the JSON document in a table with a single column, we are ready to use Hive to run queries on this data. Hive provides three different mechanisms to run queries on JSON documents:

1.	Using User Defined Function (UDF): get_json_object
2.	Using UDF: json_tuple
3.	Using custom SerDe

Let us discuss each one of these in detail.


##<a name="getjsonobject"></a>get_json_object UDF
Hive provides a built-in UDF called [get_json_object](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF#LanguageManualUDF-get_json_object) which can perform JSON querying during run time. This method takes two arguments – the table name and method name which has the flattened JSON document and the JSON field that needs to be parsed. Let’s look at an example to see how this UDF works.

Get the first name and last name for each student

    select get_json_object(one_line_json.json_body, '$.StudentDetails.FirstName'), get_json_object(one_line_json.json_body, '$.StudentDetails.LastName') from one_line_json;

Here is the output when running this query in console window.

![get_json_object UDF][image-hdi-hivejson-getjsonobject]

There are a few limitations of this UDF. 


- One of the main ones is that this UDF is not performant since each field in the query will require reparsing the query, affecting performance.
- Secondly, get_json_object() returns string representation of an array. So to convert this to a Hive array, you will have to use regular expressions to replace the square brackets ‘[‘ and ‘]’ and then also call split to get the array.


This is why the Hive wiki recommends using json_tuple which we will discuss next.  


###<a name="jsontuple"></a>json_tuple UDF

The other UDF provided by Hive is called [json_tuple](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF#LanguageManualUDF-json_tuple) which is more performant than [get_json_object](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF#LanguageManualUDF-get_json_object). This method takes a set of keys and a JSON string, and returns a tuple of values using one function. Let’s look at an example to see how this UDF works. 

Let's get the student id and grade from the JSON document

    select q1.StudentId, q1.Grade 
      from one_line_json jt
      LATERAL VIEW json_tuple(jt.json_body, 'StudentId', 'Grade') q1
        as StudentId, Grade;

We use the [lateral view](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+LateralView) syntax in Hive which allows json_tuple to create a virtual table by applying the UDT function to each row of the original table. 

Let's see the output of this script in the Hive console:

![json_tuple UDF][image-hdi-hivejson-jsontuple]

One of the main disadvantages of this UDF is that complex JSONs become too unwieldy because of the repeated use of LATERAL VIEW. In fact, this UDF cannot handle nested JSONs.

##<a name="serde"></a>Using custom SerDe

For parsing nested JSON documents, SerDe is the **best choice** since you can define the JSON schema making it very easy to run queries against it. 

We will discuss how to use one of the more popular SerDe that has been developed by [rcongiu](https://github.com/rcongiu).

Step 1: Ensure you have [Java SE Development Kit 7u55 JDK 1.7.0_55](http://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase7-521261.html#jdk-7u55-oth-JPR) installed (Note: If you have JDK 1.8 installed, it will not work with this SerDe). 


- If you are going to be using the Windows deployment of HDInsight choose the x64 Windows version of the JDK.
- After installation is complete, go to Control Panel --> Add Environment variables and add a new JAVA_HOME environment variable is pointing to C:\Program Files\Java\jdk1.7.0_55 or wherever your JDK is installed. The following screen shots show you how you can set the environment variable.

![json_tuple UDF][image-hdi-hivejson-jdk]

[1]: hdinsight-hadoop-visual-studio-tools-get-started.md

[hdinsight-versions]: hdinsight-component-versioning.md

[hdinsight-get-started-30]: hdinsight-get-started-30.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-use-oozie]: hdinsight-use-oozie.md
[hdinsight-storage]: hdinsight-use-blob-storage.md
[hdinsight-emulator]: hdinsight-get-started-emulator.md
[hdinsight-develop-streaming]: hdinsight-hadoop-develop-deploy-streaming-jobs.md
[hdinsight-develop-mapreduce]: hdinsight-develop-deploy-java-mapreduce.md
[hadoop-hdinsight-intro]: hdinsight-hadoop-introduction.md
[hdinsight-weblogs-sample]: hdinsight-hive-analyze-website-log.md
[hdinsight-sensor-data-sample]: hdinsight-hive-analyze-sensor-data.md

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: storage-create-storage-account.md

[apache-hadoop]: http://go.microsoft.com/fwlink/?LinkId=510084
[apache-hive]: http://go.microsoft.com/fwlink/?LinkId=510085
[apache-mapreduce]: http://go.microsoft.com/fwlink/?LinkId=510086
[apache-hdfs]: http://go.microsoft.com/fwlink/?LinkId=510087
[hdinsight-hbase-custom-provision]: http://azure.microsoft.com/documentation/articles/hdinsight-hbase-get-started/


[powershell-download]: http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409
[powershell-install-configure]: install-configure-powershell.md
[powershell-open]: install-configure-powershell.md#Install


[img-hdi-dashboard]: ./media/hdinsight-get-started/HDI.dashboard.png
[img-hdi-dashboard-query-select]: ./media/hdinsight-get-started/HDI.dashboard.query.select.png
[img-hdi-dashboard-query-select-result]: ./media/hdinsight-get-started/HDI.dashboard.query.select.result.png
[img-hdi-dashboard-query-select-result-output]: ./media/hdinsight-get-started/HDI.dashboard.query.select.result.output.png
[img-hdi-dashboard-query-browse-output]: ./media/hdinsight-get-started/HDI.dashboard.query.browse.output.png

[img-hdi-getstarted-video]: ./media/hdinsight-get-started/HDI.GetStarted.Video.png


[image-hdi-storageaccount-quickcreate]: ./media/hdinsight-get-started/HDI.StorageAccount.QuickCreate.png
[image-hdi-clusterstatus]: ./media/hdinsight-get-started/HDI.ClusterStatus.png
[image-hdi-quickcreatecluster]: ./media/hdinsight-get-started/HDI.QuickCreateCluster.png
[image-hdi-getstarted-flow]: ./media/hdinsight-get-started/HDI.GetStartedFlow.png

[image-hdi-gettingstarted-powerquery-importdata]: ./media/hdinsight-get-started/HDI.GettingStarted.PowerQuery.ImportData.png
[image-hdi-gettingstarted-powerquery-importdata2]: ./media/hdinsight-get-started/HDI.GettingStarted.PowerQuery.ImportData2.png


[image-hdi-hivejson-flatten]: ./media/hdinsight-using-json-in-hive/flatten.png
[image-hdi-hivejson-getjsonobject]: ./media/hdinsight-using-json-in-hive/getjsonobject.png
[image-hdi-hivejson-jsontuple]: ./media/hdinsight-using-json-in-hive/jsontuple.png
[image-hdi-hivejson-jdk]: ./media/hdinsight-using-json-in-hive/jdk.png
