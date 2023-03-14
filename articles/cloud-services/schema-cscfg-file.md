---
title: Azure Cloud Services (classic) Definition Schema (.cscfg File) | Microsoft Docs
description: A service configuration (.cscfg) file specifies how many role instances to deploy for each role, configuration values, and certificate thumbprints for a role.
ms.topic: article
ms.service: cloud-services
ms.subservice: deployment-files
ms.date: 02/21/2023
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.custom: compute-evergreen
---

# Azure Cloud Services (classic) Config Schema (.cscfg File)

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

The service configuration file specifies the number of role instances to deploy for each role in the service, the values of any configuration settings, and the thumbprints for any certificates associated with a role. If the service is part of a Virtual Network, configuration information for the network must be provided in the service configuration file, as well as in the virtual networking configuration file. The default extension for the service configuration file is .cscfg.

The service model is described by the [Cloud Service (classic) Definition Schema](schema-csdef-file.md).

By default, the Azure Diagnostics configuration schema file is installed to the `C:\Program Files\Microsoft SDKs\Windows Azure\.NET SDK\<version>\schemas` directory. Replace `<version>` with the installed version of the [Azure SDK](https://azure.microsoft.com/downloads/).

For more information about configuring roles in a service, see [What is the Cloud Service model](cloud-services-model-and-package.md).

## Basic Service Configuration Schema
The basic format of the service configuration file is as follows.

```xml
<ServiceConfiguration serviceName="<service-name>" osFamily="<osfamily-number>" osVersion="<os-version>" schemaVersion="<schema-version>">

  <Role …>
    …
  </Role>

  <NetworkConfiguration>
    …
  </NetworkConfiguration>

</ServiceConfiguration>
```

## Schema definitions
The following topics describe the schema for the `ServiceConfiguration` element:

- [Role Schema](schema-cscfg-role.md)
- [NetworkConfiguration Schema](schema-cscfg-networkconfiguration.md)

## Service Configuration Namespace
The XML namespace for the service configuration file is: `http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceConfiguration`.

##  <a name="ServiceConfiguration"></a> ServiceConfiguration Element
The `ServiceConfiguration` element is the top-level element of the service configuration file.

The following table describes the attributes of the `ServiceConfiguration` element. All attributes values are string types.

| Attribute | Description |
| --------- | ----------- |
|serviceName|Required. The name of the cloud service. The name given here must match the name specified in the service definition file.|
|osFamily|Optional. Specifies the Guest OS that will run on role instances in the cloud service. For information about supported Guest OS releases, see [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md).<br /><br /> If you do not include an `osFamily` value and you have not set the `osVersion` attribute to a specific Guest OS version, a default value of 1 is used.|
|osVersion|Optional. Specifies the version of the Guest OS that will run on role instances in the cloud service. For more information about Guest OS versions, see [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md).<br /><br /> You can specify that the Guest OS should be automatically upgraded to the latest version. To do this, set the value of the `osVersion` attribute to `*`. When set to `*`, the role instances are deployed using the latest version of the Guest OS for the specified OS family and will be automatically upgraded when new versions of the Guest OS are released.<br /><br /> To specify a specific version manually, use the `Configuration String` from the table in the **Future, Current and Transitional Guest OS Versions** section of [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md).<br /><br /> The default value for the `osVersion` attribute is `*`.|
|schemaVersion|Optional. Specifies the version of the Service Configuration schema. The schema version allows Visual Studio to select the correct SDK tools to use for schema validation if more than one version of the SDK is installed side-by-side. For more information about schema and version compatibility, see [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md)|

The service configuration file must contain one `ServiceConfiguration` element. The `ServiceConfiguration` element may include any number of `Role` elements and zero or 1 `NetworkConfiguration` elements.