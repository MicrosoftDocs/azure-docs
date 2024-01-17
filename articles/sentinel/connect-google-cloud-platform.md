---
title: Ingest Google Cloud Platform log data into Microsoft Sentinel 
description: This article describes how to ingest service log data from the Google Cloud Platform (GCP) into Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 01/17/2024
#Customer intent: As a security operator, I want to ingest GCP audit log data into Microsoft Sentinel to get full security coverage and analyze and detect attacks in my multicloud environment.
---

# Ingest Google Cloud Platform log data into Microsoft Sentinel

Organizations are increasingly moving to multicloud architectures, whether by design or due to ongoing requirements. A growing number of these organizations use applications and store data on multiple public clouds, including the Google Cloud Platform (GCP).

This article describes how to ingest GCP data into Microsoft Sentinel to get full security coverage and analyze and detect attacks in your multi-cloud environment.

With the **GCP Pub/Sub** connectors, based on our [Codeless Connector Platform](create-codeless-connector.md?tabs=deploy-via-arm-template%2Cconnect-via-the-azure-portal) (CCP), you can ingest logs from your GCP environment using the GCP [Pub/Sub capability](https://cloud.google.com/pubsub/docs/overview). 

> [!IMPORTANT]
> The GCP Pub/Sub Audit Logs connector is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.  

Google's Cloud Audit Logs records an audit trail that analysts can use to monitor access and detect potential threats across GCP resources.  

## Prerequisites

Before you begin, verify that you have the following:

- The Microsoft Sentinel solution is enabled. 
- A defined Microsoft Sentinel workspace exists.
- A GCP environment (a **project**) exists and is collecting GCP audit logs.
- Your Azure user has the Microsoft Sentinel Contributor role.
- Your GCP user has access to edit and create resources in the GCP project.
- The GCP Identity and Access Management (IAM) API and the GCP Cloud Resource Manager API are both enabled.

## Set up GCP environment

You set up the GCP environment by creating the following GCP resources:
- Topic
- Subscription for the topic
- Workload identity pool
- Workload identity provider
- Service account
- Role

You can set up the environment in one of two ways:

- [Create GCP resources via the Terraform API](?tabs=terraform#gcp-authentication-setup): Terraform provides an API for the Identity and Access Management (IAM) that creates the resources. Microsoft Sentinel provides a script that issues the necessary commands to the API.
- [Set up GCP environment manually](?tabs=manual#gcp-authentication-setup), creating the resources yourself in the GCP console.

### GCP Authentication Setup

# [Terraform API Setup](#tab/terraform)

1. Open [GCP Cloud Shell](https://cloud.google.com/shell/).

1. Select the **project** you want to work with, by typing the following command in the editor: 
    ```bash
    $ gcloud config set project {projectId}  
    ```

1. Copy the Terraform [GCPInitialAuthenticationSetup script](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/GCP/Terraform/sentinel_resources_creation/GCPInitialAuthenticationSetup) from the Azure Sentinel GitHub repository, paste the script to a new file, and save it as a `.tf` file.  

1. Run the script by typing the following commands in the editor:  
    ```bash
    $ terraform init 

    $ terraform apply 
    ```

1. When prompted for it, type your Microsoft tenant ID. You can find your tenant ID on the **GCP Pub/Sub Audit Logs** connector page in the Microsoft Sentinel portal, or in the **Portal settings** screen (accessible anywhere in the portal by selecting the gear icon along the top of the screen), in the **Directory ID** column.
    :::image type="content" source="media/connect-google-cloud-platform/find-tenant-id.png" alt-text="Screenshot of portal settings screen." lightbox="media/connect-google-cloud-platform/find-tenant-id.png":::

1. When asked if a workload Identity Pool has already been created for Azure, type *yes* or *no*.

1. When asked if you want to create the resources listed, type *yes*.

Save the resources parameters for later use.

# [Manual setup](#tab/manual)

#### Create the role 

1. In the GCP console, navigate to **IAM & Admin**.

1. Select **Roles** and select **Create role**. 

1. Fill in the relevant details and add permissions as needed.

1. Filter the permissions by the **Pub/Sub Subscriber** and **Pub/Sub Viewer** roles, and select **pubsub.subscriptions.consume** and **pubsub.subscriptions.get** permissions. 

1. To confirm, select **ADD**. 

1. To create the role, select **Create**. 

#### Create the service account 

1. In the GCP Console, navigate to **Service Accounts**, and select **Create Service Account**. 

1. Fill in the relevant details and select **Create and continue**.

1. Select [the role you created previously](#create-the-role), and select **Done** to create the service account.  

#### Create the workload identity federation 

1. In the GCP Console, navigate to **Workload Identity Federation**.

1. If it's your first time using this feature, select **Get started**. Otherwise, select **Create pool**. 

1. Fill in the required details, and make sure that the **Tenant ID** and **Tenant name** is the TenantID **without dashes**. 

    > [!NOTE]
    > To find the tenant ID, in the Azure portal, navigate to **All Services Microsoft Entra ID Overview** and copy the **TenantID**. 

1. Make sure that **Enable pool** is selected. 

1. To add a provider to the pool:
   - Select **OIDC** 
   - Type the **Issuer (URL)**: `https://sts.windows.net/33e01921-4d64-4f8c-a055-5bdaffd5e33d`    
   - Next to **Audiences**, select **Allowed audiences**, and next to **Audience 1**, type: *api://2041288c-b303-4ca0-9076-9612db3beeb2*.

#### Configure the provider attributes 
    
1. Under **OIDC 1**, select **assertion.sub** with the supported key **google.subject**    
1. Select **Continue** and **Save**.
1. Navigate to the **IAM & Admin** section.
    - Visit the **Service Account** page.
    - Locate the relevant service account and access the permissions tab.
    - Select **'GRANT ACCESS'** to add a new principal.
    - For the principal name, use the following format: 
      
      ```
      `principal://iam.googleapis.com/projects/${Project number}/locations/global/workloadIdentityPools/${Workload Identity Pool ID}/subject/${Workload Identity Provider ID}`.
      ```

    - Under **"Assign roles"** choose **'Workload Identity User'** and **save**.

---

### GCP Audit Logs Setup

# [Terraform API Setup](#tab/terraform)

1. In a new folder, copy the Terraform [GCPAuditLogsSetup script](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/GCP/Terraform/sentinel_resources_creation/GCPAuditLogsSetup) into a new file, and save it as a .tf file:
    
    ```
    cd {foldername} 
    ```

    
    ```
    terraform init  
    ```

1. Type: 					 
    
    ```
    terraform apply  
    ```

To ingest logs from an entire organization using a single Pub/Sub, type:

```    
terraform apply -var="organization-id= {organizationId} "					 
```

1. Type *yes*. 						 

1. Save the resource parameters for later use.  

1. Wait five minutes before moving to the next step. 

# [Manual setup](#tab/manual)

Set up Continuous exports for Audit Logs.

1. Create topic following [Google's instructions](https://cloud.google.com/pubsub/docs/create-topic). Ensure to select "Add default subscription" and, under **Encryption**, choose the option for **Google-managed encryption key**.

1. Set up a sink by following [Google's instructions](https://cloud.google.com/logging/docs/export/configure_export_v2#creating_sink) for its creation. Ensure that, under "Sink destination," you select "Cloud Pub/Sub topic" and choose the topic you previously created.

1. Verify that GCP can receive incoming messages:

    1. In the GCP console, navigate to **Subscriptions**.
    1. Select **Messages**, and select **PULL** to initiate a manual pull. 
    1. Check the incoming messages.  

   > [!NOTE]
   > To ingest logs for the entire organization: 
   > 1. Select the organization under **Project**. 
   > 1. Repeat steps 2-4, and under **Choose logs to include in the sink** in the **Log Router** section, select **Include logs ingested by this organization and all child resources**.   

---

## Set up the GCP Pub/Sub connector in Microsoft Sentinel

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.

1. In the **Content hub**, in the search bar, type *Google Cloud Platform Audit Logs*.

1. Install the **Google Cloud Platform Audit Logs** solution. 

1. Select **Data connectors**, and in the search bar, type *GCP Pub/Sub Audit Logs*. 

1. Select the **GCP Pub/Sub Audit Logs (Preview)** connector.

1. Below the connector description, select **Open connector page**. 

1. In the **Configuration** area, select **Add new**. 

1. Type the resource parameters you created when you [created the GCP resources](#set-up-gcp-environment). Make sure that the Data Collection Endpoint Name and the Data Collection Rule Name begin with **Microsoft-Sentinel-** and select **Connect**. 

## Verify that the GCP data is in the Microsoft Sentinel environment 

1. To ensure that the GCP logs were successfully ingested into Microsoft Sentinel, run the following query 30 minutes after you finish to [set up the connector](#set-up-the-gcp-pubsub-connector-in-microsoft-sentinel). 

    ```    
    GCPAuditLogs 
   | take 10 
    ```

1. Enable the [health feature](enable-monitoring.md) for data connectors. 

## Next steps
   In this article, you learned how to ingest GCP data into Microsoft Sentinel using the GCP Pub/Sub connectors. To learn more about Microsoft Sentinel, see the following articles:

   - Learn how to [get visibility into your data, and potential threats](get-visibility.md).
   - Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
   - [Use workbooks](monitor-your-data.md) to monitor your data.
   
