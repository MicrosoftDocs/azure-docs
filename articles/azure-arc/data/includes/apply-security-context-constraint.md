---
author: MikeRayMSFT
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.topic: include
ms.date: 01/15/2021
ms.author: mikeray
---

This section explains how to apply a security context constraint (SCC). For the preview release, these relax the security constraints. 

1. Download the custom security context constraint (SCC). Use one of the following: 
   - [GitHub](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/yaml/arc-data-scc.yaml) 
   - [Raw](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/arc-data-scc.yaml)
   - `curl`
   
      The following command downloads arc-data-scc.yaml:

      ```console
      curl https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/arc-data-scc.yaml -o arc-data-scc.yaml
      ```

1. Create SCC.

   ```console
   oc create -f arc-data-scc.yaml
   ```

1. Apply the SCC to the service account.

   > [!NOTE]
   > Use the same namespace here and in the `azdata arc dc create` command below. Example is `arc`.

   ```console
   oc adm policy add-scc-to-user arc-data-scc --serviceaccount default --namespace arc
   ```

   > [!NOTE]
   > RedHat OpenShift 4.5 or greater, changes how to apply the SCC to the service account.
   > Use the same namespace here and in the `azdata arc dc create` command below. Example is `arc`. 
   > 
   > If you are using RedHat OpenShift 4.5 or greater, run: 
   >
   >```console
   >oc create rolebinding arc-data-rbac --clusterrole=system:openshift:scc:arc-data-scc --serviceaccount=arc:default
   >```
