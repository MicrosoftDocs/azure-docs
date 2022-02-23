---
title: Use accessibility features in the designer
titleSuffix: Azure Machine Learning
description: Learn about the keyboard shortcuts and screen reader accessibility features available in the designer.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: lagayhar
author: lgayhardt
ms.date: 01/09/2020
ms.custom: designer
---

# Use a keyboard to use Azure Machine Learning designer

Learn how to use a keyboard and screen reader to use Azure Machine Learning designer. For a list of keyboard shortcuts that work everywhere in the Azure portal, see [Keyboard shortcuts in the Azure portal](../azure-portal/azure-portal-keyboard-shortcuts.md)

This workflow has been tested with [Narrator](https://support.microsoft.com/help/22798/windows-10-complete-guide-to-narrator) and [JAWS](https://www.freedomscientific.com/products/software/jaws/), but it should work with other standard screen readers.

## Navigate the pipeline graph

The pipeline graph is organized as a nested list. The outer list is a component list, which describes all the components in the pipeline graph. The inner list is a connection list, which describes input/output ports of a specific component connection details. The following keyboard actions help you to navigate a pipeline graph. 

1. Tab: navigate to first node -> each port of the node -> next node
2. Up/down arrow key: to next/previous node by it's position in the graph
3. Ctrl + g when focus on a port:  go to the connected port. When there are more than one connection from one port, open a list view to select the target. Use "Esc" to go to the selected target.

## Edit the pipeline graph

### Add a component to the graph

1. Use Ctrl+F6 to switch focus from the canvas to the component tree.
1. Find the desired component in the component tree using standard treeview control.

### Edit a component

#### To connect a component to another component:

1. 
2. Use Ctrl + Shift + H when targeting a component in the component list to open the connection helper.
3. Edit the connection ports for the component.

#### To adjust component properties:

1. User can move focus to a port with tab key as mentioned above
2. Screen reader will read the port information. The information contains whether this port is a valid source port to set connection to other components. 
3. If the current port is a valid source port, user can use short cut (accessKey + c) to start connecting. This command will set this port as connection source. 
4. Then use "tab" key, user can move focus through every available destination port.
5. Press "enter" will use current port as the destination port and set up the connection. 
6. Press "esc" key will cancel the connecting. 


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

## Next steps

- [Turn on high contrast or change theme](../azure-portal/set-preferences.md#choose-a-theme-or-enable-high-contrast)
- [Accessibility related tools at Microsoft](https://www.microsoft.com/accessibility)
