---
title: Uninstall Azure Arc data controller
description: Uninstall Azure Arc data controller
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Uninstall Azure Arc data controller

The following article describes how to uninstall an Azure Arc data controller.

Before you proceed, ensure all the data services that have been deployed on the data controller are removed as follows:

Login to the data controller that you want to delete:

```
azdata login
```
Run the following command to check if there are any SQL managed instances deployed:

```
azdata arc sql mi list
```
For each SQL managed instance from the list above, run the delete command as follows:
```
azdata arc sql mi delete -n <name>
# for example: azdata arc sql mi delete -n sqlinstance1
```

Similarly, to check for PostgreSQL Hyperscale instances, run:

```
azdata arc postgres server list
```

And, for each PostgreSQL Hyperscale instance, run the delete command as follows:
```
azdata arc postgres server delete -n <name>
# for example: azdata arc postgres server delete -n pg1
```

After all the SQL managed instances and PostgreSQL Hyperscale instances have been removed, the data controller can be uninstalled as follows:

```
azdata arc dc delete -n <name> -ns <namespace>
# for example: azdata arc dc delete -ns arc -n arcdc
```
### Remove SCCs (Red Hat OpenShift only)

```console
oc adm policy remove-scc-from-user privileged -z default -n arc
oc adm policy remove-scc-from-user anyuid     -z default -n arc
```

### Optionally, delete the Azure Arc data controller namespace


```console
kubectl delete ns <nameSpecifiedDuringCreation>
# for example kubectl delete ns arc
```


