---
# Mandatory fields.
title: Integrate industry-standard models
titleSuffix: Azure Digital Twins
description: Understand how to integrate industry-standard models into DTDL for Azure Digital Twins, either by using special DTDL ontologies or converting existing ontologies
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 10/28/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Integrate industry-standard models with DTDL for Azure Digital Twins

Using models that are based on industry standards or use standard ontology representation, such as RDF or OWL, provides a rich starting point when designing your Azure Digital Twins models. Using industry models also helps with standardization and information sharing.

To be used with Azure Digital Twins, a model must be represented in the JSON-LD-based [**Digital Twins Definition Language (DTDL)**](concepts-models.md). Therefore, this article describes how to represent your industry-standard models in DTDL, integrating the existing industry concepts with DTDL semantics so that Azure Digital Twins can use them. The DTDL model then serves as the source of truth for the model within Azure Digital Twins.

There are two main paths to integrating industry-standard models with DTDL, depending on your situation:
* If you have yet to create your models, you can design them around **existing starter DTDL ontologies** that contain language specific to your industry. Currently, this option is available for the real estate industry.
* If you already have existing models that are based on an industry standard, or you work in an industry where there are no starter DTDL ontologies, you'll need to **convert your models to DTDL** in order to bring them into Azure Digital Twins.

You can also always use the ideas from your industry models to develop your own custom DTDL models from scratch, as described in [*How-to: Manage custom models*](how-to-manage-model.md).

## Use a starter DTDL ontology for your industry 

One way to integrate industry-standard models with DTDL is to use a starter DTDL ontology (set of models), which is designed around the vocabulary of a particular business and thus helps provide common ground for industry standards and DTDL requirements. You can also extend or contribute to a starter ontology to customize it to your business. 

There is currently one starter DTDL ontology available: the [**Smart Building DTDL-based ontology**](https://github.com/Azure/opendigitaltwins-building) for the real estate industry (created in partnership with the RealEstateCore Consortium). Here you can find models for smart buildings, as well as best practices for how to consume and extend the ontology.

For other domains that do not currently offer starter DTDL ontologies, you can follow the best practices in the next section for converting industry models to create your own solutions.

## Convert industry-standard models to DTDL

Most industry models (also referred to as **ontologies**) are based on semantic web standards such as [OWL](https://www.w3.org/OWL/[), [RDF](https://www.w3.org/2001/sw/wiki/RDF), and [RDFS](https://www.w3.org/2001/sw/wiki/RDFS). 

To use a model with Azure Digital Twins, it must be in DTDL format. This section describes general design guidance in the form of a **conversion pattern** for converting RDF-based models to DTDL so that they can be used with Azure Digital Twins. It also contains [**sample code** for an RDF-specific converter](#sample-converter-application), which has been validated for the [Brick](https://brickschema.org/ontology/) schema and can be extended for other schemas in the building industry.

### Conversion pattern

There are several third-party libraries that can be used when converting RDF-based models to DTDL. Some of these libraries allow you to load your model file into a graph. You can loop through the graph looking for specific RDFS and OWL constructs, and convert these to DTDL.   

The following table is an example of how RDFS and OWL constructs can be mapped to DTDL. 

| RDFS/OWL concept | RDFS/OWL construct | DTDL concept | DTDL construct |
| --- | --- | --- | --- |
| Classes | `owl:Class`<br>IRI suffix<br>``rdfs:label``<br>``rdfs:comment`` | Interface | `@type:Interface`<br>`@id`<br>`displayName`<br>`comment` 
| Subclasses | `owl:Class`<br>IRI suffix<br>`rdfs:label`<br>`rdfs:comment`<br>`rdfs:subClassOf` | Interface | `@type:Interface`<br>`@id`<br>`displayName`<br>`comment`<br>`extends` 
| Datatype Properties | `owl:DatatypeProperty`<br>`rdfs:label` or `INode`<br>`rdfs:label`<br>`rdfs:range` | Interface Properties | `@type:Property`<br>`name`<br>`displayName`<br>`schema` 
| Object Properties | `owl:ObjectProperty`<br>`rdfs:label` or `INode`<br>`rdfs:range`<br>`rdfs:comment`<br>`rdfs:label` | Relationship | `type:Relationship`<br>`name`<br>`target` (or omitted if no `rdfs:range`)<br>`comment`<br>`displayName`<br>

The following C# code snippet shows how an RDF model file is loaded into a graph and converted to DTDL, using the [**dotNetRDF**](https://www.dotnetrdf.org/) library. 

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

### Sample converter application 

There is a sample application available that converts an RDF-based model file to [DTDL (version 2)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md) for use by the Azure Digital Twins service. It has been validated for the [Brick](https://brickschema.org/ontology/) schema, and can be extended for other schemas in the building industry (such as [Building Topology Ontology (BOT)](https://w3c-lbd-cg.github.io/bot/), [Semantic Sensor Network](https://www.w3.org/TR/vocab-ssn/), or [buildingSmart Industry Foundation Classes (IFC)](https://technical.buildingsmart.org/standards/ifc/ifc-schema-specifications/)).

The sample is a .NET Core command-line application called **RdfToDtdlConverter**.

You can get the sample here: [**RdfToDtdlConverter**](https://docs.microsoft.com/samples/azure-samples/rdftodtdlconverter/digital-twins-model-conversion-samples/). 

To download the code to your machine, hit the *Download ZIP* button underneath the title on the sample landing page. This will download a *ZIP* file under the name *RdfToDtdlConverter_sample_application_to_convert_RDF_to_DTDL.zip*, which you can then unzip and explore.

You can use this sample to see the conversion patterns in context, and to have as a building block for your own applications performing model conversions according to your own specific needs.

## Validate and upload DTDL models

[!INCLUDE [Azure Digital Twins: validate models info](../../includes/digital-twins-validate.md)]

Once a model is converted and validated, you can **upload it to your Azure Digital Twins instance**. For more information on this process, see the [*Upload models*](how-to-manage-model.md#upload-models) section of *How-to: Manage custom models*.

## Next steps 

Read more about designing and managing digital twin models:
 
* [*Concepts: Custom models*](concepts-models.md)
* [*How-to: Manage custom models*](how-to-manage-model.md)
* [*How-to: Parse and validate models*](how-to-parse-models.md)