<properties
   pageTitle="Configure your private cluster | Microsoft Azure"
   description="This article describes how to configure your standalone or private Service Fabric cluster."
   services="service-fabric"
   documentationCenter=".net"
   authors="dsk-2015"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/22/2016"
   ms.author="dkshir"/>


# Configuration settings for standalone Service Fabric cluster



Create a Cluster Manifest 
See Also 
The cluster manifest is a schematized xml document that describes the nodes forming a Service Fabric cluster. The complete schema definition for the cluster manifest can be found in the WindowsFabricServiceModel.xsd, installed by the Service Fabric MSI to ..\Program Files\Windows Fabric\bin\Fabric\Fabric.Code\. For guidance in creating a cluster manifest, see Cluster Manifest Guidance. Example cluster manifests, which show common cluster configurations, are installed with the Service Fabric samples to the <samples>\ClusterManifests\ directory. The following image shows the different elements of a cluster manifest.



Windows Fabric cluster manifest

The cluster manifest specifies infrastructure metadata such as virtual machine names and types, network topology, upgrade domains, and fault domains. Fault domains enable cluster administrators to define the physical nodes that are likely to experience failure at the same time due to shared physical dependencies. Upgrade domains describe sets of nodes that are shut down for upgrades at approximately the same time. Upgrade domains are determined by administrative policies and not physical requirements. A cluster manifest also defines the different types of nodes forming a cluster. Each node type is represented as a named set of name-value properties. Some of the property names, such as Name, NodeType, SeedNode, FailureDomain, and UpgradeDomain, are well-known properties with predefined semantics that are understood by Service Fabric. Network topology is described in terms of failure/upgrade domains. 

The cluster manifest is used to provision custom resource management domains and provides cluster configuration settings, such as cluster neighborhood size, cluster security, and join timeout, which are used by the Service Fabric runtime.

The major sections of the cluster manifest are as follows:

Name
This is a mandatory field and should reflect the friendly name that you want to give to your cluster manifest. Service Fabric does not enforce any naming convention

Version
This is a mandatory string field you will use to keep track of the various versions of the cluster manifest document. During a Configuration Upgrade, Service Fabric will validate that this version field is updated. The version format is prescribed, it can be what you deem is appropriate.

  Copy Code 
Name="Windows Fabric CHProd Cluster number 7"
Version="1.0.24"
 

Description
This is a field that is not used by Service Fabric, it is here for readability reasons. It is a free format text field, so it is recommended that you use it to describe what is cluster is for, who last updated it etc.

NodeTypes
Node types allow you to separate your cluster nodes into various groups. All nodes in a group have the following common characteristics. A cluster must have at least one NodeType.

Name - This is the Node Type name


EndPoints- These are various named end points (Ports) that are associated with this Node Type. You can use any port number that you wish, as long as they do not conflict with anything else in this manifest and are not already in use by any other program on the machine/VM.


  Copy Code 
<NodeType Name="NodeType10" >
      <Endpoints>
        <ClientConnectionEndpoint Port="19090"/>
        <HttpGatewayEndpoint Port="19097" Protocol="http"/>
        <LeaseDriverEndpoint Port="19091"/>
        <ClusterConnectionEndpoint Port="19092"/>
        <ServiceConnectionEndpoint Port="19096"/>
        <ApplicationEndpoints StartPort="39001" EndPort="39999"/>
      </Endpoints>
</NodeType>
 

Certificates - These are the certificates that you plan to use to secure communications within, to, and from the cluster. Refer to the security section for details on the use of these certificates. For information on using certificates, see Cluster Security. 


  Copy Code 
<Certificates>
        <ClusterCertificate X509FindValue="b1 13 96 b0 de 8a a9 a1 13 5d 9a 5b 40" />
        <ServerCertificate X509FindValue="b1 13 96 b0 de 8a a9 a1 13 5d 9a 5b 40" />
        <ClientCertificate X509FindValue="b1 13 96 b0 de 8a a9 a1 13 5d 9a 5b 40" />
</Certificates>
 

PlacementProperties- These describe properties for this node type that you will then use as placement constraints for system services or your services. These properties are user defined key/value pairs that provide extra metadata for a given node. Examples of node properties would be whether or not the node has a hard drive or graphics card, the number of spindles in it hard drive, cores, and other physical properties.


  Copy Code 
