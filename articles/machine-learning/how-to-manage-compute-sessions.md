---
title: How to manage compute sessions
titleSuffix: Azure Machine Learning
description: Use the session management panel to manage the active notebook and terminal sessions running on a compute instance.
services: machine-learning
author: lebaro-msft
ms.author: lebaro
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: compute
ms.topic: how-to
ms.date: 1/18/2023
# Customer intent: As a data scientist, I want to manage the notebook and terminal sessions on my compute instance for optimal performance.
---

# Manage notebook and terminal sessions

Notebook and terminal sessions run on the compute and maintain your current working state.

When you reopen a notebook, or reconnect to a terminal session, you can reconnect to the previous session state (including command history, execution history, and defined variables). However, too many active sessions may slow down the performance of your compute. With too many active sessions, you may find your terminal or notebook cell typing lags, or terminal or notebook command execution may feel slower than expected.

Use the session management panel in Azure Machine Learning studio to help you manage your active sessions and optimize the performance of your compute instance. Navigate to this session management panel from the compute toolbar of either a terminal tab or a notebook tab.

> [!NOTE]
> For optimal performance, we recommend you don’t keep more than six active sessions - and the fewer the better.

:::image type="content" source="media/how-to-manage-compute-sessions/compute-session-management-panel.png" alt-text="Screenshot of compute session management panel." lightbox="media/how-to-manage-compute-sessions/compute-session-management-panel.png":::

## Notebook sessions

In the session management panel, select a linked notebook name in the notebook sessions section to reopen a notebook with its previous state.

Notebook sessions are kept active when you close a notebook tab in the Azure Machine Learning studio. So, when you reopen a notebook you'll have access to previously defined variables and execution state - in this case, you're benefitting from the active notebook session.

However, keeping too many active notebook sessions can slow down the performance of your compute. So, you should use the session management panel to shut down any notebook sessions you no longer need.

Select **Manage active sessions** in the terminal toolbar to open the session management panel and shut down the sessions you no longer need. In the following image, you can see that the tooltip shows the count of active notebook sessions.

:::image type="content" source="media/how-to-manage-compute-sessions/notebook-sessions-button.png" alt-text="Screenshot of notebooks sessions button in toolbar." lightbox="media/how-to-manage-compute-sessions/notebook-sessions-button.png":::

## Terminal sessions

In the session management panel, you can select on a terminal link to reopen a terminal tab connected to that previous terminal session.

In contrast to notebook sessions, terminal sessions are terminated when you close a terminal tab. However, if you navigate away from the Azure Machine Learning studio without closing a terminal tab, the session may remain open. You should be shut down any terminal sessions you no longer need by using the session management panel.

Select **Manage active sessions** in the terminal toolbar to open the session management panel and shut down the sessions you no longer need. In the following image, you can see that the tooltip shows the count of active terminal sessions.

:::image type="content" source="media/how-to-manage-compute-sessions/terminal-sessions-button.png" alt-text="Screenshot of terminal sessions button in toolbar." lightbox="media/how-to-manage-compute-sessions/terminal-sessions-button.png":::

## Next steps

* [How to create and manage files in your workspace](how-to-manage-files.md)
* [Run Jupyter notebooks in your workspace](how-to-run-jupyter-notebooks.md)
* [Access a compute instance terminal in your workspace](how-to-access-terminal.md)
