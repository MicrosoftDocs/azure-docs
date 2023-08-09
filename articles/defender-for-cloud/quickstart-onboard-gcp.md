---
title: Connect your GCP project
description: Defend your GCP resources by using Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 07/24/2023
---

# Connect your GCP project to Microsoft Defender for Cloud

Workloads commonly span multiple cloud platforms. Cloud security services must do the same. Microsoft Defender for Cloud helps protect workloads in Google Cloud Platform (GCP), but you need to set up the connection between them and Defender for Cloud.

If you're connecting a GCP project that you previously connected by using the classic connector, you must [remove it](how-to-use-the-classic-connector.md#remove-classic-gcp-connectors) first. Using a GCP project that's connected by both the classic and native connectors can produce duplicate recommendations.

This screenshot shows GCP accounts displayed in the Defender for Cloud [overview dashboard](overview-page.md).

:::image type="content" source="./media/quickstart-onboard-gcp/gcp-account-in-overview.png" alt-text="Screenshot that shows GCP projects listed on the overview dashboard in Defender for Cloud." lightbox="media/quickstart-onboard-gcp/gcp-account-in-overview.png":::

## Prerequisites

To complete the procedures in this article, you need:

- A Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free one](https://azure.microsoft.com/pricing/free-trial/).

- [Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) set up on your Azure subscription.

- Access to a GCP project.

- **Contributor** permission on the relevant Azure subscription, and **Owner** permission on the GCP organization or project.

You can learn more about Defender for Cloud pricing on [the pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

When you're connecting GCP projects to specific Azure subscriptions, consider the [Google Cloud resource hierarchy](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy#resource-hierarchy-detail) and these guidelines:

- You can connect your GCP projects to Microsoft Defender for Cloud at the *project* level.
- You can connect multiple projects to one Azure subscription.
- You can connect multiple projects to multiple Azure subscriptions.

## Connect your GCP project

To connect your GCP project to Defender for Cloud by using a native connector:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to **Defender for Cloud** > **Environment settings**.

1. Select **Add environment** > **Google Cloud Platform**.

    :::image type="content" source="media/quickstart-onboard-gcp/google-cloud.png" alt-text="Screenshot that shows selections for adding Google Cloud Platform as a connector."  lightbox="media/quickstart-onboard-gcp/google-cloud.png":::

1. Enter all relevant information.

    :::image type="content" source="media/quickstart-onboard-gcp/create-connector.png" alt-text="Screenshot of the pane for creating a GCP connector." lightbox="media/quickstart-onboard-gcp/create-connector.png":::

   Optionally, if you select **Organization**, a management project and an organization custom role are created on your GCP project for the onboarding process. Autoprovisioning is enabled for the onboarding of new projects.

## Select Defender plans

In this section of the wizard, you select the Defender for Cloud plans that you want to enable.

1. Select **Next: Select plans**.

1. For the plans that you want to connect, turn the toggle to **On**. By default, all necessary prerequisites and components are provisioned. [Learn how to configure each plan](#optional-configure-selected-plans).

    If you choose to turn on the Microsoft Defender for Containers plan, ensure that you meet the [network requirements](defender-for-containers-enable.md?tabs=defender-for-container-gcp#network-requirements) for it.

1. Select **Next: Configure access**.

    1. Choose the deployment type:

        - **Default access**: Allows Defender for Cloud to scan your resources and automatically include future capabilities.
        - **Least privilege access**: Grants Defender for Cloud access to only the current permissions needed for the selected plans. If you select the least privileged permissions, you'll receive notifications on any new roles and permissions that are required to get full functionality for connector health.

    1. Choose the deployment method: **GCP Cloud Shell** or **Terraform**.

1. Select **Copy**.

    :::image type="content" source="media/quickstart-onboard-gcp/copy-button.png" alt-text="Screenshot that shows the location of the copy button.":::

   > [!NOTE]
   > For the discovery of GCP resources and for the authentication process, you must enable the following APIs: `iam.googleapis.com`, `sts.googleapis.com`, `cloudresourcemanager.googleapis.com`, `iamcredentials.googleapis.com`, and `compute.googleapis.com`. If you don't enable these APIs, we'll enable them during the onboarding process by running the GCloud script.

1. Select **GCP Cloud Shell >**. The GCP Cloud Shell opens.

1. Paste the script into the GCP Cloud Shell terminal and run it.

1. Ensure that you created the following resources for Microsoft Defender Cloud Security Posture Management (CSPM) and Defender for Containers:

    | CSPM | Defender for Containers|
    |--|--|
    | CSPM service account reader role <br><br> Microsoft Defender for Cloud identity federation <br><br> CSPM identity pool <br><br>Microsoft Defender for Servers service account (when the servers plan is enabled) <br><br>*Azure Arc for servers onboarding* service account (when Azure Arc for servers autoprovisioning is enabled) | Microsoft Defender for Containers service account role <br><br> Microsoft Defender Data Collector service account role <br><br> Microsoft Defender for Cloud identity pool |

After you create the connector, a scan starts on your GCP environment. New recommendations appear in Defender for Cloud after up to 6 hours. If you enabled autoprovisioning, Azure Arc and any enabled extensions are installed automatically for each newly detected resource.

## Optional: Configure selected plans

By default, all plans are **On**. You can turn off plans that you don't need.

:::image type="content" source="media/quickstart-onboard-gcp/toggle-plans-to-on.png" alt-text="Screenshot that shows toggles turned on for all plans." lightbox="media/quickstart-onboard-gcp/toggle-plans-to-on.png":::

### Configure the Defender for Servers plan

Microsoft Defender for Servers brings threat detection and advanced defenses to your GCP virtual machine (VM) instances. To have full visibility into Microsoft Defender for Servers security content, connect your GCP VM instances to Azure Arc. If you choose the Microsoft Defender for Servers plan, you need:

- Microsoft Defender for Servers enabled on your subscription. Learn how to enable plans in [Enable enhanced security features](enable-enhanced-security.md).

- Azure Arc for servers installed on your VM instances.

We recommend that you use the autoprovisioning process to install Azure Arc on your VM instances. Autoprovisioning is enabled by default in the onboarding process and requires **Owner** permissions on the subscription. The Azure Arc autoprovisioning process uses the OS Config agent on the GCP end. [Learn more about the availability of the OS Config agent on GCP machines](https://cloud.google.com/compute/docs/images/os-details#vm-manager).

The Azure Arc autoprovisioning process uses the VM manager on GCP to enforce policies on your VMs through the OS Config agent. A VM that has an [active OS Config agent](https://cloud.google.com/compute/docs/manage-os#agent-state) incurs a cost according to GCP. To see how this cost might affect your account, refer to the [GCP technical documentation](https://cloud.google.com/compute/docs/vm-manager#pricing).

Microsoft Defender for Servers doesn't install the OS Config agent to a VM that doesn't have it installed. However, Microsoft Defender for Servers enables communication between the OS Config agent and the OS Config service if the agent is already installed but not communicating with the service. This communication can change the OS Config agent from `inactive` to `active` and lead to more costs.

Alternatively, you can manually connect your VM instances to Azure Arc for servers. Instances in projects with the Defender for Servers plan enabled that aren't connected to Azure Arc are surfaced by the recommendation **GCP VM instances should be connected to Azure Arc**. Select the **Fix** option in the recommendation to install Azure Arc on the selected machines.

The respective Azure Arc servers for EC2 instances or GCP virtual machines that no longer exist (and the respective Azure Arc servers with a status of [Disconnected or Expired](/azure/azure-arc/servers/overview)) are removed after seven days. This process removes irrelevant Azure Arc entities to ensure that only Azure Arc servers related to existing instances are displayed.

Ensure that you fulfill the [network requirements for Azure Arc](../azure-arc/servers/network-requirements.md?tabs=azure-cloud).

Enable these other extensions on the Azure Arc-connected machines:
  
- Microsoft Defender for Endpoint
- A vulnerability assessment solution (Microsoft Defender Vulnerability Management or Qualys)
- The Log Analytics agent on Azure Arc-connected machines or the Azure Monitor agent

Make sure the selected Log Analytics workspace has a security solution installed. The Log Analytics agent and the Azure Monitor agent are currently configured at the *subscription* level. All the multicloud accounts and projects (from both AWS and GCP) under the same subscription inherit the subscription settings for the Log Analytics agent and the Azure Monitor agent. [Learn more about monitoring components for Defender for Servers](monitoring-components.md).

Defender for Servers assigns tags to your GCP resources to manage the autoprovisioning process. You must have these tags properly assigned to your resources so that Defender for Servers can manage your resources: `Cloud`, `InstanceName`, `MDFCSecurityConnector`, `MachineId`, `ProjectId`, and `ProjectNumber`.

To configure the Defender for Servers plan:

1. Follow the [steps to connect your GCP project](#connect-your-gcp-project).

1. On the **Select plans** tab, select **Configure**.

    :::image type="content" source="media/quickstart-onboard-gcp/view-configuration.png" alt-text="Screenshot that shows the link for configuring the Defender for Servers plan.":::

1. On the **Auto-provisioning configuration** pane, turn the toggles to **On** or **Off**, depending on your need.

    :::image type="content" source="media/quickstart-onboard-gcp/auto-provision-screen.png" alt-text="Screenshot that shows the toggles for the Defender for Servers plan.":::

    If **Azure Arc agent** is **Off**, you need to follow the manual installation process mentioned earlier.

1. Select **Save**.

1. Continue from step 8 of the [Connect your GCP project](#connect-your-gcp-project) instructions.

### Configure the Defender for Databases plan

To have full visibility into Microsoft Defender for Databases security content, connect your GCP VM instances to Azure Arc.

To configure the Defender for Databases plan:

1. Follow the [steps to connect your GCP project](#connect-your-gcp-project).

1. On the **Select plans** tab, select **Configure**.

    :::image type="content" source="media/quickstart-onboard-gcp/view-configuration.png" alt-text="Screenshot that shows the link for configuring the Defender for Databases plan.":::

1. On the **Auto-provisioning configuration** pane, turn the toggles to **On** or **Off**, depending on your need.

    :::image type="content" source="media/quickstart-onboard-gcp/auto-provision-databases-screen.png" alt-text="Screenshot that shows the toggles for the Defender for Databases plan.":::

    If the toggle for Azure Arc is **Off**, you need to follow the manual installation process mentioned earlier.

1. Select **Save**.

1. Continue from step 8 of the [Connect your GCP project](#connect-your-gcp-project) instructions.

### Configure the Defender for Containers plan

Microsoft Defender for Containers brings threat detection and advanced defenses to your GCP Google Kubernetes Engine (GKE) Standard clusters. To get the full security value out of Defender for Containers and to fully protect GCP clusters, ensure that you meet the following requirements.

> [!NOTE]
>
> - If you choose to disable the available configuration options, no agents or components will be deployed to your clusters. [Learn more about feature availability](supported-machines-endpoint-solutions-clouds-containers.md).
> - Defender for Containers when deployed on GCP, may incur external costs such as [logging costs](https://cloud.google.com/stackdriver/pricing), [pub/sub costs](https://cloud.google.com/pubsub/pricing) and [egress costs](https://cloud.google.com/vpc/network-pricing#:~:text=Platform%20SKUs%20apply.-%2cInternet%20egress%20rates%2c-Premium%20Tier%20pricing).

- **Kubernetes audit logs to Defender for Cloud**: Enabled by default. This configuration is available at the GCP project level only. It provides agentless collection of the audit log data through [GCP Cloud Logging](https://cloud.google.com/logging/) to the Microsoft Defender for Cloud back end for further analysis.
- **Azure Arc-enabled Kubernetes, the Defender extension, and the Azure Policy extension**: Enabled by default. You can install Azure Arc-enabled Kubernetes and its extensions on your GKE clusters in three ways:
  - Enable Defender for Containers autoprovisioning at the project level, as explained in the instructions in this section. We recommend this method.
  - Use Defender for Cloud recommendations for per-cluster installation. They appear on the Microsoft Defender for Cloud recommendations page. [Learn how to deploy the solution to specific clusters](defender-for-containers-enable.md?tabs=defender-for-container-gke#deploy-the-solution-to-specific-clusters).
  - Manually install [Arc-enabled Kubernetes](../azure-arc/kubernetes/quickstart-connect-cluster.md) and [extensions](../azure-arc/kubernetes/extensions.md).

To configure the Defender for Containers plan:

1. Follow the steps to [connect your GCP project](#connect-your-gcp-project).

1. On the **Select plans** tab, select **Configure**.

    :::image type="content" source="media/quickstart-onboard-gcp/containers-configure.png" alt-text="Screenshot that shows the link for configuring the Defender for Containers plan.":::

1. On the **Defender for Containers configuration** pane, turn the toggles to **On**.

    :::image type="content" source="media/quickstart-onboard-gcp/containers-configuration.png" alt-text="Screenshot that shows toggles for the Defender for Containers plan.":::

1. Select **Save**.

1. Continue from step 8 of the [Connect your GCP project](#connect-your-gcp-project) instructions.

## Monitor your GCP resources

The security recommendations page in Defender for Cloud displays your GCP resources together with your Azure and AWS resources for a true multicloud view.

To view all the active recommendations for your resources by resource type, use the asset inventory page in Defender for Cloud and filter to the GCP resource type that you're interested in.

:::image type="content" source="./media/quickstart-onboard-gcp/gcp-resource-types-in-inventory.png" alt-text="Screenshot of GCP options in the asset inventory page's resource type filter." lightbox="media/quickstart-onboard-gcp/gcp-resource-types-in-inventory.png":::

## Next steps

Connecting your GCP project is part of the multicloud experience available in Microsoft Defender for Cloud:

- [Protect all of your resources with Defender for Cloud](enable-all-plans.md).
- Set up your [on-premises machines](quickstart-onboard-machines.md) and [AWS account](quickstart-onboard-aws.md).
- [Troubleshoot your multicloud connectors](troubleshooting-guide.md#troubleshooting-the-native-multicloud-connector).
- Get answers to [common questions](faq-general.yml) about connecting your GCP project.
