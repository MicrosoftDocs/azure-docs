---
title: Manage a Machine Learning workspace | Microsoft Docs
description: Manage access to Azure Machine Learning workspaces, and deploy and manage ML API web services
services: machine-learning
documentationcenter: ''
author: heatherbshapiro
ms.author: hshapiro
manager: hjerez
editor: cgronlun

ms.assetid: daf3d413-7a77-4beb-9a7a-6b4bdf717719
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/27/2017

---
# Manage an Azure Machine Learning workspace

> [!NOTE]
> For information on managing Web services in the Machine Learning Web Services portal, see [Manage a Web service using the Azure Machine Learning Web Services portal](manage-new-webservice.md).
> 
> 

You can manage Machine Learning workspaces in the Azure portal.

[!INCLUDE [machine-learning-free-trial](../../../includes/machine-learning-free-trial.md)]

## Use the Azure portal

To manage a workspace in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/) using an Azure subscription administrator account.
2. In the search box at the top of the page, enter "machine learning workspaces" and then select **Machine Learning Workspaces**.
3. Click the workspace you want to manage.

In addition to the standard resource management information and options available, you can:

- View **Properties** - This page displays the workspace and resource information, and you can change the subscription and resource group that this workspace is connected with.
- **Resync Storage Keys** - The workspace maintains keys to the storage account. If the storage account changes keys, then you can click **Resync keys** to synchronize the keys with the workspace.

To manage the web services associated with this workspace, use the Machine Learning Web Services portal. See [Manage a Web service using the Azure Machine Learning Web Services portal](manage-new-webservice.md) for complete information.

> [!NOTE]
> To deploy or manage New web services you must be assigned a contributor or administrator role on the subscription to which the web service is deployed. If you invite another user to a machine learning workspace, you must assign them to a contributor or administrator role on the subscription before they can deploy or manage web services. 
> 
>For more information on setting access permissions, see [View access assignments for users and groups in the Azure portal](../../active-directory/role-based-access-control-manage-assignments.md).

## Next steps
* Learn more about [deploy Machine Learning with Azure Resource Manager Templates](deploy-with-resource-manager-template.md). 