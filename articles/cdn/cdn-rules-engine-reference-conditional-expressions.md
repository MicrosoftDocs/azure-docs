---
title: Azure CDN rules engine conditional expressions | Microsoft  Docs
description: Reference documentation for Azure CDN rules engine match conditions and features.
services: cdn
documentationcenter: ''
author: Lichard
manager: akucer
editor: ''

ms.assetid: 669ef140-a6dd-4b62-9b9d-3f375a14215e
ms.service: cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2017
ms.author: rli

---

# Azure CDN rules engine conditional expressions
This topic lists detailed descriptions of the Conditional Expressions for Azure Content Delivery Network (CDN) [Rules Engine](cdn-rules-engine.md).

The first part of a rule is the Conditional Expression.

Conditional Expression | Description
-----------------------|-------------
IF | An IF expression is always a part of the first statement in a rule. Like all other conditional expressions, this IF statement must be associated with a match. If no additional conditional expressions are defined, then this match determines the criterion that must be met before a set of features may be applied to a request.
AND IF | An AND IF expression may only be added after the following types of conditional expressions:IF,AND IF. It indicates that there is another condition that must be met for the initial IF statement.
ELSE IF| An ELSE IF expression specifies an alternative condition that must be met before a set of features specific to this ELSE IF statement takes place. The presence of an ELSE IF statement indicates the end of the previous statement. The only conditional expression that may be placed after an ELSE IF statement is another ELSE IF statement. This means that an ELSE IF statement may only be used to specify a single additional condition that has to be met.

**Example**:
![CDN match condition](./media/cdn-rules-engine-reference/cdn-rules-engine-conditional-expression.png)

 > [!TIP]
   > A subsequent rule may override the actions specified by a previous rule. 
   > Example: A catch-all rule secures all requests via Token-Based Authentication. Another rule may be created directly below it to make an exception for certain types of requests.

### Next steps
* [Azure CDN Overview](cdn-overview.md)
* [Rules Engine Reference](cdn-rules-engine-reference.md)
* [Rules Engine Match Conditions](cdn-rules-engine-reference-match-conditions.md)
* [Rules Engine Features](cdn-rules-engine-reference-features.md)
* [Overriding default HTTP behavior using the rules engine](cdn-rules-engine.md)
