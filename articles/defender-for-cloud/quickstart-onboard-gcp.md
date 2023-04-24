---
title: Connect your GCP project to Microsoft Defender for Cloud
description: Monitoring your GCP resources from Microsoft Defender for Cloud
ms.topic: quickstart
ms.date: 01/25/2023
zone_pivot_groups: connect-gcp-accounts
ms.custom: mode-other, ignite-2022
---

# Quickstart: Connect your GCP projects to Microsoft Defender for Cloud

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same. Microsoft Defender for Cloud protects workloads in Azure, Amazon Web Services (AWS), Google Cloud Platform (GCP), GitHub and Azure DevOps (ADO).

To protect your GCP-based resources, you can connect a GCP project with either:

- **Native cloud connector** (recommended) - Provides an agentless connection to your GCP account that you can extend with Defender for Cloud's Defender plans to secure your GCP resources:

    - [**Cloud Security Posture Management (CSPM)**](overview-page.md) assesses your GCP resources according to GCP-specific security recommendations and reflects your security posture in your secure score. The resources are shown in Defender for Cloud's [asset inventory](asset-inventory.md) and are assessed for compliance with built-in standards specific to GCP.
    - [**Microsoft Defender for Servers**](defender-for-servers-introduction.md) brings threat detection and advanced defenses to [supported Windows and Linux VM instances](supported-machines-endpoint-solutions-clouds-servers.md?tabs=tab/features-multicloud). This plan includes the integrated license for Microsoft Defender for Endpoint, security baselines and OS level assessments, vulnerability assessment scanning, adaptive application controls (AAC), file integrity monitoring (FIM), and more.
    - [**Microsoft Defender for Containers**](defender-for-containers-introduction.md) brings threat detection and advanced defenses to [supported Google GKE clusters](supported-machines-endpoint-solutions-clouds-containers.md). This plan includes Kubernetes threat protection, behavioral analytics, Kubernetes best practices, admission control recommendations, and more.
    - [**Microsoft Defender for SQL**](defender-for-sql-introduction.md) brings threat detection and advanced defenses to your SQL Servers running on GCP compute engine instances, including the advanced threat protection and vulnerability assessment scanning.

