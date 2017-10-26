---
title: Azure Service Fabric service model XML schema descriptions | Microsoft Docs
description: Describes the XML schema of the Service Fabric service model.
services: service-fabric
documentationcenter: na
author: rwike77
manager: timlt
editor: 
ms.assetid: 
ms.service: service-fabric
ms.devlang: xml
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 10/25/2017
ms.author: ryanwi
---

# ServiceFabricServiceModel.xsd schema documentation
This article documents the ServiceFabricServiceModel.xsd schema file installed with the Service Fabric SDK.

## ClusterManifest Element
|---|---|
|type|[ClusterManifestType](#clustermanifesttype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ClusterManifest|
|documentation|Describes a Microsoft Azure Service Fabric Cluster.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterManifest" type="ClusterManifestType">
                <xs:annotation>
                        <xs:documentation>Describes a Microsoft Azure Service Fabric Cluster.</xs:documentation>
                </xs:annotation>
        </xs:element>
        
```


## ApplicationManifest Element
|---|---|
|type|[ApplicationManifestType](#applicationmanifesttype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ApplicationManifest|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationManifest" type="ApplicationManifestType"/>
        
```


## ServiceManifest Element
|---|---|
|type|[ServiceManifestType](#servicemanifesttype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceManifest|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceManifest" type="ServiceManifestType"/>
        
```


## Application Element
|---|---|
|type|[AppInstanceDefinitionType](#appinstancedefinitiontype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Application|
|documentation|Application Instance specific information like application name and application parameter values used to create application. Parameter values in this file overrides the default parameter values defined in Application Manifest.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Application" type="AppInstanceDefinitionType">
                <xs:annotation>
                        <xs:documentation>Application Instance specific information like application name and application parameter values used to create application. Parameter values in this file overrides the default parameter values defined in Application Manifest.</xs:documentation>
                </xs:annotation>
        </xs:element>
        
```


## Settings Element
|---|---|
|type|[SettingsType](#settingstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Settings|
|documentation|Defiles configurable settings for the code packages of a service. Microsoft Azure Service Fabric does not interpret the settings, however it makes them available via Runtime APIs for use by the code components.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Settings" type="SettingsType">
                <xs:annotation>
                        <xs:documentation>Defiles configurable settings for the code packages of a service. Microsoft Azure Service Fabric does not interpret the settings, however it makes them available via Runtime APIs for use by the code components.</xs:documentation>
                </xs:annotation>
        </xs:element>
        
```


## InfrastructureInformation Element
|---|---|
|type|[InfrastructureInformationType](#infrastructureinformationtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|InfrastructureInformation|
|documentation|Describes the infrastructure on which fabric needs to run.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="InfrastructureInformation" type="InfrastructureInformationType">
                <xs:annotation>
                        <xs:documentation>Describes the infrastructure on which fabric needs to run.</xs:documentation>
                </xs:annotation>
        </xs:element>
        
```


## TargetInformation Element
|---|---|
|type|[TargetInformationType](#targetinformationtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|TargetInformation|
|documentation|Describes the target the FabricDeployer needs to deploy.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="TargetInformation" type="TargetInformationType">
                <xs:annotation>
                        <xs:documentation>Describes the target the FabricDeployer needs to deploy.</xs:documentation>
                </xs:annotation>
        </xs:element>
        
```


## NodeTypes Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|NodeTypes|
|minOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeTypes" minOccurs="1">
                                <xs:complexType>
                                        <xs:sequence>
                                                <xs:element name="NodeType" maxOccurs="unbounded">
                                                        <xs:annotation>
                                                                <xs:documentation>Describe a node type.</xs:documentation>
                                                        </xs:annotation>
                                                        <xs:complexType>
                                                                <xs:all>
                                                                        <xs:element name="Endpoints" type="FabricEndpointsType" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the endpoints associated with this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                        </xs:element>
                                                                          <xs:element name="KtlLoggerSettings" type="FabricKtlLoggerSettingsType" minOccurs="0">
                                                                            <xs:annotation>
                                                                              <xs:documentation>Describe the KtlLogger information associated with this node type</xs:documentation>
                                                                            </xs:annotation>
                                                                          </xs:element>
                                                                          <xs:element name="LogicalDirectories" minOccurs="0">
                                                                            <xs:annotation>
                                                                              <xs:documentation>Describe the LogicalDirectories settings associated with this node type</xs:documentation>
                                                                            </xs:annotation>
                                                                            <xs:complexType>
                                                                              <xs:sequence>
                                                                                <xs:element name="LogicalDirectory" type="LogicalDirectoryType" maxOccurs="unbounded"/>
                                                                              </xs:sequence>
                                                                            </xs:complexType>
                                                                          </xs:element>
                                                                          <xs:element name="Certificates" type="CertificatesType" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the certificates associated with this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                        </xs:element>
                                                                        <xs:element name="PlacementProperties" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the properties for this NodeType that will be used as placement constraints</xs:documentation>
                                                                                </xs:annotation>
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Property" type="KeyValuePairType" minOccurs="0" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                        <xs:element name="Capacities" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>The capacities of various metrics for this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Capacity" type="KeyValuePairType" minOccurs="0" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                </xs:all>
                                                                <xs:attribute name="Name" type="xs:string" use="required">
                                                                        <xs:annotation>
                                                                                <xs:documentation>Name of the NodeType</xs:documentation>
                                                                        </xs:annotation>
                                                                </xs:attribute>
                                                        </xs:complexType>
                                                </xs:element>
                                        </xs:sequence>
                                </xs:complexType>
                        </xs:element>
                        
```


### Content element details

#### NodeType
name: NodeType
maxOccurs: unbounded

Documentation: Describe a node type.

## NodeType Element
|---|---|
|type|anonymous complexType|
|content|6 element(s), 1 attribute(s)|
|name|NodeType|
|maxOccurs|unbounded|
|documentation|Describe a node type.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeType" maxOccurs="unbounded">
                                                        <xs:annotation>
                                                                <xs:documentation>Describe a node type.</xs:documentation>
                                                        </xs:annotation>
                                                        <xs:complexType>
                                                                <xs:all>
                                                                        <xs:element name="Endpoints" type="FabricEndpointsType" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the endpoints associated with this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                        </xs:element>
                                                                          <xs:element name="KtlLoggerSettings" type="FabricKtlLoggerSettingsType" minOccurs="0">
                                                                            <xs:annotation>
                                                                              <xs:documentation>Describe the KtlLogger information associated with this node type</xs:documentation>
                                                                            </xs:annotation>
                                                                          </xs:element>
                                                                          <xs:element name="LogicalDirectories" minOccurs="0">
                                                                            <xs:annotation>
                                                                              <xs:documentation>Describe the LogicalDirectories settings associated with this node type</xs:documentation>
                                                                            </xs:annotation>
                                                                            <xs:complexType>
                                                                              <xs:sequence>
                                                                                <xs:element name="LogicalDirectory" type="LogicalDirectoryType" maxOccurs="unbounded"/>
                                                                              </xs:sequence>
                                                                            </xs:complexType>
                                                                          </xs:element>
                                                                          <xs:element name="Certificates" type="CertificatesType" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the certificates associated with this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                        </xs:element>
                                                                        <xs:element name="PlacementProperties" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the properties for this NodeType that will be used as placement constraints</xs:documentation>
                                                                                </xs:annotation>
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Property" type="KeyValuePairType" minOccurs="0" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                        <xs:element name="Capacities" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>The capacities of various metrics for this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Capacity" type="KeyValuePairType" minOccurs="0" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                </xs:all>
                                                                <xs:attribute name="Name" type="xs:string" use="required">
                                                                        <xs:annotation>
                                                                                <xs:documentation>Name of the NodeType</xs:documentation>
                                                                        </xs:annotation>
                                                                </xs:attribute>
                                                        </xs:complexType>
                                                </xs:element>
                                        
```

### Attribute details

#### Name
Documentation: Name of the NodeType
name: Name
type: xs:string
use: required

### Content element details

#### Endpoints
name: Endpoints
type: FabricEndpointsType
minOccurs: 0

Documentation: Describe the endpoints associated with this node type

#### KtlLoggerSettings
name: KtlLoggerSettings
type: FabricKtlLoggerSettingsType
minOccurs: 0

Documentation: Describe the KtlLogger information associated with this node type

#### LogicalDirectories
name: LogicalDirectories
minOccurs: 0

Documentation: Describe the LogicalDirectories settings associated with this node type

#### Certificates
name: Certificates
type: CertificatesType
minOccurs: 0

Documentation: Describe the certificates associated with this node type

#### PlacementProperties
name: PlacementProperties
minOccurs: 0

Documentation: Describe the properties for this NodeType that will be used as placement constraints

#### Capacities
name: Capacities
minOccurs: 0

Documentation: The capacities of various metrics for this node type

## Endpoints Element
|---|---|
|type|[FabricEndpointsType](#fabricendpointstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Endpoints|
|minOccurs|0|
|documentation|Describe the endpoints associated with this node type|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoints" type="FabricEndpointsType" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the endpoints associated with this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                        </xs:element>
                                                                          
```


## KtlLoggerSettings Element
|---|---|
|type|[FabricKtlLoggerSettingsType](#fabricktlloggersettingstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|KtlLoggerSettings|
|minOccurs|0|
|documentation|Describe the KtlLogger information associated with this node type|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="KtlLoggerSettings" type="FabricKtlLoggerSettingsType" minOccurs="0">
                                                                            <xs:annotation>
                                                                              <xs:documentation>Describe the KtlLogger information associated with this node type</xs:documentation>
                                                                            </xs:annotation>
                                                                          </xs:element>
                                                                          
```


## LogicalDirectories Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LogicalDirectories|
|minOccurs|0|
|documentation|Describe the LogicalDirectories settings associated with this node type|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LogicalDirectories" minOccurs="0">
                                                                            <xs:annotation>
                                                                              <xs:documentation>Describe the LogicalDirectories settings associated with this node type</xs:documentation>
                                                                            </xs:annotation>
                                                                            <xs:complexType>
                                                                              <xs:sequence>
                                                                                <xs:element name="LogicalDirectory" type="LogicalDirectoryType" maxOccurs="unbounded"/>
                                                                              </xs:sequence>
                                                                            </xs:complexType>
                                                                          </xs:element>
                                                                          
```


### Content element details

#### LogicalDirectory
name: LogicalDirectory
type: LogicalDirectoryType
maxOccurs: unbounded

Documentation: 

## LogicalDirectory Element
|---|---|
|type|[LogicalDirectoryType](#logicaldirectorytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LogicalDirectory|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LogicalDirectory" type="LogicalDirectoryType" maxOccurs="unbounded"/>
                                                                              
```


## Certificates Element
|---|---|
|type|[CertificatesType](#certificatestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Certificates|
|minOccurs|0|
|documentation|Describe the certificates associated with this node type|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Certificates" type="CertificatesType" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the certificates associated with this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                        </xs:element>
                                                                        
```


## PlacementProperties Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|PlacementProperties|
|minOccurs|0|
|documentation|Describe the properties for this NodeType that will be used as placement constraints|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PlacementProperties" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the properties for this NodeType that will be used as placement constraints</xs:documentation>
                                                                                </xs:annotation>
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Property" type="KeyValuePairType" minOccurs="0" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                        
```


### Content element details

#### Property
name: Property
type: KeyValuePairType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## Property Element
|---|---|
|type|[KeyValuePairType](#keyvaluepairtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Property|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Property" type="KeyValuePairType" minOccurs="0" maxOccurs="unbounded"/>
                                                                                        
```


## Capacities Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Capacities|
|minOccurs|0|
|documentation|The capacities of various metrics for this node type|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Capacities" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>The capacities of various metrics for this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Capacity" type="KeyValuePairType" minOccurs="0" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                
```


### Content element details

#### Capacity
name: Capacity
type: KeyValuePairType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## Capacity Element
|---|---|
|type|[KeyValuePairType](#keyvaluepairtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Capacity|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Capacity" type="KeyValuePairType" minOccurs="0" maxOccurs="unbounded"/>
                                                                                        
```


## Infrastructure Element
|---|---|
|type|anonymous complexType|
|content|6 element(s), 0 attribute(s)|
|name|Infrastructure|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Infrastructure">
                                <xs:complexType>
                                        <xs:choice>
                                                <xs:element name="WindowsServer">
                                                        <xs:complexType>
                                                                <xs:complexContent>
                                                                        <xs:extension base="WindowsInfrastructureType">
                                                                                <xs:attribute name="IsScaleMin" type="xs:boolean" default="false"/>
                                                                        </xs:extension>
                                                                </xs:complexContent>
                                                        </xs:complexType>
                                                </xs:element>
            <xs:element name="Linux">
              <xs:complexType>
                <xs:complexContent>
                  <xs:extension base="LinuxInfrastructureType">
                    <xs:attribute name="IsScaleMin" type="xs:boolean" default="false"/>
                  </xs:extension>
                </xs:complexContent>
              </xs:complexType>
            </xs:element>
                                                <xs:element name="WindowsAzure">
                                                        <xs:complexType>
                                                                <xs:sequence>
                                                                        <xs:element name="Roles">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Role" type="AzureRoleType" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                </xs:sequence>
                                                        </xs:complexType>
                                                </xs:element>
                                                <xs:element name="WindowsAzureStaticTopology">
                                                        <xs:complexType>
                                                                <xs:complexContent>
                                                                        <xs:extension base="WindowsInfrastructureType"/>
                                                                </xs:complexContent>
                                                        </xs:complexType>
                                                </xs:element>
                                                <xs:element name="Blackbird">
                                                        <xs:complexType>
                                                                <xs:sequence>
                                                                        <xs:element name="Roles">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Role" type="BlackbirdRoleType" minOccurs="1" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                </xs:sequence>
                                                        </xs:complexType>
                                                </xs:element>
                                                <xs:element name="PaaS">
                                                        <xs:complexType>
                                                                <xs:all>
                                                                        <xs:element name="Roles">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Role" type="PaaSRoleType" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                        <xs:element name="Votes">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Vote" type="PaaSVoteType" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                </xs:all>
                                                        </xs:complexType>
                                                </xs:element>
                                        </xs:choice>
                                </xs:complexType>
                        </xs:element>
                        
```


### Content element details

#### WindowsServer
name: WindowsServer

Documentation: 

#### Linux
name: Linux

Documentation: 

#### WindowsAzure
name: WindowsAzure

Documentation: 

#### WindowsAzureStaticTopology
name: WindowsAzureStaticTopology

Documentation: 

#### Blackbird
name: Blackbird

Documentation: 

#### PaaS
name: PaaS

Documentation: 

## WindowsServer Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|WindowsServer|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="WindowsServer">
                                                        <xs:complexType>
                                                                <xs:complexContent>
                                                                        <xs:extension base="WindowsInfrastructureType">
                                                                                <xs:attribute name="IsScaleMin" type="xs:boolean" default="false"/>
                                                                        </xs:extension>
                                                                </xs:complexContent>
                                                        </xs:complexType>
                                                </xs:element>
            
```


## Linux Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|Linux|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Linux">
              <xs:complexType>
                <xs:complexContent>
                  <xs:extension base="LinuxInfrastructureType">
                    <xs:attribute name="IsScaleMin" type="xs:boolean" default="false"/>
                  </xs:extension>
                </xs:complexContent>
              </xs:complexType>
            </xs:element>
                                                
```


## WindowsAzure Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|WindowsAzure|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="WindowsAzure">
                                                        <xs:complexType>
                                                                <xs:sequence>
                                                                        <xs:element name="Roles">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Role" type="AzureRoleType" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                </xs:sequence>
                                                        </xs:complexType>
                                                </xs:element>
                                                
```


### Content element details

#### Roles
name: Roles

Documentation: 

## Roles Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Roles|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Roles">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Role" type="AzureRoleType" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                
```


### Content element details

#### Role
name: Role
type: AzureRoleType
maxOccurs: unbounded

Documentation: 

## Role Element
|---|---|
|type|[AzureRoleType](#azureroletype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Role|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Role" type="AzureRoleType" maxOccurs="unbounded"/>
                                                                                        
```


## WindowsAzureStaticTopology Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|WindowsAzureStaticTopology|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="WindowsAzureStaticTopology">
                                                        <xs:complexType>
                                                                <xs:complexContent>
                                                                        <xs:extension base="WindowsInfrastructureType"/>
                                                                </xs:complexContent>
                                                        </xs:complexType>
                                                </xs:element>
                                                
```


## Blackbird Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Blackbird|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Blackbird">
                                                        <xs:complexType>
                                                                <xs:sequence>
                                                                        <xs:element name="Roles">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Role" type="BlackbirdRoleType" minOccurs="1" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                </xs:sequence>
                                                        </xs:complexType>
                                                </xs:element>
                                                
```


### Content element details

#### Roles
name: Roles

Documentation: 

## Roles Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Roles|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Roles">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Role" type="BlackbirdRoleType" minOccurs="1" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                
```


### Content element details

#### Role
name: Role
type: BlackbirdRoleType
minOccurs: 1
maxOccurs: unbounded

Documentation: 

## Role Element
|---|---|
|type|[BlackbirdRoleType](#blackbirdroletype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Role|
|minOccurs|1|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Role" type="BlackbirdRoleType" minOccurs="1" maxOccurs="unbounded"/>
                                                                                        
```


## PaaS Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|PaaS|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PaaS">
                                                        <xs:complexType>
                                                                <xs:all>
                                                                        <xs:element name="Roles">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Role" type="PaaSRoleType" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                        <xs:element name="Votes">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Vote" type="PaaSVoteType" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                </xs:all>
                                                        </xs:complexType>
                                                </xs:element>
                                        
```


### Content element details

#### Roles
name: Roles

Documentation: 

#### Votes
name: Votes

Documentation: 

## Roles Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Roles|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Roles">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Role" type="PaaSRoleType" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                        
```


### Content element details

#### Role
name: Role
type: PaaSRoleType
maxOccurs: unbounded

Documentation: 

## Role Element
|---|---|
|type|[PaaSRoleType](#paasroletype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Role|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Role" type="PaaSRoleType" maxOccurs="unbounded"/>
                                                                                        
```


## Votes Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Votes|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Votes">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Vote" type="PaaSVoteType" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                
```


### Content element details

#### Vote
name: Vote
type: PaaSVoteType
maxOccurs: unbounded

Documentation: 

## Vote Element
|---|---|
|type|[PaaSVoteType](#paasvotetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Vote|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Vote" type="PaaSVoteType" maxOccurs="unbounded"/>
                                                                                        
```


## FabricSettings Element
|---|---|
|type|[SettingsOverridesType](#settingsoverridestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|FabricSettings|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FabricSettings" type="SettingsOverridesType" minOccurs="0"/>
                        
```


## Certificates Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Certificates|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Certificates" minOccurs="0">
                                <xs:complexType>
                                        <xs:sequence>
                                                <xs:element name="SecretsCertificate" type="FabricCertificateType" minOccurs="0"/>
                                        </xs:sequence>
                                </xs:complexType>
                        </xs:element>
                
```


### Content element details

#### SecretsCertificate
name: SecretsCertificate
type: FabricCertificateType
minOccurs: 0

Documentation: 

## SecretsCertificate Element
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecretsCertificate|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecretsCertificate" type="FabricCertificateType" minOccurs="0"/>
                                        
```


## NodeList Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|NodeList|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeList">
                                <xs:complexType>
                                        <xs:sequence>
                                                <xs:element name="Node" type="FabricNodeType" maxOccurs="unbounded"/>
                                        </xs:sequence>
                                </xs:complexType>
                        </xs:element>
                
```


### Content element details

#### Node
name: Node
type: FabricNodeType
maxOccurs: unbounded

Documentation: 

## Node Element
|---|---|
|type|[FabricNodeType](#fabricnodetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Node|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Node" type="FabricNodeType" maxOccurs="unbounded"/>
                                        
```


## NodeList Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|NodeList|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeList">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Node" type="FabricNodeType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    
```


### Content element details

#### Node
name: Node
type: FabricNodeType
maxOccurs: unbounded

Documentation: 

## Node Element
|---|---|
|type|[FabricNodeType](#fabricnodetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Node|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Node" type="FabricNodeType" maxOccurs="unbounded"/>
          
```


## ClientConnectionEndpoint Element
|---|---|
|type|[InputEndpointType](#inputendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ClientConnectionEndpoint|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClientConnectionEndpoint" type="InputEndpointType"/>
      
```


## LeaseDriverEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LeaseDriverEndpoint|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LeaseDriverEndpoint" type="InternalEndpointType"/>
      
```


## ClusterConnectionEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ClusterConnectionEndpoint|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterConnectionEndpoint" type="InternalEndpointType"/>
      
```


## HttpGatewayEndpoint Element
|---|---|
|type|[InputEndpointType](#inputendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|HttpGatewayEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="HttpGatewayEndpoint" type="InputEndpointType" minOccurs="0"/>
      
```


## HttpApplicationGatewayEndpoint Element
|---|---|
|type|[InputEndpointType](#inputendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|HttpApplicationGatewayEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="HttpApplicationGatewayEndpoint" type="InputEndpointType" minOccurs="0"/>
      
```


## ServiceConnectionEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceConnectionEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceConnectionEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```


## ClusterManagerReplicatorEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ClusterManagerReplicatorEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterManagerReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```


## RepairManagerReplicatorEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|RepairManagerReplicatorEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RepairManagerReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```


## NamingReplicatorEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|NamingReplicatorEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NamingReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```


## FailoverManagerReplicatorEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|FailoverManagerReplicatorEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FailoverManagerReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```


## ImageStoreServiceReplicatorEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ImageStoreServiceReplicatorEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ImageStoreServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```


## UpgradeServiceReplicatorEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|UpgradeServiceReplicatorEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UpgradeServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```


## FaultAnalysisServiceReplicatorEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|FaultAnalysisServiceReplicatorEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FaultAnalysisServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```


## BackupRestoreServiceReplicatorEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|BackupRestoreServiceReplicatorEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="BackupRestoreServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```


## UpgradeOrchestrationServiceReplicatorEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|UpgradeOrchestrationServiceReplicatorEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UpgradeOrchestrationServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```


## DefaultReplicatorEndpoint Element
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DefaultReplicatorEndpoint|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```


## ApplicationEndpoints Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|ApplicationEndpoints|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationEndpoints" minOccurs="0">
        <xs:complexType>
          <xs:attribute name="StartPort" type="xs:int" use="required"/>
          <xs:attribute name="EndPort" type="xs:int" use="required"/>
        </xs:complexType>
      </xs:element>
      
```

### Attribute details

#### StartPort
Documentation: 
name: StartPort
type: xs:int
use: required

#### EndPort
Documentation: 
name: EndPort
type: xs:int
use: required

## EphemeralEndpoints Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|EphemeralEndpoints|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EphemeralEndpoints" minOccurs="0">
        <xs:complexType>
          <xs:attribute name="StartPort" type="xs:int" use="required"/>
          <xs:attribute name="EndPort" type="xs:int" use="required"/>
        </xs:complexType>
      </xs:element>
    
```

### Attribute details

#### StartPort
Documentation: 
name: StartPort
type: xs:int
use: required

#### EndPort
Documentation: 
name: EndPort
type: xs:int
use: required

## SharedLogFilePath Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|SharedLogFilePath|
|minOccurs|0|
|documentation|Defines path to shared log.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SharedLogFilePath" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Defines path to shared log.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:attribute name="Value" type="xs:string" use="required"/>
        </xs:complexType>
      </xs:element>

      
```

### Attribute details

#### Value
Documentation: 
name: Value
type: xs:string
use: required

## SharedLogFileId Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|SharedLogFileId|
|minOccurs|0|
|documentation|Specific GUID to use as the shared log id.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SharedLogFileId" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specific GUID to use as the shared log id.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:attribute name="Value" use="required">
            <xs:simpleType>
              <xs:restriction base="xs:string">
                <xs:pattern value="[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}"/>
              </xs:restriction>
            </xs:simpleType>
          </xs:attribute>
         </xs:complexType>
      </xs:element>

      
```

### Attribute details

#### Value
Documentation: 
name: Value
use: required

## SharedLogFileSizeInMB Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|SharedLogFileSizeInMB|
|minOccurs|0|
|documentation|Defines how large is the shared log.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SharedLogFileSizeInMB" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Defines how large is the shared log.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:attribute name="Value" use="required">
            <xs:simpleType>
              <xs:restriction base="xs:int">
                <xs:minInclusive value="512"/>
              </xs:restriction>
            </xs:simpleType>
          </xs:attribute>
        </xs:complexType>
      </xs:element>

    
```

### Attribute details

#### Value
Documentation: 
name: Value
use: required

## Description Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|Description|
|minOccurs|0|
|documentation|Text describing this application.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Description" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Text describing this application.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## Parameters Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Parameters|
|minOccurs|0|
|documentation|Declares the parameters that are used in this application manifest. The value of these parameters can be supplied when the application is instantiated and can be used to override application or service configuration settings.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameters" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Declares the parameters that are used in this application manifest. The value of these parameters can be supplied when the application is instantiated and can be used to override application or service configuration settings.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Parameter" block="" minOccurs="0" maxOccurs="unbounded">
              <xs:annotation>
                <xs:documentation>An application parameter to be used in this manifest. The parameter value can be changed during application instantiation, or, if no value is supplied the default value is used.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:attribute name="Name" use="required">
                  <xs:annotation>
                    <xs:documentation>The name of the parameter to be used in the manifest as "[Name]".</xs:documentation>
                  </xs:annotation>
                  <xs:simpleType>
                    <xs:restriction base="xs:string">
                      <xs:minLength value="1"/>
                    </xs:restriction>
                  </xs:simpleType>
                </xs:attribute>
                <xs:attribute name="DefaultValue" type="xs:string" use="required">
                  <xs:annotation>
                    <xs:documentation>Default value for the parameter, used if the parameter value is not provided during application instantiation.</xs:documentation>
                  </xs:annotation>
                </xs:attribute>
              </xs:complexType>
            </xs:element>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      
```


### Content element details

#### Parameter
name: Parameter
block: 
minOccurs: 0
maxOccurs: unbounded

Documentation: An application parameter to be used in this manifest. The parameter value can be changed during application instantiation, or, if no value is supplied the default value is used.

## Parameter Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|Parameter|
|block||
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|An application parameter to be used in this manifest. The parameter value can be changed during application instantiation, or, if no value is supplied the default value is used.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameter" block="" minOccurs="0" maxOccurs="unbounded">
              <xs:annotation>
                <xs:documentation>An application parameter to be used in this manifest. The parameter value can be changed during application instantiation, or, if no value is supplied the default value is used.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:attribute name="Name" use="required">
                  <xs:annotation>
                    <xs:documentation>The name of the parameter to be used in the manifest as "[Name]".</xs:documentation>
                  </xs:annotation>
                  <xs:simpleType>
                    <xs:restriction base="xs:string">
                      <xs:minLength value="1"/>
                    </xs:restriction>
                  </xs:simpleType>
                </xs:attribute>
                <xs:attribute name="DefaultValue" type="xs:string" use="required">
                  <xs:annotation>
                    <xs:documentation>Default value for the parameter, used if the parameter value is not provided during application instantiation.</xs:documentation>
                  </xs:annotation>
                </xs:attribute>
              </xs:complexType>
            </xs:element>
          
```

### Attribute details

#### Name
Documentation: The name of the parameter to be used in the manifest as "[Name]".
name: Name
use: required

#### DefaultValue
Documentation: Default value for the parameter, used if the parameter value is not provided during application instantiation.
name: DefaultValue
type: xs:string
use: required

## ServiceManifestImport Element
|---|---|
|type|anonymous complexType|
|content|5 element(s), 0 attribute(s)|
|name|ServiceManifestImport|
|maxOccurs|unbounded|
|documentation|Imports a service manifest created by the service developer. A service manifest must be imported for each constituent service in the application. Configuration overrides and policies can be declared for the service manifest.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceManifestImport" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Imports a service manifest created by the service developer. A service manifest must be imported for each constituent service in the application. Configuration overrides and policies can be declared for the service manifest.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="ServiceManifestRef" type="ServiceManifestRefType"/>
            <xs:element name="ConfigOverrides" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Describes configuration overrides for the imported service manifest. Configuration overrides allow the flexibility of re-using the same service manifests across multiple application types by overriding the service manifest's configuration only when used with a particular application type. Configuration overrides can change any default configuration in a service manifest as long as default configuration is defined using the Settings.xml in the ConfigPackage folder. </xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="ConfigOverride" type="ConfigOverrideType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            <xs:element name="ResourceOverrides" type="ResourceOverridesType" minOccurs="0"/>
            <xs:element name="EnvironmentOverrides" type="EnvironmentOverridesType" minOccurs="0" maxOccurs="unbounded"/>
            <xs:element name="Policies" type="ServiceManifestImportPoliciesType" minOccurs="0"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      
```


### Content element details

#### ServiceManifestRef
name: ServiceManifestRef
type: ServiceManifestRefType

Documentation: 

#### ConfigOverrides
name: ConfigOverrides
minOccurs: 0

Documentation: Describes configuration overrides for the imported service manifest. Configuration overrides allow the flexibility of re-using the same service manifests across multiple application types by overriding the service manifest's configuration only when used with a particular application type. Configuration overrides can change any default configuration in a service manifest as long as default configuration is defined using the Settings.xml in the ConfigPackage folder. 

#### ResourceOverrides
name: ResourceOverrides
type: ResourceOverridesType
minOccurs: 0

Documentation: 

#### EnvironmentOverrides
name: EnvironmentOverrides
type: EnvironmentOverridesType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

#### Policies
name: Policies
type: ServiceManifestImportPoliciesType
minOccurs: 0

Documentation: 

## ServiceManifestRef Element
|---|---|
|type|[ServiceManifestRefType](#servicemanifestreftype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceManifestRef|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceManifestRef" type="ServiceManifestRefType"/>
            
```


## ConfigOverrides Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ConfigOverrides|
|minOccurs|0|
|documentation|Describes configuration overrides for the imported service manifest. Configuration overrides allow the flexibility of re-using the same service manifests across multiple application types by overriding the service manifest's configuration only when used with a particular application type. Configuration overrides can change any default configuration in a service manifest as long as default configuration is defined using the Settings.xml in the ConfigPackage folder. |

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigOverrides" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Describes configuration overrides for the imported service manifest. Configuration overrides allow the flexibility of re-using the same service manifests across multiple application types by overriding the service manifest's configuration only when used with a particular application type. Configuration overrides can change any default configuration in a service manifest as long as default configuration is defined using the Settings.xml in the ConfigPackage folder. </xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="ConfigOverride" type="ConfigOverrideType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            
```


### Content element details

#### ConfigOverride
name: ConfigOverride
type: ConfigOverrideType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## ConfigOverride Element
|---|---|
|type|[ConfigOverrideType](#configoverridetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ConfigOverride|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigOverride" type="ConfigOverrideType" minOccurs="0" maxOccurs="unbounded"/>
                
```


## ResourceOverrides Element
|---|---|
|type|[ResourceOverridesType](#resourceoverridestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ResourceOverrides|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceOverrides" type="ResourceOverridesType" minOccurs="0"/>
            
```


## EnvironmentOverrides Element
|---|---|
|type|[EnvironmentOverridesType](#environmentoverridestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EnvironmentOverrides|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentOverrides" type="EnvironmentOverridesType" minOccurs="0" maxOccurs="unbounded"/>
            
```


## Policies Element
|---|---|
|type|[ServiceManifestImportPoliciesType](#servicemanifestimportpoliciestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Policies|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Policies" type="ServiceManifestImportPoliciesType" minOccurs="0"/>
          
```


## ServiceTemplates Element
|---|---|
|type|[ServiceTemplatesType](#servicetemplatestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceTemplates|
|minOccurs|0|
|documentation|Declares the set of permitted service types that can be created dynamically inside the application instance. Default configuration values, such as replication factor, are specified and used as a template for creating service instances.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTemplates" type="ServiceTemplatesType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Declares the set of permitted service types that can be created dynamically inside the application instance. Default configuration values, such as replication factor, are specified and used as a template for creating service instances.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## DefaultServices Element
|---|---|
|type|[DefaultServicesType](#defaultservicestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DefaultServices|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultServices" type="DefaultServicesType" minOccurs="0">

      </xs:element>
      
```


## Principals Element
|---|---|
|type|[SecurityPrincipalsType](#securityprincipalstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Principals|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Principals" type="SecurityPrincipalsType" minOccurs="0"/>
      
```


## Policies Element
|---|---|
|type|[ApplicationPoliciesType](#applicationpoliciestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Policies|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Policies" type="ApplicationPoliciesType" minOccurs="0"/>
      
```


## Diagnostics Element
|---|---|
|type|[DiagnosticsType](#diagnosticstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Diagnostics|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Diagnostics" type="DiagnosticsType" minOccurs="0"/>
      
```


## Certificates Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|Certificates|
|minOccurs|0|
|documentation|Declares certificates used to secure endpoints or encrypt secrets within the application manifest or a cluster manifest.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Certificates" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Declares certificates used to secure endpoints or encrypt secrets within the application manifest or a cluster manifest.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence maxOccurs="unbounded">
            <xs:element name="SecretsCertificate" type="FabricCertificateType" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Declares a certificate used to encrypt sensitive information within the application manifest. The application author uses the Invoke-ServiceFabricEncryptSecret cmdlet to encrypt the sensitive information, which is copied to a Parameter in the ConfigOverrides section.</xs:documentation>
              </xs:annotation>
            </xs:element>
            <xs:element name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    
```


### Content element details

#### SecretsCertificate
name: SecretsCertificate
type: FabricCertificateType
minOccurs: 0

Documentation: Declares a certificate used to encrypt sensitive information within the application manifest. The application author uses the Invoke-ServiceFabricEncryptSecret cmdlet to encrypt the sensitive information, which is copied to a Parameter in the ConfigOverrides section.

#### EndpointCertificate
name: EndpointCertificate
type: EndpointCertificateType
minOccurs: 0

Documentation: 

## SecretsCertificate Element
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecretsCertificate|
|minOccurs|0|
|documentation|Declares a certificate used to encrypt sensitive information within the application manifest. The application author uses the Invoke-ServiceFabricEncryptSecret cmdlet to encrypt the sensitive information, which is copied to a Parameter in the ConfigOverrides section.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecretsCertificate" type="FabricCertificateType" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Declares a certificate used to encrypt sensitive information within the application manifest. The application author uses the Invoke-ServiceFabricEncryptSecret cmdlet to encrypt the sensitive information, which is copied to a Parameter in the ConfigOverrides section.</xs:documentation>
              </xs:annotation>
            </xs:element>
            
```


## EndpointCertificate Element
|---|---|
|type|[EndpointCertificateType](#endpointcertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EndpointCertificate|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0"/>
          
```


## RunAsPolicy Element
|---|---|
|type|[RunAsPolicyType](#runaspolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|RunAsPolicy|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RunAsPolicy" type="RunAsPolicyType" minOccurs="0"/>
      
```


## SecurityAccessPolicy Element
|---|---|
|type|[SecurityAccessPolicyType](#securityaccesspolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecurityAccessPolicy|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityAccessPolicy" type="SecurityAccessPolicyType" minOccurs="0"/>
      
```


## PackageSharingPolicy Element
|---|---|
|type|[PackageSharingPolicyType](#packagesharingpolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|PackageSharingPolicy|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PackageSharingPolicy" type="PackageSharingPolicyType" minOccurs="0"/>
      
```


## EndpointBindingPolicy Element
|---|---|
|type|[EndpointBindingPolicyType](#endpointbindingpolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EndpointBindingPolicy|
|minOccurs|0|
|documentation|Specifies a certificate that should be returned to a client for an HTTPS endpoint.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointBindingPolicy" type="EndpointBindingPolicyType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies a certificate that should be returned to a client for an HTTPS endpoint.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## ServicePackageResourceGovernancePolicy Element
|---|---|
|type|[ServicePackageResourceGovernancePolicyType](#servicepackageresourcegovernancepolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServicePackageResourceGovernancePolicy|
|minOccurs|0|
|maxOccurs|1|
|documentation|Defines the resource governance policy that is applied at the level of the entire service package.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageResourceGovernancePolicy" type="ServicePackageResourceGovernancePolicyType" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Defines the resource governance policy that is applied at the level of the entire service package.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## ResourceGovernancePolicy Element
|---|---|
|type|[ResourceGovernancePolicyType](#resourcegovernancepolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ResourceGovernancePolicy|
|minOccurs|0|
|documentation|Specifies resource limits for codepackage.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies resource limits for codepackage.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## ContainerHostPolicies Element
|---|---|
|type|[ContainerHostPoliciesType](#containerhostpoliciestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ContainerHostPolicies|
|minOccurs|0|
|documentation|Specifies policies for activating container hosts.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerHostPolicies" type="ContainerHostPoliciesType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies policies for activating container hosts.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```


## RepositoryCredentials Element
|---|---|
|type|[RepositoryCredentialsType](#repositorycredentialstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|RepositoryCredentials|
|minOccurs|0|
|maxOccurs|1|
|documentation|Credentials for container image repository to pull images from.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RepositoryCredentials" type="RepositoryCredentialsType" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Credentials for container image repository to pull images from.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## PortBinding Element
|---|---|
|type|[PortBindingType](#portbindingtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|PortBinding|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|Specifies which endpoint resource to bind container exposed port.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PortBinding" type="PortBindingType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies which endpoint resource to bind container exposed port.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## CertificateRef Element
|---|---|
|type|[ContainerCertificateType](#containercertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|CertificateRef|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|Specifies information for a certificate which will be exposed to the container.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CertificateRef" type="ContainerCertificateType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies information for a certificate which will be exposed to the container.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## LogConfig Element
|---|---|
|type|[ContainerLoggingDriverType](#containerloggingdrivertype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LogConfig|
|minOccurs|0|
|maxOccurs|1|
|documentation|Specifies the logging driver for a container.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LogConfig" type="ContainerLoggingDriverType" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Specifies the logging driver for a container.</xs:documentation>
        </xs:annotation>
      </xs:element>
        
```


## NetworkConfig Element
|---|---|
|type|[ContainerNetworkConfigType](#containernetworkconfigtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|NetworkConfig|
|minOccurs|0|
|maxOccurs|1|
|documentation|Specifies the network configuration for a container.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NetworkConfig" type="ContainerNetworkConfigType" minOccurs="0" maxOccurs="1">
            <xs:annotation>
                <xs:documentation>Specifies the network configuration for a container.</xs:documentation>
            </xs:annotation>
        </xs:element>
        
```


## Volume Element
|---|---|
|type|[ContainerVolumeType](#containervolumetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Volume|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|Specifies the volume to be bound to container.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Volume" type="ContainerVolumeType" minOccurs="0" maxOccurs="unbounded">
            <xs:annotation>
                <xs:documentation>Specifies the volume to be bound to container.</xs:documentation>
            </xs:annotation>
        </xs:element>
      
```


## SecurityOption Element
|---|---|
|type|[SecurityOptionsType](#securityoptionstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecurityOption|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|Specifies securityoptions for the container.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityOption" type="SecurityOptionsType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies securityoptions for the container.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```


## DriverOption Element
|---|---|
|type|[DriverOptionType](#driveroptiontype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DriverOption|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|Driver options to be passed to driver.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DriverOption" type="DriverOptionType" minOccurs="0" maxOccurs="unbounded">
              <xs:annotation>
                  <xs:documentation>Driver options to be passed to driver.</xs:documentation>
              </xs:annotation>
          </xs:element>
      
```


## DriverOption Element
|---|---|
|type|[DriverOptionType](#driveroptiontype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DriverOption|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|Driver options to be passed to driver.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DriverOption" type="DriverOptionType" minOccurs="0" maxOccurs="unbounded">
                <xs:annotation>
                    <xs:documentation>Driver options to be passed to driver.</xs:documentation>
                </xs:annotation>
            </xs:element>
        
```


## EnvironmentVariable Element
|---|---|
|type|[EnvironmentVariableType](#environmentvariabletype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EnvironmentVariable|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|Environment variable.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentVariable" type="EnvironmentVariableType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Environment variable.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```


## EnvironmentVariable Element
|---|---|
|type|[EnvironmentVariableType](#environmentvariabletype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EnvironmentVariable|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|Environment variable.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentVariable" type="EnvironmentVariableType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Environment variable.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```


## Settings Element
|---|---|
|type|[SettingsOverridesType](#settingsoverridestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Settings|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Settings" type="SettingsOverridesType" minOccurs="0"/>
    
```


## Section Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 1 attribute(s)|
|name|Section|
|maxOccurs|unbounded|
|documentation|A section in the Settings.xml file to override.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Section" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>A section in the Settings.xml file to override.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Parameter" minOccurs="0" maxOccurs="unbounded">
              <xs:annotation>
                <xs:documentation>The setting to override.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:attributeGroup ref="NameValuePair"/>
                <xs:attribute name="IsEncrypted" type="xs:boolean" default="false">
                  <xs:annotation>
                    <xs:documentation>
                      If true, the value of this parameter is encrypted. The application developer is responsible for creating a certificate and using the Invoke-ServiceFabricEncryptSecret cmdlet to encrypt sensitive information. The certificate information that will be used to encrypt the value is specified in the Certificates section.
                    </xs:documentation>
                                    </xs:annotation>
                                </xs:attribute>
                            </xs:complexType>
                        </xs:element>
                    </xs:sequence>
                    <xs:attribute name="Name" use="required">
                        <xs:annotation>
                            <xs:documentation>The name of the section in the Settings.xml file to override.</xs:documentation>
                        </xs:annotation>
                        <xs:simpleType>
                            <xs:restriction base="xs:string">
                                <xs:minLength value="1"/>
                            </xs:restriction>
                        </xs:simpleType>
                    </xs:attribute>
                </xs:complexType>
            </xs:element>
        
```

### Attribute details

#### Name
Documentation: The name of the section in the Settings.xml file to override.
name: Name
use: required

### Content element details

#### Parameter
name: Parameter
minOccurs: 0
maxOccurs: unbounded

Documentation: The setting to override.

## Parameter Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|Parameter|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|The setting to override.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameter" minOccurs="0" maxOccurs="unbounded">
              <xs:annotation>
                <xs:documentation>The setting to override.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:attributeGroup ref="NameValuePair"/>
                <xs:attribute name="IsEncrypted" type="xs:boolean" default="false">
                  <xs:annotation>
                    <xs:documentation>
                      If true, the value of this parameter is encrypted. The application developer is responsible for creating a certificate and using the Invoke-ServiceFabricEncryptSecret cmdlet to encrypt sensitive information. The certificate information that will be used to encrypt the value is specified in the Certificates section.
                    </xs:documentation>
                                    </xs:annotation>
                                </xs:attribute>
                            </xs:complexType>
                        </xs:element>
                    
```

### Attribute details

#### IsEncrypted
Documentation: 
                      If true, the value of this parameter is encrypted. The application developer is responsible for creating a certificate and using the Invoke-ServiceFabricEncryptSecret cmdlet to encrypt sensitive information. The certificate information that will be used to encrypt the value is specified in the Certificates section.
                    
name: IsEncrypted
type: xs:boolean
default: false

## StatelessService Element
|---|---|
|type|[StatelessServiceType](#statelessservicetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessService|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessService" type="StatelessServiceType"/>
            
```


## StatefulService Element
|---|---|
|type|[StatefulServiceType](#statefulservicetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulService|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulService" type="StatefulServiceType"/>
            
```


## StatelessServiceGroup Element
|---|---|
|type|[StatelessServiceGroupType](#statelessservicegrouptype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceGroup|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceGroup" type="StatelessServiceGroupType"/>
            
```


## StatefulServiceGroup Element
|---|---|
|type|[StatefulServiceGroupType](#statefulservicegrouptype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceGroup|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceGroup" type="StatefulServiceGroupType"/>
        
```


## Service Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 4 attribute(s)|
|name|Service|
|documentation|Declares a service to be created automatically when the application is instantiated.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Service">
                    <xs:annotation>
                        <xs:documentation>Declares a service to be created automatically when the application is instantiated.</xs:documentation>
                    </xs:annotation>
                    <xs:complexType>
                        <xs:choice minOccurs="0">
                            <xs:element name="StatelessService" type="StatelessServiceType"/>
                            <xs:element name="StatefulService" type="StatefulServiceType"/>
                        </xs:choice>
                        <xs:attribute name="Name" type="xs:string" use="required">
                            <xs:annotation>
                                <xs:documentation>The service name, used to form the fully qualified application name URI. The fully qualified name URI of the service would be: fabric:/ApplicationName/ServiceName.</xs:documentation>
                            </xs:annotation>
                        </xs:attribute>
                        <xs:attribute name="GeneratedIdRef" type="xs:string" use="optional">
                            <xs:annotation>
                                <xs:documentation>Reference to the auto generated id used by Visual Studio tooling.</xs:documentation>
                            </xs:annotation>
                        </xs:attribute>
                        <xs:attribute name="ServiceDnsName" type="xs:string" use="optional">
                          <xs:annotation>
                            <xs:documentation>The DNS name of the service.</xs:documentation>
                          </xs:annotation>
                        </xs:attribute>
                        <xs:attribute name="ServicePackageActivationMode" use="optional" default="SharedProcess">
                          <xs:annotation>
                            <xs:documentation>ServicePackageActivationMode to be used when creating the service. With SharedProcess mode, replica(s) or instance(s) from different partition(s) of service will share same same activation of service package on a node. With ExclusiveProcess mode, each replica or instance of service will have its own dedicated activation of service package.</xs:documentation>
                          </xs:annotation>
                          <xs:simpleType>
                            <xs:restriction base="xs:string">
                              <xs:enumeration value="SharedProcess"/>
                              <xs:enumeration value="ExclusiveProcess"/>
                            </xs:restriction>
                          </xs:simpleType>
                        </xs:attribute>
                    </xs:complexType>
                </xs:element>
                
```

### Attribute details

#### Name
Documentation: The service name, used to form the fully qualified application name URI. The fully qualified name URI of the service would be: fabric:/ApplicationName/ServiceName.
name: Name
type: xs:string
use: required

#### GeneratedIdRef
Documentation: Reference to the auto generated id used by Visual Studio tooling.
name: GeneratedIdRef
type: xs:string
use: optional

#### ServiceDnsName
Documentation: The DNS name of the service.
name: ServiceDnsName
type: xs:string
use: optional

#### ServicePackageActivationMode
Documentation: ServicePackageActivationMode to be used when creating the service. With SharedProcess mode, replica(s) or instance(s) from different partition(s) of service will share same same activation of service package on a node. With ExclusiveProcess mode, each replica or instance of service will have its own dedicated activation of service package.
name: ServicePackageActivationMode
use: optional
default: SharedProcess

### Content element details

#### StatelessService
name: StatelessService
type: StatelessServiceType

Documentation: 

#### StatefulService
name: StatefulService
type: StatefulServiceType

Documentation: 

## StatelessService Element
|---|---|
|type|[StatelessServiceType](#statelessservicetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessService|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessService" type="StatelessServiceType"/>
                            
```


## StatefulService Element
|---|---|
|type|[StatefulServiceType](#statefulservicetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulService|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulService" type="StatefulServiceType"/>
                        
```


## ServiceGroup Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 2 attribute(s)|
|name|ServiceGroup|
|documentation|A collection of services that are automatically located together, so they are also moved together during fail-over or resource management.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceGroup">
                    <xs:annotation>
                        <xs:documentation>A collection of services that are automatically located together, so they are also moved together during fail-over or resource management.</xs:documentation>
                    </xs:annotation>
                    <xs:complexType>
                        <xs:choice minOccurs="0">
                            <xs:element name="StatelessServiceGroup" type="StatelessServiceGroupType"/>
                            <xs:element name="StatefulServiceGroup" type="StatefulServiceGroupType"/>
                        </xs:choice>
                        <xs:attribute name="Name" type="xs:string" use="required">
                            <xs:annotation>
                                <xs:documentation>Name of this service relative to this application Name URI. Fully qualified Name of the service is a combination of Name Uri of the Application and this Name.</xs:documentation>
                            </xs:annotation>
                        </xs:attribute>
                        <xs:attribute name="ServicePackageActivationMode" use="optional" default="SharedProcess">
                          <xs:annotation>
                            <xs:documentation>ServicePackageActivationMode to be used when creating the service. With SharedProcess mode, replica(s) or instance(s) from different partition(s) of service will share same same activation of service package on a node. With ExclusiveProcess mode, each replica or instance of service will have its own dedicated activation of service package.</xs:documentation>
                          </xs:annotation>
                          <xs:simpleType>
                            <xs:restriction base="xs:string">
                              <xs:enumeration value="SharedProcess"/>
                              <xs:enumeration value="ExclusiveProcess"/>
                            </xs:restriction>
                          </xs:simpleType>
                        </xs:attribute>
                    </xs:complexType>
                </xs:element>
            
```

### Attribute details

#### Name
Documentation: Name of this service relative to this application Name URI. Fully qualified Name of the service is a combination of Name Uri of the Application and this Name.
name: Name
type: xs:string
use: required

#### ServicePackageActivationMode
Documentation: ServicePackageActivationMode to be used when creating the service. With SharedProcess mode, replica(s) or instance(s) from different partition(s) of service will share same same activation of service package on a node. With ExclusiveProcess mode, each replica or instance of service will have its own dedicated activation of service package.
name: ServicePackageActivationMode
use: optional
default: SharedProcess

### Content element details

#### StatelessServiceGroup
name: StatelessServiceGroup
type: StatelessServiceGroupType

Documentation: 

#### StatefulServiceGroup
name: StatefulServiceGroup
type: StatefulServiceGroupType

Documentation: 

## StatelessServiceGroup Element
|---|---|
|type|[StatelessServiceGroupType](#statelessservicegrouptype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceGroup|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceGroup" type="StatelessServiceGroupType"/>
                            
```


## StatefulServiceGroup Element
|---|---|
|type|[StatefulServiceGroupType](#statefulservicegrouptype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceGroup|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceGroup" type="StatefulServiceGroupType"/>
                        
```


## LoadMetrics Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LoadMetrics|
|minOccurs|0|
|documentation|Load metrics reported by this service, used for resource balancing services.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetrics" minOccurs="0">
                <xs:annotation>
                    <xs:documentation>Load metrics reported by this service, used for resource balancing services.</xs:documentation>
                </xs:annotation>
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            
```


### Content element details

#### LoadMetric
name: LoadMetric
type: LoadMetricType
maxOccurs: unbounded

Documentation: 

## LoadMetric Element
|---|---|
|type|[LoadMetricType](#loadmetrictype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LoadMetric|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
                    
```


## PlacementConstraints Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|PlacementConstraints|
|minOccurs|0|
|documentation|Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service’s requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion>12  && InDMZ == True)".|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PlacementConstraints" type="xs:string" minOccurs="0">
                <xs:annotation>
                    <xs:documentation>Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service’s requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion&gt;12  &amp;&amp; InDMZ == True)".</xs:documentation>
                </xs:annotation>
            </xs:element>
            
```


## ServiceCorrelations Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ServiceCorrelations|
|minOccurs|0|
|documentation|Defines affinity relationships between services.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceCorrelations" minOccurs="0">
                <xs:annotation>
                    <xs:documentation>Defines affinity relationships between services.</xs:documentation>
                </xs:annotation>
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="ServiceCorrelation" maxOccurs="unbounded">
                            <xs:annotation>
                                <xs:documentation>Defines an affinity relationship with another service. Useful when splitting a previously-monolithic application into microservices.  One service has a local dependency on another service and both services need to run on the same node in order to work.</xs:documentation>
                            </xs:annotation>
                            <xs:complexType>
                                <xs:attribute name="ServiceName" use="required">
                                    <xs:annotation>
                                        <xs:documentation>The name of the other service as a URI. Example, "fabric:/otherApplication/parentService".</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:minLength value="1"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                                <xs:attribute name="Scheme" use="required">
                                    <xs:annotation>
                                        <xs:documentation>In NonAlignedAffinity the replicas or instances of the different services are placed on the same nodes. AlignedAffinity is used with stateful services. Configuring one stateful service as having aligned affinity with another stateful service ensures that the primaries of those services are placed on the same nodes as each other, and that each pair of secondaries are also placed on the same nodes.</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:enumeration value="Affinity"/>
                                            <xs:enumeration value="AlignedAffinity"/>
                                            <xs:enumeration value="NonAlignedAffinity"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                            </xs:complexType>
                        </xs:element>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            
```


### Content element details

#### ServiceCorrelation
name: ServiceCorrelation
maxOccurs: unbounded

Documentation: Defines an affinity relationship with another service. Useful when splitting a previously-monolithic application into microservices.  One service has a local dependency on another service and both services need to run on the same node in order to work.

## ServiceCorrelation Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|ServiceCorrelation|
|maxOccurs|unbounded|
|documentation|Defines an affinity relationship with another service. Useful when splitting a previously-monolithic application into microservices.  One service has a local dependency on another service and both services need to run on the same node in order to work.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceCorrelation" maxOccurs="unbounded">
                            <xs:annotation>
                                <xs:documentation>Defines an affinity relationship with another service. Useful when splitting a previously-monolithic application into microservices.  One service has a local dependency on another service and both services need to run on the same node in order to work.</xs:documentation>
                            </xs:annotation>
                            <xs:complexType>
                                <xs:attribute name="ServiceName" use="required">
                                    <xs:annotation>
                                        <xs:documentation>The name of the other service as a URI. Example, "fabric:/otherApplication/parentService".</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:minLength value="1"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                                <xs:attribute name="Scheme" use="required">
                                    <xs:annotation>
                                        <xs:documentation>In NonAlignedAffinity the replicas or instances of the different services are placed on the same nodes. AlignedAffinity is used with stateful services. Configuring one stateful service as having aligned affinity with another stateful service ensures that the primaries of those services are placed on the same nodes as each other, and that each pair of secondaries are also placed on the same nodes.</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:enumeration value="Affinity"/>
                                            <xs:enumeration value="AlignedAffinity"/>
                                            <xs:enumeration value="NonAlignedAffinity"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                            </xs:complexType>
                        </xs:element>
                    
```

### Attribute details

#### ServiceName
Documentation: The name of the other service as a URI. Example, "fabric:/otherApplication/parentService".
name: ServiceName
use: required

#### Scheme
Documentation: In NonAlignedAffinity the replicas or instances of the different services are placed on the same nodes. AlignedAffinity is used with stateful services. Configuring one stateful service as having aligned affinity with another stateful service ensures that the primaries of those services are placed on the same nodes as each other, and that each pair of secondaries are also placed on the same nodes.
name: Scheme
use: required

## ServicePlacementPolicies Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ServicePlacementPolicies|
|minOccurs|0|
|documentation|Declares placement policies for a service.  Useful when the cluster spans geographic distances or and/or geopolitical regions.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePlacementPolicies" minOccurs="0">
                <xs:annotation>
                    <xs:documentation>Declares placement policies for a service.  Useful when the cluster spans geographic distances or and/or geopolitical regions.</xs:documentation>
                </xs:annotation>
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="ServicePlacementPolicy" maxOccurs="unbounded">
                            <xs:annotation>
                                <xs:documentation>Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.</xs:documentation>
                            </xs:annotation>
                            <xs:complexType>
                                <xs:attribute name="DomainName">
                                    <xs:annotation>
                                        <xs:documentation>The fault domain where the service should or should not be placed, depending on the Type value.</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:minLength value="1"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                                <xs:attribute name="Type" use="required">
                                    <xs:annotation>
                                        <xs:documentation>InvalidDomain allows you to specify that a particular Fault Domain is invalid for this workload. RequiredDomain requires that all of the replicas be present in the specified domain. Multiple required domains can be specified. PreferredPrimaryDomain specifies the preferred Fault Domain for primary replicas. Useful in geographically spanned clusters where you are using other locations for redundancy, but would prefer that the primary replicas be placed in a certain location in order to provider lower latency for operations which go to the primary. RequiredDomainDistribution specifies that replicas are required to be distributed among the available fault domains. NonPartiallyPlace controls if the service replicas will be partially place if not all of them can be placed.</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:enumeration value="InvalidDomain"/>
                                            <xs:enumeration value="RequiredDomain"/>
                                            <xs:enumeration value="PreferredPrimaryDomain"/>
                                            <xs:enumeration value="RequiredDomainDistribution"/>
                                            <xs:enumeration value="NonPartiallyPlace"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                            </xs:complexType>
                        </xs:element>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        
```


### Content element details

#### ServicePlacementPolicy
name: ServicePlacementPolicy
maxOccurs: unbounded

Documentation: Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.

## ServicePlacementPolicy Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|ServicePlacementPolicy|
|maxOccurs|unbounded|
|documentation|Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePlacementPolicy" maxOccurs="unbounded">
                            <xs:annotation>
                                <xs:documentation>Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.</xs:documentation>
                            </xs:annotation>
                            <xs:complexType>
                                <xs:attribute name="DomainName">
                                    <xs:annotation>
                                        <xs:documentation>The fault domain where the service should or should not be placed, depending on the Type value.</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:minLength value="1"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                                <xs:attribute name="Type" use="required">
                                    <xs:annotation>
                                        <xs:documentation>InvalidDomain allows you to specify that a particular Fault Domain is invalid for this workload. RequiredDomain requires that all of the replicas be present in the specified domain. Multiple required domains can be specified. PreferredPrimaryDomain specifies the preferred Fault Domain for primary replicas. Useful in geographically spanned clusters where you are using other locations for redundancy, but would prefer that the primary replicas be placed in a certain location in order to provider lower latency for operations which go to the primary. RequiredDomainDistribution specifies that replicas are required to be distributed among the available fault domains. NonPartiallyPlace controls if the service replicas will be partially place if not all of them can be placed.</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:enumeration value="InvalidDomain"/>
                                            <xs:enumeration value="RequiredDomain"/>
                                            <xs:enumeration value="PreferredPrimaryDomain"/>
                                            <xs:enumeration value="RequiredDomainDistribution"/>
                                            <xs:enumeration value="NonPartiallyPlace"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                            </xs:complexType>
                        </xs:element>
                    
```

### Attribute details

#### DomainName
Documentation: The fault domain where the service should or should not be placed, depending on the Type value.
name: DomainName

#### Type
Documentation: InvalidDomain allows you to specify that a particular Fault Domain is invalid for this workload. RequiredDomain requires that all of the replicas be present in the specified domain. Multiple required domains can be specified. PreferredPrimaryDomain specifies the preferred Fault Domain for primary replicas. Useful in geographically spanned clusters where you are using other locations for redundancy, but would prefer that the primary replicas be placed in a certain location in order to provider lower latency for operations which go to the primary. RequiredDomainDistribution specifies that replicas are required to be distributed among the available fault domains. NonPartiallyPlace controls if the service replicas will be partially place if not all of them can be placed.
name: Type
use: required

## LoadMetrics Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LoadMetrics|
|minOccurs|0|
|documentation|Load metrics reported by this service.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetrics" minOccurs="0">
                <xs:annotation>
                    <xs:documentation>Load metrics reported by this service.</xs:documentation>
                </xs:annotation>
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        
```


### Content element details

#### LoadMetric
name: LoadMetric
type: LoadMetricType
maxOccurs: unbounded

Documentation: 

## LoadMetric Element
|---|---|
|type|[LoadMetricType](#loadmetrictype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LoadMetric|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
                    
```


## Members Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Members|
|minOccurs|1|
|maxOccurs|1|
|documentation|Member services of this service group|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Members" minOccurs="1" maxOccurs="1">
                        <xs:annotation>
                            <xs:documentation>Member services of this service group</xs:documentation>
                        </xs:annotation>
                        <xs:complexType>
                            <xs:sequence>
                                <xs:element name="Member" type="ServiceGroupMemberType" minOccurs="1" maxOccurs="unbounded"/>
                            </xs:sequence>
                        </xs:complexType>
                    </xs:element>
                
```


### Content element details

#### Member
name: Member
type: ServiceGroupMemberType
minOccurs: 1
maxOccurs: unbounded

Documentation: 

## Member Element
|---|---|
|type|[ServiceGroupMemberType](#servicegroupmembertype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Member|
|minOccurs|1|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Member" type="ServiceGroupMemberType" minOccurs="1" maxOccurs="unbounded"/>
                            
```


## Members Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Members|
|minOccurs|1|
|maxOccurs|1|
|documentation|Member services of this service group|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Members" minOccurs="1" maxOccurs="1">
                        <xs:annotation>
                            <xs:documentation>Member services of this service group</xs:documentation>
                        </xs:annotation>
                        <xs:complexType>
                            <xs:sequence>
                                <xs:element name="Member" type="ServiceGroupMemberType" minOccurs="1" maxOccurs="unbounded"/>
                            </xs:sequence>
                        </xs:complexType>
                    </xs:element>
                
```


### Content element details

#### Member
name: Member
type: ServiceGroupMemberType
minOccurs: 1
maxOccurs: unbounded

Documentation: 

## Member Element
|---|---|
|type|[ServiceGroupMemberType](#servicegroupmembertype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Member|
|minOccurs|1|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Member" type="ServiceGroupMemberType" minOccurs="1" maxOccurs="unbounded"/>
                            
```


## SingletonPartition Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|SingletonPartition|
|documentation|Declares that this service has only one partition.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SingletonPartition">
                <xs:annotation>
                    <xs:documentation>Declares that this service has only one partition.</xs:documentation>
                </xs:annotation>
                <xs:complexType/>
            </xs:element>
            
```


## UniformInt64Partition Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 3 attribute(s)|
|name|UniformInt64Partition|
|documentation|Describes a uniform partitioning scheme based on Int64 keys.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UniformInt64Partition">
                <xs:annotation>
                    <xs:documentation>Describes a uniform partitioning scheme based on Int64 keys.</xs:documentation>
                </xs:annotation>
                <xs:complexType>
                    <xs:attribute name="PartitionCount" type="xs:string" use="required">
                        <xs:annotation>
                            <xs:documentation>Total number of partitions (positive integer). Each partition is responsible for a non-overlapping subrange of the overall partition key range.</xs:documentation>
                        </xs:annotation>
                    </xs:attribute>
                    <xs:attribute name="LowKey" type="xs:string" use="required">
                        <xs:annotation>
                            <xs:documentation>Inclusive low range of the partition key (long).</xs:documentation>
                        </xs:annotation>
                    </xs:attribute>
                    <xs:attribute name="HighKey" type="xs:string" use="required">
                        <xs:annotation>
                            <xs:documentation>Inclusive high range of the partition key (long).</xs:documentation>
                        </xs:annotation>
                    </xs:attribute>
                </xs:complexType>
            </xs:element>
            
```

### Attribute details

#### PartitionCount
Documentation: Total number of partitions (positive integer). Each partition is responsible for a non-overlapping subrange of the overall partition key range.
name: PartitionCount
type: xs:string
use: required

#### LowKey
Documentation: Inclusive low range of the partition key (long).
name: LowKey
type: xs:string
use: required

#### HighKey
Documentation: Inclusive high range of the partition key (long).
name: HighKey
type: xs:string
use: required

## NamedPartition Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|NamedPartition|
|documentation|Describes a named partitioning scheme based on names for each partition.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NamedPartition">
                <xs:annotation>
                    <xs:documentation>Describes a named partitioning scheme based on names for each partition.</xs:documentation>
                </xs:annotation>
                <xs:complexType>
                    <xs:sequence maxOccurs="unbounded">
                        <xs:element name="Partition">
                            <xs:annotation>
                                <xs:documentation>Describes a partition by name.</xs:documentation>
                            </xs:annotation>
                            <xs:complexType>
                                <xs:attribute name="Name" use="required">
                                    <xs:annotation>
                                        <xs:documentation>The name of the partition</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:minLength value="1"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                            </xs:complexType>
                        </xs:element>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        
```


### Content element details

#### Partition
name: Partition

Documentation: Describes a partition by name.

## Partition Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|Partition|
|documentation|Describes a partition by name.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Partition">
                            <xs:annotation>
                                <xs:documentation>Describes a partition by name.</xs:documentation>
                            </xs:annotation>
                            <xs:complexType>
                                <xs:attribute name="Name" use="required">
                                    <xs:annotation>
                                        <xs:documentation>The name of the partition</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:minLength value="1"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                            </xs:complexType>
                        </xs:element>
                    
```

### Attribute details

#### Name
Documentation: The name of the partition
name: Name
use: required

## Principals Element
|---|---|
|type|[SecurityPrincipalsType](#securityprincipalstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Principals|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Principals" type="SecurityPrincipalsType"/>
            
```


## Policies Element
|---|---|
|type|[ApplicationPoliciesType](#applicationpoliciestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Policies|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Policies" type="ApplicationPoliciesType"/>
            
```


## Diagnostics Element
|---|---|
|type|[DiagnosticsType](#diagnosticstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Diagnostics|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Diagnostics" type="DiagnosticsType"/>
        
```


## Groups Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Groups|
|minOccurs|0|
|documentation|Declares a set of groups as security principals, which can be referenced in policies.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Groups" minOccurs="0">
                <xs:annotation>
                    <xs:documentation>Declares a set of groups as security principals, which can be referenced in policies.</xs:documentation>
                </xs:annotation>
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="Group" maxOccurs="unbounded">
                            <xs:annotation>
                                <xs:documentation>Declares a group as a security principal, which can be referenced in policies.</xs:documentation>
                            </xs:annotation>
                            <xs:complexType>
                                <xs:sequence>
                                    <xs:element name="NTLMAuthenticationPolicy" minOccurs="0">
                                        <xs:complexType>
                                            <xs:attribute name="IsEnabled" type="xs:boolean" use="optional" default="true"/>
                                        </xs:complexType>
                                    </xs:element>
                                    <xs:element name="Membership" minOccurs="0">
                                        <xs:complexType>
                                            <xs:choice maxOccurs="unbounded">
                                                <xs:element name="DomainGroup" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                                <xs:element name="SystemGroup" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                                <xs:element name="DomainUser" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                            </xs:choice>
                                        </xs:complexType>
                                    </xs:element>
                                </xs:sequence>
                                <xs:attribute name="Name" type="xs:string" use="required">
                                    <xs:annotation>
                                        <xs:documentation>Name of the local group account. The name will be prefixed with the application ID.</xs:documentation>
                                    </xs:annotation>
                                </xs:attribute>
                            </xs:complexType>
                        </xs:element>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            
```


### Content element details

#### Group
name: Group
maxOccurs: unbounded

Documentation: Declares a group as a security principal, which can be referenced in policies.

## Group Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 1 attribute(s)|
|name|Group|
|maxOccurs|unbounded|
|documentation|Declares a group as a security principal, which can be referenced in policies.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Group" maxOccurs="unbounded">
                            <xs:annotation>
                                <xs:documentation>Declares a group as a security principal, which can be referenced in policies.</xs:documentation>
                            </xs:annotation>
                            <xs:complexType>
                                <xs:sequence>
                                    <xs:element name="NTLMAuthenticationPolicy" minOccurs="0">
                                        <xs:complexType>
                                            <xs:attribute name="IsEnabled" type="xs:boolean" use="optional" default="true"/>
                                        </xs:complexType>
                                    </xs:element>
                                    <xs:element name="Membership" minOccurs="0">
                                        <xs:complexType>
                                            <xs:choice maxOccurs="unbounded">
                                                <xs:element name="DomainGroup" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                                <xs:element name="SystemGroup" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                                <xs:element name="DomainUser" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                            </xs:choice>
                                        </xs:complexType>
                                    </xs:element>
                                </xs:sequence>
                                <xs:attribute name="Name" type="xs:string" use="required">
                                    <xs:annotation>
                                        <xs:documentation>Name of the local group account. The name will be prefixed with the application ID.</xs:documentation>
                                    </xs:annotation>
                                </xs:attribute>
                            </xs:complexType>
                        </xs:element>
                    
```

### Attribute details

#### Name
Documentation: Name of the local group account. The name will be prefixed with the application ID.
name: Name
type: xs:string
use: required

### Content element details

#### NTLMAuthenticationPolicy
name: NTLMAuthenticationPolicy
minOccurs: 0

Documentation: 

#### Membership
name: Membership
minOccurs: 0

Documentation: 

## NTLMAuthenticationPolicy Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|NTLMAuthenticationPolicy|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NTLMAuthenticationPolicy" minOccurs="0">
                                        <xs:complexType>
                                            <xs:attribute name="IsEnabled" type="xs:boolean" use="optional" default="true"/>
                                        </xs:complexType>
                                    </xs:element>
                                    
```

### Attribute details

#### IsEnabled
Documentation: 
name: IsEnabled
type: xs:boolean
use: optional
default: true

## Membership Element
|---|---|
|type|anonymous complexType|
|content|3 element(s), 0 attribute(s)|
|name|Membership|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Membership" minOccurs="0">
                                        <xs:complexType>
                                            <xs:choice maxOccurs="unbounded">
                                                <xs:element name="DomainGroup" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                                <xs:element name="SystemGroup" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                                <xs:element name="DomainUser" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                            </xs:choice>
                                        </xs:complexType>
                                    </xs:element>
                                
```


### Content element details

#### DomainGroup
name: DomainGroup
minOccurs: 0
maxOccurs: unbounded

Documentation: 

#### SystemGroup
name: SystemGroup
minOccurs: 0
maxOccurs: unbounded

Documentation: 

#### DomainUser
name: DomainUser
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## DomainGroup Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|DomainGroup|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DomainGroup" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                                
```

### Attribute details

#### Name
Documentation: 
name: Name
type: xs:string
use: required

## SystemGroup Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|SystemGroup|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SystemGroup" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                                
```

### Attribute details

#### Name
Documentation: 
name: Name
type: xs:string
use: required

## DomainUser Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|DomainUser|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DomainUser" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                            
```

### Attribute details

#### Name
Documentation: 
name: Name
type: xs:string
use: required

## Users Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Users|
|minOccurs|0|
|documentation|Declares a set of users as security principals, which can be referenced in policies.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Users" minOccurs="0">
                <xs:annotation>
                    <xs:documentation>Declares a set of users as security principals, which can be referenced in policies.</xs:documentation>
                </xs:annotation>
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="User" maxOccurs="unbounded">
                            <xs:annotation>
                                <xs:documentation>Declares a user as a security principal, which can be referenced in policies.</xs:documentation>
                            </xs:annotation>
                            <xs:complexType>
                                <xs:sequence>
                                    <xs:element name="NTLMAuthenticationPolicy" minOccurs="0">
                                        <xs:complexType>
                                            <xs:attribute name="IsEnabled" type="xs:boolean" use="optional" default="true"/>
                                            <xs:attribute name="PasswordSecret" type="xs:string" use="required"/>
                                            <xs:attribute name="PasswordSecretEncrypted" type="xs:boolean" use="optional" default="false"/>
                                            <xs:attribute name="X509StoreLocation" use="optional" default="LocalMachine">
                                                <xs:simpleType>
                                                    <xs:restriction base="xs:string">
                                                        <xs:enumeration value="LocalMachine"/>
                                                        <xs:enumeration value="CurrentUser"/>
                                                    </xs:restriction>
                                                </xs:simpleType>
                                            </xs:attribute>
                                                                                        <xs:attribute name="X509StoreName" default="My">
                                                <xs:simpleType>
                                                    <xs:restriction base="xs:string"/>
                                                </xs:simpleType>
                                            </xs:attribute>
                                            <xs:attribute name="X509Thumbprint" type="xs:string"/>
                                        </xs:complexType>
                                    </xs:element>
                                    <xs:element name="MemberOf" minOccurs="0">
                                        <xs:annotation>
                                            <xs:documentation>
                        Users can be added to any existing membership group, so it can inherit all the properties and security settings of that membership group. The membership group can be used to secure external resources that need to be accessed by different services or the same service (on a different machine).
                      </xs:documentation>
                                                                                </xs:annotation>
                                                                                <xs:complexType>
                                                                                        <xs:choice maxOccurs="unbounded">
                                                                                                <xs:element name="SystemGroup" minOccurs="0" maxOccurs="unbounded">
                                                                                                        <xs:annotation>
                                                                                                                <xs:documentation>The system group to add the user to.  The system group must be defined in the Groups section.</xs:documentation>
                                                                                                        </xs:annotation>
                                                                                                        <xs:complexType>
                                                                                                                <xs:attribute name="Name" type="xs:string" use="required">
                                                                                                                        <xs:annotation>
                                                                                                                                <xs:documentation>The name of the system group.</xs:documentation>
                                                                                                                        </xs:annotation>
                                                                                                                </xs:attribute>
                                                                                                        </xs:complexType>
                                                                                                </xs:element>
                                                                                                <xs:element name="Group" minOccurs="0" maxOccurs="unbounded">
                                                                                                        <xs:annotation>
                                                                                                                <xs:documentation>The group to add the user to.  The group must be defined in the Groups section.</xs:documentation>
                                                                                                        </xs:annotation>
                                                                                                        <xs:complexType>
                                                                                                                <xs:attribute name="NameRef" type="xs:string" use="required">
                                                                                                                        <xs:annotation>
                                                                                                                                <xs:documentation>The name of the group.</xs:documentation>
                                                                                                                        </xs:annotation>
                                                                                                                </xs:attribute>
                                                                                                        </xs:complexType>
                                                                                                </xs:element>
                                                                                        </xs:choice>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                </xs:sequence>
                                                                <xs:attribute name="Name" type="xs:string" use="required">
                                                                        <xs:annotation>
                                                                                <xs:documentation>Name of the user account.</xs:documentation>
                                                                        </xs:annotation>
                                                                </xs:attribute>
                                                                <xs:attribute name="AccountType" use="optional" default="LocalUser">
                                                                        <xs:annotation>
                                                                                <xs:documentation>Specifies the type of account. Local user accounts are created on the machines where the application is deployed. By default, these accounts do not have the same names as those specified here. Instead, they are dynamically generated and have random passwords. Supported local system account types are LocalUser, NetworkService, LocalService and LocalSystem. Domain accounts are supported on Windows Server deployments where Azure Active Directory is available.</xs:documentation>
                                                                        </xs:annotation>
                                                                        <xs:simpleType>
                                                                                <xs:restriction base="xs:string">
                                                                                        <xs:enumeration value="LocalUser"/>
                                                                                        <xs:enumeration value="DomainUser"/>
                                                                                        <xs:enumeration value="NetworkService"/>
                                                                                        <xs:enumeration value="LocalService"/>
                                                                                        <xs:enumeration value="ManagedServiceAccount"/>
                                                                                        <xs:enumeration value="LocalSystem"/>
                                                                                </xs:restriction>
                                                                        </xs:simpleType>
                                                                </xs:attribute>
                                                                <xs:attribute name="LoadUserProfile" type="xs:boolean" use="optional" default="false"/>
                                                                <xs:attribute name="PerformInteractiveLogon" type="xs:boolean" use="optional" default="false"/>
                                                                <xs:attributeGroup ref="AccountCredentialsGroup"/>
                                                                <xs:attribute name="PasswordEncrypted" type="xs:boolean" use="optional">
                                                                        <xs:annotation>
                                                                                <xs:documentation>True if the password is encrypted; false if in plain text.</xs:documentation>
                                                                        </xs:annotation>
                                                                </xs:attribute>
                                                        </xs:complexType>
                                                </xs:element>
                                        </xs:sequence>
                                </xs:complexType>
                        </xs:element>
                
```


### Content element details

#### User
name: User
maxOccurs: unbounded

Documentation: Declares a user as a security principal, which can be referenced in policies.

## User Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 5 attribute(s)|
|name|User|
|maxOccurs|unbounded|
|documentation|Declares a user as a security principal, which can be referenced in policies.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="User" maxOccurs="unbounded">
                            <xs:annotation>
                                <xs:documentation>Declares a user as a security principal, which can be referenced in policies.</xs:documentation>
                            </xs:annotation>
                            <xs:complexType>
                                <xs:sequence>
                                    <xs:element name="NTLMAuthenticationPolicy" minOccurs="0">
                                        <xs:complexType>
                                            <xs:attribute name="IsEnabled" type="xs:boolean" use="optional" default="true"/>
                                            <xs:attribute name="PasswordSecret" type="xs:string" use="required"/>
                                            <xs:attribute name="PasswordSecretEncrypted" type="xs:boolean" use="optional" default="false"/>
                                            <xs:attribute name="X509StoreLocation" use="optional" default="LocalMachine">
                                                <xs:simpleType>
                                                    <xs:restriction base="xs:string">
                                                        <xs:enumeration value="LocalMachine"/>
                                                        <xs:enumeration value="CurrentUser"/>
                                                    </xs:restriction>
                                                </xs:simpleType>
                                            </xs:attribute>
                                                                                        <xs:attribute name="X509StoreName" default="My">
                                                <xs:simpleType>
                                                    <xs:restriction base="xs:string"/>
                                                </xs:simpleType>
                                            </xs:attribute>
                                            <xs:attribute name="X509Thumbprint" type="xs:string"/>
                                        </xs:complexType>
                                    </xs:element>
                                    <xs:element name="MemberOf" minOccurs="0">
                                        <xs:annotation>
                                            <xs:documentation>
                        Users can be added to any existing membership group, so it can inherit all the properties and security settings of that membership group. The membership group can be used to secure external resources that need to be accessed by different services or the same service (on a different machine).
                      </xs:documentation>
                                                                                </xs:annotation>
                                                                                <xs:complexType>
                                                                                        <xs:choice maxOccurs="unbounded">
                                                                                                <xs:element name="SystemGroup" minOccurs="0" maxOccurs="unbounded">
                                                                                                        <xs:annotation>
                                                                                                                <xs:documentation>The system group to add the user to.  The system group must be defined in the Groups section.</xs:documentation>
                                                                                                        </xs:annotation>
                                                                                                        <xs:complexType>
                                                                                                                <xs:attribute name="Name" type="xs:string" use="required">
                                                                                                                        <xs:annotation>
                                                                                                                                <xs:documentation>The name of the system group.</xs:documentation>
                                                                                                                        </xs:annotation>
                                                                                                                </xs:attribute>
                                                                                                        </xs:complexType>
                                                                                                </xs:element>
                                                                                                <xs:element name="Group" minOccurs="0" maxOccurs="unbounded">
                                                                                                        <xs:annotation>
                                                                                                                <xs:documentation>The group to add the user to.  The group must be defined in the Groups section.</xs:documentation>
                                                                                                        </xs:annotation>
                                                                                                        <xs:complexType>
                                                                                                                <xs:attribute name="NameRef" type="xs:string" use="required">
                                                                                                                        <xs:annotation>
                                                                                                                                <xs:documentation>The name of the group.</xs:documentation>
                                                                                                                        </xs:annotation>
                                                                                                                </xs:attribute>
                                                                                                        </xs:complexType>
                                                                                                </xs:element>
                                                                                        </xs:choice>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                </xs:sequence>
                                                                <xs:attribute name="Name" type="xs:string" use="required">
                                                                        <xs:annotation>
                                                                                <xs:documentation>Name of the user account.</xs:documentation>
                                                                        </xs:annotation>
                                                                </xs:attribute>
                                                                <xs:attribute name="AccountType" use="optional" default="LocalUser">
                                                                        <xs:annotation>
                                                                                <xs:documentation>Specifies the type of account. Local user accounts are created on the machines where the application is deployed. By default, these accounts do not have the same names as those specified here. Instead, they are dynamically generated and have random passwords. Supported local system account types are LocalUser, NetworkService, LocalService and LocalSystem. Domain accounts are supported on Windows Server deployments where Azure Active Directory is available.</xs:documentation>
                                                                        </xs:annotation>
                                                                        <xs:simpleType>
                                                                                <xs:restriction base="xs:string">
                                                                                        <xs:enumeration value="LocalUser"/>
                                                                                        <xs:enumeration value="DomainUser"/>
                                                                                        <xs:enumeration value="NetworkService"/>
                                                                                        <xs:enumeration value="LocalService"/>
                                                                                        <xs:enumeration value="ManagedServiceAccount"/>
                                                                                        <xs:enumeration value="LocalSystem"/>
                                                                                </xs:restriction>
                                                                        </xs:simpleType>
                                                                </xs:attribute>
                                                                <xs:attribute name="LoadUserProfile" type="xs:boolean" use="optional" default="false"/>
                                                                <xs:attribute name="PerformInteractiveLogon" type="xs:boolean" use="optional" default="false"/>
                                                                <xs:attributeGroup ref="AccountCredentialsGroup"/>
                                                                <xs:attribute name="PasswordEncrypted" type="xs:boolean" use="optional">
                                                                        <xs:annotation>
                                                                                <xs:documentation>True if the password is encrypted; false if in plain text.</xs:documentation>
                                                                        </xs:annotation>
                                                                </xs:attribute>
                                                        </xs:complexType>
                                                </xs:element>
                                        
```

### Attribute details

#### Name
Documentation: Name of the user account.
name: Name
type: xs:string
use: required

#### AccountType
Documentation: Specifies the type of account. Local user accounts are created on the machines where the application is deployed. By default, these accounts do not have the same names as those specified here. Instead, they are dynamically generated and have random passwords. Supported local system account types are LocalUser, NetworkService, LocalService and LocalSystem. Domain accounts are supported on Windows Server deployments where Azure Active Directory is available.
name: AccountType
use: optional
default: LocalUser

#### LoadUserProfile
Documentation: 
name: LoadUserProfile
type: xs:boolean
use: optional
default: false

#### PerformInteractiveLogon
Documentation: 
name: PerformInteractiveLogon
type: xs:boolean
use: optional
default: false

#### PasswordEncrypted
Documentation: True if the password is encrypted; false if in plain text.
name: PasswordEncrypted
type: xs:boolean
use: optional

### Content element details

#### NTLMAuthenticationPolicy
name: NTLMAuthenticationPolicy
minOccurs: 0

Documentation: 

#### MemberOf
name: MemberOf
minOccurs: 0

Documentation: 
                        Users can be added to any existing membership group, so it can inherit all the properties and security settings of that membership group. The membership group can be used to secure external resources that need to be accessed by different services or the same service (on a different machine).
                      

## NTLMAuthenticationPolicy Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 6 attribute(s)|
|name|NTLMAuthenticationPolicy|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NTLMAuthenticationPolicy" minOccurs="0">
                                        <xs:complexType>
                                            <xs:attribute name="IsEnabled" type="xs:boolean" use="optional" default="true"/>
                                            <xs:attribute name="PasswordSecret" type="xs:string" use="required"/>
                                            <xs:attribute name="PasswordSecretEncrypted" type="xs:boolean" use="optional" default="false"/>
                                            <xs:attribute name="X509StoreLocation" use="optional" default="LocalMachine">
                                                <xs:simpleType>
                                                    <xs:restriction base="xs:string">
                                                        <xs:enumeration value="LocalMachine"/>
                                                        <xs:enumeration value="CurrentUser"/>
                                                    </xs:restriction>
                                                </xs:simpleType>
                                            </xs:attribute>
                                                                                        <xs:attribute name="X509StoreName" default="My">
                                                <xs:simpleType>
                                                    <xs:restriction base="xs:string"/>
                                                </xs:simpleType>
                                            </xs:attribute>
                                            <xs:attribute name="X509Thumbprint" type="xs:string"/>
                                        </xs:complexType>
                                    </xs:element>
                                    
```

### Attribute details

#### IsEnabled
Documentation: 
name: IsEnabled
type: xs:boolean
use: optional
default: true

#### PasswordSecret
Documentation: 
name: PasswordSecret
type: xs:string
use: required

#### PasswordSecretEncrypted
Documentation: 
name: PasswordSecretEncrypted
type: xs:boolean
use: optional
default: false

#### X509StoreLocation
Documentation: 
name: X509StoreLocation
use: optional
default: LocalMachine

#### X509StoreName
Documentation: 
name: X509StoreName
default: My

#### X509Thumbprint
Documentation: 
name: X509Thumbprint
type: xs:string

## MemberOf Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|MemberOf|
|minOccurs|0|
|documentation|
                        Users can be added to any existing membership group, so it can inherit all the properties and security settings of that membership group. The membership group can be used to secure external resources that need to be accessed by different services or the same service (on a different machine).
                      |

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MemberOf" minOccurs="0">
                                        <xs:annotation>
                                            <xs:documentation>
                        Users can be added to any existing membership group, so it can inherit all the properties and security settings of that membership group. The membership group can be used to secure external resources that need to be accessed by different services or the same service (on a different machine).
                      </xs:documentation>
                                                                                </xs:annotation>
                                                                                <xs:complexType>
                                                                                        <xs:choice maxOccurs="unbounded">
                                                                                                <xs:element name="SystemGroup" minOccurs="0" maxOccurs="unbounded">
                                                                                                        <xs:annotation>
                                                                                                                <xs:documentation>The system group to add the user to.  The system group must be defined in the Groups section.</xs:documentation>
                                                                                                        </xs:annotation>
                                                                                                        <xs:complexType>
                                                                                                                <xs:attribute name="Name" type="xs:string" use="required">
                                                                                                                        <xs:annotation>
                                                                                                                                <xs:documentation>The name of the system group.</xs:documentation>
                                                                                                                        </xs:annotation>
                                                                                                                </xs:attribute>
                                                                                                        </xs:complexType>
                                                                                                </xs:element>
                                                                                                <xs:element name="Group" minOccurs="0" maxOccurs="unbounded">
                                                                                                        <xs:annotation>
                                                                                                                <xs:documentation>The group to add the user to.  The group must be defined in the Groups section.</xs:documentation>
                                                                                                        </xs:annotation>
                                                                                                        <xs:complexType>
                                                                                                                <xs:attribute name="NameRef" type="xs:string" use="required">
                                                                                                                        <xs:annotation>
                                                                                                                                <xs:documentation>The name of the group.</xs:documentation>
                                                                                                                        </xs:annotation>
                                                                                                                </xs:attribute>
                                                                                                        </xs:complexType>
                                                                                                </xs:element>
                                                                                        </xs:choice>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                
```


### Content element details

#### SystemGroup
name: SystemGroup
minOccurs: 0
maxOccurs: unbounded

Documentation: The system group to add the user to.  The system group must be defined in the Groups section.

#### Group
name: Group
minOccurs: 0
maxOccurs: unbounded

Documentation: The group to add the user to.  The group must be defined in the Groups section.

## SystemGroup Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|SystemGroup|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|The system group to add the user to.  The system group must be defined in the Groups section.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SystemGroup" minOccurs="0" maxOccurs="unbounded">
                                                                                                        <xs:annotation>
                                                                                                                <xs:documentation>The system group to add the user to.  The system group must be defined in the Groups section.</xs:documentation>
                                                                                                        </xs:annotation>
                                                                                                        <xs:complexType>
                                                                                                                <xs:attribute name="Name" type="xs:string" use="required">
                                                                                                                        <xs:annotation>
                                                                                                                                <xs:documentation>The name of the system group.</xs:documentation>
                                                                                                                        </xs:annotation>
                                                                                                                </xs:attribute>
                                                                                                        </xs:complexType>
                                                                                                </xs:element>
                                                                                                
```

### Attribute details

#### Name
Documentation: The name of the system group.
name: Name
type: xs:string
use: required

## Group Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|Group|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|The group to add the user to.  The group must be defined in the Groups section.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Group" minOccurs="0" maxOccurs="unbounded">
                                                                                                        <xs:annotation>
                                                                                                                <xs:documentation>The group to add the user to.  The group must be defined in the Groups section.</xs:documentation>
                                                                                                        </xs:annotation>
                                                                                                        <xs:complexType>
                                                                                                                <xs:attribute name="NameRef" type="xs:string" use="required">
                                                                                                                        <xs:annotation>
                                                                                                                                <xs:documentation>The name of the group.</xs:documentation>
                                                                                                                        </xs:annotation>
                                                                                                                </xs:attribute>
                                                                                                        </xs:complexType>
                                                                                                </xs:element>
                                                                                        
```

### Attribute details

#### NameRef
Documentation: The name of the group.
name: NameRef
type: xs:string
use: required

## LogCollectionPolicies Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LogCollectionPolicies|
|minOccurs|0|
|documentation|Specifies whether log collection is enabled. Works only in an Azure cluster environment|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LogCollectionPolicies" minOccurs="0">
                                <xs:annotation>
                                        <xs:documentation>Specifies whether log collection is enabled. Works only in an Azure cluster environment</xs:documentation>
                                </xs:annotation>
                                <xs:complexType>
                                        <xs:sequence maxOccurs="unbounded">
                                                <xs:element name="LogCollectionPolicy">
                                                        <xs:complexType>
                                                                <xs:attribute name="Path" type="xs:string" use="optional"/>
                                                        </xs:complexType>
                                                </xs:element>
                                        </xs:sequence>
                                </xs:complexType>
                        </xs:element>
                        
```


### Content element details

#### LogCollectionPolicy
name: LogCollectionPolicy

Documentation: 

## LogCollectionPolicy Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|LogCollectionPolicy|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LogCollectionPolicy">
                                                        <xs:complexType>
                                                                <xs:attribute name="Path" type="xs:string" use="optional"/>
                                                        </xs:complexType>
                                                </xs:element>
                                        
```

### Attribute details

#### Path
Documentation: 
name: Path
type: xs:string
use: optional

## DefaultRunAsPolicy Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|DefaultRunAsPolicy|
|minOccurs|0|
|documentation|Specify a default user account for all service code packages that don’t have a specific RunAsPolicy defined in the ServiceManifestImport section.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultRunAsPolicy" minOccurs="0">
                                <xs:annotation>
                                        <xs:documentation>Specify a default user account for all service code packages that don’t have a specific RunAsPolicy defined in the ServiceManifestImport section.</xs:documentation>
                                </xs:annotation>
                                <xs:complexType>
                                        <xs:attribute name="UserRef" type="xs:string" use="required">
                                                <xs:annotation>
                                                        <xs:documentation>The user account that the service code packages will run as.  The user account must be declared in the Principals section. Often it is preferable to run the setup entry point using a local system account rather than an administrators account.</xs:documentation>
                                                </xs:annotation>
                                        </xs:attribute>
                                </xs:complexType>
                        </xs:element>
                        
```

### Attribute details

#### UserRef
Documentation: The user account that the service code packages will run as.  The user account must be declared in the Principals section. Often it is preferable to run the setup entry point using a local system account rather than an administrators account.
name: UserRef
type: xs:string
use: required

## HealthPolicy Element
|---|---|
|type|[ApplicationHealthPolicyType](#applicationhealthpolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|HealthPolicy|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="HealthPolicy" type="ApplicationHealthPolicyType" minOccurs="0"/>
                        
```


## SecurityAccessPolicies Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|SecurityAccessPolicies|
|minOccurs|0|
|documentation|List of security policies applied to resources at the application level.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityAccessPolicies" minOccurs="0">
                                <xs:annotation>
                                        <xs:documentation>List of security policies applied to resources at the application level.</xs:documentation>
                                </xs:annotation>
                                <xs:complexType>
                                        <xs:sequence maxOccurs="unbounded">
                                                <xs:element name="SecurityAccessPolicy" type="SecurityAccessPolicyType"/>
                                        </xs:sequence>
                                </xs:complexType>
                        </xs:element>
                
```


### Content element details

#### SecurityAccessPolicy
name: SecurityAccessPolicy
type: SecurityAccessPolicyType

Documentation: 

## SecurityAccessPolicy Element
|---|---|
|type|[SecurityAccessPolicyType](#securityaccesspolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecurityAccessPolicy|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityAccessPolicy" type="SecurityAccessPolicyType"/>
                                        
```


## Parameter Element
|---|---|
|type|[ParameterType](#parametertype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Parameter|
|minOccurs|1|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameter" type="ParameterType" minOccurs="1" maxOccurs="unbounded"/>
                
```


## Parameters Element
|---|---|
|type|[ParametersType](#parameterstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Parameters|
|documentation|Additional settings specified as name-value pairs|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameters" type="ParametersType">
    <xs:annotation>
      <xs:documentation>Additional settings specified as name-value pairs</xs:documentation>
    </xs:annotation>
  </xs:element>
  
```


## None Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|ref|Parameters|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Parameters" minOccurs="0"/>
    
```


## None Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|ref|Parameters|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Parameters" minOccurs="0"/>
    
```


## None Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|ref|Parameters|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Parameters" minOccurs="0"/>
    
```


## CrashDumpSource Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 1 attribute(s)|
|name|CrashDumpSource|
|minOccurs|0|
|documentation|Specifies crash dump collection. Crash dumps are collected for executables that host the code packages of all services belonging to the application.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CrashDumpSource" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies crash dump collection. Crash dumps are collected for executables that host the code packages of all services belonging to the application.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Destinations" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Destinations to which the crash dumps need to be transferred.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="LocalStore" type="LocalStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  <xs:element name="FileStore" type="FileStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  <xs:element name="AzureBlob" type="AzureBlobType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            <xs:element ref="Parameters" minOccurs="0" maxOccurs="1"/>
          </xs:sequence>
          <xs:attribute name="IsEnabled" type="xs:string">
            <xs:annotation>
              <xs:documentation>Whether or not crash dump collection is enabled. By default, it is not enabled.</xs:documentation>
            </xs:annotation>
          </xs:attribute>
        </xs:complexType>
      </xs:element>
      
```

### Attribute details

#### IsEnabled
Documentation: Whether or not crash dump collection is enabled. By default, it is not enabled.
name: IsEnabled
type: xs:string

### Content element details

#### Destinations
name: Destinations
minOccurs: 0

Documentation: Destinations to which the crash dumps need to be transferred.

#### None
ref: Parameters
minOccurs: 0
maxOccurs: 1

Documentation: 

## Destinations Element
|---|---|
|type|anonymous complexType|
|content|3 element(s), 0 attribute(s)|
|name|Destinations|
|minOccurs|0|
|documentation|Destinations to which the crash dumps need to be transferred.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Destinations" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Destinations to which the crash dumps need to be transferred.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="LocalStore" type="LocalStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  <xs:element name="FileStore" type="FileStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  <xs:element name="AzureBlob" type="AzureBlobType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            
```


### Content element details

#### LocalStore
name: LocalStore
type: LocalStoreType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

#### FileStore
name: FileStore
type: FileStoreType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

#### AzureBlob
name: AzureBlob
type: AzureBlobType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## LocalStore Element
|---|---|
|type|[LocalStoreType](#localstoretype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LocalStore|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LocalStore" type="LocalStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  
```


## FileStore Element
|---|---|
|type|[FileStoreType](#filestoretype-type)|
|content|0 element(s), 0 attribute(s)|
|name|FileStore|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileStore" type="FileStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  
```


## AzureBlob Element
|---|---|
|type|[AzureBlobType](#azureblobtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|AzureBlob|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureBlob" type="AzureBlobType" minOccurs="0" maxOccurs="unbounded"/>
                
```


## None Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|ref|Parameters|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Parameters" minOccurs="0" maxOccurs="1"/>
          
```


## ETWSource Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 1 attribute(s)|
|name|ETWSource|
|minOccurs|0|
|documentation|Specifies ETW trace collection. ETW traces are collected for the providers that are registered by all services belonging to the application.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ETWSource" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies ETW trace collection. ETW traces are collected for the providers that are registered by all services belonging to the application.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Destinations" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Destinations to which the crash dumps need to be transferred.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="LocalStore" type="LocalStoreETWType" minOccurs="0" maxOccurs="unbounded"/>
                  <xs:element name="FileStore" type="FileStoreETWType" minOccurs="0" maxOccurs="unbounded"/>
                  <xs:element name="AzureBlob" type="AzureBlobETWType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            <xs:element ref="Parameters" minOccurs="0" maxOccurs="1"/>
          </xs:sequence>
          <xs:attribute name="IsEnabled" type="xs:string">
            <xs:annotation>
              <xs:documentation>Whether or not ETW trace collection is enabled. By default, it is not enabled.</xs:documentation>
            </xs:annotation>
          </xs:attribute>
        </xs:complexType>
      </xs:element>
      
```

### Attribute details

#### IsEnabled
Documentation: Whether or not ETW trace collection is enabled. By default, it is not enabled.
name: IsEnabled
type: xs:string

### Content element details

#### Destinations
name: Destinations
minOccurs: 0

Documentation: Destinations to which the crash dumps need to be transferred.

#### None
ref: Parameters
minOccurs: 0
maxOccurs: 1

Documentation: 

## Destinations Element
|---|---|
|type|anonymous complexType|
|content|3 element(s), 0 attribute(s)|
|name|Destinations|
|minOccurs|0|
|documentation|Destinations to which the crash dumps need to be transferred.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Destinations" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Destinations to which the crash dumps need to be transferred.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="LocalStore" type="LocalStoreETWType" minOccurs="0" maxOccurs="unbounded"/>
                  <xs:element name="FileStore" type="FileStoreETWType" minOccurs="0" maxOccurs="unbounded"/>
                  <xs:element name="AzureBlob" type="AzureBlobETWType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            
```


### Content element details

#### LocalStore
name: LocalStore
type: LocalStoreETWType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

#### FileStore
name: FileStore
type: FileStoreETWType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

#### AzureBlob
name: AzureBlob
type: AzureBlobETWType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## LocalStore Element
|---|---|
|type|[LocalStoreETWType](#localstoreetwtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LocalStore|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LocalStore" type="LocalStoreETWType" minOccurs="0" maxOccurs="unbounded"/>
                  
```


## FileStore Element
|---|---|
|type|[FileStoreETWType](#filestoreetwtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|FileStore|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileStore" type="FileStoreETWType" minOccurs="0" maxOccurs="unbounded"/>
                  
```


## AzureBlob Element
|---|---|
|type|[AzureBlobETWType](#azureblobetwtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|AzureBlob|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureBlob" type="AzureBlobETWType" minOccurs="0" maxOccurs="unbounded"/>
                
```


## None Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|ref|Parameters|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Parameters" minOccurs="0" maxOccurs="1"/>
          
```


## FolderSource Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 1 attribute(s)|
|name|FolderSource|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|Specifies the collection of the contents of a particular folder on the local node.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FolderSource" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies the collection of the contents of a particular folder on the local node.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Destinations" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Destinations to which the folder contents need to be transferred.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="LocalStore" type="LocalStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  <xs:element name="FileStore" type="FileStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  <xs:element name="AzureBlob" type="AzureBlobType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            <xs:element ref="Parameters" minOccurs="0" maxOccurs="1"/>
          </xs:sequence>
          <xs:attribute name="IsEnabled" type="xs:string">
            <xs:annotation>
              <xs:documentation>Whether or not collection of the contents of this folder is enabled. By default, it is not enabled.</xs:documentation>
            </xs:annotation>
          </xs:attribute>
          <xs:attributeGroup ref="RelativeFolderPath"/>
          <xs:attributeGroup ref="DataDeletionAgeInDays"/>
        </xs:complexType>
      </xs:element>
    
```

### Attribute details

#### IsEnabled
Documentation: Whether or not collection of the contents of this folder is enabled. By default, it is not enabled.
name: IsEnabled
type: xs:string

### Content element details

#### Destinations
name: Destinations
minOccurs: 0

Documentation: Destinations to which the folder contents need to be transferred.

#### None
ref: Parameters
minOccurs: 0
maxOccurs: 1

Documentation: 

## Destinations Element
|---|---|
|type|anonymous complexType|
|content|3 element(s), 0 attribute(s)|
|name|Destinations|
|minOccurs|0|
|documentation|Destinations to which the folder contents need to be transferred.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Destinations" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Destinations to which the folder contents need to be transferred.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="LocalStore" type="LocalStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  <xs:element name="FileStore" type="FileStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  <xs:element name="AzureBlob" type="AzureBlobType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            
```


### Content element details

#### LocalStore
name: LocalStore
type: LocalStoreType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

#### FileStore
name: FileStore
type: FileStoreType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

#### AzureBlob
name: AzureBlob
type: AzureBlobType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## LocalStore Element
|---|---|
|type|[LocalStoreType](#localstoretype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LocalStore|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LocalStore" type="LocalStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  
```


## FileStore Element
|---|---|
|type|[FileStoreType](#filestoretype-type)|
|content|0 element(s), 0 attribute(s)|
|name|FileStore|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileStore" type="FileStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  
```


## AzureBlob Element
|---|---|
|type|[AzureBlobType](#azureblobtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|AzureBlob|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureBlob" type="AzureBlobType" minOccurs="0" maxOccurs="unbounded"/>
                
```


## None Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|ref|Parameters|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Parameters" minOccurs="0" maxOccurs="1"/>
          
```


## Endpoints Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Endpoints|
|minOccurs|0|
|documentation|Defines endpoints for the service.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoints" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Defines endpoints for the service.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Endpoint" type="EndpointOverrideType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    
```


### Content element details

#### Endpoint
name: Endpoint
type: EndpointOverrideType
maxOccurs: unbounded

Documentation: 

## Endpoint Element
|---|---|
|type|[EndpointOverrideType](#endpointoverridetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Endpoint|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoint" type="EndpointOverrideType" maxOccurs="unbounded"/>
          
```


## Description Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|Description|
|minOccurs|0|
|documentation|Text describing this service.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Description" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Text describing this service.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## ServiceTypes Element
|---|---|
|type|[ServiceAndServiceGroupTypesType](#serviceandservicegrouptypestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceTypes|
|documentation|Defines what service types are supported by a CodePackage in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. Service types are declared at the manifest level and not the code package level.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypes" type="ServiceAndServiceGroupTypesType">
        <xs:annotation>
          <xs:documentation>Defines what service types are supported by a CodePackage in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. Service types are declared at the manifest level and not the code package level.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## CodePackage Element
|---|---|
|type|[CodePackageType](#codepackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|CodePackage|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackage" type="CodePackageType" maxOccurs="unbounded"/>
      
```


## ConfigPackage Element
|---|---|
|type|[ConfigPackageType](#configpackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ConfigPackage|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigPackage" type="ConfigPackageType" minOccurs="0" maxOccurs="unbounded"/>
      
```


## DataPackage Element
|---|---|
|type|[DataPackageType](#datapackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DataPackage|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DataPackage" type="DataPackageType" minOccurs="0" maxOccurs="unbounded"/>
      
```


## Resources Element
|---|---|
|type|[ResourcesType](#resourcestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Resources|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Resources" type="ResourcesType" minOccurs="0"/>
      
```


## Diagnostics Element
|---|---|
|type|[ServiceDiagnosticsType](#servicediagnosticstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Diagnostics|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Diagnostics" type="ServiceDiagnosticsType" minOccurs="0"/>
    
```


## StatefulServiceType Element
|---|---|
|type|[StatefulServiceTypeType](#statefulservicetypetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceType|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceType" type="StatefulServiceTypeType"/>
      
```


## StatelessServiceType Element
|---|---|
|type|[StatelessServiceTypeType](#statelessservicetypetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceType|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceType" type="StatelessServiceTypeType"/>
      
```


## StatefulServiceGroupType Element
|---|---|
|type|[StatefulServiceGroupTypeType](#statefulservicegrouptypetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceGroupType|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceGroupType" type="StatefulServiceGroupTypeType"/>
      
```


## StatelessServiceGroupType Element
|---|---|
|type|[StatelessServiceGroupTypeType](#statelessservicegrouptypetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceGroupType|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceGroupType" type="StatelessServiceGroupTypeType"/>
    
```


## StatefulServiceType Element
|---|---|
|type|[StatefulServiceTypeType](#statefulservicetypetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceType|
|documentation|Describes a stateful ServiceType.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceType" type="StatefulServiceTypeType">
        <xs:annotation>
          <xs:documentation>Describes a stateful ServiceType.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## StatelessServiceType Element
|---|---|
|type|[StatelessServiceTypeType](#statelessservicetypetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceType|
|documentation|Describes a stateless ServiceType.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceType" type="StatelessServiceTypeType">
        <xs:annotation>
          <xs:documentation>Describes a stateless ServiceType.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```


## LoadMetrics Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LoadMetrics|
|minOccurs|0|
|documentation|Load metrics reported by this service.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetrics" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Load metrics reported by this service.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      
```


### Content element details

#### LoadMetric
name: LoadMetric
type: LoadMetricType
maxOccurs: unbounded

Documentation: 

## LoadMetric Element
|---|---|
|type|[LoadMetricType](#loadmetrictype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LoadMetric|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
          
```


## PlacementConstraints Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|PlacementConstraints|
|minOccurs|0|
|documentation|Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service's requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion>12  && InDMZ == True)".|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PlacementConstraints" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service's requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion&gt;12  &amp;&amp; InDMZ == True)".</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## ServicePlacementPolicies Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ServicePlacementPolicies|
|minOccurs|0|
|documentation|Declares placement policies for a service.  Useful when the cluster spans geographic distances or and/or geopolitical regions.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePlacementPolicies" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Declares placement policies for a service.  Useful when the cluster spans geographic distances or and/or geopolitical regions.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="ServicePlacementPolicy" maxOccurs="unbounded">
              <xs:annotation>
                <xs:documentation>Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:attribute name="DomainName">
                  <xs:annotation>
                    <xs:documentation>The fault domain where the service should or should not be placed, depending on the Type value.</xs:documentation>
                  </xs:annotation>
                  <xs:simpleType>
                    <xs:restriction base="xs:string">
                      <xs:minLength value="1"/>
                    </xs:restriction>
                  </xs:simpleType>
                </xs:attribute>
                <xs:attribute name="Type" use="required">
                  <xs:annotation>
                    <xs:documentation>InvalidDomain allows you to specify that a particular Fault Domain is invalid for this workload. RequiredDomain requires that all of the replicas be present in the specified domain. Multiple required domains can be specified. PreferredPrimaryDomain specifies the preferred Fault Domain for primary replicas. Useful in geographically spanned clusters where you are using other locations for redundancy, but would prefer that the primary replicas be placed in a certain location in order to provider lower latency for operations which go to the primary. RequiredDomainDistribution specifies that replicas are required to be distributed among the available fault domains. NonPartiallyPlace controls if the service replicas will be partially place if not all of them can be placed. </xs:documentation>
                  </xs:annotation>
                  <xs:simpleType>
                    <xs:restriction base="xs:string">
                      <xs:enumeration value="InvalidDomain"/>
                      <xs:enumeration value="RequiredDomain"/>
                      <xs:enumeration value="PreferredPrimaryDomain"/>
                      <xs:enumeration value="RequiredDomainDistribution"/>
                      <xs:enumeration value="NonPartiallyPlace"/>
                    </xs:restriction>
                  </xs:simpleType>
                </xs:attribute>
              </xs:complexType>
            </xs:element>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      
```


### Content element details

#### ServicePlacementPolicy
name: ServicePlacementPolicy
maxOccurs: unbounded

Documentation: Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.

## ServicePlacementPolicy Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|ServicePlacementPolicy|
|maxOccurs|unbounded|
|documentation|Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePlacementPolicy" maxOccurs="unbounded">
              <xs:annotation>
                <xs:documentation>Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:attribute name="DomainName">
                  <xs:annotation>
                    <xs:documentation>The fault domain where the service should or should not be placed, depending on the Type value.</xs:documentation>
                  </xs:annotation>
                  <xs:simpleType>
                    <xs:restriction base="xs:string">
                      <xs:minLength value="1"/>
                    </xs:restriction>
                  </xs:simpleType>
                </xs:attribute>
                <xs:attribute name="Type" use="required">
                  <xs:annotation>
                    <xs:documentation>InvalidDomain allows you to specify that a particular Fault Domain is invalid for this workload. RequiredDomain requires that all of the replicas be present in the specified domain. Multiple required domains can be specified. PreferredPrimaryDomain specifies the preferred Fault Domain for primary replicas. Useful in geographically spanned clusters where you are using other locations for redundancy, but would prefer that the primary replicas be placed in a certain location in order to provider lower latency for operations which go to the primary. RequiredDomainDistribution specifies that replicas are required to be distributed among the available fault domains. NonPartiallyPlace controls if the service replicas will be partially place if not all of them can be placed. </xs:documentation>
                  </xs:annotation>
                  <xs:simpleType>
                    <xs:restriction base="xs:string">
                      <xs:enumeration value="InvalidDomain"/>
                      <xs:enumeration value="RequiredDomain"/>
                      <xs:enumeration value="PreferredPrimaryDomain"/>
                      <xs:enumeration value="RequiredDomainDistribution"/>
                      <xs:enumeration value="NonPartiallyPlace"/>
                    </xs:restriction>
                  </xs:simpleType>
                </xs:attribute>
              </xs:complexType>
            </xs:element>
          
```

### Attribute details

#### DomainName
Documentation: The fault domain where the service should or should not be placed, depending on the Type value.
name: DomainName

#### Type
Documentation: InvalidDomain allows you to specify that a particular Fault Domain is invalid for this workload. RequiredDomain requires that all of the replicas be present in the specified domain. Multiple required domains can be specified. PreferredPrimaryDomain specifies the preferred Fault Domain for primary replicas. Useful in geographically spanned clusters where you are using other locations for redundancy, but would prefer that the primary replicas be placed in a certain location in order to provider lower latency for operations which go to the primary. RequiredDomainDistribution specifies that replicas are required to be distributed among the available fault domains. NonPartiallyPlace controls if the service replicas will be partially place if not all of them can be placed. 
name: Type
use: required

## None Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|ref|Extensions|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Extensions" minOccurs="0"/>
    
```


## LoadMetrics Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LoadMetrics|
|minOccurs|0|
|documentation|Load metrics reported by this service.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetrics" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Load metrics reported by this service.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      
```


### Content element details

#### LoadMetric
name: LoadMetric
type: LoadMetricType
maxOccurs: unbounded

Documentation: 

## LoadMetric Element
|---|---|
|type|[LoadMetricType](#loadmetrictype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LoadMetric|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
          
```


## PlacementConstraints Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|PlacementConstraints|
|minOccurs|0|
|documentation|Constraints for the placement of services that are part of this package.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PlacementConstraints" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Constraints for the placement of services that are part of this package.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## ServiceGroupMembers Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ServiceGroupMembers|
|minOccurs|0|
|maxOccurs|1|
|documentation|Member types of this service group type.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceGroupMembers" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Member types of this service group type.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element ref="ServiceGroupTypeMember" minOccurs="1" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      
```


### Content element details

#### None
ref: ServiceGroupTypeMember
minOccurs: 1
maxOccurs: unbounded

Documentation: 

## None Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|ref|ServiceGroupTypeMember|
|minOccurs|1|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="ServiceGroupTypeMember" minOccurs="1" maxOccurs="unbounded"/>
          
```


## None Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|ref|Extensions|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Extensions" minOccurs="0"/>
    
```


## ServiceGroupTypeMember Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 1 attribute(s)|
|name|ServiceGroupTypeMember|
|documentation|Describes the member type of the service group.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceGroupTypeMember">
    <xs:annotation>
      <xs:documentation>Describes the member type of the service group.</xs:documentation>
    </xs:annotation>
    <xs:complexType>
      <xs:sequence>
        <xs:element name="LoadMetrics" minOccurs="0">
          <xs:annotation>
            <xs:documentation>Load metrics reported by this service, used for resource balancing services.</xs:documentation>
          </xs:annotation>
          <xs:complexType>
            <xs:sequence>
              <xs:element name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
      <xs:attribute name="ServiceTypeName" use="required">
        <xs:annotation>
          <xs:documentation>User defined type identifier for a Microsoft Azure Service Fabric ServiceGroup Member, .e.g Actor</xs:documentation>
        </xs:annotation>
        <xs:simpleType>
          <xs:restriction base="xs:string">
            <xs:minLength value="1"/>
          </xs:restriction>
        </xs:simpleType>
      </xs:attribute>
    </xs:complexType>
  </xs:element>
  
```

### Attribute details

#### ServiceTypeName
Documentation: User defined type identifier for a Microsoft Azure Service Fabric ServiceGroup Member, .e.g Actor
name: ServiceTypeName
use: required

### Content element details

#### LoadMetrics
name: LoadMetrics
minOccurs: 0

Documentation: Load metrics reported by this service, used for resource balancing services.

## LoadMetrics Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LoadMetrics|
|minOccurs|0|
|documentation|Load metrics reported by this service, used for resource balancing services.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetrics" minOccurs="0">
          <xs:annotation>
            <xs:documentation>Load metrics reported by this service, used for resource balancing services.</xs:documentation>
          </xs:annotation>
          <xs:complexType>
            <xs:sequence>
              <xs:element name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      
```


### Content element details

#### LoadMetric
name: LoadMetric
type: LoadMetricType
maxOccurs: unbounded

Documentation: 

## LoadMetric Element
|---|---|
|type|[LoadMetricType](#loadmetrictype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LoadMetric|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
            
```


## Extension Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|Extension|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Extension" minOccurs="0" maxOccurs="unbounded">
        <xs:complexType>
          <xs:sequence>
            <xs:any namespace="##other" processContents="lax"/>
          </xs:sequence>
          <xs:attribute name="Name" use="required">
            <xs:simpleType>
              <xs:restriction base="xs:string">
                <xs:minLength value="1"/>
              </xs:restriction>
            </xs:simpleType>
          </xs:attribute>
          <xs:attribute name="GeneratedId" type="xs:string" use="optional"/>
        </xs:complexType>
      </xs:element>
    
```

### Attribute details

#### Name
Documentation: 
name: Name
use: required

#### GeneratedId
Documentation: 
name: GeneratedId
type: xs:string
use: optional

## Extensions Element
|---|---|
|type|[ExtensionsType](#extensionstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Extensions|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Extensions" type="ExtensionsType"/>
  
```


## Property Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|Property|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Property" minOccurs="0" maxOccurs="unbounded">
        <xs:complexType>
          <xs:attribute name="Name" type="xs:string" use="required"/>
          <xs:attribute name="Value" type="xs:string" use="required"/>
        </xs:complexType>
      </xs:element>
    
```

### Attribute details

#### Name
Documentation: 
name: Name
type: xs:string
use: required

#### Value
Documentation: 
name: Value
type: xs:string
use: required

## PersistencePolicy Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 4 attribute(s)|
|name|PersistencePolicy|
|documentation|Persistence Policy extension for the Service Type|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PersistencePolicy">
    <xs:annotation>
      <xs:documentation>Persistence Policy extension for the Service Type</xs:documentation>
    </xs:annotation>
    <xs:complexType>
      <xs:sequence>
        <xs:element name="Properties" type="ServiceTypeExtensionPolicyPropertiesType" minOccurs="0"/>
      </xs:sequence>
      <xs:attribute name="Name" type="xs:string" use="required"/>
      <xs:attribute name="Mode" use="required">
        <xs:simpleType>
          <xs:restriction base="xs:string">
            <xs:enumeration value="Synchronous"/>
            <xs:enumeration value="Asynchronous"/>
          </xs:restriction>
        </xs:simpleType>
      </xs:attribute>
      <xs:attribute name="WriteBehind" type="xs:string" use="required"/>
      <xs:attribute name="Provider" type="xs:string" use="required"/>
    </xs:complexType>
  </xs:element>
  
```

### Attribute details

#### Name
Documentation: 
name: Name
type: xs:string
use: required

#### Mode
Documentation: 
name: Mode
use: required

#### WriteBehind
Documentation: 
name: WriteBehind
type: xs:string
use: required

#### Provider
Documentation: 
name: Provider
type: xs:string
use: required

### Content element details

#### Properties
name: Properties
type: ServiceTypeExtensionPolicyPropertiesType
minOccurs: 0

Documentation: 

## Properties Element
|---|---|
|type|[ServiceTypeExtensionPolicyPropertiesType](#servicetypeextensionpolicypropertiestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Properties|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Properties" type="ServiceTypeExtensionPolicyPropertiesType" minOccurs="0"/>
      
```


## EvictionPolicy Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 2 attribute(s)|
|name|EvictionPolicy|
|documentation|Eviction Policy extension for the Service Type.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EvictionPolicy">
    <xs:annotation>
      <xs:documentation>Eviction Policy extension for the Service Type.</xs:documentation>
    </xs:annotation>
    <xs:complexType>
      <xs:sequence>
        <xs:element name="Properties" type="ServiceTypeExtensionPolicyPropertiesType" minOccurs="0"/>
      </xs:sequence>
      <xs:attribute name="Name" type="xs:string" use="required"/>
      <xs:attribute name="Provider" type="xs:string" use="required"/>
    </xs:complexType>
  </xs:element>
  
```

### Attribute details

#### Name
Documentation: 
name: Name
type: xs:string
use: required

#### Provider
Documentation: 
name: Provider
type: xs:string
use: required

### Content element details

#### Properties
name: Properties
type: ServiceTypeExtensionPolicyPropertiesType
minOccurs: 0

Documentation: 

## Properties Element
|---|---|
|type|[ServiceTypeExtensionPolicyPropertiesType](#servicetypeextensionpolicypropertiestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Properties|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Properties" type="ServiceTypeExtensionPolicyPropertiesType" minOccurs="0"/>
      
```


## SetupEntryPoint Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|SetupEntryPoint|
|minOccurs|0|
|documentation|A privileged entry point that runs with the same credentials as Service Fabric (typically the LocalSystem account) before any other entry point. The executable specified by EntryPoint is typically the long-running service host. The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SetupEntryPoint" minOccurs="0">
        <xs:annotation>
          <xs:documentation>A privileged entry point that runs with the same credentials as Service Fabric (typically the LocalSystem account) before any other entry point. The executable specified by EntryPoint is typically the long-running service host. The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="ExeHost" type="ExeHostEntryPointType"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      
```


### Content element details

#### ExeHost
name: ExeHost
type: ExeHostEntryPointType

Documentation: 

## ExeHost Element
|---|---|
|type|[ExeHostEntryPointType](#exehostentrypointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ExeHost|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ExeHost" type="ExeHostEntryPointType"/>
          
```


## EntryPoint Element
|---|---|
|type|[EntryPointDescriptionType](#entrypointdescriptiontype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EntryPoint|
|minOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EntryPoint" type="EntryPointDescriptionType" minOccurs="1"/>
      
```


## EnvironmentVariables Element
|---|---|
|type|[EnvironmentVariablesType](#environmentvariablestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EnvironmentVariables|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentVariables" type="EnvironmentVariablesType" minOccurs="0" maxOccurs="1"/>

    
```


## Endpoints Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Endpoints|
|minOccurs|0|
|documentation|Defines endpoints for the service.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoints" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Defines endpoints for the service.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Endpoint" type="EndpointType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    
```


### Content element details

#### Endpoint
name: Endpoint
type: EndpointType
maxOccurs: unbounded

Documentation: 

## Endpoint Element
|---|---|
|type|[EndpointType](#endpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Endpoint|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoint" type="EndpointType" maxOccurs="unbounded"/>
          
```


## ETW Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|ETW|
|minOccurs|0|
|documentation|Describes the ETW settings for the components of this service manifest.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ETW" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Describes the ETW settings for the components of this service manifest.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="ProviderGuids" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Lists the ETW provider GUIDs for the components of this service manifest.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="ProviderGuid" minOccurs="0" maxOccurs="unbounded">
                    <xs:complexType>
                      <xs:attribute name="Value" use="required">
                        <xs:simpleType>
                          <xs:restriction base="xs:string">
                            <xs:pattern value="[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}"/>
                          </xs:restriction>
                        </xs:simpleType>
                      </xs:attribute>
                    </xs:complexType>
                  </xs:element>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            <xs:element name="ManifestDataPackages" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Lists the data packages containing ETW manifests for the components of this service manifest. The data package containing ETW manifests should not contain any other files. </xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="ManifestDataPackage" type="DataPackageType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    
```


### Content element details

#### ProviderGuids
name: ProviderGuids
minOccurs: 0

Documentation: Lists the ETW provider GUIDs for the components of this service manifest.

#### ManifestDataPackages
name: ManifestDataPackages
minOccurs: 0

Documentation: Lists the data packages containing ETW manifests for the components of this service manifest. The data package containing ETW manifests should not contain any other files. 

## ProviderGuids Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ProviderGuids|
|minOccurs|0|
|documentation|Lists the ETW provider GUIDs for the components of this service manifest.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ProviderGuids" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Lists the ETW provider GUIDs for the components of this service manifest.</xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="ProviderGuid" minOccurs="0" maxOccurs="unbounded">
                    <xs:complexType>
                      <xs:attribute name="Value" use="required">
                        <xs:simpleType>
                          <xs:restriction base="xs:string">
                            <xs:pattern value="[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}"/>
                          </xs:restriction>
                        </xs:simpleType>
                      </xs:attribute>
                    </xs:complexType>
                  </xs:element>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            
```


### Content element details

#### ProviderGuid
name: ProviderGuid
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## ProviderGuid Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|ProviderGuid|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ProviderGuid" minOccurs="0" maxOccurs="unbounded">
                    <xs:complexType>
                      <xs:attribute name="Value" use="required">
                        <xs:simpleType>
                          <xs:restriction base="xs:string">
                            <xs:pattern value="[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}"/>
                          </xs:restriction>
                        </xs:simpleType>
                      </xs:attribute>
                    </xs:complexType>
                  </xs:element>
                
```

### Attribute details

#### Value
Documentation: 
name: Value
use: required

## ManifestDataPackages Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ManifestDataPackages|
|minOccurs|0|
|documentation|Lists the data packages containing ETW manifests for the components of this service manifest. The data package containing ETW manifests should not contain any other files. |

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ManifestDataPackages" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Lists the data packages containing ETW manifests for the components of this service manifest. The data package containing ETW manifests should not contain any other files. </xs:documentation>
              </xs:annotation>
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="ManifestDataPackage" type="DataPackageType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
          
```


### Content element details

#### ManifestDataPackage
name: ManifestDataPackage
type: DataPackageType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## ManifestDataPackage Element
|---|---|
|type|[DataPackageType](#datapackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ManifestDataPackage|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ManifestDataPackage" type="DataPackageType" minOccurs="0" maxOccurs="unbounded"/>
                
```


## ContainerEntryPoint Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|ContainerEntryPoint|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|Overidden entrypoint for containers so debugger can be launched..|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerEntryPoint" type="xs:string" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Overidden entrypoint for containers so debugger can be launched..</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## ContainerMountedVolume Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|ContainerMountedVolume|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|Volumes to be mounted inside container.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerMountedVolume" type="xs:string" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Volumes to be mounted inside container.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## ContainerEnvironmentBlock Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|ContainerEnvironmentBlock|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|EnvironmentBlock for containers.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerEnvironmentBlock" type="xs:string" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>EnvironmentBlock for containers.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```


## UnmanagedDll Element
|---|---|
|type|[UnmanagedDllType](#unmanageddlltype-type)|
|content|0 element(s), 0 attribute(s)|
|name|UnmanagedDll|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UnmanagedDll" type="UnmanagedDllType"/>
        
```


## ManagedAssembly Element
|---|---|
|type|[ManagedAssemblyType](#managedassemblytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ManagedAssembly|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ManagedAssembly" type="ManagedAssemblyType"/>
      
```


## Program Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|Program|
|documentation|The executable name.  For example, "MySetup.bat" or "MyServiceHost.exe".|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Program" type="xs:string">
        <xs:annotation>
          <xs:documentation>The executable name.  For example, "MySetup.bat" or "MyServiceHost.exe".</xs:documentation>
        </xs:annotation></xs:element>
      
```


## Arguments Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|Arguments|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Arguments" type="xs:string" minOccurs="0"/>
      
```


## WorkingFolder Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|WorkingFolder|
|default|Work|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="WorkingFolder" default="Work" minOccurs="0">
        <xs:simpleType>
          <xs:restriction base="xs:string">
            <xs:enumeration value="Work"/>
            <xs:enumeration value="CodePackage"/>
            <xs:enumeration value="CodeBase"/>
          </xs:restriction>
        </xs:simpleType>
      </xs:element>
      
```


## ConsoleRedirection Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|ConsoleRedirection|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConsoleRedirection" minOccurs="0">
        <xs:complexType>
          <xs:attribute name="FileRetentionCount" default="2">
            <xs:simpleType>
              <xs:restriction base="xs:int">
                <xs:minInclusive value="1"/>
              </xs:restriction>
            </xs:simpleType>
          </xs:attribute>
          <xs:attribute name="FileMaxSizeInKb" default="20480">
            <xs:simpleType>
              <xs:restriction base="xs:int">
                <xs:minInclusive value="128"/>
              </xs:restriction>
            </xs:simpleType>
          </xs:attribute>
        </xs:complexType>
      </xs:element>
    
```

### Attribute details

#### FileRetentionCount
Documentation: 
name: FileRetentionCount
default: 2

#### FileMaxSizeInKb
Documentation: 
name: FileMaxSizeInKb
default: 20480

## ImageName Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|ImageName|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ImageName" type="xs:string"/>
      
```


## Commands Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|Commands|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Commands" type="xs:string" minOccurs="0" maxOccurs="1"/>
      
```


## EntryPoint Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|EntryPoint|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EntryPoint" type="xs:string" minOccurs="0" maxOccurs="1"/>
      
```


## FromSource Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|FromSource|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FromSource" type="xs:string" minOccurs="0" maxOccurs="1"/>
    
```


## ExeHost Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|ExeHost|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ExeHost">
          <xs:complexType>
            <xs:complexContent>
              <xs:extension base="ExeHostEntryPointType">
                <xs:sequence>
                  <xs:element name="RunFrequency" minOccurs="0">
                    <xs:complexType>
                      <xs:attribute name="IntervalInSeconds" use="required">
                        <xs:simpleType>
                          <xs:restriction base="xs:int">
                            <xs:minInclusive value="0"/>
                            <xs:maxInclusive value="2147483647"/>
                          </xs:restriction>
                        </xs:simpleType>
                      </xs:attribute>
                    </xs:complexType>
                  </xs:element>
                </xs:sequence>
              </xs:extension>
            </xs:complexContent>
          </xs:complexType>
        </xs:element>
        
```


## RunFrequency Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|RunFrequency|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RunFrequency" minOccurs="0">
                    <xs:complexType>
                      <xs:attribute name="IntervalInSeconds" use="required">
                        <xs:simpleType>
                          <xs:restriction base="xs:int">
                            <xs:minInclusive value="0"/>
                            <xs:maxInclusive value="2147483647"/>
                          </xs:restriction>
                        </xs:simpleType>
                      </xs:attribute>
                    </xs:complexType>
                  </xs:element>
                
```

### Attribute details

#### IntervalInSeconds
Documentation: 
name: IntervalInSeconds
use: required

## DllHost Element
|---|---|
|type|[DllHostEntryPointType](#dllhostentrypointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DllHost|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DllHost" type="DllHostEntryPointType"/>
        
```


## ContainerHost Element
|---|---|
|type|[ContainerHostEntryPointType](#containerhostentrypointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ContainerHost|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerHost" type="ContainerHostEntryPointType"/>
      
```


## DefaultServiceTypeHealthPolicy Element
|---|---|
|type|[ServiceTypeHealthPolicyType](#servicetypehealthpolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DefaultServiceTypeHealthPolicy|
|minOccurs|0|
|documentation|Specifies the default service type health policy, which will replace the default health policy for all service types in the application.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultServiceTypeHealthPolicy" type="ServiceTypeHealthPolicyType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies the default service type health policy, which will replace the default health policy for all service types in the application.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## ServiceTypeHealthPolicy Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|ServiceTypeHealthPolicy|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|Describes the policy for evaluating health events reported on services, partitions and replicas of a particular service type.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypeHealthPolicy" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Describes the policy for evaluating health events reported on services, partitions and replicas of a particular service type.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:complexContent>
            <xs:extension base="ServiceTypeHealthPolicyType">
              <xs:attribute name="ServiceTypeName" type="xs:string" use="required">
                <xs:annotation>
                  <xs:documentation>The name of the service type that the policy will be applied to.</xs:documentation>
                </xs:annotation>
              </xs:attribute>
            </xs:extension>
          </xs:complexContent>
        </xs:complexType>
      </xs:element>
    
```


## Section Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 1 attribute(s)|
|name|Section|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation|A user defined named section.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Section" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>A user defined named section.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Parameter" minOccurs="0" maxOccurs="unbounded">
              <xs:complexType>
                <xs:attribute name="Name" type="xs:string" use="required"/>
                <xs:attribute name="Value" type="xs:string" use="required"/>
                <xs:attribute name="MustOverride" type="xs:boolean" default="false">
                  <xs:annotation>
                    <xs:documentation>If true, the value of this parameter must be overridden by higher level configuration.</xs:documentation>
                  </xs:annotation>
                </xs:attribute>
                <xs:attribute name="IsEncrypted" type="xs:boolean" default="false">
                  <xs:annotation>
                    <xs:documentation>If true, the value of this parameter is encrypted.</xs:documentation>
                  </xs:annotation>
                </xs:attribute>
              </xs:complexType>
            </xs:element>
          </xs:sequence>
          <xs:attribute name="Name" type="xs:string" use="required"/>
        </xs:complexType>
      </xs:element>
    
```

### Attribute details

#### Name
Documentation: 
name: Name
type: xs:string
use: required

### Content element details

#### Parameter
name: Parameter
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## Parameter Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 4 attribute(s)|
|name|Parameter|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameter" minOccurs="0" maxOccurs="unbounded">
              <xs:complexType>
                <xs:attribute name="Name" type="xs:string" use="required"/>
                <xs:attribute name="Value" type="xs:string" use="required"/>
                <xs:attribute name="MustOverride" type="xs:boolean" default="false">
                  <xs:annotation>
                    <xs:documentation>If true, the value of this parameter must be overridden by higher level configuration.</xs:documentation>
                  </xs:annotation>
                </xs:attribute>
                <xs:attribute name="IsEncrypted" type="xs:boolean" default="false">
                  <xs:annotation>
                    <xs:documentation>If true, the value of this parameter is encrypted.</xs:documentation>
                  </xs:annotation>
                </xs:attribute>
              </xs:complexType>
            </xs:element>
          
```

### Attribute details

#### Name
Documentation: 
name: Name
type: xs:string
use: required

#### Value
Documentation: 
name: Value
type: xs:string
use: required

#### MustOverride
Documentation: If true, the value of this parameter must be overridden by higher level configuration.
name: MustOverride
type: xs:boolean
default: false

#### IsEncrypted
Documentation: If true, the value of this parameter is encrypted.
name: IsEncrypted
type: xs:boolean
default: false

## ApplicationInstance Element
|---|---|
|type|[ApplicationInstanceType](#applicationinstancetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ApplicationInstance|
|documentation|Describes an instance of a Microsoft Azure Service Fabric application.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationInstance" type="ApplicationInstanceType">
    <xs:annotation>
      <xs:documentation>Describes an instance of a Microsoft Azure Service Fabric application.</xs:documentation>
    </xs:annotation>
  </xs:element>
  
```


## ApplicationPackageRef Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|ApplicationPackageRef|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationPackageRef">
        <xs:complexType>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
        </xs:complexType>
      </xs:element>
      
```


## ServicePackageRef Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|ServicePackageRef|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageRef" maxOccurs="unbounded">
        <xs:complexType>
          <xs:attribute name="Name" use="required"/>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
        </xs:complexType>
      </xs:element>
      
```

### Attribute details

#### Name
Documentation: 
name: Name
use: required

## ServiceTemplates Element
|---|---|
|type|[ServiceTemplatesType](#servicetemplatestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceTemplates|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTemplates" type="ServiceTemplatesType"/>
      
```


## DefaultServices Element
|---|---|
|type|[DefaultServicesType](#defaultservicestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DefaultServices|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultServices" type="DefaultServicesType"/>
    
```


## ApplicationPackage Element
|---|---|
|type|[ApplicationPackageType](#applicationpackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ApplicationPackage|
|documentation|ApplicationPackage represents the versioned Application information required by the node.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationPackage" type="ApplicationPackageType">
    <xs:annotation>
      <xs:documentation>ApplicationPackage represents the versioned Application information required by the node.</xs:documentation>
    </xs:annotation>
  </xs:element>
  
```


## DigestedEnvironment Element
|---|---|
|type|[EnvironmentType](#environmenttype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DigestedEnvironment|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedEnvironment" type="EnvironmentType"/>
      
```


## DigestedCertificates Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|DigestedCertificates|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedCertificates">
        <xs:complexType>
          <xs:sequence maxOccurs="unbounded">
            <xs:element name="SecretsCertificate" type="FabricCertificateType" minOccurs="0"/>
            <xs:element name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0"/>
          </xs:sequence>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
        </xs:complexType>
      </xs:element>
    
```


### Content element details

#### SecretsCertificate
name: SecretsCertificate
type: FabricCertificateType
minOccurs: 0

Documentation: 

#### EndpointCertificate
name: EndpointCertificate
type: EndpointCertificateType
minOccurs: 0

Documentation: 

## SecretsCertificate Element
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecretsCertificate|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecretsCertificate" type="FabricCertificateType" minOccurs="0"/>
            
```


## EndpointCertificate Element
|---|---|
|type|[EndpointCertificateType](#endpointcertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EndpointCertificate|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0"/>
          
```


## ServicePackage Element
|---|---|
|type|[ServicePackageType](#servicepackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServicePackage|
|documentation|ServicePackage represents a versioned unit of deployment and activation. The version of the ServicePackage is determined based on the manifest version and the version of the overrides.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackage" type="ServicePackageType">
    <xs:annotation>
      <xs:documentation>ServicePackage represents a versioned unit of deployment and activation. The version of the ServicePackage is determined based on the manifest version and the version of the overrides.</xs:documentation>
    </xs:annotation>
  </xs:element>
  
```


## Description Element
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|Description|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Description" type="xs:string" minOccurs="0"/>
      
```


## ServicePackageResourceGovernancePolicy Element
|---|---|
|type|[ServicePackageResourceGovernancePolicyType](#servicepackageresourcegovernancepolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServicePackageResourceGovernancePolicy|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageResourceGovernancePolicy" type="ServicePackageResourceGovernancePolicyType" minOccurs="0" maxOccurs="1"/>
      
```


## DigestedServiceTypes Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|DigestedServiceTypes|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedServiceTypes">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="ServiceTypes" type="ServiceTypesType"/>
          </xs:sequence>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
        </xs:complexType>
      </xs:element>
      
```


### Content element details

#### ServiceTypes
name: ServiceTypes
type: ServiceTypesType

Documentation: 

## ServiceTypes Element
|---|---|
|type|[ServiceTypesType](#servicetypestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceTypes|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypes" type="ServiceTypesType"/>
          
```


## DigestedCodePackage Element
|---|---|
|type|anonymous complexType|
|content|5 element(s), 2 attribute(s)|
|name|DigestedCodePackage|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedCodePackage" maxOccurs="unbounded">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="CodePackage" type="CodePackageType"/>
            <xs:element name="RunAsPolicy" type="RunAsPolicyType" minOccurs="0" maxOccurs="2"/>
            <xs:element name="DebugParameters" type="DebugParametersType" minOccurs="0" maxOccurs="1"/>
            <xs:element name="ContainerHostPolicies" type="ContainerHostPoliciesType" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Specifies policies for activating container hosts.</xs:documentation>
              </xs:annotation>
            </xs:element>
            <xs:element name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Specifies resource limits for codepackage.</xs:documentation>
              </xs:annotation>
            </xs:element>
          </xs:sequence>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
          <xs:attribute name="ContentChecksum" type="xs:string"/>
          <xs:attribute name="IsShared" type="xs:boolean"/>
        </xs:complexType>
      </xs:element>
      
```

### Attribute details

#### ContentChecksum
Documentation: 
name: ContentChecksum
type: xs:string

#### IsShared
Documentation: 
name: IsShared
type: xs:boolean

### Content element details

#### CodePackage
name: CodePackage
type: CodePackageType

Documentation: 

#### RunAsPolicy
name: RunAsPolicy
type: RunAsPolicyType
minOccurs: 0
maxOccurs: 2

Documentation: 

#### DebugParameters
name: DebugParameters
type: DebugParametersType
minOccurs: 0
maxOccurs: 1

Documentation: 

#### ContainerHostPolicies
name: ContainerHostPolicies
type: ContainerHostPoliciesType
minOccurs: 0

Documentation: Specifies policies for activating container hosts.

#### ResourceGovernancePolicy
name: ResourceGovernancePolicy
type: ResourceGovernancePolicyType
minOccurs: 0

Documentation: Specifies resource limits for codepackage.

## CodePackage Element
|---|---|
|type|[CodePackageType](#codepackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|CodePackage|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackage" type="CodePackageType"/>
            
```


## RunAsPolicy Element
|---|---|
|type|[RunAsPolicyType](#runaspolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|RunAsPolicy|
|minOccurs|0|
|maxOccurs|2|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RunAsPolicy" type="RunAsPolicyType" minOccurs="0" maxOccurs="2"/>
            
```


## DebugParameters Element
|---|---|
|type|[DebugParametersType](#debugparameterstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DebugParameters|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DebugParameters" type="DebugParametersType" minOccurs="0" maxOccurs="1"/>
            
```


## ContainerHostPolicies Element
|---|---|
|type|[ContainerHostPoliciesType](#containerhostpoliciestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ContainerHostPolicies|
|minOccurs|0|
|documentation|Specifies policies for activating container hosts.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerHostPolicies" type="ContainerHostPoliciesType" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Specifies policies for activating container hosts.</xs:documentation>
              </xs:annotation>
            </xs:element>
            
```


## ResourceGovernancePolicy Element
|---|---|
|type|[ResourceGovernancePolicyType](#resourcegovernancepolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ResourceGovernancePolicy|
|minOccurs|0|
|documentation|Specifies resource limits for codepackage.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Specifies resource limits for codepackage.</xs:documentation>
              </xs:annotation>
            </xs:element>
          
```


## DigestedConfigPackage Element
|---|---|
|type|anonymous complexType|
|content|3 element(s), 2 attribute(s)|
|name|DigestedConfigPackage|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedConfigPackage" minOccurs="0" maxOccurs="unbounded">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="ConfigPackage" type="ConfigPackageType"/>
            <xs:element name="ConfigOverride" type="ConfigOverrideType" minOccurs="0"/>
            <xs:element name="DebugParameters" type="DebugParametersType" minOccurs="0" maxOccurs="1"/>
          </xs:sequence>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
          <xs:attribute name="ContentChecksum" type="xs:string"/>
          <xs:attribute name="IsShared" type="xs:boolean"/>
        </xs:complexType>
      </xs:element>
      
```

### Attribute details

#### ContentChecksum
Documentation: 
name: ContentChecksum
type: xs:string

#### IsShared
Documentation: 
name: IsShared
type: xs:boolean

### Content element details

#### ConfigPackage
name: ConfigPackage
type: ConfigPackageType

Documentation: 

#### ConfigOverride
name: ConfigOverride
type: ConfigOverrideType
minOccurs: 0

Documentation: 

#### DebugParameters
name: DebugParameters
type: DebugParametersType
minOccurs: 0
maxOccurs: 1

Documentation: 

## ConfigPackage Element
|---|---|
|type|[ConfigPackageType](#configpackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ConfigPackage|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigPackage" type="ConfigPackageType"/>
            
```


## ConfigOverride Element
|---|---|
|type|[ConfigOverrideType](#configoverridetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ConfigOverride|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigOverride" type="ConfigOverrideType" minOccurs="0"/>
            
```


## DebugParameters Element
|---|---|
|type|[DebugParametersType](#debugparameterstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DebugParameters|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DebugParameters" type="DebugParametersType" minOccurs="0" maxOccurs="1"/>
          
```


## DigestedDataPackage Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 2 attribute(s)|
|name|DigestedDataPackage|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedDataPackage" minOccurs="0" maxOccurs="unbounded">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="DataPackage" type="DataPackageType"/>
            <xs:element name="DebugParameters" type="DebugParametersType" minOccurs="0" maxOccurs="1"/>
          </xs:sequence>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
          <xs:attribute name="ContentChecksum" type="xs:string"/>
          <xs:attribute name="IsShared" type="xs:boolean"/>
        </xs:complexType>
      </xs:element>
      
```

### Attribute details

#### ContentChecksum
Documentation: 
name: ContentChecksum
type: xs:string

#### IsShared
Documentation: 
name: IsShared
type: xs:boolean

### Content element details

#### DataPackage
name: DataPackage
type: DataPackageType

Documentation: 

#### DebugParameters
name: DebugParameters
type: DebugParametersType
minOccurs: 0
maxOccurs: 1

Documentation: 

## DataPackage Element
|---|---|
|type|[DataPackageType](#datapackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DataPackage|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DataPackage" type="DataPackageType"/>
            
```


## DebugParameters Element
|---|---|
|type|[DebugParametersType](#debugparameterstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DebugParameters|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DebugParameters" type="DebugParametersType" minOccurs="0" maxOccurs="1"/>
          
```


## DigestedResources Element
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|DigestedResources|
|minOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedResources" minOccurs="1">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="DigestedEndpoints" minOccurs="0">
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="DigestedEndpoint" minOccurs="0" maxOccurs="unbounded">
                    <xs:complexType>
                      <xs:sequence>
                        <xs:element name="Endpoint" type="EndpointType"/>
                        <xs:element name="SecurityAccessPolicy" type="SecurityAccessPolicyType" minOccurs="0"/>
                        <xs:element name="EndpointBindingPolicy" type="EndpointBindingPolicyType" minOccurs="0"/>
                        <xs:element name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0" maxOccurs="1"/>
                      </xs:sequence>
                    </xs:complexType>
                  </xs:element>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            <xs:element name="DigestedCertificates" minOccurs="0" maxOccurs="1">
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
          </xs:sequence>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
        </xs:complexType>
      </xs:element>
      
```


### Content element details

#### DigestedEndpoints
name: DigestedEndpoints
minOccurs: 0

Documentation: 

#### DigestedCertificates
name: DigestedCertificates
minOccurs: 0
maxOccurs: 1

Documentation: 

## DigestedEndpoints Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|DigestedEndpoints|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedEndpoints" minOccurs="0">
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="DigestedEndpoint" minOccurs="0" maxOccurs="unbounded">
                    <xs:complexType>
                      <xs:sequence>
                        <xs:element name="Endpoint" type="EndpointType"/>
                        <xs:element name="SecurityAccessPolicy" type="SecurityAccessPolicyType" minOccurs="0"/>
                        <xs:element name="EndpointBindingPolicy" type="EndpointBindingPolicyType" minOccurs="0"/>
                        <xs:element name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0" maxOccurs="1"/>
                      </xs:sequence>
                    </xs:complexType>
                  </xs:element>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            
```


### Content element details

#### DigestedEndpoint
name: DigestedEndpoint
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## DigestedEndpoint Element
|---|---|
|type|anonymous complexType|
|content|4 element(s), 0 attribute(s)|
|name|DigestedEndpoint|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedEndpoint" minOccurs="0" maxOccurs="unbounded">
                    <xs:complexType>
                      <xs:sequence>
                        <xs:element name="Endpoint" type="EndpointType"/>
                        <xs:element name="SecurityAccessPolicy" type="SecurityAccessPolicyType" minOccurs="0"/>
                        <xs:element name="EndpointBindingPolicy" type="EndpointBindingPolicyType" minOccurs="0"/>
                        <xs:element name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0" maxOccurs="1"/>
                      </xs:sequence>
                    </xs:complexType>
                  </xs:element>
                
```


### Content element details

#### Endpoint
name: Endpoint
type: EndpointType

Documentation: 

#### SecurityAccessPolicy
name: SecurityAccessPolicy
type: SecurityAccessPolicyType
minOccurs: 0

Documentation: 

#### EndpointBindingPolicy
name: EndpointBindingPolicy
type: EndpointBindingPolicyType
minOccurs: 0

Documentation: 

#### ResourceGovernancePolicy
name: ResourceGovernancePolicy
type: ResourceGovernancePolicyType
minOccurs: 0
maxOccurs: 1

Documentation: 

## Endpoint Element
|---|---|
|type|[EndpointType](#endpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Endpoint|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoint" type="EndpointType"/>
                        
```


## SecurityAccessPolicy Element
|---|---|
|type|[SecurityAccessPolicyType](#securityaccesspolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecurityAccessPolicy|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityAccessPolicy" type="SecurityAccessPolicyType" minOccurs="0"/>
                        
```


## EndpointBindingPolicy Element
|---|---|
|type|[EndpointBindingPolicyType](#endpointbindingpolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EndpointBindingPolicy|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointBindingPolicy" type="EndpointBindingPolicyType" minOccurs="0"/>
                        
```


## ResourceGovernancePolicy Element
|---|---|
|type|[ResourceGovernancePolicyType](#resourcegovernancepolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ResourceGovernancePolicy|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0" maxOccurs="1"/>
                      
```


## DigestedCertificates Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|DigestedCertificates|
|minOccurs|0|
|maxOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedCertificates" minOccurs="0" maxOccurs="1">
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
          
```


### Content element details

#### EndpointCertificate
name: EndpointCertificate
type: EndpointCertificateType
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## EndpointCertificate Element
|---|---|
|type|[EndpointCertificateType](#endpointcertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EndpointCertificate|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0" maxOccurs="unbounded"/>
                
```


## Diagnostics Element
|---|---|
|type|[ServiceDiagnosticsType](#servicediagnosticstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Diagnostics|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Diagnostics" type="ServiceDiagnosticsType"/>
    
```


## ClusterCertificate Element
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ClusterCertificate|
|minOccurs|0|
|documentation|The certificate used to secure the intra cluster communication.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The certificate used to secure the intra cluster communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## ServerCertificate Element
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServerCertificate|
|minOccurs|0|
|documentation|The certificate used to secure the intra cluster communication.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServerCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The certificate used to secure the intra cluster communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## ClientCertificate Element
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ClientCertificate|
|minOccurs|0|
|documentation|The default admin role client certificate used to secure client server communication.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClientCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The default admin role client certificate used to secure client server communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## UserRoleClientCertificate Element
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|UserRoleClientCertificate|
|minOccurs|0|
|documentation|The default user role client certificate used to secure client server communication.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UserRoleClientCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The default user role client certificate used to secure client server communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```


## NodeList Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|NodeList|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeList">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Node" type="InfrastructureNodeType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    
```


### Content element details

#### Node
name: Node
type: InfrastructureNodeType
maxOccurs: unbounded

Documentation: 

## Node Element
|---|---|
|type|[InfrastructureNodeType](#infrastructurenodetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Node|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Node" type="InfrastructureNodeType" maxOccurs="unbounded"/>
          
```


## Endpoints Element
|---|---|
|type|[FabricEndpointsType](#fabricendpointstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Endpoints|
|minOccurs|0|
|documentation|Describe the endpoints associated with this node type|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoints" type="FabricEndpointsType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Describe the endpoints associated with this node type</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```


## Certificates Element
|---|---|
|type|[CertificatesType](#certificatestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Certificates|
|minOccurs|0|
|documentation|Describe the certificates associated with this node type|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Certificates" type="CertificatesType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Describe the certificates associated with this node type</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```


## CurrentInstallation Element
|---|---|
|type|[WindowsFabricDeploymentInformation](#windowsfabricdeploymentinformation-type)|
|content|0 element(s), 0 attribute(s)|
|name|CurrentInstallation|
|minOccurs|0|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CurrentInstallation" type="WindowsFabricDeploymentInformation" minOccurs="0"/>
      
```


## TargetInstallation Element
|---|---|
|type|[WindowsFabricDeploymentInformation](#windowsfabricdeploymentinformation-type)|
|content|0 element(s), 0 attribute(s)|
|name|TargetInstallation|
|minOccurs|1|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="TargetInstallation" type="WindowsFabricDeploymentInformation" minOccurs="1"/>
    
```


## Parameters Element
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Parameters|
|documentation|List of parameters for the application as defined in application manifest and their respective values.|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameters">
        <xs:annotation>
          <xs:documentation>List of parameters for the application as defined in application manifest and their respective values.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Parameter" minOccurs="0" maxOccurs="unbounded">
              <xs:complexType>
                <xs:attributeGroup ref="NameValuePair"/>
              </xs:complexType>
            </xs:element>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    
```


### Content element details

#### Parameter
name: Parameter
minOccurs: 0
maxOccurs: unbounded

Documentation: 

## Parameter Element
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|Parameter|
|minOccurs|0|
|maxOccurs|unbounded|
|documentation||

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameter" minOccurs="0" maxOccurs="unbounded">
              <xs:complexType>
                <xs:attributeGroup ref="NameValuePair"/>
              </xs:complexType>
            </xs:element>
          
```


## ClusterManifestType Type
## WindowsInfrastructureType Type
## LinuxInfrastructureType Type
## FabricCertificateType Type
## EndpointCertificateType Type
## FabricNodeType Type
## LogicalDirectoryType Type
## FabricEndpointsType Type
## FabricKtlLoggerSettingsType Type
## KeyValuePairType Type
## InternalEndpointType Type
## InputEndpointType Type
## ApplicationManifestType Type
## ServiceManifestRefType Type
## ServiceManifestImportPoliciesType Type
## RunAsPolicyType Type
## SecurityAccessPolicyType Type
## ContainerHostPoliciesType Type
## RepositoryCredentialsType Type
## PortBindingType Type
## ContainerCertificateType Type
## ContainerLoggingDriverType Type
## SecurityOptionsType Type
## ContainerVolumeType Type
## DriverOptionType Type
## ContainerNetworkConfigType Type
## EnvironmentOverridesType Type
## EnvironmentVariablesType Type
## EnvironmentVariableType Type
## PackageSharingPolicyType Type
## EndpointBindingPolicyType Type
## ServicePackageResourceGovernancePolicyType Type
## ResourceGovernancePolicyType Type
## ConfigOverrideType Type
## SettingsOverridesType Type
## ServiceTemplatesType Type
## DefaultServicesType Type
## ServiceType Type
## StatelessServiceType Type
## StatefulServiceType Type
## ServiceGroupMemberType Type
## StatelessServiceGroupType Type
## StatefulServiceGroupType Type
## EnvironmentType Type
## SecurityPrincipalsType Type
## ApplicationPoliciesType Type
## ParameterType Type
## ParametersType Type
## LocalStoreType Type
## FileStoreType Type
## AzureStoreBaseType Type
## AzureBlobType Type
## LocalStoreETWType Type
## FileStoreETWType Type
## AzureBlobETWType Type
## DiagnosticsType Type
## ResourceOverridesType Type
## EndpointOverrideType Type
## ServiceManifestType Type
## ServiceAndServiceGroupTypesType Type
## ServiceTypesType Type
## ServiceTypeType Type
## ServiceGroupTypeType Type
## ExtensionsType Type
## ServiceTypeExtensionPolicyPropertiesType Type
## StatefulServiceTypeType Type
## StatelessServiceTypeType Type
## StatefulServiceGroupTypeType Type
## StatelessServiceGroupTypeType Type
## CodePackageType Type
## ConfigPackageType Type
## DataPackageType Type
## ResourcesType Type
## ServiceDiagnosticsType Type
## DebugParametersType Type
## UnmanagedDllType Type
## ManagedAssemblyType Type
## DllHostEntryPointType Type
## ExeHostEntryPointType Type
## ContainerHostEntryPointType Type
## EntryPointDescriptionType Type
## EndpointType Type
## LoadMetricType Type
## ApplicationHealthPolicyType Type
## ServiceTypeHealthPolicyType Type
## SettingsType Type
## ApplicationInstanceType Type
## ApplicationPackageType Type
## ServicePackageType Type
## CertificatesType Type
## AzureRoleType Type
## BlackbirdRoleType Type
## InfrastructureInformationType Type
## InfrastructureNodeType Type
## TargetInformationType Type
## WindowsFabricDeploymentInformation Type
## PaaSRoleType Type
## PaaSVoteType Type
## AppInstanceDefinitionType Type

## AccountCredentialsGroup

### Attributes
      name: AccountName      type: xs:string      use: optional      name: Password      type: xs:string      use: optional## IsEnabled

### Attributes
      name: IsEnabled      type: xs:string## RelativeFolderPath

### Attributes
      name: RelativeFolderPath      type: xs:string      use: required## Path

### Attributes
      name: Path      type: xs:string      use: required## ConnectionString

### Attributes
      name: ConnectionString      type: xs:string      use: required## ContainerName

### Attributes
      name: ContainerName      type: xs:string## UploadIntervalInMinutes

### Attributes
      name: UploadIntervalInMinutes      type: xs:string## DataDeletionAgeInDays

### Attributes
      name: DataDeletionAgeInDays      type: xs:string## LevelFilter

### Attributes
      name: LevelFilter      type: xs:string## VersionedName
Attribute group that includes a Name and a Version.
### Attributes
      name: Name      use: required      name: Version      use: required## ServiceManifestIdentifier
Identifies a service manifest.
### Attributes
      name: ServiceManifestName      use: required      name: ServiceManifestVersion      use: required## ApplicationManifestAttrGroup
Attribute group for application manifest.
### Attributes
      name: ApplicationTypeName      use: required      name: ApplicationTypeVersion      use: required      name: ManifestId      use: optional      default:       type: xs:string## NameValuePair
Name and Value defined as an attribute.
### Attributes
      name: Name      use: required      name: Value      type: xs:string      use: required## ConfigOverridesIdentifier
Identifies configuration overrides for a service package.
### Attributes
      name: ServicePackageName      type: xs:string      use: required      name: RolloutVersion      type: xs:string      use: required## ApplicationInstanceAttrGroup
Attribute group for application instance.
### Attributes
      name: NameUri      type: FabricUri      use: required      name: ApplicationId      type: xs:string      use: required## VersionedItemAttrGroup
Attribute group for versioning sections in ApplicationInstance and ServicePackage documents.
### Attributes
      name: RolloutVersion      type: xs:string      use: required