---
title: "Azure Kubernetes Service (AKS) data connector for Microsoft Sentinel"
description: "Learn how to install the Azure Kubernetes Service (AKS) data connector for Microsoft Sentinel to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 11/14/2022
ms.service: microsoft-sentinel
ms.author: cwatson
ms.custom: miss-api-catalog
---

# Azure Kubernetes Service (AKS) data connector for Microsoft Sentinel

The Azure Kubernetes Services (AKS) solution allows you to ingest AKS activity logs using Diagnostic Setting into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections, managed by Azure Policy](connect-azure-windows-microsoft-services.md?tabs=AP#diagnostic-settings-based-connections)** |
| **Log Analytics table(s)** | kube-apiserver<br>kube-audit<br>kube-audit-admin<br>kube-controller-manager<br>kube-scheduler<br>cluster-autoscaler<br>guard |
| **DCR support** | Not currently supported |
| **Supported by** | Microsoft |