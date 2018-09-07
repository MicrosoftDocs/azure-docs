---
title: Validate software updates from Microsoft in Azure Stack validation as a service | Microsoft Docs
description: Learn how to validate software updates from Microsoft with validation as a service.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 07/24/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Validate software updates from Microsoft

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Microsoft will periodically release updates to the Azure Stack software. These updates are provided to Azure Stack co-engineering partners in advance of being made publicly available so that they can validate the updates against their solutions and provide feedback to Microsoft.

## Test an existing solution

1. Sign in to the [validation portal](https://azurestackvalidation.com).

2. Select an existing solution where the updated from Microsoft has been deployed and select **Start** on the **Package Validation** tile.

    ![Package Validation](media/image3.png)

3. Enter the validation name.

4. Enter the URL to the OEM package that was installed on the solution at deployment time. Use the URL for the package stored on the Azure blob service. For more information, see [Create an Azure storage blob to store logs](azure-stack-vaas-set-up-account.md#create-an-azure-storage-blob-to-store-logs).

5. Select **Upload** to add your deployment configuration file. Refer to the [Validating a New Azure Stack Solution](azure-stack-vaas-validate-solution-new.md) for information on uploading your deployment configuration file.

6. The deployment configuration file must then be customized with the correct environment parameters file, see [Environment parameters](azure-stack-vaas-parameters.md#environment-parameters) for additional details.

    > [!Note]   
    > The deployment configuration file can be further customized by adding common test parameters. For more information, see [Workflow common parameters for Azure Stack validation as a service](azure-stack-vaas-parameters.md)

7. The user name and password for the tenant user, service admin, and cloud admin must be entered manually.

8. Provide the URL to the Azure Storage blob to store the diagnostic logs. For more information, see [Create an Azure storage blob to store logs](azure-stack-vaas-set-up-account.md#create-an-azure-storage-blob-to-store-logs).

    > [!Note]  
    > Descriptive tags may be entered to label the workflow.

10. Select **Submit** to save the workflow.

The solution workflow runs for approximately 24 hours. Add a link to or instruction on scheduling the tests. Clear in the tool.

Find more information on monitoring the progress of a validation run, see [Monitor a test ](azure-stack-vaas-monitor-test.md).

## Next steps

- To learn more about [Azure Stack validation as a service](https://docs.microsoft.com/azure/azure-stack/partner).
