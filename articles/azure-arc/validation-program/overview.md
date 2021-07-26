---
title: Azure Arc-enabled services validation overview
description: Explains the Azure Arc validation process to conform to the Arc-enabled Kubernetes, Data Services, and cluster extensions.
ms.date: 07/19/2021
ms.topic: overview
---

# Overview of Azure Arc-enabled service validation

Microsoft recommends running Azure Arc-enabled services on validated platforms. This article points you to content to explain how various Azure Arc-enabled components are validated. 

Currently, validated solutions are available from partners for Kubernetes and data services.

## Validation program

The Azure Arc validation program is available in GitHub. To find out more details on how to validate your offering with Azure Arc, the test harness and strategy, please refer to the [Azure Arc validation program](https://github.com/Azure/azure-arc-validation/) in GitHub.

## Kubernetes

Azure Arc-enabled Kubernetes works with any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters. The Azure Arc team has worked with key industry Kubernetes offering providers to validate Azure Arc-enabled Kubernetes with their [Kubernetes distributions](../kubernetes/validation-program.md). Future major and minor versions of Kubernetes distributions released by these providers will be validated for compatibility with Azure Arc enabled Kubernetes.

## Data services

We have also partnered with original equipment manufacturer (OEM) partners and storage providers to validate [Azure Arc-enabled data services](../data/validation-program.md) solutions.

## Next steps

* [Validated Kubernetes distributions](validated-k8s-distributions.md)

* [Validated Kubernetes distributions for data services](../data/validation-program.md?toc=/azure/azure-arc/toc.json&bc=/azure/azure-arc/breadcrumb/toc.json)
