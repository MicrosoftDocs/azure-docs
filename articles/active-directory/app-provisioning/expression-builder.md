---
title: Understand how expression builder works with Application Provisioning in Azure Active Directory
description: Understand how expression builder works with Application Provisioning in Azure Active Directory.
services: active-directory
author: kenwith
manager: mtillman
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: conceptual
ms.workload: identity
ms.date: 06/02/2021
ms.author: kenwith
ms.reviewer: arvinh
---

# Understand how expression builder in Application Provisioning works

You can use expressions to map attributes. Previously, you had to create these expressions manually and enter them into the expression box. Expression builder is a tool you can use to help you create expressions.

:::image type="content" source="media/expression-builder/expression-builder.png" alt-text="The default expression builder page before selecting a function." lightbox="media/expression-builder/expression-builder.png":::

For reference on building expressions, see [Reference for writing expressions for attribute mappings](functions-for-customizing-application-data.md). 

## Finding expression builder

In application provisioning, you use expressions for attribute mappings. You access Express Builder on the attribute-mapping page by selecting **Show advanced options** and then select **Expression builder**.

:::image type="content" source="media/expression-builder/accessing-expression-builder.png" alt-text="The checkbox to show advanced settings is selected and a link is shown that says expression builder" lightbox="media/expression-builder/accessing-expression-builder.png":::

## Using expression builder

To use expression builder, select a function and attribute and then enter a suffix if needed. Then select **Add expression** to add the expression to the code box. To learn more about the functions available and how to use them, see [Reference for writing expressions for attribute mappings](functions-for-customizing-application-data.md).

Test the expression by providing values and selecting **Test expression**. The output of the expression test will appear in the **View expression output** box.

When you're satisfied with the expression, move it to an attribute mapping. Copy and paste it into the expression box for the attribute mapping you're working on.

## Next Steps

[Reference for writing expressions for attribute mappings](functions-for-customizing-application-data.md)
