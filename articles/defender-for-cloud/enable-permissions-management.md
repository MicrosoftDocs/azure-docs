---
title: Enable Permissions Management (Preview)
description: Learn more how to enable Permissions Management in Microsoft Defender for Cloud.
ms.topic: conceptual
ms.date: 11/02/2023
---

# Enable Permissions Management in Microsoft Defender for Cloud (Preview)

## Overview

Cloud Infrastructure Entitlement Management (CIEM) is a security model that helps organizations manage and control user access and entitlements in their cloud infrastructure.

Microsoft delivers both CNAPP and CIEM solutions with Microsoft Defender for Cloud (CNAPP) and Microsoft Entra Permissions Management (CIEM). Integrating the capabilities of Permissions Management with Defender for Cloud strengthens the prevention of security breaches that can occur due to excessive permissions or misconfigurations in the cloud environment. By continuously monitoring and managing cloud entitlements, Permissions Management helps to reduce the attack surface, detect potential threats, and maintain compliance with regulatory standards. This makes Permissions Management an essential tool to integrate into the capabilities of Defender for Cloud for securing cloud-native applications and protecting sensitive data in the cloud.

## Common use-cases and scenarios

Permissions Management capabilities are available as part of the Defender CSPM plan. With these added capabilities, you can track permissions analytics, unused permissions for active identities, and over-permissioned identities and mitigate them to support the best practice of least privilege.

You can find new recommendations under the **All recommendations** tab.

## Preview Prerequisites

| **Aspect**                                              | **Details**                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| Required / preferred environmental requirements | Defender CSPM                                                |
| Required roles and permissions                        |  **AWS  \ GCP** <br> Security  Admin <br>  Application.ReadWrite.All     **Azure** <br>  Security  Admin <br>  Microsoft.Authorization/roleAssignments/write |
| Clouds                                             | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure, AWS  and GCP commercial clouds      <br>   :::image type="icon" source="./media/icons/no-icon.png"::: Nation/Sovereign (US Gov, China Gov, Other  Gov) |

## Enable Permissions Management for Azure

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the top search box, search for **Microsoft Defender for Cloud**
1. In the left menu, select **Management/Environment settings**
1. Select the Azure subscription that you'd like to turn on the DCSPM CIEM plan on.
1. On the Defender plans page, make sure that the Defender CSPM plan is turned on.
1. Select the plan settings, and turn on the **Permissions Management** extension.
1. Select **Continue**.
1. Select **Save**.
1. After a few seconds, you'll notice that:

    - Your subscription has a new Reader assignment for the Permissions Management app.

    - The new **Azure CSPM (Preview)** standard is assigned to your subscription.

1. You should be able to see the applicable Permissions Management recommendations on your subscription within a few hours.
1. Go to the **Recommendations** page, and make sure that the relevant environments filters are checked. Filter by **Initiative= "Azure CSPM (Preview)"** which filters the following recommendations (if applicable):

**Azure recommendations**:

- Azure overprovisioned identities should have only the necessary permissions
- Unused Super Identities in your Azure environment should be removed
- Unused identities in your Azure environment should be removed

## Enable Permissions Management for AWS

Follow these steps to [connect your AWS account to Defender for Cloud](quickstart-onboard-aws.md)

1. For the selected account/project:

    - Select the ID in the list, and the **Setting | Defender plans** page will open.

    - Select the **Next: Select plans >** button in the bottom of the page.

1. Enable the Defender CSPM plan. If the plan is already enabled, select the **Settings >** link and turn on the **Permissions Management** feature.

1. Follow the wizard instructions to enable the plan with the new Permissions Management capabilities.
1. Run the updated CFT \ terraform script on your AWS environment.
1. Select **Save**.
1. After a few seconds, you'll notice that the new **AWS CSPM (Preview)** standard is assigned on your security connector.
1. You'll see the applicable Permissions Management recommendations on your AWS security connector within a few hours.
1. Go to the **Recommendations** page and make sure that the relevant environments filters are checked. Filter by **Initiative= "AWS CSPM (Preview)"** which returns the following recommendations (if applicable):

**AWS recommendations**:

- AWS overprovisioned identities should have only the necessary permissions

- Unused identities in your AWS environment should be removed

## Enable Permissions Management for GCP

Follow these steps to [connect your GCP account](quickstart-onboard-gcp.md) to Microsoft Defender for Cloud:

1. For the selected account/project:

    - Select the ID in the list and the **Setting | Defender plans** page will open.

    - Select the **Next: Select plans >** button in the bottom of the page.

1. Enable the Defender CSPM plan. If the plan is already enabled, select the **Settings >** link and turn on the Permissions Management feature.

1. Follow the wizard instructions to enable the plan with the new Permissions Management capabilities.
1. Run the updated CFT \ terraform script on your GCP environment.
1. Select **Save**.
1. After a few seconds, you'll notice that the new **GCP CSPM (Preview)** standard is assigned on your security connector.
1. You'll see the applicable Permissions Management recommendations on your GCP security connector within a few hours.
1. Go to the **Recommendations** page, and make sure that the relevant environments filters are checked. Filter by **Initiative= "GCP CSPM (Preview)"** which returns the following recommendations (if applicable):

### GCP recommendations

- GCP overprovisioned identities should have only the necessary permissions

- Unused Super Identities in your GCP environment should be removed

- Unused identities in your GCP environment should be removed

## Next steps

For more information about Microsoft’s CIEM solution, see [Microsoft Entra Permissions Management](/entra/permissions-management/).
