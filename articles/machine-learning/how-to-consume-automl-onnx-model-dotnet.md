---
title: Use an Automated ML ONNX model in .NET
description: Learn how to make make predictions using an Automated ML ONNX model in .NET with ML.NET
author: luisquintanilla
ms.author: luquinta
ms.date: 10/23/2020
ms.topic: conceptual


# Use ms.service for services or ms.prod for on-prem products. Remove the # before the relevant field.
# ms.service: service-name-from-white-list
# ms.prod: product-name-from-white-list

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Make predictions with an Automated ML ONNX model in .NET

In this article, you learn how to use an Automated ML ONNX model to make predictions in a .NET console application with ML.NET.

[ML.NET](https://docs.microsoft.com/dotnet/machine-learning/) is an open-source, cross-platform, machine learning framework for the .NET ecosystem that allows you to train and consume custom machine learning models using a code-first approach in C# or F# as well as through low-code tooling like [Model Builder](https://docs.microsoft.com/dotnet/machine-learning/automate-training-with-model-builder) and the [ML.NET CLI](https://docs.microsoft.com/dotnet/machine-learning/automate-training-with-cli). The framework is also extensible and allows you to leverage other popular machine learning frameworks like TensorFlow and ONNX.

The Open Neural Network Exchange (ONNX) is an open source format for AI models. ONNX supports interoperability between frameworks. This means you can train a model in one of the many popular machine learning frameworks like PyTorch, convert it into ONNX format and consume the ONNX model in a different framework like ML.NET. To learn more, visit the [ONNX website](https://onnx.ai/).

## Prerequisites

- .NET Core SDK 3.1
- Text Editor

## Create C# console application

