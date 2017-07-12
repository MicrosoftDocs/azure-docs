---
title: Analyze and Process JSON documents with Hive in HDInsight | Microsoft Docs
description: Learn how to use JSON documents and analyze them using Hive in HDInsight.
services: hdinsight
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun

ms.assetid: e17794e8-faae-4264-9434-67f61ea78f13
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/26/2017
ms.author: jgao

---
# Process and analyze JSON documents using Hive in HDInsight

Learn how to process and analyze JSON files using Hive in HDInsight. The following JSON document is used in the tutorial:

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

The file can be found at wasb://processjson@hditutorialdata.blob.core.windows.net/. For more information on using Azure Blob storage with HDInsight, see [Use HDFS-compatible Azure Blob storage with Hadoop in HDInsight](hdinsight-hadoop-use-blob-storage.md). You can copy the file to the default container of your cluster.

In this tutorial, you use the Hive console.  For instructions of opening the Hive console, see [Use Hive with Hadoop on HDInsight with Remote Desktop](hdinsight-hadoop-use-hive-remote-desktop.md).

## Flatten JSON documents
The methods listed in the next section require the JSON document in a single row. So you must flatten the JSON document to a string. If your JSON document is already flattened, you can skip this step and go straight to the next section on Analyzing JSON data.

    DROP TABLE IF EXISTS StudentsRaw;
    CREATE EXTERNAL TABLE StudentsRaw (textcol string) STORED AS TEXTFILE LOCATION "wasb://processjson@hditutorialdata.blob.core.windows.net/";

    DROP TABLE IF EXISTS StudentsOneLine;
    CREATE EXTERNAL TABLE StudentsOneLine
    (
      json_body string
    )
    STORED AS TEXTFILE LOCATION '/json/students';

    INSERT OVERWRITE TABLE StudentsOneLine
    SELECT CONCAT_WS(' ',COLLECT_LIST(textcol)) AS singlelineJSON
          FROM (SELECT INPUT__FILE__NAME,BLOCK__OFFSET__INSIDE__FILE, textcol FROM StudentsRaw DISTRIBUTE BY INPUT__FILE__NAME SORT BY BLOCK__OFFSET__INSIDE__FILE) x
          GROUP BY INPUT__FILE__NAME;

    SELECT * FROM StudentsOneLine

The raw JSON file is located at **wasb://processjson@hditutorialdata.blob.core.windows.net/**. The *StudentsRaw* Hive table points to the raw unflattened JSON document.

