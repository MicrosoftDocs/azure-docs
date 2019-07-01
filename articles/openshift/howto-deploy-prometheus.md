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

This article describes how to configure a standalone Prometheus instance with service discovery in an Azure Red Hat OpenShift cluster. Note that customer admin access to the cluster isn't needed.

Target setup:

- One project (prometheus-project), which contains Prometheus and Alertmanager
- Two projects (app-project1 and app-project2), which contain the applications to monitor

Some Prometheus configuration files are prepared locally. Create a new folder to store them.
These config files are stored in the cluster as Secrets, in case secret tokens are added later to the cluster.

## Step 1: Sign in to the cluster using the OC tool

Using a web browser, go to the web console of your cluster (https://openshift.*random-id*.*region*.azmosa.io).
Sign in with your Azure credentials.
Select your user name in top right and select **Copy Login Command**. Paste it into the terminal you'll use.

You can verify if you're signed in to the correct cluster with the `oc whoami -c` command.

## Step 2: Prepare the projects

Create projects:
```
oc new-project prometheus-project
oc new-project app-project1
oc new-project app-project2
```


> [!NOTE]
> You can either use the `-n` or `--namespace` parameter or select an active project with the `oc project` command

## Step 3: Prepare Prometheus config
Create a prometheus.yml file with the following content:
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
Create a Secret named prom with the following configuration:
```
oc create secret generic prom --from-file=prometheus.yml -n prometheus-project
```

The prometheus.yml file is a basic Prometheus config file.
It sets the intervals and configures auto discovery in three projects (prometheus-project, app-project1, app-project2).
In this example, the auto discovered endpoints are scraped over HTTP without authentication.

For more information about scraping endpoints, see https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config.


## Step 4: Prepare Alertmanager config
Create a file called alertmanager.yml with the following content.
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
Create a Secret named "prom-alerts" with the configuration.
```
oc create secret generic prom-alerts --from-file=alertmanager.yml -n prometheus-project
```

The alertmanager.yml is the Alert Manager configuration file.

> [!NOTE]
> You can verify the two previous steps with `oc get secret -n prometheus-project`

## Step 5: Start Prometheus and Alertmanager
Download the [prometheus-standalone.yaml](
https://raw.githubusercontent.com/openshift/origin/release-3.11/examples/prometheus/prometheus-standalone.yaml)
template from the [openshift/origin repository](https://github.com/openshift/origin/tree/release-3.11/examples/prometheus),
and then apply the template to prometheus-project:
```
oc process -f https://raw.githubusercontent.com/openshift/origin/release-3.11/examples/prometheus/prometheus-standalone.yaml | oc apply -f - -n prometheus-project
```
The prometheus-standalone.yaml file is an OpenShift Template, which creates a Prometheus instance
with an oauth-proxy in front of it. It also creates an Alertmanager instance, secured with oauth-proxy. In this template, oauth-proxy is configured to allow any user who can get the prometheus-project namespace (see the `-openshift-sar` flag).

> [!NOTE]
> You can verify if the prom StatefulSet has equal DESIRED and CURRENT number replicas with the `oc get statefulset -n prometheus-project` command. You can also check all resources in the project with `oc get all -n prometheus-project`.

## Step 6: Add permissions to allow Service Discovery
Create prometheus-sdrole.yml with the following content:
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
If you want Prometheus to gather metrics from itself, apply the permissions in prometheus-project.

> [!NOTE]
> You can verify if Role and RoleBinding were created correctly with the `oc get role` and `oc get rolebinding` commands, respectively.

## Optional: Deploy example application
Everything is working, but there are no metrics sources. Go to the Prometheus URL (https://prom-prometheus-project.apps.*random-id*.*region*.azmosa.io/), which can be found with the following command.
```
oc get route prom -n prometheus-project
```
Remember to prefix the hostname with https://.

The **Status > Service Discovery** page will show 0/0 active targets.

To deploy an example application, which exposes basic python metrics under the /metrics endpoint run the following commands.
```
oc new-app python:3.6~https://github.com/Makdaam/prometheus-example --name=example1 -n app-project1
oc new-app python:3.6~https://github.com/Makdaam/prometheus-example --name=example2 -n app-project2
```
The new applications will appear as valid targets on the Service Discovery page within 30s after deployment. You can get more details on the **Status > Targets** page.

> [!NOTE]
> For every successfully scraped target Prometheus adds a datapoint in the "up" metric. Click **Prometheus** in the top left corner and enter "up" as the expression and click **Execute**.

## Next steps

You can add custom Prometheus instrumentation to your applications.

The Prometheus Client library, which simplifies preparing Prometheus metrics, is ready for different programming languages.

 - Java https://github.com/prometheus/client_java
 - Python https://github.com/prometheus/client_python
 - Go https://github.com/prometheus/client_golang
 - Ruby https://github.com/prometheus/client_ruby
