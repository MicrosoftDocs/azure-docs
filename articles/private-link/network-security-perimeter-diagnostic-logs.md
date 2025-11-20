---
title: 'Diagnostic logs for Network Security Perimeter'
titleSuffix: Azure Private Link
description: Learn the options for storing diagnostic logs for Network Security Perimeter and how to enable logging through the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: concept-article
ms.date: 08/01/2025
ms.custom: references_regions, ignite-2024
#CustomerIntent: As a network administrator, I want to enable diagnostic logging for Network Security Perimeter, so that I can monitor and analyze the network traffic to and from my resources.
# Customer intent: "As a network administrator, I want to enable and configure diagnostic logging for the Network Security Perimeter, so that I can effectively monitor and analyze access logs for enhanced security oversight."
---

# Diagnostic logs for Network Security Perimeter

In this article, you learn about the diagnostic logs for Network Security Perimeter and how to enable logging. You learn access logs categories used. Then, you discover the options for storing diagnostic logs and how to enable logging through the Azure portal.

[!INCLUDE [network-security-perimeter-preview-message](../../includes/network-security-perimeter-preview-message.md)]

## Access logs categories

Access logs categories for a network security perimeter are based on the results of access rules evaluation. The log categories chosen in the diagnostic settings are sent to the customer chosen storage location. The following are the descriptions for each of the access log categories including the modes in which they're applicable:

| **Log category** | **Description** | **Applicable to Modes** |
| --- | --- | --- |
| **NspPublicInboundPerimeterRulesAllowed** | Inbound access is allowed based on network security perimeter access rules. | Transition/Enforced |
| **NspPublicInboundPerimeterRulesDenied** | Public inbound access denied by network security perimeter. | Enforced |
| **NspPublicOutboundPerimeterRulesAllowed** | Outbound access is allowed based on network security perimeter access rules. | Transition/Enforced |
| **NspPublicOutboundPerimeterRulesDenied** | Public outbound access denied by network security perimeter. | Enforced |
| **NspOutboundAttempt** | Outbound attempt within network security perimeter. | Transition/Enforced |
| **NspIntraPerimeterInboundAllowed** | Inbound access within perimeter is allowed. | Transition/Enforced |
| **NspPublicInboundResourceRulesAllowed** | When network security perimeter rules deny, inbound access is allowed based on PaaS resource rules. | Transition |
| **NspPublicInboundResourceRulesDenied** | When network security perimeter rules deny, inbound access denied by PaaS resource rules. | Transition |
| **NspPublicOutboundResourceRulesAllowed** | When network security perimeter rules deny, outbound access allowed based on PaaS resource rules. | Transition |
| **NspPublicOutboundResourceRulesDenied** | When network security perimeter rules deny, outbound access denied by PaaS resource rules. | Transition |
| **NspPrivateInboundAllowed** | Private endpoint traffic is allowed. | Transition/Enforced |

> [!NOTE]
> The available access modes for a network security perimeter are **Transition** and **Enforced**. The **Transition** mode was previously named **Learning** mode. You may continue to see references to **Learning** mode in some instances. 

## Access log schema

Every PaaS resource associated with the network security perimeter, generates access log(s) with unified log schema when enabled.
> [!NOTE]
> Network security perimeter access logs may have been aggregated. If the fields 'count' and 'timeGeneratedEndTime' are missing, consider the aggregation count as 1.

| **Value** | **Description** |
| --- | --- |
| **time** | The timestamp (UTC) of the first event in log aggregation window. |
| **timeGeneratedEndTime** | The timestamp (UTC) of the last event in the log aggregation window. |
| **count** | Number of logs aggregated. |
| **resourceId** | The resource Id of the network security perimeter.|
| **location** | The region of network security perimeter.|
| **operationName** | The name of the PaaS resource operation represented by this event. |
| **operationVersion** | The api-version associated with the operation. |
| **category** | Log categories defined for Access logs. |
| **properties** | Network security perimeter specific extended properties related to this category of events.|
| **resultDescription** | The static text description of this operation on the PaaS resource, e.g. “Get storage file.” |

