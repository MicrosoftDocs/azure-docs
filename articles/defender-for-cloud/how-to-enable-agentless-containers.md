---
title: How-to enable Agentless Container posture in Microsoft Defender CSPM
description: Learn how to onboard Agentless Containers
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 05/30/2023
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

## What can I do if I have stopped clusters?
We do not support or charge stopped clusters. To get the value of agentless capabilities on a stopped cluster, you can rerun the cluster. 

## What do I do if I have locked resource groups, subscriptions, or clusters? 

We suggest that you unlock the locked resource group/subscription/cluster, make the relevant requests manually, and then re-lock the resource group/subscription/cluster by doing the following: 

1. Enable the feature flag manually via CLI: 

    ``` CLI 

    “az feature register --namespace "Microsoft.ContainerService" --name "TrustedAccessPreview” 

    ``` 

1. Perform the bind operation in the CLI: 

    ``` CLI 

    az account set -s <SubscriptionId> 

    az extension add --name aks-preview 

    az aks trustedaccess rolebinding create --resource-group <cluster resource group> --cluster-name <cluster name> --name defender-cloudposture --source-resource-id /subscriptions/<SubscriptionId>/providers/Microsoft.Security/pricings/CloudPosture/securityOperators/DefenderCSPMSecurityOperator --roles  "Microsoft.Security/pricings/microsoft-defender-operator" 

    ``` 

For locked clusters, you can also do one of the following: 

- Remove the lock. 
- Perform the bind operation manually by doing an API request. 

 

## Support for exemptions

You can customize your vulnerability assessment experience by exempting management groups, subscriptions, or specific resources from your secure score. Learn how to [create an exemption](exempt-resource.md) for a resource or subscription.

## Next Steps

- Learn more about [locked resources](/azure/azure-resource-manager/management/lock-resources?tabs=json). 
- Learn more about [Trusted Access](/azure/aks/trusted-access-feature). 
- Learn how to [view and remediate vulnerability assessment findings for registry images and running images](view-and-remediate-vulnerability-assessment-findings.md).
- Learn how to [create an exemption](exempt-resource.md) for a resource or subscription.

