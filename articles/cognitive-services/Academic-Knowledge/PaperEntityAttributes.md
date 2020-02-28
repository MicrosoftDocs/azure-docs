---
title: Paper entity attributes - Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn the attributes you can use with the Paper entity in the Academic Knowledge API.
services: cognitive-services
author: DarrinEide
manager: nitinme

ms.service: cognitive-services
ms.subservice: academic-knowledge
ms.topic: conceptual
ms.date: 11/14/2019
ms.author: darrine
ROBOTS: NOINDEX
---

# Paper Entity

> [!NOTE]
> Below attributes are specific to paper entity. (Ty = '0')

Name | Description | Type | Operations
--- | --- | --- | ---
AA.AfId | Author affiliation ID | Int64 | Equals
AA.AfN | Author affiliation name | String | Equals, StartsWith
AA.AuId | Author ID | Int64 | Equals
AA.AuN | Normalized author name | String | Equals, StartsWith
AA.DAuN | Original author name | String | None
AA.DAfN | Original affiliation name | String | None
AA.S | Numeric position in author list | Int32 | Equals
BT | BibTex document type ('a':Journal article, 'b':Book, 'c':Book chapter, 'p':Conference paper) | String | None
BV | BibTex venue name | String | None
C.CId | Conference series ID | Int64 | Equals
C.CN | Conference series name | String | Equals, StartsWith
CC | Citation count | Int32 | None  
CitCon | Citation contexts</br></br>List of referenced paper ID’s and the corresponding context in the paper (e.g. [{123:["brown foxes are known for jumping as referenced in paper 123", "the lazy dogs are a historical misnomer as shown in paper 123"]}) | Custom | None
D | Date published in YYYY-MM-DD format | Date | Equals, IsBetween
DN | Original paper title | String | None
DOI | Digital Object Identifier | String | Equals, StartsWith
E | Extended metadata</br></br>**IMPORTANT**: This attribute has been deprecated and is only supported for legacy applications. Requesting this attribute individually (i.e. attributes=Id,Ti,E) will result in all extended metadata attributes being returned in a *serialized JSON string*</br></br>All attributes contained in the extended metadata are now available as a top-level attribute and can be requested as such (i.e. attributes=Id,Ti,DOI,IA) | [Extended](#extended) | None
ECC | Estimated citation count | Int32 | None
F.DFN | Original field of study name | String | None
F.FId | Field of study ID | Int64 | Equals
F.FN | Normalized field of study name | String | Equals, StartsWith
FP | First page of paper in publication | String | Equals
I | Publication issue | String | Equals
IA | Inverted abstract | [InvertedAbstract](#invertedabstract) | None
Id | Paper ID | Int64 | Equals
J.JId | Journal ID | Int64 | Equals
J.JN | Journal name | String | Equals, StartsWith
LP | Last page of paper in publication | String | Equals
PB | Publisher | String | None
Pt | Publication type (0:Unknown, 1:Journal article, 2:Patent, 3:Conference paper, 4:Book chapter, 5:Book, 6:Book reference entry, 7:Dataset, 8:Repository | String | Equals
RId | List of referenced paper IDs | Int64[] | Equals
S | List of source URLs of the paper, sorted by relevance | [Source](#source)[] | None
Ti | Normalized title | String | Equals, StartsWith
V | Publication volume | String | Equals
VFN | Full name of the Journal or Conference venue | String | None
VSN | Short name of the Journal or Conference venue | String | None
W | Unique words in title | String[] | Equals
Y | Year published | Int32 | Equals, IsBetween

## Extended
> [!IMPORTANT]
> This attribute has been deprecated and is only supported for legacy applications. Requesting this attribute individually (i.e. attributes=Id,Ti,E) will result in all extended metadata attributes being returned in a *serialized JSON string*</br></br>All attributes contained in the extended metadata are now available as a top-level attribute and can be requested as such (i.e. attributes=Id,Ti,DOI,IA)

> [!IMPORTANT]
> Support for requesting individual extended attributes by using the "E." scope, i.e. "E.DN" is being deprecated. While this is still technically supported, requesting individual extended attributes using the "E." scope will result in the attribute value being returned in two places in the JSON response, as part of the "E" object and as a top level attribute.

Name | Description | Type | Operations
--- | --- | --- | ---
BT | BibTex document type ('a':Journal article, 'b':Book, 'c':Book chapter, 'p':Conference paper) | String | None
BV | BibTex venue name | String | None
CC | Citation contexts</br></br>List of referenced paper ID’s and the corresponding context in the paper (e.g. [{123:["brown foxes are known for jumping as referenced in paper 123", "the lazy dogs are a historical misnomer as shown in paper 123"]}) | Custom | None
DN | Original paper title | String | None
DOI | Digital Object Identifier | String | None
FP | First page of paper in publication | String | None
I | Publication issue | String | None
IA | Inverted Abstract | [InvertedAbstract](#invertedabstract) | None
LP | Last page of paper in publication | String | None
PB | Publisher | String | None
S | List of source URLs of the paper, sorted by relevance | [Source](#source)[] | None
V | Publication volume | String | None
VFN | Full name of the Journal or Conference venue | String | None
VSN | Short name of the Journal or Conference venue | String | None

## InvertedAbstract

> [!IMPORTANT]
> InvertedAbstract attributes cannot be directly requested as a return attribute. If you need an individual attribute you must request the top level "IA" attribute, i.e. to get IA.IndexLength request attributes=IA

Name | Description | Type | Operations
--- | --- | --- | ---
IndexLength | Number of items in the index (abstract's word count) | Int32 | None
InvertedIndex | List of abstract words and their corresponding position in the original abstract (e.g. [{"the":[0, 15, 30]}, {"brown":[1]}, {"fox":[2]}]) | Custom | None

## Source

> [!IMPORTANT]
> Source attributes cannot be directly requested as a return attribute. If you need an individual attribute you must request the top level "S" attribute, i.e. to get S.U request attributes=S

Name | Description | Type | Operations
--- | --- | --- | ---
Ty | Source URL type (1:HTML, 2:Text, 3:PDF, 4:DOC, 5:PPT, 6:XLS, 7:PS) | String | None
U | Source URL | String | None
