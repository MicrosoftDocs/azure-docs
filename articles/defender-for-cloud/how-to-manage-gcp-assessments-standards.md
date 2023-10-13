---
title: Manage GCP assessments and standards

description: Learn how to create standards for your GCP environment.
ms.topic: how-to
ms.date: 03/08/2023
---

# Manage GCP assessments and standards

Security standards contain comprehensive sets of security recommendations to help secure your cloud environments. Security teams can use the readily available regulatory standards such as GCP CIS 1.1.0, GCP CIS and 1.2.0, or create custom standards to meet specific internal requirements.

There are two types of resources that are needed to create and manage standards:

- Standard: defines a set of assessments
- Standard assignment: defines the scope, which the standard evaluates. For example, specific GCP projects.

## Create a custom compliance standard to your GCP project

**To create a custom compliance standard to your GCP project**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant GCP project.

1. Select **Standards** > **+ Create** > **Standard**.

    :::image type="content" source="media/how-to-manage-assessments-standards/gcp-standard.png" alt-text="Screenshot that shows you where to navigate to, to add a GCP standard." lightbox="media/how-to-manage-assessments-standards/gcp-standard-zoom.png":::

1. Enter a name, description and select built-in recommendations from the drop-down menu.

    :::image type="content" source="media/how-to-manage-assessments-standards/drop-down-menu.png" alt-text="Screenshot that shows you the standard options you can choose from the drop-down menu." lightbox="media/how-to-manage-assessments-standards/drop-down-menu.png":::

1. Select **Create**.

## Assign a built-in compliance standard to your GCP project

**To assign a built-in compliance standard to your GCP project**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant GCP project.

1. Select **Standards**.

1. Select the **three dot button** for the built-in standard you want to assign.

    :::image type="content" source="media/how-to-manage-assessments-standards/gcp-built-in.png" alt-text="Screenshot that shows where the three dot button is located on the screen." lightbox="media/how-to-manage-assessments-standards/gcp-built-in.png":::

1. Select **Assign standard**.

1. Select **Yes**.
 
## Next steps

In this article, you learned how to manage your assessments and standards in Defender for Cloud.

> [!div class="nextstepaction"]
> [Find recommendations that can improve your security posture](review-security-recommendations.md)