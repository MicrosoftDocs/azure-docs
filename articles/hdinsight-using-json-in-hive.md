<properties
   pageTitle="Analyze and Process JSON documents with Hive in HDInsight | Microsoft Azure"
   description="Learn how to use JSON documents and analyze them using Hive in HDInsight"
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


# Learn how to process and analyze JSON documents in Hive

JSON is one of the most commonly used format on the web. This tutorial will help you understand one of the common questions that users face in Hive – how to use JSON documents in Hive and then run analysis on them. 

##JSON Example

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

##Flattening a JSON document (step required only if you have pretty JSON)

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

##Options for analyzing JSON documents in Hive

Now that we have the JSON document in a table with a single column, we are ready to use Hive to run queries on this data. Hive provides three different mechanisms to run queries on JSON documents:

1.	Using User Defined Function (UDF): get_json_object
2.	Using UDF: json_tuple
3.	Using custom SerDe

Let us discuss each one of these in detail.

##get_json_object UDF
Hive provides a built-in UDF called [get_json_object](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF#LanguageManualUDF-get_json_object) which can perform JSON querying during run time. This method takes two arguments – the table name and method name which has the flattened JSON document and the JSON field that needs to be parsed. Let’s look at an example to see how this UDF works.

Get the first name and last name for each student

    select get_json_object(one_line_json.json_body, '$.StudentDetails.FirstName'), get_json_object(one_line_json.json_body, '$.StudentDetails.LastName') from one_line_json;

Here is the output when running this query in console window.

![get_json_object UDF][image-hdi-hivejson-getjsonobject]

There are a few limitations of this UDF. 


- One of the main ones is that this UDF is not performant since each field in the query will require reparsing the query, affecting performance.
- Secondly, get_json_object() returns string representation of an array. So to convert this to a Hive array, you will have to use regular expressions to replace the square brackets ‘[‘ and ‘]’ and then also call split to get the array.


This is why the Hive wiki recommends using json_tuple which we will discuss next.  


##json_tuple UDF

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

##Using custom SerDe

For parsing nested JSON documents, SerDe is the **best choice** since you can define the JSON schema making it very easy to run queries against it. 

We will discuss how to use one of the more popular SerDe that has been developed by [rcongiu](https://github.com/rcongiu).

Step 1: Ensure you have [Java SE Development Kit 7u55 JDK 1.7.0_55](http://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase7-521261.html#jdk-7u55-oth-JPR) installed (Note: If you have JDK 1.8 installed, it will not work with this SerDe). 


- If you are going to be using the Windows deployment of HDInsight choose the x64 Windows version of the JDK.
- After installation is complete, go to Control Panel --> Add Environment variables and add a new JAVA_HOME environment variable is pointing to C:\Program Files\Java\jdk1.7.0_55 or wherever your JDK is installed. The following screen shots show you how you can set the environment variable.

![Setting up correct config values for JDK][image-hdi-hivejson-jdk]

Step 2: Go to [this](http://mirror.olnevhost.net/pub/apache/maven/maven-3/3.3.1/binaries/apache-maven-3.3.1-bin.zip) link and download Maven 3.3.1. Unpack the archive where you would like to store the binaries. In my case, I will unzip it to C:\Program Files\Maven\. Add the bin folder to your path by going to Control Panel-->Edit the System Variables for your account Environment variables. The screenshot below shows you how to do this. 

![Setting up Maven][image-hdi-hivejson-maven]

Step 3: Clone the project from [Hive-JSON-SerDe](https://github.com/sheetaldolas/Hive-JSON-Serde/tree/master) github site. You can do this by clicking on the “Download Zip” button as shown in the screenshot below.

![Cloning the project][image-hdi-hivejson-serde]

Step 4: Go to the folder where you have downloaded this package and  type “mvn package”. This should create the necessary jar files that you can then copy over to the cluster. 

Step 5: Next, go to the target folder under the root folder where you downloaded the package. Upload the json-serde-1.1.9.9-Hive13-jar-with-dependencies.jar file to head-node of your cluster. I usually put it under the hive binary folder: C:\apps\dist\hive-0.13.0.2.1.11.0-2316\bin or something similar.
 
Step 6: In the hive prompt, type “add jar /path/to/json-serde-1.1.9.9-Hive13-jar-with-dependencies.jar”. Since in my case, the jar is in the C:\apps\dist\hive-0.13.x\bin folder, I can directly add the jar with the name as shown below:

    add jar json-serde-1.1.9.9-Hive13-jar-with-dependencies.jar;

![Adding JAR to your project][image-hdi-hivejson-addjar]

Now, we are ready to use the SerDe to run queries against the JSON document.

Let us first create the table with the schema of the JSON document. Note that we can handle much more richer types including map, arrays and structs. Type the code below in Hive console so that Hive creates a table named json_table which can read the JSON document based on the schema below. 

    drop table json_table;
    create external table json_table (
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
    ) row format serde 'org.openx.data.jsonserde.JsonSerDe'
    location '/json/temp';

Now that we have defined the schema, let’s run some examples to see how we can query the JSON document using Hive:

a)	List the first name and last name of the student

    select StudentDetails.FirstName, StudentDetails.LastName from json_table;

Here is the result from the Hive console.

![SerDe Query 1][image-hdi-hivejson-serde_query1]

b)	This query calculates the sum of scores of the JSON document

    select sum(scores)
    from json_table jt
      lateral view explode(jt.StudentClassCollection.Score) collection as scores;
       
The query above uses [lateral view explode](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+LateralView) UDF to expand the array of scores so that they can be summed. 

Here is the output from the Hive console.

![SerDe Query 2][image-hdi-hivejson-serde_query2]

c)	Find which subjects a given student has scored more than 80 points
    select  
      jt.StudentClassCollection.ClassId 
    from json_table jt
      lateral view explode(jt.StudentClassCollection.Score) collection as score  where score > 80;
      
The query above returns a Hive array unlike get_json_object which returns a string. 

![SerDe Query 3][image-hdi-hivejson-serde_query3]

If you want to skil malformed JSON, then as explained in the [wiki page](https://github.com/sheetaldolas/Hive-JSON-Serde/tree/master) of this SerDe you can achieve that by typing the code below:  

    ALTER TABLE json_table SET SERDEPROPERTIES ( "ignore.malformed.json" = "true");


##Other options
Other than the options listed below you can also write your own custom code using Python or other languages which is specific to your scenario. Once your have your python script ready, see [this article][hdinsight-python] on running your own Python code with Hive. 

##Summary
In conclusion, the type of JSON operator in Hive that you choose depends on your scenario. If you have a simple JSON document and you only have one field to look up on – you can choose to use the Hive UDF get_json_object. If you have more than one keys to look up on then you can use json_tuple. If you have a nested document, then you should use the JSON SerDe.

We at HDInsight are working towards making it even easier for you to use more formats natively in Hive without extensive work on your part. We will update this tutorial with more details once we have something to share.  

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
