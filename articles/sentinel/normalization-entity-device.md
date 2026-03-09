---
title: The Advanced Security Information Model (ASIM) Device Entity reference | Microsoft Docs
description: This article displays the Microsoft Sentinel Device Entity schema.
author: oshezaf
ms.topic: reference
ms.date: 07/18/2025
ms.author: ofshezaf



#Customer intent: As a security analyst, I want to understand the ASIM Device Entity so that I can accurately understand device information captured in normalized events, enabling consistent and comprehensive monitoring across security platforms and improving threat detection and response efforts.

---

# The Advanced Security Information Model (ASIM) Device Entity

Devices, or hosts, are the common terms used for the systems that take part in the event. The `Dvc` prefix is used to designate the primary device on which the event occurs. Some events, such as network sessions, have source and destination devices, designated by the prefix `Src` and `Dst`. In such a case, the `Dvc` prefix is used for the device reporting the event, which might be the source, destination, or a monitoring device.

## The device aliases

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| <a name="dvc"></a>**Dvc**, <a name="src"></a>**Src**, <a name="dst"></a>**Dst** | Mandatory  | String  | The `Dvc`, 'Src', or 'Dst' fields are used as a unique identifier of the device. It is set to the best available identified for the device. These fields can alias the [FQDN](#fqdn), [DvcId](#dvcid), [Hostname](#hostname), or [IpAddr](#ipaddr) fields. For cloud sources, for which there is no apparent device, use the same value as the [Event Product](normalization-common-fields.md#eventproduct) field.            |


## The device name

Reported device names may include a hostname only, or a fully qualified domain name (FQDN), which includes a hostname and a domain name. The FQDN might be expressed using several formats. The following fields enable supporting the different variants in which the device name might be provided.

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| <a name ="hostname"></a>**Hostname**  | Recommended | Hostname | The short hostname of the device.  |
| <a name="domain"></a>**Domain** | Recommended | String | The domain of the device on which the event occurred, without the hostname. |
| <a name="domaintype"></a>**DomainType** | Recommended | Enumerated | The type of [Domain](#domain). Supported values include `FQDN` and `Windows`. This field is required if the [Domain](#domain) field is used. |
| <a name="fqdn"></a>**FQDN** | Optional | String | The FQDN of the device including both [Hostname](#hostname) and [Domain](#domain) . This field supports both traditional FQDN format and Windows domain\hostname format. The  [DomainType](#domaintype) field reflects the format used. |

For example:

| Field | Value for input `appserver.contoso.com` | value for input `appserver` |
| ----- | --------------------------------------- | --------------------------- | 
| **Hostname** | `appserver` | `appserver` |
| **Domain** | `contoso.con` | \<empty\> |
| **DomainType** | `FQDN` | \<empty\> |
| **FQDN** | `appserver.contoso.com` | \<empty\> | 


When the value provided by the source is an FQDN the parser should calculate the four values. This is true also when the value may be either and FQDN or a short hostname. Use the ASIM helper functions `_ASIM_ResolveFQDN`, `_ASIM_ResolveSrcFQDN`, `_ASIM_ResolveDstFQDN`, and `_ASIM_ResolveDvcFQDN` to easily set all four fields based on a single input value. For more information, see [ASIM helper functions](normalization-functions.md).


## The device ID and Scope


| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| <a name ="dvcid"></a>**DvcId**               | Optional    | String     | The unique ID of the device. For example: `41502da5-21b7-48ec-81c9-baeea8d7d669`   |
| <a name="scopeid"></a>**ScopeId** | Optional | String | The cloud platform scope ID the device belongs to. **Scope** map to a subscription ID on Azure and to an account ID on AWS. | 
| <a name="scope"></a>**Scope** | Optional | String | The cloud platform scope the device belongs to. **Scope** map to a subscription on Azure and to an account on AWS. | 
| <a name="dvcidtype"></a>**DvcIdType** | Optional | Enumerated | The type of [DvcId](#dvcid). Typically this field also identifies the type of [Scope](#scope) and [ScopeId](#scopeid). This field is required if the [DvcId](#dvcid) field is used. |
| **DvcAzureResourceId**, **DvcMDEid**, **DvcMD4IoTid**, **DvcVMConnectionId**, **DvcVectraId**, **DvcAwsVpcId** |  Optional | String | Fields used to store other device IDs, if the original event includes multiple device IDs. Select the device ID most associated with the event as the primary ID stored in [DvcId](#dvcid). |

Fields names should prepend a role prefix such as `Src` or `Dst`, but should not prepend a second `Dvc` prefix if used in that role.

The allowed values for a device ID type are:

| Type | Description | 
| ---- | ------- |
| **MDEid** | The system ID assigned by Microsoft Defender for Endpoint. | 
| **AzureResourceId** | The Azure resource ID. | 
| **MD4IoTid**| The Microsoft Defender for IoT resource ID.|
| **VMConnectionId** | The Azure Monitor VM Insights solution resource ID. |
| **AwsVpcId** | An AWS VPC ID. | 
| **VectraId** | A Vectra AI assigned resource ID.|
| **Other** | An ID type not listed.| 

For example, the Azure Monitor [VM Insights solution](/azure/azure-monitor/vm/vminsights-log-query) provides network sessions information in the `VMConnection`. The table provides an Azure Resource ID in the `_ResourceId` field and a VM insights specific device ID in the `Machine` field. Use the following mapping to represent those IDs:

| Field | Map to  |
| ----- | ----- | 
| **DvcId** | The `Machine` field in the `VMConnection` table. |
| **DvcIdType** | The value `VMConnectionId` |
| **DvcAzureResourceId** | The `_ResourceId` field in the `VMConnection` table. |


## Other device fields


| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| <a name ="ipaddr"></a>**IpAddr**           | Recommended | IP address | The IP address of the device. <br><br>Example: `45.21.42.12`    |
| <a name = "dvcdescription"></a>**DvcDescription** | Optional | String | A descriptive text associated with the device. For example: `Primary Domain Controller`. |
| <a name="macaddr"></a>**MacAddr**          | Optional    | MAC        |   The MAC address of the device on which the event occurred or which reported the event.  <br><br>Example: `00:1B:44:11:3A:B7`       |
| <a name="zone"></a>**Zone** | Optional | String | The network on which the event occurred or which reported the event, depending on the schema. The reporting device defines the zone.<br><br>Example: `Dmz` |
| <a name="dvcos"></a>**DvcOs**               | Optional    | String     |         The operating system running on the device on which the event occurred or which reported the event.    <br><br>Example: `Windows`    |
| <a name="dvcosversion"></a>**DvcOsVersion**        | Optional    | String     |   The version of the operating system on the device on which the event occurred or which reported the event. <br><br>Example: `10` |
| <a name="dvcaction"></a>**DvcAction** | Optional | String | For reporting security systems, the action taken by the system, if applicable. <br><br>Example: `Blocked` |
| <a name="dvcoriginalaction"></a>**DvcOriginalAction** | Optional | String | The original [DvcAction](#dvcaction) as provided by the reporting device. |
| <a name="interface"></a>**Interface** | Optional | String | The network interface on which data was captured. This field is  typically relevant to network related activity captured by an intermediate or tap device. | 


Fields named in the list with the Dvc prefix should prepend a role prefix such as `Src` or `Dst`, but should not prepend a second `Dvc` prefix if used in that role. 
