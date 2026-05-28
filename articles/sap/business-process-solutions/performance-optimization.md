---
title: Performance Optimization in Business Process Solutions
titleSuffix: SAP on Azure
description: Learn how to enable native acceleration in Fabric environments and configure high concurrency mode in workspace settings for Business Process Solutions.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 05/28/2026
ms.author: momakhij
---

# Performance Optimization in Business Process Solutions

To improve the performance of data extraction and processing workloads in Business Process Solutions, enable native acceleration and high concurrency mode in your Fabric workspace. These settings reduce Spark job execution time and allow multiple notebooks to share a single Spark session.

## Enable native acceleration

The native execution engine accelerates Spark jobs by running queries directly on your lakehouse infrastructure using vectorized, columnar processing. Enabling it at the environment level ensures all notebooks and Spark job definitions in that environment benefit automatically.

To enable the native execution engine in your environment:

1. Navigate to your workspace and select the environment that starts with **bps_env**.
2. Under **Spark compute**, select **Acceleration**.
3. Select the **Enable native execution engine** checkbox.
   :::image type="content" source="./media/performance-optimization/enable-native-execution-engine.png" alt-text="Screenshot showing how to enable the native execution engine in the Acceleration tab of the environment settings." lightbox="./media/performance-optimization/enable-native-execution-engine.png":::
4. Select **Publish** to apply the changes.

When enabled, all subsequent jobs and notebooks in the environment inherit the setting automatically.
For more information on the native execution engine and its performance benefits, see [Native execution engine in Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/data-engineering/native-execution-engine-overview).

## Enable high concurrency mode

High concurrency mode allows multiple notebooks to share a single Spark session, reducing session start time and improving throughput for workloads that run several notebooks in parallel.

To enable high concurrency mode in your workspace:

> [!NOTE]
> Only Fabric workspace admins can enable high concurrency mode using workspace settings.

1. In your Fabric workspace, select **Workspace settings**.
2. Navigate to **Data Engineering/Science** > **Spark settings** > **High concurrency**.
3. Enable the **For notebooks** toggle to allow multiple interactive notebooks to share a Spark session.
4. Enable the **For pipeline running multiple notebooks** toggle to allow pipeline notebook steps to share a Spark session.
   :::image type="content" source="./media/performance-optimization/enable-high-concurrency.png" alt-text="Screenshot showing the High concurrency section in workspace Spark settings with both toggles enabled." lightbox="./media/performance-optimization/enable-high-concurrency.png":::
5. Select **Save**.

For more information on high concurrency mode and its performance benefits, see [High concurrency mode in Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/data-engineering/configure-high-concurrency-session-notebooks-in-pipelines).

## Summary

This article described how to optimize performance for Business Process Solutions workloads in Microsoft Fabric. You learned how to enable the native execution engine in a Fabric environment and how to configure high concurrency mode in workspace Spark settings.
