---
title: Pacemaker Cluster Azure Fence Agent Deployment
description: Include File for Pacemaker Cluster Azure Fence Agent Deployment
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 08/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---
## Configure Azure Fence Agent 

1. Create Identity
   #### [Managed identity](#tab/msi)
      To create a managed identity (MSI), [create a system-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities?pivots=qs-configure-portal-windows-vm#system-assigned-managed-identity) for each VM in the cluster. User assigned managed identities aren't supported at this time.
   
   #### [Service principal](#tab/spn)
   > [!CAUTION]
   > Service principal-based authentication relies on a static secret, which adds credential management overhead and increases security risk. We recommend the use of managed identity for fence agent.
   
   1. [Create an application][azdoc-entra-spn-create]
      - Note the client ID for later use.
   1. [Add a client secret][azdoc-entra-spn-addsecret]
      - Securely store your client secret for later use.
   

1. Create a custom role.

   Your identity needs permissions through Azure RBAC to perform fencing actions against your VMs. To comply with the Least Privileged Access (LPA) Security Model, [create a custom RBAC role][azdoc-rbac-customrole-create].
   
   Use the following definition for your role, replacing your Subscription ID(s) where needed: 

   ```json
   {
         "Name": "Linux Fence Agent",
         "description": "Allowed to power-off and start virtual machines",
         "assignableScopes": [
                 "/subscriptions/<Subscription 1 ID (GUID)>",
                 "/subscriptions/<Subscription N ID (GUID)>"
         ],
         "actions": [
                 "Microsoft.Compute/*/read",
                 "Microsoft.Compute/virtualMachines/powerOff/action",
                 "Microsoft.Compute/virtualMachines/start/action"
         ],
         "notActions": [],
         "dataActions": [],
         "notDataActions": []
   }
   ```

1. Assign the custom role to your identities.

   #### [Managed identity](#tab/msi)
   
   For each VM in your cluster, assign its managed identity to the custom "Linux Fence Agent" role for every VM in the cluster, including itself. For detailed steps, see [Assign a managed identity access to a resource by using the Azure portal][azdoc-entra-mi-assignment].
   
   > [!IMPORTANT]
   > Be aware that the assignment and removal of authorization with managed identities [can be delayed][azdoc-entra-mi-limits] until effective.
   
   #### [Service principal](#tab/spn)
   
   For each VM in your cluster, assign your service principal the custom role you created. For more information, see [Assign Azure roles by using the Azure portal][azdoc-rbac-portal-assignment].


[azdoc-entra-mi-assignment]: /entra/identity/managed-identities-azure-resources/grant-managed-identity-resource-access-azure-portal
[azdoc-entra-mi-limits]: /entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations#limitation-of-using-managed-identities-for-authorization
[azdoc-rbac-portal-assignment]: /azure/role-based-access-control/role-assignments-portal
[azdoc-rbac-customrole-create]: /azure/role-based-access-control/custom-roles-portal
[azdoc-entra-spn-create]: /entra/identity-platform/quickstart-register-app
[azdoc-entra-spn-addsecret]: /entra/identity-platform/how-to-add-credentials?tabs=client-secret