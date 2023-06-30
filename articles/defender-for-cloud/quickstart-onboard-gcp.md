---
title: Connect your GCP project to Microsoft Defender for Cloud
description: Defend your GCP resources with Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 06/28/2023
---

# Set up your GCP projects

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same. Microsoft Defender for Cloud protects workloads in Google Cloud Platform (GCP), but you need to set up the connection between them to your Azure subscription.

> [!NOTE]
> If you are connecting an GCP project that was previously connected with the classic connector, you must [remove them](how-to-use-the-classic-connector.md#remove-classic-gcp-connectors) first. Using a GCP project that is connected by both the classic and native connectors can produce duplicate recommendations.

This screenshot shows AWS accounts displayed in Defender for Cloud's [overview dashboard](overview-page.md).

:::image type="content" source="./media/quickstart-onboard-gcp/gcp-account-in-overview.png" alt-text="Screenshot of GCP projects shown in Microsoft Defender for Cloud's overview dashboard." lightbox="media/quickstart-onboard-gcp/gcp-account-in-overview.png":::

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [Set up Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- Access to a GCP project.

- Required roles and permissions: **Contributor** on the relevant Azure Subscription **Owner** on the GCP organization or project.

You can learn more about Defender for Cloud's pricing on [the pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

When connecting your GCP projects to specific Azure subscriptions, consider the [Google Cloud resource hierarchy](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy#resource-hierarchy-detail) and these guidelines:

- You can connect your GCP projects to Microsoft Defender for Cloud on the project level.
- You can connect multiple projects to one Azure subscription.
- You can connect multiple projects to multiple Azure subscriptions.

## Connect your GCP project

**To connect your GCP project to Defender for Cloud with a native connector**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Defender for Cloud** > **Environment settings**.

1. Select **+ Add environment** > **Google Cloud Platform**.

    :::image type="content" source="media/quickstart-onboard-gcp/google-cloud.png" alt-text="Screenshot of the location of the Google cloud environment button."  lightbox="media/quickstart-onboard-gcp/google-cloud.png":::

1. Enter all relevant information.

    :::image type="content" source="media/quickstart-onboard-gcp/create-connector.png" alt-text="Screenshot of the Create GCP connector page where you need to enter all relevant information." lightbox="media/quickstart-onboard-gcp/create-connector.png":::

   (Optional) If you select **Organization**, a management project and an organization custom role is created on your GCP project for the onboarding process. Autoprovisioning is enabled for the onboarding of new projects.

1. Select the **Next: Select Plans**.

1. Toggle the plans you want to connect to **On**. By default all necessary prerequisites and components are provisioned. (Optional) Learn how to [configure each plan](#optional-configure-selected-plans).

    - Optional (**Containers only**) Ensure you've fulfilled the [network requirements](defender-for-containers-enable.md?tabs=defender-for-container-gcp#network-requirements) for the Defender for Containers plan.

1. Select the **Next: Configure access**.

    1. Choose deployment type, **Default access** or **Least privilege access**.

        - Default access - Allows Defender for Cloud to scan your resources and automatically include future capabilities.
        - Least privileged access - Grants Defender for Cloud access only to the current permissions needed for the selected plans. If you select the least privileged permissions, you receive notifications on any new roles and permissions that are required to get full functionality on the connector health section.

    1. Choose deployment method: **GCP Cloud Shell** or **Terraform**.

1. Select **Copy**.

    :::image type="content" source="media/quickstart-onboard-gcp/copy-button.png" alt-text="Screenshot showing the location of the copy button.":::

   > [!NOTE] 
   > To discover GCP resources and for the authentication process, the following APIs must be enabled: `iam.googleapis.com`, `sts.googleapis.com`, `cloudresourcemanager.googleapis.com`, `iamcredentials.googleapis.com`, `compute.googleapis.com`. If these APIs are not enabled, we'll enable them during the onboarding process by running the GCloud script.

1. Select **GCP Cloud Shell >**, the GCP Cloud Shell opens.

1. Paste the script into the Cloud Shell terminal and run it.

1. Ensure that the following resources were created:

    | CSPM | Defender for Containers|
    |--|--|
    | CSPM service account reader role <br><br> Microsoft Defender for Cloud identity federation <br><br> CSPM identity pool <br><br>*Microsoft Defender for Servers* service account (when the servers plan is enabled) <br><br>*Azure-Arc for servers onboarding* service account (when the Arc for servers autoprovisioning is enabled) | Microsoft Defender Containers’ service account role <br><br> Microsoft Defender Data Collector service account role <br><br> Microsoft Defender for Cloud identity pool |

Once the connector is created, a scan starts on your GCP environment. New recommendations will appear in Defender for Cloud after up to 6 hours. If you enabled autoprovisioning, Azure Arc and any enabled extensions install automatically for each new resource detected.

## (Optional) Configure selected plans

By default, all plans are `On`. You can disable plans that you don't need.

:::image type="content" source="media/quickstart-onboard-gcp/toggle-plans-to-on.png" alt-text="Screenshot showing that all plans are toggle to on." lightbox="media/quickstart-onboard-gcp/toggle-plans-to-on.png":::

Connect your GCP VM instances to Azure Arc in order to have full visibility to Microsoft Defender for Servers security content.

Microsoft Defender for Servers brings threat detection and advanced defenses to your GCP VMs instances.
To have full visibility to Microsoft Defender for Servers security content, ensure you have the following requirements configured:

- Microsoft Defender for Servers enabled on your subscription. Learn how to enable plans in the [Enable enhanced security features](enable-enhanced-security.md) article.

- Azure Arc for servers installed on your VM instances.
  - **(Recommended) Auto-provisioning** - Autoprovisioning is enabled by default in the onboarding process and requires owner permissions on the subscription. Arc autoprovisioning process is using the OS config agent on GCP end. Learn more about the [OS config agent availability on GCP machines](https://cloud.google.com/compute/docs/images/os-details#vm-manager).

    > [!NOTE]
    > The Arc auto-provisioning process leverages the VM manager on your Google Cloud Platform to enforce policies on the your VMs through the OS config agent. A VM with an [Active OS agent](https://cloud.google.com/compute/docs/manage-os#agent-state) will incur a cost according to GCP. Refer to [GCP's technical documentation](https://cloud.google.com/compute/docs/vm-manager#pricing) to see how this may affect your account.
    > <br><br> Microsoft Defender for Servers does not install the OS config agent to a VM that does not have it installed. However, Microsoft Defender for Servers will enable communication between the OS config agent and the OS config service if the agent is already installed but not communicating with the service.
    > <br><br> This can change the OS config agent from `inactive` to `active` and will lead to additional costs.

    - **Manual installation** - You can manually connect your VM instances to Azure Arc for servers. Instances in projects with Defender for Servers plan enabled that aren't connected to Arc are surfaced by the recommendation `GCP VM instances should be connected to Azure Arc`. Select the **Fix** option in the recommendation to install Azure Arc on the selected machines.

    > [!NOTE]
    > The respective Azure Arc servers for EC2 instances or GCP virtual machines that no longer exist (and the respective Azure Arc servers with a status of ["Disconnected" or "Expired"](/azure/azure-arc/servers/overview)) will be removed after 7 days. This process removes irrelevant Azure ARC entities, ensuring only Azure Arc servers related to existing instances are displayed.

- Ensure you've fulfilled the [network requirements for Azure Arc](../azure-arc/servers/network-requirements.md?tabs=azure-cloud).

- Other extensions should be enabled on the Arc-connected machines.
  - Microsoft Defender for Endpoint
  - VA solution (Microsoft Defender Vulnerability Management/ Qualys)
  - Log Analytics (LA) agent on Arc machines or Azure Monitor agent (AMA). Ensure the selected workspace has security solution installed.

      The LA agent and AMA are currently configured in the subscription level, such that all the multicloud accounts and projects (from both AWS and GCP) under the same subscription inherits the subscription settings regarding the LA agent and AMA.

      Learn more about [monitoring components](monitoring-components.md) for Defender for Cloud.

    > [!NOTE]
    > Defender for Servers assigns tags to your GCP resources to manage the auto-provisioning process. You must have these tags properly assigned to your resources so that Defender for Cloud can manage your resources:
    **Cloud**, **InstanceName**, **MDFCSecurityConnector**, **MachineId**, **ProjectId**, **ProjectNumber**

### Configure the servers plan

Connect your GCP VM instances to Azure Arc in order to have full visibility to Microsoft Defender for Servers security content.

**To configure the Servers plan**:

1. Follow the steps to [Connect your GCP project](#connect-your-gcp-project).

1. On the Select plans screen select **View configuration**.

    :::image type="content" source="media/quickstart-onboard-gcp/view-configuration.png" alt-text="Screenshot showing where to select to configure the Servers plan.":::

1. On the Auto provisioning screen, toggle the switches on or off depending on your need.

    :::image type="content" source="media/quickstart-onboard-gcp/auto-provision-screen.png" alt-text="Screenshot showing the toggle switches for the Servers plan.":::

    > [!Note]
    > If Azure Arc is toggled **Off**, you will need to follow the manual installation process mentioned above. 

1. Select **Save**.

1. Continue from step number 8 of the [Connect your GCP project](#connect-your-gcp-project) instructions.

### Configure the Databases plan

**To configure the Databases plan**:

Connect your GCP VM instances to Azure Arc in order to have full visibility to Microsoft Defender for SQL security content. 

**To configure the Databases plan**:

1. Follow the steps to [Connect your GCP project](#connect-your-gcp-project).

1. On the Select plans screen select **Configure**.

    :::image type="content" source="media/quickstart-onboard-gcp/view-configuration.png" alt-text="Screenshot showing where to select to configure the Databases plan.":::

1. On the Auto provisioning screen, toggle the switches on or off depending on your need.

    :::image type="content" source="media/quickstart-onboard-gcp/auto-provision-databases-screen.png" alt-text="Screenshot showing the toggle switches for the Databases plan.":::

    > [!Note]
    > If Azure Arc is toggled **Off**, you will need to follow the manual installation process mentioned above.

1. Select **Save**. 

1. Continue from step number 8 of the [Connect your GCP project](#connect-your-gcp-project) instructions. 

### Configure the Containers plan

Microsoft Defender for Containers brings threat detection and advanced defenses to your GCP GKE Standard clusters. To get the full security value out of Defender for Containers and to fully protect GCP clusters, ensure you have the following requirements configured:

> [!NOTE]
> If you choose to disable the available configuration options, no agents or components will be deployed to your clusters. Learn more about [feature availability](supported-machines-endpoint-solutions-clouds-containers.md).

- **Kubernetes audit logs to Defender for Cloud** - Enabled by default. This configuration is available at a GCP project level only. This provides agentless collection of the audit log data through [GCP Cloud Logging](https://cloud.google.com/logging/) to the Microsoft Defender for Cloud backend for further analysis.
- **Azure Arc-enabled Kubernetes, the Defender extension, and the Azure Policy extension** - Enabled by default. You can install Azure Arc-enabled Kubernetes and its extensions on your GKE clusters in three different ways:
  - **(Recommended)** Enable the Defender for Container autoprovisioning at the project level as explained in the instructions on this page.
  - Defender for Cloud recommendations, for per cluster installation, which appears on the Microsoft Defender for Cloud's Recommendations page. Learn how to [deploy the solution to specific clusters](defender-for-containers-enable.md?tabs=defender-for-container-gke#deploy-the-solution-to-specific-clusters).
  - Manual installation for [Arc-enabled Kubernetes](../azure-arc/kubernetes/quickstart-connect-cluster.md) and [extensions](../azure-arc/kubernetes/extensions.md).

**To configure the Containers plan**:

1. Follow the steps to [Connect your GCP project](#connect-your-gcp-project).

1. On the Select plans screen select **Configure**.

    :::image type="content" source="media/quickstart-onboard-gcp/containers-configure.png" alt-text="Screenshot showing where to select to configure the Containers plan.":::

1. On the Auto provisioning screen, toggle the switches **On**.

    :::image type="content" source="media/quickstart-onboard-gcp/containers-configuration.png" alt-text="Screenshot showing the toggle switches for the Containers plan.":::

1. Select **Save**.

1. Continue from step number 8 of the [Connect your GCP project](#connect-your-gcp-project) instructions. 

## Monitor your GCP resources

Microsoft Defender for Cloud's security recommendations page displays your GCP resources together with your Azure and AWS resources for a true multicloud view.

To view all the active recommendations for your resources by resource type, use Defender for Cloud's asset inventory page and filter to the GCP resource type that you're interested in:

:::image type="content" source="./media/quickstart-onboard-gcp/gcp-resource-types-in-inventory.png" alt-text="Asset inventory page's resource type filter showing the GCP options" lightbox="media/quickstart-onboard-gcp/gcp-resource-types-in-inventory.png":::

## Next steps

Connecting your GCP project is part of the multicloud experience available in Microsoft Defender for Cloud. For related information, see the following pages:

- [Protect all of your resources with Defender for Cloud](enable-all-plans.md).

- Set up your [on-premises machines](quickstart-onboard-machines.md), [AWS account](quickstart-onboard-aws.md).

- [Troubleshoot your multicloud connectors](troubleshooting-guide.md#troubleshooting-the-native-multicloud-connector).

- Check out [common questions](faq-general.yml) about connecting your GCP project.
