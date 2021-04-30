---
title: Azure Cloud Services (extended support) NetworkConfiguration Schema | Microsoft Docs
description: Information related to the network configuration schema for Cloud Services (extended support)
ms.topic: article
ms.service: cloud-services-extended-support
ms.date: 10/14/2020
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.custom: 
---

# Azure Cloud Services (extended support) config networkConfiguration schema

The `NetworkConfiguration` element of the service configuration file specifies Virtual Network and DNS values. These settings are optional for Cloud Services.

You can use the following resource to learn more about Virtual Networks and the associated schemas:

- [Cloud Service (extended support) Configuration Schema](schema-cscfg-file.md).
- [Cloud Service (extended support) Definition Schema](schema-csdef-file.md).
- [Create a Virtual Network](../virtual-network/manage-virtual-network.md).

## NetworkConfiguration element
The following example shows the `NetworkConfiguration` element and its child elements.

```xml
<ServiceConfiguration>
  <NetworkConfiguration>
    <AccessControls>
      <AccessControl name="aclName1">
        <Rule order="<rule-order>" action="<rule-action>" remoteSubnet="<subnet-address>" description="rule-description"/>
      </AccessControl>
    </AccessControls>
    <EndpointAcls>
      <EndpointAcl role="<role-name>" endpoint="<endpoint-name>" accessControl="<acl-name>"/>
    </EndpointAcls>
    <Dns>
      <DnsServers>
        <DnsServer name="<server-name>" IPAddress="<server-address>" />
      </DnsServers>
    </Dns>
    <VirtualNetworkSite name="Group <RG-VNet> <VNet-name>"/>
    <AddressAssignments>
      <InstanceAddress roleName="<role-name>">
        <Subnets>
          <Subnet name="<subnet-name>"/>
        </Subnets>
      </InstanceAddress>
      <ReservedIPs>
        <ReservedIP name="<reserved-ip-name>"/>
      </ReservedIPs>
    </AddressAssignments>
  </NetworkConfiguration>
</ServiceConfiguration>
```

The following table describes the child elements of the `NetworkConfiguration` element.

| Element       | Description |
| ------------- | ----------- |
| AccessControl | Optional. Specifies the rules for access to endpoints in a Cloud Service. The access control name is defined by a string for `name` attribute. The `AccessControl` element contains one or more `Rule` elements. More than one `AccessControl` element can be defined.|
| Rule | Optional. Specifies the action that should be taken for a specified subnet range of IP addresses. The order of the rule is defined by a string value for the `order` attribute. The lower the rule number the higher the priority. For example, rules could be specified with order numbers of 100, 200, and 300. The rule with the order number of 100 takes precedence over the rule that has an order of 200.<br /><br /> The action for the rule is defined by a string for the `action` attribute. Possible values are:<br /><br /> -   `permit` – Specifies that only packets from the specified subnet range can communicate with the endpoint.<br />-   `deny` – Specifies that access is denied to the endpoints in the specified subnet range.<br /><br /> The subnet range of IP addresses that are affected by the rule are defined by a string for the `remoteSubnet` attribute. The description for the rule is defined by a string for the `description` attribute.|
| EndpointAcl | Optional. Specifies the assignment of access control rules to an endpoint. The name of the role that contains the endpoint is defined by a string for the `role` attribute. The name of the endpoint is defined by a string for the `endpoint` attribute. The name of the set of `AccessControl` rules that should be applied to the endpoint are defined in a string for the `accessControl` attribute. More than one `EndpointAcl` elements can be defined.|
| DnsServer | Optional. Specifies the settings for a DNS server. You can specify settings for DNS servers without a Virtual Network. The name of the DNS server is defined by a string for the `name` attribute. The IP address of the DNS server is defined by a string for the `IPAddress` attribute. The IP address must be a valid IPv4 address.|
| VirtualNetworkSite | Optional. Specifies the name of the Virtual Network site in which you want deploy your Cloud Service. This setting does not create a Virtual Network Site. It references a site that has been previously defined in the network file for your Virtual Network. A Cloud Service can only be a member of one Virtual Network. If you do not specify this setting, the Cloud Service will not be deployed to a Virtual Network. The name of the Virtual Network site is defined by a string for the `name` attribute.|
| InstanceAddress | Optional. Specifies the association of a role to a subnet or set of subnets in the Virtual Network. When you associate a role name to an instance address, you can specify the subnets to which you want this role to be associated. The `InstanceAddress` contains a Subnets element. The name of the role that is associated with the subnet or subnets is defined by a string for the `roleName` attribute.|
| Subnet | Optional. Specifies the subnet that corresponds to the subnet name in the network configuration file. The name of the subnet is defined by a string for the `name` attribute.|
| ReservedIP | Optional. Specifies the reserved IP address that should be associated with the deployment. The allocation method for a reserved IP needs to be specified as `Static` for template and powershell deployments. Each deployment in a Cloud Service can be associated with only one reserved IP address. The name of the reserved IP address is defined by a string for the `name` attribute.|

## See also
[Cloud Service (extended support) Configuration Schema](schema-cscfg-file.md).
