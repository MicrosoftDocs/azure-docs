---
title: Get started with the Knowledge Exploration Service | Microsoft Docs
description: Use Knowledge Exploration Service (KES) to create an engine for an interactive search experience across academic publications in Microsoft Cognitive Services.
services: cognitive-services
author: bojunehsu
manager: stesp

ms.service: cognitive-services
ms.technology: kes
ms.topic: article
ms.date: 03/26/2016
ms.author: paulhsu
---

<a name="getting-started"></a>
# Getting Started
In this walkthrough, we will use the Knowledge Exploration Service (KES) to create the backend engine for an interactive search experience over academic publications.  The command line tool [`kes.exe`](CommandLine.md) and all example files can be installed from the [Knowledge Exploration Service SDK](https://www.microsoft.com/en-us/download/details.aspx?id=51488).

The academic publications example contains a sample of 1000 academic papers published by researchers at Microsoft.  Each paper is associated with a title, publication year, authors, and keywords.  Each author is represented by an ID, name, and affiliation at the time of publication.  Each keyword may be associated with a set of synonyms (ex. *support vector machine* &rarr; *svm*).

<a name="defining-schema"></a>
## Defining schema
The schema describes the attribute structure of the objects in our domain.  It specifies the name and data type for each attribute in a JSON file format.  Below is the content of the file *Academic.schema* that we use in this example:

```json
{
  "attributes":[
    {"name":"Title", "type":"String"},
    {"name":"Year", "type":"Int32"},
    {"name":"Author", "type":"Composite"},
    {"name":"Author.Id", "type":"Int64", "operations":["equals"]},
    {"name":"Author.Name", "type":"String"},
    {"name":"Author.Affiliation", "type":"String"},
    {"name":"Keyword", "type":"String", "synonyms":"Keyword.syn"}
  ]
}
```

Here, we define *Title*, *Year*, and *Keyword* as a string, integer, and string attribute, respectively.  Since authors are represented by their ID, name, and affiliation, we define *Author* as a Composite attribute with 3 sub-attributes: *Author.Id*, *Author.Name*, and *Author.Affiliation*.

By default, attributes support all operations available for their data type, including *equals*, *starts_with*, *is_between*, etc.  Since author ID is only used internally as an identifier, we override the default and specify *equals* as the only indexed operation.

For the *Keyword* attribute, we allow synonyms to match the canonical keyword values by specifying the synonym file *Keyword.syn* in the attribute definition.  This file contains a list of canonical and synonym value pairs:

```json
...
["support vector machine","support vector machines"]
["support vector machine","support vector networks"]
["support vector machine","support vector regression"]
["support vector machine","support vector"]
["support vector machine","svm machine learning"]
["support vector machine","svm"]
["support vector machine","svms"]
["support vector machine","vector machine"]
...
```

See [Schema Format](SchemaFormat.md) for additional information about the schema definition.

<a name="generating-data"></a>
## Generating data
The data file describes the list of the publications to index, with each line specifying the attribute values of a paper in [JSON format](http://json.org/).  Below is a single line from the data file *Academic.data*, formatted for readability:

```
...
{
    "logprob": -16.714,
    "Title": "the world wide telescope",
    "Year": 2001,
    "Author": [
        {
            "Id": 717694024,
            "Name": "alexander s szalay",
            "Affiliation": "microsoft"
        },
        {
            "Id": 2131537204,
            "Name": "jim gray",
            "Affiliation": "microsoft"
        }
    ]
}
...
```

In this snippet, we specify the *Title* and *Year* attribute of the paper as a JSON string and number, respectively.  Multiple values are represented using JSON arrays.  Since "Author" is a composite attribute, each value is represented using a JSON object consisting of its sub-attributes.  Attributes with missing values, such as "Keyword" in this case, can be excluded from the JSON representation.

To differentiate the likelihood of different papers, we specify the relative log probability using the built-in "logprob" attribute.  Given a probability *p* between 0 and 1, we compute the log probability as log(*p*), where log() is the natural log function.

See [Data Format](DataFormat.md) for additional information about the data format.

<a name="building-index"></a>
## Building index
Once we have a schema file and data file, we can build a compressed binary index of the data objects using [`kes.exe build_index`](CommandLine.md#build_index-command).  In this example, we build the index file *Academic.index* from the input schema file *Academic.schema* and data file *Academic.data* using the following command:

`kes.exe build_index Academic.schema Academic.data Academic.index`

For rapid prototyping outside of Azure, [`kes.exe build_index`](CommandLine.md#build_index-command) can build small indices locally from data files containing up to 10,000 objects.  For larger data files, we can either run the command from within a [Windows VM in Azure](../../../articles/virtual-machines/windows/quick-create-portal.md), or perform a remote build in Azure.  See [Scaling up](#scaling-up) for details.

<a name="authoring-grammar"></a>
## Authoring grammar
The grammar specifies the set of natural language queries that the service can interpret, as well as how these natural language queries are translated into semantic query expressions.  In this example, we use the grammar specified in *academic.xml*:

```xml
<grammar root="GetPapers">

  <!-- Import academic data schema-->
  <import schema="academic.schema" name="academic"/>

  <!-- Define root rule-->
  <rule id="GetPapers">
    <example>papers about machine learning by michael jordan</example>

    papers
    <tag>
      yearOnce = false;
      isBeyondEndOfQuery = false;
      query = All();
    </tag>

    <item repeat="1-" repeat-logprob="-10">
      <!-- Do not complete additional attributes beyond end of query -->
      <tag>AssertEquals(isBeyondEndOfQuery, false);</tag>

      <one-of>
        <!-- about <keyword> -->
        <item logprob="-0.5">
          about <attrref uri="academic#Keyword" name="keyword"/>
          <tag>query = And(query, keyword);</tag>
        </item>

        <!-- by <authorName> [while at <authorAffiliation>] -->
        <item logprob="-1">
          by <attrref uri="academic#Author.Name" name="authorName"/>
          <tag>authorQuery = authorName;</tag>
          <item repeat="0-1" repeat-logprob="-1.5">
            while at <attrref uri="academic#Author.Affiliation" name="authorAffiliation"/>
            <tag>authorQuery = And(authorQuery, authorAffiliation);</tag>
          </item>
          <tag>
            authorQuery = Composite(authorQuery);
            query = And(query, authorQuery);
          </tag>
        </item>

        <!-- written (in|before|after) <year> -->
        <item logprob="-1.5">
          <!-- Allow this grammar path to be traversed only once -->
          <tag>
            AssertEquals(yearOnce, false);
            yearOnce = true;
          </tag>
          <ruleref uri="#GetPaperYear" name="year"/>
          <tag>query = And(query, year);</tag>
        </item>
      </one-of>

      <!-- Determine if current parse position is beyond end of query -->
      <tag>isBeyondEndOfQuery = GetVariable("IsBeyondEndOfQuery", "system");</tag>
    </item>
    <tag>out = query;</tag>
  </rule>

  <rule id="GetPaperYear">
    <tag>year = All();</tag>
    written
    <one-of>
      <item>
        in <attrref uri="academic#Year" name="year"/>
      </item>
      <item>
        before
        <one-of>
          <item>[year]</item>
          <item>
            <attrref uri="academic#Year" op="lt" name="year"/>
          </item>
        </one-of>
      </item>
      <item>
        after
        <one-of>
          <item>[year]</item>
          <item>
            <attrref uri="academic#Year" op="gt" name="year"/>
          </item>
        </one-of>
      </item>
    </one-of>
    <tag>out = year;</tag>
  </rule>
</grammar>
```

For more information about the grammar specification syntax, see [Grammar Format](GrammarFormat.md).

<a name="compiling-grammar"></a>
## Compiling grammar
Once we have an XML grammar specification, we can compile it into a binary grammar using [`kes.exe build_grammar`](CommandLine.md#build_grammar-command).  Note that if the grammar imports a schema, the schema file needs to be located in the same path as the grammar XML.  In this example, we build the binary grammar file *Academic.grammar* from the input XML grammar file *Academic.xml* using the following command:

`kes.exe build_grammar Academic.xml Academic.grammar`

<a name="hosting-index"></a>
## Hosting service
For rapid prototyping, we can host the grammar and index in a web service on the local machine using [`kes.exe host_service`](CommandLine.md#host_service-command).  Once hosted, we can access the service via [web APIs](WebAPI.md) to validate the data correctness and grammar design.  In this example, we host the grammar file *Academic.grammar* and index file *Academic.index* at http://localhost:8000/ using the following command:

`kes.exe host_service Academic.grammar Academic.index --port 8000`

This initiates a local instance of the web service.  We can interactively test the service by visiting `http::localhost:<port>` from a browser.  For more information, see [Testing service](#testing-service).  We can also directly call various [web APIs](WebAPI.md) to test natural language interpretation, query completion, structured query evaluation, and histogram computation.  To stop the service, enter 'quit' into the `kes.exe host_service` command prompt or press 'Ctrl+C'.

* [http://localhost:8000/interpret?query=papers by susan t dumais](http://localhost:8000/interpret?query=papers%20by%20susan%20t%20dumais)
* [http://localhost:8000/interpret?query=papers by susan t d&complete=1](http://localhost:8000/interpret?query=papers%20by%20susan%20t%20d&complete=1)
* [http://localhost:8000/evaluate?expr=Composite(Author.Name=='susan t dumais')&attributes=Title,Year,Author.Name,Author.Id&count=2](http://localhost:8000/evaluate?expr=Composite%28Author.Name==%27susan%20t%20dumais%27%29&attributes=Title,Year,Author.Name,Author.Id&count=2)
* [http://localhost:8000/calchistogram?expr=And(Composite(Author.Name=='susan t dumais'),Year>=2013)&attributes=Year,Keyword&count=4](http://localhost:8000/calchistogram?expr=And%28Composite%28Author.Name=='susan%20t%20dumais'%29,Year>=2013%29&attributes=Year,Keyword&count=4)

Outside of Azure, [`kes.exe host_service`](CommandLine.md#host_service-command) is limited to indices of up to 10,000 objects, an API rate of 10 requests per second, and a total of 1000 requests before the process automatically terminates.  To bypass these restrictions, we can run the command from within a [Windows VM in Azure](../../../articles/virtual-machines/windows/quick-create-portal.md), or deploy to an Azure cloud service using the [`kes.exe deploy_service`](CommandLine.md#deploy_service-command) command.  See [Deploying service](#deploying-service) for details.

<a name="scaling-up"></a>
## Scaling up
When running `kes.exe` outside of Azure, the index is limited to 10,000 objects.  Once we are ready to scale up, we can build and host larger indices using Azure.  We can sign up for a [free trial](https://azure.microsoft.com/en-us/pricing/free-trial/).  Alternatively, for Visual Studio/MSDN subscriber, we can [activate subscriber benefits](https://azure.microsoft.com/en-us/pricing/member-offers/msdn-benefits-details/) which offer some Azure credits each month.

To allow `kes.exe` access to an Azure account, visit https://manage.windowsazure.com/publishsettings/ to download the Azure Publish Settings file.  If prompted, sign into the desired Azure account.  Once signed in, the browser will automatically download the Publish Settings file.  Save it as *AzurePublishSettings.xml* in the working directory from where `kes.exe` runs.

There are two ways to build and host large indices.  The first is to prepare the schema and data files in a Windows VM in Azure and run [`kes.exe build_index`](#building-index) to build the index locally on the VM without any size restrictions.  The resulting index can be hosted locally on the VM using [`kes.exe host_service`](#hosting-service) for rapid prototyping, again without any restrictions.  See the [Azure VM tutorial](../../../articles/virtual-machines/windows/quick-create-portal.md) for detailed steps to create an Azure VM.

The second method is to perform a remote Azure build using [`kes.exe build_index`](CommandLine.md#build_index-command) with the `--remote` parameter, which specifies an Azure VM size.  When the `--remote` parameter is specified, the command creates a temporary Azure VM of that size, builds the index on the VM, uploads the index to the target blob storage, and deletes the VM upon completion.  Your Azure subscription is charged for the cost of the VM while the index is being built.  This remote Azure build capability allows [`kes.exe build_index`](CommandLine.md#build_index-command) to be executed in any environment.  When performing a remote build, the input schema and data arguments may be local file paths or [Azure blob storage](../../../articles/storage/storage-dotnet-how-to-use-blobs.md) URLs.  The output index argument must be a blob storage URL.  To create an Azure storage account, see [Create Storage Account](../../../articles/storage/storage-create-storage-account.md).  Note that only classic storage accounts are supported at this time.  We can use the utility [AzCopy](../../../articles/storage/storage-use-azcopy.md) to efficiently copy files to and from blob storage.

In this example, we assume that the blob storage container http://&lt;*account*&gt;.blob.core.windows.net/&lt;*container*&gt;/ has already been created, containing the schema *Academic.schema*, referenced synonym file *Keywords.syn*, and full-scale data file *Academic.full.data*.  We can build the full index remotely using the following command:

`kes.exe build_index http://<account>.blob.core.windows.net/<container>/Academic.schema http://<account>.blob.core.windows.net/<container>/Academic.full.data http://<account>.blob.core.windows.net/<container>/Academic.full.index --remote Large`

Note that it may take 5-10 minutes to provision a temporay VM to build the index.  Thus, for rapid prototyping, we recommend one of two options:
  1. Develop with a smaller data set locally on any machine.
  2. Manually [create an Azure VM](../../../articles/virtual-machines/windows/quick-create-portal.md), [connect to it](../../../articles/virtual-machines/windows/quick-create-portal.md#connect-to-virtual-machine) via Remote Desktop, install the [Knowledge Exploration Service SDK](https://www.microsoft.com/en-us/download/details.aspx?id=51488), and run [`kes.exe`](CommandLine.md) from within the VM.

To avoid paging which slows down the build process, we recommend using a VM with 3 times the amount of RAM as the input data file size for index building, and a VM with 1 GB more RAM than the index size for hosting.  For a list of available VM sizes, see [Sizes for virtual machines](../../../articles/virtual-machines/virtual-machines-windows-sizes.md).

<a name="deploying-service"></a>
## Deploying service
Once we have a grammar and index, we are ready to deploy the service to an Azure cloud service.  To create a new Azure cloud service, see [How to Create and Deploy a Cloud Service](../../../articles/cloud-services/cloud-services-how-to-create-deploy-portal.md).  Do not specify a deployment package at this point.  

Once the cloud service has been created, we can use [`kes.exe deploy_service`](CommandLine.md#deploy_service-command) to deploy the service.  An Azure cloud service has two deployment slots: Production and Staging.  For a service that receives live user traffic, we should initially deploy to the Staging slot and wait for the service to start up and initialize itself.  Once the service is running, we can send a few requests to validate the deployment and verify that it passes basic tests.  Then, we [swap](../../../articles/cloud-services/cloud-services-nodejs-stage-application.md) the contents of the Staging slot with the Production slot so that live traffic will now be directed to the newly deployed service.  We can repeat this process when deploying an updated version of the service with new data.  Like all other Azure cloud services, we can optionally use the Azure portal to configure [auto-scaling](../../../articles/cloud-services/cloud-services-how-to-scale.md).

In this example, we will deploy the Academic index to the staging slot of an existing cloud service with *large* VMs using the following command:

`kes.exe deploy_service http://<account>.blob.core.windows.net/<container>/Academic.grammar http://<account>.blob.core.windows.net/<container>/Academic.index <serviceName> large --slot Staging`

For a list of available VM sizes, see [Sizes for virtual machines](../../../articles/virtual-machines/virtual-machines-windows-sizes.md).  Once the service has been deployed, we can call the various [web APIs](WebAPI.md) to test natural language interpretation, query completion, structured query evaluation, and histogram computation.  

<a name="testing-service"></a>
## Testing service
To debug a live service, we can simply navigate to the host machine from a web browser.  For a local service deployed via [host_service](#hosting-service), visit `http://localhost:<port>/`.  For an Azure cloud service deployed via [deploy_service](#deploying-service), visit `http://<serviceName>.cloudapp.net/`.  This page contains a link to information about basic API call statistics as well as the grammar and index hosted at this service. This page also contains an interactive search interface that demonstrates the use of the web APIs.  We can enter queries interactively into the search box to see the results of the [interpret](interpretMethod.md), [evaluate](evaluateMethod.md), and [calchistogram](calchistogramMethod.md) API calls.  The underlying HTML source of this page also serves as an example of how to integrate the web APIs into an app to create a rich interactive search experience.


