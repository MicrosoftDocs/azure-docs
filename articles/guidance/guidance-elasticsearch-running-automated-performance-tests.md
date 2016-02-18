
<properties
   pageTitle="Running the Automated Elasticsearch Performance Tests | Microsoft Azure"
   description="Description of how you can run the performance tests in your own environment."
   services=""
   documentationCenter="na"
   authors="mabsimms"
   manager="marksou"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/17/2016"
   ms.author="masimms"/>
   
   
# Running the Automated Elasticsearch Performance Tests


The documents [Maximizing Data Ingestion Performance with Elasticsearch on Azure](https://azure.microsoft.com/documentation/articles/guidance-elasticsearch-data-ingestion/) and [Maximizing Data Aggregation and Query Performance with Elasticsearch on Azure](TBD) describe a number of performance tests that were run against a sample Elasticsearch cluster.

These tests were scripted to enable them to be run in an automated manner. This document describes how you can repeat the tests in your own environment.

## Prerequisites

The automated tests require the following items:

-  An Elasticsearch cluster.

- A JMeter environment setup as described by the document [How-To Create a Performance Testing Environment for Elasticsearch](https://azure.microsoft.com/documentation/articles/guidance-elasticsearch-performance-testing-environment/).

- The following software installed on the JMeter Master VM only. 

    [Python 3.5.1](https://www.python.org/downloads/release/python-351/)

---

## How the Tests Work
The tests are run using JMeter. A JMeter Master server loads a test plan and passes it to a set of JMeter Subordinate servers which actually run the tests. The JMeter Master server coordinates the JMeter Subordinate servers and accumulates the results.

The following test plans are provided:

* [elasticsearchautotestplan3nodes.jmx](./ingestion-and-query-tests/templates/elasticsearchautotestplan3nodes.jmx). This test plan runs the ingestion test over a 3-node cluster.

* [elasticsearchautotestplan6nodes.jmx](./ingestion-and-query-tests/templates/elasticsearchautotestplan6nodes.jmx). This test plan runs the ingestion test over a 6-node cluster.

* [elasticsearchautotestplan6qnodes.jmx](./ingestion-and-query-tests/templates/elasticsearchautotestplan6qnodes.jmx). This test plan runs the ingestion and query test over a 6-node cluster.

* [elasticsearchautotestplan6nodesqueryonly.jmx](./ingestion-and-query-tests/templates/elasticsearchautotestplan6nodesqueryonly.jmx). This test plan runs the query-only test over a 6-node cluster.

---

You can use these test plans as a basis for your own scenarios if you need fewer or more nodes.

The test plans use a JUnit Request Sampler to generate and upload the test data. The JMeter test plan creates and runs this sampler, and monitors each of the Elasticsearch nodes for performance data. For more information, see the appendices to the documents [Maximizing Data Ingestion Performance with Elasticsearch on Azure](https://azure.microsoft.com/documentation/articles/guidance-elasticsearch-data-ingestion/) and [Maximizing Data Aggregation and Query Performance with Elasticsearch on Azure](TBD).

## Building and Deploying the JUnit JAR and Dependencies
Before running the Resilience Tests you should download, compile, and deploy the JUnit tests located under the performance/junitcode folder. These tests are referenced by the JMeter test plan. For more information, see the procedure Importing an Existing JUnit Test Project into Eclipse in the document [How-To: Create and Deploy a JMeter JUnit Sampler for Testing Elasticsearch Performance](TBD).

There are two versions of the JUnit tests:
- [Elasticsearch1.73](./ingestion-and-query-tests/junitcode/elasticsearch1.73). Use this code for performing the ingestion tests. These tests use Elasticsearch 1.73
- [Elasticsearch2](./ingestion-and-query-tests/junitcode/elasticsearch2). Use this code for performing the query tests. These tests use Elasticsearch 2.1 and later.

---

Copy the appropriate JAR file along with the rest of the dependencies to your JMeter machines. The process is described by the procedure Deploying a JUnit Test to JMeter in the document [How-To Create and Deploy a JMeter JUnit Sampler for Testing Elasticsearch Performance](TBD).

> **Important** After deploying a JUnit test, use JMeter to load and configure the test plans that reference this JUnit test and ensure that the *BulkInsertLarge* thread group references the correct JAR file, JUnit class name, and test method:
> 
> ![](./figures/Elasticsearch/performance-tests-image1.png)
> 
> Save the updated test plans before running the tests.

## Creating the Test Indexes
Each test performs ingestion and/or queries against a single index specified when the test is run. You should create the index using the schemas described in the appendices to the documents [Maximizing Data Ingestion Performance with Elasticsearch on Azure](https://azure.microsoft.com/documentation/articles/guidance-elasticsearch-data-ingestion/) and [Maximizing Data Aggregation and Query Performance with Elasticsearch on Azure](TBD) and configure them according to your test scenario (doc values enabled/disabled, multiple replicas, etc.) Note that the test plans assume that the index comprises a single type named *ctip*.

## Configuring the Test Script Parameters
Copy the following test script parameter files to the JMeter server machine:

* [run.properties](./ingestion-and-query-tests/run.properties). This file specifies the number of JMeter test threads to use, the duration of the test (in seconds), the IP address of a node (or a load balancer) in the Elasticsearch cluster, and the name of the cluster:

  ##### run.properties
  ---
  ```
  nthreads=3
  duration=300
  elasticip=<IP Address or DNS Name Here>
  clustername=<Cluster Name Here>
  ```
  Edit this file and specify the appropriate values for your test and cluster.

* [query-config-win.ini](./ingestion-and-query-tests/query-config-win.ini) and [query-config-nix.ini](./ingestion-and-query-tests/query-config-nix.ini). These two files contain the same information; the *win* file is formatted for Windows filenames and paths, and the *nix* file is formatted for Linux filenames and paths:

  ##### query-config-win.ini
  ---
  ```
  [DEFAULT]
  debug=true #if true shows console logs.

  [RUN]
  pathreports=C:\Users\administrator1\jmeter\test-results\ #path where tests results are saved.
  jmx=C:\Users\administrator1\testplan.jmx #path to the JMeter test plan.
  machines=10.0.0.1,10.0.02,10.0.0.3 #IPs of the Elasticsearch data nodes separated by commas.
  reports=aggr,err,tps,waitio,cpu,network,disk,response,view #Name of the reports separated by commas.
  tests=idx1 #Elasticsearch index name to test.
  properties=run.properties #Name of the properties file.
  ```

  Edit this file to specify the locations of the test results, the name of the JMeter test plan to run, the IP addresses of the Elasticsearch data nodes, the reports containing the raw performance data that will be generated, and the name (or names) of the index under test. If the *run.properties* file is located in a different folder or directory, specify the full path to this file.

---

## Running the Tests

* Copy the file [query-test.py](./ingestion-and-query-tests/query-test.py) to the JMeter server machine, in the same folder as the *run.properties* and *query-config-win.ini* (*query-config-nix.ini*) files.

* Ensure that *jmeter.bat* (Windows) or *jmeter.sh* (Linux) are on the executable path for your environment.

* Run the *query-test.py* script from the command line to perform the tests:

  ##### Command Line
  ---
  ```
  py query-test.py
  ```

* When the test has completed, the results are stored as the set of CSV files specified in the *query-config-win.ini* (*query-config-nix.ini*) file . You can use Excel to analyze and graph this data.

---
