---
title: How to use cert+sp emit log to eventhub
description: Learn to setting up Azure services, particularly focusing on integrating Azure Synapse with Event Hubs and Key Vault.
author: jejiang
ms.author: jejiang
ms.reviewer: whhender
ms.topic: tutorial
ms.date: 03/24/2025
---

# How to use certificate and Service Principal emit log to eventhub

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Synapse Analytics workspace](/azure/synapse-analytics/get-started-create-workspace)
- If you are new to Azure Event Hubs, read through [Event Hubs overview](/azure/event-hubs/event-hubs-about) and [Event Hubs features](/azure/event-hubs/event-hubs-features).
- [Azure Key Vault](/azure/key-vault/general/overview)
- [App Registration](https://ms.portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)

> [!Note]
>
> To complete this tutorial's steps, you need to have access to a resource group for which you're assigned the Owner role. 
>

## Step 1. Register an application

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to [App registrations](/entra/identity-platform/quickstart-register-app#register-an-application).
2. Create a new app registration for your Synapse workspace.

     :::image type="content" source="media\how-to-use-certsp-emit-log-to-eventhub\create-a-new-app-registration.png" alt-text="Screenshot showing create a new app registration.":::

## Step 2. Generate a Certificate in Key Vault

1. Navigate to Key Vault.
2. Expand the **Object**, and select the **Certificates**.
3. Click on **Generate/Import**. 

     :::image type="content" source="media\how-to-use-certsp-emit-log-to-eventhub\generate-a-new-certificate.png" alt-text="Screenshot showing generate a new certificate for app.":::

## Step 3. Trust the Certificate in the Application 

1. Go to the app created in Step 1 -> **Manage** -> **Manifest**. 
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

     :::image type="content" source="media\how-to-use-certsp-emit-log-to-eventhub\trust-the-certificate.png" alt-text="Screenshot showing trust the certificate in the application.":::

## Step 4. Assign Azure Event Hubs Data Sender Role 

1. In Event Hub, navigate to Access control (IAM).
2. Assign the app (Service Principal) with the Azure Event Hubs Data Sender role. 

     :::image type="content" source="media\how-to-use-certsp-emit-log-to-eventhub\assign-azure-event-hubs-data-sender-role.png" alt-text="Screenshot showing assign azure event hubs data sender role.":::

## Step 5. Create a Linked Service in Synapse

1. In Synapse Analytics workspace, go to **Manage** -> **Linked service**.
2. Create a new **Linked Service** in Synapse to connect to **Key Vault**. 

     :::image type="content" source="media\how-to-use-certsp-emit-log-to-eventhub\create-a-linked-service-in-synapse.png" alt-text="Screenshot showing create a linked service in synapse.":::

## Step 6. Assign Reader Role to Linked Service in Key Vault

1. Get the workspace managed identity ID from the linked service. The **managed identity name** and **object ID** for the linked service is under **Edit Linked Service**. 

     :::image type="content" source="media\how-to-use-certsp-emit-log-to-eventhub\managed-identity-name-and-object-id.png" alt-text="Screenshot showing managed identity name and object id are in edit linked service.":::

2. In **Key Vault**, assign the linked service a **Reader** role. 

## Step 7. Configure with a linked service

1. Open your Synapse workspace and create or open a notebook.
2. In the first code cell, add the configuration code to emit logs to Event Hub.

     ```
     %%configure -f
     {
     "conf": { 
        "spark.synapse.diagnostic.emitters": <EMITTER_NAME>,
        "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.type": "AzureEventHub",
        "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.categories": "DriverLog,ExecutorLog,EventLog,Metrics",
        "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.certificate.keyVault.certificateName": <CERTIFICATE_NAME>",
        "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.certificate.keyVault.linkedService": <LINKED_SERVICE_NAME>,
        "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.hostName": <EVENT_HUB_HOST_NAME>,
        "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.tenantId": <SERVICE_PRINCIPAL_TENANT_ID>,
        "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.clientId": <SERVICE_PRINCIPAL_CLIENT_ID>,
        "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.entityPath": <EVENT_HUB_ENTITY_PATH> 
          }, 
          "jars": [ 
               "Your-specific-jar-in-blob" 
               ] 
     } 
     ```

Gather the following values and add to the Apache Spark configuration.

- **<EMITTER_NAME>**: The name for the emmiter.
- **<CERTIFICATE_NAME>**: The certificate name that you generated in the key vault.
- **<LINKED_SERVICE_NAME>**: The Azure Key vault linked service name.
- **<EVENT_HUB_HOST_NAME>**: The Event Hub host name, you can find it in Event Hubs Namespace -> Overview -> Host name.
- **<SERVICE_PRINCIPAL_TENANT_ID>**: The service principal tenant id, you can find it in App registrations -> your app name -> Overview -> Directory (tenant) ID
- **<SERVICE_PRINCIPAL_CLIENT_ID>**: The service principal client id, you can find it in registrations -> your app name -> Overview -> Application(client) ID
- **<EVENT_HUB_ENTITY_PATH>**: The Event Hub entity path, you can find it in Event Hubs Namespace -> Overview -> Host name.

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

