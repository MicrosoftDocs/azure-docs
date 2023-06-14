---
title: Create and manage  Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys using  Azure Portal
description: Create and manage  Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys using  Azure Portal
author: gennadNY 
ms.author: gennadyk
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 12/12/2022
---
# Create and manage  Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys (CMK) using  Azure portal

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this article, you learn how to create and manage Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys using  Azure portal. To learn more about Customer Managed Keys (CMK) feature with Azure Database for PostgreSQL - Flexible Server, see the [overview](concepts-data-encryption.md).

## Setup Customer Managed Key during Server Creation
Prerequisites:

- Azure Active Directory (Azure AD) user managed identity in region where Postgres Flex Server will be created. Follow this [tutorial](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md) to create identity.

- Key Vault with key in region where Postgres Flex Server will be created. Follow this [tutorial](../../key-vault/general/quick-create-portal.md) to create Key Vault and generate key. Follow [requirements section in concepts doc](concepts-data-encryption.md) for required Azure Key Vault settings

Follow the steps below to enable CMK while creating Postgres Flexible Server using Azure portal.

1. Navigate to Azure Database for PostgreSQL - Flexible Server create pane via Azure portal

2. Provide required information on Basics and Networking tabs

3. Navigate to Security tab. On the screen, provide Azure Active Directory (Azure AD)  identity that has access to the Key Vault and Key in Key Vault in the same region where you're creating this server

4. On Review Summary tab, make sure that you provided correct information in Security section and press Create button

5. Once it's finished, you should be able to navigate to Data Encryption  screen for the server and update identity or key if necessary

## Update Customer Managed Key on the CMK enabled Flexible Server

Prerequisites:

- Azure Active Directory (Azure AD) user-managed identity in region where Postgres Flex Server will be created. Follow this [tutorial](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md) to create identity.

- Key Vault with key in region where Postgres Flex Server will be created. Follow this [tutorial](../../key-vault/general/quick-create-portal.md) to create Key Vault and generate key.

Follow the steps below to update CMK on CMK enabled Flexible Server using Azure portal:

1. Navigate to Azure Database for PostgreSQL - Flexible Server create a page via the Azure portal.

2. Navigate to Data Encryption screen under Security tab

3. Select different identity to connect to Azure Key Vault, remembering that this identity needs to have proper access rights to the Key Vault

4. Select different key by choosing subscription, Key Vault and key from dropdowns provided.

## Next steps

- [Manage an Azure Database for PostgreSQL - Flexible Server by using  Azure portal](how-to-manage-server-portal.md)