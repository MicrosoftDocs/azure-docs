---
title: Connect your GCP project to Microsoft Defender for Cloud
description: Monitoring your GCP resources from Microsoft Defender for Cloud
author: bmansheim
ms.author: benmansheim
ms.topic: quickstart
ms.date: 03/27/2022
zone_pivot_groups: connect-gcp-accounts
ms.custom: mode-other
---

#  Connect your GCP projects to Microsoft Defender for Cloud

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same.

Microsoft Defender for Cloud protects workloads in Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP).

To protect your GCP-based resources, you can connect an account in two different ways:

- **Classic cloud connectors experience** - As part of the initial multi-cloud offering, we introduced these cloud connectors as a way to connect your AWS and GCP projects.

- **Environment settings page** (Recommended) - This page provides the onboarding experience (including auto provisioning). This mechanism also extends Defender for Cloud's enhanced security features to your GCP resources:

    - **Defender for Cloud's CSPM features** extends to your GCP resources. This agentless plan assesses your GCP resources according to GCP-specific security recommendations and these are included in your secure score. The resources will also be assessed for compliance with built-in standards specific to GCP. Defender for Cloud's [asset inventory page](asset-inventory.md) is a multi-cloud enabled feature helping you manage your GCP resources alongside your Azure resources.
    - **Microsoft Defender for Servers** brings threat detection and advanced defenses to your GCP VM instances. This plan includes the integrated license for Microsoft Defender for Endpoint, security baselines and OS level assessments, vulnerability assessment scanning, adaptive application controls (AAC), file integrity monitoring (FIM), and more. You can view the full list of available features in the [Supported features for virtual machines and servers table](supported-machines-endpoint-solutions-clouds-servers.md)
    - **Microsoft Defender for Containers** - Microsoft Defender for Containers brings threat detection and advanced defenses to your Google's Kubernetes Engine (GKE) Standard clusters. This plan includes Kubernetes threat protection, behavioral analytics, Kubernetes best practices, admission control recommendations and more. You can view the full list of available features in [Defender for Containers feature availability](supported-machines-endpoint-solutions-clouds-containers.md).

:::image type="content" source="./media/quickstart-onboard-gcp/gcp-account-in-overview.png" alt-text="Screenshot of GCP projects shown in Microsoft Defender for Cloud's overview dashboard." lightbox="./media/quickstart-onboard-gcp/gcp-account-in-overview.png":::

::: zone pivot="env-settings"

## Availability

|Aspect|Details|
|----|:----|
| Release state: | Preview <br> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to the Azure features that are in beta, preview, or otherwise not yet released into general availability. |
|Pricing:|The **CSPM plan** is free.<br> The **Defender for Servers** plan is billed at the same price as the [Microsoft Defender for Servers](defender-for-servers-introduction.md) plan for Azure machines. If a GCP VM instance doesn't have the Azure Arc agent deployed, you won't be charged for that machine. <br>The **[Defender for Containers](defender-for-containers-introduction.md)** plan is free during the preview. After which, it will be billed for GCP at the same price as for Azure resources.|
|Required roles and permissions:| **Contributor** on the relevant Azure Subscription|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet, Other Gov)|


## Remove 'classic' connectors

If you have any existing connectors created with the classic cloud connectors experience, remove them first:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Defender for Cloud** > **Environment settings**.

1. Select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Switching back to the classic cloud connectors experience in Defender for Cloud.":::

1. For each connector, select the three dot button at the end of the row, and select **Delete**.

## Connect your GCP projects

