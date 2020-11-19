---
author: brjohnstmsft
ms.service: cognitive-search
ms.topic: include
ms.date: 06/13/2018    
ms.author: brjohnst
---

| Data type | Features allowed in lambda expressions with `any` | Features allowed in lambda expressions with `all` |
|---|---|---|
| `Collection(Edm.ComplexType)` | Everything except `search.ismatch` and `search.ismatchscoring` | Same |
| `Collection(Edm.String)` | Comparisons with `eq` or `search.in` <br/><br/> Combining sub-expressions with `or` | Comparisons with `ne` or `not search.in()` <br/><br/> Combining sub-expressions with `and` |
| `Collection(Edm.Boolean)` | Comparisons with `eq` or `ne` | Same |
| `Collection(Edm.GeographyPoint)` | Using `geo.distance` with `lt` or `le` <br/><br/> `geo.intersects` <br/><br/> Combining sub-expressions with `or` | Using `geo.distance` with `gt` or `ge` <br/><br/> `not geo.intersects(...)` <br/><br/> Combining sub-expressions with `and` |
| `Collection(Edm.DateTimeOffset)`, `Collection(Edm.Double)`, `Collection(Edm.Int32)`, `Collection(Edm.Int64)` | Comparisons using `eq`, `ne`, `lt`, `gt`, `le`, or `ge` <br/><br/> Combining comparisons with other sub-expressions using `or` <br/><br/> Combining comparisons except `ne` with other sub-expressions using `and` <br/><br/> Expressions using combinations of `and` and `or` in [Disjunctive Normal Form (DNF)](https://en.wikipedia.org/wiki/Disjunctive_normal_form) | Comparisons using `eq`, `ne`, `lt`, `gt`, `le`, or `ge` <br/><br/> Combining comparisons with other sub-expressions using `and` <br/><br/> Combining comparisons except `eq` with other sub-expressions using `or` <br/><br/> Expressions using combinations of `and` and `or` in [Conjunctive Normal Form (CNF)](https://en.wikipedia.org/wiki/Conjunctive_normal_form) |
