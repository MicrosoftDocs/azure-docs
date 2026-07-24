---
author: ProfessorKendrick
ms.topic: include
ms.date: 05/25/2026
ms.author: kkendrick
---

### Metrics and logs tab (optional)

Configure which Azure resources send metrics and logs to Datadog. You can change these settings at any time after creation.

For details on what gets forwarded and include/exclude examples, see [tag rules for sending metrics](../metrics-logs.md#tag-rules-for-sending-metrics) and [tag rules for sending logs](../metrics-logs.md#tag-rules-for-sending-logs) in [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md).

| Setting | What it does |
|---------|-------------|
| **Silence monitoring for expected Azure VM Shutdowns** | Suppresses alerts when VMs are stopped intentionally |
| **Collect custom metrics from App Insights** | Forwards Application Insights custom metrics to Datadog |
| **Send subscription activity logs** | Sends Azure subscription activity logs (management plane operations) to Datadog |
| **Send Azure resource logs for all defined sources** | Forwards resource diagnostic logs from all supported Azure resources to Datadog |

After you finish configuring metrics and logs, select **Next**.

### Security tab (optional)

The **Security** tab controls two features:

| Setting | Default | What it does |
|---------|---------|--------------|
| **Enable resource collection** | On | Allows Datadog to collect metadata about your Azure resources — types, tags, and configurations — so they appear in the Datadog [Resource Catalog](https://docs.datadoghq.com/infrastructure/resource_catalog/) for search, inventory, and infrastructure context. There's no additional Datadog charge for this. |
| **Enable Datadog Cloud Security Posture Management** | Off | Continuously assesses your Azure configuration against CIS, PCI DSS, SOC 2, HIPAA, and other benchmarks. Learn more about [Cloud Security Posture Management](https://www.datadoghq.com/knowledge-center/cloud-security-posture-management/). |

> [!IMPORTANT]
> **Resource collection is enabled by default** and we recommend keeping it on — it's what populates the Datadog Resource Catalog and gives every other Datadog product accurate Azure context. **Cloud Security Posture Management (CSPM) is optional and can be enabled only when resource collection is on.** If you turn resource collection off, the CSPM checkbox is disabled.

Select the **Next** button at the bottom of the page.

### Single sign-on tab (optional)

[!INCLUDE [sso](../includes/sso.md)]

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]