## Network security perimeter specific properties

This section describes the network security perimeter specific properties in the log schema. 
> [!NOTE]
> Application of the properties is subjected to log category type. Do refer respective log category schemas for applicability.

| **Value** | **Description** |
| --- | --- |
| **serviceResourceId** | Resource ID of PaaS resource emitting network security perimeter access logs. |
| **serviceFqdn** | Fully Qualified Domain Name of PaaS resource emitting network security perimeter access logs. |
| **profile** | Name of the network security perimeter profile associated to the resource. |
| **parameters** | List of optional PaaS resource properties in JSON string format. E.g., { {Param1}: {value1}, {Param2}: {value2}, ...}. |
| **appId** | Unique GUID representing the app ID of resource in the Azure Active Directory. |
| **matchedRule** | JSON property bag containing matched accessRule name, {"accessRule" : "{ruleName}"}. It can be either network security perimeter access rule Name or resource rule name (not the ArmId). |
| **source** | JSON property bag describing source of the inbound connection. |
| **destination** | JSON property bag describing destination of the outbound connection. |
| **accessRulesVersion** | JSON property bag containing access rule version of the resource. |
	
## Source properties

Properties describing source of inbound connection.

| **Value** | **Description** |
| --- | --- |
| **resourceId** | Resource ID of source PaaS resource for an inbound connection. Will exist if applicable. |
| **ipAddress** | IP address of source making inbound connection. Will exist if applicable. |
| **port** | Port number of inbound connection. May not exist for all resource types. |
| **protocol** | Application & transport layer protocols for inbound connection in format {AppProtocol}:{TptProtocol}. E.g., HTTPS:TCP. May not exist for all resource types. |
| **perimeterGuids** | List of perimeter GUIDs of source resource. It should be specified only if allowed based on perimeter GUID. |
| **appId** | Unique GUID representing the app ID of source in the Azure Active Directory. |
| **parameters** | List of optional source properties in JSON string format. E.g., { {Param1}: {value1}, {Param2}: {value2}, ...}. |

## Destination properties
Properties describing destination of outbound connection.

| **Value** | **Description** |
| --- | --- |
| **resourceId** | Resource ID of destination PaaS resource for an outbound connection. Will exist if applicable. |
| **fullyQualifiedDomainName** | Fully Qualified Domain (FQDN) name of the destination. |
| **parameters** | List of optional destination properties in JSON string format. E.g., { {Param1}: {value1}, {Param2}: {value2}, ...}. |
| **port** | Port number of outbound connection. May not exist for all resource types. |
| **protocol** | Application & transport layer protocols for outbound connection in the format {AppProtocol}:{TptProtocol}. E.g., HTTPS:TCP. May not exist for all resource types. |

## Sample log entry For inbound categories

``` json
{
  "time" : "{timestamp}",
  "timeGeneratedEndTime" : "{timestamp}",
  "count" : "{countOfAggregatedLogs}",
  "resourceId" : "/SUBSCRIPTIONS/{subsId}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYPERIMETERS/{perimeterName}",
  "operationName" : "{PaaSOperationName}" ,
  "operationVersion" : "{api-version}",
  "category" : "{inboundCategory}",
  "location" : "{networksecurityperimeterRegion}",
  "properties" : {
    "serviceResourceId" : "/subscriptions/{paasSubsId}/resourceGroups/{paasResourceGroupName}/providers/{provider}/{resourceType}/{resourceName}",
    "serviceFqdn": "{PaaSResourceFQDN}",
    "accessRulesVersion" : "{accessRulesVersion}",
    "profile" : "{networksecurityperimeterProfileName}",
    "appId" : "{resourceAppId}",
    "parameters" : "{ {ParameterType1}: {value1}, {ParameterType2}: {value2}, ...}", // Parsable JSON 
    "matchedRule" : {
      "accessRule" : "{matchedRuleName}",
      },
    "source" : {
      "resourceId" : "/subscriptions/{sourceSubscriptionId}/resourceGroups/{sourceResourceGroupName}/providers/{sourceProvider}/{sourceResourceType}/{sourceResourceName}",
      "ipAddress": "{sourceIPAddress}",
      "perimeterGuids" : ["{sourcePerimeterGuid}"], // Only included if request comes from perimeter
      "appId" : "{sourceAppId}",
      "port" : "{Port}",
      "protocol" : "{Protocol}",
      "parameters" : "{ {ParameterType1}: {value1}, {ParameterType2}: {value2}, ...}", // Parsable JSON 
    },
  },
  "resultDescription" : "The static text description of this operation on the PaaS resource. For example, \"Get storage file.\""
}
```

