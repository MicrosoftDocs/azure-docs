---
title: Data Processor jq usage
description: Overview of how the Azure IoT Data Processor uses jq expressions and paths to configure pipeline stages.
author: dominicbetts
ms.author: dobett
ms.subservice: data-processor
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.custom:
  - ignite-2023
ms.date: 09/07/2023

#CustomerIntent: As an operator, I want understand how pipelines use jq expressions so that I can configure pipeline stages.
---

# What is jq in Data Processor pipelines?

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

[jq](https://jqlang.github.io/jq/) is an open source JSON processor that you can use restructure and format structured payloads in Azure IoT Data Processor (preview)) pipelines:

- The [filter](howto-configure-filter-stage.md) pipeline stage uses jq to enable flexible filter queries.
- The [transform](howto-configure-transform-stage.md) pipeline stage uses jq to enable data transformation.

> [!TIP]
> jq isn't the same as jQuery and solves a different set of problems. When you search online for information about jq, your search results may include information jQuery. Be sure to ignore or exclude the jQuery information.

The jq you provide in these stages must be:

- Syntactically valid.
- Semantically valid for the message the jq is applied to.

## How to use jq

There are two ways that you use the jq language in Data Processor pipeline stages:

- [Expressions](concept-jq-expression.md) that use the full power of the jq language, including the ability to perform arbitrary manipulations and computations with your data. Expressions appear in pipeline stages such as filter and transform and are referred to as _expressions_ where they're used.
- [Paths](concept-jq-path.md) identify a single location in a message. Paths use a small subset of the jq language. You use paths to retrieve information from messages and to place computed information back into the message for processing later in a pipeline.

> [!TIP]
> This guide doesn't provide a complete picture of the features of jq. For the full language reference, see the [jq manual](https://jqlang.github.io/jq/manual/).

For performance reasons, Data Processor blocks the use of the following jq functions:

- `Modulemeta`
- `Range`
- `Recurse`
- `Until`
- `Walk`
- `While`

## Troubleshooting

As you build jq paths or expressions within data processor, there are few things to keep in mind. If you're encountering issues, make sure that you're not making one of the following mistakes:

### Not scoping to `payload`

All messages in data processor pipelines begin with a structure that places the payload of the message in a top-level field called `payload`. Although not required, it's a strong convention when you process messages to keep the main payload inside the `payload` field as the message passes through the various pipeline stages.

Most use cases for transformation and filtering involve working directly with the payload, therefore it's common to see the entire query scoped to the payload field. You might forget that messages use this structure and treat the payload as if it's at the top level.

The fix for this mistake is simple. If you're using jq to:

- Filter messages, add `.payload |` to the start of your expression to scope it correctly.
- Transform messages:
  - If you're not splitting the message, add `.payload |=` to the beginning of your expression to scope your transformation.
  - If you're splitting the message, add `.payload = (.payload | <expression>)` around your `<expression>` to update payload specifically while enabling the message to be split.

### Trying to combine multiple messages

jq has lots of features that let you break messages apart and restructure them. However, only a single message at a time that enters a pipeline stage can invoke a jq expression. Therefore, it's not possible with filters and transformations alone to combine data from multiple input messages.

If you want to merge values from multiple messages, use an aggregate stage to combine the values first, and then use transformations or filters to operate on the combined data.

### Separating function arguments with `,` instead of `;`

Unlike most programming languages, jq doesn't use `,` to separate function arguments. jq separates each function argument with `;`. This mistake can be tricky to debug because `,` is a valid syntax in most places, but means something different. In jq, `,` separates values in a stream.

The most common error you see if you use a `,` instead of a `;` is a complaint that the function you're trying to invoke doesn't exist for the number of arguments supplied. If you get any compile errors or any other strange errors when you call a function that don't make sense, make sure that you're using `;` instead of `,` to separate your arguments.

### Order of operations

The order of operations in jq can be confusing and counterintuitive. Operations in between `|` characters are typically all run together before the jq applies the `|`, but there are some exceptions. In general, add `()` around anything where you're unsure of the natural order of operations. As you use the language more, you learn what needs parentheses and what doesn't.

## Related content

Refer to these articles for help when you're using jq:

- [jq paths](concept-jq-path.md)
- [jq expressions](concept-jq-expression.md)
