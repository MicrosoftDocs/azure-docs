---  
title: AI-assisted custom graph authoring in Microsoft Sentinel (preview)
titleSuffix: Microsoft Security  
description: Use AI assistance in Visual Studio Code to create, modify, and query custom security graphs using Jupyter notebooks and GitHub Copilot.
author: EdB-MSFT  
ms.service: microsoft-sentinel
ms.subservice: sentinel-platform  
ms.topic: how-to
ms.date: 03/23/2026
ms.author: edbaynash  
ms.collection: ms-security  

#customer intent: As a security engineer, I want to use AI assistance to create and modify custom security graphs so that I can efficiently model and analyze complex security relationships.
---  

# AI-assisted custom graph authoring in Microsoft Sentinel (preview)

Use GitHub Copilot in Visual Studio Code with Microsoft Sentinel to create, modify, and query custom security graphs using Jupyter notebooks. Describe what you want to build in natural language, review the generated notebook, and refine it as needed.

Use Copilot for various graph authoring tasks, including:
- Create a complete graph authoring notebook from a description
- Modify or debug an existing graph
- Understand generated graph code
- Write and run graph queries


## How AI assistance works for custom graphs

When you work in a Jupyter notebook connected to Microsoft Sentinel, GitHub Copilot can help with graph authoring tasks using natural-language prompts.

Use the following workflow to interact with Copilot for graph authoring:

1. Describe the graph or change you want to make.
1. Copilot generates or updates graph-related code.
1. You review, run, and iterate on the results.

For graph-specific scenarios, Microsoft Sentinel provides optional helpers that give Copilot additional context about graph APIs, schemas, and your workspace. These helpers improve accuracy and consistency but aren't required to use Copilot assistance.

## Prerequisites

Before you begin, make sure you have:

- **The Microsoft Sentinel extension for Visual Studio Code** installed and signed in. For more information, see [Run notebooks on the Microsoft Sentinel data lake](notebooks.md).
- **The Jupyter extension for Visual Studio Code** installed. Download from the [VS Code Extensions Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter).
- **GitHub Copilot** installed and enabled. For more information, see [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot).
- **GitHub Copilot Business or Copilot Enterprise plan**, see [GitHub Copilot plans](https://github.com/features/copilot#pricing)
- **A Microsoft Sentinel data lake** configured with appropriate permissions. For more information, see [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md).

## Create and edit a custom graph with Copilot

Use the following steps to create a new graph or modify an existing one using GitHub Copilot:

1. Open an existing Jupyter notebook (`.ipynb`), or allow Copilot to create one.

1. Open GitHub Copilot Chat (**Ctrl+Shift+I** on Windows, **Cmd+Shift+I** on macOS).

1. Describe the graph you want to build.

For best results when creating or modifying a full graph, use the Sentinel graph authoring helper by including `@sentinel /graph-authoring` in your prompt. This provides Copilot with additional context about graph APIs, schemas, and best practices.

```text
@sentinel /graph-authoring Create a graph that maps email senders to recipients and URLs using EmailEvents
```

The assistant generates a complete notebook that follows the standard graph authoring lifecycle:

| Step | Description |
|---|---|
| Environment setup | Verifies required packages and connection information |
| Data loading | Reads tables from the Sentinel data lake |
| Data transformation | Prepares node and edge data |
| Graph schema | Defines nodes and edges |
| Schema validation | Validates the graph definition |
| Graph build | Materializes the graph |
| Graph query | Runs graph queries |

### Refine the graph

Once the graph is created, you can continue the conversation to refine it, for example:

```text
@sentinel Add an edge from User to IPAddress
```

```text
@sentinel Filter the data to show only failed sign-ins
```


## Modify or debug an existing graph

Ask Copilot to update or fix specific parts of your notebook. For example:

```text
@sentinel Change the time range to the last 7 days
```

```text
@sentinel Update cell 3 to include the Subject column
```

```text
@sentinel Fix the error in the graph build step
```

Only the affected cells are updated. Other cells remain unchanged.

## Understand graph code and queries

Ask questions about the generated code without changing the notebook. For example:

```text
@sentinel What does show_schema() do?
```

```text
@sentinel Explain how edge keys are defined
```

```text
@sentinel How does this graph query work?
```

## Look up graph APIs and examples

If you want help with Sentinel graph APIs, method parameters, or example queries, you can ask Copilot for explanations. For more accurate, Sentinel-specific answers, include the `#Sentinel` reference helper in your prompt. For example:

```text
What parameters does build_graph_with_data() accept? #sentinel
```

```text
Write a graph query to find all paths between User and IPAddress #sentinel
```

This helper provides Copilot with authoritative Sentinel graph API documentation. It doesn't modify your notebook.

## Choose how to interact with Copilot

Use the following table to choose the best way to interact with Copilot based on your goal:

| What you want to do | Recommended approach |
|---|---|
| Create or modify a graph notebook | Describe your goal (use `@sentinel` for best results) |
| Fix or debug a graph error | Describe the problem (use `@sentinel`) |
| Ask about graph APIs or parameters | Ask a question (include `#sentinel`) |
| Ask a general question | Plain Copilot prompt |

## Key concepts

### Workspace and table availability

AI assistance uses the tables visible in your Sentinel data lake. Only tables you have access to are used in generated code.

> [!IMPORTANT]
> If a table doesn't appear in the data lake explorer, it can't be used for graph authoring.

### Notebook changes

When modifying a notebook, only the cells that need to change are updated. You can undo changes using standard editor undo commands.

## Troubleshooting
 
| Issue | Resolution |
|---|---|
| No notebook is open | Open or create a `.ipynb` file before starting graph authoring. |
| Tables are missing | Verify that your Sentinel data lake is connected and the expected tables appear in the data lake explorer. |
| Required packages are missing | Ensure your notebook is connected to a supported Sentinel Spark compute pool. |
| An unexpected cell was modified | Undo the change and retry the request, specifying the cell number. |

## Related content

- [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- [Microsoft Sentinel Provider class reference](sentinel-provider-class-reference.md)
- [Sample notebooks for Microsoft Sentinel data lake](notebook-examples.md)
- [Run notebooks on the Microsoft Sentinel data lake](notebooks.md)
- [What is Microsoft Sentinel graph?](sentinel-graph-overview.md)
