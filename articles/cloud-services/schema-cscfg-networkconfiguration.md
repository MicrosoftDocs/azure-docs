---
title: Azure Cloud Services (classic) NetworkConfiguration Schema | Microsoft Docs
description: Learn about the child elements of the NetworkConfiguration element of the service configuration file, which specifies Virtual Network and DNS values.
ms.topic: article
ms.service: cloud-services
ms.subservice: deployment-files
ms.date: 02/21/2023
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.custom: compute-evergreen 

---

# Azure Cloud Services (classic) Config NetworkConfiguration Schema

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

The `NetworkConfiguration` element of the service configuration file specifies Virtual Network and DNS values. These settings are optional for cloud services.

You can use the following resource to learn more about Virtual Networks and the associated schemas:

- [Cloud Service (classic) Configuration Schema](schema-cscfg-file.md)
- [Cloud Service (classic) Definition Schema](schema-csdef-file.md)
- [Create a Virtual Network (classic)](/previous-versions/azure/virtual-network/virtual-networks-create-vnet-classic-pportal)

## NetworkConfiguration Element
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
        <ReservedIP name="GROUP <ResourceGroupNameOfReservedIP> <reserved-ip-name>"/>
      </ReservedIPs>
    </AddressAssignments>
  </NetworkConfiguration>
</ServiceConfiguration>
```

The following table describes the child elements of the `NetworkConfiguration` element.

| Element       | Description |
| ------------- | ----------- |
| AccessControl | Optional. Specifies the rules for access to endpoints in a cloud service. The access control name is defined by a string for `name` attribute. The `AccessControl` element contains one or more `Rule` elements. More than one `AccessControl` element can be defined.|
| Rule | Optional. Specifies the action that should be taken for a specified subnet range of IP addresses. The order of the rule is defined by a string value for the `order` attribute. The lower the rule number the higher the priority. For example, rules could be specified with order numbers of 100, 200, and 300. The rule with the order number of 100 takes precedence over the rule that has an order of 200.<br /><br /> The action for the rule is defined by a string for the `action` attribute. Possible values are:<br /><br /> -   `permit` – Specifies that only packets from the specified subnet range can communicate with the endpoint.<br />-   `deny` – Specifies that access is denied to the endpoints in the specified subnet range.<br /><br /> The subnet range of IP addresses that are affected by the rule are defined by a string for the `remoteSubnet` attribute. The description for the rule is defined by a string for the `description` attribute.|
| EndpointAcl | Optional. Specifies the assignment of access control rules to an endpoint. The name of the role that contains the endpoint is defined by a string for the `role` attribute. The name of the endpoint is defined by a string for the `endpoint` attribute. The name of the set of `AccessControl` rules that should be applied to the endpoint are defined in a string for the `accessControl` attribute. More than one `EndpointAcl` elements can be defined.|
| DnsServer | Optional. Specifies the settings for a DNS server. You can specify settings for DNS servers without a Virtual Network. The name of the DNS server is defined by a string for the `name` attribute. The IP address of the DNS server is defined by a string for the `IPAddress` attribute. The IP address must be a valid IPv4 address.|
| VirtualNetworkSite | Optional. Specifies the name of the Virtual Network site in which you want deploy your cloud service. This setting does not create a Virtual Network Site. It references a site that has been previously defined in the network file for your Virtual Network. A cloud service can only be a member of one Virtual Network. If you do not specify this setting, the cloud service will not be deployed to a Virtual Network. The name of the Virtual Network site is defined by a string for the `name` attribute.|
| InstanceAddress | Optional. Specifies the association of a role to a subnet or set of subnets in the Virtual Network. When you associate a role name to an instance address, you can specify the subnets to which you want this role to be associated. The `InstanceAddress` contains a Subnets element. The name of the role that is associated with the subnet or subnets is defined by a string for the `roleName` attribute.|
| Subnet | Optional. Specifies the subnet that corresponds to the subnet name in the network configuration file. The name of the subnet is defined by a string for the `name` attribute.|
| ReservedIP | Optional. Specifies the reserved IP address that should be associated with the deployment. You must use Create Reserved IP Address to create the reserved IP address. Each deployment in a cloud service can be associated with one reserved IP address. The name of the reserved IP address is defined by a string for the `name` attribute.|

## See Also
[Cloud Service (classic) Configuration Schema](schema-cscfg-file.md)
