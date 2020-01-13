---
title: Additional Settings for Azure API for FHIR
description: Overview of the additional settings you can set for Azure API for FHIR
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.reviewer: mihansen
ms.author: cavoeg
author: CaitlinV39
ms.date: 11/22/2019
---

# Additional settings for Azure API for FHIR

In this how-to guide, we will review the additional settings you may want to set in your Azure API for FHIR. There are additional pages that drill into even more details.

## Configure Database settings

Azure API for FHIR uses database to store its data. Performance of the underlying database depends on the number of Request Units (RU) selected during service provisioning or in database settings after the service has been provisioned.

Throughput must be provisioned to ensure that sufficient system resources are available for your database at all times. How many RUs you need for your application depends on operations you perform. Operations can range from simple read and writes to more complex queries.

For more information on how to change the default settings, see [configure database settings](configure-database.md).

## Find identity object IDs
The fully managed Azure API for FHIR service is configured to allow access for only a pre-defined list of identity object IDs. When an application or user is trying to access the FHIR API, a bearer token must be presented. This bearer token will have certain claims (fields). In order to grant access to the FHIR API, the token must contain the right issuer (`iss`), audience (`aud`), and an object ID (`oid`) from a list of allowed object IDs. An identity object ID is either the object ID of a user or a service principal in Azure Active Directory.

When you create a new Azure API for FHIR instance, you can configure a list of allowed object IDs. To configure this list, see our how-to-guide to [find identity object IDs](find-identity-object-ids.md).

## Enable diagnostic logging
You may want to enable diagnostic logging as part of your setup to be able to monitor your service and have accurate reporting for compliance purposes. For details on how to set up diagnostic logging, see our [how-to-guide](enable-diagnostic-logging.md) on how to set up diagnostic logging, along with some sample queries. 

## Use custom headers to add data to audit logs
In the Azure API for FHIR, you may want to include additional information in the logs, which comes from the calling system. To do including this information, you can use custom headers.

You can use custom headers to capture several types of information. For example:

* Identity or authorization information
* Origin of the caller
* Originating organization
* Client system details (electronic health record, patient portal)

To add this data to your audit logs, see the [Use Custom HTTP headers to add data to Audit Logs](use-custom-headers.md) how-to-guide.

## Next steps

In this how-to guide, you set up additional settings for the Azure API for FHIR.

Next check out the series of tutorials to create a web application that reads FHIR data.

>[!div class="nextstepaction"]
>[Deploy javascript application](tutorial-web-app-fhir-server.md)