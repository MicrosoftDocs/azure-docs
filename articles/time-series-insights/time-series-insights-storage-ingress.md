---
 title: include file
 description: include file
 services: azure-digital-twins
 author: adamgerard
 ms.service: azure-digital-twins
 ms.topic: include
 ms.date: 09/21/2018
 ms.author: adgera
 ms.custom: include file
---

# Data Storage and ingress in The Azure Time Series Insights Update

The purpose of this document is to explain information related to how The Azure Time Series Insights Update will store and ingress data. This document covers the underlying storage structure, the file format, Time Series ID property, underlying ingress process, throughput, and limitations.

## Data Storage

The Azure Time Series Insights Update uses Azure blob storage with the Parquet file type. Time Series Insights manages all the data operations including creating blobs, indexing, and partitioning the data in the Azure storage account. These Azure blobs need to be created in an Azure storage account. To ensure that all events can be queried in a performant manner, The Azure Time Series Insights Update will support Azure storage general purpose V1 and V2 ‘hot’ configuration options.  

Like any other Azure storage blob, you can read and write to your Time Series Insights-created blobs to support different integration scenarios. However, it is important to remember Time Series Insights performance can be adversely affect by reading or writing to your blobs too frequently.


## CONTENT TWO

I am text.

![image-asset](media/image.png)

![image-asset-reused][1]

## Next steps

* [LINK](bla.md) text.


<!-- Images -->
[1]: media/reused_image.png