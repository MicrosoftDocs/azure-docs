---
ms.service: defender-for-cloud
ms.topic: include
ms.date: 06/01/2023
ms.author: dacurwin
author: dcurwin
---

## Protect Google Kubernetes Engine (GKE) clusters

> [!IMPORTANT]
> If you haven't already connected a GCP project, [connect your GCP projects to Microsoft Defender for Cloud](../quickstart-onboard-gcp.md).

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

1. (Optional) [Configure the containers plan](../quickstart-onboard-gcp.md#configure-the-defender-for-containers-plan).

1. Select the **Copy** button.

    :::image type="content" source="../media/defender-for-containers-enable-plan-gke/copy-button.png" alt-text="Screenshot showing the location of the copy button.":::

1. Select the **GCP Cloud Shell >** button.

1. Paste the script into the Cloud Shell terminal, and run it.

The connector will update after the script executes. This process can take up to 6-8 hours up to complete.

### Deploy the solution to specific clusters

If you disabled any of the default auto provisioning configurations to Off, during the [GCP connector onboarding process](../quickstart-onboard-gcp.md#configure-the-defender-for-containers-plan), or afterwards. You'll need to manually install Azure Arc-enabled Kubernetes, the Defender agent, and the Azure Policy for Kubernetes to each of your GKE clusters to get the full security value out of Defender for Containers.

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
