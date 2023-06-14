---
title: Secure access to a managed HSM - Azure Key Vault Managed HSM
description: Learn how to secure access to Managed HSM using Azure RBAC and Managed HSM local RBAC
services: key-vault
author: mbaldwin
tags: azure-resource-manager
ms.custom: devx-track-azurecli

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 11/14/2022
ms.author: mbaldwin
# Customer intent: As a managed HSM administrator, I want to set access control and configure the Managed HSM, so that I can ensure it's secure and auditors can properly monitor all activities for this Managed HSM.
---

# Secure access to your managed HSMs

Azure Key Vault Managed HSM is a cloud service that safeguards encryption keys. Because this data is sensitive and business critical, you need to secure access to your managed HSMs by allowing only authorized applications and users to access it. This article provides an overview of the Managed HSM access control model. It explains authentication and authorization, and describes how to secure access to your managed HSMs.

This tutorial will walk you through a simple example that shows how to achieve separation of duties and access control using Azure RBAC and Managed HSM local RBAC. See [Managed HSM access control](access-control.md) to learn about Managed HSM access control model.

## Prerequisites

To complete the steps in this article, you must have the following items:

* A subscription to Microsoft Azure. If you don't have one, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial).
* The Azure CLI version 2.25.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).
* A managed HSM in your subscription. See [Quickstart: Provision and activate a managed HSM using Azure CLI](quick-create-cli.md) to provision and activate a managed HSM.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Sign in to Azure

To sign in to Azure using the CLI you can type:

```azurecli
az login
```

For more information on login options via the CLI, see [sign in with Azure CLI](/cli/azure/authenticate-azure-cli)

## Example

In this example, we're developing an application that uses an RSA 2,048-bit key for sign operations. Our application runs in an Azure virtual machine (VM) with a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md). Both the RSA key used for signing is stored in our managed HSM.

We have identified following roles who manage, deploy, and audit our application:

- **Security team**: IT staff from the office of the CSO (Chief Security Officer) or similar contributors. The security team is responsible for the proper safekeeping of keys. The keys RSA or EC keys for signing, and RSA or AES keys for data encryption.
- **Developers and operators**: The staff who develop the application and deploy it in Azure. The members of this team aren't part of the security staff. They shouldn't have access to sensitive data like RSA keys. Only the application that they deploy should have access to this sensitive data.
- **Auditors**: This role is for contributors who aren't members of the development or general IT staff. They review the use and maintenance of certificates, keys, and secrets to ensure compliance with security standards.

There's another role that's outside the scope of our application: the subscription (or resource group) administrator. The subscription admin sets up initial access permissions for the security team. They grant access to the security team by using a resource group that has the resources required by the application.

We need to authorize the following operations for our roles:

**Security team**
- Create the managed HSM.
- Download the managed HSM security domain (for disaster recovery)
- Turn on logging.
- Generate or import keys
- Create the managed HSM backups for disaster recovery.
- Set Managed HSM local RBAC to grant permissions to users and applications for specific operations.
- Roll the keys periodically.

**Developers and operators**
- Get reference (key URI) from the security team the RSA key used for signing.
- Develop and deploy the application that accesses the key programmatically.

**Auditors**
- Review keys expiry dates to ensure keys are up-to-date
- Monitor role assignments to ensure keys can only be accessed by authorized users/applications
- Review the managed HSM logs to confirm proper use of keys in compliance with data security standards.

The following table summarizes the role assignments to teams and resources to access the managed HSM.

| Role | Management plane role | Data plane role |
| --- | --- | --- |
| Security team | Managed HSM Contributor | Managed HSM Administrator |
| Developers and operators | None | None |
| Auditors | None | Managed HSM Crypto Auditor |
| Managed identify of the VM used by the Application| None | Managed HSM Crypto User |
| Managed identity of the Storage account used by the Application| None| Managed HSM Service Encryption |

The three team roles need access to other resources along with managed HSM permissions. To deploy VMs (or the Web Apps feature of Azure App Service), developers and operators need `Contributor` access to those resource types. Auditors need read access to the Storage account where the managed HSM logs are stored.

