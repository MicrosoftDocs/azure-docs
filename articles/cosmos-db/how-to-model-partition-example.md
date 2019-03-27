---
title: How to model and partition a real-world example
description: Learn how to model and partition a real-world example using the Azure Cosmos DB Core API
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: sample
ms.date: 3/27/2019
ms.author: thweiss
---

# How to model and partition a real-world example

This article builds on several Azure Cosmos DB concepts like [data modeling](modeling-data.md), [partitioning](partitioning-overview.md) and [provisioned throughput](request-units.md) to demonstrate how to tackle a real-world data design exercise.

If you come from a relational background and usually work with relational databases, you have probably built habits and intuitions on how to design a data model. Because of the specific constraints, but also the unique strengths of Azure Cosmos DB, most of those best practices don't translate well and may drag you into sub-optimal solutions. The goal of this article is to guide you through the complete process of modeling a real-world use-case on Azure Cosmos DB, from item modeling to entity co-location and container partitioning.

## The domain

## Start by identifying the main access patterns

## V1: A first version

## V2: Introducing denormalization to optimize read queries

## V3: Making sure all requests are scalable

## Our final design

## Conclusion