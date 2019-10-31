---
title: Azure Blockchain Tokens composability
description: Azure Blockchain Tokens composability provides flexibility to create tokens for advanced scenarios.
services: azure-blockchain
author: PatAltimore
ms.author: patricka
ms.date: 11/04/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: brendal
#Customer intent: As an administrator, I want to use behaviors to create a token for my solution.
---

# Azure Blockchain Tokens composability

[!INCLUDE [Preview note](./includes/preview.md)]

Token composability provides flexibility to create tokens for advanced scenarios. ​You may have a complex scenario that cannot be implemented using the [four pre-built token templates](templates.md#base-token-types). Token composability allows you to design your own token templates by adding or removing defined behaviors to build your own token template. 
When creating a new token template, Azure Blockchain Tokens verifies all token grammar rules. Composed templates are saved in Azure Blockchain Tokens service for issuing on connected blockchain networks.

You can use the [token behaviors](templates.md#token-behaviors) in the following sections to design your token template.

## Burnable (b)

Ability to remove the tokens from supply.

For example, when you redeem online credit card points for a gift card, the credit card points are burned.

## Delegable (g)

Ability to delegate the actions taken on the token that you own.

The delegate can perform actions as the owner of the token. For example, you could use a delegable token to implement a vote. A delegable token allows the vote token owner to have someone else vote on their behalf.

## Logable (l)

Ability to log.

For example, you can issue a logable token for a movie distribution to each theater showing a specific movie. For the movie to be played, the showing must log a transaction for each showing because royalty payouts are per showing during the movie's release run. The actors build can use the movie tokens to validate payouts per movie showing per theater in the distribution.

## Mint-able (m)

Ability to mint additional tokens for the token class. The minter role includes the mintable behavior.

For example, a retail company, which wants to implement a loyalty program can use mintable tokens for their loyalty program. They can mint additional loyalty points for their customers as their customer base grows.  

## Non-subdividable or whole (~d)

Restriction to prevent a token from being divided into smaller parts.

For example, a single art painting cannot be subdivided into multiple smaller parts. 

## Non-transferable (~t)

Restriction to prevent a change of ownership from the initial token owner.

For example, a university diploma is a non-transferable token. Once a diploma is given to a graduate, it cannot be transferred from the graduate to another person.

## Roles (r)

Ability to define roles within the token template class for specific behaviors.

You can provide a list of role names that a token supports at the token creation time. When roles are specified, the user can assign roles to these behaviors. Currently, only the minter role is supported.

## Singleton (s)

Restriction to allow a supply of one token.

For example, a museum artifact is a singleton token. Museum artifacts are unique. A token representing an artifact only has a single item in the supply.

## Subdividable (d)

Ability to divide a token into smaller parts.

For example, a dollar can be subdivided into cents.

## Transferable (t)

Ability to transfer ownership of the token.

For example, a property title is a transferable token, which can be transferred from one person to another when the property is sold.

## Next steps

Learn about [Azure Blockchain Tokens account management](account-management.md).
