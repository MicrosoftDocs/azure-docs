---
title: Standard rules engine reference for Azure Content Delivery Network | Microsoft Docs
description: Reference documentation for match conditions and actions in the Standard rules engine for Azure Content Delivery Network (Azure CDN).
services: cdn
author: mdgattuso

ms.service: azure-cdn
ms.topic: article
ms.date: 11/01/2019
ms.author: magattus

---

# Standard rules engine reference for Azure Content Delivery Network

This article lists detailed descriptions of the available match conditions and features for the Azure Content Delivery Network (Azure CDN) [Standard rules engine](cdn-standard-rules-engine.md).

The rules engine is designed to be the final authority on how specific types of requests are processed by Standard Azure CDN.

**Common uses**:

- Override or define a custom cache policy.
- Redirect requests.
- Modify HTTP request and response headers.

## Terminology

You define a rule by setting [**match conditions**](cdn-standard-rules-engine-match-conditions.md), and [**actions**](cdn-standard-rules-engine-actions.md). These elements are highlighted in the following illustration:

 ![Azure CDN rules structure](./media/cdn-standard-rules-engine-reference/cdn-rules-structure.png)

Each rule can have up to four match conditions and three actions. Each Azure CDN endpoint can have up to five rules. 

Included in the current five-rule limit for an Azure CDN endpoint is a default *global rule*. The global rule doesn't have match conditions, and actions that are defined in a global rule always trigger.

## Syntax

How special characters are treated varies based on how a match condition or action handles text values. A match condition or feature can interpret text in one of the following ways:

- [**Literal values**](#literal-values)
- [**Wildcard values**](#wildcard-values)


### Literal values

Text that is interpreted as a literal value treats all special characters *except the % symbol* as part of the value that must be matched. For example, a literal match condition set to `\'*'\` is satisfied only when that exact value (`\'*'\`) is found.

A percent sign is used to indicate URL encoding (for example, `%20`).

### Wildcard values

Text that is interpreted as a wildcard value assigns additional meaning to special characters. The following table describes how specific special characters are interpreted:

Character | Description
----------|------------
\ | A backslash is used to escape any of the characters specified in this table. A backslash must be specified directly before the special character that should be escaped.<br/>For example, the following syntax escapes an asterisk: `\*`
% | A percent sign is used to indicate URL encoding (for example, `%20`).
\* | An asterisk is a wildcard that represents one or more characters.
space | A space character indicates that a match condition can be satisfied by either of the specified values or patterns.
single quotation marks | A single quotation mark doesn't have special meaning. However, a set of single quotation marks indicates that a value should be treated as a literal value. Single quotation marks can be used in the following ways:<br><br/>- To allow a match condition to be satisfied whenever the specified value matches any portion of the comparison value.  For example, `'ma'` would match any of the following strings: <br/><br/>/business/**ma**rathon/asset.htm<br/>**ma**p.gif<br/>/business/template.**ma**p<br /><br />- To allow a special character to be specified as a literal character. For example, you can specify a literal space character by enclosing a space character within a set of single quotation marks (`' '` or `'sample value'`).<br/>- To allow a blank value to be specified. Specify a blank value by specifying a set of single quotation marks (**''**).<br /><br/>**Important:**<br/>- If the specified value doesn't contain a wildcard, the value is automatically considered a literal value, which means that it isn't necessary to specify a set of single quotation marks.<br/>- If a backslash does not escape another character in this table, the backslash is ignored when it's specified within a set of single quotation marks.<br/>- Another way to specify a special character as a literal character is to escape it by using a backslash (`\`).

## Next steps

- [Standard rules engine match conditions](cdn-standard-rules-engine-match-conditions.md)
- [Standard rules engine actions](cdn-standard-rules-engine-actions.md)
- [Enforce HTTPS by using the Standard rules engine](cdn-standard-rules-engine.md)
- [Azure Content Delivery Network overview](cdn-overview.md)
