---
title: SQL query performance guidelines
description: Learn about SQL query performance guidelines in Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: tisande

---
#  Query performance guidelines  
 In order for a query to be executed efficiently for a large container, it should use filters that can be served through one or more indexes.  
  
 The following filters will be considered for index lookup:  
  
- Use equality operator ( = ) with a document path expression and a constant.  
  
- Use range operators (<, \<=, >, >=) with a document path expression and number constants.  
  
- Document path expression stands for any expression that identifies a constant path in the documents from the referenced database container.  
  
**Document path expression**  
  
  Document path expressions are expressions that a path of property or array indexer assessors over a document coming from database container documents. This path can be used to identify the location of values referenced in a filter directly within the documents in the database container.  
  
  For an expression to be considered a document path expression, it should:  
  
1.  Reference the container root directly.  
  
2.  Reference property or constant array indexer of some document path expression  
  
3.  Reference an alias, which represents some document path expression.  
  
**Syntax conventions**  
  
 The following table describes the conventions used to describe syntax in the following SQL reference.  
  
    |**Convention**|**Used for**|  
    |-|-|    
    |UPPERCASE|Case-insensitive keywords.|  
    |lowercase|Case-sensitive keywords.|  
    |\<nonterminal>|Nonterminal, defined separately.|  
    |\<nonterminal> ::=|Syntax definition of the nonterminal.|  
    |other_terminal|Terminal (token), described in detail in words.|  
    |identifier|Identifier. Allows following characters only: a-z A-Z 0-9 _First character cannot be a digit.|  
    |"string"|Quoted string. Allows any valid string. See description of a string_literal.|  
    |'symbol'|Literal symbol that is part of the syntax.|  
    |&#124; (vertical bar)|Alternatives for syntax items. You can use only one of the items specified.|  
    |[ ] /(brackets)|Brackets enclose one or more optional items.|  
    |[ ,...n ]|Indicates the preceding item can be repeated n number of times. The occurrences are separated by commas.|  
    |[ ...n ]|Indicates the preceding item can be repeated n number of times. The occurrences are separated by blanks.|  
  
## Next steps  

- [Cosmos DB documentation](https://docs.microsoft.com/azure/cosmos-db/)
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Azure Cosmos DB consistency levels](consistency-levels.md)  
