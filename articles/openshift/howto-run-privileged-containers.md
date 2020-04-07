---
title: Run privileged containers in an Azure Red Hat OpenShift cluster | Microsoft Docs
description: Run privileged containers to monitor security and compliance.
author: makdaam
ms.author: b-lejaku
ms.service: container-service
ms.topic: conceptual
ms.date: 12/05/2019
keywords: aro, openshift, aquasec, twistlock, red hat
#Customer intent: As a customer, I want to monitor security compliance of my ARO clusters.
---

# Run privileged containers in an Azure Red Hat OpenShift cluster

You can't run arbitrary privileged containers on Azure Red Hat OpenShift clusters.
Two security monitoring and compliance solutions are allowed to run on ARO clusters.
This document describes the differences from the generic OpenShift deployment documentation of the security product vendors.


Read through these instructions before following the vendor's instructions.
Section titles in product-specific steps below refer directly to section titles in the vendors' documentation.

## Before you begin

The documentation of most security products assumes you have cluster-admin privileges.
Customer admins don't have all privileges in Azure Red Hat OpenShift. Permissions required to modify cluster-wide resources are limited.

First, ensure the user is logged in to the cluster as a customer admin, by running
`oc get scc`. All users that are members of the customer admin group have permissions to view the Security Context Constraints (SCCs) on the cluster.

Next, ensure that the `oc` binary version is `3.11.154`.
```
oc version
oc v3.11.154
kubernetes v1.11.0+d4cacc0
features: Basic-Auth GSSAPI Kerberos SPNEGO

Server https://openshift.aqua-test.osadev.cloud:443
openshift v3.11.154
kubernetes v1.11.0+d4cacc0
```

## Product-specific steps for Aqua Security
The base instructions that are going to be modified can be found in the [Aqua Security deployment documentation](https://docs.aquasec.com/docs/openshift-red-hat). The steps here will run in conjunction to the Aqua deployment documentation.

The first step is to annotate the required SCCs that will be updated. These annotations prevent the cluster's Sync Pod from reverting any changes to these SSCs.

```
oc annotate scc hostaccess openshift.io/reconcile-protect=true
oc annotate scc privileged openshift.io/reconcile-protect=true
```

### Step 1: Prepare prerequisites
Remember to log in to the cluster as an ARO Customer Admin instead of the cluster-admin role.

Create the project and the service account.
```
oc new-project aqua-security
oc create serviceaccount aqua-account -n aqua-security
```

Instead of assigning the cluster-reader role, assign the customer-admin-cluster role to the aqua-account with the following command.
```
oc adm policy add-cluster-role-to-user customer-admin-cluster system:serviceaccount:aqua-security:aqua-account
oc adm policy add-scc-to-user privileged system:serviceaccount:aqua-security:aqua-account
oc adm policy add-scc-to-user hostaccess system:serviceaccount:aqua-security:aqua-account
```

Continue following the remaining instructions in Step 1.  Those instructions describe setting up the secret for the Aqua registry.

### Step 2: Deploy the Aqua Server, Database, and Gateway
Follow the steps provided in the Aqua documentation for installing the aqua-console.yaml.

Modify the provided `aqua-console.yaml`.  Remove the top two objects labeled, `kind: ClusterRole` and `kind: ClusterRoleBinding`.  These resources won't be created as the customer admin doesn't have permission at this time to modify `ClusterRole` and `ClusterRoleBinding` objects.

The second modification will be to the `kind: Route` portion of the `aqua-console.yaml`. Replace the following yaml for the `kind: Route` object in the `aqua-console.yaml` file.
```
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  labels:
    app: aqua-web
  name: aqua-web
  namespace: aqua-security
spec:
  port:
    targetPort: aqua-web
  tls:
    insecureEdgeTerminationPolicy: Redirect
    termination: edge
  to:
    kind: Service
    name: aqua-web
    weight: 100
  wildcardPolicy: None
```

Follow the remaining instructions.

### Step 3: Login to the Aqua Server
This section isn't modified in any way.  Follow the Aqua documentation.

Use the following command to get the Aqua Console address.
```
oc get route aqua-web -n aqua-security
```

### Step 4: Deploy Aqua Enforcers
Set the following fields when deploying enforcers:

| Field          | Value         |
| -------------- | ------------- |
| Orchestrator   | OpenShift     |
| ServiceAccount | aqua-account  |
| Project        | aqua-security |

## Product-specific steps for Prisma Cloud / Twistlock

The base instructions we're going to modify can be found in the [Prisma Cloud deployment documentation](https://docs.paloaltonetworks.com/prisma/prisma-cloud/19-11/prisma-cloud-compute-edition-admin/install/install_openshift.html)

Start by installing the `twistcli` tool as described in the "Install Prisma Cloud" and "Download the Prisma Cloud software" sections.

Create a new OpenShift project
```
oc new-project twistlock
```

Skip the optional section "Push the Prisma Cloud images to a private registry". It won't work on Azure Red Hat Openshift. Use the online registry instead.

You can follow the official documentation while applying the corrections described below.
Start with the "Install Console" section.

### Install Console

During `oc create -f twistlock_console.yaml` in Step 2, you'll get an Error when creating the namespace.
You can safely ignore it, the namespace has been created previously with the `oc new-project` command.

Use `azure-disk` for storage type.

### Create an external route to Console

You can either follow the documentation, or the instructions below if you prefer the oc command.
Copy the following Route definition to a file called twistlock_route.yaml on your computer
```
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  labels:
    name: console
  name: twistlock-console
  namespace: twistlock
spec:
  port:
    targetPort: mgmt-http
  tls:
    insecureEdgeTerminationPolicy: Redirect
    termination: edge
  to:
    kind: Service
    name: twistlock-console
    weight: 100
  wildcardPolicy: None
```
then run:
```
oc create -f twistlock_route.yaml
```

You can get the URL assigned to Twistlock console with this command:
`oc get route twistlock-console -n twistlock`

### Configure console

Follow the Twistlock documentation.

### Install Defender

During `oc create -f defender.yaml` in Step 2, you'll get Errors when creating the Cluster Role and Cluster Role Binding.
You can ignore them.

Defenders will be deployed only on compute nodes. You don't have to limit them with a node selector.
