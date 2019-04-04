---
title: Validate original equipment manufacturer (OEM) packages in Azure Stack Validation as a Service | Microsoft Docs
description: Learn how to validate original equipment manufacturer (OEM) packages with Validation as a Service.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/11/2019
ms.author: mabrigg
ms.reviewer: johnhas
ms.lastreviewed: 03/11/2019

ROBOTS: NOINDEX

---

# Validate OEM packages

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

You can test a new OEM package when there has been a change to the firmware or drivers for a completed solution validation. When your package has passed the test, it is signed by Microsoft. Your test must contain the updated OEM extension package with the drivers and firmware that have passed Windows Server logo and PCS tests.

[!INCLUDE [azure-stack-vaas-workflow-validation-completion](includes/azure-stack-vaas-workflow-validation-completion.md)]

> [!IMPORTANT]
> Before uploading or submitting packages, review [Create an OEM package](azure-stack-vaas-create-oem-package.md) for the expected package format and contents.

## Managing packages for validation

When using the **Package Validation** workflow to validate a package, you will need to provide a URL to an **Azure Storage blob**. This blob is the test signed OEM package that will be installed as part of the update process. Create the blob using the Azure Storage Account you created during setup (see [Set up your Validation as a Service resources](azure-stack-vaas-set-up-resources.md)).

### Prerequisite: Provision a storage container

Create a container in your storage account for package blobs. This container can be used for all your Package Validation runs.

