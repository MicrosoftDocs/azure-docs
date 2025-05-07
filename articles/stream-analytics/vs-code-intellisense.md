---
title: IntelliSense in Azure Stream Analytics tools for Visual Studio Code
description: This article describes how to use IntelliSense features in Azure Stream Analytics tools for Visual Studio Code.
ms.service: azure-stream-analytics
author: alexlzx
ms.author: zhenxilin
ms.date: 12/27/2022
ms.topic: how-to
---
# IntelliSense in Azure Stream Analytics tools for Visual Studio Code

IntelliSense is available for [Stream Analytics Query Language](/stream-analytics-query/stream-analytics-query-language-reference?toc=/azure/stream-analytics/toc.json) in [Azure Stream Analytics (ASA) tools for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-bigdatatools.vscode-asa&ssr=false#overview). IntelliSense is a code-completion aid that includes many features: List Members, Parameter Info, Quick Info, and Complete Word. IntelliSense features are sometimes called by other names such as "code completion", "content assist", and "code hinting".

![IntelliSense demo](./media/vs-code-intellisense/intellisense.gif)

## IntelliSense features

The ASA Tools extension for VS Code has IntelliSense feature that is powered by a language service. The language service analyzes your source code and provides intelligent code completions based on language semantics. If a language service knows possible completions, it will show the IntelliSense suggestions as you write the code. If you continue typing, a list of members, such as variables and methods, is filtered to only include members that contain the characters you typed. When you press the `Tab` or `Enter` keys, IntelliSense inserts the member you selected.

You can trigger IntelliSense in any editor window by typing a trigger character, such as the dot character `.`.

![intellisense autocompletion](./media/vs-code-intellisense/auto-completion.gif)

> [!TIP]
> The suggestions widget supports CamelCase filtering. You can type the letters which are uppercased in a method name to limit the suggestions. For example, "cra" will quickly bring up "createApplication".

### Types of completions

The VS Code IntelliSense provides different types of completions, including language server suggestions, snippets, and simple word-based textual completions.

|Completion     |  Type       |
| ----- | ------- |
| Keywords | `keyword`
| Functions | `build-in function`, `user defined function`  |
| Data Set Name| `input`, `output`, `intermediate result set`|
| Data Set Column Name|`input`, `intermediate result set`|

#### Name completion

Aside from keyword auto-completion, the ASA Tools extension is able to read the input and output names for your Stream Analytics job and the column names of your data sources. The extension remembers this information to provide name completion capabilities that are useful for entering statements with few keystrokes:

While coding, you don't need to leave the editor to perform searches on job input names, output name, and column names. You can keep your context, find the information you need, insert elements directly into your code, and have IntelliSense complete your typing for you.

Note that you need to configure local input or live input and then save the configuration file in order to use name completion.

![name completion](./media/vs-code-intellisense/name-completion.gif)

### Parameter Info

The IntelliSense **Parameter Info** option opens a parameters list that provides information about the number, names, and types of the parameters that are required by a function. The parameter in bold indicates the next parameter that is required as you type a function.

The parameter list is also displayed for nested functions. If you type a function as a parameter to another function, the parameter list displays the parameters for the inner function. Then, when the inner function parameter list is complete, the parameter list reverts to displaying the outer function parameters.

![parameter info](./media/vs-code-intellisense/parameter-info.gif)

### Quick Info

As provided by the language service, you can see **Quick Info** for each identifier in your code. Some examples of identifiers are input, output, an intermediate result set, or function. When you move the mouse pointer over an identifier, its declaration is displayed in a pop-up window. The properties and data schemas for inputs, if configured, and intermediate data set are shown.

![quick info](./media/vs-code-intellisense/quick-info.gif)

## Troubleshoot IntelliSense

This issue is caused by missing input configuration. You can check if a [local input](visual-studio-code-local-run.md#define-a-local-input) or [live input](visual-studio-code-local-run-live-input.md#define-a-live-stream-input) has been configured correctly.

## Next steps

* [Quickstart: Create an Azure Stream Analytics job in Visual Studio Code](quick-create-visual-studio-code.md)
* [Test Stream Analytics queries locally with sample data using Visual Studio Code](visual-studio-code-local-run.md)
* [Test Stream Analytics queries locally against live stream input by using Visual Studio Code](visual-studio-code-local-run-live-input.md)
