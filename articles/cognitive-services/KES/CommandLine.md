---
title: Command-line interface - Knowledge Exploration Service API
titlesuffix: Azure Cognitive Services
description: Use the command-line interface to build index and grammar files from structured data, and then deploy them as web services.
services: cognitive-services
author: bojunehsu
manager: nitinme

ms.service: cognitive-services
ms.subservice: knowledge-exploration
ms.topic: conceptual
ms.date: 03/24/2016
ms.author: paulhsu
---

# Command Line Interface

The Knowledge Exploration Service (KES) command line interface provides the ability to build index and grammar files from structured data and deploy them as web services.  It uses the general syntax: `kes.exe <command> <required_args> [<optional_args>]`.  You can run `kes.exe` without arguments to display a list of commands, or `kes.exe <command>` to display a list of arguments available for the specified command.  Below is a list of available commands:

* build_index
* build_grammar
* host_service
* deploy_service
* describe_index
* describe_grammar

<a name="build_index-command"></a>

## build_index Command

The **build_index** command builds a binary index file from a schema definition file and a data file of objects to be indexed.  The resulting index file can be used to evaluate structured query expressions, or to generate interpretations of natural language queries in conjunction with a compiled grammar file.

`kes.exe build_index <schemaFile> <dataFile> <indexFile> [options]`

| Parameter      | Description               |
|----------------|---------------------------|
| `<schemaFile>` | Input schema path |
| `<dataFile>`   | Input data path   |
| `<indexFile>`  | Output index path |
| `--description <description>` | Description string |
| `--remote <vmSize>`           | Size of VM for remote build |

These files may be specified by local file paths or URL paths to Azure blobs.  The schema file describes the structure of the objects being indexed as well as the operations to be supported (see [Schema Format](SchemaFormat.md)).  The data file enumerates the objects and attribute values to be indexed (see [Data Format](DataFormat.md)).  When the build succeeds, the output index file contains a compressed representation of the input data that supports the desired operations.  

A description string may be optionally specified to subsequently identify a binary index using the **describe_index** command.  

By default, the index is built on the local machine.  Outside of the Azure environment, local builds are limited to data files containing up to 10,000 objects.  When the --remote flag is specified, the index will be built on a temporarily created Azure VM of the specified size.  This allows large indices to be built efficiently using Azure VMs with more memory.  To avoid paging which slows down the build process, we recommend using a VM with 3 times the amount of RAM as the input data file size.  For a list of available VM sizes, see [Sizes for virtual machines](../../../articles/virtual-machines/virtual-machines-windows-sizes.md).

> [!TIP] 
> For faster builds, presort the objects in the data file by decreasing probability.

<a name="build_grammar-command"></a>

## build_grammar Command

The **build_grammar** command compiles a grammar specified in XML to a binary grammar file.  The resulting grammar file can be used in conjunction with an index file to generate interpretations of natural language queries.

`kes.exe build_grammar <xmlFile> <grammarFile>`

| Parameter       | Description               |
|-----------------|---------------------------|
| `<xmlFile>`     | Input XML grammar specification path |
| `<grammarFile>` | Output compiled grammar path         |

These files may be specified by local file paths or URL paths to Azure blobs.  The grammar specification describes the set of weighted natural language expressions and their semantic interpretations (see [Grammar Format](GrammarFormat.md)).  When the build succeeds, the output grammar file contains a binary representation of the grammar specification to enable fast decoding.

<a name="host_service-command"/>

## host_service Command

The **host_service** command hosts an instance of the KES service on the local machine.

`kes.exe host_service <grammarFile> <indexFile> [options]`

| Parameter       | Description                |
|-----------------|----------------------------|
| `<grammarFile>` | Input binary grammar path         |
| `<indexFile>`   | Input binary index path           |
| `--port <port>` | Local port number.  Default: 8000 |

These files may be specified by local file paths or URL paths to Azure blobs.  A web service will be hosted at http://localhost:&lt;port&gt;/.  See [Web APIs](WebAPI.md) for a list of supported operations.

Outside of the Azure environment, locally hosted services are limited to index files up to 1 MB in size, 10 requests per second, and 1000 total calls.  To overcome these limitations, run **host_service** inside an Azure VM, or deploy to an Azure cloud service using **deploy_service**.

<a name="deploy_service-command"/>

## deploy_service Command

The **deploy_service** command deploys an instance of the KES service to an Azure cloud service.

`kes.exe deploy_service <grammarFile> <indexFile> <serviceName> <vmSize>[options]`

| Parameter       | Description                  |
|-----------------|------------------------------|
| `<grammarFile>` | Input binary grammar path           |
| `<indexFile>`   | Input binary index path             |
| `<serviceName>` | Name of target cloud service |
| `<vmSize>`      | Size of cloud service VM     |
| `--slot <slot>` | Cloud service slot: "staging" (default), "production" |

These files may be specified by local file paths or URL paths to Azure blobs.  Service name specifies a preconfigured Azure cloud service (see [How to Create and Deploy a Cloud Service](../../../articles/cloud-services/cloud-services-how-to-create-deploy-portal.md)).  The command will automatically deploy the KES service to the specified Azure cloud service, using VMs of the specified size.  To avoid paging which significantly decreases performance, we recommend using a VM with 1 GB more RAM than the input index file size.  For a list of available VM sizes, see [Sizes for Cloud Services](../../../articles/cloud-services/cloud-services-sizes-specs.md).

By default, the service is deployed to the staging environment, optionally overridden via the --slot parameter.  See [Web APIs](WebAPI.md) for a list of supported operations.

<a name="describe_index-command"/>

## describe_index command

The **describe_index** command outputs information about an index file, including the schema and description.

`kes.exe describe_index <indexFile>`

| Parameter     | Description      |
|---------------|------------------|
| `<indexFile>` | Input index path |

This file may be specified by a local file path or a URL path to an Azure blob.  The output description string can be specified using the --description parameter of the **build_index** command.

<a name="describe_grammar-command"/>

## describe_grammar command

The **describe_grammar** command outputs the original grammar specification used to build the binary grammar.

`kes.exe describe_grammar <grammarFile>`

| Parameter       | Description      |
|-----------------|------------------|
| `<grammarFile>` | Input grammar path |

This file may be specified by a local file path or a URL path to an Azure blob.

