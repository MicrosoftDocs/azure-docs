---
title: Learn Azure Policy for AKS Engine
description: Learn how Azure Policy uses CustomResourceDefinitions and Open Policy Agent from Gatekeeper v3 to manage clusters with AKS Engine. 
author: DCtheGeek
ms.author: dacoulte
ms.date: 11/04/2019
ms.topic: conceptual
ms.service: azure-policy
---
# Understand Azure Policy for AKS Engine

Azure Policy integrates with
[AKS Engine](https://github.com/Azure/aks-engine/blob/master/docs/README.md), a system that provides
convenient tooling to quickly bootstrap a self-managed Kubernetes cluster on Azure. This integration
enables at-scale enforcements and safeguards on your AKS Engine self-managed clusters in a
centralized, consistent manner. By extending use of
[Open Policy Agent](https://www.openpolicyagent.org/) (OPA)
[Gatekeeper](https://github.com/open-policy-agent/gatekeeper) v3 (beta), an _admission controller
webhook_ for Kubernetes, Azure Policy makes it possible to manage and report on the compliance state
of your Azure resources and AKS Engine self-managed clusters from one place.

> [!NOTE]
> Azure Policy for AKS Engine is in Public Preview and has no SLA. Gatekeeper v3 is in Beta and is
> supported by the open source community. The service only supports built-in policy definitions and
> a single AKS Engine cluster for each resource group configured with a Service Principal.

> [!IMPORTANT]
> To get support for Azure Policy for AKS Engine, AKS Engine, or Gatekeeper v3, create a
> [new issue](https://github.com/Azure/aks-engine/issues/new/choose) in the AKS Engine GitHub
> repository.

## Overview

To enable and use Azure Policy for AKS Engine with your self-managed Kubernetes cluster on Azure,
take the following actions:

- [Prerequisites](#prerequisites)
- [Install the Azure Policy Add-on](#installing-the-add-on)
- [Assign a policy definition for AKS Engine](#built-in-policies)
- [Wait for validation](#validation-and-reporting-frequency)

## Prerequisites

Before installing the Azure Policy Add-on or enabling any of the service features, your subscription
must enable the **Microsoft.PolicyInsights** resource provider and create a role assignment for the
cluster service principal. 

1. To enable the resource provider, follow the steps in
   [Resource providers and types](../../../azure-resource-manager/resource-manager-supported-services.md#azure-portal)
   or run either the Azure CLI or Azure PowerShell command:

   - Azure CLI

     ```azurecli-interactive
     # Log in first with az login if you're not using Cloud Shell
     
     # Provider register: Register the Azure Policy provider
     az provider register --namespace 'Microsoft.PolicyInsights'
     ```

   - Azure PowerShell
   
     ```azurepowershell-interactive
     # Log in first with Connect-AzAccount if you're not using Cloud Shell
   
     # Provider register: Register the Azure Policy provider
     Register-AzResourceProvider -ProviderNamespace 'Microsoft.PolicyInsights'
     ```

1. Create a role assignment for the cluster service principal

   - If you don't know the cluster service principal app ID, look it up with the following command.

     ```bash
     # Get the kube-apiserver pod name
     kubectl get pods -n kube-system
   
     # Find the aadClientID value
     kubectl exec <kube-apiserver pod name> -n kube-system cat /etc/kubernetes/azure.json
     ```

   - Assign 'Policy Insights Data Writer (Preview)' role assignment to the cluster service principal
     app ID (value _aadClientID_ from previous step) with Azure CLI. Replace `<subscriptionId>` with
     your subscription ID and `<aks engine cluster resource group>` with the resource group the AKS
     Engine self-managed Kubernetes cluster is in.

     ```azurecli-interactive
     az role assignment create --assignee <cluster service principal app ID> --scope "/subscriptions/<subscriptionId>/resourceGroups/<aks engine cluster resource group>" --role "Policy Insights Data Writer (Preview)"
     ```

## Azure Policy Add-on

The _Azure Policy Add-on_ for Kubernetes connects the Azure Policy service to the Gatekeeper
admission controller. The add-on, which is installed into the _kube-system_ namespace, enacts the
following functions:

- Checks with Azure Policy for assignments to the AKS Engine cluster
- Downloads and installs policy details, constraint templates, and constraints
- Runs a full scan compliance check on the AKS Engine cluster
- Reports auditing and compliance details back to Azure Policy

### Installing the add-on

Once the prerequisites are completed, the Azure Policy Add-on can be installed. The installation can
be during the creation or update cycle of an AKS Engine or as an independent action on an existing
cluster.

- Install during creation or update cycle

  To enable the Azure Policy Add-on during the creation of a new self-managed cluster or as an
  update to an existing cluster, include the **addons** property cluster definition for AKS Engine.

  ```json
  "addons": [{
      "name": "azure-policy",
      "enabled": true,
      "config": {
          "auditInterval": "30",
          "constraintViolationsLimit": "20"
      }
  }]
  ```

  For more information about, see the external guide
  [AKS Engine cluster definition](https://github.com/Azure/aks-engine/blob/master/docs/topics/clusterdefinitions.md).

- Install in existing cluster with Helm Charts

  Use the following steps to prepare the cluster and install the add-on:

  1. Install Gatekeeper to the _gatekeeper-system_ namespace.

     ```bash
     kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/deploy/gatekeeper.yaml
     ```
  1. Add _control-plane_ label to _kube-system_. This label excludes the auditing of _kube-system_
     pods and services by Gatekeeper and the Azure Policy Add-on.

     ```bash
     kubectl label namespaces kube-system control-plane=controller-manager
     ```

  1. Sync Kubernetes data (Namespace, Pod, Ingress, Service) with OPA.

     ```bash
     kubectl apply -f https://raw.githubusercontent.com/Azure/azure-policy/master/built-in-references/Kubernetes/gatekeeper-opa-sync.yaml
     ```

     For more information, see
     [OPA - Replicating data](https://github.com/open-policy-agent/gatekeeper#replicating-data).

  1. Add the Azure Policy repo to Helm.

     ```bash
     helm repo add azure-policy https://raw.githubusercontent.com/Azure/azure-policy/master/extensions/policy-addon-kubernetes/helm-charts
     ```

     For more information, see
     [Helm Chart - Quickstart Guide](https://helm.sh/docs/using_helm/#quickstart-guide).

  1. Install the add-on with a Helm Chart. Replace `<subscriptionId>` with your subscription ID and
     `<aks engine cluster resource group>` with the resource group the AKS Engine self-managed
     Kubernetes cluster is in.

     ```bash
     helm install azure-policy/azure-policy-addon-aks-engine --name azure-policy-addon --set azurepolicy.env.resourceid="/subscriptions/<subscriptionId>/resourceGroups/<aks engine cluster resource group>"
     ```

     For more information about what the add-on Helm Chart installs, see the
     [Azure Policy Add-on Helm Chart definition](https://github.com/Azure/azure-policy/tree/master/extensions/policy-addon-kubernetes/helm-charts)
     on GitHub.

     > [!NOTE]
     > Because of the relationship between Azure Policy Add-on and the resource group id, Azure
     > Policy supports only one AKS Engine cluster for each resource group.

To validate that the add-on installation was successful and that the _azure-policy_ pod is running,
run the following command:

```bash
kubectl get pods -n kube-system
```

### Validation and reporting frequency

The add-on checks in with Azure Policy for changes in policy assignments every 5 minutes. During
this refresh cycle, the add-on checks for changes. These changes trigger creates, updates, or
deletes of the constraint templates and constraints.

> [!NOTE]
> While a _cluster admin_ may have permission to make changes to constraint templates and
> constraints, it's not recommended or supported to make changes to constraint templates or
> constraints created by Azure Policy. Any manual changes made are lost during the refresh cycle.

Every 5 minutes, the add-on calls for a full scan of the cluster. After gathering details of the
full scan and any real-time evaluations by Gatekeeper of attempted changes to the cluster, the
add-on reports the results back to Azure Policy for inclusion in
[compliance details](../how-to/get-compliance-data.md) like any Azure Policy assignment. Only
results for active policy assignments are returned during the audit cycle. Audit results can also be
seen as violations listed in the status field of the failed constraint.

## Policy language

The Azure Policy language structure for managing AKS Engine follows that of existing policies. The
effect _EnforceOPAConstraint_ is used to manage your AKS Engine clusters and takes _details_
properties specific to working with
[OPA Constraint Framework](https://github.com/open-policy-agent/frameworks/tree/master/constraint)
and Gatekeeper v3. For details and examples, see the
[EnforceOPAConstraint](effects.md#enforceopaconstraint) effect.

As part of the _details.constraintTemplate_ and _details.constraint_ properties in the policy
definition, Azure Policy passes the URIs of these
[CustomResourceDefinitions](https://github.com/open-policy-agent/gatekeeper#constraint-templates)
(CRD) to the add-on. Rego is the language that OPA and Gatekeeper support to validate a request to
the Kubernetes cluster. By supporting an existing standard for Kubernetes management, Azure Policy
makes it possible to reuse existing rules and pair them with Azure Policy for a unified cloud
compliance reporting experience. For more information, see
[What is Rego?](https://www.openpolicyagent.org/docs/how-do-i-write-policies.html#what-is-rego).

## Built-in policies

To find the built-in policies for managing your AKS Engine cluster using the Azure portal, follow
these steps:

1. Start the Azure Policy service in the Azure portal. Select **All services** in the left pane and
   then search for and select **Policy**.

1. In the left pane of the Azure Policy page, select **Definitions**.

1. From the Category drop-down list box, use **Select all** to clear the filter and then select
   **Kubernetes**.

1. Select the policy definition, then select the **Assign** button.

> [!NOTE]
> When assigning the Azure Policy for AKS Engine definition, the **Scope** must be the resource
> group of the AKS Engine cluster.

Alternately, use the [Assign a policy - Portal](../assign-policy-portal.md) quickstart to find and
assign an AKS Engine policy. Search for an AKS Engine policy definition instead of the sample 'audit
vms'.

> [!IMPORTANT]
> Built-in policies in category **Kubernetes** are only for use with AKS Engine.

## Logging

### Azure Policy Add-on logs

As a Kubernetes controller/container, the Azure Policy Add-on keeps logs in the AKS Engine cluster.

To view the Azure Policy Add-on logs, use `kubectl`:

```bash
# Get the Azure Policy Add-on pod name
kubectl -n kube-system get pods -l app=azure-policy --output=name

# Get the logs for the add-on
kubectl logs <Azure Policy Add-on pod name> -n kube-system
```

### Gatekeeper logs

The Gatekeeper pod, _gatekeeper-controller-manager-0_, is usually in the `gatekeeper-system` or
`kube-system` namespace, but can be in a different namespace depending on how it's deployed.

To view the Gatekeeper logs, use `kubectl`:

```bash
NAMESPACE=<namespace of gatekeeper>
kubectl logs gatekeeper-controller-manager-0 -n $NAMESPACE
```

For more information, see
[Debugging Gatekeeper](https://github.com/open-policy-agent/gatekeeper#debugging) in the OPA
documentation.

## Remove the add-on

To remove the Azure Policy Add-on and Gatekeeper from your AKS Engine cluster, use the method that
aligns with how the add-on was installed:

- If installed by setting the **addons** property in the cluster definition for AKS Engine:

  Redeploy the cluster definition to AKS Engine after changing the **addons** property for
  _azure-policy_ to false:


  ```json
  "addons": [{
      "name": "azure-policy",
      "enabled": false
  }]
  ```

- If installed with Helm Charts:

  1. Remove old constraints

     Currently the uninstall mechanism only removes the Gatekeeper system, it doesn't remove any
     _ConstraintTemplate_, _Constraint_, or _Config_ resources that have been created by the user,
     nor does it remove their accompanying _CRDs_.

     When Gatekeeper is running, it's possible to remove unwanted constraints by:

     - Deleting all instances of the constraint resource
     - Deleting the _ConstraintTemplate_ resource, which should automatically clean up the _CRD_
     - Deleting the _Config_ resource removes finalizers on synced resources

  1. Uninstall Azure Policy Add-on
  
     ```bash
     helm del --purge azure-policy-addon
     ```

  1. Uninstall Gatekeeper
  
     ```bash
     kubectl delete -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/deploy/gatekeeper.yaml
     ```

## Diagnostic data collected by Azure Policy Add-on

The Azure Policy Add-on for Kubernetes collects limited cluster diagnostic data. This diagnostic
data is vital technical data related to software and performance. It's used in the following ways:

- Keep Azure Policy Add-on up-to-date
- Keep Azure Policy Add-on secure, reliable, performant
- Improve Azure Policy Add-on - through the aggregate analysis of the use of the add-on

The information collected by the add-on isn't personal data. The following details are currently
collected:

- Azure Policy Add-on agent version
- Cluster type
- Cluster region
- Cluster resource group
- Cluster resource ID
- Cluster subscription ID
- Cluster OS (Example: Linux)
- Cluster city (Example: Seattle)
- Cluster state or province (Example: Washington)
- Cluster country or region (Example: United States)
- Exceptions/errors encountered by Azure Policy Add-on during agent installation on policy
  evaluation
- Number of Gatekeeper policies not installed by Azure Policy Add-on

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Policy definition structure](definition-structure.md).
- Review [Understanding policy effects](effects.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/getting-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).