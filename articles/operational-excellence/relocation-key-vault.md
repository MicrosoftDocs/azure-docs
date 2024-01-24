---
title: Relocation guidance in Azure Key Vault
description: Learn how to relocate Azure Key Vault to a new region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/18/2024
ms.service: microsoft-sentinel
ms.topic: how-to
ms.custom:
  - subject-relocation
---

# Relocation guidance for Azure Key Vault

This article covers relocation guidance for Azure Key Vault across regions. Azure Key Vault does not allow you to move a key vault from one region to another. You can, however, create a key vault in the new region, manually copy each individual key, secret, or certificate from your existing key vault to the new key vault, and then remove the original key vault.

**Azure Resource Mover** doesn't support moving services used by the Azure Key Vault. To see which resources Resource Mover supports, see [What resources can I move across regions?](/azure/resource-mover/overview#what-resources-can-i-move-across-regions).

## Prerequisites

- Identify all Key Vault dependant resources.
- Depending on your Azure Key Vault deployment, the following dependent resources *may* need to be deployed and configured in the target region prior to relocation:
    - [Public IP](/azure/virtual-network/move-across-regions-publicip-portal)
    - [Azure Private Link](./relocation-private-link.md)
    - [Virtual Network](./relocation-virtual-network.md)

- Before you begin to plan your key vault relocation, keep the following considerations in mind:  
    - Key vault names are globally unique. You can't reuse a vault name.
    - You must reconfigure your access policies and network configuration settings in the new key vault.
    - You must reconfigure soft-delete and purge protection in the new key vault.
    - The backup and restore operation won't preserve your autorotation settings. You may need to reconfigure the settings.
    

## Prepare

To get started, export a Resource Manager template. This template contains settings that describe your Automation namespace.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All resources** and then select your Automation resource.
3. Select **Export template**. 
4. Choose **Download** in the **Export template** page.
5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that include the template and scripts to deploy the template.


## Redeploy without data

To relocate a Key Vault instance without that doesn't have any client specific data, you can perform a simple redeployment without data migration. For an example of how to use an ARM template to create a Key Vault instance, see [Key Vault Deployment with ARM - Quickstart templates](/azure/templates/microsoft.KeyVault/2021-06-01-preview/vaults?tabs=json&pivots=deployment-language-arm-template).

>[!TIP]
>You can also create the new key vault by using [Azure portal](../key-vault/general/quick-create-portal.md), the [Azure CLI](../key-vault/general/quick-create-cli.md), or [Azure PowerShell](../key-vault/general/quick-create-powershell.md).


## Redeploy with data

Key Vault supports the following redeployment methods: 

- **Manual:** Azure Portal, Azure PowerShell or Azure CLI
- **Automated:** Azure DevOps Pipelines or GitHub actions

In the diagram below,

- The amber flow lines show **automated** Azure DevOps Pipeline redeployment method. The automated method includes the redeployment of the target instance and the update of dependent configuration and endpoints.
- The red flow lines show the **manual** Azure Portal, Azure PowerShell or Azure CLI redeployment method. The manual method includes the redeployment of the target instance along with data movement and update of dependent configuration and endpoints.

:::image type="content" source="media/relocation/keyvault/akv_pattern_design.png" alt-text="Diagram illustrating usage for Azure DevOps pipeline and usage for Azure Portal or scripts for Key Vault.":::


**To redeploy your Key Vault to another region:**

1. Back up each individual secret, key, and certificate in your vault by using one of the following two methods:
    - **Use encrypted backup**. With the backup command, your secrets are downloaded as an encrypted blob.  For step by step guidance, see [Azure Key Vault backup and restore](../key-vault/general/backup.md).

        >[!IMPORTANT]
        > - You can't back up a key vault in one geography and restore it into another geography. For more information, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/).
        > - The backup command backs up all versions of each secret. If you have a secret with a large number of previous versions (more than 10), the request size might exceed the allowed maximum and the operation might fail.

    - **Use manual non-encrypted backup**. You can export certain secret types manually. For example, you can expert certificates as a PFX file. This option eliminates the geographical restrictions for some secret types, such as certificates. You can then upload the PFX files to any key vault in any region. The secrets are downloaded in a non-password protected format. You are responsible for securing your secrets during the move. To learn how to export certificates from Azure Key Vault see [Export certificates from Azure Key Vault](/azure/key-vault/certificates/how-to-export-certificate?tabs=azure-cli)

1. Redeploy the exported template to the new region by using one of the following methods:

    - Use an ARM template to create a Key Vault instance, see [Key Vault Deployment with ARM - Quickstart templates](/azure/templates/microsoft.KeyVault/2021-06-01-preview/vaults?tabs=json&pivots=deployment-language-arm-template).

    - Use [Azure portal](../key-vault/general/quick-create-portal.md), the [Azure CLI](../key-vault/general/quick-create-cli.md), or [Azure PowerShell](../key-vault/general/quick-create-powershell.md).


1. Restore your exported secret, key, and certificates. If you used **encrypted backup**, add them to your new key vault by following the steps in [Azure Key Vault backup and restore](/azure/key-vault/general/backup?tabs=azure-cli). Otherwise, if you used **manual non-encrypted backup**, you can use [Azure portal](/azure/key-vault/certificates/tutorial-import-certificate?tabs=azure-portal) or [PowerShell](/azure/key-vault/secrets/quick-create-powershell) to import them to your new key vault.

1. Before deleting your old key vault, verify that the new vault contains all of the required keys, secrets, and certificates. Ensure the key vault isn't needed to decrypt old encrypted backups of virtual machines, databases, or any other dependent Azure services in the source region.

## Validate

Once the relocation is complete, the Azure Key Vault needs to be tested and validated. Below are some of the recommended guidelines.

- Run manual or automated smoke and integration tests to ensure that configurations and dependent resources have been properly linked, and that configured data is accessible.
- Test Azure Key Vault components and integration.