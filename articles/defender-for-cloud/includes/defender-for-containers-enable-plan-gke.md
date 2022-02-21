---
ms.service: defender-for-cloud
ms.topic: include
ms.date: 02/21/2022
---

## Enable Microsoft Defender for Cloud on a connected GCP project

To protect your GKE clusters, you will need to enable the Containers plan on the relevant GCP project.

**To enable the Containers plan on the relevant GCP project**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant GCP connector

    :::image type="content" source="../media/defender-for-containers-enable-plan-gke/relevant-connector.png" alt-text="Screenshot showing an example GCP connector.":::

1. Select the **Next: Select plans >** button.

1. Ensure that the Containers plan is toggled to **On**.

    :::image type="content" source="../media/defender-for-containers-enable-plan-gke/containers-on.png" alt-text="Screenshot that shows the containers plan is toggled to on.":::

1. (Optional) [Configure the containers plan](../quickstart-onboard-gcp.md#configure-the-containers-plan).

1. Select the **Copy** button.

    :::image type="content" source="../media/defender-for-containers-enable-plan-gke/copy-button.png" alt-text="Screenshot showing the location of the copy button.":::

1. Select the **GCP Cloud Shell >** button.

1. Paste the script into the Cloud Shell terminal, and run it.

The connector will update after the script executes. This process can take up to 6-8 hours up to complete.

## Deploy the solution to specific clusters

To get the full security value out of Defender for Containers, Azure Arc-enabled Kubernetes, the Defender extension, and the Azure Policy extension, all of these extensions should be installed on each GKE cluster.
 
These extensions can be manually deployed through the Recommendations page. You will only need to manually deploy these extensions if you disabled any of the default auto provisioning configurations.

There are 2 dedicated Defender for Cloud recommendation for deploying the extensions (and Arc if necessary):
-	`GKE clusters should have Microsoft Defender's extension for Azure Arc installed`
-	`GKE clusters should have the Azure Policy extension installed`

**To deploy the solution to specific clusters**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Search for either `GKE clusters should have Microsoft Defender's extension for Azure Arc installed`, or `GKE clusters should have the Azure Policy extension installed`.

    :::image type="content" source="../media/defender-for-containers-enable-plan-gke/recommmendation-search.png" alt-text="Screenshot showing the results of searching for either recommendation.":::

