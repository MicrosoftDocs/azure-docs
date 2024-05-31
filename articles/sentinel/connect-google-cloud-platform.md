---
title: Ingest Google Cloud Platform log data into Microsoft Sentinel 
description: This article describes how to ingest service log data from the Google Cloud Platform (GCP) into Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 01/17/2024
#Customer intent: As a security operator, I want to ingest Google Cloud Platform log data into Microsoft Sentinel to get full security coverage and analyze and detect attacks in my multicloud environment.
---

# Ingest Google Cloud Platform log data into Microsoft Sentinel

Organizations are increasingly moving to multicloud architectures, whether by design or due to ongoing requirements. A growing number of these organizations use applications and store data on multiple public clouds, including the Google Cloud Platform (GCP).

This article describes how to ingest GCP data into Microsoft Sentinel to get full security coverage and analyze and detect attacks in your multicloud environment.

With the **GCP Pub/Sub** connectors, based on our [Codeless Connector Platform](create-codeless-connector.md?tabs=deploy-via-arm-template%2Cconnect-via-the-azure-portal) (CCP), you can ingest logs from your GCP environment using the GCP [Pub/Sub capability](https://cloud.google.com/pubsub/docs/overview):

- The **Google Cloud Platform (GCP) Pub/Sub Audit Logs connector** collects audit trails of access to GCP resources. Analysts can monitor these logs to track resource access attempts and detect potential threats across the GCP environment.

- The **Google Cloud Platform (GCP) Security Command Center connector** collects findings from Google Security Command Center, a robust security and risk management platform for Google Cloud. Analysts can view these findings to gain insights into the organization's security posture, including asset inventory and discovery, detections of vulnerabilities and threats, and risk mitigation and remediation.

> [!IMPORTANT]
> The GCP Pub/Sub connectors are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.  

## Prerequisites

Before you begin, verify that you have the following:

- The Microsoft Sentinel solution is enabled. 
- A defined Microsoft Sentinel workspace exists.
- A GCP environment exists and contains resources producing one of the following log type you want to ingest:
    - GCP audit logs
    - Google Security Command Center findings
- Your Azure user has the Microsoft Sentinel Contributor role.
- Your GCP user has access to create and edit resources in the GCP project.
- The GCP Identity and Access Management (IAM) API and the GCP Cloud Resource Manager API are both enabled.

## Set up GCP environment

There are two things you need to set up in your GCP environment:

1. [Set up Microsoft Sentinel authentication in GCP](#gcp-authentication-setup) by creating the following resources in the GCP IAM service:
    - Workload identity pool
    - Workload identity provider
    - Service account
    - Role

1. [Set up log collection in GCP and ingestion into Microsoft Sentinel](#gcp-audit-logs-setup) by creating the following resources in the GCP Pub/Sub service:
    - Topic
    - Subscription for the topic

You can set up the environment in one of two ways:

- [Create GCP resources via the Terraform API](?tabs=terraform): Terraform provides APIs for resource creation and for Identity and Access Management (see [Prerequisites](#prerequisites)). Microsoft Sentinel provides Terraform scripts that issue the necessary commands to the APIs.

- [Set up GCP environment manually](?tabs=manual), creating the resources yourself in the GCP console.

  > [!NOTE]
  > There is no Terraform script available for creating GCP Pub/Sub resources for log collection from **Security Command Center**. You must create these resources manually. You can still use the Terraform script to create the GCP IAM resources for authentication.

  > [!IMPORTANT]
  > If you're creating resources manually, you must create *all* the authentication (IAM) resources in the **same GCP project**, otherwise it won't work. (Pub/Sub resources can be in a different project.)

### GCP Authentication Setup

# [Terraform API Setup](#tab/terraform)

1. Open [GCP Cloud Shell](https://cloud.google.com/shell/).

1. Select the **project** you want to work with, by typing the following command in the editor: 
    ```bash
    gcloud config set project {projectId}  
    ```

1. Copy the Terraform authentication script provided by Microsoft Sentinel from the Sentinel GitHub repository into your GCP Cloud Shell environment.

    1. Open the Terraform [GCPInitialAuthenticationSetup script](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/GCP/Terraform/sentinel_resources_creation/GCPInitialAuthenticationSetup/GCPInitialAuthenticationSetup.tf) file and copy its contents.

       > [!NOTE]
       > For ingesting GCP data into an **Azure Government cloud**, [use this authentication setup script instead](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/GCP/Terraform/sentinel_resources_creation_gov/GCPInitialAuthenticationSetupGov/GCPInitialAuthenticationSetupGov.tf).

    1. Create a directory in your Cloud Shell environment, enter it, and create a new blank file.
        ```bash
        mkdir {directory-name} && cd {directory-name} && touch initauth.tf
        ```

    1. Open *initauth.tf* in the Cloud Shell editor and paste the contents of the script file into it.

1. Initialize Terraform in the directory you created by typing the following command in the terminal:
    ```bash
    terraform init 
    ```

1. When you receive the confirmation message that Terraform was initialized, run the script by typing the following command in the terminal:
    ```bash
    terraform apply 
    ```

1. When the script prompts for your Microsoft tenant ID, copy and paste it into the terminal.
   > [!NOTE] 
   > You can find and copy your tenant ID on the **GCP Pub/Sub Audit Logs** connector page in the Microsoft Sentinel portal, or in the **Portal settings** screen (accessible anywhere in the Azure portal by selecting the gear icon along the top of the screen), in the **Directory ID** column.
   > :::image type="content" source="media/connect-google-cloud-platform/find-tenant-id.png" alt-text="Screenshot of portal settings screen." lightbox="media/connect-google-cloud-platform/find-tenant-id.png":::

1. When asked if a workload Identity Pool has already been created for Azure, answer *yes* or *no* accordingly.

1. When asked if you want to create the resources listed, type *yes*.

When the output from the script is displayed, save the resources parameters for later use.

# [Manual setup](#tab/manual)

Create and configure the following items in the Google Cloud Platform [Identity and Access Management (IAM)](https://cloud.google.com/iam/docs/overview) service.

#### Create a custom role

1. Follow the instructions in the Google Cloud documentation to [**create a role**](https://cloud.google.com/iam/docs/creating-custom-roles#creating). Per those instructions, create a custom role from scratch.

1. Name the role so it's recognizable as a Sentinel custom role.

1. Fill in the relevant details and add permissions as needed:
   - **pubsub.subscriptions.consume**
   - **pubsub.subscriptions.get**

    You can filter the list of available permissions by roles. Select the **Pub/Sub Subscriber** and **Pub/Sub Viewer** roles to filter the list.

For more information about creating roles in Google Cloud Platform, see [Create and manage custom roles](https://cloud.google.com/iam/docs/creating-custom-roles) in the Google Cloud documentation.

#### Create a service account 

1. Follow the instructions in the Google Cloud documentation to [**create a service account**](https://cloud.google.com/iam/docs/service-accounts-create#creating).

1. Name the service account so it's recognizable as a Sentinel service account.

1. Assign [the role you created in the previous section](#create-a-custom-role) to the service account.  

For more information about service accounts in Google Cloud Platform, see [Service accounts overview](https://cloud.google.com/iam/docs/service-account-overview) in the Google Cloud documentation.

#### Create the workload identity pool and provider 

1. Follow the instructions in the Google Cloud documentation to [**create the workload identity pool and provider**](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-clouds#create_the_workload_identity_pool_and_provider).

1. For the **Name** and **Pool ID**, enter your Azure **Tenant ID**, with the dashes removed.
   > [!NOTE]
   > You can find and copy your tenant ID on the **Portal settings** screen, in the **Directory ID** column. The portal settings screen is accessible anywhere in the Azure portal by selecting the gear icon along the top of the screen.
   > :::image type="content" source="media/connect-google-cloud-platform/find-tenant-id.png" alt-text="Screenshot of portal settings screen." lightbox="media/connect-google-cloud-platform/find-tenant-id.png":::

1. Add an identity provider to the pool. Choose **Open ID Connect (OIDC)** as the provider type.

1. Name the identity provider so it's recognizable for its purpose.

1. Enter the following values in the provider settings (these aren't samples&mdash;use these actual values):
   - **Issuer (URL)**: `https://sts.windows.net/33e01921-4d64-4f8c-a055-5bdaffd5e33d`    
   - **Audience**: the application ID URI: `api://2041288c-b303-4ca0-9076-9612db3beeb2`
   - **Attribute mapping**: `google.subject=assertion.sub`

   > [!NOTE]
   > To set up the connector to send logs from GCP to the **Azure Government cloud**, use the following alternate values for the provider settings instead of those above:
   > - **Issuer (URL)**: `https://sts.windows.net/cab8a31a-1906-4287-a0d8-4eef66b95f6e`
   > - **Audience**: `api://e9885b54-fac0-4cd6-959f-a72066026929`

For more information about workload identity federation in Google Cloud Platform, see [Workload identity federation](https://cloud.google.com/iam/docs/workload-identity-federation) in the Google Cloud documentation.

#### Grant the identity pool access to the service account

1. Locate and select the service account you created earlier.

1. Locate the **permissions** configuration of the service account.

1. **Grant access** to the principal that represents the workload identity pool and provider that you created in the previous step.
   - Use the following format for the principal name:
     ```http
     principal://iam.googleapis.com/projects/{PROJECT_NUMBER}/locations/global/workloadIdentityPools/{WORKLOAD_IDENTITY_POOL_ID}/subject/{WORKLOAD_IDENTITY_PROVIDER_ID}
     ```

   - Assign the **Workload Identity User** role and save the configuration.

For more information about granting access in Google Cloud Platform, see [Manage access to projects, folders, and organizations](https://cloud.google.com/iam/docs/granting-changing-revoking-access) in the Google Cloud documentation.

---

### GCP Audit Logs Setup

The instructions in this section are for using the Microsoft Sentinel **GCP Pub/Sub Audit Logs** connector.

See [the instructions in the next section](#gcp-security-command-center-setup) for using the Microsoft Sentinel **GCP Pub/Sub Security Command Center** connector.

# [Terraform API Setup](#tab/terraform)

1. Copy the Terraform audit log setup script provided by Microsoft Sentinel from the Sentinel GitHub repository into a different folder in your GCP Cloud Shell environment.

    1. Open the Terraform [GCPAuditLogsSetup script](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/GCP/Terraform/sentinel_resources_creation/GCPAuditLogsSetup/GCPAuditLogsSetup.tf) file and copy its contents.

       > [!NOTE]
       > For ingesting GCP data into an **Azure Government cloud**, [use this audit log setup script instead](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/GCP/Terraform/sentinel_resources_creation_gov/GCPAuditLogsSetup/GCPAuditLogsSetup.tf).

    1. Create another directory in your Cloud Shell environment, enter it, and create a new blank file.
        ```bash
        mkdir {other-directory-name} && cd {other-directory-name} && touch auditlog.tf
        ```

    1. Open *auditlog.tf* in the Cloud Shell editor and paste the contents of the script file into it.

1. Initialize Terraform in the new directory by typing the following command in the terminal:
    ```bash
    terraform init 
    ```

1. When you receive the confirmation message that Terraform was initialized, run the script by typing the following command in the terminal:
    ```bash
    terraform apply 
    ```

    To ingest logs from an entire organization using a single Pub/Sub, type:

    ```bash
    terraform apply -var="organization-id= {organizationId} "
    ```

1. When asked if you want to create the resources listed, type *yes*.

When the output from the script is displayed, save the resources parameters for later use.

Wait five minutes before moving to the next step. 

# [Manual setup](#tab/manual)

#### Create a publishing topic

Use the [Google Cloud Platform Pub/Sub service](https://cloud.google.com/pubsub/docs/overview) to set up export of audit logs.

Follow the instructions in the Google Cloud documentation to [**create a topic**](https://cloud.google.com/pubsub/docs/create-topic) for publishing logs to.
- Choose a Topic ID that reflects the purpose of log collection for export to Microsoft Sentinel.
- Add a default subscription.
- Use a **Google-managed encryption key** for encryption.

#### Create a log sink

Use the [Google Cloud Platform Log Router service](https://cloud.google.com/logging/docs/export/configure_export_v2) to set up collection of audit logs.

**To collect logs for resources in the current project only:**

1. Verify that your project is selected in the project selector.

1. Follow the instructions in the Google Cloud documentation to [**set up a sink**](https://cloud.google.com/logging/docs/export/configure_export_v2#creating_sink) for collecting logs. 
   - Choose a Name that reflects the purpose of log collection for export to Microsoft Sentinel.
   - Select "Cloud Pub/Sub topic" as the destination type, and choose the topic you created in the previous step.

**To collect logs for resources throughout the entire organization:**

1. Select your **organization** in the project selector. 

1. Follow the instructions in the Google Cloud documentation to [**set up a sink**](https://cloud.google.com/logging/docs/export/configure_export_v2#creating_sink) for collecting logs. 
   - Choose a Name that reflects the purpose of log collection for export to Microsoft Sentinel.
   - Select "Cloud Pub/Sub topic" as the destination type, and choose the default "Use a Cloud Pub/Sub topic in a project".
   - Enter the destination in the following format: `pubsub.googleapis.com/projects/{PROJECT_ID}/topics/{TOPIC_ID}`.

1. Under **Choose logs to include in the sink**, select **Include logs ingested by this organization and all child resources**.   

#### Verify that GCP can receive incoming messages

1. In the GCP Pub/Sub console, navigate to **Subscriptions**.

1. Select **Messages**, and select **PULL** to initiate a manual pull. 

1. Check the incoming messages.  

---

If you're also setting up the **GCP Pub/Sub Security Command Center** connector, continue with the next section.

Otherwise, skip to [Set up the GCP Pub/Sub connector in Microsoft Sentinel](#set-up-the-gcp-pubsub-connector-in-microsoft-sentinel).

### GCP Security Command Center setup

The instructions in this section are for using the Microsoft Sentinel **GCP Pub/Sub Security Command Center** connector.

See [the instructions in the previous section](#gcp-audit-logs-setup) for using the Microsoft Sentinel **GCP Pub/Sub Audit Logs** connector.

#### Configure continuous export of findings

Follow the instructions in the Google Cloud documentation to [**configure Pub/Sub exports**](https://cloud.google.com/security-command-center/docs/how-to-export-data#configure-pubsub-exports) of future SCC findings to the GCP Pub/Sub service.

1. When asked to select a project for your export, select a project you created for this purpose, or [create a new project](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project).

1. When asked to select a Pub/Sub topic where you want to export your findings, follow the instructions above to [create a new topic](#create-a-publishing-topic).

## Set up the GCP Pub/Sub connector in Microsoft Sentinel

# [GCP Audit Logs](#tab/auditlogs)

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.

1. In the **Content hub**, in the search bar, type *Google Cloud Platform Audit Logs*.

1. Install the **Google Cloud Platform Audit Logs** solution.

1. Select **Data connectors**, and in the search bar, type *GCP Pub/Sub Audit Logs*.

1. Select the **GCP Pub/Sub Audit Logs (Preview)** connector.

1. In the details pane, select **Open connector page**. 

1. In the **Configuration** area, select **Add new collector**. 

    :::image type="content" source="media/connect-google-cloud-platform/add-new-collector.png" alt-text="Screenshot of GCP connector configuration" lightbox="media/connect-google-cloud-platform/add-new-collector.png":::

1. In the **Connect a new collector** panel, type the resource parameters you created when you [created the GCP resources](#set-up-gcp-environment). 

    :::image type="content" source="media/connect-google-cloud-platform/new-collector-dialog.png" alt-text="Screenshot of new collector side panel.":::

1. Make sure that the values in all the fields match their counterparts in your GCP project (the values in the screenshot are samples, not literals), and select **Connect**. 

# [Google Security Command Center](#tab/scc)

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.

1. In the **Content hub**, in the search bar, type *Google Security Command Center*.

1. Install the **Google Security Command Center** solution.

1. Select **Data connectors**, and in the search bar, type *Google Security Command Center*. 

1. Select the **Google Security Command Center (Preview)** connector.

1. In the details pane, select **Open connector page**. 

1. In the **Configuration** area, select **Add new collector**. 

    :::image type="content" source="media/connect-google-cloud-platform/add-new-collector.png" alt-text="Screenshot of GCP connector configuration." lightbox="media/connect-google-cloud-platform/add-new-collector.png":::

1. In the **Connect a new collector** panel, type the resource parameters you created when you [created the GCP resources](#set-up-gcp-environment). 

    :::image type="content" source="media/connect-google-cloud-platform/new-collector-dialog.png" alt-text="Screenshot of new collector side panel.":::

1. Make sure that the values in all the fields match their counterparts in your GCP project (the values in the screenshot are samples, not literals), and select **Connect**. 

---

## Verify that the GCP data is in the Microsoft Sentinel environment 

1. To ensure that the GCP logs were successfully ingested into Microsoft Sentinel, run the following query 30 minutes after you finish to [set up the connector](#set-up-the-gcp-pubsub-connector-in-microsoft-sentinel). 

    # [GCP Audit Logs](#tab/auditlogs)

    ```kusto
    GCPAuditLogs 
    | take 10 
    ```

    # [Google Security Command Center](#tab/scc)

    ```kusto
    GoogleSCC 
    | take 10 
    ```

    ---

1. Enable the [health feature](enable-monitoring.md) for data connectors. 

## Next steps
   In this article, you learned how to ingest GCP data into Microsoft Sentinel using the GCP Pub/Sub connectors. To learn more about Microsoft Sentinel, see the following articles:

   - Learn how to [get visibility into your data, and potential threats](get-visibility.md).
   - Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
   - [Use workbooks](monitor-your-data.md) to monitor your data.
   
