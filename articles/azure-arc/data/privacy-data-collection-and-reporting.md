---
title: Data collection and reporting | Azure Arc enabled data services
description: Explains the type of data that is transmitted by Arc enabled Data services to Microsoft. 
author: MikeRayMSFT
ms.author: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.topic: conceptual 
ms.date: 04/27/2021
ms.custom: template-concept 
---

# Azure Arc data services data collection and repriting

This article describes the data that Azure Arc enabled data services transmits to Microsoft. 

## Related products

The Azure Arc enabled data services may use some or all of the following products:

- SQL MI – Azure Arc 
- PostgreSQL Hyperscale – Azure Arc
- Azure Data Studio
- Azure CLI (az)
- Azure Data CLI (`azdata`) 

Below is a high-level view of the data types and connectivity modes used in Arc enabled data services. 


|Information category  |Indirectly connected  |Directly connected  |Never connected <br/><br/> (not supported) |
|---------|---------|---------|---------|
|Operational Data      |   Yes, export/upload. Optional.      |  Yes, fully automated. Optional.       |No  |
|Billing & Inventory      |  Yes, export/upload Required. You must send to Azure 1/month.       |   Yes, fully automated. Required.      |  No       |
|Diagnostics     |     Manually exported and provided to Microsoft Support.    |  Manually exported and provided to Microsoft Support.       |  No       |
|CEIP     |  No. Would typically be blocked by lack of direct connectivity to the CEIP data collection service endpoint on the Internet.       |   Yes, automated. <br/><br/> A firewall other network infrastructure may prevent. |   No      |

## Operational data
Operational data is collected for all database instances and for the Arc enabled data services platform itself. There are two types of operational data: 

- Metrics – Performance and capacity related metrics which are collected to an Influx DB provided as part of Arc enabled data services. You can view these metrics in the provided Grafana dashboard. 

- Logs – logs emitted by all components including failure, warning, and informational events are collected to an Elasticsearch database provided as part of Arc enabled data services. You can view the logs in the provided Kibana dashboard. 

The operational data stored locally requires built in administrative privileges to view it in Grafana/Kibana. 

The operational data does not leave yous environment unless you chooses to export/upload (indirect connected mode) or automatically send (directly connected mode) the data to Azure Monitor/Log Analytics. The data goes into a Log Analytics workspace which you control. 

If the data is sent to Azure Monitor or Log Analytics you can choose which Azure region or datacenter the Log Analytics workspace resides in. After that, access to view or copy it from other locations can be controlled by you. 

## Billing and Inventory Data 

Billing data is used for purposes of tracking usage that is billable. This is essential for running of the service and needs to be transmitted manually or automatically in all modes. 

Every database instance and the data controller itself will be reflected in Azure as an Azure resource in Azure Resource Manager. 

There are three resource types: 

- Arc enabled SQL Managed Instance 
- Arc enabled PostgreSQL Hyperscale server group 
- Arc enabled SQL Server 
- Data controller 

These are the properties, types and description that are collected and stored about each of them: 

### Arc enabled SQL Server 
- SQL Server edition. 
   `string: Edition` 
- ARM Resource id of the container resource (Azure Arc for Servers). 
   `string: ContainerResourceId` 
- Time when the resource was created. 
   `string: CreateTime` 
- The number of logical processors used by the SQL Server instance.
   `string: VCore` 
- Cloud connectivity status. 
   `string: Status` 
- SQL Server update level. 
   `string: PatchLevel` 
- SQL Server collation. 
   `string: Collation`
- SQL Server current version.
   `string: CurrentVersion`
- SQL Server instance name. 
   `string: InstanceName`
- Dynamic TCP ports used by SQL Server. 
   `string: TcpDynamicPorts`
- Static TCP ports used by SQL Server.
   `string: TcpStaticPorts` 
- SQL Server product ID.
   `string: ProductId`
- SQL Server provisioning state.
   `string: ProvisioningState`

### Data Controller 

   `public OnPremiseProperty OnPremiseProperty` 

- The raw Kubernetes information (`kubectl get datacontroller`) 
   `object: K8sRaw` 
- Last uploaded date from on-premises cluster.
   `System.DateTime: LastUploadedDate` 
- Data controller state
   `string: ProvisioningState` 

### PostgreSQL Hyperscale Server Group 

- The data controller id
   `string: DataControllerId`
- The instance admin name
   `string: Admin`
- Username and password for basic authentication
   `public: BasicLoginInformation BasicLoginInformation` 
