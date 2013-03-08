<properties linkid="manage-services-hdinsight-interactive-console" urlDisplayName="HDInsight interactive console" pageTitle="Using the HDInsight Interactive Console - Windows Azure tutorial" metaKeywords="hdinsight, hdinsight console, hdinsight javascript" metaDescription="Learn how to use the interactive JavaScript and Hive console with HDInsight" umbracoNaviHide="0" disqusComments="1" writer="bradsev" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

# HDInsight Interactive JavaScript and Hive Consoles

Microsoft Azure HDInsight Service comes with interactive consoles for both JavaScript and Hive. These consoles provide a simple, interactive read-evaluate-print loop (REPL) experience, where users can enter expressions, evaluated them, and then query and display the results of a MapReduce job immediately. The JavaScript console executes Pig Latin statements. The Hive console evaluates Hive Query Language (Hive QL) statements. Both types of statements get compiled to MapReduce programs on the Hadoop cluster. But managing Hadoop jobs with these languages and on these consoles is much simpler than remoting into the head node of the Hadoop cluster and working with MapReduce programs directly.

**The JavaScript console**	
The JavaScript console is a command shell that provides a fluent interface to the Hadoop ecosystem. A fluent interface uses a method of chaining instructions that relays the context of one call in a sequence to the subsequent call in that sequence. 
The JavaScript console provides:
		
- Access to the Hadoop cluster, its resources, and the Hadoop Distributed File System (HDFS) commands.
- Management and manipulate of data coming into and out of the Hadoop cluster.
- A fluent interface that evaluates Pig Latin and JavaScript statements to define a series of MapReduce programs to create data processing workflows.

**The Hive console**	
Hive is a data warehouse framework, built on top of Hadoop, that provides data management, querying, and analysis. It uses HiveQL, an SQL dialect, to query data stored in an Hadoop cluster. The Hive console provides:
			
- Access to the Hadoop cluster, its resources, and the HDFS commands.		
- An implementation of the Hive framework that can execute HiveQL statements on an Hadoop cluster.	
- A relational database model for HDFS that enables you to interact with data stored in the distributed file system as if that data were stored in tables.		
	

**Pig or Hive or MapReduce?**   

The JavaScript console uses Pig Latin, a data flow language, and the Hive console uses HiveQL, a query language. 	

Pig (and the JavaScript console) will tend to be preferred by those who are more familiar with a scripting approach, where a sequence of chained (or fluent) transformations is used to define a data processing workflow. It is also a good choice if you have seriously unstructured data.	

Hive (and its console) will tend to be preferred by those who are more familiar with SQL and a relational database environment. The use of schema and a table abstraction in Hive means the experience is very close to that typically encountered in a RDBMS.

Pig and Hive provide higher level languages that are compiled into MapReduce programs that are written in Java and that run on the HDFS. If you need really precise control or high performance you will need to write the MapReduce programs directly.


In this tutorial you will learn how to:

* run a MapReduce program from the HDInsight JavaScript console.
* read the output from a MapReduce job using from the JavaScript console and display the results in a table and graphically.
* create a Hive table that contains output from a sample MapReduce program.
* query the sample output data in a Hive table.


## Run a MapReduce program from the HDInsight JavaScript console

In this section, you run the WordCount sample that ships with HDInsight from the JavaScript console. The JavaScript query run here uses the fluent API layered on Pig that is provided by the Interactive Console.  The text file analyzed here is the Project Gutenberg eBook edition of *The Notebooks of Leonardo Da Vinci*. A filter is specified so that the results of the MapReduce job contains only the ten most frequently occurring words. 


1. From the **Hadoop Sample Gallery** page of HDInsight, click on the **WordCount** sample tile. From the **Downloads** section on the upper right, download the WordCount.js file to your local ../downloads directory.

2. From the **Your Cluster** page, click on the **Interactive Cluster** tile to bring up the JavaScript console. Enter the upload command `fs.put()` at the js> console and then enter the following parameters into the **Upload a file** window that pop up:  
	**Source:** _..\downloads\Wordcount.js_	 
 	**Destination:** ./WordCount.js/ 	
Note: Browse the location of the WordCount.js file. The full local path will be required. The single dot at the start of the destination path is needed as part of the relative address in HDFS.		
![HDI.JsConsole.UploadJs](../media/HDI.JsConsole.UploadJs.PNG?raw=true "Upload WordCoount.js")

3. Click the **Browse** button for the **Source**, navigate to the local ../downloads directory and select the WordCount.js file. Enter the **Destination** value as shown and click the **Upload** button.

4. Note if you were starting from scratch, you would also have to upload the data file, that is the davinci.txt file. But because HDInsight ships with this file already uploaded, this step is not needed here. 

5. To confirm that files have in fact been uploaded use the following commands at the js> prompt: `#ls` to verify that the WordCount.js file is in the default directory, and `#ls /example/data/gutenberg`
to verify that the data file is in the gutenberg directory.		
![HDI.JsConsole.ConfirmFilesUploaded](../media/HDI.JsConsole.ConfirmFilesUploaded.PNG?raw=true "Confirm Upload")
	
6. You can inspect the contents of the WordCount.js file, which contains the JavaScript code for the map and reduce functions, by using the `#cat WordCount.js` command. Note that the JavaScript map function removes capital letters from the text using the `toLowerCase()` method before counting the number of occurances of a word in the reduce function. 		
![HDI.JsConsole.JsCode](../media/HDI.JsConsole.JsCode.png?raw=true "JavaScript Code")

