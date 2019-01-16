---
title: Interpret method - Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Use the Interpret method to return formatted interpretations of user query strings based on Academic Graph data and the Academic Grammar in Microsoft Cognitive Services.
services: cognitive-services
author: alch-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: academic-knowledge
ms.topic: conceptual
ms.date: 03/27/2017
ms.author: alch
---

# Interpret Method

The **interpret** REST API takes an end user query string (i.e., a query entered by a user of your application) and returns formatted interpretations of user intent based on the Academic Graph data and the Academic Grammar.

To provide an interactive experience, you can call this method repeatedly after each character entered by the user. In that case, you should set the **complete** parameter to 1 to enable auto-complete suggestions. If your application does not need auto-completion, you should set the **complete** parameter to 0.

**REST endpoint:**

    https://westus.api.cognitive.microsoft.com/academic/v1.0/interpret?

## Request Parameters

Name     | Value | Required?  | Description
---------|---------|---------|---------
**query**    | Text string | Yes | Query entered by user.  If complete is set to 1, query will be interpreted as a prefix for generating query auto-completion suggestions.        
**model**    | Text string | No  | Name of the model that you wish to query.  Currently, the value defaults to *latest*.        
**complete** | 0 or 1 | No<br>default:0  | 1 means that auto-completion suggestions are generated based on the grammar and graph data.         
**count**    | Number | No<br>default:10 | Maximum number of interpretations to return.         
**offset**   | Number | No<br>default:0  | Index of the first interpretation to return. For example, *count=2&offset=0* returns interpretations 0 and 1. *count=2&offset=2* returns interpretations 2 and 3.       
**timeout**  | Number | No<br>default:1000 | Timeout in milliseconds. Only interpretations found before the timeout has elapsed are returned.
<br>
  
## Response (JSON)
Name     | Description
---------|---------
**query** |The *query* parameter from the request.
**interpretations** |An array of 0 or more different ways of matching user input against the grammar.
**interpretations[x].logprob**  |The relative natural log probability of the interpretation. Larger values are more likely.
**interpretations[x].parse**  |An XML string that shows how each part of the query was interpreted.
**interpretations[x].rules**  |An array of 1 or more rules defined in the grammar that were invoked during interpretation. For the Academic Knowledge API, there will always be 1 rule.
**interpretations[x].rules[y].name**  |Name of the rule.
**interpretations[x].rules[y].output**  |Output of the rule.
**interpretations[x].rules[y].output.type** |The data type of the output of the rule.  For the Academic Knowledge API, this will always be "query".
**interpretations[x].rules[y].output.value**  |The output of the rule. For the Academic Knowledge API, this is a query expression string that can be passed to the evaluate and calchistogram methods.
**aborted** | True if the request timed out.

<br>
#### Example:
```
https://westus.api.cognitive.microsoft.com/academic/v1.0/interpret?query=papers by jaime&complete=1&count=2
 ```
<br>The response below contains the top two (because of the parameter *count=2*) most likely interpretations that complete the partial user input *papers by jaime*: *papers by jaime teevan* and *papers by jaime green*.  The service generated query completions instead of considering only exact matches for the author *jaime* because the request specified *complete=1*. Note that the canonical value *j l green* matched via the synonym *jamie green*, as indicated in the parse.


```JSON
{
  "query": "papers by jaime",
  "interpretations": [
    {
      "logprob": -12.728,
      "parse": "<rule name=\"#GetPapers\">papers by <attr name=\"academic#AA.AuN\">jaime teevan</attr></rule>",
      "rules": [
        {
          "name": "#GetPapers",
          "output": {
            "type": "query",
            "value": "Composite(AA.AuN=='jaime teevan')"
          }
        }
      ]
    },
    {
      "logprob": -12.774,
      "parse": "<rule name=\"#GetPapers\">papers by <attr name=\"academic#AA.AuN\" canonical=\"j l green\">jaime green</attr></rule>",
      "rules": [
        {
          "name": "#GetPapers",
          "output": {
            "type": "query",
            "value": "Composite(AA.AuN=='j l green')"
          }
        }
      ]
    }
  ]
}
```  
<br>To retrieve entity results for an interpretation, use *output.value* from the **interpret** API, and pass that into the **evaluate** API via the *expr* parameter. In this example, the query for the first interpretation is: 
```
evaluate?expr=Composite(AA.AuN=='jaime teevan')
```
 