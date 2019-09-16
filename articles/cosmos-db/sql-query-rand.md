#### <a name="bk_rand"></a> RAND
 Returns a randomly generated numeric value from [0,1).
 
## Syntax
  
```  
RAND ()  
```  

## Return Types

  Returns a numeric expression.

## Remarks

  Repetitive calls of RAND() do not return the same results.

## Examples
  
  The following example returns a randomly generated numeric value.
  
```  
SELECT RAND() AS rand 
```  
  
 Here is the result set.  
  
```  
[{"rand": 0.87860053195618093}]  
``` 

## See Also

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
