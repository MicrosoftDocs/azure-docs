---
title: Alerts for Defender for APIs
description: This article lists the security alerts for Defender for APIs visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for Defender for APIs

This article lists the security alerts you might get for Defender for APIs from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Defender for APIs alerts

### **Suspicious population-level spike in API traffic to an API endpoint**

 (API_PopulationSpikeInAPITraffic)

**Description**: A suspicious spike in API traffic was detected at one of the API endpoints. The detection system used historical traffic patterns to establish a baseline for routine API traffic volume between all IPs and the endpoint, with the baseline being specific to API traffic for each status code (such as 200 Success). The detection system flagged an unusual deviation from this baseline leading to the detection of suspicious activity.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Suspicious spike in API traffic from a single IP address to an API endpoint**

 (API_SpikeInAPITraffic)

**Description**: A suspicious spike in API traffic was detected from a client IP to the API endpoint. The detection system used historical traffic patterns to establish a baseline for routine API traffic volume to the endpoint coming from a specific IP to the endpoint. The detection system flagged an unusual deviation from this baseline leading to the detection of suspicious activity.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Unusually large response payload transmitted between a single IP address and an API endpoint**

 (API_SpikeInPayload)

**Description**: A suspicious spike in API response payload size was observed for traffic between a single IP and one of the API endpoints. Based on historical traffic patterns from the last 30 days, Defender for APIs learns a baseline that represents the typical API response payload size between a specific IP and API endpoint. The learned baseline is specific to API traffic for each status code (for example, 200 Success). The alert was triggered because an API response payload size deviated significantly from the historical baseline.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial access

**Severity**: Medium

### **Unusually large request body transmitted between a single IP address and an API endpoint**

 (API_SpikeInPayload)

**Description**: A suspicious spike in API request body size was observed for traffic between a single IP and one of the API endpoints. Based on historical traffic patterns from the last 30 days, Defender for APIs learns a baseline that represents the typical API request body size between a specific IP and API endpoint. The learned baseline is specific to API traffic for each status code (for example, 200 Success). The alert was triggered because an API request size deviated significantly from the historical baseline.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial access

**Severity**: Medium

### **(Preview) Suspicious spike in latency for traffic between a single IP address and an API endpoint**

 (API_SpikeInLatency)

**Description**: A suspicious spike in latency was observed for traffic between a single IP and one of the API endpoints. Based on historical traffic patterns from the last 30 days, Defender for APIs learns a baseline that represents the routine API traffic latency between a specific IP and API endpoint. The learned baseline is specific to API traffic for each status code (for example, 200 Success). The alert was triggered because an API call latency deviated significantly from the historical baseline.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial access

**Severity**: Medium

### **API requests spray from a single IP address to an unusually large number of distinct API endpoints**

(API_SprayInRequests)

**Description**: A single IP was observed making API calls to an unusually large number of distinct endpoints. Based on historical traffic patterns from the last 30 days, Defenders for APIs learns a baseline that represents the typical number of distinct endpoints called by a single IP across 20-minute windows. The alert was triggered because a single IP's behavior deviated significantly from the historical baseline.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Discovery

**Severity**: Medium

### **Parameter enumeration on an API endpoint**

 (API_ParameterEnumeration)

**Description**: A single IP was observed enumerating parameters when accessing one of the API endpoints. Based on historical traffic patterns from the last 30 days, Defender for APIs learns a baseline that represents the typical number of distinct parameter values used by a single IP when accessing this endpoint across 20-minute windows. The alert was triggered because a single client IP recently accessed an endpoint using an unusually large number of distinct parameter values.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial access

**Severity**: Medium

### **Distributed parameter enumeration on an API endpoint**

 (API_DistributedParameterEnumeration)

**Description**: The aggregate user population (all IPs) was observed enumerating parameters when accessing one of the API endpoints. Based on historical traffic patterns from the last 30 days, Defender for APIs learns a baseline that represents the typical number of distinct parameter values used by the user population (all IPs) when accessing an endpoint across 20-minute windows. The alert was triggered because the user population recently accessed an endpoint using an unusually large number of distinct parameter values.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial access

**Severity**: Medium

### **Parameter value(s) with anomalous data types in an API call**

 (API_UnseenParamType)

**Description**: A single IP was observed accessing one of your API endpoints and using parameter values of a low probability data type (for example, string, integer, etc.). Based on historical traffic patterns from the last 30 days, Defender for APIs learns the expected data types for each API parameter. The alert was triggered because an IP recently accessed an endpoint using a previously low probability data type as a parameter input.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Previously unseen parameter used in an API call**

 (API_UnseenParam)

**Description**: A single IP was observed accessing one of the API endpoints using a previously unseen or out-of-bounds parameter in the request. Based on historical traffic patterns from the last 30 days, Defender for APIs learns a set of expected parameters associated with calls to an endpoint. The alert was triggered because an IP recently accessed an endpoint using a previously unseen parameter.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Access from a Tor exit node to an API endpoint**

 (API_AccessFromTorExitNode)

**Description**: An IP address from the Tor network accessed one of your API endpoints. Tor is a network that allows people to access the Internet while keeping their real IP hidden. Though there are legitimate uses, it is frequently used by attackers to hide their identity when they target people's systems online.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Pre-attack

**Severity**: Medium

### **API Endpoint access from suspicious IP**

 (API_AccessFromSuspiciousIP)

**Description**: An IP address accessing one of your API endpoints was identified by Microsoft Threat Intelligence as having a high probability of being a threat. While observing malicious Internet traffic, this IP came up as involved in attacking other online targets.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Pre-attack

**Severity**: High

### **Suspicious User Agent detected**

 (API_AccessFromSuspiciousUserAgent)

**Description**: The user agent of a request accessing one of your API endpoints contained anomalous values indicative of an attempt at remote code execution. This does not mean that any of your API endpoints have been breached, but it does suggest that an attempted attack is underway.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
