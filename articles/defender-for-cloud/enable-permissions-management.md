---
title: Enable Permissions Management (CIEM)
author: Elazark
ms.author: elkrieger
description: Learn how to enable Permissions Management for better access control and security in your cloud infrastructure.
ms.topic: how-to
ms.date: 05/07/2024
#customer intent: As a cloud administrator, I want to learn how to enable permissions (CIEM) in order to effectively manage user access and entitlements in my cloud infrastructure.
---

# Enable Permissions Management (CIEM)

Microsoft Defender for Cloud's integration with Microsoft Entra Permissions Management (Permissions Management) provides a Cloud Infrastructure Entitlement Management (CIEM) security model that helps organizations manage and control user access and entitlements in their cloud infrastructure. CIEM is a critical component of the Cloud Native Application Protection Platform (CNAPP) solution that provides visibility into who or what has access to specific resources. It ensures that access rights adhere to the principle of least privilege (PoLP), where users or workload identities, such as apps and services, receive only the minimum levels of access necessary to perform their tasks. CIEM also helps organizations to monitor and manage permissions across multiple cloud environments, including Azure, AWS, and GCP.

## Before you start

- You must [enable Defender CSPM](tutorial-enable-cspm-plan.md) on your Azure subscription, AWS account, or GCP project.

- Have the following roles and permissions
    - **AWS and GCP**: Security Admin, Application.ReadWrite.All
    - **Azure**: Security Admin, Microsoft.Authorization/roleAssignments/write

- **AWS Only**: [Connect your AWS account to Defender for Cloud](quickstart-onboard-aws.md).

- **GCP only**: [Connect your GCP project to Defender for Cloud](quickstart-onboard-gcp.md).

## Enable Permissions Management (CIEM) for Azure

When you enabled the Defender CSPM plan on your Azure account, the **Azure CSPM** [standard is automatically assigned to your subscription](concept-regulatory-compliance-standards.md). The Azure CSPM standard provides Cloud Infrastructure Entitlement Management (CIEM) recommendations.
 
When Permissions Management (CIEM) is disabled, the CIEM recommendations within the Azure CSPM standard won’t be calculated.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select  **Microsoft Defender for Cloud**.

1. Navigate to **Environment settings**.

1. Select relevant subscription.

1. Locate the Defender CSPM plan and select **Settings**.

1. Enable **Permissions Management (CIEM)**.

    :::image type="content" source="media/enable-permissions-management/permissions-management-on.png" alt-text="Screenshot that shows you where the toggle is for the permissions management is located." lightbox="media/enable-permissions-management/permissions-management-on.png":::

1. Select **Continue**.

1. Select **Save**.

The applicable Permissions Management (CIEM) recommendations appear on your subscription within a few hours.

List of Azure recommendations:

- Azure over-provisioned identities should have only the necessary permissions

- Unused identities in your Azure environment should be revoked/removed

- Super identities in your Azure environment should be revoked/removed

## Enable Permissions Management (CIEM) for AWS

When you enabled the Defender CSPM plan on your AWS account, the **AWS CSPM** [standard is automatically assigned to your subscription](concept-regulatory-compliance-standards.md). The AWS CSPM standard provides Cloud Infrastructure Entitlement Management (CIEM) recommendations. 
When Permission Management is disabled, the CIEM recommendations within the AWS CSPM standard won’t be calculated.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select  **Microsoft Defender for Cloud**.

1. Navigate to **Environment settings**.

1. Select relevant AWS account.

1. Locate the Defender CSPM plan and select **Settings**.

    :::image type="content" source="media/enable-permissions-management/settings.png" alt-text="Screenshot that shows an AWS account and the Defender CSPM plan enabled and where the settings button is located." lightbox="media/enable-permissions-management/settings.png":::

1. Enable **Permissions Management (CIEM)**.

1. Select **Configure access**.

1. Select the relevant permissions type.

1. Select a deployment method.

1. Run the updated script on your AWS environment using the onscreen instructions.

1. Check the **CloudFormation template has been updated on AWS environment (Stack)** checkbox.

    :::image type="content" source="media/enable-permissions-management/checkbox.png" alt-text="Screenshot that shows where the checkbox is located on the screen.":::

1. Select **Review and generate**.

1. Select **Update**.

The applicable Permissions Management (CIEM) recommendations appear on your subscription within a few hours.

List of AWS recommendations:

- AWS over-provisioned identities should have only the necessary permissions

- Unused identities in your Azure environment should be revoked/removed

## Enable Permissions Management (CIEM) for GCP

When you enabled the Defender CSPM plan on your GCP project, the **GCP CSPM** [standard is automatically assigned to your subscription](concept-regulatory-compliance-standards.md). The GCP CSPM standard provides Cloud Infrastructure Entitlement Management (CIEM) recommendations. 

When Permissions Management (CIEM) is disabled, the CIEM recommendations within the GCP CSPM standard won’t be calculated.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Navigate to **Environment settings**.

1. Select relevant GCP project.

1. Locate the Defender CSPM plan and select **Settings**.

    :::image type="content" source="media/enable-permissions-management/settings-google.png" alt-text="Screenshot that shows where to select settings for the Defender CSPM plan for your GCP project." lightbox="media/enable-permissions-management/settings-google.png":::

1. Toggle Permissions Management **(CIEM)** to **On**.

1. Select **Save**.

1. Select **Next: Configure access**.

1. Select the relevant permissions type.

1. Select a deployment method.

1. Run the updated Cloud shell or Terraform script on your GCP environment using the on screen instructions.

1. Add a check to the **I ran the deployment template for the changes to take effect** checkbox.

    :::image type="content" source="media/enable-permissions-management/gcp-checkbox.png" alt-text="Screenshot that shows the checkbox that needs to be selected." lightbox="media/enable-permissions-management/gcp-checkbox.png":::

1. Select **Review and generate**.

1. Select **Update**.

The applicable Permissions Management **(CIEM)** recommendations appear on your subscription within a few hours.

List of GCP recommendations:

- GCP over-provisioned identities should have only necessary permissions

- Unused identities in your GCP environment should be revoked/removed

- Super identities in your GCP environment should be revoked/removed

## Next step

Learn more about [Microsoft Entra Permissions Management](/entra/permissions-management/).