1. In the [Azure portal](https://portal.azure.com), go to the storage account created in [Set up your Validation as a Service resources](azure-stack-vaas-set-up-resources.md).

2. On the left blade under **Blob Service**, select **Containers**.

3. Select **+ Container** from the menu bar.
    1. Provide a name for the container, for example, `vaaspackages`.
    1. Select the desired access level for unauthenticated clients such as VaaS. For details on how to grant VaaS access to packages in each scenario, see [Handling container access level](#handling-container-access-level).

### Upload package to storage account

1. Prepare the package you want to validate. This is a `.zip` file whose contents must match the structure described in [Create an OEM package](azure-stack-vaas-create-oem-package.md).

    > [!NOTE]
    > Please ensure that the `.zip` contents are placed at the root of the `.zip` file. There should be no sub-folders in the package.

1. In the [Azure portal](https://portal.azure.com), select the package container and upload the package by selecting on **Upload** in the menu bar.

1. Select the package `.zip` file to upload. Keep defaults for **Blob type** (that is, **Block Blob**) and **Block size**.

### Generate package blob URL for VaaS

When creating a **Package Validation** workflow in the VaaS portal, you will need to provide a URL to the Azure Storage blob containing your package. Some *interactive* tests, including **Monthly AzureStack Update Verification** and **OEM Extension Package Verification**, also require a URL to package blobs.

#### Handling container access level

The minimum access level required by VaaS depends on whether you are creating a Package Validation workflow or scheduling an *interactive* test.

In the case of **Private** and **Blob** access levels, you must temporarily grant access to the package blob by giving VaaS a [shared access signature](https://docs.microsoft.com/en-us/azure/storage/common/storage-dotnet-shared-access-signature-part-1?) (SAS). The **Container** access level does not require you to generate SAS URLs, but allows unauthenticated access to the container and its blobs.

|Access level | Workflow requirement | Test requirement |
|---|---------|---------|
|Private | Generate a SAS URL per package blob ([Option 1](#option-1-generate-a-blob-sas-url)). | Generate a SAS URL at the account level and manually add the package blob name ([Option 2](#option-2-construct-a-container-sas-url)). |
|Blob | Provide the blob URL property ([Option 3](#option-3-grant-public-read-access)). | Generate a SAS URL at the account level and manually add the package blob name ([Option 2](#option-2-construct-a-container-sas-url)). |
|Container | Provide the blob URL property ([Option 3](#option-3-grant-public-read-access)). | Provide the blob URL property ([Option 3](#option-3-grant-public-read-access)).

The options for granting access to your packages are ordered from least access to greatest access.

#### Option 1: Generate a blob SAS URL

Use this option if the access level of your storage container is set to **Private**, where the container does not enable public read access to the container or its blobs.

> [!NOTE]
> This method will not work for *interactive* tests. See [Option 2: Construct a container SAS URL](#option-2-construct-a-container-sas-url).

1. In the [Azure portal](https://portal.azure.com/), go to your storage account, and navigate to the .zip containing your package.

2. Select **Generate SAS** from the context menu.

3. Select **Read** from **Permissions**.

4. Set **Start time** to the current time, and **End time** to at least 48 hours from **Start time**. If you will be creating other workflows with the same package, consider increasing **End time** for the length of your testing.

5. Select **Generate blob SAS token and URL**.

Use the **Blob SAS URL** when providing package blob URLs to the portal.

#### Option 2: Construct a container SAS URL

Use this option if the access level of your storage container is set to **Private** and you need to supply a package blob URL to an *interactive* test. This URL can also be used at the workflow level.

1. [!INCLUDE [azure-stack-vaas-sas-step_navigate](includes/azure-stack-vaas-sas-step_navigate.md)]

1. Select **Blob** from **Allowed Services options**. Deselect any remaining options.

1. Select **Container** and **Object** from **Allowed resource types**.

1. Select **Read** and **List** from **Allowed permissions**. Deselect any remaining options.

1. Select **Start time** as current time and **End time** to at least 14 days from **Start time**. If you will be running other tests with the same package, consider increasing **End time** for the length of your testing. Any tests scheduled through VaaS after **End time** will fail and a new SAS will need to be generated.

1. [!INCLUDE [azure-stack-vaas-sas-step_generate](includes/azure-stack-vaas-sas-step_generate.md)]
    The format should appear as follows:
    `https://storageaccountname.blob.core.windows.net/?sv=2016-05-31&ss=b&srt=co&sp=rl&se=2017-05-11T21:41:05Z&st=2017-05-11T13:41:05Z&spr=https`

1. Modify the generated SAS URL to include the package container, `{containername}`, and the name of your package blob, `{mypackage.zip}`, as follows:
    `https://storageaccountname.blob.core.windows.net/{containername}/{mypackage.zip}?sv=2016-05-31&ss=b&srt=co&sp=rl&se=2017-05-11T21:41:05Z&st=2017-05-11T13:41:05Z&spr=https`

    Use this value when providing package blob URLs to the portal.

#### Option 3: Grant public read access

Use this option if it is acceptable to allow unauthenticated clients access to individual blobs or, in the case of *interactive* tests, the container.

> [!CAUTION]
> This option opens up your blob(s) for anonymous read-only access.

1. Set the access level of the package container to **Blob** or **Container** by following the instructions in section [Grant anonymous users permissions to containers and blobs](https://docs.microsoft.com/azure/storage/storage-manage-access-to-resources#grant-anonymous-users-permissions-to-containers-and-blobs).

    > [!NOTE]
    > If you are providing a package URL to an *interactive* test, you must grant **full public read access** to the container to proceed with testing.

1. In the package container, select the package blob to open the properties pane.

1. Copy the **URL**. Use this value when providing package blob URLs to the portal.

## Create a Package Validation workflow

1. Sign in to the [VaaS portal](https://azurestackvalidation.com).

2. [!INCLUDE [azure-stack-vaas-workflow-step_select-solution](includes/azure-stack-vaas-workflow-step_select-solution.md)]

3. Select **Start** on the **Package Validation** tile.

    ![Package validations workflow tile](media/tile_validation-package.png)

4. [!INCLUDE [azure-stack-vaas-workflow-step_naming](includes/azure-stack-vaas-workflow-step_naming.md)]

5. Enter the Azure Storage blob URL to the test signed OEM package requiring a signature from Microsoft. For instructions, see [Generate package blob URL for VaaS](#generate-package-blob-url-for-vaas).

6. [!INCLUDE [azure-stack-vaas-workflow-step_upload-stampinfo](includes/azure-stack-vaas-workflow-step_upload-stampinfo.md)]

7. [!INCLUDE [azure-stack-vaas-workflow-step_test-params](includes/azure-stack-vaas-workflow-step_test-params.md)]

    > [!NOTE]
    > Environment parameters cannot be modified after creating a workflow.

8. [!INCLUDE [azure-stack-vaas-workflow-step_tags](includes/azure-stack-vaas-workflow-step_tags.md)]

9. [!INCLUDE [azure-stack-vaas-workflow-step_submit](includes/azure-stack-vaas-workflow-step_submit.md)]
    You will be redirected to the tests summary page.

## Required tests

The following tests are required for OEM package validation:

- OEM Extension Package Verification
- Cloud Simulation Engine

## Run Package Validation tests

1. In the **Package Validation tests summary** page, you will run a subset of the listed tests appropriate to your scenario.

    In the validation workflows, **scheduling** a test uses the workflow-level common parameters that you specified during workflow creation (see [Workflow common parameters for Azure Stack Validation as a Service](azure-stack-vaas-parameters.md)). If any of test parameter values become invalid, you must resupply them as instructed in [Modify workflow parameters](azure-stack-vaas-monitor-test.md#change-workflow-parameters).

    > [!NOTE]
    > Scheduling a validation test over an existing instance will create a new instance in place of the old instance in the portal. Logs for the old instance will be retained but are not accessible from the portal.  
    > Once a test has completed successfully, the **Schedule** action becomes disabled.

2. Select the agent that will run the test. For information about adding local test execution agents, see [Deploy the local agent](azure-stack-vaas-local-agent.md).

3. To complete OEM Extension Package Verification, select **Schedule** from the context menu to open a prompt for scheduling the test instance.

4. Review the test parameters and then select **Submit** to schedule OEM Extension Package Verification for execution.

    OEM Extension Package Verification is split into two manual steps: Azure Stack Update, and OEM Update.

   1. **Select** "Run" in the UI to execute the precheck script. This is an automated test that takes about 5 minutes to complete and requires no action.

   1. Once the precheck script has completed, perform the manual step: **install** the latest available Azure Stack update using the Azure Stack portal.

   1. **Run** Test-AzureStack on the stamp. If any failures occur, do not continue with the test and contact [vaashelp@microsoft.com](mailto:vaashelp@microsoft.com).

       For information on how to run the Test-AzureStack command, see [Validate Azure Stack system state](https://docs.microsoft.com/azure/azure-stack/azure-stack-diagnostic-test).

   1. **Select** "Next" to execute the postcheck script. This is an automated test and marks the end of the Azure Stack update process.

   1. **Select** "Run" to execute the precheck script for OEM Update.

   1. Once the precheck has completed, perform the manual step: **install** the OEM extension package through the portal.

   1. **Run** Test-AzureStack  on the stamp.

      > [!NOTE]
      > As before, do not continue with the test and contact [vaashelp@microsoft.com](mailto:vaashelp@microsoft.com) if it fails. This step is critical as it will save you a redeployment.

   1. **Select** "Next" to execute the postcheck script. This marks the end of the OEM update step.

   1. Answer any remaining questions at the end of the test and **select** "Submit".

   1. This marks the end of the interactive test.

5. Review the result for OEM Extension Package Verification. Once the test has succeeded, schedule Cloud Simulation Engine for execution.

To submit a package signing request, send [vaashelp@microsoft.com](mailto:vaashelp@microsoft.com) the Solution name and Package Validation name associated with this run.

## Next steps

- [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md)
