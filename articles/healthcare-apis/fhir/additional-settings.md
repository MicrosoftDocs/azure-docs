---
title: Additional Settings for FHIR service
description: Overview of the additional settings you can set for FHIR service
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.reviewer: matjazl
ms.author: cavoeg
author: CaitlinV39
ms.date: 11/22/2019
---

# Additional settings for FHIR service

In this how-to guide, we will review the additional settings you may want to set in your FHIR service. There are additional pages that drill into even more details.

## Access control

FHIR service will only allow authorized users to access the FHIR API. You can configure authorized users through two different mechanisms. The primary and recommended way to configure access control is using [Azure role-based access control (Azure RBAC)](../../role-based-access-control/index.yml), which is accessible through the **Access control (IAM)** blade. Azure RBAC only works if you want to secure data plane access using the Azure Active Directory tenant associated with your subscription. If you wish to use a different tenant, the FHIR service offers a local FHIR data plane access control mechanism. The configuration options are not as rich when using the local RBAC mechanism. For details, choose one of the following options:

* [Azure RBAC for FHIR data plane](configure-azure-rbac.md). This is the preferred option when you are using the Azure Active Directory tenant associated with your subscription.
* [Local FHIR data plane access control](configure-local-rbac.md). Use this option only when you need to use an external Azure Active Directory tenant for data plane access control. 

## Enable diagnostic logging
You may want to enable diagnostic logging as part of your setup to be able to monitor your service and have accurate reporting for compliance purposes. For details on how to set up diagnostic logging, see our [how-to-guide](enable-diagnostic-logging.md) on how to set up diagnostic logging, along with some sample queries. 

## Use custom headers to add data to audit logs
In FHIR service, you may want to include additional information in the logs, which comes from the calling system. To do including this information, you can use custom headers.

You can use custom headers to capture several types of information. For example:

* Identity or authorization information
* Origin of the caller
* Originating organization
* Client system details (electronic health record, patient portal)

To add this data to your audit logs, see the [Use Custom HTTP headers to add data to Audit Logs](use-custom-headers.md) how-to-guide.

## Next steps

In this how-to guide, you set up additional settings for the FHIR service.

Next check out the series of tutorials to create a web application that reads FHIR data.

>[!div class="nextstepaction"]
>[Deploy JavaScript application](tutorial-web-app-fhir-server.md)