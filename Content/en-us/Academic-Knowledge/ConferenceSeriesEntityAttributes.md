<!-- 
NavPath: Academic Knowledge API/Entity Attributes
LinkLabel: Conference Series Entity
Url: Academic-Knowledge-API/documentation/EntityAttributes/ConferenceSeriesEntity
Weight: 650
-->

# Conference Series Entity

<sub>
*Below attributes are specific to conference series entity. (Ty = '3')
</sub>

Name	|Description							|Type       | Operations
------- | ------------------------------------- | --------- | ----------------------------
Id		|Entity ID								|Int64		|Equals
CN		|Conference series normalized name		|String		|Equals
DCN		|Conference series display name 		|String		|none
CC		|Conference series total citation count			|Int32		|none  
ECC		|Conference series total estimated citation count	|Int32		|none
F.FId	|Field of study entity ID associated with the conference series |Int64 	| Equals
F.FN	|Field of study name associated with the conference series 	| Equals,<br/>StartsWith
SSD		|Satori data 							|String		|none