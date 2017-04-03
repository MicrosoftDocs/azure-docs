<!-- 
NavPath: Academic Knowledge API/Entity Attributes
LinkLabel: Common Entity Attributes
Url: Academic-Knowledge-API/documentation/EntityAttributes/Common Entity Attributes
Weight: 700
-->

#Entity Attributes

The academic graph is composed of 7 types of entity. All entities will have a Entity ID and a Entity type.

### Common Entity Attributes
Name	|Description	            |Type       | Operations
------- | ------------------------- | --------- | ----------------------------
Id		|Entity ID					|Int64		|Equals
Ty 		|Entity type 				|enum	|Equals

### Entity type enum
Name 															|value
----------------------------------------------------------------|-----
[Paper](PaperEntityAttributes.md)								|0
[Author](AuthorEntityAttributes.md)								|1
[Journal](JournalEntityAttributes.md)	 						|2
[Conference Series](JournalEntityAttributes.md)					|3
[Conference Instance](ConferenceInstanceEntityAttributes.md)	|4
[Affiliation](AffiliationEntityAttributes.md)					|5
[Field Of Study](FieldsOfStudyEntity.md)						|6