The *StudentsOneLine* Hive table stores the data in the HDInsight default file system under the */json/students/* path.

The INSERT statement populates the StudentOneLine table with the flattened JSON data.

The SELECT statement shall only return one row.

Here is the output of the SELECT statement:

![Flattening of the JSON document.][image-hdi-hivejson-flatten]

## Analyze JSON documents in Hive
Hive provides three different mechanisms to run queries on JSON documents:

* use the GET\_JSON\_OBJECT UDF (User-defined function)
* use the JSON_TUPLE UDF
* use custom SerDe
* write you own UDF using Python or other languages. See [this article][hdinsight-python] on running your own Python code with Hive.

### Use the GET\_JSON_OBJECT UDF
Hive provides a built-in UDF called [get json object](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF#LanguageManualUDF-get_json_object), which can perform JSON querying during run time. This method takes two arguments – the table name and method name, which has the flattened JSON document and the JSON field that needs to be parsed. Let’s look at an example to see how this UDF works.

Get the first name and last name for each student

    SELECT
      GET_JSON_OBJECT(StudentsOneLine.json_body,'$.StudentDetails.FirstName'),
      GET_JSON_OBJECT(StudentsOneLine.json_body,'$.StudentDetails.LastName')
    FROM StudentsOneLine;

Here is the output when running this query in console window.

![get_json_object UDF][image-hdi-hivejson-getjsonobject]

There are a few limitations of the get-json_object UDF.

* Because each field in the query requires reparsing the query, it affects the performance.
* GET\_JSON_OBJECT() returns the string representation of an array. To convert this array to a Hive array, you have to use regular expressions to replace the square brackets ‘[‘ and ‘]’ and then also call split to get the array.

This is why the Hive wiki recommends using json_tuple.  

### Use the JSON_TUPLE UDF
Another UDF provided by Hive is called [json_tuple](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF#LanguageManualUDF-json_tuple), which performs better than [get_ json _object](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF#LanguageManualUDF-get_json_object). This method takes a set of keys and a JSON string, and returns a tuple of values using one function. The following query returns the student id and the grade from the JSON document:

    SELECT q1.StudentId, q1.Grade
      FROM StudentsOneLine jt
      LATERAL VIEW JSON_TUPLE(jt.json_body, 'StudentId', 'Grade') q1
        AS StudentId, Grade;

The output of this script in the Hive console:

![json_tuple UDF][image-hdi-hivejson-jsontuple]

JSON\_TUPLE uses the [lateral view](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+LateralView) syntax in Hive, which allows json\_tuple to create a virtual table by applying the UDT function to each row of the original table.  Complex JSONs become too unwieldy because of the repeated use of LATERAL VIEW. Furthermore, JSON_TUPLE cannot handle nested JSONs.

### Use custom SerDe
SerDe is the best choice for parsing nested JSON documents, it allows you to define the JSON schema, and use the schema to parse the documents. In this tutorial, you use one of the more popular SerDe that has been developed by [Roberto Congiu](https://github.com/rcongiu).

**To use the custom SerDe:**

1. Install [Java SE Development Kit 7u55 JDK 1.7.0_55](http://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase7-521261.html#jdk-7u55-oth-JPR). Choose the Windows X64 version of the JDK if you are going to be using the Windows deployment of HDInsight
   
   > [!WARNING]
   > JDK 1.8 doesn't work with this SerDe.
   > 
   > 
   
    After the installation is completed, add a new user environment variable:
   
   1. Open **View advanced system settings** from the Windows screen.
   2. Click **Environment Variables**.  
   3. Add a new **JAVA_HOME** environment variable is pointing to **C:\Program Files\Java\jdk1.7.0_55** or wherever your JDK is installed.
      
      ![Setting up correct config values for JDK][image-hdi-hivejson-jdk]
2. Install [Maven 3.3.1](http://mirror.olnevhost.net/pub/apache/maven/maven-3/3.3.1/binaries/apache-maven-3.3.1-bin.zip)
   
    Add the bin folder to your path by going to Control Panel-->Edit the System Variables for your account Environment variables. The following screenshot shows you how to do this.
   
    ![Setting up Maven][image-hdi-hivejson-maven]
3. Clone the project from [Hive-JSON-SerDe](https://github.com/sheetaldolas/Hive-JSON-Serde/tree/master) github site. You can do this by clicking on the “Download Zip” button as shown in the following screenshot.
   
    ![Cloning the project][image-hdi-hivejson-serde]

4: Go to the folder where you have downloaded this package and then type “mvn package”. This should create the necessary jar files that you can then copy over to the cluster.

5: Go to the target folder under the root folder where you downloaded the package. Upload the json-serde-1.1.9.9-Hive13-jar-with-dependencies.jar file to head-node of your cluster. I usually put it under the hive binary folder: C:\apps\dist\hive-0.13.0.2.1.11.0-2316\bin or something similar.

6: In the hive prompt, type “add jar /path/to/json-serde-1.1.9.9-Hive13-jar-with-dependencies.jar”. Since in my case, the jar is in the C:\apps\dist\hive-0.13.x\bin folder, I can directly add the jar with the name as shown:

    add jar json-serde-1.1.9.9-Hive13-jar-with-dependencies.jar;

   ![Adding JAR to your project][image-hdi-hivejson-addjar]

Now, you are ready to use the SerDe to run queries against the JSON document.

The following statement creates a table with a defined schema:

    DROP TABLE json_table;
    CREATE EXTERNAL TABLE json_table (
      StudentId string,
      Grade int,
      StudentDetails array<struct<
          FirstName:string,
          LastName:string,
          YearJoined:int
          >
      >,
      StudentClassCollection array<struct<
          ClassId:string,
          ClassParticipation:string,
          ClassParticipationRank:string,
          Score:int,
          PerformedActivity:boolean
          >
      >
    ) ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
    LOCATION '/json/students';

To list the first name and last name of the student

    SELECT StudentDetails.FirstName, StudentDetails.LastName FROM json_table;

Here is the result from the Hive console.

![SerDe Query 1][image-hdi-hivejson-serde_query1]

To calculate the sum of scores of the JSON document

    SELECT SUM(scores)
    FROM json_table jt
      lateral view explode(jt.StudentClassCollection.Score) collection as scores;

The preceding query uses [lateral view explode](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+LateralView) UDF to expand the array of scores so that they can be summed.

Here is the output from the Hive console.

![SerDe Query 2][image-hdi-hivejson-serde_query2]

To find which subjects a given student has scored more than 80 points:

    SELECT  
      jt.StudentClassCollection.ClassId
    FROM json_table jt
      lateral view explode(jt.StudentClassCollection.Score) collection as score  where score > 80;

The preceding query returns a Hive array unlike get\_json\_object, which returns a string.

![SerDe Query 3][image-hdi-hivejson-serde_query3]

If you want to skil malformed JSON, then as explained in the [wiki page](https://github.com/sheetaldolas/Hive-JSON-Serde/tree/master) of this SerDe you can achieve that by typing the following code:  

    ALTER TABLE json_table SET SERDEPROPERTIES ( "ignore.malformed.json" = "true");




## Summary
In conclusion, the type of JSON operator in Hive that you choose depends on your scenario. If you have a simple JSON document and you only have one field to look up on – you can choose to use the Hive UDF get\_json\_object. If you have more than one key to look up on, then you can use json_tuple. If you have a nested document, then you should use the JSON SerDe.

## Next steps

For other related articles, see

* [Use Hive and HiveQL with Hadoop in HDInsight to analyze a sample Apache log4j file](hdinsight-use-hive.md)
* [Analyze flight delay data by using Hive in HDInsight](hdinsight-analyze-flight-delay-data.md)
* [Analyze Twitter data using Hive in HDInsight](hdinsight-analyze-twitter-data.md)
* [Run a Hadoop job using Azure Cosmos DB and HDInsight](../documentdb/documentdb-run-hadoop-with-hdinsight.md)

[hdinsight-python]: hdinsight-python.md

[image-hdi-hivejson-flatten]: ./media/hdinsight-using-json-in-hive/flatten.png
[image-hdi-hivejson-getjsonobject]: ./media/hdinsight-using-json-in-hive/getjsonobject.png
[image-hdi-hivejson-jsontuple]: ./media/hdinsight-using-json-in-hive/jsontuple.png
[image-hdi-hivejson-jdk]: ./media/hdinsight-using-json-in-hive/jdk.png
[image-hdi-hivejson-maven]: ./media/hdinsight-using-json-in-hive/maven.png
[image-hdi-hivejson-serde]: ./media/hdinsight-using-json-in-hive/serde.png
[image-hdi-hivejson-addjar]: ./media/hdinsight-using-json-in-hive/addjar.png
[image-hdi-hivejson-serde_query1]: ./media/hdinsight-using-json-in-hive/serde_query1.png
[image-hdi-hivejson-serde_query2]: ./media/hdinsight-using-json-in-hive/serde_query2.png
[image-hdi-hivejson-serde_query3]: ./media/hdinsight-using-json-in-hive/serde_query3.png
[image-hdi-hivejson-serde_result]: ./media/hdinsight-using-json-in-hive/serde_result.png
