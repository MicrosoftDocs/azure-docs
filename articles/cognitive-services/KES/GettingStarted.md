---
title: "Example: Getting started - Knowledge Exploration Service API"
titlesuffix: Azure Cognitive Services
description: Use Knowledge Exploration Service (KES) API to create an engine for an interactive search experience across academic publications.
services: cognitive-services
author: bojunehsu
manager: nitinme

ms.service: cognitive-services
ms.subservice: knowledge-exploration
ms.topic: sample
ms.date: 03/26/2016
ms.author: paulhsu
---

# Get started with the Knowledge Exploration Service

In this walkthrough, you use the Knowledge Exploration Service (KES) to create the engine for an interactive search experience for academic publications. You can install the command line tool, [`kes.exe`](CommandLine.md), and all example files from the [Knowledge Exploration Service SDK](https://www.microsoft.com/en-us/download/details.aspx?id=51488).

The academic publications example contains a sample of 1000 academic papers published by researchers at Microsoft.  Each paper is associated with a title, publication year, authors, and keywords. Each author is represented by an ID, name, and affiliation at the time of publication. Each keyword can be associated with a set of synonyms (for example, the keyword "support vector machine" can be associated with the synonym "svm").

## Define the schema

The schema describes the attribute structure of the objects in the domain. It specifies the name and data type for each attribute in a JSON file format. The following example is the content of the file *Academic.schema*.

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

Here, you define *Title*, *Year*, and *Keyword* as a string, integer, and string attribute, respectively. Because authors are represented by ID, name, and affiliation, you define *Author* as a composite attribute with three sub-attributes: *Author.Id*, *Author.Name*, and *Author.Affiliation*.

By default, attributes support all operations available for their data type, including *equals*, *starts_with*, and *is_between*. Because author ID is only used internally as an identifier, override the default, and specify *equals* as the only indexed operation.

For the *Keyword* attribute, allow synonyms to match the canonical keyword values by specifying the synonym file *Keyword.syn* in the attribute definition. This file contains a list of canonical and synonym value pairs:

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

For additional information about the schema definition, see [Schema Format](SchemaFormat.md).

## Generate data

The data file describes the list of the publications to index, with each line specifying the attribute values of a paper in [JSON format](https://json.org/).  The following example is a single line from the data file *Academic.data*, formatted for readability:

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

In this snippet, you specify the *Title* and *Year* attribute of the paper as a JSON string and number, respectively. Multiple values are represented by using JSON arrays. Because *Author* is a composite attribute, each value is represented by using a JSON object consisting of its sub-attributes. Attributes with missing values, such as *Keyword* in this case, can be excluded from the JSON representation.

To differentiate the likelihood of different papers, specify the relative log probability by using the built-in *logprob* attribute. Given a probability *p* between 0 and 1, you compute the log probability as log(*p*), where log() is the natural log function.

For more information, see [Data Format](DataFormat.md).

## Build a compressed binary index

After you have a schema file and data file, you can build a compressed binary index of the data objects by using [`kes.exe build_index`](CommandLine.md#build_index-command). In this example, you build the index file *Academic.index* from the input schema file *Academic.schema* and data file *Academic.data*. Use the following command:

`kes.exe build_index Academic.schema Academic.data Academic.index`

For rapid prototyping outside of Azure, [`kes.exe build_index`](CommandLine.md#build_index-command) can build small indices locally, from data files containing up to 10,000 objects. For larger data files, you can either run the command from within a [Windows VM in Azure](../../../articles/virtual-machines/windows/quick-create-portal.md), or perform a remote build in Azure. For details, see Scaling up.

## Use an XML grammar specification

The grammar specifies the set of natural language queries that the service can interpret, as well as how these natural language queries are translated into semantic query expressions. In this example, you use the grammar specified in *academic.xml*:

```xml
<grammar root="GetPapers">

  <!-- Import academic data schema-->
  <import schema="Academic.schema" name="academic"/>

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

## Compile the grammar

After you have an XML grammar specification, you can compile it into a binary grammar by using [`kes.exe build_grammar`](CommandLine.md#build_grammar-command). Note that if the grammar imports a schema, the schema file needs to be located in the same path as the grammar XML. In this example, you build the binary grammar file *Academic.grammar* from the input XML grammar file *Academic.xml*. Use the following command:

`kes.exe build_grammar Academic.xml Academic.grammar`

## Host the grammar and index in a web service

For rapid prototyping, you can host the grammar and index in a web service on the local machine, by using [`kes.exe host_service`](CommandLine.md#host_service-command). You can then access the service via [web APIs](WebAPI.md) to validate the data correctness and grammar design. In this example, you host the grammar file *Academic.grammar* and index file *Academic.index* at `http://localhost:8000/`. Use the following command:

`kes.exe host_service Academic.grammar Academic.index --port 8000`

This initiates a local instance of the web service. You can interactively test the service by visiting `http::localhost:<port>` from a browser. For more information, see Testing service.

You can also directly call various [web APIs](WebAPI.md) to test natural language interpretation, query completion, structured query evaluation, and histogram computation. To stop the service, enter "quit" into the `kes.exe host_service` command prompt, or press Ctrl+C. Here are some examples:

* [http://localhost:8000/interpret?query=papers by susan t dumais](http://localhost:8000/interpret?query=papers%20by%20susan%20t%20dumais)
* [http://localhost:8000/interpret?query=papers by susan t d&complete=1](http://localhost:8000/interpret?query=papers%20by%20susan%20t%20d&complete=1)
* [http://localhost:8000/evaluate?expr=Composite(Author.Name=='susan t dumais')&attributes=Title,Year,Author.Name,Author.Id&count=2](http://localhost:8000/evaluate?expr=Composite%28Author.Name==%27susan%20t%20dumais%27%29&attributes=Title,Year,Author.Name,Author.Id&count=2)
* [http://localhost:8000/calchistogram?expr=And(Composite(Author.Name=='susan t dumais'),Year>=2013)&attributes=Year,Keyword&count=4](http://localhost:8000/calchistogram?expr=And%28Composite%28Author.Name=='susan%20t%20dumais'%29,Year>=2013%29&attributes=Year,Keyword&count=4)

Outside of Azure, [`kes.exe host_service`](CommandLine.md#host_service-command) is limited to indices of up to 10,000 objects. Other limits include an API rate of 10 requests per second, and a total of 1000 requests before the process automatically terminates. To bypass these restrictions, run the command from within a [Windows VM in Azure](../../../articles/virtual-machines/windows/quick-create-portal.md), or deploy to an Azure cloud service by using the [`kes.exe deploy_service`](CommandLine.md#deploy_service-command) command. For details, see Deploying service.

## Scale up to host larger indices

When you are running `kes.exe` outside of Azure, the index is limited to 10,000 objects. You can build and host larger indices by using Azure. Sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial/). Alternatively, if you subscribe to Visual Studio or MSDN, you can [activate subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/). These offer some Azure credits each month.

To allow `kes.exe` access to an Azure account, [download the Azure Publish Settings file](https://portal.azure.com/#blade/Microsoft_Azure_ClassicResources/PublishingProfileBlade) from the Azure portal. If prompted, sign into the desired Azure account. Save the file as *AzurePublishSettings.xml* in the working directory from where `kes.exe` runs.

There are two ways to build and host large indices. The first is to prepare the schema and data files in a Windows VM in Azure. Then run `kes.exe build_index` to build the index locally on the VM, without any size restrictions. The resulting index can be hosted locally on the VM by using `kes.exe host_service` for rapid prototyping, again without any restrictions. For detailed steps, see the [Azure VM tutorial](../../../articles/virtual-machines/windows/quick-create-portal.md).

The second method is to perform a remote Azure build, by using [`kes.exe build_index`](CommandLine.md#build_index-command) with the `--remote` parameter. This specifies an Azure VM size. When the `--remote` parameter is specified, the command creates a temporary Azure VM of that size. It then builds the index on the VM, uploads the index to the target blob storage, and deletes the VM upon completion. Your Azure subscription is charged for the cost of the VM while the index is being built.

This remote Azure build capability allows [`kes.exe build_index`](CommandLine.md#build_index-command) to be run in any environment. When you are performing a remote build, the input schema and data arguments can be local file paths or [Azure blob storage](../../storage/blobs/storage-dotnet-how-to-use-blobs.md) URLs. The output index argument must be a blob storage URL. To create an Azure storage account, see [About Azure storage accounts](../../storage/common/storage-create-storage-account.md). To copy files efficiently to and from blob storage, use the [AzCopy](../../storage/common/storage-use-azcopy.md) utility.

In this example, you can assume that the following blob storage container has already been created: http://&lt;*account*&gt;.blob.core.windows.net/&lt;*container*&gt;/. It contains the schema *Academic.schema*, the referenced synonym file *Keywords.syn*, and the full-scale data file *Academic.full.data*. You can build the full index remotely by using the following command:

`kes.exe build_index http://<account>.blob.core.windows.net/<container>/Academic.schema http://<account>.blob.core.windows.net/<container>/Academic.full.data http://<account>.blob.core.windows.net/<container>/Academic.full.index --remote <vm_size>`

Note that it might take 5-10 minutes to provision a temporary VM to build the index. For rapid prototyping, you can:
- Develop with a smaller data set locally on any machine.
- Manually [create an Azure VM](../../../articles/virtual-machines/windows/quick-create-portal.md), [connect to it](../../../articles/virtual-machines/windows/quick-create-portal.md#connect-to-virtual-machine) via Remote Desktop, install the [Knowledge Exploration Service SDK](https://www.microsoft.com/en-us/download/details.aspx?id=51488), and run [`kes.exe`](CommandLine.md) from within the VM.

Paging slows down the build process. To avoid paging, use a VM with three times the amount of RAM as the input data file size for index building. Use a VM with 1 GB more RAM than the index size for hosting. For a list of available VM sizes, see [Sizes for virtual machines](../../../articles/virtual-machines/virtual-machines-windows-sizes.md).

## Deploy the service

After you have a grammar and index, you are ready to deploy the service to an Azure cloud service. To create a new Azure cloud service, see [How to create and deploy a cloud service](../../../articles/cloud-services/cloud-services-how-to-create-deploy-portal.md). Do not specify a deployment package at this point.  

When you have created the cloud service, you can use [`kes.exe deploy_service`](CommandLine.md#deploy_service-command) to deploy the service. An Azure cloud service has two deployment slots: production and staging. For a service that receives live user traffic, you should initially deploy to the staging slot. Wait for the service to start up and initialize itself. Then you can send a few requests to validate the deployment and verify that it passes basic tests.

[Swap](../../../articles/cloud-services/cloud-services-nodejs-stage-application.md) the contents of the staging slot with the production slot, so that live traffic is now directed to the newly deployed service. You can repeat this process when deploying an updated version of the service with new data. As with all other Azure cloud services, you can optionally use the Azure portal to configure [auto-scaling](../../../articles/cloud-services/cloud-services-how-to-scale-portal.md).

In this example, you deploy the *Academic* index to the staging slot of an existing cloud service with *\<vm_size>* VMs. Use the following command:

`kes.exe deploy_service http://<account>.blob.core.windows.net/<container>/Academic.grammar http://<account>.blob.core.windows.net/<container>/Academic.index <serviceName> <vm_size> --slot Staging`

For a list of available VM sizes, see [Sizes for virtual machines](../../../articles/virtual-machines/virtual-machines-windows-sizes.md).

After you deploy the service, you can call the various [web APIs](WebAPI.md) to test natural language interpretation, query completion, structured query evaluation, and histogram computation.  

## Test the service

To debug a live service, browse to the host machine from a web browser. For a local service deployed via host_service, visit `http://localhost:<port>/`.  For an Azure cloud service deployed via deploy_service, visit `http://<serviceName>.cloudapp.net/`.

This page contains a link to information about basic API call statistics, as well as the grammar and index hosted at this service. This page also contains an interactive search interface that demonstrates the use of the web APIs. Enter queries into the search box to see the results of the [interpret](interpretMethod.md), [evaluate](evaluateMethod.md), and [calchistogram](calchistogramMethod.md) API calls. The underlying HTML source of this page also serves as an example of how to integrate the web APIs into an app, to create a rich, interactive search experience.


