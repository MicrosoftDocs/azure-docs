---
title: Use accessibility features in the designer
titleSuffix: Azure Machine Learning
description: Learn about the keyboard shortcuts and screen reader accessibility features available in the designer.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: peterlu
author: peterclu
ms.date: 01/09/2020
---

# Use a keyboard to use Azure Machine Learning designer

Learn how to use a keyboard and screen reader to use Azure Machine Learning designer. For a list of keyboard shortcuts that work everywhere in the Azure portal, see [Keyboard shortcuts in the Azure portal](../azure-portal/azure-portal-keyboard-shortcuts.md)

This workflow has been tested with [Narrator](https://support.microsoft.com/help/22798/windows-10-complete-guide-to-narrator) and [JAWS](https://www.freedomscientific.com/products/software/jaws/), but it should work with other standard screen readers.

## Navigate the pipeline graph

The pipeline graph is organized as a list of lists. The top-level module list contains all of the module in the pipeline. Each item in the module list contains a connection list that describes all of its connections. 

1. In the module list, use the arrow key to switch modules.
1. Use tab to open the connection list for the target module.
1. Use arrow key to switch between the connection ports for the module.
1. Use “G” to go to the target module.

## Edit the pipeline graph

### Add a module to the graph

1. Use Ctrl+F6 to switch focus from the canvas to the module tree.
1. Find the desired module in the module tree using standard treeview control.

### Edit a module

To connect a module to another module:

1. Use Ctrl + Shift + H when targeting a module in the module list to open the connection helper.
1. Edit the connection ports for the module.

To adjust module properties:

1. Use Ctrl + Shift + E when targeting a module to open the module properties.
1. Edit the module properties.

## Navigation shortcuts

| Keystroke | Description |
|-|-|
| Ctrl + F6 | Toggle focus between canvas and module tree |
| Ctrl + F1   | Open the information card when focusing on a node in module tree |
| Ctrl + Shift + H | Open the connection helper when focus is on a node |
| Ctrl + Shift + E | Open module properties when focus is on a node |
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

- [Turn on high contrast or change theme](../azure-portal/azure-portal-change-theme-high-contrast.md)
- [Accessibility related tools at Microsoft](https://www.microsoft.com/accessibility)
