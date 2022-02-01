---
title: Create a managed identity
titleSuffix: Azure Cognitive Search
description: Create a managed identity for your search service for Azure Active Directory authentication to other cloud services.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 02/01/2022
---

# Create a managed identity for your search service

If you use Azure Active Directory (Azure AD) for authorized access to Azure resources, you can enable a system-managed or user-managed identity on your search service. 

A search service in Cognitive Search cane use a system-managed identity for these connections:

+ Azure data sources (applies to indexers)
+ Key vault
+ Knowledge Store
+ Enrichment cache
+ Custom skills

## Prerequisites

+ Azure Active Directory

+ An Azure resource in the same tenant as Cognitive Search

## Create a system-managed identity

You can create one system-managed identity for each search service.

## Create a user-assigned managed identity (preview)

TBD

## See also

TBD
