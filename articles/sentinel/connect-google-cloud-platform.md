---
title: Stream Google Cloud Platform into Microsoft Sentinel 
description: This article describes how to stream audit log data from the Google Cloud Platform (GCP) into Microsoft Sentinel.
author: limwainstein
ms.topic: how-to
ms.date: 03/23/2023
ms.author: lwainstein
#Customer intent: As a security operator, I want to ingest GCP audit log data into Microsoft Sentinel to get full security coverage and analyze and detect attacks in my multicloud environment.
---

# Stream Google Cloud Platform logs into Microsoft Sentinel

Organizations are increasingly moving to multicloud architectures, whether by design or due to ongoing requirements. A growing number of these organizations use applications and store data on multiple public clouds, including the Google Cloud Platform (GCP).

This article describes how to ingest GCP data into Microsoft Sentinel to get full security coverage and analyze and detect attacks in your multicloud environment.

With the **GCP Pub/Sub Audit Logs** connector, based on our [Codeless Connector Platform](create-codeless-connector.md?tabs=deploy-via-arm-template%2Cconnect-via-the-azure-portal) (CCP), you can ingest logs from your GCP environment using the GCP [Pub/Sub capability](https://cloud.google.com/pubsub/docs/overview). 

> [!IMPORTANT]
> The GCP Pub/Sub Audit Logs connector is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.  

Google's Cloud Audit Logs records a trail that practitioners can use to monitor access and detect potential threats across GCP resources.  

## Prerequisites

Before you begin, verify that you have:

- The Microsoft Sentinel solution enabled. 
- A defined Microsoft Sentinel workspace.
- A GCP environment collecting GCP audit logs. 
- The Microsoft Sentinel Contributor role.
- Access to edit and create resources in the GCP project. 

## Set up GCP environment

You can set up the GCP environment in one of two ways:

- [Create GCP resources via the Terraform API](#create-gcp-resources-via-the-terraform-api): Terraform provides an API for the Identity and Access Management (IAM) that creates the resources: The topic, a subscription for the topic, a workload identity pool, a workload identity provider, a service account, and a role.  
- [Set up GCP environment manually](#) via the GCP console.

### Create GCP resources via the Terraform API

1. Open [GCP Cloud Shell](https://cloud.google.com/shell/).
1. Open the editor and type: 
    
    ```    
    gcloud config set project {projectId}  
    ```
1. In the next window, select **Authorize**. 							 
1. Copy the Terraform [GCPInitialAuthenticationSetup script](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/GCP/Terraform/sentinel_resources_creation/GCPInitialAuthenticationSetup), paste the script to a new file, and save it as a .tf file.  
1. In the editor, type:  

    ```
    terraform init  
    ```
1. Type:
    
    ```
    terraform apply 
    ```

1. Type your Microsoft tenant ID. Learn how to [find your tenant ID](/azure/active-directory-b2c/tenant-management-read-tenant-name). 
1. When asked if a workload Identity Pool has already been created for Azure, type *yes* or *no*.  
1. When asked if you want to create the resources listed, type *yes*.
1. Save the resources parameters for later use. 	
1. In a new folder, copy the Terraform [GCPAuditLogsSetup script](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/GCP/Terraform/sentinel_resources_creation/GCPAuditLogsSetup) into a new file, and save it as a .tf file:

    ```
    cd {foldername} 
    ```
1. In the editor, type: 					 

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

## Set up the GCP Pub/Sub connector in Microsoft Sentinel

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.
1. In the **Content hub**, in the search bar, type *Google Cloud Platform Audit Logs*.
1. Install the **Google Cloud Platform Audit Logs** solution. 
1. Select **Data connectors**, and in the search bar, type *GCP Pub/Sub Audit Logs*. 
1. Select the **GCP Pub/Sub Audit Logs (Preview)** connector.
1. Below the connector description, select **Open connector page**. 
1. In the **Configuration** area, select **Add new**. 
1. Type the resource parameters you created when you [created the GCP resources](#create-gcp-resources-via-the-terraform-api). Make sure that the Data Collection Endpoint Name and the Data Collection Rule Name begin with **Microsoft-Sentinel-** and select **Connect**. 

## Verify that the GCP data is in the Microsoft Sentinel environment 

1. To ensure that the GCP logs were successfully ingested into Microsoft Sentinel, run the following query 30 minutes after you finish to [set up the connector](#set-up-the-gcp-pubsub-connector-in-microsoft-sentinel). 

    ```    
    GCPAuditLogs 
   | take 10 
    ```

1. Enable the [health feature](enable-monitoring.md) for data connectors. 

### Set up the GCP environment manually via the GCP portal

This section shows you how to set up the GCP environment manually. Alternatively, you can set up the environment [via the Terraform API](#create-gcp-resources-via-the-terraform-api). If you already set up the environment via the API, skip this section.

#### Create the role 

1. In the GCP console, navigate to **IAM & Admin**. 
1. Select **Roles** and select **Create role**. 
1. Fill in the relevant details and add permissions as needed.
1. Filter the permissions by the **Pub/Sub Subscriber** and **Pub/Sub Viewer** roles, and select **pubsub.subscriptions.consume** and **pubsub.subscriptions.get** permissions. 
1. To confirm, select **ADD**. 

    :::image type="content" source="media/connect-google-cloud-platform/gcp-create-role.png" alt-text="Screenshot of adding permissions when adding a GCP role.":::

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
    > To find the tenant ID, in the Azure portal, navigate to **All Services > Azure Active Directory > Overview** and copy the **TenantID**. 

1. Make sure that **Enable pool** is selected. 

    :::image type="content" source="media/connect-google-cloud-platform/gcp-create-identity-pool.png" alt-text="Screenshot of creating the identity pool as part of creating the GCP workload identity federation.":::

1. To add a provider to the pool:
    - Select **OIDC** 
    - Type the **Issuer (URL)**: \https://sts.windows.net/33e01921-4d64-4f8c-a055-5bdaffd5e33d    
    - Next to **Audiences**, select **Allowed audiences**, and next to **Audience 1**, type: *api://2041288c-b303-4ca0-9076-9612db3beeb2*. 

        :::image type="content" source="media/connect-google-cloud-platform/gcp-add-provider-pool.png" alt-text="Screenshot of adding the provider to the pool when creating the GCP workload identity federation.":::

        :::image type="content" source="media/connect-google-cloud-platform/gcp-add-provider-pool-audiences.png" alt-text="Screenshot of adding the provider pool audiences when creating the GCP workload identity federation.":::

#### Configure the provider attributes 
    
1. Under **OIDC 1**, select **assertion.sub**.  

    :::image type="content" source="media/connect-google-cloud-platform/gcp-configure-provider-attributes.png" alt-text="Screenshot of configuring the GCP provider attributes.":::    
 
1. Select **Continue** and **Save**. 
1. In the **Workload Identity Pools** main page, select the created pool. 
1. Select **Grant access**, select the [service account you created previously](#create-the-service-account), and select **All identities in the pool** as the principals. 

    :::image type="content" source="media/connect-google-cloud-platform/gcp-grant-access.png" alt-text="Screenshot of granting access to the GCP service account.":::

1. Confirm that the connected service account is displayed. 

    :::image type="content" source="media/connect-google-cloud-platform/gcp-connected-service-account.png" alt-text="Screenshot of viewing the connected GCP service accounts.":::

#### Create a topic 

1. In the GCP console, navigate to **Topics**.
1. Create a new topic and select a **Topic ID**. 
1. Select **Add default subscription** and under **Encryption**, select **Google-managed encryption key**. 

#### Create a sink 

1. In the GCP console, navigate to **Log Router**.
1. Select **Create sink** and fill in the relevant details.
1. Under **Sink destination**, select **Cloud Pub/Sub topic** and select [the topic you created previously](#create-a-topic). 

    :::image type="content" source="media/connect-google-cloud-platform/gcp-sink-destination.png" alt-text="Screenshot of defining the GCP sink destination.":::

1. If needed, filter the logs by selecting specific logs to include. Otherwise, all logs are sent. 
1. Select **Create sink**.  

> [!NOTE]
> To ingest logs for the entire organization: 
> 1. Select the organization under **Project**. 
> 1. Repeat steps 2-4, and under **Choose logs to include in the sink** in the **Log Router** section, select **Include logs ingested by this organization and all child resources**.  

:::image type="content" source="media/connect-google-cloud-platform/gcp-choose-logs.png" alt-text="Screenshot of choosing which GCP logs to include in the sink.":::
 
#### Verify that GCP can receive incoming messages 

1. In the GCP console, navigate to **Subscriptions**.
1. Select **Messages**, and select **PULL** to initiate a manual pull. 
1. Check the incoming messages.  

## Next steps
In this article, you learned how to ingest GCP data into Microsoft Sentinel using the GCP Pub/Sub Audit Logs connector. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
