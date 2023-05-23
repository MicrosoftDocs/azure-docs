---
title: How-to enable Agentless Container posture in Microsoft Defender CSPM
description: Learn how to onboard Agentless Containers
ms.service: defender-for-cloud
ms.custom: build-2023
ms.topic: how-to
ms.date: 05/15/2023
---

# Onboard Agentless Container posture in Defender CSPM

Onboarding Agentless Container posture in Defender CSPM will allow you to gain all its [capabilities](concept-agentless-containers.md#agentless-container-posture-preview).


**To onboard Agentless Container posture in Defender CSPM:**

1. Before starting, verify that the subscription is [onboarded to Defender CSPM](enable-enhanced-security.md).

1. In the Azure portal, navigate to the Defender for Cloud's **Environment Settings** page.

1. Select the subscription that's onboarded to the Defender CSPM plan, then select **Settings**.

1. Ensure the **Agentless discovery for Kubernetes** and **Container registries vulnerability assessments** extensions are toggled to **On**.

1. Select **Continue**.

    :::image type="content" source="media/concept-agentless-containers/settings-continue.png" alt-text="Screenshot of selecting agentless discovery for Kubernetes and Container registries vulnerability assessments." lightbox="media/concept-agentless-containers/settings-continue.png":::

1. Select **Save**.

A notification message pops up in the top right corner that will verify that the settings were saved successfully.

## Why don't I see results from my clusters?
If you don't see results from your clusters, check the following:

- Do you have stopped clusters?
- Are your clusters Read only (locked)?

## What do I do if I have stopped clusters?
We suggest that you rerun the cluster to solve this issue.

## Next Steps
 Learn how to [view and remediate vulnerability assessment findings for registry images and running images](view-and-remediate-vulnerability-assessment-findings.md).
