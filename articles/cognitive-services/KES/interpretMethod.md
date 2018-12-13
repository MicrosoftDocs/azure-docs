---
title: Interpret method - Knowledge Exploration Service API
titlesuffix: Azure Cognitive Services
description: Learn how to use the Interpret method in the Knowledge Exploration Service (KES) API.
services: cognitive-services
author: bojunehsu
manager: cgronlun

ms.service: cognitive-services
ms.component: knowledge-exploration
ms.topic: conceptual
ms.date: 03/26/2016
ms.author: paulhsu
---

# interpret Method

The *interpret* method takes a natural language query string and returns formatted interpretations of user intent based on the grammar and index data.  To provide an interactive search experience, this method may be called as each character is entered by the user with the *complete* parameter set to 1 to enable auto-complete suggestions.

## Request

`http://<host>/interpret?query=<query>[&<options>]`

Name|Value| Description
----|----|----
query    | Text string | Query entered by user.  If complete is set to 1, query will be interpreted as a prefix for generating query auto-completion suggestions.        
complete | 0 (default) or 1 | 1 means that auto-completion suggestions are generated based on the grammar and index data.         
count    | Number (default=10) | Maximum number of interpretations to return.         
offset   | Number (default=0) | Index of the first interpretation to return.  For example, *count=2&offset=0* returns interpretations 0 and 1. *count=2&offset=2* returns interpretations 2 and 3.       
timeout  | Number (default=1000) | Timeout in milliseconds. Only interpretations found before the timeout has elapsed are returned.

Using the *count* and *offset* parameters, a large number of results may be obtained incrementally over multiple requests.

## Response (JSON)

JSONPath     | Description
---------|---------
$.query	|*query* parameter from the request.
$.interpretations	|Array of 0 or more ways to match the input query against the grammar.
$.interpretations[\*].logprob	|Relative log probability of the interpretation (<= 0).  Higher values are more likely.
$.interpretations[\*].parse	|XML string that shows how each part of the query was interpreted.
$.interpretations[\*].rules	|Array of 1 or more rules defined in the grammar invoked during interpretation.
$.interpretations[\*].rules[\*].name	|Name of the rule.
$.interpretations[\*].rules[\*].output	|Semantic output of the rule.
$.interpretations[\*].rules[\*].output.type	|Data type of the semantic output.
$.interpretations[\*].rules[\*].output.value|Value of the semantic output.  
$.aborted | True if the request timed out.

### Parse XML

The parse XML annotates the (completed) query with information about how it matches against the rules in the grammar and attributes in the index.  Below is an example from the academic publications domain:

```xml
<rule name="#GetPapers">
  papers by 
  <attr name="academic#Author.Name" canonical="heungyeung shum">harry shum</attr>
  <rule name="#GetPaperYear">
    written in
    <attr name="academic#Year">2000</attr>
  </rule>
</rule>
```

The `<rule>` element delimits the range in the query matching the rule specified by its `name` attribute.  It may be nested when the parse involves rule references in the grammar.

The `<attr>` element delimits the range in the query matching the index attribute specified by its `name` attribute.  When the match involves a synonym in the input query, the `canonical` attribute will contain the canonical value matching the synonym from the index.

## Example

In the academic publications example, the following request returns up to 2 auto-completion suggestions for the prefix query "papers by jaime":

`http://<host>/interpret?query=papers by jaime&complete=1&count=2`

The response contains the top two ("count=2") most likely interpretations that complete the partial query "papers by jaime": "papers by jaime teevan" and "papers by jaime green".  The service generated query completions instead of considering only exact matches for the author "jaime" because the request specified "complete=1". Note that the canonical value "j l green" matched via the synonym "jamie green", as indicated in the parse.


```json
{
  "query": "papers by jaime",
  "interpretations": [
    {
      "logprob": -5.615,
      "parse": "<rule name=\"#GetPapers\">papers by <attr name=\"academic#Author.Name\">jaime teevan</attr></rule>",
      "rules": [
        {
          "name": "#GetPapers",
          "output": {
            "type": "query",
            "value": "Composite(Author.Name=='jaime teevan')"
          }
        }
      ]
    },
    {
      "logprob": -5.849,
      "parse": "<rule name=\"#GetPapers\">papers by <attr name=\"academic#Author.Name\" canonical=\"j l green\">jaime green</attr></rule>",
      "rules": [
        {
          "name": "#GetPapers",
          "output": {
            "type": "query",
            "value": "Composite(Author.Name=='j l green')"
          }
        }
      ]
    }
  ]
}
```  

When the type of semantic output is "query", as in this example, the matching objects can be retrieved by passing *output.value* to the [*evaluate*](evaluateMethod.md) API via the *expr* parameter.

`http://<host>/evaluate?expr=Composite(AA.AuN=='jaime teevan')`
  
