<properties
   pageTitle="Common Microsoft Power BI Embedded scenarios"
   description=""
   services="power-bi-embedded"
   documentationCenter=""
   authors="dvana"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="powerbi-embedded"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="power-bi-embedded"
   ms.date="03/08/2016"
   ms.author="jocaplan"/>


# Common Microsoft Power BI Embedded scenarios

**Microsoft Power BI Embedded** Preview is primarily focused on exposing the majority of existing Power BI API functionality  as part of an Azure service for you to develop your applications with.  Additionally, you will be able to programmatically provision, develop and deploy the necessary resources and Power BI content. See [Get started sample](power-bi-embedded-get-started.md) . The following is a list of what's available in preview:

-	Azure Management
  -	Use of ARM APIs to:
      -	Provision a **Power BI Workspace Collection** within your Azure subscription
      -	Retrieve API keys for a **Workspace Collection**
-	Power BI Content Management
  -	API to create workspaces within a **Workspace Collection**
  -	API to import a Power BI desktop file (PBIX) into a workspace using key based auth
  -	API to modify connection strings of a dataset
  -	API to set credentials for a dataset to be able to talk to the correct source datasource
  -	Configure Data connectivity via direct query
  -	Import cached dataset
-	Content (dataset and report) authoring via the Power BI desktop
-	Report Embedding
  -	Fully interactive reports that were authored in the Power BI desktop can be embedded within your own application using a new application token auth
  -	One additional data filter can be passed to the report when it is rendered
