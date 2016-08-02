<properties 
	pageTitle="Data Factory - Naming Rules | Microsoft Azure" 
	description="Describes naming rules for Data Factory entities." 
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/27/2016" 
	ms.author="spelluru"/>

# Azure Data Factory - Naming Rules 
The following table provides naming rules for Data Factory artifacts.



Name | Name Uniqueness | Validation Checks
:--- | :-------------- | :----------------
Data Factory | Unique across Microsoft Azure. Names are case-insensitive, i.e., MyDF and mydf refer to the same data factory. |<ul><li>Each data factory is tied to exactly one Azure subscription.</li><li>Object names must start with a letter or a number, and can contain only letters, numbers, and the dash (-) character.</li><li>Every dash (-) character must be immediately preceded and followed by a letter or a number; consecutive dashes are not permitted in container names.</li><li>Name can be 3-63 characters long.</li></ul>
Linked Services/Tables/Pipelines | Unique with in a data factory. Names are case-insensitive. | <ul><li>Maximum number of characters in a table name: 260.</li><li>Object names must start with a letter  number, or a  underscore (_).</li><li>Following characters are not allowed: “.”, “+”, “?”, “/”, “<”, ”>”,”*”,”%”,”&”,”:”,”\\”</li></ul>
Resource Group | Unique across Microsoft Azure. Names are case-insensitive. | <ul><li>Maximum number of characters: 1000.</li><li>Name can contain letters, digits, and the following characters: “-”, “_”, “,” and “.”.</li></ul>