<NodeTypes>
    <NodeType Name="NodeType01">
      <PlacementProperties>
        <Property Name="HasDisk" Value="true"/>
        <Property Name="SpindleCount" Value="4"/>
        <Property Name="HasGPU" Value="true"/>
        <Property Name="NodeColor" Value="blue"/>
      </PlacementProperties>
    </NodeType>
      <NodeType Name="NodeType02">
      <PlacementProperties>
        <Property Name="HasDisk" Value="false"/>
        <Property Name="SpindleCount" Value="-1"/>
        <Property Name="HasGPU" Value="false"/>
        <Property Name="NodeColor" Value="green"/>
      </PlacementProperties>
    </NodeType>
  </NodeTypes>
 

During runtime the Cluster Resource Manager (CRM) uses node property information in order to ensure that services which require specific capabilities are placed on the appropriate nodes. 

Service Fabric by default does not define any properties and does not “understand” any properties defined by the user. For more information on placement constraints and cluster resource management, see Describe Services.


Capacities- Node capacities are key/value pairs that define the name and amount of a particular resource that a particular node has available for consumption. For example, a node may define that it has capacity for a metric called “MemoryInMb” and that it has 2048 available by default. Capacities are defined via the cluster manifest, much like node properties:


  Copy Code 
<NodeType Name="NodeType03">
      <Capacities>
        <Capacity Name="MemoryInMB" Value="2048"/>
        <Capacity Name="DiskSpaceInGB" Value="1024"/>
      </Capacities>
    </NodeType>
 

These capacities are reported to the CRM, which uses them during runtime to ensure that services which require particular amounts of resources are placed on nodes with those resources remaining available. For more information on placement constraints and resource balancing, see Describe Services.



FabricSettings
This section allows the user to override Service Fabric configurations to tailor the Cluster behavior to suit their specific needs. The Fabric Settings (Configurations) are grouped under the various sub-sections, here are the ones that you would typically use. For the list of all configurations and their sub-sections, see Cluster Configuration Settings.

Note  
Almost all the configurations have defaults, override them only if you are sure that you need to override them or are advised to do so by the Microsoft Support team.

You do not need to add empty section name tags.
 


Security- Under this subsection you specify the certificates, Type of security Credentials, the Windows Identities to secure the cluster, Fabric Client. For more information, see Cluster Security.

You are expected to secure your cluster, but in case you do decide to disable Security on your cluster add the following to your manifest.


  Copy Code 
<Section Name="Security">
      <Parameter Name="ClusterCredentialType" Value="None" />
      <Parameter Name="ServerAuthCredentialType" Value="None" />
    </Section>
 

NamingService - Under this subsection you specify the Naming service configurations you want to override. For more information, see Windows Fabric Naming Service.


  Copy Code 
<Section Name="NamingService">
   </Section>
 

FailoverManager - Under this subsection you specify the Failover Manager Service configurations you want to override.


  Copy Code 
Section Name="FailoverManager">
   </Section>
 

ClusterManager- Under this subsection you specify the Cluster Manager Service configurations you want to override.


  Copy Code 
<Section Name="ClusterManager">
   </Section>
 

Naming/Replication– Under this subsection you specify the Replication configurations for the naming service you want to override.


  Copy Code 
<Section Name="Naming/Replication">
   </Section>
 

Failover/Replication- Under this subsection you specify the Replication configurations you want to override.


  Copy Code 
<Section Name="Failover/Replication">
   </Section>
 

ClusterManager/Replication- Under this subsection you specify the Replication configurations you want to override.


  Copy Code 
<Section Name="ClusterManager/Replication">
   </Section>
 

Hosting- Under this subsection you specify the Hosting configurations you want to override.


  Copy Code 
<Section Name="Hosting">
   </Section>
 

RunAs- Under this subsection you specify RunAs credentials for HostedServices like Fabric.exe , DCA.exe and Httpgateway.exe


  Copy Code 
<Section Name="RunAs">
    <Parameter Name="RunAsAccountType" Value="LocalSystem|NetworkService|LocalService|DomainUser|ManagedServiceAccount" />
    <Parameter Name="RunAsAccountName" Value="" /> <!--Must be specified only for DomainUser and ManagedServiceAccout AccountTypes-->
    <Parameter Name="RunAsPassword" Value="" IsEncrypted="true|false" /> <!--Must be specified only for DomainUser AccountType--> 
</Section>
 

HttpGateway- Under this subsection you enable/disable the use of REST/HTTP and its configuration. If your cluster does not need to accept REST client calls you do not need to enable HttpGateway. Before you enable this configuration, make sure that you have .NET Framework 4.5 installed on your computer/VM. There are only two configurations that you can specify. For more information on REST support, see Windows Fabric REST.


IsEnabled-: Valid Values are “true” and “false”.


ActiveListeners - This controls the number of concurrent requests that can be satisfied by the HttpGateway. The configuration takes a unsigned integter value, The default is 2.


  Copy Code 
