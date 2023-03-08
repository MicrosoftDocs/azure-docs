---
title: Manage AWS assessments and standards
titleSuffix: Defender for Cloud
description: Learn how to create custom security assessments and standards for your AWS environment.
ms.topic: how-to
ms.date: 03/08/2023
---

# Manage AWS assessments and standards

Security standards contain comprehensive sets of security recommendations to help secure your cloud environments. Security teams can use the readily available standards such as AWS CIS 1.2.0, AWS CIS 1.5.0, AWS Foundational Security Best Practices, and AWS PCI DSS 3.2.1.

There are three types of resources that are needed to create and manage assessments:

- Standard: defines a set of assessments
- Standard assignment: defines the scope, which the standard will evaluate. For example, specific AWS account(s).

## Assign a built-in compliance standard to your AWS account

**To assign a built-in compliance standard to your AWS account**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant AWS account.

1. Select **Standards** > **+ Create** > **Standard**.

    :::image type="content" source="media/how-to-manage-assessments-standards/aws-add-standard.png" alt-text="Screenshot that shows you where to navigate to in order to add an AWS standard." lightbox="media/how-to-manage-assessments-standards/aws-add-standard-zoom.png":::

1. Enter a name, description and select built-in recommendations from the menu.

    :::image type="content" source="media/how-to-manage-assessments-standards/create-standard-aws.png" alt-text="Screenshot of the create new standard window.":::

1. Select **Create**.

## Next steps

In this article, you learned how to manage your assessments and standards in Defender for Cloud.

> [!div class="nextstepaction"]
> [Find recommendations that can improve your security posture](review-security-recommendations.md)
