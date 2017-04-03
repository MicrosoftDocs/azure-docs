<!-- 
NavPath: Academic Knowledge API/Entity Attributes
LinkLabel: Field Of Study Entity
Url: Academic-Knowledge-API/documentation/EntityAttributes/FieldsOfStudyEntity
Weight: 660
-->

# Field Of Study Entity

<sub>
*Below attributes are specific to field of study entity. (Ty = '6')
</sub>

Name	|Description							|Type       | Operations
------- | ------------------------------------- | --------- | ----------------------------
Id		|Entity ID								|Int64		|Equals
FN		|Field of study normalized name			|String		|Equals
DFN 	|Field of study display name			|String		|none
CC		|Field of study total citation count	|Int32		|none  
ECC		|Field of total estimated citation count|Int32		|none
FL		|Level in fields of study hierarchy 	|Int32		|Equals, <br/>IsBetween
FP.FN	|Parent field of study name 			|String		|Equals
FP.FId 	|Parent field of study ID 				|Int64 		|Equals
SSD		|Satori data 							|String		|none