7. Execute the MapReduce program from the js> console with the `pig.from("/example/data/gutenberg/davinci.txt").mapReduce("/user/admin/WordCount.js", "word, count:long").orderBy("count DESC").take(10).to("DaVinciTop10Words")` command. Note how the instructions are "chained" together using the dot operator.

8. Scroll to the right and click on **View Log** if you want to observe the job progress. This log will also provide diagnostics if the job fails to complete. When the job does complete, you will see the message:	[main] INFO org.apache.pig.backend.hadoop.executionengine.mapReduceLayer.MapReduceLauncher - Success! followed by a link to the log file.


##Read the output from a MapReduce job using from the JavaScript console and display the results graphically

1. To display the results in the DaVinciTop10Words directory, use the `file = fs.read("DaVinciTop10Words")`	command at the js> prompt.			
![HDI.JsConsole.ReadTop10Words](../media/HDI.JsConsole.ReadTop10Words.PNG?raw=true "Read Top Ten Words")
	
2. Parse the contents of the file into a data file with the `data = parse(file.data, "word, count:long")` command.
		
3. Plot the data using the `graph.bar(data)` command.		
![HDI.JsConsole.BarGraphTop10Words](../media/HDI.JsConsole.BarGraphTop10Words.PNG?raw=true "Plot Top Ten Words")


##Create a Hive table that contains output from a sample

This section introduces you to the Hive interactive console. It shows how to create a Hive table from the output of a MapReduce job. The next section shows how to query the data in this table. The data used here is the output from the WordCount sample run with the default settings that ships with HDInsight. The MapReduce programs count the occurrences of words in the Project Gutenberg eBook edition of The Notebooks of Leonardo Da Vinci. 

**Preliminaries**	
This section  assumes that you have run the WordCount Java-based sample using the default setting. In brief, you go to the **Sample Gallery** and click on the **WordCount** sample icon. This brings up the **Deployment** page, where you click the **Deploy to your cluster** button. This brings up the **Create Job** page, where you click on the **Execute job** button.  [The Getting Started with HDInsight](/en-us/manage/services/hdinsight/get-started-hdinsight/) topic walks you through this procedure in detail and you should consult that topic if you need additional help to run this program.

**Create the Hive table**
	
1. From the **Your Cluster** page, click on the **Interactive Cluster** tile and then click the **Hive** button to bring up the **Interactive Hive** console. 
	
2. To create a two column table named _DaVinciWordCountTable_ from the WordCount sample output that was saved in the _DaVinciAllTopWords_ folder, enter the command:
		
		CREATE EXTERNAL TABLE DaVinciWordCountTable		
		(word STRING,
		count INT)	
		ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'	
		STORED AS TEXTFILE LOCATION '/DaVinciAllTopWords'	

3. Click the **EVALUATE** button on the lower left. 		
![HDI.Hive.CreateTable](../media/HDI.Hive.CreateTable.PNG?raw=true "Create Hive Table")

4. Note that the table is created as an EXTERNAL table to keep the folder targeted independent of the table. Also, note that you need only specify the folder in which the output file is located, not the file name itself.

5. To confirm that the two column table has been created, evaluate the statements:

		SHOW TABLES
		DESCRIBE DaVinciWordCountTable;	
![HDI.Hive.ShowDescribeTable](../media/HDI.Hive.ShowDescribeTable.PNG?raw=true "Hive Table Confirmation")

## Query data in a Hive table
1. To query for the words with the top ten number of occurrences, enter and evaluate the expression:

		SELECT word, count
		FROM DaVinciWordCountTable
		ORDER BY count DESC LIMIT 10

2. The results of this query are:			
![HDI.Hive.Query](../media/HDI.Hive.Query.PNG?raw=true "Hive Query Results")			
				
3. Note that these counts are not the same as the result obtained above from the JavaScript program. For example, the number of occurrences of the letter "a" is only 3801 here, whereas the result was 4791 above. This is due to an extra processing step introduced into the map function in the JavaScript program, which converted all the words to lower case. If you query for the number of occurrences of a capital "A" here, using the statement:

		SELECT word, count
		FROM DaVinciWordCountTable
		WHERE word = 'A'

4. The result is 990, which accounts for the difference: 3801 + 990 = 4791.		
![HDI.Hive.Query.CountDeltaPNG](../media/HDI.Hive.Query.CountDeltaPNG.PNG?raw=true "Hive Query Delta")

##Summary
You have seen how to run an Hadoop job from the Interactive JavaScript console and how to inspect the results from a job using this console. You have also seen how the Interactive Hive console can be used to inspect and process the results of a Hadoop job by creating and querying a table that contains the output from a MapReduce program. You have seen examples of Pig Latin and Hive QL statements being used in the consoles. Finally, you have seen how the REPL interactive nature of the JavaScript and Hive consoles simplifies using an Hadoop cluster.

## Next steps

* [Using Pig with HDInsight][hdinsight-pig] 

* [Using Hive with HDInsight][hdinsight-hive]

* [Using MapReduce with HDInsight][hdinsight-mapreduce]

[hdinsight-pig]: /en-us/manage/services/hdinsight/howto-pig/
[hdinsight-hive]: /en-us/manage/services/hdinsight/howto-hive/
[hdinsight-mapreduce]: /en-us/manage/services/hdinsight/howto-mapreduce/