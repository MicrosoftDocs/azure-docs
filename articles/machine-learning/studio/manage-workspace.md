---
title: Manage workspaces
titleSuffix: ML Studio (classic) - Azure
description: Manage access to Azure Machine Learning Studio (classic) workspaces, and deploy and manage Machine Learning API web services
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: likebupt
ms.author: keli19
ms.custom: previous-author=heatherbshapiro, previous-ms.author=hshapiro
ms.date: 02/27/2017
---
# Manage an Azure Machine Learning Studio (classic) workspace

> [!NOTE]
> For information on managing Web services in the Machine Learning Web Services portal, see [Manage a Web service using the Azure Machine Learning Web Services portal](manage-new-webservice.md).
> 
> 

You can manage Machine Learning Studio (classic) workspaces in the Azure portal.



## Use the Azure portal

To manage a Studio (classic) workspace in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/) using an Azure subscription administrator account.
2. In the search box at the top of the page, enter "machine learning Studio (classic) workspaces" and then select **Machine Learning Studio (classic) workspaces**.
3. Click the workspace you want to manage.

In addition to the standard resource management information and options available, you can:

- View **Properties** - This page displays the workspace and resource information, and you can change the subscription and resource group that this workspace is connected with.
- **Resync Storage Keys** - The workspace maintains keys to the storage account. If the storage account changes keys, then you can click **Resync keys** to synchronize the keys with the workspace.

To manage the web services associated with this Studio (classic) workspace, use the Machine Learning Web Services portal. See [Manage a Web service using the Azure Machine Learning Web Services portal](manage-new-webservice.md) for complete information.

> [!NOTE]
> To deploy or manage New web services you must be assigned a contributor or administrator role on the subscription to which the web service is deployed. If you invite another user to a machine learning Studio (classic) workspace, you must assign them to a contributor or administrator role on the subscription before they can deploy or manage web services. 
> 
>For more information on setting access permissions, see [Manage access using RBAC and the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Next steps
* Learn more about [deploy Machine Learning with Azure Resource Manager Templates](deploy-with-resource-manager-template.md). 
