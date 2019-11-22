---
title: Additional Settings for Azure API for FHIR
description: Overview of the additional settings you can set for Azure API for FHIR
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: cavoeg
author: CaitlinV39
ms.date: 11/22/2019
---

# Additional settings for Azure API for FHIR

In this tutorial, we will review the additional settings you may want to set. There are additional pages for each item that can be found in the how-to-guides.

## Configure Database settings

Azure API for FHIR uses database to store its data. Performance of the underlying database depends on the number of Request Units (RU) selected during service provisioning or in database settings after the service has been provisioned.

Throughput must be provisioned to ensure that sufficient system resources are available for your database at all times. How many RUs you need for your application depends on operations you perform. Operations can range from simple read and writes to more complex queries.

For more details on how to change the default settings, please refer to [configure database settings](configure-database.md).

## Find identity object IDs
The fully managed Azure API for FHIR&reg; service is configured to allow access for only a pre-defined list of identity object IDs. When an application or user is trying to access the FHIR API, a bearer token must be presented. This bearer token will have certain claims (fields). In order to grant access to the FHIR API, the token must contain the right issuer (`iss`), audience (`aud`), and an object ID (`oid`) from a list of allowed object IDs. An identity object ID is either the object ID of a user or a service principal in Azure Active Directory.

When you create a new Azure API for FHIR instance, you can configure a list of allowed object IDs. To configure this list, please see our how-to-guide to [find identity object IDs](find-identity-object-ids.md).

## Enable diagnostic logging
You may want to enable diagnostic logging as part of your setup to be able to monitor your service and have accurate reporting for compliance purposes. For details on how to set up diagnostic logging, please see our [how-to-guide](enable-diagnostic-logging.md) on how to set up diagnostic logging, along with some sample queries. 

## Use custom headers to add data to audit logs
In the Azure API for FHIR, you may want to include additional information in the logs, which comes from the calling system. To do including this information, you can leverage custom headers.

You can use custom headers to capture several types of information. For example:

* Identity or authorization information
* Origin of the caller
* Originating organization
* Client system details (electronic health record, patient portal)

To add this data to your audit logs, please see the [Use Custom HTTP headers to add data to Audit Logs](use-custom-headers.md) how-to-guide.

## Next steps

In this tutorial, you set up additional settings for the Azure API for FHIR.

Next we will walk through writing an application to connect to the Azure API for FHIR endpoint

>[!div class="nextstepaction"]
>[Write an application to connect to an Azure API for FHIR endpoint](tutorial-3-connect-to-endpoint.md)