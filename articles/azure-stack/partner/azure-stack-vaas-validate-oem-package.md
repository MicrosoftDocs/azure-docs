---
title: Validate original equipment manufacturer (OEM) packages  in Azure Stack validation as a service | Microsoft Docs
description: Learn how to check original equipment manufacturer (OEM) packages with validation as a service.
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

# Validate OEM packages

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

You can test a new OEM package when there has been a change to the firmware or drivers for a completed solution validation. When your package has passed the test, it is signed by Microsoft. Your test must contain the updated OEM extension package with the drivers and firmware that have passed Windows Server logo and PCS tests.

All tests finish within 24 hours with result of **succeeded**. If any of the tests have a result of **failed**, file a bug in [Microsoft Collaborate](https://aka.ms/collaborate) and notify Microsoft by sending an email to [vaashelp@microsoft.com](mailto:vaashelp@microsoft.com).

## Get your OEM package signed

1. Ensure that the current monthly update has been applied. For the latest version, see the most recent version in [Azure Stack Operator Documentation > Overview > Release notes](https://docs.microsoft.com/azure/azure-stack/) .

    Microsoft software updates to Azure Stack are designated using a naming convention, for example, 1803 indicating the update is for March 2018. For information about the Azure Stack update policy, cadence and release notes are available, see [Azure Stack servicing policy](https://docs.microsoft.com/azure/azure-stack/azure-stack-servicing-policy).

1. Check system health status by running **Test-AzureStack** as described in [Run a validation test for Azure Stack. Fix any warnings and errors before launching any tests.

2. In the [validation portal](https://azurestackvalidation.com), select an existing solution. If you have not added your solution, see [Add a new solution](azure-stack-vaas-validate-solution-new.md#add-a-new-solution).

3. Select **Start** on the **Package Validations** tile to start a new workflow.

    ![Package Validations](media/image3.png)

4.  Provide a diagnostics connection string. For instructions, see [Set up a storage account](azure-stack-vaas-set-up-account.md).

    An OEM Extension package must be specified for every Package Validation run. Specify the OEM package that was installed on the solution at the time of Azure Stack deployment. For instructions, see [Create an Azure storage blob to store logs](azure-stack-vaas-set-up-account.md#create-an-azure-storage-blob-to-store-logs).

    A JSON file with the environment variables must be used to finish the input for required fields for the run to avoid mistakes in data entry. For instructions, see [Get a configuration file in an Azure Stack deployment](azure-stack-vaas-parameters.md).

5. Run the tests.

6. When all tests have successfully completed, send the name of your Solution and package validation to [vaashelp@microsoft.com](mailto:vaashelp@microsoft.com) to request package signing.

## Next steps

- To learn more about [Azure Stack validation as a service](https://docs.microsoft.com/azure/azure-stack/partner).
