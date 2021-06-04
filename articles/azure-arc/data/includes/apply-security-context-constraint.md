---

ms.service: azure-arc
ms.subservice: azure-arc-data
ms.topic: include
ms.date: 03/02/2021
ms.author: dinethi
author: dnethi
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

1. Download the YAML file containing the role and role bindings. Use one of the following: 
   - [GitHub](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/yaml/arc-data-scc-role-rolebinding.yaml) 
   - [Raw](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/arc-data-scc-role-rolebinding.yaml)
   - `curl`
   
      The following command downloads arc-data-scc-role-rolebinding.yaml:

      ```console
      curl https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/arc-data-scc-role-rolebinding.yaml -o arc-data-scc-role-rolebinding.yaml
      ```

1. Create the Role & Role Bindings that grants permissions on the SCC to the service account(s).

   > [!NOTE]
   > Use the same namespace here and in the `azdata arc dc create` command below. Example is `arc`.

   ```console
   oc create -f arc-data-scc-role-rolebinding.yaml
   ```
