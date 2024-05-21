---
title: Configure Container insights data collection using ConfigMap
description: Describes how you can configure other data collection for Container insights using ConfigMap.
ms.topic: conceptual
ms.date: 12/19/2023
ms.reviewer: aul
---

# Configure data collection in Container insights using ConfigMap

This article describes how to configure data collection in Container insights using ConfigMap. [ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) are a Kubernetes mechanism that allow you to store non-confidential data such as configuration file or environment variables. 

The ConfigMap is primarily used to configure data collection of the container logs and environment variables of the cluster. You can individually configure the stdout and stderr logs and also enable multiline logging.

Specific configuration you can perform with the ConfigMap includes:

- Enable/disable and namespace filtering for stdout and stderr logs
- Enable/disable collection of environment variables for the cluster
- Filter for Normal Kube events
- Select log schema
- Enable/disable multiline logging
- Ignore proxy settings  

> [!IMPORTANT]
> Complete configuration of data collection in Container insights may require editing of both the ConfigMap and the data collection rule (DCR) for the cluster since each method allows configuration of a different set of settings. 
> 
> See [Configure data collection in Container insights using data collection rule](./container-insights-data-collection-dcr.md) for a list of settings and the process to configure data collection using the DCR.

## Prerequisites 
- ConfigMap is a global list and there can be only one ConfigMap applied to the agent for Container insights. Applying another ConfigMap will overrule the previous ConfigMap collection settings.
- The minimum agent version supported to collect stdout, stderr, and environmental variables from container workloads is **ciprod06142019** or later. To verify your agent version, on the **Node** tab, select a node. On the **Properties** pane, note the value of the **Agent Image Tag** property. For more information about the agent versions and what's included in each release, see [Agent release notes](https://github.com/microsoft/Docker-Provider/tree/ci_feature_prod).

## Configure and deploy ConfigMap

Use the following procedure to configure and deploy your ConfigMap configuration file to your cluster:

1. Download the [template ConfigMap YAML file](https://aka.ms/container-azm-ms-agentconfig) and open it in an editor. If you already have a ConfigMap file, then you can use that one.
1. Edit the ConfigMap YAML file with your customizations. The file includes all valid settings  using the settings described in [Data collection settings](#data-collection-settings)
1. Create a ConfigMap by running the following kubectl command: 

    ```azurecli
    kubectl apply -f <configmap_yaml_file.yaml>
    ```
    
    Example: 
    
    ```output
    kubectl apply -f container-azm-ms-agentconfig.yaml
    ```


    The configuration change can take a few minutes to finish before taking effect. Then all Azure Monitor Agent pods in the cluster will restart. The restart is a rolling restart for all Azure Monitor Agent pods, so not all of them restart at the same time. When the restarts are finished, you'll receive a message similar to the following result: 
    
    ```output
    configmap "container-azm-ms-agentconfig" created`.
    ``````











## Frequently asked questions

### How do I enable log collection for containers in the kube-system namespace through Helm?

The log collection from containers in the kube-system namespace is disabled by default. You can enable log collection by setting an environment variable on Azure Monitor Agent. See the [Container insights GitHub page](https://aka.ms/azuremonitor-containers-helm-chart).

## Next steps

- See [Configure data collection in Container insights using data collection rule](container-insights-data-collection-dcr.md) to configure data collection using DCR instead of ConfigMap.

