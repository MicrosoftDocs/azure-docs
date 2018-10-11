---
title: Paper entity attributes - Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn the attributes you can use with the Paper entity in the Academic Knowledge API.
services: cognitive-services
author: alch-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: academic-knowledge
ms.topic: conceptual
ms.date: 03/31/2017
ms.author: alch
---

# Paper Entity

<sub>
*Below attributes are specific to paper entity. (Ty = '0')
</sub>


Name	|Description	            						|Type       | Operations
------- | ------------------------------------------------- | --------- | ----------------------------
Id		|Entity ID											|Int64		|Equals
Ti		|Paper title										|String		|Equals,<br/>StartsWith
L 		|Paper language code seperated by "\@@@"			|String		|Equals
Y		|Paper year											|Int32		|Equals,<br/>IsBetween
D		|Paper date											|Date		|Equals,<br/>IsBetween
CC		|Citation count										|Int32		|none  
ECC		|Estimated citation Count							|Int32		|none
AA.AuN	|Author name 										|String		|Equals,<br/>StartsWith
AA.AuId	|Author ID											|Int64		|Equals
AA.AfN	|Author affiliation name							|String		|Equals,<br/>StartsWith
AA.AfId	|Author affiliation ID								|Int64		|Equals
AA.S	|Author order for the paper							|Int32		|Equals
F.FN	|Field of study name 								|String		|Equals,<br/>StartsWith
F.FId	|Field of study ID									|Int64		|Equals
J.JN	|Journal name										|String		|Equals,<br/>StartsWith
J.JId	|Journal ID											|Int64		|Equals
C.CN	|Conference series name								|String		|Equals,<br/>StartsWith
C.CId	|Conference series ID								|Int64		|Equals
RId	    |Referenced papers' ID								|Int64[]	|Equals
W       |Words from paper title and Abstract 				|String[] 	|Equals
E		|Extended metadata (see table below) 				|String 	|none  
		


## Extended Metadata Attributes ##

Name    | Description               
--------|---------------------------	
DN		| Display Name of the paper 
S		| Sources - list of web sources of the paper, sorted by static rank
S.Ty	| Source Type (1:HTML, 2:Text, 3:PDF, 4:DOC, 5:PPT, 6:XLS, 7:PS)
S.U		| Source URL
VFN		| Venue Full Name - full name of the Journal or Conference
VSN		| Venue Short Name - short name of the Journal or Conference
V		| Volume - journal volume
BV		| Journal Name
BT		| 
PB		| Journal Abreviations
I 		| Issue - journal issue
FP		| FirstPage - first page of paper
LP 		| LastPage - last page of paper
DOI		| Digital Object Identifier
CC 		| Citation Contexts – List of referenced paper ID’s and the corresponding context in the paper (e.g. [{123:[“brown foxes are known for jumping as referenced in paper 123”, “the lazy dogs are a historical misnomer as shown in paper 123”]})
IA		| Inverted Abstract
IA.IndexLength|	Number of items in the index (abstract's word count)
IA.InvertedIndex| List of abstract words and their corresponding position in the original abstract (e.g. [{“the”:[0, 15, 30]}, {“brown”:[1]}, {“fox”:[2]}])