<Section Name="HttpGateway">
     <Parameter Name="IsEnabled" Value="true"/>
    </Section>
 

Management- Under this subsection you specify the Image Store related configurations. The three possible configurations that you can specify under this sub-section are:


ImageStoreConnectionString- Specifies the location or the connection to the location that fabric will use as the image store. It needs to be highly available. Depending on the infrastructure you are running Service Fabric on, the format of the value you give are different. 

Setting Value="fabric:ImageStore" enables the Image Store service, which prevents your services from being dependent on Xstore and/or other external file stores. If you enable the Image Store service, also enable RunAs in the cluster manifest:


  Copy Code 
<Section Name="Hosting">
<Parameter Name="RunAsPolicyEnabled" Value="true" /> 
    </Section>
 

If you enable the Image Store service in a cluster running on Azure create a new Internal endpoint in the CSDEF file. You can use any name for the endpoint, but the protocol should be TCP and the port number should be 445. This is important and is required for SMB shares to work. For example: 


  Copy Code 
<InternalEndpoint name="SMB" protocol="tcp" port="445" />
 

When the Image Store service is enabled, use the RemoveApplicationPackage and RemoveClusterPackage methods or Remove-WindowsFabricApplicationPackage and Remove-WindowsFabricClusterPackage cmdlets to remove a registered application or cluster package.

If you are using Xstore, make sure that DefaultEndpointsProtocol is set to https.

Here are four different examples of ImageStoreConnectionString:


  Copy Code 
<Section Name="Management">
<Parameter Name="ImageStoreConnectionString" Value="file://[File location]" />   
</Section>

<Section Name="Management">
<Parameter Name="ImageStoreConnectionString" Value="xstore:DefaultEndpointsProtocol=https;AccountName=[Storage account Name];AccountKey=[Account Key ];Container=[Container Name]"/>/>
</Section>

<Section Name="Management">
<Parameter Name="ImageStoreConnectionString" Value="EncryptedText" IsEncrypted="true" />
</Section>

<Section Name="Management">
        <Parameter Name="ImageStoreConnectionString" Value="fabric:ImageStore"/>
</Section>
 

ImageStoreMinimumTransferBPS- Specifies the minimum transfer rate between the cluster and ImageStore. This value is used to determine the timeout when accessing the external ImageStore. Change this value only if the latency between the cluster and ImageStore is high, this will allow more time for the cluster to download from the external ImageStore. The default value is 1024.


ImageCachingEnabled- This configuration allows the user to enable or disable caching. As a default caching is enabled. Valid values are “TRUE” or “FALSE”


HealthManager/ClusterHealthPolicy – Service Fabric, by default, assumes that a cluster will only be considered healthy if 100% of the nodes and applications are healthy. In a large cluster, this will probably not be true and the overall health reports will reflect failures. This behavior will be more pronounced during non-manual upgrades (fabric and/or application upgrade). System services like Infrastructure Service and Repair Manager progress can also be blocked since they depend on the cluster being healthy (as defined by configured policy, the default being 100%). The ClusterHealthPolicy setting allows you to specify the percentage of nodes and applications that can be unhealthy while allowing the cluster as a whole to still be considered health.

The following example specifies that the cluster is to be considered healthy if 90% of the cluster nodes are up and 100% of the applications are healthy. Also, in order to reduce the noise, warnings are not to be considered errors.


  Copy Code 
<Section Name="HealthManager/ClusterHealthPolicy">
 <Parameter Name="ConsiderWarningAsError" Value="False" />
 <Parameter Name="MaxPercentUnhealthyNodes" Value="10" />
  <Parameter Name="MaxPercentUnhealthyApplications" Value="0" />
</Section>
 

Setup – The Service Fabric data root and log root directory locations can be customized during the initial cluster creation. The DataRoot setting allows you to specify a new data root directory at cluster setup. The LogRoot setting allows you to specify a new log root director at cluster setup. You cannot modify these settings after the cluster has been created. 

If you decide to customize DataRoot and/or LogRoot, take note of the following behavior. If you customize DataRoot, only, then Service Fabric will move the LogRoot directory to be under \DataRoot\Log. If that is not the behavior you want then you must customize both the DataRoot and the LogRoot. Customizing LogRoot does not affect the DataRoot.

The default data root and data log directory locations on Windows Server and Azure are:


Setting  Windows Server Default  Azure Default  
DataRoot
 ..\ProgramData\Windows Fabric
 C:\WFroot
 
LogRoot
 ..\ProgramData\Windows Fabric\Log
 C:\WFRoot\log
 
