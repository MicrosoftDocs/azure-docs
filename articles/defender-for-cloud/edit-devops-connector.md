---
title: Edit your DevOps connector
description: Learn how to make changes to the DevOps connectors onboarded to Defender for Cloud.
ms.date: 11/03/2023
ms.topic: how-to
ms.custom: ignite-2023
---

# Edit your DevOps Connector in Microsoft Defender for Cloud

After onboarding your Azure DevOps, GitHub, or GitLab environments to Microsoft Defender for Cloud, you may want to change the authorization token used for the connector, add or remove organizations/groups onboarded to Defender for Cloud, or install the GitHub app to additional scope. This page provides a simple tutorial for making changes to your DevOps connectors.

## Prerequisites

- An Azure account with Defender for Cloud onboarded. If you don't already have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure DevOps](quickstart-onboard-devops.md), [GitHub](quickstart-onboard-github.md), or [GitLab](quickstart-onboard-gitlab.md) environment onboarded to Microsoft Defender for Cloud.

## Making edits to your DevOps connector

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to **Microsoft Defender for Cloud** > **Environment settings** and identify the connector you want to make changes to.

1. Select **Edit settings** for the connector.

    :::image type="content" source="media/edit-devops-connector/edit-connector-1.png" alt-text="A screenshot showing how to edit settings on the edit connector page." lightbox="media/edit-devops-connector/edit-connector-1.png":::

1. Navigate to **Configure access**. Here you can perform token exchange, change the organizations/groups onboarded, or toggle autodiscovery.

> [!NOTE]
> IF you are the owner of the connector, re-authorizing your environment to make changes is **optional**. For a user trying to take ownership of the connector, you must re-authorize using your access token. This change is irreversible as soon as you select 'Re-authorize'.

1. Use **Edit connector account** component to make changes to onboarded inventory. If an organization/group is greyed out, please ensure that you have proper permissions to the environment and the scope is not onboarded elsewhere in the Tenant.

    :::image type="content" source="media/edit-devops-connector/edit-connector-2.png" alt-text="A screenshot showing how to select an account when editing a connector." lightbox="media/edit-devops-connector/edit-connector-2.png":::
   
1. To save your inventory changes, Select **Next: Review and generate >** and **Update**. Failing to select **Update** will cause any inventory changes to not be saved.

## Next steps

- Learn more about [DevOps security in Defender for Cloud](defender-for-devops-introduction.md).