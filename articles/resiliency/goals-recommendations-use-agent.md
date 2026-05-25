---
title: Use the Resiliency agent in Infrastructure Resiliency Manager
description: Learn how to use the Resiliency agent to get conversational AI guidance for resiliency improvements in Infrastructure Resiliency Manager (preview).
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 06/02/2026
ms.topic: how-to
ms.service: resiliency
#customer intent: As a cloud administrator, I want to use the Resiliency agent so that I can get conversational guidance for improving my application's zone resiliency.
---

# Use the Resiliency agent in Infrastructure Resiliency Manager (preview)

The Resiliency agent is a conversational AI experience integrated into Azure Copilot that provides guided resiliency improvements for your applications. This article describes how to use Resiliency agent in Infrastructure Resiliency Manager (preview).

## Prerequisites

- Tenant must be allowlisted for the Resiliency agent. To request access, [fill out this form](https://aka.ms/azurecopilot/agents/feedbackprogram).
- **Agents (Preview)** must be enabled in the Azure Copilot admin center:
  1. Go to **Azure Copilot admin center** > **Settings** > **Access management**.
  2. Toggle **Agents (Preview)** to **On**.

## Start Resilient for greenfield applications

Use the Resiliency agent to design new applications with resiliency best practices from the start.

### Get recommendations from a natural language description

Describe your application architecture to the agent. The agent evaluates your description and suggests resiliency improvements.

### Generate Infrastructure as Code (IaC) templates

Ask the agent to generate Azure Resource Manager (ARM), Bicep, or Terraform templates with resiliency configurations already included.

## Get Resilient for existing applications

Use the Resiliency agent to improve the zone resiliency of applications already running in Azure.

### Step 1: Define your application

Provide your list of resources to the agent. The agent creates a service group to model your application.

### Step 2: Set goals and assess

The agent assigns resiliency goals and evaluates your current posture, showing which resources meet goals and which don't.

### Step 3: Guided remediation

The agent provides step-by-step remediation guidance, including cost and downtime insights, for resources that don't meet your goals.

> [!NOTE]
> The Resiliency agent doesn't make changes to your resources automatically. All actions require your confirmation and manual execution.

## Related content

- [Assign goals and view resiliency posture](goals-recommendations-assign-goals-view-posture.md)
- [Review recommendations](goals-recommendations-review-recommendations.md)
