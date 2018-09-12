---
title: Analyze and process JSON documents with Apache Hive in Azure HDInsight 
description: Learn how to use JSON documents and analyze them by using apache Hive in Azure HDInsight
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/16/2018
ms.author: jasonh

---
# Process and analyze JSON documents by using Apache Hive in Azure HDInsight

Learn how to process and analyze JavaScript Object Notation (JSON) files by using Apache Hive in Azure HDInsight. This tutorial uses the following JSON document:

```json
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
```

The file can be found at **wasb://processjson@hditutorialdata.blob.core.windows.net/**. For more information on how to use Azure Blob storage with HDInsight, see [Use HDFS-compatible Azure Blob storage with Hadoop in HDInsight](../hdinsight-hadoop-use-blob-storage.md). You can copy the file to the default container of your cluster.

In this tutorial, you use the Hive console. For instructions on how to open the Hive console, see [Use Hive with Hadoop on HDInsight with Remote Desktop](apache-hadoop-use-hive-remote-desktop.md).

## Flatten JSON documents
The methods listed in the next section require that the JSON document be composed of a single row. So, you must flatten the JSON document to a string. If your JSON document is already flattened, you can skip this step and go straight to the next section on analyzing JSON data. To flatten the JSON document, run the following script:

```sql
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
```

The raw JSON file is located at **wasb://processjson@hditutorialdata.blob.core.windows.net/**. The **StudentsRaw** Hive table points to the raw JSON document that is not flattened.

The **StudentsOneLine** Hive table stores the data in the HDInsight default file system under the **/json/students/** path.

The **INSERT** statement populates the **StudentOneLine** table with the flattened JSON data.

The **SELECT** statement only returns one row.

Here is the output of the **SELECT** statement:

![Flattening the JSON document][image-hdi-hivejson-flatten]

## Analyze JSON documents in Hive
Hive provides three different mechanisms to run queries on JSON documents, or you can write your own:

* Use the get_json_object user-defined function (UDF).
* Use the json_tuple UDF.
* Use the custom Serializer/Deserializer (SerDe).
* Write your own UDF by using Python or other languages. For more information on how to run your own Python code with Hive, see [Python UDF with Apache Hive and Pig][hdinsight-python].

### Use the get_json_object UDF
Hive provides a built-in UDF called [get_json_object](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF#LanguageManualUDF-get_json_object) that can perform JSON querying during runtime. This method takes two arguments--the table name and method name, which has the flattened JSON document and the JSON field that needs to be parsed. Let’s look at an example to see how this UDF works.

The following query returns the first name and last name for each student:

```sql
SELECT
  GET_JSON_OBJECT(StudentsOneLine.json_body,'$.StudentDetails.FirstName'),
  GET_JSON_OBJECT(StudentsOneLine.json_body,'$.StudentDetails.LastName')
FROM StudentsOneLine;
```

Here is the output when you run this query in the console window:

![get_json_object UDF][image-hdi-hivejson-getjsonobject]

There are limitations of the get_json_object UDF:

* Because each field in the query requires reparsing of the query, it affects the performance.
* **GET\_JSON_OBJECT()** returns the string representation of an array. To convert this array to a Hive array, you have to use regular expressions to replace the square brackets "[" and "]", and then you also have to call split to get the array.

This is why the Hive wiki recommends that you use json_tuple.  

### Use the json_tuple UDF
Another UDF provided by Hive is called [json_tuple](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF#LanguageManualUDF-json_tuple), which performs better than [get_ json _object](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF#LanguageManualUDF-get_json_object). This method takes a set of keys and a JSON string, and returns a tuple of values by using one function. The following query returns the student ID and the grade from the JSON document:

```sql
SELECT q1.StudentId, q1.Grade
FROM StudentsOneLine jt
LATERAL VIEW JSON_TUPLE(jt.json_body, 'StudentId', 'Grade') q1
  AS StudentId, Grade;
```

The output of this script in the Hive console:

![json_tuple UDF][image-hdi-hivejson-jsontuple]

The json_tuple UDF uses the [lateral view](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+LateralView) syntax in Hive, which enables json\_tuple to create a virtual table by applying the UDT function to each row of the original table. Complex JSONs become too unwieldy because of the repeated use of **LATERAL VIEW**. Furthermore, **JSON_TUPLE** cannot handle nested JSONs.

### Use a custom SerDe
SerDe is the best choice for parsing nested JSON documents. It lets you define the JSON schema, and then you can use the schema to parse the documents. For instructions, see [How to use a custom JSON SerDe with Microsoft Azure HDInsight](https://blogs.msdn.microsoft.com/bigdatasupport/2014/06/18/how-to-use-a-custom-json-serde-with-microsoft-azure-hdinsight/).

## Summary
In conclusion, the type of JSON operator in Hive that you choose depends on your scenario. If you have a simple JSON document and you have only one field to look up on, you can choose to use the Hive UDF get_json_object. If you have more than one key to look up on, then you can use json_tuple. If you have a nested document, then you should use the JSON SerDe.

## Next steps

For related articles, see:

* [Use Hive and HiveQL with Hadoop in HDInsight to analyze a sample Apache log4j file](../hdinsight-use-hive.md)
* [Analyze flight delay data by using Hive in HDInsight](../hdinsight-analyze-flight-delay-data.md)
* [Analyze Twitter data by using Hive in HDInsight](../hdinsight-analyze-twitter-data.md)

[hdinsight-python]:python-udf-hdinsight.md

[image-hdi-hivejson-flatten]: ./media/using-json-in-hive/flatten.png
[image-hdi-hivejson-getjsonobject]: ./media/using-json-in-hive/getjsonobject.png
[image-hdi-hivejson-jsontuple]: ./media/using-json-in-hive/jsontuple.png
[image-hdi-hivejson-jdk]: ./media/hdinsight-using-json-in-hive/jdk.png
[image-hdi-hivejson-maven]: ./media/hdinsight-using-json-in-hive/maven.png
[image-hdi-hivejson-serde]: ./media/hdinsight-using-json-in-hive/serde.png
[image-hdi-hivejson-addjar]: ./media/hdinsight-using-json-in-hive/addjar.png
[image-hdi-hivejson-serde_query1]: ./media/hdinsight-using-json-in-hive/serde_query1.png
[image-hdi-hivejson-serde_query2]: ./media/hdinsight-using-json-in-hive/serde_query2.png
[image-hdi-hivejson-serde_query3]: ./media/hdinsight-using-json-in-hive/serde_query3.png
[image-hdi-hivejson-serde_result]: ./media/hdinsight-using-json-in-hive/serde_result.png

