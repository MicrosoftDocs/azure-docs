---
title: Retrieve legacy and private workbooks
description: Learn how to retrieve deprecated legacy and private Azure workbooks.
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 09/08/2022
---

# Retrieve legacy Application Insights workbooks
Application Insights Workbooks, also known as "Legacy Workbooks", are stored as a different Azure resource type than all other Azure Workbooks. These different Azure resource types are now being merged one single standard type. This will allow it to take advantage of all the existing and new functionality available in standard Azure Workbooks. For example:

* Converted legacy workbooks can be queried via Azure Resource Graph (ARG), and show up in other standard Azure views of resources in a resource group or subscription.
* Converted legacy workbooks can support top level ARM features like other resource types, including, but not limited to:
    * Tags
    * Policies
    * Activity Log / Change Tracking
    * Resource locks
* Converted legacy workbooks can support [ARM templates](workbooks-automate.md). 
* Converted legacy workbooks can support the [BYOS](workbooks-bring-your-own-storage.md)feature
* Converted legacy workbooks can be saved in region of your choice.

The legacy workbook deprecation will not change where you find your workbooks in the Azure Portal. They will still be visible under Application Insights --> Workbooks, and will not affect the content of your workbook. 

Note: 

1. After April 15 2021, you will not be able to save legacy workbooks.
1. Use `Save as` on a legacy workbook to create a standard Azure workbook.
1. Any new workbook you create will be a standard workbook.


## Convert legacy Application Insights workbooks
1. Identify legacy workbooks. In the gallery view, legacy workbooks have a warning icon and When you open a legacy workbook, there is a banner. 

        ![Icons showing warning](../Images/LegacyWarning.png)
    
        ![Banner](../Images/LegacyWarning.png)
    
2. Convert Legacy Workbooks

    * For any legacy workbook you want to keep after June 30 2021,

        1. Open the workbook, from the toolbar select `Edit`, then `Save As`. 
        2. Enter workbook name 
        3. Select a subscription, resource group, and region where you have write access.

    * If the Legacy Workbook uses links to other Legacy Workbooks, or loading workbook content in groups, those items will need to be updated to point to the newly saved workbook.

    * After using save as, you can delete the Legacy Workbook, or update its contents to be a link to the newly saved Workbook.

3. Verify Permissions
For Legacy Workbooks, the ability to see or create workbooks were based on the Application Insights specific roles, like Application Insights Contributor.

For Workbooks, verify that users have the appropriate standard Monitoring Reader/Contributor or Workbook Reader/Contributor roles so that they can see and create Workbooks in the appropriate resource groups.

See [access control](workbooks-overview.md#access-control) for more details.

## Why isn't there an automatic conversion?
1. The write permissions for legacy workbooks are only based on Azure role based access control on the Application Insights resource itself. A user may not be allowed to create new workbooks in that resource group, so if they were auto migrated, they could fail to be moved, OR they could be created but then a user might not be able to delete them after the fact.
2. Legacy workbooks support "My" (private) workbooks, which has been phased out of Azure Workbooks. A migration would cause those private workbooks to become publicly visible to users with read access to that same resource group.
3. Usage of links/group content loaded from saved Legacy workbooks would become broken. Authors will need to manually update these links to point to the new saved items.

For these reasons, we suggest that users manually migrate the workbooks they want to keep.

After deprecation of the legacy workbooks, you will still be able to retrieve the content of Legacy Workbooks for a limited time by using Azure CLI or PowerShell tools, to query `microsoft.insights/components/[name]/favorites` for the specific resource using `api-version=2015-05-01`. 

# Retrieve deprecated legacy and private workbooks

Private and Legacy workbooks have been deprecated and are not accessible from the Azure Portal. If you are looking for the deprecated workbook that you forgot to convert before the deadline, you can use this process to retrieve the content of your old workbook and load it into a new workbook.

This tool will only be available for a limited time.

## Retrieve a private workbook

1. Open up a new or empty workbook
2. Go into Edit mode in the toolbar and navigate to the advanced editor
  ![advanced editor](../Images/DeprecatedWb_RetrievalTool_AdvancedEditor.png)
3. Copy the following (raw) workbook json and paste it into your open advanced editor: [Private Workbook Conversion](./PrivateWorkbookConversion.workbook)
4. Click Apply at the top right
5. Select the subscription and resource group and category of the workbook you'd like to retrieve. 
6. The grid at the bottom of this workbook will list all the private workbooks in the selected subscription / resource group above.
7. Click on one of the workbooks in the grid. Your workbook should look something like this:
  ![advanced editor](../Images/DeprecatedWb_RetrievalTool_PrivateWbConversion.png)
8. Click the button at the bottom of the workbook labeled "Open Content as Workbook"
9. A new workbook view will appear with the content of the old private workbook that you selected. In that view you can save this as a standard Workbook.
10. Links to the deprecated workbook (or its contents), including dashboard pins and URL links, will need to be re-established with the newly created workbook in step 9.

## Retrieve a favorites- based (Legacy) workbook
 
1. Navigate to your Application Insights Resource > Workbooks gallery
2. Open up a new or empty workbook
3. Click Edit in the toolbar and navigate to the advanced editor
  ![advanced editor](../Images/DeprecatedWb_RetrievalTool_AdvancedEditor.png)
4. Copy the following (raw) workbook json and paste it into your open advanced editor: [Legacy Workbook Conversion](./LegacyWorkbookConversion.workbook)
5. Click Apply at the top right
6. The grid at the bottom of this workbook will list all the legacy workbooks within the current AppInsights resource.
7. Click on one of the workbooks in the grid. Your workbook should now look something like this:
  ![advanced editor](../Images/DeprecatedWb_RetrievalTool_LegacyWbConversion.png)
8. Click the button at the bottom of the workbook labeled "Open Content as Workbook"
9. A new workbook view will appear with the content of the old legacy workbook that you selected. In that view you can save this as a standard Workbook.
10. Links to the deprecated workbook (or its contents), including dashboard pins and URL links, will need to be re-established with the newly created workbook in step 9.
FooterMicrosoft Open