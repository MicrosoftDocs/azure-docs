---
title: Deploy a standalone Prometheus instance in an Azure Red Hat OpenShift cluster | Microsoft Docs
description: Create a Prometheus instance in an Azure Red Hat OpenShift cluster to monitor your application's metrics.
author: makdaam
ms.author: b-lejaku
ms.service: container-service
ms.topic: conceptual
ms.date: 06/17/2019
keywords: prometheus, aro, openshift, metrics, red hat
---

# Deploy a standalone Prometheus in an Azure Red Hat OpenShift cluster

This article describes how to configure a standalone Prometheus instance that uses Service Discovery in an Azure Red Hat OpenShift cluster. Customer admin access to the cluster isn't required.

Target setup:

- One project (prometheus-project), which contains Prometheus and Alertmanager
- Two projects (app-project1 and app-project2), which contain the applications to monitor

You'll prepare some Prometheus config files locally. To store config files, create a new folder. Config files are stored in the cluster as Secrets, in case Secret tokens are added later to the cluster.

## 1. Sign in to the cluster by using the OC tool

Using a web browser, go to the web console of your cluster (https://openshift.*random-id*.*region*.azmosa.io). Sign in with your Azure credentials. Next, select your username, found in the top-right corner, and then select **Copy Login Command**. Paste your username into the terminal that you'll use.

To see if you're signed in to the correct cluster, enter the command `oc whoami -c`.

## 2. Prepare the projects

Create the following projects:
```
oc new-project prometheus-project
oc new-project app-project1
oc new-project app-project2
```


> [!NOTE]
> You can either use the `-n` or `--namespace` parameter, or select an active project by using the commmand `oc project`.

## 3. Prepare the Prometheus config file
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
Create a Secret called prom by entering the following config:
```
oc create secret generic prom --from-file=prometheus.yml -n prometheus-project
```

The prometheus.yml file is a basic Prometheus config file. It sets the intervals and configures auto discovery in three projects (prometheus-project, app-project1, app-project2). In the previous config file, the auto-discovered endpoints are scraped over HTTP without authentication.

For more information about scraping endpoints, see https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config.


## 4. Prepare the Alertmanager config file
Create a alertmanager.yml file by entering the following content:
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
Create a Secret called prom-alerts by entering the following configuration:
```
oc create secret generic prom-alerts --from-file=alertmanager.yml -n prometheus-project
```

Alertmanager.yml is the Alert Manager config file.

> [!NOTE]
> You can verify the two previous steps by entering `oc get secret -n prometheus-project`.

## 5. Start Prometheus and Alertmanager
Go to [openshift/origin repository](https://github.com/openshift/origin/tree/release-3.11/examples/prometheus), and then download the template called [prometheus-standalone.yaml](
https://raw.githubusercontent.com/openshift/origin/release-3.11/examples/prometheus/prometheus-standalone.yaml). Apply the template to prometheus-project:
```
oc process -f https://raw.githubusercontent.com/openshift/origin/release-3.11/examples/prometheus/prometheus-standalone.yaml | oc apply -f - -n prometheus-project
```
The prometheus-standalone.yml file is an OpenShift Template, which creates a Prometheus instance
that begins with oauth-proxy.

The prometheus-standalone.yml file also creates an Alertmanager instance, secured with oauth-proxy. In this template, oauth-proxy is configured to allow any user who can get the prometheus-project namespace (see the `-openshift-sar` flag).

> [!NOTE]
> You can verify if the prom StatefulSet has equal DESIRED and CURRENT number replicas by using the `oc get statefulset -n prometheus-project` command. You can also check all resources in the project by using `oc get all -n prometheus-project`.

## 6. Add permissions to allow Service Discovery

Create prometheus-sdrole.yml by entering the following content:
```
apiVersion: template.openshift.io/v1
kind: Template
metadata:
  name: prometheus-sdrole
  annotations:
    "openshift.io/display-name": Prometheus Service Discovery Role
    description: |
      A role and rolebinding adding permissions required to perform Service Discovery in a given project.
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
Apply the template to all projects where you would like to allow service discovery.
```
oc process -f prometheus-sdrole.yml | oc apply -f - -n app-project1
oc process -f prometheus-sdrole.yml | oc apply -f - -n app-project2
```
To have Prometheus to gather metrics from itself, apply the permissions in prometheus-project.

> [!NOTE]
> You can verify if Role and RoleBinding were created correctly by using the `oc get role` and `oc get rolebinding` commands, respectively.

## Optional: Deploy example application

If all is working but there aren't any metrics sources, see the Prometheus URL (https://prom-prometheus-project.apps.*random-id*.*region*.azmosa.io/). You can open the Prometheus URL by using the following command:
```
oc get route prom -n prometheus-project
```
> [!IMPORTANT]
> Remember to add the https:// prefix to beginning of the hostname.

The **Status > Service Discovery** page will show 0/0 active targets.

To deploy an example application, which exposes basic Python metrics under the /metrics endpoint, run the following commands:
```
oc new-app python:3.6~https://github.com/Makdaam/prometheus-example --name=example1 -n app-project1
oc new-app python:3.6~https://github.com/Makdaam/prometheus-example --name=example2 -n app-project2
```
The new applications should appear as valid targets on the Service Discovery page within 30 seconds after deployment.

For more details, select **Status** > **Targets**.

> [!NOTE]
> For every successfully scraped target, Prometheus adds a data point in the up metric. Select **Prometheus** in the upper-left corner, and then enter **up** as the expression. Select **Execute**.

## Next steps

You can add custom Prometheus instrumentation to your applications. The Prometheus Client library, which simplifies Prometheus metrics preparation, is ready for different programming languages.

For more information, see the following libraries:

 - Java: https://github.com/prometheus/client_java
 - Python: https://github.com/prometheus/client_python
 - Go: https://github.com/prometheus/client_golang
 - Ruby: https://github.com/prometheus/client_ruby
