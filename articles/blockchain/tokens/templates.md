---
title: Azure Blockchain Tokens templates
description: Azure Blockchain Tokens templates are standardized and reusable templates that simplify the creation and deployment of ledger-based tokens.
services: azure-blockchain
author: PatAltimore
ms.author: patricka
ms.date: 11/04/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: brendal
#Customer intent: As an administrator, I want to use token templates to define tokens for my blockchain solution.
---

# Azure Blockchain Tokens templates

[!INCLUDE [Preview note](./includes/preview.md)]

An Azure Blockchain Tokens template is a standardized and reusable template that simplifies the creation and deployment of ledger-based tokens. A template consists of a formula, which is based off the [Token Taxonomy Framework (TTF)](overview.md#token-taxonomy-framework) grammar. The grammar encompasses the base token type and the set of behaviors for the token.  

For example, **τϜ{d,m,b,r}** token template describes a fungible base token that is sub-dividable, mintable, burnable, and has role support.
  
## Base token types

When defining and creating the ledger-based token for your particular asset, it is important to consider what base token to use.

### Fungible

Fungible tokens (𝜏F) have interchangeable value with each other as long as they are in the same class or series. One token has the same value as another token or a given quantity of tokens has the same value as another equal quantity. For example, a dollar is a fungible token. If two people are each holding a dollar bill, they can exchange these dollar bills without consequence. The dollar bills have equal value. 

### Non-Fungible

Non-fungible tokens (𝜏N) are not interchangeable with other tokens of the same type as they typically have different values. For example, a property title is a non-fungible token. Property titles to two different apartments in an apartment complex are not necessarily of equal value, due to either the location of the unit or which floor the unit is on. The perceived value of the two property title tokens are not equal.

### Hybrid

Hybrid tokens are tokens that have components of both fungible tokens and non-fungible tokens. A hybrid token is a base token type that owns a class of the other token type.

#### Hybrid non-fungible base with fungible segments

A hybrid non-fungible base with fungible segments token has a non-fungible base with fungible token segments.
For example, a concert ticket is a hybrid token where the date and time of the concert is the non-fungible base token. The tickets in various seating sections for the given concert are the segments with fungible tokens. The tickets are exchangeable in their individual seating sections, but not across sections.

#### Hybrid fungible base with non-fungible segments

A hybrid fungible base with a non-fungible segments token has a fungible base with non-fungible token segments. For example, a mortgage backed security is a hybrid token where multiple owners are the fungible base that is split across many owners. The security is interchangeable. The individual mortgages are the non-fungible segments that represent the specific mortgage backed security.

## Token behaviors

A token behavior defines capabilities or restrictions of the token. The behavior includes supporting properties that are a part of the token definition. Behaviors can be applied across all token types or just one. Behaviors can be internal or external depending on what the behavior effects. An internal behavior enables or restricts properties on the token itself. An external behavior enables or restricts the invocation of the behavior from an external actor.

For more information about Azure Blockchain Tokens supported Token Taxonomy Framework (TTF) token behaviors, see [token composability](composability.md).

## Pre-built token templates

Azure Blockchain Tokens provides four pre-built token templates that can be used without modification. You can call into these pre-built templates for most use cases to get started creating, deploying, and managing your tokens quickly.

### Commodity tokens

Commodity tokens have consistent value and are transferrable. For example, a barrel of oil or a unit of energy.

**𝜏F{~d,t,m,b,r}** - fungible, whole, transferable, mintable, burnable, and have role support

Many blockchain scenarios require transparency and visibility across the supply chain or multiple organizations. Commodity tokens are based off these common use cases. The tokens are interchangeable and consistent. The commodity token template is flexible and customizable with metadata.

### Qualified tokens

Qualified tokens represent something earned and are usually associated with one entity and cannot be transferred. For example, a diploma or a parking violation.

**𝜏N{s,~t}** - non-fungible, singleton, and non-transferable

Various audit and attestation scenarios require that the ownership of the token cannot be changed. There is a set of use cases, which have a need to provide a qualified token whether the association is good or bad.

### Asset tokens

Asset tokens have unique value dependent on the item and are not commoditized. For example, a museum artifact or a property title.

**𝜏N{s,t}** - non-fungible, singleton, and transferable

Asset tokens may be confused with commodity tokens. The major difference between the two tokens is that asset tokens are inherently unique, and value is independent of the type of token it is. For example, a piece of art like an oil painting by an established artist is an asset token. However, an art print of the Mona Lisa is considered a commodity token. Similarly, a property title is an asset token since the value exists in the subjective qualities of the property.

### Ticket tokens

Ticket tokens have consistent value but typically expire. For example, a plane ticket.

**𝜏N{m,b,r}** - non-fungible, mintable, burnable, and have role support.

Ticket tokens typically have an expiry date that makes them different from a regular commodity token. For example, an airplane ticket, concert ticket, or sports ticket all have options of assigned seating with specific dates of use. You cannot easily interchange tickets between dates or seating areas.

## Next steps

If you require more flexibility for your scenario, learn about creating your own token templates using [token composability](composability.md).