When connecting your GCP projects to specific Azure subscriptions, consider the [Google Cloud resource hierarchy](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy#resource-hierarchy-detail) and these guidelines:

- You can connect your GCP projects to Microsoft Defender for Cloud on the project level.
- You can connect multiple projects to one Azure subscription.
- You can connect multiple projects to multiple Azure subscriptions.

Follow the steps below to create your GCP cloud connector. 

**To connect your GCP project**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Defender for Cloud** > **Environment settings**.

1. Select **+ Add environment**.

1. Select the **Google Cloud Platform**.

    :::image type="content" source="media/quickstart-onboard-gcp/google-cloud.png" border="false" alt-text="Screenshot of the location of the Google cloud environment button.":::

1. Enter all relevant information.

    :::image type="content" source="media/quickstart-onboard-gcp/create-connector.png" alt-text="Screenshot of the Create GCP connector page where you need to enter all relevant information.":::

1. Select the **Next: Select Plans**.

1. Toggle the plans you want to connect to **On**. By default all necessary prerequisites and components will be provisioned. (Optional) Learn how to [configure each plan](#optional-configure-selected-plans).

1. (**Containers only**) Ensure you have fulfilled the [network requirements](defender-for-containers-enable.md?tabs=defender-for-container-gcp#network-requirements) for the Defender for Containers plan.

1. Select the **Next: Configure access**.

1. Select **Copy**.

    :::image type="content" source="media/quickstart-onboard-gcp/copy-button.png" alt-text="Screenshot showing the location of the copy button.":::

1. Select the **GCP Cloud Shell >**.

1. The GCP Cloud Shell will open.

1. Paste the script into the Cloud Shell terminal and run it.

1. Ensure that the following resources were created:

    | CSPM | Defender for Containers|
    |--|--|
    | CSPM service account reader role <br> Microsoft Defender for Cloud identity federation <br> CSPM identity pool <br>*Microsoft Defender for Servers* service account (when the servers plan is enabled) <br>*Azure-Arc for servers onboarding* service account (when the Arc for servers auto-provisioning is enabled) | Microsoft Defender Containers’ service account role, <br> Microsoft Defender Data Collector service account role <br> microsoft defender for cloud identity pool |

1. (**Servers only**) When Arc auto-provisioning is enabled, copy the unique numeric ID presented at the end of the Cloud Shell script.

    :::image type="content" source="media/quickstart-onboard-gcp/powershell-unique-id.png" alt-text="Screenshot showing the unique numeric I D to be copied." lightbox="media/quickstart-onboard-gcp/powershell-unique-id-expanded.png":::

    To locate the unique numeric ID in the GCP portal, Navigate to **IAM & Admin** > **Service Accounts**, in the Name column, locate `Azure-Arc for servers onboarding` and copy the unique numeric ID number (OAuth 2 Client ID).

1. Navigate back to the Microsoft Defender for Cloud portal.

1. (Optional) If you changed any of the names of any of the resources, update the names in the appropriate fields.

1. (**Servers only**) Select **Azure-Arc for servers onboarding**

    :::image type="content" source="media/quickstart-onboard-gcp/unique-numeric-id.png" alt-text="Screenshot showing the Azure-Arc for servers onboarding section of the screen.":::

    Enter the service account unique ID, which is generated automatically after running the GCP Cloud Shell. 

1. Select the **Next: Review and generate >**.

1. Ensure the information presented is correct.

1. Select the **Create**. 

After creating a connector, a scan will start on your GCP environment. New recommendations will appear in Defender for Cloud after up to 6 hours. If you enabled auto-provisioning, Azure Arc, and any enabled extensions will install automatically for each new resource detected.

## (Optional) Configure selected plans

By default, all plans are toggled to `On`, on the plans select screen.

:::image type="content" source="media/quickstart-onboard-gcp/toggle-plans-to-on.png" alt-text="Screenshot showing that all plans are toggle to on.":::

### Configure the servers plan

Connect your GCP VM instances to Azure Arc in order to have full visibility to Microsoft Defender for Servers security content.

Microsoft Defender for Servers brings threat detection and advanced defenses to your GCP VMs instances.
To have full visibility to Microsoft Defender for Servers security content, ensure you have the following requirements configured:

- Microsoft Defender for Servers enabled on your subscription. Learn how to enable plans in the [Enable enhanced security features](enable-enhanced-security.md) article.

- Azure Arc for servers installed on your VM instances.
    - **(Recommended) Auto-provisioning** - Auto-provisioning is enabled by default in the onboarding process and requires owner permissions on the subscription. Arc auto-provisioning process is using the OS config agent on GCP end. Learn more about the [OS config agent availability on GCP machines](https://cloud.google.com/compute/docs/images/os-details#vm-manager).
    
    > [!NOTE]
    > The Arc auto-provisioning process leverages the VM manager on your Google Cloud Platform, to enforce policies on the your VMs through the OS config agent. A VM with an [Active OS agent](https://cloud.google.com/compute/docs/manage-os#agent-state), will incur a cost according to GCP. Refer to [GCP's technical documentation](https://cloud.google.com/compute/docs/vm-manager#pricing) to see how this may affect your account.
    > <br><br> Microsoft Defender for Servers does not install the OS config agent to a VM that does not have it installed. However, Microsoft Defender for Servers will enable communication between the OS config agent and the OS config service if the agent is already installed but not communicating with the service. 
    > <br><br> This can change the OS config agent from `inactive` to `active`, and will lead to additional costs.   

    - **Manual installation** - You can manually connect your VM instances to Azure Arc for servers. Instances in projects with Defender for Servers plan enabled that are not connected to Arc will be surfaced by the recommendation “GCP VM instances should be connected to Azure Arc”. Use the “Fix” option offered in this recommendation to install Azure Arc on the selected machines.

- Additional extensions should be enabled on the Arc-connected machines.
    - Microsoft Defender for Endpoint
    - VA solution (TVM/ Qualys)
    - Log Analytics (LA) agent on Arc machines. Ensure the selected workspace has security solution installed.
    
        The LA agent is currently configured in the subscription level, such that all the multi-cloud accounts and projects (from both AWS and GCP) under the same subscription will inherit the subscription settings with regards to the LA agent.

    Learn how to [configure auto-provisioning on your subscription](enable-data-collection.md#configure-auto-provisioning-for-agents-and-extensions-from-microsoft-defender-for-cloud).

    > [!NOTE]
    > Defender for Servers assigns tags to your GCP resources to manage the auto-provisioning process. You must have these tags properly assigned to your resources so that Defender for Cloud can manage your resources:
    **Cloud**, **InstanceName**, **MDFCSecurityConnector**, **MachineId**, **ProjectId**, **ProjectNumber**

**To configure the Servers plan**:

1. Follow the steps to [Connect your GCP project](#connect-your-gcp-project).

1. On the Select plans screen select **View configuration**.

    :::image type="content" source="media/quickstart-onboard-gcp/view-configuration.png" alt-text="Screenshot showing where to click to configure the Servers plan.":::

1. On the Auto provisioning screen, toggle the switches on, or off depending on your need.

    :::image type="content" source="media/quickstart-onboard-gcp/auto-provision-screen.png" alt-text="Screenshot showing the toggle switches for the Servers plan.":::

    > [!Note]
    > If Azure Arc is toggled **Off**, you will need to follow the manual installation process mentioned above. 

1. Select **Save**. 

1. Continue from step number 8, of the [Connect your GCP projects](#connect-your-gcp-projects) instructions. 

### Configure the Containers plan

Microsoft Defender for Containers brings threat detection, and advanced defenses to your GCP GKE Standard clusters. To get the full security value out of Defender for Containers, and to fully protect GCP clusters, ensure you have the following requirements configured:

- **Kubernetes audit logs to Defender for Cloud** - Enabled by default. This configuration is available at a GCP Project level only. This provides agentless collection of the audit log data through [GCP Cloud Logging](https://cloud.google.com/logging/) to the Microsoft Defender for Cloud backend for further analysis.
- **Azure Arc-enabled Kubernetes, the Defender extension, and the Azure Policy extension** - Enabled by default. You can install Azure Arc-enabled Kubernetes and its extensions on your GKE clusters in 3 different ways:
    - **(Recommended)** Enable the Defender for Container auto-provisioning at the project level as explained in the instructions below. 
    - Defender for Cloud recommendations, for per cluster installation, which will appear on the Microsoft Defender for Cloud's Recommendations page. Learn how to [deploy the solution to specific clusters](defender-for-containers-enable.md?tabs=defender-for-container-gke#deploy-the-solution-to-specific-clusters).
    - Manual installation for [Arc-enabled Kubernetes](../azure-arc/kubernetes/quickstart-connect-cluster.md), and [extensions](../azure-arc/kubernetes/extensions.md).

> [!Note]
> If you choose to disable the available configuration options, no agents, or components will be deployed to your clusters. Learn more about the [features availability](supported-machines-endpoint-solutions-clouds-containers.md).

**To configure the Containers plan**:

1. Follow the steps to [Connect your GCP project](#connect-your-gcp-project).

1. On the Select plans screen select **Configure**.

    :::image type="content" source="media/quickstart-onboard-gcp/containers-configure.png" alt-text="Screenshot showing where to click to configure the Containers plan.":::

1. On the Auto provisioning screen, toggle the switches **On**.

    :::image type="content" source="media/quickstart-onboard-gcp/containers-configuration.png" alt-text="Screenshot showing the toggle switches for the Containers plan.":::

1. Select **Save**.

1. Continue from step number 8, of the [Connect your GCP projects](#connect-your-gcp-projects) instructions. 

::: zone-end

::: zone pivot="classic-connector"

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|Requires [Microsoft Defender for Servers Plan 2](defender-for-servers-introduction.md#what-are-the-microsoft-defender-for-server-plans)|
|Required roles and permissions:|**Owner** or **Contributor** on the relevant Azure Subscription|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet)|


## Connect your GCP project

Create a connector for every organization you want to monitor from Defender for Cloud.

When connecting your GCP projects to specific Azure subscriptions, consider the [Google Cloud resource hierarchy](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy#resource-hierarchy-detail) and these guidelines:

- You can connect your GCP projects to Defender for Cloud in the *organization* level
- You can connect multiple organizations to one Azure subscription
- You can connect multiple organizations to multiple Azure subscriptions
- When you connect an organization, all *projects* within that organization are added to Defender for Cloud

Follow the steps below to create your GCP cloud connector. 

### Step 1. Set up GCP Security Command Center with Security Health Analytics

For all the GCP projects in your organization, you must also:

1. Set up **GCP Security Command Center** using [these instructions from the GCP documentation](https://cloud.google.com/security-command-center/docs/quickstart-scc-setup).
1. Enable **Security Health Analytics** using [these instructions from the GCP documentation](https://cloud.google.com/security-command-center/docs/how-to-use-security-health-analytics).
1. Verify that there is data flowing to the Security Command Center.

The instructions for connecting your GCP environment for security configuration follow Google's recommendations for consuming security configuration recommendations. The integration leverages Google Security Command Center and will consume additional resources that might impact your billing.

When you first enable Security Health Analytics, it might take several hours for data to be available.


### Step 2. Enable GCP Security Command Center API

1. From Google's **Cloud Console API Library**, select each project in the organization you want to connect to Microsoft Defender for Cloud.
1. In the API Library, find and select **Security Command Center API**.
1. On the API's page, select **ENABLE**.

Learn more about the [Security Command Center API](https://cloud.google.com/security-command-center/docs/reference/rest/).


### Step 3. Create a dedicated service account for the security configuration integration

1. In the **GCP Console**, select a project from the organization in which you're creating the required service account. 

    > [!NOTE]
    > When this service account is added at the organization level, it'll be used to access the data gathered by Security Command Center from all of the other enabled projects in the organization. 

1. In the **Navigation menu**, Under **IAM & admin** options, select **Service accounts**.
1. Select **CREATE SERVICE ACCOUNT**.
1. Enter an account name, and select **Create**.
1. Specify the **Role** as **Defender for Cloud Admin Viewer**, and select **Continue**.
1. The **Grant users access to this service account** section is optional. Select **Done**.
1. Copy the **Email value** of the created service account, and save it for later use.
1. In the **Navigation menu**, Under **IAM & admin** options, select **IAM**
    1. Switch to organization level.
    1. Select **ADD**.
    1. In the **New members** field, paste the **Email value** you copied earlier.
    1. Specify the role as **Defender for Cloud Admin Viewer** and then select **Save**.
        :::image type="content" source="./media/quickstart-onboard-gcp/iam-settings-gcp-permissions-admin-viewer.png" alt-text="Setting the relevant GCP permissions.":::


### Step 4. Create a private key for the dedicated service account
1. Switch to project level.
1. In the **Navigation menu**, Under **IAM & admin** options, select **Service accounts**.
1. Open the dedicated service account and select Edit.
1. In the **Keys** section, select **ADD KEY** and then **Create new key**.
1. In the Create private key screen, select **JSON**, and then select **CREATE**.
1. Save this JSON file for later use.


### Step 5. Connect GCP to Defender for Cloud
1. From Defender for Cloud's menu, open **Environment settings** and select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Switching back to the classic cloud connectors experience in Defender for Cloud.":::

1. Select add GCP project.
1. In the onboarding page, do the following and then select **Next**.
    1. Validate the chosen subscription.
    1. In the **Display name** field, enter a display name for the connector.
    1. In the **Organization ID** field, enter your organization's ID. If you don't know it, see [Creating and managing organizations](https://cloud.google.com/resource-manager/docs/creating-managing-organization).
    1. In the **Private key** file box, browse to the JSON file you downloaded in [Step 4. Create a private key for the dedicated service account](#step-4-create-a-private-key-for-the-dedicated-service-account).


### Step 6. Confirmation

When the connector is successfully created and GCP Security Command Center has been configured properly:

- The GCP CIS standard will be shown in the Defender for Cloud's regulatory compliance dashboard.
- Security recommendations for your GCP resources will appear in the Defender for Cloud portal and the regulatory compliance dashboard 5-10 minutes after onboard completes:
    :::image type="content" source="./media/quickstart-onboard-gcp/gcp-resources-in-recommendations.png" alt-text="GCP resources and recommendations in Defender for Cloud's recommendations page":::

::: zone-end

## Monitor your GCP resources

As shown above, Microsoft Defender for Cloud's security recommendations page displays your GCP resources together with your Azure and AWS resources for a true multi-cloud view.

To view all the active recommendations for your resources by resource type, use Defender for Cloud's asset inventory page and filter to the GCP resource type in which you're interested:

:::image type="content" source="./media/quickstart-onboard-gcp/gcp-resource-types-in-inventory.png" alt-text="Asset inventory page's resource type filter showing the GCP options"::: 


## FAQ - Connecting GCP projects to Microsoft Defender for Cloud

### Is there an API for connecting my GCP resources to Defender for Cloud?
Yes. To create, edit, or delete Defender for Cloud cloud connectors with a REST API, see the details of the [Connectors API](/rest/api/securitycenter/security-connectors).

## Next steps

Connecting your GCP project is part of the multi-cloud experience available in Microsoft Defender for Cloud. For related information, see the following page:

- [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)
- [Google Cloud resource hierarchy](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy)--Learn about the Google Cloud resource hierarchy in Google's online docs
