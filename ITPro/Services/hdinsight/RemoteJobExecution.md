<properties linkid="manage-services-hdinsight-remote-jobs" urlDisplayName="Remote Jobs with HDInsight" pageTitle="Programmatically execute remote jobs on HDInsight - Windows Azure Services" metaKeywords="remote job, remote job hdinsight, hdinsight azure" metaDescription="How to programmatically execute remote jobs on your HDInsight cluster" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

#Executing Remote Jobs on Your HDInsight Cluster Programmatically

HDInsight includes the abililty to initiate job execution on your HDInsight cluster programmatically. Some of the scenarios where this can be benficial are:

* Scheduled execution of a job (every night at midnight, update the recommendation database)
* Incorporating job execution into a larger application (allow a client to configure and kick off web log processing)
* Building end user query tools 

In order to enable these scenarios, an HDInsight cluster exposes a WebHCat endpoint.  WebHCat is a REST API to provide metadata management and remote job submission to the Hadoop cluster.  You can find updated documentation [here](http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-Win-1.1/ds_Templeton/index.html). (Note, WebHCat has also been referred to as "Templeton" so expect to see some references to that.)

WebHCat surfaces the following capabilities:

* Management of [HCatalog](http://incubator.apache.org/hcatalog/) metadata 
* [Hive](http://hive.apache.org/) job submission
* [Pig](http://pig.apache.org/) job submission
* [Map/Reduce](http://hadoop.apache.org/docs/r1.0.4/mapred_tutorial.html) job submission
* [Streaming](http://hadoop.apache.org/docs/r1.0.4/streaming.html) Map/Reduce job submission 


In order to consume this, you have a few options:

* Construct REST calls directly using Curl, Fiddler or other HTTP tools
* Leverage the .NET client that published on CodePlex: [CodePlex](http://hdx.codeplex.com)

##Constructing REST Calls Directly##

By following the documentation [here](http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-Win-1.1/ds_Templeton/index.html), you can construct a request to submit a job.  If you are writing a Pig or Hive job that dumps output to the console you will need to specify a status directory parameter this will be the path to write the output to a file named stderr.  For instance, to run a basic Hive query
   
    curl -s -d user.name=admin 
         -d execute="select * from hivesampletable;" 
         -d statusdir="hivejob.output" 
         -u admin
          'https://yourhadoopcluster.azurehdinsight.net:563/templeton/v1/hive'

You can also use the programming language of your choice to submit jobs.  Authentication is basic authentication using the username and password that was specified when the cluster was initially created.

##Leverage the .NET client

Within a .NET application, you can easily use the [`Microsoft.Hadoop.WebClient`](http://www.nuget.org/packages/Microsoft.Hadoop.WebClient) NuGet package in your project to submit and monitor jobs.

* Obtain the NuGet package either using the VS Package Manager or 
* Create an instance of WebHCatHttpClient passing in your server configuration, namely:
 * URL: https://yourhadoopcluster.azurehdinsight.net:563
 * username/password: cluster credentials
* Invoke the job type you want.  Initially, a basic reply will be sent back with the job id.  You can either poll the job status, or use the `WaitForJobToCompleteAsync` method in order to obtain a task which will be leveraged when the job completes.

The following sample code shows how you can do this (in C#) 

    httpClient = new WebHCatHttpClient(new Uri("https://yourazurecluster.azurehdinsight.net:563"), "username", "password");
    string outputDir = "basichivejob";
    var t1 = httpClient.CreateHiveJob(@"select * from awards;", null, null, outputDir, null);
    t1.Wait();
    var response = t1.Result;
    var output = response.Content.ReadAsAsync<JObject>();
    output.Wait();
    response.EnsureSuccessStatusCode();
    string id = output.Result.GetValue("id").ToString();
    httpClient.WaitForJobToCompleteAsync(id).Wait();
          
`CreateHiveJob` will submit the job, and will return with the job id that is read out using Json.net.  We then subscribe to the completion of the job using `WaitForJobToComplete`.  This will block until the job actually completes.  At this point, we could use the WebHDFS client to retreive the output, or use any of the standard storage management tooling. 

##Summary

There are multiple methods available to you for creating and monitoring jobs submitted to the cluster.  You can build your own tooling on top of the REST API that is surfaced, or use the .NET client. 

##Next Steps

In this topic you discovered how to programmatically run jobs remotely on the HDInsight Service. Next, learn how to use the browser-based interactive console to run jobs by reading the [Guidance: HDInsight Interactive JavaScript and Hive Consoles][interactive-console] topic.
If you are interested in learning more about creating jobs using MapReduce, Hive or Pig, see the following tutorials:

* [Tutorial: Using MapReduce][mapreduce]

* [Tutorial: Using Hive][hive]

* [Tutorial: Using Pig][pig]

[interactive-console]: /en-us/manage/services/hdinsight/interactive-javascript-and-hive-consoles/
[mapreduce]: /en-us/manage/services/hdinsight/using-mapreduce-with-hdinsight/
[hive]: /en-us/manage/services/hdinsight/using-hive-with-hdinsight/
[pig]: /en-us/manage/services/hdinsight/using-pig-with-hdinsight/