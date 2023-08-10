---
title: Cross-tenant connections to Azure DevOps
description: Learn how to configure connections to Azure DevOps in another tenant in Azure Data Factory
ms.service: data-factory
ms.subservice: ci-cd
author: nabhishek
ms.author: abnarain
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 04/12/2023
---

# Cross-tenant connections to Azure DevOps

This document covers a step-by-step guide for configuring Azure DevOps account in another tenant than the Azure Data Factory.  This is useful for when your Azure DevOps is not in the same tenant as the Azure Data Factory.

:::image type="content" source="media/cross-tenant-connections-to-azure-devops/cross-tenant-architecture-diagram.png" alt-text="Shows an architectural diagram of a connection from Azure Data Factory to Azure DevOps in another tenant.":::

## Prerequisites

- You need to have an Azure DevOps account in another tenant than your Azure Data Factory. 
- You should have a project in the above Azure DevOps tenant. 

## Step-by-step guide

1. Navigate in Azure Data Factory studio to _Manage hub_ &#8594; _Git configuration_ &#8594; _Configure_.

   :::image type="content" source="media/cross-tenant-connections-to-azure-devops/configure-git.png" alt-text="Shows the Azure Data Factory Studio with the Git configuration blade selected.":::   

1. Select the _Cross tenant sign in_ option.

   :::image type="content" source="media/cross-tenant-connections-to-azure-devops/cross-tenant-sign-in.png" alt-text="Shows the repository configuration dialog with cross tenant sign in checked.":::

1. Select **OK** in the _Cross tenant sign in_ dialog.

   :::image type="content" source="media/cross-tenant-connections-to-azure-devops/cross-tenant-sign-in-confirm.png" alt-text="Shows the confirmation dialog for cross tenant sign in.":::

1. Choose a different account to login to Azure DevOps in the remote tenant.

   :::image type="content" source="media/cross-tenant-connections-to-azure-devops/use-another-account.png" alt-text="Shows the account selection dialog for choosing an account to connect to the remote Azure DevOps tenant.":::

1. After signing in, choose the directory.

   :::image type="content" source="media/cross-tenant-connections-to-azure-devops/choose-directory.png" alt-text="Shows the repository configuration dialog with the directory selection dropdown highlighted.":::

1. Choose the repository and configure it accordingly.

   :::image type="content" source="media/cross-tenant-connections-to-azure-devops/configure-repository.png" alt-text="Shows the repository configuration dialog.":::

## Appendix

While opening the Azure Data Factory in another tab or a new browser, use the first sign-in to log into to your Azure Data Factory user account.

You should see a dialog with the message _You do not have access to the VSTS repo associated with this factory._  Click **OK** to sign in with the cross-tenant account to gain access to Git through the Azure Data Factory.

:::image type="content" source="media/cross-tenant-connections-to-azure-devops/sign-in-with-account-with-repository-access.png" alt-text="Shows the sign-in prompt to associate a VSTS repo with a cross-tenant Azure Data Factory.":::
