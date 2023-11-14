---
title: Enable Permissions Management (Preview)
description: Learn more how to enable Permissions Management in Microsoft Defender for Cloud.
ms.topic: conceptual
ms.date: 11/13/2023
---

# Enable Permissions Management in Microsoft Defender for Cloud (Preview)

## Overview

Cloud Infrastructure Entitlement Management (CIEM) is a security model that helps organizations manage and control user access and entitlements in their cloud infrastructure. CIEM is a critical component of the Cloud Native Application Protection Platform (CNAPP) solution that provides visibility into who or what has access to specific resources. It ensures that access rights adhere to the principle of least privilege (PoLP), where users or workload identities, such as apps and services,  receive only the minimum levels of access necessary to perform their tasks.

Microsoft delivers both CNAPP and CIEM solutions with [Microsoft Defender for Cloud (CNAPP)](defender-for-cloud-introduction.md) and [Microsoft Entra Permissions Management (CIEM)](/entra/permissions-management/overview). Integrating the capabilities of Permissions Management with Defender for Cloud strengthens the prevention of security breaches that can occur due to excessive permissions or misconfigurations in the cloud environment. By continuously monitoring and managing cloud entitlements, Permissions Management helps to discover the attack surface, detect potential threats, right-size access permissions, and maintain compliance with regulatory standards. This makes insights from Permissions Management essential to integrate and enrich the capabilities of Defender for Cloud for securing cloud-native applications and protecting sensitive data in the cloud.

