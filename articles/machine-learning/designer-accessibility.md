---
title: Use accessibility features in the designer
titleSuffix: Azure Machine Learning
description: Learn about the keyboard shortcuts and screen reader accessibility features available in the designer.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 01/09/2020
ms.custom: designer
---

# Use a keyboard to use Azure Machine Learning designer

Learn how to use a keyboard and screen reader to use Azure Machine Learning designer. For a list of keyboard shortcuts that work everywhere in the Azure portal, see [Keyboard shortcuts in the Azure portal](../azure-portal/azure-portal-keyboard-shortcuts.md)

This workflow has been tested with [Narrator](https://support.microsoft.com/help/22798/windows-10-complete-guide-to-narrator) and [JAWS](https://www.freedomscientific.com/products/software/jaws/), but it should work with other standard screen readers.

## Navigate the pipeline graph

The pipeline graph is organized as a nested list. The outer list is a component list, which describes all the components in the pipeline graph. The inner list is a connection list, which describes input/output ports and details for a specific component connection. 

The following keyboard actions help you navigate a pipeline graph: 

- Tab: Move to first node > each port of the node > next node.
- Up/down arrow keys: Move to next or previous node by its position in the graph.
- Ctrl+G when focus is on a port: Go to the connected port. When there's more than one connection from one port, open a list view to select the target. Use the Esc key to go to the selected target.
- Ctrl + Shift + H to focus on the canvas.

## Edit the pipeline graph

### Add a component to the graph

1. Use Ctrl+F6 to switch focus from the canvas to the component tree.
1. Find the desired component in the component tree using standard treeview control.

### Connect a component to another component

1. Use the Tab key to move focus to a port. 
   
   The screen reader reads the port information, which includes whether this port is a valid source port to set a connection to other components.   

1. If the current port is a valid source port, press access key + C to start connecting. This command sets this port as the connection source. 
1. Using the Tab key, move focus through every available destination port.
1. To use the current port as the destination port and set up the connection, press Enter. 
1. To cancel the connection, press Esc. 

### Edit setting of a component

- Use access key + A to open the component setting panel. Then, use the Tab key to move focus to the setting panel, where you can edit the settings. 

## Navigation shortcuts

| Keystroke | Description |
|-|-|
| Ctrl + F6 | Toggle focus between canvas and component tree |
| Ctrl + F1   | Open the information card when focusing on a node in component tree |
| Ctrl + Shift + H | Open the connection helper when focus is on a node |
| Ctrl + Shift + E | Open component properties when focus is on a node |
| Ctrl + G | Move focus to first failed node if the pipeline run failed |

## Action shortcuts

Use the following shortcuts with the access key. For more information on access keys, see https://en.wikipedia.org/wiki/Access_key.

| Keystroke | Action |
|-|-|
| Access key + R | Run |
| Access key + P | Publish |
| Access key + C | Clone |
| Access key + D | Deploy |
| Access key + I | Create/update inference pipeline |
| Access key + B | Create/update batch inference pipeline |
| Access key + K | Open "Create inference pipeline" dropdown |
| Access key + U | Open "Update inference pipeline" dropdown |
| Access key + M | Open more(...) dropdown |
| Access key + A | Open component settings |

## Next steps

- [Turn on high contrast or change theme](../azure-portal/set-preferences.md#choose-a-theme-or-enable-high-contrast)
- [Accessibility related tools at Microsoft](https://www.microsoft.com/accessibility)
