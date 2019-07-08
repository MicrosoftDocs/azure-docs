---
title: MapReduce with Apache Hadoop on HDInsight 
description: Learn how to run MapReduce jobs on Apache Hadoop in HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 03/20/2019
---
# Use MapReduce in Apache Hadoop on HDInsight

Learn how to run MapReduce jobs on HDInsight clusters. 

## <a id="whatis"></a>What is MapReduce

Apache Hadoop MapReduce is a software framework for writing jobs that process vast amounts of data. Input data is split into independent chunks. Each chunk is processed in parallel across the nodes in your cluster. A MapReduce job consists of two functions:

* **Mapper**: Consumes input data, analyzes it (usually with filter and sorting operations), and emits tuples (key-value pairs)

* **Reducer**: Consumes tuples emitted by the Mapper and performs a summary operation that creates a smaller, combined result from the Mapper data

A basic word count MapReduce job example is illustrated in the following diagram:

![HDI.WordCountDiagram][image-hdi-wordcountdiagram]

The output of this job is a count of how many times each word occurred in the text.

* The mapper takes each line from the input text as an input and breaks it into words. It emits a key/value pair each time a word occurs of the word is followed by a 1. The output is sorted before sending it to reducer.
* The reducer sums these individual counts for each word and emits a single key/value pair that contains the word followed by the sum of its occurrences.

MapReduce can be implemented in various languages. Java is the most common implementation, and is used for demonstration purposes in this document.

## Development languages

Languages or frameworks that are based on Java and the Java Virtual Machine can be ran directly as a MapReduce job. The example used in this document is a Java MapReduce application. Non-Java languages, such as C#, Python, or standalone executables, must use **Hadoop streaming**.

Hadoop streaming communicates with the mapper and reducer over STDIN and STDOUT. The mapper and reducer read data a line at a time from STDIN, and write the output to STDOUT. Each line read or emitted by the mapper and reducer must be in the format of a key/value pair, delimited by a tab character:

    [key]/t[value]

For more information, see [Hadoop Streaming](https://hadoop.apache.org/docs/r1.2.1/streaming.html).

For examples of using Hadoop streaming with HDInsight, see the following document:

* [Develop C# MapReduce jobs](apache-hadoop-dotnet-csharp-mapreduce-streaming.md)

## <a id="data"></a>Example data

HDInsight provides various example data sets, which are stored in the `/example/data` and `/HdiSamples` directory. These directories are in the default storage for your cluster. In this document, we use the `/example/data/gutenberg/davinci.txt` file. This file contains the notebooks of Leonardo da Vinci.

## <a id="job"></a>Example MapReduce

An example MapReduce word count application is included with your HDInsight cluster. This example is located at `/example/jars/hadoop-mapreduce-examples.jar` on the default storage for your cluster.

The following Java code is the source of the MapReduce application contained in the `hadoop-mapreduce-examples.jar` file:

```java
package org.apache.hadoop.examples;

import java.io.IOException;
import java.util.StringTokenizer;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.GenericOptionsParser;

public class WordCount {

    public static class TokenizerMapper
        extends Mapper<Object, Text, Text, IntWritable>{

    private final static IntWritable one = new IntWritable(1);
    private Text word = new Text();

    public void map(Object key, Text value, Context context
                    ) throws IOException, InterruptedException {
        StringTokenizer itr = new StringTokenizer(value.toString());
        while (itr.hasMoreTokens()) {
        word.set(itr.nextToken());
        context.write(word, one);
        }
    }
    }

    public static class IntSumReducer
        extends Reducer<Text,IntWritable,Text,IntWritable> {
    private IntWritable result = new IntWritable();

    public void reduce(Text key, Iterable<IntWritable> values,
                        Context context
                        ) throws IOException, InterruptedException {
        int sum = 0;
        for (IntWritable val : values) {
        sum += val.get();
        }
        result.set(sum);
        context.write(key, result);
    }
    }

    public static void main(String[] args) throws Exception {
    Configuration conf = new Configuration();
    String[] otherArgs = new GenericOptionsParser(conf, args).getRemainingArgs();
    if (otherArgs.length != 2) {
        System.err.println("Usage: wordcount <in> <out>");
        System.exit(2);
    }
    Job job = new Job(conf, "word count");
    job.setJarByClass(WordCount.class);
    job.setMapperClass(TokenizerMapper.class);
    job.setCombinerClass(IntSumReducer.class);
    job.setReducerClass(IntSumReducer.class);
    job.setOutputKeyClass(Text.class);
    job.setOutputValueClass(IntWritable.class);
    FileInputFormat.addInputPath(job, new Path(otherArgs[0]));
    FileOutputFormat.setOutputPath(job, new Path(otherArgs[1]));
    System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}
```

For instructions to write your own MapReduce applications, see the following document:

* [Develop Java MapReduce applications for HDInsight](apache-hadoop-develop-deploy-java-mapreduce-linux.md)

## <a id="run"></a>Run the MapReduce

HDInsight can run HiveQL jobs by using various methods. Use the following table to decide which method is right for you, then follow the link for a walkthrough.

| **Use this**... | **...to do this** | ...with this **cluster operating system** | ...from this **client operating system** |
|:--- |:--- |:--- |:--- |
| [SSH](apache-hadoop-use-mapreduce-ssh.md) |Use the Hadoop command through **SSH** |Linux |Linux, Unix, Mac OS X, or Windows |
| [Curl](apache-hadoop-use-mapreduce-curl.md) |Submit the job remotely by using **REST** |Linux or Windows |Linux, Unix, Mac OS X, or Windows |
| [Windows PowerShell](apache-hadoop-use-mapreduce-powershell.md) |Submit the job remotely by using **Windows PowerShell** |Linux or Windows |Windows |

## <a id="nextsteps"></a>Next steps

To learn more about working with data in HDInsight, see the following documents:

* [Develop Java MapReduce programs for HDInsight](apache-hadoop-develop-deploy-java-mapreduce-linux.md)

* [Use Apache Hive with HDInsight][hdinsight-use-hive]

* [Use Apache Pig with HDInsight][hdinsight-use-pig]


[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-get-started]:apache-hadoop-linux-tutorial-get-started.md
[hdinsight-develop-mapreduce-jobs]: apache-hadoop-develop-deploy-java-mapreduce-linux.md
[hdinsight-use-hive]:../hdinsight-use-hive.md
[hdinsight-use-pig]:hdinsight-use-pig.md


[powershell-install-configure]: /powershell/azureps-cmdlets-docs

[image-hdi-wordcountdiagram]: ./media/hdinsight-use-mapreduce/HDI.WordCountDiagram.gif
