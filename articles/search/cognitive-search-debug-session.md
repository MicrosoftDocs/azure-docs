---
title: Debug Sessions concepts
titleSuffix: Azure AI Search
description: Debug Sessions, accessed through the Azure portal, provides an IDE-like environment where you can identify and fix errors, validate changes, and push changes to skillsets in an enrichment pipeline.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/29/2023
---

# Debug Sessions in Azure AI Search

Debug Sessions is a visual editor that works with an existing skillset in the Azure portal, exposing the structure and content of a single enriched document, as it's produced by an indexer and skillset for the duration of the session. Because you're working with a live document, the session is interactive - you can identify errors, modify and invoke skill execution, and validate the results in real time. If your changes resolve the problem, you can commit them to a published skillset to apply the fixes globally.

## How a debug session works

When you start a session, the search service creates a copy of the skillset, indexer, and a data source containing a single document used to test the skillset. All session state is saved to a new blob container created by the Azure AI Search service in an Azure Storage account that you provide. The name of the generated container has a prefix of "ms-az-cognitive-search-debugsession". The prefix is required because it mitigates the chance of accidentally exporting session data to another container in your account. 

A cached copy of the enriched document and skillset is loaded into the visual editor so that you can inspect the content and metadata of the enriched document, with the ability to check each document node and edit any aspect of the skillset definition. Any changes made within the session are cached. Those changes will not affect the published skillset unless you commit them. Committing changes will overwrite the production skillset.

If the enrichment pipeline does not have any errors, a debug session can be used to incrementally enrich a document, test and validate each change before committing the changes.

## Managing the Debug Session state

You can rerun a debug session using the **Start** button, or cancel an in-progress session using the **Cancel** button.

:::image type="content" source="media/cognitive-search-debug/debug-session-commands.png" alt-text="Screenshot of the Debug Session control buttons." border="true":::

## AI Enrichments tab > Skill Graph

The visual editor is organized into tabs and panes. This section introduces the components of the visual editor.

The **Skill Graph** provides a visual hierarchy of the skillset and its order of execution from top to bottom. Skills that are dependent upon the output of other skills are positioned lower in the graph. Skills at the same level in the hierarchy can execute in parallel. Color coded labels of skills in the graph indicate the types of skills that are being executed in the skillset (TEXT or VISION).

Selecting a skill in the graph will display the details of that instance of the skill in the right pane, including its definition, errors or warnings, and execution history. The **Skill Graph** is where you will select which skill to debug or enhance. The details pane to the right is where you edit and explore.

:::image type="content" source="media/cognitive-search-debug/skills-graph.png" alt-text="Screenshot of Skills Graph tab." border="true":::

### Skill details pane

When you select an object in the **Skill Graph**, the adjacent pane provides interactive work areas in a tabbed layout. An illustration of the details pane can be found in the previous screenshot.

Skill details include the following areas:

+ **Skill Settings** shows a formatted version of the skill definition.
+ **Skill JSON Editor** shows the raw JSON document of the definition.
+ **Executions** shows the data corresponding to each time a skill was executed.
+ **Errors and warnings** shows the messages generated upon session start or refresh.

On Executions or Skill Settings, select the **`</>`** symbol to open the [**Expression Evaluator**](#expression-evaluator) used for viewing and editing the expressions of the skills inputs and outputs.

Nested input controls in Skill Settings can be used to build complex shapes for [projections](knowledge-store-projection-overview.md), [output field mappings](cognitive-search-output-field-mapping.md) for a complex type field, or an input to a skill. When used with the Expression Evaluator, nested inputs provide an easy test and validate expression builder.

### Executions pane

A skill can execute multiple times in a skillset for a single document. For example, the OCR skill will execute once for each image extracted from a single document. The Executions pane displays the skill's execution history providing a deeper look into each invocation of the skill. 

The execution history enables tracking a specific enrichment back to the skill that generated it. Clicking on a skill input navigates to the skill that generated that input, providing a stack-trace like feature. This allows identification of the root cause of a problem that might manifest in a downstream skill. 

When you debug an error with a custom skill, there is the option to generate a request for a skill invocation in the execution history.

## AI Enrichments tab > Enriched Data Structure

The **Enriched Data Structure** pane shows the document's enrichments through the skillset, detailing the context for each enrichment and the originating skill. The Expression Evaluator can also be used to view the contents for each enrichment.

> :::image type="content" source="media/cognitive-search-debug/enriched-data-structure-display.png" alt-text="Screenshot of Enriched Data Structure tab.":::

## Expression Evaluator

**Expression Evaluator** gives a quick peek into the value of any path. It allows for editing the path and testing the results before updating any of the inputs or context for a skill or projection.

You can open the window from any node or element that shows the **`</>`** symbol, including parts of a dependency graph or nodes in an enrichment tree.

Expression Evaluator gives you full interactive access for testing skill context, inputs, and checking outputs.

:::image type="content" source="media/cognitive-search-debug/expression-evaluator.png" alt-text="Screenshot of Expression Evaluator.":::

## Next steps

Now that you understand the elements of debug sessions, start your first debug session on an existing skillset.

> [!div class="nextstepaction"]
> [How to debug a skillset](cognitive-search-how-to-debug-skillset.md)
