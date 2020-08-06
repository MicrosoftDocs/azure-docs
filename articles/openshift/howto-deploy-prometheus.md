---
title: Deploy Prometheus instance in Azure Red Hat OpenShift cluster
description: Create a Prometheus instance in an Azure Red Hat OpenShift cluster to monitor your application's metrics.
author: makdaam
ms.author: b-lejaku
ms.service: container-service
ms.topic: conceptual
ms.date: 06/17/2019
keywords: prometheus, aro, openshift, metrics, red hat
---

# Deploy a standalone Prometheus instance in an Azure Red Hat OpenShift cluster

This article describes how to configure a standalone Prometheus instance that uses service discovery in an Azure Red Hat OpenShift cluster.

> [!NOTE]
> Customer admin access to Azure Red Hat OpenShift cluster isn't required.

Target setup:

- One project (prometheus-project), which contains Prometheus and Alertmanager.
- Two projects (app-project1 and app-project2), which contain the applications to monitor.

You'll prepare some Prometheus config files locally. Create a new folder to store them. Config files are stored in the cluster as secrets, in case secret tokens are added later to the cluster.

## Sign in to the cluster by using the OC tool

1. Open a web browser, and then go to the web console of your cluster (https://openshift.*random-id*.*region*.azmosa.io).
2. Sign in with your Azure credentials.
3. Select your username in the upper-right corner, and then select **Copy Login Command**.
4. Paste your username into the terminal that you'll use.

> [!NOTE]
> To see if you're signed in to the correct cluster, run the `oc whoami -c` command.

## Prepare the projects

To create the projects, run the following commands:
```
oc new-project prometheus-project
oc new-project app-project1
oc new-project app-project2
```


> [!NOTE]
> You can either use the `-n` or `--namespace` parameter, or select an active project by running the `oc project` command.

## Prepare the Prometheus configuration file
Create a prometheus.yml file by entering the following content:
```
global:
  scrape_interval: 30s
  evaluation_interval: 5s

scrape_configs:
    - job_name: prom-sd
      scrape_interval: 30s
      scrape_timeout: 10s
      metrics_path: /metrics
      scheme: http
      kubernetes_sd_configs:
      - api_server: null
        role: endpoints
        namespaces:
          names:
          - prometheus-project
          - app-project1
          - app-project2
```
Create a secret called Prom by entering the following configuration:
```
oc create secret generic prom --from-file=prometheus.yml -n prometheus-project
```

The prometheus.yml file is a basic Prometheus configuration file. It sets the intervals and configures auto discovery in three projects (prometheus-project, app-project1, app-project2). In the previous configuration file, the auto-discovered endpoints are scraped over HTTP without authentication.

For more information about scraping endpoints, see [Prometheus scape config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config).


## Prepare the Alertmanager config file
Create an alertmanager.yml file by entering the following content:
```
global:
  resolve_timeout: 5m
route:
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 12h
  receiver: default
  routes:
  - match:
      alertname: DeadMansSwitch
    repeat_interval: 5m
    receiver: deadmansswitch
receivers:
- name: default
- name: deadmansswitch
```
Create a secret called Prom-Alerts by entering the following configuration:
```
oc create secret generic prom-alerts --from-file=alertmanager.yml -n prometheus-project
```

Alertmanager.yml is the Alert Manager configuration file.

> [!NOTE]
> To verify the two previous steps, run the `oc get secret -n prometheus-project` command.

## Start Prometheus and Alertmanager
Go to [openshift/origin repository](https://github.com/openshift/origin/tree/release-3.11/examples/prometheus) and download the [prometheus-standalone.yaml](
https://raw.githubusercontent.com/openshift/origin/release-3.11/examples/prometheus/prometheus-standalone.yaml) template. Apply the template to prometheus-project by entering the following configuration:
```
oc process -f https://raw.githubusercontent.com/openshift/origin/release-3.11/examples/prometheus/prometheus-standalone.yaml | oc apply -f - -n prometheus-project
```
The prometheus-standalone.yaml file is an OpenShift template. It will create a Prometheus instance with oauth-proxy in front of it and an Alertmanager instance, also secured with oauth-proxy. In this template, oauth-proxy is configured to allow any user who can "get" the prometheus-project namespace (see the `-openshift-sar` flag).

> [!NOTE]
> To verify if the prom StatefulSet has equal DESIRED and CURRENT number replicas, run the `oc get statefulset -n prometheus-project` command. To check all resources in the project, run the `oc get all -n prometheus-project` command.

## Add permissions to allow service discovery

Create a prometheus-sdrole.yml file by entering the following content:
```
apiVersion: template.openshift.io/v1
kind: Template
metadata:
  name: prometheus-sdrole
  annotations:
    "openshift.io/display-name": Prometheus service discovery role
    description: |
      Role and rolebinding added permissions required for service discovery in a given project.
    iconClass: fa fa-cogs
    tags: "monitoring,prometheus,alertmanager,time-series"
parameters:
- description: The project name, where a standalone Prometheus is deployed
  name: PROMETHEUS_PROJECT
  value: prometheus-project
objects:
- apiVersion: rbac.authorization.k8s.io/v1
  kind: Role
  metadata:
    name: prometheus-sd
  rules:
  - apiGroups:
    - ""
    resources:
    - services
    - endpoints
    - pods
    verbs:
    - list
    - get
    - watch
- apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    name: prometheus-sd
  roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: Role
    name: prometheus-sd
  subjects:
  - kind: ServiceAccount
    name: prom
    namespace: ${PROMETHEUS_PROJECT}
```
To apply the template to all projects from which you want to allow service discovery, run the following commands:
```
oc process -f prometheus-sdrole.yml | oc apply -f - -n app-project1
oc process -f prometheus-sdrole.yml | oc apply -f - -n app-project2
oc process -f prometheus-sdrole.yml | oc apply -f - -n prometheus-project
```

> [!NOTE]
> To verify that Role and RoleBinding were created correctly, run the `oc get role` and `oc get rolebinding` commands.

## Optional: Deploy example application

Everything is working, but there are no metrics sources. Go to the Prometheus URL (https://prom-prometheus-project.apps.*random-id*.*region*.azmosa.io/). You can find it by using following command:

```
oc get route prom -n prometheus-project
```
> [!IMPORTANT]
> Remember to add the https:// prefix to beginning of the host name.

The **Status > Service Discovery** page will show 0/0 active targets.

To deploy an example application, which exposes basic Python metrics under the /metrics endpoint, run the following commands:
```
oc new-app python:3.6~https://github.com/Makdaam/prometheus-example --name=example1 -n app-project1

oc new-app python:3.6~https://github.com/Makdaam/prometheus-example --name=example2 -n app-project2
```
The new applications should appear as valid targets on the Service Discovery page within 30 seconds after deployment.

For more details, select **Status** > **Targets**.

> [!NOTE]
> For every successfully scraped target, Prometheus adds a data point in the up metric. Select **Prometheus** in the upper-left corner, enter **up** as the expression, and then select **Execute**.

## Next steps

You can add custom Prometheus instrumentation to your applications. The Prometheus Client library, which simplifies Prometheus metrics preparation, is ready for different programming languages.

For more information, see the following GitHub libraries:

 - [Java](https://github.com/prometheus/client_java)
 - [Python](https://github.com/prometheus/client_python)
 - [Go](https://github.com/prometheus/client_golang)
 - [Ruby](https://github.com/prometheus/client_ruby)
