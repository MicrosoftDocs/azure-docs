---
title: Add Google Cloud Platform (GCP) projects after deploying the Microsoft CloudKnox Permissions Management Sentry
description: Placeholder topic on how to add Google Cloud Platform (GCP) projects after deploying the Microsoft CloudKnox Permissions Management Sentry
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/20/2021
ms.author: v-ydequadros
---

# Add Google Cloud Platform (GCP) projects after deploying the Microsoft CloudKnox Permissions Management Sentry

After you've deployed the Microsoft CloudKnox Permissions Management Sentry, you can add other Google Cloud Platform (GCP) projects and monitor them.

## Add GCP projects to the CloudKnox Sentry

There are two steps to add a GCP project to the CloudKnox Sentry:

1. Add permission to each GCP project.
2. Configure the GCP Sentry.  

## Add permission to each GCP Project 

You can skip this step if permission is assigned at the organization level.

1. Open the GCP Identity and Access Management (IAM).
2. Select **Add**, and then select **knox-sentry-vm-service-account**. 

   If you created a service account for Sentry with a different name, select the service account name you created.
3. Select **Project role**, select **Project**, and then select **Viewer**.

   If you're using an IAM role, select **Project**, and then select **Security Reviewer**.

4. Use the following `gcloud config set project <project_id>` code to enable APIs for each GCP project you want to add.
 
<!--- Check code with developer.
     ```
    {
            gcloud config set project <project_id> 
            gcloud services enable admin.googleapis.com 
            gcloud services enable cloudresourcemanager.googleapis.com 
            gcloud services enable cloudapis.googleapis.com 
            gcloud services enable compute.googleapis.com 
            gcloud services enable iam.googleapis.com 
            gcloud services enable logging.googleapis.com 
            gcloud services enable stackdriver.googleapis.com 
            gcloud services enable storage-api.googleapis.com 
            gcloud services enable storage-component.googleapis.com 
            gcloud services enable dataproc.googleapis.com 
            gcloud services enable pubsub.googleapis.com 
            gcloud services enable container.googleapis.com 
            gcloud services enable datastore.googleapis.com 
            gcloud services enable spanner.googleapis.com 
            gcloud services enable sql-component.googleapis.com 
            gcloud services enable sqladmin.googleapis.com 
            gcloud services enable bigtable.googleapis.com 
            gcloud services enable bigtableadmin.googleapis.com 
            gcloud services enable appengine.googleapis.com 
            gcloud services enable bigquery-json.googleapis.com 
            gcloud services enable cloudbuild.googleapis.com 
            gcloud services enable clouddebugger.googleapis.com 
            gcloud services enable cloudtrace.googleapis.com 
            gcloud services enable containerregistry.googleapis.com 
            gcloud services enable deploymentmanager.googleapis.com 
            gcloud services enable ml.googleapis.com 
            gcloud services enable monitoring.googleapis.com 
            gcloud services enable oslogin.googleapis.com 
            gcloud services enable replicapool.googleapis.com 
            gcloud services enable replicapoolupdater.googleapis.com 
            gcloud services enable resourceviews.googleapis.com 
            gcloud services enable servicemanagement.googleapis.com 

    }
    ```
--->

## Configure the GCP Sentry

1. Log in to the [CloudKnox admin console](https://app.cloudknox.io/data-sources/data-collectors).
2. Select **Dashboard**.
3. Select the ellipses (**...**) next to the GCP project currently being monitored by CloudKnox Sentry, and then select **Configure Sentry**.
4. Copy the email and PIN from this project and add them to the Sentry VM command-line interface (CLI).
5. Use the Secure Shell (SSH) to run the following script in the Sentry VM:

    `sudo /opt/cloudknox/sentrysoftwareservice/bin/runGCPConfigCLI.sh`

7. From the dropdown menu, select the projects you want to add.

    The added projects appear in the **Data Sources** page in the CloudKnox Admin Console.

    When you first add a new project, the status displays as **Initializing**. After project data is collected and processed, the status changes to **Online**.

<!---Next steps--->

