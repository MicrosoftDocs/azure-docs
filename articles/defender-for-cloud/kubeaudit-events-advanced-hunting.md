---
title: Kubeaudit events in advanced hunting
description: Learn how you can use Kubernetes Kubeaudit events for advanced hunting in the Microsoft Defender portal.
ms.topic: how-to
author: dcurwin
ms.author: dacurwin
ms.date: 05/28/2024
---

# Kubeaudit events in advanced hunting

Kubernetes Kubeaudit events (and Azure Resource Manager cloud audit) are available in advanced hunting in the Microsoft Defender portal.

You can triage and investigate incidents that happened on your Kubernetes control plane attack surface and Azure Resource Management. You can also proactively hunt for threats using [advanced hunting](/defender-xdr/advanced-hunting-overview).

In addition, you can create [custom detections](/defender-xdr/custom-detection-rules) for suspicious Resource Manager and Kubernetes (KubeAudit) control plane activities.

This feature covers:

- Kubernetes KubeAudit events from Azure (Azure Kubernetes Service), Amazon Web Services (Amazon Elastic Kubernetes Service), Google Cloud Platform (Google Kubernetes Engine) and on-premises

- Resource Manager control plane events

To start, see the new table that was added to the Schema tab in advanced hunting called **CloudAuditEvents**.

:::image type="content" source="media/kubeaudit-events-advanced-hunting/cloud-audit-events.png" alt-text="Screenshot of CloudAuditEvents table in Schema tab in advanced hunting." lightbox="media/kubeaudit-events-advanced-hunting/cloud-audit-events.png":::

## Common use cases and scenarios

- Investigate suspicious Resource Manager and Kubernetes (Kubeaudit) control plane activities in XDR advanced hunting
- Create custom detections for suspicious Resource Manager and Kubernetes (Kubeaudit) control plane activities

## Prerequisites

- **For Kubernetes events:** you need at least one subscription with a Defender for Containers plan enabled
- **For Azure Resource Manager events:** you need  at least one subscription with a Defender for Azure Resource Manager plan enabled

## Sample queries

To surface deployment of a privileged pod, use the following sample query:

```kusto
CloudAuditEvents
| where Timestamp > ago(1d)
| where DataSource == "Azure Kubernetes Service"
| where OperationName == "create"
| where RawEventData.ObjectRef.resource == "pods" and isnull(RawEventData.ObjectRef.subresource)
| where RawEventData.ResponseStatus.code startswith "20"
| extend PodName = RawEventData.RequestObject.metadata.name
| extend PodNamespace = RawEventData.ObjectRef.namespace
| mv-expand Container = RawEventData.RequestObject.spec.containers
| extend ContainerName = Container.name
| where Container.securityContext.privileged == "true"
| extend Username = RawEventData.User.username
| project Timestamp, AzureResourceId , OperationName, IPAddress, UserAgent, PodName, PodNamespace, ContainerName, Username
```

To surface the *exec* command in the *kube-system* namespace, use the following sample query:

```kusto
CloudAuditEvents
| where Timestamp > ago(1d)
| where DataSource == "Azure Kubernetes Service"
| where OperationName == "create"
| where RawEventData.ObjectRef.resource == "pods" and RawEventData.ResponseStatus.code == 101  
| where RawEventData.ObjectRef.namespace == "kube-system"
| where RawEventData.ObjectRef.subresource == "exec"
| where RawEventData.ResponseStatus.code == 101
| extend RequestURI = tostring(RawEventData.RequestURI)
| extend PodName = tostring(RawEventData.ObjectRef.name)
| extend PodNamespace = tostring(RawEventData.ObjectRef.namespace)
| extend Username = tostring(RawEventData.User.username)
| where PodName !startswith "tunnelfront-" and PodName !startswith "konnectivity-" and PodName !startswith "aks-link"
| extend Commands =  extract_all(@"command=([^\&]*)", RequestURI)
| extend ParsedCommand = url_decode(strcat_array(Commands, " "))
| project Timestamp, AzureResourceId , OperationName, IPAddress, UserAgent, PodName, PodNamespace,  Username, ParsedCommand
```

To identify the creation of the *cluster-admin* role binding, use the following sample query:

```kusto
CloudAuditEvents
| where Timestamp > ago(1d)
| where OperationName == "create"
| where RawEventData.ObjectRef.resource == "clusterrolebindings"
| where RawEventData.ResponseStatus.code startswith "20"
| where RawEventData.RequestObject.roleRef.name == "cluster-admin"
| mv-expand Subject = RawEventData.RequestObject.subjects
| extend SubjectName = tostring(Subject.name)
| extend SubjectKind = tostring(Subject["kind"]) 
| extend BindingName = tostring(RawEventData.ObjectRef.name)
| extend ActionTakenBy = tostring(RawEventData.User.username)
| where ActionTakenBy != "acsService" //Remove FP
| project Timestamp, AzureResourceId , OperationName, ActionTakenBy, IPAddress, UserAgent, BindingName, SubjectName, SubjectKind
```

## Related content

- [Advanced hunting overview](/defender-xdr/advanced-hunting-overview)
- [CloudAuditEvents](/defender-xdr/advanced-hunting-cloudauditevents-table)
