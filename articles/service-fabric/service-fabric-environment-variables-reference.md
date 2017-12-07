---
title: Service Fabric environment variables | Microsoft Docs
description: Reference documentation for Service Fabric environment variables
documentationcenter: .net
author: mikkelhegn
manager: msfussell
editor: ''

ms.service: service-fabric

ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA

ms.workload: NA
ms.date: 12/07/2017
ms.author: mikkelhegn

---
# Service Fabric environment variables

Service Fabric has built in environment variables set for each service instance. The full list of environment variables is below:

| Environment Variable                         | Description                                                            | Example                                                              |
|----------------------------------------------|------------------------------------------------------------------------|----------------------------------------------------------------------|
| Fabric_ApplicationHostId                     | ?                                                                      | A GUID                                                               |
| Fabric_ApplicationHostType                   | ?                                                                      | Activated_SingleCodePackage                                          |
| Fabric_ApplicationId                         | ?                                                                      | Application2Type_App12                                               |
| Fabric_ApplicationName                       | The fabric uri name of the application                                 | fabric:/MyApplication                                                |
| Fabric_CodePackageInstanceId                 | Not found?                                                             |                                                                      |
| Fabric_CodePackageInstanceSeqNum             | ?                                                                      | 131571403363559284                                                   |
| Fabric_CodePackageName                       | The name of the code package to which the process belongs              | Code                                                                 |
| Fabric\_Endpoint\_*ServiceName*_TypeEndpoint | Not found?                                                             |                                                                      |
| Fabric_Endpoint_IPOrFQDN_ServiceEndpoint     | ?                                                                      | localhost                                                            |
| Fabric_Endpoint_ServiceEndpoint              | Port number for the services endpoint - what if there are more?        | 8234                                                                 |
| Fabric_Folder_App_Log                        | Log folder                                                             | C:\\\\Data\\\\_App\\\\_Node_0\\\\MyApplicationType_App12\\\\log  |
| Fabric_Folder_App_Temp                       | Temp folder                                                            | C:\\\\Data\\\\_App\\\\_Node_0\\\\MyApplicationType_App12\\\\temp |
| Fabric_Folder_App_Work                       | Work folder                                                            | C:\\\\Data\\\\_App\\\\_Node_0\\\\MyApplicationType_App12\\\\work |
| Fabric_Folder_Application                    | The applications home folder                                           | C:\\\\Data\\\\_App\\\\_Node_0\\\\MyApplicationType_App12       |
| Fabric_IsContainerHost                       | A bool specifying whether the process is a container                   | false                                                                |
| Fabric_NodeId                                | The node ID of the node running the process                            | bf865279ba277deb864a976fbf4c200e                                     |
| Fabric_NodeIPOrFQDN                          | The IP or FQDN of the node, as specified in the cluster manifest file. | localhost or 10.0.0.1                                                |
| Fabric_NodeName                              | The node name of the node running the process                          | _Node_0                                                              |
| Fabric_RuntimeConnectionAddress              | Need information                                                       | localhost:19006                                                      |
| Fabric_ServicePackageActivationGuid          | ?                                                                      | A GUID                                                               |
| Fabric_ServicePackageActivationId            | ?                                                                      | A GUID                                                               |
| Fabric_ServicePackageInstanceId              | Not found?                                                             |                                                                      |
| Fabric_ServicePackageInstanceSeqNum          | ?                                                                      | 131571423805435957                                                   |
| Fabric_ServicePackageName                    | Name of the service package the process is part of                     | Web1Pkg                                                              |
| Fabric_ServicePackageVersionInstance         | ?                                                                      | 1.0:1.0:131571423553685016                                           |
| FabricActivatorAddress                       | ?                                                                      | localhost:53703                                                      |
| FabricPackageFileName                        | ?                                                                      | C:\\\\Data\\\\_Node_0\\\\Fabric\\\\Fabric.Package.current.xml  |
| HostedServiceName                            | Is this Fabric?                                                        | HostedService/_Node_0_Fabric                                         |