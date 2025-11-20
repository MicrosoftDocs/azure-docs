---
title: Manage Azure Confluent Connectors (Preview)
description: Learn how to manage Confluent Connectors in Azure (preview).
ms.topic: how-to
ms.date: 10/30/2025
ms.author: malev
author: maud-lv

#customer intent: As a developer, I want to learn how to manage a Confluent Connector.
---

# Manage Azure Confluent Connectors (preview)

This article describes how to manage Azure Confluent Connectors (preview) in the Azure portal. 

1. In the Azure portal, go to your Confluent organization.
1. In the left pane, select **Confluent** > **Confluent Connectors**.
1. Select your environment and cluster.

The Azure portal shows a list of Azure connectors for the environment and cluster.

You can also complete the following optional actions:

* Filter connectors by **Type** (**Source** or **Sink**) and **Status** (**Running**, **Failed**, **Provisioning**, or **Paused**).
* Search for a connector by name.

   :::image type="content" source="./media/confluent-connectors/display-connectors.png" alt-text="Screenshot that shows a list of existing connectors on the Confluent Connectors tab in the Azure portal." lightbox="./media/confluent-connectors/display-connectors.png":::

   To learn more about a connector, select the connector tile to open Confluent. In the Confluent UI, you can see the connector health, throughput, and other information. You also can edit and delete the connector.