---
title: Protect your Google Cloud Platform (GCP) project containers with Defender for Containers
description: Learn how to enable the Defender for Containers plan on your Google Cloud Platform (GCP) project for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 06/29/2023
---

# Protect your Google Cloud Platform (GCP) containers with Defender for Containers

Defender for Containers in Microsoft Defender for Cloud is the cloud-native solution that is used to secure your containers so you can improve, monitor, and maintain the security of your clusters, containers, and their applications.

Learn more about [Overview of Microsoft Defender for Containers](defender-for-containers-introduction.md).

You can learn more about Defender for Container's pricing on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- [Connect your GCP projects to Microsoft Defender for Cloud](quickstart-onboard-gcp.md#connect-your-gcp-project).

- Verify your Kubernetes nodes can access source repositories of your package manager.

- Ensure the following [Azure Arc-enabled Kubernetes network requirements](../azure-arc/kubernetes/quickstart-connect-cluster.md) are validated.

## Enable the Defender for Containers plan on your GCP project

**To protect Google Kubernetes Engine (GKE) clusters**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant GCP project.

    :::image type="content" source="media/tutorial-enable-containers-gcp/relevant-connector.png" alt-text="Screenshot showing an example GCP connector." lightbox="media/tutorial-enable-containers-gcp/relevant-connector-expanded.png":::

1. Select the **Next: Select plans** button.

1. Ensure that the Containers plan is toggled to **On**.

    :::image type="content" source="media/tutorial-enable-containers-gcp/containers-on.png" alt-text="Screenshot that shows the containers plan is toggled to on." lightbox="media/tutorial-enable-containers-gcp/containers-on.png":::

1. To change optional configurations for the plan, select **Settings**.

    :::image type="content" source="media/tutorial-enable-containers-gcp/containers-settings-gcp.png" alt-text="Screenshot of Defender for Cloud's environment settings page showing the settings for the Containers plan." lightbox="media/tutorial-enable-containers-gcp/containers-settings-gcp.png":::

    - **Kubernetes audit logs to Defender for Cloud**: Enabled by default. This configuration is available at the GCP project level only. It provides agentless collection of the audit log data through [GCP Cloud Logging](https://cloud.google.com/logging/) to the Microsoft Defender for Cloud back end for further analysis. Defender for Containers requires control plane audit logs to provide [runtime threat protection](defender-for-containers-introduction.md#run-time-protection-for-kubernetes-nodes-and-clusters). To send Kubernetes audit logs to Microsoft Defender, toggle the setting to **On.**

        > [!NOTE]
        > If you disable this configuration, then the `Threat detection (control plane)` feature will be disabled. Learn more about [features availability](supported-machines-endpoint-solutions-clouds-containers.md).

    - **Auto provision Defender's sensor for Azure Arc** and **Auto provision Azure Policy extension for Azure Arc**: Enabled by default. You can install Azure Arc-enabled Kubernetes and its extensions on your GKE clusters in three ways:
      - Enable Defender for Containers autoprovisioning at the project level, as explained in the instructions in this section. We recommend this method.
      - Use Defender for Cloud recommendations for per-cluster installation. They appear on the Microsoft Defender for Cloud recommendations page. [Learn how to deploy the solution to specific clusters](defender-for-containers-enable.md?tabs=defender-for-container-gke#deploy-the-solution-to-specific-clusters).
      - Manually install [Arc-enabled Kubernetes](../azure-arc/kubernetes/quickstart-connect-cluster.md) and [extensions](../azure-arc/kubernetes/extensions.md).

    - [Agentless discovery for Kubernetes](defender-for-containers-architecture.md#how-does-agentless-discovery-for-kubernetes-in-gcp-work) provides API-based discovery of your Kubernetes clusters. To enable the **Agentless discovery for Kubernetes** feature, toggle the setting to **On**.
    - The [Agentless Container Vulnerability Assessment](agentless-vulnerability-assessment-gcp.md) provides vulnerability management for images stored in Google Registries (GAR and GCR) and running images on your GKE clusters. To enable the **Agentless Container Vulnerability Assessment** feature, toggle the setting to **On**.

1. Select the **Copy** button.

    :::image type="content" source="media/tutorial-enable-containers-gcp/copy-button.png" alt-text="Screenshot showing the location of the copy button.":::

1. Select the **GCP Cloud Shell** button.

1. Paste the script into the Cloud Shell terminal, and run it.

    The connector will update after the script executes. This process can take up to 6-8 hours up to complete.

1. Select **Next: Review and Generate>**.

1. Select **Update**.

## Deploy the solution to specific clusters

If you disabled any of the default auto provisioning configurations to Off, during the [GCP connector onboarding process](quickstart-onboard-gcp.md#configure-the-defender-for-containers-plan), or afterwards. You need to manually install Azure Arc-enabled Kubernetes, the Defender sensor, and Azure Policy for Kubernetes to each of your GKE clusters to get the full security value out of Defender for Containers.

There are two dedicated Defender for Cloud recommendations you can use to install the extensions (and Arc if necessary):

- `GKE clusters should have Microsoft Defender's extension for Azure Arc installed`
- `GKE clusters should have the Azure Policy extension installed`

> [!NOTE]
> When installing Arc extensions, you must verify that the GCP project provided is identical to the one in the relevant connector.

**To deploy the solution to specific clusters**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Recommendations**.

1. From Defender for Cloud's **Recommendations** page, search for each one of the recommendations above by name.

    :::image type="content" source="media/tutorial-enable-containers-gcp/recommendation-search.png" alt-text="Screenshot showing how to search for the recommendation." lightbox="media/tutorial-enable-containers-gcp/recommendation-search-expanded.png":::

1. Select an unhealthy GKE cluster.

    > [!IMPORTANT]
    > You must select the clusters one at a time.
    >
    > Don't select the clusters by their hyperlinked names: select anywhere else in the relevant row.

1. Select the name of the unhealthy resource.

1. Select **Fix**.

    :::image type="content" source="media/tutorial-enable-containers-gcp/fix-button.png" alt-text="Screenshot showing the location of the fix button.":::

1. Defender for Cloud generates a script in the language of your choice:
    - For Linux, select **Bash**.
    - For Windows, select **PowerShell**.

1. Select **Download remediation logic**.

1. Run the generated script on your cluster.

1. Repeat steps *3 through 10* for the second recommendation.

## Next steps

- For advanced enablement features for Defender for Containers, see the [Enable Microsoft Defender for Containers](defender-for-containers-enable.md) page.

- [Overview of Microsoft Defender for Containers](defender-for-containers-introduction.md).
