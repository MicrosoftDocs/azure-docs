---
title: Azure Arc-enabled services validation overview
description: Explains the Azure Arc validation process to conform to the Azure Arc-enabled Kubernetes, Data Services, and cluster extensions.
ms.date: 01/08/2024
ms.topic: overview
---

# Overview of Azure Arc-enabled service validation

Microsoft recommends running Azure Arc-enabled services on validated platforms whenever possible. This article explains how various Azure Arc-enabled components are validated.

Currently, validated solutions are available from partners for [Azure Arc-enabled Kubernetes](../kubernetes/overview.md) and [Azure Arc-enabled data services](../data/overview.md).

## Validated Azure Arc-enabled Kubernetes distributions

Azure Arc-enabled Kubernetes works with any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters. The Azure Arc team worked with key industry Kubernetes offering providers to [validate Azure Arc-enabled Kubernetes with their Kubernetes distributions](../kubernetes/validation-program.md?toc=/azure/azure-arc/toc.json&bc=/azure/azure-arc/breadcrumb/toc.json). Future major and minor versions of Kubernetes distributions released by these providers will be validated for compatibility with Azure Arc-enabled Kubernetes.

## Validated data services solutions

The Azure Arc team worked with original equipment manufacturer (OEM) partners and storage providers to [validate Azure Arc-enabled data services solutions](../data/validation-program.md?toc=/azure/azure-arc/toc.json&bc=/azure/azure-arc/breadcrumb/toc.json). This includes partner solutions, versions, Kubernetes versions, SQL engine versions, and PostgreSQL server versions that have been verified to support the data services.

## Validation process

For more details about the validation process, see the [Azure Arc validation process](https://github.com/Azure/azure-arc-validation/) in GitHub. Here you find information about how offerings are validated with Azure Arc, the test harness, strategy, and more.

## Next steps

* Learn about [Validated Kubernetes distributions](../kubernetes/validation-program.md?toc=/azure/azure-arc/toc.json&bc=/azure/azure-arc/breadcrumb/toc.json)
* Learn about [validated solutions for data services](../data/validation-program.md?toc=/azure/azure-arc/toc.json&bc=/azure/azure-arc/breadcrumb/toc.json)
