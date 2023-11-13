---
title: Map container images from code to cloud
description: Learn how to map your container images from code to cloud.
ms.date: 11/03/2023
ms.topic: how-to
ms.custom: ignite-2023
---

# Map Container Images from Code to Cloud

When a vulnerability is identified in a container image stored in a container registry or running in a Kubernetes cluster, it can be difficult for a security practitioner to trace back to the CI/CD pipeline that first built the container image and identify a developer remediation owner. With DevOps security capabilities in Microsoft Defender Cloud Security Posture Management (CSPM), you can map your cloud-native applications from code to cloud to easily kick off developer remediation workflows and reduce the time to remediation of vulnerabilities in your container images.

## Prerequisites

- An Azure account with Defender for Cloud onboarded. If you don't already have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure DevOps](quickstart-onboard-devops.md) or [GitHub](quickstart-onboard-github.md) environment onboarded to Microsoft Defender for Cloud.
- For Azure DevOps, [Microsoft Security DevOps (MSDO) Extension](azure-devops-extension.md) installed on the Azure DevOps organization.
- For GitHub, [Microsoft Security DevOps (MSDO) Action](github-action.md) configured in your GitHub repositories.
- [Defender CSPM](tutorial-enable-cspm-plan.md) enabled.

## Map your container image from Azure DevOps pipelines to the container registry

After building a container image in an Azure DevOps CI/CD pipeline and pushing it to a registry, see the mapping by using the [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md):

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to **Microsoft Defender for Cloud** > **Cloud Security Explorer**. It can take a maximum of 4 hours for the container image mapping to appear in the Cloud Security Explorer.

1. To see basic mapping, select **Container Images** > **+** > **Pushed by code repositories**.

    :::image type="content" source="media/container-image-mapping/simple-container-mapping.png" alt-text="Screenshot that shows how to find basic mapping of containers." lightbox="media/container-image-mapping/simple-container-mapping.png":::

1. (Optional) Select + by **Container Images** to add other filters to your query, such as **Has vulnerabilities** to filter only container images with CVEs.

1. After running your query, you will see the mapping between container registry and Azure DevOps pipeline. Click **...** next to the edge to see additional details on where the Azure DevOps pipeline was run.

    :::image type="content" source="media/container-image-mapping/mapping-results.png" alt-text="Screenshot that shows an advanced query for container mapping results." lightbox="media/container-image-mapping/mapping-results.png":::

Below is an example of an advanced query that utilizes container image mapping. Starting with a Kubernetes workload that is exposed to the internet, you can trace all container images with high severity CVEs back to the Azure DevOps pipeline where the container image was built, empowering a security practitioner to kick off a developer remediation workflow.

  :::image type="content" source="media/container-image-mapping/advanced-mapping-query.png" alt-text="Screenshot that shows basic container mapping results." lightbox="media/container-image-mapping/advanced-mapping-query.png":::

> [!NOTE]
> If your Azure DevOps organization had the MSDO extension installed prior to November 15, 2023, please navigate to **Organization settings** > **Extensions** and install the container image mapping decorator. If you do not see the extension shared with your organization, fill out the following [form](https://aka.ms/ContainerImageMappingForm).

## Map your container image from GitHub workflows to the container registry

1. Add the container image mapping tool to your MSDO workflow:

    ```yml
          # Run analyzers
        - name: Run Microsoft Security DevOps Analysis
          uses: microsoft/security-devops-action@latest
          id: msdo
          with:
            include-tools: container-mapping
    ```

After building a container image in a GitHub workflow and pushing it to a registry, see the mapping by using the [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md):

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to **Microsoft Defender for Cloud** > **Cloud Security Explorer**. It can take a maximum of 4 hours for the container image mapping to appear in the Cloud Security Explorer.

1. To see basic mapping, select **Container Images** > **+** > **Pushed by code repositories**.

    :::image type="content" source="media/container-image-mapping/simple-container-mapping.png" alt-text="Screenshot that shows basic container mapping." lightbox="media/container-image-mapping/simple-container-mapping.png":::

1. (Optional) Select + by **Container Images** to add other filters to your query, such as **Has vulnerabilities** to filter only container images with CVEs.

1. After running your query, you will see the mapping between container registry and GitHub workflow. Click **...** next to the edge to see additional details on where the GitHub workflow was run.

Below is an example of an advanced query that utilizes container image mapping. Starting with a Kubernetes workload that is exposed to the internet, you can trace all container images with high severity CVEs back to the GitHub repository where the container image was built, empowering a security practitioner to kick off a developer remediation workflow.

  :::image type="content" source="media/container-image-mapping/advanced-mapping-query.png" alt-text="Screenshot that shows basic container mapping results." lightbox="media/container-image-mapping/advanced-mapping-query.png":::

## Next steps

- Learn more about [DevOps security in Defender for Cloud](defender-for-devops-introduction.md).
