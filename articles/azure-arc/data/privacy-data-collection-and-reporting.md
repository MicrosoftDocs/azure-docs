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

# Azure Arc-enabled data services data collection and reporting

This article describes the data that Azure Arc-enabled data services transmit to Microsoft. 

Neither Azure Arc-enabled data services nor any of the applicable data services store any customer data. This applies to:

- Azure Arc-enabled SQL Managed Instance
- Azure Arc-enabled PostgreSQL

## Azure Arc-enabled data services

Azure Arc-enabled data services may use some or all of the following products:

- Azure Arc-enabled SQL Managed Instance 
- Azure Arc-enabled PostgreSQL
- Azure Data Studio

   [!INCLUDE [use-insider-azure-data-studio](includes/use-insider-azure-data-studio.md)]

- Azure CLI (az)

### Directly connected

When a cluster is configured to be directly connected to Azure, some data is automatically transmitted to Microsoft. 

The following table describes the type of data, how it is sent, and requirement.  

|Data category|What data is sent?|How is it sent?|Is it required?
|:----|:----|:----|:----|
|Operational Data|Metrics and logs|Automatically, when configured to do so|No
Billing & inventory data|Inventory such as number of instances, and usage such as number of vCores consumed|Automatically |Yes
Diagnostics|Diagnostic information for troubleshooting purposes|Manually exported and provided to Microsoft Support|Only for the scope of troubleshooting and follows the standard [privacy policies](https://privacy.microsoft.com/privacystatement)

### Indirectly connected

When a cluster not configured to be directly connected to Azure, it does not automatically transmit operational, or billing and inventory data to Microsoft. To transmit data to Microsoft, you need to configure the export. 

The following table describes the type of data, how it is sent, and requirement.  

|Data category|What data is sent?|How is it sent?|Is it required?
|:----|:----|:----|:----|
|Operational Data|Metrics and logs|Manually|No
Billing & inventory data|Inventory such as number of instances, and usage such as number of vCores consumed|Manually |Yes
Diagnostics|Diagnostic information for troubleshooting purposes|Manually exported and provided to Microsoft Support|Only for the scope of troubleshooting and follows the standard [privacy policies](https://privacy.microsoft.com/privacystatement)


## Operational data

Operational data is collected for all database instances and for the Azure Arc-enabled data services platform itself. There are two types of operational data: 

- Metrics – Performance and capacity related metrics, which are collected to an Influx DB provided as part of Azure Arc-enabled data services. You can view these metrics in the provided Grafana dashboard. 

- Logs – Records emitted by all components including failure, warning, and informational events are collected to an Elasticsearch database provided as part of Azure Arc-enabled data services. You can view the logs in the provided Kibana dashboard. 

The operational data stored locally requires built-in administrative privileges to view it in Grafana/Kibana. 

The operational data does not leave your environment unless you chooses to export/upload (indirect connected mode) or automatically send (directly connected mode) the data to Azure Monitor/Log Analytics. The data goes into a Log Analytics workspace, which you control. 

If the data is sent to Azure Monitor or Log Analytics, you can choose which Azure region or datacenter the Log Analytics workspace resides in. After that, access to view or copy it from other locations can be controlled by you. 

## Inventory data 

The collected inventory data is represented by several Azure resource types.  The following sections show the properties, types, and descriptions that are collected for each resource type: 

Every database instance and the data controller itself will be reflected in Azure as an Azure resource in Azure Resource Manager. 

There are three resource types: 

- Azure Arc-enabled SQL Managed Instance 
- Azure Arc-enabled PostgreSQL server 
- Data controller

The following sections show the properties, types, and descriptions that are collected and stored about each type of resource: 

### SQL Server - Azure Arc

| Description | Property name | Property type|
|:--|:--|:--|
| Computer name | name | string |
| SQL Server instance name| instanceName | string  |
| SQL Server Version | version | string  |
| SQL Server Edition | edition | string  |
| Containing server resource ID | containerResourceId |  string  |
| Virtual cores | vCore | string  |
| Connectivity status | status | string  |
| SQL Server patch level | patchLevel | string  |
| Collation | collation | string |
| Current version | currentVersion | string |
| TCP dynamic ports | tcpDynamicPorts | string |
| TCP static ports | tcpStaticPorts | string  |
| Product ID | productId | string |
| License type | licenseType | string  |
| Microsoft Defender status | azureDefenderStatus | string  |
| Microsoft Defender status last updated | azureDefenderStatusLastUpdated | string |
| Provisioning state | provisioningState | string |

The following JSON document is an example of the SQL Server - Azure Arc resource. 

```json
{
  
    "name": "SQL22-EE_PAYGTEST",
    "version": "SQL Server 2022",
    "edition": "Enterprise",
    "containerResourceId": "/subscriptions/a5082b19-8a6e-4bc5-8fdd-8ef39dfebc39/resourcegroups/sashan-arc-eastasia/providers/Microsoft.HybridCompute/machines/SQL22-EE",
    "vCore": "8",
    "status": "Connected",
    "patchLevel": "16.0.1000.6",
    "collation": "SQL_Latin1_General_CP1_CI_AS",
    "currentVersion": "16.0.1000.6",
    "instanceName": "PAYGTEST",
    "tcpDynamicPorts": "61394",
    "tcpStaticPorts": "",
    "productId": "00488-00010-05000-AB944",
    "licenseType": "PAYG",
    "azureDefenderStatusLastUpdated": "2023-02-08T07:57:37.5597421Z",
    "azureDefenderStatus": "Protected",
    "provisioningState": "Succeeded"
}
```

### SQL Server database - Azure Arc

| Description | Property name | Property type|
|:--|:--|:--|
| Database name | name | string |
| Collation | collationName | string |
| Database creation date | databaseCreationDate | System.DateTime |
| Compatibility level | compatibilityLevel | string |
| Database state | state | string |
| Readonly mode | isReadOnly | boolean |
| Recovery mode | recoveryMode | boolean |
| Auto close enabled | isAutoCloseOn | boolean |
| Auto shrink enabled | isAutoShrinkOn | boolean |
| Auto create stats enabled | isAutoCreateStatsOn | boolean |
| Auto update stats enabled | isAutoUpdateStatsOn | boolean |
| Remote data archive enabled | isRemoteDataArchiveEnabled | boolean |
! Memory optimization enabled | isMemoryOptimizationEnabled | boolean |
| Encryption enabled | isEncrypted | boolean |
| Trustworthy mode enabled | isTrustworthyOn | boolean |
| Backup information | backupInformation | |
| Provisioning state | provisioningState | string |

The following JSON document is an example of the SQL Server database - Azure Arc resource. 

```json
{
    "name": "newDb80",
    "collationName": "SQL_Latin1_General_CP1_CI_AS",
    "databaseCreationDate": "2023-01-09T03:40:45Z",
    "compatibilityLevel": 150,
    "state": "Online",
    "isReadOnly": false,
    "recoveryMode": "Full",
    "databaseOptions": {
        "isAutoCloseOn": false,
        "isAutoShrinkOn": false,
        "isAutoCreateStatsOn": true,
        "isAutoUpdateStatsOn": true,
        "isRemoteDataArchiveEnabled": false,
        "isMemoryOptimizationEnabled": true,
        "isEncrypted": false,
        "isTrustworthyOn": false
    },
    "backupInformation": {},
    "provisioningState": "Succeeded"
}
```

### Azure Arc data controller

| Description | Property name | Property type|
|:--|:--|:--|
| Location information | OnPremiseProperty | public: OnPremiseProperty |
| The raw Kubernetes information (`kubectl get datacontroller`) | K8sRaw | object | 
| Last uploaded date from on-premises cluster | LastUploadedDate | System.DateTime | 
| Data controller state | ProvisioningState | string | 

#### Data controller 

- Location information
   - `public OnPremiseProperty OnPremiseProperty` 
- The raw Kubernetes information (`kubectl get datacontroller`) 
   - `object: K8sRaw` [Details](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/crds)
- Last uploaded date from on-premises cluster.
   - `System.DateTime: LastUploadedDate` 
- Data controller state
   - `string: ProvisioningState` 



### PostgreSQL server - Azure Arc

| Description | Property name | Property type|
|:--|:--|:--|
| The data controller ID | DataControllerId | string |
| The instance admin name | Admin | string |
| Username and password for basic authentication | BasicLoginInformation | public: BasicLoginInformation | 
| The raw Kubernetes information (`kubectl get postgres12`) | K8sRaw | object |
| Last uploaded date from on premises cluster | LastUploadedDate | System.DateTime |
| Group provisioning state | ProvisioningState | string |

#### Azure Arc-enabled PostgreSQL

- The data controller ID
   - `string: DataControllerId`
- The instance admin name
   - `string: Admin`
- Username and password for basic authentication
   - `public: BasicLoginInformation BasicLoginInformation` 
- The raw Kubernetes information (`kubectl get postgres12`) 
   - `object: K8sRaw` [Details](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/crds)
- Last uploaded date from on premises cluster. 
   - `System.DateTime: LastUploadedDate` 
- Group provisioning state
   - `string: ProvisioningState` 

### SQL managed instance - Azure Arc

| Description | Property name | Property type|
|:--|:--|:--|
| The managed instance ID | DataControllerId | string |
| The instance admin username | Admin | string |
| The instance start time | StartTime | string |
| The instance end time | EndTime | string |
| The raw kubernetes information (`kubectl get sqlmi`) | K8sRaw | object |
| Username and password for basic authentication | BasicLoginInformation | BasicLoginInformation |
| Last uploaded date from on-premises cluster | LastUploadedDate | System.DateTime |
| SQL managed instance provisioning state | ProvisioningState | string |

The following JSON document is an example of the SQL managed instance - Azure Arc resource. 

#### SQL managed instance 

- The managed instance ID
   - `public string: DataControllerId` 
- The instance admin username 
   - `string: Admin` 
- The instance start time 
   - `string: StartTime`
- The instance end time 
   - `string: EndTime` 
- The raw kubernetes information (`kubectl get sqlmi`) 
   - `object: K8sRaw` [Details](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/crds)
- Username and password for basic authentication. 
   - `public: BasicLoginInformation BasicLoginInformation`
- Last uploaded date from on-premises cluster. 
   - `public: System.DateTime LastUploadedDate` 
- SQL managed instance provisioning state
   - `public string: ProvisioningState` 

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
        "subscriptionId": "<subscription_id>", 
        "isDeleted": false, 
        "externalEndpoint": "32.191.39.83:1433", 
        "vCores": "2", 
        "createTimestamp": "05/29/2020 23:13:17", 
        "updateTimestamp": "05/29/2020 23:13:17" 
    } 
```

## Billing data

Billing data is used for purposes of tracking usage that is billable. This data is essential for running of the service and needs to be transmitted manually or automatically in all modes. 

### Arc-enabled data services

Billing data captures the start time (“created”) and end time (“deleted”) of a given instance, as well as any start and time whenever a change in the number of cores available to a given instance (“core limit”) happens. 

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
    "data": 
        "[{\"name\":\"sqlInstance001\", 
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

### Arc-enabled SQL Server

Billing data captures a snapshot of the SQL Server instance properties as well as the machine properties every hour and compose the usage upload payload to report usage. There is a snapshot time in the payload for each SQL Server  instance. 

```json
{
    "hostType": "Unknown",
    "osType": "Windows",
    "manufacturer": "Microsoft",
    "model": "Hyper-V",
    "isVirtualMachine": true,
    "serverName": "TestArcServer",
    "serverId": "<server id>",
    "location": "eastus",
    "timestamp": "2021-07-08T01:42:15.0388467Z",
    "uploadRequest": {
        "exportType": "usages",
        "dataTimestamp": "2020-06-17T22:32:24Z",
        "data": 
            "[{\"hostType\":\"VirtualMachine\",
            \"numberOfCores\":4,
            \"numberOfProcessors\":1,
            \"numberOfLogicalProcessors\":4,
            \"subscriptionId\":\"<subscription id>\",\"resourceGroup\":\"ArceeBillingPipelineStorage_Test\",
            \"location\":\"eastus2euap\",
            \"version\":\"Sql2019\",
            \"edition\":\"Enterprise\",
            \"editionOriginalString\":\"Enterprise Edition: Core based licensing\",
            \"coreInfoOriginalString\":\"using 16 logical processors based on SQL Server licensing\",
            \"vCore\":4,
            \"instanceName\":\"INSTANCE01\",
            \"licenseType\":\"LicenseOnly\",
            \"hostLicenseType\":\"Paid\",
            \"instanceLicenseType\":\"Paid\",
            \"serverName\":\"TestArcServer\",
            \"isRunning\":false,
            \"eventId\":\"00000000-0000-0000-0000-000000000000\",
            \"snapshotTime\":\"2020-06-17T19:59:00\",
            \"isAzureBilled\":\"Enabled\",
            \"hasSoftwareAssurance\":\"Undefined\"}]"
    }
}
```

## Diagnostic data

In support situations, you may be asked to provide database instance logs, Kubernetes logs, and other diagnostic logs. The support team will provide a secure location for you to upload to. Dynamic management views (DMVs) may also provide diagnostic data. The DMVs or queries used could contain database schema metadata details but typically not customer data. Diagnostic data does not contain any passwords, cluster IPs or individually identifiable data. These are cleaned and the logs are made anonymous for storage when possible. They are not transmitted automatically and administrator has to manually upload them. 

|Field name  |Notes  |
|:--|:--|
|Error logs |Log files capturing errors may contain customer or personal data (see below) are restricted and shared by user |
|DMVs      |Dynamic management views can contain query and query plans but are restricted and shared by user     |
|Views    |Views can contain customer data but are restricted and shared only by user     |
|Crash dumps – customer data | Maximum 30-day retention of crash dumps – may contain access control data <br/><br/> Statistics objects, data values within rows, query texts could be in customer crash dumps    |
|Crash dumps – personal data | Machine, logins/ user names, emails, location information, customer identification – require user consent to be included  |

## Next steps
[Upload usage data to Azure Monitor](upload-usage-data.md)

