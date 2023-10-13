---
title: Troubleshoot common issues during discovery and assessment of Spring Boot apps
description: Learn how to troubleshoot Azure Spring Apps issues in Azure Migrate
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: tutorial
ms.date: 09/28/2023
ms.custom: engagement-fy23
---


# Troubleshoot common issues during discovery and assessment of Spring Boot apps (preview)

For errors related to the access policy on the Key Vault, follow these steps to find the Principal ID of the appliance extension running on the connected cluster. 

## Assigning required Key Vault permissions to Migrate appliance extension 
 
1.	Go to your Azure Migrate project. 
2.	Navigate to Azure Migrate: Discovery and assessment> **Overview** > **Manage** > **Appliances** and find the name of the Kubernetes-based appliance whose service principal you need to find. 
 
3.	You can also find the Key Vault associated with the appliance by selecting the appliance name and finding the Key Vault name in appliance properties. 
4.	Go to your workstation and open PowerShell as an administrator.
5.	Install the [ARM Client](https://github.com/projectkudu/ARMClient/releases/download/v1.9/ARMClient.zip) zip folder.
6.	Unzip the folder and on a PowerShell window, switch to the directory with the extracted folder. 
7.	Run the following command to sign in to your Azure subscription:  `armclient login` 
8.	After successfully signing in, run the following command by adding the appliance name: 
 
```
armclient get /subscriptions/<subscription>/resourceGroups/<resourceGroup> /providers/Microsoft.Kubernetes/connectedClusters/<applianceName>/Providers/Microsoft.KubernetesConfiguration/extensions/credential-sync-agent?api-version=2022-03-01
```

9. The response lists down the identity associated with the Appliance extension. Note down the `Principal ID` field in the response under the`identity` section. 
10.	Go to Azure portal and check if the Principal ID has the required access on the Azure Key Vault, chosen for secret processing. 
11.	Go to the Key Vault, go to access policies, select the Principal ID from list and check the permissions it has OR create a new access policy specifically for the Principal ID you found by running the command. 
12.	Ensure that following permissions are assigned to the Principal ID: *Secret permission* and both *Secret Management Operations and Privileged Management Operations*.

**Error Code** | **Action**
---- | ----
**404** | Check if the credentials exist on the Key Vault. Ensure that the extension identity for <Microsoft.ConnectedCredentials> has required permissions to delete the credentials from the Key Vault.
**406** | Ensure that the extension identity for <Microsoft.ConnectedCredentials> has the required permissions to access the credentials on the Key Vault.
**407**	| Check the firewall rules on the Key Vault, allow access from the appliance IP address and retry the operation.
**413**	| Ensure that the Key Vault is accessible from the appliance on-premises and the extension identity for <Microsoft.ConnectedCredentials> has required permissions to perform operations on secrets stored in Key Vault. 
**415**	| Ensure that the extension identity for <Microsoft.ConnectedCredentials> has required permissions to access the credentials on the Key Vault.
**416**	| Check if the credentials exist on the Key Vault. Ensure that the extension identity for <Microsoft.ConnectedCredentials> has purge permissions on the Key Vault. 
**418**	| Check if the credentials exist on the Key Vault. Ensure that the extension identity for <Microsoft.ConnectedCredentials> has required permissions to delete the credentials from Key Vault. 

## Operator error
**Error code** | **Error Message** | **Possible Causes**| **Remediation**
---- | ----| ---- | ----
400	| An internal error occurred. | The operation failed due to an unhandled error. | Retry the operation. If the issue persists, contact Support.
401	| An attempt to update the resource specification faulted. | The operator service account may not have permissions to modify the custom resource. | Review permissions granted to the operator service account making sure it has privileges to update the custom resource, and retry the operation.
402	| The transfer mode provided is not valid or supported. | The transfer mode used during credential resource creation isn't supported. |	Review the transfer mode ensuring it is valid and supported, and retry the operation.
403	| Failed to save credentials on the Kubernetes-based appliance.	The service account `connectedcredentials-sa` of the appliance operator <Microsoft.ConnectedCredentials>  may not have required permissions to save credentials on the Kubernetes cluster. | Retry the operation after granting the required access to the appliance operator service account. 
404	| Failed to delete credentials from Key Vault (after syncing them to on-premises appliance).| The extension identity for <Microsoft.ConnectedCredentials>  may not have required permissions to delete the credentials from Key Vault. | Check if the credentials exist on the Key Vault. Ensure that the extension identity for <Microsoft.ConnectedCredentials>  has required permissions to delete the credentials from Key Vault.
405	| Failed to access the secret on the Key Vault. | The Key Vault cannot be found as it may have been deleted.	Check if the Key Vault exists. If it exists, retry the operation after some time, else recreate a Key Vault with the same name and in the same Subscription and Resource Group as that of the Azure Migrate project.
406	| Failed to access the secret on the Key Vault. The extension identity for <Microsoft.ConnectedCredentials> may not have required permissions to access the credentials on the Key Vault. | Ensure that the extension identity for <Microsoft.ConnectedCredentials> has required permissions to access the credentials on the Key Vault.
407	| Failed to connect with the endpoint of Key Vault.	| The firewall rules associated with the Key Vault may be restricting access. | Check the firewall rules on the Key Vault, allow access from the appliance IP address and retry the operation.
408	| Failed to access secret on Key Vault due to a conflicting operation.|	The secret was modified by another operation causing a conflict in accessing the secret.| Ensure no other appliance extension on a different Kubernetes cluster is accessing secrets on the same Key Vault.
409	| An attempt to access the secret on the Key Vault faulted because of the unsupported region. |	Unsupported region.	| Ensure the region is supported by the Key Vault, and retry the operation.
410	| An attempt to access the secret faulted because of unsupported SKU. | Unsupported SKU. |	Ensure the SKU is supported by the Key Vault and is valid, and retry the operation.
411	| An attempt to access the secret faulted because the resource group is found to be missing.|Resource group is deleted.  | Ensure the resource group exists and is valid, and retry the operation.
412	| An attempt to access the secret faulted because the access was denied. | The Certificate associated with the extension's identity is expired. | NA
413	| Failed to access the secret on Key Vault due to an unknown error.	| Key Vault access policies and network access rules are not configured properly.| The Key Vault access or network policies may not be configured properly.	Ensure that the Key Vault is accessible from the appliance on-premises and the extension identity for <Microsoft.ConnectedCredentials> has required permissions to perform operations on secrets stored in Key Vault.
414	| Failed to access the secret on Key Vault as it could not be found. | The secret may have been deleted while the operation was in progress. | Check if the secret exists in the Key Vault. If it does not exist, delete the existing credentials, and add it again.
415 | Failed to access the secret on the Key Vault. | The extension identity for <Microsoft.ConnectedCredentials> may not have required permissions to access the credentials on the Key Vault. | Ensure that the extension identity for Microsoft.ConnectedCredentials has required permissions to access the credentials on the Key Vault. 
416	| Failed to delete credentials from Key Vault (after syncing them to on-premises appliance). | The extension identity for <Microsoft.ConnectedCredentials> may not have required permissions to delete the credentials from Key Vault. | Check if the credentials exist on the Key Vault. Ensure that the extension identity for <Microsoft.ConnectedCredentials> has purge permissions on the Key Vault. | If the Key Vault has been enabled with purge protection, secret will be automatically cleaned up after the purge protection window. 
417 | Failed to access the secret on the Key Vault. | The Key Vault cannot be found as it may have been deleted.| Check if the Key Vault exists. If it exists, then retry the operation after some time, else recreate a Key Vault with the same name and in the same Subscription and Resource Group as that of the Azure Migrate project.
418	| Failed to purge a deleted secret from the Key Vault. | The secret delete operation may not have completed.	Check if the credentials exist on the Key Vault. Ensure that the extension identity for <Microsoft.ConnectedCredentials> has required permissions to delete the credentials from Key Vault.


## Next steps
Set up an appliance for [VMware](how-to-set-up-appliance-vmware.md), [Hyper-V](how-to-set-up-appliance-hyper-v.md), or [physical servers](how-to-set-up-appliance-physical.md).

