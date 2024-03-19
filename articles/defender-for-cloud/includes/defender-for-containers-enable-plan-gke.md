---
ms.service: defender-for-cloud
ms.topic: include
ms.date: 01/10/2024
ms.author: dacurwin
author: dcurwin
---

## Enable the plan

> [!IMPORTANT]
> If you haven't already connected a GCP project, [connect your GCP projects to Microsoft Defender for Cloud](../tutorial-enable-container-gcp.md).

To protect your GKE clusters, you'll need to enable the Containers plan on the relevant GCP project.

> [!NOTE]
> Verify that you don't have any Azure policies that prevent the Arc installation.

**To protect Google Kubernetes Engine (GKE) clusters**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant GCP connector

    :::image type="content" source="../media/defender-for-containers-enable-plan-gke/relevant-connector.png" alt-text="Screenshot showing an example GCP connector." lightbox="../media/defender-for-containers-enable-plan-gke/relevant-connector-expanded.png":::

1. Select the **Next: Select plans >** button.

1. Ensure that the Containers plan is toggled to **On**.

    :::image type="content" source="../media/defender-for-containers-enable-plan-gke/containers-on.png" alt-text="Screenshot that shows the containers plan is toggled to on.":::

1. To change optional configurations for the plan, select **Settings**.

    :::image type="content" source="../media/tutorial-enable-containers-gcp/containers-settings-gcp.png" alt-text="Screenshot of Defender for Cloud's environment settings page showing the settings for the Containers plan." lightbox="../media/tutorial-enable-containers-gcp/containers-settings-gcp.png":::

    - **Kubernetes audit logs to Defender for Cloud**: Enabled by default. This configuration is available at the GCP project level only. It provides agentless collection of the audit log data through [GCP Cloud Logging](https://cloud.google.com/logging/) to the Microsoft Defender for Cloud back end for further analysis. Defender for Containers requires control plane audit logs to provide [runtime threat protection](../defender-for-containers-introduction.md#run-time-protection-for-kubernetes-nodes-and-clusters). To send Kubernetes audit logs to Microsoft Defender, toggle the setting to **On.**

        > [!NOTE]
        > If you disable this configuration, then the `Threat detection (control plane)` feature will be disabled. Learn more about [features availability](../supported-machines-endpoint-solutions-clouds-containers.md).

    - **Auto provision Defender's sensor for Azure Arc** and **Auto provision Azure Policy extension for Azure Arc**: Enabled by default. You can install Azure Arc-enabled Kubernetes and its extensions on your GKE clusters in three ways:
      - Enable Defender for Containers autoprovisioning at the project level, as explained in the instructions in this section. We recommend this method.
      - Use Defender for Cloud recommendations for per-cluster installation. They appear on the Microsoft Defender for Cloud recommendations page. [Learn how to deploy the solution to specific clusters](../defender-for-containers-enable.md?tabs=defender-for-container-gke#deploy-the-solution-to-specific-clusters).
      - Manually install [Arc-enabled Kubernetes](../../azure-arc/kubernetes/quickstart-connect-cluster.md) and [extensions](../../azure-arc/kubernetes/extensions.md).

    - [Agentless discovery for Kubernetes](../defender-for-containers-architecture.md#how-does-agentless-discovery-for-kubernetes-in-gcp-work) provides API-based discovery of your Kubernetes clusters. To enable the **Agentless discovery for Kubernetes** feature, toggle the setting to **On**.
    - The [Agentless Container Vulnerability Assessment](../agentless-vulnerability-assessment-gcp.md) provides vulnerability management for images stored in Google Registries (GAR and GCR) and running images on your GKE clusters. To enable the **Agentless Container Vulnerability Assessment** feature, toggle the setting to **On**.

1. Select the **Copy** button.

    :::image type="content" source="../media/defender-for-containers-enable-plan-gke/copy-button.png" alt-text="Screenshot showing the location of the copy button.":::

1. Select the **GCP Cloud Shell >** button.

1. Paste the script into the Cloud Shell terminal, and run it.

The connector will update after the script executes. This process can take up to 6-8 hours up to complete.

### Deploy the solution to specific clusters

If you disabled any of the default auto provisioning configurations to Off, during the [GCP connector onboarding process](../quickstart-onboard-gcp.md#configure-the-defender-for-containers-plan), or afterwards. You'll need to manually install Azure Arc-enabled Kubernetes, the Defender sensor, and the Azure Policy for Kubernetes to each of your GKE clusters to get the full security value out of Defender for Containers.

There are 2 dedicated Defender for Cloud recommendations you can use to install the extensions (and Arc if necessary):

- `GKE clusters should have Microsoft Defender's extension for Azure Arc installed`
- `GKE clusters should have the Azure Policy extension installed`

> [!NOTE]
> When installing Arc extensions, you must verify that the GCP project provided is identical to the one in the relevant connector.

**To deploy the solution to specific clusters**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. From Defender for Cloud's **Recommendations** page, search for one of the recommendations by name.

    :::image type="content" source="../media/defender-for-containers-enable-plan-gke/recommendation-search.png" alt-text="Screenshot showing how to search for the recommendation." lightbox="../media/defender-for-containers-enable-plan-gke/recommendation-search-expanded.png":::

1. Select an unhealthy GKE cluster.

    > [!IMPORTANT]
    > You must select the clusters one at a time.
    >
    > Don't select the clusters by their hyperlinked names: select anywhere else in the relevant row.

1. Select the name of the unhealthy resource.

1. Select **Fix**.

    :::image type="content" source="../media/defender-for-containers-enable-plan-gke/fix-button.png" alt-text="Screenshot showing the location of the fix button.":::

1. Defender for Cloud will generate a script in the language of your choice:
    - For Linux, select **Bash**.
    - For Windows, select **PowerShell**.

1. Select **Download remediation logic**.

1. Run the generated script on your cluster.

1. Repeat steps *3 through 8* for the second recommendation.

## View your GKE cluster alerts

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Security alerts**.

1. Select the :::image type="icon" source="../media/defender-for-containers-enable-plan-gke/add-filter.png" border="false"::: button.

1. In the Filter dropdown menu, select **Resource type.**

1. In the Value dropdown menu, select **GCP GKE Cluster**.

1. Select **Ok**.
