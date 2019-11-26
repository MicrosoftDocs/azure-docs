---
title: MapReduce with Apache Hadoop on HDInsight 
description: Learn how to run Apache MapReduce jobs on Apache Hadoop in HDInsight clusters.
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
