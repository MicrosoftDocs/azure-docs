---
title: Configure the Managed Identity for a health model
description: Learn how to configure or switch the Managed Identity for a health model resource.
ms.topic: conceptual
ms.date: 12/12/2023
---

# Configure the Managed Identity for a health model

Every health model requires one Managed Identity to execute all signal queries against data sources. You can **either** use the _System assigned_ identity (recommended during Preview), or **one** _User assigned_ identity.

In most cases, you configure this identity during the creation wizard already. However, you can also change health model identity at a later point using the Identity pane.

:::image type="content" source="./media/health-model-configure-identity/health-model-resource-identity-pane.png" lightbox="./media/health-model-configure-identity/health-model-resource-identity-pane.png" alt-text="Screenshot of a health model resource in the Azure portal with the Identity pane selected.":::

## Switch the Managed Identity

If you want to switch from System assigned identity to User assigned, **disable the System assigned first** (set the status to Off), before adding a User assigned identity.

While the UI allows you to add multiple User assigned identities, make sure you **only add one** during the preview phase.