- **Classic cloud connector** - Requires configuration in your GCP project to create a user that Defender for Cloud can use to connect to your GCP environment. If you have classic cloud connectors, we recommend that you [delete these connectors](#remove-classic-connectors) and use the native connector to reconnect to the project. Using both the classic and native connectors can produce duplicate recommendations.

> [!NOTE]
> The option to select the classic connector is only available if you previously onboarded a GCP project using the classic connector.
>
> If you have classic cloud connectors, we recommend that you [delete these connectors](#remove-classic-connectors), and use the native connector to reconnect to the account. Using both the classic and native connectors can produce duplicate recommendations.

:::image type="content" source="./media/quickstart-onboard-gcp/gcp-account-in-overview.png" alt-text="Screenshot of GCP projects shown in Microsoft Defender for Cloud's overview dashboard." lightbox="media/quickstart-onboard-gcp/gcp-account-in-overview.png":::

::: zone pivot="env-settings"

## Availability

|Aspect|Details|
|----|:----|
| Release state: | Preview <br> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to the Azure features that are in beta, preview, or otherwise not yet released into general availability. |
|Pricing:|The **[Defender for SQL](defender-for-sql-introduction.md)** plan is billed at the same price as Azure resources.<br> The **Defender for Servers** plan is billed at the same price as the [Microsoft Defender for Servers](defender-for-servers-introduction.md) plan for Azure machines. If a GCP VM instance doesn't have the Azure Arc agent deployed, you won't be charged for that machine. <br>The **[Defender for Containers](defender-for-containers-introduction.md)** plan is free during the preview. After which, it will be billed for GCP at the same price as for Azure resources.|
|Required roles and permissions:| **Contributor** on the relevant Azure Subscription <br> **Owner** on the GCP organization or project| 
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet, Other Gov)|

## Connect your GCP projects

When connecting your GCP projects to specific Azure subscriptions, consider the [Google Cloud resource hierarchy](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy#resource-hierarchy-detail) and these guidelines:

- You can connect your GCP projects to Microsoft Defender for Cloud on the project level.
- You can connect multiple projects to one Azure subscription.
- You can connect multiple projects to multiple Azure subscriptions.

Follow the steps below to create your GCP cloud connector. 

**To connect your GCP project to Defender for Cloud with a native connector**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Defender for Cloud** > **Environment settings**.

1. Select **+ Add environment**.

1. Select the **Google Cloud Platform**.

    :::image type="content" source="media/quickstart-onboard-gcp/google-cloud.png" alt-text="Screenshot of the location of the Google cloud environment button."  lightbox="media/quickstart-onboard-gcp/google-cloud.png":::

1. Enter all relevant information.

    :::image type="content" source="media/quickstart-onboard-gcp/create-connector.png" alt-text="Screenshot of the Create GCP connector page where you need to enter all relevant information." lightbox="media/quickstart-onboard-gcp/create-connector.png":::

   (Optional) If you select **Organization**, a management project and an organization custom role will be created on your GCP project for the onboarding process. Auto-provisioning will be enabled for the onboarding of new projects.

1. Select the **Next: Select Plans**.

1. Toggle the plans you want to connect to **On**. By default all necessary prerequisites and components will be provisioned. (Optional) Learn how to [configure each plan](#optional-configure-selected-plans).

    1. (**Containers only**) Ensure you've fulfilled the [network requirements](defender-for-containers-enable.md?tabs=defender-for-container-gcp#network-requirements) for the Defender for Containers plan.

1. Select the **Next: Configure access**.

1. Select **Copy**.

    :::image type="content" source="media/quickstart-onboard-gcp/copy-button.png" alt-text="Screenshot showing the location of the copy button.":::

   > [!NOTE] 
   > To discover GCP resources and for the authentication process, the following APIs must be enabled: `iam.googleapis.com`, `sts.googleapis.com`, `cloudresourcemanager.googleapis.com`, `iamcredentials.googleapis.com`, `compute.googleapis.com`. If these APIs are not enabled, we'll enable them during the onboarding process by running the GCloud script.

1. Select the **GCP Cloud Shell >**.

1. The GCP Cloud Shell will open.

1. Paste the script into the Cloud Shell terminal and run it.

1. Ensure that the following resources were created:

    | CSPM | Defender for Containers|
    |--|--|
    | CSPM service account reader role <br> Microsoft Defender for Cloud identity federation <br> CSPM identity pool <br>*Microsoft Defender for Servers* service account (when the servers plan is enabled) <br>*Azure-Arc for servers onboarding* service account (when the Arc for servers auto-provisioning is enabled) | Microsoft Defender Containers’ service account role <br> Microsoft Defender Data Collector service account role <br> Microsoft Defender for Cloud identity pool |

After creating a connector, a scan will start on your GCP environment. New recommendations will appear in Defender for Cloud after up to 6 hours. If you enabled auto-provisioning, Azure Arc and any enabled extensions will install automatically for each new resource detected.

## (Optional) Configure selected plans

By default, all plans are `On`. You can disable plans that you don't need.

:::image type="content" source="media/quickstart-onboard-gcp/toggle-plans-to-on.png" alt-text="Screenshot showing that all plans are toggle to on." lightbox="media/quickstart-onboard-gcp/toggle-plans-to-on.png":::

### Configure the servers plan

Connect your GCP VM instances to Azure Arc in order to have full visibility to Microsoft Defender for Servers security content.

Microsoft Defender for Servers brings threat detection and advanced defenses to your GCP VMs instances.
To have full visibility to Microsoft Defender for Servers security content, ensure you have the following requirements configured:

- Microsoft Defender for Servers enabled on your subscription. Learn how to enable plans in the [Enable enhanced security features](enable-enhanced-security.md) article.

- Azure Arc for servers installed on your VM instances.
    - **(Recommended) Auto-provisioning** - Auto-provisioning is enabled by default in the onboarding process and requires owner permissions on the subscription. Arc auto-provisioning process is using the OS config agent on GCP end. Learn more about the [OS config agent availability on GCP machines](https://cloud.google.com/compute/docs/images/os-details#vm-manager).
    
    > [!NOTE]
    > The Arc auto-provisioning process leverages the VM manager on your Google Cloud Platform to enforce policies on the your VMs through the OS config agent. A VM with an [Active OS agent](https://cloud.google.com/compute/docs/manage-os#agent-state) will incur a cost according to GCP. Refer to [GCP's technical documentation](https://cloud.google.com/compute/docs/vm-manager#pricing) to see how this may affect your account.
    > <br><br> Microsoft Defender for Servers does not install the OS config agent to a VM that does not have it installed. However, Microsoft Defender for Servers will enable communication between the OS config agent and the OS config service if the agent is already installed but not communicating with the service. 
    > <br><br> This can change the OS config agent from `inactive` to `active` and will lead to additional costs.   

    - **Manual installation** - You can manually connect your VM instances to Azure Arc for servers. Instances in projects with Defender for Servers plan enabled that aren't connected to Arc will be surfaced by the recommendation “GCP VM instances should be connected to Azure Arc”. Use the “Fix” option offered in this recommendation to install Azure Arc on the selected machines.

- Ensure you've fulfilled the [network requirements for Azure Arc](../azure-arc/servers/network-requirements.md?tabs=azure-cloud).

- Other extensions should be enabled on the Arc-connected machines.
    - Microsoft Defender for Endpoint
    - VA solution (TVM/ Qualys)
    - Log Analytics (LA) agent on Arc machines or Azure Monitor agent (AMA). Ensure the selected workspace has security solution installed.
    
        The LA agent and AMA are currently configured in the subscription level, such that all the multicloud accounts and projects (from both AWS and GCP) under the same subscription will inherit the subscription settings regarding the LA agent and AMA.

        Learn more about [monitoring components](monitoring-components.md) for Defender for Cloud.

    > [!NOTE]
    > Defender for Servers assigns tags to your GCP resources to manage the auto-provisioning process. You must have these tags properly assigned to your resources so that Defender for Cloud can manage your resources:
    **Cloud**, **InstanceName**, **MDFCSecurityConnector**, **MachineId**, **ProjectId**, **ProjectNumber**

**To configure the Servers plan**:

1. Follow the steps to [Connect your GCP project](#connect-your-gcp-project).

1. On the Select plans screen select **View configuration**.

    :::image type="content" source="media/quickstart-onboard-gcp/view-configuration.png" alt-text="Screenshot showing where to select to configure the Servers plan.":::

1. On the Auto provisioning screen, toggle the switches on or off depending on your need.

    :::image type="content" source="media/quickstart-onboard-gcp/auto-provision-screen.png" alt-text="Screenshot showing the toggle switches for the Servers plan.":::

    > [!Note]
    > If Azure Arc is toggled **Off**, you will need to follow the manual installation process mentioned above. 

1. Select **Save**. 

1. Continue from step number 8 of the [Connect your GCP projects](#connect-your-gcp-projects) instructions. 

### Configure the Databases plan

Connect your GCP VM instances to Azure Arc in order to have full visibility to Microsoft Defender for SQL security content.

Microsoft Defender for SQL brings threat detection and vulnerability assessment to your GCP VM instances.
To have full visibility to Microsoft Defender for SQL security content, ensure you have the following requirements configured:

- Microsoft SQL servers on machines plan enabled on your subscription. Learn how to enable plan in the [Enable enhanced security features](quickstart-enable-database-protections.md) article.

- Azure Arc for servers installed on your VM instances.
    - **(Recommended) Auto-provisioning** - Auto-provisioning is enabled by default in the onboarding process and requires owner permissions on the subscription. Arc auto-provisioning process is using the OS config agent on GCP end. Learn more about the [OS config agent availability on GCP machines](https://cloud.google.com/compute/docs/images/os-details#vm-manager).

    > [!NOTE]
    > The Arc auto-provisioning process leverages the VM manager on your Google Cloud Platform, to enforce policies on the your VMs through the OS config agent. A VM with an [Active OS agent](https://cloud.google.com/compute/docs/manage-os#agent-state) will incur a cost according to GCP. Refer to [GCP's technical documentation](https://cloud.google.com/compute/docs/vm-manager#pricing) to see how this may affect your account.
    > <br><br> Microsoft Defender for Servers does not install the OS config agent to a VM that does not have it installed. However, Microsoft Defender for Servers will enable communication between the OS config agent and the OS config service if the agent is already installed but not communicating with the service. 
    > <br><br> This can change the OS config agent from `inactive` to `active` and will lead to additional costs.   
- Other extensions should be enabled on the Arc-connected machines.
    - SQL servers on machines. Ensure the plan is enabled on your subscription.    
    - Log Analytics (LA) agent on Arc machines. Ensure the selected workspace has security solution installed.

        The LA agent and SQL servers on machines plan are currently configured in the subscription level, such that all the multicloud accounts and projects (from both AWS and GCP) under the same subscription will inherit the subscription settings and may result in extra charges.

        Learn more about [monitoring components](monitoring-components.md) for Defender for Cloud.

    > [!NOTE]
    > Defender for SQL assigns tags to your GCP resources to manage the auto-provisioning process. You must have these tags properly assigned to your resources so that Defender for Cloud can manage your resources:
    **Cloud**, **InstanceName**, **MDFCSecurityConnector**, **MachineId**, **ProjectId**, **ProjectNumber**
- Automatic SQL server discovery and registration. Enable these settings to allow automatic discovery and registration of SQL servers, providing centralized SQL asset inventory and management. 

**To configure the Databases plan**:

1. Follow the steps to [Connect your GCP project](#connect-your-gcp-project).

1. On the Select plans screen select **Configure**.

    :::image type="content" source="media/quickstart-onboard-gcp/view-configuration.png" alt-text="Screenshot showing where to select to configure the Databases plan.":::

1. On the Auto provisioning screen, toggle the switches on or off depending on your need.

    :::image type="content" source="media/quickstart-onboard-gcp/auto-provision-databases-screen.png" alt-text="Screenshot showing the toggle switches for the Databases plan.":::

    > [!Note]
    > If Azure Arc is toggled **Off**, you will need to follow the manual installation process mentioned above.

1. Select **Save**. 

1. Continue from step number 8 of the [Connect your GCP projects](#connect-your-gcp-projects) instructions. 

### Configure the Containers plan

Microsoft Defender for Containers brings threat detection and advanced defenses to your GCP GKE Standard clusters. To get the full security value out of Defender for Containers and to fully protect GCP clusters, ensure you have the following requirements configured:

- **Kubernetes audit logs to Defender for Cloud** - Enabled by default. This configuration is available at a GCP project level only. This provides agentless collection of the audit log data through [GCP Cloud Logging](https://cloud.google.com/logging/) to the Microsoft Defender for Cloud backend for further analysis.
- **Azure Arc-enabled Kubernetes, the Defender extension, and the Azure Policy extension** - Enabled by default. You can install Azure Arc-enabled Kubernetes and its extensions on your GKE clusters in three different ways:
    - **(Recommended)** Enable the Defender for Container auto-provisioning at the project level as explained in the instructions below. 
    - Defender for Cloud recommendations, for per cluster installation, which will appear on the Microsoft Defender for Cloud's Recommendations page. Learn how to [deploy the solution to specific clusters](defender-for-containers-enable.md?tabs=defender-for-container-gke#deploy-the-solution-to-specific-clusters).
    - Manual installation for [Arc-enabled Kubernetes](../azure-arc/kubernetes/quickstart-connect-cluster.md) and [extensions](../azure-arc/kubernetes/extensions.md).

> [!NOTE]
> If you choose to disable the available configuration options, no agents or components will be deployed to your clusters. Learn more about [feature availability](supported-machines-endpoint-solutions-clouds-containers.md).

**To configure the Containers plan**:

1. Follow the steps to [Connect your GCP project](#connect-your-gcp-project).

1. On the Select plans screen select **Configure**.

    :::image type="content" source="media/quickstart-onboard-gcp/containers-configure.png" alt-text="Screenshot showing where to select to configure the Containers plan.":::

1. On the Auto provisioning screen, toggle the switches **On**.

    :::image type="content" source="media/quickstart-onboard-gcp/containers-configuration.png" alt-text="Screenshot showing the toggle switches for the Containers plan.":::

1. Select **Save**.

1. Continue from step number 8 of the [Connect your GCP projects](#connect-your-gcp-projects) instructions. 

### Remove 'classic' connectors

If you have any existing connectors created with the classic cloud connectors experience, remove them first:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Defender for Cloud** > **Environment settings**.

1. Select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Switching back to the classic cloud connectors experience in Defender for Cloud.":::

1. For each connector, select the three dot button at the end of the row, and select **Delete**.

::: zone-end

::: zone pivot="classic-connector"

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|Requires [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features)|
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
1. Verify that there's data flowing to the Security Command Center.

The instructions for connecting your GCP environment for security configuration follow Google's recommendations for consuming security configuration recommendations. The integration applies Google Security Command Center and will consume other resources that might impact your billing.

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

1. In the **IAM & admin** section of the navigation menu, select **Service accounts**.
1. Select **CREATE SERVICE ACCOUNT**.
1. Enter an account name, and select **Create**.
1. Specify the **Role** as **Defender for Cloud Admin Viewer**, and select **Continue**.
1. The **Grant users access to this service account** section is optional. Select **Done**.
1. Copy the **Email value** of the created service account, and save it for later use.
1. In the **IAM & admin** section of the navigation menu, select **IAM**.
    1. Switch to organization level.
    1. Select **ADD**.
    1. In the **New members** field, paste the **Email value** you copied earlier.
    1. Specify the role as **Defender for Cloud Admin Viewer** and then select **Save**.
        :::image type="content" source="./media/quickstart-onboard-gcp/iam-settings-gcp-permissions-admin-viewer.png" alt-text="Setting the relevant GCP permissions.":::


### Step 4. Create a private key for the dedicated service account
1. Switch to project level.
1. In the **IAM & admin** section of the navigation menu, select **Service accounts**.
1. Open the dedicated service account and select Edit.
1. In the **Keys** section, select **ADD KEY** and then **Create new key**.
1. In the Create private key screen, select **JSON** and then select **CREATE**.
1. Save this JSON file for later use.


### Step 5. Connect GCP to Defender for Cloud
1. From Defender for Cloud's menu, open **Environment settings** and select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Switching back to the classic cloud connectors experience in Defender for Cloud.":::

1. Select add GCP project.
1. In the onboarding page:
    1. Validate the chosen subscription.
    1. In the **Display name** field, enter a display name for the connector.
    1. In the **Organization ID** field, enter your organization's ID. If you don't know it, see [Creating and managing organizations](https://cloud.google.com/resource-manager/docs/creating-managing-organization).
    1. In the **Private key** file box, browse to the JSON file you downloaded in [Step 4. Create a private key for the dedicated service account](#step-4-create-a-private-key-for-the-dedicated-service-account).
 1. Select **Next**

### Step 6. Confirmation

When the connector is successfully created and GCP Security Command Center has been configured properly:

- The GCP CIS standard will be shown in the Defender for Cloud's regulatory compliance dashboard.
- Security recommendations for your GCP resources will appear in the Defender for Cloud portal and the regulatory compliance dashboard 5-10 minutes after onboard completes:
    :::image type="content" source="./media/quickstart-onboard-gcp/gcp-resources-in-recommendations.png" alt-text="GCP resources and recommendations in Defender for Cloud's recommendations page":::

::: zone-end

## Monitor your GCP resources

As shown above, Microsoft Defender for Cloud's security recommendations page displays your GCP resources together with your Azure and AWS resources for a true multicloud view.

To view all the active recommendations for your resources by resource type, use Defender for Cloud's asset inventory page and filter to the GCP resource type that you're interested in:

:::image type="content" source="./media/quickstart-onboard-gcp/gcp-resource-types-in-inventory.png" alt-text="Asset inventory page's resource type filter showing the GCP options" lightbox="media/quickstart-onboard-gcp/gcp-resource-types-in-inventory.png":::


## FAQ - Connecting GCP projects to Microsoft Defender for Cloud

### Is there an API for connecting my GCP resources to Defender for Cloud?
Yes. To create, edit, or delete Defender for Cloud cloud connectors with a REST API, see the details of the [Connectors API](/rest/api/defenderforcloud/security-connectors).

## Next steps

Connecting your GCP project is part of the multicloud experience available in Microsoft Defender for Cloud. For related information, see the following pages:

- [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)
- [Google Cloud resource hierarchy](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy) - Learn about the Google Cloud resource hierarchy in Google's online docs
- [Troubleshoot your multicloud connectors](troubleshooting-guide.md#troubleshooting-the-native-multicloud-connector)
