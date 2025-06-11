---
title: Azure Cloud Services (extended support) Role Schema | Microsoft Docs
description: Information related to the role schema for Cloud Services (extended support)
ms.topic: concept-article
ms.service: azure-cloud-services-extended-support
ms.date: 07/24/2024
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
# Customer intent: As a cloud solutions architect, I want to understand the role schema for Azure Cloud Services (extended support), so that I can configure service roles, instances, settings, and certificates effectively in my deployments.
---

# Azure Cloud Services (extended support) config role schema

> [!IMPORTANT]
> As of March 31, 2025, cloud Services (extended support) is deprecated and will be fully retired on March 31, 2027. [Learn more](https://aka.ms/csesretirement) about this deprecation and [how to migrate](https://aka.ms/cses-retirement-march-2025).

The `Role` element of the configuration file specifies the number of role instances to deploy for each role in the service, the values of any configuration settings, and the thumbprints for any certificates associated with a role.

For more information about the Azure Service Configuration Schema, see [Cloud Service (extended support) Configuration Schema](schema-cscfg-file.md). For more information about the Azure Service Definition Schema, see [Cloud Service (extended support) Definition Schema](schema-csdef-file.md).

##  <a name="Role"></a> Role element
The following example shows the `Role` element and its child elements.

```xml 
<ServiceConfiguration>
  <Role name="<role-name>" vmName="<vm-name>">
    <Instances count="<number-of-instances>"/>
    <ConfigurationSettings>
      <Setting name="<setting-name>" value="<setting-value>" />
    </ConfigurationSettings>
    <Certificates>
      <Certificate name="<certificate-name>" thumbprint="<certificate-thumbprint>" thumbprintAlgorithm="<algorithm>"/>
    </Certificates>
  </Role>
</ServiceConfiguration>
```

The following table describes the attributes for the `Role` element.

| Attribute | Description |
| --------- | ----------- |
| name   | Required. Specifies the name of the role. The name must match the name provided for the role in the service definition file.|
| vmName | Optional. Specifies the DNS name for a Virtual Machine. The name must be 10 characters or less.|

The following table describes the child elements of the `Role` element.

| Element | Description |
| ------- | ----------- |
| Instances | Required. Specifies the number of instances to deploy for the role. The number of instances is defined by an integer for the `count` attribute.|
| Setting   | Optional. Specifies a setting name and value in a collection of settings for a role. The setting name is defined by a string for the `name` attribute and the setting value is defined by a string for the `value` attribute.|
| Certificate | Optional. Specifies the name, thumbprint, and algorithm of a service certificate that is to be associated with the role. The certificate name is defined by a string for the `name` attribute. The certificate thumbprint is defined by a string of hexadecimal numbers containing no spaces for the `thumbprint` attribute. The hexadecimal numbers must be represented using digits and uppercase alpha characters. The certificate algorithm is defined by a string for the `thumbprintAlgorithm` attribute.|

## See also
[Cloud Service (extended support) Configuration Schema](schema-cscfg-file.md).
