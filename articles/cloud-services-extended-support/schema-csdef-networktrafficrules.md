---
title: Azure Cloud Services (extended support) Def. NetworkTrafficRules Schema | Microsoft Docs
description: Information related to the network traffic rules associated with Cloud Services (extended support)
ms.topic: article
ms.service: cloud-services-extended-support
ms.date: 10/14/2020
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.custom: 
---

# Azure Cloud Services (extended support) definition NetworkTrafficRules schema

The `NetworkTrafficRules` node is an optional element in the service definition file that specifies how roles communicate with each other. It limits which roles can access the internal endpoints of the specific role. The `NetworkTrafficRules` is not a standalone element; it is combined with two or more roles in a service definition file.

The default extension for the service definition file is csdef.

> [!NOTE]
>  The `NetworkTrafficRules` node is only available using the Azure SDK version 1.3 or higher.

## Basic service definition schema for the network traffic rules
The basic format of a service definition file containing network traffic definitions is as follows.

```xml
<ServiceDefinition …>
   <NetworkTrafficRules>
      <OnlyAllowTrafficTo>
         <Destinations>
            <RoleEndpoint endpointName="<name-of-the-endpoint>" roleName="<name-of-the-role-containing-the-endpoint>"/>
         </Destinations>
         <AllowAllTraffic/>
         <WhenSource matches="[AnyRule]">
            <FromRole roleName="<name-of-the-role-to-allow-traffic-from>"/>
         </WhenSource>
      </OnlyAllowTrafficTo>
   </NetworkTrafficRules>
</ServiceDefinition>
```

## Schema elements
The `NetworkTrafficRules` node of the service definition file includes these elements, described in detail in subsequent sections in this topic:

[NetworkTrafficRules Element](#NetworkTrafficRules)

[OnlyAllowTrafficTo Element](#OnlyAllowTrafficTo)

[Destinations Element](#Destinations)

[RoleEndpoint Element](#RoleEndpoint)

[AllowAllTraffic Element](#AllowAllTraffic)

[WhenSource Element](#WhenSource)

[FromRole Element](#FromRole)

##  <a name="NetworkTrafficRules"></a> NetworkTrafficRules element
The `NetworkTrafficRules` element specifies which roles can communicate with which endpoint on another role. A service can contain one `NetworkTrafficRules` definition.

##  <a name="OnlyAllowTrafficTo"></a> OnlyAllowTrafficTo element
The `OnlyAllowTrafficTo` element describes a collection of destination endpoints and the roles that can communicate with them. You can specify multiple `OnlyAllowTrafficTo` nodes.

##  <a name="Destinations"></a> Destinations element
The `Destinations` element describes a collection of RoleEndpoints than can be communicated with.

##  <a name="RoleEndpoint"></a> RoleEndpoint element
The `RoleEndpoint` element describes an endpoint on a role to allow communications with. You can specify multiple `RoleEndpoint` elements if there are more than one endpoint on the role.

| Attribute      | Type     | Description |
| -------------- | -------- | ----------- |
| `endpointName` | `string` | Required. The name of the endpoint to allow traffic to.|
| `roleName`     | `string` | Required. The name of the web role to allow communication to.|

## <a name="AllowAllTraffic"></a> AllowAllTraffic element
The `AllowAllTraffic` element is a rule that allows all roles to communicate with the endpoints defined in the `Destinations` node.

##  <a name="WhenSource"></a> WhenSource element
The `WhenSource` element describes a collection of roles than can communicate with the endpoints defined in the `Destinations` node.

| Attribute | Type     | Description |
| --------- | -------- | ----------- |
| `matches` | `string` | Required. Specifies the rule to apply when allowing communications. The only valid value is currently `AnyRule`.|
  
##  <a name="FromRole"></a> FromRole element
The `FromRole` element specifies the roles that can communicate with the endpoints defined in the `Destinations` node. You can specify multiple `FromRole` elements if there are more than one role that can communicate with the endpoints.

| Attribute  | Type     | Description |
| ---------- | -------- | ----------- |
| `roleName` | `string` | Required. The name for role from which to allow communication.|

## See also
[Cloud Service (extended support) Definition Schema](schema-csdef-file.md).




