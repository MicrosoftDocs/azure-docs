---
author: brjohnstmsft
ms.service: search
ms.topic: include
ms.date: 05/30/2018	
ms.author: brjohnst
---

| Data type | Features not allowed in lambda expressions with `any` | Features not allowed in lambda expressions with `all` |
|---|---|---|
| `Collection(Edm.ComplexType)` | `search.ismatch`, `search.ismatchscoring` | Same |
| `Collection(Edm.String)` | Comparisons other than `eq` or `search.in`, combining sub-expressions with `and` | Comparisons other than `ne` or `not search.in()`, combining sub-expressions with `or` |
| `Collection(Edm.Boolean)` | Comparisons other than `eq` or `ne`, combining sub-expressions with `and`/`or` | Same |
| `Collection(Edm.GeographyPoint)` | Using `ge` or `gt` with `geo.distance`, negating `geo.intersects`, combining sub-expressions with `and` | Using `le` or `lt` with `geo.distance`, using `geo.intersects` without negation, combining sub-expressions with `or` |
| `Collection(Edm.DateTimeOffset)`, `Collection(Edm.Double)`, `Collection(Edm.Int32)`, `Collection(Edm.Int64)` | Combining `ne` comparisons with other sub-expressions using `and`, expressions using combinations of `and` and `or` that are not in [Disjunctive Normal Form (DNF)](https://en.wikipedia.org/wiki/Disjunctive_normal_form) | Combining `eq` comparisons with other sub-expressions using `or`, expressions using combinations of `and` and `or` that are not in [Conjunctive Normal Form (CNF)](https://en.wikipedia.org/wiki/Conjunctive_normal_form) |
