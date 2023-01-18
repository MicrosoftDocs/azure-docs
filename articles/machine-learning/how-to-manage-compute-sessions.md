---
title: How to manage compute sessions
titleSuffix: Azure Machine Learning
description: Use the session management panel to manage the active notebook and terminal sessions running on a compute instance.
services: machine-learning
author: lebaro-msft
ms.author: lebaro
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 12/21/2022
# Customer intent: As a data scientist, I want to manage the notebook and terminal sessions on my compute instance for optimal performance.
---

# Manage notebook and terminal sessions

Notebook and terminal sessions run on the compute and maintain your current working state.

When you re-open a notebook, or reconnect to a terminal session, you can reconnect to the previous session state (including command history, execution history, and defined variables). However, too many active sessions may slow down the performance of your compute. This may make terminal or cell typing feel laggy, cause terminal commands to feel slow, or cause notebook execution to take longer than expected.

There is a session management panel in the Azure Machine Learning studio that helps you manage your active sessions and optimize the performance of your compute instance. You can navigate to this session management panel from the compute toolbar of either a terminal tab or a notebook tab.

> [!NOTE]
> For optimal performance, we recommend you don’t keep more than six active sessions - and the fewer the better.

:::image type="content" source="media/how-to-manage-compute-sessions/compute-session-management-panel.png" alt-text="Screenshot of compute session management panel.":::

## Notebook sessions

In the session management panel, you can select a linked notebook name in the notebook sessions section to re-open a notebook with its previous state.

Notebook sessions are kept active when you close a notebook tab in the Azure Machine Learning studio. So, when you re-open a notebook you will have access to previously-defined variables and execution state - in this case, you are benefitting from the active notebook session.

However, keeping too many active notebook sessions can slow down the performance of your compute. So, you should use the session management panel to shut down any notebook sessions you no longer need.

Select **Manage active sessions** in the terminal toolbar to open the session management panel and shut down the sessions you no longer need. You can see below that the icon shows the count of active notebook sessions.

:::image type="content" source="media/how-to-manage-compute-sessions/notebook-sessions-button.png" alt-text="Screenshot of notebooks sessions button in toolbar.":::

## Terminal sessions

In the session management panel, you can click on a terminal link to re-open a terminal tab connected to that previous terminal session.

In contrast to notebook sessions, terminal sessions are terminated when you close a terminal tab. However, if you navigate away from the Azure Machine Learning studio without closing a terminal tab, the session may remain open. You should be shut down any terminal sessions you no longer need by using the session management panel.

Select **Manage active sessions** in the terminal toolbar to open the session management panel and shut down the sessions you no longer need. You can see below that the icon shows the count of active terminal sessions.

:::image type="content" source="media/how-to-manage-compute-sessions/terminal-sessions-button.png" alt-text="Screenshot of terminal sessions button in toolbar.":::
