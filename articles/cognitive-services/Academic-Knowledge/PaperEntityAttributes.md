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
ms.date: 10/22/2019
ms.author: darrine
ROBOTS: NOINDEX
---

# Paper Entity

<sub>
*Below attributes are specific to paper entity. (Ty = '0')
</sub>

Name | Description | Type | Operations
--- | --- | --- | ---
AA.AfId | Author affiliation ID | Int64 | Equals
AA.AfN | Author affiliation name | String | Equals, StartsWith
AA.AuId | Author ID | Int64 | Equals
AA.AuN | Normalized author name | String | Equals, StartsWith
AA.DAuN | Original author name | String | None
AA.DAfN | Original affiliation name | String | None
AA.S | Numeric position in author list | Int32 | Equals
CC | Citation count | Int32 | None  
C.CId | Conference series ID | Int64 | Equals
C.CN | Conference series name | String | Equals, StartsWith
D | Date published in YYYY-MM-DD format | Date | Equals, IsBetween
E | Extended metadata (see table below) | String | N/A  
ECC | Estimated citation count | Int32 | None
F.DFN | Original field of study name | String | None
F.FId | Field of study ID | Int64 | Equals
F.FN | Normalized field of study name | String | Equals, StartsWith
Id | Paper ID | Int64 | Equals
J.JId | Journal ID | Int64 | Equals
J.JN | Journal name | String | Equals, StartsWith
Pt | Publication type (0:Unknown, 1:Journal article, 2:Patent, 3:Conference paper, 4:Book chapter, 5:Book, 6:Book reference entry, 7:Dataset, 8:Repository | String | Equals
RId | List of referenced paper IDs | Int64[] | Equals
Ti | Normalized title | String | Equals, StartsWith
W | Unique words in title | String[] | Equals
Y | Year published | Int32 | Equals, IsBetween

## Extended Metadata Attributes ##

Name | Description               
--- | ---
BT | BibTex document type ('a':Journal article, 'b':Book, 'c':Book chapter, 'p':Conference paper)
BV | BibTex venue name
CC | Citation Contexts – List of referenced paper ID’s and the corresponding context in the paper (e.g. [{123:["brown foxes are known for jumping as referenced in paper 123", "the lazy dogs are a historical misnomer as shown in paper 123"]})
DN | Original paper title
DOI | Digital Object Identifier
FP | First page of paper in publication
I | Publication issue
IA | Inverted Abstract
IA.IndexLength | Number of items in the index (abstract's word count)
IA.InvertedIndex | List of abstract words and their corresponding position in the original abstract (e.g. [{"the":[0, 15, 30]}, {"brown":[1]}, {"fox":[2]}])
LP | Last page of paper in publication
PB | Publisher
S | Sources - list of web sources of the paper, sorted by static rank
S.Ty | Source Type (1:HTML, 2:Text, 3:PDF, 4:DOC, 5:PPT, 6:XLS, 7:PS)
S.U | Source URL
V | Publication volume
VFN | Full name of the Journal or Conference venue
VSN | Short name of the Journal or Conference venue
