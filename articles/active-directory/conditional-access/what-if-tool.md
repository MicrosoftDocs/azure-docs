---
title: The Conditional Access What If tool
description: Learn how you can understand the impact of your Conditional Access policies on your environment.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 08/16/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: nigu
ms.collection: M365-identity-device-management
---
# Use the What If tool to troubleshoot Conditional Access policies

The **Conditional Access What If policy tool** allows you to understand the impact of [Conditional Access](./overview.md) policies in your environment. Instead of test driving your policies by performing multiple sign-ins manually, this tool enables you to evaluate a simulated sign-in of a user. The simulation estimates the impact this sign-in has on your policies and generates a simulation report.

The **What If** tool provides a way to quickly determine the policies that apply to a specific user. You can use the information, for example, if you need to troubleshoot an issue.	

> [!VIDEO https://www.youtube.com/embed/M_iQVM-3C3E]

## How it works

In the **Conditional Access What If tool**, you first need to configure the conditions of the sign-in scenario you want to simulate. These settings may include:

- The user you want to test 
- The cloud apps the user would attempt to access
- The conditions under which access to the configured cloud apps is performed

The What If tool doesn't test for [Conditional Access service dependencies](service-dependencies.md). For example, if you're using What If to test a Conditional Access policy for Microsoft Teams, the result doesn't take into consideration any policy that would apply to Office 365 Exchange Online, a Conditional Access service dependency for Microsoft Teams.
     
As a next step, you can initiate a simulation run that evaluates your settings. Only policies that are enabled are part of an evaluation run.

When the evaluation has finished, the tool generates a report of the affected policies. To gather more information about a Conditional Access policy, the [Conditional Access insights and reporting workbook](howto-conditional-access-insights-reporting.md) can provide more details about policies in report-only mode and those policies currently enabled.

## Running the tool

You can find the **What If** tool in the **Microsoft Entra admin center** > **Protection** > **Conditional Access** > **Policies** > **What If**.

:::image type="content" source="./media/what-if-tool/portal-showing-location-of-what-if-tool.png" alt-text="Screenshot of the Conditional Access Policies page. In the toolbar, the What if item is highlighted." border="false" lightbox="media/what-if-tool/portal-showing-location-of-what-if-tool.png":::

Before you can run the What If tool, you must provide the conditions you want to evaluate.

## Conditions

The only condition you must make is selecting a user or workload identity. All other conditions are optional. For a definition of these conditions, see the article [Building a Conditional Access policy](concept-conditional-access-policies.md).

:::image type="content" source="./media/what-if-tool/supply-conditions-to-evaluate-in-the-what-if-tool.png" alt-text="Screenshot of the What If page ready for conditions to be entered." border="false" lightbox="media/what-if-tool/supply-conditions-to-evaluate-in-the-what-if-tool.png":::

## Evaluation

You start an evaluation by clicking **What If**. The evaluation result provides you with a report that consists of: 

- An indicator whether classic policies exist in your environment.
- Policies that will apply to your user or workload identity.
- Policies that don't apply to your user or workload identity.

If [classic policies](./policy-migration-mfa.md#classic-policies) exist for the selected cloud apps, an indicator is presented to you. By clicking the indicator, you're redirected to the classic policies page. On the classic policies page, you can migrate a classic policy or just disable it. You can return to your evaluation result by closing this page.

:::image type="content" source="media/what-if-tool/conditional-access-what-if-evaluation-result-example.png" alt-text="Screenshot of an example of the policy evaluation in the What If tool showing policies that would apply." lightbox="media/what-if-tool/conditional-access-what-if-evaluation-result-example.png":::

On the list of policies that apply, you can also find a list of [grant controls](concept-conditional-access-grant.md) and [session controls](concept-conditional-access-session.md) that must be satisfied.

On the list of policies that don't apply, you can find the reasons why these policies don't apply. For each listed policy, the reason represents the first condition that wasn't satisfied.

## Next steps

- More information about Conditional Access policy application can be found using the policies report-only mode using [Conditional Access insights and reporting](howto-conditional-access-insights-reporting.md).
- If you're ready to configure Conditional Access policies for your environment, see the [Conditional Access common policies](concept-conditional-access-policy-common.md).