To assign management plane roles (Azure RBAC) you can use Azure portal or any of the other management interfaces such as Azure CLI or Azure PowerShell. To assign managed HSM data plane roles you must use Azure CLI.

The Azure CLI snippets in this section are built with the following assumptions:

- The Azure Active Directory administrator has created security groups to represent the three roles: Contoso Security Team, Contoso App DevOps, and Contoso App Auditors. The admin has added users to their respective groups.
- All resources are located in the **ContosoAppRG** resource group.
- The managed HSM logs are stored in the **contosologstorage** storage account.
- The **ContosoMHSM** managed HSM and the **contosologstorage** storage account are in the same Azure location.

The subscription admin assigns the `Managed HSM Contributor`role to the security team. This role allows the security team to manage existing managed HSMs and create new ones. If there are existing managed HSMs, they will need to be assigned the "Managed HSM Administrator" role to be able to manage them.

```azurecli-interactive
# This role assignment allows Contoso Security Team to create new Managed HSMs
az role assignment create --assignee-object-id $(az ad group show -g 'Contoso Security Team' --query 'id' -o tsv) --assignee-principal-type Group --role "Managed HSM Contributor"

# This role assignment allows Contoso Security Team to become administrator of existing managed HSM
az keyvault role assignment create  --hsm-name ContosoMHSM --assignee $(az ad group show -g 'Contoso Security Team' --query 'id' -o tsv) --scope / --role "Managed HSM Administrator"
```

The security team sets up logging and assigns roles to auditors and the VM application.

```azurecli-interactive
# Enable logging
hsmresource=$(az keyvault show --hsm-name ContosoMHSM --query id -o tsv)
storageresource=$(az storage account show --name contosologstorage --query id -o tsv)
az monitor diagnostic-settings create --name MHSM-Diagnostics --resource $hsmresource --logs    '[{"category": "AuditEvent","enabled": true}]' --storage-account $storageresource

# Assign the "Crypto Auditor" role to Contoso App Auditors group. It only allows them to read.
az keyvault role assignment create  --hsm-name ContosoMHSM --assignee $(az ad group show -g 'Contoso App Auditors' --query 'objectId' -o tsv) --scope / --role "Managed HSM Crypto Auditor"

# Grant the "Crypto User" role to the VM's managed identity. It allows to create and use keys. 
# However it cannot permanently delete (purge) keys
az keyvault role assignment create  --hsm-name ContosoMHSM --assignee $(az vm identity show --name "vmname" --resource-group "ContosoAppRG" --query objectId -o tsv) --scope / --role "Managed HSM Crypto Auditor"

# Assign "Managed HSM Crypto Service Encryption User" role to the Storage account ID
storage_account_principal=$(az storage account show --id $storageresource --query identity.principalId -o tsv)
# (if no identity exists), then assign a new one
[ "$storage_account_principal" ] || storage_account_principal=$(az storage account update --assign-identity --id $storageresource)

az keyvault role assignment create --hsm-name ContosoMHSM --role "Managed HSM Crypto Service Encryption User" --assignee $storage_account_principal
```

This tutorial only shows actions relevant to the access control for most part. Other actions and operations related to deploying application in your VM, turning on encryption with customer managed key for a storage account, creating managed HSM are not shown here to keep the example focused on access control and role management.

Our example describes a simple scenario. Real-life scenarios can be more complex. You can adjust permissions to your key vault based on your needs. We assumed the security team provides the key and secret references (URIs and thumbprints), which are used by the DevOps staff in their applications. Developers and operators don't require any data plane access. We focused on how to secure your key vault. Give similar consideration when you secure [your VMs](https://azure.microsoft.com/services/virtual-machines/security/), [storage accounts](../../storage/blobs/security-recommendations.md), and other Azure resources.

## Resources

- [Azure RBAC documentation](../../role-based-access-control/overview.md)
- [Azure RBAC: Built-in roles](../../role-based-access-control/built-in-roles.md)
- [Manage Azure RBAC with Azure CLI](../../role-based-access-control/role-assignments-cli.md)

## Next steps

For a getting-started tutorial for an administrator, see [What is Managed HSM?](overview.md).

For more information about usage logging for Managed HSM logging, see [Managed HSM logging](logging.md).