- The raw Kubernetes information (`kubectl get postgres12`) 
   `object: K8sRaw` 
- Last uploaded date from on premise cluster. 
   `System.DateTime: LastUploadedDate` 
- Group provisioning state
   `string: ProvisioningState` 

### SQL Managed Instance 

- The managed instance ID
   `public string: DataControllerId` 
- The instance admin username 
   `string: Admin` 
- The instance start time 
   `string: StartTime`
- The instance end time 
   `string: EndTime` 
- The raw kubernetes information (`kubectl get sqlmi`) 
   `object: K8sRaw` 
- Username and password for basic authentication. 
   `public: BasicLoginInformation BasicLoginInformation`
- Last uploaded date from on premise cluster. 
   `public: System.DateTime LastUploadedDate` 
- SQL managed instance provisioning state
   `public string: ProvisioningState` 

## Examples

Example of resource inventory data JSON document that is sent to Azure to create Azure resources in your subscription. 

```json
{ 

        "customObjectName": "<resource type>-2020-29-5-23-13-17-164711", 

        "uid": "4bc3dc6b-9148-4c7a-b7dc-01afc1ef5373", 

        "instanceName": "sqlInstance001", 

        "instanceNamespace": "arc", 

        "instanceType": "<resource>", 

        "location": "eastus", 

        "resourceGroupName": "production-resources", 

        "subscriptionId": "482c901a-129a-4f5d-86e3-cc6b294590b2", 

        "isDeleted": false, 

        "externalEndpoint": "32.191.39.83:1433", 

        "vCores": "2", 

        "createTimestamp": "05/29/2020 23:13:17", 

        "updateTimestamp": "05/29/2020 23:13:17" 

    } 
```

 

Billing data captures the start time (“created”) and end time (“deleted”) of a given instance e ….as well as any start and time whenever a change in the number of cores available to a given instance (“core limit”) happens. 

```json
{ 

          "requestType": "usageUpload", 

          "clusterId": "4b0917dd-e003-480e-ae74-1a8bb5e36b5d", 

          "name": "DataControllerTestName", 

          "subscriptionId": "287c901a-129a-4f5d-86e3-cc6b294590b2", 

          "resourceGroup": "production-resources", 

          "location": "eastus", 

          "uploadRequest": { 

            "exportType": "usages", 

            "dataTimestamp": "2020-06-17T22:32:24Z", 

            "data": "[{\"name\":\"sqlInstance001\", 

                       \"namespace\":\"arc\", 

                       \"type\":\"<resource type>\", 

                       \"eventSequence\":1,  

                       \"eventId\":\"50DF90E8-FC2C-4BBF-B245-CB20DC97FF24\", 

                       \"startTime\":\"2020-06-17T19:11:47.7533333\", 

                       \"endTime\":\"2020-06-17T19:59:00\", 

                       \"quantity\":1, 

                       \"id\":\"4BC3DC6B-9148-4C7A-B7DC-01AFC1EF5373\"}]", 

           "signature":"MIIE7gYJKoZIhvcNAQ...2xXqkK" 

```

## Diagnostic data

Database instance logs, Kubernetes logs, and other diagnostic logs are exported out as needed in support situations. You may upload them to a secure location that only Microsoft Support and Microsoft engineers working on a support case has access to. Diagnostic data could also come from queries to dynamic management views (DMVs). The DMVs or queries used could contain database schema metadata details but typically not customer data. Diagnostic data does not contain any passwords, cluster IPs or individually identifiable data. These are cleaned and the logs are made anonymous for storage when possible. They are not transmitted automatically and administrator has to manually upload them. 


|Field name  |Notes  |
|---------|---------|
|Error logs      |    Log files capturing errors may contain customer or personal data (see below) are restricted and shared by user      |
|DMVs      |Dynamic management views can contain query and query plans but are restricted and shared by user          |
|Views     | Views can contain customer data but are restricted and shared only by user          |
|Crash dumps – customer data      | Max 30 day retention of crash dumps – may contain access control data <br/><br/> Statistics objects, data values within rows, query texts could be in customer crash dumps         |
|Crash dumps – personal data      |   Machine, logins/ user names, emails, location information, customer identification – require user consent to be included       |


## Customer Experience Improvement Program (CEIP) (Telemetry) 

Telemetry is used to track product usage metrics and environment information. 
See [SQL Server privacy supplement](/sql/sql-server/sql-server-privacy/). 

## Next steps
[Upload usage data to Azure Monitor](upload-usage-data.md)