The following is an example of the Setup section in the cluster manifest:


  Copy Code 
<Section Name="Setup">
   <Parameter Name=" FabricDataRoot" Value="drive:\your new location" />
   <Parameter Name=" FabricLogRoot" Value=" drive:\your new location />
</Section>
 

Infrastructure
This section allows the user to indicate the infrastructure on which the cluster will be setup. Service Fabric support two infrastructures: Windows Server and Azure. For the supported OS, Azure SDK and .NET Framework versions, please see Windows Fabric Prerequisites.

WindowServer
For setting up a Windows Server cluster, the user needs to specify the following in addition to the configurations that were reviewed earlier in this document.

IsScaleMin- This is a configuration that the user uses to indicate if this windows server cluster is going to be used for “single-box developer” scenarios or not. In production, Service Fabric does not support Scale-minimized Deployments. The valid values for this configuration is “true” or “false”


  Copy Code 
<Infrastructure>
    <WindowsServer IsScaleMin="true">
    </WindowsServer>
  </Infrastructure>
 

NodeList- The node details for each of the Nodes (Node type, Node name, seednode, IP address, Fault Domain and upgrade domain of the Node). For definitions of these terms, see Windows Fabric Terminology.


  Copy Code 
<Infrastructure>
    <WindowsServer IsScaleMin="true">
      <NodeList>
        <!-- To move from ScaleMin to regular deployment each IPAddressOrFQDN needs to be unique and IsScaleMin turned to false. -->

        <Node NodeTypeRef="NodeType01" IsSeedNode="true" IPAddressOrFQDN="winfabCHProd1.contoso.com" NodeName="Node01" FaultDomain="fd:/Rack101" UpgradeDomain="WinfabCHProdUD1" />
        <Node NodeTypeRef="NodeType01" IsSeedNode="true" IPAddressOrFQDN="winfabCHProd2.contoso.com" NodeName="Node02" FaultDomain="fd:/Rack102" UpgradeDomain="WinfabCHProdUD2" />
        <Node NodeTypeRef="NodeType01" IsSeedNode="true" IPAddressOrFQDN="winfabCHProd3.contoso.com" NodeName="Node03" FaultDomain="fd:/Rack103" UpgradeDomain="WinfabCHProdUD3" />
        <Node NodeTypeRef="NodeType02" IPAddressOrFQDN="winfabCHProd4.contoso.com" NodeName="Node04" FaultDomain="fd:/Rack101" UpgradeDomain="WinfabCHProdUD1" />
        <Node NodeTypeRef="NodeType02" IPAddressOrFQDN="winfabCHProd5.contoso.com" NodeName="Node05" FaultDomain="fd:/Rack102" UpgradeDomain="WinfabCHProdUD2" />      </NodeList>
    </WindowsServer>
  </Infrastructure>
 

WindowsAzure
Setting up a Azure cluster, the user needs to specify the following in addition to the configurations that were reviewed earlier in this document. There are also settings that need to be specified in the .csdef and .cscfg as files well. For more information, see How to Set Up a Cluster on Azure. We will focus on what needs to be added to the cluster manifest in this document.

Roles- under this section the user needs to list all the Roles that make up this cluster. Each of these Roles needs to be tied to a specific NodeType that we defined earlier in this document.


SeedNodeCount- unlike in windows server, the user does not get to pick which instances of the roles become the seednode. All the user can specify is the number of seed nodes that the cluster needs to have. Only one Role can have the seed nodes specified.


The Fault Domain and Upgrade Domain information comes from Azure, so the user does not specify it in the cluster manifest. 


The number of Role instances for each of the roles is specified in the .cscfg file.


  Copy Code 
Infrastructure>
    <WindowsAzure>
      <Roles>
       <Role RoleName="WinFabricRole1" NodeTypeRef="NodeType01" SeedNodeCount="3"/>
<Role RoleName="WinFabricRole2" NodeTypeRef="NodeType02"/>
      </Roles>
    </WindowsAzure>
  </Infrastructure>
 

Secrets Certificate
Service Fabric enables cluster administrators to specify PII or sensitive information (like Image Store Connection string etc) in an encrypted form in the cluster manifest. Specify the certificate to be used for the encryption/decryption as follows. For more information, see Encrypt Sensitive Information in the Cluster Manifest.

  Copy Code 
<Certificates>
    <SecretsCertificate X509FindValue="95 4b 57 24 49 54 94 50 2b 82 a9 c7 e1 df 29" />
  </Certificates>
 

See Also
Concepts
Example Windows Fabric Cluster Manifests


--------------------------------------------------------------------------------

