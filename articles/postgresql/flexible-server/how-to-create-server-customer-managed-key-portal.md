---
title: Create and manage with data encrypted by customer managed keys using Azure portal
description: Create and manage  Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys using the Azure portal.
author: gennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
---
# Create and manage  Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys (CMK) using  Azure portal

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this article, you learn how to create and manage an Azure Database for PostgreSQL flexible server instance with data  encrypted by customer managed keys using  Azure portal. To learn more about the customer managed keys (CMK) feature with Azure Database for PostgreSQL flexible server, see the [overview](concepts-data-encryption.md).

## Set up customer managed key during server creation
Prerequisites:

- Microsoft Entra user managed identity in the region where the Azure Database for PostgreSQL flexible server instance will be created. Follow this [tutorial](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md) to create identity.

- Key Vault with key in region where the Azure Database for PostgreSQL flexible server instance will be created. Follow this [tutorial](../../key-vault/general/quick-create-portal.md) to create Key Vault and generate key. Follow [requirements section in concepts doc](concepts-data-encryption.md) for required Azure Key Vault settings.

Follow the steps below to enable CMK while creating the Azure Database for PostgreSQL flexible server instance using Azure portal.

1. Navigate to the Azure Database for PostgreSQL flexible server create pane via Azure portal.

2. Provide required information on Basics and Networking tabs.

3. Navigate to Security tab. On the screen, provide Microsoft Entra ID  identity that has access to the Key Vault and Key in Key Vault in the same region where you're creating this server.

4. On Review Summary tab, make sure that you provided correct information in Security section and press Create button.

5. Once it's finished, you should be able to navigate to Data Encryption  screen for the server and update identity or key if necessary.

## Update customer managed key on the CMK enabled Azure Database for PostgreSQL flexible server instance

Prerequisites:

- Microsoft Entra user-managed identity in region where the Azure Database for PostgreSQL flexible server instance will be created. Follow this [tutorial](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md) to create identity.

- Key Vault with key in region where the Azure Database for PostgreSQL flexible server instance will be created. Follow this [tutorial](../../key-vault/general/quick-create-portal.md) to create Key Vault and generate key.

Follow the steps below to update CMK on CMK enabled Azure Database for PostgreSQL flexible server instance using Azure portal:

1. Navigate to the Azure Database for PostgreSQL flexible server create page via the Azure portal.

2. Navigate to Data Encryption screen under Security tab.

3. Select different identity to connect to Azure Key Vault, remembering that this identity needs to have proper access rights to the Key Vault.

4. Select different key by choosing subscription, Key Vault and key from dropdowns provided.

## Next steps

- [Manage an Azure Database for PostgreSQL - Flexible Server instance by using  Azure portal](how-to-manage-server-portal.md)
