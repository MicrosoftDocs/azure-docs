---
title: Use accesibility features in the designer (preview)
titleSuffix: Azure Machine Learning
description: Learn about the screen reader accessibility features available in the designer.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: peterlu
author: peterclu
ms.date: 01/09/2020

---

# Use a screen reader to explore and navigate designer

This article is for people with visual impairments who use a screen reader. Use designer with your keyboard and a screen reader to read and edit designer pipelines. We have tested it with Narrator and JAWS, but it might work with other screen readers as long as they follow common accessibility standards and techniques.

## Drag and drop graph

Designer provides a drag-n-drop experience to train and deploy machine learning models. It lets you visually connect datasets and modules on an interactive canvas. 

###  Navigate the graph
The pipeline graph is described as two level list. The fist level list describes all the nodes of a graph. The second level list describes the connection to other nodes of a specific node. Screen reader user can navigate the graph by:

1.	Use arrow key to switch nodes in the first level node list.
2.	After select a specific node, use tab to select connection ports of the node.
3.	Use arrow key to switch between ports of a node
4.	When s port is selected, use “g” key to go to the target node. Then start from 1 to navigate the graph.


### Edit the graph

If screen reader user want to add a new node to the graph, ha can use Ctrl+F6 to switch focus from canvas to module tree and find a wanted node in the module tree. Module tree is a standard treeview control. 

If screens reader user want to connect a node to another one, he can use Ctrl + Shift + H when select a node to open the connection helper. The connection helper will list all the available nodes and connection ports. 


## Short cuts 

Following short cuts are used for easier keyboard access to designer. 

**Short cuts for navigation & edit** garph

| short cut       | Description |
| ----------- | ----------- |
| Ctrl + F6   | Switch focus between canvas and module tree|
| Ctrl + F1   | Open information card when focus on a node in module tree (same as hover by mouse)|
|Ctrl + Shift + H|Open connection helper to connect nodes when focus is on a node|
|Ctrl + Shift + E|Open module panel to set module properties when focus is on a node|
|Ctrl + G|Move focus to first failed node if pipeline run failed|


**Short cuts for frequent actions**

Below short cuts are implemented through access key, check https://en.wikipedia.org/wiki/Access_key to learn more about access keys.

| Access key      | Action |
| ----------- | ----------- |
| Run      | R       |
| Publish   | P      |
|Clone|C|
|Deploy|D|
|Create/update inference pipeline|I|
|Create/update batch inference pipeline|B|
|Open "Create inference pipeline" dropdown |K|
|Open "Update inference pipeline" dropdown| U|
|Open more(...) dropdown|M|
