---
title: Azure CDN Standard rules engine reference | Microsoft Docs
description: Reference documentation for Azure CDN Standard rules engine match conditions and actions.
services: cdn
author: mdgattuso

ms.service: azure-cdn
ms.topic: article
ms.date: 11/01/2019
ms.author: magattus

---
# Azure CDN from Microsoft Rules Engine reference

This article lists detailed descriptions of the available match conditions and features for the Azure Content Delivery Network (CDN) [Standard Rules Engine](cdn-standard-rules-engine.md).

The rules engine is designed to be the final authority on how specific types of requests are processed by the CDN.

**Common uses**:

- Override or define a custom cache policy.
- Redirect requests.
- Modify HTTP request and response headers

## Terminology

A rule is defined through the use of [**match conditions**](cdn-standard-rules-engine-match-conditions.md), and [**actions**](cdn-standard-rules-engine-actions.md). These elements are highlighted in the following illustration:

 ![CDN rules structure](./media/cdn-standard-rules-engine-reference/cdn-rules-structure.png)

Each rule can have up to 4 match conditions, and 3 actions. There is a maximum of 5 rules per CDN endpoint. Additionally, there is a rule in place by default called the **Global Rule**. This is a rule with no match conditions, where the actions defined within will always trigger. This rule is included in the current 5 rule limit.

## Syntax

The manner in which special characters are treated varies according to how a match condition or actopm handles text values. A match condition or feature may interpret text in one of the following ways:

1. [**Literal values**](#literal-values)
2. [**Wildcard values**](#wildcard-values)


### Literal values

Text that is interpreted as a literal value treats all special characters, with the exception of the % symbol, as a part of the value that must be matched. In other words, a literal match condition set to `\'*'\` is only satisfied when that exact value (that is, `\'*'\`) is found.

A percent sign is used to indicate URL encoding (for example, `%20`).

### Wildcard values

Text that is interpreted as a wildcard value assigns additional meaning to special characters. The following table describes how the following set of characters is interpreted:

Character | Description
----------|------------
\ | A backslash is used to escape any of the characters specified in this table. A backslash must be specified directly before the special character that should be escaped.<br/>For example, the following syntax escapes an asterisk: `\*`
% | A percent sign is used to indicate URL encoding (for example, `%20`).
\* | An asterisk is a wildcard that represents one or more characters.
Space | A space character indicates that a match condition may be satisfied by either of the specified values or patterns.
'value' | A single quote does not have special meaning. However, a set of single quotes is used to indicate that a value should be treated as a literal value. It can be used in the following ways:<br><br/>- It allows a match condition to be satisfied whenever the specified value matches any portion of the comparison value.  For example, `'ma'` would match any of the following strings: <br/><br/>/business/**ma**rathon/asset.htm<br/>**ma**p.gif<br/>/business/template.**ma**p<br /><br />- It allows a special character to be specified as a literal character. For example, you may specify a literal space character by enclosing a space character within a set of single quotes (that is, `' '` or `'sample value'`).<br/>- It allows a blank value to be specified. Specify a blank value by specifying a set of single quotes (that is, '').<br /><br/>**Important:**<br/>- If the specified value does not contain a wildcard, then it is automatically considered a literal value, which means that it is not necessary to specify a set of single quotes.<br/>- If a backslash does not escape another character in this table, it is ignored when it is specified within a set of single quotes.<br/>- Another way to specify a special character as a literal character is to escape it using a backslash (that is, `\`).

## Next steps

- [Standard Rules Engine match conditions](cdn-standard-rules-engine-match-conditions.md)
- [Standard Rules Engine actions](cdn-standard-rules-engine-actions.md)
- [Enforce HTTPS using the Standard Rules Engine](cdn-standard-rules-engine.md)
- [Azure CDN overview](cdn-overview.md)
