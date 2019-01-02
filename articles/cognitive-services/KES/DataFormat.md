---
title: Data format - Knowledge Exploration Service API
titlesuffix: Azure Cognitive Services
description: Learn about the data format in the Knowledge Exploration Service (KES) API.
services: cognitive-services
author: bojunehsu
manager: cgronlun

ms.service: cognitive-services
ms.component: knowledge-exploration
ms.topic: conceptual
ms.date: 03/26/2016
ms.author: paulhsu
---

# Data Format

The data file describes the list of objects to index.
Each line in the file specifies the attribute values of an object in [JSON format](http://json.org/) with UTF-8 encoding.
In addition to the attributes defined in the [schema](SchemaFormat.md), each object has an optional "logprob" attribute that 
specifies the relative log probability among the objects.
When the service returns objects in order of decreasing probability, we can use "logprob" to indicate the return order of matching objects.
Given a probability *p* between 0 and 1, the corresponding log probability can be computed as log(*p*), 
where log() is the natural log function.
When no value is specified for logprob, the default value 0 is used.

```json
{"logprob":-5.3, "Title":"latent dirichlet allocation", "Year":2003, "Author":{"Name":"david m blei", "Affiliation":"uc berkeley"}, "Author":{"Name":"andrew y ng", "Affiliation":"stanford"}, "Author":{"Name":"michael i jordan", "Affiliation":"uc berkeley"}}
{"logprob":-6.1, "Title":"probabilistic latent semantic indexing", "Year":1999, "Author":{"Name":"thomas hofmann", "Affiliation":"uc berkeley"}}
...
```

For String, GUID, and Blob attributes, the value is represented as a quoted JSON string.  For numeric attributes (Int32, Int64, Double), the value is represented as a JSON number.  For composite attributes, the value is a JSON object that specifies the sub-attribute values.  For faster index builds, presort the objects by decreasing log probability.

In general, an attribute may have 0 or more values.  If an attribute has no value, we simply drop it from the JSON.  If an attribute has 2 or more values, we can repeat the attribute value pair in the JSON object.  Alternatively, we can assign a JSON array containing the multiple values to the attribute.

```json
{"logprob":0, "Title":"0 keyword"}
{"logprob":0, "Title":"1 keyword", "Keyword":"foo"}
{"logprob":0, "Title":"2 keywords", "Keyword":"foo", "Keyword":"bar"}
{"logprob":0, "Title":"2 keywords (alt)", "Keyword":["foo", "bar"]}
```
