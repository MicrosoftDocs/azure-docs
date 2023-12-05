---
# Mandatory fields.
title: Converting ontologies
titleSuffix: Azure Digital Twins
description: Understand the process of converting industry-standard models into DTDL for Azure Digital Twins
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 06/29/2023
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Convert industry-standard ontologies to DTDL for Azure Digital Twins

Most [ontologies](concepts-ontologies.md) are based on semantic web standards such as [OWL](https://www.w3.org/OWL/), [RDF](https://www.w3.org/2001/sw/wiki/RDF), and [RDFS](https://www.w3.org/2001/sw/wiki/RDFS). 

To use a model with Azure Digital Twins, it must be in DTDL format. This article describes general design guidance in the form of a conversion pattern for converting RDF-based models to DTDL so that they can be used with Azure Digital Twins. 

The article also contains [sample converter code](#converter-samples) for RDF and OWL converters, which can be extended for other schemas in the building industry. 

Although the examples in this article are building-focused, you can apply similar processes to standard ontologies across different industries to convert them to DTDL as well.

## Conversion pattern

There are several third-party libraries that can be used when converting RDF-based models to DTDL. Some of these libraries allow you to load your model file into a graph. You can loop through the graph looking for specific RDFS and OWL constructs, and convert them to DTDL.   

The following table is an example of how RDFS and OWL constructs can be mapped to DTDL. 

| RDFS/OWL concept | RDFS/OWL construct | DTDL concept | DTDL construct |
| --- | --- | --- | --- |
| Classes | `owl:Class`<br>IRI suffix<br>``rdfs:label``<br>``rdfs:comment`` | Interface | `@type:Interface`<br>`@id`<br>`displayName`<br>`comment` 
| Subclasses | `owl:Class`<br>IRI suffix<br>`rdfs:label`<br>`rdfs:comment`<br>`rdfs:subClassOf` | Interface | `@type:Interface`<br>`@id`<br>`displayName`<br>`comment`<br>`extends` 
| Datatype Properties | `owl:DatatypeProperty`<br>`rdfs:label` or `INode`<br>`rdfs:label`<br>`rdfs:range` | Interface Properties | `@type:Property`<br>`name`<br>`displayName`<br>`schema` 
| Object Properties | `owl:ObjectProperty`<br>`rdfs:label` or `INode`<br>`rdfs:range`<br>`rdfs:comment`<br>`rdfs:label` | Relationship | `type:Relationship`<br>`name`<br>`target` (or omitted if no `rdfs:range`)<br>`comment`<br>`displayName`<br>

The following C# code snippet shows how an RDF model file is loaded into a graph and converted to DTDL, using the [dotNetRDF](https://www.dotnetrdf.org/) library. 

:::code language="csharp" source="~/digital-twins-docs-samples/other/csharp/convertRDF.cs":::

## Converter samples

This section contains sample converter code for RDF and OWL converters, which can be extended for other schemas in the building industry. 

### RDF converter application 

There's a sample application available that converts an RDF-based model file to [DTDL Version 2 (v2)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md). DTDL v2 is supported by Azure Digital Twins, but you can also follow [these instructions](how-to-manage-model.md#convert-v2-models-to-v3) to convert DTDL v2 models to the newer DTDL v3.

The sample application has been validated for the [Brick](https://brickschema.org/ontology/) schema, and can be extended for other schemas in the building industry (such as [Building Topology Ontology (BOT)](https://w3c-lbd-cg.github.io/bot/), [Semantic Sensor Network](https://www.w3.org/TR/vocab-ssn/), or [buildingSmart Industry Foundation Classes (IFC)](https://technical.buildingsmart.org/standards/ifc/ifc-schema-specifications/)).

The sample is a [.NET Core command-line application called RdfToDtdlConverter](/samples/azure-samples/rdftodtdlconverter/digital-twins-model-conversion-samples/).

To download the code to your machine, select the **Browse code** button underneath the title on the sample page, which will take you to the GitHub repo for the sample. Select the **Code** button and **Download ZIP** to download the sample as a .zip file called *RdfToDtdlConverter-main.zip*. You can then unzip the file and explore the code.

:::image type="content" source="media/concepts-ontologies-convert/download-repo-zip.png" alt-text="Screenshot of the RdfToDtdlConverter repo on GitHub. The Code button is selected, producing a dialog box where the Download ZIP button is highlighted." lightbox="media/concepts-ontologies-convert/download-repo-zip.png":::

You can use this sample to see the conversion patterns in context, and to have as a building block for your own applications doing model conversions according to your own specific needs.

### OWL2DTDL converter 

The [OWL2DTDL Converter](https://github.com/Azure/opendigitaltwins-tools/tree/master/OWL2DTDL) is a sample code base that translates an OWL ontology into a set of DTDL interface declarations, which can be used with the Azure Digital Twins service. It also works for ontology networks, made of one root ontology reusing other ontologies through `owl:imports` declarations. This converter was used to translate the [Real Estate Core Ontology](https://doc.realestatecore.io/3.1/full.html) to DTDL and can be used for any OWL-based ontology.

This sample code isn't a comprehensive solution that supports the entirety of the OWL spec, but it can give you ideas and starting code that you can use in developing your own ontology ingestion pipelines.

## Next steps 

Continue on the path for developing models based on ontologies: [Full model development path](concepts-ontologies.md#full-model-development-path).