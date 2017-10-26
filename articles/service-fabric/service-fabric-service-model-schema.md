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

## Application Element
Application Instance specific information like application name and application parameter values used to create application. Parameter values in this file overrides the default parameter values defined in Application Manifest.|

|Attribute|Value|
|---|---|
|type|[AppInstanceDefinitionType](#appinstancedefinitiontype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Application|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Application" type="AppInstanceDefinitionType">
                <xs:annotation>
                        <xs:documentation>Application Instance specific information like application name and application parameter values used to create application. Parameter values in this file overrides the default parameter values defined in Application Manifest.</xs:documentation>
                </xs:annotation>
        </xs:element>
        
```

## ApplicationEndpoints Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|ApplicationEndpoints|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|StartPort|
|type|xs:int|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StartPort" type="xs:int" use="required"/>
          
```

#### EndPort
|Attribute|Value|
|---|---|
|name|EndPort|
|type|xs:int|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndPort" type="xs:int" use="required"/>
        
```


## ApplicationInstance Element
Describes an instance of a Microsoft Azure Service Fabric application.|

|Attribute|Value|
|---|---|
|type|[ApplicationInstanceType](#applicationinstancetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ApplicationInstance|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationInstance" type="ApplicationInstanceType">
    <xs:annotation>
      <xs:documentation>Describes an instance of a Microsoft Azure Service Fabric application.</xs:documentation>
    </xs:annotation>
  </xs:element>
  
```

## ApplicationManifest Element
|Attribute|Value|
|---|---|
|type|[ApplicationManifestType](#applicationmanifesttype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ApplicationManifest|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationManifest" type="ApplicationManifestType"/>
        
```

## ApplicationPackage Element
ApplicationPackage represents the versioned Application information required by the node.|

|Attribute|Value|
|---|---|
|type|[ApplicationPackageType](#applicationpackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ApplicationPackage|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationPackage" type="ApplicationPackageType">
    <xs:annotation>
      <xs:documentation>ApplicationPackage represents the versioned Application information required by the node.</xs:documentation>
    </xs:annotation>
  </xs:element>
  
```

## ApplicationPackageRef Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|ApplicationPackageRef|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationPackageRef">
        <xs:complexType>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
        </xs:complexType>
      </xs:element>
      
```

## Arguments Element
|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|Arguments|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Arguments" type="xs:string" minOccurs="0"/>
      
```

## AzureBlob Element
|Attribute|Value|
|---|---|
|type|[AzureBlobType](#azureblobtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|AzureBlob|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureBlob" type="AzureBlobType" minOccurs="0" maxOccurs="unbounded"/>
                
```

## AzureBlob Element
|Attribute|Value|
|---|---|
|type|[AzureBlobETWType](#azureblobetwtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|AzureBlob|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureBlob" type="AzureBlobETWType" minOccurs="0" maxOccurs="unbounded"/>
                
```

## AzureBlob Element
|Attribute|Value|
|---|---|
|type|[AzureBlobType](#azureblobtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|AzureBlob|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureBlob" type="AzureBlobType" minOccurs="0" maxOccurs="unbounded"/>
                
```

## BackupRestoreServiceReplicatorEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|BackupRestoreServiceReplicatorEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="BackupRestoreServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

## Blackbird Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Blackbird|

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
|Attribute|Value|
|---|---|
|name|Roles|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Roles">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Role" type="BlackbirdRoleType" minOccurs="1" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                
```

## Capacities Element
The capacities of various metrics for this node type|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Capacities|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|Capacity|
|type|KeyValuePairType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Capacity" type="KeyValuePairType" minOccurs="0" maxOccurs="unbounded"/>
                                                                                        
```

## Capacity Element
|Attribute|Value|
|---|---|
|type|[KeyValuePairType](#keyvaluepairtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Capacity|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Capacity" type="KeyValuePairType" minOccurs="0" maxOccurs="unbounded"/>
                                                                                        
```

## CertificateRef Element
Specifies information for a certificate which will be exposed to the container.|

|Attribute|Value|
|---|---|
|type|[ContainerCertificateType](#containercertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|CertificateRef|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CertificateRef" type="ContainerCertificateType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies information for a certificate which will be exposed to the container.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## Certificates Element
Describe the certificates associated with this node type|

|Attribute|Value|
|---|---|
|type|[CertificatesType](#certificatestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Certificates|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Certificates" type="CertificatesType" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the certificates associated with this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                        </xs:element>
                                                                        
```

## Certificates Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Certificates|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|SecretsCertificate|
|type|FabricCertificateType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecretsCertificate" type="FabricCertificateType" minOccurs="0"/>
                                        
```

## Certificates Element
Declares certificates used to secure endpoints or encrypt secrets within the application manifest or a cluster manifest.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|Certificates|
|minOccurs|0|

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
Declares a certificate used to encrypt sensitive information within the application manifest. The application author uses the Invoke-ServiceFabricEncryptSecret cmdlet to encrypt the sensitive information, which is copied to a Parameter in the ConfigOverrides section.
|Attribute|Value|
|---|---|
|name|SecretsCertificate|
|type|FabricCertificateType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecretsCertificate" type="FabricCertificateType" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Declares a certificate used to encrypt sensitive information within the application manifest. The application author uses the Invoke-ServiceFabricEncryptSecret cmdlet to encrypt the sensitive information, which is copied to a Parameter in the ConfigOverrides section.</xs:documentation>
              </xs:annotation>
            </xs:element>
            
```

#### EndpointCertificate
|Attribute|Value|
|---|---|
|name|EndpointCertificate|
|type|EndpointCertificateType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0"/>
          
```

## Certificates Element
Describe the certificates associated with this node type|

|Attribute|Value|
|---|---|
|type|[CertificatesType](#certificatestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Certificates|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Certificates" type="CertificatesType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Describe the certificates associated with this node type</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```

## ClientCertificate Element
The default admin role client certificate used to secure client server communication.|

|Attribute|Value|
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ClientCertificate|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClientCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The default admin role client certificate used to secure client server communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## ClientConnectionEndpoint Element
|Attribute|Value|
|---|---|
|type|[InputEndpointType](#inputendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ClientConnectionEndpoint|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClientConnectionEndpoint" type="InputEndpointType"/>
      
```

## ClusterCertificate Element
The certificate used to secure the intra cluster communication.|

|Attribute|Value|
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ClusterCertificate|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The certificate used to secure the intra cluster communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## ClusterConnectionEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ClusterConnectionEndpoint|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterConnectionEndpoint" type="InternalEndpointType"/>
      
```

## ClusterManagerReplicatorEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ClusterManagerReplicatorEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterManagerReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

## ClusterManifest Element
Describes a Microsoft Azure Service Fabric Cluster.|

|Attribute|Value|
|---|---|
|type|[ClusterManifestType](#clustermanifesttype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ClusterManifest|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterManifest" type="ClusterManifestType">
                <xs:annotation>
                        <xs:documentation>Describes a Microsoft Azure Service Fabric Cluster.</xs:documentation>
                </xs:annotation>
        </xs:element>
        
```

## CodePackage Element
|Attribute|Value|
|---|---|
|type|[CodePackageType](#codepackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|CodePackage|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackage" type="CodePackageType" maxOccurs="unbounded"/>
      
```

## CodePackage Element
|Attribute|Value|
|---|---|
|type|[CodePackageType](#codepackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|CodePackage|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackage" type="CodePackageType"/>
            
```

## Commands Element
|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|Commands|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Commands" type="xs:string" minOccurs="0" maxOccurs="1"/>
      
```

## ConfigOverride Element
|Attribute|Value|
|---|---|
|type|[ConfigOverrideType](#configoverridetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ConfigOverride|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigOverride" type="ConfigOverrideType" minOccurs="0" maxOccurs="unbounded"/>
                
```

## ConfigOverride Element
|Attribute|Value|
|---|---|
|type|[ConfigOverrideType](#configoverridetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ConfigOverride|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigOverride" type="ConfigOverrideType" minOccurs="0"/>
            
```

## ConfigOverrides Element
Describes configuration overrides for the imported service manifest. Configuration overrides allow the flexibility of re-using the same service manifests across multiple application types by overriding the service manifest's configuration only when used with a particular application type. Configuration overrides can change any default configuration in a service manifest as long as default configuration is defined using the Settings.xml in the ConfigPackage folder. |

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ConfigOverrides|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|ConfigOverride|
|type|ConfigOverrideType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigOverride" type="ConfigOverrideType" minOccurs="0" maxOccurs="unbounded"/>
                
```

## ConfigPackage Element
|Attribute|Value|
|---|---|
|type|[ConfigPackageType](#configpackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ConfigPackage|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigPackage" type="ConfigPackageType" minOccurs="0" maxOccurs="unbounded"/>
      
```

## ConfigPackage Element
|Attribute|Value|
|---|---|
|type|[ConfigPackageType](#configpackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ConfigPackage|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigPackage" type="ConfigPackageType"/>
            
```

## ConsoleRedirection Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|ConsoleRedirection|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|FileRetentionCount|
|default|2|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileRetentionCount" default="2">
            <xs:simpleType>
              <xs:restriction base="xs:int">
                <xs:minInclusive value="1"/>
              </xs:restriction>
            </xs:simpleType>
          </xs:attribute>
          
```

#### FileMaxSizeInKb
|Attribute|Value|
|---|---|
|name|FileMaxSizeInKb|
|default|20480|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileMaxSizeInKb" default="20480">
            <xs:simpleType>
              <xs:restriction base="xs:int">
                <xs:minInclusive value="128"/>
              </xs:restriction>
            </xs:simpleType>
          </xs:attribute>
        
```


## ContainerEntryPoint Element
Overidden entrypoint for containers so debugger can be launched..|

|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|ContainerEntryPoint|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerEntryPoint" type="xs:string" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Overidden entrypoint for containers so debugger can be launched..</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## ContainerEnvironmentBlock Element
EnvironmentBlock for containers.|

|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|ContainerEnvironmentBlock|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerEnvironmentBlock" type="xs:string" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>EnvironmentBlock for containers.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```

## ContainerHost Element
|Attribute|Value|
|---|---|
|type|[ContainerHostEntryPointType](#containerhostentrypointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ContainerHost|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerHost" type="ContainerHostEntryPointType"/>
      
```

## ContainerHostPolicies Element
Specifies policies for activating container hosts.|

|Attribute|Value|
|---|---|
|type|[ContainerHostPoliciesType](#containerhostpoliciestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ContainerHostPolicies|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerHostPolicies" type="ContainerHostPoliciesType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies policies for activating container hosts.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```

## ContainerHostPolicies Element
Specifies policies for activating container hosts.|

|Attribute|Value|
|---|---|
|type|[ContainerHostPoliciesType](#containerhostpoliciestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ContainerHostPolicies|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerHostPolicies" type="ContainerHostPoliciesType" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Specifies policies for activating container hosts.</xs:documentation>
              </xs:annotation>
            </xs:element>
            
```

## ContainerMountedVolume Element
Volumes to be mounted inside container.|

|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|ContainerMountedVolume|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerMountedVolume" type="xs:string" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Volumes to be mounted inside container.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## CrashDumpSource Element
Specifies crash dump collection. Crash dumps are collected for executables that host the code packages of all services belonging to the application.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 1 attribute(s)|
|name|CrashDumpSource|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|IsEnabled|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsEnabled" type="xs:string">
            <xs:annotation>
              <xs:documentation>Whether or not crash dump collection is enabled. By default, it is not enabled.</xs:documentation>
            </xs:annotation>
          </xs:attribute>
        
```

### Content element details

#### Destinations
Destinations to which the crash dumps need to be transferred.
|Attribute|Value|
|---|---|
|name|Destinations|
|minOccurs|0|

##### XML source
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

#### None
|Attribute|Value|
|---|---|
|ref|Parameters|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Parameters" minOccurs="0" maxOccurs="1"/>
          
```

## CurrentInstallation Element
|Attribute|Value|
|---|---|
|type|[WindowsFabricDeploymentInformation](#windowsfabricdeploymentinformation-type)|
|content|0 element(s), 0 attribute(s)|
|name|CurrentInstallation|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CurrentInstallation" type="WindowsFabricDeploymentInformation" minOccurs="0"/>
      
```

## DataPackage Element
|Attribute|Value|
|---|---|
|type|[DataPackageType](#datapackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DataPackage|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DataPackage" type="DataPackageType" minOccurs="0" maxOccurs="unbounded"/>
      
```

## DataPackage Element
|Attribute|Value|
|---|---|
|type|[DataPackageType](#datapackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DataPackage|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DataPackage" type="DataPackageType"/>
            
```

## DebugParameters Element
|Attribute|Value|
|---|---|
|type|[DebugParametersType](#debugparameterstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DebugParameters|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DebugParameters" type="DebugParametersType" minOccurs="0" maxOccurs="1"/>
            
```

## DebugParameters Element
|Attribute|Value|
|---|---|
|type|[DebugParametersType](#debugparameterstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DebugParameters|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DebugParameters" type="DebugParametersType" minOccurs="0" maxOccurs="1"/>
          
```

## DebugParameters Element
|Attribute|Value|
|---|---|
|type|[DebugParametersType](#debugparameterstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DebugParameters|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DebugParameters" type="DebugParametersType" minOccurs="0" maxOccurs="1"/>
          
```

## DefaultReplicatorEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DefaultReplicatorEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

## DefaultRunAsPolicy Element
Specify a default user account for all service code packages that don’t have a specific RunAsPolicy defined in the ServiceManifestImport section.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|DefaultRunAsPolicy|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|UserRef|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UserRef" type="xs:string" use="required">
                                                <xs:annotation>
                                                        <xs:documentation>The user account that the service code packages will run as.  The user account must be declared in the Principals section. Often it is preferable to run the setup entry point using a local system account rather than an administrators account.</xs:documentation>
                                                </xs:annotation>
                                        </xs:attribute>
                                
```


## DefaultServiceTypeHealthPolicy Element
Specifies the default service type health policy, which will replace the default health policy for all service types in the application.|

|Attribute|Value|
|---|---|
|type|[ServiceTypeHealthPolicyType](#servicetypehealthpolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DefaultServiceTypeHealthPolicy|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultServiceTypeHealthPolicy" type="ServiceTypeHealthPolicyType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies the default service type health policy, which will replace the default health policy for all service types in the application.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## DefaultServices Element
|Attribute|Value|
|---|---|
|type|[DefaultServicesType](#defaultservicestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DefaultServices|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultServices" type="DefaultServicesType" minOccurs="0">

      </xs:element>
      
```

## DefaultServices Element
|Attribute|Value|
|---|---|
|type|[DefaultServicesType](#defaultservicestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DefaultServices|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultServices" type="DefaultServicesType"/>
    
```

## Description Element
Text describing this application.|

|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|Description|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Description" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Text describing this application.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## Description Element
Text describing this service.|

|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|Description|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Description" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Text describing this service.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## Description Element
|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|Description|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Description" type="xs:string" minOccurs="0"/>
      
```

## Destinations Element
Destinations to which the crash dumps need to be transferred.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|3 element(s), 0 attribute(s)|
|name|Destinations|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|LocalStore|
|type|LocalStoreType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LocalStore" type="LocalStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  
```

#### FileStore
|Attribute|Value|
|---|---|
|name|FileStore|
|type|FileStoreType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileStore" type="FileStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  
```

#### AzureBlob
|Attribute|Value|
|---|---|
|name|AzureBlob|
|type|AzureBlobType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureBlob" type="AzureBlobType" minOccurs="0" maxOccurs="unbounded"/>
                
```

## Destinations Element
Destinations to which the crash dumps need to be transferred.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|3 element(s), 0 attribute(s)|
|name|Destinations|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|LocalStore|
|type|LocalStoreETWType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LocalStore" type="LocalStoreETWType" minOccurs="0" maxOccurs="unbounded"/>
                  
```

#### FileStore
|Attribute|Value|
|---|---|
|name|FileStore|
|type|FileStoreETWType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileStore" type="FileStoreETWType" minOccurs="0" maxOccurs="unbounded"/>
                  
```

#### AzureBlob
|Attribute|Value|
|---|---|
|name|AzureBlob|
|type|AzureBlobETWType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureBlob" type="AzureBlobETWType" minOccurs="0" maxOccurs="unbounded"/>
                
```

## Destinations Element
Destinations to which the folder contents need to be transferred.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|3 element(s), 0 attribute(s)|
|name|Destinations|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|LocalStore|
|type|LocalStoreType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LocalStore" type="LocalStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  
```

#### FileStore
|Attribute|Value|
|---|---|
|name|FileStore|
|type|FileStoreType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileStore" type="FileStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  
```

#### AzureBlob
|Attribute|Value|
|---|---|
|name|AzureBlob|
|type|AzureBlobType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureBlob" type="AzureBlobType" minOccurs="0" maxOccurs="unbounded"/>
                
```

## Diagnostics Element
|Attribute|Value|
|---|---|
|type|[DiagnosticsType](#diagnosticstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Diagnostics|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Diagnostics" type="DiagnosticsType" minOccurs="0"/>
      
```

## Diagnostics Element
|Attribute|Value|
|---|---|
|type|[DiagnosticsType](#diagnosticstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Diagnostics|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Diagnostics" type="DiagnosticsType"/>
        
```

## Diagnostics Element
|Attribute|Value|
|---|---|
|type|[ServiceDiagnosticsType](#servicediagnosticstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Diagnostics|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Diagnostics" type="ServiceDiagnosticsType" minOccurs="0"/>
    
```

## Diagnostics Element
|Attribute|Value|
|---|---|
|type|[ServiceDiagnosticsType](#servicediagnosticstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Diagnostics|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Diagnostics" type="ServiceDiagnosticsType"/>
    
```

## DigestedCertificates Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|DigestedCertificates|

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
|Attribute|Value|
|---|---|
|name|SecretsCertificate|
|type|FabricCertificateType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecretsCertificate" type="FabricCertificateType" minOccurs="0"/>
            
```

#### EndpointCertificate
|Attribute|Value|
|---|---|
|name|EndpointCertificate|
|type|EndpointCertificateType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0"/>
          
```

## DigestedCertificates Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|DigestedCertificates|
|minOccurs|0|
|maxOccurs|1|

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
|Attribute|Value|
|---|---|
|name|EndpointCertificate|
|type|EndpointCertificateType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0" maxOccurs="unbounded"/>
                
```

## DigestedCodePackage Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|5 element(s), 2 attribute(s)|
|name|DigestedCodePackage|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|ContentChecksum|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContentChecksum" type="xs:string"/>
          
```

#### IsShared
|Attribute|Value|
|---|---|
|name|IsShared|
|type|xs:boolean|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsShared" type="xs:boolean"/>
        
```

### Content element details

#### CodePackage
|Attribute|Value|
|---|---|
|name|CodePackage|
|type|CodePackageType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackage" type="CodePackageType"/>
            
```

#### RunAsPolicy
|Attribute|Value|
|---|---|
|name|RunAsPolicy|
|type|RunAsPolicyType|
|minOccurs|0|
|maxOccurs|2|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RunAsPolicy" type="RunAsPolicyType" minOccurs="0" maxOccurs="2"/>
            
```

#### DebugParameters
|Attribute|Value|
|---|---|
|name|DebugParameters|
|type|DebugParametersType|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DebugParameters" type="DebugParametersType" minOccurs="0" maxOccurs="1"/>
            
```

#### ContainerHostPolicies
Specifies policies for activating container hosts.
|Attribute|Value|
|---|---|
|name|ContainerHostPolicies|
|type|ContainerHostPoliciesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerHostPolicies" type="ContainerHostPoliciesType" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Specifies policies for activating container hosts.</xs:documentation>
              </xs:annotation>
            </xs:element>
            
```

#### ResourceGovernancePolicy
Specifies resource limits for codepackage.
|Attribute|Value|
|---|---|
|name|ResourceGovernancePolicy|
|type|ResourceGovernancePolicyType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Specifies resource limits for codepackage.</xs:documentation>
              </xs:annotation>
            </xs:element>
          
```

## DigestedConfigPackage Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|3 element(s), 2 attribute(s)|
|name|DigestedConfigPackage|
|minOccurs|0|
|maxOccurs|unbounded|

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
Specifies resource limits for codepackage.
|Attribute|Value|
|---|---|
|name|ContentChecksum|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContentChecksum" type="xs:string"/>
          
```

#### IsShared
Specifies resource limits for codepackage.
|Attribute|Value|
|---|---|
|name|IsShared|
|type|xs:boolean|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsShared" type="xs:boolean"/>
        
```

### Content element details

#### ConfigPackage
|Attribute|Value|
|---|---|
|name|ConfigPackage|
|type|ConfigPackageType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigPackage" type="ConfigPackageType"/>
            
```

#### ConfigOverride
|Attribute|Value|
|---|---|
|name|ConfigOverride|
|type|ConfigOverrideType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigOverride" type="ConfigOverrideType" minOccurs="0"/>
            
```

#### DebugParameters
|Attribute|Value|
|---|---|
|name|DebugParameters|
|type|DebugParametersType|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DebugParameters" type="DebugParametersType" minOccurs="0" maxOccurs="1"/>
          
```

## DigestedDataPackage Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 2 attribute(s)|
|name|DigestedDataPackage|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|ContentChecksum|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContentChecksum" type="xs:string"/>
          
```

#### IsShared
|Attribute|Value|
|---|---|
|name|IsShared|
|type|xs:boolean|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsShared" type="xs:boolean"/>
        
```

### Content element details

#### DataPackage
|Attribute|Value|
|---|---|
|name|DataPackage|
|type|DataPackageType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DataPackage" type="DataPackageType"/>
            
```

#### DebugParameters
|Attribute|Value|
|---|---|
|name|DebugParameters|
|type|DebugParametersType|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DebugParameters" type="DebugParametersType" minOccurs="0" maxOccurs="1"/>
          
```

## DigestedEndpoint Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|4 element(s), 0 attribute(s)|
|name|DigestedEndpoint|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Endpoint|
|type|EndpointType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoint" type="EndpointType"/>
                        
```

#### SecurityAccessPolicy
|Attribute|Value|
|---|---|
|name|SecurityAccessPolicy|
|type|SecurityAccessPolicyType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityAccessPolicy" type="SecurityAccessPolicyType" minOccurs="0"/>
                        
```

#### EndpointBindingPolicy
|Attribute|Value|
|---|---|
|name|EndpointBindingPolicy|
|type|EndpointBindingPolicyType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointBindingPolicy" type="EndpointBindingPolicyType" minOccurs="0"/>
                        
```

#### ResourceGovernancePolicy
|Attribute|Value|
|---|---|
|name|ResourceGovernancePolicy|
|type|ResourceGovernancePolicyType|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0" maxOccurs="1"/>
                      
```

## DigestedEndpoints Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|DigestedEndpoints|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|DigestedEndpoint|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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

## DigestedEnvironment Element
|Attribute|Value|
|---|---|
|type|[EnvironmentType](#environmenttype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DigestedEnvironment|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedEnvironment" type="EnvironmentType"/>
      
```

## DigestedResources Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|DigestedResources|
|minOccurs|1|

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
|Attribute|Value|
|---|---|
|name|DigestedEndpoints|
|minOccurs|0|

##### XML source
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

#### DigestedCertificates
|Attribute|Value|
|---|---|
|name|DigestedCertificates|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedCertificates" minOccurs="0" maxOccurs="1">
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0" maxOccurs="unbounded"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
          
```

## DigestedServiceTypes Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|DigestedServiceTypes|

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
|Attribute|Value|
|---|---|
|name|ServiceTypes|
|type|ServiceTypesType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypes" type="ServiceTypesType"/>
          
```

## DllHost Element
|Attribute|Value|
|---|---|
|type|[DllHostEntryPointType](#dllhostentrypointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DllHost|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DllHost" type="DllHostEntryPointType"/>
        
```

## DomainGroup Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|DomainGroup|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required"/>
                                                    
```


## DomainUser Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|DomainUser|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required"/>
                                                    
```


## DriverOption Element
Driver options to be passed to driver.|

|Attribute|Value|
|---|---|
|type|[DriverOptionType](#driveroptiontype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DriverOption|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DriverOption" type="DriverOptionType" minOccurs="0" maxOccurs="unbounded">
              <xs:annotation>
                  <xs:documentation>Driver options to be passed to driver.</xs:documentation>
              </xs:annotation>
          </xs:element>
      
```

## DriverOption Element
Driver options to be passed to driver.|

|Attribute|Value|
|---|---|
|type|[DriverOptionType](#driveroptiontype-type)|
|content|0 element(s), 0 attribute(s)|
|name|DriverOption|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DriverOption" type="DriverOptionType" minOccurs="0" maxOccurs="unbounded">
                <xs:annotation>
                    <xs:documentation>Driver options to be passed to driver.</xs:documentation>
                </xs:annotation>
            </xs:element>
        
```

## ETW Element
Describes the ETW settings for the components of this service manifest.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|ETW|
|minOccurs|0|

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
Lists the ETW provider GUIDs for the components of this service manifest.
|Attribute|Value|
|---|---|
|name|ProviderGuids|
|minOccurs|0|

##### XML source
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

#### ManifestDataPackages
Lists the data packages containing ETW manifests for the components of this service manifest. The data package containing ETW manifests should not contain any other files. 
|Attribute|Value|
|---|---|
|name|ManifestDataPackages|
|minOccurs|0|

##### XML source
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

## ETWSource Element
Specifies ETW trace collection. ETW traces are collected for the providers that are registered by all services belonging to the application.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 1 attribute(s)|
|name|ETWSource|
|minOccurs|0|

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
Lists the data packages containing ETW manifests for the components of this service manifest. The data package containing ETW manifests should not contain any other files. 
|Attribute|Value|
|---|---|
|name|IsEnabled|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsEnabled" type="xs:string">
            <xs:annotation>
              <xs:documentation>Whether or not ETW trace collection is enabled. By default, it is not enabled.</xs:documentation>
            </xs:annotation>
          </xs:attribute>
        
```

### Content element details

#### Destinations
Destinations to which the crash dumps need to be transferred.
|Attribute|Value|
|---|---|
|name|Destinations|
|minOccurs|0|

##### XML source
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

#### None
|Attribute|Value|
|---|---|
|ref|Parameters|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Parameters" minOccurs="0" maxOccurs="1"/>
          
```

## Endpoint Element
|Attribute|Value|
|---|---|
|type|[EndpointOverrideType](#endpointoverridetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Endpoint|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoint" type="EndpointOverrideType" maxOccurs="unbounded"/>
          
```

## Endpoint Element
|Attribute|Value|
|---|---|
|type|[EndpointType](#endpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Endpoint|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoint" type="EndpointType" maxOccurs="unbounded"/>
          
```

## Endpoint Element
|Attribute|Value|
|---|---|
|type|[EndpointType](#endpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Endpoint|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoint" type="EndpointType"/>
                        
```

## EndpointBindingPolicy Element
Specifies a certificate that should be returned to a client for an HTTPS endpoint.|

|Attribute|Value|
|---|---|
|type|[EndpointBindingPolicyType](#endpointbindingpolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EndpointBindingPolicy|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointBindingPolicy" type="EndpointBindingPolicyType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies a certificate that should be returned to a client for an HTTPS endpoint.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## EndpointBindingPolicy Element
|Attribute|Value|
|---|---|
|type|[EndpointBindingPolicyType](#endpointbindingpolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EndpointBindingPolicy|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointBindingPolicy" type="EndpointBindingPolicyType" minOccurs="0"/>
                        
```

## EndpointCertificate Element
|Attribute|Value|
|---|---|
|type|[EndpointCertificateType](#endpointcertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EndpointCertificate|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0"/>
          
```

## EndpointCertificate Element
|Attribute|Value|
|---|---|
|type|[EndpointCertificateType](#endpointcertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EndpointCertificate|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0"/>
          
```

## EndpointCertificate Element
|Attribute|Value|
|---|---|
|type|[EndpointCertificateType](#endpointcertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EndpointCertificate|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0" maxOccurs="unbounded"/>
                
```

## Endpoints Element
Describe the endpoints associated with this node type|

|Attribute|Value|
|---|---|
|type|[FabricEndpointsType](#fabricendpointstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Endpoints|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoints" type="FabricEndpointsType" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the endpoints associated with this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                        </xs:element>
                                                                          
```

## Endpoints Element
Defines endpoints for the service.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Endpoints|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|Endpoint|
|type|EndpointOverrideType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoint" type="EndpointOverrideType" maxOccurs="unbounded"/>
          
```

## Endpoints Element
Defines endpoints for the service.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Endpoints|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|Endpoint|
|type|EndpointType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoint" type="EndpointType" maxOccurs="unbounded"/>
          
```

## Endpoints Element
Describe the endpoints associated with this node type|

|Attribute|Value|
|---|---|
|type|[FabricEndpointsType](#fabricendpointstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Endpoints|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoints" type="FabricEndpointsType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Describe the endpoints associated with this node type</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## EntryPoint Element
|Attribute|Value|
|---|---|
|type|[EntryPointDescriptionType](#entrypointdescriptiontype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EntryPoint|
|minOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EntryPoint" type="EntryPointDescriptionType" minOccurs="1"/>
      
```

## EntryPoint Element
|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|EntryPoint|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EntryPoint" type="xs:string" minOccurs="0" maxOccurs="1"/>
      
```

## EnvironmentOverrides Element
|Attribute|Value|
|---|---|
|type|[EnvironmentOverridesType](#environmentoverridestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EnvironmentOverrides|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentOverrides" type="EnvironmentOverridesType" minOccurs="0" maxOccurs="unbounded"/>
            
```

## EnvironmentVariable Element
Environment variable.|

|Attribute|Value|
|---|---|
|type|[EnvironmentVariableType](#environmentvariabletype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EnvironmentVariable|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentVariable" type="EnvironmentVariableType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Environment variable.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```

## EnvironmentVariable Element
Environment variable.|

|Attribute|Value|
|---|---|
|type|[EnvironmentVariableType](#environmentvariabletype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EnvironmentVariable|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentVariable" type="EnvironmentVariableType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Environment variable.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```

## EnvironmentVariables Element
|Attribute|Value|
|---|---|
|type|[EnvironmentVariablesType](#environmentvariablestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|EnvironmentVariables|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentVariables" type="EnvironmentVariablesType" minOccurs="0" maxOccurs="1"/>

    
```

## EphemeralEndpoints Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|EphemeralEndpoints|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|StartPort|
|type|xs:int|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StartPort" type="xs:int" use="required"/>
          
```

#### EndPort
|Attribute|Value|
|---|---|
|name|EndPort|
|type|xs:int|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndPort" type="xs:int" use="required"/>
        
```


## EvictionPolicy Element
Eviction Policy extension for the Service Type.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 2 attribute(s)|
|name|EvictionPolicy|

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
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required"/>
      
```

#### Provider
|Attribute|Value|
|---|---|
|name|Provider|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Provider" type="xs:string" use="required"/>
    
```

### Content element details

#### Properties
|Attribute|Value|
|---|---|
|name|Properties|
|type|ServiceTypeExtensionPolicyPropertiesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Properties" type="ServiceTypeExtensionPolicyPropertiesType" minOccurs="0"/>
      
```

## ExeHost Element
|Attribute|Value|
|---|---|
|type|[ExeHostEntryPointType](#exehostentrypointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ExeHost|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ExeHost" type="ExeHostEntryPointType"/>
          
```

## ExeHost Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|ExeHost|

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

## Extension Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|Extension|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required">
            <xs:simpleType>
              <xs:restriction base="xs:string">
                <xs:minLength value="1"/>
              </xs:restriction>
            </xs:simpleType>
          </xs:attribute>
          
```

#### GeneratedId
|Attribute|Value|
|---|---|
|name|GeneratedId|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="GeneratedId" type="xs:string" use="optional"/>
        
```


## Extensions Element
|Attribute|Value|
|---|---|
|type|[ExtensionsType](#extensionstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Extensions|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Extensions" type="ExtensionsType"/>
  
```

## FabricSettings Element
|Attribute|Value|
|---|---|
|type|[SettingsOverridesType](#settingsoverridestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|FabricSettings|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FabricSettings" type="SettingsOverridesType" minOccurs="0"/>
                        
```

## FailoverManagerReplicatorEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|FailoverManagerReplicatorEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FailoverManagerReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

## FaultAnalysisServiceReplicatorEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|FaultAnalysisServiceReplicatorEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FaultAnalysisServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

## FileStore Element
|Attribute|Value|
|---|---|
|type|[FileStoreType](#filestoretype-type)|
|content|0 element(s), 0 attribute(s)|
|name|FileStore|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileStore" type="FileStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  
```

## FileStore Element
|Attribute|Value|
|---|---|
|type|[FileStoreETWType](#filestoreetwtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|FileStore|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileStore" type="FileStoreETWType" minOccurs="0" maxOccurs="unbounded"/>
                  
```

## FileStore Element
|Attribute|Value|
|---|---|
|type|[FileStoreType](#filestoretype-type)|
|content|0 element(s), 0 attribute(s)|
|name|FileStore|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileStore" type="FileStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  
```

## FolderSource Element
Specifies the collection of the contents of a particular folder on the local node.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 1 attribute(s)|
|name|FolderSource|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|IsEnabled|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsEnabled" type="xs:string">
            <xs:annotation>
              <xs:documentation>Whether or not collection of the contents of this folder is enabled. By default, it is not enabled.</xs:documentation>
            </xs:annotation>
          </xs:attribute>
          
```

### Content element details

#### Destinations
Destinations to which the folder contents need to be transferred.
|Attribute|Value|
|---|---|
|name|Destinations|
|minOccurs|0|

##### XML source
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

#### None
|Attribute|Value|
|---|---|
|ref|Parameters|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Parameters" minOccurs="0" maxOccurs="1"/>
          
```

## FromSource Element
|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|FromSource|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FromSource" type="xs:string" minOccurs="0" maxOccurs="1"/>
    
```

## Group Element
Declares a group as a security principal, which can be referenced in policies.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 1 attribute(s)|
|name|Group|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required">
                                    <xs:annotation>
                                        <xs:documentation>Name of the local group account. The name will be prefixed with the application ID.</xs:documentation>
                                    </xs:annotation>
                                </xs:attribute>
                            
```

### Content element details

#### NTLMAuthenticationPolicy
|Attribute|Value|
|---|---|
|name|NTLMAuthenticationPolicy|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NTLMAuthenticationPolicy" minOccurs="0">
                                        <xs:complexType>
                                            <xs:attribute name="IsEnabled" type="xs:boolean" use="optional" default="true"/>
                                        </xs:complexType>
                                    </xs:element>
                                    
```

#### Membership
|Attribute|Value|
|---|---|
|name|Membership|
|minOccurs|0|

##### XML source
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

## Group Element
The group to add the user to.  The group must be defined in the Groups section.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|Group|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|NameRef|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NameRef" type="xs:string" use="required">
                                                                                                                        <xs:annotation>
                                                                                                                                <xs:documentation>The name of the group.</xs:documentation>
                                                                                                                        </xs:annotation>
                                                                                                                </xs:attribute>
                                                                                                        
```


## Groups Element
Declares a set of groups as security principals, which can be referenced in policies.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Groups|
|minOccurs|0|

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
Declares a group as a security principal, which can be referenced in policies.
|Attribute|Value|
|---|---|
|name|Group|
|maxOccurs|unbounded|

##### XML source
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

## HealthPolicy Element
|Attribute|Value|
|---|---|
|type|[ApplicationHealthPolicyType](#applicationhealthpolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|HealthPolicy|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="HealthPolicy" type="ApplicationHealthPolicyType" minOccurs="0"/>
                        
```

## HttpApplicationGatewayEndpoint Element
|Attribute|Value|
|---|---|
|type|[InputEndpointType](#inputendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|HttpApplicationGatewayEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="HttpApplicationGatewayEndpoint" type="InputEndpointType" minOccurs="0"/>
      
```

## HttpGatewayEndpoint Element
|Attribute|Value|
|---|---|
|type|[InputEndpointType](#inputendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|HttpGatewayEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="HttpGatewayEndpoint" type="InputEndpointType" minOccurs="0"/>
      
```

## ImageName Element
|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|ImageName|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ImageName" type="xs:string"/>
      
```

## ImageStoreServiceReplicatorEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ImageStoreServiceReplicatorEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ImageStoreServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

## Infrastructure Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|6 element(s), 0 attribute(s)|
|name|Infrastructure|

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
|Attribute|Value|
|---|---|
|name|WindowsServer|

##### XML source
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

#### Linux
|Attribute|Value|
|---|---|
|name|Linux|

##### XML source
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

#### WindowsAzure
|Attribute|Value|
|---|---|
|name|WindowsAzure|

##### XML source
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

#### WindowsAzureStaticTopology
|Attribute|Value|
|---|---|
|name|WindowsAzureStaticTopology|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="WindowsAzureStaticTopology">
                                                        <xs:complexType>
                                                                <xs:complexContent>
                                                                        <xs:extension base="WindowsInfrastructureType"/>
                                                                </xs:complexContent>
                                                        </xs:complexType>
                                                </xs:element>
                                                
```

#### Blackbird
|Attribute|Value|
|---|---|
|name|Blackbird|

##### XML source
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

#### PaaS
|Attribute|Value|
|---|---|
|name|PaaS|

##### XML source
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

## InfrastructureInformation Element
Describes the infrastructure on which fabric needs to run.|

|Attribute|Value|
|---|---|
|type|[InfrastructureInformationType](#infrastructureinformationtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|InfrastructureInformation|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="InfrastructureInformation" type="InfrastructureInformationType">
                <xs:annotation>
                        <xs:documentation>Describes the infrastructure on which fabric needs to run.</xs:documentation>
                </xs:annotation>
        </xs:element>
        
```

## KtlLoggerSettings Element
Describe the KtlLogger information associated with this node type|

|Attribute|Value|
|---|---|
|type|[FabricKtlLoggerSettingsType](#fabricktlloggersettingstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|KtlLoggerSettings|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="KtlLoggerSettings" type="FabricKtlLoggerSettingsType" minOccurs="0">
                                                                            <xs:annotation>
                                                                              <xs:documentation>Describe the KtlLogger information associated with this node type</xs:documentation>
                                                                            </xs:annotation>
                                                                          </xs:element>
                                                                          
```

## LeaseDriverEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LeaseDriverEndpoint|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LeaseDriverEndpoint" type="InternalEndpointType"/>
      
```

## Linux Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|Linux|

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

## LoadMetric Element
|Attribute|Value|
|---|---|
|type|[LoadMetricType](#loadmetrictype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LoadMetric|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
                    
```

## LoadMetric Element
|Attribute|Value|
|---|---|
|type|[LoadMetricType](#loadmetrictype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LoadMetric|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
                    
```

## LoadMetric Element
|Attribute|Value|
|---|---|
|type|[LoadMetricType](#loadmetrictype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LoadMetric|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
          
```

## LoadMetric Element
|Attribute|Value|
|---|---|
|type|[LoadMetricType](#loadmetrictype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LoadMetric|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
          
```

## LoadMetric Element
|Attribute|Value|
|---|---|
|type|[LoadMetricType](#loadmetrictype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LoadMetric|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
            
```

## LoadMetrics Element
Load metrics reported by this service, used for resource balancing services.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LoadMetrics|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|LoadMetric|
|type|LoadMetricType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
                    
```

## LoadMetrics Element
Load metrics reported by this service.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LoadMetrics|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|LoadMetric|
|type|LoadMetricType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
                    
```

## LoadMetrics Element
Load metrics reported by this service.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LoadMetrics|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|LoadMetric|
|type|LoadMetricType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
          
```

## LoadMetrics Element
Load metrics reported by this service.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LoadMetrics|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|LoadMetric|
|type|LoadMetricType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
          
```

## LoadMetrics Element
Load metrics reported by this service, used for resource balancing services.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LoadMetrics|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|LoadMetric|
|type|LoadMetricType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
            
```

## LocalStore Element
|Attribute|Value|
|---|---|
|type|[LocalStoreType](#localstoretype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LocalStore|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LocalStore" type="LocalStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  
```

## LocalStore Element
|Attribute|Value|
|---|---|
|type|[LocalStoreETWType](#localstoreetwtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LocalStore|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LocalStore" type="LocalStoreETWType" minOccurs="0" maxOccurs="unbounded"/>
                  
```

## LocalStore Element
|Attribute|Value|
|---|---|
|type|[LocalStoreType](#localstoretype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LocalStore|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LocalStore" type="LocalStoreType" minOccurs="0" maxOccurs="unbounded"/>
                  
```

## LogCollectionPolicies Element
Specifies whether log collection is enabled. Works only in an Azure cluster environment|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LogCollectionPolicies|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|LogCollectionPolicy|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LogCollectionPolicy">
                                                        <xs:complexType>
                                                                <xs:attribute name="Path" type="xs:string" use="optional"/>
                                                        </xs:complexType>
                                                </xs:element>
                                        
```

## LogCollectionPolicy Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|LogCollectionPolicy|

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
|Attribute|Value|
|---|---|
|name|Path|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Path" type="xs:string" use="optional"/>
                                                        
```


## LogConfig Element
Specifies the logging driver for a container.|

|Attribute|Value|
|---|---|
|type|[ContainerLoggingDriverType](#containerloggingdrivertype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LogConfig|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LogConfig" type="ContainerLoggingDriverType" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Specifies the logging driver for a container.</xs:documentation>
        </xs:annotation>
      </xs:element>
        
```

## LogicalDirectories Element
Describe the LogicalDirectories settings associated with this node type|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LogicalDirectories|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|LogicalDirectory|
|type|LogicalDirectoryType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LogicalDirectory" type="LogicalDirectoryType" maxOccurs="unbounded"/>
                                                                              
```

## LogicalDirectory Element
|Attribute|Value|
|---|---|
|type|[LogicalDirectoryType](#logicaldirectorytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|LogicalDirectory|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LogicalDirectory" type="LogicalDirectoryType" maxOccurs="unbounded"/>
                                                                              
```

## ManagedAssembly Element
|Attribute|Value|
|---|---|
|type|[ManagedAssemblyType](#managedassemblytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ManagedAssembly|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ManagedAssembly" type="ManagedAssemblyType"/>
      
```

## ManifestDataPackage Element
|Attribute|Value|
|---|---|
|type|[DataPackageType](#datapackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ManifestDataPackage|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ManifestDataPackage" type="DataPackageType" minOccurs="0" maxOccurs="unbounded"/>
                
```

## ManifestDataPackages Element
Lists the data packages containing ETW manifests for the components of this service manifest. The data package containing ETW manifests should not contain any other files. |

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ManifestDataPackages|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|ManifestDataPackage|
|type|DataPackageType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ManifestDataPackage" type="DataPackageType" minOccurs="0" maxOccurs="unbounded"/>
                
```

## Member Element
|Attribute|Value|
|---|---|
|type|[ServiceGroupMemberType](#servicegroupmembertype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Member|
|minOccurs|1|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Member" type="ServiceGroupMemberType" minOccurs="1" maxOccurs="unbounded"/>
                            
```

## Member Element
|Attribute|Value|
|---|---|
|type|[ServiceGroupMemberType](#servicegroupmembertype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Member|
|minOccurs|1|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Member" type="ServiceGroupMemberType" minOccurs="1" maxOccurs="unbounded"/>
                            
```

## MemberOf Element

                        Users can be added to any existing membership group, so it can inherit all the properties and security settings of that membership group. The membership group can be used to secure external resources that need to be accessed by different services or the same service (on a different machine).
                      |

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|MemberOf|
|minOccurs|0|

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
The system group to add the user to.  The system group must be defined in the Groups section.
|Attribute|Value|
|---|---|
|name|SystemGroup|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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

#### Group
The group to add the user to.  The group must be defined in the Groups section.
|Attribute|Value|
|---|---|
|name|Group|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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

## Members Element
Member services of this service group|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Members|
|minOccurs|1|
|maxOccurs|1|

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
|Attribute|Value|
|---|---|
|name|Member|
|type|ServiceGroupMemberType|
|minOccurs|1|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Member" type="ServiceGroupMemberType" minOccurs="1" maxOccurs="unbounded"/>
                            
```

## Members Element
Member services of this service group|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Members|
|minOccurs|1|
|maxOccurs|1|

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
|Attribute|Value|
|---|---|
|name|Member|
|type|ServiceGroupMemberType|
|minOccurs|1|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Member" type="ServiceGroupMemberType" minOccurs="1" maxOccurs="unbounded"/>
                            
```

## Membership Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|3 element(s), 0 attribute(s)|
|name|Membership|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|DomainGroup|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DomainGroup" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                                
```

#### SystemGroup
|Attribute|Value|
|---|---|
|name|SystemGroup|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SystemGroup" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                                
```

#### DomainUser
|Attribute|Value|
|---|---|
|name|DomainUser|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DomainUser" minOccurs="0" maxOccurs="unbounded">
                                                    <xs:complexType>
                                                        <xs:attribute name="Name" type="xs:string" use="required"/>
                                                    </xs:complexType>
                                                </xs:element>
                                            
```

## NTLMAuthenticationPolicy Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|NTLMAuthenticationPolicy|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|IsEnabled|
|type|xs:boolean|
|use|optional|
|default|true|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsEnabled" type="xs:boolean" use="optional" default="true"/>
                                        
```


## NTLMAuthenticationPolicy Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 6 attribute(s)|
|name|NTLMAuthenticationPolicy|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|IsEnabled|
|type|xs:boolean|
|use|optional|
|default|true|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsEnabled" type="xs:boolean" use="optional" default="true"/>
                                            
```

#### PasswordSecret
|Attribute|Value|
|---|---|
|name|PasswordSecret|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PasswordSecret" type="xs:string" use="required"/>
                                            
```

#### PasswordSecretEncrypted
|Attribute|Value|
|---|---|
|name|PasswordSecretEncrypted|
|type|xs:boolean|
|use|optional|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PasswordSecretEncrypted" type="xs:boolean" use="optional" default="false"/>
                                            
```

#### X509StoreLocation
|Attribute|Value|
|---|---|
|name|X509StoreLocation|
|use|optional|
|default|LocalMachine|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="X509StoreLocation" use="optional" default="LocalMachine">
                                                <xs:simpleType>
                                                    <xs:restriction base="xs:string">
                                                        <xs:enumeration value="LocalMachine"/>
                                                        <xs:enumeration value="CurrentUser"/>
                                                    </xs:restriction>
                                                </xs:simpleType>
                                            </xs:attribute>
                                                                                        
```

#### X509StoreName
|Attribute|Value|
|---|---|
|name|X509StoreName|
|default|My|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="X509StoreName" default="My">
                                                <xs:simpleType>
                                                    <xs:restriction base="xs:string"/>
                                                </xs:simpleType>
                                            </xs:attribute>
                                            
```

#### X509Thumbprint
|Attribute|Value|
|---|---|
|name|X509Thumbprint|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="X509Thumbprint" type="xs:string"/>
                                        
```


## NamedPartition Element
Describes a named partitioning scheme based on names for each partition.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|NamedPartition|

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
Describes a partition by name.
|Attribute|Value|
|---|---|
|name|Partition|

##### XML source
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

## NamingReplicatorEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|NamingReplicatorEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NamingReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

## NetworkConfig Element
Specifies the network configuration for a container.|

|Attribute|Value|
|---|---|
|type|[ContainerNetworkConfigType](#containernetworkconfigtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|NetworkConfig|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NetworkConfig" type="ContainerNetworkConfigType" minOccurs="0" maxOccurs="1">
            <xs:annotation>
                <xs:documentation>Specifies the network configuration for a container.</xs:documentation>
            </xs:annotation>
        </xs:element>
        
```

## Node Element
|Attribute|Value|
|---|---|
|type|[FabricNodeType](#fabricnodetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Node|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Node" type="FabricNodeType" maxOccurs="unbounded"/>
                                        
```

## Node Element
|Attribute|Value|
|---|---|
|type|[FabricNodeType](#fabricnodetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Node|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Node" type="FabricNodeType" maxOccurs="unbounded"/>
          
```

## Node Element
|Attribute|Value|
|---|---|
|type|[InfrastructureNodeType](#infrastructurenodetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Node|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Node" type="InfrastructureNodeType" maxOccurs="unbounded"/>
          
```

## NodeList Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|NodeList|

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
|Attribute|Value|
|---|---|
|name|Node|
|type|FabricNodeType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Node" type="FabricNodeType" maxOccurs="unbounded"/>
                                        
```

## NodeList Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|NodeList|

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
|Attribute|Value|
|---|---|
|name|Node|
|type|FabricNodeType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Node" type="FabricNodeType" maxOccurs="unbounded"/>
          
```

## NodeList Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|NodeList|

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
|Attribute|Value|
|---|---|
|name|Node|
|type|InfrastructureNodeType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Node" type="InfrastructureNodeType" maxOccurs="unbounded"/>
          
```

## NodeType Element
Describe a node type.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|6 element(s), 1 attribute(s)|
|name|NodeType|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required">
                                                                        <xs:annotation>
                                                                                <xs:documentation>Name of the NodeType</xs:documentation>
                                                                        </xs:annotation>
                                                                </xs:attribute>
                                                        
```

### Content element details

#### Endpoints
Describe the endpoints associated with this node type
|Attribute|Value|
|---|---|
|name|Endpoints|
|type|FabricEndpointsType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoints" type="FabricEndpointsType" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the endpoints associated with this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                        </xs:element>
                                                                          
```

#### KtlLoggerSettings
Describe the KtlLogger information associated with this node type
|Attribute|Value|
|---|---|
|name|KtlLoggerSettings|
|type|FabricKtlLoggerSettingsType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="KtlLoggerSettings" type="FabricKtlLoggerSettingsType" minOccurs="0">
                                                                            <xs:annotation>
                                                                              <xs:documentation>Describe the KtlLogger information associated with this node type</xs:documentation>
                                                                            </xs:annotation>
                                                                          </xs:element>
                                                                          
```

#### LogicalDirectories
Describe the LogicalDirectories settings associated with this node type
|Attribute|Value|
|---|---|
|name|LogicalDirectories|
|minOccurs|0|

##### XML source
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

#### Certificates
Describe the certificates associated with this node type
|Attribute|Value|
|---|---|
|name|Certificates|
|type|CertificatesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Certificates" type="CertificatesType" minOccurs="0">
                                                                                <xs:annotation>
                                                                                        <xs:documentation>Describe the certificates associated with this node type</xs:documentation>
                                                                                </xs:annotation>
                                                                        </xs:element>
                                                                        
```

#### PlacementProperties
Describe the properties for this NodeType that will be used as placement constraints
|Attribute|Value|
|---|---|
|name|PlacementProperties|
|minOccurs|0|

##### XML source
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

#### Capacities
The capacities of various metrics for this node type
|Attribute|Value|
|---|---|
|name|Capacities|
|minOccurs|0|

##### XML source
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

## NodeTypes Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|NodeTypes|
|minOccurs|1|

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
Describe a node type.
|Attribute|Value|
|---|---|
|name|NodeType|
|maxOccurs|unbounded|

##### XML source
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

## PaaS Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|PaaS|

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
|Attribute|Value|
|---|---|
|name|Roles|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Roles">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Role" type="PaaSRoleType" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                        
```

#### Votes
|Attribute|Value|
|---|---|
|name|Votes|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Votes">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Vote" type="PaaSVoteType" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                
```

## PackageSharingPolicy Element
|Attribute|Value|
|---|---|
|type|[PackageSharingPolicyType](#packagesharingpolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|PackageSharingPolicy|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PackageSharingPolicy" type="PackageSharingPolicyType" minOccurs="0"/>
      
```

## Parameter Element
An application parameter to be used in this manifest. The parameter value can be changed during application instantiation, or, if no value is supplied the default value is used.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|Parameter|
|block||
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required">
                  <xs:annotation>
                    <xs:documentation>The name of the parameter to be used in the manifest as "[Name]".</xs:documentation>
                  </xs:annotation>
                  <xs:simpleType>
                    <xs:restriction base="xs:string">
                      <xs:minLength value="1"/>
                    </xs:restriction>
                  </xs:simpleType>
                </xs:attribute>
                
```

#### DefaultValue
|Attribute|Value|
|---|---|
|name|DefaultValue|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultValue" type="xs:string" use="required">
                  <xs:annotation>
                    <xs:documentation>Default value for the parameter, used if the parameter value is not provided during application instantiation.</xs:documentation>
                  </xs:annotation>
                </xs:attribute>
              
```


## Parameter Element
The setting to override.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|Parameter|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|IsEncrypted|
|type|xs:boolean|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsEncrypted" type="xs:boolean" default="false">
                  <xs:annotation>
                    <xs:documentation>
                      If true, the value of this parameter is encrypted. The application developer is responsible for creating a certificate and using the Invoke-ServiceFabricEncryptSecret cmdlet to encrypt sensitive information. The certificate information that will be used to encrypt the value is specified in the Certificates section.
                    </xs:documentation>
                                    </xs:annotation>
                                </xs:attribute>
                            
```


## Parameter Element
|Attribute|Value|
|---|---|
|type|[ParameterType](#parametertype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Parameter|
|minOccurs|1|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameter" type="ParameterType" minOccurs="1" maxOccurs="unbounded"/>
                
```

## Parameter Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 4 attribute(s)|
|name|Parameter|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required"/>
                
```

#### Value
|Attribute|Value|
|---|---|
|name|Value|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Value" type="xs:string" use="required"/>
                
```

#### MustOverride
|Attribute|Value|
|---|---|
|name|MustOverride|
|type|xs:boolean|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MustOverride" type="xs:boolean" default="false">
                  <xs:annotation>
                    <xs:documentation>If true, the value of this parameter must be overridden by higher level configuration.</xs:documentation>
                  </xs:annotation>
                </xs:attribute>
                
```

#### IsEncrypted
|Attribute|Value|
|---|---|
|name|IsEncrypted|
|type|xs:boolean|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsEncrypted" type="xs:boolean" default="false">
                  <xs:annotation>
                    <xs:documentation>If true, the value of this parameter is encrypted.</xs:documentation>
                  </xs:annotation>
                </xs:attribute>
              
```


## Parameter Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|Parameter|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameter" minOccurs="0" maxOccurs="unbounded">
              <xs:complexType>
                <xs:attributeGroup ref="NameValuePair"/>
              </xs:complexType>
            </xs:element>
          
```

## Parameters Element
Declares the parameters that are used in this application manifest. The value of these parameters can be supplied when the application is instantiated and can be used to override application or service configuration settings.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Parameters|
|minOccurs|0|

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
An application parameter to be used in this manifest. The parameter value can be changed during application instantiation, or, if no value is supplied the default value is used.
|Attribute|Value|
|---|---|
|name|Parameter|
|block||
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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

## Parameters Element
Additional settings specified as name-value pairs|

|Attribute|Value|
|---|---|
|type|[ParametersType](#parameterstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Parameters|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameters" type="ParametersType">
    <xs:annotation>
      <xs:documentation>Additional settings specified as name-value pairs</xs:documentation>
    </xs:annotation>
  </xs:element>
  
```

## Parameters Element
List of parameters for the application as defined in application manifest and their respective values.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Parameters|

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
|Attribute|Value|
|---|---|
|name|Parameter|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameter" minOccurs="0" maxOccurs="unbounded">
              <xs:complexType>
                <xs:attributeGroup ref="NameValuePair"/>
              </xs:complexType>
            </xs:element>
          
```

## Partition Element
Describes a partition by name.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|Partition|

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
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required">
                                    <xs:annotation>
                                        <xs:documentation>The name of the partition</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:minLength value="1"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                            
```


## PersistencePolicy Element
Persistence Policy extension for the Service Type|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 4 attribute(s)|
|name|PersistencePolicy|

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
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required"/>
      
```

#### Mode
|Attribute|Value|
|---|---|
|name|Mode|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Mode" use="required">
        <xs:simpleType>
          <xs:restriction base="xs:string">
            <xs:enumeration value="Synchronous"/>
            <xs:enumeration value="Asynchronous"/>
          </xs:restriction>
        </xs:simpleType>
      </xs:attribute>
      
```

#### WriteBehind
|Attribute|Value|
|---|---|
|name|WriteBehind|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="WriteBehind" type="xs:string" use="required"/>
      
```

#### Provider
|Attribute|Value|
|---|---|
|name|Provider|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Provider" type="xs:string" use="required"/>
    
```

### Content element details

#### Properties
|Attribute|Value|
|---|---|
|name|Properties|
|type|ServiceTypeExtensionPolicyPropertiesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Properties" type="ServiceTypeExtensionPolicyPropertiesType" minOccurs="0"/>
      
```

## PlacementConstraints Element
Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service’s requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion>12  && InDMZ == True)".|

|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|PlacementConstraints|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PlacementConstraints" type="xs:string" minOccurs="0">
                <xs:annotation>
                    <xs:documentation>Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service’s requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion&gt;12  &amp;&amp; InDMZ == True)".</xs:documentation>
                </xs:annotation>
            </xs:element>
            
```

## PlacementConstraints Element
Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service's requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion>12  && InDMZ == True)".|

|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|PlacementConstraints|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PlacementConstraints" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service's requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion&gt;12  &amp;&amp; InDMZ == True)".</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## PlacementConstraints Element
Constraints for the placement of services that are part of this package.|

|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|PlacementConstraints|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PlacementConstraints" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Constraints for the placement of services that are part of this package.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## PlacementProperties Element
Describe the properties for this NodeType that will be used as placement constraints|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|PlacementProperties|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|Property|
|type|KeyValuePairType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Property" type="KeyValuePairType" minOccurs="0" maxOccurs="unbounded"/>
                                                                                        
```

## Policies Element
|Attribute|Value|
|---|---|
|type|[ServiceManifestImportPoliciesType](#servicemanifestimportpoliciestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Policies|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Policies" type="ServiceManifestImportPoliciesType" minOccurs="0"/>
          
```

## Policies Element
|Attribute|Value|
|---|---|
|type|[ApplicationPoliciesType](#applicationpoliciestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Policies|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Policies" type="ApplicationPoliciesType" minOccurs="0"/>
      
```

## Policies Element
|Attribute|Value|
|---|---|
|type|[ApplicationPoliciesType](#applicationpoliciestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Policies|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Policies" type="ApplicationPoliciesType"/>
            
```

## PortBinding Element
Specifies which endpoint resource to bind container exposed port.|

|Attribute|Value|
|---|---|
|type|[PortBindingType](#portbindingtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|PortBinding|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PortBinding" type="PortBindingType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies which endpoint resource to bind container exposed port.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## Principals Element
|Attribute|Value|
|---|---|
|type|[SecurityPrincipalsType](#securityprincipalstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Principals|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Principals" type="SecurityPrincipalsType" minOccurs="0"/>
      
```

## Principals Element
|Attribute|Value|
|---|---|
|type|[SecurityPrincipalsType](#securityprincipalstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Principals|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Principals" type="SecurityPrincipalsType"/>
            
```

## Program Element
The executable name.  For example, "MySetup.bat" or "MyServiceHost.exe".|

|Attribute|Value|
|---|---|
|type|[xs:string](#xs:string-type)|
|content|0 element(s), 0 attribute(s)|
|name|Program|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Program" type="xs:string">
        <xs:annotation>
          <xs:documentation>The executable name.  For example, "MySetup.bat" or "MyServiceHost.exe".</xs:documentation>
        </xs:annotation></xs:element>
      
```

## Properties Element
|Attribute|Value|
|---|---|
|type|[ServiceTypeExtensionPolicyPropertiesType](#servicetypeextensionpolicypropertiestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Properties|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Properties" type="ServiceTypeExtensionPolicyPropertiesType" minOccurs="0"/>
      
```

## Properties Element
|Attribute|Value|
|---|---|
|type|[ServiceTypeExtensionPolicyPropertiesType](#servicetypeextensionpolicypropertiestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Properties|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Properties" type="ServiceTypeExtensionPolicyPropertiesType" minOccurs="0"/>
      
```

## Property Element
|Attribute|Value|
|---|---|
|type|[KeyValuePairType](#keyvaluepairtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Property|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Property" type="KeyValuePairType" minOccurs="0" maxOccurs="unbounded"/>
                                                                                        
```

## Property Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|Property|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required"/>
          
```

#### Value
|Attribute|Value|
|---|---|
|name|Value|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Value" type="xs:string" use="required"/>
        
```


## ProviderGuid Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|ProviderGuid|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Value|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Value" use="required">
                        <xs:simpleType>
                          <xs:restriction base="xs:string">
                            <xs:pattern value="[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}"/>
                          </xs:restriction>
                        </xs:simpleType>
                      </xs:attribute>
                    
```


## ProviderGuids Element
Lists the ETW provider GUIDs for the components of this service manifest.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ProviderGuids|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|ProviderGuid|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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

## RepairManagerReplicatorEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|RepairManagerReplicatorEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RepairManagerReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

## RepositoryCredentials Element
Credentials for container image repository to pull images from.|

|Attribute|Value|
|---|---|
|type|[RepositoryCredentialsType](#repositorycredentialstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|RepositoryCredentials|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RepositoryCredentials" type="RepositoryCredentialsType" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Credentials for container image repository to pull images from.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## ResourceGovernancePolicy Element
Specifies resource limits for codepackage.|

|Attribute|Value|
|---|---|
|type|[ResourceGovernancePolicyType](#resourcegovernancepolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ResourceGovernancePolicy|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies resource limits for codepackage.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## ResourceGovernancePolicy Element
Specifies resource limits for codepackage.|

|Attribute|Value|
|---|---|
|type|[ResourceGovernancePolicyType](#resourcegovernancepolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ResourceGovernancePolicy|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Specifies resource limits for codepackage.</xs:documentation>
              </xs:annotation>
            </xs:element>
          
```

## ResourceGovernancePolicy Element
|Attribute|Value|
|---|---|
|type|[ResourceGovernancePolicyType](#resourcegovernancepolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ResourceGovernancePolicy|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0" maxOccurs="1"/>
                      
```

## ResourceOverrides Element
|Attribute|Value|
|---|---|
|type|[ResourceOverridesType](#resourceoverridestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ResourceOverrides|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceOverrides" type="ResourceOverridesType" minOccurs="0"/>
            
```

## Resources Element
|Attribute|Value|
|---|---|
|type|[ResourcesType](#resourcestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Resources|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Resources" type="ResourcesType" minOccurs="0"/>
      
```

## Role Element
|Attribute|Value|
|---|---|
|type|[AzureRoleType](#azureroletype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Role|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Role" type="AzureRoleType" maxOccurs="unbounded"/>
                                                                                        
```

## Role Element
|Attribute|Value|
|---|---|
|type|[BlackbirdRoleType](#blackbirdroletype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Role|
|minOccurs|1|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Role" type="BlackbirdRoleType" minOccurs="1" maxOccurs="unbounded"/>
                                                                                        
```

## Role Element
|Attribute|Value|
|---|---|
|type|[PaaSRoleType](#paasroletype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Role|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Role" type="PaaSRoleType" maxOccurs="unbounded"/>
                                                                                        
```

## Roles Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Roles|

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
|Attribute|Value|
|---|---|
|name|Role|
|type|AzureRoleType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Role" type="AzureRoleType" maxOccurs="unbounded"/>
                                                                                        
```

## Roles Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Roles|

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
|Attribute|Value|
|---|---|
|name|Role|
|type|BlackbirdRoleType|
|minOccurs|1|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Role" type="BlackbirdRoleType" minOccurs="1" maxOccurs="unbounded"/>
                                                                                        
```

## Roles Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Roles|

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
|Attribute|Value|
|---|---|
|name|Role|
|type|PaaSRoleType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Role" type="PaaSRoleType" maxOccurs="unbounded"/>
                                                                                        
```

## RunAsPolicy Element
|Attribute|Value|
|---|---|
|type|[RunAsPolicyType](#runaspolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|RunAsPolicy|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RunAsPolicy" type="RunAsPolicyType" minOccurs="0"/>
      
```

## RunAsPolicy Element
|Attribute|Value|
|---|---|
|type|[RunAsPolicyType](#runaspolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|RunAsPolicy|
|minOccurs|0|
|maxOccurs|2|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RunAsPolicy" type="RunAsPolicyType" minOccurs="0" maxOccurs="2"/>
            
```

## RunFrequency Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|RunFrequency|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|IntervalInSeconds|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IntervalInSeconds" use="required">
                        <xs:simpleType>
                          <xs:restriction base="xs:int">
                            <xs:minInclusive value="0"/>
                            <xs:maxInclusive value="2147483647"/>
                          </xs:restriction>
                        </xs:simpleType>
                      </xs:attribute>
                    
```


## SecretsCertificate Element
|Attribute|Value|
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecretsCertificate|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecretsCertificate" type="FabricCertificateType" minOccurs="0"/>
                                        
```

## SecretsCertificate Element
Declares a certificate used to encrypt sensitive information within the application manifest. The application author uses the Invoke-ServiceFabricEncryptSecret cmdlet to encrypt the sensitive information, which is copied to a Parameter in the ConfigOverrides section.|

|Attribute|Value|
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecretsCertificate|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecretsCertificate" type="FabricCertificateType" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Declares a certificate used to encrypt sensitive information within the application manifest. The application author uses the Invoke-ServiceFabricEncryptSecret cmdlet to encrypt the sensitive information, which is copied to a Parameter in the ConfigOverrides section.</xs:documentation>
              </xs:annotation>
            </xs:element>
            
```

## SecretsCertificate Element
|Attribute|Value|
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecretsCertificate|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecretsCertificate" type="FabricCertificateType" minOccurs="0"/>
            
```

## Section Element
A section in the Settings.xml file to override.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 1 attribute(s)|
|name|Section|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required">
                        <xs:annotation>
                            <xs:documentation>The name of the section in the Settings.xml file to override.</xs:documentation>
                        </xs:annotation>
                        <xs:simpleType>
                            <xs:restriction base="xs:string">
                                <xs:minLength value="1"/>
                            </xs:restriction>
                        </xs:simpleType>
                    </xs:attribute>
                
```

### Content element details

#### Parameter
The setting to override.
|Attribute|Value|
|---|---|
|name|Parameter|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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

## Section Element
A user defined named section.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 1 attribute(s)|
|name|Section|
|minOccurs|0|
|maxOccurs|unbounded|

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
The setting to override.
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required"/>
        
```

### Content element details

#### Parameter
|Attribute|Value|
|---|---|
|name|Parameter|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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

## SecurityAccessPolicies Element
List of security policies applied to resources at the application level.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|SecurityAccessPolicies|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|SecurityAccessPolicy|
|type|SecurityAccessPolicyType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityAccessPolicy" type="SecurityAccessPolicyType"/>
                                        
```

## SecurityAccessPolicy Element
|Attribute|Value|
|---|---|
|type|[SecurityAccessPolicyType](#securityaccesspolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecurityAccessPolicy|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityAccessPolicy" type="SecurityAccessPolicyType" minOccurs="0"/>
      
```

## SecurityAccessPolicy Element
|Attribute|Value|
|---|---|
|type|[SecurityAccessPolicyType](#securityaccesspolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecurityAccessPolicy|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityAccessPolicy" type="SecurityAccessPolicyType"/>
                                        
```

## SecurityAccessPolicy Element
|Attribute|Value|
|---|---|
|type|[SecurityAccessPolicyType](#securityaccesspolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecurityAccessPolicy|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityAccessPolicy" type="SecurityAccessPolicyType" minOccurs="0"/>
                        
```

## SecurityOption Element
Specifies securityoptions for the container.|

|Attribute|Value|
|---|---|
|type|[SecurityOptionsType](#securityoptionstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|SecurityOption|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityOption" type="SecurityOptionsType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies securityoptions for the container.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```

## ServerCertificate Element
The certificate used to secure the intra cluster communication.|

|Attribute|Value|
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServerCertificate|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServerCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The certificate used to secure the intra cluster communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## Service Element
Declares a service to be created automatically when the application is instantiated.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 4 attribute(s)|
|name|Service|

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
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required">
                            <xs:annotation>
                                <xs:documentation>The service name, used to form the fully qualified application name URI. The fully qualified name URI of the service would be: fabric:/ApplicationName/ServiceName.</xs:documentation>
                            </xs:annotation>
                        </xs:attribute>
                        
```

#### GeneratedIdRef
|Attribute|Value|
|---|---|
|name|GeneratedIdRef|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="GeneratedIdRef" type="xs:string" use="optional">
                            <xs:annotation>
                                <xs:documentation>Reference to the auto generated id used by Visual Studio tooling.</xs:documentation>
                            </xs:annotation>
                        </xs:attribute>
                        
```

#### ServiceDnsName
|Attribute|Value|
|---|---|
|name|ServiceDnsName|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceDnsName" type="xs:string" use="optional">
                          <xs:annotation>
                            <xs:documentation>The DNS name of the service.</xs:documentation>
                          </xs:annotation>
                        </xs:attribute>
                        
```

#### ServicePackageActivationMode
|Attribute|Value|
|---|---|
|name|ServicePackageActivationMode|
|use|optional|
|default|SharedProcess|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageActivationMode" use="optional" default="SharedProcess">
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
                    
```

### Content element details

#### StatelessService
|Attribute|Value|
|---|---|
|name|StatelessService|
|type|StatelessServiceType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessService" type="StatelessServiceType"/>
                            
```

#### StatefulService
|Attribute|Value|
|---|---|
|name|StatefulService|
|type|StatefulServiceType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulService" type="StatefulServiceType"/>
                        
```

## ServiceConnectionEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceConnectionEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceConnectionEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

## ServiceCorrelation Element
Defines an affinity relationship with another service. Useful when splitting a previously-monolithic application into microservices.  One service has a local dependency on another service and both services need to run on the same node in order to work.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|ServiceCorrelation|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|ServiceName|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceName" use="required">
                                    <xs:annotation>
                                        <xs:documentation>The name of the other service as a URI. Example, "fabric:/otherApplication/parentService".</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:minLength value="1"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                                
```

#### Scheme
|Attribute|Value|
|---|---|
|name|Scheme|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Scheme" use="required">
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
                            
```


## ServiceCorrelations Element
Defines affinity relationships between services.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ServiceCorrelations|
|minOccurs|0|

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
Defines an affinity relationship with another service. Useful when splitting a previously-monolithic application into microservices.  One service has a local dependency on another service and both services need to run on the same node in order to work.
|Attribute|Value|
|---|---|
|name|ServiceCorrelation|
|maxOccurs|unbounded|

##### XML source
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

## ServiceGroup Element
A collection of services that are automatically located together, so they are also moved together during fail-over or resource management.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 2 attribute(s)|
|name|ServiceGroup|

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
Defines an affinity relationship with another service. Useful when splitting a previously-monolithic application into microservices.  One service has a local dependency on another service and both services need to run on the same node in order to work.
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required">
                            <xs:annotation>
                                <xs:documentation>Name of this service relative to this application Name URI. Fully qualified Name of the service is a combination of Name Uri of the Application and this Name.</xs:documentation>
                            </xs:annotation>
                        </xs:attribute>
                        
```

#### ServicePackageActivationMode
Defines an affinity relationship with another service. Useful when splitting a previously-monolithic application into microservices.  One service has a local dependency on another service and both services need to run on the same node in order to work.
|Attribute|Value|
|---|---|
|name|ServicePackageActivationMode|
|use|optional|
|default|SharedProcess|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageActivationMode" use="optional" default="SharedProcess">
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
                    
```

### Content element details

#### StatelessServiceGroup
|Attribute|Value|
|---|---|
|name|StatelessServiceGroup|
|type|StatelessServiceGroupType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceGroup" type="StatelessServiceGroupType"/>
                            
```

#### StatefulServiceGroup
|Attribute|Value|
|---|---|
|name|StatefulServiceGroup|
|type|StatefulServiceGroupType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceGroup" type="StatefulServiceGroupType"/>
                        
```

## ServiceGroupMembers Element
Member types of this service group type.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ServiceGroupMembers|
|minOccurs|0|
|maxOccurs|1|

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
|Attribute|Value|
|---|---|
|ref|ServiceGroupTypeMember|
|minOccurs|1|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="ServiceGroupTypeMember" minOccurs="1" maxOccurs="unbounded"/>
          
```

## ServiceGroupTypeMember Element
Describes the member type of the service group.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 1 attribute(s)|
|name|ServiceGroupTypeMember|

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
|Attribute|Value|
|---|---|
|name|ServiceTypeName|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypeName" use="required">
        <xs:annotation>
          <xs:documentation>User defined type identifier for a Microsoft Azure Service Fabric ServiceGroup Member, .e.g Actor</xs:documentation>
        </xs:annotation>
        <xs:simpleType>
          <xs:restriction base="xs:string">
            <xs:minLength value="1"/>
          </xs:restriction>
        </xs:simpleType>
      </xs:attribute>
    
```

### Content element details

#### LoadMetrics
Load metrics reported by this service, used for resource balancing services.
|Attribute|Value|
|---|---|
|name|LoadMetrics|
|minOccurs|0|

##### XML source
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

## ServiceManifest Element
|Attribute|Value|
|---|---|
|type|[ServiceManifestType](#servicemanifesttype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceManifest|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceManifest" type="ServiceManifestType"/>
        
```

## ServiceManifestImport Element
Imports a service manifest created by the service developer. A service manifest must be imported for each constituent service in the application. Configuration overrides and policies can be declared for the service manifest.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|5 element(s), 0 attribute(s)|
|name|ServiceManifestImport|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|ServiceManifestRef|
|type|ServiceManifestRefType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceManifestRef" type="ServiceManifestRefType"/>
            
```

#### ConfigOverrides
Describes configuration overrides for the imported service manifest. Configuration overrides allow the flexibility of re-using the same service manifests across multiple application types by overriding the service manifest's configuration only when used with a particular application type. Configuration overrides can change any default configuration in a service manifest as long as default configuration is defined using the Settings.xml in the ConfigPackage folder. 
|Attribute|Value|
|---|---|
|name|ConfigOverrides|
|minOccurs|0|

##### XML source
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

#### ResourceOverrides
|Attribute|Value|
|---|---|
|name|ResourceOverrides|
|type|ResourceOverridesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceOverrides" type="ResourceOverridesType" minOccurs="0"/>
            
```

#### EnvironmentOverrides
|Attribute|Value|
|---|---|
|name|EnvironmentOverrides|
|type|EnvironmentOverridesType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentOverrides" type="EnvironmentOverridesType" minOccurs="0" maxOccurs="unbounded"/>
            
```

#### Policies
|Attribute|Value|
|---|---|
|name|Policies|
|type|ServiceManifestImportPoliciesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Policies" type="ServiceManifestImportPoliciesType" minOccurs="0"/>
          
```

## ServiceManifestRef Element
|Attribute|Value|
|---|---|
|type|[ServiceManifestRefType](#servicemanifestreftype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceManifestRef|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceManifestRef" type="ServiceManifestRefType"/>
            
```

## ServicePackage Element
ServicePackage represents a versioned unit of deployment and activation. The version of the ServicePackage is determined based on the manifest version and the version of the overrides.|

|Attribute|Value|
|---|---|
|type|[ServicePackageType](#servicepackagetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServicePackage|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackage" type="ServicePackageType">
    <xs:annotation>
      <xs:documentation>ServicePackage represents a versioned unit of deployment and activation. The version of the ServicePackage is determined based on the manifest version and the version of the overrides.</xs:documentation>
    </xs:annotation>
  </xs:element>
  
```

## ServicePackageRef Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|ServicePackageRef|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required"/>
          
```


## ServicePackageResourceGovernancePolicy Element
Defines the resource governance policy that is applied at the level of the entire service package.|

|Attribute|Value|
|---|---|
|type|[ServicePackageResourceGovernancePolicyType](#servicepackageresourcegovernancepolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServicePackageResourceGovernancePolicy|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageResourceGovernancePolicy" type="ServicePackageResourceGovernancePolicyType" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Defines the resource governance policy that is applied at the level of the entire service package.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## ServicePackageResourceGovernancePolicy Element
|Attribute|Value|
|---|---|
|type|[ServicePackageResourceGovernancePolicyType](#servicepackageresourcegovernancepolicytype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServicePackageResourceGovernancePolicy|
|minOccurs|0|
|maxOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageResourceGovernancePolicy" type="ServicePackageResourceGovernancePolicyType" minOccurs="0" maxOccurs="1"/>
      
```

## ServicePlacementPolicies Element
Declares placement policies for a service.  Useful when the cluster spans geographic distances or and/or geopolitical regions.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ServicePlacementPolicies|
|minOccurs|0|

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
Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.
|Attribute|Value|
|---|---|
|name|ServicePlacementPolicy|
|maxOccurs|unbounded|

##### XML source
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

## ServicePlacementPolicies Element
Declares placement policies for a service.  Useful when the cluster spans geographic distances or and/or geopolitical regions.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ServicePlacementPolicies|
|minOccurs|0|

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
Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.
|Attribute|Value|
|---|---|
|name|ServicePlacementPolicy|
|maxOccurs|unbounded|

##### XML source
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

## ServicePlacementPolicy Element
Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|ServicePlacementPolicy|
|maxOccurs|unbounded|

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
Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.
|Attribute|Value|
|---|---|
|name|DomainName|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DomainName">
                                    <xs:annotation>
                                        <xs:documentation>The fault domain where the service should or should not be placed, depending on the Type value.</xs:documentation>
                                    </xs:annotation>
                                    <xs:simpleType>
                                        <xs:restriction base="xs:string">
                                            <xs:minLength value="1"/>
                                        </xs:restriction>
                                    </xs:simpleType>
                                </xs:attribute>
                                
```

#### Type
Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.
|Attribute|Value|
|---|---|
|name|Type|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Type" use="required">
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
                            
```


## ServicePlacementPolicy Element
Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|ServicePlacementPolicy|
|maxOccurs|unbounded|

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
Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.
|Attribute|Value|
|---|---|
|name|DomainName|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DomainName">
                  <xs:annotation>
                    <xs:documentation>The fault domain where the service should or should not be placed, depending on the Type value.</xs:documentation>
                  </xs:annotation>
                  <xs:simpleType>
                    <xs:restriction base="xs:string">
                      <xs:minLength value="1"/>
                    </xs:restriction>
                  </xs:simpleType>
                </xs:attribute>
                
```

#### Type
Defines a service placement policy, which specifies that the service should or should not run in certain cluster fault domains.  Useful when the cluster spans geographic distances or and/or geopolitical regions.
|Attribute|Value|
|---|---|
|name|Type|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Type" use="required">
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
              
```


## ServiceTemplates Element
Declares the set of permitted service types that can be created dynamically inside the application instance. Default configuration values, such as replication factor, are specified and used as a template for creating service instances.|

|Attribute|Value|
|---|---|
|type|[ServiceTemplatesType](#servicetemplatestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceTemplates|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTemplates" type="ServiceTemplatesType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Declares the set of permitted service types that can be created dynamically inside the application instance. Default configuration values, such as replication factor, are specified and used as a template for creating service instances.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## ServiceTemplates Element
|Attribute|Value|
|---|---|
|type|[ServiceTemplatesType](#servicetemplatestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceTemplates|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTemplates" type="ServiceTemplatesType"/>
      
```

## ServiceTypeHealthPolicy Element
Describes the policy for evaluating health events reported on services, partitions and replicas of a particular service type.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|ServiceTypeHealthPolicy|
|minOccurs|0|
|maxOccurs|unbounded|

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

## ServiceTypes Element
Defines what service types are supported by a CodePackage in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. Service types are declared at the manifest level and not the code package level.|

|Attribute|Value|
|---|---|
|type|[ServiceAndServiceGroupTypesType](#serviceandservicegrouptypestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceTypes|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypes" type="ServiceAndServiceGroupTypesType">
        <xs:annotation>
          <xs:documentation>Defines what service types are supported by a CodePackage in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. Service types are declared at the manifest level and not the code package level.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## ServiceTypes Element
|Attribute|Value|
|---|---|
|type|[ServiceTypesType](#servicetypestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|ServiceTypes|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypes" type="ServiceTypesType"/>
          
```

## Settings Element
Defiles configurable settings for the code packages of a service. Microsoft Azure Service Fabric does not interpret the settings, however it makes them available via Runtime APIs for use by the code components.|

|Attribute|Value|
|---|---|
|type|[SettingsType](#settingstype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Settings|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Settings" type="SettingsType">
                <xs:annotation>
                        <xs:documentation>Defiles configurable settings for the code packages of a service. Microsoft Azure Service Fabric does not interpret the settings, however it makes them available via Runtime APIs for use by the code components.</xs:documentation>
                </xs:annotation>
        </xs:element>
        
```

## Settings Element
|Attribute|Value|
|---|---|
|type|[SettingsOverridesType](#settingsoverridestype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Settings|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Settings" type="SettingsOverridesType" minOccurs="0"/>
    
```

## SetupEntryPoint Element
A privileged entry point that runs with the same credentials as Service Fabric (typically the LocalSystem account) before any other entry point. The executable specified by EntryPoint is typically the long-running service host. The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|SetupEntryPoint|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|ExeHost|
|type|ExeHostEntryPointType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ExeHost" type="ExeHostEntryPointType"/>
          
```

## SharedLogFileId Element
Specific GUID to use as the shared log id.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|SharedLogFileId|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|Value|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Value" use="required">
            <xs:simpleType>
              <xs:restriction base="xs:string">
                <xs:pattern value="[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}"/>
              </xs:restriction>
            </xs:simpleType>
          </xs:attribute>
         
```


## SharedLogFilePath Element
Defines path to shared log.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|SharedLogFilePath|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|Value|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Value" type="xs:string" use="required"/>
        
```


## SharedLogFileSizeInMB Element
Defines how large is the shared log.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|SharedLogFileSizeInMB|
|minOccurs|0|

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
|Attribute|Value|
|---|---|
|name|Value|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Value" use="required">
            <xs:simpleType>
              <xs:restriction base="xs:int">
                <xs:minInclusive value="512"/>
              </xs:restriction>
            </xs:simpleType>
          </xs:attribute>
        
```


## SingletonPartition Element
Declares that this service has only one partition.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|SingletonPartition|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SingletonPartition">
                <xs:annotation>
                    <xs:documentation>Declares that this service has only one partition.</xs:documentation>
                </xs:annotation>
                <xs:complexType/>
            </xs:element>
            
```

## StatefulService Element
|Attribute|Value|
|---|---|
|type|[StatefulServiceType](#statefulservicetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulService|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulService" type="StatefulServiceType"/>
            
```

## StatefulService Element
|Attribute|Value|
|---|---|
|type|[StatefulServiceType](#statefulservicetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulService|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulService" type="StatefulServiceType"/>
                        
```

## StatefulServiceGroup Element
|Attribute|Value|
|---|---|
|type|[StatefulServiceGroupType](#statefulservicegrouptype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceGroup|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceGroup" type="StatefulServiceGroupType"/>
        
```

## StatefulServiceGroup Element
|Attribute|Value|
|---|---|
|type|[StatefulServiceGroupType](#statefulservicegrouptype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceGroup|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceGroup" type="StatefulServiceGroupType"/>
                        
```

## StatefulServiceGroupType Element
|Attribute|Value|
|---|---|
|type|[StatefulServiceGroupTypeType](#statefulservicegrouptypetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceGroupType|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceGroupType" type="StatefulServiceGroupTypeType"/>
      
```

## StatefulServiceType Element
|Attribute|Value|
|---|---|
|type|[StatefulServiceTypeType](#statefulservicetypetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceType|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceType" type="StatefulServiceTypeType"/>
      
```

## StatefulServiceType Element
Describes a stateful ServiceType.|

|Attribute|Value|
|---|---|
|type|[StatefulServiceTypeType](#statefulservicetypetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceType|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceType" type="StatefulServiceTypeType">
        <xs:annotation>
          <xs:documentation>Describes a stateful ServiceType.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

## StatelessService Element
|Attribute|Value|
|---|---|
|type|[StatelessServiceType](#statelessservicetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessService|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessService" type="StatelessServiceType"/>
            
```

## StatelessService Element
|Attribute|Value|
|---|---|
|type|[StatelessServiceType](#statelessservicetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessService|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessService" type="StatelessServiceType"/>
                            
```

## StatelessServiceGroup Element
|Attribute|Value|
|---|---|
|type|[StatelessServiceGroupType](#statelessservicegrouptype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceGroup|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceGroup" type="StatelessServiceGroupType"/>
            
```

## StatelessServiceGroup Element
|Attribute|Value|
|---|---|
|type|[StatelessServiceGroupType](#statelessservicegrouptype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceGroup|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceGroup" type="StatelessServiceGroupType"/>
                            
```

## StatelessServiceGroupType Element
|Attribute|Value|
|---|---|
|type|[StatelessServiceGroupTypeType](#statelessservicegrouptypetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceGroupType|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceGroupType" type="StatelessServiceGroupTypeType"/>
    
```

## StatelessServiceType Element
|Attribute|Value|
|---|---|
|type|[StatelessServiceTypeType](#statelessservicetypetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceType|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceType" type="StatelessServiceTypeType"/>
      
```

## StatelessServiceType Element
Describes a stateless ServiceType.|

|Attribute|Value|
|---|---|
|type|[StatelessServiceTypeType](#statelessservicetypetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceType|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceType" type="StatelessServiceTypeType">
        <xs:annotation>
          <xs:documentation>Describes a stateless ServiceType.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```

## SystemGroup Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|SystemGroup|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required"/>
                                                    
```


## SystemGroup Element
The system group to add the user to.  The system group must be defined in the Groups section.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|SystemGroup|
|minOccurs|0|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required">
                                                                                                                        <xs:annotation>
                                                                                                                                <xs:documentation>The name of the system group.</xs:documentation>
                                                                                                                        </xs:annotation>
                                                                                                                </xs:attribute>
                                                                                                        
```


## TargetInformation Element
Describes the target the FabricDeployer needs to deploy.|

|Attribute|Value|
|---|---|
|type|[TargetInformationType](#targetinformationtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|TargetInformation|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="TargetInformation" type="TargetInformationType">
                <xs:annotation>
                        <xs:documentation>Describes the target the FabricDeployer needs to deploy.</xs:documentation>
                </xs:annotation>
        </xs:element>
        
```

## TargetInstallation Element
|Attribute|Value|
|---|---|
|type|[WindowsFabricDeploymentInformation](#windowsfabricdeploymentinformation-type)|
|content|0 element(s), 0 attribute(s)|
|name|TargetInstallation|
|minOccurs|1|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="TargetInstallation" type="WindowsFabricDeploymentInformation" minOccurs="1"/>
    
```

## UniformInt64Partition Element
Describes a uniform partitioning scheme based on Int64 keys.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 3 attribute(s)|
|name|UniformInt64Partition|

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
|Attribute|Value|
|---|---|
|name|PartitionCount|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PartitionCount" type="xs:string" use="required">
                        <xs:annotation>
                            <xs:documentation>Total number of partitions (positive integer). Each partition is responsible for a non-overlapping subrange of the overall partition key range.</xs:documentation>
                        </xs:annotation>
                    </xs:attribute>
                    
```

#### LowKey
|Attribute|Value|
|---|---|
|name|LowKey|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LowKey" type="xs:string" use="required">
                        <xs:annotation>
                            <xs:documentation>Inclusive low range of the partition key (long).</xs:documentation>
                        </xs:annotation>
                    </xs:attribute>
                    
```

#### HighKey
|Attribute|Value|
|---|---|
|name|HighKey|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="HighKey" type="xs:string" use="required">
                        <xs:annotation>
                            <xs:documentation>Inclusive high range of the partition key (long).</xs:documentation>
                        </xs:annotation>
                    </xs:attribute>
                
```


## UnmanagedDll Element
|Attribute|Value|
|---|---|
|type|[UnmanagedDllType](#unmanageddlltype-type)|
|content|0 element(s), 0 attribute(s)|
|name|UnmanagedDll|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UnmanagedDll" type="UnmanagedDllType"/>
        
```

## UpgradeOrchestrationServiceReplicatorEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|UpgradeOrchestrationServiceReplicatorEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UpgradeOrchestrationServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

## UpgradeServiceReplicatorEndpoint Element
|Attribute|Value|
|---|---|
|type|[InternalEndpointType](#internalendpointtype-type)|
|content|0 element(s), 0 attribute(s)|
|name|UpgradeServiceReplicatorEndpoint|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UpgradeServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

## User Element
Declares a user as a security principal, which can be referenced in policies.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 5 attribute(s)|
|name|User|
|maxOccurs|unbounded|

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
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required">
                                                                        <xs:annotation>
                                                                                <xs:documentation>Name of the user account.</xs:documentation>
                                                                        </xs:annotation>
                                                                </xs:attribute>
                                                                
```

#### AccountType
|Attribute|Value|
|---|---|
|name|AccountType|
|use|optional|
|default|LocalUser|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AccountType" use="optional" default="LocalUser">
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
                                                                
```

#### LoadUserProfile
|Attribute|Value|
|---|---|
|name|LoadUserProfile|
|type|xs:boolean|
|use|optional|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadUserProfile" type="xs:boolean" use="optional" default="false"/>
                                                                
```

#### PerformInteractiveLogon
|Attribute|Value|
|---|---|
|name|PerformInteractiveLogon|
|type|xs:boolean|
|use|optional|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PerformInteractiveLogon" type="xs:boolean" use="optional" default="false"/>
                                                                
```

#### PasswordEncrypted
|Attribute|Value|
|---|---|
|name|PasswordEncrypted|
|type|xs:boolean|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PasswordEncrypted" type="xs:boolean" use="optional">
                                                                        <xs:annotation>
                                                                                <xs:documentation>True if the password is encrypted; false if in plain text.</xs:documentation>
                                                                        </xs:annotation>
                                                                </xs:attribute>
                                                        
```

### Content element details

#### NTLMAuthenticationPolicy
|Attribute|Value|
|---|---|
|name|NTLMAuthenticationPolicy|
|minOccurs|0|

##### XML source
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

#### MemberOf

                        Users can be added to any existing membership group, so it can inherit all the properties and security settings of that membership group. The membership group can be used to secure external resources that need to be accessed by different services or the same service (on a different machine).
                      
|Attribute|Value|
|---|---|
|name|MemberOf|
|minOccurs|0|

##### XML source
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

## UserRoleClientCertificate Element
The default user role client certificate used to secure client server communication.|

|Attribute|Value|
|---|---|
|type|[FabricCertificateType](#fabriccertificatetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|UserRoleClientCertificate|
|minOccurs|0|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UserRoleClientCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The default user role client certificate used to secure client server communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```

## Users Element
Declares a set of users as security principals, which can be referenced in policies.|

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Users|
|minOccurs|0|

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
Declares a user as a security principal, which can be referenced in policies.
|Attribute|Value|
|---|---|
|name|User|
|maxOccurs|unbounded|

##### XML source
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

## Volume Element
Specifies the volume to be bound to container.|

|Attribute|Value|
|---|---|
|type|[ContainerVolumeType](#containervolumetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Volume|
|minOccurs|0|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Volume" type="ContainerVolumeType" minOccurs="0" maxOccurs="unbounded">
            <xs:annotation>
                <xs:documentation>Specifies the volume to be bound to container.</xs:documentation>
            </xs:annotation>
        </xs:element>
      
```

## Vote Element
|Attribute|Value|
|---|---|
|type|[PaaSVoteType](#paasvotetype-type)|
|content|0 element(s), 0 attribute(s)|
|name|Vote|
|maxOccurs|unbounded|

### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Vote" type="PaaSVoteType" maxOccurs="unbounded"/>
                                                                                        
```

## Votes Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|Votes|

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
|Attribute|Value|
|---|---|
|name|Vote|
|type|PaaSVoteType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Vote" type="PaaSVoteType" maxOccurs="unbounded"/>
                                                                                        
```

## WindowsAzure Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|WindowsAzure|

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
|Attribute|Value|
|---|---|
|name|Roles|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Roles">
                                                                                <xs:complexType>
                                                                                        <xs:sequence>
                                                                                                <xs:element name="Role" type="AzureRoleType" maxOccurs="unbounded"/>
                                                                                        </xs:sequence>
                                                                                </xs:complexType>
                                                                        </xs:element>
                                                                
```

## WindowsAzureStaticTopology Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|WindowsAzureStaticTopology|

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

## WindowsServer Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|WindowsServer|

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

## WorkingFolder Element
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|WorkingFolder|
|default|Work|
|minOccurs|0|

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

## AppInstanceDefinitionType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 1 attribute(s)|
|name|AppInstanceDefinitionType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AppInstanceDefinitionType">
    <xs:sequence>
      <xs:element name="Parameters">
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
    </xs:sequence>
    <xs:attribute name="Name" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Name of the application to be created.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>

```
### Attribute details

#### Name
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Name of the application to be created.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

### Content element details

#### Parameters
List of parameters for the application as defined in application manifest and their respective values.
|Attribute|Value|
|---|---|
|name|Parameters|

##### XML source
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
## ApplicationHealthPolicyType complexType
Describes the policy for evaluating health events reported on various application related entities. If no policy is specified, an entity is assumed to be unhealthy if the health report is a warning or error.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 2 attribute(s)|
|name|ApplicationHealthPolicyType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationHealthPolicyType">
    <xs:annotation>
      <xs:documentation>Describes the policy for evaluating health events reported on various application related entities. If no policy is specified, an entity is assumed to be unhealthy if the health report is a warning or error.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="DefaultServiceTypeHealthPolicy" type="ServiceTypeHealthPolicyType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies the default service type health policy, which will replace the default health policy for all service types in the application.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="ServiceTypeHealthPolicy" minOccurs="0" maxOccurs="unbounded">
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
    </xs:sequence>
    <xs:attribute name="ConsiderWarningAsError" type="xs:string" use="optional" default="false">
      <xs:annotation>
        <xs:documentation>Specifies whether to treat warning health reports as errors during health evaluation. Default: false.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="MaxPercentUnhealthyDeployedApplications" type="xs:string" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Specifies the maximum tolerated percentage of deployed applications that can be unhealthy before the application is considered in error. This is calculated by dividing the number of unhealthy deployed applications over the number of nodes that the applications are currently deployed on in the cluster. The computation rounds up to tolerate one failure on small numbers of nodes. Default percentage: 0.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### ConsiderWarningAsError
List of parameters for the application as defined in application manifest and their respective values.
|Attribute|Value|
|---|---|
|name|ConsiderWarningAsError|
|type|xs:string|
|use|optional|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConsiderWarningAsError" type="xs:string" use="optional" default="false">
      <xs:annotation>
        <xs:documentation>Specifies whether to treat warning health reports as errors during health evaluation. Default: false.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### MaxPercentUnhealthyDeployedApplications
List of parameters for the application as defined in application manifest and their respective values.
|Attribute|Value|
|---|---|
|name|MaxPercentUnhealthyDeployedApplications|
|type|xs:string|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MaxPercentUnhealthyDeployedApplications" type="xs:string" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Specifies the maximum tolerated percentage of deployed applications that can be unhealthy before the application is considered in error. This is calculated by dividing the number of unhealthy deployed applications over the number of nodes that the applications are currently deployed on in the cluster. The computation rounds up to tolerate one failure on small numbers of nodes. Default percentage: 0.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

### Content element details

#### DefaultServiceTypeHealthPolicy
Specifies the default service type health policy, which will replace the default health policy for all service types in the application.
|Attribute|Value|
|---|---|
|name|DefaultServiceTypeHealthPolicy|
|type|ServiceTypeHealthPolicyType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultServiceTypeHealthPolicy" type="ServiceTypeHealthPolicyType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies the default service type health policy, which will replace the default health policy for all service types in the application.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### ServiceTypeHealthPolicy
Describes the policy for evaluating health events reported on services, partitions and replicas of a particular service type.
|Attribute|Value|
|---|---|
|name|ServiceTypeHealthPolicy|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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
## ApplicationInstanceType complexType
Describes an instance of a Microsoft Azure Service Fabric application.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|4 element(s), 1 attribute(s)|
|name|ApplicationInstanceType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationInstanceType">
    <xs:annotation>
      <xs:documentation>Describes an instance of a Microsoft Azure Service Fabric application.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="ApplicationPackageRef">
        <xs:complexType>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
        </xs:complexType>
      </xs:element>
      <xs:element name="ServicePackageRef" maxOccurs="unbounded">
        <xs:complexType>
          <xs:attribute name="Name" use="required"/>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
        </xs:complexType>
      </xs:element>
      <xs:element name="ServiceTemplates" type="ServiceTemplatesType"/>
      <xs:element name="DefaultServices" type="DefaultServicesType"/>
    </xs:sequence>
    <xs:attribute name="Version" type="xs:int" use="required">
      <xs:annotation>
        <xs:documentation>The version of the ApplicationInstance document.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attributeGroup ref="ApplicationInstanceAttrGroup"/>
    <xs:attributeGroup ref="ApplicationManifestAttrGroup"/>
  </xs:complexType>
  
```
### Attribute details

#### Version
Describes the policy for evaluating health events reported on services, partitions and replicas of a particular service type.
|Attribute|Value|
|---|---|
|name|Version|
|type|xs:int|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Version" type="xs:int" use="required">
      <xs:annotation>
        <xs:documentation>The version of the ApplicationInstance document.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

### Content element details

#### ApplicationPackageRef
|Attribute|Value|
|---|---|
|name|ApplicationPackageRef|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationPackageRef">
        <xs:complexType>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
        </xs:complexType>
      </xs:element>
      
```

#### ServicePackageRef
|Attribute|Value|
|---|---|
|name|ServicePackageRef|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageRef" maxOccurs="unbounded">
        <xs:complexType>
          <xs:attribute name="Name" use="required"/>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
        </xs:complexType>
      </xs:element>
      
```

#### ServiceTemplates
|Attribute|Value|
|---|---|
|name|ServiceTemplates|
|type|ServiceTemplatesType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTemplates" type="ServiceTemplatesType"/>
      
```

#### DefaultServices
|Attribute|Value|
|---|---|
|name|DefaultServices|
|type|DefaultServicesType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultServices" type="DefaultServicesType"/>
    
```
## ApplicationManifestType complexType
Declaratively describes the application type and version. One or more service manifests of the constituent services are referenced to compose an application type. Configuration settings of the constituent services can be overridden using parameterized application settings. Default services, service templates, principals, policies, diagnostics set-up, and certificates can also declared at the application level.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|9 element(s), 0 attribute(s)|
|name|ApplicationManifestType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationManifestType">
    <xs:annotation>
      <xs:documentation>Declaratively describes the application type and version. One or more service manifests of the constituent services are referenced to compose an application type. Configuration settings of the constituent services can be overridden using parameterized application settings. Default services, service templates, principals, policies, diagnostics set-up, and certificates can also declared at the application level.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="Description" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Text describing this application.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="Parameters" minOccurs="0">
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
      <xs:element name="ServiceManifestImport" maxOccurs="unbounded">
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
      <xs:element name="ServiceTemplates" type="ServiceTemplatesType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Declares the set of permitted service types that can be created dynamically inside the application instance. Default configuration values, such as replication factor, are specified and used as a template for creating service instances.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="DefaultServices" type="DefaultServicesType" minOccurs="0">

      </xs:element>
      <xs:element name="Principals" type="SecurityPrincipalsType" minOccurs="0"/>
      <xs:element name="Policies" type="ApplicationPoliciesType" minOccurs="0"/>
      <xs:element name="Diagnostics" type="DiagnosticsType" minOccurs="0"/>
      <xs:element name="Certificates" minOccurs="0">
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
    </xs:sequence>
    <xs:attributeGroup ref="ApplicationManifestAttrGroup"/>

  </xs:complexType>
  
```
### Content element details

#### Description
Text describing this application.
|Attribute|Value|
|---|---|
|name|Description|
|type|xs:string|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Description" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Text describing this application.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### Parameters
Declares the parameters that are used in this application manifest. The value of these parameters can be supplied when the application is instantiated and can be used to override application or service configuration settings.
|Attribute|Value|
|---|---|
|name|Parameters|
|minOccurs|0|

##### XML source
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

#### ServiceManifestImport
Imports a service manifest created by the service developer. A service manifest must be imported for each constituent service in the application. Configuration overrides and policies can be declared for the service manifest.
|Attribute|Value|
|---|---|
|name|ServiceManifestImport|
|maxOccurs|unbounded|

##### XML source
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

#### ServiceTemplates
Declares the set of permitted service types that can be created dynamically inside the application instance. Default configuration values, such as replication factor, are specified and used as a template for creating service instances.
|Attribute|Value|
|---|---|
|name|ServiceTemplates|
|type|ServiceTemplatesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTemplates" type="ServiceTemplatesType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Declares the set of permitted service types that can be created dynamically inside the application instance. Default configuration values, such as replication factor, are specified and used as a template for creating service instances.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### DefaultServices
|Attribute|Value|
|---|---|
|name|DefaultServices|
|type|DefaultServicesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultServices" type="DefaultServicesType" minOccurs="0">

      </xs:element>
      
```

#### Principals
|Attribute|Value|
|---|---|
|name|Principals|
|type|SecurityPrincipalsType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Principals" type="SecurityPrincipalsType" minOccurs="0"/>
      
```

#### Policies
|Attribute|Value|
|---|---|
|name|Policies|
|type|ApplicationPoliciesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Policies" type="ApplicationPoliciesType" minOccurs="0"/>
      
```

#### Diagnostics
|Attribute|Value|
|---|---|
|name|Diagnostics|
|type|DiagnosticsType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Diagnostics" type="DiagnosticsType" minOccurs="0"/>
      
```

#### Certificates
Declares certificates used to secure endpoints or encrypt secrets within the application manifest or a cluster manifest.
|Attribute|Value|
|---|---|
|name|Certificates|
|minOccurs|0|

##### XML source
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
## ApplicationPackageType complexType
ApplicationPackage represents the versioned Application information required by the node.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 2 attribute(s)|
|name|ApplicationPackageType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationPackageType">
    <xs:annotation>
      <xs:documentation>ApplicationPackage represents the versioned Application information required by the node.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="DigestedEnvironment" type="EnvironmentType"/>
      <xs:element name="DigestedCertificates">
        <xs:complexType>
          <xs:sequence maxOccurs="unbounded">
            <xs:element name="SecretsCertificate" type="FabricCertificateType" minOccurs="0"/>
            <xs:element name="EndpointCertificate" type="EndpointCertificateType" minOccurs="0"/>
          </xs:sequence>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
        </xs:complexType>
      </xs:element>
    </xs:sequence>
    <xs:attribute name="ApplicationTypeName" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Type identifier for this application.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attributeGroup ref="VersionedItemAttrGroup"/>
    <xs:attributeGroup ref="ApplicationInstanceAttrGroup"/>
    <xs:attribute name="ContentChecksum" type="xs:string">
      <xs:annotation>
        <xs:documentation>Checksum value of this ApplicationPackage content</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### ApplicationTypeName
Declares certificates used to secure endpoints or encrypt secrets within the application manifest or a cluster manifest.
|Attribute|Value|
|---|---|
|name|ApplicationTypeName|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationTypeName" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Type identifier for this application.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### ContentChecksum
Declares certificates used to secure endpoints or encrypt secrets within the application manifest or a cluster manifest.
|Attribute|Value|
|---|---|
|name|ContentChecksum|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContentChecksum" type="xs:string">
      <xs:annotation>
        <xs:documentation>Checksum value of this ApplicationPackage content</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

### Content element details

#### DigestedEnvironment
|Attribute|Value|
|---|---|
|name|DigestedEnvironment|
|type|EnvironmentType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DigestedEnvironment" type="EnvironmentType"/>
      
```

#### DigestedCertificates
|Attribute|Value|
|---|---|
|name|DigestedCertificates|

##### XML source
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
## ApplicationPoliciesType complexType
Describes the policies (log collection, default run-as, health, and security access) to be applied at the application level.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|4 element(s), 0 attribute(s)|
|name|ApplicationPoliciesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationPoliciesType">
                <xs:annotation>
                        <xs:documentation>Describes the policies (log collection, default run-as, health, and security access) to be applied at the application level.</xs:documentation>
                </xs:annotation>
                <xs:all>
                        <xs:element name="LogCollectionPolicies" minOccurs="0">
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
                        <xs:element name="DefaultRunAsPolicy" minOccurs="0">
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
                        <xs:element name="HealthPolicy" type="ApplicationHealthPolicyType" minOccurs="0"/>
                        <xs:element name="SecurityAccessPolicies" minOccurs="0">
                                <xs:annotation>
                                        <xs:documentation>List of security policies applied to resources at the application level.</xs:documentation>
                                </xs:annotation>
                                <xs:complexType>
                                        <xs:sequence maxOccurs="unbounded">
                                                <xs:element name="SecurityAccessPolicy" type="SecurityAccessPolicyType"/>
                                        </xs:sequence>
                                </xs:complexType>
                        </xs:element>
                </xs:all>
        </xs:complexType>
        
```
### Content element details

#### LogCollectionPolicies
Specifies whether log collection is enabled. Works only in an Azure cluster environment
|Attribute|Value|
|---|---|
|name|LogCollectionPolicies|
|minOccurs|0|

##### XML source
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

#### DefaultRunAsPolicy
Specify a default user account for all service code packages that don’t have a specific RunAsPolicy defined in the ServiceManifestImport section.
|Attribute|Value|
|---|---|
|name|DefaultRunAsPolicy|
|minOccurs|0|

##### XML source
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

#### HealthPolicy
|Attribute|Value|
|---|---|
|name|HealthPolicy|
|type|ApplicationHealthPolicyType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="HealthPolicy" type="ApplicationHealthPolicyType" minOccurs="0"/>
                        
```

#### SecurityAccessPolicies
List of security policies applied to resources at the application level.
|Attribute|Value|
|---|---|
|name|SecurityAccessPolicies|
|minOccurs|0|

##### XML source
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
## AzureBlobETWType complexType
Describes an Azure blob store destination for ETW events. Works only in Azure environment.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|AzureBlobETWType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureBlobETWType">
    <xs:annotation>
      <xs:documentation>Describes an Azure blob store destination for ETW events. Works only in Azure environment.</xs:documentation>
    </xs:annotation>
    <xs:complexContent>
      <xs:extension base="AzureBlobType">
        <xs:attributeGroup ref="LevelFilter"/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
  
```
## AzureBlobType complexType
Describes an Azure blob store destination for diagnostics data. Works only in Azure cluster environment.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|AzureBlobType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureBlobType">
    <xs:annotation>
      <xs:documentation>Describes an Azure blob store destination for diagnostics data. Works only in Azure cluster environment.</xs:documentation>
    </xs:annotation>
    <xs:complexContent>
      <xs:extension base="AzureStoreBaseType">
        <xs:attributeGroup ref="ContainerName"/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
  
```
## AzureRoleType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 3 attribute(s)|
|name|AzureRoleType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureRoleType">
    <xs:attribute name="RoleName" type="xs:string" use="required"/>
    <xs:attribute name="NodeTypeRef" type="xs:string" use="required"/>
    <xs:attribute name="SeedNodeCount" type="xs:int" use="optional" default="0"/>
  </xs:complexType>
  
```
### Attribute details

#### RoleName
List of security policies applied to resources at the application level.
|Attribute|Value|
|---|---|
|name|RoleName|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RoleName" type="xs:string" use="required"/>
    
```

#### NodeTypeRef
List of security policies applied to resources at the application level.
|Attribute|Value|
|---|---|
|name|NodeTypeRef|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeTypeRef" type="xs:string" use="required"/>
    
```

#### SeedNodeCount
List of security policies applied to resources at the application level.
|Attribute|Value|
|---|---|
|name|SeedNodeCount|
|type|xs:int|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SeedNodeCount" type="xs:int" use="optional" default="0"/>
  
```

## AzureStoreBaseType complexType
Describes a diagnostic store in an Azure storage account.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 1 attribute(s)|
|name|AzureStoreBaseType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AzureStoreBaseType">
    <xs:annotation>
      <xs:documentation>Describes a diagnostic store in an Azure storage account.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element ref="Parameters" minOccurs="0"/>
    </xs:sequence>
    <xs:attributeGroup ref="IsEnabled"/>
    <xs:attributeGroup ref="ConnectionString"/>
    <xs:attribute name="ConnectionStringIsEncrypted" type="xs:string" use="required"/>
    <xs:attributeGroup ref="UploadIntervalInMinutes"/>
    <xs:attributeGroup ref="DataDeletionAgeInDays"/>
  </xs:complexType>
  
```
### Attribute details

#### ConnectionStringIsEncrypted
List of security policies applied to resources at the application level.
|Attribute|Value|
|---|---|
|name|ConnectionStringIsEncrypted|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConnectionStringIsEncrypted" type="xs:string" use="required"/>
    
```

### Content element details

#### None
|Attribute|Value|
|---|---|
|ref|Parameters|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Parameters" minOccurs="0"/>
    
```
## BlackbirdRoleType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 4 attribute(s)|
|name|BlackbirdRoleType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="BlackbirdRoleType">
    <xs:attribute name="EnvironmentName" type="xs:string" use="required"/>
    <xs:attribute name="RoleName" type="xs:string" use="required"/>
    <xs:attribute name="NodeTypeRef" type="xs:string" use="required"/>
    <xs:attribute name="IsSeedNode" type="xs:boolean" use="optional" default="0"/>
  </xs:complexType>
  
```
### Attribute details

#### EnvironmentName
|Attribute|Value|
|---|---|
|name|EnvironmentName|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentName" type="xs:string" use="required"/>
    
```

#### RoleName
|Attribute|Value|
|---|---|
|name|RoleName|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RoleName" type="xs:string" use="required"/>
    
```

#### NodeTypeRef
|Attribute|Value|
|---|---|
|name|NodeTypeRef|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeTypeRef" type="xs:string" use="required"/>
    
```

#### IsSeedNode
|Attribute|Value|
|---|---|
|name|IsSeedNode|
|type|xs:boolean|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsSeedNode" type="xs:boolean" use="optional" default="0"/>
  
```

## CertificatesType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|4 element(s), 0 attribute(s)|
|name|CertificatesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CertificatesType">
    <xs:all>
      <xs:element name="ClusterCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The certificate used to secure the intra cluster communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="ServerCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The certificate used to secure the intra cluster communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="ClientCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The default admin role client certificate used to secure client server communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="UserRoleClientCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The default user role client certificate used to secure client server communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
    </xs:all>
  </xs:complexType>
  
```
### Content element details

#### ClusterCertificate
The certificate used to secure the intra cluster communication.
|Attribute|Value|
|---|---|
|name|ClusterCertificate|
|type|FabricCertificateType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The certificate used to secure the intra cluster communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### ServerCertificate
The certificate used to secure the intra cluster communication.
|Attribute|Value|
|---|---|
|name|ServerCertificate|
|type|FabricCertificateType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServerCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The certificate used to secure the intra cluster communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### ClientCertificate
The default admin role client certificate used to secure client server communication.
|Attribute|Value|
|---|---|
|name|ClientCertificate|
|type|FabricCertificateType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClientCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The default admin role client certificate used to secure client server communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### UserRoleClientCertificate
The default user role client certificate used to secure client server communication.
|Attribute|Value|
|---|---|
|name|UserRoleClientCertificate|
|type|FabricCertificateType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UserRoleClientCertificate" type="FabricCertificateType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>The default user role client certificate used to secure client server communication.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```
## ClusterManifestType complexType
Describes a Microsoft Azure Service Fabric Cluster.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|4 element(s), 3 attribute(s)|
|name|ClusterManifestType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterManifestType">
                <xs:annotation>
                        <xs:documentation>Describes a Microsoft Azure Service Fabric Cluster.</xs:documentation>
                </xs:annotation>
                <xs:all>
                        <xs:element name="NodeTypes" minOccurs="1">
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
                        <xs:element name="Infrastructure">
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
                        <xs:element name="FabricSettings" type="SettingsOverridesType" minOccurs="0"/>
                        <xs:element name="Certificates" minOccurs="0">
                                <xs:complexType>
                                        <xs:sequence>
                                                <xs:element name="SecretsCertificate" type="FabricCertificateType" minOccurs="0"/>
                                        </xs:sequence>
                                </xs:complexType>
                        </xs:element>
                </xs:all>
                <xs:attribute name="Name" use="required">
                        <xs:annotation>
                                <xs:documentation>Name of the Cluster.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                <xs:attribute name="Version" use="required">
                        <xs:annotation>
                                <xs:documentation>User defined version string for the cluster manifest document.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                <xs:attribute name="Description">
                        <xs:annotation>
                                <xs:documentation>Description for the Cluster Manifest.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
        </xs:complexType>
        
```
### Attribute details

#### Name
The default user role client certificate used to secure client server communication.
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required">
                        <xs:annotation>
                                <xs:documentation>Name of the Cluster.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                
```

#### Version
The default user role client certificate used to secure client server communication.
|Attribute|Value|
|---|---|
|name|Version|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Version" use="required">
                        <xs:annotation>
                                <xs:documentation>User defined version string for the cluster manifest document.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                
```

#### Description
The default user role client certificate used to secure client server communication.
|Attribute|Value|
|---|---|
|name|Description|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Description">
                        <xs:annotation>
                                <xs:documentation>Description for the Cluster Manifest.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
        
```

### Content element details

#### NodeTypes
|Attribute|Value|
|---|---|
|name|NodeTypes|
|minOccurs|1|

##### XML source
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

#### Infrastructure
|Attribute|Value|
|---|---|
|name|Infrastructure|

##### XML source
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

#### FabricSettings
|Attribute|Value|
|---|---|
|name|FabricSettings|
|type|SettingsOverridesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FabricSettings" type="SettingsOverridesType" minOccurs="0"/>
                        
```

#### Certificates
|Attribute|Value|
|---|---|
|name|Certificates|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Certificates" minOccurs="0">
                                <xs:complexType>
                                        <xs:sequence>
                                                <xs:element name="SecretsCertificate" type="FabricCertificateType" minOccurs="0"/>
                                        </xs:sequence>
                                </xs:complexType>
                        </xs:element>
                
```
## CodePackageType complexType
Describes a code package that supports a defined service type. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. The resulting processes are expected to register the supported service types at run time. When there are multiple code packages, they are all activated whenever the system looks for any one of the declared service types.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|3 element(s), 1 attribute(s)|
|name|CodePackageType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackageType">
    <xs:annotation>
          <xs:documentation>Describes a code package that supports a defined service type. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. The resulting processes are expected to register the supported service types at run time. When there are multiple code packages, they are all activated whenever the system looks for any one of the declared service types.</xs:documentation>
        </xs:annotation>
    <xs:sequence>
      <xs:element name="SetupEntryPoint" minOccurs="0">
        <xs:annotation>
          <xs:documentation>A privileged entry point that runs with the same credentials as Service Fabric (typically the LocalSystem account) before any other entry point. The executable specified by EntryPoint is typically the long-running service host. The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="ExeHost" type="ExeHostEntryPointType"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="EntryPoint" type="EntryPointDescriptionType" minOccurs="1"/>
      <xs:element name="EnvironmentVariables" type="EnvironmentVariablesType" minOccurs="0" maxOccurs="1"/>

    </xs:sequence>
    <xs:attributeGroup ref="VersionedName"/>
    <xs:attribute name="IsShared" type="xs:boolean" default="false">
      <xs:annotation>
        <xs:documentation>Indicates if the contents of this code package are shared by other code packages. If true, on an upgrade of this code package, all code packages will be restarted. This attribute is currently not supported and it's value will be ignored.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### IsShared
|Attribute|Value|
|---|---|
|name|IsShared|
|type|xs:boolean|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsShared" type="xs:boolean" default="false">
      <xs:annotation>
        <xs:documentation>Indicates if the contents of this code package are shared by other code packages. If true, on an upgrade of this code package, all code packages will be restarted. This attribute is currently not supported and it's value will be ignored.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

### Content element details

#### SetupEntryPoint
A privileged entry point that runs with the same credentials as Service Fabric (typically the LocalSystem account) before any other entry point. The executable specified by EntryPoint is typically the long-running service host. The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time.
|Attribute|Value|
|---|---|
|name|SetupEntryPoint|
|minOccurs|0|

##### XML source
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

#### EntryPoint
|Attribute|Value|
|---|---|
|name|EntryPoint|
|type|EntryPointDescriptionType|
|minOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EntryPoint" type="EntryPointDescriptionType" minOccurs="1"/>
      
```

#### EnvironmentVariables
|Attribute|Value|
|---|---|
|name|EnvironmentVariables|
|type|EnvironmentVariablesType|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentVariables" type="EnvironmentVariablesType" minOccurs="0" maxOccurs="1"/>

    
```
## ConfigOverrideType complexType
Describes the configuration overrides for a particular config package in the imported service manifest.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 1 attribute(s)|
|name|ConfigOverrideType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigOverrideType">
    <xs:annotation>
      <xs:documentation>Describes the configuration overrides for a particular config package in the imported service manifest.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="Settings" type="SettingsOverridesType" minOccurs="0"/>
    </xs:sequence>
    <xs:attribute name="Name" use="required">
      <xs:annotation>
        <xs:documentation>The name of the configuration package in the service manifest which contains the setting(s) to be overridden.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### Name
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required">
      <xs:annotation>
        <xs:documentation>The name of the configuration package in the service manifest which contains the setting(s) to be overridden.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

### Content element details

#### Settings
|Attribute|Value|
|---|---|
|name|Settings|
|type|SettingsOverridesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Settings" type="SettingsOverridesType" minOccurs="0"/>
    
```
## ConfigPackageType complexType
Declares a folder, named by the Name attribute, that contains a Settings.xml file. This file contains sections of user-defined, key-value pair settings that the process can read back at run time. During an upgrade, if only the ConfigPackage version has changed, then the running process is not restarted. Instead, a callback notifies the process that configuration settings have changed so they can be reloaded dynamically.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|ConfigPackageType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigPackageType">
    <xs:annotation>
          <xs:documentation>Declares a folder, named by the Name attribute, that contains a Settings.xml file. This file contains sections of user-defined, key-value pair settings that the process can read back at run time. During an upgrade, if only the ConfigPackage version has changed, then the running process is not restarted. Instead, a callback notifies the process that configuration settings have changed so they can be reloaded dynamically.</xs:documentation>
        </xs:annotation>
    <xs:attributeGroup ref="VersionedName"/>
  </xs:complexType>
  
```
## ContainerCertificateType complexType
Specifies information about an X509 certificate which is to be exposed to the container environment.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 8 attribute(s)|
|name|ContainerCertificateType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerCertificateType">
    <xs:annotation>
        <xs:documentation>Specifies information about an X509 certificate which is to be exposed to the container environment.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="X509StoreName" type="xs:string" default="My">
        <xs:annotation>
            <xs:documentation>The store name for the X509 certificate.</xs:documentation>
        </xs:annotation>
    </xs:attribute>
    <xs:attribute name="X509FindValue" type="xs:string" use="optional">
        <xs:annotation>
            <xs:documentation>The thumbprint of the X509 certificate.</xs:documentation>
        </xs:annotation>
    </xs:attribute>
    <xs:attribute name="DataPackageRef" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>The name of data package that has the certificate files.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="DataPackageVersion" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>The version of data package that has the certificate files.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="RelativePath" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>The relative path to the certificate file inside data package.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="Password" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>Password/Private key for the certificate.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="IsPasswordEncrypted" type="xs:boolean" default="false">
        <xs:annotation>
           <xs:documentation>If true, the value of password is encrypted.</xs:documentation>
        </xs:annotation>
    </xs:attribute>
    <xs:attribute name="Name" type="xs:string" use="required">
        <xs:annotation>
            <xs:documentation>Identifier for the specific certificate information. This name is used to set the environment variable in the container.</xs:documentation>
        </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### X509StoreName
|Attribute|Value|
|---|---|
|name|X509StoreName|
|type|xs:string|
|default|My|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="X509StoreName" type="xs:string" default="My">
        <xs:annotation>
            <xs:documentation>The store name for the X509 certificate.</xs:documentation>
        </xs:annotation>
    </xs:attribute>
    
```

#### X509FindValue
|Attribute|Value|
|---|---|
|name|X509FindValue|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="X509FindValue" type="xs:string" use="optional">
        <xs:annotation>
            <xs:documentation>The thumbprint of the X509 certificate.</xs:documentation>
        </xs:annotation>
    </xs:attribute>
    
```

#### DataPackageRef
|Attribute|Value|
|---|---|
|name|DataPackageRef|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DataPackageRef" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>The name of data package that has the certificate files.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### DataPackageVersion
|Attribute|Value|
|---|---|
|name|DataPackageVersion|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DataPackageVersion" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>The version of data package that has the certificate files.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### RelativePath
|Attribute|Value|
|---|---|
|name|RelativePath|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RelativePath" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>The relative path to the certificate file inside data package.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### Password
|Attribute|Value|
|---|---|
|name|Password|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Password" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>Password/Private key for the certificate.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### IsPasswordEncrypted
|Attribute|Value|
|---|---|
|name|IsPasswordEncrypted|
|type|xs:boolean|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsPasswordEncrypted" type="xs:boolean" default="false">
        <xs:annotation>
           <xs:documentation>If true, the value of password is encrypted.</xs:documentation>
        </xs:annotation>
    </xs:attribute>
    
```

#### Name
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required">
        <xs:annotation>
            <xs:documentation>Identifier for the specific certificate information. This name is used to set the environment variable in the container.</xs:documentation>
        </xs:annotation>
    </xs:attribute>
  
```

## ContainerHostEntryPointType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|4 element(s), 0 attribute(s)|
|name|ContainerHostEntryPointType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerHostEntryPointType">
    <xs:sequence>
      <!--container image name-->
      <xs:element name="ImageName" type="xs:string"/>
      <!--comma delimited list of commands for container-->
      <xs:element name="Commands" type="xs:string" minOccurs="0" maxOccurs="1"/>
      <xs:element name="EntryPoint" type="xs:string" minOccurs="0" maxOccurs="1"/>
      <xs:element name="FromSource" type="xs:string" minOccurs="0" maxOccurs="1"/>
    </xs:sequence>
  </xs:complexType>
  
```
### Content element details

#### ImageName
|Attribute|Value|
|---|---|
|name|ImageName|
|type|xs:string|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ImageName" type="xs:string"/>
      
```

#### Commands
|Attribute|Value|
|---|---|
|name|Commands|
|type|xs:string|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Commands" type="xs:string" minOccurs="0" maxOccurs="1"/>
      
```

#### EntryPoint
|Attribute|Value|
|---|---|
|name|EntryPoint|
|type|xs:string|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EntryPoint" type="xs:string" minOccurs="0" maxOccurs="1"/>
      
```

#### FromSource
|Attribute|Value|
|---|---|
|name|FromSource|
|type|xs:string|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FromSource" type="xs:string" minOccurs="0" maxOccurs="1"/>
    
```
## ContainerHostPoliciesType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|7 element(s), 3 attribute(s)|
|name|ContainerHostPoliciesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerHostPoliciesType">
    <xs:choice minOccurs="0" maxOccurs="unbounded">
      <xs:element name="RepositoryCredentials" type="RepositoryCredentialsType" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Credentials for container image repository to pull images from.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="PortBinding" type="PortBindingType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies which endpoint resource to bind container exposed port.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="CertificateRef" type="ContainerCertificateType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies information for a certificate which will be exposed to the container.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="LogConfig" type="ContainerLoggingDriverType" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Specifies the logging driver for a container.</xs:documentation>
        </xs:annotation>
      </xs:element>
        <xs:element name="NetworkConfig" type="ContainerNetworkConfigType" minOccurs="0" maxOccurs="1">
            <xs:annotation>
                <xs:documentation>Specifies the network configuration for a container.</xs:documentation>
            </xs:annotation>
        </xs:element>
        <xs:element name="Volume" type="ContainerVolumeType" minOccurs="0" maxOccurs="unbounded">
            <xs:annotation>
                <xs:documentation>Specifies the volume to be bound to container.</xs:documentation>
            </xs:annotation>
        </xs:element>
      <xs:element name="SecurityOption" type="SecurityOptionsType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies securityoptions for the container.</xs:documentation>
        </xs:annotation>
      </xs:element>
    </xs:choice>
    <xs:attribute name="CodePackageRef" use="required">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
      <xs:attribute name="Isolation" use="optional" type="xs:string">
          <xs:annotation>
              <xs:documentation>Isolation mode for container. Valid values are default, process or hyperv (only supported for windows containers).</xs:documentation>
          </xs:annotation>
      </xs:attribute>
      <xs:attribute name="Hostname" use="optional" type="xs:string">
          <xs:annotation>
              <xs:documentation>Specify Hostname for container.</xs:documentation>
          </xs:annotation>
      </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### CodePackageRef
|Attribute|Value|
|---|---|
|name|CodePackageRef|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackageRef" use="required">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
      
```

#### Isolation
|Attribute|Value|
|---|---|
|name|Isolation|
|use|optional|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Isolation" use="optional" type="xs:string">
          <xs:annotation>
              <xs:documentation>Isolation mode for container. Valid values are default, process or hyperv (only supported for windows containers).</xs:documentation>
          </xs:annotation>
      </xs:attribute>
      
```

#### Hostname
|Attribute|Value|
|---|---|
|name|Hostname|
|use|optional|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Hostname" use="optional" type="xs:string">
          <xs:annotation>
              <xs:documentation>Specify Hostname for container.</xs:documentation>
          </xs:annotation>
      </xs:attribute>
  
```

### Content element details

#### RepositoryCredentials
Credentials for container image repository to pull images from.
|Attribute|Value|
|---|---|
|name|RepositoryCredentials|
|type|RepositoryCredentialsType|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RepositoryCredentials" type="RepositoryCredentialsType" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Credentials for container image repository to pull images from.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### PortBinding
Specifies which endpoint resource to bind container exposed port.
|Attribute|Value|
|---|---|
|name|PortBinding|
|type|PortBindingType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PortBinding" type="PortBindingType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies which endpoint resource to bind container exposed port.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### CertificateRef
Specifies information for a certificate which will be exposed to the container.
|Attribute|Value|
|---|---|
|name|CertificateRef|
|type|ContainerCertificateType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CertificateRef" type="ContainerCertificateType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies information for a certificate which will be exposed to the container.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### LogConfig
Specifies the logging driver for a container.
|Attribute|Value|
|---|---|
|name|LogConfig|
|type|ContainerLoggingDriverType|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LogConfig" type="ContainerLoggingDriverType" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Specifies the logging driver for a container.</xs:documentation>
        </xs:annotation>
      </xs:element>
        
```

#### NetworkConfig
Specifies the network configuration for a container.
|Attribute|Value|
|---|---|
|name|NetworkConfig|
|type|ContainerNetworkConfigType|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NetworkConfig" type="ContainerNetworkConfigType" minOccurs="0" maxOccurs="1">
            <xs:annotation>
                <xs:documentation>Specifies the network configuration for a container.</xs:documentation>
            </xs:annotation>
        </xs:element>
        
```

#### Volume
Specifies the volume to be bound to container.
|Attribute|Value|
|---|---|
|name|Volume|
|type|ContainerVolumeType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Volume" type="ContainerVolumeType" minOccurs="0" maxOccurs="unbounded">
            <xs:annotation>
                <xs:documentation>Specifies the volume to be bound to container.</xs:documentation>
            </xs:annotation>
        </xs:element>
      
```

#### SecurityOption
Specifies securityoptions for the container.
|Attribute|Value|
|---|---|
|name|SecurityOption|
|type|SecurityOptionsType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityOption" type="SecurityOptionsType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Specifies securityoptions for the container.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```
## ContainerLoggingDriverType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 1 attribute(s)|
|name|ContainerLoggingDriverType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerLoggingDriverType">
      <xs:choice minOccurs="0" maxOccurs="unbounded">
          <xs:element name="DriverOption" type="DriverOptionType" minOccurs="0" maxOccurs="unbounded">
              <xs:annotation>
                  <xs:documentation>Driver options to be passed to driver.</xs:documentation>
              </xs:annotation>
          </xs:element>
      </xs:choice>
    <xs:attribute name="Driver" use="required">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### Driver
Specifies securityoptions for the container.
|Attribute|Value|
|---|---|
|name|Driver|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Driver" use="required">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

### Content element details

#### DriverOption
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|DriverOption|
|type|DriverOptionType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DriverOption" type="DriverOptionType" minOccurs="0" maxOccurs="unbounded">
              <xs:annotation>
                  <xs:documentation>Driver options to be passed to driver.</xs:documentation>
              </xs:annotation>
          </xs:element>
      
```
## ContainerNetworkConfigType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|ContainerNetworkConfigType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerNetworkConfigType">
        <xs:attribute name="NetworkType" use="required" type="xs:string">
            <xs:annotation>
                <xs:documentation>NetworkType. Currently only supported type is "Open".</xs:documentation>
            </xs:annotation>
        </xs:attribute>
    </xs:complexType>
  
```
### Attribute details

#### NetworkType
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|NetworkType|
|use|required|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NetworkType" use="required" type="xs:string">
            <xs:annotation>
                <xs:documentation>NetworkType. Currently only supported type is "Open".</xs:documentation>
            </xs:annotation>
        </xs:attribute>
    
```

## ContainerVolumeType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 4 attribute(s)|
|name|ContainerVolumeType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerVolumeType">
        <xs:choice minOccurs="0" maxOccurs="unbounded">
            <xs:element name="DriverOption" type="DriverOptionType" minOccurs="0" maxOccurs="unbounded">
                <xs:annotation>
                    <xs:documentation>Driver options to be passed to driver.</xs:documentation>
                </xs:annotation>
            </xs:element>
        </xs:choice>
        <xs:attribute name="Source" use="required">
            <xs:simpleType>
                <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
        <xs:attribute name="Destination" use="required">
            <xs:simpleType>
                <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
        <xs:attribute name="Driver" use="optional">
            <xs:simpleType>
                <xs:restriction base="xs:string">
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
        <xs:attribute name="IsReadOnly" type="xs:boolean" default="false"/>
    </xs:complexType>
    
```
### Attribute details

#### Source
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|Source|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Source" use="required">
            <xs:simpleType>
                <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
        
```

#### Destination
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|Destination|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Destination" use="required">
            <xs:simpleType>
                <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
        
```

#### Driver
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|Driver|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Driver" use="optional">
            <xs:simpleType>
                <xs:restriction base="xs:string">
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
        
```

#### IsReadOnly
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|IsReadOnly|
|type|xs:boolean|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsReadOnly" type="xs:boolean" default="false"/>
    
```

### Content element details

#### DriverOption
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|DriverOption|
|type|DriverOptionType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DriverOption" type="DriverOptionType" minOccurs="0" maxOccurs="unbounded">
                <xs:annotation>
                    <xs:documentation>Driver options to be passed to driver.</xs:documentation>
                </xs:annotation>
            </xs:element>
        
```
## DataPackageType complexType
Declares a folder, named by the Name attribute, which contains static data files. Service Fabric will recycle all EXEs and DLLHOSTs specified in the host and support packages when any of the data packages listed in the service manifest are upgraded.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|DataPackageType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DataPackageType">
    <xs:annotation>
      <xs:documentation>Declares a folder, named by the Name attribute, which contains static data files. Service Fabric will recycle all EXEs and DLLHOSTs specified in the host and support packages when any of the data packages listed in the service manifest are upgraded.</xs:documentation>
    </xs:annotation>
    <xs:attributeGroup ref="VersionedName"/>
  </xs:complexType>
  
```
## DebugParametersType complexType
Specifies information on debugger to attach when activating codepackage

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|3 element(s), 10 attribute(s)|
|name|DebugParametersType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DebugParametersType">
    <xs:annotation>
      <xs:documentation>Specifies information on debugger to attach when activating codepackage</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="ContainerEntryPoint" type="xs:string" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Overidden entrypoint for containers so debugger can be launched..</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="ContainerMountedVolume" type="xs:string" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Volumes to be mounted inside container.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="ContainerEnvironmentBlock" type="xs:string" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>EnvironmentBlock for containers.</xs:documentation>
        </xs:annotation>
      </xs:element>
    </xs:sequence>
    <xs:attribute name="ProgramExePath">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="Arguments">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="EntryPointType" use="optional" default="Main">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="Setup"/>
          <xs:enumeration value="Main"/>
          <xs:enumeration value="All"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="CodePackageLinkFolder">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="ConfigPackageLinkFolder">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="DataPackageLinkFolder">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="LockFile">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="WorkingFolder">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="DebugParametersFile">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="EnvironmentBlock">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### ProgramExePath
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|ProgramExePath|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ProgramExePath">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### Arguments
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|Arguments|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Arguments">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### EntryPointType
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|EntryPointType|
|use|optional|
|default|Main|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EntryPointType" use="optional" default="Main">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="Setup"/>
          <xs:enumeration value="Main"/>
          <xs:enumeration value="All"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### CodePackageLinkFolder
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|CodePackageLinkFolder|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackageLinkFolder">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### ConfigPackageLinkFolder
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|ConfigPackageLinkFolder|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigPackageLinkFolder">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### DataPackageLinkFolder
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|DataPackageLinkFolder|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DataPackageLinkFolder">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### LockFile
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|LockFile|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LockFile">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### WorkingFolder
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|WorkingFolder|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="WorkingFolder">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### DebugParametersFile
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|DebugParametersFile|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DebugParametersFile">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### EnvironmentBlock
Driver options to be passed to driver.
|Attribute|Value|
|---|---|
|name|EnvironmentBlock|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentBlock">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

### Content element details

#### ContainerEntryPoint
Overidden entrypoint for containers so debugger can be launched..
|Attribute|Value|
|---|---|
|name|ContainerEntryPoint|
|type|xs:string|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerEntryPoint" type="xs:string" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Overidden entrypoint for containers so debugger can be launched..</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### ContainerMountedVolume
Volumes to be mounted inside container.
|Attribute|Value|
|---|---|
|name|ContainerMountedVolume|
|type|xs:string|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerMountedVolume" type="xs:string" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Volumes to be mounted inside container.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### ContainerEnvironmentBlock
EnvironmentBlock for containers.
|Attribute|Value|
|---|---|
|name|ContainerEnvironmentBlock|
|type|xs:string|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerEnvironmentBlock" type="xs:string" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>EnvironmentBlock for containers.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```
## DefaultServicesType complexType
Declares service instances that are automatically created whenever an application is instantiated against this application type.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|DefaultServicesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultServicesType">
        <xs:annotation>
            <xs:documentation>Declares service instances that are automatically created whenever an application is instantiated against this application type.</xs:documentation>
        </xs:annotation>
        <xs:sequence>
            <xs:choice minOccurs="0" maxOccurs="unbounded">
                <xs:element name="Service">
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
                <xs:element name="ServiceGroup">
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
            </xs:choice>
        </xs:sequence>
    </xs:complexType>
    
```
### Content element details

#### Service
Declares a service to be created automatically when the application is instantiated.
|Attribute|Value|
|---|---|
|name|Service|

##### XML source
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

#### ServiceGroup
A collection of services that are automatically located together, so they are also moved together during fail-over or resource management.
|Attribute|Value|
|---|---|
|name|ServiceGroup|

##### XML source
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
## DiagnosticsType complexType
Describes the diagnostic settings for applications.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|3 element(s), 0 attribute(s)|
|name|DiagnosticsType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DiagnosticsType">
    <xs:annotation>
      <xs:documentation>Describes the diagnostic settings for applications.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="CrashDumpSource" minOccurs="0">
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
      <xs:element name="ETWSource" minOccurs="0">
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
      <xs:element name="FolderSource" minOccurs="0" maxOccurs="unbounded">
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
    </xs:sequence>
  </xs:complexType>
  
```
### Content element details

#### CrashDumpSource
Specifies crash dump collection. Crash dumps are collected for executables that host the code packages of all services belonging to the application.
|Attribute|Value|
|---|---|
|name|CrashDumpSource|
|minOccurs|0|

##### XML source
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

#### ETWSource
Specifies ETW trace collection. ETW traces are collected for the providers that are registered by all services belonging to the application.
|Attribute|Value|
|---|---|
|name|ETWSource|
|minOccurs|0|

##### XML source
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

#### FolderSource
Specifies the collection of the contents of a particular folder on the local node.
|Attribute|Value|
|---|---|
|name|FolderSource|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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
## DllHostEntryPointType complexType
Unsupported, do not use. DLL hosting support (assembly entry point) is provided through the FWP.exe process. Service Fabric starts the Fabric Worker Process (FWP.exe) and loads the assembly as part of the activation process.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 1 attribute(s)|
|name|DllHostEntryPointType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DllHostEntryPointType">
    <xs:annotation>
        <xs:documentation>Unsupported, do not use. DLL hosting support (assembly entry point) is provided through the FWP.exe process. Service Fabric starts the Fabric Worker Process (FWP.exe) and loads the assembly as part of the activation process.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:choice minOccurs="0" maxOccurs="unbounded">
        <xs:element name="UnmanagedDll" type="UnmanagedDllType"/>
        <xs:element name="ManagedAssembly" type="ManagedAssemblyType"/>
      </xs:choice>
    </xs:sequence>
    <xs:attribute name="IsolationPolicy" use="optional" default="DedicatedProcess">
      <xs:annotation>
        <xs:documentation>Unsupported, do not use. Defines the isolation policy for the Unmanaged DLLs and Managed Assemblies loaded in the DllHost. </xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="SharedDomain"/>
          <xs:enumeration value="DedicatedDomain"/>
          <xs:enumeration value="DedicatedProcess"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### IsolationPolicy
Specifies the collection of the contents of a particular folder on the local node.
|Attribute|Value|
|---|---|
|name|IsolationPolicy|
|use|optional|
|default|DedicatedProcess|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsolationPolicy" use="optional" default="DedicatedProcess">
      <xs:annotation>
        <xs:documentation>Unsupported, do not use. Defines the isolation policy for the Unmanaged DLLs and Managed Assemblies loaded in the DllHost. </xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="SharedDomain"/>
          <xs:enumeration value="DedicatedDomain"/>
          <xs:enumeration value="DedicatedProcess"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

### Content element details

#### UnmanagedDll
|Attribute|Value|
|---|---|
|name|UnmanagedDll|
|type|UnmanagedDllType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UnmanagedDll" type="UnmanagedDllType"/>
        
```

#### ManagedAssembly
|Attribute|Value|
|---|---|
|name|ManagedAssembly|
|type|ManagedAssemblyType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ManagedAssembly" type="ManagedAssemblyType"/>
      
```
## DriverOptionType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|DriverOptionType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DriverOptionType">
        <xs:attribute name="Name" type="xs:string" use="required"/>
        <xs:attribute name="Value" type="xs:string" use="required"/>
    </xs:complexType>
    
```
### Attribute details

#### Name
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required"/>
        
```

#### Value
|Attribute|Value|
|---|---|
|name|Value|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Value" type="xs:string" use="required"/>
    
```

## EndpointBindingPolicyType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|EndpointBindingPolicyType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointBindingPolicyType">
    <xs:attribute name="EndpointRef">
      <xs:annotation>
        <xs:documentation>The name of the endpoint, which must be declared in the Resources section of the service manifest.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="CertificateRef" use="required">
      <xs:annotation>
        <xs:documentation>The name of the endpoint certificate, declared in the Certificates section, to return to the client. </xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### EndpointRef
|Attribute|Value|
|---|---|
|name|EndpointRef|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointRef">
      <xs:annotation>
        <xs:documentation>The name of the endpoint, which must be declared in the Resources section of the service manifest.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### CertificateRef
|Attribute|Value|
|---|---|
|name|CertificateRef|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CertificateRef" use="required">
      <xs:annotation>
        <xs:documentation>The name of the endpoint certificate, declared in the Certificates section, to return to the client. </xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

## EndpointCertificateType complexType
Specifies information about an X509 certificate used to secure an endpoint.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 3 attribute(s)|
|name|EndpointCertificateType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointCertificateType">
                <xs:annotation>
                        <xs:documentation>Specifies information about an X509 certificate used to secure an endpoint.</xs:documentation>
                </xs:annotation>
                <xs:attribute name="X509StoreName" type="xs:string" default="My">
                        <xs:annotation>
                                <xs:documentation>The store name for the X509 certificate.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                <xs:attribute name="X509FindValue" use="required">
                        <xs:annotation>
                                <xs:documentation>The thumbprint of the X509 certificate.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                <xs:attribute name="Name" type="xs:string" use="optional"/>
        </xs:complexType>
        
```
### Attribute details

#### X509StoreName
|Attribute|Value|
|---|---|
|name|X509StoreName|
|type|xs:string|
|default|My|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="X509StoreName" type="xs:string" default="My">
                        <xs:annotation>
                                <xs:documentation>The store name for the X509 certificate.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                
```

#### X509FindValue
|Attribute|Value|
|---|---|
|name|X509FindValue|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="X509FindValue" use="required">
                        <xs:annotation>
                                <xs:documentation>The thumbprint of the X509 certificate.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                
```

#### Name
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="optional"/>
        
```

## EndpointOverrideType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 6 attribute(s)|
|name|EndpointOverrideType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointOverrideType">
    <xs:attribute name="Name" use="required">
      <xs:annotation>
      <xs:documentation>The name of the endpoint.</xs:documentation>
    </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="Port" type="xs:string">
      <xs:annotation>
        <xs:documentation>The port will be overridden in the Service Manifest</xs:documentation>
      </xs:annotation>
    </xs:attribute>
	   <xs:attribute name="Protocol" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>The protocol for the endpoint. HTTPS endpoints must also have an EndpointCertificate and an EndpointBindingPolicy declared in the application manifest. The protocol cannot be changed later in an application upgrade. </xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="Type" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>The type of the endpoint.  Input endpoints are used to expose the port to the outside, internal endpoints are used for intra-application communication.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="UriScheme" use="optional">
      <xs:annotation>
        <xs:documentation>The URI scheme.  For example, "http", "https", or "ftp".</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="PathSuffix" use="optional">
      <xs:annotation>
        <xs:documentation>The path suffix.  For example, "/myapp1".</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### Name
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required">
      <xs:annotation>
      <xs:documentation>The name of the endpoint.</xs:documentation>
    </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### Port
|Attribute|Value|
|---|---|
|name|Port|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Port" type="xs:string">
      <xs:annotation>
        <xs:documentation>The port will be overridden in the Service Manifest</xs:documentation>
      </xs:annotation>
    </xs:attribute>
	   
```

#### Protocol
|Attribute|Value|
|---|---|
|name|Protocol|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Protocol" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>The protocol for the endpoint. HTTPS endpoints must also have an EndpointCertificate and an EndpointBindingPolicy declared in the application manifest. The protocol cannot be changed later in an application upgrade. </xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### Type
|Attribute|Value|
|---|---|
|name|Type|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Type" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>The type of the endpoint.  Input endpoints are used to expose the port to the outside, internal endpoints are used for intra-application communication.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### UriScheme
|Attribute|Value|
|---|---|
|name|UriScheme|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UriScheme" use="optional">
      <xs:annotation>
        <xs:documentation>The URI scheme.  For example, "http", "https", or "ftp".</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### PathSuffix
|Attribute|Value|
|---|---|
|name|PathSuffix|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PathSuffix" use="optional">
      <xs:annotation>
        <xs:documentation>The path suffix.  For example, "/myapp1".</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## EndpointType complexType
Defines an endpoint for the service. Specific ports can be requested.  If a port is not explicitly specified, a port is assigned from the reserved application port range. Service replicas running on different cluster nodes can be assigned different port numbers, while replicas of the same service running on the same node share the same port. Such ports can be used by the service replicas for various purposes such as replication or listening for client requests.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 8 attribute(s)|
|name|EndpointType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointType">
    <xs:annotation>
      <xs:documentation>Defines an endpoint for the service. Specific ports can be requested.  If a port is not explicitly specified, a port is assigned from the reserved application port range. Service replicas running on different cluster nodes can be assigned different port numbers, while replicas of the same service running on the same node share the same port. Such ports can be used by the service replicas for various purposes such as replication or listening for client requests.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="Name" use="required">
      <xs:annotation>
      <xs:documentation>The name of the endpoint.</xs:documentation>
    </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="Protocol" use="optional" default="tcp">
      <xs:annotation>
        <xs:documentation>The protocol for the endpoint. HTTPS endpoints must also have an EndpointCertificate and an EndpointBindingPolicy declared in the application manifest. The protocol cannot be changed later in an application upgrade. </xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="http"/>
          <xs:enumeration value="https"/>
          <xs:enumeration value="tcp"/>
          <xs:enumeration value="udp"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="Type" use="optional" default="Internal">
      <xs:annotation>
        <xs:documentation>The type of the endpoint.  Input endpoints are used to expose the port to the outside, internal endpoints are used for intra-application communication.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="Input"/>
          <xs:enumeration value="Internal"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="CodePackageRef" use="optional">
      <xs:annotation>
        <xs:documentation>The name of code Package that will use this endpoint.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="CertificateRef">
      <xs:annotation>
        <xs:documentation>Do not use, this attribute is not supported.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="Port">
      <xs:annotation>
        <xs:documentation>The port will be replaced with a port determined by Microsoft Azure Service Fabric after registering with Http.sys or BFE.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:int">
          <xs:minInclusive value="0"/>
          <xs:maxInclusive value="65535"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="UriScheme">
      <xs:annotation>
        <xs:documentation>The URI scheme.  For example, "http", "https", or "ftp".</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="PathSuffix">
      <xs:annotation>
        <xs:documentation>The path suffix.  For example, "/myapp1".</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### Name
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required">
      <xs:annotation>
      <xs:documentation>The name of the endpoint.</xs:documentation>
    </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### Protocol
|Attribute|Value|
|---|---|
|name|Protocol|
|use|optional|
|default|tcp|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Protocol" use="optional" default="tcp">
      <xs:annotation>
        <xs:documentation>The protocol for the endpoint. HTTPS endpoints must also have an EndpointCertificate and an EndpointBindingPolicy declared in the application manifest. The protocol cannot be changed later in an application upgrade. </xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="http"/>
          <xs:enumeration value="https"/>
          <xs:enumeration value="tcp"/>
          <xs:enumeration value="udp"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### Type
|Attribute|Value|
|---|---|
|name|Type|
|use|optional|
|default|Internal|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Type" use="optional" default="Internal">
      <xs:annotation>
        <xs:documentation>The type of the endpoint.  Input endpoints are used to expose the port to the outside, internal endpoints are used for intra-application communication.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="Input"/>
          <xs:enumeration value="Internal"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### CodePackageRef
|Attribute|Value|
|---|---|
|name|CodePackageRef|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackageRef" use="optional">
      <xs:annotation>
        <xs:documentation>The name of code Package that will use this endpoint.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### CertificateRef
|Attribute|Value|
|---|---|
|name|CertificateRef|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CertificateRef">
      <xs:annotation>
        <xs:documentation>Do not use, this attribute is not supported.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### Port
|Attribute|Value|
|---|---|
|name|Port|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Port">
      <xs:annotation>
        <xs:documentation>The port will be replaced with a port determined by Microsoft Azure Service Fabric after registering with Http.sys or BFE.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:int">
          <xs:minInclusive value="0"/>
          <xs:maxInclusive value="65535"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### UriScheme
|Attribute|Value|
|---|---|
|name|UriScheme|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UriScheme">
      <xs:annotation>
        <xs:documentation>The URI scheme.  For example, "http", "https", or "ftp".</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### PathSuffix
|Attribute|Value|
|---|---|
|name|PathSuffix|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PathSuffix">
      <xs:annotation>
        <xs:documentation>The path suffix.  For example, "/myapp1".</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## EntryPointDescriptionType complexType
The executable specified by EntryPoint is typically the long-running service host. The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time. The executable specified by EntryPoint is run after SetupEntryPoint exits successfully. The resulting process is monitored and restarted (beginning again with SetupEntryPoint) if it ever terminates or crashes.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|3 element(s), 0 attribute(s)|
|name|EntryPointDescriptionType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EntryPointDescriptionType">
    <xs:annotation>
      <xs:documentation>The executable specified by EntryPoint is typically the long-running service host. The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time. The executable specified by EntryPoint is run after SetupEntryPoint exits successfully. The resulting process is monitored and restarted (beginning again with SetupEntryPoint) if it ever terminates or crashes.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:choice>
        <xs:element name="ExeHost">
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
        <xs:element name="DllHost" type="DllHostEntryPointType"/>
        <xs:element name="ContainerHost" type="ContainerHostEntryPointType"/>
      </xs:choice>
    </xs:sequence>
  </xs:complexType>
  
```
### Content element details

#### ExeHost
|Attribute|Value|
|---|---|
|name|ExeHost|

##### XML source
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

#### DllHost
|Attribute|Value|
|---|---|
|name|DllHost|
|type|DllHostEntryPointType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DllHost" type="DllHostEntryPointType"/>
        
```

#### ContainerHost
|Attribute|Value|
|---|---|
|name|ContainerHost|
|type|ContainerHostEntryPointType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerHost" type="ContainerHostEntryPointType"/>
      
```
## EnvironmentOverridesType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 1 attribute(s)|
|name|EnvironmentOverridesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentOverridesType">
    <xs:sequence>
      <xs:element name="EnvironmentVariable" type="EnvironmentVariableType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Environment variable.</xs:documentation>
        </xs:annotation>
      </xs:element>
    </xs:sequence>
    <xs:attribute name="CodePackageRef" use="required">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### CodePackageRef
|Attribute|Value|
|---|---|
|name|CodePackageRef|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackageRef" use="required">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

### Content element details

#### EnvironmentVariable
Environment variable.
|Attribute|Value|
|---|---|
|name|EnvironmentVariable|
|type|EnvironmentVariableType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentVariable" type="EnvironmentVariableType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Environment variable.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```
## EnvironmentType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|3 element(s), 0 attribute(s)|
|name|EnvironmentType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentType">
        <xs:sequence>
            <xs:element name="Principals" type="SecurityPrincipalsType"/>
            <xs:element name="Policies" type="ApplicationPoliciesType"/>
            <xs:element name="Diagnostics" type="DiagnosticsType"/>
        </xs:sequence>
        <xs:attributeGroup ref="VersionedItemAttrGroup"/>
    </xs:complexType>
    
```
### Content element details

#### Principals
|Attribute|Value|
|---|---|
|name|Principals|
|type|SecurityPrincipalsType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Principals" type="SecurityPrincipalsType"/>
            
```

#### Policies
|Attribute|Value|
|---|---|
|name|Policies|
|type|ApplicationPoliciesType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Policies" type="ApplicationPoliciesType"/>
            
```

#### Diagnostics
|Attribute|Value|
|---|---|
|name|Diagnostics|
|type|DiagnosticsType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Diagnostics" type="DiagnosticsType"/>
        
```
## EnvironmentVariableType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|EnvironmentVariableType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentVariableType">
    <xs:attribute name="Name" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Name of environment variable.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="Value">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="0"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### Name
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Name of environment variable.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### Value
|Attribute|Value|
|---|---|
|name|Value|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Value">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="0"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

## EnvironmentVariablesType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|EnvironmentVariablesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentVariablesType">
    <xs:sequence>
      <xs:element name="EnvironmentVariable" type="EnvironmentVariableType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Environment variable.</xs:documentation>
        </xs:annotation>
      </xs:element>
    </xs:sequence>
  </xs:complexType>
    
```
### Content element details

#### EnvironmentVariable
Environment variable.
|Attribute|Value|
|---|---|
|name|EnvironmentVariable|
|type|EnvironmentVariableType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EnvironmentVariable" type="EnvironmentVariableType" minOccurs="0" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Environment variable.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```
## ExeHostEntryPointType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|4 element(s), 0 attribute(s)|
|name|ExeHostEntryPointType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ExeHostEntryPointType">
    
    <xs:sequence>
      <xs:element name="Program" type="xs:string">
        <xs:annotation>
          <xs:documentation>The executable name.  For example, "MySetup.bat" or "MyServiceHost.exe".</xs:documentation>
        </xs:annotation></xs:element>
      <xs:element name="Arguments" type="xs:string" minOccurs="0"/>
      <xs:element name="WorkingFolder" default="Work" minOccurs="0">
        <xs:simpleType>
          <xs:restriction base="xs:string">
            <xs:enumeration value="Work"/>
            <xs:enumeration value="CodePackage"/>
            <xs:enumeration value="CodeBase"/>
          </xs:restriction>
        </xs:simpleType>
      </xs:element>
      <xs:element name="ConsoleRedirection" minOccurs="0">
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
    </xs:sequence>
  </xs:complexType>
  
```
### Content element details

#### Program
The executable name.  For example, "MySetup.bat" or "MyServiceHost.exe".
|Attribute|Value|
|---|---|
|name|Program|
|type|xs:string|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Program" type="xs:string">
        <xs:annotation>
          <xs:documentation>The executable name.  For example, "MySetup.bat" or "MyServiceHost.exe".</xs:documentation>
        </xs:annotation></xs:element>
      
```

#### Arguments
|Attribute|Value|
|---|---|
|name|Arguments|
|type|xs:string|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Arguments" type="xs:string" minOccurs="0"/>
      
```

#### WorkingFolder
|Attribute|Value|
|---|---|
|name|WorkingFolder|
|default|Work|
|minOccurs|0|

##### XML source
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

#### ConsoleRedirection
|Attribute|Value|
|---|---|
|name|ConsoleRedirection|
|minOccurs|0|

##### XML source
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
## ExtensionsType complexType
Describes extensions that can be applied to other elements.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ExtensionsType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ExtensionsType">
    <xs:annotation>
      <xs:documentation>Describes extensions that can be applied to other elements.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="Extension" minOccurs="0" maxOccurs="unbounded">
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
    </xs:sequence>
  </xs:complexType>
  
```
### Content element details

#### Extension
|Attribute|Value|
|---|---|
|name|Extension|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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
## FabricCertificateType complexType
This specifies the certificate information.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 5 attribute(s)|
|name|FabricCertificateType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FabricCertificateType">
                <xs:annotation>
                        <xs:documentation>This specifies the certificate information.</xs:documentation>
                </xs:annotation>
                <xs:attribute name="X509StoreName" type="xs:string" default="My">
                        <xs:annotation>
                                <xs:documentation>The store name for the X509 certificate.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                <xs:attribute name="X509FindType" default="FindByThumbprint">
                        <xs:annotation>
                                <xs:documentation>This is Used only when credential is X509. This specifies how to find the certificate whether by the name or the thumbprint </xs:documentation>
                        </xs:annotation>
                        <xs:simpleType>
                                <xs:restriction base="xs:string">
                                        <xs:enumeration value="FindByThumbprint"/>
                                        <xs:enumeration value="FindBySubjectName"/>
                                        <xs:enumeration value="FindByExtension"/>
                                </xs:restriction>
                        </xs:simpleType>
                </xs:attribute>
                <xs:attribute name="X509FindValue" use="required">
                        <xs:annotation>
                                <xs:documentation>This is Used only when credential is X509. This is the actual name or thumbprint of the certificate.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                <xs:attribute name="X509FindValueSecondary" use="optional" default="">
                        <xs:annotation>
                                <xs:documentation>This is used only when credential is X509. This is the actual name or thumbprint of the certificate.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                <xs:attribute name="Name" type="xs:string" use="optional"/>
        </xs:complexType>
        
```
### Attribute details

#### X509StoreName
|Attribute|Value|
|---|---|
|name|X509StoreName|
|type|xs:string|
|default|My|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="X509StoreName" type="xs:string" default="My">
                        <xs:annotation>
                                <xs:documentation>The store name for the X509 certificate.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                
```

#### X509FindType
|Attribute|Value|
|---|---|
|name|X509FindType|
|default|FindByThumbprint|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="X509FindType" default="FindByThumbprint">
                        <xs:annotation>
                                <xs:documentation>This is Used only when credential is X509. This specifies how to find the certificate whether by the name or the thumbprint </xs:documentation>
                        </xs:annotation>
                        <xs:simpleType>
                                <xs:restriction base="xs:string">
                                        <xs:enumeration value="FindByThumbprint"/>
                                        <xs:enumeration value="FindBySubjectName"/>
                                        <xs:enumeration value="FindByExtension"/>
                                </xs:restriction>
                        </xs:simpleType>
                </xs:attribute>
                
```

#### X509FindValue
|Attribute|Value|
|---|---|
|name|X509FindValue|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="X509FindValue" use="required">
                        <xs:annotation>
                                <xs:documentation>This is Used only when credential is X509. This is the actual name or thumbprint of the certificate.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                
```

#### X509FindValueSecondary
|Attribute|Value|
|---|---|
|name|X509FindValueSecondary|
|use|optional|
|default||
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="X509FindValueSecondary" use="optional" default="">
                        <xs:annotation>
                                <xs:documentation>This is used only when credential is X509. This is the actual name or thumbprint of the certificate.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                
```

#### Name
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="optional"/>
        
```

## FabricEndpointsType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|18 element(s), 0 attribute(s)|
|name|FabricEndpointsType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FabricEndpointsType">
    <xs:all>
      <xs:element name="ClientConnectionEndpoint" type="InputEndpointType"/>
      <xs:element name="LeaseDriverEndpoint" type="InternalEndpointType"/>
      <xs:element name="ClusterConnectionEndpoint" type="InternalEndpointType"/>
      <xs:element name="HttpGatewayEndpoint" type="InputEndpointType" minOccurs="0"/>
      <xs:element name="HttpApplicationGatewayEndpoint" type="InputEndpointType" minOccurs="0"/>
      <xs:element name="ServiceConnectionEndpoint" type="InternalEndpointType" minOccurs="0"/>
      <xs:element name="ClusterManagerReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      <xs:element name="RepairManagerReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      <xs:element name="NamingReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      <xs:element name="FailoverManagerReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      <xs:element name="ImageStoreServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      <xs:element name="UpgradeServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      <xs:element name="FaultAnalysisServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      <xs:element name="BackupRestoreServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      <xs:element name="UpgradeOrchestrationServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      <xs:element name="DefaultReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      <xs:element name="ApplicationEndpoints" minOccurs="0">
        <xs:complexType>
          <xs:attribute name="StartPort" type="xs:int" use="required"/>
          <xs:attribute name="EndPort" type="xs:int" use="required"/>
        </xs:complexType>
      </xs:element>
      <xs:element name="EphemeralEndpoints" minOccurs="0">
        <xs:complexType>
          <xs:attribute name="StartPort" type="xs:int" use="required"/>
          <xs:attribute name="EndPort" type="xs:int" use="required"/>
        </xs:complexType>
      </xs:element>
    </xs:all>
  </xs:complexType>

  
```
### Content element details

#### ClientConnectionEndpoint
|Attribute|Value|
|---|---|
|name|ClientConnectionEndpoint|
|type|InputEndpointType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClientConnectionEndpoint" type="InputEndpointType"/>
      
```

#### LeaseDriverEndpoint
|Attribute|Value|
|---|---|
|name|LeaseDriverEndpoint|
|type|InternalEndpointType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LeaseDriverEndpoint" type="InternalEndpointType"/>
      
```

#### ClusterConnectionEndpoint
|Attribute|Value|
|---|---|
|name|ClusterConnectionEndpoint|
|type|InternalEndpointType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterConnectionEndpoint" type="InternalEndpointType"/>
      
```

#### HttpGatewayEndpoint
|Attribute|Value|
|---|---|
|name|HttpGatewayEndpoint|
|type|InputEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="HttpGatewayEndpoint" type="InputEndpointType" minOccurs="0"/>
      
```

#### HttpApplicationGatewayEndpoint
|Attribute|Value|
|---|---|
|name|HttpApplicationGatewayEndpoint|
|type|InputEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="HttpApplicationGatewayEndpoint" type="InputEndpointType" minOccurs="0"/>
      
```

#### ServiceConnectionEndpoint
|Attribute|Value|
|---|---|
|name|ServiceConnectionEndpoint|
|type|InternalEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceConnectionEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

#### ClusterManagerReplicatorEndpoint
|Attribute|Value|
|---|---|
|name|ClusterManagerReplicatorEndpoint|
|type|InternalEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterManagerReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

#### RepairManagerReplicatorEndpoint
|Attribute|Value|
|---|---|
|name|RepairManagerReplicatorEndpoint|
|type|InternalEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RepairManagerReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

#### NamingReplicatorEndpoint
|Attribute|Value|
|---|---|
|name|NamingReplicatorEndpoint|
|type|InternalEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NamingReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

#### FailoverManagerReplicatorEndpoint
|Attribute|Value|
|---|---|
|name|FailoverManagerReplicatorEndpoint|
|type|InternalEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FailoverManagerReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

#### ImageStoreServiceReplicatorEndpoint
|Attribute|Value|
|---|---|
|name|ImageStoreServiceReplicatorEndpoint|
|type|InternalEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ImageStoreServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

#### UpgradeServiceReplicatorEndpoint
|Attribute|Value|
|---|---|
|name|UpgradeServiceReplicatorEndpoint|
|type|InternalEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UpgradeServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

#### FaultAnalysisServiceReplicatorEndpoint
|Attribute|Value|
|---|---|
|name|FaultAnalysisServiceReplicatorEndpoint|
|type|InternalEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FaultAnalysisServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

#### BackupRestoreServiceReplicatorEndpoint
|Attribute|Value|
|---|---|
|name|BackupRestoreServiceReplicatorEndpoint|
|type|InternalEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="BackupRestoreServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

#### UpgradeOrchestrationServiceReplicatorEndpoint
|Attribute|Value|
|---|---|
|name|UpgradeOrchestrationServiceReplicatorEndpoint|
|type|InternalEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UpgradeOrchestrationServiceReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

#### DefaultReplicatorEndpoint
|Attribute|Value|
|---|---|
|name|DefaultReplicatorEndpoint|
|type|InternalEndpointType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultReplicatorEndpoint" type="InternalEndpointType" minOccurs="0"/>
      
```

#### ApplicationEndpoints
|Attribute|Value|
|---|---|
|name|ApplicationEndpoints|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationEndpoints" minOccurs="0">
        <xs:complexType>
          <xs:attribute name="StartPort" type="xs:int" use="required"/>
          <xs:attribute name="EndPort" type="xs:int" use="required"/>
        </xs:complexType>
      </xs:element>
      
```

#### EphemeralEndpoints
|Attribute|Value|
|---|---|
|name|EphemeralEndpoints|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EphemeralEndpoints" minOccurs="0">
        <xs:complexType>
          <xs:attribute name="StartPort" type="xs:int" use="required"/>
          <xs:attribute name="EndPort" type="xs:int" use="required"/>
        </xs:complexType>
      </xs:element>
    
```
## FabricKtlLoggerSettingsType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|3 element(s), 0 attribute(s)|
|name|FabricKtlLoggerSettingsType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FabricKtlLoggerSettingsType">
    <xs:all>
      <xs:element name="SharedLogFilePath" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Defines path to shared log.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:attribute name="Value" type="xs:string" use="required"/>
        </xs:complexType>
      </xs:element>

      <xs:element name="SharedLogFileId" minOccurs="0">
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

      <xs:element name="SharedLogFileSizeInMB" minOccurs="0">
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

    </xs:all>
  </xs:complexType>

  
```
### Content element details

#### SharedLogFilePath
Defines path to shared log.
|Attribute|Value|
|---|---|
|name|SharedLogFilePath|
|minOccurs|0|

##### XML source
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

#### SharedLogFileId
Specific GUID to use as the shared log id.
|Attribute|Value|
|---|---|
|name|SharedLogFileId|
|minOccurs|0|

##### XML source
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

#### SharedLogFileSizeInMB
Defines how large is the shared log.
|Attribute|Value|
|---|---|
|name|SharedLogFileSizeInMB|
|minOccurs|0|

##### XML source
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
## FabricNodeType complexType
Describes a Microsoft Azure Service Fabric Node.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 6 attribute(s)|
|name|FabricNodeType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FabricNodeType">
                <xs:annotation>
                        <xs:documentation>Describes a Microsoft Azure Service Fabric Node.</xs:documentation>
                </xs:annotation>
                <xs:attribute name="NodeName" type="xs:string" use="required">
                        <xs:annotation>
                                <xs:documentation>The name of the node instance.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                <xs:attribute name="IPAddressOrFQDN" type="xs:string" use="required">
                        <xs:annotation>
                                <xs:documentation>The IP address or the FQDN of the machine on which to place this node.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                <xs:attribute name="IsSeedNode" type="xs:boolean" default="false">
                        <xs:annotation>
                                <xs:documentation>A flag indicating whether or not this node is a seed node.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                <xs:attribute name="NodeTypeRef" type="xs:string" use="required">
                        <xs:annotation>
                                <xs:documentation>Name of the nodetype defined in the NodeTypes section. </xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                <xs:attribute name="FaultDomain" type="xs:anyURI" use="optional">
                        <xs:annotation>
                                <xs:documentation>
          The fault domain of this node.
        </xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                <xs:attribute name="UpgradeDomain" type="xs:anyURI" use="optional">
                        <xs:annotation>
                                <xs:documentation>
          The upgrade domain of this node.
        </xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### NodeName
Defines how large is the shared log.
|Attribute|Value|
|---|---|
|name|NodeName|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeName" type="xs:string" use="required">
                        <xs:annotation>
                                <xs:documentation>The name of the node instance.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                
```

#### IPAddressOrFQDN
Defines how large is the shared log.
|Attribute|Value|
|---|---|
|name|IPAddressOrFQDN|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IPAddressOrFQDN" type="xs:string" use="required">
                        <xs:annotation>
                                <xs:documentation>The IP address or the FQDN of the machine on which to place this node.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                
```

#### IsSeedNode
Defines how large is the shared log.
|Attribute|Value|
|---|---|
|name|IsSeedNode|
|type|xs:boolean|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsSeedNode" type="xs:boolean" default="false">
                        <xs:annotation>
                                <xs:documentation>A flag indicating whether or not this node is a seed node.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                
```

#### NodeTypeRef
Defines how large is the shared log.
|Attribute|Value|
|---|---|
|name|NodeTypeRef|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeTypeRef" type="xs:string" use="required">
                        <xs:annotation>
                                <xs:documentation>Name of the nodetype defined in the NodeTypes section. </xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                
```

#### FaultDomain
Defines how large is the shared log.
|Attribute|Value|
|---|---|
|name|FaultDomain|
|type|xs:anyURI|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FaultDomain" type="xs:anyURI" use="optional">
                        <xs:annotation>
                                <xs:documentation>
          The fault domain of this node.
        </xs:documentation>
                        </xs:annotation>
                </xs:attribute>
                
```

#### UpgradeDomain
Defines how large is the shared log.
|Attribute|Value|
|---|---|
|name|UpgradeDomain|
|type|xs:anyURI|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UpgradeDomain" type="xs:anyURI" use="optional">
                        <xs:annotation>
                                <xs:documentation>
          The upgrade domain of this node.
        </xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## FileStoreETWType complexType
Describes a file store destination for ETW events. Works only in on-premise environment.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|FileStoreETWType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileStoreETWType">
    <xs:annotation>
      <xs:documentation>Describes a file store destination for ETW events. Works only in on-premise environment.</xs:documentation>
    </xs:annotation>
    <xs:complexContent>
      <xs:extension base="FileStoreType">
        <xs:attributeGroup ref="LevelFilter"/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
  
```
## FileStoreType complexType
Describes a file store destination for diagnostics data. Works only in a standalone cluster environment.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 2 attribute(s)|
|name|FileStoreType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FileStoreType">
    <xs:annotation>
      <xs:documentation>Describes a file store destination for diagnostics data. Works only in a standalone cluster environment.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element ref="Parameters" minOccurs="0"/>
    </xs:sequence>
    <xs:attributeGroup ref="IsEnabled"/>
    <xs:attributeGroup ref="Path"/>
    <xs:attributeGroup ref="UploadIntervalInMinutes"/>
    <xs:attributeGroup ref="DataDeletionAgeInDays"/>
    <xs:attribute name="AccountType" type="xs:string">
      <xs:annotation>
        <xs:documentation>Specifies the type of account.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attributeGroup ref="AccountCredentialsGroup"/>
    <xs:attribute name="PasswordEncrypted" type="xs:string">
      <xs:annotation>
        <xs:documentation>Specifies if password is encrypted or plain text.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### AccountType
Defines how large is the shared log.
|Attribute|Value|
|---|---|
|name|AccountType|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AccountType" type="xs:string">
      <xs:annotation>
        <xs:documentation>Specifies the type of account.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### PasswordEncrypted
Defines how large is the shared log.
|Attribute|Value|
|---|---|
|name|PasswordEncrypted|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PasswordEncrypted" type="xs:string">
      <xs:annotation>
        <xs:documentation>Specifies if password is encrypted or plain text.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

### Content element details

#### None
|Attribute|Value|
|---|---|
|ref|Parameters|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Parameters" minOccurs="0"/>
    
```
## InfrastructureInformationType complexType
Contains the infrastructure information for this Microsoft Azure Service Fabric cluster.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|InfrastructureInformationType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="InfrastructureInformationType">
    <xs:annotation>
      <xs:documentation>Contains the infrastructure information for this Microsoft Azure Service Fabric cluster.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="NodeList">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Node" type="InfrastructureNodeType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:sequence>
  </xs:complexType>
  
```
### Content element details

#### NodeList
|Attribute|Value|
|---|---|
|name|NodeList|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeList">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Node" type="InfrastructureNodeType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    
```
## InfrastructureNodeType complexType
Describes a Infrastructure information needed.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 7 attribute(s)|
|name|InfrastructureNodeType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="InfrastructureNodeType">
    <xs:annotation>
      <xs:documentation>Describes a Infrastructure information needed.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="Endpoints" type="FabricEndpointsType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Describe the endpoints associated with this node type</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="Certificates" type="CertificatesType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Describe the certificates associated with this node type</xs:documentation>
        </xs:annotation>
      </xs:element>
    </xs:sequence>
    <xs:attribute name="NodeName" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>The name of the node instance.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="IPAddressOrFQDN" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>The IP address or the FQDN of the machine on which to place this node.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="RoleOrTierName" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Name of the role which links to node type ref which is defined in the NodeTypes section.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="NodeTypeRef" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Name of the node type which is defined in the NodeTypes section.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="IsSeedNode" type="xs:boolean" use="optional" default="false">
      <xs:annotation>
        <xs:documentation>Indicates whether the node is a seed node.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="FaultDomain" type="xs:anyURI" use="optional">
      <xs:annotation>
        <xs:documentation> The fault domain of this node. </xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="UpgradeDomain" type="xs:anyURI" use="optional">
      <xs:annotation>
        <xs:documentation>The upgrade domain of this node. </xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### NodeName
|Attribute|Value|
|---|---|
|name|NodeName|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeName" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>The name of the node instance.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### IPAddressOrFQDN
|Attribute|Value|
|---|---|
|name|IPAddressOrFQDN|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IPAddressOrFQDN" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>The IP address or the FQDN of the machine on which to place this node.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### RoleOrTierName
|Attribute|Value|
|---|---|
|name|RoleOrTierName|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RoleOrTierName" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Name of the role which links to node type ref which is defined in the NodeTypes section.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### NodeTypeRef
|Attribute|Value|
|---|---|
|name|NodeTypeRef|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeTypeRef" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Name of the node type which is defined in the NodeTypes section.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### IsSeedNode
|Attribute|Value|
|---|---|
|name|IsSeedNode|
|type|xs:boolean|
|use|optional|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsSeedNode" type="xs:boolean" use="optional" default="false">
      <xs:annotation>
        <xs:documentation>Indicates whether the node is a seed node.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### FaultDomain
|Attribute|Value|
|---|---|
|name|FaultDomain|
|type|xs:anyURI|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="FaultDomain" type="xs:anyURI" use="optional">
      <xs:annotation>
        <xs:documentation> The fault domain of this node. </xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### UpgradeDomain
|Attribute|Value|
|---|---|
|name|UpgradeDomain|
|type|xs:anyURI|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UpgradeDomain" type="xs:anyURI" use="optional">
      <xs:annotation>
        <xs:documentation>The upgrade domain of this node. </xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

### Content element details

#### Endpoints
Describe the endpoints associated with this node type
|Attribute|Value|
|---|---|
|name|Endpoints|
|type|FabricEndpointsType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Endpoints" type="FabricEndpointsType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Describe the endpoints associated with this node type</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### Certificates
Describe the certificates associated with this node type
|Attribute|Value|
|---|---|
|name|Certificates|
|type|CertificatesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Certificates" type="CertificatesType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Describe the certificates associated with this node type</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```
## InputEndpointType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|InputEndpointType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="InputEndpointType">
    <xs:attribute name="Port" type="xs:positiveInteger" use="required"/>
    <xs:attribute name="Protocol" use="optional" default="tcp">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="http"/>
          <xs:enumeration value="https"/>
          <xs:enumeration value="tcp"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### Port
Describe the certificates associated with this node type
|Attribute|Value|
|---|---|
|name|Port|
|type|xs:positiveInteger|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Port" type="xs:positiveInteger" use="required"/>
    
```

#### Protocol
Describe the certificates associated with this node type
|Attribute|Value|
|---|---|
|name|Protocol|
|use|optional|
|default|tcp|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Protocol" use="optional" default="tcp">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="http"/>
          <xs:enumeration value="https"/>
          <xs:enumeration value="tcp"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

## InternalEndpointType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|InternalEndpointType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="InternalEndpointType">
    <xs:attribute name="Port" type="xs:positiveInteger" use="required"/>
    <xs:attribute name="Protocol" use="optional" default="tcp">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="http"/>
          <xs:enumeration value="https"/>
          <xs:enumeration value="tcp"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### Port
Describe the certificates associated with this node type
|Attribute|Value|
|---|---|
|name|Port|
|type|xs:positiveInteger|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Port" type="xs:positiveInteger" use="required"/>
    
```

#### Protocol
Describe the certificates associated with this node type
|Attribute|Value|
|---|---|
|name|Protocol|
|use|optional|
|default|tcp|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Protocol" use="optional" default="tcp">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="http"/>
          <xs:enumeration value="https"/>
          <xs:enumeration value="tcp"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

## KeyValuePairType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|KeyValuePairType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="KeyValuePairType">
    <xs:attributeGroup ref="NameValuePair"/>
  </xs:complexType>
  
```
## LinuxInfrastructureType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LinuxInfrastructureType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LinuxInfrastructureType">
    <xs:sequence>
      <xs:element name="NodeList">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Node" type="FabricNodeType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:sequence>
  </xs:complexType>
        
```
### Content element details

#### NodeList
|Attribute|Value|
|---|---|
|name|NodeList|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeList">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Node" type="FabricNodeType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    
```
## LoadMetricType complexType
A resource that this service should be balanced on, such as memory or CPU usage.  Includes information about how much of that resource each replica or instance of this service consumes by default.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 5 attribute(s)|
|name|LoadMetricType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LoadMetricType">
    <xs:annotation>
        <xs:documentation>A resource that this service should be balanced on, such as memory or CPU usage.  Includes information about how much of that resource each replica or instance of this service consumes by default.</xs:documentation>
      </xs:annotation>
    <xs:attribute name="Name" use="required">
      <xs:annotation>
        <xs:documentation>A unique identifier for the metric within the cluster from the Cluster Resource Manager’s perspective.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="DefaultLoad" type="xs:long" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>The default amount of load that this stateless service creates for this metric.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="PrimaryDefaultLoad" type="xs:long" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>The default amount of load that this service will exert for this metric when it's a primary replica.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="SecondaryDefaultLoad" type="xs:long" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>The default amount of load that this service will exert for this metric when it's a secondary replica.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="Weight">
      <xs:annotation>
        <xs:documentation>Determines the metric weight relative to the other metrics that are configured for this service. During runtime, if two metrics end up in conflict, the Cluster Resource Manager prefers the metric with the higher weight. Zero disables load balancing for this metric.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="Zero"/>
          <xs:enumeration value="Low"/>
          <xs:enumeration value="Medium"/>
          <xs:enumeration value="High"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### Name
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required">
      <xs:annotation>
        <xs:documentation>A unique identifier for the metric within the cluster from the Cluster Resource Manager’s perspective.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### DefaultLoad
|Attribute|Value|
|---|---|
|name|DefaultLoad|
|type|xs:long|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultLoad" type="xs:long" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>The default amount of load that this stateless service creates for this metric.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### PrimaryDefaultLoad
|Attribute|Value|
|---|---|
|name|PrimaryDefaultLoad|
|type|xs:long|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PrimaryDefaultLoad" type="xs:long" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>The default amount of load that this service will exert for this metric when it's a primary replica.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### SecondaryDefaultLoad
|Attribute|Value|
|---|---|
|name|SecondaryDefaultLoad|
|type|xs:long|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecondaryDefaultLoad" type="xs:long" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>The default amount of load that this service will exert for this metric when it's a secondary replica.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### Weight
|Attribute|Value|
|---|---|
|name|Weight|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Weight">
      <xs:annotation>
        <xs:documentation>Determines the metric weight relative to the other metrics that are configured for this service. During runtime, if two metrics end up in conflict, the Cluster Resource Manager prefers the metric with the higher weight. Zero disables load balancing for this metric.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="Zero"/>
          <xs:enumeration value="Low"/>
          <xs:enumeration value="Medium"/>
          <xs:enumeration value="High"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

## LocalStoreETWType complexType
Describes a store destination within the node for ETW events.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|LocalStoreETWType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LocalStoreETWType">
    <xs:annotation>
      <xs:documentation>Describes a store destination within the node for ETW events.</xs:documentation>
    </xs:annotation>
    <xs:complexContent>
      <xs:extension base="LocalStoreType">
        <xs:attributeGroup ref="LevelFilter"/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
  
```
## LocalStoreType complexType
Describes a store destination within the node for diagnostic data.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|LocalStoreType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LocalStoreType">
    <xs:annotation>
      <xs:documentation>Describes a store destination within the node for diagnostic data.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element ref="Parameters" minOccurs="0"/>
    </xs:sequence>
    <xs:attributeGroup ref="IsEnabled"/>
    <xs:attributeGroup ref="RelativeFolderPath"/>
    <xs:attributeGroup ref="DataDeletionAgeInDays"/>
  </xs:complexType>
  
```
### Content element details

#### None
|Attribute|Value|
|---|---|
|ref|Parameters|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Parameters" minOccurs="0"/>
    
```
## LogicalDirectoryType complexType
Describes a LogicalDirectoryType.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 3 attribute(s)|
|name|LogicalDirectoryType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LogicalDirectoryType">
    <xs:annotation>
      <xs:documentation>Describes a LogicalDirectoryType.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="LogicalDirectoryName" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>The name of the LogicalDirectory.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="MappedTo" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>The path of the LogicalDirectory.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="Context" use="optional" default="application">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="application"/>
          <xs:enumeration value="node"/>
        </xs:restriction>
      </xs:simpleType>  
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### LogicalDirectoryName
|Attribute|Value|
|---|---|
|name|LogicalDirectoryName|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LogicalDirectoryName" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>The name of the LogicalDirectory.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### MappedTo
|Attribute|Value|
|---|---|
|name|MappedTo|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MappedTo" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>The path of the LogicalDirectory.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### Context
|Attribute|Value|
|---|---|
|name|Context|
|use|optional|
|default|application|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Context" use="optional" default="application">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="application"/>
          <xs:enumeration value="node"/>
        </xs:restriction>
      </xs:simpleType>  
    </xs:attribute>
  
```

## ManagedAssemblyType complexType
Unsupported, do not use. The name of managed assembly (for example, Queue.dll), to host.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|ManagedAssemblyType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ManagedAssemblyType">
    <xs:annotation>
        <xs:documentation>Unsupported, do not use. The name of managed assembly (for example, Queue.dll), to host.</xs:documentation>
    </xs:annotation>
    <xs:simpleContent>
      <xs:extension base="xs:string"/>
    </xs:simpleContent>
  </xs:complexType>
  
```
## PaaSRoleType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 3 attribute(s)|
|name|PaaSRoleType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PaaSRoleType">
    <xs:attribute name="RoleName" type="xs:string" use="required"/>
    <xs:attribute name="NodeTypeRef" type="xs:string" use="required"/>
    <xs:attribute name="RoleNodeCount" type="xs:int" use="required"/>
  </xs:complexType>
  
```
### Attribute details

#### RoleName
|Attribute|Value|
|---|---|
|name|RoleName|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RoleName" type="xs:string" use="required"/>
    
```

#### NodeTypeRef
|Attribute|Value|
|---|---|
|name|NodeTypeRef|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeTypeRef" type="xs:string" use="required"/>
    
```

#### RoleNodeCount
|Attribute|Value|
|---|---|
|name|RoleNodeCount|
|type|xs:int|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RoleNodeCount" type="xs:int" use="required"/>
  
```

## PaaSVoteType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 3 attribute(s)|
|name|PaaSVoteType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PaaSVoteType">
    <xs:attribute name="NodeName" use="required"/>
    <xs:attribute name="IPAddressOrFQDN" use="required"/>
    <xs:attribute name="Port" type="xs:int" use="required"/>
  </xs:complexType>
  
```
### Attribute details

#### NodeName
|Attribute|Value|
|---|---|
|name|NodeName|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeName" use="required"/>
    
```

#### IPAddressOrFQDN
|Attribute|Value|
|---|---|
|name|IPAddressOrFQDN|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IPAddressOrFQDN" use="required"/>
    
```

#### Port
|Attribute|Value|
|---|---|
|name|Port|
|type|xs:int|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Port" type="xs:int" use="required"/>
  
```

## PackageSharingPolicyType complexType
Indicates if a code, config or data package should be shared.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|PackageSharingPolicyType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PackageSharingPolicyType">
    <xs:annotation>
      <xs:documentation>Indicates if a code, config or data package should be shared.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="PackageRef">
      <xs:annotation>
        <xs:documentation>The name of the code, config, or data package to be shared. Must match the name of the package defined in the service manifest.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="Scope" default="None">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="None"/>
          <xs:enumeration value="All"/>
          <xs:enumeration value="Code"/>
          <xs:enumeration value="Config"/>
          <xs:enumeration value="Data"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### PackageRef
|Attribute|Value|
|---|---|
|name|PackageRef|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PackageRef">
      <xs:annotation>
        <xs:documentation>The name of the code, config, or data package to be shared. Must match the name of the package defined in the service manifest.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### Scope
|Attribute|Value|
|---|---|
|name|Scope|
|default|None|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Scope" default="None">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="None"/>
          <xs:enumeration value="All"/>
          <xs:enumeration value="Code"/>
          <xs:enumeration value="Config"/>
          <xs:enumeration value="Data"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

## ParameterType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|ParameterType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ParameterType">
                <xs:attributeGroup ref="NameValuePair"/>
                <xs:attribute name="IsEncrypted" type="xs:string">
                        <xs:annotation>
                                <xs:documentation>If true, the value of this parameter is encrypted</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
        </xs:complexType>
        
```
### Attribute details

#### IsEncrypted
|Attribute|Value|
|---|---|
|name|IsEncrypted|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsEncrypted" type="xs:string">
                        <xs:annotation>
                                <xs:documentation>If true, the value of this parameter is encrypted</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
        
```

## ParametersType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ParametersType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ParametersType">
                <xs:sequence>
                        <xs:element name="Parameter" type="ParameterType" minOccurs="1" maxOccurs="unbounded"/>
                </xs:sequence>
        </xs:complexType>
        
```
### Content element details

#### Parameter
|Attribute|Value|
|---|---|
|name|Parameter|
|type|ParameterType|
|minOccurs|1|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Parameter" type="ParameterType" minOccurs="1" maxOccurs="unbounded"/>
                
```
## PortBindingType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|PortBindingType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PortBindingType">
    <xs:attribute name="ContainerPort" type="xs:int" use="required">
      <xs:annotation>
        <xs:documentation>Container port number.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="EndpointRef">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### ContainerPort
|Attribute|Value|
|---|---|
|name|ContainerPort|
|type|xs:int|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerPort" type="xs:int" use="required">
      <xs:annotation>
        <xs:documentation>Container port number.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### EndpointRef
|Attribute|Value|
|---|---|
|name|EndpointRef|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointRef">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

## RepositoryCredentialsType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|RepositoryCredentialsType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RepositoryCredentialsType">
    <xs:attributeGroup ref="AccountCredentialsGroup"/>
    <xs:attribute name="PasswordEncrypted" type="xs:boolean" use="optional">
      <xs:annotation>
        <xs:documentation>Specifies if password is encrypted or plain text.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="Email">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### PasswordEncrypted
|Attribute|Value|
|---|---|
|name|PasswordEncrypted|
|type|xs:boolean|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PasswordEncrypted" type="xs:boolean" use="optional">
      <xs:annotation>
        <xs:documentation>Specifies if password is encrypted or plain text.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### Email
|Attribute|Value|
|---|---|
|name|Email|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Email">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

## ResourceGovernancePolicyType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 9 attribute(s)|
|name|ResourceGovernancePolicyType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceGovernancePolicyType">
    <xs:attribute name="CodePackageRef" use="required">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="MemoryInMB" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Memory limits in MB. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="MemorySwapInMB" use="optional" default="0">
       <xs:annotation>
        <xs:documentation>Total memory (memory + swap) limits in MB.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="MemoryReservationInMB" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Memory soft limits in MB. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="CpuShares" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Relative CPU weight. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="CpuPercent" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Usable percentage of available CPUs (windows only). Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="MaximumIOps" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Maximum IO rate in terms of IOps. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="MaximumIOBandwidth" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Maximum IO bandwidth. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="BlockIOWeight" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Relative block IO weight. Must be a positive integer between 10 and 1000.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### CodePackageRef
|Attribute|Value|
|---|---|
|name|CodePackageRef|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackageRef" use="required">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### MemoryInMB
|Attribute|Value|
|---|---|
|name|MemoryInMB|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MemoryInMB" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Memory limits in MB. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    
```

#### MemorySwapInMB
|Attribute|Value|
|---|---|
|name|MemorySwapInMB|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MemorySwapInMB" use="optional" default="0">
       <xs:annotation>
        <xs:documentation>Total memory (memory + swap) limits in MB.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    
```

#### MemoryReservationInMB
|Attribute|Value|
|---|---|
|name|MemoryReservationInMB|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MemoryReservationInMB" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Memory soft limits in MB. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    
```

#### CpuShares
|Attribute|Value|
|---|---|
|name|CpuShares|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CpuShares" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Relative CPU weight. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    
```

#### CpuPercent
|Attribute|Value|
|---|---|
|name|CpuPercent|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CpuPercent" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Usable percentage of available CPUs (windows only). Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    
```

#### MaximumIOps
|Attribute|Value|
|---|---|
|name|MaximumIOps|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MaximumIOps" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Maximum IO rate in terms of IOps. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    
```

#### MaximumIOBandwidth
|Attribute|Value|
|---|---|
|name|MaximumIOBandwidth|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MaximumIOBandwidth" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Maximum IO bandwidth. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
    
```

#### BlockIOWeight
|Attribute|Value|
|---|---|
|name|BlockIOWeight|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="BlockIOWeight" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Relative block IO weight. Must be a positive integer between 10 and 1000.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
  
```

## ResourceOverridesType complexType
Describes the resource overrides for endpoints in servicemanifest resources.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ResourceOverridesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceOverridesType">
    <xs:annotation>
      <xs:documentation>Describes the resource overrides for endpoints in servicemanifest resources.</xs:documentation>
    </xs:annotation>
     <xs:sequence>
      <xs:element name="Endpoints" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Defines endpoints for the service.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Endpoint" type="EndpointOverrideType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:sequence>
  </xs:complexType>
  
```
### Content element details

#### Endpoints
Defines endpoints for the service.
|Attribute|Value|
|---|---|
|name|Endpoints|
|minOccurs|0|

##### XML source
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
## ResourcesType complexType
Describes the resources used by this service, which can be declared without modifying compiled code and changed when the service is deployed. Access to these resources is controlled through the Principals and Policies sections of the application manifest.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ResourcesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourcesType">
    <xs:annotation>
      <xs:documentation>Describes the resources used by this service, which can be declared without modifying compiled code and changed when the service is deployed. Access to these resources is controlled through the Principals and Policies sections of the application manifest.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="Endpoints" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Defines endpoints for the service.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="Endpoint" type="EndpointType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:sequence>
  </xs:complexType>
  
```
### Content element details

#### Endpoints
Defines endpoints for the service.
|Attribute|Value|
|---|---|
|name|Endpoints|
|minOccurs|0|

##### XML source
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
## RunAsPolicyType complexType
Specifies the local user or local system account that a service code package will run as. Domain accounts are supported on Windows Server deployments where Azure Active Directory is available. By default, applications run under the account that the Fabric.exe process runs under. Applications can also run as other accounts, which must be declared in the Principals section. If you apply a RunAs policy to a service, and the service manifest declares endpoint resources with the HTTP protocol, you must also specify a SecurityAccessPolicy to ensure that ports allocated to these endpoints are correctly access-control listed for the RunAs user account that the service runs under. For an HTTPS endpoint, you also have define a EndpointBindingPolicy to indicate the name of the certificate to return to the client.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 3 attribute(s)|
|name|RunAsPolicyType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RunAsPolicyType">
    <xs:annotation>
      <xs:documentation>Specifies the local user or local system account that a service code package will run as. Domain accounts are supported on Windows Server deployments where Azure Active Directory is available. By default, applications run under the account that the Fabric.exe process runs under. Applications can also run as other accounts, which must be declared in the Principals section. If you apply a RunAs policy to a service, and the service manifest declares endpoint resources with the HTTP protocol, you must also specify a SecurityAccessPolicy to ensure that ports allocated to these endpoints are correctly access-control listed for the RunAs user account that the service runs under. For an HTTPS endpoint, you also have define a EndpointBindingPolicy to indicate the name of the certificate to return to the client.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="CodePackageRef" use="required">
      <xs:annotation>
        <xs:documentation>The name of the code package. Must match the name of the CodePackage specified in the service manifest.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="UserRef" use="required">
      <xs:annotation>
        <xs:documentation>The user account that the service code package will run as.  The user account must be declared in the Principals section. Often it is preferable to run the setup entry point using a local system account rather than an administrators account.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="EntryPointType" use="optional" default="Main">
      <xs:annotation>
        <xs:documentation>Setup is the SetupEntryPoint declared in the service manifest, the privileged entry point that runs before any other entry point.  Main is the EntryPoint declared in the service manifest, typically the long-running service host. All is all entry points.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="Setup"/>
          <xs:enumeration value="Main"/>
          <xs:enumeration value="All"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### CodePackageRef
Defines endpoints for the service.
|Attribute|Value|
|---|---|
|name|CodePackageRef|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackageRef" use="required">
      <xs:annotation>
        <xs:documentation>The name of the code package. Must match the name of the CodePackage specified in the service manifest.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### UserRef
Defines endpoints for the service.
|Attribute|Value|
|---|---|
|name|UserRef|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UserRef" use="required">
      <xs:annotation>
        <xs:documentation>The user account that the service code package will run as.  The user account must be declared in the Principals section. Often it is preferable to run the setup entry point using a local system account rather than an administrators account.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### EntryPointType
Defines endpoints for the service.
|Attribute|Value|
|---|---|
|name|EntryPointType|
|use|optional|
|default|Main|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EntryPointType" use="optional" default="Main">
      <xs:annotation>
        <xs:documentation>Setup is the SetupEntryPoint declared in the service manifest, the privileged entry point that runs before any other entry point.  Main is the EntryPoint declared in the service manifest, typically the long-running service host. All is all entry points.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="Setup"/>
          <xs:enumeration value="Main"/>
          <xs:enumeration value="All"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

## SecurityAccessPolicyType complexType
Grants access permissions to a principal on a resource (such as an endpoint) defined in a service manifest. Typically, it is very useful to control and restrict access of services to different resources in order to minimize security risks. This is especially important when the application is built from a collection of services from a marketplace which are developed by different developers.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 4 attribute(s)|
|name|SecurityAccessPolicyType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityAccessPolicyType">
    <xs:annotation>
      <xs:documentation>Grants access permissions to a principal on a resource (such as an endpoint) defined in a service manifest. Typically, it is very useful to control and restrict access of services to different resources in order to minimize security risks. This is especially important when the application is built from a collection of services from a marketplace which are developed by different developers.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="ResourceRef" use="required">
      <xs:annotation>
        <xs:documentation>The resource being granted access to, declared and configured in the service manifest.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="PrincipalRef" use="required">
      <xs:annotation>
        <xs:documentation>The user or group being assigned access rights to a resource, must be declared in the Principals section.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="GrantRights" default="Read">
      <xs:annotation>
        <xs:documentation>The rights to grant, default is Read.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="Read"/>
          <xs:enumeration value="Change"/>
          <xs:enumeration value="Full"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="ResourceType" use="optional" default="Endpoint">
      <xs:annotation>
        <xs:documentation>The type of resource, defined in the service manifest, either Endpoint or Certificate.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="Endpoint"/>
          <xs:enumeration value="Certificate"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### ResourceRef
Defines endpoints for the service.
|Attribute|Value|
|---|---|
|name|ResourceRef|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceRef" use="required">
      <xs:annotation>
        <xs:documentation>The resource being granted access to, declared and configured in the service manifest.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### PrincipalRef
Defines endpoints for the service.
|Attribute|Value|
|---|---|
|name|PrincipalRef|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PrincipalRef" use="required">
      <xs:annotation>
        <xs:documentation>The user or group being assigned access rights to a resource, must be declared in the Principals section.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### GrantRights
Defines endpoints for the service.
|Attribute|Value|
|---|---|
|name|GrantRights|
|default|Read|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="GrantRights" default="Read">
      <xs:annotation>
        <xs:documentation>The rights to grant, default is Read.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="Read"/>
          <xs:enumeration value="Change"/>
          <xs:enumeration value="Full"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### ResourceType
Defines endpoints for the service.
|Attribute|Value|
|---|---|
|name|ResourceType|
|use|optional|
|default|Endpoint|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceType" use="optional" default="Endpoint">
      <xs:annotation>
        <xs:documentation>The type of resource, defined in the service manifest, either Endpoint or Certificate.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="Endpoint"/>
          <xs:enumeration value="Certificate"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

## SecurityOptionsType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 1 attribute(s)|
|name|SecurityOptionsType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityOptionsType">
    <xs:attribute name="Value" use="required">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
    
```
### Attribute details

#### Value
Defines endpoints for the service.
|Attribute|Value|
|---|---|
|name|Value|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Value" use="required">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

## SecurityPrincipalsType complexType
Describes the security principals (users, groups) required for this application to run services and secure resources. Principals are referenced in the policies sections.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|SecurityPrincipalsType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityPrincipalsType">
        <xs:annotation>
            <xs:documentation>Describes the security principals (users, groups) required for this application to run services and secure resources. Principals are referenced in the policies sections.</xs:documentation>
        </xs:annotation>
        <xs:sequence>
            <xs:element name="Groups" minOccurs="0">
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
            <xs:element name="Users" minOccurs="0">
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
                </xs:sequence>
        </xs:complexType>
        
```
### Content element details

#### Groups
Declares a set of groups as security principals, which can be referenced in policies.
|Attribute|Value|
|---|---|
|name|Groups|
|minOccurs|0|

##### XML source
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

#### Users
Declares a set of users as security principals, which can be referenced in policies.
|Attribute|Value|
|---|---|
|name|Users|
|minOccurs|0|

##### XML source
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
## ServiceAndServiceGroupTypesType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|4 element(s), 0 attribute(s)|
|name|ServiceAndServiceGroupTypesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceAndServiceGroupTypesType">
    <xs:choice maxOccurs="unbounded">
      <xs:element name="StatefulServiceType" type="StatefulServiceTypeType"/>
      <xs:element name="StatelessServiceType" type="StatelessServiceTypeType"/>
      <xs:element name="StatefulServiceGroupType" type="StatefulServiceGroupTypeType"/>
      <xs:element name="StatelessServiceGroupType" type="StatelessServiceGroupTypeType"/>
    </xs:choice>
  </xs:complexType>
  
```
### Content element details

#### StatefulServiceType
|Attribute|Value|
|---|---|
|name|StatefulServiceType|
|type|StatefulServiceTypeType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceType" type="StatefulServiceTypeType"/>
      
```

#### StatelessServiceType
|Attribute|Value|
|---|---|
|name|StatelessServiceType|
|type|StatelessServiceTypeType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceType" type="StatelessServiceTypeType"/>
      
```

#### StatefulServiceGroupType
|Attribute|Value|
|---|---|
|name|StatefulServiceGroupType|
|type|StatefulServiceGroupTypeType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceGroupType" type="StatefulServiceGroupTypeType"/>
      
```

#### StatelessServiceGroupType
|Attribute|Value|
|---|---|
|name|StatelessServiceGroupType|
|type|StatelessServiceGroupTypeType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceGroupType" type="StatelessServiceGroupTypeType"/>
    
```
## ServiceDiagnosticsType complexType
Describes the diagnostic settings for the components of this service manifest.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ServiceDiagnosticsType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceDiagnosticsType">
    <xs:annotation>
      <xs:documentation>Describes the diagnostic settings for the components of this service manifest.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="ETW" minOccurs="0">
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
    </xs:sequence>
  </xs:complexType>
  
```
### Content element details

#### ETW
Describes the ETW settings for the components of this service manifest.
|Attribute|Value|
|---|---|
|name|ETW|
|minOccurs|0|

##### XML source
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
## ServiceGroupMemberType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 2 attribute(s)|
|name|ServiceGroupMemberType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceGroupMemberType">
        <xs:sequence>
            <xs:element name="LoadMetrics" minOccurs="0">
                <xs:annotation>
                    <xs:documentation>Load metrics reported by this service.</xs:documentation>
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
                <xs:documentation>Type of the service group member.</xs:documentation>
            </xs:annotation>
            <xs:simpleType>
                <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
        <xs:attribute name="Name" use="required">
            <xs:annotation>
                <xs:documentation>Name of the service group member relative to the name of the service group.</xs:documentation>
            </xs:annotation>
            <xs:simpleType>
                <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
    </xs:complexType>
    
```
### Attribute details

#### ServiceTypeName
Describes the ETW settings for the components of this service manifest.
|Attribute|Value|
|---|---|
|name|ServiceTypeName|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypeName" use="required">
            <xs:annotation>
                <xs:documentation>Type of the service group member.</xs:documentation>
            </xs:annotation>
            <xs:simpleType>
                <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
        
```

#### Name
Describes the ETW settings for the components of this service manifest.
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required">
            <xs:annotation>
                <xs:documentation>Name of the service group member relative to the name of the service group.</xs:documentation>
            </xs:annotation>
            <xs:simpleType>
                <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
    
```

### Content element details

#### LoadMetrics
Load metrics reported by this service.
|Attribute|Value|
|---|---|
|name|LoadMetrics|
|minOccurs|0|

##### XML source
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
## ServiceGroupTypeType complexType
Base type that describes a stateful or a stateless ServiceGroupType.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|4 element(s), 2 attribute(s)|
|name|ServiceGroupTypeType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceGroupTypeType">
    <xs:annotation>
      <xs:documentation>Base type that describes a stateful or a stateless ServiceGroupType.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="LoadMetrics" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Load metrics reported by this service.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="PlacementConstraints" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Constraints for the placement of services that are part of this package.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="ServiceGroupMembers" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Member types of this service group type.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element ref="ServiceGroupTypeMember" minOccurs="1" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element ref="Extensions" minOccurs="0"/>
    </xs:sequence>
    <xs:attribute name="ServiceGroupTypeName" use="required">
      <xs:annotation>
        <xs:documentation>User defined type identifier for a service group, For example, "ActorQueueSGType". This value is used in the ApplicationManifest.xml file to identify the service group.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="UseImplicitFactory" type="xs:boolean" use="optional">
      <xs:annotation>
        <xs:documentation>Specifies whether the service group instance is created by the implicit factory. If false (default), one of the code packages must register the service group factory</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### ServiceGroupTypeName
Load metrics reported by this service.
|Attribute|Value|
|---|---|
|name|ServiceGroupTypeName|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceGroupTypeName" use="required">
      <xs:annotation>
        <xs:documentation>User defined type identifier for a service group, For example, "ActorQueueSGType". This value is used in the ApplicationManifest.xml file to identify the service group.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### UseImplicitFactory
Load metrics reported by this service.
|Attribute|Value|
|---|---|
|name|UseImplicitFactory|
|type|xs:boolean|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UseImplicitFactory" type="xs:boolean" use="optional">
      <xs:annotation>
        <xs:documentation>Specifies whether the service group instance is created by the implicit factory. If false (default), one of the code packages must register the service group factory</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

### Content element details

#### LoadMetrics
Load metrics reported by this service.
|Attribute|Value|
|---|---|
|name|LoadMetrics|
|minOccurs|0|

##### XML source
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

#### PlacementConstraints
Constraints for the placement of services that are part of this package.
|Attribute|Value|
|---|---|
|name|PlacementConstraints|
|type|xs:string|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PlacementConstraints" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Constraints for the placement of services that are part of this package.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### ServiceGroupMembers
Member types of this service group type.
|Attribute|Value|
|---|---|
|name|ServiceGroupMembers|
|minOccurs|0|
|maxOccurs|1|

##### XML source
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

#### None
|Attribute|Value|
|---|---|
|ref|Extensions|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Extensions" minOccurs="0"/>
    
```
## ServiceManifestImportPoliciesType complexType
Describes policies (end-point binding, package sharing, run-as, and security access) to be applied on the imported service manifest.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|7 element(s), 0 attribute(s)|
|name|ServiceManifestImportPoliciesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceManifestImportPoliciesType">
    <xs:annotation>
      <xs:documentation>Describes policies (end-point binding, package sharing, run-as, and security access) to be applied on the imported service manifest.</xs:documentation>
    </xs:annotation>
    <xs:choice minOccurs="0" maxOccurs="unbounded">
      <xs:element name="RunAsPolicy" type="RunAsPolicyType" minOccurs="0"/>
      <xs:element name="SecurityAccessPolicy" type="SecurityAccessPolicyType" minOccurs="0"/>
      <xs:element name="PackageSharingPolicy" type="PackageSharingPolicyType" minOccurs="0"/>
      <xs:element name="EndpointBindingPolicy" type="EndpointBindingPolicyType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies a certificate that should be returned to a client for an HTTPS endpoint.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="ServicePackageResourceGovernancePolicy" type="ServicePackageResourceGovernancePolicyType" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Defines the resource governance policy that is applied at the level of the entire service package.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies resource limits for codepackage.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="ContainerHostPolicies" type="ContainerHostPoliciesType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies policies for activating container hosts.</xs:documentation>
        </xs:annotation>
      </xs:element>
    </xs:choice>
  </xs:complexType>
  
```
### Content element details

#### RunAsPolicy
|Attribute|Value|
|---|---|
|name|RunAsPolicy|
|type|RunAsPolicyType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RunAsPolicy" type="RunAsPolicyType" minOccurs="0"/>
      
```

#### SecurityAccessPolicy
|Attribute|Value|
|---|---|
|name|SecurityAccessPolicy|
|type|SecurityAccessPolicyType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SecurityAccessPolicy" type="SecurityAccessPolicyType" minOccurs="0"/>
      
```

#### PackageSharingPolicy
|Attribute|Value|
|---|---|
|name|PackageSharingPolicy|
|type|PackageSharingPolicyType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PackageSharingPolicy" type="PackageSharingPolicyType" minOccurs="0"/>
      
```

#### EndpointBindingPolicy
Specifies a certificate that should be returned to a client for an HTTPS endpoint.
|Attribute|Value|
|---|---|
|name|EndpointBindingPolicy|
|type|EndpointBindingPolicyType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="EndpointBindingPolicy" type="EndpointBindingPolicyType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies a certificate that should be returned to a client for an HTTPS endpoint.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### ServicePackageResourceGovernancePolicy
Defines the resource governance policy that is applied at the level of the entire service package.
|Attribute|Value|
|---|---|
|name|ServicePackageResourceGovernancePolicy|
|type|ServicePackageResourceGovernancePolicyType|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageResourceGovernancePolicy" type="ServicePackageResourceGovernancePolicyType" minOccurs="0" maxOccurs="1">
        <xs:annotation>
          <xs:documentation>Defines the resource governance policy that is applied at the level of the entire service package.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### ResourceGovernancePolicy
Specifies resource limits for codepackage.
|Attribute|Value|
|---|---|
|name|ResourceGovernancePolicy|
|type|ResourceGovernancePolicyType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ResourceGovernancePolicy" type="ResourceGovernancePolicyType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies resource limits for codepackage.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### ContainerHostPolicies
Specifies policies for activating container hosts.
|Attribute|Value|
|---|---|
|name|ContainerHostPolicies|
|type|ContainerHostPoliciesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerHostPolicies" type="ContainerHostPoliciesType" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Specifies policies for activating container hosts.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```
## ServiceManifestRefType complexType
Imports the service manifest by reference. Currently the service manifest file (ServiceManifest.xml) must be present in the build package.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|ServiceManifestRefType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceManifestRefType">
    <xs:annotation>
      <xs:documentation>Imports the service manifest by reference. Currently the service manifest file (ServiceManifest.xml) must be present in the build package.</xs:documentation>
    </xs:annotation>
    <xs:attributeGroup ref="ServiceManifestIdentifier"/>
  </xs:complexType>
  
```
## ServiceManifestType complexType
Declaratively describes the service type and version. It lists the independently upgradeable code, configuration, and data packages that together compose a service package to support one or more service types. Resources, diagnostics settings, and service metadata, such as service type, health properties, and load-balancing metrics, are also specified.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|7 element(s), 1 attribute(s)|
|name|ServiceManifestType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceManifestType">
    <xs:annotation>
      <xs:documentation>Declaratively describes the service type and version. It lists the independently upgradeable code, configuration, and data packages that together compose a service package to support one or more service types. Resources, diagnostics settings, and service metadata, such as service type, health properties, and load-balancing metrics, are also specified.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="Description" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Text describing this service.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="ServiceTypes" type="ServiceAndServiceGroupTypesType">
        <xs:annotation>
          <xs:documentation>Defines what service types are supported by a CodePackage in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. Service types are declared at the manifest level and not the code package level.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="CodePackage" type="CodePackageType" maxOccurs="unbounded"/>
      <xs:element name="ConfigPackage" type="ConfigPackageType" minOccurs="0" maxOccurs="unbounded"/>
      <xs:element name="DataPackage" type="DataPackageType" minOccurs="0" maxOccurs="unbounded"/>
      <xs:element name="Resources" type="ResourcesType" minOccurs="0"/>
      <xs:element name="Diagnostics" type="ServiceDiagnosticsType" minOccurs="0"/>
    </xs:sequence>
    <xs:attribute name="ManifestId" use="optional" default="" type="xs:string">
      <xs:annotation>
        <xs:documentation>The identifier of this service manifest, an un-structured string.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attributeGroup ref="VersionedName"/>
    <xs:anyAttribute processContents="skip"/> <!-- Allow unknown attributes to be used. -->
  </xs:complexType>
  
```
### Attribute details

#### ManifestId
Specifies policies for activating container hosts.
|Attribute|Value|
|---|---|
|name|ManifestId|
|use|optional|
|default||
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ManifestId" use="optional" default="" type="xs:string">
      <xs:annotation>
        <xs:documentation>The identifier of this service manifest, an un-structured string.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

### Content element details

#### Description
Text describing this service.
|Attribute|Value|
|---|---|
|name|Description|
|type|xs:string|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Description" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Text describing this service.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### ServiceTypes
Defines what service types are supported by a CodePackage in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. Service types are declared at the manifest level and not the code package level.
|Attribute|Value|
|---|---|
|name|ServiceTypes|
|type|ServiceAndServiceGroupTypesType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypes" type="ServiceAndServiceGroupTypesType">
        <xs:annotation>
          <xs:documentation>Defines what service types are supported by a CodePackage in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. Service types are declared at the manifest level and not the code package level.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### CodePackage
|Attribute|Value|
|---|---|
|name|CodePackage|
|type|CodePackageType|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CodePackage" type="CodePackageType" maxOccurs="unbounded"/>
      
```

#### ConfigPackage
|Attribute|Value|
|---|---|
|name|ConfigPackage|
|type|ConfigPackageType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigPackage" type="ConfigPackageType" minOccurs="0" maxOccurs="unbounded"/>
      
```

#### DataPackage
|Attribute|Value|
|---|---|
|name|DataPackage|
|type|DataPackageType|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DataPackage" type="DataPackageType" minOccurs="0" maxOccurs="unbounded"/>
      
```

#### Resources
|Attribute|Value|
|---|---|
|name|Resources|
|type|ResourcesType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Resources" type="ResourcesType" minOccurs="0"/>
      
```

#### Diagnostics
|Attribute|Value|
|---|---|
|name|Diagnostics|
|type|ServiceDiagnosticsType|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Diagnostics" type="ServiceDiagnosticsType" minOccurs="0"/>
    
```
## ServicePackageResourceGovernancePolicyType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 2 attribute(s)|
|name|ServicePackageResourceGovernancePolicyType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageResourceGovernancePolicyType">
    <xs:attribute name="CpuCores" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>CPU limit in number of logical cores. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:decimal">
            <xs:minInclusive value="0"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="MemoryInMB" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Memory limits in MB. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### CpuCores
|Attribute|Value|
|---|---|
|name|CpuCores|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CpuCores" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>CPU limit in number of logical cores. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:decimal">
            <xs:minInclusive value="0"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### MemoryInMB
|Attribute|Value|
|---|---|
|name|MemoryInMB|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MemoryInMB" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Memory limits in MB. Must be a positive integer.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:nonNegativeInteger"/>
      </xs:simpleType>
    </xs:attribute>
  
```

## ServicePackageType complexType
ServicePackage represents a versioned unit of deployment and activation. The version of the ServicePackage is determined based on the manifest version and the version of the overrides.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|8 element(s), 4 attribute(s)|
|name|ServicePackageType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageType">
    <xs:annotation>
      <xs:documentation>ServicePackage represents a versioned unit of deployment and activation. The version of the ServicePackage is determined based on the manifest version and the version of the overrides.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="Description" type="xs:string" minOccurs="0"/>
      <xs:element name="ServicePackageResourceGovernancePolicy" type="ServicePackageResourceGovernancePolicyType" minOccurs="0" maxOccurs="1"/>
      <xs:element name="DigestedServiceTypes">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="ServiceTypes" type="ServiceTypesType"/>
          </xs:sequence>
          <xs:attributeGroup ref="VersionedItemAttrGroup"/>
        </xs:complexType>
      </xs:element>
      <xs:element name="DigestedCodePackage" maxOccurs="unbounded">
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
      <xs:element name="DigestedConfigPackage" minOccurs="0" maxOccurs="unbounded">
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
      <xs:element name="DigestedDataPackage" minOccurs="0" maxOccurs="unbounded">
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
      <xs:element name="DigestedResources" minOccurs="1">
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
      <xs:element name="Diagnostics" type="ServiceDiagnosticsType"/>
    </xs:sequence>
    <xs:attribute name="Name" type="xs:string" use="required"/>
    <xs:attribute name="ManifestVersion" type="xs:string" use="required"/>
    <xs:attributeGroup ref="VersionedItemAttrGroup"/>
    <xs:attribute name="ManifestChecksum" type="xs:string">
      <xs:annotation>
        <xs:documentation>Checksum value of the ServiceManifest file</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="ContentChecksum" type="xs:string">
      <xs:annotation>
        <xs:documentation>Checksum value of this ServicePackage content</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### Name
|Attribute|Value|
|---|---|
|name|Name|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" type="xs:string" use="required"/>
    
```

#### ManifestVersion
|Attribute|Value|
|---|---|
|name|ManifestVersion|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ManifestVersion" type="xs:string" use="required"/>
    
```

#### ManifestChecksum
|Attribute|Value|
|---|---|
|name|ManifestChecksum|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ManifestChecksum" type="xs:string">
      <xs:annotation>
        <xs:documentation>Checksum value of the ServiceManifest file</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### ContentChecksum
|Attribute|Value|
|---|---|
|name|ContentChecksum|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContentChecksum" type="xs:string">
      <xs:annotation>
        <xs:documentation>Checksum value of this ServicePackage content</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

### Content element details

#### Description
|Attribute|Value|
|---|---|
|name|Description|
|type|xs:string|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Description" type="xs:string" minOccurs="0"/>
      
```

#### ServicePackageResourceGovernancePolicy
|Attribute|Value|
|---|---|
|name|ServicePackageResourceGovernancePolicy|
|type|ServicePackageResourceGovernancePolicyType|
|minOccurs|0|
|maxOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageResourceGovernancePolicy" type="ServicePackageResourceGovernancePolicyType" minOccurs="0" maxOccurs="1"/>
      
```

#### DigestedServiceTypes
|Attribute|Value|
|---|---|
|name|DigestedServiceTypes|

##### XML source
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

#### DigestedCodePackage
|Attribute|Value|
|---|---|
|name|DigestedCodePackage|
|maxOccurs|unbounded|

##### XML source
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

#### DigestedConfigPackage
|Attribute|Value|
|---|---|
|name|DigestedConfigPackage|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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

#### DigestedDataPackage
|Attribute|Value|
|---|---|
|name|DigestedDataPackage|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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

#### DigestedResources
|Attribute|Value|
|---|---|
|name|DigestedResources|
|minOccurs|1|

##### XML source
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

#### Diagnostics
|Attribute|Value|
|---|---|
|name|Diagnostics|
|type|ServiceDiagnosticsType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Diagnostics" type="ServiceDiagnosticsType"/>
    
```
## ServiceTemplatesType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|4 element(s), 0 attribute(s)|
|name|ServiceTemplatesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTemplatesType">
        <xs:choice minOccurs="0" maxOccurs="unbounded">
            <xs:element name="StatelessService" type="StatelessServiceType"/>
            <xs:element name="StatefulService" type="StatefulServiceType"/>
            <xs:element name="StatelessServiceGroup" type="StatelessServiceGroupType"/>
            <xs:element name="StatefulServiceGroup" type="StatefulServiceGroupType"/>
        </xs:choice>
    </xs:complexType>
    
```
### Content element details

#### StatelessService
|Attribute|Value|
|---|---|
|name|StatelessService|
|type|StatelessServiceType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessService" type="StatelessServiceType"/>
            
```

#### StatefulService
|Attribute|Value|
|---|---|
|name|StatefulService|
|type|StatefulServiceType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulService" type="StatefulServiceType"/>
            
```

#### StatelessServiceGroup
|Attribute|Value|
|---|---|
|name|StatelessServiceGroup|
|type|StatelessServiceGroupType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceGroup" type="StatelessServiceGroupType"/>
            
```

#### StatefulServiceGroup
|Attribute|Value|
|---|---|
|name|StatefulServiceGroup|
|type|StatefulServiceGroupType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceGroup" type="StatefulServiceGroupType"/>
        
```
## ServiceType complexType
Base type that defines a Microsoft Azure Service Fabric service.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|4 element(s), 2 attribute(s)|
|name|ServiceType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceType">
        <xs:annotation>
            <xs:documentation>Base type that defines a Microsoft Azure Service Fabric service.</xs:documentation>
        </xs:annotation>
        <xs:sequence>
            <xs:group ref="PartitionDescriptionGroup"/>
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
            <xs:element name="PlacementConstraints" type="xs:string" minOccurs="0">
                <xs:annotation>
                    <xs:documentation>Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service’s requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion&gt;12  &amp;&amp; InDMZ == True)".</xs:documentation>
                </xs:annotation>
            </xs:element>
            <xs:element name="ServiceCorrelations" minOccurs="0">
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
            <xs:element name="ServicePlacementPolicies" minOccurs="0">
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
        </xs:sequence>
        <xs:attribute name="ServiceTypeName" use="required">
            <xs:annotation>
                <xs:documentation>Name of the service type, declared in the service manifest, that will be instantiated.</xs:documentation>
            </xs:annotation>
            <xs:simpleType>
                <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
        <xs:attribute name="DefaultMoveCost">
            <xs:annotation>
                <xs:documentation>Specifies default move cost for this service.</xs:documentation>
            </xs:annotation>
            <xs:simpleType>
                <xs:restriction base="xs:string">
                    <xs:enumeration value="Zero"/>
                    <xs:enumeration value="Low"/>
                    <xs:enumeration value="Medium"/>
                    <xs:enumeration value="High"/>
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
    </xs:complexType>
    
```
### Attribute details

#### ServiceTypeName
|Attribute|Value|
|---|---|
|name|ServiceTypeName|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypeName" use="required">
            <xs:annotation>
                <xs:documentation>Name of the service type, declared in the service manifest, that will be instantiated.</xs:documentation>
            </xs:annotation>
            <xs:simpleType>
                <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
        
```

#### DefaultMoveCost
|Attribute|Value|
|---|---|
|name|DefaultMoveCost|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DefaultMoveCost">
            <xs:annotation>
                <xs:documentation>Specifies default move cost for this service.</xs:documentation>
            </xs:annotation>
            <xs:simpleType>
                <xs:restriction base="xs:string">
                    <xs:enumeration value="Zero"/>
                    <xs:enumeration value="Low"/>
                    <xs:enumeration value="Medium"/>
                    <xs:enumeration value="High"/>
                </xs:restriction>
            </xs:simpleType>
        </xs:attribute>
    
```

### Content element details

#### LoadMetrics
Load metrics reported by this service, used for resource balancing services.
|Attribute|Value|
|---|---|
|name|LoadMetrics|
|minOccurs|0|

##### XML source
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

#### PlacementConstraints
Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service’s requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion>12  && InDMZ == True)".
|Attribute|Value|
|---|---|
|name|PlacementConstraints|
|type|xs:string|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PlacementConstraints" type="xs:string" minOccurs="0">
                <xs:annotation>
                    <xs:documentation>Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service’s requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion&gt;12  &amp;&amp; InDMZ == True)".</xs:documentation>
                </xs:annotation>
            </xs:element>
            
```

#### ServiceCorrelations
Defines affinity relationships between services.
|Attribute|Value|
|---|---|
|name|ServiceCorrelations|
|minOccurs|0|

##### XML source
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

#### ServicePlacementPolicies
Declares placement policies for a service.  Useful when the cluster spans geographic distances or and/or geopolitical regions.
|Attribute|Value|
|---|---|
|name|ServicePlacementPolicies|
|minOccurs|0|

##### XML source
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
## ServiceTypeExtensionPolicyPropertiesType complexType
Defines Properties for the Persistence and Eviction policies.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|ServiceTypeExtensionPolicyPropertiesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypeExtensionPolicyPropertiesType">
    <xs:annotation>
      <xs:documentation>Defines Properties for the Persistence and Eviction policies.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="Property" minOccurs="0" maxOccurs="unbounded">
        <xs:complexType>
          <xs:attribute name="Name" type="xs:string" use="required"/>
          <xs:attribute name="Value" type="xs:string" use="required"/>
        </xs:complexType>
      </xs:element>
    </xs:sequence>
  </xs:complexType>
  
```
### Content element details

#### Property
|Attribute|Value|
|---|---|
|name|Property|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Property" minOccurs="0" maxOccurs="unbounded">
        <xs:complexType>
          <xs:attribute name="Name" type="xs:string" use="required"/>
          <xs:attribute name="Value" type="xs:string" use="required"/>
        </xs:complexType>
      </xs:element>
    
```
## ServiceTypeHealthPolicyType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 3 attribute(s)|
|name|ServiceTypeHealthPolicyType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypeHealthPolicyType">    
    <xs:attribute name="MaxPercentUnhealthyServices" type="xs:string" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Specifies the maximum tolerated percentage of unhealthy services before the application is considered unhealthy. Default percentage: 0.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="MaxPercentUnhealthyPartitionsPerService" type="xs:string" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Specifies the maximum tolerated percentage of unhealthy partitions before a service is considered unhealthy. Default percentage: 0.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="MaxPercentUnhealthyReplicasPerPartition" type="xs:string" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Specifies the maximum tolerated percentage of unhealthy replicas before a partition is considered unhealthy. Default percentage: 0.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### MaxPercentUnhealthyServices
|Attribute|Value|
|---|---|
|name|MaxPercentUnhealthyServices|
|type|xs:string|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MaxPercentUnhealthyServices" type="xs:string" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Specifies the maximum tolerated percentage of unhealthy services before the application is considered unhealthy. Default percentage: 0.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### MaxPercentUnhealthyPartitionsPerService
|Attribute|Value|
|---|---|
|name|MaxPercentUnhealthyPartitionsPerService|
|type|xs:string|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MaxPercentUnhealthyPartitionsPerService" type="xs:string" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Specifies the maximum tolerated percentage of unhealthy partitions before a service is considered unhealthy. Default percentage: 0.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### MaxPercentUnhealthyReplicasPerPartition
|Attribute|Value|
|---|---|
|name|MaxPercentUnhealthyReplicasPerPartition|
|type|xs:string|
|use|optional|
|default|0|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MaxPercentUnhealthyReplicasPerPartition" type="xs:string" use="optional" default="0">
      <xs:annotation>
        <xs:documentation>Specifies the maximum tolerated percentage of unhealthy replicas before a partition is considered unhealthy. Default percentage: 0.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## ServiceTypeType complexType
Base type that describes a stateful or a stateless ServiceType.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|4 element(s), 1 attribute(s)|
|name|ServiceTypeType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypeType">
    <xs:annotation>
      <xs:documentation>Base type that describes a stateful or a stateless ServiceType.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="LoadMetrics" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Load metrics reported by this service.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="LoadMetric" type="LoadMetricType" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="PlacementConstraints" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service's requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion&gt;12  &amp;&amp; InDMZ == True)".</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="ServicePlacementPolicies" minOccurs="0">
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
      <xs:element ref="Extensions" minOccurs="0"/>
    </xs:sequence>
    <xs:attribute name="ServiceTypeName" use="required">
      <xs:annotation>
        <xs:documentation>User defined type identifier for a service. For example, "QueueType" or "CalculatorType". This value is used in the ApplicationManifest.xml file to identify the service.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### ServiceTypeName
|Attribute|Value|
|---|---|
|name|ServiceTypeName|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypeName" use="required">
      <xs:annotation>
        <xs:documentation>User defined type identifier for a service. For example, "QueueType" or "CalculatorType". This value is used in the ApplicationManifest.xml file to identify the service.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

### Content element details

#### LoadMetrics
Load metrics reported by this service.
|Attribute|Value|
|---|---|
|name|LoadMetrics|
|minOccurs|0|

##### XML source
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

#### PlacementConstraints
Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service's requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion>12  && InDMZ == True)".
|Attribute|Value|
|---|---|
|name|PlacementConstraints|
|type|xs:string|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="PlacementConstraints" type="xs:string" minOccurs="0">
        <xs:annotation>
          <xs:documentation>Used to control which nodes in the cluster a service can run on. A key/value pair which describes the node property name and the service's requirements for the value. Individual statements can be grouped together with simple boolean logic to create the necessary constraint. For example, "(FirmwareVersion&gt;12  &amp;&amp; InDMZ == True)".</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### ServicePlacementPolicies
Declares placement policies for a service.  Useful when the cluster spans geographic distances or and/or geopolitical regions.
|Attribute|Value|
|---|---|
|name|ServicePlacementPolicies|
|minOccurs|0|

##### XML source
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

#### None
|Attribute|Value|
|---|---|
|ref|Extensions|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" ref="Extensions" minOccurs="0"/>
    
```
## ServiceTypesType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|ServiceTypesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceTypesType">
    <xs:choice maxOccurs="unbounded">
      <xs:element name="StatefulServiceType" type="StatefulServiceTypeType">
        <xs:annotation>
          <xs:documentation>Describes a stateful ServiceType.</xs:documentation>
        </xs:annotation>
      </xs:element>
      <xs:element name="StatelessServiceType" type="StatelessServiceTypeType">
        <xs:annotation>
          <xs:documentation>Describes a stateless ServiceType.</xs:documentation>
        </xs:annotation>
      </xs:element>
    </xs:choice>
  </xs:complexType>
  
```
### Content element details

#### StatefulServiceType
Describes a stateful ServiceType.
|Attribute|Value|
|---|---|
|name|StatefulServiceType|
|type|StatefulServiceTypeType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceType" type="StatefulServiceTypeType">
        <xs:annotation>
          <xs:documentation>Describes a stateful ServiceType.</xs:documentation>
        </xs:annotation>
      </xs:element>
      
```

#### StatelessServiceType
Describes a stateless ServiceType.
|Attribute|Value|
|---|---|
|name|StatelessServiceType|
|type|StatelessServiceTypeType|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceType" type="StatelessServiceTypeType">
        <xs:annotation>
          <xs:documentation>Describes a stateless ServiceType.</xs:documentation>
        </xs:annotation>
      </xs:element>
    
```
## SettingsOverridesType complexType
Declares configuration settings in a service manifest to be overridden. It consists of one or more sections of key-value pairs. Parameter values can be encrypted using the Invoke-ServiceFabricEncryptSecret cmdlet.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|SettingsOverridesType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SettingsOverridesType">
    <xs:annotation>
      <xs:documentation>Declares configuration settings in a service manifest to be overridden. It consists of one or more sections of key-value pairs. Parameter values can be encrypted using the Invoke-ServiceFabricEncryptSecret cmdlet.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="Section" maxOccurs="unbounded">
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
        </xs:sequence>
    </xs:complexType>
    
```
### Content element details

#### Section
A section in the Settings.xml file to override.
|Attribute|Value|
|---|---|
|name|Section|
|maxOccurs|unbounded|

##### XML source
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
## SettingsType complexType
Describes user defined settings for a ServiceComponent or an Application. It consists of one or more sections of key-value pairs.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|SettingsType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="SettingsType">
    <xs:annotation>
      <xs:documentation>Describes user defined settings for a ServiceComponent or an Application. It consists of one or more sections of key-value pairs.</xs:documentation>
    </xs:annotation>
    <xs:sequence>
      <xs:element name="Section" minOccurs="0" maxOccurs="unbounded">
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
    </xs:sequence>
  </xs:complexType>
  
```
### Content element details

#### Section
A user defined named section.
|Attribute|Value|
|---|---|
|name|Section|
|minOccurs|0|
|maxOccurs|unbounded|

##### XML source
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
## StatefulServiceGroupType complexType
Defines a stateful service group.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceGroupType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceGroupType">
        <xs:annotation>
            <xs:documentation>Defines a stateful service group.</xs:documentation>
        </xs:annotation>
        <xs:complexContent>
            <xs:extension base="StatefulServiceType">
                <xs:sequence>
                    <xs:element name="Members" minOccurs="1" maxOccurs="1">
                        <xs:annotation>
                            <xs:documentation>Member services of this service group</xs:documentation>
                        </xs:annotation>
                        <xs:complexType>
                            <xs:sequence>
                                <xs:element name="Member" type="ServiceGroupMemberType" minOccurs="1" maxOccurs="unbounded"/>
                            </xs:sequence>
                        </xs:complexType>
                    </xs:element>
                </xs:sequence>
            </xs:extension>
        </xs:complexContent>
    </xs:complexType>
    
```
## StatefulServiceGroupTypeType complexType
Describes a stateful service group type.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceGroupTypeType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceGroupTypeType">
    <xs:annotation>
      <xs:documentation>Describes a stateful service group type.</xs:documentation>
    </xs:annotation>
    <xs:complexContent>
      <xs:extension base="ServiceGroupTypeType">
        <xs:attribute name="HasPersistedState" type="xs:boolean" default="false">
          <xs:annotation>
            <xs:documentation>True if the service group has state that needs to be persisted.</xs:documentation>
          </xs:annotation>
        </xs:attribute>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
  
```
## StatefulServiceType complexType
Defines a stateful service.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceType">
        <xs:annotation>
            <xs:documentation>Defines a stateful service.</xs:documentation>
        </xs:annotation>
        <xs:complexContent>
            <xs:extension base="ServiceType">
                <xs:attribute name="TargetReplicaSetSize" type="xs:string" default="1">
                    <xs:annotation>
                        <xs:documentation>Desired replica set size for the partitions of this stateful service. Must be a positive integer. This is a target size; a replica set is still functional with less members. The quorum is a majority based quorum.</xs:documentation>
                    </xs:annotation>
                </xs:attribute>
                <xs:attribute name="MinReplicaSetSize" type="xs:string" default="1">
                    <xs:annotation>
                        <xs:documentation>Minimum number of replicas required in the replica set to allow writes.  Must be positive integer less than TargetReplicaSetSize. </xs:documentation>
                    </xs:annotation>
                </xs:attribute>
                <xs:attribute name="ReplicaRestartWaitDurationSeconds" type="xs:string" use="optional" default="">
                    <xs:annotation>
                        <xs:documentation>The duration between when a replica goes down and when a new replica is created. When a persistent replica goes down, this timer starts.  When it expires Service Fabric will create a new replica on any node in the cluster.</xs:documentation>
                    </xs:annotation>
                </xs:attribute>
                <xs:attribute name="QuorumLossWaitDurationSeconds" type="xs:string" use="optional" default="">
                    <xs:annotation>
                        <xs:documentation>The maximum duration for which a partition is allowed to be in a state of quorum loss. If the partition is still in quorum loss after this duration, the partition is recovered from quorum loss by considering the down replicas as lost. Note that this can potentially incur data loss.</xs:documentation>
                    </xs:annotation>
                </xs:attribute>
                <xs:attribute name="StandByReplicaKeepDurationSeconds" type="xs:string" use="optional" default="">
                    <xs:annotation>
                        <xs:documentation>How long StandBy replicas should be maintained before being removed. Sometimes a replica will be down for longer than the ReplicaRestartWaitDuration. In these cases a new replica will be built to replace it. Sometimes however the loss is not permanent and the persistent replica is eventually recovered. This now constitutes a StandBy replica.</xs:documentation>
                    </xs:annotation>
                </xs:attribute>
            </xs:extension>
        </xs:complexContent>
    </xs:complexType>
    
```
## StatefulServiceTypeType complexType
Describes a stateful service type.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|StatefulServiceTypeType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatefulServiceTypeType">
    <xs:annotation>
      <xs:documentation>Describes a stateful service type.</xs:documentation>
    </xs:annotation>
    <xs:complexContent>
      <xs:extension base="ServiceTypeType">
        <xs:attribute name="HasPersistedState" type="xs:boolean" default="false">
          <xs:annotation>
            <xs:documentation>True if the service has state that needs to be persisted on the local disk.</xs:documentation>
          </xs:annotation>
        </xs:attribute>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
  
```
## StatelessServiceGroupType complexType
Defines a stateless service group.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceGroupType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceGroupType">
        <xs:annotation>
            <xs:documentation>Defines a stateless service group.</xs:documentation>
        </xs:annotation>
        <xs:complexContent>
            <xs:extension base="StatelessServiceType">
                <xs:sequence>
                    <xs:element name="Members" minOccurs="1" maxOccurs="1">
                        <xs:annotation>
                            <xs:documentation>Member services of this service group</xs:documentation>
                        </xs:annotation>
                        <xs:complexType>
                            <xs:sequence>
                                <xs:element name="Member" type="ServiceGroupMemberType" minOccurs="1" maxOccurs="unbounded"/>
                            </xs:sequence>
                        </xs:complexType>
                    </xs:element>
                </xs:sequence>
            </xs:extension>
        </xs:complexContent>
    </xs:complexType>
    
```
## StatelessServiceGroupTypeType complexType
Describes a stateless service group type.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceGroupTypeType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceGroupTypeType">
    <xs:annotation>
      <xs:documentation>Describes a stateless service group type.</xs:documentation>
    </xs:annotation>
    <xs:complexContent>
      <xs:extension base="ServiceGroupTypeType"/>
    </xs:complexContent>
  </xs:complexType>
  
```
## StatelessServiceType complexType
Defines a stateless service.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceType">
        <xs:annotation>
            <xs:documentation>Defines a stateless service.</xs:documentation>
        </xs:annotation>
        <xs:complexContent>
            <xs:extension base="ServiceType">
                <xs:attribute name="InstanceCount" type="xs:string" default="1">
                    <xs:annotation>
                        <xs:documentation>Number of instances required for this stateless service (positive integer).</xs:documentation>
                    </xs:annotation>
                </xs:attribute>
            </xs:extension>
        </xs:complexContent>
    </xs:complexType>
    
```
## StatelessServiceTypeType complexType
Describes a stateless service type.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|StatelessServiceTypeType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="StatelessServiceTypeType">
    <xs:annotation>
      <xs:documentation>Describes a stateless service type.</xs:documentation>
    </xs:annotation>
    <xs:complexContent>
      <xs:extension base="ServiceTypeType">
        <xs:attribute name="UseImplicitHost" type="xs:boolean" default="false">
          <xs:annotation>
            <xs:documentation>Specifies if the service type should be implemented implicitly as a guest executable. Guest executables are used for hosting any type of applications (such as Node.js or Java) or legacy applications that do not implement the Service Fabric service interfaces.</xs:documentation>
          </xs:annotation>
        </xs:attribute>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
  
```
## TargetInformationType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|2 element(s), 0 attribute(s)|
|name|TargetInformationType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="TargetInformationType">
    <xs:all>
      <xs:element name="CurrentInstallation" type="WindowsFabricDeploymentInformation" minOccurs="0"/>
      <xs:element name="TargetInstallation" type="WindowsFabricDeploymentInformation" minOccurs="1"/>
    </xs:all>
  </xs:complexType>
  
```
### Content element details

#### CurrentInstallation
|Attribute|Value|
|---|---|
|name|CurrentInstallation|
|type|WindowsFabricDeploymentInformation|
|minOccurs|0|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="CurrentInstallation" type="WindowsFabricDeploymentInformation" minOccurs="0"/>
      
```

#### TargetInstallation
|Attribute|Value|
|---|---|
|name|TargetInstallation|
|type|WindowsFabricDeploymentInformation|
|minOccurs|1|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="TargetInstallation" type="WindowsFabricDeploymentInformation" minOccurs="1"/>
    
```
## UnmanagedDllType complexType
Unsupported, do not use. The name of unmanaged assembly (for example, Queue.dll), to host.

|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 0 attribute(s)|
|name|UnmanagedDllType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UnmanagedDllType">
    <xs:annotation>
        <xs:documentation>Unsupported, do not use. The name of unmanaged assembly (for example, Queue.dll), to host.</xs:documentation>
    </xs:annotation>
    <xs:simpleContent>
      <xs:extension base="xs:string"/>
    </xs:simpleContent>
  </xs:complexType>
  
```
## WindowsFabricDeploymentInformation complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|0 element(s), 11 attribute(s)|
|name|WindowsFabricDeploymentInformation|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="WindowsFabricDeploymentInformation">
    <xs:attribute name="InstanceId" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>This is the target instance of the node.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="MSILocation" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>This is the full path to the MSI location.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="ClusterManifestLocation" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>This is the full path to the Cluster Manifest Location.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="InfrastructureManifestLocation" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>This location of the infrastructure manifest that is internally generated.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="TargetVersion" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>This is the Target Version of the deployment.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="NodeName" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>This is the name of the Node to which the Fabric Upgrade is to happe</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="RemoveNodeState" type="xs:boolean" use="optional" default="false">
        <xs:annotation>
            <xs:documentation>A flag indicating if RemoveNodeState Api should be called after removing node configuration.</xs:documentation>
        </xs:annotation>
    </xs:attribute>
    <xs:attribute name="UpgradeEntryPointExe" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>Name of the exe used by the installer service to upgrade </xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="UpgradeEntryPointExeParameters" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>Parameters to the Setup Entry point exe</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="UndoUpgradeEntryPointExe" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>Name of the exe used by the installer service to undo the upgrade</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="UndoUpgradeEntryPointExeParameters" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>Parameters to the Setup Entry point exe</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:complexType>
  
```
### Attribute details

#### InstanceId
|Attribute|Value|
|---|---|
|name|InstanceId|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="InstanceId" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>This is the target instance of the node.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### MSILocation
|Attribute|Value|
|---|---|
|name|MSILocation|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="MSILocation" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>This is the full path to the MSI location.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### ClusterManifestLocation
|Attribute|Value|
|---|---|
|name|ClusterManifestLocation|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ClusterManifestLocation" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>This is the full path to the Cluster Manifest Location.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### InfrastructureManifestLocation
|Attribute|Value|
|---|---|
|name|InfrastructureManifestLocation|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="InfrastructureManifestLocation" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>This location of the infrastructure manifest that is internally generated.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### TargetVersion
|Attribute|Value|
|---|---|
|name|TargetVersion|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="TargetVersion" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>This is the Target Version of the deployment.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### NodeName
|Attribute|Value|
|---|---|
|name|NodeName|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeName" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>This is the name of the Node to which the Fabric Upgrade is to happe</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### RemoveNodeState
|Attribute|Value|
|---|---|
|name|RemoveNodeState|
|type|xs:boolean|
|use|optional|
|default|false|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RemoveNodeState" type="xs:boolean" use="optional" default="false">
        <xs:annotation>
            <xs:documentation>A flag indicating if RemoveNodeState Api should be called after removing node configuration.</xs:documentation>
        </xs:annotation>
    </xs:attribute>
    
```

#### UpgradeEntryPointExe
|Attribute|Value|
|---|---|
|name|UpgradeEntryPointExe|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UpgradeEntryPointExe" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>Name of the exe used by the installer service to upgrade </xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### UpgradeEntryPointExeParameters
|Attribute|Value|
|---|---|
|name|UpgradeEntryPointExeParameters|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UpgradeEntryPointExeParameters" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>Parameters to the Setup Entry point exe</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### UndoUpgradeEntryPointExe
|Attribute|Value|
|---|---|
|name|UndoUpgradeEntryPointExe|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UndoUpgradeEntryPointExe" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>Name of the exe used by the installer service to undo the upgrade</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### UndoUpgradeEntryPointExeParameters
|Attribute|Value|
|---|---|
|name|UndoUpgradeEntryPointExeParameters|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UndoUpgradeEntryPointExeParameters" type="xs:string" use="optional">
      <xs:annotation>
        <xs:documentation>Parameters to the Setup Entry point exe</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## WindowsInfrastructureType complexType
|Attribute|Value|
|---|---|
|type|anonymous complexType|
|content|1 element(s), 0 attribute(s)|
|name|WindowsInfrastructureType|

### XML source
```xml
<xs:complexType xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="WindowsInfrastructureType">
                <xs:sequence>
                        <xs:element name="NodeList">
                                <xs:complexType>
                                        <xs:sequence>
                                                <xs:element name="Node" type="FabricNodeType" maxOccurs="unbounded"/>
                                        </xs:sequence>
                                </xs:complexType>
                        </xs:element>
                </xs:sequence>
        </xs:complexType>
  
```
### Content element details

#### NodeList
|Attribute|Value|
|---|---|
|name|NodeList|

##### XML source
```xml
<xs:element xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NodeList">
                                <xs:complexType>
                                        <xs:sequence>
                                                <xs:element name="Node" type="FabricNodeType" maxOccurs="unbounded"/>
                                        </xs:sequence>
                                </xs:complexType>
                        </xs:element>
                
```
## AccountCredentialsGroup attributeGroup
|Attribute|Value|
|---|---|
|content|2 attribute(s)|
|name|AccountCredentialsGroup|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AccountCredentialsGroup">
        <xs:attribute name="AccountName" type="xs:string" use="optional">
            <xs:annotation>
                <xs:documentation>User name or Service Account Name (i.e., MyMachine\JohnDoe or John.Doe@department.contoso.com).</xs:documentation>
            </xs:annotation>
        </xs:attribute>
        <xs:attribute name="Password" type="xs:string" use="optional">
            <xs:annotation>
                <xs:documentation>Password for the user account.</xs:documentation>
            </xs:annotation>
        </xs:attribute>
    </xs:attributeGroup>
    
```
### Attribute details

#### AccountName
User name or Service Account Name (i.e., MyMachine\JohnDoe or John.Doe@department.contoso.com).
|Attribute|Value|
|---|---|
|name|AccountName|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="AccountName" type="xs:string" use="optional">
            <xs:annotation>
                <xs:documentation>User name or Service Account Name (i.e., MyMachine\JohnDoe or John.Doe@department.contoso.com).</xs:documentation>
            </xs:annotation>
        </xs:attribute>
        
```

#### Password
Password for the user account.
|Attribute|Value|
|---|---|
|name|Password|
|type|xs:string|
|use|optional|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Password" type="xs:string" use="optional">
            <xs:annotation>
                <xs:documentation>Password for the user account.</xs:documentation>
            </xs:annotation>
        </xs:attribute>
    
```

## ApplicationInstanceAttrGroup attributeGroup
Attribute group for application instance.

|Attribute|Value|
|---|---|
|content|2 attribute(s)|
|name|ApplicationInstanceAttrGroup|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationInstanceAttrGroup">
    <xs:annotation>
      <xs:documentation>Attribute group for application instance.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="NameUri" type="FabricUri" use="required">
      <xs:annotation>
        <xs:documentation>Fully qualified name of the application.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:attribute name="ApplicationId" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Id of this application.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:attributeGroup>
  
```
### Attribute details

#### NameUri
Fully qualified name of the application.
|Attribute|Value|
|---|---|
|name|NameUri|
|type|FabricUri|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NameUri" type="FabricUri" use="required">
      <xs:annotation>
        <xs:documentation>Fully qualified name of the application.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

#### ApplicationId
Id of this application.
|Attribute|Value|
|---|---|
|name|ApplicationId|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationId" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Id of this application.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## ApplicationManifestAttrGroup attributeGroup
Attribute group for application manifest.

|Attribute|Value|
|---|---|
|content|3 attribute(s)|
|name|ApplicationManifestAttrGroup|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationManifestAttrGroup">
    <xs:annotation>
      <xs:documentation>Attribute group for application manifest.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="ApplicationTypeName" use="required">
      <xs:annotation>
        <xs:documentation>The type identifier for this application.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="ApplicationTypeVersion" use="required">
      <xs:annotation>
        <xs:documentation>The version of this application type, an un-structured string.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="ManifestId" use="optional" default="" type="xs:string">
      <xs:annotation>
        <xs:documentation>The identifier of this application manifest, an un-structured string.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    <xs:anyAttribute processContents="skip"/> <!-- Allow unknown attributes to be used. -->
  </xs:attributeGroup>
  
```
### Attribute details

#### ApplicationTypeName
The type identifier for this application.
|Attribute|Value|
|---|---|
|name|ApplicationTypeName|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationTypeName" use="required">
      <xs:annotation>
        <xs:documentation>The type identifier for this application.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### ApplicationTypeVersion
The version of this application type, an un-structured string.
|Attribute|Value|
|---|---|
|name|ApplicationTypeVersion|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ApplicationTypeVersion" use="required">
      <xs:annotation>
        <xs:documentation>The version of this application type, an un-structured string.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### ManifestId
The identifier of this application manifest, an un-structured string.
|Attribute|Value|
|---|---|
|name|ManifestId|
|use|optional|
|default||
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ManifestId" use="optional" default="" type="xs:string">
      <xs:annotation>
        <xs:documentation>The identifier of this application manifest, an un-structured string.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
    
```

## ConfigOverridesIdentifier attributeGroup
Identifies configuration overrides for a service package.

|Attribute|Value|
|---|---|
|content|2 attribute(s)|
|name|ConfigOverridesIdentifier|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConfigOverridesIdentifier">
    <xs:annotation>
      <xs:documentation>Identifies configuration overrides for a service package.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="ServicePackageName" type="xs:string" use="required"/>
    <xs:attribute name="RolloutVersion" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>ID of the rollout in which changes were made to the overrides element.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:attributeGroup>
  
```
### Attribute details

#### ServicePackageName
|Attribute|Value|
|---|---|
|name|ServicePackageName|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServicePackageName" type="xs:string" use="required"/>
    
```

#### RolloutVersion
ID of the rollout in which changes were made to the overrides element.
|Attribute|Value|
|---|---|
|name|RolloutVersion|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RolloutVersion" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>ID of the rollout in which changes were made to the overrides element.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## ConnectionString attributeGroup
|Attribute|Value|
|---|---|
|content|1 attribute(s)|
|name|ConnectionString|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConnectionString">
                <xs:attribute name="ConnectionString" type="xs:string" use="required">
                        <xs:annotation>
                                <xs:documentation>
          Connection string to the Azure storage account. Format:
          DefaultEndpointsProtocol=https;AccountName=[];AccountKey=[]
        </xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:attributeGroup>
  
```
### Attribute details

#### ConnectionString

          Connection string to the Azure storage account. Format:
          DefaultEndpointsProtocol=https;AccountName=[];AccountKey=[]
        
|Attribute|Value|
|---|---|
|name|ConnectionString|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ConnectionString" type="xs:string" use="required">
                        <xs:annotation>
                                <xs:documentation>
          Connection string to the Azure storage account. Format:
          DefaultEndpointsProtocol=https;AccountName=[];AccountKey=[]
        </xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## ContainerName attributeGroup
|Attribute|Value|
|---|---|
|content|1 attribute(s)|
|name|ContainerName|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerName">
    <xs:attribute name="ContainerName" type="xs:string">
      <xs:annotation>
        <xs:documentation>The name of the container in Azure blob storage where data is uploaded.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:attributeGroup>
  
```
### Attribute details

#### ContainerName
The name of the container in Azure blob storage where data is uploaded.
|Attribute|Value|
|---|---|
|name|ContainerName|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ContainerName" type="xs:string">
      <xs:annotation>
        <xs:documentation>The name of the container in Azure blob storage where data is uploaded.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## DataDeletionAgeInDays attributeGroup
|Attribute|Value|
|---|---|
|content|1 attribute(s)|
|name|DataDeletionAgeInDays|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DataDeletionAgeInDays">
    <xs:attribute name="DataDeletionAgeInDays" type="xs:string">
      <xs:annotation>
        <xs:documentation>Number of days after which old data is deleted from this location.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:attributeGroup>
  
```
### Attribute details

#### DataDeletionAgeInDays
Number of days after which old data is deleted from this location.
|Attribute|Value|
|---|---|
|name|DataDeletionAgeInDays|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="DataDeletionAgeInDays" type="xs:string">
      <xs:annotation>
        <xs:documentation>Number of days after which old data is deleted from this location.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## IsEnabled attributeGroup
|Attribute|Value|
|---|---|
|content|1 attribute(s)|
|name|IsEnabled|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsEnabled">
                <xs:attribute name="IsEnabled" type="xs:string">
                        <xs:annotation>
                                <xs:documentation>Whether or not data transfer to this destination is enabled. By default, it is not enabled.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
        </xs:attributeGroup>
        
```
### Attribute details

#### IsEnabled
Whether or not data transfer to this destination is enabled. By default, it is not enabled.
|Attribute|Value|
|---|---|
|name|IsEnabled|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="IsEnabled" type="xs:string">
                        <xs:annotation>
                                <xs:documentation>Whether or not data transfer to this destination is enabled. By default, it is not enabled.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
        
```

## LevelFilter attributeGroup
|Attribute|Value|
|---|---|
|content|1 attribute(s)|
|name|LevelFilter|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LevelFilter">
    <xs:attribute name="LevelFilter" type="xs:string">
      <xs:annotation>
        <xs:documentation>Level at which ETW events should be filtered. All events at the same or lower level than the specified level are included.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:attributeGroup>
  
```
### Attribute details

#### LevelFilter
Level at which ETW events should be filtered. All events at the same or lower level than the specified level are included.
|Attribute|Value|
|---|---|
|name|LevelFilter|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="LevelFilter" type="xs:string">
      <xs:annotation>
        <xs:documentation>Level at which ETW events should be filtered. All events at the same or lower level than the specified level are included.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## NameValuePair attributeGroup
Name and Value defined as an attribute.

|Attribute|Value|
|---|---|
|content|2 attribute(s)|
|name|NameValuePair|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="NameValuePair">
    <xs:annotation>
      <xs:documentation>Name and Value defined as an attribute.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="Name" use="required">
      <xs:annotation>
        <xs:documentation>The name of the setting to override.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="Value" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>The new value of the setting.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:attributeGroup>
  
```
### Attribute details

#### Name
The name of the setting to override.
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required">
      <xs:annotation>
        <xs:documentation>The name of the setting to override.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### Value
The new value of the setting.
|Attribute|Value|
|---|---|
|name|Value|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Value" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>The new value of the setting.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## Path attributeGroup
|Attribute|Value|
|---|---|
|content|1 attribute(s)|
|name|Path|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Path">
                <xs:attribute name="Path" type="xs:string" use="required">
                        <xs:annotation>
                                <xs:documentation>
          Path to the file share. Format:
          file:[]
        </xs:documentation>
                        </xs:annotation>
                </xs:attribute>
        </xs:attributeGroup>
        
```
### Attribute details

#### Path

          Path to the file share. Format:
          file:[]
        
|Attribute|Value|
|---|---|
|name|Path|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Path" type="xs:string" use="required">
                        <xs:annotation>
                                <xs:documentation>
          Path to the file share. Format:
          file:[]
        </xs:documentation>
                        </xs:annotation>
                </xs:attribute>
        
```

## RelativeFolderPath attributeGroup
|Attribute|Value|
|---|---|
|content|1 attribute(s)|
|name|RelativeFolderPath|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RelativeFolderPath">
                <xs:attribute name="RelativeFolderPath" type="xs:string" use="required">
                        <xs:annotation>
                                <xs:documentation>Path to the folder, relative to the application log directory.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
        </xs:attributeGroup>
        
```
### Attribute details

#### RelativeFolderPath
Path to the folder, relative to the application log directory.
|Attribute|Value|
|---|---|
|name|RelativeFolderPath|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RelativeFolderPath" type="xs:string" use="required">
                        <xs:annotation>
                                <xs:documentation>Path to the folder, relative to the application log directory.</xs:documentation>
                        </xs:annotation>
                </xs:attribute>
        
```

## ServiceManifestIdentifier attributeGroup
Identifies a service manifest.

|Attribute|Value|
|---|---|
|content|2 attribute(s)|
|name|ServiceManifestIdentifier|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceManifestIdentifier">
    <xs:annotation>
      <xs:documentation>Identifies a service manifest.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="ServiceManifestName" use="required">
      <xs:annotation>
        <xs:documentation>The name of the service manifest being referenced. The name must match the Name declared in the ServiceManifest element of the service manifest.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="ServiceManifestVersion" use="required">
      <xs:annotation>
        <xs:documentation>The version of the service manifest being referenced. The version must match the version declared in the service manifest.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:attributeGroup>
  
```
### Attribute details

#### ServiceManifestName
The name of the service manifest being referenced. The name must match the Name declared in the ServiceManifest element of the service manifest.
|Attribute|Value|
|---|---|
|name|ServiceManifestName|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceManifestName" use="required">
      <xs:annotation>
        <xs:documentation>The name of the service manifest being referenced. The name must match the Name declared in the ServiceManifest element of the service manifest.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### ServiceManifestVersion
The version of the service manifest being referenced. The version must match the version declared in the service manifest.
|Attribute|Value|
|---|---|
|name|ServiceManifestVersion|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="ServiceManifestVersion" use="required">
      <xs:annotation>
        <xs:documentation>The version of the service manifest being referenced. The version must match the version declared in the service manifest.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

## UploadIntervalInMinutes attributeGroup
|Attribute|Value|
|---|---|
|content|1 attribute(s)|
|name|UploadIntervalInMinutes|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UploadIntervalInMinutes">
    <xs:attribute name="UploadIntervalInMinutes" type="xs:string">
      <xs:annotation>
        <xs:documentation>Interval in minutes at which data is uploaded to this destination.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  </xs:attributeGroup>
  
```
### Attribute details

#### UploadIntervalInMinutes
Interval in minutes at which data is uploaded to this destination.
|Attribute|Value|
|---|---|
|name|UploadIntervalInMinutes|
|type|xs:string|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="UploadIntervalInMinutes" type="xs:string">
      <xs:annotation>
        <xs:documentation>Interval in minutes at which data is uploaded to this destination.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
  
```

## VersionedItemAttrGroup attributeGroup
Attribute group for versioning sections in ApplicationInstance and ServicePackage documents.

|Attribute|Value|
|---|---|
|content|1 attribute(s)|
|name|VersionedItemAttrGroup|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="VersionedItemAttrGroup">
    <xs:annotation>
      <xs:documentation>Attribute group for versioning sections in ApplicationInstance and ServicePackage documents.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="RolloutVersion" type="xs:string" use="required"/>
  </xs:attributeGroup>
  
```
### Attribute details

#### RolloutVersion
|Attribute|Value|
|---|---|
|name|RolloutVersion|
|type|xs:string|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="RolloutVersion" type="xs:string" use="required"/>
  
```

## VersionedName attributeGroup
Attribute group that includes a Name and a Version.

|Attribute|Value|
|---|---|
|content|2 attribute(s)|
|name|VersionedName|

### XML source
```xml
<xs:attributeGroup xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="VersionedName">
    <xs:annotation>
      <xs:documentation>Attribute group that includes a Name and a Version.</xs:documentation>
    </xs:annotation>
    <xs:attribute name="Name" use="required">
      <xs:annotation>
        <xs:documentation>Name of the versioned item.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute name="Version" use="required">
      <xs:annotation>
        <xs:documentation>Version of the versioned item, an unstructured string.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  </xs:attributeGroup>
  
```
### Attribute details

#### Name
Name of the versioned item.
|Attribute|Value|
|---|---|
|name|Name|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Name" use="required">
      <xs:annotation>
        <xs:documentation>Name of the versioned item.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    
```

#### Version
Version of the versioned item, an unstructured string.
|Attribute|Value|
|---|---|
|name|Version|
|use|required|
##### XML source
```xml
<xs:attribute xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/2011/01/fabric" name="Version" use="required">
      <xs:annotation>
        <xs:documentation>Version of the versioned item, an unstructured string.</xs:documentation>
      </xs:annotation>
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
  
```

