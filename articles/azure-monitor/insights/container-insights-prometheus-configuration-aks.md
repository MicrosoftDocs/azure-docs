---
title: Configure Azure Monitor for containers Prometheus Integration for Kubernetes | Microsoft Docs
description: This article describes how you can configure the Azure Monitor for containers agent to scrape metrics from Prometheus with your Kubernetes cluster.
ms.topic: conceptual
ms.date: 04/16/2020
---

# Configure Azure Monitor for containers Prometheus Integration for AKS and Kubernetes

## 1. Download the configuration template

> [!NOTE] This step is not required when working with Azure Red Hat OpenShift since the ConfigMap template already exists on the cluster.

[Download the template](https://github.com/microsoft/OMS-docker/blob/ci_feature_prod/Kubernetes/container-azm-ms-agentconfig.yaml) file and save it as container-azm-ms-agentconfig.yaml.

```bash
curl https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature_prod/Kubernetes/container-azm-ms-agentconfig.yaml > container-azm-ms-agentconfig.yaml
```

## 2. Edit the configuration

Edit the `container-azm-ms-agentconfig.yaml` file with your customizations to scrape Prometheus metrics.

Check out the [Prometheus Integration Configuration Overview](container-insights-prometheus-configuration-overview.md) for details on how to configure the Config Map.

## 3. Apply the configuration

```bash
kubectl apply -f container-azm-ms-agentconfig.yaml
```

The configuration change can take a few minutes to finish before taking effect, and all omsagent pods in the cluster will restart. The restart is a rolling restart for all omsagent pods, not all restart at the same time. When the restarts are finished, a message is displayed that's similar to the following and includes the result: `configmap "container-azm-ms-agentconfig" created`.

## 4. Verify the configuration

To verify the configuration was successfully applied to a cluster, use the following command to review the logs from an agent pod:

```bash
kubectl logs omsagent-fdf58 -n=kube-system
```

If there are configuration errors from the omsagent pods, the output will show errors similar to the following:

```
***************Start Config Processing********************
config::unsupported/missing config schema version - 'v21' , using defaults
```

Errors related to applying configuration changes are also available for review. The following options are available to perform additional troubleshooting of configuration changes and scraping of Prometheus metrics:

- From an agent pod logs using the same `kubectl logs` command

- From Live Data (preview). Live Data (preview) logs show errors similar to the following:

  ```
  2019-07-08T18:55:00Z E! [inputs.prometheus]: Error in plugin: error making HTTP request to http://invalidurl:1010/metrics: Get http://invalidurl:1010/metrics: dial tcp: lookup invalidurl on 10.0.0.10:53: no such host
  ```

- From the **KubeMonAgentEvents** table in your Log Analytics workspace. Data is sent every hour with _Warning_ severity for scrape errors and _Error_ severity for configuration errors. If there are no errors, the entry in the table will have data with severity _Info_, which reports no errors. The **Tags** property contains more information about the pod and container ID on which the error occurred and also the first occurrence, last occurrence, and count in the last hour.

Errors prevent omsagent from parsing the file, causing it to restart and use the default configuration. After you correct the error(s) in ConfigMap on clusters other than Azure Red Hat OpenShift, save the yaml file and apply the updated ConfigMaps by running the command: `kubectl apply -f <configmap_yaml_file.yaml`.

## Next steps

- [Query Prometheus Metrics from Azure Monitor](container-insights-prometheus-configuration-query.md)
- [Learn more about configuring the agent collection settings for stdout, stderr, and environmental variables from container workloads](container-insights-agent-config.md)
