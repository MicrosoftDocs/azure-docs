---
title: Troubleshoot common issues in Azure SRE Agent (preview)
description: Learn to troubleshoot common problems in Azure SRE Agent.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 07/16/2025
ms.service: azure
---

# Troubleshoot common issues in Azure SRE Agent (preview)

This guide covers the common problems faced when working with Azure SRE Agent and provides practical solutions to resolve them. The issues are typically related to permissions, regional availability, and administrative access requirements.

## Common troubleshooting scenarios

The following table outlines frequent issues you might encounter and their solutions:

| Scenario | Reason | Remarks |
|---|---|---|
| The agent shows a permissions error in the chat and knowledge graph. | The agent is created with a high-privileged account and low-privilege account attempts to interact with the agent. | Deny assignments or Azure Policy blocks identity assignment to the agent resource group.  |
| The location dropdown is blank. | A non-US region policy blocks access to Sweden Central. | If your subscription or management group limits to US-only deployments, then the creation step fails. |
| The *Create* button is disabled. | Lack of administrative permissions. | Agent identity assignments fail if the user account lacks *Owner* or *User Access Administrator* permissions. |
