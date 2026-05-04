---
title: Collect Apache Spark Application Logs and Metrics to Azure Storage account Using Certificate-Based Service Principal Authentication
description: Learn to setting up Azure services, particularly focusing on integrating Azure Synapse with Azure Storage account and Key Vault.
author: jejiang
ms.author: jejiang
ms.reviewer: whhender
ms.topic: tutorial
ms.date: 04/03/2026
---

# Collect Apache Spark application logs and metrics to Azure Storage account using certificate-based service principal authentication

The Apache Spark diagnostic emitter extension is a library that allows Spark applications to send logs, event logs, and metrics to destinations like Azure Storage account, Azure Log Analytics, and Azure Storage.

In this tutorial, you learn how to create required Azure resources and configure a Spark application with a certificate and service principal to emit logs, event logs, and metrics to Azure Storage account using the Apache Spark diagnostic emitter extension.

## Prerequisites

- An Azure subscription. You can also [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you get started.
- [Synapse Analytics workspace](/azure/synapse-analytics/get-started-create-workspace).
- [Azure Storage account](/azure/storage/common/storage-account-create).
- [Azure Key Vault](/azure/key-vault/general/overview)
- [App Registration](https://ms.portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)

> [!Note]
>
> To complete this tutorial's steps, you need to have access to a resource group for which you're assigned the Owner role. 
>

## Step 1. Register an application

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to [App registrations](/entra/identity-platform/quickstart-register-app#register-an-application).
2. Create a new app registration for your Synapse workspace.

     :::image type="content" source="media\how-to-use-certificate-with-service-principal-for-log-storage\create-a-new-app-registration.png" alt-text="Screenshot showing create a new app registration.":::

## Step 2. Generate a certificate in Key Vault

1. Navigate to Key Vault.
2. Expand the **Object**, and select the **Certificates**.
3. Click on **Generate/Import**. 

     :::image type="content" source="media\how-to-use-certificate-with-service-principal-for-log-storage\generate-a-new-certificate.png" alt-text="Screenshot showing generate a new certificate for app.":::

## Step 3. Trust the certificate in the application 

1. Go to the app created in Step 1 > **Manage** > **Manifest**. 
2. Append the certificate details to the manifest file to establish trust. 

     ```
          "trustedCertificateSubjects": [ 
               { 
               "authorityId": "00000000-0000-0000-0000-000000000001", 
               "subjectName": "Your-Subject-of-Certificate", 
               "revokedCertificateIdentifiers": [] 
               } 
          ] 
     ```

     :::image type="content" source="media\how-to-use-certificate-with-service-principal-for-log-storage\trust-the-certificate.png" alt-text="Screenshot showing trust the certificate in the application.":::

## Step 4.  Assign Storage Blob Data Contributor role

1. In Azure Storage account, navigate to Access control (IAM).

2. Assign the **Storage Blob Data Contributor** role to the application (service principal).

    :::image type="content" source="media\how-to-use-certificate-with-service-principal-for-log-storage\assign-storage-blob-data-contributor.png" alt-text="Screenshot showing assign storage blob data contributor role.":::

## Step 5. Create a linked service in Synapse

1. In Synapse Analytics workspace, go to **Manage** > **linked service**.
2. Create a new **linked Service** in Synapse to connect to **Key Vault**. 

     :::image type="content" source="media\how-to-use-certificate-with-service-principal-for-log-storage\create-a-linked-service-in-synapse.png" alt-text="Screenshot showing create a linked service in synapse.":::

## Step 6. Assign reader role to linked service in Key Vault

1. Get the workspace managed identity ID from the linked service. The **managed identity name** and **object ID** for the linked service is under **Edit linked service**. 

     :::image type="content" source="media\how-to-use-certificate-with-service-principal-for-log-storage\managed-identity-name-and-object-id.png" alt-text="Screenshot showing managed identity name and object ID are in edit linked service.":::

2. In **Key Vault**, assign the linked service a **Key Vault Certificate User** role. 

## Step 7. Configure with a linked service

Gather the following values and add to the Apache Spark configuration.

- <EMITTER_NAME>: The name for the emmiter.
- <CERTIFICATE_NAME>: The certificate name that you generated in the key vault.
- <LINKED_SERVICE_NAME>: The Azure Key vault linked service name.
- <STORAGE_URI>: The Blob Storage target path (e.g., https://accountname.blob.core.windows.net/containername).
- <SERVICE_PRINCIPAL_TENANT_ID>: The service principal tenant ID, you can find it in App registrations > your app name > Overview > Directory (tenant) ID
- <SERVICE_PRINCIPAL_CLIENT_ID>: The service principal client ID, you can find it in registrations > your app name > Overview > Application(client) ID

```
     "spark.synapse.diagnostic.emitters": <EMITTER_NAME>,
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.type": "AzureStorage",     
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.categories": "DriverLog,ExecutorLog,EventLog,Metrics",      
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.uri": "<STORAGE_URI>",      
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.auth": "ServicePrincipalCert",
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.certificate.keyVault.certificateName": <CERTIFICATE_NAME>",
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.certificate.keyVault.linkedService": <LINKED_SERVICE_NAME>,
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.tenantId": <SERVICE_PRINCIPAL_TENANT_ID>,
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.clientId": <SERVICE_PRINCIPAL_CLIENT_ID>
```

## Step 8. Submit an Apache Spark application and view the logs and metrics

You can use the Apache Log4j library to write custom logs.

Example for Scala:

```scala
%%spark
val logger = org.apache.log4j.LogManager.getLogger("com.contoso.LoggerExample")
logger.info("info message")
logger.warn("warn message")
logger.error("error message")
//log exception
try {
      1/0
 } catch {
      case e:Exception =>logger.warn("Exception", e)
}
// run job for task level metrics
val data = sc.parallelize(Seq(1,2,3,4)).toDF().count()
```

Example for PySpark:

```python
%%pyspark
logger = sc._jvm.org.apache.log4j.LogManager.getLogger("com.contoso.PythonLoggerExample")
logger.info("info message")
logger.warn("warn message")
logger.error("error message")
```

