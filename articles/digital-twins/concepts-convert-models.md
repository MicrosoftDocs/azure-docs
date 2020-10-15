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

Models in Azure Digital Twins are represented in the JSON-LD-based [**Digital Twins Definition Language (DTDL)**](concepts-models.md). If you have existing models outside of Azure Digital Twins that are based on an industry standard, such as RDF or OWL, you'll need to **convert them to DTDL** to use them with Azure Digital Twins. The DTDL version will then become the source of truth for the model within Azure Digital Twins.

This article describes a pattern for converting RDF-based industry or custom models to DTDL. It includes:
* **Strategy-level guidance** that can be applied to a variety of standards and model types
* [**Sample code** for an RDF-specific converter](#sample-converter-application)

## Industry models  

Using industry models provides a rich starting point when designing your Azure Digital Twins model. Using industry models also helps with standardization and information sharing. 

Some common industry models include:  

| Industry vertical | Model |
| --- | --- | 
| Building / facility management | [RealEstateCore](https://www.realestatecore.io/)<br>[BRICK Schema](https://brickschema.org/ontology/1.1/)<br>[Building Topology Ontology (BOT)](https://w3c-lbd-cg.github.io/bot/)<br>[Semantic Sensor Network](https://www.w3.org/TR/vocab-ssn/)<br>[buildingSmart Industry Foundation Classes (IFC)](https://technical.buildingsmart.org/standards/ifc/ifc-schema-specifications/) |
| Smart Cities | [ETSI NGSI-LD](https://www.etsi.org/deliver/etsi_gr/CIM/001_099/008/01.01.01_60/gr_CIM008v010101p.pdf)<br>[Smart Applications REFerence (SAREF)](https://saref.etsi.org/)<br>[Fiware](https://www.fiware.org/)<br>[Open & Agile Smart Cities (OASC)](https://oascities.org/) |
| Energy Grid | [CIM](https://cimug.ucaiug.org/)/[IEC 61968](https://en.wikipedia.org/wiki/IEC_61968)<br>[ADRM models](http://www.adrm.com/) for energy and commodity trading | 

Depending on your needs, you can also use DTDL to customize or extend industry models, or develop your own custom model from scratch. 

## Create and edit models

The first step in modeling is creating your models. You can create and complete editing of your industry-standard models before converting them to DTDL, or you can convert them to DTDL early and continue editing them as DTDL documents.

### With industry standards

Most industry models (also referred to as **ontologies**) are based on semantic web standards such as [OWL](https://www.w3.org/OWL/[), [RDF](https://www.w3.org/2001/sw/wiki/RDF), and [RDFS](https://www.w3.org/2001/sw/wiki/RDFS). 

In some cases, you may want to create or edit a model using OWL-based model tools. You can use any number of model authoring tools to design an OWL-based model, including the following.
* [WebProtégé](https://protege.stanford.edu/products.php#web-protege) and [Protégé Desktop](https://protege.stanford.edu/products.php#desktop-protege) are popular examples. You can import industry models in multiple formats, edit or extend a model, and export the model. 
* [WebVOWL](http://www.visualdataweb.de/webvowl/) is another popular tool for visualizing models. 

If you create a model using some industry standard that is not DTDL, you will then need to convert it to DTDL and upload it to Azure Digital Twins. 

#### Common model file formats 

RDF, OWL, and RDFS are the basic building blocks of the semantic web. 

**RDF** provides a conceptual structure for describing things, in the form of **triples**. Triples consist of three parts: **subject**, **predicate**, and **object**. Objects can be made of URIs. 

Here are some examples of RDF triples:

```
<LogicalDevice> <hasCapabiity> <Temperature>
<Chiller> <locatedIn> <Level1>
<Asset> <isPartOf> <Asset>  
```

These examples are all valid RDF, but the last statement is semantically invalid. This situation is where the OWL specification enters the picture. **OWL** defines what you can write with RDF in order to have valid ontology.

Here is an example making use of OWL: 

```
<Asset> <isPartOf> <Building>
<TemperatureSensor> <isType> <Sensor>
```

**RDFS** provides additional vocabulary semantics that help you define and describe classes. For example, one such class is `rdfs:subClassOf`:

```
<Equipment> <subClassOf> <Asset>
```

Models can be saved, imported, and exported in many file formats, including:  
* RDF/XML 
* Turtle (TTL) 
* OWL/XML 

### With DTDL

Azure Digital Twins uses the JSON-LD-based **Digital Twin Definition Language (DTDL)** for modeling. Any model that will be used with Azure Digital Twins will need to be either originally written in or converted into DTDL.

When working with models in DTDL, you can use the [**DTDL extension**](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-dtdl) available for [Visual Studio Code](https://code.visualstudio.com/), which provides syntax validation and other features to facilitate writing DTDL models.

You can read more about Azure Digital Twins models and their components in [*Concepts: Custom models*](concepts-models.md) and [*How-to: Manage custom models*](how-to-manage-model.md).

## Convert models to DTDL

To use a model with Azure Digital Twins, it must be in DTDL format. This section covers how to convert RDF-based models to DTDL so that they can be used with Azure Digital Twins.

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

## Validate and upload DTDL models

[!INCLUDE [Azure Digital Twins: validate models info](../../includes/digital-twins-validate.md)]

Once a model is converted and validated, you can **upload it to your Azure Digital Twins instance**. For more information on this process, see the [*Upload models*](how-to-manage-model.md#upload-models) section of *How-to: Manage custom models*.

## Sample converter application 

There is a sample application available that converts an RDF-based model file to [DTDL (version 2)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md) for use by the Azure Digital Twins service. The sample is a .NET Core command-line application called **RdfToDtdlConverter**.

You can get the sample here: [**RdfToDtdlConverter**](https://docs.microsoft.com/samples/azure-samples/rdftodtdlconverter/digital-twins-model-conversion-samples/). 

To download the code to your machine, hit the *Download ZIP* button underneath the title on the sample landing page. This will download a *ZIP* file under the name *RdfToDtdlConverter_sample_application_to_convert_RDF_to_DTDL.zip*, which you can then unzip and explore.

You can use this sample to see the conversion patterns in context, and to have as a building block for your own applications performing model conversions according to your own specific needs.

## Next steps 

Read more about designing and managing digital twin models:
 
* [*Concepts: Custom models*](concepts-models.md)
* [*How-to: Manage custom models*](how-to-manage-model.md)
* [*How-to: Parse and validate models*](how-to-parse-models.md)