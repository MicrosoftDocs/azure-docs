---
title: View the attained service level for a health model
description: Learn how to view an overview of the attained service level for your workload for the time span you specify.
ms.topic: conceptual
ms.date: 12/12/2023
---

# View the attained service level for a health model

The service level view gives you an overview of the attained service level of your workload visualized in your health model. It shows you the healthy, unknown, degraded and unhealthy states. Only unhealthy states are considered not attained.

:::image type="content" source="./media/health-model-service-level/health-model-resource-service-level-view-pane.png" lightbox="./media/health-model-service-level/health-model-resource-service-level-view-pane.png" alt-text="Screenshot of a health model resource in the Azure portal with the Service level view pane selected.":::

The table in the upper right corner shows you the configured "Service Level Objective", the "Attained Service Level" and the "Remaining Error Budget", which represents the difference between the attained and the configured Service Level.

:::image type="content" source="./media/health-model-service-level/health-model-service-level-details.png" lightbox="./media/health-model-service-level/health-model-service-level-details.png" alt-text="Screenshot of the health model service level details within the Service level view pane.":::

The target Service Level Objective is configured via, for example, the [Designer](./health-model-create-modify-with-designer.md), on the root entity of your health model.

:::image type="content" source="./media/health-model-service-level/slo-target.png" lightbox="./media/health-model-service-level/slo-target.png" alt-text="Screenshot of configuring an SLO target on a health model root entity.":::

The command bar in the "Service level view" lets you define the time span the Service level is calculated for:

:::image type="content" source="./media/health-model-service-level/service-level-view-pane-command-bar-timespan.png" lightbox="./media/health-model-service-level/service-level-view-pane-command-bar-timespan.png" alt-text="Screenshot of the command bar within the Service level view pane with the Timespan dropdown selected.":::

It also tells you when there isn't enough data available:

:::image type="content" source="./media/health-model-service-level/service-level-view-pane-command-bar-not-enough-data.png" lightbox="./media/health-model-service-level/service-level-view-pane-command-bar-not-enough-data.png" alt-text="Screenshot that shows the command bar within the Service level view pane and the Not enough data message displayed.":::