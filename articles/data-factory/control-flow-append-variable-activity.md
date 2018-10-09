---
title: Append Variable Activity in Azure Data Factory | Microsoft Docs
description: Learn how to set the Append Variable activity to add a value to an existing array variable defined in a Data Factory pipeline
services: data-factory
documentationcenter: ''
author: douglaslMS
manager: craigg
editor: 

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/09/2018
ms.author: douglasl
---
# Append Variable Activity in Azure Data Factory

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
