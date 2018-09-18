---
title: Grammar format - Knowledge Exploration Service API
titlesuffix: Azure Cognitive Services
description: Learn about the grammar format in the Knowledge Exploration Service (KES) API.
services: cognitive-services
author: bojunehsu
manager: cgronlun

ms.service: cognitive-services
ms.component: knowledge-exploration
ms.topic: conceptual
ms.date: 03/26/2016
ms.author: paulhsu
---

# Grammar Format

The grammar is an XML file that specifies the weighted set of natural language queries that the service can interpret, as well as how these natural language queries are translated into semantic query expressions.  The grammar syntax is based on [SRGS](http://www.w3.org/TR/speech-grammar/), a W3C standard for speech recognition grammars, with extensions to support data index integration and semantic functions.

The following describes each of the syntactic elements that can be used in a grammar.  See [this example](#example) for a complete grammar that demonstrates the use of these elements in context.

### grammar Element

The `grammar` element is the top-level element in the grammar specification XML.  The required `root` attribute specifies the name of the root rule that defines the starting point of the grammar.

```xml
<grammar root="GetPapers">
```

### import Element

The `import` element imports a schema definition from an external file to enable attribute references. The element must be a child of the top-level `grammar` element and appear before any `attrref` elements. The required `schema` attribute specifies the name of a schema file located in the same directory as the grammar XML file. The required `name` element specifies the schema alias that subsequent `attrref` elements use when referencing attributes defined within this schema.

```xml
  <import schema="academic.schema" name="academic"/>
```

### rule Element

The `rule` element defines a grammar rule, a structural unit that specifies a set of query expressions that the system can interpret.  The element must be a child of the top-level `grammar` element.  The required `id` attribute specifies the name of the rule, which is referenced from `grammar` or `ruleref` elements.

A `rule` element defines a set of legal expansions.  Text tokens match against the input query directly.  `item` elements specify repeats and alter interpretation probabilities.  `one-of` elements indicate alternative choices.  `ruleref` elements enable construction of more complex expansions from simpler ones.  `attrref` elements allow matches against attribute values from the index.  `tag` elements specify the semantics of the interpretation and can alter the interpretation probability.

```xml
<rule id="GetPapers">...</rule>
```

### example Element

The optional `example` element specifies example phrases that may be accepted by the containing `rule` definition.  This may be used for documentation and/or automated testing.

```xml
<example>papers about machine learning by michael jordan</example>
```

### item Element

The `item` element groups a sequence of grammar constructs.  It can be used to indicate repetitions of the expansion sequence, or to specify alternatives in conjunction with the `one-of` element.

When an `item` element is not a child of a `one-of` element, it can specify repetition of the enclosed sequence by assigning the `repeat` attribute to a count value.  A count value of "*n*" (where *n* is an integer) indicates that the sequence must occur exactly *n* times.  A count value of "*m*-*n*" allows the sequence to appear between *m* and *n* times, inclusively.  A count value of "*m*-" specifies that the sequence must appear at least *m* times.  The optional `repeat-logprob` attribute can be used to alter the interpretation probability for each additional repetition beyond the minimum.

```xml
<item repeat="1-" repeat-logprob="-10">...</item>
```

When `item` elements appear as children of a `one-of` element, they define the set of expansion alternatives.  In this usage, the optional `logprob` attribute specifies the relative log probability among the different choices.  Given a probability *p* between 0 and 1, the corresponding log probability can be computed as log(*p*), where log() is the natural log function.  If not specified, `logprob` defaults to 0, which does not alter the interpretation probability.  Note that log probability is always a negative floating-point value or 0.

```xml
<one-of>
  <item>by</item>
  <item logprob="-0.5">written by</item>
  <item logprob="-1">authored by</item>
</one-of>
```

### one-of Element

The `one-of` element specifies alternative expansions among one of the child `item` elements.  Only `item` elements may appear inside a `one-of` element.  Relative probabilities among the different choices may be specified via the `logprob` attribute in each child `item`.

```xml
<one-of>
  <item>by</item>
  <item logprob="-0.5">written by</item>
  <item logprob="-1">authored by</item>
</one-of>
```

### ruleref Element

The `ruleref` element specifies valid expansions via references to another `rule` element.  Through the use of `ruleref` elements, more complex expressions can be built from simpler rules.  The required `uri` attribute indicates the name of the referenced `rule` using the syntax "#*rulename*".  To capture the semantic output of the referenced rule, use the optional `name` attribute to specify the name of a variable to which the semantic output is assigned.
 
```xml
<ruleref uri="#GetPaperYear" name="year"/>
```

### attrref Element

The `attrref` element references an index attribute, allowing matching against attribute values observed in the index.  The required `uri` attribute specifies the index schema name and attribute name using the syntax "*schemaName*#*attrName*".  There must be a preceding `import` element that imports the schema named *schemaName*.  The attribute name is the name of an attribute defined in the corresponding schema.

In addition to matching user input, the `attrref` element also returns a structured query object as output that selects the subset of objects in the index matching the input value.  Use the optional `name` attribute to specify the name of the variable where the query object output should be stored.  The query object can be composed with other query objects to form more complex expressions.  See [Semantic Interpretation](SemanticInterpretation.md) for details.  

```xml
<attrref uri="academic#Keyword" name="keyword"/>
```

#### Query Completion

To support query completions when interpreting partial user queries, each referenced attribute must include "starts_with" as an operation in the schema definition.  Given a user query prefix, `attrref` will match all values in the index that complete the prefix, and yield each complete value as a separate interpretation of the grammar.  

Examples:
* Matching `<attrref uri="academic#Keyword" name="keyword"/>` against the query prefix "dat" generates one interpretation for papers about "database", one interpretation for papers about "data mining", etc.
* Matching `<attrref uri="academic#Year" name="year"/>` against the query prefix "200" generates one interpretation for papers in "2000", one interpretation for papers in "2001", etc.

#### Matching Operations

In addition to exact match, select attribute types also support prefix and inequality matches via the optional `op` attribute.  If no object in the index has a value that matches, the grammar path is blocked and the service will not generate any interpretations traversing over this grammar path.   The `op` attribute defaults to "eq".

```xml
in <attrref uri="academic#Year" name="year"/>
before <attrref uri="academic#Year" op="lt" name="year"/
```

The following table lists the supported `op` values for each attribute type.  Their use requires the corresponding index operation to be included in the schema attribute definition.

| Attribute Type | Op Value | Description | Index Operation
|----|----|----|----|
| String | eq | String exact match | equals |
| String | starts_with | String prefix match | starts_with |
| Int32, Int64, Double | eq |  Numeric equality match | equals |
| Int32, Int64, Double | lt, le, gt, ge | Numeric inequality match (<, <=, >, >=) | is_between |
| Int32, Int64, Double | starts_with | Prefix match of value in decimal notation | starts_with |

Examples:
* `<attrref uri="academic#Year" op="lt" name="year"/>` matches the input string "2000" and returns all papers published before the year 2000, exclusively.
* `<attrref uri="academic#Year" op="lt" name="year"/>` does not match the input string "20" because there are no papers in the index published before the year 20.
* `<attrref uri="academic#Keyword" op="starts_with" name="keyword"/>` matches the input string "dat" and returns in a single interpretation papers about 
"database", "data mining", etc.  This is a rare use case.
* `<attrref uri="academic#Year" op="starts_with" name="year"/>` matches the input string "20" and returns in a single interpretation papers published in 200-299, 2000-2999, etc.  This is a rare use case.

### tag Element

The `tag` element specifies how a path through the grammar is to be interpreted.  It contains a sequence of semicolon-terminated statements.  A statement may be an assignment of a literal or a variable to another variable.  It may also assign the output of a function with 0 or more parameters to a variable.  Each function parameter may be specified using a literal or a variable.  If the function does not return any output, the assignment is omitted.  Variable scope is local to the containing rule.

```xml
<tag>x = 1; y = x;</tag>
<tag>q = All(); q = And(q, q2);</tag>
<tag>AssertEquals(x, 1);</tag>
```

Each `rule` in the grammar has a predefined variable named "out", representing the semantic output of the rule.  Its value is computed by evaluating each of the semantic statements traversed by the path through the `rule` matching the user query input.  The value assigned to the "out" variable at the end of the evaluation is the semantic output of the rule.  The semantic output of interpreting a user query against the grammar is the semantic output of the root rule.

Some statements may alter the probability of an interpretation path by introducing an additive log probability offset.  Some statements may reject the interpretation altogether if specified conditions are not satisfied.

For a list of supported semantic functions, see [Semantic Functions](SemanticInterpretation.md#semantic-functions).

## Interpretation Probability

The probability of an interpretation path through the grammar is the cumulative log probability of all the `<item>` elements and semantic functions encountered along the way.  It describes the relative likelihood of matching a particular input sequence.

Given a probability *p* between 0 and 1, the corresponding log probability can be computed as log(*p*), where log() is the natural log function.  Using log probabilities allows the system to accumulate the joint probability of an interpretation path through simple addition.  It also avoids floating-point underflow common to such joint probability calculations.  Note that by design, the log probability is always a negative floating-point value or 0, where larger values indicate higher likelihood.

## Example

The following is an example XML from the academic publications domain that demonstrates the various elements of a grammar:

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
          <item><attrref uri="academic#Year" op="lt" name="year"/></item>
        </one-of>
      </item>
      <item>
        after
        <one-of>
          <item>[year]</item>
          <item><attrref uri="academic#Year" op="gt" name="year"/></item>
        </one-of>
      </item>
    </one-of>
    <tag>out = year;</tag>
  </rule>
</grammar>
```
