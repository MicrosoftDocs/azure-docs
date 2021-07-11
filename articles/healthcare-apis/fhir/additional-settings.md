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