## Sample log entry for outbound categories

``` json
{
  "time" : "{timestamp}",
  "timeGeneratedEndTime" : "{timestamp}",
  "count" : "{countOfAggregatedLogs}",
  "resourceId" : "/SUBSCRIPTIONS/{subsId}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYPERIMETERS/{perimeterName}",
  "operationName" : "{PaaSOperationName}" ,
  "operationVersion" : "{api-version}",
  "category" : "{outboundCategory}",
  "location" : "{networksecurityperimeterRegion}",
  "properties" : {
    "serviceResourceId" : "/subscriptions/{paasSubsId}/resourceGroups/{paasResourceGroupName}/providers/{provider}/{resourceType}/{resourceName}",
    "serviceFqdn": "{PaaSResourceFQDN}",
    "accessRulesVersion" : "{accessRulesVersion}",
    "profile" : "{networksecurityperimeterProfileName}",
    "appId" : "{resourceAppId}",
    "parameters" : "{{ParameterType1}: {value1}, {ParameterType2}: {value2}, ...}", // Parsable JSON 
    "matchedRule" : {
      "accessRule" : "{matchedRuleName}",
      },
    "destination" : {
      "resourceId" : "/subscriptions/{destSubsId}/resourceGroups/{destResourceGroupName}/providers/{destProvider}/{destResourceType}/{destResourceName}",
      "fullyQualifiedDomainName" : "{destFQDN}",
      "appId" : "{destAppId}",
      "port" : "{Port}",
      "protocol" : "{Protocol}",
      "parameters" : "{ {ParameterType1}: {value1}, {ParameterType2}: {value2}, ...}", // Parsable JSON 
    },
  },
  "resultDescription" : "The static text description of this operation on the PaaS resource. For example, \"Get storage file.\""
}
```

## Logging destination options for access logs  

The destinations for storing diagnostic logs for a network security perimeter include services like Log Analytic workspace (**Table name: NSPAccessLogs**), Azure Storage account, and Azure Event Hubs. For the full list and details of supported destinations, see [Supported destinations for diagnostic logs](/azure/azure-monitor/essentials/diagnostic-settings).

## Enable logging through the Azure portal

You can enable diagnostic logging for a network security perimeter by using the Azure portal under Diagnostic settings. When adding a diagnostic setting, you can choose the log categories you want to collect and the destination where you want to deliver the logs.

:::image type="content" source="media/network-security-perimeter-diagnostic-logs/network-security-perimeter-diagnostic-settings.png" alt-text="Screenshot of diagnostic settings options for a network security perimeter.":::

> [!NOTE]
> When using Azure Monitor with a network security perimeter, the Log Analytics workspace to be associated with the network security perimeter needs to be located in one of the Azure Monitor supported regions.

> [!Warning]
> The log destinations must be within the same network security perimeter as the PaaS resource to ensure the proper flow of PaaS resource logs. Configuring/already configured Diagnostic Settings for resources not included in the list of [Onboarded private link resources](/azure/private-link/network-security-perimeter-concepts#onboarded-private-link-resources), will result in the cessation of log flow for those resources.

## Next steps

> [!div class="nextstepaction"]
> [Create a network security perimeter in the Azure portal](./create-network-security-perimeter-portal.md)
