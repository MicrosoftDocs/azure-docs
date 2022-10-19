---
title: Data collection and reporting | Azure Arc-enabled data services
description: Explains the type of data that is transmitted by Azure Arc-enabled Data services to Microsoft. 
author: dnethi
ms.author: dinethi
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.topic: conceptual 
ms.date: 07/30/2021
ms.custom: template-concept 
---

# Azure Arc data services data collection and reporting

This article describes the data that Azure Arc-enabled data services transmits to Microsoft. 


## Related products

Azure Arc-enabled data services may use some or all of the following products:

- SQL MI – Azure Arc 
- Azure Arc-enabled PostgreSQL
- Azure Data Studio

   [!INCLUDE [use-insider-azure-data-studio](includes/use-insider-azure-data-studio.md)]

- Azure CLI (az)
- Azure Data CLI (`azdata`) 

## Directly connected

When a cluster is configured to be directly connected to Azure, some data is automatically transmitted to Microsoft. 

The following table describes the type of data, how it is sent, and requirement.  

|Data category|What data is sent?|How is it sent?|Is it required?
|:----|:----|:----|:----|
|Operational Data|Metrics and logs|Automatic, when configured to do so|No
Billing & inventory data|Inventory such as number of instances, and usage such as number of vCores consumed|Automatic |Yes
Diagnostics|Diagnostic information for troubleshooting purposes|Manually exported and provided to Microsoft Support|Only for the scope of troubleshooting and follows the standard [privacy policies](https://privacy.microsoft.com/privacystatement)
Customer Experience Improvement Program (CEIP)|[CEIP summary](/sql/sql-server/usage-and-diagnostic-data-configuration-for-sql-server)|Automatic, if allowed|No

## Indirectly connected

When a cluster not configured to be directly connected to Azure, it does not automatically transmit operational, or billing and inventory data to Microsoft. To transmit data to Microsoft, you need to configure the export. 

The following table describes the type of data, how it is sent, and requirement.  

|Data category|What data is sent?|How is it sent?|Is it required?
|:----|:----|:----|:----|
|Operational Data|Metrics and logs|Manual|No
Billing & inventory data|Inventory such as number of instances, and usage such as number of vCores consumed|Manual |Yes
Diagnostics|Diagnostic information for troubleshooting purposes|Manually exported and provided to Microsoft Support|Only for the scope of troubleshooting and follows the standard [privacy policies](https://privacy.microsoft.com/privacystatement)
Customer Experience Improvement Program (CEIP)|[CEIP summary](/sql/sql-server/usage-and-diagnostic-data-configuration-for-sql-server)|Automatic, if allowed|No

## Detailed description of data

This section provides more details about the information included with the Azure Arc-enabled data services transmits to Microsoft.

### Operational data

Operational data is collected for all database instances and for the Azure Arc-enabled data services platform itself. There are two types of operational data: 

- Metrics – Performance and capacity related metrics, which are collected to an Influx DB provided as part of Azure Arc-enabled data services. You can view these metrics in the provided Grafana dashboard. 

- Logs – Records emitted by all components including failure, warning, and informational events are collected to an Elasticsearch database provided as part of Azure Arc-enabled data services. You can view the logs in the provided Kibana dashboard. 

The operational data stored locally requires built-in administrative privileges to view it in Grafana/Kibana. 

The operational data does not leave your environment unless you chooses to export/upload (indirect connected mode) or automatically send (directly connected mode) the data to Azure Monitor/Log Analytics. The data goes into a Log Analytics workspace, which you control. 

If the data is sent to Azure Monitor or Log Analytics, you can choose which Azure region or datacenter the Log Analytics workspace resides in. After that, access to view or copy it from other locations can be controlled by you. 

### Billing and inventory data 

Billing data is used for purposes of tracking usage that is billable. This data is essential for running of the service and needs to be transmitted manually or automatically in all modes. 

Every database instance and the data controller itself will be reflected in Azure as an Azure resource in Azure Resource Manager. 

There are three resource types: 

- Azure Arc-enabled SQL Managed Instance 
- Azure Arc-enabled PostgreSQL server 
- Azure Arc-enabled SQL Server 
- Data controller 

The following sections show the properties, types, and descriptions that are collected and stored about each type of resource: 

### Azure Arc-enabled SQL Server
- SQL Server edition. 
   - `string: Edition` 
- Resource ID of the container resource (Azure Arc for Servers). 
   - `string: ContainerResourceId` 
- Time when the resource was created. 
   - `string: CreateTime` 
- The number of logical processors used by the SQL Server instance.
   - `string: VCore` 
- Cloud connectivity status. 
   - `string: Status` 
- SQL Server update level. 
   - `string: PatchLevel` 
- SQL Server collation. 
   - `string: Collation`
- SQL Server current version.
   - `string: CurrentVersion`
- SQL Server instance name. 
   - `string: InstanceName`
- Dynamic TCP ports used by SQL Server. 
   - `string: TcpDynamicPorts`
- Static TCP ports used by SQL Server.
   - `string: TcpStaticPorts` 
- SQL Server product ID.
   - `string: ProductId`
- SQL Server provisioning state.
   - `string: ProvisioningState`

### Data controller 

- Location information
   - `public OnPremiseProperty OnPremiseProperty` 
- The raw Kubernetes information (`kubectl get datacontroller`) 
   - `object: K8sRaw` 
- Last uploaded date from on-premises cluster.
   - `System.DateTime: LastUploadedDate` 
- Data controller state
   - `string: ProvisioningState` 

### Azure Arc-enabled PostgreSQL

- The data controller ID
   - `string: DataControllerId`
- The instance admin name
   - `string: Admin`
- Username and password for basic authentication
   - `public: BasicLoginInformation BasicLoginInformation` 
- The raw Kubernetes information (`kubectl get postgres12`) 
   - `object: K8sRaw` 
- Last uploaded date from on premises cluster. 
   - `System.DateTime: LastUploadedDate` 
- Group provisioning state
   - `string: ProvisioningState` 

### SQL Managed Instance 

- The managed instance ID
   - `public string: DataControllerId` 
- The instance admin username 
   - `string: Admin` 
- The instance start time 
   - `string: StartTime`
- The instance end time 
   - `string: EndTime` 
- The raw kubernetes information (`kubectl get sqlmi`) 
   - `object: K8sRaw` 
- Username and password for basic authentication. 
   - `public: BasicLoginInformation BasicLoginInformation`
- Last uploaded date from on-premises cluster. 
   - `public: System.DateTime LastUploadedDate` 
- SQL managed instance provisioning state
   - `public string: ProvisioningState` 

### Examples

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

        "subscriptionId": "<subscription_id>", 

        "isDeleted": false, 

        "externalEndpoint": "32.191.39.83:1433", 

        "vCores": "2", 

        "createTimestamp": "05/29/2020 23:13:17", 

        "updateTimestamp": "05/29/2020 23:13:17" 

    } 
```

 

Billing data captures the start time (“created”) and end time (“deleted”) of a given instance.as well as any start and time whenever a change in the number of cores available to a given instance (“core limit”) happens. 

```json
{ 

          "requestType": "usageUpload", 

          "clusterId": "4b0917dd-e003-480e-ae74-1a8bb5e36b5d", 

          "name": "DataControllerTestName", 

          "subscriptionId": "<subscription_id>", 

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

                       \"id\":\"<subscription_id>\"}]", 

           "signature":"MIIE7gYJKoZIhvcNAQ...2xXqkK" 

```

### Diagnostic data

In support situations, you may be asked to provide database instance logs, Kubernetes logs, and other diagnostic logs. The support team will provide a secure location for you to upload to. Dynamic management views (DMVs) may also provide diagnostic data. The DMVs or queries used could contain database schema metadata details but typically not customer data. Diagnostic data does not contain any passwords, cluster IPs or individually identifiable data. These are cleaned and the logs are made anonymous for storage when possible. They are not transmitted automatically and administrator has to manually upload them. 

|Field name  |Notes  |
|---------|---------|
|Error logs |Log files capturing errors may contain customer or personal data (see below) are restricted and shared by user |
|DMVs      |Dynamic management views can contain query and query plans but are restricted and shared by user     |
|Views    |Views can contain customer data but are restricted and shared only by user     |
|Crash dumps – customer data | Maximum 30-day retention of crash dumps – may contain access control data <br/><br/> Statistics objects, data values within rows, query texts could be in customer crash dumps    |
|Crash dumps – personal data | Machine, logins/ user names, emails, location information, customer identification – require user consent to be included  |

## Next steps
[Upload usage data to Azure Monitor](upload-usage-data.md)
