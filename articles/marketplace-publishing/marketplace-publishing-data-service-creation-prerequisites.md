<properties
   pageTitle="Technical Pre-requisites for creating a Data Service for the Marketplace | Microsoft Azure"
   description="Understand the requirements for creating a Data Service to deploy and sell on the Azure Marketplace"
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="01/04/2016"
   ms.author="hascipio; avikova" />

# Technical Pre-requisites for creating a Data Service offer for the Azure Marketplace
Read the process thoroughly before beginning and understand where and why each step is performed. As much as possible, you should prepare your company information and other data, download necessary tools, and/or create technical components before beginning the offer creation process.

You should have the following items ready before beginning the process:

## Make a decision on what technology will be used to publish your Data Service offer

A Publisher can decide between multiple technologies when publishing Data Service in Azure Marketplace. The main technologies that are supported described below. Regardless what technology is used to publish the Data Service, the end-user consumes the data through the **OData feed** exposed by Azure Marketplace Service. Full information about OData service you can find on [http://www.odata.org/](http://www.odata.org/)

## SQL Azure Database

Having dataset ready in SQL Azure is Publisher’s responsibility. You’ll need to subscribe to Azure, provision appropriate size of Database and upload your Data into SQL Azure DB. Publisher is also responsible to keep his/her data always up-to-date. More information about subscribing to Azure Services you can find on [https://azure.microsoft.com/services/sql-database/](https://azure.microsoft.com/services/sql-database/)


When moving the data into SQL Azure, the Azure Marketplace can expose tables and views. The Publisher can specify which tables/views and columns are exposed to the end-user. Further the content provider can also specify which columns can be queried by the end-user and which ones are only returned in the payload. This gives a high level of flexibility about which data in the database should be exposed. Columns that can be queried need to be backed by one or more database indices.

## REST based web service

Supported protocol: **HTTPS only**

Existing REST based services can be exposed through the Azure Marketplace. Because the dataset is always exposed to the end-user as an OData feed, the Azure Marketplace service needs to be able to map the service to a OData based service. To do so the REST based endpoints need to expose all parameters as HTTP parameters.

The payload needs to be in a form that can be mapped into an ATOM response. Hence the response from the services needs to be in XML format and can only contain one repeating element that contains the payload values (like record set). The Azure Marketplace service will map the repeating node to the entry node in ATOM and the payload values into property nodes within the entry node.

Authorization information (such as API key, authentication token, etc.) needs to be provided as an HTTP parameter or in the HTTP header (key value pair) – basic authentication is also supported. A valid key needs to be provided and all requests through Azure Marketplace are being made through that key. User monitoring and billing happens at the Azure Marketplace layer.

Errors returned by the service need to be mapped into HTTP status codes. In case the service returns a XML that contains the error these are going to be mapped by the Azure Marketplace service to HTTP status codes.

## SOAP based web services

Protocol: **HTTPS only**

The requirements are the same as in the REST based service section. The only difference is that parameters can also be provided in an XML body that’s being posted to the Publisher’s service with every request made through Azure Marketplace. This means that HTTP parameters the user provides at the front-end are being translated into XML elements of an XML document that’s being posted with the request to the content provider’s web service.

## OData based web services

Protocol: **HTTPS only**

Data can be exposed as an OData service to Azure Marketplace. The system is going to pass the service through and replaces the root of the service with the Azure Marketplace service root – to ensure all subsequent calls go through Azure Marketplace.

OData services don’t only need to go against a database in the backend. OData supports any kind of storage or business logic to drive the service.


## Next Steps
Now that you reviewed the pre-requisites and completed the necessary tasks, you can move forward with the creating your Data Service offer as detailed in the [Data Service Publishing Guide](marketplace-publishing-data-service-creation.md).

Or, if you would like to review the overall process and the respective articles for each of the publishing phases, please visit the article [Getting Started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md).

[link-acct]:marketplace-publishing-accounts-creation-registration.md
