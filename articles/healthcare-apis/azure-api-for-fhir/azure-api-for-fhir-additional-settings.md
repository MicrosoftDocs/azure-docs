---
title: Additional Settings for Azure API for FHIR
description: Overview of the additional settings you can set for Azure API for FHIR
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.author: kesheth
author: expekesheth
ms.date: 09/27/2023
---

# Additional settings for Azure API for FHIR

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this how-to guide, we'll review the additional settings you may want to set in your Azure API for FHIR. There are additional pages that drill into even more details.

## Configure Database settings

Azure API for FHIR uses database to store its data. Performance of the underlying database depends on the number of Request Units (RU) selected during service provisioning or in database settings after the service has been provisioned.

Throughput must be provisioned to ensure that sufficient system resources are available for your database at all times. How many RUs you need for your application depends on operations you perform. Operations can range from simple read and writes to more complex queries.

For more information on how to change the default settings, see [configure database settings](configure-database.md).

## Access control

Azure API for FHIR will only allow authorized users to access the FHIR API. You can configure authorized users through two different mechanisms. The primary and recommended way to configure access control is using [Azure role-based access control (Azure RBAC)](../../role-based-access-control/index.yml), which is accessible through the **Access control (IAM)** blade. Azure RBAC only works if you want to secure data plane access using the Azure Active Directory tenant associated with your subscription. If you wish to use a different tenant, the Azure API for FHIR offers a local FHIR data plane access control mechanism. The configuration options aren't as rich when using the local RBAC mechanism. For details, choose one of the following options:

* [Azure RBAC for FHIR data plane](configure-azure-rbac.md). This is the preferred option when you're using the Azure Active Directory tenant associated with your subscription.
* [Local FHIR data plane access control](configure-local-rbac.md). Use this option only when you need to use an external Azure Active Directory tenant for data plane access control. 

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
>[Deploy JavaScript application](tutorial-web-app-fhir-server.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.