This integration brings the following insights derived from the Microsoft Entra Permissions Management suite into the Microsoft Defender for Cloud portal. For more information, see the [Feature matrix](#feature-matrix).

## Common use-cases and scenarios

Microsoft Entra Permissions Management capabilities are seamlessly integrated as a valuable component within the Defender [Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) plan. The integrated capabilities are foundational, providing the essential functionalities within Microsoft Defender for Cloud. With these added capabilities, you can track permissions analytics, unused permissions for active identities, and over-permissioned identities and mitigate them to support the best practice of least privilege.

You can find the new recommendations in the **Manage Access and Permissions** Security Control under the **Recommendations** tab in the Defender for Cloud dashboard.

## Preview prerequisites

| **Aspect**                                      | **Details**                                                  |
| ----------------------------------------------- | ------------------------------------------------------------ |
| Required / preferred environmental requirements | Defender CSPM  <br> These capabilities are included in the Defender CSPM plan and don't require an additional license.                                        |
| Required roles and permissions                  | **AWS  \ GCP** <br>Security Admin <br>Application.ReadWrite.All<br><br>**Azure** <br>Security Admin <br>Microsoft.Authorization/roleAssignments/write |
| Clouds                                          | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure, AWS  and GCP commercial clouds      <br>   :::image type="icon" source="./media/icons/no-icon.png"::: Nation/Sovereign (US Gov, China Gov, Other  Gov) |

## Enable Permissions Management for Azure

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the top search box, search for **Microsoft Defender for Cloud**.
1. In the left menu, select **Management/Environment settings**.
1. Select the Azure subscription that you'd like to turn on the DCSPM CIEM plan on.
1. On the Defender plans page, make sure that the Defender CSPM plan is turned on.
1. Select the plan settings, and turn on the **Permissions Management** extension.
1. Select **Continue**.
1. Select **Save**.
1. After a few seconds, you'll notice that:

    - Your subscription has a new Reader assignment for the Cloud Infrastructure Entitlement Management application.

    - The new **Azure CSPM (Preview)** standard is assigned to your subscription.

    :::image type="content" source="media/enable-permissions-management/enable-permissions-management-azure.png" alt-text="Screenshot of how to enable permissions management for Azure." lightbox="media/enable-permissions-management/enable-permissions-management-azure.png":::

1. You should be able to see the applicable Permissions Management recommendations on your subscription within a few hours.
1. Go to the **Recommendations** page, and make sure that the relevant environments filters are checked. Filter by **Initiative= "Azure CSPM (Preview)"** which filters the following recommendations (if applicable):

**Azure recommendations**:

- Azure overprovisioned identities should have only the necessary permissions
- Super Identities in your Azure environment should be removed
- Unused identities in your Azure environment should be removed

## Enable Permissions Management for AWS

Follow these steps to [connect your AWS account to Defender for Cloud](quickstart-onboard-aws.md)

1. For the selected account/project:

    - Select the ID in the list, and the **Setting | Defender plans** page will open.

    - Select the **Next: Select plans >** button in the bottom of the page.

1. Enable the Defender CSPM plan. If the plan is already enabled, select **Settings**  and turn on the **Permissions Management** feature.
1. Follow the wizard instructions to enable the plan with the new Permissions Management capabilities.

   :::image type="content" source="media/enable-permissions-management/enable-permissions-management-aws.png" alt-text="Screenshot of how to enable permissions management plan for AWS." lightbox="media/enable-permissions-management/enable-permissions-management-aws.png":::

1. Select **Configure access**, and then choose the appropriate **Permissions** type. Choose the deployment method: **'AWS CloudFormation' \ 'Terraform' script**.
1. The deployment template is autofilled with default role ARN names. You can customize the role names by selecting the hyperlink.
1. Run the updated CFT \ terraform script on your AWS environment.
1. Select **Save**.
1. After a few seconds, you'll notice that the new **AWS CSPM (Preview)** standard is assigned on your security connector.

    :::image type="content" source="media/enable-permissions-management/aws-policies.png" alt-text="Screenshot of how to enable permissions management for AWS." lightbox="media/enable-permissions-management/aws-policies.png":::

1. You'll see the applicable Permissions Management recommendations on your AWS security connector within a few hours.
1. Go to the **Recommendations** page and make sure that the relevant environments filters are checked. Filter by **Initiative= "AWS CSPM (Preview)"** which returns the following recommendations (if applicable):

**AWS recommendations**:

- AWS overprovisioned identities should have only the necessary permissions

- Unused identities in your AWS environment should be removed

> [!NOTE]
> The recommendations offered through the Permissions Management (Preview) integration are programmatically available from [Azure Resource Graph](/azure/governance/resource-graph/overview).

## Enable Permissions Management for GCP

Follow these steps to [connect your GCP account](quickstart-onboard-gcp.md) to Microsoft Defender for Cloud:

1. For the selected account/project:

    - Select the ID in the list and the **Setting | Defender plans** page will open.

    - Select the **Next: Select plans >** button in the bottom of the page.

1. Enable the Defender CSPM plan. If the plan is already enabled, select **Settings** and turn on the Permissions Management feature.

1. Follow the wizard instructions to enable the plan with the new Permissions Management capabilities.
1. Run the updated CFT \ terraform script on your GCP environment.
1. Select **Save**.
1. After a few seconds, you'll notice that the new **GCP CSPM (Preview)** standard is assigned on your security connector.

    :::image type="content" source="media/enable-permissions-management/gcp-policies.png" alt-text="Screenshot of how to enable permissions management for GCP." lightbox="media/enable-permissions-management/gcp-policies.png":::

1. You'll see the applicable Permissions Management recommendations on your GCP security connector within a few hours.
1. Go to the **Recommendations** page, and make sure that the relevant environments filters are checked. Filter by **Initiative= "GCP CSPM (Preview)"** which returns the following recommendations (if applicable):

**GCP recommendations**:

- GCP overprovisioned identities should have only the necessary permissions

- Unused Super Identities in your GCP environment should be removed

- Unused identities in your GCP environment should be removed

## Known limitations

- AWS or GCP accounts that are initially onboarded to Microsoft Entra Permissions Management can't be integrated via Microsoft Defender for Cloud.

## Feature matrix

The integration feature comes as part of Defender CSPM plan and doesn't require a Microsoft Entra Permissions Management (MEPM) license. To learn more about additional capabilities that you can receive from MEPM, refer to the feature matrix:

| Category  | Capabilities                                                 | Defender for Cloud | Permissions Management |
| --------- | ------------------------------------------------------------ | ------------------ | ---------------------- |
| Discover  | Permissions  discovery for risky identities (including unused identities, overprovisioned  active identities, super identities) in Azure, AWS, GCP | ✓                  | ✓                      |
| Discover  | Permissions  Creep Index (PCI) for multicloud environments (Azure, AWS, GCP) and all  identities | ✓                  | ✓                      |
| Discover  | Permissions  discovery for all identities, groups in Azure, AWS, GCP | ❌                  | ✓                      |
| Discover  | Permissions  usage analytics, role / policy assignments in Azure, AWS, GCP | ❌                  | ✓                      |
| Discover  | Support  for Identity Providers (including AWS IAM Identity Center, Okta, GSuite) | ❌                  | ✓                      |
| Remediate | Automated  deletion of permissions                           | ❌                  | ✓                      |
| Remediate | Remediate  identities by attaching / detaching the permissions | ❌                  | ✓                      |
| Remediate | Custom  role / AWS Policy generation based on activities of identities, groups, etc. | ❌                  | ✓                      |
| Remediate | Permissions  on demand (time-bound access) for human and workload identities via Microsoft Entra admin center, APIs, ServiceNow app. | ❌                  | ✓                      |
| Monitor   | Machine  Learning-powered anomaly detections                 | ❌                  | ✓                      |
| Monitor   | Activity  based, rule-based alerts                           | ❌                  | ✓                      |
| Monitor   | Context-rich  forensic reports (for example PCI history report, user entitlement &  usage report, etc.) | ❌                  | ✓                      |

## Next steps

- For more information about Microsoft’s CIEM solution, see [Microsoft Entra Permissions Management](/entra/permissions-management/).
- To obtain a free trial of Microsoft Entra Permissions Management, see the [Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_Entra_PM/PMDashboard.ReactView).
