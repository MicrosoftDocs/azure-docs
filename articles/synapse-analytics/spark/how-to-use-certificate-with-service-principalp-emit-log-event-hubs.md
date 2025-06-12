---
title: Collect Apache Spark Application Logs and Metrics to Azure Event Hubs Using Certificate-Based Service Principal Authentication
description: Learn to setting up Azure services, particularly focusing on integrating Azure Synapse with Azure Event Hubs and Key Vault.
author: jejiang
ms.author: jejiang
ms.reviewer: whhender
ms.topic: tutorial
ms.date: 03/24/2025
---

# Collect Apache Spark Application Logs and Metrics to Azure Event Hubs Using Certificate-Based Service Principal Authentication

The Apache Spark diagnostic emitter extension is a library that allows Spark applications to send logs, event logs, and metrics to destinations like Azure Event Hubs, Azure Log Analytics, and Azure Storage.

In this tutorial, you learn how to create required Azure resources and configure a Spark application with a certificate and service principal to emit logs, event logs, and metrics to Azure Event Hubs using the Apache Spark diagnostic emitter extension.

## Prerequisites

- An Azure subscription. You can also [create a free account](https://azure.microsoft.com/free/) before you get started.
- [Synapse Analytics workspace](/azure/synapse-analytics/get-started-create-workspace).
- [Azure Event Hubs](/azure/event-hubs/event-hubs-about).
- [Azure Key Vault](/azure/key-vault/general/overview)
- [App Registration](https://ms.portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)

> [!Note]
>
> To complete this tutorial's steps, you need to have access to a resource group for which you're assigned the Owner role. 
>

## Step 1. Register an application

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to [App registrations](/entra/identity-platform/quickstart-register-app#register-an-application).
2. Create a new app registration for your Synapse workspace.

     :::image type="content" source="media\how-to-use-certificate-with-service-principalp-emit-log-event-hubs\create-a-new-app-registration.png" alt-text="Screenshot showing create a new app registration.":::

## Step 2. Generate a certificate in Key Vault

1. Navigate to Key Vault.
2. Expand the **Object**, and select the **Certificates**.
3. Click on **Generate/Import**. 

     :::image type="content" source="media\how-to-use-certificate-with-service-principalp-emit-log-event-hubs\generate-a-new-certificate.png" alt-text="Screenshot showing generate a new certificate for app.":::

## Step 3. Trust the certificate in the application 

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

     :::image type="content" source="media\how-to-use-certificate-with-service-principalp-emit-log-event-hubs\trust-the-certificate.png" alt-text="Screenshot showing trust the certificate in the application.":::

## Step 4. Assign Azure Event Hubs Data Sender Role 

1. In Azure Event Hubs, navigate to Access control (IAM).
2. Assign the Azure Event Hubs data sender role to the application (service principal).

     :::image type="content" source="media\how-to-use-certificate-with-service-principalp-emit-log-event-hubs\assign-azure-event-hubs-data-sender-role.png" alt-text="Screenshot showing assign Azure event hubs data sender role.":::

## Step 5. Create a linked service in Synapse

1. In Synapse Analytics workspace, go to **Manage** -> **linked service**.
2. Create a new **linked Service** in Synapse to connect to **Key Vault**. 

     :::image type="content" source="media\how-to-use-certificate-with-service-principalp-emit-log-event-hubs\create-a-linked-service-in-synapse.png" alt-text="Screenshot showing create a linked service in synapse.":::

## Step 6. Assign reader role to linked service in Key Vault

1. Get the workspace managed identity ID from the linked service. The **managed identity name** and **object ID** for the linked service is under **Edit linked service**. 

     :::image type="content" source="media\how-to-use-certificate-with-service-principalp-emit-log-event-hubs\managed-identity-name-and-object-id.png" alt-text="Screenshot showing managed identity name and object ID are in edit linked service.":::

2. In **Key Vault**, assign the linked service a **Reader** role. 

## Step 7. Configure with a linked service

Gather the following values and add to the Apache Spark configuration.

- **<EMITTER_NAME>**: The name for the emmiter.
- **<CERTIFICATE_NAME>**: The certificate name that you generated in the key vault.
- **<LINKED_SERVICE_NAME>**: The Azure Key vault linked service name.
- **<EVENT_HUB_HOST_NAME>**: The Azure Event Hubs host name, you can find it in Azure Event Hubs Namespace -> Overview -> Host name.
- **<SERVICE_PRINCIPAL_TENANT_ID>**: The service principal tenant ID, you can find it in App registrations -> your app name -> Overview -> Directory (tenant) ID
- **<SERVICE_PRINCIPAL_CLIENT_ID>**: The service principal client ID, you can find it in registrations -> your app name -> Overview -> Application(client) ID
- **<EVENT_HUB_ENTITY_PATH>**: The Azure Event Hubs entity path, you can find it in Azure Event Hubs Namespace -> Overview -> Host name.

```
     "spark.synapse.diagnostic.emitters": <EMITTER_NAME>,
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.type": "AzureEventHub",
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.categories": "DriverLog,ExecutorLog,EventLog,Metrics",
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.certificate.keyVault.certificateName": <CERTIFICATE_NAME>",
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.certificate.keyVault.linkedService": <LINKED_SERVICE_NAME>,
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.hostName": <EVENT_HUB_HOST_NAME>,
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.tenantId": <SERVICE_PRINCIPAL_TENANT_ID>,
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.clientId": <SERVICE_PRINCIPAL_CLIENT_ID>,
     "spark.synapse.diagnostic.emitter.<EMITTER_NAME>.entityPath": <EVENT_HUB_ENTITY_PATH>
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

