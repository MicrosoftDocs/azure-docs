---
title: User defined functions in mapping data flows
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn the concepts of user defined functions in mapping data flow
author: joshuha-msft
ms.author: joowen
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 04/20/2022
---

# User defined functions in mapping data flow

## What is a user defined function?

A user defined function is an customized expression you can define to be able to reuse logic across multiple mapping data flows. User defined functions live in a collection called a data flow library to be able to easily group up common sets of customized functions.

Whenever you find yourself building the same logic in an expression in mapping data flow across more than 1 data flow would be a good opportunity to turn that into a user defined function.

## Getting started

To get started with user defined functions you must first create a data flow library. This is done by navigating to the management page and then finding data flow libraries under the author section.

![Screenshot showing the ADF management pane and data flow libraries](./media/data-flow-udf/data-flow-udf-library.png)



## Data flow library

From here you can click on +New button to create a new data flow library. Fill out the name and description and then you are ready to create your user defined function.
![Screenshot showing the data flow libraries creation pane](./media/data-flow-udf/data-flow-udf-library-create.png)

## New user defined function

To create a user defined function, from the data flow library you want to create the function in, click the +New button.
![Screenshot showing the UDF new function button.](./media/data-flow-udf/data-flow-udf-function-new.png)

Fill in the name of your user defined function.
> [!Note]
> You cannot use the name of an existing mapping data flow expression. For a list of the current mapping data flow expressions,  see [Data transformation expressions in mapping data flow | Microsoft Docs](data-transformation-functions.md)

![Screenshot showing the UDF new function creation pane.](./media/data-flow-udf/data-flow-udf-function-pane.png)

User defined functions can have 0 or more arguments. Arguments allow you to pass in values when your function is called and refer to those in your expression logic. Arguments are automatically named from i1, i2, etc. and you can choose the data type of the argument from the dropdown.

The body of the user defined function is where you specify the logic of your function. This provides the full [expression builder | Microsoft Docs](concepts-data-flow-expression-builder.md) experience and allows you to reference your arguments created and any [data transformation expressions in mapping data flow | Microsoft Docs](data-transformation-functions.md).

> [!Note]
> A user defined function cannot refer to another user defined function.

## Using a user defined function in the expression builder

User defined functions will appear in the mapping data flow expression builder under Data flow library functions. From here you see and use your custom created functions as well as pass in appropriate arguments (if any) that you have defined.

![Screenshot showing the data flow library in the mapping data flow expression builder.](./media/data-flow-udf/data-flow-udf-expression-builder.png)