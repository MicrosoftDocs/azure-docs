---
title: Configure Azure Monitor for containers Prometheus Integration for Azure Red Hat OpenShift | Microsoft Docs
description: This article describes how you can configure the Azure Monitor for containers agent to scrape metrics from Prometheus with your Kubernetes cluster.
ms.topic: conceptual
ms.date: 04/16/2020
---

# Configure Azure Monitor for containers Prometheus Integration for Azure Red Hat OpenShift 3.11

> [!NOTE] For Azure Red Hat OpenShift, a template ConfigMap file is created in the _openshift-azure-logging_ namespace. It is not configured to actively scrape metrics or data collection from the agent.

## Prerequisites

Before you start, confirm you are a member of the Customer Cluster Admin role of your Azure Red Hat OpenShift cluster to configure the containerized agent and Prometheus scraping settings. To verify you are a member of the _osa-customer-admins_ group, run the following command:

```bash
oc get groups
```

The output will resemble the following:

```bash
NAME                  USERS
osa-customer-admins   <your-user-account>@<your-tenant-name>.onmicrosoft.com
```

If you are member of _osa-customer-admins_ group, you should be able to list the `container-azm-ms-agentconfig` ConfigMap using the following command:

```bash
oc get configmaps container-azm-ms-agentconfig -n openshift-azure-logging
```

The output will resemble the following:

```bash
NAME                           DATA      AGE
container-azm-ms-agentconfig   4         56m
```

## 1. Edit the configuration

The Config Map template already exists oin the cluster. Run the following comman, to open the file in a text editor.

```bash
oc edit configmaps container-azm-ms-agentconfig -n openshift-azure-logging
```

The following annotation `openshift.io/reconcile-protect: "true"` must be added under the metadata of _container-azm-ms-agentconfig_ Config Map to prevent reconciliation.

```
metadata:
  annotations:
    openshift.io/reconcile-protect: "true"
```

Check out the [Prometheus Integration Configuration Overview](container-insights-prometheus-configuration-overview.md) for details on how to configure the Config Map.

## 2. Apply the configuration

To apply the configuration, save your changes in the editor. The configuration change can take a few minutes to finish before taking effect, and all omsagent pods in the cluster will restart. The restart is a rolling restart for all omsagent pods, not all restart at the same time. When the restarts are finished, a message is displayed that's similar to the following and includes the result: `configmap "container-azm-ms-agentconfig" created`.

You can view the updated ConfigMap by running the following command:

```bash
oc describe configmaps container-azm-ms-agentconfig -n openshift-azure-logging
```

## Next steps

- [Query Prometheus Metrics from Azure Monitor](container-insights-prometheus-configuration-query.md)
- [Learn more about configuring the agent collection settings for stdout, stderr, and environmental variables from container workloads](container-insights-agent-config.md)
