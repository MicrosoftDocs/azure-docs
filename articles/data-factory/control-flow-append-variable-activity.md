---
title: Append Variable Activity in Azure Data Factory 
description: Learn how to set the Append Variable activity to add a value to an existing array variable defined in a Data Factory pipeline
ms.service: data-factory
ms.topic: conceptual
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.date: 10/09/2018
---

# Append Variable Activity in Azure Data Factory
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]
Use the Append Variable activity to add a value to an existing array variable defined in a Data Factory pipeline.

## Type properties

Property | Description | Required
-------- | ----------- | --------
name | Name of the activity in pipeline | Yes
description | Text describing what the activity does | no
type | Activity Type is AppendVariable | yes
value | String literal or expression object value used to append into specified variable | yes
variableName | Name of the variable that will be modified by activity, the variable must be of type ‘Array’ | yes

## Next steps
Learn about a related control flow activity supported by Data Factory: 

- [Set Variable Activity](control-flow-set-variable-activity.md)
