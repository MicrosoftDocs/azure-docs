---
title: Create User Managed Identity
description: Create User Managed Identity
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Create a User Assigned Managed Identity

## Create from the Service Catalog (faster)
1. Deploy a managed identity from the service catalog `Common Dependencies` template.

## Create from the Portal
1. From the portal, type "Managed Identity" in the search bar at the top of the Portal.
2. Select "Managed Identities"
3. Select "Create"
4. Enter the Workload Resource Group (RG) or RG where you would like to store the Managed Identity resource
<IMG  src="https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/media/how-manage-user-assigned-managed-identities/create-user-assigned-managed-identity-portal.png"  alt="Screenshot that shows the Create User Assigned Managed Identity pane."/>
5. Confirm the Region and enter a name for the Managed Identity resource.
6. Select "Review + Create" and then select "Create"
7. Finally, copy the Managed Identity name into the Service Catalog deployment parameter or temporarily paste into notepad for use during deployment.

# Assign Role to Managed Identity
1. From the Portal, navigate to the Managed Identity created in the step above.
2. Select the Azure Role Assignments blade.
3. Select "+Add Role Assignment"
4. For "Scope" select "Key Vault"
5. Confirm the subscription
6. For "Resource" enter the name of the Key Vault. The enclave key vault is a good default KV to use and is located in the RG hosting the enclave resources which contains "...HostedResources..." in the RG name.
7. If the Key Vault is using RBAC, then select the "Key Vault Crypto Service Encryption User" role

Read More:
1. [How to create a user assigned managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp)
2. [Manage User Assigned Identity](https://learn.microsoft.com/en-us/azure/operator-service-manager/how-to-create-user-assigned-managed-identity)
