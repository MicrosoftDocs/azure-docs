---
# Mandatory fields.
title: Converting industry-standard models
titleSuffix: Azure Digital Twins
description: Understand the pattern for converting industry-standard (RDF/OWL) models to DTDL
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 9/28/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Convert industry-standard models to DTDL for Azure Digital Twins

This article describes a pattern for converting RDF-based industry or custom models to Digital Twins Definition Language for use by Azure Digital Twins.   

Using industry models provides a rich starting point when designing your Azure Digital Twins model. Using industry models also helps with standardization and information sharing. Some common industry models include:  

| Industry Vertical | Model |
| --- | --- | 
| Building / facility management | [RealEstateCore](https://www.realestatecore.io/)<br>[BRICK Schema](https://brickschema.org/ontology/1.1/)<br>[Building Topology Ontology (BOT)](https://w3c-lbd-cg.github.io/bot/)<br>[Semantic Sensor Network](https://www.w3.org/TR/vocab-ssn/)<br>[buildingSmart Industry Foundation Classes (IFC)](https://technical.buildingsmart.org/standards/ifc/ifc-schema-specifications/) |
| Smart Cities | [ETSI NGSI-LD](https://www.etsi.org/deliver/etsi_gr/CIM/001_099/008/01.01.01_60/gr_CIM008v010101p.pdf)<br>[Smart Applications REFerence (SAREF)](https://saref.etsi.org/) |
| Energy Grid | [CIM](https://cimug.ucaiug.org/)/[IEC 61968](https://en.wikipedia.org/wiki/IEC_61968) | 

Depending on your needs, you can also customize or extend industry models, or develop your own custom model from scratch. 

## Modeling process 

Most models (also referred to as **Ontologies**) are based on semantic web standards such as [OWL](https://www.w3.org/OWL/[), [RDF](https://www.w3.org/2001/sw/wiki/RDF), and [RDFS](https://www.w3.org/2001/sw/wiki/RDFS). Azure Digital Twins models are written using the JSON-LD-based [Digital Twin Definition Language (DTDL)](concepts-models.md), which is based on RDF and JSON. There is a [DTDL extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-dtdl) available for [Visual Studio Code](https://code.visualstudio.com/), which provides syntax validation and other features to facilitate writing DTDL models. 

In some cases, you many want to create or edit a model using OWL-based model tools. You can use any number of model authoring tools to design an OWL-based model. [WebProtégé](https://protege.stanford.edu/products.php#web-protege) and [Protégé Desktop](https://protege.stanford.edu/products.php#desktop-protege) are popular examples. You can import industry models in multiple formats, edit/extend the model and export the model. [WebVOWL](http://www.visualdataweb.de/webvowl/) is another popular tool for visualizing a model. 

Once your model is complete, it will need to be converted to DTDL and uploaded to Azure Digital Twins. 

## Model file formats 

RDF, OWL and RDFS are the basic building blocks of the Semantic Web. RDF provides a conceptual structure for describing things, in the form of **Triples**. Triples consist of: **Subject**, **Predicate**, **Object**, which can be made of up URIs. 

```xml
<Microsoft> <hasCEO> <SatyaNadella> 
<http://example.com/person/tom> <hasFather> <http://example.com/person/david> 
<Oranges> <eats> <Oranges> 
```

These examples are all valid RDF but the last statement is semantically invalid. This is where the OWL specification comes in. OWL defines what you can write with RDF in order to have valid ontology. 

```xml
<Joe> <eats> <Oranges> 
<Joe> <isType> <Human> 
```

RDFS provides additional vocabulary semantics that help you define and describe classes such as `rdfs:subClassOf`. 

```xml
<Human> <subClassOf> <Mammal> 
```

Models can be saved, imported, and exported in many file formats including:  
* RDF/XML 
* Turtle (TTL) 
* OWL/XML 

## Model conversion 

There are several 3rd party libraries that can be used when converting RDF-based models. Some of these libraries allow you to load your model file into a graph. You can loop through the graph looking for specific RDFS and OWL constructs and converts these to DTDL.   

The following table is an example of how RDFS and OWL constructs can be mapped to DTDL. 

| RDFS/OWL Construct | | DTDL Construct | |
| --- | --- | --- | --- |
| Classes | owl:Class<br>IRI suffix<br>rdfs:label<br>rdfs:comment | Interface | @type:Interface<br>@id<br>displayName<br>comment 
| Subclasses | owl:Class<br>IRI suffix<br>rdfs:label<br>rdfs:comment<br>rdfs:subClassOf | Interface | @type:Interface<br>@id<br>displayName<br>comment<br>extends 
| Datatype Properties | owl:DatatypeProperty<br>rdfs:label or INode<br>rdfs:label<br>rdfs:range | Interface Properties | @type:Property<br>name<br>displayName<br>schema 
| Object Properties | owl:ObjectProperty<br>rdfs:label or INode<br>rdfs:range<br>rdfs:comment<br>rdfs:label | Relationship | type:Relationship<br>name<br>target or omitted if no rdfs:range<br>comment<br>displayName<br>

The following C# code snippet shows how a RDF model file is loaded into a graph and converted to DTDL using the [dotNetRDF](https://www.dotnetrdf.org/) library. 

```csharp
using VDS.RDF.Ontology; 
using VDS.RDF.Parsing; 
using Microsoft.Azure.DigitalTwins.Parser; 

//...

Console.WriteLine("Reading file..."); 

FileLoader.Load(_ontologyGraph, rdfFile.FullName); 

// Start looping through for each owl:Class 
foreach (OntologyClass owlClass in _ontologyGraph.OwlClasses) 
{ 

    // Generate a DTMI for the owl:Class 
    string Id = GenerateDTMI(owlClass); 

    if (!String.IsNullOrEmpty(Id)) 
    { 

        Console.WriteLine($"{owlClass.ToString()} -> {Id}"); 

        // Create Interface
        DtdlInterface dtdlInterface = new DtdlInterface 
        { 
            Id = Id, 
            Type = "Interface", 
            DisplayName = GetInterfaceDisplayName(owlClass), 
            Comment = GetInterfaceComment(owlClass), 
            Contents = new List<DtdlContents>() 
        }; 

        // Use DTDL 'extends' for super classes 
        IEnumerable<OntologyClass> foundSuperClasses = owlClass.DirectSuperClasses; 

        //... 
     }

     // Add interface to the list of interfaces 
     _interfaceList.Add(dtdlInterface); 
} 

// Serialize to JSON 
var json = JsonConvert.SerializeObject(_interfaceList); 

//...
``` 

## Validate the model 

Once a model is converted to DTDL, it is recommended you validate it to ensure your model has no syntax errors. The `Microsoft.Azure.DigitalTwins.Parser` is a client-side library available for parsing and validating DTDL.  
 
```csharp
// Save to file 
System.IO.File.WriteAllText(dtdlFile.ToString(), json); 
Console.WriteLine($"DTDL written to: {dtdlFile}"); 

// Run DTDL validation 
Console.WriteLine("Validating DTDL..."); 
ModelParser modelParser = new ModelParser(); 
List<string> modelJson = new List<string>(); 
modelJson.Add(json); 
IReadOnlyDictionary<Dtmi, DTEntityInfo> parseTask = modelParser.ParseAsync(modelJson).GetAwaiter().GetResult(); 
```
 

For more information about this library, see [*How-to: Parse and validate models*](how-to-parse-models.md). 

## Sample Application 

[RdfToDtdlConverter](https://github.com/Azure-Samples/RdfToDtdlConverter) is a .NET Core command-line sample application that converts an RDF-based model file to JSON-LD-based [Digital Twins Definition Language (DTDL) version 2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md) for use by the [Azure Digital Twins](overview.md) service. 

## Upload the model 

Once the model is converted and validated, you can upload it to your Azure Digital Twins instance. For more information, see [*How-to: Parse and validate models*](how-to-parse-models.md).

## Next Steps 

Read more about designing and managing digital twin models: 
* [*Concepts: Custom models*]concepts-models.md)
* [*How-to: Manage custom models*](how-to-manage-models.md)
* [*How-to: Parse and validate models*](how-to-parse-models.md)