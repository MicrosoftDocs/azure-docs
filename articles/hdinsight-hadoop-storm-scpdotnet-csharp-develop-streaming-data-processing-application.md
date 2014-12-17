<properties title="Develop streaming data processing applications with SCP.NET and C# on Storm in HDInsight" pageTitle="Develop streaming data processing apps with SCP.NET on Storm | Azure" description="Learn how to develop streaming data processing applications with SCP.NET and C# on Storm in HDInsight." services="hdinsight" solutions="" documentationCenter="" authors="Qianlin Xia" videoId="" scriptId="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/15/2014" ms.author="qixia" />

#Develop streaming data processing applications in C# with Stream Computing Platform and Storm in HDInsight

Stream Computing Platform (SCP) is a platform to build real-time, reliable, distributed, consistent and high performance data processing applications using .NET. It is built on top of [Apache Storm](http://storm.incubator.apache.org/) -- an open source, real-time stream processing system that is available with HDInsight.

In this article, you will learn:

* What SCP is and how it works with Storm

* How to create an SCP solution

* How to test an SCP solution

* How to deploy an SCP solution to an HDInsight Storm cluster

##Prerequisites

* An Azure subscription

* An HDInsight Storm cluster

* Visual Studio 2010 or 2013

##Table of Contents

* [SCP and Storm](#scpandstorm)

##<a id="scpandstorm"></a>SCP and Storm

Apache Storm is a distributed computation system that runs on Hadoop clusters, and allows you to perform real-time data processing. While Storm runs in the Java Virtual Machine (JVM), it was designed so that solutions (known as **topologies**,) can be implemented in a variety of programming languages. You can even create a topology that is a mix of components written in multiple languages.

SCP provides the libraries that make it easy to create Storm solutions using .NET. Azure HDInsight Storm clusters include the necessary server-side components to run SCP solutions that you create.

For more information on HDInsight Storm, see the [HDInsight Storm Overview](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-storm-overview/).

###Design an SCP solution

SCP provides interfaces that allow you to create the following Storm components:

* Spout - consumes data from a source (file, database, API, etc.) and emits one or more streams of tuples (an ordered list of elements)
* Bolt - consumes one or more streams and optionaly emits one or more streams
* Topology - defines how data flows between spouts and bolts, the parallelism of spouts and bolts, and configuration information

> [AZURE.NOTE] Spouts and bolts also implement generic processing. For example, a spout may break apart an incoming message into multiple tuples, or just emit one tuple and let a bolt extract the values it needs. Similarly, if you need to write data to a data store, you would implement this in a bolt.

Designing a solution involves the following:

* What data source will you be consuming? You must have a spout that implements this.
* What processing must occur? You must implement this in the spouts and/or bolts.
* If processing is broken across multiple bolts, what is the flow of data between them? You must describe this through the topology.
* How will processing be distributed across the nodes in the HDInsight cluster? You must describe this through the topology.

##Install the SCP SDK

The SCP SDK is provided on the HDInsight Storm cluster. After [creating an HDInsight Storm cluster](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-storm-getting-started/), use the following steps to download the SDK to your local development environment.

1. Sign in to the [Azure Management Portal](https://manage.windowsazure.com).

2. Click **HDINSIGHT** on the left pane. You will see a list of deployed HDInsight clusters.

3. Click the HDInsight cluster that you want to connect to.

4. From the top of the page, click **CONFIGURATION**.

5. From the bottom of the page, click **ENABLE REMOTE**.

6. In the Configure Remote Desktop wizard, enter a **username** and **password** for the remote desktop. Enter an expiration date in the **EXPIRES ON** box, then click the check icon.

7. Once Remote Desktop has been enabled, click **CONNECT** at the bottom of the page and then follow the instructions.

8. Once connected to the cluster through Remote Desktop, open **File Explorer** and enter **%storm_home%\examples** in the address bar.

9. Right-click the **SDK** folder, then select **Copy**.

10. On your local development environment, open **File Explorer** and browse to the location you want to store the SDK. Right-click and select **Paste**.

##Create an SCP solution

1. In Visual Studio, create a new project for a **Console Application**. Name this solution **WordCount**.

2. In **Solution Explorer**, right-click **References** and then select **Add reference**.

3. Select the **Browse** button at the bottom of **Reference Manager**, and then browse to the SDK folder you downloaded earlier. Select **Microsoft.SCP.dll** and **Microsoft.SCPLogger.dll**, and then click **Add**. Click **Ok** to close the Reference Manager window.

###Create the spout

1. In **Solution Explorer**, right-click **WordCount** and then select **Add | New item**. Select **Class** and enter **WordSpout.cs** as the name. Finally, click **Add**.

2. Open the **WordSpout.cs** file, and replace the existing code with the following. Be sure to read the comments to understand how this code works.

        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Text;
        using System.Threading.Tasks;
        using Microsoft.SCP;
        using System.Threading;

        namespace WordCount
        {
            class WordSpout : ISCPSpout
            {
                //Context
                private Context ctx;

                private Random rand = new Random();
                //The sentences to emit
                string[] sentences = new string[] {
                                                  "the cow jumped over the moon",
                                                  "an apple a day keeps the doctor away",
                                                  "four score and seven years ago",
                                                  "snow white and the seven dwarfs",
                                                  "i am at two with nature"};

                //Constructor
                public WordSpout(Context ctx)
                {
                    //Log that we are starting
                    Context.Logger.Info("WordSpout constructor called");
                    //Store the context that was passed
                    this.ctx = ctx;

                    //Define the schema for the emitted tuples
                    Dictionary<string, List<Type>> outputSchema = new Dictionary<string, List<Type>>();
                    //In this case, just a string tuple
                    outputSchema.Add("default", new List<Type>() { typeof(string) });
                    //Declare the schema for the stream
                    this.ctx.DeclareComponentSchema(new ComponentStreamSchema(null, outputSchema));
                }

                //Return a new instance of the spout
                public static WordSpout Get(Context ctx, Dictionary<string, Object> parms)
                {
                    return new WordSpout(ctx);
                }

                //Emit the next tuple
                //NOTE: When using data from an external data source
                //such as Service Bus, Event Hub, Twitter, etc.,
                //you would read and emit it in NextTuple
                public void NextTuple(Dictionary<string, object> parms)
                {
                    Context.Logger.Info("NextTuple enter");

                    //Get a random sentence
                    string sentence = sentences[rand.Next(0, sentences.Length - 1)];
                    Context.Logger.Info("Emit: {0}", sentence);
                    //Emit the sentence
                    this.ctx.Emit(new Values(sentence));

                    Context.Logger.Info("NextTuple exit");
                }

                //Ack's are not implemented
                public void Ack(long seqId, Dictionary<string, object> parms)
                {
                    throw new NotImplementedException();
                }

                //Ack's are not implemented, so
                //fail should never be called
                public void Fail(long seqId, Dictionary<string, object> parms)
                {
                    throw new NotImplementedException();
                }
            }
        }

###Create tests

1. In **Solution Explorer**, right-click **WordCount** and then select **Add | New item**. Select **Class** and enter **LocalTest.cs** as the name. Finally, click **Add**.

2. Open the **LocalTest.cs** file, and replace the existing code with the following. The code used to test the spout is very similar to the code that will be used to test bolts.

        using Microsoft.SCP;
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Text;
        using System.Threading.Tasks;

        namespace WordCount
        {
            class LocalTest
            {
                //Run tests
                public void RunTestCase()
                {
                    Dictionary<string, Object> emptyDictionary = new Dictionary<string, object>();
                    //Spout tests
                    {
                        //Get local context
                        LocalContext spoutCtx = LocalContext.Get();
                        //Get an instance of the spout
                        WordSpout spout = WordSpout.Get(spoutCtx, emptyDictionary);
                        //Call NextTuple to emit data
                        for (int i = 0; i < 10; i++)
                        {
                            spout.NextTuple(emptyDictionary);
                        }
                        //Store the stream for the next component
                        spoutCtx.WriteMsgQueueToFile("spout.txt");
                    }
                }
            }
        }

3. Open **Program.cs** and replace the existing code with the following.

        using Microsoft.SCP;
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Text;
        using System.Threading.Tasks;

        namespace WordCount
        {
            class Program
            {
                static void Main(string[] args)
                {
                    if (args.Count() > 0)
                    {
                        //Code to run on HDInsight cluster will go here
                    }
                    else
                    {
                        //Set log prefix information for the component being tested
                        System.Environment.SetEnvironmentVariable("microsoft.scp.logPrefix", "WordCount-LocalTest");
                        //Initialize the runtime
                        SCPRuntime.Initialize();

                        //If we are not running under the local context, throw an error
                        if (Context.pluginType != SCPPluginType.SCP_NET_LOCAL)
                        {
                            throw new Exception(string.Format("unexpected pluginType: {0}", Context.pluginType));
                        }
                        //Create an instance of LocalTest
                        LocalTest localTest = new LocalTest();
                        //Run the tests
                        localTest.RunTestCase();
                    }
                }
            }
        }

3. Run the application. After it completes, look in the **WordCount\bin\debug** directory under your Visual Studio project. There should be a file named **spout.txt**, which will contain the data emitted by the spout during this test. The contents should look similar to the following text.

        {"__isset":{"streamId":true,"tupleId":true,"evt":true,"data":true},"StreamId":"default","TupleId":"","Evt":1000,"Data":[[97,110,32,97,112,112,108,101,32,97,32,100,97,121,32,107,101,101,112,115,32,116,104,101,32,100,111,99,116,111,114,32,97,119,97,121]]}
        {"__isset":{"streamId":true,"tupleId":true,"evt":true,"data":true},"StreamId":"default","TupleId":"","Evt":1000,"Data":[[116,104,101,32,99,111,119,32,106,117,109,112,101,100,32,111,118,101,114,32,116,104,101,32,109,111,111,110]]}

    > [AZURE.NOTE] In the lines above, "Data" is the string emitted by the spout, but stored as a byte array. For example, `[[97,110,32,97,112,112,108,101,32,97,32,100,97,121,32,107,101,101,112,115,32,116,104,101,32,100,111,99,116,111,114,32,97,119,97,121]]` is "an apple a day keeps the doctor away".

###Create the bolts

1. In **Solution Explorer**, right-click **WordCount** and then select **Add | New item**. Select **Class** and enter **SplitterBolt.cs** as the name. Finally, click **Add**. Repeat this step to add a class named **CounterBolt.cs**.

2. Open the **SplitterBolt.cs** file, and replace the existing code with the following.

        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Text;
        using System.Threading.Tasks;
        using Microsoft.SCP;
        using System.Threading;

        namespace WordCount
        {
            class SplitterBolt : ISCPBolt
            {
                //Context
                private Context ctx;

                //Constructor
                public SplitterBolt(Context ctx)
                {
                    Context.Logger.Info("Splitter constructor called");
                    //Set context
                    this.ctx = ctx;
                    //Define the schema for the incoming tuples from spout
                    Dictionary<string, List<Type>> inputSchema = new Dictionary<string, List<Type>>();
                    //In this case, just a string tuple
                    inputSchema.Add("default", new List<Type>() {typeof (string)});
                    //Define the schema for tuples to be emitted from this bolt
                    Dictionary<string, List<Type>> outputSchema = new Dictionary<string, List<Type>>();
                    //We are also only emitting a string tuple
                    outputSchema.Add("default", new List<Type>() {typeof (string)});
                    //Declare both incoming and outbound schemas
                    this.ctx.DeclareComponentSchema(new ComponentStreamSchema(inputSchema, outputSchema));
                }

                //Get a new instance
                public static SplitterBolt Get(Context ctx, Dictionary<string, Object> parms)
                {
                    return new SplitterBolt(ctx);
                }

                //Process a tuple from the stream
                public void Execute(SCPTuple tuple)
                {
                    Context.Logger.Info("Execute enter");
                    //Get the incomin tuple value
                    string sentence = tuple.GetString(0);
                    //Split it
                    foreach (string word in sentence.Split(' '))
                    {
                        //Emit each word to the outbound stream
                        Context.Logger.Info("Emit: {0}", word);
                        this.ctx.Emit(Constants.DEFAULT_STREAM_ID, new List<SCPTuple> { tuple }, new Values(word));
                    }
                    Context.Logger.Info("Execute exit");
                }
            }
        }

4. Open the **CounterBolt.cs** file and replace the contents with the following.

        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Text;
        using System.Threading.Tasks;
        using Microsoft.SCP;

        namespace WordCount
        {
            class CounterBolt : ISCPBolt
            {
                //Context
                private Context ctx;

                //Store each word and a count of how many times it has
                //been emitted by the splitter
                private Dictionary<string, int> counts = new Dictionary<string, int>();

                //Constructor
                public CounterBolt(Context ctx)
                {
                    Context.Logger.Info("Counter constructor called");

                    //Set context
                    this.ctx = ctx;
                    //Define the schema for the incoming tuples from spout
                    Dictionary<string, List<Type>> inputSchema = new Dictionary<string, List<Type>>();
                    //Just a string, which will contain a word from the splitter
                    inputSchema.Add("default", new List<Type>() { typeof(string) });
                    //Define the schema for tuples to be emitted from this bolt
                    Dictionary<string, List<Type>> outputSchema = new Dictionary<string, List<Type>>();
                    //In this case, a string (containing a word) and an int (containing the count)
                    outputSchema.Add("default", new List<Type>() { typeof(string), typeof(int) });
                    this.ctx.DeclareComponentSchema(new ComponentStreamSchema(inputSchema, outputSchema));
                }

                //Get an instance
                public static CounterBolt Get(Context ctx, Dictionary<string, Object> parms)
                {
                    return new CounterBolt(ctx);
                }

                //Process a tuple from the stream
                public void Execute(SCPTuple tuple)
                {
                    Context.Logger.Info("Execute enter");
                    //Get the word that was emitted from the splitter
                    string word = tuple.GetString(0);
                    //Have we seen this word before?
                    int count = counts.ContainsKey(word) ? counts[word] : 0;
                    //Increment and store the count for this word
                    count++;
                    counts[word] = count;

                    Context.Logger.Info("Emit: {0}, count: {1}", word, count);
                    //Emit the word and the count
                    this.ctx.Emit(Constants.DEFAULT_STREAM_ID, new List<SCPTuple> { tuple }, new Values(word, count));

                    Context.Logger.Info("Execute exit");
                }
            }
        }

    > [AZURE.NOTE] This bolt emits a stream, which is useful for testing. In a real world solution, you would store the data to a database, queue, or other persistent store at the end of processing.

3. Open **LocalTest.cs** and add the following tests for SplitterBolt and CounterBolt after the previous spout test block.

        //SplitterBolt tests
        {
            LocalContext splitterCtx = LocalContext.Get();
            SplitterBolt splitter = SplitterBolt.Get(splitterCtx, emptyDictionary);
            //Read from the 'stream' emitted by the spout
            splitterCtx.ReadFromFileToMsgQueue("spout.txt");
            List<SCPTuple> batch = splitterCtx.RecvFromMsgQueue();
            foreach (SCPTuple tuple in batch)
            {
                splitter.Execute(tuple);
            }
            //Store the stream for the next component
            splitterCtx.WriteMsgQueueToFile("splitter.txt");
        }
        //CounterBolt tests
        {
            LocalContext counterCtx = LocalContext.Get();
            CounterBolt counter = CounterBolt.Get(counterCtx, emptyDictionary);
            //Read from the 'stream' emitted by the splitter
            counterCtx.ReadFromFileToMsgQueue("splitter.txt");
            List<SCPTuple> batch = counterCtx.RecvFromMsgQueue();
            foreach (SCPTuple tuple in batch)
            {
                counter.Execute(tuple);
            }
            //Store the stream for the next component
            counterCtx.WriteMsgQueueToFile("counter.txt");
        }

4. Run the solution. Once it finishes, you should now have the following files in the **WordCount\bin\debug** directory.

    * **spout.txt** - the data emitted by the WordSpout
    * **splitter.txt** - the data emitted by the SplitterBolt
    * **counter.txt** - the data emitted by the CounterBolt

###Add code to run on a cluster

1. Open **Program.cs** and replace the `//Code to run on HDInsight cluster will go here` line with the following, then rebuild the project

        //The component to run
        string compName = args[0];
        //Run the component
        if ("wordspout".Equals(compName))
        {
            //Set the prefix for logging
            System.Environment.SetEnvironmentVariable("microsoft.scp.logPrefix", "WordCount-Spout");
            //Initialize the runtime
            SCPRuntime.Initialize();
            //Run the plugin (WordSpout)
            SCPRuntime.LaunchPlugin(new newSCPPlugin(WordSpout.Get));
        }
        else if ("splitterbolt".Equals(compName))
        {
            System.Environment.SetEnvironmentVariable("microsoft.scp.logPrefix", "WordCount-Splitter");
            SCPRuntime.Initialize();
            SCPRuntime.LaunchPlugin(new newSCPPlugin(SplitterBolt.Get));
        }
        else if ("counterbolt".Equals(compName))
        {
            System.Environment.SetEnvironmentVariable("microsoft.scp.logPrefix", "WordCount-Counter");
            SCPRuntime.Initialize();
            SCPRuntime.LaunchPlugin(new newSCPPlugin(CounterBolt.Get));
        }
        else
        {
            throw new Exception(string.Format("unexpected compName: {0}", compName));
        }

4. Create a new file named **WordCount.spec** and use the following for the contents. This defines the topology - the components, how many instances to create across nodes in the cluster, and how data flows between them. This is written using the [Topology Specification Language](#spec).

        {
          :name "WordCount"
          :topology
            (nontx-topolopy
              "WordCount"

              {
                "spout"

                (spout-spec
                  (scp-spout
                    {
                      "plugin.name" "WordCount.exe"
                      "plugin.args" ["wordspout"]
                      "output.schema" {"default" ["sentence"]}
                    })

                  :p 1)
              }

              {
                "splitter"

                (bolt-spec
                  {
                    "spout" :shuffle
                  }

                  (scp-bolt
                    {
                      "plugin.name" "WordCount.exe"
                      "plugin.args" ["splitterbolt"]
                      "output.schema" {"default" ["word"]}
                    })

                  :p 1)

                "counter"

                (bolt-spec
                  {
                    "splitter" :global
                  }

                  (scp-bolt
                    {
                      "plugin.name" "WordCount.exe"
                      "plugin.args" ["counterbolt"]
                      "output.schema" {"default" ["word" "count"]}
                    })

                  :p 1)
              })

          :config
            {
              "topology.kryo.register" ["[B"]
            }
        }

4. Connect to the HDInsight Storm cluster using Remote Desktop and copy the **bin\debug** folder for your local WordCount project to your HDInsight Storm cluster. For example, copy it to the **%storm_home%\examples** folder and rename it to **WordCount**.

3. Copy the **WordCount.spec** to the HDInsight server too. Put it in the **%storm_home%\examples** directory.

4. On the HDInsight Storm cluster, use the **Storm Command-Line** icon on the desktop to open a command-line, and then use the following command to start the WordCount topology.

        bin\runspec examples\WordCount.spec temp examples\WordCount

    This will create a new folder named **temp**, and use the spec and the files for the WordCount solution to create a **WordCount.jar** file, which is then submitted to Storm.

5. Once the command completes, open **Storm UI** from the desktop. The **WordCount** topology should be listed. You can select the topology from the **Storm UI** to view statistics.

6. To stop the topology, in the **Storm UI**, select **WordCount**, and then select **Kill** from **Topology actions**.

##Summary

In the above steps, you've learned how to create, test, and deploy a basic word count topology created using the Stream Computing Platform. For more examples, see the **%storm_home%\examples** directory on your HDInsight cluster. For more detailed information on SCP, see the following reference.

##SCP reference

###SCP plugin interface

SCP applications (known as plugins) are plugged into the Storm pipeline. A plugin is a .NET console application that implements one or more the following interfaces.  

-	**ISCPSpout** - Use when implementing a non-transactional spout
- 	**ISCPTxSpout** - use when implementing a transactional spout
-	**ISCPBolt** - use when implementing a non-transactional bolt
-	**ISCPBatchBolt** - use when implementing a transactional bolt

####ISCPPlugin

ISCPPlugin is the base interface that all other SCP interfaces inherit from. Currently, it is a dummy interface.  

    public interface ISCPPlugin
    {
    }  

####ISCPSpout

ISCPSpout is the interface for a non-transactional spout.  

    public interface ISCPSpout : ISCPPlugin
    {
        void NextTuple(Dictionary<string, Object> parms);
        void Ack(long seqId, Dictionary<string, Object> parms);
        void Fail(long seqId, Dictionary<string, Object> parms);
    }  

When `NextTuple()` is called, the code can emit one or more tuples. If there is nothing to emit, this method should return without emitting anything.

`Ack()` and `Fail()` will be called only when ack is enabled in the spec file. The `seqId` is used to identify the tuple which is acked or failed. If ack is enabled in a non-transactional topology, the following emit function should be used in the spout:  

    public abstract void Emit(string streamId, List<object> values, long seqId);  

If ack is not supported in non-transactional topology, `Ack()` and `Fail()` can be left as empty functions.  

The `parms` parameter for these functions is an empty Dictionary object, and is reserved for future use.  

> [AZURE.NOTE] `NextTuple()`, `Ack()`, and `Fail()` are all called in a tight loop on a single thread. If there are no tuples to emit, consider using `sleep` for a short amount of time (such as 10 milliseconds) to conserve CPU cycles.

####ISCPTxSpout

ISCPTxSpout is the interface for a transactional spout.  

    public interface ISCPTxSpout : ISCPPlugin
    {
        void NextTx(out long seqId, Dictionary<string, Object> parms);
        void Ack(long seqId, Dictionary<string, Object> parms);
        void Fail(long seqId, Dictionary<string, Object> parms);
    }  

`NextTx()` is called to start a new transaction. The `seqId` is used to identify the transaction, which is also used in `Ack()` and `Fail()`. Data emitted from `NextTx()` will be stored in ZooKeeper to support replay. Because the storage capacity of ZooKeeper is very limited, you should only emit metadata, not bulk data in a transactional spout.  

Storm will replay a transaction automatically if it fails, so Fail() should not normally be called. But if SCP can check the metadata emitted by a transactional spout, it can call Fail() if the metadata is invalid.

The `parms` parameter for these functions is an empty Dictionary object, and is reserved for future use.

> [AZURE.NOTE] `NextTx()`, `Ack()`, and `Fail()` are all called in a tight loop on a single thread. If there are no tuples to emit, consider using `sleep` for a short amount of time (such as 10 milliseconds) to conserve CPU cycles.

####ISCPBolt

ISCPBolt is the interface for a non-transactional bolt.  

    public interface ISCPBolt : ISCPPlugin
    {
        void Execute(SCPTuple tuple);
    }

When a new tuple is available, the `Execute()` function will be called to process it.

####ISCPBatchBolt

ISCPBatchBolt is the interface for transactional bolt.  

    public interface ISCPBatchBolt : ISCPPlugin
    {
        void Execute(SCPTuple tuple);
        void FinishBatch(Dictionary<string, Object> parms);
    }  

When a new tuple is available, the `Execute()` function will be called to process it. `FinishBatch()` will be called when this transaction has ended.

The `parms` parameter for these functions is an empty Dictionary object, and is reserved for future use.

> [AZURE.NOTE] Bolts that implement `ISCPBatchBolt`, can get `StormTxAttempt` from `parms`. `StormTxAttempt` can be used to determine whether a tuple is the original, or a replay attempt. This is usually done at the commit bolt, and it is demonstrated in the **HelloWorldTx** example.  

###Object model

SCP.NET also provides a simple set of key objects for developers to program with.

* `Context` - provides information about the running environment to the application

* `StateStore` - provides metadata services, monotonic sequence generation, and wait-free coordination. Higher-level distributed concurrency abstractions can be built on `StateStore`, including distributed locks, distributed queues, barriers, and transaction services

* `SCPRuntime` - initializes the runtime environment and launches plugins when running a solution on Storm

* `LocalContext` - provides methods to serialize and deserialize the emitted tuples to local files when testing an application locally in Visual Studio

####Context

Each ISCPPlugin instance (ISCPSpout/ISCPBolt/ISCPTxSpout/ISCPBatchBolt) has a corresponding Context instance. The functionality provided by Context can be divided into two parts

* **Static** -  available in the entire C# process
* **Dynamic** - available for the specific instance  

**Static context**

* `public static ILogger Logger = null;` - provided for logging purposes  

* `public static SCPPluginType pluginType;` - gets the plugin type of the C# process. If the C# process is run in local test mode (without Java), the plugin type is “SCP_NET_LOCAL”

        public enum SCPPluginType
        {
            SCP_NET_LOCAL = 0,
            SCP_NET_SPOUT = 1,
            SCP_NET_BOLT = 2,
            SCP_NET_TX_SPOUT = 3,
            SCP_NET_BATCH_BOLT = 4
        }  

* `public static Config Config { get; set; }` - gets configuration parameters from the JVM. The parameters are passed from the JVM when the plugin is initialized. `Config` is contains two dictionaries

    * `public Dictionary<string, Object> stormConf { get; set; }` - contains parameters defined by Storm

    * `public Dictionary<string, Object> pluginConf { get; set; }` - contains parameters defined by SCP

* `public static TopologyContext TopologyContext { get; set; } ` - gets the topology context. It is most useful for components with multiple parallelism. The following demonstrates how to access the topology context

        if (Context.pluginType != SCPPluginType.SCP_NET_LOCAL)
        {
            Context.Logger.Info("TopologyContext info:");
            TopologyContext topologyContext = Context.TopologyContext;
            Context.Logger.Info("taskId: {0}", topologyContext.GetThisTaskId());
            taskIndex = topologyContext.GetThisTaskIndex();
            Context.Logger.Info("taskIndex: {0}", taskIndex);
            string componentId = topologyContext.GetThisComponentId();
            Context.Logger.Info("componentId: {0}", componentId);
            List<int> componentTasks = topologyContext.GetComponentTasks(componentId);
            Context.Logger.Info("taskNum: {0}", componentTasks.Count);
        }

**Dynamic context**

* `public void DeclareComponentSchema(ComponentStreamSchema schema);` - declares the output and input schema for streams. The following example declares an input schema that consists of a single string tuple and an output schema that consists of both a string tuple and an integer tuple

        this.ctx = context;
        Dictionary<string, List<Type>> inputSchema = new Dictionary<string, List<Type>>();
        inputSchema.Add("default", new List<Type>() { typeof(string) });
        outputSchema.Add("default", new List<Type>() { typeof(string), typeof(int) });
        this.ctx.DeclareComponentSchema(new ComponentStreamSchema(inputSchema, outputSchema));

* `public abstract void Emit(List<object> values);` - emits one or more tuples to the default stream. The following example emits two tuples to the default stream

        this.ctx.Emit(new Values(word, count));

* `public abstract void Emit(string streamId, List<object> values);` - emits one or more tuples to the specified stream. The following example emits two tuples to a stream named 'mystream'

        this.ctx.Emit("mystream", new Values(word, count));

When using non-transactional spouts and bolts that have ack enabled, use the following.

* `public abstract void Emit(string streamId, List<object> values, long seqId);` - emits one or more tuples and a sequence identifier **from a spout** to the specified stream. The following example emits a tuple and a sequence identifier to the default stream

        this.ctx.Emit(Constants.DEFAULT_STREAM_ID, new Values(word), lastSeqId);

* `public abstract void Emit(string streamId, IEnumerable<SCPTuple> anchors, List<object> values);` - emits one or more tuples and a sequence identifier **from a bolt** to the specified stream. The emitted tuples are anchored to the incoming tuples specified as the `anchors`. This enables acks to flow back up the pipeline by following the chain of incoming/outgoing tuples. The following example emits a tuple and a sequence identifier to the default stream, and anchors the emitted tuples against the incoming tuples contained in `tuple`

        this.ctx.Emit(Constants.DEFAULT_STREAM_ID, new List<SCPTuple> { tuple }, new Values(word));

* `public abstract void Ack(SCPTuple tuple);` - acks a tuple. Invokes the `ISCPSpout.Ack` function of the spout that originally produced the tuple

* `public abstract void Fail(SCPTuple tuple);` - fails a tuple. Invokes the `ISCPSpout.Fail` function of the spout that originally produced the tuple

####StateStore

SCP applications may use the `State` object to persist information in ZooKeeper, especially for atransactional topology. This allows transactional spouts to retrieve the state from ZooKeeper and restart the pipeline in the event of a crash.  

The `StateStore` object provides the following methods.

* `public static StateStore Get(string storePath, string connStr);` - gets a `StateStore` for the given path and connection string

* `public State Create();` - creates a new `State` object in this state store instance

* `public IEnumerable<State> GetUnCommitted();` - gets all `State` objects that are uncommited, excluding aborted states

* `public IEnumerable<State> States();` - gets all 'State' objects in the `StateStore`


* `public T Get<T>(string info = null);` - gets a `State` or `Registry` object

    * `info` - the `Registry` name to get. Only used when retrieving a `Registry` object

    * `T` - type of `State` or `Registry`

* `public IEnumerable<Registry> Commited();` - gets `Registry` objects that contain commited `State`

* `public IEnumerable<Registry> Aborted();` - gets `Registry` objects that contain aborted `State`

* `public State GetState(long stateId)` - gets the `State` object for the specified state ID

The **State** provides the following methods.

* `public void Commit(bool simpleMode = true);` - sets the status of the `State` object to commit

    > [AZURE.NOTE] When `simpleMode` is set to true, it will simply delete the corresponding ZNode in ZooKeeper. Otherwise, it will delete the current ZNode, and adding a new node in the `COMMITTED_PATH`.

* `public void Abort();` - sets the status of the `State` object to abort

* `public void PutAttribute<T>(string key, T attribute);` - sets an attribute value for the given key

    * `key` - the key set the attribute for

    * `attribute` - the attribute value

* `public T GetAttribute<T>(string key);` - gets the attribute value for the given key

####SCPRuntime

SCPRuntime provides the following methods.

* `public static void Initialize();` - initializes the SCP runtime environment. When called, the C# process will connect to the JVM and get configuration parameters and topology context

* `public static void LaunchPlugin(newSCPPlugin pluginDelegate);` - starts message processing loop. In this loop, the C# plugin will receive messages from the JVM (including tuples and control signals), and then process the messages

    * `pluginDelegate` - a delegate that can return an object that implements ISCPSpout/IScpBolt/ISCPTxSpout/ISCPBatchBolt

####LocalContext


* `List<SCPTuple> RecvFromMsgQueue();` - receives tupes from the queue

* `void WriteMsgQueueToFile(string filepath, bool append = false);` - persists tuples to file

* `void ReadFromFileToMsgQueue(string filepath);` - reads tuples from file


###<a id="spec"></a>Topology specification language

The SCP Topology Specification is a domain specific language for describing and configuring SCP topologies. It is based on Storm’s [Clojure DSL](http://storm.incubator.apache.org/documentation/Clojure-DSL.html).  

Use the following to define a Topology.

|New Functions|	Parameters|	Description
|-------------|-----------|-----------
|**tx-topolopy**|	topology-name<br> spout-map<br> bolt-map|	 Define a transactional topology with the topology name, spouts definition map and the bolts definition map
|**scp-tx-spout**|	exec-name<br> args<br> fields|	Define a transactional spout. It will run the application with ***exec-name*** using ***args***.<br><br>The ***fields*** is the Output Fields for spout
|**scp-tx-batch-bolt**|	exec-name<br> args<br> fields| 	Define a transactional Batch Bolt. It will run the application with ***exec-name*** using ***args***.<br><br>The Fields is the Output Fields for bolt.
|**scp-tx-commit-bolt**|	exec-name<br>args<br>fields|	Define a transactional Committer Bolt. It will run the application with ***exec-name*** using args.<br><br>The ***fields*** is the Output Fields for bolt
|**nontx-topolopy**|	topology-name<br> spout-map<br>bolt-map|	Define a nontransactional topology with the topology name,  spouts definition map and the bolts definition map
|**scp-spout**|	exec-name<br>args<br>fields<br>parameters|	Define a nontransactional spout. It will run the application with ***exec-name*** using ***args***.<br><br>The ***fields*** is the Output Fields for spout<br><br>The ***parameters*** is optional, using it to specify some parameters such as "nontransactional.ack.enabled".
|**scp-bolt**|	exec-name<br>args<br>fields<br>parameters|	Define a nontransactional Bolt. It will run the application with ***exec-name*** using ***args***.<br><br>The ***fields*** is the Output Fields for bolt<br><br>The ***parameters*** is optional, using it to specify some parameters such as "nontransactional.ack.enabled".

The following are keywords that can be used when defining a topology

|Keywords|	Description
|---------|------------
|**:name**|	Define the Topology Name
|**:topology**|	Define the Topology using the above functions and build in ones.
|**:p**|	Define the parallelism hint for each spout or bolt.
|**:config**|	Define configure parameter or update the existing ones
|**:schema**|	Define the Schema of Stream.

Frequently used paramters

|Parameter|	Description
|---------|------------
|**"plugin.name"**|	exe file name of the C# plugin
|**"plugin.args"**|	plugin args
|**"output.schema"**|	Output schema
|**"nontransactional.ack.enabled"**|	Whether ack is enabled for nontransactional topology

Topology specifications can be submitted directly to storm cluster for execution via the ***runspec*** command, which is located in the **%storm_home%\bin** directory on HDInsight Storm clusters.  

    usage: runSpec [spec-file target-dir [resource-dir] [-cp classpath]]
     ex: runSpec examples\HelloWorld\HelloWorld.spec target examples\HelloWorld\Target

> [AZURE.NOTE] The ***resource-dir*** parameter is optional, you need to specify it when you want to run a C# application, and this directory will contain the application, the dependencies and configurations.  

The ***classpath*** parameter is also optional. It is used to specify the Java classpath if the spec file contains a Java Spout or Bolt.  

###Miscellaneous features

####Input and output schema declaration

When you call `Emit()`, the platform serializes the tuple into a byte array and transfers it to the JVM. Storm will then transfer this tuple to the targets. Bolts will will then receive tuple. For C# bolts, the tuple is received from the JVM and converted back to the original type.

To support this serialization and deserialization, you must declare the schema of the inputs and outputs. These are defined as `Dictionary<string, List<Type>` objects, where the key is the stream ID and the value is the `Types` of the tuples that will be emitted. The component can declare multiple streams.

    public class ComponentStreamSchema
    {
        public Dictionary<string, List<Type>> InputStreamSchema { get; set; }
        public Dictionary<string, List<Type>> OutputStreamSchema { get; set; }
        public ComponentStreamSchema(Dictionary<string, List<Type>> input, Dictionary<string, List<Type>> output)
        {
            InputStreamSchema = input;
            OutputStreamSchema = output;
        }
    }

The `Context` object provides `DeclareComponentSchema`, which can be used to declare the schema for serialization/deserialization.

     public void DeclareComponentSchema(ComponentStreamSchema schema)

> [AZURE.NOTE] You must make sure the tuples emitted obey the schema defined for that stream, or you will receive a runtime exception.  

####Multi-stream supports

You can emit to multiple streams by making multiple calls to `Emit()`, specifying the `streamId` paramter for each stream to be written to.

> [AZURE.NOTE] Emitting to a non-existant stream will cause runtime exceptions.

####Field grouping

The build-in Fields Grouping in Strom does not working properly in SCP.NET. When proxying data into the JVM, all the field data types are actually `byte[]`, and the fields grouping uses the `byte[]` object hash code to perform the grouping. The `byte[]` object hash code is the address of this object in memory, so the grouping will be wrong for two `byte[]` objects that share the same content but not the same address.

To workaround this problem, use `scp-field-group` in your spec. This will use the content of the byte[] to do the grouping. The following is an example of using this in a spec.  

    (bolt-spec
        {
            "spout_test"”" (scp-field-group :non-tx [0,1])
        }
        …
    )  

This example does the following.

* `scp-field-group` - use custom grouping  
* `:tx` or `:non-tx` - indicates whether this is transactional or non-transactional
* `[0,1]` - use a hashset of field Ids, starting from 0.  

####Hybrid topology

Most native Storm spouts, bolts, and topologies are implemented in Java. To support reuse of these components in solutions that use C# components, SCP allows you to create define hybrid topologies in the spec.

* **Java spout or bolt** - in the spec file, `scp-spout` and `scp-bolt` can also be used to specify Java spouts and bolts. The following demonstrates specifying a Java spout with a class name of `microsoft.scp.example.HybridTopology.Generator`

        (spout-spec
          (microsoft.scp.example.HybridTopology.Generator.)
          :p 1)

* **Java Classpath** - when using Java spouts or bolts, you should first compile the spout or bolt into a JAR file. Then, add the Java classpath with the `-cp` parameter when using the **runSpec** command. The following example includes the JAR files located under the **examples\HybridTopology\java\target** directory.  

        bin\runSpec.cmd examples\HybridTopology\HybridTopology.spec specs examples\HybridTopology\net\Target -cp examples\HybridTopology\java\target\*  


* **Serialization and deserialization between Java and C#** - To serielize objects between Java and C#, use the `CustomizedInteropJSONSerializer`

    > [WACOM.NOTE] Currently `CustomizedInteropJSONSerializer` only support **Java spouts** and **C# bolts**.

    * Specify the serializer for Java components in the spec file

            (scp-bolt
              {
                "plugin.name" "HybridTopology.exe"
                "plugin.args" ["displayer"]
                "output.schema" {}
                "customized.java.serializer" ["microsoft.scp.storm.multilang.CustomizedInteropJSONSerializer"]
              })  

    * Use the serializer in your C# components

            Dictionary<string, List<Type>> inputSchema = new Dictionary<string, List<Type>>();
            inputSchema.Add("default", new List<Type>() { typeof(Person) });
            this.ctx.DeclareComponentSchema(new ComponentStreamSchema(inputSchema, null));
            this.ctx.DeclareCustomizedDeserializer(new CustomizedInteropJSONDeserializer());  

    The default implementation should handle most cases if the data type is not too complex.  If the data type is too complex, or because the performance of the default implementation does not meet the your requirements, you can create a custom implementation to suit your needs using the following interfaces

    **Serialization interface in Java**  

            public interface ICustomizedInteropJavaSerializer {
                public void prepare(String[] args);
                public List<ByteBuffer> serialize(List<Object> objectList);
            }  

    **Deserialization interface in C#**

            public interface ICustomizedInteropCSharpDeserializer
            {
                List<Object> Deserialize(List<byte[]> dataList, List<Type> targetTypes);
            }  

###SCP host mode

Host mode allows you to compile your project to a DLL and host it using **SCPHost.exe**. This is the recommended way of hosting your solution in a production setting. When using host mode, the spec file will list `SCPHost.exe` as the plugin.

The following is an example of a spec file that used host mode for the HelloWorld example.

    (scp-spout
      {
        "plugin.name" "SCPHost.exe"
        "plugin.args" ["HelloWorld.dll" "Scp.App.HelloWorld.Generator" "Get"]
        "output.schema" {"default" ["sentence"]}
      })

* **HelloWorld.dll** - the assembly that contains the spouts and bolts
* **Scp.App.HelloWorld.Generator** - the class name for a spout contained in **HelloWorld.dll**
* **Get** - The method to invoke to get an instance of the spout


##SCP programming examples

The following example applications written with SCP can be found on your HDInsight Storm cluster at **%storm_home%\examples**.

* **HelloWorld** - HelloWorld is a very simple example of SCP.Net, and is similar to the word count example used earlier in this article. It uses a non-transactional topology, with a spout named **generator**, and two bolts named **splitter** and **counter**. The spout **generator** will randomly generate some sentences, and emit these sentences to **splitter**. The bolt **splitter** will split the sentences into words and emit these words to the **counter** bolt. The bolt **counter** uses a dictionary to record the occurrence number of each word.

    There are two spec files, **HelloWorld.spec** and **HelloWorld_EnableAck.spec** for this example. When using **HelloWorld_EnableAck.spec**, the sample will ack tuples that pass through the bolts, however **splitter** is designed to randomly fail some bolts to demonstrate failure handling in non-transactional topologies.

* **HelloWorldTx** - A sample of how to implement a transactional topology. It has a transactional spout named **generator**, a batch bolt named **partial-count**, and a commit bolt named **count-sum**. There are also three pre-created txt files for use with this topology: **DataSource0.txt**, **DataSource1.txt** and **DataSource2.txt**.

    In each transaction, the spout will randomly choose two files and emit the two file names to the **partial-count** bolt. The bolt will get the file name from the received tuple, then open the file and count the number of words in this file. Finally, it will emit the words and numbers to the **count-sum** bolt. The **count-sum** bolt will summarize the total count.  

    To achieve "exactly once" semantics, the **count-sum** bolt need to determine whether it is processing a replayed transaction. In this example, it has a static member variable:  

        public static long lastCommittedTxId = -1;  

    When an instance of the bolt is created, it will get the transaction attempt (`txAttempt`,) from input parameters:  

        public static CountSum Get(Context ctx, Dictionary<string, Object> parms)
        {
            /* for transactional topology, we can get txAttempt from the input parms */
            if (parms.ContainsKey(Constants.STORM_TX_ATTEMPT))
            {
                StormTxAttempt txAttempt = (StormTxAttempt)parms[Constants.STORM_TX_ATTEMPT];
                return new CountSum(ctx, txAttempt);
            }
            else
            {
                throw new Exception("null txAttempt");
            }
        }  

    When `FinishBatch()` is called, the `lastCommittedTxId` will be updated if it is not a replayed transaction.  

        public void FinishBatch(Dictionary<string, Object> parms)
        {
            /* judge whether it is a replayed transaction? */
            bool replay = (this.txAttempt.TxId <= lastCommittedTxId);

            if (!replay)
            {
                /* If it is not replayed, update the toalCount and lastCommittedTxId vaule */
                totalCount = totalCount + this.count;
                lastCommittedTxId = this.txAttempt.TxId;
            }
            … …
        }  

* **HybridTopology** - This topology contains a Java Spout and a C# Bolt. It uses the default serialization and deserialization implementation provided by SCP. Please see the **%storm_home%examples\HybridTopology\HybridTopology.spec** for details, and **SubmitTopology.bat** for how to specify the Java classpath when submitting the topology.  


[1]: ./media/hdinsight-hadoop-storm-scpdotnet-csharp-develop-streaming-data-processing-application/hdinsight-hadoop-storm-scpdotnet-csharp-develop-streaming-data-processing-application-01.png
