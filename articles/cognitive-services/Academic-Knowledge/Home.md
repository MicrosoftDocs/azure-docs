---
title: What is Academic Knowledge API?
titlesuffix: Azure Cognitive Services
description: Use the Academic Knowledge API to interpret user queries and retrieve rich information from the Academic Graph.
services: cognitive-services
author: mvorvoreanu
manager: cgronlun

ms.service: cognitive-services
ms.component: academic-knowledge
ms.topic: overview
ms.date: 03/27/2017
ms.author: mivorvor
---

# Academic Knowledge API

Welcome to the Academic Knowledge API. With this service, you will be able to interpret user queries for academic intent and retrieve rich information from the Microsoft Academic Graph (MAG). The MAG knowledge base is a web-scale heterogeneous entity graph comprised of entities that model scholarly activities: field of study, author, institution, paper, venue, and event. 

The MAG data is mined from the Bing web index as well as an in-house knowledge base from Bing. As a result of on-going Bing indexing, this API will contain fresh information from the Web following discovery and indexing by Bing. Based on this dataset, the Academic Knowledge APIs enables a knowledge-driven, interactive dialog that seamlessly combines reactive search with proactive suggestion experiences, rich research paper graph search results, and histogram distributions of the attribute values for a set of papers and related entities.

For more information on the Microsoft Academic Graph, see [http://aka.ms/academicgraph](http://aka.ms/academicgraph).

The Academic Knowledge API has moved from Cognitive Services Preview to Cognitive Services Labs. The new homepage for the project is: [https://labs.cognitive.microsoft.com/en-us/project-academic-knowledge](https://labs.cognitive.microsoft.com/en-us/project-academic-knowledge). Your existing API key will continue working until May 24th, 2018. After this date, please generate a new API key. Please note that paid preview will no longer be available once your existing key expires. Please contact our team if the free tier of the API is not sufficient for your purposes. 

## Features
The Academic Knowledge API consists of four related REST endpoints:  
  1. **interpret** – Interprets a natural language user query string. Returns annotated interpretations to enable rich search-box auto-completion experiences that anticipate what the user is typing.  
  2. **evaluate** – Evaluates a query expression and returns Academic Knowledge entity results.  
  3. **calchistogram** – Calculates a histogram of the distribution of attribute values for the academic entities returned by a query expression, such as the distribution of citations by year for a given author.  
  4. **graph search** – Searches for a given graph pattern and returns the matched entity results.

Used together, these API methods allow you to create a rich semantic search experience. Given a user query string, the **interpret** method provides you with an annotated version of the query and a structured query expression, while optionally completing the user’s query based on the semantics of the underlying academic data. For example, if a user types the string *latent s*, the **interpret** method can provide a set of ranked interpretations, suggesting that the user might be searching for the field of study *latent semantic analysis*, the paper *latent structure analysis*, or other entity expressions starting with *latent s*. This information can be used to quickly guide the user to the desired search results.

The **evaluate** method can be used to retrieve a set of matching paper entities from the academic knowledge base, and the **calchistogram** method can be used to calculate the distribution of attribute values for a set of paper entities which can be used to further filter the search results.        

The **graph search** method has two modes: *json* and *lambda*. The *json* mode can perform graph pattern matching according to the graph patterns specified by a JSON object. The *lambda* mode can perform server-side computations during graph traversals according to the user-specified lambda expressions.

## Getting Started 
Please see the subtopics at the left for detailed documentation.  Note that to improve the readability of the examples, the REST API calls contain characters (such as spaces) that have not been URL-encoded.  Your code will need to apply the appropriate URL-encodings.
